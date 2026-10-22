import test from 'node:test';import assert from 'node:assert/strict';
import {countryOfDay} from '../app/country-of-day.ts';

test('country spotlight is stable per UTC day, independent of input ordering and non-mutating',()=>{
 const source=[{code:'NG'},{code:'JP'},{code:'BR'},{code:'GH'}],before=JSON.stringify(source);
 const morning=countryOfDay(source,new Date('2026-10-22T00:00:00Z')),evening=countryOfDay([...source].reverse(),new Date('2026-10-22T23:59:59Z'));
 assert.deepEqual(morning,evening);assert.equal(JSON.stringify(source),before);
 assert.equal(morning.day,'2026-10-22');
 assert.notEqual(countryOfDay(source,new Date('2026-10-23T00:00:00Z')).country.code,morning.country.code);
});
test('spotlight covers the whole supplied register and handles an empty register',()=>{
 const source=[{code:'NG'},{code:'JP'},{code:'BR'},{code:'GH'}],seen=new Set();
 for(let offset=0;offset<source.length;offset++)seen.add(countryOfDay(source,new Date(Date.UTC(2026,9,22+offset))).country.code);
 assert.equal(seen.size,source.length);assert.equal(countryOfDay([],new Date('2026-10-22')),null);
});
