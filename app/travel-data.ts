import type {AtlasCountry} from "./atlas-data";
import type {TravelPlace} from "./country-content";

export type CountryTravelPlan = {
  bestFor: string;
  suggestedStay: string;
  route: string;
  places: TravelPlace[];
};

const signatureSightByCode: Record<string, string> = {
  AD:"Madriu-Perafita-Claror Valley",AE:"Burj Khalifa",AF:"Band-e Amir National Park",AG:"Nelson's Dockyard",AL:"Butrint",AM:"Geghard Monastery",AO:"Kalandula Falls",AR:"Iguazú Falls",AT:"Schönbrunn Palace",AU:"Great Barrier Reef",AZ:"Icherisheher",BA:"Stari Most",BB:"Harrison's Cave",BD:"Sundarbans",BE:"Grand Place",BF:"Ruins of Loropéni",BG:"Rila Monastery",BH:"Bahrain Fort",BI:"Lake Tanganyika",BJ:"Royal Palaces of Abomey",BN:"Omar Ali Saifuddien Mosque",BO:"Salar de Uyuni",BR:"Christ the Redeemer",BS:"Exuma Cays",BT:"Paro Taktsang",BW:"Okavango Delta",BY:"Mir Castle",BZ:"Great Blue Hole",CA:"Banff National Park",CD:"Virunga National Park",CF:"Dzanga-Sangha National Park",CG:"Odzala-Kokoua National Park",CH:"Matterhorn",CI:"Basilica of Our Lady of Peace",CL:"Torres del Paine National Park",CM:"Mount Cameroon",CN:"Great Wall of China",CO:"Cartagena walled city",CR:"Arenal Volcano",CU:"Old Havana",CV:"Pico do Fogo",CY:"Paphos Archaeological Park",CZ:"Prague Castle",DE:"Neuschwanstein Castle",DJ:"Lake Assal",DK:"Nyhavn",DM:"Boiling Lake",DO:"Zona Colonial",DZ:"Tassili n'Ajjer",EC:"Galápagos Islands",EE:"Tallinn Old Town",EG:"Pyramids of Giza",ER:"Asmara modernist city",ES:"Sagrada Família",ET:"Rock-Hewn Churches of Lalibela",FI:"Suomenlinna",FJ:"Mamanuca Islands",FM:"Nan Madol",FR:"Eiffel Tower",GA:"Lopé National Park",GB:"Tower of London",GD:"Grand Anse Beach",GE:"Gergeti Trinity Church",GH:"Cape Coast Castle",GM:"Kunta Kinteh Island",GN:"Fouta Djallon",GQ:"Pico Basile",GR:"Acropolis of Athens",GT:"Tikal",GW:"Bijagós Archipelago",GY:"Kaieteur Falls",HN:"Copán",HR:"Dubrovnik Old Town",HT:"Citadelle Laferrière",HU:"Hungarian Parliament Building",ID:"Borobudur",IE:"Cliffs of Moher",IL:"Old City of Jerusalem",IN:"Taj Mahal",IQ:"Erbil Citadel",IR:"Persepolis",IS:"Þingvellir National Park",IT:"Colosseum",JM:"Dunn's River Falls",JO:"Petra",JP:"Mount Fuji",KE:"Maasai Mara",KG:"Issyk-Kul",KH:"Angkor Wat",KI:"Kiritimati",KM:"Mount Karthala",KN:"Brimstone Hill Fortress",KP:"Mount Paektu",KR:"Gyeongbokgung Palace",KW:"Kuwait Towers",KZ:"Charyn Canyon",LA:"Luang Prabang",LB:"Baalbek",LC:"Pitons",LI:"Vaduz Castle",LK:"Sigiriya",LR:"Sapo National Park",LS:"Maletsunyane Falls",LT:"Vilnius Old Town",LU:"Vianden Castle",LV:"Riga Old Town",LY:"Leptis Magna",MA:"Jemaa el-Fnaa",MC:"Monte Carlo Casino",MD:"Orheiul Vechi",ME:"Bay of Kotor",MG:"Avenue of the Baobabs",MH:"Bikini Atoll",MK:"Lake Ohrid",ML:"Great Mosque of Djenné",MM:"Bagan",MN:"Gobi Desert",MR:"Chinguetti",MT:"Valletta",MU:"Le Morne Brabant",MV:"Baa Atoll",MW:"Lake Malawi",MX:"Chichén Itzá",MY:"Petronas Towers",MZ:"Bazaruto Archipelago",NA:"Sossusvlei",NE:"Aïr and Ténéré",NG:"Zuma Rock",NI:"Ometepe Island",NL:"Rijksmuseum",NO:"Geirangerfjord",NP:"Mount Everest",NR:"Buada Lagoon",NZ:"Milford Sound",OM:"Sultan Qaboos Grand Mosque",PA:"Panama Canal",PE:"Machu Picchu",PG:"Kokoda Track",PH:"Banaue Rice Terraces",PK:"Lahore Fort",PL:"Wawel Castle",PS:"Church of the Nativity",PT:"Belém Tower",PW:"Rock Islands",PY:"Jesuit Missions of La Santísima Trinidad",QA:"Museum of Islamic Art Doha",RO:"Bran Castle",RS:"Belgrade Fortress",RU:"Red Square",RW:"Volcanoes National Park",SA:"Al-Ula",SB:"Marovo Lagoon",SC:"Vallée de Mai",SD:"Pyramids of Meroë",SE:"Vasa Museum",SG:"Gardens by the Bay",SI:"Lake Bled",SK:"Spiš Castle",SL:"Tiwai Island",SM:"Guaita Tower",SN:"Gorée Island",SO:"Laas Geel",SR:"Central Suriname Nature Reserve",SS:"Boma National Park",ST:"Pico Cão Grande",SV:"Santa Ana Volcano",SY:"Ancient City of Damascus",SZ:"Mlilwane Wildlife Sanctuary",TD:"Ennedi Plateau",TG:"Koutammakou",TH:"Grand Palace Bangkok",TJ:"Pamir Mountains",TL:"Atauro Island",TM:"Darvaza gas crater",TN:"Amphitheatre of El Jem",TO:"Mapu'a Vaea Blowholes",TR:"Cappadocia",TT:"Maracas Bay",TV:"Funafuti Conservation Area",TZ:"Serengeti National Park",UA:"Saint Sophia's Cathedral Kyiv",UG:"Bwindi Impenetrable National Park",US:"Grand Canyon",UY:"Colonia del Sacramento",UZ:"Registan",VA:"St. Peter's Basilica",VC:"Tobago Cays",VE:"Angel Falls",VN:"Hạ Long Bay",VU:"Mount Yasur",WS:"To Sua Ocean Trench",YE:"Old City of Sana'a",ZA:"Table Mountain",ZM:"Victoria Falls",ZW:"Great Zimbabwe",
};

function landscapeLabel(country: AtlasCountry, terrain?: string) {
  if (country.landlocked) return `${country.name} landscapes`;
  if (terrain?.toLowerCase().includes("island")) return `${country.name} islands & coast`;
  return `${country.name} coast & nature`;
}

export function buildCountryTravelPlan(country: AtlasCountry, terrain?: string, curated: TravelPlace[] = []): CountryTravelPlan {
  const signature = signatureSightByCode[country.code];
  const capital = country.capital.split(" · ")[0];
  const basePlaces: TravelPlace[] = [
    {name: capital, kind:"City", note:`Start in ${capital} for national museums, neighbourhood life, food and the easiest onward connections.`},
    signature ? {name: signature, kind:"Landmark", note:`One of ${country.name}’s signature sights and a natural anchor for a first itinerary.`} : null,
    {name:`${country.name} historic heritage`, kind:"Landmark", note:"Make time for historic districts, archaeological sites, places of worship and community museums."},
    {name:landscapeLabel(country, terrain), kind:"Landmark", note:terrain?`Plan an outdoor stop around the country’s ${terrain.toLowerCase()}. Check season, access and guide requirements.`:"Add a national park, coast or countryside stop and verify seasonal access."},
  ].filter(Boolean) as TravelPlace[];

  const merged = [...curated, ...basePlaces].filter((place, index, list) => list.findIndex((item) => item.name.toLowerCase() === place.name.toLowerCase()) === index).slice(0, 8);
  const climate = country.latitude > 23.5 ? "seasonal weather and daylight" : country.latitude < -23.5 ? "southern-season weather" : "rainfall, heat and local festival dates";
  return {
    bestFor: `${country.subregion} culture · food · history · ${country.landlocked ? "landscapes" : "coast and landscapes"}`,
    suggestedStay: country.area < 2_000 ? "2–4 days" : country.area < 100_000 ? "5–8 days" : "7–14 days",
    route: `Begin in ${capital}, add ${signature ?? "a major heritage stop"}, then slow the pace for a regional or nature extension. Build the final order around ${climate}.`,
    places: merged,
  };
}
