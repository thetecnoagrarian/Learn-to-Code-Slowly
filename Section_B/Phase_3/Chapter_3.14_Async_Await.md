# Phase 2.6 · Chapter 2.6.14: Asynchronous JavaScript — async/await

async functions; await; error handling with try/catch; sequential vs parallel patterns.

---

## Learning Objectives

- Declare async functions and use await to wait for a Promise; async function always returns a Promise.
- Handle errors with try/catch around await; unhandled rejections become exceptions in async function.
- Run independent awaits in parallel (Promise.all) vs sequential (await one after another).
- Prefer async/await over raw .then when writing linear async flow.

---

## 1) async and await

- [Expand: async function f() { const x = await promise; return x; }—await pauses until promise settles.]
- [Expand: async function always returns Promise; if you return value, it’s Promise.resolve(value).]
- [Expand: await only inside async function (or top-level in modules in modern envs).]

---

## 2) Error Handling

- [Expand: try { const x = await mightReject(); } catch (e) { ... }—rejection becomes thrown exception.]
- [Expand: combine with finally for cleanup.]
- [Expand: if you don’t catch, rejection propagates to caller as rejected Promise.]

---

## 3) Sequential vs Parallel

- [Expand: sequential: const a = await getA(); const b = await getB();—B waits for A.]
- [Expand: parallel: const [a, b] = await Promise.all([getA(), getB()]);—both start immediately.]
- [Expand: use parallel when operations don’t depend on each other.]

---

## 4) When to Use async/await

- [Expand: prefer async/await for readability when flow is linear; use .then when composing or need fine control.]
- [Expand: await non-Promise: value is used as-is (no wait); useful for conditional async.]
- [Expand: avoid await in loop when operations are independent—use Promise.all.]

---

## Summary

- async/await makes async code look synchronous; await only in async; handle errors with try/catch.
- Use Promise.all for parallel awaits; prefer async/await for linear flows.

---

## Bridge / Next

Next: **Chapter 2.6.15 — Modules: CommonJS and ES Modules**.

---

*Expansion note for ChatGPT: One sequential and one parallel example. Target ~150 lines.*
