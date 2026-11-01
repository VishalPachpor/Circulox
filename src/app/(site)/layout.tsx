import "@/styles/home.css";
import "@/styles/inner.css";
import "@/styles/site-typography.css";
import { PreviewRefresh } from "@/components/preview-refresh";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
export async function generateMetadata() {
  const { isEnabled } = await draftMode();
  return isEnabled ? { robots: { index: false, follow: false } } : {};
}
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();
  return (
    <>
      {isEnabled && <PreviewRefresh />}
      {isEnabled && <VisualEditing />}
      {isEnabled && (
        <div className="preview-banner">
          <span>Private draft preview</span>
          <a href="/api/draft-mode/disable">Exit preview</a>
        </div>
      )}
      {children}
    </>
  );
}
