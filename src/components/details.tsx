"use client";
import { useEffect, useRef } from "react";
export function ResponsiveDetails({
  children,
  summary,
  className,
}: {
  children: React.ReactNode;
  summary: string;
  className: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const media = matchMedia("(max-width:560px)");
    const adapt = () => {
      if (ref.current) {
        ref.current.open = !media.matches;
        const summary = ref.current.querySelector("summary");
        if (summary && className === "faq-item") {
          summary.tabIndex = media.matches ? 0 : -1;
          if (media.matches) {
            summary.removeAttribute("role");
            summary.removeAttribute("aria-level");
          } else {
            summary.setAttribute("role", "heading");
            summary.setAttribute("aria-level", "3");
          }
        }
      }
    };
    adapt();
    media.addEventListener("change", adapt);
    return () => media.removeEventListener("change", adapt);
  }, []);
  return (
    <details
      ref={ref}
      className={className}
      onKeyDown={(e) => {
        if (
          className === "faq-item" &&
          !matchMedia("(max-width:560px)").matches &&
          ["Enter", " "].includes(e.key)
        )
          e.preventDefault();
      }}
    >
      <summary>{summary}</summary>
      {children}
    </details>
  );
}
