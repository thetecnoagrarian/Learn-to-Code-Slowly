# Phase 2 · Chapter 2.14: Safety and Idempotency

This chapter builds on [Chapter 2.1: Request-Response](Chapter_2.1_Request-Response.md), [Chapter 2.2: HTTP on TCP](Chapter_2.2_HTTP_on_TCP.md), [Chapter 2.3: What HTTP Is](Chapter_2.3_What_HTTP_Is.md), [Chapter 2.4: HTTP as Text](Chapter_2.4_HTTP_as_Text.md), [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.6: Request Structure](Chapter_2.6_Request_Structure.md), [Chapter 2.7: The Request Line](Chapter_2.7_The_Request_Line.md), [Chapter 2.8: Response Structure](Chapter_2.8_Response_Structure.md), [Chapter 2.9: Status Codes Overview](Chapter_2.9_Status_Codes_Overview.md), [Chapter 2.10: Status Codes — Success and Redirects](Chapter_2.10_Status_Codes_Success_and_Redirects.md), [Chapter 2.11: Status Codes — Client and Server Errors](Chapter_2.11_Status_Codes_Client_and_Server_Errors.md), [Chapter 2.12: Errors vs Failures](Chapter_2.12_Errors_vs_Failures.md), and [Chapter 2.13: HTTP Methods](Chapter_2.13_HTTP_Methods.md).

Safety and idempotency are not optional details.
They are invariants of HTTP.

They exist because:
	•	Networks fail
	•	Requests get duplicated
	•	Responses are lost
	•	Clients retry automatically
	•	Proxies replay traffic
	•	Humans click buttons twice

If you misunderstand these concepts, your system will appear to work—until it doesn’t.


## 1) Why These Concepts Exist at All

HTTP was designed for unreliable networks.

Packets drop. Connections reset. Servers crash. Clients disappear mid-request.

The protocol does not guarantee:
	•	That a request arrives once
	•	That a response arrives at all
	•	That a request is not duplicated

Safety and idempotency exist to make systems survivable under those conditions.


## 2) Safety and Idempotency Are Different

These two ideas are often confused. They are not the same.
	•	Safety answers: Does this request change state?
	•	Idempotency answers: What happens if this request happens again?

A method can be:
	•	Safe and idempotent (e.g., GET)
	•	Unsafe and idempotent (e.g., PUT, DELETE)
	•	Unsafe and non-idempotent (e.g., POST)

Understanding the difference is critical.

Example: Your dashboard sends `GET /api/voltage`—safe (no state change) and idempotent (same result if repeated). Or sends `PUT /api/config`—unsafe (changes state) but idempotent (same result if repeated). Or sends `POST /api/temp`—unsafe (changes state) and not idempotent (different result if repeated). Different properties, different retry behavior.


## 3) Safe Methods: No Side Effects

A safe method does not change server state.

Calling it:
	•	Does not create
	•	Does not modify
	•	Does not delete

Safe methods are observational only.

Example: Your ESP32 sends `GET /api/voltage`. This reads the voltage—no sensor is created, no config is modified, no resource is deleted. Observational only. Contrast with `POST /api/temp`—this creates a temperature reading, changing server state. Not safe.


## 4) Which Methods Are Safe

Safe methods include:
	•	GET (e.g., `GET /api/voltage`)
	•	HEAD (e.g., `HEAD /api/config`—check if exists without body)
	•	OPTIONS (e.g., `OPTIONS /api/sensors`—check allowed methods)

They exist to read, not act.

Example: Your dashboard sends `GET /api/voltage`—safe, reads voltage. Or sends `HEAD /api/config`—safe, checks if config exists without fetching body. Or sends `OPTIONS /api/sensors`—safe, checks what methods are allowed. All are observational, no mutations.


## 5) What “No Side Effects” Really Means

“No side effects” means:
	•	No persistent state change
	•	No mutation of resources
	•	No counters incremented
	•	No logs written as a consequence of the request itself

Logging the request is fine.
Changing application state is not.

Example: Your ESP32 sends `GET /api/voltage`. Your Pi may log "ESP32 requested voltage"—that's fine, logging is acceptable. But if the Pi increments a "request_count" counter or updates a "last_read" timestamp—that's a side effect, GET is no longer safe. Safe means no application state change, not no logging.


## 6) Why Safety Matters So Much

Because safe methods may be:
	•	Automatically retried
	•	Prefetched by browsers
	•	Crawled by search engines
	•	Cached aggressively
	•	Replayed by proxies

If a safe method has side effects, those effects may happen unexpectedly.

Example: Your dashboard sends `GET /api/voltage` and times out. Your HTTP library automatically retries—GET is safe, retries are fine. Or your browser prefetches `GET /api/config` links—safe to prefetch, no mutations. But if `GET /api/reboot` actually reboots the Pi, retries and prefetching cause multiple reboots—unexpected side effects. Safety matters because safe methods are trusted to be harmless.


## 7) The GET Trap

If GET changes state:
	•	Reloading a page mutates data
	•	Crawlers trigger actions
	•	Prefetching causes writes
	•	Caching breaks correctness

This is one of the most common HTTP mistakes.

Example: Your Pi implements `GET /api/increment_counter` that increments a counter. Your dashboard reloads the page—counter increments. A crawler visits—counter increments. Browser prefetches—counter increments. Caches cache mutations—everything breaks. This is the GET trap—using GET for mutations breaks the web. Use POST or PATCH instead.


## 8) Unsafe Methods: Side Effects Allowed

Unsafe methods may change state.

These include:
	•	POST (e.g., `POST /api/temp`—creates reading)
	•	PUT (e.g., `PUT /api/config`—replaces config)
	•	PATCH (e.g., `PATCH /api/config`—updates config)
	•	DELETE (e.g., `DELETE /api/sensors/old_id`—removes sensor)

Calling them has consequences.

Example: Your ESP32 sends `POST /api/temp`—creates a temperature reading, state changes. Or your dashboard sends `PUT /api/config`—replaces entire config, state changes. Or sends `DELETE /api/sensors/old_id`—removes sensor, state changes. Unsafe methods have consequences—they mutate state.


## 9) Unsafe Does Not Mean “Bad”

Unsafe means:

“This request may change something.”

It does not mean:
	•	The request is dangerous
	•	The request is forbidden
	•	The request is unreliable

It means: do not assume this can be repeated safely.


## 10) Why Browsers Treat Unsafe Methods Carefully

Browsers:
	•	Warn on resubmitting POST
	•	Do not prefetch POST
	•	Require user intent

They assume unsafe methods have consequences.

Example: Your dashboard submits a form with `POST /api/sensors`. Your browser warns "Are you sure you want to resubmit?"—POST has consequences. Or your browser doesn't prefetch POST links—unsafe methods aren't prefetched. Browsers assume unsafe methods have consequences—they require explicit user intent, not automatic behavior.

Example: Your dashboard submits a form with `POST /api/sensors`. Your browser warns "Are you sure you want to resubmit?"—POST has consequences. Or your browser doesn't prefetch POST links—unsafe methods aren't prefetched. Browsers assume unsafe methods have consequences—they require explicit user intent, not automatic behavior.


## 11) Idempotency: Same Effect, No Matter How Many Times

An idempotent operation produces the same result whether it runs once or many times.

Important:
	•	“Same result” means same final state
	•	It does not mean the response is identical
	•	It does not mean no work happens


## 12) Idempotency Is About Final State

Example:
	•	PUT /resource with value X
	•	PUT /resource with value X again

The server may:
	•	Write to disk twice
	•	Log twice
	•	Do work twice

But the final state is identical.

That’s idempotent.


## 13) Which Methods Are Idempotent

Idempotent methods include:
	•	GET (e.g., `GET /api/voltage`—same result if repeated)
	•	PUT (e.g., `PUT /api/config`—same final state if repeated)
	•	DELETE (e.g., `DELETE /api/sensors/old_id`—same final state if repeated)
	•	HEAD (e.g., `HEAD /api/config`—same result if repeated)
	•	OPTIONS (e.g., `OPTIONS /api/sensors`—same result if repeated)

PATCH may be idempotent—depending on the operation (e.g., `PATCH /api/config` with `{"voltage_threshold": 12.1}`—idempotent; `PATCH /api/stats` with `{"increment": 1}`—not idempotent).

POST is not idempotent (e.g., `POST /api/temp`—creates new reading each time).


## 14) GET Is Idempotent and Safe
	•	No state change
	•	Repeating it does nothing new

This is why GET is so powerful.

Example: Your ESP32 sends `GET /api/voltage` once—no state change, reads voltage. Sends it ten times—still no state change, reads voltage ten times. GET is both safe (no mutations) and idempotent (same result if repeated). This is why GET is so powerful—it can be retried, cached, prefetched, crawled, all without side effects.


## 15) PUT Is Idempotent but Unsafe

PUT:
	•	Changes state
	•	But repeating it yields the same state

This makes PUT safe to retry after failures.

Example: Your dashboard sends `PUT /api/config` with `{"voltage_threshold": 12.1}`. PUT changes state (config is updated), but it's idempotent—sending the same PUT again yields the same final state. This makes PUT safe to retry after failures—if a PUT times out, retrying with the same body is safe. Unsafe (mutates state) but idempotent (same final state).


## 16) DELETE Is Idempotent but Unsafe

DELETE:
	•	Removes a resource
	•	Removing it again changes nothing

Deleting twice is the same as deleting once.

Example: Your dashboard sends `DELETE /api/sensors/old_id` once—sensor removed. Sends it again—sensor already gone, same final state. DELETE is idempotent—deleting twice is the same as deleting once. This makes DELETE safe to retry after failures—if a DELETE times out, retrying is safe. Unsafe (mutates state) but idempotent (same final state).


## 17) PATCH Is Conditionally Idempotent

PATCH depends on what the patch does.

Idempotent patch:
	•	“Set threshold to 12.1”

Non-idempotent patch:
	•	“Increment counter by 1”

Same method. Different semantics.


## 18) POST Is Not Idempotent

POST:
	•	Submits work
	•	Creates resources
	•	Triggers actions

Two identical POSTs may:
	•	Create two records (e.g., ESP32 registers sensor twice)
	•	Trigger two jobs (e.g., solar logger processes readings twice)
	•	Charge twice (e.g., payment processing)

This is intentional.

Example: Your ESP32 sends `POST /api/sensors` twice. Two sensor records are created—this is intentional. POST is not idempotent—two identical POSTs may create two resources.


## 19) Why POST Exists Anyway

Because sometimes:
	•	You don’t know the resource ID yet
	•	The action is inherently one-time
	•	You’re submitting work, not state

POST is for commands, not state replacement.


## 20) Retries Are the Real Problem

The danger is not POST itself.

The danger is retries.

Example: Your ESP32 sends `POST /api/temp` and it succeeds—no problem. Or sends `POST /api/temp` and times out, then retries—might create duplicate readings. POST itself isn't dangerous—retries are. When failures happen (timeouts, connection drops), retries duplicate POST effects. That's why idempotency matters—it makes retries safe.

Example: Your ESP32 sends `POST /api/temp` and it succeeds—no problem. Or sends `POST /api/temp` and times out, then retries—might create duplicate readings. POST itself isn't dangerous—retries are. When failures happen (timeouts, connection drops), retries duplicate POST effects. That's why idempotency matters—it makes retries safe.


## 21) Why Retries Happen

Retries happen because:
	•	The response timed out
	•	The connection dropped
	•	The client crashed
	•	The server restarted
	•	The network partitioned

The client does not know whether the server processed the request.

Example: Your ESP32 sends `POST /api/temp` and times out after 30 seconds. Did the Pi receive it? Process it? Unknown. Or your dashboard sends `PUT /api/config` and the connection drops mid-transfer. Did the Pi receive it? Unknown. Retries happen because failures are ambiguous—the client doesn't know what happened. Idempotency makes retries safe.


## 22) The “Did It Happen?” Problem

After a timeout, the client asks:

“Did the server receive my request or not?”

There are only three possibilities:
	1.	The server never got it
	2.	The server got it but didn’t finish
	3.	The server finished but the response was lost

HTTP gives no built-in answer.


## 23) Why Idempotency Solves This

If the operation is idempotent:
	•	Retry is safe
	•	Final state is correct

If it is not:
	•	Retry may duplicate effects

Example: Your dashboard sends `PUT /api/config` with `{"voltage_threshold": 12.1}` and times out. PUT is idempotent—retry is safe. Whether the Pi received it or not, retrying yields the same final state (threshold is 12.1). Or sends `POST /api/temp` and times out. POST is not idempotent—retry may duplicate effects. If the Pi already processed it, retrying creates a duplicate reading. Idempotency solves the "did it happen?" problem.

Example: Your dashboard sends `PUT /api/config` with `{"voltage_threshold": 12.1}` and times out. PUT is idempotent—retry is safe. Whether the Pi received it or not, retrying yields the same final state (threshold is 12.1). Or sends `POST /api/temp` and times out. POST is not idempotent—retry may duplicate effects. If the Pi already processed it, retrying creates a duplicate reading. Idempotency solves the "did it happen?" problem.


## 24) Automatic Retries in the Real World

Retries may be triggered by:
	•	HTTP client libraries
	•	Load balancers
	•	Reverse proxies
	•	Gateways
	•	Mobile SDKs

Even if you don’t retry, something else might.


## 25) POST + Retry = Duplicate Risk

This is why POST is dangerous under failure.

Example:
	•	POST /orders
	•	Timeout
	•	Retry
	•	Two orders created

Nothing “went wrong” at the protocol level.


## 26) Designing POST Safely

You must design POST endpoints with retries in mind.

Common strategies:
	•	Idempotency keys (e.g., `Idempotency-Key: esp32-temp-2024-01-30-12:34:56`)
	•	Client-generated IDs (e.g., `POST /api/readings` with `{"id": "reading-123", ...}`)
	•	Deduplication windows (e.g., reject duplicate requests within 5 minutes)
	•	Explicit retry tokens (e.g., `Retry-Token: abc123`)

Example: Your ESP32 sends `POST /api/temp` with header `Idempotency-Key: esp32-temp-2024-01-30-12:34:56`. If it times out and retries with the same key, your Pi recognizes the duplicate and returns the original response instead of creating a new reading. POST becomes effectively idempotent through idempotency keys.


## 27) Idempotency Keys

An idempotency key is:
	•	A client-generated unique identifier
	•	Sent with the request (usually a header)

The server:
	•	Records the key
	•	Rejects or reuses duplicate requests with the same key

Example: Your ESP32 sends `POST /api/temp` with header `Idempotency-Key: esp32-temp-2024-01-30-12:34:56`. Your Pi records the key and creates the reading. If the ESP32 retries with the same key, your Pi recognizes it's a duplicate and returns the original `201 Created` response instead of creating a new reading. The key makes POST effectively idempotent.


## 28) Idempotency Keys Are Not Magic

They require:
	•	Storage (e.g., database to store keys and responses)
	•	Expiration policies (e.g., expire keys after 24 hours)
	•	Consistent behavior (e.g., same key always returns same response)

But they turn POST into effectively idempotent.

Example: Your Pi stores idempotency keys in a database with expiration (keys expire after 24 hours). When your ESP32 retries with the same key, your Pi looks it up, finds the original response, and returns it. This requires storage and consistent behavior—but it turns POST into effectively idempotent. Not magic, but effective.


## 29) Why PUT Often Beats POST

If the client can choose the resource ID:
	•	PUT is safer
	•	PUT is retry-friendly
	•	PUT avoids duplication

POST is often used out of habit, not necessity.

Example: Your dashboard creates a sensor with a known ID: `PUT /api/sensors/manual_sensor_1` with full configuration. PUT is idempotent—creating it twice yields the same result. Or your ESP32 registers itself without knowing its ID: `POST /api/sensors`, let the Pi assign the ID. If the client can choose the ID, PUT is safer—it's idempotent by design, no idempotency keys needed.


## 30) Safety vs Idempotency Matrix

Let’s make it explicit:

Method	Safe	Idempotent
GET	Yes	Yes (e.g., `GET /api/voltage`)
HEAD	Yes	Yes
OPTIONS	Yes	Yes
PUT	No	Yes (e.g., `PUT /api/config`)
DELETE	No	Yes (e.g., `DELETE /api/sensors/old_id`)
PATCH	No	Depends (e.g., `PATCH /api/config`—depends on operation)
POST	No	No (e.g., `POST /api/temp`)

This table explains most HTTP bugs.

Example: Your ESP32 uses `GET /api/voltage`—safe and idempotent, retry freely. Or uses `PUT /api/config`—unsafe but idempotent, safe to retry. Or uses `POST /api/temp`—unsafe and not idempotent, dangerous to retry. This table explains most HTTP bugs.


## 31) Safety Is About Observation

Safe methods:
	•	Observe
	•	Inspect
	•	Query

They should be invisible to the system’s evolution.


## 32) Idempotency Is About Recovery

Idempotent methods:
	•	Survive retries
	•	Tolerate duplication
	•	Enable resilience

They make failure survivable.

Example: Your dashboard sends `PUT /api/config` and times out. PUT is idempotent—retrying survives the failure, tolerates duplication (same PUT twice = same result), enables resilience. Or sends `DELETE /api/sensors/old_id` and times out. DELETE is idempotent—retrying survives the failure. Idempotency is about recovery—making failures survivable through safe retries.


## 33) Safety Is About Trust

The web assumes:
	•	GET is harmless
	•	Links are safe
	•	Crawling won’t destroy data

Break that trust and everything else breaks too.


## 34) Idempotency Is About Uncertainty

Distributed systems assume:
	•	Messages may be duplicated
	•	Responses may be lost
	•	Timeouts are ambiguous

Idempotency is how we live with that.

Example: Your ESP32 sends `POST /api/temp` and the message might be duplicated (network retransmission), the response might be lost (connection drop), the timeout is ambiguous (did the Pi receive it?). Idempotency is how we live with that uncertainty—if operations are idempotent, duplication and ambiguity don't break correctness. Idempotency makes uncertainty survivable.

Example: Your ESP32 sends `POST /api/temp` and the message might be duplicated (network retransmission), the response might be lost (connection drop), the timeout is ambiguous (did the Pi receive it?). Idempotency is how we live with that uncertainty—if operations are idempotent, duplication and ambiguity don't break correctness. Idempotency makes uncertainty survivable.


## 35) Why These Are Invariants

These rules are not conventions.

They are assumptions baked into the ecosystem:
	•	Browsers
	•	Proxies
	•	Caches
	•	CDNs
	•	APIs
	•	Tooling

You violate them at your own risk.

Example: Browsers assume GET is safe—they prefetch GET links. Proxies assume idempotent methods are retry-safe—they retry GET, PUT, DELETE automatically. Caches assume GET doesn't mutate—they cache GET responses. If you violate these invariants (e.g., GET mutates state), browsers, proxies, and caches break. These are invariants—violate them at your own risk.


## 36) The Cost of Ignoring Them

Ignoring safety and idempotency leads to:
	•	Duplicate data (e.g., ESP32 retries POST, creates duplicate readings)
	•	Inconsistent state (e.g., GET mutates state, caches break)
	•	Phantom actions (e.g., crawlers trigger mutations)
	•	Impossible debugging (e.g., "why did this happen twice?")
	•	Fragile systems (e.g., breaks under retries, failures)

Usually discovered too late.

Example: Your ESP32 uses `GET /api/increment` that increments a counter. Works in development—counter increments. Breaks in production—browsers prefetch, crawlers index, caches cache mutations. Duplicate data, inconsistent state, phantom actions, impossible debugging, fragile systems. Usually discovered too late—after production deployment.


## 37) The Mental Model

Before choosing a method, ask:
	•	Is this observational or mutational?
	•	Can it be retried safely?
	•	What happens if it runs twice?
	•	What happens if the response is lost?

The method should encode the answer.

Example: Your ESP32 wants to send a temperature reading. Observational or mutational? Mutational—creates a reading. Can it be retried safely? No—might duplicate. What happens if it runs twice? Two readings created. What happens if the response is lost? Unknown if reading was created. Answer: `POST /api/temp`—not idempotent, handle retries carefully.


## 38) Phase 0 Revisited

This chapter is Phase 0 applied to HTTP:
	•	Invariants must hold (e.g., GET must not mutate state)
	•	Failure is normal (e.g., ESP32 timeouts, Pi crashes)
	•	Boundaries matter (e.g., HTTP vs transport failures)
	•	Absence ≠ error (e.g., timeout vs 500)
	•	Retries are reality (e.g., automatic retries by libraries, proxies)

HTTP methods exist to encode those truths.

Example: Your ESP32 sends `GET /api/voltage`—invariant: GET must not mutate state. Or times out—failure is normal, retries are reality. HTTP methods encode these truths—safety and idempotency make systems survivable.


## Reflection
You send a POST to create an order.
The request times out.
You retry.

How many orders exist now?

If the answer is “I don’t know,” your design is incomplete.


## Core Understanding

Safety and idempotency are HTTP invariants:
	•	Safe methods do not change state (GET, HEAD, OPTIONS)
	•	Idempotent methods tolerate retries (GET, PUT, DELETE, HEAD, OPTIONS; PATCH depends)
	•	GET is safe and idempotent (retry freely, cache, prefetch)
	•	PUT and DELETE are idempotent but unsafe (safe to retry, not safe to prefetch)
	•	POST is neither safe nor idempotent (dangerous to retry, requires careful design)
	•	Retries are unavoidable (libraries, proxies, load balancers retry automatically)
	•	Method choice is failure design (determines retry safety, cache behavior, system resilience)

HTTP does not protect you from mistakes.
It assumes you understand these invariants.

This chapter builds on Chapter 2.13 (HTTP methods). Next: Chapter 2.15 — Headers: Overview and Purpose, where we explore how HTTP carries metadata, control signals, authentication, caching, and state without breaking statelessness. This is where HTTP stops being "requests and responses" and becomes a control plane.


## What's Next
Next is Chapter 2.15: Headers — Overview and Purpose, where we explore how HTTP carries metadata, control signals, authentication, caching, and state without breaking statelessness.

This is where HTTP stops being “requests and responses” and becomes a control plane.