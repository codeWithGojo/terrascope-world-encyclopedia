"use client";
import {useEffect,useState} from "react";
import {usePathname} from "next/navigation";

export function SiteMotion(){
 const [paused,setPaused]=useState(false),[ready,setReady]=useState(false);const path=usePathname();
 useEffect(()=>{
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  const update=()=>{let preference="";try{preference=localStorage.getItem("terrascope-motion")||"";}catch{}const off=media.matches||preference==="off";setPaused(off);document.documentElement.dataset.motion=off?"off":"on";window.dispatchEvent(new Event("terrascope-motion"));};
  update();setReady(true);media.addEventListener("change",update);return()=>media.removeEventListener("change",update);
 },[]);
 useEffect(()=>{
  const root=document.documentElement;const elements=Array.from(document.querySelectorAll("main section:not(.hero) > .section-heading, .ts-reveal, .heritage-card, .journey-card, .greats-club, .world-threads a, .continent-photo, .country-feature, .profile-content > section > h2"));
  if(!("IntersectionObserver" in window))return;
  root.classList.add("reveal-ready");
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add("is-revealed");observer.unobserve(entry.target);}},{threshold:.06,rootMargin:"0px 0px 32px"});
  elements.forEach((el,index)=>{el.classList.add("ts-reveal");(el as HTMLElement).style.setProperty("--reveal-delay",`${Math.min(index%4,3)*50}ms`);observer.observe(el);});
  return()=>{observer.disconnect();elements.forEach(el=>el.classList.add("is-revealed"));};
 },[path]);
 function toggle(){const next=!paused;setPaused(next);document.documentElement.dataset.motion=next?"off":"on";try{localStorage.setItem("terrascope-motion",next?"off":"on");}catch{}window.dispatchEvent(new Event("terrascope-motion"));}
 return <button className="motion-control" type="button" onClick={toggle} aria-pressed={paused} aria-label={paused?"Enable site motion":"Pause site motion"} disabled={!ready}><span aria-hidden="true">{paused?"▷":"Ⅱ"}</span> Motion {paused?"off":"on"}</button>;
}
