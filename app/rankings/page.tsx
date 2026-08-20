import RankingsExplorer from "./RankingsExplorer";
import WorldDashboard from "./WorldDashboard";

export default function RankingsPage() {
  return <main className="dashboard-page"><WorldDashboard>
    <div id="all-rankings" className="dashboard-deep-rankings"><section className="ranking-section-title"><p>08 comparative lenses</p><div><h2>Go beyond the overview.</h2><p>Population, economic scale, football, territory and institutional measures—with dates, definitions and sources kept beside the data.</p></div></section><RankingsExplorer/></div>
  </WorldDashboard></main>;
}
