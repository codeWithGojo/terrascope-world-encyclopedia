interface Statement {bind(...values:unknown[]):Statement;all():Promise<{results:Record<string,unknown>[]}>;run():Promise<{meta:{changes:number}}>;}
export interface TripDatabase {prepare(sql:string):Statement;}
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
export function text(value:unknown,max:number,required=false){const s=typeof value==="string"?value.trim():"";if(s.length>max||(required&&!s))throw new Error(`Enter ${required?"a value":"text"} of at most ${max} characters.`);return s;}
export const uuid=(id:unknown)=>typeof id==="string"&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id);
export function validDate(s:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||Number(s.slice(0,4))<2000||Number(s.slice(0,4))>2100)return false;const d=new Date(s+"T00:00:00Z");return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===s;}
export function minor(value:unknown){if(!/^\d+(\.\d{1,2})?$/.test(String(value)))throw new Error("Enter a valid budget with at most two decimal places.");const n=Math.round(Number(value)*100);if(!Number.isSafeInteger(n)||n<=0||n>100000000000)throw new Error("Enter a budget greater than zero and no more than 1 billion.");return n;}
export async function handleTripsApi(request:Request,db?:TripDatabase):Promise<Response>{
  const owner=request.headers.get("oai-authenticated-user-id"),url=new URL(request.url);
  if(!owner)return json({error:"Sign in to access your trip briefs."},401);
  if(!db)return json({error:"Trip briefs are temporarily unavailable. Please try again."},503);
  if(request.method!=="GET"){const origin=request.headers.get("origin");if((origin&&origin!==url.origin)||request.headers.get("sec-fetch-site")==="cross-site")return json({error:"Request origin is not allowed."},403);}
  try{
    if(request.method==="GET"&&url.pathname==="/api/trips"){
      const result=await db.prepare("SELECT id,destination,city,start_date,end_date,travelers,budget_minor,currency,interests,notes,itinerary,created_at,updated_at FROM trip_briefs WHERE owner_id = ? ORDER BY created_at DESC").bind(owner).all();return json({trips:result.results});
    }
    if(request.method!=="POST"&&request.method!=="PUT")return json({error:"Endpoint not found."},404);
    if(!request.headers.get("content-type")?.includes("application/json"))return json({error:"Send JSON data."},415);
    const raw=await request.text();if(raw.length>32768)return json({error:"Request is too large."},413);
    let body:Record<string,unknown>;try{body=JSON.parse(raw);}catch{return json({error:"Invalid JSON."},400);}
    if(!body||typeof body!=="object"||Array.isArray(body))return json({error:"Invalid data."},400);
    const id=url.pathname.split("/")[3];
    if(request.method==="PUT"&&id&&uuid(id)){
      const itinerary=text(body.itinerary,12000);
      const result=await db.prepare("UPDATE trip_briefs SET itinerary = ?, updated_at = ? WHERE id = ? AND owner_id = ?").bind(itinerary,new Date().toISOString(),id,owner).run();
      return result.meta.changes?json({ok:true}):json({error:"Trip brief not found."},404);
    }
    if(request.method==="POST"&&url.pathname==="/api/trips"){
      if(!uuid(body.id))return json({error:"Invalid trip reference."},400);
      const start=text(body.startDate,10,true),end=text(body.endDate,10,true);
      if(!validDate(start)||!validDate(end)||end<start||(+new Date(end)-+new Date(start))/86400000>90)return json({error:"Choose valid travel dates for a trip of up to 91 days."},400);
      if(typeof body.travelers!=="number"||!Number.isInteger(body.travelers)||body.travelers<1||body.travelers>30)return json({error:"Enter between 1 and 30 travelers."},400);
      if(!["NGN","USD","EUR","GBP"].includes(String(body.currency)))return json({error:"Choose a supported currency."},400);
      const fields=["owner_id","destination","city","start_date","end_date","travelers","budget_minor","currency","interests","notes","itinerary"];
      const values=[body.id,owner,text(body.destination,100,true),text(body.city,100),start,end,body.travelers,minor(body.budget),body.currency,text(body.interests,1000,true),text(body.notes,2000),text(body.itinerary,12000)];
      const old=await db.prepare("SELECT owner_id,destination,city,start_date,end_date,travelers,budget_minor,currency,interests,notes,itinerary FROM trip_briefs WHERE id = ?").bind(body.id).all();
      if(old.results.length)return fields.every((field,i)=>old.results[0][field]===values[i+1])?json({ok:true}):json({error:"That trip reference is already in use. Start a new brief."},409);
      const now=new Date().toISOString();await db.prepare("INSERT INTO trip_briefs (id,owner_id,destination,city,start_date,end_date,travelers,budget_minor,currency,interests,notes,itinerary,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(...values,now,now).run();return json({ok:true},201);
    }
    return json({error:"Endpoint not found."},404);
  }catch(error){const message=error instanceof Error?error.message:"";if(message.startsWith("Enter "))return json({error:message},400);console.error("TerraScope trip briefs unavailable",error);return json({error:"Could not save or load your trip. Your input has been kept; please try again."},503);}
}
