import Link from 'next/link';
import {getViewer} from './auth/viewer';
import {atlasCountries,atlasByCode} from './atlas-data';
import {worldPopulation,populationDataset} from './population-data';
import {SiteHeader} from './components/SiteHeader';
import {SiteFooter} from './components/SiteFooter';
import {MovingGlobe} from './components/MovingGlobe';
import {PlanetLaunch} from './components/planet/PlanetLaunch';

const regions=[
 {name:'Africa',image:'/continents/africa.jpg',place:'Okonjima, Namibia',credit:'Nadine Marfurt',copy:'Old landscapes. New perspectives.'},
 {name:'Asia',image:'/continents/asia.jpg',place:'Mount Fuji, Japan',credit:'Sora Sagano',copy:'Follow a different rhythm.'},
 {name:'Europe',image:'/continents/europe.jpg',place:'Alpstein, Switzerland',credit:'Niklas Tidbury',copy:'A story around every corner.'},
 {name:'Americas',image:'/continents/americas.jpg',place:'Patagonia, Chile',credit:'Chris Stenger',copy:'Room to get a little lost.'},
 {name:'Oceania',image:'/continents/oceania.jpg',place:'Great Barrier Reef, Australia',credit:'Joan Li',copy:'Another shade of blue.'},
];
const nearby=[
 {name:'Abuja',slug:'abuja',copy:'Architecture, green spaces and a different pace.'},
 {name:'Port Harcourt',slug:'port-harcourt',copy:'Follow the city into the Niger Delta.'},
 {name:'Asaba',slug:'asaba',copy:'A riverside city with stories to tell.'},
 {name:'Ibadan',slug:'ibadan',copy:'History written into the hills.'},
 {name:'Benin City',slug:'benin-city',copy:'A kingdom’s history, a city’s present.'},
];
export default async function Home({searchParams}:{searchParams:Promise<{city?:string;a?:string;b?:string}>}){
 const {features}=await getViewer();
 const params=await searchParams;
 const openEarth=Boolean(params.city||(params.a&&params.b));
 const nigeria=atlasByCode.get('NG');
 return <main className="home-page atlas-edition">
  <SiteHeader/>
  <section className="travel-cover" aria-labelledby="cover-title">
   <img className="travel-cover-image" src="/continents/americas.jpg" alt="Mountain peaks and open landscapes in Patagonia, Chile" width={1600} height={1000} fetchPriority="high" decoding="async"/>
   <div className="travel-cover-shade"/>
   <div className="travel-cover-copy"><p className="cover-kicker"><span/>An atlas for the curious</p><h1 id="cover-title">A little further.<br/><span>A lot to discover.</span></h1><p>Places worth knowing. Stories worth following.<br className="cover-break"/> Find a corner of the world that stays with you.</p><form className="cover-search" action="/countries"><label className="sr-only" htmlFor="country-search">Search countries and cities</label><span aria-hidden="true">⌕</span><input id="country-search" name="q" placeholder="Where are you curious about?"/><button type="submit">Explore <span aria-hidden="true">↗</span></button></form><div className="cover-popular"><span>Start somewhere</span><Link href="/countries/nigeria">Nigeria</Link><Link href="/countries/japan">Japan</Link><Link href="/countries/egypt">Egypt</Link><Link href="/countries/brazil">Brazil</Link></div></div>
   <div className="cover-location"><span>FIELD NOTES / 01</span><strong>Patagonia, Chile</strong><small>Photo: Chris Stenger / Unsplash</small></div>
   <div className="cover-bottom"><span>195 countries. Countless ways in.</span><a href="#discover">Begin exploring <span aria-hidden="true">↓</span></a></div>
  </section>
  <nav className="travel-quicklinks" aria-label="Choose how to explore"><Link href="/countries"><span className="quicklink-number">01</span><div><strong>Know a place</strong><small>195 country profiles</small></div><span aria-hidden="true">↗</span></Link><Link href="/escape"><span className="quicklink-number">02</span><div><strong>Take a little escape</strong><small>Photo journeys & 360° views</small></div><span aria-hidden="true">↗</span></Link><Link href="/trips"><span className="quicklink-number">03</span><div><strong>Make a real plan</strong><small>Experiences, days & your budget</small></div><span aria-hidden="true">↗</span></Link><Link href="/my-travels"><span className="quicklink-number">04</span><div><strong>Map your travels</strong><small>The places you’ve made yours</small></div><span aria-hidden="true">↗</span></Link></nav>

  <section className="editorial-escapes" id="discover"><div className="atlas-section-head"><div><p className="eyebrow"><span/>A change of scene</p><h2>Somewhere worth<br/>stopping for.</h2></div><div><p>A short escape can be a good place to start. Look around, follow a story, stay a little longer.</p><Link className="atlas-text-link" href="/escape">All virtual escapes <span>↗</span></Link></div></div><div className="escape-editorial-grid">
   <Link href="/escape?scene=giza" className="escape-cover-card"><img src="/travel/All%20Gizah%20Pyramids.jpg" alt="The pyramids of Giza in Egypt" width={900} height={700} loading="lazy" decoding="async"/><span className="photo-tag">Egypt / Guided photo journey</span><div><small>A different sense of scale</small><h3>An afternoon<br/>in ancient Egypt.</h3><span>Follow the journey <b aria-hidden="true">↗</b></span></div></Link>
   <Link href="/escape?scene=jordan-pond" className="escape-story-card"><div className="escape-story-image"><img src="/escape/jordan-pond-preview.jpg" alt="Granite, forest and water near Jordan Pond, Maine" width={700} height={450} loading="lazy" decoding="async"/><span className="photo-tag">United States / 360° panorama</span></div><div><small>Open a window. Take a breath.</small><h3>A quiet mountain morning.</h3><p>A little forest, a little water, and no rush to be anywhere.</p><span>Look around <b aria-hidden="true">↗</b></span></div></Link>
  </div></section>

  <section className="regional-edition" id="continents"><div className="atlas-section-head"><div><p className="eyebrow"><span/>Choose a chapter</p><h2>There’s a whole<br/>world out there.</h2></div><div><p>Browse by region, then follow your curiosity into a country, a city or a story.</p><Link className="atlas-text-link" href="/countries">Browse all countries <span>↗</span></Link></div></div><div className="region-editorial-grid">{regions.map((region,index)=><Link href={`/countries?region=${region.name}`} key={region.name} className={`region-cover region-cover-${index+1}`}><img src={region.image} alt={region.place} width={800} height={600} loading="lazy" decoding="async"/><div className="region-cover-top"><span>0{index+1} / {atlasCountries.filter(country=>country.region===region.name).length} countries</span><b aria-hidden="true">↗</b></div><div className="region-cover-copy"><p>{region.copy}</p><h3>{region.name}</h3><small>{region.place} · {region.credit} / Unsplash</small></div></Link>)}</div></section>

  <section className="nearby-edition"><div className="atlas-section-head"><div><p className="eyebrow"><span/>Start closer to home</p><h2>Nigeria, beyond<br/>the familiar.</h2></div><div><p>Plan a day in a new city, or see a familiar place with fresh eyes. Our city guides give you somewhere to begin.</p><Link className="atlas-text-link" href="/countries/nigeria">Open the Nigeria travel file <span>↗</span></Link></div></div><div className="nearby-city-list">{nearby.map((city,index)=><Link href={`/countries/nigeria/cities/${city.slug}`} className="nearby-city" key={city.slug}><div><img src={`/travel/destinations/nigeria-${city.slug}.webp`} alt={city.name} width={400} height={500} loading="lazy" decoding="async"/><span>0{index+1}</span></div><h3>{city.name} <span aria-hidden="true">↗</span></h3><p>{city.copy}</p></Link>)}</div></section>

  <section className="atlas-map-edition" id="globe-section"><div className="atlas-map-copy"><p className="eyebrow"><span/>Put a place to the name</p><h2>A new perspective<br/>is a drag away.</h2><p>Turn the globe, choose a country, or compare a published data layer. Every place opens into a profile of its own.</p><div className="map-fact"><span>IN FOCUS / NIGERIA</span><strong>{nigeria?.populationLabel}</strong><p>Population · {nigeria?.populationYear} observation</p><Link href="/countries/nigeria">Get to know Nigeria <span>↗</span></Link></div><Link className="atlas-text-link" href="/rankings">See the world in numbers <span>↗</span></Link></div><MovingGlobe/></section>
  <PlanetLaunch access={features} initialOpen={openEarth}/>

  <section className="reference-edition"><div><p className="eyebrow"><span/>A few more paths to follow</p><h2>Curiosity doesn’t<br/>stay in one lane.</h2></div><div className="reference-paths"><Link href="/football-archive/greats"><span>01 / Football</span><h3>The names that live on.</h3><p>Club legends, league greats and the debates that never quite end.</p><b>Open the archive ↗</b></Link><Link href="/compare"><span>02 / Compare</span><h3>See the differences.</h3><p>Two countries, side by side. Keep the sources and context in view.</p><b>Compare countries ↗</b></Link><Link href="/elections"><span>03 / Power</span><h3>What comes next?</h3><p>Follow election dates, current leadership and the institutions behind them.</p><b>Explore the calendar ↗</b></Link></div></section>
  <section className="atlas-data-footer" aria-label="Global statistics"><div><span>World population · {worldPopulation.year}</span><strong>{(worldPopulation.value/1e9).toFixed(2)}<small>billion</small></strong></div><div><span>Country profiles</span><strong>{atlasCountries.length}</strong></div><div><span>Continental chapters</span><strong>05</strong></div><p>Population: World Bank · refreshed {populationDataset.refreshedAt}. Every observation keeps its reporting year.<Link href="/method#data-register">Sources & definitions ↗</Link></p></section>
  <SiteFooter/>
 </main>;
}
