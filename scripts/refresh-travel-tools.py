"""Refresh dated travel reference data. Run from repository root; review diffs before publishing."""
import csv, io, json, urllib.request
from pathlib import Path
from datetime import datetime, timezone
ROOT=Path(__file__).resolve().parents[1]
TODAY=datetime.now(timezone.utc).date().isoformat()
def fetch(url):
 with urllib.request.urlopen(url,timeout=30) as response:return response.read()
def indicator(code):
 url=f'https://api.worldbank.org/v2/country/all/indicator/{code}?format=json&date=2021:{int(TODAY[:4])-1}&per_page=20000'
 data=json.loads(fetch(url))
 if not isinstance(data,list) or len(data)!=2:raise ValueError(f'Invalid World Bank result for {code}')
 return data
ppp=indicator('PA.NUS.PRVT.PP');fx=indicator('PA.NUS.FCRF');rates={(r['country']['id'],r['date']):r['value'] for r in fx[1] if isinstance(r['value'],(float,int)) and r['value']>0};values={}
for row in ppp[1]:
 code,year,value=row['country']['id'],int(row['date']),row['value'];rate=rates.get((code,row['date']))
 if len(code)==2 and value and value>0 and rate and (code not in values or year>values[code]['year']):values[code]={'value':round(value/rate*100,2),'year':year}
if len(values)<150:raise ValueError('Unexpected price coverage drop; retaining existing file')
price={'retrievedAt':TODAY,'sourceUpdatedAt':ppp[0]['lastupdated'],'source':'World Bank World Development Indicators','pppIndicator':'PA.NUS.PRVT.PP','exchangeIndicator':'PA.NUS.FCRF','sourceUrl':'https://data.worldbank.org/indicator/PA.NUS.PRVT.PP','method':'100 × household consumption PPP conversion factor / official exchange rate, same year. Approximate US=100 household price comparison; not monthly rent or a tourist basket.','values':values}
(ROOT/'app/datasets/household-prices.json').write_text(json.dumps(price,indent=2)+'\n')
# Deliberately pinned: changing the retrieval date must never pretend the rules were rechecked.
COMMIT='9c59780dd0dbaefcbdfa0134d21cd99d0d547509'
base=f'https://raw.githubusercontent.com/imorte/passport-index-data/{COMMIT}/'
rows=list(csv.reader(io.StringIO(fetch(base+'passport-index-matrix-iso2.csv').decode())))
if len(rows)<190 or len(rows[0])<190:raise ValueError('Unexpected visa matrix dimensions')
visa={'source':'https://github.com/imorte/passport-index-data','sourceCommit':COMMIT,'asOf':'2026-02-17','retrievedAt':TODAY,'license':'MIT','columns':rows[0][1:],'rows':{r[0]:r[1:] for r in rows[1:]}}
(ROOT/'app/datasets/visas.json').write_text(json.dumps(visa,separators=(',',':'))+'\n')
(ROOT/'app/datasets/visas-LICENSE.txt').write_bytes(fetch(base+'LICENSE'))
print(f'{len(values)} dated household-price observations; visa data still as of {visa["asOf"]}. Review changes before publishing.')
