import {atlasCountries,atlasByCode} from "./atlas-data";
import {worldPopulation,populationDataset} from "./population-data";
import Link from "next/link";
import {LazyAtlas} from "./components/LazyAtlas";
import {SiteHeader} from "./components/SiteHeader";
import {MovingGlobe} from "./components/MovingGlobe";
import {SiteFooter} from "./components/SiteFooter";

const continents = [
  { name: "Africa", mark: "AF", size: "continent-hero", location: "Okonjima, Namibia", credit: "Nadine Marfurt", image: "/continents/africa.jpg", copy: "Ancient landscapes, young cities and more genetic, linguistic and cultural diversity than any summary can contain." },
  { name: "Asia", mark: "AS", size: "continent-tall", location: "Mount Fuji, Japan", credit: "Sora Sagano", image: "/continents/asia.jpg", copy: "From the steppe to the Pacific: the world’s largest continent and home to almost three in every five people." },
  { name: "Europe", mark: "EU", size: "continent-standard", location: "Alpstein, Switzerland", credit: "Niklas Tidbury", image: "/continents/europe.jpg", copy: "A compact continent of peninsulas, mountain corridors, old capitals and closely layered histories." },
  { name: "Americas", mark: "AM", size: "continent-wide", location: "Patagonia, Chile", credit: "Chris Stenger", image: "/continents/americas.jpg", copy: "Two vast landmasses joined by a narrow bridge, stretching from Arctic ice to the mountains of Patagonia." },
  { name: "Oceania", mark: "OC", size: "continent-standard", location: "Great Barrier Reef, Australia", credit: "Joan Li", image: "/continents/oceania.jpg", copy: "A blue continent: island nations, deep ocean cultures and ecosystems found nowhere else on Earth." },
];

export default function Home() {
  return (
    <main className="home-page">
      <SiteHeader />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> An atlas for the curious</p>
          <h1>There’s a whole<br /><em>world out there.</em></h1>
          <p className="hero-intro">Step into a new landscape. Find the story behind a place. Get lost in football history. A small escape can start right here.</p>
          <div className="hero-actions"><Link href="/escape" className="ts-button">Take me somewhere <span>↗</span></Link><Link href="/countries">Explore 195 countries →</Link></div>
          <form className="search-bar" action="/countries">
            <span aria-hidden="true">⌕</span><label className="sr-only" htmlFor="country-search">Search countries and cities</label>
            <input id="country-search" name="q" placeholder="Where are you curious about?" /><button type="submit">Find it</button>
          </form>
          <p className="search-hint"><b>Popular:</b> Nigeria · Japan · Brazil · France</p>
        </div>
        <MovingGlobe />
      </section>

      <section className="home-experience-links" aria-label="Ways to explore"><Link href="/escape"><span>01 / Escape</span><b>A change of scene.</b><small>Free 360° views & photo journeys ↗</small></Link><Link href="/countries"><span>02 / Discover</span><b>A world worth knowing.</b><small>Countries, people & historic places ↗</small></Link><Link href="/football-archive/greats"><span>03 / Debate</span><b>The names that live on.</b><small>Club legends, league greats & the GOAT list ↗</small></Link></section>

      <section className="home-escape-section"><div className="section-heading"><div><p className="eyebrow"><span/>A moment somewhere new</p><h2>Your next escape<br/><em>costs nothing.</em></h2></div><p>Turn around a mountain landscape, pause beside the Nile, or follow a city through real photographs. Pick a place and take your time.</p></div><div className="home-escape-grid"><Link href="/escape?scene=giza" className="home-escape-large" style={{backgroundImage:"url('/travel/All%20Gizah%20Pyramids.jpg')"}}><span>Egypt · Guided photo journey</span><div><small>History, on a different scale</small><h3>An afternoon<br/>in ancient Egypt.</h3><b>Start the journey ↗</b></div></Link><Link href="/escape?scene=jordan-pond" className="home-escape-small"><img src="/escape/jordan-pond-preview.jpg" alt="Granite, forest and water near Jordan Pond, Maine" loading="lazy"/><div><span>United States · 360° panorama</span><h3>A quiet mountain morning.</h3><p>Look around. Breathe a little slower. ↗</p></div></Link></div></section>

      <section className="global-strip" aria-label="Global statistics">
        <div><small>World population · {worldPopulation.year}</small><strong>{(worldPopulation.value/1e9).toFixed(2)}<em>billion</em></strong></div><div><small>Sovereign country profiles</small><strong>195</strong></div>
        <div><small>Languages in atlas register</small><strong>{new Set(atlasCountries.flatMap(c=>c.languages)).size}</strong></div><div><small>Total indexed country area</small><strong>{(atlasCountries.reduce((sum,c)=>sum+c.area,0)/1e6).toFixed(1)}<em>million km²</em></strong></div>
        <p>Population source: World Bank · refreshed {populationDataset.refreshedAt}. Country observations retain their reporting years. <Link href="/method#data-register">Sources & definitions ↗</Link></p>
      </section>

      <section className="atlas-principle">
        <div className="principle-lead"><p className="eyebrow"><span /> A different kind of reference</p><h2>Know a place<br/><em>before you go.</em></h2></div>
        <div className="principle-copy"><p>Country profiles bring together geography, city guides, people and published statistics. Use them to get your bearings, then open the trip planner to work out what fits your visit.</p><Link href="/countries">Enter the country index <span>→</span></Link></div>
        <div className="lens-grid">
          <article><span>01</span><h3>Place</h3><p>Land, climate, cities, borders and the physical forces that shape daily life.</p></article>
          <article><span>02</span><h3>Power</h3><p>Presidents, institutions, economies and the systems organising each nation.</p></article>
          <article><span>03</span><h3>Football</h3><p>More than 50 player dossiers connecting modern stars and legends to their nations.</p></article>
        </div>
      </section>

      <section className="home-map-section"><div className="section-heading"><div><p className="eyebrow"><span/>Your next rabbit hole</p><h2>Put a place<br/><em>to the name.</em></h2></div><p>Touch a country on the map, search for a capital, or choose a continent. Every profile has a different story waiting.</p></div><LazyAtlas/></section>

      <section className="discovery" id="explore">
        <div className="section-heading"><div><p className="eyebrow"><span /> Start exploring</p><h2>Start with<br /><em>Nigeria.</em></h2></div><p>Begin with today’s featured nation, browse by continent, or follow the trail of a remarkable person.</p></div>
        <div className="feature-grid">
          <article className="country-feature">
            <div className="feature-topline"><span>Country of the day</span><b>01 / 195</b></div><div className="flag nigeria" aria-label="Flag of Nigeria"><i /></div>
            <div className="country-title"><div><small>Federal Republic of</small><h3>Nigeria</h3></div><span className="country-code">NG</span></div>
            <p>A nation of more than 250 ethnic groups, where ancient kingdoms, global music and Africa’s largest city meet.</p>
            <dl><div><dt>Capital</dt><dd>Abuja</dd></div><div><dt>Population</dt><dd>{atlasByCode.get("NG")?.populationLabel} · {atlasByCode.get("NG")?.populationYear}</dd></div><div><dt>Languages</dt><dd>English + 500</dd></div></dl>
            <Link className="text-link" href="/countries/nigeria">Discover Nigeria <b>→</b></Link>
          </article>
          <div className="editorial-column" id="journal">
            <article className="daily-fact"><span className="issue">Field note · 013</span><p className="quote-mark">“</p><h3>The Pacific Ocean is wider than the Moon.</h3><p>At its broadest, the Pacific spans roughly 19,000 km—more than five times the Moon’s diameter.</p><Link className="field-link" href="/countries">Explore country profiles →</Link></article>
            <Link className="person-card" href="/football-archive"><div className="portrait monogram">BS</div><div><small>Inside the football archive</small><h3>Bukayo<br />Saka</h3><p>Forward · England</p></div><span>↗</span></Link>
          </div>
        </div>
      </section>

      <section className="continents" id="continents">
        <div className="section-heading compact"><div><p className="eyebrow"><span /> The continental chapters</p><h2>Browse<br /><em>by region.</em></h2></div><p>These photographs are visual gateways—not definitions. Open a chapter to explore the countries, environments and histories within it.</p></div>
        <div className="continent-gallery">
          {continents.map((continent, index) => <Link href={`/countries?region=${continent.name}`} className={`continent-photo ${continent.size}`} key={continent.name} style={{backgroundImage:`linear-gradient(180deg,rgba(10,26,21,.04),rgba(10,26,21,.84)),url(${continent.image})`}}>
            <div className="continent-photo-top"><span>0{index + 1} · {continent.mark}</span><small>{continent.location}<br/>Photo: {continent.credit} / Unsplash</small></div>
            <div className="continent-photo-copy"><p>{continent.copy}</p><div><h3>{continent.name}</h3><span>{atlasCountries.filter(c=>c.region===continent.name).length} countries · {(()=>{const total=atlasCountries.filter(c=>c.region===continent.name).reduce((sum,c)=>sum+c.population,0);return total>=1e9?`${(total/1e9).toFixed(2)}B`:`${(total/1e6).toFixed(0)}M`;})()} people · mixed observation years</span></div><i>Explore chapter ↗</i></div>
          </Link>)}
        </div>
      </section>

      <section className="world-threads">
        <div className="threads-heading"><p className="eyebrow"><span/> See the connections</p><h2>Compare places.<br/><em>Follow a different interest.</em></h2></div>
        <div className="thread-list">
          <Link href="/compare"><span>01 · Compare</span><h3>What changes when two countries sit side by side?</h3><p>Compare scale, population, health, economies and systems without losing the human context.</p><b>Open comparison →</b></Link>
          <Link href="/football-archive"><span>02 · Football archive</span><h3>Compare the players who changed the game.</h3><p>Open detailed career dossiers for legends and current stars, then shortlist two players side by side.</p><b>Browse football archive →</b></Link>
          <Link href="/rankings"><span>03 · Scale</span><h3>Make the planet’s biggest differences visible.</h3><p>Rankings turn abstract numbers into clear relationships—from population to total area.</p><b>View world rankings →</b></Link>
        </div>
      </section>

      <section className="atlas-cta"><small>TerraScope · Digital World Encyclopaedia</small><h2>Where would you like to go?</h2><div><Link href="/countries/nigeria">Discover Nigeria <span>↗</span></Link><Link href="/countries">Browse all profiles <span>→</span></Link></div></section>

      <SiteFooter/>
    </main>
  );
}
