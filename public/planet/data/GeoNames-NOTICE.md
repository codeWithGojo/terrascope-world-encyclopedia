# GeoNames attribution and coordinate matching

Contains information from GeoNames, https://www.geonames.org/, licensed under the Creative Commons Attribution 4.0 International license: https://creativecommons.org/licenses/by/4.0/ .

Original daily dumps retrieved 17 October 2026:
- https://download.geonames.org/export/dump/cities15000.zip
- https://download.geonames.org/export/dump/SZ.zip (Lobamba record, below cities15000's population threshold)
- https://download.geonames.org/export/dump/readme.txt

The original dumps are linked above rather than redistributed. Normalized selections are bundled as `app/datasets/planet/capitals.json` and `app/datasets/planet/cities.json`; the generated public directory and search index are `countries.json` and `places.json`.
Changes comprise normalization, record selection and association with existing TerraScope ISO2 codes and labels; no coordinates or timezone values were invented.

The selection uses a name/alias match in the country's populated-place records. For a display listing multiple capitals, one matching PPLC record is selected for the camera and clock. Jerusalem, Ramallah, Malabo and Lobamba match existing TerraScope display names to populated-place records even though GeoNames assigns another feature code. Coordinate selection does not assert or adjudicate capital status. In particular, do not silently send a card labelled Malabo to differently named Ciudad de la Paz.

Coordinates are WGS84. Timezones are IANA identifiers supplied by the gazetteer and checked against Python's zoneinfo database. GeoNames is community maintained and supplied without a guarantee of accuracy.

Suggested in-product credit: “Place coordinates: GeoNames (CC BY 4.0).” Link the source and license.
