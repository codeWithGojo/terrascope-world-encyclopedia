import type {AtlasCountry} from '../atlas-data';

export const cardSizes = {
  portrait: {width:1080,height:1350,label:'Portrait · 4:5'},
  square: {width:1080,height:1080,label:'Square · 1:1'},
  landscape: {width:1200,height:630,label:'Landscape · 1.9:1'},
} as const;
export type CardSize = keyof typeof cardSizes;
export function validCardSize(value:string|null):CardSize {
  return value==='portrait'||value==='square'||value==='landscape'?value:'landscape';
}
export function cardFacts(country:AtlasCountry) {
  return [
    `${country.areaLabel} of land and water`,
    `In ${country.subregion}, ${country.region}`,
    country.languages.length?`Languages: ${country.languages.slice(0,3).join(', ')}`:`Country domain: ${country.tld}`,
  ];
}
