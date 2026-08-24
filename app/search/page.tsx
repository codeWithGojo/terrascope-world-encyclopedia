import {searchCounts,searchRecords} from "../search-data";
import {SiteHeader} from "../components/SiteHeader";
import {SiteFooter} from "../components/SiteFooter";
import SearchExplorer from "./SearchExplorer";

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){
  const {q=""}=await searchParams;
  return <main className="unified-search-page">
    <SiteHeader active="search"/>
    <section className="unified-search-hero"><p>TerraScope unified index · {searchRecords.length} searchable records</p><div><h1>One search.<br/><em>The whole atlas.</em></h1><p>Find all 195 countries, city guides, notable people, football dossiers, national and regional leaders, and selected historical milestones.</p></div><dl><div><dt>Countries</dt><dd>{searchCounts.Country}</dd></div><div><dt>Cities</dt><dd>{searchCounts.City}</dd></div><div><dt>People & football</dt><dd>{searchCounts["Notable person"]+searchCounts.Football}</dd></div><div><dt>Government & history</dt><dd>{searchCounts.Government+searchCounts.History}</dd></div></dl></section>
    <section className="unified-search-body"><SearchExplorer records={searchRecords} initialQuery={q}/></section>
    <SiteFooter/>
  </main>;
}
