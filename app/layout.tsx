import type { Metadata, Viewport } from "next";
import { Domine, Nunito_Sans } from "next/font/google";
import "./globals.css";

const domine = Domine({ subsets: ["latin"], variable: "--font-domine", display: "swap" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = {
  title: "Ekagra — Every student diagnosed. Every hour targeted.",
  description:
    "AI-enabled home tuition for JEE & NEET. A 15-minute diagnostic pinpoints exactly what to teach next in Physics, Chemistry, Maths and Biology.",
};

export const viewport: Viewport = {
  themeColor: "#16233F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${domine.variable} ${nunito.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
