## Phase 3 · Chapter 3.8: Body Parsing and Content Types

This chapter builds on:
	•	Chapter 3.7: Middleware
	•	Chapter 2.16: Content-Type and Content-Length
	•	Chapter 2.19: Request Bodies

You understand the middleware pipeline.
Now you must understand what happens when raw bytes enter your system.

Until parsed, a request body is just a stream of bytes.

req.body does not exist by default.

Parsing is not automatic.

Parsing is middleware.

express.json() and express.urlencoded() are built-in middleware. They are based on body-parser and shipped with Express. See the Express API reference in resources for options (limit, strict, reviver, type). The default limit for express.json() is 100kb — adequate for sensor readings, but you should set an explicit limit for production APIs.

## 1) Bodies Are Raw Streams

When a client sends:

POST /api/temp HTTP/1.1
Content-Type: application/json
Content-Length: 15

{"temp":72.5}

Node.js receives:
	•	Headers
	•	Then a stream of bytes

Express does not magically turn that into a JavaScript object.

Without parsing middleware:

req.body === undefined

This is intentional.

Express does not assume how to interpret bytes.

Content-Type determines meaning.

## 2) The Role of Content-Type

Content-Type is a declaration from the client:

“Interpret these bytes as this format.”

Examples:
	•	application/json
	•	application/x-www-form-urlencoded
	•	multipart/form-data
	•	text/plain

Parsing middleware inspects this header.

If it matches what the middleware handles,
the middleware parses.

If not,
it ignores.

Parsing is conditional.

## 3) JSON Parsing with express.json()

To parse JSON:

app.use(express.json());

This middleware:
	1.	Buffers the incoming body stream
	2.	Checks Content-Type
	3.	Parses JSON
	4.	Assigns result to req.body
	5.	Calls next()

Example:

app.use(express.json());

app.post("/api/temp", (req, res) => {
  const temp = req.body.temp;
  res.json({ received: temp });
});

Same pattern for readings (temp, humidity, voltage), panel config, or fence status — JSON bodies from ESP32, dashboard, or mobile app.

If Content-Type is:

application/json

Then:

req.body = { temp: 72.5 }

If Content-Type is anything else:

req.body = undefined

Middleware does nothing.

## 4) Malformed JSON

If Content-Type says JSON
but the body is invalid JSON:

{"temp": 72.5

Parsing fails.

Express throws a SyntaxError internally
and passes it to error middleware.

If no error middleware handles it,
Express returns 400.

You should explicitly handle it.

Example:

app.use(express.json());

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next(err);
});

Malformed input is a boundary failure.

Treat it as 400.

Homestead case: your ESP32 or MicroPython client might send truncated JSON if the connection drops mid-transmit. Or the dashboard might send invalid JSON if a bug corrupts the payload. The error middleware catches it — return 400 and log for debugging. Don't crash the server.

## 5) URL-Encoded Parsing

For HTML forms:

Content-Type: application/x-www-form-urlencoded

Use:

app.use(express.urlencoded({ extended: true }));

The extended option: false uses querystring (simple key=value). true uses the qs library and supports nested objects and arrays in form data. For simple forms (threshold, unit, limit), either works. For complex structures, prefer JSON. See the Express API for urlencoded options (limit, parameterLimit, depth).

Example body:

threshold=75&unit=F

Or sensor_id=coop-dht22&limit=50 for readings, panel=south-array for solar — form-encoded key=value pairs. Parsed result:

req.body = {
  threshold: "75",
  unit: "F"
}

Important:

All values are strings.

You must convert types manually.

Parsing does not validate types.

## 6) Multipart Parsing (Files)

File uploads use:

multipart/form-data

Express does not parse this by default.

You must use external middleware like multer.

Reason:

Multipart parsing is complex.

Boundaries separate parts.

Each part can have its own Content-Type.

This is outside minimal Express scope,
but conceptually the same:

Content-Type determines parser.

## 7) Parsing Order Matters

Middleware order applies here too.

Correct:

app.use(express.json());
app.post("/api/temp", handler);
app.post("/api/readings", handler);

Incorrect:

app.post("/api/temp", handler);
app.use(express.json());

If parsing middleware comes after the route,
req.body is undefined.

Order defines availability.

## 8) Size Limits

Bodies consume memory.

Without limits, an attacker can send huge payloads.

Protect yourself:

app.use(express.json({ limit: "1mb" }));

If body exceeds limit:
	•	Express throws error
	•	Error middleware handles it
	•	Client receives 413 Payload Too Large

Never run a public API without body limits.

## 9) Empty Bodies

GET and DELETE usually have no body.

After parsing middleware:

req.body === {}

This is expected.

An empty object is not an error.

But if your route expects data,
validate presence.

## 10) Content-Type Mismatch

If a client sends JSON
but forgets:

Content-Type: application/json

Then express.json() does not parse.

req.body is undefined.

This is correct behavior.

Express trusts the header.

Do not guess format.

Reject missing or incorrect Content-Type when required.

Example validation middleware:

function requireJson(req, res, next) {
  if (!req.is("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json" });
  }
  next();
}

415 = Unsupported Media Type.

Correct status code.

## 11) Parsing vs Validation

Parsing answers:

“Can I convert bytes into a JavaScript structure?”

Validation answers:

“Is this structure acceptable?”

These are different.

Example:

app.post("/api/temp", (req, res) => {
  const { temp } = req.body;

  if (typeof temp !== "number") {
    return res.status(400).json({ error: "temp must be a number" });
  }

  if (temp < -40 || temp > 150) {
    return res.status(400).json({ error: "temp out of range" });
  }

  res.status(201).json({ saved: temp });
});

Same pattern for voltage, humidity, wattage — parse first, then validate type and range.

Parsing succeeded.

But validation still required.

Never confuse syntactic validity with semantic validity.

## 12) Multiple Parsers Together

You can combine:

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Express checks each middleware in order.

Only the matching parser processes the request.

If JSON → json middleware handles.

If form → urlencoded middleware handles.

If neither → req.body remains undefined.

Explicit is safer than implicit.

## 13) Security Perspective

Parsing is a boundary crossing.

Raw bytes → structured data.

This is a trust transition.

Risks include:
	•	Large payload attacks
	•	JSON bombs
	•	Prototype pollution (rare but real)
	•	Type confusion
	•	Hidden malicious input

Mitigate by:
	•	Limiting body size
	•	Validating schema
	•	Rejecting unexpected fields
	•	Not trusting client-declared Content-Type blindly

Boundary discipline applies here.

Homestead case: your ESP32 or dashboard POSTs readings. A malicious client could send huge JSON, malformed structures, or prototype-polluting keys. Limit size, validate shape, and reject unknown fields before passing data to your sensor storage layer. Chapter 3.13 covers validation at the boundary in depth.

## 14) Internal Execution Model

Under the hood:
	1.	Node streams body chunks.
	2.	express.json() buffers them.
	3.	Once complete, it parses.
	4.	If parsing succeeds → attach to req.body.
	5.	If parsing fails → call next(error).

Understanding this helps debugging.

If a request hangs before reaching your route,
body parsing may be waiting for more bytes.

Content-Length matters — the parser uses it to know when the body is complete. Malformed streams (truncated JSON, early connection close) produce parse errors. Transport errors (connection reset, timeout) are different from parse errors — handle both in error middleware.

## 15) Mental Model Summary

Body parsing middleware:
	•	Reads raw body stream
	•	Checks Content-Type
	•	Converts bytes into JS structure
	•	Attaches to req.body
	•	Passes control forward
	•	Throws 400 on parse failure
	•	Enforces size limits

Without it:

req.body === undefined

With it:

req.body === parsed content

Parsing is not optional for POST/PUT/PATCH APIs.

It is foundational.

## 16) Anchor Understanding

Bodies are bytes.

Content-Type declares meaning.

Middleware interprets bytes.

Parsing happens before validation.

Validation must always follow parsing.

Size limits protect memory.

Order determines execution.

This is boundary enforcement in practice.

### Reflection

Bodies are bytes. Content-Type declares meaning. Middleware interprets bytes before your handlers run. Parse first — express.json() or express.urlencoded() — then validate. Never trust req.body without validation. Set explicit size limits. Handle parse errors with 400. Require Content-Type when format matters. Whether your API accepts temp readings, voltage, panel config, or fence status — the same boundary discipline applies.

## What's Next

Next: Chapter 3.9 — Error Handling in Express

Where you'll learn:
	•	Synchronous vs asynchronous errors
	•	Error propagation with next(err)
	•	Mapping application failures to proper 4xx/5xx responses

You now know how bodies are parsed — Content-Type, express.json(), express.urlencoded(), size limits, parse errors.

Next, you will formalize error handling so parse failures and application errors map to proper HTTP responses.