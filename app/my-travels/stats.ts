export type TravelCountry={code:string;name:string;slug:string;flag:string;region:string};
export function travelStats(countries:TravelCountry[],codes:string[]){
 const marked=new Set(codes),visited=countries.filter(c=>marked.has(c.code));
 const regions=[...new Set(countries.map(c=>c.region))].sort();
 const counts=regions.map(name=>({name,count:visited.filter(c=>c.region===name).length,total:countries.filter(c=>c.region===name).length}));
 const max=Math.max(0,...counts.map(c=>c.count));
 return {visited,count:visited.length,total:countries.length,percent:countries.length?Math.round(visited.length/countries.length*100):0,regions:counts,regionCount:counts.filter(r=>r.count>0).length,leaders:max?counts.filter(r=>r.count===max).map(r=>r.name):[]};
}
