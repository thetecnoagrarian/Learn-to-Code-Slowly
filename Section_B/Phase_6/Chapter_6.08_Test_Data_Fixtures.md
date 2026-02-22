# Phase 3.5 · Chapter 3.5.8: Test Data and Fixtures

Fixtures for consistent input; factories vs static JSON; cleaning up (beforeEach/afterEach). Seeding test DB when needed.

---

## Learning Objectives

- Use fixtures (static or factory) to get consistent test data; avoid hardcoding in every test.
- Clean state in beforeEach or afterEach so tests don't affect each other.
- Seed in-memory or test DB when testing queries or list endpoints; clear between tests.
- Prefer small, readable fixtures over large dumps.

---

## 1) Fixtures and Factories

- [Expand: fixtures: const sensors = [{ id: 1, name: 'temp', value: 22 }]; import or require in test.]
- [Expand: factory: function makeSensor(overrides) { return { id: 1, name: 'temp', value: 22, ...overrides }; }]
- [Expand: use factory when you need variation (ids, invalid data); use static when one case is enough.]

---

## 2) beforeEach and afterEach

- [Expand: beforeEach(() => { store.clear(); }); or db.seed(fixtures); afterEach(() => { db.reset(); });]
- [Expand: ensure each test sees same starting state; no order dependency.]
- [Expand: share app or request in describe; reset data, not app, between tests when possible.]

---

## 3) Seeding Test Data

- [Expand: for GET /sensors: beforeEach: add two sensors to in-memory store; test expects length 2.]
- [Expand: for GET /sensors/:id: seed one sensor; request.get('/sensors/1').expect(200).expect(body).]
- [Expand: avoid real DB; use in-memory or SQLite :memory: if you need SQL.]

---

## 4) Keep Fixtures Small

- [Expand: one or two records per test; only fields that matter for the assertion.]
- [Expand: document why fixture looks that way (e.g. "valid sensor", "missing name for 400").]
- [Expand: homestead: sensor fixtures with name, value, unit; threshold fixtures for validation tests.]

---

## Summary

- Use fixtures (static or factory) for input data; beforeEach/afterEach for clean state.
- Seed minimal data for route tests; keep fixtures small and purposeful.

---

## Bridge / Next

Next: **Chapter 3.5.9 — Coverage and What It Means**.

---

*Expansion note for ChatGPT: One fixture and one beforeEach example. Target ~150 lines.*
