# Phase 2.6 · Chapter 2.6.10: Arrays

Creating and indexing; push, pop, shift, unshift; map, filter, reduce; iteration. Bridge to Phase 1.9 (lists).

---

## Learning Objectives

- Create arrays with [] and length; access by index (0-based); length and sparse arrays.
- Mutate with push, pop, shift, unshift, splice; know when methods mutate vs return new array.
- Use map, filter, reduce for transformation and aggregation; use for...of to iterate.
- Relate to Phase 1.9: lists, indexing, iteration, mutability.

---

## 1) Creating and Indexing

- [Expand: const arr = [1, 2, 3]; arr[0]; arr.length; arr[arr.length - 1] for last.]
- [Expand: sparse: [1, , 3]; length can be larger than highest index; avoid when possible.]
- [Expand: arrays are objects; keys are string indices; typeof [] is "object"; Array.isArray(arr).]

---

## 2) Mutating: push, pop, shift, unshift, splice

- [Expand: push(el), pop(); unshift(el), shift(); splice(start, deleteCount, ...items).]
- [Expand: these change the array in place; return value varies (pop returns removed element).]
- [Expand: prefer non-mutating when you need to keep original (slice, concat, spread).]

---

## 3) map, filter, reduce

- [Expand: map(fn)—new array, each element transformed; filter(fn)—new array, elements where fn true; reduce(fn, init)—single value.]
- [Expand: callback receives (element, index, array); use for data pipelines.]
- [Expand: chain: arr.filter(...).map(...).reduce(...).]

---

## 4) Iteration and Bridge to Phase 1.9

- [Expand: for...of for values; forEach for side effects; map/filter/reduce for transformation.]
- [Expand: Phase 1.9: lists, indexing, slicing, iteration—same concepts in JS with different syntax.]
- [Expand: mutability: same tradeoffs as Python lists.]

---

## Summary

- Arrays: index 0-based; push/pop/shift/unshift/splice mutate; map/filter/reduce for transformation.
- Prefer for...of and array methods; use Array.isArray; relate to Phase 1.9 lists.

---

## Bridge / Next

Next: **Chapter 2.6.11 — Strings and Template Literals**.

---

*Expansion note for ChatGPT: One map, one filter, one reduce example. Target ~150 lines.*
