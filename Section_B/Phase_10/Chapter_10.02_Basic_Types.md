# Phase 5.5 · Chapter 5.5.2: Basic Types

number, string, boolean, null, undefined; arrays (T[] and Array<T>); any and when to avoid it; type inference.

---

## Learning Objectives

- Annotate variables and parameters with number, string, boolean, null, undefined.
- Type arrays as number[], string[] or Array<number>; avoid any[] when you know element type.
- Use any only when necessary (migration, untyped lib); prefer unknown or concrete types.
- Rely on type inference when type is obvious (let x = 1 → number); add annotations at boundaries.

---

## 1) Primitives

- [Expand: let n: number; let s: string; let b: boolean; let u: undefined; let nu: null.]
- [Expand: strictNullChecks: null and undefined are separate; without it they assignable to everything.]
- [Expand: optional = type | undefined; e.g. name?: string.]

---

## 2) Arrays

- [Expand: let arr: number[] = [1, 2, 3]; or Array<number>; mixed: (string | number)[] or tuple [string, number].]
- [Expand: avoid any[]; use unknown[] if type unknown; concrete type when known.]
- [Expand: inference: let a = [1, 2]; a is number[].]

---

## 3) any and Inference

- [Expand: any disables checking; use for gradual migration or escape hatch only.]
- [Expand: prefer unknown and narrow with typeof or checks; or generic.]
- [Expand: inference: variable without annotation gets type from initializer; use when clear.]
- [Expand: add annotation at function boundaries and when inference is wrong.]

---

## 4) Practical Use

- [Expand: sensor value: number; name: string; optional timestamp?: number.]
- [Expand: function params and return: (id: number) => Promise<Sensor | null>;]
- [Expand: homestead: type sensor and config objects; avoid any in new code.]

---

## Summary

- Use number, string, boolean, null, undefined, T[]; avoid any; use inference where obvious.

---

## Bridge / Next

Next: **Chapter 5.5.3 — Interfaces and Type Aliases**.

---

*Expansion note for ChatGPT: One interface and one inference example. Target ~150 lines.*
