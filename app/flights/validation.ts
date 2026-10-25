import type { ContactInput, SearchInput, TravellerInput, Passenger, Selection } from "./types";

export class FlightError extends Error {
  constructor(message: string, public status = 400, public code = "invalid_input", public reference?: string, public uncertain = false) { super(message); }
}
export function requireValue(condition: unknown, message: string, status = 400): asserts condition {
  if (!condition) throw new FlightError(message, status);
}
export function realDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value + "T12:00:00Z").toISOString().slice(0, 10) === value;
}
export function ageOn(bornOn: string, on: string) {
  const birth = bornOn.split("-").map(Number), date = on.split("-").map(Number);
  return date[0] - birth[0] - (date[1] < birth[1] || (date[1] === birth[1] && date[2] < birth[2]) ? 1 : 0);
}
export function validateSearch(value: unknown, today = new Date().toISOString().slice(0, 10)): SearchInput {
  requireValue(value && typeof value === "object", "Enter your journey details.");
  const s = value as SearchInput;
  requireValue(typeof s.origin === "string" && /^[A-Z]{3}$/.test(s.origin) && typeof s.destination === "string" && /^[A-Z]{3}$/.test(s.destination), "Choose an airport or city for departure and arrival.");
  requireValue(s.origin !== s.destination, "Choose different departure and arrival airports.");
  requireValue(realDate(s.departure) && s.departure >= today && Date.parse(s.departure) - Date.parse(today) <= 365 * 86400000, "Choose a departure date within the next year.");
  requireValue(!s.returnDate || (realDate(s.returnDate) && s.returnDate >= s.departure && Date.parse(s.returnDate) - Date.parse(today) <= 365 * 86400000), "Return must be on or after departure and within the next year.");
  requireValue(Number.isInteger(s.adults) && s.adults >= 1 && s.adults <= 9, "Include between one and nine adults.");
  requireValue(Array.isArray(s.childAges) && s.childAges.every(a => Number.isInteger(a) && a >= 2 && a <= 15) && s.adults + s.childAges.length <= 9, "Select child ages from 2 to 15, with at most nine travellers in total.");
  requireValue(["economy", "premium_economy", "business", "first"].includes(s.cabin), "Choose a cabin class.");
  return { origin: s.origin, destination: s.destination, departure: s.departure, returnDate: s.returnDate || undefined, adults: s.adults, childAges: s.childAges, cabin: s.cabin, direct: s.direct === true };
}
export function validateTravellers(value: unknown, contact: unknown, passengers: Passenger[], departure: string, passportRequired: boolean) {
  requireValue(Array.isArray(value) && value.length === passengers.length, "Enter details for every traveller.");
  requireValue(contact && typeof contact === "object", "Enter contact details.");
  const c = contact as ContactInput;
  requireValue(typeof c.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email) && c.email.length <= 254, "Enter a valid contact email.");
  requireValue(typeof c.phone === "string" && /^\+[1-9]\d{6,14}$/.test(c.phone), "Enter a phone number with country code, for example +2348012345678.");
  const names = new Set<string>();
  return value.map((input: TravellerInput, i: number) => {
    requireValue(input && typeof input === "object", `Enter traveller ${i + 1}'s details.`);
    for (const name of [input.givenName, input.familyName]) requireValue(typeof name === "string" && /^[\p{L}\p{M}][\p{L}\p{M} .'-]{0,79}$/u.test(name.trim()), `Use letters for traveller ${i + 1}'s names.`);
    requireValue(realDate(input.bornOn) && input.bornOn < departure, `Enter a valid date of birth for traveller ${i + 1}.`);
    const age = ageOn(input.bornOn, departure), passenger = passengers[i];
    requireValue(age >= 2 && age <= 120 && (typeof passenger.age === "number" ? age === passenger.age : age >= 16), `Traveller ${i + 1}'s date of birth must match the age used in the search.`);
    requireValue(["mr", "mrs", "ms", "miss", "dr"].includes(input.title) && ["m", "f"].includes(input.gender), `Choose a title and airline gender marker for traveller ${i + 1}.`);
    const key = (input.givenName.trim() + " " + input.familyName.trim()).toLowerCase();
    requireValue(!names.has(key), "Each traveller must have a different full name."); names.add(key);
    const identity: { type: "passport"; unique_identifier: string; issuing_country_code: string; expires_on: string }[] = [];
    if (passportRequired || input.passportNumber) {
      requireValue(typeof input.passportNumber === "string" && /^[A-Za-z0-9]{4,24}$/.test(input.passportNumber), `Enter traveller ${i + 1}'s passport number.`);
      requireValue(typeof input.passportCountry === "string" && /^[A-Z]{2}$/.test(input.passportCountry), "Use a two-letter passport issuing country code, for example NG.");
      requireValue(realDate(input.passportExpiry) && input.passportExpiry > departure, "Passport expiry must be after departure.");
      identity.push({ type: "passport", unique_identifier: input.passportNumber, issuing_country_code: input.passportCountry, expires_on: input.passportExpiry });
    }
    return { id: passenger.id, given_name: input.givenName.trim(), family_name: input.familyName.trim(), born_on: input.bornOn, title: input.title, gender: input.gender, email: c.email.trim(), phone_number: c.phone, ...(identity.length ? { identity_documents: identity } : {}) };
  });
}
export function validateSelections(value: unknown): Selection[] {
  requireValue(Array.isArray(value) && value.length <= 40, "Choose valid baggage and seat options.");
  const seen = new Set<string>();
  return value.map((v: Selection) => {
    requireValue(v && typeof v.id === "string" && /^ase_[A-Za-z0-9]+$/.test(v.id) && !seen.has(v.id) && Number.isInteger(v.quantity) && v.quantity >= 1 && v.quantity <= 9, "A baggage or seat selection is invalid.");
    seen.add(v.id); return { id: v.id, quantity: v.quantity };
  });
}
