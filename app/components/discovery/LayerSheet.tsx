'use client';
import {Drawer} from '../../../shared/motion/gestures';
export function LayerSheet({children,onClose,open=true}:{children:React.ReactNode;onClose:()=>void;open?:boolean}){return <Drawer open={open} title="A different lens." onClose={onClose}>{children}</Drawer>;}
