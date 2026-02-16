# Phase 2.6 · Chapter 2.6.15: Modules — CommonJS and ES Modules

require and module.exports; import and export; default vs named; Node and browser. Bridge to Phase 1.14.

---

## Learning Objectives

- Use CommonJS in Node: require("module"), module.exports (or exports).
- Use ES modules: import ... from "..."; export and export default; default vs named exports.
- Know Node can use both (type: "module" or .mjs for ESM; .cjs for CommonJS).
- Relate to Phase 1.14: modules and program structure; separation of concerns.

---

## 1) CommonJS (Node)

- [Expand: const x = require("./file"); require("package-name"); module.exports = ... or exports.foo = ....]
- [Expand: synchronous loading; cached by path; one export per module (object or single value).]
- [Expand: Node default for .js unless "type": "module" in package.json.]

---

## 2) ES Modules — import and export

- [Expand: export const foo = 1; export function bar() {}; export default class Baz {}.]
- [Expand: import { foo, bar } from "./file"; import Baz from "./file"; import * as ns from "./file".]
- [Expand: default = single main export; named = multiple; can have both.]

---

## 3) Default vs Named

- [Expand: default: import X from "./f"; one per module; named: import { a, b } from "./f"; many.]
- [Expand: re-export: export { foo } from "./other"; export default from "./other" (if supported).]
- [Expand: tree-shaking and bundlers prefer named exports for unused export removal.]

---

## 4) Node and Browser

- [Expand: Node: "type": "module" or .mjs for ESM; then import/export; .cjs forces CommonJS.]
- [Expand: Browsers: <script type="module">; same import/export; CORS and same-origin apply.]
- [Expand: Bridge to Phase 1.14: split code into modules; clear dependencies and exports.]

---

## Summary

- CommonJS: require and module.exports; ESM: import/export, default and named.
- Node supports both; use "type": "module" for ESM; browsers use script type="module".
- Modules support Phase 1.14-style structure and separation of concerns.

---

## Bridge / Next

Next: **Chapter 2.6.16 — JSON in JavaScript**.

---

*Expansion note for ChatGPT: One require example and one import/export example. Target ~150 lines.*
