"""Refresh the World Bank household price index. Visa snapshots are separately reviewed."""
import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDICATOR = "PA.NUS.PRVT.PLI"
URL = f"https://api.worldbank.org/v2/country/all/indicator/{INDICATOR}?format=json&mrnev=1&per_page=400"

with urllib.request.urlopen(URL, timeout=45) as response:
    metadata, rows = json.load(response)

values = {}
for row in rows:
    code, value, year = row["country"]["id"], row["value"], int(row["date"])
    if len(code) == 2 and row["countryiso3code"] and isinstance(value, (int, float)) and value > 0:
        values[code] = {"value": round(value, 2), "year": year}

if metadata["pages"] != 1 or len(values) < 150 or values.get("US", {}).get("value") != 100:
    raise ValueError("Unexpected World Bank coverage or scale; retaining existing data")

dataset = {
    "retrievedAt": datetime.now(timezone.utc).date().isoformat(),
    "sourceUpdatedAt": metadata["lastupdated"],
    "source": "World Bank World Development Indicators",
    "indicator": INDICATOR,
    "sourceUrl": f"https://data.worldbank.org/indicator/{INDICATOR}",
    "method": "Household and NPISH consumption price levels relative to the US (US=100).",
    "values": dict(sorted(values.items())),
}
(ROOT / "app/datasets/household-prices.json").write_text(json.dumps(dataset, indent=2) + "\n")
print(f"{len(values)} household price observations from World Bank release {metadata['lastupdated']}.")
