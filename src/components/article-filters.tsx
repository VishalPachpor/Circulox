"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { articleMatches } from "@/lib/content-utils";
export type ArticleSummary = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: { name: string } | null;
};
function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const all = ["", ...options];
  useEffect(() => {
    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  useEffect(() => {
    if (open) buttons.current[all.indexOf(value)]?.focus();
  }, [open]);
  return (
    <div className="filter-field" ref={ref}>
      <label id={`${id}-label`} htmlFor={id}>
        {label}
      </label>
      <div className={`filter-select ${open ? "is-open" : ""}`}>
        <select
          id={id}
          className="enhanced-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {all.map((item) => (
            <option key={item} value={item}>
              {item || `All ${label.toLowerCase()}`}
            </option>
          ))}
        </select>
        <button
          ref={trigger}
          type="button"
          className="filter-trigger"
          id={`${id}-trigger`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-labelledby={`${id}-label ${id}-value`}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span id={`${id}-value`}>
            {value || `All ${label.toLowerCase()}`}
          </span>
        </button>
        <div
          id={`${id}-options`}
          className="filter-options"
          role="listbox"
          aria-labelledby={`${id}-label`}
          hidden={!open}
          onKeyDown={(e) => {
            const at = buttons.current.indexOf(
              document.activeElement as HTMLButtonElement,
            );
            let next: number;
            if (e.key === "Escape") {
              e.preventDefault();
              setOpen(false);
              trigger.current?.focus();
              return;
            }
            if (e.key === "Tab") {
              setOpen(false);
              trigger.current?.focus();
              return;
            }
            if (e.key === "ArrowDown") next = (at + 1) % all.length;
            else if (e.key === "ArrowUp")
              next = (at + all.length - 1) % all.length;
            else if (e.key === "Home") next = 0;
            else if (e.key === "End") next = all.length - 1;
            else return;
            e.preventDefault();
            buttons.current[next]?.focus();
          }}
        >
          {all.map((item, i) => (
            <button
              key={item}
              ref={(el) => {
                buttons.current[i] = el;
              }}
              role="option"
              aria-selected={value === item}
              tabIndex={-1}
              type="button"
              data-value={item}
              onClick={() => {
                onChange(item);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              {item || `All ${label.toLowerCase()}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export function ArticleFilters({ posts }: { posts: ArticleSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const filtered = posts.filter((p) => articleMatches(p, query, category, tag));
  const categories = [...new Set(posts.map((p) => p.category))].sort();
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  return (
    <>
      <form
        className="filters"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="filter-field">
          <label htmlFor="article-search">Search insights</label>
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by subject or keyword"
          />
        </div>
        <FilterSelect
          id="article-category"
          label="Categories"
          value={category}
          onChange={setCategory}
          options={categories}
        />
        <FilterSelect
          id="article-tag"
          label="Topics"
          value={tag}
          onChange={setTag}
          options={tags}
        />
      </form>
      <p className="result-count" id="result-count" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
      </p>
      <div className="journal-list">
        {filtered.map((post, index) => (
          <Link
            className={`journal-entry ${index === 0 ? "is-lead" : ""}`}
            href={`/insights/${post.slug}`}
            key={post._id}
          >
            <div className="entry-meta">
              <span>{post.category}</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </span>
            </div>
            <div className="entry-copy">
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="entry-tags">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <span className="entry-read">Read article</span>
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <div className="journal-empty">
          <h2>
            {posts.length
              ? "No matching articles."
              : "Insights are on their way."}
          </h2>
          <p>
            {posts.length
              ? "Try another subject or clear your filters."
              : "Reviewed articles and practical guides will be published here by the Circulox team."}
          </p>
          {posts.length > 0 && (
            <button
              id="clear-search"
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("");
                setTag("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </>
  );
}
