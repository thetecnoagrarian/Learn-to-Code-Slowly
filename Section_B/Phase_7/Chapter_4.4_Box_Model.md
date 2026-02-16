# Phase 4 · Chapter 4.4: The Box Model

Content, padding, border, margin. How width and height interact with box-sizing. Why layouts break when you forget margin collapse.

---

## Learning Objectives

- Describe content, padding, border, margin (inside out); width/height by default apply to content (content-box).
- Use box-sizing: border-box so width/height include padding and border; avoid surprise overflow.
- Understand margin collapse: adjacent vertical margins collapse to the larger; block layout only.
- Fix layout issues by checking box model in DevTools.

---

## 1) Content, Padding, Border, Margin

- [Expand: content = inner area; padding = space inside border; border; margin = space outside.]
- [Expand: total width = width + padding-left/right + border-left/right + margin (unless box-sizing).]
- [Expand: padding and margin can be shorthand: 1 value, 2 (v h), 4 (t r b l).]

---

## 2) box-sizing

- [Expand: content-box (default): width = content only; border-box: width includes padding and border.]
- [Expand: * { box-sizing: border-box; } common reset; predictable sizing.]
- [Expand: avoid percent width + padding causing overflow; border-box fixes it.]

---

## 3) Margin Collapse

- [Expand: two adjacent vertical margins (block layout) collapse to the larger of the two.]
- [Expand: only vertical; not horizontal; not when flex/grid (new formatting context).]
- [Expand: fix: use padding, or flex/grid gap, or overflow: auto on parent to create BFC.]

---

## 4) Debugging Layout

- [Expand: DevTools: box model diagram shows content, padding, border, margin.]
- [Expand: check computed width/height; check box-sizing; look for collapse when spacing is wrong.]
- [Expand: homestead: card grid gaps—use gap or margin; watch collapse in stacked sections.]

---

## Summary

- Box model: content, padding, border, margin; use border-box for predictable width/height; margin collapse affects vertical spacing.

---

## Bridge / Next

Next: **Chapter 4.5 — Display and Layout Flow**.

---

*Expansion note for ChatGPT: One box diagram and one collapse example. Target ~150 lines.*
