# Phase 4.5 · Chapter 4.5.10: DOM and CSS

element.style; classList for state-based styling; matching CSS (Phase 4) with JS state. Dashboard toggles and feedback.

---

## Learning Objectives

- Set inline styles with element.style.property = value (camelCase); read with element.style.property or getComputedStyle.
- Prefer classList.add/remove/toggle for state (e.g. .active, .error) and define styles in CSS; avoid inline when possible.
- Keep JS state and DOM class in sync so CSS (Phase 4) applies correctly; single source of truth (state or class).
- Use for dashboard: loading state, error state, expanded/collapsed; classList + CSS.

---

## 1) element.style

- [Expand: el.style.color = 'red'; el.style.display = 'none'; property names in camelCase.]
- [Expand: only reflects inline style; getComputedStyle(el) for final computed value.]
- [Expand: use for one-off or dynamic (e.g. position from drag); prefer class for state.]

---

## 2) classList for State

- [Expand: state = loading → classList.add('loading'); state = loaded → remove('loading'); error → add('error').]
- [Expand: CSS defines .loading { opacity: 0.6; pointer-events: none; } etc.; JS only toggles class.]
- [Expand: one place for appearance (CSS); JS only reflects state.]

---

## 3) Syncing State and UI

- [Expand: option A: state variable in JS; update state then update class from state.]
- [Expand: option B: derive state from DOM (e.g. classList.contains('open')); keep one source.]
- [Expand: avoid: state in JS and class in DOM both changed independently (can drift).]

---

## 4) Dashboard Examples

- [Expand: card loading: classList.add('loading'); after fetch remove and show data.]
- [Expand: alert state: classList.add('alert') when threshold exceeded; remove when ok.]
- [Expand: expand/collapse: toggle('expanded'); CSS :not(.expanded) .details { display: none; }.]

---

## Summary

- Inline style for one-off/dynamic; classList for state; keep state and class in sync; use CSS for actual styles.

---

## Bridge / Next

Next: **Chapter 4.5.11 — Debugging the DOM**.

---

*Expansion note for ChatGPT: One classList state example. Target ~150 lines.*
