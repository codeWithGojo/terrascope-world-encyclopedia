import economic from './datasets/economic-layers.json';
import happiness from './datasets/happiness-2026.json';
import temperature from './datasets/temperature-1991-2020.json';
import type {GlobeLayer,LayerId,LayerValue} from "./globe-types";
export type {GlobeLayer,LayerId,LayerValue} from "./globe-types";
const labels={population:'Population',gdp:'GDP',perCapita:'GDP per person',happiness:'Happiness',iq:'IQ test averages',temperature:'Average temperature'};
export const layerIds=Object.keys(labels) as LayerId[];
export function getLayer(id:LayerId):GlobeLayer{
 const other=id==='happiness'?happiness:id==='temperature'?temperature:null;
 const data=!other?economic[id as keyof typeof economic]:null;
 const rows:Record<string,{value:number|null;year:number;rank?:number|null}|null>=other?other.byCountry:data!.values;
 const ordered=Object.entries(rows).filter(([,r])=>r?.value!=null).sort((a,b)=>b[1]!.value!-a[1]!.value!);const ranks=new Map(ordered.map(([code,r],i)=>[code,ordered.findIndex(([,a])=>a!.value===r!.value)+1]));
 const values=Object.fromEntries(Object.entries(rows).map(([code,r])=>[code,r?.value==null?null:{value:r.value,year:r.year,rank:id==='temperature'?null:id==='happiness'?r.rank??null:ranks.get(code)??null}]));
 const nums=ordered.map(([,r])=>r!.value!);const years=Array.from(new Set(ordered.map(([,r])=>r!.year))).sort();
 return {id,label:labels[id],unit:id==='population'?'people':id==='gdp'||id==='perCapita'?'US$':id==='temperature'?'°C':id==='happiness'?'0–10 score':'test score',source:other?other.source.name:data!.source,sourceUrl:other?other.source.url:data!.url,period:other?other.period:years.length>1?`${years[0]}–${years.at(-1)} · latest per country`:String(years[0]),measurement:other?other.measurement:data!.measurement,coverage:ordered.length,rankNote:id==='temperature'?'World rank unavailable: only 8 verified observations.':id==='happiness'?'Published WHR rank; the report includes territories outside this atlas.':`Rank among ${ordered.length} atlas countries with a published value; years may differ.`,values,min:Math.min(...nums),max:Math.max(...nums),scale:id==='population'||id==='gdp'||id==='perCapita'?'log':'linear',...(id==='happiness'?{licenseNote:happiness.license.note}:{})};
}
