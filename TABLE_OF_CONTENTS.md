# Learning Plan: Comprehensive Programming & Systems Curriculum

This learning plan is designed to build deep, transferable understanding across a wide range of technologies, culminating in a resilient off-grid homestead automation system. Each phase is self-contained yet builds explicitly on previous chapters, following a concept-first approach grounded in real-world systems.

---

## Learning Path Map

### Recommended Sequence

```
Section A: Foundations
    ├─→ Phase 1: Conceptual Foundations
    ├─→ Phase 2: Python Fundamentals
    └─→ Phase 3: Git and Version Control
    ↓
    ├─→ Section B: Web Development & Networking
    │   ├─→ Phase 1: HTTP Protocol Fundamentals
    │   ├─→ Phase 2: HTML Fundamentals
    │   ├─→ Phase 3: JavaScript Fundamentals
    │   ├─→ Phase 4: Node.js, npm, and JSON
    │   ├─→ Phase 5: Express.js Web Applications
    │   ├─→ Phase 6: Testing Fundamentals
    │   ├─→ Phase 7: CSS Fundamentals
    │   ├─→ Phase 8: DOM and Browser JavaScript
    │   ├─→ Phase 9: Web Components & Frontend (Shoelace)
    │   └─→ Phase 10: TypeScript Fundamentals
    │
    ├─→ Section C: Databases & Data Storage
    │   ├─→ Phase 1: SQL Foundations
    │   ├─→ Phase 2: SQLite Database Systems
    │   ├─→ Phase 3: MySQL Relational Databases
    │   └─→ Phase 4: better-sqlite3 & Node.js Integration
    │
    ├─→ Section D: Systems & Infrastructure
    │   ├─→ Phase 1: Linux Kernel & System Fundamentals
    │   ├─→ Phase 2: Docker Containerization
    │   ├─→ Phase 3: Docker Networking & Multi-Platform Builds
    │   └─→ Phase 4: Cloud Infrastructure & Deployment (Linode)
    │
    └─→ Section E: IoT & Embedded Systems
        ├─→ Phase 1: ESP32 Hardware & Development
        ├─→ Phase 2: MicroPython for Embedded Systems
        ├─→ Phase 3: MQTT Messaging Protocol
        ├─→ Phase 4: ESPHome Configuration & Automation
        ├─→ Phase 5: Home Assistant Integration
        └─→ Phase 6: Capstone: Resilient Homestead Automation System
```

**Note:** While phases build on each other, you can explore sections in parallel once Section A is complete. The capstone phase integrates concepts from all sections.

---

## Section A: Foundations

### Phase 1: Conceptual Foundations
**Directory:** `Section_A/Phase_1/`

Language-agnostic mental models of how programs and real systems behave over time. Focuses on inputs, state, instructions, conditions, repetition, failure, time, and complexity—so later phases feel like translation, not new theory.

**Chapters (core 1.1–1.8; 1.9–1.15 extend):**
- **Chapter 1.1:** What Programs Actually Are (`Chapter_1.01_What_Programs_Are.md`)
  - Programs as systems that transform inputs and state into outputs and new state.
- **Chapter 1.2:** Conditions and Branching (`Chapter_1.02_Conditions_and_Branching.md`)
  - True/false tests, branching paths, and how state determines execution flow.
- **Chapter 1.3:** Loops and Repetition (`Chapter_1.03_Loops_and_Repetition.md`)
  - Re-execution over time, termination, drift, and why automation lives in loops.
- **Chapter 1.4:** Functions and Behavior (`Chapter_1.04_Functions_and_Behavior.md`)
  - Naming behavior, isolating responsibilities, and structuring actions humans can reason about.
- **Chapter 1.5:** Data and Variables (`Chapter_1.05_Data_and_Variables.md`)
  - State, naming, meaning, and how programs remember and manipulate information.
- **Chapter 1.6:** Errors and Failure (`Chapter_1.06_Errors_and_Failure.md`)
  - Assumptions breaking, failure modes, how all bugs map to the model, and designing systems that fail safely.
- **Chapter 1.7:** Time and State Changes (`Chapter_1.07_Time_and_State_Changes.md`)
  - Time as an implicit input: delays, cooldowns, staleness, and temporal logic.
- **Chapter 1.8:** Boundaries (`Chapter_1.08_Boundaries.md`)
  - Where systems touch the outside world, why validation lives at the edges, and the phase anchor (program as sequence of instructions transforming data and state over time).
- **Chapter 1.9:** Invariants (`Chapter_1.09_Invariants.md`)
  - Rules that must always hold true to keep systems stable over time.
- **Chapter 1.10:** Failure Is Normal (`Chapter_1.10_Failure_Is_Normal.md`)
  - Designing for missing data, partial truth, and degraded operation.
- **Chapter 1.11:** Abstraction and Naming (`Chapter_1.11_Abstraction_and_Naming.md`)
  - Compressing reality into names without hiding meaning or truth.
- **Chapter 1.12:** Observation vs Action (`Chapter_1.12_Observation_vs_Action.md`)
  - Separating reading state from changing state to avoid feedback loops.
- **Chapter 1.13:** Complexity Grows Sideways (`Chapter_1.13_Complexity_Grows_Sideways.md`)
  - Why small systems become hard quickly and how branching multiplies paths.
- **Chapter 1.14:** Putting the System Together (`Chapter_1.14_Putting_the_System_Together.md`)
  - How all Phase 1 concepts interlock into one coherent execution model.
- **Chapter 1.15:** Section A Phase 1 Consolidation (`Chapter_1.15_Consolidation.md`)
  - Unified mental model and readiness check before moving into Python.

---

### Phase 2: Python Fundamentals Expressed in Code
**Directory:** `Section_A/Phase_2/` *(In Progress)*

Python as the anchor language for expressing fundamental programming concepts. Each chapter maps Section A Phase 1 (Conceptual Foundations) mental models to Python syntax, building from basic execution to complete living systems.

**Chapters:**
- **Chapter 2.1:** What a Python Program Is (`Chapter_2.1_What_a_Python_Program_Is.md`)
  - Python as interpreter, execution order, runtime world, scripts vs systems. Bridge to Phase 1 Chapter 1.1.
- **Chapter 2.2:** State and Variables (`Chapter_2.2_State_and_Variables.md`)
  - Names as state holders, reassignment, state change over time, meaning-driven naming. Bridge to Phase 1 Chapter 1.5.
- **Chapter 2.3:** Conditions and Branching (`Chapter_2.3_Conditions_and_Branching.md`)
  - if/elif/else, boolean logic, comparison and logical operators, branching paths. Bridge to Phase 1 Chapter 1.2.
- **Chapter 2.4:** Loops and Repetition (`Chapter_2.4_Loops_and_Repetition.md`)
  - while vs for, loop lifecycles, termination conditions, time.sleep() for living systems. Bridge to Phase 1 Chapters 1.3 and 1.7.
- **Chapter 2.5:** Functions as Named Behavior (`Chapter_2.5_Functions_as_Named_Behavior.md`)
  - def vs call, parameters, return values, isolation, contracts. Bridge to Phase 1 Chapters 1.4 and 1.11.
- **Chapter 2.6:** Scope and Isolation (`Chapter_2.6_Scope_and_Isolation.md`)
  - Local vs global scope, lifetime of variables, controlled access to state. Bridge to Phase 1 Chapter 1.11.
- **Chapter 2.7:** Data Types as Categories of Meaning (`Chapter_2.7_Data_Types_as_Categories_of_Meaning.md`)
  - int, float, bool, str, None, type() function, category errors, modeling reality. Bridge to Phase 1 Chapter 1.5.
- **Chapter 2.8:** Truthiness and Explicit Checks (`Chapter_2.8_Truthiness_and_Explicit_Checks.md`)
  - Truthy vs falsy values, None handling, safe condition design, zero vs absence. Bridge to Phase 1 Chapters 1.8 and 1.10.
- **Chapter 2.9:** Collections and Grouped State (`Chapter_2.9_Collections_and_Grouped_State.md`)
  - lists, tuples, sets, indexing, slicing, iteration, mutability, managing many things safely. Bridge to Phase 1 Chapter 1.13.
- **Chapter 2.10:** Dictionaries and Named Systems (`Chapter_2.10_Dictionaries_and_Named_Systems.md`)
  - Key/value state, .get() vs [] for missing keys, iteration patterns, nested systems, configuration models. Bridge to Phase 1 Chapter 1.10.
- **Chapter 2.11:** Input, Output, and Program Boundaries (`Chapter_2.11_Input_Output_and_Boundaries.md`)
  - print vs input, file I/O, type conversion at boundaries, observation vs mutation, edge-only I/O. Bridge to Phase 1 Chapter 1.8.
- **Chapter 2.12:** Errors, Exceptions, and Reality Failing (`Chapter_2.12_Errors_and_Exceptions.md`)
  - Syntax vs runtime errors, tracebacks, try/except/else/finally, exception types, raise, failure as signal. Bridge to Phase 1 Chapters 1.6 and 1.10.
- **Chapter 2.13:** Persistence and Remembering State (`Chapter_2.13_Persistence_and_State.md`)
  - Files, JSON snapshots, file paths, restoring state after restart. Bridge to Phase 1 Chapter 1.7.
- **Chapter 2.14:** Modules and Program Structure (`Chapter_2.14_Modules_and_Program_Structure.md`)
  - Imports, multi-file systems, standard library, separation of concerns, execution control. Bridge to Phase 1 Chapter 1.11.
- **Chapter 2.15:** Assembling a Living Python System (`Chapter_2.15_Assembling_a_Living_System.md`)
  - Main loops, data flow, observation vs action, Section A Phase 1 model expressed in code. Bridge to Phase 1 Chapters 1.14 and 1.15.

**Key Concepts:** Python syntax, data types, function design, scope, module organization, input validation, persistence, living systems

**Prerequisites:** Section A Phase 1

**Artifacts:** System State Monitor, Sensor Snapshot Logger, Complete Battery Monitor System

---

### Phase 3: Git and Version Control
**Directory:** `Section_A/Phase_3/`

Deep understanding of version control as a boundary discipline: tracking change over time, collaboration without chaos, and recoverability. Git as the industry standard for source control. Essential before scaling to multi-file web projects and team workflows.

**Chapters:**
- **Chapter 3.1:** What Version Control Is (`Chapter_3.1_What_Version_Control_Is.md`)
  - Why track history; snapshots vs diffs; local vs distributed; recoverability and audit trails. Bridge to Phase 1 Chapter 1.7 (Time and State Changes).
- **Chapter 3.2:** Repositories and the Working Tree (`Chapter_3.2_Repositories_and_Working_Tree.md`)
  - Repository as history store; working directory; .git; staged vs unstaged; mental model of three areas.
- **Chapter 3.3:** Commits as Snapshots (`Chapter_3.3_Commits_as_Snapshots.md`)
  - git add, git commit; commit messages as documentation; hashes and immutability; viewing history.
- **Chapter 3.4:** Branches and Parallel Lines of Work (`Chapter_3.4_Branches.md`)
  - What a branch is; creating and switching branches; when to branch; main vs feature branches.
- **Chapter 3.5:** Merging and Combining Work (`Chapter_3.5_Merging.md`)
  - Merging branches; fast-forward vs merge commits; resolving conflicts; when merge is appropriate.
- **Chapter 3.6:** Remotes and Collaboration (`Chapter_3.6_Remotes_and_Collaboration.md`)
  - origin; push and pull; fetch; upstream tracking; collaboration without overwriting.
- **Chapter 3.7:** Rebasing and History Rewriting (`Chapter_3.7_Rebasing.md`)
  - Rebase as alternative to merge; interactive rebase; when and when not to rebase; rewriting shared history.
- **Chapter 3.8:** Stashing and Temporary State (`Chapter_3.8_Stashing.md`)
  - git stash; when to stash; applying and popping; managing work-in-progress.
- **Chapter 3.9:** Ignoring Files and .gitignore (`Chapter_3.9_Gitignore.md`)
  - What not to commit; .gitignore patterns; secrets, build output, environment files; homestead project examples.
- **Chapter 3.10:** Undoing and Recovering (`Chapter_3.10_Undoing_and_Recovering.md`)
  - reset (soft, mixed, hard); revert; recovering “lost” commits; safety and discipline.
- **Chapter 3.11:** Tags and Releases (`Chapter_3.11_Tags_and_Releases.md`)
  - Lightweight vs annotated tags; semantic versioning; marking releases for deployment.
- **Chapter 3.12:** Git in Your Workflow (`Chapter_3.12_Git_in_Workflow.md`)
  - Feature-branch workflow; code review; deployment from branches; integration with Phase 3 and beyond.
- **Chapter 3.13:** Git vs GitHub — Understanding the Platform (`Chapter_3.13_Git_vs_GitHub.md`)
  - Git vs GitHub distinction; what GitHub adds to Git; alternatives; when to use what.
- **Chapter 3.14:** GitHub Workflows — Pull Requests, Issues, and Collaboration (`Chapter_3.14_GitHub_Workflows.md`)
  - Pull Requests; Issues; GitHub Actions basics; collaboration workflows; best practices.

**Key Concepts:** Repositories, commits, branches, merge, remote, push/pull, .gitignore, history and recoverability

**Prerequisites:** Section A Phase 1, Section A Phase 2

**Depth:** Deep understanding — version control as structural discipline

**Projects:** Versioned Python project, feature branch and merge, remote backup (e.g. GitHub/Gitea)

---

## Section B: Web Development & Networking

### Phase 1: HTTP Protocol Fundamentals
**Directory:** `Section_B/Phase_1/`

Understanding how web communication works at the protocol level. Requests, responses, headers, methods, status codes, and the client-server model. Essential foundation for all web technologies.

**Chapters:**
- **Chapter 1.1:** Client-Server and the Request-Response Model (`Chapter_1.1_Client_Server_and_Request_Response.md`)
  - Client, server, and the request-response cycle. Requests initiate, responses terminate; servers cannot speak without a prior request. Bridge to WebSockets, long polling, SSE.
- **Chapter 1.2:** Where HTTP Lives (`Chapter_1.2_Where_HTTP_Lives.md`)
  - HTTP rides on TCP, not raw packets. What the transport guarantees, what it does not, and what happens when connections fail. Phase 0.7 for networking.
- **Chapter 1.3:** What HTTP Is (`Chapter_1.3_What_HTTP_Is.md`)
  - HTTP as a text protocol, request-response structure, statelessness, and how it runs over connections.
- **Chapter 1.4:** HTTP as Text (`Chapter_1.4_HTTP_as_Text.md`)
  - Line-based format, CRLF, and how requests and responses are structured as text.
- **Chapter 1.5:** Statelessness and Connection Lifecycle (`Chapter_1.5_Statelessness_and_Connection_Lifecycle.md`)
  - Statelessness, connection reuse, keep-alive, and request independence.
- **Chapter 1.6:** Request Structure (`Chapter_1.6_Request_Structure.md`)
  - Method, path, version, headers, and body. How a request is built and sent.
- **Chapter 1.7:** The Request Line (`Chapter_1.7_The_Request_Line.md`)
  - Method, path, and HTTP version. How the first line carries core information.
- **Chapter 1.8:** Response Structure (`Chapter_1.8_Response_Structure.md`)
  - Status line, headers, and body. How a response is structured and delivered.
- **Chapter 1.9:** Status Codes Overview (`Chapter_1.9_Status_Codes_Overview.md`)
  - 2xx, 3xx, 4xx, 5xx. What each range means and how servers and clients use them.
- **Chapter 1.10:** Status Codes: Success and Redirects (`Chapter_1.10_Status_Codes_Success_and_Redirects.md`)
  - 200, 201, 204, 301, 302, 304. When and why to use each.
- **Chapter 1.11:** Status Codes: Client and Server Errors (`Chapter_1.11_Status_Codes_Client_and_Server_Errors.md`)
  - 400, 401, 403, 404, 500, 502, 503. How errors are signaled and interpreted.
- **Chapter 1.12:** Errors vs Failures (`Chapter_1.12_Errors_vs_Failures.md`)
  - HTTP error responses vs network failures, timeouts, partial responses. "Server responded with an error" vs "request never completed." Bridge to Section A Phase 1 Chapters 1.6 and 1.10.
- **Chapter 1.13:** HTTP Methods (`Chapter_1.13_HTTP_Methods.md`)
  - GET, POST, PUT, PATCH, DELETE. Semantics and when to use each.
- **Chapter 1.14:** Safety and Idempotency (`Chapter_1.14_Safety_and_Idempotency.md`)
  - Safe vs unsafe methods, idempotent vs non-idempotent. Why retries matter and why POST is special. Section A Phase 1-style invariants applied to HTTP.
- **Chapter 1.15:** Headers: Overview and Purpose (`Chapter_1.15_Headers_Overview.md`)
  - Role of headers, request vs response headers, and common patterns.
- **Chapter 1.16:** Headers: Content and Type (`Chapter_1.16_Headers_Content_and_Type.md`)
  - Content-Type, Content-Length, Accept. Encoding and negotiation.
- **Chapter 1.17:** Headers: Caching and Control (`Chapter_1.17_Headers_Caching_and_Control.md`)
  - Cache-Control, ETag, If-None-Match. How caching is communicated.
- **Chapter 1.18:** URLs, Paths, and Query Strings (`Chapter_1.18_URLs_Paths_and_Query_Strings.md`)
  - URL structure, path segments, query parameters, and encoding.
- **Chapter 1.19:** Request Bodies and Content Types (`Chapter_1.19_Request_Bodies_and_Content_Types.md`)
  - When bodies are used, JSON vs form data, and Content-Type in practice.
- **Chapter 1.20:** Cookies and Session State (`Chapter_1.20_Cookies_and_Session_State.md`)
  - Set-Cookie, Cookie, statelessness, and how sessions are implemented.
- **Chapter 1.21:** Trust Boundaries and Security Surfaces (`Chapter_1.21_Trust_Boundaries_and_Security_Surfaces.md`)
  - Headers as input, cookies as ambient authority, why servers don't trust clients. No crypto or TLS—just boundaries and risk.
- **Chapter 1.22:** Redirects and the Location Header (`Chapter_1.22_Redirects_and_Location.md`)
  - 3xx redirects, Location header, and when and how redirects are used.
- **Chapter 1.23:** REST Principles (`Chapter_1.23_REST_Principles.md`)
  - Resources, representations, HTTP as application protocol, RESTful design. Descriptive and mechanical, not dogmatic.
- **Chapter 1.24:** Seeing HTTP in the Wild (`Chapter_1.24_Seeing_HTTP_in_the_Wild.md`)
  - Observation, inspection, reality vs diagrams. curl, browser DevTools, and debugging.

**Key Concepts:** HTTP methods, request/response cycle, headers, status codes, stateless protocols, safety and idempotency, errors vs failures, trust boundaries, REST principles

**Prerequisites:** Section A Phase 1, Section A Phase 2

**Depth:** Working knowledge with deep understanding of protocol mechanics

---

### Phase 2: HTML Fundamentals
**Directory:** `Section_B/Phase_2/`

Deep understanding of HyperText Markup Language — the structure of every web page. Elements, attributes, document structure, semantics, accessibility, and how HTML is delivered and rendered. Essential before CSS (which styles HTML) and before server-rendered or client-rendered content. Bridge between HTTP (which transports HTML) and the actual document.

**Chapters:**
- **Chapter 2.1:** What HTML Is (`Chapter_2.1_What_HTML_Is.md`)
  - Markup vs content; tags and elements; HTML as a tree; separation of structure and presentation. Bridge to Section B Phase 1 (HTTP delivers HTML).
- **Chapter 2.2:** Document Structure and the DOCTYPE (`Chapter_2.2_Document_Structure.md`)
  - DOCTYPE; html, head, body; character encoding (meta charset); title; viewport and meta tags.
- **Chapter 2.3:** Text and Headings (`Chapter_2.3_Text_and_Headings.md`)
  - Headings (h1–h6); paragraphs; line breaks; horizontal rules; semantic hierarchy and accessibility.
- **Chapter 2.4:** Links and Anchors (`Chapter_2.4_Links_and_Anchors.md`)
  - a href; absolute vs relative URLs; target and rel; fragment identifiers; links as boundaries (Section A Phase 1 Chapter 1.8).
- **Chapter 2.5:** Lists (`Chapter_2.5_Lists.md`)
  - ul, ol, li; dl, dt, dd; when to use each; nesting lists.
- **Chapter 2.6:** Images and Media (`Chapter_2.6_Images_and_Media.md`)
  - img (src, alt, width, height); picture and source; figure and figcaption; accessibility and performance.
- **Chapter 2.7:** Tables (`Chapter_2.7_Tables.md`)
  - table, thead, tbody, th, td; scope and headers; when tables are appropriate (tabular data); accessibility.
- **Chapter 2.8:** Forms — Structure and Input Types (`Chapter_2.8_Forms_Structure.md`)
  - form, action, method; input types (text, number, email, password, checkbox, radio); label and id; name and submission.
- **Chapter 2.9:** Forms — Select, Textarea, and Buttons (`Chapter_2.9_Forms_Select_Textarea_Buttons.md`)
  - select and option; textarea; button vs input type="submit"; fieldset and legend; validation attributes.
- **Chapter 2.10:** Semantic HTML and Landmarks (`Chapter_2.10_Semantic_HTML.md`)
  - header, main, footer, nav, aside, section, article; ARIA landmarks; document outline and screen readers.
- **Chapter 2.11:** Div and Span — Generic Containers (`Chapter_2.11_Div_and_Span.md`)
  - When to use div vs semantic elements; span for inline grouping; class and id; structure without semantics.
- **Chapter 2.12:** Attributes — class, id, data-*, ARIA (`Chapter_2.12_Attributes.md`)
  - class and id; data-* for custom data; aria-* for accessibility; boolean attributes.
- **Chapter 2.13:** Character Entities and Encoding (`Chapter_2.13_Character_Entities.md`)
  - &amp;, &lt;, &gt;, &quot;; numeric entities; UTF-8 and meta charset.
- **Chapter 2.14:** HTML and HTTP (`Chapter_2.14_HTML_and_HTTP.md`)
  - How HTML is requested (GET); Content-Type: text/html; caching and validation; bridge to Section B Phase 1 and Express serving HTML.
- **Chapter 2.15:** Validation and Best Practices (`Chapter_2.15_Validation_and_Best_Practices.md`)
  - Validators (W3C); common errors; nesting rules; closing tags; accessibility checklist.

**Key Concepts:** Elements, attributes, document structure, semantics, forms, accessibility, validation

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 1 (recommended)

**Depth:** Deep understanding — HTML as the structural contract of the web

**Projects:** Semantic dashboard skeleton, accessible form for sensor config, valid HTML pages for homestead UI

---

### Phase 3: JavaScript Fundamentals
**Directory:** `Section_B/Phase_3/`

JavaScript as the language of the web: in the browser and on the server (Node). Variables, types, functions, control flow, objects, arrays, async, and modules. Same mental models as Section A Phase 1 and Section A Phase 2 (Python), expressed in JavaScript. Essential before Node.js and Express and before DOM scripting.

**Chapters:**
- **Chapter 3.1:** What JavaScript Is (`Chapter_3.1_What_JavaScript_Is.md`)
  - Where JS runs (browser, Node); engines; syntax and execution; scripts vs modules. Bridge to Section A Phase 1 Chapter 1.1 and Section A Phase 2 Chapter 2.1.
- **Chapter 3.2:** Variables and Declarations (`Chapter_3.2_Variables.md`)
  - let, const, var; scope and temporal dead zone; naming; reassignment vs immutability. Bridge to Phase 0.5.
- **Chapter 3.3:** Types and Values (`Chapter_3.3_Types_and_Values.md`)
  - Primitives: number, string, boolean, undefined, null, symbol, bigint; typeof; type coercion pitfalls. Bridge to Phase 0.5 and 1.7.
- **Chapter 3.4:** Operators and Expressions (`Chapter_3.4_Operators.md`)
  - Arithmetic, comparison, logical; strict equality (===); short-circuit evaluation; optional chaining and nullish coalescing.
- **Chapter 3.5:** Conditions and Branching (`Chapter_3.5_Conditions.md`)
  - if, else if, else; switch; truthiness and falsiness; explicit checks. Bridge to Phase 0.2.
- **Chapter 3.6:** Loops and Iteration (`Chapter_3.6_Loops.md`)
  - for, while, do...while; for...of, for...in; break and continue; avoiding infinite loops. Bridge to Phase 0.3.
- **Chapter 3.7:** Functions (`Chapter_3.7_Functions.md`)
  - Function declarations vs expressions; parameters and return; arrow functions; functions as values. Bridge to Phase 0.4.
- **Chapter 3.8:** Scope and Closures (`Chapter_3.8_Scope_and_Closures.md`)
  - Lexical scope; block scope; closure; IIFEs when needed. Bridge to Phase 0.11.
- **Chapter 3.9:** Objects (`Chapter_3.9_Objects.md`)
  - Literals; properties and methods; dot vs bracket notation; spread; destructuring. Bridge to Phase 1.10 (dictionaries).
- **Chapter 3.10:** Arrays (`Chapter_3.10_Arrays.md`)
  - Creating and indexing; push, pop, shift, unshift; map, filter, reduce; iteration. Bridge to Phase 1.9 (lists).
- **Chapter 3.11:** Strings and Template Literals (`Chapter_3.11_Strings.md`)
  - String methods; template literals and interpolation; multiline strings.
- **Chapter 3.12:** Error Handling (`Chapter_3.12_Error_Handling.md`)
  - try, catch, finally; throw; Error types; async errors. Bridge to Phase 0.6 and 0.10.
- **Chapter 3.13:** Asynchronous JavaScript — Callbacks and Promises (`Chapter_3.13_Async_Callbacks_Promises.md`)
  - Event loop; callbacks; Promises (then, catch); chaining; Promise.all and Promise.race.
- **Chapter 3.14:** Asynchronous JavaScript — async/await (`Chapter_3.14_Async_Await.md`)
  - async functions; await; error handling with try/catch; sequential vs parallel patterns.
- **Chapter 3.15:** Modules — CommonJS and ES Modules (`Chapter_3.15_Modules.md`)
  - require and module.exports; import and export; default vs named; Node and browser. Bridge to Phase 1.14.
- **Chapter 3.16:** JSON in JavaScript (`Chapter_3.16_JSON_in_JavaScript.md`)
  - JSON.stringify and JSON.parse; when JSON is used; limits and safety. Bridge to Phase 2.19 and Phase 2.7.

**Key Concepts:** Variables, types, functions, objects, arrays, async/await, modules, JSON

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 1 (recommended)

**Depth:** Deep understanding — JavaScript as the language of Express and the browser

**Projects:** CLI scripts in Node, data transformation, simple async workflows

---

### Phase 4: Node.js, npm, and JSON
**Directory:** `Section_B/Phase_4/`

Node.js as the runtime for server-side JavaScript. The event loop, built-in modules, file system and process APIs, and how Node differs from browser JS. npm for package management. JSON as the universal data format for APIs and config. Direct preparation for Express (Phase 3).

**Chapters:**
- **Chapter 4.1:** What Node.js Is (`Chapter_4.1_What_Node_Is.md`)
  - V8 and libuv; Node as runtime; no DOM; process and global; why Node for servers. Bridge to Phase 2 (HTTP server will run in Node).
- **Chapter 4.2:** Running Node and the REPL (`Chapter_4.2_Running_Node.md`)
  - node script.js; REPL; exit codes; environment (NODE_ENV).
- **Chapter 4.3:** Built-in Modules — path and fs (`Chapter_4.3_Path_and_Fs.md`)
  - path.join, path.resolve; fs.readFile, fs.writeFile (sync vs async); fs.promises; file paths and portability.
- **Chapter 4.4:** Built-in Modules — http and Streams (`Chapter_4.4_Http_and_Streams.md`)
  - http.createServer; request and response objects; streams concept; bridge to “Express wraps this” (Phase 3.1).
- **Chapter 4.5:** process and Buffer (`Chapter_4.5_Process_and_Buffer.md`)
  - process.env, process.argv, process.cwd; Buffer for binary data; encoding.
- **Chapter 4.6:** Event Loop and Non-Blocking I/O (`Chapter_4.6_Event_Loop.md`)
  - Single thread; phases of the event loop; setImmediate, process.nextTick; why blocking is fatal. Bridge to Phase 3.17.
- **Chapter 4.7:** npm — Package Management (`Chapter_4.7_npm.md`)
  - npm init; package.json (name, version, scripts, dependencies); npm install and package-lock.json; semantic versioning.
- **Chapter 4.8:** npm — Installing and Using Packages (`Chapter_4.8_npm_Installing.md`)
  - npm install <pkg>; require('package'); node_modules; global vs local; scripts (start, test, dev).
- **Chapter 4.9:** JSON — Syntax and Structure (`Chapter_4.9_JSON_Syntax.md`)
  - Objects, arrays, strings, numbers, booleans, null; no functions or undefined; quotes and commas; validity.
- **Chapter 4.10:** JSON — Parsing and Serialization (`Chapter_4.10_JSON_Parse_Stringify.md`)
  - JSON.parse (and reviver); JSON.stringify (and replacer, space); error handling; use in APIs and config files.
- **Chapter 4.11:** Environment and Configuration in Node (`Chapter_4.11_Environment_Config.md`)
  - process.env; .env files and dotenv; config objects; secrets and 12-factor. Bridge to Phase 3.16.
- **Chapter 4.12:** Node and HTTP — Raw Server (`Chapter_4.12_Node_Raw_HTTP.md`)
  - Minimal http.createServer example; request URL and method; writing response; bridge to “Express organizes this” (Phase 3).

**Key Concepts:** Node runtime, event loop, path/fs/http, process, npm, package.json, JSON parse/stringify, config

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 1, Section B Phase 3 (JavaScript)

**Depth:** Deep understanding — Node and npm as the foundation for Express

**Projects:** Small Node scripts (file ops, HTTP server), package with dependencies, JSON config loader

---

### Phase 5: Express.js Web Applications
**Directory:** `Section_B/Phase_5/`

Build real HTTP servers using Node.js and Express. Apply HTTP fundamentals to routing, middleware, request handling, response construction, state management, and API design. Move from protocol literacy to server authorship.

**Chapters:**
- **Chapter 3.1:** What Express Is (`Chapter_3.1_What_Express_Is.md`)
  - What Express sits on top of (Node's HTTP module), what it abstracts, and what it does not. Express as a thin layer over raw HTTP. Bridge to Phase 2 HTTP fundamentals.
- **Chapter 3.2:** The Minimal Express Server (`Chapter_3.2_Minimal_Server.md`)
  - Creating a server, listening on a port, responding to a request. From app.listen() to first response. Your Pi becomes an HTTP server.
- **Chapter 3.3:** The Request and Response Objects (`Chapter_3.3_Request_and_Response_Objects.md`)
  - Understanding req and res. Mapping them to raw HTTP: method, headers, body, status, and response construction. Bridge to Phase 2 request/response structure.
- **Chapter 3.4:** Routing Fundamentals (`Chapter_3.4_Routing_Fundamentals.md`)
  - How Express matches method + path. Route handlers. Order matters. Specificity and control flow. Building API endpoints for your homestead sensors.
- **Chapter 3.5:** Route Parameters and Query Strings (`Chapter_3.5_Params_and_Query.md`)
  - Dynamic paths (/sensors/:id) and query parsing. How Express exposes URL data. Bridge to Phase 2.18 (URLs, Paths, and Query Strings).
- **Chapter 3.6:** Sending Responses Correctly (`Chapter_3.6_Sending_Responses.md`)
  - res.send(), res.json(), res.status(), res.redirect(). Building proper HTTP responses intentionally. Bridge to Phase 2 status codes and response structure.
- **Chapter 3.7:** Middleware: The Execution Pipeline (`Chapter_3.7_Middleware.md`)
  - What middleware is. The request lifecycle. next(). Execution order. Middleware as layered boundaries. Bridge to Phase 0.8 (Boundaries).
- **Chapter 3.8:** Body Parsing and Content Types (`Chapter_3.8_Body_Parsing.md`)
  - express.json(), express.urlencoded(). How request bodies are parsed. Content-Type validation. Bridge to Phase 2.16 and 2.19 (Content-Type, Request Bodies).
- **Chapter 3.9:** Error Handling in Express (`Chapter_3.9_Error_Handling.md`)
  - Synchronous vs asynchronous errors. Custom error middleware. Returning proper 4xx/5xx responses. Bridge to Phase 0.6 and 0.10 (Errors, Failure Is Normal).
- **Chapter 3.10:** Static Files and Assets (`Chapter_3.10_Static_Files.md`)
  - Serving HTML, CSS, JS, images. express.static(). Understanding static vs dynamic responses. Serving your dashboard frontend.
- **Chapter 3.11:** Templating and Server-Side Rendering (`Chapter_3.11_Templating.md`)
  - Overview: view engines, server-rendered HTML, res.render(). When to use templates vs APIs. Building server-rendered dashboards for sensor data.
- **Chapter 3.11a:** EJS Deep Dive (`Chapter_3.11a_EJS_Deep_Dive.md`)
  - EJS syntax: <%= %>, <% %>, <%- %>. Partials and includes. Layouts (with express-ejs-layouts or manual). Escaping and security (XSS). Integration with Express (app.set('view engine', 'ejs'), res.render). Passing data to views.
- **Chapter 3.11b:** Handlebars Deep Dive (`Chapter_3.11b_Handlebars_Deep_Dive.md`)
  - Handlebars syntax: {{}}, {{{}}}, {{#each}}, {{#if}}, helpers. Partials and layout (express-handlebars). Custom helpers. Express integration (view engine setup, res.render). Comparison with EJS; when to choose which.
- **Chapter 3.12:** RESTful API Design in Express (`Chapter_3.12_REST_APIs.md`)
  - Applying Phase 2 REST principles to route design, status codes, and representations. Building RESTful APIs for your homestead sensor system.
- **Chapter 3.13:** Validation at the Boundary (`Chapter_3.13_Validation.md`)
  - Validating input. Checking type, presence, and range. Preventing malformed data from entering the system. Bridge to Phase 0.8 and Phase 2.21 (Boundaries, Trust Boundaries).
- **Chapter 3.14:** Authentication Basics (`Chapter_3.14_Authentication.md`)
  - Sessions vs tokens. Cookies in Express. Basic auth flows. Where trust boundaries live. Bridge to Phase 2.20 (Cookies and Session State).
- **Chapter 3.15:** State and Persistence (`Chapter_3.15_Persistence.md`)
  - Connecting to databases (conceptually). Separation between request handling and storage layers. Bridge to Phase 1.13 (Persistence) and preparation for Phase 6-9 (Databases).
- **Chapter 3.16:** Environment and Configuration (`Chapter_3.16_Configuration.md`)
  - Environment variables, ports, secrets. Configuring behavior without hardcoding. Managing development vs production settings for your Pi server.
- **Chapter 3.17:** Asynchronous Flow in Express (`Chapter_3.17_Async_and_Await.md`)
  - Promises, async/await, and handling asynchronous operations without breaking the pipeline. Reading sensors, querying databases, making external API calls.
- **Chapter 3.18:** Modularizing an Express App (`Chapter_3.18_Modularization.md`)
  - Splitting routes, middleware, and services into modules. Program structure at scale. Bridge to Phase 1.14 (Modules and Program Structure).
- **Chapter 3.19:** Observability and Logging (`Chapter_3.19_Logging.md`)
  - Logging requests, status codes, errors. Making systems observable. Understanding what your server is doing and when things fail.
- **Chapter 3.20:** Building a Complete API (`Chapter_3.20_Complete_API.md`)
  - Assembling a full REST API: routing, validation, persistence, error handling, and proper status codes. Complete sensor data API for your homestead.
- **Chapter 3.21:** Deployment Fundamentals (`Chapter_3.21_Deployment.md`)
  - Running behind a reverse proxy. Production vs development mode. Trust proxy settings. Preparing your Express server for real-world deployment.
- **Chapter 3.22:** Security Surfaces in Express (`Chapter_3.22_Security.md`)
  - Helmet, input sanitization, CSRF awareness, rate limiting. Applying Phase 2 boundary discipline. Bridge to Phase 2.21 (Trust Boundaries and Security Surfaces).
- **Chapter 3.23:** Performance and Scaling Concepts (`Chapter_3.23_Performance.md`)
  - Node event loop, blocking code, clustering, horizontal scaling basics. Understanding how Express handles concurrent requests and when to scale.
- **Chapter 3.24:** Building a Living Express System (`Chapter_3.24_Living_System.md`)
  - Complete system assembly: middleware pipeline, routes, persistence, error handling, configuration, logging. Express as a living server. Bridge to Phase 1.15 (Assembling a Living Python System).

**Key Concepts:** Express as structured HTTP, routing and middleware pipelines, request/response lifecycle, validation at the boundary, RESTful API construction, async flow control, modular program organization, deployment fundamentals, security as boundary discipline

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 1, Section B Phase 2 (HTML), Section B Phase 3 (JavaScript), Section B Phase 4 (Node, npm, JSON)

**Depth:** Working knowledge with emphasis on architectural patterns and boundary discipline

**Projects:** REST API for sensor data, simple web dashboard, complete homestead monitoring API

---

### Phase 6: Testing Fundamentals
**Directory:** `Section_B/Phase_6/`

Testing as a boundary discipline: verifying behavior without manual clicking, catching regressions, and documenting contracts. Unit tests vs integration tests. Testing Express routes and APIs. Choice of runner (e.g. Jest) and patterns. Essential before scaling the homestead codebase.

**Chapters:**
- **Chapter 6.1:** Why We Test (`Chapter_6.1_Why_We_Test.md`)
  - Confidence, regression prevention, documentation of behavior; tests as executable specs. Bridge to Phase 0.8 (Boundaries) and Phase 0.10 (Failure Is Normal).
- **Chapter 6.2:** Unit vs Integration vs E2E (`Chapter_6.2_Unit_Integration_E2E.md`)
  - Unit: single function/module in isolation. Integration: multiple units (e.g. route + DB). E2E: full stack. When to use each; pyramid.
- **Chapter 6.3:** Test Runners and Structure (`Chapter_6.3_Test_Runners.md`)
  - Jest (or similar): describe, it, expect. File naming (e.g. *.test.js). Running tests (npm test). Organizing tests by phase/module.
- **Chapter 6.4:** Writing Assertions (`Chapter_6.4_Assertions.md`)
  - expect().toBe, .toEqual, .toThrow; matchers for numbers, strings, arrays, objects. Meaningful failure messages.
- **Chapter 6.5:** Mocking and Stubs (`Chapter_6.5_Mocking.md`)
  - Why mock (external deps, DB, time). Jest mocks: jest.fn(), jest.mock(). Stubbing modules and functions. Don’t over-mock.
- **Chapter 6.6:** Testing Express Routes and APIs (`Chapter_6.6_Testing_Express_Routes.md`)
  - Using supertest (or similar): request(app).get/post(). Testing status codes, response body, headers. Isolating routes (no real DB).
- **Chapter 6.7:** Testing Async and Errors (`Chapter_6.7_Testing_Async_Errors.md`)
  - Async tests: return promises or async/await. Testing that errors are thrown; testing error middleware responses.
- **Chapter 6.8:** Test Data and Fixtures (`Chapter_6.8_Test_Data_Fixtures.md`)
  - Fixtures for consistent input; factories vs static JSON; cleaning up (beforeEach/afterEach). Seeding test DB when needed.
- **Chapter 6.9:** Coverage and What It Means (`Chapter_6.9_Coverage.md`)
  - Line/statement coverage; what coverage does and doesn’t guarantee; coverage as signal, not goal.
- **Chapter 6.10:** Testing in Your Workflow (`Chapter_6.10_Testing_in_Workflow.md`)
  - Running tests before commit; CI (concept); tests as part of Phase 3 and Phase 9 integration.

**Key Concepts:** Unit vs integration tests, test runner, assertions, mocking, testing Express APIs, coverage

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 1, Section B Phase 3, Section B Phase 4, Section B Phase 5

**Depth:** Working knowledge — enough to test Express routes and critical logic

**Projects:** Test suite for Section B Phase 5 sensor API, integration tests for key endpoints

---

### Phase 7: CSS Fundamentals
**Directory:** `Section_B/Phase_7/`

Deep understanding of Cascading Style Sheets — how web pages are styled, how rules cascade and compete, and how layout actually works. Separation of structure (HTML) from presentation (CSS). Essential foundation for building readable, maintainable dashboards and interfaces for your homestead monitoring system.

**Chapters:**
- **Chapter 4.1:** What CSS Is (`Chapter_4.1_What_CSS_Is.md`)
  - Separation of structure and presentation. How CSS connects to HTML. Inline vs embedded vs external stylesheets. Why styling belongs in its own layer. Bridge to Phase 2 (HTTP delivers HTML + CSS).
- **Chapter 4.2:** Selectors — Finding Elements (`Chapter_4.2_Selectors.md`)
  - Element, class, id selectors. Combinators (descendant, child, adjacent). Attribute selectors. How to target exactly what you want without overshooting.
- **Chapter 4.3:** Specificity and the Cascade (`Chapter_4.3_Specificity_and_Cascade.md`)
  - How rules compete when multiple apply. Specificity calculation. Order of appearance. !important and when to avoid it. Why your styles aren't applying — and how to fix it.
- **Chapter 4.4:** The Box Model (`Chapter_4.4_Box_Model.md`)
  - Content, padding, border, margin. How width and height interact with box-sizing. Why layouts break when you forget margin collapse.
- **Chapter 4.5:** Display and Layout Flow (`Chapter_4.5_Display_and_Layout.md`)
  - block, inline, inline-block. Normal flow. How elements stack and wrap. Foundation for Flexbox and Grid.
- **Chapter 4.6:** Flexbox — One-Dimensional Layout (`Chapter_4.6_Flexbox.md`)
  - flex container and flex items. Main axis and cross axis. justify-content, align-items, flex-grow, flex-shrink. Building flexible component layouts. Dashboard panels, sensor cards, nav bars.
- **Chapter 4.7:** CSS Grid — Two-Dimensional Layout (`Chapter_4.7_Grid.md`)
  - Grid containers and tracks. fr units. Template areas. When to use Grid vs Flexbox. Dashboard grid layouts.
- **Chapter 4.8:** Units and Sizing (`Chapter_4.8_Units_and_Sizing.md`)
  - px, em, rem, %, vw, vh. When each makes sense. Accessibility and rem for typography. Responsive sizing.
- **Chapter 4.9:** Typography (`Chapter_4.9_Typography.md`)
  - font-family, font-size, font-weight, line-height. Readable text for dashboards. System fonts vs web fonts. Text alignment and spacing.
- **Chapter 4.10:** Color (`Chapter_4.10_Color.md`)
  - Hex, rgb, hsl. Named colors. Transparency. Contrast and accessibility. Color for status (sensor readings, alerts, thresholds).
- **Chapter 4.11:** Spacing and Layout Patterns (`Chapter_4.11_Spacing_and_Layout.md`)
  - Margin, padding conventions. Consistent spacing systems. Gap in Flexbox and Grid. Whitespace as design.
- **Chapter 4.12:** Responsive Design and Media Queries (`Chapter_4.12_Responsive_Design.md`)
  - Breakpoints. Mobile-first vs desktop-first. Viewport meta tag. Making your dashboard usable on phone and desktop.
- **Chapter 4.13:** Pseudo-classes and Pseudo-elements (`Chapter_4.13_Pseudo_Classes_and_Elements.md`)
  - :hover, :focus, :active. ::before, ::after. State-based styling. Accessibility and focus indicators.
- **Chapter 4.14:** Transitions and Animation (`Chapter_4.14_Transitions_and_Animation.md`)
  - transition, animation, @keyframes. Smooth state changes. When animation helps vs distracts. Subtle feedback for UI interactions.
- **Chapter 4.15:** CSS Custom Properties (Variables) (`Chapter_4.15_Custom_Properties.md`)
  - --variable-name. Scoping. Theming. Shared values across a stylesheet. Homestead dashboard theme (colors, spacing).
- **Chapter 4.16:** Inheritance (`Chapter_4.16_Inheritance.md`)
  - What cascades from parent to child. inherit keyword. Which properties inherit and which don't. Reducing repetition.
- **Chapter 4.17:** Debugging CSS (`Chapter_4.17_Debugging_CSS.md`)
  - DevTools inspection. Specificity conflicts. Layout debugging. Why it looks wrong and how to find the cause.
- **Chapter 4.18:** CSS and Accessibility (`Chapter_4.18_CSS_and_Accessibility.md`)
  - Contrast ratios. Focus styles. Reduced motion. Screen readers and CSS. Making interfaces usable for everyone.
- **Chapter 4.19:** Building a Dashboard Layout (`Chapter_4.19_Dashboard_Layout.md`)
  - Consolidation chapter. Assembling Flexbox, Grid, typography, spacing, and responsive patterns into a cohesive homestead monitoring dashboard. Bridge to Section B Phase 9 (Shoelace components).

**Key Concepts:** Cascade and specificity, box model, Flexbox, Grid, responsive design, custom properties, accessibility-first styling

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 1, Section B Phase 2 (HTML Fundamentals)

**Depth:** Deep understanding — CSS as a system, not a bag of tricks

**Reference:** Mozilla MDN (CSS) woven throughout for web standards

**Projects:** Homestead monitoring dashboard layout, sensor status cards, responsive nav, themed component styles

---

### Phase 8: DOM and Browser JavaScript
**Directory:** `Section_B/Phase_8/`

The Document Object Model: how JavaScript sees and manipulates the page. Elements, events, fetching data in the browser, and script loading. Bridge between Phase 4 (CSS styles the DOM) and Phase 5 (Shoelace components are DOM elements). Essential for interactive dashboards and any client-side behavior.

**Chapters:**
- **Chapter 8.1:** What the DOM Is (`Chapter_8.1_What_the_DOM_Is.md`)
  - HTML as a tree; nodes (elements, text, attributes); document object; DOM as live representation. Bridge to Phase 2.5 (HTML structure).
- **Chapter 8.2:** Selecting Elements (`Chapter_8.2_Selecting_Elements.md`)
  - getElementById, getElementsByClassName, getElementsByTagName; querySelector, querySelectorAll; NodeList vs HTMLCollection; single vs multiple.
- **Chapter 8.3:** Traversing and Modifying the Tree (`Chapter_8.3_Traversing_and_Modifying.md`)
  - parentElement, children, nextElementSibling; innerHTML, textContent; createElement, append, remove; when to use what (security: innerHTML vs textContent).
- **Chapter 8.4:** Attributes and Properties (`Chapter_8.4_Attributes_and_Properties.md`)
  - getAttribute, setAttribute, removeAttribute; DOM properties (value, checked, href); classList (add, remove, toggle).
- **Chapter 8.5:** Events — Listening and Handling (`Chapter_8.5_Events_Listening.md`)
  - addEventListener; event object (target, type, preventDefault, stopPropagation); click, submit, input, change. Bridge to Phase 0.8 (boundaries: user input).
- **Chapter 8.6:** Events — Bubbling and Delegation (`Chapter_8.6_Events_Bubbling_Delegation.md`)
  - Event phases; bubbling and capturing; delegation (one listener on parent). Performance and dynamic content.
- **Chapter 8.7:** Fetch and HTTP from the Browser (`Chapter_8.7_Fetch.md`)
  - fetch(url); Response, json(), text(); status and error handling. GET and POST with fetch. Same-origin and CORS (concept). Bridge to Phase 2 and Phase 3 APIs.
- **Chapter 8.8:** Script Loading — defer, async, modules (`Chapter_8.8_Script_Loading.md`)
  - Where to put script tags; blocking vs defer vs async; type="module" and imports; DOMContentLoaded.
- **Chapter 8.9:** Forms and the DOM (`Chapter_8.9_Forms_and_DOM.md`)
  - Form element; form.elements; reading and setting values; submit event; client-side validation vs server. Bridge to Phase 2.5 forms.
- **Chapter 8.10:** DOM and CSS (`Chapter_8.10_DOM_and_CSS.md`)
  - element.style; classList for state-based styling; matching CSS (Phase 4) with JS state. Dashboard toggles and feedback.
- **Chapter 8.11:** Debugging the DOM (`Chapter_8.11_Debugging_DOM.md`)
  - DevTools Elements panel; breakpoints and console; logging elements and state. Finding why the page doesn’t update.
- **Chapter 8.12:** DOM in Your Workflow (`Chapter_8.12_DOM_in_Workflow.md`)
  - When to use vanilla DOM vs frameworks; progressive enhancement; connection to Phase 3 (server-rendered) and Phase 5 (Shoelace).

**Key Concepts:** DOM tree, selection, traversal, events, fetch, script loading, form interaction

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 1, Section B Phase 2, Section B Phase 3, Section B Phase 7 (CSS)

**Depth:** Deep understanding — DOM as the bridge between HTML/CSS and behavior

**Projects:** Interactive dashboard updates, form handling, fetch-based sensor display

---

### Phase 9: Web Components & Modern Frontend Development
**File:** `Section_B/Phase_9/Phase_9_Shoelace.md`

Building reusable, accessible web components using Shoelace and understanding modern frontend architecture. Component composition, theming, accessibility, and progressive enhancement. Builds on Phase 4 CSS — you now understand how styles work; Shoelace components give you pre-built, themeable building blocks.

**Key Concepts:** Web Components standard, Shadow DOM, custom elements, component libraries, accessibility, theming

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 1, Section B Phase 2, Section B Phase 7 (CSS Fundamentals), Section B Phase 8 (DOM and Browser JavaScript)

**Depth:** Working knowledge (lesser priority, used for UI polish)

**Reference:** Mozilla MDN woven throughout for web standards

---

### Phase 10: TypeScript Fundamentals
**Directory:** `Section_B/Phase_10/`

TypeScript as a typed superset of JavaScript: types, interfaces, and better tooling for Node and Express (and optionally frontend). Same mental models as Phase 2.6 (JavaScript) with an added type layer. Use with Phase 3 (Express) and Phase 9 (better-sqlite3) for type-safe APIs and DB access.

**Chapters:**
- **Chapter 10.1:** What TypeScript Is (`Chapter_10.1_What_TypeScript_Is.md`)
  - Superset of JavaScript; compile to JS; type checking; why types help (documentation, refactors, fewer runtime errors). Bridge to Phase 2.6.
- **Chapter 10.2:** Basic Types (`Chapter_10.2_Basic_Types.md`)
  - number, string, boolean, null, undefined; arrays (T[] and Array<T>); any and when to avoid it; type inference.
- **Chapter 10.3:** Interfaces and Type Aliases (`Chapter_10.3_Interfaces_and_Types.md`)
  - interface for object shapes; type for unions and aliases; optional and readonly; extending interfaces.
- **Chapter 10.4:** Functions and Signatures (`Chapter_10.4_Functions.md`)
  - Parameter and return types; optional parameters; overloads (concept); async functions.
- **Chapter 10.5:** Generics — Basics (`Chapter_10.5_Generics_Basics.md`)
  - Generic functions and types; <T>; why generics (reuse without losing type info). Array and Promise as examples.
- **Chapter 10.6:** Union and Literal Types (`Chapter_10.6_Unions_and_Literals.md`)
  - Union types (A | B); literal types ('get' | 'post'); type narrowing with typeof and checks.
- **Chapter 10.7:** Classes and Types (`Chapter_10.7_Classes.md`)
  - Class syntax with types; public, private, readonly; implements interface. When classes vs plain objects.
- **Chapter 10.8:** Strictness and Configuration (`Chapter_10.8_Strictness_Config.md`)
  - tsconfig.json; strict mode; target and module; path mapping. Balancing safety and migration.
- **Chapter 10.9:** TypeScript with Node and Express (`Chapter_10.9_TS_with_Node_Express.md`)
  - Typing Express req, res, routes; @types/express; typing middleware and error handlers. Bridge to Phase 3.
- **Chapter 10.10:** Typing JSON and APIs (`Chapter_10.10_Typing_JSON_APIs.md`)
  - Interfaces for API responses and request bodies; validation vs types (runtime vs compile time). Bridge to Phase 2.7 and Phase 3.
- **Chapter 10.11:** TypeScript with the Frontend (Optional) (`Chapter_10.11_TS_Frontend.md`)
  - Typing DOM (lib "dom"); typing fetch responses; using TS in script type="module" or build step. Connection to Phase 4.5 and Phase 5.
- **Chapter 10.12:** TypeScript in Your Workflow (`Chapter_10.12_TS_in_Workflow.md`)
  - tsc and watch mode; IDE support; migrating a small Express project to TS; Phase 9 (better-sqlite3) with types.

**Key Concepts:** Types, interfaces, type inference, generics, tsconfig, typing Express and APIs

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 1, Section B Phase 3, Section B Phase 4, Section B Phase 5 (recommended)

**Depth:** Working knowledge — enough to add types to Express and Node projects

**Projects:** Add TypeScript to a Section B Phase 5 API, type definitions for sensor and config DTOs

---

## Section C: Databases & Data Storage

### Phase 1: SQL Foundations and Relational Database Concepts
**File:** `Section_C/Phase_1/Phase_1_SQL_Foundations.md`

Core concepts of relational databases and SQL. Tables, relationships, queries, joins, transactions, and data modeling. Understanding how data is structured, queried, and maintained.

**Key Concepts:** Relational model, normalization, SQL syntax, CRUD operations, joins, transactions, indexes, constraints

**Prerequisites:** Section A Phase 1, Section A Phase 2

**Depth:** Deep understanding (foundational for all database work)

**Projects:** Data modeling exercises, query optimization practice

---

### Phase 2: SQLite Database Systems
**File:** `Section_C/Phase_2/Phase_2_SQLite.md`

SQLite as an embedded, file-based database. Perfect for local-first applications, logging, configuration storage, and small-scale data persistence. Understanding ACID properties, file-based storage, and when SQLite fits.

**Key Concepts:** SQLite architecture, file-based storage, ACID compliance, embedded databases, migration strategies, backup/recovery

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section C Phase 1

**Depth:** Working knowledge with deep understanding of embedded database patterns

**Projects:** Local data logger, configuration management system

---

### Phase 3: MySQL Relational Database Management
**File:** `Section_C/Phase_3/Phase_3_MySQL.md`

MySQL as a full-featured database server. Client-server architecture, user management, performance optimization, replication, and production deployment patterns. Understanding when to use server-based vs. embedded databases.

**Key Concepts:** MySQL server architecture, user privileges, query optimization, indexing strategies, replication, backup strategies, production considerations

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section C Phase 1

**Depth:** Working knowledge with emphasis on production patterns

**Projects:** Multi-user data system, replication setup

---

### Phase 4: better-sqlite3 and Node.js Database Integration
**File:** `Section_C/Phase_4/Phase_4_better_sqlite3.md`

Using better-sqlite3 for synchronous SQLite access in Node.js applications. Understanding the trade-offs between synchronous and asynchronous database access, transaction handling, and integration patterns.

**Key Concepts:** Synchronous vs. asynchronous database access, better-sqlite3 API, transaction management, performance considerations, Node.js integration patterns

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 5, Section C Phase 1, Section C Phase 2

**Depth:** Working knowledge

**Projects:** Express.js application with SQLite backend

---

## Section D: Systems & Infrastructure

### Phase 1: Linux Kernel and System Fundamentals
**File:** `Section_D/Phase_1/Phase_1_Linux_Kernel.md`

Understanding how operating systems work at the kernel level. Processes, memory management, file systems, device drivers, and system calls. Essential for embedded systems, server administration, and understanding how software interacts with hardware.

**Key Concepts:** Kernel architecture, process management, memory management, file systems, device drivers, system calls, kernel modules, boot process

**Prerequisites:** Section A Phase 1, Section A Phase 2

**Depth:** Deep understanding (foundational for systems work)

**Reference:** The Linux Documentation Project woven throughout

**Projects:** System monitoring tools, kernel module exploration

---

### Phase 2: Docker Containerization and Application Isolation
**File:** `Section_D/Phase_2/Phase_2_Docker.md`

Containerization concepts and Docker fundamentals. Images, containers, Dockerfiles, volumes, and the container ecosystem. Understanding isolation, portability, and reproducible deployments.

**Key Concepts:** Containerization vs. virtualization, Docker images, Dockerfiles, container lifecycle, volumes, Docker Compose, image optimization

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section D Phase 1

**Depth:** Working knowledge with emphasis on practical deployment patterns

**Projects:** Containerized web application, multi-container system

---

### Phase 3: Docker Networking and Multi-Platform Builds
**File:** `Section_D/Phase_3/Phase_3_Docker_Advanced.md`

Advanced Docker topics: networking models, multi-container communication, Docker Buildx for cross-platform builds, and production deployment patterns. Understanding how containers communicate and how to build for different architectures.

**Key Concepts:** Docker networking models, bridge networks, overlay networks, Docker Buildx, multi-architecture builds, production networking patterns

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section D Phase 1, Section D Phase 2

**Depth:** Working knowledge

**Projects:** Multi-container application with custom networking, ARM64 builds for Raspberry Pi

---

### Phase 4: Cloud Infrastructure and Deployment with Linode
**File:** `Section_D/Phase_4/Phase_4_Linode.md`

Cloud infrastructure concepts and deploying applications to Linode. VPS management, server configuration, deployment pipelines, monitoring, and scaling considerations. Understanding the transition from local development to production infrastructure.

**Key Concepts:** VPS management, server configuration, deployment strategies, monitoring, backup strategies, scaling patterns, cost optimization

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section D Phase 1, Section D Phase 2

**Depth:** Working knowledge

**Projects:** Deploy Express.js application to Linode, set up monitoring and backups

---

## Section E: IoT & Embedded Systems

### Phase 1: ESP32 Hardware and Development Fundamentals
**File:** `Section_E/Phase_1/Phase_1_ESP32.md`

ESP32 microcontroller architecture, capabilities, and development environment. GPIO, ADC, WiFi, Bluetooth, power management, and hardware interfaces. Understanding embedded constraints: memory, power, timing, and reliability.

**Key Concepts:** ESP32 architecture, GPIO programming, ADC reading, WiFi/Bluetooth, power management, hardware interfaces, embedded constraints, debugging techniques

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section D Phase 1

**Depth:** Deep understanding (core technology for capstone)

**Projects:** Basic sensor reading, WiFi connectivity, power monitoring

---

### Phase 2: MicroPython for Embedded Systems
**File:** `Section_E/Phase_2/Phase_2_MicroPython.md`

MicroPython as a Python runtime for microcontrollers. Differences from standard Python, hardware abstraction, memory management, and optimization strategies. Writing Python code that runs efficiently on resource-constrained devices.

**Key Concepts:** MicroPython runtime, hardware APIs, memory constraints, optimization techniques, REPL debugging, firmware updates, Python vs. MicroPython differences

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section E Phase 1

**Depth:** Deep understanding (primary development language for capstone)

**Projects:** MicroPython sensor nodes, custom hardware drivers

---

### Phase 3: MQTT Messaging Protocol for IoT
**File:** `Section_E/Phase_3/Phase_3_MQTT.md`

MQTT as a lightweight messaging protocol for IoT systems. Pub/sub patterns, topics, QoS levels, brokers, and reliability patterns. Understanding how distributed sensor networks communicate efficiently.

**Key Concepts:** MQTT protocol, publish/subscribe patterns, topics and wildcards, QoS levels, brokers, retained messages, last will and testament, security

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section B Phase 1, Section E Phase 1

**Depth:** Working knowledge with deep understanding of reliability patterns

**Projects:** MQTT sensor network, broker setup, message routing

---

### Phase 4: ESPHome Configuration and Device Automation
**File:** `Section_E/Phase_4/Phase_4_ESPHome.md`

ESPHome as a YAML-based configuration system for ESP devices. Sensor definitions, automation rules, OTA updates, and integration patterns. Understanding declarative vs. imperative approaches to embedded programming.

**Key Concepts:** ESPHome YAML configuration, sensor definitions, automation rules, OTA updates, custom components, integration with Home Assistant, declarative automation

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section E Phase 1, Section E Phase 3

**Depth:** Working knowledge

**Projects:** Configure ESP32 sensors via ESPHome, create automation rules

---

### Phase 5: Home Assistant Integration and Local-First Automation
**File:** `Section_E/Phase_5/Phase_5_Home_Assistant.md`

Home Assistant as a local-first home automation platform. Architecture, integrations, automations, state management, and self-hosting patterns. Building reliable automation systems that work offline and prioritize local control.

**Key Concepts:** Home Assistant architecture, entity model, automations and scripts, integrations, state management, local-first principles, self-hosting, backup and recovery

**Prerequisites:** Section A Phase 1, Section A Phase 2, Section E Phase 1, Section E Phase 3, Section E Phase 4

**Depth:** Working knowledge with emphasis on reliability patterns

**Projects:** Home Assistant setup, custom integrations, complex automations

---

### Phase 6: Capstone - Resilient Off-Grid Homestead Automation System
**File:** `Section_E/Phase_6/Phase_6_Capstone.md`

Integrating all technologies into a production-ready homestead automation system. ESP32 sensor nodes monitoring temperature, humidity, power usage, and environmental conditions across multiple buildings. Local-first architecture with Home Assistant, MQTT communication, SQLite data storage, and graceful degradation patterns.

**Key Concepts:** System architecture, reliability patterns, failure modes, graceful degradation, manual overrides, data persistence, monitoring and alerting, power management, cold weather operation, physical deployment

**Prerequisites:** All previous phases (especially Section E Phase 1, 2, 3, 5)

**Depth:** Deep understanding through practical application

**Project:** Complete homestead automation system with:
- Battery-powered ESP32 sensor nodes
- MQTT communication network
- Local Home Assistant instance
- Data logging and persistence
- Automation rules with manual overrides
- Monitoring and alerting
- Documentation and maintenance procedures

---

## Reference Materials

### Mozilla MDN Web Documentation
**Integration:** Referenced throughout Section B (Web Development) phases: HTTP, HTML, JavaScript, Express, CSS, DOM & Browser JS, Shoelace, TypeScript

Web standards, APIs, and best practices documentation. Used as reference material when learning HTTP, HTML, JavaScript, Express.js, CSS, the DOM, web components, and TypeScript.

---

### The Linux Documentation Project
**Integration:** Referenced throughout Section D (Systems & Infrastructure) phases

Comprehensive Linux documentation covering kernel, system administration, and infrastructure topics. Used as reference material when learning Linux fundamentals and Docker.

---

## Learning Philosophy

This curriculum follows a **concept-first, depth-over-speed** approach:

- **Repetition and Layering:** Concepts are introduced, reinforced, and deepened across multiple phases
- **Real-World Grounding:** Examples drawn from homestead systems, automation, and physical constraints
- **Transferable Understanding:** Focus on mental models that work across languages and technologies
- **Practical Application:** Each phase includes projects that demonstrate understanding
- **Self-Contained Phases:** Each phase can stand alone while building on previous work
- **Progressive Complexity:** Simple concepts first, building to complex integrated systems

---

## Versioning and Updates

As technologies evolve, new chapters may be added to existing phases or new phases created. The structure is designed to accommodate:
- Technology version updates (e.g., "ESP32 v2 Features")
- New related technologies (e.g., "Rust for Embedded Systems")
- Expanded depth in existing areas (e.g., "Advanced SQL Optimization")

Each phase file includes metadata about when it was created and last updated, allowing the curriculum to evolve while maintaining clarity about what version of technology it covers.

---

## Notes on Structure

- **Phase Files:** Each phase is a self-contained `.md` file with consistent structure
- **Projects:** Smaller scripts embedded in lessons; larger projects in separate files; capstone as comprehensive system
- **Foundational Chapters:** Broad concepts (e.g., SQL) come before specific implementations (e.g., SQLite)
- **Cross-References:** Phases reference related concepts in other phases where appropriate
- **Homestead Context:** Examples and projects consistently reference real-world homestead automation needs

---

*This learning plan is a living document, evolving as understanding deepens and technologies advance.*
