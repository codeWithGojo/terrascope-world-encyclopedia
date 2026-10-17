import test from 'node:test';
import assert from 'node:assert/strict';
import {footballGreats,globalGoats} from '../app/football-greats-data.ts';
import {playerHonoursByName,playerHonoursMethod} from '../app/player-honours-data.ts';

test('six domestic lists and all 36 club lists have ten unique players, including Italy',()=>{
 assert.equal(footballGreats.length,6);assert.ok(footballGreats.some(league=>league.id==='italy'));
 const clubs=footballGreats.flatMap(league=>league.clubs);assert.equal(clubs.length,36);
 for(const list of [...footballGreats.map(league=>league.players),...clubs.map(club=>club.players)]){assert.equal(list.length,10);assert.equal(new Set(list.map(player=>player.name)).size,10);}
 assert.ok(footballGreats.find(league=>league.id==='england').players.some(player=>player.name==='Mohamed Salah'));
});
test('the global top ten preserves the editorial joint first place',()=>{
 assert.equal(globalGoats.length,10);assert.deepEqual(globalGoats.slice(0,2).map(player=>[player.name,player.rank]),[['Cristiano Ronaldo',1],['Lionel Messi',1]]);
 assert.deepEqual(globalGoats.slice(2).map(player=>player.rank),[3,4,5,6,7,8,9,10]);
});
test('every displayed player has an honest honours status and every claimed honour has a source',()=>{
 const players=[...globalGoats,...footballGreats.flatMap(league=>[...league.players,...league.clubs.flatMap(club=>club.players)])];
 for(const player of players){const profile=playerHonoursByName[player.name];assert.ok(profile,player.name);if(!profile.honours.length){assert.equal(profile.status,'not-yet-verified');assert.ok(profile.verificationNote);}else{assert.equal(profile.status,'verified');for(const honour of profile.honours){assert.ok(['award','recognition','record'].includes(honour.kind));assert.ok(new URL(honour.sourceUrl).protocol==='https:');assert.ok(honour.sourceLabel);}}}
 assert.equal(Object.keys(playerHonoursByName).length,playerHonoursMethod.totalPlayers);
 assert.ok(playerHonoursByName['Mohamed Salah'].honours.some(honour=>honour.label.includes('Golden Boot')));
 const messi=playerHonoursByName['Lionel Messi'].honours.find(honour=>honour.label.includes('Ballon'));
 const ronaldo=playerHonoursByName['Cristiano Ronaldo'].honours.find(honour=>honour.label.includes('Ballon'));
 assert.equal(messi.year.split(',').length,8);assert.equal(ronaldo.year.split(',').length,5);
});
