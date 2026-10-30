import type { Metadata } from "next";
import { configured } from "@/sanity/env";
import Studio from "./studio";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Publishing | Circulox",
  robots: { index: false, follow: false },
};
export default function StudioPage() {
  if (!configured)
    return (
      <main className="setup-page">
        <p>Circulox · Publishing</p>
        <h1>Connect your publishing workspace.</h1>
        <p>
          The editor is built. A Circulox Sanity project must be connected
          before the team can sign in, save drafts or publish articles.
        </p>
        <p>
          Once connected, only invited project members can edit content. Website
          visitors cannot publish.
        </p>
        <a href="/">Return to the website</a>
      </main>
    );
  return (
    <div className="studio-shell">
      <Studio />
    </div>
  );
}
