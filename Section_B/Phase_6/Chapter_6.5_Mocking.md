# Phase 3.5 · Chapter 3.5.5: Mocking and Stubs

Why mock (external deps, DB, time). Jest mocks: jest.fn(), jest.mock(). Stubbing modules and functions. Don't over-mock.

---

## Learning Objectives

- Explain why we mock: isolate unit under test; control external deps (DB, HTTP, time); avoid side effects.
- Use jest.fn() for spy/mock functions; jest.mock('module') to replace a module with mocks.
- Stub return values and assert calls (toHaveBeenCalledWith, toHaveBeenCalledTimes).
- Avoid over-mocking: mock at boundaries (DB, HTTP); don't mock everything.

---

## 1) Why Mock

- [Expand: external deps: DB, APIs, file system—slow, flaky, or need specific data.]
- [Expand: time: mock Date or timers for deterministic tests.]
- [Expand: isolate: test one unit; its dependencies behave in a controlled way.]

---

## 2) jest.fn() and jest.mock()

- [Expand: const fn = jest.fn(); fn.mockReturnValue(42); expect(fn).toHaveBeenCalledWith(1, 2).]
- [Expand: jest.mock('fs') or jest.mock('./db')—replace module; provide mock implementation.]
- [Expand: jest.mock at top of file; hoisted; use factory for per-test behavior if needed.]

---

## 3) Stubbing Return Values and Asserting Calls

- [Expand: mockReturnValue, mockResolvedValue (async); mockImplementation for full control.]
- [Expand: expect(mock).toHaveBeenCalled(); toHaveBeenCalledTimes(n); toHaveBeenCalledWith(a, b).]
- [Expand: clear between tests: mockClear() or mockReset().]

---

## 4) Don't Over-Mock

- [Expand: mock at boundaries: DB layer, HTTP client, file system; not every internal function.]
- [Expand: if you mock everything, you're testing mocks; integration tests need fewer mocks.]
- [Expand: prefer real but fast (in-memory DB, test double) when possible.]

---

## Summary

- Mock to isolate and control; use jest.fn() and jest.mock(); assert calls and return values.
- Mock at boundaries; don't over-mock; use integration tests when you need real interaction.

---

## Bridge / Next

Next: **Chapter 3.5.6 — Testing Express Routes and APIs**.

---

*Expansion note for ChatGPT: One jest.fn() and one jest.mock() example. Target ~150 lines.*
