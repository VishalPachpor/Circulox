import Link from "next/link";
import { BrandLogo } from "./brand-logo";
export function Footer({ home = false }: { home?: boolean }) {
  return home ? (
    <footer className="footer shell">
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
      <div className="footer-bottom">
        <p>
          International legal &amp; business advisory. Engagement scope and
          jurisdiction-specific requirements are considered for each matter.
        </p>
      </div>
    </footer>
  ) : (
    <footer className="shell footer">
      <Link href="/" className="wordmark">
        <BrandLogo />
      </Link>
      <p>International legal &amp; business advisory.</p>
    </footer>
  );
}
