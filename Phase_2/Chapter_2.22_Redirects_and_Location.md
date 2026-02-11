# Phase 2 · Chapter 2.22: Redirects and the Location Header

This chapter builds on [Chapter 2.9: Status Codes Overview](Chapter_2.9_Status_Codes_Overview.md), [Chapter 2.10: Status Codes — Success and Redirects](Chapter_2.10_Status_Codes_Success_and_Redirects.md), [Chapter 2.15: Headers — Overview](Chapter_2.15_Headers_Overview.md), and [Chapter 2.21: Trust Boundaries and Security Surfaces](Chapter_2.21_Trust_Boundaries_and_Security_Surfaces.md). We have seen how status codes communicate outcomes and how headers carry metadata. Here we focus on how 3xx status codes and the Location header create protocol-level control flow—redirects change what the client does next, crossing trust boundaries in both directions.

A redirect is a decision.

The server is saying:

“I understand your request, but the thing you want is not here.
Go somewhere else.”

Redirects are not transport mechanics.
They are control flow.

They change what the client does next.

That makes them powerful—and dangerous—if misunderstood.

This chapter treats redirects as branching logic at the protocol level, governed by status codes, headers, and client behavior.



## 1) What a Redirect Really Is

At the HTTP level, a redirect is:
	•	A completed request
	•	With a 3xx status code
	•	And a Location header
	•	That instructs the client to issue another request

The server does not forward the request.
The server does not proxy the request.

The server replies, and the client decides what to do next.

Example: Your Pi sends a 301 redirect with Location: https://dashboard.pi.local/new-path—your dashboard browser receives it and decides whether to follow it. Your ESP32 or coop controller app: the server replies, and the client decides what to do next. Redirects are not server-to-server; they are client instructions.



## 2) Redirects Are Not Server-to-Server

This matters.

A redirect is not:
	•	The server calling another server
	•	The server internally routing
	•	The server “sending you over”

A redirect is:
	•	The server telling the client a new address
	•	The client making a new request

Two separate HTTP exchanges.

Example: Your dashboard requests http://pi.local/api/old—your Pi responds with 301 and Location: https://pi.local/api/new. Your dashboard then makes a new request to https://pi.local/api/new. Two separate HTTP exchanges. Your solar dashboard or poultry net config: redirects are not forwarding; they are two separate HTTP exchanges.



## 3) The Location Header Is the Instruction

The Location header carries the target. It can be an absolute URL (https://example.com/path) or a relative URL (/path). Clients resolve relative URLs against the original request URL.

Example:

HTTP/1.1 301 Moved Permanently
Location: https://example.com/new-path

This header is:
	•	Required for most redirects (303 See Other is an exception)
	•	Interpreted by the client (which may validate, normalize, or reject it)
	•	Untrusted input from the server (for the client)—the client must decide whether to follow it

The Location header is output from the server's perspective (Chapter 2.21: boundaries exist in both directions). A malicious or misconfigured server can send Location: https://evil.com, so clients must validate redirect targets.

Example: Your Pi sends Location: /api/v2/readings (relative) or Location: https://pi.local/api/v2/readings (absolute). Your dashboard resolves relative URLs against the original request URL. Your ESP32 or coop controller: the Location header is the instruction; clients interpret it, validate it, and decide whether to follow it.



## 4) Redirects Are Optional for Clients

Important invariant:

Clients are not required to follow redirects.

Browsers usually do.
HTTP libraries often do (configurable).
APIs sometimes do not.

Redirects are a suggestion, not a command.

Example: Your Pi sends a 302 redirect—your dashboard browser usually follows it, but your ESP32 HTTP client might not (depending on configuration). Your coop controller or cow barn app: redirects are optional for clients; they are a suggestion, not a command.



## 5) Redirects Create a New Request

When a client follows a redirect:
	•	It issues a brand-new request
	•	With a new request line
	•	Possibly a new method
	•	Possibly without the original body
	•	Possibly without the original headers

This is not continuation.
It is branching.

Example: Your dashboard POSTs to /api/config—your Pi responds with 307 and Location: /api/v2/config. Your dashboard makes a new POST to /api/v2/config. This is not continuation; it is branching. Your solar dashboard or poultry net config: redirects create a new request; it is branching.



## 6) Redirects Are Control Flow

Think of redirects as:

if resource_moved:
    respond_with_redirect()

The next action happens on the client, not the server.

This is protocol-level branching logic.

Example: Your Pi checks if a resource moved—if yes, respond with redirect. The next action happens on the client (your dashboard browser or ESP32), not the server. Your coop controller: redirects are control flow; this is protocol-level branching logic.



## 7) 3xx Status Codes Are a Family

Redirects live in the 3xx range, but not all 3xx codes behave the same.

They differ in:
	•	Permanence
	•	Method preservation
	•	Cache behavior
	•	Client expectations

Understanding each matters.

Example: Your Pi needs to redirect from /api/v1/readings to /api/v2/readings—which code? 301 (permanent, but POST→GET), 307 (temporary, preserves method), 308 (permanent, preserves method)? Your dashboard, ESP32, or coop controller: 3xx codes differ in permanence, method preservation, cache behavior; understanding each matters.



## 8) The Core Redirect Codes

The most important redirect-related codes:
	•	301 Moved Permanently
	•	302 Found
	•	307 Temporary Redirect
	•	308 Permanent Redirect
	•	201 Created (special case)

Each has different semantics.



## 9) 301 Moved Permanently

301 means:

“This resource has permanently moved to another URL.”

Implications:
	•	Clients may update bookmarks
	•	Caches may store the redirect
	•	Search engines update indexes
	•	Browsers may rewrite future requests

Historically:
	•	Browsers often change POST → GET

This historical behavior is why 301 can be dangerous for APIs.

Example: Your ESP32 POSTs sensor data to /api/old—your Pi responds with 301 to /api/new. Some clients convert POST→GET, dropping the body. Your dashboard or coop controller: 301 can change POST to GET; this historical behavior is why 301 can be dangerous for APIs.



## 10) 302 Found

302 means:

“This resource is temporarily elsewhere.”

Implications:
	•	Do not update bookmarks
	•	Do not cache permanently
	•	The original URL is still valid

Historically:
	•	Browsers often change POST → GET
	•	Semantics were ambiguous

This ambiguity led to newer codes.

Example: Your Pi uses 302 for temporary redirects—but browsers historically changed POST→GET, and semantics were ambiguous. Your solar dashboard or poultry net config: 302 ambiguity led to newer codes (307, 308) with clearer semantics.



## 11) The POST → GET Problem

Early web browsers:
	•	Treated 301 and 302 the same
	•	Converted POST into GET
	•	Dropped the request body

This was convenient for browsers.
It was disastrous for APIs.

Example: Your ESP32 POSTs temperature data—your Pi redirects with 301 or 302, browser converts POST→GET, body is dropped, data is lost. Your dashboard or coop controller: POST→GET conversion was convenient for browsers; it was disastrous for APIs.



## 12) Enter 307 and 308

To fix ambiguity, HTTP introduced:
	•	307 Temporary Redirect (RFC 7231)
	•	308 Permanent Redirect (RFC 7538)

These preserve method and body. They were added specifically to address the POST→GET conversion problem—APIs needed redirects that would not lose request bodies or change method semantics. For modern APIs, 307 and 308 are usually the correct choice unless you specifically need the legacy behavior of 301/302.



## 13) 307 Temporary Redirect

307 means:

“Go elsewhere, but repeat the request exactly.”

Implications:
	•	Method is preserved
	•	Body is preserved
	•	Temporary change

POST stays POST.
PUT stays PUT.

Example: Your ESP32 POSTs sensor readings to /api/old—your Pi responds with 307 to /api/new. Your ESP32 makes a new POST (not GET) to /api/new with the same body. Your dashboard or coop controller: 307 preserves method; POST stays POST, PUT stays PUT.



## 14) 308 Permanent Redirect

308 means:

“This resource has permanently moved, and you must preserve the method.”

Implications:
	•	Method preserved
	•	Body preserved
	•	Permanent change
	•	Clear semantics for APIs

For modern APIs, 308 is usually better than 301.

Example: Your Pi moves /api/v1/readings to /api/v2/readings permanently—use 308 so POST/PUT methods are preserved. Your ESP32 or dashboard: 308 means permanent move with method preserved; for modern APIs, 308 is usually better than 301.



## 15) Redirect Semantics Matter

Choosing the wrong redirect can cause:
	•	Duplicate operations
	•	Data loss
	•	Security issues
	•	Client incompatibility

Redirects are not cosmetic.

Example: Your Pi chooses 301 vs 307 vs 308—wrong choice can cause duplicate operations, data loss, security issues. Your solar dashboard or poultry net config: redirect semantics matter; redirects are not cosmetic.



## 16) Redirects and Idempotency

Recall Phase 0 invariants:
	•	Idempotent operations can be retried safely
	•	Non-idempotent operations cannot

Redirecting a POST:
	•	Is dangerous—if the client retries the redirect, it may POST twice
	•	Can duplicate side effects (e.g. creating two sensor readings, charging twice)
	•	Must be designed carefully—use 307/308 to preserve method, or better yet, use POST→201→GET pattern

If a redirect changes POST→GET (301/302 legacy behavior), the operation becomes idempotent (GET is safe), but the original intent is lost. If a redirect preserves POST (307/308), the operation remains non-idempotent, and retries are still dangerous. The safest pattern: POST creates a resource, server responds with 201 Created and Location, client GETs the resource.



## 17) Redirects After POST

Common pattern:
	1.	Client POSTs data
	2.	Server creates resource
	3.	Server responds with 201 Created
	4.	Location points to the new resource
	5.	Client GETs the resource

This avoids duplicate POSTs.

Example: Your dashboard POSTs to create a user—your Pi responds with 201 Created and Location: /users/42. Your dashboard GETs /users/42. This avoids duplicate POSTs. Your solar dashboard or poultry net config: POST→201→GET pattern avoids duplicate POSTs.



## 18) 201 Created Is a Redirect-Like Pattern

201 is not a redirect code, but it uses Location.

Example:

HTTP/1.1 201 Created
Location: /users/42

This says:
	•	The action succeeded
	•	A new resource exists
	•	Here is where it lives

The client may choose to fetch it.

Example: Your Pi creates a new sensor config and responds with 201 Created and Location: /api/configs/17. Your dashboard may choose to GET that location. Your ESP32 or coop controller: 201 Created uses Location; the client may choose to fetch it.



## 19) Redirect Chains

A redirect can point to another redirect.

Example:
	•	/old → /older
	•	/older → /new
	•	/new → 200 OK

This is a redirect chain.

Example: Your dashboard requests /old—your Pi redirects to /older, which redirects to /new, which returns 200 OK. Your solar dashboard or poultry net config: a redirect can point to another redirect; this is a redirect chain.



## 20) Redirect Loops

Bad configuration can create loops:
	•	/a → /b
	•	/b → /a

Or more subtle:
	•	/a → /a (self-loop)
	•	/a → /b → /c → /a (circular chain)

Clients must protect themselves—servers cannot detect loops because each redirect is a separate request-response pair. The server that sends /a → /b does not know that /b will redirect back to /a.

Browsers and libraries:
	•	Limit redirect depth (typically 5–10 hops)
	•	Abort after N hops
	•	May detect cycles by tracking visited URLs

Redirect loops are server misconfigurations, but clients must handle them gracefully or they will hang or consume resources indefinitely.



## 21) Redirect Depth Limits

Typical limits:
	•	5–10 redirects
	•	Configurable in HTTP clients

If exceeded:
	•	Client errors
	•	Request fails

Redirect loops are failures.

Example: Your Pi redirects /a → /b, and /b → /a—your dashboard hits the redirect limit (5–10) and errors. Your coop controller or ESP32: clients limit redirect depth; redirect loops are failures.



## 22) Redirects Are Not Free

Each redirect:
	•	Requires a full round trip
	•	Adds latency
	•	Adds load

Minimize unnecessary redirects.

Example: Your dashboard requests /api/readings—your Pi redirects to /api/v2/readings, which redirects to /api/v2/readings/ (trailing slash). Each redirect adds latency. Your solar dashboard or poultry net config: redirects are not free; minimize unnecessary redirects.



## 23) Redirects vs Internal Routing

Redirect:
	•	Client-visible
	•	New request
	•	New URL

Internal routing:
	•	Server-only
	•	Same request
	•	Same URL

Do not confuse them.

Example: Your Pi internally routes /api/readings to a handler—this is server-only, same request, same URL. Redirecting /api/old to /api/new is client-visible, new request, new URL. Your dashboard or ESP32: redirects vs internal routing; do not confuse them.



## 24) When to Use Redirects

Use redirects when:
	•	URLs change
	•	Resources move
	•	Canonical URLs are enforced
	•	Versioning transitions occur

Do not use redirects for:
	•	Normal control flow
	•	Authorization checks
	•	Error handling

Example: Your Pi should not redirect on every authorization check—that is control flow, not resource movement. Your dashboard or coop controller: use redirects when URLs change or resources move; do not use redirects for normal control flow, authorization checks, or error handling.



## 25) Canonical URLs

Servers often enforce canonical URLs to avoid duplicate content, ensure security (HTTPS), and simplify routing:
	•	HTTPS instead of HTTP (security)
	•	Trailing slash normalization (/path vs /path/)
	•	www vs non-www (consistency)
	•	Lowercase vs mixed case (case sensitivity)

Example:

http://example.com → https://example.com

This is a redirect. The server receives a request for the non-canonical URL and redirects to the canonical one. This ensures all clients eventually use the same URL, which helps with caching, SEO, and security (HTTPS enforcement).

Example: Your dashboard requests http://pi.local/api/config—your Pi redirects to https://pi.local/api/config to enforce HTTPS. Your solar dashboard or poultry net config: canonical URLs (HTTPS, trailing slash, www) are enforced via redirects; this is a redirect.



## 26) Redirects and Security

Redirects cross trust boundaries.

A server can redirect a client to:
	•	A malicious site
	•	An unexpected protocol
	•	A phishing endpoint

Clients must be cautious.

Example: Your dashboard follows a redirect from your Pi—but the Location header could point to evil.com, an unexpected protocol, or a phishing endpoint. Your ESP32 or coop controller: redirects cross trust boundaries; clients must be cautious.



## 27) Open Redirect Vulnerabilities

An open redirect occurs when:
	•	User input controls Location
	•	No validation is applied

Example:

/login?next=https://evil.com

The server blindly redirects.

This is a real vulnerability.

Example: Your Pi has /login?next=https://evil.com—if it blindly redirects to the "next" parameter, that is an open redirect vulnerability. Your dashboard or solar panel UI: open redirects occur when user input controls Location without validation; this is a real vulnerability.



## 28) Why Open Redirects Are Dangerous

Open redirects:
	•	Enable phishing
	•	Bypass security filters
	•	Abuse trusted domains

They break user trust.

Example: Your dashboard user clicks a link on your Pi that redirects to evil.com—enables phishing, bypasses security filters, abuses your trusted domain. Your coop controller or poultry net config: open redirects break user trust.



## 29) Validating Redirect Targets

Servers should:
	•	Restrict redirect destinations
	•	Allow only known domains
	•	Normalize paths
	•	Reject external URLs when inappropriate

Redirects are output—but still part of security design.

Example: Your Pi validates redirect targets—only allows known domains, normalizes paths, rejects external URLs when inappropriate. Your dashboard or ESP32: validating redirect targets; redirects are output—but still part of security design.



## 30) Redirects Are Output Boundaries

Phase 0.8 applies here too:
	•	Redirect targets are output
	•	Output can cause harm
	•	Output must be validated

Boundaries exist in both directions.

Example: Your Pi sends Location: https://evil.com—that is output, and output can cause harm. Your solar dashboard or poultry net config: Phase 0.8 applies to redirects too; boundaries exist in both directions.



## 31) Client-Side Redirect Handling

Clients should:
	•	Limit redirect depth
	•	Validate schemes (http/https)
	•	Preserve or drop headers intentionally
	•	Decide whether to forward credentials

Redirects are not automatic correctness.

Example: Your dashboard follows redirects—must limit depth, validate schemes (http/https), decide whether to forward credentials. Your ESP32 or coop controller: client-side redirect handling; redirects are not automatic correctness.



## 32) Credentials and Redirects

When following redirects:
	•	Authorization headers may be dropped
	•	Cookies may or may not apply
	•	Cross-origin redirects change security context

Clients must manage this explicitly.

Example: Your dashboard follows a redirect—Authorization headers may be dropped, cookies may or may not apply, cross-origin redirects change security context. Your solar dashboard or poultry net config: credentials and redirects; clients must manage this explicitly.



## 33) Redirects and Cookies

If redirect stays within the same domain:
	•	Cookies may be sent automatically

If redirect crosses domains:
	•	Cookies usually are not sent

This matters for login flows.

Example: Your dashboard logs in at auth.pi.local—your Pi redirects to dashboard.pi.local. If same domain, cookies are sent; if different domain, cookies usually are not. Your coop controller or cow barn dashboard: redirects and cookies; this matters for login flows.



## 34) Redirects as UX Tools

Browsers use redirects for:
	•	Login flows
	•	Logout flows
	•	Post/Redirect/Get pattern
	•	Navigation cleanup

These are conventions, not guarantees.

Example: Your dashboard uses redirects for login/logout flows, Post/Redirect/Get pattern—browsers usually follow redirects, but these are conventions, not guarantees. Your solar dashboard or poultry net config: redirects as UX tools; these are conventions, not guarantees.



## 35) Post/Redirect/Get (PRG) Pattern

Classic pattern:
	1.	POST form
	2.	Server processes
	3.	Server redirects to GET
	4.	User refreshes safely

Prevents duplicate submissions.

Example: Your dashboard POSTs a form to create a config—your Pi processes it, redirects to GET /configs/17. User refreshes—GET is safe, no duplicate POST. Your coop controller or poultry net config: Post/Redirect/Get pattern prevents duplicate submissions.



## 36) Redirects and Caching

Some redirects:
	•	Are cacheable (301, 308)
	•	Persist in browser cache
	•	Affect future behavior

Be careful before marking something permanent.

Example: Your Pi uses 301 to redirect /api/v1 to /api/v2—browsers cache it, users may never hit /api/v1 again, rollbacks are painful. Your dashboard or ESP32: redirects and caching; be careful before marking something permanent.



## 37) Permanent Means Permanent

Once clients cache a 301 or 308:
	•	Changing behavior is hard
	•	Users may never hit the old URL again
	•	Rollbacks are painful

Use permanent redirects sparingly.

Example: Your Pi uses 301 or 308—once clients cache it, changing behavior is hard. Your solar dashboard or poultry net config: permanent means permanent; use permanent redirects sparingly.



## 38) Temporary Redirects Are Safer

When unsure:
	•	Use 302 or 307
	•	Observe behavior
	•	Promote to permanent later

Temporary first is safer.

Example: Your Pi is unsure if a move is permanent—use 302 or 307, observe behavior, promote to permanent later. Your dashboard or coop controller: when unsure, use temporary redirects; temporary first is safer.



## 39) Redirects Are Part of API Design

APIs evolve.

Redirects allow:
	•	Version transitions
	•	Endpoint migrations
	•	Deprecation strategies

They must be intentional.

Example: Your Pi evolves APIs—redirects allow version transitions, endpoint migrations, deprecation strategies. Your ESP32 or dashboard: redirects are part of API design; they must be intentional.



## 40) Redirects Are Not Errors

A redirect is not a failure.

It is a successful response with instructions.

Clients must treat it differently from errors.

Example: Your dashboard receives a 301 redirect—this is not a failure; it is a successful response with instructions. Your solar dashboard or poultry net config: redirects are not errors; clients must treat it differently from errors.



## Reflection

Your Pi API moves from /api/v1/readings to /api/v2/readings. Your ESP32 sensors POST temperature data, your dashboard GETs historical readings, your coop controller PUTs config updates.

Walk through the decision:
	•	Is this permanent? If yes, use 301 or 308. If unsure, start with 302 or 307.
	•	Does the method matter? If your ESP32 POSTs data, method preservation matters—use 307 or 308, not 301 or 302.
	•	Will clients retry? If redirects preserve POST (307/308), retries are dangerous—design carefully. If redirects change POST→GET (301/302 legacy), retries are safe but data is lost.
	•	Should bookmarks update? If permanent (301/308), yes. If temporary (302/307), no.

Which status code fits? If permanent and method matters: 308. If temporary and method matters: 307. If permanent but method does not matter (or you want legacy POST→GET): 301. If temporary and method does not matter: 302.

Then ask: what happens if a client follows the redirect twice? What happens if Location points to an external domain? What happens if cookies or credentials are involved?



## Core Understanding
	•	Redirects are protocol-level control flow
	•	3xx + Location tells the client what to do next
	•	301/302 are legacy and ambiguous
	•	307/308 preserve method and body
	•	Clients may or may not follow redirects
	•	Redirects cross trust boundaries and must be designed carefully

Anchor: redirects are branching logic, not forwarding. The server replies; the client decides. Every redirect creates a new request—method, body, headers, and credentials may change. Choose the status code based on permanence and method preservation needs.



## What's Next

Chapter 2.23 — REST Principles

Where HTTP stops being just transport and becomes an application protocol,
and where resource modeling, representations, and uniform interfaces take center stage.

This is where the protocol starts to mean something.