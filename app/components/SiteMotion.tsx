'use client';
import {useEffect,useSyncExternalStore} from 'react';
import {usePathname} from 'next/navigation';
import {useReducedMotion} from 'motion/react';
import {Cursor,Splash,ToastHost,ScrollChrome} from '../../shared/motion/overlays';
import {useDomMotion} from '../../shared/motion/useDomMotion';
const subscribe=()=>()=>{};
function Experience(){const path=usePathname(),reduced=useReducedMotion();useDomMotion('.atlas-section-head>div,.escape-cover-card,.escape-story-card,.region-cover,.nearby-city,.atlas-map-copy,.reference-paths>a,.dashboard-stats>article,.ranking-row,.country-feature,.heritage-card,.football-person-card,.city-guide-page>section>h2,.profile-content>section>h2',path,1.02,-4);useEffect(()=>{document.documentElement.dataset.motion=reduced?'off':'on';window.dispatchEvent(new Event('terrascope-motion'));},[reduced]);return <><Cursor/><ToastHost/><ScrollChrome/><Splash brand="terra"/></>;}
export function SiteMotion(){const ready=useSyncExternalStore(subscribe,()=>true,()=>false);return ready?<Experience/>:null;}
