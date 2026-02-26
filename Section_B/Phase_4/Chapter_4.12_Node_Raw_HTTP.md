# Section B Phase 4 · Chapter 4.12: Node and HTTP — Raw Server

Chapters 4.04 (http and streams), 4.10 (JSON parse/stringify), and 4.11 (environment and config) gave you the pieces. This chapter ties them together: a **minimal raw HTTP server** in Node that uses **config from the environment**, **parses JSON request bodies**, and **returns JSON responses**. You will build one small server that responds to different routes (e.g. **GET /** and **GET /api/health**), reads **PORT** from **process.env**, and handles a **POST** body as JSON. No framework—just **http.createServer**, **req**/ **res**, and the patterns from this phase. This is the capstone of Section B Phase 4: you will see how env, config, path, fs, http, and JSON fit into one runnable example. After this, Phase 5 (Express) will add routing, middleware, and helpers on top of the same HTTP model.

## Learning Objectives

By the end of this chapter, you should be able to:

- Write a **minimal HTTP server** with **http.createServer** that listens on a port from config (e.g. **process.env.PORT**) and responds to **GET** requests with a simple body (plain text or JSON).
- Read **req.method** and **req.url**; parse the URL (e.g. with **new URL(req.url, base)**) to get **pathname** and **searchParams** for simple routing.
- Send responses by setting **res.statusCode**, **res.setHeader("Content-Type", "application/json")**, and **res.end(JSON.stringify(...))**; ensure **res.end()** is called for every request.
- **Parse a JSON request body** (collect chunks, **Buffer.concat**, **JSON.parse** in try/catch) and respond with **400** when the body is invalid; return JSON responses for API routes.
- Combine **dotenv** (or env), a **config object** (port), and the raw **http** server so the server runs with config from the environment and is ready to extend with more routes and logic.
- Explain how this raw server maps to what Express does: same **req**/ **res**, with Express adding routing, middleware, and helpers (Phase 5).

## Key Terms

- **Raw HTTP server**: A server built with Node’s **http.createServer** only—no Express or other framework. You handle **req** and **res** directly: read method and URL, parse the body if needed, and write status, headers, and body. Good for learning and for very small APIs.
- **Request handler**: The callback passed to **http.createServer((req, res) => { ... })**. It runs once per request; you inspect **req**, then call **res.end()** (or **res.write** then **res.end**) to send the response.
- **Simple routing**: Branching on **req.method** and **req.url** (or parsed pathname) to decide what to do (e.g. **if (pathname === "/" && method === "GET") return "OK"**; else **if (pathname === "/api/health") return JSON**; else **404**). No router library; just **if**/ **else** or a small helper.
- **Request/response cycle**: For each incoming request, the server runs the handler once. You read **req** (method, url, headers, optional body), then send exactly one response via **res** (status, headers, body). The connection closes after **res.end()** unless you use **Connection: keep-alive** (Node handles this by default in HTTP/1.1).

---

## 1) Why a Raw Server Capstone

Phase 4 introduced Node’s runtime, path, fs, http, streams, process, Buffer, the event loop, npm, JSON syntax, parse/stringify, and environment config. A single **raw HTTP server** that uses several of these in one place reinforces how they fit together: you load config (env), listen on **config.port**, read **req.method** and **req.url**, parse the body when it is JSON, and respond with **JSON.stringify**. When you move to Express (Phase 5), you will get routing and middleware, but the underlying **req** and **res** are the same. Doing it once “by hand” makes the framework easier to understand.

---

## 2) Minimal Server with Config from Env

Start with a server that reads **PORT** from the environment and responds to every request with a fixed body. We use the config pattern from Chapter 4.11.

### 2.1 Load Env and Build Config

At the top of your entry file (e.g. **server.js**):

```javascript
require("dotenv").config();

const port = parseInt(process.env.PORT, 10) || 3000;
if (Number.isNaN(port) || port < 1 || port > 65535) {
  console.error("Invalid PORT");
  process.exit(1);
}
```

So: **dotenv** loads **.env** into **process.env**; then we read **PORT**, default to 3000, and validate. If you require **NODE_ENV=production** to set **API_KEY**, add that check here too (Chapter 4.11).

### 2.2 Create the Server and Listen

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("OK\n");
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
```

Run with **node server.js** (and ensure **.env** has **PORT** if you want a non-default port). Open **http://localhost:3000** or run **curl http://localhost:3000** and you should see **OK**. Every path and method gets the same response; next we add simple routing.

---

## 3) Simple Routing: Method and URL

To respond differently by path and method, read **req.method** and **req.url** and branch. Parse **req.url** with **new URL(req.url, base)** so you get **pathname** and **searchParams** (Chapter 4.04).

### 3.1 Parsing the URL

```javascript
const base = `http://${req.headers.host || "localhost"}`;
const url = new URL(req.url, base);
const pathname = url.pathname;
const method = req.method;
```

Then you can do:

- **if (pathname === "/" && method === "GET")** → send a welcome message or HTML.
- **if (pathname === "/api/health" && method === "GET")** → send **{"status":"ok"}**.
- **else** → send **404 Not Found**.

### 3.2 Example: GET / and GET /api/health

```javascript
const server = http.createServer((req, res) => {
  const base = `http://${req.headers.host || "localhost"}`;
  const url = new URL(req.url, base);
  const pathname = url.pathname;
  const method = req.method;

  if (pathname === "/" && method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello from raw Node server\n");
    return;
  }

  if (pathname === "/api/health" && method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: "ok", timestamp: Date.now() }));
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Not Found" }));
});
```

Every branch that sends a response must **return** (or be the only path) so you do not fall through and call **res.end()** twice. The 404 branch catches all other paths and methods.

---

## 4) Reading a JSON Request Body (POST)

For **POST** (or **PUT**) with a JSON body, you need to collect the body chunks, concatenate, parse JSON, and handle errors. This is the same pattern as in Chapter 4.04 and 4.10.

### 4.1 Collect and Parse Body

```javascript
if (pathname === "/api/echo" && method === "POST") {
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const bodyText = Buffer.concat(chunks).toString("utf8");
    let body;
    try {
      body = bodyText ? JSON.parse(bodyText) : {};
    } catch (e) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ received: body }));
  });
  req.on("error", () => {
    res.statusCode = 500;
    res.end();
  });
  return;
}
```

Important: the **POST** handler returns immediately after wiring **data**/ **end**/ **error**; the actual response is sent inside the **end** callback. So you must **return** after setting up the listeners so the rest of the handler does not run and send a second response. If the body is empty, we treat it as **{}**; if it is invalid JSON, we respond with **400** and a short message.

### 4.2 Optional: Check Content-Type

In a stricter API you might require **Content-Type: application/json** for POST bodies. You can read **req.headers["content-type"]** and reject with **415 Unsupported Media Type** when it is missing or not JSON:

```javascript
const contentType = (req.headers["content-type"] || "").toLowerCase();
if (!contentType.includes("application/json")) {
  res.statusCode = 415;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Content-Type must be application/json" }));
  return;
}
```

Do this before you start collecting body chunks. For learning and internal tools, accepting any body and trying **JSON.parse** is often enough; for public APIs, validating **Content-Type** is a good habit.

---

## 5) Full Example: One File with Env, Routing, and JSON

Below is a single-file server that: loads **dotenv**, builds **config.port**, validates it, then starts an HTTP server. Routes: **GET /** → plain text; **GET /api/health** → JSON; **POST /api/echo** → parse JSON body and echo back; everything else → 404.

```javascript
require("dotenv").config();
const http = require("http");

const port = parseInt(process.env.PORT, 10) || 3000;
if (Number.isNaN(port) || port < 1 || port > 65535) {
  console.error("Invalid PORT");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const base = `http://${req.headers.host || "localhost"}`;
  const url = new URL(req.url, base);
  const pathname = url.pathname;
  const method = req.method;

  if (pathname === "/" && method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello from raw Node\n");
    return;
  }

  if (pathname === "/api/health" && method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: "ok", time: Date.now() }));
    return;
  }

  if (pathname === "/api/echo" && method === "POST") {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const text = Buffer.concat(chunks).toString("utf8");
      let body;
      try {
        body = text ? JSON.parse(text) : {};
      } catch (e) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Invalid JSON" }));
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ received: body }));
    });
    req.on("error", () => { res.statusCode = 500; res.end(); });
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
```

Run **node server.js**, then:

- **curl http://localhost:3000/** → **Hello from raw Node**
- **curl http://localhost:3000/api/health** → **{"status":"ok","time":...}**
- **curl -X POST http://localhost:3000/api/echo -H "Content-Type: application/json" -d '{"x":1}'** → **{"received":{"x":1}}**
- **curl http://localhost:3000/other** → **{"error":"Not Found"}** with status 404

### 5.1 Testing with curl

Use **curl** to drive your server from the terminal. Useful options:

- **-v** (verbose): shows status code and response headers so you can confirm **Content-Type** and **200** vs **404**.
- **-X POST** (or **-X GET**): set the method; **-d '...'** sends a body (and often sets **Content-Type** to **application/x-www-form-urlencoded** unless you override it).
- **-H "Content-Type: application/json"**: required when sending JSON so the server (and any middleware later) knows how to interpret the body.
- **-w "%{http_code}"**: print only the HTTP status code; combine with **-o /dev/null** to hide the body and just check status.

Examples:

```bash
curl -v http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/echo -H "Content-Type: application/json" -d '{"name":"test"}'
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/nonexistent
```

The last command should print **404**. Getting comfortable with **curl** makes it easy to test APIs without a browser or a separate front end.

This server uses only Node built-ins plus **dotenv**; no Express. You can add more routes by adding more **if (pathname === "..." && method === "...")** blocks, or refactor into a small router helper. For larger apps, Express (Phase 5) will give you **app.get**, **app.post**, **res.json**, and body parsing middleware so you do not repeat this boilerplate.

---

## 6) What This Server Demonstrates

- **Config from env**: **PORT** from **process.env** (and **dotenv** for local **.env**), validated at startup.
- **Raw http**: **http.createServer**, one callback per request, **req** and **res** as streams.
- **Routing**: **req.method** and **req.url** (parsed with **URL**) with simple **if**/ **else**.
- **JSON in and out**: Request body read as stream, **Buffer.concat** + **JSON.parse** with try/catch; response with **Content-Type: application/json** and **res.end(JSON.stringify(...))**.
- **Error handling**: Invalid JSON → 400; unknown path → 404; **req.on("error")** for broken connections.

These are the same concepts you will use in Express; Express just organizes them with routes and middleware.

### 6.1 Response Headers You Often Set

For the servers in this chapter, the only header we set explicitly is **Content-Type**. In real APIs you may also set:

- **Content-Length**: The byte length of the body. Node does not set this automatically for **res.end(string)**; for small responses it is optional because the connection closes with the body and clients can infer length. If you use **res.write()** in chunks, setting **Content-Length** can help clients know when the response is complete. For **res.end(JSON.stringify(obj))** without chunked writes, many clients work fine without it.
- **Access-Control-Allow-Origin**: Needed when a browser on a different origin (e.g. **https://myapp.com**) calls your API. For development you might set **"\*"**; for production you typically allow specific origins. CORS is covered in later phases.
- **Cache-Control**: Tells clients and proxies whether to cache the response (e.g. **no-store** for dynamic data, **max-age=60** for short-lived cache).

For Phase 4, **Content-Type: application/json** (and **text/plain** for the root) is enough. You can add others when you need them.

---

## 7) Extending the Server (Ideas)

Without changing framework, you can:

- Add **GET /api/readings** that reads data from a file (using **path** and **fs** from Chapter 4.03) and returns **JSON.stringify(readings)**.
- Add **POST /api/config** that parses the body, validates it, and writes **config.json** with **fs.writeFile** and **JSON.stringify(config, null, 2)** (and protect this route in production so only authorized clients can call it).
- Use **pathname** and **searchParams** (e.g. **url.searchParams.get("id")**) for query parameters.
- Add **res.setHeader("Access-Control-Allow-Origin", "*")** for simple CORS if the server is called from a browser on another origin (security and CORS are covered in later phases).

Staying with the raw server a bit longer helps solidify the request/response cycle before you switch to Express.

---

## 8) What Breaks When You Skip the Patterns

- **Missing res.end()**: If you do not call **res.end()** in every branch (including inside **req.on("end")** for POST), the request will hang and the client will eventually time out. The server keeps the connection open until **res.end()** is called.
- **Calling res.end() twice**: If you send a response in the **end** callback and also in the main handler (because you forgot to **return**), Node will throw something like “Cannot set headers after they are sent.” Only one response per request.
- **Wrong or missing Content-Type**: If you do not set **Content-Type: application/json** for JSON responses, clients may treat the body as plain text or guess incorrectly. Browsers and API clients rely on this header to parse the response.
- **Invalid PORT**: If you do not validate **PORT** (e.g. **Number.isNaN(port)** or out-of-range), a typo in **.env** (e.g. **PORT=abc**) can cause **listen** to fail or bind to an unexpected port. Validate once at startup and **process.exit(1)** on failure.
- **No return after async body handling**: If you forget to **return** after setting up **req.on("data")** and **req.on("end")**, the handler continues and hits the 404 branch, sending a second response. Always **return** after you have “scheduled” the response to be sent later.
- **Ignoring req.on("error")**: If the client closes the connection while the body is streaming, **req** can emit an error. Without **req.on("error")**, you get an unhandled exception. Respond with 500 and **res.end()** (or no body) so the connection closes cleanly.

Following the “one response per request, set headers before end, return after async” pattern avoids these issues.

---

## 9) Homestead Example: Tiny API for Sensor Data

Imagine a minimal API for a homestead dashboard: **GET /api/readings** returns the latest readings from a JSON file (e.g. written by another script or device). The raw server could:

1. Load config (port, path to data file) from env.
2. On **GET /api/readings**, use **path.join(__dirname, "data", "readings.json")** and **fs.promises.readFile** (or **readFileSync** only if you do it at startup and cache). Parse with **JSON.parse**, then **res.end(JSON.stringify(data))**.
3. On any other path, return 404.

That gives you a working “read-only API” with no framework. Later you can add **POST** to accept new readings (validate, append, write file) or move to Express for more structure.

**Optional enhancement**: Add a **GET /api/readings/latest?n=5** route that uses **url.searchParams.get("n")** to limit how many readings to return (e.g. **data.slice(-n)** after parsing the file). That reinforces query parameters and keeps the server in a single file without a database.

---

## 10) Bridge to Express (Phase 5)

In Phase 5 (Express), you will use **app.get("/", (req, res) => { ... })** and **app.post("/api/echo", (req, res) => { ... })** instead of one big **if**/ **else**. Express parses the URL and the request body (with middleware) and gives you **req.body** as an object. You call **res.json(obj)** instead of **res.setHeader** + **res.end(JSON.stringify(obj))**. Under the hood, Express uses the same **http.createServer** and **req**/ **res**; it just adds routing, middleware, and helpers. So the mental model you built here (one handler per request, read method and path, read body, send status and body) carries over. Chapter 3.01 (What Express Is) and 3.02 (Minimal Server) in Phase 5 will build on this.

---

## 11) Checklist

Before moving on, you should be able to:

1. Start a minimal **http.createServer** that listens on **config.port** (from env) and responds to **GET /** with a simple body.
2. Parse **req.url** with **new URL(req.url, base)** and use **pathname** (and optionally **searchParams**) to branch.
3. Send JSON responses with **res.statusCode**, **res.setHeader("Content-Type", "application/json")**, and **res.end(JSON.stringify(...))**.
4. Handle **POST** with a JSON body: collect chunks, **Buffer.concat**.toString, **JSON.parse** in try/catch, respond with 400 on parse error and 200 with the echoed or processed data on success.
5. Ensure **res.end()** is called exactly once per request and that you **return** after setting up async body handling so you do not send a second response.
6. Combine **dotenv**, config validation, and the server in one runnable script and test with **curl** (GET and POST).

---

## Common Pitfalls

- **Forgetting to return after async body handling**: The **POST** handler registers **req.on("end", ...)** and must **return** so the rest of the callback does not run and send 404 or another response. This is the most common bug when first writing raw POST handlers.
- **Calling res.end() twice**: Only one response per request; every code path should call **res.end()** exactly once (or **res.write** then **res.end**). Node will throw if you try to write or end again after the first response.
- **Not setting Content-Type for JSON**: Set **Content-Type: application/json** so clients know to parse the body as JSON. Without it, **fetch** or **axios** may not parse **response.json()** correctly, or the client may treat the body as a string.
- **Ignoring req.on("error")**: Handle it so broken connections (client disconnect, network error) do not cause unhandled errors. You do not need to send a detailed body; **res.statusCode = 500** and **res.end()** is enough.
- **Blocking in the handler**: Do not use **readFileSync** or long CPU work in the request callback; use async (e.g. **fs.promises**) so the server stays responsive (Chapter 4.06). Blocking one request blocks all others in the same process.
- **Parsing req.url without a base**: **new URL(req.url, base)** needs a base (e.g. **http://localhost**) because **req.url** is path + query only (e.g. **/api/health?x=1**). Without the second argument, **URL** can throw or produce wrong host/pathname on some inputs.

---

## Practice: Try These

1. Type or paste the full example server into **server.js**, run **npm install dotenv** (if not already), add **PORT=4000** to **.env**, and run **node server.js**. Test **GET /** and **GET /api/health** with **curl** or a browser. Then test **POST /api/echo** with **curl -X POST ... -H "Content-Type: application/json" -d '{"a":1}'**.
2. Add a route **GET /api/now** that returns **{"now": Date.now()}**. Add **GET /api/params?x=1&y=2** that returns **{"x": "1", "y": "2"}** using **url.searchParams.get("x")** and **get("y")**.
3. Add **GET /api/readings** that reads **data/readings.json** (create a minimal file if needed) with **fs.promises.readFile** and **JSON.parse**, then returns the data as JSON. Handle **ENOENT** with 404 and parse errors with 500.
4. Intentionally send invalid JSON to **POST /api/echo** (e.g. **curl -X POST ... -d 'not json'**) and confirm you get **400** and **{"error":"Invalid JSON"}**.
5. Remove the **return** after the **POST /api/echo** block (so the handler falls through) and run again; confirm you get an error (double response or wrong body). Then put the **return** back.

6. Use **curl -v** for **GET /api/health** and **POST /api/echo** and note the response headers (status line and **Content-Type**) in the output. Then use **curl -s -o /dev/null -w "%{http_code}\n"** for **GET /** and **GET /api/nonexistent** and confirm you see **200** and **404** respectively.

7. Add the optional **Content-Type** check from section 4.2 for **POST /api/echo**: if **Content-Type** is not **application/json**, respond with **415** and **{"error":"Content-Type must be application/json"}**. Test with **curl -X POST ... -d '{"a":1}'** (no **-H** for JSON) and confirm you get 415 when the header is missing.

These exercises lock in the raw server, env config, routing, and JSON in/out before you start Phase 5 (Express).

---

## Summary

You built a **raw HTTP server** in Node using **http.createServer**, with **config from the environment** (dotenv, **PORT**, validation), **simple routing** (parse **req.url**, branch on **pathname** and **method**), and **JSON request/response** (collect body, **JSON.parse** with try/catch, **res.end(JSON.stringify(...))**). You send one response per request, set **Content-Type: application/json** for JSON, and handle invalid JSON with 400 and unknown paths with 404. This ties together env (4.11), http and streams (4.04), and JSON parse/stringify (4.10) into one runnable server. Phase 4 is complete. Next, **Section B Phase 5 (Express.js)** will add routing, middleware, body parsing, and response helpers on top of the same HTTP model so you can build larger web applications with less boilerplate.

---

## Next

Next: **Chapter 4.13: Node in the Wild**. That chapter puts Phase 4 in practice: running your server, hitting it with curl, observing logs and failures (connection refused, 404, 500, 400), and seeing where Node runs (dev, Pi, VPS). After that, **Section B Phase 5 — Express.js** begins with **Chapter 3.01: What Express Is** and **Chapter 3.02: Minimal Server**. Express wraps Node’s **http** module with routing (**app.get**, **app.post**), middleware (e.g. body parsing), and helpers (**res.json**, **res.send**). The **req** and **res** objects are the same; you will organize your handlers by route and reuse middleware for cross-cutting concerns. The raw server you built here is the foundation that Express builds on.
