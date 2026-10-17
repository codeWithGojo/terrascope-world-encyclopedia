# Explore the Planet — sources and licenses

No API key or paid source is used by this section. Retrieved/reviewed 17 October 2026. Historical imagery is labelled separately from real-time sun position and earthquake observations.

| Source | Used for | License / credit |
| --- | --- | --- |
| NASA Blue Marble (2002), Black Marble (2016), NASA GEBCO elevation | Day, cloud, night and elevation textures, compressed to2048×1024 | NASA imagery guidance; factual NASA/GSFC and processing credits retained in [texture credits](textures/CREDITS.md). GEBCO-derived visualization is not analytical terrain. No NASA endorsement is implied. |
| Natural Earth110m admin0, pinned source revision in source notice | Flat-color political Earth | [Public domain](https://www.naturalearthdata.com/about/terms-of-use/). Original GeoJSON bundled. |
| Existing World Borders / world-countries | Clickable195-country polygons | ODbL1.0, [exact existing license](/data/world-boundaries-LICENSE.txt). Simplified for display. |
| World Bank SP.POP.TOTL, NY.GDP.PCAP.CD, SP.DYN.LE00.IN | Population, GDP per capita, life expectancy | World Bank open-data CC BY4.0 unless a dataset says otherwise. Bundled JSON snapshots; country observation years and missing values retained. |
| Existing TerraScope2025 International IQ Test rankings | IQ data lens | Reused site dataset and source links; no new claim of an open license. Self-selected test averages are not estimates of innate ability. |
| GeoNames cities15000 | All195 capital coordinates/timezones and20 existing city guides | CC BY4.0. [GeoNames notice](data/GeoNames-NOTICE.md). Existing capital display names retained. |
| NOAA General Solar Position equations | Approximate UTC sun direction, updated each minute | Public scientific equations: https://gml.noaa.gov/grad/solcalc/solareqns.PDF |
| USGS past-day GeoJSON | Live earthquakes, refreshed every five minutes while enabled | USGS public domain unless otherwise marked: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson |
| OpenFreeMap / OpenMapTiles / OpenStreetMap | City buildings, roads, water and green areas | © OpenStreetMap contributors, ODbL1.0; OpenMapTiles credit. Attribution remains in the map and exported images. Coverage varies; missing heights are estimated. |
| Mapterhorn | Lazy terrain tiles | Composite open datasets with [source-specific credits and licenses](https://mapterhorn.com/attribution/). Links remain visible in map credits. |
| NASA GIBS Blue Marble / MODIS (2004) | Keyless satellite overview | NASA imagery guidance. Approximately500m resolution, not street-resolution satellite photography. |
| Cormorant Garamond / Inter | Self-hosted Latin WOFF2 | SIL Open Font License1.1, exact files in `fonts/`. |
| Globe.gl, Three.js, Framer Motion | Globe, shaders, motion | MIT. |
| MapLibre GL JS6.14.0 | City renderer | BSD3-Clause; exact license in `vendor/MapLibre-LICENSE.txt`. |

Live sources may be delayed or unavailable. Data ranks include only atlas countries with published observations; years differ. Maps are for exploration, not navigation or definitive territorial claims.

## Social and depth data

- Travels: ISO country codes saved on the visitor's device. No location tracking or account upload. Standard images1080×1350; Pro HD2160×2700. Free images retain a small TerraScope watermark.
- Tours: original TerraScope captions and curated camera stops in `data/tours.json`; seven stops each in Tour of Africa, Ancient Wonders and Mega Cities. Selected places, not exhaustive histories or official city-size rankings.
- Trade: UN Comtrade via World Bank WITS.182/195 reporters,910 selected partner records.150 countries use2023, five2022, five2021,22 older snapshots back to2000. Actual year always displayed.13 unavailable reporters are not zero. Statistical categories and non-atlas territories have no arc. This table stays free of charge; it is not CC BY. [Reuse terms](data/trade/LICENSE-NOTES.md) and [provenance/coverage](data/trade/README.md) document UN limited-table re-dissemination terms.
- Historical borders: [aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps), pinned commit `da7a4b735ecef70aebdc9c73e409d8a2500d50f3`. **GNU GPLv3**; exact originals, license, upstream README and [notice](data/historical/NOTICE.md) bundled under `data/historical/`. Display processing only reverses spherical polygon winding where required and adds year/name labels. Original GeoJSON remains unmodified and available under its own GPL terms independently of the Pro interface. Historical interpretations, including colonial relationships, not definitive legal boundaries.
