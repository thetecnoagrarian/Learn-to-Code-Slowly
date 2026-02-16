# Section B Phase 5 Code Examples — Chapters 3.5–3.8

This file collects runnable code examples from Section B Phase 5 Chapters 3.5 (Params and Query), 3.6 (Sending Responses), 3.7 (Middleware), and 3.8 (Body Parsing). Use them as reference or as a starting point for `Section_B/Phase_5/examples/` scripts.

---

## Chapter 3.5: Route Parameters and Query Strings

### Single route parameter (`:id`)

```javascript
app.get('/api/sensors/:id', (req, res) => {
  const sensorId = req.params.id;
  res.json({ sensor: getSensor(sensorId) });
});

// GET /api/sensors/alpha → req.params = { id: 'alpha' }
```

### Multiple route parameters

```javascript
app.get('/api/buildings/:building/sensors/:sensor', (req, res) => {
  const building = req.params.building;
  const sensor = req.params.sensor;
  res.json({ building, sensor });
});

// GET /api/buildings/coop/sensors/alpha → req.params = { building: 'coop', sensor: 'alpha' }
```

### Named parameter for clarity

```javascript
app.get('/api/sensors/:sensorId', handler);
// req.params.sensorId
```

### Query strings — Express parses automatically

```javascript
app.get('/api/sensors', (req, res) => {
  const limit = req.query.limit;
  const unit = req.query.unit;
  res.json({ sensors: getSensors(limit, unit) });
});

// GET /api/sensors?limit=10&unit=F → req.query = { limit: '10', unit: 'F' }
```

### Query values are always strings — convert and validate

```javascript
const limit = parseInt(req.query.limit, 10);
const enabled = req.query.enabled === 'true';
```

### Defaults for optional query params

```javascript
const limit = parseInt(req.query.limit, 10) || 10;
const unit = req.query.unit || 'F';
```

### Validate and reject invalid query values

```javascript
const limit = parseInt(req.query.limit, 10);
if (isNaN(limit) || limit < 1 || limit > 100) {
  return res.status(400).json({ error: 'limit must be 1–100' });
}
```

### Params + query together (resource identity + retrieval modifiers)

```javascript
app.get('/api/sensors/:id/readings', (req, res) => {
  const sensorId = req.params.id;
  const limit = parseInt(req.query.limit, 10);
  const from = req.query.from;

  res.json({
    sensor: sensorId,
    readings: getReadings(sensorId, limit, from)
  });
});

// GET /api/sensors/alpha/readings?limit=10&from=1700
```

### Validation for params (existence, format, lookup)

```javascript
app.get('/api/sensors/:id', (req, res) => {
  const id = req.params.id;

  if (!id || id.length === 0) {
    return res.status(400).json({ error: 'Invalid sensor ID' });
  }

  const sensor = getSensor(id);
  if (!sensor) {
    return res.status(404).json({ error: 'Sensor not found' });
  }

  res.json({ sensor });
});
```

---

## Chapter 3.6: Sending Responses Correctly

### Setting status codes

```javascript
res.status(200).send('OK');
res.status(201).json({ id: 123 });
res.status(404).send('Not Found');
res.status(500).send('Server Error');
```

### JSON response with 404 for missing resource

```javascript
app.get('/api/sensors/alpha', (req, res) => {
  const sensor = getSensor('alpha');

  if (!sensor) {
    return res.status(404).json({ error: 'Sensor not found' });
  }

  res.status(200).json({ sensor });
});
```

### Plain text response (single value)

```javascript
app.get('/api/voltage', (req, res) => {
  const voltage = readVoltage();
  res.status(200).send(`${voltage}`);
});
```

### Explicit text/plain

```javascript
res.type('text/plain').send('Hello');
```

### 204 No Content (no body)

```javascript
app.delete('/api/sensors/:id', (req, res) => {
  deleteSensor(req.params.id);
  res.status(204).send();
});
```

### Redirects

```javascript
app.get('/api/v1/sensors', (req, res) => {
  res.redirect(301, '/api/v2/sensors');
});

// Default is 302. Use 301 permanent, 302 temporary, 307/308 method-preserving.
```

### Setting headers (single and multiple)

```javascript
res.set('Cache-Control', 'max-age=60');
res.set('ETag', '"v123"');

res.set({
  'Cache-Control': 'max-age=60',
  'ETag': '"v123"'
});
```

### Method chaining (status + headers + body)

```javascript
res.status(200)
   .set('Cache-Control', 'max-age=60')
   .json({ voltage: 12.1 });
```

### RESTful GET — 200 or 404

```javascript
app.get('/api/sensors/:id', (req, res) => {
  const sensor = getSensor(req.params.id);

  if (!sensor) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json({ sensor });
});
```

### RESTful POST — 201 Created + Location header

```javascript
app.post('/api/sensors', (req, res) => {
  const sensor = createSensor(req.body);

  res.status(201)
     .set('Location', `/api/sensors/${sensor.id}`)
     .json({ sensor });
});
```

### RESTful DELETE — 204 No Content

```javascript
app.delete('/api/sensors/:id', (req, res) => {
  deleteSensor(req.params.id);
  res.status(204).send();
});
```

### Common mistake — forgetting return after early exit

```javascript
// Wrong: falls through and sends twice
app.get('/api/panels/:id', (req, res) => {
  const panel = getPanel(req.params.id);
  if (!panel) {
    res.status(404).json({ error: 'Not found' });
    // Missing return!
  }
  res.status(200).json({ panel }); // Headers already sent
});

// Right: return after error response
if (!panel) {
  return res.status(404).json({ error: 'Not found' });
}
```

---

## Chapter 3.7: Middleware

### Middleware signature (req, res, next)

```javascript
function middleware(req, res, next) {
  // Do something
  next();
}
```

### Execution order is deterministic (A → B → route)

```javascript
app.use((req, res, next) => {
  console.log('A');
  next();
});

app.use((req, res, next) => {
  console.log('B');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello');
});
// Request flow: A → B → Route Handler
```

### Middleware can attach data to req

```javascript
app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

app.get('/', (req, res) => {
  res.json({ time: req.requestTime });
});
```

### Middleware can set response headers

```javascript
app.use((req, res, next) => {
  res.set('X-Powered-By', 'Homestead Pi');
  next();
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
```

### Middleware can terminate early (auth gate)

```javascript
app.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

### Path-scoped middleware (only for /api)

```javascript
app.use('/api', (req, res, next) => {
  console.log('API request');
  next();
});
// Runs only when req.path starts with /api
```

### Error-handling middleware (four parameters)

```javascript
function errorMiddleware(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
}
// Must have exactly 4 parameters so Express recognizes it as error middleware
```

### Calling next(err) to jump to error middleware

```javascript
app.use((req, res, next) => {
  try {
    riskyOperation();
    next();
  } catch (err) {
    next(err);
  }
});
```

### Real-world pipeline (logger → json → auth → validate → route)

```javascript
app.use(requestLogger);
app.use(express.json());
app.use('/api', authenticateToken);
app.use('/api', validateSensorPayload);

app.post('/api/readings', createReading);
// Execution: 1) Log 2) Parse JSON 3) Auth 4) Validate 5) Route
```

### Mistake — mutating global state (race conditions)

```javascript
// Wrong: shared across all requests
let currentUser;
app.use((req, res, next) => {
  currentUser = req.headers.authorization;
});

// Right: attach to req (per-request)
app.use((req, res, next) => {
  req.user = getUserFromToken(req.headers.authorization);
  next();
});
```

---

## Chapter 3.8: Body Parsing

### Enable JSON parsing — req.body available for application/json

```javascript
app.use(express.json());

app.post('/api/temp', (req, res) => {
  const temp = req.body.temp;
  res.json({ received: temp });
});
// Content-Type: application/json → req.body = { temp: 72.5 }
// Other Content-Type → middleware does nothing, req.body undefined
```

### Handle malformed JSON (parse error → 400)

```javascript
app.use(express.json());

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next(err);
});
```

### URL-encoded form parsing

```javascript
app.use(express.urlencoded({ extended: true }));

// POST body: threshold=75&unit=F
// req.body = { threshold: '75', unit: 'F' }
// Values are strings — convert and validate
```

### Parsing order — parser before routes

```javascript
// Correct
app.use(express.json());
app.post('/api/temp', handler);
app.post('/api/readings', handler);

// Wrong: route runs first, req.body undefined
app.post('/api/temp', handler);
app.use(express.json());
```

### Size limit (protect against large payloads)

```javascript
app.use(express.json({ limit: '1mb' }));
// Body exceeds limit → error → 413 Payload Too Large
```

### Require Content-Type when format matters (415)

```javascript
function requireJson(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(415).json({
      error: 'Content-Type must be application/json'
    });
  }
  next();
}

app.use(requireJson);
app.use(express.json());
app.post('/api/temp', handler);
```

### Parsing vs validation — parse first, then validate

```javascript
app.post('/api/temp', (req, res) => {
  const { temp } = req.body;

  if (typeof temp !== 'number') {
    return res.status(400).json({ error: 'temp must be a number' });
  }

  if (temp < -40 || temp > 150) {
    return res.status(400).json({ error: 'temp out of range' });
  }

  res.status(201).json({ saved: temp });
});
```

### Multiple parsers (JSON and urlencoded)

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Matching Content-Type determines which populates req.body
// If neither matches, req.body remains undefined
```

---

## Quick reference

| Chapter | Concepts |
|--------|----------|
| 3.5 | `req.params` (path segments, `:id`), `req.query` (always strings); params = identity, query = modifiers; validate both; defaults and rejection for query |
| 3.6 | `res.status()`, `res.json()`, `res.send()`, `res.redirect()`, `res.set()`; 200/201/204/400/404/500; chaining; return after early exit; RESTful GET/POST/DELETE patterns |
| 3.7 | Middleware = `(req, res, next)`; call `next()` or send response; order is deterministic; path-scoped `app.use('/api', ...)`; error middleware `(err, req, res, next)`; attach state to `req`, not globals |
| 3.8 | `express.json()`, `express.urlencoded({ extended: true })`; Content-Type drives parsing; size limit; parse then validate; handle `entity.parse.failed` with 400; require Content-Type when needed (415) |
