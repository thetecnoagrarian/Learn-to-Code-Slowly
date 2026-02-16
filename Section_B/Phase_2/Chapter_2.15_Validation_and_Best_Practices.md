# Phase 2.5 · Chapter 2.5.15: Validation and Best Practices

Validators (W3C); common errors; nesting rules; closing tags; accessibility checklist.

---

## Learning Objectives

- Use the W3C Markup Validator (or similar) to check HTML.
- Fix common errors: unclosed tags, wrong nesting, duplicate ids, missing alt.
- Follow nesting rules (e.g. no block inside p; a can’t wrap interactive elements).
- Apply a short accessibility checklist (headings, labels, landmarks, contrast later in CSS).

---

## 1) Using a Validator

- [Expand: W3C Validator: paste URL or upload file; get errors and warnings.]
- [Expand: fix errors first; warnings (e.g. optional things) as needed.]
- [Expand: validation catches typos, unclosed tags, invalid nesting.]

---

## 2) Common Errors

- [Expand: unclosed or mismatched tags; fix by checking every opening tag has correct close.]
- [Expand: block inside inline (e.g. div inside span)—invalid; use block container or change structure.]
- [Expand: duplicate id—must be unique; use class if repeated.]
- [Expand: missing alt on img—add alt (or "" for decorative).]

---

## 3) Nesting Rules

- [Expand: p cannot contain block elements (no div, section inside p).]
- [Expand: a must not contain another a or interactive control (button, input).]
- [Expand: list items (li) can contain flow content including lists (nested ul/ol).]
- [Expand: use validator to learn rules when in doubt.]

---

## 4) Accessibility Checklist (HTML Layer)

- [Expand: one h1; heading hierarchy (no skips); every form control has a label.]
- [Expand: images have alt; tables have scope/headers if needed; landmarks (main, nav, etc.).]
- [Expand: contrast and focus are largely CSS (Phase 4); HTML sets the structure.]

---

## Summary

- Validate with W3C or similar; fix errors and understand nesting rules.
- Common fixes: close tags, unique ids, valid nesting, alt on images, labels on controls.
- HTML accessibility: structure, headings, labels, landmarks; then enhance with CSS/JS.

---

## Bridge / Next

Phase 2.5 complete. Next: **Phase 2.6 — JavaScript Fundamentals** or **Phase 4 — CSS Fundamentals** (per learning path).

---

*Expansion note for ChatGPT: List 5–7 common validator errors and one-line fix for each. Target ~150 lines.*
