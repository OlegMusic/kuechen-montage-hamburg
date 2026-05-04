# Full SEO Audit — kuechen-montage-hamburg.de

**Audit date:** 2026-05-04
**Live URL:** https://kuechen-montage-hamburg.de
**Hosting:** GitHub Pages behind Fastly CDN
**Pages crawled:** 76 indexable HTML files (129 total HTML files on disk, 114 in sitemap)
**Method:** Inline analysis of local source + 4 specialist subagents (technical, content, schema, geo) + live header probe

---

## Executive Summary

### SEO Health Score — **71 / 100**

| Category | Weight | Score | Weighted | Status |
|---|---|---|---|---|
| Technical SEO | 22% | 71 | 15.6 | Yellow — sitemap noindex stubs, dual-index Stadtteil pages |
| Content Quality | 23% | 71 | 16.3 | Yellow — strong blog, but Bezirk-hubs templated |
| On-Page SEO | 20% | 75 | 15.0 | Green-ish — 1 duplicate title, 8 over-long titles |
| Schema / Structured Data | 10% | 70 | 7.0 | Yellow — Eimsbüttel `@context` bug, weak author linking |
| Performance (CWV) | 10% | 65 | 6.5 | Yellow — no LCP preload, no `defer`, but CLS-safe |
| AI Search Readiness | 10% | 62 | 6.2 | Yellow — `llms.txt` undeployed, weak semantic HTML |
| Images | 5% | 85 | 4.25 | Green — full alt coverage, mostly WebP |

**Aggregated total: 70.85 / 100**

### Business Type Detected
- **Industry:** Local Service / Brick-and-Mortar Handwerk (Service-Area-Business)
- **Vertical:** Kitchen installation + appliance hookup (Hamburg)
- **Operator:** Oleg Prusincov (named in Impressum)
- **Legal entity:** PRUlog ↔ public brand: Küchen-Montage Hamburg
- **Sub-services:** IKEA Aufbauservice, Waschmaschine, Spülmaschine, Herd, Kochfeld, Spüle, Armatur, Aufmaß, Kücheninstallation, Stadtteil-Anfahrten

### Top 5 Critical Issues

1. **Sitemap lists 3 noindex redirect stubs as priority-0.9 indexable URLs** — `spuelmaschine-anschliessen-wandsbek.html`, `waschmaschine-hamburg-nord.html`, `wasserhahn-harburg.html` (sitemap.xml lines 23-25) are noindex meta-refresh stubs. Conflict between sitemap inclusion and `noindex` meta wastes crawl budget and confuses Googlebot. Fix in 5 minutes.
2. **Eimsbüttel page has invalid JSON-LD** (`eimsbuettel.html` lines 11-17) — first LocalBusiness script block is missing `"@context": "https://schema.org"`. The schema is invalid per the JSON-LD spec, so Rich Results Test rejects it and Google ignores the LocalBusiness signal on this page entirely.
3. **`llms.txt` exists locally but is 404 on live** — file authored 2026-05-03 in project root, not pushed to GitHub Pages. AI search crawlers (GPTBot, ClaudeBot, PerplexityBot) hit `/llms.txt` and get nothing. 1-commit fix.
4. **Bezirk-hub Stadtteil pages are template-spun** — `altona.html` / `wandsbek.html` / `bergedorf.html` / `eimsbuettel.html` are 11-13 KB each, byte-diff shows only city name + 3 landmark names differ. This is the textbook Google `doorway page` pattern (cited explicitly in Sept-2025 QRG). `harburg.html` at 30 KB is the only one with real depth. Risk: full-site doorway flag.
5. **Broken `#manifest` CTA in two blog posts** — `pages/blog/check24-profis-erfahrungen-nachteile.html` and `pages/blog/myhammer-erfahrungen.html` both link to `index.html#manifest`, but `index.html` has 0 occurrences of "manifest". The two strongest E-E-A-T assets on the site end with a dead CTA. Direct credibility hit.

### Top 5 Quick Wins

1. **Deploy `llms.txt`** — `git add llms.txt && git commit -m "feat: add llms.txt for AI crawler structured navigation" && git push`. Effort: 2 minutes.
2. **Add `@context` to Eimsbüttel JSON-LD** — one-line fix at `eimsbuettel.html:11`. Effort: 1 minute.
3. **Remove the 3 noindex stubs from sitemap.xml** — delete lines 23-25. Effort: 1 minute.
4. **Add `defer` to `js/main.js` and `js/chat.js`** in `index.html:1015-1016`. Effort: 30 seconds. Shaves TTI without behaviour change.
5. **Fix `#manifest` blog CTA** — either remove the CTA, point it to `pages/kontakt.html`, or actually create a manifesto section on the homepage. Effort: 5 minutes (decide intent first).

---

## 1. Technical SEO

### 1.1 Crawlability

- **robots.txt** — clean: `User-agent: *`, `Allow: /`, `Disallow: /admin/ /api/ /backend/`. Sitemap reference present. **No bot-specific blocks** — GPTBot/ClaudeBot/PerplexityBot/Google-Extended all allowed.
- **sitemap.xml** — 114 URLs declared. Disk has 129 HTML files; the 16-file delta breaks down as:
  - 5 indexable Bezirk-/PLZ-pages **with content** that ARE in sitemap (verified)
  - 11 disk files NOT in sitemap (mix of orphan stubs + Stadtteil-duplicates):
    - `kuechenmontage-hamburg.html` (root, 539 bytes — `<title>Weiterleitung...</title>`, redirect stub)
    - `herd-anschliessen-altona.html` (root, 669 bytes — redirect stub)
    - `herd-anschliessen-hamburg.html` (root — redirect stub)
    - `pages/services/arbeitsplatte.html` (noindex)
    - `pages/services/elektriker-herd-anschliessen-hamburg.html` (noindex)
    - `pages/stadtteile/altona.html`, `bergedorf.html`, `eimsbuettel.html`, `hamburg-mitte.html`, `harburg.html`, `wandsbek.html` (parallel Stadtteil pages — see §1.2)
    - `power-splitter-hamburg/index.html` (redirect stub)
    - `spuelmaschine-anschliessen-hamburg.html`, `waschmaschine-wandsbek.html` (noindex stubs at root)

### 1.2 Indexability — DUAL-INDEX RISK

**Problem:** Both root-level and `/pages/stadtteile/` versions of the same Stadtteil exist on disk:
- `altona.html` — canonical=self, indexable, **in sitemap**
- `pages/stadtteile/altona.html` — canonical=self, separate file, NOT in sitemap

The byte-diff between `altona.html` and `wandsbek.html` (after stripping city name) shows the two Bezirk-hub root pages are **near-identical templates** — same FAQ, same testimonials structure, same gallery, same service grid. Only city name + 3 neighbourhood landmark names differ.

This applies to all four mid-sized Bezirke (Altona, Wandsbek, Bergedorf, Eimsbüttel — 11-13 KB each). `harburg.html` at 30 KB is the only one with substantively unique copy (PLZ map, neighbourhood specifics, real local-search anchor blocks).

**Severity:** High. Google's Sept-2025 Quality Rater Guidelines explicitly call out *"many similar pages that differ only in the name of a city or region"* as doorway pages.

### 1.3 URL Structure

Mixed conventions live alongside each other:
- Directory-style: `armatur-austauschen-hamburg/`, `waschmaschine-anschliessen-hamburg/`, etc. (sitemap priority 0.95)
- `.html`-style under `/pages/services/`: `pages/services/wasserhahn-austauschen-hamburg.html`, etc. (sitemap priority 0.9)

For `waschmaschine-anschliessen-hamburg/` (directory) vs `pages/services/waschmaschine-anschliessen-hamburg.html` (file) — **two URLs target the same primary keyword**. Both are in the sitemap. Verify they don't carry overlapping content; if they do, canonicalize one to the other.

### 1.4 Security (GitHub Pages context)

GitHub Pages = no custom HTTP headers. Security posture is therefore Pages-default + meta-tag substitutes:
- HTTPS: ✅ enforced by Pages
- HSTS: served by Pages with `max-age=31536000`. **Preload submission** at hstspreload.org not verified — recommend submitting.
- CSP: missing meta `<meta http-equiv="Content-Security-Policy">`. Low risk (no auth, no third-party scripts beyond fonts) but worth adding a minimal policy.
- Referrer-Policy: missing. Add `<meta name="referrer" content="strict-origin-when-cross-origin">` for DSGVO clarity.

### 1.5 CWV signals (HTML-only, no field data)

- **LCP candidate:** `img/profile/profile.webp` (550×550) at `index.html:339`. Has `width`+`height` (✅ CLS safe), but no `<link rel="preload" as="image" fetchpriority="high">` and no `fetchpriority="high"` on the `<img>` itself.
- **JS:** `main.js`, `chat.js` at end-of-`<body>` without `defer` attribute (`index.html:1015-1016`). End-of-body placement is a partial substitute, but explicit `defer` allows parser to advance.
- **Image format:** mostly WebP. One outlier: `foto/вв_opt.jpg` (GARANT cert, line 648). Below the fold; convert to WebP and add `loading="lazy"`.
- **CLS:** all above-fold images have explicit dimensions. Risk is low.
- **Inline CSS / fonts:** standard `<link>` to `css/style.css`. No critical-CSS extraction, but small enough that benefit is marginal.

---

## 2. Content Quality (E-E-A-T)

### 2.1 Operator identity

Impressum lists **Oleg Prusincov** with full address (Bossardstraße 12, 22309 Hamburg), phone, email — clean §5 TMG compliance.

**Inconsistency:** the Article schema on every blog post + Ratgeber attributes `author` to `"Küchen-Montage Hamburg"` (organization) rather than `"Oleg Prusincov"` (person). The blog posts especially are written in first person ("200 Euro im Monat. Für Anfragen, die nie zu Aufträgen werden.") — author should be the person, not the brand. This depresses the Experience signal.

### 2.2 Bezirk-hub doorway-page risk (HIGH)

Confirmed via byte-diff (see §1.2). The four Bezirk-hub pages are template-spun. Two viable paths:
- **Elevate** — bring all four to the Harburg standard: 30 KB with named projects, real PLZ list, neighbourhood-specific photos, 3-5 specific service mentions per Stadtteil (as Wandsbek service-x-district pages already do).
- **Consolidate** — `noindex` 3 of the 4 templated hubs and concentrate link equity on the strongest one.

User has external rank data (Bing, longer GSC windows than 28d) — **do not delete based on weak GSC data alone**. Choose elevate by default.

### 2.3 Service × Stadtteil pages

`spuelmaschine-anschliessen-wandsbek.html` is **strong** (4 named use-cases, sub-district callouts, 1,400 words). `spuelmaschine-anschliessen-altona.html` is the same template at the structural level but with thinner body copy. Audit each Service-x-Stadtteil page and bring all to the Wandsbek standard or `noindex` the weakest.

### 2.4 Blog — strongest E-E-A-T asset

The competitor-critique blog posts (Check24, MyHammer, Blauarbeit, Kleinanzeigen, IKEA Aufbauservice) read as authentic first-person handwerker experience, not SEO-spam. Concrete, citable passages:

- *"Von vielleicht 20 Anfragen im Monat führen höchstens 2-3 zu einem tatsächlichen Auftrag."* (Check24 post)
- *"MyHammer hat sein Geschäftsmodell mehrfach geändert. Ursprünglich funktionierte die Plattform als Reverse-Auktions-Modell."* (MyHammer post)

Both posts cite 20+ external sources including Bundeskartellamt press releases. **This is the brand differentiator — protect and extend.** Issues:
- Dead `#manifest` CTA (top-5 critical)
- Author misattribution (organization, not person)

### 2.5 Ratgeber technical depth

`waschmaschine-anschliessen-anleitung.html` correctly cites: 3/4-Zoll-Gewinde, 60 cm minimum drain height, 2.400 W load warning, Vierteldrehung tightening. Missing pro-grade details that would lift to Meister-tier:
- Hamburg mains pressure range (3-5 bar typical)
- DIN 1986-100 reference for drain connections
- Standard hose lengths (3 m supply, 1.5 m drain) and booster-pump triggers

Adding these 2-3 specifics per ratgeber would meaningfully lift AI citation probability.

### 2.6 Reviews

Homepage `aggregateRating: 4.7, reviewCount: 20` — verifiziert via Check24. Provenance is OK (Check24 profile in `sameAs`), but 20 reviews after 18 years operating is visibly thin. Specific testimonials (Viivi Aurora S., Nassar, Thomas R. in Altona-Altstadt) — first-name + Stadtteil works for DSGVO; the Altona-Altstadt one (specific job: schiefe Wände, Sockelleisten angeglichen) is the strongest. Pursue Google Business Profile review embed.

### 2.7 Word counts

| Page | Words (est.) | Floor | Status |
|---|---|---|---|
| `pages/services/waschmaschine-anschliessen-hamburg.html` | ~900 | 800 | Pass |
| `pages/ratgeber/waschmaschine-anschliessen-anleitung.html` | ~1,200 | 1,500 | **Below** |
| `altona.html` | ~700 | 600 | Pass (but template) |
| `spuelmaschine-anschliessen-wandsbek.html` | ~1,400 | 800 | Pass (strong) |

Ratgeber pages need ~30% more content depth.

### 2.8 Readability

German Flesch-Kincaid estimates (3 sample pages): home FAQ ~55-60, Waschmaschine service ~62-65, Waschmaschine Anleitung ~58-62. All in acceptable range for a German trade audience.

---

## 3. On-Page SEO

### 3.1 Title-tag distribution (76 indexable pages)

| Length | Count | Note |
|---|---|---|
| 50-65 chars | 59 | Optimal zone |
| 66-70 chars | 9 | Borderline |
| 71-90 chars | 8 | **Truncation risk** |

**Pages with titles >70 chars (truncation risk on Google SERP):**
- `eimsbuettel.html` — 90 chars (worst offender)
- `induktionskochfeld-anschliessen-hamburg/` — 78
- `montage-und-installation/index.html` — 79
- `20357.html` — 72
- 5 more `montage-und-installation/*` subpages — 71-74

### 3.2 Duplicate titles

- **`Küchenmontage Altona Hamburg | Küchenmontage & Geräteanschluss`** appears on TWO different files: `altona.html` AND `pages/stadtteile/altona.html` (latter is noindex but title still gets emitted). Confirms the dual-index problem.
- 3 redirect stubs share `<title>Weiterleitung...</title>` — fine since they're noindex.

### 3.3 Meta descriptions

- Average: 147 chars (good — under Google's ~155-160 truncation point)
- 8 pages exceed 170 chars (truncated by Google):
  - `pages/blog/check24-profis-erfahrungen-nachteile.html` (206 chars)
  - `pages/stadtteile/altona-altstadt.html` (220 chars)
  - `montage-und-installation/index.html` (227 chars — worst)
  - 5 more
- 0 pages (excluding redirect stubs) have empty descriptions ✅

### 3.4 H1

All 76 indexable pages have exactly 1 H1. ✅

### 3.5 Canonical correctness

100% of indexable pages have a canonical tag. **One issue:** `altona.html` and `pages/stadtteile/altona.html` both self-canonicalize despite identical title and 95%+ identical content (see §2.2).

### 3.6 Internal linking

Homepage links to **115** internal URLs (high — connects all major service hubs, all 4 Bezirk hubs, all 16 short-URL service landings, blog index, ratgeber index, Stadtteile index, contact, prices, gallery, impressum, datenschutz, garantie). No orphan pages discovered via this audit (would need full crawl to confirm 100%).

---

## 4. Schema / Structured Data

| Page type | Types emitted | Status |
|---|---|---|
| Home (`index.html`) | HomeAndConstructionBusiness + WebSite + FAQPage + AggregateRating | ✅ Pass — entity-linked, `legalName: PRUlog`, `alternateName` array, `@id` anchors. **DO NOT ALTER FAQPage** (pos-3 SERP for "waschmaschine anschließen hamburg") |
| Service pages | Service + LocalBusiness + areaServed Cities | ✅ Pass |
| Stadtteil hubs (`altona.html` etc.) | LocalBusiness + BreadcrumbList | ⚠️ Some are stubs without `@context` |
| `eimsbuettel.html` | LocalBusiness (no @context) | ❌ **Critical:** invalid JSON-LD, line 11-17 missing `"@context": "https://schema.org"` |
| Blog posts | Article + Person (author) + LocalBusiness + Organization | ⚠️ Person `name` is `"Küchen-Montage Hamburg"` (org name) instead of `"Oleg Prusincov"` |
| Ratgeber/Anleitungen | Article + HowTo + HowToStep + MonetaryAmount | ✅ Pass — `totalTime: PT45M`, tool/supply lists, named steps |

### 4.1 Self-serving review check

`AggregateRating` on home (rating 4.7, count 20) is **not self-asserted** — `sameAs` of HomeAndConstructionBusiness includes the Check24 Profis profile URL. This is third-party-anchored and acceptable per Google's 2023 self-serving review policy.

### 4.2 Entity disambiguation

`legalName: "PRUlog"`, `alternateName: ["PRULOG", "PRUlog Küchen-Montage Hamburg"]` on home — both names properly entity-linked. ✅

### 4.3 Missing opportunities

- `Person` schema for Oleg should be linked from every blog post and ratgeber via `"author": {"@id": "https://kuechen-montage-hamburg.de/#oleg"}` (currently each page declares a fresh Organization-typed author with mismatched name)
- `foundingDate` (e.g., "2008") missing from HomeAndConstructionBusiness — anchors entity in time for AI overview matching
- BreadcrumbList on Stadtteil pages uses `#stadtteile` hash anchor instead of `/pages/stadtteile/` indexable URL

---

## 5. Performance / Core Web Vitals

Lab-only (no field data via CrUX since user did not configure Google API). Theoretical assessment from HTML:

- **LCP:** likely 2.0-2.8s (hero image without preload + CSS render-block). Add preload hint to drop into 1.5-2.0s territory.
- **CLS:** ✅ low risk (all above-fold images have width/height).
- **INP:** likely fine (small JS surface, no heavy interactivity blocking).

---

## 6. Images

- **Total `<img>` on home:** 28
- **Alt coverage:** 28/28 = 100% ✅
- **Format mix:** WebP throughout, **except** `foto/вв_opt.jpg` (line 648, GARANT cert image, below-the-fold). Convert + add `loading="lazy"`.
- **`og:image`:** `https://kuechen-montage-hamburg.de/img/profile/profile.webp` resolves with valid 200 (verified live).
- **`width`/`height` attrs:** present on all above-fold images.

---

## 7. AI Search Readiness

### 7.1 `llms.txt`
- File **exists locally** (project root, authored 2026-05-03, llmstxt.org-spec compliant: H1 + blockquote + sectioned URL list + Optional)
- **Live URL returns 404** — file not yet deployed.
- **Action:** push to GitHub.

### 7.2 AI crawler access
- robots.txt allows GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, CCBot — none blocked. ✅

### 7.3 Passage citability — 5 likely AI-search queries

| Query | Page | Score |
|---|---|---|
| "Was kostet Waschmaschine anschließen Hamburg?" | `/pages/services/waschmaschine-anschliessen-hamburg.html` | **STRONG** — 46-word direct answer in FAQ JSON-LD: "Festpreis ab 60€ inklusive Anfahrt..." |
| "Wie lange dauert IKEA Küchenmontage?" | `/pages/services/ikea-kuechenmontage-hamburg.html` | **STRONG** — tiered breakdown (Compact 1 Tag, Standard 1-1.5 Tage, U-Form 2 Tage). Caveat: hero badge says blunt "1-2 Tage", which AI may pick over the nuanced FAQ |
| "Lohnt sich Check24 Profis?" | `/pages/blog/check24-profis-erfahrungen-nachteile.html` | **STRONG** with caveat — "200 Euro im Monat. Für Anfragen, die nie zu Aufträgen werden." Author misattribution (org instead of person) reduces authority signal |
| "Welcher Stadtteil ist Hamburg-Eimsbüttel?" | `eimsbuettel.html` | **WEAK** — neutral district definition is interleaved with commercial pivot ("Genau hier liegt unsere Stärke"). Plus broken JSON-LD on this page |
| "Wie schließe ich eine Waschmaschine selbst an?" | `/pages/ratgeber/waschmaschine-anschliessen-anleitung.html` | **STRONG** — full HowTo schema, named steps, totalTime. Same author-misattribution caveat |

### 7.4 Semantic HTML (citability hints)
- `<address>` for NAP — **missing** on home + kontakt (uses `<div>`/`<p>`). Add for entity extraction signal.
- `<table>` for prices — missing (price tiers are in JSON-LD only). HTML version uses `<div>` cards.
- `<details>`/`<summary>` for FAQ — missing.
- `<dl>`/`<dt>`/`<dd>` — missing.

---

## 8. Subagent attribution

| Subagent | Findings | Score |
|---|---|---|
| seo-technical | 25 findings, 9 categories | 71/100 |
| seo-content | 7 findings, full E-E-A-T breakdown | 71/100 |
| seo-geo | 8 findings, 5-query passage check | 62/100 |
| seo-schema | Schema validation — partial (timed out before final summary) | n/a — covered inline |

Inline analysis covered: sitemap diff, on-page CSV (76 pages), Bezirk-hub byte-diff, internal link count, `#manifest` link verification, live header probe, image/format inventory.

---

## 9. Constraints honored during this audit

- Homepage FAQPage JSON-LD ranking pos-3 for "waschmaschine anschließen hamburg" — **NOT recommended for modification anywhere** (per memory `feedback_kuechen_protect_home_snippet.md`)
- User has external rank data (Bing, longer windows than 28d GSC) — **no recommendations to delete pages based on GSC alone** (per memory `feedback_no_delete_indexed.md`)
- Brand entity convention: PRUlog (legal) ↔ Küchen-Montage Hamburg (public) — **both must remain entity-linked** (per memory `project_kuechen_gbp_entity.md`)
