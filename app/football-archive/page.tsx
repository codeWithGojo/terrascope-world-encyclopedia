import {SiteHeader} from "../components/SiteHeader";
import {SiteFooter} from "../components/SiteFooter";
import FootballArchive from "../people/FootballArchive";
import Link from "next/link";

export default function FootballArchivePage(){return <main className="football-people-page"><SiteHeader active="football"/><Link className="football-greats-banner" href="/football-archive/greats"><span>NEW / THE ALL-TIME EDITION</span><b>Club icons. League greats. The GOAT debate.</b><small>30 clubs · 5 leagues · make your own top five ↗</small></Link><FootballArchive/><SiteFooter/></main>}
