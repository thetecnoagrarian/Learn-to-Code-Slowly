# Phase 2 · Chapter 2.15: Headers — Overview and Purpose

This chapter builds on [Chapter 2.1: Request-Response](Chapter_2.1_Request-Response.md), [Chapter 2.2: HTTP on TCP](Chapter_2.2_HTTP_on_TCP.md), [Chapter 2.3: What HTTP Is](Chapter_2.3_What_HTTP_Is.md), [Chapter 2.4: HTTP as Text](Chapter_2.4_HTTP_as_Text.md), [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.6: Request Structure](Chapter_2.6_Request_Structure.md), [Chapter 2.7: The Request Line](Chapter_2.7_The_Request_Line.md), [Chapter 2.8: Response Structure](Chapter_2.8_Response_Structure.md), [Chapter 2.9: Status Codes Overview](Chapter_2.9_Status_Codes_Overview.md), [Chapter 2.10: Status Codes — Success and Redirects](Chapter_2.10_Status_Codes_Success_and_Redirects.md), [Chapter 2.11: Status Codes — Client and Server Errors](Chapter_2.11_Status_Codes_Client_and_Server_Errors.md), [Chapter 2.12: Errors vs Failures](Chapter_2.12_Errors_vs_Failures.md), [Chapter 2.13: HTTP Methods](Chapter_2.13_HTTP_Methods.md), and [Chapter 2.14: Safety and Idempotency](Chapter_2.14_Safety_and_Idempotency.md).

Headers are not decoration.
They are not optional fluff.
They are how HTTP works beyond “send bytes.”

The request line and status line establish what is happening.
Headers establish how it should be interpreted, controlled, cached, authenticated, negotiated, retried, or rejected.

If you misunderstand headers, you will misunderstand HTTP. Chapter 2.6 showed request structure; Chapter 2.8 showed response structure; this chapter focuses on headers—the metadata that controls how HTTP behaves. Whether your ESP32 sends authentication credentials, your dashboard negotiates content formats, or your Pi controls caching—headers are the control surface of HTTP.


## 1) What Headers Actually Are

Headers are key–value metadata attached to a request or response.

They:
	•	Describe the body (e.g., `Content-Type: application/json`)
	•	Control behavior (e.g., `Cache-Control: no-cache`)
	•	Carry credentials (e.g., `Authorization: Bearer xyz`)
	•	Enable caching (e.g., `ETag: "abc123"`)
	•	Signal capabilities (e.g., `Accept: application/json`)
	•	Negotiate formats (e.g., `Accept-Language: en`)
	•	Encode constraints (e.g., `If-None-Match: "abc123"`)

They do not replace the body.
They frame the body.

Example: Your ESP32 sends `POST /api/temp` with body `{"temp": 72.5}` and headers `Content-Type: application/json`, `Content-Length: 15`, `Authorization: Bearer xyz`. The headers frame the body—they describe it (JSON), control behavior (15 bytes), and carry credentials (auth token). Headers don't replace the body—they frame it.


## 2) Headers Live at the Boundary

Phase 0.8: boundaries are where validation lives.

In HTTP:
	•	The request crosses from client → server
	•	Headers are part of that boundary
	•	They are untrusted input

Every header must be treated as:

“Data supplied by something outside my control.”


## 3) Headers Are Not Payload

Headers are not the message itself.
	•	The body is the payload
	•	Headers describe how to interpret the payload
	•	Headers modify how the exchange behaves

Confusing headers with body data leads to broken designs.

Example: Your ESP32 sends `POST /api/temp` with body `{"temp": 72.5, "sensor_id": "esp32_coop"}` and header `Content-Type: application/json`. The body is the payload (temperature data), the header describes how to interpret it (JSON). Don't put `{"temp": 72.5}` in a header—that's payload, not metadata. Headers are control, body is content.


## 4) Headers Exist Because HTTP Is Generic

HTTP does not know:
	•	What your data means
	•	What format it is
	•	How it should be cached
	•	Who is allowed to see it

Headers provide that context.

Without headers, HTTP would be uselessly vague.

Example: Your ESP32 sends `POST /api/temp` with body `{"temp": 72.5}`. HTTP doesn't know what this means—is it JSON? XML? Plain text? How should it be cached? Who's allowed to see it? Headers provide context: `Content-Type: application/json` (format), `Cache-Control: no-cache` (caching), `Authorization: Bearer xyz` (permissions). Without headers, HTTP is uselessly vague.


## 5) Request Headers vs Response Headers

Headers mean different things depending on direction.
	•	Request headers: client → server (e.g., `Authorization`, `Accept`)
	•	Response headers: server → client (e.g., `Set-Cookie`, `Location`)

Some headers are valid in both directions (e.g., `Content-Type`, `Content-Length`).
Some are not (e.g., `Authorization` is request-only, `Set-Cookie` is response-only).

Example: Your ESP32 sends `GET /api/voltage` with `Accept: application/json` (request header—client preference). Your Pi responds with `Content-Type: application/json` (response header—server description). Or both use `Content-Type`—request describes what you're sending, response describes what you're returning. Direction matters.


## 6) Request Headers: Client Intent and Capabilities

Request headers typically communicate:
	•	Who the client is (e.g., `User-Agent: ESP32-Sensor/1.0`)
	•	What it can accept (e.g., `Accept: application/json`)
	•	How it wants the server to behave (e.g., `Cache-Control: no-cache`)
	•	What credentials it presents (e.g., `Authorization: Bearer xyz`)
	•	How the request should be handled (e.g., `Connection: keep-alive`)

They express intent, not truth.

Example: Your ESP32 sends `GET /api/voltage` with `User-Agent: ESP32-Sensor/1.0` (who I am), `Accept: application/json` (what I can accept), `Authorization: Bearer xyz` (credentials I present). These express intent—the ESP32 wants JSON, claims to be ESP32-Sensor/1.0, presents a token. But they're not truth—validate everything, don't trust blindly.


## 7) Common Request Headers

Examples:
	•	Host (e.g., `Host: pi.local`)
	•	User-Agent (e.g., `User-Agent: HomesteadDashboard/1.0`)
	•	Accept (e.g., `Accept: application/json`)
	•	Authorization (e.g., `Authorization: Bearer xyz`)
	•	Content-Type (e.g., `Content-Type: application/json`)
	•	Content-Length (e.g., `Content-Length: 24`)
	•	Cookie (e.g., `Cookie: session=abc123`)

Each exists for a specific reason.

Example: Your ESP32 sends `GET /api/voltage` with `Host: pi.local`, `User-Agent: ESP32-Sensor/1.0`, `Accept: application/json`. These headers tell your Pi who's asking, what format is acceptable, and which host to route to.


## 8) Response Headers: Server Description and Control

Response headers typically communicate:
	•	What the server returned (e.g., `Content-Type: application/json`)
	•	How to interpret it (e.g., `Content-Length: 24`)
	•	Whether it may be cached (e.g., `Cache-Control: max-age=60`)
	•	Whether the client should store state (e.g., `Set-Cookie: session=abc123`)
	•	What to do next (e.g., `Location: /api/sensors/esp32_coop`)

They are instructions, not suggestions.

Example: Your Pi responds to `GET /api/voltage` with `Content-Type: application/json` (what I returned), `Content-Length: 24` (how to interpret it), `Cache-Control: max-age=60` (cache for 60 seconds), `ETag: "abc123"` (use this for conditional requests). These are instructions—your dashboard must obey them. Not suggestions—instructions.


## 9) Common Response Headers

Examples:
	•	Content-Type (e.g., `Content-Type: application/json`)
	•	Content-Length (e.g., `Content-Length: 24`)
	•	Cache-Control (e.g., `Cache-Control: no-cache`)
	•	Set-Cookie (e.g., `Set-Cookie: session=abc123`)
	•	Location (e.g., `Location: /api/sensors/esp32_coop`)
	•	ETag (e.g., `ETag: "abc123"`)

Clients are expected to obey them.

Example: Your Pi responds to `GET /api/voltage` with `Content-Type: application/json`, `Content-Length: 24`, `Cache-Control: max-age=60`. Your dashboard must obey these headers—parse JSON, read exactly 24 bytes, cache for 60 seconds.


## 10) Some Headers Exist in Both Directions

Certain headers apply symmetrically.

Examples:
	•	Cache-Control (request: client preferences; response: server instructions)
	•	Content-Type (request: what you're sending; response: what you're returning)
	•	Content-Length (request: body size you're sending; response: body size you're returning)
	•	Connection (request: connection preferences; response: connection behavior)

The meaning depends on direction.

Example: Your ESP32 sends `POST /api/temp` with `Content-Type: application/json` (request—what I'm sending). Your Pi responds with `Content-Type: application/json` (response—what I'm returning). Same header name, different direction, different meaning. Or `Cache-Control: no-cache` in request (client preference) vs response (server instruction).


## 11) Headers Are the Protocol’s Extension Point

HTTP is deliberately conservative.

Instead of changing the core grammar:
	•	New behavior is added via headers
	•	Old clients can ignore unknown headers
	•	New clients can opt into new features

This is how HTTP evolves without breaking everything.


## 12) Why Headers Beat New Syntax

Changing the request line would:
	•	Break parsers
	•	Break proxies
	•	Break caches

Adding headers:
	•	Preserves compatibility
	•	Enables gradual adoption
	•	Keeps the protocol stable

Headers are evolutionary pressure relief.

Example: Adding idempotency keys via header `Idempotency-Key: abc123` preserves compatibility—old clients ignore it, new clients use it. Changing the request line from `GET /api/voltage HTTP/1.1` to `GET /api/voltage HTTP/2.0` breaks everything—parsers break, proxies break, caches break. Headers are evolutionary pressure relief—add features without breaking compatibility.

Example: Adding idempotency keys via header `Idempotency-Key: abc123` preserves compatibility—old clients ignore it, new clients use it. Changing the request line from `GET /api/voltage HTTP/1.1` to `GET /api/voltage HTTP/2.0` breaks everything—parsers break, proxies break, caches break. Headers are evolutionary pressure relief—add features without breaking compatibility.


## 13) Headers Are Case-Insensitive (Names Only)

Header names are case-insensitive:
	•	Content-Type
	•	content-type
	•	CONTENT-TYPE

All equivalent.

Header values may be case-sensitive depending on semantics.

Example: Your ESP32 sends `content-type: application/json` and your Pi receives it as `Content-Type: application/json`—same header, different casing, equivalent. Or `CONTENT-TYPE: application/json`—still equivalent. But the value `application/json` is case-sensitive—`Application/Json` is different. Header names are case-insensitive, values depend on semantics.


## 14) Why Case-Insensitivity Matters

Because:
	•	Different implementations format differently
	•	Humans type them manually
	•	Proxies rewrite them

The protocol does not care about capitalization.

Example: Your ESP32 sends `content-type: application/json` (lowercase), your Pi normalizes it to `Content-Type: application/json` (Title-Case), a proxy rewrites it to `CONTENT-TYPE: application/json` (uppercase). All equivalent—the protocol doesn't care. Or humans type headers manually—typos in capitalization don't break things. Case-insensitivity makes HTTP robust.


## 15) Headers Are Line-Based Text

Each header is:

```
Name: value
```

	•	One header per line
	•	Colon separates name from value
	•	Optional whitespace around the value

Simple by design.

Example: Your ESP32 sends:
```
Host: pi.local
Content-Type: application/json
Content-Length: 24
```

One header per line, colon separates name from value. Simple by design.


## 16) Headers Are Parsed Before the Body

The server:
	1.	Reads request line
	2.	Reads headers
	3.	Encounters blank line
	4.	Decides how (or whether) to read body

Headers control body parsing.

Example: Your ESP32 sends `POST /api/temp` with headers `Content-Type: application/json`, `Content-Length: 15`, then blank line, then body `{"temp": 72.5}`. Your Pi reads the request line first, then headers, then blank line, then uses `Content-Length: 15` to know exactly how many bytes to read. Headers control body parsing—they tell the server how to read the body before the body arrives.


## 17) Content-Type: The Most Important Header

Content-Type answers one question:

“What does this body mean?”

Without it, the body is just bytes.


## 18) Content-Length: How Much to Read

Content-Length tells the receiver:
	•	Exactly how many bytes belong to the body

Without it, the receiver cannot safely parse the stream.

Example: Your ESP32 sends `POST /api/temp` with body `{"temp": 72.5}` and `Content-Length: 15`. Your Pi reads exactly 15 bytes, then stops. Without `Content-Length`, your Pi doesn't know when the body ends—does it wait for more? Does it hang? Content-Length makes streaming safe.


## 19) Headers Enable Streaming Safety

Because HTTP rides on TCP:
	•	The body is a byte stream
	•	Headers tell you where it ends

This prevents:
	•	Hanging reads
	•	Truncated parsing
	•	Protocol confusion

Example: Your ESP32 sends `POST /api/temp` with `Content-Length: 15` and body `{"temp": 72.5}`. Your Pi reads exactly 15 bytes, then stops—knows the body is complete. Without `Content-Length`, your Pi doesn't know when the body ends—does it wait for more? Does it hang? Headers enable streaming safety—they tell you where the stream ends.


## 20) Headers Can Be Forged

Never forget:
	•	Clients control request headers
	•	Browsers can be spoofed
	•	Scripts can lie
	•	Proxies can alter data

Headers are claims—not facts.

Example: Your ESP32 sends `User-Agent: ESP32-Sensor/1.0`—but it could be lying, it could be a script spoofing the User-Agent. Or sends `Authorization: Bearer valid_token`—but it could be forged, it could be stolen. Headers are claims—not facts. Validate everything, trust nothing. Headers can be forged—treat them as untrusted input.


## 21) Never Trust Headers Blindly

You must validate:
	•	Presence (e.g., is `Authorization` present?)
	•	Format (e.g., is `Authorization: Bearer <token>` format correct?)
	•	Allowed values (e.g., is the token valid? Not expired?)
	•	Consistency with other headers (e.g., does `Content-Type` match `Accept`?)
	•	Consistency with the body (e.g., does `Content-Length` match actual body size?)

Headers are input.

Example: Your ESP32 sends `Authorization: Bearer esp32_token_xyz`. Your Pi validates: is it present? Yes. Is format correct? Yes (`Bearer <token>`). Is token valid? Check database. Is token expired? Check timestamp. Headers are input—validate everything. Never trust headers blindly.


## 22) Host Header: Virtual Routing

Host tells the server:

“Which site am I trying to reach?”

Without it:
	•	One IP cannot host multiple sites
	•	Virtual hosting breaks

HTTP/1.1 requires it.


## 23) User-Agent: Identity Without Authority

User-Agent describes the client.

It:
	•	Helps debugging
	•	Helps analytics
	•	Sometimes triggers workarounds

It should never be trusted for security decisions.

Example: Your ESP32 sends `User-Agent: ESP32-Sensor/1.0`. Your Pi logs this for debugging—"ESP32-Sensor/1.0 requested voltage." Or your dashboard sends `User-Agent: HomesteadDashboard/1.0`. Helps analytics—which clients are using your API? But never trust it for security—clients can lie. User-Agent is descriptive, not authoritative.


## 24) Accept: Client Preferences

Accept tells the server:

“These formats are acceptable to me.”

It enables:
	•	Content negotiation
	•	Multiple representations
	•	Graceful degradation


## 25) Authorization: Credentials at the Boundary

Authorization carries credentials.

Examples:
	•	Basic (e.g., `Authorization: Basic base64(username:password)`)
	•	Bearer tokens (e.g., `Authorization: Bearer xyz`)
	•	Custom schemes (e.g., `Authorization: Custom scheme123`)

This header is extremely sensitive.

Example: Your ESP32 sends `GET /api/sensors` with `Authorization: Bearer esp32_token_xyz`. Your Pi validates the token and allows access. Or your dashboard sends `Authorization: Basic base64(admin:password)`. This header is extremely sensitive—it carries credentials. Protect it, validate it, never log it.


## 26) Headers Can Change Semantics Entirely

The same request line with different headers may:
	•	Authenticate or not (e.g., with/without `Authorization`)
	•	Cache or not (e.g., with/without `Cache-Control`)
	•	Return JSON or HTML (e.g., with `Accept: application/json` vs `Accept: text/html`)
	•	Be accepted or rejected (e.g., with valid/invalid `Authorization`)

Headers are not secondary—they are decisive.

Example: Your dashboard sends `GET /api/voltage` with `Accept: application/json`—gets JSON. Or sends the same request with `Accept: text/html`—gets HTML. Or with `Authorization: Bearer xyz`—authenticated. Or without—`401 Unauthorized`. Same request line, different headers, completely different semantics. Headers are decisive—they change everything.


## 27) Headers Enable Statelessness

HTTP is stateless because:
	•	State is carried in headers
	•	Tokens, cookies, etags, versions

The server does not remember you—you bring context each time.

Example: Your ESP32 sends `GET /api/sensors` with `Authorization: Bearer esp32_token_xyz` (token in header), `Cookie: session=abc123` (session in header), `If-None-Match: "etag123"` (version in header). Your Pi doesn't remember the ESP32—the ESP32 brings context each time via headers. Headers enable statelessness—state is carried in headers, not server memory.


## 28) Cookies Are Headers

Cookies are just headers:
	•	Set-Cookie (response) (e.g., `Set-Cookie: session=abc123; Path=/`)
	•	Cookie (request) (e.g., `Cookie: session=abc123`)

They are not magic.
They are structured metadata.

Example: Your Pi responds to `POST /api/login` with `Set-Cookie: session=abc123; Path=/; HttpOnly`. Your dashboard stores this cookie. Next request, your dashboard sends `Cookie: session=abc123`. Cookies are just headers—not magic, just structured metadata. `Set-Cookie` sets state, `Cookie` carries state.


## 29) Headers Control Caching

Caching behavior is almost entirely header-driven.

Examples:
	•	Cache-Control (e.g., `Cache-Control: max-age=60`)
	•	ETag (e.g., `ETag: "abc123"`)
	•	If-None-Match (e.g., `If-None-Match: "abc123"`)
	•	Expires (e.g., `Expires: Wed, 31 Jan 2024 12:00:00 GMT`)

Without headers, caching would be unsafe.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: max-age=60`, `ETag: "abc123"`. Your dashboard caches for 60 seconds. Next request, your dashboard sends `If-None-Match: "abc123"`. Your Pi responds `304 Not Modified`—use cache. Headers control caching—without them, caching would be unsafe (when to cache? when to invalidate?).


## 30) Headers Control Redirection

Location tells the client:

“Go here instead.”

The status code tells why.
The header tells where.


## 31) Headers Control Connection Behavior

Connection, Keep-Alive, and related headers tell intermediaries:
	•	Whether the connection should persist (e.g., `Connection: keep-alive`)
	•	Whether it may be reused (e.g., `Keep-Alive: timeout=60`)

This matters for performance and correctness.

Example: Your ESP32 sends `GET /api/voltage` with `Connection: keep-alive`. Your Pi keeps the connection open for reuse. Or sends `Connection: close`—close after this request. Or your Pi responds with `Keep-Alive: timeout=60`—reuse connection for 60 seconds. Headers control connection behavior—persistence, reuse, timeouts. This matters for performance (reuse connections) and correctness (know when to close).


## 32) Headers Are Read by More Than Servers

Headers are interpreted by:
	•	Browsers (e.g., `Set-Cookie` → store cookie)
	•	Proxies (e.g., `Cache-Control` → cache or not)
	•	Load balancers (e.g., `Host` → route to server)
	•	Gateways (e.g., `Authorization` → forward or reject)
	•	Caches (e.g., `ETag` → cache validation)
	•	Firewalls (e.g., `User-Agent` → allow or block)

Your server is not the only reader.

Example: Your ESP32 sends `GET /api/voltage` with `Host: pi.local`. A load balancer reads `Host` and routes to the correct server. Or a proxy reads `Cache-Control` and decides whether to cache. Or a firewall reads `User-Agent` and decides whether to allow. Your server is not the only reader—headers are interpreted by many intermediaries.


## 33) Headers Must Be Designed for Intermediaries

If your system breaks when a proxy:
	•	Reorders headers
	•	Adds headers
	•	Removes headers
	•	Normalizes casing

Then the design is brittle.

Example: Your ESP32 sends `GET /api/voltage` with `content-type: application/json` (lowercase). A proxy normalizes it to `Content-Type: application/json` (Title-Case). Your Pi must handle both—if it breaks on casing differences, the design is brittle. Or a proxy reorders headers—your Pi must handle any order. Headers must be designed for intermediaries—they will modify headers, normalize them, reorder them. Design defensively.


## 34) Headers Can Be Repeated

Some headers may appear multiple times.

Examples:
	•	Set-Cookie (e.g., `Set-Cookie: session=abc123` and `Set-Cookie: theme=dark`)
	•	Accept (e.g., `Accept: application/json` and `Accept: text/plain`—usually combined)
	•	Warning (e.g., multiple warnings)

You must handle this correctly.

Example: Your Pi responds to `POST /api/login` with `Set-Cookie: session=abc123` and `Set-Cookie: theme=dark`. Your dashboard receives two cookies—must handle both. Or your ESP32 sends `Accept: application/json` and `Accept: text/plain`—usually combined into `Accept: application/json, text/plain`, but may appear separately. Headers can be repeated—handle this correctly.


## 35) Header Order Is Not Semantically Meaningful

Headers:
	•	May be reordered (e.g., proxy reorders `Host` and `Accept`)
	•	May be merged (e.g., `Accept: application/json` and `Accept: text/plain` → `Accept: application/json, text/plain`)
	•	May be split (e.g., long header value split across lines)

Never rely on order.

Example: Your ESP32 sends `Host: pi.local` then `Accept: application/json`. A proxy reorders to `Accept: application/json` then `Host: pi.local`. Your Pi must handle both orders—never rely on order. Or headers may be merged or split—handle all cases. Header order is not semantically meaningful—don't rely on it.


## 36) Headers Are Not Guaranteed to Be Present

Never assume:
	•	A header exists
	•	A header is non-empty
	•	A header is well-formed

Missing headers are normal.

Example: Your ESP32 sends `GET /api/voltage` without `Accept` header. Your Pi must handle this—missing headers are normal. Or sends `Authorization:` (empty value). Or sends `Authorization: invalid format`. Never assume headers exist, are non-empty, or are well-formed. Missing headers are normal—design defensively.


## 37) Headers Are Optional Unless Required

Some headers are required by spec:
	•	Host in HTTP/1.1 (e.g., `Host: pi.local`)

Most are optional.

Design defensively.

Example: Your ESP32 sends `GET /api/voltage`—must include `Host: pi.local` (required in HTTP/1.1). Or sends `POST /api/temp`—`Content-Type` is optional (but recommended), `Content-Length` is optional (but recommended), `Authorization` is optional (but may be required by your API). Most headers are optional—design defensively, handle missing headers gracefully.


## 38) Headers vs Query Parameters

Headers:
	•	Are metadata
	•	Are not part of resource identity

Query parameters:
	•	Are part of the URI
	•	Often affect caching and routing

Do not confuse them.

Example: Your dashboard sends `GET /api/voltage?unit=V` with `Accept: application/json`. Query parameter `unit=V` is part of the URI (resource identity), header `Accept` is metadata (format preference). Or `GET /api/voltage` with `Authorization: Bearer xyz`. Header `Authorization` is metadata (credentials), not part of resource identity. Keep them separate.


## 39) Headers vs Body Fields

Body fields:
	•	Belong to the resource or command

Headers:
	•	Belong to the protocol exchange

Keep that boundary clean.

Example: Your ESP32 sends `POST /api/temp` with body `{"temp": 72.5, "sensor_id": "esp32_coop"}` and header `Content-Type: application/json`. Body fields (`temp`, `sensor_id`) belong to the resource/command, header (`Content-Type`) belongs to the protocol exchange. Keep that boundary clean—don't put resource data in headers, don't put protocol metadata in body.


## 40) Headers Are Control, Not Content

If it describes:
	•	Format (e.g., `Content-Type: application/json`)
	•	Permissions (e.g., `Authorization: Bearer xyz`)
	•	Caching (e.g., `Cache-Control: max-age=60`)
	•	Encoding (e.g., `Content-Encoding: gzip`)
	•	Negotiation (e.g., `Accept: application/json`)

It probably belongs in a header.

Example: Your ESP32 sends `POST /api/temp` with body `{"temp": 72.5}`. Format? `Content-Type: application/json` (header). Permissions? `Authorization: Bearer xyz` (header). Caching? `Cache-Control: no-cache` (header). The body contains content (`temp: 72.5`), headers contain control (format, permissions, caching). Headers are control, not content.


## 41) Headers Are the Web’s Control Plane

The request line is what.
The body is data.
Headers are control.

They orchestrate:
	•	Safety
	•	Performance
	•	Security
	•	Compatibility


## 42) Why Headers Are Hard to Learn

Because:
	•	They are numerous (dozens of standard headers, plus custom ones)
	•	They interact subtly (e.g., `Cache-Control` interacts with `ETag`, `Expires`)
	•	Their effects are indirect (e.g., `Accept` affects response format, not directly visible)
	•	They involve intermediaries (e.g., proxies, caches modify headers)

But they are unavoidable.

Example: Your ESP32 sends `GET /api/voltage` with `Accept: application/json`, `Cache-Control: no-cache`, `If-None-Match: "abc123"`. These headers interact subtly—`Accept` affects format, `Cache-Control` affects caching, `If-None-Match` affects conditional requests. Their effects are indirect—you don't see them directly, but they control everything. Headers are hard to learn but unavoidable.


## 43) Headers Encode Assumptions

Every header says:

“I assume the other side understands this.”

Misaligned assumptions cause failure.


## 44) Phase 0 Revisited

This chapter is Phase 0.8 applied to HTTP:
	•	Headers are boundary input (e.g., untrusted data from client)
	•	Validate everything (e.g., format, presence, consistency)
	•	Absence is normal (e.g., missing headers are expected)
	•	Failure must be handled (e.g., invalid headers, malformed values)
	•	Meaning lives in structure (e.g., `Name: value` format)

Example: Your ESP32 sends `Authorization: Bearer xyz`—boundary input, validate it. Or sends request without `Accept`—absence is normal, handle it. Or sends `Authorization: invalid format`—failure must be handled. Or sends `Content-Type: application/json`—meaning lives in structure (`Name: value`). Phase 0.8 applied to HTTP—headers are boundary input, validate everything.


## Reflection
Pick one HTTP exchange you’ve seen.
	•	Which headers are required?
	•	Which are optional?
	•	Which affect behavior?
	•	Which are ignored?
	•	Which must be validated?

If you can answer that, you understand the boundary.


## Core Understanding
Headers are key–value metadata that:
	•	Control HTTP behavior
	•	Describe bodies
	•	Enable statelessness
	•	Carry credentials
	•	Enable caching and negotiation
	•	Extend the protocol safely

They are input.
They must be validated.
They are the control surface of HTTP.


## What's Next
Next: Chapter 2.16 — Headers: Content and Type, where we zoom in on:
	•	Content-Type
	•	Content-Length
	•	Accept
	•	Encoding and negotiation

This is where “bytes on the wire” become meaningful data.