import Link from "next/link";
import {WorldAtlas} from "./components/WorldAtlas";

const continents = [
  { name: "Africa", count: 54, pop: "1.5B", mark: "AF", size: "continent-hero", location: "Okonjima, Namibia", credit: "Nadine Marfurt", image: "https://images.unsplash.com/photo-1761078206756-68d3023f3021?auto=format&fit=crop&w=1800&q=84", copy: "Ancient landscapes, young cities and more genetic, linguistic and cultural diversity than any summary can contain." },
  { name: "Asia", count: 48, pop: "4.8B", mark: "AS", size: "continent-tall", location: "Mount Fuji, Japan", credit: "Sora Sagano", image: "https://images.unsplash.com/photo-1576077340307-94da37c83f8d?auto=format&fit=crop&w=1500&q=84", copy: "From the steppe to the Pacific: the world’s largest continent and home to almost three in every five people." },
  { name: "Europe", count: 44, pop: "745M", mark: "EU", size: "continent-standard", location: "Alpstein, Switzerland", credit: "Niklas Tidbury", image: "https://images.unsplash.com/photo-1500885034674-0f41c11221f9?auto=format&fit=crop&w=1500&q=84", copy: "A compact continent of peninsulas, mountain corridors, old capitals and closely layered histories." },
  { name: "Americas", count: 35, pop: "1.04B", mark: "AM", size: "continent-wide", location: "Patagonia, Chile", credit: "Chris Stenger", image: "https://images.unsplash.com/photo-1598859409659-b88fc15bbc2f?auto=format&fit=crop&w=1800&q=84", copy: "Two vast landmasses joined by a narrow bridge, stretching from Arctic ice to the mountains of Patagonia." },
  { name: "Oceania", count: 14, pop: "46M", mark: "OC", size: "continent-standard", location: "Great Barrier Reef, Australia", credit: "Joan Li", image: "https://images.unsplash.com/photo-1650754621317-2646d1695edb?auto=format&fit=crop&w=1500&q=84", copy: "A blue continent: island nations, deep ocean cultures and ecosystems found nowhere else on Earth." },
];

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="TerraScope home">
        <span className="brand-mark">T</span><span>TerraScope</span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/countries">Countries</Link><Link href="/compare">Compare</Link><Link href="/rankings">Rankings</Link><Link href="/people">Football Archive</Link>
      </nav>
      <Link className="nav-action" href="/countries">Open the atlas <span>↗</span></Link>
    </header>
  );
}

export default function Home() {
  return (
    <main>
      <Header />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> The living world almanac</p>
          <h1>Every country.<br /><em>One living atlas.</em></h1>
          <p className="hero-intro">Explore the people, places, histories and numbers that shape our planet—carefully organised and made beautifully clear.</p>
          <form className="search-bar" action="/countries">
            <span aria-hidden="true">⌕</span><label className="sr-only" htmlFor="country-search">Search countries and cities</label>
            <input id="country-search" name="q" placeholder="Search a country, capital or region" /><button type="submit">Explore</button>
          </form>
          <p className="search-hint"><b>Popular:</b> Nigeria · Japan · Brazil · France</p>
        </div>
        <WorldAtlas compact />
      </section>

      <section className="global-strip" aria-label="Global statistics">
        <div><small>World population</small><strong>8.2<em>billion</em></strong></div><div><small>Sovereign country profiles</small><strong>195</strong></div>
        <div><small>Living languages</small><strong>7,164</strong></div><div><small>Land area</small><strong>149<em>million km²</em></strong></div>
        <p>Figures are presented as rounded editorial estimates. Every profile includes its source and edition date.</p>
      </section>

      <section className="atlas-principle">
        <div className="principle-lead"><p className="eyebrow"><span /> A different kind of reference</p><h2>Not a list of facts.<br/><em>A portrait of a planet.</em></h2></div>
        <div className="principle-copy"><p>TerraScope connects statistics to the places and people behind them. Every profile is designed to answer three questions at once: <b>where is it, how does it work, and what makes it unforgettable?</b></p><Link href="/countries">Enter the country index <span>→</span></Link></div>
        <div className="lens-grid">
          <article><span>01</span><h3>Place</h3><p>Land, climate, cities, borders and the physical forces that shape daily life.</p></article>
          <article><span>02</span><h3>Power</h3><p>Presidents, institutions, economies and the systems organising each nation.</p></article>
          <article><span>03</span><h3>People</h3><p>Languages, culture and the remarkable lives through which countries travel.</p></article>
        </div>
      </section>

      <section className="discovery" id="explore">
        <div className="section-heading"><div><p className="eyebrow"><span /> Start exploring</p><h2>A world worth<br /><em>knowing.</em></h2></div><p>Begin with today’s featured nation, browse by continent, or follow the trail of a remarkable person.</p></div>
        <div className="feature-grid">
          <article className="country-feature">
            <div className="feature-topline"><span>Country of the day</span><b>01 / 195</b></div><div className="flag nigeria" aria-label="Flag of Nigeria"><i /></div>
            <div className="country-title"><div><small>Federal Republic of</small><h3>Nigeria</h3></div><span className="country-code">NG</span></div>
            <p>A nation of more than 250 ethnic groups, where ancient kingdoms, global music and Africa’s largest city meet.</p>
            <dl><div><dt>Capital</dt><dd>Abuja</dd></div><div><dt>Population</dt><dd>≈ 237.5M</dd></div><div><dt>Languages</dt><dd>English + 500</dd></div></dl>
            <Link className="text-link" href="/countries/nigeria">Discover Nigeria <b>→</b></Link>
          </article>
          <div className="editorial-column" id="journal">
            <article className="daily-fact"><span className="issue">Field note · 013</span><p className="quote-mark">“</p><h3>The Pacific Ocean is wider than the Moon.</h3><p>At its broadest, the Pacific spans roughly 19,000 km—more than five times the Moon’s diameter.</p><span className="field-link">Read the field note →</span></article>
            <Link className="person-card" href="/people"><div className="portrait monogram">CN</div><div><small>People who shaped the world</small><h3>Chimamanda<br />Ngozi Adichie</h3><p>Writer · Nigeria</p></div><span>↗</span></Link>
          </div>
        </div>
      </section>

      <section className="continents" id="continents">
        <div className="section-heading compact"><div><p className="eyebrow"><span /> The continental chapters</p><h2>Five regions.<br /><em>Endless worlds.</em></h2></div><p>These photographs are visual gateways—not definitions. Open a chapter to explore the countries, environments and histories within it.</p></div>
        <div className="continent-gallery">
          {continents.map((continent, index) => <Link href={`/countries?region=${continent.name}`} className={`continent-photo ${continent.size}`} key={continent.name} style={{backgroundImage:`linear-gradient(180deg,rgba(10,26,21,.04),rgba(10,26,21,.84)),url(${continent.image})`}}>
            <div className="continent-photo-top"><span>0{index + 1} · {continent.mark}</span><small>{continent.location}<br/>Photo: {continent.credit} / Unsplash</small></div>
            <div className="continent-photo-copy"><p>{continent.copy}</p><div><h3>{continent.name}</h3><span>{continent.count} countries · {continent.pop} people</span></div><i>Explore chapter ↗</i></div>
          </Link>)}
        </div>
      </section>

      <section className="world-threads">
        <div className="threads-heading"><p className="eyebrow"><span/> See the connections</p><h2>The world does not<br/><em>stop at borders.</em></h2></div>
        <div className="thread-list">
          <Link href="/compare"><span>01 · Compare</span><h3>What changes when two countries sit side by side?</h3><p>Compare scale, population, health, economies and systems without losing the human context.</p><b>Open comparison →</b></Link>
          <Link href="/people"><span>02 · People</span><h3>Meet the lives that carried ideas around the world.</h3><p>Writers, leaders, artists, scientists and athletes connected back to the places that shaped them.</p><b>Browse notable people →</b></Link>
          <Link href="/rankings"><span>03 · Scale</span><h3>Make the planet’s biggest differences visible.</h3><p>Rankings turn abstract numbers into clear relationships—from population to land area.</p><b>View world rankings →</b></Link>
        </div>
      </section>

      <section className="atlas-cta"><small>TerraScope · Digital World Encyclopaedia</small><h2>Start with somewhere<br/>you <em>think</em> you know.</h2><div><Link href="/countries/nigeria">Discover Nigeria <span>↗</span></Link><Link href="/countries">Browse all profiles <span>→</span></Link></div></section>

      <footer><div><span className="brand-mark light">T</span><h2>Go somewhere<br />you’ve never been.</h2></div><p>TerraScope is an independent digital atlas designed to make our complicated world easier—and more delightful—to understand.</p><div className="footer-bottom"><span>© 2026 TerraScope</span><span>Sources · Methodology · About</span><span>Lagos · WAT</span></div></footer>
    </main>
  );
}
