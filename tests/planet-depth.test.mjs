import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validTravels,compareCamera} from '../app/components/planet/math.ts';
import {normalizeTrade} from '../app/components/planet/TradePanel.tsx';
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
test('travel storage accepts unique atlas codes and comparison handles the date line and antipodes',()=>{
 assert.deepEqual(validTravels(['NG','NG','ng','ZZ',null,'GH'],new Set(['NG','GH'])),['GH','NG']);
 assert.deepEqual(validTravels({NG:true},new Set(['NG'])),[]);
 const dateline=compareCamera({latitude:0,longitude:170},{latitude:0,longitude:-170});
 assert.ok(Math.abs(dateline.lng)>179);assert.equal(dateline.lat,0);
 const antipodes=compareCamera({latitude:0,longitude:0},{latitude:0,longitude:180});
 assert.ok(Object.values(antipodes).every(Number.isFinite));assert.equal(antipodes.altitude,3.8);
});
test('three guided tours have seven valid, referenced stops',()=>{
 const tours=read('public/planet/data/tours.json'),countries=new Set(read('public/planet/data/countries.json').map(c=>c.code));
 assert.deepEqual(tours.map(t=>t.id),['africa','ancient','megacities']);
 for(const tour of tours){assert.equal(tour.stops.length,7);for(const s of tour.stops){assert.ok(countries.has(s.code));assert.ok(Math.abs(s.lat)<=90&&Math.abs(s.lon)<=180);assert.ok(s.zoom>.2&&s.zoom<4);assert.ok(s.title&&s.caption);}}
});
test('trade keeps 910 sourced partner records and explicit gaps rather than fabricated arcs',()=>{
 const raw=read('public/planet/data/trade/export-partners.json'),data=normalizeTrade(raw),rows=Object.values(data).filter(Boolean);
 assert.equal(Object.keys(data).length,195);assert.equal(rows.length,182);assert.equal(rows.flatMap(r=>r.partners).length,910);
 assert.equal(data.VA,null);assert.equal(data.GQ,null);assert.equal(data.NG.year,2023);
 assert.equal(data.NG.partners[0].code,'NL');assert.equal(data.NG.partners[0].sharePercent,12.56);
 for(const row of rows){assert.match(row.sourceUrl,/^https:\/\/wits.worldbank.org\//);assert.ok(row.year>=2000&&row.year<=2023);assert.deepEqual(row.partners.map(p=>p.rank),[1,2,3,4,5]);for(const p of row.partners)assert.ok(p.sharePercent>=0&&p.sharePercent<=100);}
 assert.throws(()=>normalizeTrade({}));
});
test('historical snapshots preserve original source geometry and GPLv3 notices',()=>{
 const dir='public/planet/data/historical/';
 for(const year of [1914,1945,1960]){const data=read(`${dir}world_${year}.geojson`);assert.equal(data.type,'FeatureCollection');assert.ok(data.features.length>100);assert.ok(data.features.every(f=>f.geometry));}
 assert.match(fs.readFileSync(`${dir}LICENSE`,'utf8'),/GNU GENERAL PUBLIC LICENSE[\s\S]*Version 3/);
 assert.match(fs.readFileSync(`${dir}NOTICE.md`,'utf8'),/da7a4b735ecef70aebdc9c73e409d8a2500d50f3/);
 const image=fs.readFileSync('app/components/planet/globe-export.ts','utf8');assert.match(image,/WebGLRenderTarget/);assert.doesNotMatch(image,/renderer\.setSize|globe\.width/);
});
