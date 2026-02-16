# Phase 4 · Chapter 4.17: Debugging CSS

DevTools inspection. Specificity conflicts. Layout debugging. Why it looks wrong and how to find the cause.

---

## Learning Objectives

- Use browser DevTools: inspect element; view computed styles; see which rules apply and which are overridden.
- Diagnose specificity conflicts: find the rule that wins and why; fix by increasing specificity or simplifying.
- Debug layout: box model view; flex/grid overlay (if available); check width, overflow, display.
- Form a method: reproduce, inspect, identify overriding rule or wrong value, fix and verify.

---

## 1) DevTools Inspection

- [Expand: right-click → Inspect; Styles panel shows rules; crossed out = overridden; computed shows final value.]
- [Expand: which selector won; order and specificity visible; edit live to test.]
- [Expand: box model diagram: content, padding, border, margin.]

---

## 2) Specificity Conflicts

- [Expand: "my rule is there but not applying" — check if another rule has higher specificity or comes later.]
- [Expand: fix: simplify selector (fewer classes/ids), or move stylesheet order, or (last resort) increase specificity.]
- [Expand: avoid !important to "win"; fix the cause.]

---

## 3) Layout Debugging

- [Expand: wrong width: check box-sizing, parent width, flex-basis, grid template.]
- [Expand: overflow: hidden cutting off; check overflow and min-width.]
- [Expand: flex/grid: check direction, wrap, gap; use overlay if DevTools has it.]

---

## 4) Method

- [Expand: 1) Reproduce (which viewport, which element). 2) Inspect (computed, applied rules). 3) Find cause (specificity, wrong property, layout). 4) Fix (simplify, reorder, correct value). 5) Verify.]
- [Expand: homestead: "card not centering" — check parent flex/grid and margin auto.]

---

## Summary

- Use DevTools to see applied and computed styles; fix specificity and layout by inspecting and testing fixes.

---

## Bridge / Next

Next: **Chapter 4.18 — CSS and Accessibility**.

---

*Expansion note for ChatGPT: One step-by-step debug example. Target ~150 lines.*
