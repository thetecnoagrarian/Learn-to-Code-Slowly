## Phase 3 · Chapter 3.6: Sending Responses Correctly

This chapter builds on:
	•	Chapter 3.3: The Request and Response Objects
	•	Chapter 2.8: Response Structure
	•	Chapter 2.9: Status Codes Overview

You now understand how requests enter your server and how routes are matched.

Now we focus on the other half of HTTP:

**How your server responds.**

A response is not just data. It is a structured message that communicates:

1. Outcome (status code)
2. Metadata (headers)
3. Representation (body)

If routing is the dispatch layer, responses are the communication layer.

Correct responses are not cosmetic — they define the contract between server and client. Clients (your dashboard, ESP32, mobile app) rely on status codes to know whether the request succeeded, failed, or needs a different action. Wrong status codes cause retries, broken UX, and wasted debugging time.

## 1) The Structure of an HTTP Response

Every HTTP response contains three parts:

### 1.1) Status Line

HTTP/1.1 200 OK

This includes:
- Protocol version
- Status code
- Reason phrase

### 1.2) Headers

Metadata about the response:

Content-Type: application/json
Cache-Control: max-age=60
Content-Length: 123

Headers instruct the client how to interpret the response.

### 1.3) Body

The actual representation:

- JSON
- HTML
- Plain text
- Binary data

Express provides abstractions that construct all three parts correctly.

## 2) Setting Status Codes

Status codes communicate outcome.

```javascript
res.status(200).send('OK');
res.status(201).json({ id: 123 });
res.status(404).send('Not Found');
res.status(500).send('Server Error');
```

Common Status Codes

Code	Meaning
200	OK — success with representation
201	Created — resource created
204	No Content — success, no body
400	Bad Request — client error
404	Not Found — resource missing
500	Internal Server Error — server fault

Status codes are signals.

They are part of the API contract. See the HTTP and status code entries in resources for the full semantics. For APIs: 2xx means success, 4xx means client error (bad request, not found, unauthorized), 5xx means server error. Choose intentionally — clients use these to decide what to do next.

## 3) Sending JSON Responses

For APIs, res.json() should be your default.

app.get('/api/sensors/alpha', (req, res) => {
  const sensor = getSensor('alpha');

  if (!sensor) {
    return res.status(404).json({ error: 'Sensor not found' });
  }

  res.status(200).json({ sensor });
});

res.json():
	•	Sets Content-Type: application/json
	•	Serializes objects to JSON
	•	Sets Content-Length
	•	Ends the response

This is the correct way to send structured API data. Same pattern for sensor readings, solar panel status, or energizer voltage.

Calling res.json() (or res.send(), res.redirect(), res.end()) terminates the response. After that, you cannot send more data or change headers. Express sends the response and closes the connection. This is why you return after early exits — to avoid falling through to another send.

## 4) Sending Text Responses

For plain text or simple output, use res.send():

app.get('/api/voltage', (req, res) => {
  const voltage = readVoltage();
  res.status(200).send(`${voltage}`);
});

Or solar production, fence status — anything that returns a single value.

res.send() behavior depends on input:
	•	String → text/html or text/plain
	•	Object → JSON
	•	Buffer → Binary
	•	Number → Converted to string

For explicit control:

res.type('text/plain').send('Hello');

Explicit is better than assumed when clarity matters. For APIs, prefer res.json() — it always sets Content-Type: application/json. Using res.send() with an object also sends JSON, but res.json() is clearer intent and handles edge cases (null, undefined, circular references) consistently. See the Express response API in resources.

## 5) Sending No Content (204)

When the operation succeeds but returns no body:

app.delete('/api/sensors/:id', (req, res) => {
  deleteSensor(req.params.id);
  res.status(204).send();
});

Same pattern for deleting a panel config or removing an energizer from the registry.

Important rule:

204 must not include a body.

Sending JSON with 204 is incorrect.

## 6) Redirects

To instruct a client to fetch a different resource:

app.get('/api/v1/sensors', (req, res) => {
  res.redirect(301, '/api/v2/sensors');
});

Same pattern when you version panels, readings, or fence endpoints.

res.redirect():
	•	Sets status code (default 302)
	•	Sets Location header
	•	Ends response

Use:
	•	301 → Permanent
	•	302 → Temporary (default)
	•	307/308 → Method-preserving redirects

Redirects are HTTP instructions, not application logic. Homestead case: when you move from `/api/v1/readings` to `/api/v2/readings` for solar or fence data, a 301 tells clients to update bookmarks. Old ESP32 or dashboard URLs keep working.

## 7) Setting Headers

To control caching, negotiation, or custom metadata:

res.set('Cache-Control', 'max-age=60');
res.set('ETag', '"v123"');

Multiple headers:

res.set({
  'Cache-Control': 'max-age=60',
  'ETag': '"v123"'
});

Headers influence:
	•	Caching
	•	Compression
	•	Content type
	•	Security behavior
	•	Conditional requests

They are powerful. Use intentionally. Homestead case: Cache-Control: max-age=60 on solar wattage or fence voltage lets the dashboard cache readings for a minute. ETag lets clients do conditional requests — "only send data if it changed." Both reduce load on your Pi.

## 8) Method Chaining

Express response methods are chainable:

res.status(200)
   .set('Cache-Control', 'max-age=60')
   .json({ voltage: 12.1 });

Or solar wattage, sensor reading, panel status — any cached API data.

This builds:
	•	Status line
	•	Headers
	•	Body

In one fluent sequence.

## 9) Common Mistakes

### Mistake 1: Forgetting Status Codes

res.json({ error: 'Not found' });

This defaults to 200.

That is incorrect.

Always set the correct status before sending error responses.

### Mistake 2: Sending Body with 204

res.status(204).json({});

204 means no content. No body.

### Mistake 3: Incorrect Content-Type

res.send(JSON.stringify({ data }));

This may send as text/html.

Instead:

res.json({ data });

Let Express set correct headers.

### Mistake 4: Multiple Sends

Calling two response methods in one handler:

res.json({ ok: true });
res.send('done'); // Error: headers already sent

Once a response is sent, the connection is finished.

Return immediately after sending.

### Mistake 5: Forgetting return After Early Exit

app.get('/api/panels/:id', (req, res) => {
  const panel = getPanel(req.params.id);
  if (!panel) {
    res.status(404).json({ error: 'Not found' });
    // Missing return — execution continues!
  }
  res.status(200).json({ panel }); // Headers already sent
});

Without return, execution falls through. The second send throws. Always return after early error responses.

### Mistake 6: Wrong Status for the Wrong Error

Use 400 Bad Request when the client sent invalid data (malformed JSON, missing required fields, invalid format). Use 404 Not Found when the resource does not exist (valid request, but nothing matches). Use 500 Internal Server Error when the server failed (database down, uncaught exception). Confusing these misleads clients and makes debugging harder. Your ESP32 retrying on 404 is wrong — the resource will never exist. Your dashboard retrying on 500 might succeed if the server recovers. Status codes guide retry logic.

## 10) RESTful Response Patterns

Responses should align with HTTP semantics.

### GET → 200 or 404

app.get('/api/sensors/:id', (req, res) => {
  const sensor = getSensor(req.params.id);

  if (!sensor) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json({ sensor });
});

### POST → 201 Created + Location Header

app.post('/api/sensors', (req, res) => {
  const sensor = createSensor(req.body);

  res.status(201)
     .set('Location', `/api/sensors/${sensor.id}`)
     .json({ sensor });
});

Same pattern when creating a panel config, adding a reading, or registering an energizer. The Location header tells clients where the new resource lives.

### DELETE → 204 No Content

app.delete('/api/sensors/:id', (req, res) => {
  deleteSensor(req.params.id);
  res.status(204).send();
});

Clean. Explicit. Correct.

## 11) Mental Model

When a request arrives:
	1.	Route matches.
	2.	Handler runs.
	3.	You must construct a valid HTTP response.
	4.	Express sends it once.
	5.	The connection closes.

The response is the final word of the server.

Design it intentionally.

Chapter 3.7 introduces middleware — functions that run before (or after) your handlers. Middleware can set headers, validate requests, and handle errors. But the same rule applies: once res.send(), res.json(), or res.redirect() runs, the response is done. Middleware that calls next() does not send; it passes control. Understanding this boundary matters.

## 12) Architectural Implications

As your system grows:
	•	Consistent status codes build predictable APIs.
	•	Proper headers enable caching and performance.
	•	Structured JSON responses create stable contracts.
	•	Clear error signaling reduces debugging time.

Good routing without good responses produces fragile systems.

Correct response discipline makes APIs professional.

### Reflection

Status codes answer "what happened." Headers answer "how to interpret it." Body answers "what you get." All three must align. A 200 with an error object in the body is confusing. A 404 with no body leaves the client guessing. Design responses intentionally — your dashboard, ESP32, and future clients will thank you.

## What's Next

Next: Chapter 3.7 — Middleware: The Execution Pipeline

Where you’ll learn:
	•	How Express processes requests through middleware
	•	How next() controls execution flow
	•	How to build layered pipelines
	•	How errors propagate
	•	How authentication and validation fit into the request lifecycle

You now know how to extract input and send output — correct status codes, proper headers, structured bodies.

Next, you will understand the pipeline that connects them — middleware — where validation, auth, and error handling live before your handlers run.

