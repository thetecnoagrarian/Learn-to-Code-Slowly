# Phase 4.5 · Chapter 4.5.12: DOM in Your Workflow

When to use vanilla DOM vs frameworks; progressive enhancement; connection to Phase 3 (server-rendered) and Phase 5 (Shoelace).

---

## Learning Objectives

- Choose vanilla DOM when: small interactivity, no build step, or learning; choose framework when: large app, team convention, or heavy state.
- Apply progressive enhancement: page works without JS (form submit, links); JS adds interactivity (fetch, dynamic update).
- Connect to Phase 3: server can render HTML (EJS/Handlebars); JS can enhance with fetch and DOM updates.
- Connect to Phase 5: Shoelace components are DOM elements; you can mix vanilla DOM and components; same events and querySelector.

---

## 1) Vanilla vs Framework

- [Expand: vanilla: no build; full control; can get verbose for large UIs.]
- [Expand: framework (React, Vue, etc.): components, state management, tooling; overhead for small pages.]
- [Expand: homestead dashboard: vanilla DOM + fetch is enough; Phase 5 Shoelace adds components without full framework.]

---

## 2) Progressive Enhancement

- [Expand: base: semantic HTML, form posts to server, links work; no JS required for core task.]
- [Expand: enhance: JS adds fetch instead of full page load; dynamic updates; still works if JS fails (form submit).]
- [Expand: avoid: "empty div + everything in JS" with no fallback.]

---

## 3) Phase 3 and Server-Rendered HTML

- [Expand: Phase 3 serves HTML (res.render); browser gets full HTML; JS can then enhance (e.g. fetch for updates).]
- [Expand: hybrid: server renders list; JS fetches new data and updates list in DOM; or server re-renders on request.]
- [Expand: same DOM APIs whether HTML came from server or was built in JS.]

---

## 4) Phase 5 (Shoelace)

- [Expand: Shoelace = custom elements (e.g. <sl-button>); they are in the DOM; querySelector, events, classList work.]
- [Expand: mix: <sl-card> with vanilla div inside; listen to sl-button click; update DOM with fetch result.]
- [Expand: Phase 4.5 skills apply directly to Phase 5; components are just DOM nodes with more behavior.]

---

## Summary

- Use vanilla DOM for small/medium interactivity; progressive enhancement for resilience; Phase 3 serves HTML, Phase 5 components are DOM.

---

## Bridge / Next

Phase 4.5 complete. Next: **Phase 5 — Web Components (Shoelace)** or **Phase 5.5 — TypeScript** (per path).

---

*Expansion note for ChatGPT: One progressive enhancement example and one Phase 5 connection. Target ~150 lines.*
