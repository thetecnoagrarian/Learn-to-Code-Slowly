# Phase 4 · Chapter 4.15: CSS Custom Properties (Variables)

--variable-name. Scoping. Theming. Shared values across a stylesheet. Homestead dashboard theme (colors, spacing).

---

## Learning Objectives

- Define and use custom properties: --name: value; use with var(--name) or var(--name, fallback).
- Understand scoping: custom properties inherit; define on :root for global; override on selector for scope.
- Build a simple theme: colors and spacing as variables; switch theme by changing root or class.
- Use for dashboard: --color-primary, --space-unit, --radius; one place to change theme.

---

## 1) Definition and Use

- [Expand: :root { --color-primary: #2563eb; --space: 1rem; } then color: var(--color-primary); padding: var(--space);]
- [Expand: fallback: var(--missing, 1rem); invalid value uses fallback.]
- [Expand: any property value (with units); can be updated with JS for runtime theme.]

---

## 2) Scoping

- [Expand: variables inherit; .card { --card-bg: white; background: var(--card-bg); } scopes to .card and children.]
- [Expand: .dark { --color-bg: #1a1a1a; } on body or html; children use new value.]
- [Expand: override at any level; no "global" leak unless you want :root.]

---

## 3) Theming

- [Expand: define light theme on :root; dark theme on [data-theme="dark"] or .dark; set attribute or class with JS.]
- [Expand: one set of rules using variables; switch theme by changing one ancestor.]
- [Expand: homestead: --color-ok, --color-alert, --color-bg; switch for light/dark.]

---

## 4) Dashboard Theme

- [Expand: --color-primary, --color-text, --color-muted, --space-1 through --space-4, --radius.]
- [Expand: components use variables; change dashboard look by editing one block or toggling theme.]
- [Expand: consistent spacing and color; easier maintenance.]

---

## Summary

- Custom properties: --name: value; var(--name, fallback); scoped by selector; use for theme and shared values.

---

## Bridge / Next

Next: **Chapter 4.16 — Inheritance**.

---

*Expansion note for ChatGPT: One :root theme and one dark override. Target ~150 lines.*
