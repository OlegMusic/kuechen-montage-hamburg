/**
 * Blog comments Worker — Küchen-Montage Hamburg
 * Endpoints:
 *   GET  /comments?page=<url>      → public list (newest first, no IP exposed)
 *   POST /comments                 → {nick, text, platform, page, website(honeypot)}
 *   GET  /admin?key=<ADMIN_KEY>    → HTML moderation table (shows IP/country/city)
 *   POST /admin/delete?key=<KEY>   → {id}  (sets status='hidden')
 *   POST /admin/purge?key=<KEY>    → wipes IP column on rows older than 60 days (DSGVO retention)
 *
 * Bindings (wrangler.toml):
 *   DB        = D1 database
 *   ADMIN_KEY = secret (wrangler secret put ADMIN_KEY)
 *   ORIGIN    = allowed origin, e.g. https://kuechen-montage-hamburg.de
 */

const MAX_PER_IP_PER_HOUR = 5;
const NICK_MAX = 40;
const TEXT_MIN = 3;
const TEXT_MAX = 2000;

function cors(env) {
  const origin = (env && env.ORIGIN) || "https://kuechen-montage-hamburg.de";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, env, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors(env) },
  });
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(env) });
    }

    // ---------- PUBLIC: list ----------
    if (path === "/comments" && request.method === "GET") {
      const page = url.searchParams.get("page");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "200", 10), 500);
      let stmt;
      if (page) {
        stmt = env.DB.prepare(
          "SELECT id, nick, text, platform, created_at FROM comments WHERE status='visible' AND page=? ORDER BY created_at DESC LIMIT ?"
        ).bind(page, limit);
      } else {
        stmt = env.DB.prepare(
          "SELECT id, nick, text, platform, created_at FROM comments WHERE status='visible' ORDER BY created_at DESC LIMIT ?"
        ).bind(limit);
      }
      const { results } = await stmt.all();
      return json({ comments: results || [] }, env);
    }

    // ---------- PUBLIC: post ----------
    if (path === "/comments" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "bad json" }, env, 400); }

      // Honeypot — bots fill hidden "website" field. Pretend success, store nothing.
      if (body.website && String(body.website).trim() !== "") {
        return json({ ok: true }, env);
      }

      const nick = String(body.nick || "").trim().slice(0, NICK_MAX);
      const text = String(body.text || "").trim();
      const platform = String(body.platform || "").trim().slice(0, 40);
      const page = String(body.page || "").trim().slice(0, 300);

      if (nick.length < 1) return json({ error: "Bitte Nickname angeben." }, env, 400);
      if (text.length < TEXT_MIN) return json({ error: "Kommentar zu kurz." }, env, 400);
      if (text.length > TEXT_MAX) return json({ error: "Kommentar zu lang (max 2000 Zeichen)." }, env, 400);

      const ip = request.headers.get("CF-Connecting-IP") || "";
      const country = (request.cf && request.cf.country) || "";
      const city = (request.cf && request.cf.city) || "";
      const ua = (request.headers.get("User-Agent") || "").slice(0, 300);

      // Rate-limit per IP
      if (ip) {
        const since = new Date(Date.now() - 3600 * 1000).toISOString().replace("T", " ").slice(0, 19);
        const row = await env.DB.prepare(
          "SELECT COUNT(*) AS c FROM comments WHERE ip=? AND created_at > ?"
        ).bind(ip, since).first();
        if (row && row.c >= MAX_PER_IP_PER_HOUR) {
          return json({ error: "Zu viele Kommentare. Bitte später erneut versuchen." }, env, 429);
        }
      }

      await env.DB.prepare(
        "INSERT INTO comments (nick, text, platform, page, ip, country, city, user_agent) VALUES (?,?,?,?,?,?,?,?)"
      ).bind(nick, text, platform, page, ip, country, city, ua).run();

      return json({ ok: true }, env);
    }

    // ---------- ADMIN ----------
    const key = url.searchParams.get("key");
    const authed = env.ADMIN_KEY && key && key === env.ADMIN_KEY;

    if (path === "/admin" && request.method === "GET") {
      if (!authed) return new Response("Forbidden", { status: 403 });
      const { results } = await env.DB.prepare(
        "SELECT id, nick, text, platform, page, ip, country, city, created_at, status FROM comments ORDER BY created_at DESC LIMIT 1000"
      ).all();
      const rows = (results || []).map((r) => `
        <tr style="border-bottom:1px solid #ddd;${r.status === 'hidden' ? 'opacity:.4' : ''}">
          <td>${r.id}</td>
          <td><b>${esc(r.nick)}</b></td>
          <td>${esc(r.platform)}</td>
          <td style="max-width:380px">${esc(r.text)}</td>
          <td>${esc(r.country)} ${esc(r.city)}<br><small>${esc(r.ip)}</small></td>
          <td><small>${esc(r.created_at)}</small></td>
          <td>${esc(r.status)}</td>
          <td>
            <form method="POST" action="/admin/delete?key=${encodeURIComponent(key)}" style="margin:0">
              <input type="hidden" name="id" value="${r.id}">
              <button type="submit" style="background:#e23b33;color:#fff;border:0;padding:6px 10px;border-radius:6px;cursor:pointer">löschen</button>
            </form>
          </td>
        </tr>`).join("");
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Kommentar-Moderation</title>
        <style>body{font-family:system-ui,sans-serif;padding:20px;background:#faf7f2}table{border-collapse:collapse;width:100%;background:#fff;font-size:14px}th,td{padding:8px;text-align:left;vertical-align:top}th{background:#0c1b2a;color:#fff}</style>
        </head><body><h1>Kommentar-Moderation (${(results||[]).length})</h1>
        <table><tr><th>ID</th><th>Nick</th><th>Plattform</th><th>Text</th><th>Herkunft / IP</th><th>Datum</th><th>Status</th><th></th></tr>${rows}</table>
        </body></html>`;
      return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    if (path === "/admin/delete" && request.method === "POST") {
      if (!authed) return new Response("Forbidden", { status: 403 });
      let id;
      const ct = request.headers.get("Content-Type") || "";
      if (ct.includes("application/json")) {
        const b = await request.json(); id = b.id;
      } else {
        const f = await request.formData(); id = f.get("id");
      }
      if (!id) return new Response("missing id", { status: 400 });
      await env.DB.prepare("UPDATE comments SET status='hidden' WHERE id=?").bind(id).run();
      // For form posts, redirect back to admin
      if (!ct.includes("application/json")) {
        return new Response(null, { status: 302, headers: { Location: `/admin?key=${encodeURIComponent(key)}` } });
      }
      return json({ ok: true }, env);
    }

    // DSGVO retention: wipe IPs older than 60 days
    if (path === "/admin/purge" && request.method === "POST") {
      if (!authed) return new Response("Forbidden", { status: 403 });
      const cutoff = new Date(Date.now() - 60 * 86400 * 1000).toISOString().replace("T", " ").slice(0, 19);
      const res = await env.DB.prepare("UPDATE comments SET ip='', user_agent='' WHERE created_at < ? AND ip != ''").bind(cutoff).run();
      return json({ ok: true, purged: res.meta ? res.meta.changes : null }, env);
    }

    return new Response("Not found", { status: 404, headers: cors(env) });
  },
};
