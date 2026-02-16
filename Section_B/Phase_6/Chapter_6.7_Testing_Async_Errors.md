# Phase 3.5 · Chapter 3.5.7: Testing Async and Errors

Async tests: return promises or async/await. Testing that errors are thrown; testing error middleware responses.

---

## Learning Objectives

- Write async tests: return the promise or use async/await in the test function.
- Test that a function throws: expect(() => fn()).toThrow(); or expect(async () => await fn()).rejects.toThrow().
- Test Express error middleware: request.get('/bad').expect(500) and optionally assert error body.
- Avoid floating promises; ensure Jest waits for async completion.

---

## 1) Async Tests

- [Expand: it('async test', async () => { const res = await request(app).get('/'); expect(res.status).toBe(200); });]
- [Expand: or return request(app).get('/').then(res => expect(res.status).toBe(200));]
- [Expand: never leave a promise unreturned; Jest waits for returned promise.]

---

## 2) Testing Thrown Errors

- [Expand: expect(() => throwSync()).toThrow('message'); expect(() => throwSync()).toThrow(TypeError).]
- [Expand: async: await expect(asyncFn()).rejects.toThrow('message'); or try/catch in test.]
- [Expand: test both "throws" and "does not throw" when relevant.]

---

## 3) Testing Error Middleware

- [Expand: trigger 404: request(app).get('/nonexistent').expect(404);]
- [Expand: trigger 500: route that calls next(err); expect(500) and optionally res.body.error.]
- [Expand: mock a dependency to throw; assert error response shape.]

---

## 4) Timeouts and Cleanup

- [Expand: Jest default timeout; increase with jest.setTimeout(n) or per-test third param if needed.]
- [Expand: close server or DB connections in afterAll if you started them; supertest doesn't need listen.]
- [Expand: avoid hanging tests: ensure every async path resolves or rejects.]

---

## Summary

- Return promise or use async/await in tests; test throws with toThrow and rejects with rejects.toThrow.
- Test error responses (404, 500) via supertest; avoid floating promises and clean up in afterAll.

---

## Bridge / Next

Next: **Chapter 3.5.8 — Test Data and Fixtures**.

---

*Expansion note for ChatGPT: One async test and one error-middleware test. Target ~150 lines.*
