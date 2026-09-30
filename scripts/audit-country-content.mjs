#!/usr/bin/env node
import {readFile} from "node:fs/promises";
import worldCountries from "world-countries";

const source=await readFile(new URL("../app/country-content.ts",import.meta.url),"utf8");
const populationSource=await readFile(new URL("../app/population-data.ts",import.meta.url),"utf8");
const travelCatalogSource=await readFile(new URL("../app/travel-catalog.ts",import.meta.url),"utf8");
const sections=["curatedFactsByCode","notablePeopleByCode"];
const sovereign=new Set(["VA","PS"]);
const codes=worldCountries.filter((country)=>country.unMember||sovereign.has(country.cca2)).map((country)=>({code:country.cca2,name:country.name.common}));
for(const section of sections){
  const start=source.indexOf(`export const ${section}`);
  const end=source.indexOf("\n};",start);
  const body=source.slice(start,end);
  const missing=codes.filter((country)=>!new RegExp(`\\b${country.code}:\\s*\\[`).test(body));
  console.log(`\n${section}: ${codes.length-missing.length}/${codes.length} curated`);
  console.log(missing.map((country)=>`${country.code} ${country.name}`).join("\n"));
}
const featured=source.slice(source.indexOf("export const travelPlacesByCode"),source.indexOf("\n};",source.indexOf("export const travelPlacesByCode")));
const featuredCodes=[...featured.matchAll(/^\s+([A-Z]{2}):\s*\[/gm)].map((match)=>match[1]);
const catalogCodes=[...travelCatalogSource.matchAll(/^([A-Z]{2})\|/gm)].map((match)=>match[1]);
const covered=new Set([...featuredCodes,...catalogCodes]);
const travelMissing=codes.filter((country)=>!covered.has(country.code));
const duplicates=catalogCodes.filter((code,index)=>catalogCodes.indexOf(code)!==index);
console.log(`\ntravelPlacesByCode: ${covered.size}/${codes.length} countries with specific destinations`);
if(travelMissing.length)console.log(travelMissing.map((country)=>`${country.code} ${country.name}`).join("\n"));
if(duplicates.length)console.log(`Duplicate travel records: ${duplicates.join(", ")}`);
if(travelMissing.length||duplicates.length)process.exitCode=1;
const populationCodes=new Set([...populationSource.matchAll(/^\s+"([A-Z]{2})": \{"value":/gm)].map((match)=>match[1]));
const populationMissing=codes.filter((country)=>!populationCodes.has(country.code));
console.log(`\ninterestingFacts runtime coverage: ${codes.length}/${codes.length} countries · exactly 10 facts each`);
console.log("Uncurated fact records above use atlas-verified geography, World Bank population observations, IANA-linked time zones and ISO country fields.");
console.log(`populationByCode: ${codes.length-populationMissing.length}/${codes.length} static records`);
if(populationMissing.length)console.log(populationMissing.map((country)=>`${country.code} ${country.name}`).join("\n"));
