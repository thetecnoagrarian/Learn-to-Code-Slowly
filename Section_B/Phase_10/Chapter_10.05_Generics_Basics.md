# Phase 5.5 · Chapter 5.5.5: Generics — Basics

Generic functions and types; <T>; why generics (reuse without losing type info). Array and Promise as examples.

---

## Learning Objectives

- Write a generic function: function first<T>(arr: T[]): T; T is inferred or passed explicitly.
- Use generic types: Array<T>, Promise<T>, Record<K, V>; understand type parameter.
- Explain why generics: one function for many types without losing type (no any); type flows through.
- Use generics in Express: typing res.json(data) so data is constrained; or typing a repo getById<T>.

---

## 1) Generic Functions

- [Expand: function identity<T>(x: T): T { return x; }; first<string>(['a','b']) or inferred first(['a','b']).]
- [Expand: function map<T, U>(arr: T[], fn: (t: T) => U): U[]; type flows from arr and fn.]
- [Expand: constraints: <T extends { id: number }> when T must have id.]

---

## 2) Generic Types

- [Expand: Array<T>, Promise<T>; interface ApiResponse<T> { data: T; status: number; }]
- [Expand: use: const x: ApiResponse<Sensor[]>; then x.data is Sensor[].]
- [Expand: Record<K, V> for object with key type K and value type V.]

---

## 3) Why Generics

- [Expand: without generics: any or overloads for every type; with generics: one definition, many types, type safe.]
- [Expand: example: wrapper that returns same type as input; or fetchJson<T>(url): Promise<T>.]
- [Expand: homestead: ApiResponse<Sensor>; getSensor(id): Promise<Sensor | null>.]

---

## 4) Practical Examples

- [Expand: async function fetchJson<T>(url: string): Promise<T> { const res = await fetch(url); return res.json(); }]
- [Expand: const sensors = await fetchJson<Sensor[]>('/api/sensors'); sensors is Sensor[].]
- [Expand: Express: res.json(sensors) — sensors typed as Sensor[] so body is correct.]

---

## Summary

- Generics: <T> for function or type; reuse with type safety; Array, Promise, ApiResponse<T>; use for API and repos.

---

## Bridge / Next

Next: **Chapter 5.5.6 — Union and Literal Types**.

---

*Expansion note for ChatGPT: One generic function and one ApiResponse<T> example. Target ~150 lines.*
