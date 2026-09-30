import type {Metadata} from "next";
import {atlasCountries} from "../atlas-data";
import {SiteHeader} from "../components/SiteHeader";
import {SiteFooter} from "../components/SiteFooter";
import {TripPlanner} from "./TripPlanner";
import {cityGuides,cityGuideExtrasByPath,travelPlacesByCode} from "../country-content";
export const metadata:Metadata={title:"Trip planner | TerraScope",description:"Explore activities, plan your budget and save a day-by-day itinerary."};
export default async function TripsPage({searchParams}:{searchParams:Promise<{destination?:string;city?:string}>}){
  const params=await searchParams;
  const destinations=atlasCountries.map(c=>c.name).sort();
  const detailed=cityGuides.map(g=>{const extra=cityGuideExtrasByPath[g.countrySlug+"/"+g.citySlug];return {country:atlasCountries.find(c=>c.code===g.countryCode)?.name||g.country,name:g.name,slug:g.countrySlug+"/cities/"+g.citySlug,attractions:g.attractions,food:g.food,neighbourhoods:extra?.neighbourhoods||[],dayTrips:extra?.dayTrips||[],transport:g.gettingAround,safety:g.safety,coverage:"Detailed city guide"};});
  const starters=atlasCountries.flatMap(country=>(travelPlacesByCode[country.code]||[]).filter(place=>place.kind==="City"&&!detailed.some(g=>g.country===country.name&&g.name===place.name)).map(place=>({country:country.name,name:place.name,slug:country.slug,coverage:"Country guide + outing ideas",attractions:[],food:[],neighbourhoods:[],dayTrips:[],transport:"Confirm transport for each stop. Country landmarks may be far from this city; include only those reachable in your dates.",safety:"Check current official travel advice, local access and entry requirements before arranging an outing. This is a country-level planning starter, not a verified city itinerary."})));
  const guides=[...detailed,...starters];
  return <main><SiteHeader active="trips"/><TripPlanner destinations={destinations} guides={guides} destination={params.destination||""} city={params.city||""}/><SiteFooter/></main>;
}
