# Phase 5: Web Components & Modern Frontend Development (Shoelace)

Building reusable, accessible web components using Shoelace and understanding modern frontend architecture. Component composition, theming, accessibility, and progressive enhancement. Builds on Phase 4 CSS — you now understand how styles work; Shoelace components give you pre-built, themeable building blocks.

**Key Concepts:** Web Components standard, Shadow DOM, custom elements, component libraries, accessibility, theming

**Prerequisites:** Phase 0, Phase 1, Phase 2, Phase 2.5, Phase 4 (CSS Fundamentals), Phase 4.5 (DOM and Browser JavaScript)

**Depth:** Working knowledge (lesser priority, used for UI polish)

**Reference:** Mozilla MDN woven throughout for web standards

---

## Learning Objectives (Expand for Full Phase)

- [Expand: Understand Web Components: custom elements, Shadow DOM, HTML templates; how Shoelace uses them.]
- [Expand: Add Shoelace to a project: script + styles; or npm install @shoelace-style/shoelace and import.]
- [Expand: Use core components: sl-button, sl-card, sl-input, sl-select, sl-tab-group; slots and attributes.]
- [Expand: Theme Shoelace: CSS custom properties (--sl-color-primary, etc.); light/dark; align with Phase 4 variables.]
- [Expand: Compose components: put sl-card in dashboard grid; sl-button in card; sl-input in forms; events (sl-input sl-change).]
- [Expand: Accessibility: Shoelace components are built with a11y in mind; keyboard, ARIA; verify focus and labels.]
- [Expand: Progressive enhancement: page works without Shoelace (fallback content or server-rendered); enhance with components.]
- [Expand: Homestead: dashboard with sl-card for sensors; sl-badge for status; sl-button for actions; optional sl-dialog for details.]

---

## 1) What Shoelace Is

- [Expand: Shoelace = library of web components (custom elements); works with any framework or vanilla JS.]
- [Expand: Built on Web Components standard: Custom Elements, Shadow DOM, slots; no framework lock-in.]
- [Expand: Theming via CSS custom properties; accessible by default; use for rapid UI without full framework.]
- [Expand: Bridge to Phase 4.5: components are DOM elements; querySelector, addEventListener, classList apply.]

---

## 2) Adding Shoelace to a Project

- [Expand: CDN: <link> and <script> from unpkg or similar; or npm install @shoelace-style/shoelace, import component and styles.]
- [Expand: Register components (auto or explicit); then use <sl-button>, <sl-card> in HTML.]
- [Expand: Same HTML/JS approach as Phase 4.5; no build required for CDN; optional build for tree-shaking.]
- [Expand: Homestead: add to dashboard page; use in existing Phase 4 layout.]

---

## 3) Core Components — Buttons, Cards, Inputs

- [Expand: sl-button: variant (primary, default), size, type="submit"; events: sl-click.]
- [Expand: sl-card: slot for content; optional header/footer; use for sensor cards.]
- [Expand: sl-input: label, type, value, required; sl-change/sl-input events; sl-select for dropdowns.]
- [Expand: Use attributes and slots; read docs for each component; Bridge to Phase 2.5 forms and Phase 4.5 DOM.]
- [Expand: Example: <sl-card><span slot="header">Sensor</span><p>Value: <sl-badge>22</sl-badge></p><sl-button variant="primary">Details</sl-button></sl-card>.]

---

## 4) Theming and CSS Variables

- [Expand: Shoelace exposes --sl-color-primary, --sl-font-family, etc.; override in your CSS or :root.]
- [Expand: Dark theme: set color tokens for background and text; or use Shoelace’s dark mode if provided.]
- [Expand: Align with Phase 4.15 (custom properties); one theme layer for app + Shoelace.]
- [Expand: Homestead: match --sl-color-primary to dashboard primary; use --sl-input-height if needed.]

---

## 5) Composition and Events

- [Expand: Compose: sl-card contains sl-button, sl-badge, custom content in default slot.]
- [Expand: Events: component-specific (sl-change, sl-select); listen with addEventListener; e.target is the component.]
- [Expand: Get/set value: component.value or component.getAttribute('value'); check component docs.]
- [Expand: Homestead: list of sl-card; each card sl-click or button sl-click → fetch detail or open sl-dialog.]
- [Expand: Bridge to Phase 4.5: same event and DOM patterns; components are just elements with more API.]

---

## 6) Accessibility and Progressive Enhancement

- [Expand: Shoelace aims for a11y: focus, keyboard, ARIA; still add labels and test with screen reader.]
- [Expand: Progressive enhancement: server-rendered list (Phase 3) works without JS; enhance with Shoelace and fetch for interactivity.]
- [Expand: If JS fails: form still submits; links work; content visible; avoid "blank until JS" for critical content.]
- [Expand: Homestead: dashboard readable without JS; Shoelace adds polish and live updates.]

---

## 7) When to Use Shoelace vs Vanilla vs Framework

- [Expand: Shoelace: need consistent, accessible components quickly; no desire to build design system from scratch.]
- [Expand: Vanilla: minimal UI; full control; learning (Phase 4.5).]
- [Expand: Framework: large app; team standard; complex state; Shoelace can be used inside React/Vue etc.]
- [Expand: Homestead: Shoelace fits "polish the dashboard" without adopting a full framework.]

---

## Summary

- Shoelace = Web Components library; add via CDN or npm; use sl-button, sl-card, sl-input, etc.; theme with CSS variables; compose and listen to events like any DOM.
- Accessibility and progressive enhancement: use components wisely; keep server-rendered or vanilla fallback where it matters.
- Phase 5 is optional polish; Phase 4.5 DOM and Phase 4 CSS are the foundation; Shoelace speeds up UI.

---

## Bridge / Next

Next: **Phase 5.5 — TypeScript Fundamentals** (optional; add types to Express and Node) or continue to **Section B (Databases)** / **Phase 6** per learning path.

---

*Expansion note for ChatGPT: Expand each section with concrete Shoelace examples (one component per section if possible); include one full dashboard snippet (HTML + one event handler). Target ~150–200 lines when expanded.*
