import {SiteHeader} from "../components/SiteHeader";
import {SiteFooter} from "../components/SiteFooter";
import {WorldAtlas} from "../components/WorldAtlas";
import CountriesExplorer from "./CountriesExplorer";

export default async function CountriesPage({searchParams}:{searchParams:Promise<{q?:string;region?:string}>}) {
  const {q, region} = await searchParams;
  return <main>
    <SiteHeader active="countries"/>
    <section className="index-hero">
      <p className="eyebrow"><span/>The complete country index · A—Z</p>
      <div><h1>Explore the<br/><em>world.</em></h1><p>Select a continent on the real political map, browse every sovereign country in that region, then open a detailed profile.</p></div>
    </section>
    <section className="atlas-index-map"><WorldAtlas initialRegion={region ?? "All"} /></section>
    <section className="explorer-section"><CountriesExplorer initialQuery={q ?? ""} initialRegion={region ?? "All"}/></section>
    <SiteFooter/>
  </main>;
}
