"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations } from "sanity/presentation";
import { schemaTypes } from "./src/sanity/schema";
import { projectId, dataset } from "./src/sanity/env";
export default defineConfig({
  name: "circulox",
  title: "Circulox · Publishing",
  projectId: projectId || "unconfigured",
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Publishing")
          .items([
            S.documentTypeListItem("post").title("Articles"),
            S.documentTypeListItem("author").title("Authors"),
          ]),
    }),
    presentationTool({
      previewUrl: {
        initial: "/insights",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
      resolve: {
        locations: {
          post: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    {
                      title: doc.title || "Article",
                      href: `/insights/${doc.slug}`,
                    },
                    { title: "Insights", href: "/insights" },
                  ]
                : [],
            }),
          }),
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
});
