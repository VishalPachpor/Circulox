# Circulox

Next.js App Router website with an embedded Sanity publishing workspace. The original static approval prototype remains on `main`; this migration is developed on `codex/nextjs-cms`.

## Run locally

Requires Node.js 22.12+.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Visit http://localhost:3000. Without a configured Sanity project, public pages render, Insights shows a truthful empty state, and `/studio` explains the missing connection. No sample guides are treated as published articles.

```sh
npm test
npm run typecheck
npm run build
npm start
```

## Content management

Open `/studio` or `/admin`. Sanity handles invited-member authentication, article/author editing, drafts, images and publishing. The public frontend renders published content server-side; new changes appear within around a minute. Private draft preview uses the official Sanity handshake.

See [CMS-HANDOFF.md](CMS-HANDOFF.md) for owner instructions, project connection and the required real-account verification.

## Structure

- `src/app/(site)`: homepage, service and jurisdiction routes, Insights, firm and contact.
- `src/app/(studio)`: isolated CMS route.
- `src/components`: reusable layouts and React interactions.
- `src/sanity`: schema, environment configuration and server client.
- `src/lib/posts.ts`: published/draft content reads.
- `src/data`: existing service and jurisdiction content; sample articles remain unpublished.
- `public`: optimized source images.
- `src/styles`: scoped original design styles to preserve desktop and compact mobile treatments.
- `scripts/scope-styles.mjs`: regenerates scoped CSS from the design source styles.

Existing `.html` links redirect to clean Next.js routes. Static HTML files at the repository root are retained as the original design reference and are not used as the Next.js implementation.

## Deployment

Vercel configuration now targets Next.js on this branch. The approval site at https://circulox-preview.vercel.app remains on `main` until the migration is explicitly landed. Keep preview deployments noindex. Set the CMS variables and `NEXT_PUBLIC_SITE_URL` before creating the production deployment. No CMS secrets belong in Git.
