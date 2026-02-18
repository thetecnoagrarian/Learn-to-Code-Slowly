# Section B Phase 1 · Chapter 1.17: Headers — Caching and Control

## Learning Objectives

After this chapter, you will be able to:
- Understand why caching exists and how it makes HTTP efficient
- Use Cache-Control directives to control caching behavior
- Implement validation using ETags and conditional requests
- Distinguish between freshness-based and validation-based caching
- Design caching policies for different types of data
- Debug caching issues using headers and tools

## Key Terms

- **Cache-Control**: Header that defines caching policy with directives
- **max-age**: Cache-Control directive that specifies freshness lifetime in seconds
- **no-cache**: Cache-Control directive that requires revalidation before use
- **no-store**: Cache-Control directive that prohibits storing the response
- **ETag**: Response header that provides an opaque identifier for validation
- **If-None-Match**: Request header used for conditional requests with ETags
- **304 Not Modified**: Status code indicating cached version is still valid
- **Freshness**: Time-based validity of cached data
- **Validation**: Process of checking if cached data is still current

## 1) Why Caching Exists

Caching exists to answer one simple question: do I really need to send this again? HTTP does not assume the answer. Instead, it negotiates explicitly using headers. Caching is not magic. It is a contract between client and server, enforced entirely through metadata.

Chapter 1.15 introduced headers as HTTP's control surface. Chapter 1.16 showed how headers turn bytes into meaning. This chapter focuses on caching headers, Cache-Control, ETag, If-None-Match, that make HTTP efficient. Whether your dashboard caches voltage readings, your ESP32 validates sensor data, or your Pi controls cache freshness, caching is a negotiated contract enforced through headers.

Without caching, every request hits the server, every response sends full content, latency increases, load increases, and bandwidth is wasted. With caching, clients reuse data, servers do less work, networks move fewer bytes, and systems scale. Caching is an optimization, but a powerful one. When your dashboard requests a GET to the voltage API every second, without caching your Pi handles every request and sends full response each time. Latency increases, load increases, bandwidth wasted. With caching using Cache-Control max-age equals sixty, your dashboard reuses data for sixty seconds. Pi does less work, network moves fewer bytes, system scales. Or your ESP32 requests a GET to the config API. Caching reduces load on your Pi. Caching is an optimization, but a powerful one.

Caching is a boundary concern. Caching is a boundary decision: what crosses the boundary again, what is reused, what must be revalidated. Caching is never implicit. It is always negotiated. When your ESP32 sends a GET request to the temperature API from the coop, your Pi responds with Cache-Control max-age equals three hundred. Boundary decision: what crosses the boundary again, what is reused, what must be revalidated. Caching is never implicit. Pi declares rules via headers, ESP32 decides accordingly. Or your dashboard requests voltage. Pi negotiates caching policy via headers. Caching is a boundary concern. Always negotiated, never implicit.

HTTP caching is declarative. HTTP does not say cache this. It says here are the rules, decide accordingly. Headers declare intent. Clients, proxies, and browsers enforce it. When your Pi responds to a GET request to the voltage API with Cache-Control max-age equals sixty, HTTP does not say cache this. It says here are the rules, fresh for sixty seconds, decide accordingly. Your dashboard enforces it, reuses data for sixty seconds. Or your ESP32 receives Cache-Control no-cache. Must revalidate. Headers declare intent. Clients, proxies, browsers enforce it. HTTP caching is declarative.

## 2) Cache-Control Directives

Cache-Control is the main header for caching policy. It appears in responses, what may be cached, and requests, what the client is willing to accept. It contains directives. When your Pi responds to a GET request to the voltage API with Cache-Control max-age equals sixty comma public, or responds to a GET request to the config API with Cache-Control no-cache comma must-revalidate, Cache-Control is the primary tool. Appears in responses, what may be cached, and requests, what client accepts. It contains directives: max-age, no-cache, public, private, must-revalidate.

Cache-Control directives are instructions. Examples include max-age equals three thousand six hundred, fresh for three thousand six hundred seconds, no-cache, revalidate before using, no-store, do not store anywhere, must-revalidate, check server when stale, public, may be cached by shared caches, and private, only end client may cache. Each directive changes caching behavior. When your Pi responds to a GET request to the voltage API with Cache-Control max-age equals sixty comma public, two directives: max-age for freshness, public for shared cache allowed. Or responds with Cache-Control no-cache comma must-revalidate. Revalidate before using, check server when stale. Cache-Control directives are instructions. Each directive changes caching behavior. Combine them for precise control.

Max-age equals three thousand six hundred means this response is fresh for three thousand six hundred seconds. While fresh, the client may reuse it, no server contact required, no validation required. This is strong caching. When your Pi responds to a GET request to the voltage API with Cache-Control max-age equals sixty, your dashboard reuses the response for sixty seconds. No server contact, no validation, just reuse. Or your ESP32 requests a GET to the config API with max-age equals three thousand six hundred. Reuses for one hour. Max-age equals three thousand six hundred means fresh for three thousand six hundred seconds. While fresh, client may reuse it without asking server. This is strong caching.

Freshness answers is this data still valid right now? If yes, use cache. If no, revalidate or refetch. Freshness is about time, not correctness. When your dashboard requests a GET to the voltage API and gets Cache-Control max-age equals sixty, after thirty seconds data is fresh, use cache. After seventy seconds data is stale, revalidate or refetch. Freshness answers is this data still valid right now? It is about time, sixty seconds passed, not correctness, is voltage reading accurate. Or your ESP32 checks freshness. Time-based validity, not correctness check.

No-cache does not mean do not cache. This is a common mistake. No-cache means you may store this, but you must revalidate before using it. The data can be cached, but not trusted without checking. When your Pi responds to a GET request to the voltage API with Cache-Control no-cache, your dashboard may store it, but must revalidate before using it. Ask Pi is this still valid before reusing. Or your ESP32 receives no-cache. Can cache, but must check with server first. No-cache does not mean do not cache. It means cache, but revalidate before using. The data can be cached, but not trusted without checking.

No-store means do not store this anywhere. Not in browser cache, disk cache, proxy cache, or memory cache. Used for credentials, personal data, and sensitive responses. When your ESP32 sends a POST request to the login API and receives Cache-Control no-store, your ESP32 must not store this anywhere. Not browser cache, disk cache, proxy cache, memory cache. Or your dashboard receives authentication token with no-store. Must not cache credentials. No-store means do not store this anywhere. Used for credentials, personal data, sensitive responses.

Public means may be cached by shared caches, proxies, CDNs. Private means only the end client may cache it. Important for authenticated responses. When your ESP32 requests a GET to the sensors API with Authorization Bearer followed by a token, your Pi responds with Cache-Control private. Only the ESP32 may cache it, not shared caches, proxies, CDNs. Or your dashboard gets authenticated response with public. May be cached by shared caches. Public versus private. Public: may be cached by shared caches. Private: only end client may cache. Important for authenticated responses. Prevent leaks.

Must-revalidate means when this becomes stale, you must check with the server. No heuristic reuse. No stale usage. When your Pi responds to a GET request to the voltage API with Cache-Control must-revalidate, when data becomes stale your dashboard must check with Pi. No heuristic reuse, no stale usage. Or your ESP32 receives must-revalidate. When stale, must revalidate, cannot use stale data. Must-revalidate means when this becomes stale, you must check with the server. No heuristic reuse, no stale usage.

Clients can send Cache-Control too. Examples include Cache-Control no-cache, I want fresh data, and Cache-Control max-age equals zero, treat as stale immediately. Clients can override freshness preferences. When your dashboard sends a GET request to the voltage API with Cache-Control no-cache, wants fresh data, even if cached copy is fresh. Or sends Cache-Control max-age equals zero. Treat as stale immediately, force revalidation. Or your ESP32 sends no-cache. Overrides server freshness preferences. Clients can send Cache-Control too. Override freshness preferences, force revalidation.

Caching is not unilateral. The server proposes. The client decides. Intermediaries enforce. This is negotiation, not command. When your Pi responds to a GET request to the voltage API with Cache-Control max-age equals sixty, proposes sixty seconds, your dashboard decides. May reuse for sixty seconds, or may send Cache-Control no-cache to override. Or your ESP32 negotiates. Server proposes, client decides, intermediaries enforce. Caching is not unilateral. Server proposes, client decides, intermediaries enforce. This is negotiation, not command.

## 3) Validation and ETags

Two strategies exist: freshness-based, use cached copy without asking, and validation-based, ask server is this still valid? HTTP supports both. Validation requires identifiers. To validate cached data, the client needs a way to ask has this changed? That requires identifiers. When your dashboard has cached voltage reading with ETag v123, to validate it needs to ask Pi has voltage changed? Requires identifier, ETag v123. Or your ESP32 has cached config. Needs identifier to validate. Validation requires identifiers. Client needs a way to ask has this changed? That requires identifiers, ETag, Last-Modified.

An ETag is a fingerprint of the response body. For example, ETag abc123. If the content changes, the ETag should change. When your Pi responds to a GET request to the voltage API with ETag v123, if voltage reading changes ETag should change to v124. Or your ESP32 requests config. Pi responds with ETag. If config changes, ETag changes. ETag is a fingerprint of the response body. If content changes, ETag should change. Example: ETag abc123. Opaque identifier, changes when content changes.

ETags are opaque. Clients must not interpret ETags. They are opaque identifiers, only meaningful to the server, compared for equality only. When your Pi responds with ETag v123, your dashboard must not interpret it. Do not assume it is a version number, do not parse it, just compare for equality. Or your ESP32 receives ETag abc123. Opaque identifier, only meaningful to Pi. ETags are opaque. Clients must not interpret them, only compare for equality. They are opaque identifiers, only meaningful to the server.

Strong ETag is ETag abc123. Weak ETag is ETag W slash abc123. Weak means semantically equivalent, not byte-identical.

If-None-Match is a validation request. Client sends If-None-Match abc123. Meaning: I have this version. Has it changed? Server checks: does current ETag equal the one provided? If yes, unchanged. If no, changed. When your dashboard sends a GET request to the voltage API with If-None-Match v123, your Pi checks. Current ETag is v123? Yes, unchanged, respond three hundred four Not Modified. Or current ETag is v124? No, changed, respond two hundred OK with new content. Server validation logic. Check if current ETag equals provided ETag. If yes, unchanged. If no, changed.

If unchanged, server responds three hundred four Not Modified. No body, minimal headers, client reuses cached copy. This is a successful response. When your dashboard sends a GET request to the voltage API with If-None-Match v123, your Pi checks. Current ETag is still v123, responds three hundred four Not Modified, no body, minimal headers. Dashboard reuses cached copy. Or your ESP32 validates. Pi responds three hundred four, ESP32 reuses cache. Three hundred four Not Modified. No body, minimal headers, client reuses cached copy. This is a successful response. Saves bandwidth and time.

Three hundred four means your cached version is still valid. It saves bandwidth and time. When your dashboard validates cached voltage reading, Pi responds three hundred four Not Modified, dashboard reuses cache. Saves bandwidth, no body transfer, saves time, no parsing. Or your ESP32 validates config. Three hundred four response, reuses cache. Three hundred four means your cached version is still valid. It saves bandwidth and time. Not an error, successful validation.

If changed, server returns two hundred OK, includes full body, includes new ETag. Client replaces cache. When your dashboard sends a GET request to the voltage API with If-None-Match v123, your Pi checks. Voltage changed, ETag is now v124, responds two hundred OK with full body and new ETag v124. Dashboard replaces cache. Or your ESP32 validates. Pi responds two hundred OK with new content, ESP32 replaces cache. If changed, server returns two hundred OK, includes full body, includes new ETag. Client replaces cache.

If-Modified-Since is an older validation mechanism. Client sends If-Modified-Since followed by a timestamp. Server compares timestamps. When your dashboard sends a GET request to the voltage API with If-Modified-Since followed by a timestamp, has cached version from this timestamp, asks Pi has it changed since then? Or your ESP32 sends If-Modified-Since. Server compares timestamps. If-Modified-Since is older validation mechanism. Client sends timestamp, server compares. ETags are more reliable.

Limitations of If-Modified-Since include time resolution issues, sub-second changes, clock skew, server and client clocks differ, and files changing without timestamp change, content changes, timestamp does not. ETags are more reliable. When your Pi's voltage reading changes twice in one second, If-Modified-Since may miss the second change, time resolution issue. Or server clock differs from client clock. Clock skew causes wrong validation. Or content changes but timestamp does not. If-Modified-Since fails. Limitations of If-Modified-Since. Time resolution issues, clock skew, files changing without timestamp change. ETags are more reliable.

Many servers send both ETag and Last-Modified and accept both validation headers. ETag usually takes precedence. When your Pi responds to a GET request to the voltage API with both ETag v123 and Last-Modified followed by a timestamp, your dashboard may send either If-None-Match v123 or If-Modified-Since followed by a timestamp. Pi accepts both, but ETag usually takes precedence. Or your ESP32 validates. Pi supports both, ETag preferred. Servers may support both. Send both ETag and Last-Modified, accept both validation headers. ETag usually takes precedence.

Requests with If-None-Match or If-Modified-Since are conditional requests. They ask only send the body if something changed. Conditional requests reduce load. Benefits include no body transfer if unchanged, minimal server work, and faster responses. This is critical at scale. When your dashboard requests voltage every second, without conditional requests Pi sends full body every time. Bandwidth wasted, server load high. With If-None-Match, Pi responds three hundred four most times. No body transfer, minimal server work, faster responses. Or your ESP32 validates config. Conditional requests reduce load. Conditional requests reduce load. No body transfer if unchanged, minimal server work, faster responses. This is critical at scale.

## 4) Caching and HTTP Methods

HTTP is stateless, but caching adds client-side memory. The server does not remember. The client does. State exists, but outside the server. When your Pi does not remember your dashboard's previous requests, HTTP is stateless. But your dashboard caches voltage readings. Client-side memory. Or your ESP32 caches config. State exists, but outside the server. Caching and statelessness. HTTP is stateless, server does not remember, but caching adds client-side memory, client remembers. State exists, but outside the server.

Caching is safe because of idempotency. GET is safe and idempotent. This allows caching. POST generally is not cached. When your ESP32 sends a GET request to the voltage API, safe and idempotent, can be cached. Or sends a GET request to the config API. Cacheable. But sends a POST request to the temperature API. Not safe, not idempotent, generally not cached. Caching is safe because of idempotency. GET is safe and idempotent, allows caching. POST generally is not cached. Not safe, not idempotent.

Typically cacheable methods include GET, safe and idempotent, and HEAD, safe and idempotent. POST is rarely cacheable, explicitly allowed only, not safe, not idempotent. Never by default: PUT, not safe, PATCH, not safe, and DELETE, not safe. When your ESP32 sends a GET request to the voltage API, cacheable, safe and idempotent. Or sends a GET request to the config API. Cacheable. But sends a POST request to the temperature API. Not cacheable by default, not safe, not idempotent. Which methods are cacheable? Typically GET and HEAD, safe and idempotent. POST rarely, explicitly allowed only. PUT, PATCH, DELETE never by default, not safe.

## 5) Cache Keys and URLs

Cache-Control applies per response. Caching rules are tied to a specific response, to a specific URL. Changing the URL changes the cache key. When your Pi responds to a GET request to the voltage API with Cache-Control max-age equals sixty, caching rules tied to this URL. Or responds to a GET request to the config API with Cache-Control max-age equals three thousand six hundred. Different URL, different caching rules. Cache-Control applies per response. Caching rules tied to specific response, specific URL. Changing the URL changes the cache key.

URLs are cache keys. The cache key includes scheme, http versus https, host, pi dot local versus example dot com, path, slash api slash voltage versus slash api slash config, and query string, question mark window equals sixty versus question mark window equals three hundred. Different query strings equal different cache entries. When your dashboard requests GET http colon slash slash pi dot local slash api slash voltage question mark window equals sixty, cache key includes scheme http, host pi dot local, path slash api slash voltage, query string question mark window equals sixty. Or requests GET http colon slash slash pi dot local slash api slash voltage question mark window equals three hundred. Different query string, different cache entry. URLs are cache keys. Cache key includes scheme, host, path, query string. Different query strings equal different cache entries.

Query strings and caching. Slash api slash voltage question mark window equals sixty and slash api slash voltage question mark window equals three hundred are distinct cache entries. When your dashboard requests GET slash api slash voltage question mark window equals sixty and GET slash api slash voltage question mark window equals three hundred, these are distinct cache entries. Different query strings, different cache keys. Or your ESP32 requests slash api slash temp question mark unit equals F and slash api slash temp question mark unit equals C. Distinct cache entries. Query strings are part of cache key. Slash api slash voltage question mark window equals sixty and slash api slash voltage question mark window equals three hundred are distinct cache entries.

## 6) Shared Caches and Security

Shared caches include CDNs, Content Delivery Networks, reverse proxies, load balancers, and corporate proxies, enterprise networks. They obey Cache-Control too. When your dashboard requests a GET to the voltage API through a CDN, the CDN, shared cache, obeys Cache-Control public comma max-age equals sixty. May cache and serve to other clients. Or your ESP32 requests through a reverse proxy. Proxy obeys Cache-Control. Proxies and shared caches. CDNs, reverse proxies, corporate proxies. They obey Cache-Control too. Shared caches respect caching headers.

Authenticated responses often include user-specific data and must not be shared. Use private to prevent leaks. When your ESP32 requests a GET to the sensors API with Authorization Bearer followed by a token, your Pi responds with Cache-Control private. Only ESP32 may cache it, not shared caches. Prevents user-specific data from leaking to other clients. Or your dashboard gets authenticated response. Use private to prevent leaks. Authenticated responses often include user-specific data, must not be shared. Use private to prevent leaks.

Browsers may cache even without explicit headers, heuristic caching, guess freshness, for example ten percent of age, and apply heuristics, for example cache images longer than HTML. APIs should not rely on this. When your dashboard, browser, may cache GET to the voltage API even without Cache-Control, browser heuristics guess freshness. Or browser caches images longer than HTML. Heuristic behavior. Browser heuristics, danger zone. Browsers may cache without explicit headers, guess freshness, apply heuristics. APIs should not rely on this. Be explicit, do not rely on browser heuristics.

APIs should be explicit. Best practice: always set Cache-Control, always set ETag if cacheable, and be explicit about freshness. Explicit beats clever. When your Pi API always sets Cache-Control max-age equals sixty for voltage readings, explicit freshness policy. Or sets ETag v123 for validation. Explicit validation. Or your ESP32 API sets explicit caching headers. No relying on browser heuristics. APIs should be explicit. Always set Cache-Control, always set ETag if cacheable, be explicit about freshness. Explicit beats clever.

## 7) Caching Dynamic Data

Not all dynamic data is uncacheable. Examples include sensor data updated once per minute and config data updated hourly. Short max-age plus validation works well. When your Pi responds to a GET request to the voltage API with Cache-Control max-age equals five and ETag v123, sensor data updated once per minute. Short max-age, five seconds, plus validation, ETag, works well. Or config data updated hourly. Short max-age plus validation. Not all dynamic data is uncacheable. Sensor data updated once per minute, config data updated hourly. Short max-age plus validation works well.

Sensor API example. Server response: Cache-Control max-age equals five and ETag v123. Clients reuse data for five seconds, then revalidate. Low latency, low load. When your Pi responds to a GET request to the voltage API with Cache-Control max-age equals five and ETag v123, your dashboard reuses data for five seconds, then revalidates with If-None-Match v123. Low latency, reuse cache, low load, revalidate, not refetch. Or your ESP32 requests sensor data. Short max-age plus validation. Sensor API example. Short freshness, validation enabled.

Client override for freshness. Client sends Cache-Control no-cache. Meaning: I want to revalidate even if fresh. Useful for dashboards. When your dashboard sends a GET request to the voltage API with Cache-Control no-cache, wants to revalidate even if cached copy is fresh. Useful for dashboards. Always show latest data. Or your ESP32 sends no-cache. Force revalidation. Client override for freshness. Client sends Cache-Control no-cache, meaning I want to revalidate even if fresh. Useful for dashboards.

Stale data is sometimes acceptable. Design decision: is slightly stale data OK, or must it always be fresh? Caching policy encodes this decision. When your dashboard shows voltage readings, is slightly stale data OK? If yes, use max-age equals sixty. If no, use no-cache. Or your ESP32 requests config. Must always be fresh? Use no-cache. Stale data is sometimes acceptable. Design decision: is slightly stale data OK, or must it always be fresh? Caching policy encodes this decision.

Some caches support Cache-Control max-age equals sixty comma stale-while-revalidate equals three hundred. Serve stale data while revalidating in background. Advanced but powerful. When your Pi responds to a GET request to the voltage API with Cache-Control max-age equals sixty comma stale-while-revalidate equals three hundred, your dashboard may serve stale data, after sixty seconds, while revalidating in background, up to three hundred seconds. Or your ESP32 receives stale-while-revalidate. Serve stale while revalidating. Stale-while-revalidate, advanced. Some caches support serving stale data while revalidating in background. Advanced but powerful.

Caching affects consistency, user experience, load, cost, and correctness. It is architectural. When your Pi's caching policy affects consistency, how fresh is data, user experience, fast or slow, load, high or low, cost, bandwidth, correctness, stale data bugs, or your ESP32's caching affects system architecture. Caching affects consistency, user experience, load, cost, correctness. It is architectural, not just performance.

## 8) Caching Bugs and Debugging

Common caching bugs include forgetting to invalidate, wrong cache key, missing private directive, and overly long max-age. These bugs persist invisibly. When your Pi forgets to invalidate cache when voltage changes, dashboard shows stale data, bug persists invisibly. Or wrong cache key. ESP32 gets wrong cached data. Or missing private directive. Authenticated data leaks. Or overly long max-age. Stale data shown too long. Common caching bugs. Forgetting to invalidate, wrong cache key, missing private directive, overly long max-age. These bugs persist invisibly.

Caching invariants include content must match ETag, cache rules must be honored, and validation must be correct. Breaking invariants creates ghosts. When your Pi responds with ETag v123 but content does not match, breaks invariant, creates ghosts, stale data, wrong validation. Or cache rules not honored. Data cached when should not be. Or validation incorrect. Three hundred four when should be two hundred. Caching invariants. Content must match ETag, cache rules must be honored, validation must be correct. Breaking invariants creates ghosts.

When debugging, inspect Cache-Control, what is the policy, inspect ETag, what is the identifier, inspect three hundred four versus two hundred, validation working, and disable cache temporarily, see fresh data. Caching hides mistakes. When your dashboard shows stale voltage, inspect Cache-Control, is max-age too long, inspect ETag, is validation working, inspect three hundred four versus two hundred, is Pi responding correctly, disable cache temporarily, see fresh data. Or your ESP32 debugging. Inspect caching headers. Debugging caching. Inspect Cache-Control, ETag, three hundred four versus two hundred, disable cache temporarily. Caching hides mistakes. Debug carefully.

Use curl with dash I to inspect headers only. When your dashboard debugs caching, use curl dash I http colon slash slash pi dot local slash api slash voltage to inspect headers only, Cache-Control, ETag. Or your ESP32 debugs. Inspect headers without body. curl is your friend. curl dash I inspects headers only, shows caching policy. Useful for debugging caching.

Browser dev tools show cached versus network, three hundred four responses, and timing. Learn to read them. When your dashboard uses browser dev tools, Network tab shows cached versus network, three hundred four responses, timing. Or your ESP32 debugging. Inspect caching behavior. Browser dev tools show cached versus network, three hundred four responses, timing. Learn to read them. Useful for debugging caching.

Caching is optional but powerful. You can build systems without caching. But systems that scale well use it intentionally. When your Pi API can work without caching, every request hits server, every response sent, but systems that scale well use caching intentionally. Your dashboard caches voltage readings, ESP32 caches config. Caching is optional but powerful. You can build systems without it, but systems that scale well use it intentionally.

## Common Pitfalls

Confusing no-cache with no-store breaks caching behavior. No-cache means cache but revalidate. No-store means do not store anywhere. Understanding the difference is critical for correct caching.

Forgetting to set ETag for cacheable resources prevents validation. Without ETags, clients cannot efficiently check if data changed. Always include ETag for cacheable GET responses.

Using public for authenticated responses leaks user data. Authenticated responses should use private to prevent shared caches from serving user-specific data to other clients.

Setting max-age too long causes stale data bugs. Short-lived data like sensor readings need short max-age values. Long max-age for frequently changing data shows stale information.

Ignoring client Cache-Control overrides breaks negotiation. Clients can send no-cache to force revalidation. Servers should honor client preferences when possible.

## Summary

Cache-Control defines caching policy through directives like max-age, no-cache, no-store, public, private, and must-revalidate. Freshness determines when cached data can be reused without validation. ETag and If-None-Match enable validation through conditional requests. Three hundred four Not Modified means use your cache. Caching is a negotiated contract between client and server. Explicit rules beat heuristics. URLs are cache keys, including scheme, host, path, and query string. Shared caches obey Cache-Control. Authenticated responses should use private. Caching affects consistency, user experience, load, cost, and correctness. It is architectural, not just performance. Understanding caching is essential for building efficient HTTP systems.

## Next

This chapter built on Chapter 1.16, which covered headers for content and type. Next, Chapter 1.18 explores URLs, paths, and query strings, dissecting how URLs are structured, how paths map to resources, how query strings encode parameters, and why small URL differences matter deeply. This is where identity, addressing, and caching collide.
