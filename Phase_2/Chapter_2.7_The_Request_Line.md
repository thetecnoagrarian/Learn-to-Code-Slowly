# Phase 2 · Chapter 2.7: The Request Line

The request line is the first line of every HTTP request.

Nothing comes before it.
Nothing can be understood without it.
If it is malformed, the request fails immediately.

This single line defines what the client wants, where it wants it, and which rules apply. Everything else in the request—headers, body, semantics—depends on this line being correct. Chapter 2.6 showed the overall request structure; this chapter zooms into the first line. Whether your dashboard fetches voltage from the Pi, your ESP32 reports temperature, or your coop controller checks fence status—the request line structure is the same.


## 1) The Request Line Is Mandatory

Every HTTP request begins with exactly one request line.

If the server does not receive a valid request line:
	•	It cannot parse headers
	•	It cannot determine intent
	•	It cannot respond meaningfully

The request line is not optional.
It is not implied.
It must be explicit.


## 2) The Request Line Has Exactly Three Parts

The request line always contains three components, in this order:
	1.	Method
	2.	Path
	3.	HTTP version

They are separated by single spaces.

Example:

```
GET /api/temp HTTP/1.1
```

No more.
No less.


## 3) Formal Grammar of the Request Line

In formal terms:

METHOD SP REQUEST-TARGET SP HTTP-VERSION CRLF

Where:
	•	SP is a single space character
	•	CRLF ends the line

This grammar is strict.


## 4) Why the Order Matters

Servers parse requests sequentially.

They expect:
	•	The method first
	•	Then the path
	•	Then the version

If the order is wrong, parsing fails.

The server does not guess.
It does not reorder.
It does not infer.


## 5) The Method Comes First

The first token on the request line is the method.

Examples:

GET
POST
PUT
PATCH
DELETE

The method tells the server what kind of operation the client is requesting.


## 6) Methods Are Verbs, Not Suggestions

Methods are not labels.
They are not documentation.
They are not hints.

They are semantic instructions.

A server may:
	•	Accept a method
	•	Reject a method
	•	Treat different methods differently

But it will not ignore the method.


## 7) Method Names Are Case-Sensitive by Convention

The HTTP specification treats methods as case-sensitive tokens.

In practice:
	•	Methods are always uppercase
	•	Lowercase methods may be rejected
	•	Mixed-case methods are unsafe

Always use uppercase.


## 8) Common HTTP Methods

The most commonly used methods are:
	•	GET — retrieve a representation
	•	POST — submit data or create a resource
	•	PUT — replace a resource entirely
	•	PATCH — modify a resource partially
	•	DELETE — remove a resource

Each has distinct semantics.
They are not interchangeable.


## 9) GET: Retrieval Only

GET requests:
	•	Retrieve data
	•	Should not change server state
	•	Often have no body

Example:

GET /api/voltage HTTP/1.1

The client is asking:

“Give me the representation of /api/voltage.”


## 10) POST: Submit or Create

POST requests:
	•	Send data to the server
	•	Often create resources
	•	Often include a body

Example:

```
POST /api/temp HTTP/1.1
```

The client (your ESP32 sensor) is saying:

"Here is temperature data. Store it or process it."


## 11) PUT: Replace

PUT requests:
	•	Replace the entire target resource
	•	Are idempotent (in principle)

Example:

```
PUT /api/config HTTP/1.1
```

The client (your dashboard) is saying:

"This configuration should now look exactly like this." (e.g., updating all sensor settings at once)


## 12) PATCH: Partial Update

PATCH requests:
	•	Modify part of a resource
	•	Do not replace the whole thing

Example:

```
PATCH /api/fence HTTP/1.1
```

The client (your coop controller) is saying:

"Change the fence voltage threshold, leave other settings alone."


## 13) DELETE: Removal

DELETE requests:
	•	Ask the server to remove a resource

Example:

```
DELETE /api/sensors/old_sensor_id HTTP/1.1
```

The client (your dashboard) is saying:

"Remove this sensor from the system."


## 14) The Method Does Not Guarantee Behavior

Important boundary rule:

The method expresses intent.
The server decides behavior.

A server may:
	•	Ignore semantics
	•	Reject methods
	•	Treat GET as mutating (bad, but possible)

HTTP defines meaning.
Servers enforce policy.


## 15) The Path Comes Second

The second component of the request line is the path.

Example:

```
/api/voltage
/api/temp
/api/fence_status
```

The path identifies the request target. Your Pi might map `/api/voltage` to a voltage sensor, `/api/temp` to a temperature sensor, `/api/fence_status` to the poultry net energizer.


## 16) The Path Is Not a URL

The request line path does not include:
	•	Scheme (http://)
	•	Host (pi.local, coop.local)
	•	Port (:443, :8080)

Those live elsewhere.

Only the path (and optional query) appears here.


## 17) Absolute Paths Are Standard

In HTTP/1.1, the request line usually uses an absolute path:

```
GET /api/voltage HTTP/1.1
```

The host is specified separately in the `Host` header (e.g., `Host: pi.local`). Your dashboard sends `GET /api/voltage HTTP/1.1` with `Host: pi.local`—the request line has the path, the header has the hostname.


## 18) Query Strings Are Part of the Path

This is still a single path token:

```
GET /api/voltage?unit=V&precision=2 HTTP/1.1
GET /api/temp?location=coop HTTP/1.1
```

Everything after `?` is included in the request line path. Your dashboard might query `/api/voltage?unit=V` to get voltage in volts, or `/api/temp?location=coop` to get the coop temperature.

HTTP does not parse query strings.
That is application logic. The server receives the full path including query string and decides how to interpret it.


## 19) The Path Is Opaque to HTTP

HTTP does not care what the path “means.”

It does not know:
	•	Whether it refers to a file
	•	Whether it refers to a resource
	•	Whether it refers to an action

It is just text.


## 20) The Server Interprets the Path

The same path can mean different things on different servers.

Example:
	•	/api/temp on your Pi → JSON temperature reading
	•	/api/temp on your solar logger → JSON solar panel temp
	•	/api/temp on a different server → 404 Not Found

The path is a name, not a guarantee.


## 21) Paths Are Case-Sensitive (Usually)

Most servers treat paths as case-sensitive:
	•	/API/voltage ≠ /api/voltage

This is server-dependent, but assume case-sensitive unless documented otherwise.


## 22) Paths Can Encode Hierarchy

Paths often imply hierarchy:

```
/api/sensors
/api/sensors/1
/api/sensors/1/readings
```

But this hierarchy is conventional, not enforced by HTTP. Your Pi might map `/api/sensors/1` to sensor ID 1, or it might treat it as a flat identifier—the server decides.


## 23) Trailing Slashes Matter

These are different paths:

/api/voltage
/api/voltage/

Some servers normalize.
Some do not.
Do not assume equivalence.


## 24) The Version Comes Third

The third component is the HTTP version.

Example:

HTTP/1.1

This tells the server which protocol rules apply.


## 25) The Version Is Not Cosmetic

The version affects:
	•	Required headers
	•	Connection behavior
	•	Parsing rules
	•	Defaults

A server may behave very differently depending on version.


## 26) HTTP/1.0 vs HTTP/1.1

Key differences:
	•	HTTP/1.1 requires Host
	•	HTTP/1.1 defaults to keep-alive
	•	HTTP/1.0 closes connections by default

The request line declares which model to use.


## 27) Version Must Match Server Capability

If the server does not support the version:
	•	It may reject the request
	•	It may downgrade behavior
	•	It may close the connection

Clients should not lie about versions.


## 28) Whitespace Rules Are Strict

Between components:
	•	Exactly one space
	•	No tabs
	•	No extra spaces

This is invalid:

```
GET  /api/voltage HTTP/1.1
```

Two spaces between `GET` and `/api/voltage`—parsing fails.

So is this:

```
GET /api/voltage  HTTP/1.1
```

Two spaces between `/api/voltage` and `HTTP/1.1`—parsing fails.

Your ESP32 must send exactly one space between each component, or the Pi will reject the request.



## 29) CRLF Terminates the Line

The request line must end with CRLF.

This marks the end of the line and the beginning of headers.

Without CRLF:
	•	The server keeps reading
	•	Parsing fails


## 30) A Minimal Valid Request Line

This is the smallest valid request line:

```
GET / HTTP/1.1
```

Everything else in the request builds on this. Your dashboard might send `GET / HTTP/1.1` to fetch the root resource, or `GET /api/voltage HTTP/1.1` to fetch voltage—same structure, different path.


## 31) The Request Line Defines the Parsing Context

Once the server reads the request line, it knows:
	•	Whether to expect a body
	•	Which headers are required
	•	How to interpret the rest of the message

This is why it must come first.


## 32) The Request Line Is a Boundary

Phase 0 boundary principle applies here:
	•	The request line is the first boundary crossing
	•	Malformed input should be rejected immediately
	•	Validation begins here


## 33) Errors at the Request Line Level

Common request-line errors:
	•	Unknown method (e.g., `FETCH /api/voltage HTTP/1.1`—`FETCH` is not a valid method)
	•	Missing path (e.g., `GET  HTTP/1.1`—no path between method and version)
	•	Unsupported version (e.g., `GET /api/voltage HTTP/2.0`—server only supports 1.1)
	•	Invalid spacing (e.g., `GET  /api/voltage HTTP/1.1`—two spaces)

These usually result in:
	•	400 Bad Request
	•	Immediate connection close

Example: Your ESP32 sends `GET  /api/temp HTTP/1.1` (two spaces). The Pi's server sees malformed request line, responds `400 Bad Request`, closes connection.


## 34) Proxies and the Request Line

Proxies sometimes use a different request target form:

```
GET http://pi.local/api/voltage HTTP/1.1
```

This is advanced and out of scope for now, but worth knowing exists. Your homestead might use a reverse proxy that forwards requests to the Pi using this form.


## 35) Frameworks Always Generate This Line

Every HTTP library you use:
	•	Constructs the request line
	•	Validates spacing
	•	Inserts the version

Understanding this line lets you debug library behavior.


## 36) The Request Line Is Not Repeated

Within a single request:
	•	There is exactly one request line
	•	Headers follow
	•	Body follows

If you see multiple request lines, something is wrong.


## 37) Mental Model: Command Envelope

Think of the request line as:
	•	The command on the envelope
	•	Telling the server how to open it
	•	And what to do next

Everything else is inside.


## 38) If You Can Read the Request Line, You Can Debug HTTP

Given a raw request, ask:
	•	What is the method? (GET, POST, etc.)
	•	What is the path? (`/api/voltage`, `/api/temp`, etc.)
	•	What version rules apply? (HTTP/1.1 requires `Host` header, defaults to keep-alive)

Example: Your dashboard sends `GET /api/voltage HTTP/1.0` but the Pi expects HTTP/1.1. The server might reject it or downgrade behavior. Check the version in the request line.

Most HTTP bugs become obvious immediately when you inspect the request line.


## Reflection
If a server responds with “405 Method Not Allowed,” which part of the request line caused that?

If a request works in one environment but not another, could the path or version be different?

If a server says “400 Bad Request,” what might be malformed in the request line?


## Core Understanding

The request line is the first line of every HTTP request.

It has exactly three parts:
	•	Method — what the client wants to do
	•	Path — what the client is targeting
	•	HTTP version — which protocol rules apply

Separated by single spaces.
Terminated by CRLF.
Parsed before anything else.

If the request line is wrong, nothing else matters.

This chapter builds on Chapter 2.1 (request-response), 2.2 (HTTP on TCP), 2.3 (what HTTP is), 2.4 (HTTP as text), 2.5 (statelessness and connection lifecycle), and 2.6 (request structure). Next: Chapter 2.8 — Response Structure, where we switch sides—from client to server—and examine how responses are constructed, parsed, and terminated.