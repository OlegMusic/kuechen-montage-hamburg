"""Schema.org + content E-E-A-T audit for kuechen-montage-hamburg.de."""
import json
import os
import re
import sys
from collections import defaultdict, Counter
from pathlib import Path

ROOT = Path(r"C:\Users\prusi\Desktop\3. Проекты\kuechen-montage-hamburg")
OUT = ROOT / "audit-2026-04-24"

# ----- 1. Collect all HTML files -----
html_files = []
# Skip these dirs entirely
SKIP_DIRS = {"backend", "node_modules", ".git", "foto", "img", "css", "js", "gsc-data", "audit-2026-04-24"}
for dirpath, dirnames, filenames in os.walk(ROOT):
    # prune
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fn in filenames:
        if fn.lower().endswith((".html", ".htm")):
            html_files.append(Path(dirpath) / fn)

print(f"[info] HTML files found: {len(html_files)}", file=sys.stderr)

# ----- 2. JSON-LD extraction -----
JSONLD_RE = re.compile(
    r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE,
)

def extract_jsonld(path):
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        return [{"error": f"read fail: {e}"}]
    blocks = JSONLD_RE.findall(text)
    out = []
    for raw in blocks:
        stripped = raw.strip()
        try:
            data = json.loads(stripped)
            out.append({"ok": True, "data": data, "raw_len": len(stripped)})
        except json.JSONDecodeError as e:
            out.append({"ok": False, "error": str(e), "raw": stripped[:200]})
    return out

def iter_types(data):
    """Yield every @type found (handles @graph, arrays, nested)."""
    if isinstance(data, dict):
        t = data.get("@type")
        if t:
            if isinstance(t, list):
                for x in t:
                    yield x
            else:
                yield t
        if "@graph" in data and isinstance(data["@graph"], list):
            for sub in data["@graph"]:
                yield from iter_types(sub)
        # Shallow nested scan for provider/about/mainEntity
        for key in ("provider", "about", "mainEntity", "itemReviewed"):
            if key in data and isinstance(data[key], (dict, list)):
                yield from iter_types(data[key])
    elif isinstance(data, list):
        for item in data:
            yield from iter_types(item)

def find_nodes(data, type_name):
    """Return all nodes whose @type matches (in @graph or top)."""
    found = []
    def walk(node):
        if isinstance(node, dict):
            t = node.get("@type")
            types = t if isinstance(t, list) else [t] if t else []
            if type_name in types:
                found.append(node)
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for x in node:
                walk(x)
    walk(data)
    return found

pages = []  # {rel, types, blocks, parse_errors}
type_to_pages = defaultdict(list)
parse_errors = []

for p in html_files:
    rel = str(p.relative_to(ROOT)).replace("\\", "/")
    blocks = extract_jsonld(p)
    types_here = []
    for b in blocks:
        if not b.get("ok"):
            parse_errors.append({"page": rel, "error": b.get("error"), "raw": b.get("raw", "")[:120]})
            continue
        for t in iter_types(b["data"]):
            types_here.append(t)
    for t in set(types_here):
        type_to_pages[t].append(rel)
    pages.append({"rel": rel, "types": types_here, "blocks": blocks})

# ----- 3. LocalBusiness analysis -----
LB_TYPES = {"LocalBusiness", "HomeAndConstructionBusiness", "Electrician", "Plumber",
            "GeneralContractor", "Organization", "ProfessionalService", "Store"}
localbiz_report = []
for page in pages:
    for b in page["blocks"]:
        if not b.get("ok"):
            continue
        for lb_t in LB_TYPES:
            nodes = find_nodes(b["data"], lb_t)
            for n in nodes:
                addr = n.get("address") or {}
                if isinstance(addr, list) and addr:
                    addr = addr[0]
                geo = n.get("geo")
                hrs = n.get("openingHours") or n.get("openingHoursSpecification")
                localbiz_report.append({
                    "page": page["rel"],
                    "type": lb_t,
                    "name": n.get("name"),
                    "telephone": n.get("telephone"),
                    "priceRange": n.get("priceRange"),
                    "locality": (addr or {}).get("addressLocality") if isinstance(addr, dict) else None,
                    "streetAddress": (addr or {}).get("streetAddress") if isinstance(addr, dict) else None,
                    "postalCode": (addr or {}).get("postalCode") if isinstance(addr, dict) else None,
                    "country": (addr or {}).get("addressCountry") if isinstance(addr, dict) else None,
                    "geo": bool(geo),
                    "areaServed": bool(n.get("areaServed")),
                    "openingHours": bool(hrs),
                    "hasMap": bool(n.get("hasMap")),
                    "url": n.get("url"),
                    "image": bool(n.get("image")),
                    "aggregateRating": n.get("aggregateRating"),
                })

# ----- 4. Service schema check on 14 commercial URLs -----
# Based on repo listing, "short commercial" URLs (directories ending with -hamburg/)
commercial_dirs = [
    "waschmaschine-anschliessen-hamburg",
    "spueltischarmatur-einbau-hamburg",
    "kuechenspuele-montage-hamburg",
    "geschirrspueler-anschliessen-hamburg",
    "trockner-anschliessen-hamburg",
    "elektroherd-anschliessen-hamburg",
    "ceranfeld-anschliessen-hamburg",
    "induktionskochfeld-anschliessen-hamburg",
    "kochfeld-installieren-hamburg",
    "starkstromdose-installieren-hamburg",
    "power-splitter-installieren-hamburg",
    "armatur-austauschen-hamburg",
    "waschbecken-installieren-hamburg",
    "y-stueck-wasserzulauf-installieren-hamburg",
]
service_report = []
for slug in commercial_dirs:
    rel = f"{slug}/index.html"
    page = next((p for p in pages if p["rel"] == rel), None)
    if not page:
        service_report.append({"slug": slug, "status": "PAGE MISSING"})
        continue
    has_service = False
    has_provider_lb = False
    srv_details = []
    for b in page["blocks"]:
        if not b.get("ok"):
            continue
        for s in find_nodes(b["data"], "Service"):
            has_service = True
            prov = s.get("provider")
            if isinstance(prov, dict):
                pt = prov.get("@type")
                pt_list = pt if isinstance(pt, list) else [pt] if pt else []
                if any(x in LB_TYPES for x in pt_list):
                    has_provider_lb = True
            srv_details.append({
                "name": s.get("name"),
                "areaServed": s.get("areaServed"),
                "provider_type": prov.get("@type") if isinstance(prov, dict) else None,
                "offers": bool(s.get("offers")),
            })
    service_report.append({
        "slug": slug,
        "status": "OK" if has_service else "MISSING Service",
        "has_provider_lb": has_provider_lb,
        "types_on_page": list(set(page["types"])),
        "services": srv_details,
    })

# ----- 5. FAQPage analysis on index.html -----
home = next((p for p in pages if p["rel"] == "index.html"), None)
faq_home = {"found": False, "questions": 0, "sample": [], "structure_ok": False}
if home:
    for b in home["blocks"]:
        if not b.get("ok"):
            continue
        for n in find_nodes(b["data"], "FAQPage"):
            faq_home["found"] = True
            me = n.get("mainEntity") or []
            if not isinstance(me, list):
                me = [me]
            faq_home["questions"] = len(me)
            q_struct_ok = all(
                isinstance(q, dict)
                and "Question" in (q.get("@type") if isinstance(q.get("@type"), list) else [q.get("@type")])
                and q.get("name")
                and isinstance(q.get("acceptedAnswer"), dict)
                and q["acceptedAnswer"].get("text")
                for q in me
            )
            faq_home["structure_ok"] = q_struct_ok
            faq_home["sample"] = [q.get("name", "") for q in me[:5] if isinstance(q, dict)]

# ----- 6. HowTo analysis on /montage-und-installation/* -----
howto_report = []
mui_dir = ROOT / "montage-und-installation"
for sub in sorted(mui_dir.iterdir()) if mui_dir.exists() else []:
    if not sub.is_dir():
        continue
    idx = sub / "index.html"
    if not idx.exists():
        continue
    rel = str(idx.relative_to(ROOT)).replace("\\", "/")
    page = next((p for p in pages if p["rel"] == rel), None)
    info = {"slug": sub.name, "rel": rel, "has_howto": False, "steps": 0,
            "has_totalTime": False, "has_supply": False, "has_tool": False, "has_image": False}
    if page:
        for b in page["blocks"]:
            if not b.get("ok"):
                continue
            for n in find_nodes(b["data"], "HowTo"):
                info["has_howto"] = True
                steps = n.get("step") or []
                if not isinstance(steps, list):
                    steps = [steps]
                info["steps"] = len(steps)
                info["has_totalTime"] = bool(n.get("totalTime"))
                info["has_supply"] = bool(n.get("supply"))
                info["has_tool"] = bool(n.get("tool"))
                info["has_image"] = bool(n.get("image"))
                info["name"] = n.get("name")
                info["estimatedCost"] = n.get("estimatedCost")
    howto_report.append(info)

# ----- 7. AggregateRating collection -----
agg_report = []
for page in pages:
    for b in page["blocks"]:
        if not b.get("ok"):
            continue
        for n in find_nodes(b["data"], "AggregateRating"):
            agg_report.append({
                "page": page["rel"],
                "ratingValue": n.get("ratingValue"),
                "reviewCount": n.get("reviewCount"),
                "ratingCount": n.get("ratingCount"),
                "bestRating": n.get("bestRating"),
            })

# ----- 8. Content E-E-A-T for 5 key pages -----
KEY_PAGES = [
    "index.html",
    "waschmaschine-anschliessen-hamburg/index.html",
    "kuechenspuele-montage-hamburg/index.html",
    "montage-und-installation/waschmaschine-anschliessen/index.html",
    "pages/services/ikea-kuechenmontage-hamburg.html",
]

TAG_RE = re.compile(r"<[^>]+>")
SCRIPT_STYLE_RE = re.compile(r"<(script|style)[^>]*>.*?</\1>", re.DOTALL | re.IGNORECASE)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.DOTALL | re.IGNORECASE)
A_RE = re.compile(r'<a[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', re.DOTALL | re.IGNORECASE)
IMG_RE = re.compile(r"<img[^>]*>", re.IGNORECASE)
ATTR_RE = lambda name: re.compile(rf'{name}=["\']([^"\']*)["\']', re.IGNORECASE)

def strip_html_to_text(html):
    html = SCRIPT_STYLE_RE.sub(" ", html)
    html = TAG_RE.sub(" ", html)
    html = re.sub(r"&[a-zA-Z#0-9]+;", " ", html)
    html = re.sub(r"\s+", " ", html)
    return html.strip()

def count_words(text):
    # German-friendly: split by non-word chars, keep umlauts
    words = re.findall(r"[A-Za-zÄÖÜäöüß]+", text)
    return len(words)

def analyse_page(rel):
    p = ROOT / rel
    if not p.exists():
        return {"rel": rel, "error": "missing"}
    raw = p.read_text(encoding="utf-8", errors="replace")
    text = strip_html_to_text(raw)
    wc = count_words(text)
    h1s = [strip_html_to_text(h) for h in H1_RE.findall(raw)]
    links_raw = A_RE.findall(raw)
    internal = []
    external = []
    for href, anchor in links_raw:
        href_l = href.strip().lower()
        if href_l.startswith(("http://", "https://")):
            if "kuechen-montage-hamburg" in href_l:
                internal.append(href)
            else:
                external.append(href)
        elif href_l.startswith(("mailto:", "tel:", "javascript:", "#")):
            pass
        else:
            internal.append(href)
    # Trust signals
    raw_lower = raw.lower()
    text_lower = text.lower()
    trust = {
        "18_jahre": bool(re.search(r"\b18\s*[\- ]?\s*jahr", text_lower)),
        "meisterbetrieb": "meisterbetrieb" in text_lower,
        "handwerkskammer": "handwerkskammer" in text_lower or "hwk" in text_lower,
        "festpreis": "festpreis" in text_lower or "ab 49" in text_lower or "ab 49" in text_lower,
        "garantie": "garantie" in text_lower or "gewährleistung" in text_lower,
        "whatsapp": "whatsapp" in raw_lower or "wa.me" in raw_lower,
        "telefon": bool(re.search(r"tel:[+\d]", raw_lower)) or bool(re.search(r"\+49[\s\-]?\d", text)),
        "impressum_link": "impressum" in raw_lower,
        "datenschutz_link": "datenschutz" in raw_lower,
    }
    # Images
    imgs = IMG_RE.findall(raw)
    alt_pat = ATTR_RE("alt")
    src_pat = ATTR_RE("src")
    has_hero = False
    hamburg_alt_count = 0
    alts = []
    for img in imgs:
        alt_m = alt_pat.search(img)
        src_m = src_pat.search(img)
        alt_txt = alt_m.group(1) if alt_m else ""
        src_txt = src_m.group(1) if src_m else ""
        alts.append(alt_txt)
        if "hamburg" in alt_txt.lower():
            hamburg_alt_count += 1
        # Hero heuristic: first 3 images or class="hero"
        if "hero" in img.lower():
            has_hero = True
    if not has_hero and imgs:
        has_hero = True  # at least one image present above-the-fold assumption
    return {
        "rel": rel,
        "word_count": wc,
        "h1_count": len(h1s),
        "h1s": h1s,
        "h1_has_hamburg": any("hamburg" in h.lower() for h in h1s) if h1s else False,
        "internal_links": len(internal),
        "external_links": len(external),
        "trust": trust,
        "img_total": len(imgs),
        "img_with_alt": sum(1 for a in alts if a.strip()),
        "img_hamburg_alt": hamburg_alt_count,
        "has_hero": has_hero,
    }

key_page_report = [analyse_page(k) for k in KEY_PAGES]

# ----- Assemble report -----
type_distribution = {t: len(set(pgs)) for t, pgs in type_to_pages.items()}

report = {
    "total_html": len(html_files),
    "parse_errors": parse_errors,
    "type_distribution": type_distribution,
    "type_to_pages": {t: sorted(set(pgs))[:15] for t, pgs in type_to_pages.items()},
    "localbusiness": localbiz_report,
    "service_commercial": service_report,
    "faq_home": faq_home,
    "howto": howto_report,
    "aggregaterating": agg_report,
    "key_pages": key_page_report,
}

(OUT / "_audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({
    "total_html": report["total_html"],
    "parse_errors_n": len(parse_errors),
    "type_distribution": type_distribution,
    "lb_count": len(localbiz_report),
    "svc_ok": sum(1 for s in service_report if s.get("status") == "OK"),
    "svc_total": len(service_report),
    "faq_home": {"found": faq_home["found"], "q": faq_home["questions"], "ok": faq_home["structure_ok"]},
    "howto_count": sum(1 for h in howto_report if h["has_howto"]),
    "howto_total": len(howto_report),
    "agg_count": len(agg_report),
}, ensure_ascii=False, indent=2))
