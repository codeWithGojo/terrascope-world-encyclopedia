import type {Metadata} from 'next';
import {SiteHeader} from '../components/SiteHeader';
import {SiteFooter} from '../components/SiteFooter';
import {TravelMap} from './TravelMap';
import './travels.css';
export const metadata:Metadata={title:'My travels | TerraScope',description:'Your own world map. Mark the countries you have visited, see your progress and share your travels.'};
export default function MyTravelsPage(){
 return <main className="travel-page"><SiteHeader active="my-travels"/><TravelMap/><SiteFooter/></main>;
}
