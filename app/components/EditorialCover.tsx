"use client";
import {useState} from "react";
import {motion,useReducedMotion} from "motion/react";
import Link from "next/link";
import {ArrowUpRight} from "./ArrowUpRight";
const scenes=[
 {title:"Patagonia, Chile",region:"South America",image:"/continents/americas.jpg",credit:"Chris Stenger / Unsplash",href:"/countries/chile",caption:"A different sense of scale."},
 {title:"Mount Fuji, Japan",region:"East Asia",image:"/continents/asia.jpg",credit:"Sora Sagano / Unsplash",href:"/countries/japan",caption:"Find a different rhythm."},
 {title:"Okonjima, Namibia",region:"Southern Africa",image:"/continents/africa.jpg",credit:"Nadine Marfurt / Unsplash",href:"/countries/namibia",caption:"Take the longer way around."}
];
export function EditorialCover(){
 const [index,setIndex]=useState(0),reduced=useReducedMotion(),scene=scenes[index];
 return <section className="journal-cover" aria-labelledby="journal-title">
  <div className="journal-image"><motion.img key={scene.image} src={scene.image} alt={scene.title} width={1600} height={1000} fetchPriority={index===0?"high":"auto"} initial={reduced?false:{opacity:.45,scale:1.025}} animate={{opacity:1,scale:1}} transition={{duration:.6,ease:"easeOut"}}/><div className="journal-image-shade"/></div>
  <div className="journal-cover-content"><div className="journal-overline"><span><i/>THE WORLD IS STILL SURPRISING.</span><span>AN INDEPENDENT ATLAS / EST. 2026</span></div><div className="journal-headline"><p className="journal-issue">COUNTRIES · CULTURE · CURIOSITY</p><h1 id="journal-title">The world,<br/>a little <span>closer.</span></h1><p>Go somewhere new, even from here. Explore country stories, wander through remarkable places and turn curiosity into a plan.</p><form className="journal-search" action="/countries"><label htmlFor="journal-country-search">Where would you like to explore?</label><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><input id="journal-country-search" name="q" type="search" placeholder="Search a country or capital…" autoComplete="off"/><button type="submit">Find a place <ArrowUpRight/></button></div></form><div className="journal-starters"><span>START WITH</span><Link href="/countries/nigeria">Nigeria</Link><Link href="/countries/japan">Japan</Link><Link href="/countries/egypt">Egypt</Link><Link href="/travel#matcher">Surprise me <ArrowUpRight/></Link></div></div><div className="journal-bottom"><div className="journal-scene" aria-live="polite"><span>IN THE FRAME / 0{index+1}</span><Link href={scene.href}>{scene.title} <ArrowUpRight/></Link><small>{scene.region} · Photo: {scene.credit}</small></div><div className="journal-scene-controls" role="group" aria-label="Choose a landscape">{scenes.map((item,i)=><button type="button" aria-pressed={index===i} aria-label={`Show ${item.title}`} onClick={()=>setIndex(i)} key={item.image}><span>0{i+1}</span><small>{item.title.split(",")[1].trim()}</small><i/></button>)}</div><a className="journal-scroll" href="#discover">Start exploring <span aria-hidden="true">↓</span></a></div></div>
 </section>;
}
