# Phase 4.5 · Chapter 4.5.7: Fetch and HTTP from the Browser

fetch(url); Response, json(), text(); status and error handling. GET and POST with fetch. Same-origin and CORS (concept). Bridge to Phase 2 and Phase 3 APIs.

---

## Learning Objectives

- Use fetch(url) for GET; await response; check response.ok or response.status; call response.json() or response.text().
- Handle errors: network failure (catch), HTTP 4xx/5xx (check response.ok); show user-friendly message.
- Send POST with fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).
- Understand same-origin; CORS: server must send Access-Control-Allow-Origin for cross-origin requests; Phase 3 can set CORS headers.

---

## 1) fetch and Response

- [Expand: const res = await fetch('/api/sensors'); res.status, res.ok (true if 2xx), res.headers.]
- [Expand: res.json() returns Promise with parsed body; res.text() for text; call once per response.]
- [Expand: GET is default; no body.]

---

## 2) Error Handling

- [Expand: fetch rejects on network error (catch); 4xx/5xx do not reject—check res.ok or res.status.]
- [Expand: if (!res.ok) throw new Error(res.statusText); or handle 404/500 with message.]
- [Expand: try/catch around fetch; show "Failed to load" or similar in UI.]

---

## 3) POST and Options

- [Expand: fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, value }) }).]
- [Expand: credentials: 'include' for cookies; same-origin by default.]
- [Expand: Bridge to Phase 2 (methods, body) and Phase 3 (Express receives body).]

---

## 4) Same-Origin and CORS

- [Expand: same origin: same scheme, host, port; fetch to same origin works without CORS.]
- [Expand: cross-origin: server must respond with Access-Control-Allow-Origin (or *); otherwise browser blocks reading response.]
- [Expand: Phase 3: use cors middleware for API consumed by different origin; concept only here.]

---

## Summary

- fetch for GET/POST; check res.ok and status; res.json()/text(); handle network and HTTP errors; CORS for cross-origin.

---

## Bridge / Next

Next: **Chapter 4.5.8 — Script Loading: defer, async, modules**.

---

*Expansion note for ChatGPT: One GET and one POST fetch example. Target ~150 lines.*
