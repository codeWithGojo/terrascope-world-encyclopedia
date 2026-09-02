import RankingsExplorer from "./RankingsExplorer";
import WorldDashboard from "./WorldDashboard";
import Link from "next/link";

export default function RankingsPage() {
  return <main><WorldDashboard>
    <div id="all-rankings" className="rankings-deep"><section className="ranking-section-title"><p>10 comparative lenses</p><div><h2>Go beyond the overview.</h2><p>Population, economic scale, football, territory, tourism and education-context measures—with dates, definitions and sources kept beside the data.</p></div></section><div className="ranking-feature-routes"><Link href="/rankings/iq"><small>Education-context dataset</small><b>World IQ rankings</b><span>Sortable reported test averages with the methodology warning kept visible. ↗</span></Link><Link href="/rankings/most-visited"><small>Travel data</small><b>Most-visited places</b><span>International arrivals plus direct links into country travel files. ↗</span></Link></div><RankingsExplorer/></div>
  </WorldDashboard></main>;
}
