# Circulox content integration

Integrated 4 November 2026 from the owner's `Circulox-developer-handoff` package.

## Pages

The 18 supplied drafts cover the homepage, firm, contact, eight services and seven jurisdictions. India was retained as the eighth jurisdiction and given a matching general-information page. The Insights publishing workflow, article templates, native X posts and 16 approved client logos remain in place.

Public copy is stored in `src/data/page-copy.json`; supporting navigation and explorer data retain the same route slugs. Page titles and descriptions come from the supplied search copy. Absolute metadata titles prevent Next.js from appending the brand twice.

## Editorial decisions

- Book a call is the primary homepage action and links to https://calendly.com/iptisha. Contact us is secondary. Detail pages have one booking action at their conclusion.
- Removed the identical onboarding paragraph repeated across the seven jurisdiction drafts and trimmed duplicated engagement caveats. The firm page explains provider coordination and group-chat communication.
- Preserved the warm palette, typography, header alignment, desktop bento and compact mobile bento. Expanded service and jurisdiction content uses open desktop editorial sections and native mobile disclosures.
- Rendered source citations as real links. Handoff labels, draft status, SEO fields, pending messaging channels and alternative mobile text are never displayed as extra copy.
- India remains linked from the homepage and incorporation page. Its added copy stays general and avoids invented fees, completion times, residency thresholds or licensing promises.
- Added the owner-supplied 50+ teams statement, info@circulox.org and iptisha@circulox.org, and the supplied UK address. The address is labelled only “UK address”.

## Publication boundaries

This content integration is editorial and technical verification, not professional legal sign-off. Key legal statements were spot-checked against primary guidance from FinCEN, Delaware, IRS, Companies House, ACRA, the UAE Ministry, BVI FSC, Cayman Registry and Seychelles FSA. Some referenced resources, including the MCA PDF and Cayman DITC endpoint, restricted or timed out automated access. The Seychelles consolidated legislation was not represented as a complete provision-by-provision review. India links to MCA's official incorporation resource without claiming a verified legal review date.

The owner's package still does not provide a legal entity number, complete registered-address particulars or team biographies. Those details were not invented. Empty WhatsApp/Telegram channels stay hidden. No client testimonials or unprovided article content were fabricated. Preview indexing settings remain unchanged.

## Verification

- Production build and TypeScript pass.
- Eight tests pass, including CMS filters and new content coverage/metadata checks.
- Gstack browsed 20 public routes at 320px and 1440px; no horizontal overflow or leaked draft labels.
- All 19 integrated page titles/descriptions match their content records, with one H1, one brand mention in the title, and correct canonical paths.
- Mobile scope/FAQ disclosures, India selection, hamburger/Escape focus restoration, and Insights dropdown interaction checked in the rendered production build.
- Contact-page booking styling corrected after visual QA.
