"use client";

import Link from "next/link";
import {useSyncExternalStore} from "react";
import {dailyAtlasFacts,onThisDayEvents} from "../on-this-day-data";

const emptySubscribe=()=>()=>{};
function localDateKey(){
  const date=new Date();
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

export function OnThisDayWidget({compact=false}:{compact?:boolean}){
  const dateKey=useSyncExternalStore(emptySubscribe,localDateKey,()=>"");
  if(!dateKey)return <article className={`on-this-day-widget ${compact?"compact":""}`}><small>On this day</small><h3>Opening today’s archive…</h3><p>Matching the date to TerraScope’s historical milestones and country facts.</p></article>;

  const current=new Date(`${dateKey}T12:00:00`);
  const monthDay=dateKey.slice(5);
  const start=Date.UTC(current.getFullYear(),0,0);
  const dayOfYear=Math.floor((Date.UTC(current.getFullYear(),current.getMonth(),current.getDate())-start)/86_400_000);
  const anniversaries=onThisDayEvents.filter((event)=>event.date.slice(5)===monthDay);
  const fact=dailyAtlasFacts[(dayOfYear*47+current.getFullYear())%dailyAtlasFacts.length];
  const dateLabel=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long"}).format(current);

  if(compact){
    const event=anniversaries[0];
    return <article className="on-this-day-widget compact"><span className="issue">On this day · {dateLabel}</span><p className="quote-mark">“</p><h3>{event?event.title:fact.fact}</h3><p>{event?`${event.label} · ${event.country}. ${event.text}`:`Today’s field fact comes from ${fact.country} ${fact.flag}.`}</p><Link className="field-link" href={event?`/countries/${event.countrySlug}#timeline`:"/on-this-day"}>{event?`Open ${event.country}’s timeline`:`Open today’s archive`} →</Link></article>;
  }

  return <div className="on-this-day-record">
    <header><small>Local date</small><h2>{dateLabel}</h2><p>{anniversaries.length?`${anniversaries.length} selected ${anniversaries.length===1?"anniversary":"anniversaries"} in the current TerraScope timeline archive.`:"No selected timeline anniversary falls on this date yet; today’s country fact keeps the daily edition moving."}</p></header>
    {anniversaries.length?<div className="anniversary-grid">{anniversaries.map((event)=><article key={`${event.country}-${event.date}-${event.title}`}><span>{event.flag}</span><small>{event.label} · {event.country}</small><h3>{event.title}</h3><p>{event.text}</p><Link href={`/countries/${event.countrySlug}#timeline`}>Open the country timeline →</Link></article>)}</div>:<div className="anniversary-empty"><b>The dated archive is growing.</b><p>TerraScope currently matches verified milestones from its first eleven deep country records. New dates appear as each country chronology passes editorial review.</p></div>}
    <article className="daily-atlas-fact"><div><span>{fact.flag}</span><small>Daily atlas fact · {fact.status==="curated"?"editorially curated":"structured atlas record"}</small></div><h3>{fact.fact}</h3><Link href={`/countries/${fact.countrySlug}#interesting-facts`}>Discover {fact.country} →</Link></article>
  </div>;
}
