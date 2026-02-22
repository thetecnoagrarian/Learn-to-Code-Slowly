# Phase 4.5 · Chapter 4.5.4: Attributes and Properties

getAttribute, setAttribute, removeAttribute; DOM properties (value, checked, href); classList (add, remove, toggle).

---

## Learning Objectives

- Use getAttribute, setAttribute, removeAttribute for HTML attributes; know difference from DOM properties.
- Use DOM properties: input.value, checkbox.checked, a.href; they reflect current state and may differ from attribute.
- Use classList.add, remove, toggle, contains for class changes; avoid className string when toggling one class.
- Prefer properties for live state (value, checked); use attributes for initial or non-reflecting (data-*, aria-*).

---

## 1) getAttribute, setAttribute, removeAttribute

- [Expand: getAttribute('href'), setAttribute('aria-label', 'Close'), removeAttribute('disabled').]
- [Expand: attributes are strings; always return string or null.]
- [Expand: data-* and aria-*: use get/setAttribute or dataset/aria* where defined.]

---

## 2) DOM Properties

- [Expand: input.value = 'text' (current value); input.checked = true; a.href (resolved URL).]
- [Expand: some properties reflect attributes (id, title); some are computed (href); value and checked are live.]
- [Expand: set property for two-way binding; read property for current state.]

---

## 3) classList

- [Expand: element.classList.add('active'), remove('active'), toggle('active'), contains('active').]
- [Expand: toggle(className, force) for add/remove based on boolean; multiple classes: add('a','b').]
- [Expand: prefer classList over className when adding/removing one class (className replaces all).]

---

## 4) When to Use Which

- [Expand: state (checked, value): use property; initial or semantic (data-id, aria-label): attribute.]
- [Expand: classes: classList for toggle; className for replace entire list.]
- [Expand: homestead: classList.toggle('alert') on sensor card; input.value for form.]

---

## Summary

- Attributes: get/set/removeAttribute; properties: value, checked, href; classList for class changes; use each appropriately.

---

## Bridge / Next

Next: **Chapter 4.5.5 — Events: Listening and Handling**.

---

*Expansion note for ChatGPT: One classList and one property example. Target ~150 lines.*
