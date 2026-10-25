import {SportsFrame} from "../ToolsShared";
import {ScoresBoard} from "../ScoresBoard";
import {pageMetadata} from "../../seo";
export const metadata=pageMetadata("/sports/scores","Fixtures & scores | TerraScope","Football, basketball, cricket and tennis match scores, fixtures and results.");
export default function ScoresPage(){return <SportsFrame path="/sports/scores" title="Fixtures & scores." intro="Choose a competition, follow a match and see what is coming next."><ScoresBoard/></SportsFrame>;}
