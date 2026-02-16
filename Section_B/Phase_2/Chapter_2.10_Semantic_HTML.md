# Phase 2.5 · Chapter 2.5.10: Semantic HTML and Landmarks

header, main, footer, nav, aside, section, article; ARIA landmarks; document outline and screen readers.

---

## Learning Objectives

- Use header, main, footer, nav, aside, section, article for page structure.
- Understand landmark roles and how they map to accessibility (banner, main, contentinfo, navigation, complementary).
- Prefer one main per page; use section and article to subdivide content.
- Relate structure to document outline and screen-reader navigation.

---

## 1) header, main, footer

- [Expand: <header>—intro for page or section (logo, nav); <main>—primary content, one per page; <footer>—end of page or section.]
- [Expand: main should not live inside article, aside, nav, header, footer.]
- [Expand: improves landmarks for assistive tech.]

---

## 2) nav and aside

- [Expand: <nav>—major navigation links; can have multiple (e.g. main nav, footer nav).]
- [Expand: <aside>—tangential content (sidebar, related links, ads).]
- [Expand: use when content is actually nav or tangential.]

---

## 3) section and article

- [Expand: <section>—thematic grouping with usually a heading; <article>—self-contained composition (blog post, card).]
- [Expand: article can nest in section and vice versa; use heading inside each.]
- [Expand: don’t use section as a generic wrapper—prefer div if no semantics.]

---

## 4) ARIA Landmarks and Document Outline

- [Expand: these elements expose landmarks (e.g. role="main" for main); screen readers can jump by landmark.]
- [Expand: document outline: heading hierarchy + sections; avoid skipping levels.]
- [Expand: homestead: header (nav), main (dashboard content), aside (alerts), footer (links).]

---

## Summary

- Use header, main, footer, nav, aside, section, article for meaning; one main; landmarks aid accessibility.
- Section and article subdivide content; keep heading hierarchy and outline logical.

---

## Bridge / Next

Next: **Chapter 2.5.11 — Div and Span**.

---

*Expansion note for ChatGPT: One page skeleton with landmarks. Target ~150 lines.*
