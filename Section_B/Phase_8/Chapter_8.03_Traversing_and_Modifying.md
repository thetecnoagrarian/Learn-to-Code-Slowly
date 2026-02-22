# Phase 4.5 · Chapter 4.5.3: Traversing and Modifying the Tree

parentElement, children, nextElementSibling; innerHTML, textContent; createElement, append, remove; when to use what (security: innerHTML vs textContent).

---

## Learning Objectives

- Traverse: parentElement, children, nextElementSibling, previousElementSibling; firstElementChild, lastElementChild.
- Read and set content: textContent (safe, plain text); innerHTML (HTML string—dangerous with user input).
- Create and add nodes: createElement, createTextNode, append, appendChild, remove.
- Prefer textContent for user-facing text; use innerHTML only for trusted or sanitized HTML.

---

## 1) Traversing

- [Expand: element.parentElement; element.children (only elements); element.nextElementSibling.]
- [Expand: childNodes includes text nodes; children is elements only; firstElementChild, lastElementChild.]
- [Expand: use to walk up/down/sideways; e.g. find card from clicked button.]

---

## 2) textContent vs innerHTML

- [Expand: textContent: plain text; escapes automatically; safe for any string; no tags rendered.]
- [Expand: innerHTML: parses HTML; XSS if string contains user input; use only for server/trusted content or sanitize.]
- [Expand: innerText: styled "visible" text; triggers reflow; usually prefer textContent.]

---

## 3) createElement, append, remove

- [Expand: document.createElement('div'); el.textContent = 'Hello'; parent.append(el) or appendChild(el).]
- [Expand: append accepts multiple nodes and strings; appendChild one node; remove() to remove from tree.]
- [Expand: insertBefore, replaceChild when needed; append is simpler for "add at end."]

---

## 4) Security and Best Practice

- [Expand: never set innerHTML with user input (e.g. form field, URL param) without sanitization.]
- [Expand: build UI with createElement and textContent; or use trusted template (server-rendered).]
- [Expand: homestead: sensor value from API → textContent; never innerHTML with API data.]

---

## Summary

- Traverse with parent, children, siblings; prefer textContent; innerHTML only for trusted/sanitized; create/append/remove for dynamic nodes.

---

## Bridge / Next

Next: **Chapter 4.5.4 — Attributes and Properties**.

---

*Expansion note for ChatGPT: One traversal and one createElement/append example. Target ~150 lines.*
