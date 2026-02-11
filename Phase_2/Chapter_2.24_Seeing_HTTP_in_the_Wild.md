# Phase 2 · Chapter 2.24: Seeing HTTP in the Wild

This chapter builds on everything in Phase 2—from [Chapter 2.1: Request-Response](Chapter_2.1_Request-Response.md) through [Chapter 2.23: REST Principles](Chapter_2.23_REST_Principles.md). We have described HTTP cleanly: request lines, headers, bodies, status codes, statelessness, boundaries. All correct—and all incomplete. Real HTTP traffic is messy. This chapter collapses the gap between mental model and observable reality. You will not understand HTTP fully until you have watched it move—byte by byte—across the boundary. This chapter is not about new concepts; it is about seeing the existing ones in motion.

Up to this point, HTTP has been described cleanly.

Request lines.
Headers.
Bodies.
Status codes.
Statelessness.
Boundaries.

All correct.

And all incomplete.

Because real HTTP traffic is messy.

This chapter exists to collapse the gap between mental model and observable reality. You will not understand HTTP fully until you have watched it move—byte by byte—across the boundary.

This chapter is not about new concepts.
It is about seeing the existing ones in motion.



## 1) Why Observation Matters

HTTP is not abstract.

It is not theoretical.

It is observable, and that is one of its greatest strengths.

If something is wrong:
	•	You can see the request
	•	You can see the response
	•	You can see the headers
	•	You can see the timing
	•	You can see what actually crossed the wire

Most confusion around HTTP comes from not looking.

Example: Your dashboard is slow—use curl -v to see the actual request/response. Your ESP32 sensor data is not arriving—check DevTools Network tab. Your coop controller API fails—inspect headers and status codes. Most confusion around HTTP comes from not looking.



## 2) curl: The Sharpest Tool in the Box

curl is a command-line HTTP client.

It does almost nothing automatically.

That is exactly why it is valuable.

You tell it what to send.
It sends that.
It shows you what comes back.

No UI.
No abstraction.
No browser behavior hidden behind convenience.

Example: Your Pi API receives a request—curl shows exactly what was sent: method, path, headers, body. Your dashboard or ESP32: curl does almost nothing automatically; no browser behavior hidden behind convenience.



## 3) A Minimal curl Request

curl https://example.com

This:
	•	Opens a TCP connection
	•	Sends a GET request
	•	Receives a response
	•	Prints the body

You did not see:
	•	Headers
	•	Status line
	•	Redirects
	•	Negotiation

Because you didn’t ask to.

curl defaults to showing only what most users care about—the response body. This is intentional: curl is a tool for fetching content, not debugging protocols. To see the protocol, you must ask explicitly.



## 4) Seeing the Full Exchange with -v

curl -v https://example.com

This shows:
	•	The exact request line
	•	All request headers
	•	The response status line
	•	All response headers

Everything you have been learning becomes visible.

Example: Your Pi sends a response—curl -v shows the status line, headers, body. Your dashboard or ESP32: seeing the full exchange with -v; everything you have been learning becomes visible.



## 5) Reading the Request in curl Output

Look for lines starting with >.

Example:

> GET / HTTP/1.1
> Host: example.com
> User-Agent: curl/8.0.1
> Accept: */*

That is the raw request.

Method.
Path.
Version.
Headers.

Nothing more.
Nothing less.

Example: Your dashboard requests /api/readings—curl -v shows > GET /api/readings HTTP/1.1, > Host: pi.local, > Accept: application/json. That is the raw request. Your ESP32 or coop controller: reading the request in curl output; nothing more, nothing less.



## 6) Reading the Response in curl Output

Look for lines starting with <.

Example:

< HTTP/1.1 200 OK
< Content-Type: text/html
< Content-Length: 1256

That is the raw response metadata.

After the blank line comes the body.

Example: Your Pi responds—curl -v shows < HTTP/1.1 200 OK, < Content-Type: application/json, < Content-Length: 256, then blank line, then body. Your dashboard or ESP32: reading the response in curl output; after the blank line comes the body.



## 7) curl Makes Boundaries Obvious

curl does not:
	•	Manage cookies unless told
	•	Automatically follow redirects unless told
	•	Hide failures

This forces you to confront:
	•	What crossed the boundary
	•	What did not
	•	What assumptions failed

Example: Your ESP32 POSTs sensor data—curl shows exactly what crossed the boundary. If cookies were expected but not sent, curl reveals it. Your dashboard or coop controller: curl makes boundaries obvious; what crossed the boundary, what did not, what assumptions failed.



## 8) Following Redirects Explicitly

By default, curl does not follow redirects.

Try:

curl http://example.com

You may get:
	•	301 Moved Permanently
	•	Location header pointing to https://example.com

Nothing else happens.

Example: Your dashboard requests http://pi.local/api/config—curl shows 301 Moved Permanently, Location: https://pi.local/api/config. Nothing else happens. Your ESP32 or coop controller: following redirects explicitly; by default curl does not follow redirects; nothing else happens.

To follow redirects:

curl -L http://example.com

Now curl behaves more like a browser.



## 9) This Is a Design Choice

Browsers follow redirects automatically.

curl does not.

Neither is “more correct.”

They encode different assumptions.

Understanding HTTP means understanding these choices.

Example: Your dashboard browser follows redirects automatically; curl does not unless you use -L. Your solar dashboard or poultry net config: this is a design choice; understanding HTTP means understanding these choices.



## 10) Sending Headers Explicitly

You can add headers:

curl -H "Accept: application/json" https://api.example.com/status

Now you are controlling:
	•	Content negotiation
	•	Server behavior

This is how you test APIs properly.

Example: Your ESP32 needs JSON—curl -H "Accept: application/json" https://pi.local/api/readings. Your dashboard or coop controller: sending headers explicitly; this is how you test APIs properly.



## 11) Sending Bodies with curl

POST example:

curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"voltage":12.1}' \
     https://api.example.com/readings

You explicitly provided:
	•	Method
	•	Content-Type
	•	Body

Nothing implicit.
Nothing hidden.

Example: Your ESP32 POSTs temperature data—curl -X POST -H "Content-Type: application/json" -d '{"temp":72.5}' https://pi.local/api/readings. You explicitly provided method, Content-Type, body. Your dashboard: sending bodies with curl; nothing implicit, nothing hidden.



## 12) curl as a Debugging Instrument

When something fails:
	•	Use curl
	•	Reduce variables
	•	Observe raw behavior

If curl works and your app doesn’t, the bug is in your code.
If curl fails, the problem is elsewhere.

Example: Your dashboard app fails, but curl works—bug is in your code. curl fails too—problem is network, server, or configuration. Your ESP32 or coop controller: curl as a debugging instrument; if curl works and your app doesn't, the bug is in your code. If curl fails, the problem is elsewhere.



## 13) Browser DevTools: The Other Perspective

Browsers are high-level HTTP clients.

They do many things automatically:
	•	Redirects
	•	Cookies
	•	Caching
	•	Compression
	•	Security enforcement

DevTools lets you see those behaviors.

Example: Your dashboard browser automatically handles redirects, cookies, caching, compression, security. DevTools Network tab shows all of it. Your solar dashboard or poultry net config: browser DevTools; DevTools lets you see those behaviors.



## 14) Opening DevTools

In most browsers:
	•	Right click → Inspect
	•	Or F12
	•	Open the Network tab

Reload the page.

Now you are watching HTTP happen.

Example: Your dashboard loads pi.local—open DevTools Network tab, reload. See HTML request, then CSS, JavaScript, images, API calls. Your coop controller or ESP32: opening DevTools; now you are watching HTTP happen.



## 15) The First Surprise: Quantity

Load a “simple” webpage.

You will see:
	•	HTML request
	•	CSS requests
	•	JavaScript requests
	•	Image requests
	•	Font requests
	•	Analytics requests

HTTP is chatty.

Example: Your dashboard loads a "simple" page—see HTML, CSS, JavaScript, images, fonts, analytics requests. Your solar dashboard or poultry net config: the first surprise—quantity; HTTP is chatty.



## 16) The First Request Is Special

Usually:
	•	The first request is a GET for the HTML document
	•	Everything else is triggered by that response

This reveals dependency graphs, not linear flows.

Example: Your dashboard loads—first request is GET for HTML, then HTML triggers CSS, JS, images. Your ESP32 or coop controller: the first request is special; this reveals dependency graphs, not linear flows.



## 17) Inspecting a Single Request

Click a request.

You will see:
	•	Request headers
	•	Response headers
	•	Status code
	•	Body
	•	Timing breakdown

Everything you’ve studied—now concrete.



## 18) Headers You Didn’t Write

You will see headers you did not explicitly set:
	•	User-Agent
	•	Accept
	•	Accept-Encoding
	•	Connection

These are defaults.

Defaults matter.

Example: Your dashboard sends User-Agent, Accept, Accept-Encoding, Connection headers automatically. Your ESP32 or coop controller: headers you didn't write; these are defaults, and defaults matter.



## 19) Accept-Encoding and Compression

Browsers usually send:

Accept-Encoding: gzip, deflate, br

Servers respond with compressed bodies.

DevTools may show decoded content—but the wire carried compressed bytes.

This matters for:
	•	Performance
	•	Debugging
	•	Security

Example: Your Pi compresses responses—DevTools shows decoded content, but wire carried compressed bytes. Your dashboard or ESP32: Accept-Encoding and compression; this matters for performance, debugging, and security.



## 20) Seeing Redirect Chains

Click a redirected request.

You may see:
	•	301 → 302 → 200
	•	Multiple Location headers
	•	Automatic following

The browser hides this by default.
DevTools reveals it.

Example: Your dashboard follows a redirect chain—DevTools shows 301 → 302 → 200, multiple Location headers. Browser hides it; DevTools reveals it. Your coop controller or poultry net config: seeing redirect chains; DevTools reveals it.



## 21) Caching in Action

Reload a page.

Some requests return:
	•	304 Not Modified
	•	No body
	•	Instant timing

This is caching working.

Not magic.
Just headers.

Example: Your dashboard reloads—some requests return 304 Not Modified, no body, instant timing. Your solar dashboard or ESP32: caching in action; not magic, just headers.



## 22) Conditional Requests Are Visible

You will see request headers like:
	•	If-None-Match
	•	If-Modified-Since

And responses:
	•	304 Not Modified

This is client and server cooperating.

Example: Your dashboard sends If-None-Match header—your Pi responds with 304 Not Modified if unchanged. Your ESP32 or coop controller: conditional requests are visible; this is client and server cooperating.



## 23) Timing Tells Stories

DevTools shows:
	•	DNS lookup time
	•	TCP connection time
	•	TLS handshake
	•	Request sent
	•	Waiting (TTFB)
	•	Content download

Slowness is not one thing.
It has phases.

Example: Your dashboard request is slow—DevTools shows DNS lookup, TCP connection, TLS handshake, request sent, waiting (TTFB), content download. Your solar dashboard or poultry net config: timing tells stories; slowness is not one thing, it has phases.



## 24) Seeing Failures Clearly

When something fails:
	•	Status code visible
	•	Response body visible
	•	Error headers visible

This is why HTTP debugging is tractable.

Example: Your ESP32 request fails—DevTools shows status code (400, 404, 500), response body, error headers. Your dashboard or coop controller: seeing failures clearly; this is why HTTP debugging is tractable.



## 25) CORS: The First “What Is That?” Moment

You may see:
	•	OPTIONS requests
	•	Preflight checks
	•	Access-Control-Allow-* headers

This is browser-enforced policy, not HTTP itself.

Important distinction.

Example: Your dashboard sees OPTIONS requests, preflight checks, Access-Control-Allow-* headers—this is browser-enforced policy (CORS), not HTTP itself. Your ESP32 or coop controller: CORS—the first "what is that?" moment; important distinction.



## 26) OPTIONS Requests Are Real Requests

They are not imaginary.

They obey:
	•	Request lines
	•	Headers
	•	Responses

They exist to ask: “Is this allowed?”



## 27) Automatic Behavior Is Still HTTP

Just because the browser did it automatically:
	•	Does not mean HTTP rules disappeared
	•	Does not mean you can ignore them

Automatic ≠ invisible.

Example: Your dashboard browser automatically sends cookies, follows redirects, caches responses—but these are still HTTP requests/responses. Your ESP32 or coop controller: automatic behavior is still HTTP; automatic ≠ invisible.



## 28) Comparing curl and Browser Behavior

curl:
	•	Explicit
	•	Minimal
	•	Predictable

Browser:
	•	Automatic
	•	Stateful
	•	Policy-enforcing

Both are correct.
They serve different roles.

Example: Your ESP32 uses curl—explicit, minimal, predictable. Your dashboard uses browser—automatic, stateful, policy-enforcing. Your coop controller: comparing curl and browser behavior; both are correct, they serve different roles.



## 29) Inspecting Your Own Applications

When building:
	•	API clients
	•	Servers
	•	Web apps

You must inspect your own traffic.

Never trust assumptions.
Look.

Example: Your Pi API client fails—inspect traffic with curl or DevTools. Your dashboard or ESP32: inspecting your own applications; never trust assumptions, look.



## 30) Logging Raw Requests and Responses

On servers:
	•	Log request line
	•	Log headers
	•	Log status code

Not forever.
Not in production verbosely.

But during development:
	•	Visibility beats guessing.

Example: Your Pi logs request line, headers, status code during development. Your dashboard or coop controller: logging raw requests and responses; visibility beats guessing.



## 31) Common Surprises You Will Encounter
	•	Headers added by proxies
	•	Headers removed by frameworks
	•	Content-Type mismatches
	•	Implicit redirects
	•	Cookie scoping issues

These are normal.

Example: Your Pi receives headers added by proxies, Content-Type mismatches, implicit redirects, cookie scoping issues. Your dashboard or ESP32: common surprises you will encounter; these are normal.



## 32) Frameworks Abstract—but Do Not Remove—HTTP

Express, Flask, FastAPI:
	•	Wrap HTTP (provide convenient abstractions like routes, middleware, request/response objects)
	•	Do not replace it (HTTP still happens—TCP connections, request lines, headers, bodies, status codes)

If something goes wrong:
	•	Drop down a layer (bypass the framework, use curl or raw socket inspection)
	•	Inspect raw behavior (see what actually crossed the wire)

Frameworks make HTTP easier to use, but they can also hide problems. When debugging, you must see past the abstraction to the actual HTTP exchange. Your framework's logs may say "route not found," but curl shows the actual 404 response with headers and body.

Example: Your Pi uses Express or Flask—framework wraps HTTP but does not replace it. If something goes wrong, drop down a layer, inspect raw behavior.



## 33) Debugging Strategy: Strip It Down

When confused:
	1.	Reproduce with curl
	2.	Remove headers
	3.	Add headers back one by one
	4.	Observe changes

This is scientific method applied to protocols.

Example: Your ESP32 API call fails—reproduce with curl, remove headers, add back one by one, observe changes. Your dashboard or coop controller: debugging strategy—strip it down; this is scientific method applied to protocols.



## 34) Mental Model Reinforced

What you should now feel intuitively:
	•	Requests initiate
	•	Responses terminate
	•	Headers modify meaning
	•	Bodies carry representations
	•	Status codes signal outcomes
	•	Failures split into HTTP errors vs network absence

You are no longer guessing.

Example: Your dashboard requests initiate, responses terminate, headers modify meaning, bodies carry representations, status codes signal outcomes. Your ESP32 or coop controller: mental model reinforced; you are no longer guessing.



## Reflection

Open DevTools right now (or use curl -v on your Pi API).

Pick one request—maybe your dashboard loading sensor data, or your ESP32 POSTing a reading, or your coop controller fetching config.

Walk through it completely:
	•	Who initiated? (Browser, ESP32, curl, another service)
	•	What method? (GET, POST, PUT, DELETE, OPTIONS)
	•	What path? (/api/sensors/alpha, /api/readings, /api/configs/coop)
	•	What headers? (Accept, Content-Type, Authorization, Cookie, User-Agent—which did you set, which are defaults?)
	•	What status? (200 OK, 201 Created, 404 Not Found, 500 Server Error)
	•	What body? (Request body if POST/PUT, response body—what format? JSON? Plain text?)
	•	Was it cached? (304 Not Modified? Cache-Control headers? ETag?)
	•	Was it redirected? (301, 302, 307, 308? How many hops?)

Then ask: what would curl show differently? What headers did the browser add automatically? What would happen if you changed the Accept header? What if you removed cookies? If you can answer those, you understand HTTP in practice.



## Core Understanding

HTTP is not hidden.

It is observable.

curl and DevTools expose:
	•	Raw requests
	•	Raw responses
	•	Real failures
	•	Automatic behavior
	•	Performance characteristics

Diagrams teach structure.
Observation teaches truth.

Anchor: HTTP is observable—curl and DevTools show raw requests, raw responses, real failures, automatic behavior, performance characteristics. When something is wrong, look. When something is slow, measure. When something is confusing, inspect. Observation collapses the gap between mental model and reality.



## Phase 2 Complete

You now have:
	•	A protocol-level mental model of HTTP
	•	A boundary-first understanding of web communication
	•	The ability to inspect, debug, and reason about real traffic

Phase 3 will build on top of this, not replace it.

Next:
Phase 3 — Building Servers and APIs

Where you become the server, not just the observer.