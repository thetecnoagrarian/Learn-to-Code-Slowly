# Phase 4.5 · Chapter 4.5.1: What the DOM Is

HTML as a tree; nodes (elements, text, attributes); document object; DOM as live representation. Bridge to Phase 2.5 (HTML structure).

---

## Learning Objectives

- Describe the DOM as a tree of nodes (document, elements, text, attributes).
- Explain that the DOM is a live representation: changes in JS are reflected in the page and vice versa.
- Use the global document object as the entry point to the tree.
- Connect to Phase 2.5: the HTML you write becomes this tree; CSS and JS both use it.

---

## 1) HTML as a Tree

- [Expand: root = document; children = html, then head and body; each element has children (elements or text nodes).]
- [Expand: parent, child, sibling; every node has a type (element, text, comment, etc.).]
- [Expand: same structure as Phase 2.5 HTML; browser builds DOM from HTML.]

---

## 2) Nodes: Elements, Text, Attributes

- [Expand: Element nodes: tag name, attributes, children; Text nodes: text content; Attr nodes (less used directly).]
- [Expand: document.createElement, text nodes via createTextNode or textContent.]
- [Expand: attributes live on elements; getAttribute, setAttribute.]

---

## 3) document Object

- [Expand: document is the root; document.documentElement (html), document.body, document.head.]
- [Expand: document is global in browser; entry point for querySelector, getElementById, etc.]
- [Expand: no document in Node.js; only in browser (or jsdom for testing).]

---

## 4) Live Representation

- [Expand: change element.textContent in JS → page updates; user edits input → JS reads .value.]
- [Expand: reflow and repaint when DOM or styles change; batch reads/writes when possible.]
- [Expand: Bridge to Phase 2.5: valid HTML produces predictable DOM; semantics matter for JS and a11y.]

---

## Summary

- DOM = tree of nodes (document, elements, text); document is entry point; DOM is live; bridge to HTML structure.

---

## Bridge / Next

Next: **Chapter 4.5.2 — Selecting Elements**.

---

*Expansion note for ChatGPT: One tree diagram and one document property list. Target ~150 lines.*
