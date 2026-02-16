## Phase 3 · Chapter 3.20: Building a Complete API

This chapter builds on everything in Phase 3.

You now understand:
	•	Routing
	•	Middleware
	•	Validation
	•	Authentication
	•	Persistence
	•	Error handling
	•	Logging
	•	Configuration
	•	Asynchronous flow
	•	Modularization

Now you assemble a complete system. Chapters 3.11–3.19 introduced each piece: templating, REST, validation, auth, persistence, config, async flow, modularization, logging. This chapter integrates them — one homestead API with config, routes, middleware, services, storage, and error handling in place.

Not fragments.
Not isolated examples.

A full Express API that behaves correctly under real conditions.

This chapter is integration.


## 1) What “Complete” Means

A complete API is not just routes.

It must:
	•	Accept requests
	•	Validate input
	•	Authenticate identity
	•	Persist data
	•	Return correct status codes
	•	Handle errors consistently
	•	Log behavior
	•	Be configurable
	•	Avoid blocking
	•	Be modular
	•	Respect HTTP semantics

Everything from Phase 0–3 comes together here.

## 2) System Overview

We’ll model a homestead sensor system:

Resources:
	•	Sensors
	•	Readings
	•	Panels
	•	Fence voltage

Relationships:
	•	A sensor has many readings

Endpoints:
	•	CRUD for sensors
	•	Create and retrieve readings

Authentication:
	•	Required for all routes

Persistence:
	•	Abstracted through service layer

## 3) Final Project Structure

homestead-api/
  server.js
  config.js
  routes/
    index.js
    sensors.js
    readings.js
    panels.js
    fence.js
  middleware/
    logger.js
    auth.js
    validateSensor.js
    errorHandler.js
  services/
    sensorService.js
    readingService.js
  storage/
    database.js

Separation of concerns:
	•	Routes → HTTP layer
	•	Middleware → cross-cutting concerns
	•	Services → business logic
	•	Storage → persistence
	•	Config → environment
	•	Server → assembly

## 4) Configuration Layer

config.js

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret'
};

Configuration is externalized.

No secrets in source code.

## 5) Logger Middleware

middleware/logger.js

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

Observability is built in.

## 6) Authentication Middleware

middleware/auth.js

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

Simple token example for clarity.

Authentication happens at the boundary.

## 7) Validation Middleware

middleware/validateSensor.js

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

Boundary enforcement.

## 8) Error Handler

middleware/errorHandler.js

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

Centralized error handling.

No duplicated try/catch responses.

## 9) Storage Layer (In-Memory for Example)

storage/database.js

let sensors = [];
let readings = [];

module.exports = {
  sensors,
  readings
};

In real deployment, replace with database.

Separation remains the same.

## 10) Service Layer

services/sensorService.js

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

Services contain business logic.

Routes do not.

## 11) Sensor Routes

routes/sensors.js

const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/auth');
const validateSensor = require('../middleware/validateSensor');
const sensorService = require('../services/sensorService');

router.use(authenticate);

// GET /api/sensors
router.get('/', async (req, res, next) => {
  try {
    const sensors = await sensorService.getAllSensors();
    res.status(200).json({ sensors });
  } catch (err) {
    next(err);
  }
});

// POST /api/sensors
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

// GET /api/sensors/:id
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

// PUT /api/sensors/:id
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

// DELETE /api/sensors/:id
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

Proper:
	•	Status codes
	•	Validation
	•	Authentication
	•	Location header
	•	204 for delete
	•	404 when missing

## 12) Route Aggregation

routes/index.js

const express = require('express');
const router = express.Router();

router.use('/sensors', require('./sensors'));
router.use('/readings', require('./readings'));
router.use('/panels', require('./panels'));
router.use('/fence', require('./fence'));

module.exports = router;

## 13) Server Assembly

server.js

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

Pipeline:
	1.	Logger
	2.	Body parsing
	3.	Routes
	4.	Error handler

This ordering is intentional.

## 14) Request Lifecycle (End-to-End)

Client sends:

POST /api/sensors
Authorization: Bearer dev-secret
Content-Type: application/json

{"name": "Greenhouse", "type": "temperature"}

Flow:
	1.	Logger middleware starts timer
	2.	JSON body parsed
	3.	Auth middleware verifies token
	4.	Validation middleware checks fields
	5.	Route handler calls service
	6.	Service writes to storage
	7.	Response 201 Created sent
	8.	Logger logs duration

Every layer participates: logger, body parsing, auth, validation, route, service, storage, error handler. Same pattern for sensors, readings, panels, or fence voltage — each request flows through the pipeline. Nothing is implicit.

## 15) HTTP Correctness Checklist

This API:
	•	Uses resource-based URLs
	•	Uses proper HTTP methods
	•	Uses correct status codes
	•	Sends Location header on 201
	•	Uses 204 for delete
	•	Returns 404 when resource missing
	•	Returns 400 for validation failures
	•	Returns 401/403 for auth failures
	•	Centralizes error handling
	•	Logs requests and errors
	•	Separates concerns
	•	Is configurable

That is what “complete” means.


## 16) Concept Anchor

You now understand:
	•	HTTP at the protocol level
	•	Express as structured HTTP
	•	Middleware pipelines
	•	Validation at boundaries
	•	Authentication
	•	Error handling
	•	Observability
	•	Modularization
	•	Persistence separation
	•	Environment configuration
	•	Async flow
	•	REST discipline

You can build a production-ready API — sensor, panel, fence, coop, or solar monitoring — with routing, auth, validation, persistence, error handling, logging, and configuration assembled into one cohesive system.

Not a toy.

A real system.

## 17) Common Failure Modes for a Complete API

Skipping validation: Route handler trusts req.body. Malformed input enters services and storage. Validate at the boundary — every POST and PUT.

Skipping auth on some routes: One unprotected /api/config exposes data. Apply auth consistently — router.use(authenticate) for the entire API or per-resource.

Error handler not last: Routes defined after error handler; 404s never reach it. Error handler must be last; order matters.

Logger before body parsing: Logger runs first — fine. Body parsing before routes — fine. Order: logger, body parsing, routes, error handler.

No Location on 201: Client receives 201 but no way to fetch the new resource. Set Location: /api/sensors/123 on create.

Mixing sync and async: Blocking call in route handler freezes server. Always use async storage; always await; always catch.

## 18) Reflection

Complete = all layers in place. Config, logger, body parsing, auth, validation, routes, services, storage, error handler. Routes → services → storage. Validate at boundary. Authenticate before protected routes. Use proper status codes — 200/201/204 for success, 400/401/403/404/422 for client errors, 500 for server. Log method, path, status, duration. Centralize errors. Same structure for sensor, panel, fence, coop, or solar APIs — modular, configurable, observable, production-ready.

## What's Next

Next: Chapter 3.21 — Deployment Fundamentals

Where you'll learn:
	•	Reverse proxies
	•	HTTPS
	•	trust proxy
	•	Production mode
	•	Scaling concerns
	•	Process managers
	•	Running behind Nginx or Caddy

Development proves correctness.

Deployment proves resilience.

You now have a complete API — routing, validation, auth, persistence, error handling, logging, config. Chapter 3.21 prepares it for real deployment: reverse proxies, HTTPS, process managers, and scaling.