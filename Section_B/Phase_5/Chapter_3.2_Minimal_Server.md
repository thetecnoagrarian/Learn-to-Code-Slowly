## Section B Phase 5 · Chapter 3.2: The Minimal Express Server

This chapter builds on Chapter 3.1.
You understand Express is structured HTTP.
Now you create the smallest useful Express server.
Not a “real app” yet.
A living boundary that can receive a request and return a response.

A minimal Express server does three things.
It creates an Express application.
It defines at least one route.
It listens on a port.

If you can do those three things, you can be a server.

## 1) The Server Is a Long-Running Process

An Express server is not a script you “run once.”
It is a process that stays alive.
It waits.
It accepts connections.
It handles requests.
It keeps waiting.

This is the web version of a “main loop,” but event-driven.
You are not writing while True: yourself.
Node runs the loop.
Express registers handlers inside it.

Your code defines behavior.
Node executes that behavior when requests arrive.

A key mental shift:
Your server code is mostly definitions.
Routes are definitions.
Middleware is definitions.
Listening is the moment you hand control to Node.

Once you listen, your process becomes a service.
It is now a boundary in the world.
Other systems can push data at it.

Homestead analogy:
A chicken coop door controller isn’t useful if it runs once.
It must stay awake.
It must respond to sunrise, sunset, and sensor changes.
A web server is the same kind of thing.
It exists to be contacted.

If your process exits, your server disappears.
No one can talk to it.
The boundary is gone.

2) What “Minimal” Really Means

Minimal does not mean “toy.”
Minimal means “one clear mental model.”
One moving part at a time.
No databases yet.
No authentication yet.
No templates yet.
No file uploads yet.

But still real HTTP.
Still real request and response.
Still real status codes.
Still real headers.

The goal is mechanical confidence.
When a request comes in, you know exactly where it lands.
When you send a response, you know what the client receives.
Nothing feels like magic.

## 3) The Three Pieces

### 3.1) Create the app

You create a single Express application object.
This object is your server definition surface.
You attach routes to it.
You attach middleware to it.
Then you start it.

Think of the app object like a control panel.
Everything plugs into it.

### 3.2) Define a route

A route is a match rule plus a handler.
Match rule: method + path.
Handler: a function that receives request and response objects.

A route answers a question like:
“When the client sends GET /, what should happen?”

Routes are where your server becomes “about something.”
Without routes, there is no behavior.
Only an open port.

### 3.3) Listen on a port

Listening is the step that makes it real.
Before listening, your code is only a definition.
After listening, Node binds to a port.
The OS starts delivering traffic to your process.
Now you can be reached.

If you forget to listen, nothing works.
No errors.
Just silence.
Because there is no boundary in the world.

## 4) Your First Route Should Be a Health Endpoint

Most tutorials do GET / and return “Hello world.”
That’s fine.
But for systems thinking, a better first habit is a health endpoint.

A health endpoint answers:
“Is the server alive?”
It is not “business logic.”
It is infrastructure truth.

Common patterns:
GET / returns a simple string.
GET /health returns a small JSON payload.
GET /status returns a small JSON payload.

Pick one and keep it consistent across your systems.

Homestead analogies:
A fence energizer has a power light.
A barn sensor node might blink a status LED.
A battery monitor might publish a heartbeat.
A web server’s “power light” is /health.

You will be grateful for it later.
Especially when you start adding middleware and modules.
When something breaks, /health tells you if the server still boots.

## 5) The Request and Response Objects Are the Boundary Handles

When a request arrives, Express calls your handler with two objects.
req represents the incoming request.
res represents the outgoing response.

These objects are the hands you use at the boundary.

Everything you learned in Phase 2 is present here.
Method.
Path.
Headers.
Body.
Status code.
Response headers.
Response body.

Express makes them easier to access.
But it does not remove them.

If you ever feel lost, return to Phase 2.
Ask:
“What would the raw HTTP message look like?”
Then ask:
“Where does Express expose that?”

6) What Express Does Automatically (and What It Doesn’t)

Express does some default helpful things.
But it does not do everything.

Express will:
Match routes by method + path.
Provide convenience response methods.
Provide a middleware pipeline mechanism.
Set some headers for you based on what you send.

Express will not:
Parse JSON bodies unless you add JSON middleware.
Validate input unless you add validation.
Authenticate users unless you build auth.
Persist data unless you add storage.
Protect you from bad assumptions unless you design boundaries.

Minimal server means you see that clearly.
You don’t accidentally assume “Express handles it.”

## 7) How a Request Flows Through the Minimal Server

This is the request-response cycle, but through Express.
	1.	A client connects to your machine and port.
	2.	The client sends an HTTP request.
	3.	Node receives bytes on the socket.
	4.	Express translates those bytes into req.
	5.	Express looks at method and path.
	6.	Express finds the first matching route.
	7.	Express calls your handler.
	8.	Your handler decides what to send.
	9.	Your handler writes to res.
	10.	Express finalizes headers and body.
	11.	Node sends bytes back to the client.
	12.	The client receives the HTTP response.

If no route matches:
Express will return a default 404.
That is not “the server crashed.”
That is “no behavior defined for that path.”

If your handler throws an error:
Express may produce a 500 response (depending on configuration).
Or your process may crash if the error is uncaught.
We’ll treat this carefully later.
For now, we just acknowledge reality: failures exist.

### 7.5) The Four-Step Process: Minimal Server Request Flow

Every request in your minimal Express server follows the same four-step process:

**Step 1: Receive and Parse**
- Node.js receives the raw HTTP request bytes over TCP
- Express parses the request line (method, path, HTTP version)
- Express parses headers into `req.headers`
- Express parses the URL into `req.path` and `req.query`
- Express creates `req` and `res` objects

**Step 2: Route Matching**
- Express compares `req.method` and `req.path` against registered routes
- Express matches routes in the order they were defined
- Express selects the first matching route handler (or 404 if no match)

**Step 3: Handler Execution**
- Express calls your route handler function with `req` and `res`
- Your handler reads from `req` (method, path, headers, query)
- Your handler writes to `res` (status, headers, body)
- Your handler calls `res.send()`, `res.json()`, or `res.end()` to finish

**Step 4: Response Construction and Send**
- Express builds the HTTP response from `res` object
- Express sets status line, headers, and body
- Express sends the response bytes back through Node.js to the client
- The connection closes (or stays open for keep-alive)
- The request-response cycle completes

This process is deterministic. Every request follows these four steps. In a minimal server, there's no middleware pipeline yet—just route matching and handler execution.

Example flow for `GET /health`:

1. **Receive and Parse:** Node.js receives `GET /health HTTP/1.1
Host: pi.local

` → Express parses → `req.method = 'GET'`, `req.path = '/health'`
2. **Route Matching:** Express matches to `app.get('/health', handler)` → selects handler
3. **Handler Execution:** Handler runs → reads `req.path` → calls `res.json({status: 'ok'})`
4. **Response Construction:** Express builds `HTTP/1.1 200 OK
Content-Type: application/json

{"status":"ok"}` → Node.js sends response → client receives it

Understanding these four steps makes the minimal server transparent. It's just organized HTTP handling with route matching.

8) Ports, Addresses, and “Where Is My Server?”

A port is a numbered door on a machine.
A server listens on an address and a port.

Common local address:
localhost
This means “this same machine.”

If you listen on localhost only, other devices cannot reach you.
If you listen on all interfaces, other devices can.

You do not need to master networking right now.
But you do need one practical truth:

If you want your phone or your ESP32 to reach your server,
the server must listen on an address reachable from the network.

Homestead analogy:
If your ESP32 coop sensor is on the property Wi-Fi,
and your server is on the Pi,
they must be able to see each other on the network.
Otherwise your HTTP design is perfect and still useless.

Also: ports can already be in use.
If port 3000 is taken, listening fails.
You must choose a different port.
This is not an Express concept.
This is an OS concept.

## 9) A Minimal Response Is Still a Real Response

When you send a response, you are choosing:

A status code.
A body (or no body).
A Content-Type (explicitly or implicitly).
Maybe some headers.

Express makes the easy case easy.
But you should still think in HTTP.

For a health endpoint, a clean pattern is:

Status code: 200.
Body: small JSON or plain text.
Content-Type: consistent with the body.

If the server is up, 200 means “OK.”
If the server is down, there is no response at all.
That distinction matters.
(Phase 2: errors vs failures.)

10) Minimal Does Not Mean “No Discipline”

Even in the first server, practice good boundaries.

Be explicit about what your endpoint does.
Be explicit about what it returns.
Be explicit about what it does not promise.

A health endpoint should not do heavy work.
It should not query a database.
It should not call out to external services.
It should be cheap and reliable.

Later you can have deeper endpoints like /health/deps.
But the first one should just prove the process is alive.

## 11) Common Failure Modes in the Minimal Server

This section exists so you don’t lose time to “mystery.”

11.1) “It runs, but nothing responds”

Cause patterns:
You didn’t call listen.
You called listen on the wrong port.
You are curling the wrong port.
Your process crashed immediately after starting.

What to do:
Confirm the server logs the “listening” message.
Confirm you’re requesting the same port.
Confirm you’re requesting the same host.

11.2) “I get 404”

A 404 means:
The server is running.
The server received your request.
The server has no route that matches.

That’s good news.
It means the boundary exists.
Now fix the route path or method.

Common mismatch:
You defined GET /health but you requested /.
Or you defined GET / but you requested /health.
Or you used POST while the route is GET.

11.3) “It says the port is in use”

Another process already owns that port.
Choose another port.
Or stop the process that owns it.

Do not treat this like an Express error.
It’s an OS-level resource conflict.

11.4) “My phone can’t reach it but my laptop can”

This is usually an address-binding issue.
Or a firewall rule.
Or you’re using localhost on the phone (which points to the phone).

localhost always means “this device.”
So on your phone, localhost is the phone.
Not your Pi.
Not your laptop.

To reach your server from another device, you need the server’s LAN address or hostname.
On a homestead network, it might be something like pi.local.
Or a direct IP.

This is a normal confusion.
It is not a “coding” mistake.
It is an addressing reality.

11.5) “My ESP32 gets timeouts”

Timeout means: No response arrived in time.

**Possible causes:**

1. **Server is down**
   - Pi crashed
   - Server process exited
   - Server never started

2. **Server is unreachable**
   - Network issue (Wi-Fi down, wrong IP)
   - Firewall blocking
   - Server listening on wrong address (localhost instead of 0.0.0.0)

3. **Request never left the ESP32**
   - ESP32 Wi-Fi disconnected
   - ESP32 code error
   - ESP32 network configuration wrong

4. **Server handler hung**
   - Handler is blocking (infinite loop, waiting forever)
   - Handler never calls `res.send()` or `res.json()`
   - Handler is waiting for something that never completes

**Debugging timeout:**

```javascript
// Add logging to see if request arrives
app.post('/api/temp', (req, res) => {
  console.log('Request received at', new Date().toISOString());
  // ... handle request
  res.status(201).json({saved: true});
  console.log('Response sent at', new Date().toISOString());
});
```

If you see "Request received" but not "Response sent", your handler is hanging. If you don't see "Request received", the request never arrived (network issue).

**Remember Phase 2.**
Timeout is not a 500. It is absence. A 500 error means the server responded with an error. A timeout means no response at all.

**Your homestead example:** ESP32 sends `POST /api/temp` but gets timeout after 30 seconds. Check:
1. Is server running? → Check Pi process list
2. Is server listening? → Check server logs for "listening"
3. Can ESP32 reach Pi? → Ping Pi IP from ESP32
4. Is handler hanging? → Add logging, check if handler completes
5. Is handler sending response? → Check handler calls `res.json()` or `res.send()`

Timeout debugging is about elimination. Check each possibility until you find the cause.

## 12) Minimal Logging as Observation

In early development, you need observation. Not fancy logging infrastructure. Just enough to see that requests are arriving.

**A simple pattern:**

```javascript
const express = require('express');
const app = express();

// Log when server starts
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Log when health route is hit
app.get('/health', (req, res) => {
  console.log(`${req.method} ${req.path}`);
  res.json({status: 'ok'});
});

// Log all requests (simple middleware)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

**What to log:**
- When server starts (confirms listening)
- Method and path of each request (confirms routing)
- Response status (confirms handler executed)
- Errors (confirms failures)

**What NOT to log (yet):**
- Request bodies (might be large, sensitive)
- Full headers (too verbose)
- Response bodies (might be large)

**But keep the principle: observation is separate from action.**

Logging should not change behavior. It should reveal behavior.

**Bad logging (changes behavior):**
```javascript
app.get('/health', (req, res) => {
  console.log('Health check'); // This is fine
  if (someCondition) {
    console.log('Error!'); // This is fine
    return res.status(500).json({error: 'Failed'}); // This changes behavior
  }
  res.json({status: 'ok'});
});
```

**Good logging (reveals behavior):**
```javascript
app.get('/health', (req, res) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  res.json({status: 'ok'});
});
```

**Homestead analogies:**
- A temperature sensor node might print readings while you debug
- That print is not the sensor
- It is your observation channel

Same here. Logging is your observation channel. It helps you see what's happening, but it doesn't change what happens.

**Your homestead example:** Your ESP32 sends `POST /api/temp` but you don't see the data. Add logging:

```javascript
app.post('/api/temp', (req, res) => {
  console.log(`Received temp reading: ${JSON.stringify(req.body)}`);
  // ... handle request
  res.status(201).json({saved: true});
});
```

Now you can see if requests are arriving, what data they contain, and if handlers are executing. This is observation, not business logic.

## 13) Homestead Examples That Map Cleanly to a Minimal Server

The minimal server is not “business logic.”
But you can still choose endpoints that feel real.

### 13.1) Chicken coop status endpoint

A coop controller might expose:
GET /coop/status

It returns:
Door state.
Temperature.
Last update timestamp.
Maybe “battery low” if it’s solar powered.

Even if you hardcode values at first, the shape matters.
The contract matters.
You’re practicing boundary design.

### 13.2) Pig barn sensor heartbeat

A pig barn node might be noisy and humid.
You might want a single heartbeat endpoint:
GET /barn/pig/heartbeat

It returns:
“alive”: true
“last_seen”: timestamp
“humidity”: value

Again: at first, it can be placeholder.
The lesson is the boundary.

### 13.3) Solar monitor health

A solar system dashboard might need:
GET /solar/health

It returns:
“Inverter reachable”
“Last reading age”
“Collector running”

This builds the habit of “observability first.”

### 13.4) Electric poultry net status

If you’re running an energizer and you want a remote dashboard:
GET /fence/status

It returns:
Fence voltage reading.
“Fence down” boolean.
Last alert time.

You’re practicing:
A route is a boundary.
A response is a contract.

14) When You’re Ready to Code

This chapter is audio-first.
The actual code belongs in Section B Phase 5 code example files.

Try This (when not driving):
Create the minimal server in a file like:
Section_B/Phase_5/examples/Chapter_3.2_minimal_server.js

Include:
One Express app.
One route (/ or /health).
One listen call.

Then run it and test it with curl and a browser.

Also create a second route that returns JSON.
Not because JSON is hard.
Because you want to see content-type behavior in practice.

See the Section B Phase 5 code index files for where the snippets live.
(Example: Section_B/Phase_5/Phase_5_Code_Examples_*.md.)

## 15) Challenge

Challenge (when not driving):
Add three health-style endpoints, each representing a different subsystem.

Suggested endpoints:
GET /health (server is alive)
GET /health/coop (coop subsystem heartbeat placeholder)
GET /health/solar (solar subsystem heartbeat placeholder)

Rules:
Each must return a different payload.
Each must return 200.
Each must be cheap and fast.
No database.
No network calls.
Just a clean contract.

Then test:
Hit each endpoint with curl.
Confirm you see different bodies.
Confirm you can hit them repeatedly without side effects.

## 16) Anchor Takeaway

An Express server is a long-running boundary.
You define routes.
You listen on a port.
Requests come in as req.
Responses go out through res.
If you can start a minimal server and hit a health endpoint, you’ve created a real HTTP service.

Next: Chapter 3.3 — The Request and Response Objects.
We’ll map req and res back to raw HTTP.
Method, path, headers, query, body, status, and content type.
So debugging becomes mechanical.

￼