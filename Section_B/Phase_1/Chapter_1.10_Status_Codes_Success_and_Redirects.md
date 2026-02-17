# Section B Phase 1 · Chapter 1.10: Status Codes — Success and Redirects

Success and redirect status codes describe completed requests. That statement alone eliminates a lot of confusion. If a response is in the 2xx or 3xx range, the request reached the server, the server understood it, and the server made a deliberate decision about how to respond. These codes are not about failure. They are about what kind of success happened and what the client should do next.

## Learning Objectives

By the end of this chapter, you should be able to:
- Distinguish 200, 201, and 204 and when to use each.
- Explain why 204 is better than 200 with an empty body for DELETE and updates.
- Describe 301 vs 302 and why 301 is dangerous if misused.
- Explain 304 Not Modified as cache control, not navigation.

## Key Terms

- **200 OK** — Generic success with a body. The request succeeded and the response contains a representation of the result.
- **201 Created** — A new resource was created. Usually paired with POST and a Location header.
- **204 No Content** — Success with intentionally no body. Used for DELETE and updates that return nothing.

Chapter 1.9 gave an overview of status codes; this chapter focuses on success (2xx) and redirects (3xx). Whether your Pi responds to voltage queries, your ESP32 receives confirmations, or your coop controller gets fence status, success and redirect codes work the same way.

## 1) Why Success Codes Need Precision

Many systems collapse all success into 200 OK. That works until it does not. Clients rely on status codes to decide whether something new exists, whether to cache, whether to retry, whether to follow another URL, whether a response body should exist. Using the wrong success code does not break the protocol. It breaks client behavior. A 2xx response means the request was valid, the server acted on it, and the action completed. It does not mean the client is satisfied, the data is useful, or the system is healthy. Just that the request completed as requested. Your dashboard sends a voltage request and gets 200 OK with a voltage value. The request was valid, the Pi acted on it, and the action completed. It does not mean the reading is useful (maybe it is stale) or the system is healthy (maybe the Pi is about to crash). Just that the request succeeded.

## 2) 200 OK

200 OK is the most common success code. It means the request succeeded and the response body contains a representation of the result. Use 200 OK when a GET returns data, a POST returns a resource but did not strictly create it, a PUT returns the updated resource, or an operation succeeds and returns meaningful content. The key property: there is something in the body the client should read. Your dashboard sends a voltage request. Your Pi responds 200 OK with a JSON body. The body contains data the client should parse and use. Your ESP32 sends POST with a temperature reading. Your Pi processes it and responds 200 OK with confirmation. Your solar logger returns 200 OK with production data. Your coop controller gets 200 OK with fence status. Your freezer sensor API returns 200 OK with internal and external temperatures. This is the default when no more specific success code applies—no creation happened (not 201), no deletion happened (not 204), just a successful request with a body. Using 200 OK for everything hides meaning. If the client created something (ESP32 registers a new sensor), deleted something (dashboard deletes a sensor), or performed an action with no return value (coop controller updates fence status), better codes exist. 201 Created and 204 No Content tell the client more. Your ESP32 creates a sensor and gets 200 OK—technically correct, but 201 Created tells the client something new exists more clearly.

## 3) 201 Created

201 Created means the request succeeded and a new resource now exists as a result. This is most commonly used with POST. The difference from 200 is not subtle. 201 tells the client: you now have a new thing, it has an identity, you may want to interact with it next. This is information the client cannot infer from a body alone. Your ESP32 sends POST to register itself. Your Pi creates a new sensor record and responds 201 Created with Location pointing to the new resource. The status code tells the ESP32 something new exists—even if the body is empty. With 200 OK, the ESP32 might think it is just a confirmation, not a new resource. A 201 response should usually include a Location header telling the client where the new resource lives. This is not optional in spirit, even if some APIs skip it. The response may include a body (often the newly created resource) but does not have to. The critical signal is the status code. The ESP32 can use the Location header to fetch the resource if needed. Your drip irrigation controller might POST a schedule and get 201 with Location pointing to the new schedule. Your coop controller might POST a new fence zone and get 201.

## 4) 204 No Content

204 No Content means the request succeeded and there is intentionally no response body. This is not an error or incomplete. It is explicit success with silence. Use 204 when a DELETE succeeded, a PUT or PATCH succeeded but returns nothing, or an action occurred but no representation is needed. The client should not expect a body. Reading one would be a bug. Your dashboard sends DELETE for a sensor. Your Pi deletes it and responds 204 No Content with no body. Your dashboard knows deletion succeeded—no body to parse, move on. Your poultry net API might return 204 after a successful config update.

Returning 200 OK with no body is ambiguous: did the server forget to send a body? Is it empty? Should the client wait? Returning 204 No Content is explicit: intentionally no body, operation complete. The latter tells the client: there is nothing to parse, move on. Your dashboard sends DELETE. If your Pi responds 200 OK with no body, your dashboard might wait for a body that never comes. If it responds 204 No Content, your dashboard knows immediately: nothing to read, deletion succeeded. This matters for automation—clients can proceed without parsing. Clients should not attempt to parse a body, not expect Content-Type, and treat the operation as complete. Servers should not send a body with 204. If your Pi mistakenly includes a body with 204, the server violated the protocol. Your dashboard might try to parse it, but 204 means no body. The rule is clear.

## 5) Redirects (3xx)

Redirects are not errors. They are instructions. A 3xx response means the request was valid, the resource is not here, and the client must take another step. Resources change location. URLs evolve. Systems are reorganized. Redirects let servers say: yes, but not here.

301 Moved Permanently means the resource has a new permanent URL. Clients should update bookmarks. Caches may store the redirect. This is a strong signal. Your dashboard requests voltage, but your Pi permanently moved it to a new path. Responds 301 with Location header. Your dashboard should update its code—this is permanent. 301 is dangerous if misused. Once cached, a 301 can persist for a long time. If you send 301 incorrectly, clients may never check the old URL again. Your Pi sends 301 for voltage to a new path. Your dashboard caches this. Later you realize the move was temporary. Too late—your dashboard may never check the old URL again. Use 302 Found for temporary moves. Browsers often rewrite future requests automatically and may change POST to GET in some cases. Your dashboard sends POST and gets 301. Some browsers change the redirect to GET—losing the POST body. Be careful redirecting non-GET requests.

302 Found means the resource is temporarily at a different URL. Clients should not update bookmarks. Future requests may still go to the original URL. This is softer than 301. Use 302 when redirecting after form submission, handling login flows, routing traffic temporarily during maintenance, or when the move might be reversed. The server is saying: go there for now. All redirect responses must include a Location header. Without it, the client has no instruction. Your dashboard requests voltage and gets 302 but no Location header. Where should it go? The redirect is broken. Always include Location with redirects. Redirect responses usually have no meaningful body and rely entirely on status code and Location. The body may exist (perhaps an HTML message), but clients should ignore it and follow the Location header.

## 6) 304 Not Modified

304 Not Modified is not a redirect in the usual sense. It means the client's cached version is still valid. The server is explicitly saying: use what you already have. This saves bandwidth and time. 304 occurs when the client sends a conditional request with headers like If-None-Match or If-Modified-Since, and the resource has not changed. Your dashboard requests voltage with If-None-Match. Your Pi checks—the data has not changed. Responds 304 with no body. Your dashboard uses its cached version. Your solar logger might use ETags for production data—if unchanged, 304. Your coop controller might cache fence status—304 when no change. A 304 response must not include a body. The body would be redundant—the client already has it cached. Sending it would waste bandwidth. The whole point of 304 is to avoid sending unchanged data.

## 7) Redirects vs Retries, and Misuse

Redirects tell the client: do not retry the same request here, try again somewhere else. This is different from errors. Your dashboard requests voltage and gets 302 with Location pointing to the new path. Follow the redirect to the new path. Contrast with 500: retry the same request later, the server might recover. Success and redirect codes assume the client is capable and will follow instructions. They are cooperative, not defensive. Your Pi sends 301 assuming your dashboard will follow the Location header. If your dashboard does not follow redirects, it breaks—but that is the dashboard's fault, not the Pi's.

APIs sometimes misuse redirects: using redirects where errors are appropriate (use 404 for missing resources), or using 200 with embedded redirect info in JSON instead of 301 or 302 with Location header. Your Pi responds 200 OK with body containing redirect and new path. Your dashboard must parse JSON to know to redirect—generic HTTP clients will not follow it automatically. Bad design. Redirects belong in HTTP, not payloads. Idempotency matters when redirecting: GET is safe to redirect freely. POST may be rewritten by clients to GET on redirect—losing the body. PUT, PATCH, DELETE require care—redirecting a DELETE to a different path might delete the wrong resource. Design redirects deliberately.

## Common Pitfalls

Using 200 for DELETE: use 204 No Content. Using 200 for creation: use 201 Created with Location. Using 301 for temporary moves: use 302. Clients cache 301 and may never check the old URL again. Redirecting POST without awareness: some clients change POST to GET on redirect, losing the body. Omitting Location on redirects: a redirect without Location is broken. Returning 200 with empty body when 204 applies: ambiguous. Use 204 explicitly.

## Summary

200 OK: success with a body. 201 Created: success, new resource exists, include Location. 204 No Content: success, intentionally no body. 301 Moved Permanently: resource moved forever—use carefully. 302 Found: temporary redirect. 304 Not Modified: use cached version, no body. These codes are not interchangeable. They encode meaning for clients.

## Next

This chapter builds on Chapter 1.9 (status codes overview). Next: **Chapter 1.11 — Status Codes: Client and Server Errors**, where we slow down and look at 400, 401, 403, 404, 500, 502, and 503, and learn how HTTP assigns blame—precisely and unemotionally.
