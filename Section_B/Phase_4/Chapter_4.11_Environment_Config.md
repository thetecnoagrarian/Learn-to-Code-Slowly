# Phase 2.7 · Chapter 2.7.11: Environment and Configuration in Node

process.env; .env files and dotenv; config objects; secrets and 12-factor. Bridge to Phase 3.16.

---

## Learning Objectives

- Read configuration from process.env; set env vars in shell or .env.
- Use dotenv (or similar) to load .env into process.env for local development.
- Build a config object (port, DB URL, API key) from env with defaults where safe.
- Keep secrets out of code and .git; use .env (ignored) and .env.example (committed). Bridge to Phase 3.16.

---

## 1) process.env and .env

- [Expand: process.env.PORT, process.env.DATABASE_URL; set in shell: export PORT=3000.]
- [Expand: .env file: PORT=3000\nDATABASE_URL=...; load with require("dotenv").config() at app start.]
- [Expand: dotenv loads .env into process.env; don’t commit .env if it has secrets.]

---

## 2) Config Object

- [Expand: const config = { port: process.env.PORT || 3000, dbUrl: process.env.DATABASE_URL };]
- [Expand: validate required vars (e.g. DATABASE_URL) and fail fast if missing in production.]
- [Expand: no defaults for secrets; require them from env.]

---

## 3) Secrets and 12-Factor

- [Expand: config and secrets in environment; not in code; not in repo.]
- [Expand: .env.example with fake values documents what’s needed; .env in .gitignore.]
- [Expand: 12-factor app: env-specific config; one codebase; Phase 3.16 applies same in Express.]

---

## 4) Bridge to Phase 3.16

- [Expand: Express apps use process.env for PORT, NODE_ENV, DB_URL, API keys.]
- [Expand: same pattern: config object from env; dotenv in dev; validate in production.]
- [Expand: Phase 3.16: Environment and Configuration—same ideas, Express context.]

---

## Summary

- Read config from process.env; use .env + dotenv for local dev; build config object; no secrets in code.
- .env.example committed; .env ignored; validate required vars; Bridge to Phase 3.16.

---

## Bridge / Next

Next: **Chapter 2.7.12 — Node and HTTP: Raw Server**.

---

*Expansion note for ChatGPT: One config object and one .env.example snippet. Target ~150 lines.*
