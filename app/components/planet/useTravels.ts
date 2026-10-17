"use client";
import {useCallback,useMemo,useSyncExternalStore} from 'react';
import {validTravels} from './math';
import type {Country} from './types';
const KEY='terrascope-visited-countries',EVENT='terrascope-travels-updated';
const EMPTY={values:[] as unknown,persistent:true};
let cachedRaw:string|null|undefined,cached=EMPTY,memory:unknown=[],memoryOnly=false;
function snapshot(){
 if(memoryOnly)return cached;
 try{const raw=localStorage.getItem(KEY);if(raw!==cachedRaw){cachedRaw=raw;let values:unknown=[];try{values=JSON.parse(raw||'[]');}catch{}cached={values,persistent:true};}return cached;}
 catch{memoryOnly=true;cached={values:memory,persistent:false};return cached;}
}
function subscribe(listener:()=>void){
 const sync=(event:StorageEvent)=>{if(event.key===KEY||event.key===null)listener();};
 window.addEventListener('storage',sync);window.addEventListener(EVENT,listener);
 return()=>{window.removeEventListener('storage',sync);window.removeEventListener(EVENT,listener);};
}
const serverSnapshot=()=>EMPTY;
export function useTravels(countries:Country[]){
 const current=useSyncExternalStore(subscribe,snapshot,serverSnapshot),codes=useMemo(()=>new Set(countries.map(c=>c.code)),[countries]);
 const visited=useMemo(()=>validTravels(current.values,codes),[current,codes]);
 const toggle=useCallback((code:string)=>{
  if(!codes.has(code))return;
  const previous=validTravels(snapshot().values,codes),next=previous.includes(code)?previous.filter(c=>c!==code):[...previous,code].sort();
  memory=next;
  if(!memoryOnly)try{localStorage.setItem(KEY,JSON.stringify(next));}catch{memoryOnly=true;}
  if(memoryOnly)cached={values:next,persistent:false};
  window.dispatchEvent(new Event(EVENT));
 },[codes]);
 return{visited,toggle,persistent:current.persistent};
}
