# Phase 4.5 · Chapter 4.5.11: Debugging the DOM

DevTools Elements panel; breakpoints and console; logging elements and state. Finding why the page doesn't update.

---

## Learning Objectives

- Use DevTools Elements: inspect node, edit HTML/attributes live, see event listeners and computed styles.
- Set breakpoints in Sources (or use debugger statement); inspect variables and DOM at breakpoint.
- Log elements (console.log(el), console.dir(el)) and state; use console.assert or conditional log.
- Systematic approach: confirm selector matches; confirm code runs; confirm data/state; confirm DOM update.

---

## 1) Elements Panel

- [Expand: inspect element; see DOM tree; edit attribute/text live; right-click → Break on → subtree modifications.]
- [Expand: see applied event listeners (getEventListeners in console or Elements panel).]
- [Expand: check computed styles; check layout (box model).]

---

## 2) Breakpoints and console

- [Expand: Sources: set breakpoint in handler; refresh or trigger; inspect scope and DOM.]
- [Expand: console.log(el), console.dir(el) for element; console.table(array) for arrays.]
- [Expand: debugger; in code to pause when hit.]

---

## 3) Why Didn't the Page Update?

- [Expand: selector wrong? Log querySelector result; maybe null.]
- [Expand: code not running? Log at start of handler; check event attached?]
- [Expand: data wrong? Log response or state before updating DOM.]
- [Expand: update wrong element? Log element before textContent/innerHTML.]

---

## 4) Common Fixes

- [Expand: null reference: check selector and that element exists when code runs (DOMContentLoaded).]
- [Expand: event not firing: typo in event name; wrong element; listener removed.]
- [Expand: homestead: "sensor value not updating" — check fetch result, selector for value el, then textContent.]

---

## Summary

- Use Elements and Sources; breakpoints and console.log; verify selector, execution, data, and DOM update step by step.

---

## Bridge / Next

Next: **Chapter 4.5.12 — DOM in Your Workflow**.

---

*Expansion note for ChatGPT: One debugging checklist. Target ~150 lines.*
