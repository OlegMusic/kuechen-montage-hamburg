# Schema.org + Content E-E-A-T Audit — kuechen-montage-hamburg.de
Date: 2026-04-24
Scope: 109 HTML files under repo root (excluding `backend/`, `foto/`, `img/`, `css/`, `js/`, `gsc-data/`).
Method: Python extraction of every `<script type="application/ld+json">` block, JSON-parse, type traversal (incl. `@graph` + nested `provider`/`mainEntity`/`about`), plus text/trust scan of key URLs.
Raw data: `audit-2026-04-24/_audit.json` (full), `_audit.py` (script).

---

## 1. Schema.org type distribution

| Type | Pages |
|---|---:|
| BreadcrumbList | 83 |
| LocalBusiness | 63 (as primary node) / 88 unique pages contain an LB node somewhere |
| FAQPage | 55 |
| Question | 55 (children of FAQPage) |
| Service | 39 |
| AggregateRating | 27 |
| Article | 25 |
| HowTo | 15 |
| WebSite / WebApplication / CollectionPage | 1 each |

**Parse errors:** 0. All JSON-LD blocks across 109 files parse cleanly. Good discipline.

**Notable absence:** no `Product`, `Review` (individual), `Person` (author), `VideoObject`, `ImageObject` (standalone). Given the site publishes reviews (4.9/19), not emitting individual `Review` objects is a missed opportunity.

---

## 2. LocalBusiness audit

**Unique pages with an LB node: 88 / 109.** But depth is uneven:

| Field | Pages having it |
|---|---:|
| locality = "Hamburg" | 51 |
| priceRange | 43 |
| telephone | 63 |
| openingHours(Specification) | 23 |
| areaServed | 24 |
| streetAddress | 1 (only `index.html`) |
| geo (lat/lon) | 1 (only `index.html`) |

**Conclusion:** only the homepage carries a fully-populated LocalBusiness (name, streetAddress "Bossardstr. 12", postalCode 22309, locality Hamburg, region HH, country DE, geo 53.5511/9.9937, priceRange, openingHoursSpecification Mon-Fri 08-20 + Sat 09-16, sameAs WhatsApp, telephone +4915218547875).

Every inner commercial page embeds an LB *inside* `Service.provider`, but those copies omit `streetAddress`, `postalCode`, `geo`, `openingHours` — they are reduced stubs with only `name`, `telephone`, `url`, `image`, `priceRange`, `addressLocality`/`addressRegion`/`addressCountry`, `email`. Google will cross-reference, so this is tolerable, but consistency (same `@id` + `sameAs`) would be cleaner.

**Also missing on index.html LB:**
- `image` (the `profile.jpg` exists — referenced in OG but not in LB JSON)
- `hasMap` (Google Maps URL)
- `aggregateRating` (the 4.9/19 review figures live on inner pages but not on the primary LB node — this is the single biggest missed rich-result opportunity)
- `founder` / `foundingDate` (18 years — map to `foundingDate`)
- `sameAs` beyond WhatsApp (Google Business Profile URL, Instagram, Facebook if any)

---

## 3. Service schema on 14 commercial short URLs

**All 14 URLs: OK.** Each has:
- `Service` with `serviceType`, `areaServed` (Hamburg + 11 surrounding cities typically), `offers` (price + EUR), `aggregateRating` (4.9/19), `description`, `alternateName` (5 synonyms)
- `provider` → LocalBusiness stub (type ✓)

Coverage check:

| Slug | Status | provider=LB |
|---|---|---|
| waschmaschine-anschliessen-hamburg | OK | yes |
| spueltischarmatur-einbau-hamburg | OK | yes |
| kuechenspuele-montage-hamburg | OK | yes |
| geschirrspueler-anschliessen-hamburg | OK | yes |
| trockner-anschliessen-hamburg | OK | yes |
| elektroherd-anschliessen-hamburg | OK | yes |
| ceranfeld-anschliessen-hamburg | OK | yes |
| induktionskochfeld-anschliessen-hamburg | OK | yes |
| kochfeld-installieren-hamburg | OK | yes |
| starkstromdose-installieren-hamburg | OK | yes |
| power-splitter-installieren-hamburg | OK | yes |
| armatur-austauschen-hamburg | OK | yes |
| waschbecken-installieren-hamburg | OK | yes |
| y-stueck-wasserzulauf-installieren-hamburg | OK | yes |

**Nits (consistent across all 14):**
- `aggregateRating` is re-declared on every Service with the same 4.9/19 numbers. Google accepts this but it's "self-rating" without linked `Review` items — fragile to manual-action warning if thin. Add 3-5 inline `Review` objects per Service or attach to LocalBusiness only (safer).
- `offers` lacks `availability`, `validFrom`, `areaServed` at the Offer level. Low-priority.
- No `hoursAvailable` on Service.

---

## 4. FAQPage on `/index.html`

Found. 9 questions, `mainEntity`/`Question`/`acceptedAnswer.text` structure valid.

Topics covered (all highly relevant to commercial queries):
1. Was kostet Waschmaschine anschließen Hamburg — 60€
2. Wie schnell können Sie kommen — same-day
3. Was kostet Küchenmontage Hamburg — 299€
4. Garantie — 5 Jahre
5. Wochenende-Termin — Sa 09-16
6. IKEA-Küchen — ja
7. Anfahrt — ca. 20€
8. Herd-Anschluss — 89€
9. Spülmaschine-Anschluss — 139€

**Verdict:** very well-tuned to the money queries. This is why the home page holds position 4 with a FAQ snippet — **do not touch the order or wording**. Any new questions should be *appended*, never inserted in the middle.

**Minor nit:** Q1 (`"Bei uns kostet ... ab 60€"`) and the Service schema both say "ab 60€", but the meta-description / H1 on some pages still says "ab 49€" (landing page offer). Verify consistency vs. actual pricing to avoid schema price mismatch (`SearchConsole → Rich results` may warn).

---

## 5. HowTo on `/montage-und-installation/*`

13 sub-directories; 12 have `index.html`; **9 of 12 carry a HowTo** (not 13 — the repo has 12 detail pages, not 13):

| Slug | HowTo | steps | totalTime | supply | tool | image/step |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| arbeitsplatte-abdichten | ✓ | 7 | ✓ | ✓ | ✓ | — |
| arbeitsplatte-oelen | ✓ | 8 | ✓ | ✓ | ✓ | — |
| arbeitsplatte-zuschneiden | ✓ | 7 | ✓ | ✓ | ✓ | — |
| armatur-wechseln | ✓ | 6 | ✓ | ✓ | ✓ | — |
| eckventil-austauschen | ✓ | 8 | ✓ | ✓ | ✓ | — |
| siphon-montieren | ✓ | 5 | ✓ | ✓ | ✓ | — |
| spuele-austauschen | ✓ | 7 | ✓ | ✓ | ✓ | — |
| spuelmaschine-anschliessen | ✓ | 7 | ✓ | ✓ | ✓ | — |
| waschmaschine-anschliessen | ✓ | 7 | ✓ | ✓ | ✓ | — |
| kuechenplanung-tipps | — (Article+FAQPage) | 0 | — | — | — | — |
| kuechenspuelen-arten-material | — (Article+FAQPage) | 0 | — | — | — | — |
| wasser-sparen-kueche | — (Article+FAQPage) | 0 | — | — | — | — |

The 3 non-HowTo pages are conceptual (planning tips, sink materials, water-saving tips) — Article + FAQPage is arguably the right schema. **wasser-sparen-kueche could arguably switch to HowTo** (has clearly enumerable steps "Perlator einbauen", "Eco-Taste", etc.) — low-priority judgment call.

**Every HowTo has steps + totalTime + supply + tool, but NONE has per-step `image`.** That's the biggest HowTo gap — Google's HowTo rich result shows step images; without them the rich result degrades to the compact card or suppresses entirely.

Also missing: `estimatedCost` (present with value=0 on the WM page — semantically wrong if tools/supplies cost money; either remove or put real €).

---

## 6. AggregateRating

All **27** occurrences use identical `ratingValue=4.9`, `reviewCount=19`, `bestRating=5`, `worstRating=1`. Plausible for an 18-year sole proprietor (not raised). But:

- Same 19 reviews replicated on 27 pages = Google will de-dupe; better to attach `aggregateRating` **only** to the canonical LocalBusiness node (`index.html`) and to each `Service` node *with `itemReviewed` pointing back to the LB `@id`*, so Google understands they're the same reviews.
- Source of the 19 reviews is undocumented (no `Review` objects on the site). If they're Google Business Profile reviews, link via `sameAs` + `url`; if self-collected, emit 3-5 inline `Review` with `author.name` + `reviewRating` + `datePublished` to pass Google's "hand-curated" check.

---

## 7. Content E-E-A-T — 5 key pages

| URL | Words | H1 | Hamburg in H1 | Internal | External | Imgs | Hero | Hamburg alts | 18J | Meisterbetrieb | HWK | Festpreis | Garantie | WhatsApp | tel: | Impressum |
|---|---:|---:|:-:|---:|---:|---:|:-:|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `/index.html` | 1213 | 1 | ✓ | 66 | 12 | 28 | ✓ | 8 | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |
| `/waschmaschine-anschliessen-hamburg/` | 654 | 1 | ✓ | 22 | 7 | **0** | ✗ | 0 | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ |
| `/kuechenspuele-montage-hamburg/` | 988 | 1 | ✓ | 25 | 7 | **0** | ✗ | 0 | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ |
| `/montage-und-installation/waschmaschine-anschliessen/` | 619 | 1 | ✗ | 22 | 5 | 1 | ✓ | 1 | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ |
| `/pages/services/ikea-kuechenmontage-hamburg.html` | 1144 | 1 | ✓ | 38 | 7 | **0** | ✗ | 0 | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |

**Word counts** are adequate for commercial local pages (500-1200 is the sweet spot). IKEA and home are strongest.

**H1s** (each unique, each correctly keyed):
- `Küchenmontage Küchenaufbau in Hamburg — Ihr Küchenexperte` (home)
- `Waschmaschine anschließen in Hamburg — ab 60€ Festpreis`
- `Küchenspüle Montage Hamburg — ab 149€ Festpreis`
- `Waschmaschine anschließen — Anleitung in 7 Schritten` (ratgeber — correctly Hamburg-less because the how-to is national-intent)
- `IKEA Küchenmontage Hamburg — ab 170€ Festpreis`

All good.

**Critical gaps — shared across all inner pages:**
1. **Zero `Meisterbetrieb` / `Handwerkskammer` mentions across the ENTIRE site.** Global Grep over 109 files: only 6 pages mention HWK (blog posts about competitors + Impressum), none mention "Meisterbetrieb" as a trust claim for the owner. For a German Handwerk site this is a huge E-E-A-T deficit. Either the owner is a Meisterbetrieb (then say so on every page) or is not (then say `Fachbetrieb` / `18 Jahre Erfahrung` more prominently — which is currently done, good).
2. **No `tel:` href anywhere on the site.** All CTAs route to WhatsApp (`wa.me/4915218547875`). Phone number is rendered as text "0152 185 478 75". This is an intentional channel choice (owner wants WhatsApp-first), but it blocks one-tap calling on mobile SERPs and hurts conversion for users who prefer voice. The phone IS in schema (`telephone: +4915218547875`) — so Google will still show a call button in some mobile knowledge panels.
3. **Three commercial pages (WM-Hamburg, Küchenspüle, IKEA-Küchenmontage) have ZERO images.** Not even a stock hero. Double-checked: no `<img>`, no `<picture>`, no `background-image:url()`. Pure text. This is the single biggest on-page quality gap — users bounce, dwell time suffers, and E-E-A-T signals "Experience" rely heavily on first-party photos.
4. **Inner commercial pages miss Impressum/Datenschutz footer links.** Both `waschmaschine-anschliessen-hamburg/` and `kuechenspuele-montage-hamburg/` have none. German consumer law (§5 TMG) requires Impressum accessible "unmittelbar erreichbar" from every page — this is a **legal risk**, not only SEO.

---

## 8. Priority recommendations (top 7)

Ordered by impact × ease.

### P1 — Add Impressum / Datenschutz links in footer of every page (LEGAL + easy)
**Where:** all pages missing footer links. At minimum the 14 short-URL commercial pages (`*-hamburg/index.html`) and the `/montage-und-installation/*` ratgeber.
**Why:** §5 TMG mandates "unmittelbar erreichbar" Impressum; missing links are grounds for Abmahnung (€500-2000+ warning letter) regardless of SEO. Also lowers E-E-A-T Trust signal.
**Impact:** removes legal risk; moderate trust uplift.
**Effort:** 30 min (one footer partial → include everywhere, or sed script).

### P2 — Add real photos + alt="Hamburg" to the 3 image-less commercial pages
**Where:** `waschmaschine-anschliessen-hamburg/`, `kuechenspuele-montage-hamburg/`, `pages/services/ikea-kuechenmontage-hamburg.html`. Add 3-5 images each: hero (completed job), before/after, team photo, tool detail. Alt text must contain "Hamburg" + service keyword ("Waschmaschine angeschlossen in Hamburg-Eimsbüttel", etc.).
**Why:** Google's Helpful Content system rewards original imagery; E-E-A-T "Experience" fed by first-party photos; image-SERP traffic is untapped; bounce-rate improvement.
**Impact:** HIGH. Could unlock position 4→2 for the money queries.
**Effort:** 2-3 hours (assuming photos exist in `/foto/` — check first; otherwise owner needs to supply). File sizes: target <150KB, WebP, 1200×800.

### P3 — Attach aggregateRating to the primary LocalBusiness node on index.html AND add 3-5 inline Review objects
**Where:** `index.html` → LocalBusiness block. Add `aggregateRating: {4.9, 19}` + `review: [...]`. Remove redundant aggregateRating from 14 Service blocks OR link them via `itemReviewed: {"@id": "#local-business"}`.
**Why:** current 27-page duplication looks spammy; Google prefers one canonical source. Inline Review objects pass the "hand-curated" check and unlock the ★-snippet on home.
**Impact:** HIGH — enables AggregateRating rich result on the already-ranking homepage. Review source must be disclosable (own Google Business reviews + `sameAs` link to GBP, or explicit first-party).
**Effort:** 1 hour (add `@id`, restructure 27 blocks).

### P4 — Add HowToStep images to the 9 HowTo ratgeber
**Where:** `/montage-und-installation/{arbeitsplatte-abdichten, arbeitsplatte-oelen, arbeitsplatte-zuschneiden, armatur-wechseln, eckventil-austauschen, siphon-montieren, spuele-austauschen, spuelmaschine-anschliessen, waschmaschine-anschliessen}/index.html`.
**Why:** Google's HowTo rich result shows step thumbnails; without `image` property per step the rich result downgrades. 9 pages × 5-8 steps = 45-72 images. Can start with the 3 top-trafficked (check GSC: `waschmaschine-anschliessen`, `spuele-austauschen`, `armatur-wechseln`).
**Impact:** MEDIUM — direct rich-result upgrade on non-commercial intent, which feeds topical authority (E-E-A-T Expertise).
**Effort:** 3-5 hours per page if shooting new photos; 30 min per page if stock/existing library.

### P5 — Meisterbetrieb / Handwerkskammer trust block on every commercial page
**Where:** same 14 short-URL commercial pages + `pages/services/*`. Add a compact trust bar near H1: "✓ Eingetragen bei Handwerkskammer Hamburg ✓ 18 Jahre Erfahrung ✓ 5 Jahre Garantie ✓ Festpreis" with a link to `/pages/ueber-uns.html` (which should carry HWK-Nummer + Meisterkarte scan).
**Precondition:** confirm owner IS a Meisterbetrieb. If only Handwerker (not Meister), use "Fachbetrieb eingetragen bei HWK Hamburg" (still allowed for certain trades; e.g., "Installateur- und Heizungsbauer-Handwerk" is Meisterpflicht, but "Fliesenleger" is not since 2020).
**Why:** biggest E-E-A-T Trust uplift for a Handwerk site; currently 0 pages carry this signal.
**Impact:** HIGH on Trust signal; may lift rankings for "meisterbetrieb küche hamburg" style queries.
**Effort:** 1 hour to add block; data-gathering dependent on owner response.

### P6 — Add `tel:` href alongside WhatsApp on all CTAs
**Where:** everywhere a `wa.me/...` link appears. Pattern: `<a href="tel:+4915218547875">0152 185 478 75</a>` as a secondary CTA, keep WhatsApp primary.
**Why:** mobile one-tap calling; accessibility; captures the segment that doesn't use WhatsApp. Does not conflict with owner's channel preference — adds a fallback.
**Impact:** MEDIUM on conversion, LOW on rankings. Easy to A/B via analytics.
**Effort:** 20 min (repo-wide find/replace).

### P7 — Enrich the canonical LocalBusiness on index.html
**Where:** `index.html` LB block. Add: `image: "https://kuechen-montage-hamburg.de/img/profile/profile.jpg"`, `hasMap: "<GBP Maps URL>"`, `founder: {"@type":"Person","name":"Oleg"}`, `foundingDate: "2008"` (if 18 years in 2026 = 2008), `sameAs: [WhatsApp, Google Business Profile URL, Instagram/Facebook if any]`, `@id: "https://kuechen-montage-hamburg.de/#local-business"`. Then reference that `@id` from every Service's `provider` instead of re-declaring.
**Why:** strengthens the knowledge-graph entity; DRY the JSON-LD; enables Google to consolidate the 88 LB appearances into one entity.
**Impact:** MEDIUM on knowledge-graph fidelity, LOW on immediate rankings.
**Effort:** 1-2 hours (index.html + `@id` references across 27+ inner pages).

---

## 9. Things that are already good (don't break)

- `/index.html` FAQPage (9 Q/A, position 4 snippet) — leave structure, order, wording.
- All 14 commercial short URLs have Service + LocalBusiness-provider + Breadcrumb + FAQPage.
- Zero JSON parse errors across 109 files — strong technical discipline.
- H1s are unique, keyword-rich, Hamburg-keyed where relevant.
- HowTo pages have supply + tool + totalTime (rare — most competitors skip these).
- BreadcrumbList on 83/109 — good coverage.
- Internal linking density (22-66 per page) is healthy.
