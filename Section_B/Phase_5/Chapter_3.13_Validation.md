## Phase 3 · Chapter 3.13: Validation at the Boundary

This chapter builds on:
	•	Chapter 3.8: Body Parsing
	•	Phase 0.8: Boundaries
	•	Phase 2.21: Trust Boundaries and Security Surfaces

You already know:
	•	HTTP is a boundary.
	•	req contains untrusted input.
	•	Express parses bodies but does not validate them.
	•	REST requires discipline.
	•	All input can be forged.

Now we formalize something critical:

Validation is the act of defending the boundary.

If you fail here, everything downstream is contaminated.

This chapter expands validation into a structured, repeatable design practice.

Phase 0.8 introduced boundaries as where systems touch the outside world. Phase 2.21 formalized trust boundaries and security surfaces. Chapter 3.8 showed how express.json() parses bodies — but parsing is not validation. Express turns bytes into JavaScript objects; it does not check presence, type, range, or semantics. You must.

## 1) The Boundary Principle

Every Express route is a boundary.

Everything inside req came from outside your system:
	•	req.params
	•	req.query
	•	req.headers
	•	req.body
	•	req.cookies
	•	Even req.ip

None of it is trusted.

Validation must happen:
	•	Before business logic
	•	Before database writes
	•	Before side effects
	•	Before state mutation

If invalid data enters your system, the system becomes unstable.

## 2) The Five Dimensions of Validation

Validation is not just “does it exist.”

Validation checks:
	1.	Presence – Is the field there?
	2.	Type – Is it the correct type?
	3.	Range – Is it within valid limits?
	4.	Format – Does it match expected structure?
	5.	Semantics – Does it make sense in context?

You must think through all five.

## 3) Presence Validation

Missing required fields are malformed requests.

app.post('/api/sensors', (req, res) => {
  const { name, type } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'name is required'
    });
  }

  if (!type) {
    return res.status(400).json({
      error: 'type is required'
    });
  }

  const sensor = createSensor({ name, type });
  res.status(201).json(sensor);
});

Presence failure → 400 Bad Request.

Clear. Deterministic. Early rejection.

## 4) Type Validation

JavaScript is dynamic. HTTP transmits strings.

express.json() converts raw bytes to a JavaScript object. It does not validate that temp is a number — it only parses JSON. A client can send { "temp": "hot" } or { "temp": null } and express.json() will happily populate req.body. You must verify types.

app.post('/api/temp', (req, res) => {
  const { temp } = req.body;

  if (typeof temp !== 'number') {
    return res.status(400).json({
      error: 'temp must be numeric'
    });
  }

  saveTemperature(temp);
  res.status(201).json({ saved: true });
});

Same pattern for fence voltage, solar production, or coop humidity — verify type before storing.

Never assume correct types.

Assumptions are attack surfaces.

## 5) Range Validation

Numeric values require boundaries.

if (temp < -40 || temp > 150) {
  return res.status(400).json({
    error: 'temp must be between -40 and 150'
  });
}

Range checks prevent:
	•	Sensor malfunction from corrupting data
	•	Malicious extreme values
	•	Overflow or business logic bugs

Same idea for fence voltage (0–15 kV), solar watts (0–max panel output), or coop temp (-40–60°C). Range is part of semantic correctness.

## 6) Format Validation

Format matters for:
	•	IDs
	•	Email addresses
	•	Slugs
	•	Tokens
	•	Dates

const idRegex = /^[a-z0-9_-]+$/i;

if (!idRegex.test(req.params.id)) {
  return res.status(400).json({
    error: 'invalid sensor id format'
  });
}

Same pattern for panel IDs, fence node IDs, or coop sensor identifiers. Format validation reduces ambiguity.

It also blocks injection vectors.

## 7) Semantic Validation

Some data is structurally valid but semantically invalid.

Example:

if (req.body.startDate > req.body.endDate) {
  return res.status(422).json({
    error: 'startDate must be before endDate'
  });
}

Same idea for panel config (min watts less than max watts), fence alert (threshold below max voltage), or reading range queries. Semantic errors often justify 422 Unprocessable Entity.

The structure is correct. The meaning is not.

## 8) Validating Route Parameters

Route parameters are part of the boundary.

app.get('/api/sensors/:id', (req, res) => {
  const id = req.params.id;

  if (!/^[a-z0-9_-]+$/i.test(id)) {
    return res.status(400).json({
      error: 'invalid id format'
    });
  }

  const sensor = getSensor(id);

  if (!sensor) {
    return res.status(404).json({
      error: 'sensor not found'
    });
  }

  res.json(sensor);
});

404 ≠ invalid format. 400 = malformed (bad format, wrong type, missing required field). 404 = well-formed but not found. The client sent a valid ID; your system simply has no resource for it. Mixing them confuses clients and breaks retry logic. Chapter 3.12 covers status code discipline; use precisely.

## 9) Validating Query Strings

Query parameters are frequently overlooked.

app.get('/api/sensors', (req, res) => {
  const { limit } = req.query;

  if (limit !== undefined) {
    const limitNum = Number(limit);

    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        error: 'limit must be integer between 1 and 100'
      });
    }
  }

  res.json(getSensors({ limit: Number(limit) || 10 }));
});

Query parameters must be parsed and validated. ?limit=10 arrives as the string "10", not the number 10. Use Number(), parseInt(), or a validation library — and check for NaN, non-integers, and out-of-range values. They are always strings initially.

## 10) Validating Headers

Headers are input too.

const contentType = req.headers['content-type'];

if (req.method === 'POST' && !contentType?.includes('application/json')) {
  return res.status(415).json({
    error: 'Content-Type must be application/json'
  });
}

415 Unsupported Media Type is appropriate when the client sends a body in a format you cannot parse. Requiring Content-Type: application/json for POST bodies prevents express.json() from misinterpreting form data or XML. Headers are not trustworthy — they can be forged. Validate what you depend on.

## 11) Centralizing Validation with Middleware

Validation belongs in middleware.

const validateSensor = (req, res, next) => {
  const { name, threshold } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({
      error: 'name required (string)'
    });
  }

  if (typeof threshold !== 'number') {
    return res.status(400).json({
      error: 'threshold must be numeric'
    });
  }

  next();
};

app.post('/api/sensors', validateSensor, (req, res) => {
  const sensor = createSensor(req.body);
  res.status(201).json(sensor);
});

Middleware separates:
	•	Boundary defense
	•	Business logic

This improves clarity and maintainability.

## 12) Fail Fast

Validation must occur before side effects.

Bad:

saveSensor(req.body);
if (!req.body.name) { ... }

Good:

if (!req.body.name) { ... }
saveSensor(req.body);

Never mutate state before validating input.

## 13) Reject Extra Fields

Attackers may send unexpected fields.

Example:

const allowedFields = ['name', 'type', 'location'];

const receivedFields = Object.keys(req.body);

for (const field of receivedFields) {
  if (!allowedFields.includes(field)) {
    return res.status(400).json({
      error: `unexpected field: ${field}`
    });
  }
}

Whitelisting fields reduces attack surface.

## 14) Size Validation

Protect against large payloads.

You already set body limits:

app.use(express.json({ limit: '1mb' }));

Also validate arrays:

if (req.body.readings.length > 1000) {
  return res.status(400).json({
    error: 'too many readings'
  });
}

Same pattern for fence voltage batches, solar production logs, or ESP32 bulk uploads. Unbounded input is a risk.

## 15) Consistent Error Structure

Standardize validation error format:

res.status(400).json({
  error: 'Validation failed',
  details: [
    { field: 'temp', message: 'must be numeric' }
  ]
});

Consistency helps clients.

Predictability reduces integration bugs.

## 16) Validation vs Sanitization

Validation = reject bad input. It says no and returns 400 or 422.

Sanitization = modify input to make safe (e.g., trim whitespace, escape HTML). It tries to make input acceptable.

Example:

req.body.name = req.body.name.trim();

Prefer validation first. Sanitize cautiously. Trimming spaces is often safe; "fixing" malicious HTML or SQL is not. Never silently "fix" malicious input — reject it.


## 17) Validation Libraries

Manual validation works.

But production systems often use:
	•	Joi
	•	Zod
	•	Yup
	•	express-validator

Example (conceptually):

const schema = z.object({
  name: z.string(),
  threshold: z.number().min(0).max(100)
});

Libraries provide:
	•	Declarative schemas
	•	Centralized rules
	•	Reusable validation logic

But conceptually, they enforce the same boundary discipline.

## 18) Trust Nothing Principle

Everything from the client:
	•	Can be missing
	•	Can be malformed
	•	Can be malicious
	•	Can be inconsistent
	•	Can be replayed
	•	Can be forged

Validation is not paranoia.

It is architecture.

## 19) Boundary Invariant

A properly validated system has this invariant:

No unvalidated external input enters internal logic.

This is a structural guarantee.

Break this invariant → instability.

## 20) Validation Checklist

For every route ask:
	•	Are required fields present?
	•	Are types correct?
	•	Are ranges enforced?
	•	Are formats validated?
	•	Are semantics checked?
	•	Are unexpected fields rejected?
	•	Are size limits enforced?
	•	Are appropriate status codes returned?

If not, the boundary is weak.

## 21) Common Failure Modes

Validating after side effects: Writing to the database, sending email, or mutating state before validating input. If validation fails, you have already contaminated the system. Validate first. Always.

Assuming req.body exists: If express.json() has not run (wrong Content-Type, body not parsed), req.body may be undefined. Accessing req.body.name throws. Guard with req.body && req.body.name or ensure body parsing runs before validation middleware.

Forgetting optional fields: limit in query strings is optional. If present, validate it. If absent, use a default. Do not assume undefined means valid — it means "not provided."

Trusting truthiness for presence: if (!name) rejects null and undefined, but also empty string and 0. For numeric fields, 0 may be valid. Use explicit checks: name === undefined || name === null or typeof name !== 'string' for strings.

Returning 400 for semantic errors: "startDate must be before endDate" is 422 — the structure is correct, the meaning is not. Use 400 for malformed (bad JSON, wrong type, missing required field). Chapter 3.12 formalizes 400 vs 422.

Rejecting without consistent error shape: One route returns { error: "..." }, another returns { message: "..." }. Clients must handle both. Pick a shape and use it everywhere — error string, details array, or field-level messages.

Validating only req.body: req.params and req.query are just as untrusted. IDs in the path, limit and offset in the query — validate all of them.

## 22) Mental Model

Boundary → Validate → Transform → Process → Respond

Validation is the gatekeeper.

Without it:
	•	REST is meaningless
	•	Security collapses
	•	Data integrity fails

With it:
	•	Systems remain predictable
	•	Errors are explicit
	•	Failures are contained

## 23) Concept Anchor

You now have:
	•	Structured routing
	•	Middleware pipelines
	•	Body parsing
	•	Error handling
	•	REST discipline
	•	Boundary validation

You can defend the boundary for sensor data, panel configs, fence readings, coop temps, or any homestead API input.

Chapter 3.14 introduces authentication — identity enters the system, and validation extends to tokens, sessions, and authorization. The same boundary discipline applies: trust nothing, validate everything.

### Reflection

Validation defends the boundary. req.params, req.query, req.body, req.headers, req.cookies — all untrusted. Five dimensions: presence, type, range, format, semantics. Validate before business logic, before writes, before side effects. Use 400 for malformed, 422 for semantically invalid. Fail fast. Reject extra fields. Enforce size limits. Centralize in middleware. Validation ≠ sanitization — prefer reject over "fix." Whether your API accepts sensor readings, fence voltage, panel configs, or coop temps — no unvalidated external input enters internal logic.

## What's Next

Next: Chapter 3.14 — Authentication Basics

Where you'll learn:
	•	Identity entering the system
	•	Trust boundaries and authentication flows