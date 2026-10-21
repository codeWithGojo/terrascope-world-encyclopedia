"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {animate,useReducedMotion} from "framer-motion";
// Delegation gives existing and newly rendered controls the same tactile response.
export function SiteMotion(){
 const path=usePathname();const reduced=useReducedMotion();
 useEffect(()=>{document.documentElement.dataset.motion=reduced?"off":"on";window.dispatchEvent(new Event("terrascope-motion"));},[reduced]);
 useEffect(()=>{
  if(reduced)return;
  const controls=new Map<Element,ReturnType<typeof animate>>();
  const target=(e:Event)=>e.target instanceof Element?e.target.closest<HTMLElement>('button:not(:disabled),a:not(.skip-link),summary,[data-interactive]'):null;
  const play=(el:HTMLElement,scale:number,y:number)=>{if(el.closest('[data-native-motion]')||el.tagName==='path')return;controls.get(el)?.stop();controls.set(el,animate(el,{scale,y},{type:"spring",stiffness:410,damping:23}));};
  const over=(e:PointerEvent)=>{if(e.pointerType==='touch'||matchMedia('(max-width:760px)').matches)return;const el=target(e);if(el)play(el,1.025,-2);};
  const out=(e:PointerEvent)=>{const el=target(e);if(el&&(!(e.relatedTarget instanceof Node)||!el.contains(e.relatedTarget)))play(el,1,0);};
  let pressed:HTMLElement|null=null;const down=(e:PointerEvent)=>{const el=target(e);if(el){pressed=el;play(el,.96,1);}};const up=()=>{if(pressed){play(pressed,1,0);pressed=null;}};const keydown=(e:KeyboardEvent)=>{if(e.key!=='Enter'&&e.key!==' ')return;const el=target(e);if(el){pressed=el;play(el,.97,1);}};
  document.addEventListener('pointerover',over);document.addEventListener('pointerout',out);document.addEventListener('pointerdown',down);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up);document.addEventListener('keydown',keydown);document.addEventListener('keyup',up);
  const selector='.ts-reveal,.heritage-card,.journey-card,.greats-club,.country-card,.country-feature,.continent-photo,.lens-grid article,.world-threads a,.profile-content>section>h2,.football-person-card,.travel-stats-grid>article,.travel-visited-list>div,.home-experience-links>a,.section-heading,.travel-section-heading';
  const elements=new Set<HTMLElement>();
  const observer=new IntersectionObserver(entries=>entries.forEach((entry)=>{
   if(!entry.isIntersecting)return;
   const el=entry.target as HTMLElement;
   const index=el.parentElement?Array.from(el.parentElement.children).indexOf(el):0;
   const scale=[1,1];
   controls.set(el,animate(el,{opacity:[.2,1],y:[22,0],scale},{duration:.6,delay:Math.min(index%6,4)*.055,ease:[.22,1,.36,1]}));
   observer.unobserve(el);
  }),{threshold:.06});
  const register=(root:Document|HTMLElement)=>{
   const found=Array.from(root.querySelectorAll<HTMLElement>(selector));
   if(root instanceof HTMLElement&&root.matches(selector))found.unshift(root);
   found.forEach(el=>{if(!elements.has(el)){elements.add(el);observer.observe(el);}});
  };
  register(document);
  // Register newly filtered cards without running a scroll handler or animation loop.
  const mutations=new MutationObserver(records=>{for(const record of records){for(const node of record.addedNodes)if(node instanceof HTMLElement)register(node);for(const node of record.removedNodes)if(node instanceof HTMLElement){for(const el of elements)if(node===el||node.contains(el)){observer.unobserve(el);controls.get(el)?.stop();controls.delete(el);elements.delete(el);}}}});
  mutations.observe(document.getElementById('main-content')??document.body,{childList:true,subtree:true});
  return()=>{mutations.disconnect();observer.disconnect();controls.forEach(c=>c.stop());elements.forEach(el=>{el.style.opacity='';el.style.transform='';});document.removeEventListener('pointerover',over);document.removeEventListener('pointerout',out);document.removeEventListener('pointerdown',down);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',up);};
 },[path,reduced]);return null;
}
