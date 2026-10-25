import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server.js";
import { GET, POST } from "../app/api/flights/route.ts";
import { sign, session, sessionOwner, unseal, cookieName } from "../app/flights/server.ts";
import { ageOn, realDate, validateSearch, validateTravellers } from "../app/flights/validation.ts";

const originalFetch = globalThis.fetch, originalToken = process.env.DUFFEL_ACCESS_TOKEN;
beforeEach(() => { process.env.DUFFEL_ACCESS_TOKEN = "duffel_test_unit_test_fixture"; });
afterEach(() => { globalThis.fetch = originalFetch; if (originalToken === undefined) delete process.env.DUFFEL_ACCESS_TOKEN; else process.env.DUFFEL_ACCESS_TOKEN = originalToken; });
const today = new Date().toISOString().slice(0, 10), departure = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
const search = { origin: "LHR", destination: "JFK", departure, adults: 1, childAges: [], cabin: "economy", direct: false };
const origin = { id: "arp_lhr_gb", name: "Heathrow", iata_code: "LHR", city_name: "London", type: "airport" }, destination = { ...origin, id: "arp_jfk_us", name: "JFK", iata_code: "JFK", city_name: "New York" };
const rawOffer = { id: "off_fixture", offer_request_id: "orq_fixture", live_mode: false, owner: { name: "Duffel Airways" }, total_amount: "100.00", total_currency: "GBP", expires_at: new Date(Date.now() + 900000).toISOString(), passengers: [{ id: "pas_fixture", type: "adult" }], slices: [{ id: "sli_fixture", origin, destination, duration: "PT7H", segments: [{ id: "seg_fixture", origin, destination, departing_at: departure + "T09:00:00", arriving_at: departure + "T11:00:00", duration: "PT7H", operating_carrier: { name: "Duffel Airways", iata_code: "ZZ" }, operating_carrier_flight_number: "123", passengers: [{ cabin_class: "economy", baggages: [{ type: "checked", quantity: 1 }] }] }] }], conditions: {}, available_services: [], passenger_identity_documents_required: false };
const traveller = { givenName: "Amelia", familyName: "Earhart", bornOn: "1987-07-24", title: "ms", gender: "f" }, contact = { email: "traveller@example.com", phone: "+442080160509" };
function context() { const browser = session(); return { browser, owner: sessionOwner(browser.id), cookie: `${cookieName}=${browser.cookie}` }; }
function request(action, data, cookie, extra = {}) {
  const method = data ? "POST" : "GET";
  return new NextRequest(`https://terrascope.example/api/flights${data ? "" : `?${action}`}`, { method, headers: { ...(data ? { "Content-Type": "application/json", Origin: "https://terrascope.example" } : {}), ...(cookie ? { Cookie: cookie } : {}), ...extra }, ...(data ? { body: JSON.stringify({ action, ...data }) } : {}) });
}
function envelope(data, status = 200) { return Response.json({ data }, { status }); }
function checkout(owner, overrides = {}) { return sign("checkout", { owner, offerId: rawOffer.id, amount: rawOffer.total_amount, currency: rawOffer.total_currency, services: [], attempt: "unit-attempt", departure, ...overrides }); }
function rawOrder(owner) { return { ...rawOffer, id: "ord_fixture", offer_id: rawOffer.id, booking_reference: "TEST12", created_at: new Date().toISOString(), passengers: [{ id: "pas_fixture", given_name: "Amelia", family_name: "Earhart" }], documents: [{ type: "electronic_ticket", unique_identifier: "0000001234" }], available_actions: ["cancel"], cancelled_at: null, payment_status: { awaiting_payment: false }, metadata: { terrascope_owner: owner, terrascope_attempt: "unit-attempt" } }; }

test("invalid calendar dates, route, child ages and return dates are rejected", () => {
  assert.equal(realDate("2026-02-30"), false);
  assert.equal(ageOn("2010-10-26", "2026-10-25"), 15);
  for (const change of [{ destination: "LHR" }, { departure: "2026-02-30" }, { returnDate: "2020-01-01" }, { adults: 0 }, { adults: 9, childAges: [8] }, { childAges: [1] }]) assert.throws(() => validateSearch({ ...search, ...change }, today));
  assert.equal(validateSearch(search, today).origin, "LHR");
});
test("passenger ages, duplicate names and required identity documents are checked", () => {
  assert.throws(() => validateTravellers([{ ...traveller, bornOn: "2020-01-01" }], contact, rawOffer.passengers, departure, false), /match the age/);
  assert.throws(() => validateTravellers([traveller, traveller], contact, [rawOffer.passengers[0], { id: "pas_two", type: "adult" }], departure, false), /different full name/);
  assert.throws(() => validateTravellers([traveller], contact, rawOffer.passengers, departure, true), /passport number/);
  assert.equal(validateTravellers([traveller], contact, rawOffer.passengers, departure, false)[0].id, "pas_fixture");
});
test("live credentials are rejected before a provider request", async () => {
  process.env.DUFFEL_ACCESS_TOKEN = "duffel_live_unit_test_fixture"; let called = false; globalThis.fetch = async () => { called = true; throw Error(); };
  const response = await POST(request("search", { search })); assert.equal(response.status, 503); assert.equal(called, false);
});
test("cross-origin mutation is rejected", async () => {
  const response = await POST(request("search", { search }, undefined, { Origin: "https://other.example" })); assert.equal(response.status, 403);
});
test("new sessions are HttpOnly, Secure and SameSite=Strict", async () => {
  const response = await GET(request("action=config")); const cookie = response.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/i); assert.match(cookie, /Secure/i); assert.match(cookie, /SameSite=strict/i);
});
test("server removes client keys and private provider fields from flight results", async () => {
  globalThis.fetch = async () => envelope({ live_mode: false, offers: [{ ...rawOffer, client_key: "not-for-client", metadata: { secret: "private" } }] });
  const response = await POST(request("search", { search })); assert.equal(response.status, 200); const text = await response.text(); assert.doesNotMatch(text, /not-for-client|private|unit_test_fixture/); assert.match(text, /Duffel Airways/);
});
test("tampered checkout and a different browser cannot place an order", async () => {
  const a = context(), b = context(); let called = false; globalThis.fetch = async () => { called = true; throw Error(); };
  for (const [token, cookie] of [[checkout(a.owner) + "x", a.cookie], [checkout(a.owner), b.cookie]]) {
    const response = await POST(request("book", { checkout: token, consent: true, travellers: [traveller], contact }, cookie)); assert.equal(response.status, 403);
  }
  assert.equal(called, false);
});
test("a changed fare stops booking before payment", async () => {
  const c = context(); let created = false;
  globalThis.fetch = async (url, options) => { if (String(url).includes("/air/orders?") ) return envelope([]); if (options.method === "POST") created = true; return envelope({ ...rawOffer, total_amount: "120.00" }); };
  const response = await POST(request("book", { checkout: checkout(c.owner), consent: true, travellers: [traveller], contact }, c.cookie)); assert.equal(response.status, 409); assert.equal(created, false);
});
test("test order uses only the server quote and is recoverable without another purchase", async () => {
  const c = context(); let created = null, saved = null, creates = 0;
  globalThis.fetch = async (url, options) => {
    if (String(url).includes("/air/orders?")) return envelope(saved ? [saved] : []);
    if (String(url).includes("/air/offers/")) return envelope(rawOffer);
    if (String(url).endsWith("/air/orders")) { creates++; created = JSON.parse(options.body).data; saved = rawOrder(c.owner); return envelope(saved, 201); }
    throw Error("Unexpected request");
  };
  const body = { checkout: checkout(c.owner), consent: true, travellers: [traveller], contact, amount: "0.01" };
  const first = await POST(request("book", body, c.cookie)), second = await POST(request("book", body, c.cookie));
  assert.equal(first.status, 201); assert.equal(second.status, 200); assert.equal(creates, 1);
  assert.equal(created.payments[0].amount, "100.00"); assert.equal(created.payments[0].type, "balance"); assert.equal(created.metadata.terrascope_owner, c.owner);
  const result = await first.json(); assert.equal(result.order.reference, "TEST12"); assert.equal(result.order.documents[0].number, "0000001234"); assert.equal(result.order.passengers[0].email, undefined);
});
test("uncertain order creation is pending, never a false confirmation", async () => {
  const c = context();
  globalThis.fetch = async (url, options) => {
    if (String(url).includes("/air/orders?")) return envelope([]);
    if (options.method === "GET") return envelope(rawOffer);
    return Response.json({ meta: { request_id: "pending-fixture" } }, { status: 202 });
  };
  const response = await POST(request("book", { checkout: checkout(c.owner), consent: true, travellers: [traveller], contact }, c.cookie)); const result = await response.json(); assert.equal(response.status, 202); assert.equal(result.state, "pending"); assert.equal(result.order, undefined);
});
test("booking lists filter by ownership and direct access to another booking is denied", async () => {
  const c = context();
  globalThis.fetch = async url => String(url).includes("/air/orders?") ? envelope([rawOrder(c.owner), { ...rawOrder("another-owner"), id: "ord_other" }]) : envelope(rawOrder("another-owner"));
  const list = await GET(request("action=orders", undefined, c.cookie)); assert.equal((await list.json()).orders.length, 1);
  const other = await GET(request("action=order&id=ord_other", undefined, c.cookie)); assert.equal(other.status, 404);
});
test("expired checkout is rejected, but remains usable only for status recovery", () => {
  const token = sign("checkout", { owner: "test" }, -1); assert.throws(() => unseal(token, "checkout")); assert.equal(unseal(token, "checkout", true).owner, "test");
});
