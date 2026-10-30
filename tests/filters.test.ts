import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost:3000",
});
for (const [key, value] of Object.entries({
  window: dom.window,
  self: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  HTMLElement: dom.window.HTMLElement,
  Node: dom.window.Node,
  getComputedStyle: dom.window.getComputedStyle,
}))
  Object.defineProperty(globalThis, key, { value, configurable: true });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
test("mobile dropdown selects with pointer, Escape restores focus, filters combine and reset", async () => {
  const { createElement } = await import("react");
  const { render, cleanup, within } = await import("@testing-library/react");
  const { default: userEvent } = await import("@testing-library/user-event");
  const { ArticleFilters } = await import("../src/components/article-filters");
  const user = userEvent.setup({ document: dom.window.document });
  const posts = [
    {
      _id: "one",
      slug: "one",
      title: "Company formation",
      excerpt: "Global entities",
      category: "Corporate structuring",
      tags: ["US"],
      publishedAt: "2026-01-01",
      author: { name: "Test Author" },
    },
    {
      _id: "two",
      slug: "two",
      title: "App review",
      excerpt: "Product compliance",
      category: "Technology compliance",
      tags: ["App Store"],
      publishedAt: "2026-01-02",
      author: { name: "Test Author" },
    },
  ];
  const view = render(createElement(ArticleFilters, { posts }));
  const trigger = document.querySelector<HTMLButtonElement>(
    "#article-category-trigger",
  )!;
  await user.click(trigger);
  assert.equal(trigger.getAttribute("aria-expanded"), "true");
  await user.click(
    within(
      document.querySelector("#article-category-options") as HTMLElement,
    ).getByRole("option", { name: "Corporate structuring" }),
  );
  assert.equal(trigger.textContent, "Corporate structuring");
  assert.equal(document.querySelectorAll(".journal-entry").length, 1);
  assert.equal(document.activeElement, trigger);
  await user.click(trigger);
  await user.keyboard("{End}{Enter}");
  assert.equal(trigger.textContent, "Technology compliance");
  assert.match(
    document.querySelector(".journal-entry")!.textContent!,
    /App review/,
  );
  const tag = document.querySelector<HTMLButtonElement>(
    "#article-tag-trigger",
  )!;
  await user.click(tag);
  await user.keyboard("{Escape}");
  assert.equal(tag.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, tag);
  await user.type(view.getByRole("searchbox"), "nothing matches");
  assert.equal(document.querySelectorAll(".journal-entry").length, 0);
  await user.click(view.getByRole("button", { name: "Clear filters" }));
  assert.equal(document.querySelectorAll(".journal-entry").length, 2);
  assert.equal(trigger.textContent, "All categories");
  await user.click(trigger);
  await user.click(view.getByRole("searchbox"));
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  cleanup();
});
