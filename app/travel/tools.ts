import visas from "../datasets/visas.json";
export const visaMeta = {
  asOf: visas.asOf,
  source: visas.source,
  retrievedAt: visas.retrievedAt,
};
export type VisaCategory =
  | "visa-free"
  | "arrival"
  | "eta"
  | "e-visa"
  | "required"
  | "restricted"
  | "home"
  | "unknown";
export function visaRequirement(
  passport: string,
  destination: string,
): { category: VisaCategory; label: string; days?: number } {
  const row = (visas.rows as Record<string, string[]>)[passport],
    column = visas.columns.indexOf(destination);
  if (!row || column < 0)
    return { category: "unknown", label: "No observation" };
  const raw = String(row[column]).trim().toLowerCase();
  if (raw === "-1") return { category: "home", label: "Passport country" };
  if (/^\d+$/.test(raw) && Number(raw) > 0)
    return {
      category: "visa-free",
      label: `Visa-free · up to ${Number(raw)} days`,
      days: Number(raw),
    };
  const categories: Record<string, [VisaCategory, string]> = {
    "visa free": ["visa-free", "Visa-free · duration not specified"],
    "visa on arrival": ["arrival", "Visa on arrival"],
    eta: ["eta", "Electronic travel authorisation"],
    "e-visa": ["e-visa", "E-visa before travel"],
    "visa required": ["required", "Visa before travel"],
    "no admission": ["restricted", "Entry restricted"],
  };
  const value = categories[raw];
  return value
    ? { category: value[0], label: value[1] }
    : { category: "unknown", label: "No observation" };
}
export function localTime(instant: string | Date, zone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    dateStyle: "medium",
    timeStyle: "short",
    hourCycle: "h23",
  }).format(new Date(instant));
}
export type Caller = { zone: string; start: number; end: number };
export function callingSlots(date: string, people: Caller[]) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date ||
    people.length < 2
  )
    return [];
  try {
    people.forEach((p) => {
      new Intl.DateTimeFormat("en", { timeZone: p.zone });
      if (
        !Number.isFinite(p.start) ||
        !Number.isFinite(p.end) ||
        p.start < 0 ||
        p.end > 24 ||
        p.start >= p.end
      )
        throw Error("hours");
    });
  } catch {
    return [];
  }
  const start = Date.parse(date + "T00:00:00Z");
  return Array.from({ length: 48 }, (_, i) => new Date(start + i * 1800000))
    .filter((time) =>
      people.every((p) => {
        const parts = new Intl.DateTimeFormat("en", {
          timeZone: p.zone,
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }).formatToParts(time);
        const hour =
          Number(parts.find((x) => x.type === "hour")?.value) +
          Number(parts.find((x) => x.type === "minute")?.value) / 60;
        // A slot is a whole 30-minute call within each participant's availability.
        return hour >= p.start && hour + 0.5 <= p.end;
      }),
    )
    .map((d) => d.toISOString());
}
export const matcherVibes = [
  "Any",
  "Food",
  "Culture",
  "Nature",
  "City",
] as const;
export function vibeMatch(words: string, vibe: string) {
  const patterns: Record<string, RegExp> = {
    Food: /food|dining|cuisine|market|seafood|curry/i,
    Culture: /museum|art|temple|palace|heritage|historic|culture/i,
    Nature: /beach|mountain|park|garden|lake|wildlife|coast/i,
    City: /city|metro|skyline|neighbourhood|nightlife/i,
  };
  return vibe === "Any" || !!patterns[vibe]?.test(words);
}
