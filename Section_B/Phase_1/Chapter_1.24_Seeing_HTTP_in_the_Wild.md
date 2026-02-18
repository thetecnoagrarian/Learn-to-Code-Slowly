# Section B Phase 1 · Chapter 1.24: Seeing HTTP in the Wild

## Learning Objectives

After this chapter, you will be able to:
- Use curl to observe raw HTTP requests and responses
- Inspect HTTP traffic using browser DevTools
- Understand the difference between what browsers do automatically and what HTTP actually requires
- Debug HTTP issues by observing actual traffic
- Recognize common HTTP patterns in real-world traffic
- Apply observation techniques to troubleshoot API and web application issues

## Key Terms

- **curl**: Command-line HTTP client that shows raw protocol behavior
- **DevTools**: Browser developer tools that reveal HTTP traffic and behavior
- **Verbose mode (-v)**: curl flag that shows full request and response details
- **Preflight request**: OPTIONS request sent by browsers before certain cross-origin requests
- **CORS**: Cross-Origin Resource Sharing, browser-enforced policy visible in HTTP headers
- **TTFB**: Time To First Byte, the waiting time between request sent and response start
- **304 Not Modified**: Status code indicating cached content is still valid

## 1) HTTP Is Observable

HTTP is not abstract. It is not theoretical. It is observable, and that is one of its greatest strengths. If something is wrong, you can see the request, you can see the response, you can see the headers, you can see the timing, and you can see what actually crossed the wire. Most confusion around HTTP comes from not looking.

Up to this point, HTTP has been described cleanly. Request lines, headers, bodies, status codes, statelessness, boundaries. All correct. And all incomplete. Because real HTTP traffic is messy. This chapter exists to collapse the gap between mental model and observable reality. You will not understand HTTP fully until you have watched it move, byte by byte, across the boundary. This chapter is not about new concepts. It is about seeing the existing ones in motion.

This chapter builds on everything in Section B Phase 1, from Chapter 1.1, which covered request-response, through Chapter 1.23, which covered REST principles. We have described HTTP cleanly: request lines, headers, bodies, status codes, statelessness, boundaries. All correct, and all incomplete. Real HTTP traffic is messy. This chapter collapses the gap between mental model and observable reality. You will not understand HTTP fully until you have watched it move, byte by byte, across the boundary. This chapter is not about new concepts. It is about seeing the existing ones in motion.

When your dashboard is slow, use curl dash v to see the actual request slash response. Your ESP32 sensor data is not arriving, check DevTools Network tab. Your coop controller API fails, inspect headers and status codes. Most confusion around HTTP comes from not looking.

## 2) curl Shows Raw HTTP

curl is a command-line HTTP client. It does almost nothing automatically. That is exactly why it is valuable. You tell it what to send. It sends that. It shows you what comes back. No UI. No abstraction. No browser behavior hidden behind convenience. When your Pi API receives a request, curl shows exactly what was sent: method, path, headers, body. Your dashboard or ESP32: curl does almost nothing automatically. No browser behavior hidden behind convenience.

A minimal curl request looks like curl https colon slash slash example dot com. This opens a TCP connection, sends a GET request, receives a response, and prints the body. You did not see headers, status line, redirects, or negotiation because you didn't ask to. curl defaults to showing only what most users care about, the response body. This is intentional: curl is a tool for fetching content, not debugging protocols. To see the protocol, you must ask explicitly.

Seeing the full exchange requires curl dash v https colon slash slash example dot com. This shows the exact request line, all request headers, the response status line, and all response headers. Everything you have been learning becomes visible. When your Pi sends a response, curl dash v shows the status line, headers, body. Your dashboard or ESP32: seeing the full exchange with dash v. Everything you have been learning becomes visible.

Look for lines starting with greater than sign. For example, greater than GET slash HTTP slash 1.1, greater than Host colon example dot com, greater than User-Agent colon curl slash 8.0.1, greater than Accept colon star slash star. That is the raw request. Method, path, version, headers. Nothing more. Nothing less. When your dashboard requests slash api slash readings, curl dash v shows greater than GET slash api slash readings HTTP slash 1.1, greater than Host colon pi dot local, greater than Accept colon application slash json. That is the raw request. Your ESP32 or coop controller: reading the request in curl output. Nothing more, nothing less.

Look for lines starting with less than sign. For example, less than HTTP slash 1.1 two hundred OK, less than Content-Type colon text slash html, less than Content-Length colon 1256. That is the raw response metadata. After the blank line comes the body. When your Pi responds, curl dash v shows less than HTTP slash 1.1 two hundred OK, less than Content-Type colon application slash json, less than Content-Length colon 256, then blank line, then body. Your dashboard or ESP32: reading the response in curl output. After the blank line comes the body.

curl does not manage cookies unless told, automatically follow redirects unless told, or hide failures. This forces you to confront what crossed the boundary, what did not, and what assumptions failed. When your ESP32 POSTs sensor data, curl shows exactly what crossed the boundary. If cookies were expected but not sent, curl reveals it. Your dashboard or coop controller: curl makes boundaries obvious. What crossed the boundary, what did not, what assumptions failed.

## 3) Redirects and curl Behavior

By default, curl does not follow redirects. Try curl http colon slash slash example dot com. You may get three hundred one Moved Permanently and Location header pointing to https colon slash slash example dot com. Nothing else happens. When your dashboard requests http colon slash slash pi dot local slash api slash config, curl shows three hundred one Moved Permanently, Location colon https colon slash slash pi dot local slash api slash config. Nothing else happens. Your ESP32 or coop controller: following redirects explicitly. By default curl does not follow redirects. Nothing else happens.

To follow redirects, use curl dash L http colon slash slash example dot com. Now curl behaves more like a browser. Browsers follow redirects automatically. curl does not. Neither is more correct. They encode different assumptions. Understanding HTTP means understanding these choices. When your dashboard browser follows redirects automatically, curl does not unless you use dash L. Your solar dashboard or poultry net config: this is a design choice. Understanding HTTP means understanding these choices.

## 4) Controlling Requests with curl

You can add headers explicitly. For example, curl dash H Accept colon application slash json https colon slash slash api dot example dot com slash status. Now you are controlling content negotiation and server behavior. This is how you test APIs properly. When your ESP32 needs JSON, curl dash H Accept colon application slash json https colon slash slash pi dot local slash api slash readings. Your dashboard or coop controller: sending headers explicitly. This is how you test APIs properly.

POST example: curl dash X POST backslash dash H Content-Type colon application slash json backslash dash d single quote curly brace voltage colon 12.1 curly brace single quote https colon slash slash api dot example dot com slash readings. You explicitly provided method, Content-Type, and body. Nothing implicit. Nothing hidden. When your ESP32 POSTs temperature data, curl dash X POST dash H Content-Type colon application slash json dash d single quote curly brace temp colon 72.5 curly brace single quote https colon slash slash pi dot local slash api slash readings. You explicitly provided method, Content-Type, body. Your dashboard: sending bodies with curl. Nothing implicit, nothing hidden.

When something fails, use curl, reduce variables, and observe raw behavior. If curl works and your app doesn't, the bug is in your code. If curl fails, the problem is elsewhere. When your dashboard app fails, but curl works, bug is in your code. curl fails too, problem is network, server, or configuration. Your ESP32 or coop controller: curl as a debugging instrument. If curl works and your app doesn't, the bug is in your code. If curl fails, the problem is elsewhere.

## 5) Browser DevTools Reveals Automatic Behavior

Browsers are high-level HTTP clients. They do many things automatically: redirects, cookies, caching, compression, and security enforcement. DevTools lets you see those behaviors. When your dashboard browser automatically handles redirects, cookies, caching, compression, security, DevTools Network tab shows all of it. Your solar dashboard or poultry net config: browser DevTools. DevTools lets you see those behaviors.

In most browsers, right click then Inspect, or F12, then open the Network tab. Reload the page. Now you are watching HTTP happen. When your dashboard loads pi dot local, open DevTools Network tab, reload. See HTML request, then CSS, JavaScript, images, API calls. Your coop controller or ESP32: opening DevTools. Now you are watching HTTP happen.

Load a simple webpage. You will see HTML request, CSS requests, JavaScript requests, image requests, font requests, and analytics requests. HTTP is chatty. When your dashboard loads a simple page, see HTML, CSS, JavaScript, images, fonts, analytics requests. Your solar dashboard or poultry net config: the first surprise, quantity. HTTP is chatty.

Usually, the first request is a GET for the HTML document, and everything else is triggered by that response. This reveals dependency graphs, not linear flows. When your dashboard loads, first request is GET for HTML, then HTML triggers CSS, JS, images. Your ESP32 or coop controller: the first request is special. This reveals dependency graphs, not linear flows.

Click a request. You will see request headers, response headers, status code, body, and timing breakdown. Everything you've studied, now concrete. When your dashboard inspects a request, see request headers, response headers, status code, body, timing breakdown. Your ESP32 or coop controller: inspecting a single request. Everything you've studied, now concrete.

## 6) Headers and Compression

You will see headers you did not explicitly set: User-Agent, Accept, Accept-Encoding, and Connection. These are defaults. Defaults matter. When your dashboard sends User-Agent, Accept, Accept-Encoding, Connection headers automatically. Your ESP32 or coop controller: headers you didn't write. These are defaults, and defaults matter.

Browsers usually send Accept-Encoding colon gzip comma deflate comma br. Servers respond with compressed bodies. DevTools may show decoded content, but the wire carried compressed bytes. This matters for performance, debugging, and security. When your Pi compresses responses, DevTools shows decoded content, but wire carried compressed bytes. Your dashboard or ESP32: Accept-Encoding and compression. This matters for performance, debugging, and security.

## 7) Redirects, Caching, and Conditional Requests

Click a redirected request. You may see three hundred one to three hundred two to two hundred, multiple Location headers, and automatic following. The browser hides this by default. DevTools reveals it. When your dashboard follows a redirect chain, DevTools shows three hundred one to three hundred two to two hundred, multiple Location headers. Browser hides it. DevTools reveals it. Your coop controller or poultry net config: seeing redirect chains. DevTools reveals it.

Reload a page. Some requests return three hundred four Not Modified, no body, and instant timing. This is caching working. Not magic. Just headers. When your dashboard reloads, some requests return three hundred four Not Modified, no body, instant timing. Your solar dashboard or ESP32: caching in action. Not magic, just headers.

You will see request headers like If-None-Match and If-Modified-Since. And responses like three hundred four Not Modified. This is client and server cooperating. When your dashboard sends If-None-Match header, your Pi responds with three hundred four Not Modified if unchanged. Your ESP32 or coop controller: conditional requests are visible. This is client and server cooperating.

## 8) Timing and Performance

DevTools shows DNS lookup time, TCP connection time, TLS handshake, request sent, waiting, TTFB, and content download. Slowness is not one thing. It has phases. When your dashboard request is slow, DevTools shows DNS lookup, TCP connection, TLS handshake, request sent, waiting, TTFB, content download. Your solar dashboard or poultry net config: timing tells stories. Slowness is not one thing, it has phases.

When something fails, status code visible, response body visible, and error headers visible. This is why HTTP debugging is tractable. When your ESP32 request fails, DevTools shows status code, four hundred, four hundred four, five hundred, response body, error headers. Your dashboard or coop controller: seeing failures clearly. This is why HTTP debugging is tractable.

## 9) CORS and OPTIONS Requests

You may see OPTIONS requests, preflight checks, and Access-Control-Allow-* headers. This is browser-enforced policy, not HTTP itself. Important distinction. When your dashboard sees OPTIONS requests, preflight checks, Access-Control-Allow-* headers, this is browser-enforced policy, CORS, not HTTP itself. Your ESP32 or coop controller: CORS, the first what is that moment. Important distinction.

OPTIONS requests are real requests. They are not imaginary. They obey request lines, headers, and responses. They exist to ask: is this allowed? When your dashboard sends OPTIONS request before POST, this is a real HTTP request. Your ESP32 or coop controller: OPTIONS requests are real requests. They exist to ask: is this allowed?

Just because the browser did it automatically does not mean HTTP rules disappeared, and does not mean you can ignore them. Automatic does not equal invisible. When your dashboard browser automatically sends cookies, follows redirects, caches responses, but these are still HTTP requests slash responses. Your ESP32 or coop controller: automatic behavior is still HTTP. Automatic does not equal invisible.

## 10) Comparing curl and Browser Behavior

curl is explicit, minimal, and predictable. Browser is automatic, stateful, and policy-enforcing. Both are correct. They serve different roles. When your ESP32 uses curl, explicit, minimal, predictable. Your dashboard uses browser, automatic, stateful, policy-enforcing. Your coop controller: comparing curl and browser behavior. Both are correct, they serve different roles.

When building API clients, servers, or web apps, you must inspect your own traffic. Never trust assumptions. Look. When your Pi API client fails, inspect traffic with curl or DevTools. Your dashboard or ESP32: inspecting your own applications. Never trust assumptions, look.

On servers, log request line, log headers, and log status code. Not forever. Not in production verbosely. But during development, visibility beats guessing. When your Pi logs request line, headers, status code during development. Your dashboard or coop controller: logging raw requests and responses. Visibility beats guessing.

## 11) Common Surprises and Framework Behavior

Common surprises you will encounter include headers added by proxies, headers removed by frameworks, Content-Type mismatches, implicit redirects, and cookie scoping issues. These are normal. When your Pi receives headers added by proxies, Content-Type mismatches, implicit redirects, cookie scoping issues. Your dashboard or ESP32: common surprises you will encounter. These are normal.

Express, Flask, FastAPI wrap HTTP, provide convenient abstractions like routes, middleware, request slash response objects, but do not replace it. HTTP still happens: TCP connections, request lines, headers, bodies, status codes. If something goes wrong, drop down a layer, bypass the framework, use curl or raw socket inspection, and inspect raw behavior, see what actually crossed the wire.

Frameworks make HTTP easier to use, but they can also hide problems. When debugging, you must see past the abstraction to the actual HTTP exchange. Your framework's logs may say route not found, but curl shows the actual four hundred four response with headers and body. When your Pi uses Express or Flask, framework wraps HTTP but does not replace it. If something goes wrong, drop down a layer, inspect raw behavior.

## 12) Debugging Strategy and Mental Model

When confused, reproduce with curl, remove headers, add headers back one by one, and observe changes. This is scientific method applied to protocols. When your ESP32 API call fails, reproduce with curl, remove headers, add back one by one, observe changes. Your dashboard or coop controller: debugging strategy, strip it down. This is scientific method applied to protocols.

What you should now feel intuitively: requests initiate, responses terminate, headers modify meaning, bodies carry representations, status codes signal outcomes, and failures split into HTTP errors versus network absence. You are no longer guessing. When your dashboard requests initiate, responses terminate, headers modify meaning, bodies carry representations, status codes signal outcomes. Your ESP32 or coop controller: mental model reinforced. You are no longer guessing.

## Common Pitfalls

Not looking at actual HTTP traffic causes confusion. Most HTTP problems are visible if you inspect the traffic. Use curl dash v or DevTools to see what actually crossed the wire. Assumptions about what headers were sent or what status codes were returned are often wrong.

Ignoring automatic browser behavior causes misunderstandings. Browsers add headers, follow redirects, and cache responses automatically. This is still HTTP, just automatic. Use DevTools to see what the browser actually did. Don't assume curl behavior matches browser behavior.

Not understanding compression causes debugging problems. DevTools may show decoded content, but the wire carried compressed bytes. This affects performance, debugging, and security analysis. Check Content-Encoding headers to see if compression was used.

Confusing framework abstractions with HTTP causes problems. Frameworks wrap HTTP but don't replace it. When debugging, drop down to raw HTTP using curl or socket inspection. Framework logs may hide actual HTTP behavior.

Not using curl for API testing causes incomplete testing. curl shows exactly what was sent and received, without browser or framework abstractions. Use curl to test APIs directly, then compare with application behavior.

## Summary

HTTP is not hidden. It is observable. curl and DevTools expose raw requests, raw responses, real failures, automatic behavior, and performance characteristics. Diagrams teach structure. Observation teaches truth. HTTP is observable. curl and DevTools show raw requests, raw responses, real failures, automatic behavior, performance characteristics. When something is wrong, look. When something is slow, measure. When something is confusing, inspect. Observation collapses the gap between mental model and reality. curl shows explicit, minimal HTTP behavior. Browsers add automatic behavior, but it's still HTTP. DevTools reveals what browsers do automatically. Understanding both perspectives is essential for debugging and building HTTP systems. You now have a protocol-level mental model of HTTP, a boundary-first understanding of web communication, and the ability to inspect, debug, and reason about real traffic.

## Next

This chapter built on everything in Section B Phase 1, from Chapter 1.1 through Chapter 1.23. You now have a protocol-level mental model of HTTP, a boundary-first understanding of web communication, and the ability to inspect, debug, and reason about real traffic. Section B Phase 2 will build on top of this, not replace it. Next, Section B Phase 2 explores building servers and APIs, where you become the server, not just the observer.
