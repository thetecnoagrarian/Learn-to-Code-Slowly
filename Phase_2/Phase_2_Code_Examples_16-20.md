# Phase 2 Code Examples (Chapters 16-20)

This file contains visual references for all code examples mentioned in Phase 2 chapters 16-20. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 2.16: Headers — Content and Type

### 1) The Body Is an Opaque Byte Stream (Line ~22)

**Context:** Without headers, the body is just raw bytes with no meaning.

```python
# ESP32 sends POST /api/temp with body bytes
# 7b2274656d70223a2037322e357d

# Without headers, Pi doesn't know what these bytes mean
# Are they JSON? Plain text? Binary data?

# The body is just bytes—headers provide meaning
```

### 2) Headers Provide Semantic Context (Line ~35)

**Context:** Content-Type and Content-Length turn bytes into interpretable data.

```python
# ESP32 sends POST /api/temp with headers:
# Content-Type: application/json
# Content-Length: 15

# Pi reads headers first:
# - Structure: JSON
# - Interpretation rules: parse as JSON
# - Safety boundaries: read exactly 15 bytes

# Headers are the decoder ring—they turn bytes into meaning
```

### 3) Content-Type: The Meaning Header (Line ~48)

**Context:** Content-Type declares what format the body is in.

```python
# Common Content-Types:
# application/json      → API payloads
# text/html             → web pages
# text/plain            → plain text
# application/octet-stream → binary data
# application/x-www-form-urlencoded → form data

# ESP32 sends POST /api/temp with body {"temp": 72.5}
# Without Content-Type: application/json, Pi doesn't know if it's
# JSON, plain text, or something else
```

### 4) Content-Type Is a Contract (Line ~67)

**Context:** Content-Type is a promise from sender to receiver.

```python
# ESP32 sends:
# Content-Type: application/json
# Body: {"temp": 72.5}

# Pi trusts this promise—parses as JSON

# If body is actually: temp=72.5  (form-encoded)
# Pi rejects it—promise is broken

# Content-Type is a contract at the boundary
```

### 5) Content-Type Is Not Optional in Practice (Line ~81)

**Context:** Missing or wrong Content-Type is a client error.

```python
# ESP32 sends POST /api/temp
# Body: {"temp": 72.5}
# No Content-Type header

# Pi responds: 400 Bad Request
# Missing Content-Type

# Or ESP32 sends: Content-Type: text/plain with JSON body
# Pi responds: 400 Bad Request
# Wrong Content-Type
```

### 6) Common Content Types You Must Know (Line ~94)

**Context:** Five content types cover most of the web.

```python
# At minimum:
content_types = [
    "application/json",                  # APIs
    "text/html",                         # web pages
    "application/x-www-form-urlencoded", # classic forms
    "multipart/form-data",               # file uploads
    "text/plain",                        # plain text
]
```

### 7) application/json (Line ~107)

**Context:** JSON is the modern default for APIs.

```python
# ESP32 sends POST /api/temp:
# Content-Type: application/json

# Body:
body = '{"temp": 72.5, "sensor_id": "esp32_coop"}'

# Characteristics:
# - UTF-8 encoded text
# - Structured data
# - Machine-readable
# - Strict syntax
```

### 9) application/x-www-form-urlencoded (Line ~136)

**Context:** Classic HTML form encoding uses key=value pairs.

```python
# Dashboard submits form:
# Content-Type: application/x-www-form-urlencoded

# Body:
body = "threshold=75&unit=F"

# Pi parses as key=value pairs (not JSON)
# threshold → "75"
# unit → "F"
```

### 10) multipart/form-data (Line ~152)

**Context:** Multipart encoding handles file uploads with boundaries.

```python
# Dashboard uploads config file:
# Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

# Body has multiple parts separated by boundary
# More complex parsing than JSON or form-encoded

# Content-Type includes a boundary parameter—tells parser how to split parts
```

### 11) Content-Type Can Include Parameters (Line ~168)

**Context:** Parameters like charset modify interpretation.

```python
# Response header:
# Content-Type: text/html; charset=utf-8

# Main type: text/html (web page)
# Parameter: charset=utf-8 (how bytes map to characters)

# ESP32 sends:
# Content-Type: application/json; charset=utf-8
# Main type JSON, charset parameter for text encoding
```

### 12) Charset: How to Interpret Characters (Line ~181)

**Context:** Charset tells how bytes map to characters.

```python
# charset answers: "How do bytes map to characters?"

# Common values:
# utf-8       → modern standard, handles all characters
# iso-8859-1  → legacy

# ESP32 sends: Content-Type: application/json; charset=utf-8
# UTF-8 handles all characters—temperature readings, sensor IDs, error messages

# Modern systems should always use UTF-8
```

### 14) Content-Encoding vs Content-Type (Line ~210)

**Context:** Content-Type is what the data is; Content-Encoding is how it's compressed.

```python
# Content-Type: application/json   → what the data is
# Content-Encoding: gzip           → how it is compressed

# ESP32 sends POST /api/temp:
# Content-Type: application/json
# Content-Encoding: gzip

# Pi process order:
# 1. Decode gzip (decompress)
# 2. Parse JSON

# Decode first, then parse
```

### 15) Content-Encoding Is About Transport Efficiency (Line ~227)

**Context:** Content-Encoding reduces size but not meaning.

```python
# Common encodings:
# gzip     → most common
# br       → Brotli (newer, better compression)
# deflate  → older

# Pi responds to GET /api/voltage:
# Content-Type: application/json
# Content-Encoding: gzip

# Body is compressed (smaller), but still JSON after decompression
# They reduce size, not meaning
```

### 16) Content-Length: Body Size Boundary (Line ~240)

**Context:** Content-Length tells receiver exactly how many bytes belong to the body.

```python
# ESP32 sends POST /api/temp:
# Content-Length: 15

# Body: {"temp": 72.5}

# Pi reads exactly 15 bytes, then stops
# Knows where the body ends

# Essential for stream parsing
```

### 18) Content-Length Enables Keep-Alive (Line ~262)

**Context:** Content-Length lets multiple requests share a connection.

```python
# ESP32 sends GET /api/voltage with Connection: keep-alive
# Pi responds with Content-Length: 24

# Then ESP32 sends another request on the same connection
# Content-Length tells Pi where one body ends
# and where the next request begins

# Without Content-Length, keep-alive breaks
```

### 19) Incorrect Content-Length Is Dangerous (Line ~274)

**Context:** Wrong Content-Length causes truncation or hangs.

```python
# ESP32 sends POST /api/temp:
# Content-Length: 10
# Body (actually 15 bytes): {"temp": 72.5}

# Pi reads 10 bytes: {"temp": 7
# Truncated body—parsing fails

# Or:
# Content-Length: 20
# Body (only 15 bytes): {"temp": 72.5}

# Pi waits for 5 more bytes—hangs

# Too small → truncated; too large → hangs
```

### 21) Transfer-Encoding: An Alternative (Line ~296)

**Context:** Chunked encoding streams data when size is unknown.

```python
# When Content-Length is unknown:
# Transfer-Encoding: chunked

# Pi streams sensor data:
# 5\r\n        (chunk size: 5 bytes)
# {"tem        (chunk data)
# 10\r\n       (chunk size: 16 bytes, hex 10 = 16)
# p": 72.5}\r\n (chunk data)
# 0\r\n\r\n    (zero-length chunk = end)

# Body sent in chunks with explicit boundaries
```

### 23) Clients Must Support Both (Line ~321)

**Context:** HTTP/1.1 requires handling both Content-Length and chunked.

```python
# HTTP/1.1 clients must handle:
# - Content-Length: 15   (fixed size)
# - Transfer-Encoding: chunked  (streaming)

# ESP32 must support both
# Dashboard must support both

# Ignoring either breaks compatibility
```

### 24) Accept: Client Preferences (Line ~333)

**Context:** Accept header declares what formats the client can understand.

```python
# ESP32 sends GET /api/voltage:
# Accept: application/json

# Tells Pi: "I can understand JSON"

# Accept is a request header—client tells server
# what formats it can understand
```

### 25) Accept Is About Capability, Not Demand (Line ~349)

**Context:** Accept expresses capability; server chooses what to send.

```python
# ESP32 sends GET /api/voltage:
# Accept: application/json

# Pi may respond with JSON
# Or may respond with 406 Not Acceptable if it can't produce JSON

# Accept is capability, not demand
# Client says "I can handle JSON"
# Server chooses whether to send it
```

### 27) Quality Values (q=) (Line ~380)

**Context:** Accept can include priorities with q values.

```python
# Dashboard sends GET /api/voltage:
# Accept: application/json;q=1.0, text/html;q=0.5

# JSON has q=1.0 (preferred)
# HTML has q=0.5 (acceptable)

# Pi sees JSON preferred, selects JSON
# Higher q = preferred
```

### 28) Content Negotiation (Line ~394)

**Context:** Client and server negotiate the best representation.

```python
# Content negotiation process:
# 1. Client sends Accept: application/json, text/html;q=0.5
# 2. Server selects a representation (JSON preferred)
# 3. Server responds with Content-Type: application/json

# This is negotiation—client expresses preferences
# Server selects representation, responds with chosen Content-Type
```

### 31) Accept ≠ Content-Type (Line ~429)

**Context:** Accept and Content-Type serve different purposes.

```python
# Common confusion:

# Accept = what the client wants (request header)
# Content-Type = what the sender sent (request or response header)

# ESP32 sends GET /api/voltage:
# Accept: application/json        ← what I want

# Pi responds:
# Content-Type: application/json  ← what I sent

# Never swap them
```

### 32) Servers Must Validate Accept (Line ~441)

**Context:** Servers should check if they can satisfy Accept.

```python
# ESP32 sends GET /api/voltage:
# Accept: application/xml

# Pi checks: can I produce XML?
# No, only JSON

# Strict API responds: 406 Not Acceptable
# Or ignores Accept, always returns JSON (design decision)
```

### 34) Content-Type Validation Is Mandatory (Line ~463)

**Context:** Servers must validate Content-Type and reject mismatches.

```python
# ESP32 sends POST /api/temp:
# Content-Type: text/plain
# Body: {"temp": 72.5}

# Pi validates Content-Type
# Sees mismatch—body looks like JSON, header says text/plain
# Rejects with 400 Bad Request

# Prevents parsing ambiguity and attacks
```

### 36) Content-Type Lies Are Common (Line ~486)

**Context:** Never trust Content-Type blindly; validate against body.

```python
# ESP32 sends POST /api/temp:
# Content-Type: application/json
# Body: temp=72.5  (actually form-encoded)

# Pi validates:
# Content-Type says JSON
# Body isn't JSON
# Rejects

# Content-Type lies are common—never trust blindly
```

### 37) Phase 0 Revisited: Boundaries Defend (Line ~499)

**Context:** At the boundary, validate everything before parsing.

```python
# ESP32 sends POST /api/temp

# Pi at boundary:
# 1. Read headers
# 2. Validate Content-Type (is it JSON?)
# 3. Validate Content-Length (does it match body?)
# 4. Validate encoding (can I decode it?)
# 5. Reject early if invalid

# Do not parse garbage
```

### 38) Parsing Depends Entirely on Headers (Line ~514)

**Context:** Same bytes, different headers, completely different behavior.

```python
# ESP32 sends body bytes: 7b2274656d70223a2037322e357d

# With Content-Type: application/json
# → Pi parses as JSON

# With Content-Type: text/plain
# → Pi treats as text

# With no Content-Type
# → Ambiguous—can't parse safely

# Headers determine behavior
```

### 40) Content-Length and Security (Line ~538)

**Context:** Incorrect Content-Length handling leads to security exploits.

```python
# ESP32 sends POST /api/temp with conflicting headers:
# Content-Length: 15
# Transfer-Encoding: chunked

# Incorrect handling leads to:
# - Request smuggling (malicious request hidden in body)
# - Response splitting
# - Buffer confusion

# Many historical exploits live here
# Content-Length and security are tightly coupled
```

### 42) APIs vs Browsers (Line ~563)

**Context:** Browsers tolerate ambiguity; APIs must be strict.

```python
# Browsers:
# - Tolerate ambiguity
# - Guess formats
# - Apply heuristics

# APIs:
# - Must be strict
# - Must be explicit
# - Must fail loudly (400 Bad Request)

# Your ESP32 sends POST /api/temp
# Pi API must be strict, explicit, fail loudly
# Different constraints—browsers guess, APIs validate
```

### 43) JSON APIs: The Gold Standard (Line ~581)

**Context:** JSON APIs are simple, predictable, and safe.

```python
# Typical JSON API contract:
# Request:  Content-Type: application/json
# Response: Content-Type: application/json
# UTF-8 only

# ESP32 sends POST /api/temp:
# Content-Type: application/json
# Body: {"temp": 72.5}

# Pi responds:
# Content-Type: application/json
# Body: {"status": "ok"}

# Simple. Predictable. Safe.
```

### 44) Content Negotiation vs Versioning (Line ~594)

**Context:** Accept headers can negotiate both version and format.

```python
# Dashboard sends GET /api/voltage:
# Accept: application/vnd.api.v2+json

# Negotiates:
# - API version: v2
# - Format: JSON

# Or:
# Accept: application/vnd.api.v1+json
# - Version: v1

# Advanced but powerful—one header handles both version and format
```

### 46) Content-Type Is the Body's Identity (Line ~626)

**Context:** The body has no meaning without Content-Type.

```python
# ESP32 sends POST /api/temp
# Body: {"temp": 72.5}

# Without Content-Type: application/json
# Pi doesn't know what these bytes mean
# Can't parse, can't validate, can't process

# Content-Type is the body's identity
# It tells you what the bytes are

# If you remember one thing:
# The body has no meaning without Content-Type
```

### Reflection) Content and Type Reflection (Line ~638)

**Context:** Trace how headers turn bytes into data.

```python
# Take a real HTTP exchange:

# What is the Content-Type?
# → application/json

# Is Content-Length present?
# → Yes, 24 bytes

# Is Accept used?
# → Yes, client prefers JSON

# What breaks if any are wrong or missing?
# → Wrong Content-Type: parsing fails, 400 returned
# → Wrong Content-Length: truncation or hang
# → Missing Accept: server picks default

# Can you trace how bytes become data?
```

---

## Chapter 2.17: Headers — Caching and Control

### 1) Why Caching Exists at All (Line ~19)

**Context:** Caching reduces load, latency, and bandwidth.

```python
# Without caching:
# - Every request hits the server
# - Every response sends full content
# - Latency increases, load increases, bandwidth wasted

# Dashboard requests GET /api/voltage every second
# Without caching: Pi handles every request

# With caching:
# Cache-Control: max-age=60
# Dashboard reuses data for 60 seconds
# Pi does less work, network moves fewer bytes
```

### 2) Caching Is a Boundary Concern (Line ~40)

**Context:** Caching is negotiated at the boundary, never implicit.

```python
# ESP32 sends GET /api/temp from the coop
# Pi responds with Cache-Control: max-age=300

# Boundary decision:
# - What crosses the boundary again?
# - What is reused?
# - What must be revalidated?

# Caching is never implicit
# Pi declares rules via headers, ESP32 decides accordingly
```

### 3) HTTP Caching Is Declarative (Line ~56)

**Context:** Headers declare intent; clients enforce.

```python
# HTTP does not say: "Cache this."
# It says: "Here are the rules. Decide accordingly."

# Pi responds to GET /api/voltage:
# Cache-Control: max-age=60

# Dashboard enforces it:
# - Reuses data for 60 seconds
# - No server contact during that time

# Headers declare intent—clients enforce it
```

### 4) Cache-Control Is the Primary Tool (Line ~73)

**Context:** Cache-Control is the main header for caching policy.

```python
# Cache-Control appears in:
# - Responses (what may be cached)
# - Requests (what the client is willing to accept)

# Examples:
# Cache-Control: max-age=60, public
# Cache-Control: no-cache, must-revalidate

# It contains directives
```

### 5) Cache-Control Directives Are Instructions (Line ~87)

**Context:** Each directive changes caching behavior.

```python
# Directives:
# max-age=3600      → fresh for 3600 seconds
# no-cache          → revalidate before using
# no-store          → do not store anywhere
# must-revalidate   → check server when stale
# public            → may be cached by shared caches
# private           → only end client may cache

# Pi responds to GET /api/voltage:
# Cache-Control: max-age=60, public
# Two directives: freshness + shared cache allowed
```

### 6) max-age: Freshness Lifetime (Line ~103)

**Context:** max-age declares how long the response is fresh.

```python
# Cache-Control: max-age=3600

# Means: "This response is fresh for 3600 seconds"

# While fresh:
# - Client may reuse it
# - No server contact required
# - No validation required

# This is strong caching
```

### 7) Freshness Is Time-Based Validity (Line ~120)

**Context:** Freshness answers whether data is still valid right now.

```python
# Dashboard requests GET /api/voltage
# Gets Cache-Control: max-age=60

# After 30 seconds: data is fresh → use cache
# After 70 seconds: data is stale → revalidate or refetch

# Freshness answers: "Is this data still valid right now?"
# It's about time (60 seconds passed?)
# Not correctness (is voltage reading accurate?)
```

### 8) no-cache Does Not Mean "Do Not Cache" (Line ~135)

**Context:** no-cache means revalidate before using, not "don't cache."

```python
# Common mistake!

# Cache-Control: no-cache

# Does NOT mean "do not cache"
# Means: "You may store this, but you must revalidate before using it"

# Pi responds with no-cache
# Dashboard may store it
# But must ask Pi "is this still valid?" before reusing
```

### 9) no-store Means Exactly That (Line ~148)

**Context:** no-store prevents storage anywhere.

```python
# Cache-Control: no-store

# Means: "Do not store this anywhere"

# Not in:
# - Browser cache
# - Disk cache
# - Proxy cache
# - Memory cache

# Used for:
# - Credentials
# - Personal data
# - Sensitive responses
```

### 10) public vs private (Line ~170)

**Context:** Public allows shared caches; private restricts to end client.

```python
# public: may be cached by shared caches (proxies, CDNs)
# private: only the end client may cache it

# ESP32 requests GET /api/sensors with Authorization header
# Pi responds with Cache-Control: private

# Only ESP32 may cache it, not shared caches (proxies, CDNs)
# Important for authenticated responses—prevent leaks
```

### 11) must-revalidate (Line ~180)

**Context:** must-revalidate forces server check when data becomes stale.

```python
# Cache-Control: must-revalidate

# Means: "When this becomes stale, you must check with the server"

# No heuristic reuse
# No stale usage

# When data becomes stale, dashboard must check with Pi
# Cannot use stale data
```

### 12) Request Cache-Control (Line ~192)

**Context:** Clients can send Cache-Control to override freshness.

```python
# Clients can send Cache-Control too

# Dashboard sends GET /api/voltage:
# Cache-Control: no-cache
# → "I want fresh data"

# Or:
# Cache-Control: max-age=0
# → "Treat as stale immediately"

# Clients can override freshness preferences
```

### 13) Server and Client Negotiate (Line ~207)

**Context:** Caching is negotiation, not command.

```python
# Caching is not unilateral

# Pi responds: Cache-Control: max-age=60  (proposes 60 seconds)
# Dashboard decides: may reuse for 60 seconds
# Or may send Cache-Control: no-cache to override

# Server proposes
# Client decides
# Intermediaries enforce

# This is negotiation, not command
```

### 16) ETag: Entity Tags (Line ~243)

**Context:** ETag is a fingerprint of the response body.

```python
# An ETag is a fingerprint of the response body

# Pi responds to GET /api/voltage:
# ETag: "v123"

# If voltage reading changes, ETag should change to "v124"

# ETag is an opaque identifier
# Changes when content changes
```

### 17) ETags Are Opaque (Line ~256)

**Context:** Clients must not interpret ETags, only compare for equality.

```python
# Pi responds with ETag: "v123"

# Dashboard must not interpret it:
# - Don't assume it's a version number
# - Don't parse it
# - Just compare for equality

# ETags are:
# - Opaque identifiers
# - Only meaningful to the server
# - Compared for equality only
```

### 19) If-None-Match: Validation Request (Line ~284)

**Context:** Client sends If-None-Match to ask if content changed.

```python
# Client sends:
# If-None-Match: "abc123"

# Meaning: "I have this version. Has it changed?"

# Dashboard sends GET /api/voltage:
# If-None-Match: "v123"

# Pi checks: current ETag is "v123"?
# If yes → unchanged
# If no → changed
```

### 20) Server Validation Logic (Line ~297)

**Context:** Server compares current ETag to provided one.

```python
# Dashboard sends GET /api/voltage:
# If-None-Match: "v123"

# Pi checks: current ETag equals "v123"?

# If yes (unchanged):
# → Respond 304 Not Modified

# If no (changed):
# → Respond 200 OK with new content

# Server validation logic:
# Check if current ETag equals provided ETag
```

### 21) 304 Not Modified (Line ~310)

**Context:** 304 tells client to use cached copy.

```python
# If unchanged, server responds:
# HTTP/1.1 304 Not Modified

# Characteristics:
# - No body
# - Minimal headers
# - Client reuses cached copy

# This is a successful response
# Saves bandwidth and time
```

### 23) When the Body Is Sent Again (Line ~342)

**Context:** If content changed, server returns 200 with new body and ETag.

```python
# Dashboard sends GET /api/voltage:
# If-None-Match: "v123"

# Pi checks: voltage changed, ETag is now "v124"

# Pi responds:
# HTTP/1.1 200 OK
# ETag: "v124"
# Body: {"voltage": 12.4}

# Dashboard replaces cache with new content
```

### 24) If-Modified-Since (Line ~354)

**Context:** Older validation mechanism using timestamps.

```python
# Client sends:
# If-Modified-Since: Tue, 30 Jan 2025 12:00:00 GMT

# Dashboard asks Pi: "Has it changed since then?"

# Server compares timestamps

# If-Modified-Since is older validation mechanism
# ETags are more reliable
```

### 25) Limitations of If-Modified-Since (Line ~370)

**Context:** Timestamp-based validation has several problems.

```python
# Problems with If-Modified-Since:

# 1. Time resolution issues (sub-second changes)
# Pi's voltage changes twice in one second—may miss second change

# 2. Clock skew (server/client clocks differ)
# Wrong validation due to different times

# 3. Content changes without timestamp change
# Content changes but timestamp doesn't update

# ETags are more reliable
```

### 28) Conditional Requests Reduce Load (Line ~410)

**Context:** Conditional requests save bandwidth and server work.

```python
# Dashboard requests voltage every second

# Without conditional requests:
# Pi sends full body every time
# Bandwidth wasted, server load high

# With If-None-Match:
# Pi responds 304 most times
# - No body transfer
# - Minimal server work
# - Faster responses

# This is critical at scale
```

### 30) Caching Is Safe Because of Idempotency (Line ~436)

**Context:** GET is safe and idempotent, which allows caching.

```python
# GET is:
# - Safe (no side effects)
# - Idempotent (same result if repeated)

# This allows caching

# ESP32 sends GET /api/voltage
# → Safe and idempotent, can be cached

# ESP32 sends POST /api/temp
# → Not safe, not idempotent, generally not cached
```

### 31) Which Methods Are Cacheable (Line ~450)

**Context:** Only safe/idempotent methods are typically cacheable.

```python
# Typically cacheable:
# GET   → safe, idempotent
# HEAD  → safe, idempotent

# Rarely:
# POST  → explicitly allowed only, not safe, not idempotent

# Never by default:
# PUT   → not safe
# PATCH → not safe
# DELETE → not safe
```

### 33) URLs Are Cache Keys (Line ~480)

**Context:** Cache keys include scheme, host, port, path, and query.

```python
# Cache key includes:
# - Scheme (http vs https)
# - Host (pi.local vs example.com)
# - Path (/api/voltage vs /api/config)
# - Query string (?window=60 vs ?window=300)

# Dashboard requests:
# GET http://pi.local/api/voltage?window=60
# GET http://pi.local/api/voltage?window=300

# Different query strings = different cache entries
```

### 36) Why public vs private Matters (Line ~520)

**Context:** Authenticated responses need private to prevent data leaks.

```python
# ESP32 requests GET /api/sensors with Authorization header
# Pi responds with Cache-Control: private

# Only ESP32 may cache it
# Not shared caches (proxies, CDNs)

# Prevents user-specific data from leaking to other clients

# Authenticated responses:
# - Often include user-specific data
# - Must not be shared
# → Use private to prevent leaks
```

### 38) APIs Should Be Explicit (Line ~545)

**Context:** Always set Cache-Control and ETag explicitly.

```python
# Best practice:
# - Always set Cache-Control
# - Always set ETag (if cacheable)
# - Be explicit about freshness

# Pi API always sets:
# Cache-Control: max-age=60
# ETag: "v123"

# Explicit beats clever
# Don't rely on browser heuristics
```

### 40) Example: Sensor API (Line ~572)

**Context:** Sensor APIs use short max-age plus validation.

```python
# Pi responds to GET /api/voltage:
# Cache-Control: max-age=5
# ETag: "v123"

# Dashboard:
# - Reuses data for 5 seconds
# - Then revalidates with If-None-Match: "v123"

# Low latency (reuse cache)
# Low load (revalidate, not refetch)
```

### 41) Client Override for Freshness (Line ~591)

**Context:** Client sends no-cache to force revalidation.

```python
# Client sends:
# Cache-Control: no-cache

# Meaning: "I want to revalidate even if fresh"

# Dashboard sends GET /api/voltage:
# Cache-Control: no-cache

# Useful for dashboards—always show latest data
```

### 43) Stale-While-Revalidate (Advanced) (Line ~619)

**Context:** Serve stale data while revalidating in background.

```python
# Some caches support:
# Cache-Control: max-age=60, stale-while-revalidate=300

# Dashboard may serve stale data (after 60 seconds)
# while revalidating in background (up to 300 seconds)

# Advanced but powerful
```

### 45) Caching Bugs Are Subtle (Line ~650)

**Context:** Common caching bugs persist invisibly.

```python
# Common caching bugs:

# 1. Forgetting to invalidate
# Pi forgets to change ETag when voltage changes
# Dashboard shows stale data

# 2. Wrong cache key
# ESP32 gets wrong cached data

# 3. Missing private directive
# Authenticated data leaks to shared caches

# 4. Overly long max-age
# Stale data shown too long

# These bugs persist invisibly
```

### 46) Phase 0 Revisited: Invariants (Line ~664)

**Context:** Caching invariants must be maintained.

```python
# Caching invariants:
# - Content must match ETag
# - Cache rules must be honored
# - Validation must be correct

# Pi responds with ETag: "v123"
# But content doesn't match → breaks invariant
# Creates ghosts (stale data, wrong validation)

# Breaking invariants creates ghosts
```

### 48) curl Is Your Friend (Line ~692)

**Context:** Use curl -I to inspect caching headers.

```python
# curl -I http://pi.local/api/voltage

# Output:
# HTTP/1.1 200 OK
# Cache-Control: max-age=60
# ETag: "v123"
# Content-Type: application/json

# Inspect headers only
# Useful for debugging caching
```

### Reflection) Caching Reflection (Line ~730)

**Context:** Trace caching policies and failure modes.

```python
# Pick one API you know. Is it cacheable?

# Dashboard requests GET /api/voltage with Cache-Control: max-age=3600
# Voltage changes every minute

# Stale data shown for 59 minutes
# Dashboard shows wrong voltage, user makes wrong decisions

# Or: Pi forgets to invalidate cache when voltage changes
# Cache lies, stale data persists

# If you can identify caching policies, validation mechanisms,
# and failure modes, you understand caching as a negotiated contract
```

---

## Chapter 2.18: URLs, Paths, and Query Strings

### 1) A URL Is an Address, Not an Action (Line ~22)

**Context:** URLs identify resources; methods carry intent.

```python
# A URL does not say what to do
# It says what is being referred to

# ESP32 sends GET http://pi.local/api/voltage
# - URL identifies the resource (voltage reading)
# - Method carries intent (retrieve)

# ESP32 sends POST http://pi.local/api/temp
# - URL identifies the resource (temp endpoint)
# - Method carries intent (submit)

# This separation is foundational
```

### 2) The Canonical URL Structure (Line ~36)

**Context:** Full URL has scheme, host, port, path, query, and fragment.

```python
# Full URL structure:
# scheme://host:port/path?query#fragment

# Examples:
url_1 = "http://pi.local/api/voltage"
# scheme: http
# host: pi.local
# path: /api/voltage
# port: 80 (default, omitted)

url_2 = "http://192.168.1.10:8080/api/sensors?limit=10"
# scheme: http
# host: 192.168.1.10
# port: 8080
# path: /api/sensors
# query: limit=10
```

### 3) Scheme: How to Talk (Line ~51)

**Context:** The scheme defines communication method and security.

```python
# Common schemes:
# http  → plaintext, port 80
# https → encrypted, port 443

# The scheme implies:
# - Transport protocol
# - Default port
# - Security expectations

# Dashboard uses https://pi.local/api/config (TLS)
# vs http://pi.local/api/config (plaintext)
# Different resource identity for caches and security
```

### 4) http vs https (Line ~70)

**Context:** Different schemes mean different resource identities.

```python
# http: plaintext, no encryption
# https: HTTP over TLS, encrypted

# These are NOT the same resource:
url_http = "http://example.com/data"
url_https = "https://example.com/data"

# From caching and identity perspective: different resources

# ESP32 uses http to Pi; if you later add TLS
# URL changes and caches treat it differently
```

### 5) Host: Who to Talk To (Line ~88)

**Context:** Host identifies which server to contact.

```python
# The host identifies which server

# Examples:
hosts = [
    "example.com",       # domain name
    "api.example.com",   # subdomain
    "192.168.1.10",      # IP address
    "pi.local",          # mDNS name
]

# Host maps to an IP via DNS (or directly, if already numeric)
```

### 6) Host Is Mandatory in HTTP/1.1 (Line ~103)

**Context:** Host header enables virtual hosting.

```python
# In HTTP/1.1, the Host header is required

# Why?
# - Multiple sites can share one IP
# - Server needs to know which one you want

# Pi might serve both:
# - dashboard at pi.local
# - API at api.pi.local
# on the same IP

# Host header tells it which one you want
# This enables virtual hosting
```

### 7) Port: Which Door (Line ~117)

**Context:** Port identifies which service on the host.

```python
# The port identifies which service

# Defaults:
# 80 for HTTP
# 443 for HTTPS

# Explicit ports override defaults:
url = "http://example.com:8080/"

# Different ports = different endpoints
# http://pi.local:8080/api/voltage  ← API on port 8080
# http://pi.local/api/voltage       ← Default port 80
```

### 8) Path: What Resource (Line ~137)

**Context:** Path is the primary identifier of the resource.

```python
# The path is the primary identifier of the resource

# Examples:
paths = [
    "/",                        # root
    "/api",                     # API root
    "/api/voltage",             # specific resource
    "/api/sensors/esp32_coop",  # nested resource
]

# The path is hierarchical—but only by convention
```

### 9) The Server Defines Path Meaning (Line ~154)

**Context:** Server decides what paths map to; path doesn't mean "folder."

```python
# The server decides:
# - What paths exist
# - What they map to
# - What they mean

# /api/voltage → function that reads a sensor (not a file)
# /api/sensors/esp32_coop → row in database or virtual resource

# The path does not inherently mean "folder" or "file"
```

### 11) Trailing Slashes Matter (Line ~181)

**Context:** Trailing slashes make different URLs.

```python
# These are different URLs:
url_1 = "/api/readings"
url_2 = "/api/readings/"

# Some servers treat them the same
# Some do not

# If ESP32 sometimes sends one, sometimes the other
# Caching and routing can break

# Consistency matters—pick one form and stick to it
```

### 12) Paths Are Case-Sensitive (Usually) (Line ~196)

**Context:** Clients must assume paths are case-sensitive.

```python
# By specification, paths are case-sensitive

# These may be different resources:
path_1 = "/api/Voltage"
path_2 = "/api/voltage"

# Whether server treats them the same is implementation-specific
# Clients must assume they are different
```

### 13) Path Segments Encode Hierarchy (Line ~207)

**Context:** Path segments represent hierarchical structure by convention.

```python
# Paths are typically segmented by /

# Example:
path = "/users/42/settings"

# Common interpretation:
# users    → collection
# 42       → specific user
# settings → sub-resource

# Pi might use:
# /api/sensors/esp32_coop/readings
# sensors → collection
# esp32_coop → specific sensor
# readings → sub-resource
```

### 14) Collections vs Items (Line ~224)

**Context:** REST pattern uses plural for collection, ID for item.

```python
# Common REST pattern:

# Collection:
# /users         → all users
# /api/sensors   → all sensors

# Specific item:
# /users/42            → user with ID 42
# /api/sensors/esp32_coop → specific sensor

# Pattern maps well to mental models
```

### 15) Paths Should Identify Nouns (Line ~238)

**Context:** Good paths identify things, not actions.

```python
# Good paths identify things, not actions

# Good:
# GET /api/readings
# POST /api/readings

# Bad:
# POST /api/createReading

# Actions belong in methods, not paths
```

### 16) The Query String Begins with ? (Line ~256)

**Context:** Everything after ? is the query string.

```python
# The query string comes after the path

# Example:
url = "/api/readings?limit=10"
# path: /api/readings
# query: limit=10

# Everything after ? is query
```

### 17) Query Strings Are Key–Value Pairs (Line ~270)

**Context:** Multiple parameters separated by &.

```python
# Format:
# key=value&key2=value2

# Dashboard uses:
url = "/api/readings?limit=10&from=1700&to=1800"
# limit=10
# from=1700
# to=1800

# Multiple parameters separated by &
```

### 18) Query Strings Modify, Not Identify (Line ~284)

**Context:** Path identifies what; query refines how.

```python
# Query usually answers:
# - How many?
# - Which subset?
# - What filters?
# - What options?

# Dashboard requests:
# GET /api/readings?limit=10
# Path identifies readings
# Query refines how many

# The path identifies what
# The query refines how
```

### 19) Same Path, Different Query = Different Resource (Line ~299)

**Context:** Different query strings create different cache entries.

```python
# These are distinct URLs:
url_1 = "/api/readings?limit=10"
url_2 = "/api/readings?limit=100"

# From caching and identity perspective: different resources

# Dashboard requests:
# GET /api/voltage?window=60
# GET /api/voltage?window=300
# → Distinct cache entries
```

### 22) Query Parameters Are Strings (Line ~339)

**Context:** Server must parse, convert, and validate query values.

```python
# All query values are strings initially

# Dashboard sends: GET /api/readings?limit=10

# Server must:
# 1. Parse: extract "10" from query
# 2. Convert: int("10") → 10
# 3. Validate: is 10 in valid range?

# Phase 0.8: boundaries validate
```

### 23) URL Encoding Is Mandatory (Line ~352)

**Context:** Reserved characters must be percent-encoded.

```python
# Certain characters cannot appear raw in URLs

# Encoding:
# Space → %20
# &     → %26
# =     → %3D
# ?     → %3F

# Dashboard requests:
url = "/api/sensors?name=Coop%20Main"
# Space encoded as %20

# Encoding preserves structure
```

### 24) Encoding Prevents Ambiguity (Line ~368)

**Context:** Without encoding, parsing breaks.

```python
# Without encoding:
url_bad = "?name=Tom & Jerry"
# This breaks parsing—& is a separator

# With encoding:
url_good = "?name=Tom%20%26%20Jerry"
# Structure remains intact

# Space → %20
# &     → %26
```

### 26) Fragments Are Client-Side Only (Line ~399)

**Context:** Fragment (#) is not sent to the server.

```python
# The fragment (#section) is not sent to the server

# Dashboard opens:
url = "http://pi.local/dashboard#voltage"

# Pi receives only:
# GET /dashboard
# The #voltage part is not sent

# Fragments are for browsers, not servers
```

### 28) URLs as Cache Keys (Line ~427)

**Context:** Caches key on scheme, host, port, path, query—fragments ignored.

```python
# Caches typically key on:
# - Scheme
# - Host
# - Port
# - Path
# - Query

# Fragments are ignored

# Dashboard requests:
# GET /api/voltage?window=60
# GET /api/voltage?window=60#chart
# → Same cache entry (fragment ignored)
```

### 29) Small URL Differences Matter (Line ~443)

**Context:** Each URL variation is a different cache entry.

```python
# These are distinct:
urls = [
    "/api/data",
    "/api/data/",
    "/api/data?x=1",
    "/api/data?x=1&y=2",
]

# Each is a different cache entry
```

### 32) Versioning and URLs (Line ~484)

**Context:** Version in path is explicit and cache-friendly.

```python
# Common patterns:
url_v1 = "/v1/api/readings"
url_v2 = "/api/v1/readings"

# Versioning in the path is:
# - Explicit
# - Cache-friendly (different paths = different cache entries)

# Old clients stay on /v1
# New clients use /v2
```

### 35) Query Strings for Filtering (Line ~524)

**Context:** Query strings keep resource identity clear with parameters.

```python
# Dashboard requests:
# GET /api/readings?from=1700&to=1800

# Path identifies readings
# Query adds time range filter

# Keeps resource identity clear while adding parameters
```

### 36) Query Strings for Pagination (Line ~536)

**Context:** Pagination belongs in query, not path.

```python
# Common patterns:
url_1 = "/api/readings?page=2&limit=50"
url_2 = "/api/readings?offset=100&limit=50"

# Pagination belongs in query, not path
```

### 38) Avoid Encoding Actions in Queries (Line ~560)

**Context:** Use HTTP methods for actions, not query parameters.

```python
# Bad:
# GET /api/readings?action=delete

# Good:
# DELETE /api/readings/123

# Use the method instead of encoding actions in queries
```

### 39) URL Length Limits Exist (Line ~572)

**Context:** Long queries can break proxies, logs, and caches.

```python
# Browsers and servers impose limits

# Long queries can:
# - Break proxies
# - Break logs
# - Break caches

# Dashboard sending 50 filter parameters?
# Prefer POST with body instead of huge query string

# Use bodies when data is large
```

### 41) URLs Should Be Readable (Line ~599)

**Context:** Human-readable URLs aid debugging and adoption.

```python
# A human should roughly understand:
url = "/api/readings?limit=10"

# Readable URLs aid debugging and adoption

# Good:
# /api/sensors/esp32_coop

# Bad:
# /api/s?i=1
```

### 45) Common URL Mistakes (Line ~650)

**Context:** Avoid common URL design errors.

```python
# Common URL mistakes:

# 1. Encoding actions in paths
# Bad:  /api/createReading
# Good: POST /api/readings

# 2. Overloading queries with logic
# Bad:  ?action=delete
# Good: DELETE method

# 3. Inconsistent pluralization
# Bad:  /api/sensor and /api/sensors mixed
# Good: /api/sensors consistently

# 4. Changing URLs casually
# → breaks clients and caches

# 5. Ignoring encoding
# Bad:  ?name=Coop Main (raw space)
# Good: ?name=Coop%20Main
```

### 46) Debugging URLs (Line ~662)

**Context:** Print full URL and check each component.

```python
# When something fails:
# - Print the full URL
# - Compare path and query
# - Check encoding
# - Check trailing slashes

# ESP32 gets 404?
# Print: http://pi.local/api/Voltage
# Check: should it be /api/voltage (lowercase)?

# Most bugs are obvious in raw form
```

### 47) curl as a URL Microscope (Line ~676)

**Context:** Use curl to expose exact URL intent.

```python
# curl "http://pi.local/api/readings?limit=10"

# Explicit URL exposes intent
# Build and log the full URL for debugging
```

### Reflection) URL Reflection (Line ~730)

**Context:** Trace URL components and failure modes.

```python
# Pick one endpoint you use often

# GET /api/voltage?window=60

# What is the path?
# → /api/voltage

# What goes in the query?
# → window=60

# Is it stable?
# → Once published, should change rarely

# Would caching behave as expected?
# → Different query = different cache entry
```

---

## Chapter 2.19: Request Bodies and Content Types

### 1) The Request Body Is Optional — but Dangerous (Line ~20)

**Context:** Some requests require bodies; others should not have them.

```python
# Some requests:
# - Never need a body (GET)
# - Should not have one
# - Will be ignored if present

# Other requests:
# - Are meaningless without one (POST, PUT, PATCH)
# - Fail if the body is malformed
# - Fail if Content-Type is wrong

# ESP32 sends GET /api/voltage → no body needed
# ESP32 sends POST /api/temp → meaningless without body
```

### 2) Which Methods Commonly Use Bodies (Line ~40)

**Context:** Convention dictates which methods use bodies.

```python
# By convention and practice:
# GET    → no body
# DELETE → usually no body
# POST   → body required or expected
# PUT    → body required
# PATCH  → body required

# The spec does not forbid bodies on GET
# But most servers ignore them

# Conventions exist for a reason
```

### 3) GET and Bodies: Why This Is a Trap (Line ~57)

**Context:** GET bodies are dropped, ignored, or discarded.

```python
# Technically: HTTP does not forbid a GET body

# Practically:
# - Proxies drop it
# - Caches ignore it
# - Servers discard it
# - Frameworks don't expose it

# Using a GET body breaks expectations

# If data is complex, use POST instead
```

### 4) Bodies Carry Meaning, Not Metadata (Line ~76)

**Context:** Headers describe; bodies contain actual data.

```python
# Headers describe (metadata)
# Bodies contain (meaning)

# ESP32 sends POST /api/temp:
# Content-Type: application/json  ← metadata
# Authorization: Bearer xyz       ← metadata
# Body: {"temp": 72.5}            ← meaning

# Do not confuse the two
```

### 5) The Body Is Just Bytes (Line ~94)

**Context:** Body has no meaning until parsed according to Content-Type.

```python
# At the lowest level:
# - The body is a sequence of bytes
# - No structure is implied
# - No meaning exists yet

# Pi receives raw bytes for POST /api/temp
# Until it parses with Content-Type application/json
# There is no meaning—just bytes

# Meaning only emerges after parsing
```

### 6) Content-Type Gives Meaning to Bytes (Line ~107)

**Context:** Without Content-Type, parsing becomes guessing.

```python
# Without Content-Type:
# - Server doesn't know how to interpret the body
# - Parsing becomes guessing
# - Guessing becomes bugs

# Content-Type answers:
# "What do these bytes represent?"

# ESP32 sends: Content-Type: application/json
# Tells Pi how to interpret the body
```

### 7) Content-Type Is a Contract (Line ~122)

**Context:** Content-Type is an assertion that must be true.

```python
# When client sends:
# Content-Type: application/json

# It is asserting:
# - The body is valid JSON
# - The encoding matches expectations
# - The server can parse accordingly

# If this is false, the client is lying

# ESP32 sends Content-Type: application/json
# But body is: temp=72.5  (form-encoded)
# → Client is lying; Pi responds 400 Bad Request
```

### 9) application/json — The Modern Default (Line ~153)

**Context:** JSON is the most common API payload type.

```python
# application/json is the most common API payload type

# Characteristics:
# - Text-based
# - Human-readable
# - Structured
# - Language-agnostic

# Example header:
# Content-Type: application/json
```

### 10) What a JSON Body Looks Like (Line ~173)

**Context:** JSON has strict syntax rules.

```python
# Raw JSON body:
body = '{"voltage":12.1,"timestamp":"2025-01-30"}'

# Important:
# - Strings must be quoted: "voltage"
# - Numbers are not quoted: 12.1
# - Booleans are lowercase: true, false
# - No trailing commas
```

### 11) JSON Is Strict (Line ~189)

**Context:** JSON parsing errors are client errors.

```python
# This fails (unquoted key):
bad_json_1 = '{voltage: 12.1}'

# This fails (trailing comma):
bad_json_2 = '{"voltage": 12.1,}'

# Parsing errors are client errors
# Pi responds: 400 Bad Request
```

### 12) JSON Parsing Is All-or-Nothing (Line ~205)

**Context:** Malformed JSON makes entire request unusable.

```python
# If JSON parsing fails:
# - The entire request body is unusable
# - Partial parsing is not acceptable
# - The server must reject the request

# ESP32 sends malformed JSON
# Pi responds: 400 Bad Request

# Typical response for any parsing failure
```

### 13) JSON Maps Cleanly to Native Types (Line ~221)

**Context:** JSON values map to Python types but still need validation.

```python
# After parsing:
# Objects → dictionaries
# Arrays  → lists
# Numbers → integers/floats
# Strings → strings
# true/false → booleans
# null → None

# Pi parses: {"voltage": 12.1}
# Gets dict with float value

# But type validation is still required
# Is voltage a number? In range?
```

### 14) JSON Does Not Enforce Schema (Line ~237)

**Context:** Valid JSON can still have wrong types or values.

```python
# JSON only enforces structure—not meaning

# This is valid JSON:
body = '{"voltage": "banana"}'

# But wrong type!

# Validation must check:
# - Presence (voltage there?)
# - Type (number?)
# - Range (0–20?)
# - Semantics (sensible?)
```

### 15) application/x-www-form-urlencoded (Line ~255)

**Context:** Classic HTML form encoding as key=value pairs.

```python
# Classic HTML form encoding

# Header:
# Content-Type: application/x-www-form-urlencoded

# Body:
body = "voltage=12.1&timestamp=2025-01-30"

# key=value pairs, URL-encoded
```

### 16) URL Encoding Rules Apply (Line ~270)

**Context:** Form bodies use same encoding as query strings.

```python
# Form bodies use URL encoding:
# Space → + or %20
# &     → %26
# =     → %3D

# Same encoding rules as query strings

# Dashboard submits:
# Content-Type: application/x-www-form-urlencoded
# Body: threshold=75&unit=F
```

### 17) Form Encoding Is Flat (Line ~283)

**Context:** Form encoding has no nesting or typed values.

```python
# Characteristics:
# - Key–value only
# - No nesting
# - No arrays (without conventions)
# - All values are strings

# Good for simple forms
# Bad for structured data

# Dashboard submits: threshold=75&unit=F
# All strings: "75", "F"
```

### 18) JSON vs Form Encoding (Line ~297)

**Context:** Choose format based on data complexity.

```python
# JSON:
# - Structured
# - Typed
# - Nested
# - Explicit

# Form encoding:
# - Simple
# - Flat
# - String-only
# - Legacy-friendly

# ESP32 sends simple key-value config → form encoding fine
# ESP32 sends nested sensor payload → use JSON
```

### 19) multipart/form-data (Line ~317)

**Context:** Multipart encoding handles file uploads.

```python
# Used primarily for file uploads

# Header example:
# Content-Type: multipart/form-data; boundary=----XYZ

# The body is split into parts by the boundary

# Dashboard uploads config file:
# Multiple parts—file bytes and metadata
```

### 20) Multipart Bodies Are Complex (Line ~331)

**Context:** Each part has its own headers and content.

```python
# Each part:
# - Has its own headers
# - Has its own Content-Type
# - Has raw binary or text content

# This allows:
# - Files
# - Metadata
# - Mixed content

# Dashboard uploads config file:
# Part 1: Content-Type: application/octet-stream (file)
# Part 2: form field (name)
```

### 22) Multipart Boundaries Matter (Line ~360)

**Context:** Boundary string separates parts and must be unique.

```python
# The boundary string:
# - Separates parts
# - Must not appear in content
# - Is chosen by the client

# Pi receives multipart with boundary ----XYZ
# If body contains ----XYZ in content, parsing breaks

# Parsing fails if boundaries are wrong
```

### 24) Content-Length vs Transfer-Encoding (Line ~386)

**Context:** Bodies need either Content-Length or chunked encoding.

```python
# Bodies must have a length

# Either:
# Content-Length: 15      → specifies exact size
# Transfer-Encoding: chunked → streams data

# Pi receives POST /api/temp:
# With Content-Length: 15 (fixed size)
# Or Transfer-Encoding: chunked (streamed)

# Servers must handle both
```

### 26) Content-Encoding Is Separate (Line ~414)

**Context:** Content-Encoding is about compression; decode before parse.

```python
# Content-Encoding: gzip

# Means:
# - Body is compressed
# - Must be decompressed before parsing
# - Happens before Content-Type parsing

# ESP32 sends:
# Content-Encoding: gzip
# Content-Type: application/json

# Pi must:
# 1. Decompress gzip
# 2. Parse JSON

# Order matters
```

### 28) Missing Content-Type Is an Error (Line ~447)

**Context:** Missing Content-Type with body should return 400.

```python
# If body exists and Content-Type is missing:
# - The server must guess
# - Guessing is unsafe
# - Many servers reject the request

# ESP32 sends POST /api/temp with body but no Content-Type

# Pi responds: 400 Bad Request

# Best practice: require Content-Type
```

### 29) Mismatched Content-Type Is Worse (Line ~463)

**Context:** Content-Type lie breaks the contract.

```python
# Example:
# Content-Type: application/json
# Body: voltage=12.1  (not JSON!)

# This is a lie

# The server must:
# - Trust the header
# - Attempt JSON parsing
# - Fail loudly

# Pi responds: 400 Bad Request
```

### 32) Validation Happens After Parsing (Line ~505)

**Context:** Decode, parse, then validate structure and semantics.

```python
# Steps:
# 1. Decode bytes
# 2. Decompress if needed
# 3. Parse according to Content-Type
# 4. Validate structure
# 5. Validate semantics
# 6. Apply logic

# Pi receives POST /api/temp:
# Decode → Decompress → Parse → Validate → Logic

# Skipping steps is dangerous
```

### 33) Size Limits Are Required (Line ~521)

**Context:** Impose limits to prevent DoS.

```python
# Bodies can be:
# - Huge
# - Malicious
# - Accidental DoS vectors

# Servers must impose limits:
# - Max body size (e.g., 1 MB)
# - Max field sizes
# - Max nesting depth

# Pi imposes 1 MB max for POST /api/temp
# Prevents memory exhaustion
```

### 35) Bodies Change Semantics (Line ~547)

**Context:** Body is the meaning of the request.

```python
# Compare:

# POST /api/readings (no body)
# vs
# POST /api/readings
# Body: {"voltage": 12.1}

# The body is the meaning

# ESP32 sends POST with vs without body
# Completely different semantics
```

### 36) PUT Requires a Body (Line ~564)

**Context:** PUT means replace, which requires data to replace with.

```python
# PUT means:
# "Replace the resource with this representation"

# Without a body, PUT is meaningless

# ESP32 sends PUT /api/config:
# Body: {"threshold": 75}

# Replace the config with this representation
```

### 37) PATCH Requires a Body (Line ~576)

**Context:** PATCH means apply changes, which requires the changes.

```python
# PATCH means:
# "Apply these changes"

# Without a body, there are no changes

# ESP32 sends PATCH /api/config:
# Body: {"threshold": 75}

# Apply these changes
```

### 38) DELETE and Bodies (Line ~588)

**Context:** DELETE usually has no body; prefer path + query.

```python
# DELETE usually has no body

# Some APIs accept bodies—controversial and inconsistent

# Prefer path + query:
# DELETE /api/sensors/esp32_coop         (path)
# DELETE /api/readings?before=1700       (query)

# Not a body
```

### 40) Idempotency and Bodies (Line ~614)

**Context:** Same body with PUT is safe; same body with POST risks duplicates.

```python
# Bodies affect idempotency

# Same body + same PUT → safe (idempotent)
# ESP32 sends PUT /api/config twice with same body
# → Same result

# Same body + same POST → duplicate risk
# ESP32 sends POST /api/temp twice with same body
# → Two readings created

# Design accordingly
```

### 43) Bodies and Errors (Line ~650)

**Context:** Body errors map to specific status codes.

```python
# Malformed body     → 400 Bad Request
# Unsupported Content-Type → 415 Unsupported Media Type
# Too large          → 413 Payload Too Large

# ESP32 sends malformed JSON → 400
# ESP32 sends Content-Type: application/xml (unsupported) → 415
# ESP32 sends 10 MB body (over limit) → 413

# These are client errors
```

### 44) 415 Unsupported Media Type (Line ~662)

**Context:** 415 means the server doesn't understand the Content-Type.

```python
# 415 Unsupported Media Type

# Means: "I do not understand this Content-Type"

# ESP32 sends Content-Type: application/xml
# Pi only supports JSON

# Pi responds: 415 Unsupported Media Type

# Correct and underused
```

### 46) APIs Should Document Content Types (Line ~684)

**Context:** Clients need to know what to send and receive.

```python
# Clients need to know:
# - What to send
# - What they will receive
# - What errors occur

# Pi API docs:
# POST /api/temp
# Accepts: application/json
# Keys: temp (number), sensor_id (string)
# Returns: {"status": "ok"}
# Errors: 400 (malformed), 415 (wrong type)

# Documentation is part of the contract
```

### Reflection) Request Bodies Reflection (Line ~713)

**Context:** Trace how bodies cross boundaries and fail.

```python
# Take one POST request you use

# What is the Content-Type?
# → application/json

# What does the raw body look like?
# → {"temp": 72.5, "sensor_id": "esp32_coop"}

# What happens if it's malformed?
# → 400 Bad Request

# What happens if the header lies?
# → Content-Type says JSON, body is form-encoded
# → 400 Bad Request (JSON parse fails)
```

---

## Chapter 2.20: Cookies and Session State

### 1) Stateless Protocol, Stateful Experience (Line ~25)

**Context:** HTTP forgets; state must be carried explicitly.

```python
# HTTP does not remember

# After a response is sent:
# - The request is gone
# - The connection may close
# - The server forgets everything by default

# Dashboard logs into Pi
# After response, Pi does not remember
# Next request is indistinguishable from a stranger's

# State must be carried explicitly
```

### 2) Cookies Are a Memory Hack (Line ~42)

**Context:** Cookies ask the client to remember for the server.

```python
# Cookies are not server memory

# Cookies are:
# - Instructions from server to client
# - Asking the client to remember something
# - And send it back later

# The server does not store cookies automatically
# The client does

# Pi sends: Set-Cookie: session_id=abc123
# Pi does not store it
# Dashboard (browser) stores it and sends it back
```

### 3) Set-Cookie: The Server's Request to Remember (Line ~59)

**Context:** Set-Cookie is a request, not a command.

```python
# A server cannot force memory

# Instead, it says:
# Set-Cookie: name=value; options

# This is a request, not a command

# The client may:
# - Accept it
# - Store it
# - Send it back later
# - Or ignore it (privacy tools, settings, etc.)
```

### 4) Anatomy of Set-Cookie (Line ~78)

**Context:** Cookie has name, value, and options that control behavior.

```python
# Typical Set-Cookie header:
# Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure

# Parts:
# session_id → cookie name
# abc123     → cookie value
# Options    → scope and behavior

# Each option matters:
# Path     → when cookie is sent
# HttpOnly → blocks JavaScript
# Secure   → HTTPS only
```

### 5) Cookie Name and Value (Line ~95)

**Context:** Browser doesn't interpret value; meaning exists only on server.

```python
# The name identifies the cookie
# The value is opaque to the browser

# Important:
# - Browser does not interpret the value
# - It does not know what it means
# - It just stores and sends it

# Pi sets cookie value: abc123
# Browser just stores and sends it
# Pi looks up abc123 in session storage to know who the user is

# Meaning exists only on the server
```

### 6) Path Option (Line ~111)

**Context:** Path controls which requests receive the cookie.

```python
# Path=/

# Controls when the cookie is sent

# Rules:
# Path=/      → send for all paths
# Path=/api   → only for /api and below

# Pi sets: Set-Cookie: session_id=abc123; Path=/api
# Cookie sent only for requests to /api and below
# Not for /static

# Path limits exposure
```

### 7) Domain Option (Line ~129)

**Context:** Domain controls which hosts receive the cookie.

```python
# Domain=example.com

# Controls which hosts receive the cookie

# Rules:
# Without Domain → exact host only
# With Domain    → subdomains may receive it

# Pi at dashboard.pi.local sets cookie without Domain
# → Only dashboard.pi.local gets it

# With Domain=pi.local
# → Subdomains like api.pi.local could receive it (intended or not)

# Domain scoping is critical for security
```

### 8) Expires and Max-Age (Line ~148)

**Context:** Cookies can persist or vanish when browser closes.

```python
# Cookies can persist or vanish

# Options:
# Expires=Wed, 01 Feb 2026 00:00:00 GMT
# Max-Age=3600  (seconds)

# If neither is set:
# → Cookie is a session cookie
# → Deleted when browser closes

# Pi sets: Set-Cookie: theme=dark; Max-Age=2592000
# Cookie survives browser restart for 30 days
```

### 9) Secure Option (Line ~168)

**Context:** Secure ensures cookie is only sent over HTTPS.

```python
# Secure

# Means:
# - Cookie is sent only over HTTPS
# - Never over plain HTTP

# Without Secure:
# - Cookie can leak on insecure connections
# - Session hijacking becomes trivial

# Always use Secure for sensitive cookies

# Pi sets session cookie:
# Set-Cookie: session_id=abc123; Secure
```

### 10) HttpOnly Option (Line ~186)

**Context:** HttpOnly prevents JavaScript from reading the cookie.

```python
# HttpOnly

# Means:
# - JavaScript cannot read the cookie
# - document.cookie cannot access it

# Protects against:
# - XSS stealing session cookies

# Pi sets:
# Set-Cookie: session_id=abc123; HttpOnly

# JavaScript cannot read it via document.cookie
# So XSS cannot steal the session

# HttpOnly prevents reading, not sending
```

### 11) SameSite Option (Line ~203)

**Context:** SameSite controls cross-site cookie behavior.

```python
# SameSite=Strict | Lax | None

# Strict → cookie sent only when user navigates directly
#          No cookie on requests triggered by another site

# Lax → cookie sent on top-level navigations
#       (user clicks link from email or another site)

# None → cookie sent on cross-site requests too
#        Requires Secure. Use with other CSRF defenses.

# SameSite exists to mitigate CSRF

# Pi sets: Set-Cookie: session_id=abc123; SameSite=Strict
# If someone embeds dashboard in iframe on evil.com
# Browser will not send the cookie
```

### 13) Cookie Header: The Return Trip (Line ~241)

**Context:** Browser automatically sends matching cookies.

```python
# On subsequent requests, client sends:
# Cookie: name=value; name2=value2

# All cookies matching:
# - Domain
# - Path
# - Security rules

# Are sent automatically

# Dashboard requests GET http://pi.local/api/config
# Browser automatically attaches:
# Cookie: session_id=abc123

# No user or script action needed
```

### 15) Ambient Authority (Line ~270)

**Context:** Cookies are sent automatically; possession equals access.

```python
# Cookies are ambient authority

# Meaning:
# - Possession = access
# - No explicit intent required
# - No user action needed

# If a request is sent, cookies go with it

# Dashboard loads an image from Pi
# Request includes the session cookie

# A link on another site triggers GET to Pi
# Cookies go with it (unless SameSite blocks)
```

### 16) Why Ambient Authority Is Risky (Line ~285)

**Context:** Attackers can trigger requests that carry cookies.

```python
# Because:
# - Attackers can trigger requests
# - Browsers attach cookies automatically
# - Servers trust the cookies

# This creates CSRF

# A malicious site has a form that POSTs to /api/config
# Browser sends your session cookie
# Pi trusts it and changes config
# User never intended it
```

### 17) CSRF Exists Because of Cookies (Line ~298)

**Context:** CSRF exploits automatic cookie sending.

```python
# Cross-Site Request Forgery happens when:
# 1. Malicious site triggers a request
# 2. Browser sends cookies automatically
# 3. Server trusts the cookie and performs action
# 4. User never intended that action

# The cookie does not distinguish:
# "user clicked our login form" from
# "user was on evil.com and form submitted to us"

# Server must not rely on cookie alone for state-changing requests
# Needs CSRF defenses (tokens, SameSite, or other checks)
```

### 18) Cookies Are Not Authentication Logic (Line ~312)

**Context:** Cookies carry identifiers; authentication happens server-side.

```python
# Cookies do not authenticate

# They only:
# - Carry identifiers
# - Carry tokens
# - Carry references

# Authentication happens on the server

# Pi receives Cookie: session_id=abc123
# Cookie does not authenticate
# Pi looks up abc123 in session store
# Then decides who the user is
```

### 19) Session State Pattern (Line ~328)

**Context:** Sessions create stateful applications on stateless HTTP.

```python
# The most common pattern:

# 1. Client authenticates (login)
# 2. Server creates session record
# 3. Server generates session ID
# 4. Server sends session ID in cookie
# 5. Client stores cookie
# 6. Client sends cookie on every request
# 7. Server looks up session by ID

# Stateless protocol. Stateful application.
```

### 20) Session ID Is a Pointer (Line ~345)

**Context:** Session ID is a key into server storage, not the data.

```python
# The session ID:
# - Has no meaning by itself
# - Is a key into server storage
# - Points to session data

# Pi stores session data (user_id, login_time) in Redis
# Cookie only holds the session ID

# The cookie is the key, not the data
```

### 21) Where Session Data Lives (Line ~358)

**Context:** Common locations for session storage.

```python
# Common locations:
# - In-memory store
# - Database
# - Redis / cache
# - File system

# The cookie never contains the data itself

# Pi keeps session data (roles, preferences) in database
# Cookie holds only the session ID
```

### 22) Why Session Data Is Server-Side (Line ~370)

**Context:** Clients are untrusted; sensitive data must not be in cookies.

```python
# Because:
# - Clients are untrusted
# - Cookies can be modified
# - Sensitive data must not be exposed

# Only the identifier crosses the boundary

# Pi does not put user_id or is_admin in the cookie
# Only the session ID
```

### 23) Cookies Are Untrusted Input (Line ~384)

**Context:** Cookies can be forged, replayed, or tampered with.

```python
# Phase 0.8 again:

# Cookies:
# - Come from the client
# - Can be forged
# - Can be replayed
# - Can be tampered with

# Never trust cookie contents

# Pi receives Cookie: session_id=abc123
# Must look it up and validate
# Do not trust the value
```

### 24) Never Store Authority in Cookies (Line ~400)

**Context:** Authority must be server-verified, not client-stored.

```python
# Bad idea:
# Cookie: is_admin=true

# Because:
# - Client can change it
# - Server would trust it
# - Privilege escalation occurs

# Pi must never do:
# if cookie says is_admin then allow

# Client can set is_admin=true

# Authority must be looked up server-side from session data
```

### 26) Session Fixation Attacks (Line ~430)

**Context:** Rotate session IDs on authentication to prevent fixation.

```python
# Session fixation:
# 1. Attacker gets a session ID (visits login page)
# 2. Attacker lures victim to use that session ID
# 3. Victim logs in; server associates session with that ID
# 4. Attacker now has a valid logged-in session

# Defense:
# Never trust a pre-login session ID for post-login identity
# Create a new session and send new session ID when user authenticates

# Rotate session IDs on authentication
```

### 27) Session Expiration Matters (Line ~443)

**Context:** Sessions must expire to limit stolen cookie validity.

```python
# Sessions must expire:
# - Inactivity timeout
# - Absolute lifetime
# - Logout invalidation

# Otherwise:
# - Stolen cookies remain valid
# - Old sessions linger forever

# Pi must expire sessions
# Otherwise a stolen session cookie stays valid
```

### 28) Logout Is Server-Side (Line ~458)

**Context:** Logout must invalidate session on server, not just delete cookie.

```python
# Logout means:
# - Invalidate session server-side
# - Not just delete cookie client-side

# Deleting cookie alone is insufficient

# Dashboard user clicks Logout
# Pi must invalidate the session server-side (delete from store)
# Not just tell the client to delete the cookie

# Otherwise session ID is still valid if replayed
```

### 29) Cookies vs Tokens (Line ~469)

**Context:** Cookies are automatic; tokens are explicit.

```python
# Cookies:
# - Automatically sent
# - Ambient authority
# - Browser-managed

# Tokens (e.g., Authorization headers):
# - Explicit
# - Client-managed
# - Often safer for APIs

# Dashboard (browser) uses cookies
# ESP32 API uses Authorization: Bearer token

# Each has tradeoffs
```

### 30) Cookies and APIs (Line ~488)

**Context:** APIs often prefer explicit tokens over cookies.

```python
# APIs often avoid cookies because:
# - CSRF risk
# - Cross-origin complexity
# - Implicit behavior

# Many APIs prefer:
# Authorization: Bearer token

# ESP32 calls Pi API with Authorization header, not cookies
# Avoids CSRF and cross-origin cookie complexity

# Explicit is safer
```

### 32) Cookies and HTTPS Are Non-Negotiable (Line ~516)

**Context:** Without HTTPS, cookies can be sniffed.

```python
# Without HTTPS:
# - Cookies can be sniffed
# - Session hijacking is trivial

# HTTPS is mandatory for cookies carrying identity

# Dashboard logs into Pi over HTTP
# Session cookie can be sniffed on the network

# Over HTTPS, cookie is protected in transit
```

### 35) Cookie Size Limits (Line ~558)

**Context:** Browsers enforce cookie size limits.

```python
# Browsers enforce limits:
# - ~4KB per cookie
# - Limited cookies per domain

# Do not store large data

# Pi must not put full user profile in a cookie
# Browsers enforce ~4KB per cookie and limit count per domain
```

### 37) Cookies Affect Every Request (Line ~582)

**Context:** All matching cookies sent on every request.

```python
# Images, scripts, API calls—all include cookies

# This has:
# - Performance cost
# - Security implications

# Minimize cookie scope

# Pi sets Path=/api and short Max-Age
# Session cookie not sent for every static asset
```

### 38) Cookies and Caching (Line ~596)

**Context:** Responses with cookies need careful caching.

```python
# Responses with cookies:
# - Are often uncacheable
# - Or require careful Cache-Control

# Private data must not be cached publicly

# Pi returns dashboard HTML with Set-Cookie
# Response should have Cache-Control: private
# So it is not cached by a shared proxy
```

### 40) Cookies Are a Protocol-Level Escape Hatch (Line ~623)

**Context:** Cookies add stateful capability to stateless HTTP.

```python
# Cookies exist because:
# - HTTP alone was insufficient
# - Applications demanded continuity

# They are powerful—and sharp

# Pi uses cookies to maintain login state—powerful

# Misused (wrong Domain, no Secure, authority in cookie)—sharp
```

### 41) Everything About Cookies Is a Boundary Issue (Line ~634)

**Context:** Every cookie decision is a security decision.

```python
# Cookies cross:
# - Trust boundaries
# - Origin boundaries
# - Time boundaries

# Every cookie decision is a security decision

# Pi's choice of:
# - Path
# - Domain
# - Secure
# - HttpOnly
# - SameSite
# - Expiration

# Affects trust, origin, and time boundaries
```

### Reflection) Cookies Reflection (Line ~648)

**Context:** Trace the full flow from login to next request.

```python
# When you log in to dashboard:

# What exactly is stored in the cookie?
# → Only an ID (session_id=abc123)

# Where does the real data live?
# → Pi's memory, database, or Redis

# What happens if the cookie is stolen before it expires?
# → Attacker can impersonate you until session expires

# What prevents reuse?
# → Server-side invalidation, expiration, rotation

# What must the server do on logout?
# → Invalidate the session server-side
# → Deleting the cookie alone is not enough
```
