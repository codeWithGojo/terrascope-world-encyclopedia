"use client";
import {useEffect,useState} from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {LayerSheet} from './discovery/LayerSheet';
import type {GlobeLayer,LayerId} from '../globe-types';
import {formatLayerValue} from '../globe-types';
import type {GlobeCountry} from './discovery/globe-math';
const GlobeCanvas=dynamic(()=>import('./discovery/GlobeCanvas').then(module=>module.GlobeCanvas),{ssr:false,loading:()=> <div className="globe-loading" role="status">Opening your atlas<span>195 places to begin.</span></div>});
const layers:{id:LayerId;label:string;icon:string}[]=[{id:'population',label:'Population',icon:'◌'},{id:'gdp',label:'GDP',icon:'↗'},{id:'perCapita',label:'GDP / person',icon:'◈'},{id:'happiness',label:'Happiness',icon:'☀'},{id:'iq',label:'IQ averages',icon:'◇'},{id:'temperature',label:'Temperature',icon:'°'}];
const EMPTY:string[]=[];
type LayerResult={id:LayerId|'none';retry:number;value:GlobeLayer|null;error:string;locked:boolean};
export function MovingGlobe({markers=EMPTY,compact=false}:{markers?:string[];compact?:boolean}){
 const [countries,setCountries]=useState<GlobeCountry[]>([]),[directoryError,setDirectoryError]=useState('');
 const [selected,setSelected]=useState('NG'),[hovered,setHovered]=useState(''),[layerId,setLayerId]=useState<LayerId|'none'>('none');
 const [retry,setRetry]=useState(0),[sheet,setSheet]=useState(false),[rotating,setRotating]=useState(false);
 const [result,setResult]=useState<LayerResult>({id:'none',retry:0,value:null,error:'',locked:false});
 useEffect(()=>{
  const abort=new AbortController();
  fetch('/data/globe-countries.json',{signal:abort.signal}).then(response=>{if(!response.ok)throw Error('Country directory unavailable.');return response.json() as Promise<GlobeCountry[]>;}).then(directory=>{
   if(abort.signal.aborted)return;
   setCountries(directory);setDirectoryError('');
   try{const code=sessionStorage.getItem('terrascope-fly');if(code&&directory.some(country=>country.code===code)){setSelected(code);sessionStorage.removeItem('terrascope-fly');}}catch{}
  }).catch(error=>{if(!abort.signal.aborted)setDirectoryError(error.message);});
  const fly=(event:Event)=>{const code=(event as CustomEvent<string>).detail;if(code)setSelected(code);};
  window.addEventListener('terrascope-fly',fly);
  return()=>{abort.abort();window.removeEventListener('terrascope-fly',fly);};
 },[retry]);
 useEffect(()=>{
  if(layerId==='none')return;
  const abort=new AbortController();
  fetch(`/api/globe-layers?layer=${layerId}`,{signal:abort.signal}).then(async response=>{
   if(response.status===402)return {locked:true,value:null};
   if(!response.ok)throw Error('This data layer could not load. Try another layer or retry.');
   return {locked:false,value:await response.json() as GlobeLayer};
  }).then(data=>{if(!abort.signal.aborted)setResult({id:layerId,retry,...data,error:''});}).catch(error=>{if(!abort.signal.aborted)setResult({id:layerId,retry,value:null,locked:false,error:error.message});});
  return()=>abort.abort();
 },[layerId,retry]);
 const current=layerId!=='none'&&result.id===layerId&&result.retry===retry;
 const layer=current?result.value:null,locked=current&&result.locked,loading=layerId!=='none'&&!current,error=directoryError||(current?result.error:'');
 const country=countries.find(country=>country.code===(hovered||selected)),chosen=countries.find(country=>country.code===selected),value=country&&layer?.values[country.code];
 function chooseLayer(id:LayerId|'none'){setLayerId(id);setSheet(false);}
 const layerControls=<><button type="button" aria-pressed={layerId==='none'} onClick={()=>chooseLayer('none')}>◎ <span>Explore</span></button>{layers.map(item=><button key={item.id} type="button" aria-pressed={layerId===item.id} onClick={()=>chooseLayer(item.id)}><span aria-hidden="true">{item.icon}</span><span>{item.label}</span></button>)}</>;
 return <div className={`globe-studio ${compact?'globe-compact':''}`} id={compact?undefined:'globe'}>
  <div className="globe-topline"><span><i/> YOUR WORLD, WITHIN REACH</span><span>195 countries</span></div>
  <div className="globe-stage" data-native-motion><GlobeCanvas countries={countries} selected={selected} onSelect={setSelected} onHover={setHovered} layer={layer} markers={markers} autoRotate={rotating}/><span className="globe-orbit-label">A different perspective.</span>{country&&<div className="globe-tooltip" aria-live="polite"><span>{country.flag} {country.name}</span>{layer?<><strong>{value?formatLayerValue(layer,value.value):'No published value'}</strong><small>{value?`${value.year} · ${value.rank?`World rank #${value.rank}`:'World rank unavailable'}`:'Missing observations are left uncoloured.'}</small></>:<><strong>{country.capital}</strong><small>{country.region}</small></>}</div>}<span className="globe-instructions">Drag to turn · Tap to discover</span><button type="button" className="globe-rotate-toggle" aria-pressed={rotating} onClick={()=>setRotating(value=>!value)}>{rotating?'Pause rotation':'Rotate globe'}</button></div>
  <div className="globe-country-controls"><label className="sr-only" htmlFor={compact?'game-globe-country':'globe-country'}>Fly to any country</label><select id={compact?'game-globe-country':'globe-country'} value={selected} onChange={event=>setSelected(event.target.value)}>{countries.length?countries.map(country=><option key={country.code} value={country.code}>{country.flag} {country.name}</option>):<option value="NG">Loading countries…</option>}</select>{chosen&&<Link href={`/countries/${chosen.slug}`} aria-label={`Open ${chosen.name} country page`}>Explore {chosen.name} <span>↗</span></Link>}</div>
  <button type="button" className="layer-sheet-trigger" onClick={()=>setSheet(true)} aria-haspopup="dialog">◫ Data layers <span>{layer?.label??'Explore'} ⌃</span></button><div className="globe-layer-switcher" aria-label="Globe data layers">{layerControls}</div>{sheet&&<LayerSheet onClose={()=>setSheet(false)}>{layerControls}</LayerSheet>}
  {loading&&<div className="globe-layer-note" role="status">Loading the {layers.find(item=>item.id===layerId)?.label.toLowerCase()} lens…</div>}
  {error&&<p className="error-state" role="alert">{error} <button type="button" onClick={()=>setRetry(value=>value+1)}>Try again</button></p>}
  {locked&&<div className="globe-paywall"><b>See the world through another lens.</b><p>This dataset is part of TerraScope Pro.</p><Link className="ts-button" href="/pro">Explore Pro ↗</Link></div>}
  {layer&&!loading&&!locked&&<div className="globe-legend"><div><span>{formatLayerValue(layer,layer.min)}</span><i/><span>{formatLayerValue(layer,layer.max)}</span></div><p><b>{layer.label}</b> · {layer.period} · {layer.coverage}/195 countries <span>□ No data</span></p><details><summary>Source & how it’s measured</summary><p>{layer.measurement}</p><p>{layer.rankNote}</p><a href={layer.sourceUrl} target="_blank" rel="noreferrer">{layer.source} ↗</a>{layer.licenseNote&&<p>Commercial redistribution permission is being reviewed before a paid launch.</p>}</details></div>}
  <p className="globe-source">Reference boundaries: mledoze / World Borders · <a href="/data/world-boundaries.json">Data</a> · <a href="/data/world-boundaries-LICENSE.txt">ODbL</a></p>
 </div>;
}
