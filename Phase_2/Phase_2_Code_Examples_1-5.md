# Phase 2 Code Examples (Chapters 1-5)

This file contains visual references for all code examples mentioned in Phase 2 chapters 1-5. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 2.01: Client–Server and Request–Response

### 1) Two Roles, Not Two Peers (Line ~27)

**Context:** Client initiates, server responds; these are roles in a conversation, not permanent identities.

```python
# Client: decides when to speak, opens connection, sends first message, waits
# Browser, curl, Python requests, phone app, battery monitor fetching config

# Server: listens, waits, accepts connections, receives requests, sends responses
# Web server, API endpoint, Flask process, sensor API serving readings

# Same machine can be both:
# - Raspberry Pi acts as server for dashboard
# - Raspberry Pi acts as client to fetch weather data
```

---

### 2) The Asymmetry Is the Point (Line ~87)

**Context:** Client initiates, server responds; server cannot choose when requests arrive or push messages unprompted.

```python
# The asymmetry:
# - Client initiates
# - Server responds

# Server does NOT:
# - Choose when requests arrive
# - Decide who connects
# - Push messages out of the blue

# Client does NOT:
# - Passively wait forever
# - Accept unsolicited responses
# - Receive data without asking

# This creates: clear boundaries, clear responsibilities, predictable failure modes
```

---

### 3) The Request–Response Cycle (Line ~117)

**Context:** Every HTTP interaction: client opens connection, sends request, server reads, processes, sends response.

```python
# One complete exchange:
# 1. Client opens connection to server
# 2. Client sends request
# 3. Server reads request
# 4. Server processes request
# 5. Server sends response
# 6. Connection may close or remain open

# Example: browser requests GET /api/voltage
# Server looks up latest reading, returns 200 OK with JSON
# One cycle complete

# Nothing happens outside this loop
```

---

### 4) Requests Initiate, Responses Terminate (Line ~152)

**Context:** Request starts interaction, carries intent; response ends it, carries result; always paired.

```python
# Request:
# - Starts an interaction
# - Carries intent
# - Defines what server should do NOW

# Response:
# - Ends that interaction
# - Carries the result
# - Always paired with a request

# No such thing as:
# - Response without request
# - Request without response (even if response is an error)
```

---

### 5) Servers Cannot Speak First (Line ~175)

**Context:** Server cannot notify client or push data at will; server never breaks the rule.

```python
# Server CANNOT:
# - Decide to notify a client
# - Push data at will
# - Speak without being spoken to

# If a server "notifies" you:
# - You asked it to wait (long polling)
# - Or you keep asking repeatedly (polling)
# - Or you opened a special channel (WebSocket)

# The server never breaks the rule
# This explains why polling, WebSockets, SSE, push notifications exist
```

---

### 6) One Server, Many Clients (Line ~206)

**Context:** Server handles many clients; each has own request–response exchanges; server doesn't pause for one client.

```python
# One server, many clients:
# - Server handles many clients
# - Each client has own request–response exchanges
# - Server interleaves work between them

# Server does NOT:
# - Pause its life for one client
# - Wait for one response to finish before accepting another
# - Treat requests as dependent on each other

# Creates concurrency, but NOT shared state by default
```

---

### 7) Independence of Requests (Line ~220)

**Context:** Each request is independent; server doesn't remember previous requests, doesn't know who you are.

```python
# Each request is independent
# Server does NOT:
# - Remember previous requests
# - Know who you are
# - Assume continuity

# Even if:
# - Same IP
# - Milliseconds apart
# - Look similar

# Each request stands alone
# This is statelessness
```

---

### 8) The Boundary Is the Request (Line ~240)

**Context:** Request is the boundary; server must assume it could be malformed, wrong, hostile; validate everything.

```python
# The request is the boundary
# Server must assume:
# - Request could be malformed
# - Data could be wrong
# - Intent could be hostile
# - Timing could be unexpected

# Nothing inside request is trusted:
# - Headers
# - Paths
# - Query parameters
# - Body content
# - Cookies

# Example: GET /api/voltage?sensor=1
# Validate: path exists, sensor ID in range, client allowed
# Malicious: sensor=../../etc/passwd → reject
```

---

### 9) The Response Is Also a Boundary (Line ~267)

**Context:** Response is also a boundary; from client's view, server might lie, data might be wrong, response incomplete.

```python
# Response is also a boundary
# From client's perspective:
# - Server might lie
# - Data might be wrong
# - Response might be incomplete
# - Response might arrive late

# Clients must:
# - Validate responses
# - Handle errors
# - Expect failure

# Boundaries are symmetric in risk
# Even if roles are asymmetric in initiation
```

---

### 10) The Boundary Is Conceptual, Not Physical (Line ~286)

**Context:** Client and server might be same machine or different continents; HTTP cares about roles and messages.

```python
# Client and server might be:
# - Different continents
# - Same machine
# - Different containers
# - Same process (testing)

# The boundary still exists
# HTTP doesn't care about distance
# It cares about roles and messages
```

---

### 11) Timing Lives Outside the Protocol (Line ~301)

**Context:** HTTP defines message format/order/meaning; not how long things take; timing is real but orthogonal to correctness.

```python
# HTTP defines:
# - Message format
# - Message order
# - Message meaning

# HTTP does NOT define:
# - How long something should take
# - When response must arrive
# - How quickly server should process

# That's why:
# - Clients time out
# - Servers get overloaded
# - Networks feel "slow"

# A slow response can be perfectly valid HTTP
```

---

### 12) Failure Is Still a Response (Conceptually) (Line ~322)

**Context:** If request fails (crash, disconnect, network), from client's view: request made, response expected, response didn't arrive.

```python
# If request fails:
# - Server crashes
# - Connection drops
# - Network disappears

# Dashboard requests voltage from Pi. Pi offline. WiFi blipped.
# No response. Client gets timeout—not 500, not 404.

# From client's perspective:
# - Request was made
# - Response was expected
# - Response did not arrive

# This distinguishes: HTTP errors vs transport failures vs timeouts
```

---

### 13) Why This Model Scales (Line ~343)

**Context:** Request–response scales because servers don't track clients, clients don't depend on server memory, failures isolated.

```python
# Scales because:
# - Servers don't track clients (unless explicitly designed to)
# - Clients don't depend on server memory
# - Failures are isolated
# - Work can be distributed

# This simplicity is why HTTP survived decades
```

---

### 14) Mapping Back to Phase 0 (Line ~353)

**Context:** Boundary = request/response; input = request; output = response; validation = parsing/checking; state = explicit.

```python
# Phase 0 → Phase 2:
# - Boundary → request / response
# - Input → request
# - Output → response
# - Validation → parsing and checking
# - Failure → errors, timeouts, disconnects
# - State → not implicit; must be built explicitly

# Nothing new was invented. The model was applied.
```

---

### Reflection: Client–Server Analysis (Line ~366)

**Context:** Who speaks first, who initiates, where is the boundary, what crosses it, what assumptions are safe?

```python
# When you load a webpage: who speaks first? Client (browser)
# When you call an API: who initiates? Client (your code)
# When something "updates live": how did server get permission? Client asked (poll, WebSocket)
# Where is the boundary? The request, the response
# What crosses it? Headers, paths, body, cookies
# What assumptions are safe? None—validate everything

# Failure modes:
# Client never gets response? Transport failure—timeout, WiFi, Pi offline
# Server receives malformed request? Validate at boundary—reject
# Server returns 200 but body is wrong? Client must validate response too
```

---

## Chapter 2.02: Where HTTP Lives

### 1) Protocol Layers Are Contracts, Not Implementations (Line ~29)

**Context:** Each layer makes assumptions about layer below, provides guarantees to layer above; HTTP assumes something else moves bytes.

```python
# Each protocol layer is a contract
# - Makes assumptions about layer below
# - Provides guarantees to layer above
# - Refuses responsibility outside its contract

# HTTP assumes:
# - Something else moves bytes
# - Something else establishes connections
# - Something else handles packet loss

# If those assumptions fail, HTTP doesn't "try harder"—it stops
```

---

### 2) HTTP Does Not Send Packets (Line ~51)

**Context:** HTTP operates on messages (requests, responses), not packets; writes text into a stream, assumes stream gets delivered.

```python
# HTTP does NOT:
# - Send packets
# - Route traffic
# - Retransmit lost data
# - Detect congestion
# - Handle IP addresses

# HTTP operates on messages: requests, responses
# HTTP writes text into a stream, assumes stream gets delivered
```

---

### 3) HTTP Is an Application-Layer Protocol (Line ~76)

**Context:** HTTP is for programs; describes meaning, not movement; defines methods, headers, status codes—not how bytes reach other side.

```python
# HTTP = application layer
# - Designed for programs
# - Describes meaning, not movement
# - Deals in semantics, not transport mechanics

# HTTP defines: methods, headers, status codes, message structure
# HTTP does NOT define: how bytes reach other side, how long it takes, what happens if they don't
```

---

### 4) The Layer Beneath: TCP (Usually) (Line ~98)

**Context:** HTTP runs on TCP; TCP provides reliable connection, ordered delivery, continuous byte stream; HTTP sees bytes arriving or pipe breaking.

```python
# HTTP runs on TCP (usually)
# TCP provides:
# - Reliable connection
# - Ordered delivery
# - Continuous byte stream

# From HTTP's view, TCP is:
# "Here is a pipe. Write bytes in one end. They arrive in order—or the pipe breaks."

# HTTP sees: bytes arriving, or pipe breaking
# HTTP does NOT see: packets, retransmissions
```

---

### 5) What TCP Provides (Line ~123)

**Context:** Ordered delivery (exact sequence or nothing), reliable delivery (TCP retransmits, HTTP never sees loss), continuous stream (HTTP parses).

```python
# TCP guarantees:

# 1. Ordered delivery
# GET /index.html HTTP/1.1
# Host: example.com
# → That exact sequence arrives in order, or not at all

# 2. Reliable delivery (within limits)
# - TCP retransmits lost bytes; HTTP never sees the loss
# - If TCP cannot recover, connection fails; HTTP sees nothing

# 3. Continuous stream
# - TCP presents data as stream, not messages
# - HTTP must parse: where messages start, where they end
```

---

### 6) What TCP Does Not Guarantee (Line ~161)

**Context:** TCP doesn't guarantee connection success, staying open, speed, completion; TCP can hang, stall, reset, timeout.

```python
# TCP does NOT guarantee:
# - Connection will succeed
# - Connection will remain open
# - Delivery will be fast
# - Delivery will complete
# - Remote side exists

# TCP can: hang, stall, reset, timeout, disappear
# HTTP does not override any of this
```

---

### 7) HTTP's Core Assumption (Line ~181)

**Context:** HTTP assumes: if I can write bytes and stream stays open, bytes arrive in order; reasonable but not a promise.

```python
# HTTP assumes exactly one thing:
# "If I can write bytes to the stream, and stream stays open,
#  those bytes will arrive in order."

# Everything else is outside HTTP's responsibility
# Reasonable assumption—but not a promise
```

---

### 8) When the Assumption Breaks (Line ~191)

**Context:** When transport fails, HTTP has no fallback; world is either "response arrived" or "no response arrived"—no third category.

```python
# When transport fails, HTTP has no fallback
# No: "partial HTTP error", "half response", "graceful degradation"

# From HTTP's perspective:
# 1. A response arrived
# 2. No response arrived
# No third category
```

---

### 9) Absence vs Error (Again) (Line ~206)

**Context:** HTTP error = valid response (500, headers, body). Transport failure = no response (ConnectionError, Timeout).

```python
import requests

try:
    response = requests.get("http://pi.local/api/voltage")
    # HTTP error: got Response object with status 500, headers, body
    # The exchange completed
except requests.ConnectionError:
    # Transport failure: ConnectionError, Timeout, ConnectionRefused
    # No Response object, no status code
    # Exchange never completed

# Your code must handle both
```

---

### 10) Common Transport-Level Failures (Line ~227)

**Context:** DNS failure, connection refused, timeout, network unreachable, TLS handshake failure, reset mid-transfer—HTTP cannot describe these.

```python
# Failures HTTP cannot describe:
# - DNS lookup failure (hostname wrong)
# - Connection refused (Pi offline)
# - Connection timeout (WiFi blip)
# - Network unreachable (wrong subnet)
# - TLS handshake failure
# - Connection reset mid-transfer

# In all cases:
# - No HTTP response exists
# - Code receives exception or timeout
# - Server may never have seen the request
```

---

### 11) Why This Feels "Mysterious" (Line ~246)

**Context:** "I sent a request, nothing came back, no error response"—failure occurred below HTTP; dashboard debugging.

```python
# "I sent a request. Nothing came back. No error response. What happened?"
# Answer: failure occurred below HTTP

# Dashboard "never loads" coop status:
# - Did you get a 500? (HTTP—server responded, something broke)
# - Or did request hang? (Transport—Pi offline, WiFi drop, wrong hostname)
# Different failure, different fix
```

---

### 12) Time Lives Below HTTP (Line ~264)

**Context:** HTTP doesn't define timeouts; timeouts are client/transport/application decisions; same request can work in one tool, hang in another.

```python
# HTTP does NOT define:
# - How long server may take
# - How long client should wait
# - What "too slow" means

# Timeouts are: client decisions, transport decisions, application decisions
# That's why: different clients behave differently
# Same request can "work" in curl and "hang" in Python
```

---

### 13) HTTP Is Synchronous, Transport Is Not (Line ~282)

**Context:** HTTP appears synchronous (request then response); underneath: TCP buffers, delays, congestion, retries.

```python
# HTTP appears synchronous: request → response
# But underneath: TCP buffers, networks delay, congestion, retries

# HTTP pretends complexity doesn't exist
# That abstraction is powerful—but leaky
```

---

### 14) Partial Writes, Partial Reads (Line ~298)

**Context:** HTTP writes don't map to single packets/reads; server might receive half request, pause, then rest.

```python
# HTTP writes do not map to single packets/reads/sends

# Server might:
# - Receive half a request
# - Pause
# - Then receive the rest

# HTTP implementations must:
# - Accumulate bytes
# - Detect message boundaries
# - Handle incomplete data

# This is why parsing matters
```

---

### 15) Why HTTP Is Text (Preview) (Line ~319)

**Context:** HTTP is text-based because it rides on a stream; lines, delimiters, headers, length markers are stream survival strategies.

```python
# HTTP is text-based because it rides on a stream:
# - Lines
# - Delimiters
# - Headers
# - Length markers

# Not stylistic choices—stream survival strategies
```

---

### 16) The Transport Is Shared (Line ~332)

**Context:** Network is shared; your HTTP request competes with other traffic, shares bandwidth, experiences congestion.

```python
# The network is shared
# Your HTTP request:
# - Competes with other traffic
# - Shares bandwidth
# - Experiences congestion

# HTTP doesn't know this
# It only sees: slower bytes, or no bytes
```

---

### 17) Reliability Is Probabilistic (Line ~348)

**Context:** TCP makes delivery likely, not absolute; off-grid homestead, flaky WiFi—HTTP assumes success but must handle absence.

```python
# TCP makes delivery likely, not absolute

# At scale (or homestead: flaky WiFi, Pi reboots):
# - Packets drop
# - Connections reset
# - Routes change
# - Machines reboot

# HTTP assumes success but must be prepared for absence
# This is why: retries exist, idempotency matters, failure handling is not optional
```

---

### 18) Mapping Back to Phase 0 Concepts (Line ~368)

**Context:** State = connection open/closed; Time = delays, timeouts; Failure = absence of response; Boundary = bytes crossing process.

```python
# Phase 0 → Phase 2:
# - State → connection open or closed
# - Time → delays, timeouts, waiting
# - Failure → absence of response
# - Boundary → bytes crossing process boundaries
# - Assumptions → stream reliability

# Nothing new was introduced. The model was extended.
```

---

### 19) Mental Model to Keep (Line ~380)

**Context:** HTTP is a letter, TCP is the mail service, the road can wash out; "404" is information, never arriving is absence.

```python
# Mental model:
# HTTP = carefully written letter
# TCP = mail service
# Road can wash out

# If letter arrives and says "404"—that's information
# If letter never arrives—that's absence

# Do not confuse the two
```

---

### Reflection: Layer Analysis (Line ~393)

**Context:** When request hangs, which layer failed? When you see 500, did transport succeed? What does "no response" mean?

```python
# When HTTP request hangs, which layer failed? Transport (below HTTP)
# When you see 500 error, did transport succeed? Yes—you got an HTTP response
# When your code retries, what assumptions? That it's safe to retry, idempotent
# What does "no response" mean? Transport failure—server may never have seen request

# Failure modes:
# Dashboard requests /api/voltage, nothing comes back:
# - No status = transport failure
# - 500 = HTTP error (server responded)
# Same request works in curl, hangs in Python? Different timeouts
```

---

## Chapter 2.03: What HTTP Is

### 1) HTTP Is a Protocol, Not a Library (Line ~25)

**Context:** HTTP is rules, message format, agreement—not requests (Python), fetch (JS), curl; those are tools that speak HTTP.

```python
# HTTP is NOT: requests, fetch, axios, curl, a browser feature
# Those are tools that speak HTTP

# HTTP IS:
# - A set of rules
# - A message format
# - A shared agreement between client and server

# Your Pi sensor API speaks HTTP. Your dashboard speaks HTTP. Same protocol.
# If every HTTP library vanished, HTTP would still exist—it's an idea.
```

---

### 2) HTTP Is an Application-Layer Protocol (Line ~47)

**Context:** HTTP defines meaning (requests, responses, headers, status codes), not transport (how bytes move, routing, loss handling).

```python
# HTTP = application layer
# - Defines meaning
# - Does not define transport
# - Assumes a connection exists

# HTTP describes: what request means, what response means, headers, status codes
# HTTP does NOT describe: how bytes move, packet routing, loss handling

# That separation is intentional
```

---

### 3) HTTP Is a Text Protocol (Line ~69)

**Context:** HTTP is plain text (characters, newlines), not binary; you can read, write, debug HTTP with raw tools.

```python
# HTTP is plain text—not binary, not compressed, not opaque

# A minimal request:
"""
GET /api/voltage HTTP/1.1
Host: pi.local

"""

# That's real HTTP. You could type it into a terminal.
# You can read HTTP messages
# You can write HTTP messages by hand
# You can debug HTTP with raw tools
```

---

### 4) Why HTTP Being Text Matters (Line ~94)

**Context:** Human inspectable (debugging, learning), tool independent (any language/OS/device), forward compatible (ignore unknown headers).

```python
# Text gives HTTP powerful properties:

# 1. Human inspectability
# - Look at request, understand it
# - Look at response, understand it
# - Debugging possible, learning possible

# 2. Tool independence
# - Any language can speak HTTP
# - Any OS can speak HTTP
# - Any device can speak HTTP
# - No special binary decoder required

# 3. Forward compatibility
# - Ignore unknown headers
# - Extend protocol without breaking old clients
# - Why HTTP survived decades of change
```

---

### 5) HTTP Messages Are Structured Text (Line ~126)

**Context:** Not free-form; lines, delimiters, headers, bodies, boundaries; machines parse reliably, humans read meaningfully.

```python
# HTTP is STRUCTURED text, not free-form
# Structure includes: lines, delimiters, headers, bodies, explicit boundaries

# Request structure:
# 1. Request line (method, path, version)
# 2. Headers
# 3. Blank line
# 4. Optional body

# Response structure:
# 1. Status line
# 2. Headers
# 3. Blank line
# 4. Body

# Machines parse reliably, humans read meaningfully
```

---

### 6) HTTP Is Request–Response (Line ~145)

**Context:** Every exchange: client sends request, server sends response; no spontaneous server message, no unsolicited data.

```python
# Every HTTP exchange:
# 1. Client sends a request
# 2. Server sends a response

# That's it.

# Example: coop dashboard sends GET /api/temp to Pi
# Pi responds with 200 OK and a body
# One request, one response

# There is NO:
# - Spontaneous server message
# - Unsolicited data
# - Out-of-band communication

# Everything begins with a request
```

---

### 7) Requests and Responses Are Paired (Line ~164)

**Context:** Each request has exactly one response (or none on failure); responses are always replies.

```python
# Each request has:
# - Exactly one response
# - Or no response at all (failure)

# Responses do not exist independently—they are always replies

# This pairing allows:
# - Deterministic behavior
# - Clear lifecycles
# - Clean boundaries

# "What triggered this response?" → A request. Always.
```

---

### 8) HTTP Is Stateless (Line ~180)

**Context:** Each request is independent; server doesn't remember previous requests by default; state must be sent by client.

```python
# Stateless means: each request is independent
# Server does not remember previous requests by default

# This does NOT mean:
# - Servers cannot have memory
# - Sessions do not exist
# - State is impossible

# It means: HTTP itself does not define memory between requests

# State must be:
# - Sent by the client
# - Included in the request
# - Reconstructed on each exchange
```

---

### 9) Why Statelessness Is a Feature (Line ~202)

**Context:** Scalability (any server handles any request), fault tolerance (server dies, another takes over), simplicity (each request understood in isolation).

```python
# Statelessness enables:

# 1. Scalability
# - Any server can handle any request
# - No affinity required

# 2. Fault tolerance
# - If server dies, another can take over
# - No conversational memory is lost

# 3. Simplicity
# - Each request can be understood in isolation
# - No hidden history

# This is why HTTP scaled globally
```

---

### 10) Where State Actually Lives (Line ~223)

**Context:** State carried explicitly: cookies, headers, tokens, URLs, request bodies; client carries state, server reconstructs from each request.

```python
# If HTTP is stateless, where does state go?

# State is carried explicitly via:
# - Cookies: Cookie: session=abc123
# - Headers: Authorization: Bearer xyz
# - Tokens
# - URLs: ?id=5
# - Request bodies

# The client carries state
# The server reconstructs context from each request

# Phase 0 mirrors: state explicit, absence handled, nothing assumed
```

---

### 11) HTTP Is Connection-Based, Not Connection-Oriented (Line ~242)

**Context:** HTTP uses connections but doesn't define connection management; connection lifecycle lives below HTTP.

```python
# Subtle distinction:
# HTTP uses connections
# HTTP does not define connection management

# This means:
# - HTTP messages are sent over a connection
# - But HTTP does not "own" the connection

# Connection lifecycle lives below HTTP

# From HTTP's perspective:
# - A connection exists
# - Bytes flow
# - Or the connection breaks
```

---

### 12) One Connection, Many Requests (Sometimes) (Line ~262)

**Context:** HTTP/1.1 connections can be reused for multiple requests; improves performance, doesn't change the model.

```python
# In HTTP/1.1:
# - Connections can be reused
# - Multiple requests can flow over one connection
# - Requests still remain logically separate

# This reuse:
# - Improves performance
# - Does not change the model

# Request → response remains intact
```

---

### 13) HTTP Has Versions (Line ~275)

**Context:** HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3; mental model doesn't change—still requests, responses, statelessness, headers, status codes.

```python
# HTTP evolves: HTTP/1.0 → HTTP/1.1 → HTTP/2 → HTTP/3

# Important: the mental model does not change

# Even in HTTP/2 and HTTP/3:
# - Still requests
# - Still responses
# - Still statelessness
# - Still headers
# - Still status codes

# Later versions optimize HOW messages move, not WHAT they mean
```

---

### 14) Why We Start with HTTP/1.1 (Line ~298)

**Context:** Text-readable, line-oriented, explicit, transparent; understand HTTP/1.1, then HTTP/2 and HTTP/3 are optimization/transport problems.

```python
# HTTP/1.1 is:
# - Text-readable
# - Line-oriented
# - Explicit
# - Transparent

# You can: read it, write it, understand it without tooling

# Once you understand HTTP/1.1:
# - HTTP/2 becomes an optimization problem
# - HTTP/3 becomes a transport problem
# - The core model stays the same
```

---

### 15) HTTP Is Not "Web Pages" (Line ~317)

**Context:** HTTP doesn't care about HTML, JSON, images; those are payloads; HTTP moves representations, labels them via Content-Type.

```python
# HTTP does NOT care about: HTML, JSON, images, videos
# Those are payloads

# HTTP's job is:
# - Move representations
# - Label them (via Content-Type: text/html, application/json, etc.)
# - Describe how to interpret them

# HTTP does not know what HTML means
# It only knows how to deliver it
```

---

### 16) HTTP as a Generic Transfer Protocol (Line ~337)

**Context:** Protocol for transferring representations of resources; resource can be file, calculation, state snapshot, voltage reading, coop temp.

```python
# HTTP is: a protocol for transferring representations of resources

# Not documents. Not pages. Not APIs.
# Resources.

# A resource can be:
# - A file
# - A calculation
# - A state snapshot
# - A command result
# - A voltage reading (sensor API)
# - A coop temp (dashboard endpoint)
# - A fence status (homestead API)

# HTTP doesn't define what a resource is
# It defines how to ask for one
```

---

### 17) The Separation of Meaning and Transport (Line ~361)

**Context:** HTTP defines meaning/intent/semantics; transport defines delivery/reliability/timing; knowing which layer failed is everything.

```python
# HTTP defines: meaning, intent, semantics
# Transport defines: delivery, reliability, timing

# When something goes wrong, knowing which layer failed is everything

# Example:
# 500 Internal Server Error → HTTP delivered a response; meaning layer failed
# Dropped connection/timeout → Transport layer failed; no HTTP response at all

# HTTP staying simple makes this separation possible
```

---

### 18) Mapping Back to Phase 0 and Phase 1 (Line ~381)

**Context:** Boundaries = requests/responses; State = explicit data; Time = sequence; Failure = absence vs error; Abstraction = resources.

```python
# Phase 0 → HTTP:
# - Boundaries → requests and responses
# - State → explicit data in messages
# - Time → requests occur in sequence
# - Failure → absence vs error responses
# - Abstraction → resources and representations

# HTTP is not new concepts
# It is Phase 0 applied to distributed systems
```

---

### 19) Mental Model to Lock In (Line ~393)

**Context:** HTTP is human-readable, stateless, request-response protocol that transfers representations of resources over a connection it doesn't control.

```python
# Say this out loud:
# "HTTP is a human-readable, stateless, request–response protocol
#  that transfers representations of resources
#  over a connection it does not control."

# If that sentence feels solid, the rest of HTTP will feel mechanical
```

---

### Reflection: HTTP Analysis (Line ~401)

**Context:** If HTTP is text, what advantage? If stateless, where does memory live? If doesn't control transport, how do failures surface?

```python
# If HTTP is text, what advantage? Debugging, inspection, tool independence
# If HTTP is stateless, where does memory live? Client carries it (cookies, headers, tokens)
# If HTTP doesn't control transport, how do failures surface? Exceptions, timeouts (no HTTP response)
# If HTTP doesn't know content meaning, why Content-Type? Labels payload for receiver to parse

# Failure modes:
# Dashboard fetches /api/voltage, response body is HTML (error page) not JSON:
# → HTTP delivered it. Content-Type tells you what you got. Validate.
# Pi API returns JSON, client assumes text:
# → HTTP doesn't care—it moves bytes. Client must parse.
```

---

## Chapter 2.04: HTTP as Text

### 1) HTTP Is Line-Oriented Text (Line ~19)

**Context:** HTTP messages are lines of characters, each ending with a terminator, with semantic meaning based on position.

```python
# HTTP messages are composed of lines
# Each line:
# - Is a sequence of characters
# - Ends with a line terminator
# - Has semantic meaning based on position

# HTTP is not a blob, not free-form
# It is structured, line-based text

# That structure allows: parsers to work, humans to read, tools to interoperate
```

---

### 2) Line Endings: CRLF, Not Just Newline (Line ~37)

**Context:** HTTP lines end with \r\n (carriage return + line feed); defines where lines end, where headers end, where content begins.

```python
# HTTP line ending: \r\n (CRLF)
# - \r = Carriage Return
# - \n = Line Feed

# This matters because:
# - Part of protocol definition
# - Defines where a line ends
# - Defines where headers end
# - Defines where metadata stops and content begins

# Many systems tolerate just \n
# But HTTP itself is defined in terms of CRLF
```

---

### 3) Why CRLF Exists at All (Line ~58)

**Context:** Historical from early network protocols, cross-platform compatibility; HTTP inherited it for consistency.

```python
# CRLF is historical:
# - Early network protocols
# - Cross-platform compatibility
# - Systems where carriage return and line feed were distinct actions

# HTTP inherited this convention
# Kept it for consistency and backward compatibility

# You don't need to like it
# You just need to recognize it
```

---

### 4) HTTP Messages Are Text Blocks with Structure (Line ~73)

**Context:** Every HTTP message has four parts: start line, headers (zero or more), blank line, optional body.

```python
# Every HTTP message has four conceptual parts:
# 1. A start line
# 2. Zero or more header lines
# 3. A blank line
# 4. An optional body

# No hidden sections
# No invisible metadata
# No implicit boundaries

# Everything is visible in raw text
```

---

### 5) The Blank Line Is Not Optional (Line ~89)

**Context:** Blank line (\r\n\r\n) is the delimiter between metadata and content; confusing this boundary breaks everything.

```python
# The blank line is the most important boundary in HTTP

# It is:
# - Exactly one empty line
# - Represented by \r\n\r\n
# - The delimiter between metadata and content

# Before blank line: control info, instructions, metadata
# After blank line: raw content, payload, the thing being transferred

# Confusing this boundary breaks everything
```

---

### 6) Request Messages: The General Shape (Line ~110)

**Context:** Request structure: METHOD path HTTP/version, headers, blank line, optional body.

```python
# Request message shape:
"""
METHOD path HTTP/version
Header-Name: value
Another-Header: value

[optional body]
"""

# Concrete example—dashboard asking Pi for voltage:
"""
GET /api/voltage HTTP/1.1
Host: pi.local
Accept: application/json

"""

# Visually simple. Structurally rigid.
# Every part has a role. Every line has meaning.
```

---

### 7) The Request Line Comes First (Line ~137)

**Context:** First line is the request line: METHOD path HTTP/version; tells server what to do, to what, using which version.

```python
# First line of request = request line
# Always three parts, separated by spaces:
# METHOD path HTTP/version

# Example:
# GET /api/voltage HTTP/1.1

# Tells server:
# - What you want to do (GET)
# - To what resource (/api/voltage)
# - Using which HTTP version (HTTP/1.1)

# Nothing else makes sense without this line
```

---

### 8) Headers Follow the Request Line (Line ~154)

**Context:** Headers are one per line, key-value pairs with colon separator; provide context, modify meaning, supply metadata.

```python
# After request line come headers
# - One per line
# - Key-value pairs
# - Colon as separator

# Example:
"""
Host: pi.local
User-Agent: HomesteadDashboard/1.0
Accept: application/json
"""

# Headers provide context, modify meaning, supply metadata
# They do NOT carry primary intent—that's the request line's job
```

---

### 9) Headers Are Case-Insensitive (Line ~175)

**Context:** Content-Type, content-type, CONTENT-TYPE are equivalent; parsers normalize internally; don't rely on casing.

```python
# Header names are case-insensitive

# These are equivalent:
# Content-Type
# content-type
# CONTENT-TYPE

# This matters because:
# - Different systems format differently
# - Parsers normalize internally
# - You should not rely on casing

# Protocol defines meaning, not typography
```

---

### 10) Headers Are Not Ordered (Semantically) (Line ~192)

**Context:** Headers appear in order but order doesn't usually matter; meaning from name and value, not position.

```python
# Headers appear in an order
# But that order does not usually matter

# Meaning is derived from:
# - Header name
# - Header value
# Not position

# (Some rare exceptions exist, but they are advanced and rare)
```

---

### 11) The End of Headers Is Explicit (Line ~204)

**Context:** Headers end at \r\n\r\n (double CRLF); one to end last header, one for blank line; everything after is body.

```python
# Headers end when server encounters: \r\n\r\n

# That double CRLF means:
# - One CRLF to end the last header line
# - One CRLF to represent a blank line

# From that point on:
# - Everything is body
# - Until the message ends

# This explicit boundary allows streaming and parsing
```

---

### 12) The Request Body Is Optional (Line ~220)

**Context:** GET usually has no body; POST, PUT, PATCH often do; body starts after blank line, may contain arbitrary bytes.

```python
# Not all requests have bodies

# Common examples:
# - GET requests usually do not have body
# - POST, PUT, PATCH often do

# If a body exists:
# - Starts immediately after the blank line
# - May contain arbitrary bytes
# - HTTP itself does not interpret it

# HTTP only cares that a body exists, not what it means
```

---

### 13) Responses Have the Same Overall Shape (Line ~235)

**Context:** Response: HTTP/version status_code reason_phrase, headers, blank line, optional body.

```python
# Response message shape:
"""
HTTP/version status_code reason_phrase
Header-Name: value
Another-Header: value

[optional body]
"""

# Concrete example—Pi replying with voltage:
"""
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 24

{"voltage": 12.4}
"""

# Same components, same blank line, same metadata/content separation
# Difference is in the start line
```

---

### 14) The Status Line Comes First in Responses (Line ~265)

**Context:** First line of response is status line: HTTP/version status_code reason_phrase; tells client version, success, how to interpret.

```python
# First line of response = status line
# Contains: HTTP/version status_code reason_phrase

# Example:
# HTTP/1.1 200 OK
# HTTP/1.1 404 Not Found
# HTTP/1.1 500 Internal Server Error

# Tells client:
# - Which HTTP version responded
# - Whether the request succeeded (status code)
# - How to interpret the response

# Status line is the server's primary signal
```

---

### 15) The Reason Phrase Is Informational (Line ~280)

**Context:** Reason phrase ("OK", "Not Found") is human-readable, not machine-critical; clients rely on numeric status code.

```python
# Reason phrase (e.g., "OK", "Not Found") is:
# - Human-readable
# - Optional in meaning
# - Not machine-critical

# Clients rely on:
# - The numeric status code (200, 404, 500)
# - NOT the text phrase

# The phrase exists for readability, not logic
```

---

### 16) Response Headers Follow the Status Line (Line ~293)

**Context:** Response headers describe body, control caching, set cookies, signal content type; one per line, key-value, case-insensitive.

```python
# After status line come response headers

# These headers:
# - Describe the body
# - Control caching
# - Set cookies
# - Signal content type
# - Modify client behavior

# Just like request headers:
# - One per line
# - Key-value pairs
# - Case-insensitive
```

---

### 17) The Response Body Is Optional (Line ~309)

**Context:** 204 No Content has no body; 304 Not Modified has no body; presence defined by status code, headers, context.

```python
# Not all responses have bodies

# Examples:
# - 204 No Content has no body
# - 304 Not Modified has no body
# - Some error responses include bodies, some don't

# Presence of body is defined by:
# - Status code
# - Headers
# - Context

# HTTP defines structure, not meaning
```

---

### 18) HTTP Does Not Care What the Body Contains (Line ~325)

**Context:** HTTP doesn't understand HTML, JSON, images; only transfers bytes, labels via headers, delivers intact.

```python
# HTTP does NOT understand: HTML, JSON, images, binary data

# HTTP only:
# - Transfers bytes
# - Labels them via headers
# - Delivers them intact

# Meaning lives above HTTP
# This separation is intentional
```

---

### 19) Content Is Interpreted by the Client (Line ~344)

**Context:** Client decides how to parse, render, decode body based on Content-Type, Content-Encoding; HTTP remains neutral.

```python
# The client decides:
# - How to parse the body
# - How to render it
# - How to decode it

# Based on headers like:
# - Content-Type
# - Content-Encoding

# HTTP itself remains neutral
```

---

### 20) Seeing HTTP as a Boundary (Line ~357)

**Context:** HTTP messages are boundary crossings (client→server, server→client); text format is the contract, validation surface.

```python
# Reconnect to Phase 0.8

# HTTP messages are boundary crossings:
# - Request: client → server
# - Response: server → client

# The text format is:
# - The contract
# - The validation surface
# - The explicit interface

# Nothing crosses implicitly
# Everything is written down
```

---

### 21) Why This Mental Model Matters (Line ~373)

**Context:** Understanding HTTP as text: stop blaming "the network", read raw logs, debug with curl, reason about failures.

```python
# If you understand HTTP as text:
# - You stop blaming "the network" blindly
# - You can read raw logs
# - You can debug with curl
# - You can reason about failures
# - You can build servers from scratch if needed

# Abstractions become optional, not required
```

---

### 22) What Libraries Hide (And Why You Still Need This) (Line ~384)

**Context:** Libraries assemble requests, add headers, parse responses; when something fails, you debug the raw text.

```python
# Libraries:
# - Assemble request lines for you
# - Add headers automatically
# - Parse responses into objects

# That's useful.

# But when something goes wrong:
# - You debug the raw text
# - You inspect the wire format
# - You reason about boundaries

# Understanding the text keeps you grounded
```

---

### 23) Mental Checklist for Any HTTP Message (Line ~400)

**Context:** For any raw HTTP: what's start line? Where do headers end? Is there body? What headers describe body? What crossed boundary?

```python
# When you see raw HTTP, ask:
# 1. What is the start line?
# 2. Where do headers end?
# 3. Is there a body?
# 4. What headers describe that body?
# 5. What crossed the boundary?

# This checklist works for:
# - Requests
# - Responses
# - Logs
# - Proxies
# - Debug traces
```

---

### Reflection: HTTP Text Analysis (Line ~416)

**Context:** Can you identify CRLFs, blank line, separate headers from body, explain each line's role?

```python
# Raw HTTP analysis:
"""
GET /api/voltage HTTP/1.1\r\n      # Request line: method, path, version
Host: pi.local\r\n                 # Header: required for HTTP/1.1
Accept: application/json\r\n       # Header: tells server what we want
\r\n                               # Blank line: end of headers
"""                                # No body for GET

"""
HTTP/1.1 200 OK\r\n                # Status line: version, code, phrase
Content-Type: application/json\r\n # Header: describes body format
Content-Length: 18\r\n             # Header: body size in bytes
\r\n                               # Blank line: end of headers
{"voltage": 12.4}                  # Body: the actual content
"""

# Failure modes:
# Response body is HTML but Content-Type says application/json:
# → Structure is valid HTTP. Semantics are wrong. Parse with care.
# Header malformed (missing colon):
# → Parser breaks at blank line. Knowing format helps pinpoint where.
```

---

## Chapter 2.05: Statelessness and Connection Lifecycle

### 1) What Statelessness Actually Means (Line ~22)

**Context:** Each request is processed independently; server doesn't remember previous requests/responses; every request must carry everything.

```python
# HTTP is stateless means:
# Each request is processed independently of all other requests

# Server does NOT automatically remember:
# - Previous requests
# - Previous responses
# - Previous decisions
# - Previous failures
# - Previous successes

# Every request must carry everything the server needs to understand it
```

---

### 2) Statelessness Is a Property of the Protocol (Line ~38)

**Context:** Not a limitation—a design choice; any request handled in isolation, any server can handle any request, retries safe.

```python
# Statelessness is NOT:
# - A server limitation
# - A hardware constraint
# - A performance optimization

# Statelessness IS: a protocol design choice

# HTTP was designed so that:
# - Any request can be handled in isolation
# - Any server instance can handle any request
# - Requests can be retried safely
# - Failures do not corrupt shared memory

# Statelessness is what makes the web scale
```

---

### 3) What the Server Does Not Remember by Default (Line ~55)

**Context:** Server doesn't remember dashboard fetched voltage, coop authenticated, sensor failed; if server appears to remember, state was explicitly carried.

```python
# By default, HTTP server does NOT remember:
# - Dashboard fetched voltage five seconds ago
# - Coop controller authenticated earlier
# - Solar logger was queried before
# - Sensor reading failed last time
# - Poultry net status was checked previously

# If server appears to remember, state was explicitly carried
```

---

### 4) Where State Must Live If HTTP Is Stateless (Line ~67)

**Context:** State carried in URLs, headers, request bodies; nothing remembered unless it crosses the boundary.

```python
# If server doesn't remember state implicitly, state must be carried explicitly

# Common places state lives:
# - URLs: /api/voltage?sensor=1
# - Headers: Authorization: Bearer xyz
# - Headers: Cookie: session=abc123
# - Request bodies: {"device_id": "esp32_coop"}

# Nothing is remembered unless it crosses the boundary
# This is Phase 0.8: boundaries are where data must be explicit
```

---

### 5) Statelessness Does Not Mean "No Sessions" (Line ~82)

**Context:** Sessions exist, authentication exists—implemented on top of HTTP, not inside it; HTTP provides request, response, no memory.

```python
# Sessions exist
# Authentication exists
# Stateful APIs exist (coop controllers, sensor aggregators, solar loggers)

# But they are implemented ON TOP of HTTP, not inside it

# HTTP provides:
# - A request
# - A response
# - No memory

# Everything else is layered above
```

---

### 6) Connections Are a Separate Concern (Line ~98)

**Context:** Connections belong to transport layer (TCP); bidirectional byte stream established before HTTP messages, torn down after.

```python
# Connections are NOT HTTP
# Connections belong to transport layer (usually TCP)

# A connection is:
# - A bidirectional byte stream
# - Established before HTTP messages are sent
# - Torn down after communication ends

# HTTP messages are sent THROUGH connections
# They do not define them
```

---

### 7) Why Connections Exist at All (Line ~116)

**Context:** Connections establish path, handle ordering, handle retransmission, provide reliable delivery; HTTP assumes connection already exists.

```python
# Connections exist to:
# - Establish a path between client and server
# - Handle packet ordering
# - Handle retransmission
# - Provide reliable delivery

# HTTP does not do any of that
# It assumes the connection already exists
```

---

### 8) HTTP/1.0: One Request per Connection (Line ~128)

**Context:** Open TCP, send one request, receive one response, close; every request required new connection.

```python
# HTTP/1.0 (historical):
# 1. Client opens a TCP connection
# 2. Client sends one request
# 3. Server sends one response
# 4. Connection closes

# Every request required a new connection
# This worked, but it was slow
```

---

### 9) HTTP/1.1: Connection Reuse (Keep-Alive) (Line ~141)

**Context:** Persistent connections; send multiple requests over one connection; requests remain independent.

```python
# HTTP/1.1 introduced persistent connections (keep-alive):
# 1. Client opens a TCP connection
# 2. Client sends request #1
# 3. Server sends response #1
# 4. Connection stays open
# 5. Client sends request #2
# 6. Server sends response #2
# 7. Repeat until closed

# Example: dashboard polls Pi every 5 seconds
# - GET /api/voltage
# - GET /api/temp
# - GET /api/fence
# All use one TCP connection
# Requests remain independent—each carries own auth token
```

---

### 10) Connection Reuse Is About Efficiency (Line ~157)

**Context:** Opening TCP is expensive (handshake, latency, resources); reuse reduces overhead, improves performance; does NOT create memory.

```python
# Connection reuse exists for one reason: efficiency

# Opening a TCP connection is expensive:
# - Handshake
# - Latency
# - Resource allocation

# Reusing a connection:
# - Reduces overhead
# - Improves performance
# - Lowers latency

# It does NOT create memory
```

---

### 11) Reused Connection ≠ Remembered Client (Line ~176)

**Context:** Same TCP connection reused, requests seconds apart, same socket—server STILL treats each request as stateless.

```python
# MOST IMPORTANT DISTINCTION IN THIS CHAPTER

# Even if:
# - Same TCP connection is reused
# - Requests arrive seconds apart
# - Same socket is used

# The server still treats each request as stateless

# The pipe being reused does NOT imply:
# - Identity
# - Continuity
# - Trust
# - Memory

# It only implies efficiency
```

---

### 12) The Illusion of Memory (Line ~196)

**Context:** "Server remembered me because same connection"—false; client carried memory (API key, device ID, auth token), server just read it.

```python
# Common misconception:
# "The server remembered me because it was the same connection."

# That is FALSE.

# What actually happened:
# - Dashboard sent API key AGAIN
# - ESP32 sensor sent device ID AGAIN
# - Coop controller included auth token AGAIN

# The client carried the memory
# The server simply read it
```

---

### 13) Statelessness Enables Horizontal Scaling (Line ~213)

**Context:** Requests independent: any server handles any request, load balancers distribute freely, crashed servers don't corrupt state.

```python
# Because requests are independent:
# - Any server instance can handle any request
# - Load balancers can distribute traffic freely
# - Crashed servers do not corrupt shared state

# This is not accidental
# This is the reason HTTP won

# Stateful protocols do not scale this easily
```

---

### 14) The Connection Lifecycle, Step by Step (Line ~226)

**Context:** Establishment (DNS, TCP, handshake), request transmission, server processing, response transmission, connection decision.

```python
# Step 1: Connection Establishment
# - Resolve DNS (pi.local → IP address)
# - Open TCP connection
# - Complete handshake
# No HTTP yet—just a pipe

# Step 2: Request Transmission
# - Request line: GET /api/voltage HTTP/1.1
# - Headers: Host: pi.local, Authorization: Bearer token123
# - Blank line
# - Optional body
# All as text, all over the connection

# Step 3: Server Processing
# - Read request
# - Parse text
# - Validate headers (check auth token)
# - Process request (read sensor)
# - Generate response
# No assumptions about prior requests—even if 100th request on this connection

# Step 4: Response Transmission
# - Status line
# - Headers
# - Blank line
# - Optional body
# Text over the connection

# Step 5: Connection Decision
# - Close the connection
# - Or keep it open
# Depends on headers, server config, timeouts, resource availability
```

---

### 15) When Connections Close Immediately (Line ~289)

**Context:** HTTP/1.0 (default), either side sends Connection: close, server decides not to keep alive; closure is normal.

```python
# Connections close immediately when:
# - HTTP/1.0 is used (by default)
# - Either side sends: Connection: close
# - Server decides not to keep it alive

# Closure is normal
# Clients must be prepared for it
```

---

### 16) When Connections Stay Open (Line ~300)

**Context:** HTTP/1.1, neither side requests closure, timeouts not expired; client may send another request.

```python
# Connections stay open when:
# - HTTP/1.1 is used
# - Neither side requests closure
# - Timeouts have not expired

# The client may then send another request
```

---

### 17) Idle Timeouts Exist (Line ~310)

**Context:** Connections don't stay open forever; servers impose idle timeouts, max request counts; connection may disappear without warning.

```python
# Connections do NOT stay open forever

# Servers impose:
# - Idle timeouts
# - Maximum request counts
# - Resource limits

# Clients must assume:
# - Connection may disappear at any time
# - Without warning
# - Without an HTTP response
```

---

### 18) Connection Failure vs Statelessness Failure (Line ~325)

**Context:** Connection failure: no response, timeout, reset (transport). Statelessness issue: missing cookies/headers/tokens (application).

```python
# These are DIFFERENT failures:

# Connection failure (transport-level):
# - No response, timeout, reset
# - Pi went offline, network dropped

# Statelessness issue (application-level):
# - Missing cookies, missing headers, missing tokens
# - Dashboard forgot to send API key

# Example: dashboard gets 401 Unauthorized
# Is connection broken? NO—HTTP delivered a response
# The statelessness layer failed: missing or invalid auth token

# Confusing them leads to bad debugging
```

---

### 19) Retry Safety and Statelessness (Line ~337)

**Context:** Statelessness enables retries; if request fails mid-flight, client can retry safely if request designed correctly.

```python
# Statelessness enables retries

# If a request:
# - Fails mid-flight (connection drops)
# - Never reaches the server (timeout)
# - Loses the response (network hiccup)

# Client can retry safely if request is designed correctly

# Example: ESP32 sensor sends temperature reading
# Connection drops. Retry same request.
# Server doesn't know it was attempted before. Safe.

# Stateful servers make retries dangerous
# Stateless servers make retries normal
```

---

### 20) Why Idempotency Matters Here (Line ~352)

**Context:** Some methods safe to retry, some not; connections drop, requests lost, responses disappear; statelessness + retries requires careful design.

```python
# Some HTTP methods are safe to retry
# Some are not

# This matters because:
# - Connections can drop
# - Requests can be lost
# - Responses can disappear

# Statelessness + retries requires careful design
# This will matter more in later chapters
```

---

### 21) Mental Model: Pipe vs Memory (Line ~366)

**Context:** Connection = pipe, request = message, statelessness = no memory between messages; pipe can stay, memory does not.

```python
# Lock this model in:
# Connection = pipe
# Request = message
# Statelessness = no memory between messages

# The pipe can stay
# The memory does not
```

---

### 22) How Browsers Make Statelessness Feel Stateful (Line ~377)

**Context:** Browsers auto-resend cookies, attach headers, follow redirects, reuse connections; creates illusion of continuity.

```python
# Browsers:
# - Automatically resend cookies
# - Automatically attach headers
# - Automatically follow redirects
# - Automatically reuse connections

# This creates the illusion of continuity

# Underneath, it is still stateless text exchanges
```

---

### 23) Why This Matters for APIs (Line ~390)

**Context:** Every request stands alone; validate every request fully; don't rely on prior calls; APIs relying on "before" break under load.

```python
# When you build APIs:
# - You must assume every request stands alone
# - You must validate every request fully
# - You must not rely on prior calls

# APIs that rely on "what happened before" break under load
```

---

### 24) Statelessness Is a Constraint, Not a Limitation (Line ~400)

**Context:** Forces discipline: explicit inputs, validation, identity, state transfer; produces resilient, scalable, debuggable systems.

```python
# Statelessness forces discipline:
# - Explicit inputs
# - Explicit validation
# - Explicit identity
# - Explicit state transfer

# This discipline produces:
# - Resilient systems
# - Scalable systems
# - Debuggable systems
```

---

### Reflection: Statelessness and Connections (Line ~414)

**Context:** Why does dashboard "remember" login? Why might identical requests behave differently? Does open connection mean server remembers?

```python
# If HTTP is stateless, why does dashboard "remember" you're logged in?
# → Client carries the session cookie in every request

# If connections can be reused, why might two identical requests behave differently?
# → State changed (auth expired, server limit hit, resource depleted)

# If connection stays open, does server remember you?
# → No. Pipe stays. Memory does not.

# Failure modes:
# Dashboard fetches /api/voltage twice. First succeeds, second gets 401.
# Same connection. What changed?
# → Auth token expired. Each request must carry valid credentials.

# ESP32 sends reading. No response. Connection timeout.
# Transport (connection broke) or application (server crashed)?
# → Check: did you get ANY HTTP response at all?

# Coop controller makes 3 requests on one connection. Third fails.
# Connection still open. Why?
# → Server hit resource limit or timeout. Connection reuse ≠ guaranteed success.
```
