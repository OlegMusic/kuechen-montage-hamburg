# Cloudflare Bulk Redirect — echte 301 (Chains aufgelöst, relative URLs fixiert)

Cloudflare → Rules → Redirect Rules → Bulk Redirects → Create list. Spalten: Source URL / Target URL / Status 301. Preserve query string: optional.

| Source | Target | 301 |
|---|---|---|
| `https://kuechen-montage-hamburg.de/aufmass-kueche-hamburg.html` | `https://kuechen-montage-hamburg.de/pages/services/aufmass-kueche-hamburg.html` | 301 |
| `https://kuechen-montage-hamburg.de/elektroherd-anschliessen-hamburg/` | `https://kuechen-montage-hamburg.de/pages/services/herd-anschliessen-hamburg.html` | 301 |
| `https://kuechen-montage-hamburg.de/herd-altona.html` | `https://kuechen-montage-hamburg.de/pages/services/herd-anschliessen-hamburg.html` | 301 |
| `https://kuechen-montage-hamburg.de/herd-anschliessen-altona.html` | `https://kuechen-montage-hamburg.de/pages/services/herd-anschliessen-hamburg.html` | 301 |
| `https://kuechen-montage-hamburg.de/herd-anschliessen-bergedorf.html` | `https://kuechen-montage-hamburg.de/pages/services/herd-anschliessen-hamburg.html` | 301 |
| `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg-mitte.html` | `https://kuechen-montage-hamburg.de/pages/services/herd-anschliessen-hamburg.html` | 301 |
| `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/pages/services/herd-anschliessen-hamburg.html` | 301 |
| `https://kuechen-montage-hamburg.de/kuechenmontage-hamburg.html` | `https://kuechen-montage-hamburg.de/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/arbeitsplatte.html` | `https://kuechen-montage-hamburg.de/pages/services/arbeitsplatte-zuschneiden-hamburg.html` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/eckventil-austauschen-kueche-hamburg.html` | `https://kuechen-montage-hamburg.de/eckventil-austauschen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/kuechenmontage-hamburg.html` | `https://kuechen-montage-hamburg.de/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/kuechenmontage-service-hamburg.html` | `https://kuechen-montage-hamburg.de/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/spuele-austauschen-hamburg.html` | `https://kuechen-montage-hamburg.de/kuechenspuele-montage-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/spuelmaschine-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/geschirrspueler-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/waschmaschine-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/waschmaschine-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/wasserhahn-austauschen-hamburg.html` | `https://kuechen-montage-hamburg.de/armatur-austauschen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/power-splitter-hamburg/` | `https://kuechen-montage-hamburg.de/power-splitter-installieren-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/spuelmaschine-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/geschirrspueler-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/waschmaschine-wandsbek.html` | `https://kuechen-montage-hamburg.de/pages/stadtteile/wandsbek.html` | 301 |

---

## GSC-Status & Reihenfolge (Update 2026-06-22, frische 90-Tage-Daten)

Reihenfolge der Batches wichtig — nicht alles auf einmal.

### ✅ Batch 1 — SICHER, sofort anwendbar (Quelle tot 0/0, Ziel lebt)
Diese 301 ohne Risiko zuerst setzen:
- `/pages/services/spuelmaschine-anschliessen-hamburg.html` → `/geschirrspueler-anschliessen-hamburg/`
- `/pages/services/wasserhahn-austauschen-hamburg.html` → `/armatur-austauschen-hamburg/`
- `/pages/services/spuele-austauschen-hamburg.html` → `/kuechenspuele-montage-hamburg/`
- (sowie alle `herd-*`-Stadtteil-Stubs, `power-splitter-hamburg/`, `kuechenmontage-*`, `arbeitsplatte.html`, `aufmass`, `spuelmaschine-anschliessen-hamburg.html` Stub → unkritisch)
Interne Links + Breadcrumb-JSON-LD auf diese 3 Kanon-URLs sind bereits umgestellt (2026-06-22).
Danach: diese 3 aus `sitemap.xml` entfernen (Zeilen ~19–21).

### ⚠️ Batch 2 — ERST NACH PRÜFUNG (Quelle ist der lebende GSC-Gewinner!)
GSC 90d: `/pages/services/herd-anschliessen-hamburg.html` = **9 Klicks/443 Impr** (Gewinner), kurzer Folder `/herd-anschliessen-hamburg/` = **0/0 tot**. Gleiches Muster bei Waschmaschine (9clk vs 3clk).
- `/pages/services/herd-anschliessen-hamburg.html` → `/herd-anschliessen-hamburg/`
- `/elektroherd-anschliessen-hamburg/` → `/herd-anschliessen-hamburg/`
- `/pages/services/waschmaschine-anschliessen-hamburg.html` → `/waschmaschine-anschliessen-hamburg/`

301 überträgt zwar den Wert — ABER vorher: (1) Inhalt der kurzen Ziel-Seite muss mind. so gut sein wie der Gewinner, (2) einzeln/spät anwenden, (3) GSC 2–4 Wochen beobachten; fällt die Position, Richtung umkehren (kurz → /pages/services/). NICHT in Batch 1 mischen.

### Eckventil — NICHT auf toten kurzen Folder
`/eckventil-austauschen-hamburg/` ist tot; das Thema gehört den Info-Seiten (Ratgeber-Guide = 46 Klicks). Zeile 16 (`/pages/services/eckventil-...-kueche-...` → kurzer Folder) erst nach Inhalts-/GSC-Check.

### www → non-www (neue Findung, separate Redirect Rule, KEIN Bulk-Eintrag)
GSC zeigt `www.kuechen-montage-hamburg.de/...` als eigene indexierte Dublette. In Cloudflare → Rules → Redirect Rules:
- **When** hostname equals `www.kuechen-montage-hamburg.de`
- **Then** 301 → `https://kuechen-montage-hamburg.de${path}` (Preserve path + query)