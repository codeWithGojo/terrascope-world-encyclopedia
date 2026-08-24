import {SiteHeader} from "../../components/SiteHeader";
import {SiteFooter} from "../../components/SiteFooter";
import {atlasByCode} from "../../atlas-data";
import {iqDataset,iqRankings} from "../../iq-data";
import IqRankingsTable from "./IqRankingsTable";

export default function IqRankingsPage() {
  const rows = iqRankings.flatMap((item,index) => {
    const country = atlasByCode.get(item.code);
    return country ? [{...item,rank:index + 1,flag:country.flag,slug:country.slug}] : [];
  });
  return <main className="dataset-page"><SiteHeader active="iq"/><section className="dataset-hero"><div><p>TerraScope rankings · education context</p><h1>World IQ<br/><em>rankings.</em></h1></div><div><b>{rows.length}</b><span>countries in this reported online-test dataset</span></div></section><section className="dataset-intro"><p>National IQ tables are widely searched and frequently misunderstood. TerraScope shows the published figures while keeping their sampling and cultural limitations visible.</p><div><small>Dataset</small><b>{iqDataset.title} · {iqDataset.year}</b></div></section><IqRankingsTable rows={rows}/><section className="method-warning"><span>Read before comparing</span><p>{iqDataset.note}</p><div><a href={iqDataset.sourceUrl} target="_blank" rel="noreferrer">Source table ↗</a><a href={iqDataset.methodologyUrl} target="_blank" rel="noreferrer">Original methodology ↗</a></div></section><SiteFooter/></main>;
}
