# Phase 3.5 · Chapter 3.5.9: Coverage and What It Means

Line/statement coverage; what coverage does and doesn't guarantee; coverage as signal, not goal.

---

## Learning Objectives

- Run coverage (e.g. jest --coverage); read line/statement and branch coverage reports.
- Understand that high coverage does not mean "no bugs"; uncovered code is risky.
- Use coverage to find untested code and critical paths; don't chase 100% for its own sake.
- Prefer meaningful tests over coverage number; cover boundaries and failure paths.

---

## 1) Generating and Reading Coverage

- [Expand: jest --coverage or npm test -- --coverage; creates coverage/ folder and summary.]
- [Expand: line/statement: % of lines executed; branch: % of branches (if/else) taken.]
- [Expand: focus on critical modules and low numbers; fix obvious gaps first.]

---

## 2) What Coverage Does and Doesn't Guarantee

- [Expand: does: shows which code ran during tests; uncovers dead code and blind spots.]
- [Expand: doesn't: guarantee correct behavior; one assertion can "cover" a line but not assert the right thing.]
- [Expand: 100% coverage with weak assertions is less valuable than 80% with strong assertions.]

---

## 3) Coverage as Signal

- [Expand: use coverage to find "we never test this file" or "this branch is never hit."]
- [Expand: add tests for boundaries and errors where coverage is low and risk is high.]
- [Expand: don't add trivial tests just to raise the number.]

---

## 4) What to Cover First

- [Expand: validation at boundaries; error paths (4xx, 5xx); critical business logic (thresholds, calculations).]
- [Expand: Phase 3: routes, validation, error middleware; then helpers and utilities.]
- [Expand: homestead: sensor validation, route status codes, error handler.]

---

## Summary

- Coverage shows what ran; it doesn't prove correctness. Use it to find gaps; prioritize boundaries and failures.
- Meaningful tests over coverage percentage; cover critical paths and errors first.

---

## Bridge / Next

Next: **Chapter 3.5.10 — Testing in Your Workflow**.

---

*Expansion note for ChatGPT: One coverage command and one "what to cover" list. Target ~150 lines.*
