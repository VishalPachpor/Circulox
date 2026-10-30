import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { About, Conversation } from "@/components/home-sections";
export const metadata = {
  title: "The firm",
  description:
    "Circulox is an international legal and business advisory firm for startups, fintech, Web3 businesses and established enterprises.",
  alternates: { canonical: "/firm" },
};
export default function Firm() {
  return (
    <div className="inner-page">
      <Header />
      <main id="main">
        <section className="shell hero">
          <div className="hero-copy">
            <div className="eyebrow">The firm</div>
            <h1>
              An international perspective.
              <br />A practical understanding of business.
            </h1>
            <p>
              Circulox works with startups, fintech companies, Web3 businesses
              and established enterprises on legal, regulatory, corporate and
              operational matters.
            </p>
          </div>
        </section>
        <section className="scope">
          <div className="shell split">
            <h2>Advice connected to your business.</h2>
            <div>
              <p>
                We consider company structure, product design, regulation and
                day-to-day operations together. Each engagement starts with your
                business, the markets involved and the decision you need to
                make.
              </p>
              <p>
                Our areas of work include international incorporation, digital
                finance regulation, technology compliance, governance,
                intellectual property, banking, investment and dispute
                resolution.
              </p>
            </div>
          </div>
        </section>
        <section className="shell prepare" id="team">
          <div className="eyebrow">Our approach</div>
          <h2>A focused starting point.</h2>
          <p className="section-intro">
            Share your activities, ownership, operating markets and the question
            in front of you. We can then discuss the appropriate scope of
            support.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
