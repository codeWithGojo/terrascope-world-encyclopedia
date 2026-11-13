import {siteOrigin} from "./seo";
import Script from "next/script";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./experience.css";
import "./premium.css";
import "./country-features.css";
import "./engagement.css";
import "./motion.css";
import "../shared/motion/styles.css";
import {PageTransition} from "./components/motion/PageTransition";
import "./travel-guide.css";
import "./glass.css";
import "./travel-tools.css";
import "./editorial.css";
import "./discovery-polish.css";
import {ThemeProvider} from "./components/ThemeProvider";
import {MotionProvider} from "./components/motion/MotionProvider";
import {themeBootScript} from "./theme";
import {SiteMotion} from "./components/SiteMotion";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = {
  manifest:"/manifest.webmanifest",
  appleWebApp:{capable:true,title:"TerraScope",statusBarStyle:"default"},
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
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><head><link rel="stylesheet" href="/install-app.css"/><script dangerouslySetInnerHTML={{__html:themeBootScript}}/></head><body className={geist.variable}><ThemeProvider><MotionProvider><a className="skip-link" href="#main-content">Skip to content</a><div id="main-content"><PageTransition>{children}</PageTransition></div><SiteMotion/></MotionProvider></ThemeProvider><Script src="/install-app.js" strategy="afterInteractive"/>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 80 100"
        style={{
          position: "fixed",
          insetInlineEnd: "max(4px, env(safe-area-inset-right))",
          insetBlockEnd: "max(0px, env(safe-area-inset-bottom))",
          width: "clamp(42px, 7vw, 68px)",
          height: "auto",
          zIndex: 2,
          pointerEvents: "none",
          stroke: "none",
          filter: "drop-shadow(0 2px 4px #210d1370)",
        }}
      >
        <path fill="#88543d" d="M35 81h10v17H35z" />
        <path fill="#214d3b" d="M40 27 8 87q32 10 64 0L40 27Z" />
        <path fill="#30674e" d="M40 18 14 68q26 9 52 0L40 18Z" />
        <path fill="#428167" d="M40 13 22 48q18 7 36 0L40 13Z" />
        <path fill="none" stroke="#f6d695" strokeWidth="2" strokeLinecap="round" d="M30 43q8 5 18 2M24 63q15 8 32 3M17 83q21 9 46 2" />
        <g fill="#f4a7ae">
          <circle cx="34" cy="54" r="2.8" /><circle cx="53" cy="59" r="2.8" />
          <circle cx="26" cy="75" r="2.8" /><circle cx="48" cy="79" r="2.8" />
        </g>
        <path fill="#f8d486" d="m40 1 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" />
      </svg>
</body></html>; }
