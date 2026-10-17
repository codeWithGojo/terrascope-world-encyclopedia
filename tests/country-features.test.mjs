import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {cachedFetch} from '../app/server/cached-fetch.ts';
import {parseForecast,parseExchange} from '../app/server/live-data.ts';
import {validCardSize,cardSizes} from '../app/share/card-data.ts';

test('history pilot includes independence, civil war and civilian rule with dated sources',()=>{
 const history=JSON.parse(readFileSync(new URL('../app/history/nigeria.json',import.meta.url)));
 for(const year of [1960,1967,1999])assert.ok(history.events.some(event=>event.year===year));
 for(const event of history.events){assert.ok(new URL(event.sourceUrl).protocol==='https:');assert.ok(event.summary.length>50);}
 assert.deepEqual(history.events.map(e=>e.year),history.events.map(e=>e.year).toSorted((a,b)=>a-b));
});
test('weather does not silently invent missing forecast days or temperatures',()=>{
 const forecast={current:{temperature_2m:27.5,weather_code:3,time:'2026-10-17T12:00'},daily:{time:['2026-10-17','2026-10-18','2026-10-19','2026-10-20','2026-10-21'],temperature_2m_min:[20,21,22,23,24],temperature_2m_max:[30,31,32,33,34],weather_code:[0,1,2,3,61]}};
 assert.equal(parseForecast(forecast).days.length,5);
 assert.throws(()=>parseForecast({...forecast,current:{...forecast.current,temperature_2m:NaN}}));
 assert.throws(()=>parseForecast({...forecast,daily:{...forecast.daily,temperature_2m_min:[20]}}));
 assert.throws(()=>parseExchange({rate:0,date:'2026-10-17',base:'USD',quote:'NGN'}));
 assert.equal(parseExchange({rate:1500,date:'2026-10-17',base:'usd',quote:'ngn'}).quote,'NGN');
});
test('server cache coalesces requests, then returns a labelled saved observation on outage',async()=>{
 let requests=0,fail=false;
 const fetcher=async()=>{requests++;if(fail)throw Error('outage');await new Promise(resolve=>setTimeout(resolve,5));return Response.json({value:27});};
 const [a,b]=await Promise.all([cachedFetch('https://test.invalid/weather',60,x=>x,fetcher),cachedFetch('https://test.invalid/weather',60,x=>x,fetcher)]);
 assert.equal(requests,1);assert.deepEqual(a,b);assert.equal(a.stale,false);
 fail=true;const saved=await cachedFetch('https://test.invalid/weather',0,x=>x,fetcher);
 assert.equal(saved.stale,true);assert.equal(saved.data.value,27);assert.equal(saved.fetchedAt,a.fetchedAt);
 await assert.rejects(cachedFetch('https://test.invalid/no-observation',0,x=>x,fetcher));
});
test('card formats have the requested exact export dimensions and safe defaults',()=>{
 assert.deepEqual([cardSizes.portrait.width,cardSizes.portrait.height],[1080,1350]);
 assert.deepEqual([cardSizes.square.width,cardSizes.square.height],[1080,1080]);
 assert.deepEqual([cardSizes.landscape.width,cardSizes.landscape.height],[1200,630]);
 assert.equal(validCardSize('../../private'),'landscape');
});
