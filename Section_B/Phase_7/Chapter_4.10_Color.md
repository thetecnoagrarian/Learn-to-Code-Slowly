# Phase 4 · Chapter 4.10: Color

Hex, rgb, hsl. Named colors. Transparency. Contrast and accessibility. Color for status (sensor readings, alerts, thresholds).

---

## Learning Objectives

- Use hex (#fff, #000000), rgb/rgba(255,255,255,0.5), hsl/hsla(0,0%,100%,0.5); use transparent and currentColor.
- Ensure sufficient contrast (WCAG); use color for status (green/red/yellow) with non-color cues too.
- Prefer HSL for programmatic adjustment (lightness, saturation); use CSS variables for theme colors.
- Apply color to dashboard: status indicators, thresholds, and backgrounds without sacrificing readability.

---

## 1) Hex, rgb, hsl

- [Expand: #RGB, #RRGGBB, #RRGGBBAA; rgb(r,g,b); rgba(..., alpha); hsl(h,s%,l%); hsla(..., alpha).]
- [Expand: hsl: hue 0–360, saturation and lightness 0–100%; easy to create variants (same h, different l).]
- [Expand: currentColor: inherit text color; useful for icons and borders.]

---

## 2) Contrast and Accessibility

- [Expand: text on background: WCAG AA 4.5:1 normal text, 3:1 large; AAA higher.]
- [Expand: check with DevTools or contrast checker; don’t rely on color alone for meaning.]
- [Expand: status: color + icon or label; e.g. red + "Critical".]

---

## 3) Color for Status

- [Expand: success/good: green; warning: amber; error/critical: red; neutral: gray.]
- [Expand: use semantic names in variables: --color-success, --color-danger; use in borders, backgrounds, text.]
- [Expand: homestead: sensor OK vs alert; battery level; threshold exceeded.]

---

## 4) Transparency and Variables

- [Expand: rgba/hsla or #RRGGBB80 for overlay; opacity affects whole element and children.]
- [Expand: --color-primary: hsl(220, 70%, 50%); use var(--color-primary); change in one place.]
- [Expand: theme switch: change variable values (Phase 4.15).]

---

## Summary

- Color: hex, rgb, hsl, alpha; contrast for accessibility; color for status with non-color cues; variables for themes.

---

## Bridge / Next

Next: **Chapter 4.11 — Spacing and Layout Patterns**.

---

*Expansion note for ChatGPT: One status color example and one variable example. Target ~150 lines.*
