import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {footballPeople} from '../app/people/football-people.ts';
const photos=JSON.parse(await readFile(new URL('../app/people/football-photos.json',import.meta.url)));

test('every dossier has a real, local, small WebP portrait and source credit',async()=>{
 assert.equal(footballPeople.length,63);
 for(const player of footballPeople){
  const photo=photos[player.name];assert.ok(photo,player.name);
  const bytes=await readFile(new URL('../public'+photo.src,import.meta.url));
  assert.equal(bytes.toString('ascii',0,4),'RIFF',player.name);
  assert.equal(bytes.toString('ascii',8,12),'WEBP',player.name);
  assert.ok((await stat(new URL('../public'+photo.src,import.meta.url))).size<150000,player.name);
  assert.ok(photo.credit&&photo.license&&photo.source.startsWith('https://'),player.name);
 }
});
test('honours are dated and omit caps, runner-up finishes and unawarded 2026 Ballons d’Or',()=>{
 for(const p of footballPeople){
  assert.ok(p.story.length>100&&p.recent&&p.sources.length,p.name);
  for(const h of p.honours){assert.match(h,/\d{4}/,p.name);assert.doesNotMatch(h,/senior international|regular|runner.up/i,p.name);assert.doesNotMatch(h,/Ballon.*2026/i,p.name);}
 }
});
test('Saka is an Arsenal legend with an explicit editorial distinction',()=>{
 const p=footballPeople.find(p=>p.name==='Bukayo Saka');assert.equal(p.era,'Legend');assert.equal(p.clubLegacy,'Arsenal legend');assert.match(p.legacy,/editorial/);assert.match(p.honours.join(' '),/Premier League · 2026/);
});
