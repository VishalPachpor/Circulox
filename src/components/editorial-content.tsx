import { Fragment } from "react";
import Link from "next/link";
import { safeHref } from "@/lib/content-utils";

export type CopyBlock = { type: string; text?: string; items?: string[] };
export type CopySection = {
  label: string;
  heading: string;
  blocks: CopyBlock[];
};
export type PageCopy = {
  eyebrow: string;
  heading: string;
  intro: string;
  mobileIntro: string;
  seo: { title: string; description: string };
  sections: CopySection[];
};

// Only the handoff's inline links are interpreted. All other copy is escaped by React.
export function InlineCopy({ text }: { text: string }) {
  const arrow = text.match(
    /^(.+?) → (\/[^\s]*|https?:\/\/[^\s]+|mailto:[^\s]+)$/,
  );
  if (arrow && safeHref(arrow[2]))
    return <Link href={arrow[2]}>{arrow[1]}</Link>;
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        const href = match && safeHref(match[2]);
        return href ? (
          <a key={i} href={href}>
            {match![1]}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}
export function CopyBlocks({ blocks }: { blocks: CopyBlock[] }) {
  return (
    <div className="copy-blocks">
      {blocks.map((block, i) => {
        if (block.type === "heading") return <h3 key={i}>{block.text}</h3>;
        if (block.type === "list")
          return (
            <ul
              key={i}
              className={
                block.items?.every((x) => x.includes(" → /"))
                  ? "copy-link-list"
                  : undefined
              }
            >
              {block.items?.map((x) => (
                <li key={x}>
                  <InlineCopy text={x} />
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i}>
            <InlineCopy text={block.text || ""} />
          </p>
        );
      })}
    </div>
  );
}
export function sectionGroups(section: CopySection) {
  const groups: { title: string; blocks: CopyBlock[] }[] = [];
  for (const block of section.blocks) {
    if (block.type === "heading")
      groups.push({ title: block.text || "", blocks: [] });
    else if (groups.length) groups[groups.length - 1].blocks.push(block);
  }
  return groups;
}
export function ResponsiveIntro({ page }: { page: PageCopy }) {
  return (
    <p>
      {page.mobileIntro ? (
        <>
          <span className="copy-desktop-intro">{page.intro}</span>
          <span className="copy-mobile-intro">{page.mobileIntro}</span>
        </>
      ) : (
        page.intro
      )}
    </p>
  );
}
