"use client";
import {useState} from "react";
import Link from "next/link";
import type {SportsTeam} from "./catalog";
import {FavouriteButton} from "./FavouriteButton";
export function TeamDirectory({teams}:{teams:SportsTeam[]}){
 const [query,setQuery]=useState(""),[sport,setSport]=useState("all");
 const text=query.trim().toLowerCase(),filtered=teams.filter(t=>(sport==="all"||t.sport===sport)&&`${t.name} ${t.location} ${t.kind} ${t.icons.join(" ")}`.toLowerCase().includes(text));
 return <><div className="sp-form-row"><label>Search teams<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Team, location or iconic player…"/></label><label>Sport<select value={sport} onChange={e=>setSport(e.target.value)}><option value="all">All sports</option>{["football","basketball","cricket","tennis"].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></label></div><p className="sp-small" role="status">{filtered.length} featured teams · selected historical honours, rather than live trophy totals</p><div className="sp-team-grid">{filtered.map(t=><article className="sp-team-card" key={t.id}><div className="sp-team-top">{t.badge?<img src={t.badge} alt={`${t.name} badge`} width="70" height="70" loading="lazy"/>:<span className="sp-team-mark">{t.mark}</span>}<span>{t.sport}</span></div><p className="sp-kicker">{t.kind}</p><h2><Link href={`/sports/teams/${t.id}`}>{t.name} ↗</Link></h2><p>{t.location}</p><p className="sp-team-honour">{t.honours[0]}</p><div className="sp-card-actions"><Link href={`/sports/teams/${t.id}`}>Open team dossier ↗</Link><FavouriteButton id={`team:${t.id}`} name={t.name}/></div></article>)}</div>{!filtered.length&&<div className="sp-message"><h2>No teams match.</h2><button type="button" onClick={()=>{setQuery("");setSport("all");}}>Reset team filters</button></div>}</>;
}
