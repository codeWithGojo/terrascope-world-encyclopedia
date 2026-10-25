import {SportsFrame} from "../ToolsShared";
import {FavouritesList,type FavouriteEntry} from "../FavouritesList";
import {athletes,sportsPhoto} from "../data";
import {sportsTeams} from "../catalog";
import {esportsEntries} from "../esports-data";
import {pageMetadata} from "../../seo";
export const metadata=pageMetadata("/sports/favourites","Your sports favourites | TerraScope","Keep favourite athletes, teams and CODM profiles together on this device.");
export default function FavouritesPage(){const catalog:FavouriteEntry[]=[...athletes.map(p=>({id:`athlete:${p.id}`,name:p.name,kind:`${p.sport} athlete`,detail:p.nation,href:`/sports/${p.sport}?athlete=${p.id}`,image:sportsPhoto(p.id)?.src})),...sportsTeams.map(t=>({id:`team:${t.id}`,name:t.name,kind:t.kind,detail:t.location,href:`/sports/teams/${t.id}`,image:t.badge})),...esportsEntries.map(e=>({id:`esports-${e.kind}:${e.id}`,name:e.name,kind:`CODM ${e.kind}`,detail:e.region,href:`/sports/esports#${e.id}`}))];return <SportsFrame path="/sports/favourites" title="Your sporting world." intro="The athletes, clubs, national teams and esports profiles you want to come back to."><FavouritesList catalog={catalog}/></SportsFrame>;}
