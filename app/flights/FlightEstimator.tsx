"use client";

import { useState, type FormEvent } from "react";
import { airports, estimateFlight, type Airport } from "./estimate";

const money = new Intl.NumberFormat("en", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const distance = new Intl.NumberFormat("en");
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function AirportField({ label, value, onChange, initialCountry }: { label: string; value: string; onChange: (code: string) => void; initialCountry?: string }) {
  const [country, setCountry] = useState(initialCountry);
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const matches = airports.filter(([code, city, name, airportCountry]) =>
    (!country || airportCountry === country) &&
    (!search || `${code} ${city} ${name} ${countryNames.of(airportCountry) ?? airportCountry}`.toLowerCase().includes(search)),
  );
  const matching = matches.slice(0, 100);
  const selected = airports.find(([code]) => code === value);
  const options = selected && !matching.includes(selected) ? [selected, ...matching] : matching;

  return (
    <div className="flight-airport">
      {country && (
        <p>Showing airports in {countryNames.of(country)}. <button type="button" className="flight-clear-filter" onClick={() => setCountry(undefined)}>Show all countries</button></p>
      )}
      <label>
        {label} airport search
        <input type="search" placeholder="City, country or airport code" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <label>
        {label} airport
        <select required value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">{matching.length ? "Select an airport" : "No airports found"}</option>
          {options.map(([code, city, name, country]) => (
            <option key={code} value={code}>{city} ({code}) · {name === city ? countryNames.of(country) : name}</option>
          ))}
        </select>
      </label>
      {matches.length > matching.length && <small>Search to narrow the list of airports.</small>}
    </div>
  );
}

export function FlightEstimator({ destinationCountry }: { destinationCountry?: string }) {
  const [origin, setOrigin] = useState("LOS");
  const [destination, setDestination] = useState("");
  const [roundTrip, setRoundTrip] = useState(true);
  const [passengers, setPassengers] = useState(1);
  const [result, setResult] = useState<{ from: Airport; to: Airport; passengers: number; roundTrip: boolean; estimate: ReturnType<typeof estimateFlight> }>();
  const [error, setError] = useState("");

  function clearResult() {
    setResult(undefined);
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const from = airports.find(([code]) => code === origin);
    const to = airports.find(([code]) => code === destination);
    if (!from || !to || origin === destination) {
      setError("Choose two different airports.");
      return;
    }
    setError("");
    setResult({ from, to, passengers, roundTrip, estimate: estimateFlight(from, to, passengers, roundTrip) });
  }

  return (
    <section className="flight-estimator">
      <header>
        <p className="flight-kicker">Travel tools</p>
        <h1>Flight estimates</h1>
        <p>See an illustrative economy airfare range, distance and flight time for your route.</p>
      </header>
      <form className="flight-panel" onSubmit={submit}>
        <div className="flight-fields">
          <AirportField label="Departure" value={origin} onChange={(value) => { setOrigin(value); clearResult(); }} />
          <AirportField label="Arrival" initialCountry={destinationCountry} value={destination} onChange={(value) => { setDestination(value); clearResult(); }} />
          <label>
            Trip type
            <select value={roundTrip ? "round" : "one-way"} onChange={(event) => { setRoundTrip(event.target.value === "round"); clearResult(); }}>
              <option value="round">Round trip</option>
              <option value="one-way">One way</option>
            </select>
          </label>
          <label>
            Travellers
            <select value={passengers} onChange={(event) => { setPassengers(Number(event.target.value)); clearResult(); }}>
              {Array.from({ length: 9 }, (_, index) => index + 1).map((count) => <option key={count}>{count}</option>)}
            </select>
          </label>
        </div>
        <button className="flight-action" type="submit">Estimate flight</button>
        {error && <p role="alert" className="flight-error">{error}</p>}
      </form>
      <div aria-live="polite" aria-atomic="true">
        {result && (
          <section className="flight-panel flight-result" aria-labelledby="flight-result-title">
            <h2 id="flight-result-title">{result.from[1]} to {result.to[1]}</h2>
            <dl>
              <div><dt>Economy budget in USD</dt><dd>{money.format(result.estimate.low)}–{money.format(result.estimate.high)}</dd></div>
              <div><dt>Straight-line distance each way</dt><dd>{distance.format(result.estimate.distanceKm)} km</dd></div>
              <div><dt>Estimated nonstop time each way</dt><dd>{Math.floor(result.estimate.flightMinutes / 60)}h {result.estimate.flightMinutes % 60}m</dd></div>
            </dl>
            <p>Budget for {result.passengers} {result.passengers === 1 ? "traveller" : "travellers"} · {result.roundTrip ? "round trip" : "one way"}.</p>
            <a href={`https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${result.from[0]} to ${result.to[0]} ${result.roundTrip ? "round trip" : "one way"}`)}`}>Check current fares on Google Flights ↗</a>
          </section>
        )}
      </div>
      <details className="flight-method">
        <summary>How we estimate your flight</summary>
        <p>We use straight-line distance and assume a cruising speed of 800 km/h plus 35 minutes for departure and arrival. Connections can add hours, and some airport pairs may have no nonstop service.</p>
        <p>The economy budget is illustrative. Each person, each way, uses a base of US$45–125 plus US$0.055–0.14 per kilometre. Actual fares depend on dates, demand, airline and baggage.</p>
        <a href="https://ourairports.com/data/">Airport locations from OurAirports ↗</a>
      </details>
    </section>
  );
}
