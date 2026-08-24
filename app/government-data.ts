import rawGovernmentData from "./government-data.json";

export type SourceRef = {label:string;url:string};
export type SourcedPoint = {text:string;source:SourceRef};
export type ElectionRecord = {label:string;note:string;source:SourceRef};
export type SuccessionEntry = {name:string;office:string;term:string;note:string};
export type TimelineEvent = {date:string;label:string;title:string;text:string};

export type LeaderProfile = {
  name:string;
  role:string;
  startDate:string;
  term:string;
  bio:string;
  nextElection:ElectionRecord;
  record:SourcedPoint[];
  scrutiny:SourcedPoint[];
  sources:SourceRef[];
};

export type GovernmentProfile = {
  system:string;
  timelineSource:SourceRef;
  leader:LeaderProfile;
  succession:SuccessionEntry[];
  timeline:TimelineEvent[];
};

export type RegionalLeader = {
  name:string;
  office:string;
  leader:string;
  startDate:string;
  bio:string;
  profileUrl:string;
};

export type RegionalGovernment = {
  title:string;
  unitLabel:string;
  leaderLabel:string;
  note:string;
  source:SourceRef;
  units:RegionalLeader[];
};

export type GovernmentDataset = {
  asOf:string;
  profiles:Record<string,GovernmentProfile>;
  regional:Record<string,RegionalGovernment>;
};

export const governmentData = rawGovernmentData as GovernmentDataset;
export const governmentByCode = governmentData.profiles;
export const regionalGovernmentByCode = governmentData.regional;

export const governmentAsOfLabel = new Intl.DateTimeFormat("en-GB", {
  day:"numeric",
  month:"long",
  year:"numeric",
  timeZone:"UTC",
}).format(new Date(`${governmentData.asOf}T00:00:00Z`));

export function tenureLabel(startDate:string) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${governmentData.asOf}T00:00:00Z`);
  let months = (end.getUTCFullYear()-start.getUTCFullYear())*12 + end.getUTCMonth()-start.getUTCMonth();
  if (end.getUTCDate()<start.getUTCDate()) months-=1;
  const years = Math.floor(months/12);
  const remainder = months%12;
  if(years&&remainder)return `${years} ${years===1?"year":"years"}, ${remainder} ${remainder===1?"month":"months"}`;
  if(years)return `${years} ${years===1?"year":"years"}`;
  return `${Math.max(0,remainder)} ${remainder===1?"month":"months"}`;
}

export const datedTimelineEvents = Object.entries(governmentByCode).flatMap(([countryCode,profile]) =>
  profile.timeline.map((event)=>({...event,countryCode}))
);
