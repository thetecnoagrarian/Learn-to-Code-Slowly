# Phase 4 · Chapter 4.1: What CSS Is

Separation of structure and presentation. How CSS connects to HTML. Inline vs embedded vs external stylesheets. Why styling belongs in its own layer. Bridge to Phase 2 (HTTP delivers HTML + CSS).

---

## Learning Objectives

- Explain separation of structure (HTML) and presentation (CSS); why they are separate.
- Connect CSS to HTML: link rel="stylesheet", type="text/css"; or style attribute/tag.
- Compare inline (style=""), embedded (<style>), and external (.css file) and when to use each.
- Relate to Phase 2: CSS is another resource (GET request); Content-Type: text/css.

---

## 1) Structure vs Presentation

- [Expand: HTML = what it is (heading, list, link); CSS = how it looks (color, size, layout).]
- [Expand: same HTML can be styled differently (themes, print, accessibility); change look without changing structure.]
- [Expand: Bridge to Phase 2.5: HTML is the tree; CSS targets that tree with selectors.]

---

## 2) How CSS Connects to HTML

- [Expand: external: <link rel="stylesheet" href="styles.css"> in head; best for multiple pages.]
- [Expand: embedded: <style>...</style> in head; one-off or page-specific.]
- [Expand: inline: style="property: value"; avoid for maintainability; use for dynamic or email.]

---

## 3) Inline vs Embedded vs External

- [Expand: external: reusable, cacheable, one place to edit; preferred for apps.]
- [Expand: embedded: when one page needs unique styles; or critical above-the-fold.]
- [Expand: inline: last resort; overrides everything (specificity); hard to maintain.]

---

## 4) Bridge to Phase 2

- [Expand: browser requests HTML; HTML may reference CSS via link; separate GET for .css; Content-Type: text/css.]
- [Expand: multiple CSS files = multiple requests; balance with bundling later.]

---

## Summary

- CSS = presentation layer; HTML = structure; link/embed/inline; prefer external stylesheets.
- HTTP delivers CSS as a resource; separation allows reuse and different presentations.

---

## Bridge / Next

Next: **Chapter 4.2 — Selectors: Finding Elements**.

---

*Expansion note for ChatGPT: Expand each section; one small HTML + link example. Target ~150 lines.*
