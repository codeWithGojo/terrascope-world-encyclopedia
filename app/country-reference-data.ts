import rawReferenceData from "./country-reference-data.json";
export type CountryReferenceProfile={background:string;governmentType:string;chiefOfState:string;headOfGovernment:string;executiveSelection:string;independence:string;constitution:string;nationalHoliday:string;climate:string;terrain:string;hazards:string;populationDistribution:string;geographyNote:string};
export type CountryReferenceDataset={edition:string;asOf:string;source:{label:string;url:string};records:Record<string,CountryReferenceProfile>};
export const countryReferenceData=rawReferenceData as CountryReferenceDataset;
export const countryReferenceByCode=countryReferenceData.records;
