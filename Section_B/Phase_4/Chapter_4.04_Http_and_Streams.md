# Section B Phase 4 · Chapter 4.04: Built-in Modules — http and Streams

Chapter 4.03 gave you the **path** and **fs** modules so you can read and write files from Node. Many programs also need to talk over the network: serve a web page, expose an API, or call another service. Node’s built-in **http** module lets you create HTTP servers and make HTTP requests without installing anything. This chapter introduces `http.createServer`, the request and response objects, and the idea that **req** and **res** are **streams**—readable and writable—so you understand how data flows in and out. You will build a minimal server that responds to requests and read a request body using streams. Later chapters (and frameworks like Express) build on this same model: one callback per request, with a request object to read from and a response object to write to.

## Learning Objectives

By the end of this chapter, you should be able to:

- Create a minimal HTTP server with **http.createServer** and **server.listen(port)**.
- Inspect the **request**: method, URL, headers, and (for bodies) how to read the stream.
- Send a **response**: set status code, set headers (e.g. Content-Type), and send a body with **res.end** or **res.write** then **res.end**.
- Explain that **req** is a readable stream and **res** is a writable stream, and why that matters for large or continuous data.
- Read a small JSON request body by collecting chunks from **req** and then parsing, and respond with JSON using **res.setHeader** and **res.end**.
- Describe how higher-level frameworks (e.g. Express) wrap this with routing, middleware, and body parsing while keeping the same request/response model.

## Key Terms

- **http (module)**: Node’s built-in module for HTTP. It provides **createServer** to create a server and **request** (and related) to make outgoing HTTP requests. No npm install required.
- **IncomingMessage**: The type of the **req** object in a server callback. It is a readable stream; you read the request body from it (method, url, and headers are properties).
- **ServerResponse**: The type of the **res** object. It is a writable stream; you write status, headers, and body to it, then call **end**.
- **Stream**: An object that produces or consumes data in chunks over time. **req** is a readable stream (incoming body); **res** is a writable stream (outgoing body). Streams allow large or continuous data without loading everything into memory at once.

---

## 1) Why HTTP in Node?

In the browser, JavaScript uses **fetch** or **XMLHttpRequest** to make HTTP requests. In Node, there is no DOM and no built-in fetch in older versions (Node 18+ has global fetch). For **servers**, Node does not give you a “page”; you create a process that listens on a **port** and responds to HTTP requests. Each request has a method (GET, POST, etc.), a URL, headers, and optionally a body. Your job is to read that, do something (e.g. read a file, query data), and send back a status, headers, and a body. The **http** module is the lowest-level way to do that in Node. Understanding it makes everything built on top (Express, Fastify, etc.) easier to reason about.

---

## 2) Creating a Server with http.createServer

You create an HTTP server by calling **http.createServer** with a callback that runs **once per request**:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  // runs for every incoming request
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello from Node\n");
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
```

- **req** (IncomingMessage): the incoming request. You can read **req.method**, **req.url**, **req.headers**, and the body (see below).
- **res** (ServerResponse): the outgoing response. You set **res.statusCode**, call **res.setHeader(name, value)**, and send the body with **res.end(data)** or **res.write(data)** then **res.end()**.

After **server.listen(port)**, the process stays alive and waits for connections. Each time a client sends a request to that port, Node calls your callback with a new **req** and **res**. You must call **res.end()** (with or without a body) for every request; otherwise the client hangs. One request, one response; then the connection may be reused (HTTP keep-alive) for the next request.

### 2.1 Port and Host

**server.listen(port, host, callback)** binds the server to a port. Common forms:

- **server.listen(3000)** — listen on port 3000 on all interfaces.
- **server.listen(3000, "127.0.0.1")** — listen only on localhost (good for development).
- **server.listen(3000, () => { ... })** — callback runs when the server is bound; use it to log “Server listening on …”.

Ports below 1024 often require elevated privileges on Unix; 3000, 8080, 4000 are typical for development. You can read the port from **process.env.PORT** so deployment can override it (Chapter 4.02).

---

## 3) The Request Object (req)

**req** has:

- **req.method** — string: `"GET"`, `"POST"`, `"PUT"`, etc.
- **req.url** — string: the path (and query string) of the request. For example, a request to `http://localhost:3000/api/data?x=1` gives **req.url** equal to `"/api/data?x=1"`. You can parse it with a URL parser (e.g. **new URL(req.url, "http://localhost")**) to get pathname and searchParams. Example: `const u = new URL(req.url, "http://localhost"); const pathname = u.pathname; const x = u.searchParams.get("x");` — then you can route by **pathname** and use query parameters from **searchParams**.
- **req.headers** — object: header names (lowercased) to values. For example **req.headers["content-type"]**, **req.headers["authorization"]**. Header names are lowercased so **req.headers["content-type"]** and **req.headers["Content-Type"]** both work.

The **body** of the request (for POST or PUT) is not a property; it comes from **req** as a **readable stream**. So you do not do **req.body**; you listen for **data** and **end** events (or use a helper) to read the body. See the next section.

### 3.1 Parsing req.url for routing

**req.url** is the full path and query string (e.g. `"/api/readings?limit=10"`). To implement routes, you need the pathname and optionally the query parameters. Use the **URL** constructor with a base so the path is valid:

```javascript
const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
const pathname = url.pathname;       // "/api/readings"
const limit = url.searchParams.get("limit"); // "10" or null
```

Then you can branch: **if (pathname === "/api/readings") { ... }** and use **limit** for pagination. Do not use **req.url** directly as a file path; it can contain `..` or absolute paths and is unsafe for **fs** or **path.join**. Always parse and validate pathname before using it to read files.

---

## 4) The Response Object (res)

You build the response by:

1. Setting **res.statusCode** (e.g. 200, 404, 500). Default is 200.
2. Setting headers with **res.setHeader(name, value)**. Important: set headers **before** you call **res.end** or **res.write**; once the response has started sending, you cannot change headers.
3. Sending the body:
   - **res.end()** — end with no body.
   - **res.end(data)** — send **data** (string or Buffer) and end. One shot.
   - **res.write(data)** then **res.end()** — send one or more chunks, then end. Useful for streaming.

Example: JSON response.

```javascript
res.statusCode = 200;
res.setHeader("Content-Type", "application/json");
res.end(JSON.stringify({ message: "OK", time: Date.now() }));
```

Example: 404 with a short HTML body.

```javascript
res.statusCode = 404;
res.setHeader("Content-Type", "text/html");
res.end("<h1>Not Found</h1>");
```

You must call **res.end()** exactly once per request. If you forget, the client waits forever. If you call it twice, Node will throw. After **res.end()**, do not try to write more to **res**.

---

## 5) Streams: req and res Are Streams

**req** (IncomingMessage) is a **readable stream**: data arrives in chunks. **res** (ServerResponse) is a **writable stream**: you write chunks and then end. That design lets Node handle large bodies (e.g. file uploads) or long-lived responses (e.g. server-sent events) without loading everything into memory.

For **small** request bodies (e.g. a JSON payload of a few KB), a common pattern is to collect all chunks and then parse:

```javascript
const chunks = [];
req.on("data", (chunk) => chunks.push(chunk));
req.on("end", () => {
  const body = Buffer.concat(chunks).toString("utf8");
  let data;
  try {
    data = body ? JSON.parse(body) : {};
  } catch (e) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }
  // use data, then send response
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ received: data }));
});
req.on("error", (err) => {
  console.error(err);
  res.statusCode = 500;
  res.end();
});
```

So: **data** events give you Buffers; you push them into an array, then on **end** you **Buffer.concat(chunks).toString("utf8")** and parse. Always handle **error** on the request stream so a broken connection does not leave the process in a bad state. For very large bodies, you would process chunks incrementally (streaming) instead of concatenating; for most APIs, the pattern above is enough.

---

## 6) Minimal Full Example: Echo Server

A server that echoes the method, URL, and body as JSON:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const body = Buffer.concat(chunks).toString("utf8");
    let parsed = null;
    if (body && req.headers["content-type"]?.includes("application/json")) {
      try {
        parsed = JSON.parse(body);
      } catch (e) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Invalid JSON" }));
        return;
      }
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      method: req.method,
      url: req.url,
      body: parsed,
    }));
  });
  req.on("error", () => {
    res.statusCode = 500;
    res.end();
  });
});

server.listen(3000, () => console.log("Echo server on http://localhost:3000"));
```

You can test with **curl**:

```bash
curl -X POST http://localhost:3000/hello -H "Content-Type: application/json" -d '{"name":"world"}'
```

You should get back JSON with method, url, and body. This pattern—collect body, parse, respond—is the core of many small APIs. Later you will use **path** and **fs** (Chapter 4.03) to serve files or load config and combine that with **req.url** to implement simple routing (e.g. if url is `/api/data` return JSON; if `/` return HTML).

---

## 7) Serving a File with path and fs

You can combine **http** with **path** and **fs** to serve a file. For a single static file (e.g. **index.html** next to the script):

```javascript
const http = require("http");
const path = require("path");
const fs = require("fs").promises;

const server = http.createServer(async (req, res) => {
  if (req.method !== "GET" || req.url !== "/") {
    res.statusCode = 404;
    res.end("Not Found");
    return;
  }
  const filePath = path.join(__dirname, "index.html");
  try {
    const html = await fs.readFile(filePath, "utf8");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.statusCode = 404;
      res.end("Not Found");
    } else {
      res.statusCode = 500;
      res.end("Server Error");
    }
  }
});

server.listen(3000, () => console.log("http://localhost:3000"));
```

This is a minimal “serve one HTML file” server. In production you would add better path validation (no path traversal), more MIME types, and possibly streaming with **fs.createReadStream** for large files. The point here is: **req** and **res** are the same as before; you just use **req.method** and **req.url** to decide what to do, and **fs** to read the file. Express and other frameworks wrap this with routing and **res.sendFile**; under the hood it is the same idea.

---

## 8) Streams in a Nutshell

- **Readable stream** (e.g. **req**): emits **data** (chunk), **end**, and **error**. You listen with **on("data", ...)** and **on("end", ...)**. For request bodies you often collect chunks and then process; for very large payloads you would process each chunk without storing all.
- **Writable stream** (e.g. **res**): you call **write(chunk)** and **end()**. After **end()**, no more writes. **res.end(data)** is shorthand for **write(data)** then **end()**.

**Piping**: You can **readable.pipe(writable)** to send all data from a readable to a writable (e.g. pipe a file read stream to **res**). That is efficient for large files. For example, to stream a file to the client without loading it all into memory:

```javascript
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "large-file.bin");
const stream = fs.createReadStream(filePath);
res.setHeader("Content-Type", "application/octet-stream");
stream.pipe(res);
```

**res** is a writable stream, so **stream.pipe(res)** sends each chunk of the file to the client as it is read. You do not call **res.end()** yourself when piping; the **pipe** will call **end** on **res** when the readable stream ends. For small responses (e.g. JSON), **res.end(data)** is simpler. For large files or continuous data, **createReadStream** and **pipe** are the right pattern.

---

## 9) Making Outgoing HTTP Requests (http.request and fetch)

Your Node server or script may need to **call** another HTTP API (e.g. a weather service, another microservice). Node’s **http** module can do that with **http.request(options, callback)**. You pass a URL or host/path, method, and headers; you get a writable stream to write the request body (for POST) and a readable stream for the response body. Handling the response is similar to reading **req**: you collect chunks on **data** and **end**, or you pipe. In **Node 18+**, the global **fetch** API is available, so you can do **const res = await fetch(url); const json = await res.json();** just like in the browser. For older Node or for more control (streaming the response, custom timeouts), **http.request** (or **https.request** for HTTPS) is still used. The curriculum assumes you will use **fetch** when available and **http.request** when you need low-level control. Making a GET request with fetch is straightforward: **fetch("https://api.example.com/data").then(r => r.json()).then(data => console.log(data));** — and you can use **async/await** as in Phase 3. When your server acts as a client to another API, remember to handle errors (network failures, non-2xx status) and to avoid blocking: use async/await or callbacks so the event loop can handle other requests while the outgoing request is in flight.

---

## 10) What Breaks When You Ignore the Model

If you never call **res.end()**, the client waits forever and the connection stays open. Every request handler must eventually call **res.end()** (or **res.write** then **res.end**). If you set headers after calling **res.end()** or after the first **res.write()**, they have no effect and can trigger warnings. Set **res.statusCode** and **res.setHeader** before sending the body. If you assume **req** has a **body** property, you will be wrong; the body is the stream, so you must collect chunks or pipe. If you do not handle **req.on("error")**, a client disconnect or malformed request can leave unhandled errors. If you block the event loop (e.g. long sync work or sync fs in the request callback), no other requests are handled until that work finishes; use async (fs.promises, etc.) so the server stays responsive. If you parse **req.url** without considering the query string or use it for file paths, validate and normalize to avoid path traversal (e.g. **../../../etc/passwd**). Following the “one callback per request, read req, write res, end once” model avoids most of these issues.

---

## 11) Bridge to Express and Later Material

The **http** module gives you raw access: one callback per request, and you inspect **req** and build **res** yourself. That is flexible but verbose for many apps. Frameworks like **Express** wrap **http.createServer** and add:

- **Routing**: match **req.method** and **req.url** (or path) to handlers (e.g. **app.get("/api/data", ...)**).
- **Middleware**: functions that run before your route and can read **req**, modify **res**, or call **next()**.
- **Helpers**: **res.send()**, **res.json()**, **res.sendFile()** so you do not manually set Content-Type and end every time.
- **Body parsing**: middleware that reads the request body stream and parses JSON or form data into **req.body**.

So when you later use Express, you are still working with the same **req** and **res**; Express just organizes code and fills in **req.body** for you. Understanding raw **http** means you know what is happening under the hood and can debug when something goes wrong. Phase 4 may introduce Express or similar in a later chapter; here the goal is to be comfortable with the core **http** server and the stream-based request/response.

---

## 12) Homestead Example: Small API for Sensor Data

Suppose you have a Node script that reads sensor data from a file (using path and fs as in Chapter 4.03). You can expose that data over HTTP so a browser dashboard can fetch it:

```javascript
const http = require("http");
const path = require("path");
const fs = require("fs").promises;

async function getReadings() {
  const p = path.join(__dirname, "data", "readings.json");
  try {
    const text = await fs.readFile(p, "utf8");
    return JSON.parse(text);
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method !== "GET" || req.url !== "/api/readings") {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not Found" }));
    return;
  }
  try {
    const data = await getReadings();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Server error" }));
  }
});

server.listen(3000, () => console.log("Sensor API on http://localhost:3000/api/readings"));
```

A browser or another script can **GET http://localhost:3000/api/readings** and receive JSON. The same pattern—path + fs to load data, http to serve it—scales to more routes and more logic; you just branch on **req.method** and **req.url**.

---

## 13) Checklist

Before moving on, you should be able to:

1. Create a server with **http.createServer(callback)** and **server.listen(port)**.
2. Read **req.method**, **req.url**, and **req.headers** and know that the body is read from **req** as a stream.
3. For a small JSON body, collect **req.on("data")** chunks, **Buffer.concat(chunks).toString("utf8")**, then **JSON.parse** (with try/catch).
4. Set **res.statusCode**, **res.setHeader("Content-Type", "application/json")**, and **res.end(JSON.stringify(...))** to send a JSON response.
5. Call **res.end()** exactly once per request and set all headers before the first write.
6. Handle **req.on("error")** so broken connections do not cause unhandled errors.
7. Explain that **req** is readable and **res** is writable, and that streaming allows large or continuous data.

---

## Common Pitfalls

- **Forgetting res.end()**: The client waits until you call **res.end()**. Every code path in your request handler that sends a response must call **res.end()** (or **res.write** then **res.end**).
- **Setting headers after sending body**: Headers must be set before **res.write** or **res.end**. Once the response has started, changing headers has no effect.
- **Treating req as having req.body**: In raw Node, there is no **req.body**. You must read the body from the **req** stream (data/end events or a helper).
- **Blocking in the request callback**: Doing synchronous file reads or long computation in the callback blocks the server. Use async (fs.promises, etc.) so other requests can be handled.
- **Ignoring req.url parsing**: **req.url** can contain a query string and must be parsed if you need pathname vs query. Use **new URL(req.url, "http://localhost")** or similar to get **pathname** and **searchParams**.

---

## Practice: Try These

1. Run the minimal server that returns **"Hello from Node"** and open **http://localhost:3000** in a browser. Then try **curl http://localhost:3000** and confirm you see the same text.
2. Change the server to return JSON: **res.setHeader("Content-Type", "application/json")** and **res.end(JSON.stringify({ message: "Hello" }))**. Reload and check the response in the browser or with **curl**.
3. Add a branch: if **req.url === "/api/now"**, respond with **{ time: Date.now() }**; otherwise respond with 404 and a short message. Test **curl http://localhost:3000/api/now**.
4. Implement the echo server that reads a JSON body (collect chunks, parse, send back method, url, body). Test with **curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"x":1}'**.
5. (Optional) Serve a single **index.html** file from the same directory as the script using **path.join(__dirname, "index.html")** and **fs.readFile** (or fs.promises). Return 404 for any other path.

These exercises lock in the request/response model and streams before you add more routing or move to Express. If the server does not start, check that the port is not already in use (another process or another terminal). If the browser or curl hangs, you probably did not call **res.end()** in some code path (e.g. after an error). If you get garbage when expecting JSON, ensure you set **Content-Type: application/json** and that you are sending a string (e.g. **JSON.stringify(...)**), not a raw object. If the request body is empty when you expect JSON, check that the client sent **Content-Type: application/json** and that you are reading the body (data/end) before trying to parse.

---

## Summary

Node’s **http** module lets you create an HTTP server with **http.createServer** and **server.listen(port)**. Each request triggers your callback with **req** (IncomingMessage) and **res** (ServerResponse). You read **req.method**, **req.url**, and **req.headers**, and read the body from **req** as a readable stream (collect chunks on **data**, then **Buffer.concat** and parse on **end**). Parse **req.url** with **new URL(req.url, base)** to get pathname and searchParams for routing and query parameters. You send the response by setting **res.statusCode** and **res.setHeader**, then **res.end(data)** (or **res.write** then **res.end**). **req** and **res** are streams: that design supports large or streaming data; you can **pipe** a file stream to **res** for efficient file serving. You must call **res.end()** once per request and set headers before sending the body. For outgoing requests, Node 18+ offers **fetch**; otherwise **http.request** (or **https.request**) gives you full control. Combining **http** with **path** and **fs** lets you serve files or expose API endpoints that read from disk; frameworks like Express wrap this with routing and body parsing. With this foundation you can build small HTTP services and understand what happens when you use higher-level tools later.

---

## Next

Next: **Chapter 4.05: process and Buffer**. That chapter goes deeper into the **process** object (beyond env and argv) and introduces **Buffer** for binary data. You will use Buffers when reading binary files or when working with request/response bodies in raw form, and you will see how process and Buffer fit into the Node runtime you use for servers and tools.
