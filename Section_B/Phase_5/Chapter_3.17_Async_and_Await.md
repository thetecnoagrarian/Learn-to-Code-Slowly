## Phase 3 · Chapter 3.17: Asynchronous Flow in Express

This chapter builds on:
	•	Chapter 3.7: Middleware
	•	Chapter 3.15: State and Persistence

You understand:
	•	Middleware is a pipeline.
	•	Databases are external systems.
	•	Express handles HTTP.
	•	Storage handles data.

Now you must understand time inside Express.

Because the moment you touch a database, filesystem, or external API, your code becomes asynchronous. Chapter 3.15 introduced storage layers — every db.query(), store.getSensor(), or fetch() returns a Promise. Chapter 3.9 covered error handling; async errors must reach next(err). This chapter formalizes async flow: promises, async/await, event loop behavior, and error propagation in Express.

And if you misunderstand async flow, your server will:
	•	Hang
	•	Double-send responses
	•	Swallow errors
	•	Leak promises
	•	Block the event loop
	•	Collapse under load

Asynchronous control flow is not optional.

It is the foundation of production Express systems.

## 1) Why Asynchronous Code Exists

JavaScript in Node.js runs on a single thread.

One instruction executes at a time.

If you block that thread, the server stops responding.

Operations that take time:
	•	Database queries
	•	File reads
	•	HTTP requests
	•	Cryptographic work
	•	Disk access
	•	Sensor reads, MQTT publishes, fence voltage queries

If handled synchronously, they block the event loop.

Blocking means:
	•	No other requests can be processed.
	•	Latency spikes.
	•	Throughput collapses.

Asynchronous operations allow:
	•	Work to begin
	•	Control to return immediately
	•	Result to be handled later

This is how Node scales.

## 2) The Event Loop Model

Conceptually:
	1.	Express receives request.
	2.	Your route handler runs.
	3.	It starts async work.
	4.	It yields control.
	5.	Event loop processes other requests.
	6.	Async result completes.
	7.	Callback / promise resumes execution.

No threads per request.
No blocking waits.
Everything is cooperative.

## 3) Promises

A Promise represents a future value.

It is:
	•	Pending
	•	Fulfilled (resolved)
	•	Rejected (error)

Example:

function getSensor(id) {
  return db.query('SELECT * FROM sensors WHERE id = ?', [id]);
}

Assume db.query() returns a promise.

Using .then():

getSensor(id)
  .then(sensor => {
    // Success
  })
  .catch(err => {
    // Error
  });

This works.

But nested .then() chains become unreadable quickly.

## 4) async / await

async/await is syntax over promises.

It does not make code synchronous.
It makes it readable.

Example:

app.get('/api/sensors/:id', async (req, res, next) => {
  try {
    const sensor = await getSensor(req.params.id);

    if (!sensor) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ sensor });
  } catch (err) {
    next(err);
  }
});

Key rules:
	•	async makes the function return a promise.
	•	await pauses execution until promise settles.
	•	try/catch captures rejection.

Without try/catch, unhandled rejections may crash your process (depending on Node version and config).

## 5) Async and Middleware

Middleware can be async.

Correct pattern:

const loadSensor = async (req, res, next) => {
  try {
    const sensor = await getSensor(req.params.id);

    if (!sensor) {
      return res.status(404).json({ error: 'Not found' });
    }

    req.sensor = sensor;
    next();
  } catch (err) {
    next(err);
  }
};

Attach data to req.
Call next() on success.
Call next(err) on failure.

Never:
	•	Forget next()
	•	Forget to return after sending response
	•	Let promise rejection escape without handling

## 6) Express 4 vs Express 5 Async Behavior

Important distinction:

Express 4:
	•	Does NOT automatically catch async errors.
	•	You must use try/catch and next(err).

Express 5:
	•	Automatically catches rejected promises.

If unsure which version you are using:
	•	Always explicitly handle errors.
	•	Never assume auto-capture.

Explicit > implicit.

## 7) Sequential Async Operations

Sequential example:

const sensor = await getSensor(id);
const readings = await getReadings(id);
const config = await getConfig(id);

Same pattern for fence voltage and panel status — each waits for the previous.

This is slower if operations are independent.

Sequential execution is correct when:
	•	Later operations depend on earlier results.
	•	Order matters.

## 8) Parallel Async Operations

If operations are independent:

const [sensor, readings, config] = await Promise.all([
  getSensor(id),
  getReadings(id),
  getConfig(id)
]);

Same idea for sensor, fence voltage history, and panel status when independent. This runs them concurrently.

Benefits:
	•	Lower latency
	•	Better throughput

But:
	•	If one rejects, Promise.all rejects immediately.
	•	No partial results.

Use carefully.

## 9) Returning After Sending a Response

Common async bug:

if (!sensor) {
  res.status(404).json({ error: 'Not found' });
}

// Code continues executing...

If you do not return, execution continues.

Correct:

if (!sensor) {
  return res.status(404).json({ error: 'Not found' });
}

Always return after sending a response. Chapter 3.9 formalizes this: without return, execution continues and may send a second response.

Double responses cause:
	•	“Cannot set headers after they are sent”
	•	Unpredictable behavior

## 10) Avoiding Event Loop Blocking

Never use synchronous I/O in request handlers.

Bad:

const data = fs.readFileSync('file.txt');

Good:

const data = await fs.promises.readFile('file.txt');

Blocking calls:
	•	Freeze entire server.
	•	Destroy concurrency.
	•	Scale poorly.

If you block, every client waits.

## 11) Asynchronous Errors vs HTTP Errors

Distinguish:
	•	Application error (404)
	•	Server error (500)
	•	Promise rejection
	•	Transport failure

Async error handling pattern:

try {
  const result = await doWork();
} catch (err) {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  next(err);
}

Map domain errors to HTTP status codes.
Let unexpected errors bubble to global error handler.

## 12) Centralized Error Propagation

Async route pattern:

app.get('/route', async (req, res, next) => {
  try {
    const result = await doWork();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

Global error middleware:

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error'
  });
});

Never send raw stack traces in production.

## 13) Unhandled Promise Rejections

If you forget to catch:

app.get('/route', async (req, res) => {
  const data = await getData(); // If rejected?
  res.json(data);
});

If getData() rejects and Express doesn’t auto-handle:
	•	The process may crash.
	•	The request may hang.
	•	The error may disappear silently.

Always handle rejections explicitly.

## 14) Async and Control Flow Clarity

Async code should read linearly.

Good:

const user = await getUser(id);
if (!user) return res.status(404).json(...);

const permissions = await getPermissions(user.id);

Avoid:
	•	Deep nesting
	•	Mixed .then() and await
	•	Forgotten returns
	•	Silent fallthrough

Clarity prevents race conditions.

## 15) Race Conditions

Async introduces timing concerns.

Example:

await updateBalance(userId, -100);
await updateBalance(userId, +100);

If multiple requests execute concurrently:
	•	Order is not guaranteed.
	•	State may become inconsistent.

Concurrency control is a database concern — transactions, locking, isolation levels. Phases 6–9 cover these. Express does not solve race conditions.

Async enables concurrency.
Concurrency introduces consistency challenges.

## 16) Timeout Handling

External services may hang.

Always design with timeouts.

If database call never resolves:
	•	Request hangs.
	•	Connection stays open.
	•	Resource leak occurs.

Consider:
	•	Query timeouts
	•	Abort controllers
	•	Defensive timeouts at infrastructure layer

Async does not mean infinite waiting.

## 17) Mental Model

Express is:
	•	Single-threaded
	•	Event-driven
	•	Non-blocking

Async code must:
	•	Yield control quickly
	•	Avoid blocking operations
	•	Propagate errors correctly
	•	Send exactly one response

The pipeline still exists.
Async does not change middleware order.
It changes when results become available.

## 18) Common Failure Modes for Async

Forgetting try/catch: Unhandled promise rejection — process may crash or request may hang. Express 4 does not auto-catch. Always try/catch and call next(err).

Forgetting return after response: if (!sensor) { res.status(404).json(...); } — execution continues, may send second response, "Cannot set headers after they are sent."

Blocking the event loop: fs.readFileSync, JSON.parse on huge input, CPU-heavy work in handlers — freezes server. Use async APIs, offload heavy work.

Letting promise rejection escape: async (req, res) => { const x = await getData(); } — if getData rejects and no catch, error disappears or process crashes. Always catch.

Mixed .then() and await: Hard to reason about, easy to forget return or catch. Prefer async/await consistently.

Assuming Express 5 behavior: Express 5 auto-catches; Express 4 does not. Always handle explicitly — works in both.

Not awaiting in parallel when independent: await a; await b; when a and b are independent — slower than Promise.all([a, b]). Use Promise.all when order does not matter.

## 19) Concept Anchor

You now understand:
	•	JavaScript is single-threaded.
	•	I/O must be asynchronous.
	•	Promises represent future values.
	•	async/await improves readability.
	•	Errors must be caught and passed to middleware.
	•	Never block the event loop.
	•	Never send two responses.
	•	Sequential vs parallel execution affects latency.
	•	Async introduces concurrency risks.
	•	Error propagation must be explicit.

You can write async routes for sensor, panel, fence, or coop data — database queries, external APIs, file reads — without blocking the server or swallowing errors.

Async flow is not optional knowledge.

It is the difference between:

A hobby server
And a production system.

Chapter 3.18 shows how to modularize Express apps — routers, services, middleware — so async logic stays organized as complexity grows.

### Reflection

JavaScript is single-threaded; I/O blocks. Promises represent future values; async/await makes them readable. async functions return promises; await pauses until settle. Always try/catch and next(err) — Express 4 does not auto-catch. Return after sending response; double responses crash. Avoid sync I/O — use fs.promises, async storage. Sequential: await one, then next. Parallel: Promise.all when independent. Unhandled rejections hang or crash. Whether your routes fetch sensors, fence voltage, or panel data — async is mandatory, error propagation explicit.

## What's Next

Next: Chapter 3.18 — Modularizing an Express Application

Where you'll learn:
	•	Splitting large Express apps into routers, services, middleware modules
	•	Configuration layers for clarity as complexity grows

You now know async flow — promises, async/await, try/catch, next(err), return after response, no blocking. Chapter 3.18 shows how to organize async logic across routers and services as your app grows.