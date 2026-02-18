# Section B Phase 1 · Chapter 1.19: Request Bodies and Content Types

## Learning Objectives

After this chapter, you will be able to:
- Understand when request bodies are required and when they are optional
- Distinguish between JSON, form-encoded, and multipart content types
- Recognize why Content-Type is mandatory for request bodies
- Validate request bodies at the boundary after parsing
- Handle size limits and security concerns with request bodies
- Design APIs that properly document and enforce content type requirements

## Key Terms

- **Request Body**: The payload portion of an HTTP request that carries data
- **Content-Type**: Header that specifies the format of the body
- **application/json**: Content type for structured JSON data
- **application/x-www-form-urlencoded**: Content type for URL-encoded form data
- **multipart/form-data**: Content type for file uploads and complex forms
- **Content-Length**: Header that specifies the exact byte length of the body
- **Transfer-Encoding**: Header that specifies how the body is encoded for transfer

## 1) When Bodies Exist and Why They Matter

Up to now, we have focused on URLs, methods, headers, and structure. Those tell the server what resource and what action. Now we reach the moment where data itself crosses the boundary. The request body is where meaningful data enters the system, validation becomes critical, parsing decisions determine correctness or failure, and security issues are born if mistakes are made.

Chapter 1.18 covered URLs and identity. Chapter 1.16 covered Content-Type and Content-Length as headers. Here we focus on the request body itself, when it exists, how JSON and form and multipart differ, and why validation at the boundary is non-negotiable. Whether your ESP32 posts temperature as JSON, your dashboard submits forms or uploads files, or your Pi rejects malformed or mismatched Content-Type, bodies are where data crosses the boundary and where mistakes become bugs or security issues.

Not every request has a body. Some requests never need one, should not have one, or will be ignored if one is present. Other requests are meaningless without one, fail if the body is malformed, or fail if the Content-Type is wrong. Understanding when bodies belong is foundational. When your ESP32 sends a GET request to the voltage API, no body needed. Sends a POST request to the temperature API with a body containing a temperature reading, meaningless without body. Wrong Content-Type or malformed JSON and the Pi rejects it. Or your dashboard: GET has no body. POST, PUT, PATCH require bodies. Understanding when bodies belong is foundational.

By convention and practice, GET has no body, DELETE usually has no body, POST has body required or expected, PUT has body required, and PATCH has body required. The spec does not forbid bodies on GET, but most servers ignore them. Conventions exist for a reason. When your ESP32 sends a GET request to the voltage API, no body by convention. If you send a body, proxies may drop it, caches ignore it, your Pi may discard it. Or your dashboard: GET with body breaks expectations. Conventions exist for a reason.

Technically, HTTP does not forbid a GET body. Practically, proxies drop it, caches ignore it, servers discard it, and frameworks do not expose it. Using a GET body breaks expectations. If data is complex, use POST. When your ESP32 needs to send a time range and sensor ID, use POST to the readings API with a JSON body, not GET with a body. Or your dashboard submitting a config form: use POST. Using a GET body breaks expectations. If data is complex, use POST.

## 2) Bodies Carry Meaning, Not Metadata

Headers describe. Bodies contain. This distinction matters. Content-Type is metadata. Authorization is metadata. JSON payload is meaning. Do not confuse the two. When your ESP32 sends Content-Type application slash JSON, metadata, and body containing a JSON object with temperature and sensor ID, meaning, headers describe, bodies contain. Or your dashboard: Authorization is metadata, JSON payload is meaning. Do not confuse the two.

At the lowest level, the body is a sequence of bytes. No structure is implied. No meaning exists yet. Meaning only emerges after parsing. When your Pi receives raw bytes for a POST request to the temperature API, until it parses with Content-Type application slash JSON, there is no meaning. Just bytes. Or your ESP32 sends JSON. The body is a sequence of bytes until the server parses it. Meaning only emerges after parsing.

Without Content-Type, the server does not know how to interpret the body, parsing becomes guessing, and guessing becomes bugs. Content-Type answers what do these bytes represent? When your ESP32 sends a POST request to the temperature API with Content-Type application slash JSON, tells the Pi how to interpret the body. Without it, the server does not know. Parsing becomes guessing, guessing becomes bugs. Or your dashboard sends a body without Content-Type. Server may reject with four hundred. Content-Type gives meaning to bytes.

When a client sends Content-Type application slash JSON, it is asserting the body is valid JSON, the encoding matches expectations, and the server can parse accordingly. If this is false, the client is lying. When your ESP32 sends Content-Type application slash JSON but body is form-encoded data, client is lying. Your Pi attempts JSON parse, fails, returns four hundred. Or your dashboard sends wrong Content-Type. Server rejects. Content-Type is a contract. If false, the client is lying.

Phase 0.8: validation lives at boundaries. Request bodies cross the hardest boundary: untrusted, arbitrary, user-controlled. Parsing must be defensive. When your Pi receives a POST request to the temperature API with body from the network, untrusted, arbitrary, possibly attacker-controlled. Parse defensively: validate structure, then semantics, then apply logic. Or your ESP32 receives responses. Bodies cross the hardest boundary. Parsing must be defensive.

## 3) JSON: The Modern Default

Application slash JSON is the most common API payload type today. Characteristics include text-based format, human-readable, structured data, and language-agnostic. When your ESP32 sends a POST request to the temperature API with Content-Type application slash JSON and a body containing a JSON object, or your dashboard sends a PUT request to the config API with the same header, application slash JSON is the modern default for APIs.

What a JSON body looks like. Raw bytes contain a JSON object with keys and values. Important: strings must be quoted, numbers are not quoted, booleans are lowercase, and no trailing commas. JSON is strict. Unquoted keys fail. Trailing commas fail. Parsing errors are client errors. When your solar panel logger sends a POST request with a JSON body containing voltage readings, the keys must be quoted strings, numbers appear without quotes, and boolean values use lowercase true or false. Your Pi's JSON parser will reject unquoted keys or trailing commas immediately. When your ESP32 sends a POST request to the temperature API with body containing unquoted keys, invalid JSON. Your Pi returns four hundred Bad Request. Or body with trailing comma. Parsing error, client error. JSON is strict. Parsing errors are client errors.

If JSON parsing fails, the entire request body is unusable, partial parsing is not acceptable, and the server must reject the request. Typical response: four hundred Bad Request. When your ESP32 sends malformed JSON to a POST request to the temperature API, your Pi responds four hundred Bad Request. Or your dashboard sends invalid JSON to the Pi. Entire body unusable, server must reject. Typical response: four hundred Bad Request.

After parsing, objects map to dictionaries, arrays map to lists, numbers map to integers or floats, strings map to strings, true and false map to booleans, and null maps to None. But type validation is still required. When your Pi parses JSON and gets a JSON object with voltage, objects to dicts, numbers to floats. But it must still validate: is voltage a number? In range? Or your ESP32: JSON maps to native types. Type validation is still required.

JSON only enforces structure, not meaning. This is valid JSON: a JSON object with voltage as a string value. Validation must check presence, type, range, and semantics. When your Pi receives a JSON object with voltage as a string value, valid JSON but wrong type. Must validate presence, is voltage there, type, is it a number, range, zero to twenty, semantics, is it sensible. Or your dashboard: JSON does not enforce schema. Validation must check all of these.

## 4) Form Encoding: Simple and Flat

Application slash x-www-form-urlencoded is the classic HTML form encoding. Header: Content-Type application slash x-www-form-urlencoded. Body: key equals value ampersand key2 equals value2. Form bodies use URL encoding: space becomes plus or percent 20, ampersand becomes percent 26, equals becomes percent 3D. The same encoding rules as query strings. When your dashboard submits a form with Content-Type application slash x-www-form-urlencoded and body with key equals value pairs, space becomes plus or percent 20, ampersand and equals encoded. Or your ESP32 sends form data. URL encoding rules apply. The same encoding rules as query strings.

Characteristics include key–value only, no nesting, no arrays without conventions, and all values are strings. Good for simple forms, bad for structured data. When your dashboard submits key equals value pairs, key–value only, no nesting, all strings. Or your ESP32 sends simple config as form data. Form encoding is flat. Good for simple forms, bad for structured data. Your coop controller might submit a simple form with threshold and unit values. Form encoding works perfectly for this flat structure. But if you need to send nested sensor configurations or arrays of readings, JSON is the better choice.

JSON versus form encoding. JSON is structured, typed, nested, and explicit. Form encoding is simple, flat, string-only, and legacy-friendly. Choose based on complexity. When your ESP32 sends simple key-value config, form encoding is fine. Sends nested sensor payload, use JSON. Or your dashboard: simple form, form encoding. Structured data, JSON. JSON versus form encoding. Choose based on complexity.

## 5) Multipart: Files and Complex Forms

Multipart slash form-data is used primarily for file uploads. Header example: Content-Type multipart slash form-data semicolon boundary equals dash XYZ. The body is split into parts. When your dashboard uploads a config file with Content-Type multipart slash form-data semicolon boundary, body has parts, for example file bytes and metadata. Or your ESP32 uploading a firmware chunk. Multipart: body split into parts.

Each part has its own headers, its own Content-Type, and raw binary or text content. This allows files, metadata, and mixed content. When your dashboard uploads a config file, one part with Content-Type application slash octet-stream, file, another with form field, name. Or your ESP32 sends firmware chunk in one part, metadata in another. Multipart bodies are complex. Each part has its own headers and content.

Why multipart exists: files cannot be JSON easily, binary data breaks text encodings, and multiple payloads need separation. Multipart solves this. When your dashboard uploads a log file, files cannot be JSON easily, binary breaks text encodings. Multipart allows files plus metadata in one request. Or your Pi accepts firmware upload via multipart. Why multipart exists: files, binary, multiple payloads. Multipart solves this.

The boundary string separates parts, must not appear in content, and is chosen by the client. Parsing fails if boundaries are wrong. When your Pi receives multipart with boundary, if the body contains the boundary string in the content, parsing breaks. Or your ESP32 sends wrong boundary. Server fails. Multipart boundaries matter. Parsing fails if boundaries are wrong.

Many bugs live here: incorrect boundaries, incorrect content lengths, memory exhaustion, and security vulnerabilities. Use well-tested libraries. When your Pi parses multipart with a framework or library, do not hand-roll it. Incorrect boundaries, content lengths, memory exhaustion, and security bugs are common. Or your ESP32: use a proven HTTP client. Multipart is hard to implement correctly. Use well-tested libraries.

## 6) Content-Length, Encoding, and Charset

Bodies must have a length. Either Content-Length specifies size, or Transfer-Encoding chunked streams data. Servers must handle both. When your Pi receives a POST request to the temperature API with Content-Length fifteen, fixed size, or Transfer-Encoding chunked, streamed, it must handle both. Or your dashboard sends chunked upload. Server must support it. Content-Length versus Transfer-Encoding: servers must handle both.

Chunked bodies arrive in pieces, end with a zero-length chunk, and require streaming parsers. This matters for large payloads. When your dashboard streams a large log upload with Transfer-Encoding chunked, body arrives in pieces, ends with zero-length chunk. Your Pi needs a streaming parser. Or your ESP32 sends chunked body. Server must handle it. Chunked encoding changes parsing. This matters for large payloads.

Content-Encoding is separate. For example, Content-Encoding gzip. This means the body is compressed, must be decompressed before parsing, and happens before Content-Type parsing. Order matters. When your ESP32 sends body with Content-Encoding gzip and Content-Type application slash JSON, your Pi must decompress first, then parse JSON. Or your dashboard receives gzipped response. Decode then parse. Content-Encoding is separate. Order matters.

Charset matters for text. For example, Content-Type application slash JSON semicolon charset equals utf-8. This tells the server how to decode bytes into characters. UTF-8 is default but should be explicit. Wrong charset equals corrupted data. When your ESP32 sends Content-Type application slash JSON semicolon charset equals utf-8 and body with special characters, Pi decodes with UTF-8. Wrong charset and characters corrupt. Or your dashboard: charset matters for text. Wrong charset equals corrupted data.

## 7) Validation and Security

Missing Content-Type is an error. If a body exists and Content-Type is missing, the server must guess, guessing is unsafe, and many servers reject the request. Best practice: four hundred Bad Request. When your ESP32 sends a POST request to the temperature API with body but no Content-Type, your Pi returns four hundred Bad Request. Or your dashboard omits Content-Type. Server must not guess. Many reject. Missing Content-Type with body is an error. Best practice: four hundred Bad Request.

Mismatched Content-Type is worse. For example, Content-Type application slash JSON but body is form-encoded. This is a lie. The server must trust the header, attempt JSON parsing, and fail loudly. Servers must not auto-detect silently. Silent guessing leads to inconsistent behavior, security issues, and impossible debugging. Explicit failure is better. When your Pi receives a body with no Content-Type, reject with four hundred rather than guessing looks like JSON. Or your ESP32 sends wrong Content-Type. Server must not auto-detect silently. Fail explicitly. Servers must not auto-detect silently. Explicit failure is better.

Request bodies are input. Phase 0.8 again: bodies are untrusted, bodies are attacker-controlled, and bodies must be validated. Never trust body contents. When your Pi receives a POST request to the temperature API, body is untrusted, attacker-controlled. Validate everything. Or your ESP32: request bodies are input. Phase 0.8: bodies must be validated. Never trust body contents.

Validation happens after parsing. Steps: decode bytes, decompress if needed, parse according to Content-Type, validate structure, validate semantics, and apply logic. Skipping steps is dangerous. When your Pi must decode bytes, decompress if needed, parse by Content-Type, validate structure and semantics, then apply logic. Skipping validation and going straight to logic is dangerous. Or your ESP32: validation happens after parsing. Skipping steps is dangerous. Your irrigation controller might send a POST request with a JSON body. Your Pi must first decode the bytes using the charset, decompress if Content-Encoding is present, parse the JSON structure, validate that required fields exist, check that temperature values are numbers in a valid range, verify that sensor IDs match known devices, and only then apply the logic to update the irrigation schedule. Each step catches different classes of errors.

Size limits are required. Bodies can be huge, malicious, or accidental DoS vectors. Servers must impose limits: max body size, max field sizes, and max nesting depth. When your Pi imposes a one MB max body size for a POST request to the temperature API to avoid DoS, or max nesting depth for JSON to prevent stack overflow, or your dashboard: servers must impose limits. Size limits are required.

Reading entire bodies into memory is risky. Streaming parsing is safer for large inputs. When your dashboard uploads a large log file to your Pi, reading the whole body into memory can exhaust it. Streaming parsing is safer. Or your Pi imposes max body size to avoid DoS. Bodies can exhaust memory. Streaming is safer for large inputs.

## 8) Bodies and Method Semantics

Bodies change semantics. Compare POST slash api slash readings with no body versus POST slash api slash readings with a JSON body containing voltage. The body is the meaning. When your ESP32 sends POST slash api slash readings with no body versus with body containing voltage, the body is the meaning. Or your dashboard: POST slash api slash readings with empty body versus with payload. Bodies change semantics. The body is the meaning.

PUT means replace the resource with this representation. Without a body, PUT is meaningless. When your ESP32 sends PUT slash api slash config with body containing threshold, replace the resource with this representation. Without a body, PUT is meaningless. Or your dashboard: PUT requires a body. PUT means replace with this representation. Without a body, PUT is meaningless.

PATCH means apply these changes. Without a body, there are no changes. When your ESP32 sends PATCH slash api slash config with body containing threshold, apply these changes. No body, no changes. Or your dashboard: PATCH requires a body. PATCH means apply these changes. Without a body, there are no changes.

DELETE usually has no body. Some APIs accept bodies, but this is controversial and inconsistent. Prefer path plus query. When your ESP32 deletes with DELETE slash api slash sensors slash esp32_coop, path, or DELETE slash api slash readings question mark before equals 1700, query, not a body. Or your dashboard: DELETE usually has no body. Prefer path plus query. DELETE and bodies: prefer path plus query.

Bodies are not cache keys usually. Caches typically ignore bodies. This is why GET bodies are useless and POST is rarely cached. URL plus headers define cache identity. When your dashboard sends POST slash api slash temp, caches typically ignore the body. Cache identity is URL plus headers. Or your ESP32: GET bodies are useless for caching. POST is rarely cached. Bodies are not cache keys usually. URL plus headers define cache identity.

Bodies affect idempotency. Same body plus same PUT equals safe. Same body plus same POST equals duplicate risk. Design accordingly. When your ESP32 sends PUT slash api slash config with same body twice, idempotent, safe. Sends POST slash api slash temp twice with same body, duplicate readings risk. Or your dashboard: idempotency and bodies. Design accordingly.

## 9) Bodies, Authentication, and Errors

Bodies are parsed after authentication headers. Do not parse bodies for unauthenticated requests unless necessary. When your Pi checks Authorization or session before parsing the body of POST slash api slash config, do not parse first and then reject. Avoid unnecessary work and information leakage. Or your ESP32: bodies are parsed after authentication headers. Do not parse for unauthenticated requests unless necessary.

Never log full request bodies blindly: sensitive data, credentials, and PII. Log selectively. When your Pi must not log full request bodies, sensitive data, credentials, PII. Or your ESP32 sends passwords in body. Never log blindly. Bodies and logging: log selectively.

Malformed body equals four hundred. Unsupported Content-Type equals four hundred fifteen. Too large equals four hundred thirteen. These are client errors. When your ESP32 sends malformed JSON, four hundred. Sends Content-Type application slash XML, unsupported, four hundred fifteen. Sends ten MB body, over limit, four hundred thirteen. Or your Pi: bodies and errors. Malformed four hundred, unsupported four hundred fifteen, too large four hundred thirteen. These are client errors.

Four hundred fifteen Unsupported Media Type means I do not understand this Content-Type. It is correct and underused. When your ESP32 sends Content-Type application slash XML but your Pi only supports JSON, Pi responds four hundred fifteen Unsupported Media Type. Or your dashboard sends a type the server does not understand. Four hundred fifteen is the correct, underused response. Four hundred fifteen means I do not understand this Content-Type.

Content-Type drives behavior. Routing, parsing, validation, and logic often branch on Content-Type. It is not cosmetic. When your Pi routes POST slash api slash temp by Content-Type, application slash JSON goes to JSON handler, form data to form handler. Parsing, validation, and logic branch on Content-Type. Or your dashboard: Content-Type drives behavior. It is not cosmetic.

APIs should document content types. Clients need to know what to send, what they will receive, and what errors occur. Documentation is part of the contract. When your Pi API docs state POST slash api slash temp accepts application slash JSON with keys temp, number, sensor_id, string, your ESP32 and dashboard know what to send and what errors to expect. Or your dashboard: clients need to know what to send, what they will receive, what errors occur. APIs should document content types. Documentation is part of the contract.

Without bodies, URLs identify and methods act. With bodies, data enters and state changes. Bodies are where systems evolve. When your ESP32 sends voltage today, adds timestamp tomorrow, body shape evolves. Or your dashboard: with bodies, data enters and state changes. Without bodies, URLs and methods only. With bodies, systems evolve. Bodies complete the request model. Bodies are where systems evolve.

## Common Pitfalls

Missing Content-Type causes parsing failures. Servers must guess or reject. Always include Content-Type for request bodies. Reject requests with missing Content-Type rather than guessing.

Mismatched Content-Type breaks parsing. If Content-Type says JSON but body is form-encoded, parsing fails. Validate that Content-Type matches actual body format. Reject mismatches with four hundred Bad Request.

Ignoring size limits causes DoS. Large bodies can exhaust memory or disk. Always impose max body size limits. Use streaming parsers for large inputs.

Skipping validation after parsing allows bad data. JSON parsing only checks structure, not semantics. Always validate presence, type, range, and semantics after parsing.

Logging full request bodies leaks sensitive data. Never log credentials, passwords, or PII. Log selectively or sanitize before logging.

## Summary

Bodies carry payloads. Content-Type gives meaning to bytes. JSON, form, and multipart each serve different roles. Structured APIs use JSON. Simple forms use application slash x-www-form-urlencoded. File uploads use multipart slash form-data. Parsing happens at the boundary. Bodies are untrusted input, so validation is mandatory after decode and parse. Missing or wrong Content-Type is an error, four hundred or four hundred fifteen. Servers must not guess silently. Bodies change semantics, POST with versus without body, and risk, size, injection, duplicate submissions. Design with limits, validation, and idempotency in mind. Bodies complete the request model. They are where data enters the system and where systems evolve.

## Next

This chapter built on Chapter 1.18, which covered URLs, and Chapter 1.16, which covered Content-Type and Content-Length. Next, Chapter 1.20 explores cookies and session state, confronting HTTP's statelessness and how the web carries memory across requests, identity, continuity, and trust.
