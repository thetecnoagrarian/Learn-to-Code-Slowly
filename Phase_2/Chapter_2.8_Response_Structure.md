# Phase 2 · Chapter 2.8: Response Structure

A response is the server’s half of the HTTP contract.

The client speaks first.
The server responds exactly once.

The response tells the client what happened, what data (if any) is included, and how to interpret that data. If the response is malformed, the client cannot safely proceed. Chapter 2.6 showed request structure; Chapter 2.7 showed the request line. This chapter shows the server's reply—the response structure. Whether your Pi responds to a voltage query, your ESP32 receives a temperature reading confirmation, or your coop controller gets a fence status update—the response structure is the same.

The structure of a response is not flexible.
It is not negotiable.
It mirrors the request structure with precision.


## 1) Responses Always Follow Requests

A response cannot exist on its own.
	•	No request → no response
	•	One request → one response
	•	The server never sends two responses to one request

If a server sends nothing, the client experiences absence, not an error response.


## 2) A Response Has Four Parts

Every HTTP response has up to four parts, in this order:
	1.	Status line
	2.	Headers
	3.	Blank line
	4.	Optional body

This mirrors the request structure exactly, with one substitution:
	•	The status line replaces the request line


## 3) The Status Line Is Mandatory

Every HTTP response begins with a status line.

If the client does not receive a valid status line:
	•	The response is invalid
	•	The client cannot interpret anything else
	•	The connection may be dropped

Nothing comes before the status line.


## 4) The Status Line Has Three Parts

The status line always contains:
	1.	HTTP version
	2.	Status code
	3.	Reason phrase

Separated by single spaces.

Example:

```
HTTP/1.1 200 OK
```

Your Pi responds to `GET /api/voltage` with this status line, indicating success.



## 5) Formal Grammar of the Status Line

In formal terms:

HTTP-VERSION SP STATUS-CODE SP REASON-PHRASE CRLF

This grammar is strict.


## 6) The HTTP Version Comes First

The response begins by declaring the protocol version.

Example:

```
HTTP/1.1
```

Your dashboard requests HTTP/1.1, so your Pi responds with HTTP/1.1 in the status line.

This tells the client:
	•	Which parsing rules apply
	•	Which defaults apply
	•	Which behaviors are allowed


## 7) The Version Must Match the Request (Usually)

In practice:
	•	Servers respond using the same HTTP version requested
	•	Or downgrade gracefully

If the client requests HTTP/1.1, it expects an HTTP/1.1 response.

Version mismatch can cause:
	•	Parsing errors
	•	Misinterpreted headers
	•	Connection handling issues


## 8) The Status Code Comes Second

The status code is a three-digit integer.

This is the most important part of the response.

Clients do not interpret meaning from text.
They interpret meaning from this number.


## 9) Status Codes Are Machine Signals

Status codes are not decoration.
They are control signals.

Clients use them to decide:
	•	Whether the request succeeded
	•	Whether to retry
	•	Whether to redirect
	•	Whether to stop


## 10) Status Code Classes

The first digit defines the class:
	•	1xx — Informational (rare)
	•	2xx — Success
	•	3xx — Redirection
	•	4xx — Client error
	•	5xx — Server error

This classification is foundational.


## 11) 2xx: Success

A 2xx status means:
	•	The server received the request
	•	Understood it
	•	Successfully processed it

Example:

HTTP/1.1 200 OK



## 12) Success Does Not Mean “What You Wanted”

Important distinction:

A 2xx response means the request succeeded.
It does not mean:
	•	The data is what you expected (e.g., `200 OK` with `{"voltage": null}`—request succeeded, but sensor returned null)
	•	The resource exists in the form you wanted (e.g., `200 OK` with HTML error page instead of JSON)
	•	The body contains anything useful (e.g., `200 OK` with empty body)

Example: Your dashboard sends `GET /api/voltage` and gets `200 OK` with body `{"error": "sensor offline"}`. The request succeeded—the server processed it correctly. The data just indicates the sensor is offline. The request succeeded. Nothing more.


## 13) 3xx: Redirection

A 3xx status means:
	•	The request was valid
	•	The resource is elsewhere
	•	The client should take additional action

Example:

```
HTTP/1.1 301 Moved Permanently
```

Your dashboard requests `/api/voltage`, but your Pi has moved it to `/api/sensors/voltage`. The server responds with `301` and a `Location: /api/sensors/voltage` header.



## 14) Redirects Are Instructions

A redirect is not an error.

It is the server telling the client:

“You asked correctly, but look over here instead.”

The Location header carries the new target.


## 15) 4xx: Client Error

A 4xx status means:
	•	The client made a request
	•	The server understood it
	•	The server refuses or cannot fulfill it due to client-side issues

Example:

```
HTTP/1.1 404 Not Found
```

Your ESP32 requests `GET /api/nonexistent`. Your Pi responds `404 Not Found`—the path doesn't exist on this server.



## 16) Client Error Does Not Mean Client Is Broken

A 4xx response does not mean:
	•	The client software is buggy
	•	The user is wrong
	•	The connection failed

It means:
	•	The request is invalid in context

Example: Your ESP32 sends `GET /api/voltage` without authentication. Your Pi responds `401 Unauthorized`. The request is syntactically correct, but missing required auth—client error, not server failure. Or your dashboard sends `GET /api/nonexistent`—`404 Not Found`. The path doesn't exist—client requested something that isn't there.


## 17) 5xx: Server Error

A 5xx status means:
	•	The request was valid
	•	The server failed while processing it

Example:

```
HTTP/1.1 500 Internal Server Error
```

Your dashboard requests `GET /api/voltage`, but your Pi's sensor reading code crashes. The server responds `500 Internal Server Error`—the request was valid, but the server failed while processing it.



## 18) Server Error Means “Not Your Fault”

In principle:
	•	4xx → client responsibility (fix the request)
	•	5xx → server responsibility (server failed)

Clients may retry 5xx responses.
They usually should not retry 4xx responses.

Example: Your dashboard gets `500 Internal Server Error` from the Pi. The request was valid, but the server crashed. Retry might work if the server recovers. But if you get `401 Unauthorized`, retrying won't help—you need to fix the auth token first.


## 19) The Reason Phrase Comes Third

The reason phrase is a short, human-readable description.

Examples:
	•	`OK` (for 200)
	•	`Not Found` (for 404)
	•	`Internal Server Error` (for 500)
	•	`Unauthorized` (for 401)

Your Pi might send `HTTP/1.1 200 OK` or just `HTTP/1.1 200`—the reason phrase is optional.


## 20) The Reason Phrase Is Informational Only

Clients must not rely on the reason phrase.

It:
	•	May vary
	•	May be localized
	•	May be omitted entirely

The status code is authoritative.


## 21) HTTP/1.1 Allows Empty Reason Phrases

This is valid:

```
HTTP/1.1 204
```

No reason phrase—just version, code, CRLF. Your Pi might send `HTTP/1.1 204` (no content) after a successful DELETE. Clients must not break if the phrase is missing.


## 22) Headers Follow the Status Line

After the status line come zero or more headers.

Same structure as request headers:

```
Header-Name: value
```

One per line.
CRLF terminated (`\r\n`).

Example: Your Pi responds with:
```
Content-Type: application/json
Content-Length: 24
Date: Mon, 30 Jan 2026 12:00:00 GMT
```

Same format as request headers—name, colon, space, value, CRLF.


## 23) Response Headers Carry Metadata

Response headers describe:
	•	The body (if any)
	•	Caching rules
	•	Redirect targets
	•	Server behavior

They do not contain the content itself.


## 24) Common Response Headers

Frequently seen response headers include:
	•	`Content-Type` — format of the body (e.g., `application/json` for your Pi's voltage response)
	•	`Content-Length` — size of the body in bytes (e.g., `24` for `{"voltage": 12.4}`)
	•	`Location` — redirect target (e.g., `/api/sensors/voltage` if the endpoint moved)
	•	`Cache-Control` — caching rules (e.g., `no-cache` for real-time sensor data)
	•	`Set-Cookie` — session data (if your dashboard uses sessions)
	•	`Date` — server timestamp (when your Pi sent the response)


## 25) Headers Are Case-Insensitive

These are equivalent:

Content-Type
content-type
CONTENT-TYPE

Convention favors capitalization, but clients must not depend on it.


## 26) Header Order Is Not Significant

The order of headers does not matter.

Clients must:
	•	Read headers as a set
	•	Not depend on ordering


## 27) The Blank Line Is Mandatory

After headers, the server sends a blank line.

This blank line:
	•	Is exactly CRLF
	•	Marks the end of headers
	•	Marks the start of the body (if any)


## 28) The Blank Line Is a Boundary

Phase 0 boundary principle applies:
	•	Everything before the blank line is metadata
	•	Everything after is payload

Clients must respect this boundary.


## 29) The Body Is Optional

A response may include a body.

Some responses never include a body:
	•	`204 No Content` (e.g., successful DELETE—nothing to return)
	•	`304 Not Modified` (cached version is still valid—no body needed)
	•	Responses to HEAD requests (HEAD asks for headers only, never body)

Example: Your dashboard sends `DELETE /api/sensors/old_id`. Your Pi responds `HTTP/1.1 204 No Content` with no body—the deletion succeeded, nothing to return.


## 30) The Body Is Raw Bytes

HTTP does not interpret body content.

The body is:
	•	A stream of bytes
	•	Interpreted by the client using headers

HTTP does not care if it’s:
	•	HTML
	•	JSON
	•	XML
	•	Binary
	•	Garbage


## 31) Content-Type Explains the Body

The Content-Type header tells the client how to interpret the body.

Example:

```
Content-Type: application/json
```

Your Pi responds to `GET /api/voltage` with `Content-Type: application/json` and a body like `{"voltage": 12.4}`. Your dashboard knows to parse it as JSON.

Without it, the body is ambiguous.


## 32) Content-Length Explains the Size

The Content-Length header tells the client how many bytes to read.

Example:

```
Content-Length: 24
```

Your Pi responds with `{"voltage": 12.4}` (24 bytes). The `Content-Length: 24` header tells your dashboard to read exactly 24 bytes, then stop.

Without it, the client may:
	•	Use chunked encoding
	•	Wait for connection close
	•	Misread the body


## 33) The Response Is Complete When the Body Ends

The response ends when:
	•	Content-Length bytes are read (e.g., read 24 bytes, stop)
	•	OR the connection closes (server closed it)
	•	OR the chunked stream ends (last chunk with size 0)

After that, the client may:
	•	Send another request (if connection is open—HTTP/1.1 keep-alive)
	•	Close the connection

Example: Your dashboard reads `Content-Length: 24`, reads exactly 24 bytes (`{"voltage": 12.4}`), then stops. The response is complete. If the connection is still open (keep-alive), your dashboard can send another request on the same connection.


## 34) No Extra Data Is Allowed

If extra bytes appear after the response:
	•	The client may treat them as a new response
	•	Or treat the connection as corrupted

Example: Your Pi sends `Content-Length: 24` but actually sends 30 bytes. Your dashboard reads 24 bytes, stops. The remaining 6 bytes are still in the connection buffer. If your dashboard sends another request, those 6 bytes might be parsed as part of the next request—corruption.

Protocol discipline matters. The server must send exactly what it declares.


## 35) Response Parsing Is Sequential

Clients parse responses in order:
	1.	Read status line
	2.	Parse status code
	3.	Read headers
	4.	Detect blank line
	5.	Read body (if any)

Failure at any step invalidates the response.


## 36) HTTP Responses Are Deterministic

Given the same response bytes:
	•	Every compliant client will parse them the same way
	•	There is no ambiguity if the structure is correct


## 37) Frameworks Hide This—but It Still Exists

Even if you never see raw HTTP:
	•	Your browser parses this
	•	Your HTTP library parses this
	•	Your server constructs this

Understanding it removes mystery.


## 38) Debugging Starts at the Status Line

When something goes wrong, ask:
	•	What status code was returned? (200? 404? 500?)
	•	Was there a response at all? (Did you get a status line, or did the connection drop?)
	•	Did the connection fail? (No response = transport failure, not HTTP error)

Example: Your ESP32 sends a POST and gets no response. Check: Did you get any HTTP response at all? If no—connection failed (transport layer). If yes—check the status code. `500` = server error (retry might work). `400` = bad request (fix the request). These questions determine the entire debugging path.


## 39) Absence Is Not a Response

If:
	•	The connection drops (network hiccup)
	•	The server crashes (Pi rebooted)
	•	The network fails (Wi-Fi disconnected)

There is no response.

This is not a 5xx.
It is absence.

Example: Your dashboard sends `GET /api/voltage` but the Pi's Wi-Fi disconnected. No response arrives. This is not `500 Internal Server Error`—that would be a valid HTTP response. This is absence—no HTTP response at all. Your dashboard experiences a timeout, not an HTTP error.


## 40) The Response Is the Server’s Only Voice

The server cannot:
	•	Send explanations later
	•	Clarify intent afterward
	•	Speak outside a response

Everything it wants the client to know must fit here.


## Reflection

Think about real responses—your Pi responding to voltage queries, ESP32 receiving confirmations, coop controller getting fence status.
	•	If a client receives a response with status 200 but no body, what does that mean?
	•	If a client receives no response at all, how is that different from a 500?
	•	If a server returns 302, what must the client look for next?

Consider failure modes:
	•	Your dashboard sends `GET /api/voltage` and gets `200 OK` with no body. The request succeeded, but there's no data. Check: Is `Content-Length: 0` present? Or is the body missing entirely? Both are valid—the status code says success.
	•	Your ESP32 sends a POST and gets no response—connection dropped, not a 500 error. How do you tell? Check: Did you get any HTTP response at all? If no status line, it's transport failure (connection broke), not an HTTP error response.
	•	Your coop controller gets `302 Found`—check the `Location` header for where to look next. The redirect is an instruction, not an error. Follow the `Location` header.
	•	Your dashboard gets `500 Internal Server Error` with body `{"error": "sensor read failed"}`. The request was valid, but the Pi's sensor code crashed. This is retryable—the server might recover. But `401 Unauthorized` is not retryable—fix the auth token first.

These distinctions matter when debugging and handling errors.


## Core Understanding

An HTTP response consists of:
	•	Status line — protocol version, status code, reason phrase
	•	Headers — metadata about the response
	•	Blank line — boundary marker
	•	Optional body — payload bytes

The status code is the most important signal.
Headers describe interpretation.
The body is raw data.
Absence of response is not an HTTP error.

This chapter builds on Chapter 2.1 (request-response), 2.2 (HTTP on TCP), 2.3 (what HTTP is), 2.4 (HTTP as text), 2.5 (statelessness and connection lifecycle), 2.6 (request structure), and 2.7 (request line). Next: Chapter 2.9 — Status Codes Overview, where we map status code ranges to behavior and decision-making, and learn how clients actually react to them.