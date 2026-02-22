# Phase 5.5 · Chapter 5.5.3: Interfaces and Type Aliases

interface for object shapes; type for unions and aliases; optional and readonly; extending interfaces.

---

## Learning Objectives

- Define object shapes with interface { name: string; value: number; optional?: string }.
- Use type for aliases (type ID = string) and unions (type Status = 'ok' | 'error'); interface for object shape.
- Use optional (?) and readonly; extend with interface B extends A { extra: number }.
- Prefer interface for objects that may be extended; type for unions and aliases.

---

## 1) interface

- [Expand: interface Sensor { id: number; name: string; value: number; unit?: string; }]
- [Expand: optional?: ; readonly id: number; excess properties checked in object literals (freshness).]
- [Expand: implement in class: class SensorReading implements Sensor { ... }.]

---

## 2) type Alias

- [Expand: type ID = string; type SensorStatus = 'ok' | 'alert' | 'offline';]
- [Expand: type Sensor = { id: number; name: string; }; same shape as interface for objects.]
- [Expand: unions and intersections: type A = B | C; type D = B & C.]

---

## 3) optional and readonly

- [Expand: optional?: means property can be undefined; readonly means assign only once.]
- [Expand: Readonly<T> utility for whole object; Partial<T> for all optional.]
- [Expand: practical: readonly for ids; optional for fields that may be missing.]

---

## 4) Extending

- [Expand: interface ExtendedSensor extends Sensor { timestamp: number; }]
- [Expand: type with intersection: type WithTimestamp = Sensor & { timestamp: number };]
- [Expand: homestead: Sensor base; SensorWithAlert extends or intersection with alert threshold.]

---

## Summary

- interface for object shapes and extension; type for aliases and unions; optional and readonly; extend with extends or &.

---

## Bridge / Next

Next: **Chapter 5.5.4 — Functions and Signatures**.

---

*Expansion note for ChatGPT: One interface and one type union example. Target ~150 lines.*
