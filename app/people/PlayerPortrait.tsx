import Image from 'next/image';
import photos from './football-photos.json';

export function playerPhoto(name:string){return photos[name as keyof typeof photos];}
export function PlayerPortrait({name,priority=false}:{name:string;priority?:boolean}){
 const photo=playerPhoto(name);
 return photo?<Image className="player-portrait" src={photo.src} alt={`${name} portrait`} width={photo.width} height={photo.height} sizes="(max-width:750px) 90vw, (max-width:1100px) 45vw, 30vw" loading={priority?'eager':'lazy'} unoptimized/>:null;
}
export function PhotoCredit({name}:{name:string}){
 const photo=playerPhoto(name);
 return photo?<p className="player-photo-credit">Photo: <a href={photo.source} target="_blank" rel="noreferrer">{photo.credit}</a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>. Resized for display.</p>:null;
}
