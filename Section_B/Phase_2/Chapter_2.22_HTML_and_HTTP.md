# Phase 2.5 · Chapter 2.5.14: HTML and HTTP

How HTML is requested (GET); Content-Type: text/html; caching and validation; bridge to Phase 2 and Express serving HTML.

---

## Learning Objectives

- Describe how a browser requests HTML (GET request; URL; response body).
- Explain Content-Type: text/html and why it matters.
- Relate caching (Cache-Control, ETag) and validation to HTML delivery.
- Connect to Phase 2 (HTTP) and Phase 3 (Express serving HTML with res.sendFile or res.render).

---

## 1) Requesting HTML

- [Expand: user navigates to URL or clicks link; browser sends GET request; server responds with body.]
- [Expand: HTML is the response body of that GET; same request/response model as Phase 2.]
- [Expand: subsequent resources (CSS, JS, images) are separate requests.]

---

## 2) Content-Type: text/html

- [Expand: server sends Content-Type: text/html; charset=utf-8 so browser knows how to interpret the body.]
- [Expand: wrong Content-Type can cause display or security issues (e.g. script not executed as HTML).]
- [Expand: Express: res.sendFile or res.render set appropriate headers.]

---

## 3) Caching and Validation

- [Expand: Cache-Control: how long client/cache can reuse response; no-cache vs no-store.]
- [Expand: ETag / If-None-Match: validation; 304 Not Modified when content unchanged.]
- [Expand: HTML pages: often shorter cache or no cache for dynamic content; static assets longer.]

---

## 4) Bridge to Phase 2 and Express

- [Expand: Phase 2: HTTP methods, status codes, headers, body—all apply to HTML delivery.]
- [Expand: Phase 3: Express serves HTML via static files or server-rendered templates (res.render); same HTTP.]
- [Expand: homestead: dashboard page is GET /; server returns HTML.]

---

## Summary

- HTML is delivered as the body of a GET response; Content-Type: text/html identifies it.
- Caching and validation headers control reuse; dynamic HTML often sent with no-cache or short max-age.
- Same HTTP model underlies Phase 2 and Phase 3; Express just generates or serves the HTML.

---

## Bridge / Next

Next: **Chapter 2.5.15 — Validation and Best Practices**.

---

*Expansion note for ChatGPT: One diagram or flow of GET → HTML response. Target ~150 lines.*
