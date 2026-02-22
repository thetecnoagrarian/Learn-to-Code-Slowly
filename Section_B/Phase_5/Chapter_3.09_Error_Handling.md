## Phase 3 · Chapter 3.9: Error Handling in Express

This chapter builds on:
	•	Chapter 3.7: Middleware
	•	Chapter 0.6: Errors and Failure
	•	Chapter 2.11: 4xx and 5xx Status Codes

Errors are not exceptional.

They are normal.

Your system must expect them.

In Express, error handling is not optional. It is part of the execution model.

When something breaks, one of two things must happen:
	•	You convert the failure into a meaningful HTTP response.
	•	Or Express does it for you (poorly).

This chapter formalizes how errors move through the middleware pipeline, how they map to HTTP status codes, and how to design predictable failure behavior.

See the Express error handling guide in resources for the official model. Express catches synchronous throws and forwards them; async errors must reach next(err). The default handler returns 500 and may expose stack traces in development — never rely on it for production APIs.

## 1) Errors in the Execution Pipeline

Express is a pipeline:

Middleware → Middleware → Route → Middleware → Response

If no errors occur:
	•	Each middleware calls next()
	•	Eventually a route sends a response
	•	The cycle ends

If an error occurs:
	•	next(err) is called
	•	Express skips normal middleware
	•	Express jumps to error middleware

Error handling is a fork in the pipeline.

## 2) Two Categories of Errors

Errors in Express typically fall into two categories:
	1.	Synchronous errors
	2.	Asynchronous errors

Both must be handled.

They enter the pipeline differently.

## 3) Synchronous Errors

Synchronous errors happen immediately:

app.get("/api/sensors/:id", (req, res) => {
  const sensor = getSensor(req.params.id);

  if (!sensor) {
    throw new Error("Sensor not found");
  }

  res.json({ sensor });
});

When throw executes:
	•	Express catches it
	•	Express forwards it to error middleware

You do not need try/catch for basic synchronous errors.

Express wraps route handlers internally.

But throwing generic errors is not enough.

You must assign meaning.

## 4) Asynchronous Errors

Asynchronous code introduces complexity.

Example:

app.get("/api/sensors/:id", async (req, res) => {
  const sensor = await getSensor(req.params.id);
  res.json({ sensor });
});

If getSensor() rejects:
	•	In Express 5+, the rejection is caught automatically.
	•	In Express 4, you must manually catch and call next(err).

Safe pattern:

app.get("/api/sensors/:id", async (req, res, next) => {
  try {
    const sensor = await getSensor(req.params.id);
    res.json({ sensor });
  } catch (err) {
    next(err);
  }
});

Async errors must enter the middleware chain through next(err).

If they do not, the process may crash.

Never assume async errors are handled automatically unless you know your Express version.

Homestead case: getSensor might query SQLite, read from a file, or call an external API. Any of those can reject. If you await without try/catch and don't pass next, a database timeout or file-not-found will crash the process instead of returning 500. Capture and forward.

## 5) The next(err) Mechanism

Calling:

next(err);

Does three things:
	1.	Stops the normal middleware chain
	2.	Skips remaining route handlers
	3.	Transfers control to error middleware

Error middleware is identified by its signature:

function(err, req, res, next)

Four parameters.

Without four parameters, Express treats it as normal middleware.

## 6) The Default Error Handler

Express has a built-in error handler.

If you do nothing:
	•	It returns 500
	•	It may expose stack traces in development
	•	It hides details in production

This is insufficient for APIs.

You must define your own.

## 7) Custom Error Middleware

A minimal structured error handler:

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    error: message,
    status: status
  });
});

The headersSent guard: if you have already started sending the response (e.g. streaming) and an error occurs, you cannot send again. Delegate to the default handler with next(err) — it will close the connection. Place this after all routes.

Order matters.

Error middleware must be last.

## 8) Mapping Errors to HTTP Status Codes

Not all errors are 500.

You must map meaning to status.

Examples:
	•	Validation failure → 400
	•	Missing auth → 401
	•	Forbidden → 403
	•	Not found → 404
	•	Internal crash → 500

Example pattern:

app.get("/api/sensors/:id", (req, res, next) => {
  const sensor = getSensor(req.params.id);

  if (!sensor) {
    const err = new Error("Sensor not found");
    err.status = 404;
    return next(err);
  }

  res.json({ sensor });
});

Then central handler:

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

Status codes reflect responsibility.

4xx = client fault
5xx = server fault

Never blur that distinction.

## 9) Validation Errors

Body parsing may succeed.

Validation may fail.

Validation failures are 400.

Example:

app.post("/api/temp", (req, res, next) => {
  const { temp } = req.body;

  if (typeof temp !== "number") {
    const err = new Error("temp must be a number");
    err.status = 400;
    return next(err);
  }

  if (temp < -40 || temp > 150) {
    const err = new Error("temp out of range");
    err.status = 400;
    return next(err);
  }

  res.status(201).json({ saved: temp });
});

Same pattern for voltage, humidity, wattage, or panel status — validate type and range, map failures to 400.

Client sent syntactically valid JSON.
Semantically invalid data.

400 is correct.

Chapter 3.13 covers validation at the boundary in depth — schema validation, rejecting unknown fields, and structuring validation middleware.

## 10) Not Found Handling

Routes that do not match any handler should return 404.

Express does not automatically send 404 JSON.

You must define it:

app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

Place this before the error middleware.

This catches unmatched routes.

404 is not an exception.
It is an expected condition.

## 11) Operational vs Programmer Errors

Distinguish:

Operational errors:
	•	Missing file or sensor not found
	•	Database timeout or SQLite busy
	•	Invalid input (temp out of range, malformed voltage)
	•	Resource not found (panel, reading, energizer)

Programmer errors:
	•	Undefined variable
	•	Logic bug
	•	Unexpected null
	•	Code crash

Operational errors → return structured response
Programmer errors → return 500 and log heavily

Do not expose internal details to clients.

## 12) Logging Strategy

Error middleware should log:
	•	Timestamp
	•	Method
	•	Path
	•	Error message
	•	Stack trace (server-side only)

Example:

app.use((err, req, res, next) => {
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.path}`
  );
  console.error(err.stack);

  if (res.headersSent) return next(err);

  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

Logs are internal.

If your error middleware does not call next(err) and does not send a response, the request hangs. You must either respond or pass the error forward. Error handlers can be chained — one logs and calls next(err), another formats the JSON response — but the final handler must send something.

Clients receive controlled output.

Never leak secrets in error responses.

## 13) Double Response Guard

If you send a response, do not call next().

If headers are already sent and you try to respond again, Express throws:

Error: Can't set headers after they are sent.

Guard pattern:

if (!sensor) {
  return next(err);
}

Return prevents further execution.

Always return after sending a response.

## 14) Async Failure Discipline

In async code:
	•	Await everything
	•	Catch errors
	•	Pass to next()

Never leave unhandled promise rejections.

Unhandled rejections may terminate the Node process.

Express handles errors in the request cycle, not global promise failures.

Global safety:

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

But proper route-level handling is better.

## 15) Transport Failures vs HTTP Errors

If a client disconnects mid-request (ESP32 loses Wi-Fi, dashboard tab closed, mobile app backgrounded):
	•	No error middleware runs
	•	The connection simply closes

This is not an HTTP error.
This is a transport failure.

Express cannot respond to a closed socket.

Your code should not assume response always succeeds.

## 16) Structured Error Objects

Better pattern than raw Error:

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

Usage:

if (!sensor) {
  return next(new HttpError(404, "Sensor not found"));
}

Centralizes semantics.

Reduces repetition.

Improves clarity.

## 17) The Mental Model

Errors are part of the pipeline.

They travel forward through next(err).

Error middleware converts failures into HTTP responses.

Status codes communicate responsibility.

Logs record detail.

Clients receive structured messages.

Boundaries remain controlled.

Failure is normal.

Uncontrolled failure is not.

## 18) Anchor Understanding
	•	Errors interrupt normal middleware flow.
	•	next(err) transfers control to error middleware.
	•	Error middleware has four parameters.
	•	Map error meaning to proper HTTP status.
	•	Log internally, respond minimally.
	•	Always return after responding.
	•	Async errors must be captured.

Error handling is not decoration.

It is structural.

Without disciplined error handling, your API is unstable.

### Reflection

Errors fork the pipeline. next(err) transfers control to error middleware. Four parameters identify it. Map meaning to status — 4xx client, 5xx server. Log internally, respond minimally. Guard against headersSent. Return after every response. Capture async errors. Whether your API serves sensors, panels, or fence data — failure is normal; uncontrolled failure is not.

## What's Next

Next: Chapter 3.10 — Static Files and Assets

Where you'll learn:
	•	Dynamic route handlers vs static file serving
	•	How Express serves HTML, CSS, and JavaScript

You now know how errors move through the pipeline — next(err), error middleware, status mapping, headersSent guard.

Next, you will see how Express serves static assets for your dashboard frontend.