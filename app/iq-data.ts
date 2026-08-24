export type IqRanking = {
  code: string;
  country: string;
  score: number;
};

export const iqDataset = {
  title: "International IQ Test country averages",
  year: 2025,
  sourceLabel: "International IQ Test 2025, compiled by World Population Review",
  sourceUrl: "https://worldpopulationreview.com/country-rankings/average-iq-by-country",
  methodologyUrl: "https://international-iq-test.com/en/test/IQ_by_country",
  note: "These are self-selected online test averages, not a measure of a population's innate ability. Education, nutrition, language, internet access, test familiarity and sample composition all affect cross-country comparisons.",
};

const rows: IqRanking[] = [
  {code:"KR",country:"South Korea",score:106.97},{code:"CN",country:"China",score:106.48},{code:"JP",country:"Japan",score:106.30},
  {code:"IR",country:"Iran",score:104.80},{code:"AU",country:"Australia",score:104.45},{code:"RU",country:"Russia",score:103.78},
  {code:"SG",country:"Singapore",score:103.56},{code:"MN",country:"Mongolia",score:102.61},{code:"NZ",country:"New Zealand",score:102.35},
  {code:"VN",country:"Vietnam",score:102.26},{code:"ES",country:"Spain",score:102.24},{code:"CY",country:"Cyprus",score:102.12},
  {code:"CA",country:"Canada",score:102.09},{code:"GB",country:"United Kingdom",score:101.57},{code:"LK",country:"Sri Lanka",score:101.22},
  {code:"SI",country:"Slovenia",score:101.15},{code:"BY",country:"Belarus",score:101.05},{code:"US",country:"United States",score:101.04},
  {code:"AL",country:"Albania",score:101.00},{code:"CH",country:"Switzerland",score:100.84},{code:"GE",country:"Georgia",score:100.35},
  {code:"IT",country:"Italy",score:100.33},{code:"NL",country:"Netherlands",score:100.27},{code:"PE",country:"Peru",score:100.20},
  {code:"HU",country:"Hungary",score:100.15},{code:"AM",country:"Armenia",score:100.13},{code:"FR",country:"France",score:100.12},
  {code:"FI",country:"Finland",score:99.97},{code:"PT",country:"Portugal",score:99.95},{code:"LT",country:"Lithuania",score:99.95},
  {code:"TH",country:"Thailand",score:99.94},{code:"RS",country:"Serbia",score:99.83},{code:"AT",country:"Austria",score:99.80},
  {code:"BE",country:"Belgium",score:99.74},{code:"MT",country:"Malta",score:99.68},{code:"GR",country:"Greece",score:99.55},
  {code:"CZ",country:"Czechia",score:99.36},{code:"DE",country:"Germany",score:99.32},{code:"HR",country:"Croatia",score:99.32},
  {code:"PL",country:"Poland",score:99.14},{code:"LB",country:"Lebanon",score:99.13},{code:"EE",country:"Estonia",score:99.08},
  {code:"LV",country:"Latvia",score:99.01},{code:"RO",country:"Romania",score:98.88},{code:"MK",country:"North Macedonia",score:98.88},
  {code:"SK",country:"Slovakia",score:98.87},{code:"LU",country:"Luxembourg",score:98.75},{code:"IL",country:"Israel",score:98.57},
  {code:"MY",country:"Malaysia",score:98.51},{code:"IN",country:"India",score:98.44},{code:"ME",country:"Montenegro",score:98.43},
  {code:"SY",country:"Syria",score:98.41},{code:"NO",country:"Norway",score:98.31},{code:"MM",country:"Myanmar",score:98.28},
  {code:"SE",country:"Sweden",score:98.22},{code:"IE",country:"Ireland",score:98.22},{code:"AZ",country:"Azerbaijan",score:98.03},
  {code:"QA",country:"Qatar",score:97.94},{code:"DK",country:"Denmark",score:97.68},{code:"DZ",country:"Algeria",score:97.53},
  {code:"TN",country:"Tunisia",score:97.46},{code:"AE",country:"United Arab Emirates",score:97.39},{code:"BD",country:"Bangladesh",score:97.32},
  {code:"NP",country:"Nepal",score:97.31},{code:"IS",country:"Iceland",score:97.25},{code:"MA",country:"Morocco",score:97.24},
  {code:"BA",country:"Bosnia and Herzegovina",score:97.13},{code:"AR",country:"Argentina",score:97.11},{code:"TR",country:"Türkiye",score:97.00},
  {code:"PK",country:"Pakistan",score:96.93},{code:"MD",country:"Moldova",score:96.85},{code:"EG",country:"Egypt",score:96.74},
  {code:"UZ",country:"Uzbekistan",score:96.54},{code:"BG",country:"Bulgaria",score:96.54},{code:"BN",country:"Brunei",score:96.54},
  {code:"CU",country:"Cuba",score:96.40},{code:"CL",country:"Chile",score:96.34},{code:"UY",country:"Uruguay",score:96.09},
  {code:"ET",country:"Ethiopia",score:96.00},{code:"KZ",country:"Kazakhstan",score:95.92},{code:"JO",country:"Jordan",score:95.73},
  {code:"MV",country:"Maldives",score:95.71},{code:"PH",country:"Philippines",score:95.68},{code:"UA",country:"Ukraine",score:95.66},
  {code:"BO",country:"Bolivia",score:95.56},{code:"EC",country:"Ecuador",score:95.45},{code:"BR",country:"Brazil",score:95.44},
  {code:"TT",country:"Trinidad and Tobago",score:94.81},{code:"LY",country:"Libya",score:94.76},{code:"MU",country:"Mauritius",score:94.66},
  {code:"CO",country:"Colombia",score:94.62},{code:"KG",country:"Kyrgyzstan",score:94.48},{code:"BH",country:"Bahrain",score:94.25},
  {code:"SA",country:"Saudi Arabia",score:94.07},{code:"CR",country:"Costa Rica",score:93.80},{code:"MX",country:"Mexico",score:93.64},
  {code:"ZA",country:"South Africa",score:93.63},{code:"IQ",country:"Iraq",score:93.62},{code:"YE",country:"Yemen",score:93.43},
  {code:"TJ",country:"Tajikistan",score:93.39},{code:"KW",country:"Kuwait",score:93.13},{code:"KH",country:"Cambodia",score:93.12},
  {code:"ZM",country:"Zambia",score:93.05},{code:"LA",country:"Laos",score:92.97},{code:"PS",country:"Palestine",score:92.94},
  {code:"NG",country:"Nigeria",score:92.76},{code:"VE",country:"Venezuela",score:92.61},{code:"PY",country:"Paraguay",score:92.38},
  {code:"SN",country:"Senegal",score:92.26},{code:"OM",country:"Oman",score:92.18},{code:"JM",country:"Jamaica",score:92.00},
  {code:"BJ",country:"Benin",score:91.96},{code:"KE",country:"Kenya",score:91.69},{code:"PA",country:"Panama",score:91.65},
  {code:"ZW",country:"Zimbabwe",score:91.64},{code:"GH",country:"Ghana",score:91.40},{code:"GT",country:"Guatemala",score:91.35},
  {code:"CM",country:"Cameroon",score:90.59},{code:"HN",country:"Honduras",score:90.41},{code:"CI",country:"Côte d’Ivoire",score:90.37},
  {code:"MZ",country:"Mozambique",score:90.33},{code:"NA",country:"Namibia",score:90.29},{code:"DO",country:"Dominican Republic",score:90.11},
  {code:"SV",country:"El Salvador",score:90.00},{code:"ID",country:"Indonesia",score:89.96},{code:"BW",country:"Botswana",score:89.72},
  {code:"TZ",country:"Tanzania",score:89.57},{code:"AF",country:"Afghanistan",score:89.31},{code:"CD",country:"DR Congo",score:88.60},
  {code:"UG",country:"Uganda",score:88.49},{code:"GA",country:"Gabon",score:88.35},{code:"AO",country:"Angola",score:87.89},
  {code:"NI",country:"Nicaragua",score:87.75},{code:"RW",country:"Rwanda",score:86.90},{code:"TL",country:"Timor-Leste",score:86.70},
  {code:"SO",country:"Somalia",score:83.84},
];

export const iqRankings = [...rows].sort((a, b) => b.score - a.score);
export const iqByCode = new Map(iqRankings.map((item, index) => [item.code, {...item, rank:index + 1}]));
