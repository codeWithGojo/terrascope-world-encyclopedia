"use client";
import {m,useReducedMotion} from "framer-motion";
export function PageTransition({children}:{children:React.ReactNode}){const reduced=useReducedMotion();return <m.div className="page-transition" initial={{opacity:1,y:reduced?0:12}} animate={{opacity:1,y:0}} transition={{type:"spring",stiffness:180,damping:26}}>{children}</m.div>;}
