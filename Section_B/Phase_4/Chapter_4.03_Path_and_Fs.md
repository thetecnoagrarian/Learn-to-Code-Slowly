# Section B Phase 4 · Chapter 4.03: Built-in Modules — path and fs

Chapter 4.02 showed you how to run Node scripts and use the REPL. Once your script runs, it often needs to work with files: read a config file, write a log, or resolve paths to data next to your script. Node provides two core modules for that: **path** (building and parsing file paths in a cross-platform way) and **fs** (reading and writing the file system). This chapter introduces both. You will use `path.join` and `path.resolve` so paths work on Windows and Unix, and you will use `fs.readFile` and `fs.writeFile`—preferably via `fs.promises` and `async/await`—so file I/O does not block the event loop. By the end, you can reliably load config or data from disk and write output, which is the basis for many homestead and server scripts.

## Learning Objectives

By the end of this chapter, you should be able to:

- Use the **path** module to build and parse paths: `path.join`, `path.resolve`, `path.basename`, `path.dirname`, `path.extname`.
- Use **__dirname** (CommonJS) or `import.meta.url` (ESM) to get the directory of the current module and build paths relative to it.
- Read and write files with **fs**: `fs.readFile` and `fs.writeFile`, with encoding (e.g. `"utf8"`) for text.
- Prefer **async** file APIs (callbacks or `fs.promises`) over sync versions in server or long-running code; know when sync is acceptable (CLI scripts, startup).
- Use **fs.promises** (e.g. `import fs from "fs/promises"`) for Promise-based file operations with `async/await`.
- Avoid hardcoding path separators (`/` or `\`); use the path module so code works on different operating systems.

## Key Terms

- **path**: Node’s built-in module for working with file paths. It provides `join`, `resolve`, `basename`, `dirname`, `extname`, and others so you can build and parse paths without assuming Windows vs Unix separators.
- **fs**: Node’s built-in module for the file system. It provides `readFile`, `writeFile`, `readFileSync`, `writeFileSync`, and many other operations. The callback-based and sync APIs live on `require("fs")`; the Promise-based API is in `fs/promises`.
- **__dirname**: In CommonJS, the absolute path of the directory containing the current module file. Used with `path.join(__dirname, "relative", "file.txt")` to resolve files relative to the script.
- **fs.promises**: The Promise-based API for fs. You get it via `require("fs").promises` or `import fs from "fs/promises"`. It exposes the same operations (e.g. `readFile`, `writeFile`) but returns Promises, so you can use `async/await`.

---

## 1) Why Paths and Files Matter in Node

In the browser, JavaScript usually cannot read or write arbitrary files on the user’s disk; security restrictions prevent that. In Node, your script runs with the permissions of the user who started it, so it can read and write files. That makes Node well suited for:

- **Config and data files**: A server or CLI tool reads `config.json` or `data.csv` from disk.
- **Logs and output**: A script writes results to a file or appends to a log.
- **Homestead examples**: A small service reads sensor data from a file written by another process, or writes a daily report next to the script.

To do any of that, you need two things: **correct paths** (so you point at the right file on Windows, macOS, and Linux) and **file APIs** (so you read and write without blocking the event loop). The path module solves the first; the fs module solves the second.

---

## 2) The path Module

Node’s **path** module is a built-in. You do not install it; you only load it:

```javascript
const path = require("path");
// or in ESM: import path from "path";
```

It has no side effects; it just provides functions that work on path strings. Path separators differ by OS: Windows uses `\`, Unix (macOS, Linux) uses `/`. The path module uses the correct separator for the current platform and normalizes path segments (e.g. handling `..` and `.`).

### 2.1 path.join(...segments)

`path.join` takes one or more path segments and joins them with the platform’s separator. It also normalizes the result (resolves `.` and `..`).

```javascript
const path = require("path");

path.join("dir", "sub", "file.txt");   // e.g. "dir/sub/file.txt" on Unix
path.join("data", "..", "config.json"); // same as "config.json" in "data"'s parent
```

Use `path.join` whenever you are building a path from pieces (e.g. a directory name and a file name). Do not concatenate strings with `"/"` or `"\\"`; that breaks on the other OS.

### 2.2 path.resolve(...segments)

`path.resolve` produces an **absolute** path. It processes segments from left to right, and if the result is not yet absolute, it prepends the current working directory (`process.cwd()`).

```javascript
path.resolve("data", "config.json");        // absolute path to data/config.json under cwd
path.resolve("/home", "app", "data.json");  // on Unix: /home/app/data.json
```

So: use `path.join` when you want a path that might be relative or absolute depending on what you pass; use `path.resolve` when you want a final absolute path, often for passing to `fs` or for logging.

### 2.3 __dirname and Paths Relative to the Script

When you run `node path/to/script.js`, the **current working directory** is the directory you were in when you ran `node`, not the directory where `script.js` lives. So a path like `"config.json"` or `"./data.json"` is resolved relative to the cwd. If you want a path relative to the **script file** (e.g. “config in the same directory as this script”), you need the script’s directory.

In **CommonJS** (Node with `require`), every module has **__dirname**: the absolute path of the directory containing that module file.

```javascript
const path = require("path");

// config.json next to this script
const configPath = path.join(__dirname, "config.json");

// or one level up from this script
const parentConfig = path.join(__dirname, "..", "config.json");
```

So: `path.join(__dirname, "data.json")` always points to `data.json` in the same directory as the current module, no matter where you ran `node` from. That is the standard pattern for config and data files that live next to your code.

In **ES modules** (Node with `"type": "module"` and `import`), there is no `__dirname`. You derive the same thing from `import.meta.url`:

```javascript
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "config.json");
```

The curriculum uses both styles in examples; the idea is the same: get the script’s directory, then join with a relative path.

### 2.4 path.basename, path.dirname, path.extname

These functions **parse** a path string:

- **path.basename(path)** — the last part (file name including extension). Example: `path.basename("/home/user/data.json")` → `"data.json"`.
- **path.dirname(path)** — the directory part. Example: `path.dirname("/home/user/data.json")` → `"/home/user"`.
- **path.extname(path)** — the extension including the dot. Example: `path.extname("data.json")` → `".json"`.

They are useful when you receive a path from the user or from another module and need to change the name or extension, or to log “which file” without printing the full path. Two other helpers you may see are **path.normalize(path)**, which collapses redundant separators and `..` segments into a cleaner path, and **path.relative(from, to)**, which returns the relative path from one absolute path to another (e.g. for logging or for building relative links). For most scripts, join, resolve, dirname, basename, and extname are enough. If you need to build a path from a user-provided filename, use path.join with a fixed base directory and the filename (or sanitize the filename) to avoid path traversal (e.g. someone passing `../../../etc/passwd`); the path module does not validate that the result is inside your app directory.

---

## 3) The fs Module — Reading and Writing Files

Node’s **fs** module provides file system operations. You load it with `require("fs")` or `import fs from "fs"`. This section focuses on reading and writing whole files; later chapters or advanced material may cover streams and other APIs.

### 3.1 fs.readFile(path, options, callback) and fs.writeFile(path, data, options, callback)

The **callback-based** API is the classic Node style:

- **fs.readFile(path, options, callback)**  
  - `path` can be a string or a Buffer (e.g. from path.join).  
  - `options` can be an object with `encoding` (e.g. `"utf8"`) or you can pass `"utf8"` as the second argument. If you omit encoding, you get a **Buffer** (raw bytes).  
  - `callback(err, data)` is called when the read finishes. On success, `data` is the file contents (string if encoding was set, else Buffer); on error, `err` is set.

- **fs.writeFile(path, data, options, callback)**  
  - `data` is a string or Buffer.  
  - `options` can include `encoding` (default `"utf8"` for strings), `mode`, `flag` (e.g. `"a"` for append).  
  - `callback(err)` is called when the write finishes.

Example: read a JSON config file as text, then write a log file.

```javascript
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config.json");

fs.readFile(configPath, "utf8", (err, text) => {
  if (err) {
    console.error("Failed to read config:", err.message);
    process.exit(1);
  }
  const config = JSON.parse(text);
  const logPath = path.join(__dirname, "out.log");
  const line = `${new Date().toISOString()} started with port ${config.port}\n`;
  fs.writeFile(logPath, line, { flag: "a" }, (err) => {
    if (err) console.error("Failed to write log:", err.message);
  });
});
```

Always check `err` in callbacks. For text files, pass `"utf8"` (or `{ encoding: "utf8" }`) so you get a string instead of a Buffer.

### 3.2 Sync Versions: readFileSync and writeFileSync

fs also provides synchronous versions: **fs.readFileSync** and **fs.writeFileSync**. They block the event loop until the operation completes. That is acceptable in small CLI scripts or during startup when you need a value before continuing, but in a server or any long-running process they can cause latency and block other requests. Prefer async (callbacks or Promises) for file I/O in servers.

```javascript
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config.json");
const text = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(text);
```

Use sync only when you have a good reason (e.g. a one-off script or loading config once at startup).

### 3.3 Encoding and Options

- For **text**, always pass an encoding so you get a string: `fs.readFile(path, "utf8", callback)` or `fs.readFileSync(path, "utf8")`.
- For **binary** data, omit encoding and you get a Buffer.
- For **append** instead of overwrite: `fs.writeFile(path, data, { flag: "a" }, callback)`.

When you omit encoding, `readFile` returns a Buffer. Buffers are useful for binary data (images, binary config). For text, passing `"utf8"` is simpler and avoids calling `.toString("utf8")` yourself. When writing, if you pass a string, Node uses UTF-8 by default; if you pass a Buffer, it writes the raw bytes. For append mode, use `{ flag: "a" }` so each write adds to the end of the file instead of replacing it—handy for log files.

---

## 4) fs.promises — Promise-Based File API

Callback-based fs works, but it leads to nested callbacks when you chain several operations. Node provides a Promise-based API on **fs.promises** (or the `fs/promises` module) so you can use **async/await** and keep code linear.

### 4.1 Loading fs.promises

CommonJS:

```javascript
const fs = require("fs").promises;
// or: const fs = require("fs/promises");
```

ESM:

```javascript
import fs from "fs/promises";
```

### 4.2 readFile and writeFile with async/await

The method names are the same; they return Promises:

```javascript
const fs = require("fs").promises;
const path = require("path");

async function loadConfig() {
  const configPath = path.join(__dirname, "config.json");
  const text = await fs.readFile(configPath, "utf8");
  return JSON.parse(text);
}

async function main() {
  try {
    const config = await loadConfig();
    console.log("Port:", config.port);
  } catch (err) {
    console.error("Failed to load config:", err.message);
    process.exit(1);
  }
}

main();
```

Writing is the same pattern:

```javascript
await fs.writeFile(logPath, line, { flag: "a" });
```

Use try/catch around await so file-not-found and permission errors are handled instead of becoming unhandled rejections. Prefer `fs.promises` (or `fs/promises`) in new code so you can use async/await consistently with Phase 3 habits. One more detail: when you read a file that might not exist, catch the rejection and check `err.code`. For example, if (err.code === "ENOENT") { /* file missing, use defaults or exit */ } else { throw err; }. That way you can distinguish “config not found” from “permission denied” or “path is a directory” and give the user a clear message or a sensible default.

---

## 5) Portability and Path Best Practices

### 5.1 Do Not Hardcode Separators

Windows uses `\`, Unix uses `/`. If you write:

```javascript
const file = "data" + "/" + "config.json";
```

it often works on Unix but is brittle. Use:

```javascript
const file = path.join("data", "config.json");
```

so Node chooses the right separator and normalizes the path.

### 5.2 Prefer Paths Relative to the Script When It Matters

If your script expects `config.json` to be next to it, use `path.join(__dirname, "config.json")` (or the ESM equivalent). Then it does not matter which directory the user ran `node` from. If instead you use `"config.json"` or `path.join(process.cwd(), "config.json")`, the file must be in the current working directory, which can surprise users who run the script from another folder.

### 5.3 Homestead Example: Config and Data Next to the Script

A small Node service might live in a project folder with this layout:

```
project/
  server.js
  config.json
  data/
    readings.json
```

In `server.js` you might do:

```javascript
const path = require("path");
const fs = require("fs").promises;

const configPath = path.join(__dirname, "config.json");
const dataPath = path.join(__dirname, "data", "readings.json");

async function start() {
  const configText = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(configText);
  // use config.port, config.apiKey, etc.
}
```

So: same pattern—__dirname plus path.join—for both config and data files. That keeps paths correct whether you run `node server.js` from `project/` or from elsewhere with `node path/to/project/server.js`.

### 5.4 Checking If a File Exists

Sometimes you want to branch behavior on “does this file exist?” The classic callback API has `fs.exists`, but it is deprecated and not recommended. The usual approach is to **try the operation and handle the error**: call `fs.readFile` (or `fs.promises.readFile`) and in the catch block check `err.code === "ENOENT"`. That avoids a race (the file could be deleted between “exists” and “read”) and keeps code simple. For sync one-off scripts, `fs.existsSync(path)` returns a boolean; use it only when you truly need a synchronous check (e.g. a CLI that refuses to overwrite unless a flag is set). In server or async code, prefer “read and handle ENOENT.”

### 5.5 Homestead Example: Reading a Sensor Log

Suppose an ESP32 or another process writes a simple log file, one JSON line per reading, to `data/sensor-log.txt` next to your Node script. You want to read the last few lines to display on a dashboard or to decide whether to send an alert. You can use path and fs like this: resolve the path with `path.join(__dirname, "data", "sensor-log.txt")`, then `await fs.readFile(logPath, "utf8")`. Split the result with `text.split("\n").filter(Boolean)` to get lines, then take the last N and parse each with `JSON.parse`. If the file does not exist yet (ENOENT), handle it by returning an empty array or a default value. All of this uses only path and fs; no HTTP yet. Later, when you add an HTTP server (Chapter 4.04), you can serve this data as JSON or render it in HTML. The pattern is the same: path.join(__dirname, …) for location, fs.promises for async read, and clear error handling. Many Node scripts follow this “resolve path → read/write with fs → handle errors” pattern; once it is automatic, you can focus on what to do with the data rather than fighting paths or blocking the event loop.

---

## 6) What Breaks When You Ignore path and fs Conventions

If you hardcode paths with `/` or `\`, your script may work on your machine and fail on someone else’s (or in CI). Use the path module so one codebase works everywhere. If you assume the current working directory is the script’s directory, scripts break when users run `node` from a different folder (e.g. `node ../../app/server.js`). Resolve config and data paths from `__dirname` (or the ESM equivalent) so they are stable. If you use sync fs calls in a server, a single slow disk or a large file can block the entire process and delay or drop requests; prefer async. If you forget to pass `"utf8"` when reading a text file, you get a Buffer and operations like `JSON.parse(data)` or `data.split("\n")` can fail or behave oddly; always pass encoding for text. If you do not handle ENOENT or other fs errors, a missing config file or wrong path produces a cryptic stack trace instead of a clear “Config file not found at …” message. If you mix CommonJS and ESM in the same file, Node will throw; stick to one module system per file and use the matching way to get the script directory. Taking a few minutes to use path.join, __dirname, fs.promises, and error handling avoids a lot of “works on my machine” and production surprises.

---

## 7) Error Handling and Edge Cases

### 7.1 File Not Found and Other Errors

`fs.readFile` (and fs.promises `readFile`) will reject or call back with an error if the file does not exist, if permissions are missing, or if the path is wrong. Always handle errors:

```javascript
try {
  const text = await fs.readFile(configPath, "utf8");
  // ...
} catch (err) {
  if (err.code === "ENOENT") {
    console.error("Config file not found:", configPath);
  } else {
    console.error("Error reading config:", err.message);
  }
  process.exit(1);
}
```

ENOENT means “no such file or directory.” Other codes (EACCES, EISDIR, etc.) indicate permissions or type mismatches; handle them as needed for your script.

### 7.2 JSON.parse After readFile

When you read a JSON file, you get a string. Parsing can throw if the file is not valid JSON. So validate or catch:

```javascript
let config;
try {
  config = JSON.parse(text);
} catch (e) {
  console.error("Invalid JSON in config file");
  process.exit(1);
}
```

Phase 3 validation habits apply: validate at the boundary and fail fast with a clear message.

---

## 8) Checklist

Before moving on, you should be able to:

1. **Build a path** with `path.join` and `path.resolve`, and avoid string-concatenating with `"/"` or `"\\"`.
2. **Get the script’s directory** with `__dirname` (CommonJS) or `import.meta.url` + `path.dirname` (ESM), and use it with `path.join` to locate config or data files.
3. **Read a text file** with `fs.readFile(path, "utf8", callback)` or `await fs.readFile(path, "utf8")` from `fs.promises`.
4. **Write a text file** with `fs.writeFile` (callback or Promise), and use `{ flag: "a" }` when you need to append.
5. **Prefer async** (callbacks or fs.promises) over sync in any code that might run in a server or long-running process.
6. **Handle errors** from fs (e.g. ENOENT) and from JSON.parse when reading config.

---

## Common Pitfalls

- **Hardcoding path separators**: Using `"dir/file.txt"` or `"dir\\file.txt"` instead of `path.join("dir", "file.txt")` leads to bugs on the other OS.
- **Assuming cwd is the script directory**: Using `"config.json"` or `process.cwd()` when the file is next to the script. Use `path.join(__dirname, "config.json")` so it works regardless of where `node` was started.
- **Forgetting encoding**: Calling `readFile` without `"utf8"` and then using the result as text. You get a Buffer; either pass `"utf8"` or call `buffer.toString("utf8")`.
- **Using sync in server code**: Using `readFileSync`/`writeFileSync` in a request handler or long-running process, which blocks the event loop. Prefer async.
- **Ignoring fs errors**: Not checking `err` in callbacks or not catching rejections from fs.promises. File operations can fail; handle ENOENT and other codes.
- **Mixing __dirname and ESM**: In ESM there is no `__dirname`; use `import.meta.url` and `fileURLToPath` + `path.dirname` to get the script directory.

---

## Practice: Try These

1. Create a small script that uses `path.join(__dirname, "data", "hello.txt")` and `fs.promises.writeFile` to write the string `"Hello from Node"` into `data/hello.txt` (create the `data` folder if needed). Run the script and confirm the file appears. Then use `fs.promises.readFile` to read it back and `console.log` the result.
2. Add a `config.json` next to the script with something like `{ "name": "my-app", "port": 3000 }`. Read it with `fs.readFile(..., "utf8")` (or fs.promises), parse with `JSON.parse`, and print `config.port`. Intentionally break the JSON (e.g. remove a comma) and add a try/catch so your script prints a clear error instead of crashing.
3. Use `path.basename`, `path.dirname`, and `path.extname` on a few paths (e.g. `"/home/user/project/data.json"` and `"report.csv"`) and log the results so you see how parsing works.
4. In the REPL, run `const path = require("path"); path.join("a", "b", "c")` and `path.resolve("a", "b")` and note the difference. Then try `path.join(__dirname, "x")` in a small script and log the value so you see an absolute path based on the script’s location.

These exercises lock in path + fs and error handling before you add HTTP in the next chapter. If you run into “Cannot find module” when requiring `path` or `fs`, remember they are built in: you do not run `npm install` for them. If you run into “ENOENT” when you expected a file, double-check the path (e.g. log `path.join(__dirname, "data", "file.txt")` and confirm that path exists on disk). If you run into “EACCES” (permission denied), the user running Node may not have read or write permission for that path; fix permissions or choose a different directory.

---

## Summary

The **path** module gives you cross-platform path building and parsing: use `path.join` and `path.resolve` for paths, and `path.basename`, `path.dirname`, and `path.extname` to take paths apart. Use **__dirname** (CommonJS) or `import.meta.url` (ESM) to get the script’s directory and then `path.join(__dirname, "file.json")` so config and data paths stay correct no matter where you run Node.

The **fs** module lets you read and write files. Prefer the **async** API: callbacks or, better, **fs.promises** with `async/await`. Always pass an encoding (e.g. `"utf8"`) for text files and handle errors (ENOENT, JSON parse). Avoid sync APIs in server or long-running code. Use path for every path you build so your code runs on Windows and Unix; use __dirname (or the ESM equivalent) when files must live next to the script. With path and fs you can reliably load config and data from disk and write output, which is the foundation for the next chapters and for real Node scripts on the homestead or server.

---

## Next

Next: **Chapter 4.04: Built-in Modules — http and Streams**. That chapter introduces Node’s **http** module for creating servers and making requests, and the idea of streams for handling large or continuous data. You will use the same path and fs skills to serve files or read request bodies, and start building small HTTP services.
