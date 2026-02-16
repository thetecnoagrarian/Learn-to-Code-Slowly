# Phase 2 · Chapter 2.23: REST Principles

This chapter builds on [Chapter 2.5: Statelessness and Connection Lifecycle](Chapter_2.5_Statelessness_and_Connection_Lifecycle.md), [Chapter 2.13: HTTP Methods](Chapter_2.13_HTTP_Methods.md), [Chapter 2.14: Safety and Idempotency](Chapter_2.14_Safety_and_Idempotency.md), [Chapter 2.18: URLs, Paths, and Query Strings](Chapter_2.18_URLs_Paths_and_Query_Strings.md), and [Chapter 2.22: Redirects and the Location Header](Chapter_2.22_Redirects_and_Location.md). We have seen how HTTP provides methods, status codes, headers, statelessness, caching, and uniform resource identifiers. REST is not a new protocol layered on top—it is the disciplined use of HTTP's existing semantics. This chapter shows how REST emerges naturally when you stop fighting HTTP and start using it honestly.

REST is not a protocol.

REST is not a library.

REST is not a framework.

REST is a set of constraints that fall naturally out of HTTP when you take its rules seriously.

HTTP already gives you:
	•	Methods
	•	Status codes
	•	Headers
	•	Statelessness
	•	Caching
	•	Uniform resource identifiers

REST is simply using those tools honestly.

This chapter is about understanding REST as a design consequence, not a dogma.



## 1) REST Is Derived, Not Invented

REST (Representational State Transfer) was described by Roy Fielding while defining HTTP itself.

It is not layered on top of HTTP.

It is extracted from HTTP’s properties.

If you violate REST, you are usually fighting HTTP—not extending it.

Example: Your Pi uses POST for everything—GET /api/getReadings, POST /api/createReading, POST /api/deleteSensor. This fights HTTP. REST uses GET for retrieval, POST for creation, DELETE for removal. Your dashboard, ESP32, or coop controller: REST is derived from HTTP; if you violate REST, you are usually fighting HTTP—not extending it.



## 2) REST Starts with Resources

Everything in REST begins with the idea of a resource. Resources are the nouns of your API—the things you can identify, retrieve, create, update, or delete.

A resource is:
	•	A conceptual thing (it exists conceptually, even if stored in a database or computed on demand)
	•	Identified by a URL (the URL is the stable identifier)
	•	Stable over time (the same URL should identify the same conceptual thing, even if its representation changes)

Examples:
	•	A user (identified by /users/42)
	•	A sensor (identified by /sensors/alpha)
	•	A reading (identified by /readings/123)
	•	A collection of readings (identified by /readings)
	•	A configuration document (identified by /configs/coop)

A resource is not:
	•	A function (resources are things, not operations)
	•	A verb (actions belong in HTTP methods, not resource names)
	•	A procedure (resources are state, not behavior)

Example: Your Pi has resources: /api/sensors/alpha (a sensor), /api/readings/123 (a reading), /api/configs/coop (a configuration). These are things, not actions. Your dashboard or ESP32: a resource is a conceptual thing identified by a URL; a resource is not a function, verb, or procedure.



## 3) URLs Identify Resources, Not Actions

In REST, the URL identifies what, not what to do.

Good:
	•	/users
	•	/users/42
	•	/sensors/alpha
	•	/readings/123

Bad:
	•	/getUser
	•	/createReading
	•	/deleteSensor

Actions belong in methods, not URLs.

Example: Your Pi uses GET /api/sensors/alpha (good) not GET /api/getSensor?id=alpha (bad). Uses DELETE /api/sensors/alpha (good) not POST /api/deleteSensor (bad). Your dashboard or coop controller: URLs identify resources; actions belong in methods, not URLs.



## 4) The Resource Exists Independently of Representation

A resource is abstract—it exists conceptually, independent of how it is serialized or transmitted.

A representation is concrete—it is bytes in a specific format (JSON, HTML, XML, plain text) that travels over HTTP.

The same resource may be represented as:
	•	JSON (for APIs, dashboards)
	•	HTML (for browsers)
	•	XML (for legacy systems)
	•	Plain text (for simple clients like ESP32)

The resource is the thing (the sensor, the reading, the config). The representation is how it crosses the boundary (the JSON body, the HTML page, the plain text output). This separation allows the same resource to serve different clients with different needs—your dashboard gets JSON, your browser gets HTML, your ESP32 gets plain text, all from the same resource.

Example: Your Pi's sensor resource /api/sensors/alpha can be represented as JSON for your dashboard, HTML for a browser, or plain text for your ESP32. The resource is the thing; the representation is how it crosses the boundary. Your solar dashboard or poultry net config: same resource, different representations.



## 5) Representation Is What Travels Over HTTP

HTTP does not transmit resources.

HTTP transmits representations of resources.

The body of a response is not the resource—it is a snapshot of it in some format.

This distinction matters.

Example: Your dashboard GETs /api/sensors/alpha—receives a JSON representation. The sensor resource exists on your Pi; the JSON is a snapshot. Your ESP32 or coop controller: HTTP transmits representations of resources; this distinction matters.



## 6) Content Negotiation Enables Multiple Representations

Clients express preferences:
	•	Accept: application/json
	•	Accept: text/html

Servers choose:
	•	One representation
	•	And declare it with Content-Type

Same resource. Different view.

Example: Your dashboard sends Accept: application/json, gets JSON. Your browser sends Accept: text/html, gets HTML. Your ESP32 sends Accept: text/plain, gets plain text. Same sensor resource, different representations. Your solar dashboard or poultry net config: content negotiation enables multiple representations; same resource, different view.



## 7) REST Treats HTTP as an Application Protocol

HTTP is not just transport.

HTTP methods have meaning.

REST insists you respect that meaning.

Example: Your Pi uses GET for retrieval, POST for creation, PUT for replacement, DELETE for removal. Your dashboard, ESP32, or coop controller: REST treats HTTP as an application protocol; REST insists you respect that meaning.



## 8) Methods Carry Intent

REST aligns intent with method:
	•	GET: retrieve a representation
	•	POST: create a new resource or submit data
	•	PUT: replace a resource
	•	PATCH: partially update a resource
	•	DELETE: remove a resource

Using POST for everything discards information HTTP already provides.

Example: Your Pi uses POST /api/doSomething for everything—retrieval, creation, deletion. This discards HTTP's built-in semantics. Your dashboard or coop controller: methods carry intent; using POST for everything discards information HTTP already provides.



## 9) GET Is Read-Only by Contract

In REST:
	•	GET does not change state
	•	GET is safe
	•	GET is cacheable
	•	GET can be repeated freely

If a GET changes state, you have broken a core invariant.

Example: Your Pi has GET /api/readings/123 that also deletes the reading—this breaks REST. GET must be read-only. Your dashboard or ESP32: GET is read-only by contract; if a GET changes state, you have broken a core invariant.



## 10) POST Is Not “Do Anything”

POST is often abused as a universal hammer.

In REST:
	•	POST creates a subordinate resource
	•	Or submits data to a processing resource

POST is not idempotent.
POST must be designed carefully.

Example: Your dashboard POSTs to /api/readings to create a new reading—POST creates a subordinate resource. Your ESP32 POSTs sensor data—POST submits data to a processing resource. Your coop controller: POST is not "do anything"; POST must be designed carefully.



## 11) PUT Means Replace

PUT says:

“Store this representation at this URL.”

The client knows the URL.
The client supplies the full representation.
The server replaces what was there.

PUT is idempotent.

Example: Your dashboard PUTs a full config to /api/configs/coop—replaces the entire config. PUT again with the same data—same result. Your Pi or ESP32: PUT means replace; PUT is idempotent.



## 12) PATCH Means Partial Update

PATCH says:

“Apply these changes.”

PATCH does not replace the resource.
PATCH modifies parts.

PATCH is useful—but requires careful definition.

Example: Your dashboard PATCHes /api/configs/coop with {"temperature_threshold": 75}—modifies only that field. Your solar dashboard or poultry net config: PATCH means partial update; PATCH is useful—but requires careful definition.



## 13) DELETE Removes the Resource

DELETE removes the resource identified by the URL.

DELETE is idempotent:
	•	Deleting twice is the same as deleting once

DELETE may return:
	•	204 No Content
	•	200 OK with a representation
	•	404 if already gone

Example: Your dashboard DELETEs /api/sensors/alpha—your Pi returns 204 No Content. DELETEs again—returns 404 (already gone). Your coop controller or ESP32: DELETE removes the resource; DELETE may return 204, 200, or 404.



## 14) REST Uses Status Codes as First-Class Signals

REST relies heavily on HTTP status codes.

Status codes are not decoration.

They are the primary outcome channel.

Example: Your dashboard GETs /api/sensors/alpha—your Pi returns 200 OK with JSON, or 404 Not Found, or 500 Server Error. Your ESP32 or coop controller: REST uses status codes as first-class signals; they are the primary outcome channel.



## 15) Status Codes Encode Semantics

Examples:
	•	200: success, representation returned
	•	201: resource created
	•	204: success, no body
	•	400: client error
	•	404: resource does not exist
	•	409: conflict
	•	500: server failure

REST expects clients to read and act on these.

Example: Your dashboard receives 201 Created—knows a resource was created. Receives 409 Conflict—knows there was a conflict. Your ESP32 or coop controller: status codes encode semantics; REST expects clients to read and act on these.



## 16) REST Is Stateless by Constraint

Every request must contain everything the server needs to process it.

The server does not remember:
	•	Previous requests
	•	Client history
	•	Navigation state

State is:
	•	In the resource
	•	In the request
	•	Or in a token/cookie carried by the client

Example: Your dashboard sends a session cookie with every request—state is in the cookie, not in server memory. Your ESP32 sends an API token—state is in the token. Your coop controller: REST is stateless by constraint; state is in the resource, request, or token/cookie carried by the client.



## 17) Statelessness Enables Scalability

Stateless servers:
	•	Are easier to scale
	•	Can be load balanced
	•	Can crash and restart freely

REST favors this tradeoff intentionally.

Example: Your Pi can scale horizontally—add more Pi servers, load balance requests. If one crashes, others continue. Your dashboard or ESP32: statelessness enables scalability; REST favors this tradeoff intentionally.



## 18) Sessions Are an Application Layer Choice

REST does not forbid sessions.

REST requires that session state:
	•	Be explicit
	•	Be carried by the client
	•	Not be implicit server memory

Cookies and tokens satisfy this constraint.

Example: Your dashboard uses session cookies—session state is explicit, carried by the client. Your ESP32 uses API tokens—authentication state is explicit. Your coop controller: sessions are an application layer choice; cookies and tokens satisfy this constraint.



## 19) REST Encourages Cacheability

If a response is cacheable:
	•	Declare it
	•	Let intermediaries work

REST aligns naturally with:
	•	Cache-Control
	•	ETags
	•	Conditional requests

Caching is not an optimization—it’s a design goal.



## 20) Uniform Interface Is the Core Constraint

REST’s most important idea is the uniform interface.

This means:
	•	Same methods everywhere
	•	Same semantics everywhere
	•	Same status codes everywhere

Clients do not need endpoint-specific rules. Once a client understands HTTP methods and status codes, it can interact with any REST API. This is why REST scales socially—developers don't need to learn a new protocol for each API.

Example: Your dashboard knows GET /api/sensors/alpha, GET /api/readings/123, GET /api/configs/coop all work the same way—same methods, same semantics, same status codes. Your ESP32 or coop controller: uniform interface is the core constraint; clients do not need endpoint-specific rules.



## 21) Uniform Interface Reduces Coupling

When interfaces are uniform:
	•	Clients can evolve independently
	•	Servers can change internally
	•	Intermediaries can exist

This is why REST scales socially, not just technically.

Example: Your dashboard can evolve independently of your Pi—adds features without breaking. Your Pi can change internally—as long as the interface stays uniform. Your solar dashboard or poultry net config: uniform interface reduces coupling; this is why REST scales socially, not just technically.



## 22) Hypermedia Is Often Misunderstood

Strict REST includes HATEOAS:
	•	Hypermedia As The Engine Of Application State

This means:
	•	The server tells the client what it can do next
	•	Via links in representations (e.g. `{"sensor": {...}, "links": {"self": "/sensors/alpha", "readings": "/sensors/alpha/readings"}}`)
	•	The client discovers available actions dynamically, rather than hardcoding URLs

HATEOAS enables true loose coupling—clients follow links rather than constructing URLs. The server can evolve URLs without breaking clients, as long as link relations stay stable.


Most APIs ignore this.

That’s okay.



## 23) REST Is a Spectrum, Not a Switch

Very few systems are “pure REST”.

REST is guidance.

Using HTTP honestly gets you most of the value.

Dogma gets you very little.

Example: Your Pi API uses HTTP honestly—resources, methods, status codes. Not "pure REST" but RESTful enough. Your dashboard or coop controller: REST is a spectrum, not a switch; using HTTP honestly gets you most of the value. Dogma gets you very little.



## 24) REST Does Not Mean CRUD Only

REST is often reduced to CRUD.

This is a mistake.

REST supports:
	•	Workflows
	•	Transitions
	•	State machines

As long as they are modeled as resources.

Example: Your Pi models a job as a resource: POST /api/jobs creates it, GET /api/jobs/123 checks status. Your dashboard or ESP32: REST does not mean CRUD only; REST supports workflows, transitions, state machines—as long as they are modeled as resources.



## 25) Modeling Actions as Resources

If you need to “do something”:
	•	Model the result as a resource
	•	Or model the process as a resource

Example:
	•	POST /jobs
	•	GET /jobs/123

Not:
	•	POST /runJob

Example: Your Pi models a sensor calibration job: POST /api/jobs creates it, GET /api/jobs/456 checks progress. Not POST /api/runCalibration. Your coop controller or cow barn dashboard: modeling actions as resources; POST /jobs, not POST /runJob.



## 26) REST and Error Modeling

Errors are not exceptions.

Errors are representations.

A 400 response may include:
	•	A JSON body describing what failed
	•	Field-level validation messages

This is still RESTful.

Example: Your dashboard POSTs invalid data—your Pi returns 400 Bad Request with JSON body describing field errors. Your ESP32 or coop controller: REST and error modeling; errors are representations; this is still RESTful.



## 27) REST and Versioning

Versioning is a design choice.

Common strategies:
	•	Version in URL: /v1/readings
	•	Version in header
	•	Version in representation

REST does not mandate one—but consistency matters.

Example: Your Pi uses /api/v1/readings, /api/v2/readings for versioning. Or uses Accept: application/vnd.api.v1+json. Your dashboard or ESP32: REST and versioning; REST does not mandate one—but consistency matters.



## 28) REST and Evolution

REST systems evolve by:
	•	Adding fields
	•	Adding links
	•	Adding resources

Not by changing semantics of existing ones.

Backward compatibility is a design discipline.

Example: Your Pi adds fields to sensor representations—old clients still work. Adds new resources—does not break existing ones. Your solar dashboard or poultry net config: REST and evolution; backward compatibility is a design discipline.



## 29) REST Does Not Eliminate Complexity

REST does not make systems simple.

REST makes complexity explicit.

You still design:
	•	Resource models
	•	State transitions
	•	Authorization rules
	•	Validation

REST just gives you a stable vocabulary.

Example: Your Pi still designs resource models, state transitions, authorization rules, validation. REST does not eliminate complexity; REST makes complexity explicit. Your dashboard or ESP32: REST just gives you a stable vocabulary.



## 30) REST Is Boundary-First Design

REST assumes:
	•	Untrusted clients
	•	Unreliable networks
	•	Independent evolution

It aligns perfectly with Phase 0 boundary thinking.

Example: Your Pi assumes untrusted clients, unreliable networks, independent evolution. Your dashboard, ESP32, or coop controller: REST is boundary-first design; it aligns perfectly with Phase 0 boundary thinking.



## 31) REST Is About Honesty

REST fails when:
	•	URLs lie
	•	Methods lie
	•	Status codes lie

REST works when names match behavior.

This echoes Phase 0 abstraction rules.

Example: Your Pi uses URLs that match behavior—GET /api/sensors/alpha retrieves, DELETE /api/sensors/alpha removes. Names match behavior. Your dashboard or coop controller: REST is about honesty; this echoes Phase 0 abstraction rules.



## 32) REST Is Not Required

You can build non-REST APIs.

RPC exists.
GraphQL exists.
WebSockets exist.

REST is a choice—not a moral obligation.

Example: Your Pi could use RPC-style endpoints, GraphQL, or WebSockets. REST is one choice. Your dashboard or ESP32: REST is not required; REST is a choice—not a moral obligation.



## 33) Why REST Still Matters

REST matters because:
	•	HTTP infrastructure already exists
	•	Tooling understands it
	•	Debugging is straightforward
	•	Failures are visible

REST leverages decades of operational reality.

Example: Your Pi uses HTTP—infrastructure exists, tooling understands it, debugging is straightforward. Your dashboard or coop controller: why REST still matters; REST leverages decades of operational reality.



## 34) REST Fits the Mental Model You’ve Built

By now, you have seen:
	•	Boundaries
	•	State
	•	Invariants
	•	Failure modes
	•	Explicit signaling

REST is simply HTTP plus discipline.

Example: Your Pi uses HTTP methods honestly, status codes correctly, resources identified by URLs. Your dashboard, ESP32, or coop controller: REST fits the mental model you've built; REST is simply HTTP plus discipline.



## Reflection

You are designing an API for your homestead sensor system. Your ESP32 sensors POST readings, your dashboard displays them, your coop controller manages configs.

Walk through the REST design:
	•	What are the resources? Sensors (/api/sensors/alpha), readings (/api/readings/123), configs (/api/configs/coop), collections (/api/readings). These are things, not actions.
	•	What URLs identify them? Use nouns: /api/sensors/alpha, not /api/getSensor. URLs identify what, not what to do.
	•	What representations do clients need? JSON for your dashboard, plain text for your ESP32, HTML for a browser. Same resource, different representations via content negotiation.
	•	What methods express intent? GET to retrieve, POST to create, PUT to replace, PATCH to update, DELETE to remove. Actions belong in methods, not URLs.
	•	What status codes express outcomes? 200 for success, 201 for created, 404 for not found, 400 for client errors, 500 for server errors. Status codes are first-class signals.

If you can answer those, you are already doing REST. Then ask: is it stateless? (State in resources, requests, or tokens—not server memory.) Is the interface uniform? (Same methods and status codes everywhere.) Are names honest? (URLs and methods match behavior.)



## Core Understanding

REST is not a protocol.
REST is not magic.

REST is the disciplined use of HTTP’s existing semantics:
	•	Resources identified by URLs
	•	Representations exchanged over HTTP
	•	Methods that express intent
	•	Status codes that signal outcomes
	•	Stateless requests
	•	Explicit boundaries

REST emerges naturally when you stop fighting HTTP and start using it honestly.

Anchor: REST is not a protocol—it is the disciplined use of HTTP's existing semantics. Resources identified by URLs, representations exchanged over HTTP, methods that express intent, status codes that signal outcomes. When names match behavior and methods match intent, you are doing REST.



## What's Next

Chapter 2.24 — Seeing HTTP in the Wild

Where we stop theorizing and start observing:
	•	Real requests
	•	Real responses
	•	Browser DevTools
	•	curl
	•	Debugging live systems

Because understanding is complete only when you can see it happening.