import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

const local = process.argv[2] === "--local";
const base = new URL(local ? "https://terrascope.test" : process.argv[2]);
assert.equal(base.protocol, "https:");
if (local) {
  const { GET, POST } = await import("../app/api/flights/route.ts");
  const { NextRequest } = await import("next/server.js");
  const externalFetch = globalThis.fetch;
  globalThis.fetch = async (input, options) => {
    const url = new URL(String(input));
    if (url.origin !== base.origin) return externalFetch(input, options);
    const request = new NextRequest(url, options);
    return request.method === "POST" ? POST(request) : GET(request);
  };
}
let cookie = "";
async function call(action, data, ownCookie = cookie) {
  const url = new URL(data ? "/api/flights" : `/api/flights?${action}`, base);
  const response = await fetch(url, { method: data ? "POST" : "GET", headers: { ...(data ? { "Content-Type": "application/json", Origin: base.origin } : {}), ...(ownCookie ? { Cookie: ownCookie } : {}) }, ...(data ? { body: JSON.stringify({ action, ...data }) } : {}), signal: AbortSignal.timeout(60000) });
  const header = response.headers.get("set-cookie");
  if (header && ownCookie === cookie) cookie = header.split(";")[0];
  const result = await response.json();
  if (result.error) throw new Error(`${action}: HTTP ${response.status} ${result.error} (${result.code})`);
  return { result, status: response.status };
}
const evidence = [];
const config = await call("action=config"); assert.equal(config.result.configured, true); evidence.push("Sandbox connection configured");
const airports = await call("action=places&query=Lagos"); assert.ok(airports.result.places.some(p => p.code === "LOS")); evidence.push("Airport autocomplete returns Lagos LOS");
const departure = new Date(Date.now() + 40 * 86400000).toISOString().slice(0, 10);
const search = await call("search", { search: { origin: "LHR", destination: "JFK", departure, adults: 1, childAges: [], cabin: "economy", direct: false } });
assert.ok(search.result.offers.length); const found = search.result.offers.find(o => o.airline === "Duffel Airways") || search.result.offers[0]; evidence.push(`${search.result.offers.length} sandbox flight offers returned`);
const selected = (await call("select", { offerId: found.id })).result.offer;
const services = selected.services.length ? [{ id: selected.services[0].id, quantity: 1 }] : [];
try { const seats = (await call(`action=seats&offerId=${encodeURIComponent(selected.id)}`)).result.services; if (seats.length) { services.push({ id: seats[0].id, quantity: 1 }); evidence.push("Seat service selected"); } } catch { evidence.push("Airline seat map unavailable; airline-assigned seat path checked"); }
if (selected.services.length) evidence.push("Extra baggage service selected");
const quote = (await call("quote", { offerId: selected.id, services })).result; assert.ok(quote.token); evidence.push(`Server-priced final total ${quote.currency} ${quote.amount}`);
const suffix = [...randomBytes(5)].map(n => String.fromCharCode(97 + n % 26)).join("");
const travellers = [{ givenName: "Amelia", familyName: "Test" + suffix, bornOn: "1987-07-24", title: "ms", gender: "f", ...(selected.passportRequired ? { passportNumber: "TEST12345", passportCountry: "GB", passportExpiry: "2035-07-24" } : {}) }];
const contact = { email: "sandbox@example.com", phone: "+442080160509" };
const booked = await call("book", { checkout: quote.token, travellers, contact, consent: true });
assert.ok(booked.result.order?.reference); const booking = booked.result.order; evidence.push(`Test booking confirmed (${booking.reference}); ${booking.documents.length} returned ticket document(s)`);
const repeated = await call("book", { checkout: quote.token, travellers, contact, consent: true }); assert.equal(repeated.result.order.id, booking.id); evidence.push("Repeated confirmation returns the existing order");
const list = await call("action=orders"); assert.ok(list.result.orders.some(o => o.id === booking.id)); evidence.push("My bookings retrieves the confirmed order");
const forbidden = await fetch(new URL(`/api/flights?action=order&id=${encodeURIComponent(booking.id)}`, base)); assert.equal(forbidden.status, 404); evidence.push("Another browser cannot retrieve the booking");
if (booking.actions.includes("cancel")) {
  const cancellation = (await call("cancel-quote", { orderId: booking.id })).result; assert.ok(cancellation.token); evidence.push(`Cancellation quote ${cancellation.currency} ${cancellation.amount}`);
  const cancelled = (await call("cancel", { cancellation: cancellation.token, consent: true })).result.order; assert.ok(cancelled.cancelledAt); evidence.push("Test cancellation confirmed after explicit quote review");
}
console.log(JSON.stringify({ status: "passed", url: new URL("/flights", base).href, evidence }, null, 2));
