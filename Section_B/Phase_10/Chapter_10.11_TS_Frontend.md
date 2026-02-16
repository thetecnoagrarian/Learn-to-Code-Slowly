# Phase 5.5 · Chapter 5.5.11: TypeScript with the Frontend (Optional)

Typing DOM (lib "dom"); typing fetch responses; using TS in script type="module" or build step. Connection to Phase 4.5 and Phase 5.

---

## Learning Objectives

- Include "dom" in tsconfig lib so document, HTMLElement, Event are typed; use for Phase 4.5 DOM scripts.
- Type fetch responses and form data; reuse API interfaces from backend or shared types.
- Use TS in browser: build with tsc or bundler (esbuild, Vite) to emit JS; or script type="module" with import maps and TS compile.
- Connect to Phase 4.5 (DOM) and Phase 5 (Shoelace); type event handlers and component props if Shoelace has types.

---

## 1) lib "dom"

- [Expand: "lib": ["ES2020", "DOM"] in tsconfig; gives Document, HTMLElement, addEventListener, etc.]
- [Expand: querySelector returns Element | null; narrow to HTMLElement or cast when you know type.]
- [Expand: event: Event, e.target as HTMLButtonElement; input.value typed when target is HTMLInputElement.]
- [Expand: Phase 4.5 scripts: same DOM code with types; catch typos and wrong property access.]

---

## 2) Typing fetch and Form Data

- [Expand: fetchJson<Sensor[]>(url); FormData from form; type assertion after validation or trust.]
- [Expand: reuse Sensor, SensorCreate from backend types if shared (monorepo or copy); keep API contract in sync.]
- [Expand: frontend: type state and API response; avoid any in event handlers.]

---

## 3) TS in Browser: Build Step

- [Expand: tsc emits JS; script src="dist/app.js"; or use bundler (Vite, esbuild) to bundle and optionally compile TS.]
- [Expand: type="module" with TS: usually compile first; or use import map + separate TS compile.]
- [Expand: homestead: optional; can keep frontend in JS and only use TS in Node/Express.]

---

## 4) Phase 4.5 and Phase 5

- [Expand: Phase 4.5: type handlers (e: MouseEvent), type querySelector result; type fetchJson<T>.]
- [Expand: Phase 5: if Shoelace has types (@shoelace-style/shoelace may ship .d.ts), use for component events and props.]
- [Expand: optional phase: add TS to frontend when you want same safety as backend.]

---

## Summary

- lib "dom" for DOM types; type fetch and forms; build step for TS in browser; optional; connect to Phase 4.5 and 5.

---

## Bridge / Next

Next: **Chapter 5.5.12 — TypeScript in Your Workflow**.

---

*Expansion note for ChatGPT: One DOM typing and one build note. Target ~150 lines.*
