"use client";

import {useState, type ReactNode} from "react";
import Link from "next/link";
import worldMap from "@svg-maps/world";
import {atlasByCode, atlasCountries} from "../atlas-data";

import {worldPopulation} from "../population-data";

const worldPopulationLabel=`${(worldPopulation.value/1e9).toFixed(2)}B`;
const indexedAreaLabel=`${(atlasCountries.reduce((sum,c)=>sum+c.area,0)/1e6).toFixed(1)}M km²`;
type Lens = "population" | "area" | "trending";

type WorldMapLocation = {
  id: string;
  path: string;
};

const population=[...atlasCountries].sort((a,b)=>b.population-a.population).slice(0,6).map(c=>[c.code,c.name,`${c.populationLabel} · ${c.populationYear}`,c.population] as const);

const area = [...atlasCountries].sort((a,b)=>b.area-a.area).slice(0,6).map((country)=>[country.code,country.name,country.areaLabel,country.area] as const);

const trending = [
  ["NG","Nigeria","Culture · sport · travel",100],["JP","Japan","Cities · food · tradition",88],
  ["BR","Brazil","Football · nature · music",81],["GB","United Kingdom","History · icons · sport",74],
  ["ZA","South Africa","Wildlife · cities · culture",66],["MA","Morocco","Architecture · food · travel",58],
] as const;

const lenses = {population,area,trending};

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

export default function WorldDashboard({children}:{children?:ReactNode}) {
  const [lens,setLens]=useState<Lens>("population");
  const rows=lenses[lens];
  const max=Math.max(...rows.map((row)=>Number(row[3])));
  const byMapId=new Map(atlasCountries.map((country)=>[country.code.toLowerCase(),country]));
  const languageCount=new Set(atlasCountries.flatMap((country)=>country.languages)).size;

  return <div className="terra-dashboard-shell">
    <div className="terra-dashboard-main">
      <header className="terra-topbar"><div><small>TerraScope / world index</small><strong>World rankings</strong><span className="designed-credit">Designed by <b>Favour</b></span></div><div><Link href="/method">How we measure</Link><Link className="topbar-primary" href="/countries">Explore countries ↗</Link></div></header>
      <section className="world-dashboard" aria-label="TerraScope world dashboard">

    <div className="dashboard-stats">
      <article><div><span>Countries Indexed</span></div><strong>{atlasCountries.length}</strong><small>sovereign profiles</small><StatIcon name="globe"/></article>
      <article><div><span>Total Population</span></div><strong>{worldPopulationLabel}</strong><small>World Bank · {worldPopulation.year}</small><StatIcon name="people"/></article>
      <article><div><span>Languages Tracked</span></div><strong>{languageCount}</strong><small>in the atlas register</small><StatIcon name="language"/></article>
      <article><div><span>World Regions</span></div><strong>05</strong><small>continental groups</small><StatIcon name="regions"/></article>
    </div>

    <div className="overview-card">
      <header><div><span>World overview <em>195 profiles</em></span></div><div className="overview-actions"><Link href="/countries">Explore countries ↗</Link></div></header>
      <div className="overview-grid">
        <div className="dashboard-map">
          <svg viewBox={worldMap.viewBox} role="img" aria-label="World map with featured TerraScope country profiles">
            <defs><pattern id="mapDots" width="4.8" height="4.8" patternUnits="userSpaceOnUse"><circle cx="1.4" cy="1.4" r="1.05" fill="#4a4a4f"/></pattern></defs>
            {(worldMap.locations as WorldMapLocation[]).map((location)=>{
              const country=byMapId.get(location.id);
              return <path key={location.id} d={location.path} className={country?"dashboard-country":"dashboard-territory"}/>;
            })}
          </svg>
          {markers.map((marker)=>{const country=atlasByCode.get(marker.code); return country?<Link key={marker.code} href={`/countries/${country.slug}`} className="profile-marker" style={{left:`${marker.x}%`,top:`${marker.y}%`}} aria-label={`Open ${country.name} profile`}><i/><span>{country.name}</span></Link>:null})}
          <div className="map-key"><i/> Featured country profile</div>
        </div>

        <aside className="dashboard-ranking">
          <div className="dashboard-ranking-head"><div><strong>{lens==="population"?worldPopulationLabel:lens==="area"?indexedAreaLabel:"Featured"}</strong><p>{lens==="population"?"People worldwide":lens==="area"?"Total indexed country area":"Editorial country picks"}</p></div><label><span className="sr-only">Choose overview ranking</span><select value={lens} onChange={(event)=>setLens(event.target.value as Lens)}><option value="population">Population</option><option value="area">Area</option><option value="trending">Featured</option></select></label></div>
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
