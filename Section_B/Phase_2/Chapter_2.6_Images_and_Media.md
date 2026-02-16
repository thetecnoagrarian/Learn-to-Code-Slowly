# Phase 2.5 · Chapter 2.5.6: Images and Media

img (src, alt, width, height); picture and source; figure and figcaption; accessibility and performance.

---

## Learning Objectives

- Use img with required alt; choose width/height to avoid layout shift.
- Use picture and source for art direction or multiple formats (optional).
- Use figure and figcaption for images with captions or semantic grouping.
- Balance accessibility (alt text) and performance (sizing, format).

---

## 1) The img Element

- [Expand: <img src="..." alt="...">; alt is required—describe the image or use "" for decorative.]
- [Expand: width and height in HTML reduce layout shift (CLS); use same aspect ratio as image.]
- [Expand: src can be relative or absolute; avoid hotlinking.]

---

## 2) picture and source

- [Expand: <picture> for multiple sources (e.g. WebP + fallback, different crops).]
- [Expand: <source> with srcset, type, media; last img is fallback.]
- [Expand: use when you need art direction or format negotiation.]

---

## 3) figure and figcaption

- [Expand: <figure> groups image (or code, diagram) with optional <figcaption>.]
- [Expand: improves semantics and accessibility; caption can be read with the figure.]
- [Expand: one figcaption per figure; can be first or last child.]

---

## 4) Accessibility and Performance

- [Expand: meaningful alt for content images; empty alt for decorative.]
- [Expand: avoid "image of" or "picture of" in alt; describe content/function.]
- [Expand: performance: appropriate size, format (WebP/AVIF where supported), lazy loading (loading="lazy").]

---

## Summary

- img needs src and alt; width/height reduce shift; picture/source for responsive/formats; figure/figcaption for captions.
- Good alt and sizing support accessibility and performance.

---

## Bridge / Next

Next: **Chapter 2.5.7 — Tables**.

---

*Expansion note for ChatGPT: One img and one figure example. Target ~150 lines.*
