# Phase 5.5 · Chapter 5.5.4: Functions and Signatures

Parameter and return types; optional parameters; overloads (concept); async functions.

---

## Learning Objectives

- Annotate function parameters and return type: (x: number, y: string) => number.
- Use optional parameters (x?: number) and default values (x = 0); return type void when nothing returned.
- Understand overloads: multiple signatures for one implementation; use sparingly.
- Type async functions: Promise<ReturnType>; return type of async is Promise<T>.

---

## 1) Parameter and Return Types

- [Expand: function add(a: number, b: number): number { return a + b; }]
- [Expand: arrow: const add = (a: number, b: number): number => a + b;]
- [Expand: return type inferred if obvious; explicit at API boundaries.]

---

## 2) Optional and Defaults

- [Expand: optional: (id: number, name?: string); default: (x = 0) same as x?: number with default.]
- [Expand: void for no return; undefined explicitly if needed.]
- [Expand: avoid optional when default is clearer: (limit = 10) vs (limit?: number).]

---

## 3) Overloads (Concept)

- [Expand: overload signatures + one implementation; different param types/return for same function name.]
- [Expand: use when same name, different shapes (e.g. get(id) vs get()); don’t overuse.]
- [Expand: Express req handlers: single signature (req, res) => void or Promise<void>.]

---

## 4) Async Functions

- [Expand: async function get(): Promise<Sensor[]>; return type is Promise<Sensor[]>, not Sensor[].]
- [Expand: await returns unwrapped type; error handling: Promise<void> or Promise<Response>.]
- [Expand: homestead: async route handlers; return type Promise<void> or res.json so void.]

---

## Summary

- Annotate params and return; optional and defaults; overloads when needed; async → Promise<T> return.

---

## Bridge / Next

Next: **Chapter 5.5.5 — Generics: Basics**.

---

*Expansion note for ChatGPT: One function signature and one async example. Target ~150 lines.*
