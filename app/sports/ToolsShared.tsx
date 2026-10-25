import Link from "next/link";
import {SiteHeader} from "../components/SiteHeader";
import {SiteFooter} from "../components/SiteFooter";
import {sportsTools} from "./catalog";
import "./sports.css";
import "./tools.css";
export function SportsToolsNav({active}:{active?:string}){
 return <nav className="sp-tools-nav" aria-label="Sports tools"><Link href="/sports">Sports home</Link>{sportsTools.map(t=><Link key={t.href} href={t.href} aria-current={active===t.href?"page":undefined}>{t.name}</Link>)}</nav>;
}
export function SportsFrame({title,intro,path,children}:{title:string;intro:string;path:string;children:React.ReactNode}){
 return <main className="sports-page"><SiteHeader active="sports"/><div className="sports-shell sp-tool-shell"><SportsToolsNav active={path}/><header className="sp-title"><p className="eyebrow">TerraScope / Sports</p><h1>{title}</h1><p>{intro}</p></header>{children}</div><SiteFooter/></main>;
}
export function SportsToolbox(){
 return <section className="sp-toolbox" aria-labelledby="sports-toolbox-title"><div className="sports-section-heading"><div><p className="eyebrow">More ways into the game</p><h2 id="sports-toolbox-title">Explore. Compare. Play.</h2></div><p>Follow a team, test your knowledge or find your next match.</p></div><div className="sp-tool-links">{sportsTools.map(t=><Link key={t.href} href={t.href}><span>{t.mark}</span><div><h3>{t.name} ↗</h3><p>{t.description}</p></div></Link>)}</div></section>;
}
