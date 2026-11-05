import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "./page";

test("home page renders HMS content and labeled navigation", () => {
  const markup = renderToStaticMarkup(createElement(HomePage));

  assert.match(markup, /<main/);
  assert.match(markup, /<nav aria-label="Main navigation">/);
  assert.match(markup, /Homestay Management System/);
  assert.match(markup, />HMS</);
});

test("home page and root layout remain Server Components", async () => {
  for (const file of ["page.tsx", "layout.tsx"]) {
    const source = await readFile(
      new URL(`./${file}`, import.meta.url),
      "utf8",
    );
    assert.doesNotMatch(source, /^\s*["']use client["'];/m);
  }
});
