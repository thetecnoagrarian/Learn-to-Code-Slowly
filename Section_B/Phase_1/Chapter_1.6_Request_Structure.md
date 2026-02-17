# Section B Phase 1 · Chapter 1.6: Request Structure

Every HTTP request has literal, byte-level structure. Not conceptual, not framework—text with a precise layout. Servers parse in a fixed order. This chapter breaks that structure down until nothing is mysterious.

## Learning Objectives

By the end of this chapter, you should be able to:
- Describe the four-part structure of an HTTP request: request line, headers, blank line, optional body.
- Explain why the order matters and what happens when it is violated.
- Identify the role of Content-Length and the blank line as boundaries.
- Debug request failures by checking structure: request line, headers, blank line, body length.

## Key Terms

- **Request line** — First line of a request: method, path, HTTP version. Must come first. Answers what action, what resource, what protocol rules.
- **Blank line** — One empty line after headers. Delimiter between metadata and body. Mandatory.
- **Content-Length** — Header that declares body size in bytes. Server reads exactly that many bytes. Wrong value corrupts parsing.

Chapter 1.1 established request-response. Chapter 1.2 showed HTTP on TCP. Chapter 1.3 defined what HTTP is. Chapter 1.4 showed the text format. Chapter 1.5 added statelessness and connection lifecycle. This chapter dissects the request structure itself. Whether you are building a Pi sensor API, a coop controller, or a solar logger, the request structure is the same. Servers do not guess. They do not infer intent. They parse text in a fixed order.

## 1) A Request Is a Message, Not an Action

An HTTP request is not an action. It does not do anything by itself. It is a message that describes what the client wants, where it wants it, and how the server should interpret the message. The server decides what to do with that message.

## 2) The Four Parts and Their Order

Every HTTP request consists of four conceptual parts, always in this order: request line, headers, blank line, optional body. Servers parse sequentially. They expect the request line first, headers next, a blank line, then the body if any. If this order is violated, the request is malformed. HTTP is forgiving in some places but unforgiving about structure. If you understand this order, you can read or construct any HTTP request by hand.

The very first line is the request line. It must be first, must be complete, must end with carriage return and line feed. The server cannot parse anything else until this line is read. The request line answers three questions: what action is requested (method), what resource is targeted (path), what protocol rules apply (HTTP version). Nothing else in the request makes sense without this context. Your dashboard might send a request for voltage to the Pi, or your ESP32 might send a request for fence status to the coop controller. Same structure.

## 3) Headers

After the request line come headers. Headers are metadata. They describe the request, not the resource. They answer questions like who is making the request, what formats are acceptable, how long is the body, is authentication provided, should the connection stay open. Technically a request can have zero headers. Practically, HTTP/1.1 requires at least Host. Most real requests include many headers—auth, content-type, user-agent. Browsers send dozens by default. Your ESP32 sensor might send just Host and Authorization. Servers must be prepared for missing headers, extra headers, and unknown headers.

Each header has a name, a colon, and a value. One header per line. Colon separates name and value. Header names are case-insensitive. Values may contain spaces. Lines end with carriage return and line feed. There is no indentation, no hierarchy. Flat text. Although headers appear in an order, servers must not rely on header order. You cannot assume Authorization comes before Content-Type or Content-Length comes last. Headers are a set, not a sequence. Your Pi server must find Authorization regardless of where it appears.

Most HTTP behavior lives in headers: authentication, content negotiation, caching, compression, connection control. The request line is short. Headers carry the nuance. Headers express constraints: I only accept JSON, I am authenticated as X, do not cache this, keep the connection open. They are rules, not suggestions. Your solar logger might send Accept application/json to request JSON responses. Your coop controller might send Authorization with a bearer token. Your ESP32 might send Content-Type application/json when posting a sensor reading. Each header adds context the server needs.

## 4) The Blank Line

After the last header there is one blank line. This blank line is not decoration. It is a delimiter. It signals: headers are finished, body may follow. The blank line is exactly one empty line—carriage return, line feed—with no header before it. This is the boundary between metadata and content. Without it, the server cannot know where headers stop and the body cannot be parsed correctly. This connects to Section A Phase 1 Chapter 1.8 (Boundaries).

If the blank line is missing, the server keeps reading headers, the body is never recognized, and the request hangs or fails. Example: your ESP32 sends a POST request with Host and then immediately the body JSON, with no blank line. The server reads Host, then sees the JSON and tries to parse it as another header. It fails—no colon, malformed. This is a classic bug when hand-crafting requests. Your dashboard sends a GET request but forgets the blank line. The server hangs, waiting for more headers that never come.

## 5) The Body

Not all requests have a body. Typical patterns: GET usually has no body, POST often has a body, PUT and PATCH often have bodies, DELETE sometimes has a body. The presence of a body depends on the method and headers. Your dashboard might GET voltage (no body) but POST a temperature reading (with body).

The body is raw data. HTTP does not parse it, structure it, or interpret it. HTTP only knows whether a body exists, how long it is, and how to hand it off. The meaning of the body is determined by headers. When a body exists, the server needs to know how many bytes to read. This is usually done with Content-Length. The server reads exactly that many bytes—no more, no less. Example: your ESP32 sends a JSON body that is 28 bytes. The server reads exactly 28 bytes, then stops. Reading too much or too little corrupts the next request. If the server reads 30 bytes, it will try to parse 2 bytes of the next request as part of this body. Sometimes, instead of Content-Length, the request uses Transfer-Encoding chunked. The body is sent in chunks, each chunk declares its own size, the end is explicitly marked. More complex—covered later.

If Content-Length is too small, the body is truncated and data is lost. Example: your ESP32 sends Content-Length 20 but the body is actually 28 bytes. The server reads 20 bytes and stops. The rest is lost, and the next request starts mid-body. If Content-Length is too large, the server waits for bytes that never arrive, the request hangs, and the connection may time out. Example: Content-Length 50 but the body is only 28 bytes. The server reads 28 bytes, then waits for 22 more that never come. Correct boundaries matter.

## 6) A Complete Request

A complete minimal HTTP/1.1 request has a request line (method, path, version), one header (Host), a blank line, and no body. That is valid. A POST request with a body adds Content-Type, Content-Length, optional Authorization, the blank line, then the body bytes. Example: your ESP32 sensor reporting temperature would send a request line with POST and the temp path, headers for Host, Content-Type application/json, Content-Length with the exact byte count, and Authorization if required, then the blank line, then the JSON body. The server reads the request line, parses headers, finds the blank line, then reads exactly the number of bytes declared in Content-Length. Every part has a job. There is no guessing, no scanning ahead.

## 7) The Path and Query Strings

The path in the request line is not necessarily a file, a directory, or a physical location. It is a logical identifier. What it means is entirely server-defined. Your Pi might map the voltage path to a sensor reading, the temp path to a DHT22, the fence status path to the poultry net energizer. A freezer sensor API might use a path for internal temperature and another for external. A drip irrigation controller might use a path for schedule and another for manual override. Everything after a question mark in the path is the query string. It is still part of the request line. The server parses it separately, but HTTP does not care. Your dashboard might query voltage with a sensor parameter to get battery bank 1, or temp with a location parameter to get coop temperature. The poultry net API might accept a path with a segment for which fence zone to check.

## 8) What the Server Knows and Does Not Know

The server does not know that this is a sensor reading, that this is JSON, or that this is from the coop controller. It only knows method, path, headers, and body bytes. Intent is inferred from structure, not assumed. Content-Type tells the server how to interpret the body. Content-Length tells it how many bytes to read. The path and query string tell it what resource is targeted. The server assembles meaning from these parts. If the request line is malformed, required headers are missing, or the body does not match headers (wrong Content-Length, wrong Content-Type), the server can reject the request. HTTP does not promise forgiveness. The request structure is a contract. The client promises to follow the format, declare metadata accurately, and respect boundaries. The server promises to parse according to the spec, respond clearly, and close the connection if violated.

## 9) Debugging and the Mental Model

Frameworks generate request lines, add headers automatically, serialize bodies. They do not change the protocol. When requests fail mysteriously, check the request line (method, path, version correct?), check headers (required headers present, syntax correct?), check Content-Type (matches body format?), check Content-Length (matches actual body size?), check the blank line (present, correct line endings?). Your dashboard gets 400 Bad Request from the Pi. Is Host present? Is the blank line there? Is Content-Length correct if there is a body? Nine times out of ten, it is structural. Your ESP32 sends a POST. The server returns 400. Check Host, Content-Length, blank line, body length. Your coop controller sends Content-Length 30 but the body is only 25 bytes. The server waits for 5 more bytes, then times out. The boundary is wrong.

Think of an HTTP request as an envelope (headers), a letter (body), and a label (request line). The postal service does not read the letter. It reads the envelope. HTTP works the same way. Understanding the structure makes frameworks predictable. When you use a library like requests in Python or fetch in JavaScript, it assembles this structure for you. But when debugging—when the Pi returns 400, when the coop controller hangs, when the solar logger rejects your request—you need to know what was actually sent. Inspect the raw request. Verify the request line. Verify the headers. Verify the blank line. Verify Content-Length matches the body. If you removed your HTTP library and had to write a request by hand, could you? If you can answer that and debug these failures, the structure is yours.

## Common Pitfalls

Missing blank line: the server hangs or misparses. Always include one empty line after the last header. Wrong Content-Length: too small truncates the body; too large causes the server to wait and hang. Match Content-Length exactly to the body size. Assuming header order: servers must find headers by name, not position. Do not assume Authorization comes first. Forgetting Host: HTTP/1.1 requires it. A minimal request still needs Host.

## Summary

An HTTP request has a fixed structure: request line first, headers next, one blank line, optional body. The server parses in that order. Nothing is implied. Everything is explicit. Content-Length declares body size. The blank line separates metadata from content. The path is a logical identifier, not necessarily a file. Frameworks hide this, but the structure still exists.

## Next

This chapter builds on Chapters 1.1 through 1.5. Next: **Chapter 1.7 — The Request Line**, where we zoom in on the very first line: methods, paths, versions, and why that single line controls everything that follows.
