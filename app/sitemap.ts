import type {MetadataRoute} from 'next';
import {atlasCountries} from './atlas-data';
import {cityGuides} from './country-content';
import {siteOrigin} from './seo';
export default function sitemap():MetadataRoute.Sitemap {
 const routes=['','/countries','/escape','/trips','/football-archive','/football-archive/greats','/rankings','/rankings/iq','/rankings/most-visited','/elections','/method'];
 return [...routes,...atlasCountries.map(c=>`/countries/${c.slug}`),...cityGuides.map(c=>`/countries/${c.countrySlug}/cities/${c.citySlug}`)].map(path=>({url:siteOrigin+path}));
}
