# Section B Phase 1 · Chapter 1.16: Headers — Content and Type

## Learning Objectives

After this chapter, you will be able to:
- Understand how Content-Type turns bytes into meaningful data
- Use Content-Length to safely parse HTTP bodies over TCP streams
- Distinguish Content-Type from Content-Encoding and charset
- Use Accept headers for content negotiation
- Validate Content-Type and Content-Length at boundaries
- Recognize common content types and when to use them

## Key Terms

- **Content-Type**: Header that describes the format of the body
- **Content-Length**: Header that specifies the exact byte length of the body
- **Content-Encoding**: Header that describes compression applied to the body
- **Accept**: Request header that expresses what formats the client can understand
- **charset**: Parameter that specifies how bytes map to characters
- **Transfer-Encoding**: Header that specifies how the body is encoded for transfer
- **chunked**: Transfer encoding that sends the body in multiple chunks

## 1) The Body Is an Opaque Byte Stream

The body of an HTTP message is just bytes. Not text. Not JSON. Not HTML. Just bytes. Headers are what turn those bytes into meaning. This chapter is about the headers that answer one core question: what are these bytes, and how should I interpret them? Without these headers, HTTP cannot safely carry data.

Chapter 1.15 introduced headers as HTTP's control surface. This chapter focuses on Content-Type, Content-Length, Accept, and encoding, the headers that turn bytes into meaning. Whether your ESP32 sends temperature readings, your dashboard requests voltage data, or your Pi responds with sensor configurations, these headers make bytes meaningful.

At the transport level, HTTP receives a stream of bytes with no inherent structure and no delimiters beyond what headers describe. The body is not self-describing. When your ESP32 sends a POST request to the temperature API with body bytes representing a JSON object, without headers your Pi does not know what these bytes mean. Are they JSON? Plain text? Binary data? The body is just bytes. Headers provide meaning.

Headers like Content-Type and Content-Length provide structure, interpretation rules, and safety boundaries. They are the decoder ring for the body. When your ESP32 sends a POST request to the temperature API with Content-Type application slash JSON and Content-Length fifteen, your Pi reads these headers first. They provide structure as JSON, interpretation rules to parse as JSON, and safety boundaries to read exactly fifteen bytes. Headers are the decoder ring. They turn bytes into meaning.

## 2) Content-Type: The Meaning Header

Content-Type answers what format is this body in? Examples include application slash JSON, text slash HTML, text slash plain, application slash octet-stream, and application slash x-www-form-urlencoded. Without it, the body is ambiguous. When your ESP32 sends a POST request to the temperature API with a body containing a temperature reading, without Content-Type application slash JSON your Pi does not know if it is JSON, plain text, or something else. Or your dashboard sends a GET request to the voltage API and receives a body with a number. Is it JSON? Plain text? HTML? Content-Type removes ambiguity.

Content-Type is a contract. When a sender sets Content-Type, they are saying I promise the body follows this format. When a receiver reads it, they are allowed to assume that promise is true, or reject it if it is not. This is a boundary invariant. When your ESP32 sends a POST request to the temperature API with Content-Type application slash JSON and a body containing a JSON object, your Pi trusts this promise. It parses as JSON. If the body is actually form-encoded data, your Pi rejects it. The promise is broken. Or your dashboard sends a PUT request to the config API with Content-Type application slash JSON. It promises JSON and must deliver JSON. Content-Type is a contract at the boundary.

While HTTP technically allows bodies without Content-Type, in real systems APIs expect it, servers validate it, and frameworks depend on it. Missing or wrong Content-Type is a client error. When your ESP32 sends a POST request to the temperature API with a body but no Content-Type header, your Pi responds with four hundred Bad Request. Missing Content-Type. Or sends Content-Type text slash plain with a JSON body. Wrong Content-Type, four hundred Bad Request. APIs expect Content-Type. Missing or wrong is a client error.

At minimum, you must know these common content types: application slash JSON, text slash HTML, application slash x-www-form-urlencoded, multipart slash form-data, and text slash plain. These cover most of the web.

## 3) Common Content Types

Application slash JSON is used for APIs. Characteristics include UTF-8 encoded text, structured data, machine-readable format, and strict syntax. If the body is JSON, Content-Type must say so. When your ESP32 sends a POST request to the temperature API with a body containing a JSON object and Content-Type application slash JSON, your Pi parses it as JSON. Or your dashboard sends a PUT request to the config API with a body containing a JSON object and Content-Type application slash JSON. If the body is JSON, Content-Type must say so. Otherwise your Pi does not know how to parse it.

Text slash HTML is used for web pages. Characteristics include human-readable format, rendered by browsers, and often includes markup, scripts, and styles. The browser's behavior depends on this header.

Application slash x-www-form-urlencoded is classic HTML form submission. Characteristics include key equals value pairs, URL-encoded format, simple structure, and legacy but still common. Servers parse this differently than JSON. When your dashboard submits a form with Content-Type application slash x-www-form-urlencoded and a body with key equals value pairs, your Pi parses it as key equals value pairs, not JSON. Or your ESP32 sends form data with this Content-Type. The Pi parses differently than JSON. It is URL-encoded key equals value pairs, not structured JSON.

Multipart slash form-data is used for file uploads and complex forms. Characteristics include multiple parts, boundaries between parts, binary-safe format, and more complex parsing. Content-Type includes a boundary parameter. When your dashboard uploads a config file with Content-Type multipart slash form-data and a boundary parameter, the body has multiple parts separated by the boundary. Or your ESP32 uploads sensor data with multipart slash form-data. Multiple parts, binary-safe. Content-Type includes a boundary parameter that tells the parser how to split parts. More complex parsing than JSON or form-encoded.

Content-Type can include parameters. For example, Content-Type text slash HTML semicolon charset equals utf-8. The main type is text slash HTML. The parameter modifies interpretation. When your dashboard requests a GET to the voltage API and receives Content-Type text slash HTML semicolon charset equals utf-8, the main type is text slash HTML, a web page. The parameter charset equals utf-8 modifies interpretation, specifying how bytes map to characters. Or your ESP32 sends a POST request to the temperature API with Content-Type application slash JSON semicolon charset equals utf-8. Main type JSON, charset parameter for text encoding. Parameters modify interpretation.

Charset answers how do bytes map to characters? Common values include utf-8 and iso-8859-1, which is legacy. Modern systems should always use UTF-8. When your ESP32 sends a POST request to the temperature API with Content-Type application slash JSON semicolon charset equals utf-8, UTF-8 handles all characters: temperature readings, sensor IDs, error messages. Or your dashboard receives Content-Type text slash HTML semicolon charset equals utf-8 from your Pi. Modern systems should always use UTF-8. It is universal, safe, and standard.

Without charset, characters may render incorrectly, parsing may fail, and security bugs can appear. Text without encoding is unsafe. When your ESP32 sends a POST request to the temperature API with a body containing special characters like a sensor name with accents but no charset parameter, your Pi may interpret bytes incorrectly. Characters render wrong, parsing fails, security bugs appear. Or your dashboard receives HTML without charset. May render incorrectly. Text without encoding is unsafe. Always specify charset.

## 4) Content-Encoding vs Content-Type

These are different. Content-Type describes what the data is. Content-Encoding describes how it is compressed. For example, Content-Type application slash JSON and Content-Encoding gzip. Decode first, then parse. When your ESP32 sends a POST request to the temperature API with Content-Type application slash JSON and Content-Encoding gzip, your Pi first decodes gzip, decompresses, then parses JSON. Or your dashboard receives Content-Type text slash HTML and Content-Encoding br, Brotli. Decode Brotli first, then parse HTML. Content-Encoding is about compression, transport efficiency. Content-Type is about format, what the data is. Decode first, then parse.

Content-Encoding is about transport efficiency. Common encodings include gzip, br for Brotli, and deflate. They reduce size, not meaning. When your Pi responds to a GET request to the voltage API with Content-Type application slash JSON and Content-Encoding gzip, the body is compressed, smaller, but still JSON after decompression. Or your ESP32 sends a POST request to the temperature API with Content-Encoding gzip. Compresses body for transport efficiency. Content-Encoding reduces size, transport efficiency, not meaning. Still JSON after decode. They reduce size, not meaning.

## 5) Content-Length: Body Size Boundary

Content-Length tells the receiver exactly how many bytes belong to this body. This is essential for stream parsing. When your ESP32 sends a POST request to the temperature API with Content-Length fifteen and a body, your Pi reads exactly fifteen bytes then stops. It knows where the body ends. Or your dashboard receives a GET response to the voltage API with Content-Length twenty-four. Reads exactly twenty-four bytes. Content-Length is essential for stream parsing. Without it, your Pi does not know where the body ends.

HTTP runs over TCP, which is a continuous stream. Without Content-Length, the receiver does not know where the body ends and the next message cannot be safely read. Content-Length enables keep-alive. When multiple requests share a connection, the server must know where one body ends and where the next request begins. Content-Length makes this possible. When your ESP32 sends a GET request to the voltage API with Connection keep-alive, your Pi responds, then your ESP32 sends another request on the same connection. Content-Length tells your Pi where one body ends and the next request begins. Or your dashboard sends multiple requests on one connection. Content-Length enables keep-alive by providing explicit boundaries. Without Content-Length, keep-alive breaks. Cannot tell where one message ends.

Incorrect Content-Length is dangerous. If Content-Length is too small, the body is truncated. If it is too large, the receiver hangs waiting for bytes. Both are failure modes. When your ESP32 sends a POST request to the temperature API with Content-Length ten but the body is actually fifteen bytes, your Pi reads ten bytes, gets a truncated body, parsing fails. Or sends Content-Length twenty but the body is only fifteen bytes. Your Pi waits for five more bytes, hangs. Incorrect Content-Length is dangerous. Too small truncates, too large hangs. Both are failure modes.

Content-Length is a promise. Like Content-Type, it is a contract. Lying breaks the protocol. When your ESP32 sends a POST request to the temperature API with Content-Length fifteen and a body, your Pi trusts this promise. Reads exactly fifteen bytes. If Content-Length says fifteen but the body is actually twenty bytes, your Pi reads fifteen, misses five bytes. Promise broken. Or says fifteen but the body is only ten bytes. Pi waits for five more, hangs. Content-Length is a promise. Like Content-Type, it is a contract. Lying breaks the protocol.

Sometimes Content-Length is unknown. In that case, Transfer-Encoding chunked. The body is sent in chunks with explicit boundaries. When your Pi streams sensor data with Transfer-Encoding chunked, it does not know total size upfront, sends chunks with sizes. Or your dashboard receives a chunked response. Body sent in chunks, each with explicit size. Transfer-Encoding chunked is an alternative when Content-Length is unknown. Body sent in chunks with explicit boundaries.

Chunked encoding sends size before each chunk and ends with a zero-length chunk. This is still boundary management. When your Pi streams data with chunked encoding, it sends a size, then chunk bytes, then another size, then more chunk bytes, then zero-length chunk to signal end. Your dashboard reads chunk sizes, reads chunks, sees zero-length chunk, knows body is complete. Chunked encoding still needs framing. Size before each chunk, zero-length chunk at end. This is still boundary management.

HTTP/1.1 clients must handle both Content-Length and Transfer-Encoding chunked. Ignoring either breaks compatibility. When your ESP32 must handle both Content-Length fifteen for fixed size and Transfer-Encoding chunked for streaming, or your dashboard must support both, some responses have Content-Length, some have chunked encoding. HTTP/1.1 clients must handle both. Ignoring either breaks compatibility. Some servers use Content-Length, some use chunked. Client must support both.

## 6) Accept: Client Preferences

Accept is a request header. It answers what formats can I understand? When your ESP32 sends a GET request to the voltage API with Accept application slash JSON, it tells your Pi I can understand JSON. Or your dashboard sends a GET request to the config API with Accept application slash JSON. Prefers JSON format. Accept is a request header. Client tells server what formats it can understand.

Accept is about capability, not demand. Accept does not mean you must send this. It means if possible, send one of these. The server chooses. When your ESP32 sends a GET request to the voltage API with Accept application slash JSON, your Pi may respond with JSON, or may respond with four hundred six Not Acceptable if it cannot produce JSON. Accept is capability, not demand. Client says I can handle JSON. Server chooses whether to send it. Or your dashboard sends Accept application slash JSON comma text slash HTML. Can handle either, server chooses.

Accept can list multiple types. When your dashboard sends a GET request to the voltage API with Accept application slash JSON comma text slash HTML, your Pi can respond with JSON or HTML. Client can handle either. Or your ESP32 sends Accept application slash JSON comma text slash plain. Can handle JSON or plain text. Accept can list multiple types. Client expresses flexibility, server chooses.

Accept can include priorities using quality values. For example, Accept application slash JSON semicolon q equals 1.0 comma text slash HTML semicolon q equals 0.5. Higher q equals preferred. When your dashboard sends a GET request to the voltage API with Accept application slash JSON semicolon q equals 1.0 comma text slash HTML semicolon q equals 0.5, JSON has q equals 1.0, preferred. HTML has q equals 0.5, acceptable. Your Pi sees JSON preferred, selects JSON. Or your ESP32 sends Accept application slash JSON semicolon q equals 1.0 comma text slash plain semicolon q equals 0.8. JSON preferred, plain text acceptable. Quality values express priorities. Higher q equals preferred.

Content negotiation is the process where the client sends Accept, the server selects a representation, and the server responds with Content-Type. This is negotiation. When your dashboard sends a GET request to the voltage API with Accept application slash JSON comma text slash HTML semicolon q equals 0.5, your Pi sees JSON preferred, HTML acceptable, selects JSON representation, responds with Content-Type application slash JSON. This is negotiation. Client expresses preferences, server selects representation, responds with chosen Content-Type. Or your ESP32 sends Accept application slash JSON. Pi negotiates, responds with JSON.

Negotiation is optional but powerful. Many APIs ignore Accept and always return JSON. Browsers rely heavily on it. Negotiation is a design choice. When your ESP32 sends a GET request to the voltage API with Accept application slash JSON, your Pi may ignore Accept, always return JSON. Simple, predictable. Or your dashboard sends Accept application slash JSON comma text slash HTML. Pi may negotiate, return HTML if preferred. Many APIs ignore Accept, always JSON. Browsers rely heavily on it, negotiate format. Negotiation is a design choice. Strict APIs ignore it, flexible APIs use it.

The response Content-Type tells the client this is what you got. If it does not match expectations, that is a failure. Accept does not equal Content-Type. Common confusion: Accept equals what the client wants. Content-Type equals what the sender sent. Never swap them. When your ESP32 sends a GET request to the voltage API with Accept application slash JSON, what I want, your Pi responds with Content-Type application slash JSON, what I sent. Accept is request header, client preferences. Content-Type is response header, server description. Never swap them. Accept goes in request, Content-Type goes in response. Common confusion. They are different.

## 7) Validation and Security

Servers should check if they can satisfy Accept and respond with four hundred six Not Acceptable if not. Ignoring Accept silently is a design decision. When your ESP32 sends a GET request to the voltage API with Accept application slash XML, your Pi checks. Can I produce XML? No, only JSON. Strict API responds four hundred six Not Acceptable. Or ignores Accept, always returns JSON. Design decision. Servers should validate Accept. Check if they can satisfy it, respond four hundred six Not Acceptable if not. Ignoring Accept silently is a design decision. Many APIs do this.

Four hundred six Not Acceptable means I cannot produce a representation you accept. Rare, but correct in strict APIs.

Content-Type validation is mandatory. If a request body is present, validate Content-Type and reject unexpected types. This prevents parsing ambiguity and attacks. When your ESP32 sends a POST request to the temperature API with a body but Content-Type text slash plain, your Pi validates Content-Type, sees mismatch, rejects with four hundred Bad Request. Prevents parsing ambiguity. Or sends malformed JSON with wrong Content-Type. Validation catches it. Content-Type validation is mandatory. Prevents parsing ambiguity, wrong format, and attacks, malformed data.

Missing Content-Type is a client error. For APIs, missing Content-Type with body equals four hundred Bad Request. Guessing is unsafe. When your ESP32 sends a POST request to the temperature API with a body but no Content-Type, your Pi responds four hundred Bad Request. Missing Content-Type. Guessing is unsafe. Is it JSON? Plain text? Form-encoded? Cannot know. Or your dashboard sends request body without Content-Type. Pi rejects it. Missing Content-Type with body is a client error. APIs must be explicit, not guess.

Content-Type lies are common. Clients may send JSON with wrong Content-Type, send text claiming JSON, or send malformed data. Never trust blindly. When your ESP32 sends a POST request to the temperature API with Content-Type application slash JSON but the body is actually form-encoded data, your Pi validates. Content-Type says JSON, body is not JSON, rejects. Or sends Content-Type text slash plain claiming JSON. Content-Type lies are common. Never trust blindly. Validate Content-Type matches body format, reject mismatches.

At the boundary, read headers, validate type, validate length, validate encoding, and reject early if invalid. Do not parse garbage. When your ESP32 sends a POST request to the temperature API with a body, your Pi reads headers first. Validates Content-Type, is it JSON? Validates Content-Length, does it match body? Validates encoding, can I decode it? Rejects early if invalid. Or your dashboard receives response. Validates headers before parsing body. Phase 0 revisited. Boundaries defend. Read headers, validate everything, reject early if invalid. Do not parse garbage.

Parsing depends entirely on headers. The same bytes with application slash JSON parse as JSON. With text slash plain treat as text. With no Content-Type ambiguous. Headers determine behavior. When your ESP32 sends a POST request to the temperature API with body bytes, with Content-Type application slash JSON your Pi parses as JSON. With Content-Type text slash plain your Pi treats as text. With no Content-Type ambiguous, cannot parse safely. The same bytes, different headers, completely different behavior. Headers determine behavior. Parsing depends entirely on headers.

Content-Type is not guessable safely. Heuristics fail. Explicit is safer than clever. When your ESP32 sends a POST request to the temperature API with a body but no Content-Type, your Pi could guess. Looks like JSON? But what if it is plain text that happens to look like JSON? Heuristics fail. Or body with key equals value. Is it form-encoded? Plain text? Cannot know. Content-Type is not guessable safely. Heuristics fail. Explicit is safer than clever. Require Content-Type, do not guess.

Content-Length and security are tightly coupled. Incorrect handling leads to request smuggling, response splitting, and buffer confusion. Many historical exploits live here. When your ESP32 sends a POST request to the temperature API with conflicting Content-Length fifteen and Transfer-Encoding chunked, your Pi must handle this correctly. Incorrect handling leads to request smuggling, malicious request hidden in body. Or incorrect Content-Length validation. Buffer confusion, response splitting. Many historical exploits live here. Content-Length and security are tightly coupled. Incorrect handling leads to serious vulnerabilities.

Modern frameworks enforce Content-Type, enforce Content-Length, and reject ambiguity. This is defensive design. When your Pi uses a modern framework, it enforces Content-Type application slash JSON for POST requests, rejects missing Content-Type. Or enforces Content-Length validation, rejects mismatches. Or rejects ambiguous requests, no guessing. Modern frameworks are strict. Enforce Content-Type, enforce Content-Length, reject ambiguity. This is defensive design. Prevent attacks, prevent bugs.

Browsers tolerate ambiguity, guess formats, and apply heuristics. APIs must be strict, must be explicit, and must fail loudly. Different constraints. When your browser requests a GET to the dashboard, may tolerate missing Content-Type, guess HTML, apply heuristics. Or your ESP32 sends a POST request to the temperature API. Your Pi API must be strict, require Content-Type, explicit, no guessing, fail loudly, four hundred Bad Request. Browsers tolerate ambiguity, user experience. APIs must be strict, security, correctness. Different constraints. Browsers guess, APIs validate.

## 8) JSON APIs: The Gold Standard

Typical API contract includes request Content-Type application slash JSON, response Content-Type application slash JSON, and UTF-8 only. Simple, predictable, safe. When your ESP32 sends a POST request to the temperature API with Content-Type application slash JSON and a body, your Pi responds with Content-Type application slash JSON and a body. UTF-8 only, JSON only. Simple, predictable, safe. Or your dashboard exchanges JSON with your Pi. Consistent format, no ambiguity. JSON APIs are the gold standard. Simple, one format, predictable, always JSON, safe, explicit, validated.

Accept headers can be used for version negotiation and format negotiation. For example, Accept application slash vnd dot api dot v2 plus json. Advanced but powerful. When your dashboard sends a GET request to the voltage API with Accept application slash vnd dot api dot v2 plus json, negotiates API version v2, format JSON. Or Accept application slash vnd dot api dot v1 plus json, version v1. Accept headers can be used for version negotiation, v1 versus v2, and format negotiation, JSON versus XML. Advanced but powerful. One header handles both version and format.

If your API always returns one format and does not support alternatives, then Accept adds little value. Simplicity is nothing. When your Pi API always returns JSON, never HTML, never XML, always JSON, Accept adds little value. Client can send it, but Pi ignores it, always returns JSON. Or your ESP32 API only supports JSON. No need for Accept negotiation. When not to use Accept. If your API always returns one format, does not support alternatives, Accept adds little value. Simplicity is nothing. Keep it simple.

Content-Type is the body's identity. If you remember one thing, the body has no meaning without Content-Type. Everything else builds on that. When your ESP32 sends a POST request to the temperature API with a body, without Content-Type application slash JSON your Pi does not know what these bytes mean. Cannot parse, cannot validate, cannot process. Content-Type is the body's identity. It tells you what the bytes are. Everything else, parsing, validation, processing, builds on that. If you remember one thing, the body has no meaning without Content-Type.

## Common Pitfalls

Missing or incorrect Content-Type causes parsing failures. Without Content-Type, the receiver cannot safely interpret the body. Always include Content-Type for request and response bodies. Validate that Content-Type matches the actual body format.

Confusing Content-Type with Content-Encoding breaks parsing. Content-Type describes format. Content-Encoding describes compression. Decode Content-Encoding first, then parse Content-Type. Do not parse compressed data as if it were uncompressed.

Incorrect Content-Length causes truncation or hangs. Too small truncates the body. Too large causes the receiver to wait indefinitely. Always calculate Content-Length correctly. Validate that Content-Length matches actual body size.

Guessing Content-Type when it is missing is unsafe. Heuristics fail. Require explicit Content-Type. Reject requests with missing Content-Type rather than guessing.

Ignoring Accept headers breaks content negotiation. If your API supports multiple formats, honor Accept. If it does not, ignore it consistently. Do not partially honor Accept, which confuses clients.

## Summary

The body is bytes. Content-Type tells what those bytes mean. Content-Length tells where the body ends. Accept tells what the client can understand. Encoding and charset modify interpretation. These headers are boundary invariants. Without them, HTTP is unsafe and ambiguous. Content-Type is the most important header. It turns bytes into meaning. Content-Length enables safe streaming over TCP. Accept enables content negotiation. Content-Encoding enables compression. Charset enables correct character interpretation. Validation at boundaries prevents attacks and parsing failures. Modern APIs require explicit Content-Type and Content-Length. JSON APIs with UTF-8 are simple, predictable, and safe. Understanding these headers is essential for building robust HTTP systems.

## Next

This chapter built on Chapter 1.15, which covered headers overview and purpose. Next, Chapter 1.17 explores caching and control headers, showing how headers prevent unnecessary transfers, enable conditional requests, control freshness, and coordinate clients, servers, and caches. This is where HTTP becomes efficient, not just correct.
