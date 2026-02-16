# Section B Phase 5 Code Examples — Chapters 3.21–3.24

This file collects runnable code examples from Section B Phase 5 Chapters 3.21 (Deployment), 3.22 (Security), 3.23 (Performance), and 3.24 (Living System). Use them as reference or as a starting point for `Section_B/Phase_5/examples/` scripts.

---

## Chapter 3.21: Deployment Fundamentals

### nginx reverse proxy config (SSL termination)

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### trust proxy (required when behind reverse proxy)

```javascript
app.set('trust proxy', true);
// Trusts X-Forwarded-For, X-Forwarded-Proto, X-Forwarded-Host
```

### PM2 start and startup

```bash
pm2 start server.js --name homestead-api
pm2 save
pm2 startup
```

### PM2 cluster mode (one instance per CPU core)

```bash
pm2 start server.js -i max
```

### systemd unit file

```ini
[Unit]
Description=Homestead API (sensor, panel, fence, coop, or solar monitoring)
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/homestead-api
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### NODE_ENV conditional (production hardening)

```javascript
if (process.env.NODE_ENV === 'production') {
  app.disable('x-powered-by');
}
```

### Disable x-powered-by

```javascript
app.disable('x-powered-by');
```

### Helmet (security headers)

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Production logging (morgan to file)

```javascript
const fs = require('fs');
const morgan = require('morgan');

if (process.env.NODE_ENV === 'production') {
  const stream = fs.createWriteStream('./access.log', { flags: 'a' });
  app.use(morgan('combined', { stream }));
} else {
  app.use(morgan('dev'));
}
```

### Health endpoint (fast, no DB)

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});
```

### Graceful shutdown (SIGTERM)

```javascript
const server = app.listen(config.port);

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });
});
```

### Validate secrets at startup

```javascript
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set');
}
```

---

## Chapter 3.22: Security Surfaces

### Helmet (basic)

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Content Security Policy (CSP)

```javascript
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  })
);
```

### Input sanitization (validator)

```javascript
const validator = require('validator');

app.post('/api/sensors', (req, res) => {
  const name = validator.escape(req.body.name);
  const type = validator.trim(req.body.type);

  createSensor({ name, type });
  res.status(201).json({ created: true });
});
```

### XSS prevention in templates

```html
<!-- Bad: renders raw HTML -->
<%- userInput %>

<!-- Good: escapes HTML -->
<%= userInput %>
```

### SQL injection prevention (parameterized)

```javascript
// Bad: concatenation
db.query(`SELECT * FROM users WHERE name = '${req.body.name}'`);

// Good: parameterized
db.query(
  'SELECT * FROM users WHERE name = ?',
  [req.body.name]
);
```

### CSRF protection (cookie-based sessions)

```javascript
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

### Rate limiting (express-rate-limit)

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);
```

### Login rate limit (stricter)

```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

app.use('/api/login', loginLimiter);
```

### Secure cookie flags

```javascript
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 86400000
});
```

### Body size limits

```javascript
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
```

### Error handler — hide stack in production

```javascript
app.use((err, req, res, next) => {
  const status = err.status || 500;

  if (process.env.NODE_ENV === 'production') {
    return res.status(status).json({ error: 'Internal server error' });
  }

  res.status(status).json({ error: err.message, stack: err.stack });
});
```

### CORS (restrict origins)

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://yourdomain.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

### JWT verify (never decode without verify)

```javascript
// Wrong: decode does not verify signature
const decoded = jwt.decode(token);

// Right: verify signature and expiration
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) return res.status(403).json({ error: 'Invalid token' });
  req.user = decoded;
  next();
});
```

---

## Chapter 3.23: Performance and Scaling

### Blocking code (bad — freezes server)

```javascript
app.get('/api/heavy', (req, res) => {
  let total = 0;
  for (let i = 0; i < 1e10; i++) {
    total += i;
  }
  res.json({ total });
});
```

### Non-blocking async (correct)

```javascript
app.get('/api/sensors', async (req, res) => {
  const sensors = await db.query('SELECT * FROM sensors');
  res.json({ sensors });
});
```

### Sequential vs parallel

```javascript
// Sequential (slower if independent)
const a = await getA();
const b = await getB();
const c = await getC();

// Parallel (faster when independent)
const [a, b, c] = await Promise.all([
  getA(),
  getB(),
  getC()
]);
```

### Slow request detection (middleware)

```javascript
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1e6;

    if (duration > 500) {
      console.warn(`Slow request: ${req.path} took ${duration}ms`);
    }
  });

  next();
});
```

### Connection pooling (MySQL example)

```javascript
const pool = mysql.createPool({
  connectionLimit: 10
});
```

### Request timeout

```javascript
req.setTimeout(5000);
```

### Stateless design (avoid global state)

```javascript
// Bad: shared across all requests
let activeUser = null;

// Good: identity in token, session in DB
// No in-memory shared state
```

### In-memory cache (single process only)

```javascript
const cache = new Map();
// Does not scale across servers; resets on restart
// Use Redis for shared cache
```

---

## Chapter 3.24: Building a Living Express System

### Living server skeleton (full assembly)

```javascript
// server.js
const express = require('express');
const config = require('./config');

const app = express();

// Core middleware
app.use(require('./middleware/logger'));
app.use(require('helmet')());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());

// Routes
app.use('/api', require('./routes'));

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Error handler (last)
app.use(require('./middleware/errorHandler'));

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
```

### Graceful shutdown (SIGTERM)

```javascript
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
```

### System layers (conceptual)

```
┌─────────────────────────────┐
│ HTTP Boundary (Express)    │
├─────────────────────────────┤
│ Middleware Pipeline         │
│  - Logging                  │
│  - Security                 │
│  - Parsing                  │
│  - Authentication           │
│  - Validation               │
├─────────────────────────────┤
│ Route Layer (Intent)        │
├─────────────────────────────┤
│ Service Layer (Logic)       │
├─────────────────────────────┤
│ Storage Layer (Persistence) │
└─────────────────────────────┘
```

### Request lifecycle (discipline)

```
1. Network Boundary   → Node receives raw HTTP
2. Parsing Layer      → Method, path, headers, body
3. Middleware Pipeline→ Observe, validate, auth, transform
4. Route Handler      → Intent: retrieve, create, update, delete
5. Service Layer      → Domain logic, invariants
6. Storage Layer      → Database query, insert, update
7. Response           → Status + headers + body
8. Logging            → Outcome recorded
```

---

## Quick reference

| Chapter | Concepts |
|--------|----------|
| 3.21 | Reverse proxy (nginx/Caddy); trust proxy; PM2 or systemd; NODE_ENV=production; Helmet; health /health; graceful shutdown (SIGTERM → server.close); validate secrets at startup |
| 3.22 | Helmet; CSP; validator.escape/trim; <%= %> not <%- %>; parameterized SQL; CSRF for sessions; rate limit (API + login stricter); secure cookies; body limit; hide stack in prod; restrict CORS; jwt.verify not decode |
| 3.23 | Event loop; avoid blocking; async/await; Promise.all when independent; slow-request logging; connection pooling; req.setTimeout; stateless; Redis for shared cache |
| 3.24 | Living system = layers (boundary, middleware, route, service, storage); health endpoint; graceful shutdown; externalize state; error handler last; modular assembly |
