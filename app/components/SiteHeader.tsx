import Link from "next/link";
export function SiteHeader({active}:{active?:string}) {
  const nav=[{id:"countries",label:"Countries",href:"/countries"},{id:"compare",label:"Compare",href:"/compare"},{id:"rankings",label:"Rankings",href:"/rankings"},{id:"iq",label:"IQ Rankings",href:"/rankings/iq"},{id:"football",label:"Football Archive",href:"/football-archive"},{id:"today",label:"On this day",href:"/on-this-day"},{id:"search",label:"Search",href:"/search"},{id:"method",label:"Method",href:"/method"}];
  return <header className="site-header inner-header"><Link className="brand" href="/"><span className="brand-mark">T</span><span>TerraScope</span></Link><nav className="main-nav" aria-label="Main navigation">{nav.map((item)=><Link className={active===item.id?"active":""} href={item.href} key={item.href}>{item.label}</Link>)}</nav><Link className="nav-action" href="/countries">Explore atlas <span>↗</span></Link></header>;
}
