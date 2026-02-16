# Phase 4.5 · Chapter 4.5.8: Script Loading — defer, async, modules

Where to put script tags; blocking vs defer vs async; type="module" and imports; DOMContentLoaded.

---

## Learning Objectives

- Place script tags: traditionally at end of body (so DOM exists); or in head with defer.
- Use defer (scripts run in order after HTML parse) and async (run when ready, order not guaranteed); prefer defer for dependencies.
- Use type="module" for ES modules; deferred by default; import/export; strict.
- Use DOMContentLoaded when you need DOM ready (e.g. querySelector) and script runs early.

---

## 1) Where to Put script

- [Expand: end of body: DOM is ready when script runs; no need for DOMContentLoaded.]
- [Expand: head with defer: parse continues; scripts run after parse in order.]
- [Expand: avoid blocking script in head without defer (blocks parsing).]

---

## 2) defer vs async

- [Expand: defer: download in parallel, run in order after parse; use when scripts depend on each other.]
- [Expand: async: download and run when ready; order not guaranteed; use for independent scripts (analytics).]
- [Expand: no attribute: blocks parsing until run; avoid for external scripts.]

---

## 3) type="module"

- [Expand: <script type="module" src="app.js">; deferred by default; CORS applies; import/export work.]
- [Expand: modules run in strict mode; top-level await allowed in modules.]
- [Expand: use for modern app entry; bundle or serve as module.]

---

## 4) DOMContentLoaded

- [Expand: document.addEventListener('DOMContentLoaded', () => { }); fires when HTML parsed, before images etc.]
- [Expand: use when script is in head (no defer) and you need DOM; or when you need "DOM ready" explicitly.]
- [Expand: window.load = all resources; DOMContentLoaded is usually enough for DOM scripting.]

---

## Summary

- Script at end of body or head with defer; defer for order, async for independent; type="module" for ES modules; DOMContentLoaded when needed.

---

## Bridge / Next

Next: **Chapter 4.5.9 — Forms and the DOM**.

---

*Expansion note for ChatGPT: One defer and one module example. Target ~150 lines.*
