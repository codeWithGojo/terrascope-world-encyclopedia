import {discoverySources} from "../../../../discovery-guides";
import {funFor} from "../../../../fun-activities";
import Link from "next/link";
import {notFound} from "next/navigation";
import {
  cityGuideByPath,
  cityGuideExtrasByPath,
  cityGuides,
} from "../../../../country-content";
import {SiteHeader} from "../../../../components/SiteHeader";
import {SiteFooter} from "../../../../components/SiteFooter";

export function generateStaticParams() {
  return cityGuides.map((guide) => ({
    slug: guide.countrySlug,
    city: guide.citySlug,
  }));
}

export default async function CityGuidePage({
  params,
}: {
  params: Promise<{slug: string; city: string}>;
}) {
  const {slug, city} = await params;
  const path = `${slug}/${city}`;
  const guide = cityGuideByPath.get(path);
  const extra = cityGuideExtrasByPath[path];

  if (!guide || !extra) notFound();

  return (
    <main className="city-guide-page">
      <SiteHeader active="countries" />

      <section className="city-guide-hero">
        <div className="profile-breadcrumb">
          <Link href={`/countries/${guide.countrySlug}`}>{guide.country}</Link>
          <span>→</span>
          <b>{guide.name}</b>
        </div>
        <p>TerraScope city guide · planning edition</p>
        <h1>{guide.name}</h1>
        <blockquote>{guide.overview}</blockquote>
        <div>
          <span>
            <small>Best time to visit</small>
            <b>{guide.bestTime}</b>
          </span>
          <span>
            <small>Main air gateway</small>
            <b>{extra.gateway}</b>
          </span>
        </div>
      </section>

      <p className="trip-country-action"><Link href={`/trips?destination=${encodeURIComponent(guide.country)}&city=${encodeURIComponent(guide.name)}`}>Plan a trip to {guide.name}</Link></p>
      <section className="city-guide-body">
        <aside>
          <b>Plan the city</b>
          <a href="#neighbourhoods">Where to stay</a>
          <a href="#see">What to see</a>
          <a href="#itinerary">Three-day plan</a>
          <a href="#fun">Fun & group outings</a><a href="#food">What to eat</a>
          <a href="#day-trips">Day trips</a>
          <a href="#move">Getting around</a>
          <a href="#local-tips">Local tips</a>
          {guide.gallery.length>0&&<a href="#gallery">Photo gallery</a>}
        </aside>

        <div>
          <section id="neighbourhoods" className="city-guide-section">
            <p className="eyebrow"><span />Choose a base</p>
            <h2>Neighbourhoods<br /><em>to know.</em></h2>
            <div className="city-guide-neighbourhoods">
              {extra.neighbourhoods.map((neighbourhood, index) => (
                <article key={neighbourhood.name}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{neighbourhood.name}</h3>
                  <p>{neighbourhood.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="see" className="city-guide-section">
            <p className="eyebrow"><span />Start here</p>
            <h2>Top<br /><em>attractions.</em></h2>
            <div className="attraction-list">
              {guide.attractions.map((place, index) => (
                <div key={place}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{place}</b>
                </div>
              ))}
            </div>
          </section>

          <section id="itinerary" className="city-guide-section">
            <p className="eyebrow"><span />A workable pace</p>
            <h2>Three-day<br /><em>itinerary.</em></h2>
            <div className="city-itinerary">
              {extra.itinerary.map((item) => (
                <article key={item.day}>
                  <small>{item.day}</small>
                  <h3>{item.title}</h3>
                  <p>{item.plan}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="fun" className="city-guide-section"><p className="eyebrow"><span/>Dates · groups · a day off</p><h2>Make time<br/><em>for fun.</em></h2><p className="source-note">These are outing ideas, not a claim that every activity operates in {guide.name}. Provider references are marked where checked; confirm the venue, access, date and quote.</p><div className="city-fun-grid">{funFor(guide.country,guide.name).map(activity=><article key={activity.name}><small>{activity.setting} · {activity.group}</small><h3>{activity.name}</h3><p>{activity.note}</p>{activity.sourceUrl?<a href={activity.sourceUrl} target="_blank" rel="noreferrer">{activity.provider} · checked {activity.checkedAt} ↗</a>:<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.name+" "+guide.name+" "+guide.country)}`} target="_blank" rel="noreferrer">Find a local venue ↗</a>}</article>)}</div><p className="trip-country-action"><Link href={`/trips?destination=${encodeURIComponent(guide.country)}&city=${encodeURIComponent(guide.name)}`}>Pick fun activities for my budget →</Link></p></section>

          <section id="food" className="city-guide-section">
            <p className="eyebrow"><span />Taste the city</p>
            <h2>Food &<br /><em>specialities.</em></h2>
            <div className="food-chips">
              {guide.food.map((food) => <span key={food}>{food}</span>)}
            </div>
          </section>

          <section id="day-trips" className="city-guide-section">
            <p className="eyebrow"><span />Beyond the centre</p>
            <h2>Day trips &<br /><em>extensions.</em></h2>
            <div className="city-day-trips">
              {extra.dayTrips.map((trip) => (
                <article key={trip.name}>
                  <h3>{trip.name}</h3>
                  <p>{trip.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="city-advice-grid">
            <article id="move">
              <small>Getting around</small>
              <h3>Move with context.</h3>
              <p>{guide.gettingAround}</p>
            </article>
            <article id="safety">
              <small>Safety & culture</small>
              <h3>Know before you go.</h3>
              <p>{guide.safety}</p>
            </article>
          </section>

          <section id="local-tips" className="city-guide-section">
            <p className="eyebrow"><span />Practical etiquette</p>
            <h2>Local<br /><em>tips.</em></h2>
            <ol className="city-culture-list">
              {extra.cultureTips.map((tip, index) => (
                <li key={tip}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{tip}</p>
                </li>
              ))}
            </ol>
          </section>

          {guide.gallery.length>0&&<section id="gallery" className="city-guide-section">
            <p className="eyebrow"><span />Open-image archive</p>
            <h2>City<br /><em>gallery.</em></h2>
            <div className="city-gallery">
              {guide.gallery.map((photo) => (
                <figure key={photo.url}>
                  <img src={photo.url} alt={photo.alt} />
                  <figcaption>
                    <b>{photo.alt}</b>
                    <a href={photo.url.startsWith("/travel/")?`https://commons.wikimedia.org/wiki/File:${photo.url.slice("/travel/".length)}`:photo.url} target="_blank" rel="noreferrer">{photo.credit} ↗</a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>}

          {discoverySources[path]&&<p className="source-note">Heritage reference: <a href={discoverySources[path].url} target="_blank" rel="noreferrer">{discoverySources[path].label} ↗</a> · checked {discoverySources[path].checkedAt}. Travel notes are editorial planning guidance, not a live operating schedule.</p>}
          <p className="source-note">
            Use this guide to shape an itinerary, then recheck opening hours,
            reservations, entry rules, transport disruption and official travel
            advice before paying for a trip.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
