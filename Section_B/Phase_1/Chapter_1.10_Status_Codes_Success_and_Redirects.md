# Phase 2 · Chapter 2.10: Status Codes — Success and Redirects

This chapter builds on [Chapter 2.1: Request-Response](Chapter_2.1_Request-Response.md), [Chapter 2.2: HTTP on TCP](Chapter_2.2_HTTP_on_TCP.md), [Chapter 2.3: What HTTP Is](Chapter_2.3_What_HTTP_Is.md), [Chapter 2.4: HTTP as Text](Chapter_2.4_HTTP_as_Text.md), [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.6: Request Structure](Chapter_2.6_Request_Structure.md), [Chapter 2.7: The Request Line](Chapter_2.7_The_Request_Line.md), [Chapter 2.8: Response Structure](Chapter_2.8_Response_Structure.md), and [Chapter 2.9: Status Codes Overview](Chapter_2.9_Status_Codes_Overview.md).

Success and redirect status codes describe completed requests.

That statement alone eliminates a lot of confusion.

If a response is in the 2xx or 3xx range:
	•	The request reached the server
	•	The server understood the request
	•	The server made a deliberate decision about how to respond

These codes are not about failure.
They are about what kind of success happened and what the client should do next. Chapter 2.9 gave an overview of status codes; this chapter focuses on success (2xx) and redirects (3xx). Whether your Pi responds to voltage queries, your ESP32 receives confirmations, or your coop controller gets fence status—success and redirect codes work the same way.


## 1) Why Success Codes Need Precision

Many systems collapse all success into 200 OK.

That works—until it doesn’t.

Clients rely on status codes to decide:
	•	Whether something new exists
	•	Whether to cache
	•	Whether to retry
	•	Whether to follow another URL
	•	Whether a response body should exist

Using the wrong success code doesn’t break the protocol.
It breaks client behavior.


## 2) Success Means “The Server Did the Thing”

A 2xx response means:
	•	The request was valid
	•	The server acted on it
	•	The action completed

It does not mean:
	•	The client is satisfied
	•	The data is useful
	•	The system is healthy

Just that the request completed as requested.

Example: Your dashboard sends `GET /api/voltage` and gets `200 OK` with `{"voltage": 12.4}`. The request was valid, the Pi acted on it, and the action completed. It doesn't mean the voltage reading is useful (maybe it's stale), or that the system is healthy (maybe the Pi is about to crash). Just that the request succeeded.


## 3) 200 OK — Generic Success

200 OK is the most common success code.

It means:
	•	The request succeeded
	•	The response body contains a representation of the result

This is the default when no more specific success code applies.

Example: Your dashboard sends `GET /api/voltage`. Your Pi responds `200 OK` with `{"voltage": 12.4}`. This is generic success—no creation happened (not `201`), no deletion happened (not `204`), just a successful request with a body.


## 4) When 200 OK Is Correct

Use 200 OK when:
	•	A GET returns data
	•	A POST returns a resource but did not strictly “create” it
	•	A PUT returns the updated resource
	•	An operation succeeds and returns meaningful content

The key property:

There is something in the body the client should read.

Example: Your dashboard sends `GET /api/voltage`. Your Pi responds `200 OK` with body `{"voltage": 12.4}`. The body contains data the client should parse and use. Or your ESP32 sends `POST /api/temp` with a temperature reading. Your Pi processes it and responds `200 OK` with confirmation `{"status": "received"}`—operation succeeded, here's the result.


## 5) When 200 OK Is Lazy

Using 200 OK for everything hides meaning.

If a client:
	•	Created something (e.g., ESP32 registers a new sensor → should be `201 Created`)
	•	Deleted something (e.g., dashboard deletes a sensor → should be `204 No Content`)
	•	Performed an action with no return value (e.g., coop controller updates fence status → should be `204 No Content`)

Then 200 OK may be technically valid—but semantically weak.

Better codes exist. Your ESP32 creates a sensor and gets `200 OK`—technically correct, but `201 Created` tells the client "something new exists" more clearly.


## 6) 201 Created — Creation Has Meaning

201 Created means:
	•	The request succeeded
	•	A new resource now exists as a result

This is most commonly used with POST.

Example: Your ESP32 sends `POST /api/sensors` to register itself. Your Pi creates a new sensor record and responds `201 Created` with `Location: /api/sensors/esp32_coop`. The ESP32 knows a new resource exists and where to find it.


## 7) What Makes 201 Different from 200

The difference is not subtle.

201 Created tells the client:
	•	You now have a new thing
	•	It has an identity
	•	You may want to interact with it next

This is information the client cannot infer from a body alone.

Example: Your ESP32 sends `POST /api/sensors` and gets `201 Created` with `Location: /api/sensors/esp32_coop`. The status code tells the ESP32 "something new exists"—even if the body is empty. With `200 OK`, the ESP32 might think it's just a confirmation, not a new resource.

Example: Your ESP32 sends `POST /api/sensors` and gets `201 Created` with `Location: /api/sensors/esp32_coop`. The status code tells the ESP32 "something new exists"—even if the body is empty. With `200 OK`, the ESP32 might think it's just a confirmation, not a new resource.


## 8) The Location Header with 201

A 201 Created response should usually include:

```
Location: /api/sensors/esp32_coop
```

This tells the client where the new resource lives.

Example: Your ESP32 sends `POST /api/sensors` and gets `201 Created` with `Location: /api/sensors/esp32_coop`. The ESP32 can now interact with its own resource at that path.

This is not optional in spirit—even if some APIs skip it.


## 9) Body or No Body with 201

A 201 Created response:
	•	May include a body
	•	Often includes the newly created resource
	•	But does not have to

The critical signal is the status code, not the body.

Example: Your ESP32 sends `POST /api/sensors` and gets `201 Created`. The body might be empty, or it might include the new sensor data. Either way, the `201` status code is what matters—it signals creation. The ESP32 can use the `Location` header to fetch the resource if needed.


## 10) 204 No Content — Success Without Payload

204 No Content means:
	•	The request succeeded
	•	There is intentionally no response body

This is not an error.
This is not incomplete.

It is explicit success with silence.


## 11) When 204 Is the Right Choice

Use 204 No Content when:
	•	A DELETE succeeded (e.g., `DELETE /api/sensors/old_id` → `204 No Content`)
	•	A PUT or PATCH succeeded but returns nothing (e.g., `PATCH /api/fence` → `204 No Content`)
	•	An action occurred but no representation is needed (e.g., `PUT /api/config` → `204 No Content`)

The client should not expect a body.
Reading one would be a bug.

Example: Your dashboard sends `DELETE /api/sensors/old_id`. Your Pi deletes it and responds `204 No Content` with no body. Your dashboard knows deletion succeeded—no body to parse, move on.


## 12) Why 204 Is Better Than 200 with Empty Body

Returning:
	•	`200 OK` with no body is ambiguous (did the server forget to send a body? Is it empty? Should I wait?)
	•	`204 No Content` is explicit (intentionally no body, operation complete)

The latter tells the client:

There is nothing to parse. Move on.

Example: Your dashboard sends `DELETE /api/sensors/old_id`. If your Pi responds `200 OK` with no body, your dashboard might wait for a body that never comes. If it responds `204 No Content`, your dashboard knows immediately: nothing to read, deletion succeeded. This matters for automation.


## 13) Clients Must Respect 204

Clients should:
	•	Not attempt to parse a body
	•	Not expect Content-Type
	•	Treat the operation as complete

Servers should not send a body with 204.

Example: Your dashboard sends `DELETE /api/sensors/old_id`. Your Pi responds `HTTP/1.1 204 No Content` with no body. If your Pi mistakenly includes a body like `{"deleted": true}`, your dashboard might try to parse it—but `204` means no body. The server violated the protocol.

Example: Your dashboard sends `DELETE /api/sensors/old_id`. Your Pi responds `HTTP/1.1 204 No Content` with no body. If your Pi mistakenly includes a body like `{"deleted": true}`, your dashboard might try to parse it—but `204` means no body. The server violated the protocol.


## 14) Redirects Are Controlled Success

Redirects are not errors.
They are instructions.

A 3xx response means:
	•	The request was valid
	•	The resource is not here
	•	The client must take another step


## 15) Redirects Exist Because the Web Moves

Resources change location.
URLs evolve.
Systems are reorganized.

Redirects let servers say:

“Yes, but not here.”


## 16) 301 Moved Permanently

301 Moved Permanently means:
	•	The resource has a new permanent URL
	•	Clients should update bookmarks
	•	Caches may store the redirect

This is a strong signal.

Example: Your dashboard requests `/api/voltage`, but your Pi has permanently moved it to `/api/sensors/voltage`. Responds `301 Moved Permanently` with `Location: /api/sensors/voltage`. Your dashboard should update its code to use the new path—this is permanent.


## 17) Why 301 Is Dangerous if Misused

Once cached, a 301 can persist for a long time.

If you send a 301 incorrectly:
	•	Clients may never check the old URL again
	•	Undoing it can be painful

Only use 301 when you mean it.

Example: Your Pi sends `301 Moved Permanently` for `/api/voltage` → `/api/sensors/voltage`. Your dashboard caches this redirect. Later, you realize the move was temporary. Too late—your dashboard and other clients may never check `/api/voltage` again. Use `302 Found` for temporary moves.

Example: Your Pi sends `301 Moved Permanently` for `/api/voltage` → `/api/sensors/voltage`. Your dashboard caches this redirect. Later, you realize the move was temporary. Too late—your dashboard and other clients may never check `/api/voltage` again. Use `302 Found` for temporary moves.


## 18) Browser Behavior with 301

Browsers often:
	•	Rewrite future requests automatically
	•	Change POST to GET in some cases

This is historical behavior.
You must be aware of it.

Example: Your dashboard sends `POST /api/temp` and gets `301 Moved Permanently` to `/api/sensors/temp`. Some browsers might change the redirect to `GET /api/sensors/temp`—losing the POST body. Be careful redirecting non-GET requests.

Example: Your dashboard sends `POST /api/temp` and gets `301 Moved Permanently` to `/api/sensors/temp`. Some browsers might change the redirect to `GET /api/sensors/temp`—losing the POST body. Be careful redirecting non-GET requests.


## 19) 302 Found — Temporary Redirect

302 Found means:
	•	The resource is temporarily at a different URL
	•	Clients should not update bookmarks
	•	Future requests may still go to the original URL

This is softer than 301.


## 20) When to Use 302

Use 302 when:
	•	Redirecting after form submission
	•	Handling login flows
	•	Routing traffic temporarily

The server is saying:

“Go there for now.”


## 21) Redirects Require the Location Header

All redirect responses must include:

```
Location: /api/sensors/voltage
```

Without it, the client has no instruction.
A redirect without Location is broken.

Example: Your dashboard requests `/api/voltage` and gets `302 Found` but no `Location` header. Where should it go? The redirect is broken—your dashboard has no instruction. Always include `Location` with redirects.


## 22) Redirects Without Bodies

Redirect responses usually:
	•	Have no meaningful body
	•	Rely entirely on status code + Location

The body may exist, but clients should not rely on it.

Example: Your dashboard gets `302 Found` with `Location: /api/sensors/voltage`. There might be a body with an HTML message, but your dashboard should ignore it and follow the `Location` header. The status code and `Location` header are the signals—the body is optional and unreliable.

Example: Your dashboard gets `302 Found` with `Location: /api/sensors/voltage`. There might be a body with an HTML message, but your dashboard should ignore it and follow the `Location` header. The status code and `Location` header are the signals—the body is optional and unreliable.


## 23) 304 Not Modified — Cache Control, Not Navigation

304 Not Modified is not a redirect in the usual sense.

It means:
	•	The client’s cached version is still valid
	•	The server is explicitly saying “use what you already have”

This saves bandwidth.


## 24) When 304 Happens

304 occurs when:
	•	The client sends a conditional request
	•	Headers like `If-None-Match` or `If-Modified-Since` are present
	•	The resource has not changed

Example: Your dashboard requests `GET /api/voltage` with `If-None-Match: "abc123"`. Your Pi checks—the voltage data hasn't changed since that ETag. Responds `304 Not Modified` with no body. Your dashboard uses its cached version, saving bandwidth.


## 25) 304 Has No Body

A 304 response:
	•	Must not include a body
	•	Relies on the client’s cache

The body would be redundant.

Example: Your dashboard requests `GET /api/voltage` with `If-None-Match: "abc123"`. Your Pi responds `304 Not Modified` with no body. Why send the body? Your dashboard already has it cached. Sending it would waste bandwidth—the whole point of `304` is to avoid sending unchanged data.

Example: Your dashboard requests `GET /api/voltage` with `If-None-Match: "abc123"`. Your Pi responds `304 Not Modified` with no body. Why send the body? Your dashboard already has it cached. Sending it would waste bandwidth—the whole point of `304` is to avoid sending unchanged data.


## 26) Redirects vs Retries

Redirects tell the client:
	•	Do not retry the same request here
	•	Try again somewhere else

This is different from errors.

Example: Your dashboard requests `/api/voltage` and gets `302 Found` with `Location: /api/sensors/voltage`. Don't retry `/api/voltage`—follow the redirect to `/api/sensors/voltage`. Contrast with `500 Internal Server Error`—that means retry the same request later, the server might recover.

Example: Your dashboard requests `/api/voltage` and gets `302 Found` with `Location: /api/sensors/voltage`. Don't retry `/api/voltage`—follow the redirect to `/api/sensors/voltage`. Contrast with `500 Internal Server Error`—that means retry the same request later, the server might recover.


## 27) Success and Redirects Are Cooperative Signals

These status codes assume:
	•	The client is capable
	•	The client will follow instructions
	•	The client understands HTTP semantics

They are cooperative, not defensive.

Example: Your Pi sends `301 Moved Permanently` assuming your dashboard will follow the `Location` header. It's not defensive—it doesn't check if the client understands redirects. It assumes cooperation. If your dashboard doesn't follow redirects, it breaks—but that's the dashboard's fault, not the Pi's.


## 28) APIs Often Misuse Redirects

APIs sometimes:
	•	Use redirects where errors are appropriate (bad—use 404 for missing resources)
	•	Use 200 with embedded redirect info in JSON (bad—use 301/302 with Location header)

This breaks generic clients.

Example: Your Pi responds `200 OK` with body `{"redirect": "/api/sensors/voltage"}` instead of `301 Moved Permanently` with `Location: /api/sensors/voltage`. Your dashboard must parse JSON to know to redirect—generic HTTP clients won't follow it automatically. Redirects belong in HTTP, not payloads.


## 29) Idempotency Matters

Redirect behavior differs by method.
	•	GET is safe to redirect freely (e.g., `GET /api/voltage` → `302` → `GET /api/sensors/voltage`)
	•	POST may be rewritten by clients (some clients change POST to GET on redirect—be careful)
	•	PUT/PATCH/DELETE require care (redirecting mutating requests can be dangerous)

Design redirects deliberately.

Example: Your dashboard sends `GET /api/voltage` and gets `302 Found` with `Location: /api/sensors/voltage`. Safe—GET is idempotent. But if you redirect a `DELETE /api/sensors/1` to `DELETE /api/sensors/2`, that's dangerous—the client might delete the wrong resource.


## 30) Success Codes Encode Intent

The difference between:
	•	200
	•	201
	•	204

Is not about data.
It is about what happened.

Clients deserve that clarity.


## Reflection
You delete a resource. Do you return 200 or 204?
You create a resource. Do you return 200 or 201?
A resource moves forever. Do you return 301 or 302?
A cached resource hasn’t changed. Why return 304 instead of 200?

If your answers are mechanical, you’re learning the protocol—not guessing.


## Core Understanding

Success and redirect codes:
	•	200 OK — success with a body
	•	201 Created — success, new resource exists
	•	204 No Content — success, intentionally no body
	•	301 Moved Permanently — resource moved forever
	•	302 Found — temporary redirect
	•	304 Not Modified — use cached version

These codes are not interchangeable.
They encode meaning for clients.

This chapter builds on Chapter 2.9 (status codes overview). Next: Chapter 2.11 — Status Codes: Client and Server Errors, where we slow down again and look at 400, 401, 403, 404, 500, 502, and 503, and learn how HTTP assigns blame—precisely and unemotionally.