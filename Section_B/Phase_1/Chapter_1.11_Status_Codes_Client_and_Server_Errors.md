# Section B Phase 1 · Chapter 1.11: Status Codes — Client and Server Errors

## Learning Objectives

After this chapter, you will be able to:
- Distinguish between HTTP errors and network failures
- Understand the fundamental difference between 4xx client errors and 5xx server errors
- Identify when to use specific error codes like 400, 401, 403, 404, 500, 502, and 503
- Recognize the distinction between authentication and authorization
- Implement proper retry logic based on error codes
- Design error responses that help clients recover gracefully

## Key Terms

- **4xx Client Errors**: Status codes indicating the client sent an invalid or problematic request
- **5xx Server Errors**: Status codes indicating the server failed to fulfill a valid request
- **Authentication**: The process of proving identity (who you are)
- **Authorization**: The process of checking permissions (what you're allowed to do)
- **400 Bad Request**: The request is malformed or invalid
- **401 Unauthorized**: Credentials are missing or invalid (authentication required)
- **403 Forbidden**: Client is authenticated but lacks permission (authorization failed)
- **404 Not Found**: The requested resource does not exist at that path
- **500 Internal Server Error**: The server encountered an unexpected failure
- **502 Bad Gateway**: A proxy or gateway received an invalid response from an upstream server
- **503 Service Unavailable**: The server is temporarily unable to handle requests

## 1) Errors Assign Responsibility

Error status codes exist to answer one core question: who is responsible for fixing this? HTTP does not use errors to shame. It uses them to assign responsibility. The first digit of the status code answers whether the client sent something wrong or the server failed to handle a valid request. Four hundred and five hundred status codes are not interchangeable. They describe where the failure lives.

Chapter 1.9 gave an overview of status codes. Chapter 1.10 covered success and redirects. This chapter focuses on errors: four hundred status codes for client errors and five hundred status codes for server errors. Whether your ESP32 temperature sensor gets four hundred Bad Request for malformed JSON, your dashboard gets four hundred one Unauthorized for missing credentials, or your Raspberry Pi responds five hundred Internal Server Error, error codes assign responsibility precisely.

An HTTP error response means the request reached the server, the server understood the request, the server made a decision about it, and the server replied intentionally. This is not a crash. This is not silence. This is communication. When your ESP32 sends a POST request to the temperature API with malformed JSON, your Pi responds with four hundred Bad Request. The request reached the Pi, the Pi understood it was broken, and the Pi replied intentionally. This is an HTTP error, not silence, not a crash.

Before diving deeper, keep this distinction in mind. An HTTP error is a response with a four hundred or five hundred status code. A failure means no response at all, such as a timeout, DNS resolution failure, or connection drop. This chapter is about errors, not failures. Errors mean the server spoke. When your dashboard requests the voltage API endpoint and gets four hundred four Not Found, that's an HTTP error because the Pi responded. Contrast this with a timeout or connection reset, which is a failure with no response at all.

## 2) The Line Between Client and Server Errors

The most important rule is simple. Four hundred status codes mean the client is at fault. Five hundred status codes mean the server is at fault. That's it. Everything else is detail.

A four hundred response means the request was received, the server understood it, and the server refuses or cannot process it because of the request itself. The server is saying it cannot do this as asked. A four hundred error usually means retrying the same request will fail again. Something must change on the client side. Retrying without modification is wasted effort. When your automated coop door controller sends a GET request to the fence status API without authentication and gets four hundred one Unauthorized, retrying the same request won't help. The controller must add credentials first.

A five hundred response means the request was valid, the client did nothing wrong, and the server failed to fulfill the request. Responsibility shifts to the server. Unlike four hundred errors, retrying five hundred errors may succeed, especially if the failure was transient. But retries should be bounded. When your ESP32 sends a POST request to the temperature API and gets five hundred three Service Unavailable, the Pi might recover. Retry after a delay, but don't retry forever. If it's still five hundred three after several attempts, back off.

## 3) Four Hundred Bad Request

Four hundred Bad Request means the request is malformed, the server cannot parse or validate it, and the problem is structural or semantic. This is the most generic client error. Typical reasons include invalid JSON, such as when your ESP32 sends a temperature reading with a missing closing brace. Other causes include malformed syntax, missing required fields like when your dashboard sends a POST request to the sensors API without a device ID, wrong data types such as sending a string when a number is required, or invalid query parameters like requesting voltage data with an invalid unit parameter.

The server cannot proceed because the request makes no sense. A four hundred does not mean you are unauthorized, you lack permission, or the resource doesn't exist. It means this request is not valid as written. Good servers return a clear error message in the body, describe what is wrong, and help the client fix the request. Bad servers return four hundred with no explanation. When your ESP32 sends malformed JSON and gets four hundred Bad Request with an empty body, the ESP32 has no idea what's wrong. Good servers return four hundred with a body explaining the specific issue, such as invalid JSON with a missing closing brace at a specific line.

## 4) Four Hundred One Unauthorized

Despite the name, four hundred one Unauthorized actually means not authenticated. It signals that credentials are missing or credentials are invalid. The server is asking who you are. This distinction matters. Authentication is about identity: who are you? Authorization is about permission: are you allowed? Four hundred one is about authentication, not permission.

Four hundred one occurs when no Authorization header is present, such as when your ESP32 forgets to include the Authorization Bearer token. It also occurs when a token is expired, like when your dashboard's authentication token expired after twenty-four hours, or when credentials are invalid, such as when your coop controller sends the wrong API key. The request could succeed if identity were proven.

Many four hundred one responses include a WWW-Authenticate header with instructions for how to authenticate. This is the server inviting the client to try again properly. When your coop controller sends a GET request to the fence status API without credentials, your Pi responds with four hundred one Unauthorized and includes the WWW-Authenticate Bearer header. The controller knows it needs to add an Authorization Bearer token and retry.

Retrying a four hundred one can make sense, but only if credentials are added or corrected. Blind retries are pointless. When your ESP32 sends a POST request to the temperature API and gets four hundred one Unauthorized, the ESP32 should fetch a new token, add the Authorization Bearer header with the new token, and retry. Retrying the same request without credentials will just get four hundred one again.

## 5) Four Hundred Three Forbidden

Four hundred three Forbidden means the client is authenticated, the server knows who you are, and you are not allowed to do this. This is a hard stop. The server is saying it knows who you are, and you don't have permission. No amount of retrying will help unless permissions change. When your solar panel logger sends a DELETE request to the config API with valid authentication, but your Pi responds with four hundred three Forbidden, you're authenticated but you don't have permission to delete config. No amount of retrying will help.

This distinction is critical. Four hundred one asks who are you? Four hundred three says I know who you are, and no. Confusing these breaks client logic. Use four hundred three when access is restricted, the resource exists, authentication succeeded, and authorization failed. Do not use four hundred three to hide authentication requirements. When your ESP32 is authenticated but tries to access the admin sensors endpoint, your Pi responds with four hundred three Forbidden because the ESP32 doesn't have admin permissions. Retrying won't help. Permissions must change on the server side.

When your solar logger is authenticated but tries to access the admin users endpoint, your Pi responds with four hundred three Forbidden. The resource exists, you're authenticated, but you're not an admin. Use four hundred one if credentials are missing, four hundred three if credentials are valid but insufficient.

## 6) Four Hundred Four Not Found

Four hundred four Not Found means the server understood the request and the resource does not exist at that path. This is about absence, not permission. When your dashboard requests a sensor endpoint with a nonexistent sensor ID, your Pi responds with four hundred four Not Found. That sensor doesn't exist. This isn't about permission, since you're allowed to read sensors. It's about absence.

Four hundred four does not mean the server is down, the request was malformed, or the client is forbidden. It means there is nothing here. The path in the request line maps to nothing. Sometimes APIs deliberately return four hundred four instead of four hundred three to avoid revealing that a resource exists and to reduce information leakage. This is a design decision, not a protocol requirement. When your ESP32 tries to access the admin sensors endpoint, your Pi could return four hundred three Forbidden if you're authenticated but not authorized, or four hundred four Not Found to hide that admin endpoints exist. Both are valid. Four hundred four reduces information leakage but makes debugging harder.

Four hundred four responses can be cached. Absence is still information. When your dashboard requests a sensor endpoint with a nonexistent ID and gets four hundred four Not Found, your dashboard can cache this. That sensor doesn't exist, so don't ask again for a while. Absence is information worth caching.

## 7) Five Hundred Internal Server Error

Five hundred Internal Server Error is the generic server failure. It means an unhandled exception occurred, a bug was hit, or the server could not complete the request. The server is admitting failure. Five hundred tells the client that something went wrong on the server side, but not much detail. Clients should not assume anything else.

A five hundred response should be logged, trigger investigation, and never be ignored. Five hundred errors are symptoms of broken assumptions. When your Pi responds with five hundred Internal Server Error to a voltage API request, your Pi should log the full stack trace, the request that caused it, and any relevant context. Five hundred means something unexpected happened. Investigate immediately. Don't ignore it.

Clients should retry cautiously, possibly back off, and not change the request automatically. The request may be fine. When your ESP32 sends a POST request to the temperature API and gets five hundred Internal Server Error, the request was valid. Don't modify it. Retry after a delay, but back off if it keeps failing. The server might be down, or it might recover. Don't assume the request was wrong. Five hundred means server failure, not client error.

## 8) Five Hundred Two Bad Gateway and Five Hundred Three Service Unavailable

Five hundred two Bad Gateway means the server is acting as a proxy or gateway, it contacted an upstream service, and the upstream response was invalid or broken. The failure is not local, but it is still server-side. This is common in reverse proxies, load balancers, and microservice architectures. The server is saying it asked someone else, and they failed. When your dashboard requests the voltage API, your Pi acts as a gateway and forwards the request to an upstream sensor service. If the upstream service crashes, your Pi responds with five hundred two Bad Gateway. The failure is upstream, but it's still the server's responsibility.

Five hundred three Service Unavailable means the server is currently unable to handle the request due to overload, maintenance, or temporary outage. This is a temporary condition. When your Pi is rebooting or overloaded, your ESP32 sends a POST request to the temperature API and gets five hundred three Service Unavailable. The Pi is temporarily unable to handle requests, and this should pass.

Five hundred three often includes a Retry-After header specifying seconds. This tells the client not to hammer the server and to try again later. Five hundred three is intentional. The server is protecting itself. This is controlled refusal, not failure. When your Pi is rebooting or under heavy load, instead of crashing or accepting requests it can't handle, it responds with five hundred three Service Unavailable to new requests. This is intentional. The Pi is protecting itself. Once it recovers, it will accept requests again. Contrast this with five hundred, which is an unexpected failure.

Choose between five hundred, five hundred two, and five hundred three based on the operational state. Five hundred indicates a bug or unexpected failure, such as a server crash or unhandled exception. Five hundred two indicates a dependency failed, such as an upstream service breaking. Five hundred three indicates temporary unavailability due to overload, rebooting, or maintenance. Each communicates a different operational state. When your dashboard requests the voltage API, if your Pi hits an unhandled exception, respond with five hundred. If your Pi forwards to an upstream sensor service that crashes, respond with five hundred two. If your Pi is rebooting, respond with five hundred three with a Retry-After header. Each code tells the client something different about what went wrong.

## 9) Error Codes as Contracts

When a server returns a status code, it is making a promise about meaning. Clients build logic around these promises. Breaking them causes cascading failure. When your ESP32 expects four hundred one Unauthorized when credentials are missing, so it can fetch a new token and retry, but your Pi returns four hundred three Forbidden instead, the ESP32 might think it's authenticated but lacks permission. This leads to wrong logic and wrong behavior. Error codes are contracts. Break them at your peril.

HTTP does not require error bodies, but humans do. Good APIs return structured error messages, explain what went wrong, and preserve machine readability. When your ESP32 sends malformed JSON and gets four hundred Bad Request with a body explaining the specific issue, the status code says client error, and the body explains what's wrong. Contrast this with four hundred and an empty body, where the ESP32 knows something's wrong but not what.

Do not encode errors only in JSON. Returning two hundred OK with an error message in the JSON body is a protocol lie. Errors belong in status codes first. When your ESP32 sends invalid data and your Pi responds with two hundred OK with a body containing an error message, this is a protocol lie. Use four hundred Bad Request with the error in the status code, not hidden in JSON. Generic HTTP clients won't know to check the body for errors. They rely on status codes.

In HTTP, errors are expected. They are part of normal operation and do not imply panic. This is different from many programming models. When your dashboard requests a sensor endpoint with a nonexistent ID and gets four hundred four Not Found, this is normal. Resources don't always exist. Handle it gracefully, don't crash. When your ESP32 gets four hundred one Unauthorized, this is normal. Fetch a new token and retry. Errors are expected in HTTP. They're signals, not exceptions.

Clear errors allow clients to retry correctly, fix requests, ask for credentials, and back off gracefully. When your ESP32 gets four hundred Bad Request with a clear message, it can fix the request and retry. When it gets five hundred three Service Unavailable with Retry-After sixty, it can wait sixty seconds and retry. Clear errors enable robust automation. Ambiguous errors, like two hundred OK with an error message in JSON, break automation. Clients can't decide behavior mechanically.

## Common Pitfalls

Confusing four hundred one and four hundred three breaks client logic. Four hundred one means authentication failed. Four hundred three means authorization failed. If your client receives four hundred one, it should add or fix credentials. If it receives four hundred three, retrying won't help unless permissions change.

Returning two hundred OK with error messages in JSON breaks the HTTP contract. Generic HTTP clients rely on status codes to determine success or failure. Hiding errors in JSON bodies forces clients to parse every response body, breaking standard HTTP behavior.

Using five hundred for every server problem obscures the actual issue. Five hundred indicates unexpected failures. Five hundred two indicates upstream failures. Five hundred three indicates temporary unavailability. Each communicates different operational states and requires different client behavior.

Retrying four hundred errors blindly wastes resources. Four hundred errors mean the request itself is wrong. Retrying without modification will fail again. The client must change something about the request before retrying.

Ignoring five hundred errors on the server side hides broken assumptions. Five hundred errors indicate unexpected failures that need investigation. Log them aggressively, include stack traces and request context, and investigate immediately.

## Summary

Error status codes assign responsibility. Four hundred status codes indicate client errors, meaning the client sent something wrong. Five hundred status codes indicate server errors, meaning the server failed to fulfill a valid request. Four hundred Bad Request means the request is malformed. Four hundred one Unauthorized means authentication is required. Four hundred three Forbidden means the client is authenticated but lacks permission. Four hundred four Not Found means the resource does not exist. Five hundred Internal Server Error means the server encountered an unexpected failure. Five hundred two Bad Gateway means an upstream service failed. Five hundred three Service Unavailable means the server is temporarily unable to handle requests. The status code tells you where to look for the problem. Error codes are contracts that clients rely on for proper behavior. Clear error responses enable robust client logic and graceful recovery.

## Next

This chapter built on Chapter 1.10, which covered success and redirects. Next, Chapter 1.12 explores the distinction between HTTP error responses and network-level failures, explaining why silence is sometimes the most important signal of all and how to handle scenarios where no HTTP response arrives.
