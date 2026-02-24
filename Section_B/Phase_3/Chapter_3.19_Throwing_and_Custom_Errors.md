# Section B Phase 3 · Chapter 3.19: Throwing and Custom Errors

throw; Error and custom error types; when to throw; rethrowing and error boundaries. Builds on Chapter 3.12 (Error Handling). Next: Chapter 3.20 (Strict Mode).

---

## Learning Objectives

- Throw errors with throw new Error(message) and use custom Error subclasses when useful.
- Know when to throw (validation, invariants) vs return or handle locally.
- Rethrow after logging or wrapping; avoid swallowing errors.

---

## 1) Throwing Errors

- [Expand: throw new Error("message"); execution stops unless caught. throw any value (prefer Error).]
- [Expand: custom errors: class MyError extends Error; name and message; stack trace.]

---

## 2) When to Throw and When Not

- [Expand: throw for programming errors, invalid state, failed invariants; consider return/Result for expected failures.]
- [Expand: homestead: throw on invalid sensor config, missing required field; catch at boundary.]

---

## 3) Rethrowing and Error Boundaries

- [Expand: catch, log or enrich, then rethrow so caller can handle. Avoid catch that does nothing.]
- [Expand: error boundaries in UI (concept); same idea in async chains.]

---

## Summary

- throw for unrecoverable or invariant violations; custom errors for clarity.
- Rethrow after handling so callers can react; don’t swallow.

---

## Next

Next: **Chapter 3.20: Strict Mode and Robust Code**.
