import { atlasCountries } from "../atlas-data";
import { cityGuides } from "../country-content";
import prices from "../datasets/household-prices.json";
import climate from "../datasets/temperature-1991-2020.json";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PassportChecker } from "./PassportChecker";
import { TravelMatcher } from "./TravelMatcher";
import { CallingPlanner } from "./CallingPlanner";
export const metadata = {
  title: "Travel tools · Passport, matcher & calling planner | TerraScope",
};
export default async function TravelPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const query = await searchParams,
    countries = atlasCountries.map((c) => ({
      code: c.code,
      name: c.name,
      slug: c.slug,
      flag: c.flag,
    }));
  const zones = [...new Set(atlasCountries.flatMap((c) => c.timezones))]
    .sort()
    .map((zone) => ({ zone, label: zone.replaceAll("_", " ") }));
  const matcher = atlasCountries.map((c) => {
    const guides = cityGuides.filter((g) => g.countryCode === c.code),
      temp = (climate.byCountry as Record<string, { value: number | null }>)[
        c.code
      ];
    return {
      ...countries.find((x) => x.code === c.code)!,
      words: guides
        .map(
          (g) =>
            g.overview + " " + g.attractions.join(" ") + " " + g.food.join(" "),
        )
        .join(" "),
      price: (prices.values as Record<string, { value: number; year: number }>)[
        c.code
      ],
      temperature: typeof temp?.value === "number" ? temp.value : undefined,
      food: [...new Set(guides.flatMap((g) => g.food))],
      guides: guides.length,
    };
  });
  return (
    <main>
      <SiteHeader active="travel" />
      <section className="index-hero">
        <p className="eyebrow">Make the next step easier</p>
        <h1>
          A little planning.
          <br />A better journey.
        </h1>
        <p>
          Find a place, explore passport requirements and make time for people
          across the world.
        </p>
        <nav className="actions" aria-label="Travel tools">
          <a href="#matcher">Find a match</a>
          <a href="#passport">Passport explorer</a>
          <a href="#calling">Calling planner</a>
          <a href="/trips">Saved trips & itineraries</a>
          <a href="/flights">Flight booking preview</a>
        </nav>
      </section>
      <TravelMatcher countries={matcher} />
      <PassportChecker
        countries={countries}
        initialDestination={
          countries.some((c) => c.code === query.destination)
            ? query.destination
            : ""
        }
      />
      <CallingPlanner zones={zones} />
      <SiteFooter />
    </main>
  );
}
