# Phase 2.5 · Chapter 2.5.13: Character Entities and Encoding

&amp;, &lt;, &gt;, &quot;; numeric entities; UTF-8 and meta charset.

---

## Learning Objectives

- Escape reserved characters in HTML using named entities (&amp;, &lt;, &gt;, &quot;, &apos;) or numeric entities.
- Know when to use entities (in text content and in attribute values) vs when not needed.
- Relate character encoding (UTF-8, meta charset) to correct display of characters.

---

## 1) Why Entities Exist

- [Expand: <, >, & have special meaning; use &lt;, &gt;, &amp; in content so they aren’t parsed as tags.]
- [Expand: " in attribute values: use &quot; inside double-quoted attributes if needed.]
- [Expand: ' can usually be used as-is; &apos; exists for single-quoted attributes.]

---

## 2) Named vs Numeric Entities

- [Expand: named: &amp;, &lt;, &gt;, &quot;, &nbsp;, &copy;.]
- [Expand: numeric: &#decimal; or &#xhex; for any Unicode character.]
- [Expand: when to use numeric: character has no name or name is hard to remember.]

---

## 3) UTF-8 and meta charset

- [Expand: UTF-8 can represent all Unicode; one byte for ASCII, more for others.]
- [Expand: <meta charset="UTF-8"> tells browser how to interpret bytes; must match file encoding.]
- [Expand: save files as UTF-8; then most characters need no entity.]

---

## 4) When Not to Use Entities

- [Expand: in UTF-8 document, you can type ©, é, 中文 directly if the file is saved as UTF-8.]
- [Expand: use entities when you can’t type the character or when it would be ambiguous (&, <, >).]
- [Expand: in JavaScript/CSS inside HTML, same rules for literal strings.]

---

## Summary

- Use &amp;, &lt;, &gt; (and &quot;, &apos; when needed) to escape special characters; numeric entities for any Unicode.
- UTF-8 + meta charset lets you use most characters directly; entities still needed for <, >, & in content.

---

## Bridge / Next

Next: **Chapter 2.5.14 — HTML and HTTP**.

---

*Expansion note for ChatGPT: Short list of common entities and one UTF-8 note. Target ~150 lines.*
