import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {travelStats} from '../app/my-travels/stats.ts';
const countries=JSON.parse(fs.readFileSync('public/planet/data/countries.json','utf8'));
test('personal travel statistics count real countries once and exclude unknown codes',()=>{
 const result=travelStats(countries,['NG','JP','NG','US','not-a-country']);
 assert.equal(result.count,3);assert.equal(result.total,195);assert.equal(result.percent,2);assert.equal(result.regionCount,3);
 assert.deepEqual(result.leaders,['Africa','Americas','Asia']);
 assert.deepEqual(travelStats(countries,['NG','GH','JP']).leaders,['Africa']);
});
test('an empty or complete personal map has truthful progress',()=>{
 assert.equal(travelStats(countries,[]).percent,0);assert.deepEqual(travelStats(countries,[]).leaders,[]);
 const full=travelStats(countries,countries.map(c=>c.code));assert.equal(full.percent,100);assert.equal(full.regionCount,5);
 assert.equal(full.regions.reduce((n,r)=>n+r.total,0),195);assert.equal(travelStats([],['NG']).percent,0);
});
