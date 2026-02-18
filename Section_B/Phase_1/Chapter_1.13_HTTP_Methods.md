# Section B Phase 1 · Chapter 1.13: HTTP Methods

## Learning Objectives

After this chapter, you will be able to:
- Understand how HTTP methods encode intent about safety, idempotency, and side effects
- Choose the correct method for different operations based on semantics
- Recognize why method choice matters most under failure conditions
- Distinguish between safe and idempotent methods
- Implement proper retry logic based on method semantics
- Avoid common anti-patterns that break under failure

## Key Terms

- **HTTP Method**: The verb in the request line that tells the server what kind of action the client intends
- **Safe Method**: A method that does not cause state changes on the server
- **Idempotent Method**: A method that can be applied multiple times with the same effect as a single application
- **GET**: Safe and idempotent method for retrieving resources
- **POST**: Non-safe and non-idempotent method for submitting data or creating resources
- **PUT**: Idempotent but not safe method for replacing resources
- **PATCH**: Method for partial modification, idempotency depends on the operation
- **DELETE**: Idempotent but not safe method for removing resources

## 1) Methods Encode Intent, Not Implementation

The HTTP method tells the server what kind of action the client intends. It is not decoration. It is not optional semantics. It is a contract. Every method encodes expectations about safety, idempotency, caching, retries, and side effects. If you misuse methods, your system will break under failure, not under success.

Chapter 1.12 showed how errors differ from failures. This chapter shows how method semantics determine what's safe to retry when failures occur. Whether your ESP32 times out sending temperature readings, your dashboard retries a failed request, or your Pi's connection drops mid-transfer, method choice determines whether retries are safe or dangerous.

The method does not tell the server how to do something. It tells the server what kind of thing the client wants. The client wants to retrieve, create, replace, partially modify, or remove. The server decides how to fulfill that intent. When a client sends GET followed by a resource path, it is making a promise that it is not asking the server to change anything. When a client sends POST followed by a resource path, it is saying this may cause a change. Servers, proxies, caches, and clients rely on this promise.

When your dashboard sends a GET request to the voltage API, it promises no state change. Your Pi can cache this, prefetch it, retry it safely. Or your ESP32 sends a POST request to the temperature API, signaling potential change. Your Pi knows not to cache this, not to retry it automatically, to handle it carefully. The method is a contract. Break it at your peril.

## 2) Why Methods Matter Under Failure

When everything works, incorrect methods appear to work. When failures happen, incorrect methods cause data loss, duplicate actions, corrupted state, and inconsistent systems. Methods exist for failure cases, not happy paths.

When your ESP32 sends a GET request to an increment counter endpoint and it works, the counter increments. But when the request times out and your ESP32 retries, since GET is safe to retry, the counter increments twice. Or your solar panel logger sends a POST request to the readings API and times out. If you retry blindly, you might send duplicate readings. Methods exist for failure cases, when retries happen, when connections drop, when ambiguity enters the system.

This phase focuses on the five most important methods: GET, POST, PUT, PATCH, and DELETE. These are sufficient to model almost all HTTP APIs correctly.

## 3) GET Retrieves Without Side Effects

GET retrieves a representation of a resource. GET is safe, idempotent, cacheable, and typically has no request body by convention. GET must not change server state.

Safe means this request does not cause a state change on the server. It does not mean the request is harmless, free, or cheap. It means no mutation. Because safe methods can be retried automatically, prefetched, cached, and replayed, if GET mutates state, the entire web breaks.

When your dashboard sends a GET request to the voltage API and times out, your HTTP library can retry automatically because GET is safe with no side effects. Or your browser prefetches GET links to the config API, safe to prefetch with no mutations. If GET mutated state, retries and prefetching would break everything. Safety enables automation.

GET is idempotent. One GET leaves state unchanged. Ten GETs leave state unchanged. The response may change over time, but the act of requesting does not. When your ESP32 sends a GET request to the voltage API once, state is unchanged. Sends it ten times, state is still unchanged. The voltage reading might change because it's a new reading each time, but the act of requesting doesn't change server state. GET is both safe and idempotent, perfect for retries.

Technically, HTTP allows GET bodies. Practically, you should never rely on them. Many clients, proxies, and servers ignore GET bodies entirely. If you need a body, you likely want POST. When your dashboard sends a GET request to a search API with a body containing search criteria, some proxies might strip the body, some servers might ignore it. Use query parameters instead, such as GET followed by the search API path with query parameters. Or if you need complex data, use POST to the search API. POST is designed for bodies.

Good uses of GET include fetching sensor readings like getting voltage from your Pi, retrieving configuration like getting config from your coop controller, loading a web page like dashboard HTML, or querying current state like getting fence status from your poultry net controller. Bad uses include triggering actions like rebooting the server, which should use POST, updating counters like incrementing a value, which should use POST or PATCH, or creating records like creating a sensor, which should use POST.

## 4) POST Submits or Creates

POST submits data to be processed. POST is for creating new resources, triggering actions, and submitting forms. POST is not idempotent by default. POST does not mean store this here. It means here is data, do something with it. What happens next is server-defined.

Because POST is not idempotent, retrying after a timeout can cause duplicate actions, and retrying after a partial failure can cause double creation. This is why POST requires care. When your ESP32 sends a POST request to the temperature API and times out, did the Pi receive it? Process it? Unknown. If you retry, you might send duplicate temperature readings. Or your solar panel logger sends a POST request to the readings API and the connection drops mid-transfer. Retrying might create duplicate readings. POST requires care. Understand what you're retrying and why.

A common pattern is POST to the sensors API. The server responds with two hundred one Created and a Location header with the new resource URL, such as Location pointing to the sensors API with the new sensor ID. The client did not choose the ID. The server did. When your ESP32 sends a POST request to the sensors API to register itself, your Pi creates a sensor record, assigns an ID like esp32_coop, and responds with two hundred one Created with a Location header pointing to the new sensor endpoint. The ESP32 didn't choose the ID. The Pi did.

POST may create records like when your ESP32 registers a new sensor, send emails like alert notifications, trigger jobs like when your solar logger starts data processing, or charge credit cards like payment processing. This is why retries are dangerous. When your solar panel logger sends a POST request to the readings API and times out, if you retry blindly, you might send duplicate readings, corrupting your data. POST retries are dangerous. Understand what you're retrying.

## 5) PUT Replaces a Resource

PUT means store this representation at this exact location. PUT is idempotent, not safe, and often used for full replacement. PUT says after this request, the resource at this URL should look exactly like this. Not update these fields. Not merge. Replace.

Because replacing the same representation twice yields the same result, PUT once sets state to X, PUT again sets state to X. No additional effect. When your dashboard sends a PUT request to the config API with the same configuration twice, first PUT sets state to X, second PUT sets state to X again, same result, no additional effect. This makes PUT safe to retry. If a PUT times out, retrying with the same body is safe.

PUT is typically used when the client knows the resource URL and the client controls the identifier. When your dashboard knows the sensor ID and sends a PUT request to the sensors API with a specific sensor ID and full sensor configuration, the dashboard controls the identifier. It knows exactly which sensor to update.

You can create with PUT if the client chooses the ID and the operation is idempotent. Otherwise, use POST. When your dashboard creates a sensor with a known ID using PUT to the sensors API with a specific sensor ID and full configuration, the dashboard chooses the ID, and the operation is idempotent. Creating it twice yields the same result. Or your ESP32 registers itself without knowing its ID. Use POST to the sensors API and let the Pi assign the ID.

## 6) PATCH Applies Partial Modification

PATCH applies a partial change to a resource. PATCH says apply this transformation. Not replace everything. Not create something new. When your dashboard sends a PATCH request to the config API with only the voltage threshold field, this updates only the voltage threshold. Other fields remain unchanged. Contrast with PUT. PUT would replace the entire config. PATCH is for partial updates. PUT is for full replacement.

PATCH does not prescribe JSON Patch, Merge Patch, or any specific format. It only says partial update. When your dashboard sends a PATCH request to the config API with merge patch format containing only the voltage threshold, or sends PATCH with JSON Patch format specifying a replace operation, both are valid. PATCH doesn't prescribe format, only intent: partial update.

PATCH can be idempotent if the same patch produces the same result. Setting threshold to twelve point one is idempotent. Incrementing a counter is not idempotent. PATCH can be dangerous if the operation is not idempotent and retries apply the patch multiple times. This must be designed explicitly. When your dashboard sends a PATCH request to the config API with an increment operation and times out, if you retry, you might increment twice. Design PATCH operations to be idempotent when possible. Use set to X instead of increment by Y.

## 7) DELETE Removes a Resource

DELETE removes a resource. DELETE is idempotent, not safe, and often returns two hundred four No Content. When your dashboard sends a DELETE request to the sensors API with a specific sensor ID, the sensor is removed. DELETE is idempotent. Deleting twice has the same end state: resource gone. DELETE is not safe. It mutates state. Often returns two hundred four No Content, success with no body needed.

Deleting something twice has the same end state. First DELETE makes the resource gone. Second DELETE finds the resource already gone. No additional effect. When your dashboard sends a DELETE request to the sensors API with a specific sensor ID and gets two hundred four No Content, deleted. Sends it again and gets four hundred four Not Found, already gone. Same end state: resource doesn't exist. This makes DELETE safe to retry. If a DELETE times out, retrying is safe because it's idempotent.

Common responses include two hundred four No Content for success like when a sensor is deleted, four hundred four Not Found for already gone like when a sensor is already deleted, or four hundred three Forbidden for not allowed like when your dashboard lacks permission to delete. All are valid. When your dashboard sends a DELETE request to the sensors API with a specific sensor ID, your Pi responds with two hundred four No Content, deleted successfully. Or responds with four hundred four Not Found, already deleted, idempotent with same end state. Or responds with four hundred three Forbidden, you don't have permission. All are valid responses.

DELETE means this resource is no longer accessible. It does not guarantee physical deletion, immediate removal, or no audit trail. That is server policy.

## 8) Method Safety vs Idempotency

These are different properties. GET is safe and idempotent. POST is neither safe nor idempotent. PUT is not safe but is idempotent. PATCH is not safe, and idempotency depends on the operation. DELETE is not safe but is idempotent. Memorize this table.

Caches cache GET, do not cache POST, and invalidate on PUT, PATCH, and DELETE. If you misuse methods, caches misbehave. When your dashboard sends a GET request to the voltage API, caches can cache this response. Or sends a POST request to the temperature API, caches won't cache this because POST isn't cacheable. Or sends a PUT request to the config API, caches invalidate any cached config. If you use GET to mutate state, caches will cache mutations, breaking everything.

Proxies may retry idempotent methods automatically, avoid retrying POST, and log methods differently. Method semantics affect infrastructure. When your ESP32 sends a GET request to the voltage API through a proxy and it times out, the proxy might retry automatically because GET is idempotent and safe to retry. Or sends a POST request to the temperature API and it times out. The proxy won't retry automatically because POST isn't idempotent. Retries are dangerous. Method semantics affect how infrastructure behaves.

Browsers prefetch GET links, warn on resubmitting POST, and change POST to GET on redirects historically. These behaviors assume correct method usage. When your browser prefetches GET links to the voltage API, safe to prefetch with no mutations. Or warns when you try to resubmit a POST form because POST isn't idempotent. Resubmitting might duplicate actions. Or changes POST to GET on redirects, historical behavior that breaks POST semantics. These behaviors assume correct method usage. Break the contract, break the web.

## 9) Method Choice Is Architecture

Choosing methods correctly enables safe retries, enables resilience, enables caching, and enables scale. Choosing incorrectly works in development but breaks in production. When your ESP32 uses GET to send temperature readings to the temperature API, it works in development. The Pi processes it. But it breaks in production. Caches cache mutations, retries duplicate readings, proxies retry automatically. Or uses POST to the temperature API correctly. Works in development and production. Method choice is architecture. It determines how your system behaves under failure.

Common anti-patterns include using GET to trigger actions, using POST for updates, using POST everywhere because it works, and ignoring idempotency. These are failure multipliers.

The method alone is not enough. POST plus two hundred one equals created, like when your ESP32 creates a sensor. PUT plus two hundred four equals replaced, like when your dashboard updates config. DELETE plus four hundred four equals already gone, like when a sensor is already deleted. Clients interpret both. When your ESP32 sends a POST request to the sensors API and gets two hundred one Created, sensor created, check the Location header. Or your dashboard sends a PUT request to the config API and gets two hundred four No Content, config replaced with no body. Or sends a DELETE request to the sensors API with a specific sensor ID and gets four hundred four Not Found, already gone, idempotent success. Method plus status code equals full meaning.

Methods express intent, not authorization. GET may still be forbidden. DELETE may be denied. POST may require authentication. Permissions live elsewhere. When your ESP32 sends a GET request to the admin users API, GET expresses intent to retrieve, but your Pi responds with four hundred three Forbidden. You don't have permission. Or sends a DELETE request to the config API. DELETE expresses intent to remove, but your Pi responds with four hundred one Unauthorized. You're not authenticated. Methods express intent. Permissions control access.

HTTP does not prevent you from mutating on GET, creating on PUT, or deleting on POST. The protocol trusts you. That trust is easy to violate. When your Pi could implement GET to a reboot endpoint that actually reboots the server, HTTP doesn't prevent this. Or implement PUT to the sensors API that creates a sensor. HTTP allows this. The protocol trusts you to honor method semantics. Violate that trust, and caches, proxies, and clients break. Discipline matters.

HTTP is simple because it assumes discipline. When that discipline breaks, clients break, caches break, retries break, and systems rot. When your Pi implements GET to an increment endpoint that increments a counter, it works in development. The counter increments. But it breaks in production. Caches cache mutations, retries increment multiple times, proxies retry automatically. The discipline breaks, and everything breaks. HTTP is simple because it assumes discipline. Honor the contract.

## 10) Method Choice Checklist

Think in verbs. GET means show me. POST means do this. PUT means make it exactly this. PATCH means change this part. DELETE means remove it. If that sentence feels wrong, the method is wrong.

Before choosing a method, ask whether this changes state, is it safe to retry, who controls the resource ID, can this be cached, and what happens on timeout. The method encodes your answers. When your ESP32 wants to send a temperature reading, does it change state? Yes, it creates a reading. Safe to retry? No, might duplicate. Who controls ID? Server. Can it be cached? No. What happens on timeout? Dangerous, might duplicate. Answer: POST to the temperature API. Not idempotent, server assigns ID, handle timeouts carefully.

## Common Pitfalls

Using GET to trigger actions breaks caching and retry behavior. When GET mutates state, caches cache mutations, and automatic retries cause duplicate side effects. This breaks the web.

Ignoring idempotency leads to dangerous retries. POST is not idempotent, so retrying after timeouts can cause duplicate operations. Always consider what happens if a request is retried when choosing methods.

Using POST for everything because it works breaks under failure. POST is not idempotent, so retries are dangerous. Use PUT for full replacement, PATCH for partial updates, DELETE for removal, and GET for retrieval.

Confusing method semantics with permissions breaks client logic. Methods express intent, not authorization. A GET request may still be forbidden, and a DELETE request may require authentication. Handle permissions separately from method choice.

Not designing PATCH operations to be idempotent causes problems under failure. If a PATCH operation increments a counter and times out, retrying increments twice. Design PATCH operations to be idempotent when possible.

## Summary

HTTP methods encode intent about safety, idempotency, and side effects. GET is safe and idempotent, perfect for retrieval. POST is neither safe nor idempotent, used for submitting data or creating resources. PUT is idempotent but not safe, used for full replacement. PATCH is for partial modification, with idempotency depending on the operation. DELETE is idempotent but not safe, used for removal. Method choice matters most under failure. Choosing methods correctly enables safe retries, resilience, caching, and scale. Choosing incorrectly works in development but breaks in production. Methods are contracts. Honor them. Method semantics affect how caches, proxies, browsers, and clients behave. Understanding method semantics is critical for building robust systems that handle failures correctly.

## Next

This chapter built on Chapter 1.12, which covered errors versus failures. Next, Chapter 1.14 explores safety and idempotency, formalizing these properties and showing exactly why retries, failures, and distributed systems make them unavoidable. This is where HTTP stops being web stuff and becomes systems engineering.
