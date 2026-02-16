# Phase 2.6 · Chapter 2.6.16: JSON in JavaScript

JSON.stringify and JSON.parse; when JSON is used; limits and safety. Bridge to Phase 2.19 and Phase 2.7.

---

## Learning Objectives

- Use JSON.stringify to serialize objects to JSON string; JSON.parse to parse JSON string to object.
- Handle non-JSON-serializable values (undefined, functions, cycles) and parse errors.
- Use JSON for APIs (request/response bodies), config files, and storage. Bridge to Phase 2.19 (request bodies) and Phase 2.7 (JSON in Node).

---

## 1) JSON.stringify

- [Expand: JSON.stringify(value, replacer?, space?); produces string; undefined, functions, symbols omitted; arrays skip "holes".]
- [Expand: replacer: array of keys or function(key, value); space: indent for readability.]
- [Expand: circular references throw; use replacer or library for cycles if needed.]

---

## 2) JSON.parse

- [Expand: JSON.parse(string, reviver?); reviver(key, value) can transform values during parse.]
- [Expand: throws if invalid JSON; wrap in try/catch when parsing untrusted input.]
- [Expand: dates, undefined: not in JSON; use reviver to restore Date or custom types.]

---

## 3) When JSON Is Used

- [Expand: HTTP bodies: fetch/Express send and receive JSON; Content-Type: application/json.]
- [Expand: config files: package.json, .json configs; read file then JSON.parse.]
- [Expand: storage: localStorage, sessionStorage; persist as string.]
- [Expand: Bridge to Phase 2.19 (bodies) and 2.7 (Node, config).]

---

## 4) Limits and Safety

- [Expand: no functions, undefined, comments; numbers are decimal only; keys must be double-quoted.]
- [Expand: parsing untrusted data: validate after parse; be aware of prototype pollution in very old envs.]
- [Expand: large documents: consider streaming or chunking in Node.]

---

## Summary

- JSON.stringify for serialization; JSON.parse for parsing; use reviver/replacer when needed.
- JSON is the lingua franca for APIs and config; know its limits and validate parsed data.

---

## Bridge / Next

Phase 2.6 complete. Next: **Phase 2.7 — Node.js, npm, and JSON** (runtime, packages, JSON in Node).

---

*Expansion note for ChatGPT: One stringify and one parse example; mention Content-Type. Target ~150 lines.*
