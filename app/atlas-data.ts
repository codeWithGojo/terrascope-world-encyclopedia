import worldCountries from "world-countries";
import {countries as editorialCountries, type Country} from "./data";

export const atlasRegions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"] as const;
export type AtlasRegion = (typeof atlasRegions)[number];

const editorialByCode = new Map(editorialCountries.map((country) => [country.code, country]));

export function countrySlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatArea(area: number) {
  return area >= 1_000_000
    ? `${(area / 1_000_000).toFixed(2)}M km²`
    : `${Math.round(area).toLocaleString("en-US")} km²`;
}

export type AtlasCountry = {
  code: string;
  cca3: string;
  slug: string;
  name: string;
  official: string;
  flag: string;
  region: Exclude<AtlasRegion, "All">;
  subregion: string;
  capital: string;
  area: number;
  areaLabel: string;
  currencies: string[];
  currencyCodes: string[];
  languages: string[];
  calling: string;
  tld: string;
  demonym: string;
  landlocked: boolean;
  borders: string[];
  editorial?: Country;
};

const sovereignSet = new Set(["VA", "PS"]);

/** Overrides for countries whose world-countries currency data is outdated or corrupted. */
const currencyOverrides: Record<string, { labels: string[]; codes: string[] }> = {
  // Zimbabwe: package still lists the old multi-currency basket (BWP, CNY, EUR…).
  // Official currency since 2024 is Zimbabwe Gold (ZiG); USD remains widely used.
  ZW: {
    labels: ["Zimbabwe Gold (ZiG)", "United States dollar ($)"],
    codes: ["ZWG", "USD"],
  },
};

export const atlasCountries: AtlasCountry[] = worldCountries
  .filter((country) => country.unMember || sovereignSet.has(country.cca2))
  .map((country) => {
    const editorial = editorialByCode.get(country.cca2);
    const override = currencyOverrides[country.cca2];
    const currencyEntries = Object.entries(country.currencies ?? {});
    const callingSuffix = country.idd.suffixes?.[0] ?? "";
    return {
      code: country.cca2,
      cca3: country.cca3,
      slug: editorial?.slug ?? countrySlug(country.name.common),
      name: editorial?.name ?? country.name.common,
      official: editorial?.official ?? country.name.official,
      flag: country.flag,
      region: country.region as AtlasCountry["region"],
      subregion: country.subregion || country.region,
      capital: editorial?.capital ?? country.capital?.join(" · ") ?? "No official capital",
      area: country.area,
      areaLabel: editorial?.areaLabel ?? formatArea(country.area),
      currencies: override
        ? override.labels
        : currencyEntries.map(([, currency]) => `${currency.name}${currency.symbol ? ` (${currency.symbol})` : ""}`),
      currencyCodes: override ? override.codes : currencyEntries.map(([code]) => code),
      languages: Object.values(country.languages ?? {}),
      calling: editorial?.calling ?? (`${country.idd.root ?? ""}${callingSuffix}` || "—"),
      tld: country.tld?.join(" · ") || "—",
      demonym: country.demonyms?.eng?.m ?? country.name.common,
      landlocked: country.landlocked,
      borders: country.borders ?? [],
      editorial,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export const atlasBySlug = new Map(atlasCountries.map((country) => [country.slug, country]));
export const atlasByCode = new Map(atlasCountries.map((country) => [country.code, country]));

export function regionCount(region: Exclude<AtlasRegion, "All">) {
  return atlasCountries.filter((country) => country.region === region).length;
}

export const regionColours: Record<Exclude<AtlasRegion, "All">, string> = {
  Africa: "#c96743",
  Americas: "#3f766b",
  Asia: "#c49a53",
  Europe: "#59728d",
  Oceania: "#7a6f94",
};
