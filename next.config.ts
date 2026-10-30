import type { NextConfig } from "next";
const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return [
      { source: "/finalized.html", destination: "/", permanent: true },
      {
        source: "/insights/index.html",
        destination: "/insights",
        permanent: true,
      },
      {
        source: "/services/:slug.html",
        destination: "/services/:slug",
        permanent: true,
      },
      {
        source: "/jurisdictions/:slug.html",
        destination: "/jurisdictions/:slug",
        permanent: true,
      },
      {
        source: "/insights/:slug.html",
        destination: "/insights/:slug",
        permanent: true,
      },
    ];
  },
};
export default config;
