Phase 3 · Chapter 3.21: Deployment Fundamentals

This chapter builds on:
	•	Chapter 3.16: Configuration
	•	Chapter 3.20: Complete API

You now have a working API.

It runs locally.
It passes requests.
It handles errors correctly.

But development is not production.

Deployment is the discipline of running your system in the real world. Chapter 3.20 gave you a complete API; Chapter 3.16 gave you configuration. This chapter adds production concerns: reverse proxies, HTTPS, process managers, health checks, graceful shutdown, and trust proxy. Your sensor, panel, fence, or coop API runs locally — now it must run safely on a Pi or server.

Production is about:
	•	Reliability
	•	Security
	•	Observability
	•	Isolation
	•	Recoverability

This chapter moves you from “it works” to “it runs safely under pressure.”


## 1) Development vs Production

Development:

node server.js

	•	Runs on your laptop
	•	Logs to console
	•	No HTTPS
	•	No process supervision
	•	Manual restarts

Production:

Client → Reverse Proxy → Express → Database

	•	HTTPS enabled
	•	Process manager running
	•	Auto-restarts on crash
	•	Logs stored
	•	Environment variables configured
	•	Monitoring active

Development proves correctness.
Production proves resilience.

## 2) Production Architecture Overview

A typical deployment stack:

Internet
   ↓
Reverse Proxy (nginx / Caddy / Apache)
   ↓
Node.js / Express (port 3000)
   ↓
Database (Postgres / SQLite / MySQL)

Express should not be directly exposed to the internet.

It should sit behind a reverse proxy.

## 3) Reverse Proxies

Express usually runs on port 3000.

Reverse proxies run on ports:
	•	80 (HTTP)
	•	443 (HTTPS)

They forward requests internally.

Example flow:

Client → nginx (443 HTTPS)
       → forwards to localhost:3000
       → Express handles request
       → Response returned

Why use a reverse proxy?
	•	SSL/TLS termination
	•	Efficient static file serving
	•	Compression
	•	Rate limiting
	•	Load balancing
	•	Security isolation

Express focuses on application logic.
The proxy handles transport concerns.

Separation of responsibility.

## 4) SSL/TLS Termination

HTTPS encryption should terminate at the reverse proxy.

Example nginx config snippet:

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

Express never directly handles SSL.

It trusts the proxy.

## 5) trust proxy Setting

When Express runs behind a proxy, request metadata changes.

By default:
	•	req.ip shows the proxy’s IP
	•	req.protocol may show http

You must enable trust:

app.set('trust proxy', true);

This tells Express:
	•	Trust X-Forwarded-For
	•	Trust X-Forwarded-Proto
	•	Trust X-Forwarded-Host

Without this:
	•	Rate limiting may break
	•	HTTPS detection may fail
	•	Client IP logging is incorrect

This is a boundary discipline issue.

## 6) Process Management

Running:

node server.js

is not production-safe.

If Node crashes:
	•	Your API dies
	•	No automatic restart

You need a process manager.

### 6a) Option 1: PM2

Start app:

pm2 start server.js --name homestead-api

Same pattern for sensor, panel, fence, coop, or solar monitoring APIs — PM2 supervises the Node process.

Enable startup:

pm2 save
pm2 startup

PM2 provides:
	•	Auto restart on crash
	•	Log management
	•	Process monitoring
	•	Zero-downtime reload
	•	Clustering support

### 6b) Option 2: systemd

Example systemd unit:

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

systemd:
	•	Restarts automatically
	•	Integrates with OS
	•	Runs at boot
	•	Tracks failures

Choose one.
Never rely on manual restarts.

## 7) NODE_ENV

Production should always set:

NODE_ENV=production

Why?

Express changes behavior:
	•	Disables stack traces
	•	Enables performance optimizations
	•	Changes error handling

You can also conditionally load middleware:

if (process.env.NODE_ENV === 'production') {
  app.disable('x-powered-by');
}

Environment flags control behavior without changing code.

## 8) Security Hardening

Production requires tightening the surface area.

Disable Express signature:

app.disable('x-powered-by');

Use Helmet:

const helmet = require('helmet');
app.use(helmet());

Helmet sets:
	•	Content-Security-Policy
	•	X-Frame-Options
	•	X-Content-Type-Options
	•	Referrer-Policy

These are transport-level defenses.

## 9) Logging in Production

Console logs are fine in development.

Production logging should be:
	•	Structured
	•	Persistent
	•	Rotated
	•	Centralized

Example:

const fs = require('fs');
const morgan = require('morgan');

if (process.env.NODE_ENV === 'production') {
  const stream = fs.createWriteStream('./access.log', { flags: 'a' });
  app.use(morgan('combined', { stream }));
} else {
  app.use(morgan('dev'));
}

Better approach:
	•	Log to stdout
	•	Let process manager handle collection
	•	Ship logs to monitoring system

Logs are not decoration.
They are your eyes.

## 10) Health Checks

Production systems need health endpoints.

Add:

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

Load balancers use this to determine:
	•	Is the service alive?
	•	Should traffic continue?

Health checks must:
	•	Be fast
	•	Avoid heavy database queries
	•	Avoid blocking

## 11) Graceful Shutdown

Production servers must shut down safely.

Example:

const server = app.listen(config.port);

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });
});

This:
	•	Stops accepting new requests
	•	Finishes active requests
	•	Exits cleanly

Without this:
	•	In-flight requests may be cut off
	•	Data corruption may occur

Deployment is about lifecycle control.

## 12) Environment Variables in Production

Never:
	•	Commit .env files with secrets
	•	Hardcode secrets in code
	•	Store production secrets in git

Use:
	•	Environment variables
	•	Secret managers
	•	CI/CD environment configuration

Validate required secrets at startup:

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set');
}

Fail fast.

## 13) Scaling Considerations

Single process:

1 Node process

Multi-process:

PM2 cluster mode
Multiple Node processes

Example:

pm2 start server.js -i max

This runs one instance per CPU core.

Why scale?
	•	Node is single-threaded
	•	More CPU cores → more concurrency

Reverse proxy distributes traffic.

## 14) Static Files in Production

Options:
	1.	Serve via Express
	2.	Serve via reverse proxy
	3.	Use CDN

Best practice:
	•	Let nginx serve static files
	•	Let Express handle API

Separation improves performance.

## 15) Production Checklist

Before deploying:
	•	NODE_ENV=production
	•	trust proxy enabled
	•	Reverse proxy configured
	•	HTTPS working
	•	Process manager active
	•	Health endpoint present
	•	Logs flowing
	•	Secrets not committed
	•	Graceful shutdown implemented

Deployment is systematic.
Never guess.

## 16) Failure Modes

Things that go wrong in production:
	•	Memory leaks
	•	Unhandled promise rejections
	•	Blocking code
	•	Missing environment variables
	•	SSL misconfiguration
	•	Log disk filling up
	•	Crash loops

Forgetting trust proxy: req.ip shows proxy IP; rate limiting breaks; HTTPS detection fails. Enable app.set('trust proxy', true) when behind nginx or Caddy.

Exposing Express directly: No reverse proxy; Express handles SSL or runs on port 80. Use a proxy — nginx or Caddy — for SSL, static files, and isolation.

No process manager: node server.js; crash wipes the API; no restart. Use PM2 or systemd.

No graceful shutdown: SIGTERM kills immediately; in-flight requests cut off. Listen for SIGTERM; server.close(); then exit.

Deployment discipline reduces these risks.

## 17) Development vs Production Summary

Development:
	•	Fast iteration
	•	Console logs
	•	Manual restart
	•	Local database
	•	No HTTPS

Production:
	•	Reverse proxy
	•	HTTPS
	•	Process manager
	•	Structured logs
	•	Health monitoring
	•	Environment-driven config
	•	Graceful shutdown
	•	Security hardened

Different environments.
Different constraints.
Same codebase.

## 18) Concept Anchor

You now understand:
	•	Express in isolation
	•	Express in production
	•	Proxy interaction
	•	trust proxy implications
	•	Process supervision
	•	Environment configuration discipline
	•	Logging strategy
	•	Health checks
	•	Shutdown lifecycle

You are no longer just writing APIs.

You are operating services — sensor, panel, fence, coop, or solar APIs in production.

Chapter 3.22 applies security surfaces — rate limiting, CSRF awareness, input sanitization, Helmet. Deployment puts your API on the internet; security hardens it.

### Reflection

Deployment = running in the real world. Development proves correctness; production proves resilience. Reverse proxy (nginx/Caddy) in front — SSL termination, static files, isolation. Express behind proxy: app.set('trust proxy', true). Process manager (PM2 or systemd): auto-restart, log management. NODE_ENV=production. Health endpoint: fast, no DB. Graceful shutdown: SIGTERM → server.close → exit. Secrets via env vars, never committed. Whether your API serves sensors, panels, fence voltage, or coop readings — proxy, process manager, health check, graceful shutdown.

## What's Next

Next: Chapter 3.22 — Security Surfaces in Express

Where you'll learn:
	•	CSRF awareness
	•	Rate limiting
	•	Input sanitization
	•	Header hardening
	•	Abuse prevention

Building APIs is engineering.

Securing them is responsibility.

You now know deployment — reverse proxy, trust proxy, process manager, health check, graceful shutdown, NODE_ENV. Chapter 3.22 adds security surfaces: rate limiting, Helmet, CSRF awareness, input sanitization.