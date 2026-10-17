export type Position={code:string;name:string;latitude:number;longitude:number};
export type GuessResult=Position&{distance:number;direction:string;correct:boolean};
export function utcDay(now=new Date()){return now.toISOString().slice(0,10);}
export function hashSeed(value:string){let hash=2166136261;for(const c of value){hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619);}return hash>>>0;}
export function dailyIndex(day:string,length:number){const days=Math.floor(Date.parse(day+'T00:00:00Z')/86400000);return ((days%length)+length)%length;}
export function distanceAndDirection(from:Position,to:Position):GuessResult {
 const r=Math.PI/180,a=from.latitude*r,b=to.latitude*r,dl=(to.longitude-from.longitude)*r;
 const hav=Math.max(0,Math.min(1,Math.sin((b-a)/2)**2+Math.cos(a)*Math.cos(b)*Math.sin(dl/2)**2));
 const distance=Math.round(6371*2*Math.atan2(Math.sqrt(hav),Math.sqrt(1-hav)));
 const bearing=(Math.atan2(Math.sin(dl)*Math.cos(b),Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(dl))/r+360)%360;
 return {...from,distance,direction:from.code===to.code?'✓':['N ↑','NE ↗','E →','SE ↘','S ↓','SW ↙','W ←','NW ↖'][Math.round(bearing/45)%8],correct:from.code===to.code};
}
export function validateGuesses(raw:unknown,codes:Set<string>):string[] {
 if(!Array.isArray(raw)||raw.length>6||raw.some(code=>typeof code!=='string'||!codes.has(code))||new Set(raw).size!==raw.length)throw Error('Choose up to six different countries from the list.');
 return raw as string[];
}
export type SavedGame={day:string;guesses:string[];won:boolean};
export function gameStats(records:SavedGame[],today:string) {
 const unique=[...new Map(records.filter(r=>/^\d{4}-\d{2}-\d{2}$/.test(r.day)&&r.day<=today&&(r.won||r.guesses.length===6)).map(r=>[r.day,r])).values()].sort((a,b)=>a.day.localeCompare(b.day));
 let best=0,run=0,previous='';
 for(const record of unique){const consecutive=Date.parse(record.day)-Date.parse(previous)===86400000;run=record.won?(consecutive?run+1:1):0;best=Math.max(best,run);previous=record.day;}
 const byDay=new Map(unique.map(record=>[record.day,record]));let cursor=Date.parse(today+'T00:00:00Z'),streak=0;
 if(!byDay.has(today))cursor-=86400000;
 while(byDay.get(new Date(cursor).toISOString().slice(0,10))?.won){streak++;cursor-=86400000;}
 return {played:unique.length,wins:unique.filter(r=>r.won).length,streak,best};
}
export function emojiResult(day:string,results:GuessResult[],won:boolean) {
 return `TerraScope · ${day}\n${won?results.length:'X'}/6\n${results.map(result=>result.correct?'🟩':result.distance<1500?'🟨':'⬜').join('')}\nGuess the Country`;
}
