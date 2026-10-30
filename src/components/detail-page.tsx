import Image from "next/image";
import Link from "next/link";
import { Header } from "./header";
import { Footer } from "./footer";
import { ResponsiveDetails } from "./details";
import services from "@/data/services.json";
import { telegram } from "@/lib/site";
import mineral from "../../public/mineral-editorial.png";
export type DetailContent = {
  title: string;
  intro: string;
  scope: string[][];
  prepare: string[];
  questions: string[][];
  short?: string;
  related?: string[];
};
export function DetailPage({
  content,
  index,
  jurisdiction = false,
}: {
  content: DetailContent;
  index: number;
  jurisdiction?: boolean;
}) {
  return (
    <div className="inner-page">
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
              <span>/ {String(index + 1).padStart(2, "0")}</span>
            </div>
            <h1>{content.title}</h1>
            <p>{content.intro}</p>
          </div>
          <figure aria-hidden="true">
            <Image
              src={mineral}
              alt=""
              priority
              sizes="(max-width:560px) 100vw, 35vw"
            />
          </figure>
        </div>
        <nav className="shell section-nav" aria-label="On this page">
          <a href="#scope">
            <span className="scope-title-desktop">Service scope</span>
            <span className="scope-title-mobile">Our scope</span>
          </a>
          <a href="#prepare">Before we speak</a>
          <a href="#questions">Questions</a>
        </nav>
        <section className="scope" id="scope">
          <div className="shell split">
            <div>
              <div className="eyebrow">Where we can help</div>
              <h2>
                <span className="scope-title-desktop">
                  Advice shaped
                  <br />
                  around your business.
                </span>
                <span className="scope-title-mobile">
                  Support for your next step.
                </span>
              </h2>
            </div>
            <div className="scope-rows">
              {content.scope.map(([title, copy]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="prepare" id="prepare">
          <div className="shell split">
            <div>
              <div className="eyebrow">Before we speak</div>
              <h2>A useful starting point.</h2>
              <p className="section-intro">
                A short overview helps focus the conversation. Share what you
                have available.
              </p>
            </div>
            <ResponsiveDetails
              className="preparation-details"
              summary="Information to bring"
            >
              <ol>
                {content.prepare.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
            </ResponsiveDetails>
          </div>
        </section>
        <section className="faq" id="questions">
          <div className="shell">
            <div className="eyebrow">Common questions</div>
            <h2>About this service.</h2>
            <div className="faq-grid">
              {content.questions.map(([question, answer]) => (
                <ResponsiveDetails
                  key={question}
                  className="faq-item"
                  summary={question}
                >
                  <p>{answer}</p>
                </ResponsiveDetails>
              ))}
            </div>
          </div>
        </section>
        <section className="contact">
          <div className="shell split">
            <h2>
              Let’s discuss
              <br />
              <em>your next step.</em>
            </h2>
            <div>
              <p>
                Tell us about your{" "}
                {jurisdiction ? "business plans" : "legal needs"} and the
                jurisdictions involved. Start a conversation with Circulox on
                Telegram.
              </p>
              <a
                className="button"
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Message on Telegram
              </a>
            </div>
          </div>
        </section>
        <aside className="shell related">
          <div className="related-inner">
            <h2>Related expertise.</h2>
            <nav aria-label="Related services">
              {(content.related || ["formation", "regulation"]).map((key) => (
                <Link className="text-link" key={key} href={`/services/${key}`}>
                  {services[key as keyof typeof services].short}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
