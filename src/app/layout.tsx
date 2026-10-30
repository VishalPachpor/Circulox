import { DM_Sans, Newsreader } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/base.css";
import { siteUrl, indexable } from "@/lib/site";
const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});
const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Circulox | International legal & business advisory",
    template: "%s | Circulox",
  },
  description:
    "Company formation, regulatory advice and ongoing legal support for startups, fintech, Web3 and established businesses.",
  robots: { index: indexable, follow: indexable },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
