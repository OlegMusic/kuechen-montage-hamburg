# Local SEO Audit — Küchen-Montage Hamburg (SAB)

Audit date: 2026-04-24
Repo: `C:\Users\prusi\Desktop\3. Проекты\kuechen-montage-hamburg`
Business type: Service-Area Business (SAB) — Küchenmontage / Sanitär / Elektro
Domain: https://kuechen-montage-hamburg.de

---

## Executive summary (TL;DR)

1. **NAP is largely consistent** — 1 phone number, 1 email, 1 brand in all meaningful spellings. 284 phone hits all normalize to `+4915218547875`. Zero conflicting phones. Email `info@kuechen-montage-hamburg.de` — 278/278 identical. One noise hit `ihre@email.de` is a placeholder in a contact-form (`pages/kontakt.html`), not a real NAP leak.
2. **Critical SAB schema violation on home page**: `index.html` LocalBusiness JSON-LD exposes `streetAddress: "Bossardstr. 12"` as the business address. For a service-area business Google's guidelines require that the street address be hidden — only `areaServed`. Same street also rendered in visible footers on 5 pages. Impressum must keep it legally (§5 TMG), but JSON-LD, OG meta and footers must not.
3. **Brand has two orthographic variants**: `Küchen-Montage Hamburg` (485 hits, with hyphen, used in logo/footer/schema) and `Küchenmontage Hamburg` (33 hits, no hyphen, used in titles/descriptions). Pick one canonical and stick to it in `name` / `legalName` / logo alt. Google tolerates both, but citation matching on GBP, Bing Places, Yelp etc. works better with one.
4. **LocalBusiness type is too generic** — currently `LocalBusiness`. Switch to `HomeAndConstructionBusiness` (more specific child type, schema.org recommended). The home has no `AggregateRating` block even though 23 CHECK24 reviews at 4.7★ are rendered as visible content — huge rich-snippet opportunity being wasted.
5. **22 Stadtteile pages are genuinely unique** — avg Jaccard 5-gram similarity 0.019, max 0.05 (template-free). Every page contains real landmarks (Bahnhofstraße, Ottenser Hauptstraße, Mercado, UKE, Eppendorfer Baum, Reeperbahn, Jungfernstieg, HafenCity, Phoenix-Center etc.). Content quality is good for SAB; ranking headroom is on technical schema, not copy.
6. **3 root-level redirect stubs** (`altona.html`, `bergedorf.html`, `wandsbek.html`) use meta-refresh + canonical to `/pages/stadtteile/`. Meta-refresh is not a strong redirect signal for Google — convert to 301s on the hosting layer (CNAME GitHub Pages) or drop the files and rely on canonical.
7. **Root-level Service+Stadtteil landings are independent pages, not duplicates** (e.g. `herd-altona.html`, `spuelmaschine-anschliessen-wandsbek.html`, `waschmaschine-hamburg-nord.html` — 500-870 words each with own schema). They target different queries than the bare `/pages/stadtteile/altona.html` page. Keep both, but audit cross-linking.
8. **Address in JSON-LD is legally visible, but inconsistent with SAB positioning**: fix home schema, remove street from OG/footers, keep only in Impressum — and make clear in `areaServed` that service runs across all Hamburg + surrounding cities (as `kuechenspuele-montage-hamburg/` already does well).
9. **Missing districts (10 recommended)**: of the "must-have" list, `Rotherbaum`, `Altona-Altstadt`, `Hamm`, `Uhlenhorst*`, `St. Pauli*` (*=already exist) — net 10 new Stadtteile pages below. Plus 3 unusually high-traffic quarters missing (Niendorf, Volksdorf, Lokstedt).
10. **GBP-readiness: 75%**. WhatsApp-only contact (no classical phone) will be flagged — GBP requires a callable number. Recommend listing the mobile number `+49 152 18547875` as `phone` and WhatsApp as secondary call-to-action.

---

## 1. NAP Consistency

Scanned 109 HTML files (including all `.html` in root, `pages/**`, and topic directories).

### 1.1 Phone

| Normalized | Hits | Raw formats found |
|---|---|---|
| `+4915218547875` | **284** | `0152 185 478 75` (221×), `+4915218547875` (63×) |
| `0437418887` | 1 | false positive — `audit-2026-04-24/...-0437-4188-87...` metadata file artifact |

- **Verdict: perfectly consistent** — one real number, zero conflicts.
- **Formatting:** 2 formats on the page: E.164 in `tel:` / `wa.me/` URLs and `0152 185 478 75` as visible text. This is good — they're complementary. Just make sure GBP and all off-site citations list the **E.164** form.
- **Issue**: *Impressum* displays "Telefon: WhatsApp: 0152 185 478 75" — the "Telefon: WhatsApp:" prefix is awkward. Recommend label as `Mobil / WhatsApp:`.

### 1.2 Email

- `info@kuechen-montage-hamburg.de` — 278 hits, 100% consistent.
- `ihre@email.de` — 1 hit, a form placeholder in `pages/kontakt.html:59`. Not a NAP issue.

### 1.3 Brand / legal name

| Variant | Hits | Where used |
|---|---|---|
| `Küchen-Montage Hamburg` (with hyphen) | **485** | logo, h1 prefix, schema `name`, footer `<h4>`, OG `author` |
| `Küchenmontage Hamburg` (no hyphen) | 33 | in `<title>` and some H2s |
| `Küchenmontage` (no city) | 153+368 | service titles — fine |
| Legal name `PRUlog` | — | only in Impressum |

- **Verdict: two orthographic brand spellings.** Fine for on-site keyword coverage, but for **off-site citations** (GBP, Yelp, Gelbe Seiten, Bing Places) pick **one canonical**. Recommendation: **`Küchen-Montage Hamburg`** (the one already in LocalBusiness `name`) — this is what Google will match to your website.
- Add `"legalName": "PRUlog"` to the schema for transparency.

### 1.4 Address

- Legal address present only in:
  - `index.html` → JSON-LD `streetAddress: "Bossardstr. 12", 22309 Hamburg` **(SAB violation — see §2)**
  - `index.html` footer visible → `Bossardstr. 12, 22309 Hamburg`
  - `pages/blog/index.html`, `pages/blog/blauarbeit-erfahrungen.html`, `pages/blog/...`, `pages/galerie.html` footers — same line
  - `pages/impressum.html:57-58` — legally required, keep
- Additional PLZ chips found in 3 quick-URL files (`20357.html`, `21073.html`, `22765.html` — 4-11 words each, likely experimental stubs).

- **Verdict:** address is consistent where it appears. Problem is **that it appears at all in non-Impressum contexts** for an SAB.

### 1.5 Opening hours

- `index.html` schema: Mo-Fr 08:00-20:00, Sa 09:00-16:00.
- Stadtteile pages (e.g. `ottensen.html`): Mo-Sa 08:00-20:00.
- **Inconsistency** — Saturday hours differ between home and Stadtteile pages. Fix to one set across all schemas.

---

## 2. LocalBusiness / HomeAndConstructionBusiness Schema

### Current state

- **68 pages** have `LocalBusiness` JSON-LD — good coverage.
- **27 pages** use `AggregateRating` (on commercial landings).
- **1 `GeoCoordinates`** block (only `index.html`) — fine for SAB with one main `areaServed`.
- **NONE** use the more specific `HomeAndConstructionBusiness` type.
- Home page has **no AggregateRating** block despite rendering 13+ real reviews visibly — biggest quick-win.

### Critical issues on `index.html` schema

1. `@type: LocalBusiness` — replace with `HomeAndConstructionBusiness` (or `HomeAndConstructionBusiness` + `Plumber` + `Electrician` via array).
2. `address.streetAddress: "Bossardstr. 12"` → **remove** (SAB violation). For SAB Google wants `address` with only `addressLocality / addressRegion / addressCountry`, OR omit `address` entirely and rely on `areaServed`.
3. No `AggregateRating`.
4. `areaServed` is a bare string `"Hamburg"` — should be an array of the 7 Bezirke + key surrounding cities (you already do this well in `kuechenspuele-montage-hamburg/`).
5. `openingHoursSpecification` Saturday mismatch with Stadtteile pages.
6. No `hasOfferCatalog` / linked `Service` nodes.
7. No `image` (despite 60+ photos in `/foto/`).
8. `logo` missing.
9. `sameAs` only has WhatsApp — no CHECK24 profile, no Google Maps URL, no Facebook.

### Recommended JSON-LD (ready to paste into `<head>` of `index.html`)

See the ready-to-paste block in `audit-2026-04-24/schema-home.jsonld`.

### Recommended Service + areaServed template

For the 14 commercial landing pages (`kuechenspuele-montage-hamburg/`, `waschmaschine-anschliessen-hamburg/`, `armatur-austauschen-hamburg/`, `trockner-anschliessen-hamburg/`, `ceranfeld-anschliessen-hamburg/`, `induktionskochfeld-anschliessen-hamburg/`, `waschbecken-installieren-hamburg/`, `spueltischarmatur-einbau-hamburg/`, `starkstromdose-installieren-hamburg/`, `y-stueck-wasserzulauf-installieren-hamburg/`, `power-splitter-installieren-hamburg/`, `elektroherd-anschliessen-hamburg/`, `geschirrspueler-anschliessen-hamburg/`, `kochfeld-installieren-hamburg/`).

See `audit-2026-04-24/schema-service-template.jsonld`.

---

## 3. Stadtteile pages (pages/stadtteile/*.html)

### 3.1 Files (22 total)

| File | Words | Landmarks in body |
|---|---|---|
| altona.html | 428 | Große Bergstraße, Rathaus, IKEA |
| barmbek.html | 439 | Hamburger Straße, Museum der Arbeit, IKEA |
| bergedorf.html | 440 | Sachsentor, Schloss, Chrysanderstraße, Einkaufsstraße |
| billstedt.html | 465 | Billstedter Hauptstraße, Archenholz-, Merkenstraße, U-Bahn |
| blankenese.html | 457 | Bahnhofstraße, Treppenviertel, Hessepark |
| bramfeld.html | 438 | Bramfelder Chaussee, Hertastraße, Fabriciusstraße |
| eimsbuettel.html | 437 | Osterstraße, Eimsbütteler Chaussee, Methfesselstraße, Unnapark |
| eppendorf.html | 447 | Eppendorfer Baum, UKE, Kellinghusenstraße, Tarpenbekstraße |
| farmsen.html | 469 | Berner Heerweg, Trabrennbahn, Wochenmarkt, U-Bahn |
| hamburg-mitte.html | 445 | Mönckebergstraße, HafenCity, Hauptbahnhof, Steinstraße, Speicherstadt |
| harburg.html | 434 | Harburger Rathausstraße, Phoenix-Center, Elbe, IKEA |
| horn.html | 495 | Horner Rennbahn, Landstraße, Weddestraße, U-Bahn |
| jenfeld.html | 483 | Jenfelder Allee, Rodigallee |
| neugraben.html | 486 | Neugrabener Markt, Bahnhofstraße |
| ottensen.html | 450 | Ottenser Hauptstraße, Bahrenfelder Str., Eulenstr., Arnoldstr., Mercado, Elbchaussee, Spritzenplatz, Große Rainstraße (9 landmarks — highest) |
| rahlstedt.html | 435 | Rahlstedter Bahnhofstraße |
| st-pauli.html | 460 | Reeperbahn, Millerntor, Talstr., Feldstr., Wohlwillstr., Hafenstr., Autobahn |
| stellingen.html | 456 | Hagenbeck Tierpark, Molkenbuhrstraße, Basselweg, U-Bahn, Autobahn |
| uhlenhorst.html | 442 | Mundsburger Damm, Hofweg, Zimmerstr., Averhoffstr., Schottmüllerstr., U-Bahn |
| wandsbek.html | 448 | Wandsbeker Marktstraße, Marktplatz, Eichtalpark, Lesserstraße |
| wilhelmsburg.html | 503 | Veringstraße, Inselpark, Fährstraße, S-Bahn |
| winterhude.html | 435 | Mühlenkamp, Stadtpark, Alster, Sierichstraße |

- Word count: 428–503 (avg 454). Fine for local landing pages.
- **Landmarks present on every page** — good. Weakest: `barmbek.html` (only "IKEA"), `jenfeld.html`, `neugraben.html`, `rahlstedt.html` (2 landmarks). Strongest: `ottensen.html` (9), `st-pauli.html` (8).
- **Content uniqueness verified** — max 5-gram Jaccard similarity between any two Stadtteile is 0.05. No duplicate-content risk.

### 3.2 Schema on Stadtteile

- All 22 have LocalBusiness + BreadcrumbList JSON-LD.
- `address` includes `addressLocality: "Hamburg"` only (good for SAB) — no streetAddress. **Correct pattern.**
- `openingHoursSpecification` is Mo-Sa 08:00-20:00 — but home says Sa closes 16:00. **Align.**
- No `AggregateRating` on Stadtteile — add (reuse home aggregate, since reviews cover the whole business).

### 3.3 Root-level dubletten (301 strategy)

| Root file | `/pages/stadtteile/` equivalent | Current mechanism | Recommended action |
|---|---|---|---|
| `altona.html` (4 words) | `pages/stadtteile/altona.html` | meta-refresh + canonical | **Drop meta-refresh, set up proper 301** in hosting layer or delete file. Meta-refresh is weak. |
| `wandsbek.html` (6 words) | `pages/stadtteile/wandsbek.html` | meta-refresh + canonical | Same as above |
| `bergedorf.html` (4 words) | `pages/stadtteile/bergedorf.html` | meta-refresh + canonical | Same as above |
| `harburg.html` (383 words, full content + schema) | `pages/stadtteile/harburg.html` (434 words) | **Two different canonicals, both in sitemap** | **Consolidate**: decide one canonical, 301 the other. Recommend keeping `/pages/stadtteile/harburg.html` (matches URL convention) and 301'ing root. |
| `kuechenmontage-hamburg-mitte.html` (4 words) | `pages/stadtteile/hamburg-mitte.html` | stub | Delete or 301 |
| `spuelmaschine-anschliessen-hamburg.html` (5 words) | `pages/services/spuelmaschine-anschliessen-hamburg.html` | stub | Delete or 301 |
| `kuechenmontage-hamburg.html` (5 words) | `pages/services/kuechenmontage-hamburg.html` | stub | Delete or 301 |
| `herd-anschliessen-hamburg.html` (5 words) | `pages/services/herd-anschliessen-hamburg.html` | stub | Delete or 301 |
| `aufmass-kueche-hamburg.html` (7 words) | `pages/services/aufmass-kueche-hamburg.html` | stub | Delete or 301 |
| `quick-registration-link.html`, `20357.html`, `21073.html`, `22765.html`, `waschmaschine-wandsbek.html` (4-11 words) | — | experimental short-URL | Delete or `noindex` |

GitHub Pages doesn't support server-side 301. Three options:
  - **(A) Best:** migrate hosting to Netlify / Cloudflare Pages (free) and use `_redirects` file.
  - **(B) Acceptable:** Keep the stubs but add `<meta name="robots" content="noindex">` so Google drops them — the canonical will still forward PageRank to the real page.
  - **(C) Just delete** the stubs — relative inbound links are unlikely.

### 3.4 Stadtteile NOT present (missing-list)

You said "must-have" districts: Ottensen, Eppendorf, Winterhude, Blankenese, St. Pauli, Rotherbaum, Eimsbüttel, Uhlenhorst, Barmbek, Wandsbek, Harburg, Bergedorf, Billstedt, Altona-Altstadt, Hamm, Horn.

Present: Ottensen, Eppendorf, Winterhude, Blankenese, St. Pauli, Eimsbüttel, Uhlenhorst, Barmbek, Wandsbek, Harburg, Bergedorf, Billstedt, Horn — 13/16.

**Missing (3 from your list):** Rotherbaum, Altona-Altstadt, Hamm.

**+7 additional high-volume Hamburg Stadtteile worth landing pages** (based on population and household density — prime kitchen-install demand):
- **Niendorf** (36k pop, Eimsbüttel Bezirk, many Neubau)
- **Lokstedt** (26k, Eimsbüttel, UKE proximity)
- **Volksdorf** (21k, Wandsbek, high-income detached houses)
- **Sasel** (22k, Wandsbek, high-end residential)
- **Marienthal** (13k, Wandsbek, old villas + renovation market)
- **Lurup** (35k, Altona, Turkish/Polish diaspora, social housing mix)
- **Osdorf** (25k, Altona, Osdorfer Born high-density)

**Recommended Top-10 new Stadtteile pages (priority order):**
1. Rotherbaum (missing from your must-have list; Uni-Hamburg + Rotherbaumchaussee, premium market)
2. Altona-Altstadt (missing from your list; separate from Ottensen/Altona-Nord)
3. Niendorf (high new-build volume)
4. Lokstedt (Uni-nähe, demographic with disposable income)
5. Hamm (missing from your list; central Mitte)
6. Volksdorf (high-end north-east)
7. Sasel (high-end Wandsbek)
8. Lurup (high population, underserved)
9. Osdorf (Ikea-Mitte-Altona corridor, high-volume)
10. Marienthal (renovation market)

Each page should follow the quality bar already set by `ottensen.html` — real landmarks, real Straßennamen, 1–2 Altbau-vs-Neubau hooks, 1 anonymous testimonial tied to a street in that quarter.

---

## 4. Google Business Profile readiness

| Requirement | Status | Action |
|---|---|---|
| Business name | ✅ `Küchen-Montage Hamburg` (pick 1 canonical spelling) | Drop `Küchenmontage Hamburg` variant from `<title>` to `Küchen-Montage Hamburg` |
| Primary category | ⚠ not declared on site | Use `Küchenmonteur` (de: "Küchenmonteur" / en: "Kitchen furniture store" is wrong — best is `Handwerker` or create new) as primary on GBP |
| Secondary categories | — | `Installateur / Klempner`, `Elektriker`, `Handwerker`, `Appliance-Reparatur-Service` |
| Phone (callable!) | ❌ Only WhatsApp/mobile declared as "Telefon: WhatsApp:" | Add a real callable number — even if it's the same +49 152… it must be labelled as **phone**, not "WhatsApp:". GBP will reject "WhatsApp:" prefix. |
| Address — for SAB | ⚠ Hidden-address required. Impressum keeps Bossardstr. 12; in GBP toggle "I deliver goods and services to my customers" and leave address hidden. | On website remove street from JSON-LD + footers (keep in Impressum only). |
| Service area | ✅ All 7 Bezirke described, 22 Stadtteile pages | On GBP enter the 7 Bezirke as service-area polygons |
| Opening hours | ⚠ Home: Sa closes 16; Stadtteile: Sa closes 20 | Fix to one set (Sa 09-16 seems more realistic) |
| Services (menu) | ✅ Home lists 14 services with prices | Duplicate as "Services" in GBP with same prices |
| Photos | ✅ 60+ in `/foto/` (IMG_0706–IMG_7285 original photos + team shots) | Upload 10–20 best to GBP — before/after, team, logo, exterior (van) |
| Reviews / Aggregate | ✅ 13+ visible CHECK24 reviews 4.7★ on site, no schema | Add AggregateRating JSON-LD (see §2) and link to CHECK24 profile in `sameAs` |
| Logo | ⚠ visible as CSS letter "K" | Commission or export a proper logo PNG 250×250, put in `/img/logo.png` and reference in schema + GBP |
| Hours exceptions (feiertags, Urlaub) | — | Update on GBP as needed |

**Overall: 75% GBP-ready.** Two blockers: (1) replace WhatsApp-only labeling with a proper phone label, (2) export a logo.

---

## 5. Service-area (SAB) strategy — recommendations

### 5.1 On-page pattern for Stadtteile

Current pages already follow a solid pattern. Codify as a **required template**:

1. `<title>`: `Küchenmontage {Stadtteil} Hamburg | Geräteanschluss ab 60€` (60 chars)
2. Meta desc 150 chars, include: service + Stadtteil + ≥2 landmarks + ab-Preis + USP
3. H1: `Küchenmontage & Geräteanschluss in {Stadtteil}`
4. Hero para: mention ≥3 concrete landmarks (Straßen/Plätze/Einkaufszentren/U-Bahn)
5. Services grid (same 6 on every page with stadtteil-agnostic prices)
6. 1 anonymous testimonial tied to a named street (**real or anonymized** — never fake; either use real CHECK24 reviews tagged by district, or mark as "Beispielkunde")
7. "Anfahrt" para with 2-3 real routes / Straßen
8. CTA block + floating WhatsApp
9. JSON-LD: `LocalBusiness` with `addressLocality: "Hamburg"` ONLY (no streetAddress), `areaServed.@type: Place, name: "Hamburg-{Stadtteil}"`, openingHours Mo-Sa, price range.
10. `BreadcrumbList` JSON-LD.

### 5.2 Internal linking

- Home should link to all 22 (current footer has only 6 — expand to all or use a dedicated `/stadtteile/` index page).
- Each Stadtteil page should `nofollow`-free-link to its **Bezirk hub** (7 of the 22 are Bezirk pages) and to 2-3 neighbouring Stadtteile, to build a topical cluster.
- Every service landing (`kuechenspuele-montage-hamburg/` etc.) should link into its 4-5 highest-population Stadtteile.

### 5.3 Citation & off-site

Priority citation sites for Hamburg Handwerk:
1. **Google Business Profile** (primary)
2. **Bing Places for Business**
3. **Apple Maps Business Connect**
4. **CHECK24 Profis** (already active — link in `sameAs`)
5. **Gelbe Seiten** / **Das Örtliche**
6. **Handwerkskammer Hamburg** (your Kammer membership — mentioned in Impressum, ask for listing)
7. **MeinStadt.de / Hamburg.de branchenbuch**
8. **11880.com**
9. **MyHammer**, **Blauarbeit** (your blog criticizes them; but a verified profile is still a citation)
10. **WhatsApp Business catalog** — you already have the account

Make sure NAP is **exactly identical** on all: `Küchen-Montage Hamburg`, `+49 152 18547875`, `info@kuechen-montage-hamburg.de`, Impressum-Adresse only where legally required.

---

## 6. Issue list with options (per CLAUDE.md workflow)

Below the top issues ranked by impact. For each: Options A (recommended), B, C — with tradeoffs.

### Issue #1 — SAB schema violation: streetAddress in home LocalBusiness

`index.html:42` exposes `"streetAddress": "Bossardstr. 12"`. For a SAB with no walk-in customers this is against Google's structured data rules (risk of rich-snippet suppression + map-pack eligibility issues).

- **A. Remove `streetAddress` and `postalCode` from home JSON-LD; keep only `addressLocality/Region/Country`** *(recommended — 5 min, zero risk, aligns with Stadtteile pages which already do this right)*
- B. Keep the full address (status quo). No Google penalty per se, but ambiguous SAB signal.
- C. Remove the whole `address` node, rely on `areaServed`. Slightly more aggressive; accepted by Google for SAB, but loses the HH/Hamburg locality hint.

Recommendation: **A**. Apply same fix to all 5 footers that render the street as visible text — move to "Adresse: siehe Impressum".

### Issue #2 — No AggregateRating on home despite 13+ visible reviews

`index.html` renders ~13 real CHECK24 reviews (4.7★ stated in text) but no `AggregateRating` schema → you lose star rich-snippet in SERPs. Easiest quick-win.

- **A. Add AggregateRating block with `ratingValue: 4.7, reviewCount: 23, bestRating: 5` + parse visible reviews into `Review[]` array** *(recommended — 30 min, huge SERP visibility uplift)*
- B. Add only AggregateRating without individual `Review` nodes. Fast but loses the E-E-A-T signal from named reviewers.
- C. Do nothing. Loses stars in SERP.

Recommendation: **A**.

### Issue #3 — Brand spelling dimorphism across `<title>` vs logo/schema

"Küchenmontage Hamburg" (no hyphen) vs "Küchen-Montage Hamburg" (with hyphen) — 485 vs 33. Fine on-site, but will fragment off-site citation matching.

- **A. Keep "Küchen-Montage Hamburg" as canonical (already dominant); allow "Küchenmontage Hamburg" as freetext keyword in titles and h2, not as entity name** *(recommended)*
- B. Collapse everything to one spelling (search/replace the 33 `<title>` variants). Higher effort, marginal benefit.
- C. Status quo. Minor off-site citation friction.

Recommendation: **A**.

### Issue #4 — Weak 301 on root-level stubs

4-11 word redirect stubs at root scatter PageRank and confuse crawlers. Meta-refresh + canonical is weaker than HTTP 301.

- **A. Move hosting to Cloudflare Pages (free) or Netlify and add `_redirects` for proper 301s** *(recommended if you have 30 min, long-term benefit)*
- B. Add `<meta name="robots" content="noindex, follow">` to all stubs — Google drops them from index, canonical keeps propagating PR
- C. Delete the stubs — clean but may break any old external links

Recommendation: **A** long-term, **B** for now (10 min).

### Issue #5 — `@type: LocalBusiness` too generic

- **A. Change to `HomeAndConstructionBusiness` (schema.org child of LocalBusiness, recommended for Handwerker)** *(recommended)*
- B. Array: `["HomeAndConstructionBusiness","Plumber","Electrician"]`. More specific but some validators warn on multi-type.
- C. Status quo.

Recommendation: **A**. Apply to home + all 22 Stadtteile + all 14 commercial landings.

---

## 7. Deliverable files

- `LOCAL-SEO-AUDIT.md` — this report
- `schema-home.jsonld` — ready-to-paste LocalBusiness JSON-LD for `index.html`
- `schema-service-template.jsonld` — Service+areaServed template for 14 commercial landings
- `per-page-stats.json` — machine-readable per-page word count, landmarks, schema presence (109 pages)
- `stadtteile-uniqueness.json` — pairwise content-overlap analysis
- `schema-files.json` — @type frequency across site

## 8. Open questions for the user

Per CLAUDE.md workflow I'd normally gate each section on user feedback. Auto mode is active, so this is delivered whole. If you want me to execute any of the fixes above (start with Issue #1 + #2 for biggest 15-min win), reply "do #1 #2" or pick a subset.
