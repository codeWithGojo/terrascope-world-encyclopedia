"use client";

import { useState } from "react";
import Link from "next/link";
import { atlasCountries } from "../atlas-data";
import { countries as editorialCountries } from "../data";

const editorialBySlug = new Map(editorialCountries.map((c) => [c.slug, c]));

function formatArea(n: number) {
  return n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(2)}M km²`
    : `${Math.round(n).toLocaleString("en-US")} km²`;
}

function formatPopulation(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return n.toLocaleString("en-US");
}

type Row =
  | { kind: "text"; label: string; a: string; b: string }
  | { kind: "bar"; label: string; aValue: number; bValue: number; aLabel: string; bLabel: string; aColor: string; bColor: string };

export default function CompareTool() {
  const [first, setFirst] = useState("nigeria");
  const [second, setSecond] = useState("japan");

  const a = atlasCountries.find((c) => c.slug === first) ?? atlasCountries[0];
  const b = atlasCountries.find((c) => c.slug === second) ?? atlasCountries[1];
  const aEd = editorialBySlug.get(a.slug);
  const bEd = editorialBySlug.get(b.slug);

  const aColor = aEd?.color ?? "#3f766b";
  const bColor = bEd?.color ?? "#c49a53";

  const rows: Row[] = [
    { kind: "text", label: "Capital", a: a.capital, b: b.capital },
    { kind: "text", label: "Continent", a: a.region, b: b.region },
    { kind: "text", label: "Subregion", a: a.subregion, b: b.subregion },
    {
      kind: "bar",
      label: "Land area",
      aValue: a.area,
      bValue: b.area,
      aLabel: formatArea(a.area),
      bLabel: formatArea(b.area),
      aColor,
      bColor,
    },
  ];

  if (aEd?.population && bEd?.population) {
    rows.push({
      kind: "bar",
      label: "Population",
      aValue: aEd.population,
      bValue: bEd.population,
      aLabel: formatPopulation(aEd.population),
      bLabel: formatPopulation(bEd.population),
      aColor,
      bColor,
    });
  } else {
    rows.push({
      kind: "text",
      label: "Population",
      a: aEd?.populationLabel ?? "— (extended profile)",
      b: bEd?.populationLabel ?? "— (extended profile)",
    });
  }

  rows.push(
    {
      kind: "text",
      label: "Languages",
      a: (aEd?.languages ?? a.languages).join(" · ") || "—",
      b: (bEd?.languages ?? b.languages).join(" · ") || "—",
    },
    {
      kind: "text",
      label: "Currency",
      a: aEd?.currency ?? (a.currencies.join(" · ") || "—"),
      b: bEd?.currency ?? (b.currencies.join(" · ") || "—"),
    },
    {
      kind: "text",
      label: "Government",
      a: aEd?.government ?? "— (extended profile)",
      b: bEd?.government ?? "— (extended profile)",
    },
    {
      kind: "text",
      label: "Leader",
      a: aEd ? `${aEd.leader} (${aEd.leaderTitle})` : "— (extended profile)",
      b: bEd ? `${bEd.leader} (${bEd.leaderTitle})` : "— (extended profile)",
    },
    {
      kind: "text",
      label: "Life expectancy",
      a: aEd?.lifeExpectancy ?? "—",
      b: bEd?.lifeExpectancy ?? "—",
    },
    {
      kind: "text",
      label: "Internet access",
      a: aEd?.internet ?? "—",
      b: bEd?.internet ?? "—",
    },
    {
      kind: "text",
      label: "Nominal GDP",
      a: aEd?.gdp ?? "—",
      b: bEd?.gdp ?? "—",
    },
    {
      kind: "text",
      label: "Landlocked",
      a: a.landlocked ? "Yes" : "No",
      b: b.landlocked ? "Yes" : "No",
    },
    {
      kind: "text",
      label: "Land borders",
      a: String(a.borders.length),
      b: String(b.borders.length),
    },
  );

  return (
    <>
      <div className="compare-selectors">
        <label>
          <span>Country A</span>
          <select value={first} onChange={(e) => setFirst(e.target.value)}>
            {atlasCountries
              .filter((c) => c.slug !== second)
              .map((c) => (
                <option value={c.slug} key={c.slug}>
                  {c.flag} {c.name}
                </option>
              ))}
          </select>
        </label>
        <i>VERSUS</i>
        <label>
          <span>Country B</span>
          <select value={second} onChange={(e) => setSecond(e.target.value)}>
            {atlasCountries
              .filter((c) => c.slug !== first)
              .map((c) => (
                <option value={c.slug} key={c.slug}>
                  {c.flag} {c.name}
                </option>
              ))}
          </select>
        </label>
      </div>

      <div className="compare-head">
        <div style={{ "--country": aColor } as React.CSSProperties}>
          <span>{a.flag}</span>
          <small>{a.subregion}</small>
          <h2>{a.name}</h2>
          <Link href={`/countries/${a.slug}`}>View profile ↗</Link>
          {!aEd && <small className="compare-depth">Core geographic record</small>}
        </div>
        <div style={{ "--country": bColor } as React.CSSProperties}>
          <span>{b.flag}</span>
          <small>{b.subregion}</small>
          <h2>{b.name}</h2>
          <Link href={`/countries/${b.slug}`}>View profile ↗</Link>
          {!bEd && <small className="compare-depth">Core geographic record</small>}
        </div>
      </div>

      <div className="comparison-table">
        {rows.map((row) => {
          if (row.kind === "text") {
            return (
              <div className="comparison-row text" key={row.label}>
                <p>{row.label}</p>
                <b>{row.a}</b>
                <b>{row.b}</b>
              </div>
            );
          }
          const max = Math.max(row.aValue, row.bValue, 1);
          return (
            <div className="comparison-row" key={row.label}>
              <p>{row.label}</p>
              <div>
                <b>{row.aLabel}</b>
                <i style={{ width: `${(row.aValue / max) * 100}%`, background: row.aColor }} />
              </div>
              <div>
                <b>{row.bLabel}</b>
                <i style={{ width: `${(row.bValue / max) * 100}%`, background: row.bColor }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
