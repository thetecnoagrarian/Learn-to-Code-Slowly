## Phase 3 · Chapter 3.5: Route Parameters and Query Strings

This chapter builds on:
	•	Chapter 3.4: Routing Fundamentals￼
	•	Chapter 2.18: URLs, Paths, and Query Strings￼

You now understand how Express matches a request to a route. But most real routes are not static. They must handle dynamic data.

This chapter answers:
	•	How do you capture values from the URL path?
	•	How do you extract filters and options from the query string?
	•	How do you validate and safely use that data?

Dynamic routing is how one route becomes many resources.

## 1) Two Kinds of URL Data

There are two primary ways data appears in a URL:

1. Route Parameters (Path Segments)

/api/sensors/alpha
/api/panels/south-array

The value identifies the resource.

2. Query Strings (After ?)

/api/sensors?limit=10&unit=F
/api/fence/voltage?since=midnight

The values modify the request.

These serve different architectural purposes:
	•	Parameters identify resources.
	•	Query strings modify retrieval behavior.

This distinction matters.

Express treats them differently. The route path is matched against the path only — query strings are not part of the route. So `/api/sensors/:id` matches both `GET /api/sensors/alpha` and `GET /api/sensors/alpha?limit=10`. Same route, same handler. The query string does not affect which route runs. See the Express routing guide in resources for details.

## 2) Route Parameters

Route parameters are defined using : inside a path pattern.

app.get('/api/sensors/:id', (req, res) => {
  const sensorId = req.params.id;
  res.json({ sensor: getSensor(sensorId) });
});

If a client requests:

GET /api/sensors/alpha

Express matches the route and extracts:

req.params = {
  id: 'alpha'
}

The :id placeholder becomes the key in req.params.

Homestead case: your dashboard requests `GET /api/panels/south-array` or `GET /api/energizer/main` — one route, many resources. The param identifies which panel or energizer; the handler fetches that specific resource.

## 3) Multiple Route Parameters

Routes can contain multiple dynamic segments:

app.get('/api/buildings/:building/sensors/:sensor', (req, res) => {
  const building = req.params.building;
  const sensor = req.params.sensor;

  res.json({ building, sensor });
});

Request:

GET /api/buildings/coop/sensors/alpha
GET /api/buildings/pig-barn/sensors/dht22-north

Produces:

req.params = {
  building: 'coop',
  sensor: 'alpha'
}

Each :name in the path becomes a property.

## 4) Parameter Naming Discipline

Parameter names are arbitrary — but naming affects clarity.

app.get('/api/sensors/:sensorId', handler);

Now:

req.params.sensorId

This is clearer than :id when:
	•	You have nested resources.
	•	You have multiple IDs in one route.
	•	You want architectural clarity.

Names are part of the API contract.

## 5) Query Strings

Query strings begin after ? and are key-value pairs separated by &.

Example:

/api/sensors?limit=10&unit=F

Express automatically parses them:

app.get('/api/sensors', (req, res) => {
  const limit = req.query.limit;
  const unit = req.query.unit;

  res.json({ sensors: getSensors(limit, unit) });
});

Express produces:

req.query = {
  limit: '10',
  unit: 'F'
}


## 6) Important: Query Values Are Always Strings

Even if the client sends:

?limit=10

Express gives you:

req.query.limit === '10'

Not a number.

You must convert:

const limit = parseInt(req.query.limit, 10);

Or for booleans:

const enabled = req.query.enabled === 'true';

Never assume type correctness.

### 6.1) Handle Missing or Invalid Query Values

Optional query parameters may be absent. A client might request `/api/sensors` with no query at all. Then `req.query.limit` is `undefined`. `parseInt(undefined, 10)` returns `NaN`. If you pass `NaN` to a database or logic layer, you get brittle behavior.

Provide sensible defaults:

const limit = parseInt(req.query.limit, 10) || 10;
const unit = req.query.unit || 'F';

Or validate and reject:

const limit = parseInt(req.query.limit, 10);
if (isNaN(limit) || limit < 1 || limit > 100) {
  return res.status(400).json({ error: 'limit must be 1–100' });
}

What breaks: NaN silently propagating, or defaulting when the client intended a different value. Defensive parsing prevents both.

## 7) When to Use Parameters vs Query Strings

This is architectural, not stylistic.

### Use Route Parameters For:
	•	Identifying a specific resource.
	•	Required path segments.

Examples:

/api/sensors/alpha
/api/panels/south-array
/api/energizer/main

These URLs represent specific entities.

### Use Query Strings For:
	•	Filtering
	•	Sorting
	•	Pagination
	•	Optional behavior modifiers

Examples:

/api/sensors?limit=10
/api/panels?status=active
/api/fence/voltage?since=midnight

Query strings modify how you retrieve data.

## 8) Combining Parameters and Query Strings

These are often used together. Same pattern for sensor readings, solar production logs, or fence voltage history.

app.get('/api/sensors/:id/readings', (req, res) => {
  const sensorId = req.params.id;
  const limit = parseInt(req.query.limit, 10);
  const from = req.query.from;

  res.json({
    sensor: sensorId,
    readings: getReadings(sensorId, limit, from)
  });
});

Request:

GET /api/sensors/alpha/readings?limit=10&from=1700

Now:
	•	alpha identifies the resource.
	•	limit and from modify retrieval.

## 9) Validation Is Not Optional

Both req.params and req.query are untrusted input.

Never trust them blindly.

app.get('/api/sensors/:id', (req, res) => {
  const id = req.params.id;

  if (!id || id.length === 0) {
    return res.status(400).json({ error: 'Invalid sensor ID' });
  }

  const sensor = getSensor(id);

  if (!sensor) {
    return res.status(404).json({ error: 'Sensor not found' });
  }

  res.json({ sensor });
});

Defensive patterns:
	•	Check existence.
	•	Check type.
	•	Check format.
	•	Handle missing resources.

Every time.

### 9.1) Common Failure Modes

What breaks when you skip validation:

1. **Empty or whitespace IDs.** A client sends `GET /api/sensors/ ` or `GET /api/sensors//`. Route params may capture empty or odd values. Your lookup fails or returns wrong data.

2. **Path traversal attempts.** A malicious client sends `GET /api/sensors/../../../etc/passwd`. If you later use the param in file paths or SQL, you risk injection. Validate format — allow only known characters (e.g. alphanumeric, hyphen) and reject the rest.

3. **Oversized or malformed values.** Very long IDs, weird Unicode, or control characters can break logging, storage, or downstream systems. Enforce length and character set.

4. **Confusing params with query.** Putting filters in the path (`/api/sensors/limit/10`) or resource IDs in the query (`?id=alpha`) works technically, but violates REST conventions. Clients and future maintainers will struggle. Use parameters for identity, query for modifiers.

When you add SQLite or other storage later, these validated values become the inputs to parameterized queries. Getting validation right here prevents SQL injection and data corruption downstream.

## 10) URL Encoding and Decoding

Clients must URL-encode special characters:

Character	Encoded
Space	%20 or +
&	%26
=	%3D

Express automatically decodes parameters and query strings.

But your ESP32, browser, or client must encode correctly.

Example:

/api/sensors/temperature%20probe

Becomes:

req.params.id === 'temperature probe'

Encoding errors lead to broken routes.

### 10.1) What Breaks Without Encoding

Your DHT22 sensor in the cow barn might have a friendly label: "Temp Probe North". Spaces, slashes, and ampersands are special in URLs. If the client sends the raw string, the path becomes ambiguous. The server may parse it incorrectly or match the wrong route.

Use `encodeURIComponent` on the client before building the URL. On the server, Express decodes automatically — you receive the original string. Double encoding (encoding an already-encoded string) produces mangled values. Encode once, decode once.

Homestead case: ESP32 or MicroPython clients posting to `/api/readings` with sensor names like `coop/dht22-north` must encode the slash. Otherwise the path looks like a nested resource and routing fails.

## 11) Mental Model

When a request arrives:

GET /api/sensors/alpha?limit=10

Express performs:
	1.	Route matching (/api/sensors/:id)
	2.	Parameter extraction → req.params
	3.	Query parsing → req.query
	4.	Handler execution

Routing decides which function runs.
Parameters and query strings decide what data that function receives.

This pattern generalizes. MQTT topics use a similar hierarchy — `homestead/coop/temp` vs `homestead/pig-barn/temp` — where the path segments identify the resource. URLs and MQTT both separate identity (path) from modifiers (query or message payload). The mental model transfers.

## 12) Architectural Implications

As your system grows:
	•	Parameters define hierarchical resources.
	•	Query strings define retrieval behavior.
	•	Consistent patterns reduce cognitive load.
	•	Clear URL structure becomes self-documenting.

Bad URL design leads to brittle APIs.

Good URL design feels obvious.

### Reflection

Parameters answer "which one." Query strings answer "how to get it." Mix them and your API becomes a maze. Keep them distinct and your routes become predictable — whether you're fetching a sensor reading, solar panel status, or fence voltage history. One route, many resources. One contract, many clients.

## What's Next

Next: Chapter 3.6 — Sending Responses Correctly

Where you’ll learn:
	•	res.status()
	•	res.json()
	•	res.send()
	•	res.redirect()
	•	Proper HTTP status code discipline
	•	Response structure consistency

You now know how to extract input from the URL — parameters for identity, query for modifiers, validation always.

Next, you'll learn how to respond properly — because correct output is just as important as correct routing.