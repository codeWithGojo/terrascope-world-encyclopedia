import Link from "next/link";
import {notFound} from "next/navigation";
import {atlasBySlug,atlasCountries,regionColours} from "../../../atlas-data";
import {governmentAsOfLabel,regionalGovernmentByCode,tenureLabel} from "../../../government-data";
import {SiteHeader} from "../../../components/SiteHeader";
import {SiteFooter} from "../../../components/SiteFooter";
import RegionalGovernmentExplorer from "./RegionalGovernmentExplorer";

export function generateStaticParams(){return atlasCountries.map((country)=>({slug:country.slug}));}

export default async function RegionalGovernmentPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const country=atlasBySlug.get(slug);
  if(!country)notFound();
  const regional=regionalGovernmentByCode[country.code];
  const colour=country.editorial?.color??regionColours[country.region];
  const rows=regional?.units.map((unit)=>({...unit,startLabel:new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(`${unit.startDate}T00:00:00Z`)),tenure:tenureLabel(unit.startDate)}))??[];
  return <main className="regional-government-page" style={{"--country":colour} as React.CSSProperties}>
    <SiteHeader active="countries"/>
    <section className="regional-government-hero"><div className="profile-breadcrumb"><Link href="/countries">195 countries</Link><span>→</span><Link href={`/countries/${country.slug}`}>{country.name}</Link><span>→</span><b>Regional government</b></div><div><div><p>TerraScope government archive · checked {governmentAsOfLabel}</p><h1>{country.name}<br/><em>regional government.</em></h1></div><span>{country.flag}</span></div>{regional?<p>{regional.note}</p>:<p>The interface is ready, but this country’s complete regional leadership dataset has not yet passed the all-offices-at-once source review.</p>}</section>
    <section className="regional-government-body">
      {regional?<><header><div><small>{regional.unitLabel}</small><strong>{regional.units.length}</strong></div><div><small>{regional.leaderLabel}</small><strong>Complete current directory</strong></div><div><small>Edition</small><strong>{governmentAsOfLabel}</strong></div></header><RegionalGovernmentExplorer rows={rows} unitLabel={regional.unitLabel} leaderLabel={regional.leaderLabel} source={regional.source}/></>:<div className="regional-dataset-empty"><span>{country.code}</span><div><small>Data not yet available</small><h2>{country.name} is in the regional-data queue.</h2><p>TerraScope scopes this work country by country so governors, premiers, chief ministers and territorial administrators are not mixed into an unreliable global list.</p><Link href={`/countries/${country.slug}#government`}>Return to the national government record →</Link></div></div>}
    </section>
    <SiteFooter/>
  </main>;
}
