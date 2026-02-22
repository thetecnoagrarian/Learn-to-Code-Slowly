# Phase 2.6 · Chapter 2.6.8: Scope and Closures

Lexical scope; block scope; closure; IIFEs when needed. Bridge to Phase 0.11.

---

## Learning Objectives

- Explain lexical scope (where you write the function determines what variables it sees).
- Use block scope (let, const inside { }) to limit visibility.
- Define closure: function retains access to variables from its enclosing scope after that scope has finished.
- Use an IIFE (or block + let) when you need a one-off scope. Bridge to Phase 0.11 (abstraction).

---

## 1) Lexical Scope

- [Expand: scope is determined by where the code is written (nesting), not where it’s called.]
- [Expand: inner functions can read outer variables; outer cannot read inner.]
- [Expand: global scope; function scope (var); block scope (let, const in {}).]

---

## 2) Block Scope

- [Expand: { let x = 1; } — x only visible inside block.]
- [Expand: useful in loops (let i), in if blocks, or to hide temporary variables.]
- [Expand: const/let in for loop: each iteration gets its own binding (for (let i...) vs var).]

---

## 3) Closures

- [Expand: closure = function + its "remembered" outer environment.]
- [Expand: when a function is returned or stored, it keeps access to the variables that were in scope when it was created.]
- [Expand: example: factory function that returns a function using a private counter.]

---

## 4) IIFEs and Scope

- [Expand: (function() { ... })()—immediately invoked; creates a function scope (for var) or use block + let.]
- [Expand: historical use: avoid polluting global; modern alternative: block + let/const or modules.]
- [Expand: Bridge to Phase 0.11: abstraction and hiding implementation detail.]

---

## Summary

- Lexical and block scope control visibility; closures let functions keep access to outer variables.
- Use blocks and modules for encapsulation; IIFE when you need a one-off scope (legacy).

---

## Bridge / Next

Next: **Chapter 2.6.9 — Objects**.

---

*Expansion note for ChatGPT: One closure example (counter or similar). Target ~150 lines.*
