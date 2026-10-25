export type Place = { id: string; code: string; name: string; city: string; country: string; type: string };
export type Passenger = { id: string; type: string; age?: number };
export type Segment = { id: string; origin: Place; destination: Place; departure: string; arrival: string; carrier: string; flightNumber: string; duration: string; cabin: string; baggage: string; seats: string[] };
export type Slice = { id: string; origin: Place; destination: Place; duration: string; segments: Segment[] };
export type Service = { id: string; type: "baggage" | "seat"; label: string; amount: string; currency: string; passengerIds: string[]; segmentIds: string[]; maximum: number; seat?: string; disclosures?: string[] };
export type Conditions = { refund: { allowed: boolean; amount?: string; currency?: string } | null; change: { allowed: boolean; amount?: string; currency?: string } | null };
export type FlightOffer = { id: string; requestId: string; airline: string; amount: string; currency: string; expiresAt: string; passengers: Passenger[]; slices: Slice[]; passportRequired: boolean; conditions: Conditions; services: Service[] };
export type FlightOrder = { id: string; reference: string; createdAt: string; amount: string; currency: string; airline: string; slices: Slice[]; passengers: { name: string; id: string }[]; documents: { type: string; number: string }[]; services: { type: string; label: string }[]; cancelledAt: string | null; paid: boolean; actions: string[]; conditions: Conditions };
export type SearchInput = { origin: string; destination: string; departure: string; returnDate?: string; adults: number; childAges: number[]; cabin: string; direct: boolean };
export type TravellerInput = { givenName: string; familyName: string; bornOn: string; title: string; gender: string; passportNumber?: string; passportCountry?: string; passportExpiry?: string };
export type ContactInput = { email: string; phone: string };
export type Selection = { id: string; quantity: number };
export type Quote = { token: string; offer: FlightOffer; amount: string; currency: string; expiresAt: string; services: Selection[] };
export type Cancellation = { token: string; orderId: string; amount: string; currency: string; refundTo: string; expiresAt: string };

export function money(amount: string | number, currency: string) {
  try { return new Intl.NumberFormat("en-GB", { style: "currency", currency, currencyDisplay: "code" }).format(Number(amount)); }
  catch { return `${currency} ${amount}`; }
}
export function duration(value: string) {
  const match = value.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/);
  if (!match) return value;
  return [Number(match[1]) ? `${Number(match[1])}d` : "", Number(match[2]) ? `${Number(match[2])}h` : "", Number(match[3]) ? `${Number(match[3])}m` : ""].filter(Boolean).join(" ") || value;
}
// Airline timestamps are local to the named airport, not the browser's timezone.
export function flightTime(value: string) { return value.slice(11, 16); }
export function flightDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value.slice(0, 10) + "T12:00:00Z"));
}
