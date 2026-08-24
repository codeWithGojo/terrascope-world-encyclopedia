import {SiteHeader} from "../../components/SiteHeader";
import {SiteFooter} from "../../components/SiteFooter";
import {atlasByCode} from "../../atlas-data";
import {mostVisitedCountries} from "../../country-content";
import MostVisitedTable from "./MostVisitedTable";

export default function MostVisitedPage() {
  const rows = mostVisitedCountries.flatMap((item,index) => {const country=atlasByCode.get(item.code);return country?[{...item,rank:index+1,flag:country.flag,slug:country.slug}]:[];});
  return <main className="dataset-page tourism-page"><SiteHeader active="rankings"/><section className="dataset-hero"><div><p>TerraScope rankings · travel</p><h1>Most-visited<br/><em>places.</em></h1></div><div><b>1.45B</b><span>international tourist arrivals worldwide in 2024</span></div></section><section className="dataset-intro"><p>A periodically updated snapshot of international overnight arrivals—not domestic trips, airport transfers or tourism quality.</p><div><small>Reporting period</small><b>2024 · arrivals in millions</b></div></section><MostVisitedTable rows={rows}/><section className="method-warning"><span>Source & scope</span><p>Country totals follow UN Tourism’s World Tourism Barometer reporting as compiled in the 2024 destination table. National methods can differ, and visitor volume should not be read as a sustainability score.</p><div><a href="https://www.unwto.org/un-tourism-world-tourism-barometer-data" target="_blank" rel="noreferrer">UN Tourism data ↗</a></div></section><SiteFooter/></main>;
}
