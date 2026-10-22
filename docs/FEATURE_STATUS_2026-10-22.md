# Requested TerraScope features — 22 October 2026

This is the implementation map for the feature list supplied with the screenshot bug report. A row marked planned has not been shipped in this release.

| Request | Status | Implementation or next dependency |
| --- | --- | --- |
| Economy and quick stats | Existing, partial | Country profiles already expose sourced GDP/population and a live currency converter. Currency strength needs a defined measure; cost-of-living comparisons need a dated, comparable dataset. An exchange rate alone is not an affordability score. |
| Passport power and visa checker | Planned | Passport/destination selectors, visa categories, visit-purpose/duration rules and checked dates need a maintained entry-requirements dataset and official-source links. |
| Safety and best time | Existing city guidance, partial | Detailed city guides contain safety notes and best-time advice. Country-level risk ratings and current advisories need verified dated sources and regional exceptions. |
| Food and cuisine | Existing city guidance, partial | Detailed city guides contain food suggestions. A full country-level dishes register needs curated dish descriptions and sources. |
| Languages with pronunciation | Language lists exist; audio planned | Basic phrases, translations and audio/voice-language support need a reviewed phrase register and explicit playback controls. |
| Flag, capital and anthem quizzes | Planned | Guess the Country exists at `/daily`; new modes need separate scoring/clue rules. Anthem mode also needs cleared audio sources and a silent-accessible alternative. |
| Country of the Day | Added | Public homepage spotlight, stable per UTC day, full 195-country rotation, linking to the existing country profile. It does not use the daily game's answer state. |
| Live/travel matcher | Planned | Budget/climate/vibe inputs can use current country climate and planner structures, but budget comparisons need a consistent cost register and an explanation of each match. |
| Saved trips and itinerary builder | Existing | `/trips` supports budget allowances, activities, day plans, downloads, saved trips and itinerary editing. The current production browser mode stores plans on the current browser; it is not cross-device account sync. |
| Time zone calling planner | Planned | Live country clocks exist. A multi-person planner needs city/IANA-zone selection, a selected date, daylight-saving handling and overlapping calling hours. |

## Screenshot fixes in this release

- Header controls have separate fixed lanes and no longer overlap the brand at 320–440px.
- Mobile installation lives in the navigation menu; the same button moves back into the desktop header. It is reattached after client-side page navigation.
- More, Theme and Search share controlled state. Opening one closes the others; choosing a theme closes its chooser. Escape/outside click and keyboard search remain usable.
- Homepage and header action arrows use a monochrome SVG, avoiding iPhone emoji substitution.

## Delivery order

The first new return-visit feature in this release is Country of the Day. Next: reuse the existing IANA zones for a calling planner and existing country data for flag/capital quiz modes. Source the cost, visa, safety and phrase/audio datasets before exposing those features as complete.

Verification is recorded in the release result. Visual checks use Chromium desktop/mobile viewport emulation; they are not a physical iPhone Safari test.

## Verified for this release

Next production build and TypeScript checks passed, including 237 generated static pages. All 22 feature tests passed. Targeted ESLint had no errors (the existing unoptimized logo image warning remains). Chromium checks at 320, 360, 390, 393, 440, 768, 1024 and 1440px found no header overlap, brand truncation, clipped search form or document overflow. Desktop/mobile menu exclusivity, theme selection, keyboard search, Escape, installation guidance, reduced motion, Country of the Day, and installer reattachment after client navigation all passed with zero browser runtime errors.
