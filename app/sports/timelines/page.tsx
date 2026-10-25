import {SportsFrame} from "../ToolsShared";
import {CareerTimelines} from "../CareerTools";
import {careerProfiles} from "../careers";
import {sportsPhoto,type SportsPhoto} from "../data";
import {pageMetadata} from "../../seo";
export const metadata=pageMetadata("/sports/timelines","Athlete career timelines | TerraScope","Explore the dated milestones behind 24 sporting careers.");
export default async function TimelinePage({searchParams}:{searchParams:Promise<{athlete?:string}>}){const q=await searchParams,photos=Object.fromEntries(careerProfiles.flatMap(p=>{const photo=sportsPhoto(p.id);return photo?[[p.id,photo]]:[];})) as Record<string,SportsPhoto>;return <SportsFrame path="/sports/timelines" title="The moments that made them." intro="Trace championship years, record innings and defining career chapters."><CareerTimelines key={q.athlete} people={careerProfiles} photos={photos} initial={q.athlete}/></SportsFrame>;}
