import copy from "@/data/page-copy.json";
import Image from "next/image";
import { bookingUrl } from "@/lib/site";
import Link from "next/link";
import legalEditorial from "../../public/legal-editorial.webp";
export function Opening() {
  return (
    <section className="opening">
      <div className="opening-copy">
        <div>
          <div className="label entrance">{copy.homepage.eyebrow}</div>
          <h1 className="entrance">{copy.homepage.heading}</h1>
          <p className="entrance" data-pretext={true}>
            {copy.homepage.intro}
          </p>
          <div className="opening-actions entrance">
            <Link className="button" href="/contact">
              Contact us
            </Link>
            <a
              className="link"
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call
            </a>
          </div>
        </div>
      </div>
      <figure
        className="opening-art"
        aria-label="Editorial image of scales of justice in a law library"
      >
        <picture>
          <source
            media="(max-width: 800px)"
            srcSet="/legal-editorial-mobile.webp"
          />
          <Image
            src={legalEditorial}
            alt="Bronze scales of justice and law books in a warm walnut library"
            fill
            priority
            sizes="(max-width:800px) 100vw, 52vw"
          />
        </picture>
        <figcaption className="image-note">
          {"Legal perspective. Business focus."}
        </figcaption>
      </figure>
    </section>
  );
}
export function About() {
  return (
    <section className="about shell" id="firm">
      <div className="section-label">{"The firm"}</div>
      <p className="about-statement reveal">
        {"Clear advice. Practical support."}
      </p>
      <div className="about-bottom reveal">
        <div>
          <p data-pretext={true}>
            {
              "Building across borders brings decisions about where to establish your company, which permissions your activities may require and how to prepare your product for market."
            }
          </p>
          <p>
            Circulox connects these decisions, explaining the issues and
            coordinating with affiliated local providers where needed. Our team
            gives you a clear point of contact as your business moves forward.
          </p>
          <div className="about-links">
            <Link className="link" href="/firm">
              About Circulox
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
const practiceAreas = [
  {
    title: "Formation & structuring",
    services: [
      { slug: "formation", label: "Company formation" },
      { slug: "startup", label: "Startup & investment" },
    ],
  },
  {
    title: "Regulation & technology",
    services: [
      { slug: "regulation", label: "Crypto & fintech regulation" },
      { slug: "platform", label: "App Store compliance" },
    ],
  },
  {
    title: "Business operations",
    services: [
      { slug: "governance", label: "Governance & contracts" },
      { slug: "banking", label: "Banking, payments & tax" },
    ],
  },
  {
    title: "Protection & disputes",
    services: [
      { slug: "ip", label: "Intellectual property" },
      { slug: "disputes", label: "Legal notices & disputes" },
    ],
  },
];

export function Expertise() {
  return (
    <section className="expertise" id="expertise" aria-labelledby="expertise-title">
      <div className="shell">
        <div className="expertise-index reveal">
          <div className="expertise-heading">
            <h2 id="expertise-title">Our expertise.</h2>
          </div>
          <div className="practice-bento">
            {practiceAreas.map(({ title, services }) => (
              <div className="practice-area" key={title}>
                <h3>{title}</h3>
                <ul>
                  {services.map(({ slug, label }) => (
                    <li key={slug}>
                      <Link className="practice-link" href={`/services/${slug}`}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export function Conversation() {
  return (
    <section className="conversation" id="consultation">
      <div className="shell conversation-grid reveal">
        <h2>
          {"Let’s start"}
          <br />
          <em>{"with your business."}</em>
        </h2>
        <div>
          <p>
            {
              "Tell us what you are building, where you plan to operate and the questions you need help answering. Speak with our team about the legal or compliance support you are looking for."
            }
          </p>
          <a
            className="button"
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {"Book a call"}
          </a>
        </div>
      </div>
    </section>
  );
}
