export type FunOption = {name:string; note:string; multiplier:number; setting:"Indoor"|"Outdoor"|"Either"; group:string; sourceUrl?:string; provider?:string; checkedAt?:string};

// Activity ideas are not assertions that a venue operates in every destination.
// Multipliers are relative planning allowances, never quotes or ticket prices.
export const funCatalogue:FunOption[] = [
 {name:"Paintball",note:"Book a supervised session; ask whether markers, protective gear and paint refills are included.",multiplier:1.5,setting:"Outdoor",group:"Team outing"},
 {name:"Swimming / pool day",note:"Choose a pool with suitable supervision. Confirm day-pass access, changing facilities and guest rules.",multiplier:1,setting:"Either",group:"Solo or group"},
 {name:"Sip and paint (drink and paint)",note:"Ask about canvases, materials and drinks; choose an alcohol-free session if preferred.",multiplier:1.5,setting:"Either",group:"Creative outing"},
 {name:"Shoothouse / target-game simulation",note:"Look for a supervised recreational laser or virtual target-game venue; confirm the actual game format before booking.",multiplier:1.5,setting:"Indoor",group:"Team outing"},
 {name:"Rage room",note:"Confirm protective equipment, operator supervision, age restrictions and the items included in the session.",multiplier:1.5,setting:"Indoor",group:"Small group"},
 {name:"Movies",note:"Check the cinema programme, film rating and seat class; budget for snacks separately.",multiplier:.75,setting:"Indoor",group:"Solo or group"},
 {name:"Bowling",note:"Ask whether pricing is per lane or per person, and whether shoe hire is included.",multiplier:1,setting:"Indoor",group:"Group outing"},
 {name:"Go-karting",note:"Confirm session length, driver height limits, helmets and whether the track is operating that day.",multiplier:1.5,setting:"Either",group:"Group outing"},
 {name:"Escape room",note:"Reserve a suitable difficulty level and confirm the minimum team size and session duration.",multiplier:1.25,setting:"Indoor",group:"Team outing"},
 {name:"Laser tag",note:"Check group size, session length and age requirements; ask whether private sessions are available.",multiplier:1,setting:"Indoor",group:"Team outing"},
 {name:"Arcade games",note:"Set a token or credit limit before playing and check which games are included.",multiplier:.75,setting:"Indoor",group:"Solo or group"},
 {name:"Virtual reality games",note:"Ask about available experiences, headset hygiene, motion comfort and session length.",multiplier:1,setting:"Indoor",group:"Small group"},
 {name:"Karaoke",note:"Confirm a private room or open-mic format, booking duration and food or drink minimum spend.",multiplier:1,setting:"Indoor",group:"Group outing"},
 {name:"Board-game cafe",note:"Check the game library and whether there is a table fee, cover charge or food minimum.",multiplier:.5,setting:"Indoor",group:"Group outing"},
 {name:"Mini golf",note:"Confirm course access and equipment hire; allow extra time for a larger group.",multiplier:.75,setting:"Either",group:"Solo or group"},
 {name:"Trampoline park",note:"Confirm age rules, required socks and a suitable session for your group.",multiplier:1,setting:"Indoor",group:"Group outing"},
 {name:"Pottery workshop",note:"Ask whether instruction, clay, firing and collection or delivery are covered.",multiplier:1.25,setting:"Indoor",group:"Creative outing"},
 {name:"Candle-making workshop",note:"Confirm materials, fragrance options and how long your finished piece needs to set.",multiplier:1,setting:"Indoor",group:"Creative outing"},
 {name:"Cooking class",note:"Check the menu, dietary requirements, ingredients and whether the meal is included.",multiplier:1.5,setting:"Indoor",group:"Creative outing"},
 {name:"Comedy show",note:"Confirm the event date, ticket tier and age rating; only count a show once the programme is published.",multiplier:1,setting:"Indoor",group:"Solo or group"},
 {name:"Live music",note:"Confirm the artist, start time, ticket terms and transport home.",multiplier:1.25,setting:"Either",group:"Solo or group"},
 {name:"Dance class",note:"Choose a beginner-friendly style if needed and confirm clothing, partner rules and session duration.",multiplier:.75,setting:"Indoor",group:"Creative outing"},
 {name:"Picnic",note:"Choose a public space where picnics are permitted. Food, equipment and transport need separate allowances.",multiplier:.25,setting:"Outdoor",group:"Group outing"},
 {name:"Cycling / bike hire",note:"Use a suitable route and confirm helmets, bike condition, rental duration and return arrangements.",multiplier:1,setting:"Outdoor",group:"Solo or group"},
 {name:"Kayaking",note:"Use an operator with life jackets and suitable conditions; confirm skill requirements and water access.",multiplier:1.25,setting:"Outdoor",group:"Small group"},
 {name:"Indoor climbing",note:"Confirm introductory instruction, equipment hire and age restrictions.",multiplier:1.25,setting:"Indoor",group:"Solo or group"},
 {name:"Roller skating",note:"Check skate hire, protective equipment and beginner sessions.",multiplier:1,setting:"Either",group:"Solo or group"},
 {name:"Beach games",note:"Confirm public access, weather and any entry fee; arrange equipment and shade.",multiplier:.5,setting:"Outdoor",group:"Group outing"},
 {name:"Photography walk",note:"Choose a permitted route, ask before photographing people and respect restricted sites.",multiplier:.25,setting:"Outdoor",group:"Solo or group"},
 {name:"Trivia night",note:"Confirm the event date, team limits and any entry fee or minimum spend.",multiplier:.5,setting:"Indoor",group:"Team outing"},
];

export function funFor(country:string,city:string):FunOption[]{
 return funCatalogue.map(option=>{
  if(country==="Nigeria"&&["Lagos","Abuja"].includes(city)&&option.name.startsWith("Sip and paint"))return {...option,provider:"Sip and Paint NG",sourceUrl:"https://sipandpaint.ng/",checkedAt:"2026-09-30",note:option.note+" The provider lists experiences in Lagos and Abuja; confirm the specific venue and date."};
  if(country==="Nigeria"&&["Lagos","Abuja","Port Harcourt","Asaba"].includes(city)&&option.name==="Movies")return {...option,provider:"Genesis Cinemas",sourceUrl:"https://www.linkedin.com/company/genesis-cinemas-limited/",checkedAt:"2026-09-30",note:option.note+" The operator’s location list includes this city; confirm the branch and showtime directly."};
  return {...option,note:option.note+" Outing idea: a local venue and availability still need confirmation."};
 });
}
