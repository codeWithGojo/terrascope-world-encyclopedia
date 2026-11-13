/**
 * Editorial election register. Each entry records its own review date.
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
  checkedAt: string;
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
    checkedAt: '2026-11-13',
    note: 'INEC lists 16 January 2027 for the nationwide presidential and National Assembly elections. Governorship and state assembly polls are scheduled separately for 6 February.',
  },
  {
    countryCode: 'US',
    name: 'Congressional midterm elections',
    date: '2026-11-03',
    status: 'confirmed',
    timezone: 'America/New_York',
    sourceLabel: 'Federal Election Commission · election information',
    sourceUrl: 'https://www.fec.gov/introduction-campaign-finance/election-results-and-voting-information/',
    checkedAt: '2026-11-13',
    note: 'The federal congressional midterm took place on 3 November 2026. See the FEC for official federal results and state election offices.',
  },
  {
    countryCode: 'BR',
    name: 'Presidential election · second round',
    date: '2026-10-25',
    status: 'confirmed',
    timezone: 'America/Sao_Paulo',
    sourceLabel: 'Brazilian Superior Electoral Court · runoff results',
    sourceUrl: 'https://www.tse.jus.br/comunicacao/noticias/2026/Outubro/presidente-do-tse-anuncia-reeleicao-de-lula-e-faz-balanco-do-2o-turno-das-eleicoes-2026',
    checkedAt: '2026-11-13',
    note: 'The Superior Electoral Court announced Luiz Inácio Lula da Silva’s reelection after the 25 October runoff.',
  },
  {
    countryCode: 'FR',
    name: 'Presidential election · first round',
    date: '2027-04-18',
    status: 'confirmed',
    timezone: 'Europe/Paris',
    sourceLabel: 'Service Public · French government election calendar',
    sourceUrl: 'https://www.service-public.gouv.fr/particuliers/actualites/A15053',
    checkedAt: '2026-11-13',
    note: 'The French government lists 18 April for the first round and 2 May 2027 for the second round. Some overseas electorates vote the preceding Saturday.',
  },
  {
    countryCode: 'DE',
    name: 'Bundestag election',
    expectedWindow: 'Spring 2029 · exact day not announced',
    status: 'expected',
    timezone: 'Europe/Berlin',
    sourceLabel: 'Federal Returning Officer · future elections',
    sourceUrl: 'https://www.bundeswahlleiterin.de/en/service/wahltermine.html',
    checkedAt: '2026-11-13',
    note: 'The federal election authority lists spring 2029 for the next regular Bundestag election. The exact date is pending.',
  },
  {
    countryCode: 'ES',
    name: 'General election · Congress & Senate',
    date: '2026-11-29',
    status: 'confirmed',
    timezone: 'Europe/Madrid',
    sourceLabel: 'INE · Electoral Census Office',
    sourceUrl: 'https://www.ine.es/dyngs/CEL/en/index.htm?cid=1699',
    checkedAt: '2026-11-13',
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
    checkedAt: '2026-11-13',
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
    sourceLabel: 'New Zealand Electoral Commission · election results',
    sourceUrl: 'https://www.electionresults.govt.nz/',
    checkedAt: '2026-11-13',
    note: 'The election took place on 7 November. Preliminary results are available, with the official count expected on 27 November 2026.',
  },
  {
    countryCode: 'GM',
    name: 'Presidential election',
    date: '2026-12-05',
    status: 'confirmed',
    timezone: 'Africa/Banjul',
    sourceLabel: 'The Gambia · Independent Electoral Commission',
    sourceUrl: 'https://iec.gm/electoral-calendar-2026-2027/',
    checkedAt: '2026-11-13',
    note: 'The commission lists 5 December 2026 as presidential election day. National Assembly and local elections follow separate schedules.',
  },
  {
    countryCode: 'IL',
    name: '26th Knesset election',
    date: '2026-10-27',
    status: 'confirmed',
    timezone: 'Asia/Jerusalem',
    sourceLabel: 'The Knesset · official election results',
    sourceUrl: 'https://m.knesset.gov.il/EN/mk/Pages/ElectionsResults26.aspx',
    checkedAt: '2026-11-13',
    note: 'The Knesset published final results for the 27 October election.',
  },
];

/** ISO 3166-1 alpha-2 lookup. Unlisted countries intentionally return undefined. */
export function getElection(code: string): ElectionInfo | undefined {
  const normalized = code.trim().toUpperCase();
  return electionRegister.find((election) => election.countryCode === normalized);
}
