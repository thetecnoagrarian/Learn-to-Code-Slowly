# Section B Phase 2 · Chapter 2.21: Script, Style, and Iframe

How JavaScript and CSS are included: script and style in head or body; defer and async; inline vs external. iframe and embed for nested documents; security and accessibility.

---

## Learning Objectives

- Include scripts with script src; understand blocking, defer, and async and when to use each.
- Include styles with link rel="stylesheet" or style; prefer external CSS for maintainability.
- Use iframe for embedding another document; understand sandbox, srcdoc, and same-origin; when to avoid iframe.
- Relate to Phase 3 (JavaScript) and Phase 7 (CSS).

---

## 1) Including Scripts

- [Expand: script src for external; script with no src for inline; blocking parsing; defer (order preserved) and async (order not guaranteed); placement in head vs end of body.]

---

## 2) Including Styles

- [Expand: link rel="stylesheet" in head; style for inline (avoid for main styles); scoped (deprecated/limited); prefer external stylesheets.]

---

## 3) Iframe and Nested Documents

- [Expand: iframe src for another page; srcdoc for inline HTML; sandbox for security; title for accessibility; when iframe is appropriate (embeds, widgets) vs when to avoid.]

---

## 4) Security and Performance

- [Expand: same-origin policy and iframe; avoid embedding untrusted content; script and style from trusted sources; homestead: dashboard embedding a sensor widget.]

---

## Summary

- Use script with defer or placement at end of body for non-blocking; use link for CSS. Use iframe only when embedding another document is needed; sandbox and title for security and accessibility.

---

## Next

Next: **Chapter 2.22 — HTML and HTTP**.

---

*Expansion note: Expand each section with short examples. Target ~24k–27k characters when fully expanded per CONTENT_WORKFLOW.*
