# Phase 2 · Chapter 2.19: Request Bodies and Content Types

This chapter builds on [Chapter 2.1: Request-Response](Chapter_2.1_Request-Response.md), [Chapter 2.2: HTTP on TCP](Chapter_2.2_HTTP_on_TCP.md), [Chapter 2.3: What HTTP Is](Chapter_2.3_What_HTTP_Is.md), [Chapter 2.4: HTTP as Text](Chapter_2.4_HTTP_as_Text.md), [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.6: Request Structure](Chapter_2.6_Request_Structure.md), [Chapter 2.7: The Request Line](Chapter_2.7_The_Request_Line.md), [Chapter 2.8: Response Structure](Chapter_2.8_Response_Structure.md), [Chapter 2.9: Status Codes Overview](Chapter_2.9_Status_Codes_Overview.md), [Chapter 2.10: Status Codes — Success and Redirects](Chapter_2.10_Status_Codes_Success_and_Redirects.md), [Chapter 2.11: Status Codes — Client and Server Errors](Chapter_2.11_Status_Codes_Client_and_Server_Errors.md), [Chapter 2.12: Errors vs Failures](Chapter_2.12_Errors_vs_Failures.md), [Chapter 2.13: HTTP Methods](Chapter_2.13_HTTP_Methods.md), [Chapter 2.14: Safety and Idempotency](Chapter_2.14_Safety_and_Idempotency.md), [Chapter 2.15: Headers — Overview and Purpose](Chapter_2.15_Headers_Overview.md), [Chapter 2.16: Headers — Content and Type](Chapter_2.16_Headers_Content_and_Type.md), [Chapter 2.17: Headers — Caching and Control](Chapter_2.17_Headers_Caching_and_Control.md), and [Chapter 2.18: URLs, Paths, and Query Strings](Chapter_2.18_URLs_Paths_and_Query_Strings.md).

Up to now, we have focused on URLs, methods, headers, and structure.
Those tell the server what resource and what action.

Now we reach the moment where data itself crosses the boundary.

The request body is where:
	•	Meaningful data enters the system
	•	Validation becomes critical
	•	Parsing decisions determine correctness or failure
	•	Security issues are born if mistakes are made

This chapter is about payloads—what they are, when they exist, how they are interpreted, and why Content-Type is not optional. Chapter 2.18 covered URLs and identity; Chapter 2.16 covered Content-Type and Content-Length as headers. Here we focus on the request body itself—when it exists, how JSON and form and multipart differ, and why validation at the boundary is non-negotiable. Whether your ESP32 posts temperature as JSON, your dashboard submits forms or uploads files, or your Pi rejects malformed or mismatched Content-Type—bodies are where data crosses the boundary and where mistakes become bugs or security issues.



## 1) The Request Body Is Optional — but Dangerous

Not every request has a body.

Some requests:
	•	Never need one
	•	Should not have one
	•	Will be ignored if one is present

Other requests:
	•	Are meaningless without one
	•	Fail if the body is malformed
	•	Fail if the Content-Type is wrong

Understanding when bodies belong is foundational.

Example: Your ESP32 sends `GET /api/voltage`—no body needed. Sends `POST /api/temp` with body `{"temp": 72.5}`—meaningless without body; wrong Content-Type or malformed JSON and the Pi rejects it. Or your dashboard: GET has no body; POST/PUT/PATCH require bodies. Understanding when bodies belong is foundational.



## 2) Which Methods Commonly Use Bodies

By convention and practice:
	•	GET → no body
	•	DELETE → usually no body
	•	POST → body required or expected
	•	PUT → body required
	•	PATCH → body required

The spec does not forbid bodies on GET—but most servers ignore them.

Conventions exist for a reason.

Example: Your ESP32 sends `GET /api/voltage`—no body by convention; if you send a body, proxies may drop it, caches ignore it, your Pi may discard it. Or your dashboard: GET with body breaks expectations. Conventions exist for a reason.



## 3) GET and Bodies: Why This Is a Trap

Technically:
	•	HTTP does not forbid a GET body

Practically:
	•	Proxies drop it
	•	Caches ignore it
	•	Servers discard it
	•	Frameworks don’t expose it

Using a GET body breaks expectations.

If data is complex, use POST.

Example: Your ESP32 needs to send a time range and sensor ID—use `POST /api/readings` with a JSON body, not GET with a body. Or your dashboard submitting a config form: use POST. Using a GET body breaks expectations; if data is complex, use POST.



## 4) Bodies Carry Meaning, Not Metadata

Headers describe.
Bodies contain.

This distinction matters.

Examples:
	•	Content-Type → metadata
	•	Authorization → metadata
	•	JSON payload → meaning

Do not confuse the two.

Example: Your ESP32 sends `Content-Type: application/json` (metadata) and body `{"temp": 72.5, "sensor_id": "esp32_coop"}` (meaning). Headers describe; bodies contain. Or your dashboard: Authorization is metadata, JSON payload is meaning. Do not confuse the two.



## 5) The Body Is Just Bytes

At the lowest level:
	•	The body is a sequence of bytes
	•	No structure is implied
	•	No meaning exists yet

Meaning only emerges after parsing.

Example: Your Pi receives raw bytes for `POST /api/temp`; until it parses with Content-Type application/json, there is no meaning—just bytes. Or your ESP32 sends JSON; the body is a sequence of bytes until the server parses it. Meaning only emerges after parsing.



## 6) Content-Type Gives Meaning to Bytes

Without Content-Type:
	•	The server does not know how to interpret the body
	•	Parsing becomes guessing
	•	Guessing becomes bugs

Content-Type answers:

“What do these bytes represent?”

Example: Your ESP32 sends `POST /api/temp` with `Content-Type: application/json`—tells the Pi how to interpret the body. Without it, the server does not know; parsing becomes guessing, guessing becomes bugs. Or your dashboard sends a body without Content-Type—server may reject with 400. Content-Type gives meaning to bytes.



## 7) Content-Type Is a Contract

When a client sends:

Content-Type: application/json

It is asserting:
	•	The body is valid JSON
	•	The encoding matches expectations
	•	The server can parse accordingly

If this is false, the client is lying.

Example: Your ESP32 sends `Content-Type: application/json` but body is `temp=72.5` (form-encoded)—client is lying; your Pi attempts JSON parse, fails, returns 400. Or your dashboard sends wrong Content-Type—server rejects. Content-Type is a contract; if false, the client is lying.



## 8) Parsing Happens at the Boundary

Phase 0.8: validation lives at boundaries.

Request bodies cross the hardest boundary:
	•	Untrusted
	•	Arbitrary
	•	User-controlled

Parsing must be defensive.

Example: Your Pi receives `POST /api/temp` with body from the network—untrusted, arbitrary, possibly attacker-controlled. Parse defensively: validate structure, then semantics, then apply logic. Or your ESP32 receives responses—bodies cross the hardest boundary; parsing must be defensive.



## 9) application/json — The Modern Default

application/json is the most common API payload type today.

Characteristics:
	•	Text-based
	•	Human-readable
	•	Structured
	•	Language-agnostic

Example header:

Content-Type: application/json

Example: Your ESP32 sends `POST /api/temp` with `Content-Type: application/json` and body `{"temp": 72.5}`. Or your dashboard sends `PUT /api/config` with the same header. application/json is the modern default for APIs. Example header: Content-Type: application/json




## 10) What a JSON Body Looks Like

Raw bytes:

```
{"voltage":12.1,"timestamp":"2025-01-30"}
```

Important:
	•	Strings must be quoted
	•	Numbers are not quoted
	•	Booleans are lowercase
	•	No trailing commas



## 11) JSON Is Strict

This fails:

{voltage: 12.1}

This fails:

{"voltage": 12.1,}

Parsing errors are client errors.

Example: Your ESP32 sends `POST /api/temp` with body `{voltage: 12.1}` (unquoted key)—invalid JSON; your Pi returns 400 Bad Request. Or `{"temp": 72.5,}` (trailing comma)—parsing error, client error. JSON is strict; parsing errors are client errors.



## 12) JSON Parsing Is All-or-Nothing

If JSON parsing fails:
	•	The entire request body is unusable
	•	Partial parsing is not acceptable
	•	The server must reject the request

Typical response:

400 Bad Request

Example: Your ESP32 sends malformed JSON to `POST /api/temp`—your Pi responds 400 Bad Request. Or your dashboard sends invalid JSON to the Pi—entire body unusable, server must reject. Typical response: 400 Bad Request.




## 13) JSON Maps Cleanly to Native Types

After parsing:
	•	Objects → dictionaries
	•	Arrays → lists
	•	Numbers → integers/floats
	•	Strings → strings
	•	true/false → booleans
	•	null → None

But type validation is still required.

Example: Your Pi parses JSON and gets `{"voltage": 12.1}`—objects to dicts, numbers to floats. But it must still validate: is voltage a number? In range? Or your ESP32: JSON maps to native types; type validation is still required.



## 14) JSON Does Not Enforce Schema

JSON only enforces structure—not meaning.

This is valid JSON:

{"voltage": "banana"}

Validation must check:
	•	Presence
	•	Type
	•	Range
	•	Semantics

Example: Your Pi receives `{"voltage": "banana"}`—valid JSON but wrong type. Must validate presence (voltage there?), type (number?), range (0–20?), semantics (sensible?). Or your dashboard: JSON does not enforce schema; validation must check all of these.



## 15) application/x-www-form-urlencoded

This is the classic HTML form encoding.

Header:

Content-Type: application/x-www-form-urlencoded

Body:

voltage=12.1&timestamp=2025-01-30




## 16) URL Encoding Rules Apply

Form bodies use URL encoding:
	•	Space → + or %20
	•	& → %26
	•	= → %3D

The same encoding rules as query strings.

Example: Your dashboard submits a form with `Content-Type: application/x-www-form-urlencoded` and body `threshold=75&unit=F`. Space becomes + or %20, & and = encoded. Or your ESP32 sends form data—URL encoding rules apply. The same encoding rules as query strings.



## 17) Form Encoding Is Flat

Characteristics:
	•	Key–value only
	•	No nesting
	•	No arrays (without conventions)
	•	All values are strings

Good for simple forms, bad for structured data.

Example: Your dashboard submits `threshold=75&unit=F`—key–value only, no nesting, all strings. Or your ESP32 sends simple config as form data. Form encoding is flat; good for simple forms, bad for structured data.



## 18) JSON vs Form Encoding

JSON:
	•	Structured
	•	Typed
	•	Nested
	•	Explicit

Form encoding:
	•	Simple
	•	Flat
	•	String-only
	•	Legacy-friendly

Choose based on complexity.

Example: Your ESP32 sends simple key-value config: form encoding is fine. Sends nested sensor payload: use JSON. Or your dashboard: simple form → form encoding; structured data → JSON. JSON vs form encoding—choose based on complexity.



## 19) multipart/form-data

Used primarily for file uploads.

Header example:

Content-Type: multipart/form-data; boundary=-XYZ

The body is split into parts.

Example: Your dashboard uploads a config file with `Content-Type: multipart/form-data; boundary=----XYZ`. Body has parts—e.g. file bytes and metadata. Or your ESP32 uploading a firmware chunk. Multipart: body split into parts.



## 20) Multipart Bodies Are Complex

Each part:
	•	Has its own headers
	•	Has its own Content-Type
	•	Has raw binary or text content

This allows:
	•	Files
	•	Metadata
	•	Mixed content

Example: Your dashboard uploads a config file—one part with Content-Type application/octet-stream (file), another with form field (name). Or your ESP32 sends firmware chunk in one part, metadata in another. Multipart bodies are complex; each part has its own headers and content.



## 21) Why Multipart Exists

Because:
	•	Files cannot be JSON easily
	•	Binary data breaks text encodings
	•	Multiple payloads need separation

Multipart solves this.

Example: Your dashboard uploads a log file—files cannot be JSON easily, binary breaks text encodings. Multipart allows files + metadata in one request. Or your Pi accepts firmware upload via multipart. Why multipart exists: files, binary, multiple payloads; multipart solves this.



## 22) Multipart Boundaries Matter

The boundary string:
	•	Separates parts
	•	Must not appear in content
	•	Is chosen by the client

Parsing fails if boundaries are wrong.

Example: Your Pi receives multipart with boundary ----XYZ; if the body contains ----XYZ in the content, parsing breaks. Or your ESP32 sends wrong boundary—server fails. Multipart boundaries matter; parsing fails if boundaries are wrong.



## 23) Multipart Is Hard to Implement Correctly

Many bugs live here:
	•	Incorrect boundaries
	•	Incorrect content lengths
	•	Memory exhaustion
	•	Security vulnerabilities

Use well-tested libraries.

Example: Your Pi parses multipart with a framework or library—do not hand-roll it. Incorrect boundaries, content lengths, memory exhaustion, and security bugs are common. Or your ESP32: use a proven HTTP client. Multipart is hard to implement correctly; use well-tested libraries.



## 24) Content-Length vs Transfer-Encoding

Bodies must have a length.

Either:
	•	Content-Length specifies size
	•	Transfer-Encoding: chunked streams data

Servers must handle both.

Example: Your Pi receives `POST /api/temp` with `Content-Length: 15` (fixed size) or `Transfer-Encoding: chunked` (streamed). It must handle both. Or your dashboard sends chunked upload—server must support it. Content-Length vs Transfer-Encoding: servers must handle both.



## 25) Chunked Encoding Changes Parsing

Chunked bodies:
	•	Arrive in pieces
	•	End with a zero-length chunk
	•	Require streaming parsers

This matters for large payloads.

Example: Your dashboard streams a large log upload with Transfer-Encoding: chunked—body arrives in pieces, ends with zero-length chunk; your Pi needs a streaming parser. Or your ESP32 sends chunked body—server must handle it. Chunked encoding changes parsing; this matters for large payloads.



## 26) Content-Encoding Is Separate

Example:

Content-Encoding: gzip

This means:
	•	Body is compressed
	•	Must be decompressed before parsing
	•	Happens before Content-Type parsing

Order matters.

Example: Your ESP32 sends body with `Content-Encoding: gzip` and `Content-Type: application/json`—your Pi must decompress first, then parse JSON. Or your dashboard receives gzipped response: decode then parse. Content-Encoding is separate; order matters.



## 27) Charset Matters for Text

Example:

Content-Type: application/json; charset=utf-8

This tells the server:
	•	How to decode bytes into characters
	•	UTF-8 is default but should be explicit

Wrong charset = corrupted data.

Example: Your ESP32 sends `Content-Type: application/json; charset=utf-8` and body with special characters—Pi decodes with UTF-8. Wrong charset and characters corrupt. Or your dashboard: charset matters for text; wrong charset = corrupted data.



## 28) Missing Content-Type Is an Error

If a body exists and Content-Type is missing:
	•	The server must guess
	•	Guessing is unsafe
	•	Many servers reject the request

Best practice:

400 Bad Request

Example: Your ESP32 sends `POST /api/temp` with body but no Content-Type—your Pi returns 400 Bad Request. Or your dashboard omits Content-Type—server must not guess; many reject. Missing Content-Type with body is an error; best practice: 400 Bad Request.




## 29) Mismatched Content-Type Is Worse

Example:

Content-Type: application/json
voltage=12.1

This is a lie.

The server must:
	•	Trust the header
	•	Attempt JSON parsing
	•	Fail loudly



## 30) Servers Must Not Auto-Detect Silently

Silent guessing leads to:
	•	Inconsistent behavior
	•	Security issues
	•	Impossible debugging

Explicit failure is better.

Example: Your Pi receives a body with no Content-Type—reject with 400 rather than guessing "looks like JSON." Or your ESP32 sends wrong Content-Type; server must not auto-detect silently—fail explicitly. Servers must not auto-detect silently; explicit failure is better.



## 31) Request Bodies Are Input

Phase 0.8 again:
	•	Bodies are untrusted
	•	Bodies are attacker-controlled
	•	Bodies must be validated

Never trust body contents.

Example: Your Pi receives `POST /api/temp`—body is untrusted, attacker-controlled; validate everything. Or your ESP32: request bodies are input; Phase 0.8—bodies must be validated. Never trust body contents.



## 32) Validation Happens After Parsing

Steps:
	1.	Decode bytes
	2.	Decompress if needed
	3.	Parse according to Content-Type
	4.	Validate structure
	5.	Validate semantics
	6.	Apply logic

Skipping steps is dangerous.

Example: Your Pi must decode bytes, decompress if needed, parse by Content-Type, validate structure and semantics, then apply logic. Skipping validation and going straight to logic is dangerous. Or your ESP32: validation happens after parsing; skipping steps is dangerous.



## 33) Size Limits Are Required

Bodies can be:
	•	Huge
	•	Malicious
	•	Accidental DoS vectors

Servers must impose limits:
	•	Max body size
	•	Max field sizes
	•	Max nesting depth

Example: Your Pi imposes a 1 MB max body size for `POST /api/temp` to avoid DoS; or max nesting depth for JSON to prevent stack overflow. Or your dashboard: servers must impose limits; size limits are required.



## 34) Bodies Can Exhaust Memory

Reading entire bodies into memory is risky.

Streaming parsing is safer for large inputs.

Example: Your dashboard uploads a large log file to your Pi—reading the whole body into memory can exhaust it; streaming parsing is safer. Or your Pi imposes max body size to avoid DoS. Bodies can exhaust memory; streaming is safer for large inputs.



## 35) Bodies Change Semantics

Compare:

POST /api/readings

with:

POST /api/readings
{"voltage":12.1}

The body is the meaning.

Example: Your ESP32 sends `POST /api/readings` with no body vs with body `{"voltage": 12.1}`—the body is the meaning. Or your dashboard: POST /api/readings with empty body vs with payload—bodies change semantics. The body is the meaning.



## 36) PUT Requires a Body

PUT means:

“Replace the resource with this representation”

Without a body, PUT is meaningless.

Example: Your ESP32 sends `PUT /api/config` with body `{"threshold": 75}`—replace the resource with this representation. Without a body, PUT is meaningless. Or your dashboard: PUT requires a body. PUT means replace with this representation; without a body, PUT is meaningless.



## 37) PATCH Requires a Body

PATCH means:

“Apply these changes”

Without a body, there are no changes.

Example: Your ESP32 sends `PATCH /api/config` with body `{"threshold": 75}`—apply these changes. No body, no changes. Or your dashboard: PATCH requires a body. PATCH means apply these changes; without a body, there are no changes.



## 38) DELETE and Bodies

DELETE usually has no body.

Some APIs accept bodies—but this is controversial and inconsistent.

Prefer path + query.

Example: Your ESP32 deletes with `DELETE /api/sensors/esp32_coop` (path) or `DELETE /api/readings?before=1700` (query)—not a body. Or your dashboard: DELETE usually has no body; prefer path + query. DELETE and bodies: prefer path + query.



## 39) Bodies Are Not Cache Keys (Usually)

Caches typically ignore bodies.

This is why:
	•	GET bodies are useless
	•	POST is rarely cached

URL + headers define cache identity.

Example: Your dashboard sends `POST /api/temp`—caches typically ignore the body; cache identity is URL + headers. Or your ESP32: GET bodies are useless for caching; POST is rarely cached. Bodies are not cache keys (usually); URL + headers define cache identity.



## 40) Idempotency and Bodies

Bodies affect idempotency.

Same body + same PUT → safe
Same body + same POST → duplicate risk

Design accordingly.

Example: Your ESP32 sends `PUT /api/config` with same body twice—idempotent, safe. Sends `POST /api/temp` twice with same body—duplicate readings risk. Or your dashboard: idempotency and bodies—design accordingly.



## 41) Bodies and Authentication

Bodies are parsed after authentication headers.

Do not parse bodies for unauthenticated requests unless necessary.

Example: Your Pi checks Authorization (or session) before parsing the body of `POST /api/config`—do not parse first and then reject; avoid unnecessary work and information leakage. Or your ESP32: bodies are parsed after authentication headers; do not parse for unauthenticated requests unless necessary.



## 42) Bodies and Logging

Never log full request bodies blindly:
	•	Sensitive data
	•	Credentials
	•	PII

Log selectively.

Example: Your Pi must not log full request bodies—sensitive data, credentials, PII. Or your ESP32 sends passwords in body—never log blindly. Bodies and logging: log selectively.



## 43) Bodies and Errors

Malformed body → 400
Unsupported Content-Type → 415
Too large → 413

These are client errors.

Example: Your ESP32 sends malformed JSON → 400; sends Content-Type: application/xml (unsupported) → 415; sends 10 MB body (over limit) → 413. Or your Pi: bodies and errors—malformed 400, unsupported 415, too large 413. These are client errors.



## 44) 415 Unsupported Media Type

This error means:

“I do not understand this Content-Type”

It is correct and underused.

Example: Your ESP32 sends `Content-Type: application/xml` but your Pi only supports JSON—Pi responds 415 Unsupported Media Type. Or your dashboard sends a type the server does not understand—415 is the correct, underused response. 415 means "I do not understand this Content-Type."



## 45) Content-Type Drives Behavior

Routing, parsing, validation, and logic often branch on Content-Type.

It is not cosmetic.

Example: Your Pi routes `POST /api/temp` by Content-Type—application/json goes to JSON handler, form data to form handler. Parsing, validation, and logic branch on Content-Type. Or your dashboard: Content-Type drives behavior; it is not cosmetic.



## 46) APIs Should Document Content Types

Clients need to know:
	•	What to send
	•	What they will receive
	•	What errors occur

Documentation is part of the contract.

Example: Your Pi API docs state "POST /api/temp accepts application/json with keys temp (number), sensor_id (string)." Your ESP32 and dashboard know what to send and what errors to expect. Or your dashboard: clients need to know what to send, what they will receive, what errors occur. APIs should document content types; documentation is part of the contract.



## 47) Bodies Complete the Request Model

Without bodies:
	•	URLs identify
	•	Methods act

With bodies:
	•	Data enters
	•	State changes

Bodies are where systems evolve.

Example: Your ESP32 sends voltage today, adds timestamp tomorrow—body shape evolves. Or your dashboard: with bodies, data enters and state changes. Without bodies, URLs and methods only; with bodies, systems evolve. Bodies complete the request model; bodies are where systems evolve.



## Reflection

Think about real requests—your ESP32 posting temperature, your dashboard submitting config or uploading a file, your Pi receiving and validating bodies.
	•	Take one POST request you use. What is the Content-Type?
	•	What does the raw body look like?
	•	What happens if it’s malformed?
	•	What happens if the header lies?

Consider failure modes:
	•	Your ESP32 sends `POST /api/temp` with body `{"temp": 72.5}` but no Content-Type header—your Pi may guess JSON and succeed, or reject with 400. Missing Content-Type is an error; best practice is 400.
	•	Your ESP32 sends `Content-Type: application/json` but body `temp=72.5` (form-encoded)—header lies; your Pi attempts JSON parse, fails, returns 400. Mismatched Content-Type is worse than missing; server should trust the header and fail loudly.
	•	Your dashboard sends valid JSON but `{"voltage": "banana"}`—JSON is valid, type is wrong. Your Pi must validate type and range, not just parse; otherwise bad data enters the system.
	•	Your Pi accepts multipart uploads but does not impose a max body size—a client sends a 1 GB "file," exhausts memory or disk. Size limits are required; bodies can be malicious or accidental DoS.
	•	Your ESP32 sends `POST /api/temp` twice with the same body (e.g. network retry)—duplicate readings. Idempotency and bodies: same body + same POST = duplicate risk; design accordingly (e.g. idempotency keys or PUT where appropriate).

If you can trace how bytes become meaning, when to use JSON vs form vs multipart, and what breaks when Content-Type is wrong or missing, you understand request bodies at the boundary.



## Core Understanding

Bodies carry payloads; Content-Type gives meaning to bytes. JSON, form, and multipart each serve different roles—structured APIs use JSON, simple forms use application/x-www-form-urlencoded, file uploads use multipart/form-data. Parsing happens at the boundary: bodies are untrusted input, so validation is mandatory after decode and parse. Missing or wrong Content-Type is an error (400 or 415); servers must not guess silently. Bodies change semantics (POST with vs without body) and risk (size, injection, duplicate submissions)—design with limits, validation, and idempotency in mind.

This chapter builds on Chapter 2.18 (URLs) and Chapter 2.16 (Content-Type and Content-Length). Next: Chapter 2.20 — Cookies and Session State, where we confront HTTP’s statelessness and how the web carries memory across requests—identity, continuity, and trust.