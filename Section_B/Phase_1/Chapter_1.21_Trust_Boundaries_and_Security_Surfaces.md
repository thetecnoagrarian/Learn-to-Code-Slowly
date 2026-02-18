# Section B Phase 1 · Chapter 1.21: Trust Boundaries and Security Surfaces

## Learning Objectives

After this chapter, you will be able to:
- Recognize that every part of an HTTP request is untrusted input
- Understand why headers, cookies, paths, and bodies are all attack surfaces
- Validate input at boundaries before processing
- Distinguish between identity, authentication, and authorization
- Design systems that fail closed rather than open
- Recognize that security is layered, not singular

## Key Terms

- **Trust Boundary**: The line between trusted and untrusted environments
- **Attack Surface**: Any part of a system that can be exploited by attackers
- **Input Validation**: Process of checking that input meets expected criteria
- **Ambient Authority**: Property where possession of credentials grants access automatically
- **CSRF**: Cross-Site Request Forgery attack enabled by automatic cookie sending
- **Fail Closed**: Security principle where validation failures result in rejection
- **Timing Attack**: Attack that exploits differences in operation duration to leak information

## 1) HTTP Is Nothing But Boundaries

Phase 0.8 established a foundational rule: boundaries are where validation lives. HTTP is nothing but boundaries. Every request crosses from an untrusted environment into a trusted one. Every response crosses back. Every byte is suspect. This chapter makes that explicit.

Chapter 1.5 covered statelessness. Chapter 1.18 covered URLs, paths, and query strings. Chapter 1.19 covered request bodies and content types. Chapter 1.20 covered cookies and session state. We have seen how requests carry data in headers, cookies, paths, query strings, and bodies. Here we make explicit what Phase 0.8 established: boundaries are where validation lives, and HTTP is nothing but boundaries. Every byte that crosses the boundary is suspect. There is no safe part of an HTTP request.

There is no safe part of an HTTP request. There is no harmless header. There is no obviously honest cookie. There is only input. From the server's perspective, the client is outside, the server is inside, and everything that crosses the line is input. There are no exceptions. Not headers. Not cookies. Not paths. Not methods. Everything arrives from the other side of the boundary. When your Pi receives a request, every header, cookie, path, method, and body byte came from the client. Your ESP32 sensor node, your dashboard browser, your coop controller app, all are on the other side of the boundary. Everything arrives from the other side of the boundary.

A common beginner mistake is thinking the body is input but headers are metadata. This is wrong. In HTTP, headers are input, cookies are input, path is input, query string is input, method is input, and version is input. The entire request is data from an untrusted source. When your Pi receives a request with headers, cookies, path, query string, method, and body, all are data from an untrusted source. Your solar dashboard, your pig barn controller, your electric poultry net config UI, same rule. The entire request is data from an untrusted source.

## 2) Headers Are Client-Supplied Data

Every header in a request was sent by the client, can be altered by the client, and can be forged by the client. There is no such thing as a server-generated request header. When your Pi receives a request, every header was sent by the client. Your dashboard browser, your ESP32 sensor node, your coop controller app, all send headers. Your Pi cannot generate headers for incoming requests. Every header is client-supplied data. There is no such thing as a server-generated request header.

The User-Agent header claims what browser or client is being used, is frequently spoofed, and is often meaningless. You may log it, you may inspect it, you may not trust it. When your Pi logs User-Agent for debugging, but never uses it for authorization. An attacker can send User-Agent TrustedESP32 or AdminDashboard. Your Pi must not trust it. Or your coop controller: you may log User-Agent. You may not trust it.

The Referer header may be missing, may be truncated, may be spoofed, and may be intentionally suppressed. It can help with debugging. It cannot enforce security. When your Pi might check Referer to see where a request came from, but an attacker can spoof or omit it. Your solar dashboard or poultry net config: Referer can help with debugging. It cannot enforce security.

Custom headers like X-User-Id colon 42, X-Admin colon true, X-Trusted colon yes mean nothing by themselves. Any client can send them. Any script can add them. Any attacker can forge them. When your Pi receives X-User-Id colon 42 or X-Admin colon true, any client can send these. Your dashboard, ESP32, or attacker's script can forge them. X-anything means nothing. Any attacker can forge them.

Treat headers as hints, suggestions, and context. Never treat them as authority, identity, or permission. When your Pi receives X-Admin colon true, treat it as a hint at best, never as authority. Your coop controller or cow barn dashboard: headers are hints, not truth. Never treat them as authority, identity, or permission.

## 3) Cookies Are Input and Ambient Authority

Cookies feel special because browsers manage them, they are automatic, and they persist. None of that makes them trustworthy. Cookies are client-controlled input. When your Pi receives Cookie session_id equals abc123, the client sent it, the client can modify it, the client can forge it. Your dashboard browser manages cookies, but they are still client-controlled input. Cookies are client-controlled input.

Cookies are sent automatically, with every matching request, and without user intent. This makes them dangerous. The server sees Cookie session equals abc123, but it has no idea why the request was sent. When your Pi receives Cookie session equals abc123, was it a legitimate button click, a malicious script, a CSRF attack, or a forged form? Your Pi cannot tell. Your solar dashboard or poultry net config: the server cannot see intent. It has no idea why the request was sent.

From the server's perspective, a legitimate button click, a malicious script-triggered request, a background fetch, and a forged form submission all look identical. Intent does not cross the boundary. When your Pi receives a request with a valid session cookie, was the user tricked into clicking a link on evil dot com, or did they click your button? Your coop controller or pig barn dashboard: intent does not cross the boundary.

Cross-Site Request Forgery exists because cookies are automatic, browsers send them without asking, and servers trust them. The protocol does not distinguish user intended from user tricked. When your Pi receives a POST to slash api slash config with a valid session cookie, was it from your dashboard UI or from a form on evil dot com? HTTP does not distinguish user intended from user tricked. This is why CSRF exists. Your solar dashboard or poultry net config: cookies are automatic, browsers send them without asking, servers trust them. But the protocol cannot see intent. This is why CSRF exists.

A cookie may carry a session ID, a token, or a reference. It does not carry authorization, permission, or trust. Those must be verified server-side. When your Pi receives Cookie session_id equals abc123, the cookie carries identity, a session ID, not permission. Your Pi must look up the session, check roles, verify authorization. Your dashboard or coop controller: cookies carry identity, not permission. Those must be verified server-side.

Never trust cookie values. Bad idea: Cookie role equals admin. Worse idea: Cookie is_logged_in equals true. The client can change both. Cookies can identify. They cannot authorize. When your Pi must never check if cookie says role equals admin then allow, the client can change it. Your cow barn dashboard or poultry net config: cookies can identify. They cannot authorize.

A session cookie identifies a session, points to server-side state, and has no meaning on its own. All authority lives behind the boundary. When your Pi stores session data, roles, permissions, in Redis or a database, the cookie only holds the session ID. Your dashboard or ESP32: session IDs are keys, not data. All authority lives behind the boundary.

## 4) Paths, Query Strings, Methods, and Bodies Are Input

Paths feel structural: slash admin, slash users slash 42, slash api slash delete. They are still client-provided data. Attackers guess paths, for example slash admin, slash api slash admin, slash admin slash users, manipulate IDs, for example slash users slash 42 to slash users slash 999999, or slash users slash 1 to slash users slash 0, traverse directories, for example slash api slash dot dot slash config, slash static slash dot dot slash dot dot slash etc slash passwd, and probe hidden endpoints, for example slash api slash v1, slash api slash v2, slash api slash internal. Never assume the path implies permission. The path is just a string the client sent. Validate it, normalize it, check authorization separately.

When your Pi receives DELETE slash api slash users slash 42, the path suggests admin action, but an attacker can send it. Your solar dashboard or coop controller: paths are input. Never assume the path implies permission.

Query parameters like question mark user_id equals 42, question mark is_admin equals true are just as forgeable as headers. Treat them as untrusted data. When your Pi receives question mark user_id equals 42 ampersand is_admin equals true, query strings are just as forgeable as headers. Your dashboard or ESP32: query strings are input. Treat them as untrusted data.

The client chooses the method. A client can send DELETE slash users slash 42 even if your UI never exposes it. Authorization must not depend on the UI would not do that. When your dashboard UI never shows a DELETE button, but an attacker can send DELETE slash api slash sensors slash 17 directly. Your Pi must authorize based on session and roles, not on the UI would not do that. Your coop controller or cow barn dashboard: the client chooses the method. Authorization must not depend on the UI would not do that.

Even the protocol version HTTP slash 1.1 is supplied by the client. Servers must handle malformed or unexpected versions safely. When your Pi receives HTTP slash 0.9 or HTTP slash 3.0 or malformed version strings, must handle them safely. Your coop controller or poultry net config: version is input. Servers must handle malformed or unexpected versions safely.

This part is obvious, but still worth stating: JSON bodies, form data, and multipart uploads are all untrusted. Validation belongs at the boundary. When your Pi receives JSON, form data, or multipart uploads, all untrusted. Your solar dashboard posts temperature readings, your pig barn controller uploads images. Validation belongs at the boundary. Bodies are input. Validation belongs at the boundary.

## 5) Validation Is Mandatory

Validation is not an optimization, a best practice, or a nice to have. It is the definition of the boundary. When your Pi validates every request, presence, type, range, authorization. Your dashboard, ESP32, coop controller: validation is not optional. It is the definition of the boundary.

Is the field there? Missing data is a failure mode. Do not assume headers exist, cookies exist, or fields exist. When your Pi checks if Authorization header exists before using it. Your dashboard might not send a cookie. Your ESP32 might omit a field. Validate presence. Do not assume headers, cookies, or fields exist.

Is the data the type you expect? String versus number, integer versus float, object versus list. Type confusion is a common exploit vector. When your Pi expects a number but receives 42 as a string or true as a boolean, type confusion can lead to bugs or exploits. Your solar dashboard or poultry net config: validate type. Type confusion is a common exploit vector.

Is the value reasonable? IDs in expected range, length limits, and time windows. Unbounded input is dangerous. When your Pi receives a sensor ID, must validate it is in the expected range, one to one hundred, not 999999 or negative. Your coop controller or cow barn dashboard: validate range. Unbounded input is dangerous.

Never combine identity, authentication, and authorization. Each must be checked independently. When your Pi checks identity, who is this, authentication, are they logged in, and authorization, can they do this, separately. Your dashboard or ESP32: never combine identity, authentication, and authorization. Each must be checked independently.

The client would never send that is not a defense. Clients are buggy, are scripted, are malicious, and are controlled by attackers. Assume the worst. When your Pi assumes clients are buggy, scripted, malicious, or controlled by attackers. Your solar dashboard, coop controller, or poultry net config: the client would never send that is not a defense. Assume the worst.

Servers do not trust clients. This is not cynicism. It is architecture. The server validates, verifies, and rejects. Always. When your Pi validates, verifies, and rejects, always. Your dashboard, ESP32, or any client: servers do not trust clients. This is not cynicism. It is architecture. Always.

## 6) Clients Also Live in Hostile Environments

The boundary goes both ways. Clients must assume servers can lie, responses can be malformed, and content can be malicious. When your dashboard browser receives a response from your Pi, must validate Content-Type, parse carefully, avoid executing unexpected content. Your ESP32 or coop controller app: clients also live in hostile environments. Content can be malicious.

Client-side validation includes checking status codes, validating Content-Type, parsing carefully, and avoiding execution of unexpected content. When your dashboard validates status codes, checks Content-Type, parses JSON carefully, never evaluates response data as code. Your solar dashboard or poultry net UI: clients validate responses too. Avoiding execution of unexpected content.

Never execute response data blindly. Classic failures include injecting HTML directly, XSS, evaluating JSON as code, and trusting script responses. Responses are also input. When your dashboard must not inject HTML directly, XSS, evaluate JSON as code, or trust script responses blindly. Your coop controller or pig barn app: never execute response data blindly. Responses are also input.

Browsers execute code, load third-party scripts, and share global state. Trust boundaries still apply. When your dashboard browser executes code, loads third-party scripts, shares global state, trust boundaries still apply. Your solar panel UI or poultry net config: the browser is not a safe space. Trust boundaries still apply.

The browser enforces rules. Attackers find edge cases, abuse misconfigurations, and exploit CORS mistakes. Do not rely on the browser alone. When your Pi sets CORS headers, but attackers find edge cases, abuse misconfigurations, exploit CORS mistakes. Your dashboard or ESP32: same-origin policy is not absolute. Do not rely on the browser alone.

CORS controls which origins may read responses. It does not authenticate, authorize, or validate input. When your Pi sets CORS headers to allow your dashboard origin, CORS controls which origins may read responses, but it does not authenticate, authorize, or validate input. Your coop controller or solar dashboard: CORS is a boundary control. It does not validate input.

## 7) Security Is Layered and Fail Closed

No single mechanism protects you: not cookies, not headers, not HTTPS, not CORS. Each layer assumes the others can fail. When your Pi uses HTTPS, cookies, headers, CORS, no single mechanism protects you. Your dashboard or ESP32: security is layered, not singular. Each layer assumes the others can fail.

When validation fails, reject the request, return an error, and log the event. Do not guess. Do not continue. When your Pi receives invalid input, rejects the request, returns an error, logs the event. Does not guess, does not continue. Your solar dashboard or poultry net config: fail closed, not open. Do not continue.

Ignoring malformed input hides bugs, enables probing, and encourages exploitation. Explicit rejection is safer. When your Pi explicitly rejects malformed input with a clear error, hides nothing, enables no probing. Your coop controller or cow barn dashboard: silence is dangerous. Explicit rejection is safer.

Error responses can leak information, reveal structure, and aid attackers. Balance clarity with restraint. When your Pi returns an error message, must balance clarity, user needs to know what went wrong, with restraint, do not leak structure or aid attackers. Your dashboard or ESP32: error messages are also a surface. Balance clarity with restraint.

Log validation failures, authorization failures, and unexpected inputs. Logs reveal attack patterns. When your Pi logs validation failures, authorization failures, unexpected inputs, logs reveal attack patterns. Your solar dashboard or poultry net config: logging is a defensive tool. Logs reveal attack patterns.

Once bad data enters, it spreads, it contaminates state, and it creates secondary failures. The edge is your only clean choke point. When your Pi validates at the boundary, once bad data enters, it spreads and contaminates state. Your dashboard, ESP32, or coop controller: the boundary is the only safe place to stop bad data. The edge is your only clean choke point.

## 8) Everything Is an Attack Surface

Headers, cookies, paths, bodies, methods, timing. All of it. Timing attacks exploit how long operations take. If your Pi checks a password character-by-character and returns early on the first mismatch, an attacker can measure response times to learn which characters are correct. If your Pi takes longer to respond when a user exists versus when a user does not exist, an attacker can enumerate usernames. Even side channels like error message timing or database query duration can leak information.

When your Pi treats headers, cookies, paths, bodies, methods, timing, all as attack surfaces. Your solar dashboard, coop controller, poultry net config, ESP32 sensor nodes: everything is an attack surface. Timing attacks are subtle but real. If your authentication check takes longer for valid users, attackers can measure that. All of it is an attack surface.

If you believe headers are safe, cookies are trustworthy, or the client would not do that, you will ship vulnerabilities. When your Pi assumes headers are safe or cookies are trustworthy or the client would not do that, you will ship vulnerabilities. Your dashboard or ESP32: security starts with correct mental models. Wrong models lead to vulnerabilities.

## Common Pitfalls

Trusting headers for authorization allows privilege escalation. Never use X-Admin or custom headers to grant permissions. Headers are hints, not authority. Always verify authorization server-side from session data.

Assuming cookies are trustworthy enables attacks. Cookies are client-controlled input. Never store authority in cookies. Use cookies only to carry identifiers that point to server-side session data.

Ignoring path validation allows path traversal and unauthorized access. Never assume paths imply permission. Validate and normalize paths. Check authorization separately from path structure.

Skipping input validation at boundaries allows bad data to spread. Validate presence, type, and range at the boundary before processing. Once bad data enters, it contaminates state.

Failing open instead of closed enables exploitation. When validation fails, reject the request explicitly. Do not guess or continue with invalid input. Fail closed, not open.

## Summary

Everything in an HTTP request is input. All input is untrusted. Headers, cookies, paths, bodies, methods, version, timing, all attack surfaces. Servers validate aggressively. Clients validate defensively. The boundary is where correctness and security live. There is no safe part of an HTTP request. The boundary is absolute. Everything that crosses it is suspect until validated. Headers are client-supplied data. Cookies are ambient authority and client-controlled input. Paths, query strings, methods, and bodies are all untrusted. Validation is mandatory: presence, type, range, identity, authentication, authorization. Security is layered, not singular. Fail closed, not open. The boundary is the only safe place to stop bad data. Understanding trust boundaries is essential for building secure HTTP systems.

## Next

This chapter built on Chapter 1.5, which covered statelessness, Chapter 1.18, which covered URLs, Chapter 1.19, which covered request bodies, and Chapter 1.20, which covered cookies. Next, Chapter 1.22 explores redirects and the Location header, showing how control flow itself crosses boundaries and how even navigation becomes an attack surface if misunderstood. This is where HTTP starts shaping user behavior, not just data flow.
