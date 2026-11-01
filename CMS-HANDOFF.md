# Circulox publishing

## What the owner will do

1. Open `/studio` (or use **Editor sign in** in the website footer).
2. Sign in with an invited Sanity project account.
3. In **Authors**, add the actual author name and role.
4. In **Articles**, select **Create**, write the title and introduction, generate the web address, select an author/category, add tags and write the body.
5. Upload an optional cover or inline images, adding image descriptions and credits.
6. Use **Presentation** to preview the draft on the website. The preview is private and marked as a draft.
7. Review the publication date and SEO fields, then **Publish**. The article appears on Insights and, when recent, the homepage within about a minute.
8. Reopen an article to edit it; publish changes when ready. Select the **Published** version above the document, then **Unpublish → Unpublish now** to remove it from the public website. Keep the web address unchanged after publishing.

Only invited Sanity members can save or publish. Website visitors have no write endpoint. Author profiles are content attribution; editor membership is managed separately in Sanity.

## Connected workspace

Connected on 2 November 2026 to the user-approved existing project `jnpakmgy` (dashboard name: `test-app`) and public `production` dataset.

- Editor: https://circulox-preview.vercel.app/studio
- Project management: https://www.sanity.io/organizations/oP3n1gBns/project/jnpakmgy
- Signed-in administrator: Vishal Patil. The owner email is not yet available; no separate owner invitation has been sent. When provided, invite their own account through Members with an appropriate publishing role. Never share logins.
- Vercel production and ignored local environment contain the project ID, dataset and server-only Viewer token. No token is stored in Git or public environment variables.
- Exact production origin has credentialed CORS enabled. Existing localhost:3000 and localhost:3333 origins were retained. No wildcard origin was added.
- Studio is registered in the Sanity dashboard. Rebuild deployments after changing public configuration variables.

Publishing lifecycle verification is recorded in `.gstack/qa-reports/qa-report-circulox-preview-vercel-app-2026-11-02.md`. Verification completed with a temporary article and author; both were removed. Sign-in, draft save and privacy, authenticated preview, publish, public edit propagation and unpublish were exercised. Public reads use timed revalidation, so publication changes can take roughly one to two minutes and an additional request to appear.

## Publication rules

The public frontend uses the `published` perspective and excludes future dates. Draft reads require an authenticated preview cookie and a server-only Viewer token. Preview authorization uses `defineEnableDraftMode` from the official Sanity toolkit. Anonymous visitors cannot activate preview with a guessed query parameter.

Schemas require title, slug, introduction, author, category, body and publication date. Image descriptions are required when an image is added. Rich text links allow HTTP, HTTPS, mailto and relative paths; executable URL schemes are rejected in both editor validation and frontend rendering.

The old sample articles are not published automatically. No invented authors or client logos are seeded. Search indexing stays disabled for review; enable it only at final launch and remove the review-only noindex response header in `vercel.json`.
