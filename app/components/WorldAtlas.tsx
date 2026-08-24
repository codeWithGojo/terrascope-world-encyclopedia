"use client";

import {useMemo, useState} from "react";
import Link from "next/link";
import worldMap from "@svg-maps/world";
import {atlasCountries, atlasRegions, regionColours, type AtlasRegion} from "../atlas-data";

type WorldMapLocation = {
  id: string;
  path: string;
};

function validRegion(value?: string): AtlasRegion {
  return atlasRegions.includes(value as AtlasRegion) ? value as AtlasRegion : "All";
}

export function WorldAtlas({initialRegion = "All", compact = false}:{initialRegion?: string; compact?: boolean}) {
  const [region, setRegion] = useState<AtlasRegion>(validRegion(initialRegion));
  const [selectedCode, setSelectedCode] = useState("NG");
  const [hoveredCode, setHoveredCode] = useState("");
  const [query, setQuery] = useState("");

  const countries = useMemo(() => atlasCountries.filter((country) => {
    const inRegion = region === "All" || country.region === region;
    const term = query.trim().toLowerCase();
    return inRegion && (!term || `${country.name} ${country.capital} ${country.subregion}`.toLowerCase().includes(term));
  }), [query, region]);

  const selected = atlasCountries.find((country) => country.code === selectedCode) ?? atlasCountries[0];
  const hovered = atlasCountries.find((country) => country.code === hoveredCode);
  const byMapId = useMemo(() => new Map(atlasCountries.map((country) => [country.code.toLowerCase(), country])), []);

  function chooseRegion(next: AtlasRegion) {
    setRegion(next);
    setQuery("");
    const first = atlasCountries.find((country) => next === "All" || country.region === next);
    if (first) setSelectedCode(first.code);
  }

  return <section className={`world-atlas ${compact ? "world-atlas-compact" : ""}`} aria-label="Interactive political map of the world">
    <div className="atlas-map-column">
      <div className="atlas-map-head">
        <div><small>Accurate political outline</small><b>Interactive world map</b></div>
        <span>{region === "All" ? "195 sovereign states" : `${countries.length} countries · ${region}`}</span>
      </div>
      <div className="atlas-map-wrap">
        <svg viewBox={worldMap.viewBox} role="img" aria-labelledby="world-map-title">
          <title id="world-map-title">World map with selectable sovereign countries</title>
          {(worldMap.locations as WorldMapLocation[]).map((location) => {
            const country = byMapId.get(location.id);
            if (!country) return <path className="map-territory" key={location.id} d={location.path} />;
            const activeRegion = region === "All" || country.region === region;
            const selectedCountry = country.code === selectedCode;
            return <path
              key={location.id}
              d={location.path}
              className={`map-country ${activeRegion ? "is-in-region" : "is-muted"} ${selectedCountry ? "is-selected" : ""}`}
              style={{"--map-colour": regionColours[country.region]} as React.CSSProperties}
              aria-label={country.name}
              tabIndex={activeRegion ? 0 : -1}
              onMouseEnter={() => setHoveredCode(country.code)}
              onMouseLeave={() => setHoveredCode("")}
              onFocus={() => setHoveredCode(country.code)}
              onBlur={() => setHoveredCode("")}
              onClick={() => setSelectedCode(country.code)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedCode(country.code); }}
            />;
          })}
        </svg>
        <div className="map-readout" aria-live="polite">
          <span>{hovered ? "Pointing at" : "Selected country"}</span>
          <b>{(hovered ?? selected).flag} {(hovered ?? selected).name}</b>
          <small>{(hovered ?? selected).capital} · {(hovered ?? selected).subregion}</small>
        </div>
      </div>
      <div className="continent-tabs" aria-label="Filter map by continent">
        {atlasRegions.map((name) => <button type="button" className={region === name ? "active" : ""} key={name} onClick={() => chooseRegion(name)}>{name}<small>{name === "All" ? 195 : atlasCountries.filter((country) => country.region === name).length}</small></button>)}
      </div>
    </div>

    <aside className="atlas-country-picker">
      <div className="picker-heading"><span>Choose a country</span><b>{countries.length}</b></div>
      <label className="atlas-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${region === "All" ? "the world" : region}…`} aria-label="Search countries" /></label>
      <div className="atlas-country-list">
        {countries.map((country) => <button type="button" className={country.code === selectedCode ? "active" : ""} key={country.code} onClick={() => setSelectedCode(country.code)}><span>{country.flag}</span><b>{country.name}</b><small>{country.code}</small></button>)}
      </div>
      {selected && <div className="selected-country-card">
        <div><span>{selected.flag}</span><small>{selected.official}</small><h3>{selected.name}</h3></div>
        <dl><div><dt>Capital</dt><dd>{selected.capital}</dd></div><div><dt>Area</dt><dd>{selected.areaLabel}</dd></div></dl>
        <Link href={`/countries/${selected.slug}`}>Open full country profile <span>↗</span></Link>
      </div>}
    </aside>
  </section>;
}
