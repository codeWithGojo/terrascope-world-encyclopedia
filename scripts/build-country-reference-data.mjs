#!/usr/bin/env node
import {readFile,readdir,writeFile} from "node:fs/promises";
import path from "node:path";
import worldCountries from "world-countries";

const factbookRoot=process.env.FACTBOOK_JSON_DIR;
const mappingPath=process.env.FACTBOOK_FIPS_MAP;
if(!factbookRoot||!mappingPath){console.error("Set FACTBOOK_JSON_DIR and FACTBOOK_FIPS_MAP.");process.exit(1);}
const clean=(value="")=>String(value).replace(/<br\s*\/?\s*>/gi," ").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g," ").trim();
const text=(value)=>clean(value?.text??value?.name?.text??"");
const mapping=JSON.parse(await readFile(mappingPath,"utf8"));
const fipsByIso=new Map();
for(const item of mapping){const iso=item.ISO?.split("|")[0]?.trim();if(iso&&iso!=="-"&&!fipsByIso.has(iso))fipsByIso.set(iso,item.FIPS.toLowerCase());}
const files=new Map();
for(const region of await readdir(factbookRoot,{withFileTypes:true})){if(!region.isDirectory())continue;const regionPath=path.join(factbookRoot,region.name);for(const file of await readdir(regionPath))if(file.endsWith(".json"))files.set(file.slice(0,-5),path.join(regionPath,file));}
const sovereign=new Set(["VA","PS"]);
const countries=worldCountries.filter((country)=>country.unMember||sovereign.has(country.cca2));
const records={};const missing=[];
for(const country of countries){let fips=fipsByIso.get(country.cca2);if(country.cca2==="PS")fips="we";const filename=fips&&files.get(fips);if(!filename){missing.push(`${country.cca2} ${country.name.common}`);continue;}const source=JSON.parse(await readFile(filename,"utf8"));const government=source.Government??{};const geography=source.Geography??{};const executive=government["Executive branch"]??{};const constitution=government.Constitution??{};records[country.cca2]={background:text(source.Introduction?.Background),governmentType:text(government["Government type"]),chiefOfState:text(executive["chief of state"]),headOfGovernment:text(executive["head of government"]),executiveSelection:text(executive["election/appointment process"]),independence:text(government.Independence),constitution:text(constitution.history??constitution),nationalHoliday:text(government["National holiday"]),climate:text(geography.Climate),terrain:text(geography.Terrain),hazards:text(geography["Natural hazards"]),populationDistribution:text(geography["Population distribution"]),geographyNote:text(geography["Geography - note"])};}
if(records.PS&&!records.PS.governmentType)records.PS.governmentType="Palestinian Authority institutions operate under interim self-government arrangements; status and jurisdiction remain contested";
if(missing.length){console.error(missing.join("\n"));process.exit(1);}
const output={edition:"2025 final edition",asOf:"2025-12-31",source:{label:"CIA World Factbook · 2025 archive",url:"https://www.cia.gov/the-world-factbook/about/archives/2025/"},records};
await writeFile(new URL("../app/country-reference-data.json",import.meta.url),`${JSON.stringify(output,null,2)}\n`);
console.log(`Wrote ${Object.keys(records).length} sovereign reference profiles.`);
