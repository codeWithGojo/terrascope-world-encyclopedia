import worldCountries from "world-countries";
import {getCountry as getTimezoneCountry} from "countries-and-timezones";
import {countries as editorialCountries, type Country} from "./data";
import {curatedFactsByCode} from "./country-content";
import {populationByCode, type PopulationRecord} from "./population-data";

export const atlasRegions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"] as const;
export type AtlasRegion = (typeof atlasRegions)[number];

const editorialByCode = new Map(editorialCountries.map((country) => [country.code, country]));

export function countrySlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatArea(area: number) {
  return area >= 1_000_000
    ? `${(area / 1_000_000).toFixed(2)}M km²`
    : `${Math.round(area).toLocaleString("en-US")} km²`;
}

export type AtlasCountry = {
  code: string;
  cca3: string;
  slug: string;
  name: string;
  official: string;
  flag: string;
  region: Exclude<AtlasRegion, "All">;
  subregion: string;
  capital: string;
  area: number;
  areaLabel: string;
  population: number;
  populationLabel: string;
  populationYear: number;
  populationSource: PopulationRecord["source"];
  populationRank: number;
  areaRank: number;
  density: number;
  currencies: string[];
  currencyCodes: string[];
  languages: string[];
  calling: string;
  tld: string;
  demonym: string;
  landlocked: boolean;
  borders: string[];
  timezones: string[];
  carSide: "left" | "right";
  latitude: number;
  longitude: number;
  mapUrl: string;
  interestingFacts: string[];
  factsStatus: "curated" | "atlas-verified";
  editorial?: Country;
};

const sovereignSet = new Set(["VA", "PS"]);
const sovereignCountries = worldCountries.filter((country) => country.unMember || sovereignSet.has(country.cca2));
const populationRankByCode = new Map([...sovereignCountries].sort((a,b)=>populationByCode[b.cca2].value-populationByCode[a.cca2].value).map((country,index)=>[country.cca2,index+1]));
const areaRankByCode = new Map([...sovereignCountries].sort((a,b)=>b.area-a.area).map((country,index)=>[country.cca2,index+1]));
const leftDrivingCodes = new Set(["AG","AU","BS","BD","BB","BT","BW","BN","CY","DM","SZ","FJ","GD","GY","IN","ID","IE","JM","JP","KE","KI","LS","MW","MY","MV","MT","MU","MZ","NA","NR","NP","NZ","PK","PG","KN","LC","VC","WS","SC","SG","SB","ZA","LK","SR","TZ","TH","TL","TO","TT","TV","UG","GB","ZM","ZW"]);
const currencyOverrides:Record<string,{labels:string[];codes:string[]}>= {
  ZW:{labels:["Zimbabwe Gold (ZiG)","United States dollar ($)"],codes:["ZWG","USD"]},
};

function formatPopulation(population:number){
  if(population>=1_000_000_000)return `${(population/1_000_000_000).toFixed(2)} billion`;
  if(population>=1_000_000)return `${(population/1_000_000).toFixed(1)} million`;
  return population.toLocaleString("en-US");
}

export const atlasCountries: AtlasCountry[] = sovereignCountries
  .map((country) => {
    const editorial = editorialByCode.get(country.cca2);
    const populationRecord = populationByCode[country.cca2];
    const timezoneRecord = getTimezoneCountry(country.cca2);
    const currencyOverride = currencyOverrides[country.cca2];
    const currencyEntries = Object.entries(country.currencies ?? {});
    const callingSuffix = country.idd.suffixes?.[0] ?? "";
    const base = {
      code: country.cca2,
      cca3: country.cca3,
      slug: editorial?.slug ?? countrySlug(country.name.common),
      name: editorial?.name ?? country.name.common,
      official: editorial?.official ?? country.name.official,
      flag: country.flag,
      region: country.region as AtlasCountry["region"],
      subregion: country.subregion || country.region,
      capital: editorial?.capital ?? country.capital?.join(" · ") ?? "No official capital",
      area: country.area,
      areaLabel: editorial?.areaLabel ?? formatArea(country.area),
      population: populationRecord.value,
      populationLabel: formatPopulation(populationRecord.value),
      populationYear: populationRecord.year,
      populationSource: populationRecord.source,
      populationRank: populationRankByCode.get(country.cca2) ?? 195,
      areaRank: areaRankByCode.get(country.cca2) ?? 195,
      density: country.area ? populationRecord.value/country.area : 0,
      currencies: currencyOverride?.labels ?? currencyEntries.map(([, currency]) => `${currency.name}${currency.symbol ? ` (${currency.symbol})` : ""}`),
      currencyCodes: currencyOverride?.codes ?? currencyEntries.map(([code]) => code),
      languages: Object.values(country.languages ?? {}),
      calling: editorial?.calling ?? (`${country.idd.root ?? ""}${callingSuffix}` || "—"),
      tld: country.tld?.join(" · ") || "—",
      demonym: country.demonyms?.eng?.m ?? country.name.common,
      landlocked: country.landlocked,
      borders: country.borders ?? [],
      timezones: timezoneRecord?.timezones ?? [],
      carSide: leftDrivingCodes.has(country.cca2) ? "left" as const : "right" as const,
      latitude: country.latlng?.[0] ?? 0,
      longitude: country.latlng?.[1] ?? 0,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(editorial?.name ?? country.name.common)}`,
      editorial,
    };
    const generatedFacts = [
      `${base.capital} is the capital of ${base.official}.`,
      `With ${base.populationLabel} people in its ${base.populationYear} ${base.populationSource} reference, ${base.name} ranks about #${base.populationRank} by population among TerraScope's 195 sovereign-state profiles.`,
      `${base.name} covers ${base.areaLabel}, placing it about #${base.areaRank} in the world by land area.`,
      `${base.name} sits in ${base.subregion}, ${base.region}, ${base.latitude < 0 ? "south" : "north"} of the equator.`,
      base.landlocked ? `${base.name} is landlocked and shares borders with ${base.borders.length} ${base.borders.length===1?"state":"states"}.` : `${base.name} has a coastline and ${base.borders.length?`shares land borders with ${base.borders.length} ${base.borders.length===1?"state":"states"}`:"has no land borders"}.`,
      `${base.languages.length===1?base.languages[0]:`${base.languages.length} languages`} ${base.languages.length===1?"is":"are"} listed in the national record${base.languages.length>1?`: ${base.languages.slice(0,4).join(", ")}${base.languages.length>4?" and others":""}`:""}.`,
      `${base.currencies.join(" · ")||"An externally administered currency"} is used for everyday transactions.`,
      `Traffic keeps to the ${base.carSide}; the common English demonym is ${base.demonym}.`,
      `${base.timezones.length===1?`The country uses the ${base.timezones[0]} IANA time zone`:`The country spans ${base.timezones.length} IANA time zones, including ${base.timezones.slice(0,3).join(", ")}`}.`,
      `The international calling code is ${base.calling}, while ${base.tld} is the country-code web domain.`,
    ];
    return {
      ...base,
      interestingFacts: curatedFactsByCode[base.code] ?? generatedFacts,
      factsStatus: curatedFactsByCode[base.code] ? "curated" as const : "atlas-verified" as const,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export const atlasBySlug = new Map(atlasCountries.map((country) => [country.slug, country]));
export const atlasByCode = new Map(atlasCountries.map((country) => [country.code, country]));

export function regionCount(region: Exclude<AtlasRegion, "All">) {
  return atlasCountries.filter((country) => country.region === region).length;
}

export const regionColours: Record<Exclude<AtlasRegion, "All">, string> = {
  Africa: "#c96743",
  Americas: "#3f766b",
  Asia: "#c49a53",
  Europe: "#59728d",
  Oceania: "#7a6f94",
};
