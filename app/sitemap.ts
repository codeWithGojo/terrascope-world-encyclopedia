import type {MetadataRoute} from 'next';
import {atlasCountries} from './atlas-data';
import {cityGuides} from './country-content';
import {siteOrigin} from './seo';
import {sportsTools,sportsTeams} from './sports/catalog';
export default function sitemap():MetadataRoute.Sitemap {
 const routes=['/space',...['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'].map(n=>`/planets/${n}`),'','/countries','/escape','/trips','/sports','/sports/football','/sports/basketball','/sports/cricket','/sports/tennis','/football-archive','/football-archive/greats','/rankings','/rankings/iq','/rankings/most-visited','/elections','/method'];
 return [...routes,...sportsTools.map(t=>t.href),...sportsTeams.map(t=>`/sports/teams/${t.id}`),...atlasCountries.map(c=>`/countries/${c.slug}`),...cityGuides.map(c=>`/countries/${c.countrySlug}/cities/${c.citySlug}`)].map(path=>({url:siteOrigin+path}));
}
