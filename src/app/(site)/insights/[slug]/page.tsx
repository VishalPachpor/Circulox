import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PostBody, ContentImage } from "@/components/post-body";
import { getPost } from "@/lib/posts";
import { siteUrl, indexable } from "@/lib/site";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const { isEnabled } = await draftMode();
  return post
    ? {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        robots: {
          index: indexable && !isEnabled,
          follow: indexable && !isEnabled,
        },
        alternates: { canonical: `/insights/${slug}` },
        openGraph: {
          type: "article",
          title: post.title,
          description: post.excerpt,
          publishedTime: post.publishedAt,
          authors: post.author?.name ? [post.author.name] : [],
        },
      }
    : { title: "Article not found", robots: { index: false, follow: false } };
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const { isEnabled } = await draftMode();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    publisher: { "@type": "Organization", name: "Circulox" },
    mainEntityOfPage: `${siteUrl}/insights/${slug}`,
  };
  return (
    <div className="inner-page">
      <Header />
      <main className="shell article-main" id="main">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/insights">Insights</Link>
        </nav>
        <header className="article-heading">
          <div className="eyebrow">{post.category}</div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="article-meta">
            {post.author?.name && <span>{post.author.name}</span>}
            <span>
              {isEnabled
                ? "Private draft preview"
                : new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
            </span>
          </div>
        </header>
        {post.cover && <ContentImage value={post.cover} />}
        <div className="article-body">
          <PostBody body={post.body} />
          <aside className="article-note">
            This article provides general information. Advice for a particular
            business depends on its facts and relevant jurisdictions.
          </aside>
          <Link className="text-link" href="/insights">
            All insights
          </Link>
        </div>
      </main>
      <Footer />
      {!isEnabled && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </div>
  );
}
