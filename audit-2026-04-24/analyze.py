#!/usr/bin/env python3
"""Technical SEO audit analyzer for kuechen-montage-hamburg."""
import os
import re
from pathlib import Path
from collections import defaultdict, Counter

ROOT = Path(r"C:\Users\prusi\Desktop\3. Проекты\kuechen-montage-hamburg")
SITE = "https://kuechen-montage-hamburg.de"

# Collect all HTML files
html_files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    # Skip audit folder, .git, backend, gsc-data
    parts = Path(dirpath).relative_to(ROOT).parts
    if parts and parts[0] in {".git", "audit-2026-04-24", "backend", "gsc-data", "foto", "img", "css", "js", ".claude"}:
        continue
    for fn in filenames:
        if fn.lower().endswith(".html"):
            html_files.append(Path(dirpath) / fn)

print(f"=== TOTAL HTML FILES FOUND: {len(html_files)} ===\n")

CANON_RE = re.compile(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', re.IGNORECASE)
CANON_RE2 = re.compile(r'<link[^>]*href=["\']([^"\']+)["\'][^>]*rel=["\']canonical["\']', re.IGNORECASE)
ROBOTS_RE = re.compile(r'<meta[^>]*name=["\']robots["\'][^>]*content=["\']([^"\']+)["\']', re.IGNORECASE)
ROBOTS_RE2 = re.compile(r'<meta[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']robots["\']', re.IGNORECASE)
VIEWPORT_RE = re.compile(r'<meta[^>]*name=["\']viewport["\']', re.IGNORECASE)
REFRESH_RE = re.compile(r'<meta[^>]*http-equiv=["\']refresh["\'][^>]*content=["\']([^"\']+)["\']', re.IGNORECASE)
HREFLANG_RE = re.compile(r'<link[^>]*hreflang=', re.IGNORECASE)
LANG_RE = re.compile(r'<html[^>]*lang=["\']([^"\']+)["\']', re.IGNORECASE)

def rel_url(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    return f"/{rel}"

def canonical_of(html: str):
    m = CANON_RE.search(html) or CANON_RE2.search(html)
    return m.group(1) if m else None

def robots_of(html: str):
    m = ROBOTS_RE.search(html) or ROBOTS_RE2.search(html)
    return m.group(1) if m else None

def has_viewport(html: str) -> bool:
    return bool(VIEWPORT_RE.search(html))

def has_refresh(html: str):
    m = REFRESH_RE.search(html)
    return m.group(1) if m else None

def has_hreflang(html: str) -> bool:
    return bool(HREFLANG_RE.search(html))

def html_lang(html: str):
    m = LANG_RE.search(html)
    return m.group(1) if m else None

results = []
for p in html_files:
    try:
        with open(p, "r", encoding="utf-8", errors="replace") as f:
            html = f.read()
    except Exception as e:
        results.append({"path": rel_url(p), "error": str(e)})
        continue
    results.append({
        "path": rel_url(p),
        "file_path": str(p),
        "size": p.stat().st_size,
        "canonical": canonical_of(html),
        "robots": robots_of(html),
        "viewport": has_viewport(html),
        "refresh": has_refresh(html),
        "hreflang": has_hreflang(html),
        "lang": html_lang(html),
    })

# Stats
n_total = len(results)
n_no_canon = sum(1 for r in results if not r.get("canonical"))
n_with_canon = n_total - n_no_canon
n_self_canon = 0
n_cross_canon = 0
cross_details = []
for r in results:
    if not r.get("canonical"): continue
    path = r["path"]
    canon = r["canonical"]
    # What would the self-URL be on the live site?
    # For index.html inside dir -> / (dir path with /)
    path_for_url = path
    if path.endswith("/index.html"):
        path_for_url = path[:-len("index.html")]
    self_url = SITE + path_for_url
    # Normalize: canonical may be to dir with trailing slash or without
    if canon.rstrip("/") == self_url.rstrip("/"):
        n_self_canon += 1
    else:
        n_cross_canon += 1
        cross_details.append({"file": path, "canonical": canon})

n_viewport = sum(1 for r in results if r.get("viewport"))
n_no_viewport = n_total - n_viewport
n_hreflang = sum(1 for r in results if r.get("hreflang"))
n_refresh = sum(1 for r in results if r.get("refresh"))

# Robots meta breakdown
robots_counter = Counter()
noindex_pages = []
for r in results:
    rb = r.get("robots")
    if rb:
        robots_counter[rb.lower().strip()] += 1
        if "noindex" in rb.lower():
            noindex_pages.append(r["path"])

# Language stats
lang_counter = Counter(r.get("lang") for r in results)

# Trailing slash / uppercase / query string checks (on file paths)
upper_paths = [r["path"] for r in results if any(c.isupper() for c in r["path"])]

print(f"Total HTML files: {n_total}")
print(f"Without canonical: {n_no_canon}")
print(f"With canonical: {n_with_canon}")
print(f"  self-canonical: {n_self_canon}")
print(f"  cross-canonical: {n_cross_canon}")
print(f"Meta viewport present: {n_viewport}/{n_total}; missing: {n_no_viewport}")
print(f"Meta refresh pages: {n_refresh}")
print(f"Hreflang tags: {n_hreflang}")
print(f"HTML lang distribution: {dict(lang_counter)}")
print(f"Uppercase paths: {len(upper_paths)}")
print()
print("Robots meta values:")
for v, c in robots_counter.most_common():
    print(f"  {c:4d}  {v}")
print()
print(f"Noindex pages: {len(noindex_pages)}")
for np in noindex_pages:
    print(f"  - {np}")

print("\n=== PAGES WITHOUT CANONICAL ===")
for r in results:
    if not r.get("canonical"):
        print(f"  {r['path']}  (size={r.get('size', '?')})")

print("\n=== PAGES WITHOUT VIEWPORT ===")
for r in results:
    if not r.get("viewport"):
        print(f"  {r['path']}  (size={r.get('size', '?')})")

print("\n=== META REFRESH PAGES (soft redirects) ===")
for r in results:
    if r.get("refresh"):
        print(f"  {r['path']}  -> {r['refresh']!r}  canonical={r.get('canonical')}")

print("\n=== CROSS-CANONICAL PAGES (canonical != self) ===")
for cd in cross_details:
    print(f"  FILE: {cd['file']}")
    print(f"  CANON: {cd['canonical']}\n")

# Focus: the 3 problem pairs
print("\n=== DETAILED CHECK: altona / harburg / wandsbek PAIRS ===")
pairs = [("altona.html", "pages/stadtteile/altona.html"),
         ("harburg.html", "pages/stadtteile/harburg.html"),
         ("wandsbek.html", "pages/stadtteile/wandsbek.html")]
for root_rel, nested_rel in pairs:
    root_match = next((r for r in results if r["path"] == "/" + root_rel), None)
    nested_match = next((r for r in results if r["path"] == "/" + nested_rel), None)
    print(f"\n-- PAIR: /{root_rel}  vs  /{nested_rel}")
    if root_match:
        print(f"   ROOT /{root_rel}:")
        print(f"      size      = {root_match['size']} bytes")
        print(f"      canonical = {root_match.get('canonical')}")
        print(f"      refresh   = {root_match.get('refresh')}")
        print(f"      robots    = {root_match.get('robots')}")
    else:
        print(f"   ROOT /{root_rel}: NOT FOUND")
    if nested_match:
        print(f"   NESTED /{nested_rel}:")
        print(f"      size      = {nested_match['size']} bytes")
        print(f"      canonical = {nested_match.get('canonical')}")
        print(f"      refresh   = {nested_match.get('refresh')}")
        print(f"      robots    = {nested_match.get('robots')}")
    else:
        print(f"   NESTED /{nested_rel}: NOT FOUND")

# Compare HTML file list vs sitemap.xml
print("\n=== SITEMAP vs FILESYSTEM ===")
sitemap_path = ROOT / "sitemap.xml"
sm_urls = []
with open(sitemap_path, "r", encoding="utf-8") as f:
    sm_text = f.read()
for m in re.finditer(r"<loc>([^<]+)</loc>", sm_text):
    sm_urls.append(m.group(1))
print(f"URLs in sitemap.xml: {len(sm_urls)}")
print(f"Unique URLs in sitemap.xml: {len(set(sm_urls))}")
dupes = [u for u, c in Counter(sm_urls).items() if c > 1]
print(f"Duplicate URLs in sitemap.xml: {dupes}")

# Check file-system HTML that's NOT in sitemap
fs_urls = set()
for r in results:
    path = r["path"]
    if path.endswith("/index.html"):
        path = path[:-len("index.html")]
    fs_urls.add(SITE + path)

sm_set = set(sm_urls)
missing_from_sitemap = sorted(fs_urls - sm_set)
extra_in_sitemap = sorted(sm_set - fs_urls)

print(f"\nHTML files NOT in sitemap ({len(missing_from_sitemap)}):")
for u in missing_from_sitemap:
    print(f"  - {u}")

print(f"\nURLs in sitemap not matching any HTML file ({len(extra_in_sitemap)}):")
for u in extra_in_sitemap:
    print(f"  - {u}")

# Lastmod freshness
print("\n=== LASTMOD FRESHNESS ===")
lastmods = re.findall(r"<lastmod>([^<]+)</lastmod>", sm_text)
lm_counter = Counter(lastmods)
for lm, c in sorted(lm_counter.items()):
    print(f"  {lm}: {c}")
