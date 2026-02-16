# Phase 3.5 · Chapter 3.5.4: Writing Assertions

expect().toBe, .toEqual, .toThrow; matchers for numbers, strings, arrays, objects. Meaningful failure messages.

---

## Learning Objectives

- Use expect(value).toBe(expected) for primitives (strict equality) and .toEqual for objects/arrays (deep).
- Use .toThrow() for exceptions; .toHaveLength(n), .toContain(item); .toBeTruthy/.toBeFalsy when appropriate.
- Write one or two assertions per test so failures point to the exact expectation.
- Read Jest failure output to fix failing tests quickly.

---

## 1) toBe vs toEqual

- [Expand: toBe uses ===; use for numbers, strings, booleans, undefined.]
- [Expand: toEqual does deep equality; use for objects and arrays.]
- [Expand: expect({ a: 1 }).toEqual({ a: 1 }); expect(1).toBe(1).]

---

## 2) Common Matchers

- [Expand: .toThrow(), .toThrow("message"); .toHaveLength(n); .toContain(item); .toMatch(/regex/).]
- [Expand: .toBeNull(), .toBeDefined(), .toBeTruthy(), .toBeFalsy(); prefer .toBe(null) for null.]
- [Expand: .toBeGreaterThan(n), .toBeCloseTo(n) for floats; .toHaveProperty('key').]

---

## 3) One Focus Per Test

- [Expand: one or two related assertions per it; if test fails, you know which behavior broke.]
- [Expand: avoid testing five things in one test; split into multiple it blocks.]
- [Expand: describe the behavior in the it string so failure message is clear.]

---

## 4) Failure Messages

- [Expand: Jest prints expected vs received; use .toEqual for objects to see diff.]
- [Expand: optional third arg: expect(x, 'optional message').toBe(y); rarely needed if test name is clear.]
- [Expand: fix the code or fix the expectation; use failure to drive the fix.]

---

## Summary

- toBe for primitives; toEqual for objects/arrays; toThrow, toHaveLength, toContain, etc. for other cases.
- One focused assertion per test; read failure output to fix quickly.

---

## Bridge / Next

Next: **Chapter 3.5.5 — Mocking and Stubs**.

---

*Expansion note for ChatGPT: One test with toBe, one with toEqual, one with toThrow. Target ~150 lines.*
