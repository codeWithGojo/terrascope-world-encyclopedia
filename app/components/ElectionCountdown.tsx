"use client";
import {useEffect,useState} from "react";
import {getElection} from "../elections-data";
import {electionClock} from "../election-clock";
export function ElectionCountdown({code,country,compact=false}:{code:string;country:string;compact?:boolean}){
 const election=getElection(code);const [now,setNow]=useState<number|null>(null);
 useEffect(()=>{setNow(Date.now());if(!election?.date)return;const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[election?.date]);
 const clock=election?.date&&now!==null?electionClock(election.date,election.timezone,now):undefined;
 return <article className={`election-card ${compact?"compact":""}`}>
  <div className="election-card-heading"><span className="election-dot"/><small>{election?.status==="confirmed"?"Official polling date":election?.status==="expected"?"Expected window":"Election watch"}</small><b>{country}</b></div>
  <h3>{election?.name||"Next national election"}</h3>
  {election?.date?<><p className="election-date">{new Date(election.date+"T12:00:00Z").toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})}</p>{clock?.state==="today"?<p className="election-event-state">Polling day in the reference time zone.</p>:clock?.state==="passed"?<p className="election-event-state">This polling date has passed. The next date awaits verification.</p>:<div className="countdown-digits" aria-label={clock?`${clock.days} days, ${clock.hours} hours until the polling date`:"Loading countdown"}>{[[clock?.days,"days"],[clock?.hours,"hours"],[clock?.minutes,"minutes"],[clock?.seconds,"seconds"]].map(([number,label])=><div key={label}><strong>{number===undefined?"—":String(number).padStart(2,"0")}</strong><small>{label}</small></div>)}</div>}<p className="election-reference">To the start of the calendar day in {election.timezone}. Polling hours vary.</p></>:<p className="election-window">{election?.expectedWindow||"No confirmed date in our checked register."} <span>A live countdown appears when an exact official date is verified.</span></p>}
  {election&&<><p className="election-note">{election.note}</p><a href={election.sourceUrl} target="_blank" rel="noreferrer">{election.sourceLabel} ↗</a><small className="election-checked">Source checked {election.checkedAt}. Dates can change; check the authority for updates.</small></>}
  {!election&&<a href="/elections">Browse verified election dates ↗</a>}
 </article>;
}
