# Section B Phase 1 · Chapter 1.8: Response Structure

A response is the server's half of the HTTP contract. The client speaks first. The server responds exactly once. The response tells the client what happened, what data if any is included, and how to interpret that data. If the response is malformed, the client cannot safely proceed.

## Learning Objectives

By the end of this chapter, you should be able to:
- Describe the four-part structure of an HTTP response: status line, headers, blank line, optional body.
- Explain status code classes (2xx, 3xx, 4xx, 5xx) and how they affect client behavior.
- Distinguish absence of response (transport failure) from HTTP error responses.
- Debug response failures by checking status line, headers, and body boundaries.

## Key Terms

- **Status line** — First line of a response: HTTP version, status code, reason phrase. The server's primary signal.
- **Status code** — Three-digit integer. 2xx success, 3xx redirection, 4xx client error, 5xx server error. Machine signal, not decoration.
- **Reason phrase** — Human-readable text (OK, Not Found). Informational only. The status code is authoritative.

Chapter 1.6 showed request structure. Chapter 1.7 showed the request line. This chapter shows the server's reply. Whether your Pi responds to a voltage query, your ESP32 receives a temperature confirmation, or your coop controller gets a fence status update, the response structure is the same. The structure of a response is not flexible or negotiable. It mirrors the request structure with precision.

## 1) Responses Always Follow Requests

A response cannot exist on its own. No request means no response. One request means one response. The server never sends two responses to one request. If a server sends nothing, the client experiences absence, not an error response. Every HTTP response has up to four parts, in this order: status line, headers, blank line, optional body. This mirrors the request structure exactly, with one substitution: the status line replaces the request line. Nothing comes before the status line.

## 2) The Status Line

Every HTTP response begins with a status line. If the client does not receive a valid status line, the response is invalid, the client cannot interpret anything else, and the connection may be dropped. The status line always contains three parts: HTTP version, status code, reason phrase. Separated by single spaces. The response begins by declaring the protocol version. Your dashboard requests HTTP/1.1, so your Pi responds with HTTP/1.1 in the status line. This tells the client which parsing rules apply, which defaults apply, which behaviors are allowed. Servers usually respond using the same HTTP version requested, or downgrade gracefully. Version mismatch can cause parsing errors, misinterpreted headers, and connection handling issues.

The status code is a three-digit integer. This is the most important part of the response. Clients interpret meaning from this number, not from text. Status codes are control signals, not decoration. Clients use them to decide whether the request succeeded, whether to retry, whether to redirect, whether to stop. The first digit defines the class: 1xx informational (rare), 2xx success, 3xx redirection, 4xx client error, 5xx server error. This classification is foundational.

## 3) Status Code Classes

A 2xx status means the server received the request, understood it, and successfully processed it. Important: 2xx means the request succeeded. It does not mean the data is what you expected. Your dashboard sends a request for voltage and gets 200 OK with body indicating sensor offline. The request succeeded—the server processed it correctly. The data just indicates the sensor is offline. Your solar logger returns 200 OK with an empty body because no production data exists yet today. The request succeeded. Your coop controller gets 200 OK with HTML error page instead of JSON because the Pi returned a generic error page. The request succeeded at the protocol level—the body format is wrong. 200 OK with an empty body, or with HTML instead of JSON, is still success at the protocol level. The client must validate the body separately. Check Content-Type. Parse accordingly.

A 3xx status means the request was valid, the resource is elsewhere, and the client should take additional action. A redirect is not an error. It is the server telling the client: you asked correctly, but look over here instead. The Location header carries the new target. Your dashboard requests voltage, but your Pi moved it to a new path. The server responds with 301 and a Location header pointing to the new path.

A 4xx status means the client made a request, the server understood it, and the server refuses or cannot fulfill it due to client-side issues. Client error does not mean the client software is buggy or the connection failed. It means the request is invalid in context. Your ESP32 sends a request without authentication. Your Pi responds 401 Unauthorized. The request is syntactically correct but missing required auth. Your dashboard requests a path that does not exist. Your Pi responds 404 Not Found. Your drip irrigation controller sends a POST with malformed JSON. Your Pi responds 400 Bad Request. The path exists, but the body is invalid. Each 4xx has a specific meaning; fix the request accordingly before retrying.

A 5xx status means the request was valid but the server failed while processing it. Your dashboard requests voltage, but the Pi's sensor reading code crashes. The server responds 500 Internal Server Error. In principle, 4xx means client responsibility—fix the request. 5xx means server responsibility—the server failed. Clients may retry 5xx responses. They usually should not retry 4xx responses. Your dashboard gets 500 from the Pi. The request was valid but the server crashed. Retry might work if the server recovers. If you get 401 Unauthorized, retrying will not help—fix the auth token first.

## 4) The Reason Phrase and Headers

The reason phrase comes third: OK, Not Found, Internal Server Error, Unauthorized. Clients must not rely on the reason phrase. It may vary, may be localized, may be omitted entirely. The status code is authoritative. HTTP/1.1 allows empty reason phrases. A server might send version, code, and nothing else for 204 No Content. Your Pi might send 204 after a successful DELETE. Clients must not break if the phrase is missing.

After the status line come zero or more headers. Same structure as request headers: name, colon, value, one per line. Response headers describe the body if any, caching rules, redirect targets, and server behavior. They do not contain the content itself. Common response headers: Content-Type (format of the body—application/json for your Pi's voltage response), Content-Length (size of the body in bytes), Location (redirect target), Cache-Control (caching rules—no-cache for real-time sensor data), Set-Cookie (session data if your dashboard uses sessions), Date (server timestamp). Headers are case-insensitive. The order of headers does not matter. Clients read headers as a set, not a sequence.

## 5) The Blank Line and Body

After headers, the server sends a blank line. This blank line marks the end of headers and the start of the body if any. Section A Phase 1 boundary principle applies: everything before the blank line is metadata, everything after is payload. Clients must respect this boundary. Without the blank line, the client cannot know where headers end and body begins. Parsing fails. A response may include a body. Some responses never include a body: 204 No Content (successful DELETE), 304 Not Modified (cached version still valid), responses to HEAD requests. Your dashboard sends DELETE for a sensor. Your Pi responds 204 No Content with no body—the deletion succeeded, nothing to return. Your poultry net API might return 204 after a successful configuration update.

HTTP does not interpret body content. The body is a stream of bytes interpreted by the client using headers. HTTP does not care if it is HTML, JSON, XML, binary, or garbage. The Content-Type header tells the client how to interpret the body. Your Pi responds to a voltage request with Content-Type application/json and a JSON body. Your dashboard knows to parse it as JSON. Your solar logger might return Content-Type application/json for production data. Your coop controller expects JSON from the fence status endpoint. Without Content-Type, the body is ambiguous. The Content-Length header tells the client how many bytes to read. Your Pi responds with a 24-byte body. Content-Length 24 tells your dashboard to read exactly 24 bytes, then stop. The freezer sensor API might return a short JSON payload with internal and external temperatures. Content-Length must match exactly. Without Content-Length, the client may use chunked encoding, wait for connection close, or misread the body. The response ends when Content-Length bytes are read, or the connection closes, or the chunked stream ends. After that, the client may send another request if the connection is open (HTTP/1.1 keep-alive) or close the connection. If extra bytes appear after the response, the client may treat them as a new response or treat the connection as corrupted. Your Pi sends Content-Length 24 but actually sends 30 bytes. Your dashboard reads 24 bytes, stops. The remaining 6 bytes corrupt the next request. The server must send exactly what it declares.

## 6) Parsing and Debugging

Clients parse responses sequentially: read status line, parse status code, read headers, detect blank line, read body if any. Failure at any step invalidates the response. There is no guessing or scanning ahead. The status line tells the client whether to expect a body. Headers tell it how to interpret the body. The blank line tells it where the body starts. Content-Length tells it when the body ends. Given the same response bytes, every compliant client parses them the same way. There is no ambiguity if the structure is correct. Frameworks and libraries parse this structure. Understanding it removes mystery. When something goes wrong, ask: what status code was returned? Was there a response at all? Did the connection fail? No response means transport failure, not HTTP error. Your ESP32 sends a POST and gets no response. Did you get any HTTP response? If no, the connection failed (transport layer). If yes, check the status code. 500 means server error—retry might work. 400 means bad request—fix the request. Your dashboard gets 500 with body containing an error message. The request was valid; the Pi's sensor code crashed. Retry might work. But 401 means fix the auth token first. These questions determine the entire debugging path.

## 7) Absence Is Not a Response

If the connection drops, the server crashes, or the network fails, there is no response. This is not 5xx. It is absence. Your dashboard sends a voltage request but the Pi's WiFi disconnected. No response arrives. This is not 500 Internal Server Error—that would be a valid HTTP response. This is absence. Your dashboard experiences a timeout, not an HTTP error. The server cannot send explanations later, clarify intent afterward, or speak outside a response. Everything it wants the client to know must fit in the response. Your dashboard gets 200 OK with no body. The request succeeded but there is no data. Check: is Content-Length 0 present, or is the body missing? Both are valid. The status code says success. Your coop controller gets 302 Found—check the Location header for where to look next. The redirect is an instruction, not an error. Follow the Location header.

## Common Pitfalls

Confusing absence with 5xx: no response (timeout, connection drop) is not an HTTP error. 500 is a valid response—the server spoke. Retrying 4xx: 401 and 404 will not succeed on retry. Fix the request first. Ignoring status code: clients must branch on the numeric code, not the reason phrase. Trusting Content-Type blindly: the server can lie. Validate and parse defensively. Wrong Content-Length: server declares one size, sends another—client misreads, corrupts next request.

## Summary

An HTTP response consists of a status line (version, code, reason phrase), headers (metadata), a blank line (boundary), and an optional body (payload). The status code is the most important signal. Headers describe interpretation. The body is raw data. Absence of response is not an HTTP error—it is transport failure. 4xx means fix the request. 5xx means retry might work.

## Next

This chapter builds on Chapters 1.1 through 1.7. Next: **Chapter 1.9 — Status Codes Overview**, where we map status code ranges to behavior and decision-making, and learn how clients actually react to them.
