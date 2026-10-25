import {SportsFrame} from "../ToolsShared";
import {TeamDirectory} from "../TeamDirectory";
import {sportsTeams} from "../catalog";
import {pageMetadata} from "../../seo";
export const metadata=pageMetadata("/sports/teams","Teams & clubs | TerraScope","Explore football clubs, basketball teams, cricket nations and team tennis histories.");
export default function TeamsPage(){return <SportsFrame path="/sports/teams" title="Teams with a story." intro="Sixteen starting points across four sports. Meet the teams, then follow the players and places behind them."><TeamDirectory teams={sportsTeams}/></SportsFrame>;}
