import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Opening,
  About,
  Expertise,
  Conversation,
} from "@/components/home-sections";
import { Jurisdictions } from "@/components/jurisdictions";
import { SocialPosts } from "@/components/social-posts";
import { getPosts } from "@/lib/posts";
export const metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const posts = await getPosts(3);
  return (
    <div className="home-page">
      <Header home />
      <main id="main">
        <Opening />
        <About />
        <Expertise />
        <Jurisdictions />
        <section className="insights shell" id="insights">
          <div className="insights-heading">
            <div>
              <div className="section-label">Insights &amp; guides</div>
              <h2>Perspectives.</h2>
            </div>
            <Link className="link" href="/insights">
              Explore all insights
            </Link>
          </div>
          {posts.length ? (
            <div className="journal-home">
              {posts.slice(0, 3).map((post) => (
                <Link
                  className="journal-home-entry"
                  href={`/insights/${post.slug}`}
                  key={post._id}
                >
                  <div className="journal-home-meta">
                    {post.category}
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-insights">
              Legal and business perspectives from the Circulox team. New
              articles will appear here as they are published.
            </p>
          )}
        </section>
        <SocialPosts />
        <Conversation />
      </main>
      <Footer home />
    </div>
  );
}
