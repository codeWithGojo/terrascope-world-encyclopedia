import {SiteHeader} from "../components/SiteHeader";
import {SiteFooter} from "../components/SiteFooter";

const chapters = [
  {number:"01",label:"Built",title:"One atlas, 195 different stories.",text:"I built a country-by-country encyclopaedia that connects geography, people, sport, culture, travel and rankings without making each profile feel like a copy of the last one. The goal was simple: let someone arrive for a number and stay because the place feels worth knowing."},
  {number:"02",label:"Learned",title:"Clean data is rarely born clean.",text:"Working across 195 countries taught me that even basic facts arrive in different formats, years and definitions. I learned to normalise country codes, names, currencies, languages and units, then keep editorial writing separate from structured statistics so both can grow without breaking the site."},
  {number:"03",label:"Challenge",title:"Consistency without pretending certainty.",text:"The hardest part was sourcing comparable information. Population estimates move, borders can be politically sensitive, leaders change and rankings use different dates. I had to decide what counted, keep the source and year visible, and leave room for context instead of presenting every figure as permanent truth."},
];

export default function MethodPage(){return <main><SiteHeader active="method"/>
  <section className="method-hero"><p>About the project · Method & making</p><div><h1>A living atlas,<br/><em>built with care.</em></h1><div><span>Why I made it</span><blockquote>“I wanted to build something that makes the world feel explorable—not another Wikipedia clone you open, skim and forget.”</blockquote><p>— Favour Imegu, creator of TerraScope</p></div></div></section>
  <section className="build-story"><header><span>Behind TerraScope</span><h2>Built / Learned / Challenge</h2></header><div>{chapters.map((chapter)=><article key={chapter.label}><span>{chapter.number}</span><small>{chapter.label}</small><h3>{chapter.title}</h3><p>{chapter.text}</p></article>)}</div></section>
  <section className="method-principles"><p>How the atlas stays honest</p><div><article><b>Source beside the claim</b><span>Important rankings keep the publisher, date and definition visible.</span></article><article><b>Context before judgement</b><span>A ranking is a lens—not a verdict on a country or its people.</span></article><article><b>Structured, then human</b><span>Data provides the backbone; clear editorial writing makes it worth exploring.</span></article></div></section>
  <SiteFooter/></main>}
