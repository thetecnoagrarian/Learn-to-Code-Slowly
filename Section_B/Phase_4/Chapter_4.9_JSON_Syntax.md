# Phase 2.7 · Chapter 2.7.9: JSON — Syntax and Structure

Objects, arrays, strings, numbers, booleans, null; no functions or undefined; quotes and commas; validity.

---

## Learning Objectives

- Write valid JSON: objects {}, arrays [], strings (double quotes), numbers, true/false, null.
- Know what JSON does not support: functions, undefined, comments, trailing commas, single quotes.
- Validate JSON (syntax); fix common errors (trailing comma, unquoted keys, single quotes).
- Use JSON for config files and API payloads in Node.

---

## 1) Values and Types

- [Expand: object: {"key": "value"}; array: [1, 2]; string: "double quotes only"; number: 42, 3.14; boolean: true, false; null.]
- [Expand: keys must be double-quoted; strings must be double-quoted.]
- [Expand: no undefined, no NaN, no Infinity (invalid in JSON).]

---

## 2) What JSON Does Not Allow

- [Expand: no functions; no undefined; no comments; no trailing commas; no single quotes.]
- [Expand: date: use ISO string and parse in code; custom types: represent as object with type hint.]
- [Expand: JSON5 or similar if you need comments (not standard JSON).]

---

## 3) Validity and Common Errors

- [Expand: trailing comma: {"a": 1,}—invalid; unquoted key: {a: 1}—invalid.]
- [Expand: single quotes: '{'a': 1}'—invalid; use validator or JSON.parse to catch errors.]
- [Expand: escape in strings: \", \\, \n, \t, \uXXXX.]

---

## 4) Use in Node

- [Expand: config.json, package.json; read with fs and JSON.parse.]
- [Expand: API request/response bodies; Content-Type: application/json.]
- [Expand: Bridge to Phase 2.7.10 (parse/stringify) and Phase 3 (Express JSON body).]

---

## Summary

- JSON: objects, arrays, strings (double-quoted), numbers, booleans, null; no functions, undefined, or comments.
- Validate syntax; fix trailing commas and quoting; use for config and APIs in Node.

---

## Bridge / Next

Next: **Chapter 2.7.10 — JSON: Parsing and Serialization**.

---

*Expansion note for ChatGPT: One valid and one invalid JSON example. Target ~150 lines.*
