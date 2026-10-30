import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexable
      ? { userAgent: "*", allow: "/", disallow: ["/studio", "/admin", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: indexable ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
