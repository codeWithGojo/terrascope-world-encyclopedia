"use client";
import {motion,AnimatePresence,useReducedMotion} from 'motion/react';
import {reveal,spring} from '../../../shared/motion/config';
import {ActivePill} from '../../../shared/motion/primitives';
import {notify} from '../../../shared/motion/overlays';
import {SwipeCard} from '../../../shared/motion/gestures';
import {useState} from 'react';
import {cardSizes,type CardSize} from '../../share/card-data';

export function ShareCountry({slug,name,pro=false}:{slug:string;name:string;pro?:boolean}) {
  const reduced=useReducedMotion();
  const [size,setSize]=useState<CardSize>('portrait'),[busy,setBusy]=useState(false),[notice,setNotice]=useState('');
  const src=`/api/countries/${slug}/card?size=${size}`;
  async function download(share=false,hd=false) {
    setBusy(true);setNotice('');
    try {
      const response=await fetch(src+(hd?"&quality=hd":""));if(!response.ok)throw Error('The card could not be created. Please try again.');
      const blob=await response.blob(),file=new File([blob],`terrascope-${slug}-${size}.png`,{type:'image/png'});
      if(share&&navigator.canShare?.({files:[file]}))await navigator.share({title:`Explore ${name}`,files:[file]});
      else {
        const url=URL.createObjectURL(blob),link=document.createElement('a');
        link.href=url;link.download=file.name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
        setNotice('Your country card is downloaded.');notify('Country card downloaded.','success');
      }
    } catch(error) {if(!(error instanceof DOMException&&error.name==='AbortError'))setNotice(error instanceof Error?error.message:'Unable to create the card.');}
    finally {setBusy(false);}
  }
  async function copy() {
    const url=new URL(`/countries/${slug}`,location.origin).href;
    try {await navigator.clipboard.writeText(url);setNotice('Country link copied.');notify('Country link copied.','success');}
    catch {setNotice(`Copy this link: ${url}`);}
  }
  return <section id="share-country" className="share-country profile-section"><p className="eyebrow"><span/>Take a little of the world with you</p><h2>A place worth sharing.</h2><p>One country, three formats. Save a card or send it straight to a friend.</p><div className="card-size-controls" aria-label="Country card format">{Object.entries(cardSizes).map(([key,value])=><button key={key} type="button" aria-pressed={size===key} onClick={()=>setSize(key as CardSize)}>{value.label}<ActivePill active={size===key} id="country-card-format"/></button>)}</div><div className="share-card-preview"><SwipeCard onSwipe={direction=>{const sizes=Object.keys(cardSizes) as CardSize[];setSize(sizes[(sizes.indexOf(size)+direction+sizes.length)%sizes.length]);}}><AnimatePresence mode="wait"><motion.img data-motion-owned initial={reduced?false:{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.96}} transition={reveal} key={src} src={src} alt={`${name}: flag, capital, population, three facts and a highlighted globe`} loading="lazy" width={cardSizes[size].width} height={cardSizes[size].height}/></AnimatePresence></SwipeCard></div><div className="share-card-actions"><button type="button" className="ts-button" disabled={busy} onClick={()=>download(false)}>{busy?'Creating card…':'Download PNG ↓'}</button><button type="button" disabled={busy} onClick={()=>download(true)}>Share card ↗</button><button type="button" onClick={copy}>Copy country link</button>{pro?<button type="button" disabled={busy} onClick={()=>download(false,true)}>Download HD · Pro ↓</button>:<a href="/pro" className="pro-pill">HD export · Pro</a>}</div><p role="status" className="share-card-notice">{notice}</p><small>Standard cards carry a small TerraScope watermark. Pro exports are HD and watermark-free. Population labels retain the observation year.</small></section>;
}
