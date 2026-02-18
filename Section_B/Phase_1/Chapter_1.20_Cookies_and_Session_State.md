# Section B Phase 1 · Chapter 1.20: Cookies and Session State

## Learning Objectives

After this chapter, you will be able to:
- Understand how cookies enable stateful experiences in a stateless protocol
- Recognize that cookies are client-side storage, not server memory
- Use cookie options like Secure, HttpOnly, SameSite, Path, and Domain correctly
- Understand the session state pattern and why session data lives server-side
- Recognize security risks like CSRF, session fixation, and ambient authority
- Design secure cookie-based authentication systems

## Key Terms

- **Cookie**: Client-side storage mechanism that carries data across HTTP requests
- **Set-Cookie**: Response header that instructs the client to store a cookie
- **Cookie Header**: Request header that sends stored cookies back to the server
- **Session**: Server-side state associated with a session identifier
- **Session ID**: Opaque identifier stored in a cookie that points to server-side session data
- **CSRF**: Cross-Site Request Forgery attack enabled by automatic cookie sending
- **Ambient Authority**: Property where possession of a cookie grants access without explicit action

## 1) Stateless Protocol, Stateful Experience

HTTP is stateless. That is not a footnote. That is the defining constraint. Yet most web applications appear stateful. You log in once, you stay logged in, your cart persists, preferences stick, and the server appears to remember you. This chapter explains how that illusion is built without violating HTTP's core rule.

Cookies are the mechanism. Sessions are the pattern. Trust boundaries are where everything breaks if misunderstood. Chapter 1.5 covered statelessness and connection lifecycle. Chapter 1.15 covered headers overview. Chapter 1.19 covered request bodies and content types. We have seen how URLs, methods, headers, and bodies carry data. Here we focus on how the server and client maintain continuity across requests without HTTP remembering anything.

HTTP does not remember. After a response is sent, the request is gone, the connection may close, and the server forgets everything by default. If nothing else is done, the next request is indistinguishable from the first. State must be carried explicitly. When your dashboard logs into your Pi, after the response the Pi does not remember. The next request is indistinguishable from a stranger's unless state is carried explicitly, for example via a session cookie. Or your ESP32: HTTP is stateless. State must be carried explicitly.

Cookies are not server memory. Cookies are instructions from server to client, asking the client to remember something and send it back later. The server does not store cookies automatically. The client does. When your Pi sends Set-Cookie session_id equals abc123, the Pi does not store it. Your dashboard, browser, stores it and sends it back on later requests. Or your coop controller: server sends Set-Cookie, client, browser or app, stores and returns cookies. The server does not store cookies automatically. The client does.

## 2) Set-Cookie: The Server's Request to Remember

A server cannot force memory. Instead, it says Set-Cookie name equals value semicolon options. This is a request, not a command. The client may accept it, store it, send it back later, or ignore it, privacy tools, settings, etc. When your Pi sends Set-Cookie session_id equals abc123, your dashboard browser may accept and store it, or a privacy extension may block it. Set-Cookie is a request, not a command. The client may accept, store, send back later, or ignore.

A typical Set-Cookie header: Set-Cookie session_id equals abc123 semicolon Path equals slash semicolon HttpOnly semicolon Secure. Parts: session_id to cookie name, abc123 to cookie value, options to scope and behavior. Each option matters. When your Pi sets Set-Cookie session_id equals abc123 semicolon Path equals slash semicolon HttpOnly semicolon Secure, Path limits when the cookie is sent, HttpOnly blocks JavaScript, Secure limits to HTTPS. Or your dashboard: each option, Path, Domain, Secure, HttpOnly, SameSite, matters for scope and security.

The name identifies the cookie. The value is opaque to the browser. Important: the browser does not interpret the value, it does not know what it means, it just stores and sends it. Meaning exists only on the server. When your Pi sets a cookie value abc123, the browser does not interpret it. It just stores and sends it. Your Pi looks up abc123 in session storage to know who the user is. Or your dashboard: cookie value is opaque to the browser. Meaning exists only on the server.

## 3) Cookie Options: Scope and Security

Path equals slash controls when the cookie is sent. Rules: cookie is sent only for matching paths, slash means send for all paths, slash api means only for slash api and below. Path limits exposure. When your Pi sets Set-Cookie session_id equals abc123 semicolon Path equals slash api, cookie sent only for requests to slash api and below, not for slash static. Or your dashboard: Path equals slash means send for all paths. Path equals slash api means only slash api and below. Path limits exposure.

Domain equals example dot com controls which hosts receive the cookie. Rules: without Domain, exact host only, with Domain, subdomains may receive it. For example, example dot com, api dot example dot com, www dot example dot com. Domain scoping is critical for security. When your Pi at dashboard dot pi dot local sets a cookie without Domain, only dashboard dot pi dot local gets it. With Domain equals pi dot local, subdomains like api dot pi dot local could receive it, intended or not. Or your homestead: domain rules must be precise. Domain scoping is critical for security.

Cookies can persist or vanish. Options: Expires followed by a date, Max-Age equals three thousand six hundred. If neither is set, cookie is a session cookie, deleted when browser closes. Persistent cookies survive restarts. When your Pi sets Set-Cookie theme equals dark semicolon Max-Age equals two million five hundred ninety-two thousand, cookie survives browser restart for thirty days. Without Expires or Max-Age, it is a session cookie, deleted when the browser closes. Or your dashboard: Expires and Max-Age control persistence. Persistent cookies survive restarts.

Secure means cookie is sent only over HTTPS, never over plain HTTP. Without Secure, cookie can leak on insecure connections and session hijacking becomes trivial. Always use Secure for sensitive cookies. When your Pi sets a session cookie, must include Secure so it is sent only over HTTPS. Without Secure, cookie can leak on HTTP and session hijacking becomes trivial. Or your dashboard login: always use Secure for sensitive cookies.

HttpOnly means JavaScript cannot read the cookie, document dot cookie cannot access it. This protects against XSS stealing session cookies. HttpOnly does not prevent sending. It prevents reading. When your Pi sets Set-Cookie session_id equals abc123 semicolon HttpOnly, JavaScript cannot read it via document dot cookie, so XSS cannot steal the session. Browser still sends it on requests. Or your dashboard: HttpOnly protects against XSS stealing session cookies. It prevents reading, not sending.

SameSite equals Strict or Lax or None. Site means scheme plus registrable domain. For example, https colon slash slash dashboard dot pi dot local and https colon slash slash api dot pi dot local are the same site. https colon slash slash evil dot com is not. This option controls when the browser attaches the cookie to a request that was triggered by another origin. Strict means cookie sent only when the user navigates directly to your origin, for example types your URL or clicks a same-site link. No cookie on requests triggered by a link from another site. Lax means cookie sent on top-level navigations, for example user clicks a link to your site from email or another site. Often a reasonable default for login cookies so remember me works across links. None means cookie sent on cross-site requests too, for example embedded iframe, cross-site form POST. Requires Secure. Use only when you need cross-site behavior and have other CSRF defenses. SameSite exists to mitigate CSRF by limiting when cookies are sent.

When your Pi sets SameSite equals Strict for the session cookie, if someone embeds your dashboard in an iframe on evil dot com, the browser will not send the cookie. Your solar dashboard might use Lax so a link from your email to the dashboard still sends the cookie. SameSite is a boundary decision: who can trigger a request that carries this cookie?

## 4) Cookie Storage and Automatic Sending

Important boundary reminder: cookies live on the client. The server sends Set-Cookie, receives Cookie, and does not control storage. The client stores cookies, chooses when to send them, and can delete or alter them. The server cannot see or revoke a cookie once sent. It can only issue a new Set-Cookie, for example to overwrite or expire, or invalidate the session server-side when the client next presents the old cookie.

When your coop controller sends Set-Cookie, your browser stores it. If you clear site data or use a different browser, that client has no cookie. The server did not take it back. Logout works only because the server invalidates the session. The client may still have the cookie until it is deleted or expires.

On subsequent requests, the client sends Cookie name equals value semicolon name2 equals value2. All cookies matching domain, path, and security rules are sent automatically. When your dashboard requests GET http colon slash slash pi dot local slash api slash config, browser automatically attaches Cookie session_id equals abc123 if domain, path, and security rules match. No user or script action needed. Or your coop controller: if rules match, cookies are sent automatically. This is why they are powerful, and dangerous.

The browser does not ask the user, does not ask the application, and does not ask JavaScript. If rules match, cookies are sent. This is why they are powerful, and dangerous.

## 5) Ambient Authority and CSRF

Cookies are ambient authority. Meaning: possession equals access, no explicit intent required, and no user action needed. If a request is sent, cookies go with it. When your dashboard loads an image from your Pi, the request includes the session cookie. Or a link on another site triggers a GET to your Pi. Cookies go with it unless SameSite blocks. Cookies are ambient authority. Possession equals access. If a request is sent, cookies go with it.

Why ambient authority is risky: attackers can trigger requests, browsers attach cookies automatically, and servers trust the cookies. This creates CSRF. When a malicious site has a form that POSTs to your Pi's slash api slash config, your browser sends your session cookie. Your Pi trusts it and changes config. The user never intended it. Same idea for your solar dashboard or coop controller: any request the browser sends to your origin can carry cookies. If the request was triggered by another site, that is CSRF. Cookies are ambient. Attackers can trigger requests. This creates CSRF.

Cross-Site Request Forgery happens when a malicious site triggers a request, for example form POST, or link, or script, the browser sends cookies to your origin automatically, the server trusts the cookie and performs the action, and the user never intended that action. The cookie does not distinguish user clicked our login form from user was on evil dot com and a form submitted to us. So the server must not rely on the presence of a cookie alone for state-changing requests. It needs CSRF defenses, tokens, SameSite, or other checks. Chapter 1.21 returns to this when we treat headers and cookies as attack surfaces.

When your dashboard user visits a bad site, the site triggers a request to your Pi with the user's cookie. Your Pi performs an action, for example delete sensor, change coop schedule. The user never intended it. CSRF exists because cookies are sent automatically with the request.

## 6) Sessions: Server-Side State Pattern

Cookies do not authenticate. They only carry identifiers, carry tokens, and carry references. Authentication happens on the server. When your Pi receives Cookie session_id equals abc123, the cookie does not authenticate. The Pi looks up abc123 in session store and then decides who the user is. Or your dashboard: cookies carry identifiers or tokens. Authentication happens on the server.

The most common pattern: client authenticates, login, server creates session record, server generates session ID, server sends session ID in cookie, client stores cookie, client sends cookie on every request, and server looks up session by ID. Stateless protocol. Stateful application. When your dashboard logs in, your Pi creates a session record, generates session ID, sends it in Set-Cookie. Dashboard stores and sends it on every request. Pi looks up session by ID. HTTP is stateless. The application uses sessions to appear stateful. Session state pattern: stateless protocol, stateful application.

The session ID has no meaning by itself, is a key into server storage, and points to session data. The cookie is the key, not the data. When your Pi stores session data, user_id, login_time, in Redis, the cookie only holds the session ID. The ID is a pointer, no meaning by itself, key into server storage. Or your dashboard: session ID is a pointer. The cookie is the key, not the data.

Common locations for session data include in-memory store, database, Redis or cache, and file system. The cookie never contains the data itself. When your Pi keeps session data, roles, preferences, in a database or Redis, the cookie holds only the session ID. Or your dashboard: where session data lives, in-memory, database, Redis, file system. The cookie never contains the data itself.

Why session data is server-side: clients are untrusted, cookies can be modified, and sensitive data must not be exposed. Only the identifier crosses the boundary. When your Pi does not put user_id or is_admin in the cookie, only the session ID. Clients are untrusted. Cookies can be modified. Sensitive data must not be exposed. Or your dashboard: why session data is server-side. Only the identifier crosses the boundary.

## 7) Cookies Are Untrusted Input

Phase 0.8 again: cookies come from the client, can be forged, can be replayed, and can be tampered with. Never trust cookie contents. When your Pi receives Cookie session_id equals abc123, must look it up and validate. Do not trust the value. Cookies can be forged, replayed, tampered with. Or your dashboard: Phase 0.8, cookies are untrusted input. Never trust cookie contents.

Never store authority in cookies. Bad idea: Cookie is_admin equals true. Because client can change it, server would trust it, and privilege escalation occurs. Authority must be server-verified. When your Pi must never do if cookie says is_admin then allow, client can set is_admin equals true. Authority must be looked up server-side from session data. Or your dashboard: never store authority in cookies. Authority must be server-verified.

The browser allows editing cookies, allows deletion, and allows injection via dev tools. Assume adversarial control. When user can edit cookies in dev tools, delete them, or inject values, your Pi must not rely on cookie values being unchanged. Or your dashboard: cookies can be modified. Assume adversarial control.

If the server accepts a session ID from the client and does not replace it at login, an attacker can fix that ID and then trick the victim into using it. Flow: attacker gets a session ID, for example by visiting your login page and reading the cookie or by predicting it. Attacker lures the victim to use that same session ID, for example link that sets the cookie or sends the victim to a page that uses it. Victim logs in. Server associates the authenticated session with that ID. Attacker now has a valid logged-in session.

Defense: never trust a pre-login session ID for post-login identity. Create a new session and send a new session ID in Set-Cookie when the user successfully authenticates. That way the cookie the victim ends up with is not the one the attacker chose. Rotate session IDs on authentication. When your Pi login handler must issue a new session ID after successful login, do not reuse the session that existed before login. Your dashboard or electric poultry net config UI: same rule. Session fixation is eliminated by rotating session IDs on authentication.

Sessions must expire: inactivity timeout, absolute lifetime, and logout invalidation. Otherwise, stolen cookies remain valid and old sessions linger forever. When your Pi must expire sessions, inactivity timeout, absolute lifetime, logout. Otherwise a stolen session cookie stays valid. Or your dashboard: session expiration matters. Otherwise stolen cookies remain valid and old sessions linger forever.

Logout means invalidate session server-side, not just delete cookie client-side. Deleting cookie alone is insufficient. When your dashboard user clicks Logout, your Pi must invalidate the session server-side, delete from store, not just tell the client to delete the cookie. Otherwise the session ID is still valid if replayed. Logout is server-side. Deleting cookie alone is insufficient.

## 8) Cookies vs Tokens and API Design

Cookies are automatically sent, ambient authority, and browser-managed. Tokens, for example Authorization headers, are explicit, client-managed, and often safer for APIs. Each has tradeoffs. When your dashboard, browser, uses cookies, automatically sent, ambient authority. Your ESP32 API uses Authorization Bearer token, explicit, client-managed, no cookie or CSRF issues. Or your Pi: cookies versus tokens. Each has tradeoffs.

APIs often avoid cookies because CSRF risk, cross-origin complexity, and implicit behavior. Many APIs prefer Authorization Bearer token. Explicit is safer. When your ESP32 calls your Pi API with Authorization Bearer token, not cookies, avoids CSRF and cross-origin cookie complexity. Or your dashboard: APIs often avoid cookies. Explicit, for example Bearer token, is safer. Cookies and APIs: explicit is safer.

Improper Domain scoping can leak cookies. For example, auth dot example dot com and evil dot example dot com. Domain rules must be precise. When your Pi at auth dot pi dot local sets Domain equals pi dot local, now api dot pi dot local and any other subdomain gets the cookie. If one is compromised, cookie leaks. Or your dashboard: cookies and subdomains. Domain rules must be precise.

Without HTTPS, cookies can be sniffed and session hijacking is trivial. HTTPS is mandatory for cookies carrying identity. When your dashboard logs into your Pi over HTTP, session cookie can be sniffed on the network. Over HTTPS, cookie is protected in transit. Or your coop controller: cookies and HTTPS are non-negotiable for identity.

Cookie values are plain text, base64 at best, and readable by the client. Encryption must be explicit if needed. When your Pi stores a session ID in a cookie, plain text. Anyone with the cookie can replay it. If you need secrecy, encrypt server-side or use opaque tokens. Or your dashboard: cookie values are plain text. Encryption must be explicit if needed.

Some systems sign cookie values, detect tampering, and avoid server storage. Even then, data is visible and only integrity is protected. Still untrusted input. When your Pi signs a cookie so tampering is detected, integrity, not secrecy. Value is still visible. Only integrity is protected. Server must still validate. Signed cookies are still untrusted input. Or your dashboard: signed cookies. Still untrusted input.

Browsers enforce limits: approximately four KB per cookie and limited cookies per domain. Do not store large data. When your Pi must not put a full user profile in a cookie, browsers enforce approximately four KB per cookie and limit count per domain. Or your dashboard: cookie size limits. Do not store large data.

Browsers send all matching cookies in a single Cookie header. Large cookie sets increase request size. When your Pi and dashboard might set session_id, theme, and language, all matching cookies go in one Cookie header. Large cookie sets increase request size. Or your coop controller: multiple cookies per domain are sent together. Keep the set small.

Images, scripts, API calls, all include cookies. This has performance cost and security implications. Minimize cookie scope. When your Pi sets Path equals slash api and short Max-Age so the session cookie is not sent for every static asset, or your dashboard: cookies affect every request, images, scripts, API calls. Minimize cookie scope.

Responses with cookies are often uncacheable or require careful Cache-Control. Private data must not be cached publicly. When your Pi returns dashboard HTML with Set-Cookie, response should have Cache-Control private so it is not cached by a shared proxy. Or your dashboard: cookies and caching. Private data must not be cached publicly.

## 9) Cookies and Statelessness

Cookies do not violate HTTP spec. But they add hidden state, create implicit behavior, and complicate reasoning. This is a deliberate tradeoff. When your Pi uses cookies so your dashboard can stay logged in, HTTP stays stateless, but the application has hidden state and implicit behavior. Or your homestead: cookies break stateless purity. This is a deliberate tradeoff.

They exist because HTTP alone was insufficient and applications demanded continuity. They are powerful, and sharp. When your Pi uses cookies to maintain login state, powerful. Misused, wrong Domain, no Secure, authority in cookie, sharp. Or your dashboard: cookies are a protocol-level escape hatch. They are powerful, and sharp.

Everything about cookies is a boundary issue. They cross trust boundaries, origin boundaries, and time boundaries. Every cookie decision is a security decision. This is where HTTP stops being mechanical and becomes adversarial. Chapter 1.21 makes that explicit. When your Pi's choice of Path, Domain, Secure, HttpOnly, SameSite, and expiration affects trust, origin, and time boundaries. Your pig barn or cow barn dashboard, your solar panel UI, your electric poultry net config, same idea. Everything about cookies is a boundary issue. Every cookie decision is a security decision.

## Common Pitfalls

Storing authority in cookies allows privilege escalation. Never put is_admin or user roles in cookies. Clients can modify them. Always look up authority server-side from session data.

Using cookies without Secure allows session hijacking. Session cookies must use Secure to prevent transmission over HTTP. Without it, cookies can be sniffed and sessions hijacked.

Ignoring SameSite enables CSRF attacks. Use SameSite equals Strict or Lax for session cookies. SameSite equals None requires Secure and should be avoided unless cross-site behavior is necessary.

Accepting session IDs from clients without rotation enables session fixation. Always issue a new session ID after successful authentication. Never reuse pre-login session IDs for authenticated sessions.

Not expiring sessions allows stolen cookies to remain valid. Implement inactivity timeouts and absolute lifetimes. Invalidate sessions on logout server-side, not just client-side cookie deletion.

## Summary

HTTP is stateless. Cookies ask the client to remember. Cookie values are untrusted. Sessions store state server-side. Cookies carry identifiers, not authority. Cookies are ambient and automatic. Security lives at the boundary. The cookie is the key. The server holds the data. Every cookie decision is a boundary decision. Set-Cookie instructs the client to store data. Cookie header sends it back automatically. Cookie options like Path, Domain, Secure, HttpOnly, and SameSite control scope and security. Session state pattern uses server-side storage with client-side identifiers. CSRF exists because cookies are sent automatically. Session fixation occurs when session IDs are not rotated. Cookies enable stateful experiences in a stateless protocol, but every aspect involves security tradeoffs. Understanding cookies is essential for building secure web applications.

## Next

This chapter built on Chapter 1.5, which covered statelessness, Chapter 1.15, which covered headers overview, and Chapter 1.19, which covered request bodies. Next, Chapter 1.21 explores trust boundaries and security surfaces, where we stop treating headers, cookies, bodies, and URLs as just data and start treating them as attack surfaces. This is where HTTP stops being mechanical and becomes adversarial.
