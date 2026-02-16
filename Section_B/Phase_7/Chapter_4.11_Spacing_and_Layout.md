# Phase 4 · Chapter 4.11: Spacing and Layout Patterns

Margin, padding conventions. Consistent spacing system. Gap in Flexbox and Grid. Whitespace as design.

---

## Learning Objectives

- Apply consistent margin and padding (e.g. scale: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem); avoid random values.
- Use gap in flex and grid instead of margin on children for consistent spacing.
- Establish spacing between sections (margin-block or margin-top) and inside components (padding).
- Treat whitespace as part of design; improve scanability of dashboard.

---

## 1) Margin and Padding Conventions

- [Expand: pick a scale (4px, 8px, 16px, 24px, 32px or rem equivalent); use consistently.]
- [Expand: padding inside cards/panels; margin between sections; avoid margin on same side as gap.]
- [Expand: margin-block, margin-inline for logical (RTL-friendly) spacing.]

---

## 2) gap in Flex and Grid

- [Expand: gap: 1rem; applies between items; no need for margin on children; no collapse issues.]
- [Expand: row-gap and column-gap if different; gap shorthand for both.]
- [Expand: use instead of negative margin or :last-child margin removal.]

---

## 3) Spacing System

- [Expand: CSS variables: --space-1: 0.25rem; --space-2: 0.5rem; ... use var(--space-2) everywhere.]
- [Expand: or use a scale in design (e.g. 4, 8, 16, 24, 32); map to rem.]
- [Expand: homestead: same spacing in nav, cards, and sections.]

---

## 4) Whitespace as Design

- [Expand: more space = more emphasis on separation; less = grouped.]
- [Expand: dashboard: space between card groups; tight space inside card for label + value.]
- [Expand: avoid cramped layouts; breathing room improves readability.]

---

## Summary

- Consistent spacing scale; use gap in flex/grid; margin for sections, padding for components; whitespace as design.

---

## Bridge / Next

Next: **Chapter 4.12 — Responsive Design and Media Queries**.

---

*Expansion note for ChatGPT: One spacing scale and one gap example. Target ~150 lines.*
