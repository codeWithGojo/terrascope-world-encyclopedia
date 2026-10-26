import Link from 'next/link';
import {SiteHeader} from '../components/SiteHeader';
import SpaceExplorer from './SpaceExplorer';
import data from './planets.json';
import './space.css';
export const metadata={title:'Solar system | TerraScope',description:'Explore eight planets, compare worlds and discover our solar system.'};
export default function SpacePage(){return <main className="space-page"><SiteHeader active="space"/><div className="space-intro"><p className="space-kicker">TERRASCOPE / THE SOLAR SYSTEM</p><h1>A little further<br/>from home.</h1><p>Eight worlds. One star. Choose a planet and get closer.</p></div><SpaceExplorer/><section className="space-catalog"><h2>Choose your next world</h2>{data.planets.map(p=><Link key={p.slug} href={`/planets/${p.slug}`}><span style={{background:p.color}}/>{p.name}<small>{p.kind} · {p.distanceMillionKm.toLocaleString()} million km</small><b>Explore →</b></Link>)}</section></main>}
