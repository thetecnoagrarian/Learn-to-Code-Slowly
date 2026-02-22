# Phase 5.5 · Chapter 5.5.9: TypeScript with Node and Express

Typing Express req, res, routes; @types/express; typing middleware and error handlers. Bridge to Phase 3.

---

## Learning Objectives

- Install @types/express (and @types/node); get typed req, res, Request, Response, NextFunction.
- Type route handlers: (req: Request, res: Response) => void or Promise<void>; type req.body and req.params with interfaces.
- Type middleware: (req, res, next: NextFunction) => void; type error middleware (err, req, res, next).
- Use types for params and body so validation and handlers know shape; Bridge to Phase 3.

---

## 1) @types/express

- [Expand: npm install -D @types/express @types/node; types come from DefinelyTyped.]
- [Expand: Request, Response, NextFunction; req.body is any by default; extend or use generic for body.]
- [Expand: res.json(data) infers from data if typed; res.status(200).json(sensors).]

---

## 2) Typing Route Handlers

- [Expand: app.get('/sensors', (req: Request, res: Response) => { res.json(sensors); });]
- [Expand: req.params: Record<string, string> or typed with generic; req.query similar.]
- [Expand: req.body: define interface SensorCreate; use as req.body as SensorCreate after validation (or use type guard).]
- [Expand: async: (req, res): Promise<void> or return Promise; next(err) in catch.]

---

## 3) Middleware and Error Handler

- [Expand: middleware: (req, res, next: NextFunction) => void; call next() or next(err).]
- [Expand: error handler: (err: Error, req: Request, res: Response, next: NextFunction) => void; four params.]
- [Expand: type extended request: extend Request with custom props (e.g. user); use declaration merging.]
- [Expand: homestead: auth middleware adds user to req; type ExtendedRequest.]

---

## 4) Bridge to Phase 3

- [Expand: Phase 3: same Express API; add types to params, body, and response; fewer runtime shape errors.]
- [Expand: validation (Phase 3.13) can narrow type: after validate(req.body), treat as SensorCreate.]
- [Expand: Phase 9 better-sqlite3: type query results with interface; same patterns.]

---

## Summary

- @types/express; type req, res, next; type body and params with interfaces; type middleware and error handler; Bridge to Phase 3.

---

## Bridge / Next

Next: **Chapter 5.5.10 — Typing JSON and APIs**.

---

*Expansion note for ChatGPT: One route handler and one body interface. Target ~150 lines.*
