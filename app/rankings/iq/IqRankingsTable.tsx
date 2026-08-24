"use client";

import Link from "next/link";
import {useMemo, useState} from "react";

export type IqRow = {rank:number; code:string; country:string; flag:string; slug:string; score:number};

export default function IqRankingsTable({rows}:{rows:IqRow[]}) {
  const [query,setQuery] = useState("");
  const [sort,setSort] = useState<"rank"|"country"|"score">("rank");
  const [descending,setDescending] = useState(false);
  const visible = useMemo(() => {
    const filtered = rows.filter((row) => row.country.toLowerCase().includes(query.toLowerCase().trim()));
    return [...filtered].sort((a,b) => {
      const value = sort === "country" ? a.country.localeCompare(b.country) : a[sort] - b[sort];
      return descending ? -value : value;
    });
  },[rows,query,sort,descending]);
  function choose(next:typeof sort) {
    if (sort === next) setDescending((value) => !value);
    else { setSort(next); setDescending(next === "score"); }
  }
  return <div className="data-table-shell">
    <div className="data-table-tools"><label><span>Find a country</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Start typing…"/></label><p><b>{visible.length}</b> countries with a reported score</p></div>
    <div className="data-table" role="table" aria-label="Countries ranked by reported IQ test average">
      <div className="data-table-head" role="row"><button onClick={() => choose("rank")}>Rank {sort === "rank" ? (descending ? "↓" : "↑") : ""}</button><button onClick={() => choose("country")}>Country {sort === "country" ? (descending ? "↓" : "↑") : ""}</button><button onClick={() => choose("score")}>Reported score {sort === "score" ? (descending ? "↓" : "↑") : ""}</button><span>Profile</span></div>
      {visible.map((row) => <div className="data-table-row" role="row" key={row.code}><strong>{String(row.rank).padStart(2,"0")}</strong><div><span>{row.flag}</span><b>{row.country}</b><small>{row.code}</small></div><em>{row.score.toFixed(2)}</em><Link href={`/countries/${row.slug}`}>Open <span>↗</span></Link></div>)}
      {!visible.length && <div className="data-empty"><b>No matching country</b><p>Try another spelling or clear the search.</p></div>}
    </div>
  </div>;
}
