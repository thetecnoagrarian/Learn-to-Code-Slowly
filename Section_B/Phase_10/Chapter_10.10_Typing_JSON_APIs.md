# Phase 5.5 · Chapter 5.5.10: Typing JSON and APIs

Interfaces for API responses and request bodies; validation vs types (runtime vs compile time). Bridge to Phase 2.7 and Phase 3.

---

## Learning Objectives

- Define interfaces for API response (e.g. { sensors: Sensor[] }) and request body (SensorCreate); use in fetch and Express.
- Understand types are compile-time only; runtime data (JSON) must be validated; use validation library or manual checks after parse.
- Type fetchJson<T>(url): Promise<T>; then validate or assert shape before use; avoid trusting response without check.
- Connect to Phase 2.7 (JSON) and Phase 3 (Express body); type + validate at boundary.

---

## 1) Response and Body Interfaces

- [Expand: interface SensorResponse { id: number; name: string; value: number; }; interface SensorCreate { name: string; value: number; unit?: string; }]
- [Expand: Express: req.body as SensorCreate (after validation); res.json(sensor as SensorResponse);]
- [Expand: fetch: const data = await fetchJson<Sensor[]>('/api/sensors'); data is Sensor[] only by trust; validate in dev or use runtime check.]

---

## 2) Types vs Validation

- [Expand: TypeScript types don’t exist at runtime; JSON.parse returns any or typed by assertion.]
- [Expand: validation (zod, io-ts, or manual) runs at runtime; use result to narrow type or return 400.]
- [Expand: pattern: validate(req.body) → if valid, body is SensorCreate; then use in handler.]
- [Expand: Bridge to Phase 3.13: validation at boundary; types document expected shape.]

---

## 3) Typing fetch and Responses

- [Expand: async function fetchJson<T>(url: string): Promise<T> { const res = await fetch(url); if (!res.ok) throw new Error(res.statusText); return res.json(); }]
- [Expand: const sensors = await fetchJson<Sensor[]>('/api/sensors'); type says Sensor[] but runtime might not be; validate in critical paths.]
- [Expand: frontend: type API response; backend: type res.json payload; keep in sync with actual API.]

---

## 4) Homestead and Phase 2.7/3

- [Expand: Phase 2.7: JSON.parse in Node; type result with interface; validate config and API payloads.]
- [Expand: Phase 3: type body and response; validate body; return typed res.json; document API with same interfaces.]
- [Expand: shared types: one Sensor interface used in Express and in frontend fetch.]

---

## Summary

- Interface for request/response shapes; types are compile-time—validate at runtime; type fetch and Express; Bridge to Phase 2.7 and 3.

---

## Bridge / Next

Next: **Chapter 5.5.11 — TypeScript with the Frontend (Optional)**.

---

*Expansion note for ChatGPT: One fetchJson<T> and one validation-narrowing pattern. Target ~150 lines.*
