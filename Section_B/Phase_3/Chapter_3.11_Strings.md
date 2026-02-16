# Phase 2.6 · Chapter 2.6.11: Strings and Template Literals

String methods; template literals and interpolation; multiline strings.

---

## Learning Objectives

- Use common string methods: length, slice, indexOf, includes, trim, split, toLowerCase, toUpperCase.
- Use template literals (backticks) for interpolation `${expr}` and multiline strings.
- Avoid concatenation with + when template literals are clearer.
- Know strings are immutable; methods return new strings.

---

## 1) String Methods

- [Expand: s.length; s.slice(i, j); s.indexOf(sub); s.includes(sub); s.trim(); s.split(sep); s.toLowerCase(), s.toUpperCase().]
- [Expand: all return new string (or number for indexOf); no in-place mutation.]
- [Expand: substring vs slice (slice accepts negative indices).]

---

## 2) Template Literals

- [Expand: `text ${expression} more`—expression evaluated and coerced to string.]
- [Expand: use for embedding variables, simple expressions, function calls.]
- [Expand: backticks required; ${} for interpolation; escape \` and \${ with backslash.]

---

## 3) Multiline Strings

- [Expand: template literals can span lines; newlines preserved.]
- [Expand: "line1\nline2" vs `line1\nline2`; both valid; template often cleaner for multiline.]
- [Expand: indentation is part of the string; trim if needed.]

---

## 4) When to Use What

- [Expand: simple concatenation: "Hello, " + name still fine; complex: prefer `Hello, ${name}, you have ${count} items`.]
- [Expand: building URLs or JSON: template literals or dedicated helpers; avoid injection (escape user input).]
- [Expand: performance: usually negligible; readability first.]

---

## Summary

- Strings have many methods (slice, indexOf, trim, split, etc.); they return new strings.
- Template literals for interpolation and multiline; use `${}` for expressions.

---

## Bridge / Next

Next: **Chapter 2.6.12 — Error Handling**.

---

*Expansion note for ChatGPT: One method chain and one template literal example. Target ~150 lines.*
