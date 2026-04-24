import json, sys, os
sys.stdout.reconfigure(encoding='utf-8')

with open('audit-2026-04-24/per-page-stats.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("=== STADTTEILE PAGES (pages/stadtteile/*) ===")
sd = {k: v for k, v in d.items() if 'stadtteile' in k.replace(chr(92), '/')}
for k, v in sorted(sd.items(), key=lambda x: x[1]['words']):
    print(f"  {v['words']:5d} words | schema:{str(v['has_schema']):5} | landmarks:{len(v['landmarks']):2d} | {k}")

print(f"\nTotal stadtteile: {len(sd)}")
if sd:
    print(f"Avg words: {sum(v['words'] for v in sd.values())/len(sd):.0f}")
    print(f"Min: {min(v['words'] for v in sd.values())} | Max: {max(v['words'] for v in sd.values())}")

with_l = [k for k, v in sd.items() if v['landmarks']]
print(f"\nStadtteile with landmarks: {len(with_l)}/{len(sd)}")
for k, v in sd.items():
    if v['landmarks']:
        print(f"  {k}: {v['landmarks']}")

# Root-level district pages (potential duplicates)
print("\n=== ROOT-LEVEL DISTRICT PAGES (potential duplicates with /pages/stadtteile/) ===")
districts_root = {k: v for k, v in d.items() if os.sep not in k and any(
    s in k.lower() for s in ['altona', 'harburg', 'wandsbek', 'bergedorf', 'mitte', 'eimsb', 'barmbek', 'nord']
)}
for k, v in sorted(districts_root.items()):
    print(f"  {v['words']:5d} words | {k}")

print("\n=== ALL ROOT HTML FILES ===")
root_files = {k: v for k, v in d.items() if os.sep not in k}
print(f"Count: {len(root_files)}")
for k, v in sorted(root_files.items()):
    print(f"  {v['words']:5d} words | schema:{str(v['has_schema']):5} | {k}")
