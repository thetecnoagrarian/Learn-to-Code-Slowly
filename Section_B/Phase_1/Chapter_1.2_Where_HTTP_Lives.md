# Section B Phase 1 · Chapter 1.2: Where HTTP Lives

Where HTTP lives—on top of TCP—and what it assumes about the transport layer. The mental map for debugging when "nothing came back."

## Learning Objectives

By the end of this chapter, you should be able to:
- Explain where HTTP sits in the protocol stack (on top of TCP).
- Distinguish HTTP errors (4xx, 5xx) from transport failures (timeout, connection refused).
- Describe what HTTP assumes and what it does not guarantee.
- Debug "no response" failures by separating layers.

## Key Terms

- **TCP** — Transport-layer protocol that provides a reliable, ordered byte stream. HTTP rides on TCP.
- **Transport failure** — Connection refused, timeout, DNS failure, network unreachable. No HTTP response exists.
- **HTTP error** — Server responded with a status code (4xx, 5xx). The exchange completed.

Section A Phase 1 introduced time (Chapter 1.7), failure (Chapter 1.6), and boundaries (Chapter 1.8). Networking combines all three. HTTP does not exist in isolation or float in the air. HTTP lives on top of something else. Understanding where it lives—and what it assumes about what lies beneath—is the difference between calm debugging and weeks of confusion.

Chapter 1.1 established the request-response model. This chapter shows where that model runs: on top of TCP. Whether you are fetching sensor config on a Raspberry Pi, calling a coop API from a dashboard, or hitting a solar inverter API, when "nothing came back," the failure was often below HTTP.

## 1) Protocol Layers Are Contracts

Each protocol layer is a contract, not a full solution. A layer makes assumptions about the layer below, provides guarantees to the layer above, and refuses responsibility outside its contract. HTTP is one such layer. It assumes that something else moves bytes, establishes connections, and handles packet loss. If those assumptions fail, HTTP does not try harder. It simply stops.

## 2) HTTP Does Not Send Packets

HTTP does not send packets, route traffic, retransmit lost data, detect congestion, discover paths, or handle IP addresses. HTTP does not know what a packet is. It operates on messages—requests and responses. When HTTP "sends" something, it is really writing text into a stream and assuming the stream gets delivered. That assumption is crucial.

## 3) HTTP Is an Application-Layer Protocol

HTTP lives at the application layer. It is designed for programs. It describes meaning, not movement: methods, headers, status codes, message structure. It deals in semantics, not transport mechanics. HTTP does not define how bytes reach the other side, how long it takes, or what happens if they do not arrive. Those responsibilities live below HTTP. That separation is what lets you reason about a coop dashboard API, a solar inverter endpoint, or a poultry net status service without thinking about packet loss—until something breaks.

## 4) The Layer Beneath: TCP

Most of the time, HTTP runs on TCP. TCP is a transport-layer protocol. Its job is to provide a reliable connection, ordered delivery, and a continuous byte stream. From HTTP's perspective, TCP looks like a pipe: write bytes in one end, they arrive in order at the other end—or the pipe breaks. HTTP does not see packets or retransmissions. It sees bytes arriving or the pipe breaking.

When your browser requests the coop door status from your Pi, or your phone fetches solar production from the logger, HTTP hands a message to TCP. TCP handles everything between your machine and the server. HTTP only cares that the message arrives in order or the connection fails. Everything else is below its concern.

## 5) What TCP Provides

TCP guarantees that bytes arrive in the same order they were sent. If HTTP sends a request line and headers, that exact sequence arrives in order—or not at all. If bytes are lost in transit, TCP retransmits them; HTTP never sees the loss. If TCP cannot recover, the connection fails and HTTP sees nothing. TCP presents data as a stream, not messages. HTTP must decide where messages start and end, and parse the stream correctly. That is why HTTP is line-based and structured.

TCP does not guarantee that a connection will succeed, remain open, or complete. It does not guarantee that delivery will be fast or that the remote side exists. TCP can hang, stall, reset, timeout, or disappear. HTTP does not override any of this.

A subtle point: HTTP writes do not necessarily map to single packets or single reads. A server might receive half a request, pause, then receive the rest. HTTP implementations must accumulate bytes, detect message boundaries, and handle incomplete data. That is why parsing matters. Chapter 1.4 covers HTTP as text and how the stream is parsed.

## 6) HTTP's Core Assumption

HTTP assumes one thing: if it can write bytes to the stream and the stream stays open, those bytes will arrive in order. Everything else is outside HTTP's responsibility. This assumption is reasonable, but it is not a promise. When the transport fails, HTTP has no fallback. There is no partial HTTP error, half response, or graceful degradation. From HTTP's perspective, the world has two states: a response arrived, or no response arrived. There is no third category. Think of HTTP as a carefully written letter and TCP as the mail service. If the letter arrives and says 404, that is information. If the letter never arrives, that is absence. Do not confuse the two.

## 7) Absence vs Error

This mirrors Section A Phase 1 Chapter 1.10 (Failure Is Normal). When your Python client requests the voltage API from your Pi, an HTTP error means you get a Response object with status 500, headers, and body—the exchange completed. A transport failure means you get a ConnectionError, Timeout, or ConnectionRefused—no Response object, no status code. Your code must handle both.

An HTTP error is a valid HTTP response. It has a status code, headers, maybe a body. It means the server responded. A transport failure has no HTTP status, headers, or body. It means the exchange never completed. This distinction is foundational.

## 8) Common Transport-Level Failures

HTTP cannot describe DNS lookup failure, connection refused, connection timeout, network unreachable, TLS handshake failure, or connection reset mid-transfer. On a homestead: the dashboard requests voltage from the Pi. DNS fails because the hostname is wrong. Connection refused because the Pi is offline or the service is not running. Timeout because WiFi blipped, the Pi is asleep, or the solar inverter is unreachable. Network unreachable because of the wrong subnet or the ESP32 is out of range. Same for coop status, poultry net energizer, solar production, freezer temperature API—no HTTP status, no response at all.

In all of these cases, no HTTP response exists. Your code receives an exception or timeout. The server may never have seen the request. HTTP is silent here. When debugging, ask first: did you get an HTTP status? If yes, the transport succeeded and the failure is in the application layer. If no, the transport failed. That single question narrows the search.

## 9) Why This Feels Mysterious

When a request hangs and nothing comes back—with no error response—the failure almost always occurred below HTTP. Homestead debugging: the dashboard never loads the coop status. Did you get a 500? That is HTTP—the server responded, something broke. Did the request hang? That is transport—Pi offline, WiFi drop, wrong hostname. Different failure, different fix. The solar logger works in curl but hangs in your script—different clients, different timeouts. The drip irrigation controller fetches the schedule; curl succeeds from your laptop but the ESP32 in the garden times out. Same endpoint, different network path, different client. Once you internalize the layers, debugging becomes mechanical.

## 10) Time, Concurrency, and Shared Resources

HTTP does not define timeouts. It does not say how long a server may take, how long a client should wait, or what "too slow" means. Timeouts are client decisions, transport decisions, application decisions. That is why different clients behave differently and the same request can work in one tool and hang in another.

HTTP appears synchronous: request, then response. Underneath, TCP buffers, networks delay, congestion happens, retries occur. HTTP pretends this complexity does not exist. That abstraction is powerful but leaky. The network is shared. Your HTTP request competes with other traffic, shares bandwidth, and experiences congestion. HTTP does not know this. It only sees slower bytes or no bytes.

TCP makes delivery likely, not absolute. Off-grid solar, flaky WiFi, Pi reboots—packets drop, connections reset. A freezer sensor API might be reachable most of the time but unreachable when the barn WiFi is overloaded or the Pi restarts. HTTP assumes success but must handle absence: retry logic, timeouts, graceful degradation. The client must decide how long to wait and whether to retry. This is why retries exist, why idempotency matters later (Chapter 1.14), and why failure handling is not optional.

## 11) Mapping Back to Section A Phase 1

State maps to connection open or closed. Time maps to delays, timeouts, and waiting. Failure maps to absence of response. Boundary maps to bytes crossing process boundaries. Assumptions map to stream reliability. Nothing new was introduced. The model was extended. The same principles from Section A Phase 1—validation at boundaries, failure as normal, time as an implicit input—apply here. HTTP is another boundary layer.

## Common Pitfalls

Confusing transport failure with HTTP error: a 404 or 500 is an HTTP response—the server spoke. A timeout or connection refused is transport—the server never spoke. Treat them differently in your code. Assuming HTTP guarantees delivery: HTTP assumes the transport works. If TCP fails, HTTP has no fallback. Ignoring client differences: the same request can work in curl and hang in Python because of different timeouts. curl uses its own defaults; your script uses the library's defaults. They are not the same.

## Summary

HTTP rides on TCP. It does not move packets. It assumes a reliable byte stream. If the stream fails, HTTP has nothing to say. Transport failure (no response) is distinct from HTTP error (4xx, 5xx). Handle both. When nothing came back, check the layer below HTTP first.

## Next

This chapter builds on Chapter 1.1 (request-response model). Next: **Chapter 1.3 — What HTTP Is**, where we define the protocol itself—message format, semantics, and structure.
