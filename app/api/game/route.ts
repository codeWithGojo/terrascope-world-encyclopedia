import {buildGame,parseGameOptions} from '../../game/server';
import {utcDay} from '../../game/engine';
const headers={'Cache-Control':'no-store'};
export async function GET(){return Response.json(buildGame([]),{headers});}
export async function POST(request:Request) {
 try {
  if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Please play from TerraScope.'},{status:403,headers});
  const text=await request.text();if(text.length>4096)return Response.json({error:'Request too large'},{status:413,headers});
  const body=JSON.parse(text) as Record<string,unknown>,options=parseGameOptions(body);
  if(options.mode==='daily'&&body.day!==utcDay())return Response.json({error:'A new UTC day has begun. Open today’s puzzle.'},{status:409,headers});
  return Response.json(buildGame(body.guesses,options),{headers});
 }catch{return Response.json({error:'Choose up to six different countries from the list.'},{status:400,headers});}
}
