# Section B Phase 4 · Chapter 4.05: process and Buffer

Chapters 4.01 and 4.02 introduced the **process** object (env, argv, cwd, exit) and how to run Node. Chapter 4.04 used **Buffer** when collecting HTTP request body chunks. This chapter goes deeper: more of **process** (signals, platform, version, memory) and a full picture of **Buffer** for binary data, encoding, and conversion to and from strings. You will use process for graceful shutdown and environment detection, and Buffer whenever you work with raw bytes—file reads, HTTP bodies, or encoding schemes like base64 and hex. Understanding both keeps your Node scripts portable, safe, and clear about text vs binary.

## Learning Objectives

By the end of this chapter, you should be able to:

- Use **process.env** for configuration (and recall process.argv, process.cwd from earlier chapters); avoid hardcoding secrets and use env for ports, API keys, and URLs.
- Use **process** for lifecycle and environment: **process.on("SIGINT")** / **SIGTERM** for graceful shutdown, **process.platform** and **process.version** when behavior differs by OS or Node version.
- Create and use **Buffer**: **Buffer.from(string, encoding)**, **Buffer.alloc(n)**, **Buffer.concat([...])**, and **buf.toString(encoding)**; choose the right encoding (utf8, hex, base64) for the task.
- Explain when you get a Buffer (e.g. fs.readFile without encoding, http request chunks) vs a string (fs with "utf8", res.end with a string), and convert between them safely.
- Apply encoding and security habits: always specify encoding for text; avoid putting secrets in Buffers that get logged or serialized.

## Key Terms

- **process**: The global Node object representing the current process. It exposes **process.env**, **process.argv**, **process.cwd()**, **process.exit()**, **process.platform**, **process.version**, **process.on()** for signals and other events, and more. No require needed.
- **Buffer**: A Node class for representing a fixed-length sequence of bytes. Used for binary data (file content, network payloads). You create Buffers with **Buffer.from()**, **Buffer.alloc()**, or **Buffer.concat()**, and convert to string with **buf.toString(encoding)**. Encoding names include **"utf8"**, **"hex"**, **"base64"**.
- **Encoding**: The way bytes are interpreted as characters (or vice versa). **"utf8"** is the usual encoding for text; **"base64"** and **"hex"** are used for binary data represented as ASCII strings (e.g. in JSON or config).

---

## 1) process — Beyond env, argv, and cwd

You already use **process.env** (config, NODE_ENV, PORT), **process.argv** (CLI args), **process.cwd()** (current working directory), and **process.exit(code)** (Chapter 4.01, 4.02). Here we add the parts of **process** that matter for robust servers and scripts: signals, platform, version, and a few utilities.

### 1.1 Graceful Shutdown: SIGINT and SIGTERM

When you press **Ctrl+C** in the terminal or a process manager sends **SIGTERM**, Node will exit by default. If your server has open connections or in-flight work, you often want to **gracefully shut down**: stop accepting new requests, finish current work, then exit. You can listen for **SIGINT** (Ctrl+C) and **SIGTERM**:

```javascript
const server = require("http").createServer((req, res) => res.end("ok"));
server.listen(3000);

function shutdown() {
  console.log("Shutting down...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
```

**server.close()** stops the server from accepting new connections but allows existing requests to finish. Once the server is closed, the callback runs and you can **process.exit(0)**. Without this, Ctrl+C would kill the process immediately and in-flight responses might be cut off. For long-running servers (e.g. on a Pi or in production), graceful shutdown is a good habit.

### 1.2 process.platform and process.version

**process.platform** is a string identifying the OS: **"darwin"** (macOS), **"win32"** (Windows), **"linux"**, etc. Use it when you must branch on OS (e.g. different paths or shell commands):

```javascript
if (process.platform === "win32") {
  console.log("Running on Windows");
} else {
  console.log("Running on Unix-like system");
}
```

**process.version** is the Node version string (e.g. **"v22.3.0"**). Useful for logging or for guarding features that need a minimum version. **process.versions** gives more detail (v8, uv, etc.). You can also run **node --version** in the shell; inside code, **process.version** is what you have.

### 1.3 process.pid, process.memoryUsage, process.chdir

- **process.pid** — the process ID. Handy for logs and for writing a PID file when running as a daemon.
- **process.memoryUsage()** — returns an object with **heapUsed**, **heapTotal**, **rss**, etc. Useful for monitoring or debugging memory growth; not something you use in every script.
- **process.chdir(path)** — changes the current working directory. Rare; most code uses **process.cwd()** to read it and **path.join** to build paths. Changing cwd can confuse code that assumes cwd is stable, so use **chdir** only when you have a clear reason.

**process.exitCode** — if you set **process.exitCode = 1** (or another number), the process will exit with that code when it finishes naturally (event loop empty) instead of exiting immediately. So you can signal failure without calling **process.exit(1)** in the middle of cleanup. Useful when you want to run shutdown logic (e.g. **server.close**) and then let the process exit with the right code. Chapter 4.02 introduced **process.exit(code)** for immediate exit; **exitCode** is for “exit with this code when you are done.”

---

## 2) process.env — Config and Secrets (Recap and Depth)

**process.env** is an object whose keys are environment variable names and whose values are strings (or **undefined** if the variable is not set). You do not set it from inside Node for configuration; you set variables in the shell (or in a **.env** file loaded by a tool like **dotenv**) before starting Node. Chapter 4.02 showed how to set **NODE_ENV** and **PORT**; the same pattern applies to API keys, database URLs, and any value that should not be hardcoded.

- **Never commit real secrets** to the repo. Use **.env** for local overrides and add **.env** to **.gitignore**. Provide a **.env.example** (with placeholder names and no real values) so others know which variables are required.
- **Validate at the boundary**: if your app requires **process.env.API_KEY**, check it at startup and **process.exit(1)** with a clear message if it is missing. That avoids cryptic failures later.
- **Type**: all values from **process.env** are strings. If you need a number (e.g. port), parse it: **const port = parseInt(process.env.PORT, 10)** and validate (e.g. **Number.isNaN(port) ? 3000 : port**).

---

## 3) process.argv and process.cwd() (Recap)

**process.argv[0]** is the path to the **node** executable, **argv[1]** is the path to the script file, and **argv[2]** onward are the arguments you passed (e.g. **node script.js --port 3000** gives **argv[2] === "--port"**, **argv[3] === "3000"**). You can parse these manually or use a library (minimist, yargs) for flags and options. **process.cwd()** is the directory from which **node** was started; it does not change when you **require** a file from another directory. For paths relative to the **script** file, use **__dirname** and **path.join** (Chapter 4.03). So: **cwd** = where you ran **node**; **__dirname** = where the current module file lives.

### 3.1 Parsing argv (Minimal Example)

For a simple script that takes positional arguments (e.g. **node script.js input.txt output.txt**), you can use **process.argv.slice(2)** to get only the user args and then index them:

```javascript
const args = process.argv.slice(2);
const inputFile = args[0];
const outputFile = args[1];
if (!inputFile || !outputFile) {
  console.error("Usage: node script.js <input> <output>");
  process.exit(1);
}
```

For flags and options (e.g. **--port 3000**, **--env production**), you can loop over **argv** and parse pairs, or use a library like **minimist** or **yargs** (npm). The important point is that **argv[0]** and **argv[1]** are reserved for node and the script path; your arguments start at **argv[2]**.

---

## 4) Buffer — What It Is and When You See It

A **Buffer** is a fixed-length sequence of bytes. In JavaScript we usually work with strings (Unicode text); when you read a file without an encoding or receive HTTP body chunks, Node gives you Buffers because the data might be binary (images, binary config) or you might want to choose the encoding yourself. Many APIs accept either a string or a Buffer (e.g. **res.end**); if you pass a Buffer, Node sends the raw bytes. So Buffers appear whenever the data is “raw bytes”: **fs.readFile** without encoding, **req.on("data", chunk)** where **chunk** is a Buffer, **Buffer.concat(chunks)** to glue chunks together before **.toString("utf8")**.

---

## 5) Creating and Using Buffers

### 5.1 Buffer.from(string, encoding)

Creates a Buffer from a string using the given encoding (default **"utf8"**):

```javascript
const buf = Buffer.from("Hello", "utf8");
console.log(buf);        // <Buffer 48 65 6c 6c 6f>
console.log(buf.length); // 5
```

Other encodings: **"hex"** (two hex chars per byte), **"base64"** (Base64-encoded string). **Buffer.from("48656c6c6f", "hex")** gives the same five bytes as **Buffer.from("Hello", "utf8")**.

### 5.2 Buffer.from(arrayOrBuffer)

You can create a Buffer from an array of byte values (0–255) or from another Buffer (copy). **Buffer.from([72, 101, 108, 108, 111])** is again "Hello" in bytes.

### 5.3 Buffer.alloc(size)

Creates a Buffer of **size** bytes, filled with zeros. Use when you need a fixed-size buffer to fill (e.g. for crypto or binary protocols):

```javascript
const buf = Buffer.alloc(8);
buf.writeUInt32BE(42, 0); // write a 32-bit big-endian integer at offset 0
```

**Buffer.allocUnsafe(size)** is faster but leaves old data in memory; only use it when you will overwrite every byte and you understand the security implications. For general use, **Buffer.alloc** and **Buffer.from** are safer. If you need a copy of an existing Buffer, use **Buffer.from(otherBuffer)** to create an independent copy; assigning **const b2 = b1** does not copy the bytes, it just references the same buffer.

### 5.4 Buffer.concat(list[, totalLength])

Concatenates an array of Buffers into one. You used this in Chapter 4.04 for the request body:

```javascript
const chunks = [];
req.on("data", (chunk) => chunks.push(chunk));
req.on("end", () => {
  const body = Buffer.concat(chunks).toString("utf8");
  // ...
});
```

**Buffer.concat(chunks)** produces a single Buffer containing all chunks in order. Optional second argument **totalLength** can be used for a precomputed total size (slightly more efficient); usually you omit it.

### 5.5 Buffer Length and Indexing

A Buffer has a **length** property (number of bytes). You can read and write bytes by index: **buf[0]** is the first byte (0–255). **buf.write(string, offset, length, encoding)** writes a string into the Buffer at a given offset; **buf.readUInt8(offset)**, **buf.readUInt32BE(offset)**, etc. are used for binary protocols. For most high-level code (file content, HTTP bodies), you use **Buffer.from**, **concat**, and **toString**; the indexing and read/write methods matter when you implement or parse binary formats (e.g. custom file headers or network protocols).

---

## 6) Converting Buffer to String and Back

- **Buffer → string**: **buf.toString(encoding)**. Default encoding is **"utf8"**. Example: **buf.toString("utf8")**, **buf.toString("base64")**, **buf.toString("hex")**.
- **String → Buffer**: **Buffer.from(str, encoding)**. Same encoding names. So round-trip: **Buffer.from("Hi", "utf8").toString("utf8")** is **"Hi"**; **Buffer.from("SGk=", "base64").toString("utf8")** is **"Hi"** (Base64 for two bytes).

When you **fs.readFile** without encoding, you get a Buffer; call **buf.toString("utf8")** to get a string for JSON.parse or text handling. When you **fs.readFile(path, "utf8")**, Node does that for you and returns a string. So: specify encoding when you want strings; omit it when you want raw bytes (Buffer).

---

## 7) Encodings: utf8, hex, base64

- **utf8**: Standard encoding for Unicode text. Use it for almost all text (config files, JSON, HTML). Default in many Node APIs.
- **hex**: Each byte represented as two hexadecimal characters (0–9, a–f). Useful for logging raw bytes or for APIs that expect hex strings.
- **base64**: Binary data encoded as ASCII (A–Z, a–z, 0–9, +, /). Used in data URLs, email attachments, and sometimes in JSON when embedding binary. **Buffer.from(str, "base64")** decodes; **buf.toString("base64")** encodes.

If you receive or send binary data as a string (e.g. an API that returns a base64 image), you convert with **Buffer.from(base64String, "base64")** to get a Buffer, and **buf.toString("base64")** to send it back as a string. Node also supports **"latin1"** (one byte per character) and a few others; for cross-platform text, **"utf8"** is the default and the right choice unless you have a specific reason otherwise. When in doubt, use **"utf8"** for text and **"base64"** when you need to embed binary in JSON or a text protocol.

---

## 8) Buffer and the fs / http APIs

- **fs.readFile(path, callback)** without encoding: callback gets **(err, buffer)**. **fs.readFile(path, "utf8", callback)** gives **(err, string)**.
- **fs.promises.readFile(path)** returns a Buffer by default; **fs.promises.readFile(path, "utf8")** returns a string.
- **req.on("data", chunk)**: **chunk** is a Buffer. You **Buffer.concat(chunks)** then **.toString("utf8")** for text bodies.
- **res.end(data)**: **data** can be a string (Node uses UTF-8) or a Buffer (sent as raw bytes). So **res.end(Buffer.from("binary data"))** is valid.

Knowing whether an API returns or accepts Buffer vs string (and which encoding) avoids **TypeError** or garbled text. When you **res.end(string)** in the http module, Node encodes the string to bytes (UTF-8 by default) and sends it; when you **res.end(buffer)**, it sends the buffer’s bytes as-is. So for JSON you typically **res.end(JSON.stringify(obj))** (string); for a binary file you might **fs.createReadStream(path).pipe(res)** or **res.end(fileBuffer)**. Choosing string vs Buffer and the right encoding keeps responses correct and avoids mojibake or broken binary data. You can check whether a value is a Buffer with **Buffer.isBuffer(x)**; that is useful when you receive data from an API or another module and need to branch (e.g. if Buffer, convert to base64 for JSON; if string, use as-is).

---

## 9) Encoding and Security

### 9.1 Always Specify Encoding for Text

When reading or writing text, always pass the encoding (e.g. **"utf8"**) so you get a string and avoid treating a Buffer as a string by mistake. In fs and when converting Buffers, explicit encoding makes intent clear and avoids platform or default surprises.

### 9.2 Buffers and Secrets

Buffers can hold sensitive data (passwords, keys, tokens). Do not log them or serialize them into error messages or responses. If you must put a secret in a Buffer (e.g. for a crypto API), clear it when done if the API allows (some Buffers are immutable; overwriting is not always possible). Prefer keeping secrets in **process.env** and passing them as strings only where needed; avoid copying them into long-lived Buffers that might leak. When you log errors, avoid including **err** or response bodies that might contain secrets; log a generic message or redact sensitive fields.

### 9.3 .env and .gitignore

Keep **.env** out of version control. Use **.env.example** with fake or empty values so others know what to set. Load **.env** at startup with a library like **dotenv** (Chapter 4.11) so **process.env** is populated before your app reads config. Never commit **.env** with real keys or passwords.

---

## 10) What Breaks When You Ignore process and Buffer

If you assume **process.env.SOME_VAR** is set and do not check, the value may be **undefined** and you get confusing errors (e.g. **undefined** port or missing API key). Validate required env vars at startup. If you ignore **SIGINT**/ **SIGTERM**, your server may be killed mid-request without closing connections cleanly; add a shutdown handler for long-running servers. If you treat a Buffer as a string (e.g. **buffer + ""** or passing a Buffer where a string is expected), you may get "[object Object]" or wrong behavior—use **buf.toString("utf8")** explicitly. If you use **Buffer.allocUnsafe** and do not fill every byte, you may leak data from other parts of memory; prefer **Buffer.alloc** or **Buffer.from**. If you log a Buffer that holds a secret, the secret may appear in logs; avoid logging or serializing sensitive Buffers. If you forget that **process.env** values are always strings, using **process.env.PORT** as a number can lead to bugs (e.g. in comparisons); parse with **parseInt(process.env.PORT, 10)** and validate.

---

## 11) Homestead Example: Config and Graceful Shutdown

A small Node server that reads **PORT** from env, listens, and shuts down cleanly on Ctrl+C:

```javascript
const http = require("http");

const port = parseInt(process.env.PORT, 10) || 3000;
if (Number.isNaN(port) || port < 1 || port > 65535) {
  console.error("Invalid PORT");
  process.exit(1);
}

const server = http.createServer((req, res) => res.end("OK"));
server.listen(port, () => console.log("Listening on", port));

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
```

If you need to load a config file that might contain base64-encoded binary (e.g. a small image), you would read it as a Buffer (**fs.readFile** without encoding), then **buf.toString("base64")** to embed in JSON or **Buffer.from(str, "base64")** to decode. The same process and Buffer concepts apply: env for config, Buffer for bytes, encoding when converting.

### 11.1 Reading a Binary File

When you read a non-text file (image, PDF, binary config), do **not** pass an encoding so Node returns a Buffer:

```javascript
const fs = require("fs").promises;
const buffer = await fs.readFile(path.join(__dirname, "image.png"));
// buffer is a Buffer; you can buffer.length, buffer.toString("base64"), or send as res.end(buffer)
```

If you mistakenly pass **"utf8"**, Node will try to interpret the bytes as UTF-8 and you can get replacement characters or corrupted data. So: text files → **readFile(path, "utf8")** for a string; binary files → **readFile(path)** for a Buffer.

---

## 12) Checklist

Before moving on, you should be able to:

1. Use **process.env** for config and validate required vars; avoid hardcoding secrets.
2. Use **process.on("SIGINT")** or **SIGTERM** to shut down a server gracefully (e.g. **server.close** then **process.exit**).
3. Use **process.platform** or **process.version** when you need to branch on OS or Node version.
4. Create a Buffer with **Buffer.from(string, encoding)** or **Buffer.alloc(n)**; concatenate with **Buffer.concat(chunks)**.
5. Convert Buffer to string with **buf.toString(encoding)**; use **"utf8"** for text, **"base64"** or **"hex"** when needed.
6. Know when you get a Buffer (fs without encoding, req "data" chunks) vs a string (fs with "utf8"), and convert appropriately.
7. Avoid logging or exposing Buffers that might hold secrets; keep secrets in env and specify encoding for text.
8. Use **Buffer.isBuffer(x)** when you need to detect a Buffer (e.g. before converting to base64 for JSON); copy a Buffer with **Buffer.from(buf)** when you need an independent copy.

---

## Common Pitfalls

- **Assuming process.env is set**: Always check and validate; use a default or **process.exit(1)** with a clear message when a required var is missing.
- **Treating process.env as numbers**: Values are strings; parse **PORT** and similar with **parseInt(..., 10)** and validate.
- **Forgetting to call res.end or server.close in shutdown**: Graceful shutdown should close the server and then exit; otherwise connections can hang.
- **Mixing Buffer and string without encoding**: Use **buf.toString("utf8")** (or the right encoding) when you need a string; use **Buffer.from(str, "utf8")** when you need a Buffer. Do not rely on implicit conversion.
- **Using Buffer.allocUnsafe and not filling**: Prefer **Buffer.alloc** or **Buffer.from** unless you know you will overwrite every byte and understand the risk.
- **Logging or serializing secrets**: Do not **console.log** or send in responses any Buffer or string that holds a password, key, or token.

---

## Practice: Try These

1. Write a script that prints **process.platform**, **process.version**, **process.pid**, and **process.cwd()**. Run it and note the values on your machine.
2. Create a Buffer with **Buffer.from("Hello", "utf8")** and log **buf**, **buf.length**, and **buf.toString("utf8")**. Then try **buf.toString("hex")** and **buf.toString("base64")** and decode back with **Buffer.from(..., "hex")** and **Buffer.from(..., "base64")**.
3. Use **Buffer.concat** in a small script: create two Buffers with **Buffer.from("Hello ")** and **Buffer.from("World")**, concat them, and **.toString("utf8")** to get **"Hello World"**.
4. Add a **SIGINT** handler to the minimal HTTP server from Chapter 4.04: on **SIGINT**, call **server.close()** and in the callback **process.exit(0)**. Run the server, then press Ctrl+C and confirm it exits cleanly.
5. Read **process.env.PORT** in a script; if it is set, parse it with **parseInt** and use it (e.g. for a server port); if not set or invalid, use 3000. Log the port you are using.

These exercises lock in process and Buffer so you can use them confidently in servers and CLI tools. If **process.env.VAR** is **undefined**, confirm the variable is set in the shell (or in .env and loaded before your script runs). If a Buffer shows up as something like **<Buffer 48 65 6c 6c 6f>** in logs, that is normal; use **buf.toString("utf8")** (or the right encoding) when you need a string. If you get "Invalid character encoding" or garbled text, double-check the encoding name (e.g. **"utf8"** not **"utf-8"** in some older APIs) and that the data is actually in that encoding.

---

## Summary

**process** gives you the current Node process: env (config, secrets), argv (CLI args), cwd (working directory), exit, and—in this chapter—signals (SIGINT, SIGTERM) for graceful shutdown, **process.platform** and **process.version** for OS and Node version, **process.exitCode** for setting the exit code without exiting immediately, and **process.pid** / **memoryUsage** when needed. Use **process.env** for all configuration that should not be hardcoded; validate at startup and never commit real secrets. **Buffer** is Node’s type for raw bytes: create with **Buffer.from()**, **Buffer.alloc()**, or **Buffer.concat()**; convert to string with **buf.toString(encoding)**. Specify encoding (utf8, base64, hex) whenever you convert between string and Buffer. You see Buffers from **fs.readFile** without encoding and from **req.on("data")** chunks; use **Buffer.concat** and **.toString("utf8")** for text bodies. For binary files, omit encoding and work with the Buffer; for text, pass **"utf8"** or convert explicitly. Keep encoding explicit and secrets out of logs and Buffers. With process and Buffer under your belt, you are ready for the event loop (Chapter 4.06) and the rest of Node.

---

## Next

Next: **Chapter 4.06: Event Loop and Non-Blocking I/O**. That chapter explains how Node’s event loop schedules work: timers, I/O callbacks, and the single-threaded model. You will see why async APIs (fs, http) do not block and how to avoid blocking the main thread so your servers and scripts stay responsive.
