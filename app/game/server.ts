import {geoMercator,geoPath,type GeoPermissibleObjects} from 'd3-geo';
import {atlasCountries} from '../atlas-data';
import {travelPlacesByCode} from '../country-content';
import boundaries from '../../public/data/world-boundaries.json';
import {hashSeed,dailyIndex,utcDay,validateGuesses,distanceAndDirection} from './engine';
export type GameOptions={mode:'daily'|'practice';seed?:string;region?:string;hard?:boolean};
const codes=new Set(atlasCountries.map(country=>country.code));
const regions=['All','Africa','Americas','Asia','Europe','Oceania'];
const ordered=[...atlasCountries].sort((a,b)=>hashSeed('terrascope-v1:'+a.code)-hashSeed('terrascope-v1:'+b.code));
export function parseGameOptions(raw:Record<string,unknown>):GameOptions {
 if(raw.mode!=='practice')return {mode:'daily'};
 if(typeof raw.seed!=='string'||!/^[a-zA-Z0-9-]{16,64}$/.test(raw.seed))throw Error('Start a new practice round.');
 return {mode:'practice',seed:raw.seed,region:typeof raw.region==='string'&&regions.includes(raw.region)?raw.region:'All',hard:raw.hard===true};
}
export function buildGame(guesses:unknown,options:GameOptions={mode:'daily'},day=utcDay()) {
 const picked=validateGuesses(guesses,codes);
 const pool=options.mode==='practice'&&options.region&&options.region!=='All'?ordered.filter(country=>country.region===options.region):ordered;
 const answer=pool[options.mode==='daily'?dailyIndex(day,pool.length):hashSeed(options.seed!+':'+(process.env.TERRASCOPE_GAME_SEED??'practice-v1'))%pool.length];
 const winIndex=picked.indexOf(answer.code);
 if(winIndex>=0&&winIndex!==picked.length-1)throw Error('This round already ended. Start another practice round.');
 const results=picked.map(code=>distanceAndDirection(atlasCountries.find(country=>country.code===code)!,answer));
 const won=winIndex>=0,finished=won||picked.length===6;
 const feature=boundaries.features.find(feature=>feature.properties.code===answer.code)!;
 const projection=geoMercator().fitExtent([[18,18],[482,262]],feature as GeoPermissibleObjects);
 const outline=geoPath(projection)(feature as GeoPermissibleObjects)??'';
 return {day,mode:options.mode,serverNow:Date.now(),resetAt:new Date(Date.parse(day+'T00:00:00Z')+86400000).toISOString(),results,won,finished,
   clues:{outline,flag:!options.hard&&picked.length>=2?answer.flag:null,capital:!options.hard&&picked.length>=3?answer.capital:null,landmark:!options.hard&&picked.length>=4?(travelPlacesByCode[answer.code]?.[0]?.name??`A country in ${answer.subregion}`):null},
   answer:finished?{code:answer.code,name:answer.name,slug:answer.slug,latitude:answer.latitude,longitude:answer.longitude}:null,
 };
}
export type GameState=ReturnType<typeof buildGame>;
