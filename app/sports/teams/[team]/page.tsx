import Link from "next/link";
import {notFound} from "next/navigation";
import {SportsFrame} from "../../ToolsShared";
import {sportsTeams} from "../../catalog";
import {athletes} from "../../data";
import {atlasCountries} from "../../../atlas-data";
import {FavouriteButton} from "../../FavouriteButton";
import {pageMetadata} from "../../../seo";
export function generateStaticParams(){return sportsTeams.map(t=>({team:t.id}));}
export async function generateMetadata({params}:{params:Promise<{team:string}>}){const id=(await params).team,team=sportsTeams.find(t=>t.id===id);return team?pageMetadata(`/sports/teams/${id}`,`${team.name} · Team dossier | TerraScope`,team.story):{};}
export default async function TeamPage({params}:{params:Promise<{team:string}>}){
 const id=(await params).team,team=sportsTeams.find(t=>t.id===id);if(!team)notFound();
 return <SportsFrame path="/sports/teams" title={team.name} intro={`${team.kind} · ${team.location}`}><div className="sp-team-dossier"><section><Link className="sp-back" href="/sports/teams">← All teams</Link><div className="sp-dossier-mark">{team.badge?<img src={team.badge} alt={`${team.name} badge`} width="110" height="110"/>:<span className="sp-team-mark">{team.mark}</span>}<FavouriteButton id={`team:${team.id}`} name={team.name}/></div><h2>The story</h2><p>{team.story}</p><h2>Iconic players</h2><div className="sp-inline-links">{team.icons.map(name=>{const p=athletes.find(p=>p.name===name);return p?<Link key={name} href={`/sports/${p.sport}?athlete=${p.id}`}>{name} ↗</Link>:<span key={name}>{name}</span>;})}</div><h2>A rivalry to explore</h2><p>{team.rivalry}. This is an editorial starting point, rather than an exclusive list of rivals.</p><h2>Country connections</h2><div className="sp-inline-links">{team.countryCodes.map(code=>{const c=atlasCountries.find(c=>c.code===code);return c?<Link key={code} href={`/countries/${c.slug}`}>{c.flag} {c.name} ↗</Link>:null;})}</div></section><aside><p className="sp-kicker">Selected historical milestones</p><h2>The honours file</h2><ul>{team.honours.map(h=><li key={h}>{h}</li>)}</ul><p className="sp-small">A selection of dated achievements, not a complete or live trophy count. Reviewed 25 October 2026.</p><h3>Sources</h3>{team.sources.map(s=><a className="sports-source-link" key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}{team.badge&&<p className="sp-small">Badge image: ESPN team identity assets.</p>}<Link className="sports-button" href={`/sports/${team.sport}`}>Explore {team.sport} ↗</Link></aside></div></SportsFrame>;
}
