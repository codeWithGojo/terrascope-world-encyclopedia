import {readFile} from "node:fs/promises";

const dataset=JSON.parse(await readFile(new URL("../app/government-data.json",import.meta.url),"utf8"));
const reference=JSON.parse(await readFile(new URL("../app/country-reference-data.json",import.meta.url),"utf8"));
const errors=[];
const isUrl=(value)=>typeof value==="string"&&/^https:\/\//.test(value);
const expect=(condition,message)=>{if(!condition)errors.push(message);};

expect(/^\d{4}-\d{2}-\d{2}$/.test(dataset.asOf),"Dataset asOf must be YYYY-MM-DD.");
const profileEntries=Object.entries(dataset.profiles??{});
expect(profileEntries.length===11,`Expected 11 deep national profiles; found ${profileEntries.length}.`);
const referenceEntries=Object.entries(reference.records??{});
expect(referenceEntries.length===195,`Expected 195 complete country reference profiles; found ${referenceEntries.length}.`);
for(const [code,profile] of referenceEntries){
  expect(Boolean(profile.background),`${code}: historical background is missing.`);
  expect(Boolean(profile.governmentType),`${code}: reference government type is missing.`);
  expect(Boolean(profile.climate),`${code}: reference climate is missing.`);
  expect(Boolean(profile.terrain),`${code}: reference terrain is missing.`);
}

for(const [code,profile] of profileEntries){
  const leader=profile.leader??{};
  expect(Boolean(profile.system),`${code}: government system is missing.`);
  expect(Boolean(profile.timelineSource?.label)&&isUrl(profile.timelineSource?.url),`${code}: timeline reference is missing or invalid.`);
  expect(Boolean(leader.name&&leader.role&&leader.bio&&leader.startDate&&leader.term),`${code}: leader core fields are incomplete.`);
  expect(/^\d{4}-\d{2}-\d{2}$/.test(leader.startDate??""),`${code}: leader startDate must be YYYY-MM-DD.`);
  expect((leader.record?.length??0)>=2,`${code}: add at least two policy/institutional record points.`);
  expect((leader.scrutiny?.length??0)>=2,`${code}: add at least two scrutiny/shortcoming points.`);
  expect((profile.succession?.length??0)>=4,`${code}: recent succession needs four entries.`);
  expect((profile.timeline?.length??0)>=6,`${code}: historical timeline needs six milestones.`);
  expect(isUrl(leader.nextElection?.source?.url),`${code}: next-election source URL is missing or invalid.`);
  for(const [group,points] of [["record",leader.record??[]],["scrutiny",leader.scrutiny??[]]]){
    points.forEach((point,index)=>{
      expect(Boolean(point.text),`${code}: ${group} point ${index+1} has no text.`);
      expect(Boolean(point.source?.label)&&isUrl(point.source?.url),`${code}: ${group} point ${index+1} needs a labelled HTTPS source.`);
    });
  }
  (leader.sources??[]).forEach((source,index)=>expect(Boolean(source.label)&&isUrl(source.url),`${code}: biography source ${index+1} is invalid.`));
  (profile.timeline??[]).forEach((event,index)=>expect(/^\d{4}-\d{2}-\d{2}$/.test(event.date??"")&&Boolean(event.label&&event.title&&event.text),`${code}: timeline event ${index+1} is incomplete.`));
}

const nigeria=dataset.regional?.NG;
expect(Boolean(nigeria),"Nigeria regional dataset is missing.");
if(nigeria){
  expect(nigeria.units.length===37,`Nigeria needs 36 states plus FCT; found ${nigeria.units.length} records.`);
  expect(new Set(nigeria.units.map((unit)=>unit.name)).size===37,"Nigeria regional unit names must be unique.");
  expect(nigeria.units.filter((unit)=>unit.office==="Governor").length===36,"Nigeria regional data must contain exactly 36 governors.");
  expect(nigeria.units.filter((unit)=>unit.name==="Federal Capital Territory").length===1,"Nigeria regional data must contain one FCT record.");
  expect(Boolean(nigeria.source?.label)&&isUrl(nigeria.source?.url),"Nigeria regional directory source is invalid.");
  nigeria.units.forEach((unit,index)=>{
    expect(Boolean(unit.name&&unit.office&&unit.leader&&unit.bio),`Nigeria regional record ${index+1} is incomplete.`);
    expect(/^\d{4}-\d{2}-\d{2}$/.test(unit.startDate??""),`${unit.name}: startDate must be YYYY-MM-DD.`);
    expect(isUrl(unit.profileUrl),`${unit.name}: biography URL must use HTTPS.`);
  });
}

if(errors.length){
  console.error(`Government data audit failed with ${errors.length} issue${errors.length===1?"":"s"}:`);
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}

const sourcedClaims=profileEntries.reduce((total,[,profile])=>total+profile.leader.record.length+profile.leader.scrutiny.length,0);
const timelineEvents=profileEntries.reduce((total,[,profile])=>total+profile.timeline.length,0);
console.log(`Government data audit passed: ${referenceEntries.length} complete reference profiles, ${profileEntries.length} deep dossiers, ${sourcedClaims} sourced editorial claims, ${timelineEvents} timeline events and ${nigeria.units.length} Nigeria regional records (edition ${dataset.asOf}).`);
