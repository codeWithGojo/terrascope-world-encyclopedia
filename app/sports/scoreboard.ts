export const scoreCompetitions = [
 {id:"premier-league",sport:"football",name:"Premier League",path:"soccer/eng.1",url:"https://www.espn.com/soccer/scoreboard/_/league/eng.1"},
 {id:"champions-league",sport:"football",name:"UEFA Champions League",path:"soccer/uefa.champions",url:"https://www.espn.com/soccer/scoreboard/_/league/uefa.champions"},
 {id:"la-liga",sport:"football",name:"La Liga",path:"soccer/esp.1",url:"https://www.espn.com/soccer/scoreboard/_/league/esp.1"},
 {id:"nba",sport:"basketball",name:"NBA",path:"basketball/nba",url:"https://www.espn.com/nba/scoreboard"},
 {id:"wnba",sport:"basketball",name:"WNBA",path:"basketball/wnba",url:"https://www.espn.com/wnba/scoreboard"},
 {id:"atp",sport:"tennis",name:"ATP",path:"tennis/atp",url:"https://www.espn.com/tennis/scoreboard"},
 {id:"wta",sport:"tennis",name:"WTA",path:"tennis/wta",url:"https://www.espn.com/tennis/scoreboard"},
 {id:"cricket",sport:"cricket",name:"Cricket · current series",path:"cricket",url:"https://www.espncricinfo.com/live-cricket-score"},
] as const;
export type ScoreMatch={id:string;competition:string;name:string;date:string;state:"pre"|"in"|"post"|"unknown";status:string;competitors:{name:string;score:string;winner:boolean}[];url:string};
export type Scoreboard={matches:ScoreMatch[];fetchedAt:string;source:"ESPN";sourceUrl:string;competition:string;date:string|null;stale:boolean};
type ObjectValue=Record<string,unknown>;
const obj=(v:unknown):ObjectValue=>v&&typeof v==="object"&&!Array.isArray(v)?v as ObjectValue:{};
const list=(v:unknown):unknown[]=>Array.isArray(v)?v:[];
const str=(v:unknown)=>typeof v==="string"||typeof v==="number"?String(v):"";
export function safeScoreLink(value:unknown,fallback:string){try{const u=new URL(str(value));return u.protocol==="https:"&&/(^|\.)(espn\.com|espn\.in|espncricinfo\.com)$/.test(u.hostname)?u.href:fallback;}catch{return fallback;}}
export function normaliseScoreboard(raw:unknown,competition:typeof scoreCompetitions[number],date:string):ScoreMatch[]{
 const data=obj(raw), result:ScoreMatch[]=[];
 function add(event:ObjectValue,match:ObjectValue,label:string,cricket=false){
  const full=obj(match.fullStatus), type=obj(obj(match.status).type),stateValue=cricket?str(match.status):str(type.state),state=["pre","in","post"].includes(stateValue)?stateValue as ScoreMatch["state"]:"unknown";
  const competitors=list(match.competitors).map(c=>{const x=obj(c),team=obj(x.team),athlete=obj(x.athlete);const scores=list(x.linescores).map(s=>str(obj(s).value)).filter(Boolean);return {name:str(team.displayName||athlete.displayName||x.displayName||x.name)||"Name unavailable",score:state==="pre"?"—":str(x.score)||(scores.length?scores.join(" "):"—"),winner:x.winner===true};});
  const when=str(match.date||event.date);if(competitors.length<2||!when||!Number.isFinite(Date.parse(when)))return;
  // Tennis feeds return whole tournaments; only show matches on the requested UTC date.
  if(!cricket&&new Date(when).toISOString().slice(0,10)!==date)return;
  const links=list(match.links||event.links).map(obj),link=match.link||links.find(l=>list(l.rel).includes("summary"))?.href||links.find(l=>str(l.href).startsWith("https:"))?.href;
  result.push({id:`${competition.id}:${str(match.id||event.id)}`,competition:label,name:str(match.name||event.name)||competitors.map(c=>c.name).join(" v "),date:when,state,status:str(type.shortDetail||type.detail||match.summary||full.summary||type.description)||(state==="pre"?"Scheduled":state==="post"?"Final":state==="in"?"In progress":"Status unavailable"),competitors,url:safeScoreLink(link,competition.url)});
 }
 if(competition.id==="cricket"){
  if(!Array.isArray(data.sports))throw Error("Score feed unavailable");
  for(const sport of list(data.sports).map(obj))for(const league of list(sport.leagues).map(obj))for(const event of list(league.events).map(obj))add(event,event,str(league.name)||competition.name,true);
 }else{
  if(!Array.isArray(data.events))throw Error("Score feed unavailable");
  for(const event of list(data.events).map(obj)){
   const groups=list(event.groupings).map(obj),matches=[...list(event.competitions),...groups.flatMap(g=>list(g.competitions))];
   for(const match of matches.map(obj))add(event,match,competition.sport==="tennis"?`${competition.name} · ${str(event.name)}`:competition.name);
  }
 }
 const unique=[...new Map(result.map(m=>[m.id,m])).values()];const order={in:0,pre:1,post:2,unknown:3};
 return unique.sort((a,b)=>order[a.state]-order[b.state]||Date.parse(a.date)-Date.parse(b.date)).slice(0,150);
}
export function validScoreDate(date:string){return /^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date;}
export function isScoreboard(value:unknown):value is Scoreboard{
 const x=obj(value);return x.source==="ESPN"&&typeof x.fetchedAt==="string"&&Number.isFinite(Date.parse(x.fetchedAt))&&typeof x.stale==="boolean"&&Array.isArray(x.matches)&&x.matches.every(m=>{const r=obj(m);return typeof r.id==="string"&&typeof r.status==="string"&&typeof r.date==="string"&&["pre","in","post","unknown"].includes(str(r.state))&&Array.isArray(r.competitors)&&r.competitors.length>=2&&r.competitors.every(c=>{const p=obj(c);return typeof p.name==="string"&&typeof p.score==="string";});});
}
