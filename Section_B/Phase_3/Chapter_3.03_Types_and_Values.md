# Phase 2.6 · Chapter 2.6.3: Types and Values

Primitives: number, string, boolean, undefined, null, symbol, bigint; typeof; type coercion pitfalls. Bridge to Phase 0.5 and 1.7.

---

## Learning Objectives

- List JavaScript’s primitive types and describe each briefly.
- Use typeof to inspect types; understand typeof null and typeof function.
- Avoid common type-coercion pitfalls (==, + with string, truthiness edge cases).
- Relate to Phase 0.5 (data and variables) and Phase 1.7 (data types as categories of meaning).

---

## 1) Primitives

- [Expand: number (including NaN, Infinity); string; boolean; undefined; null; symbol; bigint.]
- [Expand: primitives are immutable; comparison by value (with caveats for NaN).]
- [Expand: everything else is object (including arrays and functions).]

---

## 2) typeof Operator

- [Expand: typeof x returns string: "number", "string", "boolean", "undefined", "object", "function", "symbol", "bigint".]
- [Expand: typeof null === "object" (historic bug); check for null explicitly.]
- [Expand: typeof is useful for defensive checks at boundaries.]

---

## 3) Type Coercion Pitfalls

- [Expand: == coerces types; prefer === for predictable comparison.]
- [Expand: + with string coerces to string (1 + "2" → "12"); use Number() or explicit conversion when needed.]
- [Expand: truthiness: 0, "", null, undefined, NaN, false are falsy; everything else truthy—can surprise.]

---

## 4) Bridge to Phase 0.5 and 1.7

- [Expand: Phase 0.5: data and variables; types categorize meaning—same in JS.]
- [Expand: Phase 1.7: int, float, str, bool in Python map to number, string, boolean (and null/undefined).]
- [Expand: explicit checks and consistent types at boundaries reduce bugs.]

---

## Summary

- JS has primitives (number, string, boolean, undefined, null, symbol, bigint) and objects; use typeof and ===.
- Avoid relying on coercion; check for null explicitly; know falsy values.

---

## Bridge / Next

Next: **Chapter 2.6.4 — Operators and Expressions**.

---

*Expansion note for ChatGPT: One table of primitives and one coercion example. Target ~150 lines.*
