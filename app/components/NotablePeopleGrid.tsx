"use client";

import {useEffect,useMemo,useState} from "react";
import type {NotablePerson} from "../country-content";

type EnrichedPerson = NotablePerson & {thumbnail?:string};
const categories = ["All","Politics","Sports","Entertainment","Science","Literature"] as const;

export function NotablePeopleGrid({people,country}:{people:NotablePerson[];country:string}) {
  const [active,setActive] = useState<(typeof categories)[number]>("All");
  const [enriched,setEnriched] = useState<EnrichedPerson[]>(people);
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    let cancelled=false;
    Promise.all(people.map(async (person) => {
      try {
        const response=await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${person.wikipedia}`);
        if (!response.ok) return person;
        const summary=await response.json() as {thumbnail?:{source?:string}};
        return {...person,thumbnail:summary.thumbnail?.source};
      } catch { return person; }
    })).then((result) => {if(!cancelled){setEnriched(result);setLoading(false);}});
    return () => {cancelled=true;};
  },[people]);
  const visible=useMemo(() => active==="All"?enriched:enriched.filter((person)=>person.category===active),[active,enriched]);
  return <div className="notable-people-module">
    <div className="people-filters" role="tablist" aria-label={`Filter notable people from ${country}`}>{categories.map((category)=><button type="button" role="tab" aria-selected={active===category} className={active===category?"active":""} onClick={()=>setActive(category)} key={category}>{category}</button>)}</div>
    <div className="notable-people-grid" aria-busy={loading}>{visible.map((person)=><article key={person.name}>{person.thumbnail?<img src={person.thumbnail} alt=""/>:<div className="person-fallback">{person.name.split(" ").map((part)=>part[0]).slice(0,2).join("")}</div>}<div><small>{person.category}</small><h3>{person.name}</h3><p>{person.description}</p><a href={`https://en.wikipedia.org/wiki/${person.wikipedia}`} target="_blank" rel="noreferrer">Wikipedia ↗</a></div></article>)}</div>
    {!visible.length&&<div className="people-placeholder"><b>No profiles in this category yet</b><p>The next Wikidata refresh will backfill this filter.</p></div>}
    <p className="people-api-note">Names are seeded editorially; available portraits are loaded from Wikipedia’s public page-summary API.</p>
  </div>;
}
