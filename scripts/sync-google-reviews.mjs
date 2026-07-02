/**
 * Daily Google reviews sync for kuechen-montage-hamburg.de.
 *
 * ONE Places API call/day fetches the live Google rating + review count + up to
 * 5 review texts, then writes them into the STATIC HTML (per project SEO rule:
 * fetch build-side, write only the result into HTML — no client-side JS) and
 * git-pushes → GitHub Pages = live.
 *
 * Two things it maintains:
 *  1) Site-wide: schema ratingValue/reviewCount + visible count/rating text.
 *  2) Pilot pages (PILOT): a Product + aggregateRating + review[] JSON-LD block
 *     AND visible review cards, regenerated between the markers
 *     <!-- GBP-REVIEWS:START --> … <!-- GBP-REVIEWS:END -->. This Product+review
 *     markup is what makes Google show star rich results in the SERP (reverse-
 *     engineered from competitor mein-klempner.hamburg). Reviews are the REAL
 *     Google reviews, entity linked to the verified GBP via sameAs (cid).
 *
 * Source key: GOOGLE_PLACES_API_KEY in ../seo-monitor/.env (server-side, never HTML).
 * Place: placeid ChIJjScstGyJsUcRNCX4r6ygI6c ("Küchenmontage Hamburg").
 *
 * Run (preview):        node scripts/sync-google-reviews.mjs
 * Run (apply+deploy):   node scripts/sync-google-reviews.mjs --apply
 * Force (ignore daily guard, manual test): add --force
 *
 * COST RULE: exactly ONE Places call/day (day-marker guard, --force bypasses).
 * 1 call/day ≈ $0 inside the $200/mo free credit.
 * Safety: no-op when unchanged; never writes on API failure/empty; refuses a
 * review-count drop larger than DROP_GUARD (likely glitch).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const PLACE_ID = 'ChIJjScstGyJsUcRNCX4r6ygI6c';
const ENV_PATH = path.resolve(REPO, '..', 'seo-monitor', '.env');
const DAY_MARKER = path.resolve(REPO, '..', '.kuechen-reviews-sync-last');
const CID = 'https://maps.google.com/?cid=12043646492065932596';
const REVIEWS_URL = 'https://www.google.com/search?q=PRULOG+Rezensionen&tbm=lcl&hl=de-DE&rldimm=12043646492065932596#lkt=LocalPoiReviews';
const DROP_GUARD = 5;
const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');
const NOGIT = process.argv.includes('--no-git'); // write files but skip commit/push (local review)
const ROLLOUT = process.argv.includes('--rollout'); // insert markers into all content pages (one-time)

const FALLBACK_IMG = 'https://kuechen-montage-hamburg.de/img/profile/profile.webp';
// Never put review stars on legal/utility pages.
const EXCLUDE = /impressum|datenschutz|agb|privacy|404|danke|thank/i;

// Per-page Product meta, derived from the page's own <title>/OG tags.
function deriveMeta(html) {
  const og = (p) => {
    const m = html.match(new RegExp(`<meta[^>]+property=["']og:${p}["'][^>]+content=["']([^"']+)["']`, 'i'))
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${p}["']`, 'i'));
    return m ? m[1] : '';
  };
  const title = og('title') || (html.match(/<title>([^<]+)<\/title>/i) || [])[1] || '';
  const name = (title.split(/[|–—·]/)[0] || '').trim() || 'Küchenmontage Hamburg';
  const image = og('image') || FALLBACK_IMG;
  const description = (og('description') || (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || [])[1] || name).trim();
  // Entry price from the page's OWN "ab N€" text (min of all), so the Offer is accurate, not invented.
  const prices = [...html.matchAll(/\bab\s*(\d{2,4})\s*€/gi)].map((m) => Number(m[1])).filter((n) => n >= 20 && n <= 5000);
  const price = prices.length ? String(Math.min(...prices)) : '';
  const url = og('url') || (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1] || '';
  return { name, image, description, price, url };
}

const log = (m) => console.log(`[reviews-sync] ${m}`);
const today = () => new Date().toISOString().slice(0, 10);
const ranToday = () => { try { return fs.readFileSync(DAY_MARKER, 'utf8').trim() === today(); } catch { return false; } };
const markToday = () => { try { fs.writeFileSync(DAY_MARKER, today()); } catch {} };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function readEnv(file, key) {
  try {
    const l = fs.readFileSync(file, 'utf8').split(/\r?\n/).find((x) => x.startsWith(key + '='));
    return l ? l.slice(key.length + 1).trim() : '';
  } catch { return ''; }
}

async function fetchGoogle(key) {
  const u = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}` +
    `&fields=name,rating,user_ratings_total,reviews&reviews_sort=newest&language=de&key=${key}`;
  const b = await (await fetch(u)).json();
  if (b.status !== 'OK') throw new Error(`Places status ${b.status} ${b.error_message || ''}`);
  const rating = Number(b.result.rating), count = Number(b.result.user_ratings_total);
  if (!Number.isFinite(rating) || !Number.isFinite(count) || count <= 0) throw new Error(`empty rating=${rating} count=${count}`);
  const reviews = (b.result.reviews || [])
    .filter((r) => (r.text || '').trim().length > 12 && Number(r.rating) >= 4)
    .map((r) => ({ author: r.author_name, date: new Date(r.time * 1000).toISOString().slice(0, 10), rating: Number(r.rating), text: r.text.replace(/\s+/g, ' ').trim() }))
    .slice(0, 5);
  return { name: b.result.name, rating, count, reviews };
}

function readCurrent() {
  const h = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8');
  const rc = h.match(/"reviewCount":\s*"(\d+)"/), rv = h.match(/"ratingValue":\s*"([\d.]+)"/);
  return { count: rc ? Number(rc[1]) : null, rating: rv ? Number(rv[1]) : null };
}

function listHtml(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listHtml(p, out); else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// Site-wide numbers (schema + visible text). Returns changed relative paths.
function updateNumbers(count, rating) {
  const dot = rating.toFixed(1), comma = dot.replace('.', ',');
  const changed = [];
  for (const file of listHtml(REPO)) {
    const s = fs.readFileSync(file, 'utf8');
    const o = s
      .replace(/("reviewCount":\s*")\d+(")/g, `$1${count}$2`)
      .replace(/("ratingCount":\s*")\d+(")/g, `$1${count}$2`)
      .replace(/("ratingValue":\s*")[\d.]+(")/g, `$1${dot}$2`)
      .replace(/\b\d+( (?:echte )?Bewertungen bei\b)/g, `${count}$1`)
      .replace(/\b\d+( Google-Rezensionen)/g, `${count}$1`)
      .replace(/\b\d+( Google-Bewertungen)/g, `${count}$1`)
      .replace(/(<b id="google-rating">)[\d,]+/g, `$1${comma}`)
      .replace(/★ [\d,]+ —/g, `★ ${comma} —`)
      .replace(/★ [\d,]+ \/ 5/g, `★ ${comma} / 5`)
      .replace(/\b[\d,]+( auf Google)/g, `${comma}$1`);
    if (o !== s) { if (APPLY) fs.writeFileSync(file, o); changed.push(path.relative(REPO, file)); }
  }
  return changed;
}

// Product + aggregateRating + review[] JSON-LD  +  visible cards, between markers.
function buildBlock(meta, rating, count, reviews) {
  const dot = rating.toFixed(1), comma = dot.replace('.', ',');
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: meta.name, image: meta.image,
    description: meta.description,
    brand: { '@type': 'Brand', name: 'Küchenmontage Hamburg' },
    sameAs: CID, '@id': CID,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: dot, bestRating: '5', worstRating: '1', ratingCount: String(count), reviewCount: String(count) },
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date,
      reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5', worstRating: '1' },
      reviewBody: r.text,
    })),
  };
  // Offer: accurate entry price taken from the page's own "ab N€" (makes it a full Product).
  if (meta.price) {
    ld.offers = {
      '@type': 'Offer',
      price: meta.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: `${new Date().getUTCFullYear() + 1}-12-31`,
      ...(meta.url ? { url: meta.url } : {}),
    };
  }
  const stars = '★★★★★';
  const cards = reviews.map((r) => `
      <article style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px;max-width:340px">
        <div style="color:#f59e0b;font-size:16px;margin-bottom:6px">${stars.slice(0, r.rating)}<span style="color:#e5e7eb">${stars.slice(r.rating)}</span></div>
        <p style="font-style:italic;color:#1e293b;margin:0 0 10px;line-height:1.5;font-size:14px">„${esc(r.text)}"</p>
        <div style="font-size:12px;color:#64748b"><strong>${esc(r.author)}</strong> · <a href="${esc(REVIEWS_URL)}" target="_blank" rel="nofollow noopener" style="color:#64748b">Google-Rezension</a> · ${r.date}</div>
      </article>`).join('');
  return `<!-- GBP-REVIEWS:START (auto-generated by scripts/sync-google-reviews.mjs — do not edit by hand) -->
<script type="application/ld+json">
${JSON.stringify(ld)}
</script>
<section aria-label="Google-Bewertungen" style="padding:8px 16px 0">
  <p style="text-align:center;margin:0 0 16px;font-size:14px;color:#64748b">★ <strong>${comma} auf Google</strong> · <a href="${esc(REVIEWS_URL)}" target="_blank" rel="nofollow noopener" style="color:inherit;font-weight:600">${count} echte Google-Rezensionen</a></p>
  <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center">${cards}
  </div>
</section>
<!-- GBP-REVIEWS:END -->`;
}

// Prepend/refresh an "⭐ 5,0 (18) · " emoji-star + live count in the page's
// <meta name="description"> so a star shows in the SERP snippet (independent of
// Google's rich-result decision — like the MyHammer "⭐" trick). Idempotent: an
// existing "⭐ …· " prefix is stripped and rewritten with today's count.
function updateMetaStar(s, count, rating) {
  const comma = rating.toFixed(1).replace('.', ',');
  const prefix = `⭐ ${comma} (${count}) · `;
  return s.replace(
    /(<meta\s+name=["']description["']\s+content=["'])(?:⭐[^·]*·\s*)?/i,
    `$1${prefix}`,
  );
}

// One-time: insert empty GBP-REVIEWS markers into every eligible content page
// (has OG image, not a legal/utility page), before <footer> (else before </body>).
function insertMarkers() {
  const done = [];
  for (const file of listHtml(REPO)) {
    const rel = path.relative(REPO, file);
    if (EXCLUDE.test(rel)) continue;
    const s = fs.readFileSync(file, 'utf8');
    if (/GBP-REVIEWS:START/.test(s)) continue;
    if (!/og:image/i.test(s)) continue;
    const markers = '\n  <!-- GBP-REVIEWS:START -->\n  <!-- GBP-REVIEWS:END -->\n';
    let o;
    if (/<footer\b/i.test(s)) o = s.replace(/<footer\b/i, markers + '  <footer');
    else if (/<\/body>/i.test(s)) o = s.replace(/<\/body>/i, markers + '</body>');
    else continue;
    if (o !== s) { if (APPLY) fs.writeFileSync(file, o); done.push(rel); }
  }
  return done;
}

function git(c) { return execSync(`git ${c}`, { cwd: REPO, encoding: 'utf8' }); }

async function main() {
  const key = readEnv(ENV_PATH, 'GOOGLE_PLACES_API_KEY');
  if (!key) throw new Error(`GOOGLE_PLACES_API_KEY not found in ${ENV_PATH}`);
  if (ranToday() && !FORCE) { log(`Already synced today (${today()}) — skip API call. --force to override.`); return; }

  const g = await fetchGoogle(key);
  markToday();
  const cur = readCurrent();
  log(`Google: ${g.rating}★ · ${g.count} reviews · ${g.reviews.length} texts  |  Site: ${cur.rating}★ · ${cur.count}  (${APPLY ? 'APPLY' : 'dry-run'})`);

  if (cur.count != null && g.count < cur.count - DROP_GUARD) { log(`WARN: count ${cur.count}→${g.count} drop >${DROP_GUARD} — likely glitch, skip.`); return; }
  if (g.reviews.length < 2) { log(`WARN: only ${g.reviews.length} usable review texts — skip block, numbers only.`); }

  let rolledOut = [];
  if (ROLLOUT) { rolledOut = insertMarkers(); log(`rollout: markers added to ${rolledOut.length} page(s)`); }

  const numChanged = updateNumbers(g.count, g.rating);

  // Refresh the Product+review block on EVERY page that has the markers.
  let blockChanged = [];
  if (g.reviews.length >= 2) {
    for (const file of listHtml(REPO)) {
      const s = fs.readFileSync(file, 'utf8');
      if (!/GBP-REVIEWS:START/.test(s)) continue;
      let o = s.replace(/<!-- GBP-REVIEWS:START[\s\S]*?<!-- GBP-REVIEWS:END -->/, buildBlock(deriveMeta(s), g.rating, g.count, g.reviews));
      o = updateMetaStar(o, g.count, g.rating); // ⭐ 5,0 (N) · in meta description (live count)
      if (o !== s) { if (APPLY) fs.writeFileSync(file, o); blockChanged.push(path.relative(REPO, file)); }
    }
  }
  const total = new Set([...numChanged, ...blockChanged]);
  log(`numbers: ${numChanged.length} · review-block: ${blockChanged.length} page(s) · total ${total.size}`);

  if (!APPLY) { log('dry-run: nothing written. Re-run with --apply.'); return; }
  if (!total.size) { log('No change.'); return; }
  if (NOGIT) { log(`--no-git: ${total.size} file(s) written locally, NOT committed/pushed. Review, then deploy.`); return; }

  git('add -u');
  git(`commit -m "Google-Bewertungen auto-sync: ${g.rating}/${g.count} (+Product/review block)"`);
  git('push');
  log(`Deployed ${g.rating}/${g.count} → GitHub Pages.`);
}

main().catch((e) => { console.error(`[reviews-sync] ERROR: ${e.message}`); process.exit(1); });
