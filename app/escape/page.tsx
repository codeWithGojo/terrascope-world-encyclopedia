import type {Metadata} from "next";
import {SiteHeader} from "../components/SiteHeader";
import {SiteFooter} from "../components/SiteFooter";
import EscapeExplorer from "./EscapeExplorer";
export const metadata:Metadata={title:"Free virtual escapes | TerraScope",description:"Take a free 360° escape or a guided photo journey. Discover real places, save favourites and explore at your own pace."};
export default async function EscapePage({searchParams}:{searchParams:Promise<{scene?:string}>}){const params=await searchParams;return <main className="escape-page"><SiteHeader active="escape"/><EscapeExplorer initialId={params.scene}/><SiteFooter/></main>;}
