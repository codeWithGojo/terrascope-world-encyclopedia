import { atlasBySlug } from "../../../../atlas-data";
const adviceSlugs: Record<string, string> = {
  US: "usa",
  GB: "united-kingdom",
  CI: "cote-d-ivoire",
  CD: "democratic-republic-of-the-congo",
  CG: "congo",
  VA: "holy-see",
  PS: "the-occupied-palestinian-territories",
  KR: "south-korea",
  KP: "north-korea",
  TL: "east-timor",
  CZ: "czechia",
  SZ: "eswatini",
  MM: "myanmar",
};
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const country = atlasBySlug.get((await params).slug);
  if (!country)
    return Response.json({ error: "Country not found" }, { status: 404 });
  const slug = adviceSlugs[country.code] || country.slug;
  if (country.code === "GB")
    return Response.json(
      {
        error: "FCDO does not issue foreign travel advice for the UK.",
        sourceUrl: "https://www.gov.uk/foreign-travel-advice",
      },
      { status: 404 },
    );
  const sourceUrl = `https://www.gov.uk/foreign-travel-advice/${slug}`;
  try {
    const response = await fetch(
      `https://www.gov.uk/api/content/foreign-travel-advice/${slug}`,
      {
        signal: AbortSignal.timeout(7000),
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      },
    );
    if (!response.ok) throw Error("provider");
    const raw = (await response.json()) as {
        details?: {
          alert_status: unknown[];
          reviewed_at?: string;
          updated_at?: string;
          change_description?: string;
        };
      },
      d = raw.details;
    if (!d || !Array.isArray(d.alert_status)) throw Error("shape");
    const labels: Record<string, string> = {
      avoid_all_travel_to_whole_country: "FCDO advises against all travel",
      avoid_all_travel_to_parts: "FCDO advises against all travel to parts",
      avoid_all_but_essential_travel_to_whole_country:
        "FCDO advises against all but essential travel",
      avoid_all_but_essential_travel_to_parts:
        "FCDO advises against all but essential travel to parts",
    };
    return Response.json(
      {
        alerts: d.alert_status.map(
          (v) => labels[String(v)] || "Read the latest FCDO advice",
        ),
        updatedAt: d.reviewed_at || d.updated_at,
        checkedAt: new Date().toISOString(),
        sourceUrl,
        source: "UK Foreign, Commonwealth & Development Office",
        summary:
          d.change_description?.replace(/<[^>]*>/g, "").slice(0, 800) || "",
        scope:
          "Advice for British travellers. Regional warnings and individual circumstances matter.",
      },
      {
        headers: {
          "Cache-Control": "public,s-maxage=3600,stale-while-revalidate=3600",
        },
      },
    );
  } catch {
    return Response.json(
      { error: "The latest advisory could not be loaded.", sourceUrl },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
