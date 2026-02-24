# Section B Phase 3 · Chapter 3.20: Strict Mode and Robust Code

"use strict"; what it changes; modules as strict by default; writing robust, predictable code. Builds on earlier chapters. Next: Chapter 3.21 (Debugging).

---

## Learning Objectives

- Enable strict mode ("use strict" or module scope) and know what it disallows (e.g. undeclared vars, duplicate params).
- Understand that ES modules and class bodies are strict by default.
- Apply habits for robust code: avoid globals, prefer const/let, validate inputs.

---

## 1) What Strict Mode Does

- [Expand: "use strict" at top of file or function; prevents accidental globals, duplicate parameters, delete of plain names, etc.]
- [Expand: modules and class bodies are strict automatically; Node with "type": "module".]

---

## 2) Writing Robust Code

- [Expand: prefer const; use let when reassignment needed; avoid var. Declare variables in smallest scope.]
- [Expand: validate at boundaries; fail fast; homestead: config validation, API response checks.]

---

## Summary

- Strict mode catches common mistakes; use it (or rely on modules).
- Robust habits: const/let, scope, validation at boundaries.

---

## Next

Next: **Chapter 3.21: Debugging and the Console**.
