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
        title: item.title,
        description: item.intro,
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
  return <DetailPage content={item} jurisdiction index={pages.indexOf(item)} />;
}
