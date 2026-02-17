# Section B Phase 1 · Chapter 1.3: What HTTP Is

What HTTP actually is—a protocol, not a library. Text-based, stateless, request-response. The shared agreement that makes the web work.

## Learning Objectives

By the end of this chapter, you should be able to:
- Distinguish HTTP (the protocol) from tools that speak it (requests, fetch, curl).
- Explain why HTTP is text-based and what that enables.
- Describe HTTP as stateless and where state actually lives.
- Explain HTTP as a generic transfer protocol for resources.

## Key Terms

- **Protocol** — A set of rules and a shared agreement. HTTP defines message format and semantics, not implementation.
- **Stateless** — Each request is independent. The server does not remember previous requests by default.
- **Resource** — What HTTP transfers. Can be a file, a calculation, a state snapshot, a sensor reading—anything addressable.

Chapter 1.1 established the request-response model. Chapter 1.2 showed where HTTP lives—on TCP. This chapter defines what HTTP is: a protocol, not a library. Whether you are building a sensor API on a Pi, a coop dashboard, or a solar logger, HTTP is the same rules, the same format, the same agreement. To use HTTP correctly and debug it calmly, you need to understand what it actually is, not what libraries make it feel like.

## 1) HTTP Is a Protocol, Not a Library

HTTP is not requests in Python, fetch in JavaScript, axios, curl, or a browser feature. Those are tools that speak HTTP. Your Pi running a sensor API speaks HTTP. Your dashboard fetching voltage speaks HTTP. Same protocol.

HTTP itself is a set of rules, a message format, and a shared agreement between client and server. If you removed every HTTP library from existence, HTTP would still exist. HTTP is an idea before it is an implementation.

## 2) HTTP Is an Application-Layer Protocol

HTTP lives at the application layer. It defines meaning, not transport. It assumes a connection exists. HTTP describes what a request means, what a response means, how to interpret headers, and how to interpret status codes. It does not describe how bytes move, how packets are routed, or how loss is handled. That separation is intentional.

## 3) HTTP Is a Text Protocol

At its core, HTTP is plain text. Not binary, not compressed at the protocol level, not encoded in some opaque format. Just characters—letters, numbers, newlines. A minimal request has a request line with method, path, and version, followed by headers, followed by a blank line. That is real HTTP. You can read HTTP messages, write them by hand, and debug with raw tools. This was not an accident.

## 4) Why HTTP Being Text Matters

Text gives HTTP several powerful properties. You can look at a request and understand it. You can look at a response and understand it. That makes debugging possible, learning possible, and tooling simpler. Because HTTP is text, any language can speak it, any OS can speak it, any device can speak it. No special binary decoder required. Text also allows ignoring unknown headers, extending the protocol, and adding features without breaking old clients. This is why HTTP survived decades of change.

## 5) HTTP Messages Are Structured Text

HTTP is not free-form text. It is structured text. That structure includes lines, delimiters, headers, bodies, and explicit boundaries. A request has a request line (method, path, version), headers, a blank line, then an optional body. A response has a status line, headers, a blank line, then a body. This structure allows machines to parse reliably and humans to read meaningfully. Chapter 1.4 examines that structure in detail.

## 6) HTTP Is Request-Response

Every HTTP exchange follows a strict pattern: the client sends a request, the server sends a response. That is it. Your coop dashboard sends a request for temperature to the Pi. The Pi responds with success and a body. One request, one response. There is no spontaneous server message, no unsolicited data, no out-of-band communication. Everything begins with a request. This asymmetry is fundamental.

## 7) Requests and Responses Are Paired

Each request has exactly one response, or no response at all (failure). Responses do not exist independently. They are always replies. This pairing allows deterministic behavior, clear lifecycles, and clean boundaries. If you ever feel confused about what triggered a response, the answer is always: a request.

## 8) HTTP Is Stateless

Stateless means each request is independent. The server does not remember previous requests by default. This does not mean servers cannot have memory, sessions do not exist, or state is impossible. It means HTTP itself does not define memory between requests. State must be sent by the client, included in the request, and reconstructed on each exchange.

## 9) Why Statelessness Is a Feature

Statelessness enables scalability: any server can handle any request. No affinity required. It enables fault tolerance: if a server dies, another can take over. No conversational memory is lost. It enables simplicity: each request can be understood in isolation. No hidden history. This is why HTTP scaled globally.

## 10) Where State Actually Lives

State is carried explicitly via cookies, headers like Authorization, tokens, URL query parameters, and request bodies. The client carries state. The server reconstructs context from each request. This mirrors Section A Phase 1: state must be explicit, absence must be handled, nothing is assumed.

## 11) Connection and Versions

HTTP uses connections but does not define connection management. Connection lifecycle lives below HTTP. From HTTP's perspective, a connection exists, bytes flow, or the connection breaks. In HTTP/1.1, connections can be reused and multiple requests can flow over one connection, but requests remain logically separate. Request then response remains intact.

HTTP has versions: HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3. The mental model does not change. Even in HTTP/2 and HTTP/3, there are still requests, responses, statelessness, headers, and status codes. Later versions optimize how messages move, not what they mean. HTTP/1.1 is text-readable, line-oriented, and transparent. Once you understand HTTP/1.1, HTTP/2 becomes an optimization problem and HTTP/3 becomes a transport problem. The core model stays the same.

## 12) HTTP Is Not Web Pages

HTTP does not care about HTML, JSON, images, or videos. Those are payloads. HTTP's job is to move representations, label them via Content-Type (text/html, application/json, and so on), and describe how to interpret them. HTTP does not know what HTML means. It only knows how to deliver it. Your dashboard fetches voltage. The response might be JSON. HTTP delivers it; Content-Type tells you what you got. The client must validate and parse. If the Pi returns an HTML error page instead of JSON, HTTP delivered it. Content-Type tells you. Validate.

## 13) HTTP as a Generic Transfer Protocol

At its heart, HTTP is a protocol for transferring representations of resources. Not documents, not pages, not APIs—resources. A resource can be a file, a calculation, a state snapshot, a command result, a voltage reading from a sensor API, coop temperature from a dashboard endpoint, poultry net status from a homestead API, or soil moisture from an ESP32. HTTP does not define what a resource is. It defines how to ask for one.

## 14) Meaning vs Transport

HTTP defines meaning, intent, and semantics. Transport defines delivery, reliability, and timing. When something goes wrong, knowing which layer failed is everything. A 500 Internal Server Error means HTTP delivered a response; the meaning layer (your code) failed. A dropped connection or timeout means the transport layer failed; HTTP never got a response at all. HTTP staying simple makes this separation possible. This mirrors Chapter 1.2.

## 15) Mapping Back to Section A Phase 1

Boundaries map to requests and responses. State maps to explicit data in messages. Time maps to requests occurring in sequence. Failure maps to absence vs error responses. Abstraction maps to resources and representations. HTTP is not new concepts. It is Section A Phase 1 applied to distributed systems.

## Common Pitfalls

Treating HTTP libraries as HTTP: requests, fetch, and curl speak HTTP but are not HTTP. The protocol exists independently. Assuming stateless means no state: state exists but must be explicit (cookies, headers, bodies). The client carries it. Confusing HTTP with content: HTTP delivers bytes. It does not parse JSON or render HTML. The client must interpret Content-Type and parse. Ignoring Content-Type: if you expect JSON and get HTML, HTTP delivered both. Check Content-Type and validate.

## Summary

HTTP is a protocol, not a library. It is application-layer, text-based, strictly request-response, and stateless by default. It defines meaning, not movement. It transfers representations of resources. State must be explicit. Content-Type labels payloads; the client must parse.

## Next

This chapter builds on Chapter 1.1 (request-response) and Chapter 1.2 (HTTP on TCP). Next: **Chapter 1.4 — HTTP as Text**, where we see the exact message format, how requests and responses are written, and where boundaries appear in raw text.
