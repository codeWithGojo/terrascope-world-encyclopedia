import {SportsFrame} from "../ToolsShared";
import {CompareAthletes} from "../CareerTools";
import {careerProfiles} from "../careers";
import {sportsPhoto,type SportsPhoto} from "../data";
import {pageMetadata} from "../../seo";
export const metadata=pageMetadata("/sports/compare","Compare athletes | TerraScope","Compare sourced career achievements and statistics within the same sport.");
export default async function ComparePage({searchParams}:{searchParams:Promise<{left?:string;right?:string}>}){const q=await searchParams,photos=Object.fromEntries(careerProfiles.flatMap(p=>{const photo=sportsPhoto(p.id);return photo?[[p.id,photo]]:[];})) as Record<string,SportsPhoto>;return <SportsFrame path="/sports/compare" title="Two careers. Side by side." intro="Pick a sport and two athletes. Read the milestones, compare the numbers and follow the sources."><CompareAthletes key={`${q.left}:${q.right}`} people={careerProfiles} photos={photos} initialLeft={q.left} initialRight={q.right}/></SportsFrame>;}
