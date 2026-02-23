# Section B Phase 2 · Chapter 2.13: Forms — Validation and Submission

HTML5 form validation (required, pattern, min/max); form action and method (GET vs POST); name and submission; security considerations (CSRF, HTTPS). Bridge to server-side handling.

---

## Learning Objectives

- Use HTML5 validation attributes (required, pattern, min, max, minlength) and understand their limits.
- Set form action and method; understand when to use GET vs POST for form submission.
- Explain how name attributes become request data (query string or body).
- Recognize that client-side validation is UX, not security; server must validate.

---

## 1) HTML5 Validation Attributes

- [Expand: required, pattern, min, max, minlength, maxlength; type=email, type=number; invalid state and :invalid; constraint validation API (brief).]

---

## 2) Form Action and Method

- [Expand: action = URL for submission; method = GET (query string) or POST (body); when to use each; enctype for file upload (multipart/form-data).]

---

## 3) Name and Submitted Data

- [Expand: name defines the key in submitted data; multiple values (checkboxes, multi select); disabled and non-submitted fields.]

---

## 4) Security and Best Practices

- [Expand: client-side validation is for UX; server must validate and sanitize; HTTPS for forms; CSRF and same-origin; homestead: sensor config form submitted to Pi.]

---

## Summary

- Use validation attributes for better UX; use action and method correctly; always validate and sanitize on the server. Name attributes define the shape of submitted data.

---

## Next

Next: **Chapter 2.14 — Semantic HTML and Landmarks**.

---

*Expansion note: Expand each section with short examples. Target ~24k–27k characters when fully expanded per CONTENT_WORKFLOW.*
