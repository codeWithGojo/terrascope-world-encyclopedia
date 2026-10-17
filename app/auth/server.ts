import {cookies} from 'next/headers';
import {createServerClient} from '@supabase/ssr';
import {authConfigured} from './config';

export async function serverAuth() {
  if(!authConfigured())return null;
  const jar=await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{
    cookies:{getAll:()=>jar.getAll(),setAll:values=>{try{values.forEach(({name,value,options})=>jar.set(name,value,options));}catch{/* RSC cookies are refreshed by proxy.ts. */}}}
  });
}
