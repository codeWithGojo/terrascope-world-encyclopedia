"use client";

import {motion,useReducedMotion} from "motion/react";
import {spring,reveal} from "../../shared/motion/config";
import {useMemo, useState} from "react";
import Link from "next/link";
import {atlasCountries, atlasRegions, regionColours, type AtlasRegion} from "../atlas-data";

const MotionLink=motion.create(Link);
export default function CountriesExplorer({initialQuery = "", initialRegion = "All"}:{initialQuery?: string; initialRegion?: string}) {
  const reduced=useReducedMotion();
  const safeRegion = atlasRegions.includes(initialRegion as AtlasRegion) ? initialRegion as AtlasRegion : "All";
  const [query, setQuery] = useState(initialQuery);
  const [region, setRegion] = useState<AtlasRegion>(safeRegion);
  const [sort, setSort] = useState("name");

  const visible = useMemo(() => atlasCountries
    .filter((country) => (region === "All" || country.region === region) && `${country.name} ${country.capital} ${country.subregion}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "area" ? b.area - a.area : sort === "region" ? a.region.localeCompare(b.region) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name)), [query, region, sort]);

  return <>
    <div className="directory-kicker"><span>Complete directory</span><p>Every one of the 195 sovereign-state profiles is available below. Highlighted profiles include extended stories, leaders, notable people and football history; every country includes a structured geographic record.</p></div>
    <div className="explorer-tools">
      <label><span>Search the index</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Country, capital or region…"/></label>
      <label><span>Continent</span><select value={region} onChange={(event) => setRegion(event.target.value as AtlasRegion)}>{atlasRegions.map((name) => <option key={name}>{name}</option>)}</select></label>
      <label><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">A–Z</option><option value="area">Total area</option><option value="region">Continent</option></select></label>
    </div>
    <div className="results-line"><span><b>{visible.length}</b> of 195 country profiles</span><span>Geographic index · 2026 edition</span></div>
    <div className="country-grid">{visible.map((country, index) => {
      const editorial = country.editorial;
      return <MotionLink data-motion-owned whileHover={reduced?undefined:{y:-4,scale:1.02}} whileTap={reduced?undefined:{scale:.97}} transition={spring} initial={false} href={`/countries/${country.slug}`} className="country-card" key={country.slug} style={{"--country": editorial?.color ?? regionColours[country.region]} as React.CSSProperties}>
        <div className="card-top"><span>{String(index + 1).padStart(3, "0")}</span><b>{country.code}</b></div>
        <motion.div className="emoji-flag" role="img" aria-label={`${country.name} flag`} layoutId={reduced?undefined:`country-flag-${country.code}`} transition={spring}>{country.flag}</motion.div>
        <small>{country.subregion}</small><h2>{country.name}</h2><p>{country.capital}</p>
        <div className="card-stats"><span><small>{editorial ? "Population" : "Official name"}</small>{editorial?`${country.populationLabel} · ${country.populationYear}`:country.official}</span><span><small>Area</small>{country.areaLabel}</span></div>
        <div className="card-leader"><small>{editorial ? editorial.leaderTitle : "Currency"}</small><span>{editorial?.leader ?? (country.currencies.join(" · ") || "No national currency")}</span></div>
        <i>{editorial ? "Open extended profile" : "Open country record"} →</i>
      </MotionLink>;
    })}</div>
    {!visible.length && <div className="empty-state"><b>No country matched that search.</b><p>Try a capital, continent or shorter spelling.</p></div>}
  </>;
}
