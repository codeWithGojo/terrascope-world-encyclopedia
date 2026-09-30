"use client";

import {useState} from "react";
import Link from "next/link";
import {atlasByCode, atlasCountries} from "../atlas-data";

import {indicatorsByCode,indicatorDataset} from "../country-indicators";
import {populationDataset} from "../population-data";

type Entry = {code:string; name:string; flag:string; value:string; score:number; note?:string; slug?:string};
type Category = {id:string; short:string; title:string; eyebrow:string; unit:string; date:string; description:string; source:string; sourceLabel:string; caution?:string; entries:Entry[]};
const entry = (code:string, name:string, flag:string, value:string, score:number, note?:string, slug?:string):Entry => ({code,name,flag,value,score,note,slug});

const largest = [...atlasCountries].sort((a,b) => b.area-a.area).slice(0,10).map((country) => entry(country.code,country.name,country.flag,country.areaLabel,country.area,"Total area",country.slug));

function metricEntries(key:"gdp"|"perCapita",ascending=false){return atlasCountries.flatMap(c=>{const metric=indicatorsByCode[c.code]?.[key];return metric?[entry(c.code,c.name,c.flag,new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:key==="gdp"?"compact":"standard",maximumFractionDigits:key==="gdp"?2:0}).format(metric.value),metric.value,`Observation: ${metric.year}`,c.slug)]:[];}).sort((a,b)=>ascending?a.score-b.score:b.score-a.score).slice(0,10);}
const populationEntries=[...atlasCountries].sort((a,b)=>b.population-a.population).slice(0,10).map(c=>entry(c.code,c.name,c.flag,c.populationLabel,c.population,`${c.populationSource} · ${c.populationYear}`,c.slug));
const mixedYears="Latest available observations can have different reporting years. Each row shows its year; missing values are excluded. Revisions and exchange rates affect comparisons.";
const categories: Category[] = [
  {id:"economies",short:"Richest",title:"Largest economies",eyebrow:"Economic scale",unit:"Nominal GDP · current US$",date:`World Bank · refreshed ${indicatorDataset.refreshedAt}`,description:"Observed national output measures economic scale, not household wealth or how evenly prosperity is shared.",source:"https://data.worldbank.org/indicator/NY.GDP.MKTP.CD",sourceLabel:"World Bank national accounts",caution:mixedYears,entries:metricEntries("gdp")},
  {id:"per-capita",short:"Per person",title:"Highest output per person",eyebrow:"Average economic output",unit:"GDP per capita · current US$",date:`World Bank · refreshed ${indicatorDataset.refreshedAt}`,description:"GDP per person divides national output by population. It is not a salary, disposable income or a measure of inequality.",source:"https://data.worldbank.org/indicator/NY.GDP.PCAP.CD",sourceLabel:"World Bank national accounts",caution:mixedYears+" Small resident populations and cross-border activity can raise microstate figures.",entries:metricEntries("perCapita")},
  {id:"population",short:"Population",title:"Most populous nations",eyebrow:"People and scale",unit:"Reported residents",date:`World Bank · refreshed ${populationDataset.refreshedAt}`,description:"The same dated population records power country profiles and this ranking. Each row identifies its reporting year.",source:populationDataset.worldBankUrl,sourceLabel:"World Bank population data",caution:"Latest country observations can refer to different years; population estimates and census series are revised.",entries:populationEntries},
  {id:"football",short:"Football",title:"Football power ranking",eyebrow:"Men’s national teams · official snapshot",unit:"Official world position",date:"FIFA · 20 July 2026",description:"The official FIFA men’s ranking snapshot published on 20 July 2026. Rankings move whenever rated matches are played.",source:"https://inside.fifa.com/fifa-rankings/world-ranking/men/news/spain-top-mens-world-rankings-after-second-world-cup",sourceLabel:"FIFA/Coca-Cola Men’s World Ranking",entries:[entry("ES","Spain","🇪🇸","World No. 1",10),entry("AR","Argentina","🇦🇷","World No. 2",9),entry("FR","France","🇫🇷","World No. 3",8),entry("GB","England","🏴","World No. 4",7,undefined,"united-kingdom"),entry("BR","Brazil","🇧🇷","World No. 5",6),entry("MA","Morocco","🇲🇦","World No. 6",5),entry("PT","Portugal","🇵🇹","World No. 7",4),entry("BE","Belgium","🇧🇪","World No. 8",3),entry("NL","Netherlands","🇳🇱","World No. 9",2),entry("MX","Mexico","🇲🇽","World No. 10",1)]},
  {id:"legacy",short:"World Cups",title:"Men’s World Cup legacy",eyebrow:"All-time champions",unit:"Senior men’s titles",date:"FIFA · through 2026",description:"The nations with the most FIFA Men’s World Cup victories. Equal title totals share the same historic achievement even when displayed sequentially.",source:"https://www.fifa.com/en/tournaments/mens/worldcup",sourceLabel:"FIFA World Cup archive",entries:[entry("BR","Brazil","🇧🇷","5 titles",5,"1958 · 1962 · 1970 · 1994 · 2002"),entry("DE","Germany","🇩🇪","4 titles",4,"1954 · 1974 · 1990 · 2014"),entry("IT","Italy","🇮🇹","4 titles",4,"1934 · 1938 · 1982 · 2006"),entry("AR","Argentina","🇦🇷","3 titles",3,"1978 · 1986 · 2022"),entry("FR","France","🇫🇷","2 titles",2,"1998 · 2018"),entry("UY","Uruguay","🇺🇾","2 titles",2,"1930 · 1950"),entry("ES","Spain","🇪🇸","2 titles",2,"2010 · 2026"),entry("GB","England","🏴","1 title",1,"1966", "united-kingdom")]},
  {id:"low-income",short:"Lowest output",title:"Lowest reported output per person",eyebrow:"Development pressure",unit:"GDP per capita · current US$",date:`World Bank · refreshed ${indicatorDataset.refreshedAt}`,description:"Low average output describes economic conditions, not the worth, culture or potential of a country or its people.",source:"https://data.worldbank.org/indicator/NY.GDP.PCAP.CD",sourceLabel:"World Bank national accounts",caution:mixedYears+" Conflict, inflation and incomplete coverage can affect order.",entries:metricEntries("perCapita",true)},
  {id:"integrity",short:"Integrity risk",title:"Highest perceived corruption risk",eyebrow:"Public-sector integrity",unit:"CPI score · 0–100",date:"Transparency International · CPI 2025",description:"The Corruption Perceptions Index measures perceived public-sector corruption. A lower score means higher perceived corruption; it does not label a population or measure every kind of corruption.",source:"https://www.transparency.org/en/cpi/2025",sourceLabel:"Transparency International CPI 2025",caution:"Perception-based indicators are comparative signals, not verdicts. Weak institutions, conflict and restricted civic space often overlap with low scores. All countries tied at the cutoff score are included; displayed order is not an official rank.",entries:[entry("SS","South Sudan","🇸🇸","9 / 100",9),entry("SO","Somalia","🇸🇴","9 / 100",9),entry("VE","Venezuela","🇻🇪","10 / 100",10),entry("ER","Eritrea","🇪🇷","13 / 100",13),entry("LY","Libya","🇱🇾","13 / 100",13),entry("YE","Yemen","🇾🇪","13 / 100",13),entry("NI","Nicaragua","🇳🇮","14 / 100",14),entry("SD","Sudan","🇸🇩","14 / 100",14),entry("GQ","Equatorial Guinea","🇬🇶","15 / 100",15),entry("KP","North Korea","🇰🇵","15 / 100",15),entry("SY","Syria","🇸🇾","15 / 100",15)]},
  {id:"territory",short:"Territory",title:"Largest countries by area",eyebrow:"Physical scale",unit:"Total area",date:"ISO-linked geographic record",description:"The largest sovereign states in TerraScope’s complete 195-country geographic dataset, using total-area reference figures.",source:"https://github.com/mledoze/countries",sourceLabel:"world-countries reference dataset",entries:largest},
];

function countryHref(item:Entry) {
  if (item.slug) return `/countries/${item.slug}`;
  return `/countries/${atlasByCode.get(item.code)?.slug ?? ""}`;
}

export default function RankingsExplorer() {
  const [active, setActive] = useState(categories[0].id);
  const category = categories.find((item) => item.id === active) ?? categories[0];
  const max = Math.max(...category.entries.map((item) => item.score));
  return <section className="ranking-explorer">
    <div className="ranking-tabs" role="group" aria-label="World ranking categories">{categories.map((item) => <button type="button" aria-pressed={item.id === active} className={item.id === active ? "active" : ""} key={item.id} onClick={() => setActive(item.id)}><span>{item.short}</span><small>{item.entries.length}</small></button>)}</div>
    <label className="ranking-mobile-picker">Choose a ranking<select value={active} onChange={(event)=>setActive(event.target.value)}>{categories.map((item)=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
    <div className="ranking-dashboard" aria-live="polite">
      <header><div><p>{category.eyebrow}</p><h2>{category.title}</h2></div><div><small>{category.unit}</small><b>{category.date}</b></div></header>
      <p className="ranking-description">{category.description}</p>
      <div className="ranking-table">{category.entries.map((item,index) => <Link href={countryHref(item)} className="ranking-row" key={`${category.id}-${item.name}`}>
        <span className="ranking-position">{String(index + 1).padStart(2,"0")}</span><span className="ranking-flag">{item.flag}</span><div><b>{item.name}</b>{item.note && <small>{item.note}</small>}</div><strong>{item.value}</strong><i style={{width:`${Math.max(4,(item.score/max)*100)}%`}} />
      </Link>)}</div>
      <footer className="ranking-method"><div><span>Source</span><a href={category.source} target="_blank" rel="noreferrer">{category.sourceLabel} ↗</a></div>{category.caution && <p>{category.caution}</p>}</footer>
    </div>
  </section>;
}
