import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { telegram } from "@/lib/site";
export const metadata = {
  title: "Contact",
  description:
    "Start a conversation with Circulox about your company, operating markets and legal needs.",
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  return (
    <div className="inner-page">
      <Header />
      <main id="main">
        <section className="shell hero">
          <div className="hero-copy">
            <div className="eyebrow">Contact Circulox</div>
            <h1>Let’s start with your business.</h1>
            <p>
              Tell us what you are building, where you operate and the legal or
              business question you need to resolve.
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
        </section>
        <section className="prepare">
          <div className="shell split">
            <h2>Before we speak.</h2>
            <ol>
              <li>A short description of your company or proposed activity.</li>
              <li>The jurisdictions and operating markets involved.</li>
              <li>Your main question and any relevant timeline.</li>
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
