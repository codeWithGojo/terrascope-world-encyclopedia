'use client';
import {CountUp as Counter} from '../../../shared/motion/primitives';
export function CountUp({value,digits=0}:{value:number;digits?:number}){return <strong><Counter value={value} digits={digits}/></strong>;}
