import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./phase2.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = { title: "TerraScope World Encyclopedia", description: "A beautifully organised living atlas of countries, people, cultures and world statistics.", other: { "codex-preview": "development" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={geist.variable}>{children}</body></html>; }
