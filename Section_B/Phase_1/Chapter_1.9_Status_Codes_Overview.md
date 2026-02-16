# Phase 2 · Chapter 2.9: Status Codes Overview

Status codes are not messages.
They are not explanations.
They are not opinions.

Status codes are signals.

They are how the server tells the client what happened at the protocol boundary—nothing more, nothing less.

If you misunderstand status codes, you will misdiagnose failures, retry when you shouldn’t, stop when you should retry, and blame the wrong side of the system.

This chapter exists to lock in a correct mental model. Chapter 2.8 showed response structure; this chapter focuses on the status code—the most important signal in the response. Whether your Pi responds to voltage queries, your ESP32 receives confirmations, or your coop controller gets fence status—status codes work the same way.


## 1) Status Codes Are Part of the Contract

When a server responds, it must choose a status code.

That choice is part of the HTTP contract.

The status code tells the client:
	•	Did the request reach the server?
	•	Did the server understand it?
	•	Did the server act on it?
	•	Who is responsible for the outcome?

Everything else in the response is secondary.


## 2) Status Codes Are for Machines First

Status codes are designed for clients, not humans.

Humans may see:

```
404 Not Found
```

But the client (your dashboard, ESP32, coop controller) sees:

```
404
```

The number is what drives behavior. Your dashboard checks `if status_code == 404:` to decide what to do, not the text "Not Found".


## 3) The First Digit Is the Category

HTTP status codes are grouped by their first digit.

This digit defines the class of outcome.
	•	2xx → success
	•	3xx → redirection
	•	4xx → client-side failure
	•	5xx → server-side failure

This classification is deliberate and fundamental.


## 4) Status Codes Answer One Core Question

Every status code answers this question:

Did the request complete successfully, and if not, where did it fail?

Not:
	•	Was the data good?
	•	Was the server happy?
	•	Did the user get what they wanted?

Just: what happened to the request.


## 5) 1xx: Informational (Mostly Ignored)

The 1xx range exists, but most developers never encounter it.

1xx codes mean:
	•	The request was received
	•	Processing is continuing
	•	No final outcome yet

Examples:
	•	100 Continue
	•	101 Switching Protocols

For now:
	•	Know they exist
	•	Know they are transitional
	•	Know they are rare in practice


## 6) 2xx: Success

A 2xx status means:
	•	The request reached the server
	•	The server understood it
	•	The server acted on it successfully

This is protocol-level success.


## 7) Success Does Not Mean “Everything Is Fine”

This is critical.

A 2xx response does not mean:
	•	The resource contained meaningful data (e.g., `200 OK` with `{"voltage": null}`—request succeeded, but sensor returned null)
	•	The user got what they expected (e.g., `200 OK` with HTML error page instead of JSON)
	•	The system state is ideal (e.g., `200 OK` with `{"error": "sensor offline"}`—request processed, but sensor is down)

It only means:

The request was handled successfully.

Example: Your dashboard sends `GET /api/voltage` and gets `200 OK` with body `{"voltage": null}`. The request succeeded—the server processed it correctly. The data just indicates the sensor returned null. Success at the protocol level, not necessarily useful data.


## 8) 200 OK: Generic Success

200 OK means:
	•	The request succeeded
	•	The response contains a representation of the resource

This is the most common status code.

Example use cases:
	•	GET returns data (e.g., `GET /api/voltage` → `200 OK` with `{"voltage": 12.4}`)
	•	POST processed successfully without creating a new resource (e.g., `POST /api/temp` → `200 OK` with confirmation)

Your Pi responds `200 OK` when your dashboard fetches voltage successfully, or when your ESP32 reports temperature and the server processes it.


## 9) 201 Created: Resource Creation

201 Created means:
	•	The request succeeded
	•	A new resource was created as a result

Usually paired with:
	•	POST
	•	A `Location` header pointing to the new resource

Example: Your ESP32 sends `POST /api/sensors` to register a new sensor. Your Pi responds `201 Created` with `Location: /api/sensors/esp32_coop`. This tells the client something new now exists.


## 10) 204 No Content: Success Without a Body

204 No Content means:
	•	The request succeeded
	•	There is no response body

This is not an error.
This is intentional.

Used when:
	•	An update succeeded (e.g., `PUT /api/config` → `204 No Content`)
	•	Nothing needs to be returned (e.g., `DELETE /api/sensors/old_id` → `204 No Content`)

Example: Your dashboard sends `DELETE /api/sensors/old_id`. Your Pi responds `204 No Content`—deletion succeeded, nothing to return.


## 11) 2xx Means “Do Not Retry”

In general:
	•	2xx → do not retry automatically

The request worked.
Retrying may cause duplicate actions.

Example: Your ESP32 sends `POST /api/temp` and gets `200 OK`. Retrying would send the same temperature reading twice—duplicate data. Don't retry success.


## 12) 3xx: Redirection

A 3xx status means:
	•	The request was valid
	•	The server wants the client to take another step

This is not a failure.
It is guidance.


## 13) Redirection Is Explicit Behavior

A redirect is the server saying:

“What you want exists, but not here.”

The server must tell the client where to go next.

That information is carried in headers, not the status code alone.


## 14) 301 Moved Permanently

301 means:
	•	The resource has permanently moved
	•	Clients should update bookmarks
	•	Caches may store this redirect

This is a strong signal.

Example: Your dashboard requests `/api/voltage`, but your Pi has permanently moved it to `/api/sensors/voltage`. Responds `301 Moved Permanently` with `Location: /api/sensors/voltage`. Your dashboard should update its code to use the new path—this is permanent.


## 15) 302 Found (Temporary Redirect)

302 means:
	•	The resource is temporarily elsewhere
	•	The client should not assume permanence

This is common in:
	•	Login flows
	•	Temporary routing

Example: Your dashboard requests `/api/voltage`, but your Pi temporarily routes it to `/api/sensors/voltage` during maintenance. Responds `302 Found` with `Location: /api/sensors/voltage`. The client follows the redirect.


## 16) 304 Not Modified

304 is special.

It means:
	•	The client’s cached version is still valid
	•	No body is sent
	•	The client should reuse its cache

This saves bandwidth and time.

Example: Your dashboard requests `GET /api/voltage` with `If-None-Match: "abc123"`. Your Pi checks—the data hasn't changed. Responds `304 Not Modified` with no body. Your dashboard uses its cached version.


## 17) 3xx Does Not Mean Error

Many people treat redirects as errors.

They are not.

Redirects are successful control-flow signals.


## 18) 4xx: Client Error

A 4xx status means:
	•	The request reached the server
	•	The server understood it
	•	The server refuses or cannot process it due to client-side issues


## 19) 4xx Means “Fix the Request”

This is the core rule:

4xx means the client must change something.

Retrying the same request will usually fail again.

Example: Your ESP32 sends `GET /api/voltage` without auth and gets `401 Unauthorized`. Retrying the same request (still no auth) will fail again. Fix the request—add the `Authorization` header. Or your dashboard sends `GET /api/nonexistent` and gets `404 Not Found`. Retrying won't help—the path doesn't exist. Fix the path.


## 20) 400 Bad Request

400 means:
	•	The request was malformed
	•	Invalid syntax
	•	Missing required fields
	•	Unparseable body

The server could not understand the request as sent.

Example: Your ESP32 sends `POST /api/temp` with malformed JSON: `{"temp": 72.5` (missing closing brace). Your Pi responds `400 Bad Request`—the request syntax is invalid.


## 21) 401 Unauthorized

401 means:
	•	Authentication is required
	•	Credentials are missing or invalid

Important detail:
	•	401 often includes `WWW-Authenticate` header
	•	It does not mean forbidden

Example: Your ESP32 sends `GET /api/voltage` without an `Authorization` header. Your Pi responds `401 Unauthorized`—authentication required. The ESP32 must include a valid token.


## 22) 403 Forbidden

403 means:
	•	The server understood who you are
	•	You are not allowed to do this

Authentication succeeded.
Authorization failed.

Example: Your ESP32 authenticates successfully but tries to `DELETE /api/config` (admin-only). Your Pi responds `403 Forbidden`—you're authenticated, but not authorized for this action.


## 23) 404 Not Found

404 means:
	•	The server cannot find the requested resource
	•	The path does not map to anything

It does not say:
	•	Whether the resource existed before
	•	Whether it might exist later

Example: Your dashboard sends `GET /api/nonexistent`. Your Pi responds `404 Not Found`—that path doesn't exist on this server. Or your ESP32 requests `GET /api/sensors/999` (sensor doesn't exist). `404 Not Found`—the resource isn't there.


## 24) 4xx Errors Are Not Server Failures

The server is functioning correctly.
It is enforcing rules.

Blaming the server for a 4xx is usually incorrect.

Example: Your ESP32 gets `401 Unauthorized` from your Pi. The Pi is working correctly—it's enforcing authentication. The ESP32 needs to fix its request (add auth token). Don't blame the Pi for doing its job.


## 25) 5xx: Server Error

A 5xx status means:
	•	The request was valid
	•	The server failed while handling it

This is the server admitting fault.


## 26) 500 Internal Server Error

500 means:
	•	Something went wrong
	•	The server cannot provide more detail
	•	The failure occurred after request parsing

This is the generic server failure.

Example: Your dashboard sends `GET /api/voltage`, but your Pi's sensor reading code crashes (unhandled exception). Your Pi responds `500 Internal Server Error`—the request was valid, but the server failed while processing it.


## 27) 502 Bad Gateway

502 means:
	•	The server is acting as a gateway or proxy
	•	An upstream service failed

Common in microservice architectures.

Example: Your dashboard requests `/api/voltage` from a reverse proxy. The proxy forwards to your Pi, but the Pi is down. The proxy responds `502 Bad Gateway`—the gateway (proxy) is working, but the upstream service (Pi) failed.


## 28) 503 Service Unavailable

503 means:
	•	The server is temporarily unable to handle the request
	•	Often due to overload or maintenance

Clients may retry later.

Example: Your Pi is rebooting or overloaded. Your ESP32 sends `POST /api/temp`. Your Pi responds `503 Service Unavailable`—temporarily down, try again later. The ESP32 should retry after a delay.


## 29) 5xx Means “Retry May Help”

In general:
	•	5xx → retry might succeed
	•	4xx → retry will likely fail
	•	2xx → retry may cause harm

This matters for automation.

Example: Your ESP32 sends temperature readings every 5 minutes. If it gets `503 Service Unavailable`, it should retry after a delay—the server might recover. But if it gets `401 Unauthorized`, retrying won't help—it needs to fix the auth token first. The status code drives the retry decision.


## 30) Status Codes Encode Responsibility

This is the most important mental model:
	•	2xx → no one failed
	•	3xx → coordination required
	•	4xx → client responsibility
	•	5xx → server responsibility
	•	No response → network/transport failure


## 31) Absence Is Not a Status Code

If:
	•	The connection times out
	•	DNS fails
	•	The network drops

There is no status code.

This is not a 5xx.
It is absence.


## 32) Clients Must Distinguish Absence from Error

A missing response means:
	•	The server may never have seen the request

A 500 means:
	•	The server saw the request and failed

These are completely different failure modes.

Example: Your ESP32 sends `POST /api/temp` but the Wi-Fi drops. No response arrives. This is absence—the Pi never saw the request. Contrast with `500 Internal Server Error`—the Pi saw the request, parsed it, then crashed. Different failure modes require different handling.


## 33) Status Codes Drive Client Behavior

Clients use status codes to decide:
	•	Retry?
	•	Redirect?
	•	Cache?
	•	Abort?
	•	Prompt user?

This is why correctness matters.

Example: Your dashboard checks `if status_code == 200:` to display voltage. If status is `404`, it shows "sensor not found". If status is `500`, it shows "server error" and retries. If status is `503`, it shows "temporarily unavailable" and retries later. The status code drives all these decisions.


## 34) APIs Live or Die on Status Codes

Well-designed APIs:
	•	Use status codes precisely
	•	Do not overload meaning into the body
	•	Let clients behave mechanically

Poor APIs:
	•	Always return 200 (even on errors)
	•	Hide errors in JSON (`{"error": "not found"}` with `200 OK`)
	•	Break automation (clients can't decide behavior mechanically)

Example: Your Pi always returns `200 OK`, even when a sensor doesn't exist, with body `{"error": "sensor not found"}`. Your dashboard can't distinguish success from failure—it must parse the body to know what happened. Bad design.


## 35) Status Codes Are Not Optional

Returning the wrong status code is a protocol violation in spirit, even if not enforced.

Correct status codes are part of being a good HTTP citizen.


## Reflection

Think about real responses—your Pi responding to voltage queries, ESP32 receiving confirmations, coop controller getting fence status.
	•	If a request fails with no response, who do you blame?
	•	If a request returns 403, what must change?
	•	If a request returns 503, should the client retry?
	•	If an API always returns 200, how do clients know what happened?

Consider failure modes:
	•	Your ESP32 sends `POST /api/temp` and gets no response—connection dropped. Who's responsible? The network/transport layer. This is absence, not an HTTP error. Different from `500 Internal Server Error`—that means the Pi saw the request and crashed.
	•	Your dashboard gets `403 Forbidden` when trying to delete a sensor. You're authenticated but not authorized. What must change? Fix the request—use a different endpoint, get admin permissions, or accept that you can't delete sensors. Retrying the same request won't help.
	•	Your Pi returns `503 Service Unavailable`—server is rebooting. Should the client retry? Yes, after a delay. The server might recover. Contrast with `401 Unauthorized`—retrying won't help, fix the auth first.
	•	Your Pi always returns `200 OK`, even when a sensor doesn't exist, with body `{"error": "sensor not found"}`. How do clients know what happened? They can't—they must parse the body. Bad design. Use `404 Not Found` for missing resources.

These distinctions matter when debugging and handling errors.


## Core Understanding

HTTP status codes are signals, not messages.
	•	The first digit defines responsibility
	•	The full code provides detail
	•	2xx = success
	•	3xx = redirect
	•	4xx = client must change
	•	5xx = server failed
	•	No response = transport failure

If you understand this, debugging HTTP becomes mechanical instead of emotional.

This chapter builds on Chapter 2.1 (request-response), 2.2 (HTTP on TCP), 2.3 (what HTTP is), 2.4 (HTTP as text), 2.5 (statelessness and connection lifecycle), 2.6 (request structure), 2.7 (request line), and 2.8 (response structure). Next: Chapter 2.10 — Status Codes: Success and Redirects, where we go deep on 200, 201, 204, 301, 302, and 304, and learn exactly when each should be used and why they exist.