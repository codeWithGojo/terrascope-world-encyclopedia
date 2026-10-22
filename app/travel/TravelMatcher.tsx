"use client";
import { useState } from "react";
import Link from "next/link";
import { matcherVibes, vibeMatch } from "./tools";
export type MatchCountry = {
  code: string;
  name: string;
  slug: string;
  flag: string;
  words: string;
  price?: { value: number; year: number };
  temperature?: number;
  food: string[];
  guides: number;
};
export function TravelMatcher({ countries }: { countries: MatchCountry[] }) {
  const [mode, setMode] = useState("travel"),
    [budget, setBudget] = useState("1500"),
    [baseline, setBaseline] = useState("2000"),
    [climate, setClimate] = useState("any"),
    [vibe, setVibe] = useState("Any");
  const valid = Number(budget) > 0 && Number(baseline) > 0;
  const results = countries
    .map((c) => {
      const model = c.price ? (Number(baseline) * c.price.value) / 100 : null;
      return { ...c, model };
    })
    .filter(
      (c) =>
        valid &&
        c.model !== null &&
        c.model <= Number(budget) &&
        vibeMatch(c.words, vibe) &&
        (climate === "any" ||
          (c.temperature !== undefined &&
            (climate === "warm"
              ? c.temperature >= 20
              : climate === "mild"
                ? c.temperature >= 10 && c.temperature < 20
                : c.temperature < 10))),
    )
    .sort((a, b) => b.guides - a.guides || (a.model ?? 0) - (b.model ?? 0))
    .slice(0, 12);
  return (
    <section className="travel-tool" id="matcher">
      <p className="eyebrow">A starting point, with reasons</p>
      <h2>Find your kind of place.</h2>
      <div className="tool-fields">
        <label>
          I’m planning to
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="travel">Travel</option>
            <option value="live">Live abroad</option>
          </select>
        </label>
        <label>
          Monthly budget (USD)
          <input
            type="number"
            min="1"
            max="1000000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </label>
        <label>
          My comparable US basket (USD/month)
          <input
            type="number"
            min="1"
            max="1000000"
            value={baseline}
            onChange={(e) => setBaseline(e.target.value)}
          />
        </label>
        <label>
          Climate
          <select value={climate} onChange={(e) => setClimate(e.target.value)}>
            <option value="any">Any / missing climate allowed</option>
            <option value="warm">Warm · annual mean ≥20°C</option>
            <option value="mild">Mild · 10–20°C</option>
            <option value="cool">Cool · below 10°C</option>
          </select>
        </label>
        <label>
          Vibe
          <select value={vibe} onChange={(e) => setVibe(e.target.value)}>
            {matcherVibes.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="source-note">
        Budget model = your US basket × World Bank household price level / 100.
        This is a broad price comparison, not a rent quote or a recommended
        living budget. Flights, tourist premiums, local variation, taxes and
        visas need separate planning.{" "}
        {mode === "live"
          ? "Moving also requires a suitable residence/work permission and a local income plan."
          : ""}{" "}
        Climate filters only use published 1991–2020 observations; countries
        with missing data are excluded when a climate filter is selected.
      </p>
      <div className="tool-results">
        {results.map((c) => (
          <article key={c.code}>
            <span className="tool-flag" aria-hidden="true">
              {c.flag}
            </span>
            <div>
              <h3>
                <Link href={`/countries/${c.slug}`}>{c.name}</Link>
              </h3>
              <p>
                Basket comparison: ${Math.round(c.model ?? 0).toLocaleString()}
                /month · price observation {c.price?.year}
                {c.temperature !== undefined
                  ? ` · ${c.temperature}°C annual mean`
                  : ""}
              </p>
              <p>
                {c.guides ? `${c.guides} city guides` : "Country atlas"}
                {vibe !== "Any"
                  ? ` · ${vibe.toLowerCase()} matches in guide text`
                  : ""}
                {c.food.length
                  ? ` · Try ${c.food.slice(0, 2).join(" or ")}`
                  : ""}
              </p>
              <Link href={`/trips?destination=${c.slug}`}>Build a trip →</Link>
            </div>
          </article>
        ))}
      </div>
      {!results.length && (
        <p>No sourced matches fit. Adjust your budget, climate or vibe.</p>
      )}
    </section>
  );
}
