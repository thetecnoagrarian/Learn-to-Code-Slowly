# Phase 3.5 · Chapter 3.5.10: Testing in Your Workflow

Running tests before commit; CI (concept); tests as part of Phase 3 and Phase 9 integration.

---

## Learning Objectives

- Run tests locally before committing (npm test); fix or skip intentionally with care.
- Understand CI: run tests on every push/PR; block merge if tests fail; optional coverage gates.
- Integrate tests with Phase 3 (Express) and Phase 9 (better-sqlite3): test API and DB layer.
- Keep tests fast so they're run often; separate slow E2E if needed.

---

## 1) Before Commit

- [Expand: habit: npm test before git commit; fix failing tests or revert change.]
- [Expand: skip with it.skip or describe.skip only when necessary; add ticket to fix.]
- [Expand: new feature or bugfix: add or update tests as part of the change.]

---

## 2) CI (Concept)

- [Expand: CI runs npm install && npm test on every push (or PR); report pass/fail.]
- [Expand: optional: fail if coverage drops below threshold; block merge on red.]
- [Expand: GitHub Actions, GitLab CI, etc.; config in repo; no deep dive here.]

---

## 3) Tests in Phase 3 and Phase 9

- [Expand: Phase 3: test routes with supertest; mock or in-memory store; test validation and errors.]
- [Expand: Phase 9: test DB layer with real better-sqlite3 in-memory or test file; test repo functions.]
- [Expand: integration: route that uses DB—mock DB in unit-style route test or use test DB in integration test.]

---

## 4) Keeping Tests Fast

- [Expand: unit tests: no real I/O; mock DB and HTTP; run in milliseconds.]
- [Expand: integration: in-memory or fast DB; avoid starting real external services in every test.]
- [Expand: slow tests get skipped; fast tests get run on every save.]

---

## Summary

- Run tests before commit; use CI to run on push/PR; integrate tests with Phase 3 and Phase 9.
- Keep tests fast so they're run often; add tests with new code.

---

## Bridge / Next

Phase 3.5 complete. Next: **Phase 4 — CSS Fundamentals** or **Phase 4.5 — DOM and Browser JavaScript** (per path).

---

*Expansion note for ChatGPT: One npm test + CI sentence; one "what to test in Phase 3" list. Target ~150 lines.*
