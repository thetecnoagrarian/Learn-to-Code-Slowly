# Section B Phase 5 Code Examples — Chapters 3.13–3.16

This file collects runnable code examples from Section B Phase 5 Chapters 3.13 (Validation), 3.14 (Authentication), 3.15 (Persistence), and 3.16 (Configuration). Use them as reference or as a starting point for `Section_B/Phase_5/examples/` scripts.

---

## Chapter 3.13: Validation at the Boundary

### Presence validation (required fields → 400)

```javascript
app.post('/api/sensors', (req, res) => {
  const { name, type } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  if (!type) {
    return res.status(400).json({ error: 'type is required' });
  }

  const sensor = createSensor({ name, type });
  res.status(201).json(sensor);
});
```

### Type validation (numeric)

```javascript
app.post('/api/temp', (req, res) => {
  const { temp } = req.body;

  if (typeof temp !== 'number') {
    return res.status(400).json({ error: 'temp must be numeric' });
  }

  saveTemperature(temp);
  res.status(201).json({ saved: true });
});
```

### Range validation

```javascript
if (temp < -40 || temp > 150) {
  return res.status(400).json({
    error: 'temp must be between -40 and 150'
  });
}
```

### Format validation (ID pattern)

```javascript
const idRegex = /^[a-z0-9_-]+$/i;

if (!idRegex.test(req.params.id)) {
  return res.status(400).json({ error: 'invalid sensor id format' });
}
```

### Semantic validation (422 when structure is OK but meaning is not)

```javascript
if (req.body.startDate > req.body.endDate) {
  return res.status(422).json({
    error: 'startDate must be before endDate'
  });
}
```

### Validating route params (format → 400, not found → 404)

```javascript
app.get('/api/sensors/:id', (req, res) => {
  const id = req.params.id;

  if (!/^[a-z0-9_-]+$/i.test(id)) {
    return res.status(400).json({ error: 'invalid id format' });
  }

  const sensor = getSensor(id);

  if (!sensor) {
    return res.status(404).json({ error: 'sensor not found' });
  }

  res.json(sensor);
});
```

### Validating query strings (limit optional but validated if present)

```javascript
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
```

### Validating Content-Type header (415)

```javascript
const contentType = req.headers['content-type'];

if (req.method === 'POST' && !contentType?.includes('application/json')) {
  return res.status(415).json({
    error: 'Content-Type must be application/json'
  });
}
```

### Validation middleware (centralized)

```javascript
const validateSensor = (req, res, next) => {
  const { name, threshold } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name required (string)' });
  }

  if (typeof threshold !== 'number') {
    return res.status(400).json({ error: 'threshold must be numeric' });
  }

  next();
};

app.post('/api/sensors', validateSensor, (req, res) => {
  const sensor = createSensor(req.body);
  res.status(201).json(sensor);
});
```

### Reject extra fields (whitelist)

```javascript
const allowedFields = ['name', 'type', 'location'];
const receivedFields = Object.keys(req.body);

for (const field of receivedFields) {
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: `unexpected field: ${field}` });
  }
}
```

### Size validation (array length)

```javascript
if (req.body.readings.length > 1000) {
  return res.status(400).json({ error: 'too many readings' });
}
```

### Consistent error structure (details array)

```javascript
res.status(400).json({
  error: 'Validation failed',
  details: [
    { field: 'temp', message: 'must be numeric' }
  ]
});
```

### Sanitization (trim) — prefer validation first

```javascript
req.body.name = req.body.name.trim();
```

### Validation library (Zod conceptual)

```javascript
const schema = z.object({
  name: z.string(),
  threshold: z.number().min(0).max(100)
});
```

---

## Chapter 3.14: Authentication Basics

### Session-based login (create session, set cookie)

```javascript
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const sessionId = createSession(user.id);

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    user: { id: user.id, username: user.username }
  });
});
```

### Session verification middleware

```javascript
const authenticateSession = (req, res, next) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const session = getSession(sessionId);

  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  req.user = { id: session.userId };
  next();
};

app.get('/api/profile', authenticateSession, (req, res) => {
  const user = getUser(req.user.id);
  res.json({ user });
});
```

### Token-based login (JWT)

```javascript
const jwt = require('jsonwebtoken');

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(200).json({ token });
});
```

### Token verification middleware

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = { id: decoded.userId };
    next();
  });
};

app.get('/api/profile', authenticateToken, handler);
```

### Cookie parser (required for req.cookies)

```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Now req.cookies.sessionId is available
```

### Cookie security options

```javascript
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 86400000
});
```

### Session-based logout

```javascript
app.post('/api/logout', authenticateSession, (req, res) => {
  deleteSession(req.cookies.sessionId);
  res.clearCookie('sessionId');
  res.status(200).json({ message: 'Logged out' });
});
```

### Apply auth to API prefix

```javascript
app.use('/api', authenticateSession);
// All /api/* routes require authentication
```

---

## Chapter 3.15: State and Persistence

### Anti-pattern: in-memory only (data lost on restart)

```javascript
let sensors = [];

app.post('/api/sensors', (req, res) => {
  sensors.push(req.body);
  res.status(201).json({ saved: true });
});
```

### Route layer calls storage (no DB in route)

```javascript
app.post('/api/readings', async (req, res) => {
  const { sensorId, value } = req.body;

  await readingsStore.save(sensorId, value);

  res.status(201).json({ saved: true });
});
```

### Storage layer (async API)

```javascript
async function save(sensorId, value) {
  // Database insert
}

async function getRecent(sensorId, limit) {
  // Database query
}
```

### Async storage in route — try/catch and next(err)

```javascript
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
```

### Handling storage errors

```javascript
try {
  await store.save(data);
} catch (err) {
  next(err);
}
```

### Service layer (business logic not in route)

```javascript
// Route orchestrates
app.post('/api/order', async (req, res) => {
  await orderService.create(req.body);
  res.status(201).json({ created: true });
});
```

### Project structure (routes + storage)

```
project/
  server.js
  routes/
    sensors.js
  storage/
    sensors.js
  database.js
```

---

## Chapter 3.16: Environment and Configuration

### Reading environment variables

```javascript
const port = process.env.PORT || 3000;
```

### Fail fast for required config

```javascript
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET must be set');
}
```

### Centralized config module (config.js)

```javascript
// config.js
const required = (value, name) => {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  database: {
    url: required(process.env.DATABASE_URL, 'DATABASE_URL')
  },
  jwt: {
    secret: required(process.env.JWT_SECRET, 'JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};
```

### Using config in app

```javascript
const config = require('./config');

app.listen(config.port);
```

### NODE_ENV and behavior

```javascript
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  logger.level = 'error';
} else {
  logger.level = 'debug';
}

if (isProduction) {
  app.use(express.static('dist'));
} else {
  app.use(express.static('public'));
}
```

### Loading .env in development

```javascript
require('dotenv').config();
// Loads .env into process.env. Never commit .env; add to .gitignore.
```

### Feature flags

```javascript
const enableExperimental = process.env.FEATURE_EXPERIMENTAL === 'true';

if (enableExperimental) {
  app.use('/api/experimental', experimentalRoutes);
}
```

### Freeze config (immutable)

```javascript
const config = Object.freeze({
  port: Number(process.env.PORT) || 3000
});
```

### Startup sequence (config first)

```
1. Load configuration
2. Validate configuration
3. Connect to database
4. Initialize middleware
5. Start listening
```

---

## Quick reference

| Chapter | Concepts |
|--------|----------|
| 3.13 | Presence, type, range, format, semantics; 400 malformed, 422 semantic; validate params, query, headers; validation middleware; whitelist fields; size limits; consistent error shape; validate before side effects |
| 3.14 | Session (cookie + server store) vs token (JWT, Authorization header); login → create session/token; middleware verifies every request; cookie: httpOnly, secure, sameSite; logout invalidates session + clearCookie; 401 identity, 403 forbidden |
| 3.15 | Express ≠ storage; route calls store, store talks to DB; async: await store.*, try/catch, next(err); in-memory loses on restart/scale; layers: transport, boundary, business, storage |
| 3.16 | process.env; central config module; required() fail-fast; NODE_ENV; .env + dotenv (dev only); never commit secrets; Object.freeze(config); config at startup, immutable |
