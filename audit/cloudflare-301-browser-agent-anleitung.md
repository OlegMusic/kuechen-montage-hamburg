# Browser-Agent-Auftrag: 20 echte 301-Redirects in Cloudflare einrichten

**Ziel:** Für die Zone `kuechen-montage-hamburg.de` 20 dauerhafte (301) URL-Weiterleitungen per **Cloudflare Bulk Redirects** anlegen. Damit werden alte `/pages/services/*.html`- und alte Stadtteil-URLs serverseitig auf die neuen kurzen URLs umgeleitet (löst u. a. das Herd-Kanonisierungsproblem: Google hält aktuell die alte URL für kanonisch).

**Voraussetzung:** Eingeloggt auf https://dash.cloudflare.com mit Zugriff auf den Account, der `kuechen-montage-hamburg.de` verwaltet.

---

## Schritt 1 — Bulk Redirects öffnen
1. https://dash.cloudflare.com öffnen, den **Account** auswählen.
2. Linke Seitenleiste → **Bulk Redirects** (liegt auf **Account-Ebene**, NICHT in der Zone/Domain). Falls nicht sichtbar: „Manage Account" → „Bulk Redirects".

## Schritt 2 — Redirect-Liste erstellen
1. **Create a new list** (oder „Create redirect list").
2. Name: `kmh-301`  · Description: `Alt → kurze URLs (301)` · Content type: **Redirect**.
3. **Create**.

## Schritt 3 — Die 20 Redirects eintragen
Für **jede** Zeile aus der Tabelle unten einen Eintrag anlegen mit diesen Feldern:
- **Source URL** = Spalte „Source"
- **Target URL** = Spalte „Target"
- **Status** = **301** (Permanent Redirect)
- **Preserve query string** = **ON**
- **Include subpaths / Subpath matching** = **OFF**
- **Preserve path suffix** = **OFF**
- **Ignore case** = **ON**

> Falls die UI einen **CSV-Import** anbietet: stattdessen den CSV-Block am Ende hochladen/einfügen (gleiche Felder).
> **Free-Plan-Hinweis:** Cloudflare Free erlaubt nur begrenzt viele Bulk-Redirects (Richtwert ~20). Wir haben genau 20 — falls das Dashboard weitere ablehnt, zuerst die mit ★ markierten Zeilen anlegen (die wichtigen Konsolidierungen), den Rest weglassen.

| # | Source | Target | ★ |
|---|---|---|---|
| 1 | `https://kuechen-montage-hamburg.de/pages/services/herd-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | ★★ |
| 2 | `https://kuechen-montage-hamburg.de/pages/services/eckventil-austauschen-kueche-hamburg.html` | `https://kuechen-montage-hamburg.de/eckventil-austauschen-hamburg/` | ★ |
| 3 | `https://kuechen-montage-hamburg.de/pages/services/spuelmaschine-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/geschirrspueler-anschliessen-hamburg/` | ★ |
| 4 | `https://kuechen-montage-hamburg.de/pages/services/waschmaschine-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/waschmaschine-anschliessen-hamburg/` | ★ |
| 5 | `https://kuechen-montage-hamburg.de/pages/services/wasserhahn-austauschen-hamburg.html` | `https://kuechen-montage-hamburg.de/armatur-austauschen-hamburg/` | ★ |
| 6 | `https://kuechen-montage-hamburg.de/pages/services/spuele-austauschen-hamburg.html` | `https://kuechen-montage-hamburg.de/kuechenspuele-montage-hamburg/` | ★ |
| 7 | `https://kuechen-montage-hamburg.de/pages/services/kuechenmontage-hamburg.html` | `https://kuechen-montage-hamburg.de/` | ★ |
| 8 | `https://kuechen-montage-hamburg.de/pages/services/kuechenmontage-service-hamburg.html` | `https://kuechen-montage-hamburg.de/` | ★ |
| 9 | `https://kuechen-montage-hamburg.de/kuechenmontage-hamburg.html` | `https://kuechen-montage-hamburg.de/` | ★ |
| 10 | `https://kuechen-montage-hamburg.de/spuelmaschine-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/geschirrspueler-anschliessen-hamburg/` | ★ |
| 11 | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | ★ |
| 12 | `https://kuechen-montage-hamburg.de/elektroherd-anschliessen-hamburg/` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | |
| 13 | `https://kuechen-montage-hamburg.de/herd-altona.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | |
| 14 | `https://kuechen-montage-hamburg.de/herd-anschliessen-altona.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | |
| 15 | `https://kuechen-montage-hamburg.de/herd-anschliessen-bergedorf.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | |
| 16 | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg-mitte.html` | `https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/` | |
| 17 | `https://kuechen-montage-hamburg.de/power-splitter-hamburg/` | `https://kuechen-montage-hamburg.de/power-splitter-installieren-hamburg/` | |
| 18 | `https://kuechen-montage-hamburg.de/waschmaschine-wandsbek.html` | `https://kuechen-montage-hamburg.de/pages/stadtteile/wandsbek.html` | |
| 19 | `https://kuechen-montage-hamburg.de/pages/services/arbeitsplatte.html` | `https://kuechen-montage-hamburg.de/pages/services/arbeitsplatte-zuschneiden-hamburg.html` | |
| 20 | `https://kuechen-montage-hamburg.de/aufmass-kueche-hamburg.html` | `https://kuechen-montage-hamburg.de/pages/services/aufmass-kueche-hamburg.html` | |

4. **Save** die Liste.

## Schritt 4 — Bulk-Redirect-Regel erstellen (aktiviert die Liste)
1. In **Bulk Redirects** → **Create bulk redirect rule**.
2. Name: `kmh-301-rule`.
3. Liste auswählen: **kmh-301**.
4. Ausdruck/Expression auf Standard lassen (nutzt die Liste).
5. **Deploy / Save**.

## Schritt 5 — Verifizieren & zurückmelden
Diese URLs prüfen (Browser-DevTools → Network, oder `curl -I`) — erwartet **HTTP 301** + `location:` = Target:
- `https://kuechen-montage-hamburg.de/pages/services/herd-anschliessen-hamburg.html` → muss 301 auf `/herd-anschliessen-hamburg/`
- `https://kuechen-montage-hamburg.de/pages/services/wasserhahn-austauschen-hamburg.html` → 301 auf `/armatur-austauschen-hamburg/`
- `https://kuechen-montage-hamburg.de/kuechenmontage-hamburg.html` → 301 auf `/`

**Zurückmelden:** Liste + Regel angelegt? Wie viele der 20 Zeilen wurden gespeichert (Quota)? Ergebnis der 3 Verifizierungs-Checks (301 ja/nein, korrektes Target).

---

## CSV (optional, falls Import angeboten)
```csv
source,target,status
https://kuechen-montage-hamburg.de/pages/services/herd-anschliessen-hamburg.html,https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/,301
https://kuechen-montage-hamburg.de/pages/services/eckventil-austauschen-kueche-hamburg.html,https://kuechen-montage-hamburg.de/eckventil-austauschen-hamburg/,301
https://kuechen-montage-hamburg.de/pages/services/spuelmaschine-anschliessen-hamburg.html,https://kuechen-montage-hamburg.de/geschirrspueler-anschliessen-hamburg/,301
https://kuechen-montage-hamburg.de/pages/services/waschmaschine-anschliessen-hamburg.html,https://kuechen-montage-hamburg.de/waschmaschine-anschliessen-hamburg/,301
https://kuechen-montage-hamburg.de/pages/services/wasserhahn-austauschen-hamburg.html,https://kuechen-montage-hamburg.de/armatur-austauschen-hamburg/,301
https://kuechen-montage-hamburg.de/pages/services/spuele-austauschen-hamburg.html,https://kuechen-montage-hamburg.de/kuechenspuele-montage-hamburg/,301
https://kuechen-montage-hamburg.de/pages/services/kuechenmontage-hamburg.html,https://kuechen-montage-hamburg.de/,301
https://kuechen-montage-hamburg.de/pages/services/kuechenmontage-service-hamburg.html,https://kuechen-montage-hamburg.de/,301
https://kuechen-montage-hamburg.de/kuechenmontage-hamburg.html,https://kuechen-montage-hamburg.de/,301
https://kuechen-montage-hamburg.de/spuelmaschine-anschliessen-hamburg.html,https://kuechen-montage-hamburg.de/geschirrspueler-anschliessen-hamburg/,301
https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg.html,https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/,301
https://kuechen-montage-hamburg.de/elektroherd-anschliessen-hamburg/,https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/,301
https://kuechen-montage-hamburg.de/herd-altona.html,https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/,301
https://kuechen-montage-hamburg.de/herd-anschliessen-altona.html,https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/,301
https://kuechen-montage-hamburg.de/herd-anschliessen-bergedorf.html,https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/,301
https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg-mitte.html,https://kuechen-montage-hamburg.de/herd-anschliessen-hamburg/,301
https://kuechen-montage-hamburg.de/power-splitter-hamburg/,https://kuechen-montage-hamburg.de/power-splitter-installieren-hamburg/,301
https://kuechen-montage-hamburg.de/waschmaschine-wandsbek.html,https://kuechen-montage-hamburg.de/pages/stadtteile/wandsbek.html,301
https://kuechen-montage-hamburg.de/pages/services/arbeitsplatte.html,https://kuechen-montage-hamburg.de/pages/services/arbeitsplatte-zuschneiden-hamburg.html,301
https://kuechen-montage-hamburg.de/aufmass-kueche-hamburg.html,https://kuechen-montage-hamburg.de/pages/services/aufmass-kueche-hamburg.html,301
```
