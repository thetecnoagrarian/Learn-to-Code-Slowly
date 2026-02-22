# Phase 4.5 · Chapter 4.5.2: Selecting Elements

getElementById, getElementsByClassName, getElementsByTagName; querySelector, querySelectorAll; NodeList vs HTMLCollection; single vs multiple.

---

## Learning Objectives

- Use getElementById (single), getElementsByClassName and getElementsByTagName (live collections).
- Use querySelector (first match) and querySelectorAll (NodeList); prefer when you need CSS-style selectors.
- Understand NodeList (querySelectorAll) vs HTMLCollection (getElementsBy*); both array-like; NodeList is static (usually).
- Choose the right method: by id → getElementById; by class or complex selector → querySelector/All.

---

## 1) getElementById, getElementsByClassName, getElementsByTagName

- [Expand: document.getElementById('id')—single element or null; ids must be unique.]
- [Expand: getElementsByClassName('class')—live HTMLCollection; getElementsByTagName('div')—live.]
- [Expand: "live" = updates when DOM changes; can be surprising in loops (prefer converting to array).]

---

## 2) querySelector and querySelectorAll

- [Expand: document.querySelector('.card')—first match; querySelectorAll('.sensor')—NodeList of all.]
- [Expand: any valid CSS selector; compound and combinators; same as Phase 4 selectors.]
- [Expand: querySelectorAll is static (snapshot at call time); forEach and spread work.]

---

## 3) NodeList vs HTMLCollection

- [Expand: HTMLCollection: getElementsBy*; live; no forEach in old IE; convert with Array.from.]
- [Expand: NodeList: querySelectorAll; static (in most browsers); has forEach.]
- [Expand: both: length, [index]; iterate with for...of or Array.from.]

---

## 4) When to Use Which

- [Expand: one element by id: getElementById; one by selector: querySelector; many: querySelectorAll or getElementsByClassName.]
- [Expand: need live updates (rare): getElementsBy*; need complex selector: querySelector/All.]
- [Expand: homestead: document.querySelector('.dashboard'), document.querySelectorAll('.sensor-card').]

---

## Summary

- getElementById (single); getElementsBy*/querySelectorAll (multi); querySelector (first); prefer querySelector/All for flexibility.

---

## Bridge / Next

Next: **Chapter 4.5.3 — Traversing and Modifying the Tree**.

---

*Expansion note for ChatGPT: One example each for querySelector and querySelectorAll. Target ~150 lines.*
