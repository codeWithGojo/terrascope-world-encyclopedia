import {SiteHeader} from "../components/SiteHeader";
import {SiteFooter} from "../components/SiteFooter";
import RankingsExplorer from "./RankingsExplorer";

export default function RankingsPage() {
  return <main>
    <SiteHeader active="rankings"/>
    <section className="index-hero ranking-intro">
      <p className="eyebrow"><span/>World rankings · 8 live lenses</p>
      <div><h1>The world<br/><em>in context.</em></h1><p>Compare economic scale, population, football power, income pressure, integrity risk and physical size—with the statistic, date and methodology always visible.</p></div>
    </section>
    <section className="ranking-ledger"><div><span>08</span><p>ranking lenses</p></div><div><span>73</span><p>country positions</p></div><div><span>06</span><p>primary data sources</p></div><p>Rankings can illuminate scale, but they can also flatten complex societies. TerraScope pairs every table with a definition and a caution.</p></section>
    <RankingsExplorer/>
    <SiteFooter/>
  </main>;
}
