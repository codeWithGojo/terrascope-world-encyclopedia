'use client';
import {Skeleton as SharedSkeleton} from '../../shared/motion/primitives';
export function Skeleton({className='',label='Loading content'}:{className?:string;label?:string}){return <SharedSkeleton className={`skeleton ${className}`} label={label}/>;}
