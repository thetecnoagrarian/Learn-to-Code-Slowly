# Phase 2 · Chapter 2.20: Cookies and Session State

This chapter builds on [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.15: Headers — Overview](Chapter_2.15_Headers_Overview.md), and [Chapter 2.19: Request Bodies and Content Types](Chapter_2.19_Request_Bodies_and_Content_Types.md). We have seen how URLs, methods, headers, and bodies carry data. Here we focus on how the server and client maintain continuity across requests—without HTTP remembering anything. Cookies are the mechanism; sessions are the pattern; trust boundaries are where mistakes become security failures.

HTTP is stateless.

That is not a footnote.
That is the defining constraint.

Yet most web applications appear stateful:
	•	You log in once
	•	You stay logged in
	•	Your cart persists
	•	Preferences stick
	•	The server “remembers” you

This chapter explains how that illusion is built without violating HTTP’s core rule.

Cookies are the mechanism.
Sessions are the pattern.
Trust boundaries are where everything breaks if misunderstood.



## 1) Stateless Protocol, Stateful Experience

HTTP does not remember.

After a response is sent:
	•	The request is gone
	•	The connection may close
	•	The server forgets everything by default

If nothing else is done, the next request is indistinguishable from the first.

State must be carried explicitly.

Example: Your dashboard logs into your Pi—after the response, the Pi does not remember. The next request is indistinguishable from a stranger's unless state is carried explicitly (e.g. session cookie). Or your ESP32: HTTP is stateless; state must be carried explicitly.



## 2) Cookies Are a Memory Hack

Cookies are not server memory.

Cookies are:
	•	Instructions from server to client
	•	Asking the client to remember something
	•	And send it back later

The server does not store cookies automatically.
The client does.

Example: Your Pi sends `Set-Cookie: session_id=abc123`—the Pi does not store it; your dashboard (browser) stores it and sends it back on later requests. Or your coop controller: server sends Set-Cookie, client (browser or app) stores and returns cookies. The server does not store cookies automatically; the client does.



## 3) Set-Cookie: The Server’s Request to Remember

A server cannot force memory.

Instead, it says:

Set-Cookie: name=value; options

This is a request, not a command.

The client may:
	•	Accept it
	•	Store it
	•	Send it back later
	•	Or ignore it (privacy tools, settings, etc.)

Example: Your Pi sends `Set-Cookie: session_id=abc123`—your dashboard browser may accept and store it, or a privacy extension may block it. Set-Cookie is a request, not a command. The client may accept, store, send back later, or ignore.



## 4) Anatomy of Set-Cookie

A typical Set-Cookie header:

Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure

Parts:
	•	session_id → cookie name
	•	abc123 → cookie value
	•	Options → scope and behavior

Each option matters.

Example: Your Pi sets `Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure`—Path limits when the cookie is sent, HttpOnly blocks JavaScript, Secure limits to HTTPS. Or your dashboard: each option (Path, Domain, Secure, HttpOnly, SameSite) matters for scope and security.



## 5) Cookie Name and Value

The name identifies the cookie.
The value is opaque to the browser.

Important:
	•	The browser does not interpret the value
	•	It does not know what it means
	•	It just stores and sends it

Meaning exists only on the server.

Example: Your Pi sets a cookie value `abc123`—the browser does not interpret it; it just stores and sends it. Your Pi looks up `abc123` in session storage to know who the user is. Or your dashboard: cookie value is opaque to the browser; meaning exists only on the server.



## 6) Path Option

Path=/

Controls when the cookie is sent.

Rules:
	•	Cookie is sent only for matching paths
	•	/ means “send for all paths”
	•	/api means “only for /api and below”

Path limits exposure.

Example: Your Pi sets `Set-Cookie: session_id=abc123; Path=/api`—cookie sent only for requests to /api and below, not for /static. Or your dashboard: Path=/ means send for all paths; Path=/api means only /api and below. Path limits exposure.



## 7) Domain Option

Domain=example.com

Controls which hosts receive the cookie.

Rules:
	•	Without Domain → exact host only
	•	With Domain → subdomains may receive it

Example:
	•	example.com
	•	api.example.com
	•	www.example.com

Domain scoping is critical for security.

Example: Your Pi at dashboard.pi.local sets a cookie without Domain—only dashboard.pi.local gets it. With Domain=pi.local, subdomains like api.pi.local could receive it (intended or not). Or your homestead: domain rules must be precise; domain scoping is critical for security.



## 8) Expires and Max-Age

Cookies can persist or vanish.

Options:
	•	Expires=Wed, 01 Feb 2026 00:00:00 GMT
	•	Max-Age=3600

If neither is set:
	•	Cookie is a session cookie
	•	Deleted when browser closes

Persistent cookies survive restarts.

Example: Your Pi sets `Set-Cookie: theme=dark; Max-Age=2592000`—cookie survives browser restart for 30 days. Without Expires/Max-Age, it is a session cookie—deleted when the browser closes. Or your dashboard: Expires and Max-Age control persistence; persistent cookies survive restarts.



## 9) Secure Option

Secure

Means:
	•	Cookie is sent only over HTTPS
	•	Never over plain HTTP

Without Secure:
	•	Cookie can leak on insecure connections
	•	Session hijacking becomes trivial

Always use Secure for sensitive cookies.

Example: Your Pi sets a session cookie—must include Secure so it is sent only over HTTPS. Without Secure, cookie can leak on HTTP and session hijacking becomes trivial. Or your dashboard login: always use Secure for sensitive cookies.



## 10) HttpOnly Option

HttpOnly

Means:
	•	JavaScript cannot read the cookie
	•	document.cookie cannot access it

This protects against:
	•	XSS stealing session cookies

HttpOnly does not prevent sending—it prevents reading.

Example: Your Pi sets `Set-Cookie: session_id=abc123; HttpOnly`—JavaScript cannot read it via document.cookie, so XSS cannot steal the session. Browser still sends it on requests. Or your dashboard: HttpOnly protects against XSS stealing session cookies; it prevents reading, not sending.



## 11) SameSite Option

SameSite=Strict | Lax | None

"Site" means scheme + registrable domain (e.g. https://dashboard.pi.local and https://api.pi.local are the same site; https://evil.com is not). This option controls when the browser attaches the cookie to a request that was triggered by another origin.

	•	Strict → cookie sent only when the user navigates directly to your origin (e.g. types your URL or clicks a same-site link). No cookie on requests triggered by a link from another site.
	•	Lax → cookie sent on top-level navigations (e.g. user clicks a link to your site from email or another site). Often a reasonable default for login cookies so "remember me" works across links.
	•	None → cookie sent on cross-site requests too (e.g. embedded iframe, cross-site form POST). Requires Secure. Use only when you need cross-site behavior and have other CSRF defenses.

SameSite exists to mitigate CSRF by limiting when cookies are sent.

Example: Your Pi sets `SameSite=Strict` for the session cookie—if someone embeds your dashboard in an iframe on evil.com, the browser will not send the cookie. Your solar dashboard might use Lax so a link from your email to the dashboard still sends the cookie. SameSite is a boundary decision: who can trigger a request that carries this cookie?



## 12) Cookie Storage Is Client-Side

Important boundary reminder:

Cookies live on the client.

The server:
	•	Sends Set-Cookie
	•	Receives Cookie
	•	Does not control storage

The client:
	•	Stores cookies
	•	Chooses when to send them
	•	Can delete or alter them

The server cannot see or revoke a cookie once sent—it can only issue a new Set-Cookie (e.g. to overwrite or expire) or invalidate the session server-side when the client next presents the old cookie.

Example: Your coop controller sends Set-Cookie; your browser stores it. If you clear site data or use a different browser, that client has no cookie—the server did not "take it back." Logout works only because the server invalidates the session; the client may still have the cookie until it is deleted or expires.



## 13) Cookie Header: The Return Trip

On subsequent requests, the client sends:

Cookie: name=value; name2=value2

All cookies matching:
	•	Domain
	•	Path
	•	Security rules

Are sent automatically.

Example: Your dashboard requests `GET http://pi.local/api/config`—browser automatically attaches Cookie: session_id=abc123 if domain, path, and security rules match. No user or script action needed. Or your coop controller: if rules match, cookies are sent automatically. This is why they are powerful—and dangerous.



## 14) Cookies Are Automatic

The browser:
	•	Does not ask the user
	•	Does not ask the application
	•	Does not ask JavaScript

If rules match, cookies are sent.

This is why they are powerful—and dangerous.



## 15) Ambient Authority

Cookies are ambient authority.

Meaning:
	•	Possession = access
	•	No explicit intent required
	•	No user action needed

If a request is sent, cookies go with it.

Example: Your dashboard loads an image from your Pi—the request includes the session cookie. Or a link on another site triggers a GET to your Pi—cookies go with it (unless SameSite blocks). Cookies are ambient authority; possession = access. If a request is sent, cookies go with it.



## 16) Why Ambient Authority Is Risky

Because:
	•	Attackers can trigger requests
	•	Browsers attach cookies automatically
	•	Servers trust the cookies

This creates CSRF.

Example: A malicious site has a form that POSTs to your Pi's /api/config. Your browser sends your session cookie; your Pi trusts it and changes config. The user never intended it. Same idea for your solar dashboard or coop controller: any request the browser sends to your origin can carry cookies; if the request was triggered by another site, that is CSRF. Cookies are ambient; attackers can trigger requests; this creates CSRF.



## 17) CSRF Exists Because of Cookies

Cross-Site Request Forgery happens when:
	•	A malicious site triggers a request (e.g. form POST, or link, or script)
	•	The browser sends cookies to your origin automatically
	•	The server trusts the cookie and performs the action
	•	The user never intended that action

The cookie does not distinguish "user clicked our login form" from "user was on evil.com and a form submitted to us." So the server must not rely on the presence of a cookie alone for state-changing requests—it needs CSRF defenses (tokens, SameSite, or other checks). Chapter 2.21 returns to this when we treat headers and cookies as attack surfaces.

Example: Your dashboard user visits a bad site; the site triggers a request to your Pi with the user's cookie; your Pi performs an action (e.g. delete sensor, change coop schedule). The user never intended it. CSRF exists because cookies are sent automatically with the request.



## 18) Cookies Are Not Authentication Logic

Cookies do not authenticate.

They only:
	•	Carry identifiers
	•	Carry tokens
	•	Carry references

Authentication happens on the server.

Example: Your Pi receives Cookie: session_id=abc123—the cookie does not authenticate; the Pi looks up abc123 in session store and then decides who the user is. Or your dashboard: cookies carry identifiers/tokens; authentication happens on the server.



## 19) Session State Pattern

The most common pattern:
	1.	Client authenticates (login)
	2.	Server creates session record
	3.	Server generates session ID
	4.	Server sends session ID in cookie
	5.	Client stores cookie
	6.	Client sends cookie on every request
	7.	Server looks up session by ID

Stateless protocol. Stateful application.

Example: Your dashboard logs in; your Pi creates a session record, generates session ID, sends it in Set-Cookie; dashboard stores and sends it on every request; Pi looks up session by ID. HTTP is stateless; the application uses sessions to appear stateful. Session state pattern: stateless protocol, stateful application.



## 20) Session ID Is a Pointer

The session ID:
	•	Has no meaning by itself
	•	Is a key into server storage
	•	Points to session data

The cookie is the key, not the data.

Example: Your Pi stores session data (user_id, login_time) in Redis; the cookie only holds the session ID. The ID is a pointer—no meaning by itself, key into server storage. Or your dashboard: session ID is a pointer; the cookie is the key, not the data.



## 21) Where Session Data Lives

Common locations:
	•	In-memory store
	•	Database
	•	Redis / cache
	•	File system

The cookie never contains the data itself.

Example: Your Pi keeps session data (roles, preferences) in a database or Redis; the cookie holds only the session ID. Or your dashboard: where session data lives—in-memory, database, Redis, file system. The cookie never contains the data itself.



## 22) Why Session Data Is Server-Side

Because:
	•	Clients are untrusted
	•	Cookies can be modified
	•	Sensitive data must not be exposed

Only the identifier crosses the boundary.

Example: Your Pi does not put user_id or is_admin in the cookie—only the session ID. Clients are untrusted; cookies can be modified; sensitive data must not be exposed. Or your dashboard: why session data is server-side; only the identifier crosses the boundary.



## 23) Cookies Are Untrusted Input

Phase 0.8 again:

Cookies:
	•	Come from the client
	•	Can be forged
	•	Can be replayed
	•	Can be tampered with

Never trust cookie contents.

Example: Your Pi receives Cookie: session_id=abc123—must look it up and validate; do not trust the value. Cookies can be forged, replayed, tampered with. Or your dashboard: Phase 0.8—cookies are untrusted input; never trust cookie contents.



## 24) Never Store Authority in Cookies

Bad idea:

Cookie: is_admin=true

Because:
	•	Client can change it
	•	Server would trust it
	•	Privilege escalation occurs

Authority must be server-verified.

Example: Your Pi must never do "if cookie says is_admin then allow"—client can set is_admin=true. Authority must be looked up server-side from session data. Or your dashboard: never store authority in cookies; authority must be server-verified.



## 25) Cookies Can Be Modified

The browser:
	•	Allows editing cookies
	•	Allows deletion
	•	Allows injection via dev tools

Assume adversarial control.

Example: User can edit cookies in dev tools, delete them, or inject values. Your Pi must not rely on cookie values being unchanged. Or your dashboard: cookies can be modified; assume adversarial control.



## 26) Session Fixation Attacks

If the server accepts a session ID from the client and does not replace it at login, an attacker can fix that ID and then trick the victim into using it. Flow: attacker gets a session ID (e.g. by visiting your login page and reading the cookie or by predicting it). Attacker lures the victim to use that same session ID (e.g. link that sets the cookie or sends the victim to a page that uses it). Victim logs in; server associates the authenticated session with that ID. Attacker now has a valid logged-in session.

Defense: never trust a pre-login session ID for post-login identity. Create a new session and send a new session ID in Set-Cookie when the user successfully authenticates. That way the cookie the victim ends up with is not the one the attacker chose.

Rotate session IDs on authentication.

Example: Your Pi login handler must issue a new session ID after successful login—do not reuse the session that existed before login. Your dashboard or electric poultry net config UI: same rule. Session fixation is eliminated by rotating session IDs on authentication.



## 27) Session Expiration Matters

Sessions must expire:
	•	Inactivity timeout
	•	Absolute lifetime
	•	Logout invalidation

Otherwise:
	•	Stolen cookies remain valid
	•	Old sessions linger forever

Example: Your Pi must expire sessions (inactivity timeout, absolute lifetime, logout). Otherwise a stolen session cookie stays valid. Or your dashboard: session expiration matters; otherwise stolen cookies remain valid and old sessions linger forever.



## 28) Logout Is Server-Side

Logout means:
	•	Invalidate session server-side
	•	Not just delete cookie client-side

Deleting cookie alone is insufficient.

Example: Your dashboard user clicks Logout—your Pi must invalidate the session server-side (delete from store), not just tell the client to delete the cookie. Otherwise the session ID is still valid if replayed. Logout is server-side; deleting cookie alone is insufficient.



## 29) Cookies vs Tokens

Cookies:
	•	Automatically sent
	•	Ambient authority
	•	Browser-managed

Tokens (e.g., Authorization headers):
	•	Explicit
	•	Client-managed
	•	Often safer for APIs

Each has tradeoffs.

Example: Your dashboard (browser) uses cookies—automatically sent, ambient authority. Your ESP32 API uses Authorization: Bearer token—explicit, client-managed, no cookie/CSRF issues. Or your Pi: cookies vs tokens; each has tradeoffs.



## 30) Cookies and APIs

APIs often avoid cookies because:
	•	CSRF risk
	•	Cross-origin complexity
	•	Implicit behavior

Many APIs prefer:

Authorization: Bearer token

Explicit is safer.

Example: Your ESP32 calls your Pi API with Authorization: Bearer token, not cookies—avoids CSRF and cross-origin cookie complexity. Or your dashboard: APIs often avoid cookies; explicit (e.g. Bearer token) is safer. Cookies and APIs: explicit is safer.



## 31) Cookies and Subdomains

Improper Domain scoping can leak cookies:
	•	auth.example.com
	•	evil.example.com

Domain rules must be precise.

Example: Your Pi at auth.pi.local sets Domain=pi.local—now api.pi.local and any other subdomain gets the cookie; if one is compromised, cookie leaks. Or your dashboard: cookies and subdomains; domain rules must be precise.



## 32) Cookies and HTTPS Are Non-Negotiable

Without HTTPS:
	•	Cookies can be sniffed
	•	Session hijacking is trivial

HTTPS is mandatory for cookies carrying identity.

Example: Your dashboard logs into your Pi over HTTP—session cookie can be sniffed on the network. Over HTTPS, cookie is protected in transit. Or your coop controller: cookies and HTTPS are non-negotiable for identity.



## 33) Cookies Are Not Encrypted

Cookie values are:
	•	Plain text
	•	Base64 at best
	•	Readable by the client

Encryption must be explicit if needed.

Example: Your Pi stores a session ID in a cookie—plain text; anyone with the cookie can replay it. If you need secrecy, encrypt server-side or use opaque tokens. Or your dashboard: cookie values are plain text; encryption must be explicit if needed.



## 34) Signed Cookies

Some systems:
	•	Sign cookie values
	•	Detect tampering
	•	Avoid server storage

Even then:
	•	Data is visible
	•	Only integrity is protected

Still untrusted input.

Example: Your Pi signs a cookie so tampering is detected—integrity, not secrecy. Value is still visible; only integrity is protected. Server must still validate; signed cookies are still untrusted input. Or your dashboard: signed cookies—still untrusted input.



## 35) Cookie Size Limits

Browsers enforce limits:
	•	~4KB per cookie
	•	Limited cookies per domain

Do not store large data.

Example: Your Pi must not put a full user profile in a cookie—browsers enforce ~4KB per cookie and limit count per domain. Or your dashboard: cookie size limits; do not store large data.



## 36) Multiple Cookies per Domain

Browsers send:
	•	All matching cookies
	•	In a single Cookie header

Large cookie sets increase request size.

Example: Your Pi and dashboard might set session_id, theme, and language—all matching cookies go in one Cookie header; large cookie sets increase request size. Or your coop controller: multiple cookies per domain are sent together; keep the set small.



## 37) Cookies Affect Every Request

Images, scripts, API calls—all include cookies.

This has:
	•	Performance cost
	•	Security implications

Minimize cookie scope.

Example: Your Pi sets Path=/api and short Max-Age so the session cookie is not sent for every static asset. Or your dashboard: cookies affect every request (images, scripts, API calls); minimize cookie scope.



## 38) Cookies and Caching

Responses with cookies:
	•	Are often uncacheable
	•	Or require careful Cache-Control

Private data must not be cached publicly.

Example: Your Pi returns dashboard HTML with Set-Cookie—response should have Cache-Control: private so it is not cached by a shared proxy. Or your dashboard: cookies and caching; private data must not be cached publicly.



## 39) Cookies Break Stateless Purity

Cookies do not violate HTTP spec.

But they:
	•	Add hidden state
	•	Create implicit behavior
	•	Complicate reasoning

This is a deliberate tradeoff.

Example: Your Pi uses cookies so your dashboard can stay "logged in"—HTTP stays stateless, but the application has hidden state and implicit behavior. Or your homestead: cookies break stateless purity; this is a deliberate tradeoff.



## 40) Cookies Are a Protocol-Level Escape Hatch

They exist because:
	•	HTTP alone was insufficient
	•	Applications demanded continuity

They are powerful—and sharp.

Example: Your Pi uses cookies to maintain login state—powerful. Misused (wrong Domain, no Secure, authority in cookie)—sharp. Or your dashboard: cookies are a protocol-level escape hatch; they are powerful—and sharp.



## 41) Everything About Cookies Is a Boundary Issue

They cross:
	•	Trust boundaries
	•	Origin boundaries
	•	Time boundaries

Every cookie decision is a security decision. This is where HTTP stops being mechanical and becomes adversarial—Chapter 2.21 makes that explicit.

Example: Your Pi's choice of Path, Domain, Secure, HttpOnly, SameSite, and expiration affects trust, origin, and time boundaries. Your pig barn or cow barn dashboard, your solar panel UI, your electric poultry net config—same idea. Everything about cookies is a boundary issue; every cookie decision is a security decision.



## Reflection

When you log in to your dashboard or any app that uses cookies:
	•	What exactly is stored in the cookie—only an ID or something more?
	•	Where does the real data live (memory, database, Redis)?
	•	What happens if the cookie is stolen before it expires?
	•	What prevents reuse (server-side invalidation, expiration, rotation)?

Trace the full flow from login to the next request. Then ask the same for logout: what must the server do, and why is deleting the cookie alone not enough?



## Core Understanding
	•	HTTP is stateless
	•	Cookies ask the client to remember
	•	Cookie values are untrusted
	•	Sessions store state server-side
	•	Cookies carry identifiers, not authority
	•	Cookies are ambient and automatic
	•	Security lives at the boundary

Anchor: the cookie is the key; the server holds the data. Every cookie decision is a boundary decision.



## What's Next

Chapter 2.21 — Trust Boundaries and Security Surfaces

Where we stop treating headers, cookies, bodies, and URLs as “just data”
and start treating them as attack surfaces.

This is where HTTP stops being mechanical
and becomes adversarial.