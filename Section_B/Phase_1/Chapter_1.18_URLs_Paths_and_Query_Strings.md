# Section B Phase 1 · Chapter 1.18: URLs, Paths, and Query Strings

## Learning Objectives

After this chapter, you will be able to:
- Understand the structure of URLs and what each component means
- Distinguish between paths and query strings and when to use each
- Recognize how small URL differences affect caching and identity
- Design stable, readable URLs that form part of your API contract
- Properly encode URLs to prevent parsing ambiguity
- Understand how URLs relate to routing, caching, and versioning

## Key Terms

- **URL**: Uniform Resource Locator that identifies a resource
- **Scheme**: The protocol part of a URL (http, https)
- **Host**: The server identifier in a URL
- **Port**: The service identifier on a host
- **Path**: The primary resource identifier on the server
- **Query String**: Parameters that modify or filter the resource
- **Fragment**: Client-side only identifier (not sent to server)
- **URL Encoding**: Process of encoding special characters in URLs

## 1) URLs as Identity and Address

URLs answer a deceptively simple question: what exactly are we talking about? In HTTP, everything starts with identification. Before methods, before headers, before bodies, there is a URL. If you misunderstand URLs, everything downstream becomes fuzzy. Caching breaks, routing becomes inconsistent, APIs become confusing, and clients and servers disagree about identity.

Chapter 1.7 introduced the request line with method, path, and query. Chapter 1.17 showed how the full URL is the cache key. Here we treat URLs as the foundation of identity and addressing, scheme, host, port, path, query, fragment, and why small differences break caching, routing, and contracts. Whether your ESP32 calls http colon slash slash pi dot local slash api slash voltage, your dashboard uses query strings for filters, or your Pi versions paths with slash api slash v1, URLs are where identity and addressing collide.

A URL does not say what to do. It says what is being referred to. The method carries intent. The URL carries identity. This separation is foundational. When your ESP32 sends a GET request to http colon slash slash pi dot local slash api slash voltage, the URL identifies the resource, voltage reading, and the method carries intent, retrieve. Or your dashboard sends a POST request to http colon slash slash pi dot local slash api slash temp. URL identifies the resource, temp endpoint, method carries intent, submit. A URL is an address, not an action. The method carries intent, the URL carries identity.

A full URL looks like this: scheme colon slash slash host colon port slash path question mark query hash fragment. Each part has a distinct role. None are optional conceptually, even if omitted syntactically. When your dashboard requests http colon slash slash pi dot local slash api slash voltage, scheme http, host pi dot local, path slash api slash voltage. Port eighty and empty query and fragment omitted. Or your ESP32 uses http colon slash slash 192 dot 168 dot 1 dot 10 colon 8080 slash api slash sensors. Explicit port. Full form: scheme colon slash slash host colon port slash path question mark query hash fragment. Each part has a distinct role.

## 2) Scheme, Host, and Port

The scheme defines how the client communicates. Common schemes include http and https. The scheme implies transport protocol, default port, and security expectations. The scheme is not decorative. When your dashboard uses https colon slash slash pi dot local slash api slash config with TLS versus http colon slash slash pi dot local slash api slash config in plaintext, different resource identity for caches and security. Or your ESP32 on the coop uses http to the Pi on the LAN. Scheme defines how the client communicates. The scheme is not decorative. It implies transport, default port, and security.

Http versus https. Http is plaintext with no encryption. Https is HTTP over TLS, encrypted. The rest of the URL may be identical, but the resource identity is different. From the web's perspective, http colon slash slash example dot com slash data and https colon slash slash example dot com slash data are not the same resource. When your dashboard requests http colon slash slash pi dot local slash api slash voltage versus https colon slash slash pi dot local slash api slash voltage, from a caching and identity perspective, not the same resource. Or your ESP32 uses http to the Pi. If you later add TLS, the URL changes and caches treat it differently. Http versus https. Rest of URL may be identical, but resource identity is different.

The host identifies which server. Examples include example dot com, api dot example dot com, and 192 dot 168 dot 1 dot 10. The host maps to an IP via DNS, or directly if already numeric. When your dashboard uses http colon slash slash pi dot local slash api slash voltage, host pi dot local resolves, for example via mDNS, to your Pi's IP. Or your ESP32 uses http colon slash slash 192 dot 168 dot 1 dot 10 slash api slash temp. Numeric host, no DNS. Host identifies which server: example dot com, api dot example dot com, 192 dot 168 dot 1 dot 10, or pi dot local.

In HTTP/1.1, the Host header is required. Why? Multiple sites can share one IP, and the server needs to know which one you want. This enables virtual hosting. When your Pi might serve both a dashboard at pi dot local and an API at api dot pi dot local on the same IP, Host header tells it which one you want. Or your ESP32 sends Host pi dot local with GET slash api slash voltage. Without Host, the Pi could not distinguish. Host is mandatory in HTTP/1.1. This enables virtual hosting.

The port identifies which service on the host. Defaults are eighty for HTTP and four hundred forty-three for HTTPS. Explicit ports override defaults. Different ports equal different endpoints. When your Pi runs the API on port 8080, http colon slash slash pi dot local colon 8080 slash api slash voltage, your dashboard uses port eighty, http colon slash slash pi dot local slash api slash voltage. Different ports equal different endpoints. Caches and routing treat them separately. Or your solar logger on port 9000 versus API on port eighty.

## 3) Path: The Primary Resource Identifier

The path is the primary identifier of the resource on the server. Examples include slash, slash api, slash api slash voltage, and slash users slash 42. The path is hierarchical, but only by convention. When your Pi exposes slash api slash voltage, slash api slash temp, slash api slash sensors slash esp32_coop, path identifies the resource. Or your dashboard uses slash api slash readings, slash api slash config. Path is the primary identifier: slash, slash api, slash api slash voltage, slash users slash 42. The path is hierarchical, but only by convention.

The server decides what paths exist, what they map to, and what they mean. The path does not inherently mean folder or file. When your Pi maps slash api slash voltage to a function that reads a sensor, not to a file on disk, or slash api slash sensors slash esp32_coop might be a row in a database or a virtual resource, the server decides what paths exist, what they map to, and what they mean. The path does not inherently mean folder or file.

Clients should not assume file system structure, database structure, or internal routing logic. A path is a label, not a promise. When your ESP32 requests GET slash api slash sensors slash esp32_coop, do not assume it is a filesystem path or a table name. The Pi defines meaning. Or your dashboard uses slash api slash readings. Path is a label. Clients should not assume file system structure, database structure, or internal routing. A path is a label, not a promise.

Trailing slashes matter. Slash api slash readings and slash api slash readings slash are different URLs. Some servers treat them the same. Some do not. Consistency matters. When your Pi might treat GET slash api slash readings and GET slash api slash readings slash as the same or different, if your ESP32 sometimes sends one and sometimes the other, caching and routing can break. Or your dashboard: pick one form and stick to it. Trailing slashes: slash api slash readings versus slash api slash readings slash are different URLs. Consistency matters.

By specification, paths are case-sensitive. Whether a server treats them that way is implementation-specific, but clients must assume they are. When your ESP32 should treat GET slash api slash Voltage and GET slash api slash voltage as different URLs unless the Pi documents otherwise, or your dashboard: paths are case-sensitive by spec, slash Api slash readings and slash api slash readings can be distinct, clients must assume paths are case-sensitive.

Paths are typically segmented by slash. For example, slash users slash 42 slash settings. Common interpretation: users to collection, 42 to specific user, settings to sub-resource. This is convention, not enforcement. When your Pi might use slash api slash sensors slash esp32_coop slash readings, sensors to collection, esp32_coop to specific sensor, readings to sub-resource, or slash api slash coop slash temp, slash api slash pig-barn slash temp, path segments encode hierarchy by convention. The server defines meaning. This is convention, not enforcement.

A common REST pattern includes slash users to collection and slash users slash 42 to specific item. This pattern is widely used because it maps well to mental models. When your Pi exposes slash api slash sensors, collection, and slash api slash sensors slash esp32_coop, specific sensor, or slash api slash readings versus slash api slash readings slash 123, collections versus items: slash users to collection, slash users slash 42 to item. Same pattern for sensors, readings, config. This pattern is widely used because it maps well to mental models.

Paths should identify nouns. Good paths identify things, not actions. Good examples: GET slash api slash readings, POST slash api slash readings. Bad example: POST slash api slash createReading. Actions belong in methods, not paths. When good: GET slash api slash voltage, POST slash api slash temp, paths identify resources. Bad: POST slash api slash createReading, action in path. Or your dashboard: use POST slash api slash readings with body, not POST slash api slash createReading. Paths should identify nouns. Actions belong in methods, not paths.

## 4) Query Strings: Modifiers and Filters

The query string comes after the path. For example, slash api slash readings question mark limit equals 10. Everything after question mark is query. When your dashboard requests http colon slash slash pi dot local slash api slash readings question mark limit equals 10, path is slash api slash readings, query is limit equals 10. Or your ESP32 uses GET slash api slash voltage question mark unit equals V. The query string begins with question mark. Everything after question mark is query. Example: slash api slash readings question mark limit equals 10.

Query strings are key–value pairs. Format: key equals value ampersand key2 equals value2. Multiple parameters are separated by ampersand. Order may matter semantically, but not structurally. When your dashboard uses GET slash api slash readings question mark limit equals 10 ampersand from equals 1700 ampersand to equals 1800, key equals value pairs separated by ampersand, or question mark sensor equals esp32_coop ampersand unit equals F, query strings are key–value pairs, key equals value ampersand key2 equals value2. Order may matter semantically but not structurally.

The query usually answers how many, which subset, what filters, what options. The path identifies what. The query refines how. When your dashboard requests GET slash api slash readings question mark limit equals 10, path identifies readings, query refines how many, or GET slash api slash voltage question mark window equals 60, query usually answers: how many, which subset, what filters, what options. The path identifies what. The query refines how. Query strings modify, not identify.

Same path, different query equals different resource. Slash api slash readings question mark limit equals 10 and slash api slash readings question mark limit equals 100 are distinct URLs. From a caching and identity perspective, they are different. When your dashboard requests GET slash api slash voltage question mark window equals 60 and GET slash api slash voltage question mark window equals 300, distinct cache entries, Chapter 1.17, or your ESP32: slash api slash temp question mark unit equals F versus slash api slash temp question mark unit equals C, same path, different query equals different resource. From a caching and identity perspective, they are different.

GET requests commonly encode parameters in the query string. Why? GET has no body by convention, URLs are bookmarkable, and URLs are cacheable. When your dashboard uses GET slash api slash voltage question mark window equals 60, parameters in query string, bookmarkable and cacheable, or your ESP32 uses GET with query for filters, GET commonly encodes parameters in the query string because GET has no body by convention, URLs are bookmarkable, and URLs are cacheable. Queries are common with GET.

Technically allowed: POST slash api slash readings question mark source equals sensorA. But use carefully. Overloading query plus body can confuse semantics. When your ESP32 could send POST slash api slash temp question mark source equals coop with a body, technically allowed but mixing query, source, and body, reading, can confuse semantics. Prefer clear split: path plus query for identification and filters, body for payload. Queries can appear on other methods. Use carefully.

## 5) URL Encoding and Validation

All query values are strings initially. The server must parse, convert, and validate. Phase 0.8: boundaries validate. When your dashboard sends GET slash api slash readings question mark limit equals 10, server parses 10 as integer, validates range, or your ESP32 sends question mark unit equals F, server must parse, convert, validate. All query values are strings initially. The server must parse, convert, validate. Phase 0.8: boundaries validate.

Certain characters cannot appear raw in URLs. Examples include space to percent 20, ampersand to percent 26, equals to percent 3D, and question mark to percent 3F. Encoding preserves structure. When your dashboard requests GET slash api slash sensors question mark name equals Coop percent 20 Main, space encoded as percent 20, or question mark filter equals temp percent 3E 70, greater than or equal, certain characters cannot appear raw: space to percent 20, ampersand to percent 26, equals to percent 3D, question mark to percent 3F. URL encoding is mandatory. Encoding preserves structure.

Without encoding, question mark name equals Tom space ampersand space Jerry breaks parsing. With encoding, question mark name equals Tom percent 20 percent 26 percent 20 Jerry, structure remains intact. When without encoding, question mark name equals Coop space ampersand space Barn breaks parsing, space and ampersand, with encoding, question mark name equals Coop percent 20 percent 26 percent 20 Barn keeps structure, or your ESP32 sends sensor names with special characters, must encode. Encoding prevents ambiguity. Structure remains intact.

This is a contract: client encodes, server decodes. Failure on either side breaks communication. When your dashboard sends question mark from equals 2025 dash 01 dash 30, client encodes if needed, Pi decodes. If the client sends raw ampersand in a value, the server misparses. Or if the server double-decodes, values break. Clients must encode, servers must decode. Failure on either side breaks communication.

The fragment, hash section, is not sent to the server. For example, slash docs slash page hash install. The server receives slash docs slash page. Fragments are for browsers, not servers. When your dashboard opens http colon slash slash pi dot local slash dashboard hash voltage, the Pi receives only GET slash dashboard. The hash voltage part is not sent. Or a doc link docs hash install. Server never sees hash install. The fragment, hash section, is not sent to the server. Fragments are for browsers, not servers.

No matter what comes after hash, the request is identical. This is important for APIs and caching. When your ESP32 requests GET http colon slash slash pi dot local slash api slash voltage hash ignore, request is the same as without hash ignore. Cache key and server see only slash api slash voltage. No matter what comes after hash, the request is identical. This is important for APIs and caching. Fragments do not affect HTTP requests.

Caches typically key on scheme, host, port, path, and query. Fragments are ignored. When your dashboard requests GET slash api slash voltage question mark window equals 60 and GET slash api slash voltage question mark window equals 60 hash chart, same cache entry, fragment ignored. Caches key on scheme, host, port, path, query. Fragments are ignored. URLs as cache keys, Chapter 1.17: fragments are ignored.

## 6) URL Design and Stability

Small URL differences matter. Slash api slash data, slash api slash data slash, slash api slash data question mark x equals 1, and slash api slash data question mark x equals 1 ampersand y equals 2 are distinct. Each is a different cache entry. When your dashboard: slash api slash voltage, slash api slash voltage slash, slash api slash voltage question mark x equals 1, slash api slash voltage question mark x equals 1 ampersand y equals 2, each distinct for caching, or your ESP32: small differences in path or query change cache key. Small URL differences matter. Each is a different cache entry.

Poor URL design leads to cache misses, duplicate data, and hard-to-debug behavior. URL stability matters. When your Pi today uses slash api slash voltage, if you rename it to slash api slash v1 slash voltage next week without redirects, your ESP32 and dashboard break. Poor URL design leads to cache misses, duplicate data, hard-to-debug behavior. URL design affects caching. URL stability matters.

Once published, URLs should change rarely, be predictable, and be documented. Breaking URLs breaks clients. When your ESP32 is hardcoded to GET slash api slash voltage, if you change the path, all devices break, or your dashboard bookmarks slash api slash config, once published, URLs should change rarely, be predictable, and be documented. Breaking URLs breaks clients. Stable URLs are a feature.

Common patterns for versioning include slash v1 slash api slash readings and slash api slash v1 slash readings. Versioning in the path is explicit and cache-friendly. When your Pi uses slash api slash v1 slash voltage or slash v1 slash api slash voltage, version in path is explicit and cache-friendly, different paths equal different cache entries, or your dashboard: slash v1 slash api slash readings versus slash v2 slash api slash readings. Versioning and URLs: slash v1 slash api slash readings or slash api slash v1 slash readings.

Other approaches include version in header, version in Accept, and version in query. Each has tradeoffs. When version in header, for example Accept, in query, question mark version equals 1, or in path, slash v1 slash api slash voltage, path is visible and cache-safe. Header and query keep path stable but are less visible. Alternatives to path versioning: version in header, Accept, or query. Each has tradeoffs.

Why path versioning is common: visible, simple, cache-safe, and explicit. Downside: URL churn. When your Pi adds slash v2 slash api slash voltage, old clients stay on slash v1, new clients use slash v2. You maintain two paths. Why path versioning is common: visible, simple, cache-safe, explicit. Downside: URL churn when you add versions.

Query strings for filtering: slash api slash readings question mark from equals 1700 ampersand to equals 1800. This keeps the resource identity clear while adding parameters. When your dashboard requests GET slash api slash readings question mark from equals 1700 ampersand to equals 1800, path identifies readings, query adds time range, or your ESP32: slash api slash temp question mark unit equals F, query strings for filtering keep resource identity clear while adding parameters. Example: slash api slash readings question mark from equals 1700 ampersand to equals 1800.

Common patterns for pagination include question mark page equals 2 ampersand limit equals 50 and question mark offset equals 100 ampersand limit equals 50. Pagination belongs in query, not path. When your dashboard uses GET slash api slash readings question mark page equals 2 ampersand limit equals 50 or question mark offset equals 100 ampersand limit equals 50, or your Pi serves sensor history with question mark page equals 1 ampersand limit equals 100, pagination belongs in query, not path. Common patterns: question mark page equals 2 ampersand limit equals 50, question mark offset equals 100 ampersand limit equals 50.

Query strings for search: slash api slash users question mark search equals alice. Search is an operation, but still a retrieval. When your dashboard uses GET slash api slash sensors question mark search equals coop, search is a retrieval, so GET with query is appropriate, or GET slash api slash readings question mark search equals high, query strings for search: for example slash api slash users question mark search equals alice. Search is an operation, but still a retrieval.

Avoid encoding actions in queries. Bad: slash api slash readings question mark action equals delete. Use the method instead. When bad: GET slash api slash readings question mark action equals delete, action in query. Good: DELETE slash api slash readings slash 123. Or your ESP32: use DELETE method, not GET with question mark action equals delete. Avoid encoding actions in queries. Use the method instead.

URL length limits exist. Browsers and servers impose limits. Long queries can break proxies, break logs, and break caches. Use bodies when data is large. When your dashboard sending fifty filter parameters, prefer POST with body instead of huge query string, or your ESP32: long query strings can break proxies, logs, caches. URL length limits exist. Use bodies when data is large.

Rule of thumb: if it fits cleanly in a URL, use GET. If it is complex or large, use POST. But semantics matter more than size. When your dashboard uses GET for GET slash api slash voltage question mark window equals 60, retrieval, and POST for submitting a new reading, creation, even if the POST body is small, rule of thumb: if it fits cleanly in a URL, use GET. If complex or large, use POST. But semantics matter more than size. GET versus POST and URLs.

## 7) URLs as Contract and Debugging

A human should roughly understand slash api slash readings question mark limit equals 10. Readable URLs aid debugging and adoption. When your dashboard uses GET slash api slash voltage question mark limit equals 10, a human can understand it, or your ESP32: slash api slash sensors slash esp32_coop is clearer than slash api slash s question mark i equals 1. A human should roughly understand slash api slash readings question mark limit equals 10. Readable URLs aid debugging and adoption. URLs should be readable.

Clients depend on structure, meaning, and stability. Changing URLs is a breaking change. When your Pi renames slash api slash voltage to slash api slash readings slash voltage, all ESP32s and dashboards that use the old URL break. Clients depend on structure, meaning, and stability. URLs are part of your API contract. Changing URLs is a breaking change.

Phase 0 emphasized identity and state. URLs are identity at the web boundary. They name what exists. When your Pi exposes slash api slash voltage, slash api slash sensors, slash api slash config, URLs name what exists. Phase 0 emphasized identity and state. URLs are identity at the web boundary. They name what exists. Phase 0 revisited: identity.

URLs are input. They must be parsed, validated, and sanitized. Never trust raw URL components. When your Pi receives GET slash api slash sensors slash dot dot percent 2F etc percent 2F passwd, must parse, validate, sanitize, path traversal, or query with malicious values, URLs are input. They must be parsed, validated, sanitized. Never trust raw URL components. Phase 1 revisited: boundaries.

Common URL mistakes include encoding actions in paths, for example slash api slash createReading instead of POST slash api slash readings, overloading queries with logic, for example question mark action equals delete instead of DELETE, inconsistent pluralization, slash api slash sensor versus slash api slash sensors, changing URLs casually, breaking clients and caches, and ignoring encoding, raw spaces or ampersand in query values. When your ESP32 uses GET slash api slash readings question mark action equals delete ampersand id equals 5, action in query, bad. Your Pi exposes slash api slash sensor and slash api slash sensors inconsistently. Clients get confused. Or your dashboard sends question mark name equals Coop space Main without encoding. Server misparses. Common URL mistakes: encode actions in paths, overload queries, inconsistent pluralization, change URLs casually, ignore encoding. Fix by using methods for actions, nouns in paths, and encoding all query values.

When something fails, print the full URL, compare path and query, check encoding, and check trailing slashes. Most bugs are obvious in raw form. When your ESP32 gets four hundred four, print the full URL, check path and query, check encoding and trailing slashes, or your dashboard: compare what you sent versus what the server received. When something fails: print full URL, compare path and query, check encoding, check trailing slashes. Most bugs are obvious in raw form.

Use curl as a URL microscope. For example, curl https colon slash slash example dot com slash api slash readings question mark limit equals 10. Explicit URLs expose intent. When your dashboard debugs with curl http colon slash slash pi dot local slash api slash readings question mark limit equals 10, explicit URL exposes intent, or your ESP32: build and log the full URL. curl as a URL microscope: for example curl https colon slash slash example dot com slash api slash readings question mark limit equals 10. Explicit URLs expose intent.

Browsers encode automatically, normalize URLs, and cache aggressively. APIs should not rely on browser behavior. When your ESP32 does not get browser encoding or normalization, you must encode query values yourself, or your Pi API must accept raw URLs from clients that do not normalize. Browsers encode automatically, normalize URLs, cache aggressively. APIs should not rely on browser behavior.

A URL is just text. It is parsed, interpreted, and mapped. There is no magic. When your dashboard sends http colon slash slash pi dot local slash api slash voltage, it is just text that the Pi parses, interprets, and maps to a handler, or your ESP32: URL is pure data. A URL is just text. It is parsed, interpreted, mapped. There is no magic. URLs are pure data.

Everything builds on URLs: routing, caching, authorization, versioning, logging, and analytics. All depend on URLs being correct. When your Pi routes by path, caches by full URL, Chapter 1.17, authorizes by path, versions by path, logs URLs, analyzes traffic by URL, routing, caching, authorization, versioning, logging, analytics, all depend on URLs being correct. Everything builds on URLs.

## Common Pitfalls

Encoding actions in paths instead of using HTTP methods breaks semantics. Use POST slash api slash readings, not GET slash api slash createReading. Actions belong in methods, not paths.

Overloading query strings with actions breaks HTTP semantics. Use DELETE slash api slash readings slash 123, not GET slash api slash readings question mark action equals delete. Queries are for filters and parameters, not actions.

Inconsistent URL structure confuses clients. Use consistent pluralization, slash api slash sensors, not mixing slash api slash sensor and slash api slash sensors. Pick conventions and stick to them.

Changing URLs without redirects breaks clients and caches. URLs are part of your API contract. Once published, maintain them or provide redirects.

Ignoring URL encoding causes parsing failures. Always encode special characters in query values. Raw spaces and ampersands break parsing.

## Summary

URLs identify resources. Scheme, host, and port define where. Path defines what. Query refines how, filters, pagination, options. Fragments are client-only and never sent to the server. Encoding is mandatory for reserved characters in query and path. Small differences, trailing slash, case, one query parameter, produce different cache entries and different resources. URLs are part of your API contract. Changing them is a breaking change. Stability and readability matter. URLs are pure data, just text that is parsed, interpreted, and mapped. Everything builds on URLs: routing, caching, authorization, versioning, logging, and analytics. Understanding URLs is essential for building robust HTTP systems.

## Next

This chapter built on Chapter 1.7, which covered the request line, and Chapter 1.17, which covered caching and cache keys. Next, Chapter 1.19 explores request bodies and content types, moving beyond URLs into payloads, when data belongs in the body, how Content-Type controls parsing, why bodies change semantics, and how this completes the request model. This is where URLs stop being enough, and the body takes over.
