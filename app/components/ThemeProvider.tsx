"use client";
import {createContext,useCallback,useContext,useEffect,useRef,useState} from "react";
import {isThemePreference,resolveTheme,THEME_KEY,type ThemePreference} from "../theme";
const ThemeContext=createContext<{preference:ThemePreference;setPreference:(p:ThemePreference)=>void}>({preference:"system",setPreference:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){
 const [preference,setState]=useState<ThemePreference>("system");
 const apply=useCallback((p:ThemePreference)=>{const theme=resolveTheme(p,matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=theme;document.documentElement.dataset.themePreference=p;document.documentElement.style.colorScheme=theme;window.dispatchEvent(new Event("terrascope-theme"));},[]);
 const setPreference=useCallback((p:ThemePreference)=>{setState(p);apply(p);try{localStorage.setItem(THEME_KEY,p);}catch{}},[apply]);
 useEffect(()=>{const initial=document.documentElement.dataset.themePreference;if(isThemePreference(initial))setState(initial);const media=matchMedia("(prefers-color-scheme: dark)");const update=()=>{const p=document.documentElement.dataset.themePreference;if(isThemePreference(p))apply(p);};const sync=(event:StorageEvent)=>{if(event.key===THEME_KEY){const p=isThemePreference(event.newValue)?event.newValue:"system";setState(p);apply(p);}};media.addEventListener("change",update);window.addEventListener("storage",sync);return()=>{media.removeEventListener("change",update);window.removeEventListener("storage",sync);};},[apply]);
 return <ThemeContext.Provider value={{preference,setPreference}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
export function ThemeToggle(){
 const {preference,setPreference}=useTheme();const [open,setOpen]=useState(false);const root=useRef<HTMLDivElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!open)return;const close=(e:PointerEvent)=>{if(e.target instanceof Node&&!root.current?.contains(e.target))setOpen(false);};document.addEventListener("pointerdown",close);return()=>document.removeEventListener("pointerdown",close);},[open]);
 return <div ref={root} className="theme-control" onKeyDown={e=>{if(e.key==="Escape"){setOpen(false);trigger.current?.focus();}}}><button ref={trigger} type="button" className="icon-button theme-trigger" aria-label="Choose colour theme" aria-expanded={open} aria-controls="theme-options" onClick={()=>setOpen(!open)}><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/></svg></button>{open&&<div id="theme-options" className="theme-options" role="group" aria-label="Colour theme">{([['light','☀','Light'],['dark','☾','Dark'],['system','◐','System']] as const).map(([value,icon,label])=><button key={value} type="button" aria-pressed={preference===value} onClick={()=>setPreference(value)}><span aria-hidden="true">{icon}</span>{label}<span aria-hidden="true">{preference===value?'✓':''}</span></button>)}</div>}</div>;
}
