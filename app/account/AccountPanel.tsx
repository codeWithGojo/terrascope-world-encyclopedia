"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {browserAuth} from '../auth/client';

export function AccountPanel({configured,email,pro}:{configured:boolean;email:string|null;pro:boolean}) {
  const [mode,setMode]=useState<'signin'|'signup'|'reset'|'password'>('signin'),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{const query=new URLSearchParams(location.search);if(query.get('recovery')==='1')setMode('password');if(query.has('auth_error'))setNotice('That sign-in link could not be verified. Please request a new one.');},[]);
  if(!configured)return <div className="account-card"><h2>Accounts are being prepared.</h2><p>The atlas, daily game and free cards are ready to explore. Sign-in will open once the account service is connected.</p><Link className="ts-button" href="/daily">Play today’s country →</Link></div>;
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setNotice('');
    const fields=new FormData(event.currentTarget),address=String(fields.get('email')??''),password=String(fields.get('password')??'');
    try {
      const client=browserAuth();
      if(mode==='reset'){const {error}=await client.auth.resetPasswordForEmail(address,{redirectTo:new URL('/auth/callback?recovery=1',location.origin).href});if(error)throw error;setNotice('If an account exists for that address, a reset link is on its way.');}
      else if(mode==='password'){const {error}=await client.auth.updateUser({password});if(error)throw error;setNotice('Password updated.');setMode('signin');location.assign('/account');}
      else if(mode==='signup'){const {data,error}=await client.auth.signUp({email:address,password,options:{emailRedirectTo:new URL('/auth/callback',location.origin).href}});if(error)throw error;if(data.session)location.assign('/account');else setNotice('Check your email to confirm your account, then return here to sign in.');}
      else {const {error}=await client.auth.signInWithPassword({email:address,password});if(error)throw error;location.assign('/account');}
    }catch(error){setNotice(error instanceof Error?error.message:'Sign-in is temporarily unavailable.');}finally{setBusy(false);}
  }
  async function signOut(){setBusy(true);try{const {error}=await browserAuth().auth.signOut();if(error)throw error;location.assign('/account');}catch{setNotice('Could not sign out. Please try again.');setBusy(false);}}
  if(email&&mode!=='password')return <div className="account-card"><span className="pro-pill">{pro?'Pro':'Free explorer'}</span><h2>Welcome back.</h2><p>{email}</p><p>{pro?'Compare countries, explore history sliders and export HD country cards.':'Explore the atlas, every data layer, free cards and the daily game.'}</p><div className="share-card-actions"><Link className="ts-button" href="/daily">Today’s country →</Link><Link href="/pro">Your access</Link><button type="button" disabled={busy} onClick={signOut}>Sign out</button></div><p role="status">{notice}</p></div>;
  return <div className="account-card"><h2>{mode==='signup'?'A world to come back to.':mode==='reset'?'Reset your password.':mode==='password'?'Choose a new password.':'Good to see you.'}</h2><form onSubmit={submit}>{mode!=='password'&&<label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>}{mode!=='reset'&&<label>Password<input name="password" type="password" autoComplete={mode==='signin'?'current-password':'new-password'} required minLength={8} maxLength={128}/></label>}<button type="submit" className="ts-button" disabled={busy}>{busy?'One moment…':mode==='signup'?'Create account':mode==='reset'?'Send reset link':mode==='password'?'Update password':'Sign in'}</button></form><p role="status">{notice}</p>{mode!=='password'&&<div className="account-switch"><button onClick={()=>{setMode(mode==='signup'?'signin':'signup');setNotice('');}} type="button">{mode==='signup'?'Already have an account? Sign in':'Create an account'}</button><button onClick={()=>{setMode(mode==='reset'?'signin':'reset');setNotice('');}} type="button">{mode==='reset'?'Back to sign in':'Forgot password?'}</button></div>}</div>;
}
