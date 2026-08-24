import Link from "next/link";
import {notFound} from "next/navigation";
import {atlasBySlug, atlasCountries, regionColours, type AtlasCountry} from "../../atlas-data";
import {footballProfiles, nigeriaFieldNotes, notableRoles, type FootballProfile} from "../../editorial-data";
import {cityGuides,notablePeopleByCode,travelPlacesByCode} from "../../country-content";
import {iqByCode} from "../../iq-data";
import {governmentByCode} from "../../government-data";
import {NotablePeopleGrid} from "../../components/NotablePeopleGrid";
import {GovernmentSection,HistoricalTimeline} from "../../components/GovernmentSection";
import {SiteHeader} from "../../components/SiteHeader";
import {SiteFooter} from "../../components/SiteFooter";

export function generateStaticParams() { return atlasCountries.map((country) => ({slug: country.slug})); }

const confederations: Record<AtlasCountry["region"], string> = {Africa:"CAF",Americas:"CONCACAF / CONMEBOL",Asia:"AFC",Europe:"UEFA",Oceania:"OFC"};

function fallbackFootball(country: AtlasCountry): FootballProfile {
  return {
    team: `${country.name} national football teams`,
    confederation: confederations[country.region],
    badge: country.code,
    worldCup: "Senior World Cup record tracked by the national association",
    continental: `${confederations[country.region]} competition record`,
    achievements:["Senior national-team competition record","Women’s national-team programme","Youth and Olympic football pathway","Domestic league and cup heritage"],
    current:[{name:"Senior national teams",note:"Current squads and qualification cycle"},{name:"Women’s programme",note:"Active national-team pathway"},{name:"Next generation",note:"Youth and Olympic-age prospects"}],
    legends:[{name:"Historic internationals",note:"Record caps, goals and landmark tournaments"},{name:"Pioneering coaches",note:"The tactical history of the national side"},{name:"Club heritage",note:"Domestic teams that shaped the game"}],
  };
}

function generatedNotes(country: AtlasCountry) {
  const editorial = country.editorial;
  return [
    {title:"The state in one line",text:`${country.official} is a ${country.landlocked ? "landlocked " : ""}sovereign country in ${country.subregion}, ${country.region}. Its capital is ${country.capital}.`},
    {title:"A sense of scale",text:`The country covers ${country.areaLabel}, ranking #${country.areaRank} by land area in TerraScope’s 195-country index. Its atlas population is ${country.populationLabel}, with a density of about ${Math.round(country.density)} people per km².`},
    {title:"Language and identity",text:`The structured language register lists ${country.languages.length ? country.languages.join(", ") : "locally recognised languages"}. The common English demonym is ${country.demonym}.`},
    {title:country.landlocked ? "A country without a coastline" : "Connected to the wider world",text:country.landlocked ? `${country.name} has no ocean coastline and connects overland to ${country.borders.length} neighbouring states.` : `${country.name} has maritime access and ${country.borders.length ? `shares land borders with ${country.borders.length} neighbours` : "has no land borders"}.`},
    {title:"Money and connection",text:`The currency register lists ${country.currencies.join(" · ") || "a shared or externally administered currency"}. The international calling prefix is ${country.calling}, while ${country.tld} is used for country-code web domains.`},
    {title:editorial ? "Cities and landmarks" : "A profile designed to grow",text:editorial ? `Major urban centres include ${editorial.cities.join(", ")}. Featured landmarks include ${editorial.landmarks.join(", ")}.` : "This core geographic record is linked to the same atlas structure used by the extended editorial profiles, rankings and continent filters."},
  ];
}

function travelWindow(country:AtlasCountry){
  if(Math.abs(country.latitude)<15)return "Warm conditions are common through much of the year. Compare local wet and dry seasons before fixing dates.";
  if(country.latitude<0)return "March–May and September–November are useful shoulder-season starting points; climate still varies sharply by region and altitude.";
  return "April–June and September–October are useful shoulder-season starting points; check local climate, altitude and festival dates before booking.";
}

export default async function CountryPage({params}:{params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const country = atlasBySlug.get(slug);
  if (!country) notFound();
  const editorial = country.editorial;
  const governmentProfile = governmentByCode[country.code];
  const dataQuality = editorial&&governmentProfile?"full":governmentProfile?"core-plus":"core";
  const colour = editorial?.color ?? regionColours[country.region];
  const football = footballProfiles[country.code] ?? fallbackFootball(country);
  const iq = iqByCode.get(country.code);
  const notablePeople = notablePeopleByCode[country.code] ?? [];
  const travelPlaces = travelPlacesByCode[country.code] ?? [];
  const displayedTravelPlaces = travelPlaces.length?travelPlaces:[{name:country.capital,kind:"City" as const,note:`The national capital is the most reliable starting point in TerraScope's current ${country.name} travel record.`}];
  const guides = cityGuides.filter((guide) => guide.countryCode === country.code);
  const notes = country.code === "NG" ? nigeriaFieldNotes : generatedNotes(country);
  const summary = editorial?.summary ?? `${country.name} is a sovereign state in ${country.subregion}. This profile connects its political geography, language, currency, borders and national football record to TerraScope’s complete world index.`;
  const essentialFacts = editorial ? [
    ["Official name", country.official],["Capital", country.capital],["Population", `${country.populationLabel} · ${country.populationSource} ${country.populationYear}`],["Population rank", `#${country.populationRank} of 195`],["Land area", country.areaLabel],["Area rank", `#${country.areaRank} of 195`],["Currency", editorial.currency],["Languages", editorial.languages.join(" · ")],["Calling code", editorial.calling],["Time zone", editorial.timezone],["Driving side", country.carSide],["Population density", editorial.density],["Life expectancy", editorial.lifeExpectancy],["Internet access", editorial.internet],["Nominal GDP", editorial.gdp],["Independence / formation", editorial.independence],["Subregion", country.subregion],["Land borders", String(country.borders.length)],
  ] : [
    ["Official name", country.official],["Capital", country.capital],["Population", `${country.populationLabel} · ${country.populationSource} ${country.populationYear}`],["Population rank", `#${country.populationRank} of 195`],["Population density", `${Math.round(country.density)} people / km²`],["Continent", country.region],["Subregion", country.subregion],["Land area", country.areaLabel],["Area rank", `#${country.areaRank} of 195`],["Landlocked", country.landlocked ? "Yes" : "No"],["Languages", country.languages.join(" · ") || "—"],["Currencies", country.currencies.join(" · ") || "—"],["Time zones", country.timezones.join(" · ") || "—"],["Driving side", country.carSide],["Calling code", country.calling],["Country domain", country.tld],["Demonym", country.demonym],["Land borders", String(country.borders.length)],
  ];

  return <main>
    <SiteHeader active="countries"/>
    <section className="profile-hero" style={{"--country": colour} as React.CSSProperties}>
      <div className="profile-breadcrumb"><Link href="/countries">195 countries</Link><span>→</span><Link href={`/countries?region=${country.region}`}>{country.region}</Link><span>→</span><b>{country.name}</b></div>
      <div className="profile-title"><div><p>{country.official}</p><h1>{country.name}</h1><span>{country.subregion} · {country.code} / {country.cca3}</span><span className={`data-quality data-quality--${dataQuality}`}>{dataQuality==="full"?"Full editorial + government profile":dataQuality==="core-plus"?"Core + government profile":"Core geographic record"}</span></div><div className="profile-flag">{country.flag}</div></div>
      <p className="profile-summary">{summary}</p>
      <div className="profile-quick"><div><small>Capital</small><b>{country.capital}</b></div><div><small>Population</small><b>{country.populationLabel}</b></div><div><small>Land area</small><b>{country.areaLabel}</b></div><div><small>Football confederation</small><b>{football.confederation}</b></div><div className="iq-quick-card"><small>Reported IQ rank</small>{iq?<b>#{iq.rank} · {iq.score.toFixed(2)}</b>:<b>Data pending</b>}<Link href="/rankings/iq">Open full ranking ↗</Link></div></div>
    </section>

    <section className="profile-body">
      <aside><b>On this page</b><a href="#overview">Essential facts</a><a href="#story">Country in depth</a><a href="#interesting-facts">10 interesting facts</a><a href="#government">Government record</a><a href="#timeline">Historical timeline</a><a href="#places">Travel file</a><a href="#football">Football dossier</a><a href="#people">Notable people</a><Link href="/rankings">Open world rankings ↗</Link></aside>
      <div className="profile-content">
        <section id="overview"><p className="eyebrow"><span/>National record · {country.code}</p><h2>Essential<br/><em>facts.</em></h2><div className="fact-table expanded-facts">{essentialFacts.map(([key, value]) => <div key={key}><span>{key}</span><b>{value}</b></div>)}</div>{editorial && <blockquote><small>Field fact</small>{editorial.fact}</blockquote>}</section>

        <section id="story" className="profile-section country-story"><p className="eyebrow"><span/>Beyond the quick facts</p><h2>{country.name}<br/><em>in depth.</em></h2><div className="story-grid">{notes.map((note, index) => <article key={note.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{note.title}</h3><p>{note.text}</p></article>)}</div></section>

        <section id="interesting-facts" className="profile-section interesting-facts-section"><p className="eyebrow"><span/>History · culture · geography</p><div className="section-title-row"><h2>10 interesting<br/><em>facts.</em></h2><span className={`content-status ${country.factsStatus}`}>{country.factsStatus === "curated" ? "Editorially curated" : "Atlas-verified core facts"}</span></div><ol>{country.interestingFacts.slice(0,10).map((fact,index)=><li key={fact}><span>{String(index+1).padStart(2,"0")}</span><p>{fact}</p></li>)}</ol></section>

        <GovernmentSection country={country}/>

        <HistoricalTimeline country={country}/>

        <section id="places" className="profile-section travel-file"><p className="eyebrow"><span/>Tourism & local discovery</p><div className="section-title-row"><h2>Travel<br/><em>guide.</em></h2><Link href="/rankings/most-visited">Global tourism ranking ↗</Link></div><div className="travel-practical-grid"><article><small>When to start looking</small><b>{travelWindow(country)}</b></article><article><small>Languages</small><b>{country.languages.join(" · ")||"Confirm locally"}</b></article><article><small>Money</small><b>{country.currencies.join(" · ")||"Confirm locally"}</b></article><article><small>Getting around</small><b>Traffic keeps to the {country.carSide}. Check intercity options and local transport before arrival.</b></article><article><small>Time</small><b>{country.timezones.join(" · ")||"Confirm local time"}</b></article><article><small>Entry planning</small><b>Visa and health rules depend on your passport and can change. Verify them with official authorities before paying.</b></article></div><div className="travel-place-grid">{displayedTravelPlaces.map((place,index)=><article key={place.name}><span>{String(index+1).padStart(2,"0")}</span><small>{place.kind}</small><h3>{place.name}</h3><p>{place.note}</p>{guides.find((guide)=>guide.name===place.name)&&<Link href={`/countries/${country.slug}/cities/${guides.find((guide)=>guide.name===place.name)?.citySlug}`}>Open full city guide →</Link>}</article>)}</div><div className="travel-research-links"><div><small>Independent destination guide</small><a href={`https://en.wikivoyage.org/wiki/${encodeURIComponent(country.name.replaceAll(" ","_"))}`} target="_blank" rel="noreferrer">Read {country.name} on Wikivoyage ↗</a></div><div><small>Current official advice</small><a href="https://www.gov.uk/foreign-travel-advice" target="_blank" rel="noreferrer">Check live travel advisories ↗</a></div><div><small>Map & orientation</small><a href={country.mapUrl} target="_blank" rel="noreferrer">Open verified map ↗</a></div></div>{guides.length>0&&<div className="guide-availability"><span>Detailed city guides</span><p>{guides.map((guide)=><Link key={guide.citySlug} href={`/countries/${country.slug}/cities/${guide.citySlug}`}>{guide.name} ↗</Link>)}</p></div>}</section>

        <section id="football" className="profile-section football-section"><p className="eyebrow"><span/>National game file</p><div className="football-title"><div><h2>Football<br/><em>dossier.</em></h2><p>{football.team} · {football.confederation}</p></div><span>{football.badge}</span></div><div className="football-record"><div><small>World stage</small><b>{football.worldCup}</b></div><div><small>Continental record</small><b>{football.continental}</b></div></div><div className="achievement-list">{football.achievements.map((achievement, index) => <div key={achievement}><span>🏆</span><b>{achievement}</b><small>{String(index + 1).padStart(2, "0")}</small></div>)}</div><div className="football-icons"><div><small>Current icons / active watch</small>{football.current.map((person) => <article key={person.name}><span>{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><b>{person.name}</b><p>{person.note}</p></div></article>)}</div><div><small>Legends / heritage file</small>{football.legends.map((person) => <article key={person.name}><span>{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><b>{person.name}</b><p>{person.note}</p></div></article>)}</div></div></section>

        <section id="people" className="profile-section"><p className="eyebrow"><span/>Culture & achievement</p><h2>Notable<br/><em>people.</em></h2>{notablePeople.length?<NotablePeopleGrid people={notablePeople} country={country.name}/>:editorial?<div className="notable-list expanded-people">{editorial.notable.map((name, index) => <div key={name}><span>{name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><b>{name}</b><small>{notableRoles[name] ?? `Featured ${country.name} profile · ${String(index + 1).padStart(2, "0")}`}</small></div>)}</div>:<div className="people-placeholder"><b>Notable people data coming soon</b><p>Writers, artists, scientists, leaders and athletes from {country.name} will appear after the next Wikidata refresh and editorial review.</p><Link href="/football-archive">Browse the football archive →</Link></div>}</section>
        <p className="source-note">Geographic structure: ISO 3166 / world-countries reference data. Population: World Bank SP.POP.TOTL latest available observation, with Vatican City’s official 2024 resident count used for that record. Time zones: IANA-linked country data. Football honours are historical records through the 2024–25 editorial cycle; current-player panels are curated highlights, not complete squads. Government dossiers are date-stamped editorial records; claims about policy, criticism and elections link to their source beside the text. Regional leadership is released country by country only after a complete-office review.</p>
      </div>
    </section>
    <SiteFooter/>
  </main>;
}
