# Section B Phase 3 · Chapter 3.22: Expressions, Statements, and Program Flow

Expressions vs statements; execution order; side effects and purity (brief). Ties together control flow, functions, and data flow. Next: Chapter 3.23 (JavaScript in Practice).

---

## Learning Objectives

- Distinguish expressions (produce a value) from statements (perform an action; no value or discarded).
- Understand how execution order (top-to-bottom, conditionals, loops, function calls) shapes program flow.
- Recognize side effects and where they occur; prefer clear, linear flow where possible.

---

## 1) Expressions and Statements

- [Expand: expressions: 1+2, fn(), x; statements: if, for, return, const x = 1; some contexts expect expression (e.g. ternary, arrow body).]
- [Expand: statement vs expression in template literals, arrow functions, JSX (if applicable).]

---

## 2) Program Flow

- [Expand: single-threaded; synchronous run-to-completion; async work deferred to queue (recap from async chapters).]
- [Expand: flow through conditionals, loops, function calls; call stack and return.]

---

## 3) Side Effects and Clarity

- [Expand: side effect: mutation, I/O, log; pure function: same input → same output, no side effects.]
- [Expand: homestead: keep side effects at boundaries (fetch, DOM update); keep logic testable.]

---

## Summary

- Expressions produce values; statements control flow. Execution is ordered and single-threaded.
- Clarify flow and limit side effects for maintainability.

---

## Next

Next: **Chapter 3.23: JavaScript in Practice**.
