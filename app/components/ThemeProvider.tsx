"use client";
import {motion,AnimatePresence,useReducedMotion} from "motion/react";
import {reveal} from "../../shared/motion/config";
import {ActivePill} from "../../shared/motion/primitives";
import {createContext,useCallback,useContext,useEffect,useRef,useState,useSyncExternalStore} from "react";
import {isThemePreference,resolveTheme,THEME_KEY,type ThemePreference} from "../theme";
const ThemeContext=createContext<{preference:ThemePreference;setPreference:(p:ThemePreference)=>void}>({preference:"system",setPreference:()=>{}});
const readPreference=()=>{const value=document.documentElement.dataset.themePreference;return isThemePreference(value)?value:"system";};
const subscribePreference=(listener:()=>void)=>{window.addEventListener("terrascope-theme",listener);return()=>window.removeEventListener("terrascope-theme",listener);};
export function ThemeProvider({children}:{children:React.ReactNode}){
 const preference=useSyncExternalStore(subscribePreference,readPreference,()=>"system" as ThemePreference);
 const apply=useCallback((p:ThemePreference)=>{const theme=resolveTheme(p,matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=theme;document.documentElement.dataset.themePreference=p;document.documentElement.style.colorScheme=theme;window.dispatchEvent(new Event("terrascope-theme"));},[]);
 const setPreference=useCallback((p:ThemePreference)=>{apply(p);try{localStorage.setItem(THEME_KEY,p);}catch{}},[apply]);
 useEffect(()=>{const media=matchMedia("(prefers-color-scheme: dark)");const update=()=>{const p=document.documentElement.dataset.themePreference;if(isThemePreference(p))apply(p);};const sync=(event:StorageEvent)=>{if(event.key===THEME_KEY){const p=isThemePreference(event.newValue)?event.newValue:"system";apply(p);}};media.addEventListener("change",update);window.addEventListener("storage",sync);return()=>{media.removeEventListener("change",update);window.removeEventListener("storage",sync);};},[apply]);
 return <ThemeContext.Provider value={{preference,setPreference}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
export function ThemeToggle(){
 const reduced=useReducedMotion();
 const {preference,setPreference}=useTheme();const [open,setOpen]=useState(false);const root=useRef<HTMLDivElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!open)return;const close=(e:PointerEvent)=>{if(e.target instanceof Node&&!root.current?.contains(e.target))setOpen(false);};document.addEventListener("pointerdown",close);return()=>document.removeEventListener("pointerdown",close);},[open]);
 return <div ref={root} className="theme-control" onKeyDown={e=>{if(e.key==="Escape"){setOpen(false);trigger.current?.focus();}}}><button ref={trigger} type="button" className="icon-button theme-trigger" aria-label="Choose colour theme" aria-expanded={open} aria-controls="theme-options" onClick={()=>setOpen(!open)}><AnimatePresence mode="wait" initial={false}><motion.span key={preference} aria-hidden="true" initial={reduced?false:{opacity:0,rotate:-90}} animate={{opacity:1,rotate:0}} exit={{opacity:0,rotate:90}} transition={reveal}>{preference==="dark"?"☾":preference==="light"?"☀":"◐"}</motion.span></AnimatePresence></button>{open&&<div id="theme-options" className="theme-options" role="group" aria-label="Colour theme">{([['light','☀','Light'],['dark','☾','Dark'],['system','◐','System']] as const).map(([value,icon,label])=><button key={value} type="button" aria-pressed={preference===value} onClick={()=>setPreference(value)}><span aria-hidden="true">{icon}</span>{label}<span aria-hidden="true">{preference===value?'✓':''}</span><ActivePill active={preference===value} id="theme-preference"/></button>)}</div>}</div>;
}
