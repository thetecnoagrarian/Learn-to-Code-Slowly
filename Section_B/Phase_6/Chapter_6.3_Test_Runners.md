# Phase 3.5 · Chapter 3.5.3: Test Runners and Structure

Jest (or similar): describe, it, expect. File naming (e.g. *.test.js). Running tests (npm test). Organizing tests by phase/module.

---

## Learning Objectives

- Use describe and it (or test) to structure tests; one assertion focus per it.
- Name test files consistently (*.test.js or __tests__/*.js); run with npm test.
- Organize tests by module or feature (sensors.test.js, validation.test.js).
- Run only some tests (pattern, file) when iterating.

---

## 1) describe and it

- [Expand: describe('module or feature', () => { it('does something', () => { ... }); }); nesting describe for subgroups.]
- [Expand: it('should return 200', ...) or it('returns 200', ...); one behavior per it.]
- [Expand: test and it are the same in Jest.]

---

## 2) File Naming and Location

- [Expand: *.test.js or *.spec.js next to source; or __tests__/ folder; Jest finds by config (testMatch).]
- [Expand: same name as module: routes/sensors.js → routes/sensors.test.js or __tests__/sensors.test.js.]
- [Expand: keep tests close to code or in dedicated tree; consistent pattern.]

---

## 3) Running Tests

- [Expand: npm test runs Jest (or script in package.json: "test": "jest").]
- [Expand: jest --watch for watch mode; jest path/to/file for one file; jest -t "name" for name pattern.]
- [Expand: CI: run npm test on every push or PR.]

---

## 4) Organizing by Phase/Module

- [Expand: group by feature: describe('GET /sensors', () => { ... }); describe('POST /sensors', () => { ... }).]
- [Expand: shared setup in beforeEach; cleanup in afterEach when needed.]
- [Expand: homestead: sensors.test.js, config.test.js, validation.test.js.]

---

## Summary

- describe/it structure; *.test.js naming; npm test and Jest CLI; organize by feature or module.
- One clear behavior per it; use beforeEach/afterEach for setup/teardown.

---

## Bridge / Next

Next: **Chapter 3.5.4 — Writing Assertions**.

---

*Expansion note for ChatGPT: One describe/it block example. Target ~150 lines.*
