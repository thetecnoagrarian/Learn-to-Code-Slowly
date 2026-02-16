## Phase 3 · Chapter 3.19: Observability and Logging

This chapter builds on:
	•	Chapter 3.7: Middleware
	•	Chapter 3.9: Error Handling

You understand middleware.
You understand error handling.

Now you need to understand observability. Chapter 3.18 showed how modular structure separates routes, middleware, and services — logging fits at the boundaries: request entry, response finish, error handling. Chapter 3.9 formalized error middleware; error logs belong there. This chapter formalizes observability: structured logging, request IDs, log levels, and what never to log.

Observability answers a simple question:

When something goes wrong, how do you know what happened?

Without logs, you are blind.

When a request fails in production:
	•	You were not watching.
	•	The client saw an error.
	•	The server moved on.

Logs are memory for your running system.

Observability is the discipline of making that memory useful.

## 1) What Observability Means

Observability means you can infer system behavior from the outside.

It answers:
	•	What requests are being made?
	•	Who is making them?
	•	What responses are being sent?
	•	How long do they take?
	•	What errors are happening?
	•	Where do failures occur?

In Express, nothing is logged automatically.

If you do not log it, it did not happen (as far as you are concerned).

## 2) Logging as Middleware

Logging belongs at the boundary.

Every HTTP request crosses the boundary.

Therefore logging belongs in middleware.

Minimal request logging:

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

This tells you:
	•	Method
	•	Path

But it does not tell you:
	•	Status code
	•	Duration
	•	Outcome

You need more.

## 3) Logging After the Response Finishes

To observe outcomes, log when the response completes.

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    console.log(
      `${req.method} ${req.path} ${res.statusCode} ${duration}ms`
    );
  });

  next();
});

This logs:

GET /api/sensors 200 42ms
POST /api/login 401 5ms
GET /api/fence/voltage 200 12ms
GET /api/panels 200 28ms

Same pattern for sensor, fence, panel, or coop routes. Now you know:
	•	What happened
	•	Whether it succeeded
	•	How long it took

Duration is essential.

Latency is a signal.

## 4) Structured Logging

Plain text logs are human-readable.

Structured logs are machine-readable.

In production, machines read logs more often than humans.

Structured example:

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip
    };

    console.log(JSON.stringify(log));
  });

  next();
});

Now logs look like:

{
  "timestamp": "2025-02-15T12:00:00.000Z",
  "method": "GET",
  "path": "/api/sensors",
  "status": 200,
  "durationMs": 42,
  "ip": "192.168.1.10"
}

Structured logs enable:
	•	Searching
	•	Filtering
	•	Aggregation
	•	Monitoring tools

## 5) Log Levels

Not all logs are equal.

Define severity levels:
	•	error
	•	warn
	•	info
	•	debug

Simple implementation:

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

function log(level, message) {
  const levels = ['error', 'warn', 'info', 'debug'];

  if (levels.indexOf(level) <= levels.indexOf(LOG_LEVEL)) {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}

Usage:

log('info', 'Server started');
log('debug', 'Query executed');
log('error', 'Database connection failed');

In production, you may set:

LOG_LEVEL=warn

This suppresses debug noise.

Logging must be intentional.

Noise hides signal.

## 6) Error Logging with Context

Error logs without context are useless.

Bad:

Database error

Better:

app.use((err, req, res, next) => {
  const log = {
    level: 'error',
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    status: err.status || 500
  };

  console.error(JSON.stringify(log));

  res.status(err.status || 500).json({
    error: err.message
  });
});

Now you know:
	•	What failed
	•	Where it failed
	•	Which request triggered it
	•	What status code was returned

Observability without context is incomplete.

## 7) Logging Authentication Events

Authentication failures matter.

Log them.

app.post('/api/login', (req, res) => {
  const { username } = req.body;

  const user = authenticateUser(req.body);

  if (!user) {
    log('warn', `Failed login attempt for ${username}`);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  log('info', `User logged in: ${username}`);
  res.json({ success: true });
});

This enables:
	•	Security auditing
	•	Brute-force detection
	•	Behavioral insight

Do not log passwords.

Ever.

## 8) What Not to Log

Logging is powerful.

It is also dangerous.

Never log:
	•	Passwords
	•	JWT tokens
	•	API keys
	•	Session IDs
	•	Full credit card numbers
	•	Sensitive personal data

Logs are often stored:
	•	On disk
	•	In log aggregation systems
	•	In backups

Treat logs as potentially exposed.

If a field is sensitive, redact it.

## 9) Logging Libraries

Hand-rolled logging works.

Production systems use libraries.

Common choices:
	•	winston
	•	pino
	•	bunyan

Example (pino):

const pino = require('pino');
const logger = pino();

app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.path });
  next();
});

Benefits:
	•	Structured JSON by default
	•	High performance
	•	Log rotation support
	•	Transports to files or external systems

As systems grow, libraries become necessary.

## 10) Request Correlation

In complex systems, one request may trigger:
	•	Database queries
	•	External API calls
	•	Background jobs

To trace it, assign a request ID.

const { randomUUID } = require('crypto');

app.use((req, res, next) => {
  req.id = randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

Log it everywhere:

logger.info({
  requestId: req.id,
  method: req.method,
  path: req.path
});

Now every log entry can be correlated to one request.

This becomes critical at scale.

## 11) Observing Performance

Duration logging is basic performance monitoring.

You can expand:
	•	Log slow requests (>500ms)
	•	Track average response times
	•	Detect latency spikes

Example:

if (duration > 500) {
  log('warn', `Slow request: ${req.method} ${req.path} ${duration}ms`);
}

Slow logs often reveal:
	•	N+1 database queries
	•	Blocking operations
	•	Network delays
	•	Inefficient code

Same idea for sensor reads, fence voltage queries, or MQTT publishes — slow requests signal bottlenecks. Observability reveals bottlenecks.

## 12) Development vs Production Logging

Development logging:
	•	Pretty
	•	Verbose
	•	Console-based

Production logging:
	•	Structured
	•	Minimal
	•	Persisted to files or external systems

Example:

if (process.env.NODE_ENV === 'development') {
  app.use(require('morgan')('dev'));
} else {
  app.use(require('morgan')('combined'));
}

Production logs must be:
	•	Searchable
	•	Filterable
	•	Durable

Console output alone is insufficient.

## 13) Observability as a Boundary Discipline

Observability belongs at boundaries:
	•	Incoming request boundary
	•	Error boundary
	•	Database boundary
	•	External API boundary

Log when data crosses boundaries: incoming request, response sent, error caught, database call, external API call. Chapter 0.8 and 2.21 formalized boundaries; logging records what crosses them.

Do not log deep internal noise.

Signal > noise.

## 14) Why Observability Matters

Without observability:
	•	Bugs are guesses.
	•	Failures are mysteries.
	•	Performance issues are invisible.
	•	Security incidents go unnoticed.

With observability:
	•	Failures are traceable.
	•	Performance is measurable.
	•	Behavior is understandable.
	•	Systems become debuggable.

Logging is not optional.

It is infrastructure.

## 15) Concept Anchor

You now understand:
	•	Observability makes systems visible.
	•	Logging belongs in middleware.
	•	Log method, path, status, and duration.
	•	Use structured logs in production.
	•	Use log levels intentionally.
	•	Log errors with context.
	•	Never log secrets.
	•	Use request IDs for tracing.
	•	Separate development and production logging strategies.

You can observe sensor, panel, fence, coop, or solar APIs — method, path, status, duration, request ID — so failures are traceable and performance measurable.

## 16) Common Failure Modes for Logging

Logging before response: Logging method and path at request start is fine; logging status at request start is wrong — the response has not finished. Use res.on('finish') to log status and duration.

Logging secrets: Passwords, JWT tokens, API keys in logs. Logs are often persisted, backed up, aggregated. Treat logs as potentially exposed. Redact or never log secrets.

Logging without context: "Database error" — which request? which query? which user? Include request ID, path, method, and relevant identifiers in error logs.

Excessive logging: Logging every internal step, every variable. Noise hides signal. Log at boundaries; use log levels; suppress debug in production.

Unstructured logs in production: Plain text logs are hard to search and aggregate. Use JSON structured logs for production; machines read them.

Forgetting request IDs: Multiple concurrent requests; logs interleaved; impossible to trace one request. Assign req.id at entry; include it in every log.

## 17) Reflection

Observability = inferring system behavior from outside. Logging = memory for the running system. Log at boundaries: request, response, error. Use middleware; log on res.on('finish') for status and duration. Structured logs (JSON) in production — searchable, filterable. Log levels: error, warn, info, debug — suppress noise with LOG_LEVEL. Include context in error logs: request ID, path, method, status. Never log secrets. Request IDs enable tracing. Whether your API serves sensors, panels, fence voltage, or coop readings — without logs you are blind; with logs you can debug.

An Express app without logging is a black box.

An Express app with logging is inspectable.

Inspectable systems are maintainable systems.

## What's Next

Next: Chapter 3.20 — Building a Complete API

Where you'll learn:
	•	Combining routing, middleware, validation, persistence
	•	Authentication, error handling, configuration, observability
	•	One cohesive, production-ready Express API

You now know observability — structured logging, request IDs, log levels, boundary discipline. Chapter 3.20 assembles everything: a complete, production-ready API that applies all Phase 3 concepts.