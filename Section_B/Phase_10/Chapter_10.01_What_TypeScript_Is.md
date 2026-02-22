# Phase 5.5 · Chapter 5.5.1: What TypeScript Is

Superset of JavaScript; compile to JS; type checking; why types help (documentation, refactors, fewer runtime errors). Bridge to Phase 2.6.

---

## Learning Objectives

- Describe TypeScript as a superset of JavaScript: valid JS is valid TS; TS adds types and compile-time checks.
- Understand that TS compiles (transpiles) to JS; runtime is still JavaScript; no TS at runtime in browser/Node.
- Explain benefits: types as documentation; safer refactors; catch many errors before run; better editor support.
- Connect to Phase 2.6: same syntax and semantics; types are an extra layer.

---

## 1) Superset and Compilation

- [Expand: TS = JS + types; you can rename .js to .ts and add types gradually.]
- [Expand: tsc (TypeScript compiler) outputs .js; target ES version in tsconfig.]
- [Expand: no TypeScript VM; only JavaScript runs; types are erased in output.]

---

## 2) Type Checking

- [Expand: compiler checks types: wrong type passed, missing property, wrong return type → error before run.]
- [Expand: catch typos, wrong argument order, null/undefined misuse.]
- [Expand: strict mode (later chapter) catches more; balance with migration from JS.]

---

## 3) Why Types Help

- [Expand: documentation: function signature shows what it takes and returns.]
- [Expand: refactors: rename or change type → compiler finds all affected places.]
- [Expand: fewer runtime errors: "cannot read property of undefined" caught when type says it might be undefined.]
- [Expand: IDE: autocomplete, go-to-definition, inline errors.]

---

## 4) Bridge to Phase 2.6

- [Expand: Phase 2.6: JS syntax, functions, objects, async—all the same in TS.]
- [Expand: TS adds : Type and interfaces; same mental model; types constrain and document.]
- [Expand: homestead: add types to Express routes and sensor DTOs in Phase 5.5.]

---

## Summary

- TypeScript = JS + types; compiles to JS; type checking catches errors early; helps docs, refactors, and tooling.

---

## Bridge / Next

Next: **Chapter 5.5.2 — Basic Types**.

---

*Expansion note for ChatGPT: One "before/after" example (JS vs TS with types). Target ~150 lines.*
