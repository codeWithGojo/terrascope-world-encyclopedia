# Explore the Planet

The homepage now contains a scoped, dark and gold exploration section at `/#explore-the-planet`. Existing country routes remain `/countries/[slug]`. No other page implementation, global theme, account policy or payment flow was changed for this section.

## Delivered phases

| Phase | Result |
| --- | --- |
| 1 — Foundation | Scoped near-black/gold tokens, self-hosted Cormorant Garamond and Inter, glass surfaces, grain, masked headlines, count-ups, focus/hover/press states, reduced-motion CSS. |
| 2 — Earth | Pinned desktop story across the Americas, Africa, Asia and Australia; simplified mobile steps; NASA day/cloud imagery, Fresnel atmosphere; draggable globe; all 195 country cards, three facts, capital clocks and existing profile links. |
| 3 — Cities | Lazy MapLibre modal, extruded buildings, local capital/site-city search, tilt/rotation, five layer controls, shareable camera URLs, visible building/road estimates and credited PNG download. |
| 4 — Globe features | Approximate UTC sun position and night lights, four cached data lenses, optional USGS earthquakes, four Earth styles, scoped Cmd/Ctrl+K search with recent searches. |
| 5 — Social and depth | Device-saved travels and portrait sharing; three seven-stop tours; comparison and shared pair URLs; sourced export connections; lazy 1914/1945/1960 historical snapshots. |
| 6 — Access | Existing server-verified account entitlements; Pro comparison, history interface and HD export; free previews; no checkout. All other Planet features remain free. |

## Dependencies

No framework was added. The existing React, Next.js, Vinext, Framer Motion and D3 stack is retained.

| Added dependency | Reason |
| --- | --- |
| `globe.gl@2.46.2` | Requested globe engine; handles spherical polygons, arcs, rings and camera interaction. |
| `three@0.186.1` | Globe.gl's renderer, custom atmosphere/day-night shaders and offscreen image export. |
| `maplibre-gl@6.14.0` | Requested keyless vector-map renderer with building extrusion, terrain and accessible navigation controls. |
| `@types/three@0.186.0` (development) | Type checking for shader/export code. |

All 3D modules load dynamically. Globe code and initial 2K textures load when the section comes within 500px of the viewport. City code loads when the modal opens; terrain/satellite tiles, alternate Earth styles, trade, tours and historical data load when used. Data lenses use bundled observations, not a World Bank request on every page view. Earthquake observations refresh every five minutes only while enabled.

The renderer caps pixel ratio at 1.5, pauses offscreen/in background tabs/behind the city modal, and reduces pixel ratio, clouds and pulse rings after sustained slow frames. Atmosphere uses a Fresnel shader; a separate bloom postprocessing pass was omitted to limit mobile GPU work. Native page scrolling is preserved. Desktop globe wheel zoom is replaced by labelled zoom buttons and keyboard controls; touch pinch zoom remains available.

## Configuration and Pro access

**No new environment variables, API keys or paid services are required for Planet.** Existing Supabase configuration is reused only to read the account's trusted entitlement. If account configuration is unavailable, the section defaults to Free and remains usable.

`app/access.ts` remains the sole `isPro` decision: a verified Auth user's **app metadata** must contain the boolean `terrascope_pro: true`. The homepage obtains `getViewer().features` on the server and passes the feature map to Planet. Browser storage, user-editable metadata and query parameters do not grant access. Do not add a client-side Pro switch. Account administrators can use an existing test account with trusted app metadata to review the three Pro features.

Free portrait export is 1080 × 1350 with a small watermark. Pro also offers 2160 × 2700 export and removes that watermark from travel cards. Logos and required dataset credits remain. Pricing links use the existing `/pro` overview; payments are not open. Historical source files remain independently available with their GPL license; the Pro feature is the interactive viewer.

Existing account/email setup is documented separately in `docs/Country-Features-Setup.md`. No new secrets, database tables or payment webhooks were introduced here.

## Sources and licenses

Complete source URLs, revisions, terms and credits ship in `public/planet/DATA-SOURCES.md` and its linked notices.

| Source | Use | License / terms |
| --- | --- | --- |
| NASA Blue Marble 2002, Black Marble 2016, GEBCO visualization | Five compressed 2048 × 1024 Earth textures | NASA imagery guidance, exact image/processing credits in `textures/CREDITS.md`; not a blanket license for every NASA asset. |
| Natural Earth 110m admin 0 | Flat political texture | Public domain; pinned original GeoJSON. |
| Existing World Borders / world-countries | Modern country picking | ODbL 1.0; existing `/data/world-boundaries-LICENSE.txt`. |
| World Bank | Population, GDP per capita, life expectancy | CC BY 4.0 open-data terms, subject to source exceptions. Actual country observation years and null values retained. |
| Existing International IQ Test 2025 rankings | IQ lens and comparison | Existing site data, source attribution and methodology; no new open-license claim. Self-selected test averages are not innate-ability estimates. |
| GeoNames | Capital/site-city coordinates and IANA zones | CC BY 4.0; selection and attribution notice bundled. |
| NOAA solar equations | Approximate real-time sun direction | Public scientific equations; linked primary document. |
| USGS | Past-24-hour earthquakes | Public domain unless otherwise marked; feed linked in credits. |
| OpenFreeMap, OpenMapTiles, OpenStreetMap | City vectors | OpenStreetMap ODbL 1.0 and required attribution; retained in map and PNGs. |
| Mapterhorn | Terrain tiles | Composite source-specific open-data licenses; attribution linked on the map. |
| NASA GIBS Blue Marble / MODIS 2004 | Satellite city overview | NASA imagery guidance; approximately 500m resolution, explicitly labelled. |
| UN Comtrade through World Bank WITS | Top five merchandise export partners | UN copyright and limited-table redistribution terms; **not CC BY**. Free 910-record extract, 182/195 reporters; row-specific years, 13 explicit gaps. See `data/trade/LICENSE-NOTES.md` before expansion or charging for these data. |
| aourednik/historical-basemaps | 1914, 1945, 1960 borders | **GNU GPLv3**, pinned commit `da7a4b735ecef70aebdc9c73e409d8a2500d50f3`; exact original files, license, README, checksums and notice included. Display transformation only adjusts spherical winding and labels; source code is in `HistoryPanel.tsx`. |
| Cormorant Garamond / Inter | Fonts | SIL Open Font License 1.1; exact notices bundled. |
| Globe.gl / Three.js / Framer Motion; MapLibre GL JS | Rendering | MIT; BSD 3-Clause for MapLibre, with worker license bundled. |

Trade arcs show reported export relationships, not actual flight paths. Forty partner rows are statistical categories; eighteen are territories outside this atlas. They remain in the five-partner table without invented endpoints. Most reporters use 2023; the exact displayed year may be as old as 2000. Historical borders preserve source-era labels and interpretations. Map building heights and visible road lengths are estimates, not survey measurements.

## Automated checks

Use the existing repository installation workflow, then:

```sh
node scripts/prepare-planet.mjs
node node_modules/typescript/bin/tsc --noEmit --pretty false
node node_modules/eslint/bin/eslint.js app/components/planet scripts/prepare-planet.ts
npm run build
npm run build:vercel
node --import ./tests/ts-loader.mjs --test tests/*.test.mjs
```

The preparation script regenerates the public country, place and layer JSON from bundled source snapshots. It performs no network requests. Population, GDP and life expectancy source years are preserved; changing source snapshots requires regenerating and rerunning checks.

Builds and Node tests cover real Worker HTML responses, existing routes, capital zones, city camera validation, clipping of visible roads, solar geometry, missing metric/quake values, travel codes, comparison across the date line/antipodes, tour coverage, trade gaps and historical notices. Static checks cover lazy boundaries and trusted access wiring. They do not execute WebGL shaders or simulate touch gestures.

## Browser acceptance walkthrough

1. Open `/#explore-the-planet` on desktop. Scroll through the four regional facts. Use numbered steps and **Start exploring**; confirm native page scrolling, stable section geometry and visible keyboard focus.
2. Rotate Earth with pointer/arrow keys and zoom with buttons or `+`/`-`. Pick Nigeria, Japan and a small island via both Earth and the country selector. Check the flag, capital clock, three facts and profile link.
3. Open Earth controls. Test all four styles and data lenses, source/year notes, legend and missing values. Enable earthquakes and verify loading, tooltip, refresh and network-failure messages. Confirm no earthquake feed request before enabling it.
4. Press Cmd/Ctrl+K while this section is visible. Search a country, an accented name and a site city; navigate with arrows/Enter, close with Esc and reopen to check recents. Use the visible search button on mobile.
5. Open **Explore the capital in 3D**. Search a site city, rotate/tilt, toggle all layers and inspect stats. Copy the view URL, reopen it, then download a credited PNG. Try blocked map tiles and WebGL-disabled fallback. Satellite is a labelled historical overview, not street-resolution imagery.
6. Mark visits by card and globe, reload, and open a second tab. Select a country you have not visited, then export/share the standard portrait. Verify that only visited countries retain the visit highlight, the image is 1080 × 1350, and the Free watermark is present. Export clears transient selection, data lenses and earthquakes. Block browser storage and confirm the session-only explanation. Test Web Share on a compatible phone and the download fallback elsewhere.
7. Play all three tours; pause, skip, return and exit. Switch tabs and confirm tour timing pauses while hidden. With reduced motion enabled, tours start paused and camera moves do not animate.
8. As Free, open compare/history/HD and check the preview and `/pro` link. Adding `?pro=true` or browser storage flags must not unlock features. Other lenses, tours, cities, travel sharing and trade remain free.
9. With a trusted Pro test account, compare Nigeria/Ghana, swap them and reload `?a=ng&b=gh#explore-the-planet`. Test missing indicators and distant pairs. Load/play the three historical years and return to modern Earth. Export an HD travel card and check 2160 × 2700 dimensions and no Free watermark.
10. Check 360px/390px mobile widths, short landscape screens, keyboard-only operation, reduced motion, slow 3G and a mid-range Android device. Inspect network timing, long tasks, frame rate and memory while repeatedly opening/closing both renderers.

## Verification limits and remaining work

Release checks on 17 October 2026: Sites/Vinext and Next.js production builds passed; TypeScript and Planet ESLint passed; all 51 Node tests passed. Anonymous Worker HTML returned 200 and did not preload the globe or city renderer chunks, including with a forged `?pro=true` query. The only build advisory was the expected size warning for dynamically loaded 3D chunks. A supported browser was unavailable in the execution environment: visual appearance, live WebGL shader compilation, touch gestures, native share sheets, map-provider CORS and sustained 60fps on a real mid-range Android device still require the walkthrough above. Adaptive degradation is implemented; 60fps is not a measured guarantee. No payments were built, as requested. Existing account email setup and email-to-account sync testing remain separate from this homepage feature.

## Files changed

The homepage mounts the section and reads existing access; dependency manifests add the requested renderers. All new UI, datasets, assets and tests are scoped to Planet. The existing rendered-route test was aligned with the already-shipped `/compare` Pro preview.

- `app/components/planet/Boundary.tsx`
- `app/components/planet/CityView.tsx`
- `app/components/planet/ComparePanel.tsx`
- `app/components/planet/CountUp.tsx`
- `app/components/planet/CountryCard.tsx`
- `app/components/planet/ExplorePlanet.tsx`
- `app/components/planet/GuidedTour.tsx`
- `app/components/planet/HistoryPanel.tsx`
- `app/components/planet/LayerControls.tsx`
- `app/components/planet/PlanetEngine.tsx`
- `app/components/planet/PlanetSearch.tsx`
- `app/components/planet/TradePanel.tsx`
- `app/components/planet/UpgradePreview.tsx`
- `app/components/planet/city-style.ts`
- `app/components/planet/city.css`
- `app/components/planet/earth-material.ts`
- `app/components/planet/export-utils.ts`
- `app/components/planet/globe-export.ts`
- `app/components/planet/math.ts`
- `app/components/planet/planet.css`
- `app/components/planet/story.ts`
- `app/components/planet/tokens.css`
- `app/components/planet/travel-card.ts`
- `app/components/planet/types.ts`
- `app/components/planet/useEarthquakes.ts`
- `app/components/planet/useTravels.ts`
- `app/datasets/planet/capitals.json`
- `app/datasets/planet/cities.json`
- `app/datasets/planet/population.json`
- `app/page.tsx`
- `docs/Explore-Planet-Setup.md`
- `package-lock.json`
- `package.json`
- `public/planet/DATA-SOURCES.md`
- `public/planet/data/GeoNames-NOTICE.md`
- `public/planet/data/countries.json`
- `public/planet/data/historical/LICENSE`
- `public/planet/data/historical/NOTICE.md`
- `public/planet/data/historical/UPSTREAM-README.md`
- `public/planet/data/historical/manifest.json`
- `public/planet/data/historical/world_1914.geojson`
- `public/planet/data/historical/world_1945.geojson`
- `public/planet/data/historical/world_1960.geojson`
- `public/planet/data/layers.json`
- `public/planet/data/natural-earth.json`
- `public/planet/data/places.json`
- `public/planet/data/tours.json`
- `public/planet/data/trade/LICENSE-NOTES.md`
- `public/planet/data/trade/README.md`
- `public/planet/data/trade/export-partners.json`
- `public/planet/data/trade/normalize-trade.py`
- `public/planet/data/trade/source-extracts.json`
- `public/planet/fonts/Cormorant-LICENSE.txt`
- `public/planet/fonts/Inter-LICENSE.txt`
- `public/planet/fonts/cormorant-500.woff2`
- `public/planet/fonts/inter-400.woff2`
- `public/planet/fonts/inter-600.woff2`
- `public/planet/textures/CREDITS.md`
- `public/planet/textures/earth-clouds-2k.jpg`
- `public/planet/textures/earth-day-2k.jpg`
- `public/planet/textures/earth-elevation-2k.jpg`
- `public/planet/textures/earth-night-color-2k.jpg`
- `public/planet/textures/earth-night-lights-2k.jpg`
- `public/planet/textures/manifest.json`
- `public/planet/vendor/MapLibre-LICENSE.txt`
- `public/planet/vendor/maplibre-gl-worker.mjs`
- `scripts/prepare-planet.mjs`
- `scripts/prepare-planet.ts`
- `tests/planet-access.test.mjs`
- `tests/planet-city.test.mjs`
- `tests/planet-depth.test.mjs`
- `tests/planet-features.test.mjs`
- `tests/planet-foundation.test.mjs`
- `tests/planet-globe.test.mjs`
- `tests/rendered-html.test.mjs`
