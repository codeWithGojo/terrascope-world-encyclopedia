import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {scoreCompetitions,normaliseScoreboard,validScoreDate,safeScoreLink,isScoreboard} from '../app/sports/scoreboard.ts';
import {getSportsScores} from '../app/server/sports-scores.ts';
import {GET} from '../app/api/sports/scores/route.ts';
import {parseFavourites} from '../app/sports/favourites-store.ts';
import {makeSportsRound,knowledgeQuestions} from '../app/sports/quiz-data.ts';
import {athletes} from '../app/sports/data.ts';
import {careerProfiles,comparisonRows} from '../app/sports/careers.ts';
import {sportsTeams,sportsTools} from '../app/sports/catalog.ts';
const date='2026-10-25',now=Date.parse(date+'T10:00:00Z');
const competition=id=>scoreCompetitions.find(c=>c.id===id);
const match=(id,state='pre',day=date)=>({id,date:day+'T15:00:00Z',status:{type:{state,shortDetail:state==='pre'?'Scheduled':'Final'}},competitors:[{team:{displayName:'Home'},score:'0'},{team:{displayName:'Away'},score:'0'}]});

test('scoreboard does not invent fixture scores and preserves actual results',()=>{
 const output=normaliseScoreboard({events:[{...match('1'),competitions:[match('1')]},{...match('2','post'),competitions:[{...match('2','post'),competitors:[{team:{displayName:'Home'},score:'3',winner:true},{team:{displayName:'Away'},score:'1'}]}]}]},competition('premier-league'),date);
 assert.equal(output.length,2);assert.deepEqual(output[0].competitors.map(c=>c.score),['—','—']);assert.equal(output[1].competitors[0].score,'3');assert.equal(output[1].competitors[0].winner,true);
});
test('tennis tournament groups are flattened and restricted to the chosen UTC day',()=>{
 const tennisMatch={...match('a','post'),competitors:[{athlete:{displayName:'Player One'},linescores:[{value:6},{value:7}]},{athlete:{displayName:'Player Two'},linescores:[{value:3},{value:5}]}]};
 const raw={events:[{name:'A tournament',groupings:[{competitions:[tennisMatch,match('other','post','2026-10-24')]}]}]};
 const rows=normaliseScoreboard(raw,competition('atp'),date);assert.equal(rows.length,1);assert.equal(rows[0].competitors[0].score,'6 7');assert.equal(rows[0].competitors[0].name,'Player One');
});
test('cricket retains multi-day matches and complete innings strings',()=>{
 const rows=normaliseScoreboard({sports:[{leagues:[{name:'Test series',events:[{id:'c',date:'2026-10-23T09:00:00Z',status:'in',summary:'Stumps',competitors:[{displayName:'Side A',score:'317'},{displayName:'Side B',score:'113 & 106/2 (36 ov)'}]}]}]}]},competition('cricket'),date);
 assert.equal(rows.length,1);assert.equal(rows[0].state,'in');assert.equal(rows[0].status,'Stumps');assert.equal(rows[0].competitors[1].score,'113 & 106/2 (36 ov)');
});
test('tennis doubles competitors use roster names rather than missing athlete records',()=>{
 const rows=normaliseScoreboard({events:[{name:'Doubles final',groupings:[{competitions:[{...match('d','in'),status:{type:{state:'in',detail:'2nd Set',shortDetail:'2nd'}},competitors:[{roster:{displayName:'A / B'},linescores:[{value:6},{value:3}]},{roster:{displayName:'C / D'},linescores:[{value:4},{value:5}]}]}]}]}]},competition('atp'),date);
 assert.equal(rows[0].competitors[0].name,'A / B');assert.equal(rows[0].competitors[1].name,'C / D');assert.equal(rows[0].status,'2nd Set');
});
test('malformed provider data, unsafe links and invalid dates fail closed',()=>{
 assert.throws(()=>normaliseScoreboard({error:'blocked'},competition('nba'),date));assert.equal(validScoreDate('2026-02-30'),false);assert.equal(validScoreDate('2026-10-25'),true);
 assert.equal(safeScoreLink('javascript:alert(1)','https://www.espn.com/'),'https://www.espn.com/');assert.equal(safeScoreLink('https://espn.com.evil.test/','https://www.espn.com/'),'https://www.espn.com/');
 assert.equal(isScoreboard({matches:[],source:'ESPN',fetchedAt:'invalid',stale:false}),false);
});
test('concurrent requests coalesce; brief outages return labelled saved observations and old data expires',async()=>{
 let calls=0,release;const gate=new Promise(r=>release=r);const fetcher=async()=>{calls++;await gate;return Response.json({events:[{competitions:[match('cache','post')]}]});};
 const a=getSportsScores('nba',date,fetcher,now),b=getSportsScores('nba',date,fetcher,now);release();const [one,two]=await Promise.all([a,b]);assert.equal(calls,1);assert.equal(one,two);assert.equal(one.stale,false);assert.equal(isScoreboard(one),true);
 const fail=async()=>{throw Error('provider outage');};const stale=await getSportsScores('nba',date,fail,now+61000);assert.equal(stale.stale,true);assert.equal(stale.fetchedAt,one.fetchedAt);
 await assert.rejects(getSportsScores('nba',date,fail,now+16*60000));
});
test('public score route rejects arbitrary providers and malformed date input before network calls',async()=>{
 for(const query of ['competition=https://evil.test','date=2026-02-30','competition=nba&date=1900-01-01']){const response=await GET(new Request('https://example.test/api/sports/scores?'+query));assert.equal(response.status,400);}
});
test('favourites schema excludes malformed entries, deduplicates and bounds saved data',()=>{
 assert.deepEqual(parseFavourites('bad-json'),[]);assert.deepEqual(parseFavourites(JSON.stringify(['athlete:michael-jordan','athlete:michael-jordan','team:arsenal','https://evil.test','team:../../x',42])),['athlete:michael-jordan','team:arsenal']);
 assert.equal(parseFavourites(JSON.stringify(Array.from({length:300},(_,i)=>'team:t-'+i))).length,200);
});
test('quiz rounds have five unique questions and four unique choices with exactly one correct answer',()=>{
 const original=JSON.stringify(knowledgeQuestions);for(let n=0;n<20;n++){const round=makeSportsRound(knowledgeQuestions,'knowledge');assert.equal(round.length,5);assert.equal(new Set(round.map(q=>q.id)).size,5);for(const q of round){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.options.filter(o=>o===q.answer).length,1);}}
 assert.equal(JSON.stringify(knowledgeQuestions),original);assert.equal(makeSportsRound(knowledgeQuestions,'missing').length,0);
});
test('comparisons reject mixed sports, retain scope and never substitute a missing figure with zero',()=>{
 const by=id=>athletes.find(p=>p.id===id);assert.deepEqual(comparisonRows(by('lionel-messi'),by('michael-jordan')),[]);
 const rows=comparisonRows(by('don-bradman'),by('muttiah-muralitharan'));assert.equal(rows.find(r=>r.label==='Test runs').right,undefined);assert.equal(rows.find(r=>r.label==='Test wickets').left,undefined);
 const nba=comparisonRows(by('michael-jordan'),by('lebron-james'));assert.equal(nba[0].left.value,'6');assert.match(nba[0].right.scope,/through 2024/);
 for(const p of careerProfiles){assert.ok(p.timeline.length,p.id);assert.ok(p.sources.length,p.id);assert.ok(p.stats.every(s=>s.scope&&s.value!=='undefined'),p.id);}
});
test('new tools and all team pages are in discovery; team badge files are real local PNGs',async()=>{
 const index=JSON.parse(await readFile(new URL('../public/data/discovery-index.json',import.meta.url)));
 for(const t of sportsTools)assert.ok(index.some(e=>e.href===t.href),t.href);
 for(const t of sportsTeams){assert.ok(index.some(e=>e.href===`/sports/teams/${t.id}`),t.id);if(t.badge){const path=new URL('../public'+t.badge,import.meta.url),bytes=await readFile(path);assert.equal(bytes.subarray(1,4).toString(),'PNG');assert.ok((await stat(path)).size<100000);}}
});
