# TerraScope flight booking preview

`/flights` is a complete sandbox search and booking flow backed by Duffel v2. It supports airport/city autocomplete, one-way and return journeys, adults and children aged 2–15 (nine travellers maximum), cabin and connection filters, fare details, airline-provided baggage/seat extras, a fresh final quote, passenger details, balance-funded test orders, booking references and returned ticket numbers, booking retrieval, and cancellation quotes/confirmation when supported by the airline.

## Configuration

Set `DUFFEL_ACCESS_TOKEN` as a **server-only** Vercel Secret in Production and on the flight feature branch's Preview environment. Only a token beginning with `duffel_test_` is accepted. No browser environment prefix, token in source, or live-token fallback is used. No new SDK is needed: server requests use HTTP and `Duffel-Version: v2`.

Open **More → Flights (test mode)** in the main navigation, or visit `/flights`. The public site exposes the same sandbox flow; real flight sales are not enabled. The preview never collects a real payment card and cannot accept live Duffel credentials. It uses the provider's simulated balance. Prices and ticket documents from the sandbox are not valid for travel.

## Boundaries

- Every mutation requires same-origin JSON, bounded request bodies and server validation.
- Signed, HttpOnly, Secure-on-HTTPS, SameSite=Strict browser cookies bind checkout and order access to an opaque browser session. Provider metadata stores only an HMAC of that session and a random attempt identifier. Passenger names/contact/passport details are not stored in browser storage or logs.
- Final prices and service selections are signed server-side. The server retrieves the current fare again and rejects changed amounts/currencies before creating an order. Duffel enforces one booking attempt per offer request. The application also reconciles matching attempt metadata before another create call; it never automatically retries a create after an uncertain response.
- A pending attempt token (no passenger data) is retained in sessionStorage so interrupted confirmations can be checked after reload. The order is never called confirmed until the provider returns one.
- My bookings is browser-scoped (30-day session cookie), with ownership checked on both listing and direct retrieval. List pagination is filtered server-side. It is not an account-based or indefinite booking archive.
- The in-memory traffic limiter is a sandbox safeguard, not a shared production rate limiter.
- Cancellation is two-phase: show the airline's refund quote, then require explicit confirmation. A booking that does not advertise cancellation has no cancellation action.

## Validation

Run `node --import ./tests/ts-loader.mjs --test tests/flights.test.mjs`, `npx tsc --noEmit`, and `npm run build:vercel`. The sandbox smoke test uses fictional passenger details and confirms order recovery, ownership isolation and cancellation through the deployed API.

## Before live sales

Live activation is a separate delivery step: confirm provider eligibility and verification for the operator's actual business/country; integrate an approved payment method and funding; add durable account-linked booking/attempt records, provider webhook verification and reconciliation, shared rate limiting and operational support; test payment failure/refund/change cases with the provider. Add confirmation-email delivery with a reliable retry path. The existing test credential alone does not enable any of these capabilities. This preview deliberately refuses live credentials until that work is complete.

Official references: [test mode](https://duffel.com/docs/api/overview/test-mode), [offer requests](https://duffel.com/docs/api/offer-requests/create-offer-request), [orders](https://duffel.com/docs/api/orders/create-order), [accurate pricing](https://duffel.com/docs/guides/getting-an-accurate-price-before-booking), [bags](https://duffel.com/docs/guides/adding-extra-bags), [seats](https://duffel.com/docs/guides/adding-seats), [cancellation](https://duffel.com/docs/guides/cancelling-an-order), [response handling](https://duffel.com/docs/api/overview/response-handling/order-and-booking-creation).
