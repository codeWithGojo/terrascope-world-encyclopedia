"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import type {SearchCategory,SearchRecord} from "../search-data";

const categories:("All"|SearchCategory)[]=["All","Country","City","Notable person","Football","Government","History"];

function normalize(value:string){return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}

export default function SearchExplorer({records,initialQuery}:{records:SearchRecord[];initialQuery:string}){
  const [query,setQuery]=useState(initialQuery);
  const [category,setCategory]=useState<(typeof categories)[number]>("All");
  const visible=useMemo(()=>{
    const terms=normalize(query).trim().split(/\s+/).filter(Boolean);
    return records.filter((record)=>{
      if(category!=="All"&&record.category!==category)return false;
      if(!terms.length)return true;
      const haystack=normalize(`${record.title} ${record.subtitle} ${record.description} ${record.keywords}`);
      return terms.every((term)=>haystack.includes(term));
    }).slice(0,80);
  },[category,query,records]);

  return <>
    <div className="unified-search-tools">
      <label><span>Search the whole atlas</span><input autoFocus value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Country, city, person, player, leader or event…"/></label>
      <div>{categories.map((item)=><button type="button" className={category===item?"active":""} onClick={()=>setCategory(item)} key={item}>{item}</button>)}</div>
      <p><b>{visible.length}</b> {visible.length===80?"top ":""}results shown</p>
    </div>
    {visible.length?<div className="unified-search-results">{visible.map((record,index)=><Link href={record.href} key={record.id} className={`search-result search-${record.category.toLowerCase().replace(" ","-")}`}><span>{record.mark}</span><div><small>{record.category} · {String(index+1).padStart(2,"0")}</small><h2>{record.title}</h2><b>{record.subtitle}</b><p>{record.description}</p></div><i>↗</i></Link>)}</div>:<div className="unified-search-empty"><b>No atlas record matched.</b><p>Try a shorter spelling, a country, a city, an office-holder or a football club.</p><button type="button" onClick={()=>{setQuery("");setCategory("All")}}>Clear the search</button></div>}
  </>;
}
