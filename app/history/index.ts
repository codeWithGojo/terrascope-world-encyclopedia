import nigeria from './nigeria.json';
export type HistoryCategory='politics'|'war'|'independence'|'economy'|'culture';
export type HistoryEvent={year:number;endYear?:number;date:string;title:string;summary:string;category:HistoryCategory;sourceLabel:string;sourceUrl:string};
export type CountryHistory={country:string;title:string;checkedAt:string;note:string;events:HistoryEvent[]};
export const historyByCode:Record<string,CountryHistory>={NG:nigeria as CountryHistory};
