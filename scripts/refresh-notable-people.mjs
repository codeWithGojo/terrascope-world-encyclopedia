#!/usr/bin/env node
import {mkdir,writeFile} from "node:fs/promises";
import {resolve} from "node:path";

const args=Object.fromEntries(process.argv.slice(2).map((value,index,array)=>value.startsWith("--")?[value.slice(2),array[index+1]]:null).filter(Boolean));
if(!args.country||!args.code){console.error("Usage: node scripts/refresh-notable-people.mjs --country Q1033 --code NG");process.exit(1);}

const query=`SELECT DISTINCT ?person ?personLabel ?description ?image ?occupationLabel WHERE {
  ?person wdt:P31 wd:Q5; wdt:P27 wd:${args.country}.
  OPTIONAL { ?person wdt:P18 ?image. }
  OPTIONAL { ?person wdt:P106 ?occupation. }
  OPTIONAL { ?person schema:description ?description. FILTER(LANG(?description) = "en") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 100`;
const endpoint=`https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;
const response=await fetch(endpoint,{headers:{Accept:"application/sparql-results+json","User-Agent":"TerraScope data refresh/1.0"}});
if(!response.ok) throw new Error(`Wikidata request failed: ${response.status}`);
const payload=await response.json();
const seen=new Set();
const people=payload.results.bindings.flatMap((row)=>{
  const name=row.personLabel?.value;
  if(!name||seen.has(name)) return [];
  seen.add(name);
  return [{name,description:row.description?.value??"Biography awaiting editorial review",occupation:row.occupationLabel?.value??"Not classified",image:row.image?.value??null,wikidata:row.person.value}];
}).slice(0,15);
const dir=resolve("app/generated");
await mkdir(dir,{recursive:true});
await writeFile(resolve(dir,`notable-${args.code.toLowerCase()}.json`),JSON.stringify({countryQid:args.country,code:args.code.toUpperCase(),refreshedAt:new Date().toISOString(),people},null,2)+"\n");
console.log(`Saved ${people.length} people for ${args.code.toUpperCase()}. Review categories and descriptions before publishing.`);
