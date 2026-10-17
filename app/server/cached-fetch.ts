type Entry<T>={data:T;storedAt:number};
const memory=new Map<string,Entry<unknown>>(),pending=new Map<string,Promise<unknown>>();
export type CachedResult<T>={data:T;fetchedAt:string;stale:boolean};
export async function cachedFetch<T>(url:string,ttlSeconds:number,parse:(raw:unknown)=>T,fetcher:typeof fetch=fetch):Promise<CachedResult<T>>{
 const now=Date.now(),existing=memory.get(url) as Entry<T>|undefined;
 if(existing&&now-existing.storedAt<ttlSeconds*1000)return {data:existing.data,fetchedAt:new Date(existing.storedAt).toISOString(),stale:false};
 try{let running=pending.get(url) as Promise<Entry<T>>|undefined;if(!running){running=(async()=>{const response=await fetcher(url,{signal:AbortSignal.timeout(6500),next:{revalidate:ttlSeconds}} as RequestInit);if(!response.ok)throw Error(`Provider returned ${response.status}`);const data=parse(await response.json()),entry={data,storedAt:Date.now()};if(memory.size>500)memory.delete(memory.keys().next().value!);memory.set(url,entry);return entry;})();pending.set(url,running);}const entry=await running;return {data:entry.data,fetchedAt:new Date(entry.storedAt).toISOString(),stale:false};}
 catch(error){if(existing&&now-existing.storedAt<24*60*60*1000)return {data:existing.data,fetchedAt:new Date(existing.storedAt).toISOString(),stale:true};throw error;}
 finally{pending.delete(url);}
}
