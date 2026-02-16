# Phase 4 · Chapter 4.3: Specificity and the Cascade

How rules compete when multiple apply. Specificity calculation. Order of appearance. !important and when to avoid it. Why your styles aren't applying — and how to fix it.

---

## Learning Objectives

- Calculate specificity (inline, id, class, element); later rule wins when equal; source order matters.
- Use cascade: order of stylesheets and rules; later overrides earlier when specificity is equal.
- Avoid !important except for utilities/overrides; fix specificity instead of forcing with !important.
- Debug "why isn't my style applying?" with DevTools and specificity.

---

## 1) Specificity

- [Expand: (inline, ids, classes+attrs, elements); count each; compare left to right; higher wins.]
- [Expand: 0,1,1 beats 0,0,3; 1,0,0 beats 0,10,0.]
- [Expand: :not() counts its argument; * has 0 specificity.]

---

## 2) Cascade and Order

- [Expand: same specificity: later rule in source wins; order of <link> and <style> matters.]
- [Expand: imported stylesheets: order of @import; then document order.]
- [Expand: predictable: low-specificity base, then components, then overrides.]

---

## 3) !important

- [Expand: !important beats non-important; same important: cascade/specificity apply.]
- [Expand: avoid in general; creates arms race; use for utility overrides or critical fixes only.]
- [Expand: prefer fixing selector or increasing specificity.]

---

## 4) Debugging

- [Expand: DevTools: inspect element; see which rules apply and which are crossed out (overridden).]
- [Expand: add selector specificity or move rule later; remove !important from others if possible.]
- [Expand: homestead: "card background not changing" — check .dashboard .card vs .card.]

---

## Summary

- Specificity and source order determine which rule wins; avoid !important; use DevTools to debug.

---

## Bridge / Next

Next: **Chapter 4.4 — The Box Model**.

---

*Expansion note for ChatGPT: One specificity calculation and one debugging step list. Target ~150 lines.*
