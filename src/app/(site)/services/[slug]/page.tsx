import copy from "@/data/page-copy.json";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/detail-page";
import services from "@/data/services.json";
export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = services[slug as keyof typeof services];
  return item
    ? {
        title: { absolute: copy[slug as keyof typeof copy].seo.title },
        description: copy[slug as keyof typeof copy].seo.description,
        alternates: { canonical: `/services/${slug}` },
      }
    : { title: "Page not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = services[slug as keyof typeof services];
  if (!item) notFound();
  return <DetailPage content={copy[slug as keyof typeof copy]} />;
}
