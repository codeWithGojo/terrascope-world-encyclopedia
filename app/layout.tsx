import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./experience.css";
import "./premium.css";
import "./country-features.css";
import "./engagement.css";
import "./motion.css";
import {ThemeProvider} from "./components/ThemeProvider";
import {MotionProvider} from "./components/motion/MotionProvider";
import {themeBootScript} from "./theme";
import {SiteMotion} from "./components/SiteMotion";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = { title: "TerraScope · Explore a little further", description: "Free virtual escapes, country histories, remarkable places and football greats. Explore the world with TerraScope." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeBootScript}}/></head><body className={geist.variable}><ThemeProvider><MotionProvider><a className="skip-link" href="#main-content">Skip to content</a><div id="main-content">{children}</div><SiteMotion/></MotionProvider></ThemeProvider></body></html>; }
