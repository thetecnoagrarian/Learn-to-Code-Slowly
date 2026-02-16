# Section B Phase 5 Code Examples — Chapters 3.1–3.4

This file collects runnable code examples from Section B Phase 5 Chapters 3.1 (What Express Is), 3.2 (Minimal Server), 3.3 (Request and Response Objects), and 3.4 (Routing Fundamentals). Use them as reference or as a starting point for `Section_B/Phase_5/examples/` scripts.

---

## Chapter 3.1: What Express Is

### Raw Node HTTP server (what Express wraps)

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(3000);
```

### Raw Node homestead sensor API (manual parsing and routing)

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const query = Object.fromEntries(url.searchParams);

  if (req.method === 'GET' && path === '/api/sensors') {
    const sensors = getAllSensors();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ sensors }));
  } else if (req.method === 'GET' && path.startsWith('/api/sensors/')) {
    const id = path.split('/')[3];
    const sensor = getSensor(id);
    if (!sensor) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Not found' }));
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ sensor }));
  } else if (req.method === 'POST' && path === '/api/temp') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        saveTemperature(data.temp, data.sensorId);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ saved: true }));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3000);
```

### Express routing (same behavior, less code)

```javascript
// Express
app.get('/api/sensors/:id', (req, res) => {
  const sensor = getSensor(req.params.id);
  res.json({ sensor });
});
```

### Raw Node vs Express — response construction

```javascript
// Raw Node.js
const sensor = getSensor('alpha');
res.statusCode = 200;
res.setHeader('Content-Type', 'application/json');
res.setHeader('Cache-Control', 'max-age=60');
res.end(JSON.stringify({ sensor }));

// Express
const sensor = getSensor('alpha');
res.status(200)
   .set('Cache-Control', 'max-age=60')
   .json({ sensor });
```

### Homestead voltage endpoint (Express)

```javascript
app.get('/api/voltage', (req, res) => {
  const voltage = readVoltageSensor();
  res.status(200)
     .set('Cache-Control', 'max-age=5')
     .set('ETag', `"v${voltage}"`)
     .json({ voltage });
});
```

### Body parsing: Raw Node vs Express

```javascript
// Raw Node.js — manual body handling
let body = '';
req.on('data', chunk => { body += chunk.toString(); });
req.on('end', () => {
  try {
    const data = JSON.parse(body);
    saveTemperature(data.temp);
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
  }
});

// Express — middleware + handler
app.use(express.json());

app.post('/api/temp', (req, res) => {
  const temp = req.body.temp;
  saveTemperature(temp);
  res.status(201).json({ saved: true });
});
```

### Middleware pipeline (Express)

```javascript
function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = getUserFromToken(token);
  next();
}

function validate(req, res, next) {
  if (!req.body.temp) {
    return res.status(400).json({ error: 'temp required' });
  }
  next();
}

app.use(express.json());
app.post('/api/temp', authenticate, validate, (req, res) => {
  saveTemperature(req.body.temp);
  res.status(201).json({ saved: true });
});
```

### Error handling middleware

```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;
  res.status(status).json({ error: message });
});
```

### HTTP → Express mental mapping

```javascript
// Request: GET /api/sensors/alpha?limit=10
req.method  === 'GET'
req.path    === '/api/sensors/alpha'
req.query   === { limit: '10' }
req.headers === { host: '...', authorization: '...', ... }
req.body    === { temp: 72.5 }   // after express.json()
req.params  === { id: 'alpha' }  // route /api/sensors/:id

// Response
res.status(200);
res.set('Cache-Control', 'max-age=60');
res.json({ sensor: { ... } });
```

### RESTful homestead API (Chapter 3.1)

```javascript
app.get('/api/sensors', getAllSensors);
app.get('/api/sensors/:id', getSensor);
app.post('/api/sensors', createSensor);
app.put('/api/sensors/:id', updateSensor);
app.delete('/api/sensors/:id', deleteSensor);
```

---

## Chapter 3.2: The Minimal Express Server

### Minimal server — one app, one route, one listen

```javascript
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

### Second route returning JSON (content-type in practice)

```javascript
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/status', (req, res) => {
  res.json({ uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

### Three health-style endpoints (challenge)

```javascript
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'server' });
});

app.get('/health/coop', (req, res) => {
  res.json({ status: 'ok', subsystem: 'coop', heartbeat: true });
});

app.get('/health/solar', (req, res) => {
  res.json({ status: 'ok', subsystem: 'solar', heartbeat: true });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

### Minimal logging — when server starts and when health is hit

```javascript
const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

app.get('/health', (req, res) => {
  console.log(`${req.method} ${req.path}`);
  res.json({ status: 'ok' });
});
```

### Log all requests (simple middleware)

```javascript
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

### Timeout debugging — see if request arrives and when response is sent

```javascript
app.post('/api/temp', (req, res) => {
  console.log('Request received at', new Date().toISOString());
  // ... handle request
  res.status(201).json({ saved: true });
  console.log('Response sent at', new Date().toISOString());
});
```

### Homestead — log incoming temp readings (observation only)

```javascript
app.use(express.json());

app.post('/api/temp', (req, res) => {
  console.log(`Received temp reading: ${JSON.stringify(req.body)}`);
  // ... handle request
  res.status(201).json({ saved: true });
});
```

---

## Chapter 3.3: Request and Response Objects

### req.method

```javascript
app.post('/api/temp', (req, res) => {
  console.log(`Received ${req.method} request`);
  if (req.method === 'POST') {
    // Handle POST
  }
  res.status(201).json({ saved: true });
});
```

### req.path and req.query

```javascript
// Request: GET /api/sensors/coop?limit=10
app.get('/api/sensors/:id', (req, res) => {
  console.log(req.path);         // '/api/sensors/coop'
  console.log(req.params.id);   // 'coop'
  console.log(req.query.limit); // '10'
  res.json({ sensor: 'coop', temp: 72.5 });
});
```

### req.headers (lowercase; content-type and authorization)

```javascript
app.post('/api/temp', (req, res) => {
  const contentType = req.headers['content-type'];
  if (contentType !== 'application/json') {
    return res.status(415).json({ error: 'Unsupported Media Type' });
  }
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.status(201).json({ saved: true });
});
```

### req.query — validate and convert (query values are strings)

```javascript
app.get('/api/sensors', (req, res) => {
  const limit = Number(req.query.limit);
  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: 'Invalid limit' });
  }
  const unit = req.query.unit;
  if (unit && unit !== 'F' && unit !== 'C') {
    return res.status(400).json({ error: 'Invalid unit' });
  }
  const sensors = getSensors(limit, unit);
  res.json({ sensors });
});
```

### req.params — validate before use

```javascript
app.get('/api/sensors/:id', (req, res) => {
  const sensorId = req.params.id;
  if (!sensorId || sensorId.length > 50) {
    return res.status(400).json({ error: 'Invalid sensor ID' });
  }
  const sensor = getSensor(sensorId);
  if (!sensor) {
    return res.status(404).json({ error: 'Sensor not found' });
  }
  res.json({ sensor });
});
```

### req.body — only after body-parsing middleware

```javascript
app.use(express.json());

app.post('/api/temp', (req, res) => {
  const { sensorId, temp } = req.body;
  if (!sensorId || typeof temp !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  saveTemperature(sensorId, temp);
  res.status(201).json({ saved: true });
});
```

### res.status and status codes

```javascript
app.post('/api/temp', (req, res) => {
  const { sensorId, temp } = req.body;
  if (!sensorId || typeof temp !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const saved = saveTemperature(sensorId, temp);
  if (!saved) {
    return res.status(500).json({ error: 'Failed to save' });
  }
  res.status(201).json({ saved: true });
});
```

### res.send vs res.json

```javascript
// Health — text
app.get('/health', (req, res) => {
  res.send('OK');
});

// API — explicit JSON
app.get('/api/voltage', (req, res) => {
  const voltage = readVoltage();
  res.json({ voltage });
});
```

### res.set — headers and chaining

```javascript
app.get('/api/voltage', (req, res) => {
  const voltage = readVoltage();
  const etag = `"v${voltage}"`;
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }
  res.status(200)
     .set('Cache-Control', 'max-age=5')
     .set('ETag', etag)
     .json({ voltage });
});
```

### res.redirect

```javascript
res.redirect('/new-location');
res.redirect(301, '/new-location');
```

### Building a complete response

```javascript
app.get('/api/voltage', (req, res) => {
  const voltage = 12.1;
  res.status(200)
     .set('Cache-Control', 'no-store')
     .json({ voltage });
});
```

### Boundary validation — limit and unit

```javascript
app.get('/api/sensors', (req, res) => {
  const limit = Number(req.query.limit);
  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: 'Invalid limit' });
  }
  const unit = req.query.unit;
  if (unit && unit !== 'F' && unit !== 'C') {
    return res.status(400).json({ error: 'Invalid unit' });
  }
  const sensors = getSensors(limit, unit);
  res.json({ sensors });
});
```

### Homestead example — complete sensor readings endpoint

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/readings', (req, res) => {
  const { sensor, temp } = req.body;

  if (!sensor || typeof sensor !== 'string') {
    return res.status(400).json({ error: 'Invalid sensor ID' });
  }
  if (typeof temp !== 'number' || temp < -40 || temp > 150) {
    return res.status(400).json({ error: 'Invalid temperature' });
  }

  const saved = saveReading(sensor, temp);
  if (!saved) {
    return res.status(500).json({ error: 'Failed to save' });
  }

  res.status(201)
     .set('Location', `/api/readings/${sensor}`)
     .json({ status: 'stored', sensor, temp });
});

app.listen(3000);
```

---

## Chapter 3.4: Routing Fundamentals

### Basic route definitions — method + path

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

### Homestead — sensors list, post temp, get one sensor

```javascript
app.get('/api/sensors', (req, res) => {
  const sensors = getAllSensors();
  res.json({ sensors });
});

app.post('/api/temp', (req, res) => {
  const { temp } = req.body;
  saveTemperature(temp);
  res.status(201).json({ saved: true });
});

app.get('/api/sensors/coop', (req, res) => {
  const sensor = getSensor('coop');
  res.json({ sensor });
});
```

### Route order — specific before parameterized

```javascript
// Wrong: parameterized first shadows specific
app.get('/api/sensors/:id', (req, res) => {
  res.send('Sensor ' + req.params.id);
});
app.get('/api/sensors/coop', (req, res) => {
  res.send('Coop sensor');  // Never runs!
});

// Right: specific first
app.get('/api/sensors/coop', getCoopSensor);
app.get('/api/sensors/barn', getBarnSensor);
app.get('/api/sensors/:id', getSensorById);
app.get('/api/sensors', getAllSensors);
```

### Homestead — correct route order

```javascript
app.get('/api/sensors/coop/status', getCoopStatus);
app.get('/api/sensors/coop', getCoopSensor);
app.get('/api/sensors/:id', getSensorById);
app.get('/api/sensors', getAllSensors);
```

### Multiple handlers per route (middleware + handler)

```javascript
const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/api/sensors', logRequest, requireAuth, (req, res) => {
  res.json({ sensors: [] });
});
```

### Homestead — log + body parsing + handler

```javascript
const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

app.post('/api/temp', logRequest, express.json(), (req, res) => {
  const { temp } = req.body;
  saveTemperature(temp);
  res.status(201).json({ saved: true });
});
```

### RESTful route structure — collection and resource

```javascript
app.get('/api/sensors', getAllSensors);
app.post('/api/sensors', createSensor);
app.get('/api/sensors/:id', getSensor);
app.put('/api/sensors/:id', updateSensor);
app.delete('/api/sensors/:id', deleteSensor);
app.patch('/api/sensors/:id', patchSensor);
```

### Homestead REST API — sensors and nested readings

```javascript
app.get('/api/sensors', getAllSensors);
app.post('/api/sensors', createSensor);
app.get('/api/sensors/:id', getSensor);
app.put('/api/sensors/:id', updateSensor);
app.delete('/api/sensors/:id', deleteSensor);
app.get('/api/sensors/:id/readings', getReadings);
app.post('/api/sensors/:id/readings', createReading);
```

### Mounting a router (sensors in separate file)

```javascript
// routes/sensors.js
const express = require('express');
const router = express.Router();

router.get('/', getAllSensors);
router.get('/:id', getSensor);
router.post('/', createSensor);
router.put('/:id', updateSensor);
router.delete('/:id', deleteSensor);

module.exports = router;

// app.js
const sensorRoutes = require('./routes/sensors');
app.use('/api/sensors', sensorRoutes);
```

---

## Quick reference

| Chapter | Concepts |
|--------|----------|
| 3.1 | Raw Node vs Express, routing, response helpers, `express.json()`, middleware, error middleware, HTTP ↔ req/res |
| 3.2 | Minimal app: create app, one route (e.g. `/health`), `listen`. Logging, timeout debugging |
| 3.3 | `req.method`, `req.path`, `req.query`, `req.params`, `req.headers`, `req.body`; `res.status()`, `res.set()`, `res.json()`, `res.send()`; boundary validation |
| 3.4 | Route order (specific before `:id`), multiple handlers, REST structure, `app.use('/api/sensors', router)` |
