import { test } from "node:test";
import assert from "node:assert/strict";
import copy from "../src/data/page-copy.json";
import services from "../src/data/services.json";
import jurisdictions from "../src/data/explorer.json";

test("handoff content covers every public service and jurisdiction, including India", () => {
  for (const key of [
    ...Object.keys(services),
    ...jurisdictions.map((x) => x.key),
  ]) {
    const page = copy[key as keyof typeof copy];
    assert.ok(page, `Missing content: ${key}`);
    assert.ok(
      page.sections.some((x) =>
        /^(Service scope|Decisions before formation)$/.test(x.label),
      ),
    );
    assert.ok(page.sections.some((x) => x.label === "Questions"));
    assert.ok(page.sections.some((x) => /related expertise/i.test(x.label)));
  }
  const formationLinks = JSON.stringify(copy.formation.sections);
  for (const country of jurisdictions)
    assert.ok(formationLinks.includes(`/jurisdictions/${country.key}`));
});

test("page metadata is complete and unique and internal handoff labels stay out of public blocks", () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const [key, page] of Object.entries(copy)) {
    assert.ok(
      page.heading && page.intro && page.seo.title && page.seo.description,
      key,
    );
    assert.ok(!titles.has(page.seo.title), `Duplicate title: ${key}`);
    assert.ok(
      !descriptions.has(page.seo.description),
      `Duplicate description: ${key}`,
    );
    titles.add(page.seo.title);
    descriptions.add(page.seo.description);
    for (const section of page.sections)
      for (const block of section.blocks) {
        if ("text" in block)
          assert.doesNotMatch(
            block.text || "",
            /^(H[123]:|Button:|Route:|Working draft|SEO title:|Meta description:|Related links:|WhatsApp:|Telegram:|\[Keep)/,
          );
      }
  }
  assert.equal(titles.size, 19);
});
