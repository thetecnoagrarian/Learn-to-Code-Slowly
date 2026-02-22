# Phase 2.7 · Chapter 2.7.5: process and Buffer

process.env, process.argv, process.cwd; Buffer for binary data; encoding.

---

## Learning Objectives

- Read environment variables with process.env; pass config and secrets via env.
- Parse CLI arguments with process.argv; use process.cwd() for current working directory.
- Use Buffer for binary data (and encoding); convert to/from string with encoding.
- Avoid committing secrets; use env for ports, API keys, and DB URLs.

---

## 1) process.env

- [Expand: process.env.PORT, process.env.NODE_ENV; undefined if not set.]
- [Expand: set in shell: export VAR=value; or in .env file with dotenv (Chapter 2.7.11).]
- [Expand: never commit .env with real secrets; use .env.example as template.]

---

## 2) process.argv and process.cwd()

- [Expand: process.argv[0] = node, [1] = script path, [2]+ = your args; parse manually or use minimist/yargs.]
- [Expand: process.cwd() = directory where node was started; can change with process.chdir (rare).]
- [Expand: __dirname = script directory (module location); cwd = run location.]

---

## 3) Buffer

- [Expand: Buffer for binary data; Buffer.from(string, "utf8"); buf.toString("utf8");]
- [Expand: Buffer.alloc(n), Buffer.concat([b1, b2]); used by fs and http for binary.]
- [Expand: encoding: "utf8", "hex", "base64"; default in many APIs is "utf8".]

---

## 4) Encoding and Security

- [Expand: always specify encoding when reading text (fs, http) to get string not Buffer.]
- [Expand: Buffer and secrets: avoid putting secrets in Buffers in logs; clear if sensitive.]
- [Expand: Bridge: env for config; Phase 3.16 uses process.env for Express config.]

---

## Summary

- process.env for config; process.argv for CLI args; process.cwd() for current directory.
- Buffer for binary; use encoding for string conversion; keep secrets out of code and logs.

---

## Bridge / Next

Next: **Chapter 2.7.6 — Event Loop and Non-Blocking I/O**.

---

*Expansion note for ChatGPT: One argv example and one Buffer example. Target ~150 lines.*
