import { atlasBySlug } from "../../../../atlas-data";
import { parseExchange } from "../../../../server/live-data";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const country = atlasBySlug.get((await params).slug),
    quote = country?.currencyCodes[0];
  if (!country) return Response.json({ error: "Not found" }, { status: 404 });
  if (!quote)
    return Response.json({ error: "Currency unavailable" }, { status: 404 });
  try {
    if (quote === "USD")
      return Response.json({
        quote,
        change: 0,
        currentDate: new Date().toISOString().slice(0, 10),
        previousDate: new Date(Date.now() - 30 * 86400000)
          .toISOString()
          .slice(0, 10),
      });
    const currentResponse = await fetch(
      `https://api.frankfurter.dev/v2/rate/USD/${quote}`,
      { signal: AbortSignal.timeout(6000), next: { revalidate: 21600 } },
    );
    if (!currentResponse.ok) throw Error("rate");
    const current = parseExchange(await currentResponse.json());
    const previousDate = new Date(Date.parse(current.date) - 30 * 86400000)
        .toISOString()
        .slice(0, 10),
      previousResponse = await fetch(
        `https://api.frankfurter.dev/v2/rate/USD/${quote}?date=${previousDate}`,
        { signal: AbortSignal.timeout(6000), next: { revalidate: 86400 } },
      );
    if (!previousResponse.ok) throw Error("history");
    const previous = parseExchange(await previousResponse.json());
    return Response.json(
      {
        quote,
        change: (previous.rate / current.rate - 1) * 100,
        currentDate: current.date,
        previousDate: previous.date,
      },
      { headers: { "Cache-Control": "public,s-maxage=21600" } },
    );
  } catch {
    return Response.json(
      { error: "Comparable reference rates unavailable" },
      { status: 503 },
    );
  }
}
