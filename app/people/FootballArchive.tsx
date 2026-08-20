"use client";

import {useMemo,useState} from "react";
import Link from "next/link";
import {footballPeople,type FootballEra,type FootballPerson,type FootballPosition} from "./football-people";

const eras:("All eras"|FootballEra)[]=["All eras","New generation","Modern icon","Legend"];
const positions:("All positions"|FootballPosition)[]=["All positions","Forward","Midfielder","Defender","Goalkeeper"];
const countryAliases:Record<string,string>={England:"united-kingdom","Northern Ireland":"united-kingdom","Soviet Union":"russia","Argentina · Spain":"argentina"};
const slug=(country:string)=>countryAliases[country]??country.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export default function FootballArchive(){
  const [query,setQuery]=useState("");
  const [era,setEra]=useState<(typeof eras)[number]>("All eras");
  const [position,setPosition]=useState<(typeof positions)[number]>("All positions");
  const [country,setCountry]=useState("All nations");
  const [selected,setSelected]=useState<FootballPerson|null>(footballPeople[0]);
  const [shortlist,setShortlist]=useState<string[]>([]);
  const countries=useMemo(()=>["All nations",...Array.from(new Set(footballPeople.map((person)=>person.country))).sort()],[]);
  const filtered=useMemo(()=>footballPeople.filter((person)=>{
    const term=query.trim().toLowerCase();
    const searchable=`${person.name} ${person.country} ${person.position} ${person.clubs}`.toLowerCase();
    return (!term||searchable.includes(term))&&(era==="All eras"||person.era===era)&&(position==="All positions"||person.position===position)&&(country==="All nations"||person.country===country);
  }),[query,era,position,country]);

  function toggleShortlist(name:string){setShortlist((current)=>current.includes(name)?current.filter((item)=>item!==name):current.length<2?[...current,name]:[current[1],name]);}
  const compared=shortlist.map((name)=>footballPeople.find((person)=>person.name===name)).filter(Boolean) as FootballPerson[];

  return <div className="football-archive">
    <section className="football-archive-hero">
      <div><p>TerraScope football archive · {footballPeople.length} profiles</p><h1>Players who<br/><em>changed the game.</em></h1></div>
      <div><p>From Pelé and Maradona to Messi, Ronaldo, Salah, Saka and Haaland—browse the careers, styles and moments that shaped different football eras.</p><button type="button" onClick={()=>setSelected(footballPeople[Math.floor(Math.random()*footballPeople.length)])}>Surprise me <span>↗</span></button></div>
    </section>

    <section className="football-tools" aria-label="Filter football archive">
      <label className="football-search"><span>⌕</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search player, nation or club…"/></label>
      <div className="era-buttons">{eras.map((item)=><button className={era===item?"active":""} onClick={()=>setEra(item)} key={item}>{item}</button>)}</div>
      <label><span>Position</span><select value={position} onChange={(event)=>setPosition(event.target.value as typeof position)}>{positions.map((item)=><option key={item}>{item}</option>)}</select></label>
      <label><span>Nation</span><select value={country} onChange={(event)=>setCountry(event.target.value)}>{countries.map((item)=><option key={item}>{item}</option>)}</select></label>
    </section>

    <section className="archive-results">
      <header><div><b>{filtered.length}</b><span>players found</span></div><p>Click any player to open the full dossier. Add two to your shortlist for a quick career comparison.</p></header>
      <div className="football-person-grid">{filtered.map((person,index)=><article className="football-person-card" key={person.name}>
        <button type="button" className="football-card-main" onClick={()=>setSelected(person)}>
          <div className="football-monogram"><small>{String(index+1).padStart(2,"0")}</small><span>{person.initials}</span><i>{person.flag}</i></div>
          <div><span>{person.era} · {person.position}</span><h2>{person.name}</h2><p>{person.country} · {person.years}</p><small>{person.story}</small><b>Open full dossier <i>→</i></b></div>
        </button>
        <button type="button" className={shortlist.includes(person.name)?"shortlist active":"shortlist"} onClick={()=>toggleShortlist(person.name)}>{shortlist.includes(person.name)?"✓ Shortlisted":"＋ Compare"}</button>
      </article>)}</div>
      {!filtered.length&&<div className="no-player-results"><b>No player matches those filters.</b><button onClick={()=>{setQuery("");setEra("All eras");setPosition("All positions");setCountry("All nations")}}>Reset the archive</button></div>}
    </section>

    {selected&&<div className="player-modal-backdrop" role="presentation" onMouseDown={(event)=>{if(event.currentTarget===event.target)setSelected(null)}}>
      <section className="player-dossier" role="dialog" aria-modal="true" aria-label={`${selected.name} football profile`}>
        <button className="dossier-close" onClick={()=>setSelected(null)} aria-label="Close profile">×</button>
        <header><div className="dossier-monogram"><span>{selected.initials}</span><i>{selected.flag}</i></div><div><small>{selected.era} · {selected.position}</small><h2>{selected.name}</h2><p>{selected.country} · {selected.years}</p></div></header>
        <div className="dossier-body">
          <div className="dossier-story"><span>Career story</span><p>{selected.story}</p><span>How they played</span><p>{selected.style}</p><span>Why they matter</span><p>{selected.legacy}</p></div>
          <aside><div><small>Notable clubs</small><p>{selected.clubs}</p></div><div><small>Defining honours</small><ul>{selected.honours.map((honour)=><li key={honour}>{honour}</li>)}</ul></div><Link href={`/countries/${slug(selected.country)}`}>Explore {selected.country} <span>↗</span></Link><button className={shortlist.includes(selected.name)?"active":""} onClick={()=>toggleShortlist(selected.name)}>{shortlist.includes(selected.name)?"✓ Added to comparison":"＋ Add to comparison"}</button></aside>
        </div>
      </section>
    </div>}

    {!!compared.length&&<aside className="compare-tray"><div><small>Quick comparison</small><b>{compared.map((person)=>person.name).join("  vs  ")}</b></div><div>{compared.map((person)=><button key={person.name} onClick={()=>setSelected(person)}><span>{person.flag}</span>{person.name}<i onClick={(event)=>{event.stopPropagation();toggleShortlist(person.name)}}>×</i></button>)}</div>{compared.length===2&&<p><b>{compared[0].era}</b> meets <b>{compared[1].era}</b> · open either dossier to compare style, honours and influence.</p>}</aside>}
  </div>
}
