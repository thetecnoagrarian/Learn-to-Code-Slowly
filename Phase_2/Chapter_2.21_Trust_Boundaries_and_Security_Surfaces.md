# Phase 2 · Chapter 2.21: Trust Boundaries and Security Surfaces

This chapter builds on [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.18: URLs, Paths, and Query Strings](Chapter_2.18_URLs_Paths_and_Query_Strings.md), [Chapter 2.19: Request Bodies and Content Types](Chapter_2.19_Request_Bodies_and_Content_Types.md), and [Chapter 2.20: Cookies and Session State](Chapter_2.20_Cookies_and_Session_State.md). We have seen how requests carry data in headers, cookies, paths, query strings, and bodies. Here we make explicit what Phase 0.8 established: boundaries are where validation lives, and HTTP is nothing but boundaries. Every byte that crosses the boundary is suspect—there is no safe part of an HTTP request.

Phase 0.8 established a foundational rule:

Boundaries are where validation lives.

HTTP is nothing but boundaries.

Every request crosses from an untrusted environment into a trusted one.
Every response crosses back.
Every byte is suspect.

This chapter makes that explicit.

There is no “safe” part of an HTTP request.
There is no “harmless” header.
There is no “obviously honest” cookie.

There is only input.



## 1) The HTTP Boundary Is Absolute

From the server’s perspective:
	•	The client is outside
	•	The server is inside
	•	Everything that crosses the line is input

There are no exceptions.

Not headers.
Not cookies.
Not paths.
Not methods.

Everything arrives from the other side of the boundary.

Example: Your Pi receives a request—every header, cookie, path, method, and body byte came from the client. Your ESP32 sensor node, your dashboard browser, your coop controller app—all are on the other side of the boundary. Everything arrives from the other side of the boundary.



## 2) Input Is Not Just the Body

A common beginner mistake:

“The body is input. Headers are metadata.”

This is wrong.

In HTTP:
	•	Headers are input
	•	Cookies are input
	•	Path is input
	•	Query string is input
	•	Method is input
	•	Version is input

The entire request is data from an untrusted source.

Example: Your Pi receives a request with headers, cookies, path, query string, method, and body—all are data from an untrusted source. Your solar dashboard, your pig barn controller, your electric poultry net config UI—same rule. The entire request is data from an untrusted source.



## 3) Headers Are Client-Supplied Data

Every header in a request:
	•	Was sent by the client
	•	Can be altered by the client
	•	Can be forged by the client

There is no such thing as a “server-generated request header.”

Example: Your Pi receives a request—every header was sent by the client. Your dashboard browser, your ESP32 sensor node, your coop controller app—all send headers. Your Pi cannot generate headers for incoming requests; every header is client-supplied data. There is no such thing as a "server-generated request header."




## 4) User-Agent Is a Lie

The User-Agent header:
	•	Claims what browser or client is being used
	•	Is frequently spoofed
	•	Is often meaningless

You may log it.
You may inspect it.
You may not trust it.

Example: Your Pi logs User-Agent for debugging, but never uses it for authorization. An attacker can send User-Agent: "TrustedESP32" or "AdminDashboard"—your Pi must not trust it. Or your coop controller: you may log User-Agent; you may not trust it.



## 5) Referer Is Optional and Unreliable

The Referer header:
	•	May be missing
	•	May be truncated
	•	May be spoofed
	•	May be intentionally suppressed

It can help with debugging.
It cannot enforce security.

Example: Your Pi might check Referer to see where a request came from, but an attacker can spoof or omit it. Your solar dashboard or poultry net config: Referer can help with debugging; it cannot enforce security.



## 6) X-Anything Means Nothing

Custom headers:

X-User-Id: 42
X-Admin: true
X-Trusted: yes

Mean nothing by themselves.

Any client can send them.
Any script can add them.
Any attacker can forge them.

Example: Your Pi receives X-User-Id: 42 or X-Admin: true—any client can send these. Your dashboard, ESP32, or attacker's script can forge them. X-anything means nothing; any attacker can forge them.



## 7) Headers Are Hints, Not Truth

Treat headers as:
	•	Hints
	•	Suggestions
	•	Context

Never treat them as:
	•	Authority
	•	Identity
	•	Permission

Example: Your Pi receives X-Admin: true—treat it as a hint at best, never as authority. Your coop controller or cow barn dashboard: headers are hints, not truth. Never treat them as authority, identity, or permission.



## 8) Cookies Are Input Too

Cookies feel special because:
	•	Browsers manage them
	•	They’re automatic
	•	They persist

None of that makes them trustworthy.

Cookies are client-controlled input.

Example: Your Pi receives Cookie: session_id=abc123—the client sent it, the client can modify it, the client can forge it. Your dashboard browser manages cookies, but they are still client-controlled input. Cookies are client-controlled input.



## 9) Cookies Are Ambient Authority

Cookies are sent:
	•	Automatically
	•	With every matching request
	•	Without user intent

This makes them dangerous.

The server sees:

Cookie: session=abc123

But it has no idea why the request was sent.

Example: Your Pi receives Cookie: session=abc123—was it a legitimate button click, a malicious script, a CSRF attack, or a forged form? Your Pi cannot tell. Your solar dashboard or poultry net config: the server cannot see intent; it has no idea why the request was sent.



## 10) The Server Cannot See Intent

From the server’s perspective:
	•	A legitimate button click
	•	A malicious script-triggered request
	•	A background fetch
	•	A forged form submission

All look identical.

Intent does not cross the boundary.

Example: Your Pi receives a request with a valid session cookie—was the user tricked into clicking a link on evil.com, or did they click your button? Your coop controller or pig barn dashboard: intent does not cross the boundary.



## 11) This Is Why CSRF Exists

Cross-Site Request Forgery exists because:
	•	Cookies are automatic
	•	Browsers send them without asking
	•	Servers trust them

The protocol does not distinguish “user intended” from “user tricked.”

Example: Your Pi receives a POST to /api/config with a valid session cookie—was it from your dashboard UI or from a form on evil.com? HTTP does not distinguish "user intended" from "user tricked." This is why CSRF exists. Your solar dashboard or poultry net config: cookies are automatic, browsers send them without asking, servers trust them—but the protocol cannot see intent. This is why CSRF exists.




## 12) Cookies Carry Identity, Not Permission

A cookie may carry:
	•	A session ID
	•	A token
	•	A reference

It does not carry:
	•	Authorization
	•	Permission
	•	Trust

Those must be verified server-side.

Example: Your Pi receives Cookie: session_id=abc123—the cookie carries identity (a session ID), not permission. Your Pi must look up the session, check roles, verify authorization. Your dashboard or coop controller: cookies carry identity, not permission; those must be verified server-side.



## 13) Never Trust Cookie Values

Bad idea:

Cookie: role=admin

Worse idea:

Cookie: is_logged_in=true

The client can change both.

Cookies can identify.
They cannot authorize.

Example: Your Pi must never check "if cookie says role=admin then allow"—the client can change it. Your cow barn dashboard or poultry net config: cookies can identify; they cannot authorize.



## 14) Session IDs Are Keys, Not Data

A session cookie:
	•	Identifies a session
	•	Points to server-side state
	•	Has no meaning on its own

All authority lives behind the boundary.

Example: Your Pi stores session data (roles, permissions) in Redis or a database; the cookie only holds the session ID. Your dashboard or ESP32: session IDs are keys, not data; all authority lives behind the boundary.



## 15) The Path Is Input

Paths feel structural:

/admin
/users/42
/api/delete

They are still client-provided data.

Attackers:
	•	Guess paths (e.g. /admin, /api/admin, /admin/users)
	•	Manipulate IDs (e.g. /users/42 → /users/999999, or /users/1 → /users/0)
	•	Traverse directories (e.g. /api/../config, /static/../../etc/passwd)
	•	Probe hidden endpoints (e.g. /api/v1, /api/v2, /api/internal)

Never assume the path implies permission. The path is just a string the client sent—validate it, normalize it, check authorization separately.

Example: Your Pi receives DELETE /api/users/42—the path suggests admin action, but an attacker can send it. Your solar dashboard or coop controller: paths are input; never assume the path implies permission.



## 16) Query Strings Are Input

Query parameters:

?user_id=42
?is_admin=true

Are just as forgeable as headers.

Treat them as untrusted data.

Example: Your Pi receives ?user_id=42&is_admin=true—query strings are just as forgeable as headers. Your dashboard or ESP32: query strings are input; treat them as untrusted data.



## 17) HTTP Method Is Input

The client chooses the method.

A client can send:

DELETE /users/42

Even if your UI never exposes it.

Authorization must not depend on “the UI wouldn’t do that.”

Example: Your dashboard UI never shows a DELETE button, but an attacker can send DELETE /api/sensors/17 directly. Your Pi must authorize based on session and roles, not on "the UI wouldn't do that." Your coop controller or cow barn dashboard: the client chooses the method; authorization must not depend on "the UI wouldn't do that."




## 18) Version Is Input

Even the protocol version:

HTTP/1.1

Is supplied by the client.

Servers must handle malformed or unexpected versions safely.

Example: Your Pi receives HTTP/0.9 or HTTP/3.0 or malformed version strings—must handle them safely. Your coop controller or poultry net config: version is input; servers must handle malformed or unexpected versions safely.



## 19) Bodies Are Input

This part is obvious—but still worth stating:
	•	JSON bodies
	•	Form data
	•	Multipart uploads

All untrusted.

Validation belongs at the boundary.

Example: Your Pi receives JSON, form data, or multipart uploads—all untrusted. Your solar dashboard posts temperature readings, your pig barn controller uploads images—validation belongs at the boundary. Bodies are input; validation belongs at the boundary.



## 20) Validation Is Not Optional

Validation is not:
	•	An optimization
	•	A best practice
	•	A “nice to have”

It is the definition of the boundary.

Example: Your Pi validates every request—presence, type, range, authorization. Your dashboard, ESP32, coop controller—validation is not optional; it is the definition of the boundary.



## 21) Validate Presence

Is the field there?

Missing data is a failure mode.

Do not assume:
	•	Headers exist
	•	Cookies exist
	•	Fields exist

Example: Your Pi checks if Authorization header exists before using it. Your dashboard might not send a cookie; your ESP32 might omit a field. Validate presence; do not assume headers, cookies, or fields exist.



## 22) Validate Type

Is the data the type you expect?
	•	String vs number
	•	Integer vs float
	•	Object vs list

Type confusion is a common exploit vector.

Example: Your Pi expects a number but receives "42" (string) or "true" (boolean)—type confusion can lead to bugs or exploits. Your solar dashboard or poultry net config: validate type; type confusion is a common exploit vector.



## 23) Validate Range

Is the value reasonable?
	•	IDs in expected range
	•	Length limits
	•	Time windows

Unbounded input is dangerous.

Example: Your Pi receives a sensor ID—must validate it is in the expected range (1-100), not 999999 or negative. Your coop controller or cow barn dashboard: validate range; unbounded input is dangerous.



## 24) Validate Authorization Separately

Never combine:
	•	Identity
	•	Authentication
	•	Authorization

Each must be checked independently.

Example: Your Pi checks identity (who is this?), authentication (are they logged in?), and authorization (can they do this?) separately. Your dashboard or ESP32: never combine identity, authentication, and authorization; each must be checked independently.



## 25) “The Client Would Never Send That” Is Not a Defense

Clients:
	•	Are buggy
	•	Are scripted
	•	Are malicious
	•	Are controlled by attackers

Assume the worst.

Example: Your Pi assumes clients are buggy, scripted, malicious, or controlled by attackers. Your solar dashboard, coop controller, or poultry net config: "the client would never send that" is not a defense; assume the worst.



## 26) Servers Do Not Trust Clients

This is not cynicism.
It is architecture.

The server:
	•	Validates
	•	Verifies
	•	Rejects

Always.

Example: Your Pi validates, verifies, and rejects—always. Your dashboard, ESP32, or any client—servers do not trust clients. This is not cynicism; it is architecture. Always.



## 27) Clients Also Live in Hostile Environments

The boundary goes both ways.

Clients must assume:
	•	Servers can lie
	•	Responses can be malformed
	•	Content can be malicious

Example: Your dashboard browser receives a response from your Pi—must validate Content-Type, parse carefully, avoid executing unexpected content. Your ESP32 or coop controller app: clients also live in hostile environments; content can be malicious.



## 28) Clients Validate Responses Too

Client-side validation includes:
	•	Checking status codes
	•	Validating Content-Type
	•	Parsing carefully
	•	Avoiding execution of unexpected content

Example: Your dashboard validates status codes, checks Content-Type, parses JSON carefully, never evaluates response data as code. Your solar dashboard or poultry net UI: clients validate responses too; avoiding execution of unexpected content.



## 29) Never Execute Response Data Blindly

Classic failures:
	•	Injecting HTML directly (XSS)
	•	Evaluating JSON as code
	•	Trusting script responses

Responses are also input.

Example: Your dashboard must not inject HTML directly (XSS), evaluate JSON as code, or trust script responses blindly. Your coop controller or pig barn app: never execute response data blindly; responses are also input.



## 30) The Browser Is Not a Safe Space

Browsers:
	•	Execute code
	•	Load third-party scripts
	•	Share global state

Trust boundaries still apply.

Example: Your dashboard browser executes code, loads third-party scripts, shares global state—trust boundaries still apply. Your solar panel UI or poultry net config: the browser is not a safe space; trust boundaries still apply.



## 31) Same-Origin Policy Is Not Absolute

The browser enforces rules.

Attackers:
	•	Find edge cases
	•	Abuse misconfigurations
	•	Exploit CORS mistakes

Do not rely on the browser alone.

Example: Your Pi sets CORS headers, but attackers find edge cases, abuse misconfigurations, exploit CORS mistakes. Your dashboard or ESP32: same-origin policy is not absolute; do not rely on the browser alone.



## 32) CORS Is a Boundary Control

CORS controls:
	•	Which origins may read responses

It does not:
	•	Authenticate
	•	Authorize
	•	Validate input

Example: Your Pi sets CORS headers to allow your dashboard origin—CORS controls which origins may read responses, but it does not authenticate, authorize, or validate input. Your coop controller or solar dashboard: CORS is a boundary control; it does not validate input.



## 33) Security Is Layered, Not Singular

No single mechanism protects you:
	•	Not cookies
	•	Not headers
	•	Not HTTPS
	•	Not CORS

Each layer assumes the others can fail.

Example: Your Pi uses HTTPS, cookies, headers, CORS—no single mechanism protects you. Your dashboard or ESP32: security is layered, not singular; each layer assumes the others can fail.



## 34) Fail Closed, Not Open

When validation fails:
	•	Reject the request
	•	Return an error
	•	Log the event

Do not guess.
Do not continue.

Example: Your Pi receives invalid input—rejects the request, returns an error, logs the event. Does not guess, does not continue. Your solar dashboard or poultry net config: fail closed, not open; do not continue.



## 35) Silence Is Dangerous

Ignoring malformed input:
	•	Hides bugs
	•	Enables probing
	•	Encourages exploitation

Explicit rejection is safer.

Example: Your Pi explicitly rejects malformed input with a clear error—hides nothing, enables no probing. Your coop controller or cow barn dashboard: silence is dangerous; explicit rejection is safer.



## 36) Error Messages Are Also a Surface

Error responses can:
	•	Leak information
	•	Reveal structure
	•	Aid attackers

Balance clarity with restraint.

Example: Your Pi returns an error message—must balance clarity (user needs to know what went wrong) with restraint (do not leak structure or aid attackers). Your dashboard or ESP32: error messages are also a surface; balance clarity with restraint.



## 37) Logging Is a Defensive Tool

Log:
	•	Validation failures
	•	Authorization failures
	•	Unexpected inputs

Logs reveal attack patterns.

Example: Your Pi logs validation failures, authorization failures, unexpected inputs—logs reveal attack patterns. Your solar dashboard or poultry net config: logging is a defensive tool; logs reveal attack patterns.



## 38) The Boundary Is the Only Safe Place to Stop Bad Data

Once bad data enters:
	•	It spreads
	•	It contaminates state
	•	It creates secondary failures

The edge is your only clean choke point.

Example: Your Pi validates at the boundary—once bad data enters, it spreads and contaminates state. Your dashboard, ESP32, or coop controller: the boundary is the only safe place to stop bad data; the edge is your only clean choke point.



## 39) Everything Is an Attack Surface

Headers.
Cookies.
Paths.
Bodies.
Methods.
Timing.

All of it.

Timing attacks exploit how long operations take. If your Pi checks a password character-by-character and returns early on the first mismatch, an attacker can measure response times to learn which characters are correct. If your Pi takes longer to respond when a user exists versus when a user does not exist, an attacker can enumerate usernames. Even side channels like error message timing or database query duration can leak information.

Example: Your Pi treats headers, cookies, paths, bodies, methods, timing—all as attack surfaces. Your solar dashboard, coop controller, poultry net config, ESP32 sensor nodes—everything is an attack surface. Timing attacks are subtle but real: if your authentication check takes longer for valid users, attackers can measure that. All of it is an attack surface.



## 40) Security Starts with Correct Mental Models

If you believe:
	•	“Headers are safe”
	•	“Cookies are trustworthy”
	•	“The client wouldn’t do that”

You will ship vulnerabilities.

Example: Your Pi assumes "headers are safe" or "cookies are trustworthy" or "the client wouldn't do that"—you will ship vulnerabilities. Your dashboard or ESP32: security starts with correct mental models; wrong models lead to vulnerabilities.



## Reflection

A request arrives at your Pi:

X-User-Id: 42
Cookie: session=abc123
DELETE /api/sensors/17

What is trusted? Nothing. Every header, cookie, path, method, and body byte came from the client.

What must be verified? Everything. Presence (does the session cookie exist?), type (is the sensor ID a number?), range (is 17 a valid sensor ID?), identity (who owns session=abc123?), authentication (is that session valid?), authorization (can this user delete sensor 17?).

What assumptions are unsafe? Assuming X-User-Id means anything. Assuming the path /api/sensors/17 implies permission. Assuming DELETE means the user intended it. Assuming the cookie value is unchanged. Assuming "the UI wouldn't send that."

Walk through the boundary: validate presence, type, range, then check identity, authentication, authorization—all independently. Reject if any check fails. Log failures. Never trust input.



## Core Understanding
	•	Everything in an HTTP request is input
	•	All input is untrusted
	•	Headers, cookies, paths, bodies—all attack surfaces
	•	Servers validate aggressively
	•	Clients validate defensively
	•	The boundary is where correctness and security live

Anchor: there is no safe part of an HTTP request. The boundary is absolute—everything that crosses it is suspect until validated.



## What's Next

Chapter 2.22 — Redirects and the Location Header

Where we explore how control flow itself crosses boundaries,
and how even navigation becomes an attack surface if misunderstood.

This is where HTTP starts shaping user behavior—not just data flow.