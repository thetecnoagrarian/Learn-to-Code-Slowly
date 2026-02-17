# Section B Phase 1 · Chapter 1.7: The Request Line

The request line is the first line of every HTTP request. Nothing comes before it. Nothing can be understood without it. If it is malformed, the request fails immediately. This single line defines what the client wants, where it wants it, and which rules apply.

## Learning Objectives

By the end of this chapter, you should be able to:
- Describe the three parts of the request line: method, path, HTTP version.
- Explain why the order matters and what happens when spacing or structure is wrong.
- Distinguish the request line path from the full URL (scheme, host, port).
- Debug request-line errors: unknown method, missing path, invalid spacing, wrong version.

## Key Terms

- **Method** — The first token: GET, POST, PUT, PATCH, DELETE. Tells the server what kind of operation the client is requesting.
- **Path** — The second token: the request target. Absolute path, optional query string. Identifies the resource.
- **HTTP version** — The third token: HTTP/1.0 or HTTP/1.1. Tells the server which protocol rules apply.

Everything else in the request—headers, body, semantics—depends on this line being correct. Chapter 1.6 showed the overall request structure; this chapter zooms into the first line. Whether your dashboard fetches voltage from the Pi, your ESP32 reports temperature, or your coop controller checks fence status, the request line structure is the same.

## 1) The Request Line Is Mandatory

Every HTTP request begins with exactly one request line. If the server does not receive a valid request line, it cannot parse headers, determine intent, or respond meaningfully. The request line is not optional or implied. It must be explicit. The request line always contains three components, in this order: method, path, HTTP version. They are separated by single spaces. No more, no less. In formal terms: method, space, request-target, space, HTTP-version, then carriage return and line feed. This grammar is strict. Servers parse sequentially. They expect the method first, then the path, then the version. If the order is wrong, parsing fails. The server does not guess, reorder, or infer.

## 2) The Method

The first token is the method. GET, POST, PUT, PATCH, DELETE. The method tells the server what kind of operation the client is requesting. Methods are not labels, documentation, or hints. They are semantic instructions. A server may accept a method, reject it, or treat different methods differently. It will not ignore the method. The HTTP specification treats methods as case-sensitive tokens. In practice, methods are always uppercase. Lowercase methods may be rejected. Always use uppercase.

GET retrieves a representation. The client asks: give me the representation of this resource. GET requests should not change server state and often have no body. Your dashboard might send a request for voltage, coop temperature, solar production, or poultry net status—retrieval only. POST sends data to the server, often creates resources, and often includes a body. Your ESP32 sensor might POST temperature data: here is the reading, store it or process it. Your drip irrigation controller might POST a manual override command. PUT replaces the entire target resource. Your dashboard might PUT configuration: this configuration should now look exactly like this. PATCH modifies part of a resource without replacing the whole thing. Your coop controller might PATCH fence settings: change the voltage threshold, leave other settings alone. DELETE asks the server to remove a resource. Your dashboard might DELETE a sensor from the system. Each method has distinct semantics. They are not interchangeable.

Important: the method expresses intent. The server decides behavior. A server may ignore semantics, reject methods, or treat GET as mutating (bad, but possible). HTTP defines meaning. Servers enforce policy.

## 3) The Path

The second component is the path. The path identifies the request target. Your Pi might map the voltage path to a voltage sensor, the temp path to a temperature sensor, the fence status path to the poultry net energizer. A freezer sensor API might use a path for internal temp and another for external. A solar logger might use a path for production and another for inverter status. The path does not include scheme, host, or port. Those live in headers (Host) or the connection. Only the path and optional query string appear in the request line. In HTTP/1.1, the request line usually uses an absolute path. The host is specified separately in the Host header. Your dashboard sends a request with path to voltage; the Host header has pi.local.

Everything after a question mark is the query string. It is still part of the path token. Your dashboard might query voltage with a unit parameter to get volts, or temp with a location parameter to get coop temperature. HTTP does not parse query strings. That is application logic. The server receives the full path including query string and decides how to interpret it. HTTP does not care what the path means—whether it refers to a file, a resource, or an action. It is just text. The same path can mean different things on different servers. The voltage path on your Pi returns a JSON reading. The temp path on your solar logger returns solar panel temp. The same path on a different server might return 404. The path is a name, not a guarantee.

Most servers treat paths as case-sensitive. Slash API slash voltage is not the same as slash api slash voltage. Assume case-sensitive unless documented otherwise. Paths often imply hierarchy—sensors, sensors slash one, sensors slash one slash readings—but this is conventional, not enforced by HTTP. Your Pi might map sensors slash one to sensor ID 1, or treat it as a flat identifier. The server decides. Trailing slashes matter. Slash api slash voltage and slash api slash voltage slash are different paths. Some servers normalize, some do not. Do not assume equivalence.

## 4) The HTTP Version

The third component is the HTTP version. HTTP/1.0 or HTTP/1.1. This tells the server which protocol rules apply. The version is not cosmetic. It affects required headers, connection behavior, parsing rules, and defaults. HTTP/1.1 requires Host. HTTP/1.1 defaults to keep-alive. HTTP/1.0 closes connections by default. A server may behave very differently depending on version. If the server does not support the version, it may reject the request, downgrade behavior, or close the connection. Clients should not lie about versions. Your dashboard sends HTTP/1.0 but the Pi expects HTTP/1.1. The server might reject it or downgrade. Check the version in the request line.

## 5) Whitespace and Termination

Between components: exactly one space. No tabs. No extra spaces. Two spaces between method and path—parsing fails. Two spaces between path and version—parsing fails. Your ESP32 must send exactly one space between each component, or the Pi will reject the request. The request line must end with carriage return and line feed. This marks the end of the line and the beginning of headers. Without it, the server keeps reading and parsing fails.

The smallest valid request line is method, space, slash, space, HTTP slash 1.1. Everything else builds on this. Your dashboard might request the root resource or request the voltage path. Same structure, different path. Once the server reads the request line, it knows whether to expect a body, which headers are required, and how to interpret the rest of the message. This is why it must come first.

## 6) The Request Line as Boundary

Section A Phase 1 boundary principle applies: the request line is the first boundary crossing. Malformed input should be rejected immediately. Validation begins here. Common request-line errors: unknown method (FETCH is not valid—use GET), missing path (no path between method and version), unsupported version (server only supports 1.1), invalid spacing (two spaces between any components). These usually result in 400 Bad Request and immediate connection close. Your ESP32 sends a request with two spaces. The Pi responds 400 Bad Request, closes connection. Your coop controller sends GET with HTTP/2.0 but the Pi only supports HTTP/1.1—the server rejects or downgrades. If a server responds 405 Method Not Allowed, the method caused that. If a request works in one environment but not another, the path or version might differ. If a server says 400 Bad Request, inspect the request line: method, path, version, spacing. Given a raw request, ask: what is the method? What is the path? What version rules apply? Most HTTP bugs become obvious when you inspect the request line.

Proxies sometimes use a different request target form (full URL in the path). That is advanced. Your homestead might use a reverse proxy that forwards requests using this form. Every HTTP library constructs the request line, validates spacing, inserts the version. Understanding this line lets you debug library behavior. Within a single request there is exactly one request line. Headers follow, body follows. If you see multiple request lines, something is wrong. Think of the request line as the command on the envelope, telling the server how to open it and what to do next. Everything else is inside. Most HTTP bugs become obvious when you inspect the request line.

## Common Pitfalls

Extra spaces between method, path, and version: use exactly one space. Two spaces causes 400 Bad Request. Wrong method: FETCH is not valid; use GET. Case: methods should be uppercase. Lowercase get may be rejected. Wrong or unsupported version: HTTP/1.0 vs HTTP/1.1 affects Host requirement and connection behavior. A request that works with 1.1 may fail with 1.0. Trailing slash: slash api slash temp and slash api slash temp slash may differ. Assume they are different unless documented. Path case: slash API slash voltage may not match slash api slash voltage.

## Summary

The request line is the first line of every HTTP request. It has exactly three parts: method (what the client wants to do), path (what the client is targeting), HTTP version (which protocol rules apply). Separated by single spaces. Terminated by carriage return and line feed. Parsed before anything else. If the request line is wrong, nothing else matters.

## Next

This chapter builds on Chapters 1.1 through 1.6. Next: **Chapter 1.8 — Response Structure**, where we switch sides—from client to server—and examine how responses are constructed, parsed, and terminated.
