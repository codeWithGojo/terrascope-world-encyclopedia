import {browserStore} from "../browser-store";
import {minor,text,uuid,validDate} from "../../worker/trips-api";
type Trip = {id:string;destination:string;city:string;start_date:string;end_date:string;travelers:number;budget_minor:number;currency:string;interests:string;notes:string;itinerary:string;created_at:string;updated_at:string};
const store=browserStore<Trip[]>("terrascope-public-trips-v1",()=>[]);
export async function browserTripsApi<T>(path:string,method:string,body?:unknown,signal?:AbortSignal):Promise<T>{
  if(signal?.aborted)throw new DOMException("Aborted","AbortError");
  const url=new URL(path,"https://local.invalid");
  const result=await store(method!=="GET",trips=>{
    if(!Array.isArray(trips))throw new Error("Saved trips cannot be read. Your browser records have been kept.");
    if(method==="GET"&&url.pathname==="/api/trips")return {trips:[...trips].sort((a,b)=>b.created_at.localeCompare(a.created_at))};
    if(!body||typeof body!=="object"||Array.isArray(body))throw new Error("Invalid trip data.");
    const b=body as Record<string,unknown>;
    const id=url.pathname.split("/")[3];
    if(method==="PUT"&&id&&uuid(id)){
      const trip=trips.find(t=>t.id===id);if(!trip)throw new Error("Trip not found.");
      trip.itinerary=text(b.itinerary,12000);trip.updated_at=new Date().toISOString();return {ok:true};
    }
    if(method!=="POST"||url.pathname!=="/api/trips")throw new Error("Endpoint not found.");
    if(!uuid(b.id))throw new Error("Invalid trip reference.");
    const start=text(b.startDate,10,true),end=text(b.endDate,10,true);
    if(!validDate(start)||!validDate(end)||end<start||(+new Date(end)-+new Date(start))/86400000>90)throw new Error("Choose valid travel dates for a trip of up to 91 days.");
    if(typeof b.travelers!=="number"||!Number.isInteger(b.travelers)||b.travelers<1||b.travelers>30)throw new Error("Enter between 1 and 30 travelers.");
    if(!["NGN","USD","EUR","GBP"].includes(String(b.currency)))throw new Error("Choose a supported currency.");
    const now=new Date().toISOString();
    const trip:Trip={id:String(b.id),destination:text(b.destination,100,true),city:text(b.city,100),start_date:start,end_date:end,travelers:b.travelers,budget_minor:minor(b.budget),currency:String(b.currency),interests:text(b.interests,1000,true),notes:text(b.notes,2000),itinerary:text(b.itinerary,12000),created_at:now,updated_at:now};
    const old=trips.find(t=>t.id===trip.id);
    if(old){if(Object.keys(trip).filter(k=>k!=="created_at"&&k!=="updated_at").some(k=>old[k as keyof Trip]!==trip[k as keyof Trip]))throw new Error("That trip reference is already in use. Start a new brief.");}
    else trips.push(trip);
    return {ok:true};
  });
  if(signal?.aborted)throw new DOMException("Aborted","AbortError");
  return result as T;
}
