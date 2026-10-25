import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { FlightBooking } from "./FlightBooking";
import "./flights.css";

export const metadata: Metadata = { title: "Flights · TerraScope", description: "Search flights, review fares and try TerraScope's complete booking preview.", robots: { index: false, follow: false } };
export default async function FlightsPage({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const params = await searchParams;
  return <main><SiteHeader active="flights" /><FlightBooking initialDestination={(params.destination || "").slice(0, 80)} /><SiteFooter /></main>;
}
