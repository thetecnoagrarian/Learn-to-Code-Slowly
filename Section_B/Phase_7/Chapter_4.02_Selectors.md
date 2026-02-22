# Phase 4 · Chapter 4.2: Selectors — Finding Elements

Element, class, id selectors. Combinators (descendant, child, adjacent). Attribute selectors. How to target exactly what you want without overshooting.

---

## Learning Objectives

- Use element, .class, and #id selectors; understand specificity (id > class > element).
- Use combinators: descendant (space), child (>), adjacent sibling (+), general sibling (~).
- Use attribute selectors [attr], [attr=value], [attr^=value], [attr$=value], [attr*=value].
- Target precisely without styling too much (avoid overly broad selectors).

---

## 1) Element, Class, ID

- [Expand: p { }; .sensor { }; #dashboard { }; id unique per page; class reusable.]
- [Expand: specificity: 0,0,1 for element; 0,1,0 for class; 1,0,0 for id.]
- [Expand: prefer class for styling; reserve id for anchors/JS when needed.]

---

## 2) Combinators

- [Expand: div p = descendant (any p inside div); div > p = child (direct); div + p = next sibling.]
- [Expand: use child when structure is strict; descendant when nesting varies.]
- [Expand: example: .card > .title vs .card .title.]

---

## 3) Attribute Selectors

- [Expand: [href], [type="text"], [class^="btn-"], [data-status$="ok"]; useful for components and state.]
- [Expand: [attr~=word] for space-separated; [attr|=prefix] for prefix.]
- [Expand: combine with element: a[href^="https"].]

---

## 4) Targeting Precisely

- [Expand: start with element or class; add combinator or attribute to narrow; avoid !important.]
- [Expand: one class per "component" or "variant"; BEM or similar if team uses it.]
- [Expand: homestead: .sensor-card, .sensor-card .value, .sensor-card[data-alert].]

---

## Summary

- Selectors: element, .class, #id; combinators space, >, +, ~; attribute selectors for attrs and state.
- Target precisely; prefer classes; avoid overshooting and high specificity.

---

## Bridge / Next

Next: **Chapter 4.3 — Specificity and the Cascade**.

---

*Expansion note for ChatGPT: One selector example per type. Target ~150 lines.*
