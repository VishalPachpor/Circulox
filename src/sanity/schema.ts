import { defineArrayMember, defineField, defineType } from "sanity";
const author = defineType({
  name: "author",
  title: "Authors",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "role", title: "Role / title", type: "string" }),
    defineField({
      name: "image",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Image description", type: "string" }],
    }),
  ],
});
const post = defineType({
  name: "post",
  title: "Articles",
  type: "document",
  groups: [
    { name: "article", title: "Article", default: true },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Article title",
      type: "string",
      group: "article",
      validation: (r) => r.required().max(150),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "article",
      options: { source: "title", maxLength: 96 },
      description:
        "Generate once from the title. Keep it unchanged after publishing to preserve shared links.",
      validation: (r) =>
        r
          .required()
          .custom((value) =>
            !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
              ? true
              : "Use lowercase words separated by hyphens.",
          ),
    }),
    defineField({
      name: "excerpt",
      title: "Short introduction",
      type: "text",
      rows: 3,
      group: "article",
      description: "Shown on the homepage and Insights page.",
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "article",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "article",
      options: {
        list: [
          "Corporate structuring",
          "Regulation & fintech",
          "Technology compliance",
          "Governance & contracts",
          "Intellectual property",
          "Banking & tax",
          "Startup & investment",
          "Dispute resolution",
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      title: "Topics / tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "article",
      validation: (r) => r.unique().max(12),
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      group: "article",
      fields: [
        defineField({
          name: "alt",
          title: "Image description",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption / credit",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Article body",
      type: "array",
      group: "article",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  {
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (r) =>
                      r
                        .required()
                        .uri({
                          scheme: ["http", "https", "mailto"],
                          allowRelative: true,
                        }),
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Image description",
              type: "string",
              validation: (r) => r.required(),
            },
            { name: "caption", title: "Caption / credit", type: "string" },
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      group: "article",
      description:
        "Only articles that have been published and whose date has arrived appear publicly. Save as draft until reviewed.",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "Search title (optional)",
      type: "string",
      group: "seo",
      validation: (r) => r.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "Search description (optional)",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (r) => r.max(170),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "author.name", media: "cover" },
  },
  orderings: [
    {
      title: "Newest first",
      name: "dateDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
export const schemaTypes = [post, author];
