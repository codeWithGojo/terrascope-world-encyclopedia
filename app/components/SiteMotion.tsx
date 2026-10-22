"use client";
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {usePathname} from 'next/navigation';


const subscribeMotion=(callback:()=>void)=>{window.addEventListener("storage",callback);return ()=>window.removeEventListener("storage",callback);};
const savedMotion=()=>{try{return localStorage.getItem("terrascope-motion")==="off";}catch{return false;}};
const subscribeReduced=(callback:()=>void)=>{const query=matchMedia("(prefers-reduced-motion: reduce)");query.addEventListener("change",callback);return ()=>query.removeEventListener("change",callback);};
const reducedSnapshot=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
export function SiteMotion(){
 const path=usePathname();const reduced=useSyncExternalStore(subscribeReduced,reducedSnapshot,()=>false);
 const saved=useSyncExternalStore(subscribeMotion,savedMotion,()=>false);
 const [override,setPaused]=useState<boolean|null>(null);const paused=override??saved;const progress=useRef<HTMLSpanElement>(null);
 const off=Boolean(reduced||paused);
 useEffect(()=>{document.documentElement.dataset.motion=off?'off':'on';window.dispatchEvent(new Event('terrascope-motion'));},[off]);
 useEffect(()=>{
  if(off||reducedSnapshot()||!('IntersectionObserver' in window)||!Element.prototype.animate)return;
  const running=new Set<Animation>(),seen=new WeakSet<Element>();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const el=entry.target as HTMLElement,index=Array.from(el.parentElement?.children??[]).indexOf(el);
   const photo=el.matches('.escape-cover-card,.escape-story-card,.region-cover,.nearby-city,.city-guide-hero>figure');
   const animation=el.animate([{opacity:.15,transform:photo?'translateY(30px) scale(.97)':'translateY(22px)'},{opacity:1,transform:'none'}],{duration:photo?850:620,delay:Math.min(index%5,4)*55,easing:'cubic-bezier(.16,1,.3,1)'});
   running.add(animation);animation.onfinish=()=>running.delete(animation);observer.unobserve(el);
  }),{threshold:.06});
  const selector='.ts-reveal,.heritage-card,.journey-card,.greats-club,.country-card,.country-feature,.continent-photo,.lens-grid article,.world-threads a,.football-person-card,.travel-stats-grid>article,.travel-visited-list>div,.home-experience-links>a,.section-heading,.travel-section-heading,.atlas-section-head>div,.escape-cover-card,.escape-story-card,.region-cover,.nearby-city,.atlas-map-copy,.reference-paths>a,.atlas-data-footer>div,.dashboard-stats>article,.dashboard-rank-list>a,.ranking-row,.city-guide-hero>figure,.city-guide-page>section>h2,.profile-content>section>h2';
  const register=(root:Document|HTMLElement)=>{const found=Array.from(root.querySelectorAll<HTMLElement>(selector));if(root instanceof HTMLElement&&root.matches(selector))found.unshift(root);found.forEach(el=>{if(!seen.has(el)){seen.add(el);observer.observe(el);}});};register(document);
  const mutations=new MutationObserver(records=>records.forEach(record=>{record.addedNodes.forEach(node=>{if(node instanceof HTMLElement)register(node);});record.removedNodes.forEach(node=>{if(node instanceof HTMLElement){observer.unobserve(node);node.querySelectorAll(selector).forEach(el=>observer.unobserve(el));}});}));
  mutations.observe(document.getElementById('main-content')??document.body,{childList:true,subtree:true});
  let frame=0;
  const update=()=>{frame=0;const total=document.documentElement.scrollHeight-innerHeight;if(progress.current)progress.current.style.transform=`scaleX(${total>0?scrollY/total:0})`;};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};update();window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);
  const resize=new ResizeObserver(scroll);resize.observe(document.body);
  return()=>{observer.disconnect();mutations.disconnect();resize.disconnect();running.forEach(a=>a.cancel());cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);};
 },[path,off]);
 return <><div className="ts-reading-progress" aria-hidden="true"><span ref={progress}/></div><button type="button" className="ts-motion-toggle" aria-pressed={off} disabled={Boolean(reduced)} onClick={()=>{const next=!paused;setPaused(next);try{localStorage.setItem('terrascope-motion',next?'off':'on');}catch{/* Optional preference. */}}} title={reduced?'Reduced motion follows your device setting':'Control decorative animation'}>{off?'▷ Motion off':'Ⅱ Pause motion'}</button></>;
}
