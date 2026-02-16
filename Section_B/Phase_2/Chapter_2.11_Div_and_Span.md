# Phase 2.5 · Chapter 2.5.11: Div and Span — Generic Containers

When to use div vs semantic elements; span for inline grouping; class and id; structure without semantics.

---

## Learning Objectives

- Use div when no semantic element fits; avoid div for everything.
- Use span for inline grouping (e.g. styling a phrase); no block semantics.
- Apply class and id for styling and scripting; id must be unique, class reusable.
- Prefer semantic elements first; fall back to div/span when structure has no meaning.

---

## 1) div — Block-Level Generic Container

- [Expand: <div> has no meaning; use for layout wrappers or grouping when section/article/nav don’t apply.]
- [Expand: block-level by default; often used with class for CSS/JS.]
- [Expand: don’t overuse: ask "is there a semantic element?" first.]

---

## 2) span — Inline Generic Container

- [Expand: <span> has no meaning; inline; use to group text for styling or scripting.]
- [Expand: example: highlighting a term with a class; wrapping a number for JS.]
- [Expand: don’t use for block-level grouping—use div or semantic block.]

---

## 3) class and id

- [Expand: class = reusable identifier; multiple elements can share; multiple classes per element (space-separated).]
- [Expand: id = unique in document; one element; used for anchors, ARIA, and JS.]
- [Expand: naming: descriptive, lowercase-with-hyphens; avoid presentational names.]

---

## 4) When to Prefer Semantic Elements

- [Expand: nav, main, article, section, header, footer, figure, etc. convey meaning and improve a11y.]
- [Expand: div/span when you need a hook for CSS/JS but no semantic element fits.]
- [Expand: "wrapper" or "container" div is fine when it’s purely layout.]

---

## Summary

- div = generic block; span = generic inline; use when no semantic element applies.
- class for reuse and styling; id for uniqueness and anchors; prefer semantics first.

---

## Bridge / Next

Next: **Chapter 2.5.12 — Attributes: class, id, data-*, ARIA**.

---

*Expansion note for ChatGPT: Short examples of div vs section, span for inline. Target ~150 lines.*
