"""Check content uniqueness + deeper landmark detection on stadtteile pages."""
import os, re, sys, hashlib, json
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

STADT_DIR = 'pages/stadtteile'
files = sorted([os.path.join(STADT_DIR, f) for f in os.listdir(STADT_DIR) if f.endswith('.html')])

# Wider landmark/street pattern — catches "-straße/-str./-weg/-platz" etc.
landmark_rx = re.compile(
    r'\b('
    r'U[- ]?Bahn|S[- ]?Bahn|IKEA|Edeka|REWE|Aldi|Lidl|Mercado|'
    r'Alster|Elbe|Reeperbahn|Jungfernstieg|Mönckebergstraße|Elbphilharmonie|'
    r'HafenCity|Hafencity|Landungsbrücken|Alsterpark|Stadtpark|Planten un Blomen|'
    r'Hauptbahnhof|Rathaus|Fischmarkt|Speicherstadt|Dom|Michel|Millerntor|'
    r'[A-ZÄÖÜ][a-zäöüß]+(?:straße|str\.|weg|platz|allee|chaussee|damm|markt|brücke|park|bahn)'
    r')\b'
)

texts = {}
landmarks_per_page = {}
h1s = {}
titles = {}
metadescs = {}

for fp in files:
    with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    # extract <title> and meta desc
    t = re.search(r'<title>([^<]+)</title>', html)
    titles[fp] = t.group(1).strip() if t else ''
    md = re.search(r'<meta name="description" content="([^"]+)"', html)
    metadescs[fp] = md.group(1).strip() if md else ''
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.S)
    h1s[fp] = re.sub(r'<[^>]+>', '', h1.group(1)).strip() if h1 else ''
    # Plain text body
    body = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.S | re.I)
    body = re.sub(r'<style[^>]*>.*?</style>', '', body, flags=re.S | re.I)
    body = re.sub(r'<(header|footer|nav)[^>]*>.*?</\1>', '', body, flags=re.S | re.I)
    body = re.sub(r'<[^>]+>', ' ', body)
    body = re.sub(r'\s+', ' ', body).strip()
    texts[fp] = body
    landmarks_per_page[fp] = sorted(set(landmark_rx.findall(html)))

print("=== TITLES ===")
for fp, t in titles.items():
    print(f"  {os.path.basename(fp):30s} | {t}")

print("\n=== META DESCRIPTIONS (first 100 chars) ===")
dup = Counter()
for fp, md in metadescs.items():
    key = md[:80]
    dup[key] += 1
    print(f"  {os.path.basename(fp):30s} | {md[:120]}")
print("\nDuplicate meta desc prefixes:")
for k, c in dup.most_common(5):
    if c > 1:
        print(f"  {c}x -> {k}")

print("\n=== H1s ===")
for fp, h in h1s.items():
    print(f"  {os.path.basename(fp):30s} | {h}")

print("\n=== LANDMARKS / STREETS PER PAGE ===")
for fp, l in landmarks_per_page.items():
    print(f"  {os.path.basename(fp):30s} | count={len(l):2d} | {l[:8]}")

# Compute pairwise shingle overlap (5-gram)
def shingles(text, n=5):
    words = text.lower().split()
    return set(tuple(words[i:i+n]) for i in range(len(words)-n+1))

sh = {fp: shingles(t) for fp, t in texts.items()}
print("\n=== PAIRWISE CONTENT OVERLAP (Jaccard on 5-gram shingles, top pairs >0.30) ===")
pairs = []
fnames = list(sh.keys())
for i in range(len(fnames)):
    for j in range(i+1, len(fnames)):
        a, b = sh[fnames[i]], sh[fnames[j]]
        if not a or not b: continue
        j_sim = len(a & b) / len(a | b)
        pairs.append((j_sim, fnames[i], fnames[j]))
pairs.sort(reverse=True)
for s, a, b in pairs[:15]:
    print(f"  {s:.2f}  {os.path.basename(a)} <-> {os.path.basename(b)}")

# Average similarity
avg = sum(p[0] for p in pairs) / len(pairs) if pairs else 0
print(f"\nAvg jaccard similarity (all pairs): {avg:.3f}")
print(f"Pairs >= 0.50 (high dup risk): {sum(1 for p in pairs if p[0]>=0.50)}")
print(f"Pairs >= 0.30 (template-ish):   {sum(1 for p in pairs if p[0]>=0.30)}")

# Save JSON artifact
out = {
    'titles': {os.path.basename(k): v for k, v in titles.items()},
    'descriptions': {os.path.basename(k): v for k, v in metadescs.items()},
    'h1s': {os.path.basename(k): v for k, v in h1s.items()},
    'landmarks': {os.path.basename(k): v for k, v in landmarks_per_page.items()},
    'top_pairs': [(round(s,3), os.path.basename(a), os.path.basename(b)) for s,a,b in pairs[:30]],
    'avg_similarity': avg,
}
with open('audit-2026-04-24/stadtteile-uniqueness.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, indent=2, ensure_ascii=False)
