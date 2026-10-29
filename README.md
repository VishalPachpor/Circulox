# Circulox

Premium international legal and business advisory website prototype.

## Run locally

```sh
python3 -m http.server 8765
```

Open http://localhost:8765/ in your browser. No build step or package installation is required.

## Structure

- `index.html`: homepage (also available as `finalized.html` for existing preview links).
- `services/`: eight service pages and shared service styles/content.
- `jurisdictions/`: eight jurisdiction pages and explorer data.
- `insights/`: article index, filters and draft articles.
- `inner-ui.css` and `site-ui.js`: responsive inner-page styling and interactions.
- `jurisdiction-explorer.js`: country selection.
- `social-feed.js`: native X post embeds.

## Publishing status

This is a static design prototype. Articles remain draft/noindex until reviewed and approved. A CMS and publishing backend are not connected. Client showcase placeholders require approved client identities before publication. Consultation links currently use the supplied Telegram destination. Fonts and X embeds require external network access.

See `INSIGHTS-PUBLISHING.md` for article publishing requirements.

## Client review deployment

Preview: https://circulox-preview.vercel.app

Vercel project: `circulox-preview`. The project is connected to this GitHub repository. `vercel.json` serves the static prototype and sets `X-Robots-Tag: noindex, nofollow, noarchive` for review. No custom domain is attached.

After client design approval, the production website can be built with Next.js.
