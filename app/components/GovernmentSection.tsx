import Link from "next/link";
import type {AtlasCountry} from "../atlas-data";
import {governmentAsOfLabel,governmentByCode,regionalGovernmentByCode,tenureLabel} from "../government-data";
import {countryReferenceByCode,countryReferenceData} from "../country-reference-data";

function initials(name:string){return name.split(" ").filter(Boolean).map((part)=>part[0]).slice(0,2).join("");}

export function GovernmentSection({country}:{country:AtlasCountry}){
  const profile=governmentByCode[country.code];
  const regional=regionalGovernmentByCode[country.code];
  const reference=countryReferenceByCode[country.code];

  return <section id="government" className="profile-section government-depth">
    <p className="eyebrow"><span/>Leadership & state · sourced editorial record</p>
    <div className="section-title-row"><h2>Government<br/><em>record.</em></h2><span className={`content-status ${profile?"curated":"atlas-verified"}`}>{profile?`Checked ${governmentAsOfLabel}`:`Reference profile · ${countryReferenceData.edition}`}</span></div>
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
    </>:<article className="government-reference-profile"><header><span>{country.code}</span><div><small>Complete country reference</small><h3>{reference.governmentType||`${country.name} national government`}</h3><p>Leadership names below reproduce the final archived Factbook edition and are date-stamped; use the linked source to verify any later change.</p></div></header><dl><div><dt>Chief of state</dt><dd>{reference.chiefOfState||"See the country source record"}</dd></div><div><dt>Head of government</dt><dd>{reference.headOfGovernment||"See the country source record"}</dd></div><div><dt>How the executive is selected</dt><dd>{reference.executiveSelection||"Selection rules vary by constitutional office; consult the source record."}</dd></div><div><dt>Constitutional foundation</dt><dd>{reference.constitution||"See the country source record"}</dd></div></dl><footer><span>Reference edition</span><a href={countryReferenceData.source.url} target="_blank" rel="noreferrer">{countryReferenceData.source.label} ↗</a></footer></article>}

    {regional?<div className="regional-government-callout"><div><small>Subnational government · live template</small><h3>{regional.title}</h3><p>{regional.note}</p></div><div><b>{regional.units.length}</b><span>regional records</span><Link href={`/countries/${country.slug}/government`}>Open every regional leader →</Link></div></div>:<div className="regional-government-empty"><div><small>Scope note</small><h3>National profile complete.</h3><p>This page covers {country.name} at national level. Subnational office-holder directories are outside the current 195-country launch dataset.</p></div><span>National scope</span></div>}
  </section>;
}

export function HistoricalTimeline({country}:{country:AtlasCountry}){
  const profile=governmentByCode[country.code];
  const reference=countryReferenceByCode[country.code];
  const orientation=[{label:"Formation & independence",text:reference.independence},{label:"Constitutional record",text:reference.constitution},{label:"National commemoration",text:reference.nationalHoliday},{label:"Historical orientation",text:reference.background}].filter((item)=>item.text);
  return <section id="timeline" className="profile-section historical-timeline-section">
    <p className="eyebrow"><span/>History · selected milestones</p>
    <div className="section-title-row"><h2>Historical<br/><em>timeline.</em></h2><span className={`content-status ${profile?"curated":"atlas-verified"}`}>{profile?`${profile.timeline.length} sourced milestones`:`${orientation.length} sourced orientation records`}</span></div>
    {profile?<><ol className="historical-timeline">{profile.timeline.map((event,index)=><li key={`${event.date}-${event.title}`}><time dateTime={event.date}>{event.label}</time><span>{String(index+1).padStart(2,"0")}</span><div><h3>{event.title}</h3><p>{event.text}</p></div></li>)}</ol><p className="timeline-source">Chronology reference: <a href={profile.timelineSource.url} target="_blank" rel="noreferrer">{profile.timelineSource.label} ↗</a>. Milestones are selected for orientation rather than presented as a complete national history.</p></>:<><ol className="historical-timeline reference-timeline">{orientation.map((event,index)=><li key={event.label}><span className="timeline-label">Reference</span><span>{String(index+1).padStart(2,"0")}</span><div><h3>{event.label}</h3><p>{event.text}</p></div></li>)}</ol><p className="timeline-source">Historical orientation: <a href={countryReferenceData.source.url} target="_blank" rel="noreferrer">{countryReferenceData.source.label} ↗</a>. This is a concise launch reference, not a complete national chronology.</p></>}
  </section>;
}
