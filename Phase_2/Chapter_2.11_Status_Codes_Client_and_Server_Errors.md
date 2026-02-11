# Phase 2 · Chapter 2.11: Status Codes — Client and Server Errors

This chapter builds on [Chapter 2.1: Request-Response](Chapter_2.1_Request-Response.md), [Chapter 2.2: HTTP on TCP](Chapter_2.2_HTTP_on_TCP.md), [Chapter 2.3: What HTTP Is](Chapter_2.3_What_HTTP_Is.md), [Chapter 2.4: HTTP as Text](Chapter_2.4_HTTP_as_Text.md), [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.6: Request Structure](Chapter_2.6_Request_Structure.md), [Chapter 2.7: The Request Line](Chapter_2.7_The_Request_Line.md), [Chapter 2.8: Response Structure](Chapter_2.8_Response_Structure.md), [Chapter 2.9: Status Codes Overview](Chapter_2.9_Status_Codes_Overview.md), and [Chapter 2.10: Status Codes — Success and Redirects](Chapter_2.10_Status_Codes_Success_and_Redirects.md).

Error status codes exist to answer one core question:

Who is responsible for fixing this?

HTTP does not use errors to shame.
It uses them to assign responsibility.

The first digit of the status code answers:
	•	Did the client send something wrong?
	•	Or did the server fail to handle a valid request?

4xx and 5xx are not interchangeable.
They describe where the failure lives. Chapter 2.9 gave an overview of status codes; Chapter 2.10 covered success and redirects. This chapter focuses on errors—4xx (client errors) and 5xx (server errors). Whether your ESP32 gets `400 Bad Request` for malformed JSON, your dashboard gets `401 Unauthorized` for missing credentials, or your Pi responds `500 Internal Server Error`—error codes assign responsibility precisely.


## 1) Errors Are Still Responses

An HTTP error response means:
	•	The request reached the server
	•	The server understood the request
	•	The server made a decision about it
	•	The server replied intentionally

This is not a crash.
This is not silence.
This is communication.

Example: Your ESP32 sends `POST /api/temp` with malformed JSON. Your Pi responds `400 Bad Request`. The request reached the Pi, the Pi understood it was broken, and the Pi replied intentionally. This is an HTTP error—not silence, not a crash.


## 2) Error vs Failure (Preview)

Before diving in, keep this distinction in mind:
	•	HTTP error: A response with a 4xx or 5xx code
	•	Failure: No response at all (timeout, DNS, connection drop)

This chapter is about errors, not failures.

Errors mean the server spoke.

Example: Your dashboard requests `/api/voltage` and gets `404 Not Found`—that's an HTTP error, the Pi responded. Contrast with a timeout or connection reset—that's a failure, no response at all.


## 3) 4xx vs 5xx: The Line of Responsibility

The most important rule:
	•	4xx → The client is at fault
	•	5xx → The server is at fault

That’s it.
Everything else is detail.


## 4) 4xx: Client Errors

A 4xx response means:
	•	The request was received
	•	The server understood it
	•	The server refuses or cannot process it because of the request itself

The server is saying:

“I can’t do this as asked.”


## 5) Clients Must Not Retry 4xx Blindly

A 4xx error usually means:
	•	Retrying the same request will fail again
	•	Something must change on the client side

Retrying without modification is wasted effort.

Example: Your coop controller sends `GET /api/fence_status` without authentication and gets `401 Unauthorized`. Retrying the same request won't help—the controller must add credentials first.


## 6) 400 Bad Request — The Request Is Broken

400 Bad Request means:
	•	The request is malformed
	•	The server cannot parse or validate it
	•	The problem is structural or semantic

This is the most generic client error.


## 7) Common Causes of 400

Typical reasons include:
	•	Invalid JSON (e.g., ESP32 sends `{"temp": 72.5` with missing closing brace)
	•	Malformed syntax
	•	Missing required fields (e.g., dashboard sends `POST /api/sensors` without `device_id`)
	•	Wrong data types (e.g., sending string `"72.5"` when number `72.5` is required)
	•	Invalid query parameters (e.g., `GET /api/voltage?unit=invalid`)

The server cannot proceed because the request makes no sense.


## 8) 400 Is About Structure, Not Permission

A 400 does not mean:
	•	You are unauthorized
	•	You lack permission
	•	The resource doesn’t exist

It means:

“This request is not valid as written.”


## 9) Servers Should Be Explicit with 400

Good servers:
	•	Return a clear error message in the body
	•	Describe what is wrong
	•	Help the client fix the request

Bad servers return 400 with no explanation.

Example: Your ESP32 sends malformed JSON and gets `400 Bad Request` with an empty body. What's wrong? The ESP32 has no idea. Good servers return `400` with a body like `{"error": "Invalid JSON: missing closing brace"}`.


## 10) 401 Unauthorized — Authentication Required

Despite the name, 401 Unauthorized actually means:

Not authenticated

It signals:
	•	Credentials are missing
	•	Or credentials are invalid

The server is asking:

“Who are you?”


## 11) Authentication vs Authorization

This distinction matters:
	•	Authentication: Who are you? (identity)
	•	Authorization: Are you allowed? (permission)

401 is about authentication, not permission.

Example: Your dashboard sends `GET /api/sensors` without an `Authorization` header. Your Pi responds `401 Unauthorized`—who are you? Prove your identity first. Once authenticated, if you try `DELETE /api/config`, you might get `403 Forbidden`—you're authenticated, but not authorized for that action.


## 12) Typical 401 Scenarios

401 occurs when:
	•	No Authorization header is present (e.g., ESP32 forgets to include `Authorization: Bearer xyz`)
	•	A token is expired (e.g., dashboard's auth token expired after 24 hours)
	•	Credentials are invalid (e.g., coop controller sends wrong API key)

The request could succeed if identity were proven.


## 13) 401 Often Includes a Challenge

Many 401 responses include:
	•	WWW-Authenticate header
	•	Instructions for how to authenticate

This is the server inviting the client to try again properly.

Example: Your coop controller sends `GET /api/fence_status` without credentials. Your Pi responds `401 Unauthorized` with header `WWW-Authenticate: Bearer`. The controller knows it needs to add `Authorization: Bearer <token>` and retry.


## 14) Clients Should Retry 401 Correctly

Retrying a 401 can make sense—but only if:
	•	Credentials are added or corrected

Blind retries are pointless.

Example: Your ESP32 sends `POST /api/temp` and gets `401 Unauthorized`. The ESP32 should fetch a new token, add `Authorization: Bearer <new_token>`, and retry. Retrying the same request without credentials will just get `401` again.


## 15) 403 Forbidden — Identity Known, Access Denied

403 Forbidden means:
	•	The client is authenticated
	•	The server knows who you are
	•	You are not allowed to do this

This is a hard stop.

Example: Your solar logger sends `DELETE /api/config` with valid authentication, but your Pi responds `403 Forbidden`—you're authenticated, but you don't have permission to delete config. No amount of retrying will help.


## 16) What 403 Communicates

The server is saying:

“I know who you are. You don’t have permission.”

No amount of retrying will help unless permissions change.

Example: Your ESP32 is authenticated but tries to access `/api/admin/sensors`. Your Pi responds `403 Forbidden`—the ESP32 doesn't have admin permissions. Retrying won't help—permissions must change on the server side.


## 17) 403 vs 401

This distinction is critical:
	•	401: “Who are you?”
	•	403: “I know who you are, and no.”

Confusing these breaks client logic.


## 18) When to Use 403

Use 403 when:
	•	Access is restricted
	•	The resource exists
	•	Authentication succeeded
	•	Authorization failed

Do not use 403 to hide authentication requirements.

Example: Your solar logger is authenticated but tries to access `/api/admin/users`. Your Pi responds `403 Forbidden`—the resource exists, you're authenticated, but you're not an admin. Use `401` if credentials are missing, `403` if credentials are valid but insufficient.


## 19) 404 Not Found — The Resource Does Not Exist

404 Not Found means:
	•	The server understood the request
	•	The resource does not exist at that path

This is about absence, not permission.

Example: Your dashboard requests `GET /api/sensors/nonexistent_id`. Your Pi responds `404 Not Found`—that sensor doesn't exist. This isn't about permission (you're allowed to read sensors), it's about absence.


## 20) What 404 Does Not Mean

404 does not mean:
	•	The server is down
	•	The request was malformed
	•	The client is forbidden

It means:

“There is nothing here.”


## 21) 404 Is About the Path

The path in the request line:

GET /something HTTP/1.1

The server is saying:

“That path maps to nothing.”


## 22) 404 vs 403: Design Choice

Sometimes APIs deliberately return 404 instead of 403:
	•	To avoid revealing that a resource exists
	•	To reduce information leakage

This is a design decision—not a protocol requirement.

Example: Your ESP32 tries to access `/api/admin/sensors`. Your Pi could return `403 Forbidden` (you're authenticated but not authorized) or `404 Not Found` (to hide that admin endpoints exist). Both are valid—`404` reduces information leakage but makes debugging harder.


## 23) 404 Is Cacheable

404 responses can be cached.
Absence is still information.

Example: Your dashboard requests `GET /api/sensors/nonexistent_id` and gets `404 Not Found`. Your dashboard can cache this—that sensor doesn't exist, don't ask again for a while. Absence is information worth caching.


## 24) 5xx: Server Errors

A 5xx response means:
	•	The request was valid
	•	The client did nothing wrong
	•	The server failed to fulfill the request

Responsibility shifts to the server.

Example: Your dashboard sends a valid `GET /api/voltage` request. Your Pi crashes while processing it and responds `500 Internal Server Error`. The request was fine—the Pi failed. Responsibility is on the server.


## 25) Clients May Retry 5xx

Unlike 4xx:
	•	Retrying 5xx may succeed
	•	Especially if the failure was transient

But retries should be bounded.

Example: Your ESP32 sends `POST /api/temp` and gets `503 Service Unavailable`. The Pi might recover—retry after a delay. But don't retry forever—if it's still `503` after several attempts, back off.


## 26) 500 Internal Server Error — The Server Broke

500 Internal Server Error is the generic server failure.

It means:
	•	An unhandled exception occurred
	•	A bug was hit
	•	The server could not complete the request

The server is admitting failure.

Example: Your dashboard requests `GET /api/voltage` and your Pi hits an unhandled exception while reading the sensor. The Pi responds `500 Internal Server Error`—something broke on the server side.


## 27) What 500 Tells the Client

Not much detail.
Just this:

“Something went wrong on our side.”

Clients should not assume anything else.


## 28) Servers Should Log 500s Aggressively

A 500 response should:
	•	Be logged
	•	Trigger investigation
	•	Never be ignored

500s are symptoms of broken assumptions.

Example: Your Pi responds `500 Internal Server Error` to `GET /api/voltage`. Your Pi should log the full stack trace, the request that caused it, and any relevant context. `500` means something unexpected happened—investigate immediately. Don't ignore it.

Example: Your Pi responds `500 Internal Server Error` to `GET /api/voltage`. Your Pi should log the full stack trace, the request that caused it, and any relevant context. `500` means something unexpected happened—investigate immediately. Don't ignore it.


## 29) Clients Should Be Careful with 500

Clients should:
	•	Retry cautiously
	•	Possibly back off
	•	Not change the request automatically

The request may be fine.

Example: Your ESP32 sends `POST /api/temp` and gets `500 Internal Server Error`. The request was valid—don't modify it. Retry after a delay, but back off if it keeps failing. The server might be down, or it might recover. Don't assume the request was wrong—`500` means server failure, not client error.


## 30) 502 Bad Gateway — Upstream Failure

502 Bad Gateway means:
	•	The server is acting as a proxy or gateway
	•	It contacted an upstream service
	•	The upstream response was invalid or broken

The failure is not local—but it is still server-side.

Example: Your dashboard requests `/api/voltage`. Your Pi acts as a gateway and forwards the request to an upstream sensor service. The upstream service crashes. Your Pi responds `502 Bad Gateway`—the failure is upstream, but it's still the server's responsibility.


## 31) Where 502 Happens

Common in:
	•	Reverse proxies
	•	Load balancers
	•	Microservice architectures

The server is saying:

“I asked someone else, and they failed.”


## 32) 503 Service Unavailable — Temporary Failure

503 Service Unavailable means:
	•	The server is currently unable to handle the request
	•	Due to overload, maintenance, or temporary outage

This is a temporary condition.

Example: Your Pi is rebooting or overloaded. Your ESP32 sends `POST /api/temp` and gets `503 Service Unavailable`. The Pi is temporarily unable to handle requests—this should pass.


## 33) Retry Semantics of 503

503 often includes:

Retry-After: seconds

This tells the client:

“Don’t hammer me. Try again later.”


## 34) 503 Is Not a Crash

503 is intentional.
The server is protecting itself.

This is controlled refusal, not failure.

Example: Your Pi is rebooting or under heavy load. Instead of crashing or accepting requests it can't handle, it responds `503 Service Unavailable` to new requests. This is intentional—the Pi is protecting itself. Once it recovers, it will accept requests again. Contrast with `500`—that's an unexpected failure.


## 35) Choosing Between 500, 502, and 503
	•	500: Bug or unexpected failure (server crashed, unhandled exception)
	•	502: Dependency failed (upstream service broke)
	•	503: Temporarily unavailable (overloaded, rebooting, maintenance)

Each communicates a different operational state.

Example: Your dashboard requests `/api/voltage`. If your Pi hits an unhandled exception, respond `500`. If your Pi forwards to an upstream sensor service that crashes, respond `502`. If your Pi is rebooting, respond `503` with `Retry-After`. Each code tells the client something different about what went wrong.


## 36) Error Codes Are Contracts

When a server returns a status code, it is making a promise about meaning.

Clients build logic around these promises.

Breaking them causes cascading failure.

Example: Your ESP32 expects `401 Unauthorized` when credentials are missing, so it can fetch a new token and retry. If your Pi returns `403 Forbidden` instead, the ESP32 might think it's authenticated but lacks permission—wrong logic, wrong behavior. Error codes are contracts—break them at your peril.


## 37) Error Bodies Are Optional but Useful

HTTP does not require error bodies.
But humans do.

Good APIs:
	•	Return structured error messages
	•	Explain what went wrong
	•	Preserve machine readability

Example: Your ESP32 sends malformed JSON and gets `400 Bad Request` with body `{"error": "Invalid JSON: missing closing brace at line 1"}`. The status code says "client error," the body explains what's wrong. Contrast with `400` and an empty body—the ESP32 knows something's wrong but not what.


## 38) Do Not Encode Errors Only in JSON

Returning:

```
200 OK
{ "error": "something broke" }
```

Is a protocol lie.

Errors belong in status codes first.

Example: Your ESP32 sends invalid data and your Pi responds `200 OK` with body `{"error": "invalid data"}`. This is a protocol lie—use `400 Bad Request` with the error in the status code, not hidden in JSON. Generic HTTP clients won't know to check the body for errors—they rely on status codes.


## 39) HTTP Errors Are Not Exceptions

In HTTP:
	•	Errors are expected
	•	They are part of normal operation
	•	They do not imply panic

This is different from many programming models.

Example: Your dashboard requests `/api/sensors/nonexistent_id` and gets `404 Not Found`. This is normal—resources don't always exist. Handle it gracefully, don't crash. Or your ESP32 gets `401 Unauthorized`—normal, fetch a new token and retry. Errors are expected in HTTP—they're signals, not exceptions.


## 40) Errors Enable Robust Clients

Clear errors allow clients to:
	•	Retry correctly (e.g., `503` with `Retry-After` → wait and retry)
	•	Fix requests (e.g., `400` with error message → fix JSON and retry)
	•	Ask for credentials (e.g., `401` → fetch token and retry)
	•	Back off gracefully (e.g., repeated `503` → exponential backoff)

Ambiguous errors cause chaos.

Example: Your ESP32 gets `400 Bad Request` with a clear message—fix the request and retry. Or gets `503 Service Unavailable` with `Retry-After: 60`—wait 60 seconds and retry. Clear errors enable robust automation. Ambiguous errors (like `200 OK` with `{"error": "something"}`) break automation—clients can't decide behavior mechanically.


## Reflection

Think about real error scenarios—your ESP32 sending malformed JSON, your dashboard missing credentials, your Pi crashing mid-request.
	•	You send malformed JSON. Why is that 400 and not 500?
	•	You forget authentication. Why 401 and not 403?
	•	You authenticate correctly but lack permission. Why 403 and not 404?
	•	The server crashes mid-request. Why 500 and not silence?

Consider failure modes:
	•	Your ESP32 sends `POST /api/temp` with `{"temp": 72.5` (missing closing brace). Your Pi responds `400 Bad Request`—the request is malformed, client error. Not `500`—the Pi understood the request was broken. The ESP32 must fix the JSON.
	•	Your dashboard sends `GET /api/sensors` without credentials and gets `401 Unauthorized`—not authenticated. Not `403`—you haven't proven identity yet. Add credentials and retry.
	•	Your solar logger is authenticated but tries `DELETE /api/config` and gets `403 Forbidden`—authenticated but not authorized. Not `404`—the resource exists, you just can't delete it. Permissions must change on the server.
	•	Your Pi crashes while processing `GET /api/voltage` and responds `500 Internal Server Error`—server failure. Not silence—the Pi responded intentionally, assigning responsibility to itself. The request was valid, the Pi failed.

If you can answer these cleanly, you understand HTTP responsibility.


## Core Understanding

Error status codes assign responsibility:
	•	400 — bad request (client error, fix the request)
	•	401 — not authenticated (add credentials)
	•	403 — authenticated but not authorized (permissions issue)
	•	404 — resource does not exist (path doesn't map)
	•	500 — server failed internally (bug, crash, exception)
	•	502 — upstream failure (dependency broke)
	•	503 — temporary unavailability (overload, maintenance)

4xx assigns responsibility to the client.
5xx assigns responsibility to the server.

The status code tells you where to look.

This chapter builds on Chapter 2.10 (success and redirects). Next: Chapter 2.12 — Errors vs Failures, where we draw a hard line between HTTP error responses and network-level failures, and explain why silence is sometimes the most important signal of all.