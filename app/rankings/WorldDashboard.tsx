"use client";

import {useState, type ReactNode} from "react";
import Link from "next/link";
import worldMap from "@svg-maps/world";
import {atlasByCode, atlasCountries} from "../atlas-data";

type Lens = "population" | "area" | "trending";

const population = [
  ["IN","India","1.464B",1464],["CN","China","1.416B",1416],["US","United States","347M",347],
  ["ID","Indonesia","286M",286],["PK","Pakistan","255M",255],["NG","Nigeria","238M",238],
] as const;

const area = [...atlasCountries].sort((a,b)=>b.area-a.area).slice(0,6).map((country)=>[country.code,country.name,country.areaLabel,country.area] as const);

const trending = [
  ["NG","Nigeria","Culture · sport · travel",100],["JP","Japan","Cities · food · tradition",88],
  ["BR","Brazil","Football · nature · music",81],["GB","United Kingdom","History · icons · sport",74],
  ["ZA","South Africa","Wildlife · cities · culture",66],["MA","Morocco","Architecture · food · travel",58],
] as const;

const lenses = {population,area,trending};
const lensLabels:Record<Lens,string> = {population:"Most populous",area:"Largest by area",trending:"Trending profiles"};

const markers = [
  {code:"US",x:22,y:37},{code:"BR",x:35,y:69},{code:"NG",x:49,y:58},{code:"GB",x:47,y:31},
  {code:"IN",x:67,y:50},{code:"JP",x:83,y:42},{code:"AU",x:82,y:75},{code:"ZA",x:54,y:75},
];

const icons = {
  globe:<><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16"/></>,
  people:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  language:<><path d="M4 5h7M7.5 3v2M5 9c2-1 4-3 5-6M3 13h7l3 8 3-8h5M14 18h5"/></>,
  regions:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
};

function StatIcon({name}:{name:keyof typeof icons}) {return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{icons[name]}</svg>}

function NavIcon({type}:{type:"home"|"atlas"|"compare"|"people"|"method"}){
  const drawings={
    home:<><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    atlas:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9Z"/></>,
    compare:<><path d="M7 3v18M17 3v18M3 7l4-4 4 4M13 17l4 4 4-4"/></>,
    people:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    method:<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{drawings[type]}</svg>
}

export default function WorldDashboard({children}:{children?:ReactNode}) {
  const [lens,setLens]=useState<Lens>("population");
  const rows=lenses[lens];
  const max=Math.max(...rows.map((row)=>Number(row[3])));
  const byMapId=new Map(atlasCountries.map((country)=>[country.code.toLowerCase(),country]));
  const languageCount=new Set(atlasCountries.flatMap((country)=>country.languages)).size;

  return <div className="terra-dashboard-shell">
    <aside className="terra-sidebar" aria-label="TerraScope dashboard navigation">
      <Link href="/" className="terra-sidebar-brand" aria-label="TerraScope home">T</Link>
      <nav>
        <Link className="active" href="/rankings" aria-label="Dashboard"><NavIcon type="home"/><span>Dashboard</span></Link>
        <Link href="/countries" aria-label="Country atlas"><NavIcon type="atlas"/><span>Atlas</span></Link>
        <Link href="/compare" aria-label="Compare countries"><NavIcon type="compare"/><span>Compare</span></Link>
        <Link href="/people" aria-label="People"><NavIcon type="people"/><span>People</span></Link>
      </nav>
      <Link className="terra-sidebar-method" href="/method" aria-label="Method"><NavIcon type="method"/><span>Method</span></Link>
    </aside>

    <div className="terra-dashboard-main">
      <header className="terra-topbar"><div><strong>World Demographics Report</strong><span className="designed-credit">Designed by <b>Favour</b></span></div><div><button type="button" aria-label="Search countries">⌕</button><Link href="/method">☷ &nbsp; Customize</Link><Link className="topbar-primary" href="/countries">⌁ &nbsp; Add Country</Link></div></header>
      <section className="world-dashboard" aria-label="TerraScope world dashboard">

    <div className="dashboard-stats">
      <article><div><span>Countries Indexed <em>Complete</em></span><b>⋮</b></div><strong>{atlasCountries.length}</strong><small className="up">↗ 100% <i>sovereign coverage</i></small><StatIcon name="globe"/></article>
      <article><div><span>Total Population</span><b>⋮</b></div><strong>8.23B</strong><small className="up">↗ 0.85% <i>annual growth</i></small><StatIcon name="people"/></article>
      <article><div><span>Languages Tracked</span><b>⋮</b></div><strong>{languageCount}</strong><small className="up">↗ 7 <i>added this edition</i></small><StatIcon name="language"/></article>
      <article><div><span>World Regions <em>Live</em></span><b>⋮</b></div><strong>05</strong><small className="up">↗ 100% <i>regional coverage</i></small><StatIcon name="regions"/></article>
    </div>

    <div className="overview-card">
      <header><div><span>World Overview <em>195 profiles</em></span></div><div className="overview-actions"><button type="button" aria-label="Coverage date">▣</button><button type="button" aria-label="View settings">⚙</button><Link href="/countries">＋ Explore Countries</Link></div></header>
      <div className="overview-grid">
        <div className="dashboard-map">
          <svg viewBox={worldMap.viewBox} role="img" aria-label="World map with featured TerraScope country profiles">
            <defs><pattern id="mapDots" width="4.8" height="4.8" patternUnits="userSpaceOnUse"><circle cx="1.4" cy="1.4" r="1.05" fill="#4a4a4f"/></pattern></defs>
            {worldMap.locations.map((location)=>{
              const country=byMapId.get(location.id);
              return <path key={location.id} d={location.path} className={country?"dashboard-country":"dashboard-territory"}/>;
            })}
          </svg>
          {markers.map((marker)=>{const country=atlasByCode.get(marker.code); return country?<Link key={marker.code} href={`/countries/${country.slug}`} className="profile-marker" style={{left:`${marker.x}%`,top:`${marker.y}%`}} aria-label={`Open ${country.name} profile`}><i/><span>{country.name}</span></Link>:null})}
          <div className="map-key"><i/> Featured full profile</div>
        </div>

        <aside className="dashboard-ranking">
          <div className="dashboard-ranking-head"><div><strong>{lens==="population"?"8.23B":lens==="area"?"148.9M km²":"This week"}</strong><p>{lens==="population"?"People worldwide":lens==="area"?"Global land area":"Most opened country profiles"}</p></div><label><span className="sr-only">Choose ranking</span><select value={lens} onChange={(event)=>setLens(event.target.value as Lens)}><option value="population">Population</option><option value="area">Area</option><option value="trending">Trending</option></select></label></div>
          <div className="dashboard-rank-list">
            {rows.map((row,index)=>{const country=atlasByCode.get(row[0]); return <Link href={`/countries/${country?.slug ?? ""}`} key={row[0]}>
              <span className="rank-number">{String(index+1).padStart(2,"0")}</span><i>{country?.flag}</i><div><p><b>{row[1]}</b><strong>{row[2]}</strong></p><span><em style={{width:`${Math.max(9,(Number(row[3])/max)*100)}%`}}/></span></div>
            </Link>})}
          </div>
          <Link className="full-ranking-link" href="#all-rankings">Explore all ranking lenses <span>→</span></Link>
        </aside>
      </div>
    </div>
      </section>
      {children}
    </div>
  </div>;
}
