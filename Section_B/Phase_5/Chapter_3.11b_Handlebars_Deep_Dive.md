# Phase 3 · Chapter 3.11b: Handlebars Deep Dive

Handlebars syntax: {{}}, {{{}}}, {{#each}}, {{#if}}, helpers. Partials and layout (express-handlebars). Custom helpers. Express integration (view engine setup, res.render). Comparison with EJS; when to choose which.

---

## Learning Objectives

- Write Handlebars templates: {{value}} (escaped), {{{value}}} (raw), {{#each}}, {{#if}}, {{else}}.
- Register and use partials; use express-handlebars for layout (defaultLayout, layoutsDir).
- Define custom helpers (format date, compare values) and use them in templates.
- Configure Express with express-handlebars engine and res.render; compare EJS vs Handlebars for project choice.

---

## 1) Handlebars Syntax

- [Expand: {{name}}—escaped output; {{{html}}}—triple-stash raw (use only for trusted HTML).]
- [Expand: {{#each items}} ... {{/each}}; {{#if condition}} ... {{else}} ... {{/if}}; {{#unless condition}}.]
- [Expand: context: this inside each is current item; ../ for parent; no arbitrary JS—logic in helpers.]
- [Expand: example: {{#each sensors}}{{name}}: {{value}}{{/each}}.]

---

## 2) Partials and Layout with express-handlebars

- [Expand: partials: {{> partialName}}; register with engine.getPartials() or partialsDir.]
- [Expand: express-handlebars: set defaultLayout, layoutsDir; layout wraps view; {{{body}}} in layout.]
- [Expand: view = body content; layout = shell (header, footer, {{{body}}}).]
- [Expand: homestead: main layout with nav; view for dashboard content.]

---

## 3) Custom Helpers

- [Expand: register helpers when creating engine: helpers: { eq(a, b) { return a === b; }, formatDate(date) { ... } }.]
- [Expand: in template: {{formatDate timestamp}}, {{#if (eq status "ok")}}.]
- [Expand: keep logic in helpers; templates stay declarative; test helpers in isolation.]
- [Expand: example: {{formatNumber value}} for sensor readings.]

---

## 4) Express Integration and EJS vs Handlebars

- [Expand: const exphbs = require('express-handlebars'); app.engine('hbs', exphbs(...)); app.set('view engine', 'hbs'); app.set('views', ...).]
- [Expand: res.render('dashboard', { sensors, title: 'Dashboard' }); same pattern as EJS.]
- [Expand: EJS: arbitrary JS in templates, no helpers; Handlebars: logic in helpers, more structured. Choose EJS for quick JS in template; Handlebars for team consistency and logic in helpers.]
- [Expand: Bridge to Phase 3.11: both are view engines; res.render and data passing are the same.]

---

## Summary

- Handlebars: {{}} escaped, {{{}}} raw; {{#each}}, {{#if}}; partials and layout via express-handlebars; custom helpers for logic.
- Express: set engine to Handlebars, res.render(view, data); choose EJS vs Handlebars by team and logic-in-template preference.

---

## Bridge / Next

Next: **Chapter 3.12 — RESTful API Design in Express**.

---

*Expansion note for ChatGPT: One Handlebars template with each/if and one helper; one comparison table EJS vs Handlebars. Target ~150 lines.*
