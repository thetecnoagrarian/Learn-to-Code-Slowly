# Section B Phase 5 Code Examples — Chapters 3.17–3.20

This file collects runnable code examples from Section B Phase 5 Chapters 3.17 (Async and Await), 3.18 (Modularization), 3.19 (Logging), and 3.20 (Complete API). Use them as reference or as a starting point for `Section_B/Phase_5/examples/` scripts.

---

## Chapter 3.17: Async and Await

### Promise with .then() and .catch()

```javascript
function getSensor(id) {
  return db.query('SELECT * FROM sensors WHERE id = ?', [id]);
}

getSensor(id)
  .then(sensor => {
    // Success
  })
  .catch(err => {
    // Error
  });
```

### async/await route handler (try/catch, next(err))

```javascript
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
```

### Async middleware (loadSensor, attach to req, next)

```javascript
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
```

### Sequential async (each waits for previous)

```javascript
const sensor = await getSensor(id);
const readings = await getReadings(id);
const config = await getConfig(id);
```

### Parallel async (Promise.all when independent)

```javascript
const [sensor, readings, config] = await Promise.all([
  getSensor(id),
  getReadings(id),
  getConfig(id)
]);
```

### Return after sending response (avoid double-send)

```javascript
// Wrong: execution continues
if (!sensor) {
  res.status(404).json({ error: 'Not found' });
}

// Right: return stops execution
if (!sensor) {
  return res.status(404).json({ error: 'Not found' });
}
```

### Avoid sync I/O (use fs.promises)

```javascript
// Wrong: blocks event loop
const data = fs.readFileSync('file.txt');

// Right: async
const data = await fs.promises.readFile('file.txt');
```

### Map domain errors to HTTP (ValidationError → 400)

```javascript
try {
  const result = await doWork();
} catch (err) {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  next(err);
}
```

### Centralized error propagation (async route pattern)

```javascript
app.get('/route', async (req, res, next) => {
  try {
    const result = await doWork();
    res.json(result);
  } catch (err) {
    next(err);
  }
});
```

---

## Chapter 3.18: Modularization

### Route module (routes/sensors.js)

```javascript
const express = require('express');
const router = express.Router();
const sensorService = require('../services/sensorService');

router.get('/', async (req, res, next) => {
  try {
    const sensors = await sensorService.getAllSensors();
    res.json({ sensors });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const sensor = await sensorService.getSensor(req.params.id);

    if (!sensor) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ sensor });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

### Mount router in server.js

```javascript
const sensorsRouter = require('./routes/sensors');
app.use('/api/sensors', sensorsRouter);
```

### Middleware module (middleware/auth.js)

```javascript
module.exports = function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token || !isValidToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = getUserFromToken(token);
  next();
};
```

### Use middleware in route

```javascript
const authenticate = require('../middleware/auth');

router.post('/', authenticate, createSensor);
```

### Service layer (services/sensorService.js)

```javascript
async function createSensor(data) {
  validateSensorData(data);
  const result = await db.insert(data);
  return result;
}

module.exports = {
  createSensor
};
```

### Route calls service (not DB directly)

```javascript
router.post('/', async (req, res, next) => {
  try {
    const sensor = await sensorService.createSensor(req.body);
    res.status(201).json({ sensor });
  } catch (err) {
    next(err);
  }
});
```

### Storage layer (storage/sensorStorage.js)

```javascript
async function insertSensor(data) {
  return db.query('INSERT INTO sensors ...');
}

async function findSensorById(id) {
  return db.query('SELECT ...');
}

module.exports = {
  insertSensor,
  findSensorById
};
```

### Route aggregation (routes/index.js)

```javascript
const express = require('express');
const router = express.Router();

router.use('/sensors', require('./sensors'));
router.use('/readings', require('./readings'));
router.use('/panels', require('./panels'));
router.use('/fence', require('./fence'));

module.exports = router;
```

### Single mount in server.js

```javascript
app.use('/api', require('./routes'));
```

### Error handler module (middleware/errorHandler.js)

```javascript
module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;

  res.status(status).json({
    error: err.message || 'Internal server error'
  });
};
```

### Project structure

```
project/
  server.js
  config/
    index.js
  routes/
    index.js
    sensors.js
    readings.js
  middleware/
    auth.js
    errorHandler.js
  services/
    sensorService.js
  storage/
    sensorStorage.js
```

---

## Chapter 3.19: Logging

### Minimal request logging

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Log on response finish (method, path, status, duration)

```javascript
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
```

### Structured logging (JSON)

```javascript
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
```

### Log levels (LOG_LEVEL env)

```javascript
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

function log(level, message) {
  const levels = ['error', 'warn', 'info', 'debug'];

  if (levels.indexOf(level) <= levels.indexOf(LOG_LEVEL)) {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}

log('info', 'Server started');
log('debug', 'Query executed');
log('error', 'Database connection failed');
```

### Error logging with context

```javascript
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
```

### Log authentication events (never log passwords)

```javascript
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
```

### Request ID (tracing)

```javascript
const { randomUUID } = require('crypto');

app.use((req, res, next) => {
  req.id = randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Include in logs
logger.info({
  requestId: req.id,
  method: req.method,
  path: req.path
});
```

### Slow request warning

```javascript
if (duration > 500) {
  log('warn', `Slow request: ${req.method} ${req.path} ${duration}ms`);
}
```

---

## Chapter 3.20: Complete API

### config.js

```javascript
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret'
};
```

### middleware/logger.js

```javascript
module.exports = function logger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: duration
    }));
  });

  next();
};
```

### middleware/auth.js (simple token example)

```javascript
const config = require('../config');

module.exports = function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (token !== config.jwtSecret) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  req.user = { id: 'admin' };
  next();
};
```

### middleware/validateSensor.js

```javascript
module.exports = function validateSensor(req, res, next) {
  const { name, type } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name required (string)' });
  }

  if (!type || typeof type !== 'string') {
    return res.status(400).json({ error: 'type required (string)' });
  }

  next();
};
```

### middleware/errorHandler.js

```javascript
module.exports = function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    status,
    message: err.message
  });

  res.status(status).json({
    error: err.message || 'Internal server error'
  });
};
```

### storage/database.js (in-memory example)

```javascript
let sensors = [];
let readings = [];

module.exports = {
  sensors,
  readings
};
```

### services/sensorService.js

```javascript
const db = require('../storage/database');
const { randomUUID } = require('crypto');

async function getAllSensors() {
  return db.sensors;
}

async function getSensor(id) {
  return db.sensors.find(s => s.id === id) || null;
}

async function createSensor(data) {
  const sensor = { id: randomUUID(), ...data };
  db.sensors.push(sensor);
  return sensor;
}

async function updateSensor(id, data) {
  const sensor = await getSensor(id);
  if (!sensor) return null;

  Object.assign(sensor, data);
  return sensor;
}

async function deleteSensor(id) {
  const index = db.sensors.findIndex(s => s.id === id);
  if (index === -1) return false;

  db.sensors.splice(index, 1);
  return true;
}

module.exports = {
  getAllSensors,
  getSensor,
  createSensor,
  updateSensor,
  deleteSensor
};
```

### routes/sensors.js (full CRUD)

```javascript
const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/auth');
const validateSensor = require('../middleware/validateSensor');
const sensorService = require('../services/sensorService');

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const sensors = await sensorService.getAllSensors();
    res.status(200).json({ sensors });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateSensor, async (req, res, next) => {
  try {
    const sensor = await sensorService.createSensor(req.body);
    res.status(201)
       .set('Location', `/api/sensors/${sensor.id}`)
       .json({ sensor });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const sensor = await sensorService.getSensor(req.params.id);
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.json({ sensor });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateSensor, async (req, res, next) => {
  try {
    const sensor = await sensorService.updateSensor(req.params.id, req.body);
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.json({ sensor });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await sensorService.deleteSensor(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

### routes/index.js (aggregation)

```javascript
const express = require('express');
const router = express.Router();

router.use('/sensors', require('./sensors'));
router.use('/readings', require('./readings'));
router.use('/panels', require('./panels'));
router.use('/fence', require('./fence'));

module.exports = router;
```

### server.js (assembly)

```javascript
const express = require('express');
const app = express();

const config = require('./config');

app.use(require('./middleware/logger'));

app.use(express.json());

app.use('/api', require('./routes'));

app.use(require('./middleware/errorHandler'));

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
```

---

## Quick reference

| Chapter | Concepts |
|--------|----------|
| 3.17 | async/await; try/catch + next(err); return after response; Promise.all for parallel; avoid fs.readFileSync; Express 4 does not auto-catch async errors |
| 3.18 | Route modules (express.Router); middleware modules; service layer; storage layer; routes → services → storage; route aggregation (routes/index.js) |
| 3.19 | Log on res.on('finish'); structured JSON logs; LOG_LEVEL (error, warn, info, debug); request ID; never log passwords; error logs with context |
| 3.20 | Full stack: config, logger, auth, validate, routes, services, storage, errorHandler; pipeline: logger → json → routes → errorHandler |
