/**
 * Current heads of state / government for extended profiles.
 * Kept separate so the full 195 atlas can surface leadership without requiring
 * a complete editorial Country record. Update when office-holders change.
 */
export type LeaderRecord = {
  leader: string;
  leaderTitle: string;
  government: string;
  since?: string;
};

export const leadersByCode: Record<string, LeaderRecord> = {
  // Already covered in editorial data.ts — kept here for single lookup
  NG: { leader: "Bola Ahmed Tinubu", leaderTitle: "President", government: "Federal presidential republic", since: "2023" },
  JP: { leader: "Emperor Naruhito / Shigeru Ishiba", leaderTitle: "Head of state / Prime Minister", government: "Unitary parliamentary monarchy", since: "2019 / 2024" },
  BR: { leader: "Luiz Inácio Lula da Silva", leaderTitle: "President", government: "Federal presidential republic", since: "2023" },
  FR: { leader: "Emmanuel Macron", leaderTitle: "President", government: "Unitary semi-presidential republic", since: "2017" },
  US: { leader: "Donald J. Trump", leaderTitle: "President", government: "Federal presidential republic", since: "2025" },
  IN: { leader: "Droupadi Murmu / Narendra Modi", leaderTitle: "President / Prime Minister", government: "Federal parliamentary republic", since: "2022 / 2014" },
  ZA: { leader: "Cyril Ramaphosa", leaderTitle: "President", government: "Unitary parliamentary republic", since: "2018" },
  MX: { leader: "Claudia Sheinbaum", leaderTitle: "President", government: "Federal presidential republic", since: "2024" },
  EG: { leader: "Abdel Fattah el-Sisi", leaderTitle: "President", government: "Unitary semi-presidential republic", since: "2014" },
  AU: { leader: "King Charles III / Anthony Albanese", leaderTitle: "Head of state / Prime Minister", government: "Federal parliamentary monarchy", since: "2022 / 2022" },

  // Major additional countries
  CN: { leader: "Xi Jinping", leaderTitle: "President · General Secretary", government: "Unitary one-party socialist republic", since: "2013" },
  DE: { leader: "Frank-Walter Steinmeier / Friedrich Merz", leaderTitle: "President / Chancellor", government: "Federal parliamentary republic", since: "2017 / 2025" },
  GB: { leader: "King Charles III / Keir Starmer", leaderTitle: "Head of state / Prime Minister", government: "Unitary parliamentary monarchy", since: "2022 / 2024" },
  IT: { leader: "Sergio Mattarella / Giorgia Meloni", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2015 / 2022" },
  CA: { leader: "King Charles III / Mark Carney", leaderTitle: "Head of state / Prime Minister", government: "Federal parliamentary monarchy", since: "2022 / 2025" },
  KR: { leader: "Lee Jae-myung", leaderTitle: "President", government: "Unitary presidential republic", since: "2025" },
  ES: { leader: "King Felipe VI / Pedro Sánchez", leaderTitle: "Head of state / Prime Minister", government: "Unitary parliamentary monarchy", since: "2014 / 2018" },
  AR: { leader: "Javier Milei", leaderTitle: "President", government: "Federal presidential republic", since: "2023" },
  ID: { leader: "Prabowo Subianto", leaderTitle: "President", government: "Unitary presidential republic", since: "2024" },
  TR: { leader: "Recep Tayyip Erdoğan", leaderTitle: "President", government: "Unitary presidential republic", since: "2014" },
  SA: { leader: "King Salman / Mohammed bin Salman", leaderTitle: "King / Crown Prince & Prime Minister", government: "Unitary absolute monarchy", since: "2015 / 2017" },
  NL: { leader: "King Willem-Alexander / Dick Schoof", leaderTitle: "Head of state / Prime Minister", government: "Unitary parliamentary monarchy", since: "2013 / 2024" },
  CH: { leader: "Federal Council (collective)", leaderTitle: "Federal Council", government: "Federal semi-directorial republic", since: "—" },
  PL: { leader: "Andrzej Duda / Donald Tusk", leaderTitle: "President / Prime Minister", government: "Unitary semi-presidential republic", since: "2015 / 2023" },
  SE: { leader: "King Carl XVI Gustaf / Ulf Kristersson", leaderTitle: "Head of state / Prime Minister", government: "Unitary parliamentary monarchy", since: "1973 / 2022" },
  BE: { leader: "King Philippe / Bart De Wever", leaderTitle: "Head of state / Prime Minister", government: "Federal parliamentary monarchy", since: "2013 / 2025" },
  NO: { leader: "King Harald V / Jonas Gahr Støre", leaderTitle: "Head of state / Prime Minister", government: "Unitary parliamentary monarchy", since: "1991 / 2021" },
  AT: { leader: "Alexander Van der Bellen / Christian Stocker", leaderTitle: "President / Chancellor", government: "Federal semi-presidential republic", since: "2017 / 2025" },
  IE: { leader: "Michael D. Higgins / Micheál Martin", leaderTitle: "President / Taoiseach", government: "Unitary parliamentary republic", since: "2011 / 2025" },
  PT: { leader: "Marcelo Rebelo de Sousa / Luís Montenegro", leaderTitle: "President / Prime Minister", government: "Unitary semi-presidential republic", since: "2016 / 2024" },
  GR: { leader: "Konstantinos Tasoulas / Kyriakos Mitsotakis", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2025 / 2019" },
  DK: { leader: "King Frederik X / Mette Frederiksen", leaderTitle: "Head of state / Prime Minister", government: "Unitary parliamentary monarchy", since: "2024 / 2019" },
  FI: { leader: "Alexander Stubb / Petteri Orpo", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2024 / 2023" },
  NZ: { leader: "King Charles III / Christopher Luxon", leaderTitle: "Head of state / Prime Minister", government: "Unitary parliamentary monarchy", since: "2022 / 2023" },
  SG: { leader: "Tharman Shanmugaratnam / Lawrence Wong", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2023 / 2024" },
  IL: { leader: "Isaac Herzog / Benjamin Netanyahu", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2021 / 2022" },
  AE: { leader: "Mohamed bin Zayed Al Nahyan", leaderTitle: "President", government: "Federal presidential monarchy", since: "2022" },
  TH: { leader: "King Vajiralongkorn / Paetongtarn Shinawatra", leaderTitle: "Head of state / Prime Minister", government: "Unitary parliamentary monarchy", since: "2016 / 2024" },
  PH: { leader: "Bongbong Marcos", leaderTitle: "President", government: "Unitary presidential republic", since: "2022" },
  VN: { leader: "Tô Lâm / Phạm Minh Chính", leaderTitle: "General Secretary · President / Prime Minister", government: "Unitary one-party socialist republic", since: "2024 / 2021" },
  PK: { leader: "Asif Ali Zardari / Shehbaz Sharif", leaderTitle: "President / Prime Minister", government: "Federal parliamentary republic", since: "2024 / 2024" },
  BD: { leader: "Mohammed Shahabuddin / Muhammad Yunus", leaderTitle: "President / Chief Adviser", government: "Unitary parliamentary republic (interim)", since: "2023 / 2024" },
  RU: { leader: "Vladimir Putin", leaderTitle: "President", government: "Federal semi-presidential republic", since: "2012" },
  UA: { leader: "Volodymyr Zelenskyy", leaderTitle: "President", government: "Unitary semi-presidential republic", since: "2019" },
  KE: { leader: "William Ruto", leaderTitle: "President", government: "Unitary presidential republic", since: "2022" },
  ET: { leader: "Taye Atske Selassie / Abiy Ahmed", leaderTitle: "President / Prime Minister", government: "Federal parliamentary republic", since: "2024 / 2018" },
  GH: { leader: "John Dramani Mahama", leaderTitle: "President", government: "Unitary presidential republic", since: "2025" },
  CI: { leader: "Alassane Ouattara", leaderTitle: "President", government: "Unitary presidential republic", since: "2011" },
  SN: { leader: "Bassirou Diomaye Faye", leaderTitle: "President", government: "Unitary semi-presidential republic", since: "2024" },
  MA: { leader: "King Mohammed VI / Aziz Akhannouch", leaderTitle: "Head of state / Head of government", government: "Unitary parliamentary constitutional monarchy", since: "1999 / 2021" },
  DZ: { leader: "Abdelmadjid Tebboune", leaderTitle: "President", government: "Unitary semi-presidential republic", since: "2019" },
  TN: { leader: "Kais Saied", leaderTitle: "President", government: "Unitary semi-presidential republic", since: "2019" },
  CO: { leader: "Gustavo Petro", leaderTitle: "President", government: "Unitary presidential republic", since: "2022" },
  CL: { leader: "Gabriel Boric", leaderTitle: "President", government: "Unitary presidential republic", since: "2022" },
  PE: { leader: "Dina Boluarte", leaderTitle: "President", government: "Unitary presidential republic", since: "2022" },
  VE: { leader: "Nicolás Maduro", leaderTitle: "President", government: "Federal presidential republic", since: "2013" },
  CU: { leader: "Miguel Díaz-Canel", leaderTitle: "President · First Secretary", government: "Unitary one-party socialist republic", since: "2018 / 2021" },
  MY: { leader: "Sultan Ibrahim / Anwar Ibrahim", leaderTitle: "Yang di-Pertuan Agong / Prime Minister", government: "Federal parliamentary monarchy", since: "2024 / 2022" },
  IQ: { leader: "Abdul Latif Rashid / Mohammed Shia' Al Sudani", leaderTitle: "President / Prime Minister", government: "Federal parliamentary republic", since: "2022 / 2022" },
  IR: { leader: "Ali Khamenei / Masoud Pezeshkian", leaderTitle: "Supreme Leader / President", government: "Unitary theocratic republic", since: "1989 / 2024" },
  AF: { leader: "Hibatullah Akhundzada", leaderTitle: "Supreme Leader", government: "Islamic emirate (de facto)", since: "2021" },
  ZW: { leader: "Emmerson Mnangagwa", leaderTitle: "President", government: "Unitary presidential republic", since: "2017" },
  UG: { leader: "Yoweri Museveni", leaderTitle: "President", government: "Unitary presidential republic", since: "1986" },
  TZ: { leader: "Samia Suluhu Hassan", leaderTitle: "President", government: "Unitary presidential republic", since: "2021" },
  RW: { leader: "Paul Kagame", leaderTitle: "President", government: "Unitary presidential republic", since: "2000" },
  AO: { leader: "João Lourenço", leaderTitle: "President", government: "Unitary presidential republic", since: "2017" },
  MZ: { leader: "Daniel Chapo", leaderTitle: "President", government: "Unitary presidential republic", since: "2025" },
  CM: { leader: "Paul Biya", leaderTitle: "President", government: "Unitary presidential republic", since: "1982" },
  SD: { leader: "Transitional Sovereignty Council", leaderTitle: "Collective head of state", government: "Transitional military-led authority", since: "2023" },
  LY: { leader: "Mohamed al-Menfi / Abdul Hamid Dbeibeh", leaderTitle: "Presidential Council / Government of National Unity", government: "Transitional authority (split)", since: "2021" },
  JO: { leader: "King Abdullah II / Jafar Hassan", leaderTitle: "Head of state / Prime Minister", government: "Unitary parliamentary constitutional monarchy", since: "1999 / 2024" },
  LB: { leader: "Joseph Aoun / Nawaf Salam", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2025 / 2025" },
  QA: { leader: "Tamim bin Hamad Al Thani", leaderTitle: "Emir", government: "Unitary absolute monarchy", since: "2013" },
  KW: { leader: "Mishal Al-Ahmad Al-Jaber Al-Sabah", leaderTitle: "Emir", government: "Unitary constitutional monarchy", since: "2023" },
  OM: { leader: "Haitham bin Tariq", leaderTitle: "Sultan", government: "Unitary absolute monarchy", since: "2020" },
  BH: { leader: "King Hamad bin Isa Al Khalifa", leaderTitle: "King", government: "Unitary constitutional monarchy", since: "2002" },
  KZ: { leader: "Kassym-Jomart Tokayev", leaderTitle: "President", government: "Unitary presidential republic", since: "2019" },
  UZ: { leader: "Shavkat Mirziyoyev", leaderTitle: "President", government: "Unitary presidential republic", since: "2016" },
  RO: { leader: "Nicușor Dan / Ilie Bolojan", leaderTitle: "President / Prime Minister", government: "Unitary semi-presidential republic", since: "2025 / 2025" },
  CZ: { leader: "Petr Pavel / Petr Fiala", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2023 / 2021" },
  HU: { leader: "Tamás Sulyok / Viktor Orbán", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2024 / 2010" },
  SK: { leader: "Peter Pellegrini / Robert Fico", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2024 / 2023" },
  HR: { leader: "Zoran Milanović / Andrej Plenković", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2020 / 2016" },
  RS: { leader: "Aleksandar Vučić / Đuro Macut", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2017 / 2025" },
  BG: { leader: "Rumen Radev / Rosen Zhelyazkov", leaderTitle: "President / Prime Minister", government: "Unitary parliamentary republic", since: "2017 / 2025" },
};

export function getLeader(code: string): LeaderRecord | undefined {
  return leadersByCode[code];
}
