"use client";

import Link from "next/link";
import {useMemo,useState} from "react";

export type TourismRow = {rank:number;code:string;country:string;flag:string;slug:string;visitors:number;change:number};

export default function MostVisitedTable({rows}:{rows:TourismRow[]}) {
  const [sort,setSort] = useState<"rank"|"country"|"visitors"|"change">("rank");
  const [descending,setDescending] = useState(false);
  const visible = useMemo(() => [...rows].sort((a,b) => {
    const value = sort === "country" ? a.country.localeCompare(b.country) : a[sort]-b[sort];
    return descending ? -value : value;
  }),[rows,sort,descending]);
  function choose(next:typeof sort) { if (sort === next) setDescending((value) => !value); else {setSort(next);setDescending(next !== "rank" && next !== "country");} }
  return <div className="data-table-shell tourism-table"><div className="data-table" role="table" aria-label="Most visited countries"><div className="data-table-head" role="row"><button onClick={() => choose("rank")}>Rank</button><button onClick={() => choose("country")}>Destination</button><button onClick={() => choose("visitors")}>2024 arrivals</button><button onClick={() => choose("change")}>Annual change</button></div>{visible.map((row) => <Link href={`/countries/${row.slug}`} className="data-table-row" role="row" key={row.code}><strong>{String(row.rank).padStart(2,"0")}</strong><div><span>{row.flag}</span><b>{row.country}</b><small>{row.code}</small></div><em>{row.visitors.toFixed(1)}M</em><i>+{row.change.toFixed(1)}%</i></Link>)}</div></div>;
}
