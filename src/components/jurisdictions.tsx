"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import countries from "@/data/explorer.json";
export function Jurisdictions() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const country = countries[active];
  return (
    <section className="international" id="jurisdictions">
      <div className="shell jurisdiction-explorer">
        <div className="jurisdiction-context">
          <div className="section-label">Jurisdiction advisory</div>
          <h2>
            Where should your
            <br />
            business be based?
          </h2>
          <p>
            We consider your activities, ownership, banking needs and operating
            markets together.
          </p>
          <Link className="link" href="/services/formation">
            What to consider before choosing
          </Link>
        </div>
        <div className="jurisdiction-browser">
          <div
            className="jurisdiction-tabs"
            role="tablist"
            aria-label="Explore a jurisdiction"
          >
            {countries.map((item, index) => (
              <button
                key={item.key}
                ref={(el) => {
                  refs.current[index] = el;
                }}
                className={hovered === index ? "colour-hover" : ""}
                role="tab"
                type="button"
                id={`jurisdiction-tab-${item.key}`}
                aria-controls="jurisdiction-detail"
                aria-selected={active === index}
                tabIndex={active === index ? 0 : -1}
                data-jurisdiction={item.key}
                aria-label={item.name}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") {
                    setHovered(index);
                    setActive(index);
                  }
                }}
                onPointerLeave={() => setHovered(null)}
                onClick={() => setActive(index)}
                onKeyDown={(e) => {
                  let next: number;
                  if (e.key === "ArrowRight")
                    next = (index + 1) % countries.length;
                  else if (e.key === "ArrowLeft")
                    next = (index + countries.length - 1) % countries.length;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = countries.length - 1;
                  else return;
                  e.preventDefault();
                  setActive(next);
                  refs.current[next]?.focus();
                }}
              >
                <span className="jurisdiction-tab-label">
                  <span className="jurisdiction-desktop-name">
                    {item.label}
                  </span>
                  <span className="jurisdiction-mobile-name" aria-hidden="true">
                    {(
                      {
                        "united-states": "US",
                        "united-kingdom": "UK",
                        cayman: "Cayman",
                      } as Record<string, string>
                    )[item.key] || item.label}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div
            className="jurisdiction-detail"
            id="jurisdiction-detail"
            role="tabpanel"
            aria-labelledby={`jurisdiction-tab-${country.key}`}
            tabIndex={0}
          >
            <div className="jurisdiction-detail-label">
              Formation &amp; international structuring
            </div>
            <h3 id="jurisdiction-title">{country.name}</h3>
            <p id="jurisdiction-description">
              <span className="jurisdiction-desktop-name">{country.intro}</span>
              <span className="jurisdiction-mobile-name">
                {country.mobileIntro}
              </span>
            </p>
            <div className="jurisdiction-topics">
              <span>Topics to discuss</span>
              <ul>
                {country.focus.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <Link className="link" href={`/jurisdictions/${country.key}`}>
              Explore {country.name} advisory
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
