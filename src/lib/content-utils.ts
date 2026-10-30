export function safeHref(value: unknown): string | undefined {
  if (typeof value !== "string") return;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    if (["https:", "http:", "mailto:"].includes(url.protocol)) return value;
  } catch {}
}
export function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 96;
}
export function articleMatches(
  post: { title: string; excerpt: string; category: string; tags: string[] },
  query: string,
  category: string,
  tag: string,
) {
  return (
    (!category || post.category === category) &&
    (!tag || post.tags.includes(tag)) &&
    `${post.title} ${post.excerpt} ${post.tags.join(" ")}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase())
  );
}
export function isPublicPost(
  post: { _id?: string; publishedAt?: string },
  now = Date.now(),
) {
  const date = Date.parse(post.publishedAt || "");
  return Boolean(
    post._id &&
    !post._id.startsWith("drafts.") &&
    Number.isFinite(date) &&
    date <= now,
  );
}

export function imageDimensions(
  ref: string,
  crop?: { top?: number; bottom?: number; left?: number; right?: number },
) {
  const match = /^image-.+-(\d+)x(\d+)-[a-z0-9]+$/.exec(ref);
  if (!match) return null;
  const sourceWidth = Number(match[1]);
  const sourceHeight = Number(match[2]);
  const w = sourceWidth * (1 - (crop?.left || 0) - (crop?.right || 0));
  const h = sourceHeight * (1 - (crop?.top || 0) - (crop?.bottom || 0));
  if (!(w > 0 && h > 0)) return null;
  const width = Math.min(1400, Math.round(w));
  return { width, height: Math.max(1, Math.round((h / w) * width)) };
}
