import type { MetadataRoute } from "next";
import { createClient } from "next-sanity";
import services from "@/data/services.json";
import jurisdictions from "@/data/directory.json";
import { siteUrl } from "@/lib/site";
import { configured, projectId, dataset, apiVersion } from "@/sanity/env";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    "",
    "/firm",
    "/contact",
    "/insights",
    ...Object.keys(services).map((x) => `/services/${x}`),
    ...jurisdictions.map((x) => `/jurisdictions/${x.slug}`),
  ];
  const posts = configured
    ? await createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: true,
        perspective: "published",
      }).fetch<{ slug: string; _updatedAt: string }[]>(
        `*[_type=="post"&&defined(slug.current)&&defined(publishedAt)&&dateTime(publishedAt)<=dateTime(now())]{"slug":slug.current,_updatedAt}`,
        {},
        { next: { revalidate: 60 } },
      )
    : [];
  return [
    ...paths.map((path) => ({ url: `${siteUrl}${path}` })),
    ...posts.map((p) => ({
      url: `${siteUrl}/insights/${p.slug}`,
      lastModified: p._updatedAt,
    })),
  ];
}
