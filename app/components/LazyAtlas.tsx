"use client";
import {useEffect,useRef,useState} from "react";
import dynamic from "next/dynamic";
import {Skeleton} from "./Skeleton";
const Map=dynamic(()=>import("./WorldAtlas").then(x=>x.WorldAtlas),{ssr:false,loading:()=> <div className="atlas-loading"><Skeleton label="Opening the world map"/></div>});
export function LazyAtlas(){const [loaded,setLoaded]=useState(false);const box=useRef<HTMLDivElement>(null);useEffect(()=>{if(!box.current)return;if(!("IntersectionObserver" in window)){setLoaded(true);return;}const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setLoaded(true);observer.disconnect();}},{rootMargin:"250px"});observer.observe(box.current);return()=>observer.disconnect();},[]);return <div ref={box} className="lazy-atlas">{loaded?<Map compact/>:<div className="atlas-loading"><p>195 countries. Choose a place to begin.</p><button type="button" className="ts-button" onClick={()=>setLoaded(true)}>Load interactive map</button><a href="/countries">Browse the country index →</a></div>}</div>;}
