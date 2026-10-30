import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArticleFilters } from "@/components/article-filters";
import { getPosts } from "@/lib/posts";
export const metadata = {
  title: "Insights & guides",
  description:
    "Legal and business perspectives from Circulox on company formation, regulation, technology and international operations.",
  alternates: { canonical: "/insights" },
};
export default async function Insights() {
  const posts = await getPosts();
  return (
    <div className="inner-page">
      <Header />
      <main className="shell journal-main" id="main">
        <div className="journal-hero">
          <div className="eyebrow">Perspectives from Circulox</div>
          <h1>Insights &amp; guides.</h1>
          <p>
            Practical perspectives on establishing, operating and growing a
            business internationally.
          </p>
        </div>
        <ArticleFilters
          posts={posts.map(
            ({
              _id,
              slug,
              title,
              excerpt,
              category,
              tags,
              publishedAt,
              author,
            }) => ({
              _id,
              slug,
              title,
              excerpt,
              category,
              tags,
              publishedAt,
              author,
            }),
          )}
        />
      </main>
      <Footer />
    </div>
  );
}
