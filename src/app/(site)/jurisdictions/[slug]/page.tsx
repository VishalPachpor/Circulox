import copy from "@/data/page-copy.json";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/detail-page";
import pages from "@/data/jurisdiction-pages.json";
export function generateStaticParams() {
  return pages.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = pages.find((x) => x.slug === slug);
  return item
    ? {
        title: { absolute: copy[slug as keyof typeof copy].seo.title },
        description: copy[slug as keyof typeof copy].seo.description,
        alternates: { canonical: `/jurisdictions/${slug}` },
      }
    : { title: "Page not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = pages.find((x) => x.slug === slug);
  if (!item) notFound();
  return <DetailPage content={copy[slug as keyof typeof copy]} jurisdiction />;
}
