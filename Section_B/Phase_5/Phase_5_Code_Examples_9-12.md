# Section B Phase 5 Code Examples — Chapters 3.9–3.12

This file collects runnable code examples from Section B Phase 5 Chapters 3.9 (Error Handling), 3.10 (Static Files), 3.11 (Templating), and 3.12 (REST APIs). Use them as reference or as a starting point for `Section_B/Phase_5/examples/` scripts.

---

## Chapter 3.9: Error Handling in Express

### Synchronous error — Express catches and forwards

```javascript
app.get('/api/sensors/:id', (req, res) => {
  const sensor = getSensor(req.params.id);

  if (!sensor) {
    throw new Error('Sensor not found');
  }

  res.json({ sensor });
});
```

### Async errors — capture and pass to next(err)

```javascript
app.get('/api/sensors/:id', async (req, res, next) => {
  try {
    const sensor = await getSensor(req.params.id);
    res.json({ sensor });
  } catch (err) {
    next(err);
  }
});
```

### Custom error middleware (minimal)

```javascript
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: message,
    status: status
  });
});
// Place after all routes. Error middleware must have 4 parameters.
```

### Map error meaning to status — pass err with status, then central handler

```javascript
app.get('/api/sensors/:id', (req, res, next) => {
  const sensor = getSensor(req.params.id);

  if (!sensor) {
    const err = new Error('Sensor not found');
    err.status = 404;
    return next(err);
  }

  res.json({ sensor });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});
```

### Validation errors → 400, pass to next(err)

```javascript
app.post('/api/temp', (req, res, next) => {
  const { temp } = req.body;

  if (typeof temp !== 'number') {
    const err = new Error('temp must be a number');
    err.status = 400;
    return next(err);
  }

  if (temp < -40 || temp > 150) {
    const err = new Error('temp out of range');
    err.status = 400;
    return next(err);
  }

  res.status(201).json({ saved: temp });
});
```

### 404 for unmatched routes (before error middleware)

```javascript
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});
```

### Error middleware with logging (timestamp, method, path, stack)

```javascript
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.error(err.stack);

  if (res.headersSent) return next(err);

  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});
```

### Structured error class (HttpError)

```javascript
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Usage
if (!sensor) {
  return next(new HttpError(404, 'Sensor not found'));
}
```

### Global unhandled rejection (safety net; prefer route-level handling)

```javascript
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
```

---

## Chapter 3.10: Static Files and Assets

### Basic static serving (root = public/)

```javascript
app.use(express.static('public'));
// GET /styles.css → public/styles.css
// GET /images/logo.png → public/images/logo.png
// GET / → public/index.html (if exists)
```

### Mount static at a prefix

```javascript
app.use('/static', express.static('public'));
// GET /static/styles.css → public/styles.css
```

### Multiple static directories (order matters, first match wins)

```javascript
app.use(express.static('public'));
app.use(express.static('assets'));
```

### Static with caching (maxAge, etag)

```javascript
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));
// Sets Cache-Control: public, max-age=86400 and ETag
```

### Middleware order — static vs routes

```javascript
// If route first: GET / hits handler, static never runs for /
app.get('/', handler);
app.use(express.static('public'));

// If static first: GET / serves index.html if present, route skipped
app.use(express.static('public'));
app.get('/', handler);
```

### 404 after static (static calls next() when file not found)

```javascript
app.use(express.static('public'));
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});
```

### Static + API together

```javascript
app.use(express.static('public'));
app.use('/api', apiRouter);
// Browser: /index.html, /styles.css, /app.js
// JS fetches: /api/sensors, /api/voltage, etc.
```

### Typical project layout

```
project/
  server.js
  public/
    index.html
    styles.css
    app.js
    images/
      logo.png
```

---

## Chapter 3.11: Templating and Server-Side Rendering

### Configure view engine (EJS) and views directory

```javascript
app.set('view engine', 'ejs');
app.set('views', './views');
```

### Render a template with data

```javascript
app.get('/dashboard', (req, res) => {
  const sensors = getAllSensors();
  res.render('dashboard', { sensors });
});
// Finds views/dashboard.ejs, passes { sensors }, sends HTML (200, text/html)
```

### EJS template (views/dashboard.ejs) — loops and escaped output

```html
<!DOCTYPE html>
<html>
<head>
  <title>Sensor Dashboard</title>
</head>
<body>
  <h1>Sensors</h1>
  <ul>
    <% sensors.forEach(sensor => { %>
      <li>
        <%= sensor.name %>: <%= sensor.value %>
      </li>
    <% }) %>
  </ul>
</body>
</html>
```

### EJS syntax summary

- `<% %>` — execute JavaScript (no output)
- `<%= %>` — output escaped value (safe; use for user data)
- `<%- %>` — output raw (unescaped; avoid for user data — XSS risk)

### Loops in template

```html
<ul>
  <% sensors.forEach(sensor => { %>
    <li><%= sensor.name %></li>
  <% }) %>
</ul>
```

### Conditionals in template

```html
<% if (sensor.online) { %>
  <span class="online">Online</span>
<% } else { %>
  <span class="offline">Offline</span>
<% } %>
```

### Partials (EJS include)

```html
<%- include('header') %>
<main>
  Content here
</main>
<%- include('footer') %>
```

### Security — never raw user input

```html
<!-- Dangerous: runs script in browser -->
<%- userInput %>

<!-- Safe: escaped -->
<%= userInput %>
```

### Prepare data in route; keep logic out of templates

```javascript
// Better: format in route
const sensors = getSensors().map(formatSensor);
res.render('dashboard', { sensors });
```

### SSR + static assets together

```javascript
app.use(express.static('public'));
app.set('view engine', 'ejs');

// /dashboard → rendered HTML; /styles.css, /app.js → static files
```

---

## Chapter 3.12: RESTful API Design in Express

### URL design — nouns, not verbs

```javascript
// Correct
// GET/POST /api/sensors, GET/PUT/PATCH/DELETE /api/sensors/:id
// GET/POST /api/sensors/:id/readings

// Incorrect: verbs in URL
// POST /api/createSensor, GET /api/getSensors
```

### GET — retrieve (200 or 404)

```javascript
app.get('/api/sensors/:id', (req, res) => {
  const sensor = getSensor(req.params.id);
  if (!sensor) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(200).json(sensor);
});
```

### POST — create (201 + Location)

```javascript
app.post('/api/sensors', (req, res) => {
  const sensor = createSensor(req.body);

  res.status(201)
     .set('Location', `/api/sensors/${sensor.id}`)
     .json(sensor);
});
```

### PUT — replace (200 or 404)

```javascript
app.put('/api/sensors/:id', (req, res) => {
  const updated = replaceSensor(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json(updated);
});
```

### PATCH — partial update (200 or 404)

```javascript
app.patch('/api/sensors/:id', (req, res) => {
  const updated = patchSensor(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json(updated);
});
```

### DELETE — remove (204 or 404)

```javascript
app.delete('/api/sensors/:id', (req, res) => {
  const deleted = deleteSensor(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(204).send();
});
```

### Validation — 400 vs 422

```javascript
app.post('/api/sensors', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'name is required' });
  }

  if (typeof req.body.threshold !== 'number') {
    return res.status(422).json({ error: 'threshold must be numeric' });
  }

  const sensor = createSensor(req.body);
  res.status(201).json(sensor);
});
// 400 = malformed (syntax, missing header, invalid JSON)
// 422 = well-formed but semantically invalid
```

### Query strings for filtering

```javascript
app.get('/api/sensors', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const sensors = getSensors({ limit, status });

  res.status(200).json(sensors);
});
```

### Nested resources

```javascript
app.get('/api/sensors/:id/readings', getReadings);
app.post('/api/sensors/:id/readings', createReading);
```

### Content negotiation (Accept header)

```javascript
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

  res.status(406).send(); // Not Acceptable
});
```

### Consistent response shapes

```javascript
// Success
{ "data": { ... } }

// Error
{ "error": "Not found", "status": 404 }
```

### Full resource router module

```javascript
const router = require('express').Router();

router.get('/', getAllSensors);
router.post('/', createSensor);
router.get('/:id', getSensor);
router.put('/:id', replaceSensor);
router.patch('/:id', patchSensor);
router.delete('/:id', deleteSensor);

module.exports = router;

// Mount
app.use('/api/sensors', sensorRouter);
```

### Hypermedia links (optional)

```javascript
{
  "id": "alpha",
  "links": {
    "self": "/api/sensors/alpha",
    "readings": "/api/sensors/alpha/readings"
  }
}
```

### Versioning

```javascript
// URL versioning
app.use('/api/v1/sensors', sensorRouterV1);
app.use('/api/v2/sensors', sensorRouterV2);
```

---

## Quick reference

| Chapter | Concepts |
|--------|----------|
| 3.9 | Sync errors caught by Express; async → try/catch + `next(err)`; error middleware `(err, req, res, next)`; `err.status` for status code; 404 handler before error handler; `res.headersSent` guard; `HttpError` class; log internally, respond minimally |
| 3.10 | `express.static('public')`; mount at prefix `/static`; multiple dirs (order); `maxAge`, `etag`; static calls `next()` when file missing; never put secrets in `public`; static + API in same app |
| 3.11 | `app.set('view engine','ejs')`, `app.set('views','./views')`; `res.render('name', data)`; `<% %>` execute, `<%= %>` escaped, `<%- %>` raw; partials `include()`; escape user data; logic in route, not template |
| 3.12 | URLs = nouns; GET 200/404, POST 201+Location, PUT/PATCH 200/404, DELETE 204/404; 400 malformed, 422 validation; filter via query; nested routes; content negotiation; consistent shapes; router per resource |
