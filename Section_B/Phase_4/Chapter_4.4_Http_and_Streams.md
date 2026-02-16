# Phase 2.7 · Chapter 2.7.4: Built-in Modules — http and Streams

http.createServer; request and response objects; streams concept; bridge to "Express wraps this" (Phase 3.1).

---

## Learning Objectives

- Create a minimal HTTP server with http.createServer and listen on a port.
- Inspect request (method, url, headers) and send response (status, headers, body).
- Understand that req/res are streams (readable/writable); pipe and events.
- See how Express (Phase 3) wraps this with routing and middleware.

---

## 1) http.createServer

- [Expand: const http = require("http"); const server = http.createServer((req, res) => { ... }); server.listen(3000).]
- [Expand: callback runs per request; req = IncomingMessage, res = ServerResponse.]
- [Expand: one request, one response; then connection can be reused (keep-alive).]

---

## 2) Request and Response Objects

- [Expand: req.method, req.url, req.headers; body via req.on("data")/("end") or stream.]
- [Expand: res.statusCode = 200; res.setHeader("Content-Type", "application/json"); res.end(body).]
- [Expand: res.write then res.end; or res.end(body) in one go.]

---

## 3) Streams Concept

- [Expand: req is readable stream; res is writable; streaming for large bodies.]
- [Expand: for small bodies: collect chunks in array then concat; or use libraries.]
- [Expand: Express will parse body for you (Phase 3.8); raw Node gives you streams.]

---

## 4) Bridge to Express

- [Expand: Express wraps http.createServer; adds routing (method + path), middleware, res.send, res.json.]
- [Expand: same request/response model; Express organizes code and parses body.]
- [Expand: Phase 3.1: "What Express Is" builds on this.]

---

## Summary

- http.createServer gives req/res per request; set status, headers, end with body; req/res are streams.
- Express (Phase 3) wraps this with routing, middleware, and helpers.

---

## Bridge / Next

Next: **Chapter 2.7.5 — process and Buffer**.

---

*Expansion note for ChatGPT: Minimal server example (10–15 lines). Target ~150 lines.*
