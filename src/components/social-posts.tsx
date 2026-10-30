"use client";
import { useEffect, useRef, useState } from "react";
const ids = [
  "2095450271333970003",
  "2082015141030498411",
  "2069020704180441311",
];
type Twitter = {
  widgets: {
    createTweet: (
      id: string,
      node: HTMLElement,
      options: Record<string, unknown>,
    ) => Promise<HTMLElement | undefined>;
  };
};
declare global {
  interface Window {
    twttr?: Twitter;
  }
}
let load: Promise<Twitter> | undefined;
function loadTwitter() {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr);
  if (!load)
    load = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () =>
        window.twttr?.widgets
          ? resolve(window.twttr)
          : reject(new Error("Posts unavailable"));
      script.onerror = () => {
        load = undefined;
        reject(new Error("Posts unavailable"));
      };
      document.head.append(script);
    });
  return load;
}
export function SocialPosts() {
  const feed = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false;
    let started = false;
    const section = feed.current;
    if (!section) return;
    const start = async () => {
      if (started) return;
      started = true;
      try {
        const twitter = await loadTwitter();
        for (let i = 0; i < ids.length; i++) {
          const node = nodes.current[i];
          if (disposed || !node) continue;
          const tweet = await twitter.widgets.createTweet(ids[i], node, {
            conversation: "none",
            cards: "hidden",
            dnt: true,
            theme: "light",
          });
          if (!disposed && tweet) setLoaded((old) => [...old, ids[i]]);
        }
      } catch {
        if (!disposed) setFailed(true);
      }
    };
    const observer = new IntersectionObserver(
      (items) => {
        if (items.some((item) => item.isIntersecting)) {
          start();
          observer.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    observer.observe(section);
    const timeout = setTimeout(() => {
      if (!disposed && started) setFailed(true);
    }, 15000);
    return () => {
      disposed = true;
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const el = feed.current;
    if (!el) return;
    const fit = () => {
      if (matchMedia("(max-width:600px)").matches) {
        const post = el.children[current] as HTMLElement;
        el.style.height = `${Math.ceil(post.getBoundingClientRect().height + 14)}px`;
      } else el.style.removeProperty("height");
    };
    const observer = new ResizeObserver(fit);
    Array.from(el.children).forEach((x) => observer.observe(x));
    fit();
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [current, loaded, failed]);
  function move(index: number) {
    const el = feed.current;
    if (!el) return;
    el.scrollTo({
      left:
        index *
        (el.clientWidth + parseFloat(getComputedStyle(el).columnGap || "0")),
      behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
        ? "auto"
        : "smooth",
    });
  }
  return (
    <section className="social-notes" id="from-x">
      <div className="shell">
        <div className="social-header">
          <div>
            <div className="section-label">From X</div>
            <h2>In conversation.</h2>
          </div>
          <a
            className="link"
            href="https://x.com/iptishax"
            target="_blank"
            rel="noopener noreferrer"
          >
            View @iptishax on X
          </a>
        </div>
        <div
          ref={feed}
          className="x-feed"
          aria-label="Selected posts from X"
          onScroll={(e) => {
            const el = e.currentTarget;
            setCurrent(
              Math.min(
                2,
                Math.max(
                  0,
                  Math.round(
                    el.scrollLeft /
                      (el.clientWidth +
                        parseFloat(getComputedStyle(el).columnGap || "0")),
                  ),
                ),
              ),
            );
          }}
        >
          {ids.map((id, i) => (
            <div key={id} className="x-post" data-loaded={loaded.includes(id)}>
              <div
                ref={(el) => {
                  nodes.current[i] = el;
                }}
              />
              {!loaded.includes(id) && (
                <>
                  <a
                    href={`https://x.com/iptishax/status/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read selected post {i + 1} on X
                  </a>
                  <p className="x-post-status">
                    {failed ? "Open this post on X." : "Loading post…"}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="x-pagination">
          <span aria-live="polite">{current + 1} / 3</span>
          <div>
            <button
              type="button"
              disabled={current === 0}
              onClick={() => move(current - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={current === 2}
              onClick={() => move(current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
