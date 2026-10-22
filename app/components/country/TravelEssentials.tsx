"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import prices from "../../datasets/household-prices.json";
import { PhrasePlayer } from "../../travel/PhrasePlayer";
type Advice = {
  alerts?: string[];
  updatedAt?: string;
  sourceUrl: string;
  summary?: string;
  error?: string;
  checkedAt?: string;
  scope?: string;
};
type Currency = {
  change: number;
  currentDate: string;
  previousDate: string;
  quote: string;
};
export function TravelEssentials({
  code,
  slug,
  name,
  languages,
  guides,
}: {
  code: string;
  slug: string;
  name: string;
  languages: string[];
  guides: {
    name: string;
    citySlug: string;
    food: string[];
    bestTime: string;
    safety: string;
  }[];
}) {
  const [advice, setAdvice] = useState<Advice | null>(null),
    [fx, setFx] = useState<Currency | null>(null),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    fetch(`/api/countries/${slug}/travel`, { signal: abort.signal })
      .then((r) => r.json())
      .then((value) => setAdvice(value as Advice))
      .catch(() => {
        if (!abort.signal.aborted)
          setAdvice({
            error: "Travel advice unavailable. Retry or open GOV.UK.",
            sourceUrl: "https://www.gov.uk/foreign-travel-advice",
          });
      });
    fetch(`/api/countries/${slug}/strength`, { signal: abort.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((value) => setFx(value as Currency | null))
      .catch(() => {});
    return () => abort.abort();
  }, [slug, retry]);
  const price = (
      prices.values as Record<string, { value: number; year: number }>
    )[code],
    foods = [...new Set(guides.flatMap((g) => g.food))];
  return (
    <>
      <section className="travel-tool" id="travel-essentials">
        <p className="eyebrow">Before you go</p>
        <h2>Everyday life in {name}.</h2>
        <div className="essentials-grid">
          <article>
            <h3>Cost of living · price comparison</h3>
            <strong>
              {price
                ? `${price.value.toFixed(0)} / 100`
                : "No comparable observation"}
            </strong>
            <p>
              {price
                ? `Household prices relative to an approximate US=100 basket · ${price.year}.`
                : "This country has no paired household PPP and exchange-rate observation."}
            </p>
            <p className="source-note">
              World Bank consumption PPP ÷ official FX, same year. Broad
              national price level, not a rent or travel quote.{" "}
              <a href={prices.sourceUrl}>Source & definition</a>
            </p>
          </article>
          <article>
            <h3>Currency strength · 30-day USD change</h3>
            <strong>
              {fx
                ? `${fx.change >= 0 ? "+" : ""}${fx.change.toFixed(2)}%`
                : "Reference series unavailable"}
            </strong>
            <p>
              {fx
                ? `${fx.quote} against USD · ${fx.previousDate} → ${fx.currentDate}. Positive means the local currency buys more USD.`
                : "Shown only when both dated observations exist. A nominal exchange rate alone does not measure strength."}
            </p>
            <a href="https://frankfurter.dev/">Reference-rate source</a>
          </article>
        </div>
        <article className="advisory">
          <h3>Safety & official advice</h3>
          {!advice ? (
            <p>Checking the latest official advisory…</p>
          ) : (
            <>
              <p>
                {advice.error ||
                  advice.alerts?.join(" · ") ||
                  "No country-wide alert returned. Read the full advice for regional risks and practical precautions."}
              </p>
              {advice.summary && <p>{advice.summary}</p>}
              <p className="source-note">
                {advice.scope}{" "}
                {advice.updatedAt
                  ? `Updated ${advice.updatedAt.slice(0, 10)}. `
                  : ""}
                {advice.checkedAt
                  ? `Checked ${advice.checkedAt.slice(0, 10)}.`
                  : ""}
              </p>
              <a
                href={advice.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read official warnings and regional detail →
              </a>
              {advice.error && (
                <button onClick={() => setRetry((n) => n + 1)}>
                  Retry advisory
                </button>
              )}
            </>
          )}
        </article>
        <h3>When to visit</h3>
        {guides.length ? (
          guides.slice(0, 3).map((g) => (
            <p key={g.citySlug}>
              <b>{g.name}:</b> {g.bestTime}
            </p>
          ))
        ) : (
          <p>
            Check seasonal conditions for the exact region and altitude.
            Country-wide dates can hide major local differences.
          </p>
        )}
        <div className="actions">
          <Link href={`/travel?destination=${code}#passport`}>
            Check a passport
          </Link>
          <Link href="/travel#calling">Plan a call</Link>
          <Link href={`/trips?destination=${slug}`}>Save a trip</Link>
        </div>
      </section>
      <section className="travel-tool" id="cuisine">
        <p className="eyebrow">At the table</p>
        <h2>A taste of {name}.</h2>
        {foods.length ? (
          <>
            <div className="dish-tags">
              {foods.map((food) => (
                <span key={food}>{food}</span>
              ))}
            </div>
            <p>
              From TerraScope’s city guides. Recipes and names vary by region.
            </p>
            <div className="actions">
              {guides.map((g) => (
                <Link
                  key={g.citySlug}
                  href={`/countries/${slug}/cities/${g.citySlug}`}
                >
                  {g.name} food & city guide →
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p>
            <a
              href={`https://en.wikivoyage.org/wiki/${encodeURIComponent(name.replaceAll(" ", "_"))}#Eat`}
            >
              Explore the local cuisine on Wikivoyage →
            </a>
            . A reviewed dish list has not been added for this profile.
          </p>
        )}
      </section>
      <PhrasePlayer languages={languages} />
    </>
  );
}
