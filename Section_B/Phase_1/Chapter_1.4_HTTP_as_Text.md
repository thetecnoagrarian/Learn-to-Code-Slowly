# Section B Phase 1 · Chapter 1.4: HTTP as Text

The raw form of HTTP: lines of text crossing a boundary. Start line, headers, blank line, body. The exact format that makes everything else mechanical.

## Learning Objectives

By the end of this chapter, you should be able to:
- Describe the four-part structure of an HTTP message: start line, headers, blank line, body.
- Explain why the blank line matters and what it separates.
- Identify the request line and status line and what each carries.
- Recognize that HTTP is line-oriented text with explicit boundaries.

## Key Terms

- **Request line** — First line of a request: method, path, version. Tells the server what you want to do and to what resource.
- **Status line** — First line of a response: version, status code, reason phrase. Tells the client whether the request succeeded.
- **CRLF** — Carriage Return plus Line Feed. The line ending HTTP uses. Defines where lines end and where metadata stops.

Chapter 1.3 defined what HTTP is. This chapter shows the exact format. HTTP is not abstract, magical, or hidden. It is text sent over a connection. If you understand the text format, requests stop feeling mysterious, responses stop feeling opaque, and debugging becomes inspection instead of guessing. Whether you are debugging a Pi sensor API, a coop dashboard, or a solar logger, the wire format is the same.

## 1) HTTP Is Line-Oriented Text

HTTP messages are composed of lines. Each line is a sequence of characters ending with a line terminator and has semantic meaning based on position. HTTP is not a blob or free-form text. It is structured, line-based text. That structure is what allows parsers to work, humans to read, and tools to interoperate.

HTTP lines end with carriage return followed by line feed. That pair defines where a line ends, where headers end, and where metadata stops and content begins. Many systems tolerate just a line feed, but HTTP itself is defined in terms of this pair. It is historical—from early network protocols and cross-platform compatibility—but it is what the protocol specifies.

## 2) The Four-Part Structure

Every HTTP message is a block of text with four conceptual parts: a start line, zero or more header lines, a blank line, and an optional body. No hidden sections, no invisible metadata, no implicit boundaries. Everything is visible in the raw text.

The blank line is the most important boundary. It is exactly one empty line: the delimiter between metadata and content. Before the blank line: control information, instructions, metadata. After the blank line: raw content, payload, the thing being transferred. Confusing this boundary breaks everything.

## 3) Request Messages

A request starts with a request line. The request line always contains three parts separated by spaces: method, path, and HTTP version. This line tells the server what you want to do, to what resource, and using which version of HTTP. Nothing else in the request makes sense without it. Example: a dashboard asking the Pi for voltage would send a request line with GET, the path to the voltage endpoint, and HTTP/1.1.

After the request line come headers. Headers are one per line, key-value pairs with a colon as separator. Headers provide context, modify meaning, supply metadata. They do not carry the primary intent—that is the request line's job. Host, Accept, User-Agent—each adds information. Header names are case-insensitive. Different systems format differently; parsers normalize internally. The protocol defines meaning, not typography. Headers appear in an order, but that order usually does not matter. Meaning comes from header name and value, not position.

Headers end when the message encounters a blank line—two line endings in a row. From that point on, everything is body until the message ends. This explicit boundary is what allows streaming and parsing. The request body is optional. GET requests usually do not have bodies. POST, PUT, PATCH often do. If a body exists, it starts immediately after the blank line, may contain arbitrary bytes, and HTTP itself does not interpret it. HTTP only cares that a body exists, not what it means.

## 4) Response Messages

Responses mirror requests structurally. A response starts with a status line: HTTP version, status code, and reason phrase. The status line tells the client which HTTP version responded, whether the request succeeded, and how to interpret the response. It is the server's primary signal. Example: the Pi replying with voltage would send a status line with HTTP/1.1, 200, and OK, followed by headers like Content-Type and Content-Length, then a blank line, then the body with the voltage value.

The reason phrase (OK, Not Found, and so on) is human-readable and optional in meaning. Clients rely on the numeric status code, not the text phrase. The phrase exists for readability, not logic. Response headers follow the status line. They describe the body, control caching, set cookies, signal content type, and modify client behavior. Like request headers, they are one per line, key-value pairs, case-insensitive.

The response body is optional. 204 No Content has no body. 304 Not Modified has no body. Some error responses include bodies, some do not. The presence of a body is defined by status code, headers, and context. Again, HTTP defines structure, not meaning.

## 5) HTTP Does Not Interpret the Body

HTTP does not understand HTML, JSON, images, or binary data. HTTP only transfers bytes, labels them via headers like Content-Type and Content-Encoding, and delivers them intact. Meaning lives above HTTP. The client decides how to parse the body, how to render it, how to decode it, based on headers. HTTP itself remains neutral. This separation is intentional. If the response body is HTML but Content-Type says application/json, the structure is valid HTTP—the semantics are wrong. Parse with care. If a header is malformed, the parser breaks at the blank line. Knowing the format helps you pinpoint where.

## 6) Seeing HTTP as a Boundary

HTTP messages are boundary crossings. Request: client to server. Response: server to client. The text format is the contract, the validation surface, the explicit interface. Nothing crosses implicitly. Everything is written down. This connects to Section A Phase 1 Chapter 1.8 (Boundaries): validation lives at edges. The raw HTTP format is that edge. A coop dashboard requesting temperature, a solar logger serving production data, a poultry net status API—all use the same format. The path and body content change; the structure does not.

## 7) Why This Mental Model Matters

If you understand HTTP as text, you stop blaming the network blindly. You can read raw logs, debug with curl, reason about failures, and build servers from scratch if needed. Libraries assemble request lines, add headers, and parse responses into objects. That is useful. But when something goes wrong, you debug the raw text, inspect the wire format, reason about boundaries. Understanding the text keeps you grounded. Abstractions become optional, not required.

When you see raw HTTP, ask: what is the start line? Where do headers end? Is there a body? What headers describe that body? What crossed the boundary? This works for requests, responses, logs, proxies, and debug traces.

## Common Pitfalls

Assuming headers are ordered: header order usually does not matter; meaning comes from name and value. Forgetting the blank line: metadata and body are separated by exactly one blank line. Malformed headers (missing colon) break parsing at that boundary. Trusting Content-Type blindly: HTTP delivers bytes; the server can lie about Content-Type. Validate and parse defensively. Confusing structure with meaning: HTTP defines structure. JSON, HTML, and image decoding are the client's job.

## Summary

HTTP is plain text, line-based, explicitly structured, separated by CRLF. Every message has a start line, headers, a blank line, and an optional body. The blank line separates metadata from content. The request line carries method, path, version. The status line carries version, code, reason phrase. HTTP transfers bytes; it does not interpret them. Meaning lives above HTTP.

## Next

This chapter builds on Chapter 1.3 (what HTTP is). Next: **Chapter 1.5 — Statelessness and Connection Lifecycle**, where we add the time dimension: how requests relate over time, what a connection means, and why statelessness changes everything.
