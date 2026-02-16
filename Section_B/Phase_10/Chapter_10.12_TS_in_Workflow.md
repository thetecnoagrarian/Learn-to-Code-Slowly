# Phase 5.5 · Chapter 5.5.12: TypeScript in Your Workflow

tsc and watch mode; IDE support; migrating a small Express project to TS; Phase 9 (better-sqlite3) with types.

---

## Learning Objectives

- Run tsc to compile; tsc --watch for continuous compile; or use ts-node for run without separate compile.
- Use IDE (VS Code, etc.) for errors, refactor, go-to-definition; fix errors as you code.
- Migrate a small Express app: add tsconfig, rename to .ts, add types to routes and body; run with ts-node or build then node.
- Type Phase 9 better-sqlite3: type query results with interface; use @types/better-sqlite3 if available or declare module.

---

## 1) tsc and Watch

- [Expand: tsc compiles all .ts in project; tsc --watch recompiles on save.]
- [Expand: npm script: "build": "tsc", "start": "node dist/index.js", "dev": "ts-node src/index.ts" or tsx.]
- [Expand: ts-node for dev; build for production; or use tsx for run without precompile.]

---

## 2) IDE Support

- [Expand: VS Code uses TypeScript language service; errors inline; hover for types; F2 rename.]
- [Expand: fix errors as you go; use quick fix (lightbulb) for common fixes.]
- [Expand: strict mode helps; don’t suppress with @ts-ignore unless temporary.]

---

## 3) Migrating Express to TS

- [Expand: 1) Add tsconfig.json (strict, target, outDir). 2) Rename .js to .ts. 3) Add types to req, res, body, params. 4) Fix errors. 5) Add types for DB and services.]
- [Expand: start with one route; then middleware; then app entry; then tests (Jest with ts-jest or similar).]
- [Expand: homestead: take Phase 3 sensor API; add TS; type Sensor, SensorCreate, route handlers.]

---

## 4) Phase 9 (better-sqlite3) with Types

- [Expand: db.prepare('SELECT * FROM sensors').all() returns unknown or any; type as Sensor[] with interface Sensor.]
- [Expand: const rows = db.prepare('...').all() as Sensor[]; or use generic if lib supports it.]
- [Expand: @types/better-sqlite3 for Database, Statement types; result rows still need your interface.]
- [Expand: type repo layer: getById(id: number): Promise<Sensor | null>; implementation returns typed result.]

---

## Summary

- tsc and watch; IDE for errors and refactor; migrate Express stepwise; type Phase 9 DB layer with interfaces.

---

## Bridge / Next

Phase 5.5 complete. Next: **Section B — Phase 6 SQL Foundations** or **Phase 9 better-sqlite3** (Node + DB) per learning path.

---

*Expansion note for ChatGPT: One migration checklist and one better-sqlite3 typing note. Target ~150 lines.*
