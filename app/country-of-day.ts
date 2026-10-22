import { hashSeed } from "./game/engine";

/** A public editorial spotlight, separate from the daily game's answer state. */
export function countryOfDay<T extends { code: string }>(
  countries: readonly T[],
  now = new Date(),
) {
  const day = now.toISOString().slice(0, 10);
  const ordered = [
    ...new Map(countries.map((country) => [country.code, country])).values(),
  ].sort(
    (a, b) =>
      hashSeed("spotlight:" + a.code) - hashSeed("spotlight:" + b.code) ||
      a.code.localeCompare(b.code),
  );
  if (!ordered.length) return null;
  const dayNumber = Math.floor(Date.parse(day + "T00:00:00Z") / 86400000),
    index = ((dayNumber % ordered.length) + ordered.length) % ordered.length;
  return { country: ordered[index], day };
}
