import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./experience.css";
import {SiteMotion} from "./components/SiteMotion";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = { title: "TerraScope · Explore a little further", description: "Free virtual escapes, country histories, remarkable places and football greats. Explore the world with TerraScope." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={geist.variable}><a className="skip-link" href="#main-content">Skip to content</a><div id="main-content">{children}</div><SiteMotion/></body></html>; }
