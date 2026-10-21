"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {useState} from 'react';
import type {entitlements} from '../../access';

const ExplorePlanet=dynamic(()=>import('./ExplorePlanet').then(module=>module.ExplorePlanet),{
 ssr:false,
 loading:()=> <div className="planet-launch-loading" role="status">Opening your Earth…<span>You can keep browsing while it loads.</span></div>,
});

export function PlanetLaunch({access,initialOpen=false}:{access:ReturnType<typeof entitlements>;initialOpen?:boolean}){
 const [open,setOpen]=useState(initialOpen);
 function close(){
  setOpen(false);
  const url=new URL(location.href);
  ['city','clat','clng','cz','cp','cb','cplace','a','b'].forEach(key=>url.searchParams.delete(key));
  history.replaceState(history.state,'',url);
 }
 return <div className={`planet-launch ${open?'is-open':''}`} id={open?undefined:'explore-the-planet'}>
  {open?<><div className="planet-session-bar"><span>Earth explorer <small>Drag, discover and follow a story</small></span><button type="button" onClick={close}>Close 3D experience <span aria-hidden="true">×</span></button></div><ExplorePlanet access={access}/></>:
   <section className="planet-preview" aria-labelledby="planet-preview-title">
    <div className="planet-preview-copy"><p className="eyebrow"><span/>A different perspective</p><h2 id="planet-preview-title">One planet.<br/>Endless rabbit holes.</h2><p>Fly over Earth, follow a guided tour, or put a country’s history on the map. Open the immersive explorer when you feel like going deeper.</p><div><button className="ts-button" type="button" onClick={()=>setOpen(true)}>Open the 3D Earth <span aria-hidden="true">↗</span></button><Link href="/countries">Browse countries instead →</Link></div><small>NASA Earth imagery · Opens on request</small></div>
    <div className="planet-preview-art" aria-hidden="true"><div className="planet-preview-ring"/><div className="planet-preview-orb"/><span>EARTH / OUR SHARED HOME</span></div>
   </section>}
 </div>;
}
