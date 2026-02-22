# Phase 2.6 · Chapter 2.6.5: Conditions and Branching

if, else if, else; switch; truthiness and falsiness; explicit checks. Bridge to Phase 0.2.

---

## Learning Objectives

- Write if / else if / else and use blocks correctly.
- Use switch for multi-way branching on one value; break to avoid fall-through.
- Rely on explicit checks (=== null, typeof, Array.isArray) instead of truthiness when it matters.
- Connect to Phase 0.2 (conditions and branching).

---

## 1) if, else if, else

- [Expand: if (condition) { ... } else if (condition) { ... } else { ... }; condition can be any value (truthy/falsy).]
- [Expand: use blocks {} even for single statements; improves readability and avoids bugs.]
- [Expand: else if is just else { if ... }; no special keyword.]

---

## 2) switch

- [Expand: switch (value) { case a: ... break; case b: ... break; default: ... }.]
- [Expand: strict equality (===) for matching; break to exit; fall-through is rarely intended.]
- [Expand: default for "none of the above"; good for enums or status codes.]

---

## 3) Truthiness and Falsiness

- [Expand: falsy: false, 0, -0, "", null, undefined, NaN; truthy: everything else (including [], {}).]
- [Expand: if (x) treats 0 and "" as false—ok for "has value" but wrong when 0 is valid.]
- [Expand: explicit: if (x !== null && x !== undefined), or if (x != null) for both, or optional chaining.]

---

## 4) Bridge to Phase 0.2

- [Expand: Phase 0.2: true/false tests, branching paths, state determines flow—same in JS.]
- [Expand: conditions guard actions; keep conditions readable and explicit at boundaries.]

---

## Summary

- Use if/else if/else and switch with break; prefer explicit checks when 0 or "" are valid.
- Truthiness is convenient but can hide bugs; use === and null checks at boundaries.

---

## Bridge / Next

Next: **Chapter 2.6.6 — Loops and Iteration**.

---

*Expansion note for ChatGPT: One if/else and one switch example. Target ~150 lines.*
