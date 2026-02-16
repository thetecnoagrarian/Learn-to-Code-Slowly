# Phase 2.6 · Chapter 2.6.1: What JavaScript Is

Where JS runs (browser, Node); engines; syntax and execution; scripts vs modules. Bridge to Phase 0.1 and Phase 1.1.

---

## Learning Objectives

- Name the two main environments: browser and Node.js (server/CLI).
- Understand that "JavaScript" is the language; engines (V8, etc.) run it.
- Distinguish script execution (top-to-bottom) from modules (import/export).
- Connect to Phase 0.1 (programs as systems) and Phase 1.1 (Python program model).

---

## 1) Where JavaScript Runs

- [Expand: browsers: JS runs in the page; has DOM, window, fetch; no file system.]
- [Expand: Node.js: JS runs on the server or in CLI; has require, process, file system; no DOM.]
- [Expand: same language, different APIs and globals.]

---

## 2) Engines and Execution

- [Expand: engine (e.g. V8) parses and executes JS; Chrome and Node use V8.]
- [Expand: execution: synchronous by default; async via callbacks, Promises, event loop.]
- [Expand: one thread per context; no shared memory between tabs or worker threads (concept).]

---

## 3) Scripts vs Modules

- [Expand: classic script: top-to-bottom; global scope; no import/export.]
- [Expand: module: import/export; strict by default; deferred execution; reusable in Node and modern browsers.]
- [Expand: type="module" in browser; .mjs or "type": "module" in Node.]

---

## 4) Bridge to Phase 0.1 and 1.1

- [Expand: Phase 0.1: programs transform input + state → output + new state; same in JS.]
- [Expand: Phase 1.1: execution order, runtime world, scripts vs systems—JS has same concepts.]
- [Expand: variables, functions, and control flow will feel familiar after Python.]

---

## Summary

- JavaScript runs in browsers (DOM, fetch) and in Node (server, CLI); same language, different environments.
- Engines execute JS; scripts run top-to-bottom; modules use import/export and run in module mode.
- Mental models from Phase 0 and Phase 1 apply: state, execution order, boundaries.

---

## Bridge / Next

Next: **Chapter 2.6.2 — Variables and Declarations**.

---

*Expansion note for ChatGPT: Expand each section; one short code snippet for script vs module. Target ~150 lines.*
