import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { createImageUrlBuilder } from "@sanity/image-url";
import { projectId, dataset } from "@/sanity/env";
import { safeHref, imageDimensions } from "@/lib/content-utils";
import type { Post } from "@/lib/posts";
export function ContentImage({ value }: { value: NonNullable<Post["cover"]> }) {
  if (!projectId || !value?.asset?._ref) return null;
  const size = imageDimensions(value.asset._ref, value.crop);
  if (!size) return null;
  const src = createImageUrlBuilder({ projectId, dataset })
    .image(value)
    .width(size.width)
    .height(size.height)
    .fit("max")
    .auto("format")
    .url();
  return (
    <figure className="article-cover">
      <Image
        src={src}
        alt={value.alt || ""}
        width={size.width}
        height={size.height}
        sizes="(max-width:800px) 100vw, 800px"
        style={{ height: "auto" }}
      />
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure>
  );
}
const components: PortableTextComponents = {
  types: { image: ({ value }) => <ContentImage value={value} /> },
  marks: {
    link: ({ children, value }) => {
      const href = safeHref(value?.href);
      return href ? (
        <a href={href} rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <>{children}</>
      );
    },
  },
};
export function PostBody({ body }: { body: Post["body"] }) {
  return <PortableText value={body} components={components} />;
}
