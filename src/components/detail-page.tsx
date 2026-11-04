import Image from "next/image";
import Link from "next/link";
import { Header } from "./header";
import { Footer } from "./footer";
import { ResponsiveDetails } from "./details";
import {
  CopyBlocks,
  ResponsiveIntro,
  sectionGroups,
  type PageCopy,
} from "./editorial-content";
import { bookingUrl } from "@/lib/site";
import legalEditorial from "../../public/legal-editorial.webp";

export function DetailPage({
  content,
  jurisdiction = false,
}: {
  content: PageCopy;
  jurisdiction?: boolean;
}) {
  const scope = content.sections.find((x) =>
    /^(Service scope|Decisions before formation)$/.test(x.label),
  )!;
  const context = content.sections.find(
    (x) => x.label === "When to consider this jurisdiction",
  );
  const prepare = content.sections.find((x) => x.label === "Before we speak");
  const questions = content.sections.find((x) => x.label === "Questions")!;
  const next = content.sections.find((x) =>
    /related expertise|Related expertise/.test(x.label),
  )!;
  const sources = content.sections.find(
    (x) => x.label === "Official sources and review date",
  );
  const notes = content.sections.filter(
    (x) => ![scope, context, prepare, questions, next, sources].includes(x),
  );
  const related = next.blocks.filter((x) => x.type === "list");
  return (
    <div className="inner-page editorial-page">
      <Header />
      <main id="main">
        <div className="shell hero">
          <div className="hero-copy">
            <div className="crumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href={jurisdiction ? "/#jurisdictions" : "/#expertise"}>
                {jurisdiction ? "Jurisdictions" : "Expertise"}
              </Link>
            </div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h1>{content.heading}</h1>
            <ResponsiveIntro page={content} />
          </div>
          <figure aria-hidden="true">
            <picture>
              <source
                media="(max-width: 560px)"
                srcSet="/legal-editorial-mobile.webp"
              />
              <Image
                src={legalEditorial}
                alt=""
                priority
                sizes="(max-width:560px) 100vw, 35vw"
              />
            </picture>
          </figure>
        </div>
        <nav className="shell section-nav" aria-label="On this page">
          <a href="#scope">
            {jurisdiction ? "Key considerations" : "Service scope"}
          </a>
          <a href="#approach">
            {jurisdiction ? "Formation & ongoing support" : "How we work"}
          </a>
          <a href="#questions">Questions</a>
        </nav>
        {context && (
          <section className="shell editorial-context">
            <div className="split">
              <h2>{context.heading}</h2>
              <CopyBlocks blocks={context.blocks} />
            </div>
          </section>
        )}
        <section className="scope" id="scope">
          <div className="shell split">
            <div>
              <div className="eyebrow">
                {jurisdiction ? "Before formation" : "Where we can help"}
              </div>
              <h2>{scope.heading}</h2>
            </div>
            <div className="editorial-scope">
              {sectionGroups(scope).map((group) => (
                <ResponsiveDetails
                  key={group.title}
                  className="faq-item scope-disclosure"
                  summary={group.title}
                >
                  <CopyBlocks blocks={group.blocks} />
                </ResponsiveDetails>
              ))}
            </div>
          </div>
        </section>
        <section
          className="shell editorial-notes"
          id="approach"
          aria-label="Approach and planning"
        >
          {notes.map((section) => (
            <ResponsiveDetails
              key={section.label}
              className="faq-item editorial-note"
              summary={section.heading}
            >
              <span className="editorial-note-label">{section.label}</span>
              <CopyBlocks blocks={section.blocks} />
            </ResponsiveDetails>
          ))}
        </section>
        {prepare && (
          <section className="prepare" id="prepare">
            <div className="shell split">
              <div>
                <div className="eyebrow">Before we speak</div>
                <h2>{prepare.heading}</h2>
              </div>
              <ResponsiveDetails
                className="preparation-details"
                summary="Information to bring"
              >
                <CopyBlocks blocks={prepare.blocks} />
              </ResponsiveDetails>
            </div>
          </section>
        )}
        <section className="faq" id="questions">
          <div className="shell">
            <div className="eyebrow">Common questions</div>
            <h2>{questions.heading}</h2>
            <div className="faq-grid">
              {sectionGroups(questions).map((group) => (
                <ResponsiveDetails
                  key={group.title}
                  className="faq-item"
                  summary={group.title}
                >
                  <CopyBlocks blocks={group.blocks} />
                </ResponsiveDetails>
              ))}
            </div>
          </div>
        </section>
        <section className="contact">
          <div className="shell split">
            <h2>{next.heading}</h2>
            <div>
              <CopyBlocks
                blocks={next.blocks.filter((x) => x.type !== "list")}
              />
              <a
                className="button"
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a call
              </a>
            </div>
          </div>
        </section>
        <aside className="shell related">
          <div className="related-inner">
            <h2>Related expertise.</h2>
            <nav aria-label="Related services">
              <CopyBlocks blocks={related} />
            </nav>
          </div>
        </aside>
        {sources && (
          <aside className="shell editorial-sources">
            <ResponsiveDetails
              className="faq-item"
              summary="Official sources & guidance"
            >
              <CopyBlocks blocks={sources.blocks} />
            </ResponsiveDetails>
          </aside>
        )}
      </main>
      <Footer />
    </div>
  );
}
