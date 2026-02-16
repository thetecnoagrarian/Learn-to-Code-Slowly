# Phase 2.5 · Chapter 2.5.1: What HTML Is

Markup vs content; tags and elements; HTML as a tree; separation of structure and presentation. Bridge to Phase 2 (HTTP delivers HTML).

---

## Learning Objectives

- Distinguish markup from content and explain what "markup" means.
- Define tag and element; use opening/closing tags and self-closing syntax where appropriate.
- Describe HTML as a tree (parent/child/sibling) and how that affects CSS and JS later.
- Explain separation of structure (HTML) and presentation (CSS); bridge to Phase 2 (HTTP delivers HTML).

---

## 1) Markup vs Content

- [Expand: content = text and meaning; markup = tags that describe structure and semantics.]
- [Expand: HTML doesn’t "look like" the page—it describes what things are (heading, list, link).]
- [Expand: example: a paragraph of text wrapped in <p>; the tag is markup, the text is content.]

---

## 2) Tags and Elements

- [Expand: tag = angle brackets and name, e.g. <p>, </p>; element = opening tag + content + closing tag (or void element).]
- [Expand: void elements: img, br, input—no closing tag in HTML5.]
- [Expand: nesting: elements contain other elements; must close in reverse order.]

---

## 3) HTML as a Tree

- [Expand: document has one root (html); branches = elements; leaves = text or void elements.]
- [Expand: parent, child, sibling; this tree is the DOM (Phase 4.5) and is what CSS and JS use.]
- [Expand: valid HTML must form a well-nested tree.]

---

## 4) Separation of Structure and Presentation

- [Expand: HTML = structure and meaning; CSS = how it looks (Phase 4).]
- [Expand: why separate: maintainability, accessibility, different presentations (screen, print).]
- [Expand: Bridge: Phase 2—HTTP carries HTML as the resource; the browser interprets the tree and applies CSS.]

---

## Summary

- HTML is markup (tags) around content; elements form a tree of parent/child/sibling.
- Structure (HTML) is separate from presentation (CSS); HTTP delivers HTML to the client.
- The tree becomes the DOM for styling and scripting.

---

## Bridge / Next

Next: **Chapter 2.5.2 — Document Structure and the DOCTYPE**.

---

*Expansion note for ChatGPT: Expand each section with short examples. Target ~150 lines.*
