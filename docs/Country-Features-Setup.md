# TerraScope country features — 17 October 2026

This continues the Phase 1/2 checkpoint. The cinematic **Explore the Planet** implementation is separate; this branch does not include its files or homepage insertion.

## Shipped functionality

- Country pages: capital weather and a five-day outlook, USD currency conversion, server-synchronised clocks with a device-clock fallback, loading states, retry controls and source/observation labels.
- Nigeria history pilot: six sourced events, category filters, native keyboard-operable range input and event buttons. Free visitors see a preview; Pro accounts receive the slider. Only Nigeria has an editorially reviewed timeline. Additional countries belong in `app/history/<country>.json` and `app/history/index.ts` after review.
- Share cards: portrait (4:5), square and landscape; real country boundaries, selected-country globe, flag, capital, dated population and three facts. Standard PNG exports are 540×675, 540×540 and 600×315, with a small watermark. Pro HD exports are 1080×1350, 1080×1080 and 1200×630, without the watermark. Web Share falls back to download; link copying has a text fallback. Public OG metadata uses the standard landscape card.
- `/daily`: the same country for everyone, reset at midnight UTC, six distinct guesses, outline/flag/capital/landmark clues, country autocomplete, great-circle distance and compass direction, plotted guesses, local records/streaks, spoiler-free sharing. Practice, region filters and outline-only hard mode are free. Distances are between country reference points, not the nearest borders. New-device account results restore the completed daily round when sync is configured.
- `/account`: Supabase email/password signup, confirmation callback, login, reset password and logout. Without credentials it explains that accounts are being prepared; the free app remains usable.
- `/pro`: three features only: **compare, history slider, HD export**. Every other feature and data layer is free. No payment routes, prices, subscriptions, Paystack credentials or checkout are enabled, following the later **no payments yet** instruction.
- Football: 36 club top-tens across six countries including Italy, six league top-tens, and a global top ten with Cristiano Ronaldo and Lionel Messi tied first. Selected personal awards and recognition have source links and distinct labels; unverified records explicitly say so. Search links now preserve the requested league/player and use working country anchors.

## Account setup

No existing connected Supabase project was named TerraScope. No unrelated project's database was changed, no project was created, and `supabase/setup.sql` has **not** been applied remotely.

1. Choose or create the intended TerraScope Supabase project.
2. Set its Auth site URL to the deployed origin. Allow `<origin>/auth/callback` and `<origin>/auth/callback?recovery=1` as redirects. Keep email confirmation enabled and configure production email delivery before public signup.
3. Set the two public environment variables below in the intended Vercel environment, then redeploy. They must be present at build time for the account client.
4. Run `supabase/setup.sql` in that project's SQL editor. It adds only the result table, a `(user_id, day)` primary key, owner SELECT/INSERT RLS policies and restricted grants. Pro status is never stored in the user-writable result table.
5. Confirm a fresh signup, email confirmation, login, reset, logout and two-device game sync using real accounts. These provider-dependent flows have not been verified without the target project.

| Variable | Purpose | Required now? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Chosen account service URL | Only for accounts and sync |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable client key; never a service-role key | Only for accounts and sync |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used in country OG metadata | Recommended; defaults to existing Vercel domain |
| `OPEN_METEO_API_KEY` | Server-only paid Open-Meteo customer API key | Before commercial weather use |
| `TERRASCOPE_COMMERCIAL_MODE=true` | Disables anonymous weather access unless the paid customer key is configured | When commercial use begins |
| `TERRASCOPE_GAME_SEED` | Optional server-side practice answer salt | Optional; daily schedule is versioned and stable |

### Granting Pro while payments are closed

`app/access.ts` contains the single `isPro` decision. It accepts only `app_metadata.terrascope_pro === true` from a fresh, server-verified Supabase `getUser()` response. Enable it through the Supabase administrator's user management / Admin API for the intended user ID. User-editable `user_metadata`, local storage, URL parameters, client props and session contents are not trusted. No administrative API key is required in the website.

The proxy refreshes account cookies and marks personalised responses private/no-store. Compare and country history are gated during server rendering. HD requests are independently checked on the server and return 403 for Free visitors. HD image responses are private/no-store. Public standard images stay cacheable and watermarked.

### Data and terms

- Weather: capital coordinates where available; otherwise an explicitly labelled country reference point. Open-Meteo's free hosted API is noncommercial. The customer endpoint and server-only API key are supported. Observations and five-day forecasts are checked before caching; errors show retry states. The cache coalesces requests and can serve saved observations up to 24 hours with an explicit stale label.
- Currency: Frankfurter v2 blended reference rates; cached six hours. Unsupported currencies receive a clear fallback. Observation dates remain visible and estimates are not represented as a bank quote.
- Time: a short-cache server timestamp plus elapsed monotonic browser time; server sync failure retains the labelled device-clock fallback.
- History: sources are attached per event in the country JSON. This is a selected timeline, not a complete national history.
- Football: 245 of 357 distinct listed players have at least one sourced selected award, record or official recognition in the recovered register. The remaining 112 show an explicit verification gap. The audit does not claim a complete award history for every player. Club Hall of Fame membership and records are never labelled as competitive individual awards, and team trophies are excluded from these panels.
- Existing provider/licence notes remain in `app/datasets/provider-terms.json`. Happiness data redistribution terms still need confirmation before a paid data product.

## Verification

Run `npm run test:features`, `npx tsc --noEmit` and `npm run build:vercel`. The feature tests cover cache coalescing/outages, missing forecast values, exact card sizes, globe boundary picking and search, UTC puzzle changes, answer concealment, guess validation, practice/hard mode, direction/distance, deduplicated streaks, forged HD requests, cross-origin writes and football coverage/ranks/source status.

The existing data, planning, trip-permission and exploration tests are retained. PNG generation was exercised directly, and standard landscape output was visually inspected. Live weather and NGN reference responses were retrieved successfully. A supported browser-control plugin was unavailable, so full browser/mobile interaction QA has not been completed. Supabase email delivery, account sync and a real signed-in Pro account still require the chosen project.

## Changed areas

| Phase | Files / directories |
| --- | --- |
| Recovered 1/2 foundation | Theme/motion/discovery components, tokens and `premium.css`, `theme.ts`, `template.tsx`, `globe-types.ts`, `globe-layers.ts`, data-layer route, `app/datasets`, `public/data`, discovery preparation scripts and theme/discovery tests |
| Country features | `app/components/country`, `app/history`, `app/live-types.ts`, `app/server`, country weather/currency/time/card routes, `app/share`, `app/countries/[slug]/page.tsx`, `app/country-features.css` |
| Game/accounts/Pro | `app/game`, `app/daily`, `app/api/game`, `app/api/account/games`, `app/account`, `app/auth`, `app/access.ts`, `app/pro`, `app/components/ProGate.tsx`, `app/compare/page.tsx`, `proxy.ts`, `app/engagement.css`, `supabase/setup.sql` |
| Football | `app/football-greats-data.ts`, `app/player-honours-data.ts`, `app/football-archive/greats` and football audit tests |
| Integration | `app/components/SiteHeader.tsx`, `app/layout.tsx`, package manifest/lockfile, feature tests and this setup guide |

The two new Supabase packages are pinned to the current checked versions. They provide maintained PKCE/cookie handling and session refresh without adding another framework. Country images use the existing Next.js `ImageResponse`, and game geometry reuses the existing `d3-geo` dependency.
