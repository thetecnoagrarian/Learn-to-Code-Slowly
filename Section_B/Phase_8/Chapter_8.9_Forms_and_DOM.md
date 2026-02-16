# Phase 4.5 · Chapter 4.5.9: Forms and the DOM

Form element; form.elements; reading and setting values; submit event; client-side validation vs server. Bridge to Phase 2.5 forms.

---

## Learning Objectives

- Access form and controls: form.elements (by name or id); input.value, select.value, checkbox.checked.
- Prevent default submit with e.preventDefault(); send data with fetch (POST) or let form submit (action/method).
- Validate on client for UX (instant feedback); always validate on server (Phase 3); never trust client alone.
- Connect to Phase 2.5: form structure (action, method, name); JS reads and optionally submits via fetch.

---

## 1) form.elements and Values

- [Expand: form.elements.name or form.elements['name']; form.elements returns collection.]
- [Expand: input.value, textarea.value, select.value (option value), checkbox.checked, radio (same name, check which checked).]
- [Expand: form.reset() to clear; set value/checked to prefill.]

---

## 2) submit Event and preventDefault

- [Expand: form.addEventListener('submit', (e) => { e.preventDefault(); ... });]
- [Expand: after preventDefault you can validate and fetch; or build FormData and send.]
- [Expand: new FormData(form) gives key/value for each named control; can send as form data or JSON.]

---

## 3) Client-Side Validation

- [Expand: check required, length, pattern before fetch; show inline errors; improve UX.]
- [Expand: HTML5 validation (required, pattern) can be used; check validity with checkValidity() or custom.]
- [Expand: server must validate again; client is for UX and reducing unnecessary requests.]

---

## 4) Bridge to Phase 2.5 and Phase 3

- [Expand: Phase 2.5: form, input names, labels; Phase 4.5: read values, submit event, fetch.]
- [Expand: Phase 3: same form data received in req.body; validate on server; return 400 and errors.]
- [Expand: homestead: sensor config form; client validate; POST to Express; server validate and save.]

---

## Summary

- form.elements and value/checked; submit + preventDefault; validate on client for UX, always on server.

---

## Bridge / Next

Next: **Chapter 4.5.10 — DOM and CSS**.

---

*Expansion note for ChatGPT: One form read and one submit handler. Target ~150 lines.*
