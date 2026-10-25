import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {athletes,sports,sportsPhoto} from '../app/sports/data.ts';
import {filterAthletes} from '../app/sports/filter.ts';
import {searchEntries} from '../app/components/discovery/search.ts';

test('athlete filters combine sport, country and accent-insensitive search',()=>{
 assert.equal(filterAthletes(athletes,'pele','football','BR')[0].name,'Pelé');
 assert.deepEqual(filterAthletes(athletes,'','basketball','NG').map(p=>p.id),['hakeem-olajuwon']);
 assert.equal(filterAthletes(athletes,'Jordan','cricket','').length,0);
 assert.equal(filterAthletes(athletes,'zzzzzzzz','all','').length,0);
 assert.equal(filterAthletes(athletes,'  ','all','').length,athletes.length);
 assert.ok(filterAthletes(athletes,'Olympic','tennis','').some(p=>p.id==='novak-djokovic'));
});
test('all featured athletes and sport covers have compact local photographs with attribution',async()=>{
 for(const id of [...athletes.map(p=>p.id),...sports.map(s=>`${s.id}-cover`)]){
  const photo=sportsPhoto(id);assert.ok(photo,id);
  const url=new URL('../public'+photo.src,import.meta.url), bytes=await readFile(url);
  assert.equal(bytes.toString('ascii',0,4),'RIFF',id);
  assert.equal(bytes.toString('ascii',8,12),'WEBP',id);
  assert.ok((await stat(url)).size<180000,id);
  assert.ok(photo.author&&photo.license&&photo.source.startsWith('https://'),id);
 }
});
test('global search discovers sport guides and opens specific athlete dossiers',async()=>{
 const index=JSON.parse(await readFile(new URL('../public/data/discovery-index.json',import.meta.url)));
 assert.equal(searchEntries(index,'Basketball')[0].href,'/sports/basketball');
 assert.equal(searchEntries(index,'Mithali Raj')[0].href,'/sports/cricket?athlete=mithali-raj');
 for(const s of sports)assert.ok(index.some(e=>e.href===`/sports/${s.id}`),s.id);
 for(const p of athletes.filter(p=>p.sport!=='football')){
  assert.ok(p.sources.length&&p.reviewedAt&&p.countryCodes.length,p.id);
  assert.ok(index.some(e=>e.href===`/sports/${p.sport}?athlete=${p.id}`),p.id);
 }
});
