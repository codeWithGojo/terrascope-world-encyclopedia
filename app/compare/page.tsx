import {pageMetadata} from "../seo";
export const metadata=pageMetadata("/compare",'Compare countries | TerraScope','Compare two countries with dated population, area, economic indicators and clear source context.');
import {SiteHeader} from "../components/SiteHeader";import {SiteFooter} from "../components/SiteFooter";import CompareTool from "./CompareTool";
import {getViewer} from "../auth/viewer";
import {ProGate} from "../components/ProGate";
export const dynamic="force-dynamic";
export default async function ComparePage(){const {features}=await getViewer();return <main><SiteHeader active="compare"/><section className="index-hero compare-intro"><p className="eyebrow"><span/>Country comparison</p><div><h1>Side by<br/><em>side.</em></h1><p>Put two nations together and see the scale, systems and everyday figures that make each one distinct.</p></div></section><section className="compare-section">{features.compare?<CompareTool/>:<ProGate title="A closer look, side by side."><div className="pro-preview"><b>Nigeria ↔ Japan</b><p>Compare population, area, dated World Bank indicators and everyday country facts in one view.</p></div></ProGate>}</section><SiteFooter/></main>}
