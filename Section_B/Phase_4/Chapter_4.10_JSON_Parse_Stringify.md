# Phase 2.7 · Chapter 2.7.10: JSON — Parsing and Serialization

JSON.parse (and reviver); JSON.stringify (and replacer, space); error handling; use in APIs and config files.

---

## Learning Objectives

- Parse JSON with JSON.parse; handle parse errors with try/catch.
- Use reviver to transform values during parse (e.g. date strings to Date).
- Serialize with JSON.stringify; use replacer and space for filtering and pretty-print.
- Apply parse/stringify when reading config files and when building API responses in Node.

---

## 1) JSON.parse

- [Expand: JSON.parse(string); throws if invalid; wrap in try/catch for untrusted input.]
- [Expand: reviver(key, value)—called for each key-value; return transformed value or original.]
- [Expand: use reviver to revive Date or custom types stored as strings.]

---

## 2) JSON.stringify

- [Expand: JSON.stringify(value, replacer?, space?); undefined, functions, symbols omitted.]
- [Expand: replacer: array of keys or function(key, value); space: number or string for indent.]
- [Expand: circular references throw; handle with replacer or omit circular refs.]

---

## 3) Error Handling

- [Expand: try { JSON.parse(input); } catch (e) { ... } for invalid JSON.]
- [Expand: validate or sanitize after parse when input is from user or network.]
- [Expand: config files: fail fast with clear message if parse fails.]

---

## 4) APIs and Config in Node

- [Expand: read config: const data = JSON.parse(fs.readFileSync("config.json", "utf8"));]
- [Expand: API response: res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(data)).]
- [Expand: Express: res.json(data) does stringify and Content-Type for you (Phase 3).]

---

## Summary

- JSON.parse (with optional reviver) and JSON.stringify (replacer, space); handle parse errors.
- Use for config files and API bodies in Node; Express res.json builds on this.

---

## Bridge / Next

Next: **Chapter 2.7.11 — Environment and Configuration in Node**.

---

*Expansion note for ChatGPT: One parse and one stringify example with options. Target ~150 lines.*
