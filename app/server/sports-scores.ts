import {normaliseScoreboard,scoreCompetitions,type Scoreboard} from "../sports/scoreboard";
const cache=new Map<string,{value:Scoreboard;expires:number}>(),pending=new Map<string,Promise<Scoreboard>>();
export async function getSportsScores(id:string,date:string,fetcher:typeof fetch=fetch,now=Date.now()):Promise<Scoreboard>{
 const competition=scoreCompetitions.find(c=>c.id===id);if(!competition)throw Error("Unknown competition");
 const key=`${id}:${id==="cricket"?"current":date}`,saved=cache.get(key);if(saved&&saved.expires>now)return saved.value;
 const running=pending.get(key);if(running)return running;
 const job=(async()=>{try{
  const url=id==="cricket"?"https://site.api.espn.com/apis/personalized/v2/scoreboard/header?sport=cricket&region=in&tz=UTC":`https://site.api.espn.com/apis/site/v2/sports/${competition.path}/scoreboard?dates=${date.replaceAll("-","")}&limit=200`;
  const response=await fetcher(url,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(10000),cache:"no-store"});if(!response.ok)throw Error("Score provider unavailable");
  const matches=normaliseScoreboard(await response.json(),competition,date),value:Scoreboard={matches,fetchedAt:new Date(now).toISOString(),source:"ESPN",sourceUrl:competition.url,competition:competition.name,date:id==="cricket"?null:date,stale:false};
  if(cache.size>=64)cache.delete(cache.keys().next().value!);cache.set(key,{value,expires:now+60000});return value;
 }catch(error){if(saved&&now-Date.parse(saved.value.fetchedAt)<15*60000)return {...saved.value,stale:true};throw error;}finally{pending.delete(key);}})();pending.set(key,job);return job;
}
