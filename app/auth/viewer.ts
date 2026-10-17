import {cache} from 'react';
import {serverAuth} from './server';
import {entitlements} from '../access';
export const getViewer=cache(async()=>{
  const supabase=await serverAuth();
  if(!supabase)return {user:null,features:entitlements(null)};
  let user=null;
  try {const {data,error}=await supabase.auth.getUser();user=error?null:data.user;}catch{}
  return {user,features:entitlements(user)};
});
