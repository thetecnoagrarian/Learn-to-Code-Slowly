# Phase 3.5 · Chapter 3.5.2: Unit vs Integration vs E2E

Unit: single function/module in isolation. Integration: multiple units (e.g. route + DB). E2E: full stack. When to use each; pyramid.

---

## Learning Objectives

- Define unit test (one function or module in isolation; dependencies mocked).
- Define integration test (several units together; e.g. route handler + DB or real service).
- Define E2E test (full application; real browser or HTTP client hitting real server).
- Apply the test pyramid: many unit, fewer integration, few E2E; when to use each.

---

## 1) Unit Tests

- [Expand: test one function or small module; mock external deps (DB, HTTP, file system).]
- [Expand: fast, many, focused; catch logic bugs and refactor safely.]
- [Expand: example: pure function that computes threshold; no Express, no DB.]

---

## 2) Integration Tests

- [Expand: test interaction of components; e.g. route + middleware + (maybe in-memory or test DB).]
- [Expand: slower than unit; catch integration bugs (wrong status code, missing header, DB wiring).]
- [Expand: example: request to GET /sensors returns 200 and JSON array; no real browser.]

---

## 3) E2E Tests

- [Expand: full stack: real server, real or test DB, HTTP client or browser; user journey.]
- [Expand: slowest, fewest; catch full-stack and environment issues.]
- [Expand: when: critical paths (login, checkout); not every edge case.]

---

## 4) The Pyramid

- [Expand: base: many unit tests (fast, cheap); middle: integration (key flows); top: few E2E (smoke/critical).]
- [Expand: Phase 3.5 focus: unit for logic; integration for Express routes (supertest).]
- [Expand: homestead: unit for validation/threshold; integration for /sensors, /sensors/:id.]

---

## Summary

- Unit = one unit, mocked deps; integration = several units; E2E = full app. Pyramid: many unit, fewer integration, few E2E.
- Use unit for logic; integration for API routes; E2E for critical paths.

---

## Bridge / Next

Next: **Chapter 3.5.3 — Test Runners and Structure**.

---

*Expansion note for ChatGPT: One example each of unit vs integration. Target ~150 lines.*
