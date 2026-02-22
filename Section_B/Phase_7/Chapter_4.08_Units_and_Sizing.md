# Phase 4 · Chapter 4.8: Units and Sizing

px, em, rem, %, vw, vh. When each makes sense. Accessibility and rem for typography. Responsive sizing.

---

## Learning Objectives

- Use px (fixed), em (relative to font-size of element), rem (relative to root font-size), % (relative to parent).
- Use vw, vh, vmin, vmax for viewport-relative sizing; use for full-height sections or responsive typography with care.
- Prefer rem for font-size and spacing when you want user zoom and consistency; use px when fixed size is required.
- Balance responsive sizing (%, rem, clamp) with readability and accessibility.

---

## 1) px, em, rem

- [Expand: px = pixel; fixed; rem = root em; 1rem = root font-size (usually 16px); em = parent font-size.]
- [Expand: rem for font-size and spacing: scales with user preferences; em for local scaling (e.g. padding in buttons).]
- [Expand: 1rem = 16px if root is 16px; 1.5rem = 24px.]

---

## 2) %, vw, vh

- [Expand: % = percent of parent (width, margin); viewport: vw (1% viewport width), vh (1% height).]
- [Expand: vh/vw for "full screen" sections; watch mobile (100vh includes address bar).]
- [Expand: vmin, vmax for smaller/larger viewport dimension.]

---

## 3) Accessibility and rem

- [Expand: users may increase default font-size; rem and em respect that; px does not scale.]
- [Expand: set root font-size (html { font-size: 16px; } or 100%); use rem for type and spacing.]
- [Expand: line-height unitless (1.5) or em; avoid fixed line-height in px for text.]

---

## 4) Responsive Sizing

- [Expand: clamp(min, preferred, max) for fluid typography; min/max for bounds.]
- [Expand: max-width: 100% for images; width in % or fr in grid for flexible layout.]
- [Expand: homestead: card widths in % or fr; font-size in rem.]

---

## Summary

- px, em, rem, %, vw, vh; prefer rem for type and spacing; use viewport units with care; clamp for fluid sizing.

---

## Bridge / Next

Next: **Chapter 4.9 — Typography**.

---

*Expansion note for ChatGPT: One rem vs px comparison; one clamp example. Target ~150 lines.*
