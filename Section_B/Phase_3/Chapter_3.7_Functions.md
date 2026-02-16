# Phase 2.6 · Chapter 2.6.7: Functions

Function declarations vs expressions; parameters and return; arrow functions; functions as values. Bridge to Phase 0.4.

---

## Learning Objectives

- Define functions with function declarations and function expressions (including arrow functions).
- Pass parameters and return values; understand missing/extra arguments and default parameters.
- Use arrow functions for short callbacks and to preserve this (brief mention).
- Treat functions as values (assign, pass, return). Bridge to Phase 0.4 (functions and behavior).

---

## 1) Declarations vs Expressions

- [Expand: function name() { }—declaration; hoisted; const name = function() { }—expression; not hoisted.]
- [Expand: const name = function otherName() { }—named expression; otherName for recursion/debugging.]
- [Expand: both create function values; difference is hoisting and naming.]

---

## 2) Parameters and return

- [Expand: parameters: (a, b); return value; no return or return; → undefined.]
- [Expand: extra arguments ignored; missing arguments are undefined; default parameters: (a = 0) {}.]
- [Expand: rest: (...args) for remaining arguments as array.]

---

## 3) Arrow Functions

- [Expand: (params) => expression or (params) => { statements }.]
- [Expand: no own this (inherits from enclosing scope); no arguments; concise for callbacks.]
- [Expand: when to use: callbacks, map/filter; when not: methods that need this, need arguments.]

---

## 4) Functions as Values

- [Expand: functions are values; can be assigned, passed to other functions, returned.]
- [Expand: callbacks: pass a function to be called later (e.g. setTimeout, array methods).]
- [Expand: Bridge to Phase 0.4: naming behavior, isolating responsibility.]

---

## Summary

- Declarations vs expressions; parameters, return, defaults, rest; arrow functions for callbacks.
- Functions are values—assign, pass, return; enables callbacks and higher-order patterns.

---

## Bridge / Next

Next: **Chapter 2.6.8 — Scope and Closures**.

---

*Expansion note for ChatGPT: One declaration, one arrow, one callback example. Target ~150 lines.*
