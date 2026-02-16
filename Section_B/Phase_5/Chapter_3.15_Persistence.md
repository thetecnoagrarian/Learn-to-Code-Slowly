## Phase 3 · Chapter 3.15: State and Persistence

This chapter builds on:
	•	Chapter 3.14: Authentication
	•	Chapter 1.13: Persistence and Remembering State

You understand:
	•	Express handles HTTP.
	•	Authentication establishes identity.
	•	Requests are stateless.
	•	State must survive restarts.

Now we formalize the separation between request handling and durable storage.

If Express is the nervous system, the database is memory.

They are not the same layer.

Chapter 3.14 showed how sessions and user data require storage. Chapter 1.13 introduced persistence as remembering state across restarts. This chapter formalizes the separation: Express handles HTTP; a storage layer handles durable data. Phases 6–9 will introduce SQLite, MySQL, and database drivers — for now, understand the architectural split and why in-memory storage fails at scale.

## 1) Stateless Servers, Stateful Applications

HTTP is stateless.

Each request stands alone.

But real applications require memory:
	•	User accounts
	•	Password hashes
	•	Sensor readings, panel configs, fence voltage history
	•	Configuration
	•	Audit logs
	•	Sessions
	•	Permissions
	•	Historical data

If your server restarts and everything disappears, you don’t have an application.

You have a demo.

Persistence is what turns a request handler into a system.

## 2) The Critical Separation

Express is not storage.

Express:
	•	Receives requests
	•	Validates input
	•	Authenticates identity
	•	Calls business logic
	•	Sends responses

Storage:
	•	Stores data durably
	•	Ensures integrity
	•	Retrieves by query
	•	Maintains consistency
	•	Survives restarts

Never blur these layers.

## 3) What Happens Without Persistence

Example: in-memory storage.

let sensors = [];

app.post('/api/sensors', (req, res) => {
  sensors.push(req.body);
  res.status(201).json({ saved: true });
});

Problems:
	•	Restart server → sensors disappear.
	•	Crash → sensors disappear.
	•	Scale to multiple processes → inconsistent memory.
	•	Deploy update → memory wiped.

In-memory is temporary.

Temporary is not persistence.

## 4) What Persistence Means

Persistence means:
	•	Data is written to disk (or remote storage).
	•	Data survives process restarts.
	•	Data survives crashes.
	•	Data can be reconstructed after failure.

Persistence is durability.

Durability is a system property, not a code pattern.

## 5) The Storage Layer Pattern

Never write database logic directly inside route handlers.

Instead:

project/
  server.js
  routes/
    sensors.js
  storage/
    sensors.js
  database.js

Route layer:

app.post('/api/readings', async (req, res) => {
  const { sensorId, value } = req.body;

  await readingsStore.save(sensorId, value);

  res.status(201).json({ saved: true });
});

Same pattern for fence voltage logs, solar production records, or coop temperature readings. Route handles HTTP; storage handles persistence.

Storage layer:

async function save(sensorId, value) {
  // Database insert
}

async function getRecent(sensorId, limit) {
  // Database query
}

Express does HTTP.

Storage does data.

## 6) Why Separation Matters

Without separation:
	•	Hard to test.
	•	Hard to refactor.
	•	Hard to migrate databases.
	•	Hard to scale.
	•	Hard to reason about.

With separation:
	•	HTTP logic is clean.
	•	Business logic is isolated.
	•	Storage logic is replaceable.

Boundaries create stability.

## 7) Asynchronous Nature of Storage

Databases are not instant.

They:
	•	Perform disk IO
	•	Perform network IO
	•	Lock rows
	•	Validate constraints

All of that takes time.

Node.js must not block the event loop. Database I/O is async — use async/await or Promises. Chapter 3.17 covers async flow in Express; the pattern is always: await storage call, catch errors, call next(err).

Correct pattern:

app.get('/api/sensors/:id', async (req, res, next) => {
  try {
    const sensor = await store.getSensor(req.params.id);

    if (!sensor) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ sensor });
  } catch (err) {
    next(err);
  }
});

Always assume storage is asynchronous. Never use synchronous database calls in Express — they block the event loop and starve other requests.

## 8) Conceptual Database Model

You don’t need SQL yet.

But you need mental structure.

Databases provide:
	•	Tables (structured storage)
	•	Rows (individual records)
	•	Columns (fields)
	•	Constraints (rules)
	•	Indexes (fast lookup)
	•	Transactions (atomic changes)

They enforce invariants at the data level.

## 9) Persistence and Invariants

Remember Phase 0.9: Invariants.

Some invariants belong in storage, not in Express.

Examples:
	•	User email must be unique.
	•	Sensor ID must be unique.
	•	Panel ID, fence node ID, or coop sensor ID must be unique.
	•	Reading timestamp must not be null.
	•	Foreign key relationships must exist.

If invariants only live in route code, they can be bypassed.

If invariants live in the database, they are enforced universally.

Storage is part of your boundary enforcement.

## 10) Sessions and Persistence

Session-based authentication requires persistence.

If sessions are stored in memory:
	•	Restart → all users logged out.

If sessions are stored in database:
	•	Restart → sessions survive.

Decide intentionally where identity state lives.

## 11) Application Layers

Think in layers:
	1.	Transport Layer (HTTP / Express)
	2.	Boundary Layer (Validation, Authentication)
	3.	Business Logic Layer
	4.	Storage Layer (Database)

Each layer has a clear responsibility.

No layer should leak responsibilities upward.

## 12) Example Flow With Persistence

Request:

POST /api/readings

Flow:
	1.	Express receives request.
	2.	Body parsing middleware parses JSON.
	3.	Validation middleware checks fields.
	4.	Authentication middleware verifies identity.
	5.	Route handler calls storage layer.
	6.	Storage layer inserts into database.
	7.	Database confirms write.
	8.	Express returns 201 Created.

Each layer performs exactly one responsibility.

That is architecture.

## 13) Scaling Implications

In-memory storage ties you to:
	•	One process
	•	One machine

Persistent storage enables:
	•	Multiple server instances
	•	Horizontal scaling
	•	Shared data access
	•	Backup and recovery

If data is not centralized and durable, scaling breaks.

## 14) Persistence as System Memory

Think in systems terms:
	•	Express = CPU
	•	Database = RAM + Disk
	•	Requests = Interrupts
	•	Responses = Output

Without memory, computation is meaningless.

Persistence gives the system continuity.

## 15) Error Handling and Persistence

Database operations fail:
	•	Connection issues
	•	Constraint violations
	•	Timeouts
	•	Disk failures

Always handle storage errors:

try {
  await store.save(data);
} catch (err) {
  next(err);
}

Never assume persistence succeeds. Connection refused, constraint violation, timeout, disk full — all possible. Catch errors and pass to error middleware (Chapter 3.9). Durable systems assume failure.

## 16) Consistency and Atomicity

Persistence introduces complexity:
	•	Partial writes
	•	Race conditions
	•	Concurrent requests

Later phases will introduce:
	•	Transactions
	•	Locking
	•	Isolation levels

For now, understand:

Multiple requests may attempt to modify the same resource simultaneously.

Persistence must handle that safely.

## 17) Anti-Pattern: Business Logic in Routes

Bad:

app.post('/api/order', async (req, res) => {
  if (req.body.quantity > 100) {
    // reject
  }

  // write directly to DB
});

Better:

app.post('/api/order', async (req, res) => {
  await orderService.create(req.body);
  res.status(201).json({ created: true });
});

Business logic belongs in services.

Routes orchestrate.

## 18) Temporary State vs Persistent State

Not all state must persist.

Temporary state:
	•	In-flight request data
	•	Derived values
	•	Cached computations

Persistent state:
	•	Users
	•	Historical records (sensor readings, fence voltage, solar production)
	•	Configuration
	•	Logs

Same idea for coop temps, panel status, or fence voltage history — persist what must survive restarts. Know the difference.

Persist only what must survive.

## 19) Preparing for Database Phases

Later phases will cover:
	•	SQL fundamentals
	•	SQLite
	•	MySQL
	•	Node database drivers
	•	Transactions
	•	Migrations

For now:

Understand architectural separation.

Understand async storage.

Understand durability as a system property.

## 20) Common Failure Modes for Persistence

Writing database logic inside route handlers: Validation, auth, HTTP logic, and storage all tangled together. Hard to test, hard to change. Extract a storage layer — routes call store.save(), store.getById(); storage handles the database.

Assuming in-memory is sufficient: Sensors, users, sessions in a global array. Restart wipes it. Multiple processes have different memory. Deploy updates lose data. In-memory is for caches and ephemeral state only.

Blocking the event loop: Synchronous database calls block Node.js. One slow query stalls all requests. Always use async storage APIs.

Ignoring storage errors: Unhandled promise rejections, no try/catch around store calls. Errors surface as 500s with no logging. Always catch and pass to next(err).

Mixing layers: Route handler doing SQL, validation in the storage layer. Each layer has one job. Routes: HTTP. Storage: data. Business logic: services.

Storing sessions in memory when scaling: One server holds sessions; load balancer sends user to another server; session missing. Use shared storage (database, Redis) for sessions when running multiple instances.

## 21) Mental Model

Express handles:
	•	Protocol
	•	Parsing
	•	Boundaries
	•	Routing

Database handles:
	•	Memory
	•	Durability
	•	Integrity
	•	Relationships

Keep these distinct.

Blurring them creates fragile systems.

## 22) Concept Anchor

You now understand:
	•	Why persistence is essential
	•	Why in-memory is insufficient
	•	How to structure storage layers
	•	Why async patterns matter
	•	Why durability is architectural

You can design storage layers for sensor data, panel configs, fence voltage logs, coop readings, or any homestead resource that must survive restarts.

Chapter 3.16 introduces environment and configuration — database connection strings, secrets, and deployment settings belong outside code. The same boundary discipline applies: config at the edge, storage behind it.

### Reflection

Persistence is durability. Express handles HTTP; storage handles data. In-memory is temporary — restart wipes it, scale breaks it. Extract a storage layer: routes call store methods, storage talks to the database. Async: storage is I/O, always await, catch and next(err). Layers: transport, boundary, business logic, storage — each with one job. Invariants belong in the database when they must be universal. Sessions need persistence when scaling. Whether your system stores sensor readings, fence voltage, panel configs, or coop temps — durable state lives in storage, not in Express memory.

## What's Next

Next: Chapter 3.16 — Environment and Configuration

Where you'll learn:
	•	Isolating configuration from code
	•	Environment variables, secrets management
	•	Deployment-safe configuration patterns