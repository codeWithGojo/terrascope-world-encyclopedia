# TerraScope feature delivery — 22 October 2026

| Feature | Delivered behavior | Coverage / limits |
| --- | --- | --- |
| Economy quick stats | Existing dated GDP/population plus new household-price comparison and 30-day currency change on country profiles | World Bank household PPP / same-year official FX gives a broad US=100 comparison, not monthly rent. Currency change needs both Frankfurter dates; missing series stays unavailable |
| Passport explorer | `/travel#passport`, passport/destination/category/search filters and separate visa-free/arrival/ETA counts | MIT-licensed 17 February 2026 community matrix, visibly dated and flagged as older than 90 days. It is not current clearance or a global passport rank; check immigration rules before booking |
| Safety / best time | Country-profile FCDO advisory retrieval with regional warning labels, official links, update/check dates; city-specific seasons | UK government advice is scoped to British travellers. No country is labelled universally safe. Missing advice remains unavailable |
| Food / cuisine | Country cuisine sections consolidate dishes from existing city guides and link back to those guides | Reviewed dishes exist for the ten editorial countries; other profiles link to cuisine research rather than inventing national dishes |
| Phrase pronunciation | 13 phrase packs with explicit speech controls and visible text on every country profile | Browser-synthesised audio requires a matching installed voice. Text stays usable when audio is unsupported; not a native-speaker recording |
| Flag / capital / anthem quiz | `/quiz` alongside `/daily`: ten questions, four choices, feedback, score, browser-local best score, reduced motion | Flags/capitals use 195-country atlas; anthem **title** mode uses 28 titles. No uncleared anthem recordings are included |
| Country of the Day | Existing public UTC daily spotlight with a 195-country rotation | Separate from the daily outline game's answer state |
| Live / travel matcher | `/travel#matcher`: budget, reference basket, climate and vibe filters, reasons and itinerary links | Model uses a user-adjustable US basket and dated household price ratios. Climate only uses the existing eight-country verified seed; selected climate filters exclude missing data |
| Saved trips / itinerary | Existing `/trips` builder, saved plans, edits and downloads; linked from matching and country tools | Production storage remains on the current browser, not cross-device account sync |
| Calling planner | `/travel#calling`: two or three IANA zones, date, local availability, overlapping whole 30-minute calls, local dates and `.ics` export | UTC date is explicit; IANA rules handle daylight saving |

## Changed / new files

Shared: existing `shared/motion` source is reused. Quiz transitions use Motion with the shared spring/reveal conventions and reduced-motion support.

TerraScope:

- `app/travel/page.tsx`, `TravelMatcher.tsx`, `PassportChecker.tsx`, `CallingPlanner.tsx`, `tools.ts`, `PhrasePlayer.tsx`, `phrases.ts`: public travel tools and pure, testable helpers.
- `app/quiz/page.tsx`, `WorldQuiz.tsx`, `engine.ts`: the three quiz modes and local practice state.
- `app/components/country/TravelEssentials.tsx`: price/FX comparison, advisories, cuisine and pronunciation.
- `app/api/countries/[slug]/travel/route.ts`, `strength/route.ts`: bounded official-advice and FX requests with unavailable states.
- `app/datasets/household-prices.json`, `visas.json`, `visas-LICENSE.txt`: dated, attributed reference data.
- `app/travel-tools.css`, `app/layout.tsx`, `app/components/SiteHeader.tsx`, `app/countries/[slug]/page.tsx`, `app/daily/page.tsx`: existing-site integration and navigation.
- `scripts/refresh-travel-tools.py`: reproducible World Bank pairing and pinned visa snapshot, preserving the actual observation date.
- `tests/travel-tools.test.mjs`, `package.json`: visa categories, calling overlaps/DST/input failures, quiz uniqueness and source-based vibe matching.

## Sources and refresh

Price data: [World Bank household consumption PPP](https://data.worldbank.org/indicator/PA.NUS.PRVT.PP) paired with `PA.NUS.FCRF` in the same year; 200 two-letter economy records in the dataset, displayed only within the 195-country atlas. Retrieved 22 October 2026, provider updated 8 October 2026. The conversion is `100 × household PPP / official exchange rate`; no GDP price ratio was substituted.

Visa matrix: [imorte/passport-index-data](https://github.com/imorte/passport-index-data), pinned commit `9c59780dd0dbaefcbdfa0134d21cd99d0d547509`, actual source date 17 February 2026, MIT notice retained. Retrieval date does not refresh the underlying rules. `python scripts/refresh-travel-tools.py` preserves that distinction.

Safety: [GOV.UK content API](https://content-api.publishing.service.gov.uk/reference.html), source-linked FCDO pages. Rates: [Frankfurter](https://frankfurter.dev/). Climate: existing World Bank CCKP / CRU 1991–2020 source register. Phrase packs link to their Wikivoyage language references; browser voices supply audio. Existing country/city editorial source registers remain intact.

## Verification

Next production build and TypeScript pass. 27 feature tests pass, including whole-slot calling overlaps and DST changes. Targeted ESLint passes. Chromium checks at 320/390/768/1440px cover travel layouts, passport/category/search changes, calling selection and calendar downloads, all quiz modes through a complete ten-question round, cuisine, phrase-language selection and reduced motion. No browser runtime errors. These are desktop Chromium viewport checks, not physical-device Safari tests. Actual voice availability, live visa rules and real travel booking outcomes are not asserted.
