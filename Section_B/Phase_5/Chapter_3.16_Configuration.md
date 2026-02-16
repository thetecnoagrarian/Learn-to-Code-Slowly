## Phase 3 · Chapter 3.16: Environment and Configuration

This chapter builds on:
	•	Chapter 3.15: State and Persistence

You now understand that:
	•	Express handles HTTP.
	•	Storage handles durability.
	•	Layers must remain separate.

Now we formalize another separation:

Code vs configuration.

Your application logic should not change when you deploy it to a different machine.

Only configuration should change.

If you must edit code to deploy, your architecture is wrong.

Chapter 3.15 introduced storage layers and database URLs. Those URLs, ports, and secrets must not live in code — they change between development, Pi, and production. This chapter formalizes configuration as a boundary: environment variables, centralized config modules, and fail-fast validation at startup.

## 1) What Configuration Is

Configuration is any value that changes between environments:
	•	Port numbers
	•	Database URLs
	•	API keys
	•	Secrets
	•	Feature flags
	•	Logging levels
	•	File paths
	•	External service endpoints (MQTT broker, sensor API, fence energizer API)

If a value differs between:
	•	Development and production
	•	Your laptop and your Pi
	•	Staging and live

It is configuration.

## 2) Why Hardcoding Is Dangerous

Hardcoding values creates fragility.

Example:

app.listen(3000);

Problems:
	•	Port 3000 may already be used.
	•	Production may require port 80.
	•	Cloud platforms assign ports dynamically.

Hardcoding secrets is worse:

const jwtSecret = "super-secret-key";

Problems:
	•	Secret committed to git.
	•	Visible to anyone with repository access.
	•	Rotating secret requires code change.
	•	You must redeploy to change it.

Hardcoding creates tight coupling between code and environment. Port 80 on a Pi, port 3000 locally, dynamically assigned PORT in cloud — the same code should run everywhere. Environment variables decouple them.

## 3) Environment Variables

Environment variables are key-value pairs defined outside your code.

Example:

PORT=3000
DATABASE_URL=sqlite://data.db
JWT_SECRET=abc123
NODE_ENV=development

Node exposes them through:

process.env

Reading configuration:

const port = process.env.PORT || 3000;

The code remains the same.
The environment changes behavior.

## 4) Fail Fast for Required Values

Some configuration must exist. JWT_SECRET, DATABASE_URL, API keys — without them the app cannot function safely. Never silently continue without required secrets.

Correct pattern:

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET must be set");
}

Failing early prevents undefined security states.

## 5) The Configuration Module Pattern

Never scatter process.env across your entire codebase.

Centralize configuration.

Example:

// config.js
const required = (value, name) => {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  database: {
    url: required(process.env.DATABASE_URL, "DATABASE_URL")
  },
  jwt: {
    secret: required(process.env.JWT_SECRET, "JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "24h"
  }
};

Usage:

const config = require("./config");

app.listen(config.port);

Now configuration is:
	•	Centralized
	•	Validated
	•	Structured

## 6) NODE_ENV and Behavioral Differences

NODE_ENV commonly controls behavior.

const isProduction = process.env.NODE_ENV === "production";

Examples:

Logging verbosity:

if (isProduction) {
  logger.level = "error";
} else {
  logger.level = "debug";
}

Static file behavior:

if (isProduction) {
  app.use(express.static("dist"));
} else {
  app.use(express.static("public"));
}

Never rely on implicit behavior.
Always make environment-dependent logic explicit.

## 7) Development Configuration with .env

In development, manually exporting variables is tedious.

Use a .env file:

PORT=3000
DATABASE_URL=sqlite://dev.db
JWT_SECRET=local-secret
NODE_ENV=development

Load with:

require("dotenv").config();

Important:
	•	.env files are for development.
	•	Never commit them.
	•	Add to .gitignore.

Production environments should inject real environment variables.

## 8) Security and Secrets

Secrets include:
	•	JWT secrets
	•	API keys
	•	Database passwords
	•	OAuth credentials
	•	Encryption keys

Rules:
	•	Never commit secrets.
	•	Never log secrets.
	•	Never expose secrets to client-side code.
	•	Rotate secrets when compromised.

Your config module should never export secrets to the browser layer.

## 9) Configuration as a Boundary

Configuration is a boundary between:
	•	Application logic
	•	Deployment environment

The application should assume:
	•	It receives configuration at startup.
	•	Configuration is immutable during runtime.
	•	Missing configuration is fatal.

This makes behavior predictable.

## 10) Production Deployment Patterns

Different environments inject variables differently:

Development:

PORT=3000 node server.js

System service (Linux):

export PORT=80
node server.js

Docker:

docker run -e PORT=80 -e DATABASE_URL=... app

Cloud platforms:
	•	Provide PORT automatically
	•	Inject secrets securely
	•	Manage environment isolation

Your code should not care how variables are injected.

## 11) Feature Flags

Configuration can enable/disable features.

Example:

const enableExperimental = process.env.FEATURE_EXPERIMENTAL === "true";

if (enableExperimental) {
  app.use("/api/experimental", experimentalRoutes);
}

Feature flags allow:
	•	Gradual rollouts
	•	Testing in production
	•	Safe toggling

Feature flags are configuration, not code branches.

## 12) Avoid Dynamic Runtime Mutation

Do not change configuration mid-execution.

Bad:

process.env.PORT = 5000;

Environment variables are inputs, not mutable state.

Configuration should be read once at startup and treated as immutable.

## 13) Configuration and Scaling

When scaling horizontally:
	•	Multiple instances must share consistent configuration.
	•	Secrets must be identical across instances.
	•	Database URLs must be correct for all instances.

Centralized configuration makes scaling predictable.

Hardcoded values break distributed systems.

## 14) Configuration Validation Strategy

At startup:
	1.	Load environment variables.
	2.	Validate required values.
	3.	Parse types (numbers, booleans).
	4.	Freeze configuration object.

Example:

const config = Object.freeze({
  port: Number(process.env.PORT) || 3000
});

Freezing prevents accidental mutation.

## 15) Mental Model

Think of configuration as:

External parameters that define how your system behaves.

Code defines structure.

Configuration defines environment-specific behavior.

Never mix the two.

## 16) Express Lifecycle and Configuration

Startup sequence:
	1.	Load configuration.
	2.	Validate configuration.
	3.	Connect to database.
	4.	Initialize middleware.
	5.	Start listening.

Configuration comes first.

If configuration is wrong, the app should not start.

## 17) Concept Anchor

You now understand:
	•	Hardcoding couples code to environment.
	•	Environment variables decouple configuration.
	•	Secrets must never be committed.
	•	Configuration should be centralized.
	•	Missing configuration should cause startup failure.
	•	NODE_ENV enables environment-aware behavior.
	•	Configuration is immutable runtime input.

You can configure ports, database URLs, JWT secrets, and MQTT broker addresses for sensor, panel, fence, or coop monitoring — without changing code when moving from laptop to Pi to production.

Configuration is architecture.

It defines how your application behaves in different contexts without altering its logic.

## 18) Common Failure Modes for Configuration

Committing secrets: .env or hardcoded JWT_SECRET in git. Anyone with repo access sees them. Add .env to .gitignore. Use .env.example with placeholder values only.

Scattering process.env everywhere: Every file reads process.env.PORT, process.env.DATABASE_URL. No validation, no central source. Centralize in a config module; validate at startup; export a frozen object.

Silently defaulting required values: DATABASE_URL missing → process.env.DATABASE_URL || "default.db". App starts, connects to wrong database, corrupts data. Fail fast: throw if required config is missing.

Exposing secrets to the client: Sending config to the browser, logging JWT_SECRET in error messages. Secrets stay server-side. Never include them in API responses, HTML, or logs.

Mutating configuration at runtime: process.env.PORT = 5000 mid-request. Configuration is startup input. Read once, freeze, treat as immutable.

Assuming NODE_ENV is set: process.env.NODE_ENV may be undefined in some environments. Default explicitly: process.env.NODE_ENV || "development".

## 19) Reflection

Configuration is any value that changes between environments — port, database URL, secrets, feature flags. Hardcoding couples code to environment; environment variables decouple. Centralize in a config module; validate required values at startup; fail fast if missing. Secrets: never commit, never log, never expose to client. NODE_ENV drives production vs development behavior. Configuration is read once at startup, immutable during runtime. Whether your app runs on a laptop, Pi, or cloud — config at the edge, code unchanged.

## What's Next

Next: Chapter 3.17 — Asynchronous Flow in Express

Where you'll learn:
	•	Async/await behavior and promise propagation
	•	How asynchronous execution interacts with the middleware pipeline and error handling

You now know configuration as a boundary — env vars, centralized config, fail-fast validation. Chapter 3.17 formalizes async flow: database calls and storage layer operations are asynchronous; understanding how promises and async/await interact with the pipeline completes the picture.