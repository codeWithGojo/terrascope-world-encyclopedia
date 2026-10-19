"use client";

import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {CommandPalette} from "./discovery/CommandPalette";
import {ThemeToggle} from "./ThemeProvider";
export function SiteHeader({active}:{active?:string}) {
  const [open,setOpen]=useState(false);
  const header=useRef<HTMLElement>(null);
  const menu=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    if(!open)return;
    const closeOnEscape=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);menu.current?.focus();}};
    const closeOutside=(event:PointerEvent)=>{if(event.target instanceof Node&&!header.current?.contains(event.target))setOpen(false);};
    document.addEventListener('keydown',closeOnEscape);
    document.addEventListener('pointerdown',closeOutside);
    return()=>{document.removeEventListener('keydown',closeOnEscape);document.removeEventListener('pointerdown',closeOutside);};
  },[open]);
  const nav=[{id:"escape",label:"Escape",href:"/escape"},{id:"countries",label:"Countries",href:"/countries"},{id:"trips",label:"Trip planner",href:"/trips"},{id:"football",label:"Football",href:"/football-archive"},{id:"rankings",label:"Rankings",href:"/rankings"},{id:"elections",label:"Elections",href:"/elections"}];
  return <header ref={header} className="site-header inner-header"><Link className="brand" href="/" aria-label="TerraScope home"><span className="brand-mark">T</span><span>TerraScope</span></Link><nav className={`main-nav ${open?"is-open":""}`} id="site-navigation" aria-label="Main navigation">{nav.map((item)=><Link className={active===item.id?"active":""} aria-current={active===item.id?"page":undefined} href={item.href} key={item.href} onClick={()=>setOpen(false)}>{item.label}</Link>)}<details className="nav-more"><summary>More <span aria-hidden="true">⌄</span></summary><div><Link href="/my-travels" aria-current={active==='my-travels'?'page':undefined} onClick={()=>setOpen(false)}>My travels</Link><Link href="/daily" onClick={()=>setOpen(false)}>Guess the Country</Link><Link href="/account" onClick={()=>setOpen(false)}>Your account</Link><Link href="/pro" onClick={()=>setOpen(false)}>TerraScope Pro</Link><Link href="/compare" onClick={()=>setOpen(false)}>Compare countries</Link><Link href="/rankings/iq" onClick={()=>setOpen(false)}>IQ ranking & context</Link><Link href="/football-archive/greats" onClick={()=>setOpen(false)}>All-time football lists</Link><Link href="/method" onClick={()=>setOpen(false)}>Sources & method</Link></div></details></nav><div className="header-tools"><CommandPalette/><ThemeToggle/></div><Link className="nav-action" href="/escape">Take a break <span>↗</span></Link><button ref={menu} className="mobile-menu-toggle" type="button" aria-expanded={open} aria-controls="site-navigation" onClick={()=>setOpen(!open)}>{open?"Close":"Menu"} <span aria-hidden="true">{open?"×":"☰"}</span></button></header>;
}
