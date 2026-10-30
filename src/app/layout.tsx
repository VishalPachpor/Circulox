import localFont from "next/font/local";
import type { Metadata } from "next";
import "@/styles/base.css";
import { siteUrl, indexable } from "@/lib/site";
const sans = localFont({
  src: [
    {
      path: "./fonts/dm-sans-latin.woff2",
      weight: "100 1000",
      style: "normal",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});
const serif = localFont({
  src: [
    {
      path: "./fonts/newsreader-latin.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "./fonts/newsreader-latin-italic.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
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
