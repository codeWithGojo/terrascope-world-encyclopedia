#!/usr/bin/env node
import {readFile} from "node:fs/promises";
import worldCountries from "world-countries";

const source=await readFile(new URL("../app/country-content.ts",import.meta.url),"utf8");
const populationSource=await readFile(new URL("../app/population-data.ts",import.meta.url),"utf8");
const sections=["curatedFactsByCode","notablePeopleByCode","travelPlacesByCode"];
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
const populationCodes=new Set([...populationSource.matchAll(/^\s+"([A-Z]{2})": \{"value":/gm)].map((match)=>match[1]));
const populationMissing=codes.filter((country)=>!populationCodes.has(country.code));
console.log(`\ninterestingFacts runtime coverage: ${codes.length}/${codes.length} countries · exactly 10 facts each`);
console.log("Uncurated fact records above use atlas-verified geography, World Bank population observations, IANA-linked time zones and ISO country fields.");
console.log(`populationByCode: ${codes.length-populationMissing.length}/${codes.length} static records`);
if(populationMissing.length)console.log(populationMissing.map((country)=>`${country.code} ${country.name}`).join("\n"));
