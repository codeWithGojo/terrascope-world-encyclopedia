import Link from "next/link";
import {ArrowUpRight} from "./ArrowUpRight";
const groups = [
 {title:"Explore",links:[["Country atlas","/countries"],["Virtual escapes","/escape"],["Sports stories","/sports"],["The solar system","/space"]]},
 {title:"Make a plan",links:[["Destination matcher","/travel#matcher"],["Passport explorer","/travel#passport"],["Trip planner","/trips"],["My travels","/my-travels"]]},
 {title:"Look closer",links:[["Compare countries","/compare"],["World rankings","/rankings"],["Election calendar","/elections"],["Sources & methodology","/method#data-register"]]},
];
export function SiteFooter(){return <footer className="inner-footer atlas-closing"><div className="atlas-closing-top"><div><img className="brand-logo footer-brand-logo" src="/brand/terrascope-mark.webp" alt="TerraScope" width={56} height={56} loading="lazy" decoding="async"/><h2>Stay curious.<br/>Go a little further.</h2><p>Country stories, free escapes and a world worth understanding. Built with curiosity, from Nigeria.</p></div><Link className="atlas-closing-cta" href="/countries"><span>Pick a place.<br/>See where it takes you.</span><ArrowUpRight/></Link></div><div className="atlas-closing-groups">{groups.map(group=><nav key={group.title} aria-label={`Footer: ${group.title}`}><h3>{group.title}</h3>{group.links.map(([label,href])=><Link href={href} key={href}>{label}<ArrowUpRight/></Link>)}</nav>)}</div><div className="footer-bottom"><span>© 2026 TerraScope</span><span>Each dataset carries its own source and review date.</span><span>Lagos · WAT</span></div></footer>}
