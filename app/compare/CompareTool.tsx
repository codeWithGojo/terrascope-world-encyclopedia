"use client";

import {useState} from "react";
import Link from "next/link";
import {atlasCountries,regionColours,type AtlasCountry} from "../atlas-data";
import {iqByCode} from "../iq-data";

const number=(value:number)=>value.toLocaleString("en-US");
const population=(value:number)=>value>=1e9?`${(value/1e9).toFixed(2)}B`:`${(value/1e6).toFixed(1)}M`;
const colour=(country:AtlasCountry)=>country.editorial?.color??regionColours[country.region];

export default function CompareTool(){
  const [first,setFirst]=useState("nigeria");
  const [second,setSecond]=useState("japan");
  const a=atlasCountries.find((country)=>country.slug===first)??atlasCountries[0];
  const b=atlasCountries.find((country)=>country.slug===second)??atlasCountries[1];
  const rows=[
    ["Official name",a.official,b.official],["Capital",a.capital,b.capital],["Region",`${a.subregion} · ${a.region}`,`${b.subregion} · ${b.region}`],
    ["Population density",`${Math.round(a.density)} / km²`,`${Math.round(b.density)} / km²`],["Population rank",`#${a.populationRank} of 195`,`#${b.populationRank} of 195`],
    ["Area rank",`#${a.areaRank} of 195`,`#${b.areaRank} of 195`],["Reported IQ rank",iqByCode.get(a.code)?`#${iqByCode.get(a.code)?.rank} · ${iqByCode.get(a.code)?.score.toFixed(2)}`:"Not in dataset",iqByCode.get(b.code)?`#${iqByCode.get(b.code)?.rank} · ${iqByCode.get(b.code)?.score.toFixed(2)}`:"Not in dataset"],
    ["Languages",a.languages.join(" · ")||"—",b.languages.join(" · ")||"—"],["Currencies",a.currencies.join(" · ")||"—",b.currencies.join(" · ")||"—"],
    ["Time zones",a.timezones.join(" · ")||"—",b.timezones.join(" · ")||"—"],["Driving side",a.carSide,b.carSide],["Land borders",String(a.borders.length),String(b.borders.length)],
    ["Calling code",a.calling,b.calling],["Country domain",a.tld,b.tld],["Government",a.editorial?.government??"Editorial government record pending",b.editorial?.government??"Editorial government record pending"],
  ];
  function chooseFirst(next:string){if(next===second)setSecond(first);setFirst(next);}
  function chooseSecond(next:string){if(next===first)setFirst(second);setSecond(next);}
  return <>
    <div className="compare-selectors"><label><span>Country A · 195 available</span><select value={first} onChange={(event)=>chooseFirst(event.target.value)}>{atlasCountries.map((country)=><option value={country.slug} key={country.slug}>{country.flag} {country.code} {country.name}</option>)}</select></label><i>VERSUS</i><label><span>Country B · 195 available</span><select value={second} onChange={(event)=>chooseSecond(event.target.value)}>{atlasCountries.map((country)=><option value={country.slug} key={country.slug}>{country.flag} {country.code} {country.name}</option>)}</select></label></div>
    <div className="compare-head"><div style={{"--country":colour(a)} as React.CSSProperties}><span>{a.flag}</span><small>{a.subregion}</small><h2>{a.name}</h2><Link href={`/countries/${a.slug}`}>View profile ↗</Link></div><div style={{"--country":colour(b)} as React.CSSProperties}><span>{b.flag}</span><small>{b.subregion}</small><h2>{b.name}</h2><Link href={`/countries/${b.slug}`}>View profile ↗</Link></div></div>
    <div className="comparison-table"><div className="comparison-row"><p>Population</p><div><b>{population(a.population)}</b><i style={{width:`${a.population/Math.max(a.population,b.population)*100}%`,background:colour(a)}}/></div><div><b>{population(b.population)}</b><i style={{width:`${b.population/Math.max(a.population,b.population)*100}%`,background:colour(b)}}/></div></div><div className="comparison-row"><p>Land area</p><div><b>{number(Math.round(a.area))} km²</b><i style={{width:`${a.area/Math.max(a.area,b.area)*100}%`,background:colour(a)}}/></div><div><b>{number(Math.round(b.area))} km²</b><i style={{width:`${b.area/Math.max(a.area,b.area)*100}%`,background:colour(b)}}/></div></div>{rows.map((row)=><div className="comparison-row text" key={row[0]}><p>{row[0]}</p><b>{row[1]}</b><b>{row[2]}</b></div>)}</div>
  </>;
}
