import Link from "next/link";
import type {AtlasCountry} from "../atlas-data";
import {governmentAsOfLabel,governmentByCode,regionalGovernmentByCode,tenureLabel} from "../government-data";

function initials(name:string){return name.split(" ").filter(Boolean).map((part)=>part[0]).slice(0,2).join("");}

export function GovernmentSection({country}:{country:AtlasCountry}){
  const profile=governmentByCode[country.code];
  const regional=regionalGovernmentByCode[country.code];

  return <section id="government" className="profile-section government-depth">
    <p className="eyebrow"><span/>Leadership & state · sourced editorial record</p>
    <div className="section-title-row"><h2>Government<br/><em>record.</em></h2><span className={`content-status ${profile?"curated":"atlas-verified"}`}>{profile?`Checked ${governmentAsOfLabel}`:"Dossier queued"}</span></div>
    {profile?<>
      <article className="leader-dossier">
        <header><div className="leader-monogram">{initials(profile.leader.name)}</div><div><small>{profile.leader.role} · {profile.system}</small><h3>{profile.leader.name}</h3><p>{profile.leader.bio}</p></div></header>
        <dl className="leader-tenure-grid"><div><dt>In office since</dt><dd>{new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(`${profile.leader.startDate}T00:00:00Z`))}</dd></div><div><dt>Time in office</dt><dd>{tenureLabel(profile.leader.startDate)}</dd></div><div><dt>Term record</dt><dd>{profile.leader.term}</dd></div><div><dt>Next scheduled election</dt><dd>{profile.leader.nextElection.label}</dd><small>{profile.leader.nextElection.note}</small></div></dl>
        <div className="leader-record-columns">
          <section><small>Policy & institutional record</small><ol>{profile.leader.record.map((point,index)=><li key={point.text}><span>{String(index+1).padStart(2,"0")}</span><p>{point.text}<a href={point.source.url} target="_blank" rel="noreferrer">{point.source.label} ↗</a></p></li>)}</ol></section>
          <section><small>Documented scrutiny & shortcomings</small><ol>{profile.leader.scrutiny.map((point,index)=><li key={point.text}><span>{String(index+1).padStart(2,"0")}</span><p>{point.text}<a href={point.source.url} target="_blank" rel="noreferrer">{point.source.label} ↗</a></p></li>)}</ol></section>
        </div>
        <footer><span>Election source</span><a href={profile.leader.nextElection.source.url} target="_blank" rel="noreferrer">{profile.leader.nextElection.source.label} ↗</a>{profile.leader.sources.map((source)=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</footer>
      </article>

      <div className="succession-block">
        <header><div><small>Leader history</small><h3>Recent succession.</h3></div><p>A concise line of recent office-holders—not a complete list of every government.</p></header>
        <div>{profile.succession.map((leader,index)=><article key={`${leader.name}-${leader.term}`}><span>{String(index+1).padStart(2,"0")}</span><small>{leader.office} · {leader.term}</small><h4>{leader.name}</h4><p>{leader.note}</p></article>)}</div>
      </div>
    </>:<div className="government-availability"><span>{country.code}</span><div><small>Data not yet available</small><h3>Leadership dossier in editorial review.</h3><p>{country.name} has its full geographic and national-facts record, but its date-sensitive leader biography, record and succession list have not yet passed source review.</p></div></div>}

    {regional?<div className="regional-government-callout"><div><small>Subnational government · live template</small><h3>{regional.title}</h3><p>{regional.note}</p></div><div><b>{regional.units.length}</b><span>regional records</span><Link href={`/countries/${country.slug}/government`}>Open every regional leader →</Link></div></div>:<div className="regional-government-empty"><div><small>State / regional government</small><h3>Country-by-country rollout.</h3><p>Regional leadership data is not yet available for {country.name}. TerraScope publishes this layer only after every office-holder and start date in a country has been checked together.</p></div><span>Data not yet available</span></div>}
  </section>;
}

export function HistoricalTimeline({country}:{country:AtlasCountry}){
  const profile=governmentByCode[country.code];
  return <section id="timeline" className="profile-section historical-timeline-section">
    <p className="eyebrow"><span/>History · selected milestones</p>
    <div className="section-title-row"><h2>Historical<br/><em>timeline.</em></h2><span className={`content-status ${profile?"curated":"atlas-verified"}`}>{profile?`${profile.timeline.length} sourced milestones`:"Editorial pass queued"}</span></div>
    {profile?<><ol className="historical-timeline">{profile.timeline.map((event,index)=><li key={`${event.date}-${event.title}`}><time dateTime={event.date}>{event.label}</time><span>{String(index+1).padStart(2,"0")}</span><div><h3>{event.title}</h3><p>{event.text}</p></div></li>)}</ol><p className="timeline-source">Chronology reference: <a href={profile.timelineSource.url} target="_blank" rel="noreferrer">{profile.timelineSource.label} ↗</a>. Milestones are selected for orientation rather than presented as a complete national history.</p></>:<div className="timeline-empty"><b>Timeline data coming soon</b><p>The first verified chronology for {country.name} will combine formation, constitutional change and major national events without reducing the country to a single political story.</p></div>}
  </section>;
}
