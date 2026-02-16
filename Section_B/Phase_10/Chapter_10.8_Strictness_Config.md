# Phase 5.5 · Chapter 5.5.8: Strictness and Configuration

tsconfig.json; strict mode; target and module; path mapping. Balancing safety and migration.

---

## Learning Objectives

- Create and adjust tsconfig.json: compilerOptions (target, module, strict, outDir, rootDir).
- Enable strict (or strictNullChecks, noImplicitAny) for stronger checking; fix resulting errors.
- Set target (ES2020, etc.) and module (commonjs, ESNext); match Node or bundler.
- Use paths for aliases (e.g. @/utils); baseUrl; optional for small projects.

---

## 1) tsconfig.json Basics

- [Expand: { "compilerOptions": { "target": "ES2020", "module": "commonjs", "outDir": "dist", "strict": true }, "include": ["src/**/*"] }]
- [Expand: tsc reads tsconfig.json; or tsc -p .; exclude for node_modules.]
- [Expand: extend: "extends": "./base.json" for shared config.]

---

## 2) strict Mode

- [Expand: "strict": true enables multiple flags: strictNullChecks, noImplicitAny, etc.]
- [Expand: strictNullChecks: null/undefined only where typed; noImplicitAny: must type or infer.]
- [Expand: migrate: enable one flag at a time; fix errors; or start new project with strict.]

---

## 3) target and module

- [Expand: target: ES5, ES2020, etc.; what JS is emitted; match Node version or browser support.]
- [Expand: module: commonjs for Node; ESNext or Node16 for ESM; match package.json "type".]
- [Expand: moduleResolution: node or node16; affects how imports resolve.]

---

## 4) Paths and baseUrl

- [Expand: "baseUrl": ".", "paths": { "@/*": ["src/*"] }; import from '@/utils';]
- [Expand: tsc doesn’t rewrite paths in output; bundler (esbuild, webpack) can resolve; or use tsc-alias.]
- [Expand: homestead: simple project may not need paths; use for larger structure.]

---

## Summary

- tsconfig: target, module, strict, outDir; enable strict for safety; paths optional; match your runtime.

---

## Bridge / Next

Next: **Chapter 5.5.9 — TypeScript with Node and Express**.

---

*Expansion note for ChatGPT: One minimal tsconfig and one strict fix tip. Target ~150 lines.*
