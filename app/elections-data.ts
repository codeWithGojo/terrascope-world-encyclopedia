/**
 * Editorial election register, reviewed on 17 October 2026.
 *
 * A `date` is a published national polling date, never an estimate based on a
 * term length. `timezone` is the reference zone for displaying the calendar day;
 * it does not imply a uniform polling-opening time across a country.
 * Re-check the linked authority before extending this register or after a poll.
 */
export type ElectionInfo = {
  countryCode: string;
  name: string;
  date?: string;
  expectedWindow?: string;
  status: 'confirmed' | 'expected' | 'not-announced';
  timezone: string;
  sourceLabel: string;
  sourceUrl: string;
  checkedAt: '2026-10-17';
  note: string;
};

export const electionRegister: ElectionInfo[] = [
  {
    countryCode: 'NG',
    name: 'Presidential & National Assembly elections',
    date: '2027-01-16',
    status: 'confirmed',
    timezone: 'Africa/Lagos',
    sourceLabel: 'INEC · official election calendar',
    sourceUrl: 'https://www.inecnigeria.org/elections/calendar',
    checkedAt: '2026-10-17',
    note: 'INEC lists 16 January 2027 for the nationwide presidential and National Assembly elections. Governorship and state assembly polls are listed separately for 6 February.',
  },
  {
    countryCode: 'US',
    name: 'Congressional midterm elections',
    date: '2026-11-03',
    status: 'confirmed',
    timezone: 'America/New_York',
    sourceLabel: 'Federal Election Commission · 2026 election dates',
    sourceUrl: 'https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/2026-reporting-dates/electioneering-communications-periods-general-election-2026/',
    checkedAt: '2026-10-17',
    note: 'The next nationwide federal election is the 3 November congressional midterm, not a presidential election. Polling hours and time zones vary by state.',
  },
  {
    countryCode: 'BR',
    name: 'Presidential election · second round',
    date: '2026-10-25',
    status: 'confirmed',
    timezone: 'America/Sao_Paulo',
    sourceLabel: 'Brazilian Electoral Justice · TRE-RS',
    sourceUrl: 'https://www.tre-rs.jus.br/comunicacao/noticias/2026/Outubro/eleitor-que-nao-votou-no-1o-turno-pode-votar-no-2o-turno',
    checkedAt: '2026-10-17',
    note: 'The first round has already taken place. Electoral Justice confirms the presidential second round on 25 October, with voting from 08:00 to 17:00 Brasília time.',
  },
  {
    countryCode: 'FR',
    name: 'Presidential election · first round',
    date: '2027-04-18',
    status: 'confirmed',
    timezone: 'Europe/Paris',
    sourceLabel: 'Service Public · French government election calendar',
    sourceUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F1939',
    checkedAt: '2026-10-17',
    note: 'The official calendar lists 18 April for the first round and 2 May 2027 for the second round. Some overseas electorates vote the preceding Saturday because of time-zone differences.',
  },
  {
    countryCode: 'DE',
    name: 'Bundestag election',
    expectedWindow: 'Spring 2029 · exact day not announced',
    status: 'expected',
    timezone: 'Europe/Berlin',
    sourceLabel: 'Federal Returning Officer · future elections',
    sourceUrl: 'https://www.bundeswahlleiterin.de/en/service/wahltermine.html',
    checkedAt: '2026-10-17',
    note: 'The federal election authority lists spring 2029 for the next regular Bundestag election without an exact polling date. This is an official expected window, not a countdown target; an early election remains possible.',
  },
  {
    countryCode: 'ES',
    name: 'General election · Congress & Senate',
    date: '2026-11-29',
    status: 'confirmed',
    timezone: 'Europe/Madrid',
    sourceLabel: 'INE · Electoral Census Office',
    sourceUrl: 'https://www.ine.es/dyngs/CEL/en/index.htm?cid=1699',
    checkedAt: '2026-10-17',
    note: 'The Electoral Census Office confirms 29 November 2026 under Royal Decree 806/2026, published on 6 October. This replaces the previous expectation of a 2027 general election.',
  },
  {
    countryCode: 'GB',
    name: 'UK general election',
    expectedWindow: 'By 15 August 2029 · exact day not announced',
    status: 'expected',
    timezone: 'Europe/London',
    sourceLabel: 'House of Commons Library · election timetable',
    sourceUrl: 'https://commonslibrary.parliament.uk/research-briefings/cbp-10971/',
    checkedAt: '2026-10-17',
    note: 'The Commons Library identifies 15 August 2029 as the last possible polling day under the current timetable. It is a legal latest date, not a scheduled election; the government may call an earlier vote.',
  },
  {
    countryCode: 'KE',
    name: 'General election',
    date: '2027-08-10',
    status: 'confirmed',
    timezone: 'Africa/Nairobi',
    sourceLabel: 'IEBC · critical timelines for the 2027 general election',
    sourceUrl: 'https://www.iebc.or.ke/news/?Critical_Timelines_for_the_2027GE=',
    checkedAt: '2026-10-17',
    note: 'IEBC explicitly identifies Tuesday, 10 August 2027 as general-election polling day. Follow the commission for registration deadlines and constituency-specific voting information.',
  },
  {
    countryCode: 'NZ',
    name: 'General election',
    date: '2026-11-07',
    status: 'confirmed',
    timezone: 'Pacific/Auckland',
    sourceLabel: 'New Zealand Electoral Commission · key dates',
    sourceUrl: 'https://vote.nz/2026-general-election/about/overview/key-dates',
    checkedAt: '2026-10-17',
    note: 'Election day is Saturday, 7 November 2026. Overseas voting begins on 21 October and advance voting in New Zealand begins on 26 October.',
  },
  {
    countryCode: 'GM',
    name: 'Presidential election',
    date: '2026-12-05',
    status: 'confirmed',
    timezone: 'Africa/Banjul',
    sourceLabel: 'The Gambia · Independent Electoral Commission',
    sourceUrl: 'https://iec.gm/',
    checkedAt: '2026-10-17',
    note: 'The Independent Electoral Commission publishes 5 December 2026 as presidential election day. National Assembly and local elections follow separate schedules.',
  },
  {
    countryCode: 'IL',
    name: '26th Knesset election',
    date: '2026-10-27',
    status: 'confirmed',
    timezone: 'Asia/Jerusalem',
    sourceLabel: 'Israel · Ministry of Foreign Affairs election notice',
    sourceUrl: 'https://embassies.gov.il/sanfrancisco/he/announcements/vote10-2026',
    checkedAt: '2026-10-17',
    note: 'The official consular election notice identifies Tuesday, 27 October 2026 for the election to the 26th Knesset and links to government voter information.',
  },
];

/** ISO 3166-1 alpha-2 lookup. Unlisted countries intentionally return undefined. */
export function getElection(code: string): ElectionInfo | undefined {
  const normalized = code.trim().toUpperCase();
  return electionRegister.find((election) => election.countryCode === normalized);
}
