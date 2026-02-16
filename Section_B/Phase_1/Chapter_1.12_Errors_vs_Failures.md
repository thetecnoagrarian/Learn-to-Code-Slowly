# Phase 2 · Chapter 2.12: Errors vs Failures

This chapter builds on [Chapter 2.1: Request-Response](Chapter_2.1_Request-Response.md), [Chapter 2.2: HTTP on TCP](Chapter_2.2_HTTP_on_TCP.md), [Chapter 2.3: What HTTP Is](Chapter_2.3_What_HTTP_Is.md), [Chapter 2.4: HTTP as Text](Chapter_2.4_HTTP_as_Text.md), [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.6: Request Structure](Chapter_2.6_Request_Structure.md), [Chapter 2.7: The Request Line](Chapter_2.7_The_Request_Line.md), [Chapter 2.8: Response Structure](Chapter_2.8_Response_Structure.md), [Chapter 2.9: Status Codes Overview](Chapter_2.9_Status_Codes_Overview.md), [Chapter 2.10: Status Codes — Success and Redirects](Chapter_2.10_Status_Codes_Success_and_Redirects.md), and [Chapter 2.11: Status Codes — Client and Server Errors](Chapter_2.11_Status_Codes_Client_and_Server_Errors.md).

Phase 0.6 taught that errors occur when assumptions break.
Phase 0.10 taught that failure is normal and must be designed for.

HTTP makes a critical distinction that many developers miss:

An error is not the same thing as a failure.

This chapter draws a hard boundary between:
	•	HTTP errors (where the server responds)
	•	Network failures (where no response arrives)

If you do not understand this distinction, you will write fragile clients, mis-handle retries, and misdiagnose production incidents. Chapter 2.11 covered HTTP error codes (4xx and 5xx); this chapter distinguishes those errors from network failures—when no HTTP response arrives at all. Whether your ESP32 times out waiting for a response, your dashboard gets `500 Internal Server Error`, or your Pi's connection drops mid-transfer—understanding errors vs failures is critical for robust systems.


## 1) Two Kinds of “Something Went Wrong”

When you make an HTTP request and something goes wrong, one of two fundamentally different things happened:
	1.	The server responded with an error
	2.	The request never completed

These are not variations of the same problem.
They live in different layers.
They require different handling.

Example: Your ESP32 sends `POST /api/temp` and gets `400 Bad Request`—that's an HTTP error, the Pi responded. Or your ESP32 sends the same request and times out after 30 seconds—that's a failure, no response. Different problems, different handling.


## 2) HTTP Error Responses Are Still Communication

An HTTP error response means:
	•	The request reached the server
	•	The server parsed the request
	•	The server made a decision
	•	The server replied intentionally

Even if the response is 404 or 500, the protocol exchange completed.

This is a successful communication with an unsuccessful outcome.

Example: Your dashboard requests `GET /api/sensors/nonexistent_id` and gets `404 Not Found`. The request reached the Pi, the Pi parsed it, decided the resource doesn't exist, and replied. Communication succeeded, outcome failed.


## 3) Network Failures Are Absence

A network failure means:
	•	No HTTP response was received
	•	The client does not know what happened
	•	The server may never have seen the request

This is not an HTTP event.
This is silence.

Example: Your ESP32 sends `POST /api/temp` and waits 30 seconds. No response arrives. Did the Pi receive it? Did it crash? Did the Wi‑Fi drop? Unknown—this is absence, not an HTTP error. No status code, no response body, just silence.


## 4) Presence vs Absence

This entire chapter reduces to one idea:
	•	HTTP error = presence of a response
	•	Failure = absence of a response

Presence contains information.
Absence does not.

Example: Your ESP32 gets `500 Internal Server Error`—presence, information: the Pi received the request and crashed. Or your ESP32 times out—absence, no information: did the Pi see it? Did it crash? Unknown.


## 5) HTTP Errors Live at the Application Layer

HTTP errors occur after:
	•	DNS resolution
	•	TCP connection
	•	Request transmission

They live inside the HTTP protocol.

Examples:
	•	400 Bad Request (e.g., ESP32 sends malformed JSON)
	•	401 Unauthorized (e.g., dashboard missing credentials)
	•	404 Not Found (e.g., coop controller requests nonexistent endpoint)
	•	500 Internal Server Error (e.g., Pi crashes while processing request)

The server spoke.


## 6) Failures Live Below HTTP

Failures occur before or during HTTP:
	•	DNS resolution fails (e.g., `pi.local` doesn't resolve)
	•	TCP connection cannot be established (e.g., Pi is offline)
	•	Connection drops mid-transfer (e.g., Wi‑Fi disconnects while ESP32 sends data)
	•	Request times out (e.g., dashboard waits 30 seconds, no response)

HTTP never completed.


## 7) Why This Distinction Exists

HTTP assumes a working transport.

When that assumption breaks:
	•	HTTP has nothing to say
	•	There is no status code
	•	There is no response body

The protocol ends before it begins.

Example: Your dashboard tries to connect to `pi.local` but DNS resolution fails. HTTP can't help—it assumes DNS works. The protocol never starts. Or your ESP32 sends a request but the TCP connection drops before the Pi can respond. HTTP assumes TCP works—when it doesn't, HTTP has nothing to say.


## 8) 500 Is Not a Failure

A 500 Internal Server Error means:

“I received your request, I tried to process it, and I failed.”

This is not ambiguity.
This is explicit communication.

You know the server exists.
You know the server received the request.

Example: Your dashboard requests `GET /api/voltage` and gets `500 Internal Server Error`. You know the Pi exists, you know it received the request, you know it tried to process it and failed. This is explicit communication, not ambiguity.


## 9) Timeout Is Not an Error

A timeout means:

“I waited, and nothing came back.”

You do not know:
	•	Whether the server received the request
	•	Whether it processed it
	•	Whether it crashed
	•	Whether the response was lost

Timeouts are uncertainty.

Example: Your ESP32 sends `POST /api/temp` and times out after 30 seconds. Did the Pi receive it? Did it process it? Did it crash? Did the response get lost? Unknown—timeout is uncertainty, not information.


## 10) Why Treating Timeouts Like Errors Is Dangerous

If you treat a timeout like a 500:
	•	You may retry unsafe requests
	•	You may duplicate operations
	•	You may corrupt state

Timeouts require caution, not confidence.

Example: Your solar logger sends `POST /api/readings` and times out. If you retry blindly, you might send duplicate readings. The Pi might have processed the first request—you don't know. Timeouts require caution, not automatic retries.


## 11) 404 Is Not a Failure

A 404 Not Found means:

“I am here. I understood you. That resource does not exist.”

This is information.

The client can:
	•	Stop retrying
	•	Correct the path
	•	Update stored links

Example: Your dashboard requests `GET /api/sensors/nonexistent_id` and gets `404 Not Found`. The dashboard knows the resource doesn't exist—stop retrying, fix the path, or update stored links. This is information, not failure.


## 12) DNS Failure Is Not a 404

DNS failure means:

“I cannot find the server.”

This is not about a resource.
This is about location.

No HTTP request occurred.

Example: Your ESP32 tries to connect to `pi.local` but DNS resolution fails. No HTTP request happened—DNS failed before HTTP could start. This is not `404 Not Found`—this is DNS failure, a transport problem.


## 13) The Client’s Perspective Matters

From the client’s point of view:
	•	HTTP error → server spoke
	•	Failure → silence

Your client code must branch here first.

Example: Your dashboard sends `GET /api/voltage` and gets `500 Internal Server Error`—the Pi spoke, handle as HTTP error. Or your dashboard sends the same request and times out—silence, handle as failure. Your code must branch on "did I get a response?" before anything else.


## 14) The First Question Your Code Should Ask

When something goes wrong, your code should ask:

“Did I receive an HTTP response?”

Everything else depends on this answer.

Example: Your ESP32 sends `POST /api/temp` and something goes wrong. First question: did I get an HTTP response? If yes, inspect the status code (400, 401, 500, etc.). If no, treat as transport failure (timeout, DNS, connection drop). Everything else—retry logic, error handling, logging—depends on this first answer.


## 15) Partial Responses

Sometimes you receive:
	•	Headers
	•	Part of the body
	•	Then the connection drops

This is not an HTTP error.

This is a transport failure mid-response.

Example: Your dashboard requests `GET /api/voltage` and receives headers plus part of the JSON body, then the connection drops. This is not an HTTP error—the response was incomplete. Transport failed mid-response.


## 16) Partial Data Is Dangerous

Partial responses are dangerous because:
	•	The server may have completed the action
	•	The client may not know the result
	•	Retrying may duplicate side effects

This is the hardest failure mode to reason about.

Example: Your ESP32 sends `POST /api/temp` and receives `200 OK` headers but the connection drops before the body arrives. Did the Pi process the temperature? Unknown. Retrying might send duplicate data. This is ambiguity at its worst.


## 17) HTTP Cannot Represent Partial Failure

HTTP status codes assume:
	•	A complete request
	•	A complete response

Partial failure exists outside the protocol.

Example: Your ESP32 sends `POST /api/temp` and receives `200 OK` headers but the connection drops before the body arrives. HTTP has no status code for "partial success"—the protocol assumes complete responses. This is a transport failure, not an HTTP error. You're on your own.


## 18) Why Idempotency Matters Here

Idempotent requests (GET, PUT, DELETE):
	•	Can often be retried safely

Non-idempotent requests (POST):
	•	May cause duplicate side effects

Failures force you to care about this distinction.

Example: Your dashboard sends `GET /api/voltage` (idempotent) and times out—safe to retry. Or sends `POST /api/temp` (non-idempotent) and times out—dangerous to retry, might duplicate. Failures force you to understand idempotency.


## 19) Error Handling vs Failure Handling

You should handle them differently:

HTTP Error Handling
	•	Inspect status code
	•	Parse response body
	•	Decide based on semantics

Failure Handling
	•	Decide whether to retry
	•	Decide when to give up
	•	Decide how to surface uncertainty

Example: Your dashboard gets `401 Unauthorized`—HTTP error. Inspect status code, parse body for error message, fetch new token, retry. Or your dashboard times out—failure. No status code, no body. Decide: retry? Give up? How long to wait? Different handling for different problems.


## 20) Why Retries Are Dangerous Without This Model

Retrying blindly can cause:
	•	Duplicate orders
	•	Double billing
	•	Corrupted state
	•	Cascading failures

Retries must be intentional.

Example: Your solar logger sends `POST /api/readings` and times out. Blindly retrying might send duplicate readings, corrupting your data. Retries must be intentional—understand what you're retrying and why.


## 21) Failures Create Ambiguity

Errors are explicit.
Failures are ambiguous.

Ambiguity is expensive.

Example: Your ESP32 gets `500 Internal Server Error`—explicit: the Pi received the request and crashed. Or your ESP32 times out—ambiguous: did the Pi see it? Did it process it? Did it crash? Unknown. Ambiguity forces you to make assumptions, and assumptions are expensive—they lead to bugs.


## 22) Logging Errors vs Failures

Good systems log them differently:
	•	HTTP errors: log status, headers, body
	•	Failures: log timing, connection state, DNS, transport info

They tell different stories.

Example: Your Pi logs `500 Internal Server Error` with stack trace—server bug, investigate code. Or logs timeout with connection state—network issue, investigate network. Different logs, different stories, different fixes.


## 23) Monitoring Implications

From an ops perspective:
	•	Rising 4xx → client misuse
	•	Rising 5xx → server bugs
	•	Rising timeouts → network or load issues

If you lump these together, you lose signal.

Example: Rising `401 Unauthorized` means clients need new tokens—fix authentication. Rising timeouts mean network or load issues—fix infrastructure. Lumping them together loses signal—you can't tell what's wrong.


## 24) Client Libraries Often Hide This Distinction

Many HTTP libraries:
	•	Throw exceptions for both errors and failures
	•	Blur semantics
	•	Encourage catch-all handling

This is dangerous.

You must know what you caught.

Example: Your ESP32 catches an exception from an HTTP library. Is it a `400 Bad Request` (HTTP error) or a timeout (failure)? The library might throw the same exception type for both. You must inspect what you caught—don't treat them the same. HTTP errors have status codes; failures don't.


## 25) Exceptions Are Not Semantics

An exception may represent:
	•	A timeout
	•	A DNS failure
	•	A connection reset
	•	A malformed response

You must inspect what kind of exception it is.

Example: Your ESP32 catches an exception. Is it a timeout? DNS failure? Connection reset? Malformed response? Each requires different handling. You must inspect what kind of exception it is—don't treat them all the same.


## 26) “No Response” Is a First-Class Outcome

“No response” is not a bug.
It is a valid system state.

Design for it.

Example: Your solar logger sends `POST /api/readings` and gets no response. This isn't a bug—it's a valid outcome. Networks fail, servers restart, connections drop. Design your system to handle "no response" as a first-class outcome, not an exception to ignore.


## 27) Failure Is Normal

Networks fail.
Packets drop.
Servers restart.
Connections reset.

This is not exceptional behavior.
It is baseline reality.

Example: Your Pi reboots, Wi‑Fi drops, DNS fails, connections reset. This happens all the time. Your ESP32 sending temperature readings will encounter these failures regularly. Design for it—failure is normal, not exceptional.


## 28) HTTP Errors Are Normal Too

APIs return 404s.
Auth expires.
Permissions change.

Errors are not disasters.
They are communication.

Example: Your dashboard requests `/api/sensors/nonexistent_id` and gets `404 Not Found`—normal, the resource doesn't exist. Or your ESP32's auth token expires and gets `401 Unauthorized`—normal, fetch a new token. Errors are communication, not disasters. Handle them gracefully.


## 29) Silence Is the Hardest Case

Silence gives you no certainty.

All resilient systems are designed around silence.

Example: Your ESP32 sends `POST /api/temp` and gets silence—no response, no error, nothing. Did the Pi receive it? Did it process it? Unknown. All resilient systems are designed around this uncertainty. Handle silence explicitly—don't assume success, don't assume failure, handle the ambiguity.


## 30) Client Strategy Summary

When a request fails:
	1.	Did I receive an HTTP response?
	2.	If yes → inspect status code
	3.	If no → treat as transport failure
	4.	Decide retry behavior carefully
	5.	Preserve idempotency guarantees

Example: Your dashboard sends `GET /api/voltage` (idempotent) and times out—retry safely. Or sends `POST /api/temp` (non-idempotent) and times out—retry cautiously, might duplicate. Always preserve idempotency guarantees.


## 31) Why This Chapter Exists

Most bugs in distributed systems come from:
	•	Treating silence like an error
	•	Treating errors like silence
	•	Retrying blindly
	•	Assuming success without confirmation

This chapter prevents that.


## Reflection

Think about real failure scenarios—your ESP32 timing out, your dashboard getting no response, your Pi's connection dropping mid-transfer.
	•	Your client waits 30 seconds and throws. Did the server return 500?
	•	Did DNS fail?
	•	Did the connection drop mid-body?
	•	Did the server process the request anyway?

What do you know?
What do you not know?
What is safe to retry?

Consider failure modes:
	•	Your ESP32 sends `POST /api/temp` and times out after 30 seconds. Did the Pi return `500`? No—you got no response, so no status code. Did DNS fail? Maybe—check DNS resolution. Did the connection drop mid-body? Maybe—check connection state. Did the Pi process the request anyway? Unknown—this is ambiguity. What do you know? Nothing—timeout is absence. What do you not know? Everything—did the Pi see it? Process it? Crash? Unknown. What is safe to retry? Depends on idempotency—if the request is idempotent, retry cautiously; if not, be very careful.
	•	Your dashboard sends `GET /api/voltage` and gets `500 Internal Server Error`. What do you know? The Pi exists, received the request, tried to process it, and failed. What do you not know? Why it failed—bug, crash, exception? What is safe to retry? Maybe—`500` suggests transient failure, but retry cautiously.
	•	Your solar logger sends `POST /api/readings` and receives headers but the connection drops before the body. Did the Pi process it? Unknown. Retrying might duplicate readings. This is the hardest case—partial response, maximum ambiguity.

If you can answer that, you understand distributed systems.


## Core Understanding

The critical distinction:
	•	HTTP error = the server responded (4xx / 5xx)
	•	Failure = no response, timeout, or broken connection
	•	Errors are explicit and informative
	•	Failures are ambiguous and dangerous
	•	Silence is not a response

Handle them differently. Always.

This chapter builds on Chapter 2.11 (client and server errors). Next: Chapter 2.13 — HTTP Methods, where we define GET, POST, PUT, PATCH, and DELETE, and explain why method semantics matter even more once failures enter the picture.