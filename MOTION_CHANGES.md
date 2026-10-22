# TerraScope motion and installable app changes

The existing country routes, data sources, layout, colors, authentication and Free/Pro entitlements remain in place. Components import from `motion/react`; the old direct framer-motion dependency was removed.

| Integration | Files and behaviour |
| --- | --- |
| Routes and country identity | Persistent `PageTransition` uses wait-mode pathname transitions. Explorer/globe flags share country layout IDs with profile headers. |
| Scroll and content | `CountryMotion.tsx`: hero parallax, section fade/scale, population/area/GDP counters, staggered facts and accessible typewriting. Shared helpers animate existing city, government, heritage and people content. |
| Search and layers | `CommandPalette.tsx`, `MovingGlobe.tsx`, `LayerSheet.tsx`: modal scale/backdrop fade, staggered options, fly confirmation toast, animated layer panel and swipe-dismiss drawer. |
| Live data and history | Values crossfade on actual updates. Country and globe history use keyed crossfades and spring slider interaction. |
| Game and theme | Correct guesses spring in, incorrect guesses shake, stats count up; active pills and rotating theme icons follow real state. Theme state subscribes to the pre-paint theme store. |
| Cards and compare | Share preview fades/scales and supports swiping formats; country comparison columns enter from opposing sides. |
| 3D globe | Existing engine retains its camera/render lifecycle; dashed flight arcs, magnitude-sized quake pulses, interpolated day/night shading and guided-stop caption transitions enhance existing features. |
| Leader tenure | `leadership-terms.ts` supplies a sourced Nigeria pilot. Its bar ends at the existing editorial snapshot, not a guessed term end. Other countries await verified term dates. |
| Installation | Standalone manifest, branded icons, installer and public offline fallback. Private/API responses are not cached. |

Shared components and tuning: [shared/motion/README.md](shared/motion/README.md).

Verified: Next production build with 237 static pages, 20 existing feature tests, TypeScript and targeted ESLint. Browser checks cover desktop/mobile, country navigation, flag interaction, share format, Cmd/Ctrl+K open/search/close, layer drawer, daily guess POST and rendered result, reduced motion and service-worker readiness. Chromium reports zero installability errors, resolving icons and working offline fallback.

Coverage: headless Chromium exercised the responsive and accessible globe fallback; full GPU rendering, real-device app installation, account-only comparison/HD export and published live earthquake feeds were not exercised. Existing globe/history/tour playback controls continue to control their actual features; the decorative-motion pause switch is removed.

## Changed and new files

### Application and build

- `MOTION_CHANGES.md` (new)
- `app/compare/CompareTool.tsx`
- `app/components/LazyAtlas.tsx`
- `app/components/MovingGlobe.tsx`
- `app/components/NotablePeopleGrid.tsx`
- `app/components/SiteMotion.tsx`
- `app/components/Skeleton.tsx`
- `app/components/ThemeProvider.tsx`
- `app/components/WorldAtlas.tsx`
- `app/components/country/HistoryTimeline.tsx`
- `app/components/country/LiveWidgets.tsx`
- `app/components/country/ShareCountry.tsx`
- `app/components/discovery/CommandPalette.tsx`
- `app/components/discovery/GlobeCanvas.tsx`
- `app/components/discovery/LayerSheet.tsx`
- `app/components/motion/CountryMotion.tsx` (new)
- `app/components/motion/MotionProvider.tsx`
- `app/components/motion/PageTransition.tsx`
- `app/components/motion/PlanSwitch.tsx` (new)
- `app/components/planet/CountUp.tsx`
- `app/components/planet/CountryCard.tsx`
- `app/components/planet/ExplorePlanet.tsx`
- `app/components/planet/GuidedTour.tsx`
- `app/components/planet/HistoryPanel.tsx`
- `app/components/planet/PlanetEngine.tsx`
- `app/countries/CountriesExplorer.tsx`
- `app/countries/[slug]/page.tsx`
- `app/daily/DailyGame.tsx`
- `app/layout.tsx`
- `app/leadership-terms.ts` (new)
- `app/motion.css`
- `app/page.tsx`
- `app/pro/page.tsx`
- `app/template.tsx`
- `package-lock.json`
- `package.json`

### Installable app

- `public/install-app.css` (new)
- `public/install-app.js` (new)
- `public/manifest.webmanifest` (new)
- `public/offline.html` (new)
- `public/sw.js` (new)

### Shared

- `shared/motion/Marquee.tsx` (new)
- `shared/motion/README.md` (new)
- `shared/motion/config.ts` (new)
- `shared/motion/gestures.tsx` (new)
- `shared/motion/overlays.tsx` (new)
- `shared/motion/primitives.tsx` (new)
- `shared/motion/styles.css` (new)
- `shared/motion/useDomMotion.ts` (new)
