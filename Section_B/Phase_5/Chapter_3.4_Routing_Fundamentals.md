Good — this is clean and structurally sound. Now let’s deepen it properly.

You’re at the point in Phase 3 where repetition with increasing specificity matters. Routing isn’t just “how to define a route.” It’s the dispatch layer of the server — the bridge between the HTTP request line and executable code.

I’m going to expand this into a more complete Chapter 3.4 — still clear, but conceptually tighter and more layered. This will reinforce earlier HTTP concepts and prepare you for middleware, routers, and architectural decisions later.

## Phase 3 · Chapter 3.4: Routing Fundamentals

This chapter builds on:
	•	Chapter 3.3: The Request and Response Objects
	•	Chapter 2.7: The Request Line

You now understand that an HTTP request contains:
	•	A method
	•	A path
	•	Headers
	•	(Sometimes) a body

Routing is how Express maps that incoming request to a specific function in your program.

Routing is not magic. It is deterministic pattern matching.

## 1) What Routing Actually Is

A route is a three-part mapping:
	•	HTTP method
	•	URL path pattern
	•	Handler function

Conceptually:

(METHOD, PATH) → HANDLER

When Express receives a request, it:
	1.	Reads the method.
	2.	Reads the path.
	3.	Walks through defined routes in order.
	4.	Executes the first matching handler.

This mirrors what you learned in Phase 2 about the request line:

GET /api/sensors HTTP/1.1

Routing is simply how Express reacts to that line.

## 2) Basic Route Definitions

Routes are defined using methods on the Express app. Each method name corresponds to an HTTP method:

```javascript
app.get('/api/sensors', (req, res) => {
  res.json({ sensors: [] });
});

app.post('/api/sensors', (req, res) => {
  res.status(201).json({ created: true });
});

app.get('/api/sensors/alpha', (req, res) => {
  res.json({ sensor: 'alpha' });
});
```

Each route matches:
- **A specific method:** `app.get()` matches only `GET`, `app.post()` matches only `POST`
- **A specific path pattern:** `/api/sensors` matches only that exact path
- **Runs only when both match:** Method AND path must match

This is strict matching. No guessing, no conversion.

**Your homestead example:**

```javascript
// ESP32 sends: GET /api/sensors
app.get('/api/sensors', (req, res) => {
  const sensors = getAllSensors(); // coop, barn, solar
  res.json({ sensors });
});

// ESP32 sends: POST /api/temp
app.post('/api/temp', (req, res) => {
  const { temp } = req.body;
  saveTemperature(temp);
  res.status(201).json({ saved: true });
});

// Dashboard requests: GET /api/sensors/coop
app.get('/api/sensors/coop', (req, res) => {
  const sensor = getSensor('coop');
  res.json({ sensor });
});
```

Each route is a contract: when this method hits this path, run this handler.

## 3) Method Matching Is Exact

Express does not convert between methods. Method matching is strict.

```javascript
app.get('/api/sensors', handler);
```

This will **not** match:

```
POST /api/sensors
```

Even though the path is identical. Method must match exactly.

**This matters because HTTP methods express intent** (Phase 2.13):

| Method | Intent | Idempotent? |
|--------|--------|-------------|
| GET | Retrieve | Yes |
| POST | Create | No |
| PUT | Replace | Yes |
| DELETE | Remove | Yes |
| PATCH | Partial update | No (usually) |

Routing enforces this contract. Your ESP32 sends `POST /api/temp`—Express will not route it to `app.get('/api/temp', handler)`. Method mismatch means no match, which means 404.

**Your homestead example:**

```javascript
// Correct: POST for creating readings
app.post('/api/readings', (req, res) => {
  const { sensorId, temp } = req.body;
  saveReading(sensorId, temp);
  res.status(201).json({ saved: true });
});

// If ESP32 mistakenly sends GET /api/readings, this route won't match
// Express returns 404 — which is correct (GET shouldn't create)
```

Routing is the enforcement layer. It ensures the right handler runs for the right HTTP verb.

## 4) Path Matching Rules

Express matches paths literally unless told otherwise. No implicit trailing slash handling, no automatic path normalization.

```javascript
app.get('/api/sensors', handler);
```

**Matches:**
- `GET /api/sensors` ✓

**Does not match:**
- `GET /api/sensors/` ✗ (trailing slash)
- `GET /api/sensors/alpha` ✗ (extra segment)
- `GET /api/Sensors` ✗ (case-sensitive on some systems)
- `GET /API/sensors` ✗ (case-sensitive)

Paths are compared segment by segment. Each segment must match exactly.

**Segment comparison:**

| Route | Request Path | Match? |
|-------|--------------|--------|
| `/api/sensors` | `/api/sensors` | Yes |
| `/api/sensors` | `/api/sensors/` | No |
| `/api/sensors` | `/api/sensors/coop` | No |
| `/api/sensors/coop` | `/api/sensors/coop` | Yes |

A path is not a file system—it is a string pattern. Express does not resolve `.` or `..`. It does not treat `/api/sensors` as a "directory" that contains `/api/sensors/coop`.

**Your homestead example:**

```javascript
app.get('/api/sensors', getAllSensors);      // GET /api/sensors
app.get('/api/sensors/coop', getCoopSensor); // GET /api/sensors/coop

// GET /api/sensors/coop matches the second route only
// GET /api/sensors matches the first route only
// They are distinct—no overlap, no hierarchy
```

**Consistency tip:** Pick a convention (with or without trailing slashes) and stick to it. Mixing causes 404s that are hard to debug.

## 5) Route Order Matters (Critical Concept)

Express evaluates routes in the order they are defined. **First match wins.** When a route matches, Express stops looking.

**The trap: parameterized routes shadow specific routes**

Consider:

```javascript
// Wrong order: parameterized route first
app.get('/api/sensors/:id', (req, res) => {
  res.send('Sensor ' + req.params.id);  // Handles ALL /api/sensors/anything
});

app.get('/api/sensors/coop', (req, res) => {
  res.send('Coop sensor');  // Never runs!
});
```

A request for `GET /api/sensors/coop`:
1. Express checks `/api/sensors/:id` — matches! (`:id` captures `'coop'`)
2. Express runs the first handler, stops
3. The second route never runs

The specific route `/api/sensors/coop` is **shadowed** by the parameterized route.

**Correct ordering: specific before general**

```javascript
// Right order: specific routes first
app.get('/api/sensors/coop', getCoopSensor);   // Specific
app.get('/api/sensors/barn', getBarnSensor);   // Specific
app.get('/api/sensors/:id', getSensorById);    // General (catches rest)
app.get('/api/sensors', getAllSensors);        // Collection
```

**Rule: Define more specific routes before more general ones.**

- `/api/sensors/coop` before `/api/sensors/:id`
- `/api/sensors/health` before `/api/sensors/:id`
- `/api/sensors/:id` before `/api/sensors` (if both exist)

This rule becomes more important as your API grows. Wrong order causes mysterious behavior: "Why is my special handler never running?"

**Your homestead example:**

```javascript
// Correct order for homestead API
app.get('/api/sensors/coop/status', getCoopStatus);  // Most specific
app.get('/api/sensors/coop', getCoopSensor);
app.get('/api/sensors/:id', getSensorById);          // Catches coop, barn, solar, etc.
app.get('/api/sensors', getAllSensors);              // Collection
```

### 5.5) The Four-Step Process: How Express Matches Routes

Every request in Express follows the same four-step routing process:

**Step 1: Extract Method and Path from Request**
- Express receives the raw HTTP request
- Express parses the request line: `GET /api/sensors/alpha HTTP/1.1`
- Express extracts `req.method` (e.g., `'GET'`)
- Express extracts `req.path` (e.g., `'/api/sensors/alpha'`)
- Express uses these two values for route matching

**Step 2: Walk Routes in Registration Order**
- Express iterates through registered routes in the order they were defined
- For each route, Express checks: does the method match? does the path pattern match?
- Express does not skip routes—it evaluates each one in sequence
- The order of `app.get()`, `app.post()`, etc. calls matters

**Step 3: Find First Match**
- Express compares `req.method` against the route method (exact match)
- Express compares `req.path` against the route path pattern (literal or pattern match)
- When both match, Express selects that route and stops searching
- If no route matches, Express returns 404

**Step 4: Execute Handler (or Middleware Chain)**
- Express calls the route handler function with `req` and `res`
- If the route has multiple handlers (middleware), Express runs them in order
- Each handler receives `req`, `res`, and `next`
- The handler (or final handler in the chain) sends the response

This process is deterministic. Every request follows these four steps. Understanding this flow makes routing transparent—it's just ordered pattern matching.

Example flow for `GET /api/sensors/alpha`:

1. **Extract:** Express parses request line → `req.method = 'GET'`, `req.path = '/api/sensors/alpha'`
2. **Walk:** Express evaluates routes: `app.get('/api/sensors', ...)` — path doesn't match; `app.get('/api/sensors/alpha', ...)` — path matches
3. **Find:** Express selects `app.get('/api/sensors/alpha', handler)` and stops
4. **Execute:** Express calls handler with `req` and `res` → handler runs → response sent

Understanding these four steps makes routing transparent. It's linear evaluation—method + path → first matching handler.

## 6) Pattern-Based Routes

Express supports path patterns.

### Exact Match

'/api/sensors'

Matches only that path.

### Wildcards

'/api/*'

Matches:

/api/sensors
/api/voltage
/api/anything/here

Wildcards are blunt tools. Use carefully. They can shadow more specific routes if order is wrong.

### Parameters (Preview)

'/api/sensors/:id'

Matches:

/api/sensors/alpha
/api/sensors/beta
/api/sensors/123

The :id segment becomes available via:

req.params.id

We’ll unpack this fully in Chapter 3.5.

## 7) Middleware and Multiple Handlers

A single route can have more than one handler. Each handler receives `req`, `res`, and `next`. The chain runs in order until a handler sends a response or stops calling `next()`.

```javascript
const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();  // Pass control to next handler
};

const requireAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });  // Stops chain
  }
  next();
};

app.get('/api/sensors', logRequest, requireAuth, (req, res) => {
  res.json({ sensors: [] });  // Final handler sends response
});
```

**The flow:**
1. `logRequest` runs → logs → calls `next()`
2. `requireAuth` runs → checks auth → calls `next()` (or returns 401)
3. Final handler runs → sends response

**If `next()` is not called, the chain stops.** A handler that sends a response without calling `next()` ends the request. A handler that neither sends a response nor calls `next()` hangs the request.

**If a handler sends a response and then calls `next()`, Express throws an error.** You cannot send a response twice.

This introduces middleware pipelines—foundational for authentication, validation, and error handling later (Chapters 3.7, 3.13, 3.14).

**Your homestead example:**

```javascript
const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

const parseJson = express.json();  // Body parsing

app.post('/api/temp', logRequest, parseJson, (req, res) => {
  const { temp } = req.body;
  saveTemperature(temp);
  res.status(201).json({ saved: true });
});
```

Middleware runs before the final handler. Order matters: `logRequest` → `parseJson` → route handler.

## 8) RESTful Route Structure

In REST design (Phase 2.23), URLs represent resources. Resources are nouns. Methods express actions.

```javascript
// Collection: list all, create new
app.get('/api/sensors', getAllSensors);
app.post('/api/sensors', createSensor);

// Individual resource: get one, replace, delete
app.get('/api/sensors/:id', getSensor);
app.put('/api/sensors/:id', updateSensor);
app.delete('/api/sensors/:id', deleteSensor);

// Optional: partial update
app.patch('/api/sensors/:id', patchSensor);
```

**Notice:**
- `/api/sensors` — collection (plural noun)
- `/api/sensors/:id` — individual resource (noun + identifier)

**Method semantics:**
- `GET` — retrieve (safe, idempotent)
- `POST` — create (not idempotent)
- `PUT` — replace (idempotent)
- `PATCH` — partial update (idempotent in practice)
- `DELETE` — remove (idempotent)

Routing is how Express enforces this structure. The URL identifies the resource; the method identifies the action.

**Your homestead REST API:**

```javascript
// Sensor collection
app.get('/api/sensors', getAllSensors);           // List coop, barn, solar
app.post('/api/sensors', createSensor);           // Register new sensor

// Individual sensor
app.get('/api/sensors/:id', getSensor);           // GET /api/sensors/coop
app.put('/api/sensors/:id', updateSensor);        // Replace sensor config
app.delete('/api/sensors/:id', deleteSensor);     // Remove sensor

// Nested: readings for a sensor
app.get('/api/sensors/:id/readings', getReadings);     // List readings
app.post('/api/sensors/:id/readings', createReading);  // ESP32 posts temp
```

This mirrors Phase 2.23 REST semantics. Routing makes the structure executable.

## 9) Common Routing Errors

**Error 1: Wrong Order (General Before Specific)**

```javascript
// Wrong: /api/sensors/:id shadows /api/sensors/coop
app.get('/api/sensors/:id', getSensorById);
app.get('/api/sensors/coop', getCoopSensor);  // Never runs!
```

**Fix:** Define specific routes before parameterized routes.

```javascript
// Right
app.get('/api/sensors/coop', getCoopSensor);
app.get('/api/sensors/:id', getSensorById);
```

**Error 2: Using app.use() Incorrectly**

```javascript
app.use('/api/sensors', handler);
```

`app.use()` is **middleware**, not a route:
- Matches **all** HTTP methods (GET, POST, PUT, DELETE, etc.)
- Matches **partial** paths: `/api/sensors`, `/api/sensors/coop`, `/api/sensors/coop/readings` all trigger it
- Does not match method + path like `app.get()` does

Use `app.use()` for middleware (logging, auth, body parsing). Use `app.get()`, `app.post()`, etc. for routes.

**Error 3: Trailing Slash Confusion**

Express treats `/api/sensors` and `/api/sensors/` as **different paths** by default.

```javascript
app.get('/api/sensors', handler);
// GET /api/sensors   → matches
// GET /api/sensors/  → 404
```

**Fix:** Pick one convention and enforce it. Or use `express.static` / middleware to normalize. Consistency matters—mixed usage causes hard-to-debug 404s.

**Error 4: Typo in Path**

```javascript
app.get('/api/sensor', handler);   // Singular
// GET /api/sensors → 404 (typo: forgot 's')
```

Paths are case-sensitive. `/api/Sensors` ≠ `/api/sensors` on some systems.

**Error 5: Forgetting to Send Response**

```javascript
app.get('/api/sensors', (req, res) => {
  const sensors = getSensors();
  // Forgot res.json(sensors)!
  // Request hangs
});
```

Every route handler must send a response or call `next()`. Otherwise the client hangs.

## 10) Mental Model

When a request arrives:

```
GET /api/sensors/alpha HTTP/1.1
```

Express performs:

```
for each route in order:
    if method matches AND path pattern matches:
        run handler (or middleware chain)
        stop
if no route matched:
    return 404
```

Routing is **linear evaluation**. No caching, no smart reordering, no magic. Express walks the list, finds the first match, runs it, stops.

**This simplicity is powerful** — predictable, debuggable, explicit. But it means **order discipline matters**. Wrong order = wrong handler = bugs.

**Debugging routing:**

1. What method was sent? → Check `req.method`
2. What path was sent? → Check `req.path`
3. What routes are registered? → Check your `app.get()`, `app.post()` calls
4. In what order? → First match wins

If a route "doesn't work," walk through these four questions. The answer is usually order or a path mismatch.

## 11) Why Routing Matters Architecturally

Routing is the structural spine of your server. As your homestead API grows:

**You will split routes into files:**
```javascript
// routes/sensors.js
const router = express.Router();
router.get('/', getAllSensors);
router.get('/:id', getSensor);
module.exports = router;

// app.js
app.use('/api/sensors', sensorRoutes);
```

**You will mount routers:** `app.use('/api/sensors', sensorRouter)` — all sensor routes live in one module.

**You will introduce versioning:** `/api/v1/sensors`, `/api/v2/sensors` — routing makes versioning possible.

**You will enforce authentication per route group:** Some routes require auth, some don't. Routing + middleware = per-route behavior.

If you do not understand routing deeply, your architecture becomes brittle. Shadowed routes, wrong order, confused `app.use()` vs `app.get()` — these compound as the system grows.

**Routing is not a beginner topic.** It is the dispatch layer. It determines which code runs for which request. Master it early.

## What Comes Next

Chapter 3.5 will expand this into:
	•	Route parameters (:id)
	•	Query strings (?limit=10)
	•	How Express parses and exposes dynamic data
	•	The difference between req.params, req.query, and req.body

Routing defines which function runs.
Parameters define what data that function receives.

You are now at the point where your server stops being a toy and starts becoming structured.