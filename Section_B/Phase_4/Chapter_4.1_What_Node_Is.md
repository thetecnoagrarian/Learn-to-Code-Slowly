# Phase 2.7 · Chapter 2.7.1: What Node.js Is

V8 and libuv; Node as runtime; no DOM; process and global; why Node for servers. Bridge to Phase 2 (HTTP server will run in Node).

---

## Learning Objectives

- Describe Node.js as a JavaScript runtime (V8 + libuv + APIs).
- Explain what Node has (fs, http, process) and doesn’t have (DOM, window) compared to the browser.
- Use process and global as the top-level environment.
- Connect to Phase 2: HTTP servers are built in Node; Express (Phase 3) runs on Node.

---

## 1) V8 and libuv

- [Expand: V8 = JavaScript engine (Chrome); libuv = event loop and async I/O (files, network).]
- [Expand: Node = V8 + libuv + C++ bindings + core modules (fs, http, path, etc.).]
- [Expand: single-threaded JS; I/O is non-blocking via libuv.]

---

## 2) Node as Runtime

- [Expand: you run node script.js or node --experimental-modules for ESM.]
- [Expand: no browser globals (window, document); instead: global, process, require or import.]
- [Expand: Node is for servers, CLI tools, build scripts; not for DOM manipulation.]

---

## 3) process and global

- [Expand: process.env—environment variables; process.argv—CLI args; process.cwd()—current directory.]
- [Expand: global—global object (like window in browser); avoid polluting it.]
- [Expand: process.exit(code); process.on("uncaughtException", ...) for last-resort handling.]

---

## 4) Why Node for Servers

- [Expand: same language as browser (JS); non-blocking I/O fits request/response model.]
- [Expand: npm ecosystem; Phase 3 (Express) runs on Node; Phase 2 HTTP is what Node’s http module implements.]
- [Expand: Bridge: next chapters cover built-in modules and then Express builds on this.]

---

## Summary

- Node = V8 + libuv + Node APIs; no DOM; process and global; single-threaded, non-blocking I/O.
- Node is the runtime for server-side JS and for Express (Phase 3).

---

## Bridge / Next

Next: **Chapter 2.7.2 — Running Node and the REPL**.

---

*Expansion note for ChatGPT: Expand each section; one short script example. Target ~150 lines.*
