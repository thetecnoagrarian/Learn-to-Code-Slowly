# Phase 5.5 · Chapter 5.5.7: Classes and Types

Class syntax with types; public, private, readonly; implements interface. When classes vs plain objects.

---

## Learning Objectives

- Add types to class properties and methods; use public (default), private, readonly.
- Implement an interface: class SensorReader implements Sensor { }; use for consistency with DTOs.
- Decide when to use class (behavior + state, inheritance) vs plain object + interface (data, functional style).
- Type Express: rarely need custom classes; use interfaces for req body and res data.

---

## 1) Class with Types

- [Expand: class Sensor { readonly id: number; name: string; private _value: number; constructor(id: number, name: string) { ... } get value(): number { ... } }]
- [Expand: strict: initialize or use ! (definite assignment); private only in TS (erased in JS unless #).]
- [Expand: method return types; optional and readonly on properties.]

---

## 2) implements interface

- [Expand: interface SensorLike { id: number; name: string; } class Sensor implements SensorLike { ... }]
- [Expand: ensures class has required shape; use for DTOs or contracts.]
- [Expand: multiple: class C implements A, B { }.]

---

## 3) When Classes vs Plain Objects

- [Expand: class: when you have methods that use this; inheritance; or framework expects class.]
- [Expand: plain object + interface: data transfer (req.body, API response); functional style; no this.]
- [Expand: Express: prefer interfaces for request/response bodies; classes for services if you like OO.]

---

## 4) Express and Classes

- [Expand: req.body as SensorCreate; res.json(sensor as Sensor); or generic middleware for typing.]
- [Expand: service class: class SensorService { async getById(id: number): Promise<Sensor | null> { } }]
- [Expand: homestead: interfaces for Sensor, Config; optional service class; routes use interfaces.]

---

## Summary

- Classes: types on props and methods; public/private/readonly; implements interface; use when you need behavior; prefer interfaces for data.

---

## Bridge / Next

Next: **Chapter 5.5.8 — Strictness and Configuration**.

---

*Expansion note for ChatGPT: One class and one implements example. Target ~150 lines.*
