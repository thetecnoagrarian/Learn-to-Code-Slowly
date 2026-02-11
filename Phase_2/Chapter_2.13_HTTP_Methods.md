# Phase 2 · Chapter 2.13: HTTP Methods

This chapter builds on [Chapter 2.1: Request-Response](Chapter_2.1_Request-Response.md), [Chapter 2.2: HTTP on TCP](Chapter_2.2_HTTP_on_TCP.md), [Chapter 2.3: What HTTP Is](Chapter_2.3_What_HTTP_Is.md), [Chapter 2.4: HTTP as Text](Chapter_2.4_HTTP_as_Text.md), [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.6: Request Structure](Chapter_2.6_Request_Structure.md), [Chapter 2.7: The Request Line](Chapter_2.7_The_Request_Line.md), [Chapter 2.8: Response Structure](Chapter_2.8_Response_Structure.md), [Chapter 2.9: Status Codes Overview](Chapter_2.9_Status_Codes_Overview.md), [Chapter 2.10: Status Codes — Success and Redirects](Chapter_2.10_Status_Codes_Success_and_Redirects.md), [Chapter 2.11: Status Codes — Client and Server Errors](Chapter_2.11_Status_Codes_Client_and_Server_Errors.md), and [Chapter 2.12: Errors vs Failures](Chapter_2.12_Errors_vs_Failures.md).

The HTTP method tells the server what kind of action the client intends.
It is not decoration.
It is not optional semantics.
It is a contract.

Every method encodes expectations about:
	•	Safety
	•	Idempotency
	•	Caching
	•	Retries
	•	Side effects

If you misuse methods, your system will break under failure, not under success. Chapter 2.12 showed how errors differ from failures; this chapter shows how method semantics determine what's safe to retry when failures occur. Whether your ESP32 times out sending temperature readings, your dashboard retries a failed request, or your Pi's connection drops mid-transfer—method choice determines whether retries are safe or dangerous.


## 1) Methods Encode Intent, Not Implementation

The method does not tell the server how to do something.
It tells the server what kind of thing the client wants.
	•	“I want to retrieve”
	•	“I want to create”
	•	“I want to replace”
	•	“I want to partially modify”
	•	“I want to remove”

The server decides how to fulfill that intent.


## 2) Methods Are Part of the Protocol Contract

When a client sends:

GET /resource

It is making a promise:

“I am not asking you to change anything.”

When a client sends:

POST /resource

It is saying:

“This may cause a change.”

Servers, proxies, caches, and clients rely on this promise.

Example: Your dashboard sends `GET /api/voltage`—promising no state change. Your Pi can cache this, prefetch it, retry it safely. Or your ESP32 sends `POST /api/temp`—signaling potential change. Your Pi knows not to cache this, not to retry it automatically, to handle it carefully. The method is a contract—break it at your peril.


## 3) Why Methods Matter Under Failure

When everything works:
	•	Incorrect methods appear to work

When failures happen:
	•	Incorrect methods cause data loss
	•	Duplicate actions
	•	Corrupted state
	•	Inconsistent systems

Methods exist for failure cases, not happy paths.

Example: Your ESP32 sends `GET /api/increment_counter` and it works—the counter increments. But when the request times out and your ESP32 retries (GET is safe to retry), the counter increments twice. Or your solar logger sends `POST /api/readings` and times out. If you retry blindly, you might send duplicate readings. Methods exist for failure cases—when retries happen, when connections drop, when ambiguity enters the system.


## 4) The Core Methods

This phase focuses on the five most important methods:
	•	GET
	•	POST
	•	PUT
	•	PATCH
	•	DELETE

These are sufficient to model almost all HTTP APIs correctly.


## 5) GET — Retrieve Without Side Effects

GET retrieves a representation of a resource.

Properties:
	•	Safe
	•	Idempotent
	•	Cacheable
	•	No request body (by convention)

GET must not change server state.


## 6) What “Safe” Means

Safe means:

“This request does not cause a state change on the server.”

It does not mean:
	•	The request is harmless
	•	The request is free
	•	The request is cheap

It means: no mutation.


## 7) Why Safety Matters

Because safe methods can be:
	•	Retried automatically
	•	Prefetched
	•	Cached
	•	Replayed

If GET mutates state, the entire web breaks.

Example: Your dashboard sends `GET /api/voltage` and times out. Your HTTP library can retry automatically—GET is safe, no side effects. Or your browser prefetches `GET /api/config` links—safe to prefetch, no mutations. If GET mutated state, retries and prefetching would break everything. Safety enables automation.


## 8) GET and Idempotency

GET is idempotent:
	•	One GET → state unchanged
	•	Ten GETs → state unchanged

The response may change over time, but the act of requesting does not.

Example: Your ESP32 sends `GET /api/voltage` once—state unchanged. Sends it ten times—state still unchanged. The voltage reading might change (it's a new reading each time), but the act of requesting doesn't change server state. GET is both safe and idempotent—perfect for retries.


## 9) GET and Bodies

Technically, HTTP allows GET bodies.
Practically, you should never rely on them.

Many clients, proxies, and servers ignore GET bodies entirely.

If you need a body, you likely want POST.

Example: Your dashboard sends `GET /api/search` with a body containing search criteria. Some proxies might strip the body, some servers might ignore it. Use query parameters instead: `GET /api/search?q=voltage`. Or if you need complex data, use `POST /api/search`—POST is designed for bodies.


## 10) GET Examples

Good uses:
	•	Fetch sensor readings (e.g., `GET /api/voltage` from Pi)
	•	Retrieve configuration (e.g., `GET /api/config` from coop controller)
	•	Load a web page (e.g., dashboard HTML)
	•	Query current state (e.g., `GET /api/fence_status` from poultry net controller)

Bad uses:
	•	Triggering actions (e.g., `GET /api/reboot`—use POST)
	•	Updating counters (e.g., `GET /api/increment`—use POST or PATCH)
	•	Creating records (e.g., `GET /api/create_sensor`—use POST)


## 11) POST — Submit or Create

POST submits data to be processed.

POST is for:
	•	Creating new resources
	•	Triggering actions
	•	Submitting forms

POST is not idempotent by default.


## 12) POST Means “Process This”

POST does not mean “store this here”.

It means:

“Here is data. Do something with it.”

What happens next is server-defined.


## 13) Why POST Is Dangerous Under Failure

Because POST is not idempotent:
	•	Retry after timeout → duplicate action
	•	Retry after partial failure → double creation

This is why POST requires care.

Example: Your ESP32 sends `POST /api/temp` and times out. Did the Pi receive it? Process it? Unknown. If you retry, you might send duplicate temperature readings. Or your solar logger sends `POST /api/readings` and the connection drops mid-transfer. Retrying might create duplicate readings. POST requires care—understand what you're retrying and why.


## 14) POST and Resource Creation

Common pattern:

```
POST /api/sensors
```

Server response:
	•	201 Created
	•	Location header with new resource URL (e.g., `Location: /api/sensors/esp32_coop`)

The client did not choose the ID.
The server did.

Example: Your ESP32 sends `POST /api/sensors` to register itself. Your Pi creates a sensor record, assigns ID `esp32_coop`, and responds `201 Created` with `Location: /api/sensors/esp32_coop`. The ESP32 didn't choose the ID—the Pi did.


## 15) POST and Side Effects

POST may:
	•	Create records (e.g., ESP32 registers new sensor)
	•	Send emails (e.g., alert notifications)
	•	Trigger jobs (e.g., solar logger starts data processing)
	•	Charge credit cards (e.g., payment processing)

This is why retries are dangerous.

Example: Your solar logger sends `POST /api/readings` and times out. If you retry blindly, you might send duplicate readings, corrupting your data. POST retries are dangerous—understand what you're retrying.


## 16) PUT — Replace a Resource

PUT means “store this representation at this exact location.”

PUT is:
	•	Idempotent
	•	Not safe
	•	Often used for full replacement


## 17) PUT Semantics Are Precise

PUT says:

“After this request, the resource at this URL should look exactly like this.”

Not “update these fields”.
Not “merge”.

Replace.


## 18) Why PUT Is Idempotent

Because replacing the same representation twice yields the same result.
	•	PUT once → state = X
	•	PUT again → state = X

No additional effect.

Example: Your dashboard sends `PUT /api/config` with the same configuration twice. First PUT sets state to X. Second PUT sets state to X again—same result, no additional effect. This makes PUT safe to retry—if a PUT times out, retrying with the same body is safe.


## 19) PUT and Client-Controlled URLs

PUT is typically used when:
	•	The client knows the resource URL
	•	The client controls the identifier

Example:

```
PUT /api/sensors/esp32_coop
```

Example: Your dashboard knows the sensor ID and sends `PUT /api/sensors/esp32_coop` with full sensor configuration. The dashboard controls the identifier—it knows exactly which sensor to update.



## 20) PUT vs POST for Creation

You can create with PUT if:
	•	The client chooses the ID
	•	The operation is idempotent

Otherwise, use POST.

Example: Your dashboard creates a sensor with a known ID: `PUT /api/sensors/manual_sensor_1` with full configuration. The dashboard chooses the ID, and the operation is idempotent—creating it twice yields the same result. Or your ESP32 registers itself without knowing its ID—use `POST /api/sensors`, let the Pi assign the ID.


## 21) PATCH — Partial Modification

PATCH applies a partial change to a resource.

PATCH says:

“Apply this transformation.”

Not:
	•	Replace everything
	•	Create something new

Example: Your dashboard sends `PATCH /api/config` with `{"voltage_threshold": 12.1}`. This updates only the voltage threshold—other fields remain unchanged. Contrast with PUT—PUT would replace the entire config. PATCH is for partial updates, PUT is for full replacement.


## 22) PATCH Is About Intent, Not Format

PATCH does not prescribe:
	•	JSON Patch
	•	Merge Patch
	•	Any specific format

It only says: partial update.

Example: Your dashboard sends `PATCH /api/config` with `{"voltage_threshold": 12.1}`—merge patch format. Or sends `PATCH /api/config` with `[{"op": "replace", "path": "/voltage_threshold", "value": 12.1}]`—JSON Patch format. Both are valid—PATCH doesn't prescribe format, only intent: partial update.


## 23) PATCH and Idempotency

PATCH can be idempotent if:
	•	The same patch produces the same result

Example:
	•	“Set threshold to 12.1” → idempotent
	•	“Increment counter” → not idempotent


## 24) PATCH Under Failure

PATCH can be dangerous if:
	•	The operation is not idempotent
	•	Retries apply the patch multiple times

This must be designed explicitly.

Example: Your dashboard sends `PATCH /api/config` with `{"increment_reading_count": 1}` and times out. If you retry, you might increment twice. Design PATCH operations to be idempotent when possible—use "set to X" instead of "increment by Y".


## 25) DELETE — Remove a Resource

DELETE removes a resource.

DELETE is:
	•	Idempotent
	•	Not safe
	•	Often returns 204 No Content

Example: Your dashboard sends `DELETE /api/sensors/old_id`. The sensor is removed. DELETE is idempotent—deleting twice has the same end state (resource gone). DELETE is not safe—it mutates state. Often returns `204 No Content`—success, no body needed.


## 26) Why DELETE Is Idempotent

Deleting something twice has the same end state:
	•	First DELETE → resource gone
	•	Second DELETE → resource already gone

No additional effect.

Example: Your dashboard sends `DELETE /api/sensors/old_id` and gets `204 No Content`—deleted. Sends it again and gets `404 Not Found`—already gone. Same end state: resource doesn't exist. This makes DELETE safe to retry—if a DELETE times out, retrying is safe (idempotent).


## 27) DELETE and Responses

Common responses:
	•	204 No Content — success (e.g., sensor deleted)
	•	404 Not Found — already gone (e.g., sensor already deleted)
	•	403 Forbidden — not allowed (e.g., dashboard lacks permission to delete)

All are valid.

Example: Your dashboard sends `DELETE /api/sensors/old_id`. Your Pi responds `204 No Content`—deleted successfully. Or responds `404 Not Found`—already deleted (idempotent, same end state). Or responds `403 Forbidden`—you don't have permission. All are valid responses.


## 28) DELETE Does Not Mean “Erase History”

DELETE means:
	•	“This resource is no longer accessible”

It does not guarantee:
	•	Physical deletion
	•	Immediate removal
	•	No audit trail

That is server policy.


## 29) Method Safety vs Idempotency

These are different properties.

Method	Safe	Idempotent
GET	Yes	Yes
POST	No	No
PUT	No	Yes
PATCH	No	Depends
DELETE	No	Yes

Memorize this table.


## 30) Why Caches Care About Methods

Caches:
	•	Cache GET
	•	Do not cache POST
	•	Invalidate on PUT/PATCH/DELETE

If you misuse methods, caches misbehave.

Example: Your dashboard sends `GET /api/voltage`—caches can cache this response. Or sends `POST /api/temp`—caches won't cache this (POST isn't cacheable). Or sends `PUT /api/config`—caches invalidate any cached config. If you use GET to mutate state, caches will cache mutations—breaking everything.


## 31) Why Proxies Care About Methods

Proxies may:
	•	Retry idempotent methods automatically
	•	Avoid retrying POST
	•	Log methods differently

Method semantics affect infrastructure.

Example: Your ESP32 sends `GET /api/voltage` through a proxy and it times out. The proxy might retry automatically—GET is idempotent, safe to retry. Or sends `POST /api/temp` and it times out. The proxy won't retry automatically—POST isn't idempotent, retries are dangerous. Method semantics affect how infrastructure behaves.


## 32) Why Browsers Care About Methods

Browsers:
	•	Prefetch GET links
	•	Warn on resubmitting POST
	•	Change POST → GET on redirects (historically)

These behaviors assume correct method usage.

Example: Your browser prefetches `GET /api/voltage` links—safe to prefetch, no mutations. Or warns when you try to resubmit a POST form—POST isn't idempotent, resubmitting might duplicate actions. Or changes POST to GET on redirects (historical behavior)—breaking POST semantics. These behaviors assume correct method usage—break the contract, break the web.


## 33) Method Choice Is Architecture

Choosing methods correctly:
	•	Enables safe retries
	•	Enables resilience
	•	Enables caching
	•	Enables scale

Choosing incorrectly:
	•	Works in development
	•	Breaks in production

Example: Your ESP32 uses `GET /api/temp` to send temperature readings. Works in development—the Pi processes it. Breaks in production—caches cache mutations, retries duplicate readings, proxies retry automatically. Or uses `POST /api/temp` correctly—works in development and production. Method choice is architecture—it determines how your system behaves under failure.


## 34) Common Anti-Patterns
	•	Using GET to trigger actions
	•	Using POST for updates
	•	Using POST everywhere “because it works”
	•	Ignoring idempotency

These are failure multipliers.


## 35) Method + Status Code = Full Meaning

The method alone is not enough.
	•	POST + 201 = created (e.g., ESP32 creates sensor)
	•	PUT + 204 = replaced (e.g., dashboard updates config)
	•	DELETE + 404 = already gone (e.g., sensor already deleted)

Clients interpret both.

Example: Your ESP32 sends `POST /api/sensors` and gets `201 Created`—sensor created, check `Location` header. Or your dashboard sends `PUT /api/config` and gets `204 No Content`—config replaced, no body. Or sends `DELETE /api/sensors/old_id` and gets `404 Not Found`—already gone, idempotent success. Method + status code = full meaning.


## 36) Methods Are Not Permissions

Methods express intent, not authorization.
	•	GET may still be forbidden
	•	DELETE may be denied
	•	POST may require authentication

Permissions live elsewhere.

Example: Your ESP32 sends `GET /api/admin/users`—GET expresses intent (retrieve), but your Pi responds `403 Forbidden`—you don't have permission. Or sends `DELETE /api/config`—DELETE expresses intent (remove), but your Pi responds `401 Unauthorized`—you're not authenticated. Methods express intent, permissions control access.


## 37) Methods Do Not Enforce Behavior

HTTP does not prevent you from:
	•	Mutating on GET
	•	Creating on PUT
	•	Deleting on POST

The protocol trusts you.

That trust is easy to violate.

Example: Your Pi could implement `GET /api/reboot` that actually reboots the server—HTTP doesn't prevent this. Or implement `PUT /api/sensors` that creates a sensor—HTTP allows this. The protocol trusts you to honor method semantics. Violate that trust, and caches, proxies, and clients break. Discipline matters.


## 38) Why Discipline Matters

HTTP is simple because it assumes discipline.

When that discipline breaks:
	•	Clients break
	•	Caches break
	•	Retries break
	•	Systems rot

Example: Your Pi implements `GET /api/increment` that increments a counter. Works in development—the counter increments. Breaks in production—caches cache mutations, retries increment multiple times, proxies retry automatically. The discipline breaks, and everything breaks. HTTP is simple because it assumes discipline—honor the contract.


## 39) Methods and Mental Models

Think in verbs:
	•	GET → “Show me”
	•	POST → “Do this”
	•	PUT → “Make it exactly this”
	•	PATCH → “Change this part”
	•	DELETE → “Remove it”

If that sentence feels wrong, the method is wrong.


## 40) Method Choice Checklist

Before choosing a method, ask:
	•	Does this change state?
	•	Is it safe to retry?
	•	Who controls the resource ID?
	•	Can this be cached?
	•	What happens on timeout?

The method encodes your answers.

Example: Your ESP32 wants to send a temperature reading. Does it change state? Yes—creates a reading. Safe to retry? No—might duplicate. Who controls ID? Server. Can it be cached? No. What happens on timeout? Dangerous—might duplicate. Answer: `POST /api/temp`—not idempotent, server assigns ID, handle timeouts carefully.


## Reflection

Think about real operations—your ESP32 sending temperature readings, your dashboard updating config, your Pi deleting sensors.
	•	You fetch sensor data. Which method do you use—and why?
	•	You submit a new reading. Which method do you use—and why?
	•	You update a threshold. Which method do you use—and why?
	•	You delete a configuration. Which method do you use—and why?

What happens if the request times out halfway through?

Consider failure modes:
	•	Your ESP32 fetches voltage: `GET /api/voltage`. GET is safe and idempotent—safe to retry. If it times out, retry automatically—no side effects.
	•	Your ESP32 submits temperature: `POST /api/temp`. POST is not idempotent—dangerous to retry. If it times out, retrying might duplicate the reading. Handle carefully—understand what you're retrying.
	•	Your dashboard updates threshold: `PATCH /api/config` with `{"voltage_threshold": 12.1}`. PATCH can be idempotent if designed correctly. If it times out, retrying with the same patch is safe—idempotent operation.
	•	Your dashboard deletes sensor: `DELETE /api/sensors/old_id`. DELETE is idempotent—safe to retry. If it times out, retrying is safe—deleting twice has the same end state.

If you can answer that, you understand HTTP methods.


## Core Understanding
	•	Methods encode intent
	•	GET is safe and idempotent
	•	POST is neither safe nor idempotent
	•	PUT and DELETE are idempotent
	•	PATCH depends on the operation
	•	Method choice matters most under failure

HTTP methods are contracts.
Honor them.


## What's Next
Next is Chapter 2.14: Safety and Idempotency, where we formalize these properties and show exactly why retries, failures, and distributed systems make them unavoidable.

This is where HTTP stops being “web stuff” and becomes systems engineering.