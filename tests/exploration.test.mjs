import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import worldCountries from 'world-countries';
import {journeys} from '../app/escape/journeys.ts';
import {heritageByCode,heritageDataset} from '../app/heritage-data.ts';
import {electionRegister,getElection} from '../app/elections-data.ts';
import {electionMidnight,electionClock} from '../app/election-clock.ts';
import {footballGreats,globalGoats,greatnessMethod} from '../app/football-greats-data.ts';

test('every escape has local, real image assets, an attribution and a usable country destination',()=>{
 const countries=new Set(worldCountries.map(c=>c.cca2));
 assert.equal(journeys.length,12);assert.equal(new Set(journeys.map(j=>j.id)).size,journeys.length);
 assert.equal(journeys.filter(j=>j.panorama).length,4);
 for(const journey of journeys){
  assert.ok(countries.has(journey.countryCode));assert.ok(journey.stops.length>=2);assert.ok(new URL(journey.sourceUrl).protocol==='https:');assert.ok(journey.credit.length>10);
  for(const asset of [journey.image,journey.panorama,...journey.stops.map(s=>s.image)].filter(Boolean)){
   assert.ok(asset.startsWith('/'));const file=new URL('../public'+decodeURIComponent(asset),import.meta.url);assert.ok(existsSync(file),asset);assert.ok(readFileSync(file).length>1000,asset);
  }
 }
});
test('heritage register reconciles active properties and excludes delisted sites',()=>{
 const all=Object.values(heritageByCode).flat();const ids=new Set(all.map(x=>x.id));
 assert.equal(ids.size,heritageDataset.properties);assert.equal(heritageDataset.properties,1273);
 assert.equal(ids.has('1150'),false,'Liverpool was delisted');assert.equal(ids.has('1156'),false,'Dresden was delisted');assert.equal(ids.has('654'),false,'Arabian Oryx Sanctuary was delisted');
 assert.equal(heritageByCode.NG.length,2);assert.ok(heritageByCode.EG.some(s=>s.name.includes('Giza')));
 for(const items of Object.values(heritageByCode)){assert.equal(new Set(items.map(x=>x.id)).size,items.length);for(const x of items){assert.ok(['Cultural','Natural','Mixed'].includes(x.category));assert.ok(x.name.length>2);}}
});
test('election clocks respect reference-zone midnight, election day and expiry',()=>{
 assert.equal(new Date(electionMidnight('2027-01-16','Africa/Lagos')).toISOString(),'2027-01-15T23:00:00.000Z');
 assert.equal(new Date(electionMidnight('2026-11-03','America/New_York')).toISOString(),'2026-11-03T05:00:00.000Z');
 assert.equal(new Date(electionMidnight('2027-04-18','Europe/Paris')).toISOString(),'2027-04-17T22:00:00.000Z');
 const upcoming=electionClock('2027-01-16','Africa/Lagos',Date.parse('2027-01-14T23:00:00Z'));assert.equal(upcoming.state,'upcoming');assert.equal(upcoming.days,1);
 assert.equal(electionClock('2027-01-16','Africa/Lagos',Date.parse('2027-01-16T12:00:00Z')).state,'today');
 const passed=electionClock('2027-01-16','Africa/Lagos',Date.parse('2027-01-17T12:00:00Z'));assert.equal(passed.state,'passed');assert.equal(passed.seconds,0);assert.equal(passed.days,0);
 assert.equal(getElection('ZZ'),undefined);
 assert.equal(new Set(electionRegister.map(x=>x.countryCode)).size,electionRegister.length);
 for(const election of electionRegister){assert.ok(election.sourceUrl.startsWith('https://'));assert.doesNotThrow(()=>new Intl.DateTimeFormat('en',{timeZone:election.timezone}));if(election.status==='confirmed')assert.match(election.date,/^\d{4}-\d{2}-\d{2}$/);else assert.equal(election.date,undefined);}
});
test('football lists keep club, league and career rankings distinct, with complete sources',()=>{
 assert.equal(footballGreats.length,6);assert.equal(globalGoats.length,10);assert.ok(greatnessMethod.note.includes('Subjective'));
 const clubs=footballGreats.flatMap(l=>l.clubs);assert.equal(clubs.length,36);assert.equal(new Set(clubs.map(x=>x.id)).size,36);
 for(const league of footballGreats){assert.equal(league.clubs.length,6);assert.equal(league.players.length,10);assert.equal(new Set(league.players.map(x=>x.name)).size,10);for(const club of league.clubs){assert.equal(club.players.length,10);assert.equal(new Set(club.players.map(x=>x.name)).size,10);assert.ok(club.sourceUrl.startsWith('https://'));for(const player of club.players)assert.ok(player.reason.length>30);}}
});
