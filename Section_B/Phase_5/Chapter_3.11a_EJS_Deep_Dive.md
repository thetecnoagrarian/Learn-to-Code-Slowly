# Phase 3 · Chapter 3.11a: EJS Deep Dive

EJS syntax: <%= %>, <% %>, <%- %>. Partials and includes. Layouts (with express-ejs-layouts or manual). Escaping and security (XSS). Integration with Express (app.set('view engine', 'ejs'), res.render). Passing data to views.

---

## Learning Objectives

- Write EJS templates using <%= (escaped output), <% (logic), and <%- (raw output).
- Use partials (include) to reuse template fragments; optionally use express-ejs-layouts for layout.
- Always prefer <%= over <%- for user data to prevent XSS; use <%- only for trusted HTML.
- Configure Express with app.set('view engine', 'ejs') and res.render(view, data); pass data for server-rendered dashboards.

---

## 1) EJS Syntax Basics

- [Expand: <%= value %>—output escaped (HTML entities); <% code %>—run JS, no output; <%- html %>—output raw (dangerous with user input).]
- [Expand: conditionals: <% if (x) { %> ... <% } %>; loops: <% items.forEach(item => { %> ... <% }); %>.]
- [Expand: include: <%- include('partial/header') %>; pass data via locals or second arg.]
- [Expand: example: sensor list with <%= sensor.name %> and <% }); %>.]

---

## 2) Partials and Layouts

- [Expand: partials: <%- include('partials/header', { title }) %>; path relative to views directory.]
- [Expand: layouts: express-ejs-layouts—define default layout; use <%- body %> for main content; or manual: every view includes header/footer.]
- [Expand: block/content patterns if using layout package.]
- [Expand: homestead: shared nav and footer via partials; layout for dashboard shell.]

---

## 3) Escaping and Security (XSS)

- [Expand: <%= %> escapes &, <, >, ", ' — use for any user or external data.]
- [Expand: <%- %> does not escape—only for trusted, server-controlled HTML (e.g. sanitized markdown).]
- [Expand: never <%- userInput %>; prevent XSS by defaulting to escaped output.]
- [Expand: Bridge to Phase 2.21 (trust boundaries): rendered output is a boundary.]

---

## 4) Express Integration

- [Expand: npm install ejs; app.set('view engine', 'ejs'); app.set('views', path.join(__dirname, 'views')).]
- [Expand: res.render('viewname', { data })—viewname = file in views/ without .ejs; data is locals.]
- [Expand: res.render('dashboard', { sensors, title: 'Dashboard' }); in template: <%= title %>, sensors.forEach.]
- [Expand: Bridge to Phase 3.11 (overview): EJS is one view engine; same res.render pattern.]

---

## Summary

- EJS: <%= escaped, <% logic, <%- raw; use partials and optionally layouts; always escape user data.
- Express: set view engine to 'ejs', res.render(view, data); use for server-rendered sensor dashboards.

---

## Bridge / Next

Next: **Chapter 3.11b — Handlebars Deep Dive** (syntax, helpers, partials, Express integration; when to choose EJS vs Handlebars).

---

*Expansion note for ChatGPT: One full EJS template example (list + partial) and one res.render example. Target ~150 lines.*
