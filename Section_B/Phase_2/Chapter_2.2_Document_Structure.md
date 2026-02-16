# Phase 2.5 · Chapter 2.5.2: Document Structure and the DOCTYPE

DOCTYPE; html, head, body; character encoding (meta charset); title; viewport and meta tags.

---

## Learning Objectives

- Write a minimal valid HTML5 document with DOCTYPE, html, head, and body.
- Set character encoding with meta charset and explain why it must be early.
- Use the title element and understand its role in tabs, bookmarks, and SEO.
- Add viewport and other common meta tags where appropriate.

---

## 1) DOCTYPE and html Root

- [Expand: <!DOCTYPE html>—tells browser to use HTML5 parsing; no version number.]
- [Expand: <html lang="...">—root element; lang aids accessibility and translation.]
- [Expand: no closing tag needed for DOCTYPE; html wraps everything.]

---

## 2) head vs body

- [Expand: head = metadata and linked resources (title, meta, link, script for config); not visible in layout.]
- [Expand: body = visible content; one body per document.]
- [Expand: order: DOCTYPE → html → head (then body) → body content.]

---

## 3) Character Encoding and meta charset

- [Expand: <meta charset="UTF-8">—must be in first 1024 bytes; prevents wrong interpretation of characters.]
- [Expand: place in head, ideally first child; no closing tag.]
- [Expand: UTF-8 covers virtually all characters; use it by default.]

---

## 4) title and Other Meta Tags

- [Expand: <title>—shown in tab, bookmarks, search results; one per page; descriptive text.]
- [Expand: viewport: <meta name="viewport" content="width=device-width, initial-scale=1">—responsive behavior.]
- [Expand: optional: description, robots; avoid keyword stuffing.]

---

## Summary

- Every page needs DOCTYPE, html, head, body; charset in head first; title for identity and UX.
- head = metadata; body = visible content; viewport meta supports responsive design.
- Valid structure is the base for accessibility and later CSS/JS.

---

## Bridge / Next

Next: **Chapter 2.5.3 — Text and Headings**.

---

*Expansion note for ChatGPT: Include a minimal 15–20 line HTML5 skeleton. Target ~150 lines.*
