# Phase 2.5 · Chapter 2.5.12: Attributes — class, id, data-*, ARIA

class and id; data-* for custom data; aria-* for accessibility; boolean attributes.

---

## Learning Objectives

- Use class and id correctly (reuse vs uniqueness; naming).
- Use data-* attributes for custom data that JS or CSS needs; no semantics.
- Use aria-* where needed to improve accessibility when HTML isn’t enough.
- Recognize boolean attributes (no value or value = name).

---

## 1) class and id Recap

- [Expand: class = styling/JS hook; reusable; multiple per element.]
- [Expand: id = unique; anchors, ARIA relationships, getElementById.]
- [Expand: valid values: letters, digits, hyphen, underscore; no spaces.]

---

## 2) data-* Attributes

- [Expand: data-* = custom data for JS (e.g. data-sensor-id, data-value); no built-in behavior.]
- [Expand: access in JS: element.dataset.sensorId; in CSS: attr(data-value) limited.]
- [Expand: use for configuration, state, or passing info to scripts; don’t store large data.]

---

## 3) aria-* for Accessibility

- [Expand: ARIA = Accessible Rich Internet Applications; supplements HTML when semantics are missing.]
- [Expand: examples: aria-label, aria-labelledby, aria-hidden, role; use when native HTML can’t convey meaning.]
- [Expand: prefer native semantics (button, label) over ARIA when possible.]

---

## 4) Boolean Attributes

- [Expand: boolean attributes: disabled, readonly, required, multiple; presence = true.]
- [Expand: in HTML5 you can write disabled or disabled="disabled"; no other value makes it false.]
- [Expand: don’t use "false" to disable—omit the attribute.]

---

## Summary

- class and id for styling/scripting and identity; data-* for custom data; aria-* when semantics need a boost.
- Boolean attributes are true when present; omit to make false.

---

## Bridge / Next

Next: **Chapter 2.5.13 — Character Entities and Encoding**.

---

*Expansion note for ChatGPT: One data-* and one aria example. Target ~150 lines.*
