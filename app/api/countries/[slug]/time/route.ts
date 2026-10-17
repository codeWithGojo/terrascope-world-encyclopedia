import {atlasBySlug} from '../../../../atlas-data';
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}) {
  const country=atlasBySlug.get((await params).slug);
  if(!country)return Response.json({error:'Country not found'},{status:404});
  return Response.json({serverNow:Date.now(),timezones:country.timezones},{headers:{'Cache-Control':'public, s-maxage=30, max-age=0'}});
}
