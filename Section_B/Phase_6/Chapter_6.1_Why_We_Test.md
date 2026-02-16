# Phase 3.5 · Chapter 3.5.1: Why We Test

Confidence, regression prevention, documentation of behavior; tests as executable specs. Bridge to Phase 0.8 (Boundaries) and Phase 0.10 (Failure Is Normal).

---

## Learning Objectives

- Explain how tests give confidence to change code and catch regressions.
- Describe tests as living documentation of behavior (executable specs).
- Connect testing to Phase 0.8 (boundaries—validate at edges) and Phase 0.10 (failure is normal—test failure paths).
- Motivate the rest of Phase 3.5: runners, assertions, mocking, testing Express.

---

## 1) Confidence and Regression

- [Expand: tests verify behavior; when you refactor or add features, tests tell you if something broke.]
- [Expand: regression = previously working behavior stops working; tests catch it before deploy.]
- [Expand: homestead: sensor API returns correct shape; threshold logic still works after change.]

---

## 2) Tests as Documentation

- [Expand: test names and structure describe what the code does; new devs read tests to understand.]
- [Expand: executable specs: if tests pass, the contract is met.]
- [Expand: keep tests readable; they are the first place to look when behavior is unclear.]

---

## 3) Bridge to Phase 0.8 and 0.10

- [Expand: Phase 0.8: boundaries—validate at edges; tests are a way to assert boundary behavior (valid input, invalid input).]
- [Expand: Phase 0.10: failure is normal—tests should cover error paths, missing data, invalid input.]
- [Expand: testing is a discipline that reinforces boundary and failure thinking.]

---

## 4) What We'll Cover

- [Expand: unit vs integration vs E2E; test runners (Jest); assertions; mocking; testing Express routes; coverage.]
- [Expand: goal: enough to test Phase 3 APIs and critical logic with confidence.]

---

## Summary

- Tests provide confidence and prevent regressions; they document behavior as executable specs.
- Testing aligns with boundaries and failure-as-normal; Phase 3.5 builds the skills to test Express and logic.

---

## Bridge / Next

Next: **Chapter 3.5.2 — Unit vs Integration vs E2E**.

---

*Expansion note for ChatGPT: Expand each section; one "before/after tests" motivation. Target ~150 lines.*
