# Phase 2.6 · Chapter 2.6.4: Operators and Expressions

Arithmetic, comparison, logical; strict equality (===); short-circuit evaluation; optional chaining and nullish coalescing.

---

## Learning Objectives

- Use arithmetic (+, -, *, /, %, **), comparison (===, !==, <, >, <=, >=), and logical (&&, ||, !) operators.
- Prefer === and !== over == and != to avoid coercion.
- Use short-circuit evaluation for defaults and guards (x && x.foo, value || default).
- Use optional chaining (?.) and nullish coalescing (??) for safe access and null/undefined defaults.

---

## 1) Arithmetic and Comparison

- [Expand: +, -, *, /, %, **; NaN propagation; + for string concatenation when one operand is string.]
- [Expand: === strict equality (no coercion); !== strict inequality; <, >, <=, >= (coerce if different types).]
- [Expand: avoid ==; use === so types are explicit.]

---

## 2) Logical Operators and Short-Circuit

- [Expand: &&, ||, !; operands can be any type; result is one of the operands (or boolean for !).]
- [Expand: short-circuit: a && b → if a is falsy, return a else b; a || b → if a is truthy, return a else b.]
- [Expand: use for defaults: name = input || "anonymous"; guards: user && user.name.]

---

## 3) Optional Chaining (?.)

- [Expand: obj?.prop—if obj is null/undefined, result is undefined; else obj.prop.]
- [Expand: obj?.method?.() for optional method calls; arr?.[0] for optional indexing.]
- [Expand: avoids "Cannot read property of undefined" when chain may be broken.]

---

## 4) Nullish Coalescing (??)

- [Expand: a ?? b—result is b only when a is null or undefined; 0 and "" are kept.]
- [Expand: use for defaults when 0 or "" are valid: count ?? 10 vs count || 10.]
- [Expand: combine with ?.: value = obj?.prop ?? default.]

---

## Summary

- Use === and !==; use && and || for short-circuit defaults/guards; use ?. for safe chaining and ?? for null/undefined defaults.
- Operators produce values; understand type and short-circuit behavior to avoid bugs.

---

## Bridge / Next

Next: **Chapter 2.6.5 — Conditions and Branching**.

---

*Expansion note for ChatGPT: One example each for ?. and ??. Target ~150 lines.*
