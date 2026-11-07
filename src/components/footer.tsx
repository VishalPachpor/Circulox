import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { generalEmail, ukAddress } from "@/lib/site";
export function Footer({ home = false }: { home?: boolean }) {
  return (
    <footer className={`footer shell site-footer${home ? " home-footer" : ""}`}>
      <div className="footer-top">
        <Link href="/" className="wordmark">
          <BrandLogo />
        </Link>
        <nav aria-label="Footer navigation">
          <Link href="/firm">The firm</Link>
          <Link href="/#expertise">Expertise</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <div className="footer-contact">
        <div>
          <span>Speak with Circulox</span>
          <a href={`mailto:${generalEmail}`}>{generalEmail}</a>
        </div>
        <div>
          <span>Our Address</span>
          <address>
            {ukAddress.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          International legal &amp; business advisory. Engagement scope and
          jurisdiction-specific requirements are considered for each matter.
        </p>
      </div>
    </footer>
  );
}
