import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { FlightOffer, FlightOrder, Place, Slice, Service, Conditions, Selection } from "./types";
import { FlightError, requireValue } from "./validation";

type RawPlace = { id: string; iata_code: string; name: string; city_name?: string; city?: { name: string }; iata_country_code?: string; type?: string };
type RawCondition = { allowed: boolean; penalty_amount?: string; penalty_currency?: string };
type RawSlice = { id: string; origin: RawPlace; destination: RawPlace; duration: string; segments: { id: string; origin: RawPlace; destination: RawPlace; departing_at: string; arriving_at: string; operating_carrier: { name: string; iata_code: string }; operating_carrier_flight_number: string; duration: string; passengers?: { cabin_class?: string; baggages?: { quantity: number; type: string }[]; seat?: { designator?: string } | string }[] }[] };
type RawService = { id: string; type: string; total_amount: string; total_currency: string; passenger_ids: string[]; segment_ids: string[]; maximum_quantity?: number; metadata?: { type?: string; maximum_weight_kg?: number; designator?: string } };
export type RawOffer = { id: string; offer_request_id: string; live_mode: boolean; owner: { name: string }; total_amount: string; total_currency: string; expires_at: string; passengers: { id: string; type: string; age?: number }[]; slices: RawSlice[]; passenger_identity_documents_required: boolean; conditions?: { refund_before_departure?: RawCondition; change_before_departure?: RawCondition }; available_services?: RawService[] };
export type RawOrder = Omit<RawOffer, "expires_at" | "passenger_identity_documents_required" | "passengers"> & { booking_reference: string; created_at: string; passengers: { id: string; given_name: string; family_name: string }[]; documents?: { type: string; unique_identifier: string }[]; services?: RawService[]; cancelled_at: string | null; payment_status?: { awaiting_payment: boolean }; available_actions: string[]; metadata?: Record<string, string> };
type SeatMap = { segment_id: string; cabins: { rows: { sections: { elements: { type: string; designator?: string; disclosures?: string[]; available_services?: { id: string; passenger_id: string; total_amount: string; total_currency: string }[] }[] }[] }[] }[] };
type Envelope<T> = { data: T; meta?: { after?: string; request_id?: string }; errors?: { code: string; message: string }[] };
export const cookieName = "ts_flight_session";
export function sandboxToken() {
  const token = process.env.DUFFEL_ACCESS_TOKEN;
  if (!token?.startsWith("duffel_test_")) throw new FlightError("Flight booking preview is not configured. Live booking is not enabled.", 503, "not_configured");
  return token;
}
function mac(value: string) { return createHmac("sha256", sandboxToken()).update("terrascope-flights-v1:" + value).digest("base64url"); }
export function sign<T>(purpose: string, value: T, lifetime = 15 * 60) {
  const payload = Buffer.from(JSON.stringify({ purpose, value, exp: Math.floor(Date.now() / 1000) + lifetime })).toString("base64url");
  return payload + "." + mac(payload);
}
export function unseal<T>(token: unknown, purpose: string, allowExpired = false): T {
  requireValue(typeof token === "string" && token.length < 15000, "This checkout has expired. Search again.", 409);
  const [payload, signature, extra] = token.split("."), expected = mac(payload);
  requireValue(!extra && signature?.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected)), "This checkout is invalid. Search again.", 403);
  let parsed; try { parsed = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch { throw new FlightError("Invalid checkout.", 403); }
  requireValue(parsed.purpose === purpose && Number.isFinite(parsed.exp) && (allowExpired || parsed.exp > Date.now() / 1000), "This checkout has expired. Search again.", 409);
  return parsed.value as T;
}
export function session(existing?: string) {
  if (existing) { try { const value = unseal<{ id: string }>(existing, "session"); if (/^[a-f0-9-]{36}$/.test(value.id)) return { id: value.id, cookie: existing }; } catch { /* Invalid or expired cookies start a separate browser session. */ } }
  const id = randomUUID(); return { id, cookie: sign("session", { id }, 30 * 86400) };
}
export function sessionOwner(id: string) { return mac("owner:" + id); }
export async function duffel<T>(path: string, method = "GET", data?: unknown, timeout = 25000): Promise<Envelope<T>> {
  const token = sandboxToken();
  let response: Response;
  try { response = await fetch("https://api.duffel.com" + path, { method, headers: { Authorization: `Bearer ${token}`, "Duffel-Version": "v2", Accept: "application/json", "Content-Type": "application/json" }, ...(data === undefined ? {} : { body: JSON.stringify({ data }) }), cache: "no-store", signal: AbortSignal.timeout(timeout) }); }
  catch { throw new FlightError("The airline connection was interrupted. Check booking status before trying again.", 504, "connection_interrupted", undefined, method === "POST" && path === "/air/orders"); }
  let result: Envelope<T>;
  try { result = await response.json(); } catch { throw new FlightError("The airline returned an unreadable response. Check booking status.", 502, "provider_response", undefined, path === "/air/orders"); }
  if (response.status === 202) throw new FlightError("The airline is still processing this booking. Check status here before starting another booking.", 202, "booking_pending", result.meta?.request_id, true);
  if (!response.ok) {
    const error = result.errors?.[0], code = error?.code || "provider_error";
    const uncertain = path === "/air/orders" && (response.status >= 500 && response.status !== 503 || ["order_creation_already_attempted", "offer_request_already_booked", "duplicate_booking", "order_not_created"].includes(code));
    const message = response.status === 401 || response.status === 403 ? "The flight provider could not authorise this action. Check the test token and its permissions." : uncertain ? "This booking needs a status check. Do not submit it again." : error?.message || "The airline could not complete this request. Please search again.";
    throw new FlightError(message, response.status >= 500 ? 502 : response.status, code, result.meta?.request_id, uncertain);
  }
  if (!result.data) throw new FlightError("No flight data was returned.", 502, "provider_response");
  return result;
}
export function place(p: RawPlace): Place { return { id: p.id, code: p.iata_code, name: p.name, city: p.city_name || p.city?.name || "", country: p.iata_country_code || "", type: p.type || "airport" }; }
function slices(data: RawSlice[]): Slice[] {
  return data.map(s => ({ id: s.id, origin: place(s.origin), destination: place(s.destination), duration: s.duration, segments: s.segments.map(f => ({ id: f.id, origin: place(f.origin), destination: place(f.destination), departure: f.departing_at, arrival: f.arriving_at, carrier: f.operating_carrier.name, flightNumber: `${f.operating_carrier.iata_code || ""}${f.operating_carrier_flight_number}`, duration: f.duration, cabin: f.passengers?.[0]?.cabin_class || "", baggage: (f.passengers?.[0]?.baggages || []).map(b => `${b.quantity} ${b.type.replaceAll("_", " ")}`).join(" · "), seats: (f.passengers || []).map(p => typeof p.seat === "string" ? p.seat : p.seat?.designator || "").filter(Boolean) })) }));
}
function conditions(data: RawOffer["conditions"]): Conditions {
  const map = (c?: RawCondition) => c ? { allowed: c.allowed, amount: c.penalty_amount, currency: c.penalty_currency } : null;
  return { refund: map(data?.refund_before_departure), change: map(data?.change_before_departure) };
}
export function offer(data: RawOffer): FlightOffer {
  requireValue(data.live_mode === false, "Live bookings are disabled in this preview.", 503);
  return { id: data.id, requestId: data.offer_request_id, airline: data.owner.name, amount: data.total_amount, currency: data.total_currency, expiresAt: data.expires_at, passengers: data.passengers.map(p => ({ id: p.id, type: p.type, ...(typeof p.age === "number" ? { age: p.age } : {}) })), slices: slices(data.slices), passportRequired: data.passenger_identity_documents_required === true, conditions: conditions(data.conditions), services: (data.available_services || []).filter(s => s.type === "baggage").map(s => ({ id: s.id, type: "baggage", label: `${s.metadata?.type?.replaceAll("_", " ") || "Extra"} bag${s.metadata?.maximum_weight_kg ? ` · up to ${s.metadata.maximum_weight_kg} kg` : ""}`, amount: s.total_amount, currency: s.total_currency, passengerIds: s.passenger_ids, segmentIds: s.segment_ids, maximum: Math.min(s.maximum_quantity || 1, 9) })) };
}
export function order(data: RawOrder): FlightOrder {
  requireValue(data.live_mode === false, "Live bookings are disabled in this preview.", 503);
  return { id: data.id, reference: data.booking_reference, createdAt: data.created_at, amount: data.total_amount, currency: data.total_currency, airline: data.owner.name, slices: slices(data.slices), passengers: data.passengers.map(p => ({ id: p.id, name: `${p.given_name} ${p.family_name}` })), documents: (data.documents || []).map(d => ({ type: d.type, number: d.unique_identifier })), services: (data.services || []).map(s => ({ type: s.type, label: s.type === "seat" ? `Seat ${s.metadata?.designator || "selected"}` : "Extra baggage" })), cancelledAt: data.cancelled_at || null, paid: data.payment_status?.awaiting_payment === false, actions: data.available_actions || [], conditions: conditions(data.conditions) };
}
export async function getOffer(id: string) { requireValue(/^off_[A-Za-z0-9]+$/.test(id), "Invalid flight selection."); return (await duffel<RawOffer>(`/air/offers/${id}?return_available_services=true`)).data; }
export async function seatServices(id: string): Promise<Service[]> {
  const data = (await duffel<SeatMap[]>(`/air/seat_maps?offer_id=${encodeURIComponent(id)}`)).data;
  return data.flatMap(map => map.cabins.flatMap(c => c.rows.flatMap(r => r.sections.flatMap(section => section.elements.filter(e => e.type === "seat").flatMap(e => (e.available_services || []).map(s => ({ id: s.id, type: "seat" as const, label: `Seat ${e.designator}`, seat: e.designator, amount: s.total_amount, currency: s.total_currency, passengerIds: [s.passenger_id], segmentIds: [map.segment_id], maximum: 1, disclosures: e.disclosures || [] })))))));
}
export type CheckoutToken = { owner: string; offerId: string; amount: string; currency: string; services: Selection[]; attempt: string; departure: string };
export async function ownedOrders(owner: string, after?: string) {
  const result = await duffel<RawOrder[]>(`/air/orders?limit=200&sort=-created_at${after ? `&after=${encodeURIComponent(after)}` : ""}`);
  return { orders: result.data.filter(o => o.live_mode === false && o.metadata?.terrascope_owner === owner).map(order), next: result.meta?.after };
}
export async function ownedOrder(id: string, owner: string) {
  requireValue(/^ord_[A-Za-z0-9]+$/.test(id), "Invalid booking.");
  const data = (await duffel<RawOrder>(`/air/orders/${id}`)).data;
  requireValue(data.metadata?.terrascope_owner === owner && data.live_mode === false, "Booking not found in this browser session.", 404); return data;
}
export async function recover(checkout: CheckoutToken) {
  const result = await duffel<RawOrder[]>(`/air/orders?offer_id=${encodeURIComponent(checkout.offerId)}&limit=20`);
  const found = result.data.find(o => o.live_mode === false && o.metadata?.terrascope_owner === checkout.owner && o.metadata?.terrascope_attempt === checkout.attempt);
  return found ? order(found) : null;
}
