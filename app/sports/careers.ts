import { athletes, type Athlete } from "./data";
export type CareerEvent = { year: string; text: string };
export type CareerStat = { label: string; value: string; scope: string };
const e = (year: string, text: string): CareerEvent => ({year,text});
const s = (label: string, value: number | string, scope: string): CareerStat => ({label,value:String(value),scope});
const timelines: Record<string, CareerEvent[]> = {
 "michael-jordan":[e("1991","First NBA championship with Chicago."),e("1996","The Bulls begin their second championship three-peat."),e("1998","Sixth NBA title and sixth Finals MVP award.")],
 "lebron-james":[e("2016","Cleveland championship and NBA Finals MVP."),e("2020","NBA championship with the Los Angeles Lakers."),e("2024","Olympic gold with the United States at Paris.")],
 "kobe-bryant":[e("2008","NBA regular-season MVP."),e("2009","Lakers championship and Finals MVP."),e("2010","Fifth NBA championship; a second Finals MVP award.")],
 "hakeem-olajuwon":[e("1994","Houston championship, NBA MVP and Finals MVP."),e("1995","A second consecutive Houston title and Finals MVP.")],
 "lisa-leslie":[e("2001","WNBA championship with the Los Angeles Sparks."),e("2002","A second consecutive Sparks championship."),e("2008","Fourth Olympic gold medal with the United States.")],
 "lauren-jackson":[e("2003","First WNBA MVP award."),e("2004","WNBA championship with Seattle."),e("2010","Seattle championship, league MVP and Finals MVP.")],
 "sachin-tendulkar":[e("2011","India win the Cricket World Cup."),e("2012","Reaches 100 international centuries."),e("2013","Completes his 200th and final Test.")],
 "don-bradman":[e("1928","Makes his Test debut against England."),e("1948","Finishes his Test career with an average of 99.94 and 6,996 runs.")],
 "viv-richards":[e("1975","World Cup champion with West Indies."),e("1979","138 not out in the World Cup final; a second title.")],
 "brian-lara":[e("1994","Scores 501 not out in first-class cricket."),e("2004","Makes 400 not out against England in a Test innings.")],
 "muttiah-muralitharan":[e("2010","Takes his 800th Test wicket in his final Test.")],
 "mithali-raj":[e("2005","Captains India to an ODI World Cup final."),e("2017","Leads India to another ODI World Cup final."),e("2022","Retires with 7,805 runs in 232 ODIs.")],
 "serena-williams":[e("1999","Wins her first major singles title at the US Open."),e("2003","Wins the Australian Open for the first time."),e("2017","Wins a 23rd major singles title at the Australian Open.")],
 "roger-federer":[e("2003","Wins his first Wimbledon singles title."),e("2009","Completes a career Grand Slam at Roland-Garros."),e("2017","Wins an eighth Wimbledon singles title."),e("2018","Wins a 20th major singles title at the Australian Open.")],
 "rafael-nadal":[e("2005","Wins his first Roland-Garros singles title."),e("2010","Completes a career Grand Slam at the US Open."),e("2022","Wins a 14th Roland-Garros singles title and a 22nd major.")],
 "novak-djokovic":[e("2008","Wins his first Australian Open singles title."),e("2016","Completes a career Grand Slam at Roland-Garros."),e("2024","Wins Olympic singles gold at Paris, completing a career Golden Slam with 24 majors already won.")],
 "steffi-graf":[e("1987","Wins her first major singles title at Roland-Garros."),e("1988","Wins all four major singles titles and Olympic gold in one season."),e("1999","Wins a sixth Roland-Garros singles title.")],
 "naomi-osaka":[e("2018","Wins the US Open singles title."),e("2019","Wins the Australian Open singles title."),e("2020","Wins a second US Open singles title."),e("2021","Wins a second Australian Open singles title.")],
};
const basketball: Record<string,[number,number,number]> = {
 "michael-jordan":[6,5,6],"lebron-james":[4,4,4],"kobe-bryant":[5,1,2],"hakeem-olajuwon":[2,1,2],"lisa-leslie":[2,3,2],"lauren-jackson":[2,3,1],
};
const tennis: Record<string,number> = {"serena-williams":23,"roger-federer":20,"rafael-nadal":22,"novak-djokovic":24,"steffi-graf":22,"naomi-osaka":4};
const cricket: Record<string,CareerStat[]> = {
 "sachin-tendulkar":[s("Test runs","15,921","Completed career"),s("ODI runs","18,426","Completed career"),s("International centuries",100,"Tests and ODIs")],
 "don-bradman":[s("Test runs","6,996","Completed career"),s("Test average","99.94","Completed career"),s("Test centuries",29,"Completed career")],
 "viv-richards":[s("World Cup winner editions",2,"Men's ODI · 1975, 1979"),s("World Cup final innings","138*","1979 · * means not out")],
 "brian-lara":[s("Test runs","11,953","Completed career"),s("Highest Test innings","400*","2004 · * means not out"),s("Highest first-class innings","501*","1994")],
 "muttiah-muralitharan":[s("Test wickets",800,"Completed career"),s("ODI wickets",534,"Completed career")],
 "mithali-raj":[s("ODI runs","7,805","Completed career"),s("ODI appearances",232,"Completed career")],
};
const worldCups: Record<string,number> = {"lionel-messi":1,"cristiano-ronaldo":0,"pele":3,"diego-maradona":1,"bukayo-saka":0,"marta":0};
export function careerTimeline(person: Athlete): CareerEvent[] {
 if(person.sport!=="football")return timelines[person.id] || [];
 return person.milestones.flatMap(text=>{const year=text.match(/(?:19|20)\d{2}/)?.[0];return year?[{year,text}]:[];}).sort((a,b)=>Number(a.year)-Number(b.year));
}
export function careerStats(person: Athlete): CareerStat[] {
 if(person.sport==="basketball"){
  const values=basketball[person.id], league=["lisa-leslie","lauren-jackson"].includes(person.id)?"WNBA":"NBA";
  return values?[s("League championships",values[0],`${league} · through 2024`),s("League MVP awards",values[1],`${league} · through 2024`),s("Finals MVP awards",values[2],`${league} · through 2024`)]:[];
 }
 if(person.sport==="tennis")return [s("Major singles titles",tennis[person.id],person.id==="novak-djokovic"?"At Paris 2024 Olympic victory":person.id==="naomi-osaka"?"Through February 2021":"Completed career")];
 if(person.sport==="cricket")return cricket[person.id]||[];
 return [s("Senior World Cup winner editions",worldCups[person.id]??"—",person.id==="marta"?"Women's FIFA World Cup · through 2023":"Men's FIFA World Cup · through 2022")];
}
const timelineSources: Record<string,{label:string;url:string}[]> = {
 "serena-williams":[{label:"WTA official title record",url:"https://www.wtatennis.com/legends/230234/name/record"}],
 "steffi-graf":[{label:"WTA official title record",url:"https://www.wtatennis.com/legends/70044/steffi-graf/record"}],
 "roger-federer":[{label:"ITF · Federer by the numbers",url:"https://www.itftennis.com/en/news-and-media/articles/roger-federer-by-the-numbers/"},{label:"ITF tournament history",url:"https://www.itftennis.com/media/4609/2021-australian-open-mens-tournament-preview-second-edition.pdf"}],
 "rafael-nadal":[{label:"ITF tournament history",url:"https://www.itftennis.com/media/4609/2021-australian-open-mens-tournament-preview-second-edition.pdf"},{label:"Career Grand Slam history · ESPN",url:"https://www.espn.com.au/tennis/story/_/id/47682446/what-career-grand-slam-tennis-all-winners"}],
 "novak-djokovic":[{label:"ITF tournament history",url:"https://www.itftennis.com/media/4609/2021-australian-open-mens-tournament-preview-second-edition.pdf"},{label:"Career Grand Slam history · ESPN",url:"https://www.espn.com.au/tennis/story/_/id/47682446/what-career-grand-slam-tennis-all-winners"}]
};
export const careerProfiles = athletes.map(person=>({...person,sources:[...person.sources,...(timelineSources[person.id]||[])],timeline:careerTimeline(person),stats:careerStats(person)}));
export function comparisonRows(left: Athlete, right: Athlete) {
 if(left.sport!==right.sport) return [];
 const a=careerStats(left),b=careerStats(right);
 return [...new Set([...a,...b].map(x=>x.label))].map(label=>({label,left:a.find(x=>x.label===label),right:b.find(x=>x.label===label)}));
}
