import type {Metadata} from "next";
import Link from "next/link";
import {SiteHeader} from "../../components/SiteHeader";
import {SiteFooter} from "../../components/SiteFooter";
import GreatsExplorer from "./GreatsExplorer";
export const metadata:Metadata={title:"Club icons, league greats & the GOAT list | TerraScope",description:"All-time football lists for 36 major clubs across England, France, Germany, Spain, Italy and Nigeria. Explore the league greats and make your own top five."};
export default function GreatsPage(){return <main className="greats-page"><SiteHeader active="football"/><section className="edition-hero"><p className="eyebrow"><span/>The football archive / All-time edition</p><h1>The game moves on.<br/><em>Some names stay.</em></h1><p>From Enugu to Madrid. Club icons, league greats and the names at the heart of football's longest-running argument. Read our picks, then make your own.</p><div className="edition-meta"><span>36 clubs · 6 countries</span><span>Men's football · editorial selections</span><Link href="/football-archive">Open player dossiers ↗</Link></div></section><GreatsExplorer/><SiteFooter/></main>}
