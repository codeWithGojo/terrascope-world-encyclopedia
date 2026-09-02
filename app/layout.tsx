import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./phase2.css";
import "./launch.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase:new URL("https://terrascope-world-encyclopedia.vercel.app"),
  title:{default:"TerraScope World Encyclopedia",template:"%s · TerraScope"},
  description:"Explore 195 countries through sourced facts, government, history, travel planning, football and world rankings.",
  alternates:{canonical:"/"},
  openGraph:{type:"website",siteName:"TerraScope",title:"TerraScope World Encyclopedia",description:"A sourced living atlas of all 195 countries.",url:"/"},
  twitter:{card:"summary_large_image",title:"TerraScope World Encyclopedia",description:"A sourced living atlas of all 195 countries."},
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={geist.variable}>{children}</body></html>; }
