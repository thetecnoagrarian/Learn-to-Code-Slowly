# Phase 2.6 · Chapter 2.6.2: Variables and Declarations

let, const, var; scope and temporal dead zone; naming; reassignment vs immutability. Bridge to Phase 0.5.

---

## Learning Objectives

- Declare variables with let and const; know when to use each.
- Understand block scope (let, const) vs function scope (var); avoid var in new code.
- Explain temporal dead zone (TDZ) for let/const.
- Prefer const by default; use let when reassignment is needed. Bridge to Phase 0.5 (state, naming).

---

## 1) let and const

- [Expand: let—block-scoped; can be reassigned; const—block-scoped; cannot be reassigned (binding is immutable, value may be mutable).]
- [Expand: const for references you won’t reassign (objects/arrays can still be mutated).]
- [Expand: always declare before use; no implicit globals.]

---

## 2) var (Legacy) and Function Scope

- [Expand: var is function-scoped (or global); hoisted; can be redeclared.]
- [Expand: why avoid: confusing scope, hard to reason about; use let/const.]
- [Expand: you’ll see var in old code; prefer let/const when writing.]

---

## 3) Temporal Dead Zone

- [Expand: from start of block until declaration, variable is in TDZ; accessing it throws ReferenceError.]
- [Expand: const/let are not hoisted like var (they’re "half-hoisted"—known but not usable).]
- [Expand: practical: declare at top of block or use; avoid accessing before declaration.]

---

## 4) Naming and Reassignment

- [Expand: naming: camelCase; meaningful names; constants in UPPER_SNAKE for true constants (optional).]
- [Expand: reassignment: use let when value changes; use const when the binding doesn’t.]
- [Expand: Bridge to Phase 0.5: variables hold state; naming conveys meaning.]

---

## Summary

- Use const by default; let when you need to reassign; avoid var. Block scope and TDZ apply to let/const.
- Good naming and minimal reassignment make state easier to reason about.

---

## Bridge / Next

Next: **Chapter 2.6.3 — Types and Values**.

---

*Expansion note for ChatGPT: Include 2–3 small code examples. Target ~150 lines.*
