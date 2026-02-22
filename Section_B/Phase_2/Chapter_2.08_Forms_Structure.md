# Phase 2.5 · Chapter 2.5.8: Forms — Structure and Input Types

form, action, method; input types (text, number, email, password, checkbox, radio); label and id; name and submission.

---

## Learning Objectives

- Create a form with action and method (GET vs POST).
- Associate labels with inputs using for and id; use appropriate input types.
- Use name for submission (key in form data); understand text, number, email, password, checkbox, radio.
- Ensure every form control has a label (visible or sr-only).

---

## 1) form, action, method

- [Expand: <form action="url" method="get|post">; action = where to submit; method = HTTP method.]
- [Expand: GET for read-only queries (params in URL); POST for changing state (body).]
- [Expand: Bridge to Phase 2: form submission triggers an HTTP request.]

---

## 2) label and id

- [Expand: <label for="input-id"> wraps text and points to control with id="input-id"; clicking label focuses control.]
- [Expand: one label per control (or one control per label); improves accessibility and hit area.]
- [Expand: can wrap control inside label instead of using for.]

---

## 3) input Types — text, number, email, password

- [Expand: type="text"—single line; type="number"—numeric; type="email"—email with validation; type="password"—masked.]
- [Expand: name attribute = key when form is submitted; required, placeholder, min, max where appropriate.]
- [Expand: avoid placeholder as only label; use real labels.]

---

## 4) checkbox and radio

- [Expand: type="checkbox"—one or more; same name for group if multiple; value for submission.]
- [Expand: type="radio"—one of many; same name for group; one checked; value required.]
- [Expand: label for each; fieldset/legend for grouping (Chapter 2.5.9).]

---

## Summary

- Form has action and method; every control has a label (for/id or wrapping) and a name for submission.
- Choose input type by data (text, number, email, password, checkbox, radio); use GET vs POST appropriately.

---

## Bridge / Next

Next: **Chapter 2.5.9 — Forms: Select, Textarea, and Buttons**.

---

*Expansion note for ChatGPT: One short form example with 2–3 input types. Target ~150 lines.*
