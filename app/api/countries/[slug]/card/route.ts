import {getViewer} from '../../../../auth/viewer';
import {atlasBySlug} from '../../../../atlas-data';
import {countryCard} from '../../../../share/card-image';
import {validCardSize} from '../../../../share/card-data';
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}) {
  const country=atlasBySlug.get((await params).slug);
  if(!country)return Response.json({error:'Country not found'},{status:404});
  const url=new URL(request.url),hd=url.searchParams.get('quality')==='hd';
  if(hd){const {features}=await getViewer();if(!features.hdExport)return Response.json({error:'HD export is a Pro feature.'},{status:403,headers:{'Cache-Control':'private, no-store'}});}
  const response=countryCard(country,validCardSize(url.searchParams.get('size')),!hd,hd);
  if(hd)response.headers.set('Cache-Control','private, no-store');
  return response;
}
