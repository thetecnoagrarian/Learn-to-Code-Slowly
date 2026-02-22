# Phase 2.6 · Chapter 2.6.9: Objects

Literals; properties and methods; dot vs bracket notation; spread; destructuring. Bridge to Phase 1.10 (dictionaries).

---

## Learning Objectives

- Create objects with literals {} and access properties with dot and bracket notation.
- Add and update properties; use methods (functions as properties).
- Use spread (...obj) to copy or merge objects; use destructuring to extract properties.
- Relate to Phase 1.10: key/value state, .get() vs [] for missing keys (use optional chaining and ?? in JS).

---

## 1) Literals and Properties

- [Expand: const obj = { a: 1, b: "two", "key-with-dash": 3 }; keys are strings (or symbols).]
- [Expand: dot: obj.a; bracket: obj["key-with-dash"], obj[variable].]
- [Expand: add/update: obj.c = 4; delete obj.c; or obj.c = undefined.]

---

## 2) Methods

- [Expand: method = function as property: { greet() { return "hi"; } } or { greet: function() { } }.]
- [Expand: this inside method refers to the object when called as obj.greet(); arrow functions don’t bind this.]
- [Expand: use method shorthand in object literals.]

---

## 3) Spread and Copying

- [Expand: const copy = { ...obj }; shallow copy; nested objects still shared.]
- [Expand: merge: { ...defaults, ...overrides }; later keys win.]
- [Expand: immutable update: { ...obj, key: newValue }.]

---

## 4) Destructuring

- [Expand: const { a, b } = obj; const { a: alias } = obj; default: const { a = 0 } = obj.]
- [Expand: rest in destructuring: const { a, ...rest } = obj.]
- [Expand: Bridge to Phase 1.10: named systems; in JS use obj.key ?? default or optional chaining.]

---

## Summary

- Objects: literals, dot/bracket access, methods; spread for copy/merge; destructuring for extraction.
- Optional chaining and nullish coalescing handle missing keys; objects map to Phase 1.10 key/value model.

---

## Bridge / Next

Next: **Chapter 2.6.10 — Arrays**.

---

*Expansion note for ChatGPT: One object literal, one spread, one destructuring example. Target ~150 lines.*
