# Section B Phase 1 · Chapter 1.22: Redirects and the Location Header

## Learning Objectives

After this chapter, you will be able to:
- Understand how redirects create protocol-level control flow
- Distinguish between 301, 302, 307, and 308 redirect codes
- Recognize why method preservation matters for API redirects
- Understand redirect chains, loops, and depth limits
- Design secure redirects that validate targets
- Use redirects appropriately for URL changes and canonical URLs

## Key Terms

- **Redirect**: HTTP response with 3xx status code and Location header that instructs the client to make a new request
- **Location Header**: Response header that specifies the target URL for a redirect
- **301 Moved Permanently**: Redirect code indicating permanent move, historically changes POST to GET
- **302 Found**: Redirect code indicating temporary move, historically changes POST to GET
- **307 Temporary Redirect**: Redirect code that preserves method and body
- **308 Permanent Redirect**: Redirect code that preserves method and body permanently
- **Redirect Chain**: Series of redirects where one redirect points to another
- **Open Redirect**: Vulnerability where user input controls redirect destination without validation

## 1) Redirects Are Protocol-Level Control Flow

A redirect is a decision. The server is saying I understand your request, but the thing you want is not here. Go somewhere else. Redirects are not transport mechanics. They are control flow. They change what the client does next. That makes them powerful, and dangerous, if misunderstood.

Chapter 1.9 covered status codes overview. Chapter 1.10 covered success and redirects. Chapter 1.15 covered headers overview. Chapter 1.21 covered trust boundaries and security surfaces. We have seen how status codes communicate outcomes and how headers carry metadata. Here we focus on how three hundred status codes and the Location header create protocol-level control flow. Redirects change what the client does next, crossing trust boundaries in both directions.

At the HTTP level, a redirect is a completed request with a three hundred status code and a Location header that instructs the client to issue another request. The server does not forward the request. The server does not proxy the request. The server replies, and the client decides what to do next. When your Pi sends a three hundred one redirect with Location https colon slash slash dashboard dot pi dot local slash new-path, your dashboard browser receives it and decides whether to follow it. Your ESP32 or coop controller app: the server replies, and the client decides what to do next. Redirects are not server-to-server. They are client instructions.

A redirect is not the server calling another server, the server internally routing, or the server sending you over. A redirect is the server telling the client a new address, and the client making a new request. Two separate HTTP exchanges. When your dashboard requests http colon slash slash pi dot local slash api slash old, your Pi responds with three hundred one and Location https colon slash slash pi dot local slash api slash new. Your dashboard then makes a new request to https colon slash slash pi dot local slash api slash new. Two separate HTTP exchanges. Your solar dashboard or poultry net config: redirects are not forwarding. They are two separate HTTP exchanges.

## 2) The Location Header

The Location header carries the target. It can be an absolute URL, https colon slash slash example dot com slash path, or a relative URL, slash path. Clients resolve relative URLs against the original request URL. This header is required for most redirects, three hundred three See Other is an exception, interpreted by the client, which may validate, normalize, or reject it, and untrusted input from the server for the client. The client must decide whether to follow it.

The Location header is output from the server's perspective. Chapter 1.21: boundaries exist in both directions. A malicious or misconfigured server can send Location https colon slash slash evil dot com, so clients must validate redirect targets. When your Pi sends Location slash api slash v2 slash readings, relative, or Location https colon slash slash pi dot local slash api slash v2 slash readings, absolute, your dashboard resolves relative URLs against the original request URL. Your ESP32 or coop controller: the Location header is the instruction. Clients interpret it, validate it, and decide whether to follow it.

Important invariant: clients are not required to follow redirects. Browsers usually do. HTTP libraries often do, configurable. APIs sometimes do not. Redirects are a suggestion, not a command. When your Pi sends a three hundred two redirect, your dashboard browser usually follows it, but your ESP32 HTTP client might not, depending on configuration. Your coop controller or cow barn app: redirects are optional for clients. They are a suggestion, not a command.

When a client follows a redirect, it issues a brand-new request with a new request line, possibly a new method, possibly without the original body, and possibly without the original headers. This is not continuation. It is branching. When your dashboard POSTs to slash api slash config, your Pi responds with three hundred seven and Location slash api slash v2 slash config. Your dashboard makes a new POST to slash api slash v2 slash config. This is not continuation. It is branching. Your solar dashboard or poultry net config: redirects create a new request. It is branching.

Think of redirects as if resource_moved then respond_with_redirect. The next action happens on the client, not the server. This is protocol-level branching logic. When your Pi checks if a resource moved, if yes, respond with redirect. The next action happens on the client, your dashboard browser or ESP32, not the server. Your coop controller: redirects are control flow. This is protocol-level branching logic.

## 3) The Core Redirect Codes

Redirects live in the three hundred range, but not all three hundred codes behave the same. They differ in permanence, method preservation, cache behavior, and client expectations. Understanding each matters. When your Pi needs to redirect from slash api slash v1 slash readings to slash api slash v2 slash readings, which code? Three hundred one, permanent, but POST to GET, three hundred seven, temporary, preserves method, three hundred eight, permanent, preserves method? Your dashboard, ESP32, or coop controller: three hundred codes differ in permanence, method preservation, cache behavior. Understanding each matters.

The most important redirect-related codes include three hundred one Moved Permanently, three hundred two Found, three hundred seven Temporary Redirect, three hundred eight Permanent Redirect, and two hundred one Created, special case. Each has different semantics.

Three hundred one means this resource has permanently moved to another URL. Implications: clients may update bookmarks, caches may store the redirect, search engines update indexes, and browsers may rewrite future requests. Historically, browsers often change POST to GET. This historical behavior is why three hundred one can be dangerous for APIs. When your ESP32 POSTs sensor data to slash api slash old, your Pi responds with three hundred one to slash api slash new. Some clients convert POST to GET, dropping the body. Your dashboard or coop controller: three hundred one can change POST to GET. This historical behavior is why three hundred one can be dangerous for APIs.

Three hundred two means this resource is temporarily elsewhere. Implications: do not update bookmarks, do not cache permanently, and the original URL is still valid. Historically, browsers often change POST to GET, and semantics were ambiguous. This ambiguity led to newer codes. When your Pi uses three hundred two for temporary redirects, but browsers historically changed POST to GET, and semantics were ambiguous. Your solar dashboard or poultry net config: three hundred two ambiguity led to newer codes, three hundred seven, three hundred eight, with clearer semantics.

Early web browsers treated three hundred one and three hundred two the same, converted POST into GET, and dropped the request body. This was convenient for browsers. It was disastrous for APIs. When your ESP32 POSTs temperature data, your Pi redirects with three hundred one or three hundred two, browser converts POST to GET, body is dropped, data is lost. Your dashboard or coop controller: POST to GET conversion was convenient for browsers. It was disastrous for APIs.

## 4) Modern Redirect Codes: 307 and 308

To fix ambiguity, HTTP introduced three hundred seven Temporary Redirect, RFC 7231, and three hundred eight Permanent Redirect, RFC 7538. These preserve method and body. They were added specifically to address the POST to GET conversion problem. APIs needed redirects that would not lose request bodies or change method semantics. For modern APIs, three hundred seven and three hundred eight are usually the correct choice unless you specifically need the legacy behavior of three hundred one or three hundred two.

Three hundred seven means go elsewhere, but repeat the request exactly. Implications: method is preserved, body is preserved, and temporary change. POST stays POST. PUT stays PUT. When your ESP32 POSTs sensor readings to slash api slash old, your Pi responds with three hundred seven to slash api slash new. Your ESP32 makes a new POST, not GET, to slash api slash new with the same body. Your dashboard or coop controller: three hundred seven preserves method. POST stays POST, PUT stays PUT.

Three hundred eight means this resource has permanently moved, and you must preserve the method. Implications: method preserved, body preserved, permanent change, and clear semantics for APIs. For modern APIs, three hundred eight is usually better than three hundred one. When your Pi moves slash api slash v1 slash readings to slash api slash v2 slash readings permanently, use three hundred eight so POST or PUT methods are preserved. Your ESP32 or dashboard: three hundred eight means permanent move with method preserved. For modern APIs, three hundred eight is usually better than three hundred one.

Choosing the wrong redirect can cause duplicate operations, data loss, security issues, and client incompatibility. Redirects are not cosmetic. When your Pi chooses three hundred one versus three hundred seven versus three hundred eight, wrong choice can cause duplicate operations, data loss, security issues. Your solar dashboard or poultry net config: redirect semantics matter. Redirects are not cosmetic.

## 5) Redirects and Idempotency

Recall Phase 0 invariants: idempotent operations can be retried safely, and non-idempotent operations cannot. Redirecting a POST is dangerous. If the client retries the redirect, it may POST twice. It can duplicate side effects, for example creating two sensor readings, charging twice. It must be designed carefully. Use three hundred seven or three hundred eight to preserve method, or better yet, use POST to two hundred one to GET pattern.

If a redirect changes POST to GET, three hundred one or three hundred two legacy behavior, the operation becomes idempotent, GET is safe, but the original intent is lost. If a redirect preserves POST, three hundred seven or three hundred eight, the operation remains non-idempotent, and retries are still dangerous. The safest pattern: POST creates a resource, server responds with two hundred one Created and Location, client GETs the resource.

Common pattern: client POSTs data, server creates resource, server responds with two hundred one Created, Location points to the new resource, and client GETs the resource. This avoids duplicate POSTs. When your dashboard POSTs to create a user, your Pi responds with two hundred one Created and Location slash users slash 42. Your dashboard GETs slash users slash 42. This avoids duplicate POSTs. Your solar dashboard or poultry net config: POST to two hundred one to GET pattern avoids duplicate POSTs.

Two hundred one is not a redirect code, but it uses Location. For example, HTTP slash 1.1 two hundred one Created, Location slash users slash 42. This says the action succeeded, a new resource exists, and here is where it lives. The client may choose to fetch it. When your Pi creates a new sensor config and responds with two hundred one Created and Location slash api slash configs slash 17, your dashboard may choose to GET that location. Your ESP32 or coop controller: two hundred one Created uses Location. The client may choose to fetch it.

## 6) Redirect Chains, Loops, and Limits

A redirect can point to another redirect. For example, slash old to slash older, slash older to slash new, slash new to two hundred OK. This is a redirect chain. When your dashboard requests slash old, your Pi redirects to slash older, which redirects to slash new, which returns two hundred OK. Your solar dashboard or poultry net config: a redirect can point to another redirect. This is a redirect chain.

Bad configuration can create loops: slash a to slash b, slash b to slash a. Or more subtle: slash a to slash a, self-loop, or slash a to slash b to slash c to slash a, circular chain. Clients must protect themselves. Servers cannot detect loops because each redirect is a separate request-response pair. The server that sends slash a to slash b does not know that slash b will redirect back to slash a.

Browsers and libraries limit redirect depth, typically five to ten hops, abort after N hops, and may detect cycles by tracking visited URLs. Redirect loops are server misconfigurations, but clients must handle them gracefully or they will hang or consume resources indefinitely.

Typical limits: five to ten redirects, configurable in HTTP clients. If exceeded, client errors and request fails. Redirect loops are failures. When your Pi redirects slash a to slash b, and slash b to slash a, your dashboard hits the redirect limit, five to ten, and errors. Your coop controller or ESP32: clients limit redirect depth. Redirect loops are failures.

Each redirect requires a full round trip, adds latency, and adds load. Minimize unnecessary redirects. When your dashboard requests slash api slash readings, your Pi redirects to slash api slash v2 slash readings, which redirects to slash api slash v2 slash readings slash, trailing slash. Each redirect adds latency. Your solar dashboard or poultry net config: redirects are not free. Minimize unnecessary redirects.

## 7) When to Use Redirects

Redirect is client-visible, new request, and new URL. Internal routing is server-only, same request, and same URL. Do not confuse them. When your Pi internally routes slash api slash readings to a handler, this is server-only, same request, same URL. Redirecting slash api slash old to slash api slash new is client-visible, new request, new URL. Your dashboard or ESP32: redirects versus internal routing. Do not confuse them.

Use redirects when URLs change, resources move, canonical URLs are enforced, and versioning transitions occur. Do not use redirects for normal control flow, authorization checks, or error handling. When your Pi should not redirect on every authorization check, that is control flow, not resource movement. Your dashboard or coop controller: use redirects when URLs change or resources move. Do not use redirects for normal control flow, authorization checks, or error handling.

Servers often enforce canonical URLs to avoid duplicate content, ensure security, HTTPS, and simplify routing: HTTPS instead of HTTP, security, trailing slash normalization, slash path versus slash path slash, www versus non-www, consistency, and lowercase versus mixed case, case sensitivity. For example, http colon slash slash example dot com to https colon slash slash example dot com. This is a redirect. The server receives a request for the non-canonical URL and redirects to the canonical one. This ensures all clients eventually use the same URL, which helps with caching, SEO, and security, HTTPS enforcement.

When your dashboard requests http colon slash slash pi dot local slash api slash config, your Pi redirects to https colon slash slash pi dot local slash api slash config to enforce HTTPS. Your solar dashboard or poultry net config: canonical URLs, HTTPS, trailing slash, www, are enforced via redirects. This is a redirect.

## 8) Redirects and Security

Redirects cross trust boundaries. A server can redirect a client to a malicious site, an unexpected protocol, or a phishing endpoint. Clients must be cautious. When your dashboard follows a redirect from your Pi, but the Location header could point to evil dot com, an unexpected protocol, or a phishing endpoint. Your ESP32 or coop controller: redirects cross trust boundaries. Clients must be cautious.

An open redirect occurs when user input controls Location and no validation is applied. For example, slash login question mark next equals https colon slash slash evil dot com. The server blindly redirects. This is a real vulnerability. When your Pi has slash login question mark next equals https colon slash slash evil dot com, if it blindly redirects to the next parameter, that is an open redirect vulnerability. Your dashboard or solar panel UI: open redirects occur when user input controls Location without validation. This is a real vulnerability.

Open redirects enable phishing, bypass security filters, and abuse trusted domains. They break user trust. When your dashboard user clicks a link on your Pi that redirects to evil dot com, enables phishing, bypasses security filters, abuses your trusted domain. Your coop controller or poultry net config: open redirects break user trust.

Servers should restrict redirect destinations, allow only known domains, normalize paths, and reject external URLs when inappropriate. Redirects are output, but still part of security design. When your Pi validates redirect targets, only allows known domains, normalizes paths, rejects external URLs when inappropriate. Your dashboard or ESP32: validating redirect targets. Redirects are output, but still part of security design.

Phase 0.8 applies here too: redirect targets are output, output can cause harm, and output must be validated. Boundaries exist in both directions. When your Pi sends Location https colon slash slash evil dot com, that is output, and output can cause harm. Your solar dashboard or poultry net config: Phase 0.8 applies to redirects too. Boundaries exist in both directions.

Clients should limit redirect depth, validate schemes, http or https, preserve or drop headers intentionally, and decide whether to forward credentials. Redirects are not automatic correctness. When your dashboard follows redirects, must limit depth, validate schemes, http or https, decide whether to forward credentials. Your ESP32 or coop controller: client-side redirect handling. Redirects are not automatic correctness.

When following redirects, Authorization headers may be dropped, cookies may or may not apply, and cross-origin redirects change security context. Clients must manage this explicitly. When your dashboard follows a redirect, Authorization headers may be dropped, cookies may or may not apply, cross-origin redirects change security context. Your solar dashboard or poultry net config: credentials and redirects. Clients must manage this explicitly.

If redirect stays within the same domain, cookies may be sent automatically. If redirect crosses domains, cookies usually are not sent. This matters for login flows. When your dashboard logs in at auth dot pi dot local, your Pi redirects to dashboard dot pi dot local. If same domain, cookies are sent. If different domain, cookies usually are not. Your coop controller or cow barn dashboard: redirects and cookies. This matters for login flows.

## 9) Redirects as UX and API Design Tools

Browsers use redirects for login flows, logout flows, Post slash Redirect slash Get pattern, and navigation cleanup. These are conventions, not guarantees. When your dashboard uses redirects for login or logout flows, Post slash Redirect slash Get pattern, browsers usually follow redirects, but these are conventions, not guarantees. Your solar dashboard or poultry net config: redirects as UX tools. These are conventions, not guarantees.

Classic pattern: POST form, server processes, server redirects to GET, and user refreshes safely. Prevents duplicate submissions. When your dashboard POSTs a form to create a config, your Pi processes it, redirects to GET slash configs slash 17. User refreshes, GET is safe, no duplicate POST. Your coop controller or poultry net config: Post slash Redirect slash Get pattern prevents duplicate submissions.

Some redirects are cacheable, three hundred one, three hundred eight, persist in browser cache, and affect future behavior. Be careful before marking something permanent. When your Pi uses three hundred one to redirect slash api slash v1 to slash api slash v2, browsers cache it, users may never hit slash api slash v1 again, rollbacks are painful. Your dashboard or ESP32: redirects and caching. Be careful before marking something permanent.

Once clients cache a three hundred one or three hundred eight, changing behavior is hard, users may never hit the old URL again, and rollbacks are painful. Use permanent redirects sparingly. When your Pi uses three hundred one or three hundred eight, once clients cache it, changing behavior is hard. Your solar dashboard or poultry net config: permanent means permanent. Use permanent redirects sparingly.

When unsure, use three hundred two or three hundred seven, observe behavior, and promote to permanent later. Temporary first is safer. When your Pi is unsure if a move is permanent, use three hundred two or three hundred seven, observe behavior, promote to permanent later. Your dashboard or coop controller: when unsure, use temporary redirects. Temporary first is safer.

APIs evolve. Redirects allow version transitions, endpoint migrations, and deprecation strategies. They must be intentional. When your Pi evolves APIs, redirects allow version transitions, endpoint migrations, deprecation strategies. Your ESP32 or dashboard: redirects are part of API design. They must be intentional.

A redirect is not a failure. It is a successful response with instructions. Clients must treat it differently from errors. When your dashboard receives a three hundred one redirect, this is not a failure. It is a successful response with instructions. Your solar dashboard or poultry net config: redirects are not errors. Clients must treat it differently from errors.

## Common Pitfalls

Using 301 or 302 for API redirects loses request bodies. These codes historically convert POST to GET, dropping the body. Use 307 for temporary or 308 for permanent redirects when method preservation matters.

Ignoring redirect depth limits causes hangs. Clients limit redirect depth to prevent loops. Servers should avoid creating long chains or loops. Test redirect chains to ensure they terminate.

Creating open redirects enables phishing attacks. Never use user input directly in Location headers without validation. Validate redirect targets, restrict to known domains, and reject external URLs when inappropriate.

Marking redirects permanent too early causes rollback problems. Once clients cache 301 or 308 redirects, changing behavior is difficult. Start with temporary redirects, observe behavior, then promote to permanent if needed.

Not preserving method for POST requests causes data loss. If your API receives POST requests that need redirecting, use 307 or 308 to preserve the method and body. Otherwise, the body may be lost.

## Summary

Redirects are protocol-level control flow. Three hundred status codes plus Location tell the client what to do next. Three hundred one and three hundred two are legacy and ambiguous. Three hundred seven and three hundred eight preserve method and body. Clients may or may not follow redirects. Redirects cross trust boundaries and must be designed carefully. Redirects are branching logic, not forwarding. The server replies. The client decides. Every redirect creates a new request. Method, body, headers, and credentials may change. Choose the status code based on permanence and method preservation needs. Redirects enable URL changes, canonical URLs, version transitions, and deprecation strategies. They must be intentional and secure. Understanding redirects is essential for building robust HTTP systems.

## Next

This chapter built on Chapter 1.9, which covered status codes overview, Chapter 1.10, which covered success and redirects, Chapter 1.15, which covered headers overview, and Chapter 1.21, which covered trust boundaries. Next, Chapter 1.23 explores REST principles, where HTTP stops being just transport and becomes an application protocol, and where resource modeling, representations, and uniform interfaces take center stage. This is where the protocol starts to mean something.
