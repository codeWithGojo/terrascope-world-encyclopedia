import {NextResponse} from 'next/server';
import {serverAuth} from '../server';
export async function GET(request:Request) {
  const url=new URL(request.url),code=url.searchParams.get('code'),client=await serverAuth();
  if(code&&client){const {error}=await client.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL(url.searchParams.get('recovery')==='1'?'/account?recovery=1':'/account',url.origin));}
  return NextResponse.redirect(new URL('/account?auth_error=1',url.origin));
}
