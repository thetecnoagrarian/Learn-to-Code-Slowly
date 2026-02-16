# Phase 2.6 · Chapter 2.6.13: Asynchronous JavaScript — Callbacks and Promises

Event loop; callbacks; Promises (then, catch); chaining; Promise.all and Promise.race.

---

## Learning Objectives

- Understand that JS is single-threaded; async work is scheduled (event loop).
- Use callbacks for async completion (e.g. node-style (err, data)); understand callback hell.
- Create and consume Promises: new Promise; .then, .catch, .finally; chaining.
- Use Promise.all (wait all) and Promise.race (first to settle).

---

## 1) Event Loop and Callbacks

- [Expand: single thread; long work is offloaded or deferred; callbacks run when I/O completes.]
- [Expand: callback pattern: doSomething((err, result) => { }); err-first convention in Node.]
- [Expand: nesting callbacks leads to hard-to-read code; Promises and async/await fix that.]

---

## 2) Promises — then, catch, finally

- [Expand: Promise = eventual value (or rejection); .then(onFulfilled, onRejected?), .catch(onRejected), .finally(cleanup).]
- [Expand: .then returns a new Promise; chain: fetch(url).then(r => r.json()).then(data => ...).catch(...).]
- [Expand: rejections propagate until caught.]

---

## 3) Creating Promises

- [Expand: new Promise((resolve, reject) => { ... call resolve(value) or reject(error); }).]
- [Expand: Promise.resolve(x), Promise.reject(e) for wrapping values.]
- [Expand: avoid "promisification" by hand when util.promisify or library exists.]

---

## 4) Promise.all and Promise.race

- [Expand: Promise.all([p1, p2, p3])—fulfills when all fulfill (array of results); rejects when first rejects.]
- [Expand: Promise.race([p1, p2])—settles when first settles (fulfill or reject).]
- [Expand: use all for parallel work; race for timeouts or first response.]

---

## Summary

- Event loop runs async callbacks; Promises represent eventual result; .then/.catch/.finally for flow.
- Chain Promises; use Promise.all for parallel, Promise.race for first-to-settle.

---

## Bridge / Next

Next: **Chapter 2.6.14 — Asynchronous JavaScript: async/await**.

---

*Expansion note for ChatGPT: One promise chain and one Promise.all example. Target ~150 lines.*
