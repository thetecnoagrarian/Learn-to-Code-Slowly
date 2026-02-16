# Phase 2.6 · Chapter 2.6.12: Error Handling

try, catch, finally; throw; Error types; async errors. Bridge to Phase 0.6 and 0.10.

---

## Learning Objectives

- Use try/catch/finally to handle exceptions; catch receives error object.
- Throw errors with throw new Error("message"); use built-in types (TypeError, RangeError) when appropriate.
- Handle errors in async code (try/catch around await; .catch on promises).
- Connect to Phase 0.6 (errors and failure) and Phase 0.10 (failure is normal).

---

## 1) try, catch, finally

- [Expand: try { risky(); } catch (e) { handle(e); } finally { cleanup(); }.]
- [Expand: catch binds error; use e.message, e.name; optionally rethrow after logging.]
- [Expand: finally runs whether or not exception occurred; for cleanup.]

---

## 2) throw and Error Types

- [Expand: throw new Error("message"); throw new TypeError("..."); custom subclasses possible.]
- [Expand: throw any value (Error preferred so stack trace and message are standard).]
- [Expand: callers can catch and handle or let propagate.]

---

## 3) Async Errors

- [Expand: try/catch around await in async function catches rejected promise.]
- [Expand: promise.catch(handler) for promise chains without async/await.]
- [Expand: unhandled rejections: ensure .catch or try/catch so errors don’t disappear.]

---

## 4) Bridge to Phase 0.6 and 0.10

- [Expand: Phase 0.6: assumptions break; design for failure; Phase 0.10: missing data, partial truth.]
- [Expand: validate at boundaries; throw or return Result-style; catch at appropriate layer.]
- [Expand: don’t swallow errors; log and rethrow or handle intentionally.]

---

## Summary

- Use try/catch/finally; throw Error (or subtypes); handle async errors with try/await or .catch.
- Design for failure; validate at boundaries; don’t hide errors.

---

## Bridge / Next

Next: **Chapter 2.6.13 — Asynchronous JavaScript: Callbacks and Promises**.

---

*Expansion note for ChatGPT: One sync and one async error example. Target ~150 lines.*
