# Phase 2 Code Examples (Chapters 6-10)

This file contains visual references for all code examples mentioned in Phase 2 chapters 6-10. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 2.06: Request Structure

### 1) A Request Is a Message, Not an Action (Line ~14)

**Context:** HTTP request describes what client wants, where, how to interpret; server decides what to do with it.

```python
# An HTTP request is NOT an action
# It does not "do" anything by itself

# It is a message that describes:
# - What the client wants
# - Where it wants it
# - How the server should interpret the message

# The server decides what to do with that message
```

---

### 2) The Four Parts of an HTTP Request (Line ~27)

**Context:** Every request has four parts in order: request line, headers, blank line, optional body.

```python
# Every HTTP request has exactly four parts, in this order:
# 1. Request line
# 2. Headers
# 3. Blank line
# 4. Optional body

# Example:
"""
GET /api/voltage HTTP/1.1      # 1. Request line
Host: pi.local                 # 2. Headers
Accept: application/json       #    (more headers)
                               # 3. Blank line
"""                            # 4. No body for GET
```

---

### 3) The Order Is Not Optional (Line ~38)

**Context:** Servers parse sequentially: request line first, headers next, blank line, then body; order violated = malformed.

```python
# Servers parse requests sequentially
# They expect:
# - Request line first
# - Headers next
# - A blank line
# - Then the body (if any)

# If order is violated, request is malformed
# HTTP is forgiving in some places
# It is unforgiving about structure
```

---

### 4) The Request Line Comes First, Always (Line ~54)

**Context:** First line is the request line; must be first, complete, end with CRLF.

```python
# First line of every HTTP request = request line

# Example:
"""
GET /api/temp HTTP/1.1
"""

# This line:
# - Must be first
# - Must be complete
# - Must end with CRLF (\r\n)

# Server cannot parse anything else until this line is read
```

---

### 5) What the Request Line Communicates (Line ~72)

**Context:** Request line answers: what action (method), what resource (path), what rules (version).

```python
# Request line answers three questions:
# 1. What action is requested? (method: GET, POST, etc.)
# 2. What resource is targeted? (path: /api/voltage)
# 3. What protocol rules apply? (version: HTTP/1.1)

# Nothing else makes sense without this context
```

---

### 6) Headers Come Second (Line ~82)

**Context:** Headers are metadata describing the request; answer who, what formats, how long, is auth provided.

```python
# After request line come headers
# Headers are metadata—they describe the request, not the resource

# Headers answer questions like:
# - Who is making the request? (User-Agent: HomesteadDashboard/1.0)
# - What formats are acceptable? (Accept: application/json)
# - How long is the body? (Content-Length: 28)
# - Is authentication provided? (Authorization: Bearer token123)
# - Should connection stay open? (Connection: keep-alive)
```

---

### 7) Headers Are Optional, But Usually Present (Line ~97)

**Context:** HTTP/1.1 requires Host; most requests include many headers; servers must handle missing/extra/unknown.

```python
# Technically, a request can have zero headers
# Practically:
# - HTTP/1.1 requires at least Host
# - Most real requests include many headers
# - Browsers send dozens by default
# - ESP32 sensor might send just Host and Authorization

# Servers must be prepared for:
# - Missing headers
# - Extra headers
# - Unknown headers
```

---

### 8) Header Syntax Is Strict (Line ~113)

**Context:** Each header is Header-Name: value; one per line, colon separates, case-insensitive names, CRLF terminated.

```python
# Header syntax:
"""
Header-Name: value
"""

# Examples:
"""
Host: pi.local
Authorization: Bearer sensor_token_123
Content-Type: application/json
"""

# Rules:
# - One header per line
# - Colon separates name and value
# - Header names are case-insensitive (Host = host = HOST)
# - Values may contain spaces
# - Lines end with CRLF (\r\n)
# - No indentation, no hierarchy—flat text
```

---

### 9) Headers Are Not Ordered (Conceptually) (Line ~140)

**Context:** Headers are a set, not sequence; server must find Authorization regardless of position.

```python
# Although headers appear in an order, servers must not rely on header order

# You cannot assume:
# - Authorization comes before Content-Type
# - Content-Length comes last
# - Custom headers appear anywhere specific

# Headers are a set, not a sequence
# Pi server must find Authorization regardless of position
```

---

### 10) The Blank Line Is Mandatory (Line ~152)

**Context:** Blank line (\r\n) signals headers finished, body may follow; it's the boundary between metadata and content.

```python
# After the last header, there is one blank line
# This blank line is not decoration—it is a delimiter

# It signals: "Headers are finished. Body may follow."

# The blank line is exactly: \r\n
# In raw bytes: 0x0D 0x0A (carriage return, line feed)

# This is the boundary between metadata and content
```

---

### 11) Why the Blank Line Exists (Line ~172)

**Context:** HTTP needs to distinguish metadata (headers) from content (body); blank line is that boundary.

```python
# HTTP needs a way to distinguish:
# - Metadata (headers)
# - Content (body)

# The blank line is that boundary

# Without it:
# - Server cannot know where headers stop
# - Body cannot be parsed correctly

# This is a Phase 0 boundary again
```

---

### 12) The Body Is Optional (Line ~187)

**Context:** GET no body, POST/PUT/PATCH usually have body; presence depends on method and headers.

```python
# Not all requests have a body

# Typical patterns:
# - GET → no body (fetches data)
# - POST → body (sends sensor reading)
# - PUT → body (updates settings)
# - PATCH → body (partial update)
# - DELETE → sometimes body, often not

# Dashboard might GET voltage (no body) but POST temperature (with body)
```

---

### 13) The Body Is Raw Data (Line ~201)

**Context:** Body is just bytes; HTTP only knows whether it exists, how long, how to hand off; meaning from headers.

```python
# The body is:
# - Not parsed by HTTP itself
# - Not structured by the protocol
# - Just bytes

# HTTP only knows:
# - Whether a body exists
# - How long it is
# - How to hand it off

# Meaning of body is determined by headers (Content-Type)
```

---

### 14) Content-Length Tells the Server How Much to Read (Line ~216)

**Context:** Content-Length: 28 means server reads exactly 28 bytes, no more, no less.

```python
# When body exists, server needs to know how many bytes to read

"""
Content-Length: 28
"""

# Server reads exactly 28 bytes—no more, no less

# Example: ESP32 sends {"device":"esp32_coop","temp":72.5} (28 bytes)
# Server reads exactly 28 bytes, then stops

# Reading too much or too little corrupts next request
```

---

### 15) Transfer-Encoding Is an Alternative (Line ~234)

**Context:** Chunked encoding sends body in chunks, each declaring its size, end explicitly marked.

```python
# Alternative to Content-Length:
"""
Transfer-Encoding: chunked
"""

# This means:
# - Body is sent in chunks
# - Each chunk declares its own size
# - End is explicitly marked

# More complex—comes later
```

---

### 16) A Complete Minimal Request (Line ~249)

**Context:** Minimal valid HTTP/1.1 request: request line, Host header, blank line, no body.

```python
# Complete minimal HTTP/1.1 request:
"""
GET /api/voltage HTTP/1.1
Host: pi.local

"""

# Analysis:
# - Request line: present (GET /api/voltage HTTP/1.1)
# - Header: Host (required for HTTP/1.1)
# - Blank line: present
# - Body: none

# This is valid
```

---

### 17) A Request With a Body (Line ~265)

**Context:** POST request with headers and body; Content-Length must match actual body size exactly.

```python
# POST request—ESP32 sensor reporting temperature:
"""
POST /api/temp HTTP/1.1
Host: coop.local
Content-Type: application/json
Content-Length: 28
Authorization: Bearer sensor_token_123

{"device":"esp32_coop","temp":72.5}
"""

# Structure:
# - Request line: POST /api/temp HTTP/1.1
# - Headers: Host, Content-Type, Content-Length, Authorization
# - Blank line: \r\n
# - Body: {"device":"esp32_coop","temp":72.5} (exactly 28 bytes)
```

---

### 18) Why Servers Parse in This Order (Line ~288)

**Context:** Read until CRLF = request line, read headers until blank, inspect headers, decide body, read declared amount.

```python
# Servers read requests like this:
# 1. Read until CRLF → request line
# 2. Read header lines until blank line
# 3. Inspect headers
# 4. Decide whether to read a body
# 5. Read exactly what is declared

# There is no guessing
# There is no scanning ahead
```

---

### 19) What Happens If the Blank Line Is Missing (Line ~301)

**Context:** No blank line = server keeps reading headers, body never recognized, request hangs or fails.

```python
# If blank line is missing:
# - Server keeps reading headers
# - Body is never recognized
# - Request hangs or fails

# Example bug—no blank line:
"""
POST /api/temp HTTP/1.1\r\n
Host: coop.local\r\n
{"temp":72.5}
"""
# Server sees {"temp":72.5} as header line
# Tries to parse it—no colon, malformed
# Classic bug when hand-crafting requests
```

---

### 20) What Happens If Content-Length Is Wrong (Line ~311)

**Context:** Too small = body truncated, data lost; too large = server waits for bytes that never arrive, hangs.

```python
# If Content-Length is too small:
# - Body is truncated
# - Data is lost

# Example: Content-Length: 20 but body is 28 bytes
# Server reads 20 bytes, stops
# Remaining 8 bytes lost, next request starts mid-body

# If Content-Length is too large:
# - Server waits for bytes that never arrive
# - Request hangs
# - Connection may time out

# Example: Content-Length: 50 but body is only 28 bytes
# Server reads 28 bytes, waits for 22 more that never come
# Request hangs until timeout
```

---

### 21) The Server Does Not "Know" Your Intent (Line ~329)

**Context:** Server only knows method, path, headers, body bytes; intent is inferred from structure, not assumed.

```python
# Server does NOT know:
# - That this is "a sensor reading"
# - That this is "JSON"
# - That this is "from the coop controller"

# Server only knows:
# - Method
# - Path
# - Headers
# - Body bytes

# Intent is inferred from structure, not assumed
```

---

### 22) The Path Is Not a File (Line ~345)

**Context:** Path is a logical identifier; what it means is entirely server-defined.

```python
# Request line path:
# /api/voltage
# /api/temp
# /api/fence_status

# Is NOT necessarily:
# - A file
# - A directory
# - A physical location

# It is a logical identifier
# Server defines what it means:
# - /api/voltage → sensor reading
# - /api/temp → DHT22 sensor
# - /api/fence_status → poultry net energizer
```

---

### 23) Query Strings Are Part of the Path (Line ~363)

**Context:** Everything after ? is part of the path; HTTP doesn't parse query strings, that's application logic.

```python
# Query strings are part of the request line path:
"""
GET /api/voltage?sensor=1&unit=V HTTP/1.1
GET /api/temp?location=coop HTTP/1.1
"""

# Everything after ? is included in the path
# HTTP does not parse query strings—that's application logic

# Dashboard might query:
# /api/voltage?sensor=1 → battery bank 1
# /api/temp?location=coop → coop temperature
```

---

### 24) Headers Are the Real Power (Line ~374)

**Context:** Most HTTP behavior lives in headers: auth, content negotiation, caching, compression, connection control.

```python
# Most HTTP behavior lives in headers:
# - Authentication (Authorization: Bearer token)
# - Content negotiation (Accept: application/json)
# - Caching (Cache-Control: no-cache)
# - Compression (Accept-Encoding: gzip)
# - Connection control (Connection: keep-alive)

# Request line is short
# Headers carry the nuance
```

---

### 25) Headers Are How Constraints Are Communicated (Line ~387)

**Context:** Headers express constraints: only accept JSON, authenticated as X, don't cache, keep open—rules, not suggestions.

```python
# Headers express constraints:
# - "I only accept JSON" (Accept: application/json)
# - "I am authenticated as X" (Authorization: Bearer token123)
# - "Do not cache this" (Cache-Control: no-cache)
# - "Keep the connection open" (Connection: keep-alive)

# They are rules, not suggestions
```

---

### 26) The Server Is Allowed to Reject Anything (Line ~398)

**Context:** Malformed request line, missing required headers, body mismatch = server can reject; HTTP doesn't promise forgiveness.

```python
# If:
# - Request line is malformed
# - Required headers are missing
# - Body does not match headers

# The server can reject the request
# HTTP does not promise forgiveness
```

---

### 27) Request Structure Is a Contract (Line ~410)

**Context:** Client promises format, accurate metadata, respect boundaries; server promises parse by spec, respond clearly.

```python
# Request structure is a contract between client and server

# Client promises:
# - Follow the format
# - Declare metadata accurately
# - Respect boundaries

# Server promises:
# - Parse according to spec
# - Respond clearly
# - Close connection if violated
```

---

### 28) Frameworks Hide This—But It Still Exists (Line ~425)

**Context:** Frameworks generate request lines, add headers, serialize bodies; understanding structure makes frameworks predictable.

```python
# Frameworks:
# - Generate request lines
# - Add headers automatically
# - Serialize bodies for you

# But they do not change the protocol
# Understanding the structure makes frameworks predictable
```

---

### 29) Debugging Always Comes Back to Structure (Line ~437)

**Context:** Check request line, headers, Content-Type, Content-Length, blank line; 400 Bad Request often structural.

```python
# When requests fail mysteriously, check:
# 1. Request line (method, path, version correct?)
# 2. Headers (required headers present? syntax correct?)
# 3. Content-Type (matches body format?)
# 4. Content-Length (matches actual body size?)
# 5. Blank line (present? correct CRLF?)

# Example: dashboard gets 400 Bad Request from Pi
# Check: Is Host: pi.local present? Blank line there?
# Content-Length correct if there's a body?
# Nine times out of ten, it is structural
```

---

### 30) Mental Model: Envelope and Letter (Line ~449)

**Context:** Request = envelope (headers) + letter (body) + label (request line); HTTP reads envelope, not letter.

```python
# Think of HTTP request as:
# - An envelope (headers)
# - A letter (body)
# - A label (request line)

# The postal service does not read the letter
# It reads the envelope

# HTTP works the same way
```

---

### Reflection: Request Structure Analysis (Line ~462)

**Context:** What must be on first line? Which headers required? How does server know when request ends?

```python
# Think about a real request:
# - Dashboard fetching voltage from Pi
# - ESP32 sensor reporting temperature
# - Coop controller checking fence status

# What must be on the first line? Method, path, version
# Which headers are required? Host (HTTP/1.1)
# How does server know when request ends? Blank line + Content-Length
# How does it know whether body exists? Method + Content-Length header

# Failure modes:
# ESP32 sends POST, gets 400 Bad Request → Check Host, Content-Length, blank line
# Dashboard forgets blank line → Server hangs, keeps reading
# Coop controller sends Content-Length: 30 but body is 25 bytes → Server waits, times out
```

---

## Chapter 2.07: The Request Line

### 1) The Request Line Is Mandatory (Line ~12)

**Context:** Every request begins with exactly one request line; without it, server cannot parse headers or determine intent.

```python
# Every HTTP request begins with exactly one request line

# If server does not receive valid request line:
# - Cannot parse headers
# - Cannot determine intent
# - Cannot respond meaningfully

# Request line is NOT optional
# It is NOT implied
# It MUST be explicit
```

---

### 2) The Request Line Has Exactly Three Parts (Line ~26)

**Context:** Method, path, HTTP version; separated by single spaces.

```python
# Request line always contains three components, in this order:
# 1. Method
# 2. Path
# 3. HTTP version

# Separated by single spaces

# Example:
"""
GET /api/temp HTTP/1.1
"""

# No more. No less.
```

---

### 3) Formal Grammar of the Request Line (Line ~45)

**Context:** METHOD SP REQUEST-TARGET SP HTTP-VERSION CRLF; grammar is strict.

```python
# Formal grammar:
# METHOD SP REQUEST-TARGET SP HTTP-VERSION CRLF

# Where:
# - SP is a single space character
# - CRLF ends the line (\r\n)

# This grammar is strict
```

---

### 4) Why the Order Matters (Line ~58)

**Context:** Servers parse sequentially; method first, then path, then version; wrong order = parsing fails.

```python
# Servers parse requests sequentially
# They expect:
# - Method first
# - Then path
# - Then version

# If order is wrong, parsing fails
# Server does not guess
# Does not reorder
# Does not infer
```

---

### 5) The Method Comes First (Line ~74)

**Context:** First token on request line is the method; tells server what kind of operation requested.

```python
# First token on request line is the method

# Examples:
# GET
# POST
# PUT
# PATCH
# DELETE

# Method tells server what kind of operation client is requesting
```

---

### 6) Methods Are Verbs, Not Suggestions (Line ~89)

**Context:** Methods are semantic instructions; server may accept, reject, treat differently—but won't ignore.

```python
# Methods are NOT:
# - Labels
# - Documentation
# - Hints

# Methods ARE: semantic instructions

# Server may:
# - Accept a method
# - Reject a method
# - Treat different methods differently

# But it will not ignore the method
```

---

### 7) Method Names Are Case-Sensitive by Convention (Line ~105)

**Context:** Methods always uppercase; lowercase may be rejected; mixed-case unsafe.

```python
# HTTP spec treats methods as case-sensitive tokens

# In practice:
# - Methods are always uppercase
# - Lowercase methods may be rejected
# - Mixed-case methods are unsafe

# Always use uppercase: GET, POST, PUT, PATCH, DELETE
```

---

### 8) Common HTTP Methods (Line ~117)

**Context:** GET retrieve, POST submit/create, PUT replace, PATCH partial update, DELETE remove; not interchangeable.

```python
# Most commonly used methods:
# - GET    → retrieve a representation
# - POST   → submit data or create a resource
# - PUT    → replace a resource entirely
# - PATCH  → modify a resource partially
# - DELETE → remove a resource

# Each has distinct semantics
# They are NOT interchangeable
```

---

### 9) GET: Retrieval Only (Line ~131)

**Context:** GET retrieves data, should not change server state, often no body.

```python
# GET requests:
# - Retrieve data
# - Should NOT change server state
# - Often have no body

# Example:
"""
GET /api/voltage HTTP/1.1
"""

# Client is asking: "Give me the representation of /api/voltage"
```

---

### 10) POST: Submit or Create (Line ~146)

**Context:** POST sends data, often creates resources, often includes body.

```python
# POST requests:
# - Send data to the server
# - Often create resources
# - Often include a body

# Example:
"""
POST /api/temp HTTP/1.1
"""

# Client (ESP32 sensor) is saying:
# "Here is temperature data. Store it or process it."
```

---

### 11) PUT: Replace (Line ~165)

**Context:** PUT replaces entire target resource; idempotent in principle.

```python
# PUT requests:
# - Replace the entire target resource
# - Are idempotent (in principle)

# Example:
"""
PUT /api/config HTTP/1.1
"""

# Client (dashboard) is saying:
# "This configuration should now look exactly like this"
```

---

### 12) PATCH: Partial Update (Line ~181)

**Context:** PATCH modifies part of resource; doesn't replace whole thing.

```python
# PATCH requests:
# - Modify part of a resource
# - Do NOT replace the whole thing

# Example:
"""
PATCH /api/fence HTTP/1.1
"""

# Client (coop controller) is saying:
# "Change the fence voltage threshold, leave other settings alone"
```

---

### 13) DELETE: Removal (Line ~198)

**Context:** DELETE asks server to remove a resource.

```python
# DELETE requests:
# - Ask the server to remove a resource

# Example:
"""
DELETE /api/sensors/old_sensor_id HTTP/1.1
"""

# Client (dashboard) is saying:
# "Remove this sensor from the system"
```

---

### 14) The Method Does Not Guarantee Behavior (Line ~214)

**Context:** Method expresses intent; server decides behavior; HTTP defines meaning, servers enforce policy.

```python
# Important boundary rule:
# Method expresses intent
# Server decides behavior

# Server may:
# - Ignore semantics
# - Reject methods
# - Treat GET as mutating (bad, but possible)

# HTTP defines meaning
# Servers enforce policy
```

---

### 15) The Path Comes Second (Line ~230)

**Context:** Path identifies request target; server maps path to resource.

```python
# Second component of request line is the path

# Examples:
# /api/voltage
# /api/temp
# /api/fence_status

# Path identifies the request target
# Pi might map:
# /api/voltage → voltage sensor
# /api/temp → temperature sensor
# /api/fence_status → poultry net energizer
```

---

### 16) The Path Is Not a URL (Line ~245)

**Context:** Path doesn't include scheme, host, port; only path and optional query.

```python
# Request line path does NOT include:
# - Scheme (http://)
# - Host (pi.local, coop.local)
# - Port (:443, :8080)

# Those live elsewhere (Host header)
# Only the path (and optional query) appears here
```

---

### 17) Absolute Paths Are Standard (Line ~257)

**Context:** HTTP/1.1 uses absolute path; host specified separately in Host header.

```python
# In HTTP/1.1, request line usually uses absolute path:
"""
GET /api/voltage HTTP/1.1
"""

# Host is specified separately in Host header:
"""
Host: pi.local
"""

# Dashboard sends GET /api/voltage HTTP/1.1 with Host: pi.local
# Request line has path, header has hostname
```

---

### 18) Query Strings Are Part of the Path (Line ~268)

**Context:** Everything after ? is part of path; HTTP doesn't parse query, that's application logic.

```python
# Query string is part of the request line path:
"""
GET /api/voltage?unit=V&precision=2 HTTP/1.1
GET /api/temp?location=coop HTTP/1.1
"""

# Everything after ? is included in the path
# HTTP does NOT parse query strings—that is application logic

# Dashboard might query:
# /api/voltage?unit=V → voltage in volts
# /api/temp?location=coop → coop temperature
```

---

### 19) The Path Is Opaque to HTTP (Line ~283)

**Context:** HTTP doesn't care what path "means"; file, resource, action—it's just text.

```python
# HTTP does NOT care what the path "means"

# It does not know:
# - Whether it refers to a file
# - Whether it refers to a resource
# - Whether it refers to an action

# It is just text
```

---

### 20) The Server Interprets the Path (Line ~295)

**Context:** Same path can mean different things on different servers; path is a name, not a guarantee.

```python
# Same path can mean different things on different servers

# Example:
# /api/temp on Pi → JSON temperature reading
# /api/temp on solar logger → JSON solar panel temp
# /api/temp on different server → 404 Not Found

# The path is a name, not a guarantee
```

---

### 21) Paths Are Case-Sensitive (Usually) (Line ~307)

**Context:** Most servers treat paths as case-sensitive; /API/voltage ≠ /api/voltage.

```python
# Most servers treat paths as case-sensitive:
# /API/voltage ≠ /api/voltage

# Server-dependent, but assume case-sensitive unless documented otherwise
```

---

### 22) Paths Can Encode Hierarchy (Line ~315)

**Context:** Hierarchy is conventional, not enforced; /api/sensors/1 might be sensor ID 1 or flat identifier.

```python
# Paths often imply hierarchy:
# /api/sensors
# /api/sensors/1
# /api/sensors/1/readings

# But hierarchy is conventional, NOT enforced by HTTP

# Pi might map /api/sensors/1 to sensor ID 1
# Or treat it as flat identifier—server decides
```

---

### 23) Trailing Slashes Matter (Line ~328)

**Context:** /api/voltage and /api/voltage/ are different paths; some servers normalize, some don't.

```python
# These are different paths:
# /api/voltage
# /api/voltage/

# Some servers normalize
# Some do not
# Do not assume equivalence
```

---

### 24) The Version Comes Third (Line ~340)

**Context:** HTTP version tells server which protocol rules apply.

```python
# Third component is the HTTP version

# Example:
# HTTP/1.1

# Tells server which protocol rules apply
```

---

### 25) The Version Is Not Cosmetic (Line ~351)

**Context:** Version affects required headers, connection behavior, parsing rules, defaults.

```python
# Version affects:
# - Required headers
# - Connection behavior
# - Parsing rules
# - Defaults

# Server may behave very differently depending on version
```

---

### 26) HTTP/1.0 vs HTTP/1.1 (Line ~362)

**Context:** HTTP/1.1 requires Host, defaults to keep-alive; HTTP/1.0 closes connections by default.

```python
# Key differences:
# - HTTP/1.1 requires Host header
# - HTTP/1.1 defaults to keep-alive
# - HTTP/1.0 closes connections by default

# Request line declares which model to use
```

---

### 27) Version Must Match Server Capability (Line ~372)

**Context:** Unsupported version may be rejected, downgraded, or connection closed; don't lie about versions.

```python
# If server does not support the version:
# - May reject the request
# - May downgrade behavior
# - May close the connection

# Clients should not lie about versions
```

---

### 28) Whitespace Rules Are Strict (Line ~382)

**Context:** Exactly one space between components; no tabs, no extra spaces; invalid = parsing fails.

```python
# Between components:
# - Exactly one space
# - No tabs
# - No extra spaces

# INVALID (two spaces):
"""
GET  /api/voltage HTTP/1.1
"""

# ALSO INVALID (two spaces):
"""
GET /api/voltage  HTTP/1.1
"""

# ESP32 must send exactly one space between each component
```

---

### 29) CRLF Terminates the Line (Line ~409)

**Context:** Request line must end with CRLF; marks end of line and beginning of headers.

```python
# Request line must end with CRLF (\r\n)
# This marks end of line and beginning of headers

# Without CRLF:
# - Server keeps reading
# - Parsing fails
```

---

### 30) A Minimal Valid Request Line (Line ~420)

**Context:** Smallest valid request line: GET / HTTP/1.1; everything else builds on this.

```python
# Smallest valid request line:
"""
GET / HTTP/1.1
"""

# Everything else in the request builds on this

# Dashboard might send:
# GET / HTTP/1.1 → fetch root resource
# GET /api/voltage HTTP/1.1 → fetch voltage
# Same structure, different path
```

---

### 31) The Request Line Defines the Parsing Context (Line ~431)

**Context:** After reading request line, server knows whether to expect body, which headers required, how to interpret rest.

```python
# Once server reads request line, it knows:
# - Whether to expect a body
# - Which headers are required
# - How to interpret the rest of the message

# This is why it must come first
```

---

### 32) The Request Line Is a Boundary (Line ~441)

**Context:** First boundary crossing; malformed input rejected immediately; validation begins here.

```python
# Phase 0 boundary principle applies:
# - Request line is the first boundary crossing
# - Malformed input should be rejected immediately
# - Validation begins here
```

---

### 33) Errors at the Request Line Level (Line ~449)

**Context:** Unknown method, missing path, unsupported version, invalid spacing = 400 Bad Request or connection close.

```python
# Common request-line errors:
# - Unknown method: FETCH /api/voltage HTTP/1.1 (FETCH is not valid)
# - Missing path: GET  HTTP/1.1 (no path between method and version)
# - Unsupported version: GET /api/voltage HTTP/2.0 (server only supports 1.1)
# - Invalid spacing: GET  /api/voltage HTTP/1.1 (two spaces)

# These usually result in:
# - 400 Bad Request
# - Immediate connection close

# Example: ESP32 sends "GET  /api/temp HTTP/1.1" (two spaces)
# Pi sees malformed request line, responds 400, closes connection
```

---

### 34) Proxies and the Request Line (Line ~464)

**Context:** Proxies sometimes use full URL in request target; advanced, out of scope.

```python
# Proxies sometimes use different request target form:
"""
GET http://pi.local/api/voltage HTTP/1.1
"""

# Advanced and out of scope for now
# Worth knowing it exists
```

---

### 35) Frameworks Always Generate This Line (Line ~475)

**Context:** Every HTTP library constructs request line, validates spacing, inserts version; understanding helps debug.

```python
# Every HTTP library you use:
# - Constructs the request line
# - Validates spacing
# - Inserts the version

# Understanding this line lets you debug library behavior
```

---

### 36) The Request Line Is Not Repeated (Line ~485)

**Context:** Exactly one request line per request; if you see multiple, something is wrong.

```python
# Within a single request:
# - Exactly one request line
# - Headers follow
# - Body follows

# If you see multiple request lines, something is wrong
```

---

### 37) Mental Model: Command Envelope (Line ~495)

**Context:** Request line = command on envelope; tells server how to open it and what to do next.

```python
# Think of request line as:
# - The command on the envelope
# - Telling the server how to open it
# - And what to do next

# Everything else is inside
```

---

### 38) If You Can Read the Request Line, You Can Debug HTTP (Line ~505)

**Context:** Given raw request, identify method, path, version; most bugs become obvious at request line.

```python
# Given a raw request, ask:
# - What is the method? (GET, POST, etc.)
# - What is the path? (/api/voltage, /api/temp, etc.)
# - What version rules apply? (HTTP/1.1 requires Host, defaults keep-alive)

# Example: dashboard sends GET /api/voltage HTTP/1.0 but Pi expects HTTP/1.1
# Server might reject or downgrade behavior
# Check the version in request line

# Most HTTP bugs become obvious when you inspect the request line
```

---

### Reflection: Request Line Analysis (Line ~517)

**Context:** 405 Method Not Allowed = method issue; 400 Bad Request = malformed line; different environments = different path/version.

```python
# If server responds 405 Method Not Allowed:
# → Which part of request line caused that? The method

# If request works in one environment but not another:
# → Could path or version be different?

# If server says 400 Bad Request:
# → What might be malformed in request line?
#   - Two spaces?
#   - Missing path?
#   - Invalid method?
#   - Wrong version format?
```

---

## Chapter 2.08: Response Structure

### 1) Responses Always Follow Requests (Line ~15)

**Context:** Response cannot exist on its own; one request = one response; no request = no response.

```python
# Response cannot exist on its own
# - No request → no response
# - One request → one response
# - Server never sends two responses to one request

# If server sends nothing, client experiences absence, not error response
```

---

### 2) A Response Has Four Parts (Line ~25)

**Context:** Status line, headers, blank line, optional body; mirrors request structure.

```python
# Every HTTP response has up to four parts, in this order:
# 1. Status line
# 2. Headers
# 3. Blank line
# 4. Optional body

# Mirrors request structure exactly
# Status line replaces request line
```

---

### 3) The Status Line Is Mandatory (Line ~37)

**Context:** Every response begins with status line; without it, response is invalid.

```python
# Every HTTP response begins with a status line

# If client does not receive valid status line:
# - Response is invalid
# - Client cannot interpret anything else
# - Connection may be dropped

# Nothing comes before the status line
```

---

### 4) The Status Line Has Three Parts (Line ~49)

**Context:** HTTP version, status code, reason phrase; separated by single spaces.

```python
# Status line always contains:
# 1. HTTP version
# 2. Status code
# 3. Reason phrase

# Separated by single spaces

# Example:
"""
HTTP/1.1 200 OK
"""

# Pi responds to GET /api/voltage with this status line
```

---

### 5) Formal Grammar of the Status Line (Line ~68)

**Context:** HTTP-VERSION SP STATUS-CODE SP REASON-PHRASE CRLF; grammar is strict.

```python
# Formal grammar:
# HTTP-VERSION SP STATUS-CODE SP REASON-PHRASE CRLF

# This grammar is strict
```

---

### 6) The HTTP Version Comes First (Line ~77)

**Context:** Response declares protocol version; tells client which parsing rules apply.

```python
# Response begins by declaring protocol version

# Example:
"""
HTTP/1.1
"""

# Dashboard requests HTTP/1.1, Pi responds with HTTP/1.1

# Tells client:
# - Which parsing rules apply
# - Which defaults apply
# - Which behaviors are allowed
```

---

### 7) The Version Must Match the Request (Usually) (Line ~95)

**Context:** Servers respond using same version requested or downgrade gracefully; mismatch causes errors.

```python
# In practice:
# - Servers respond using same HTTP version requested
# - Or downgrade gracefully

# If client requests HTTP/1.1, it expects HTTP/1.1 response

# Version mismatch can cause:
# - Parsing errors
# - Misinterpreted headers
# - Connection handling issues
```

---

### 8) The Status Code Comes Second (Line ~109)

**Context:** Status code is a three-digit integer; most important part of response; drives client behavior.

```python
# Status code is a three-digit integer
# This is the most important part of the response

# Clients do not interpret meaning from text
# They interpret meaning from this number

# Dashboard checks: if status_code == 404:
# Not the text "Not Found"
```

---

### 9) Status Codes Are Machine Signals (Line ~119)

**Context:** Status codes are control signals; clients use them to decide success, retry, redirect, stop.

```python
# Status codes are NOT decoration
# They are control signals

# Clients use them to decide:
# - Whether the request succeeded
# - Whether to retry
# - Whether to redirect
# - Whether to stop
```

---

### 10) Status Code Classes (Line ~131)

**Context:** First digit defines class: 1xx informational, 2xx success, 3xx redirect, 4xx client error, 5xx server error.

```python
# First digit defines the class:
# - 1xx → Informational (rare)
# - 2xx → Success
# - 3xx → Redirection
# - 4xx → Client error
# - 5xx → Server error

# This classification is foundational
```

---

### 11) 2xx: Success (Line ~143)

**Context:** Server received, understood, successfully processed the request.

```python
# A 2xx status means:
# - Server received the request
# - Understood it
# - Successfully processed it

# Example:
"""
HTTP/1.1 200 OK
"""
```

---

### 12) Success Does Not Mean "What You Wanted" (Line ~156)

**Context:** 2xx means request succeeded; doesn't mean data is expected, useful, or system is healthy.

```python
# A 2xx response does NOT mean:
# - Data is what you expected (200 OK with {"voltage": null})
# - Resource exists in form you wanted (200 OK with HTML error page)
# - Body contains anything useful (200 OK with empty body)

# It only means: request was handled successfully

# Example: dashboard sends GET /api/voltage, gets 200 OK
# Body: {"error": "sensor offline"}
# Request succeeded—server processed correctly
# Data just indicates sensor is offline
```

---

### 13) 3xx: Redirection (Line ~169)

**Context:** Request was valid, resource is elsewhere, client should take additional action.

```python
# A 3xx status means:
# - Request was valid
# - Resource is elsewhere
# - Client should take additional action

# Example:
"""
HTTP/1.1 301 Moved Permanently
"""

# Dashboard requests /api/voltage, Pi has moved it
# Responds 301 with Location: /api/sensors/voltage
```

---

### 14) Redirects Are Instructions (Line ~186)

**Context:** Redirect is not error; server says "look over here instead"; Location header carries new target.

```python
# Redirect is NOT an error
# It is the server telling client:
# "You asked correctly, but look over here instead."

# Location header carries the new target
```

---

### 15) 4xx: Client Error (Line ~197)

**Context:** Client made request, server understood, refuses due to client-side issues.

```python
# A 4xx status means:
# - Client made a request
# - Server understood it
# - Server refuses due to client-side issues

# Example:
"""
HTTP/1.1 404 Not Found
"""

# ESP32 requests GET /api/nonexistent
# Pi responds 404—path doesn't exist
```

---

### 16) Client Error Does Not Mean Client Is Broken (Line ~214)

**Context:** 4xx means request is invalid in context; not that client software is buggy or connection failed.

```python
# 4xx does NOT mean:
# - Client software is buggy
# - User is wrong
# - Connection failed

# It means: request is invalid in context

# Examples:
# ESP32 sends GET /api/voltage without auth → 401 Unauthorized
# Dashboard sends GET /api/nonexistent → 404 Not Found
# Syntactically correct, missing something required
```

---

### 17) 5xx: Server Error (Line ~227)

**Context:** Request was valid, server failed while processing; server admits fault.

```python
# A 5xx status means:
# - Request was valid
# - Server failed while processing it

# Example:
"""
HTTP/1.1 500 Internal Server Error
"""

# Dashboard requests GET /api/voltage
# Pi's sensor reading code crashes
# Responds 500—request valid, server failed
```

---

### 18) Server Error Means "Not Your Fault" (Line ~244)

**Context:** 4xx = client responsibility (fix request); 5xx = server responsibility (retry might help).

```python
# In principle:
# - 4xx → client responsibility (fix the request)
# - 5xx → server responsibility (server failed)

# Clients may retry 5xx responses
# Usually should NOT retry 4xx responses

# Example:
# 500 Internal Server Error → retry might work (server might recover)
# 401 Unauthorized → retry won't help (need to fix auth token)
```

---

### 19) The Reason Phrase Comes Third (Line ~255)

**Context:** Human-readable description; OK, Not Found, Internal Server Error; optional.

```python
# Reason phrase is short, human-readable description

# Examples:
# - OK (for 200)
# - Not Found (for 404)
# - Internal Server Error (for 500)
# - Unauthorized (for 401)

# Pi might send HTTP/1.1 200 OK or just HTTP/1.1 200
# Reason phrase is optional
```

---

### 20) The Reason Phrase Is Informational Only (Line ~269)

**Context:** Clients must not rely on reason phrase; may vary, be localized, or omitted; status code is authoritative.

```python
# Clients must NOT rely on reason phrase

# It:
# - May vary
# - May be localized
# - May be omitted entirely

# Status code is authoritative
```

---

### 21) HTTP/1.1 Allows Empty Reason Phrases (Line ~281)

**Context:** Valid: HTTP/1.1 204 (no reason phrase); clients must not break if phrase is missing.

```python
# This is valid:
"""
HTTP/1.1 204
"""

# No reason phrase—just version, code, CRLF
# Pi might send HTTP/1.1 204 after successful DELETE
# Clients must not break if phrase is missing
```

---

### 22) Headers Follow the Status Line (Line ~291)

**Context:** Same structure as request headers; Header-Name: value; one per line, CRLF terminated.

```python
# After status line come zero or more headers
# Same structure as request headers:
"""
Header-Name: value
"""

# One per line. CRLF terminated.

# Example Pi response:
"""
Content-Type: application/json
Content-Length: 24
Date: Mon, 30 Jan 2026 12:00:00 GMT
"""
```

---

### 23) Response Headers Carry Metadata (Line ~314)

**Context:** Headers describe body, caching rules, redirect targets, server behavior; not content itself.

```python
# Response headers describe:
# - The body (if any)
# - Caching rules
# - Redirect targets
# - Server behavior

# They do NOT contain the content itself
```

---

### 24) Common Response Headers (Line ~325)

**Context:** Content-Type (format), Content-Length (size), Location (redirect), Cache-Control, Set-Cookie, Date.

```python
# Frequently seen response headers:
# - Content-Type: application/json (body format)
# - Content-Length: 24 (body size in bytes)
# - Location: /api/sensors/voltage (redirect target)
# - Cache-Control: no-cache (caching rules)
# - Set-Cookie: session=abc123 (session data)
# - Date: Mon, 30 Jan 2026 12:00:00 GMT (server timestamp)
```

---

### 25) Headers Are Case-Insensitive (Line ~336)

**Context:** Content-Type = content-type = CONTENT-TYPE; convention favors capitalization.

```python
# These are equivalent:
# Content-Type
# content-type
# CONTENT-TYPE

# Convention favors capitalization
# Clients must not depend on it
```

---

### 26) Header Order Is Not Significant (Line ~347)

**Context:** Headers are a set; clients must not depend on ordering.

```python
# Order of headers does not matter

# Clients must:
# - Read headers as a set
# - Not depend on ordering
```

---

### 27) The Blank Line Is Mandatory (Line ~356)

**Context:** After headers, blank line (CRLF) marks end of headers, start of body.

```python
# After headers, server sends a blank line

# This blank line:
# - Is exactly CRLF (\r\n)
# - Marks end of headers
# - Marks start of body (if any)
```

---

### 28) The Blank Line Is a Boundary (Line ~366)

**Context:** Everything before = metadata; everything after = payload; clients must respect boundary.

```python
# Phase 0 boundary principle applies:
# - Everything before blank line is metadata
# - Everything after is payload

# Clients must respect this boundary
```

---

### 29) The Body Is Optional (Line ~375)

**Context:** 204 No Content, 304 Not Modified, HEAD responses have no body.

```python
# Response may include a body

# Some responses never include a body:
# - 204 No Content (successful DELETE—nothing to return)
# - 304 Not Modified (cached version valid—no body needed)
# - Responses to HEAD requests (headers only, never body)

# Example: DELETE /api/sensors/old_id → 204 No Content (no body)
```

---

### 30) The Body Is Raw Bytes (Line ~389)

**Context:** HTTP doesn't interpret body; stream of bytes interpreted by client using headers.

```python
# HTTP does NOT interpret body content

# Body is:
# - A stream of bytes
# - Interpreted by client using headers

# HTTP doesn't care if it's:
# - HTML
# - JSON
# - XML
# - Binary
# - Garbage
```

---

### 31) Content-Type Explains the Body (Line ~403)

**Context:** Content-Type tells client how to interpret body; without it, body is ambiguous.

```python
# Content-Type header tells client how to interpret body

# Example:
"""
Content-Type: application/json
"""

# Pi responds to GET /api/voltage with Content-Type: application/json
# Body: {"voltage": 12.4}
# Dashboard knows to parse as JSON

# Without it, body is ambiguous
```

---

### 32) Content-Length Explains the Size (Line ~419)

**Context:** Content-Length tells client how many bytes to read; without it, may misread body.

```python
# Content-Length header tells client how many bytes to read

# Example:
"""
Content-Length: 24
"""

# Pi responds with {"voltage": 12.4} (24 bytes)
# Content-Length: 24 tells dashboard to read exactly 24 bytes, then stop

# Without it, client may:
# - Use chunked encoding
# - Wait for connection close
# - Misread the body
```

---

### 33) The Response Is Complete When the Body Ends (Line ~436)

**Context:** Response ends when Content-Length bytes read, connection closes, or chunked stream ends.

```python
# Response ends when:
# - Content-Length bytes are read (read 24 bytes, stop)
# - OR connection closes (server closed it)
# - OR chunked stream ends (last chunk with size 0)

# After that, client may:
# - Send another request (if keep-alive)
# - Close connection
```

---

### 34) No Extra Data Is Allowed (Line ~450)

**Context:** Extra bytes after response may be treated as new response or corruption.

```python
# If extra bytes appear after response:
# - Client may treat them as new response
# - Or treat connection as corrupted

# Example: Pi sends Content-Length: 24 but actually 30 bytes
# Dashboard reads 24 bytes, stops
# Remaining 6 bytes in buffer
# Next request might parse those 6 bytes—corruption

# Server must send exactly what it declares
```

---

### 35) Response Parsing Is Sequential (Line ~461)

**Context:** Read status line, parse code, read headers, detect blank line, read body; failure at any step invalidates.

```python
# Clients parse responses in order:
# 1. Read status line
# 2. Parse status code
# 3. Read headers
# 4. Detect blank line
# 5. Read body (if any)

# Failure at any step invalidates the response
```

---

### 36) HTTP Responses Are Deterministic (Line ~473)

**Context:** Same response bytes = same parsing; no ambiguity if structure is correct.

```python
# Given the same response bytes:
# - Every compliant client will parse them the same way
# - No ambiguity if structure is correct
```

---

### 37) Frameworks Hide This—but It Still Exists (Line ~480)

**Context:** Browser, HTTP library, server all parse/construct this; understanding removes mystery.

```python
# Even if you never see raw HTTP:
# - Browser parses this
# - HTTP library parses this
# - Server constructs this

# Understanding it removes mystery
```

---

### 38) Debugging Starts at the Status Line (Line ~490)

**Context:** What status code returned? Was there response at all? Did connection fail?

```python
# When something goes wrong, ask:
# - What status code was returned? (200? 404? 500?)
# - Was there a response at all? (status line or connection drop?)
# - Did connection fail? (no response = transport failure, not HTTP error)

# Example: ESP32 sends POST, gets no response
# Check: Did you get any HTTP response at all?
# If no → connection failed (transport layer)
# If yes → check status code (500 = server error, 400 = bad request)
```

---

### 39) Absence Is Not a Response (Line ~500)

**Context:** Connection drops, server crashes, network fails = no response; not 5xx, it's absence.

```python
# If:
# - Connection drops (network hiccup)
# - Server crashes (Pi rebooted)
# - Network fails (Wi-Fi disconnected)

# There is NO response
# This is NOT a 5xx
# It is absence

# Example: dashboard sends GET /api/voltage but Pi's Wi-Fi disconnected
# No response arrives—this is not 500 Internal Server Error
# Dashboard experiences timeout, not HTTP error
```

---

### 40) The Response Is the Server's Only Voice (Line ~515)

**Context:** Server cannot send explanations later; everything must fit in the response.

```python
# Server cannot:
# - Send explanations later
# - Clarify intent afterward
# - Speak outside a response

# Everything it wants client to know must fit here
```

---

### Reflection: Response Structure Analysis (Line ~525)

**Context:** 200 with no body? No response vs 500? 302 requires what header?

```python
# If client receives 200 but no body:
# → What does that mean? Check Content-Length: 0? Or body missing?
#   Both valid—status code says success

# If client receives no response at all:
# → How different from 500? No status line = transport failure, not HTTP error

# If server returns 302:
# → What must client look for? Location header for where to go next

# Failure modes:
# Dashboard sends GET /api/voltage, gets 200 OK with no body
# → Request succeeded, but no data. Content-Length: 0? Body missing? Both valid.

# ESP32 sends POST, gets no response—connection dropped
# → Transport failure, not 500 error. Did you get status line at all?

# Coop controller gets 302 Found
# → Check Location header for where to look next. Redirect is instruction, not error.

# Dashboard gets 500 with body {"error": "sensor read failed"}
# → Request valid, Pi's sensor code crashed. Retryable.
```

---

## Chapter 2.09: Status Codes Overview

### 1) Status Codes Are Part of the Contract (Line ~16)

**Context:** Server must choose status code; tells client what happened at protocol boundary.

```python
# When server responds, it must choose a status code
# That choice is part of the HTTP contract

# Status code tells client:
# - Did request reach the server?
# - Did server understand it?
# - Did server act on it?
# - Who is responsible for outcome?

# Everything else in the response is secondary
```

---

### 2) Status Codes Are for Machines First (Line ~31)

**Context:** Clients see 404, not "Not Found"; number drives behavior.

```python
# Status codes are designed for clients, not humans

# Humans may see:
"""
404 Not Found
"""

# But client (dashboard, ESP32, coop controller) sees:
"""
404
"""

# The number drives behavior
# Dashboard checks: if status_code == 404:
# Not the text "Not Found"
```

---

### 3) The First Digit Is the Category (Line ~50)

**Context:** 2xx success, 3xx redirect, 4xx client error, 5xx server error.

```python
# HTTP status codes grouped by first digit
# First digit defines class of outcome:
# - 2xx → success
# - 3xx → redirection
# - 4xx → client-side failure
# - 5xx → server-side failure

# This classification is deliberate and fundamental
```

---

### 4) Status Codes Answer One Core Question (Line ~63)

**Context:** Did request complete successfully, and if not, where did it fail?

```python
# Every status code answers this question:
# "Did the request complete successfully, and if not, where did it fail?"

# NOT:
# - Was the data good?
# - Was the server happy?
# - Did user get what they wanted?

# Just: what happened to the request
```

---

### 5) 1xx: Informational (Mostly Ignored) (Line ~77)

**Context:** Request received, processing continuing, no final outcome yet; rare in practice.

```python
# 1xx range exists but rarely encountered

# 1xx codes mean:
# - Request was received
# - Processing is continuing
# - No final outcome yet

# Examples: 100 Continue, 101 Switching Protocols

# For now:
# - Know they exist
# - Know they are transitional
# - Know they are rare in practice
```

---

### 6) 2xx: Success (Line ~96)

**Context:** Request reached server, understood, acted on successfully; protocol-level success.

```python
# 2xx status means:
# - Request reached the server
# - Server understood it
# - Server acted on it successfully

# This is protocol-level success
```

---

### 7) Success Does Not Mean "Everything Is Fine" (Line ~106)

**Context:** 2xx doesn't mean data is meaningful, expected, or system is healthy; just request was handled.

```python
# CRITICAL distinction:
# 2xx does NOT mean:
# - Resource contained meaningful data (200 OK with {"voltage": null})
# - User got what they expected (200 OK with HTML error page)
# - System state is ideal (200 OK with {"error": "sensor offline"})

# It only means: request was handled successfully

# Example: GET /api/voltage → 200 OK with {"voltage": null}
# Request succeeded. Data indicates sensor returned null.
```

---

### 8) 200 OK: Generic Success (Line ~122)

**Context:** Request succeeded, response contains representation; most common status code.

```python
# 200 OK means:
# - Request succeeded
# - Response contains a representation of the resource

# Most common status code

# Example use cases:
# - GET returns data: GET /api/voltage → 200 OK with {"voltage": 12.4}
# - POST processed successfully: POST /api/temp → 200 OK with confirmation
```

---

### 9) 201 Created: Resource Creation (Line ~138)

**Context:** Request succeeded, new resource was created; usually paired with POST and Location header.

```python
# 201 Created means:
# - Request succeeded
# - New resource was created as a result

# Usually paired with:
# - POST
# - Location header pointing to new resource

# Example: ESP32 sends POST /api/sensors to register
# Pi responds 201 Created with Location: /api/sensors/esp32_coop
# Something new now exists
```

---

### 10) 204 No Content: Success Without a Body (Line ~150)

**Context:** Request succeeded, intentionally no response body; not an error, it's explicit success with silence.

```python
# 204 No Content means:
# - Request succeeded
# - There is no response body

# This is NOT an error
# This is intentional

# Used when:
# - Update succeeded: PUT /api/config → 204 No Content
# - Nothing needs to be returned: DELETE /api/sensors/old_id → 204 No Content
```

---

### 11) 2xx Means "Do Not Retry" (Line ~166)

**Context:** Request worked; retrying may cause duplicate actions.

```python
# In general:
# - 2xx → do NOT retry automatically

# The request worked
# Retrying may cause duplicate actions

# Example: ESP32 sends POST /api/temp, gets 200 OK
# Retrying would send same temperature reading twice—duplicate data
# Don't retry success
```

---

### 12) 3xx: Redirection (Line ~177)

**Context:** Request was valid, server wants client to take another step; not a failure, it's guidance.

```python
# 3xx status means:
# - Request was valid
# - Server wants client to take another step

# This is NOT a failure
# It is guidance
```

---

### 13) Redirection Is Explicit Behavior (Line ~187)

**Context:** Server says "look over here instead"; Location header carries new target.

```python
# Redirect is server saying:
# "What you want exists, but not here."

# Server must tell client where to go next
# That information is carried in headers (Location), not status code alone
```

---

### 14) 301 Moved Permanently (Line ~198)

**Context:** Resource has permanently moved; clients should update bookmarks; caches may store redirect.

```python
# 301 means:
# - Resource has permanently moved
# - Clients should update bookmarks
# - Caches may store this redirect

# Strong signal

# Example: /api/voltage permanently moved to /api/sensors/voltage
# Responds 301 with Location: /api/sensors/voltage
# Dashboard should update code to use new path—this is permanent
```

---

### 15) 302 Found (Temporary Redirect) (Line ~211)

**Context:** Resource temporarily elsewhere; client should not assume permanence; common in login flows.

```python
# 302 means:
# - Resource is temporarily elsewhere
# - Client should not assume permanence

# Common in:
# - Login flows
# - Temporary routing

# Example: /api/voltage temporarily routes to /api/sensors/voltage
# Responds 302 with Location: /api/sensors/voltage
# Client follows redirect
```

---

### 16) 304 Not Modified (Line ~224)

**Context:** Client's cached version is still valid; no body sent; client should reuse cache; saves bandwidth.

```python
# 304 is special

# It means:
# - Client's cached version is still valid
# - No body is sent
# - Client should reuse its cache

# Saves bandwidth and time

# Example: GET /api/voltage with If-None-Match: "abc123"
# Pi checks—data hasn't changed
# Responds 304 Not Modified with no body
# Dashboard uses cached version
```

---

### 17) 3xx Does Not Mean Error (Line ~237)

**Context:** Redirects are successful control-flow signals, not errors.

```python
# Many people treat redirects as errors
# They are NOT

# Redirects are successful control-flow signals
```

---

### 18) 4xx: Client Error (Line ~246)

**Context:** Request reached server, server understood, refuses due to client-side issues.

```python
# 4xx status means:
# - Request reached the server
# - Server understood it
# - Server refuses or cannot process due to client-side issues
```

---

### 19) 4xx Means "Fix the Request" (Line ~254)

**Context:** Client must change something; retrying same request will usually fail again.

```python
# Core rule:
# 4xx means the client must change something
# Retrying same request will usually fail again

# Examples:
# ESP32 sends GET /api/voltage without auth → 401 Unauthorized
# Retrying same request (still no auth) will fail again
# Fix: add Authorization header

# Dashboard sends GET /api/nonexistent → 404 Not Found
# Retrying won't help—path doesn't exist
# Fix: correct the path
```

---

### 20) 400 Bad Request (Line ~265)

**Context:** Request malformed, invalid syntax, missing fields, unparseable body.

```python
# 400 means:
# - Request was malformed
# - Invalid syntax
# - Missing required fields
# - Unparseable body

# Server could not understand request as sent

# Example: ESP32 sends POST /api/temp with malformed JSON
# {"temp": 72.5  (missing closing brace)
# Pi responds 400 Bad Request—syntax is invalid
```

---

### 21) 401 Unauthorized (Line ~278)

**Context:** Authentication required, credentials missing or invalid; often includes WWW-Authenticate header.

```python
# 401 means:
# - Authentication is required
# - Credentials are missing or invalid

# Important detail:
# - 401 often includes WWW-Authenticate header
# - Does NOT mean forbidden

# Example: ESP32 sends GET /api/voltage without Authorization header
# Pi responds 401 Unauthorized—authentication required
# ESP32 must include valid token
```

---

### 22) 403 Forbidden (Line ~292)

**Context:** Server knows who you are, you're not allowed; authentication succeeded, authorization failed.

```python
# 403 means:
# - Server understood who you are
# - You are NOT allowed to do this

# Authentication succeeded
# Authorization failed

# Example: ESP32 authenticates but tries DELETE /api/config (admin-only)
# Pi responds 403 Forbidden—authenticated but not authorized
```

---

### 23) 404 Not Found (Line ~303)

**Context:** Server cannot find requested resource; path doesn't map to anything.

```python
# 404 means:
# - Server cannot find requested resource
# - Path does not map to anything

# Does NOT say:
# - Whether resource existed before
# - Whether it might exist later

# Example: GET /api/nonexistent → 404 Not Found
# Or GET /api/sensors/999 (sensor doesn't exist) → 404
```

---

### 24) 4xx Errors Are Not Server Failures (Line ~316)

**Context:** Server is functioning correctly, enforcing rules; blaming server for 4xx usually incorrect.

```python
# Server is functioning correctly
# It is enforcing rules

# Blaming the server for 4xx is usually incorrect

# Example: ESP32 gets 401 Unauthorized
# Pi is working correctly—enforcing authentication
# ESP32 needs to fix its request (add auth token)
# Don't blame Pi for doing its job
```

---

### 25) 5xx: Server Error (Line ~325)

**Context:** Request was valid, server failed while handling it; server admitting fault.

```python
# 5xx status means:
# - Request was valid
# - Server failed while handling it

# This is the server admitting fault
```

---

### 26) 500 Internal Server Error (Line ~335)

**Context:** Something went wrong, server can't provide detail, failure after request parsing; generic server failure.

```python
# 500 means:
# - Something went wrong
# - Server cannot provide more detail
# - Failure occurred after request parsing

# Generic server failure

# Example: GET /api/voltage but Pi's sensor code crashes
# Responds 500 Internal Server Error
# Request valid, server failed while processing
```

---

### 27) 502 Bad Gateway (Line ~347)

**Context:** Server is gateway/proxy, upstream service failed; common in microservice architectures.

```python
# 502 means:
# - Server is acting as gateway or proxy
# - Upstream service failed

# Common in microservice architectures

# Example: reverse proxy forwards to Pi, but Pi is down
# Proxy responds 502 Bad Gateway
# Gateway (proxy) working, upstream (Pi) failed
```

---

### 28) 503 Service Unavailable (Line ~358)

**Context:** Server temporarily unable to handle request; often overload or maintenance; clients may retry later.

```python
# 503 means:
# - Server is temporarily unable to handle the request
# - Often due to overload or maintenance

# Clients may retry later

# Example: Pi rebooting or overloaded
# ESP32 sends POST /api/temp
# Pi responds 503 Service Unavailable—temporarily down
# ESP32 should retry after delay
```

---

### 29) 5xx Means "Retry May Help" (Line ~369)

**Context:** 5xx = retry might succeed; 4xx = retry will likely fail; 2xx = retry may cause harm.

```python
# In general:
# - 5xx → retry might succeed
# - 4xx → retry will likely fail
# - 2xx → retry may cause harm

# This matters for automation

# Example: ESP32 sends temp readings every 5 minutes
# Gets 503 → retry after delay (server might recover)
# Gets 401 → retry won't help (fix auth token first)
# Status code drives retry decision
```

---

### 30) Status Codes Encode Responsibility (Line ~381)

**Context:** 2xx = no one failed; 3xx = coordination needed; 4xx = client; 5xx = server; no response = network.

```python
# Most important mental model:
# - 2xx → no one failed
# - 3xx → coordination required
# - 4xx → client responsibility
# - 5xx → server responsibility
# - No response → network/transport failure
```

---

### 31) Absence Is Not a Status Code (Line ~391)

**Context:** Connection timeout, DNS failure, network drop = no status code; not 5xx, it's absence.

```python
# If:
# - Connection times out
# - DNS fails
# - Network drops

# There is NO status code
# This is NOT a 5xx
# It is absence
```

---

### 32) Clients Must Distinguish Absence from Error (Line ~404)

**Context:** Missing response = server may never have seen request; 500 = server saw and failed; different modes.

```python
# Missing response means:
# - Server may never have seen the request

# 500 means:
# - Server saw the request and failed

# Completely different failure modes

# Example: ESP32 sends POST /api/temp but Wi-Fi drops
# No response arrives—absence. Pi never saw request.
# Contrast: 500 Internal Server Error—Pi saw, parsed, crashed
# Different failures require different handling
```

---

### 33) Status Codes Drive Client Behavior (Line ~417)

**Context:** Clients decide: retry, redirect, cache, abort, prompt user; correctness matters.

```python
# Clients use status codes to decide:
# - Retry?
# - Redirect?
# - Cache?
# - Abort?
# - Prompt user?

# This is why correctness matters

# Example: dashboard checks if status_code == 200: display voltage
# If 404: show "sensor not found"
# If 500: show "server error", retry
# If 503: show "temporarily unavailable", retry later
# Status code drives all decisions
```

---

### 34) APIs Live or Die on Status Codes (Line ~431)

**Context:** Good APIs use codes precisely; poor APIs always return 200 with errors in JSON, breaking automation.

```python
# Well-designed APIs:
# - Use status codes precisely
# - Do not overload meaning into body
# - Let clients behave mechanically

# Poor APIs:
# - Always return 200 (even on errors)
# - Hide errors in JSON: {"error": "not found"} with 200 OK
# - Break automation

# Example: Pi always returns 200 OK even when sensor doesn't exist
# Body: {"error": "sensor not found"}
# Dashboard can't distinguish success from failure—must parse body
# Bad design. Use 404 for missing resources.
```

---

### 35) Status Codes Are Not Optional (Line ~445)

**Context:** Wrong status code is protocol violation in spirit; correct codes = good HTTP citizen.

```python
# Returning wrong status code is protocol violation in spirit
# Even if not enforced

# Correct status codes are part of being a good HTTP citizen
```

---

### Reflection: Status Code Analysis (Line ~453)

**Context:** No response = blame network; 403 = change auth/endpoint; 503 = retry later; always 200 = bad design.

```python
# If request fails with no response, who do you blame?
# → Network/transport layer. This is absence, not HTTP error.

# If request returns 403, what must change?
# → Fix auth/permissions, use different endpoint, accept you can't do this

# If request returns 503, should client retry?
# → Yes, after delay. Server might recover.

# If API always returns 200, how do clients know what happened?
# → They can't—must parse body. Bad design.

# Failure modes:
# ESP32 sends POST, no response → network dropped, Pi never saw it
# Dashboard gets 403 → authenticated but not authorized
# Pi returns 503 → rebooting, retry later
# Pi always returns 200 with {"error": "..."} → bad design, use proper codes
```

---

## Chapter 2.10: Status Codes — Success and Redirects

### 1) Why Success Codes Need Precision (Line ~18)

**Context:** Clients rely on codes to decide cache, retry, follow URL, expect body; wrong code breaks client behavior.

```python
# Many systems collapse all success into 200 OK
# That works—until it doesn't

# Clients rely on status codes to decide:
# - Whether something new exists (201 Created)
# - Whether to cache (304 Not Modified)
# - Whether to retry (5xx vs 2xx)
# - Whether to follow another URL (3xx)
# - Whether response body should exist (204 vs 200)

# Wrong success code doesn't break protocol
# It breaks client behavior
```

---

### 2) Success Means "The Server Did the Thing" (Line ~35)

**Context:** 2xx = request valid, server acted, action completed; not that client is satisfied or data is useful.

```python
# 2xx response means:
# - Request was valid
# - Server acted on it
# - Action completed

# It does NOT mean:
# - Client is satisfied
# - Data is useful
# - System is healthy

# Just that request completed as requested
```

---

### 3) 200 OK — Generic Success (Line ~52)

**Context:** Request succeeded, body contains representation; default when no more specific code applies.

```python
# 200 OK is most common success code

# It means:
# - Request succeeded
# - Response body contains a representation of the result

# Default when no more specific success code applies

# Example: GET /api/voltage → 200 OK with {"voltage": 12.4}
# Generic success—no creation, no deletion, just successful request with body
```

---

### 4) When 200 OK Is Correct (Line ~66)

**Context:** GET returns data, POST returns resource without creating, PUT returns updated resource.

```python
# Use 200 OK when:
# - GET returns data
# - POST returns a resource but did not strictly "create" it
# - PUT returns the updated resource
# - Operation succeeds and returns meaningful content

# Key property: there is something in the body client should read

# Examples:
# GET /api/voltage → 200 OK with {"voltage": 12.4} (body has data)
# POST /api/temp → 200 OK with {"status": "received"} (confirmation)
```

---

### 5) When 200 OK Is Lazy (Line ~80)

**Context:** Created something = should be 201; deleted something = should be 204; 200 is semantically weak.

```python
# Using 200 OK for everything hides meaning

# If client:
# - Created something → should be 201 Created
# - Deleted something → should be 204 No Content
# - Performed action with no return → should be 204 No Content

# Then 200 OK may be technically valid—but semantically weak
# Better codes exist

# ESP32 creates sensor, gets 200 OK → technically correct
# But 201 Created tells client "something new exists" more clearly
```

---

### 6) 201 Created — Creation Has Meaning (Line ~94)

**Context:** Request succeeded, new resource now exists; commonly used with POST.

```python
# 201 Created means:
# - Request succeeded
# - New resource now exists as a result

# Most commonly used with POST

# Example: ESP32 sends POST /api/sensors to register
# Pi creates sensor record, responds 201 Created
# With Location: /api/sensors/esp32_coop
# ESP32 knows new resource exists and where to find it
```

---

### 7) What Makes 201 Different from 200 (Line ~105)

**Context:** 201 tells client: you have a new thing, it has identity, you may want to interact with it.

```python
# Difference is NOT subtle

# 201 Created tells client:
# - You now have a new thing
# - It has an identity
# - You may want to interact with it next

# This is information client cannot infer from body alone

# Example: POST /api/sensors → 201 Created with Location header
# Status code tells client "something new exists"—even if body is empty
# With 200 OK, client might think it's just confirmation, not new resource
```

---

### 8) The Location Header with 201 (Line ~121)

**Context:** 201 should usually include Location header pointing to new resource.

```python
# 201 Created response should usually include:
"""
Location: /api/sensors/esp32_coop
"""

# Tells client where the new resource lives

# Example: POST /api/sensors → 201 Created
# With Location: /api/sensors/esp32_coop
# ESP32 can now interact with its own resource at that path

# Not optional in spirit—even if some APIs skip it
```

---

### 9) Body or No Body with 201 (Line ~136)

**Context:** 201 may include body, often includes new resource, but doesn't have to; status code is critical signal.

```python
# 201 Created response:
# - May include a body
# - Often includes the newly created resource
# - But does not have to

# Critical signal is the status code, not the body

# Example: POST /api/sensors → 201 Created
# Body might be empty, or include new sensor data
# Either way, 201 signals creation
# ESP32 can use Location header to fetch resource if needed
```

---

### 10) 204 No Content — Success Without Payload (Line ~148)

**Context:** Request succeeded, intentionally no response body; explicit success with silence.

```python
# 204 No Content means:
# - Request succeeded
# - There is intentionally no response body

# This is NOT an error
# This is NOT incomplete
# It is explicit success with silence
```

---

### 11) When 204 Is the Right Choice (Line ~160)

**Context:** DELETE succeeded, PUT/PATCH succeeded with nothing to return, action with no representation needed.

```python
# Use 204 No Content when:
# - DELETE succeeded: DELETE /api/sensors/old_id → 204 No Content
# - PUT/PATCH succeeded but returns nothing: PATCH /api/fence → 204 No Content
# - Action occurred but no representation needed: PUT /api/config → 204 No Content

# Client should NOT expect a body
# Reading one would be a bug

# Example: DELETE /api/sensors/old_id
# Pi deletes, responds 204 No Content with no body
# Dashboard knows deletion succeeded—no body to parse, move on
```

---

### 12) Why 204 Is Better Than 200 with Empty Body (Line ~173)

**Context:** 200 with no body is ambiguous; 204 is explicit—nothing to parse, operation complete.

```python
# Returning:
# - 200 OK with no body → ambiguous (did server forget body? Is it empty?)
# - 204 No Content → explicit (intentionally no body, operation complete)

# 204 tells client: nothing to parse, move on

# Example: DELETE /api/sensors/old_id
# 200 OK with no body → dashboard might wait for body that never comes
# 204 No Content → dashboard knows immediately: nothing to read, done
```

---

### 13) Clients Must Respect 204 (Line ~187)

**Context:** Don't parse body, don't expect Content-Type, treat operation as complete; servers should not send body.

```python
# Clients should:
# - NOT attempt to parse a body
# - NOT expect Content-Type
# - Treat operation as complete

# Servers should NOT send a body with 204

# Example: DELETE → 204 No Content
# If Pi mistakenly includes body like {"deleted": true}
# Dashboard might try to parse—but 204 means no body
# Server violated protocol
```

---

### 14) Redirects Are Controlled Success (Line ~200)

**Context:** Redirects are instructions, not errors; request valid, resource not here, client must take another step.

```python
# Redirects are NOT errors
# They are instructions

# 3xx response means:
# - Request was valid
# - Resource is not here
# - Client must take another step
```

---

### 15) Redirects Exist Because the Web Moves (Line ~211)

**Context:** Resources change location, URLs evolve, systems reorganized; redirects say "yes, but not here."

```python
# Resources change location
# URLs evolve
# Systems are reorganized

# Redirects let servers say:
# "Yes, but not here."
```

---

### 16) 301 Moved Permanently (Line ~222)

**Context:** Resource has new permanent URL; clients should update bookmarks; caches may store redirect.

```python
# 301 Moved Permanently means:
# - Resource has new permanent URL
# - Clients should update bookmarks
# - Caches may store the redirect

# Strong signal

# Example: /api/voltage permanently moved to /api/sensors/voltage
# Responds 301 with Location: /api/sensors/voltage
# Dashboard should update code to use new path—this is permanent
```

---

### 17) Why 301 Is Dangerous if Misused (Line ~234)

**Context:** Once cached, 301 persists long time; sending incorrectly means clients may never check old URL again.

```python
# Once cached, 301 can persist for a long time

# If you send 301 incorrectly:
# - Clients may never check old URL again
# - Undoing it can be painful

# Only use 301 when you mean it

# Example: Pi sends 301 for /api/voltage → /api/sensors/voltage
# Dashboard caches redirect
# Later, you realize move was temporary
# Too late—dashboard may never check /api/voltage again
# Use 302 for temporary moves
```

---

### 18) Browser Behavior with 301 (Line ~248)

**Context:** Browsers may rewrite future requests, change POST to GET; historical behavior, be aware.

```python
# Browsers often:
# - Rewrite future requests automatically
# - Change POST to GET in some cases

# Historical behavior—be aware

# Example: dashboard sends POST /api/temp, gets 301 to /api/sensors/temp
# Some browsers might change redirect to GET /api/sensors/temp
# Losing the POST body
# Be careful redirecting non-GET requests
```

---

### 19) 302 Found — Temporary Redirect (Line ~263)

**Context:** Resource temporarily at different URL; clients should not update bookmarks; softer than 301.

```python
# 302 Found means:
# - Resource is temporarily at different URL
# - Clients should NOT update bookmarks
# - Future requests may still go to original URL

# Softer than 301
```

---

### 20) When to Use 302 (Line ~275)

**Context:** Redirecting after form submission, login flows, routing traffic temporarily; "go there for now."

```python
# Use 302 when:
# - Redirecting after form submission
# - Handling login flows
# - Routing traffic temporarily

# Server is saying: "Go there for now."
```

---

### 21) Redirects Require the Location Header (Line ~285)

**Context:** All redirects must include Location header; without it, client has no instruction.

```python
# All redirect responses must include:
"""
Location: /api/sensors/voltage
"""

# Without it, client has no instruction
# Redirect without Location is broken

# Example: /api/voltage → 302 Found but no Location header
# Where should dashboard go? Redirect is broken.
```

---

### 22) Redirects Without Bodies (Line ~299)

**Context:** Redirect responses usually have no meaningful body; rely on status code + Location.

```python
# Redirect responses usually:
# - Have no meaningful body
# - Rely entirely on status code + Location

# Body may exist, but clients should not rely on it

# Example: 302 Found with Location: /api/sensors/voltage
# Might have HTML body with message, but dashboard ignores it
# Follow Location header—that's the signal
```

---

### 23) 304 Not Modified — Cache Control, Not Navigation (Line ~312)

**Context:** Not a redirect; client's cached version still valid; server says "use what you already have."

```python
# 304 Not Modified is NOT a redirect in usual sense

# It means:
# - Client's cached version is still valid
# - Server explicitly says "use what you already have"

# Saves bandwidth
```

---

### 24) When 304 Happens (Line ~323)

**Context:** Client sends conditional request with If-None-Match or If-Modified-Since; resource hasn't changed.

```python
# 304 occurs when:
# - Client sends conditional request
# - Headers like If-None-Match or If-Modified-Since present
# - Resource has not changed

# Example: GET /api/voltage with If-None-Match: "abc123"
# Pi checks—voltage data hasn't changed since that ETag
# Responds 304 Not Modified with no body
# Dashboard uses cached version, saving bandwidth
```

---

### 25) 304 Has No Body (Line ~334)

**Context:** 304 must not include body; body would be redundant; client already has it cached.

```python
# 304 response:
# - Must NOT include a body
# - Relies on client's cache

# Body would be redundant

# Example: GET /api/voltage with If-None-Match: "abc123"
# Pi responds 304 Not Modified with no body
# Why send body? Dashboard already has it cached
# That's the whole point of 304
```

---

### 26) Redirects vs Retries (Line ~346)

**Context:** Redirect = don't retry here, try somewhere else; different from errors.

```python
# Redirects tell client:
# - Do NOT retry the same request here
# - Try again somewhere else

# Different from errors

# Example: /api/voltage → 302 Found with Location: /api/sensors/voltage
# Don't retry /api/voltage—follow redirect to /api/sensors/voltage
# Contrast with 500: retry same request later, server might recover
```

---

### 27) Success and Redirects Are Cooperative Signals (Line ~359)

**Context:** These codes assume client is capable, will follow instructions, understands HTTP semantics.

```python
# These status codes assume:
# - Client is capable
# - Client will follow instructions
# - Client understands HTTP semantics

# They are cooperative, not defensive

# Example: Pi sends 301 assuming dashboard follows Location header
# If dashboard doesn't follow redirects, it breaks
# Dashboard's fault, not Pi's
```

---

### 28) APIs Often Misuse Redirects (Line ~371)

**Context:** Using redirects where errors appropriate, 200 with redirect in JSON; breaks generic clients.

```python
# APIs sometimes:
# - Use redirects where errors are appropriate (bad)
# - Use 200 with embedded redirect info in JSON (bad)

# This breaks generic clients

# Example: Pi responds 200 OK with body {"redirect": "/api/sensors/voltage"}
# Instead of 301 with Location header
# Dashboard must parse JSON to know to redirect
# Generic HTTP clients won't follow automatically
# Redirects belong in HTTP, not payloads
```

---

### 29) Idempotency Matters (Line ~382)

**Context:** GET safe to redirect; POST may be rewritten by clients; PUT/PATCH/DELETE require care.

```python
# Redirect behavior differs by method:
# - GET is safe to redirect freely
# - POST may be rewritten by clients (some change POST to GET)
# - PUT/PATCH/DELETE require care

# Design redirects deliberately

# Example: GET /api/voltage → 302 → GET /api/sensors/voltage
# Safe—GET is idempotent
# But redirect DELETE /api/sensors/1 to DELETE /api/sensors/2
# Dangerous—client might delete wrong resource
```

---

### 30) Success Codes Encode Intent (Line ~394)

**Context:** Difference between 200, 201, 204 is about what happened, not data; clients deserve clarity.

```python
# The difference between:
# - 200
# - 201
# - 204

# Is NOT about data
# It is about what happened

# Clients deserve that clarity
```

---

### Reflection: Success and Redirect Analysis (Line ~407)

**Context:** Delete resource = 204; create resource = 201; moves forever = 301; cached = 304.

```python
# You delete a resource. Return 200 or 204?
# → 204 No Content (nothing to return)

# You create a resource. Return 200 or 201?
# → 201 Created (new thing exists)

# Resource moves forever. Return 301 or 302?
# → 301 Moved Permanently (update bookmarks)

# Cached resource hasn't changed. Why 304 instead of 200?
# → 304 Not Modified saves bandwidth—don't resend what client has

# If answers are mechanical, you're learning the protocol—not guessing
```
