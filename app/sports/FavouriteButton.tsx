"use client";
import {useState,useSyncExternalStore} from "react";
import {favouriteSnapshot,serverFavourites,subscribeFavourites,toggleFavourite} from "./favourites-store";
export function FavouriteButton({id,name}:{id:string;name:string}){
 const items=useSyncExternalStore(subscribeFavourites,favouriteSnapshot,serverFavourites),saved=items.includes(id);
 const [error,setError]=useState("");
 return <span className="sp-save-wrap"><button type="button" className={`sp-save ${saved?"is-saved":""}`} aria-label={`${saved?"Remove":"Save"} ${name}${saved?" from":" to"} favourites`} aria-pressed={saved} onClick={()=>setError(toggleFavourite(id)?"":"Could not save. Check browser storage or remove a favourite and retry.")}><span aria-hidden="true">{saved?"★":"☆"}</span> {saved?"Saved":"Save"}</button>{error&&<small role="alert">{error}</small>}</span>;
}
