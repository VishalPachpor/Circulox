import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import type { PortableTextBlock } from "@portabletext/types";
import { getClient } from "@/sanity/client";
import { validSlug, isPublicPost } from "./content-utils";
export type Post = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  _updatedAt: string;
  body: PortableTextBlock[];
  author: { name: string; role?: string };
  cover?: {
    asset: { _ref: string };
    alt: string;
    crop?: { top?: number; bottom?: number; left?: number; right?: number };
    caption?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
};
export type PostSummary = Pick<
  Post,
  | "_id"
  | "slug"
  | "title"
  | "excerpt"
  | "category"
  | "tags"
  | "publishedAt"
  | "_updatedAt"
  | "author"
>;
const detailProjection = `{_id,"slug":slug.current,title,excerpt,category,"tags":coalesce(tags,[]),publishedAt,_updatedAt,body,"author":author->{name,role},cover,seoTitle,seoDescription}`;
const summaryProjection = `{_id,"slug":slug.current,title,excerpt,category,"tags":coalesce(tags,[]),publishedAt,_updatedAt,"author":author->{name,role}}`;
export const getPosts = cache(async (limit?: number) => {
  const { isEnabled } = await draftMode();
  const client = getClient(isEnabled);
  if (!client) return [] as PostSummary[];
  const posts = await client.fetch<PostSummary[]>(
    `*[_type=="post" && defined(slug.current) ${isEnabled ? "" : "&& defined(publishedAt) && dateTime(publishedAt) <= dateTime(now())"}] | order(publishedAt desc) ${summaryProjection}${limit ? "[0...$limit]" : ""}`,
    { limit: limit ? Math.min(100, Math.max(1, Math.floor(limit))) : 0 },
    isEnabled
      ? { cache: "no-store" }
      : { next: { revalidate: 60, tags: ["posts"] } },
  );
  return isEnabled ? posts : posts.filter((post) => isPublicPost(post));
});
export const getPost = cache(async (slug: string) => {
  if (!validSlug(slug)) return null;
  const { isEnabled } = await draftMode();
  const client = getClient(isEnabled);
  if (!client) return null;
  const post = await client.fetch<Post | null>(
    `*[_type=="post" && slug.current==$slug ${isEnabled ? "" : "&& defined(publishedAt) && dateTime(publishedAt) <= dateTime(now())"}][0] ${detailProjection}`,
    { slug },
    isEnabled
      ? { cache: "no-store" }
      : { next: { revalidate: 60, tags: ["posts"] } },
  );
  return post && (isEnabled || isPublicPost(post)) ? post : null;
});
