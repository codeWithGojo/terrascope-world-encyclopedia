import {atlasByCode,atlasCountries} from "./atlas-data";
import {datedTimelineEvents} from "./government-data";

export type OnThisDayEvent={date:string;label:string;title:string;text:string;country:string;countrySlug:string;flag:string};
export type DailyAtlasFact={country:string;countrySlug:string;flag:string;fact:string;status:"curated"|"atlas-verified"};

export const onThisDayEvents:OnThisDayEvent[]=datedTimelineEvents.flatMap((event)=>{
  const country=atlasByCode.get(event.countryCode);
  return country?[{date:event.date,label:event.label,title:event.title,text:event.text,country:country.name,countrySlug:country.slug,flag:country.flag}]:[];
});

export const dailyAtlasFacts:DailyAtlasFact[]=atlasCountries.flatMap((country)=>country.interestingFacts.map((fact)=>({
  country:country.name,
  countrySlug:country.slug,
  flag:country.flag,
  fact,
  status:country.factsStatus,
})));
