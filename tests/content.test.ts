import { test } from "node:test";
import assert from "node:assert/strict";
import {
  imageDimensions,
  safeHref,
  validSlug,
  articleMatches,
  isPublicPost,
} from "../src/lib/content-utils";
test("links reject executable and protocol-relative schemes", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.example",
    null,
    "",
  ])
    assert.equal(safeHref(value), undefined);
  for (const value of [
    "https://circulox.org",
    "/services/formation",
    "mailto:team@example.com",
  ])
    assert.equal(safeHref(value), value);
});
test("article slugs cannot escape their route", () => {
  for (const value of [
    "../studio",
    "a/b",
    "A title",
    "-a",
    "a--b",
    "a-",
    "a".repeat(97),
  ])
    assert.equal(validSlug(value), false);
  assert.equal(validSlug("company-formation"), true);
});
test("public posts exclude drafts, missing dates and future dates", () => {
  const now = Date.parse("2026-10-30T00:00:00Z");
  assert.equal(
    isPublicPost({ _id: "drafts.one", publishedAt: "2026-01-01" }, now),
    false,
  );
  assert.equal(isPublicPost({ _id: "one" }, now), false);
  assert.equal(isPublicPost({ _id: "one", publishedAt: "bad" }, now), false);
  assert.equal(
    isPublicPost({ _id: "one", publishedAt: "2027-01-01" }, now),
    false,
  );
  assert.equal(
    isPublicPost({ _id: "one", publishedAt: "2026-01-01" }, now),
    true,
  );
});
test("filters combine search, category and topic without hiding all on reset", () => {
  const post = {
    title: "Company formation",
    excerpt: "Prepare an international structure",
    category: "Corporate structuring",
    tags: ["US", "Banking"],
  };
  assert.equal(
    articleMatches(post, "  BANKING ", "Corporate structuring", "US"),
    true,
  );
  assert.equal(articleMatches(post, "company", "Regulation", ""), false);
  assert.equal(articleMatches(post, "", "", "UK"), false);
  assert.equal(articleMatches(post, "", "", ""), true);
});

test("CMS image geometry preserves landscape, portrait and cropped ratios", () => {
  assert.deepEqual(imageDimensions("image-abc-2000x3000-jpg"), {
    width: 1400,
    height: 2100,
  });
  assert.deepEqual(imageDimensions("image-abc-800x800-png"), {
    width: 800,
    height: 800,
  });
  assert.deepEqual(
    imageDimensions("image-abc-2000x1000-jpg", { left: 0.25, right: 0.25 }),
    { width: 1000, height: 1000 },
  );
  assert.equal(imageDimensions("not-an-image"), null);
  assert.equal(imageDimensions("image-abc-0x0-jpg"), null);
});
