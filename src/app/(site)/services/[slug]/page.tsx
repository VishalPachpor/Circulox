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
        title: item.title,
        description: item.intro,
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
  return (
    <DetailPage content={item} index={Object.keys(services).indexOf(slug)} />
  );
}
