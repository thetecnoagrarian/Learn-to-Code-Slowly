# Phase 2 · Chapter 2.18: URLs, Paths, and Query Strings

This chapter builds on [Chapter 2.1: Request-Response](Chapter_2.1_Request-Response.md), [Chapter 2.2: HTTP on TCP](Chapter_2.2_HTTP_on_TCP.md), [Chapter 2.3: What HTTP Is](Chapter_2.3_What_HTTP_Is.md), [Chapter 2.4: HTTP as Text](Chapter_2.4_HTTP_as_Text.md), [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.6: Request Structure](Chapter_2.6_Request_Structure.md), [Chapter 2.7: The Request Line](Chapter_2.7_The_Request_Line.md), [Chapter 2.8: Response Structure](Chapter_2.8_Response_Structure.md), [Chapter 2.9: Status Codes Overview](Chapter_2.9_Status_Codes_Overview.md), [Chapter 2.10: Status Codes — Success and Redirects](Chapter_2.10_Status_Codes_Success_and_Redirects.md), [Chapter 2.11: Status Codes — Client and Server Errors](Chapter_2.11_Status_Codes_Client_and_Server_Errors.md), [Chapter 2.12: Errors vs Failures](Chapter_2.12_Errors_vs_Failures.md), [Chapter 2.13: HTTP Methods](Chapter_2.13_HTTP_Methods.md), [Chapter 2.14: Safety and Idempotency](Chapter_2.14_Safety_and_Idempotency.md), [Chapter 2.15: Headers — Overview and Purpose](Chapter_2.15_Headers_Overview.md), [Chapter 2.16: Headers — Content and Type](Chapter_2.16_Headers_Content_and_Type.md), and [Chapter 2.17: Headers — Caching and Control](Chapter_2.17_Headers_Caching_and_Control.md).

URLs answer a deceptively simple question:

“What exactly are we talking about?”

In HTTP, everything starts with identification.
Before methods, before headers, before bodies—there is a URL.

If you misunderstand URLs, everything downstream becomes fuzzy:
	•	Caching breaks
	•	Routing becomes inconsistent
	•	APIs become confusing
	•	Clients and servers disagree about identity

This chapter pins URLs to the floor and dissects them. Chapter 2.7 introduced the request line (method, path, query); Chapter 2.17 showed how the full URL is the cache key. Here we treat URLs as the foundation of identity and addressing—scheme, host, port, path, query, fragment—and why small differences break caching, routing, and contracts. Whether your ESP32 calls `http://pi.local/api/voltage`, your dashboard uses query strings for filters, or your Pi versions paths with `/api/v1/...`, URLs are where identity and addressing collide.



## 1) A URL Is an Address, Not an Action

A URL does not say what to do.
It says what is being referred to.

The method carries intent.
The URL carries identity.

This separation is foundational.

Example: Your ESP32 sends `GET http://pi.local/api/voltage`—the URL identifies the resource (voltage reading), the method carries intent (retrieve). Or your dashboard sends `POST http://pi.local/api/temp`—URL identifies the resource (temp endpoint), method carries intent (submit). A URL is an address, not an action; the method carries intent, the URL carries identity.



## 2) The Canonical URL Structure

A full URL looks like this:

```
scheme://host:port/path?query#fragment
```

Each part has a distinct role.
None are optional conceptually—even if omitted syntactically.

Example: Your dashboard requests `http://pi.local/api/voltage`—scheme (http), host (pi.local), path (/api/voltage); port 80 and empty query/fragment omitted. Or your ESP32 uses `http://192.168.1.10:8080/api/sensors`—explicit port. Full form: scheme://host:port/path?query#fragment; each part has a distinct role.



## 3) Scheme: How to Talk

The scheme defines how the client communicates.

Common schemes:
	•	http
	•	https

The scheme implies:
	•	Transport protocol
	•	Default port
	•	Security expectations

The scheme is not decorative.

Example: Your dashboard uses `https://pi.local/api/config` (TLS) vs `http://pi.local/api/config` (plaintext)—different resource identity for caches and security. Or your ESP32 on the coop uses http to the Pi on the LAN; scheme defines how the client communicates. The scheme is not decorative—it implies transport, default port, and security.



## 4) http vs https
	•	http: plaintext, no encryption
	•	https: HTTP over TLS, encrypted

The rest of the URL may be identical, but the resource identity is different.

From the web’s perspective:

```
http://example.com/data
https://example.com/data
```

are not the same resource.

Example: Your dashboard requests `http://pi.local/api/voltage` vs `https://pi.local/api/voltage`—from a caching and identity perspective, not the same resource. Or your ESP32 uses http to the Pi; if you later add TLS, the URL changes and caches treat it differently. http vs https: rest of URL may be identical, but resource identity is different.



## 5) Host: Who to Talk To

The host identifies which server.

Examples:
	•	example.com
	•	api.example.com
	•	192.168.1.10

The host maps to an IP via DNS (or directly, if already numeric).

Example: Your dashboard uses `http://pi.local/api/voltage`—host pi.local resolves (e.g., mDNS) to your Pi's IP. Or your ESP32 uses `http://192.168.1.10/api/temp`—numeric host, no DNS. Host identifies which server: example.com, api.example.com, 192.168.1.10, or pi.local.



## 6) Host Is Mandatory in HTTP/1.1

In HTTP/1.1, the Host header is required.

Why?
	•	Multiple sites can share one IP
	•	The server needs to know which one you want

This enables virtual hosting.

Example: Your Pi might serve both a dashboard at pi.local and an API at api.pi.local on the same IP—Host header tells it which one you want. Or your ESP32 sends `Host: pi.local` with `GET /api/voltage`; without Host, the Pi couldn't distinguish. Host is mandatory in HTTP/1.1; this enables virtual hosting.



## 7) Port: Which Door

The port identifies which service on the host.

Defaults:
	•	80 for HTTP
	•	443 for HTTPS

Explicit ports override defaults:

```
http://example.com:8080/
```

Different ports = different endpoints.

Example: Your Pi runs the API on port 8080: `http://pi.local:8080/api/voltage`. Your dashboard uses port 80: `http://pi.local/api/voltage`. Different ports = different endpoints—caches and routing treat them separately. Or your solar logger on :9000 vs API on :80.



## 8) Path: What Resource

The path is the primary identifier of the resource on the server.

Examples:
	•	/
	•	/api
	•	/api/voltage
	•	/users/42

The path is hierarchical—but only by convention.

Example: Your Pi exposes `/api/voltage`, `/api/temp`, `/api/sensors/esp32_coop`—path identifies the resource. Or your dashboard uses `/api/readings`, `/api/config`. Path is the primary identifier: /, /api, /api/voltage, /users/42. The path is hierarchical—but only by convention.



## 9) The Server Defines Path Meaning

The server decides:
	•	What paths exist
	•	What they map to
	•	What they mean

The path does not inherently mean “folder” or “file”.

Example: Your Pi maps `/api/voltage` to a function that reads a sensor, not to a file on disk. `/api/sensors/esp32_coop` might be a row in a database or a virtual resource. The server decides what paths exist, what they map to, and what they mean. The path does not inherently mean “folder” or “file.”



## 10) Paths Are Opaque to Clients

Clients should not assume:
	•	File system structure
	•	Database structure
	•	Internal routing logic

A path is a label, not a promise.

Example: Your ESP32 requests `GET /api/sensors/esp32_coop`—don't assume it's a filesystem path or a table name; the Pi defines meaning. Or your dashboard uses `/api/readings`—path is a label. Clients should not assume file system structure, database structure, or internal routing. A path is a label, not a promise.



## 11) Trailing Slashes Matter

These are different URLs:

/api/readings
/api/readings/

Some servers treat them the same.
Some do not.

Consistency matters.

Example: Your Pi might treat `GET /api/readings` and `GET /api/readings/` as the same or different—if your ESP32 sometimes sends one and sometimes the other, caching and routing can break. Or your dashboard: pick one form and stick to it. Trailing slashes: /api/readings vs /api/readings/ are different URLs; consistency matters.



## 12) Paths Are Case-Sensitive (Usually)

By specification, paths are case-sensitive.

Whether a server treats them that way is implementation-specific—but clients must assume they are.

Example: Your ESP32 should treat `GET /api/Voltage` and `GET /api/voltage` as different URLs unless the Pi documents otherwise. Or your dashboard: paths are case-sensitive by spec—/Api/readings and /api/readings can be distinct. Clients must assume paths are case-sensitive.



## 13) Path Segments Encode Hierarchy

Paths are typically segmented by /.

Example:

/users/42/settings

Common interpretation:
	•	users → collection
	•	42 → specific user
	•	settings → sub-resource

This is convention—not enforcement.

Example: Your Pi might use `/api/sensors/esp32_coop/readings`—sensors → collection, esp32_coop → specific sensor, readings → sub-resource. Or `/api/coop/temp`, `/api/pig-barn/temp`. Path segments encode hierarchy by convention (e.g., /users/42/settings); the server defines meaning. This is convention—not enforcement.



## 14) Collections vs Items

A common REST pattern:
	•	/users → collection
	•	/users/42 → specific item

This pattern is widely used because it maps well to mental models.

Example: Your Pi exposes `/api/sensors` (collection) and `/api/sensors/esp32_coop` (specific sensor). Or `/api/readings` vs `/api/readings/123`. Collections vs items: /users → collection, /users/42 → item. Same pattern for sensors, readings, config. This pattern is widely used because it maps well to mental models.



## 15) Paths Should Identify Nouns

Good paths identify things, not actions.

Good:

GET /api/readings
POST /api/readings

Bad:

POST /api/createReading

Actions belong in methods, not paths.

Example: Good: `GET /api/voltage`, `POST /api/temp`—paths identify resources. Bad: `POST /api/createReading`—action in path. Or your dashboard: use `POST /api/readings` with body, not `POST /api/createReading`. Paths should identify nouns; actions belong in methods, not paths.



## 16) The Query String Begins with ?

The query string comes after the path.

Example:

/api/readings?limit=10

Everything after ? is query.

Example: Your dashboard requests `http://pi.local/api/readings?limit=10`—path is /api/readings, query is limit=10. Or your ESP32 uses `GET /api/voltage?unit=V`. The query string begins with ?; everything after ? is query. Example: /api/readings?limit=10.



## 17) Query Strings Are Key–Value Pairs

Format:

key=value&key2=value2

Multiple parameters are separated by &.

Order may matter semantically—but not structurally.

Example: Your dashboard uses `GET /api/readings?limit=10&from=1700&to=1800`—key=value pairs separated by &. Or `?sensor=esp32_coop&unit=F`. Query strings are key–value pairs (key=value&key2=value2); order may matter semantically but not structurally.



## 18) Query Strings Modify, Not Identify

The query usually answers:
	•	How many?
	•	Which subset?
	•	What filters?
	•	What options?

The path identifies what.
The query refines how.

Example: Your dashboard requests `GET /api/readings?limit=10`—path identifies readings, query refines how many. Or `GET /api/voltage?window=60`. Query usually answers: how many? which subset? what filters? what options? The path identifies what; the query refines how. Query strings modify, not identify.



## 19) Same Path, Different Query = Different Resource

These are distinct URLs:

/api/readings?limit=10
/api/readings?limit=100

From a caching and identity perspective, they are different.

Example: Your dashboard requests `GET /api/voltage?window=60` and `GET /api/voltage?window=300`—distinct cache entries (Chapter 2.17). Or your ESP32: /api/temp?unit=F vs /api/temp?unit=C. Same path, different query = different resource; from a caching and identity perspective, they are different.



## 20) Queries Are Common with GET

GET requests commonly encode parameters in the query string.

Why?
	•	GET has no body (by convention)
	•	URLs are bookmarkable
	•	URLs are cacheable

Example: Your dashboard uses `GET /api/voltage?window=60`—parameters in query string, bookmarkable and cacheable. Or your ESP32 uses GET with query for filters. GET commonly encodes parameters in the query string because GET has no body (by convention), URLs are bookmarkable, and URLs are cacheable. Queries are common with GET.



## 21) Queries Can Appear on Other Methods

Technically allowed:

POST /api/readings?source=sensorA

But use carefully.
Overloading query + body can confuse semantics.

Example: Your ESP32 could send `POST /api/temp?source=coop` with a body—technically allowed but mixing query (source) and body (reading) can confuse semantics. Prefer clear split: path + query for identification/filters, body for payload. Queries can appear on other methods; use carefully.



## 22) Query Parameters Are Strings

All query values are strings initially.

The server must:
	•	Parse
	•	Convert
	•	Validate

Phase 0.8: boundaries validate.

Example: Your dashboard sends `GET /api/readings?limit=10`—server parses "10" as integer, validates range. Or your ESP32 sends ?unit=F—server must parse, convert, validate. All query values are strings initially; the server must parse, convert, validate. Phase 0.8: boundaries validate.



## 23) URL Encoding Is Mandatory

Certain characters cannot appear raw in URLs.

Examples:
	•	Space → %20
	•	& → %26
	•	= → %3D
	•	? → %3F

Encoding preserves structure.

Example: Your dashboard requests `GET /api/sensors?name=Coop%20Main`—space encoded as %20. Or ?filter=temp%3E70 (>=). Certain characters cannot appear raw: space → %20, & → %26, = → %3D, ? → %3F. URL encoding is mandatory; encoding preserves structure.



## 24) Encoding Prevents Ambiguity

Without encoding:

?name=Tom & Jerry

This breaks parsing.

With encoding:

?name=Tom%20%26%20Jerry

Structure remains intact.

Example: Without encoding, `?name=Coop & Barn` breaks parsing (space and &). With encoding, `?name=Coop%20%26%20Barn` keeps structure. Or your ESP32 sends sensor names with special characters—must encode. Encoding prevents ambiguity; structure remains intact.



## 25) Clients Must Encode, Servers Must Decode

This is a contract:
	•	Client encodes
	•	Server decodes

Failure on either side breaks communication.

Example: Your dashboard sends `?from=2025-01-30`—client encodes if needed, Pi decodes. If the client sends raw & in a value, the server misparses. Or if the server double-decodes, values break. Clients must encode, servers must decode; failure on either side breaks communication.



## 26) Fragments Are Client-Side Only

The fragment (#section) is not sent to the server.

Example:

/docs/page#install

The server receives:

/docs/page

Fragments are for browsers, not servers.

Example: Your dashboard opens `http://pi.local/dashboard#voltage`—the Pi receives only `GET /dashboard`; the #voltage part is not sent. Or a doc link `docs#install`—server never sees #install. The fragment (#section) is not sent to the server; fragments are for browsers, not servers.



## 27) Fragments Do Not Affect HTTP Requests

No matter what comes after #, the request is identical.

This is important for APIs and caching.

Example: Your ESP32 requests `GET http://pi.local/api/voltage#ignore`—request is the same as without #ignore; cache key and server see only /api/voltage. No matter what comes after #, the request is identical. This is important for APIs and caching. Fragments do not affect HTTP requests.



## 28) URLs as Cache Keys

Caches typically key on:
	•	Scheme
	•	Host
	•	Port
	•	Path
	•	Query

Fragments are ignored.

Example: Your dashboard requests `GET /api/voltage?window=60` and `GET /api/voltage?window=60#chart`—same cache entry (fragment ignored). Caches key on scheme, host, port, path, query; fragments are ignored. URLs as cache keys (Chapter 2.17): fragments are ignored.



## 29) Small URL Differences Matter

These are distinct:

/api/data
/api/data/
/api/data?x=1
/api/data?x=1&y=2

Each is a different cache entry.

Example: Your dashboard: /api/voltage, /api/voltage/, /api/voltage?x=1, /api/voltage?x=1&y=2—each distinct for caching. Or your ESP32: small differences in path or query change cache key. Small URL differences matter; each is a different cache entry.



## 30) URL Design Affects Caching

Poor URL design leads to:
	•	Cache misses
	•	Duplicate data
	•	Hard-to-debug behavior

URL stability matters.

Example: Your Pi today uses /api/voltage; if you rename it to /api/v1/voltage next week without redirects, your ESP32 and dashboard break. Poor URL design leads to cache misses, duplicate data, hard-to-debug behavior. URL design affects caching; URL stability matters.



## 31) Stable URLs Are a Feature

Once published, URLs should:
	•	Change rarely
	•	Be predictable
	•	Be documented

Breaking URLs breaks clients.

Example: Your ESP32 is hardcoded to `GET /api/voltage`; if you change the path, all devices break. Or your dashboard bookmarks /api/config. Once published, URLs should change rarely, be predictable, and be documented. Breaking URLs breaks clients. Stable URLs are a feature.



## 32) Versioning and URLs

Common patterns:

/v1/api/readings
/api/v1/readings

Versioning in the path is explicit and cache-friendly.

Example: Your Pi uses `/api/v1/voltage` or `/v1/api/voltage`—version in path is explicit and cache-friendly (different paths = different cache entries). Or your dashboard: /v1/api/readings vs /v2/api/readings. Versioning and URLs: /v1/api/readings or /api/v1/readings.



## 33) Alternatives to Path Versioning

Other approaches:
	•	Version in header
	•	Version in Accept
	•	Version in query

Each has tradeoffs.

Example: Version in header (e.g., Accept), in query (?version=1), or in path (/v1/api/voltage)—path is visible and cache-safe; header/query keep path stable but are less visible. Alternatives to path versioning: version in header, Accept, or query. Each has tradeoffs.



## 34) Why Path Versioning Is Common

Because:
	•	Visible
	•	Simple
	•	Cache-safe
	•	Explicit

Downside: URL churn.

Example: Your Pi adds /v2/api/voltage—old clients stay on /v1, new clients use /v2; you maintain two paths. Why path versioning is common: visible, simple, cache-safe, explicit. Downside: URL churn when you add versions.



## 35) Query Strings for Filtering

Example:

/api/readings?from=1700&to=1800

This keeps the resource identity clear while adding parameters.

Example: Your dashboard requests `GET /api/readings?from=1700&to=1800`—path identifies readings, query adds time range. Or your ESP32: /api/temp?unit=F. Query strings for filtering keep resource identity clear while adding parameters. Example: /api/readings?from=1700&to=1800.



## 36) Query Strings for Pagination

Common patterns:

?page=2&limit=50
?offset=100&limit=50

Pagination belongs in query, not path.

Example: Your dashboard uses `GET /api/readings?page=2&limit=50` or `?offset=100&limit=50`. Or your Pi serves sensor history with ?page=1&limit=100. Pagination belongs in query, not path. Common patterns: ?page=2&limit=50, ?offset=100&limit=50.



## 37) Query Strings for Search

Example:

/api/users?search=alice

Search is an operation—but still a retrieval.

Example: Your dashboard uses `GET /api/sensors?search=coop`—search is a retrieval, so GET with query is appropriate. Or `GET /api/readings?search=high`. Query strings for search: e.g. /api/users?search=alice. Search is an operation—but still a retrieval.



## 38) Avoid Encoding Actions in Queries

Bad:

/api/readings?action=delete

Use the method instead.

Example: Bad: `GET /api/readings?action=delete`—action in query. Good: `DELETE /api/readings/123`. Or your ESP32: use DELETE method, not GET with ?action=delete. Avoid encoding actions in queries; use the method instead.



## 39) URL Length Limits Exist

Browsers and servers impose limits.

Long queries can:
	•	Break proxies
	•	Break logs
	•	Break caches

Use bodies when data is large.

Example: Your dashboard sending 50 filter parameters—prefer POST with body instead of a huge query string. Or your ESP32: long query strings can break proxies, logs, caches. URL length limits exist; use bodies when data is large.



## 40) GET vs POST and URLs

Rule of thumb:
	•	If it fits cleanly in a URL → GET
	•	If it’s complex or large → POST

But semantics matter more than size.

Example: Your dashboard uses GET for `GET /api/voltage?window=60` (retrieval) and POST for submitting a new reading (creation)—even if the POST body is small. Rule of thumb: if it fits cleanly in a URL → GET; if complex or large → POST. But semantics matter more than size. GET vs POST and URLs.



## 41) URLs Should Be Readable

A human should roughly understand:

/api/readings?limit=10

Readable URLs aid debugging and adoption.

Example: Your dashboard uses `GET /api/voltage?limit=10`—a human can understand it. Or your ESP32: /api/sensors/esp32_coop is clearer than /api/s?i=1. A human should roughly understand /api/readings?limit=10. Readable URLs aid debugging and adoption. URLs should be readable.



## 42) URLs Are Part of Your API Contract

Clients depend on:
	•	Structure
	•	Meaning
	•	Stability

Changing URLs is a breaking change.

Example: Your Pi renames /api/voltage to /api/readings/voltage—all ESP32s and dashboards that use the old URL break. Clients depend on structure, meaning, and stability. URLs are part of your API contract; changing URLs is a breaking change.



## 43) Phase 0 Revisited: Identity

Phase 0 emphasized identity and state.

URLs are identity at the web boundary.

They name what exists.

Example: Your Pi exposes /api/voltage, /api/sensors, /api/config—URLs name what exists. Phase 0 emphasized identity and state; URLs are identity at the web boundary. They name what exists. Phase 0 revisited: identity.



## 44) Phase 1 Revisited: Boundaries

URLs are input.

They must be:
	•	Parsed
	•	Validated
	•	Sanitized

Never trust raw URL components.

Example: Your Pi receives `GET /api/sensors/..%2fetc%2fpasswd`—must parse, validate, sanitize (path traversal). Or query with malicious values. URLs are input; they must be parsed, validated, sanitized. Never trust raw URL components. Phase 1 revisited: boundaries.



## 45) Common URL Mistakes
	•	Encoding actions in paths (e.g., `/api/createReading` instead of `POST /api/readings`)
	•	Overloading queries with logic (e.g., `?action=delete` instead of `DELETE`)
	•	Inconsistent pluralization (`/api/sensor` vs `/api/sensors`)
	•	Changing URLs casually (breaking clients and caches)
	•	Ignoring encoding (raw spaces or `&` in query values)

Example: Your ESP32 uses `GET /api/readings?action=delete&id=5`—action in query, bad. Your Pi exposes `/api/sensor` and `/api/sensors` inconsistently—clients get confused. Or your dashboard sends `?name=Coop Main` without encoding—server misparses. Common URL mistakes: encode actions in paths, overload queries, inconsistent pluralization, change URLs casually, ignore encoding. Fix by using methods for actions, nouns in paths, and encoding all query values.



## 46) Debugging URLs

When something fails:
	•	Print the full URL
	•	Compare path and query
	•	Check encoding
	•	Check trailing slashes

Most bugs are obvious in raw form.

Example: Your ESP32 gets 404—print the full URL, check path and query, check encoding and trailing slashes. Or your dashboard: compare what you sent vs what the server received. When something fails: print full URL, compare path and query, check encoding, check trailing slashes. Most bugs are obvious in raw form.



## 47) curl as a URL Microscope

Example:

curl "https://example.com/api/readings?limit=10"

Explicit URLs expose intent.

Example: Your dashboard debugs with `curl "http://pi.local/api/readings?limit=10"`—explicit URL exposes intent. Or your ESP32: build and log the full URL. curl as a URL microscope: e.g. curl "https://example.com/api/readings?limit=10". Explicit URLs expose intent.



## 48) Browsers Hide Complexity

Browsers:
	•	Encode automatically
	•	Normalize URLs
	•	Cache aggressively

APIs should not rely on browser behavior.

Example: Your ESP32 does not get browser encoding or normalization—you must encode query values yourself. Or your Pi API must accept raw URLs from clients that don't normalize. Browsers encode automatically, normalize URLs, cache aggressively; APIs should not rely on browser behavior.



## 49) URLs Are Pure Data

A URL is just text.

It is parsed.
It is interpreted.
It is mapped.

There is no magic.

Example: Your dashboard sends `http://pi.local/api/voltage`—it's just text that the Pi parses, interprets, and maps to a handler. Or your ESP32: URL is pure data. A URL is just text; it is parsed, interpreted, mapped. There is no magic. URLs are pure data.



## 50) Everything Builds on URLs

Routing
Caching
Authorization
Versioning
Logging
Analytics

All depend on URLs being correct.

Example: Your Pi routes by path, caches by full URL (Chapter 2.17), authorizes by path, versions by path, logs URLs, analyzes traffic by URL. Routing, caching, authorization, versioning, logging, analytics—all depend on URLs being correct. Everything builds on URLs.



## Reflection

Think about real endpoints—your dashboard calling `GET /api/voltage?window=60`, your ESP32 posting to `POST /api/temp`, your Pi serving `/api/sensors` and `/api/sensors/esp32_coop`.
	•	Pick one endpoint you use often. What is the path?
	•	What goes in the query?
	•	Is it stable?
	•	Is it readable?
	•	Would caching behave as expected?

Consider failure modes:
	•	Your ESP32 sends `GET /api/Voltage` but the Pi only has `/api/voltage`—404 or redirect depending on server. Path case sensitivity: clients must assume case-sensitive; one typo breaks routing and caching.
	•	Your dashboard bookmarks `http://pi.local/api/readings?limit=10` but you later rename the path to `/api/v1/readings`—bookmark breaks, cached responses no longer apply. Stable URLs are a feature; breaking URLs breaks clients.
	•	Your ESP32 sends `GET /api/sensors?name=Coop & Barn` without encoding—the `&` splits the query, server sees `name=Coop ` and a broken parameter. Encoding is mandatory; raw spaces and `&` break parsing.
	•	Your Pi serves `GET /api/readings` and `GET /api/readings/` differently (one 200, one 404)—your dashboard sometimes uses one, sometimes the other, so caching and behavior are inconsistent. Trailing slash consistency matters; pick one form and stick to it.
	•	Your dashboard uses `GET /api/readings?action=delete&id=123` instead of `DELETE /api/readings/123`—wrong method, wrong semantics, caches and proxies may cache a "delete" URL. Actions belong in methods, not in paths or queries.

If you can explain path vs query, encoding, and how small URL differences affect caching and routing, you understand URLs as identity and contract.



## Core Understanding

URLs identify resources. Scheme, host, and port define *where*; path defines *what*; query refines *how* (filters, pagination, options). Fragments are client-only and never sent to the server. Encoding is mandatory for reserved characters in query and path. Small differences (trailing slash, case, one query parameter) produce different cache entries and different resources—so URLs are part of your API contract. Changing them is a breaking change; stability and readability matter.

This chapter builds on Chapter 2.7 (request line) and Chapter 2.17 (caching and cache keys). Next: Chapter 2.19 — Request Bodies and Content Types, where we move beyond URLs into payloads—when data belongs in the body, how Content-Type controls parsing, why bodies change semantics, and how this completes the request model. This is where URLs stop being enough—and the body takes over.