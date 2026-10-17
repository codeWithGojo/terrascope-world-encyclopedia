# Reported merchandise export partners

`export-partners.json` restores the lost TerraScope trade asset without changing the application. It contains five leading **export** destinations for 182 of the atlas's 195 countries: **910 partner records**. Thirteen country entries explicitly have `partners: null`; those entries are neither zero trade nor an estimate.

Selection: use 2023 if a complete five-partner table is available; otherwise try 2022, then 2021, then WITS's actual latest-available table. The exact data year is stored on every country. The recovered coverage is 150 tables for 2023, five for 2022, five for 2021, and 22 older tables (2000–2020). This exceeds the preceding 181-country recovery; the source tables were retrieved again, rather than reusing remembered numbers.

Missing: Equatorial Guinea, Haiti, Liechtenstein, Monaco, Marshall Islands, Nauru, North Korea, San Marino, Somalia, South Sudan, Chad, Tuvalu and Vatican City. These indicate that no complete table was retrievable in the checked summaries, not that the countries had no exports.

## Use in the globe

- Show **the country-specific year**, especially for older tables. An all-2023 label would be inaccurate.
- Size an illustrative arc by `sharePercent`, not by the rounded value in millions. Shares are of all merchandise exports, not of the five displayed partners.
- Preserve rank and source partner names. “Top five” includes statistical categories when WITS ranks them; do not replace a missing arc with the sixth partner.
- There are 40 rows with `code: null`: Unspecified, Other Asia nes, Bunkers, Free Zones, Special Categories and former Sudan. Show them in the list, but do not invent a point on the globe.
- Another 18 rows point to nine territories outside the 195-country atlas (AS, BM, GU, HK, MP, MS, NC, SX, TK). Their ISO codes are valid. Either obtain explicit reference coordinates from the existing country lookup for an arc endpoint, or leave that arc undrawn while retaining the data row.
- These are trade relationships, not actual flight paths or transport routes. “Export connections” is a precise UI label.

## Provenance and reproduction

Shell requests to WITS returned 403. The official WITS pages were instead retrieved through web-source retrieval. No API key or paid data was used. `source-extracts.json` stores only the selected factual tables, exact retrieved URLs, reporter identifiers and actual years.

For the 22 older tables, dated source URLs were independently cross-checked against the LTST result. Tonga's dated 2014 URL could not be retrieved, so its verified `sourceUrl` remains the LTST page which explicitly displays 2014. Its year is not inferred from the URL.

WITS reporter-code aliases are ZAR → CD, MNT → ME, ROM → RO, TMP → TL and SER → RS. Partner names such as “Serbia, FR(Serbia/Montenegro)” are WITS's retained names; the normalizer avoids assigning a pre-2006 Serbian-Montenegrin partner to present-day Serbia alone.

Rebuild and validate the normalized JSON offline:

```sh
python normalize-trade.py /path/to/world-countries/countries.json
```

The script rejects unknown partner names and checks five ranks, valid ranges and descending reported shares. See `LICENSE-NOTES.md` before reuse.
