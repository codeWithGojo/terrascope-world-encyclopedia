export const FAVOURITES_KEY="terrascope-sports-favourites-v1";
const event="terrascope-sports-favourites-change";
const empty: string[]=[];
let cachedRaw: string|null=null, cached: string[]=empty;
export function parseFavourites(raw:string|null):string[]{
 try{const v=JSON.parse(raw||"[]");return Array.isArray(v)?[...new Set(v.filter((x:unknown):x is string=>typeof x==="string"&&/^(athlete|team|esports-team|esports-player):[a-z0-9-]{1,80}$/.test(x)))].slice(0,200):[];}catch{return [];}
}
export function favouriteSnapshot(){
 try{const raw=window.localStorage.getItem(FAVOURITES_KEY);if(raw!==cachedRaw){cachedRaw=raw;cached=parseFavourites(raw);}return cached;}catch{return empty;}
}
export function serverFavourites(){return empty;}
export function subscribeFavourites(callback:()=>void){
 const onStorage=(e:StorageEvent)=>{if(e.key===FAVOURITES_KEY||e.key===null)callback();};
 window.addEventListener(event,callback);window.addEventListener("storage",onStorage);
 return ()=>{window.removeEventListener(event,callback);window.removeEventListener("storage",onStorage);};
}
export function toggleFavourite(id:string):boolean{
 if(!parseFavourites(JSON.stringify([id])).length)return false;
 try{const items=favouriteSnapshot(),next=items.includes(id)?items.filter(x=>x!==id):[...items,id];if(next.length>200)return false;window.localStorage.setItem(FAVOURITES_KEY,JSON.stringify(next));window.dispatchEvent(new Event(event));return true;}catch{return false;}
}
