import Image from "next/image";
import Link from "next/link";
import mineral from "../../public/mineral-editorial.png";
export function Opening() {
  return (
    <section className="opening">
      <div className="opening-copy">
        <div>
          <div className="label entrance">{"Legal & business advisory"}</div>
          <h1 className="entrance">
            {"Legal advice for"}
            <br />
            <em>{"international business."}</em>
          </h1>
          <p className="entrance" data-pretext={true}>
            {
              "Company formation, regulatory advice and ongoing legal support for startups, fintech, Web3 and established businesses."
            }
          </p>
          <div className="opening-actions entrance">
            <Link className="button" href="/#consultation">
              {"Discuss your matter"}
            </Link>
            <Link className="link" href="/#expertise">
              {"Explore our expertise"}
            </Link>
          </div>
        </div>
      </div>
      <figure
        className="opening-art"
        aria-label="Editorial study of natural mineral strata"
      >
        <Image
          src={mineral}
          alt="Natural mineral layers"
          fill
          priority
          sizes="(max-width:800px) 100vw, 52vw"
        />
        <figcaption className="image-note">
          {"Perspective, in detail."}
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
        {
          "We help businesses establish, operate and grow internationally, with legal and commercial advice considered together."
        }
      </p>
      <div className="about-bottom reveal">
        <div>
          <p data-pretext={true}>
            {
              "Company formation, regulatory advice, commercial documentation and operational matters, considered together in the context of your business."
            }
          </p>
          <div className="about-links"></div>
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
            <h2>{"Our expertise."}</h2>
            <div>
              <p>
                {
                  "Advice across the legal, regulatory and operational matters of doing business internationally."
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
                  "Choose a jurisdiction, establish your company and prepare for investment."
                }
              </p>
              <div className="formation-markets">
                <span>{"Jurisdictions we advise on"}</span>
                <p>
                  {"United States · United Kingdom · UAE · Singapore"}
                  <br />
                  {"BVI · Cayman · Seychelles · India"}
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
                  "Navigate financial regulation and the policies behind your product."
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
                  "Support for the contracts, compliance and infrastructure of your business."
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
                  "Protect your brand and respond to commercial or platform disputes."
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
              "Tell us about your business, the jurisdictions involved and where you need legal support. Start a conversation with Circulox on Telegram."
            }
          </p>
          <a
            className="button"
            href="https://t.me/iptisha"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"Message on Telegram"}
          </a>
        </div>
      </div>
    </section>
  );
}
