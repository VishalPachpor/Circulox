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
export function Expertise() {
  return (
    <section className="expertise" id="expertise">
      <div className="shell">
        <div className="expertise-index reveal">
          <div className="expertise-heading">
            <h2>{"Support for each stage of your business."}</h2>
            <div>
              <p>
                {
                  "From company formation and licensing to mobile app compliance and ongoing legal needs, our advice connects your business plans with the steps needed to move forward."
                }
              </p>
            </div>
          </div>
          <div className="practice-bento" aria-label="Areas of practice">
            <div className="practice-area">
              <h3>
                {"Formation &"}
                <br />
                {"structuring"}
              </h3>
              <p>
                {
                  "Choose where to establish your business, structure its ownership and prepare for investment."
                }
              </p>
              <div className="formation-markets">
                <span>{"Jurisdictions we advise on"}</span>
                <p>
                  {"United States · United Kingdom · UAE · Singapore"}
                  <br />
                  {"BVI · Cayman · Seychelles · Hong Kong · India"}
                </p>
              </div>
              <ul>
                <li>
                  <Link
                    className="practice-link"
                    href="/services/formation"
                    aria-label="Company incorporation & international structuring"
                  >
                    <span className="practice-long">
                      {"Company incorporation & international structuring"}
                    </span>
                    <span className="practice-short">
                      {"Company formation"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="practice-link"
                    href="/services/startup"
                    aria-label="Startup & investment advisory"
                  >
                    <span className="practice-long">
                      {"Startup & investment advisory"}
                    </span>
                    <span className="practice-short">
                      {"Startup & investment"}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="practice-area">
              <h3>{"Regulation & technology"}</h3>
              <p>
                {
                  "Understand licensing and registration requirements, and address App Store and Google Play compliance before submission or following a rejection."
                }
              </p>
              <ul>
                <li>
                  <Link
                    className="practice-link"
                    href="/services/regulation"
                    aria-label="Web3, crypto & fintech regulation"
                  >
                    <span className="practice-long">
                      {"Web3, crypto & fintech regulation"}
                    </span>
                    <span className="practice-short">{"Crypto & fintech"}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="practice-link"
                    href="/services/platform"
                    aria-label="App Store & technology compliance"
                  >
                    <span className="practice-long">
                      {"App Store & technology compliance"}
                    </span>
                    <span className="practice-short">{"App compliance"}</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="practice-area">
              <h3>{"Business operations"}</h3>
              <p>
                {
                  "Put agreements, governance and operating arrangements in place, with support for banking, payments and tax questions."
                }
              </p>
              <ul>
                <li>
                  <Link
                    className="practice-link"
                    href="/services/governance"
                    aria-label="Corporate governance & documentation"
                  >
                    <span className="practice-long">
                      {"Corporate governance & documentation"}
                    </span>
                    <span className="practice-short">
                      {"Governance & contracts"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="practice-link"
                    href="/services/banking"
                    aria-label="Banking, payments & tax"
                  >
                    <span className="practice-long">
                      {"Banking, payments & tax"}
                    </span>
                    <span className="practice-short">{"Banking & tax"}</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="practice-area">
              <h3>{"Protection & disputes"}</h3>
              <p>
                {
                  "Protect your intellectual property and respond to disputes with advice grounded in your business priorities."
                }
              </p>
              <ul>
                <li>
                  <Link
                    className="practice-link"
                    href="/services/ip"
                    aria-label="Intellectual property"
                  >
                    <span className="practice-long">
                      {"Intellectual property"}
                    </span>
                    <span className="practice-short">
                      {"Intellectual property"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="practice-link"
                    href="/services/disputes"
                    aria-label="Legal notices & dispute resolution"
                  >
                    <span className="practice-long">
                      {"Legal notices & dispute resolution"}
                    </span>
                    <span className="practice-short">
                      {"Dispute resolution"}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
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
