import Link from "next/link";
import {notFound} from "next/navigation";
import {atlasBySlug, atlasCountries, regionColours, type AtlasCountry} from "../../atlas-data";
import {footballProfiles, nigeriaFieldNotes, notableRoles, type FootballProfile} from "../../editorial-data";
import {SiteHeader} from "../../components/SiteHeader";
import {SiteFooter} from "../../components/SiteFooter";
import {getLeader} from "../../leaders";

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
    {title:"A sense of scale",text:`The country covers ${country.areaLabel}. ${editorial ? `Its editorial population estimate is ${editorial.populationLabel}, with a density of ${editorial.density}.` : `Its territory is represented to scale in TerraScope’s political atlas.`}`},
    {title:"Language and identity",text:`The structured language register lists ${country.languages.length ? country.languages.join(", ") : "locally recognised languages"}. The common English demonym is ${country.demonym}.`},
    {title:country.landlocked ? "A country without a coastline" : "Connected to the wider world",text:country.landlocked ? `${country.name} has no ocean coastline and connects overland to ${country.borders.length} neighbouring states.` : `${country.name} has maritime access and ${country.borders.length ? `shares land borders with ${country.borders.length} neighbours` : "has no land borders"}.`},
    {title:"Money and connection",text:`The currency register lists ${country.currencies.join(" · ") || "a shared or externally administered currency"}. The international calling prefix is ${country.calling}, while ${country.tld} is used for country-code web domains.`},
    {title:editorial ? "Cities and landmarks" : "A profile designed to grow",text:editorial ? `Major urban centres include ${editorial.cities.join(", ")}. Featured landmarks include ${editorial.landmarks.join(", ")}.` : "This core geographic record is linked to the same atlas structure used by the extended editorial profiles, rankings and continent filters."},
  ];
}

export default async function CountryPage({params}:{params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const country = atlasBySlug.get(slug);
  if (!country) notFound();
  const editorial = country.editorial;
  const colour = editorial?.color ?? regionColours[country.region];
  const football = footballProfiles[country.code] ?? fallbackFootball(country);
  const leader = editorial
    ? { leader: editorial.leader, leaderTitle: editorial.leaderTitle, government: editorial.government, since: undefined as string | undefined }
    : getLeader(country.code);
  const dataQuality = editorial ? "full" : leader ? "core-plus" : "core";
  const notes = country.code === "NG" ? nigeriaFieldNotes : generatedNotes(country);
  const summary = editorial?.summary ?? `${country.name} is a sovereign state in ${country.subregion}. This profile connects its political geography, language, currency, borders and national football record to TerraScope’s complete world index.`;
  const essentialFacts = editorial ? [
    ["Official name", country.official],["Currency", editorial.currency],["Languages", editorial.languages.join(" · ")],["Calling code", editorial.calling],["Time zone", editorial.timezone],["Population density", editorial.density],["Life expectancy", editorial.lifeExpectancy],["Internet access", editorial.internet],["Nominal GDP", editorial.gdp],["Independence / formation", editorial.independence],["Subregion", country.subregion],["Land borders", String(country.borders.length)],
  ] : [
    ["Official name", country.official],["Capital", country.capital],["Continent", country.region],["Subregion", country.subregion],["Land area", country.areaLabel],["Landlocked", country.landlocked ? "Yes" : "No"],["Languages", country.languages.join(" · ") || "—"],["Currencies", country.currencies.join(" · ") || "—"],["Calling code", country.calling],["Country domain", country.tld],["Demonym", country.demonym],["Land borders", String(country.borders.length)],
  ];

  return <main>
    <SiteHeader active="countries"/>
    <section className="profile-hero" style={{"--country": colour} as React.CSSProperties}>
      <div className="profile-breadcrumb"><Link href="/countries">195 countries</Link><span>→</span><Link href={`/countries?region=${country.region}`}>{country.region}</Link><span>→</span><b>{country.name}</b></div>
      <div className="profile-title"><div><p>{country.official}</p><h1>{country.name}</h1><span>{country.subregion} · {country.code} / {country.cca3}</span><span className={`data-quality data-quality--${dataQuality}`}>{dataQuality === "full" ? "Full editorial profile" : dataQuality === "core-plus" ? "Core + leadership record" : "Core geographic record"}</span></div><div className="profile-flag">{country.flag}</div></div>
      <p className="profile-summary">{summary}</p>
      <div className="profile-quick"><div><small>Capital</small><b>{country.capital}</b></div><div><small>{editorial ? "Population" : "Continent"}</small><b>{editorial?.populationLabel ?? country.region}</b></div><div><small>Land area</small><b>{country.areaLabel}</b></div><div><small>Football confederation</small><b>{football.confederation}</b></div></div>
    </section>

    <section className="profile-body">
      <aside><b>On this page</b><a href="#overview">Essential facts</a><a href="#story">Country in depth</a><a href="#government">Leadership</a><a href="#football">Football dossier</a><a href="#people">Popular people</a><Link href="/rankings">Open world rankings ↗</Link></aside>
      <div className="profile-content">
        <section id="overview"><p className="eyebrow"><span/>National record · {country.code}</p><h2>Essential<br/><em>facts.</em></h2><div className="fact-table expanded-facts">{essentialFacts.map(([key, value]) => <div key={key}><span>{key}</span><b>{value}</b></div>)}</div>{editorial && <blockquote><small>Field fact</small>{editorial.fact}</blockquote>}</section>

        <section id="story" className="profile-section country-story"><p className="eyebrow"><span/>Beyond the quick facts</p><h2>{country.name}<br/><em>in depth.</em></h2><div className="story-grid">{notes.map((note, index) => <article key={note.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{note.title}</h3><p>{note.text}</p></article>)}</div></section>

        <section id="government" className="profile-section"><p className="eyebrow"><span/>Leadership & state</p><h2>Government.</h2>{leader ? <div className="leader-panel"><div className="leader-monogram">{leader.leader.split(/[\s/·]+/).filter(Boolean).map((name) => name[0]).slice(0, 2).join("").toUpperCase()}</div><div><small>{leader.leaderTitle}{leader.since ? ` · since ${leader.since}` : " · current record"}</small><h3>{leader.leader}</h3><p>{leader.government}</p></div></div> : <div className="government-record"><span>{country.code}</span><div><small>Core state record</small><h3>{country.official}</h3><p>This complete-index profile currently carries verified geographic data. Current political leadership is maintained in the extended editorial records because office-holders require continuous date-stamped verification.</p></div></div>}</section>

        {editorial && <section id="places" className="profile-section"><p className="eyebrow"><span/>Cities & landmarks</p><h2>Places.</h2><div className="place-columns"><div><small>Major cities</small>{editorial.cities.map((place, index) => <p key={place}><b>0{index + 1}</b>{place}</p>)}</div><div><small>Landmarks</small>{editorial.landmarks.map((place, index) => <p key={place}><b>0{index + 1}</b>{place}</p>)}</div></div></section>}

        <section id="football" className="profile-section football-section"><p className="eyebrow"><span/>National game file</p><div className="football-title"><div><h2>Football<br/><em>dossier.</em></h2><p>{football.team} · {football.confederation}</p></div><span>{football.badge}</span></div><div className="football-record"><div><small>World stage</small><b>{football.worldCup}</b></div><div><small>Continental record</small><b>{football.continental}</b></div></div><div className="achievement-list">{football.achievements.map((achievement, index) => <div key={achievement}><span>🏆</span><b>{achievement}</b><small>{String(index + 1).padStart(2, "0")}</small></div>)}</div><div className="football-icons"><div><small>Current icons / active watch</small>{football.current.map((person) => <article key={person.name}><span>{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><b>{person.name}</b><p>{person.note}</p></div></article>)}</div><div><small>Legends / heritage file</small>{football.legends.map((person) => <article key={person.name}><span>{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><b>{person.name}</b><p>{person.note}</p></div></article>)}</div></div></section>

        <section id="people" className="profile-section"><p className="eyebrow"><span/>Culture & achievement</p><h2>Popular people.</h2>{editorial ? <div className="notable-list expanded-people">{editorial.notable.map((name, index) => <div key={name}><span>{name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><b>{name}</b><small>{notableRoles[name] ?? `Featured ${country.name} profile · ${String(index + 1).padStart(2, "0")}`}</small></div>)}</div> : <div className="people-placeholder"><b>People index connected</b><p>Writers, artists, scientists, leaders and athletes from {country.name} will join this country record as their individual editorial biographies are verified.</p><Link href="/people">Browse the global people index →</Link></div>}</section>
        <p className="source-note">Geographic structure: ISO 3166 / world-countries reference data. Football honours are historical records through the 2024–25 editorial cycle; current-player panels are curated highlights, not complete squads. Political leaders are shown only on date-maintained extended profiles.</p>
      </div>
    </section>
    <SiteFooter/>
  </main>;
}
