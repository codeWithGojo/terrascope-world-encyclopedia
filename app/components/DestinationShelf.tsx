"use client";

import {useState} from "react";
import Link from "next/link";
import {ArrowUpRight} from "./ArrowUpRight";

const places = [
 {name:"Japan",slug:"japan",region:"Asia",image:"/continents/asia.jpg",note:"East Asia",story:"Find a different rhythm.",credit:"Mount Fuji · Sora Sagano / Unsplash"},
 {name:"Egypt",slug:"egypt",region:"Africa",image:"/travel/destinations/egypt-luxor.webp",note:"North Africa",story:"Look a little further back.",credit:"Luxor · Destination guide"},
 {name:"Nigeria",slug:"nigeria",region:"Africa",image:"/travel/destinations/nigeria-abuja.webp",note:"West Africa",story:"Start closer to home.",credit:"Abuja · Destination guide"},
 {name:"Namibia",slug:"namibia",region:"Africa",image:"/continents/africa.jpg",note:"Southern Africa",story:"Room for a new perspective.",credit:"Okonjima · Nadine Marfurt / Unsplash"},
 {name:"Switzerland",slug:"switzerland",region:"Europe",image:"/continents/europe.jpg",note:"Central Europe",story:"Take the mountain route.",credit:"Alpstein · Niklas Tidbury / Unsplash"},
 {name:"Chile",slug:"chile",region:"Americas",image:"/continents/americas.jpg",note:"South America",story:"A different sense of scale.",credit:"Patagonia · Chris Stenger / Unsplash"},
 {name:"Australia",slug:"australia",region:"Oceania",image:"/continents/oceania.jpg",note:"Oceania",story:"Another shade of blue.",credit:"Great Barrier Reef · Joan Li / Unsplash"},
];
const regions = ["Featured", "Africa", "Asia", "Europe", "Americas", "Oceania"];

export function DestinationShelf() {
 const [region, setRegion] = useState("Featured");
 const visible = region === "Featured" ? places.slice(0,4) : places.filter(place => place.region === region);
 return <div className="destination-browser">
  <div className="destination-browser-tools"><div role="group" aria-label="Filter destination stories by region">{regions.map(item => <button type="button" key={item} aria-pressed={region === item} onClick={() => setRegion(item)}>{item}</button>)}</div><p role="status">{visible.length} {visible.length === 1 ? "place" : "places"} to begin</p></div>
  <div className="journal-destination-grid">{visible.map(place => <Link className="journal-destination" href={`/countries/${place.slug}`} key={place.slug}><div className="journal-destination-image"><img src={place.image} alt={place.credit.split(" · ")[0]} width={600} height={750} loading="lazy" decoding="async"/><small>{place.credit}</small><b className="destination-open" aria-hidden="true"><ArrowUpRight/></b></div><div><span>{place.note}</span><h3>{place.name}<ArrowUpRight/></h3><p>{place.story}</p></div></Link>)}</div>
  <div className="destination-browser-bottom"><p>Just a few starting points. The full atlas is yours to explore.</p><Link href={region === "Featured" ? "/countries" : `/countries?region=${region}`}>Browse {region === "Featured" ? "all countries" : region} <ArrowUpRight/></Link></div>
 </div>;
}
