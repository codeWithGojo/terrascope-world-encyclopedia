'use client';
import {useEffect,useState} from 'react';
import dynamic from 'next/dynamic';
const VR=dynamic(()=>import('./VRScene'),{ssr:false});
export default function VRLaunch(){const [supported,setSupported]=useState(false),[ready,setReady]=useState(false);useEffect(()=>{let alive=true;navigator.xr?.isSessionSupported('immersive-vr').then(ok=>{if(alive)setSupported(ok)}).catch(()=>{});return()=>{alive=false}},[]);if(!supported)return null;return ready?<VR/>:<button onClick={()=>setReady(true)}>Prepare VR</button>}
