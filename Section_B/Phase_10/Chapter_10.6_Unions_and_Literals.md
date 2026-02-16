# Phase 5.5 · Chapter 5.5.6: Union and Literal Types

Union types (A | B); literal types ('get' | 'post'); type narrowing with typeof and checks.

---

## Learning Objectives

- Use union types: string | number; Sensor | null; handle each branch or use type guard.
- Use literal types: 'get' | 'post'; status: 'ok' | 'alert'; const assertions for readonly literals.
- Narrow types: typeof x === 'string'; 'id' in obj; if (x) for truthiness; discriminated union with kind.
- Avoid any; use union and narrow so TypeScript knows the type in each branch.

---

## 1) Union Types

- [Expand: type ID = string | number; function get(id: ID): Sensor | null;]
- [Expand: caller must handle both string and number; or narrow inside function.]
- [Expand: common: T | null for "maybe"; T | undefined for optional.]

---

## 2) Literal Types

- [Expand: type Method = 'GET' | 'POST'; const m: Method = 'GET';]
- [Expand: status: 'ok' | 'alert' | 'offline' for enum-like; no runtime enum needed.]
- [Expand: as const: const arr = ['a', 'b'] as const; arr[0] is 'a' literal.]

---

## 3) Type Narrowing

- [Expand: typeof x === 'string'; x is string in block.]
- [Expand: 'key' in obj; if (obj.key) for optional.]
- [Expand: discriminated union: type Result = { kind: 'ok'; data: Sensor } | { kind: 'error'; message: string }; if (r.kind === 'ok') r.data.]
- [Expand: homestead: status literal; narrow in handler for correct property access.]

---

## 4) Practical Use

- [Expand: HTTP method: type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';]
- [Expand: API result: { success: true; data: T } | { success: false; error: string }; narrow with success.]
- [Expand: avoid any by modeling "either A or B" with union and narrowing.]

---

## Summary

- Union A | B; literal 'a' | 'b'; narrow with typeof, in, or discriminant; use for method, status, result shapes.

---

## Bridge / Next

Next: **Chapter 5.5.7 — Classes and Types**.

---

*Expansion note for ChatGPT: One union and one narrowing example. Target ~150 lines.*
