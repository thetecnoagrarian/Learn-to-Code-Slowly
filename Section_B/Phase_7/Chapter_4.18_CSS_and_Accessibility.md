# Phase 4 · Chapter 4.18: CSS and Accessibility

Contrast ratios. Focus styles. Reduced motion. Screen readers and CSS. Making interfaces usable for everyone.

---

## Learning Objectives

- Meet contrast requirements (WCAG AA 4.5:1 text, 3:1 large); test with checker; don’t rely on color alone.
- Provide visible focus styles (outline or box-shadow); don’t remove focus without replacement; support :focus-visible.
- Respect prefers-reduced-motion: reduce or remove animation/transition when set.
- Understand that screen readers use semantic HTML (Phase 2.5); CSS can hide visually (visibility, clip) while keeping in a11y tree; avoid display:none or visibility:hidden on focusable content without alternative.

---

## 1) Contrast

- [Expand: text on background: 4.5:1 normal, 3:1 large (18px+ or 14px+ bold); AAA 7:1 and 4.5:1.]
- [Expand: test: WebAIM contrast checker or DevTools; fix by darkening/lightening or changing color.]
- [Expand: status: color + icon/text; don’t convey critical info by color only.]

---

## 2) Focus Styles

- [Expand: outline: 2px solid ... or box-shadow for focus ring; ensure visible on all interactive elements.]
- [Expand: :focus-visible only when keyboard focus (not mouse); avoid double ring on click.]
- [Expand: never outline: none without visible alternative; keyboard users need to see focus.]

---

## 3) Reduced Motion

- [Expand: @media (prefers-reduced-motion: reduce) { * { animation: none; transition: none; } } or shorten.]
- [Expand: respect user preference; some users get motion sickness or distraction.]
- [Expand: Phase 4.14: already introduced; reinforce here.]

---

## 4) Screen Readers and CSS

- [Expand: screen readers use DOM/semantics (Phase 2.5); CSS hide: display:none and visibility:hidden remove from layout; visually-hidden class (clip, position) can hide visually but keep in tree.]
- [Expand: don’t hide focusable content without alternative; avoid tiny click targets (min 44px).]
- [Expand: homestead: focusable cards or buttons; visible focus; sufficient contrast for values.]

---

## Summary

- Contrast, focus styles, reduced motion; support keyboard and screen reader users; don’t hide focusable content without alternative.

---

## Bridge / Next

Next: **Chapter 4.19 — Building a Dashboard Layout**.

---

*Expansion note for ChatGPT: One focus style and one contrast note. Target ~150 lines.*
