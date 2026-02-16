# Phase 4 · Chapter 4.14: Transitions and Animation

transition, animation, @keyframes. Smooth state changes. When animation helps vs distracts. Subtle feedback for UI interactions.

---

## Learning Objectives

- Use transition: property duration timing-function delay; transition multiple properties or all.
- Use @keyframes and animation: name duration timing iteration direction fill-mode; prefer transition for simple state change.
- Apply subtle transitions (color, opacity, transform) for hover/focus; avoid long or distracting motion.
- Respect prefers-reduced-motion; reduce or remove animation when user prefers it.

---

## 1) transition

- [Expand: transition: color 0.2s ease; or transition: all 0.2s (avoid for performance when possible).]
- [Expand: transition-property, duration, timing (ease, linear, ease-in-out), delay.]
- [Expand: only animatable properties; transform and opacity are performant (GPU).]

---

## 2) animation and @keyframes

- [Expand: @keyframes name { from { } to { } } or 0%, 50%, 100%; animation: name 1s ease infinite.]
- [Expand: use for loading spinners, repeated motion; transition for one-off state change.]
- [Expand: animation-fill-mode: forwards to keep last frame.]

---

## 3) When to Use

- [Expand: transition: hover, focus, open/close; quick (200–300ms) and subtle.]
- [Expand: animation: loading, notification appear; avoid constant motion that distracts.]
- [Expand: homestead: button hover; panel expand; status pulse (optional, respect reduced motion).]

---

## 4) prefers-reduced-motion

- [Expand: @media (prefers-reduced-motion: reduce) { transition: none; animation: none; } or shorten.]
- [Expand: respect user preference; some users are sensitive to motion.]
- [Expand: Phase 4.18: accessibility includes motion.]

---

## Summary

- transition for state changes; animation/@keyframes for repeated motion; subtle and short; respect prefers-reduced-motion.

---

## Bridge / Next

Next: **Chapter 4.15 — CSS Custom Properties (Variables)**.

---

*Expansion note for ChatGPT: One transition and one @media reduced-motion. Target ~150 lines.*
