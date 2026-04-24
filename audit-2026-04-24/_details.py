"""Drill into specifics for the report."""
import json
from pathlib import Path

OUT = Path(r"C:\Users\prusi\Desktop\3. Проекты\kuechen-montage-hamburg\audit-2026-04-24")
data = json.loads((OUT / "_audit.json").read_text(encoding="utf-8"))

# 1) LocalBusiness summary: any with full set?
lb_full = []
lb_partial = []
lb_incomplete = []
for lb in data["localbusiness"]:
    has = (lb.get("locality") and lb.get("telephone") and lb.get("priceRange")
           and lb.get("streetAddress") and lb.get("geo") and lb.get("openingHours")
           and lb.get("areaServed"))
    partial = (lb.get("locality") and lb.get("telephone") and lb.get("priceRange"))
    if has:
        lb_full.append(lb)
    elif partial:
        lb_partial.append(lb)
    else:
        lb_incomplete.append(lb)

print("=== LocalBusiness ===")
print("Total LB nodes:", len(data["localbusiness"]))
print("Fully populated (locality+tel+price+street+geo+hours+areaServed):", len(lb_full))
print("Partial (locality+tel+price):", len(lb_partial))
print("Incomplete:", len(lb_incomplete))
if lb_full:
    s = lb_full[0]
    print("Sample full LB on:", s["page"])
    for k, v in s.items():
        print(" ", k, "=", v)
elif lb_partial:
    s = lb_partial[0]
    print("Sample partial LB on:", s["page"])
    for k, v in s.items():
        print(" ", k, "=", v)

# Count unique pages with LB
lb_pages = set(lb["page"] for lb in data["localbusiness"])
print("Unique pages with LB:", len(lb_pages))

# How many have geo? areaServed? openingHours? streetAddress?
stats = {"geo": 0, "areaServed": 0, "openingHours": 0, "streetAddress": 0,
         "priceRange": 0, "telephone": 0, "locality_hamburg": 0}
for lb in data["localbusiness"]:
    if lb.get("geo"): stats["geo"] += 1
    if lb.get("areaServed"): stats["areaServed"] += 1
    if lb.get("openingHours"): stats["openingHours"] += 1
    if lb.get("streetAddress"): stats["streetAddress"] += 1
    if lb.get("priceRange"): stats["priceRange"] += 1
    if lb.get("telephone"): stats["telephone"] += 1
    if lb.get("locality") and "hamburg" in str(lb["locality"]).lower():
        stats["locality_hamburg"] += 1
print("LB field stats:", stats)

# 2) HowTo drill
print("\n=== HowTo on /montage-und-installation/* ===")
for h in data["howto"]:
    print(f"  {h['slug']:40s} howto={h['has_howto']} steps={h['steps']} totalTime={h['has_totalTime']} supply={h['has_supply']} tool={h['has_tool']} img={h['has_image']}")

# 3) Service commercial
print("\n=== Service on 14 commercial short URLs ===")
for s in data["service_commercial"]:
    print(f"  {s['slug']:45s} {s['status']:25s} providerLB={s.get('has_provider_lb')}")

# 4) FAQ home
print("\n=== FAQPage /index.html ===")
print(json.dumps(data["faq_home"], ensure_ascii=False, indent=2))

# 5) AggregateRating
print("\n=== AggregateRating ===")
from collections import Counter
c = Counter()
for a in data["aggregaterating"]:
    c[(a.get("ratingValue"), a.get("reviewCount") or a.get("ratingCount"))] += 1
for (v, rc), n in c.most_common():
    print(f"  rating={v} count={rc} -> {n} page(s)")
# Show unique pages with their values
unique_pages = {}
for a in data["aggregaterating"]:
    if a["page"] not in unique_pages:
        unique_pages[a["page"]] = a
print(f"Unique pages with AggregateRating: {len(unique_pages)}")

# 6) Key page content
print("\n=== Key pages content E-E-A-T ===")
for kp in data["key_pages"]:
    print(f"\n{kp.get('rel')}:")
    if kp.get("error"):
        print("  ERROR:", kp["error"]); continue
    print(f"  words={kp['word_count']}  h1={kp['h1_count']} h1_hamburg={kp['h1_has_hamburg']}  internal={kp['internal_links']} external={kp['external_links']}")
    print(f"  imgs={kp['img_total']} alts={kp['img_with_alt']} hamburg-alts={kp['img_hamburg_alt']} hero={kp['has_hero']}")
    print(f"  h1s={kp['h1s']}")
    print(f"  trust={kp['trust']}")

# 7) Type distribution summary
print("\n=== Type distribution (pages per type) ===")
for t, n in sorted(data["type_distribution"].items(), key=lambda x: -x[1]):
    print(f"  {t:20s} {n}")
