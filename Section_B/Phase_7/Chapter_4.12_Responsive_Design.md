# Phase 4 · Chapter 4.12: Responsive Design and Media Queries

Breakpoints. Mobile-first vs desktop-first. Viewport meta tag. Making your dashboard usable on phone and desktop.

---

## Learning Objectives

- Use media queries: @media (min-width: 768px) { }; choose breakpoints by content, not devices.
- Apply mobile-first: base styles for small screen; min-width media queries add layout for larger.
- Ensure viewport meta tag (width=device-width, initial-scale=1) so media queries work on mobile.
- Adapt dashboard: stack on small screens; grid or multi-column on large.

---

## 1) Media Queries

- [Expand: @media (min-width: 600px) { ... } for "when at least 600px wide"; max-width for "when at most."]
- [Expand: prefer min-width (mobile-first); combine: (min-width: 600px) and (max-width: 1024px).]
- [Expand: use rem or em in media queries for consistency with zoom.]

---

## 2) Mobile-First vs Desktop-First

- [Expand: mobile-first: base = mobile; @media (min-width: ...) add or override for larger.]
- [Expand: desktop-first: base = desktop; @media (max-width: ...) override for smaller.]
- [Expand: mobile-first usually less override code; content-first breakpoints.]

---

## 3) Viewport Meta Tag

- [Expand: <meta name="viewport" content="width=device-width, initial-scale=1"> in HTML head.]
- [Expand: without it, mobile browsers may zoom out; layout and media queries can be wrong.]
- [Expand: Phase 2.5: already in document structure.]

---

## 4) Responsive Dashboard

- [Expand: small: single column; cards full width; nav collapses or horizontal scroll.]
- [Expand: large: grid; sidebar + main; multiple card columns.]
- [Expand: homestead: use same data; different layout and density by breakpoint.]

---

## Summary

- Media queries with min-width (mobile-first); viewport meta; breakpoints by content; responsive dashboard layout.

---

## Bridge / Next

Next: **Chapter 4.13 — Pseudo-classes and Pseudo-elements**.

---

*Expansion note for ChatGPT: One mobile-first media query and one responsive layout note. Target ~150 lines.*
