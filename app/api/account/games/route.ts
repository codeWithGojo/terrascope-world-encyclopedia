import {serverAuth} from '../../../auth/server';
import {buildGame} from '../../../game/server';
import {utcDay} from '../../../game/engine';
const headers={'Cache-Control':'private, no-store'};
export async function GET() {
 const client=await serverAuth();if(!client)return Response.json({error:'Accounts are not configured'},{status:503,headers});
 const {data:{user},error:authError}=await client.auth.getUser();if(authError||!user)return Response.json({error:'Sign in to sync'},{status:401,headers});
 const {data,error}=await client.from('terrascope_daily_games').select('day,guesses,won,finished').eq('user_id',user.id).order('day',{ascending:false}).limit(365);
 return error?Response.json({error:'Account sync is temporarily unavailable. Local results are safe.'},{status:503,headers}):Response.json({games:data},{headers});
}
export async function POST(request:Request) {
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403,headers});
 const client=await serverAuth();if(!client)return Response.json({error:'Accounts are not configured'},{status:503,headers});
 const {data:{user},error:authError}=await client.auth.getUser();if(authError||!user)return Response.json({error:'Sign in to sync'},{status:401,headers});
 try {
  const text=await request.text();if(text.length>4096)throw Error();
  const body=JSON.parse(text) as {day:string;guesses:unknown};
  if(!/^\d{4}-\d{2}-\d{2}$/.test(body.day)||body.day>utcDay()||Date.now()-Date.parse(body.day+'T00:00:00Z')>366*86400000||!Number.isFinite(Date.parse(body.day)))throw Error();
  const game=buildGame(body.guesses,{mode:'daily'},body.day);if(!game.finished)throw Error();
  const {error}=await client.from('terrascope_daily_games').upsert({user_id:user.id,day:game.day,guesses:game.results.map(result=>result.code),won:game.won,finished:true},{onConflict:'user_id,day',ignoreDuplicates:true});
  return error?Response.json({error:'Account sync is temporarily unavailable. Local results are safe.'},{status:503,headers}):Response.json({synced:true},{headers});
 }catch{return Response.json({error:'A completed daily round is required.'},{status:400,headers});}
}
