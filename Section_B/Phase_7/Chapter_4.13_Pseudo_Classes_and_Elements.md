# Phase 4 · Chapter 4.13: Pseudo-classes and Pseudo-elements

:hover, :focus, :active. ::before, ::after. State-based styling. Accessibility and focus indicators.

---

## Learning Objectives

- Use :hover, :focus, :active for interactive states; style focus visibly for keyboard users.
- Use ::before and ::after for decorative content (icons, bullets, clearfix); content property required.
- Style by state (:first-child, :nth-child, :disabled) and by structure; avoid over-relying on order.
- Ensure focus is visible (outline or box-shadow); don’t remove focus outline without replacement.

---

## 1) :hover, :focus, :active

- [Expand: :hover when pointer over; :focus when focused (keyboard or click); :active when pressed.]
- [Expand: order matters for override: link:link, :visited, :hover, :focus, :active (LVHFA).]
- [Expand: focus-visible: only show focus ring when keyboard focus (not click); modern approach.]

---

## 2) ::before and ::after

- [Expand: content: "" required (or "text"); display: block/inline-block; no content = not rendered.]
- [Expand: use for icons, bullets, decorative lines; don’t put important content only in pseudo-elements (a11y).]
- [Expand: clearfix: ::after { content: ""; display: table; clear: both; } (legacy); flex/grid often avoid need).]

---

## 3) State and Structure

- [Expand: :first-child, :last-child, :nth-child(n), :nth-of-type(n); use for zebra stripes or first/last spacing.]
- [Expand: :disabled, :checked (for inputs); :valid, :invalid for form state.]
- [Expand: avoid :nth-child for semantic styling when you can use class.]

---

## 4) Accessibility

- [Expand: always show focus: outline or box-shadow; outline: none only with visible alternative.]
- [Expand: :focus-visible { outline: 2px solid ... } for keyboard; no outline on mouse click if desired.]
- [Expand: hover is not focus; keyboard users need focus styles; Phase 4.18.]

---

## Summary

- Pseudo-classes for state (hover, focus, active, disabled); pseudo-elements for decoration (::before, ::after); visible focus for a11y.

---

## Bridge / Next

Next: **Chapter 4.14 — Transitions and Animation**.

---

*Expansion note for ChatGPT: One focus style and one ::after example. Target ~150 lines.*
