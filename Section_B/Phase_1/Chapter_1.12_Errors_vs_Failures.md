# Section B Phase 1 · Chapter 1.12: Errors vs Failures

## Learning Objectives

After this chapter, you will be able to:
- Distinguish between HTTP error responses and network failures
- Understand why presence of a response differs fundamentally from absence
- Recognize when failures occur at the transport layer versus the application layer
- Implement proper retry logic that accounts for ambiguity
- Handle partial responses and connection drops correctly
- Design client code that branches on response presence before status codes

## Key Terms

- **HTTP Error**: A response with a 4xx or 5xx status code indicating the server responded intentionally
- **Network Failure**: No HTTP response received due to transport layer problems
- **Presence**: The arrival of an HTTP response, even if it contains an error status code
- **Absence**: No HTTP response received, creating ambiguity about what happened
- **Timeout**: A failure where the client waited but received no response
- **Partial Response**: Headers or partial body received before connection drops
- **Idempotency**: Property of requests that can be safely retried without side effects

## 1) Two Kinds of Something Went Wrong

When you make an HTTP request and something goes wrong, one of two fundamentally different things happened. Either the server responded with an error, or the request never completed. These are not variations of the same problem. They live in different layers and require different handling.

When your ESP32 temperature sensor sends a POST request to the temperature API and gets four hundred Bad Request, that's an HTTP error because the Pi responded. Or your ESP32 sends the same request and times out after thirty seconds. That's a failure with no response. Different problems require different handling.

HTTP makes a critical distinction that many developers miss. An error is not the same thing as a failure. This chapter draws a hard boundary between HTTP errors, where the server responds, and network failures, where no response arrives. If you do not understand this distinction, you will write fragile clients, mishandle retries, and misdiagnose production incidents. Chapter 1.11 covered HTTP error codes, the four hundred and five hundred status codes. This chapter distinguishes those errors from network failures, when no HTTP response arrives at all. Whether your ESP32 times out waiting for a response, your dashboard gets five hundred Internal Server Error, or your Pi's connection drops mid-transfer, understanding errors versus failures is critical for robust systems.

## 2) HTTP Error Responses Are Still Communication

An HTTP error response means the request reached the server, the server parsed the request, the server made a decision, and the server replied intentionally. Even if the response is four hundred four or five hundred, the protocol exchange completed. This is a successful communication with an unsuccessful outcome.

When your dashboard requests a sensor endpoint with a nonexistent sensor ID and gets four hundred four Not Found, the request reached the Pi, the Pi parsed it, decided the resource doesn't exist, and replied. Communication succeeded, outcome failed.

A network failure means no HTTP response was received, the client does not know what happened, and the server may never have seen the request. This is not an HTTP event. This is silence. When your ESP32 sends a POST request to the temperature API and waits thirty seconds with no response arriving, did the Pi receive it? Did it crash? Did the Wi‑Fi drop? Unknown. This is absence, not an HTTP error. No status code, no response body, just silence.

This entire chapter reduces to one idea. An HTTP error equals presence of a response. A failure equals absence of a response. Presence contains information. Absence does not. When your ESP32 gets five hundred Internal Server Error, that's presence with information. The Pi received the request and crashed. Or your ESP32 times out, which is absence with no information. Did the Pi see it? Did it crash? Unknown.

## 3) Where Errors and Failures Live

HTTP errors occur after DNS resolution, TCP connection establishment, and request transmission. They live inside the HTTP protocol. Examples include four hundred Bad Request when your ESP32 sends malformed JSON, four hundred one Unauthorized when your dashboard is missing credentials, four hundred four Not Found when your coop controller requests a nonexistent endpoint, or five hundred Internal Server Error when your Pi crashes while processing a request. The server spoke.

Failures occur before or during HTTP. DNS resolution fails when pi dot local doesn't resolve. TCP connection cannot be established when the Pi is offline. Connection drops mid-transfer when Wi‑Fi disconnects while your ESP32 sends data. Request times out when your dashboard waits thirty seconds with no response. HTTP never completed.

HTTP assumes a working transport. When that assumption breaks, HTTP has nothing to say. There is no status code. There is no response body. The protocol ends before it begins. When your dashboard tries to connect to pi dot local but DNS resolution fails, HTTP can't help because it assumes DNS works. The protocol never starts. Or your ESP32 sends a request but the TCP connection drops before the Pi can respond. HTTP assumes TCP works. When it doesn't, HTTP has nothing to say.

## 4) Five Hundred Is Not a Failure

A five hundred Internal Server Error means the server received your request, tried to process it, and failed. This is not ambiguity. This is explicit communication. You know the server exists. You know the server received the request.

When your dashboard requests the voltage API and gets five hundred Internal Server Error, you know the Pi exists, you know it received the request, you know it tried to process it and failed. This is explicit communication, not ambiguity.

A timeout means the client waited and nothing came back. You do not know whether the server received the request, whether it processed it, whether it crashed, or whether the response was lost. Timeouts are uncertainty. When your ESP32 sends a POST request to the temperature API and times out after thirty seconds, did the Pi receive it? Did it process it? Did it crash? Did the response get lost? Unknown. Timeout is uncertainty, not information.

If you treat a timeout like a five hundred error, you may retry unsafe requests, duplicate operations, or corrupt state. Timeouts require caution, not confidence. When your solar panel logger sends a POST request to the readings API and times out, if you retry blindly, you might send duplicate readings. The Pi might have processed the first request. You don't know. Timeouts require caution, not automatic retries.

## 5) Four Hundred Four Is Not a Failure

A four hundred four Not Found means the server is here, understood the request, and that resource does not exist. This is information. The client can stop retrying, correct the path, or update stored links.

When your dashboard requests a sensor endpoint with a nonexistent sensor ID and gets four hundred four Not Found, the dashboard knows the resource doesn't exist. Stop retrying, fix the path, or update stored links. This is information, not failure.

DNS failure means the client cannot find the server. This is not about a resource. This is about location. No HTTP request occurred. When your ESP32 tries to connect to pi dot local but DNS resolution fails, no HTTP request happened. DNS failed before HTTP could start. This is not four hundred four Not Found. This is DNS failure, a transport problem.

From the client's point of view, an HTTP error means the server spoke. A failure means silence. Your client code must branch here first. When your dashboard sends a GET request to the voltage API and gets five hundred Internal Server Error, the Pi spoke, so handle as HTTP error. Or your dashboard sends the same request and times out, which is silence, so handle as failure. Your code must branch on whether you got a response before anything else.

## 6) The First Question Your Code Should Ask

When something goes wrong, your code should ask whether you received an HTTP response. Everything else depends on this answer. When your ESP32 sends a POST request to the temperature API and something goes wrong, first question: did you get an HTTP response? If yes, inspect the status code, whether it's four hundred, four hundred one, five hundred, or something else. If no, treat as transport failure, whether it's a timeout, DNS failure, or connection drop. Everything else, retry logic, error handling, logging, depends on this first answer.

Sometimes you receive headers, part of the body, then the connection drops. This is not an HTTP error. This is a transport failure mid-response. When your dashboard requests the voltage API and receives headers plus part of the JSON body, then the connection drops, this is not an HTTP error. The response was incomplete. Transport failed mid-response.

Partial responses are dangerous because the server may have completed the action, the client may not know the result, and retrying may duplicate side effects. This is the hardest failure mode to reason about. When your ESP32 sends a POST request to the temperature API and receives two hundred OK headers but the connection drops before the body arrives, did the Pi process the temperature? Unknown. Retrying might send duplicate data. This is ambiguity at its worst.

HTTP status codes assume a complete request and a complete response. Partial failure exists outside the protocol. When your ESP32 sends a POST request to the temperature API and receives two hundred OK headers but the connection drops before the body arrives, HTTP has no status code for partial success. The protocol assumes complete responses. This is a transport failure, not an HTTP error. You're on your own.

## 7) Why Idempotency Matters Here

Idempotent requests like GET, PUT, and DELETE can often be retried safely. Non-idempotent requests like POST may cause duplicate side effects. Failures force you to care about this distinction.

When your dashboard sends a GET request to the voltage API, which is idempotent, and times out, it's safe to retry. Or your ESP32 sends a POST request to the temperature API, which is non-idempotent, and times out. Retrying is dangerous and might duplicate. Failures force you to understand idempotency.

You should handle HTTP errors and failures differently. For HTTP error handling, inspect the status code, parse the response body, and decide based on semantics. For failure handling, decide whether to retry, decide when to give up, and decide how to surface uncertainty.

When your dashboard gets four hundred one Unauthorized, that's an HTTP error. Inspect the status code, parse the body for an error message, fetch a new token, and retry. Or your dashboard times out, which is a failure. No status code, no body. Decide whether to retry, when to give up, how long to wait. Different handling for different problems.

Retrying blindly can cause duplicate orders, double billing, corrupted state, or cascading failures. Retries must be intentional. When your solar panel logger sends a POST request to the readings API and times out, blindly retrying might send duplicate readings, corrupting your data. Retries must be intentional. Understand what you're retrying and why.

## 8) Errors Are Explicit, Failures Are Ambiguous

Errors are explicit. Failures are ambiguous. Ambiguity is expensive. When your ESP32 gets five hundred Internal Server Error, that's explicit. The Pi received the request and crashed. Or your ESP32 times out, which is ambiguous. Did the Pi see it? Did it process it? Did it crash? Unknown. Ambiguity forces you to make assumptions, and assumptions are expensive. They lead to bugs.

Good systems log errors and failures differently. For HTTP errors, log status, headers, and body. For failures, log timing, connection state, DNS, and transport info. They tell different stories. When your Pi logs five hundred Internal Server Error with a stack trace, that's a server bug. Investigate the code. Or your Pi logs a timeout with connection state, which indicates a network issue. Investigate the network. Different logs, different stories, different fixes.

From an operations perspective, rising four hundred status codes indicate client misuse. Rising five hundred status codes indicate server bugs. Rising timeouts indicate network or load issues. If you lump these together, you lose signal. When rising four hundred one Unauthorized means clients need new tokens, fix authentication. Rising timeouts mean network or load issues, fix infrastructure. Lumping them together loses signal. You can't tell what's wrong.

Many HTTP libraries throw exceptions for both errors and failures, blur semantics, and encourage catch-all handling. This is dangerous. You must know what you caught. When your ESP32 catches an exception from an HTTP library, is it a four hundred Bad Request, which is an HTTP error, or a timeout, which is a failure? The library might throw the same exception type for both. You must inspect what you caught. Don't treat them the same. HTTP errors have status codes. Failures don't.

An exception may represent a timeout, a DNS failure, a connection reset, or a malformed response. You must inspect what kind of exception it is. When your ESP32 catches an exception, is it a timeout? DNS failure? Connection reset? Malformed response? Each requires different handling. You must inspect what kind of exception it is. Don't treat them all the same.

## 9) No Response Is a First-Class Outcome

No response is not a bug. It is a valid system state. Design for it. When your solar panel logger sends a POST request to the readings API and gets no response, this isn't a bug. It's a valid outcome. Networks fail, servers restart, connections drop. Design your system to handle no response as a first-class outcome, not an exception to ignore.

Networks fail. Packets drop. Servers restart. Connections reset. This is not exceptional behavior. It is baseline reality. When your Pi reboots, Wi‑Fi drops, DNS fails, connections reset, this happens all the time. Your ESP32 sending temperature readings will encounter these failures regularly. Design for it. Failure is normal, not exceptional.

HTTP errors are normal too. APIs return four hundred fours. Authentication expires. Permissions change. Errors are not disasters. They are communication. When your dashboard requests a sensor endpoint with a nonexistent ID and gets four hundred four Not Found, that's normal. The resource doesn't exist. Or your ESP32's authentication token expires and gets four hundred one Unauthorized. That's normal. Fetch a new token. Errors are communication, not disasters. Handle them gracefully.

Silence gives you no certainty. All resilient systems are designed around silence. When your ESP32 sends a POST request to the temperature API and gets silence, no response, no error, nothing, did the Pi receive it? Did it process it? Unknown. All resilient systems are designed around this uncertainty. Handle silence explicitly. Don't assume success. Don't assume failure. Handle the ambiguity.

## 10) Client Strategy Summary

When a request fails, first ask whether you received an HTTP response. If yes, inspect the status code. If no, treat as transport failure. Decide retry behavior carefully and preserve idempotency guarantees.

When your dashboard sends a GET request to the voltage API, which is idempotent, and times out, retry safely. Or your ESP32 sends a POST request to the temperature API, which is non-idempotent, and times out. Retry cautiously, might duplicate. Always preserve idempotency guarantees.

Most bugs in distributed systems come from treating silence like an error, treating errors like silence, retrying blindly, or assuming success without confirmation. This chapter prevents that. Understanding the distinction between HTTP errors and network failures is fundamental to building robust systems that handle uncertainty correctly.

## Common Pitfalls

Treating timeouts like five hundred errors leads to dangerous retry behavior. Timeouts create ambiguity about whether the server processed the request. Retrying non-idempotent requests after timeouts can cause duplicate operations and corrupted state.

Lumping HTTP errors and network failures together in monitoring obscures the root cause. Four hundred status codes indicate client problems. Five hundred status codes indicate server problems. Timeouts indicate network or load problems. Each requires different investigation and fixes.

Assuming partial responses are complete leads to data corruption. When headers arrive but the body doesn't, the server may have completed the action. Retrying without checking can duplicate side effects.

Ignoring the distinction between presence and absence breaks client logic. Always branch on whether you received an HTTP response before inspecting status codes. No response means transport failure, not an HTTP error.

Using the same exception handling for all failures hides critical differences. Timeouts, DNS failures, connection resets, and malformed responses each require different handling. Inspect what kind of failure occurred before deciding how to respond.

## Summary

HTTP errors and network failures are fundamentally different. HTTP errors mean the server responded with a status code, providing explicit information. Network failures mean no response arrived, creating ambiguity. Presence contains information. Absence does not. HTTP errors occur at the application layer after transport succeeds. Failures occur at the transport layer before HTTP completes. Always branch on whether you received an HTTP response before inspecting status codes. Handle errors and failures differently. Preserve idempotency guarantees when retrying. Design for silence as a first-class outcome. Most bugs in distributed systems come from confusing errors and failures. Understanding this distinction is critical for robust systems.

## Next

This chapter built on Chapter 1.11, which covered client and server errors. Next, Chapter 1.13 explores HTTP methods, defining GET, POST, PUT, PATCH, and DELETE, and explaining why method semantics matter even more once failures enter the picture.
