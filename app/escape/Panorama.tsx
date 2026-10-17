"use client";
import {useEffect,useRef,useState} from "react";
import {createSurface} from "../components/webgl";
const fragment=`uniform float yaw;uniform float pitch;uniform float fov;
void main(){ vec2 p=(uv*2.-1.)*vec2(aspect,1.)*tan(fov*.5);vec3 d=normalize(vec3(p,-1.));
 d=vec3(d.x,cos(pitch)*d.y-sin(pitch)*d.z,sin(pitch)*d.y+cos(pitch)*d.z);
 d=vec3(cos(yaw)*d.x+sin(yaw)*d.z,d.y,-sin(yaw)*d.x+cos(yaw)*d.z);
 vec2 t=vec2(fract(atan(d.z,d.x)/6.2831853+.5),asin(clamp(d.y,-1.,1.))/3.14159265+.5);
 gl_FragColor=vec4(texture2D(image,t).rgb,1.); }`;
export default function Panorama({src,title,rotate}:{src:string;title:string;rotate:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null),view=useRef({yaw:0,pitch:0,fov:1.4}),paint=useRef<()=>void>(()=>{}),drag=useRef<{x:number;y:number}|null>(null);
 const rotateRef=useRef(rotate);
 const [failed,setFailed]=useState(false),[loading,setLoading]=useState(true);
 useEffect(()=>{const el=canvas.current;if(!el)return;let alive=true,frame=0,last=0,ready=false;let surface:ReturnType<typeof createSurface>|undefined;
  setLoading(true);setFailed(false);view.current={yaw:0,pitch:0,fov:1.4};const media=matchMedia("(prefers-reduced-motion: reduce)");
  const moving=()=>rotateRef.current&&!media.matches&&document.documentElement.dataset.motion!=="off"&&!document.hidden&&!drag.current;
  const draw=(now:number)=>{frame=0;if(!alive||!ready)return;if(moving()){if(last)view.current.yaw+=Math.min(now-last,60)*.000025;last=now;}else last=0;surface?.draw(view.current);if(moving())frame=requestAnimationFrame(draw);};
  const request=()=>{if(!frame)frame=requestAnimationFrame(draw);};paint.current=request;
  const lost=(e:Event)=>{e.preventDefault();setFailed(true);};
  try{surface=createSurface(el,fragment);surface.load(src).then(()=>{if(!alive)return;ready=true;setLoading(false);request();}).catch(()=>{if(alive){setFailed(true);setLoading(false);}});}catch{setFailed(true);setLoading(false);}
  const observer=new ResizeObserver(request);observer.observe(el);window.addEventListener("terrascope-motion",request);document.addEventListener("visibilitychange",request);media.addEventListener("change",request);el.addEventListener("webglcontextlost",lost);
  return()=>{alive=false;cancelAnimationFrame(frame);surface?.dispose();observer.disconnect();window.removeEventListener("terrascope-motion",request);document.removeEventListener("visibilitychange",request);media.removeEventListener("change",request);el.removeEventListener("webglcontextlost",lost);};
 },[src]);
 useEffect(()=>{rotateRef.current=rotate;paint.current();},[rotate]);
 function move(x:number,y:number){view.current.yaw+=x;view.current.pitch=Math.max(-1.3,Math.min(1.3,view.current.pitch+y));paint.current();}
 function zoom(change:number){view.current.fov=Math.max(.55,Math.min(2.1,view.current.fov+change));paint.current();}
 return <div className="panorama-surface">{failed?<><img className="scene-image" src={src} alt={`${title} — wide photograph`}/><p className="viewer-fallback">Showing the wide photograph. Interactive 360° needs WebGL in your browser.</p></>:<canvas ref={canvas} tabIndex={0} className="panorama-canvas" aria-label={`${title}. Drag to look around. Arrow keys turn the view; plus and minus zoom.`} onKeyDown={e=>{if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-","="].includes(e.key)){e.preventDefault();if(e.key==="ArrowLeft")move(.13,0);if(e.key==="ArrowRight")move(-.13,0);if(e.key==="ArrowUp")move(0,.1);if(e.key==="ArrowDown")move(0,-.1);if(e.key==="+"||e.key==="=")zoom(-.12);if(e.key==="-")zoom(.12);}}} onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(!drag.current)return;move((drag.current.x-e.clientX)*.004,(e.clientY-drag.current.y)*.004);drag.current={x:e.clientX,y:e.clientY};}} onPointerUp={()=>{drag.current=null;paint.current();}} onPointerCancel={()=>{drag.current=null;paint.current();}}/>}{loading&&<div className="scene-loading" role="status">Opening your view…</div>}{!failed&&<div className="panorama-controls" aria-label="360 degree view controls"><button type="button" onClick={()=>move(.2,0)} aria-label="Look left">←</button><button type="button" onClick={()=>move(-.2,0)} aria-label="Look right">→</button><button type="button" onClick={()=>zoom(-.15)} aria-label="Zoom in">+</button><button type="button" onClick={()=>zoom(.15)} aria-label="Zoom out">−</button><button type="button" onClick={()=>{view.current={yaw:0,pitch:0,fov:1.4};paint.current();}}>Reset view</button></div>}</div>;
}
