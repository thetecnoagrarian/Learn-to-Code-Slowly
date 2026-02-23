# Phase 2.5 · Chapter 2.5.7: Tables

table, thead, tbody, th, td; scope and headers; when tables are appropriate (tabular data); accessibility.

---

## Learning Objectives

- Structure tables with table, thead, tbody, th, td.
- Use scope (th) and headers (td) for accessible table associations.
- Use tables only for tabular data, not for layout.
- Add a caption when it helps.

---

## 1) Table Structure

- [Expand: <table> wraps <thead>, <tbody>, <tfoot> (optional); rows <tr>; cells <th> or <td>.]
- [Expand: th = header cell; td = data cell; use thead for header row(s).]
- [Expand: one thead, one or more tbody, optional tfoot.]

---

## 2) scope and headers

- [Expand: scope on th: row, col, rowgroup, colgroup—tells assistive tech what the header applies to.]
- [Expand: headers on td: list of header cell ids when structure is complex.]
- [Expand: simple tables: scope="col" on column headers, scope="row" on row headers.]

---

## 3) When to Use Tables

- [Expand: tables for tabular data: rows and columns that relate (sensor readings, logs, comparisons).]
- [Expand: don’t use tables for page layout—use CSS (Phase 4) for layout.]
- [Expand: homestead: table of sensor name, value, unit, timestamp.]

---

## 4) caption and Accessibility

- [Expand: <caption> inside table—title or summary of the table.]
- [Expand: screen readers can announce caption; helps context.]
- [Expand: avoid merged cells (colspan/rowspan) when possible; they complicate accessibility.]

---

## Summary

- Use table, thead, tbody, th, td for real tabular data; use scope (and headers if needed) for accessibility.
- Don’t use tables for layout; add caption when it helps.

---

## Bridge / Next

Next: **Chapter 2.5.8 — Forms: Structure and Input Types**.

---

*Expansion note for ChatGPT: One simple accessible table example. Target ~150 lines.*
