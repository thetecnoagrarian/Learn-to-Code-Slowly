# Section B Phase 1 · Chapter 1.15: Headers — Overview and Purpose

## Learning Objectives

After this chapter, you will be able to:
- Understand what HTTP headers are and how they differ from the body
- Distinguish request headers from response headers and their roles
- Recognize that headers are untrusted input and must be validated
- Use common headers for content type, length, caching, and authentication
- Understand how headers enable statelessness and protocol extension
- Design systems that treat headers as control metadata, not payload

## Key Terms

- **Header**: Key–value metadata attached to an HTTP request or response
- **Request Header**: Header sent by the client to the server
- **Response Header**: Header sent by the server to the client
- **Content-Type**: Header that describes the format of the body
- **Content-Length**: Header that specifies the exact byte length of the body
- **Authorization**: Header that carries credentials
- **Cache-Control**: Header that controls caching behavior
- **Host**: Required header in HTTP/1.1 that identifies the target host

## 1) What Headers Are and Why They Matter

Headers are not decoration. They are not optional fluff. They are how HTTP works beyond send bytes. The request line and status line establish what is happening. Headers establish how it should be interpreted, controlled, cached, authenticated, negotiated, retried, or rejected. If you misunderstand headers, you will misunderstand HTTP.

Chapter 1.6 showed request structure. Chapter 1.8 showed response structure. This chapter focuses on headers, the metadata that controls how HTTP behaves. Whether your ESP32 sends authentication credentials, your dashboard negotiates content formats, or your Pi controls caching, headers are the control surface of HTTP.

Headers are key–value metadata attached to a request or response. They describe the body, such as Content-Type application slash JSON. They control behavior, such as Cache-Control no-cache. They carry credentials, such as Authorization Bearer followed by a token. They enable caching, such as ETag. They signal capabilities, such as Accept application slash JSON. They negotiate formats, such as Accept-Language. They encode constraints, such as If-None-Match. They do not replace the body. They frame the body.

When your ESP32 sends a POST request to the temperature API with a body containing a temperature reading and headers for Content-Type application slash JSON, Content-Length, and Authorization Bearer followed by a token, the headers frame the body. They describe it as JSON, indicate how many bytes, and carry credentials. Headers do not replace the body. They frame it.

Your solar panel logger might send a POST request to the readings API with headers describing the payload as JSON and carrying an API key in Authorization. Your coop door controller might send a GET request to the fence status API with Accept application slash JSON so the Pi knows to return JSON. In every case, headers provide the context that turns raw bytes into a meaningful exchange.

Headers live at the boundary. In HTTP, the request crosses from client to server, and headers are part of that boundary. They are untrusted input. Every header must be treated as data supplied by something outside your control. Headers are not the message itself. The body is the payload. Headers describe how to interpret the payload and modify how the exchange behaves. Confusing headers with body data leads to broken designs.

When your ESP32 sends a POST request to the temperature API with a body containing temperature and sensor ID and a Content-Type header of application slash JSON, the body is the payload, the temperature data. The header describes how to interpret it as JSON. Do not put the temperature data in a header. That is payload, not metadata. Headers are control. Body is content.

HTTP does not know what your data means, what format it is, how it should be cached, or who is allowed to see it. Headers provide that context. Without headers, HTTP would be uselessly vague. When your ESP32 sends a POST request to the temperature API with a body containing a temperature reading, HTTP does not know whether it is JSON, XML, or plain text, how it should be cached, or who is allowed to see it. Headers provide context: Content-Type for format, Cache-Control for caching, Authorization for permissions. Without headers, HTTP is uselessly vague.

## 2) Request Headers vs Response Headers

Headers mean different things depending on direction. Request headers go from client to server, such as Authorization and Accept. Response headers go from server to client, such as Set-Cookie and Location. Some headers are valid in both directions, such as Content-Type and Content-Length. Some are not. Authorization is request-only. Set-Cookie is response-only.

When your ESP32 sends a GET request to the voltage API with Accept application slash JSON, that is a request header expressing client preference. Your Pi responds with Content-Type application slash JSON, a response header describing what the server returned. Or both use Content-Type: the request describes what you are sending, the response describes what you are returning. Direction matters.

Request headers typically communicate who the client is, such as User-Agent ESP32-Sensor slash 1.0, what it can accept, such as Accept application slash JSON, how it wants the server to behave, such as Cache-Control no-cache, what credentials it presents, such as Authorization Bearer followed by a token, and how the request should be handled, such as Connection keep-alive. They express intent, not truth.

When your ESP32 sends a GET request to the voltage API with User-Agent ESP32-Sensor slash 1.0, Accept application slash JSON, and Authorization Bearer followed by a token, these express intent. The ESP32 wants JSON, claims to be ESP32-Sensor, presents a token. But they are not truth. Validate everything. Do not trust blindly.

Common request headers include Host, such as Host pi dot local, User-Agent, Accept, Authorization, Content-Type, Content-Length, and Cookie. Each exists for a specific reason. When your ESP32 sends a GET request to the voltage API with Host pi dot local, User-Agent ESP32-Sensor slash 1.0, and Accept application slash JSON, these headers tell your Pi who is asking, what format is acceptable, and which host to route to.

Response headers typically communicate what the server returned, such as Content-Type, how to interpret it, such as Content-Length, whether it may be cached, such as Cache-Control max-age equals sixty, whether the client should store state, such as Set-Cookie, and what to do next, such as Location. They are instructions, not suggestions.

When your Pi responds to a GET request to the voltage API with Content-Type application slash JSON, Content-Length, Cache-Control max-age equals sixty, and ETag, these are instructions. Your dashboard must obey them. Not suggestions. Instructions.

Common response headers include Content-Type, Content-Length, Cache-Control, Set-Cookie, Location, and ETag. Clients are expected to obey them. When your Pi responds to a GET request to the voltage API with Content-Type application slash JSON, Content-Length, and Cache-Control max-age equals sixty, your dashboard must obey these headers: parse JSON, read exactly the stated number of bytes, cache for sixty seconds.

Your freezer monitor might request temperature history with Accept application slash JSON and receive response headers that describe the body format and caching. Your irrigation controller might send a POST request with Content-Type and Content-Length so the Pi knows how to parse the schedule data. Request and response headers work together to make each exchange unambiguous.

Certain headers apply in both directions. Cache-Control in a request expresses client preferences; in a response it gives server instructions. Content-Type in a request describes what you are sending; in a response what you are returning. Content-Length and Connection work similarly. The meaning depends on direction. When your ESP32 sends a POST request to the temperature API with Content-Type application slash JSON in the request, and your Pi responds with Content-Type application slash JSON in the response, same header name, different direction, different meaning.

## 3) Headers as Extension Point and Format

HTTP is deliberately conservative. Instead of changing the core grammar, new behavior is added via headers, old clients can ignore unknown headers, and new clients can opt into new features. This is how HTTP evolves without breaking everything. Changing the request line would break parsers, proxies, and caches. Adding headers preserves compatibility, enables gradual adoption, and keeps the protocol stable. Headers are evolutionary pressure relief.

When you add idempotency via a header like Idempotency-Key, old clients ignore it and new clients use it. Changing the request line would break everything. Headers let you add features without breaking compatibility.

Header names are case-insensitive. Content-Type, content-type, and CONTENT-TYPE are all equivalent. Header values may be case-sensitive depending on semantics. When your ESP32 sends content-type application slash JSON and your Pi receives it as Content-Type application slash JSON, same header, different casing, equivalent. The value application slash JSON is typically case-sensitive; Application slash Json may be different. Different implementations format differently, humans type them manually, and proxies rewrite them. The protocol does not care about capitalization. Case-insensitivity makes HTTP robust.

Each header is name colon value, one header per line, colon separates name from value, optional whitespace around the value. Simple by design. When your ESP32 sends Host pi dot local, Content-Type application slash JSON, and Content-Length, one header per line, colon separates name from value.

The server reads the request line, then reads headers, then encounters the blank line, then decides how or whether to read the body. Headers control body parsing. When your ESP32 sends a POST request to the temperature API with headers Content-Type application slash JSON, Content-Length fifteen, then blank line, then body, your Pi reads the request line first, then headers, then blank line, then uses Content-Length to know exactly how many bytes to read. Headers control body parsing.

Content-Type answers what does this body mean. Without it, the body is just bytes. Content-Length tells the receiver exactly how many bytes belong to the body. Without it, the receiver cannot safely parse the stream. When your ESP32 sends a POST request to the temperature API with a body and Content-Length fifteen, your Pi reads exactly fifteen bytes then stops. Without Content-Length, your Pi does not know when the body ends. Content-Length makes streaming safe. Because HTTP rides on TCP, the body is a byte stream and headers tell you where it ends. This prevents hanging reads, truncated parsing, and protocol confusion.

Your dashboard might request sensor list with Accept application slash JSON and receive a large JSON array. Content-Length in the response tells the client exactly how many bytes to read before the body is complete. Without it, the client might wait forever or truncate the response. Headers enable streaming safety for both requests and responses. When your barn temperature sensor sends a batch of readings in the body, Content-Length ensures the Pi reads the full batch and does not mix it with the next request on a reused connection.

## 4) Security and Validation

Headers can be forged. Never forget that clients control request headers, browsers can be spoofed, scripts can lie, and proxies can alter data. Headers are claims, not facts. When your ESP32 sends User-Agent ESP32-Sensor slash 1.0, it could be lying. When it sends Authorization Bearer followed by a token, it could be forged or stolen. Headers are claims. Validate everything. Trust nothing.

You must validate presence, such as whether Authorization is present, format, such as whether Authorization Bearer token format is correct, allowed values, such as whether the token is valid and not expired, consistency with other headers, and consistency with the body, such as whether Content-Length matches actual body size. Headers are input. When your ESP32 sends Authorization Bearer followed by a token, your Pi validates presence, format, token validity, and expiration. Headers are input. Never trust headers blindly.

Host tells the server which site the client is trying to reach. Without it, one IP cannot host multiple sites and virtual hosting breaks. HTTP/1.1 requires it. User-Agent describes the client. It helps debugging and analytics and sometimes triggers workarounds. It should never be trusted for security decisions. When your ESP32 sends User-Agent ESP32-Sensor slash 1.0, your Pi may log it for debugging. But never trust it for security. User-Agent is descriptive, not authoritative.

Accept tells the server which formats are acceptable to the client. It enables content negotiation, multiple representations, and graceful degradation. Authorization carries credentials. Examples include Basic with base64 username colon password, Bearer tokens, and custom schemes. This header is extremely sensitive. When your ESP32 sends a GET request to the sensors API with Authorization Bearer followed by a token, your Pi validates the token and allows access. This header is extremely sensitive. Protect it, validate it, never log it in plain form.

The same request line with different headers may authenticate or not, cache or not, return JSON or HTML, or be accepted or rejected. Headers are not secondary. They are decisive. When your dashboard sends a GET request to the voltage API with Accept application slash JSON, it gets JSON. With Accept text slash HTML, it gets HTML. With Authorization it may be authenticated; without it, four hundred one Unauthorized. Same request line, different headers, completely different semantics.

## 5) Headers and Statelessness

HTTP is stateless because state is carried in headers: tokens, cookies, ETags, versions. The server does not remember you. You bring context each time. When your ESP32 sends a GET request to the sensors API with Authorization Bearer, Cookie session, and If-None-Match for an ETag, your Pi does not remember the ESP32. The ESP32 brings context each time via headers. Headers enable statelessness.

Cookies are just headers. Set-Cookie in the response, Cookie in the request. They are not magic. They are structured metadata. When your Pi responds to a POST request to the login API with Set-Cookie session equals value and path, your dashboard stores this. On the next request, your dashboard sends Cookie session equals value. Cookies are just headers. Set-Cookie sets state. Cookie carries state.

Caching behavior is largely header-driven. Cache-Control, ETag, If-None-Match, Expires. Without headers, caching would be unsafe. When your Pi responds to a GET request to the voltage API with Cache-Control max-age equals sixty and ETag, your dashboard caches for sixty seconds. On the next request, your dashboard sends If-None-Match with that ETag. Your Pi may respond three hundred four Not Modified and the client uses cache. Headers control caching.

Your coop controller might send a POST request to register a new device. The Pi responds with two hundred one Created and a Location header pointing to the new resource. The client then knows where to fetch or update that resource. Your soil moisture dashboard might cache sensor summaries using Cache-Control and ETag so it does not refetch unchanged data. Headers control redirection and caching across all these scenarios.

Location tells the client where to go instead. The status code tells why. The header tells where. Connection, Keep-Alive, and related headers tell intermediaries whether the connection should persist, whether it may be reused, and timeouts. This matters for performance and correctness. When your ESP32 sends a GET request to the voltage API with Connection keep-alive, your Pi may keep the connection open for reuse. Headers control connection behavior.

## 6) Who Reads Headers

Headers are interpreted by browsers, proxies, load balancers, gateways, caches, and firewalls. Your server is not the only reader. When your ESP32 sends a GET request to the voltage API with Host pi dot local, a load balancer may read Host and route to the correct server. A proxy may read Cache-Control and decide whether to cache. A firewall may read User-Agent and allow or block. Headers are read by many intermediaries.

If your system breaks when a proxy reorders headers, adds headers, removes headers, or normalizes casing, the design is brittle. When your ESP32 sends a GET request with content-type in lowercase and a proxy normalizes it to Content-Type, your Pi must handle both. If it breaks on casing, the design is brittle. Headers must be designed for intermediaries. They will modify, normalize, and reorder. Design defensively.

Some headers may appear multiple times. Set-Cookie can set session and theme in separate headers. Accept may list multiple types. You must handle repeated headers correctly. When your Pi responds to a POST request to the login API with two Set-Cookie headers, your dashboard must handle both. Header order is not semantically meaningful. Headers may be reordered, merged, or split. Never rely on order.

Never assume a header exists, is non-empty, or is well-formed. Missing headers are normal. When your ESP32 sends a GET request to the voltage API without an Accept header, your Pi must handle it. Or sends Authorization with an empty or invalid value. Design defensively. Some headers are required by spec, such as Host in HTTP/1.1. Most are optional. Design defensively and handle missing or malformed headers gracefully.

When your poultry net controller sends a request without a User-Agent, your Pi might still serve the response but log a warning for debugging. When your dashboard sends a POST request with a body but forgets Content-Length, your Pi might read until connection close or timeout, depending on implementation. Servers that assume Content-Length is always present can hang or misparse when it is missing. Handling optional and missing headers correctly makes your API robust across different clients and network conditions.

## 7) Headers vs Query Parameters and Body

Headers are metadata. They are not part of resource identity. Query parameters are part of the URI and often affect caching and routing. Do not confuse them. When your dashboard sends a GET request to the voltage API with unit equals V in the query string and Accept in a header, the query parameter is part of the URI; the header is metadata. Keep them separate.

Body fields belong to the resource or command. Headers belong to the protocol exchange. Keep that boundary clean. When your ESP32 sends a POST request to the temperature API with a body containing temperature and sensor ID and a Content-Type header, the body fields belong to the resource; the header belongs to the protocol. Do not put resource data in headers. Do not put protocol metadata in the body.

If it describes format, permissions, caching, encoding, or negotiation, it probably belongs in a header. The request line is what. The body is data. Headers are control. They orchestrate safety, performance, security, and compatibility.

Headers are numerous: dozens of standard headers plus custom ones. They interact subtly. Cache-Control interacts with ETag and Expires. Accept affects response format in ways that are not directly visible. They involve intermediaries: proxies and caches modify and forward headers. Headers are hard to learn because their effects are indirect, but they are unavoidable. Every header says I assume the other side understands this. Misaligned assumptions cause failure. When your electric fence monitor sends Accept application slash JSON and your Pi returns HTML because it misread the header, the client cannot parse the response. When your dashboard sends Cache-Control no-cache but the Pi ignores it and the proxy caches anyway, you get stale data. Headers encode assumptions. Get them right.

This chapter is Phase 0.8 applied to HTTP. Headers are boundary input. Validate everything. Absence is normal. Failure must be handled. Meaning lives in structure. When your ESP32 sends Authorization Bearer, treat it as boundary input and validate it. When it sends a request without Accept, absence is normal. When it sends invalid format, handle the failure. Headers are boundary input. Validate everything.

In practice, this means your Pi should check that Authorization is present and well-formed before using it, that Content-Type matches what the server can handle, and that Content-Length if present matches the actual body size. Reject or respond with four hundred Bad Request when headers are invalid rather than guessing. Your webcam viewer might send odd Accept values; your drip irrigation controller might omit headers you expect. Defensive parsing and clear error responses keep the system predictable.

## Common Pitfalls

Trusting headers blindly leads to security and correctness failures. Headers are untrusted input. Validate presence, format, and semantics. Never use User-Agent or other client-supplied headers for authorization.

Confusing headers with payload breaks design. Put application data in the body. Use headers for format, credentials, caching, and protocol control. Putting temperature data or resource IDs in headers mixes concerns and breaks caching and logging.

Assuming headers are present or well-formed causes crashes. Missing or malformed headers are normal. Check for presence and validity before using. Handle empty or invalid values gracefully.

Relying on header order or casing breaks when proxies or gateways reorder or normalize. Parse headers by name. Treat names as case-insensitive. Do not depend on order.

Using headers for resource identity when query or path is appropriate confuses caching and routing. Resource identity belongs in the URI. Metadata belongs in headers.

## Summary

Headers are key–value metadata that control HTTP behavior, describe bodies, enable statelessness, carry credentials, enable caching and negotiation, and extend the protocol safely. They are input and must be validated. They are the control surface of HTTP. Request headers express client intent and capabilities. Response headers give server description and instructions. Headers are untrusted boundary input. Validate everything. Headers enable streaming safety via Content-Length, content interpretation via Content-Type, and caching via Cache-Control and ETag. They are read by servers, browsers, proxies, load balancers, and caches. Design for intermediaries and missing or repeated headers. Headers are control, not content. Understanding them is essential to understanding HTTP.

## Next

This chapter built on Chapter 1.14, which covered safety and idempotency. Next, Chapter 1.16 zooms in on Content-Type, Content-Length, Accept, and encoding and negotiation. This is where bytes on the wire become meaningful data.
