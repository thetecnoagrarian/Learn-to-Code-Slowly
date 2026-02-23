# Section B Phase 2 · Chapter 2.18: ARIA and Accessibility Attributes

When and how to use ARIA: roles, aria-label, aria-labelledby, aria-describedby; live regions; when HTML semantics are enough. Accessibility as part of structure, not an afterthought.

---

## Learning Objectives

- Use aria-label and aria-labelledby when visible text is missing or insufficient for a control or region.
- Use ARIA roles when native HTML does not convey the right semantics (e.g. custom widgets).
- Understand live regions (aria-live) for dynamic content; prefer semantic HTML over ARIA when possible.
- Relate ARIA to screen readers and keyboard navigation.

---

## 1) When to Use ARIA

- [Expand: ARIA fills gaps when HTML has no element; prefer native semantics (button, nav, main); use ARIA when building custom controls or when labeling is missing.]

---

## 2) Labeling: aria-label, aria-labelledby, aria-describedby

- [Expand: aria-label for short label; aria-labelledby and aria-describedby to reference other elements; one label per element; homestead: icon buttons, chart labels.]

---

## 3) Roles and Live Regions

- [Expand: role to expose widget type; aria-live for dynamic updates (alerts, status); polite vs assertive; avoid overusing.]

---

## 4) Don’t Overuse ARIA

- [Expand: redundant ARIA (e.g. role=button on a button) can cause problems; test with screen reader; semantic HTML first.]

---

## Summary

- Use ARIA when HTML semantics are insufficient; label controls and regions; use live regions for dynamic content. Prefer native HTML and test with assistive tech.

---

## Next

Next: **Chapter 2.19 — Character Entities and Encoding**.

---

*Expansion note: Expand each section with short examples. Target ~24k–27k characters when fully expanded per CONTENT_WORKFLOW.*
