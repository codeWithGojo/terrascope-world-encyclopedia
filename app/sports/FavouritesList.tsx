"use client";
import {useSyncExternalStore} from "react";
import Link from "next/link";
import {favouriteSnapshot,serverFavourites,subscribeFavourites} from "./favourites-store";
import {FavouriteButton} from "./FavouriteButton";
export type FavouriteEntry={id:string;name:string;kind:string;detail:string;href:string;image?:string};
export function FavouritesList({catalog}:{catalog:FavouriteEntry[]}){
 const ids=useSyncExternalStore(subscribeFavourites,favouriteSnapshot,serverFavourites),items=catalog.filter(e=>ids.includes(e.id));
 return <><p className="sp-small">Saved in this browser on this device. Favourites do not sync to your account or other devices. Clearing browser storage removes them.</p><p className="sp-favourite-count" role="status">{items.length} saved {items.length===1?"profile":"profiles"}</p>{items.length?<div className="sp-favourite-list">{items.map(e=><article key={e.id}>{e.image?<img src={e.image} alt="" width="76" height="84"/>:<span className="sp-favourite-initial" aria-hidden="true">{e.name.slice(0,2).toUpperCase()}</span>}<div><p className="sp-kicker">{e.kind}</p><h2><Link href={e.href}>{e.name} ↗</Link></h2><p>{e.detail}</p></div><FavouriteButton id={e.id} name={e.name}/></article>)}</div>:<div className="sp-message"><h2>Your sporting world starts here.</h2><p>Save an athlete or team with the star button. Return here to find their profile again.</p><div className="sp-inline-links"><Link href="/sports#athletes">Meet the athletes ↗</Link><Link href="/sports/teams">Explore teams ↗</Link><Link href="/sports/esports">Explore esports ↗</Link></div></div>}</>;
}
