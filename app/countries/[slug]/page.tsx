import Link from "next/link";
import {notFound} from "next/navigation";
import {atlasBySlug, atlasCountries, regionColours, type AtlasCountry} from "../../atlas-data";
import {footballProfiles, nigeriaFieldNotes, notableRoles, type FootballProfile} from "../../editorial-data";
import {cityGuides,notablePeopleByCode,travelPlacesByCode} from "../../country-content";
import {indicatorsByCode,indicatorDataset,type IndicatorRecord} from "../../country-indicators";
import {leadershipSources,leadershipCheckedAt} from "../../leadership-sources";
import {iqByCode} from "../../iq-data";
import {NotablePeopleGrid} from "../../components/NotablePeopleGrid";
import {SiteHeader} from "../../components/SiteHeader";
import {SiteFooter} from "../../components/SiteFooter";

export function generateStaticParams() { return atlasCountries.map((country) => ({slug: country.slug})); }

const confederations: Record<AtlasCountry["region"], string> = {Africa:"CAF",Americas:"CONCACAF / CONMEBOL",Asia:"AFC",Europe:"UEFA",Oceania:"OFC"};

function fallbackFootball(country: AtlasCountry): FootballProfile {
  return {
    team: `${country.name} national football teams`,
    confederation: confederations[country.region],
    badge: country.code,
    worldCup: "Country-specific tournament record awaiting editorial verification",
    continental: `Association record: consult official competition archives`,
    achievements:[],
    current:[],
    legends:[],
  };
}

function generatedNotes(country: AtlasCountry) {
  const editorial = country.editorial;
  return [
    {title:"The state in one line",text:`${country.official} is a ${country.landlocked ? "landlocked " : ""}sovereign country in ${country.subregion}, ${country.region}. Its capital is ${country.capital}.`},
    {title:"A sense of scale",text:`The country covers ${country.areaLabel}, ranking #${country.areaRank} by total area in TerraScope’s 195-country index. Its atlas population is ${country.populationLabel}, with a density of about ${Math.round(country.density)} people per km².`},
    {title:"Language and identity",text:`The structured language register lists ${country.languages.length ? country.languages.join(", ") : "locally recognised languages"}. The common English demonym is ${country.demonym}.`},
    {title:country.landlocked ? "A country without a coastline" : "Connected to the wider world",text:country.landlocked ? `${country.name} has no ocean coastline and connects overland to ${country.borders.length} neighbouring states.` : `${country.name} has maritime access and ${country.borders.length ? `shares land borders with ${country.borders.length} neighbours` : "has no land borders"}.`},
    {title:"Money and connection",text:`The currency register lists ${country.currencies.join(" · ") || "a shared or externally administered currency"}. The international calling prefix is ${country.calling}, while ${country.tld} is used for country-code web domains.`},
    {title:"Cities and landmarks",text:(travelPlacesByCode[country.code]||[]).map(place=>`${place.name}: ${place.note}`).join(" ")},
  ];
}

function travelWindow(country:AtlasCountry){
  const featured:Record<string,string>={
    NG:"November to February is generally drier in much of the country. Rainfall and harmattan conditions vary by region.",
    EG:"October to April is usually more comfortable for outdoor monuments. Summer heat is intense in Upper Egypt.",
    JP:"March to May and October to November are popular for mild weather; blossom and foliage dates vary.",
    BR:"May to October is drier in much of the southeast, but the Amazon and northeast follow different patterns.",
    FR:"April to June and September to October balance milder weather with major-city sightseeing.",
    US:"Choose dates by region: desert summers, northern winters and hurricane seasons create very different trips.",
    IN:"October to March works for many northern routes; monsoon and heat patterns vary widely by region.",
    ZA:"November to March suits Cape summer; May to September is often preferred for northern wildlife viewing.",
    MX:"November to April is drier on many routes; hurricane season affects some coasts from June to November.",
    AU:"September to November and March to May suit many southern cities; the tropical north has separate wet and dry seasons.",
  };
  if(featured[country.code])return featured[country.code];
  if(Math.abs(country.latitude)<15)return "Warm conditions are common through much of the year. Compare local wet and dry seasons before fixing dates.";
  if(country.latitude<0)return "March–May and September–November are useful shoulder-season starting points; climate still varies sharply by region and altitude.";
  return "April–June and September–October are useful shoulder-season starting points; check local climate, altitude and festival dates before booking.";
}

export default async function CountryPage({params}:{params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const country = atlasBySlug.get(slug);
  if (!country) notFound();
  const editorial = country.editorial;
  const colour = editorial?.color ?? regionColours[country.region];
  const football = footballProfiles[country.code] ?? fallbackFootball(country);
  const iq = iqByCode.get(country.code);
  const notablePeople = notablePeopleByCode[country.code] ?? [];
  const travelPlaces = travelPlacesByCode[country.code] ?? [];
  const guides = cityGuides.filter((guide) => guide.countryCode === country.code);
  const renderTravelPlace = (place:(typeof travelPlaces)[number],index:number) => {
    const guide = guides.find((item)=>item.name===place.name);
    const relatedGuide = country.code==="EG" && ["Giza pyramid complex","Saqqara"].includes(place.name) ? guides.find((item)=>item.citySlug==="cairo") : undefined;
    return <article key={place.name}><span>{String(index+1).padStart(2,"0")}</span><small>{place.kind}</small><h3>{place.name}</h3><p>{place.note}</p>{(guide||relatedGuide)&&<Link href={`/countries/${country.slug}/cities/${(guide||relatedGuide)?.citySlug}`}>Explore nearby city guide →</Link>}</article>;
  };
  const notes = country.code === "NG" ? nigeriaFieldNotes : generatedNotes(country);
  const summary = editorial?.summary ?? `${country.name} is a sovereign state in ${country.subregion}. This profile connects its political geography, language, currency, borders and national football record to TerraScope’s complete world index.`;
  const metrics=indicatorsByCode[country.code];
  const essentialFacts = [
    ["Official name",country.official],["Capital",country.capital],["Population",`${country.populationLabel} · ${country.populationSource} ${country.populationYear}`],["Population rank",`#${country.populationRank} of 195`],["Total area",country.areaLabel],["Area rank",`#${country.areaRank} of 195`],["Residents / total km²",`${Math.round(country.density).toLocaleString("en-US")} · population ${country.populationYear}`],["Continent",country.region],["Subregion",country.subregion],["Landlocked",country.landlocked?"Yes":"No"],["Language register",country.languages.join(" · ")||"Not available"],["Currency",country.currencies.join(" · ")||"Not available"],["Calling code",country.calling],["Time zones",country.timezones.join(" · ")||"Not available"],["Driving side",country.carSide],["Country domain",country.tld],["Demonym",country.demonym],["Land borders",country.borders.map(code=>atlasCountries.find(c=>c.cca3===code)?.name||code).join(" · ")||"None"],...(editorial?[["Independence / formation",editorial.independence]]:[])
  ];
  const metricRows:[string,IndicatorRecord|undefined,string,string][]=[
    ["Nominal GDP",metrics?.gdp,"gdp","Economic output in current US dollars"],["GDP per person",metrics?.perCapita,"perCapita","Output per resident; not a salary"],["Life expectancy at birth",metrics?.lifeExpectancy,"lifeExpectancy","Expected years at birth under observed mortality rates"],["Internet users",metrics?.internet,"internet","Percentage of the population using the internet"]
  ];
  const formatMetric=(key:string,value:number)=>key==="gdp"||key==="perCapita"?new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:key==="gdp"?"compact":"standard",maximumFractionDigits:key==="gdp"?2:0}).format(value):`${value.toFixed(1)}${key==="internet"?"%":" years"}`;


  return <main>
    <SiteHeader active="countries"/>
    <section className="profile-hero" style={{"--country": colour} as React.CSSProperties}>
      <div className="profile-breadcrumb"><Link href="/countries">195 countries</Link><span>→</span><Link href={`/countries?region=${country.region}`}>{country.region}</Link><span>→</span><b>{country.name}</b></div>
      <div className="profile-title"><div><p>{country.official}</p><h1>{country.name}</h1><span>{country.subregion} · {country.code} / {country.cca3}</span></div><div className="profile-flag">{country.flag}</div></div>
      <p className="profile-summary">{summary}</p>
      <div className="profile-quick"><div><small>Capital</small><b>{country.capital}</b></div><div><small>Population</small><b>{country.populationLabel}</b></div><div><small>Total area</small><b>{country.areaLabel}</b></div><div><small>Football confederation</small><b>{football.confederation}</b></div><div className="iq-quick-card"><small>Reported IQ rank</small>{iq?<b>#{iq.rank} · {iq.score.toFixed(2)}</b>:<b>Data pending</b>}<Link href="/rankings/iq">Open full ranking ↗</Link></div></div>
    </section>

    <section className="profile-body">
      <aside><b>On this page</b><a href="#overview">Essential facts</a><a href="#statistics">Economy & wellbeing</a><a href="#story">Country in depth</a><a href="#interesting-facts">10 interesting facts</a><a href="#government">Leadership</a><a href="#places">Travel file</a><a href="#football">Football dossier</a><a href="#people">Notable people</a><Link href="/rankings">Open world rankings ↗</Link></aside>
      <div className="profile-content">
        <section id="overview"><p className="eyebrow"><span/>National record · {country.code}</p><h2>Essential<br/><em>facts.</em></h2><div className="fact-table expanded-facts">{essentialFacts.map(([key, value]) => <div key={key}><span>{key}</span><b>{value}</b></div>)}</div>{editorial && <blockquote><small>Field fact</small>{editorial.fact}</blockquote>}</section>

        <section id="statistics" className="profile-section"><p className="eyebrow"><span/>Dated statistical record</p><h2>Economy &<br/><em>wellbeing.</em></h2><div className="country-statistics-grid">{metricRows.map(([label,record,key,definition])=><article key={key}><small>{label}</small><strong>{record?formatMetric(key,record.value):"Not available"}</strong><b>{record?`Observation: ${record.year}`:"No published value in this refresh"}</b><p>{definition}</p><a href={`https://data.worldbank.org/indicator/${indicatorDataset.sources[key as keyof typeof indicatorDataset.sources].indicator}?locations=${country.code}`} target="_blank" rel="noreferrer">World Bank source ↗</a></article>)}</div><p className="source-note">Retrieved {indicatorDataset.refreshedAt}. The latest available year differs by indicator and country; these are observations, not {indicatorDataset.refreshedAt.slice(0,4)} forecasts. Missing data stays blank rather than receiving an estimate.</p></section>

        <section id="story" className="profile-section country-story"><p className="eyebrow"><span/>Beyond the quick facts</p><h2>{country.name}<br/><em>in depth.</em></h2><div className="story-grid">{notes.map((note, index) => <article key={note.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{note.title}</h3><p>{note.text}</p></article>)}</div></section>

        <section id="interesting-facts" className="profile-section interesting-facts-section"><p className="eyebrow"><span/>History · culture · geography</p><div className="section-title-row"><h2>10 interesting<br/><em>facts.</em></h2><span className={`content-status ${country.factsStatus}`}>{country.factsStatus === "curated" ? "Editorially curated" : "Atlas-verified core facts"}</span></div><ol>{country.interestingFacts.slice(0,10).map((fact,index)=><li key={fact}><span>{String(index+1).padStart(2,"0")}</span><p>{fact}</p></li>)}</ol></section>

        <section id="government" className="profile-section"><p className="eyebrow"><span/>Leadership & state</p><h2>Government.</h2>{editorial ? <div className="leader-panel"><div className="leader-monogram">{editorial.leader.split(" ").map((name) => name[0]).slice(0, 2).join("")}</div><div><small>{editorial.leaderTitle} · official reference checked {leadershipCheckedAt}</small><h3>{editorial.leader}</h3><p>{editorial.government}</p><a href={leadershipSources[country.code]} target="_blank" rel="noreferrer">Official leadership reference ↗</a></div></div> : <div className="government-record"><span>{country.code}</span><div><small>Core state record</small><h3>{country.official}</h3><p>This complete-index profile currently carries verified geographic data. Current political leadership is maintained in the extended editorial records because office-holders require continuous date-stamped verification.</p></div></div>}</section>

        <section id="places" className="profile-section travel-file"><p className="eyebrow"><span/>Tourism & local discovery</p><div className="section-title-row"><h2>Travel<br/><em>guide.</em></h2><Link href="/rankings/most-visited">Global tourism ranking ↗</Link></div><p className="trip-country-action"><Link href={`/trips?destination=${encodeURIComponent(country.name)}`}>Plan a trip to {country.name}</Link></p><div className="travel-practical-grid"><article><small>When to start looking</small><b>{travelWindow(country)}</b></article><article><small>Language register</small><b>{country.languages.join(" · ")||"Confirm locally"}</b></article><article><small>Money</small><b>{country.currencies.join(" · ")||"Confirm locally"}</b></article><article><small>Getting around</small><b>Traffic keeps to the {country.carSide}. Check intercity options and local transport before arrival.</b></article><article><small>Time</small><b>{country.timezones.join(" · ")||"Confirm local time"}</b></article><article><small>Entry planning</small><b>Visa and health rules depend on your passport and can change. Verify them with official authorities before paying.</b></article></div><div className="travel-place-grid">{travelPlaces.slice(0,6).map(renderTravelPlace)}</div>{travelPlaces.length>6&&<details className="more-travel-places"><summary>Explore {travelPlaces.length-6} more places in {country.name}</summary><div className="travel-place-grid">{travelPlaces.slice(6).map((place,index)=>renderTravelPlace(place,index+6))}</div></details>}<div className="travel-research-links"><div><small>Independent destination guide</small><a href={`https://en.wikivoyage.org/wiki/${encodeURIComponent(country.name.replaceAll(" ","_"))}`} target="_blank" rel="noreferrer">Read {country.name} on Wikivoyage ↗</a></div><div><small>Current official advice</small><a href="https://www.gov.uk/foreign-travel-advice" target="_blank" rel="noreferrer">Check live travel advisories ↗</a></div><div><small>Map & orientation</small><a href={country.mapUrl} target="_blank" rel="noreferrer">Open map ↗</a></div></div>{guides.length>0&&<div className="guide-availability"><span>Detailed city guides</span><p>{guides.map((guide)=><Link key={guide.citySlug} href={`/countries/${country.slug}/cities/${guide.citySlug}`}>{guide.name} ↗</Link>)}</p></div>}</section>

        <section id="football" className="profile-section football-section"><p className="eyebrow"><span/>National game file</p><div className="football-title"><div><h2>Football<br/><em>dossier.</em></h2><p>{football.team} · {football.confederation}</p></div><span>{football.badge}</span></div><div className="football-record"><div><small>World stage</small><b>{football.worldCup}</b></div><div><small>Continental record</small><b>{football.continental}</b></div></div><div className="achievement-list">{football.achievements.map((achievement, index) => <div key={achievement}><span>🏆</span><b>{achievement}</b><small>{String(index + 1).padStart(2, "0")}</small></div>)}</div>{!football.achievements.length&&<p className="source-note">A verified player and honours dossier has not been curated for this country yet. <a href={`https://inside.fifa.com/associations/${country.cca3}`} target="_blank" rel="noreferrer">Consult the FIFA association record ↗</a></p>}<div className="football-icons"><div><small>Featured players · editorial selection</small>{football.current.map((person) => <article key={person.name}><span>{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><b>{person.name}</b><p>{person.note}</p></div></article>)}</div><div><small>Legends / heritage file</small>{football.legends.map((person) => <article key={person.name}><span>{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><b>{person.name}</b><p>{person.note}</p></div></article>)}</div></div></section>

        <section id="people" className="profile-section"><p className="eyebrow"><span/>Culture & achievement</p><h2>Notable<br/><em>people.</em></h2>{notablePeople.length?<NotablePeopleGrid people={notablePeople} country={country.name}/>:editorial?<div className="notable-list expanded-people">{editorial.notable.map((name, index) => <div key={name}><span>{name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><b>{name}</b><small>{notableRoles[name] ?? `Featured ${country.name} profile · ${String(index + 1).padStart(2, "0")}`}</small></div>)}</div>:<div className="people-placeholder"><b>Notable people data coming soon</b><p>Writers, artists, scientists, leaders and athletes from {country.name} will appear after the next Wikidata refresh and editorial review.</p><Link href="/football-archive">Browse the football archive →</Link></div>}</section>
        <p className="source-note">Geographic structure: ISO 3166 / world-countries reference data. Population: World Bank SP.POP.TOTL latest available observation, with Vatican City’s official 2024 resident count used for that record. Time zones: IANA-linked country data. Football dossiers contain selected historical honours; Spain’s men’s World Cup record includes 2026. Other honours panels remain historical editorial selections; current-player panels are curated highlights, not complete squads. The 10 featured leadership records have official references checked on 2026-09-30; other profiles leave office-holders unfilled. The World Bank statistical dataset was refreshed on 2026-09-30. <Link href="/method#data-register">View source editions and coverage →</Link></p>
      </div>
    </section>
    <SiteFooter/>
  </main>;
}
