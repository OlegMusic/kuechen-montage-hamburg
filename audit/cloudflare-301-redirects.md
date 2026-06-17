# Cloudflare Bulk Redirect — echte 301 (Chains aufgelöst, relative URLs fixiert)

Cloudflare → Rules → Redirect Rules → Bulk Redirects → Create list. Spalten: Source URL / Target URL / Status 301. Preserve query string: optional.

| Source | Target | 301 |
|---|---|---|
| `https://kuechen-montage-hamburg.de/aufmass-kueche-hamburg.html` | `https://kuechen-montage-hamburg.de/pages/services/aufmass-kueche-hamburg.html` | 301 |
| `https://kuechen-montage-hamburg.de/elektroherd-anschliessen-hamburg/` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/herd-altona.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/herd-anschliessen-altona.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/herd-anschliessen-bergedorf.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg-mitte.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/kuechenmontage-hamburg.html` | `https://kuechen-montage-hamburg.de/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/arbeitsplatte.html` | `https://kuechen-montage-hamburg.de/pages/services/arbeitsplatte-zuschneiden-hamburg.html` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/eckventil-austauschen-kueche-hamburg.html` | `https://kuechen-montage-hamburg.de/eckventil-austauschen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/herd-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/kuechenmontage-hamburg.html` | `https://kuechen-montage-hamburg.de/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/kuechenmontage-service-hamburg.html` | `https://kuechen-montage-hamburg.de/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/spuele-austauschen-hamburg.html` | `https://kuechen-montage-hamburg.de/kuechenspuele-montage-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/spuelmaschine-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/geschirrspueler-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/waschmaschine-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/waschmaschine-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/pages/services/wasserhahn-austauschen-hamburg.html` | `https://kuechen-montage-hamburg.de/armatur-austauschen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/power-splitter-hamburg/` | `https://kuechen-montage-hamburg.de/power-splitter-installieren-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/spuelmaschine-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/geschirrspueler-anschliessen-hamburg/` | 301 |
| `https://kuechen-montage-hamburg.de/waschmaschine-wandsbek.html` | `https://kuechen-montage-hamburg.de/pages/stadtteile/wandsbek.html` | 301 |