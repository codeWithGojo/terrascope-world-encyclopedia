import Link from "next/link";
export function SiteHeader({active}:{active?:string}) {
  const nav=[['Countries','/countries'],['Compare','/compare'],['Rankings','/rankings'],['People','/people']];
  return <header className="site-header inner-header"><Link className="brand" href="/"><span className="brand-mark">T</span><span>TerraScope</span></Link><nav className="main-nav" aria-label="Main navigation">{nav.map(([label,href])=><Link className={active===label.toLowerCase()?"active":""} href={href} key={href}>{label}</Link>)}</nav><Link className="nav-action" href="/countries">Explore atlas <span>↗</span></Link></header>;
}
