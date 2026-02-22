# Phase 4.5 · Chapter 4.5.5: Events — Listening and Handling

addEventListener; event object (target, type, preventDefault, stopPropagation); click, submit, input, change. Bridge to Phase 0.8 (boundaries: user input).

---

## Learning Objectives

- Add listeners with addEventListener('click', handler); remove with removeEventListener (same function reference).
- Use event object: target (element that received event), type, preventDefault (e.g. form submit), stopPropagation.
- Handle click, submit (form), input (live input), change (commit value); choose the right event for the task.
- Treat user input as boundary: validate and sanitize; Phase 0.8.

---

## 1) addEventListener

- [Expand: element.addEventListener('click', (e) => { }); third param: { capture, once, passive } optional.]
- [Expand: removeEventListener needs same function reference; use named function or store reference.]
- [Expand: multiple listeners on same event: all run in order.]

---

## 2) Event Object

- [Expand: e.target = element that triggered (e.g. clicked); e.currentTarget = element listener is on.]
- [Expand: e.preventDefault()—cancel default (link navigation, form submit); e.stopPropagation()—stop bubbling.]
- [Expand: e.type; e.key for keyboard; e.clientX, e.clientY for mouse.]

---

## 3) click, submit, input, change

- [Expand: click: buttons, links, divs (if focusable or role).]
- [Expand: submit: form submit; preventDefault to handle with JS; validate before submit.]
- [Expand: input: every keystroke (live); change: on blur or commit (select, checkbox); use input for live feedback, change for "value changed."]

---

## 4) Bridge to Phase 0.8

- [Expand: user input is untrusted; validate and sanitize at boundary; don’t trust e.target or form data without check.]
- [Expand: preventDefault when you handle action yourself; stopPropagation when you don’t want parent to react.]
- [Expand: homestead: form submit → validate → fetch POST; click on card → show detail.]

---

## Summary

- addEventListener/removeEventListener; event object (target, preventDefault, stopPropagation); choose correct event type; treat input as boundary.

---

## Bridge / Next

Next: **Chapter 4.5.6 — Events: Bubbling and Delegation**.

---

*Expansion note for ChatGPT: One click and one submit handler example. Target ~150 lines.*
