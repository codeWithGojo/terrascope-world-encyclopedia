import {SiteHeader} from "../components/SiteHeader";
import {SiteFooter} from "../components/SiteFooter";
import FootballArchive from "../people/FootballArchive";

export default async function FootballArchivePage({searchParams}:{searchParams:Promise<{q?:string}>}){const {q=""}=await searchParams;return <main className="football-people-page"><SiteHeader active="football"/><FootballArchive initialQuery={q}/><SiteFooter/></main>}
