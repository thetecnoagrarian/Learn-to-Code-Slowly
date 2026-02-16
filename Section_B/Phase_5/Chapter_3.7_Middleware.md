## Phase 3 · Chapter 3.7: Middleware: The Execution Pipeline

This chapter builds on:
	•	Chapter 3.4: Routing Fundamentals
	•	Phase 0.8: Boundaries

You understand routes.
You understand req and res.
Now you must understand what happens before your route handler runs.

Middleware is the execution pipeline of Express.

If routes are destinations,
middleware is the road system that leads to them.

Without middleware, every route would need to:
	•	Log requests
	•	Validate input
	•	Authenticate users
	•	Parse bodies
	•	Handle errors
	•	Set common headers

Repeated code.
Inconsistent logic.
Security holes.

Express is essentially a series of middleware function calls. See the Express guide on using middleware in resources for the official model. When you call app.use(express.json()), you are adding built-in body-parsing middleware to the pipeline. Chapter 3.8 examines how that works in detail.

Middleware centralizes cross-cutting concerns.

## 1) The Core Mental Model

Every incoming request moves through a stack.

Think of it as a vertical pipeline:

Incoming Request
      ↓
Middleware 1
      ↓
Middleware 2
      ↓
Middleware 3
      ↓
Route Handler
      ↓
Outgoing Response

Each layer gets a chance to:
	•	Inspect the request
	•	Modify the request
	•	Modify the response
	•	End the request
	•	Or pass control forward

This is not optional behavior.

This is how Express executes.

If you misunderstand middleware,
you misunderstand Express.

## 2) Middleware Signature

A standard middleware function:

function middleware(req, res, next) {
  // Do something
  next();
}

It receives:
	•	req → incoming request
	•	res → outgoing response
	•	next → function that passes control forward

The rule:

If you do not call next()
and you do not send a response
the request hangs.

This is a hard invariant.

One request must:
	•	Either move forward
	•	Or terminate

Never neither.

## 3) The next() Function

next() means:

“I’m done. Pass control to the next layer.”

If you omit it:

app.use((req, res, next) => {
  console.log("Logging...");
});

The request never reaches the route handler.

The client waits.
Eventually it times out.

This is one of the most common beginner mistakes.

The pipeline is manual.
You must explicitly move forward.

## 4) Execution Order Is Deterministic

Middleware executes strictly in the order it is registered.

Example:

app.use((req, res, next) => {
  console.log("A");
  next();
});

app.use((req, res, next) => {
  console.log("B");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello");
});

Request flow:

A
B
Route Handler

Express does not reorder.
Express does not optimize.
Order is literal.

If something runs in the wrong order,
it was added in the wrong order.

## 5) Middleware Can Modify req

Middleware can attach data to req.

Example:

app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

Later:

app.get("/", (req, res) => {
  res.json({ time: req.requestTime });
});

This is powerful.

It allows upstream layers to enrich downstream layers.

Authentication middleware commonly attaches:

req.user

Validation middleware may attach:

req.validatedBody

The request object becomes the shared state for that request.

But this state only exists for that request.

Never treat req as global state.

## 6) Middleware Can Modify res

Middleware can also set headers or defaults:

app.use((req, res, next) => {
  res.set("X-Powered-By", "Homestead Pi");
  next();
});

Or for solar monitoring, fence status, or coop sensors — any custom header.

Or:

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

Response modifications apply unless overwritten later.

Order still matters.

If a later middleware changes a header,
the later value wins.

## 7) Middleware Can Terminate Early

Middleware does not have to call next().

It can end the request:

app.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

Here:
	•	Unauthorized requests stop immediately
	•	Authorized requests proceed

This is how authentication works.

Middleware becomes a gate.

## 8) Path-Scoped Middleware

Middleware can apply only to certain paths:

app.use("/api", (req, res, next) => {
  console.log("API request");
  next();
});

Same pattern for scoping auth to `/api/panels`, `/api/fence`, or `/api/readings`. This middleware runs only when:

req.path.startsWith("/api")

Requests to /dashboard skip it.

This allows layered protection:
	•	Global logging middleware
	•	API-only authentication middleware
	•	Route-specific validation middleware

Stacked in layers.

## 9) Middleware and Routes Share the Same Pipeline

Routes are technically specialized middleware. Express.Router() creates router-level middleware — same pipeline, but bound to a sub-path. Use it to group API routes for sensors, panels, or fence endpoints. See the Express routing and middleware guides in resources.

When you define:

app.get("/api/sensors", handler);

Express internally adds a middleware that:
	•	Matches method + path
	•	Calls your handler

So the pipeline is unified:

Middleware
Middleware
Route-matching middleware
Route handler

There is no conceptual separation.

Routes are just conditional middleware.

## 10) Error-Handling Middleware

Error middleware has a different signature:

function errorMiddleware(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}

Four parameters.

Express recognizes error middleware by arity (4 arguments). The signature must have exactly four parameters — even if you do not use next, you must include it. Otherwise Express treats it as regular middleware and errors will not be caught.

When next(err) is called, Express skips normal middleware and jumps to the nearest error middleware.

Example:

app.use((req, res, next) => {
  try {
    riskyOperation();
    next();
  } catch (err) {
    next(err);
  }
});

This creates structured error flow.

Without error middleware:
	•	Errors crash the process
	•	Or produce unstructured output

With error middleware:
	•	You control failure responses
	•	You centralize error logging

Error middleware should be defined last, after all routes and other middleware. Otherwise requests that never throw will skip it. One catch-all error handler at the end of the pipeline ensures every unhandled error gets a structured response instead of crashing the process.

## 11) Middleware and Phase 0 Boundaries

Middleware is boundary enforcement.

It is where:
	•	Input gets validated
	•	Authentication gets enforced
	•	Rate limiting gets applied
	•	Logging happens
	•	Transformation occurs

Every request crosses the boundary once.

Middleware defines what is allowed to enter your system.

If validation happens inside every route,
you have duplicated boundary logic.

Middleware centralizes it.

This is architectural hygiene.

## 12) Real-World Pipeline Example

Imagine your Pi is running an API for sensors, panels, or fence readings.

You might structure middleware like this:

app.use(requestLogger);
app.use(express.json());
app.use("/api", authenticateToken);
app.use("/api", validateSensorPayload);

app.post("/api/readings", createReading);

express.json() is middleware. It parses JSON bodies before your handlers run. Without it, req.body would be undefined. Chapter 3.8 unpacks how that works and what happens when the body is malformed.

Same structure for solar production, fence voltage, or cow barn temp — parse, auth, validate, then execute.

Execution:
	1.	Log request
	2.	Parse JSON body
	3.	Authenticate token
	4.	Validate body shape
	5.	Execute route logic

Each layer has one responsibility.

If authentication fails,
validation never runs.

If validation fails,
route logic never runs.

This is intentional containment.

## 13) Common Mistakes

### 13.1) Forgetting next()

Request hangs.

### 13.2) Calling next() After Sending a Response

res.json(data);
next();

This causes errors like:
“Cannot set headers after they are sent.”

Once a response is sent,
the pipeline should stop.

### 13.3) Incorrect Middleware Order

If authentication middleware appears after route handlers,
it never runs.

Order defines execution.

Always think top-to-bottom.

### 13.4) Mutating Global State

Never do:

let currentUser;
app.use((req, res, next) => {
  currentUser = req.headers.authorization;
});

That creates race conditions across concurrent requests. Two ESP32 devices posting readings at the same time, or a dashboard and a sensor hitting the server simultaneously — one overwrites the other. req is per-request; global variables are shared across all requests. Attach data to req, not global variables.

### 13.5) Placing Error Middleware Too Early

If you define error middleware before routes, it never runs for route-handled requests. Error middleware catches errors from next(err). Define it after all routes and normal middleware. Order matters for error handlers too.

## 14) Middleware Is Linear, Not Recursive

Express does not rewind.

Once a middleware passes control forward,
it does not automatically regain control unless structured that way.

The flow is linear and directional.

Think:

forward-only conveyor belt

## 15) Visualizing the Execution Model

Imagine a request as a physical object entering a factory:
	•	Station 1: Logging
	•	Station 2: Body parsing
	•	Station 3: Authentication
	•	Station 4: Validation
	•	Station 5: Route logic (sensor, panel, fence, etc.)
	•	Station 6: Response assembly

Each station either:
	•	Approves and forwards
	•	Rejects and stops
	•	Or throws an error

Middleware is factory stations.

Routes are the final assembly station.

## 16) Why Middleware Matters for Scale

Without middleware:
	•	Every route duplicates logic
	•	Security checks become inconsistent
	•	Validation drifts
	•	Logging is partial
	•	Bugs multiply sideways

With middleware:
	•	Concerns are modular
	•	Security is centralized
	•	Observability is consistent
	•	Behavior is predictable

Middleware is architectural discipline.

## 17) Anchor Understanding

Middleware is the execution pipeline.

Every request flows through a stack.

Each layer can:
	•	Read
	•	Modify
	•	Reject
	•	Forward

Order matters.
next() matters.
Boundaries live here.

If Phase 2 taught you how HTTP works,
Middleware is where you enforce how your server uses HTTP.

### Reflection

Middleware is the road; routes are the destinations. Each layer does one thing — log, parse, auth, validate, execute. Order defines behavior. next() is the handoff. Missing it hangs. Calling it after res.send() breaks. Put error handlers last. Attach state to req, never globals. Boundaries live here — whether your API serves sensors, panels, or fence readings, the same pipeline applies.

## What's Next

Next: Chapter 3.8 — Body Parsing and Content Types

Where you'll learn:
	•	How express.json() works internally
	•	Why Content-Type determines parsing
	•	How malformed bodies trigger boundary failures

You now know how the pipeline runs — middleware before routes, next() to advance, error handlers at the end.

Next, you will see how express.json() fits into that pipeline and what breaks when bodies are malformed.