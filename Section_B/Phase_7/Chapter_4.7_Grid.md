# Phase 4 · Chapter 4.7: CSS Grid — Two-Dimensional Layout

Grid containers and tracks. fr units. Template areas. When to use Grid vs Flexbox. Dashboard grid layouts.

---

## Learning Objectives

- Create a grid with display: grid; define columns and rows (grid-template-columns/rows); use fr and repeat().
- Place items with grid-column, grid-row, or grid-template-areas for semantic layout.
- Choose Grid for 2D (dashboard, form grid) and Flexbox for 1D (nav, list) or component internals.
- Build a dashboard layout with header, sidebar, main, footer using grid.

---

## 1) Tracks and fr

- [Expand: grid-template-columns: 1fr 1fr 1fr; or repeat(3, 1fr); rows same.]
- [Expand: fr = fraction of free space; 1fr 2fr = 1:2 ratio; mix with px: 200px 1fr.]
- [Expand: gap: row-gap column-gap or gap.]

---

## 2) Placing Items

- [Expand: grid-column: 1 / 3; grid-row: 1; or span 2.]
- [Expand: grid-template-areas: "header header" "sidebar main" "footer footer"; item: grid-area: header.]
- [Expand: areas make layout readable; name regions.]

---

## 3) Grid vs Flexbox

- [Expand: Grid: 2D, rows and columns, place anywhere; Flexbox: 1D, flow in one direction.]
- [Expand: dashboard: Grid for page layout; Flexbox for nav or card content inside cells.]
- [Expand: both can nest: grid container with flex children, or vice versa.]

---

## 4) Dashboard Layout

- [Expand: grid-template-areas; header full width; sidebar + main; footer full width.]
- [Expand: responsive: change template for small screens (stack sidebar below or hide).]
- [Expand: homestead: dashboard grid with sensor grid inside main.]

---

## Summary

- Grid: template columns/rows, fr, gap; place with grid-column/row or areas; use for 2D and page layout.
- Grid for structure; Flexbox for components and 1D; combine as needed.

---

## Bridge / Next

Next: **Chapter 4.8 — Units and Sizing**.

---

*Expansion note for ChatGPT: One grid template and one dashboard areas example. Target ~150 lines.*
