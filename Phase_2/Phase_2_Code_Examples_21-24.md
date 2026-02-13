# Phase 2 Code Examples (Chapters 21-24)

This file contains visual references for all code examples mentioned in Phase 2 chapters 21-24. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 2.21: Trust Boundaries and Security Surfaces

### 1) The HTTP Boundary Is Absolute (Line ~25)

**Context:** Everything that crosses the boundary is input from an untrusted source.

```python
# From the server's perspective:
# - The client is outside
# - The server is inside
# - Everything that crosses the line is input

# Pi receives a request
# Every header, cookie, path, method, and body byte came from the client

# ESP32 sensor node, dashboard browser, coop controller app
# All are on the other side of the boundary

# Everything arrives from the other side of the boundary
```

### 2) Input Is Not Just the Body (Line ~45)

**Context:** The entire request is data from an untrusted source.

```python
# Common beginner mistake:
# "The body is input. Headers are metadata."

# This is wrong

# In HTTP:
# - Headers are input
# - Cookies are input
# - Path is input
# - Query string is input
# - Method is input
# - Version is input

# Pi receives request with headers, cookies, path, query, method, body
# All are data from an untrusted source
```

### 3) Headers Are Client-Supplied Data (Line ~67)

**Context:** Every header in a request was sent by the client.

```python
# Every header in a request:
# - Was sent by the client
# - Can be altered by the client
# - Can be forged by the client

# There is no such thing as a "server-generated request header"

# Pi receives a request
# Every header was sent by the client
# Dashboard browser, ESP32 sensor node, coop controller app
# All send headers

# Pi cannot generate headers for incoming requests
```

### 4) User-Agent Is a Lie (Line ~81)

**Context:** User-Agent can be spoofed and should not be trusted.

```python
# The User-Agent header:
# - Claims what browser or client is being used
# - Is frequently spoofed
# - Is often meaningless

# Pi logs User-Agent for debugging
# But never uses it for authorization

# Attacker can send:
# User-Agent: "TrustedESP32"
# User-Agent: "AdminDashboard"

# Pi must not trust it
```

### 5) Referer Is Optional and Unreliable (Line ~96)

**Context:** Referer can be missing, truncated, or spoofed.

```python
# The Referer header:
# - May be missing
# - May be truncated
# - May be spoofed
# - May be intentionally suppressed

# Pi might check Referer to see where request came from
# But attacker can spoof or omit it

# Referer can help with debugging
# It cannot enforce security
```

### 6) X-Anything Means Nothing (Line ~111)

**Context:** Custom headers can be forged by any client.

```python
# Custom headers:
# X-User-Id: 42
# X-Admin: true
# X-Trusted: yes

# Mean nothing by themselves

# Any client can send them
# Any script can add them
# Any attacker can forge them

# Pi receives X-User-Id: 42 or X-Admin: true
# Any client can send these
# Dashboard, ESP32, or attacker's script can forge them
```

### 7) Headers Are Hints, Not Truth (Line ~129)

**Context:** Treat headers as hints, never as authority.

```python
# Treat headers as:
# - Hints
# - Suggestions
# - Context

# Never treat them as:
# - Authority
# - Identity
# - Permission

# Pi receives X-Admin: true
# Treat it as a hint at best
# Never as authority
```

### 8) Cookies Are Input Too (Line ~145)

**Context:** Cookies are client-controlled input, not trustworthy.

```python
# Cookies feel special because:
# - Browsers manage them
# - They're automatic
# - They persist

# None of that makes them trustworthy

# Cookies are client-controlled input

# Pi receives Cookie: session_id=abc123
# Client sent it, client can modify it, client can forge it

# Dashboard browser manages cookies
# But they are still client-controlled input
```

### 9) Cookies Are Ambient Authority (Line ~160)

**Context:** Cookies are sent automatically without user intent.

```python
# Cookies are sent:
# - Automatically
# - With every matching request
# - Without user intent

# This makes them dangerous

# Pi receives Cookie: session=abc123
# But it has no idea why the request was sent

# Was it:
# - Legitimate button click?
# - Malicious script?
# - CSRF attack?
# - Forged form?

# Pi cannot tell
```

### 10) The Server Cannot See Intent (Line ~179)

**Context:** Intent does not cross the boundary.

```python
# From the server's perspective:
# - A legitimate button click
# - A malicious script-triggered request
# - A background fetch
# - A forged form submission

# All look identical

# Pi receives request with valid session cookie
# Was user tricked into clicking link on evil.com?
# Or did they click your button?

# Intent does not cross the boundary
```

### 11) This Is Why CSRF Exists (Line ~195)

**Context:** CSRF exists because cookies are automatic and servers trust them.

```python
# Cross-Site Request Forgery exists because:
# - Cookies are automatic
# - Browsers send them without asking
# - Servers trust them

# The protocol does not distinguish:
# "user intended" from "user tricked"

# Pi receives POST to /api/config with valid session cookie
# Was it from your dashboard UI?
# Or from a form on evil.com?

# HTTP does not distinguish "user intended" from "user tricked"
```

### 12) Cookies Carry Identity, Not Permission (Line ~209)

**Context:** Cookies carry identifiers; authorization must be verified server-side.

```python
# A cookie may carry:
# - A session ID
# - A token
# - A reference

# It does not carry:
# - Authorization
# - Permission
# - Trust

# Those must be verified server-side

# Pi receives Cookie: session_id=abc123
# Cookie carries identity (a session ID), not permission
# Pi must look up the session, check roles, verify authorization
```

### 13) Never Trust Cookie Values (Line ~227)

**Context:** Cookies can identify but cannot authorize.

```python
# Bad idea:
# Cookie: role=admin

# Worse idea:
# Cookie: is_logged_in=true

# The client can change both

# Cookies can identify
# They cannot authorize

# Pi must never check:
# "if cookie says role=admin then allow"
# Client can change it
```

### 14) Session IDs Are Keys, Not Data (Line ~246)

**Context:** Session IDs point to server-side state; all authority lives behind the boundary.

```python
# A session cookie:
# - Identifies a session
# - Points to server-side state
# - Has no meaning on its own

# All authority lives behind the boundary

# Pi stores session data (roles, permissions) in Redis or database
# Cookie only holds the session ID

# Session IDs are keys, not data
```

### 15) The Path Is Input (Line ~259)

**Context:** Paths are client-provided data; never assume they imply permission.

```python
# Paths feel structural:
# /admin
# /users/42
# /api/delete

# They are still client-provided data

# Attackers:
# - Guess paths (/admin, /api/admin, /admin/users)
# - Manipulate IDs (/users/42 → /users/999999)
# - Traverse directories (/api/../config, /static/../../etc/passwd)
# - Probe hidden endpoints (/api/v1, /api/v2, /api/internal)

# Never assume the path implies permission
# Path is just a string the client sent
# Validate it, normalize it, check authorization separately
```

### 16) Query Strings Are Input (Line ~281)

**Context:** Query parameters are just as forgeable as headers.

```python
# Query parameters:
# ?user_id=42
# ?is_admin=true

# Are just as forgeable as headers

# Treat them as untrusted data

# Pi receives ?user_id=42&is_admin=true
# Query strings are just as forgeable as headers
```

### 17) HTTP Method Is Input (Line ~296)

**Context:** The client chooses the method; authorization must not depend on UI.

```python
# The client chooses the method

# A client can send:
# DELETE /users/42

# Even if your UI never exposes it

# Authorization must not depend on "the UI wouldn't do that"

# Dashboard UI never shows DELETE button
# But attacker can send DELETE /api/sensors/17 directly

# Pi must authorize based on session and roles
# Not on "the UI wouldn't do that"
```

### 18) Version Is Input (Line ~313)

**Context:** Even the protocol version is supplied by the client.

```python
# Even the protocol version:
# HTTP/1.1

# Is supplied by the client

# Servers must handle malformed or unexpected versions safely

# Pi receives HTTP/0.9 or HTTP/3.0 or malformed version strings
# Must handle them safely
```

### 19) Bodies Are Input (Line ~327)

**Context:** All body formats are untrusted; validation belongs at the boundary.

```python
# This part is obvious—but still worth stating:
# - JSON bodies
# - Form data
# - Multipart uploads

# All untrusted

# Validation belongs at the boundary

# Pi receives JSON, form data, or multipart uploads
# All untrusted
```

### 20) Validation Is Not Optional (Line ~342)

**Context:** Validation is the definition of the boundary.

```python
# Validation is not:
# - An optimization
# - A best practice
# - A "nice to have"

# It is the definition of the boundary

# Pi validates every request:
# - Presence
# - Type
# - Range
# - Authorization

# Validation is not optional
# It is the definition of the boundary
```

### 21) Validate Presence (Line ~355)

**Context:** Missing data is a failure mode; do not assume fields exist.

```python
# Is the field there?

# Missing data is a failure mode

# Do not assume:
# - Headers exist
# - Cookies exist
# - Fields exist

# Pi checks if Authorization header exists before using it
# Dashboard might not send a cookie
# ESP32 might omit a field

# Validate presence
```

### 22) Validate Type (Line ~370)

**Context:** Type confusion is a common exploit vector.

```python
# Is the data the type you expect?
# - String vs number
# - Integer vs float
# - Object vs list

# Type confusion is a common exploit vector

# Pi expects a number but receives:
# "42" (string) or "true" (boolean)

# Type confusion can lead to bugs or exploits
```

### 23) Validate Range (Line ~383)

**Context:** Unbounded input is dangerous.

```python
# Is the value reasonable?
# - IDs in expected range
# - Length limits
# - Time windows

# Unbounded input is dangerous

# Pi receives a sensor ID
# Must validate it is in expected range (1-100)
# Not 999999 or negative
```

### 24) Validate Authorization Separately (Line ~396)

**Context:** Identity, authentication, and authorization must be checked independently.

```python
# Never combine:
# - Identity
# - Authentication
# - Authorization

# Each must be checked independently

# Pi checks:
# 1. Identity (who is this?)
# 2. Authentication (are they logged in?)
# 3. Authorization (can they do this?)

# Separately
```

### 25) "The Client Would Never Send That" Is Not a Defense (Line ~409)

**Context:** Assume clients are buggy, scripted, malicious, or controlled by attackers.

```python
# Clients:
# - Are buggy
# - Are scripted
# - Are malicious
# - Are controlled by attackers

# Assume the worst

# Pi assumes clients are buggy, scripted, malicious, or controlled by attackers
```

### 26) Servers Do Not Trust Clients (Line ~423)

**Context:** This is architecture, not cynicism.

```python
# This is not cynicism
# It is architecture

# The server:
# - Validates
# - Verifies
# - Rejects

# Always

# Pi validates, verifies, and rejects—always
```

### 27) Clients Also Live in Hostile Environments (Line ~439)

**Context:** The boundary goes both ways; clients must validate responses.

```python
# The boundary goes both ways

# Clients must assume:
# - Servers can lie
# - Responses can be malformed
# - Content can be malicious

# Dashboard browser receives response from Pi
# Must validate Content-Type, parse carefully
# Avoid executing unexpected content
```

### 28) Clients Validate Responses Too (Line ~452)

**Context:** Client-side validation includes checking status codes and Content-Type.

```python
# Client-side validation includes:
# - Checking status codes
# - Validating Content-Type
# - Parsing carefully
# - Avoiding execution of unexpected content

# Dashboard validates status codes
# Checks Content-Type
# Parses JSON carefully
# Never evaluates response data as code
```

### 29) Never Execute Response Data Blindly (Line ~464)

**Context:** Responses are also input; never execute them blindly.

```python
# Classic failures:
# - Injecting HTML directly (XSS)
# - Evaluating JSON as code
# - Trusting script responses

# Responses are also input

# Dashboard must not:
# - Inject HTML directly (XSS)
# - Evaluate JSON as code
# - Trust script responses blindly
```

### 30) The Browser Is Not a Safe Space (Line ~477)

**Context:** Trust boundaries still apply in browsers.

```python
# Browsers:
# - Execute code
# - Load third-party scripts
# - Share global state

# Trust boundaries still apply

# Dashboard browser executes code
# Loads third-party scripts
# Shares global state

# Trust boundaries still apply
```

### 32) CORS Is a Boundary Control (Line ~505)

**Context:** CORS controls which origins may read responses; it does not validate input.

```python
# CORS controls:
# - Which origins may read responses

# It does not:
# - Authenticate
# - Authorize
# - Validate input

# Pi sets CORS headers to allow dashboard origin
# CORS controls which origins may read responses
# But it does not authenticate, authorize, or validate input
```

### 33) Security Is Layered, Not Singular (Line ~519)

**Context:** No single mechanism protects you; each layer assumes others can fail.

```python
# No single mechanism protects you:
# - Not cookies
# - Not headers
# - Not HTTPS
# - Not CORS

# Each layer assumes the others can fail

# Pi uses HTTPS, cookies, headers, CORS
# No single mechanism protects you
```

### 34) Fail Closed, Not Open (Line ~533)

**Context:** When validation fails, reject the request; do not guess or continue.

```python
# When validation fails:
# - Reject the request
# - Return an error
# - Log the event

# Do not guess
# Do not continue

# Pi receives invalid input
# Rejects the request, returns an error, logs the event
# Does not guess, does not continue
```

### 35) Silence Is Dangerous (Line ~547)

**Context:** Ignoring malformed input hides bugs and enables exploitation.

```python
# Ignoring malformed input:
# - Hides bugs
# - Enables probing
# - Encourages exploitation

# Explicit rejection is safer

# Pi explicitly rejects malformed input with clear error
# Hides nothing, enables no probing
```

### 36) Error Messages Are Also a Surface (Line ~560)

**Context:** Error responses can leak information; balance clarity with restraint.

```python
# Error responses can:
# - Leak information
# - Reveal structure
# - Aid attackers

# Balance clarity with restraint

# Pi returns an error message
# Must balance clarity (user needs to know what went wrong)
# With restraint (do not leak structure or aid attackers)
```

### 37) Logging Is a Defensive Tool (Line ~573)

**Context:** Log validation failures, authorization failures, and unexpected inputs.

```python
# Log:
# - Validation failures
# - Authorization failures
# - Unexpected inputs

# Logs reveal attack patterns

# Pi logs validation failures, authorization failures, unexpected inputs
# Logs reveal attack patterns
```

### 38) The Boundary Is the Only Safe Place to Stop Bad Data (Line ~586)

**Context:** Once bad data enters, it spreads and contaminates state.

```python
# Once bad data enters:
# - It spreads
# - It contaminates state
# - It creates secondary failures

# The edge is your only clean choke point

# Pi validates at the boundary
# Once bad data enters, it spreads and contaminates state
```

### 39) Everything Is an Attack Surface (Line ~599)

**Context:** Headers, cookies, paths, bodies, methods, and timing are all attack surfaces.

```python
# Everything is an attack surface:
# - Headers
# - Cookies
# - Paths
# - Bodies
# - Methods
# - Timing

# All of it

# Timing attacks exploit how long operations take
# If Pi checks password character-by-character and returns early
# Attacker can measure response times to learn which characters are correct

# Everything is an attack surface
```

### 40) Security Starts with Correct Mental Models (Line ~616)

**Context:** Wrong mental models lead to vulnerabilities.

```python
# If you believe:
# - "Headers are safe"
# - "Cookies are trustworthy"
# - "The client wouldn't do that"

# You will ship vulnerabilities

# Pi assumes "headers are safe" or "cookies are trustworthy"
# You will ship vulnerabilities

# Security starts with correct mental models
```

### Reflection) Trust Boundaries Reflection (Line ~629)

**Context:** Trace what is trusted, what must be verified, and what assumptions are unsafe.

```python
# Request arrives at Pi:
# X-User-Id: 42
# Cookie: session=abc123
# DELETE /api/sensors/17

# What is trusted?
# Nothing. Every header, cookie, path, method, and body byte came from the client.

# What must be verified?
# Everything:
# - Presence (does session cookie exist?)
# - Type (is sensor ID a number?)
# - Range (is 17 a valid sensor ID?)
# - Identity (who owns session=abc123?)
# - Authentication (is that session valid?)
# - Authorization (can this user delete sensor 17?)

# What assumptions are unsafe?
# - Assuming X-User-Id means anything
# - Assuming path /api/sensors/17 implies permission
# - Assuming DELETE means user intended it
# - Assuming cookie value is unchanged
# - Assuming "the UI wouldn't send that"
```

---

## Chapter 2.22: Redirects and the Location Header

### 1) What a Redirect Really Is (Line ~23)

**Context:** A redirect is a completed request with 3xx status and Location header.

```python
# At the HTTP level, a redirect is:
# - A completed request
# - With a 3xx status code
# - And a Location header
# - That instructs the client to issue another request

# The server does not forward the request
# The server does not proxy the request

# The server replies, and the client decides what to do next

# Pi sends 301 redirect with Location: https://dashboard.pi.local/new-path
# Dashboard browser receives it and decides whether to follow it
```

### 2) Redirects Are Not Server-to-Server (Line ~40)

**Context:** Redirects are two separate HTTP exchanges, not forwarding.

```python
# A redirect is not:
# - The server calling another server
# - The server internally routing
# - The server "sending you over"

# A redirect is:
# - The server telling the client a new address
# - The client making a new request

# Two separate HTTP exchanges

# Dashboard requests http://pi.local/api/old
# Pi responds with 301 and Location: https://pi.local/api/new
# Dashboard then makes a new request to https://pi.local/api/new
```

### 3) The Location Header Is the Instruction (Line ~59)

**Context:** Location header carries the target URL; clients must validate it.

```python
# The Location header carries the target

# It can be:
# - Absolute URL: https://example.com/path
# - Relative URL: /path

# Clients resolve relative URLs against the original request URL

# Example:
# HTTP/1.1 301 Moved Permanently
# Location: https://example.com/new-path

# This header is:
# - Required for most redirects
# - Interpreted by the client
# - Untrusted input from the server (for the client)

# Pi sends Location: /api/v2/readings (relative)
# Or Location: https://pi.local/api/v2/readings (absolute)
# Dashboard resolves relative URLs against the original request URL
```

### 4) Redirects Are Optional for Clients (Line ~79)

**Context:** Clients are not required to follow redirects; they are suggestions.

```python
# Important invariant:

# Clients are not required to follow redirects

# Browsers usually do
# HTTP libraries often do (configurable)
# APIs sometimes do not

# Redirects are a suggestion, not a command

# Pi sends a 302 redirect
# Dashboard browser usually follows it
# But ESP32 HTTP client might not (depending on configuration)
```

### 5) Redirects Create a New Request (Line ~95)

**Context:** Following a redirect creates a brand-new request; it is branching, not continuation.

```python
# When a client follows a redirect:
# - It issues a brand-new request
# - With a new request line
# - Possibly a new method
# - Possibly without the original body
# - Possibly without the original headers

# This is not continuation
# It is branching

# Dashboard POSTs to /api/config
# Pi responds with 307 and Location: /api/v2/config
# Dashboard makes a new POST to /api/v2/config
```

### 6) Redirects Are Control Flow (Line ~111)

**Context:** Redirects are protocol-level branching logic.

```python
# Think of redirects as:
if resource_moved:
    respond_with_redirect()

# The next action happens on the client, not the server

# This is protocol-level branching logic

# Pi checks if resource moved
# If yes, respond with redirect
# Next action happens on client (dashboard browser or ESP32)
```

### 9) 301 Moved Permanently (Line ~155)

**Context:** 301 means permanent move; historically browsers change POST→GET.

```python
# 301 means:
# "This resource has permanently moved to another URL"

# Implications:
# - Clients may update bookmarks
# - Caches may store the redirect
# - Search engines update indexes
# - Browsers may rewrite future requests

# Historically:
# - Browsers often change POST → GET

# This historical behavior is why 301 can be dangerous for APIs

# ESP32 POSTs sensor data to /api/old
# Pi responds with 301 to /api/new
# Some clients convert POST→GET, dropping the body
```

### 10) 302 Found (Line ~176)

**Context:** 302 means temporary redirect; historically ambiguous and changes POST→GET.

```python
# 302 means:
# "This resource is temporarily elsewhere"

# Implications:
# - Do not update bookmarks
# - Do not cache permanently
# - The original URL is still valid

# Historically:
# - Browsers often change POST → GET
# - Semantics were ambiguous

# This ambiguity led to newer codes

# Pi uses 302 for temporary redirects
# But browsers historically changed POST→GET
# And semantics were ambiguous
```

### 11) The POST → GET Problem (Line ~197)

**Context:** Early browsers converted POST→GET on redirects, dropping request bodies.

```python
# Early web browsers:
# - Treated 301 and 302 the same
# - Converted POST into GET
# - Dropped the request body

# This was convenient for browsers
# It was disastrous for APIs

# ESP32 POSTs temperature data
# Pi redirects with 301 or 302
# Browser converts POST→GET, body is dropped, data is lost
```

### 12) Enter 307 and 308 (Line ~211)

**Context:** 307 and 308 preserve method and body; added to fix POST→GET problem.

```python
# To fix ambiguity, HTTP introduced:
# - 307 Temporary Redirect (RFC 7231)
# - 308 Permanent Redirect (RFC 7538)

# These preserve method and body

# They were added specifically to address the POST→GET conversion problem
# APIs needed redirects that would not lose request bodies or change method semantics

# For modern APIs, 307 and 308 are usually the correct choice
# Unless you specifically need the legacy behavior of 301/302
```

### 13) 307 Temporary Redirect (Line ~221)

**Context:** 307 preserves method and body; temporary change.

```python
# 307 means:
# "Go elsewhere, but repeat the request exactly"

# Implications:
# - Method is preserved
# - Body is preserved
# - Temporary change

# POST stays POST
# PUT stays PUT

# ESP32 POSTs sensor readings to /api/old
# Pi responds with 307 to /api/new
# ESP32 makes a new POST (not GET) to /api/new with the same body
```

### 14) 308 Permanent Redirect (Line ~239)

**Context:** 308 means permanent move with method preserved; better than 301 for APIs.

```python
# 308 means:
# "This resource has permanently moved, and you must preserve the method"

# Implications:
# - Method preserved
# - Body preserved
# - Permanent change
# - Clear semantics for APIs

# For modern APIs, 308 is usually better than 301

# Pi moves /api/v1/readings to /api/v2/readings permanently
# Use 308 so POST/PUT methods are preserved
```

### 16) Redirects and Idempotency (Line ~271)

**Context:** Redirecting POST is dangerous; retries can duplicate side effects.

```python
# Recall Phase 0 invariants:
# - Idempotent operations can be retried safely
# - Non-idempotent operations cannot

# Redirecting a POST:
# - Is dangerous—if client retries the redirect, it may POST twice
# - Can duplicate side effects (creating two sensor readings, charging twice)
# - Must be designed carefully

# If redirect changes POST→GET (301/302 legacy behavior):
# Operation becomes idempotent (GET is safe), but original intent is lost

# If redirect preserves POST (307/308):
# Operation remains non-idempotent, retries are still dangerous

# Safest pattern: POST creates resource, server responds with 201 Created and Location
# Client GETs the resource
```

### 17) Redirects After POST (Line ~286)

**Context:** POST→201→GET pattern avoids duplicate POSTs.

```python
# Common pattern:
# 1. Client POSTs data
# 2. Server creates resource
# 3. Server responds with 201 Created
# 4. Location points to the new resource
# 5. Client GETs the resource

# This avoids duplicate POSTs

# Dashboard POSTs to create a user
# Pi responds with 201 Created and Location: /users/42
# Dashboard GETs /users/42
```

### 18) 201 Created Is a Redirect-Like Pattern (Line ~301)

**Context:** 201 uses Location header to point to the new resource.

```python
# 201 is not a redirect code, but it uses Location

# Example:
# HTTP/1.1 201 Created
# Location: /users/42

# This says:
# - The action succeeded
# - A new resource exists
# - Here is where it lives

# The client may choose to fetch it

# Pi creates a new sensor config
# Responds with 201 Created and Location: /api/configs/17
# Dashboard may choose to GET that location
```

### 19) Redirect Chains (Line ~321)

**Context:** A redirect can point to another redirect.

```python
# A redirect can point to another redirect

# Example:
# /old → /older
# /older → /new
# /new → 200 OK

# This is a redirect chain

# Dashboard requests /old
# Pi redirects to /older
# Which redirects to /new
# Which returns 200 OK
```

### 20) Redirect Loops (Line ~336)

**Context:** Bad configuration can create loops; clients must protect themselves.

```python
# Bad configuration can create loops:
# /a → /b
# /b → /a

# Or more subtle:
# /a → /a (self-loop)
# /a → /b → /c → /a (circular chain)

# Clients must protect themselves
# Servers cannot detect loops because each redirect is a separate request-response pair

# Browsers and libraries:
# - Limit redirect depth (typically 5–10 hops)
# - Abort after N hops
# - May detect cycles by tracking visited URLs

# Redirect loops are server misconfigurations
# But clients must handle them gracefully
```

### 22) Redirects Are Not Free (Line ~373)

**Context:** Each redirect requires a full round trip and adds latency.

```python
# Each redirect:
# - Requires a full round trip
# - Adds latency
# - Adds load

# Minimize unnecessary redirects

# Dashboard requests /api/readings
# Pi redirects to /api/v2/readings
# Which redirects to /api/v2/readings/ (trailing slash)
# Each redirect adds latency
```

### 23) Redirects vs Internal Routing (Line ~386)

**Context:** Redirects are client-visible; internal routing is server-only.

```python
# Redirect:
# - Client-visible
# - New request
# - New URL

# Internal routing:
# - Server-only
# - Same request
# - Same URL

# Do not confuse them

# Pi internally routes /api/readings to a handler
# This is server-only, same request, same URL

# Redirecting /api/old to /api/new is client-visible, new request, new URL
```

### 24) When to Use Redirects (Line ~404)

**Context:** Use redirects for URL changes; do not use them for control flow.

```python
# Use redirects when:
# - URLs change
# - Resources move
# - Canonical URLs are enforced
# - Versioning transitions occur

# Do not use redirects for:
# - Normal control flow
# - Authorization checks
# - Error handling

# Pi should not redirect on every authorization check
# That is control flow, not resource movement
```

### 25) Canonical URLs (Line ~421)

**Context:** Servers enforce canonical URLs via redirects.

```python
# Servers often enforce canonical URLs:
# - HTTPS instead of HTTP (security)
# - Trailing slash normalization (/path vs /path/)
# - www vs non-www (consistency)
# - Lowercase vs mixed case (case sensitivity)

# Example:
# http://example.com → https://example.com

# This is a redirect

# Dashboard requests http://pi.local/api/config
# Pi redirects to https://pi.local/api/config to enforce HTTPS
```

### 26) Redirects and Security (Line ~439)

**Context:** Redirects cross trust boundaries; clients must be cautious.

```python
# Redirects cross trust boundaries

# A server can redirect a client to:
# - A malicious site
# - An unexpected protocol
# - A phishing endpoint

# Clients must be cautious

# Dashboard follows a redirect from Pi
# But Location header could point to evil.com
# Or an unexpected protocol
# Or a phishing endpoint
```

### 27) Open Redirect Vulnerabilities (Line ~454)

**Context:** Open redirect occurs when user input controls Location without validation.

```python
# An open redirect occurs when:
# - User input controls Location
# - No validation is applied

# Example:
# /login?next=https://evil.com

# The server blindly redirects

# This is a real vulnerability

# Pi has /login?next=https://evil.com
# If it blindly redirects to the "next" parameter
# That is an open redirect vulnerability
```

### 28) Why Open Redirects Are Dangerous (Line ~472)

**Context:** Open redirects enable phishing, bypass security filters, and abuse trusted domains.

```python
# Open redirects:
# - Enable phishing
# - Bypass security filters
# - Abuse trusted domains

# They break user trust

# Dashboard user clicks a link on Pi that redirects to evil.com
# Enables phishing, bypasses security filters
# Abuses your trusted domain
```

### 29) Validating Redirect Targets (Line ~485)

**Context:** Servers should restrict redirect destinations and validate targets.

```python
# Servers should:
# - Restrict redirect destinations
# - Allow only known domains
# - Normalize paths
# - Reject external URLs when inappropriate

# Redirects are output—but still part of security design

# Pi validates redirect targets
# Only allows known domains
# Normalizes paths
# Rejects external URLs when inappropriate
```

### 30) Redirects Are Output Boundaries (Line ~499)

**Context:** Phase 0.8 applies to redirects too; boundaries exist in both directions.

```python
# Phase 0.8 applies here too:
# - Redirect targets are output
# - Output can cause harm
# - Output must be validated

# Boundaries exist in both directions

# Pi sends Location: https://evil.com
# That is output, and output can cause harm
```

### 32) Credentials and Redirects (Line ~526)

**Context:** When following redirects, credentials may be dropped or change context.

```python
# When following redirects:
# - Authorization headers may be dropped
# - Cookies may or may not apply
# - Cross-origin redirects change security context

# Clients must manage this explicitly

# Dashboard follows a redirect
# Authorization headers may be dropped
# Cookies may or may not apply
# Cross-origin redirects change security context
```

### 33) Redirects and Cookies (Line ~539)

**Context:** Cookies may or may not be sent depending on domain boundaries.

```python
# If redirect stays within the same domain:
# - Cookies may be sent automatically

# If redirect crosses domains:
# - Cookies usually are not sent

# This matters for login flows

# Dashboard logs in at auth.pi.local
# Pi redirects to dashboard.pi.local
# If same domain, cookies are sent
# If different domain, cookies usually are not
```

### 35) Post/Redirect/Get (PRG) Pattern (Line ~567)

**Context:** PRG pattern prevents duplicate submissions.

```python
# Classic pattern:
# 1. POST form
# 2. Server processes
# 3. Server redirects to GET
# 4. User refreshes safely

# Prevents duplicate submissions

# Dashboard POSTs a form to create a config
# Pi processes it, redirects to GET /configs/17
# User refreshes—GET is safe, no duplicate POST
```

### 36) Redirects and Caching (Line ~581)

**Context:** Some redirects are cacheable; be careful before marking permanent.

```python
# Some redirects:
# - Are cacheable (301, 308)
# - Persist in browser cache
# - Affect future behavior

# Be careful before marking something permanent

# Pi uses 301 to redirect /api/v1 to /api/v2
# Browsers cache it
# Users may never hit /api/v1 again
# Rollbacks are painful
```

### 37) Permanent Means Permanent (Line ~594)

**Context:** Once clients cache 301 or 308, changing behavior is hard.

```python
# Once clients cache a 301 or 308:
# - Changing behavior is hard
# - Users may never hit the old URL again
# - Rollbacks are painful

# Use permanent redirects sparingly

# Pi uses 301 or 308
# Once clients cache it, changing behavior is hard
```

### 38) Temporary Redirects Are Safer (Line ~607)

**Context:** When unsure, use temporary redirects first.

```python
# When unsure:
# - Use 302 or 307
# - Observe behavior
# - Promote to permanent later

# Temporary first is safer

# Pi is unsure if a move is permanent
# Use 302 or 307, observe behavior
# Promote to permanent later
```

### Reflection) Redirects Reflection (Line ~647)

**Context:** Walk through redirect decision-making process.

```python
# Pi API moves from /api/v1/readings to /api/v2/readings

# Walk through the decision:
# - Is this permanent? If yes, use 301 or 308. If unsure, start with 302 or 307.
# - Does the method matter? If ESP32 POSTs data, method preservation matters—use 307 or 308, not 301 or 302.
# - Will clients retry? If redirects preserve POST (307/308), retries are dangerous—design carefully.
# - Should bookmarks update? If permanent (301/308), yes. If temporary (302/307), no.

# Which status code fits?
# - If permanent and method matters: 308
# - If temporary and method matters: 307
# - If permanent but method does not matter (or you want legacy POST→GET): 301
# - If temporary and method does not matter: 302

# Then ask:
# - What happens if a client follows the redirect twice?
# - What happens if Location points to an external domain?
# - What happens if cookies or credentials are involved?
```

---

## Chapter 2.23: REST Principles

### 1) REST Is Derived, Not Invented (Line ~27)

**Context:** REST is extracted from HTTP's properties, not layered on top.

```python
# REST (Representational State Transfer) was described by Roy Fielding
# while defining HTTP itself

# It is not layered on top of HTTP
# It is extracted from HTTP's properties

# If you violate REST, you are usually fighting HTTP—not extending it

# Pi uses POST for everything:
# GET /api/getReadings
# POST /api/createReading
# POST /api/deleteSensor

# This fights HTTP

# REST uses GET for retrieval, POST for creation, DELETE for removal
```

### 2) REST Starts with Resources (Line ~41)

**Context:** Resources are the nouns of your API; things you can identify, retrieve, create, update, or delete.

```python
# Everything in REST begins with the idea of a resource

# A resource is:
# - A conceptual thing (exists conceptually, even if stored in database or computed)
# - Identified by a URL (the URL is the stable identifier)
# - Stable over time (same URL should identify same conceptual thing)

# Examples:
# - A user (identified by /users/42)
# - A sensor (identified by /sensors/alpha)
# - A reading (identified by /readings/123)
# - A collection of readings (identified by /readings)
# - A configuration document (identified by /configs/coop)

# A resource is not:
# - A function (resources are things, not operations)
# - A verb (actions belong in HTTP methods, not resource names)
# - A procedure (resources are state, not behavior)
```

### 3) URLs Identify Resources, Not Actions (Line ~66)

**Context:** In REST, the URL identifies what, not what to do.

```python
# In REST, the URL identifies what, not what to do

# Good:
# /users
# /users/42
# /sensors/alpha
# /readings/123

# Bad:
# /getUser
# /createReading
# /deleteSensor

# Actions belong in methods, not URLs

# Pi uses GET /api/sensors/alpha (good)
# Not GET /api/getSensor?id=alpha (bad)

# Uses DELETE /api/sensors/alpha (good)
# Not POST /api/deleteSensor (bad)
```

### 4) The Resource Exists Independently of Representation (Line ~87)

**Context:** Resource is abstract; representation is concrete bytes in a format.

```python
# A resource is abstract—exists conceptually, independent of serialization

# A representation is concrete—bytes in a specific format (JSON, HTML, XML, plain text)

# The same resource may be represented as:
# - JSON (for APIs, dashboards)
# - HTML (for browsers)
# - XML (for legacy systems)
# - Plain text (for simple clients like ESP32)

# The resource is the thing (the sensor, the reading, the config)
# The representation is how it crosses the boundary (JSON body, HTML page, plain text)

# Pi's sensor resource /api/sensors/alpha can be represented as:
# - JSON for dashboard
# - HTML for browser
# - Plain text for ESP32

# Same resource, different representations
```

### 5) Representation Is What Travels Over HTTP (Line ~105)

**Context:** HTTP transmits representations of resources, not resources themselves.

```python
# HTTP does not transmit resources
# HTTP transmits representations of resources

# The body of a response is not the resource
# It is a snapshot of it in some format

# This distinction matters

# Dashboard GETs /api/sensors/alpha
# Receives a JSON representation
# The sensor resource exists on Pi
# The JSON is a snapshot
```

### 6) Content Negotiation Enables Multiple Representations (Line ~119)

**Context:** Clients express preferences; servers choose one representation.

```python
# Clients express preferences:
# Accept: application/json
# Accept: text/html

# Servers choose:
# - One representation
# - And declare it with Content-Type

# Same resource. Different view.

# Dashboard sends Accept: application/json, gets JSON
# Browser sends Accept: text/html, gets HTML
# ESP32 sends Accept: text/plain, gets plain text

# Same sensor resource, different representations
```

### 8) Methods Carry Intent (Line ~147)

**Context:** REST aligns intent with method; using POST for everything discards HTTP semantics.

```python
# REST aligns intent with method:
# GET    → retrieve a representation
# POST   → create a new resource or submit data
# PUT    → replace a resource
# PATCH  → partially update a resource
# DELETE → remove a resource

# Using POST for everything discards information HTTP already provides

# Pi uses POST /api/doSomething for everything
# Retrieval, creation, deletion

# This discards HTTP's built-in semantics
```

### 9) GET Is Read-Only by Contract (Line ~162)

**Context:** GET does not change state; if a GET changes state, you've broken a core invariant.

```python
# In REST:
# - GET does not change state
# - GET is safe
# - GET is cacheable
# - GET can be repeated freely

# If a GET changes state, you have broken a core invariant

# Pi has GET /api/readings/123 that also deletes the reading
# This breaks REST

# GET must be read-only
```

### 10) POST Is Not "Do Anything" (Line ~176)

**Context:** POST creates subordinate resources or submits data; it is not idempotent.

```python
# POST is often abused as a universal hammer

# In REST:
# - POST creates a subordinate resource
# - Or submits data to a processing resource

# POST is not idempotent
# POST must be designed carefully

# Dashboard POSTs to /api/readings to create a new reading
# POST creates a subordinate resource

# ESP32 POSTs sensor data
# POST submits data to a processing resource
```

### 11) PUT Means Replace (Line ~191)

**Context:** PUT stores the representation at the URL; it is idempotent.

```python
# PUT says:
# "Store this representation at this URL"

# The client knows the URL
# The client supplies the full representation
# The server replaces what was there

# PUT is idempotent

# Dashboard PUTs a full config to /api/configs/coop
# Replaces the entire config

# PUT again with the same data
# Same result
```

### 12) PATCH Means Partial Update (Line ~207)

**Context:** PATCH applies changes; it does not replace the resource.

```python
# PATCH says:
# "Apply these changes"

# PATCH does not replace the resource
# PATCH modifies parts

# PATCH is useful—but requires careful definition

# Dashboard PATCHes /api/configs/coop with:
# {"temperature_threshold": 75}

# Modifies only that field
```

### 13) DELETE Removes the Resource (Line ~222)

**Context:** DELETE removes the resource; it is idempotent.

```python
# DELETE removes the resource identified by the URL

# DELETE is idempotent:
# - Deleting twice is the same as deleting once

# DELETE may return:
# - 204 No Content
# - 200 OK with a representation
# - 404 if already gone

# Dashboard DELETEs /api/sensors/alpha
# Pi returns 204 No Content

# DELETEs again
# Returns 404 (already gone)
```

### 14) REST Uses Status Codes as First-Class Signals (Line ~238)

**Context:** Status codes are the primary outcome channel, not decoration.

```python
# REST relies heavily on HTTP status codes

# Status codes are not decoration
# They are the primary outcome channel

# Dashboard GETs /api/sensors/alpha
# Pi returns:
# - 200 OK with JSON
# - Or 404 Not Found
# - Or 500 Server Error
```

### 15) Status Codes Encode Semantics (Line ~250)

**Context:** REST expects clients to read and act on status codes.

```python
# Examples:
# 200 → success, representation returned
# 201 → resource created
# 204 → success, no body
# 400 → client error
# 404 → resource does not exist
# 409 → conflict
# 500 → server failure

# REST expects clients to read and act on these

# Dashboard receives 201 Created
# Knows a resource was created

# Receives 409 Conflict
# Knows there was a conflict
```

### 16) REST Is Stateless by Constraint (Line ~267)

**Context:** Every request must contain everything the server needs; state is in resource, request, or token.

```python
# Every request must contain everything the server needs to process it

# The server does not remember:
# - Previous requests
# - Client history
# - Navigation state

# State is:
# - In the resource
# - In the request
# - Or in a token/cookie carried by the client

# Dashboard sends a session cookie with every request
# State is in the cookie, not in server memory

# ESP32 sends an API token
# State is in the token
```

### 17) Statelessness Enables Scalability (Line ~285)

**Context:** Stateless servers are easier to scale and load balance.

```python
# Stateless servers:
# - Are easier to scale
# - Can be load balanced
# - Can crash and restart freely

# REST favors this tradeoff intentionally

# Pi can scale horizontally
# Add more Pi servers, load balance requests
# If one crashes, others continue
```

### 18) Sessions Are an Application Layer Choice (Line ~298)

**Context:** REST requires session state be explicit and carried by the client.

```python
# REST does not forbid sessions

# REST requires that session state:
# - Be explicit
# - Be carried by the client
# - Not be implicit server memory

# Cookies and tokens satisfy this constraint

# Dashboard uses session cookies
# Session state is explicit, carried by the client

# ESP32 uses API tokens
# Authentication state is explicit
```

### 19) REST Encourages Cacheability (Line ~313)

**Context:** Caching is a design goal, not just an optimization.

```python
# If a response is cacheable:
# - Declare it
# - Let intermediaries work

# REST aligns naturally with:
# - Cache-Control
# - ETags
# - Conditional requests

# Caching is not an optimization—it's a design goal
```

### 20) Uniform Interface Is the Core Constraint (Line ~328)

**Context:** Same methods, semantics, and status codes everywhere; clients don't need endpoint-specific rules.

```python
# REST's most important idea is the uniform interface

# This means:
# - Same methods everywhere
# - Same semantics everywhere
# - Same status codes everywhere

# Clients do not need endpoint-specific rules

# Dashboard knows:
# GET /api/sensors/alpha
# GET /api/readings/123
# GET /api/configs/coop

# All work the same way
# Same methods, same semantics, same status codes
```

### 21) Uniform Interface Reduces Coupling (Line ~343)

**Context:** Uniform interfaces enable independent evolution; this is why REST scales socially.

```python
# When interfaces are uniform:
# - Clients can evolve independently
# - Servers can change internally
# - Intermediaries can exist

# This is why REST scales socially, not just technically

# Dashboard can evolve independently of Pi
# Adds features without breaking

# Pi can change internally
# As long as the interface stays uniform
```

### 22) Hypermedia Is Often Misunderstood (Line ~356)

**Context:** HATEOAS enables loose coupling but most APIs ignore it.

```python
# Strict REST includes HATEOAS:
# Hypermedia As The Engine Of Application State

# This means:
# - The server tells the client what it can do next
# - Via links in representations
# - The client discovers available actions dynamically

# Example:
# {
#   "sensor": {...},
#   "links": {
#     "self": "/sensors/alpha",
#     "readings": "/sensors/alpha/readings"
#   }
# }

# HATEOAS enables true loose coupling
# Clients follow links rather than constructing URLs

# Most APIs ignore this
# That's okay
```

### 23) REST Is a Spectrum, Not a Switch (Line ~375)

**Context:** Very few systems are "pure REST"; using HTTP honestly gets most of the value.

```python
# Very few systems are "pure REST"

# REST is guidance

# Using HTTP honestly gets you most of the value
# Dogma gets you very little

# Pi API uses HTTP honestly
# Resources, methods, status codes
# Not "pure REST" but RESTful enough
```

### 24) REST Does Not Mean CRUD Only (Line ~389)

**Context:** REST supports workflows, transitions, and state machines as long as they're modeled as resources.

```python
# REST is often reduced to CRUD
# This is a mistake

# REST supports:
# - Workflows
# - Transitions
# - State machines

# As long as they are modeled as resources

# Pi models a job as a resource:
# POST /api/jobs creates it
# GET /api/jobs/123 checks status
```

### 25) Modeling Actions as Resources (Line ~406)

**Context:** If you need to "do something," model the result or process as a resource.

```python
# If you need to "do something":
# - Model the result as a resource
# - Or model the process as a resource

# Example:
# POST /jobs
# GET /jobs/123

# Not:
# POST /runJob

# Pi models a sensor calibration job:
# POST /api/jobs creates it
# GET /api/jobs/456 checks progress

# Not POST /api/runCalibration
```

### 26) REST and Error Modeling (Line ~423)

**Context:** Errors are representations; 400 response may include JSON describing what failed.

```python
# Errors are not exceptions
# Errors are representations

# A 400 response may include:
# - A JSON body describing what failed
# - Field-level validation messages

# This is still RESTful

# Dashboard POSTs invalid data
# Pi returns 400 Bad Request with JSON body describing field errors
```

### 27) REST and Versioning (Line ~439)

**Context:** Versioning is a design choice; REST does not mandate one approach.

```python
# Versioning is a design choice

# Common strategies:
# - Version in URL: /v1/readings
# - Version in header
# - Version in representation

# REST does not mandate one—but consistency matters

# Pi uses /api/v1/readings, /api/v2/readings for versioning
# Or uses Accept: application/vnd.api.v1+json
```

### 28) REST and Evolution (Line ~454)

**Context:** REST systems evolve by adding fields, links, and resources; backward compatibility is a discipline.

```python
# REST systems evolve by:
# - Adding fields
# - Adding links
# - Adding resources

# Not by changing semantics of existing ones

# Backward compatibility is a design discipline

# Pi adds fields to sensor representations
# Old clients still work

# Adds new resources
# Does not break existing ones
```

### 29) REST Does Not Eliminate Complexity (Line ~469)

**Context:** REST makes complexity explicit; it gives you a stable vocabulary.

```python
# REST does not make systems simple
# REST makes complexity explicit

# You still design:
# - Resource models
# - State transitions
# - Authorization rules
# - Validation

# REST just gives you a stable vocabulary

# Pi still designs resource models, state transitions, authorization rules, validation
# REST does not eliminate complexity
# REST makes complexity explicit
```

### 30) REST Is Boundary-First Design (Line ~487)

**Context:** REST assumes untrusted clients, unreliable networks, and independent evolution.

```python
# REST assumes:
# - Untrusted clients
# - Unreliable networks
# - Independent evolution

# It aligns perfectly with Phase 0 boundary thinking

# Pi assumes untrusted clients, unreliable networks, independent evolution
```

### 31) REST Is About Honesty (Line ~500)

**Context:** REST works when names match behavior; this echoes Phase 0 abstraction rules.

```python
# REST fails when:
# - URLs lie
# - Methods lie
# - Status codes lie

# REST works when names match behavior

# This echoes Phase 0 abstraction rules

# Pi uses URLs that match behavior
# GET /api/sensors/alpha retrieves
# DELETE /api/sensors/alpha removes

# Names match behavior
```

### 32) REST Is Not Required (Line ~515)

**Context:** REST is a choice, not a moral obligation; RPC, GraphQL, and WebSockets exist.

```python
# You can build non-REST APIs

# RPC exists
# GraphQL exists
# WebSockets exist

# REST is a choice—not a moral obligation

# Pi could use RPC-style endpoints, GraphQL, or WebSockets
# REST is one choice
```

### 33) Why REST Still Matters (Line ~529)

**Context:** REST leverages decades of operational reality and existing infrastructure.

```python
# REST matters because:
# - HTTP infrastructure already exists
# - Tooling understands it
# - Debugging is straightforward
# - Failures are visible

# REST leverages decades of operational reality

# Pi uses HTTP
# Infrastructure exists, tooling understands it, debugging is straightforward
```

### Reflection) REST Reflection (Line ~558)

**Context:** Walk through REST design for a homestead sensor system.

```python
# Designing an API for homestead sensor system
# ESP32 sensors POST readings
# Dashboard displays them
# Coop controller manages configs

# Walk through the REST design:

# What are the resources?
# - Sensors (/api/sensors/alpha)
# - Readings (/api/readings/123)
# - Configs (/api/configs/coop)
# - Collections (/api/readings)
# These are things, not actions

# What URLs identify them?
# Use nouns: /api/sensors/alpha, not /api/getSensor
# URLs identify what, not what to do

# What representations do clients need?
# JSON for dashboard, plain text for ESP32, HTML for browser
# Same resource, different representations via content negotiation

# What methods express intent?
# GET to retrieve, POST to create, PUT to replace, PATCH to update, DELETE to remove
# Actions belong in methods, not URLs

# What status codes express outcomes?
# 200 for success, 201 for created, 404 for not found
# 400 for client errors, 500 for server errors
# Status codes are first-class signals

# If you can answer those, you are already doing REST
```

---

## Chapter 2.24: Seeing HTTP in the Wild

### 1) Why Observation Matters (Line ~27)

**Context:** HTTP is observable; most confusion comes from not looking.

```python
# HTTP is not abstract
# It is not theoretical
# It is observable

# If something is wrong:
# - You can see the request
# - You can see the response
# - You can see the headers
# - You can see the timing
# - You can see what actually crossed the wire

# Most confusion around HTTP comes from not looking

# Dashboard is slow—use curl -v to see actual request/response
# ESP32 sensor data not arriving—check DevTools Network tab
# Coop controller API fails—inspect headers and status codes
```

### 2) curl: The Sharpest Tool in the Box (Line ~48)

**Context:** curl does almost nothing automatically; that's why it's valuable.

```python
# curl is a command-line HTTP client

# It does almost nothing automatically
# That is exactly why it is valuable

# You tell it what to send
# It sends that
# It shows you what comes back

# No UI
# No abstraction
# No browser behavior hidden behind convenience

# Pi API receives a request
# curl shows exactly what was sent: method, path, headers, body
```

### 3) A Minimal curl Request (Line ~68)

**Context:** curl defaults to showing only the response body.

```python
# curl https://example.com

# This:
# - Opens a TCP connection
# - Sends a GET request
# - Receives a response
# - Prints the body

# You did not see:
# - Headers
# - Status line
# - Redirects
# - Negotiation

# Because you didn't ask to

# curl defaults to showing only what most users care about—the response body
```

### 4) Seeing the Full Exchange with -v (Line ~90)

**Context:** curl -v shows the complete request and response.

```python
# curl -v https://example.com

# This shows:
# - The exact request line
# - All request headers
# - The response status line
# - All response headers

# Everything you have been learning becomes visible

# Pi sends a response
# curl -v shows the status line, headers, body
```

### 5) Reading the Request in curl Output (Line ~106)

**Context:** Lines starting with > show the raw request.

```python
# Look for lines starting with >

# Example:
# > GET / HTTP/1.1
# > Host: example.com
# > User-Agent: curl/8.0.1
# > Accept: */*

# That is the raw request

# Method
# Path
# Version
# Headers

# Nothing more
# Nothing less

# Dashboard requests /api/readings
# curl -v shows:
# > GET /api/readings HTTP/1.1
# > Host: pi.local
# > Accept: application/json
```

### 6) Reading the Response in curl Output (Line ~131)

**Context:** Lines starting with < show the raw response metadata.

```python
# Look for lines starting with <

# Example:
# < HTTP/1.1 200 OK
# < Content-Type: text/html
# < Content-Length: 1256

# That is the raw response metadata

# After the blank line comes the body

# Pi responds
# curl -v shows:
# < HTTP/1.1 200 OK
# < Content-Type: application/json
# < Content-Length: 256
# (blank line)
# (body)
```

### 7) curl Makes Boundaries Obvious (Line ~149)

**Context:** curl doesn't manage cookies or follow redirects unless told; this forces you to confront boundaries.

```python
# curl does not:
# - Manage cookies unless told
# - Automatically follow redirects unless told
# - Hide failures

# This forces you to confront:
# - What crossed the boundary
# - What did not
# - What assumptions failed

# ESP32 POSTs sensor data
# curl shows exactly what crossed the boundary

# If cookies were expected but not sent
# curl reveals it
```

### 8) Following Redirects Explicitly (Line ~165)

**Context:** By default curl does not follow redirects; use -L to follow.

```python
# By default, curl does not follow redirects

# Try:
# curl http://example.com

# You may get:
# - 301 Moved Permanently
# - Location header pointing to https://example.com

# Nothing else happens

# Dashboard requests http://pi.local/api/config
# curl shows 301 Moved Permanently, Location: https://pi.local/api/config
# Nothing else happens

# To follow redirects:
# curl -L http://example.com

# Now curl behaves more like a browser
```

### 10) Sending Headers Explicitly (Line ~205)

**Context:** Use -H to add headers; this is how you test APIs properly.

```python
# You can add headers:

# curl -H "Accept: application/json" https://api.example.com/status

# Now you are controlling:
# - Content negotiation
# - Server behavior

# This is how you test APIs properly

# ESP32 needs JSON
# curl -H "Accept: application/json" https://pi.local/api/readings
```

### 11) Sending Bodies with curl (Line ~221)

**Context:** Use -X, -H, and -d to send POST requests explicitly.

```python
# POST example:

# curl -X POST \
#      -H "Content-Type: application/json" \
#      -d '{"voltage":12.1}' \
#      https://api.example.com/readings

# You explicitly provided:
# - Method
# - Content-Type
# - Body

# Nothing implicit
# Nothing hidden

# ESP32 POSTs temperature data
# curl -X POST -H "Content-Type: application/json" -d '{"temp":72.5}' https://pi.local/api/readings

# You explicitly provided method, Content-Type, body
```

### 12) curl as a Debugging Instrument (Line ~242)

**Context:** If curl works and your app doesn't, the bug is in your code.

```python
# When something fails:
# - Use curl
# - Reduce variables
# - Observe raw behavior

# If curl works and your app doesn't, the bug is in your code
# If curl fails, the problem is elsewhere

# Dashboard app fails, but curl works
# Bug is in your code

# curl fails too
# Problem is network, server, or configuration
```

### 13) Browser DevTools: The Other Perspective (Line ~256)

**Context:** DevTools lets you see automatic browser behaviors.

```python
# Browsers are high-level HTTP clients

# They do many things automatically:
# - Redirects
# - Cookies
# - Caching
# - Compression
# - Security enforcement

# DevTools lets you see those behaviors

# Dashboard browser automatically handles redirects, cookies, caching, compression, security
# DevTools Network tab shows all of it
```

### 14) Opening DevTools (Line ~273)

**Context:** Open Network tab and reload to watch HTTP happen.

```python
# In most browsers:
# - Right click → Inspect
# - Or F12
# - Open the Network tab

# Reload the page

# Now you are watching HTTP happen

# Dashboard loads pi.local
# Open DevTools Network tab, reload
# See HTML request, then CSS, JavaScript, images, API calls
```

### 15) The First Surprise: Quantity (Line ~288)

**Context:** A "simple" webpage triggers many HTTP requests.

```python
# Load a "simple" webpage

# You will see:
# - HTML request
# - CSS requests
# - JavaScript requests
# - Image requests
# - Font requests
# - Analytics requests

# HTTP is chatty

# Dashboard loads a "simple" page
# See HTML, CSS, JavaScript, images, fonts, analytics requests
```

### 16) The First Request Is Special (Line ~306)

**Context:** The first request is usually GET for HTML; everything else is triggered by that response.

```python
# Usually:
# - The first request is a GET for the HTML document
# - Everything else is triggered by that response

# This reveals dependency graphs, not linear flows

# Dashboard loads
# First request is GET for HTML
# Then HTML triggers CSS, JS, images
```

### 17) Inspecting a Single Request (Line ~318)

**Context:** Click a request to see headers, status, body, and timing.

```python
# Click a request

# You will see:
# - Request headers
# - Response headers
# - Status code
# - Body
# - Timing breakdown

# Everything you've studied—now concrete
```

### 18) Headers You Didn't Write (Line ~333)

**Context:** Browsers add default headers automatically.

```python
# You will see headers you did not explicitly set:
# - User-Agent
# - Accept
# - Accept-Encoding
# - Connection

# These are defaults

# Defaults matter

# Dashboard sends User-Agent, Accept, Accept-Encoding, Connection headers automatically
```

### 19) Accept-Encoding and Compression (Line ~349)

**Context:** Browsers request compression; DevTools may show decoded content.

```python
# Browsers usually send:

# Accept-Encoding: gzip, deflate, br

# Servers respond with compressed bodies

# DevTools may show decoded content—but the wire carried compressed bytes

# This matters for:
# - Performance
# - Debugging
# - Security

# Pi compresses responses
# DevTools shows decoded content, but wire carried compressed bytes
```

### 20) Seeing Redirect Chains (Line ~368)

**Context:** DevTools reveals redirect chains that browsers hide by default.

```python
# Click a redirected request

# You may see:
# - 301 → 302 → 200
# - Multiple Location headers
# - Automatic following

# The browser hides this by default
# DevTools reveals it

# Dashboard follows a redirect chain
# DevTools shows 301 → 302 → 200, multiple Location headers
```

### 21) Caching in Action (Line ~384)

**Context:** Reload shows 304 Not Modified responses; caching working, not magic.

```python
# Reload a page

# Some requests return:
# - 304 Not Modified
# - No body
# - Instant timing

# This is caching working

# Not magic
# Just headers

# Dashboard reloads
# Some requests return 304 Not Modified, no body, instant timing
```

### 22) Conditional Requests Are Visible (Line ~402)

**Context:** DevTools shows If-None-Match and 304 responses; client and server cooperating.

```python
# You will see request headers like:
# - If-None-Match
# - If-Modified-Since

# And responses:
# - 304 Not Modified

# This is client and server cooperating

# Dashboard sends If-None-Match header
# Pi responds with 304 Not Modified if unchanged
```

### 23) Timing Tells Stories (Line ~417)

**Context:** DevTools shows timing breakdown; slowness has phases.

```python
# DevTools shows:
# - DNS lookup time
# - TCP connection time
# - TLS handshake
# - Request sent
# - Waiting (TTFB)
# - Content download

# Slowness is not one thing
# It has phases

# Dashboard request is slow
# DevTools shows DNS lookup, TCP connection, TLS handshake
# Request sent, waiting (TTFB), content download
```

### 24) Seeing Failures Clearly (Line ~434)

**Context:** DevTools shows status codes, response bodies, and error headers.

```python
# When something fails:
# - Status code visible
# - Response body visible
# - Error headers visible

# This is why HTTP debugging is tractable

# ESP32 request fails
# DevTools shows status code (400, 404, 500), response body, error headers
```

### 25) CORS: The First "What Is That?" Moment (Line ~447)

**Context:** OPTIONS requests and CORS headers are browser-enforced policy, not HTTP itself.

```python
# You may see:
# - OPTIONS requests
# - Preflight checks
# - Access-Control-Allow-* headers

# This is browser-enforced policy, not HTTP itself

# Important distinction

# Dashboard sees OPTIONS requests, preflight checks, Access-Control-Allow-* headers
# This is browser-enforced policy (CORS), not HTTP itself
```

### 26) OPTIONS Requests Are Real Requests (Line ~462)

**Context:** OPTIONS requests exist to ask "Is this allowed?"

```python
# They are not imaginary

# They obey:
# - Request lines
# - Headers
# - Responses

# They exist to ask: "Is this allowed?"
```

### 27) Automatic Behavior Is Still HTTP (Line ~475)

**Context:** Just because the browser did it automatically doesn't mean HTTP rules disappeared.

```python
# Just because the browser did it automatically:
# - Does not mean HTTP rules disappeared
# - Does not mean you can ignore them

# Automatic ≠ invisible

# Dashboard browser automatically sends cookies, follows redirects, caches responses
# But these are still HTTP requests/responses
```

### 28) Comparing curl and Browser Behavior (Line ~487)

**Context:** curl is explicit and minimal; browser is automatic and stateful.

```python
# curl:
# - Explicit
# - Minimal
# - Predictable

# Browser:
# - Automatic
# - Stateful
# - Policy-enforcing

# Both are correct
# They serve different roles

# ESP32 uses curl—explicit, minimal, predictable
# Dashboard uses browser—automatic, stateful, policy-enforcing
```

### 29) Inspecting Your Own Applications (Line ~506)

**Context:** When building, you must inspect your own traffic; never trust assumptions.

```python
# When building:
# - API clients
# - Servers
# - Web apps

# You must inspect your own traffic

# Never trust assumptions
# Look

# Pi API client fails
# Inspect traffic with curl or DevTools
```

### 30) Logging Raw Requests and Responses (Line ~522)

**Context:** Log request line, headers, and status code during development; visibility beats guessing.

```python
# On servers:
# - Log request line
# - Log headers
# - Log status code

# Not forever
# Not in production verbosely

# But during development:
# - Visibility beats guessing

# Pi logs request line, headers, status code during development
```

### 31) Common Surprises You Will Encounter (Line ~539)

**Context:** Headers added by proxies, Content-Type mismatches, and cookie scoping issues are normal.

```python
# Common surprises:
# - Headers added by proxies
# - Headers removed by frameworks
# - Content-Type mismatches
# - Implicit redirects
# - Cookie scoping issues

# These are normal

# Pi receives headers added by proxies
# Content-Type mismatches, implicit redirects, cookie scoping issues
```

### 32) Frameworks Abstract—but Do Not Remove—HTTP (Line ~552)

**Context:** Frameworks wrap HTTP but don't replace it; drop down a layer when debugging.

```python
# Express, Flask, FastAPI:
# - Wrap HTTP (provide convenient abstractions)
# - Do not replace it (HTTP still happens)

# If something goes wrong:
# - Drop down a layer (bypass the framework, use curl or raw socket inspection)
# - Inspect raw behavior (see what actually crossed the wire)

# Frameworks make HTTP easier to use
# But they can also hide problems

# Pi uses Express or Flask
# Framework wraps HTTP but does not replace it
# If something goes wrong, drop down a layer, inspect raw behavior
```

### 33) Debugging Strategy: Strip It Down (Line ~568)

**Context:** Reproduce with curl, remove headers, add back one by one; scientific method applied to protocols.

```python
# When confused:
# 1. Reproduce with curl
# 2. Remove headers
# 3. Add headers back one by one
# 4. Observe changes

# This is scientific method applied to protocols

# ESP32 API call fails
# Reproduce with curl, remove headers, add back one by one, observe changes
```

### 34) Mental Model Reinforced (Line ~582)

**Context:** You should now feel intuitively how HTTP works.

```python
# What you should now feel intuitively:
# - Requests initiate
# - Responses terminate
# - Headers modify meaning
# - Bodies carry representations
# - Status codes signal outcomes
# - Failures split into HTTP errors vs network absence

# You are no longer guessing

# Dashboard requests initiate, responses terminate
# Headers modify meaning, bodies carry representations
# Status codes signal outcomes
```

### Reflection) Seeing HTTP Reflection (Line ~598)

**Context:** Walk through a complete request inspection.

```python
# Open DevTools right now (or use curl -v on Pi API)

# Pick one request:
# - Dashboard loading sensor data
# - ESP32 POSTing a reading
# - Coop controller fetching config

# Walk through it completely:

# Who initiated?
# Browser, ESP32, curl, another service

# What method?
# GET, POST, PUT, DELETE, OPTIONS

# What path?
# /api/sensors/alpha, /api/readings, /api/configs/coop

# What headers?
# Accept, Content-Type, Authorization, Cookie, User-Agent
# Which did you set, which are defaults?

# What status?
# 200 OK, 201 Created, 404 Not Found, 500 Server Error

# What body?
# Request body if POST/PUT, response body
# What format? JSON? Plain text?

# Was it cached?
# 304 Not Modified? Cache-Control headers? ETag?

# Was it redirected?
# 301, 302, 307, 308? How many hops?

# Then ask:
# - What would curl show differently?
# - What headers did the browser add automatically?
# - What would happen if you changed the Accept header?
# - What if you removed cookies?

# If you can answer those, you understand HTTP in practice
```
