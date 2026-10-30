export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
export const indexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";
export const telegram = "https://t.me/iptisha";
