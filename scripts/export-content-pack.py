"""Export public copy and page-specific client writing briefs as portable HTML.

Run: python3 scripts/export-content-pack.py --base-url https://circulox-preview.vercel.app
Reads only public pages and repository content data. No CMS credentials required.
"""
import argparse
import concurrent.futures
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public/content-pack"
ZIP = ROOT / "public/downloads/circulox-content-pack.zip"
E = html.escape


class MainCopy(HTMLParser):
    """Keep public main text, exclude scripts, embedded posts and decorative SVGs."""
    def __init__(self):
        super().__init__()
        self.main = False
        self.skip = 0
        self.parts = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.main = True
        if not self.main:
            return
        hidden = (tag in {"script", "style", "svg", "iframe", "noscript"}
                  or attrs.get("aria-hidden") == "true"
                  or "srOnly" in attrs.get("class", ""))
        if tag not in {"img", "br", "input", "source", "hr", "meta", "link", "wbr"}:
            self.stack.append((tag, hidden))
            if hidden:
                self.skip += 1
        if not self.skip and tag in {"h1", "h2", "h3", "p", "li", "section", "div", "br", "summary", "a", "button", "label", "span"}:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if not self.main:
            return
        if tag == "main":
            self.main = False
        if self.stack and self.stack[-1][0] == tag:
            _, hidden = self.stack.pop()
            if hidden:
                self.skip -= 1
        if not self.skip and tag in {"h1", "h2", "h3", "p", "li", "section", "div", "summary", "a", "button", "label", "span"}:
            self.parts.append("\n")

    def handle_data(self, data):
        if self.main and not self.skip:
            self.parts.append(data)

    def text(self):
        lines = [re.sub(r"\s+", " ", s).strip() for s in "".join(self.parts).splitlines()]
        return "\n".join(line for i, line in enumerate(lines) if line and (i == 0 or line != lines[i-1]))


RULES = """Write for Circulox, an international legal and business advisory firm serving startups, fintech, Web3 and established enterprises. The business goal is a relevant consultation, reached through clear information and credible evidence. Use calm, specific English, short paragraphs and useful headings. Keep the premium editorial tone; avoid hype, generic slogans, emojis, repeated contact buttons and keyword stuffing.
Separate supplied facts from proposed wording. Existing website copy is a draft, not independent proof of a legal rule or an achievement. Never invent offices, admissions, team qualifications, client engagements, case results, testimonials, success rates, years in business, partnerships, turnaround times, prices, tax benefits or guaranteed approvals. Client logos are approved for display; they do not establish the scope or outcome of any engagement. Do not generate endorsements from that list.
For current laws, filing requirements, licensing, tax, costs or deadlines, use dated primary official sources and identify the relevant jurisdiction. If browsing or confirmation is unavailable, use [LEGAL REVIEW REQUIRED: question] instead of guessing. Separate legal requirements from Circulox's own process. Do not imply that incorporation authorises regulated activity or guarantees a bank account. Flag material claims for the firm's legal review.
Use only one primary booking destination: https://calendly.com/iptisha. Email alternative: iptisha@circulox.org. Do not call the consultation free or promise a response time without approval. Do not create login, editor or admin navigation in public copy. Keep substantive detail useful on desktop, with a concise summary first for phone readers. Put longer secondary material in FAQs or future guides; do not turn every section into a list."""

SERVICES = {
    "formation": {
        "intent": "A founder needs to choose where and how to register a company, not buy an unexplained incorporation package.",
        "angle": "Explain jurisdiction selection before filing: activity, founder residence, customer markets, investors, banking and group ownership.",
        "topics": ["Distinguish operating companies, holding companies and special-purpose vehicles in plain language.", "Explain the advisory-to-formation handoff, the documents produced and post-formation support, only after the owner confirms the scope.", "Give a decision framework for the eight supported jurisdictions, with links to their individual guides rather than a universal 'best country'."],
        "questions": ["Which entity types and countries do you actually handle, directly or through local providers?", "What is included after registration, and what is separately quoted?", "Can you provide an approved anonymised example of how a structure was selected?"],
        "faqs": ["How do you help us choose a jurisdiction?", "Can non-resident founders engage you?", "What documents should we prepare?", "Are banking and tax advice included?", "Can you restructure an existing company?"],
        "keyword": "international company formation and structuring",
    },
    "regulation": {
        "intent": "A product founder or compliance lead needs to understand regulatory exposure before launching or expanding.",
        "angle": "Start with product mechanics, custody, asset flows, customer locations and the exact regulatory question.",
        "topics": ["Differentiate a regulatory assessment, a legal opinion, licensing support and ongoing compliance work.", "Describe DeFi, exchanges, derivatives and prediction markets as matters to assess, without claiming that all models are lawful in all markets.", "Explain what an AML/KYC engagement can deliver and what the client's compliance team remains responsible for."],
        "questions": ["Which regulators, licences and jurisdictions are within your confirmed experience?", "Do you prepare applications, provide opinions, coordinate local counsel, or a combination?", "What facts and reliance limits are needed before you issue a legal opinion?"],
        "faqs": ["When should we seek a regulatory assessment?", "What does a legal opinion cover?", "Can you assist with VASP licensing?", "What product and asset-flow information do you need?", "Can you support an already launched product?"],
        "keyword": "Web3 crypto and fintech regulatory advisory",
    },
    "platform": {
        "intent": "An app founder has a rejection or wants a financial product ready for platform review.",
        "angle": "Make the two entry paths explicit: pre-submission compliance review and support following an App Store or Google Play rejection.",
        "topics": ["Describe how the rejection notice, product features, financial flows and legal entity are assessed together.", "Explain possible outputs such as a policy assessment or appeal support only where confirmed by the owner.", "Distinguish platform policy review from licensing advice. App approval remains the platform's decision."],
        "questions": ["Which financial app categories do you support?", "What do clients receive during a pre-submission review versus a rejection appeal?", "Can approved case examples show the problem addressed without promising approval?"],
        "faqs": ["Can you review an app before submission?", "What should I send after a rejection?", "Do you work with both Apple and Google?", "Can product changes be needed as well as an appeal?", "Can you guarantee approval?"],
        "keyword": "App Store and Google Play compliance advisory",
    },
    "governance": {
        "intent": "An operator needs corporate changes or reliable documents for a real business decision.",
        "angle": "Organise the page by the triggering task: company changes, shareholder arrangements, commercial contracts and customer terms.",
        "topics": ["Separate drafting, reviewing and negotiating agreements; confirm which are provided.", "Explain how board/shareholder decisions and corporate records fit together, without implying identical filing rules everywhere.", "Show how ongoing governance support differs from a one-off document engagement."],
        "questions": ["Which documents do you draft, review or negotiate?", "Do engagements include filings and maintenance, or only advice/documentation?", "What turnaround and revision process can be stated accurately?"],
        "faqs": ["Can you review an existing contract?", "Do you support director or shareholder changes?", "Can one engagement cover several group companies?", "What documents are needed before drafting?", "Is ongoing support available?"],
        "keyword": "corporate governance and commercial legal documentation",
    },
    "banking": {
        "intent": "A founder needs workable banking, payment arrangements or coordinated tax advice for a cross-border business.",
        "angle": "Separate banking/onboarding, payment flows and tax work so visitors can identify the relevant problem quickly.",
        "topics": ["Describe onboarding documentation and assistance without suggesting that Circulox controls bank or gateway decisions.", "Explain the assessment of customer countries, currencies, transaction flows and product activities.", "State the exact tax advisory/compliance boundary and when a local tax professional is involved; avoid generic offshore tax promises."],
        "questions": ["What is the confirmed role in banking introductions and application preparation?", "Which payment products and markets are supported?", "Who delivers tax advice and filing work, and in which jurisdictions?"],
        "faqs": ["Can you help prepare a banking application?", "Is account approval guaranteed?", "Can you support cross-border payment structures?", "What transaction-flow information is useful?", "How is tax work scoped?"],
        "keyword": "cross-border banking payments and tax advisory",
    },
    "startup": {
        "intent": "A founder is preparing a round or aligning equity, investor terms and company structure.",
        "angle": "Begin with the funding stage and transaction, then connect the documents to ownership and governance.",
        "topics": ["Describe fundraising documents, equity structuring and investment vehicles as separate workstreams.", "Explain SAFE and SAFT at a high level with a legal-review flag for suitability; do not present them as universally interchangeable.", "Show the information required before advising: cap table, current agreements, investor terms and company jurisdictions."],
        "questions": ["Which round stages, instruments and jurisdictions do you handle?", "Do you negotiate investor documents or support only drafting/review?", "What continuing legal support is available after a round?"],
        "faqs": ["When should legal work start during a fundraise?", "Can you review a SAFE or SAFT?", "Can you help with an existing cap table?", "Can the round involve overseas investors?", "Is continuing startup support available?"],
        "keyword": "startup fundraising and investment legal advisory",
    },
    "ip": {
        "intent": "A founder needs to protect a brand or clarify ownership and commercial use of IP.",
        "angle": "Separate trademark registration, copyright/brand protection and IP ownership or licensing agreements.",
        "topics": ["Explain that the protection needed depends on the asset, market and ownership; avoid calling a filing 'global protection'.", "Describe clearance, filing, examination or objection support only if the owner confirms these stages are included.", "Connect founder, employee and contractor IP ownership to agreements; avoid offering an unsupported guarantee of registration."],
        "questions": ["Which jurisdictions and filing stages do you cover?", "Are searches, objections, oppositions and renewals within scope or separate?", "Do you handle assignments and licensing agreements as well as trademark work?"],
        "faqs": ["Which markets should a trademark application cover?", "What brand information do you need?", "Can you review existing IP ownership agreements?", "Can you help with a trademark objection?", "Does filing guarantee registration?"],
        "keyword": "trademark brand protection and IP agreements",
    },
    "disputes": {
        "intent": "An operator has received a notice, encountered a platform dispute or needs advice before escalation.",
        "angle": "Prioritise the issue, documents, deadlines and desired outcome; describe a measured assessment before action.",
        "topics": ["Differentiate drafting a notice, responding to a notice, platform disputes and pre-litigation advice.", "Clarify the firm's representation boundary and whether court proceedings require separately engaged local counsel.", "Explain how to prepare a chronology and preserve correspondence. Do not offer a public upload of confidential documents or promise a recovery."],
        "questions": ["Which forums and jurisdictions can you act in, and in what capacity?", "Does the scope include court proceedings, negotiation, or pre-litigation work only?", "How should a client flag a real deadline without assuming emergency availability?"],
        "faqs": ["What should I do before an initial discussion?", "Can you help respond to a legal notice?", "Do you handle platform disputes?", "Does this include court representation?", "How should I flag a deadline?"],
        "keyword": "legal notices and business dispute advisory",
    },
}

COUNTRIES = {
    "united-states": ["US entity and state selection, including how investor expectations and intended activity affect the discussion.", "Federal, state and ongoing reporting topics to verify, including the current applicability of beneficial-ownership reporting.", "Non-resident founder documentation, tax-adviser coordination and banking application requirements to confirm."],
    "united-kingdom": ["Company type, ownership and intended UK versus overseas operations.", "Companies House registration, identity verification, ownership disclosures and ongoing filing topics to verify against current official guidance.", "Registered-office, officer, tax and banking arrangements: confirm responsibilities and actual engagement scope."],
    "uae": ["How activity and operating location inform mainland, free-zone or other formation routes; do not claim to handle every route.", "The distinction between incorporation, a commercial activity licence and any financial regulatory permission.", "Ownership, physical presence, visa needs, tax-adviser coordination and banking: confirm applicability instead of promising benefits."],
    "singapore": ["Company form and the role of Singapore in the intended regional or international group.", "ACRA registration, officers, address, ownership records and continuing obligations: verify current requirements.", "Local service-provider responsibilities, operational footprint, tax coordination and banking preparation."],
    "india": ["Entity and equity choices for domestic operations or a cross-border group.", "MCA formation and corporate compliance topics, with any foreign investment or FEMA issues reviewed against current official rules.", "Director/owner documentation, tax registrations and post-formation work: confirm what Circulox and local providers deliver."],
    "bvi": ["The purpose of an operating, holding or special-purpose company; distinguish formation from regulated financial activity.", "Entity choice, registered-agent support, ownership records, reporting and substance topics to verify from current official sources.", "Group ownership, governance documents and bank due diligence; no anonymous-company or zero-tax promises."],
    "cayman": ["Holding, investment and special-purpose structures, tied to the actual business or investor objective.", "Confirm which entity or investment-vehicle types Circulox supports and when financial regulatory review is separate.", "Registered-office/provider roles, ownership, substance, reporting and ongoing governance topics to verify."],
    "seychelles": ["The intended activity and role of the company within the wider group; confirm supported entity types.", "Registered-agent arrangements, ownership records, reporting and substance topics to verify from current official guidance.", "Distinguish company formation from regulated activity and explain banking documentation without secrecy or tax guarantees."],
}

GENERAL = {
    "home": {
        "title": "Homepage", "route": "/", "intent": "A founder arrives, recognises their legal need, sees credible evidence and knows how to arrange a relevant call.",
        "angle": "Preserve the approved editorial hierarchy. Make service fit, actual expertise and the next step clear within the opening screen.",
        "sections": [
            ("Opening", "One plain-language H1, a 35–50 word introduction and the existing primary/secondary actions. Explain the firm and who it serves before asking for a call."),
            ("Selected clients", "Keep the approved moving logos. Supply any desired heading and one restrained context sentence; no invented engagement details or testimonials."),
            ("The firm", "A 60–90 word statement of the firm's actual approach and scope. Replace generic claims with one or two owner-confirmed distinctions."),
            ("Our expertise", "Keep the four current groups and all eight service links. Supply a 20–30 word explanation for each group, using the visitor's problem rather than internal legal jargon."),
            ("Jurisdiction advisory", "Explain the decision factors in 35–50 words. Review all eight country summaries and their three discussion topics. Link to the country pages, not another booking action."),
            ("Insights & guides", "Provide one short editorial introduction. Only published, reviewed articles appear; do not invent article cards to fill the layout."),
            ("From X", "Keep the three owner-selected native posts and the @iptishax profile link. Suggest a short section introduction only if useful; do not rewrite tweets as the firm's claims."),
            ("Consultation", "One final booking action, a 30–45 word description of what to share and any owner-confirmed expectation about the call."),
        ],
        "questions": ["What two or three verifiable aspects of the firm's approach distinguish it?", "Are any client case summaries separately approved for public use?", "Who normally handles the first call, and what can be accurately said about its purpose?"],
        "faqs": [], "keyword": "international legal and business advisory",
        "links": ["/services/formation", "/services/regulation", "/firm", "/insights", "/contact"],
        "length": "Approximately 450–650 words across the whole page; respect the short budgets for individual homepage sections.",
    },
    "firm": {
        "title": "The firm", "route": "/firm", "intent": "A prospective client checks who is behind the advice and whether the firm is credible for their situation.",
        "angle": "This page needs real people, confirmed credentials and a concrete engagement approach. The current page has an approach section but no actual team biographies.",
        "sections": [
            ("Opening", "Explain the firm and the business problems it addresses in 50–80 words; avoid duplicating the homepage introduction verbatim."),
            ("How we work", "Describe the owner's real process for understanding a matter, defining scope, involving specialists and communicating advice. Mark unconfirmed steps."),
            ("Team — proposed addition", "Request approved names, roles, portraits, biographies, qualifications and relevant jurisdictional admissions. Write 80–120 words per confirmed person. This is missing content, not an existing populated team section."),
            ("Cross-border delivery", "Explain directly delivered work versus coordination with external/local advisers, only as confirmed. Do not imply offices or admissions in each country."),
            ("Evidence and next step", "Use approved matter examples or credentials if supplied. Link naturally to relevant expertise and Contact; do not invent awards or numbers."),
        ],
        "questions": ["What legal entity and professional status should be disclosed?", "Who may be named, and what qualifications/admissions can be verified?", "How is local advice obtained where needed?", "What real examples or distinctions are approved for publication?"],
        "faqs": [], "keyword": "about Circulox legal and business advisory", "links": ["/#expertise", "/contact"], "length": "Approximately 500–800 words, excluding optional individual biographies.",
    },
    "contact": {
        "title": "Contact", "route": "/contact", "intent": "An interested visitor wants a straightforward way to book a relevant conversation or send a short enquiry.",
        "angle": "Keep booking primary, email secondary and the preparation guidance brief. Do not repeat the same action after every paragraph.",
        "sections": [
            ("Opening", "A clear H1 and 35–60 words explaining what to share. Existing action: Book a consultation; alternative: iptisha@circulox.org."),
            ("Before we speak", "Three concise preparation points: business/activity, countries involved, main question and timing. Avoid asking for sensitive documents before an appropriate intake process."),
            ("What happens next — proposed copy", "Explain call purpose, participants, duration or fee only if the owner confirms each point. Avoid a guaranteed response time."),
            ("Enquiry form — future specification", "The current page has booking/email, not a submitted enquiry form. If requested, define name, work email, company, matter category, jurisdiction and brief message, plus truthful privacy/consent and success/error copy. Do not describe this as already implemented."),
        ],
        "questions": ["Is the call paid or free, and is any wording about this approved?", "What is the confirmed duration and who attends?", "What intake/confidentiality wording has the firm approved?", "Should a form be built later, and who will receive enquiries?"],
        "faqs": [], "keyword": "contact Circulox consultation", "links": ["/#expertise", "/firm"], "length": "Approximately 180–300 words; preparation guidance should fit a short phone screen.",
    },
    "insights": {
        "title": "Insights & guides", "route": "/insights", "intent": "A founder searches for a useful answer, checks the author's credibility and explores related legal support.",
        "angle": "Build a useful editorial hub rather than a page filled with promotional cards. The current public hub has no published articles.",
        "sections": [
            ("Editorial introduction", "A 35–55 word explanation of the questions covered and who the guidance is written for."),
            ("Discovery controls", "Review the existing labels Search insights, Categories and Topics. Categories/tags come from published content; do not promise options that do not exist yet."),
            ("Article summaries", "For each genuinely commissioned article, provide title, excerpt, author, category, tags and a clear question it answers. Proposed ideas must be labelled unpublished."),
            ("Empty and no-results states", "Keep truthful copy while there are no published articles. Distinguish no articles yet from a search returning no matches."),
            ("Initial editorial plan — proposal", "Propose 8–12 distinct articles tied to service and jurisdiction pages, with intent, outline, official research sources to consult and owner/reviewer needed. Do not fabricate finished articles or dates."),
        ],
        "questions": ["Who will author and legally review articles?", "Which subjects should be prioritised based on real client questions?", "What publishing and review cadence can the team maintain?"],
        "faqs": [], "keyword": "international business legal insights and guides", "links": ["/services/formation", "/services/regulation", "/services/platform"], "length": "Keep hub interface copy around 100–200 words; put the proposed editorial calendar in a separate table.",
    },
}

CSS = """*{box-sizing:border-box}body{margin:0;background:#f8f6f1;color:#3a302b;font:16px/1.65 system-ui,sans-serif}main{max-width:960px;margin:auto;padding:32px 36px 72px}header{border-bottom:1px solid #d8d0c6;padding-bottom:24px;margin-bottom:32px}h1,h2,h3{font-family:Georgia,serif;font-weight:400;line-height:1.2}h1{font-size:42px;margin:14px 0}h2{font-size:28px;margin:38px 0 16px}h3{font-size:21px}a{color:#934e3c;text-underline-offset:4px}p{max-width:78ch}li{margin:9px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;background:#eee8de;padding:22px;border-left:3px solid #934e3c}small,.meta{color:#71635a}.label{text-transform:uppercase;letter-spacing:.08em;font-size:12px}section{scroll-margin-top:20px}.note{border-left:3px solid #b29580;padding:8px 18px}table{width:100%;border-collapse:collapse}td,th{text-align:left;border-bottom:1px solid #d8d0c6;padding:12px;vertical-align:top}textarea{display:block;width:100%;min-height:120px;margin-top:14px;border:1px solid #b7aa9b;background:#fffdf9;padding:12px;font:inherit}nav a{margin-right:18px}code{overflow-wrap:anywhere}@media(max-width:600px){main{padding:24px 20px 48px}h1{font-size:31px}h2{font-size:25px}pre{padding:16px}td,th{padding:10px 5px;font-size:14px}}@media print{body{background:white}main{max-width:none;padding:0}nav{display:none}pre{background:#f4f2ee}h2,h3{break-after:avoid}a{color:inherit}}"""


def document(title, body):
    return f'<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>{E(title)} — Circulox content brief</title><style>{CSS}</style></head><body><main>{body}</main></body></html>\n'


def ul(items):
    return "<ul>" + "".join(f"<li>{E(x)}</li>" for x in items) + "</ul>"


def fetch_copy(base, route):
    request = urllib.request.Request(base + route, headers={"User-Agent": "Circulox-approved-content-export/1.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        source = response.read().decode("utf-8")
    parser = MainCopy()
    parser.feed(source)
    text = parser.text()
    if len(text) < 120:
        raise ValueError(f"No usable main copy on {route}")
    return text


def build_pages():
    pages = [dict(value, key=key, kind="Existing public page") for key, value in GENERAL.items()]
    services = json.loads((ROOT / "src/data/services.json").read_text())
    for key, data in services.items():
        brief = SERVICES[key]
        sections = [("Opening and service fit", brief["angle"] + " Write one H1 and a 50–80 word introduction identifying the visitor's problem and the confirmed support.")]
        sections += [(title, copy + " Expand only with owner-confirmed deliverables and useful decision context; approximately 60–100 words.") for title, copy in data["scope"]]
        sections += [("Engagement process — proposed addition", "Request the real steps from first discussion to delivery, client inputs, exclusions and responsibility boundaries. Write 3–4 short steps only after confirmation."), ("Before we speak", "Retain the three current preparation points; make each specific and concise. Do not request confidential documents in a public form."), ("Questions", "Answer 4–6 substantive questions, approximately 40–70 words each, avoiding repeated promotional sentences."), ("Related expertise and next step", "Use contextual related-service links and one final booking action. Do not add a contact button to every scope item.")]
        pages.append(dict(brief, key="service-"+key, kind="Existing service page", title=data["title"], route="/services/"+key, sections=sections, links=["/services/"+x for x in data.get("related", [])] + ["/contact"], length="Approximately 650–950 words of useful copy; provide a short 35–50 word mobile summary separately."))
    directory = json.loads((ROOT / "src/data/directory.json").read_text())
    for item in directory:
        key, name = item["slug"], item["name"]
        pages.append(dict(key="jurisdiction-"+key, title=name+" — formation & structuring", route="/jurisdictions/"+key, kind="Existing jurisdiction page", intent=f"A founder evaluating {name} needs to understand suitability, the decisions involved and what Circulox actually does.", angle="Replace interchangeable country copy with a practical, jurisdiction-specific decision guide. Correct the current 'formationin' spacing in the proposed H1 and improve country-name grammar. Current copy remains quoted unchanged below.", topics=COUNTRIES[key], sections=[("Opening and fit", f"A clear H1 and 60–90 words explaining the role of a {name} structure without claiming that the country is universally suitable."), ("When this jurisdiction may be relevant", "Use 2–3 carefully qualified scenarios grounded in verified facts. Include circumstances needing extra assessment rather than presenting only benefits."), ("Decisions before formation", "Address the jurisdiction-specific research questions below. Distinguish entity formation, licensing, tax and practical operating requirements."), ("Circulox scope and deliverables", "State exactly what the firm advises on, coordinates and delivers; identify any external provider roles and exclusions."), ("Documents and process", "Describe owner-confirmed client inputs and steps. State official requirements only after checking current primary sources. Leave unconfirmed cost and timing as questions."), ("After formation", "Explain ongoing corporate, tax, recordkeeping and operational topics that need assessment. Do not imply everything is included in the formation engagement."), ("Questions and next step", "Provide 4–6 country-specific FAQs and one final booking action. Link back to broader formation advice and relevant services.")], questions=[f"Which entity types and activities in {name} are actually supported?", "Which work is delivered directly and which uses local professionals/providers?", "What documents and outputs are included, and what recurring work is separately scoped?", "What fees, dependencies and timing ranges can be accurately stated and dated?", "Who will verify current legal requirements and official source references?"], faqs=[f"How do we assess whether {name} fits our business?", "Can founders based overseas be supported?", "What documents and decisions are needed?", "Is licensing separate from incorporation?", "What continuing obligations need to be considered?", "What is included in Circulox's engagement?"], keyword=f"company formation and structuring in {name}", links=["/services/formation", "/services/banking", "/services/governance"], length="Approximately 750–1,050 words, with a 40–60 word mobile summary. Use useful country detail, not repeated generic content."))
    pages.append(dict(key="article-template", title="Future article — writing template", route="/insights/[slug]", kind="Template only — not a published article", intent="A reader wants a clear answer to one specific business/legal question, supported by reviewed sources and a named author.", angle="Commission an original article, not a generic SEO essay. Choose one issue, one audience and the relevant jurisdiction(s). No sample article should be represented as published.", sections=[("Title and excerpt", "Title at most 150 characters; excerpt at most 280 characters. Answer the reader's question directly in the introduction."), ("Useful explanation", "Use H2/H3 sections with examples marked hypothetical. Explain applicability, decision factors, practical steps and limitations. Cite official sources for legal claims."), ("Author, dates and sources", "Request a real author, role, reviewer and approval date. Identify the law/source review date separately from the publication date; never invent a reviewer."), ("Search and related reading", "Provide one permitted CMS category, 3–6 useful tags, proposed slug and 2–3 relevant internal links. Search title at most 70 characters and search description at most 170."), ("Images", "If needed, propose a relevant image brief, accurate alt text and credit/permission information. Do not fabricate a case photo or author portrait."), ("Ending", "Use a helpful next step and the existing general-information note; add a service link when relevant rather than multiple booking buttons.")], topics=["CMS categories: Corporate structuring; Regulation & fintech; Technology compliance; Governance & contracts; Intellectual property; Banking & tax; Startup & investment; Dispute resolution.", "CMS fields: title, slug, excerpt, author, category, tags (at most 12), optional cover with alt/caption, body, publication date, optional SEO title and description."], questions=["What exact reader question should this article answer?", "Which jurisdiction and business model are in scope?", "Who is the author and who approves legal accuracy?", "Which current official sources and approved practical examples should be used?"], faqs=[], keyword="Choose a single topic-specific search intent; do not target every service.", links=["/insights", "/services/formation"], length="Usually 900–1,400 words where the question justifies it; shorter is appropriate for a focused update."))
    return pages


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", required=True, help="Public deployment to capture; never an authenticated CMS URL")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    pages = build_pages()
    copies = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(fetch_copy, base, p["route"]): p["key"] for p in pages if p["key"] != "article-template"}
        for future in concurrent.futures.as_completed(futures):
            copies[futures[future]] = future.result()
    DEST.mkdir(parents=True, exist_ok=True)
    (DEST / "pages").mkdir(exist_ok=True)
    files = {p["route"]: f'{i:02d}-{p["key"]}.html' for i, p in enumerate(pages, 1)}
    manifest = []
    for i, page in enumerate(pages, 1):
        current = copies.get(page["key"], "No current article copy: this file is a future writing template, not a published page.")
        if page["key"] == "home":
            explorer = json.loads((ROOT / "src/data/explorer.json").read_text())
            current += "\n\nOther current jurisdiction-tab copy (not all panels are shown at once):\n" + "\n\n".join(x["name"] + "\n" + x["intro"] + "\nMobile summary: " + x["mobileIntro"] + "\nTopics: " + "; ".join(x["focus"]) for x in explorer)
        topics = page.get("topics", [])
        prompts = "\n".join(f'{n}. {title}: {copy}' for n, (title, copy) in enumerate(page["sections"], 1))
        prompt = f"""{RULES}

PAGE: {page['title']}
ROUTE: {page['route']}
STATUS: {page['kind']}
READER NEED: {page['intent']}
EDITORIAL DIRECTION: {page['angle']}
SUGGESTED LENGTH: {page['length']} This is guidance, not a keyword or word-count target.
SEARCH INTENT: {page['keyword']}

SECTION-BY-SECTION BRIEF:
{prompts}

SPECIFIC POINTS TO ADDRESS:
{chr(10).join('- '+x for x in topics)}

OWNER QUESTIONS:
{chr(10).join('- '+x for x in page['questions'])}

FAQ TOPICS TO CONSIDER:
{chr(10).join('- '+x for x in page['faqs']) or 'Do not add FAQs unless useful for this page.'}

EXISTING COPY — REFERENCE DRAFT, NOT PROOF OF FACTS:
{current}

OWNER ANSWERS / APPROVED FACTS:
[Paste the owner's answers and approved evidence here. If missing, ask the owner the specific unanswered questions before finalising factual claims.]

RETURN:
1. Missing facts requiring owner input, and the claims requiring legal review.
2. Proposed final copy in the section order above, with clear section IDs and heading levels. Keep unknown facts as [OWNER TO CONFIRM: ...]; do not fill them with plausible claims.
3. A concise mobile introduction; substantive facts must agree with the full copy.
4. Suggested SEO title (at most 70 characters), meta description (at most 170), one H1 and contextual internal links using existing routes: {', '.join(page['links'])}.
5. Source list with URLs, jurisdiction and date checked for every current legal/rate/filing claim. If you cannot research, mark the relevant claim for legal review and do not state it as fact.
6. A final owner approval checklist. Suggestions for new sections or features must be clearly separate from existing functionality.
Do not return HTML/CSS, a website redesign or a developer implementation plan. Return usable page content for client review."""
        body = f'<header><nav><a href="../index.html">All page briefs</a><a href="#gpt">GPT prompt</a><a href="#current">Current copy</a></nav><p class="label">Circulox · Client content workbook · {i:02d} / {len(pages)}</p><h1>{E(page["title"])}</h1><p class="meta">{E(page["kind"])} · <code>{E(page["route"])}</code></p></header>'
        body += '<p class="note">This is a writing brief, not a redesign or approved legal advice. Proposed additions are requests for content, not features or services already confirmed.</p>'
        body += f'<section><h2>1. What this page needs to do</h2><p>{E(page["intent"])}</p><p>{E(page["angle"])}</p><p><strong>Length guidance:</strong> {E(page["length"])}</p></section>'
        body += '<section><h2>2. Content to develop, section by section</h2>' + ''.join(f'<h3>{n}. {E(title)}</h3><p>{E(copy)}</p>' for n, (title, copy) in enumerate(page["sections"], 1)) + '</section>'
        if topics:
            body += '<section><h2>Page-specific points to address</h2>' + ul(topics) + '</section>'
        body += '<section><h2>3. Questions for the owner</h2>' + ul(page["questions"]) + '<p>Record answers in a separate document or paste them into the prompt below. This HTML is a portable reference file; it does not save edits.</p></section>'
        if page["faqs"]:
            body += '<section><h2>Useful FAQ questions</h2>' + ul(page["faqs"]) + '</section>'
        body += f'<section><h2>4. Search and internal links</h2><p><strong>Suggested intent:</strong> {E(page["keyword"])}. This is an editorial suggestion, not researched keyword-volume data.</p><p>Keep the existing route. Provide one H1, useful H2s, a distinct search title and description. Do not repeat country pages with only the country name changed.</p><ul>'
        for route in page["links"]:
            href = files.get(route)
            body += f'<li><a href="{E(href)}">{E(route)} brief</a></li>' if href else f'<li><code>{E(route)}</code></li>'
        body += '</ul></section>'
        body += f'<section id="current"><h2>5. Current public copy</h2><p class="meta">Captured from {E(base + page["route"])} on 2 November 2026. Main page text only; shared header/footer omitted. Responsive wording may appear in both variants. Third-party post bodies are not copied. For the article template, no published copy exists.</p><pre>{E(current)}</pre></section>'
        body += f'<section id="gpt"><h2>6. Ready-to-use GPT prompt</h2><p>Upload this HTML file to GPT, or copy the full prompt below. Add the owner’s answers before requesting final copy.</p><pre>{E(prompt)}</pre></section>'
        body += '<section><h2>7. Approval checklist</h2>' + ul(["The page answers the intended visitor's question before asking for a call.", "The owner has confirmed deliverables, exclusions, people, evidence and any process claims.", "All current legal, licensing, tax, price and timing claims have official sources and the firm's review.", "No invented offices, credentials, testimonials, guarantees or client engagement details appear.", "There is a single primary booking destination; related links help the reader explore the actual site.", "The introduction is concise for mobile; additional detail has a purpose and does not repeat other pages."]) + '</section>'
        filename = files[page["route"]]
        (DEST / "pages" / filename).write_text(document(page["title"], body), encoding="utf-8")
        manifest.append({"file": "pages/"+filename, "title": page["title"], "route": page["route"], "status": page["kind"]})
    approved_clients = json.loads((ROOT / "src/data/clients.json").read_text())
    client_names = [x["name"] for x in approved_clients]
    shared = '<h2>Shared site context</h2><p>Circulox is an international legal and business advisory firm working with startups, fintech companies, Web3 businesses and established enterprises on legal, regulatory, corporate and operational matters.</p><p>Primary booking: <a href="https://calendly.com/iptisha">calendly.com/iptisha</a>. Email: <a href="mailto:iptisha@circulox.org">iptisha@circulox.org</a>. X: <a href="https://x.com/iptishax">@iptishax</a>.</p><p><strong>Approved client showcase names:</strong> ' + E(', '.join(client_names)) + '. Airaa appears once. Logo permission does not permit inventing project details, results or testimonials.</p><h3>Shared header and footer copy</h3><p>Navigation: Expertise · Jurisdictions · Insights · The firm · Contact. Inner desktop navigation also uses All expertise. Footer: “International legal &amp; business advisory. Engagement scope and jurisdiction-specific requirements are considered for each matter.” The public site has no editor sign-in link.</p>'
    body = '<header><p class="label">Circulox · Content handoff</p><h1>Page-by-page content workbook</h1><p>20 existing public pages + 1 future article template. Each HTML file opens independently, includes the current draft copy and contains a tailored prompt for GPT.</p></header><h2>How to use this pack</h2><ol><li>Choose a page below and upload that HTML file to GPT. You can also copy its complete prompt.</li><li>Answer the owner questions and ask GPT to draft content section by section. Unknown facts must remain marked for confirmation.</li><li>Return the reviewed copy with its page route and section IDs. The Circulox owner approves business facts and the appropriate reviewer approves legal claims before publishing.</li></ol><p>The files work offline without fonts, images, scripts or a login. Browser print/save as PDF also works. These are content briefs, not editable CMS pages; no draft changes are saved in the HTML.</p><p>Scope follows the current site. The Firm brief includes a proposed team section; there is no separate populated Team page. Privacy, terms and any future pages need separately approved briefs. The article file is a reusable writing template, not an existing published article.</p>' + shared
    body += '<h2>Page index</h2><table><thead><tr><th>Page</th><th>Current route / status</th></tr></thead><tbody>' + ''.join(f'<tr><td><a href="{E(p["file"])}">{i:02d}. {E(p["title"])}</a></td><td>{E(p["route"])}<br><small>{E(p["status"])}</small></td></tr>' for i, p in enumerate(manifest, 1)) + '</tbody></table><h2>Master writing rules</h2><pre>' + E(RULES) + '</pre><p>Prepared 2 November 2026 from the current public preview. These are suggested content requirements, not a claim that proposed features or every described engagement process have been implemented.</p>'
    (DEST / "index.html").write_text(document("Page-by-page workbook", body), encoding="utf-8")
    (DEST / "MASTER-PROMPT.txt").write_text(RULES + "\n\nUse the selected page HTML for its exact brief, current copy, owner questions and output format. Work on one page at a time.\n", encoding="utf-8")
    (DEST / "manifest.json").write_text(json.dumps({"created": "2026-11-02", "source": base, "existingPages": 20, "templates": 1, "pages": manifest}, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    # Validate local links before producing the archive. External sources are reference URLs.
    for path in DEST.rglob("*.html"):
        text = path.read_text()
        assert '<meta charset="utf-8">' in text and '<script' not in text
        for href in re.findall(r'href="([^"]+)"', text):
            if href.startswith(("https:", "mailto:", "#")):
                continue
            assert (path.parent / href.split("#")[0]).resolve().is_file(), (path, href)
    assert len(manifest) == 21 and len(copies) == 20
    ZIP.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(DEST.rglob("*")):
            if path.is_file():
                archive.write(path, "Circulox-content-pack/"+str(path.relative_to(DEST)))
    with zipfile.ZipFile(ZIP) as archive:
        assert archive.testzip() is None
        print(f"Exported {len(manifest)} HTML briefs + index/master prompt/manifest; {len(archive.namelist())} files, {ZIP.stat().st_size:,} bytes. All local links and archive integrity passed.")


if __name__ == "__main__":
    main()
