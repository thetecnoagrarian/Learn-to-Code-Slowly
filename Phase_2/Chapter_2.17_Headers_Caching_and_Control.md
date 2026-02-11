# Phase 2 · Chapter 2.17: Headers — Caching and Control

This chapter builds on [Chapter 2.1: Request-Response](Chapter_2.1_Request-Response.md), [Chapter 2.2: HTTP on TCP](Chapter_2.2_HTTP_on_TCP.md), [Chapter 2.3: What HTTP Is](Chapter_2.3_What_HTTP_Is.md), [Chapter 2.4: HTTP as Text](Chapter_2.4_HTTP_as_Text.md), [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.6: Request Structure](Chapter_2.6_Request_Structure.md), [Chapter 2.7: The Request Line](Chapter_2.7_The_Request_Line.md), [Chapter 2.8: Response Structure](Chapter_2.8_Response_Structure.md), [Chapter 2.9: Status Codes Overview](Chapter_2.9_Status_Codes_Overview.md), [Chapter 2.10: Status Codes — Success and Redirects](Chapter_2.10_Status_Codes_Success_and_Redirects.md), [Chapter 2.11: Status Codes — Client and Server Errors](Chapter_2.11_Status_Codes_Client_and_Server_Errors.md), [Chapter 2.12: Errors vs Failures](Chapter_2.12_Errors_vs_Failures.md), [Chapter 2.13: HTTP Methods](Chapter_2.13_HTTP_Methods.md), [Chapter 2.14: Safety and Idempotency](Chapter_2.14_Safety_and_Idempotency.md), [Chapter 2.15: Headers — Overview and Purpose](Chapter_2.15_Headers_Overview.md), and [Chapter 2.16: Headers — Content and Type](Chapter_2.16_Headers_Content_and_Type.md).

Caching exists to answer one simple question:

“Do I really need to send this again?”

HTTP does not assume the answer.
Instead, it negotiates—explicitly—using headers.

Caching is not magic.
It is a contract between client and server, enforced entirely through metadata.

This chapter explains that contract. Chapter 2.15 introduced headers as HTTP's control surface; Chapter 2.16 showed how headers turn bytes into meaning; this chapter focuses on caching headers—Cache-Control, ETag, If-None-Match—that make HTTP efficient. Whether your dashboard caches voltage readings, your ESP32 validates sensor data, or your Pi controls cache freshness—caching is a negotiated contract enforced through headers.



## 1) Why Caching Exists at All

Without caching:
	•	Every request hits the server
	•	Every response sends full content
	•	Latency increases
	•	Load increases
	•	Bandwidth is wasted

With caching:
	•	Clients reuse data
	•	Servers do less work
	•	Networks move fewer bytes
	•	Systems scale

Caching is an optimization—but a powerful one.

Example: Your dashboard requests `GET /api/voltage` every second. Without caching, your Pi handles every request, sends full response each time—latency increases, load increases, bandwidth wasted. With caching (`Cache-Control: max-age=60`), your dashboard reuses data for 60 seconds—Pi does less work, network moves fewer bytes, system scales. Or your ESP32 requests `GET /api/config`—caching reduces load on your Pi. Caching is an optimization—but a powerful one.



## 2) Caching Is a Boundary Concern

Phase 0.8: boundaries are where validation lives.

Caching is a boundary decision:
	•	What crosses the boundary again?
	•	What is reused?
	•	What must be revalidated?

Caching is never implicit.
It is always negotiated.

Example: Your ESP32 sends `GET /api/temp` from the coop. Your Pi responds with `Cache-Control: max-age=300`—boundary decision: what crosses the boundary again? What is reused? What must be revalidated? Caching is never implicit—Pi declares rules via headers, ESP32 decides accordingly. Or your dashboard requests voltage—Pi negotiates caching policy via headers. Caching is a boundary concern—always negotiated, never implicit.



## 3) HTTP Caching Is Declarative

HTTP does not say:

“Cache this.”

It says:

“Here are the rules. Decide accordingly.”

Headers declare intent.
Clients, proxies, and browsers enforce it.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: max-age=60`. HTTP doesn't say "cache this"—it says "here are the rules (fresh for 60 seconds), decide accordingly." Your dashboard enforces it—reuses data for 60 seconds. Or your ESP32 receives `Cache-Control: no-cache`—must revalidate. Headers declare intent—clients, proxies, browsers enforce it. HTTP caching is declarative.



## 4) Cache-Control Is the Primary Tool

Cache-Control is the main header for caching policy.

It appears in:
	•	Responses (what may be cached)
	•	Requests (what the client is willing to accept)

It contains directives.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: max-age=60, public`. Or responds to `GET /api/config` with `Cache-Control: no-cache, must-revalidate`. Cache-Control is the primary tool—appears in responses (what may be cached) and requests (what client accepts). It contains directives—max-age, no-cache, public, private, must-revalidate.



## 5) Cache-Control Directives Are Instructions

Examples:
	•	max-age=3600 (fresh for 3600 seconds)
	•	no-cache (revalidate before using)
	•	no-store (do not store anywhere)
	•	must-revalidate (check server when stale)
	•	public (may be cached by shared caches)
	•	private (only end client may cache)

Each directive changes caching behavior.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: max-age=60, public`—two directives: max-age (freshness), public (shared cache allowed). Or responds with `Cache-Control: no-cache, must-revalidate`—revalidate before using, check server when stale. Cache-Control directives are instructions—each directive changes caching behavior. Combine them for precise control.



## 6) max-age: Freshness Lifetime

max-age=3600 means:

“This response is fresh for 3600 seconds.”

While fresh:
	•	The client may reuse it
	•	No server contact required
	•	No validation required

This is strong caching.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: max-age=60`. Your dashboard reuses the response for 60 seconds—no server contact, no validation, just reuse. Or your ESP32 requests `GET /api/config` with `max-age=3600`—reuses for 1 hour. max-age=3600 means "fresh for 3600 seconds"—while fresh, client may reuse it without asking server. This is strong caching.



## 7) Freshness Is Time-Based Validity

Freshness answers:

“Is this data still valid right now?”

If yes → use cache
If no → revalidate or refetch

Freshness is about time, not correctness.

Example: Your dashboard requests `GET /api/voltage` and gets `Cache-Control: max-age=60`. After 30 seconds, data is fresh—use cache. After 70 seconds, data is stale—revalidate or refetch. Freshness answers "is this data still valid right now?"—it's about time (60 seconds passed?), not correctness (is voltage reading accurate?). Or your ESP32 checks freshness—time-based validity, not correctness check.



## 8) no-cache Does Not Mean “Do Not Cache”

This is a common mistake.

no-cache means:

“You may store this, but you must revalidate before using it.”

The data can be cached—but not trusted without checking.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: no-cache`. Your dashboard may store it, but must revalidate before using it—ask Pi "is this still valid?" before reusing. Or your ESP32 receives `no-cache`—can cache, but must check with server first. no-cache does not mean "do not cache"—it means "cache, but revalidate before using." The data can be cached—but not trusted without checking.



## 9) no-store Means Exactly That

no-store means:

“Do not store this anywhere.”

Not in:
	•	Browser cache
	•	Disk cache
	•	Proxy cache
	•	Memory cache

Used for:
	•	Credentials
	•	Personal data
	•	Sensitive responses

Example: Your ESP32 sends `POST /api/login` and receives `Cache-Control: no-store`. Your ESP32 must not store this anywhere—not browser cache, disk cache, proxy cache, memory cache. Or your dashboard receives authentication token with `no-store`—must not cache credentials. no-store means "do not store this anywhere"—used for credentials, personal data, sensitive responses.



## 10) public vs private
	•	public: may be cached by shared caches (proxies, CDNs)
	•	private: only the end client may cache it

Important for authenticated responses.

Example: Your ESP32 requests `GET /api/sensors` with `Authorization: Bearer xyz`. Your Pi responds with `Cache-Control: private`—only the ESP32 may cache it, not shared caches (proxies, CDNs). Or your dashboard gets authenticated response with `public`—may be cached by shared caches. public vs private—public: may be cached by shared caches; private: only end client may cache. Important for authenticated responses—prevent leaks.



## 11) must-revalidate

Means:

“When this becomes stale, you must check with the server.”

No heuristic reuse.
No stale usage.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: must-revalidate`. When data becomes stale, your dashboard must check with Pi—no heuristic reuse, no stale usage. Or your ESP32 receives `must-revalidate`—when stale, must revalidate, cannot use stale data. must-revalidate means "when this becomes stale, you must check with the server"—no heuristic reuse, no stale usage.



## 12) Request Cache-Control

Clients can send Cache-Control too.

Examples:
	•	Cache-Control: no-cache → “I want fresh data”
	•	Cache-Control: max-age=0 → “Treat as stale immediately”

Clients can override freshness preferences.

Example: Your dashboard sends `GET /api/voltage` with `Cache-Control: no-cache`—wants fresh data, even if cached copy is fresh. Or sends `Cache-Control: max-age=0`—treat as stale immediately, force revalidation. Or your ESP32 sends `no-cache`—overrides server freshness preferences. Clients can send Cache-Control too—override freshness preferences, force revalidation.



## 13) Server and Client Negotiate

Caching is not unilateral.

The server proposes.
The client decides.
Intermediaries enforce.

This is negotiation, not command.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: max-age=60` (proposes 60 seconds). Your dashboard decides—may reuse for 60 seconds, or may send `Cache-Control: no-cache` to override. Or your ESP32 negotiates—server proposes, client decides, intermediaries enforce. Caching is not unilateral—server proposes, client decides, intermediaries enforce. This is negotiation, not command.



## 14) Validation vs Freshness

Two strategies:
	•	Freshness-based: use cached copy without asking
	•	Validation-based: ask server “is this still valid?”

HTTP supports both.



## 15) Validation Requires Identifiers

To validate cached data, the client needs a way to ask:

“Has this changed?”

That requires identifiers.

Example: Your dashboard has cached voltage reading with ETag "v123". To validate, it needs to ask Pi "has voltage changed?"—requires identifier (ETag "v123"). Or your ESP32 has cached config—needs identifier to validate. Validation requires identifiers—client needs a way to ask "has this changed?" That requires identifiers (ETag, Last-Modified).



## 16) ETag: Entity Tags

An ETag is a fingerprint of the response body.

Example:

ETag: "abc123"

If the content changes, the ETag should change.

Example: Your Pi responds to `GET /api/voltage` with `ETag: "v123"`. If voltage reading changes, ETag should change to `"v124"`. Or your ESP32 requests config—Pi responds with ETag, if config changes, ETag changes. ETag is a fingerprint of the response body—if content changes, ETag should change. Example: `ETag: "abc123"`—opaque identifier, changes when content changes.



## 17) ETags Are Opaque

Clients must not interpret ETags.

They are:
	•	Opaque identifiers
	•	Only meaningful to the server
	•	Compared for equality only

Example: Your Pi responds with `ETag: "v123"`. Your dashboard must not interpret it—don't assume it's a version number, don't parse it, just compare for equality. Or your ESP32 receives `ETag: "abc123"`—opaque identifier, only meaningful to Pi. ETags are opaque—clients must not interpret them, only compare for equality. They're opaque identifiers, only meaningful to the server.



## 18) Strong vs Weak ETags

Strong ETag:

ETag: "abc123"

Weak ETag:

ETag: W/"abc123"

Weak means “semantically equivalent, not byte-identical.”



## 19) If-None-Match: Validation Request

Client sends:

```
If-None-Match: "abc123"
```

Meaning:

“I have this version. Has it changed?”



## 20) Server Validation Logic

Server checks:
	•	Does current ETag equal the one provided?

If yes → unchanged
If no → changed

Example: Your dashboard sends `GET /api/voltage` with `If-None-Match: "v123"`. Your Pi checks—current ETag is "v123"? Yes → unchanged, respond `304 Not Modified`. Or current ETag is "v124"? No → changed, respond `200 OK` with new content. Server validation logic—check if current ETag equals provided ETag. If yes → unchanged, if no → changed.



## 21) 304 Not Modified

If unchanged, server responds:

```
HTTP/1.1 304 Not Modified
```

	•	No body
	•	Minimal headers
	•	Client reuses cached copy

This is a successful response.

Example: Your dashboard sends `GET /api/voltage` with `If-None-Match: "v123"`. Your Pi checks—current ETag is still "v123", responds `304 Not Modified` (no body, minimal headers). Dashboard reuses cached copy. Or your ESP32 validates—Pi responds `304`, ESP32 reuses cache. 304 Not Modified—no body, minimal headers, client reuses cached copy. This is a successful response—saves bandwidth and time.

Example: Your dashboard sends `GET /api/voltage` with `If-None-Match: "v123"`. Your Pi checks—current ETag is still "v123", responds `304 Not Modified` (no body, minimal headers). Dashboard reuses cached copy. Or your ESP32 validates—Pi responds `304`, ESP32 reuses cache. 304 Not Modified—no body, minimal headers, client reuses cached copy. This is a successful response—saves bandwidth and time.



## 22) 304 Is Not an Error

304 means:

“Your cached version is still valid.”

It saves bandwidth and time.

Example: Your dashboard validates cached voltage reading—Pi responds `304 Not Modified`, dashboard reuses cache. Saves bandwidth (no body transfer), saves time (no parsing). Or your ESP32 validates config—`304` response, reuses cache. 304 means "your cached version is still valid"—it saves bandwidth and time. Not an error—successful validation.



## 23) When the Body Is Sent Again

If changed:
	•	Server returns 200 OK
	•	Includes full body
	•	Includes new ETag

Client replaces cache.

Example: Your dashboard sends `GET /api/voltage` with `If-None-Match: "v123"`. Your Pi checks—voltage changed, ETag is now "v124", responds `200 OK` with full body and new ETag "v124". Dashboard replaces cache. Or your ESP32 validates—Pi responds `200 OK` with new content, ESP32 replaces cache. If changed—server returns 200 OK, includes full body, includes new ETag. Client replaces cache.



## 24) If-Modified-Since

Older validation mechanism.

Client sends:

```
If-Modified-Since: Tue, 30 Jan 2025 12:00:00 GMT
```

Server compares timestamps.

Example: Your dashboard sends `GET /api/voltage` with `If-Modified-Since: Tue, 30 Jan 2025 12:00:00 GMT`—has cached version from this timestamp, asks Pi "has it changed since then?" Or your ESP32 sends If-Modified-Since—server compares timestamps. If-Modified-Since is older validation mechanism—client sends timestamp, server compares. ETags are more reliable.



## 25) Limitations of If-Modified-Since

Problems:
	•	Time resolution issues (sub-second changes)
	•	Clock skew (server/client clocks differ)
	•	Files changing without timestamp change (content changes, timestamp doesn't)

ETags are more reliable.

Example: Your Pi's voltage reading changes twice in one second—If-Modified-Since may miss the second change (time resolution issue). Or server clock differs from client clock—clock skew causes wrong validation. Or content changes but timestamp doesn't—If-Modified-Since fails. Limitations of If-Modified-Since—time resolution issues, clock skew, files changing without timestamp change. ETags are more reliable.



## 26) Servers May Support Both

Many servers:
	•	Send both ETag and Last-Modified
	•	Accept both validation headers

ETag usually takes precedence.

Example: Your Pi responds to `GET /api/voltage` with both `ETag: "v123"` and `Last-Modified: Tue, 30 Jan 2025 12:00:00 GMT`. Your dashboard may send either `If-None-Match: "v123"` or `If-Modified-Since: Tue, 30 Jan 2025 12:00:00 GMT`. Pi accepts both, but ETag usually takes precedence. Or your ESP32 validates—Pi supports both, ETag preferred. Servers may support both—send both ETag and Last-Modified, accept both validation headers. ETag usually takes precedence.



## 27) Validation Is Conditional Requests

Requests with:
	•	If-None-Match
	•	If-Modified-Since

Are conditional requests.

They ask:

“Only send the body if something changed.”



## 28) Conditional Requests Reduce Load

Benefits:
	•	No body transfer if unchanged
	•	Minimal server work
	•	Faster responses

This is critical at scale.

Example: Your dashboard requests voltage every second. Without conditional requests, Pi sends full body every time—bandwidth wasted, server load high. With `If-None-Match`, Pi responds `304` most times—no body transfer, minimal server work, faster responses. Or your ESP32 validates config—conditional requests reduce load. Conditional requests reduce load—no body transfer if unchanged, minimal server work, faster responses. This is critical at scale.



## 29) Caching and Statelessness

HTTP is stateless—but caching adds client-side memory.

The server does not remember.
The client does.

State exists—but outside the server.

Example: Your Pi doesn't remember your dashboard's previous requests—HTTP is stateless. But your dashboard caches voltage readings—client-side memory. Or your ESP32 caches config—state exists, but outside the server. Caching and statelessness—HTTP is stateless (server doesn't remember), but caching adds client-side memory (client remembers). State exists—but outside the server.



## 30) Caching Is Safe Because of Idempotency

GET is:
	•	Safe
	•	Idempotent

This allows caching.

POST generally is not cached.

Example: Your ESP32 sends `GET /api/voltage`—safe and idempotent, can be cached. Or sends `GET /api/config`—cacheable. But sends `POST /api/temp`—not safe, not idempotent, generally not cached. Caching is safe because of idempotency—GET is safe and idempotent, allows caching. POST generally is not cached—not safe, not idempotent.



## 31) Which Methods Are Cacheable

Typically cacheable:
	•	GET (safe, idempotent)
	•	HEAD (safe, idempotent)

Rarely:
	•	POST (explicitly allowed only, not safe, not idempotent)

Never by default:
	•	PUT (not safe)
	•	PATCH (not safe)
	•	DELETE (not safe)

Example: Your ESP32 sends `GET /api/voltage`—cacheable (safe, idempotent). Or sends `GET /api/config`—cacheable. But sends `POST /api/temp`—not cacheable by default (not safe, not idempotent). Which methods are cacheable—typically GET and HEAD (safe, idempotent). POST rarely (explicitly allowed only). PUT, PATCH, DELETE never by default (not safe).



## 32) Cache-Control Applies Per Response

Caching rules are tied to:
	•	A specific response
	•	To a specific URL

Changing the URL changes the cache key.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: max-age=60`—caching rules tied to this URL. Or responds to `GET /api/config` with `Cache-Control: max-age=3600`—different URL, different caching rules. Cache-Control applies per response—caching rules tied to specific response, specific URL. Changing the URL changes the cache key.



## 33) URLs Are Cache Keys

The cache key includes:
	•	Scheme (http vs https)
	•	Host (pi.local vs example.com)
	•	Path (/api/voltage vs /api/config)
	•	Query string (?window=60 vs ?window=300)

Different query strings = different cache entries.

Example: Your dashboard requests `GET http://pi.local/api/voltage?window=60`—cache key includes scheme (http), host (pi.local), path (/api/voltage), query string (?window=60). Or requests `GET http://pi.local/api/voltage?window=300`—different query string, different cache entry. URLs are cache keys—cache key includes scheme, host, path, query string. Different query strings = different cache entries.



## 34) Query Strings and Caching

Example:

/api/voltage?window=60
/api/voltage?window=300

These are distinct cache entries.

Example: Your dashboard requests `GET /api/voltage?window=60` and `GET /api/voltage?window=300`. These are distinct cache entries—different query strings, different cache keys. Or your ESP32 requests `/api/temp?unit=F` and `/api/temp?unit=C`—distinct cache entries. Query strings are part of cache key—`/api/voltage?window=60` and `/api/voltage?window=300` are distinct cache entries.



## 35) Proxies and Shared Caches

Shared caches:
	•	CDNs (Content Delivery Networks)
	•	Reverse proxies (load balancers)
	•	Corporate proxies (enterprise networks)

They obey Cache-Control too.

Example: Your dashboard requests `GET /api/voltage` through a CDN. The CDN (shared cache) obeys `Cache-Control: public, max-age=60`—may cache and serve to other clients. Or your ESP32 requests through a reverse proxy—proxy obeys Cache-Control. Proxies and shared caches—CDNs, reverse proxies, corporate proxies. They obey Cache-Control too—shared caches respect caching headers.



## 36) Why public vs private Matters

Authenticated responses:
	•	Often include user-specific data
	•	Must not be shared

Use private to prevent leaks.

Example: Your ESP32 requests `GET /api/sensors` with `Authorization: Bearer xyz`. Your Pi responds with `Cache-Control: private`—only ESP32 may cache it, not shared caches. Prevents user-specific data from leaking to other clients. Or your dashboard gets authenticated response—use private to prevent leaks. Authenticated responses often include user-specific data, must not be shared—use private to prevent leaks.



## 37) Browser Heuristics (Danger Zone)

Browsers may:
	•	Cache even without explicit headers (heuristic caching)
	•	Guess freshness (e.g., 10% of age)
	•	Apply heuristics (e.g., cache images longer than HTML)

APIs should not rely on this.

Example: Your dashboard (browser) may cache `GET /api/voltage` even without Cache-Control—browser heuristics guess freshness. Or browser caches images longer than HTML—heuristic behavior. Browser heuristics (danger zone)—browsers may cache without explicit headers, guess freshness, apply heuristics. APIs should not rely on this—be explicit, don't rely on browser heuristics.



## 38) APIs Should Be Explicit

Best practice:
	•	Always set Cache-Control
	•	Always set ETag (if cacheable)
	•	Be explicit about freshness

Explicit beats clever.

Example: Your Pi API always sets `Cache-Control: max-age=60` for voltage readings—explicit freshness policy. Or sets `ETag: "v123"` for validation—explicit validation. Or your ESP32 API sets explicit caching headers—no relying on browser heuristics. APIs should be explicit—always set Cache-Control, always set ETag (if cacheable), be explicit about freshness. Explicit beats clever.



## 39) Caching Dynamic Data

Not all dynamic data is uncacheable.

Examples:
	•	Sensor data updated once per minute
	•	Config data updated hourly

Short max-age + validation works well.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: max-age=5` and `ETag: "v123"`. Sensor data updated once per minute—short max-age (5 seconds) + validation (ETag) works well. Or config data updated hourly—short max-age + validation. Not all dynamic data is uncacheable—sensor data updated once per minute, config data updated hourly. Short max-age + validation works well.



## 40) Example: Sensor API

Server response:

```
Cache-Control: max-age=5
ETag: "v123"
```

Clients:
	•	Reuse data for 5 seconds
	•	Then revalidate

Low latency, low load.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: max-age=5` and `ETag: "v123"`. Your dashboard reuses data for 5 seconds, then revalidates with `If-None-Match: "v123"`. Low latency (reuse cache), low load (revalidate, not refetch). Or your ESP32 requests sensor data—short max-age + validation. Sensor API example—short freshness, validation enabled.



## 41) Client Override for Freshness

Client sends:

Cache-Control: no-cache

Meaning:

“I want to revalidate even if fresh.”

Useful for dashboards.

Example: Your dashboard sends `GET /api/voltage` with `Cache-Control: no-cache`—wants to revalidate even if cached copy is fresh. Useful for dashboards—always show latest data. Or your ESP32 sends `no-cache`—force revalidation. Client override for freshness—client sends `Cache-Control: no-cache`, meaning "I want to revalidate even if fresh." Useful for dashboards.



## 42) Stale Data Is Sometimes Acceptable

Design decision:
	•	Is slightly stale data OK?
	•	Or must it always be fresh?

Caching policy encodes this decision.

Example: Your dashboard shows voltage readings—is slightly stale data OK? If yes, use `max-age=60`. If no, use `no-cache`. Or your ESP32 requests config—must always be fresh? Use `no-cache`. Stale data is sometimes acceptable—design decision: is slightly stale data OK, or must it always be fresh? Caching policy encodes this decision.



## 43) Stale-While-Revalidate (Advanced)

Some caches support:

```
Cache-Control: max-age=60, stale-while-revalidate=300
```

Serve stale data while revalidating in background.

Advanced but powerful.

Example: Your Pi responds to `GET /api/voltage` with `Cache-Control: max-age=60, stale-while-revalidate=300`. Your dashboard may serve stale data (after 60 seconds) while revalidating in background (up to 300 seconds). Or your ESP32 receives stale-while-revalidate—serve stale while revalidating. Stale-while-revalidate (advanced)—some caches support serving stale data while revalidating in background. Advanced but powerful.



## 44) Caching Is Not Just Performance

Caching affects:
	•	Consistency
	•	User experience
	•	Load
	•	Cost
	•	Correctness

It is architectural.

Example: Your Pi's caching policy affects consistency (how fresh is data?), user experience (fast or slow?), load (high or low?), cost (bandwidth), correctness (stale data bugs). Or your ESP32's caching affects system architecture. Caching affects consistency, user experience, load, cost, correctness—it is architectural, not just performance.



## 45) Caching Bugs Are Subtle

Common bugs:
	•	Forgetting to invalidate
	•	Wrong cache key
	•	Missing private directive
	•	Overly long max-age

These bugs persist invisibly.

Example: Your Pi forgets to invalidate cache when voltage changes—dashboard shows stale data, bug persists invisibly. Or wrong cache key—ESP32 gets wrong cached data. Or missing private directive—authenticated data leaks. Or overly long max-age—stale data shown too long. Common caching bugs—forgetting to invalidate, wrong cache key, missing private directive, overly long max-age. These bugs persist invisibly.



## 46) Phase 0 Revisited: Invariants

Caching invariants:
	•	Content must match ETag
	•	Cache rules must be honored
	•	Validation must be correct

Breaking invariants creates ghosts.

Example: Your Pi responds with `ETag: "v123"` but content doesn't match—breaks invariant, creates ghosts (stale data, wrong validation). Or cache rules not honored—data cached when shouldn't be. Or validation incorrect—304 when should be 200. Caching invariants—content must match ETag, cache rules must be honored, validation must be correct. Breaking invariants creates ghosts.



## 47) Debugging Caching

When debugging:
	•	Inspect Cache-Control (what's the policy?)
	•	Inspect ETag (what's the identifier?)
	•	Inspect 304 vs 200 (validation working?)
	•	Disable cache temporarily (see fresh data)

Caching hides mistakes.

Example: Your dashboard shows stale voltage—inspect Cache-Control (is max-age too long?), inspect ETag (is validation working?), inspect 304 vs 200 (is Pi responding correctly?), disable cache temporarily (see fresh data). Or your ESP32 debugging—inspect caching headers. Debugging caching—inspect Cache-Control, ETag, 304 vs 200, disable cache temporarily. Caching hides mistakes—debug carefully.



## 48) curl Is Your Friend

Example:

```
curl -I http://pi.local/api/voltage
```

Inspect headers only.

Example: Your dashboard debugs caching—use `curl -I http://pi.local/api/voltage` to inspect headers only (Cache-Control, ETag). Or your ESP32 debugs—inspect headers without body. curl is your friend—`curl -I` inspects headers only, shows caching policy. Useful for debugging caching.

Example: Your dashboard debugs caching—use `curl -I http://pi.local/api/voltage` to inspect headers only (Cache-Control, ETag). Or your ESP32 debugs—inspect headers without body. curl is your friend—`curl -I` inspects headers only, shows caching policy. Useful for debugging caching.



## 49) DevTools Network Tab

Browser dev tools show:
	•	Cached vs network
	•	304 responses
	•	Timing

Learn to read them.

Example: Your dashboard uses browser dev tools—Network tab shows cached vs network, 304 responses, timing. Or your ESP32 debugging—inspect caching behavior. Browser dev tools show cached vs network, 304 responses, timing—learn to read them. Useful for debugging caching.



## 50) Caching Is Optional but Powerful

You can build systems without caching.

But systems that scale well use it intentionally.

Example: Your Pi API can work without caching—every request hits server, every response sent. But systems that scale well use caching intentionally—your dashboard caches voltage readings, ESP32 caches config. Caching is optional but powerful—you can build systems without it, but systems that scale well use it intentionally.



## Reflection

Think about real HTTP exchanges—your dashboard caching voltage readings, your ESP32 validating sensor data, your Pi controlling cache freshness.
	•	Pick one API you know. Is it cacheable?
	•	Does it return ETags?
	•	What is its Cache-Control policy?
	•	What breaks if the cache lies?

Consider failure modes:
	•	Your dashboard requests `GET /api/voltage` and gets `Cache-Control: max-age=3600`. Dashboard caches for 1 hour, but voltage changes every minute—stale data shown for 59 minutes. What breaks? Dashboard shows wrong voltage, user makes wrong decisions. Or your Pi forgets to invalidate cache when voltage changes—cache lies, stale data persists.
	•	Your ESP32 requests `GET /api/config` with `If-None-Match: "v123"`. Your Pi responds `304 Not Modified`, but config actually changed (ETag mismatch bug)—ESP32 uses stale config, system misconfigured. What breaks? Wrong config applied, system behaves incorrectly. Or Pi responds with wrong ETag—validation fails, cache lies.
	•	Your dashboard requests authenticated data with `Cache-Control: public` (should be private). Shared cache (CDN) caches it, serves to other clients—data leak. What breaks? User-specific data leaked to other clients, privacy violation. Or missing private directive—authenticated data cached publicly.
	•	Your ESP32 requests `GET /api/temp` with `Cache-Control: max-age=0` (force revalidation). Your Pi ignores it, serves cached response—client override ignored. What breaks? ESP32 can't force fresh data, stale data shown. Or Pi doesn't honor client Cache-Control—negotiation breaks.

If you can identify caching policies, validation mechanisms, and failure modes, you understand caching as a negotiated contract.



## Core Understanding
	•	Cache-Control defines caching policy
	•	Freshness determines reuse
	•	ETag + If-None-Match enable validation
	•	304 means “use your cache”
	•	Caching is a negotiated contract
	•	Explicit rules beat heuristics



What’s Next

Next: Chapter 2.18 — URLs, Paths, and Query Strings

Where we dissect:
	•	How URLs are structured
	•	How paths map to resources
	•	How query strings encode parameters
	•	And why small URL differences matter deeply

This is where identity, addressing, and caching collide.