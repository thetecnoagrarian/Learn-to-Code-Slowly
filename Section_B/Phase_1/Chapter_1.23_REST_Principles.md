# Section B Phase 1 · Chapter 1.23: REST Principles

## Learning Objectives

After this chapter, you will be able to:
- Understand REST as a set of constraints derived from HTTP, not a separate protocol
- Identify resources and model them with URLs
- Distinguish between resources and representations
- Use HTTP methods correctly to express intent
- Design stateless APIs that scale
- Apply uniform interface principles to reduce coupling
- Recognize when REST principles apply and when alternatives might be appropriate

## Key Terms

- **REST**: Representational State Transfer, a set of constraints derived from HTTP's properties
- **Resource**: A conceptual thing identified by a URL that exists independently of its representation
- **Representation**: Concrete bytes in a specific format (JSON, HTML, XML) that travels over HTTP
- **Uniform Interface**: REST constraint requiring same methods, semantics, and status codes everywhere
- **Statelessness**: REST constraint requiring every request contain everything needed to process it
- **HATEOAS**: Hypermedia As The Engine Of Application State, where servers tell clients what they can do next via links
- **Content Negotiation**: Process where clients express format preferences via Accept header and servers choose representation

## 1) REST Is Derived from HTTP

REST, Representational State Transfer, was described by Roy Fielding while defining HTTP itself. It is not layered on top of HTTP. It is extracted from HTTP's properties. If you violate REST, you are usually fighting HTTP, not extending it. REST is not a protocol. REST is not a library. REST is not a framework. REST is a set of constraints that fall naturally out of HTTP when you take its rules seriously.

HTTP already gives you methods, status codes, headers, statelessness, caching, and uniform resource identifiers. REST is simply using those tools honestly. This chapter is about understanding REST as a design consequence, not a dogma. When your Pi uses POST for everything, GET slash api slash getReadings, POST slash api slash createReading, POST slash api slash deleteSensor, this fights HTTP. REST uses GET for retrieval, POST for creation, DELETE for removal. Your dashboard, ESP32, or coop controller: REST is derived from HTTP. If you violate REST, you are usually fighting HTTP, not extending it.

Chapter 1.5 covered statelessness and connection lifecycle. Chapter 1.13 covered HTTP methods. Chapter 1.14 covered safety and idempotency. Chapter 1.18 covered URLs, paths, and query strings. Chapter 1.22 covered redirects and the Location header. We have seen how HTTP provides methods, status codes, headers, statelessness, caching, and uniform resource identifiers. REST is not a new protocol layered on top. It is the disciplined use of HTTP's existing semantics. This chapter shows how REST emerges naturally when you stop fighting HTTP and start using it honestly.

## 2) Resources Are the Foundation

Everything in REST begins with the idea of a resource. Resources are the nouns of your API, the things you can identify, retrieve, create, update, or delete. A resource is a conceptual thing. It exists conceptually, even if stored in a database or computed on demand. It is identified by a URL. The URL is the stable identifier. It is stable over time. The same URL should identify the same conceptual thing, even if its representation changes.

Examples include a user, identified by slash users slash 42, a sensor, identified by slash sensors slash alpha, a reading, identified by slash readings slash 123, a collection of readings, identified by slash readings, and a configuration document, identified by slash configs slash coop. A resource is not a function. Resources are things, not operations. A resource is not a verb. Actions belong in HTTP methods, not resource names. A resource is not a procedure. Resources are state, not behavior.

When your Pi has resources, slash api slash sensors slash alpha, a sensor, slash api slash readings slash 123, a reading, slash api slash configs slash coop, a configuration, these are things, not actions. Your dashboard or ESP32: a resource is a conceptual thing identified by a URL. A resource is not a function, verb, or procedure.

In REST, the URL identifies what, not what to do. Good URLs include slash users, slash users slash 42, slash sensors slash alpha, and slash readings slash 123. Bad URLs include slash getUser, slash createReading, and slash deleteSensor. Actions belong in methods, not URLs. When your Pi uses GET slash api slash sensors slash alpha, good, not GET slash api slash getSensor question mark id equals alpha, bad. Uses DELETE slash api slash sensors slash alpha, good, not POST slash api slash deleteSensor, bad. Your dashboard or coop controller: URLs identify resources. Actions belong in methods, not URLs.

## 3) Resources Versus Representations

A resource is abstract. It exists conceptually, independent of how it is serialized or transmitted. A representation is concrete. It is bytes in a specific format, JSON, HTML, XML, plain text, that travels over HTTP. The same resource may be represented as JSON, for APIs, dashboards, HTML, for browsers, XML, for legacy systems, or plain text, for simple clients like ESP32.

The resource is the thing, the sensor, the reading, the config. The representation is how it crosses the boundary, the JSON body, the HTML page, the plain text output. This separation allows the same resource to serve different clients with different needs. Your dashboard gets JSON, your browser gets HTML, your ESP32 gets plain text, all from the same resource. When your Pi's sensor resource slash api slash sensors slash alpha can be represented as JSON for your dashboard, HTML for a browser, or plain text for your ESP32, the resource is the thing. The representation is how it crosses the boundary. Your solar dashboard or poultry net config: same resource, different representations.

HTTP does not transmit resources. HTTP transmits representations of resources. The body of a response is not the resource. It is a snapshot of it in some format. This distinction matters. When your dashboard GETs slash api slash sensors slash alpha, receives a JSON representation, the sensor resource exists on your Pi. The JSON is a snapshot. Your ESP32 or coop controller: HTTP transmits representations of resources. This distinction matters.

Clients express preferences via Accept colon application slash json, Accept colon text slash html. Servers choose one representation and declare it with Content-Type. Same resource. Different view. When your dashboard sends Accept colon application slash json, gets JSON. Your browser sends Accept colon text slash html, gets HTML. Your ESP32 sends Accept colon text slash plain, gets plain text. Same sensor resource, different representations. Your solar dashboard or poultry net config: content negotiation enables multiple representations. Same resource, different view.

## 4) HTTP Methods Express Intent

HTTP is not just transport. HTTP methods have meaning. REST insists you respect that meaning. When your Pi uses GET for retrieval, POST for creation, PUT for replacement, DELETE for removal, your dashboard, ESP32, or coop controller: REST treats HTTP as an application protocol. REST insists you respect that meaning.

REST aligns intent with method. GET retrieves a representation. POST creates a new resource or submits data. PUT replaces a resource. PATCH partially updates a resource. DELETE removes a resource. Using POST for everything discards information HTTP already provides. When your Pi uses POST slash api slash doSomething for everything, retrieval, creation, deletion, this discards HTTP's built-in semantics. Your dashboard or coop controller: methods carry intent. Using POST for everything discards information HTTP already provides.

In REST, GET does not change state, GET is safe, GET is cacheable, and GET can be repeated freely. If a GET changes state, you have broken a core invariant. When your Pi has GET slash api slash readings slash 123 that also deletes the reading, this breaks REST. GET must be read-only. Your dashboard or ESP32: GET is read-only by contract. If a GET changes state, you have broken a core invariant.

POST is often abused as a universal hammer. In REST, POST creates a subordinate resource, or submits data to a processing resource. POST is not idempotent. POST must be designed carefully. When your dashboard POSTs to slash api slash readings to create a new reading, POST creates a subordinate resource. Your ESP32 POSTs sensor data, POST submits data to a processing resource. Your coop controller: POST is not do anything. POST must be designed carefully.

PUT says store this representation at this URL. The client knows the URL. The client supplies the full representation. The server replaces what was there. PUT is idempotent. When your dashboard PUTs a full config to slash api slash configs slash coop, replaces the entire config. PUT again with the same data, same result. Your Pi or ESP32: PUT means replace. PUT is idempotent.

PATCH says apply these changes. PATCH does not replace the resource. PATCH modifies parts. PATCH is useful, but requires careful definition. When your dashboard PATCHes slash api slash configs slash coop with temperature_threshold colon 75, modifies only that field. Your solar dashboard or poultry net config: PATCH means partial update. PATCH is useful, but requires careful definition.

DELETE removes the resource identified by the URL. DELETE is idempotent. Deleting twice is the same as deleting once. DELETE may return two hundred four No Content, two hundred OK with a representation, or four hundred four if already gone. When your dashboard DELETEs slash api slash sensors slash alpha, your Pi returns two hundred four No Content. DELETEs again, returns four hundred four, already gone. Your coop controller or ESP32: DELETE removes the resource. DELETE may return two hundred four, two hundred, or four hundred four.

## 5) Status Codes Are First-Class Signals

REST relies heavily on HTTP status codes. Status codes are not decoration. They are the primary outcome channel. When your dashboard GETs slash api slash sensors slash alpha, your Pi returns two hundred OK with JSON, or four hundred four Not Found, or five hundred Server Error. Your ESP32 or coop controller: REST uses status codes as first-class signals. They are the primary outcome channel.

Status codes encode semantics. Examples include two hundred, success, representation returned, two hundred one, resource created, two hundred four, success, no body, four hundred, client error, four hundred four, resource does not exist, four hundred nine, conflict, and five hundred, server failure. REST expects clients to read and act on these. When your dashboard receives two hundred one Created, knows a resource was created. Receives four hundred nine Conflict, knows there was a conflict. Your ESP32 or coop controller: status codes encode semantics. REST expects clients to read and act on these.

## 6) Statelessness Enables Scalability

Every request must contain everything the server needs to process it. The server does not remember previous requests, client history, or navigation state. State is in the resource, in the request, or in a token or cookie carried by the client. When your dashboard sends a session cookie with every request, state is in the cookie, not in server memory. Your ESP32 sends an API token, state is in the token. Your coop controller: REST is stateless by constraint. State is in the resource, request, or token or cookie carried by the client.

Stateless servers are easier to scale, can be load balanced, and can crash and restart freely. REST favors this tradeoff intentionally. When your Pi can scale horizontally, add more Pi servers, load balance requests. If one crashes, others continue. Your dashboard or ESP32: statelessness enables scalability. REST favors this tradeoff intentionally.

REST does not forbid sessions. REST requires that session state be explicit, be carried by the client, and not be implicit server memory. Cookies and tokens satisfy this constraint. When your dashboard uses session cookies, session state is explicit, carried by the client. Your ESP32 uses API tokens, authentication state is explicit. Your coop controller: sessions are an application layer choice. Cookies and tokens satisfy this constraint.

If a response is cacheable, declare it and let intermediaries work. REST aligns naturally with Cache-Control, ETags, and conditional requests. Caching is not an optimization. It's a design goal. When your Pi declares cacheable responses with Cache-Control headers, intermediaries can cache. Your dashboard or ESP32: REST encourages cacheability. Caching is not an optimization. It's a design goal.

## 7) Uniform Interface Reduces Coupling

REST's most important idea is the uniform interface. This means same methods everywhere, same semantics everywhere, and same status codes everywhere. Clients do not need endpoint-specific rules. Once a client understands HTTP methods and status codes, it can interact with any REST API. This is why REST scales socially. Developers don't need to learn a new protocol for each API.

When your dashboard knows GET slash api slash sensors slash alpha, GET slash api slash readings slash 123, GET slash api slash configs slash coop all work the same way, same methods, same semantics, same status codes. Your ESP32 or coop controller: uniform interface is the core constraint. Clients do not need endpoint-specific rules.

When interfaces are uniform, clients can evolve independently, servers can change internally, and intermediaries can exist. This is why REST scales socially, not just technically. When your dashboard can evolve independently of your Pi, adds features without breaking. Your Pi can change internally, as long as the interface stays uniform. Your solar dashboard or poultry net config: uniform interface reduces coupling. This is why REST scales socially, not just technically.

## 8) Hypermedia and REST Flexibility

Strict REST includes HATEOAS, Hypermedia As The Engine Of Application State. This means the server tells the client what it can do next via links in representations, for example sensor colon curly brace dot dot dot curly brace comma links colon curly brace self colon slash sensors slash alpha comma readings colon slash sensors slash alpha slash readings curly brace. The client discovers available actions dynamically, rather than hardcoding URLs. HATEOAS enables true loose coupling. Clients follow links rather than constructing URLs. The server can evolve URLs without breaking clients, as long as link relations stay stable.

Most APIs ignore this. That's okay. REST is a spectrum, not a switch. Very few systems are pure REST. REST is guidance. Using HTTP honestly gets you most of the value. Dogma gets you very little. When your Pi API uses HTTP honestly, resources, methods, status codes. Not pure REST but RESTful enough. Your dashboard or coop controller: REST is a spectrum, not a switch. Using HTTP honestly gets you most of the value. Dogma gets you very little.

REST is often reduced to CRUD. This is a mistake. REST supports workflows, transitions, and state machines, as long as they are modeled as resources. When your Pi models a job as a resource, POST slash api slash jobs creates it, GET slash api slash jobs slash 123 checks status. Your dashboard or ESP32: REST does not mean CRUD only. REST supports workflows, transitions, state machines, as long as they are modeled as resources.

If you need to do something, model the result as a resource, or model the process as a resource. For example, POST slash jobs, GET slash jobs slash 123. Not POST slash runJob. When your Pi models a sensor calibration job, POST slash api slash jobs creates it, GET slash api slash jobs slash 456 checks progress. Not POST slash api slash runCalibration. Your coop controller or cow barn dashboard: modeling actions as resources. POST slash jobs, not POST slash runJob.

## 9) REST Design Patterns and Evolution

Errors are not exceptions. Errors are representations. A four hundred response may include a JSON body describing what failed and field-level validation messages. This is still RESTful. When your dashboard POSTs invalid data, your Pi returns four hundred Bad Request with JSON body describing field errors. Your ESP32 or coop controller: REST and error modeling. Errors are representations. This is still RESTful.

Versioning is a design choice. Common strategies include version in URL, slash v1 slash readings, version in header, or version in representation. REST does not mandate one, but consistency matters. When your Pi uses slash api slash v1 slash readings, slash api slash v2 slash readings for versioning. Or uses Accept colon application slash vnd dot api dot v1 plus json. Your dashboard or ESP32: REST and versioning. REST does not mandate one, but consistency matters.

REST systems evolve by adding fields, adding links, and adding resources. Not by changing semantics of existing ones. Backward compatibility is a design discipline. When your Pi adds fields to sensor representations, old clients still work. Adds new resources, does not break existing ones. Your solar dashboard or poultry net config: REST and evolution. Backward compatibility is a design discipline.

REST does not make systems simple. REST makes complexity explicit. You still design resource models, state transitions, authorization rules, and validation. REST just gives you a stable vocabulary. When your Pi still designs resource models, state transitions, authorization rules, validation. REST does not eliminate complexity. REST makes complexity explicit. Your dashboard or ESP32: REST just gives you a stable vocabulary.

## 10) REST and Boundary-First Design

REST assumes untrusted clients, unreliable networks, and independent evolution. It aligns perfectly with Phase 0 boundary thinking. When your Pi assumes untrusted clients, unreliable networks, independent evolution. Your dashboard, ESP32, or coop controller: REST is boundary-first design. It aligns perfectly with Phase 0 boundary thinking.

REST fails when URLs lie, methods lie, or status codes lie. REST works when names match behavior. This echoes Phase 0 abstraction rules. When your Pi uses URLs that match behavior, GET slash api slash sensors slash alpha retrieves, DELETE slash api slash sensors slash alpha removes. Names match behavior. Your dashboard or coop controller: REST is about honesty. This echoes Phase 0 abstraction rules.

You can build non-REST APIs. RPC exists. GraphQL exists. WebSockets exist. REST is a choice, not a moral obligation. When your Pi could use RPC-style endpoints, GraphQL, or WebSockets. REST is one choice. Your dashboard or ESP32: REST is not required. REST is a choice, not a moral obligation.

REST matters because HTTP infrastructure already exists, tooling understands it, debugging is straightforward, and failures are visible. REST leverages decades of operational reality. When your Pi uses HTTP, infrastructure exists, tooling understands it, debugging is straightforward. Your dashboard or coop controller: why REST still matters. REST leverages decades of operational reality.

By now, you have seen boundaries, state, invariants, failure modes, and explicit signaling. REST is simply HTTP plus discipline. When your Pi uses HTTP methods honestly, status codes correctly, resources identified by URLs. Your dashboard, ESP32, or coop controller: REST fits the mental model you've built. REST is simply HTTP plus discipline.

## Common Pitfalls

Using POST for everything discards HTTP semantics. POST should create resources or submit data, not retrieve or delete. Use GET for retrieval, DELETE for removal. Respecting method semantics enables caching, retries, and proper error handling.

Putting actions in URLs breaks REST principles. URLs should identify resources, not operations. Use slash sensors slash alpha, not slash getSensor or slash deleteSensor. Actions belong in HTTP methods, not URL paths.

Ignoring statelessness causes scalability problems. If servers remember client state between requests, they cannot scale horizontally or recover from crashes. Store state in resources, requests, or client-carried tokens, not server memory.

Not using status codes properly hides outcomes. Status codes are the primary outcome channel, not decoration. Use two hundred for success, four hundred four for not found, four hundred for client errors, five hundred for server errors. Clients must read and act on status codes.

Confusing resources with representations causes design problems. Resources are abstract concepts. Representations are concrete bytes. The same resource can have multiple representations. Design resources first, then choose representations based on client needs.

## Summary

REST is not a protocol. REST is not magic. REST is the disciplined use of HTTP's existing semantics. Resources identified by URLs, representations exchanged over HTTP, methods that express intent, status codes that signal outcomes, stateless requests, and explicit boundaries. REST emerges naturally when you stop fighting HTTP and start using it honestly. REST is not a protocol. It is the disciplined use of HTTP's existing semantics. Resources identified by URLs, representations exchanged over HTTP, methods that express intent, status codes that signal outcomes. When names match behavior and methods match intent, you are doing REST. The uniform interface enables loose coupling and social scalability. Statelessness enables horizontal scaling and resilience. REST is a spectrum, not a switch. Using HTTP honestly gets you most of the value. Understanding REST principles helps you design APIs that leverage HTTP's built-in capabilities rather than fighting against them.

## Next

This chapter built on Chapter 1.5, which covered statelessness, Chapter 1.13, which covered HTTP methods, Chapter 1.14, which covered safety and idempotency, Chapter 1.18, which covered URLs and paths, and Chapter 1.22, which covered redirects. Next, Chapter 1.24 explores seeing HTTP in the wild, where we stop theorizing and start observing real requests, real responses, browser DevTools, curl, and debugging live systems. Because understanding is complete only when you can see it happening.
