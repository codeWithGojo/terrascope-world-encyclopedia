import Link from "next/link";
import { atlasCountries } from "../atlas-data";
import { athletes, sportsPhoto, type SportsPhoto, type SportId } from "./data";
import { SportsExplorer } from "./SportsExplorer";

export function AthleteDirectory({ sport, country = "", athlete = "" }: { sport?: SportId; country?: string; athlete?: string }) {
  const people = sport ? athletes.filter(p => p.sport === sport) : athletes;
  const countryCodes = new Set([...people.flatMap(p => p.countryCodes), country]);
  const countries = atlasCountries.filter(c => countryCodes.has(c.code)).map(c => ({ code: c.code, name: c.name, slug: c.slug, flag: c.flag })).sort((a, b) => a.name.localeCompare(b.name));
  const photographs = Object.fromEntries(people.flatMap(p => { const photo = sportsPhoto(p.id); return photo ? [[p.id, photo]] : []; })) as Record<string, SportsPhoto>;
  return <SportsExplorer key={`${sport || "all"}:${country}:${athlete}`} people={people} photographs={photographs} countries={countries} lockedSport={sport} initialCountry={countries.some(c => c.code === country) ? country : ""} initialAthlete={athlete} />;
}
export function CountryConnections({ items }: { items: { code: string; note: string; source?: string }[] }) {
  return <section className="sports-country-section" aria-labelledby="sport-countries"><div className="sports-section-heading"><div><p className="eyebrow">Follow the game around the world</p><h2 id="sport-countries">Country connections.</h2></div><p>A few starting points for exploring national sporting cultures.</p></div><div className="sports-country-grid">{items.map(item => { const country = atlasCountries.find(c => c.code === item.code); return country ? <article key={item.code}><span>{country.flag}</span><h3><Link href={`/countries/${country.slug}`}>{country.name} ↗</Link></h3><p>{item.note}</p>{item.source && <a className="sports-source-link" href={item.source} target="_blank" rel="noreferrer">Read the source ↗</a>}</article> : null; })}</div></section>;
}
export function CoverCredit({ id }: { id: string }) { const photo = sportsPhoto(id); return photo ? <p className="sports-cover-credit">Photo: <a href={photo.source} target="_blank" rel="noreferrer">{photo.author}</a> · {photo.licenseUrl ? <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> : photo.license}. Cropped for display.</p> : null; }
