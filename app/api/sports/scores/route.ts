import {getSportsScores} from "../../../server/sports-scores";
import {scoreCompetitions,validScoreDate} from "../../../sports/scoreboard";
export async function GET(request:Request){
 const query=new URL(request.url).searchParams,id=query.get("competition")||"premier-league",date=query.get("date")||new Date().toISOString().slice(0,10);
 if(!scoreCompetitions.some(c=>c.id===id)||!validScoreDate(date)||Math.abs(Date.parse(date)-Date.now())>370*86400000)return Response.json({error:"Choose a supported competition and a date within one year of today."},{status:400});
 try{const value=await getSportsScores(id,date);return Response.json(value,{headers:{"Cache-Control":value.stale?"no-store":"public, s-maxage=60, stale-while-revalidate=60"}});}catch{return Response.json({error:"Scores are temporarily unavailable. Retry or open the source scoreboard."},{status:503,headers:{"Cache-Control":"no-store"}});}
}
