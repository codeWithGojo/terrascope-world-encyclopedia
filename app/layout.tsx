import {siteOrigin} from "./seo";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./experience.css";
import "./premium.css";
import "./country-features.css";
import "./engagement.css";
import "./motion.css";
import "./travel-guide.css";
import "./glass.css";
import {ThemeProvider} from "./components/ThemeProvider";
import {MotionProvider} from "./components/motion/MotionProvider";
import {themeBootScript} from "./theme";
import {SiteMotion} from "./components/SiteMotion";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "TerraScope · Explore a little further",
  description: "Free virtual escapes, country histories, remarkable places and football greats. Explore the world with TerraScope.",
  icons: {
    icon: [
      {url:"/favicon.ico?v=ts-logo-20261019",sizes:"any"},
      {url:"/icons/favicon-16.png?v=ts-logo-20261019",type:"image/png",sizes:"16x16"},
      {url:"/icons/favicon-32.png?v=ts-logo-20261019",type:"image/png",sizes:"32x32"},
      {url:"/icons/icon-192.png?v=ts-logo-20261019",type:"image/png",sizes:"192x192"},
      {url:"/icons/icon-512.png?v=ts-logo-20261019",type:"image/png",sizes:"512x512"},
    ],
    shortcut:"/favicon.ico?v=ts-logo-20261019",
    apple:[{url:"/icons/apple-touch-icon.png?v=ts-logo-20261019",type:"image/png",sizes:"180x180"}],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeBootScript}}/></head><body className={geist.variable}><ThemeProvider><MotionProvider><a className="skip-link" href="#main-content">Skip to content</a><div id="main-content">{children}</div><SiteMotion/></MotionProvider></ThemeProvider></body></html>; }
