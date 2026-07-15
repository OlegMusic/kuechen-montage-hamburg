# SEO sprint 1A - 14.07.2026

## Baseline

Source: SEO Monitor snapshot from 14.07.2026 (GSC through 12.07.2026 and stored DataForSEO SERP).

- `küchenmontage hamburg`: DataForSEO position 2; GSC approximately 2.1.
- `küchenmonteur hamburg`: position 3.
- `küchenmontage`: position 4.
- `küchenmontagen hamburg`: position 6.
- `ikea küchenmontage hamburg`: position 5.
- `küchenaufbau hamburg`: DataForSEO position 11; GSC approximately 2.5 for the query variant.

## Approved ownership

- `/` is the active commercial owner for broad kitchen-montage and kitchen-monteur queries.
- Narrow service pages remain owners of their own intents, including IKEA, Küchenaufbau, Herd, Waschmaschine and Küchenfronten.
- `/pages/services/kuechenmontage-hamburg.html` is a legacy alias only: `noindex`, canonical to `/`, immediate static redirect.
- Do not create `/kuechenmontage-hamburg/`; that URL was a monitor configuration error and never existed on the site.

## Implemented

- Focused the homepage title, description, H1, hero copy and primary price on Küchenmontage Hamburg from 170 EUR.
- Added explicit Product price metadata so a cheaper secondary service cannot overwrite the kitchen-montage offer in JSON-LD.
- Replaced the full legacy duplicate with a compact redirect document.
- Added a reciprocal informational link from the Küchenfronten service page to the matching guide.
- Fixed Google review sync so only `AggregateRating.ratingValue` is updated; individual `Review.reviewRating` values are preserved.
- Rebuilt review blocks from one Google Places request: 4.8 rating, 24 reviews, four current review texts.
- Corrected the SEO Monitor owner map and added an explicit, confirmed profile synchronization command.

## Validation

- Day 0: validate HTML, canonical, redirect and JSON-LD locally.
- Day 7-14: compare GSC clicks, impressions, CTR and best page for the four broad kitchen-montage queries.
- Day 14-28: compare fresh DataForSEO SERP positions and competitors using the same Hamburg/de-DE market.
- Success criterion: `/` remains the only active owner and broad-query positions improve without losses on narrow service pages.

## Verification completed

- `node --test scripts/review-schema-utils.test.mjs scripts/seo-owner-smoke.test.mjs`: 7/7 passed.
- Every JSON-LD block in every HTML file parses successfully.
- Desktop 1280x720 and mobile 390x844: no horizontal overflow; H1 and CTA fit without overlap.
- SEO Monitor: TypeScript check passed; full suite passed (36 files, 354 tests).
