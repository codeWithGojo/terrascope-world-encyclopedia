import {atlasByCode,atlasCountries} from "./atlas-data";
import {cityGuides,notablePeopleByCode} from "./country-content";
import {governmentByCode,regionalGovernmentByCode} from "./government-data";
import {footballPeople} from "./people/football-people";

export type SearchCategory = "Country"|"City"|"Notable person"|"Football"|"Government"|"History";

export type SearchRecord = {
  id:string;
  category:SearchCategory;
  title:string;
  subtitle:string;
  description:string;
  href:string;
  mark:string;
  keywords:string;
};

const countryRecords:SearchRecord[]=atlasCountries.map((country)=>({
  id:`country-${country.code}`,
  category:"Country",
  title:country.name,
  subtitle:`${country.flag} ${country.capital} · ${country.region}`,
  description:`${country.official}. Population ${country.populationLabel}; ${country.areaLabel}.`,
  href:`/countries/${country.slug}`,
  mark:country.code,
  keywords:[country.name,country.official,country.capital,country.region,country.subregion,country.cca3,...country.languages,...country.currencies].join(" "),
}));

const cityRecords:SearchRecord[]=cityGuides.map((city)=>({
  id:`city-${city.countryCode}-${city.citySlug}`,
  category:"City",
  title:city.name,
  subtitle:`${city.country} · city travel guide`,
  description:city.overview,
  href:`/countries/${city.countrySlug}/cities/${city.citySlug}`,
  mark:"CITY",
  keywords:[city.name,city.country,...city.attractions,...city.food].join(" "),
}));

const notableRecords:SearchRecord[]=Object.entries(notablePeopleByCode).flatMap(([code,people])=>{
  const country=atlasByCode.get(code);
  if(!country)return [];
  return people.map((person)=>({
    id:`notable-${code}-${person.wikipedia}`,
    category:"Notable person" as const,
    title:person.name,
    subtitle:`${person.category} · ${country.name}`,
    description:person.description,
    href:`/countries/${country.slug}#people`,
    mark:code,
    keywords:`${person.name} ${person.category} ${person.description} ${country.name}`,
  }));
});

const footballRecords:SearchRecord[]=footballPeople.map((person)=>({
  id:`football-${person.name}`,
  category:"Football",
  title:person.name,
  subtitle:`${person.flag} ${person.country} · ${person.position} · ${person.era}`,
  description:person.legacy,
  href:`/football-archive?q=${encodeURIComponent(person.name)}`,
  mark:person.initials,
  keywords:[person.name,person.country,person.position,person.era,person.clubs,...person.honours].join(" "),
}));

const governmentRecords:SearchRecord[]=Object.entries(governmentByCode).flatMap(([code,profile])=>{
  const country=atlasByCode.get(code);
  if(!country)return [];
  const current:SearchRecord={
    id:`government-${code}-current`,
    category:"Government",
    title:profile.leader.name,
    subtitle:`${profile.leader.role} · ${country.name}`,
    description:profile.leader.bio,
    href:`/countries/${country.slug}#government`,
    mark:code,
    keywords:`${profile.leader.name} ${profile.leader.role} ${profile.system} ${country.name}`,
  };
  const succession=profile.succession.map((leader,index)=>({
    id:`government-${code}-succession-${index}`,
    category:"Government" as const,
    title:leader.name,
    subtitle:`${leader.office} · ${leader.term} · ${country.name}`,
    description:leader.note,
    href:`/countries/${country.slug}#government`,
    mark:code,
    keywords:`${leader.name} ${leader.office} ${leader.term} ${country.name}`,
  }));
  return [current,...succession];
});

const regionalRecords:SearchRecord[]=Object.entries(regionalGovernmentByCode).flatMap(([code,dataset])=>{
  const country=atlasByCode.get(code);
  if(!country)return [];
  return dataset.units.map((unit,index)=>({
    id:`government-${code}-regional-${index}`,
    category:"Government" as const,
    title:unit.leader,
    subtitle:`${unit.office} · ${unit.name}, ${country.name}`,
    description:unit.bio,
    href:`/countries/${country.slug}/government`,
    mark:code,
    keywords:`${unit.leader} ${unit.office} ${unit.name} ${country.name}`,
  }));
});

const historyRecords:SearchRecord[]=Object.entries(governmentByCode).flatMap(([code,profile])=>{
  const country=atlasByCode.get(code);
  if(!country)return [];
  return profile.timeline.map((event,index)=>({
    id:`history-${code}-${index}`,
    category:"History" as const,
    title:event.title,
    subtitle:`${event.label} · ${country.name}`,
    description:event.text,
    href:`/countries/${country.slug}#timeline`,
    mark:code,
    keywords:`${event.title} ${event.text} ${event.label} ${country.name}`,
  }));
});

export const searchRecords:SearchRecord[]=[...countryRecords,...cityRecords,...notableRecords,...footballRecords,...governmentRecords,...regionalRecords,...historyRecords];

export const searchCounts=searchRecords.reduce<Record<SearchCategory,number>>((counts,record)=>{
  counts[record.category]+=1;
  return counts;
},{Country:0,City:0,"Notable person":0,Football:0,Government:0,History:0});
