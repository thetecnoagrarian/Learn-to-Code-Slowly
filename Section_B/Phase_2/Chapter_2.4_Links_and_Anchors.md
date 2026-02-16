# Phase 2.5 · Chapter 2.5.4: Links and Anchors

a href; absolute vs relative URLs; target and rel; fragment identifiers; links as boundaries (Phase 0.8).

---

## Learning Objectives

- Create links with <a href="..."> and distinguish absolute vs relative URLs.
- Use target and rel for opening in new tab and security (noopener, noreferrer).
- Use fragment identifiers (#id) for in-page navigation.
- Connect links to Phase 0.8: boundaries (navigating across resources).

---

## 1) The a Element and href

- [Expand: <a href="url">text</a>; href is required for navigation links.]
- [Expand: link text should be descriptive (not "click here"); accessibility and SEO.]
- [Expand: a without href is a placeholder link (use for JS or styling with care).]

---

## 2) Absolute vs Relative URLs

- [Expand: absolute: full URL (scheme, host, path); use for external sites.]
- [Expand: relative: path from current document; / for site root; ./ or no leading slash for same directory.]
- [Expand: examples: same folder (file.html), parent (../page.html), root (/about).]

---

## 3) target and rel

- [Expand: target="_blank"—opens in new tab; always add rel="noopener noreferrer" for security.]
- [Expand: rel="nofollow" for untrusted or paid links if appropriate.]
- [Expand: default target is _self (same tab).]

---

## 4) Fragment Identifiers and In-Page Links

- [Expand: href="#section-id" links to element with id="section-id".]
- [Expand: useful for long pages (toc, skip links); URL can include fragment.]
- [Expand: Bridge: links are boundaries between resources; Phase 0.8.]

---

## Summary

- Use a with meaningful href; prefer relative URLs for same site; use target and rel correctly for new tabs.
- Fragments (#id) enable in-page navigation; links are boundaries to other resources.

---

## Bridge / Next

Next: **Chapter 2.5.5 — Lists**.

---

*Expansion note for ChatGPT: Include 2–3 link examples (internal, external, fragment). Target ~150 lines.*
