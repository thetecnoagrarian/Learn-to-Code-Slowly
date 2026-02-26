# Section B Phase 4 · Chapter 4.11: Environment and Configuration in Node

Chapters 4.02 and 4.05 introduced **process.env** and using it for **NODE_ENV** and **PORT**. Chapter 4.10 showed how to load and validate JSON config files. This chapter ties those together: **environment variables** as the primary source of configuration (especially for secrets and environment-specific values), **.env** files and the **dotenv** pattern for local development, and a **config object** that you build from env (and optionally from JSON) with validation and sensible defaults. You will keep secrets out of code and the repo, document required variables with **.env.example**, and fail fast when required config is missing. The same patterns apply whether you use raw Node (http) or a framework like Express later.

## Learning Objectives

By the end of this chapter, you should be able to:

- Read configuration from **process.env** and know how to set env vars in the shell (and in **.env** for local dev).
- Use **dotenv** (or a similar approach) to load a **.env** file into **process.env** at app startup, and understand that **.env** should not be committed when it contains secrets.
- Build a **config object** (e.g. port, database URL, API key) from env with defaults where safe, and **validate** required variables so the app fails fast with a clear message when something is missing.
- Apply **12-factor** style: config in the environment; one codebase; no secrets in code or repo; **.env.example** (committed) to document what to set; **.env** in **.gitignore**.
- Combine env with optional JSON config (e.g. load **config.json** for non-secret defaults and override or fill in from **process.env**).

## Key Terms

- **process.env**: The object in Node that holds environment variables (key-value pairs) passed to the process by the shell or the system. All values are strings (or **undefined** if not set). You read them at runtime (e.g. **process.env.PORT**, **process.env.NODE_ENV**).
- **.env file**: A text file (often in the project root) that lists environment variables in **KEY=value** form, one per line. Not part of the Node standard; tools like **dotenv** read it and set **process.env** before your app runs. Used for local development so you do not export variables manually in the shell.
- **dotenv**: A small npm package that loads a **.env** file and assigns its key-value pairs to **process.env**. You typically call **require("dotenv").config()** (or **config({ path: ".env" })**) at the very start of your app so env vars are available before any other code reads them.
- **Config object**: A single object (e.g. **config**) that your app uses for settings. You build it once at startup from **process.env** (and optionally from a JSON file), validate required fields, apply defaults where safe, and then use **config.port**, **config.dbUrl**, etc. everywhere instead of reading **process.env** scattered across the codebase.

---

## 1) Why Configuration Lives in the Environment

Your Node app may need different settings in different contexts: a different **PORT** or **DATABASE_URL** on your laptop vs on a server, or different API keys for development vs production. **Hardcoding** these in code is brittle and dangerous (secrets in the repo, different behavior only by changing code). The standard approach is to keep **configuration in the environment**: the process receives variables (e.g. **PORT**, **NODE_ENV**, **DATABASE_URL**) when it starts, and your code reads them from **process.env**. The same codebase can then run anywhere; only the environment (or a **.env** file that sets it) changes. This is the core of the **12-Factor App** config factor: “Store config in the environment.”

---

## 2) process.env — Reading and Setting

### 2.1 Reading in Code

In Node, **process.env** is an object. Keys are variable names; values are strings (or **undefined** if the variable is not set). Example:

```javascript
const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV;
```

If **PORT** was not set, **port** is **undefined**. You often want a number and a fallback: **const port = parseInt(process.env.PORT, 10) || 3000;** and then validate (e.g. **Number.isNaN(port)** or **port < 1 || port > 65535**) so invalid values do not slip through. All values from **process.env** are strings; convert and validate as needed (Chapter 4.02, 4.05).

### 2.2 Setting in the Shell

Before starting Node, you set variables in the shell so they are in the process environment. On macOS/Linux (bash, zsh):

```bash
export PORT=3000
export NODE_ENV=production
node index.js
```

Or in one line: **NODE_ENV=production node index.js**. On Windows PowerShell: **$env:PORT=3000; node index.js**. On Windows cmd: **set PORT=3000** then **node index.js**. The process started by **node** will see **process.env.PORT** and **process.env.NODE_ENV**. So “setting” config means setting it **before** you run **node**, not inside your script (you can assign **process.env.X = "y"** in code, but that is uncommon for app config; usually you set it in the shell or via **.env**).

---

## 3) .env Files and dotenv

Typing **export PORT=3000** every time you run the app is tedious. For **local development**, many projects use a **.env** file in the project root: a text file with lines like **KEY=value**, no quotes unless the value contains spaces. Example:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://localhost:5432/mydb
API_KEY=dev-key-do-not-use-in-production
```

This file is **not** read by Node automatically. You use a small library such as **dotenv** to load it. Install with **npm install dotenv**, then at the **very start** of your application (e.g. the first line of **index.js** or your main entry), call:

```javascript
require("dotenv").config();
```

**dotenv** reads the **.env** file (from the current working directory by default), parses **KEY=value** lines, and sets **process.env.KEY = value**. After that, any code that runs later will see those values in **process.env**. So the flow is: **node index.js** → **dotenv.config()** runs first → **.env** is loaded into **process.env** → rest of your app runs and reads **process.env.PORT**, etc. If **.env** does not exist, **dotenv** does nothing (no error); **process.env** keeps whatever was set in the shell. You can pass a path: **require("dotenv").config({ path: path.join(__dirname, ".env.production") });** if you use different env files for different environments. Some projects use **.env.local** or **.env.development** and choose the file based on **NODE_ENV**; the default **.env** is usually enough for local dev. The **path** option is relative to the current working directory unless you pass an absolute path (e.g. **path.join(__dirname, ".env")** so the file is next to the script).

### 3.1 Do Not Commit .env When It Has Secrets

The **.env** file often contains **secrets** (API keys, database passwords). You must **not** commit it to version control. Add **.env** to **.gitignore**. Everyone on the team (and every environment) has their own **.env** or sets variables in the shell. So: **.env** is for local overrides and is git-ignored; the **shell** or the **deployment platform** (e.g. Heroku, Railway, your server’s systemd or Docker env) sets variables in production.

### 3.2 .env.example — Document Required Variables

Commit a file **.env.example** that lists the **names** of variables your app expects, with **placeholder or fake values** (or empty). Example:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://user:password@localhost:5432/dbname
API_KEY=your-api-key-here
```

This file documents “what to set” without exposing real secrets. New developers (or you on a new machine) copy **.env.example** to **.env**, fill in real values locally, and run the app. **.env.example** is committed; **.env** is not.

---

## 4) Building a Config Object

Instead of reading **process.env.PORT** and **process.env.DATABASE_URL** in many places, build a **single config object** at startup. That gives you one place to set defaults, validate, and convert types.

### 4.1 Simple Config Object

```javascript
require("dotenv").config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
};
```

Use **config.port**, **config.dbUrl**, etc. everywhere. Defaults (e.g. **3000** for port, **"development"** for NODE_ENV) are safe because they are not secret and work for local dev. For **dbUrl** and **apiKey**, you usually do **not** default: if they are required in production, you want the app to fail when they are missing rather than run with **undefined**.

### 4.2 Validating Required Config

After building the config object, validate required variables and **fail fast**:

```javascript
function validateConfig() {
  const required = ["DATABASE_URL"];
  if (process.env.NODE_ENV === "production") {
    required.push("API_KEY");
  }
  for (const key of required) {
    if (!process.env[key] || process.env[key].trim() === "") {
      console.error(`Missing required environment variable: ${key}`);
      process.exit(1);
    }
  }
}

require("dotenv").config();
validateConfig();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
};
```

So: load **dotenv** first, then validate, then build **config**. If something is missing, the process exits with a clear message. That is much easier to debug than “Cannot read property of undefined” later in the code. You can validate types as well: e.g. **if (Number.isNaN(config.port) || config.port < 1 || config.port > 65535) { console.error("PORT must be a number between 1 and 65535"); process.exit(1); }**. That way invalid values (e.g. **PORT=abc**) are caught at startup instead of causing odd behavior when the server tries to listen.

### 4.3 No Defaults for Secrets

Do not default **API_KEY**, **DATABASE_URL**, or any secret to a “dev” value in code (e.g. **process.env.API_KEY || "dev-key"**). If you do, a production deploy that forgets to set the variable might run with the dev key. Require secrets from the environment and fail if they are missing (or allow them only in **NODE_ENV=development** with an explicit check and warning). Non-secret defaults (port, NODE_ENV) are fine.

---

## 5) Combining Env and JSON Config

Some projects use both: a **config.json** (or **config.production.json**) for non-secret, structured config (e.g. feature flags, list of regions), and **process.env** for secrets and environment-specific overrides (port, DB URL, API key). Pattern: load **dotenv** first, then optionally load **config.json** with **fs** and **JSON.parse**, then build the final config by merging: env overrides JSON, and validate required env vars. Example shape:

```javascript
require("dotenv").config();

let fileConfig = {};
try {
  const path = require("path");
  const fs = require("fs").promises;
  const text = await fs.readFile(path.join(__dirname, "config.json"), "utf8");
  fileConfig = JSON.parse(text);
} catch (e) {
  // config.json optional; ignore if missing
}

const config = {
  port: parseInt(process.env.PORT, 10) || fileConfig.port || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  apiKey: process.env.API_KEY,
  ...fileConfig,
};
// env overrides: config.apiKey = process.env.API_KEY ?? config.apiKey;
```

Then validate **config** (required keys, types). This keeps secrets in env only and non-secret structure in JSON if you prefer. When merging, be explicit about precedence: e.g. **config.port = process.env.PORT ? parseInt(process.env.PORT, 10) : (fileConfig.port ?? 3000)** so env always wins over file, and file over the default. The curriculum keeps the “config object from env + validate” pattern as the core; adding JSON is optional. When you load JSON config, use try/catch around **fs.readFile** and **JSON.parse** (Chapter 4.10); if the file is optional, ignore “file not found” and use env-only config.

### 5.1 NODE_ENV and Branching

**NODE_ENV** is conventionally **"development"**, **"production"**, or **"test"**. You use it to branch behavior: in development you might allow missing **API_KEY** or use a mock; in production you require it and exit if missing. So validation logic often depends on **process.env.NODE_ENV**. Set **NODE_ENV** in the shell or **.env**; do not default it in code to **"production"** (that would be unsafe). Many deployment platforms set **NODE_ENV=production** automatically; locally you set **NODE_ENV=development** in **.env** or when running **node**.

---

## 6) Secrets and 12-Factor

- **Secrets** (passwords, API keys, private keys) must **never** be in source code or in the repo. Use **process.env** (set by the shell, deployment platform, or **.env** locally). Add **.env** to **.gitignore** and commit **.env.example** with placeholders.
- **12-Factor** “Config” factor: store config in the environment; the app reads **process.env**; there are no config files that differ per environment in the repo (or if there are, they contain no secrets). One codebase, many deployments; only the environment changes. This matches what we did above: **dotenv** for local **.env**, and in production the platform or ops sets env vars.
- **Validation**: Require critical variables and exit with a clear error if they are missing. That avoids running in a half-configured state.

### 6.1 Bridge to Express and Other Frameworks

When you use **Express** or similar frameworks later, the same ideas apply: read **process.env** for **PORT**, **NODE_ENV**, database URLs, and API keys; use **dotenv** in development; build a config object and validate at startup. Express does not replace **process.env**; it just runs your code in a request-handler context. So the config pattern you learn here (env → config object → validate) carries over. Some frameworks have their own config loading (e.g. **next.config.js**); the principle “config in the environment, secrets never in code” still holds.

---

## 7) Where to Load dotenv

Call **require("dotenv").config()** as early as possible: typically the **first** line of your main entry file (or the first line after any other env setup). If your app is launched by a tool that already loads **.env** (e.g. some test runners or CLI wrappers), you may not need to call **dotenv** yourself; in a plain **node index.js** setup, calling it at the top is the standard. If you load it after some code has already read **process.env**, that code will have seen the old (unloaded) values. So order is: **dotenv** → validate → build config → rest of app. Some frameworks (e.g. Create React App, Next.js) have their own way to load **.env**; in a plain Node app, **require("dotenv").config()** at the top is the standard approach.

---

## 8) What Breaks When You Ignore Config Conventions

If you hardcode secrets in code and commit them, they are in the repo forever (even if you delete them later, history remains). If you commit **.env** with real keys, anyone with repo access can see them. If you do not validate required env vars, the app may start and then fail later with a cryptic error (e.g. “undefined” when connecting to the DB). If you load **dotenv** after reading **process.env**, early code will not see the **.env** values. If you default secrets to a dev value, production might run with that value by mistake. If you scatter **process.env.PORT** and **process.env.DATABASE_URL** all over the codebase, changing where config comes from (e.g. adding a config file) requires many edits. Centralizing in a config object and validating once at startup avoids these problems. On deployment platforms (Heroku, Railway, Render, Docker, systemd), you typically set environment variables in the platform’s UI or config (e.g. **docker run -e PORT=3000 -e API_KEY=xxx ...**). There is no **.env** file on the server; the platform injects the variables into the process. So your code only ever reads **process.env**; where those values come from (shell, **.env** via dotenv, or platform) is an operational detail. That is why “config in the environment” scales: same code, different env per deployment.

---

## 9) Homestead Example

A small Node API for a homestead dashboard might need **PORT**, **NODE_ENV**, and an **API_KEY** (or no key in development). Create **.env.example**:

```env
PORT=3000
NODE_ENV=development
API_KEY=optional-in-dev
```

Copy to **.env**, set **API_KEY** to a real value only if needed (or leave placeholder for dev). In **index.js**:

```javascript
require("dotenv").config();

const port = parseInt(process.env.PORT, 10) || 3000;
const nodeEnv = process.env.NODE_ENV || "development";
const apiKey = process.env.API_KEY;

if (nodeEnv === "production" && !apiKey) {
  console.error("API_KEY is required in production");
  process.exit(1);
}

// use port, nodeEnv, apiKey...
```

Server listens on **port**, and in production it refuses to start without **API_KEY**. Same pattern scales to more variables (database URL, Redis URL, etc.); keep **.env.example** in sync so others know what to set. If you add a new required variable (e.g. **SENSOR_API_URL**), add it to **.env.example** with a placeholder, add it to your config object and validation, and document it in the README so deployers know to set it. On a Raspberry Pi or small server you might set env vars in a **systemd** service file (**Environment=PORT=3000**) or in a shell script that starts the app (**export PORT=3000; node index.js**); the app still just reads **process.env**.

---

## 10) Checklist

Before moving on, you should be able to:

1. Read **process.env.PORT**, **process.env.NODE_ENV**, and other variables in code and know they are strings (or **undefined**).
2. Set env vars in the shell (e.g. **export PORT=3000** or **NODE_ENV=production node index.js**) and in a **.env** file (KEY=value).
3. Use **require("dotenv").config()** at app startup so **.env** is loaded into **process.env** before any other code runs.
4. Build a **config** object from **process.env** with defaults for non-secret values (port, NODE_ENV) and no defaults for secrets.
5. Validate required variables (e.g. in production require **API_KEY** or **DATABASE_URL**) and **process.exit(1)** with a clear message when missing.
6. Keep **.env** out of the repo (**.gitignore**) and commit **.env.example** with placeholder or fake values to document required vars.
7. Explain in one sentence why config belongs in the environment (12-factor: one codebase, config via env, no secrets in code).
8. Use **NODE_ENV** to branch validation (e.g. require **API_KEY** only in production) and to branch behavior (e.g. verbose logging in development). On deployment, set env vars in the platform or process manager so the app never reads a **.env** file on the server.

---

## Common Pitfalls

- **Committing .env**: Never commit **.env** if it has real secrets. Add **.env** to **.gitignore** and use **.env.example** for documentation.
- **Loading dotenv too late**: Call **dotenv.config()** at the very start of the app so every later read of **process.env** sees the loaded values.
- **Defaulting secrets**: Do not use **process.env.API_KEY || "dev-key"** in production paths; require the variable and fail if missing.
- **Not validating**: If you assume **process.env.PORT** is set and it is not, you may get **NaN** or **undefined** and confusing bugs. Parse, default where safe, and validate required vars up front.
- **Scattering process.env everywhere**: Prefer a single config object built and validated at startup; use **config.port** etc. in the rest of the app.
- **Forgetting .env.example**: Without it, new contributors do not know which variables to set; keep it updated when you add new config.
- **Setting NODE_ENV=production in code**: Do not default **NODE_ENV** to **"production"** in your app; let the shell or deployment set it. Otherwise you might accidentally run in “production” mode locally (e.g. with minimal logging or strict checks).

---

## Practice: Try These

1. Create a **.env** file with **PORT=4000** and **NODE_ENV=development**. In a small script, run **require("dotenv").config()** at the top, then **console.log(process.env.PORT, process.env.NODE_ENV)**. Confirm you see the values. Then rename **.env** or move the script and run from another directory; confirm **dotenv** looks in the current working directory (or pass **path** to **config()**).
2. Build a **config** object that reads **PORT** (default 3000), **NODE_ENV** (default **"development"**), and **API_KEY** (no default). Add a **validateConfig** function that exits with a clear message if **API_KEY** is missing when **NODE_ENV === "production"**. Run with **NODE_ENV=production** and no **API_KEY** and confirm the process exits; set **API_KEY** and confirm the app continues.
3. Create **.env.example** with **PORT**, **NODE_ENV**, and **API_KEY** (with placeholder values). Add **.env** to **.gitignore** if not already there. Do not commit **.env**; do commit **.env.example**.
4. In a small HTTP server that uses **config.port** to listen, load **dotenv**, build **config** (with validation), then start the server. Confirm the server listens on the port from **.env** (or default). Change **PORT** in **.env** and restart; confirm the port changes.
5. (Optional) Load a **config.json** that has **{ "port": 3000 }**, then build config so **process.env.PORT** overrides **config.json**’s port. This reinforces “env overrides file” and keeps secrets in env only.

These exercises lock in the env + dotenv + config object + validation pattern before you build larger Node apps or use frameworks that rely on the same ideas. If **process.env.PORT** is set but not a number (e.g. **PORT=abc**), **parseInt** returns **NaN**; your validation should catch that and exit with “PORT must be a number.” If **dotenv** seems not to load, check that you are calling **config()** before any code that reads **process.env**, and that the script’s current working directory (or the **path** you pass) contains the **.env** file.

---

## Summary

**Configuration** in Node is best kept in the **environment**: read **process.env** for **PORT**, **NODE_ENV**, **DATABASE_URL**, **API_KEY**, etc. All values are strings (or **undefined**); parse and validate numbers and required keys at startup. Set variables in the shell or in a **.env** file; use **dotenv** to load **.env** into **process.env** at startup so local development does not require exporting vars manually. Build a **config object** once at startup with defaults for non-secret values and no defaults for secrets; validate types (e.g. port is a number) as well as presence; **validate** required variables and exit with a clear error when something is missing. Keep **.env** out of the repo (**.gitignore**) and commit **.env.example** to document what to set; update **.env.example** whenever you add a new config variable. Optionally combine with a JSON config file for non-secret structure, with env overriding file values. This 12-factor style keeps secrets out of code and lets the same codebase run in any environment. Validate types (e.g. **PORT** is a number in a valid range) as well as presence so invalid env values do not cause subtle bugs. Next, Chapter 4.12 (Node and HTTP: Raw Server) will revisit the raw **http** server and tie together what you have learned: config from env, JSON for bodies and config, and a small server that uses both.

---

## Next

Next: **Chapter 4.12: Node and HTTP — Raw Server**. That chapter revisits Node’s **http** module and builds a small raw HTTP server that uses configuration from the environment, parses JSON request bodies, and returns JSON responses. You will combine env, config validation, and the HTTP and JSON skills from this phase into one practical example.
