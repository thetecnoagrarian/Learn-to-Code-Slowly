# Phase 2.6 · Chapter 2.6.6: Loops and Iteration

for, while, do...while; for...of, for...in; break and continue; avoiding infinite loops. Bridge to Phase 0.3.

---

## Learning Objectives

- Use for, while, and do...while; choose the right loop for the situation.
- Use for...of for iterating values (arrays, strings); understand for...in for keys (and its pitfalls with objects).
- Use break and continue to exit or skip iterations.
- Avoid infinite loops (ensure condition eventually becomes false or use break). Bridge to Phase 0.3.

---

## 1) for, while, do...while

- [Expand: for (init; condition; update) { }—classic loop; while (condition) { }; do { } while (condition)—runs at least once.]
- [Expand: same logic as Phase 1.4; condition is checked before each iteration (except do first time).]
- [Expand: off-by-one and infinite loop pitfalls; ensure termination.]

---

## 2) for...of and for...in

- [Expand: for (const item of array)—iterates values; use for arrays, strings, iterables.]
- [Expand: for (const key in object)—iterates keys; includes inherited enumerable properties; not for arrays (use for...of).]
- [Expand: for...in on array gives indices as strings; prefer for...of for arrays.]

---

## 3) break and continue

- [Expand: break—exit loop immediately; continue—skip to next iteration.]
- [Expand: useful in search (break when found) or filter (continue to skip).]
- [Expand: label (rare): break label; for nested loops.]

---

## 4) Bridge to Phase 0.3

- [Expand: Phase 0.3: re-execution over time, termination, drift—same in JS.]
- [Expand: loops are where automation lives; keep termination condition clear.]

---

## Summary

- for/while/do...while for general loops; for...of for values, for...in for object keys (not arrays).
- Use break/continue sparingly; ensure loops terminate.

---

## Bridge / Next

Next: **Chapter 2.6.7 — Functions**.

---

*Expansion note for ChatGPT: One for-loop and one for...of example. Target ~150 lines.*
