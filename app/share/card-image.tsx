import {ImageResponse} from 'next/og';
import {geoOrthographic,geoPath,type GeoPermissibleObjects} from 'd3-geo';
import boundaries from '../../public/data/world-boundaries.json';
import type {AtlasCountry} from '../atlas-data';
import {cardFacts,cardSizes,type CardSize} from './card-data';

export function countryCard(country:AtlasCountry,size:CardSize,watermark=true,hd=true) {
  const design=cardSizes[size],scale=hd?1:0.5;
  const width=Math.round(design.width*scale),height=Math.round(design.height*scale);
  const wide=size==='landscape';
  const projection=geoOrthographic().translate([180,180]).scale(174).rotate([-country.longitude,-country.latitude]);
  const path=geoPath(projection);
  const shapes=boundaries.features.map(feature=>({code:feature.properties.code,path:path(feature as GeoPermissibleObjects)??''}));
  return new ImageResponse(
    <div style={{display:'flex',flexDirection:'column',width:design.width,height:design.height,transform:`scale(${scale})`,transformOrigin:'top left',flexShrink:0,background:'#101a22',color:'#f5f1e8',padding:wide?52:72,fontFamily:'sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:22,color:'#b9c9ca',letterSpacing:4}}><span>THE WORLD, A LITTLE CLOSER.</span><span>{country.code}</span></div>
      <div style={{display:'flex',flex:1,alignItems:'center',justifyContent:'space-between',gap:30}}>
        <div style={{display:'flex',flexDirection:'column',width:wide?'65%':'62%'}}>
          <div style={{display:'flex',fontSize:wide?48:72,marginBottom:12}}>{country.flag}</div>
          <div style={{display:'flex',fontSize:country.name.length>20?52:wide?76:88,fontWeight:700,letterSpacing:-3,lineHeight:1.08}}>{country.name}</div>
          <div style={{display:'flex',fontSize:wide?25:30,color:'#a7d7e6',marginTop:20}}>Capital · {country.capital}</div>
          <div style={{display:'flex',fontSize:wide?22:28,color:'#b9c9ca',marginTop:12}}>Population · {country.populationLabel} ({country.populationYear})</div>
        </div>
        <svg width={wide?270:310} height={wide?270:310} viewBox="0 0 360 360" style={{flexShrink:0}}><circle cx="180" cy="180" r="174" fill="#1d394a" stroke="#4c8ca7" strokeWidth="2"/>{shapes.map(shape=><path key={shape.code} d={shape.path} fill={shape.code===country.code?'#f2ba73':'#526b68'} stroke="#101a22" strokeWidth="0.6"/>)}</svg>
      </div>
      <div style={{display:'flex',flexDirection:wide?'row':'column',gap:wide?24:18,borderTop:'1px solid #42515a',paddingTop:26,fontSize:wide?20:28,lineHeight:1.4}}>{cardFacts(country).map((fact,i)=><div key={fact} style={{display:'flex',gap:14,flex:1}}><span style={{color:'#f2ba73'}}>{`0${i+1}`}</span><span>{fact}</span></div>)}</div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:wide?24:42,fontSize:wide?16:20,color:'#b9c9ca'}}><span>{watermark?'TerraScope · Explore a little further':'A country worth knowing'}</span><span>World Bank / ISO · {country.code}</span></div>
    </div>,{width,height,headers:{'Cache-Control':'public, max-age=3600, s-maxage=86400'}}
  );
}
