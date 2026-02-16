## Phase 3 · Chapter 3.3: The Request and Response Objects

This chapter builds on Chapter 3.2 and Phase 2’s HTTP structure chapters.
You can start a server.
You can define a route.
Now you need to understand what actually lands in your handler.

req and res are not magic objects.
They are structured representations of raw HTTP messages.

If Phase 2 taught you how to read a request line and headers manually,
Phase 3 now shows you where those pieces live in Express.

This chapter is about removing illusion.

## 1) The Boundary in Code

In Phase 0, boundaries were where validation lives.
In Phase 2, the HTTP request was the boundary.
In Phase 3, the req object is that boundary made programmable.

When a request hits your server, Express constructs:
	•	A request object (req)
	•	A response object (res)

Your handler receives both.

Everything the client sent lives in req.
Everything you send back must go through res.

You are standing at the edge.

## 2) The Request Object (req)

The request object represents the incoming HTTP request.
It contains method, path, headers, query parameters, route parameters, and body.

These are not new concepts.
They are the HTTP components you already know.

### 2.1) req.method

This is the HTTP method from the request line.

If the client sent:

```
POST /api/readings HTTP/1.1
```

Then:

```javascript
req.method === 'POST'
```

This maps directly to the request line. Express extracts it from the first line of the HTTP request.

**Important details:**

- It is always uppercase by convention (`'GET'`, `'POST'`, `'PUT'`, `'DELETE'`, etc.)
- It's a string, not an enum or constant
- You can use it for conditional logic or logging

**Your homestead example:**

```javascript
app.post('/api/temp', (req, res) => {
  console.log(`Received ${req.method} request`); // "Received POST request"
  
  if (req.method === 'POST') {
    // Handle POST
  }
  
  res.status(201).json({saved: true});
});
```

Your ESP32 sends `POST /api/temp`. Express extracts `POST` from the request line and puts it in `req.method`. You can use it to verify the method matches your route (though Express routing already does this).

### 2.2) req.path

The path portion of the URL, without query string, host, or scheme.

If the request line is:

```
GET /api/sensors/alpha HTTP/1.1
```

Then:

```javascript
req.path === '/api/sensors/alpha'
```

**What's excluded:**
- No host (`pi.local`)
- No scheme (`http://`)
- No query string (`?limit=10`)
- No fragment (`#section`)

**Just the path.** This is what Express uses for route matching.

**Your homestead example:**

```javascript
// ESP32 sends: GET /api/sensors/coop?limit=10 HTTP/1.1

app.get('/api/sensors/:id', (req, res) => {
  console.log(req.path);        // '/api/sensors/coop'
  console.log(req.params.id);  // 'coop'
  console.log(req.query.limit); // '10'
  
  res.json({sensor: 'coop', temp: 72.5});
});
```

The path is what Express matches against your route patterns. Query strings are parsed separately into `req.query`.

### 2.3) req.url

The full URL portion including query string.

If the request is:

GET /api/readings?limit=10 HTTP/1.1

Then:

req.url === '/api/readings?limit=10'

This includes the query string.

Most of the time you use req.path and req.query instead.

### 2.4) req.headers

An object containing all request headers. Express parses headers from the HTTP request and normalizes them.

If the raw request contains:

```
Host: pi.local
Accept: application/json
User-Agent: curl/8.0
Authorization: Bearer xyz123
```

Then:

```javascript
req.headers.host === 'pi.local'
req.headers.accept === 'application/json'
req.headers['user-agent'] === 'curl/8.0'
req.headers.authorization === 'Bearer xyz123'
```

**Important detail: Express lowercases header names.**

HTTP header names are case-insensitive (`Content-Type` = `content-type` = `CONTENT-TYPE`), but Express normalizes them all to lowercase for consistency.

**Common mistake:**

```javascript
// Wrong: Header names are lowercase
req.headers['Content-Type']  // undefined

// Correct: Use lowercase
req.headers['content-type'] // 'application/json'
```

**Access patterns:**

```javascript
// Dot notation (if header name has no hyphens)
req.headers.host
req.headers.accept

// Bracket notation (for headers with hyphens or special chars)
req.headers['content-type']
req.headers['user-agent']
req.headers['x-custom-header']
```

**Your homestead example:**

```javascript
app.post('/api/temp', (req, res) => {
  // Check Content-Type
  const contentType = req.headers['content-type'];
  if (contentType !== 'application/json') {
    return res.status(415).json({error: 'Unsupported Media Type'});
  }
  
  // Check Authorization
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  
  // Process request
  res.status(201).json({saved: true});
});
```

Your ESP32 sends headers. Express parses them and puts them in `req.headers` with lowercase keys. You can read them to validate requests, check authentication, or handle content negotiation.

### 2.5) req.query

Parsed query string parameters. Express parses the query string (everything after `?` in the URL) into an object.

If the request is:

```
GET /api/readings?limit=10&sensor=alpha&unit=F HTTP/1.1
```

Then:

```javascript
req.query === {
  limit: '10',
  sensor: 'alpha',
  unit: 'F'
}
```

**Critical: Values are always strings.**

Even if the query says `limit=10`, `req.query.limit` is `'10'` (string), not `10` (number).

**This matters for validation:**

```javascript
// Wrong: Assumes limit is a number
const limit = req.query.limit;
for (let i = 0; i < limit; i++) { // '10' coerced to number, but what if it's 'abc'?
  // ...
}

// Correct: Validate and convert explicitly
const limit = Number(req.query.limit);
if (Number.isNaN(limit) || limit < 1 || limit > 100) {
  return res.status(400).json({error: 'Invalid limit'});
}
// Now limit is a validated number
```

**Phase 0 rule: Boundaries validate. Convert types explicitly.**

Query strings are untrusted input. Always validate and convert types.

**Your homestead example:**

```javascript
// ESP32 sends: GET /api/sensors?limit=10&unit=F

app.get('/api/sensors', (req, res) => {
  // Validate limit
  const limit = Number(req.query.limit);
  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({error: 'Invalid limit'});
  }
  
  // Validate unit
  const unit = req.query.unit;
  if (unit && unit !== 'F' && unit !== 'C') {
    return res.status(400).json({error: 'Invalid unit'});
  }
  
  // Use validated values
  const sensors = getSensors(limit, unit);
  res.json({sensors});
});
```

Your ESP32 sends query parameters. Express parses them into `req.query` as strings. You must validate and convert them before using. This is boundary validation (Phase 0).

### 2.6) req.params

Route parameters extracted from the path. Express matches route patterns and extracts dynamic segments.

If you define a route:

```javascript
app.get('/api/sensors/:id', handler);
```

And the request is:

```
GET /api/sensors/alpha HTTP/1.1
```

Then:

```javascript
req.params.id === 'alpha'
```

**This is path pattern matching.**

The path `/api/sensors/:id` becomes a template. The `:id` is a placeholder. When Express matches `/api/sensors/alpha`, it extracts `'alpha'` and puts it in `req.params.id`.

**Multiple parameters:**

```javascript
app.get('/api/sensors/:sensorId/readings/:readingId', (req, res) => {
  console.log(req.params.sensorId);  // 'coop'
  console.log(req.params.readingId); // '12345'
  
  res.json({sensor: req.params.sensorId, reading: req.params.readingId});
});
```

Request: `GET /api/sensors/coop/readings/12345`
- `req.params.sensorId === 'coop'`
- `req.params.readingId === '12345'`

**Again: string values. Validate before using.**

Route parameters are always strings. They come from the URL path, which is untrusted input. Always validate.

**Your homestead example:**

```javascript
app.get('/api/sensors/:id', (req, res) => {
  const sensorId = req.params.id;
  
  // Validate sensor ID format
  if (!sensorId || sensorId.length > 50) {
    return res.status(400).json({error: 'Invalid sensor ID'});
  }
  
  // Check if sensor exists
  const sensor = getSensor(sensorId);
  if (!sensor) {
    return res.status(404).json({error: 'Sensor not found'});
  }
  
  res.json({sensor});
});
```

Your ESP32 requests `/api/sensors/esp32_coop`. Express extracts `'esp32_coop'` into `req.params.id`. You validate it, look it up, and return the sensor data. Route parameters are part of the boundary—validate them.

### 2.7) req.body

The request body. But only if you add body-parsing middleware.

**Without middleware:**

```javascript
app.post('/api/temp', (req, res) => {
  console.log(req.body); // undefined
});
```

`req.body === undefined` by default. This is deliberate. Express does not assume body format.

**If you expect JSON:**

```javascript
app.use(express.json());
```

Now Express parses JSON bodies automatically. When a client sends:

```
POST /api/temp HTTP/1.1
Content-Type: application/json
Content-Length: 15

{"temp": 72.5}
```

Then:

```javascript
req.body === { temp: 72.5 }
```

**Important details:**

1. **Content-Type must match:** `express.json()` only parses if `Content-Type: application/json`
2. **Malformed JSON causes error:** If JSON is invalid, `express.json()` throws an error (returns 400 by default)
3. **Body is parsed object:** `req.body` is a JavaScript object, not a string
4. **Body size limits:** Express has default body size limits (100kb for JSON)

**Common patterns:**

```javascript
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Now req.body is available
app.post('/api/temp', (req, res) => {
  const temp = req.body.temp; // Already parsed!
  res.status(201).json({saved: true});
});
```

**If the Content-Type is wrong or the JSON is malformed, you will get an error.**

That is boundary behavior. Express validates at the boundary. Invalid input is rejected.

**Your homestead example:**

```javascript
app.use(express.json()); // Add middleware

app.post('/api/temp', (req, res) => {
  // req.body is now available (if Content-Type is application/json)
  const { sensorId, temp } = req.body;
  
  // Validate body
  if (!sensorId || typeof temp !== 'number') {
    return res.status(400).json({error: 'Invalid payload'});
  }
  
  // Process
  saveTemperature(sensorId, temp);
  res.status(201).json({saved: true});
});
```

Your ESP32 sends `POST /api/temp` with JSON body. Without `express.json()`, `req.body` is `undefined`. With it, `req.body` contains the parsed object. This is boundary parsing—Express handles the parsing, but you must validate the data.

## 3) Mapping req Back to Raw HTTP

Take this raw HTTP request:

POST /api/readings?limit=5 HTTP/1.1
Host: pi.local
Content-Type: application/json
Accept: application/json

{"voltage":12.1}

Express translates it to:

req.method === 'POST'
req.path === '/api/readings'
req.query === { limit: '5' }
req.headers.host === 'pi.local'
req.headers['content-type'] === 'application/json'
req.body === { voltage: 12.1 }

No magic.
Just structured access.

If debugging ever feels mysterious,
print these values.
Compare to raw HTTP.
Make it mechanical again.

### 3.5) The Four-Step Process: How Express Processes Requests Through req and res

Every request in Express follows the same four-step process when working with req and res:

**Step 1: Express Creates req from Raw HTTP**
- Node.js receives raw HTTP request bytes over TCP
- Express parses the request line → extracts method and path into `req.method` and `req.path`
- Express parses headers → normalizes to lowercase and populates `req.headers`
- Express parses URL → extracts path into `req.path`, query string into `req.query`
- Express extracts route parameters → populates `req.params` (if route has `:id` patterns)
- Express provides request body as stream → `req.body` remains undefined until middleware parses it

**Step 2: Your Handler Reads from req**
- Express calls your route handler with `req` and `res` objects
- Your handler reads request data from `req` properties:
  - `req.method` - HTTP method (GET, POST, etc.)
  - `req.path` - URL path without query string
  - `req.query` - Parsed query string parameters (strings)
  - `req.params` - Route parameters (strings)
  - `req.headers` - Request headers (lowercase keys)
  - `req.body` - Request body (if body-parsing middleware added)
- Your handler validates and processes the request data

**Step 3: Your Handler Writes to res**
- Your handler constructs the response by calling methods on `res`:
  - `res.status(code)` - Sets HTTP status code
  - `res.set(name, value)` - Sets response headers
  - `res.json(data)` - Sends JSON body (sets Content-Type automatically)
  - `res.send(body)` - Sends body (infers Content-Type)
  - `res.redirect(url)` - Sends redirect response
- Order matters: set status and headers before sending body
- Once you call `res.json()` or `res.send()`, the response is sent

**Step 4: Express Builds HTTP Response from res**
- Express takes the values you set on `res`:
  - Status code from `res.statusCode` or `res.status()`
  - Headers from `res.getHeaders()` or `res.set()`
  - Body from `res.json()` or `res.send()`
- Express builds the HTTP response:
  - Status line: `HTTP/1.1 200 OK`
  - Headers: `Content-Type: application/json`, etc.
  - Blank line
  - Body: JSON string, text, etc.
- Express sends the response bytes back through Node.js to the client
- The request-response cycle completes

This process is deterministic. Every request follows these four steps. Understanding this flow makes req and res transparent—they're just structured access to HTTP.

Example flow for `POST /api/readings?limit=5` with body `{"temp": 72.5}`:

1. **Express Creates req:** Parses `POST /api/readings?limit=5 HTTP/1.1` → `req.method = 'POST'`, `req.path = '/api/readings'`, `req.query = {limit: '5'}`, `req.headers = {host: 'pi.local', 'content-type': 'application/json'}`, `req.body = undefined` (until middleware)

2. **Your Handler Reads from req:** Handler runs → reads `req.method`, `req.path`, `req.query.limit`, `req.body.temp` (after `express.json()` middleware parsed it)

3. **Your Handler Writes to res:** Handler calls `res.status(201).set('Cache-Control', 'no-store').json({saved: true})`

4. **Express Builds HTTP Response:** Express builds `HTTP/1.1 201 Created\nContent-Type: application/json\nCache-Control: no-store\n\n{"saved":true}` → Node.js sends response → client receives it

Understanding these four steps makes req and res transparent. They're just structured HTTP access—no magic, just organization.

## 4) The Response Object (res)

If req is the incoming boundary,
res is the outgoing boundary.

You construct an HTTP response by calling methods on res.

Express handles the protocol formatting.

### 4.1) res.status(code)

Sets the HTTP status code. This affects the status line in the HTTP response.

```javascript
res.status(404);
```

This affects the status line:

```
HTTP/1.1 404 Not Found
```

**Important: It does not send the response yet.** It just sets the code. You must still call `res.send()`, `res.json()`, or `res.end()` to actually send the response.

**Common pattern: Method chaining**

```javascript
res.status(200).json(data);
```

This sets the status code and sends the JSON body in one chain. Express methods return `res` for chaining.

**Status code categories (from Phase 2):**

- **2xx Success:** `200 OK`, `201 Created`, `204 No Content`
- **4xx Client Error:** `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `415 Unsupported Media Type`
- **5xx Server Error:** `500 Internal Server Error`, `503 Service Unavailable`

**Your homestead example:**

```javascript
app.post('/api/temp', (req, res) => {
  const { sensorId, temp } = req.body;
  
  if (!sensorId || typeof temp !== 'number') {
    return res.status(400).json({error: 'Invalid payload'}); // 400 Bad Request
  }
  
  const saved = saveTemperature(sensorId, temp);
  if (!saved) {
    return res.status(500).json({error: 'Failed to save'}); // 500 Server Error
  }
  
  res.status(201).json({saved: true}); // 201 Created
});
```

Status codes communicate outcomes. Use them intentionally. Express makes it easy to set them, but you must choose the right code for each situation.

### 4.2) res.send(body)

Sends a response body. Express infers the Content-Type based on what you pass.

**If you pass a string:**

```javascript
res.send('Hello');
```

Express sets:

```
Content-Type: text/html; charset=utf-8
```

**If you pass an object:**

```javascript
res.send({ voltage: 12.1 });
```

Express sends JSON and sets:

```
Content-Type: application/json
```

**If you pass a Buffer:**

```javascript
res.send(Buffer.from('binary data'));
```

Express sets:

```
Content-Type: application/octet-stream
```

**res.send() is flexible.** Express tries to infer the right Content-Type. But being explicit is often better.

**Why prefer res.json() for APIs:**

```javascript
// Less clear: Express infers JSON
res.send({ voltage: 12.1 });

// More explicit: You're sending JSON
res.json({ voltage: 12.1 });
```

For APIs, `res.json()` is clearer. It explicitly sets `Content-Type: application/json` and stringifies the object. For HTML or text, `res.send()` is fine.

**Your homestead example:**

```javascript
// Health endpoint - text is fine
app.get('/health', (req, res) => {
  res.send('OK'); // Content-Type: text/html
});

// API endpoint - prefer res.json()
app.get('/api/voltage', (req, res) => {
  const voltage = readVoltage();
  res.json({ voltage }); // Content-Type: application/json (explicit)
});
```

Use `res.send()` when Content-Type inference is fine. Use `res.json()` when you want explicit JSON. Clarity matters.

### 4.3) res.json(data)

Explicit JSON response. This is the preferred method for API endpoints.

```javascript
res.json({ voltage: 12.1 });
```

**This does four things:**
1. **Sets status to 200** (if not already set)
2. **Sets Content-Type to `application/json`** (explicitly)
3. **Stringifies the object** (converts JavaScript object to JSON string)
4. **Sends the body** (ends the response)

**Clear and predictable.** You know exactly what you're sending.

**For APIs, prefer res.json().**

**Why res.json() over res.send() for APIs:**

```javascript
// res.send() - Express infers JSON
res.send({ voltage: 12.1 }); // Works, but less explicit

// res.json() - Explicit JSON
res.json({ voltage: 12.1 }); // Clear intent, explicit Content-Type
```

**Method chaining:**

```javascript
res.status(201)
   .set('Cache-Control', 'no-store')
   .json({ saved: true });
```

**Your homestead example:**

```javascript
app.get('/api/sensors/:id', (req, res) => {
  const sensor = getSensor(req.params.id);
  
  if (!sensor) {
    return res.status(404).json({error: 'Sensor not found'}); // Explicit JSON
  }
  
  res.json({sensor}); // Explicit JSON, status defaults to 200
});
```

Your ESP32 expects JSON. Use `res.json()` to be explicit. It sets the right Content-Type, stringifies the object, and sends it. No ambiguity.

### 4.4) res.set(name, value)

Sets a response header. This modifies the outgoing HTTP headers.

```javascript
res.set('Cache-Control', 'max-age=60');
```

**This adds to the response headers:**

```
Cache-Control: max-age=60
```

**Common use cases:**

1. **Caching control:**
   ```javascript
   res.set('Cache-Control', 'max-age=60');
   res.set('ETag', '"v1.0"');
   ```

2. **Content-Type (if not using res.json()):**
   ```javascript
   res.set('Content-Type', 'application/json');
   res.send(JSON.stringify(data));
   ```

3. **Custom headers:**
   ```javascript
   res.set('X-Request-ID', 'abc123');
   res.set('X-Rate-Limit-Remaining', '99');
   ```

4. **CORS headers:**
   ```javascript
   res.set('Access-Control-Allow-Origin', '*');
   ```

**Method chaining:**

```javascript
res.status(200)
   .set('Cache-Control', 'no-store')
   .set('ETag', '"v1.0"')
   .json({data: 'value'});
```

**Setting multiple headers:**

```javascript
res.set({
  'Cache-Control': 'max-age=60',
  'ETag': '"v1.0"',
  'X-Custom': 'value'
});
```

**Your homestead example:**

```javascript
app.get('/api/voltage', (req, res) => {
  const voltage = readVoltage();
  const etag = `"v${voltage}"`;
  
  // Check If-None-Match header for caching
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end(); // Not Modified
  }
  
  res.status(200)
     .set('Cache-Control', 'max-age=5') // Cache for 5 seconds
     .set('ETag', etag)                  // Version identifier
     .json({voltage});
});
```

Headers control caching, content negotiation, and metadata. Use `res.set()` to set them explicitly. Express builds the HTTP response with your headers.

### 4.5) res.redirect(url)

Sends a redirect.

res.redirect('/new-location');

This sets:
	•	Status code (default 302)
	•	Location header

Equivalent to raw HTTP:

HTTP/1.1 302 Found
Location: /new-location

You can override the status:

res.redirect(301, '/new-location');


## 5) Building a Proper Response

A complete response may include:
	•	Status code
	•	Headers
	•	Body

Example:

app.get('/api/voltage', (req, res) => {
  const voltage = 12.1;

  res.status(200)
     .set('Cache-Control', 'no-store')
     .json({ voltage });
});

This generates:
	•	Status: 200
	•	Header: Cache-Control: no-store
	•	Header: Content-Type: application/json
	•	JSON body

This is just structured HTTP.

## 6) Response Termination

Once you send a response, the request cycle ends.

Calling:

res.send(...)

Or:

res.json(...)

Ends the response.

If you forget to send a response,
the client hangs until timeout.

If you send twice,
Express throws an error.

One request → one response.

That invariant still holds.

## 7) Order Matters in Response Construction

You must set status and headers before sending.

Correct:

res.status(201).json(data);

Incorrect:

res.json(data);
res.status(201); // too late

Once the body is sent, headers are locked.

This maps directly to HTTP structure:

Status line → headers → blank line → body.

After body starts, headers cannot change.

## 8) Common Mistakes at the Boundary

### 8.1) Trusting Input

**The mistake:**

```javascript
const limit = req.query.limit;

// limit is a string ('10'), not a number
for (let i = 0; i < limit; i++) {
  // JavaScript coerces '10' to 10, but what if limit is 'abc'?
  // What if limit is '999999999999999'?
  // What if limit is undefined?
}
```

This may behave unpredictably. JavaScript type coercion can hide bugs.

**The fix: Convert explicitly**

```javascript
const limit = Number(req.query.limit);
if (Number.isNaN(limit) || limit < 1 || limit > 100) {
  return res.status(400).json({ error: 'Invalid limit' });
}
// Now limit is a validated number
```

**Phase 0: validate at the boundary.**

All input is untrusted. All input is strings (or undefined). Validate presence, type, range, and format.

**Your homestead example:**

```javascript
app.get('/api/sensors', (req, res) => {
  // Validate limit
  const limit = Number(req.query.limit);
  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({error: 'Invalid limit'});
  }
  
  // Validate unit
  const unit = req.query.unit;
  if (unit && unit !== 'F' && unit !== 'C') {
    return res.status(400).json({error: 'Invalid unit'});
  }
  
  // Use validated values
  const sensors = getSensors(limit, unit);
  res.json({sensors});
});
```

Your ESP32 sends query parameters. They're strings. Validate them before using. This is boundary validation (Phase 0).

### 8.2) Forgetting Body Parsing

You define:

app.post('/api/temp', (req, res) => {
  console.log(req.body.temp);
});

But req.body is undefined.

Because you forgot:

app.use(express.json());

Express does not parse bodies automatically.

That’s not a bug.
It’s explicit design.

### 8.3) Not Handling Missing Data

If the client sends malformed JSON,
express.json() throws an error.

If you don’t handle it,
Express sends 400 by default.

Understand what middleware does.
Understand what errors it produces.

## 9) Homestead Example: Sensor Endpoint

Imagine your ESP32 posts temperature readings:

```
POST /api/readings HTTP/1.1
Host: pi.local
Content-Type: application/json
Content-Length: 30

{"sensor":"coop","temp":72.5}
```

**Complete Express handler:**

```javascript
const express = require('express');
const app = express();

// Add body parsing middleware
app.use(express.json());

// Sensor reading endpoint
app.post('/api/readings', (req, res) => {
  // Step 1: Read from req
  const { sensor, temp } = req.body;
  
  // Step 2: Validate at boundary
  if (!sensor || typeof sensor !== 'string') {
    return res.status(400).json({ error: 'Invalid sensor ID' });
  }
  
  if (typeof temp !== 'number' || temp < -40 || temp > 150) {
    return res.status(400).json({ error: 'Invalid temperature' });
  }
  
  // Step 3: Process (save to database, etc.)
  const saved = saveReading(sensor, temp);
  
  if (!saved) {
    return res.status(500).json({ error: 'Failed to save' });
  }
  
  // Step 4: Write to res
  res.status(201)
     .set('Location', `/api/readings/${sensor}`)
     .json({ status: 'stored', sensor, temp });
});

app.listen(3000);
```

**This demonstrates:**
- **Reads body:** `req.body` contains parsed JSON (thanks to `express.json()`)
- **Validates at boundary:** Checks presence, type, and range
- **Returns 400 on bad input:** Invalid data gets clear error response
- **Returns 201 on success:** Created status with Location header
- **Returns 500 on server error:** Database failures get server error

**Clean. Mechanical. Predictable.**

Every request follows the same pattern:
1. Read from `req`
2. Validate at boundary
3. Process (business logic)
4. Write to `res`

This is boundary discipline. `req` is untrusted input. `res` is controlled output. Validate everything. Return clear status codes.

## 10) req and res as Structured HTTP

Everything in Phase 2 still exists.

Raw HTTP request line → req.method, req.path
Raw HTTP headers → req.headers
Raw HTTP body → req.body
Raw HTTP status line → res.status()
Raw HTTP response headers → res.set()
Raw HTTP body → res.send() / res.json()

Express is not inventing new concepts.
It is giving you structured access.

If you understand the protocol,
Express becomes transparent.

## 11) Anchor Takeaway

req is the incoming HTTP request, structured.
res is the outgoing HTTP response, constructed.

Every property maps to HTTP.
Every method builds HTTP.

If debugging feels confusing,
translate back to raw HTTP.
Then forward to Express.

Nothing mystical.
Just boundaries, structured.

Next: Chapter 3.4 — Routing Fundamentals.
Where we explore how Express matches requests,
why route order matters,
and how to structure real APIs without accidental 404s or shadowed routes.