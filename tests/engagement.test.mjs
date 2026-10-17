import test from 'node:test';
import assert from 'node:assert/strict';
import {isPro,entitlements} from '../app/access.ts';
import {utcDay,gameStats,distanceAndDirection,validateGuesses} from '../app/game/engine.ts';
import {buildGame,parseGameOptions} from '../app/game/server.ts';
import {atlasCountries} from '../app/atlas-data.ts';
import {GET as cardRoute} from '../app/api/countries/[slug]/card/route.ts';
import {POST as gameRoute} from '../app/api/game/route.ts';

test('Pro can only be granted through trusted app metadata, with exactly three gated features',()=>{
 assert.equal(isPro(null),false);assert.equal(isPro({user_metadata:{terrascope_pro:true}}),false);
 assert.equal(isPro({app_metadata:{terrascope_pro:'true'}}),false);
 assert.equal(isPro({app_metadata:{terrascope_pro:true}}),true);
 assert.deepEqual(entitlements(null),{pro:false,compare:false,history:false,hdExport:false});
 assert.deepEqual(entitlements({app_metadata:{terrascope_pro:true}}),{pro:true,compare:true,history:true,hdExport:true});
});
test('daily puzzle is stable per UTC day, changes at midnight and hides the answer',()=>{
 const before=utcDay(new Date('2026-10-17T23:59:59Z')),after=utcDay(new Date('2026-10-18T00:00:00Z'));
 const a=buildGame([],{mode:'daily'},before),b=buildGame([],{mode:'daily'},before),c=buildGame([],{mode:'daily'},after);
 assert.equal(a.clues.outline,b.clues.outline);assert.notEqual(a.clues.outline,c.clues.outline);
 assert.equal(a.answer,null);assert.equal(a.clues.flag,null);assert.equal(a.clues.capital,null);assert.equal(a.resetAt,'2026-10-18T00:00:00.000Z');
});
test('six-guess limit, staged clues and successful completion are enforced by the server',()=>{
 const countryCodes=atlasCountries.map(c=>c.code),day='2026-10-17';
 let winner;
 for(const code of countryCodes){const result=buildGame([code],{mode:'daily'},day);if(result.won){winner=code;assert.equal(result.answer.code,code);break;}}
 assert.ok(winner);const wrong=countryCodes.filter(code=>code!==winner);
 const afterTwo=buildGame(wrong.slice(0,2),{mode:'daily'},day);assert.ok(afterTwo.clues.flag);assert.equal(afterTwo.clues.capital,null);
 assert.ok(buildGame(wrong.slice(0,3),{mode:'daily'},day).clues.capital);
 const lost=buildGame(wrong.slice(0,6),{mode:'daily'},day);assert.equal(lost.finished,true);assert.equal(lost.won,false);assert.equal(lost.answer.code,winner);
 assert.throws(()=>buildGame(wrong.slice(0,7),{mode:'daily'},day));assert.throws(()=>buildGame([winner,wrong[0]],{mode:'daily'},day));
 assert.throws(()=>validateGuesses(['NG','NG'],new Set(countryCodes)));
});
test('practice region and hard mode work without a Pro entitlement',()=>{
 const options=parseGameOptions({mode:'practice',seed:'a-valid-fixed-seed-2026',region:'Africa',hard:true});
 const result=buildGame(['JP','US','GB'],options);assert.equal(result.clues.flag,null);assert.equal(result.clues.capital,null);
 for(const code of atlasCountries.filter(c=>c.region==='Africa').map(c=>c.code)){const solved=buildGame([code],options);if(solved.won){assert.equal(solved.mode,'practice');return;}}
 assert.fail('No African answer');
});
test('great-circle hints remain finite at antipodes and point towards the target',()=>{
 const from={code:'A',name:'A',latitude:0,longitude:0};
 const east=distanceAndDirection(from,{code:'B',name:'B',latitude:0,longitude:90});assert.equal(east.direction,'E →');assert.ok(east.distance>10000&&east.distance<10020);
 assert.equal(distanceAndDirection(from,{...from,code:'B',longitude:180}).distance,20015);
});
test('streaks count each completed UTC day once and break after a loss or missing day',()=>{
 const rows=[{day:'2026-10-14',guesses:['NG'],won:true},{day:'2026-10-15',guesses:['NG'],won:true},{day:'2026-10-16',guesses:['NG'],won:true}];
 assert.deepEqual(gameStats([...rows,rows[0]],'2026-10-17'),{played:3,wins:3,streak:3,best:3});
 assert.equal(gameStats(rows,'2026-10-18').streak,0);
 assert.equal(gameStats([...rows,{day:'2026-10-17',guesses:['A','B','C','D','E','F'],won:false}],'2026-10-17').streak,0);
});
test('HTTP handlers reject forged HD access, cross-origin game writes and yesterday’s puzzle',async()=>{
 const hd=await cardRoute(new Request('https://example.test/api/countries/nigeria/card?quality=hd&pro=true'),{params:Promise.resolve({slug:'nigeria'})});assert.equal(hd.status,403);assert.match(hd.headers.get('cache-control'),/no-store/);
 const malicious=await gameRoute(new Request('https://example.test/api/game',{method:'POST',headers:{origin:'https://elsewhere.test'},body:'{}'}));assert.equal(malicious.status,403);
 const old=await gameRoute(new Request('https://example.test/api/game',{method:'POST',headers:{origin:'https://example.test'},body:JSON.stringify({day:'2000-01-01',guesses:[]})}));assert.equal(old.status,409);
});
