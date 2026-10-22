import Link from "next/link";
import { countryOfDay } from "../country-of-day";
import { atlasCountries } from "../atlas-data";
import { ArrowUpRight } from "./ArrowUpRight";

export function CountryOfDay() {
  const spotlight = countryOfDay(atlasCountries);
  if (!spotlight) return null;
  const { country, day } = spotlight;
  return (
    <aside
      className="daily-country-spotlight"
      aria-labelledby="daily-country-title"
    >
      <div className="daily-country-label">
        <p className="eyebrow">Country of the day</p>
        <time dateTime={day}>
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
            timeZone: "UTC",
          }).format(new Date(day + "T12:00:00Z"))}
        </time>
      </div>
      <div className="daily-country-name">
        <span aria-hidden="true">{country.flag}</span>
        <div>
          <h2 id="daily-country-title">{country.name}</h2>
          <p>
            {country.capital} · {country.region}
          </p>
        </div>
      </div>
      <Link className="atlas-text-link" href={`/countries/${country.slug}`}>
        Get to know {country.name} <ArrowUpRight />
      </Link>
      <small>A new country at 00:00 UTC.</small>
    </aside>
  );
}
