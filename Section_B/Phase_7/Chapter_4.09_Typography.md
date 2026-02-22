# Phase 4 · Chapter 4.9: Typography

font-family, font-size, font-weight, line-height. Readable text for dashboards. System fonts vs web fonts. Text alignment and spacing.

---

## Learning Objectives

- Set font-family (stack with fallbacks); font-size (prefer rem); font-weight (400, 600, 700); line-height (unitless 1.5).
- Improve readability: contrast, line-length, spacing; use for dashboard labels and values.
- Choose system fonts (fast) or web fonts (branding); load web fonts responsibly.
- Use text-align, letter-spacing, text-transform where appropriate.

---

## 1) font-family, size, weight, line-height

- [Expand: font-family: system-ui, sans-serif; or "Inter", sans-serif; always end with generic.]
- [Expand: font-size: 1rem; font-weight: 400 | 600 | 700; line-height: 1.5 (unitless).]
- [Expand: avoid tiny font-size (min 1rem for body); avoid low contrast (Phase 4.18).]

---

## 2) Readability

- [Expand: line-length: 45–75 chars; max-width on text containers; line-height 1.4–1.6.]
- [Expand: spacing: margin between paragraphs; heading margin.]
- [Expand: dashboard: clear labels; sensor values large enough to scan.]

---

## 3) System vs Web Fonts

- [Expand: system-ui, sans-serif—no network; consistent with OS.]
- [Expand: web fonts: @font-face or link; subset and display: swap to avoid FOIT.]
- [Expand: homestead: system stack for speed; optional web font for branding.]

---

## 4) text-align and Spacing

- [Expand: text-align: left, center, right, justify; justify can cause rivers.]
- [Expand: letter-spacing for headings (slight increase); text-transform: uppercase for labels.]
- [Expand: avoid over-styling body text; focus on hierarchy and readability.]

---

## Summary

- Typography: family, size (rem), weight, line-height; readability via line-length and spacing; system or web fonts; align and transform with care.

---

## Bridge / Next

Next: **Chapter 4.10 — Color**.

---

*Expansion note for ChatGPT: One font stack and one readability rule. Target ~150 lines.*
