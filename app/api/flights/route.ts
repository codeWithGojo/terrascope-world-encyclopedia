import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookieName, duffel, getOffer, offer, order, ownedOrder, ownedOrders, place, recover, sandboxToken, seatServices, session, sessionOwner, sign, unseal, type CheckoutToken, type RawOffer, type RawOrder } from "../../flights/server";
import { FlightError, requireValue, validateSearch, validateSelections, validateTravellers } from "../../flights/validation";
import type { Place, Selection } from "../../flights/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const limits = new Map<string, { count: number; until: number }>();
function rateLimit(key: string, maximum: number) {
  const now = Date.now();
  if (limits.size > 2000) for (const [k, v] of limits) if (v.until < now) limits.delete(k);
  const bucket = limits.get(key);
  if (!bucket || bucket.until < now) { limits.set(key, { count: 1, until: now + 60000 }); return; }
  if (++bucket.count > maximum) throw new FlightError("Too many requests. Wait a minute and try again.", 429, "rate_limited");
}
type CancellationToken = { id: string; orderId: string; owner: string; amount: string; currency: string };
type RawCancellation = { id: string; order_id: string; refund_amount: string; refund_currency: string; refund_to: string; expires_at: string; confirmed_at?: string };

async function handle(request: NextRequest) {
  const url = new URL(request.url), isPost = request.method === "POST";
  let browser: ReturnType<typeof session> | undefined;
  const reply = (body: unknown, status = 200) => {
    const response = NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff", Vary: "Cookie", "Referrer-Policy": "same-origin" } });
    if (browser) response.cookies.set(cookieName, browser.cookie, { httpOnly: true, secure: url.protocol === "https:", sameSite: "strict", path: "/api/flights", maxAge: 30 * 86400 });
    return response;
  };
  try {
    if (!isPost && url.searchParams.get("action") === "config") {
      try { sandboxToken(); browser = session(request.cookies.get(cookieName)?.value); return reply({ configured: true, mode: "test" }); }
      catch { return reply({ configured: false, mode: "test" }); }
    }
    sandboxToken();
    requireValue(request.headers.get("sec-fetch-site") !== "cross-site", "Open flight booking directly in TerraScope.", 403);
    if (isPost) {
      requireValue(request.headers.get("origin") === url.origin, "This request must come from TerraScope.", 403);
      requireValue(request.headers.get("content-type")?.startsWith("application/json"), "Send a JSON request.", 415);
    }
    browser = session(request.cookies.get(cookieName)?.value);
    const owner = sessionOwner(browser.id);
    // Sandbox traffic control; live sales also require a shared durable limiter.
    rateLimit(`ip:${request.headers.get("x-forwarded-for")?.split(",")[0] || browser.id}`, 60);
    let body: Record<string, unknown> = {};
    if (isPost) {
      requireValue(Number(request.headers.get("content-length") || 0) <= 32768, "Request is too large.", 413);
      const text = await request.text(); requireValue(Buffer.byteLength(text) <= 32768, "Request is too large.", 413);
      try { body = JSON.parse(text); } catch { throw new FlightError("Enter valid journey details."); }
      requireValue(body && typeof body === "object" && !Array.isArray(body), "Enter valid journey details.");
    }
    const action = isPost ? body.action : url.searchParams.get("action");
    if (!isPost && action === "places") {
      const query = url.searchParams.get("query")?.trim() || "";
      requireValue(query.length >= 2 && query.length <= 80, "Enter at least two letters of an airport or city.");
      const result = await duffel<Parameters<typeof place>[0][]>(`/places/suggestions?query=${encodeURIComponent(query)}`);
      const places: Place[] = result.data.filter(p => (p.type === "airport" || p.type === "city") && /^[A-Z]{3}$/.test(p.iata_code)).slice(0, 8).map(place);
      return reply({ places });
    }
    if (!isPost && action === "seats") {
      const id = url.searchParams.get("offerId") || ""; requireValue(/^off_[A-Za-z0-9]+$/.test(id), "Choose a flight first.");
      return reply({ services: await seatServices(id) });
    }
    if (!isPost && action === "orders") {
      const token = url.searchParams.get("cursor");
      const cursor = token ? unseal<{ owner: string; after: string }>(token, "orders-page") : undefined;
      requireValue(!cursor || cursor.owner === owner, "Invalid booking list.", 403);
      const result = await ownedOrders(owner, cursor?.after);
      return reply({ orders: result.orders, next: result.next ? sign("orders-page", { owner, after: result.next }) : null });
    }
    if (!isPost && action === "status") {
      const checkout = unseal<CheckoutToken>(url.searchParams.get("checkout"), "checkout", true);
      requireValue(checkout.owner === owner, "Booking not found in this browser session.", 404);
      const found = await recover(checkout);
      return reply({ order: found, state: found ? "confirmed" : "pending", reference: checkout.attempt }, found ? 200 : 202);
    }
    if (!isPost && action === "order") {
      return reply({ order: order(await ownedOrder(url.searchParams.get("id") || "", owner)) });
    }
    if (isPost && action === "search") {
      rateLimit(`search:${owner}`, 10);
      const s = validateSearch(body.search);
      const slices = [{ origin: s.origin, destination: s.destination, departure_date: s.departure }];
      if (s.returnDate) slices.push({ origin: s.destination, destination: s.origin, departure_date: s.returnDate });
      const result = await duffel<{ offers: RawOffer[]; id: string; live_mode: boolean }>("/air/offer_requests?return_offers=true&supplier_timeout=10000", "POST", { slices, passengers: [...Array.from({ length: s.adults }, () => ({ type: "adult" })), ...s.childAges.map(age => ({ age }))], cabin_class: s.cabin, max_connections: s.direct ? 0 : 2 }, 20000);
      requireValue(result.data.live_mode === false, "Live flight searches are disabled in this preview.", 503);
      const offers = result.data.offers.filter(o => o.live_mode === false && Date.parse(o.expires_at) > Date.now()).map(offer).sort((a, b) => a.currency.localeCompare(b.currency) || Number(a.amount) - Number(b.amount));
      return reply({ offers: offers.slice(0, 80), total: offers.length, mode: "test" });
    }
    if (isPost && action === "select") {
      requireValue(typeof body.offerId === "string", "Choose a flight.");
      const selected = offer(await getOffer(body.offerId));
      requireValue(Date.parse(selected.expiresAt) > Date.now(), "This fare has expired. Search for a new flight.", 409);
      return reply({ offer: selected });
    }
    if (isPost && action === "quote") {
      requireValue(typeof body.offerId === "string", "Choose a flight.");
      const raw = await getOffer(body.offerId), selected = offer(raw), services = validateSelections(body.services || []);
      requireValue(Date.parse(selected.expiresAt) > Date.now(), "This fare has expired. Search again.", 409);
      let available = selected.services;
      if (services.some(s => !available.some(a => a.id === s.id))) available = [...available, ...await seatServices(selected.id)];
      const seatAssignments = new Set<string>(), occupiedSeats = new Set<string>();
      for (const s of services) {
        const match = available.find(a => a.id === s.id);
        requireValue(match && s.quantity <= match.maximum, "An extra is no longer available. Review bags and seats.", 409);
        if (match.type === "seat") {
          const assignment = match.segmentIds[0] + ":" + match.passengerIds[0], seat = match.segmentIds[0] + ":" + match.seat;
          requireValue(!seatAssignments.has(assignment) && !occupiedSeats.has(seat) && s.quantity === 1, "Choose one different seat per traveller on each flight.");
          seatAssignments.add(assignment); occupiedSeats.add(seat);
        }
      }
      const priced = (await duffel<RawOffer>(`/air/offers/${selected.id}/actions/price`, "POST", { intended_payment_methods: [{ type: "balance" }], intended_services: services })).data;
      const finalOffer = offer(priced);
      const expires = Math.min(Date.parse(finalOffer.expiresAt), Date.now() + 10 * 60000);
      requireValue(expires > Date.now(), "This fare has expired. Search again.", 409);
      const checkout: CheckoutToken = { owner, offerId: finalOffer.id, amount: finalOffer.amount, currency: finalOffer.currency, services, attempt: randomUUID(), departure: finalOffer.slices[0].segments[0].departure.slice(0, 10) };
      return reply({ token: sign("checkout", checkout, Math.floor((expires - Date.now()) / 1000)), offer: finalOffer, amount: finalOffer.amount, currency: finalOffer.currency, expiresAt: new Date(expires).toISOString(), services });
    }
    if (isPost && action === "book") {
      requireValue(body.consent === true, "Confirm that you understand this is a test booking.");
      const checkout = unseal<CheckoutToken>(body.checkout, "checkout");
      requireValue(checkout.owner === owner, "This checkout belongs to another browser session.", 403);
      const existing = await recover(checkout); if (existing) return reply({ order: existing, state: "confirmed" });
      const raw = await getOffer(checkout.offerId), selected = offer(raw);
      requireValue(Date.parse(selected.expiresAt) > Date.now(), "This fare has expired. Search again.", 409);
      requireValue(Number(selected.amount) === Number(checkout.amount) && selected.currency === checkout.currency, "The fare has changed. Review the latest total before confirming.", 409);
      const passengers = validateTravellers(body.travellers, body.contact, selected.passengers, checkout.departure, selected.passportRequired);
      const result = await duffel<RawOrder>("/air/orders", "POST", { type: "instant", selected_offers: [checkout.offerId], passengers, services: checkout.services, payments: [{ type: "balance", amount: checkout.amount, currency: checkout.currency }], metadata: { terrascope_owner: owner, terrascope_attempt: checkout.attempt } }, 45000);
      return reply({ order: order(result.data), state: "confirmed" }, 201);
    }
    if (isPost && action === "cancel-quote") {
      requireValue(typeof body.orderId === "string", "Choose a booking.");
      const existing = await ownedOrder(body.orderId, owner);
      requireValue(existing.available_actions.includes("cancel") && !existing.cancelled_at, "This booking cannot be cancelled online.", 409);
      const quote = (await duffel<RawCancellation>("/air/order_cancellations", "POST", { order_id: existing.id })).data;
      const expiry = Math.min(Date.parse(quote.expires_at), Date.now() + 10 * 60000);
      return reply({ token: sign("cancellation", { id: quote.id, orderId: existing.id, owner, amount: quote.refund_amount, currency: quote.refund_currency } satisfies CancellationToken, Math.max(1, Math.floor((expiry - Date.now()) / 1000))), orderId: existing.id, amount: quote.refund_amount, currency: quote.refund_currency, refundTo: quote.refund_to, expiresAt: quote.expires_at });
    }
    if (isPost && action === "cancel") {
      requireValue(body.consent === true, "Confirm cancellation after reviewing the refund.");
      const cancellation = unseal<CancellationToken>(body.cancellation, "cancellation");
      requireValue(cancellation.owner === owner, "This cancellation belongs to another browser session.", 403);
      const existing = await ownedOrder(cancellation.orderId, owner);
      if (existing.cancelled_at) return reply({ order: order(existing) });
      await duffel(`/air/order_cancellations/${cancellation.id}/actions/confirm`, "POST", {});
      return reply({ order: order(await ownedOrder(cancellation.orderId, owner)) });
    }
    throw new FlightError("Flight action not found.", 404);
  } catch (error) {
    const e = error instanceof FlightError ? error : new FlightError("Flight booking is temporarily unavailable. Please try again shortly.", 503, "unavailable");
    return reply({ error: e.message, code: e.code, reference: e.reference, state: e.uncertain ? "pending" : "failed" }, e.status);
  }
}
export const GET = handle;
export const POST = handle;
