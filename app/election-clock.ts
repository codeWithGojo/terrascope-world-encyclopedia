// A date-only election is counted down to midnight in a named reference zone,
// never presented as a polling-station opening time.
export function electionMidnight(date:string,timeZone:string){
 const [year,month,day]=date.split("-").map(Number);const target=Date.UTC(year,month-1,day);let instant=target;
 const format=new Intl.DateTimeFormat("en-GB",{timeZone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
 for(let i=0;i<3;i++){const values=Object.fromEntries(format.formatToParts(instant).filter(p=>p.type!=="literal").map(p=>[p.type,Number(p.value)]));const represented=Date.UTC(values.year,values.month-1,values.day,values.hour,values.minute,values.second);instant+=target-represented;}
 return instant;
}
export function electionClock(date:string,timeZone:string,now:number){
 const target=electionMidnight(date,timeZone);const today=new Intl.DateTimeFormat("en-CA",{timeZone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
 const parts=Object.fromEntries(today.map(p=>[p.type,p.value]));const localDay=`${parts.year}-${parts.month}-${parts.day}`;
 const total=Math.max(0,Math.floor((target-now)/1000));
 return {state:localDay===date?"today":localDay>date?"passed":"upcoming",days:Math.floor(total/86400),hours:Math.floor(total%86400/3600),minutes:Math.floor(total%3600/60),seconds:total%60};
}
