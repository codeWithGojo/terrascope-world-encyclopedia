"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { visaRequirement, visaMeta, type VisaCategory } from "./tools";
type Country = { code: string; name: string; slug: string; flag: string };
export function PassportChecker({
  countries,
  initialDestination = "",
}: {
  countries: Country[];
  initialDestination?: string;
}) {
  const [passport, setPassport] = useState("NG"),
    [destination, setDestination] = useState(initialDestination),
    [filter, setFilter] = useState("all"),
    [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      countries.map((c) => ({ ...c, ...visaRequirement(passport, c.code) })),
    [countries, passport],
  );
  const counts = (type: VisaCategory) =>
    results.filter((r) => r.category === type).length;
  const shown = results.filter(
    (r) =>
      (!destination || r.code === destination) &&
      (filter === "all" || r.category === filter) &&
      r.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="travel-tool" id="passport">
      <p className="eyebrow">Passport explorer</p>
      <h2>Where could you go?</h2>
      <p className="source-note">
        Routes with an official review show their review date. Other results
        use the community snapshot from {visaMeta.asOf}. Check the latest
        requirements for your passport, purpose, residency and length of stay
        before you travel.{" "}
        <a href="https://www.iata.org/travel-centre/">Open the IATA Travel Centre ↗</a>
      </p>
      <div className="tool-fields">
        <label>
          Your passport
          <select
            value={passport}
            onChange={(e) => setPassport(e.target.value)}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Destination
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">All destinations</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Requirement
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All requirements</option>
            <option value="visa-free">Visa-free</option>
            <option value="arrival">Visa on arrival</option>
            <option value="eta">ETA</option>
            <option value="e-visa">E-visa</option>
            <option value="required">Visa before travel</option>
            <option value="restricted">Entry restricted</option>
          </select>
        </label>
        <label>
          Search destinations
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <p>
        <b>{counts("visa-free")}</b> visa-free · <b>{counts("arrival")}</b> on
        arrival · <b>{counts("eta")}</b> ETA · within TerraScope’s 195-country
        scope. Categories are counted separately; this is not a global passport
        rank.
      </p>
      <div className="tool-results">
        {shown.map((r) => (
          <article key={r.code}>
            <span className="tool-flag" aria-hidden="true">
              {r.flag}
            </span>
            <div>
              <h3>
                <Link href={`/countries/${r.slug}`}>{r.name}</Link>
              </h3>
              <p>{r.label}</p>
              <a
                href={r.authority ?? "https://www.iata.org/travel-centre/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {r.checkedAt ? `Official source · reviewed ${r.checkedAt} ↗` : "Check current entry requirements ↗"}
              </a>
            </div>
          </article>
        ))}
      </div>
      {!shown.length && <p>No destinations match. Change the filters.</p>}
      <p className="source-note">
        <a href={visaMeta.source}>Source & MIT licence</a> · Snapshot retrieved{" "}
        {visaMeta.retrievedAt}. Days in the dataset are maximums, subject to
        entry conditions.
      </p>
    </section>
  );
}
