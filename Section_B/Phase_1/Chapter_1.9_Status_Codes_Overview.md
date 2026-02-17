# Section B Phase 1 · Chapter 1.9: Status Codes Overview

Status codes are not messages, explanations, or opinions. They are signals. They are how the server tells the client what happened at the protocol boundary—nothing more, nothing less. If you misunderstand status codes, you will misdiagnose failures, retry when you should not, stop when you should retry, and blame the wrong side of the system.

## Learning Objectives

By the end of this chapter, you should be able to:
- Explain status codes as machine signals that drive client behavior (retry, redirect, abort).
- Describe the five classes: 1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error.
- Distinguish absence of response (transport failure) from HTTP error responses.
- Apply the rule: 4xx means fix the request; 5xx means retry may help; 2xx means do not retry automatically.

## Key Terms

- **Status code** — Three-digit integer. The first digit defines the class. The number drives client behavior, not the reason phrase.
- **4xx** — Client error. The request reached the server; the server refuses or cannot fulfill it due to client-side issues. Fix the request.
- **5xx** — Server error. The request was valid; the server failed while processing it. Retry may help.

This chapter exists to lock in a correct mental model. Chapter 1.8 showed response structure; this chapter focuses on the status code—the most important signal in the response. Whether your Pi responds to voltage queries, your ESP32 receives confirmations, or your coop controller gets fence status, status codes work the same way.

## 1) Status Codes Are Part of the Contract

When a server responds, it must choose a status code. That choice is part of the HTTP contract. The status code tells the client: did the request reach the server? Did the server understand it? Did the server act on it? Who is responsible for the outcome? Everything else in the response is secondary. Status codes are designed for clients first. Humans may see 404 Not Found. The client—your dashboard, ESP32, coop controller—sees 404. The number drives behavior. Your dashboard checks if status code equals 404 to decide what to do, not the text Not Found.

The first digit defines the class of outcome: 2xx success, 3xx redirection, 4xx client-side failure, 5xx server-side failure. This classification is deliberate and fundamental. Every status code answers one core question: did the request complete successfully, and if not, where did it fail? Not: was the data good, was the server happy, did the user get what they wanted. Just: what happened to the request.

## 2) 1xx and 2xx

The 1xx range exists but most developers rarely encounter it. 1xx codes mean the request was received, processing is continuing, no final outcome yet. 100 Continue, 101 Switching Protocols. Know they exist, know they are transitional, know they are rare in practice.

A 2xx status means the request reached the server, the server understood it, and the server acted on it successfully. This is protocol-level success. Critical: 2xx does not mean everything is fine. A 2xx response does not mean the resource contained meaningful data (200 OK with voltage null—request succeeded, sensor returned null), the user got what they expected (200 OK with HTML error page instead of JSON), or the system state is ideal (200 OK with error sensor offline—request processed, sensor is down). It only means the request was handled successfully. Your dashboard sends a voltage request and gets 200 OK with voltage null. The request succeeded. The data indicates the sensor returned null. Success at the protocol level, not necessarily useful data.

200 OK means the request succeeded and the response contains a representation of the resource. This is the most common status code. Your Pi responds 200 OK when your dashboard fetches voltage successfully, when your ESP32 reports temperature and the server processes it, or when your solar logger returns production data. Your coop controller might get 200 OK with fence status. 201 Created means the request succeeded and a new resource was created. Usually paired with POST and a Location header. Your ESP32 sends POST to register a new sensor. Your Pi responds 201 Created with Location pointing to the new resource. Your drip irrigation controller might POST a schedule and get 201 if a new schedule was created. 204 No Content means the request succeeded and there is no response body. This is intentional, not an error. Used when an update succeeded or nothing needs to be returned. Your dashboard sends DELETE for a sensor. Your Pi responds 204 No Content. Your poultry net API might return 204 after a successful config update. In general, 2xx means do not retry automatically. The request worked. Retrying may cause duplicate actions. Your ESP32 sends POST for temperature and gets 200 OK. Retrying would send the same reading twice. Do not retry success.

## 3) 3xx Redirection

A 3xx status means the request was valid and the server wants the client to take another step. This is not a failure. It is guidance. A redirect is the server saying: what you want exists, but not here. The server must tell the client where to go next. That information is in headers, not the status code alone.

301 Moved Permanently means the resource has permanently moved. Clients should update bookmarks. Caches may store this redirect. Your dashboard requests voltage, but your Pi moved it to a new path. Responds 301 with Location header. Your dashboard should update its code—this is permanent. 302 Found means the resource is temporarily elsewhere. The client should not assume permanence. Common in login flows and temporary routing. 304 Not Modified is special: the client's cached version is still valid, no body is sent, the client should reuse its cache. This saves bandwidth. Your dashboard requests voltage with If-None-Match. Your Pi checks—data has not changed. Responds 304 with no body. Many people treat redirects as errors. They are not. Redirects are successful control-flow signals.

## 4) 4xx Client Error

A 4xx status means the request reached the server, the server understood it, and the server refuses or cannot process it due to client-side issues. The core rule: 4xx means the client must change something. Retrying the same request will usually fail again. Your ESP32 sends a voltage request without auth and gets 401 Unauthorized. Retrying with no auth will fail again. Fix the request—add the Authorization header. Your dashboard requests a nonexistent path and gets 404 Not Found. Retrying will not help. Fix the path.

400 Bad Request means the request was malformed—invalid syntax, missing required fields, unparseable body. The server could not understand the request as sent. Your ESP32 sends POST with malformed JSON (missing closing brace). Your Pi responds 400. Your coop controller sends a PUT with invalid JSON structure. 400. 401 Unauthorized means authentication is required; credentials are missing or invalid. 401 often includes a WWW-Authenticate header. It does not mean forbidden. Your ESP32 sends a voltage request without Authorization. Your Pi responds 401. The ESP32 must include a valid token. 403 Forbidden means the server understood who you are but you are not allowed to do this. Authentication succeeded; authorization failed. Your ESP32 authenticates but tries DELETE on an admin-only resource. Your Pi responds 403. Your dashboard might get 403 when trying to access another user's sensor. 404 Not Found means the server cannot find the requested resource. The path does not map to anything. It does not say whether the resource existed before or might exist later. Your dashboard sends a request to a nonexistent path. Your ESP32 requests a sensor that does not exist. 404. 4xx errors are not server failures. The server is functioning correctly. It is enforcing rules. Blaming the server for 401 is usually incorrect. The Pi is working—it is enforcing authentication. The ESP32 needs to fix its request.

## 5) 5xx Server Error

A 5xx status means the request was valid and the server failed while handling it. This is the server admitting fault. 500 Internal Server Error means something went wrong, the server cannot provide more detail, and the failure occurred after request parsing. This is the generic server failure. Your dashboard sends a voltage request, but the Pi's sensor reading code crashes. Your Pi responds 500. 502 Bad Gateway means the server is acting as a gateway or proxy and an upstream service failed. Your dashboard requests from a reverse proxy. The proxy forwards to your Pi, but the Pi is down. The proxy responds 502. 503 Service Unavailable means the server is temporarily unable to handle the request—often overload or maintenance. Clients may retry later. Your Pi is rebooting. Your ESP32 sends POST. Your Pi responds 503. The ESP32 should retry after a delay.

In general: 5xx means retry might succeed. 4xx means retry will likely fail. 2xx means retry may cause harm. This matters for automation. Your ESP32 sends temperature readings every five minutes. If it gets 503, it should retry after a delay—the server might recover. If it gets 401, retrying will not help—fix the auth token first. Your freezer sensor API might get 502 from a reverse proxy when the backend Pi is rebooting—retry later. Your coop controller gets 500 when the fence logic crashes—retry might work once the server recovers. The status code drives the retry decision. Wrong status codes break automation.

## 6) Responsibility and Absence

Status codes encode responsibility: 2xx means no one failed, 3xx means coordination required, 4xx means client responsibility, 5xx means server responsibility, no response means network or transport failure. Absence is not a status code. If the connection times out, DNS fails, or the network drops, there is no status code. This is not 5xx. It is absence. A missing response means the server may never have seen the request. A 500 means the server saw the request and failed. These are completely different failure modes. Your ESP32 sends POST but WiFi drops. No response. This is absence—the Pi never saw the request. Contrast with 500—the Pi saw the request, parsed it, then crashed. Different failure modes require different handling.

## 7) Status Codes Drive Behavior

Clients use status codes to decide: retry, redirect, cache, abort, prompt user. This is why correctness matters. Your dashboard checks 200 to display voltage, 404 to show sensor not found, 500 to show server error and retry, 503 to show temporarily unavailable and retry later. The status code drives all these decisions. Well-designed APIs use status codes precisely, do not overload meaning into the body, and let clients behave mechanically. Poor APIs always return 200 even on errors, hide errors in JSON with 200 OK, and break automation. Your Pi always returns 200 OK even when a sensor does not exist, with body error sensor not found. Your dashboard cannot distinguish success from failure—it must parse the body. Bad design. Use 404 for missing resources. Your solar logger might return 200 with an error object when the inverter is offline—better to return 503 or 424. Returning the wrong status code is a protocol violation in spirit. Correct status codes are part of being a good HTTP citizen. When debugging: no response means check transport. 4xx means inspect the request. 5xx means inspect the server or retry. If you understand this, debugging HTTP becomes mechanical instead of emotional.

## Common Pitfalls

Retrying 4xx: 401 and 404 will not succeed on retry. Fix the request first. Not retrying 5xx: 503 and 500 may succeed on retry after a delay. Confusing absence with 5xx: no response is transport failure, not server error. Always returning 200: clients cannot decide behavior mechanically. Hiding errors in the body with 200 OK breaks automation.

## Summary

Status codes are signals. The first digit defines responsibility. 2xx means success—do not retry automatically. 3xx means redirect—follow Location. 4xx means fix the request—retry will likely fail. 5xx means server failed—retry may help. No response means transport failure. The number drives behavior.

## Next

This chapter builds on Chapters 1.1 through 1.8. Next: **Chapter 1.10 — Status Codes: Success and Redirects**, where we go deep on 200, 201, 204, 301, 302, and 304, and learn exactly when each should be used and why they exist.
