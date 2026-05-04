# Action Plan — kuechen-montage-hamburg.de

**Generated:** 2026-05-04 from FULL-AUDIT-REPORT.md
**Score baseline:** 70.85 / 100
**Estimated score after Critical + High fixes:** ~85 / 100

Tasks below are grouped by priority. Each row: `[ ]` checkbox, action, files affected, effort, why it matters.

---

## CRITICAL — fix this week (blocks indexing or causes Google penalty risk)

### C1. Deploy `llms.txt`
- **What:** push the locally-authored `llms.txt` to GitHub Pages.
- **Files:** `llms.txt` (project root, already exists)
- **Effort:** 2 minutes (`git add llms.txt && git commit && git push`)
- **Why:** AI search crawlers (GPTBot, ClaudeBot, PerplexityBot) currently get 404 on `/llms.txt`. The structured nav file we wrote sits unused.
- **Risk:** zero — additive, no behaviour change.

### C2. Remove 3 noindex redirect stubs from sitemap.xml
- **What:** delete `<url>` blocks for these URLs (sitemap.xml lines 23-25):
  - `https://kuechen-montage-hamburg.de/spuelmaschine-anschliessen-wandsbek.html`
  - `https://kuechen-montage-hamburg.de/waschmaschine-hamburg-nord.html`
  - `https://kuechen-montage-hamburg.de/wasserhahn-harburg.html`
- **Files:** `sitemap.xml`
- **Effort:** 1 minute
- **Why:** all three are `meta robots: noindex` redirect stubs. Sitemap inclusion + noindex is a direct conflict — Googlebot wastes crawl budget and signals confusion.
- **Risk:** zero — removing already-noindex'd pages from sitemap has no downside.

### C3. Fix invalid JSON-LD on Eimsbüttel page
- **What:** add `"@context": "https://schema.org"` to first `<script type="application/ld+json">` block.
- **Files:** `eimsbuettel.html` line 11-17
- **Effort:** 1 minute
- **Why:** the LocalBusiness JSON-LD currently lacks `@context`, making it invalid per the JSON-LD spec. Google's Rich Results Test rejects it; the page emits no usable structured data signal for Google or AI overviews. Confirmed by GEO subagent + parallel review.
- **Risk:** zero — fixes broken markup.

### C4. Resolve dual-index Stadtteil pages
- **What:** for `altona.html` / `wandsbek.html` / `bergedorf.html` / `eimsbuettel.html` / `harburg.html` (root) AND `pages/stadtteile/{altona,bergedorf,eimsbuettel,hamburg-mitte,harburg,wandsbek}.html`:
  - Pick ONE of each pair as canonical (recommendation: keep root for short URL signal)
  - Add `<meta name="robots" content="noindex, follow">` AND `<link rel="canonical" href="https://kuechen-montage-hamburg.de/{root}.html">` to the `/pages/stadtteile/` version
  - Or 301 via meta-refresh stub (the pattern already used for other duplicates)
- **Files:** 6 files in `pages/stadtteile/`
- **Effort:** 15 minutes
- **Why:** confirmed duplicate title `Küchenmontage Altona Hamburg | Küchenmontage & Geräteanschluss` on both `altona.html` and `pages/stadtteile/altona.html`. Without canonical resolution, Google sees two identical pages and may demote both.
- **Constraint:** do NOT delete the secondary files — user has external rank data (Bing) and noindex+canonical is the safer move.

### C5. Fix broken `#manifest` blog CTA
- **What:** in `pages/blog/check24-profis-erfahrungen-nachteile.html` and `pages/blog/myhammer-erfahrungen.html`, replace `href="index.html#manifest"` with one of:
  - (A) `href="pages/kontakt.html"` — simple redirect to contact form
  - (B) Create a real `<section id="manifest">` on `index.html` with the actual manifesto/positioning content the blog CTAs gesture at
  - (C) Remove the CTA entirely
- **Files:** 2 blog post HTML files (and optionally `index.html`)
- **Effort:** 5 minutes for (A) or (C); 30-45 minutes for (B)
- **Why:** the two strongest E-E-A-T blog posts on the entire site end with a dead CTA. Direct credibility hit + crawl error signal.
- **Recommendation:** option (B) if the manifesto content actually exists in product strategy; otherwise (A).

---

## HIGH — fix this month (significant rankings impact)

### H1. Author identity — link blog + ratgeber posts to Person entity
- **What:** in every Article schema across blog posts and ratgeber, change `author` from organisation to:
  ```json
  "author": {
    "@type": "Person",
    "@id": "https://kuechen-montage-hamburg.de/pages/ueber-uns.html#oleg",
    "name": "Oleg Prusincov",
    "url": "https://kuechen-montage-hamburg.de/pages/ueber-uns.html"
  }
  ```
- Also add a visible byline ("Von Oleg Prusincov, Küchenmonteur seit 2008") below the H1 of each blog post and ratgeber.
- **Files:** ~6 blog posts + ~8 ratgeber files = ~14 files
- **Effort:** 30-45 minutes
- **Why:** posts written in first person attributing to "Küchen-Montage Hamburg" (org) instead of "Oleg Prusincov" (person) depresses Experience signal. Affects all platforms (Google AIO, Perplexity, ChatGPT, Bing Copilot).
- **Note:** verify `pages/ueber-uns.html` actually has a `Person` schema with `@id="#oleg"`. If not, add one as part of this task.

### H2. Bezirk-hub doorway-page mitigation
- **What:** the four mid-sized Bezirk hubs (`altona.html` / `wandsbek.html` / `bergedorf.html` / `eimsbuettel.html`, 11-13 KB each) are template-spun byte-for-byte except for city name + 3 landmarks. Path forward (pick one):
  - **Path A (elevate)** — bring all four to the `harburg.html` standard (30 KB): named projects + real PLZ list + neighbourhood-specific photos + 3-5 service mentions specific to each Stadtteil. ~3 hours per Stadtteil = 12 hours total.
  - **Path B (consolidate)** — pick the strongest Bezirk hub (highest GSC + Bing impressions over 90 days), keep it indexable; `noindex, follow` the other three. They retain link equity but stop competing with the canonical.
- **Files:** 4 root Stadtteil files
- **Effort:** Path A 12h / Path B 30 min
- **Why:** Google Sept-2025 QRG explicitly flags template-spun "city-swap" pages as doorway pages. Risk is full-site doorway flag, not just per-page demotion.
- **Recommendation:** check Bing Webmaster + GSC 90-day data first to know which Bezirk hub has standalone earned traffic. If `harburg.html` is the only one earning, Path B is correct. If all 5 earn, Path A becomes worth the effort.
- **Constraint:** do NOT delete pages — noindex only (per `feedback_no_delete_indexed.md`).

### H3. LCP preload hint
- **What:** add to `<head>` of `index.html`:
  ```html
  <link rel="preload" as="image" href="img/profile/profile.webp" fetchpriority="high">
  ```
  Or directly on the `<img>` tag at line 339: `fetchpriority="high"`.
- **Files:** `index.html`
- **Effort:** 1 minute
- **Why:** profile photo is the LCP candidate (550×550, above-fold). Without preload, image discovery waits for CSS parse. Estimated improvement: 0.4-0.7s LCP.
- **Risk:** zero.

### H4. Defer JS
- **What:** add `defer` attribute to `js/main.js` and `js/chat.js` script tags.
- **Files:** `index.html` lines 1015-1016 (and possibly `pages/services/*.html` if scripts are duplicated)
- **Effort:** 30 seconds
- **Why:** explicit defer is preferable to end-of-body placement — allows parser to advance ahead of script downloads.
- **Risk:** very low — verify scripts don't depend on document.write. If they do, leave as-is; otherwise defer.

### H5. Service × Stadtteil page consistency audit
- **What:** read these pages and bring all to the Wandsbek standard (4 named use-cases, sub-district callouts, ≥1,000 words):
  - `spuelmaschine-anschliessen-altona.html`
  - `waschmaschine-anschliessen-altona.html`
  - `waschmaschine-anschliessen-barmbek.html`
  - `wasserhahn-eimsbuettel.html`
  - `spuelmaschine-eimsbuettel.html`
  - `herd-anschliessen-hamburg-mitte.html`
- **Files:** 6 files
- **Effort:** 6 hours (1h per page for content depth)
- **Why:** these pages share the Service × Stadtteil pattern that Google flags as scaledContent if the only delta is city name. Wandsbek shows the differentiation works — replicate it.

### H6. Title-tag truncation fixes (8 pages over 70 chars)
- **What:** rewrite to ≤65 chars:
  - `eimsbuettel.html` (90 → ~60) — current title verbose, e.g., "Küchenmontage Eimsbüttel Hamburg | Festpreis ab 299€"
  - `induktionskochfeld-anschliessen-hamburg/index.html` (78 → ~60)
  - `montage-und-installation/index.html` (79 → ~60)
  - 5 more `montage-und-installation/*` subpages
- **Files:** 8 files
- **Effort:** 30 minutes
- **Why:** Google truncates titles ~60-65 chars on desktop SERPs and ~50-55 on mobile. Truncated titles lose CTR.

### H7. Meta description length fixes (8 pages over 170 chars)
- **What:** rewrite to ≤155 chars:
  - `pages/blog/check24-profis-erfahrungen-nachteile.html` (206 chars)
  - `pages/stadtteile/altona-altstadt.html` (220 chars)
  - `montage-und-installation/index.html` (227 chars)
  - 5 more
- **Files:** 8 files
- **Effort:** 20 minutes
- **Why:** descriptions over 155-160 chars get truncated by Google with "..." mid-sentence. Loss of intent clarity in SERP.

---

## MEDIUM — fix this quarter (optimization opportunities)

### M1. Add `<address>` wrapper to NAP block
- **What:** wrap the contact information block on `index.html` and `pages/kontakt.html` with `<address>...</address>`.
- **Files:** 2 files
- **Effort:** 10 minutes
- **Why:** semantic HTML signal for AI entity extraction (`<address>` is the canonical wrapper for NAP). Cheap citability lift.

### M2. Add `foundingDate` to LocalBusiness schema
- **What:** in `index.html` HomeAndConstructionBusiness JSON-LD, add `"foundingDate": "2008"` (or whichever year is accurate — the site claims "18 Jahre Erfahrung" + "500+ Waschmaschinen seit 2008").
- **Files:** `index.html`
- **Effort:** 1 minute
- **Why:** anchors entity in time for Google AIO knowledge graph matching. Currently AI overviews have to infer from "18 Jahre" copy.

### M3. Tap-target sizing
- **What:** add `min-height: 48px` to `.btn-sm` class in `css/style.css` (currently ~38px).
- **Files:** `css/style.css` line 195
- **Effort:** 30 seconds
- **Why:** Google mobile threshold is 48px. `.btn-sm` falls below.

### M4. Convert `foto/вв_opt.jpg` to WebP + lazy load
- **What:** convert below-fold GARANT cert image to WebP, add `loading="lazy"`.
- **Files:** `foto/` + `index.html` line 648
- **Effort:** 5 minutes
- **Why:** consistency with rest of site, smaller file, defers off-screen load.

### M5. Add `<meta name="referrer">` for DSGVO clarity
- **What:** `<meta name="referrer" content="strict-origin-when-cross-origin">` in `<head>` template.
- **Files:** all pages (template-level if possible)
- **Effort:** 10 minutes
- **Why:** explicit Referrer-Policy declaration for DSGVO signaling and analytics accuracy.

### M6. Update BreadcrumbList position-2 to point to indexable URL
- **What:** in Stadtteil JSON-LD breadcrumbs, change position 2 from `https://kuechen-montage-hamburg.de/#stadtteile` (hash anchor) to `https://kuechen-montage-hamburg.de/pages/stadtteile/` (real index page).
- **Files:** all Stadtteil JSON-LD blocks (~25-30 files)
- **Effort:** 30 minutes (find/replace if scriptable)
- **Why:** richer breadcrumb trail in SERPs, real index page anchored.

### M7. Ratgeber technical depth boost
- **What:** add 2-3 pro-grade specifics per ratgeber/anleitung:
  - Hamburg mains pressure (3-5 bar)
  - DIN 1986-100 reference
  - Standard hose lengths (3 m supply, 1.5 m drain) and booster-pump triggers
- **Files:** ~5 ratgeber files
- **Effort:** 2 hours
- **Why:** lifts ratgeber from "consumer summary" to "Meister-tier" which AI ranks higher for "wie-mache-ich-X" queries.

### M8. Reviews — pursue Google Business Profile embed
- **What:** if GBP exists for the business, add the Google Reviews widget to home + Bezirk pages. If GBP doesn't exist, register one (separate task).
- **Files:** depends on chosen widget
- **Effort:** 1 hour (widget integration) or 1 week (GBP registration + verification)
- **Why:** review count of 20 over 18 years is visibly thin. GBP reviews provide third-party-anchored social proof and drive map-pack rankings.

### M9. Patch `llms.txt` improvements (after C1 deploy)
- **What:** two small additions to `llms.txt`:
  - Add 10-word description for `pages/ratgeber/kuechenmontage-kosten.html` ("Preisbänder für Küchenmontage, IKEA-Aufbau und Geräteanschluss in Hamburg")
  - Verify "Meisterbetrieb-Standard" claim in blockquote — replace with "Handwerksbetrieb mit 18 Jahren Erfahrung" if no Meisterbrief is registered
- **Files:** `llms.txt`
- **Effort:** 5 minutes
- **Why:** minor citability lift after deploy. Meister claim accuracy matters for trust.

---

## LOW — nice to have (backlog)

### L1. CSP via meta tag
- Effort: 30 minutes. Why: defence-in-depth on a static site. Not urgent.

### L2. HSTS preload submission
- Submit at hstspreload.org. Effort: 5 minutes. Why: completeness; no functional gain since site already serves HSTS.

### L3. Add `<table>`-based price matrix on home + IKEA service page
- Effort: 30 minutes. Why: AI crawlers extract structured pricing more reliably from `<table>` than from `<div>` cards.

### L4. Add `<details>`/`<summary>` for visible FAQ
- Effort: 1 hour. Why: native semantic FAQ pattern, AI parsability lift.

### L5. Founder photo on service pages
- Add Oleg's photo + name as "Ihr Küchenmonteur" trust block on each service page.
- Effort: 1 hour (template change).
- Why: Experience signal lift on the highest-traffic page type.

---

## Implementation Roadmap

| Week | Tasks | Score impact (est.) |
|---|---|---|
| Week 1 (this week) | C1, C2, C3, C5, H3, H4 | +5-7 points → ~76-78 |
| Week 2 | C4, H6, H7, M1, M2 | +3-4 points → ~80-82 |
| Week 3-4 | H1, M3-M7 | +2-3 points → ~83-85 |
| Month 2 | H2 (Bezirk-hub strategy decision required), H5 | +3-5 points → ~88-90 |
| Backlog | L1-L5 | +1-2 points → ~90-92 |

**Decision required from operator before H2:** check Bing Webmaster + GSC 90-day impressions/clicks for `altona.html`, `wandsbek.html`, `bergedorf.html`, `eimsbuettel.html`. If only one earns standalone traffic → Path B (consolidate). If all four earn → Path A (elevate). Do not act blind.

---

## Hard Constraints (do NOT violate)

- Home FAQPage JSON-LD: **untouched**, ranks pos-3 for "waschmaschine anschließen hamburg".
- No page deletions: external rank data (Bing) extends beyond GSC's 28-day window. `noindex, follow` is the safer move.
- Entity convention: `PRUlog` (legal) ↔ `Küchen-Montage Hamburg` (public) must remain entity-linked across all schemas.
