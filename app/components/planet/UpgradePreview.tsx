"use client";
import type {ProFeature} from '../../access';
const copy:Record<ProFeature,{label:string;title:string;description:string}>={
 compare:{label:'Two perspectives',title:'A closer look, together.',description:'Frame two countries and compare their people, scale and published indicators.'},
 history:{label:'Borders through time',title:'See the world change.',description:'Explore historical snapshots from 1914, 1945 and 1960.'},
 hdExport:{label:'Your world, in detail',title:'Make it a little bigger.',description:'Export your travel map at 2160 × 2700, without the free watermark.'}
};
export function ProPill(){return <span className="p-pro-pill">Pro</span>;}
export function UpgradePreview({feature,onClose}:{feature:ProFeature;onClose:()=>void}){
 const content=copy[feature];
 return <aside className="p-upgrade p-glass" aria-label={`${content.label}: Pro preview`}>
  <div className="p-upgrade-preview" aria-hidden="true"><span>{feature==='history'?'1914 — 1960':feature==='compare'?'Nigeria   ↔   Ghana':'2160 × 2700'}</span><i/><i/><i/></div>
  <div className="p-panel-top"><span className="p-kicker">{content.label}</span><ProPill/><button type="button" onClick={onClose} aria-label="Close Pro preview">×</button></div>
  <h3>{content.title}</h3><p>{content.description}</p>
  <a href="/pro" className="p-button p-primary">Explore TerraScope Pro ↗</a><small>Preview only. Payments are not open yet.</small>
 </aside>;
}
