# Phase 2.7 · Chapter 2.7.2: Running Node and the REPL

node script.js; REPL; exit codes; environment (NODE_ENV).

---

## Learning Objectives

- Run a script with node script.js; run with ESM or flags as needed.
- Use the REPL for quick experiments; .exit and Ctrl+D/Ctrl+C.
- Understand exit codes (0 = success; non-zero = failure) and process.exit().
- Use NODE_ENV (development vs production) for environment-specific behavior.

---

## 1) Running Scripts

- [Expand: node script.js; node path/to/script.js; node --experimental-modules or "type":"module" for ESM.]
- [Expand: shebang #!/usr/bin/env node for executable scripts on Unix.]
- [Expand: node -e "code" for one-liners.]

---

## 2) The REPL

- [Expand: run node with no file; type expressions, see results; _ holds last result.]
- [Expand: .exit or Ctrl+D to exit; Ctrl+C to cancel line.]
- [Expand: .load file.js to run a file in REPL context.]

---

## 3) Exit Codes

- [Expand: process.exit(0)—success; process.exit(1) or non-zero—failure; shell and scripts use this.]
- [Expand: uncaught exception exits with non-zero; process.exitCode = 1 to set without exiting immediately.]
- [Expand: important for CLI tools and CI.]

---

## 4) NODE_ENV

- [Expand: process.env.NODE_ENV—often "development" or "production"; set before starting Node.]
- [Expand: export NODE_ENV=production; or NODE_ENV=production node app.js.]
- [Expand: Express and others use it for logging, caching, and error detail (Phase 3.16).]

---

## Summary

- Run scripts with node script.js; use REPL for experiments; exit codes for success/failure; NODE_ENV for environment.

---

## Bridge / Next

Next: **Chapter 2.7.3 — Built-in Modules: path and fs**.

---

*Expansion note for ChatGPT: Expand; include one run command and one NODE_ENV example. Target ~150 lines.*
