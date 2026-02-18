# Section B Phase 1 · Chapter 1.14: Safety and Idempotency

## Learning Objectives

After this chapter, you will be able to:
- Distinguish between safety and idempotency as separate properties
- Understand why these concepts exist in HTTP
- Recognize which methods are safe, idempotent, or both
- Design POST endpoints that handle retries safely
- Understand why retries are unavoidable in distributed systems
- Apply safety and idempotency principles when choosing HTTP methods

## Key Terms

- **Safety**: Property of methods that do not change server state
- **Idempotency**: Property of operations that produce the same result whether run once or many times
- **Safe Method**: A method that does not cause state changes (GET, HEAD, OPTIONS)
- **Idempotent Method**: A method that can be applied multiple times with the same effect (GET, PUT, DELETE, HEAD, OPTIONS)
- **Idempotency Key**: A client-generated unique identifier that makes POST requests effectively idempotent
- **Side Effect**: A persistent state change caused by a request

## 1) Why These Concepts Exist

Safety and idempotency are not optional details. They are invariants of HTTP. They exist because networks fail, requests get duplicated, responses are lost, clients retry automatically, proxies replay traffic, and humans click buttons twice. If you misunderstand these concepts, your system will appear to work until it doesn't.

HTTP was designed for unreliable networks. Packets drop. Connections reset. Servers crash. Clients disappear mid-request. The protocol does not guarantee that a request arrives once, that a response arrives at all, or that a request is not duplicated. Safety and idempotency exist to make systems survivable under those conditions.

These two ideas are often confused. They are not the same. Safety answers whether this request changes state. Idempotency answers what happens if this request happens again. A method can be safe and idempotent like GET, unsafe and idempotent like PUT and DELETE, or unsafe and non-idempotent like POST. Understanding the difference is critical.

When your dashboard sends a GET request to the voltage API, it's safe with no state change and idempotent with the same result if repeated. Or sends a PUT request to the config API, which is unsafe because it changes state but idempotent because the same result occurs if repeated. Or sends a POST request to the temperature API, which is unsafe because it changes state and not idempotent because different results occur if repeated. Different properties require different retry behavior.

## 2) Safe Methods: No Side Effects

A safe method does not change server state. Calling it does not create, modify, or delete. Safe methods are observational only. When your ESP32 sends a GET request to the voltage API, this reads the voltage. No sensor is created, no config is modified, no resource is deleted. Observational only. Contrast with POST to the temperature API, which creates a temperature reading and changes server state. Not safe.

Safe methods include GET like getting voltage from your Pi, HEAD like checking if config exists without fetching the body, and OPTIONS like checking what methods are allowed on the sensors API. They exist to read, not act. When your dashboard sends a GET request to the voltage API, it's safe and reads voltage. Or sends a HEAD request to the config API, safe and checks if config exists without fetching the body. Or sends an OPTIONS request to the sensors API, safe and checks what methods are allowed. All are observational with no mutations.

No side effects means no persistent state change, no mutation of resources, no counters incremented, and no logs written as a consequence of the request itself. Logging the request is fine. Changing application state is not. When your ESP32 sends a GET request to the voltage API, your Pi may log that the ESP32 requested voltage. That's fine. Logging is acceptable. But if the Pi increments a request count counter or updates a last read timestamp, that's a side effect. GET is no longer safe. Safe means no application state change, not no logging.

Because safe methods may be automatically retried, prefetched by browsers, crawled by search engines, cached aggressively, and replayed by proxies, if a safe method has side effects, those effects may happen unexpectedly. When your dashboard sends a GET request to the voltage API and times out, your HTTP library automatically retries because GET is safe and retries are fine. Or your browser prefetches GET links to the config API, safe to prefetch with no mutations. But if GET to a reboot endpoint actually reboots the Pi, retries and prefetching cause multiple reboots with unexpected side effects. Safety matters because safe methods are trusted to be harmless.

If GET changes state, reloading a page mutates data, crawlers trigger actions, prefetching causes writes, and caching breaks correctness. This is one of the most common HTTP mistakes. When your Pi implements GET to an increment counter endpoint that increments a counter, your dashboard reloads the page and the counter increments. A crawler visits and the counter increments. Browser prefetches and the counter increments. Caches cache mutations and everything breaks. This is the GET trap. Using GET for mutations breaks the web. Use POST or PATCH instead.

## 3) Unsafe Methods: Side Effects Allowed

Unsafe methods may change state. These include POST like creating a temperature reading, PUT like replacing config, PATCH like updating config, and DELETE like removing a sensor. Calling them has consequences. When your ESP32 sends a POST request to the temperature API, it creates a temperature reading and state changes. Or your dashboard sends a PUT request to the config API, replacing the entire config and state changes. Or sends a DELETE request to the sensors API with a specific sensor ID, removing the sensor and state changes. Unsafe methods have consequences. They mutate state.

Unsafe means this request may change something. It does not mean the request is dangerous, forbidden, or unreliable. It means do not assume this can be repeated safely. Browsers warn on resubmitting POST, do not prefetch POST, and require user intent. They assume unsafe methods have consequences. When your dashboard submits a form with POST to the sensors API, your browser warns are you sure you want to resubmit because POST has consequences. Or your browser doesn't prefetch POST links. Unsafe methods aren't prefetched. Browsers assume unsafe methods have consequences. They require explicit user intent, not automatic behavior.

## 4) Idempotency: Same Effect, No Matter How Many Times

An idempotent operation produces the same result whether it runs once or many times. Important: same result means same final state. It does not mean the response is identical. It does not mean no work happens. When you send PUT to a resource with value X, then PUT to the same resource with value X again, the server may write to disk twice, log twice, and do work twice. But the final state is identical. That's idempotent.

Idempotent methods include GET like getting voltage with the same result if repeated, PUT like updating config with the same final state if repeated, DELETE like removing a sensor with the same final state if repeated, HEAD like checking config with the same result if repeated, and OPTIONS like checking allowed methods with the same result if repeated. PATCH may be idempotent depending on the operation. PATCH to config with a voltage threshold update is idempotent. PATCH to stats with an increment operation is not idempotent. POST is not idempotent. POST to the temperature API creates a new reading each time.

GET is idempotent and safe. No state change, and repeating it does nothing new. This is why GET is so powerful. When your ESP32 sends a GET request to the voltage API once, no state change and reads voltage. Sends it ten times, still no state change and reads voltage ten times. GET is both safe with no mutations and idempotent with the same result if repeated. This is why GET is so powerful. It can be retried, cached, prefetched, crawled, all without side effects.

PUT is idempotent but unsafe. PUT changes state, but repeating it yields the same state. This makes PUT safe to retry after failures. When your dashboard sends a PUT request to the config API with a voltage threshold, PUT changes state because config is updated, but it's idempotent. Sending the same PUT again yields the same final state. This makes PUT safe to retry after failures. If a PUT times out, retrying with the same body is safe. Unsafe because it mutates state, but idempotent because the same final state results.

DELETE is idempotent but unsafe. DELETE removes a resource, and removing it again changes nothing. Deleting twice is the same as deleting once. When your dashboard sends a DELETE request to the sensors API with a specific sensor ID once, the sensor is removed. Sends it again, the sensor is already gone with the same final state. DELETE is idempotent. Deleting twice is the same as deleting once. This makes DELETE safe to retry after failures. If a DELETE times out, retrying is safe. Unsafe because it mutates state, but idempotent because the same final state results.

PATCH is conditionally idempotent. PATCH depends on what the patch does. An idempotent patch sets threshold to twelve point one. A non-idempotent patch increments counter by one. Same method, different semantics.

POST is not idempotent. POST submits work, creates resources, and triggers actions. Two identical POSTs may create two records like when your ESP32 registers a sensor twice, trigger two jobs like when your solar logger processes readings twice, or charge twice like payment processing. This is intentional. When your ESP32 sends POST to the sensors API twice, two sensor records are created. This is intentional. POST is not idempotent. Two identical POSTs may create two resources.

POST exists because sometimes you don't know the resource ID yet, the action is inherently one-time, or you're submitting work, not state. POST is for commands, not state replacement.

## 5) Retries Are the Real Problem

The danger is not POST itself. The danger is retries. When your ESP32 sends a POST request to the temperature API and it succeeds, no problem. Or sends POST to the temperature API and times out, then retries, might create duplicate readings. POST itself isn't dangerous. Retries are. When failures happen like timeouts or connection drops, retries duplicate POST effects. That's why idempotency matters. It makes retries safe.

Retries happen because the response timed out, the connection dropped, the client crashed, the server restarted, or the network partitioned. The client does not know whether the server processed the request. When your ESP32 sends a POST request to the temperature API and times out after thirty seconds, did the Pi receive it? Process it? Unknown. Or your dashboard sends a PUT request to the config API and the connection drops mid-transfer. Did the Pi receive it? Unknown. Retries happen because failures are ambiguous. The client doesn't know what happened. Idempotency makes retries safe.

After a timeout, the client asks whether the server received the request or not. There are only three possibilities. The server never got it, the server got it but didn't finish, or the server finished but the response was lost. HTTP gives no built-in answer.

If the operation is idempotent, retry is safe and final state is correct. If it is not, retry may duplicate effects. When your dashboard sends a PUT request to the config API with a voltage threshold and times out, PUT is idempotent. Retry is safe. Whether the Pi received it or not, retrying yields the same final state with threshold set to twelve point one. Or sends a POST request to the temperature API and times out. POST is not idempotent. Retry may duplicate effects. If the Pi already processed it, retrying creates a duplicate reading. Idempotency solves the did it happen problem.

Retries may be triggered by HTTP client libraries, load balancers, reverse proxies, gateways, and mobile SDKs. Even if you don't retry, something else might. POST plus retry equals duplicate risk. This is why POST is dangerous under failure. POST to orders, timeout, retry, two orders created. Nothing went wrong at the protocol level.

## 6) Designing POST Safely

You must design POST endpoints with retries in mind. Common strategies include idempotency keys like an Idempotency-Key header with a unique value, client-generated IDs like POST to the readings API with an ID field, deduplication windows like rejecting duplicate requests within five minutes, and explicit retry tokens like a Retry-Token header.

When your ESP32 sends a POST request to the temperature API with an Idempotency-Key header containing a unique value, if it times out and retries with the same key, your Pi recognizes the duplicate and returns the original response instead of creating a new reading. POST becomes effectively idempotent through idempotency keys.

Your solar panel logger might send POST requests to the readings API with client-generated IDs. When the logger sends a reading with ID reading dash one two three, if the request times out and retries with the same ID, your Pi checks if that ID already exists. If it does, the Pi returns the original response instead of creating a duplicate. This makes POST effectively idempotent through client-generated IDs.

Deduplication windows work by tracking recent requests and rejecting duplicates within a time window. When your coop controller sends a POST request to the door control API, your Pi records the request timestamp and parameters. If an identical request arrives within five minutes, your Pi recognizes it as a duplicate and returns the original response. This prevents duplicate door operations during network hiccups.

An idempotency key is a client-generated unique identifier sent with the request, usually as a header. The server records the key and rejects or reuses duplicate requests with the same key. When your ESP32 sends a POST request to the temperature API with an Idempotency-Key header containing a unique value, your Pi records the key and creates the reading. If the ESP32 retries with the same key, your Pi recognizes it's a duplicate and returns the original two hundred one Created response instead of creating a new reading. The key makes POST effectively idempotent.

Idempotency keys are not magic. They require storage like a database to store keys and responses, expiration policies like expiring keys after twenty-four hours, and consistent behavior like the same key always returning the same response. But they turn POST into effectively idempotent. When your Pi stores idempotency keys in a database with expiration, keys expire after twenty-four hours. When your ESP32 retries with the same key, your Pi looks it up, finds the original response, and returns it. This requires storage and consistent behavior, but it turns POST into effectively idempotent. Not magic, but effective.

If the client can choose the resource ID, PUT is safer, PUT is retry-friendly, and PUT avoids duplication. POST is often used out of habit, not necessity. When your dashboard creates a sensor with a known ID using PUT to the sensors API with a specific sensor ID and full configuration, PUT is idempotent. Creating it twice yields the same result. Or your ESP32 registers itself without knowing its ID using POST to the sensors API and letting the Pi assign the ID. If the client can choose the ID, PUT is safer. It's idempotent by design, no idempotency keys needed.

## 7) Safety vs Idempotency Matrix

Let's make it explicit. GET is safe and idempotent like getting voltage from your Pi. HEAD is safe and idempotent like checking if a resource exists. OPTIONS is safe and idempotent like checking allowed methods. PUT is not safe but is idempotent like updating config with full replacement. DELETE is not safe but is idempotent like removing a sensor. PATCH is not safe, and idempotency depends on the operation like updating config with a threshold change is idempotent, but incrementing a counter is not. POST is not safe and not idempotent like creating a temperature reading. This table explains most HTTP bugs.

Understanding this matrix helps you choose the right method for each operation. When your dashboard needs to read voltage data, GET is perfect because it's safe and idempotent. When updating a configuration threshold, PUT is ideal because it's idempotent and safe to retry. When creating a new sensor reading, POST is necessary but requires careful handling because it's neither safe nor idempotent. The matrix guides your method selection based on the operation's requirements.

When your ESP32 uses GET to the voltage API, it's safe and idempotent, retry freely. Or uses PUT to the config API, unsafe but idempotent, safe to retry. Or uses POST to the temperature API, unsafe and not idempotent, dangerous to retry. This table explains most HTTP bugs.

Safety is about observation. Safe methods observe, inspect, and query. They should be invisible to the system's evolution. Idempotency is about recovery. Idempotent methods survive retries, tolerate duplication, and enable resilience. They make failure survivable. When your dashboard sends a PUT request to the config API and times out, PUT is idempotent. Retrying survives the failure, tolerates duplication because the same PUT twice equals the same result, enables resilience. Or sends a DELETE request to the sensors API with a specific sensor ID and times out. DELETE is idempotent. Retrying survives the failure. Idempotency is about recovery, making failures survivable through safe retries.

Safety is about trust. The web assumes GET is harmless, links are safe, and crawling won't destroy data. Break that trust and everything else breaks too. Idempotency is about uncertainty. Distributed systems assume messages may be duplicated, responses may be lost, and timeouts are ambiguous. Idempotency is how we live with that. When your ESP32 sends a POST request to the temperature API, the message might be duplicated through network retransmission, the response might be lost through connection drop, the timeout is ambiguous because you don't know if the Pi received it. Idempotency is how we live with that uncertainty. If operations are idempotent, duplication and ambiguity don't break correctness. Idempotency makes uncertainty survivable.

## 8) Why These Are Invariants

These rules are not conventions. They are assumptions baked into the ecosystem: browsers, proxies, caches, CDNs, APIs, and tooling. You violate them at your own risk. Browsers assume GET is safe. They prefetch GET links. Proxies assume idempotent methods are retry-safe. They retry GET, PUT, DELETE automatically. Caches assume GET doesn't mutate. They cache GET responses. If you violate these invariants like GET mutating state, browsers, proxies, and caches break. These are invariants. Violate them at your own risk.

Ignoring safety and idempotency leads to duplicate data like when your ESP32 retries POST and creates duplicate readings, inconsistent state like when GET mutates state and caches break, phantom actions like when crawlers trigger mutations, impossible debugging like why did this happen twice, and fragile systems that break under retries and failures. Usually discovered too late. When your ESP32 uses GET to an increment endpoint that increments a counter, it works in development. The counter increments. But it breaks in production. Browsers prefetch, crawlers index, caches cache mutations. Duplicate data, inconsistent state, phantom actions, impossible debugging, fragile systems. Usually discovered too late, after production deployment.

Your irrigation controller might use GET to trigger a watering cycle. In development, clicking the link waters the garden once. In production, search engine crawlers visit the link, browsers prefetch it, and caches serve it multiple times. The garden gets watered repeatedly, wasting water and potentially flooding plants. This is why safety matters. GET must not have side effects, or the entire web breaks.

Your freezer temperature monitor might send POST requests to log temperature readings without idempotency keys. When the Wi‑Fi connection is unstable and requests timeout, automatic retries create duplicate temperature logs. Your database fills with duplicate readings, making it impossible to track actual temperature trends. This is why idempotency matters. POST requires careful design to handle retries safely.

Before choosing a method, ask whether this is observational or mutational, can it be retried safely, what happens if it runs twice, and what happens if the response is lost. The method should encode the answer. When your ESP32 wants to send a temperature reading, is it observational or mutational? Mutational because it creates a reading. Can it be retried safely? No, might duplicate. What happens if it runs twice? Two readings created. What happens if the response is lost? Unknown if reading was created. Answer: POST to the temperature API. Not idempotent, handle retries carefully.

This chapter is Phase 0 applied to HTTP. Invariants must hold like GET must not mutate state. Failure is normal like ESP32 timeouts and Pi crashes. Boundaries matter like HTTP versus transport failures. Absence does not equal error like timeout versus five hundred. Retries are reality like automatic retries by libraries and proxies. HTTP methods exist to encode those truths. When your ESP32 sends a GET request to the voltage API, invariant: GET must not mutate state. Or times out, failure is normal, retries are reality. HTTP methods encode these truths. Safety and idempotency make systems survivable.

## Common Pitfalls

Confusing safety and idempotency leads to incorrect retry behavior. Safety means no state change. Idempotency means same result if repeated. GET is both. PUT and DELETE are idempotent but not safe. POST is neither. Understanding the difference is critical for proper retry logic.

Using GET for mutations breaks the web. When GET changes state, reloading pages mutates data, crawlers trigger actions, prefetching causes writes, and caching breaks correctness. This is one of the most common HTTP mistakes.

Ignoring retries when designing POST endpoints causes duplicate operations. POST is not idempotent, so retries after timeouts can create duplicate resources. Design POST endpoints with idempotency keys, client-generated IDs, or deduplication windows.

Assuming you control all retries is dangerous. HTTP client libraries, load balancers, reverse proxies, gateways, and mobile SDKs may retry automatically. Even if you don't retry, something else might. Design for automatic retries.

Not understanding that idempotency is about final state, not identical responses, leads to confusion. PUT with the same body twice may write to disk twice and log twice, but the final state is identical. That's idempotent.

## Summary

Safety and idempotency are HTTP invariants. Safe methods do not change state, including GET, HEAD, and OPTIONS. Idempotent methods tolerate retries, including GET, PUT, DELETE, HEAD, and OPTIONS. PATCH depends on the operation. GET is safe and idempotent, retry freely, cache, prefetch. PUT and DELETE are idempotent but unsafe, safe to retry, not safe to prefetch. POST is neither safe nor idempotent, dangerous to retry, requires careful design. Retries are unavoidable. Libraries, proxies, and load balancers retry automatically. Method choice is failure design. It determines retry safety, cache behavior, and system resilience. HTTP does not protect you from mistakes. It assumes you understand these invariants. These rules are assumptions baked into browsers, proxies, caches, CDNs, APIs, and tooling. Violate them at your own risk. Understanding safety and idempotency is critical for building robust systems that handle failures correctly.

## Next

This chapter built on Chapter 1.13, which covered HTTP methods. Next, Chapter 1.15 explores headers, showing how HTTP carries metadata, control signals, authentication, caching, and state without breaking statelessness. This is where HTTP stops being requests and responses and becomes a control plane.
