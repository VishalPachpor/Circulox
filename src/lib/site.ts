export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
export const indexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";
export const bookingUrl = "https://calendly.com/iptisha";
export const contactEmail = "iptisha@circulox.org";

export const generalEmail = "info@circulox.org";
export const ukAddress = [
  "71–75 Shelton Street",
  "Covent Garden, London",
  "UK",
];
