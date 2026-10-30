# Next.js and owner publishing implementation

Preserve the approved public design. Work on codex/nextjs-cms; static approval site remains on main.

Architecture: Next.js App Router, TypeScript, server-rendered pages, small React interaction components. Shared detail template for eight services and eight jurisdictions. Clean URLs plus redirects from existing .html links. Scoped original CSS prevents homepage/inner-page style collisions.

Publishing: embedded Sanity Studio at /studio (also reachable from /admin), Sanity-managed member authentication, rich text, image uploads, authors, categories, tags, SEO fields, drafts, preview, publish/unpublish. Public server queries use published perspective and exclude future dates. Preview uses the official authenticated Draft Mode handshake and a server-only read token. No custom write endpoint or shared admin password. CMS project setup remains pending the user's account choice.

Failure handling: missing CMS configuration displays a truthful setup screen; published index empty state; unknown slugs 404; network errors use retry boundary rather than silently publishing sample content; unsafe link schemes rejected; draft mode responses noindex. Local examples remain draft-only and are not seeded as published documents.

Testing: typecheck and production build; unit tests for route/slug/link safety, published content and filters; gstack mobile/desktop evidence for home, service, jurisdiction, Insights, menu/filter interactions, unknown slug and CMS setup. Authenticated CMS create/draft/preview/publish/edit/unpublish flow requires the real Sanity project and owner login; do not claim that flow passed without it.

Performance: Studio code split outside public layout; CMS content fetched server-side, published reads revalidated every 60 seconds. Preview uncached. Use optimized hero/CMS images and existing typography. No entire-page client bundle.

## GSTACK REVIEW REPORT

| Review | Status | Findings |
| --- | --- | --- |
| Architecture | Account decision pending | Public reads and member writes separated; use official authenticated preview |
| Code quality | Implemented | Shared React components and typed content; no HTML iframe wrapper |
| Tests | Build and local checks pass | Build/typecheck, unit safety tests, browser regression, real CMS lifecycle after connection |
| Performance | Implemented | Server content, isolated Studio, image optimization, bounded cache |

VERDICT: Next.js build, typecheck, six automated tests and 63 rendered page checks pass. Outside review findings fixed: summary-only listing reads, noindex draft layouts and intrinsic CMS image dimensions. CMS provisioning and real owner publishing verification await account connection.

**UNRESOLVED DECISIONS:**
- Connect an existing Sanity project or create a new owner-controlled project.
