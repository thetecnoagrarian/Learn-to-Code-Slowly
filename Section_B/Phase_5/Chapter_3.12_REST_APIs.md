## Phase 3 · Chapter 3.12: RESTful API Design in Express

This chapter builds on:
	•	Chapter 3.4: Routing Fundamentals
	•	Chapter 3.6: Sending Responses
	•	Phase 2.23: REST Principles

You understand:
	•	How to define routes
	•	How to send responses
	•	What HTTP methods mean
	•	What status codes signal
	•	What REST principles require

Now you combine them.

Express gives you mechanics.
REST gives you discipline.

This chapter formalizes how to design APIs intentionally.

Phase 2.23 introduced REST principles at the protocol level. This chapter applies them in Express: route structure, method semantics, and status codes. See Phase 2.23 for the conceptual foundation; MDN HTTP and Express in resources for method and status reference.

## 1) REST Is About Constraints, Not Libraries

REST is not something you install.

REST is a set of constraints:
	•	Resources identified by URLs
	•	Methods express intent
	•	Stateless interactions (each request stands alone; no server-side session state between requests)
	•	Representations exchanged
	•	Status codes signal outcomes

Express does not enforce REST.

You enforce REST by how you define routes.

## 2) Resource-Oriented Thinking

REST begins with resource modeling.

A resource is:
	•	A thing
	•	Addressable by URL
	•	Represented over HTTP

Examples:
	•	A sensor
	•	A panel
	•	A reading (coop temp, fence voltage, solar production)
	•	A user
	•	A configuration
	•	A log entry

Not actions.
Not verbs.

Resources are nouns.

## 3) URL Design: Nouns, Not Verbs

Correct:

/api/sensors
/api/sensors/alpha
/api/sensors/alpha/readings
/api/panels
/api/fence/voltage
/api/coop/readings

Incorrect:

/api/getSensors
/api/createSensor
/api/deleteSensor

The method communicates the action.
The URL communicates the resource.

This is foundational.

## 4) Collection vs Individual Resources

Collections:

GET    /api/sensors
POST   /api/sensors
GET    /api/panels
GET    /api/fence/readings

Individual resource:

GET    /api/sensors/:id
PUT    /api/sensors/:id
PATCH  /api/sensors/:id
DELETE /api/sensors/:id

Same pattern for panels, fence voltage logs, or coop readings. Hierarchy is clear.

The path structure communicates relationships.

## 5) Mapping Methods to Intent

GET — Retrieve
	•	Safe (no side effects; clients can cache and retry freely)
	•	Idempotent (same request twice → same result)
	•	No state change

app.get('/api/sensors/:id', (req, res) => {
  const sensor = getSensor(req.params.id);
  if (!sensor) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(200).json(sensor);
});

GET returns a representation.

Nothing else.

POST — Create
	•	Not safe (has side effects)
	•	Not idempotent (two identical POSTs may create two resources)
	•	Creates subordinate resource

app.post('/api/sensors', (req, res) => {
  const sensor = createSensor(req.body);

  res.status(201)
     .set('Location', `/api/sensors/${sensor.id}`)
     .json(sensor);
});

201 is required discipline.

Location header is intentional design.

PUT — Replace
	•	Idempotent
	•	Full replacement

app.put('/api/sensors/:id', (req, res) => {
  const updated = replaceSensor(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json(updated);
});

Two identical PUTs → same result.

PATCH — Partial Update
	•	Not safe
	•	Usually idempotent
	•	Partial modification

app.patch('/api/sensors/:id', (req, res) => {
  const updated = patchSensor(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json(updated);
});

PATCH modifies specific fields.

DELETE — Remove
	•	Idempotent
	•	No body required

app.delete('/api/sensors/:id', (req, res) => {
  const deleted = deleteSensor(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(204).send();
});

204 means success with no representation.

## 6) Status Codes Are Meaning, Not Decoration

Correct status code usage is REST discipline.

200 → Success with body
201 → Created
204 → Success, no content
400 → Malformed request
401 → Authentication required
403 → Forbidden
404 → Resource not found
409 → Conflict
422 → Validation failure
500 → Server error

Never default to 200 for everything.

Status codes are machine-readable signals.

## 7) Validation Errors

Client input invalid:

app.post('/api/sensors', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      error: 'name is required'
    });
  }

  if (typeof req.body.threshold !== 'number') {
    return res.status(422).json({
      error: 'threshold must be numeric'
    });
  }

  const sensor = createSensor(req.body);
  res.status(201).json(sensor);
});

400 = malformed (syntax error, missing required header, invalid JSON)
422 = well-formed but semantically invalid (valid format, wrong value or type)

Chapter 3.13 formalizes validation at the boundary. Use status codes precisely.

## 8) Query Strings for Filtering

Collections may be filtered.

app.get('/api/sensors', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const sensors = getSensors({ limit, status });

  res.status(200).json(sensors);
});

Same pattern for filtering panels by status, fence readings by date, or coop temps by sensor. Query parameters modify representation.

They do not redefine the resource identity.

## 9) Nested Resources

Sub-resources represent relationships.

app.get('/api/sensors/:id/readings', getReadings);
app.post('/api/sensors/:id/readings', createReading);

This models:

Sensor → has many → Readings

Same idea for panel → production logs, fence → voltage history, coop → temperature readings, or ESP32 node → sensor readings. Hierarchical modeling clarifies structure.

## 10) Content Negotiation

Respect the Accept header.

app.get('/api/sensors/:id', (req, res) => {
  const sensor = getSensor(req.params.id);
  if (!sensor) {
    return res.status(404).send();
  }

  if (req.accepts('html')) {
    return res.render('sensor', { sensor });
  }

  if (req.accepts('json')) {
    return res.json(sensor);
  }

  res.status(406).send();
});

406 = Not Acceptable

Representation selection is part of REST.

## 11) Consistent Response Shapes

APIs must be predictable.

Example success shape:

{
  "data": { ... }
}

Example error shape:

{
  "error": "Not found",
  "status": 404
}

Consistency improves client reliability.

## 12) Statelessness Enforcement

Never store per-request identity in memory:

Incorrect:

let currentUser = null;

Correct:
	•	Session cookie
	•	JWT token
	•	Authorization header

State lives in request. The server does not remember prior requests — each request carries everything needed. This enables scaling (any server can handle any request) and simplifies failure recovery. Chapter 3.14 covers authentication and session handling.

Server processes request independently.

## 13) Idempotency and Retries

Design for retry safety.

PUT and DELETE should be idempotent — the client can retry without creating duplicates or causing inconsistent state. Same request twice → same outcome.

POST may require idempotency keys.

Example:

const idempotencyKey = req.headers['idempotency-key'];

Design retry protection intentionally.

## 14) Separation of Concerns

Routes:
	•	Parse input
	•	Validate
	•	Call service logic
	•	Send response

Services:
	•	Business logic
	•	Database interaction

Keep controllers thin.

REST clarity improves maintainability.

## 15) Example Full Resource Module

const router = require('express').Router();

router.get('/', getAllSensors);
router.post('/', createSensor);
router.get('/:id', getSensor);
router.put('/:id', replaceSensor);
router.patch('/:id', patchSensor);
router.delete('/:id', deleteSensor);

module.exports = router;

Mounted as:

app.use('/api/sensors', sensorRouter);

This modularizes resource design.

## 16) Avoiding RPC Style APIs

RPC style:

POST /api/sensor/delete
POST /api/sensor/updateThreshold
POST /api/energizer/arm

REST style:

DELETE /api/sensors/:id
PATCH  /api/sensors/:id

RPC exposes actions.
REST exposes resources.

REST aligns with HTTP semantics.

## 17) Hypermedia (Optional Advanced Concept)

REST originally included HATEOAS:

Responses include links to related resources.

Example:

{
  "id": "alpha",
  "links": {
    "self": "/api/sensors/alpha",
    "readings": "/api/sensors/alpha/readings"
  }
}

Not mandatory in most APIs.

But conceptually pure.

## 18) Caching Awareness

GET responses may include:

Cache-Control
ETag
Last-Modified

Write APIs that respect HTTP caching.

It reduces load.

It improves performance.

## 19) Versioning

Avoid breaking clients silently.

Options:

/api/v1/sensors
/api/v2/sensors

Or via header:

Accept: application/vnd.myapi.v1+json

Versioning is API lifecycle discipline.

## 20) REST Discipline Checklist

For every route ask:
	•	Is the URL a noun?
	•	Does the method express intent?
	•	Is the status code correct?
	•	Is the request stateless?
	•	Is validation enforced?
	•	Is the response shape consistent?

If yes → REST aligned.

## 21) Common Failure Modes

Verbs in URLs: `/api/createSensor`, `/api/getReadings` — the action belongs in the HTTP method, not the path. Use POST /api/sensors, GET /api/readings. The URL names the resource; the method names the action.

Defaulting to 200: Returning 200 for create, delete, or errors makes clients unable to distinguish success from failure. Use 201 for create, 204 for delete, 4xx/5xx for failures. Chapter 3.9 covers error middleware and status mapping.

Inconsistent response shapes: One route returns { data: {...} }, another returns the raw object. Clients must handle both. Pick a shape and use it everywhere — success envelope, error envelope, pagination format.

RPC-style endpoints: POST /api/sensor/delete instead of DELETE /api/sensors/:id. Express allows it, but it breaks REST semantics. Clients expect DELETE to mean removal. Use HTTP methods as intended.

Missing Location on 201: After creating a resource, clients need the URL. Set Location: /api/sensors/123 and return 201. Without it, clients must infer or re-query.

Validation without proper status: Returning 400 for "threshold must be numeric" when the JSON is valid — use 422 for semantic validation. Use 400 only when the request is malformed (bad JSON, missing Content-Type).

Overloaded query params: ?action=delete&id=123 instead of DELETE /api/sensors/123. Query params should filter or paginate, not change the action. The method + path define the action.

## 22) Mental Model

Express:
	•	Handles mechanics

HTTP:
	•	Defines protocol

REST:
	•	Defines discipline

You:
	•	Design correctly

## 23) Concept Anchor

You now have:
	•	Routing mechanics
	•	Middleware pipelines
	•	Body parsing
	•	Error handling
	•	Static assets
	•	Server-side rendering
	•	RESTful API design

You can structure APIs for sensors, panels, fence voltage, coop readings, energizer status, or any homestead resource.

### Reflection

REST is discipline, not a library. URLs name resources (nouns); methods express intent (GET retrieve, POST create, PUT replace, PATCH partial update, DELETE remove). Status codes signal meaning — 200/201/204 for success, 400/401/403/404/409/422 for client errors, 500 for server errors. Stateless: each request carries what it needs. Idempotency: PUT and DELETE can be retried safely. Validate at the boundary; use 400 for malformed, 422 for invalid semantics. Consistent response shapes improve client reliability. Whether your API serves sensors, panels, fence voltage, or coop readings — nouns in URLs, methods for actions, status codes for outcomes.

## What's Next

Next: Chapter 3.13 — Validation at the Boundary

Where you'll learn:
	•	Validation as a structured boundary layer
	•	Preventing malformed input from entering your system

You now have REST discipline: nouns in URLs, methods for actions, status codes for meaning. Chapter 3.13 formalizes validation so malformed sensor readings, panel configs, or fence alerts never enter your system.