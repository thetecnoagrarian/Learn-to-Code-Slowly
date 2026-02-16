# Phase 4.5 · Chapter 4.5.6: Events — Bubbling and Delegation

Event phases; bubbling and capturing; delegation (one listener on parent). Performance and dynamic content.

---

## Learning Objectives

- Explain capture phase (top-down), target phase, bubble phase (bottom-up); default listeners run in bubble.
- Use event delegation: attach listener to parent; use e.target to identify which child was clicked.
- Apply delegation for dynamic content (list items added later) and for many similar elements (one listener).
- Know when to stopPropagation (rare) and when delegation is cleaner than many listeners.

---

## 1) Phases: Capture, Target, Bubble

- [Expand: capture: document → ... → target; target: the element; bubble: target → ... → document.]
- [Expand: addEventListener(..., true) for capture; default false = bubble.]
- [Expand: most code uses bubble; target is where event occurred.]

---

## 2) Bubbling and stopPropagation

- [Expand: after target, event bubbles to parent, grandparent; each listener can run.]
- [Expand: stopPropagation() stops event from reaching other listeners (same event).]
- [Expand: use sparingly; can break delegation or other handlers.]

---

## 3) Event Delegation

- [Expand: parent.addEventListener('click', (e) => { if (e.target.matches('.sensor-card')) { ... } });]
- [Expand: one listener for many children; works for dynamically added children.]
- [Expand: e.target may be child inside .sensor-card; use closest('.sensor-card') to find card.]

---

## 4) When to Delegate

- [Expand: many similar elements (list, grid of cards): one listener on container.]
- [Expand: content added/removed dynamically: delegation avoids re-attaching listeners.]
- [Expand: homestead: list of sensors; click on any card handled by list listener + e.target.closest.]

---

## Summary

- Capture/target/bubble; delegation = one listener on parent, identify with e.target/closest; use for dynamic and many elements.

---

## Bridge / Next

Next: **Chapter 4.5.7 — Fetch and HTTP from the Browser**.

---

*Expansion note for ChatGPT: One delegation example with closest. Target ~150 lines.*
