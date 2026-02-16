# Phase 2.7 · Chapter 2.7.6: Event Loop and Non-Blocking I/O

Single thread; phases of the event loop; setImmediate, process.nextTick; why blocking is fatal. Bridge to Phase 3.17.

---

## Learning Objectives

- Explain that Node runs JS on a single thread; I/O is delegated and non-blocking.
- Describe event loop phases at a high level (timers, I/O, setImmediate, etc.).
- Use setImmediate and process.nextTick when you need to defer work (rare in app code).
- Avoid CPU-heavy or blocking work on the main thread; use worker threads or offload. Bridge to Phase 3.17 (async in Express).

---

## 1) Single Thread and Non-Blocking I/O

- [Expand: one thread runs your JS; fs, http, etc. hand work to libuv; when I/O completes, callback runs.]
- [Expand: while waiting for I/O, Node can handle other requests; blocking that thread blocks everything.]
- [Expand: never use sync fs or long loops without yielding in server code.]

---

## 2) Event Loop Phases

- [Expand: timers (setTimeout, setInterval); I/O callbacks; setImmediate; close callbacks.]
- [Expand: process.nextTick runs between phases (microtask); can starve I/O if used heavily.]
- [Expand: deep detail in Node docs; for now: "async callbacks run when I/O or timers fire."]

---

## 3) setImmediate vs process.nextTick

- [Expand: setImmediate(cb)—run after I/O callbacks in current cycle.]
- [Expand: process.nextTick(cb)—run before next phase; can delay I/O; use sparingly.]
- [Expand: prefer setImmediate for "after this turn"; nextTick for "before anything else."]

---

## 4) Why Blocking Is Fatal

- [Expand: while(true) or heavy CPU blocks the loop; no requests get served.]
- [Expand: Phase 3.17: Express handlers must not block; use async/await for I/O; offload CPU to workers if needed.]
- [Expand: design: all I/O non-blocking; keep handlers fast.]

---

## Summary

- Single thread; I/O is non-blocking via event loop; blocking the loop blocks the server.
- Use setImmediate/nextTick only when needed; avoid sync and CPU-heavy work in request handlers.

---

## Bridge / Next

Next: **Chapter 2.7.7 — npm: Package Management**.

---

*Expansion note for ChatGPT: One diagram or list of phases; one "don’t block" example. Target ~150 lines.*
