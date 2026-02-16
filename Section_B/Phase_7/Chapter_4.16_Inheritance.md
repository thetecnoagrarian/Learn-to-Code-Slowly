# Phase 4 · Chapter 4.16: Inheritance

What cascades from parent to child. inherit keyword. Which properties inherit and which don't. Reducing repetition.

---

## Learning Objectives

- Know which properties inherit (font, color, line-height, etc.) and which don't (border, margin, background).
- Use inherit to explicitly inherit a value from parent when default doesn't.
- Reduce repetition: set font and color on parent; children inherit; override only when needed.
- Avoid resetting every property on every element; use inheritance and variables.

---

## 1) Inherited vs Non-Inherited

- [Expand: inherited: font-*, color, line-height, text-align, visibility, etc.]
- [Expand: not inherited: border, margin, padding, background, width, height, etc.]
- [Expand: list-style and cursor inherit in some browsers; check when in doubt.]

---

## 2) inherit Keyword

- [Expand: property: inherit; takes computed value from parent; useful for "undo" or "same as parent."]
- [Expand: example: input { color: inherit; } so input text matches surrounding color.]
- [Expand: border: inherit rare; usually use transparent or same as background.]

---

## 3) Reducing Repetition

- [Expand: set font-family, font-size, color on body or .app; children get it.]
- [Expand: override on headings, links, buttons; don’t set font on every element.]
- [Expand: combine with variables: one place for type scale and color.]

---

## 4) Practical Use

- [Expand: body { font-family: ...; font-size: 1rem; color: var(--color-text); } then headings and paragraphs inherit.]
- [Expand: links: color inherited or set once; hover/focus override.]
- [Expand: homestead: dashboard container sets font and color; cards inherit; override for labels/values.]

---

## Summary

- Some properties inherit; use inherit keyword when needed; set once on parent to reduce repetition.

---

## Bridge / Next

Next: **Chapter 4.17 — Debugging CSS**.

---

*Expansion note for ChatGPT: One list of inherited properties and one body setup. Target ~150 lines.*
