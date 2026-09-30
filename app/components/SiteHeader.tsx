"use client";

import {useState} from "react";
import Link from "next/link";
export function SiteHeader({active}:{active?:string}) {
  const [open,setOpen]=useState(false);
  const nav=[{id:"countries",label:"Countries",href:"/countries"},{id:"trips",label:"Trip planner",href:"/trips"},{id:"compare",label:"Compare",href:"/compare"},{id:"rankings",label:"Rankings",href:"/rankings"},{id:"iq",label:"IQ Rankings",href:"/rankings/iq"},{id:"football",label:"Football Archive",href:"/football-archive"},{id:"method",label:"Method",href:"/method"}];
  return <header className="site-header inner-header"><Link className="brand" href="/"><span className="brand-mark">T</span><span>TerraScope</span></Link><nav className={`main-nav ${open?"is-open":""}`} id="site-navigation" aria-label="Main navigation">{nav.map((item)=><Link className={active===item.id?"active":""} href={item.href} key={item.href} onClick={()=>setOpen(false)}>{item.label}</Link>)}</nav><Link className="nav-action" href="/countries">Explore atlas <span>↗</span></Link><button className="mobile-menu-toggle" type="button" aria-expanded={open} aria-controls="site-navigation" onClick={()=>setOpen(!open)}>{open?"Close":"Menu"} <span aria-hidden="true">{open?"×":"☰"}</span></button></header>;
}
