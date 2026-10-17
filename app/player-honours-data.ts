import { footballGreats, globalGoats } from "./football-greats-data";

/** Individual recognition only. A team trophy is never counted as an individual award. */
export type PlayerHonour = {
  label: string;
  year?: string;
  kind: "award" | "recognition" | "record";
  sourceUrl: string;
  sourceLabel: string;
};
export type HonourSource = { label: string; url: string };
export type PlayerHonoursProfile = {
  honours: PlayerHonour[];
  sources: HonourSource[];
  checkedAt: string;
  status: "verified" | "not-yet-verified";
  verificationNote?: string;
};

const checkedAt = "2026-10-17";
const sources = {
  ballon: { label: "UEFA / France Football · Ballon d’Or winners", url: "https://www.uefa.com/news-media/news/0287-195e642735da-0594342b9554-1000--history-of-the-ballon-d-or/" },
  plHall: { label: "Premier League · Hall of Fame inductees", url: "https://www.premierleague.com/en/events/hall-of-fame/inductees" },
  salah: { label: "Premier League · Salah’s 2024/25 awards", url: "https://www.premierleague.com/en/news/4314803/salah-sweeps-202425-player-of-the-season-golden-boot-and-playmaker-awards" },
  plRecords: { label: "Premier League · Player award records", url: "https://www.premierleague.com/en/news/662064/records-players" },
  caf: { label: "CAF · African Player of the Year archive", url: "https://www.cafonline.com/news/2024-caf-awards-everything-you-need-to-know/" },
  cafHistory: { label: "CAF · History of the African individual award", url: "https://www.cafonline.com/news/rich-history-of-the-caf-men-s-player-of-the-year-award/" },
  frenchScorers: { label: "Ligue 1 · Historical top-scorer awards", url: "https://ligue1.com/en/articles/l1_article_2588-history-and-records-of-the-ligue-1-mc-donald-s-top-scorers" },
  unfp: { label: "Ligue 1 / UNFP · Player of the Year winners", url: "https://ligue1.com/en/articles/l1_article_285-trophees-unfp-palmares-des-meilleurs-joueurs-l1" },
  unfpKeepers: { label: "Ligue 1 / UNFP · Goalkeeper award winners", url: "https://ligue1.com/fr/articles/l1_article_287-trophees-unfp-palmares-des-meilleurs-gardiens-l1" },
  germanScorers: { label: "Bundesliga · Season top-scorer awards", url: "https://www.bundesliga.com/en/bundesliga/news/a-history-of-top-scorers-by-season-lewandowski-muller-aubameyang-19353" },
  germanAwards: { label: "DFB · Footballer of the Year historical register", url: "https://www.dfb.de/fileadmin/_dfbdam/61175-DFB_A-Z_UK_lowRes.pdf" },
  italyHall: { label: "FIGC · Italian Football Hall of Fame", url: "https://www.figc.it/en/full-html?path=%2Fmuseum%2Fhall-of-fame%2Finductees" },
  italy2019: { label: "FIGC · Hall of Fame register through 2019", url: "https://www.figc.it/it/federazione/news/hall-of-fame-del-calcio-italiano-pirlo-boniek-e-mazzone-tra-i-premiati-della-9-edizione-rtya7mjf" },
  interHall: { label: "Inter · Hall of Fame inductees", url: "https://www.inter.it/en/club/hall-of-fame" },
  romaHall: { label: "AS Roma · Hall of Fame classes", url: "https://www.asroma.com/en/club/history/hall-of-fame" },
  violaHall: { label: "Museo Viola · Fiorentina Hall of Fame", url: "https://www.museoviola.it/hall-of-fame/" },
  spursHall: { label: "Tottenham Hotspur · Hall of Fame", url: "https://www.tottenhamhotspur.com/the-club/history/hall-of-fame/" },
  cityLegends: { label: "Manchester City · Official legends archive", url: "https://www.mancity.com/mancitylegends" },
  schalkeHall: { label: "Schalke 04 · Ehrenkabine / club Hall of Fame", url: "https://schalke04.de/verein/tradition/schalke-legenden/" },
  werderCaptains: { label: "Werder Bremen · Honorary captains", url: "https://www.werder.de/der-svw/historie/ehrenspielfuehrer/" },
  barcaLegends: { label: "FC Barcelona · Legendary players", url: "https://www.fcbarcelona.com/en/club/history/legendary-players" },
  madridLegends: { label: "Real Madrid · Historical legends", url: "https://www.realmadrid.com/en-US/the-club/history/football-legends" },
  laligaAnnual: { label: "LALIGA · Historical Pichichi register (1998/99 annual report)", url: "https://files.laliga.es/memorias/1998-1999/MemoriaLFP_1998-99.pdf" },
} satisfies Record<string, HonourSource>;

const verified: Record<string, PlayerHonour[]> = {};
function add(name: string, label: string, source: HonourSource, year?: string, kind: PlayerHonour["kind"] = "award") {
  (verified[name] ??= []).push({ label, ...(year ? { year } : {}), kind, sourceUrl: source.url, sourceLabel: source.label });
}
function group(names: string[], label: string, source: HonourSource, year?: string, kind: PlayerHonour["kind"] = "recognition") {
  for (const name of names) add(name, label, source, year, kind);
}

// Award years, not an invented combined "trophies" score. This is a selected,
// sourced honours register rather than a promise to list every career award.
const ballonYears: Record<string, string> = {
  "Alfredo Di Stéfano": "1957, 1959", "Raymond Kopa": "1958", "Luis Suárez Miramontes": "1960",
  "Omar Sívori": "1961", "Denis Law": "1964", "Bobby Charlton": "1966", "George Best": "1968",
  "Gianni Rivera": "1969", "Gerd Müller": "1970", "Johan Cruyff": "1971, 1973, 1974",
  "Franz Beckenbauer": "1972, 1976", "Allan Simonsen": "1977", "Kevin Keegan": "1978, 1979",
  "Karl-Heinz Rummenigge": "1980, 1981", "Michel Platini": "1983, 1984, 1985", "Ruud Gullit": "1987",
  "Marco van Basten": "1988, 1989, 1992", "Lothar Matthäus": "1990", "Jean-Pierre Papin": "1991",
  "Roberto Baggio": "1993", "George Weah": "1995", "Matthias Sammer": "1996",
  "Ronaldo Nazário": "1997, 2002", "Zinedine Zidane": "1998", "Pavel Nedvěd": "2003",
  "Andriy Shevchenko": "2004", "Ronaldinho": "2005", "Kaká": "2007",
  "Cristiano Ronaldo": "2008, 2013, 2014, 2016, 2017",
  "Lionel Messi": "2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023",
  "Luka Modrić": "2018", "Karim Benzema": "2022",
};
for (const [name, years] of Object.entries(ballonYears)) add(name, "Ballon d’Or", sources.ballon, years);

group([
  "Thierry Henry", "Alan Shearer", "Eric Cantona", "Dennis Bergkamp", "Roy Keane", "Frank Lampard", "Steven Gerrard",
  "Wayne Rooney", "Patrick Vieira", "Sergio Agüero", "Didier Drogba", "Vincent Kompany", "Peter Schmeichel", "Paul Scholes", "Ian Wright",
  "Tony Adams", "Petr Čech", "John Terry", "Ashley Cole",
], "Premier League Hall of Fame inductee", sources.plHall);

add("Mohamed Salah", "Premier League Golden Boot · four verified winning seasons", sources.salah, "2017/18, 2018/19, 2021/22, 2024/25");
add("Mohamed Salah", "Premier League Player of the Season", sources.salah, "2017/18, 2024/25");
add("Mohamed Salah", "Premier League Playmaker award", sources.salah, "2021/22, 2024/25");
add("Mohamed Salah", "CAF African Player of the Year", sources.caf, "2017, 2018");
add("Cristiano Ronaldo", "UEFA Men's Player of the Year", { label: "UEFA · Cristiano Ronaldo individual honours", url: "https://www.uefa.com/uefachampionsleague/news/0254-0e99d68ce583-a9362a08b3eb-1000--who-has-won-the-uefa-men-s-player-of-the-year-award/" }, "2014, 2016, 2017");
add("Lionel Messi", "FIFA World Cup Golden Ball", { label: "FIFA · Messi's Golden Ball awards", url: "https://www.fifa.com/en/articles/lionel-messi-wins-the-best-fifa-mens-player-award-mbappe-benzema" }, "2014, 2022");
add("Pelé", "Laureus Lifetime Achievement Award", { label: "FIFA · Pelé retrospective and individual recognition", url: "https://www.fifa.com/en/articles/a-tribute-to-pele-brazil-santos-new-york-cosmos-legend-fifa-world-cup" }, "2000");
add("Diego Maradona", "FIFA World Cup Golden Ball", { label: "FIFA · Golden Ball history", url: "https://inside.fifa.com/tournaments/mens/worldcup/1986mexico/news/worldcupathome-argentina-v-west-germany--mexico-1986-3070259" }, "1986");
add("Ferenc Puskás", "Spanish league top scorer · four seasons", sources.laligaAnnual, "1959/60, 1960/61, 1962/63, 1963/64");
add("Thierry Henry", "Premier League Golden Boot · four seasons", sources.plRecords, "2001/02, 2003/04, 2004/05, 2005/06");
add("Kevin De Bruyne", "Premier League Playmaker award", sources.plRecords, "2017/18, 2019/20, 2022/23");
add("Harry Kane", "Premier League Golden Boot", { label: "Tottenham Hotspur · Kane's third Golden Boot", url: "https://www.premierleague.com/en/news/2154211" }, "2015/16, 2016/17, 2020/21");
add("Son Heung-min", "Premier League Golden Boot · shared with Salah", { label: "Premier League · Son and Salah share 2021/22 Golden Boot", url: "https://www.premierleague.com/en/news/2626553" }, "2021/22");

const africaYears: Record<string, string> = {
  "Didier Drogba": "2006, 2009", "Yaya Touré": "2011, 2012, 2013, 2014", "Frédéric Kanouté": "2007",
  "Nwankwo Kanu": "1996, 1999", "Rashidi Yekini": "1993", "Victor Ikpeba": "1997", "Abedi Pelé": "1992",
};
for (const [name, years] of Object.entries(africaYears)) add(name, "CAF African Player of the Year", sources.caf, years);
add("Salif Keïta", "African Footballer of the Year · France Football award", sources.cafHistory, "1970");

const frenchBootYears: Record<string, string> = {
  "Kylian Mbappé": "2018/19, 2019/20, 2020/21, 2021/22, 2022/23, 2023/24", "Delio Onnis": "1974/75, 1979/80, 1980/81, 1981/82, 1983/84",
  "Jean-Pierre Papin": "1987/88, 1988/89, 1989/90, 1990/91, 1991/92", "Josip Skoblar": "1970/71, 1971/72, 1972/73",
  "Sonny Anderson": "1995/96, 1999/00, 2000/01", "Zlatan Ibrahimović": "2012/13, 2013/14, 2015/16",
};
for (const [name, years] of Object.entries(frenchBootYears)) add(name, "French top-flight top scorer", sources.frenchScorers, years);
const unfpYears: Record<string, string> = {
  "Kylian Mbappé": "2019, 2021, 2022, 2023, 2024", "Zlatan Ibrahimović": "2013, 2014, 2016",
  "Pauleta": "2002, 2003", "Edinson Cavani": "2017", "Eden Hazard": "2011, 2012", "Juninho Pernambucano": "2006",
  "Sonny Anderson": "1997", "Karim Benzema": "2008", "Lisandro López": "2010", "Alexandre Lacazette": "2015", "Didier Drogba": "2004",
};
for (const [name, years] of Object.entries(unfpYears)) add(name, "UNFP Ligue 1 Player of the Year", sources.unfp, years);
add("Grégory Coupet", "UNFP Ligue 1 Goalkeeper of the Year", sources.unfpKeepers, "2003, 2004, 2005, 2006");
add("Steve Mandanda", "UNFP Ligue 1 Goalkeeper of the Year", sources.unfpKeepers, "2008, 2011, 2015, 2016, 2018");
add("Gunnar Andersson", "French top-flight top scorer", { label: "Olympique de Marseille · 1945–1965 history", url: "https://www.om.fr/en/the-renaissance" }, "1951/52, 1952/53");

const germanBootYears: Record<string, string> = {
  "Gerd Müller": "1966/67, 1968/69, 1969/70, 1971/72, 1972/73, 1973/74, 1977/78", "Uwe Seeler": "1963/64",
  "Jupp Heynckes": "1973/74, 1974/75", "Klaus Fischer": "1975/76", "Karl-Heinz Rummenigge": "1979/80, 1980/81, 1983/84",
  "Horst Hrubesch": "1981/82", "Rudi Völler": "1982/83", "Sergej Barbarez": "2000/01", "Aílton": "2003/04",
  "Klaas-Jan Huntelaar": "2011/12", "Robert Lewandowski": "2013/14, 2015/16, 2017/18, 2018/19, 2019/20, 2020/21, 2021/22",
};
for (const [name, years] of Object.entries(germanBootYears)) add(name, "Bundesliga top scorer · Torjägerkanone", sources.germanScorers, years);
const germanYear: Record<string, string> = {
  "Sepp Maier": "1975, 1977, 1978", "Uwe Seeler": "1960, 1964, 1970", "Günter Netzer": "1972, 1973",
  "Berti Vogts": "1971, 1979", "Jürgen Kohler": "1997",
  "Oliver Kahn": "2000, 2001", "Aílton": "2004", "Manuel Neuer": "2011",
};
// The DFB register identifies the award's historical recipients. Some familiar
// players did not win it: a fan reputation is not substituted for an award.
for (const [name, years] of Object.entries(germanYear)) add(name, "Germany's Footballer of the Year", sources.germanAwards, years);

group(["Paolo Maldini", "Franco Baresi", "Dino Zoff", "Bruno Conti", "Falcão", "Gabriel Batistuta", "Diego Maradona", "Giuseppe Bergomi"], "Italian Football Hall of Fame inductee", sources.italyHall);
group(["Alessandro Del Piero", "Francesco Totti", "Andrea Pirlo", "Sandro Mazzola"], "Italian Football Hall of Fame inductee", sources.italy2019);
const interInductees: Record<string, string> = { "Javier Zanetti": "2018", "Giacinto Facchetti": "2019", "Giuseppe Meazza": "2019", "Giuseppe Bergomi": "2020", "Sandro Mazzola": "2022", "Ronaldo Nazário": "2018", "Diego Milito": "2020", "Walter Zenga": "2018", "Esteban Cambiasso": "2020", "Francesco Toldo": "2019" };
for (const [name, year] of Object.entries(interInductees)) add(name, "Inter Hall of Fame inductee", sources.interHall, year, "recognition");
group(["Francesco Totti", "Giacomo Losi", "Aldair", "Agostino Di Bartolomei", "Falcão", "Bruno Conti", "Roberto Pruzzo", "Amedeo Amadei", "Giuseppe Giannini"], "AS Roma Hall of Fame inductee", sources.romaHall);
group(["Giancarlo Antognoni", "Gabriel Batistuta", "Kurt Hamrin", "Julinho", "Miguel Montuori", "Giancarlo De Sisti", "Francesco Toldo", "Luca Toni", "Sébastien Frey"], "Fiorentina Hall of Fame inductee", sources.violaHall);
group(["Jimmy Greaves", "Danny Blanchflower", "Glenn Hoddle", "Steve Perryman", "Dave Mackay", "Cliff Jones", "Pat Jennings", "Ossie Ardiles"], "Tottenham Hotspur Hall of Fame inductee", sources.spursHall);
group(["Colin Bell", "Francis Lee", "Bert Trautmann", "Mike Summerbee", "Tony Book"], "Recognised in Manchester City's official legends archive", sources.cityLegends);
group(["Ernst Kuzorra", "Fritz Szepan", "Klaus Fischer", "Olaf Thon", "Reinhard 'Stan' Libuda", "Norbert Nigbur", "Klaus Fichtel", "Marc Wilmots", "Gerald Asamoah"], "Schalke 04 Ehrenkabine / Hall of Fame member", sources.schalkeHall);
group(["Frank Baumann", "Marco Bode", "Dieter Burdenski", "Dieter Eilts", "Torsten Frings"], "Werder Bremen honorary captain", sources.werderCaptains);

// Explicitly labelled historical club recognition, separate from competitive awards.
group(["László Kubala", "Carles Puyol", "Sergio Busquets", "César Rodríguez", "Xavi Hernández", "Andrés Iniesta"], "Featured in FC Barcelona's legendary-player archive", sources.barcaLegends);
group(["Paco Gento", "Raúl", "Iker Casillas", "Sergio Ramos"], "Featured in Real Madrid's football-legends archive", sources.madridLegends);
const spanishScoring: Record<string, string> = {
  "Telmo Zarra": "1944/45, 1945/46, 1946/47, 1949/50, 1950/51, 1952/53", "Juan Arza": "1954/55",
  "Waldo Machado": "1966/67", "Mario Kempes": "1976/77, 1977/78", "José Eulogio Gárate": "1968/69, 1969/70, 1970/71",
  "Edmundo 'Mundo' Suárez": "1941/42, 1943/44", "César Rodríguez": "1948/49",
};
for (const [name, years] of Object.entries(spanishScoring)) add(name, "Spanish league top scorer · Pichichi register", sources.laligaAnnual, years);
add("Luis Suárez", "European Golden Shoe", { label: "FC Barcelona · Suárez’s Golden Shoes", url: "https://www.fcbarcelona.com/en/news/829797/luis-suarez-receives-201516-golden-shoe-award" }, "2013/14, 2015/16");
add("Emlyn Hughes", "FWA Footballer of the Year", { label: "Liverpool FC · Emlyn Hughes individual award", url: "https://www.liverpoolfc.com/news/liverpools-greatest-no17-emlyn-hughes" }, "1977");
add("Liam Brady", "PFA Players' Player of the Year", { label: "Arsenal · PFA award history", url: "https://www.arsenal.com/feature/our-incredible-history-at-the-pfa-awards-a7JNQ6P46Z9G" }, "1979");
add("Charlie George", "Selected in Arsenal.com's Gunners' Greatest 50 supporters' vote", { label: "Arsenal · Greatest 50: Charlie George", url: "https://www.arsenal.com/history/greatest-players-no.-9-charlie-george" }, "2008", "recognition");
add("Cliff Bastin", "Selected in Arsenal.com's Gunners' Greatest 50 supporters' vote", { label: "Arsenal · Greatest 50: Cliff Bastin", url: "https://www.arsenal.com/history/gunners-greatest-players-18.-cliff-bastin" }, "2008", "recognition");

// Further official individual distinctions and historical award records.
const museumHall = { label: "National Football Museum · Hall of Fame register", url: "https://nationalfootballmuseum.com/hall-of-fame/" };
group(["Ryan Giggs", "Kenny Dalglish", "Ian Rush", "John Barnes", "Alan Hansen", "Graeme Souness", "Ray Clemence", "David Seaman", "Gianfranco Zola", "John Charles"], "National Football Museum Hall of Fame inductee", museumHall);
add("Robert Pires", "FWA Footballer of the Year", { label: "Football Writers' Association · 2002 winner", url: "https://footballwriters.co.uk/news/pires-crowned-footballer-of-the-year-2002/" }, "2002");
add("Peter Osgood", "Honoured with a permanent statue at Stamford Bridge", { label: "Chelsea FC · The Osgood statue", url: "https://www.chelseafc.com/en/news/article/the-peter-osgood-statue-story" }, undefined, "recognition");
add("Bobby Tambling", "Held Chelsea's career goalscoring record until 2013", { label: "Chelsea FC · Tambling retrospective", url: "https://www.chelseafc.com/en/news/article/bobby-tambling-1941-2026" }, "Record overtaken in 2013", "record");
add("Ron Harris", "Chelsea's record appearance maker · 795 competitive games", { label: "Chelsea FC · Ron Harris profile", url: "https://www.chelseafc.com/en/ron-harris" }, "As checked October 2026", "record");
add("David Silva", "Honoured with a permanent statue at the Etihad Stadium", { label: "Manchester City · Kompany and Silva statues unveiled", url: "https://www.mancity.com/citytv/mens/man-city-unveil-statues-vincent-kompany-david-silva-63765724" }, "2021", "recognition");
add("Segun Odegbami", "Africa Cup of Nations top scorer · shared award", { label: "CAF · Multiple AFCON top-scorer winners", url: "https://www.cafonline.com/caf-africa-cup-of-nations/news/30-days-to-totalenergies-afcon-2021-30-afcon-facts/" }, "1978, 1980");
add("Christian Chukwu", "Africa Cup of Nations Player of the Tournament", { label: "CAF · AFCON individual award history", url: "https://www.cafonline.com/afcon2025/news/all-you-need-to-know-about-the-totalenergies-caf-africa-cup-of-nations-morocco-2025/" }, "1980");
add("Emmanuel Okala", "African Sports Journalists Union Footballer of the Year · separate from France Football / CAF award", { label: "NPFL · Okala's ASJU award", url: "https://npfl.com.ng/2024/05/17/elegbeleye-salutes-legendary-goalkeeper-okala-at-73/" }, "1978");
add("Vincent Enyeama", "Prix Marc-Vivien Foé · best African player in Ligue 1", { label: "LOSC · Marc-Vivien Foé winners", url: "https://www.losc.fr/actualites-foot-lille/victor-osimhen-remporte-le-prix-marc-vivien-fo%C3%A9" }, "2014");
add("Junior Lokosa", "Eunisell Boot · Nigerian league top scorer", { label: "Eunisell · Official football award archive", url: "https://eunisellfootball.com/" }, "2017/18");
add("Alessandro Nesta", "Italian Football Hall of Fame inductee", { label: "FIGC · 2021 Hall of Fame class", url: "https://figc.it/it/museo-del-calcio/news/cabrini-nella-hall-of-fame-del-calcio-italiano-felice-per-questo-riconoscimento/" }, "2021", "recognition");
add("Daniele De Rossi", "Italian Football Hall of Fame inductee", { label: "FIGC · 2023 Hall of Fame class", url: "https://www.figc.it/en/museum/hall-of-fame/editions/2023/from-shevchenko-to-boninsegna-the-12th-edition-of-the-hall-of-fame-welcomes-six-new-stars-spalletti-an-award-that-lasts-a-lifetime-d3o40827" }, "2023", "recognition");
add("Gianluigi Buffon", "UEFA Champions League Goalkeeper of the Season", { label: "UEFA · 2016/17 positional awards", url: "https://it.uefa.com/uefachampionsleague/news/023c-0e97a38e964a-1fa0963b0653-1000--buffon-ramos-modric-e-ronaldo-vincono-i-premi-per-ruolo/" }, "2016/17");
add("Lars Ricken", "ARD Goal of the Year · Champions League final lob", { label: "Borussia Dortmund · Ricken's individual goal award", url: "https://www.bvb.de/de/de/aktuelles/news/news.html/News/Uebersicht/Ricken-Lupfen-jetzt%21-JAAAAAAAA%21.html" }, "1997");
add("Michael Zorc", "Borussia Dortmund's record competitive appearance maker", { label: "Borussia Dortmund · Zorc's playing record", url: "https://www.bvb.de/de/de/aktuelles/news/news.html/News/Uebersicht/Michael-Zorc-Ein-Leben-in-Schwarzgelb.html" }, "As checked October 2026", "record");
add("Alfred Preißler", "Borussia Dortmund's record competitive goalscorer", { label: "Borussia Dortmund · Preißler's scoring record", url: "https://www.bvb.de/de/de/aktuelles/news/news.html/News/Uebersicht/Adi-Preissler-BVB-Legende-wuerde-heute-seinen-90.-Geburtstag-feiern.html" }, "As checked October 2026", "record");
add("Manfred Kaltz", "Hamburger SV's record competitive appearance maker", { label: "Hamburger SV · Official appearance records", url: "https://www.hsv.de/unser-hsv/historie/hsv-rekordspieler" }, "As checked October 2026", "record");
const moreFrenchScoring = { label: "Ligue 1 · Full historical scoring register", url: "https://ligue1.com/fr/articles/l1_article_80-historique-et-records-du-classement-des-buteurs-l1" };
for (const [name, years] of Object.entries({ "Just Fontaine": "1957/58, 1959/60", "Hervé Revelli": "1966/67, 1969/70", "Vahid Halilhodžić": "1982/83, 1984/85", "Philippe Gondet": "1965/66", "Nicolas Ouédec": "1993/94 · shared" })) add(name, "French top-flight top scorer", moreFrenchScoring, years);

const jubilee = { label: "UEFA · Golden Jubilee official selections", url: "https://www.uefa.com/newsfiles/130279.pdf" };
group(["Safet Sušić", "Stéphane Chapuisat", "Davor Šuker"], "National association's UEFA Golden Jubilee player", jubilee, "2003/04");
group(["Giampiero Boniperti", "Gaetano Scirea", "Ciro Ferrara", "David Trezeguet"], "Juventus Hall of Fame inductee", { label: "Juventus · Official Hall of Fame founding selection", url: "https://www.juventus.com/eN/hall-of-fame" });
add("Gunnar Nordahl", "Serie A top scorer · five winning seasons", { label: "AC Milan · Nordahl individual scoring honours", url: "https://www.acmilan.com/en/club/legends/players/nordahl" }, "1949/50, 1950/51, 1952/53, 1953/54, 1954/55");
group(["Philipp Lahm", "Bastian Schweinsteiger"], "FC Bayern Hall of Fame inductee", { label: "FC Bayern · Official Hall of Fame", url: "https://fcbayern.com/en/club/hall-of-fame" });
add("Thiago Silva", "FIFPRO World 11 selection", { label: "FIFPRO · 2013 award-winning eleven", url: "https://www.fifpro.org/en/articles/2020/11/history-the-fifpro-world-11-of-2013" }, "2013");
add("Radamel Falcao", "FIFPRO World 11 selection", { label: "FIFPRO · 2012 award-winning eleven", url: "https://www.fifpro.org/en/articles/2020/11/history-the-fifpro-world-11-of-2012" }, "2012");
add("David Villa", "FIFPRO World 11 selection", { label: "FIFPRO · Historical award-winning elevens", url: "https://www.fifpro.org/en/articles/2023/10/history-mens-world-11" }, "2010");
add("Thomas Müller", "FIFA World Cup Golden Boot", { label: "FIFA · Müller Golden Boot award", url: "https://www.plus.fifa.com/en/content/thomas-muller-golden-boot/9a2639b8-4a1c-46a3-ba4e-99ac5bab4ffa" }, "2010");
add("Marco Reus", "Germany's Footballer of the Year", { label: "Borussia Dortmund · Reus individual awards", url: "https://www.bvb.de/de/en/news/news-overview/news.html/eng/News/Overview/BVB-and-Reus-do-not-extend-contract.html" }, "2012, 2019");
add("Stefan Effenberg", "UEFA Club Footballer of the Year / Most Valuable Player", { label: "UEFA · Effenberg's 2001 award", url: "https://www.uefa.com/uefachampionsleague/news/0180-0e6a891a391f-e6da75ace93d-1000--uefa-com-team-of-2001-central-midfielders/" }, "2001");
add("Marek Hamšík", "Slovak Player of the Year · selected verified wins", { label: "UEFA · Hamšík's national individual award", url: "https://www.uefa.com/news-media/news/0213-0e89333b5a39-e689c801bc0a-1000--hamsik-regains-slovakian-player-award/" }, "2009, 2010, 2013");
add("Dries Mertens", "AIC Serie A Team of the Year selection", { label: "Italian Footballers' Association · 2017 Gran Galà winners", url: "https://grangala.assocalciatori.it/Categorie-Vincitori/2017/" }, "2017");
add("Kalidou Koulibaly", "Serie A Best Defender award", { label: "UC Sampdoria / Lega Serie A · 2018/19 award list", url: "https://www.sampdoria.it/news/2019/05/18/lega-serie-a-quagliarella-e-il-miglior-attaccante-della-stagione-2018-19/" }, "2018/19");
group(["Henri Michel", "Mickaël Landreau", "Japhet N'Doram", "Maxime Bossis", "Vahid Halilhodžić", "Didier Deschamps"], "Selected for FC Nantes' Tribune des Légendes tribute", { label: "FC Nantes · Official supporters' legends selection", url: "https://www.fcnantes.com/magazine/2425/85Magazine241124.pdf" }, "2024");
add("Serge Chiesa", "Lyon's record competitive appearance maker", { label: "Olympique Lyonnais · Historical players register", url: "https://www.ol.fr/ja/club/history/historical-players" }, "As checked October 2026", "record");
add("Jean-Luc Ettori", "Monaco's record competitive appearance maker", { label: "AS Monaco · Ettori's playing record", url: "https://www.asmonaco.com/fr/news/jean-luc-ettori-le-dernier-rempart-aux-602-matchs-dans-lelite" }, "As checked October 2026", "record");
add("Ludovic Giuly", "Featured in Monaco's centenary emblematic-player selection", { label: "AS Monaco · Emblematic players: Giuly", url: "https://www.asmonaco.com/fr/news/ludovic-giuly-le-leader-naturel-des-annees-2000-et-de-lepopee-en-ligue-des-champions" }, "2026", "recognition");
const atletiWalk = { label: "Atlético de Madrid · Official Walk of Legends", url: "https://en.atleticodemadrid.com/noticias/walk-of-legends" };
group(["Luis Aragonés", "Adelardo Rodríguez", "Antoine Griezmann", "Koke", "Fernando Torres", "José Eulogio Gárate", "Paulo Futre", "Diego Godín", "Diego Simeone", "Jan Oblak"], "Honoured on Atlético's Walk of Legends · 100-plus official appearances", atletiWalk);
add("Antoine Griezmann", "UEFA EURO Player of the Tournament", { label: "UEFA · EURO 2016 technical observers' award", url: "https://www.uefa.com/uefaeuro/history/news/0253-0d7e2e6279ee-85afb727a911-1000--antoine-griezmann-named-player-of-the-tournament/" }, "2016");
add("Fernando Torres", "UEFA EURO Golden Boot", { label: "UEFA · Torres's Golden Boot", url: "https://www.uefa.com/uefaeuro/history/news/0252-0cd3fae4b774-6f83b86556ad-1000--late-surge-earns-torres-adidas-golden-boot/" }, "2012");
add("Jan Oblak", "LALIGA Player of the Season / MVP", { label: "Atlético de Madrid / LALIGA · Oblak's MVP award", url: "https://www.atleticodemadrid.com/noticias/oblak-elegido-por-laliga-mvp-de-la-temporada" }, "2020/21");
add("Jan Oblak", "Zamora Trophy · five verified winning seasons through 2020/21", { label: "Atlético de Madrid · Zamora award history", url: "https://en.atleticodemadrid.com/noticias/jan-oblak-wins-2020-21-zamora-trophy" }, "2015/16, 2016/17, 2017/18, 2018/19, 2020/21");
add("Jesús Navas", "UEFA Europa League Player of the Season", { label: "UEFA · Navas individual season award", url: "https://www.uefa.com/uefaeuropaleague/news/0282-182d126f80e8-eece8c3aab06-1000--jesus-navas-named-2022-23-uefa-europa-league-player-of-the-s/" }, "2022/23");
group(["Pablo Blanco", "Marcelo Campanal", "Juan Arza"], "Sevilla FC Dorsal de Leyenda distinction", { label: "Sevilla FC · Dorsal de Leyenda recipients", url: "https://sevillafc.es/actualidad/noticias/pablo-blanco-santo-y-sena-del-sevilla-fc-nuevo-dorsal-de-leyenda" });
add("Gaizka Mendieta", "UEFA Club Midfielder of the Year", { label: "Valencia CF · Mendieta's individual awards", url: "https://www.valenciacf.com/es-mendieta-me-siento-orgulloso-que-todavia-a-fecha-de-hoy-se-recuerda-a-mendieta-como-historia-del-vcf-2019-03-16" }, "2000, 2001");
add("Santiago Cañizares", "Zamora Trophy · three Valencia winning seasons", { label: "Valencia CF · 2024/25 annual report honours register", url: "https://www.valenciacf.com/public/Attachment/2026/2/grupo_vcf_ccaa_2024-2025.pdf" }, "2000/01, 2001/02, 2003/04");

/** Career-history sources are retained for incomplete records, but are never
 * presented as evidence that an unverified individual award was won. */
const careerSources = new Map<string, HonourSource[]>();
for (const league of footballGreats) {
  for (const p of league.players) careerSources.set(p.name, [{ label: league.sourceLabel, url: league.sourceUrl }]);
  for (const club of league.clubs) for (const p of club.players) {
    const entry = careerSources.get(p.name) ?? [];
    if (!entry.some((source) => source.url === club.sourceUrl)) entry.push({ label: club.sourceLabel, url: club.sourceUrl });
    careerSources.set(p.name, entry);
  }
}
for (const p of globalGoats) if (!careerSources.has(p.name)) careerSources.set(p.name, []);

export const playerHonoursByName: Record<string, PlayerHonoursProfile> = Object.fromEntries(
  [...careerSources].map(([name, career]) => {
    const honours = verified[name] ?? [];
    const awardSources = honours.map((honour) => ({ label: honour.sourceLabel, url: honour.sourceUrl }));
    const uniqueSources = [...new Map([...awardSources, ...career].map((source) => [source.url, source])).values()];
    return [name, {
      honours, sources: uniqueSources, checkedAt,
      status: honours.length ? "verified" : "not-yet-verified",
      ...(!honours.length ? { verificationNote: "Individual honour not yet verified for this archive. This does not mean the player won none; team trophies are not substituted for personal awards." } : {}),
    } satisfies PlayerHonoursProfile];
  }),
);

export const playerHonoursMethod = {
  checkedAt,
  note: "Selected individual awards and explicitly labelled recognition, with source links. Award years shown are verified historical wins; this is not a complete career award count. Hall of Fame membership and official legend recognition are distinguished from competitive awards. The rankings remain subjective. Incomplete archival records display an explicit verification note instead of invented honours.",
  verifiedPlayers: Object.values(playerHonoursByName).filter((profile) => profile.status === "verified").length,
  totalPlayers: Object.keys(playerHonoursByName).length,
};
