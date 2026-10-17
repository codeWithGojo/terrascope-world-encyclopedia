"""Normalize the saved, individually retrieved WITS export-partner tables.

Usage: python normalize-trade.py /path/to/world-countries/countries.json
No request is sent to a third party. The lookup is used only for ISO codes.
"""
import json
import sys
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
saved = json.loads((ROOT / 'source-extracts.json').read_text())
countries = json.loads(Path(sys.argv[1]).read_text())

def normalized(value):
    value = unicodedata.normalize('NFKD', value)
    return ''.join(c.lower() for c in value if c.isalnum())

codes = {}
for country in countries:
    for name in [country['name']['common'], country['name']['official'], *country.get('altSpellings', [])]:
        codes[normalized(name)] = country['cca2']

# WITS display names, including unchanged legacy names for modern reporters.
aliases = {
    'Congo, Dem. Rep.': 'CD', "Cote d'Ivoire": 'CI',
    'Czech Republic': 'CZ', 'Egypt, Arab Rep.': 'EG',
    'Ethiopia(excludes Eritrea)': 'ET', 'Hong Kong, China': 'HK',
    'Iran, Islamic Rep.': 'IR', 'Korea, Rep.': 'KR',
    'Kyrgyz Republic': 'KG', 'Micronesia, Fed. Sts.': 'FM',
    'Russian Federation': 'RU', 'Saint Maarten (Dutch part)': 'SX',
    'Slovak Republic': 'SK', 'St. Kitts and Nevis': 'KN',
    'St. Lucia': 'LC', 'St. Vincent and the Grenadines': 'VC',
    'Syrian Arab Republic': 'SY', 'Turkey': 'TR',
    # These are statistical categories or former territories, not point targets.
    'Bunkers': None, 'Free Zones': None, 'Special Categories': None,
    'Unspecified': None, 'Other Asia, nes': None, 'Fm Sudan': None,
}
codes.update({normalized(name): code for name, code in aliases.items()})

def partner_code(name, year):
    if name == 'Serbia, FR(Serbia/Montenegro)':
        # Do not project the pre-2006 state onto present-day Serbia alone.
        return 'RS' if year >= 2006 else None
    key = normalized(name)
    if key not in codes:
        raise ValueError(f'Unreviewed WITS partner name: {name}')
    return codes[key]

by_country = {}
for country in saved['reporters']:
    code = country['code']
    row = saved['byCountry'][code]
    if row is None:
        by_country[code] = {
            'name': country['name'], 'year': None, 'direction': 'exports',
            'partners': None,
            'reason': 'No complete five-partner reported export table was available in the checked WITS 2023, 2022, 2021 or latest-available summary. Missing is not zero.',
            'sourceUrl': f"https://wits.worldbank.org/CountryProfile/en/Country/{country['cca3']}/Year/LTST/Summarytext",
            'reporterCodeInSource': country['cca3'],
        }
        continue
    partners = [dict(partner, code=partner_code(partner['name'], row['year'])) for partner in row['partners']]
    assert len(partners) == 5
    assert [p['rank'] for p in partners] == [1, 2, 3, 4, 5]
    assert all(0 <= p['sharePercent'] <= 100 and p['valueUsdMillions'] >= 0 for p in partners)
    assert all(a['sharePercent'] >= b['sharePercent'] for a,b in zip(partners,partners[1:]))
    by_country[code] = {
        'name': country['name'], 'year': row['year'], 'direction': 'exports',
        'partners': partners, 'sourceUrl': row['sourceUrl'],
        'retrievedSourceUrl': row.get('retrievedSourceUrl', row['sourceUrl']),
        'reporterCodeInSource': row['reporter'],
    }

available = [row for row in by_country.values() if row['partners'] is not None]
years = Counter(row['year'] for row in available)
output = {
    'source': {
        'name': 'UN Comtrade via World Bank World Integrated Trade Solution (WITS)',
        'url': 'https://wits.worldbank.org/',
        'description': 'Five leading reported merchandise export destinations by value; shares are percentages of each reporter\u2019s total merchandise exports. Exports are FoB. These are export partners, not combined import/export partners, flight routes or transport paths.',
        'retrievedAt': saved['retrievedAt'],
        'selection': 'Prefer 2023; otherwise check 2022, then 2021, then WITS latest-available summary and retain its actual year. No gap filling, mirroring or estimates.',
        'license': 'United Nations copyright; limited-table re-dissemination under UN Comtrade terms. Not CC BY.',
        'termsUrl': 'https://uncomtrade.org/docs/re-dissemination-of-data/',
        'policyUrl': 'https://uncomtrade.org/docs/policy-on-comtrade-data-use/',
        'precisionNote': 'WITS summary values are rounded to whole US$ millions; 0 can mean less than half a million. Shares retain the published two-decimal precision.',
        'geographyNote': 'Partner ISO codes include territories outside the 195-country atlas. Null codes preserve unspecified, special and historical statistical categories. Do not draw an invented arc for them.',
    },
    'coverage': {
        'countries': len(by_country), 'countriesWithData': len(available),
        'countriesMissing': len(by_country) - len(available),
        'partnerRecords': sum(len(row['partners']) for row in available),
        'byYear': dict(sorted(years.items())),
        'missingCodes': [code for code,row in by_country.items() if row['partners'] is None],
        'yearsBefore2021': sum(count for year,count in years.items() if year < 2021),
    },
    'byCountry': by_country,
}
(ROOT / 'export-partners.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(output['coverage']))
