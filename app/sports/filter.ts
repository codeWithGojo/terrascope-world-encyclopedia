import type { Athlete } from "./data";
export function filterAthletes(items: Athlete[], query: string, sport: string, country: string) {
  const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const text = normalize(query).trim();
  return items.filter(p => (sport === "all" || p.sport === sport) && (!country || p.countryCodes.includes(country)) && (!text || normalize(`${p.name} ${p.nation} ${p.role} ${p.sport} ${p.milestones.join(" ")}`).includes(text)));
}
