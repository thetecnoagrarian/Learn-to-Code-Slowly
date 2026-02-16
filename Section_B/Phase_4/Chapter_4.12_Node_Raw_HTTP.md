# Phase 2.7 · Chapter 2.7.12: Node and HTTP — Raw Server

Minimal http.createServer example; request URL and method; writing response; bridge to "Express organizes this" (Phase 3).

---

## Learning Objectives

- Write a minimal HTTP server with http.createServer that responds to GET with a simple body.
- Read req.url and req.method; send status, headers, and body with res.
- Understand how raw Node maps to Phase 2 (request line, headers, body) and Phase 3 (Express wraps this).

---

## 1) Minimal Server

- [Expand: const http = require("http"); const server = http.createServer((req, res) => { res.statusCode = 200; res.setHeader("Content-Type", "text/plain"); res.end("OK"); }); server.listen(3000).]
- [Expand: run with node server.js; curl http://localhost:3000 to test.]
- [Expand: one callback per request; no routing—every path gets same response.]

---

## 2) Request URL and Method

- [Expand: req.method—"GET", "POST", etc.; req.url—path + query (e.g. "/sensors?id=1").]
- [Expand: parse url with url.parse(req.url, true) or new URL(req.url, base) for pathname and searchParams.]
- [Expand: manual routing: if (req.url === "/" && req.method === "GET") { ... } else { ... }.]

---

## 3) Writing the Response

- [Expand: res.statusCode = 200 or 404; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ ok: true })).]
- [Expand: must call res.end() (or res.write then res.end); otherwise request hangs.]
- [Expand: Phase 2: status line, headers, body—all set explicitly here.]

---

## 4) Bridge to Express

- [Expand: Express gives app.get("/", (req, res) => ...); parses URL and body; res.json(), res.send().]
- [Expand: same HTTP; Express adds routing, middleware, and helpers; Phase 3.1 builds on this.]
- [Expand: homestead: raw server for learning; Express for real app (Phase 3).]

---

## Summary

- http.createServer callback receives req/res; read method and url; set status, headers, end with body.
- Express (Phase 3) organizes routing and response helpers on top of this model.

---

## Bridge / Next

Phase 2.7 complete. Next: **Phase 3 — Express.js Web Applications** (routing, middleware, APIs).

---

*Expansion note for ChatGPT: One 15–20 line raw server that responds to GET /. Target ~150 lines.*
