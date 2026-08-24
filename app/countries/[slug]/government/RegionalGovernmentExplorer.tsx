"use client";

import {useMemo,useState} from "react";

export type RegionalRow={name:string;office:string;leader:string;startLabel:string;tenure:string;bio:string;profileUrl:string};

export default function RegionalGovernmentExplorer({rows,unitLabel,leaderLabel,source}:{rows:RegionalRow[];unitLabel:string;leaderLabel:string;source:{label:string;url:string}}){
  const [query,setQuery]=useState("");
  const [order,setOrder]=useState<"unit"|"leader">("unit");
  const visible=useMemo(()=>{
    const term=query.trim().toLowerCase();
    return rows.filter((row)=>!term||`${row.name} ${row.leader} ${row.office} ${row.bio}`.toLowerCase().includes(term)).sort((a,b)=>(order==="unit"?a.name.localeCompare(b.name):a.leader.localeCompare(b.leader)));
  },[order,query,rows]);
  return <>
    <div className="regional-tools"><label><span>Search the regional record</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="State, territory or leader…"/></label><label><span>Order by</span><select value={order} onChange={(event)=>setOrder(event.target.value as typeof order)}><option value="unit">{unitLabel}</option><option value="leader">{leaderLabel}</option></select></label><p><b>{visible.length}</b> of {rows.length}</p></div>
    {visible.length?<div className="regional-leader-grid">{visible.map((row,index)=><article key={row.name}><header><span>{String(index+1).padStart(2,"0")}</span><small>{row.office}</small></header><h2>{row.name}</h2><div className="regional-person"><i>{row.leader.split(" ").map((part)=>part[0]).slice(0,2).join("")}</i><div><small>{leaderLabel}</small><h3>{row.leader}</h3></div></div><dl><div><dt>In office since</dt><dd>{row.startLabel}</dd></div><div><dt>Time in office</dt><dd>{row.tenure}</dd></div></dl><p>{row.bio}</p><a href={row.profileUrl} target="_blank" rel="noreferrer">Open biography source ↗</a></article>)}</div>:<div className="regional-no-results"><b>No regional record matched.</b><p>Try a state name, office-holder or shorter spelling.</p></div>}
    <p className="regional-source-note">Directory source: <a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>. Biographical links open the corresponding public reference profile.</p>
  </>;
}
