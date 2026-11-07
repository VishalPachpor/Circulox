import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CopyBlocks } from "@/components/editorial-content";
import { bookingUrl, contactEmail, generalEmail, ukAddress } from "@/lib/site";
import copy from "@/data/page-copy.json";
const page = copy.contact;
export const metadata = {
  title: { absolute: page.seo.title },
  description: page.seo.description,
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  const before = page.sections.find((x) => x.label === "Before we speak")!;
  const next = page.sections.find((x) => x.label === "What happens next")!;
  return (
    <div className="inner-page editorial-page contact-page">
      <Header />
      <main id="main">
        <section className="shell hero">
          <div className="hero-copy">
            <div className="eyebrow">{page.eyebrow}</div>
            <h1>{page.heading}</h1>
            <p>{page.intro}</p>
            <a
              className="button"
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call
            </a>
          </div>
          <div className="contact-directory">
            <h2>Prefer to write to us?</h2>
            <p>
              Send a short introduction, with an outline of your business and
              the support you need.
            </p>
            <a href={`mailto:${generalEmail}`}>{generalEmail}</a>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            <div className="contact-address">
              <h3>Our Address</h3>
              <address>
                {ukAddress.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </div>
          </div>
        </section>
        <section className="prepare">
          <div className="shell split">
            <h2>{before.heading}</h2>
            <CopyBlocks blocks={before.blocks} />
          </div>
        </section>
        <section className="shell editorial-context">
          <div className="split">
            <h2>{next.heading}</h2>
            <CopyBlocks blocks={next.blocks} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
