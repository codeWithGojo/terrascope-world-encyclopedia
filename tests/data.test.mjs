import test from 'node:test';
import assert from 'node:assert/strict';
import worldCountries from 'world-countries';
import {populationByCode,worldPopulation,populationDataset} from '../app/population-data.ts';
import {indicatorsByCode,indicatorDataset} from '../app/country-indicators.ts';
import {discoveryGuides,discoveryGuideExtras,discoverySources} from '../app/discovery-guides.ts';

test('all sovereign population records and dated indicator observations have valid units and coverage',()=>{
 const codes=worldCountries.filter(c=>c.unMember||['VA','PS'].includes(c.cca2)).map(c=>c.cca2);
 assert.equal(codes.length,195);assert.equal(Object.keys(populationByCode).length,195);
 for(const code of codes){const record=populationByCode[code];assert.ok(record.value>0);assert.ok(Number.isInteger(record.year)&&record.year<=2026);}
 assert.equal(populationByCode.VA.source,'Vatican City State');assert.ok(worldPopulation.value>8e9&&worldPopulation.value<9e9);
 assert.equal(populationDataset.refreshedAt,indicatorDataset.refreshedAt);
 for(const key of ['gdp','perCapita','lifeExpectancy','internet']){
  const records=Object.entries(indicatorsByCode).filter(([,r])=>r[key]);assert.ok(records.length>=190,key);
  for(const [code,r] of records){assert.ok(codes.includes(code));assert.ok(Number.isFinite(r[key].value)&&r[key].value>=0);assert.ok(Number.isInteger(r[key].year)&&r[key].year>=2000&&r[key].year<=2026);if(key==='internet')assert.ok(r[key].value<=100);if(key==='lifeExpectancy')assert.ok(r[key].value<120);}
 }
 assert.equal(indicatorsByCode.VA,undefined,'do not fabricate unavailable Vatican statistics');
});
test('new detailed guides have complete planning sections and official heritage references',()=>{
 assert.equal(discoveryGuides.length,4);
 for(const guide of discoveryGuides){const path=`${guide.countrySlug}/${guide.citySlug}`;const extra=discoveryGuideExtras[path];assert.ok(extra.gateway);assert.equal(extra.itinerary.length,3);assert.ok(extra.cultureTips.length>=4);assert.ok(guide.attractions.length>=2);assert.ok(discoverySources[path].url.startsWith('https://'));assert.equal(discoverySources[path].checkedAt,'2026-09-30');}
});
