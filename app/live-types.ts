export type Forecast={temperature:number;condition:number;observedAt:string;days:{date:string;min:number;max:number;condition:number}[]};
export type ExchangeRate={rate:number;date:string;base:string;quote:string};
export function weatherLabel(code:number){if(!Number.isFinite(code)||code<0)return 'Conditions unavailable';if(code===0)return 'Clear sky';if(code<=3)return 'Partly cloudy';if(code<=48)return 'Fog';if(code<=57)return 'Drizzle';if(code<=67)return 'Rain';if(code<=77)return 'Snow';if(code<=82)return 'Rain showers';if(code<=86)return 'Snow showers';return 'Thunderstorms';}
