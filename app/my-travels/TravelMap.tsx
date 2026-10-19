"use client";
import {useEffect,useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import {geoNaturalEarth1,geoPath} from 'd3-geo';
import type {FeatureCollection} from 'geojson';
import {useTravels} from '../components/planet/useTravels';
import type {Boundary,Country} from '../components/planet/types';
import {renderBoundary} from '../components/geo/render-boundaries';
import {travelStats} from './stats';

function Icon({type}:{type:'plus'|'share'|'download'|'arrow'|'close'}){
 const paths={plus:'M12 5v14M5 12h14',share:'M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7',download:'M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4',arrow:'M5 12h14m-6-6 6 6-6 6',close:'m6 6 12 12M6 18 18 6'};
 return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type]}/></svg>;
}
export function TravelMap(){
 const [countries,setCountries]=useState<Country[]>([]),[features,setFeatures]=useState<Boundary[]>([]),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 const [query,setQuery]=useState(''),[region,setRegion]=useState('All'),[filter,setFilter]=useState<'all'|'visited'>('all'),[notice,setNotice]=useState(''),[hovered,setHovered]=useState(''),[focusCode,setFocusCode]=useState('NG'),[exporting,setExporting]=useState(false);
 const svg=useRef<SVGSVGElement>(null),dialog=useRef<HTMLDialogElement>(null),search=useRef<HTMLInputElement>(null);
 const travels=useTravels(countries),stats=useMemo(()=>travelStats(countries,travels.visited),[countries,travels.visited]),marked=useMemo(()=>new Set(travels.visited),[travels.visited]);
 useEffect(()=>{
  const abort=new AbortController();
  Promise.all([
   fetch('/planet/data/countries.json',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Your country list could not load.');return r.json() as Promise<Country[]>;}),
   fetch('/data/world-boundaries.json',{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Your map could not load.');return r.json() as Promise<FeatureCollection>;})
  ]).then(([directory,borders])=>{if(abort.signal.aborted)return;setCountries(directory);setFeatures(borders.features as Boundary[]);}).catch(e=>{if(e.name!=='AbortError')setError(e.message);});
  return()=>abort.abort();
 },[retry]);
 const paths=useMemo(()=>{
  if(!features.length)return [];
  const displayed=features.map(f=>renderBoundary(f)),collection:FeatureCollection={type:'FeatureCollection',features:displayed};
  const project=geoNaturalEarth1().fitExtent([[12,20],[988,520]],collection),path=geoPath(project);
  return displayed.map(feature=>({code:feature.properties.code,d:path(feature)||''}));
 },[features]);
 const byCode=useMemo(()=>new Map(countries.map(c=>[c.code,c])),[countries]);
 const shown=countries.filter(c=>(region==='All'||region===c.region)&&(filter==='all'||marked.has(c.code))&&c.name.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').includes(query.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'')));
 const hover=byCode.get(hovered);
 function toggle(code:string){const c=byCode.get(code);if(!c)return;travels.toggle(code);setNotice(`${c.name} ${marked.has(code)?'removed from':'added to'} your map.`);}
 function openEditor(){dialog.current?.showModal();search.current?.focus();}
 function moveFocus(code:string,direction:number){const index=countries.findIndex(c=>c.code===code),next=countries[(index+direction+countries.length)%countries.length];if(!next)return;setFocusCode(next.code);svg.current?.querySelector<SVGPathElement>(`[data-code="${next.code}"]`)?.focus();}
 async function exportMap(share=false){
  if(!svg.current||!countries.length)return;setExporting(true);setNotice('Creating your travel map…');
  try{const [{mapImage},{download}]=await Promise.all([import('./export-map'),import('../components/planet/export-utils')]);const blob=await mapImage(svg.current,stats.count,stats.total,stats.regionCount),file=new File([blob],'terrascope-my-travels.png',{type:'image/png'});
   if(share&&navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'My travels · TerraScope'});setNotice('Your travel map is ready.');}
   else{download(blob,file.name);setNotice(share?'Map downloaded. You can share the image from your downloads.':'Your map image has been downloaded.');}
  }catch(e){setNotice((e as Error).name==='AbortError'?'Sharing cancelled.':'Your image could not be created. Your country marks are still saved; please try again.');}finally{setExporting(false);}
 }
 return <div className="travel-content" data-native-motion>
  <div className="travel-heading"><div><p className="travel-eyebrow">YOUR PERSONAL ATLAS</p><h1>My travels<span>.</span></h1><p>Some places change you. Keep them here.</p></div><div className="travel-actions"><button className="travel-icon-button" type="button" aria-label="Share my travel map" onClick={()=>void exportMap(true)} disabled={exporting||!countries.length}><Icon type="share"/></button><button className="travel-primary" type="button" onClick={openEditor} disabled={!countries.length}><Icon type="plus"/> Mark countries</button></div></div>
  <section className="travel-map-section" aria-label="Your visited country map">
   {error?<div className="travel-map-loading" role="alert"><p>{error}</p><button type="button" className="travel-primary" onClick={()=>{setError('');setRetry(v=>v+1);}}>Try again</button></div>:!paths.length?<div className="travel-map-loading" role="status"><div className="travel-map-skeleton"/>Opening your world map…</div>:<>
    <svg ref={svg} className="travel-world-map" viewBox="0 0 1000 540" role="group" aria-label="World map. Activate a country to mark it visited. Use arrow keys to move between countries." onPointerLeave={()=>setHovered('')}>
     {paths.map(({code,d})=><path key={code} d={d} data-code={code} data-visited={marked.has(code)} role="button" tabIndex={focusCode===code?0:-1} aria-label={`${byCode.get(code)?.name||code}${marked.has(code)?', visited. Remove visit':', not visited. Mark visited'}`} aria-pressed={marked.has(code)} onClick={()=>toggle(code)} onPointerEnter={()=>setHovered(code)} onFocus={()=>{setHovered(code);setFocusCode(code);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(code);}else if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();moveFocus(code,e.key==='ArrowRight'||e.key==='ArrowDown'?1:-1);}}}><title>{byCode.get(code)?.name||code}</title></path>)}
    </svg>
    <div className="travel-map-caption"><span>{hover?<><b>{hover.name}</b> · {marked.has(hover.code)?'Visited':'Not visited'}</>:'Tap a country to mark a visit. Use the picker for small islands.'}</span><span className="travel-legend"><i/> Visited <i/> Still to explore</span></div>
   </>}
  </section>
  <div className="travel-status" role="status" aria-live="polite">{notice||(!travels.persistent?'Storage is unavailable. Keep this page open or export your map to keep a copy.':'Saved on this device · Shared with your 3D globe travel marks.')}</div>
  <section className="travel-stats" aria-labelledby="travel-stats-title"><div className="travel-section-heading"><h2 id="travel-stats-title">A little perspective.</h2><span>Every trip adds up.</span></div>
   <div className="travel-stats-grid"><article className="travel-progress"><div><span>YOUR WORLD</span><span>{stats.count} / {stats.total||'195'}</span></div><strong>{stats.percent}<small>%</small></strong><progress value={stats.count} max={stats.total||195} aria-label="Countries visited"/><p>{stats.total||195} countries in TerraScope. Plenty of room for another story.</p></article>
    <article className="travel-stat"><span>Countries visited</span><strong>{stats.count}</strong><small>of {stats.total||195} in the atlas</small></article><article className="travel-stat"><span>Atlas regions explored</span><strong>{stats.regionCount}<small> / {stats.regions.length||5}</small></strong><small>Africa, Americas, Asia, Europe & Oceania</small></article>
    <article className="travel-stat"><span>Still to discover</span><strong>{(stats.total||195)-stats.count}</strong><small>countries waiting for your first visit</small></article><article className="travel-stat travel-stat-place"><span>Most explored region</span><strong>{stats.leaders.length===1?stats.leaders[0]:stats.leaders.length?`${stats.leaders.length} regions tied`:'Your story starts here'}</strong><small>{stats.leaders.length>1?stats.leaders.join(' · '):stats.leaders.length?'Your highest country count':'Mark your first country on the map'}</small></article>
   </div>
   {!!stats.count&&<div className="travel-regions">{stats.regions.map(r=><div key={r.name}><span>{r.name}</span><progress max={r.total} value={r.count} aria-label={`${r.name} countries visited`}/><span>{r.count} / {r.total}</span></div>)}</div>}
  </section>
  <section className="travel-list-section" aria-labelledby="travel-list-title"><div className="travel-section-heading"><h2 id="travel-list-title">Places you’ve been<span> {stats.count.toString().padStart(2,'0')}</span></h2><button type="button" className="travel-text-button" onClick={openEditor} disabled={!countries.length}>Edit your map <Icon type="arrow"/></button></div>
   {stats.count?<div className="travel-visited-list">{stats.visited.map(c=><div key={c.code}><Link href={`/countries/${c.slug}`}><span aria-hidden="true">{c.flag}</span><span>{c.name}<small>{c.region}</small></span><Icon type="arrow"/></Link><button type="button" aria-label={`Remove ${c.name} from visited countries`} onClick={()=>toggle(c.code)}><Icon type="close"/></button></div>)}</div>:<div className="travel-empty"><span aria-hidden="true">↗</span><div><h3>Where did it all begin?</h3><p>Add somewhere you’ve visited. A home country counts, too.</p></div><button type="button" className="travel-primary" onClick={openEditor} disabled={!countries.length}>Add your first country</button></div>}
  </section>
  <div className="travel-bottom-links"><button type="button" className="travel-text-button" onClick={()=>void exportMap()} disabled={exporting||!countries.length}><Icon type="download"/>{exporting?'Creating your image…':'Download your map'}</button><Link href="/#explore-the-planet">Explore the 3D Earth <Icon type="arrow"/></Link></div>
  <p className="travel-source">Travel marks are stored in this browser; they are not synced to an account. Borders: <a href="/data/world-boundaries.json">World Borders</a> · <a href="/data/world-boundaries-LICENSE.txt">ODbL</a>.</p>
  <dialog ref={dialog} className="travel-editor" aria-labelledby="travel-editor-title"><div className="travel-editor-header"><div><p className="travel-eyebrow">YOUR WORLD, ONE COUNTRY AT A TIME</p><h2 id="travel-editor-title">Where have you been?</h2></div><button type="button" className="travel-icon-button" aria-label="Close country picker" onClick={()=>dialog.current?.close()}><Icon type="close"/></button></div><label className="travel-search"><span>Find a country</span><input ref={search} type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search countries…"/></label><div className="travel-editor-filters"><label>Region<select value={region} onChange={e=>setRegion(e.target.value)}><option>All</option>{stats.regions.map(r=><option key={r.name}>{r.name}</option>)}</select></label><div><button type="button" aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>All countries</button><button type="button" aria-pressed={filter==='visited'} onClick={()=>setFilter('visited')}>Visited ({stats.count})</button></div></div><div className="travel-country-picker">{shown.length?shown.map(c=><label key={c.code}><input type="checkbox" checked={marked.has(c.code)} onChange={()=>toggle(c.code)}/><span aria-hidden="true">{c.flag}</span><span>{c.name}<small>{c.region}</small></span></label>):<p>No countries match this search.</p>}</div><div className="travel-editor-footer"><span>{stats.count} countries marked</span><button type="button" className="travel-primary" onClick={()=>dialog.current?.close()}>Done</button></div></dialog>
 </div>;
}
