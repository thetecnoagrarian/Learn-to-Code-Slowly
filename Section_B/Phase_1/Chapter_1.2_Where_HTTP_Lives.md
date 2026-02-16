# Phase 2 · Chapter 2.2: Where HTTP Lives

Phase 0.7 introduced time and state changes.
Phase 0.6 introduced failure.
Phase 0.8 introduced boundaries.

Networking combines all three.

HTTP does not exist in isolation.
It does not float in the air.
It does not magically deliver messages.

HTTP lives on top of something else.

Understanding where HTTP lives—and what it assumes about what lives beneath it—is the difference between:
	•	Calm debugging
	•	And weeks of “this makes no sense”

This chapter is not a networking course.
It is a mental map.

Chapter 2.1 established the request-response model. This chapter shows where that model lives—on top of TCP, not in the air. Whether you're fetching sensor config on a Raspberry Pi, calling a coop API from a dashboard, or hitting a solar inverter API—when "nothing came back," the failure was often below HTTP.

Enough context to know:
	•	What HTTP guarantees
	•	What it absolutely does not
	•	And why failures often feel “mysterious” until you separate layers

## 1) Protocol Layers Are Contracts, Not Implementations

Before we talk about HTTP specifically, we need one grounding idea:

Each protocol layer is a contract, not a solution.

A layer:
	•	Makes assumptions about the layer below
	•	Provides guarantees to the layer above
	•	Refuses responsibility outside its contract

HTTP is one such layer.

It assumes:
	•	Something else moves bytes
	•	Something else establishes connections
	•	Something else handles packet loss

If those assumptions fail, HTTP does not “try harder.”

It simply… stops.

## 2) HTTP Does Not Send Packets

This sounds obvious, but it is the root of many misunderstandings.

HTTP does not:
	•	Send packets
	•	Route traffic
	•	Retransmit lost data
	•	Detect congestion
	•	Discover paths
	•	Handle IP addresses

HTTP does not even know what a packet is.

HTTP operates on messages, not packets.
Specifically:
	•	Requests
	•	Responses

If you imagine HTTP “sending” something, what it is really doing is:

Writing text into a stream and assuming the stream gets delivered.

That assumption is crucial.

## 3) HTTP Is an Application-Layer Protocol

HTTP lives at the application layer.

This means:
	•	It is designed for programs
	•	It describes meaning, not movement
	•	It deals in semantics, not transport mechanics

HTTP defines:
	•	Methods
	•	Headers
	•	Status codes
	•	Message structure

HTTP does not define:
	•	How bytes reach the other side
	•	How long it takes
	•	What happens if they don’t

Those responsibilities live below HTTP.

## 4) The Layer Beneath: TCP (Usually)

Most of the time, HTTP runs on TCP.

TCP is a transport-layer protocol.

Its job is to provide:
	•	A reliable connection
	•	Ordered delivery
	•	A continuous byte stream

From HTTP’s perspective, TCP looks like:

“Here is a pipe.
Write bytes in one end.
They arrive in order at the other end—or the pipe breaks.”

That’s it.

HTTP does not see packets.
HTTP does not see retransmissions.
HTTP sees either:
	•	Bytes arriving
	•	Or the pipe breaking

## 5) What TCP Provides (From HTTP’s Point of View)

TCP guarantees a few critical things:

1. Ordered Delivery

Bytes arrive in the same order they were sent.

If HTTP sends:

GET /index.html HTTP/1.1
Host: example.com

HTTP can assume:
	•	That exact sequence arrives in order
	•	Or not at all

2. Reliable Delivery (Within Limits)

If bytes are lost in transit:
	•	TCP retransmits them
	•	HTTP never sees the loss

If TCP cannot recover:
	•	The connection fails
	•	HTTP sees nothing

3. A Continuous Stream

TCP presents data as a stream, not messages.

HTTP has to:
	•	Decide where messages start
	•	Decide where messages end
	•	Parse the stream correctly

This is why HTTP is line-based and structured.

## 6) What TCP Does Not Guarantee

This matters just as much.

TCP does not guarantee:
	•	That a connection will succeed
	•	That a connection will remain open
	•	That delivery will be fast
	•	That delivery will complete
	•	That the remote side exists

TCP can:
	•	Hang
	•	Stall
	•	Reset
	•	Timeout
	•	Disappear

HTTP does not override any of this.

## 7) HTTP’s Core Assumption

HTTP assumes exactly one thing:

“If I can write bytes to the stream, and the stream stays open, those bytes will arrive in order.”

Everything else is outside HTTP’s responsibility.

This assumption is reasonable—but it is not a promise.

## 8) When the Assumption Breaks

When the transport fails, HTTP has no fallback.

There is no:
	•	“Partial HTTP error”
	•	“Half response”
	•	“Graceful degradation”

From HTTP’s perspective, the world looks like one of two states:
	1.	A response arrived
	2.	No response arrived

There is no third category.

## 9) Absence vs Error (Again)

This mirrors Phase 0.10 exactly.

Example: your Python client calls `requests.get("http://pi.local/api/voltage")`. HTTP error: you get a Response object with status 500, headers, body—the exchange completed. Transport failure: you get `ConnectionError`, `Timeout`, or `ConnectionRefused`—no Response object, no status code. Your code must handle both.

An HTTP error:
	•	Is a valid HTTP response
	•	Has a status code
	•	Has headers
	•	Has a body (maybe)
	•	Means the server responded

A transport failure:
	•	Has no HTTP status
	•	Has no headers
	•	Has no body
	•	Means the exchange never completed

This distinction is foundational.

## 10) Common Transport-Level Failures

Here are failures HTTP cannot describe:
	•	DNS lookup failure
	•	Connection refused
	•	Connection timeout
	•	Network unreachable
	•	TLS handshake failure
	•	Connection reset mid-transfer

Homestead: the dashboard requests voltage from the Pi. DNS fails (hostname wrong). Connection refused (Pi offline). Timeout (WiFi blip). Network unreachable (wrong subnet). No HTTP status—no response at all.

In all of these cases:
	•	No HTTP response exists
	•	Your code receives an exception or timeout
	•	The server may never have seen the request

HTTP is silent here.

## 11) Why This Feels “Mysterious”

From the programmer’s perspective:
	•	“I sent a request”
	•	“Nothing came back”
	•	“But there was no error response”
	•	“What happened?”

The answer is almost always:

The failure occurred below HTTP.

Homestead debugging: the dashboard "never loads" the coop status. Check: did you get a 500? (HTTP—server responded, something broke.) Or did the request hang? (Transport—Pi offline, WiFi drop, wrong hostname.) Different failure, different fix.

Until you internalize the layers, this feels random.

Once you do, it becomes mechanical.

## 12) Time Lives Below HTTP

HTTP does not define timeouts.

It does not say:
	•	How long a server may take
	•	How long a client should wait
	•	What “too slow” means

Timeouts are:
	•	Client decisions
	•	Transport decisions
	•	Application decisions

This is why:
	•	Different clients behave differently
	•	The same request can “work” in one tool and “hang” in another

## 13) HTTP Is Synchronous, Transport Is Not

HTTP appears synchronous:
	•	Request
	•	Then response

But underneath:
	•	TCP buffers
	•	Networks delay
	•	Congestion happens
	•	Retries occur

HTTP pretends this complexity does not exist.

That abstraction is powerful—but leaky.

## 14) Partial Writes, Partial Reads

Another subtle point:

HTTP writes do not necessarily map to:
	•	Single packets
	•	Single reads
	•	Single sends

A server might:
	•	Receive half a request
	•	Pause
	•	Then receive the rest

HTTP implementations must:
	•	Accumulate bytes
	•	Detect message boundaries
	•	Handle incomplete data

This is why parsing matters.

## 15) Why HTTP Is Text (Preview)

HTTP’s text-based nature exists because it rides on a stream.
	•	Lines
	•	Delimiters
	•	Headers
	•	Length markers

These are not stylistic choices.
They are stream survival strategies.

We’ll dig into this next chapter.

## 16) The Transport Is Shared

One more important idea:

The network is shared.

Your HTTP request:
	•	Competes with other traffic
	•	Shares bandwidth
	•	Experiences congestion

HTTP does not know this.
It only sees:
	•	Slower bytes
	•	Or no bytes

## 17) Reliability Is Probabilistic

This is uncomfortable but true:

TCP makes delivery likely, not absolute.

Homestead: off-grid solar, flaky WiFi, Pi reboots. Packets drop. Connections reset. HTTP assumes success but must handle absence—retry logic, timeouts, graceful degradation.

At scale:
	•	Packets drop
	•	Connections reset
	•	Routes change
	•	Machines reboot

HTTP assumes success, but must be prepared for absence.

This is why retries exist.
This is why idempotency matters later.
This is why failure handling is not optional.

## 18) Mapping Back to Phase 0 Concepts

Let’s map explicitly:
	•	State → connection open or closed
	•	Time → delays, timeouts, waiting
	•	Failure → absence of response
	•	Boundary → bytes crossing process boundaries
	•	Assumptions → stream reliability

Nothing new was introduced.
The model was extended.

## 19) Mental Model to Keep

Hold this picture in your head:

HTTP is a carefully written letter.
TCP is the mail service.
The road can wash out.

If the letter arrives and says “404,” that’s information.
If the letter never arrives, that’s absence.

Do not confuse the two.

## Reflection

Think about a real system—battery monitor, coop controller, poultry net, solar logger, homestead dashboard. Sit with these questions:
	•	When an HTTP request hangs, which layer failed?
	•	When you see a 500 error, did the transport succeed?
	•	When your code retries a request, what assumptions is it making?
	•	What does “no response” actually mean?

Consider failure modes:
	•	Dashboard requests /api/voltage from Pi—nothing comes back. Transport failure or HTTP error? (No status = transport. 500 = HTTP.)
	•	Same request “works” in curl, hangs in Python. Why? (Different timeouts, different clients.)

If you can answer those cleanly, you are thinking in layers.

## Core Understanding

Say this slowly:

HTTP rides on TCP. It does not move bytes.
HTTP assumes a transport stream.
TCP usually provides that stream.
If the stream fails, HTTP has nothing to say.
No response is absence—not an error response.

That distinction will save you years. Your code receives either a Response (HTTP completed) or an exception (transport failed)—never both, never neither.

This chapter builds on Chapter 2.1 (request-response model). Next: Chapter 2.3 — What HTTP Is, where we define the protocol itself—message format, semantics, and structure.