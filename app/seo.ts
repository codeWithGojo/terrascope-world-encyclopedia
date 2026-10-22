import type {Metadata} from 'next';
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://terrascope-world-encyclopedia.vercel.app';
export function pageMetadata(path:string,title:string,description:string,image='/social-preview.jpg'):Metadata {
  return {title,description,alternates:{canonical:path || '/'},openGraph:{type:'website',siteName:'TerraScope',title,description,url:path || '/',images:[{url:image,alt:title,...(image.startsWith("/api/")?{width:600,height:315}:image==="/social-preview.jpg"?{width:1200,height:630}:{})}]},twitter:{card:'summary_large_image',title,description,images:[image]}};
}
