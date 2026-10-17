/**
 * TerraScope's editorial men's football archive.
 * Array order is the editorial ranking; sources establish historical context,
 * club associations and achievements. They do not endorse these rankings.
 */
export type GreatPlayer = {
  name: string;
  reason: string;
  country?: string;
  era?: string;
};

export type ClubGreats = {
  id: string;
  name: string;
  city: string;
  players: GreatPlayer[];
  sourceUrl: string;
  sourceLabel: string;
};

export type LeagueGreats = {
  id: string;
  countryCode: string;
  name: string;
  country: string;
  description: string;
  players: GreatPlayer[];
  clubs: ClubGreats[];
  sourceUrl: string;
  sourceLabel: string;
};

const player = (name: string, reason: string, country?: string, era?: string): GreatPlayer => ({ name, reason, ...(country ? { country } : {}), ...(era ? { era } : {}) });

export const footballGreats: LeagueGreats[] = [
  {
    id: "england", countryCode: "GB", name: "English top flight", country: "England",
    description: "First Division and Premier League history, including the years before 1992. League places weigh performances in England; club places consider the player's full contribution to that club.",
    sourceUrl: "https://www.premierleague.com/en/events/hall-of-fame/inductees", sourceLabel: "Premier League · Hall of Fame",
    players: [
      player("Thierry Henry", "At Arsenal, he joined elite finishing to chance creation and made the Invincibles' attack feel almost unstoppable.", "France", "1990s–2010s"),
      player("Bobby Charlton", "A powerful runner and shooter who drove Manchester United's recovery and title-winning football across generations.", "England", "1950s–1970s"),
      player("Kenny Dalglish", "Liverpool's attacking reference point: a scorer whose awareness and combinations made everyone around him more dangerous.", "Scotland", "1970s–1990s"),
      player("Alan Shearer", "Sustained top-flight scoring for Southampton, Blackburn and Newcastle makes his domestic body of work exceptional.", "England", "1980s–2000s"),
      player("Jimmy Greaves", "An extraordinary penalty-area instinct underpinned his prolific league careers with Chelsea and Tottenham.", "England", "1950s–1970s"),
      player("George Best", "Two-footed dribbling and inventive finishing gave Manchester United one of the English game's most electrifying peaks.", "Northern Ireland", "1960s–1980s"),
      player("Wayne Rooney", "Combined scoring, passing and work rate across different roles while helping Manchester United sustain domestic success.", "England", "2000s–2020s"),
      player("Frank Lampard", "Chelsea's late-arriving midfielder delivered exceptional scoring consistency throughout a sustained period of league contention.", "England", "1990s–2010s"),
      player("Steven Gerrard", "Liverpool repeatedly relied on his passing range, athletic power and ability to change difficult league matches.", "England", "1990s–2010s"),
      player("Kevin De Bruyne", "His passing angles, delivery and creative control became defining features of Manchester City's domestic dominance.", "Belgium", "2010s–2020s"),
    ],
    clubs: [
      {
        id: "manchester-united", name: "Manchester United", city: "Manchester",
        sourceUrl: "https://www.manutd.com/en/club/history/history-by-decade", sourceLabel: "Manchester United · History by decade",
        players: [
          player("Bobby Charlton", "A bridge between the Busby Babes and European champions, with leadership and outstanding attacking range."),
          player("George Best", "His balance, imagination and match-winning dribbling gave the United Trinity its unpredictable edge."),
          player("Denis Law", "The Trinity's fearless finisher, remembered for instinctive movement and a fierce connection with the Stretford End."),
          player("Ryan Giggs", "Evolved from an explosive winger into an experienced creator across an unusually long run of United success."),
          player("Paul Scholes", "A precise passer and dangerous shooter who helped United control games through several title-winning generations."),
        ],
      },
      {
        id: "liverpool", name: "Liverpool", city: "Liverpool",
        sourceUrl: "https://www.liverpoolfc.com/info/past-players", sourceLabel: "Liverpool FC · Player history",
        players: [
          player("Kenny Dalglish", "The touch, vision and finishing at the centre of some of Liverpool's most accomplished attacking teams."),
          player("Steven Gerrard", "An influential captain whose all-round midfield game repeatedly lifted Liverpool in decisive matches."),
          player("Ian Rush", "Relentless movement, pressing and clinical finishing made him the reference point for Liverpool goalscorers."),
          player("Mohamed Salah", "Redefined Liverpool's right-sided attacking role with sustained scoring, creation and decisive contributions to major trophies."),
          player("John Barnes", "A brilliant winger who later controlled midfield, combining invention with the intelligence to adapt his game."),
        ],
      },
      {
        id: "arsenal", name: "Arsenal", city: "London",
        sourceUrl: "https://www.arsenal.com/feature/the-wenger-years-a05Ex7F5N6vd", sourceLabel: "Arsenal · The Wenger years",
        players: [
          player("Thierry Henry", "Turned pace and technique into Arsenal's most recognisable attacking language, as both scorer and provider."),
          player("Dennis Bergkamp", "His first touch, disguised passing and partnership play gave Arsenal's attacks an exceptional creative centre."),
          player("Tony Adams", "A homegrown defensive leader whose influence connected Arsenal's successful sides before and during the Wenger era."),
          player("Patrick Vieira", "Brought authority, ball-winning and forward momentum to the midfield of Arsenal's title-winning teams."),
          player("Ian Wright", "An instinctive, exuberant finisher whose goals and personality forged a lasting bond with Arsenal supporters."),
        ],
      },
      {
        id: "chelsea", name: "Chelsea", city: "London",
        sourceUrl: "https://www.chelseafc.com/en/news/article/chelsea-fcs-all-time-record-goalscorers", sourceLabel: "Chelsea FC · Club scoring history",
        players: [
          player("Frank Lampard", "Midfield intelligence and dependable scoring anchored Chelsea through changing managers and repeated trophy challenges."),
          player("John Terry", "A commanding academy graduate whose defensive leadership became central to Chelsea's most successful era."),
          player("Didier Drogba", "Powerful centre-forward play and an extraordinary appetite for finals made him a defining Chelsea match-winner."),
          player("Gianfranco Zola", "Brought imagination, close control and a playful creative spark that helped transform the club's ambitions."),
          player("Peter Osgood", "A skilful, imposing striker whose cup exploits and connection with supporters made him a Stamford Bridge icon."),
        ],
      },
      {
        id: "manchester-city", name: "Manchester City", city: "Manchester",
        sourceUrl: "https://www.mancity.com/mancitylegends", sourceLabel: "Manchester City · Historic players",
        players: [
          player("Sergio Agüero", "Repeatedly supplied City's decisive finishes, including the goal that transformed the club's modern history."),
          player("Kevin De Bruyne", "Combined creative risk with precision, supplying the passes and crosses that made City's attacks so difficult to contain."),
          player("Colin Bell", "An energetic, complete midfielder and the enduring playing symbol of City's successful late-1960s generation."),
          player("David Silva", "His awareness and close control helped City dictate matches and turn crowded areas into scoring opportunities."),
          player("Vincent Kompany", "The defensive captain whose leadership and timely interventions guided City's emergence as a lasting force."),
        ],
      },
      {
        id: "tottenham", name: "Tottenham Hotspur", city: "London",
        sourceUrl: "https://www.tottenhamhotspur.com/the-club/history/hall-of-fame/", sourceLabel: "Tottenham Hotspur · Hall of Fame",
        players: [
          player("Jimmy Greaves", "His effortless-looking finishing and anticipation remain the benchmark for a Tottenham penalty-area scorer."),
          player("Harry Kane", "Grew from academy prospect into Tottenham's record scorer while adding exceptional passing to his centre-forward game."),
          player("Danny Blanchflower", "The thoughtful captain and midfield organiser at the heart of Spurs' celebrated league-and-cup double team."),
          player("Glenn Hoddle", "A gifted passer whose technique, vision and invention expressed Tottenham's preference for adventurous football."),
          player("Steve Perryman", "Exceptional service, versatility and captaincy carried Spurs through difficult seasons and back to major cup success."),
        ],
      },
    ],
  },
  {
    id: "france", countryCode: "FR", name: "French top flight", country: "France",
    description: "Division 1 and Ligue 1 contributions across the competition's history. A player's achievements in another league or with France do not determine this order.",
    sourceUrl: "https://ligue1.com/fr/articles/l1_article_80-historique-et-records-du-classement-des-buteurs-l1", sourceLabel: "Ligue 1 · Historical scoring honours",
    players: [
      player("Kylian Mbappé", "His Monaco breakthrough and sustained Paris scoring combined a remarkable domestic peak with repeated league success.", "France", "2010s–2020s"),
      player("Juninho Pernambucano", "The creative leader and set-piece specialist who became the playing emblem of Lyon's long championship run.", "Brazil", "2000s"),
      player("Jean-Pierre Papin", "Explosive finishing and repeated scoring excellence helped drive Marseille's dominance around the turn of the 1990s.", "France", "1980s–1990s"),
      player("Delio Onnis", "Exceptional sustained scoring at Reims, Monaco, Tours and Toulon gives his French-league career a formidable foundation.", "Argentina", "1970s–1980s"),
      player("Zlatan Ibrahimović", "An outstanding scoring and playmaking peak established the standard for Paris Saint-Germain's early modern title teams.", "Sweden", "2010s"),
      player("Raymond Kopa", "His creativity helped make Stade de Reims a major force in the French championship across two spells.", "France", "1950s–1960s"),
      player("Just Fontaine", "His league work for Nice and Reims combined sharp penalty-area instincts with championship-winning attacking influence.", "France", "1950s–1960s"),
      player("Michel Platini", "At Nancy and Saint-Étienne, passing, free kicks and scoring made him a leading domestic playmaker before Italy.", "France", "1970s–1980s"),
      player("Rachid Mekhloufi", "An inventive forward whose sustained Saint-Étienne contribution helped build the club's championship identity.", "Algeria", "1950s–1960s"),
      player("Bernard Lacombe", "A long scoring career with Lyon, Saint-Étienne and Bordeaux joined exceptional longevity to repeated domestic relevance.", "France", "1970s–1980s"),
    ],
    clubs: [
      {
        id: "paris-saint-germain", name: "Paris Saint-Germain", city: "Paris",
        sourceUrl: "https://en.psg.fr/teams/first-team/content/kylian-mbappe-a-legend-among-paris-saint-germain-goalscorers-paris-saint-germain-psg-nantes-ligue-1-22-23", sourceLabel: "Paris Saint-Germain · Club scoring legends",
        players: [
          player("Kylian Mbappé", "His sustained attacking output and decisive pace made him a central figure in Paris' domestic era of success."),
          player("Zlatan Ibrahimović", "A commanding scorer and creator who gave the emerging modern PSG an unmistakable playing personality."),
          player("Edinson Cavani", "Intelligent movement, selfless running and determined finishing earned a deep connection with the Paris crowd."),
          player("Safet Sušić", "A technically exceptional playmaker whose imagination helped define Parisian football well before the modern investment era."),
          player("Pauleta", "An outstanding finisher and dependable attacking leader during years when PSG could not rely on overwhelming resources."),
        ],
      },
      {
        id: "marseille", name: "Olympique de Marseille", city: "Marseille",
        sourceUrl: "https://www.om.fr/fr/histoire-palmares", sourceLabel: "Olympique de Marseille · Club history",
        players: [
          player("Jean-Pierre Papin", "Spectacular finishing and relentless scoring made him the attacking face of Marseille's rise to European prominence."),
          player("Josip Skoblar", "A devastating scorer whose partnership with Roger Magnusson powered one of Marseille's great league-winning attacks."),
          player("Abedi Pelé", "Close control and incisive creation gave Marseille a player capable of opening the strongest European defences."),
          player("Didier Deschamps", "A disciplined midfield organiser and captain of the team that delivered Marseille's defining European triumph."),
          player("Basile Boli", "An influential central defender remembered above all for the header that secured the European Cup."),
        ],
      },
      {
        id: "lyon", name: "Olympique Lyonnais", city: "Lyon",
        sourceUrl: "https://www.ol.fr/en/news/inoubliable-juninho-23123-2", sourceLabel: "Olympique Lyonnais · Juninho and club history",
        players: [
          player("Juninho Pernambucano", "The creative centre of Lyon's championship dynasty, with free kicks that made fouls around the box especially costly."),
          player("Fleury Di Nallo", "A prolific forward whose long service established an enduring Lyon standard across the 1960s and 1970s."),
          player("Serge Chiesa", "A skilful, inventive attacking midfielder whose sustained service helped shape Lyon's identity before the title dynasty."),
          player("Sonny Anderson", "His goals and attacking authority helped Lyon take the decisive step from contender to champion."),
          player("Sidney Govou", "A homegrown forward whose mobility and commitment connected the full run of Lyon's consecutive league titles."),
        ],
      },
      {
        id: "saint-etienne", name: "AS Saint-Étienne", city: "Saint-Étienne",
        sourceUrl: "https://www.asse.fr/cinquantenaire/", sourceLabel: "AS Saint-Étienne · Historical anniversary archive",
        players: [
          player("Rachid Mekhloufi", "A creative and decisive forward who helped establish Saint-Étienne's enduring domestic standing."),
          player("Hervé Revelli", "The prolific finisher whose movement and consistency helped sustain the club's exceptional championship era."),
          player("Robert Herbin", "A versatile, decorated player whose midfield and defensive work earned this place independently of his later coaching career."),
          player("Dominique Rocheteau", "His speed and dribbling made the young winger a symbol of the Verts' celebrated European adventure."),
          player("Osvaldo Piazza", "A powerful central defender whose forward surges added a distinctive attacking dimension to a great Saint-Étienne team."),
        ],
      },
      {
        id: "monaco", name: "AS Monaco", city: "Monaco",
        sourceUrl: "https://www.asmonaco.com/fr/club/histoire/100-ans/les-joueurs-emblematiques", sourceLabel: "AS Monaco · Emblematic players",
        players: [
          player("Delio Onnis", "A prolific goalscorer who stayed through relegation and helped return Monaco to the top of French football."),
          player("Jean-Luc Ettori", "Exceptional continuity and dependable goalkeeping made him a link between several successful Monaco generations."),
          player("Claude Puel", "A tenacious, one-club midfielder whose long playing career embodied Monaco's competitive standards."),
          player("Ludovic Giuly", "A direct, energetic attacking captain who led Monaco through its extraordinary run to the European final."),
          player("Radamel Falcao", "An accomplished centre-forward whose leadership and finishing helped drive Monaco's memorable modern league triumph."),
        ],
      },
      {
        id: "nantes", name: "FC Nantes", city: "Nantes",
        sourceUrl: "https://www.fcnantes.com/magazine/2425/85Magazine241124.pdf", sourceLabel: "FC Nantes · Tribune des Légendes",
        players: [
          player("Henri Michel", "A poised, influential midfielder whose long Nantes career helped establish the club's attractive collective style."),
          player("Maxime Bossis", "A composed and versatile defender whose reading of the game underpinned several successful Nantes sides."),
          player("Japhet N'Doram", "Inventive attacking play and intelligent finishing made him a leading figure in Nantes' celebrated 1990s team."),
          player("Vahid Halilhodžić", "A powerful, reliable finisher whose scoring helped Nantes sustain its place among France's strongest clubs."),
          player("Mickaël Landreau", "A homegrown goalkeeper and young captain whose authority extended through domestic cup and league successes."),
        ],
      },
    ],
  },
  {
    id: "germany", countryCode: "DE", name: "Bundesliga", country: "Germany",
    description: "The league ranking covers Bundesliga performances since 1963. Club histories also include earlier German football, so pre-Bundesliga icons can appear in club lists.",
    sourceUrl: "https://www.bundesliga.com/en/history", sourceLabel: "Bundesliga · Official historical archive",
    players: [
      player("Gerd Müller", "His extraordinary penalty-area instinct supplied the goals behind Bayern's transformation into the Bundesliga's leading force.", "Germany", "1960s–1970s"),
      player("Franz Beckenbauer", "An elegant defender who turned carrying and distribution from the back into a decisive Bundesliga weapon.", "Germany", "1960s–1980s"),
      player("Robert Lewandowski", "Sustained elite finishing for Dortmund and Bayern combined an outstanding scoring peak with repeated league success.", "Poland", "2010s–2020s"),
      player("Lothar Matthäus", "A commanding midfielder and later sweeper whose Gladbach and Bayern performances spanned very different tactical eras.", "Germany", "1970s–2000s"),
      player("Manuel Neuer", "Changed the league's expectations of a goalkeeper's positioning and distribution while anchoring successful Bayern teams.", "Germany", "2000s–2020s"),
      player("Karl-Heinz Rummenigge", "Direct running, technical quality and accomplished finishing made him one of Bayern's outstanding domestic attacking leaders.", "Germany", "1970s–1980s"),
      player("Thomas Müller", "Exceptional movement and awareness gave Bayern a durable source of goals, assists and attacking solutions.", "Germany", "2000s–2020s"),
      player("Günter Netzer", "Gladbach's bold midfield conductor brought expansive passing and individual invention to one of the league's great rivalries.", "Germany", "1960s–1970s"),
      player("Uwe Seeler", "Hamburg's loyal forward brought relentless scoring, aerial skill and leadership into the new national Bundesliga.", "Germany", "1960s–1970s"),
      player("Oliver Kahn", "His shot-stopping, concentration and competitive authority helped set the goalkeeping standard at Karlsruhe and Bayern.", "Germany", "1980s–2000s"),
    ],
    clubs: [
      {
        id: "bayern-munich", name: "Bayern Munich", city: "Munich",
        sourceUrl: "https://fcbayern.com/en/club/hall-of-fame", sourceLabel: "FC Bayern · Hall of Fame",
        players: [
          player("Franz Beckenbauer", "The libero whose intelligence and authority helped turn Bayern into a lasting European institution."),
          player("Gerd Müller", "Instinctive finishing supplied the attacking foundation for Bayern's first great era of domestic and European success."),
          player("Sepp Maier", "An agile, dependable goalkeeper whose continuity anchored Bayern's rise through the 1960s and 1970s."),
          player("Lothar Matthäus", "A dominant midfield presence who later adapted his leadership and reading of the game to the libero role."),
          player("Philipp Lahm", "A tactically outstanding full-back and captain whose reliability endured across Bayern's successful modern teams."),
        ],
      },
      {
        id: "borussia-dortmund", name: "Borussia Dortmund", city: "Dortmund",
        sourceUrl: "https://www.bundesliga.com/en/bundesliga/news/borussia-dortmund-bundesliga-club-by-club-historical-guide-klopp-reus-zorc-24117", sourceLabel: "Bundesliga · Borussia Dortmund history",
        players: [
          player("Michael Zorc", "Exceptional service, midfield goals and captaincy made him a cornerstone of Dortmund's return to major honours."),
          player("Alfred Preißler", "A prolific forward and captain whose influence reaches back to Dortmund's championship sides before the Bundesliga."),
          player("Matthias Sammer", "The fiercely competitive libero whose reading of the game powered Dortmund's outstanding mid-1990s team."),
          player("Marco Reus", "A technically gifted attacker whose sustained commitment and creative quality made him a modern Dortmund reference point."),
          player("Lars Ricken", "A homegrown attacking talent remembered for the audacious finish that sealed Dortmund's greatest European night."),
        ],
      },
      {
        id: "schalke", name: "Schalke 04", city: "Gelsenkirchen",
        sourceUrl: "https://schalke04.de/verein/tradition/schalke-legenden/", sourceLabel: "Schalke 04 · Club legends",
        players: [
          player("Ernst Kuzorra", "A leading figure in the pre-Bundesliga Schalke team whose combination play made the club a national power."),
          player("Fritz Szepan", "The intelligent organiser whose vision and passing gave Schalke's celebrated early attacking game its direction."),
          player("Klaus Fischer", "Sustained scoring and acrobatic finishing made him the defining striker of Schalke's Bundesliga history."),
          player("Olaf Thon", "A homegrown midfielder who returned as a defensive leader and helped guide Schalke to European success."),
          player("Reinhard 'Stan' Libuda", "An elusive winger whose close control and one-on-one skill made him one of Schalke's most loved players."),
        ],
      },
      {
        id: "borussia-monchengladbach", name: "Borussia Mönchengladbach", city: "Mönchengladbach",
        sourceUrl: "https://www.bundesliga.com/en/bundesliga/news/borussia-monchengladbach-bundesliga-club-by-club-historical-guide-heynckes-netzer-24134", sourceLabel: "Bundesliga · Mönchengladbach history",
        players: [
          player("Günter Netzer", "The expansive playmaker whose daring passing became a signature of Gladbach's adventurous championship football."),
          player("Berti Vogts", "Relentless defending and exceptional service made him the competitive backbone of the club's golden generation."),
          player("Jupp Heynckes", "An outstanding scorer whose movement and finishing sustained Gladbach's domestic and European challenges."),
          player("Allan Simonsen", "A nimble, inventive attacker whose performances brought international recognition to Gladbach's exceptional 1970s team."),
          player("Rainer Bonhof", "A powerful, versatile midfielder whose set pieces and energy strengthened a remarkably complete side."),
        ],
      },
      {
        id: "hamburg", name: "Hamburger SV", city: "Hamburg",
        sourceUrl: "https://www.hsv.de/unser-hsv/historie/die-geschichte-des-hsv", sourceLabel: "Hamburger SV · Club history",
        players: [
          player("Uwe Seeler", "A loyal, prolific centre-forward whose goals and character became inseparable from Hamburg's football identity."),
          player("Kevin Keegan", "His movement and attacking drive helped lift Hamburg back to the top of German football."),
          player("Felix Magath", "A skilful midfield creator whose decisive European final strike remains a defining moment in club history."),
          player("Manfred Kaltz", "A long-serving attacking full-back whose distinctive crossing gave Hamburg a valuable source of chances."),
          player("Horst Hrubesch", "A commanding aerial striker whose finishing formed an outstanding partnership with Kaltz's delivery."),
        ],
      },
      {
        id: "werder-bremen", name: "Werder Bremen", city: "Bremen",
        sourceUrl: "https://www.bundesliga.com/en/bundesliga/news/werder-bremen-bundesliga-club-by-club-historical-guide-ozil-pizarro-rehhagel-24116", sourceLabel: "Bundesliga · Werder Bremen history",
        players: [
          player("Claudio Pizarro", "An accomplished finisher whose repeated spells and enduring influence made him one of Bremen's most beloved players."),
          player("Marco Bode", "Versatile, dependable attacking service helped Werder compete successfully across a long period of domestic football."),
          player("Aílton", "His acceleration and ruthless finishing powered the attack during Bremen's memorable league-and-cup double season."),
          player("Johan Micoud", "The elegant playmaker whose vision and passing gave Bremen's successful attacking team its creative direction."),
          player("Frank Baumann", "A disciplined midfield and defensive organiser whose captaincy helped keep a free-scoring side balanced."),
        ],
      },
    ],
  },
  {
    id: "spain", countryCode: "ES", name: "La Liga", country: "Spain",
    description: "Domestic top-flight performances since 1929. Club lists consider the player's wider service to that club, including cups and European football.",
    sourceUrl: "https://www.laliga.com/en-ES/partidazos/el-clasico", sourceLabel: "LALIGA · Historical player profiles",
    players: [
      player("Lionel Messi", "An exceptional combination of scoring, dribbling and creation shaped Barcelona's league football across a sustained elite career.", "Argentina", "2000s–2020s"),
      player("Cristiano Ronaldo", "His extraordinary scoring peak at Real Madrid combined relentless movement with outstanding individual match-winning power.", "Portugal", "2000s–2010s"),
      player("Alfredo Di Stéfano", "His all-action attacking influence helped transform Real Madrid into the dominant force of early modern Spanish football.", "Argentina / Spain", "1950s–1960s"),
      player("Xavi Hernández", "The midfield conductor whose scanning, positioning and passing helped Barcelona control the rhythm of league matches.", "Spain", "1990s–2010s"),
      player("Andrés Iniesta", "Exceptional close control and spatial awareness allowed Barcelona to create advantages in the tightest midfield spaces.", "Spain", "2000s–2010s"),
      player("Telmo Zarra", "A commanding centre-forward whose sustained scoring made Athletic Club a leading force in the early post-war league.", "Spain", "1940s–1950s"),
      player("Ferenc Puskás", "An outstanding left-footed finisher whose Real Madrid scoring extended one of the league's great attacking eras.", "Hungary / Spain", "1950s–1960s"),
      player("Paco Gento", "Pace, crossing and remarkable continuity on the left helped Real Madrid sustain championship-winning football for years.", "Spain", "1950s–1970s"),
      player("Raúl", "Intelligent movement and reliable finishing made him a lasting reference point in Real Madrid's domestic attack.", "Spain", "1990s–2010s"),
      player("Sergio Ramos", "A long-serving Real Madrid defender whose aggression, distribution and scoring added influence at both ends of the pitch.", "Spain", "2000s–2020s"),
    ],
    clubs: [
      {
        id: "real-madrid", name: "Real Madrid", city: "Madrid",
        sourceUrl: "https://www.realmadrid.com/en-US/the-club/history/football-legends/alfredo-di-stefano-laulhe", sourceLabel: "Real Madrid · Historical legends",
        players: [
          player("Alfredo Di Stéfano", "The complete attacking leader around whom Real Madrid built its first great era of European supremacy."),
          player("Cristiano Ronaldo", "Extraordinary scoring and repeated decisive European performances made him a defining figure in Madrid's modern history."),
          player("Paco Gento", "An exceptionally quick winger whose long service connected several generations of domestic and European champions."),
          player("Ferenc Puskás", "His precise left foot and scoring partnership with Di Stéfano gave Madrid an extraordinary attacking dimension."),
          player("Raúl", "A homegrown forward whose movement, finishing and leadership linked Madrid's successful teams across changing eras."),
        ],
      },
      {
        id: "barcelona", name: "FC Barcelona", city: "Barcelona",
        sourceUrl: "https://www.fcbarcelona.com/en/club/history/legendary-players", sourceLabel: "FC Barcelona · Legendary players",
        players: [
          player("Lionel Messi", "Scoring, creation and dribbling came together in a player who defined Barcelona's most successful playing era."),
          player("Johan Cruyff", "As a player, his freedom of movement and technical authority helped transform Barcelona's confidence and attacking football."),
          player("Xavi Hernández", "An outstanding midfield organiser whose understanding of space made Barcelona's possession game so demanding to face."),
          player("Andrés Iniesta", "His composure, close control and decisive interventions gave Barcelona solutions when organised opponents closed every obvious route."),
          player("Ronaldinho", "Brought invention and joy back to Barcelona, helping restore the team's belief before the next great generation."),
        ],
      },
      {
        id: "atletico-madrid", name: "Atlético de Madrid", city: "Madrid",
        sourceUrl: "https://en.atleticodemadrid.com/noticias/koke-equals-adelardo-as-the-player-with-most-games-in-our-history", sourceLabel: "Atlético de Madrid · Historical player records",
        players: [
          player("Luis Aragonés", "An accomplished goalscorer and attacking leader whose playing influence preceded his equally important years as a coach."),
          player("Adelardo Rodríguez", "A versatile midfielder whose exceptional service helped Atlético compete successfully at home and in Europe."),
          player("Antoine Griezmann", "An unusually complete attacker whose scoring, chance creation and work without the ball made him central to Atlético."),
          player("Koke", "A homegrown midfield organiser and captain whose continuity connects Atlético's successful modern teams."),
          player("Fernando Torres", "The academy striker who carried Atlético's hopes through difficult years and returned to share in European success."),
        ],
      },
      {
        id: "athletic-club", name: "Athletic Club", city: "Bilbao",
        sourceUrl: "https://www.laliga.com/noticias/jugadores-historicos-del-athletic-club", sourceLabel: "LALIGA · Athletic Club historical players",
        players: [
          player("Telmo Zarra", "A formidable striker whose goals made him a lasting emblem of Athletic's attacking tradition."),
          player("José Ángel Iribar", "Exceptional goalkeeping and long service made him one of the club's most enduring figures."),
          player("Rafael 'Pichichi' Moreno", "An early goalscoring icon whose reputation became part of Spanish football's language and Athletic's foundation story."),
          player("Agustín 'Piru' Gainza", "An outstanding winger whose skill and longevity connected Athletic's successful teams across the mid-century years."),
          player("Julen Guerrero", "A gifted attacking midfielder whose decision to remain at Athletic strengthened his bond with generations of supporters."),
        ],
      },
      {
        id: "valencia", name: "Valencia CF", city: "Valencia",
        sourceUrl: "https://www.valenciacf.com/nuestra-historia", sourceLabel: "Valencia CF · Club history",
        players: [
          player("Mario Kempes", "An explosive scorer whose attacking power helped deliver one of Valencia's great European and domestic cup eras."),
          player("Edmundo 'Mundo' Suárez", "A prolific centre-forward and central figure in Valencia's first great league-winning generation."),
          player("Antonio Puchades", "A loyal, influential midfielder whose football and local connection made him a lasting Valencia reference point."),
          player("Gaizka Mendieta", "A dynamic midfield leader whose passing, goals and authority helped Valencia reach consecutive European finals."),
          player("David Albelda", "A disciplined defensive midfielder and captain at the heart of Valencia's successful early-2000s teams."),
        ],
      },
      {
        id: "sevilla", name: "Sevilla FC", city: "Seville",
        sourceUrl: "https://sevillafc.es/actualidad/noticias/dos-lonas-en-preferencia-para-rendir-tributo-emblemas-cantera-y-futbol-femenino", sourceLabel: "Sevilla FC · Historical club emblems",
        players: [
          player("Jesús Navas", "A homegrown winger and later full-back whose pace, delivery and longevity linked Sevilla's great modern European teams."),
          player("Juan Arza", "A skilful forward whose scoring and long service helped establish Sevilla's enduring attacking reputation."),
          player("Frédéric Kanouté", "An elegant centre-forward whose intelligent link play and decisive goals drove Sevilla's rise in European competition."),
          player("Pablo Blanco", "A committed, long-serving defender whose playing career helped establish him as one of Sevilla's enduring figures."),
          player("Marcelo Campanal", "An athletic, commanding defender whose performances made him a reference point in the club's history."),
        ],
      },
    ],
  },
  {
    id: "nigeria", countryCode: "NG", name: "Nigerian top flight", country: "Nigeria",
    description: "Nigeria's domestic championship across its historical names, with club heritage and continental impact included in club selections. Overseas fame and Super Eagles achievements are separate from domestic league contribution.",
    sourceUrl: "https://npfl.com.ng/2024/05/17/elegbeleye-salutes-legendary-goalkeeper-okala-at-73/", sourceLabel: "NPFL · Nigeria's domestic football heritage",
    players: [
      player("Segun Odegbami", "His intelligent wing play and attacking craft helped make Shooting Stars a defining force of Nigerian club football.", "Nigeria", "1970s–1980s"),
      player("Christian Chukwu", "A commanding defender and captain whose Rangers career helped establish the standard for domestic leadership.", "Nigeria", "1970s–1980s"),
      player("Mudashiru Lawal", "A tireless, technically accomplished midfielder whose work with Shooting Stars enriched a landmark era of Nigerian football.", "Nigeria", "1970s–1980s"),
      player("Rabiu Ali", "Exceptional service, creative responsibility and sustained scoring influence made him the modern playing emblem of Kano Pillars.", "Nigeria", "2000s–2020s"),
      player("Emmanuel Okala", "His imposing goalkeeping helped Rangers become one of the defining teams of the championship's formative years.", "Nigeria", "1970s–1980s"),
      player("Vincent Enyeama", "A commanding goalkeeper whose consistency helped anchor Enyimba's rise through repeated domestic championship campaigns.", "Nigeria", "2000s"),
      player("Felix Owolabi", "A forceful, versatile attacking player whose sustained Shooting Stars contribution extended beyond a single successful generation.", "Nigeria", "1970s–1990s"),
      player("Haruna Ilerika", "A creative, elusive Stationery Stores favourite whose domestic performances helped shape Lagos football's attacking identity.", "Nigeria", "1970s–1980s"),
      player("Emeka Nwanna", "A leading Enyimba forward whose goals and sustained domestic influence helped establish the club among Nigeria's major powers.", "Nigeria", "1990s–2000s"),
      player("Rashidi Yekini", "His Shooting Stars breakthrough brought exceptional finishing to a side competing at the forefront of Nigerian football.", "Nigeria", "1980s"),
    ],
    clubs: [
      {
        id: "enyimba", name: "Enyimba", city: "Aba",
        sourceUrl: "https://enyimbafc.net/10-interesting-things-to-know-about-enyimba-fc/", sourceLabel: "Enyimba FC · Club legends archive",
        players: [
          player("Vincent Enyeama", "A decisive goalkeeper during the domestic and continental campaigns that made Enyimba a landmark Nigerian side."),
          player("Emeka Nwanna", "An influential forward whose finishing helped carry Enyimba into its celebrated era of major honours."),
          player("Muri Ogunbiyi", "A skilful attacking contributor whose creativity became an important part of Enyimba's outstanding African campaigns."),
          player("Obinna Nwaneri", "A composed defensive figure who helped give Enyimba's successful teams the platform to compete across the continent."),
          player("Onyekachi Okonkwo", "An influential midfielder whose energy and technical contribution strengthened Enyimba through its breakthrough years."),
        ],
      },
      {
        id: "enugu-rangers", name: "Enugu Rangers", city: "Enugu",
        sourceUrl: "https://www.rangersintl.com/history", sourceLabel: "Rangers International · Club history",
        players: [
          player("Christian Chukwu", "The defensive leader whose authority and captaincy became inseparable from Rangers' celebrated early years."),
          player("Emmanuel Okala", "An imposing goalkeeper whose presence helped underpin Rangers' domestic and continental standing."),
          player("Aloysius Atuegbu", "A powerful, skilful forward whose attacking influence helped Rangers build its reputation as a major force."),
          player("Luke 'Jazz' Okpala", "A prominent player from Rangers' foundational generation, linking the club's early identity to its successful rise."),
          player("Godwin Achebe", "The first Rangers captain, selected here for his foundational playing leadership before his later work as a coach."),
        ],
      },
      {
        id: "shooting-stars", name: "Shooting Stars", city: "Ibadan",
        sourceUrl: "https://shootingstarssportsclub.com/history/", sourceLabel: "Shooting Stars Sports Club · History",
        players: [
          player("Segun Odegbami", "An inventive right-sided attacker whose intelligence and technique helped define Shooting Stars' most celebrated football."),
          player("Felix Owolabi", "A powerful, adaptable attacking presence whose long association made him one of Ibadan's enduring football figures."),
          player("Best Ogedegbe", "A distinguished goalkeeper whose contribution helped anchor Shooting Stars through important domestic and African campaigns."),
          player("Rashidi Yekini", "A formidable finisher whose rise at Shooting Stars remains an important chapter in the club's attacking history."),
          player("Taiwo Ogunjobi", "A commanding defender and captain whose leadership contributed to Shooting Stars' strong domestic and continental standing."),
        ],
      },
      {
        id: "kano-pillars", name: "Kano Pillars", city: "Kano",
        sourceUrl: "https://npfl.com.ng/2023/11/11/npfl-oldest-star-rabiu-ali-not-slowing-down-amid-retirement-plan/", sourceLabel: "NPFL · Kano Pillars historical coverage",
        players: [
          player("Rabiu Ali", "A long-serving creative leader whose scoring, passing and responsibility made him the club's modern reference point."),
          player("Muhammad Gambo", "A long-serving centre-forward whose goals and commitment helped sustain Pillars through a successful domestic period."),
          player("Theophilus Afelokhai", "An accomplished goalkeeper and captain who helped provide defensive continuity during Pillars' title-winning years."),
          player("Ahmed Musa", "An explosive attacking breakthrough and later returns created a distinctive connection between the international forward and Pillars."),
          player("Junior Lokosa", "An outstanding domestic scoring breakthrough earned him a place among the club's memorable modern attacking performers."),
        ],
      },
      {
        id: "bendel-insurance", name: "Bendel Insurance", city: "Benin City",
        sourceUrl: "https://guardian.ng/sport/memories-of-glorious-past-bendel-insurance-light-up-nigerias-football/", sourceLabel: "The Guardian Nigeria · Bendel Insurance history",
        players: [
          player("Peter Egharevba", "A leading defender remembered for his important contribution to Insurance's celebrated Challenge Cup triumph over Rangers."),
          player("Kadiri Ikhana", "A dependable defender in the accomplished Insurance side that challenged the country's established football powers."),
          player("Henry Ogboe", "An important attacking figure in the memorable Insurance generation that brought major honours to Benin City."),
          player("George Omokaro", "A fiercely competitive presence whose contribution helped make Insurance's golden-era team such a difficult opponent."),
          player("Francis Monidafe", "A respected member of Insurance's accomplished 1970s generation, representing the depth behind the club's famous successes."),
        ],
      },
      {
        id: "heartland", name: "Heartland / Iwuanyanwu Nationale", city: "Owerri",
        sourceUrl: "https://npfl-live.com/team/heartland-f-c/", sourceLabel: "NPFL Live · Historical Heartland club profile",
        players: [
          player("Thompson Oliha", "An influential midfielder in Iwuanyanwu's outstanding late-1980s team, contributing to its strong domestic and African campaigns."),
          player("Uche Okechukwu", "A composed central defender whose Iwuanyanwu performances helped underpin the club's successful championship era."),
          player("Nwankwo Kanu", "His skilful teenage breakthrough at Iwuanyanwu forms an important domestic chapter before his celebrated overseas career."),
          player("Mobi Oparaku", "An accomplished defender developed in the Iwuanyanwu team, later maintaining a close association with Owerri football."),
          player("Julius Ubido", "A long-serving midfielder and captain whose sustained contribution gives the modern Heartland era a place alongside Iwuanyanwu's stars."),
        ],
      },
    ],
  },
];

export const globalGoats: GreatPlayer[] = [
  player("Lionel Messi", "A sustained combination of elite scoring, creation and dribbling, with decisive influence for both club and country.", "Argentina", "2000s–2020s"),
  player("Pelé", "An unusually complete forward whose finishing, invention and international impact made him a defining figure of the global game.", "Brazil", "1950s–1970s"),
  player("Cristiano Ronaldo", "Exceptional longevity and scoring across different leagues, supported by outstanding movement, aerial power and relentless competitive drive.", "Portugal", "2000s–2020s"),
  player("Diego Maradona", "A remarkable creative and dribbling peak, with the ability to carry enormous attacking responsibility at club and international level.", "Argentina", "1970s–1990s"),
  player("Johan Cruyff", "A brilliant on-field interpreter of space whose technique and movement helped demonstrate the possibilities of Total Football.", "Netherlands", "1960s–1980s"),
  player("Alfredo Di Stéfano", "A complete attacking organiser who linked midfield and finishing while helping establish Real Madrid's early European supremacy.", "Argentina / Spain", "1940s–1960s"),
  player("Franz Beckenbauer", "An elegant defensive leader whose ball-carrying and distribution expanded the influence a sweeper could have on a match.", "Germany", "1960s–1980s"),
  player("Zinedine Zidane", "Exceptional first touch and midfield control, with a record of technically outstanding interventions on football's biggest stages.", "France", "1980s–2000s"),
  player("Ronaldo Nazário", "At his peak, explosive acceleration and close control made him an extraordinary centre-forward, even before his clinical later adaptation.", "Brazil", "1990s–2010s"),
  player("Ferenc Puskás", "An exceptional left-footed scorer and creator, influential in both Hungary's great national side and Real Madrid's legendary attack.", "Hungary / Spain", "1940s–1960s"),
  player("Michel Platini", "A master of attacking midfield play whose passing, set pieces and scoring delivered influence far beyond traditional positional boundaries.", "France", "1970s–1980s"),
  player("Garrincha", "One-on-one dribbling of extraordinary imagination and effectiveness, with a central role in Brazil's celebrated international success.", "Brazil", "1950s–1970s"),
  player("Eusébio", "Explosive pace and powerful finishing made him the outstanding attacking figure of Benfica and Portugal's landmark 1960s teams.", "Portugal", "1950s–1970s"),
  player("Gerd Müller", "Exceptional movement and instant finishing in crowded penalty areas supplied decisive goals for Bayern and West Germany.", "Germany", "1960s–1980s"),
  player("Paolo Maldini", "Outstanding reading of the game, technical composure and longevity at both full-back and centre-back across Milan's great eras.", "Italy", "1980s–2000s"),
  player("Xavi Hernández", "A midfield conductor whose scanning, passing and positional judgment helped Barcelona and Spain exercise exceptional control of matches.", "Spain", "1990s–2010s"),
  player("Andrés Iniesta", "Brilliant close control and awareness in confined spaces, allied to the composure to decide major club and international matches.", "Spain", "2000s–2020s"),
  player("Ronaldinho", "An extraordinary creative peak built on improvisation, passing and dribbling, making difficult actions feel spontaneous and joyful.", "Brazil", "1990s–2010s"),
  player("Lev Yashin", "An influential goalkeeper whose anticipation, command and proactive style helped broaden the position's standing in the game.", "Soviet Union", "1950s–1970s"),
  player("Thierry Henry", "Combined elite scoring with pace, technical invention and chance creation, adapting successfully across different teams and attacking roles.", "France", "1990s–2010s"),
];

export const greatnessMethod = {
  criteria: [
    "Peak playing ability within the relevant club, league or global context",
    "Sustained contribution, longevity and consistency",
    "Influence on important matches and successful teams",
    "Creative, defensive and goalkeeping influence alongside goalscoring",
    "Historical context, role and the strength of the available record",
  ],
  note: "Subjective TerraScope editorial rankings of men's football. Sources verify careers, associations and historical context; the ordering is TerraScope's judgment. Club lists assess the player's service to that club. League lists assess work in that domestic championship. The global list considers the whole playing career. Coaching achievements are excluded. Six clubs per country form an opening selection; these are not exhaustive lists of major clubs. Nigerian historical records are less complete, so the archive avoids invented totals and precision scores.",
  reviewedAt: "2026-10-17" as const,
  sources: [
    { label: "Premier League · Hall of Fame", url: "https://www.premierleague.com/en/events/hall-of-fame/inductees" },
    { label: "Manchester United · 1960s history", url: "https://www.manutd.com/en/club/history/history-by-decade/1960-1969" },
    { label: "Manchester United · 1990s history", url: "https://www.manutd.com/en/club/history/history-by-decade/1990-1999" },
    { label: "Liverpool FC · Player history", url: "https://www.liverpoolfc.com/info/past-players" },
    { label: "Arsenal · The Wenger years", url: "https://www.arsenal.com/feature/the-wenger-years-a05Ex7F5N6vd" },
    { label: "Chelsea FC · Historical goalscorers", url: "https://www.chelseafc.com/en/news/article/chelsea-fcs-all-time-record-goalscorers" },
    { label: "Manchester City · Club legends", url: "https://www.mancity.com/mancitylegends" },
    { label: "Tottenham Hotspur · Hall of Fame", url: "https://www.tottenhamhotspur.com/the-club/history/hall-of-fame/" },
    { label: "Ligue 1 · Historical scoring honours", url: "https://ligue1.com/fr/articles/l1_article_80-historique-et-records-du-classement-des-buteurs-l1" },
    { label: "Ligue 1 · Historical league-winning players", url: "https://ligue1.com/en/articles/l1_article_92-" },
    { label: "Paris Saint-Germain · Scoring legends", url: "https://en.psg.fr/teams/first-team/content/kylian-mbappe-a-legend-among-paris-saint-germain-goalscorers-paris-saint-germain-psg-nantes-ligue-1-22-23" },
    { label: "Marseille · The Tapie era", url: "https://www.om.fr/en/1986-1993-the-bernard-tapie-era" },
    { label: "Olympique Lyonnais · Juninho and club history", url: "https://www.ol.fr/en/news/inoubliable-juninho-23123-2" },
    { label: "Olympique Lyonnais · The 2001/02 championship squad", url: "https://www.ol.fr/fr/actualites/ol70ans-un-jour-une-saison-2001-02-1" },
    { label: "AS Saint-Étienne · Historical anniversary archive", url: "https://www.asse.fr/cinquantenaire/" },
    { label: "AS Monaco · Emblematic players", url: "https://www.asmonaco.com/fr/club/histoire/100-ans/les-joueurs-emblematiques" },
    { label: "AS Monaco · Claude Puel's playing career", url: "https://www.asmonaco.com/fr/news/claude-puel-une-vie-sur-le-rocher" },
    { label: "FC Nantes · Tribune des Légendes", url: "https://www.fcnantes.com/magazine/2425/85Magazine241124.pdf" },
    { label: "Bundesliga · Historical archive", url: "https://www.bundesliga.com/en/history" },
    { label: "FC Bayern · Hall of Fame", url: "https://fcbayern.com/en/club/hall-of-fame" },
    { label: "FC Bayern · Franz Beckenbauer", url: "https://fcbayern.com/en/club/hall-of-fame/franz-beckenbauer" },
    { label: "FC Bayern · Lothar Matthäus", url: "https://fcbayern.com/en/club/hall-of-fame/lothar-matthaus" },
    { label: "Schalke 04 · Club legends", url: "https://schalke04.de/verein/tradition/schalke-legenden/" },
    { label: "Hamburger SV · Club history", url: "https://www.hsv.de/unser-hsv/historie/die-geschichte-des-hsv" },
    { label: "Bundesliga · Bremen's 2003/04 double winners", url: "https://www.bundesliga.com/en/bundesliga/news/iconic-bundesliga-teams-werder-bremen-s-double-2003-04-double-winners-24945" },
    { label: "LALIGA · El Clásico history", url: "https://www.laliga.com/en-ES/partidazos/el-clasico" },
    { label: "Real Madrid · Di Stéfano", url: "https://www.realmadrid.com/en-US/the-club/history/football-legends/alfredo-di-stefano-laulhe" },
    { label: "Real Madrid · Cristiano Ronaldo", url: "https://www.realmadrid.com/en-US/the-club/history/football-legends/cristiano-ronaldo-dos-santos-aveiro" },
    { label: "FC Barcelona · Legendary players", url: "https://www.fcbarcelona.com/en/club/history/legendary-players" },
    { label: "FC Barcelona · From Cruyff to Xavi", url: "https://www.fcbarcelona.com/en/news/2982642/from-cruyff-to-xavi-half-a-century-of-an-iconic-style" },
    { label: "Atlético de Madrid · Koke and Adelardo", url: "https://en.atleticodemadrid.com/noticias/koke-equals-adelardo-as-the-player-with-most-games-in-our-history" },
    { label: "Atlético de Madrid · Fernando Torres", url: "https://www.atleticodemadrid.com/noticias/fernando-torres-una-carrera-de-leyenda" },
    { label: "LALIGA · Athletic Club historical players", url: "https://www.laliga.com/noticias/jugadores-historicos-del-athletic-club" },
    { label: "Valencia CF · Club history", url: "https://www.valenciacf.com/nuestra-historia" },
    { label: "Sevilla FC · Historical club emblems", url: "https://sevillafc.es/actualidad/noticias/dos-lonas-en-preferencia-para-rendir-tributo-emblemas-cantera-y-futbol-femenino" },
    { label: "Enyimba FC · Legends archive", url: "https://enyimbafc.net/10-interesting-things-to-know-about-enyimba-fc/" },
    { label: "Enyimba FC · Historic Champions League team", url: "https://enyimbafc.net/20-years-after-ikhana-reflects-on-historic-champions-league-triumph/" },
    { label: "Rangers International · Club history", url: "https://www.rangersintl.com/history" },
    { label: "Shooting Stars · Club history", url: "https://shootingstarssportsclub.com/history/" },
    { label: "NPFL · Emmanuel Okala and the early domestic game", url: "https://npfl.com.ng/2024/05/17/elegbeleye-salutes-legendary-goalkeeper-okala-at-73/" },
    { label: "NPFL · Rabiu Ali profile", url: "https://npfl.com.ng/2023/11/11/npfl-oldest-star-rabiu-ali-not-slowing-down-amid-retirement-plan/" },
    { label: "NPFL · Ahmed Musa and Kano Pillars", url: "https://npfl.com.ng/2025/07/08/ahmed-musa-resumes-as-kano-pillars-gm-assures-success/" },
    { label: "CAF · Junior Lokosa's move from Kano Pillars", url: "https://www.cafonline.com/caf-champions-league/news/caf-cl-fireworks-in-tunis-as-esperance-host-mazembe/" },
    { label: "OFC · Nigeria's 2013 squad and Muhammad Gambo", url: "https://www.oceaniafootball.com/archives-11849/" },
    { label: "ACLSports · Theophilus Afelokhai's domestic career", url: "https://www.aclsports.com/npfl-theophilus-afelokhai-begins-coaching-journey-at-ranchers-bees/" },
    { label: "NFF · Bendel Insurance and Rangers cup history", url: "https://thenff.com/federation-cup-stephen-keshi-stadium-asaba-to-stage-grand-finale-on-thursdayim/" },
    { label: "The Guardian Nigeria · Insurance's celebrated 1970s side", url: "https://guardian.ng/sport/memories-of-glorious-past-bendel-insurance-light-up-nigerias-football/" },
    { label: "The Guardian Nigeria · Shooting Stars' 1976 players", url: "https://guardian.ng/sport/where-are-they-now-the-history-making-1976-shooting-stars-squad/" },
    { label: "National Football Teams · Haruna Ilerika's club history", url: "https://www.national-football-teams.com/player/58341/Haruna_Ilerika.html" },
    { label: "NPFL Live · Heartland historical profile", url: "https://npfl-live.com/team/heartland-f-c/" },
    { label: "The Nation · Thompson Oliha and Iwuanyanwu", url: "https://thenationonlineng.net/heartland-plan-big-for-oliha/" },
    { label: "The Guardian Nigeria · Uche Okechukwu's club history", url: "https://guardian.ng/sport/uche-okechukwu-ifejiagwa-launch-football-academy/" },
    { label: "The Nation · Mobi Oparaku's playing career", url: "https://thenationonlineng.net/mobi-oparuka-from-college-soccer-to-olympic-glory/" },
    { label: "The Sun Nigeria · Julius Ubido's Heartland service", url: "https://thesun.ng/heartlands-barrack-why-i-have-remained-a-naze-millionaire-ubido/" },
    { label: "National Football Teams · Julius Ubido's club history", url: "https://national-football-teams.com/player/41935/Julius_Ubido.html" },
    { label: "FIFA · Pelé's World Cup legacy", url: "https://www.fifa.com/en/tournaments/mens/worldcup/articles/pele-three-world-cup-titles-only-player" },
    { label: "FIFA · Johan Cruyff", url: "https://www.fifa.com/en/archive/johan-cruyff" },
    { label: "FIFA · Garrincha in 1962", url: "https://www.fifa.com/en/articles/89-days-to-go-qatar-2022-garrincha-brazil-chile-1962-fifa-world-cup" },
    { label: "FIFA · Yashin and Eusébio", url: "https://inside.fifa.com/tournaments/mens/worldcup/1966england/news/the-spider-against-the-panther-2790523" },
    { label: "FIFA · Zidane's 2006 quarter-final", url: "https://inside.fifa.com/tournaments/mens/worldcup/2006germany/news/zidane-hits-heights-oust-brazil-world-cup-2006-3069576" },
    { label: "FIFA · Cafu on Ronaldo and Ronaldinho", url: "https://inside.fifa.com/tournaments/mens/worldcup/2002korea-japan/news/cafu-ronaldinho-was-almost-unmarkable-brazil-world-cup" },
  ],
};
