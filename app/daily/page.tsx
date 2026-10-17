import type {Metadata} from 'next';
import {SiteHeader} from '../components/SiteHeader';
import {SiteFooter} from '../components/SiteFooter';
import {DailyGame} from './DailyGame';
export const metadata:Metadata={title:'Guess the Country · Daily geography game | TerraScope',description:'One country. Six guesses. A new geography challenge every UTC day, plus free practice rounds.'};
export default function DailyPage(){return <main><SiteHeader active="daily"/><section className="index-hero"><p className="eyebrow"><span/>A small daily discovery</p><h1>Know this<br/>corner of the world?</h1><p>One outline. Six guesses. Follow the distance and direction from each guess to the answer.</p></section><DailyGame/><SiteFooter/></main>;}
