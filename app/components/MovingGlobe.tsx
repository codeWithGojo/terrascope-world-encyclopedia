"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {createSurface} from "./webgl";

const shader=`uniform float rotation;
void main(){
 vec2 p=(uv*2.-1.)*vec2(aspect,1.); float r=length(p);
 if(r>.83){gl_FragColor=vec4(.11,.55,.65,max(0.,(.92-r)*1.3));return;}
 vec3 n=vec3(p/.83,sqrt(max(0.,1.-dot(p,p)/(.83*.83))));
 float lon=atan(n.z,n.x)+rotation; vec2 tex=vec2(fract(lon/6.2831853+.5),asin(n.y)/3.14159265+.5);
 vec3 colour=texture2D(image,tex).rgb; float light=.18+.82*max(0.,dot(n,normalize(vec3(-.6,.5,1.))));
 vec3 air=vec3(.12,.57,.66)*pow(1.-n.z,3.)*.65;
 gl_FragColor=vec4(colour*light+air,1.);
}`;

export function MovingGlobe(){
 const canvas=useRef<HTMLCanvasElement>(null);const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const element=canvas.current;if(!element)return;
  let surface:ReturnType<typeof createSurface>|undefined,frame=0,alive=true,ready=false,visible=true,rotation=.65,last=0;
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  const moving=()=>document.documentElement.dataset.motion!=="off"&&!media.matches&&!document.hidden&&visible;
  const draw=(now:number)=>{frame=0;if(!alive||!ready)return;if(moving()){if(last)rotation+=(Math.min(now-last,60)/1000)*.055;last=now;}else last=0;surface?.draw({rotation});if(moving())frame=requestAnimationFrame(draw);};
  const resume=()=>{if(!frame)frame=requestAnimationFrame(draw);};
  const lost=(event:Event)=>{event.preventDefault();setFailed(true);};
  try{surface=createSurface(element,shader);surface.load("/escape/earth.jpg").then(()=>{ready=true;resume();}).catch(()=>{if(alive)setFailed(true);});}catch{setFailed(true);}
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume();});observer.observe(element);
  const resize=new ResizeObserver(resume);resize.observe(element);
  document.addEventListener("visibilitychange",resume);window.addEventListener("terrascope-motion",resume);media.addEventListener("change",resume);element.addEventListener("webglcontextlost",lost);
  return()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();surface?.dispose();document.removeEventListener("visibilitychange",resume);window.removeEventListener("terrascope-motion",resume);media.removeEventListener("change",resume);element.removeEventListener("webglcontextlost",lost);};
 },[]);
 return <div className="orbit-stage"><div className="orbit-line orbit-line-one"/><div className="orbit-line orbit-line-two"/>{failed?<div className="globe-fallback" role="img" aria-label="Earth, with oceans and continents"/>:<canvas ref={canvas} className="earth-canvas" role="img" aria-label="A slowly rotating three-dimensional Earth. Use the Motion control to pause."/>}<span className="orbit-coordinate">23.5° N · A world of possibilities</span><Link href="/countries" className="orbit-label"><i/>195 countries. One shared home.<span>Explore the atlas ↗</span></Link><span className="earth-credit">Earth imagery: NASA / Blue Marble</span></div>;
}
