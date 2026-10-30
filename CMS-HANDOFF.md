# Circulox publishing

## What the owner will do

1. Open `/studio` (or use **Editor sign in** in the website footer).
2. Sign in with an invited Sanity project account.
3. In **Authors**, add the actual author name and role.
4. In **Articles**, select **Create**, write the title and introduction, generate the web address, select an author/category, add tags and write the body.
5. Upload an optional cover or inline images, adding image descriptions and credits.
6. Use **Presentation** to preview the draft on the website. The preview is private and marked as a draft.
7. Review the publication date and SEO fields, then **Publish**. The article appears on Insights and, when recent, the homepage within about a minute.
8. Reopen an article to edit it; publish changes when ready. Use Sanity **Unpublish** to remove it from the public website. Keep the web address unchanged after publishing.

Only invited Sanity members can save or publish. Website visitors have no write endpoint. Author profiles are content attribution; editor membership is managed separately in Sanity.

## Connection still required

No Sanity project/account was supplied at implementation time. `/studio` truthfully shows a setup message until configured. The save/publish lifecycle cannot be verified before a real project is connected.

- Create/connect an owner-controlled Sanity project and a `production` dataset.
- Add localhost and the exact website deployment origin as CORS origins with credentials enabled. Avoid wildcard credential origins.
- Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and a **Viewer** token as server-only `SANITY_API_READ_TOKEN` in local/Vercel settings. Never use a public-prefixed token variable.
- Invite the owner and relevant team members through Sanity project management with the appropriate editor roles. Do not share a single login.
- Rebuild the Next.js deployment after setting public configuration variables.
- Verify owner login → create → draft hidden publicly → authenticated preview → publish → edit → unpublish using a real test article, then remove the test article.

## Publication rules

The public frontend uses the `published` perspective and excludes future dates. Draft reads require an authenticated preview cookie and a server-only Viewer token. Preview authorization uses `defineEnableDraftMode` from the official Sanity toolkit. Anonymous visitors cannot activate preview with a guessed query parameter.

Schemas require title, slug, introduction, author, category, body and publication date. Image descriptions are required when an image is added. Rich text links allow HTTP, HTTPS, mailto and relative paths; executable URL schemes are rejected in both editor validation and frontend rendering.

The old sample articles are not published automatically. No invented authors or client logos are seeded. Search indexing stays disabled for review; enable it only at final launch and remove the review-only noindex response header in `vercel.json`.
