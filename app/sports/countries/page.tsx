import {SportsFrame} from "../ToolsShared";
import {CountryRecords} from "../CountryRecords";
import {parisMedals,nationalMilestones,medalSource} from "../catalog";
import {athletes} from "../data";
import {atlasCountries} from "../../atlas-data";
import {pageMetadata} from "../../seo";
export const metadata=pageMetadata("/sports/countries","Country sporting records | TerraScope","National sporting milestones, athlete connections and a Paris 2024 Olympic medal snapshot.");
export default async function RecordsPage({searchParams}:{searchParams:Promise<{country?:string}>}){const q=await searchParams,codes=new Set([...parisMedals.map(m=>m.code),...nationalMilestones.map(m=>m.code),...athletes.flatMap(p=>p.countryCodes)]),countries=atlasCountries.filter(c=>codes.has(c.code)).map(({code,name,slug,flag})=>({code,name,slug,flag})).sort((a,b)=>a.name.localeCompare(b.name));return <SportsFrame path="/sports/countries" title="Sport, country by country." intro="Explore national-team achievements, Olympic medals and the athletes who connect them."><CountryRecords key={q.country} countries={countries} medals={parisMedals} records={nationalMilestones} source={medalSource} people={athletes.map(({id,name,sport,countryCodes,highlight})=>({id,name,sport,countryCodes,highlight}))} initial={countries.some(c=>c.code===q.country)?q.country:""}/></SportsFrame>;}
