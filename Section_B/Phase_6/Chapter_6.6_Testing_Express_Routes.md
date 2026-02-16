# Phase 3.5 · Chapter 3.5.6: Testing Express Routes and APIs

Using supertest (or similar): request(app).get/post(). Testing status codes, response body, headers. Isolating routes (no real DB).

---

## Learning Objectives

- Use supertest: require('supertest')(app); request.get('/path').expect(200).expect('Content-Type', /json/).
- Test status codes, response body (JSON), and headers without starting a real server.
- Isolate routes: use in-memory store or mocked DB so tests don't depend on real DB.
- Write integration-style tests for GET and POST endpoints (sensors API).

---

## 1) supertest Basics

- [Expand: const request = require('supertest')(app); pass Express app, not server.listen.]
- [Expand: await request.get('/sensors').expect(200); chain .expect(status), .expect('Content-Type', /json/), .expect(body).]
- [Expand: request.post('/sensors').send({ name: 'temp', value: 22 }).expect(201); no need to call app.listen.]

---

## 2) Asserting Status, Body, Headers

- [Expand: .expect(200) or .expect(404); .expect(res => { expect(res.body).toHaveProperty('sensors'); });]
- [Expand: .expect('Content-Type', /json/); .expect('X-Custom-Header', 'value').]
- [Expand: use .then(res => ...) or async/await with request; supertest returns thenable.]

---

## 3) Isolating Routes

- [Expand: inject in-memory store or mock DB into app so each test gets clean state.]
- [Expand: beforeEach: clear store or reset mock; or use a fresh app per test.]
- [Expand: no real DB in CI; tests must be repeatable and fast.]

---

## 4) Example: GET and POST /sensors

- [Expand: describe('GET /sensors'); it('returns 200 and array'); it('returns 404 for missing id').]
- [Expand: describe('POST /sensors'); it('returns 201 and created sensor'); it('returns 400 for invalid body').]
- [Expand: homestead: sensor API routes; validation and status codes.]

---

## Summary

- Use supertest with Express app; assert status, body, headers; isolate with in-memory or mocks.
- Test happy path and error paths (400, 404); keep tests independent with beforeEach.

---

## Bridge / Next

Next: **Chapter 3.5.7 — Testing Async and Errors**.

---

*Expansion note for ChatGPT: One full route test (GET and POST) with supertest. Target ~150 lines.*
