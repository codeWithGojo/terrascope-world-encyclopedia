import airportData from "../datasets/flight-airports.json";

export type Airport = [code: string, city: string, name: string, country: string, latitude: number, longitude: number];
export const airports = airportData as Airport[];

export function estimateFlight(from: Airport, to: Airport, passengers: number, roundTrip: boolean) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const lat1 = radians(from[4]);
  const lat2 = radians(to[4]);
  const lonDelta = radians(to[5] - from[5]);
  const arc = Math.sin((lat2 - lat1) / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(lonDelta / 2) ** 2;
  const distanceKm = 2 * 6371 * Math.asin(Math.sqrt(Math.min(1, arc)));
  const flightMinutes = Math.round((35 + distanceKm / 800 * 60) / 5) * 5;

  // Illustrative USD allowances per leg and passenger, independent of live fares.
  const legsAndTravellers = passengers * (roundTrip ? 2 : 1);
  const lowPerLeg = Math.floor((45 + 0.055 * distanceKm) / 5) * 5;
  const highPerLeg = Math.ceil((125 + 0.14 * distanceKm) / 5) * 5;

  return {
    distanceKm: Math.round(distanceKm),
    flightMinutes,
    low: lowPerLeg * legsAndTravellers,
    high: highPerLeg * legsAndTravellers,
  };
}
