import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { atlasCountries } from "../atlas-data";
import { FlightEstimator } from "./FlightEstimator";
import "./flights.css";

export const metadata: Metadata = {
  title: "Flight estimates · TerraScope",
  description: "Estimate a flight budget, distance and travel time for your route.",
};

export default async function FlightsPage({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const { destination } = await searchParams;
  const country = typeof destination === "string"
    ? atlasCountries.find(({ name, code }) => destination === name || destination === code)
    : undefined;

  return (
    <main>
      <SiteHeader active="flights" />
      <FlightEstimator destinationCountry={country?.code} />
      <SiteFooter />
    </main>
  );
}
