# Section B Phase 2 · Chapter 2.20: Block and Inline — Display Semantics

Flow content vs phrasing content; which elements are block-level vs inline by default; how nesting rules affect validity and layout. Bridge to CSS (display) and DOM.

---

## Learning Objectives

- Distinguish flow content (block-level in normal flow) from phrasing content (inline).
- Know which common elements are block (div, p, h1–h6, ul, li) and which are inline (span, a, strong, em, img).
- Understand nesting rules: flow can contain flow or phrasing; phrasing cannot contain block.
- Relate HTML content categories to default CSS display and to the box model (Phase 7).

---

## 1) Flow Content and Phrasing Content

- [Expand: flow = block-level in normal flow; phrasing = inline; HTML5 content model; list of common flow vs phrasing elements.]

---

## 2) Nesting Rules

- [Expand: p cannot contain block elements; div can contain flow; a can contain phrasing only (no interactive children); why invalid nesting causes unexpected DOM.]

---

## 3) Default Display and the Box Model

- [Expand: block elements stack; inline elements flow in lines; inline-block; bridge to CSS display and Phase 7.]

---

## 4) Choosing the Right Container

- [Expand: when to use div vs p vs span; structure and semantics drive choice; homestead: dashboard layout (flow) vs inline labels (phrasing).]

---

## Summary

- Flow content (block) vs phrasing content (inline) determines valid nesting and default layout. Choose elements that match content type and semantics.

---

## Next

Next: **Chapter 2.21 — Script, Style, and Iframe**.

---

*Expansion note: Expand each section with short examples. Target ~24k–27k characters when fully expanded per CONTENT_WORKFLOW.*
