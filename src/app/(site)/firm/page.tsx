import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CopyBlocks } from "@/components/editorial-content";
import copy from "@/data/page-copy.json";
import { bookingUrl } from "@/lib/site";
const page = copy.firm;
export const metadata = {
  title: { absolute: page.seo.title },
  description: page.seo.description,
  alternates: { canonical: "/firm" },
};
export default function Firm() {
  const [experience, approach, delivery, work, contact] = page.sections;
  return (
    <div className="inner-page editorial-page firm-page">
      <Header />
      <main id="main">
        <section className="shell hero">
          <div className="hero-copy">
            <div className="eyebrow">{page.eyebrow}</div>
            <h1>{page.heading}</h1>
            <p>{page.intro}</p>
          </div>
        </section>
        <section className="scope">
          <div className="shell split">
            <h2>{experience.heading}</h2>
            <CopyBlocks blocks={experience.blocks} />
          </div>
        </section>
        <section className="shell firm-approach">
          <div>
            <h2>{approach.heading}</h2>
            <CopyBlocks blocks={approach.blocks} />
          </div>
          <div>
            <h2>{delivery.heading}</h2>
            <CopyBlocks blocks={delivery.blocks} />
          </div>
        </section>
        <section className="prepare">
          <div className="shell split">
            <h2>{work.heading}</h2>
            <div>
              <CopyBlocks blocks={work.blocks} />
              <Link className="text-link" href="/#expertise">
                Explore our expertise
              </Link>
            </div>
          </div>
        </section>
        <section className="contact">
          <div className="shell split">
            <h2>{contact.heading}</h2>
            <div>
              <p>{contact.blocks[0].text}</p>
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
      </main>
      <Footer />
    </div>
  );
}
