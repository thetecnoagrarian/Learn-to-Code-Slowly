# Phase 2 Code Examples (Chapters 11-15)

This file contains visual references for all code examples mentioned in Phase 2 chapters 11-15. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 2.11: Status Codes — Client and Server Errors

### 1) Errors Are Still Responses (Line ~20)

**Context:** HTTP error response means request reached server, server understood, decided, replied intentionally—communication, not crash.

```python
# An HTTP error response means:
# - Request reached the server
# - Server understood the request
# - Server made a decision about it
# - Server replied intentionally

# This is NOT a crash
# This is NOT silence
# This is communication

# Example: ESP32 sends POST /api/temp with malformed JSON
# Pi responds 400 Bad Request
# Request reached Pi, Pi understood it was broken, Pi replied intentionally
```

---

### 2) Error vs Failure (Preview) (Line ~35)

**Context:** HTTP error = response with 4xx/5xx; failure = no response at all (timeout, DNS, connection drop).

```python
# Distinction:
# - HTTP error: A response with a 4xx or 5xx code
# - Failure: No response at all (timeout, DNS, connection drop)

# This chapter is about errors, not failures
# Errors mean the server spoke

# Example:
# Dashboard requests /api/voltage, gets 404 Not Found → HTTP error (Pi responded)
# Dashboard requests /api/voltage, times out → Failure (no response)
```

---

### 3) 4xx vs 5xx: The Line of Responsibility (Line ~48)

**Context:** 4xx = client is at fault; 5xx = server is at fault; everything else is detail.

```python
# The most important rule:
# - 4xx → The client is at fault
# - 5xx → The server is at fault

# That's it. Everything else is detail.
```

---

### 4) 4xx: Client Errors (Line ~58)

**Context:** Request received, server understood, refuses because of the request itself; server says "I can't do this as asked."

```python
# 4xx response means:
# - Request was received
# - Server understood it
# - Server refuses or cannot process because of the request itself

# Server is saying: "I can't do this as asked."
```

---

### 5) Clients Must Not Retry 4xx Blindly (Line ~70)

**Context:** 4xx usually means retry will fail again; something must change on client side.

```python
# 4xx error usually means:
# - Retrying the same request will fail again
# - Something must change on the client side

# Retrying without modification is wasted effort

# Example: coop controller sends GET /api/fence_status without auth
# Gets 401 Unauthorized
# Retrying same request won't help—add credentials first
```

---

### 6) 400 Bad Request — The Request Is Broken (Line ~81)

**Context:** Request malformed, server cannot parse or validate, problem is structural or semantic.

```python
# 400 Bad Request means:
# - Request is malformed
# - Server cannot parse or validate it
# - Problem is structural or semantic

# Most generic client error
```

---

### 7) Common Causes of 400 (Line ~91)

**Context:** Invalid JSON, malformed syntax, missing required fields, wrong data types, invalid query parameters.

```python
# Typical reasons for 400:
# - Invalid JSON: {"temp": 72.5  (missing closing brace)
# - Malformed syntax
# - Missing required fields: POST /api/sensors without device_id
# - Wrong data types: sending "72.5" (string) when 72.5 (number) required
# - Invalid query parameters: GET /api/voltage?unit=invalid

# Server cannot proceed because request makes no sense
```

---

### 8) 400 Is About Structure, Not Permission (Line ~103)

**Context:** Not unauthorized, not forbidden, not missing resource; "this request is not valid as written."

```python
# 400 does NOT mean:
# - You are unauthorized
# - You lack permission
# - The resource doesn't exist

# It means: "This request is not valid as written."
```

---

### 9) Servers Should Be Explicit with 400 (Line ~115)

**Context:** Good servers return clear error message in body; bad servers return 400 with no explanation.

```python
# Good servers:
# - Return clear error message in body
# - Describe what is wrong
# - Help client fix the request

# Bad servers return 400 with no explanation

# Example:
# ESP32 sends malformed JSON, gets 400 with empty body → What's wrong? No idea.
# Good: 400 with body {"error": "Invalid JSON: missing closing brace"}
```

---

### 10) 401 Unauthorized — Authentication Required (Line ~127)

**Context:** Despite name, means "not authenticated"; credentials missing or invalid; server asks "who are you?"

```python
# Despite the name, 401 Unauthorized actually means:
# NOT AUTHENTICATED

# It signals:
# - Credentials are missing
# - Or credentials are invalid

# Server is asking: "Who are you?"
```

---

### 11) Authentication vs Authorization (Line ~142)

**Context:** Authentication = who are you (identity); authorization = are you allowed (permission); 401 is about authentication.

```python
# This distinction matters:
# - Authentication: Who are you? (identity)
# - Authorization: Are you allowed? (permission)

# 401 is about authentication, not permission

# Example:
# Dashboard sends GET /api/sensors without Authorization header
# Pi responds 401 Unauthorized—who are you? Prove identity first.
# Once authenticated, DELETE /api/config might get 403 Forbidden
# → You're authenticated, but not authorized for that action
```

---

### 12) Typical 401 Scenarios (Line ~153)

**Context:** No Authorization header, token expired, credentials invalid; request could succeed if identity proven.

```python
# 401 occurs when:
# - No Authorization header present (ESP32 forgets to include it)
# - Token is expired (dashboard's auth token expired after 24 hours)
# - Credentials are invalid (coop controller sends wrong API key)

# Request could succeed if identity were proven
```

---

### 13) 401 Often Includes a Challenge (Line ~164)

**Context:** WWW-Authenticate header with instructions for how to authenticate; server invites client to try again properly.

```python
# Many 401 responses include:
# - WWW-Authenticate header
# - Instructions for how to authenticate

# Server is inviting client to try again properly

# Example:
# Coop controller sends GET /api/fence_status without credentials
# Pi responds 401 Unauthorized with header: WWW-Authenticate: Bearer
# Controller knows it needs to add: Authorization: Bearer <token>
```

---

### 14) Clients Should Retry 401 Correctly (Line ~175)

**Context:** Retry 401 makes sense only if credentials are added or corrected; blind retries are pointless.

```python
# Retrying 401 can make sense—but only if:
# - Credentials are added or corrected

# Blind retries are pointless

# Example:
# ESP32 sends POST /api/temp, gets 401 Unauthorized
# ESP32 should: fetch new token, add Authorization: Bearer <new_token>, retry
# Retrying same request without credentials → still 401
```

---

### 15) 403 Forbidden — Identity Known, Access Denied (Line ~184)

**Context:** Client is authenticated, server knows who you are, you are not allowed; this is a hard stop.

```python
# 403 Forbidden means:
# - Client is authenticated
# - Server knows who you are
# - You are NOT allowed to do this

# This is a hard stop

# Example:
# Solar logger sends DELETE /api/config with valid authentication
# Pi responds 403 Forbidden—you're authenticated but don't have permission
# No amount of retrying will help
```

---

### 16) What 403 Communicates (Line ~196)

**Context:** Server says "I know who you are. You don't have permission." Retrying won't help unless permissions change.

```python
# Server is saying:
# "I know who you are. You don't have permission."

# No amount of retrying will help unless permissions change

# Example:
# ESP32 is authenticated but tries /api/admin/sensors
# Pi responds 403 Forbidden—ESP32 doesn't have admin permissions
# Retrying won't help—permissions must change on server side
```

---

### 17) 403 vs 401 (Line ~207)

**Context:** 401 = "who are you?"; 403 = "I know who you are, and no." Confusing these breaks client logic.

```python
# Critical distinction:
# - 401: "Who are you?"
# - 403: "I know who you are, and no."

# Confusing these breaks client logic
```

---

### 18) When to Use 403 (Line ~216)

**Context:** Access restricted, resource exists, authentication succeeded, authorization failed; don't use 403 to hide auth requirements.

```python
# Use 403 when:
# - Access is restricted
# - Resource exists
# - Authentication succeeded
# - Authorization failed

# Do NOT use 403 to hide authentication requirements

# Example:
# Solar logger authenticated but tries /api/admin/users
# Pi responds 403 Forbidden—resource exists, authenticated, not admin
# Use 401 if credentials missing, 403 if credentials valid but insufficient
```

---

### 19) 404 Not Found — The Resource Does Not Exist (Line ~229)

**Context:** Server understood request, resource doesn't exist at that path; about absence, not permission.

```python
# 404 Not Found means:
# - Server understood the request
# - Resource does not exist at that path

# This is about absence, not permission

# Example:
# Dashboard requests GET /api/sensors/nonexistent_id
# Pi responds 404 Not Found—that sensor doesn't exist
# Not about permission (you're allowed to read sensors), it's about absence
```

---

### 20) What 404 Does Not Mean (Line ~240)

**Context:** Not server down, not malformed request, not forbidden; "there is nothing here."

```python
# 404 does NOT mean:
# - Server is down
# - Request was malformed
# - Client is forbidden

# It means: "There is nothing here."
```

---

### 21) 404 Is About the Path (Line ~251)

**Context:** The path in the request line maps to nothing; "that path maps to nothing."

```python
# The path in the request line:
# GET /something HTTP/1.1

# Server is saying: "That path maps to nothing."
```

---

### 22) 404 vs 403: Design Choice (Line ~263)

**Context:** APIs sometimes return 404 instead of 403 to avoid revealing resource exists; reduces information leakage.

```python
# Sometimes APIs deliberately return 404 instead of 403:
# - To avoid revealing that a resource exists
# - To reduce information leakage

# This is a design decision—not a protocol requirement

# Example:
# ESP32 tries /api/admin/sensors
# Pi could return 403 (authenticated but not authorized)
# Or 404 (to hide that admin endpoints exist)
# Both valid—404 reduces info leakage but makes debugging harder
```

---

### 23) 404 Is Cacheable (Line ~274)

**Context:** 404 responses can be cached; absence is still information.

```python
# 404 responses can be cached
# Absence is still information

# Example:
# Dashboard requests GET /api/sensors/nonexistent_id, gets 404
# Dashboard can cache this—sensor doesn't exist, don't ask again for a while
# Absence is information worth caching
```

---

### 24) 5xx: Server Errors (Line ~282)

**Context:** Request was valid, client did nothing wrong, server failed to fulfill; responsibility shifts to server.

```python
# 5xx response means:
# - Request was valid
# - Client did nothing wrong
# - Server failed to fulfill the request

# Responsibility shifts to the server

# Example:
# Dashboard sends valid GET /api/voltage
# Pi crashes while processing, responds 500 Internal Server Error
# Request was fine—Pi failed. Responsibility is on server.
```

---

### 25) Clients May Retry 5xx (Line ~294)

**Context:** Unlike 4xx, retrying 5xx may succeed, especially if failure was transient; but retries should be bounded.

```python
# Unlike 4xx:
# - Retrying 5xx may succeed
# - Especially if failure was transient

# But retries should be bounded

# Example:
# ESP32 sends POST /api/temp, gets 503 Service Unavailable
# Pi might recover—retry after a delay
# But don't retry forever—if still 503 after several attempts, back off
```

---

### 26) 500 Internal Server Error — The Server Broke (Line ~305)

**Context:** Unhandled exception, bug hit, server couldn't complete request; server is admitting failure.

```python
# 500 Internal Server Error is the generic server failure

# It means:
# - An unhandled exception occurred
# - A bug was hit
# - Server could not complete the request

# Server is admitting failure

# Example:
# Dashboard requests GET /api/voltage
# Pi hits unhandled exception while reading sensor
# Responds 500 Internal Server Error—something broke on server side
```

---

### 27) What 500 Tells the Client (Line ~319)

**Context:** Not much detail; just "something went wrong on our side." Clients should not assume anything else.

```python
# 500 tells client:
# "Something went wrong on our side."

# Not much detail. Just that.
# Clients should not assume anything else.
```

---

### 28) Servers Should Log 500s Aggressively (Line ~329)

**Context:** 500 should be logged, trigger investigation, never ignored; 500s are symptoms of broken assumptions.

```python
# 500 response should:
# - Be logged
# - Trigger investigation
# - Never be ignored

# 500s are symptoms of broken assumptions

# Example:
# Pi responds 500 to GET /api/voltage
# Pi should log: full stack trace, request that caused it, relevant context
# 500 means something unexpected happened—investigate immediately
```

---

### 29) Clients Should Be Careful with 500 (Line ~343)

**Context:** Retry cautiously, possibly back off, don't change request automatically; request may be fine.

```python
# Clients should:
# - Retry cautiously
# - Possibly back off
# - NOT change the request automatically

# The request may be fine

# Example:
# ESP32 sends POST /api/temp, gets 500 Internal Server Error
# Request was valid—don't modify it
# Retry after delay, back off if keeps failing
# 500 means server failure, not client error
```

---

### 30) 502 Bad Gateway — Upstream Failure (Line ~355)

**Context:** Server is proxy/gateway, contacted upstream service, upstream response was invalid; failure not local but still server-side.

```python
# 502 Bad Gateway means:
# - Server is acting as proxy or gateway
# - It contacted an upstream service
# - Upstream response was invalid or broken

# Failure is not local—but still server-side

# Example:
# Dashboard requests /api/voltage
# Pi acts as gateway, forwards to upstream sensor service
# Upstream service crashes
# Pi responds 502 Bad Gateway—failure is upstream, still server responsibility
```

---

### 31) Where 502 Happens (Line ~367)

**Context:** Common in reverse proxies, load balancers, microservice architectures; "I asked someone else, and they failed."

```python
# Common in:
# - Reverse proxies
# - Load balancers
# - Microservice architectures

# Server is saying:
# "I asked someone else, and they failed."
```

---

### 32) 503 Service Unavailable — Temporary Failure (Line ~379)

**Context:** Server currently unable to handle request; overload, maintenance, temporary outage; this is temporary.

```python
# 503 Service Unavailable means:
# - Server is currently unable to handle the request
# - Due to overload, maintenance, or temporary outage

# This is a temporary condition

# Example:
# Pi is rebooting or overloaded
# ESP32 sends POST /api/temp, gets 503 Service Unavailable
# Pi is temporarily unable to handle requests—this should pass
```

---

### 33) Retry Semantics of 503 (Line ~390)

**Context:** 503 often includes Retry-After header telling client when to try again; "don't hammer me, try later."

```python
# 503 often includes:
# Retry-After: seconds

# This tells client:
# "Don't hammer me. Try again later."
```

---

### 34) 503 Is Not a Crash (Line ~401)

**Context:** 503 is intentional; server is protecting itself; controlled refusal, not failure.

```python
# 503 is intentional
# Server is protecting itself

# This is controlled refusal, not failure

# Example:
# Pi is rebooting or under heavy load
# Instead of crashing or accepting requests it can't handle
# Pi responds 503 Service Unavailable to new requests
# This is intentional—Pi is protecting itself
# Once recovered, it will accept requests again
# Contrast with 500—that's an unexpected failure
```

---

### 35) Choosing Between 500, 502, and 503 (Line ~411)

**Context:** 500 = bug/unexpected failure; 502 = dependency failed; 503 = temporarily unavailable.

```python
# Choosing between 500, 502, and 503:
# - 500: Bug or unexpected failure (server crashed, unhandled exception)
# - 502: Dependency failed (upstream service broke)
# - 503: Temporarily unavailable (overloaded, rebooting, maintenance)

# Each communicates a different operational state

# Example:
# Dashboard requests /api/voltage
# If Pi hits unhandled exception → 500
# If Pi forwards to upstream sensor service that crashes → 502
# If Pi is rebooting → 503 with Retry-After
# Each tells client something different about what went wrong
```

---

### 36) Error Codes Are Contracts (Line ~421)

**Context:** When server returns status code, it promises meaning; clients build logic around these promises.

```python
# When server returns a status code, it is making a promise about meaning
# Clients build logic around these promises
# Breaking them causes cascading failure

# Example:
# ESP32 expects 401 when credentials missing, so it can fetch new token and retry
# If Pi returns 403 instead, ESP32 thinks it's authenticated but lacks permission
# Wrong logic, wrong behavior
# Error codes are contracts—break them at your peril
```

---

### 37) Error Bodies Are Optional but Useful (Line ~432)

**Context:** HTTP doesn't require error bodies; but humans need them; good APIs return structured error messages.

```python
# HTTP does not require error bodies
# But humans do

# Good APIs:
# - Return structured error messages
# - Explain what went wrong
# - Preserve machine readability

# Example:
# ESP32 sends malformed JSON, gets 400 Bad Request
# Body: {"error": "Invalid JSON: missing closing brace at line 1"}
# Status code says "client error," body explains what's wrong
# Contrast: 400 with empty body—ESP32 knows something's wrong but not what
```

---

### 38) Do Not Encode Errors Only in JSON (Line ~445)

**Context:** Returning 200 OK with {"error": "something broke"} is a protocol lie; errors belong in status codes first.

```python
# Returning:
# 200 OK
# { "error": "something broke" }

# Is a protocol lie
# Errors belong in status codes first

# Example:
# ESP32 sends invalid data, Pi responds 200 OK with {"error": "invalid data"}
# This is a protocol lie—use 400 Bad Request
# Generic HTTP clients won't check body for errors—they rely on status codes
```

---

### 39) HTTP Errors Are Not Exceptions (Line ~461)

**Context:** Errors are expected, part of normal operation, don't imply panic; different from many programming models.

```python
# In HTTP:
# - Errors are expected
# - They are part of normal operation
# - They do not imply panic

# Different from many programming models

# Example:
# Dashboard requests /api/sensors/nonexistent_id, gets 404 Not Found
# This is normal—resources don't always exist. Handle gracefully, don't crash.
# Or ESP32 gets 401 Unauthorized—normal, fetch new token and retry
# Errors are expected in HTTP—they're signals, not exceptions
```

---

### 40) Errors Enable Robust Clients (Line ~473)

**Context:** Clear errors allow clients to retry correctly, fix requests, ask for credentials, back off gracefully.

```python
# Clear errors allow clients to:
# - Retry correctly (503 with Retry-After → wait and retry)
# - Fix requests (400 with error message → fix JSON and retry)
# - Ask for credentials (401 → fetch token and retry)
# - Back off gracefully (repeated 503 → exponential backoff)

# Ambiguous errors cause chaos

# Example:
# ESP32 gets 400 with clear message → fix request and retry
# Or gets 503 with Retry-After: 60 → wait 60 seconds and retry
# Clear errors enable robust automation
# Ambiguous errors (200 OK with {"error": "..."}) break automation
```

---

### Reflection: Error Analysis (Line ~486)

**Context:** Why 400 not 500 for malformed JSON? Why 401 not 403 for missing auth? Why 403 not 404 for forbidden?

```python
# You send malformed JSON. Why 400 and not 500?
# → 400 is client error (your JSON is broken), 500 is server error (server broke)

# You forget authentication. Why 401 and not 403?
# → 401 is "who are you?", 403 is "I know who you are, and no"

# You authenticate but lack permission. Why 403 and not 404?
# → 403 is "access denied", 404 is "doesn't exist"
# → 403 means resource exists, you just can't access it

# Server crashes mid-request. Why 500 and not silence?
# → 500 is communication—server responded intentionally
# → Silence is failure—no response at all

# Failure modes:
# ESP32 sends {"temp": 72.5 (missing brace) → 400 (malformed, client error)
# Dashboard sends without credentials → 401 (not authenticated)
# Solar logger authenticated but DELETE /api/config → 403 (authenticated but not authorized)
# Pi crashes processing GET /api/voltage → 500 (server failure, responded intentionally)
```

---

## Chapter 2.12: Errors vs Failures

### 1) Two Kinds of "Something Went Wrong" (Line ~19)

**Context:** Server responded with error vs request never completed; different layers, different handling.

```python
# When something goes wrong, one of two things happened:
# 1. Server responded with an error
# 2. Request never completed

# These are NOT variations of the same problem
# They live in different layers
# They require different handling

# Example:
# ESP32 sends POST /api/temp, gets 400 Bad Request → HTTP error, Pi responded
# ESP32 sends POST /api/temp, times out after 30 seconds → Failure, no response
# Different problems, different handling
```

---

### 2) HTTP Error Responses Are Still Communication (Line ~32)

**Context:** Error response = request reached server, parsed, decided, replied; successful communication with unsuccessful outcome.

```python
# HTTP error response means:
# - Request reached the server
# - Server parsed the request
# - Server made a decision
# - Server replied intentionally

# Even if response is 404 or 500, protocol exchange completed
# This is successful communication with unsuccessful outcome

# Example:
# Dashboard requests GET /api/sensors/nonexistent_id, gets 404 Not Found
# Request reached Pi, Pi parsed it, decided resource doesn't exist, replied
# Communication succeeded, outcome failed
```

---

### 3) Network Failures Are Absence (Line ~47)

**Context:** No HTTP response received, client doesn't know what happened, server may never have seen request; silence.

```python
# Network failure means:
# - No HTTP response was received
# - Client does not know what happened
# - Server may never have seen the request

# This is NOT an HTTP event
# This is silence

# Example:
# ESP32 sends POST /api/temp, waits 30 seconds, no response
# Did Pi receive it? Did it crash? Did Wi-Fi drop? Unknown.
# This is absence, not an HTTP error
# No status code, no response body, just silence
```

---

### 4) Presence vs Absence (Line ~60)

**Context:** HTTP error = presence of response; failure = absence of response; presence contains information, absence does not.

```python
# This entire chapter reduces to one idea:
# - HTTP error = presence of a response
# - Failure = absence of a response

# Presence contains information
# Absence does not

# Example:
# ESP32 gets 500 Internal Server Error → presence, information: Pi received and crashed
# ESP32 times out → absence, no information: did Pi see it? Process it? Unknown
```

---

### 5) HTTP Errors Live at the Application Layer (Line ~72)

**Context:** HTTP errors occur after DNS resolution, TCP connection, request transmission; the server spoke.

```python
# HTTP errors occur after:
# - DNS resolution
# - TCP connection
# - Request transmission

# They live inside the HTTP protocol

# Examples:
# - 400 Bad Request (ESP32 sends malformed JSON)
# - 401 Unauthorized (dashboard missing credentials)
# - 404 Not Found (coop controller requests nonexistent endpoint)
# - 500 Internal Server Error (Pi crashes while processing request)

# The server spoke
```

---

### 6) Failures Live Below HTTP (Line ~90)

**Context:** Failures occur before or during HTTP: DNS fails, TCP fails, connection drops, request times out; HTTP never completed.

```python
# Failures occur before or during HTTP:
# - DNS resolution fails (pi.local doesn't resolve)
# - TCP connection cannot be established (Pi is offline)
# - Connection drops mid-transfer (Wi-Fi disconnects while ESP32 sends data)
# - Request times out (dashboard waits 30 seconds, no response)

# HTTP never completed
```

---

### 7) Why This Distinction Exists (Line ~101)

**Context:** HTTP assumes working transport; when that assumption breaks, HTTP has nothing to say; protocol ends before it begins.

```python
# HTTP assumes a working transport

# When that assumption breaks:
# - HTTP has nothing to say
# - There is no status code
# - There is no response body

# The protocol ends before it begins

# Example:
# Dashboard tries to connect to pi.local but DNS resolution fails
# HTTP can't help—it assumes DNS works
# The protocol never starts
```

---

### 8) 500 Is Not a Failure (Line ~115)

**Context:** 500 = "I received your request, tried to process it, failed"; not ambiguity, explicit communication.

```python
# 500 Internal Server Error means:
# "I received your request, I tried to process it, and I failed."

# This is NOT ambiguity
# This is explicit communication

# You know the server exists
# You know the server received the request

# Example:
# Dashboard requests GET /api/voltage, gets 500 Internal Server Error
# You know: Pi exists, received request, tried to process it, failed
# This is explicit communication, not ambiguity
```

---

### 9) Timeout Is Not an Error (Line ~131)

**Context:** Timeout = "I waited, nothing came back"; don't know if server received, processed, crashed, response lost.

```python
# Timeout means:
# "I waited, and nothing came back."

# You do NOT know:
# - Whether server received the request
# - Whether it processed it
# - Whether it crashed
# - Whether the response was lost

# Timeouts are uncertainty

# Example:
# ESP32 sends POST /api/temp, times out after 30 seconds
# Did Pi receive it? Process it? Crash? Unknown
# Timeout is uncertainty, not information
```

---

### 10) Why Treating Timeouts Like Errors Is Dangerous (Line ~147)

**Context:** If you treat timeout like 500, you may retry unsafe requests, duplicate operations, corrupt state.

```python
# If you treat timeout like 500:
# - You may retry unsafe requests
# - You may duplicate operations
# - You may corrupt state

# Timeouts require caution, not confidence

# Example:
# Solar logger sends POST /api/readings, times out
# If you retry blindly, you might send duplicate readings
# Pi might have processed the first request—you don't know
# Timeouts require caution, not automatic retries
```

---

### 11) 404 Is Not a Failure (Line ~159)

**Context:** 404 = "I am here, I understood you, that resource does not exist"; information that allows client to act.

```python
# 404 Not Found means:
# "I am here. I understood you. That resource does not exist."

# This is information

# Client can:
# - Stop retrying
# - Correct the path
# - Update stored links

# Example:
# Dashboard requests GET /api/sensors/nonexistent_id, gets 404 Not Found
# Dashboard knows resource doesn't exist—stop retrying, fix path, update links
# This is information, not failure
```

---

### 12) DNS Failure Is Not a 404 (Line ~175)

**Context:** DNS failure = "I cannot find the server"; about location, not resource; no HTTP request occurred.

```python
# DNS failure means:
# "I cannot find the server."

# This is NOT about a resource
# This is about location

# No HTTP request occurred

# Example:
# ESP32 tries to connect to pi.local but DNS resolution fails
# No HTTP request happened—DNS failed before HTTP could start
# This is NOT 404 Not Found—this is DNS failure, a transport problem
```

---

### 13) The Client's Perspective Matters (Line ~189)

**Context:** From client's view: HTTP error = server spoke; failure = silence; client code must branch here first.

```python
# From the client's point of view:
# - HTTP error → server spoke
# - Failure → silence

# Your client code must branch here first

# Example:
# Dashboard sends GET /api/voltage, gets 500 Internal Server Error → Pi spoke, handle as HTTP error
# Dashboard sends GET /api/voltage, times out → silence, handle as failure
# Your code must branch on "did I get a response?" before anything else
```

---

### 14) The First Question Your Code Should Ask (Line ~200)

**Context:** When something goes wrong, first ask: "Did I receive an HTTP response?" Everything else depends on this.

```python
# When something goes wrong, your code should ask:
# "Did I receive an HTTP response?"

# Everything else depends on this answer

# Example:
# ESP32 sends POST /api/temp, something goes wrong
# First question: did I get an HTTP response?
# If yes → inspect status code (400, 401, 500, etc.)
# If no → treat as transport failure (timeout, DNS, connection drop)
# Everything else—retry logic, error handling, logging—depends on this first answer
```

---

### 15) Partial Responses (Line ~211)

**Context:** Receive headers, part of body, then connection drops; not HTTP error, transport failure mid-response.

```python
# Sometimes you receive:
# - Headers
# - Part of the body
# - Then the connection drops

# This is NOT an HTTP error
# This is a transport failure mid-response

# Example:
# Dashboard requests GET /api/voltage
# Receives headers plus part of JSON body, then connection drops
# This is not an HTTP error—response was incomplete
# Transport failed mid-response
```

---

### 16) Partial Data Is Dangerous (Line ~225)

**Context:** Server may have completed action, client may not know result, retrying may duplicate side effects.

```python
# Partial responses are dangerous because:
# - Server may have completed the action
# - Client may not know the result
# - Retrying may duplicate side effects

# This is the hardest failure mode to reason about

# Example:
# ESP32 sends POST /api/temp, receives 200 OK headers
# But connection drops before body arrives
# Did Pi process the temperature? Unknown
# Retrying might send duplicate data
# This is ambiguity at its worst
```

---

### 17) HTTP Cannot Represent Partial Failure (Line ~237)

**Context:** HTTP status codes assume complete request and response; partial failure exists outside the protocol.

```python
# HTTP status codes assume:
# - A complete request
# - A complete response

# Partial failure exists outside the protocol

# Example:
# ESP32 sends POST /api/temp, receives 200 OK headers
# But connection drops before body arrives
# HTTP has no status code for "partial success"—protocol assumes complete responses
# This is a transport failure, not an HTTP error
# You're on your own
```

---

### 18) Why Idempotency Matters Here (Line ~248)

**Context:** Idempotent requests (GET, PUT, DELETE) can often be retried safely; non-idempotent (POST) may cause duplicates.

```python
# Idempotent requests (GET, PUT, DELETE):
# - Can often be retried safely

# Non-idempotent requests (POST):
# - May cause duplicate side effects

# Failures force you to care about this distinction

# Example:
# Dashboard sends GET /api/voltage (idempotent), times out → safe to retry
# Or sends POST /api/temp (non-idempotent), times out → dangerous to retry, might duplicate
# Failures force you to understand idempotency
```

---

### 19) Error Handling vs Failure Handling (Line ~261)

**Context:** Error handling: inspect status code, parse body, decide on semantics. Failure handling: decide retry, when to give up.

```python
# You should handle them differently:

# HTTP Error Handling:
# - Inspect status code
# - Parse response body
# - Decide based on semantics

# Failure Handling:
# - Decide whether to retry
# - Decide when to give up
# - Decide how to surface uncertainty

# Example:
# Dashboard gets 401 Unauthorized → HTTP error
# Inspect status code, parse body for error message, fetch new token, retry

# Dashboard times out → failure
# No status code, no body
# Decide: retry? Give up? How long to wait?
# Different handling for different problems
```

---

### 20) Why Retries Are Dangerous Without This Model (Line ~279)

**Context:** Retrying blindly can cause duplicate orders, double billing, corrupted state, cascading failures.

```python
# Retrying blindly can cause:
# - Duplicate orders
# - Double billing
# - Corrupted state
# - Cascading failures

# Retries must be intentional

# Example:
# Solar logger sends POST /api/readings, times out
# Blindly retrying might send duplicate readings, corrupting your data
# Retries must be intentional—understand what you're retrying and why
```

---

### 21) Failures Create Ambiguity (Line ~291)

**Context:** Errors are explicit; failures are ambiguous; ambiguity is expensive.

```python
# Errors are explicit
# Failures are ambiguous
# Ambiguity is expensive

# Example:
# ESP32 gets 500 Internal Server Error → explicit: Pi received and crashed
# ESP32 times out → ambiguous: did Pi see it? Process it? Crash? Unknown
# Ambiguity forces you to make assumptions, and assumptions are expensive—they lead to bugs
```

---

### 22) Logging Errors vs Failures (Line ~301)

**Context:** Log HTTP errors with status/headers/body; log failures with timing/connection state/DNS; different stories.

```python
# Good systems log them differently:
# - HTTP errors: log status, headers, body
# - Failures: log timing, connection state, DNS, transport info

# They tell different stories

# Example:
# Pi logs 500 Internal Server Error with stack trace → server bug, investigate code
# Or logs timeout with connection state → network issue, investigate network
# Different logs, different stories, different fixes
```

---

### 23) Monitoring Implications (Line ~312)

**Context:** Rising 4xx = client misuse; rising 5xx = server bugs; rising timeouts = network/load issues.

```python
# From an ops perspective:
# - Rising 4xx → client misuse
# - Rising 5xx → server bugs
# - Rising timeouts → network or load issues

# If you lump these together, you lose signal

# Example:
# Rising 401 Unauthorized means clients need new tokens—fix authentication
# Rising timeouts mean network or load issues—fix infrastructure
# Lumping them together loses signal—you can't tell what's wrong
```

---

### 24) Client Libraries Often Hide This Distinction (Line ~324)

**Context:** Many HTTP libraries throw exceptions for both errors and failures; blur semantics; you must know what you caught.

```python
# Many HTTP libraries:
# - Throw exceptions for both errors and failures
# - Blur semantics
# - Encourage catch-all handling

# This is dangerous
# You must know what you caught

# Example:
# ESP32 catches exception from HTTP library
# Is it 400 Bad Request (HTTP error) or timeout (failure)?
# Library might throw same exception type for both
# You must inspect what you caught—don't treat them the same
# HTTP errors have status codes; failures don't
```

---

### 25) Exceptions Are Not Semantics (Line ~339)

**Context:** Exception may represent timeout, DNS failure, connection reset, malformed response; inspect what kind.

```python
# An exception may represent:
# - A timeout
# - A DNS failure
# - A connection reset
# - A malformed response

# You must inspect what kind of exception it is

# Example:
# ESP32 catches exception
# Is it timeout? DNS failure? Connection reset? Malformed response?
# Each requires different handling
# You must inspect what kind of exception it is—don't treat them all the same
```

---

### 26) "No Response" Is a First-Class Outcome (Line ~351)

**Context:** "No response" is not a bug; it's a valid system state; design for it.

```python
# "No response" is NOT a bug
# It is a valid system state
# Design for it

# Example:
# Solar logger sends POST /api/readings, gets no response
# This isn't a bug—it's a valid outcome
# Networks fail, servers restart, connections drop
# Design your system to handle "no response" as a first-class outcome, not an exception to ignore
```

---

### 27) Failure Is Normal (Line ~361)

**Context:** Networks fail, packets drop, servers restart, connections reset; not exceptional behavior, baseline reality.

```python
# Networks fail
# Packets drop
# Servers restart
# Connections reset

# This is NOT exceptional behavior
# It is baseline reality

# Example:
# Pi reboots, Wi-Fi drops, DNS fails, connections reset
# This happens all the time
# Your ESP32 sending temperature readings will encounter these failures regularly
# Design for it—failure is normal, not exceptional
```

---

### 28) HTTP Errors Are Normal Too (Line ~373)

**Context:** APIs return 404s, auth expires, permissions change; errors are communication, not disasters.

```python
# APIs return 404s
# Auth expires
# Permissions change

# Errors are NOT disasters
# They are communication

# Example:
# Dashboard requests /api/sensors/nonexistent_id, gets 404 Not Found → normal, resource doesn't exist
# Or ESP32's auth token expires, gets 401 Unauthorized → normal, fetch new token
# Errors are communication, not disasters. Handle them gracefully.
```

---

### 29) Silence Is the Hardest Case (Line ~385)

**Context:** Silence gives no certainty; all resilient systems are designed around silence.

```python
# Silence gives you no certainty
# All resilient systems are designed around silence

# Example:
# ESP32 sends POST /api/temp, gets silence—no response, no error, nothing
# Did Pi receive it? Did it process it? Unknown
# All resilient systems are designed around this uncertainty
# Handle silence explicitly—don't assume success, don't assume failure, handle the ambiguity
```

---

### 30) Client Strategy Summary (Line ~395)

**Context:** Did I receive HTTP response? If yes, inspect status code. If no, treat as transport failure. Decide retry carefully.

```python
# When a request fails:
# 1. Did I receive an HTTP response?
# 2. If yes → inspect status code
# 3. If no → treat as transport failure
# 4. Decide retry behavior carefully
# 5. Preserve idempotency guarantees

# Example:
# Dashboard sends GET /api/voltage (idempotent), times out → retry safely
# Or sends POST /api/temp (non-idempotent), times out → retry cautiously, might duplicate
# Always preserve idempotency guarantees
```

---

### 31) Why This Chapter Exists (Line ~407)

**Context:** Most bugs in distributed systems come from treating silence like error, error like silence, retrying blindly.

```python
# Most bugs in distributed systems come from:
# - Treating silence like an error
# - Treating errors like silence
# - Retrying blindly
# - Assuming success without confirmation

# This chapter prevents that
```

---

### Reflection: Errors vs Failures Analysis (Line ~418)

**Context:** Timeout: did server return 500? Did DNS fail? Did connection drop mid-body? What do you know?

```python
# Your client waits 30 seconds and throws. Did server return 500?
# → No—you got no response, so no status code

# Did DNS fail?
# → Maybe—check DNS resolution

# Did connection drop mid-body?
# → Maybe—check connection state

# Did server process the request anyway?
# → Unknown—this is ambiguity

# What do you know? Nothing—timeout is absence
# What do you not know? Everything—did Pi see it? Process it? Crash? Unknown
# What is safe to retry? Depends on idempotency—if idempotent, retry cautiously; if not, be very careful

# Failure modes:
# ESP32 sends POST /api/temp, times out → ambiguity, Pi might have processed it
# Dashboard sends GET /api/voltage, gets 500 → explicit, Pi saw it, crashed
# Solar logger sends POST /api/readings, receives headers but connection drops → partial response, maximum ambiguity
```

---

## Chapter 2.13: HTTP Methods

### 1) Methods Encode Intent, Not Implementation (Line ~20)

**Context:** Method tells server what kind of thing client wants; server decides how to fulfill intent.

```python
# Method does NOT tell server how to do something
# It tells server what kind of thing client wants:
# - "I want to retrieve"
# - "I want to create"
# - "I want to replace"
# - "I want to partially modify"
# - "I want to remove"

# Server decides how to fulfill that intent
```

---

### 2) Methods Are Part of the Protocol Contract (Line ~33)

**Context:** GET promises "not asking you to change anything"; POST signals "this may cause a change."

```python
# When client sends:
# GET /resource

# It is making a promise:
# "I am not asking you to change anything."

# When client sends:
# POST /resource

# It is saying:
# "This may cause a change."

# Servers, proxies, caches, and clients rely on this promise

# Example:
# Dashboard sends GET /api/voltage—promising no state change
# Pi can cache this, prefetch it, retry it safely
# Or ESP32 sends POST /api/temp—signaling potential change
# Pi knows not to cache this, not to retry automatically, to handle carefully
```

---

### 3) Why Methods Matter Under Failure (Line ~56)

**Context:** When everything works, incorrect methods appear to work; when failures happen, they cause data loss, duplicates.

```python
# When everything works:
# - Incorrect methods appear to work

# When failures happen:
# - Incorrect methods cause data loss
# - Duplicate actions
# - Corrupted state
# - Inconsistent systems

# Methods exist for failure cases, not happy paths

# Example:
# ESP32 sends GET /api/increment_counter—it works, counter increments
# But when request times out and ESP32 retries (GET is safe to retry)
# Counter increments twice
# Methods exist for failure cases—when retries happen, when connections drop
```

---

### 4) The Core Methods (Line ~72)

**Context:** Five most important methods: GET, POST, PUT, PATCH, DELETE; sufficient to model almost all HTTP APIs.

```python
# Five most important methods:
# - GET
# - POST
# - PUT
# - PATCH
# - DELETE

# These are sufficient to model almost all HTTP APIs correctly
```

---

### 5) GET — Retrieve Without Side Effects (Line ~84)

**Context:** GET retrieves representation; safe, idempotent, cacheable, no request body by convention; must not change state.

```python
# GET retrieves a representation of a resource

# Properties:
# - Safe
# - Idempotent
# - Cacheable
# - No request body (by convention)

# GET must NOT change server state
```

---

### 6) What "Safe" Means (Line ~97)

**Context:** Safe = "this request does not cause state change on server"; not harmless or free, just no mutation.

```python
# Safe means:
# "This request does not cause a state change on the server."

# It does NOT mean:
# - The request is harmless
# - The request is free
# - The request is cheap

# It means: no mutation
```

---

### 7) Why Safety Matters (Line ~111)

**Context:** Safe methods can be retried automatically, prefetched, cached, replayed; if GET mutates state, web breaks.

```python
# Because safe methods can be:
# - Retried automatically
# - Prefetched
# - Cached
# - Replayed

# If GET mutates state, the entire web breaks

# Example:
# Dashboard sends GET /api/voltage, times out
# HTTP library can retry automatically—GET is safe, no side effects
# Or browser prefetches GET /api/config links—safe to prefetch, no mutations
# If GET mutated state, retries and prefetching would break everything
# Safety enables automation
```

---

### 8) GET and Idempotency (Line ~124)

**Context:** GET is idempotent: one GET = state unchanged, ten GETs = state unchanged; response may change, but requesting doesn't.

```python
# GET is idempotent:
# - One GET → state unchanged
# - Ten GETs → state unchanged

# Response may change over time, but the act of requesting does not

# Example:
# ESP32 sends GET /api/voltage once—state unchanged, reads voltage
# Sends it ten times—state still unchanged, reads voltage ten times
# Voltage reading might change (new reading each time)
# But the act of requesting doesn't change server state
# GET is both safe and idempotent—perfect for retries
```

---

### 9) GET and Bodies (Line ~136)

**Context:** Technically HTTP allows GET bodies; practically never rely on them; if you need body, use POST.

```python
# Technically, HTTP allows GET bodies
# Practically, you should never rely on them

# Many clients, proxies, and servers ignore GET bodies entirely

# If you need a body, you likely want POST

# Example:
# Dashboard sends GET /api/search with body containing search criteria
# Some proxies might strip the body, some servers might ignore it
# Use query parameters instead: GET /api/search?q=voltage
# Or if you need complex data, use POST /api/search—POST is designed for bodies
```

---

### 10) GET Examples (Line ~147)

**Context:** Good uses: fetch data, retrieve config, load pages, query state. Bad uses: trigger actions, update counters, create records.

```python
# Good uses:
# - Fetch sensor readings: GET /api/voltage from Pi
# - Retrieve configuration: GET /api/config from coop controller
# - Load a web page: dashboard HTML
# - Query current state: GET /api/fence_status from poultry net controller

# Bad uses:
# - Triggering actions: GET /api/reboot—use POST
# - Updating counters: GET /api/increment—use POST or PATCH
# - Creating records: GET /api/create_sensor—use POST
```

---

### 11) POST — Submit or Create (Line ~161)

**Context:** POST submits data for processing; for creating resources, triggering actions, submitting forms; not idempotent.

```python
# POST submits data to be processed

# POST is for:
# - Creating new resources
# - Triggering actions
# - Submitting forms

# POST is NOT idempotent by default
```

---

### 12) POST Means "Process This" (Line ~172)

**Context:** POST doesn't mean "store this here"; it means "here is data, do something with it"; server defines what happens.

```python
# POST does NOT mean "store this here"
# It means: "Here is data. Do something with it."

# What happens next is server-defined
```

---

### 13) Why POST Is Dangerous Under Failure (Line ~183)

**Context:** POST not idempotent: retry after timeout = duplicate action, retry after partial failure = double creation.

```python
# Because POST is not idempotent:
# - Retry after timeout → duplicate action
# - Retry after partial failure → double creation

# This is why POST requires care

# Example:
# ESP32 sends POST /api/temp, times out
# Did Pi receive it? Process it? Unknown
# If you retry, you might send duplicate temperature readings
# Or solar logger sends POST /api/readings, connection drops mid-transfer
# Retrying might create duplicate readings
# POST requires care—understand what you're retrying and why
```

---

### 14) POST and Resource Creation (Line ~196)

**Context:** Common pattern: POST /api/sensors → server responds 201 Created with Location header; server chose ID, not client.

```python
# Common pattern:
# POST /api/sensors

# Server response:
# - 201 Created
# - Location header with new resource URL: Location: /api/sensors/esp32_coop

# The client did NOT choose the ID
# The server did

# Example:
# ESP32 sends POST /api/sensors to register itself
# Pi creates sensor record, assigns ID esp32_coop
# Responds 201 Created with Location: /api/sensors/esp32_coop
# ESP32 didn't choose the ID—Pi did
```

---

### 15) POST and Side Effects (Line ~214)

**Context:** POST may create records, send emails, trigger jobs, charge credit cards; this is why retries are dangerous.

```python
# POST may:
# - Create records (ESP32 registers new sensor)
# - Send emails (alert notifications)
# - Trigger jobs (solar logger starts data processing)
# - Charge credit cards (payment processing)

# This is why retries are dangerous

# Example:
# Solar logger sends POST /api/readings, times out
# If you retry blindly, you might send duplicate readings, corrupting your data
# POST retries are dangerous—understand what you're retrying
```

---

### 16) PUT — Replace a Resource (Line ~226)

**Context:** PUT = "store this representation at this exact location"; idempotent, not safe, often used for full replacement.

```python
# PUT means "store this representation at this exact location"

# PUT is:
# - Idempotent
# - Not safe
# - Often used for full replacement
```

---

### 17) PUT Semantics Are Precise (Line ~236)

**Context:** PUT says "after this request, resource at this URL should look exactly like this"; not update, not merge—replace.

```python
# PUT says:
# "After this request, the resource at this URL should look exactly like this."

# NOT "update these fields"
# NOT "merge"

# Replace.
```

---

### 18) Why PUT Is Idempotent (Line ~248)

**Context:** Replacing same representation twice yields same result; PUT once = state X, PUT again = state X still.

```python
# Because replacing the same representation twice yields the same result
# - PUT once → state = X
# - PUT again → state = X

# No additional effect

# Example:
# Dashboard sends PUT /api/config with same configuration twice
# First PUT sets state to X
# Second PUT sets state to X again—same result, no additional effect
# This makes PUT safe to retry—if a PUT times out, retrying with same body is safe
```

---

### 19) PUT and Client-Controlled URLs (Line ~259)

**Context:** PUT typically when client knows resource URL and controls identifier.

```python
# PUT is typically used when:
# - Client knows the resource URL
# - Client controls the identifier

# Example:
# PUT /api/sensors/esp32_coop

# Dashboard knows sensor ID, sends PUT /api/sensors/esp32_coop with full config
# Dashboard controls the identifier—knows exactly which sensor to update
```

---

### 20) PUT vs POST for Creation (Line ~275)

**Context:** Can create with PUT if client chooses ID and operation is idempotent; otherwise use POST.

```python
# You can create with PUT if:
# - Client chooses the ID
# - Operation is idempotent

# Otherwise, use POST

# Example:
# Dashboard creates sensor with known ID: PUT /api/sensors/manual_sensor_1
# Dashboard chooses ID, operation is idempotent—creating twice yields same result
# Or ESP32 registers itself without knowing its ID: POST /api/sensors
# Let Pi assign the ID
```

---

### 21) PATCH — Partial Modification (Line ~286)

**Context:** PATCH applies partial change; says "apply this transformation"; not replace, not create.

```python
# PATCH applies a partial change to a resource

# PATCH says: "Apply this transformation."

# NOT: replace everything
# NOT: create something new

# Example:
# Dashboard sends PATCH /api/config with {"voltage_threshold": 12.1}
# Updates only the voltage threshold—other fields remain unchanged
# Contrast with PUT—PUT would replace entire config
# PATCH is for partial updates, PUT is for full replacement
```

---

### 22) PATCH Is About Intent, Not Format (Line ~301)

**Context:** PATCH doesn't prescribe JSON Patch, Merge Patch, or any specific format; only says "partial update."

```python
# PATCH does NOT prescribe:
# - JSON Patch
# - Merge Patch
# - Any specific format

# It only says: partial update

# Example:
# Dashboard sends PATCH /api/config with {"voltage_threshold": 12.1} → merge patch format
# Or sends PATCH /api/config with [{"op": "replace", "path": "/voltage_threshold", "value": 12.1}] → JSON Patch format
# Both valid—PATCH doesn't prescribe format, only intent: partial update
```

---

### 23) PATCH and Idempotency (Line ~313)

**Context:** PATCH can be idempotent if same patch produces same result; "set to 12.1" = idempotent; "increment" = not.

```python
# PATCH can be idempotent if:
# - Same patch produces same result

# Example:
# - "Set threshold to 12.1" → idempotent
# - "Increment counter" → NOT idempotent
```

---

### 24) PATCH Under Failure (Line ~324)

**Context:** PATCH can be dangerous if operation not idempotent; retries apply patch multiple times.

```python
# PATCH can be dangerous if:
# - Operation is not idempotent
# - Retries apply the patch multiple times

# This must be designed explicitly

# Example:
# Dashboard sends PATCH /api/config with {"increment_reading_count": 1}, times out
# If you retry, you might increment twice
# Design PATCH operations to be idempotent when possible—use "set to X" instead of "increment by Y"
```

---

### 25) DELETE — Remove a Resource (Line ~334)

**Context:** DELETE removes resource; idempotent, not safe, often returns 204 No Content.

```python
# DELETE removes a resource

# DELETE is:
# - Idempotent
# - Not safe
# - Often returns 204 No Content

# Example:
# Dashboard sends DELETE /api/sensors/old_id
# Sensor is removed
# DELETE is idempotent—deleting twice has same end state (resource gone)
# DELETE is not safe—it mutates state
# Often returns 204 No Content—success, no body needed
```

---

### 26) Why DELETE Is Idempotent (Line ~346)

**Context:** Deleting something twice has same end state: first DELETE = resource gone, second DELETE = already gone.

```python
# Deleting something twice has the same end state:
# - First DELETE → resource gone
# - Second DELETE → resource already gone

# No additional effect

# Example:
# Dashboard sends DELETE /api/sensors/old_id, gets 204 No Content—deleted
# Sends it again, gets 404 Not Found—already gone
# Same end state: resource doesn't exist
# This makes DELETE safe to retry—if DELETE times out, retrying is safe (idempotent)
```

---

### 27) DELETE and Responses (Line ~357)

**Context:** Common responses: 204 No Content (success), 404 Not Found (already gone), 403 Forbidden (not allowed).

```python
# Common DELETE responses:
# - 204 No Content — success (sensor deleted)
# - 404 Not Found — already gone (sensor already deleted)
# - 403 Forbidden — not allowed (dashboard lacks permission to delete)

# All are valid

# Example:
# Dashboard sends DELETE /api/sensors/old_id
# Pi responds 204 No Content—deleted successfully
# Or responds 404 Not Found—already deleted (idempotent, same end state)
# Or responds 403 Forbidden—you don't have permission
# All are valid responses
```

---

### 28) DELETE Does Not Mean "Erase History" (Line ~369)

**Context:** DELETE means "resource no longer accessible"; doesn't guarantee physical deletion or no audit trail.

```python
# DELETE means:
# "This resource is no longer accessible"

# It does NOT guarantee:
# - Physical deletion
# - Immediate removal
# - No audit trail

# That is server policy
```

---

### 29) Method Safety vs Idempotency (Line ~382)

**Context:** GET: safe+idempotent; POST: neither; PUT/DELETE: idempotent but not safe; PATCH: depends.

```python
# These are different properties

# Method    Safe    Idempotent
# GET       Yes     Yes
# POST      No      No
# PUT       No      Yes
# PATCH     No      Depends
# DELETE    No      Yes

# Memorize this table
```

---

### 30) Why Caches Care About Methods (Line ~396)

**Context:** Caches cache GET, don't cache POST, invalidate on PUT/PATCH/DELETE; misuse methods = caches misbehave.

```python
# Caches:
# - Cache GET
# - Do NOT cache POST
# - Invalidate on PUT/PATCH/DELETE

# If you misuse methods, caches misbehave

# Example:
# Dashboard sends GET /api/voltage—caches can cache this response
# Or sends POST /api/temp—caches won't cache this (POST isn't cacheable)
# Or sends PUT /api/config—caches invalidate any cached config
# If you use GET to mutate state, caches will cache mutations—breaking everything
```

---

### 31) Why Proxies Care About Methods (Line ~408)

**Context:** Proxies may retry idempotent methods automatically, avoid retrying POST, log methods differently.

```python
# Proxies may:
# - Retry idempotent methods automatically
# - Avoid retrying POST
# - Log methods differently

# Method semantics affect infrastructure

# Example:
# ESP32 sends GET /api/voltage through proxy, times out
# Proxy might retry automatically—GET is idempotent, safe to retry
# Or sends POST /api/temp, times out
# Proxy won't retry automatically—POST isn't idempotent, retries are dangerous
# Method semantics affect how infrastructure behaves
```

---

### 32) Why Browsers Care About Methods (Line ~420)

**Context:** Browsers prefetch GET links, warn on resubmitting POST, change POST→GET on redirects historically.

```python
# Browsers:
# - Prefetch GET links
# - Warn on resubmitting POST
# - Change POST → GET on redirects (historically)

# These behaviors assume correct method usage

# Example:
# Browser prefetches GET /api/voltage links—safe to prefetch, no mutations
# Or warns when you try to resubmit POST form—POST isn't idempotent, resubmitting might duplicate
# Or changes POST to GET on redirects (historical)—breaking POST semantics
# These behaviors assume correct method usage—break the contract, break the web
```

---

### 33) Method Choice Is Architecture (Line ~432)

**Context:** Choosing correctly enables safe retries, resilience, caching, scale; choosing incorrectly works in dev, breaks in prod.

```python
# Choosing methods correctly:
# - Enables safe retries
# - Enables resilience
# - Enables caching
# - Enables scale

# Choosing incorrectly:
# - Works in development
# - Breaks in production

# Example:
# ESP32 uses GET /api/temp to send temperature readings
# Works in development—Pi processes it
# Breaks in production—caches cache mutations, retries duplicate readings, proxies retry automatically
# Or uses POST /api/temp correctly—works in development and production
# Method choice is architecture—it determines how system behaves under failure
```

---

### 34) Common Anti-Patterns (Line ~447)

**Context:** Using GET to trigger actions, POST for updates, POST everywhere "because it works", ignoring idempotency.

```python
# Common anti-patterns:
# - Using GET to trigger actions
# - Using POST for updates
# - Using POST everywhere "because it works"
# - Ignoring idempotency

# These are failure multipliers
```

---

### 35) Method + Status Code = Full Meaning (Line ~456)

**Context:** POST + 201 = created; PUT + 204 = replaced; DELETE + 404 = already gone; clients interpret both.

```python
# Method alone is not enough
# - POST + 201 = created (ESP32 creates sensor)
# - PUT + 204 = replaced (dashboard updates config)
# - DELETE + 404 = already gone (sensor already deleted)

# Clients interpret both

# Example:
# ESP32 sends POST /api/sensors, gets 201 Created—sensor created, check Location header
# Or dashboard sends PUT /api/config, gets 204 No Content—config replaced, no body
# Or sends DELETE /api/sensors/old_id, gets 404 Not Found—already gone, idempotent success
# Method + status code = full meaning
```

---

### 36) Methods Are Not Permissions (Line ~469)

**Context:** Methods express intent, not authorization; GET may still be forbidden, DELETE may be denied.

```python
# Methods express intent, NOT authorization
# - GET may still be forbidden
# - DELETE may be denied
# - POST may require authentication

# Permissions live elsewhere

# Example:
# ESP32 sends GET /api/admin/users—GET expresses intent (retrieve)
# But Pi responds 403 Forbidden—you don't have permission
# Or sends DELETE /api/config—DELETE expresses intent (remove)
# But Pi responds 401 Unauthorized—you're not authenticated
# Methods express intent, permissions control access
```

---

### 37) Methods Do Not Enforce Behavior (Line ~480)

**Context:** HTTP doesn't prevent mutating on GET, creating on PUT, deleting on POST; protocol trusts you.

```python
# HTTP does NOT prevent you from:
# - Mutating on GET
# - Creating on PUT
# - Deleting on POST

# The protocol trusts you
# That trust is easy to violate

# Example:
# Pi could implement GET /api/reboot that actually reboots the server—HTTP doesn't prevent this
# Or implement PUT /api/sensors that creates a sensor—HTTP allows this
# Protocol trusts you to honor method semantics
# Violate that trust, and caches, proxies, and clients break
# Discipline matters
```

---

### 38) Why Discipline Matters (Line ~494)

**Context:** HTTP is simple because it assumes discipline; when discipline breaks, clients/caches/retries break.

```python
# HTTP is simple because it assumes discipline

# When that discipline breaks:
# - Clients break
# - Caches break
# - Retries break
# - Systems rot

# Example:
# Pi implements GET /api/increment that increments a counter
# Works in development—counter increments
# Breaks in production—caches cache mutations, retries increment multiple times, proxies retry automatically
# Discipline breaks, everything breaks
# HTTP is simple because it assumes discipline—honor the contract
```

---

### 39) Methods and Mental Models (Line ~507)

**Context:** Think in verbs: GET="show me", POST="do this", PUT="make it exactly this", PATCH="change this part", DELETE="remove it".

```python
# Think in verbs:
# - GET → "Show me"
# - POST → "Do this"
# - PUT → "Make it exactly this"
# - PATCH → "Change this part"
# - DELETE → "Remove it"

# If that sentence feels wrong, the method is wrong
```

---

### 40) Method Choice Checklist (Line ~519)

**Context:** Before choosing method, ask: does this change state? Safe to retry? Who controls ID? Can be cached? What on timeout?

```python
# Before choosing a method, ask:
# - Does this change state?
# - Is it safe to retry?
# - Who controls the resource ID?
# - Can this be cached?
# - What happens on timeout?

# The method encodes your answers

# Example: ESP32 wants to send temperature reading
# Does it change state? Yes—creates a reading
# Safe to retry? No—might duplicate
# Who controls ID? Server
# Can it be cached? No
# What happens on timeout? Dangerous—might duplicate
# Answer: POST /api/temp—not idempotent, server assigns ID, handle timeouts carefully
```

---

### Reflection: Method Analysis (Line ~533)

**Context:** Fetch sensor data = GET, submit reading = POST, update threshold = PATCH, delete config = DELETE; what if timeout?

```python
# You fetch sensor data. Which method and why?
# → GET /api/voltage. GET is safe and idempotent—safe to retry if timeout.

# You submit a new reading. Which method and why?
# → POST /api/temp. POST creates data, not idempotent—dangerous to retry.

# You update a threshold. Which method and why?
# → PATCH /api/config with {"voltage_threshold": 12.1}. Partial update, can be idempotent if designed correctly.

# You delete a configuration. Which method and why?
# → DELETE /api/sensors/old_id. DELETE is idempotent—safe to retry if timeout.

# What happens if request times out?
# GET → safe to retry, no side effects
# POST → dangerous to retry, might duplicate
# PATCH → depends on operation (set vs increment)
# DELETE → safe to retry, idempotent
```

---

## Chapter 2.14: Safety and Idempotency

### 1) Why These Concepts Exist at All (Line ~19)

**Context:** HTTP designed for unreliable networks; packets drop, connections reset; safety and idempotency make systems survivable.

```python
# HTTP was designed for unreliable networks

# Packets drop. Connections reset. Servers crash. Clients disappear mid-request.

# The protocol does NOT guarantee:
# - That a request arrives once
# - That a response arrives at all
# - That a request is not duplicated

# Safety and idempotency exist to make systems survivable under those conditions
```

---

### 2) Safety and Idempotency Are Different (Line ~33)

**Context:** Safety = does this change state? Idempotency = what happens if this happens again? Different properties.

```python
# These two ideas are often confused. They are NOT the same.
# - Safety answers: Does this request change state?
# - Idempotency answers: What happens if this request happens again?

# A method can be:
# - Safe and idempotent (GET)
# - Unsafe and idempotent (PUT, DELETE)
# - Unsafe and non-idempotent (POST)

# Understanding the difference is critical

# Example:
# Dashboard sends GET /api/voltage—safe (no state change) and idempotent (same result if repeated)
# Or sends PUT /api/config—unsafe (changes state) but idempotent (same result if repeated)
# Or sends POST /api/temp—unsafe (changes state) and NOT idempotent (different result if repeated)
# Different properties, different retry behavior
```

---

### 3) Safe Methods: No Side Effects (Line ~49)

**Context:** Safe method doesn't change server state; doesn't create, modify, delete; observational only.

```python
# Safe method does NOT change server state

# Calling it:
# - Does not create
# - Does not modify
# - Does not delete

# Safe methods are observational only

# Example:
# ESP32 sends GET /api/voltage—reads voltage, no sensor created, no config modified, no resource deleted
# Observational only
# Contrast with POST /api/temp—creates a temperature reading, changing server state. Not safe.
```

---

### 4) Which Methods Are Safe (Line ~63)

**Context:** Safe methods: GET, HEAD, OPTIONS; they exist to read, not act.

```python
# Safe methods include:
# - GET (e.g., GET /api/voltage)
# - HEAD (e.g., HEAD /api/config—check if exists without body)
# - OPTIONS (e.g., OPTIONS /api/sensors—check allowed methods)

# They exist to read, not act

# Example:
# Dashboard sends GET /api/voltage—safe, reads voltage
# Or sends HEAD /api/config—safe, checks if config exists without fetching body
# Or sends OPTIONS /api/sensors—safe, checks what methods are allowed
# All are observational, no mutations
```

---

### 5) What "No Side Effects" Really Means (Line ~75)

**Context:** No persistent state change, no mutation, no counters incremented; logging is fine, changing app state is not.

```python
# "No side effects" means:
# - No persistent state change
# - No mutation of resources
# - No counters incremented
# - No logs written as a consequence of the request itself

# Logging the request is fine
# Changing application state is NOT

# Example:
# ESP32 sends GET /api/voltage
# Pi may log "ESP32 requested voltage"—that's fine, logging is acceptable
# But if Pi increments "request_count" counter or updates "last_read" timestamp
# → That's a side effect, GET is no longer safe
# Safe means no application state change, not no logging
```

---

### 6) Why Safety Matters So Much (Line ~89)

**Context:** Safe methods may be automatically retried, prefetched, crawled, cached, replayed; side effects happen unexpectedly.

```python
# Because safe methods may be:
# - Automatically retried
# - Prefetched by browsers
# - Crawled by search engines
# - Cached aggressively
# - Replayed by proxies

# If a safe method has side effects, those effects may happen unexpectedly

# Example:
# Dashboard sends GET /api/voltage, times out
# HTTP library automatically retries—GET is safe, retries are fine
# Or browser prefetches GET /api/config links—safe to prefetch, no mutations
# But if GET /api/reboot actually reboots the Pi, retries and prefetching cause multiple reboots
# Unexpected side effects. Safety matters because safe methods are trusted to be harmless.
```

---

### 7) The GET Trap (Line ~103)

**Context:** If GET changes state: reloading page mutates data, crawlers trigger actions, prefetching causes writes, caching breaks.

```python
# If GET changes state:
# - Reloading a page mutates data
# - Crawlers trigger actions
# - Prefetching causes writes
# - Caching breaks correctness

# This is one of the most common HTTP mistakes

# Example:
# Pi implements GET /api/increment_counter that increments a counter
# Dashboard reloads the page—counter increments
# A crawler visits—counter increments
# Browser prefetches—counter increments
# Caches cache mutations—everything breaks
# This is the GET trap—using GET for mutations breaks the web
# Use POST or PATCH instead
```

---

### 8) Unsafe Methods: Side Effects Allowed (Line ~116)

**Context:** Unsafe methods may change state: POST, PUT, PATCH, DELETE; calling them has consequences.

```python
# Unsafe methods may change state

# These include:
# - POST (e.g., POST /api/temp—creates reading)
# - PUT (e.g., PUT /api/config—replaces config)
# - PATCH (e.g., PATCH /api/config—updates config)
# - DELETE (e.g., DELETE /api/sensors/old_id—removes sensor)

# Calling them has consequences

# Example:
# ESP32 sends POST /api/temp—creates temperature reading, state changes
# Or dashboard sends PUT /api/config—replaces entire config, state changes
# Or sends DELETE /api/sensors/old_id—removes sensor, state changes
# Unsafe methods have consequences—they mutate state
```

---

### 9) Unsafe Does Not Mean "Bad" (Line ~132)

**Context:** Unsafe means "this request may change something"; doesn't mean dangerous, forbidden, unreliable.

```python
# Unsafe means:
# "This request may change something."

# It does NOT mean:
# - The request is dangerous
# - The request is forbidden
# - The request is unreliable

# It means: do not assume this can be repeated safely
```

---

### 10) Why Browsers Treat Unsafe Methods Carefully (Line ~145)

**Context:** Browsers warn on resubmitting POST, don't prefetch POST, require user intent; assume consequences.

```python
# Browsers:
# - Warn on resubmitting POST
# - Do NOT prefetch POST
# - Require user intent

# They assume unsafe methods have consequences

# Example:
# Dashboard submits form with POST /api/sensors
# Browser warns "Are you sure you want to resubmit?"—POST has consequences
# Or browser doesn't prefetch POST links—unsafe methods aren't prefetched
# Browsers assume unsafe methods have consequences—they require explicit user intent, not automatic behavior
```

---

### 11) Idempotency: Same Effect, No Matter How Many Times (Line ~159)

**Context:** Idempotent operation produces same result whether run once or many times; "same result" = same final state.

```python
# Idempotent operation produces same result whether it runs once or many times

# Important:
# - "Same result" means same final state
# - It does NOT mean the response is identical
# - It does NOT mean no work happens
```

---

### 12) Idempotency Is About Final State (Line ~169)

**Context:** PUT resource twice: server may write to disk twice, log twice, but final state is identical; that's idempotent.

```python
# Example:
# - PUT /resource with value X
# - PUT /resource with value X again

# Server may:
# - Write to disk twice
# - Log twice
# - Do work twice

# But the final state is identical

# That's idempotent
```

---

### 13) Which Methods Are Idempotent (Line ~185)

**Context:** Idempotent: GET, PUT, DELETE, HEAD, OPTIONS; PATCH may be; POST is not.

```python
# Idempotent methods include:
# - GET (e.g., GET /api/voltage—same result if repeated)
# - PUT (e.g., PUT /api/config—same final state if repeated)
# - DELETE (e.g., DELETE /api/sensors/old_id—same final state if repeated)
# - HEAD (e.g., HEAD /api/config—same result if repeated)
# - OPTIONS (e.g., OPTIONS /api/sensors—same result if repeated)

# PATCH may be idempotent—depending on operation:
# - PATCH /api/config with {"voltage_threshold": 12.1}—idempotent
# - PATCH /api/stats with {"increment": 1}—NOT idempotent

# POST is NOT idempotent (e.g., POST /api/temp—creates new reading each time)
```

---

### 14) GET Is Idempotent and Safe (Line ~199)

**Context:** GET: no state change, repeating does nothing new; this is why GET is so powerful.

```python
# GET is idempotent and safe:
# - No state change
# - Repeating it does nothing new

# This is why GET is so powerful

# Example:
# ESP32 sends GET /api/voltage once—no state change, reads voltage
# Sends it ten times—still no state change, reads voltage ten times
# GET is both safe (no mutations) and idempotent (same result if repeated)
# This is why GET is so powerful—it can be retried, cached, prefetched, crawled, all without side effects
```

---

### 15) PUT Is Idempotent but Unsafe (Line ~209)

**Context:** PUT changes state but repeating yields same state; makes PUT safe to retry after failures.

```python
# PUT:
# - Changes state
# - But repeating it yields the same state

# This makes PUT safe to retry after failures

# Example:
# Dashboard sends PUT /api/config with {"voltage_threshold": 12.1}
# PUT changes state (config is updated), but it's idempotent
# Sending same PUT again yields same final state
# This makes PUT safe to retry after failures—if PUT times out, retrying with same body is safe
# Unsafe (mutates state) but idempotent (same final state)
```

---

### 16) DELETE Is Idempotent but Unsafe (Line ~219)

**Context:** DELETE removes resource; removing again changes nothing; deleting twice same as deleting once.

```python
# DELETE:
# - Removes a resource
# - Removing it again changes nothing

# Deleting twice is the same as deleting once

# Example:
# Dashboard sends DELETE /api/sensors/old_id once—sensor removed
# Sends it again—sensor already gone, same final state
# DELETE is idempotent—deleting twice is the same as deleting once
# This makes DELETE safe to retry after failures—if DELETE times out, retrying is safe
# Unsafe (mutates state) but idempotent (same final state)
```

---

### 17) PATCH Is Conditionally Idempotent (Line ~230)

**Context:** PATCH depends on what patch does; "set to 12.1" = idempotent; "increment by 1" = not idempotent.

```python
# PATCH depends on what the patch does

# Idempotent patch:
# - "Set threshold to 12.1"

# Non-idempotent patch:
# - "Increment counter by 1"

# Same method. Different semantics.
```

---

### 18) POST Is Not Idempotent (Line ~244)

**Context:** POST submits work, creates resources, triggers actions; two POSTs may create two records, trigger two jobs.

```python
# POST:
# - Submits work
# - Creates resources
# - Triggers actions

# Two identical POSTs may:
# - Create two records (ESP32 registers sensor twice)
# - Trigger two jobs (solar logger processes readings twice)
# - Charge twice (payment processing)

# This is intentional

# Example:
# ESP32 sends POST /api/sensors twice
# Two sensor records are created—this is intentional
# POST is not idempotent—two identical POSTs may create two resources
```

---

### 19) Why POST Exists Anyway (Line ~261)

**Context:** Sometimes you don't know resource ID yet, action is one-time, you're submitting work not state; POST is for commands.

```python
# Because sometimes:
# - You don't know the resource ID yet
# - The action is inherently one-time
# - You're submitting work, not state

# POST is for commands, not state replacement
```

---

### 20) Retries Are the Real Problem (Line ~270)

**Context:** Danger isn't POST itself; danger is retries; when failures happen, retries duplicate POST effects.

```python
# The danger is NOT POST itself
# The danger is retries

# Example:
# ESP32 sends POST /api/temp and it succeeds—no problem
# Or sends POST /api/temp and times out, then retries—might create duplicate readings
# POST itself isn't dangerous—retries are
# When failures happen (timeouts, connection drops), retries duplicate POST effects
# That's why idempotency matters—it makes retries safe
```

---

### 21) Why Retries Happen (Line ~281)

**Context:** Response timed out, connection dropped, client crashed, server restarted, network partitioned; client doesn't know if server processed.

```python
# Retries happen because:
# - Response timed out
# - Connection dropped
# - Client crashed
# - Server restarted
# - Network partitioned

# Client does NOT know whether server processed the request

# Example:
# ESP32 sends POST /api/temp, times out after 30 seconds
# Did Pi receive it? Process it? Unknown
# Or dashboard sends PUT /api/config, connection drops mid-transfer
# Did Pi receive it? Unknown
# Retries happen because failures are ambiguous—client doesn't know what happened
# Idempotency makes retries safe
```

---

### 22) The "Did It Happen?" Problem (Line ~295)

**Context:** After timeout, three possibilities: server never got it, server got but didn't finish, server finished but response lost.

```python
# After a timeout, the client asks:
# "Did the server receive my request or not?"

# There are only three possibilities:
# 1. Server never got it
# 2. Server got it but didn't finish
# 3. Server finished but the response was lost

# HTTP gives no built-in answer
```

---

### 23) Why Idempotency Solves This (Line ~309)

**Context:** If operation idempotent: retry is safe, final state is correct; if not, retry may duplicate effects.

```python
# If operation is idempotent:
# - Retry is safe
# - Final state is correct

# If not:
# - Retry may duplicate effects

# Example:
# Dashboard sends PUT /api/config with {"voltage_threshold": 12.1}, times out
# PUT is idempotent—retry is safe
# Whether Pi received it or not, retrying yields same final state (threshold is 12.1)

# Or sends POST /api/temp, times out
# POST is NOT idempotent—retry may duplicate effects
# If Pi already processed it, retrying creates a duplicate reading
# Idempotency solves the "did it happen?" problem
```

---

### 24) Automatic Retries in the Real World (Line ~324)

**Context:** Retries triggered by HTTP client libraries, load balancers, reverse proxies, gateways, mobile SDKs; even if you don't retry, something might.

```python
# Retries may be triggered by:
# - HTTP client libraries
# - Load balancers
# - Reverse proxies
# - Gateways
# - Mobile SDKs

# Even if YOU don't retry, something else might
```

---

### 25) POST + Retry = Duplicate Risk (Line ~335)

**Context:** POST /orders, timeout, retry = two orders created; nothing "went wrong" at protocol level.

```python
# This is why POST is dangerous under failure

# Example:
# - POST /orders
# - Timeout
# - Retry
# - Two orders created

# Nothing "went wrong" at the protocol level
```

---

### 26) Designing POST Safely (Line ~349)

**Context:** Design POST endpoints with retries in mind: idempotency keys, client-generated IDs, deduplication windows.

```python
# You must design POST endpoints with retries in mind

# Common strategies:
# - Idempotency keys (e.g., Idempotency-Key: esp32-temp-2024-01-30-12:34:56)
# - Client-generated IDs (e.g., POST /api/readings with {"id": "reading-123", ...})
# - Deduplication windows (e.g., reject duplicate requests within 5 minutes)
# - Explicit retry tokens (e.g., Retry-Token: abc123)

# Example:
# ESP32 sends POST /api/temp with header Idempotency-Key: esp32-temp-2024-01-30-12:34:56
# If it times out and retries with same key
# Pi recognizes duplicate and returns original response instead of creating new reading
# POST becomes effectively idempotent through idempotency keys
```

---

### 27) Idempotency Keys (Line ~361)

**Context:** Client-generated unique identifier sent with request; server records key, rejects or reuses duplicates.

```python
# Idempotency key is:
# - A client-generated unique identifier
# - Sent with the request (usually a header)

# Server:
# - Records the key
# - Rejects or reuses duplicate requests with the same key

# Example:
# ESP32 sends POST /api/temp with header Idempotency-Key: esp32-temp-2024-01-30-12:34:56
# Pi records the key and creates the reading
# If ESP32 retries with same key, Pi recognizes duplicate and returns original 201 Created response
# The key makes POST effectively idempotent
```

---

### 28) Idempotency Keys Are Not Magic (Line ~374)

**Context:** Keys require storage, expiration policies, consistent behavior; but they turn POST into effectively idempotent.

```python
# Idempotency keys require:
# - Storage (database to store keys and responses)
# - Expiration policies (expire keys after 24 hours)
# - Consistent behavior (same key always returns same response)

# But they turn POST into effectively idempotent

# Example:
# Pi stores idempotency keys in database with expiration (keys expire after 24 hours)
# When ESP32 retries with same key, Pi looks it up, finds original response, returns it
# This requires storage and consistent behavior—but it turns POST into effectively idempotent
# Not magic, but effective
```

---

### 29) Why PUT Often Beats POST (Line ~388)

**Context:** If client can choose resource ID, PUT is safer, retry-friendly, avoids duplication; POST often used out of habit.

```python
# If the client can choose the resource ID:
# - PUT is safer
# - PUT is retry-friendly
# - PUT avoids duplication

# POST is often used out of habit, not necessity

# Example:
# Dashboard creates sensor with known ID: PUT /api/sensors/manual_sensor_1 with full config
# PUT is idempotent—creating it twice yields same result
# Or ESP32 registers itself without knowing its ID: POST /api/sensors, let Pi assign ID
# If client can choose ID, PUT is safer—it's idempotent by design, no idempotency keys needed
```

---

### 30) Safety vs Idempotency Matrix (Line ~398)

**Context:** GET: safe+idempotent; HEAD/OPTIONS: safe+idempotent; PUT/DELETE: unsafe+idempotent; PATCH: unsafe+depends; POST: unsafe+not idempotent.

```python
# Safety vs Idempotency Matrix:

# Method   Safe   Idempotent
# GET      Yes    Yes (e.g., GET /api/voltage)
# HEAD     Yes    Yes
# OPTIONS  Yes    Yes
# PUT      No     Yes (e.g., PUT /api/config)
# DELETE   No     Yes (e.g., DELETE /api/sensors/old_id)
# PATCH    No     Depends (e.g., PATCH /api/config—depends on operation)
# POST     No     No (e.g., POST /api/temp)

# This table explains most HTTP bugs

# Example:
# ESP32 uses GET /api/voltage—safe and idempotent, retry freely
# Or uses PUT /api/config—unsafe but idempotent, safe to retry
# Or uses POST /api/temp—unsafe and not idempotent, dangerous to retry
```

---

### 31) Safety Is About Observation (Line ~416)

**Context:** Safe methods observe, inspect, query; should be invisible to system's evolution.

```python
# Safe methods:
# - Observe
# - Inspect
# - Query

# They should be invisible to the system's evolution
```

---

### 32) Idempotency Is About Recovery (Line ~428)

**Context:** Idempotent methods survive retries, tolerate duplication, enable resilience; make failure survivable.

```python
# Idempotent methods:
# - Survive retries
# - Tolerate duplication
# - Enable resilience

# They make failure survivable

# Example:
# Dashboard sends PUT /api/config, times out
# PUT is idempotent—retrying survives the failure, tolerates duplication (same PUT twice = same result), enables resilience
# Or sends DELETE /api/sensors/old_id, times out
# DELETE is idempotent—retrying survives the failure
# Idempotency is about recovery—making failures survivable through safe retries
```

---

### 33) Safety Is About Trust (Line ~439)

**Context:** Web assumes GET is harmless, links are safe, crawling won't destroy data; break trust and everything breaks.

```python
# The web assumes:
# - GET is harmless
# - Links are safe
# - Crawling won't destroy data

# Break that trust and everything else breaks too
```

---

### 34) Idempotency Is About Uncertainty (Line ~449)

**Context:** Distributed systems assume messages may be duplicated, responses lost, timeouts ambiguous; idempotency is how we live with that.

```python
# Distributed systems assume:
# - Messages may be duplicated
# - Responses may be lost
# - Timeouts are ambiguous

# Idempotency is how we live with that

# Example:
# ESP32 sends POST /api/temp and:
# - Message might be duplicated (network retransmission)
# - Response might be lost (connection drop)
# - Timeout is ambiguous (did Pi receive it?)
# Idempotency is how we live with that uncertainty
# If operations are idempotent, duplication and ambiguity don't break correctness
# Idempotency makes uncertainty survivable
```

---

### 35) Why These Are Invariants (Line ~462)

**Context:** These rules are not conventions; they're assumptions baked into browsers, proxies, caches, CDNs, APIs, tooling.

```python
# These rules are NOT conventions
# They are assumptions baked into the ecosystem:
# - Browsers
# - Proxies
# - Caches
# - CDNs
# - APIs
# - Tooling

# You violate them at your own risk

# Example:
# Browsers assume GET is safe—they prefetch GET links
# Proxies assume idempotent methods are retry-safe—they retry GET, PUT, DELETE automatically
# Caches assume GET doesn't mutate—they cache GET responses
# If you violate these invariants (e.g., GET mutates state), browsers, proxies, and caches break
# These are invariants—violate them at your own risk
```

---

### 36) The Cost of Ignoring Them (Line ~479)

**Context:** Ignoring leads to duplicate data, inconsistent state, phantom actions, impossible debugging, fragile systems.

```python
# Ignoring safety and idempotency leads to:
# - Duplicate data (ESP32 retries POST, creates duplicate readings)
# - Inconsistent state (GET mutates state, caches break)
# - Phantom actions (crawlers trigger mutations)
# - Impossible debugging ("why did this happen twice?")
# - Fragile systems (breaks under retries, failures)

# Usually discovered too late

# Example:
# ESP32 uses GET /api/increment that increments a counter
# Works in development—counter increments
# Breaks in production—browsers prefetch, crawlers index, caches cache mutations
# Duplicate data, inconsistent state, phantom actions, impossible debugging, fragile systems
# Usually discovered too late—after production deployment
```

---

### 37) The Mental Model (Line ~493)

**Context:** Before choosing method, ask: observational or mutational? Can be retried safely? What if runs twice? What if response lost?

```python
# Before choosing a method, ask:
# - Is this observational or mutational?
# - Can it be retried safely?
# - What happens if it runs twice?
# - What happens if the response is lost?

# The method should encode the answer

# Example: ESP32 wants to send temperature reading
# Observational or mutational? Mutational—creates a reading
# Can it be retried safely? No—might duplicate
# What happens if it runs twice? Two readings created
# What happens if response is lost? Unknown if reading was created
# Answer: POST /api/temp—not idempotent, handle retries carefully
```

---

### 38) Phase 0 Revisited (Line ~506)

**Context:** This chapter is Phase 0 applied to HTTP: invariants must hold, failure is normal, boundaries matter, absence ≠ error.

```python
# This chapter is Phase 0 applied to HTTP:
# - Invariants must hold (GET must not mutate state)
# - Failure is normal (ESP32 timeouts, Pi crashes)
# - Boundaries matter (HTTP vs transport failures)
# - Absence ≠ error (timeout vs 500)
# - Retries are reality (automatic retries by libraries, proxies)

# HTTP methods exist to encode those truths

# Example:
# ESP32 sends GET /api/voltage—invariant: GET must not mutate state
# Or times out—failure is normal, retries are reality
# HTTP methods encode these truths—safety and idempotency make systems survivable
```

---

### Reflection: Safety and Idempotency Analysis (Line ~520)

**Context:** Send POST to create order, timeout, retry—how many orders exist now? If "I don't know," design is incomplete.

```python
# You send POST to create an order
# Request times out
# You retry

# How many orders exist now?

# If the answer is "I don't know," your design is incomplete
```

---

## Chapter 2.15: Headers — Overview and Purpose

### 1) What Headers Actually Are (Line ~15)

**Context:** Headers are key-value metadata; describe body, control behavior, carry credentials, enable caching, signal capabilities.

```python
# Headers are key–value metadata attached to a request or response

# They:
# - Describe the body (Content-Type: application/json)
# - Control behavior (Cache-Control: no-cache)
# - Carry credentials (Authorization: Bearer xyz)
# - Enable caching (ETag: "abc123")
# - Signal capabilities (Accept: application/json)
# - Negotiate formats (Accept-Language: en)
# - Encode constraints (If-None-Match: "abc123")

# They do NOT replace the body
# They frame the body

# Example: ESP32 sends POST /api/temp with body {"temp": 72.5} and headers:
# Content-Type: application/json, Content-Length: 15, Authorization: Bearer xyz
# Headers frame the body—describe it (JSON), control behavior (15 bytes), carry credentials (auth token)
```

---

### 2) Headers Live at the Boundary (Line ~34)

**Context:** Headers are part of boundary between client and server; untrusted input; treat as "data from something outside my control."

```python
# Phase 0.8: boundaries are where validation lives

# In HTTP:
# - Request crosses from client → server
# - Headers are part of that boundary
# - They are untrusted input

# Every header must be treated as:
# "Data supplied by something outside my control."
```

---

### 3) Headers Are Not Payload (Line ~48)

**Context:** Body is payload; headers describe how to interpret payload and modify exchange behavior.

```python
# Headers are NOT the message itself
# - Body is the payload
# - Headers describe how to interpret the payload
# - Headers modify how the exchange behaves

# Confusing headers with body data leads to broken designs

# Example: ESP32 sends POST /api/temp with:
# Body: {"temp": 72.5, "sensor_id": "esp32_coop"}
# Header: Content-Type: application/json
# Body is the payload (temperature data), header describes how to interpret it (JSON)
# Don't put {"temp": 72.5} in a header—that's payload, not metadata
# Headers are control, body is content
```

---

### 4) Headers Exist Because HTTP Is Generic (Line ~60)

**Context:** HTTP doesn't know what data means, what format, how to cache, who can see; headers provide that context.

```python
# HTTP does NOT know:
# - What your data means
# - What format it is
# - How it should be cached
# - Who is allowed to see it

# Headers provide that context

# Without headers, HTTP would be uselessly vague

# Example: ESP32 sends POST /api/temp with body {"temp": 72.5}
# HTTP doesn't know what this means—is it JSON? XML? Plain text?
# How should it be cached? Who's allowed to see it?
# Headers provide context:
# Content-Type: application/json (format)
# Cache-Control: no-cache (caching)
# Authorization: Bearer xyz (permissions)
# Without headers, HTTP is uselessly vague
```

---

### 5) Request Headers vs Response Headers (Line ~75)

**Context:** Request headers: client → server (Authorization, Accept); response headers: server → client (Set-Cookie, Location).

```python
# Headers mean different things depending on direction
# - Request headers: client → server (Authorization, Accept)
# - Response headers: server → client (Set-Cookie, Location)

# Some headers valid in both directions (Content-Type, Content-Length)
# Some are not (Authorization is request-only, Set-Cookie is response-only)

# Example:
# ESP32 sends GET /api/voltage with Accept: application/json (request header—client preference)
# Pi responds with Content-Type: application/json (response header—server description)
# Or both use Content-Type—request describes what you're sending, response describes what you're returning
# Direction matters
```

---

### 6) Request Headers: Client Intent and Capabilities (Line ~87)

**Context:** Request headers communicate who client is, what it accepts, how server should behave, what credentials it presents.

```python
# Request headers typically communicate:
# - Who the client is (User-Agent: ESP32-Sensor/1.0)
# - What it can accept (Accept: application/json)
# - How it wants server to behave (Cache-Control: no-cache)
# - What credentials it presents (Authorization: Bearer xyz)
# - How the request should be handled (Connection: keep-alive)

# They express intent, not truth

# Example: ESP32 sends GET /api/voltage with:
# User-Agent: ESP32-Sensor/1.0 (who I am)
# Accept: application/json (what I can accept)
# Authorization: Bearer xyz (credentials I present)
# These express intent—ESP32 wants JSON, claims to be ESP32-Sensor/1.0, presents a token
# But they're not truth—validate everything, don't trust blindly
```

---

### 7) Common Request Headers (Line ~101)

**Context:** Host, User-Agent, Accept, Authorization, Content-Type, Content-Length, Cookie; each exists for a reason.

```python
# Common request headers:
# - Host (Host: pi.local)
# - User-Agent (User-Agent: HomesteadDashboard/1.0)
# - Accept (Accept: application/json)
# - Authorization (Authorization: Bearer xyz)
# - Content-Type (Content-Type: application/json)
# - Content-Length (Content-Length: 24)
# - Cookie (Cookie: session=abc123)

# Each exists for a specific reason

# Example: ESP32 sends GET /api/voltage with:
# Host: pi.local, User-Agent: ESP32-Sensor/1.0, Accept: application/json
# These tell Pi who's asking, what format is acceptable, which host to route to
```

---

### 8) Response Headers: Server Description and Control (Line ~117)

**Context:** Response headers communicate what server returned, how to interpret, cache rules, state to store, what to do next.

```python
# Response headers typically communicate:
# - What server returned (Content-Type: application/json)
# - How to interpret it (Content-Length: 24)
# - Whether it may be cached (Cache-Control: max-age=60)
# - Whether client should store state (Set-Cookie: session=abc123)
# - What to do next (Location: /api/sensors/esp32_coop)

# They are instructions, NOT suggestions

# Example: Pi responds to GET /api/voltage with:
# Content-Type: application/json (what I returned)
# Content-Length: 24 (how to interpret it)
# Cache-Control: max-age=60 (cache for 60 seconds)
# ETag: "abc123" (use this for conditional requests)
# These are instructions—dashboard must obey them. Not suggestions—instructions.
```

---

### 9) Common Response Headers (Line ~131)

**Context:** Content-Type, Content-Length, Cache-Control, Set-Cookie, Location, ETag; clients expected to obey.

```python
# Common response headers:
# - Content-Type (Content-Type: application/json)
# - Content-Length (Content-Length: 24)
# - Cache-Control (Cache-Control: no-cache)
# - Set-Cookie (Set-Cookie: session=abc123)
# - Location (Location: /api/sensors/esp32_coop)
# - ETag (ETag: "abc123")

# Clients are expected to obey them

# Example: Pi responds to GET /api/voltage with:
# Content-Type: application/json, Content-Length: 24, Cache-Control: max-age=60
# Dashboard must obey these headers—parse JSON, read exactly 24 bytes, cache for 60 seconds
```

---

### 10) Some Headers Exist in Both Directions (Line ~146)

**Context:** Cache-Control, Content-Type, Content-Length, Connection apply symmetrically; meaning depends on direction.

```python
# Certain headers apply symmetrically

# Examples:
# - Cache-Control (request: client preferences; response: server instructions)
# - Content-Type (request: what you're sending; response: what you're returning)
# - Content-Length (request: body size you're sending; response: body size you're returning)
# - Connection (request: connection preferences; response: connection behavior)

# Meaning depends on direction

# Example:
# ESP32 sends POST /api/temp with Content-Type: application/json (request—what I'm sending)
# Pi responds with Content-Type: application/json (response—what I'm returning)
# Same header name, different direction, different meaning
```

---

### 11) Headers Are the Protocol's Extension Point (Line ~162)

**Context:** HTTP is conservative; new behavior added via headers; old clients ignore unknown headers, new clients opt in.

```python
# HTTP is deliberately conservative

# Instead of changing the core grammar:
# - New behavior is added via headers
# - Old clients can ignore unknown headers
# - New clients can opt into new features

# This is how HTTP evolves without breaking everything
```

---

### 12) Why Headers Beat New Syntax (Line ~172)

**Context:** Changing request line breaks parsers/proxies/caches; adding headers preserves compatibility, enables gradual adoption.

```python
# Changing the request line would:
# - Break parsers
# - Break proxies
# - Break caches

# Adding headers:
# - Preserves compatibility
# - Enables gradual adoption
# - Keeps the protocol stable

# Headers are evolutionary pressure relief

# Example:
# Adding idempotency keys via header Idempotency-Key: abc123 preserves compatibility
# Old clients ignore it, new clients use it
# Changing request line from GET /api/voltage HTTP/1.1 to GET /api/voltage HTTP/2.0 breaks everything
# Headers are evolutionary pressure relief—add features without breaking compatibility
```

---

### 13) Headers Are Case-Insensitive (Names Only) (Line ~192)

**Context:** Content-Type = content-type = CONTENT-TYPE; all equivalent; values may be case-sensitive depending on semantics.

```python
# Header names are case-insensitive:
# - Content-Type
# - content-type
# - CONTENT-TYPE

# All equivalent

# Header values may be case-sensitive depending on semantics

# Example:
# ESP32 sends content-type: application/json
# Pi receives it as Content-Type: application/json—same header, different casing, equivalent
# Or CONTENT-TYPE: application/json—still equivalent
# But the value application/json is case-sensitive—Application/Json is different
# Header names are case-insensitive, values depend on semantics
```

---

### 14) Why Case-Insensitivity Matters (Line ~206)

**Context:** Different implementations format differently; humans type manually; proxies rewrite; protocol doesn't care about capitalization.

```python
# Because:
# - Different implementations format differently
# - Humans type them manually
# - Proxies rewrite them

# The protocol does NOT care about capitalization

# Example:
# ESP32 sends content-type: application/json (lowercase)
# Pi normalizes it to Content-Type: application/json (Title-Case)
# A proxy rewrites it to CONTENT-TYPE: application/json (uppercase)
# All equivalent—protocol doesn't care
# Case-insensitivity makes HTTP robust
```

---

### 15) Headers Are Line-Based Text (Line ~219)

**Context:** Each header is Name: value; one per line, colon separates, optional whitespace around value; simple by design.

```python
# Each header is:
# Name: value

# - One header per line
# - Colon separates name from value
# - Optional whitespace around the value

# Simple by design

# Example: ESP32 sends:
# Host: pi.local
# Content-Type: application/json
# Content-Length: 24

# One header per line, colon separates name from value. Simple by design.
```

---

### 16) Headers Are Parsed Before the Body (Line ~245)

**Context:** Server reads request line, then headers, then blank line, then decides how to read body; headers control body parsing.

```python
# The server:
# 1. Reads request line
# 2. Reads headers
# 3. Encounters blank line
# 4. Decides how (or whether) to read body

# Headers control body parsing

# Example:
# ESP32 sends POST /api/temp with headers Content-Type: application/json, Content-Length: 15
# Then blank line, then body {"temp": 72.5}
# Pi reads request line first, then headers, then blank line
# Then uses Content-Length: 15 to know exactly how many bytes to read
# Headers control body parsing—they tell server how to read body before body arrives
```

---

### 17) Content-Type: The Most Important Header (Line ~255)

**Context:** Content-Type answers "what does this body mean?"; without it, body is just bytes.

```python
# Content-Type answers one question:
# "What does this body mean?"

# Without it, the body is just bytes
```

---

### 18) Content-Length: How Much to Read (Line ~264)

**Context:** Content-Length tells receiver exactly how many bytes belong to body; without it, can't safely parse stream.

```python
# Content-Length tells the receiver:
# - Exactly how many bytes belong to the body

# Without it, receiver cannot safely parse the stream

# Example:
# ESP32 sends POST /api/temp with body {"temp": 72.5} and Content-Length: 15
# Pi reads exactly 15 bytes, then stops
# Without Content-Length, Pi doesn't know when body ends—does it wait for more? Does it hang?
# Content-Length makes streaming safe
```

---

### 19) Headers Enable Streaming Safety (Line ~274)

**Context:** HTTP rides on TCP, body is byte stream; headers tell where it ends; prevents hanging, truncation, confusion.

```python
# Because HTTP rides on TCP:
# - Body is a byte stream
# - Headers tell you where it ends

# This prevents:
# - Hanging reads
# - Truncated parsing
# - Protocol confusion

# Example:
# ESP32 sends POST /api/temp with Content-Length: 15 and body {"temp": 72.5}
# Pi reads exactly 15 bytes, then stops—knows body is complete
# Without Content-Length, Pi doesn't know when body ends
# Headers enable streaming safety—they tell you where the stream ends
```

---

### 20) Headers Can Be Forged (Line ~289)

**Context:** Clients control request headers; browsers can be spoofed; scripts can lie; headers are claims, not facts.

```python
# Never forget:
# - Clients control request headers
# - Browsers can be spoofed
# - Scripts can lie
# - Proxies can alter data

# Headers are claims—NOT facts

# Example:
# ESP32 sends User-Agent: ESP32-Sensor/1.0—but it could be lying, could be a script spoofing
# Or sends Authorization: Bearer valid_token—but it could be forged, could be stolen
# Headers are claims—not facts
# Validate everything, trust nothing
# Headers can be forged—treat them as untrusted input
```

---

### 21) Never Trust Headers Blindly (Line ~301)

**Context:** Validate presence, format, allowed values, consistency with other headers, consistency with body.

```python
# You must validate:
# - Presence (is Authorization present?)
# - Format (is Authorization: Bearer <token> format correct?)
# - Allowed values (is token valid? Not expired?)
# - Consistency with other headers (does Content-Type match Accept?)
# - Consistency with the body (does Content-Length match actual body size?)

# Headers are input

# Example:
# ESP32 sends Authorization: Bearer esp32_token_xyz
# Pi validates: is it present? Yes. Is format correct? Yes (Bearer <token>).
# Is token valid? Check database. Is token expired? Check timestamp.
# Headers are input—validate everything. Never trust headers blindly.
```

---

### 22) Host Header: Virtual Routing (Line ~315)

**Context:** Host tells server "which site am I trying to reach?"; without it, one IP can't host multiple sites; HTTP/1.1 requires it.

```python
# Host tells the server:
# "Which site am I trying to reach?"

# Without it:
# - One IP cannot host multiple sites
# - Virtual hosting breaks

# HTTP/1.1 requires it
```

---

### 23) User-Agent: Identity Without Authority (Line ~327)

**Context:** User-Agent describes client; helps debugging, analytics, sometimes triggers workarounds; never trust for security.

```python
# User-Agent describes the client

# It:
# - Helps debugging
# - Helps analytics
# - Sometimes triggers workarounds

# It should NEVER be trusted for security decisions

# Example:
# ESP32 sends User-Agent: ESP32-Sensor/1.0
# Pi logs this for debugging—"ESP32-Sensor/1.0 requested voltage"
# Or dashboard sends User-Agent: HomesteadDashboard/1.0
# Helps analytics—which clients are using your API?
# But never trust it for security—clients can lie
# User-Agent is descriptive, not authoritative
```

---

### 24) Accept: Client Preferences (Line ~343)

**Context:** Accept tells server "these formats are acceptable to me"; enables content negotiation, multiple representations.

```python
# Accept tells the server:
# "These formats are acceptable to me."

# It enables:
# - Content negotiation
# - Multiple representations
# - Graceful degradation
```

---

### 25) Authorization: Credentials at the Boundary (Line ~354)

**Context:** Authorization carries credentials: Basic, Bearer tokens, custom schemes; extremely sensitive header.

```python
# Authorization carries credentials

# Examples:
# - Basic (Authorization: Basic base64(username:password))
# - Bearer tokens (Authorization: Bearer xyz)
# - Custom schemes (Authorization: Custom scheme123)

# This header is extremely sensitive

# Example:
# ESP32 sends GET /api/sensors with Authorization: Bearer esp32_token_xyz
# Pi validates the token and allows access
# Or dashboard sends Authorization: Basic base64(admin:password)
# This header is extremely sensitive—it carries credentials
# Protect it, validate it, never log it
```

---

### 26) Headers Can Change Semantics Entirely (Line ~369)

**Context:** Same request line with different headers may authenticate or not, cache or not, return JSON or HTML.

```python
# Same request line with different headers may:
# - Authenticate or not (with/without Authorization)
# - Cache or not (with/without Cache-Control)
# - Return JSON or HTML (with Accept: application/json vs Accept: text/html)
# - Be accepted or rejected (with valid/invalid Authorization)

# Headers are NOT secondary—they are decisive

# Example:
# Dashboard sends GET /api/voltage with Accept: application/json—gets JSON
# Or sends same request with Accept: text/html—gets HTML
# Or with Authorization: Bearer xyz—authenticated
# Or without—401 Unauthorized
# Same request line, different headers, completely different semantics
# Headers are decisive—they change everything
```

---

### 27) Headers Enable Statelessness (Line ~381)

**Context:** HTTP is stateless because state is carried in headers: tokens, cookies, etags; server doesn't remember, you bring context.

```python
# HTTP is stateless because:
# - State is carried in headers
# - Tokens, cookies, etags, versions

# Server does NOT remember you—you bring context each time

# Example:
# ESP32 sends GET /api/sensors with:
# Authorization: Bearer esp32_token_xyz (token in header)
# Cookie: session=abc123 (session in header)
# If-None-Match: "etag123" (version in header)
# Pi doesn't remember the ESP32—ESP32 brings context each time via headers
# Headers enable statelessness—state is carried in headers, not server memory
```

---

### 28) Cookies Are Headers (Line ~392)

**Context:** Cookies are just headers: Set-Cookie (response), Cookie (request); not magic, just structured metadata.

```python
# Cookies are just headers:
# - Set-Cookie (response): Set-Cookie: session=abc123; Path=/
# - Cookie (request): Cookie: session=abc123

# They are NOT magic
# They are structured metadata

# Example:
# Pi responds to POST /api/login with Set-Cookie: session=abc123; Path=/; HttpOnly
# Dashboard stores this cookie
# Next request, dashboard sends Cookie: session=abc123
# Cookies are just headers—not magic, just structured metadata
# Set-Cookie sets state, Cookie carries state
```

---

### 29) Headers Control Caching (Line ~404)

**Context:** Caching behavior is almost entirely header-driven: Cache-Control, ETag, If-None-Match, Expires.

```python
# Caching behavior is almost entirely header-driven

# Examples:
# - Cache-Control (Cache-Control: max-age=60)
# - ETag (ETag: "abc123")
# - If-None-Match (If-None-Match: "abc123")
# - Expires (Expires: Wed, 31 Jan 2024 12:00:00 GMT)

# Without headers, caching would be unsafe

# Example:
# Pi responds to GET /api/voltage with Cache-Control: max-age=60, ETag: "abc123"
# Dashboard caches for 60 seconds
# Next request, dashboard sends If-None-Match: "abc123"
# Pi responds 304 Not Modified—use cache
# Headers control caching—without them, caching would be unsafe
```

---

### 30) Headers Control Redirection (Line ~419)

**Context:** Location tells client "go here instead"; status code tells why, header tells where.

```python
# Location tells the client:
# "Go here instead."

# The status code tells why
# The header tells where
```

---

### 31) Headers Control Connection Behavior (Line ~429)

**Context:** Connection, Keep-Alive tell intermediaries whether connection should persist, may be reused.

```python
# Connection, Keep-Alive, and related headers tell intermediaries:
# - Whether connection should persist (Connection: keep-alive)
# - Whether it may be reused (Keep-Alive: timeout=60)

# This matters for performance and correctness

# Example:
# ESP32 sends GET /api/voltage with Connection: keep-alive
# Pi keeps connection open for reuse
# Or sends Connection: close—close after this request
# Or Pi responds with Keep-Alive: timeout=60—reuse connection for 60 seconds
# Headers control connection behavior—persistence, reuse, timeouts
```

---

### 32) Headers Are Read by More Than Servers (Line ~441)

**Context:** Headers interpreted by browsers, proxies, load balancers, gateways, caches, firewalls; your server is not the only reader.

```python
# Headers are interpreted by:
# - Browsers (Set-Cookie → store cookie)
# - Proxies (Cache-Control → cache or not)
# - Load balancers (Host → route to server)
# - Gateways (Authorization → forward or reject)
# - Caches (ETag → cache validation)
# - Firewalls (User-Agent → allow or block)

# Your server is NOT the only reader

# Example:
# ESP32 sends GET /api/voltage with Host: pi.local
# A load balancer reads Host and routes to correct server
# Or a proxy reads Cache-Control and decides whether to cache
# Or a firewall reads User-Agent and decides whether to allow
# Your server is not the only reader—headers are interpreted by many intermediaries
```

---

### 33) Headers Must Be Designed for Intermediaries (Line ~455)

**Context:** If system breaks when proxy reorders/adds/removes headers or normalizes casing, design is brittle.

```python
# If your system breaks when a proxy:
# - Reorders headers
# - Adds headers
# - Removes headers
# - Normalizes casing

# Then the design is brittle

# Example:
# ESP32 sends GET /api/voltage with content-type: application/json (lowercase)
# A proxy normalizes it to Content-Type: application/json (Title-Case)
# Pi must handle both—if it breaks on casing differences, design is brittle
# Or a proxy reorders headers—Pi must handle any order
# Headers must be designed for intermediaries—they will modify headers, normalize them, reorder them
# Design defensively
```

---

### 34) Headers Can Be Repeated (Line ~469)

**Context:** Some headers may appear multiple times: Set-Cookie, Accept, Warning; must handle correctly.

```python
# Some headers may appear multiple times

# Examples:
# - Set-Cookie (Set-Cookie: session=abc123 and Set-Cookie: theme=dark)
# - Accept (Accept: application/json and Accept: text/plain—usually combined)
# - Warning (multiple warnings)

# You must handle this correctly

# Example:
# Pi responds to POST /api/login with Set-Cookie: session=abc123 and Set-Cookie: theme=dark
# Dashboard receives two cookies—must handle both
# Or ESP32 sends Accept: application/json and Accept: text/plain
# Usually combined into Accept: application/json, text/plain, but may appear separately
# Headers can be repeated—handle this correctly
```

---

### 35) Header Order Is Not Semantically Meaningful (Line ~484)

**Context:** Headers may be reordered, merged, split; never rely on order.

```python
# Headers:
# - May be reordered (proxy reorders Host and Accept)
# - May be merged (Accept: application/json and Accept: text/plain → Accept: application/json, text/plain)
# - May be split (long header value split across lines)

# Never rely on order

# Example:
# ESP32 sends Host: pi.local then Accept: application/json
# A proxy reorders to Accept: application/json then Host: pi.local
# Pi must handle both orders—never rely on order
# Or headers may be merged or split—handle all cases
# Header order is not semantically meaningful—don't rely on it
```

---

### 36) Headers Are Not Guaranteed to Be Present (Line ~495)

**Context:** Never assume header exists, is non-empty, is well-formed; missing headers are normal.

```python
# Never assume:
# - A header exists
# - A header is non-empty
# - A header is well-formed

# Missing headers are normal

# Example:
# ESP32 sends GET /api/voltage without Accept header
# Pi must handle this—missing headers are normal
# Or sends Authorization: (empty value)
# Or sends Authorization: invalid format
# Never assume headers exist, are non-empty, or are well-formed
# Missing headers are normal—design defensively
```

---

### 37) Headers Are Optional Unless Required (Line ~507)

**Context:** Some headers required by spec (Host in HTTP/1.1); most are optional; design defensively.

```python
# Some headers are required by spec:
# - Host in HTTP/1.1 (Host: pi.local)

# Most are optional

# Design defensively

# Example:
# ESP32 sends GET /api/voltage—must include Host: pi.local (required in HTTP/1.1)
# Or sends POST /api/temp—Content-Type is optional (but recommended)
# Content-Length is optional (but recommended), Authorization is optional (but may be required by your API)
# Most headers are optional—design defensively, handle missing headers gracefully
```

---

### 38) Headers vs Query Parameters (Line ~519)

**Context:** Headers are metadata, not part of resource identity; query parameters are part of URI, affect caching and routing.

```python
# Headers:
# - Are metadata
# - Are NOT part of resource identity

# Query parameters:
# - Are part of the URI
# - Often affect caching and routing

# Do not confuse them

# Example:
# Dashboard sends GET /api/voltage?unit=V with Accept: application/json
# Query parameter unit=V is part of the URI (resource identity)
# Header Accept is metadata (format preference)
# Or GET /api/voltage with Authorization: Bearer xyz
# Header Authorization is metadata (credentials), not part of resource identity
# Keep them separate
```

---

### 39) Headers vs Body Fields (Line ~534)

**Context:** Body fields belong to resource/command; headers belong to protocol exchange; keep boundary clean.

```python
# Body fields:
# - Belong to the resource or command

# Headers:
# - Belong to the protocol exchange

# Keep that boundary clean

# Example:
# ESP32 sends POST /api/temp with:
# Body: {"temp": 72.5, "sensor_id": "esp32_coop"}
# Header: Content-Type: application/json
# Body fields (temp, sensor_id) belong to the resource/command
# Header (Content-Type) belongs to the protocol exchange
# Keep that boundary clean—don't put resource data in headers, don't put protocol metadata in body
```

---

### 40) Headers Are Control, Not Content (Line ~546)

**Context:** If it describes format, permissions, caching, encoding, negotiation, it probably belongs in a header.

```python
# If it describes:
# - Format (Content-Type: application/json)
# - Permissions (Authorization: Bearer xyz)
# - Caching (Cache-Control: max-age=60)
# - Encoding (Content-Encoding: gzip)
# - Negotiation (Accept: application/json)

# It probably belongs in a header

# Example:
# ESP32 sends POST /api/temp with body {"temp": 72.5}
# Format? Content-Type: application/json (header)
# Permissions? Authorization: Bearer xyz (header)
# Caching? Cache-Control: no-cache (header)
# Body contains content (temp: 72.5), headers contain control (format, permissions, caching)
# Headers are control, not content
```

---

### 41) Headers Are the Web's Control Plane (Line ~560)

**Context:** Request line is what; body is data; headers are control; they orchestrate safety, performance, security, compatibility.

```python
# The request line is what
# The body is data
# Headers are control

# They orchestrate:
# - Safety
# - Performance
# - Security
# - Compatibility
```

---

### 42) Why Headers Are Hard to Learn (Line ~573)

**Context:** Numerous, interact subtly, effects are indirect, involve intermediaries; but they are unavoidable.

```python
# Because:
# - They are numerous (dozens of standard headers, plus custom ones)
# - They interact subtly (Cache-Control interacts with ETag, Expires)
# - Their effects are indirect (Accept affects response format, not directly visible)
# - They involve intermediaries (proxies, caches modify headers)

# But they are unavoidable

# Example:
# ESP32 sends GET /api/voltage with Accept: application/json, Cache-Control: no-cache, If-None-Match: "abc123"
# These headers interact subtly—Accept affects format, Cache-Control affects caching, If-None-Match affects conditional requests
# Their effects are indirect—you don't see them directly, but they control everything
# Headers are hard to learn but unavoidable
```

---

### 43) Headers Encode Assumptions (Line ~587)

**Context:** Every header says "I assume the other side understands this"; misaligned assumptions cause failure.

```python
# Every header says:
# "I assume the other side understands this."

# Misaligned assumptions cause failure
```

---

### 44) Phase 0 Revisited (Line ~595)

**Context:** This chapter is Phase 0.8 applied to HTTP: headers are boundary input, validate everything, absence is normal, failure must be handled.

```python
# This chapter is Phase 0.8 applied to HTTP:
# - Headers are boundary input (untrusted data from client)
# - Validate everything (format, presence, consistency)
# - Absence is normal (missing headers are expected)
# - Failure must be handled (invalid headers, malformed values)
# - Meaning lives in structure (Name: value format)

# Example:
# ESP32 sends Authorization: Bearer xyz—boundary input, validate it
# Or sends request without Accept—absence is normal, handle it
# Or sends Authorization: invalid format—failure must be handled
# Or sends Content-Type: application/json—meaning lives in structure (Name: value)
# Phase 0.8 applied to HTTP—headers are boundary input, validate everything
```

---

### Reflection: Headers Analysis (Line ~607)

**Context:** Which headers required? Which optional? Which affect behavior? Which ignored? Which must be validated?

```python
# Pick one HTTP exchange you've seen
# - Which headers are required? Host (HTTP/1.1)
# - Which are optional? Accept, User-Agent, Authorization (depends on your API)
# - Which affect behavior? Cache-Control, Accept, Authorization
# - Which are ignored? Unknown headers (extensibility)
# - Which must be validated? Authorization (credentials), Content-Length (body parsing)

# If you can answer that, you understand the boundary
```
