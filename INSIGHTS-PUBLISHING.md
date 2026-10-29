# Insights and selected X posts

The blog lives on the Circulox website: insights/index.html and individual article URLs. It is not an external blog redirect. This is a static prototype; no CMS editor or publishing backend is connected yet.

Current sample articles are explicitly marked as draft previews and noindex. Do not treat them as published firm guidance. Editable content is in insights/posts.json, with slug, title, excerpt, category, tags, sections, status, author and publishedAt fields. Article and index HTML are currently rendered static files; changing JSON alone does not regenerate them.

Production integration should render these records through the chosen CMS with draft/published states, verified author and publication date, article metadata, sitemap entries and redirects. Only published articles should appear in the public index/homepage and sitemap. Draft previews must remain outside public indexing. CMS selection and connection remain pending.

Selected social posts are recorded in social-config.json. These are the three specific URLs supplied by the user, not an unmoderated profile feed or scraped quotations. Native X widgets load near the section; direct post links remain available if widgets fail. Desktop shows three columns. Phone uses a swipe row with Previous/Next controls and height matched to the active post. Twitter/X widgets are third-party content; their rate limits or availability can affect rendering.

## Current social presentation, v17
Supersedes the embed presentation above: user rejected large native widgets. Homepage now uses three compact topic previews, linked to the exact original posts. No tweet transcript or engagement counts are copied. One lead area with two supporting entries on desktop; lead plus two supporting columns on mobile. No external widget script loads.

## Personal tweet identity, v18 (current)
User explicitly prefers real tweets over editorial topic summaries. Restored native X posts, original words/avatar/handle/interactions. Use media-hidden embeds and tight unequal columns. Mobile uses readable single-tweet swipes with dynamic height. Do not convert these back to blog-like summaries when making them compact.
