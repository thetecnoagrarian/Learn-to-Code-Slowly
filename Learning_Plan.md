# Learning Plan: Comprehensive Programming & Systems Curriculum

This learning plan is designed to build deep, transferable understanding across a wide range of technologies, culminating in a resilient off-grid homestead automation system. Each phase is self-contained yet builds explicitly on previous chapters, following a concept-first approach grounded in real-world systems.

---

## Learning Path Map

### Recommended Sequence

```
Phase 0: Conceptual Foundations
    ↓
Phase 1: Python Fundamentals
    ↓
    ├─→ Section A: Web Development & Networking
    │   ├─→ Phase 2: HTTP Protocol Fundamentals
    │   ├─→ Phase 3: Express.js Web Applications
    │   └─→ Phase 4: Web Components & Frontend (Shoelace)
    │
    ├─→ Section B: Databases & Data Storage
    │   ├─→ Phase 5: SQL Foundations
    │   ├─→ Phase 6: SQLite Database Systems
    │   ├─→ Phase 7: MySQL Relational Databases
    │   └─→ Phase 8: better-sqlite3 & Node.js Integration
    │
    ├─→ Section C: Systems & Infrastructure
    │   ├─→ Phase 9: Linux Kernel & System Fundamentals
    │   ├─→ Phase 10: Docker Containerization
    │   ├─→ Phase 11: Docker Networking & Multi-Platform Builds
    │   └─→ Phase 12: Cloud Infrastructure & Deployment (Linode)
    │
    └─→ Section D: IoT & Embedded Systems
        ├─→ Phase 13: ESP32 Hardware & Development
        ├─→ Phase 14: MicroPython for Embedded Systems
        ├─→ Phase 15: MQTT Messaging Protocol
        ├─→ Phase 16: ESPHome Configuration & Automation
        ├─→ Phase 17: Home Assistant Integration
        └─→ Phase 18: Capstone: Resilient Homestead Automation System
```

**Note:** While phases build on each other, you can explore sections in parallel once foundational phases are complete. The capstone phase integrates concepts from all sections.

---

## Foundational Phases

### Phase 0: Conceptual Foundations
**Directory:** `Phase_0/` *(Complete)*

Conceptual foundations of programming: inputs, outputs, state, instructions, conditions, loops, functions, data, errors, and time. Language-agnostic mental models that transfer across all technologies.

**Chapters:**
- **Chapter 0.1:** What Programs Actually Are (`Chapter_0.1_What_Programs_Are.md`)
- **Chapter 0.2:** Conditions and Branching (`Chapter_0.2_Conditions_and_Branching.md`)
- **Chapter 0.3:** Loops and Repetition (`Chapter_0.3_Loops_and_Repetition.md`)
- **Chapter 0.4:** Functions and Behavior (`Chapter_0.4_Functions_and_Behavior.md`)
- **Chapter 0.5:** Data and Variables (`Chapter_0.5_Data_and_Variables.md`)
- **Chapter 0.6:** Errors and Failure (`Chapter_0.6_Errors_and_Failure.md`)
- **Chapter 0.7:** Time and State Changes (`Chapter_0.7_Time_and_State_Changes.md`)
- **Chapter 0.8:** Consolidation (`Chapter_0.8_Consolidation.md`)

**Key Concepts:** State management, control flow, deterministic execution, error handling, temporal reasoning

---

### Phase 1: Python Fundamentals Expressed in Code
**Directory:** `Phase_1/` *(Complete)*

Python as the anchor language for expressing fundamental programming concepts. Deep dive into variables, types, functions, scope, collections, I/O, modules, and program structure.

**Chapters:**
- **Chapter 1.1:** Python Core Concepts (`Chapter_1.1_Python_Core_Concepts.md`)
  - Programs, variables, conditions, loops, functions, I/O, errors, living systems
- **Chapter 1.2:** Python Advanced Patterns (`Chapter_1.2_Python_Advanced_Patterns.md`)
  - Scope, data types, collections, truthiness, type conversion, dictionaries, persistence, modules, design patterns

**Key Concepts:** Python syntax, data types, function design, module organization, input validation, persistence

**Artifacts:** System State Monitor, Sensor Snapshot Logger

---

## Section A: Web Development & Networking

### Phase 2: HTTP Protocol Fundamentals
**File:** `Phase_2_HTTP.md`

Understanding how web communication actually works at the protocol level. Requests, responses, headers, methods, status codes, and the client-server model. Essential foundation for all web technologies.

**Key Concepts:** HTTP methods, request/response cycle, headers, status codes, stateless protocols, REST principles

**Prerequisites:** Phase 0, Phase 1

**Depth:** Working knowledge with deep understanding of protocol mechanics

---

### Phase 3: Building Web Applications with Express.js
**File:** `Phase_3_Express.md`

Server-side web application development using Express.js. Routing, middleware, request handling, templating, and API design. Building RESTful services and understanding the Node.js ecosystem.

**Key Concepts:** Express routing, middleware patterns, request/response handling, API design, error handling, static file serving

**Prerequisites:** Phase 0, Phase 1, Phase 2

**Depth:** Working knowledge with emphasis on architectural patterns

**Projects:** REST API for sensor data, simple web dashboard

---

### Phase 4: Web Components & Modern Frontend Development
**File:** `Phase_4_Shoelace.md`

Building reusable, accessible web components using Shoelace and understanding modern frontend architecture. Component composition, theming, accessibility, and progressive enhancement.

**Key Concepts:** Web Components standard, Shadow DOM, custom elements, component libraries, accessibility, theming

**Prerequisites:** Phase 0, Phase 1, Phase 2

**Depth:** Working knowledge (lesser priority, used for UI polish)

**Reference:** Mozilla MDN woven throughout for web standards

---

## Section B: Databases & Data Storage

### Phase 5: SQL Foundations and Relational Database Concepts
**File:** `Phase_5_SQL_Foundations.md`

Core concepts of relational databases and SQL. Tables, relationships, queries, joins, transactions, and data modeling. Understanding how data is structured, queried, and maintained.

**Key Concepts:** Relational model, normalization, SQL syntax, CRUD operations, joins, transactions, indexes, constraints

**Prerequisites:** Phase 0, Phase 1

**Depth:** Deep understanding (foundational for all database work)

**Projects:** Data modeling exercises, query optimization practice

---

### Phase 6: SQLite Database Systems
**File:** `Phase_6_SQLite.md`

SQLite as an embedded, file-based database. Perfect for local-first applications, logging, configuration storage, and small-scale data persistence. Understanding ACID properties, file-based storage, and when SQLite fits.

**Key Concepts:** SQLite architecture, file-based storage, ACID compliance, embedded databases, migration strategies, backup/recovery

**Prerequisites:** Phase 0, Phase 1, Phase 5

**Depth:** Working knowledge with deep understanding of embedded database patterns

**Projects:** Local data logger, configuration management system

---

### Phase 7: MySQL Relational Database Management
**File:** `Phase_7_MySQL.md`

MySQL as a full-featured database server. Client-server architecture, user management, performance optimization, replication, and production deployment patterns. Understanding when to use server-based vs. embedded databases.

**Key Concepts:** MySQL server architecture, user privileges, query optimization, indexing strategies, replication, backup strategies, production considerations

**Prerequisites:** Phase 0, Phase 1, Phase 5

**Depth:** Working knowledge with emphasis on production patterns

**Projects:** Multi-user data system, replication setup

---

### Phase 8: better-sqlite3 and Node.js Database Integration
**File:** `Phase_8_better_sqlite3.md`

Using better-sqlite3 for synchronous SQLite access in Node.js applications. Understanding the trade-offs between synchronous and asynchronous database access, transaction handling, and integration patterns.

**Key Concepts:** Synchronous vs. asynchronous database access, better-sqlite3 API, transaction management, performance considerations, Node.js integration patterns

**Prerequisites:** Phase 0, Phase 1, Phase 3, Phase 5, Phase 6

**Depth:** Working knowledge

**Projects:** Express.js application with SQLite backend

---

## Section C: Systems & Infrastructure

### Phase 9: Linux Kernel and System Fundamentals
**File:** `Phase_9_Linux_Kernel.md`

Understanding how operating systems work at the kernel level. Processes, memory management, file systems, device drivers, and system calls. Essential for embedded systems, server administration, and understanding how software interacts with hardware.

**Key Concepts:** Kernel architecture, process management, memory management, file systems, device drivers, system calls, kernel modules, boot process

**Prerequisites:** Phase 0, Phase 1

**Depth:** Deep understanding (foundational for systems work)

**Reference:** The Linux Documentation Project woven throughout

**Projects:** System monitoring tools, kernel module exploration

---

### Phase 10: Docker Containerization and Application Isolation
**File:** `Phase_10_Docker.md`

Containerization concepts and Docker fundamentals. Images, containers, Dockerfiles, volumes, and the container ecosystem. Understanding isolation, portability, and reproducible deployments.

**Key Concepts:** Containerization vs. virtualization, Docker images, Dockerfiles, container lifecycle, volumes, Docker Compose, image optimization

**Prerequisites:** Phase 0, Phase 1, Phase 9

**Depth:** Working knowledge with emphasis on practical deployment patterns

**Projects:** Containerized web application, multi-container system

---

### Phase 11: Docker Networking and Multi-Platform Builds
**File:** `Phase_11_Docker_Advanced.md`

Advanced Docker topics: networking models, multi-container communication, Docker Buildx for cross-platform builds, and production deployment patterns. Understanding how containers communicate and how to build for different architectures.

**Key Concepts:** Docker networking models, bridge networks, overlay networks, Docker Buildx, multi-architecture builds, production networking patterns

**Prerequisites:** Phase 0, Phase 1, Phase 9, Phase 10

**Depth:** Working knowledge

**Projects:** Multi-container application with custom networking, ARM64 builds for Raspberry Pi

---

### Phase 12: Cloud Infrastructure and Deployment with Linode
**File:** `Phase_12_Linode.md`

Cloud infrastructure concepts and deploying applications to Linode. VPS management, server configuration, deployment pipelines, monitoring, and scaling considerations. Understanding the transition from local development to production infrastructure.

**Key Concepts:** VPS management, server configuration, deployment strategies, monitoring, backup strategies, scaling patterns, cost optimization

**Prerequisites:** Phase 0, Phase 1, Phase 9, Phase 10

**Depth:** Working knowledge

**Projects:** Deploy Express.js application to Linode, set up monitoring and backups

---

## Section D: IoT & Embedded Systems

### Phase 13: ESP32 Hardware and Development Fundamentals
**File:** `Phase_13_ESP32.md`

ESP32 microcontroller architecture, capabilities, and development environment. GPIO, ADC, WiFi, Bluetooth, power management, and hardware interfaces. Understanding embedded constraints: memory, power, timing, and reliability.

**Key Concepts:** ESP32 architecture, GPIO programming, ADC reading, WiFi/Bluetooth, power management, hardware interfaces, embedded constraints, debugging techniques

**Prerequisites:** Phase 0, Phase 1, Phase 9

**Depth:** Deep understanding (core technology for capstone)

**Projects:** Basic sensor reading, WiFi connectivity, power monitoring

---

### Phase 14: MicroPython for Embedded Systems
**File:** `Phase_14_MicroPython.md`

MicroPython as a Python runtime for microcontrollers. Differences from standard Python, hardware abstraction, memory management, and optimization strategies. Writing Python code that runs efficiently on resource-constrained devices.

**Key Concepts:** MicroPython runtime, hardware APIs, memory constraints, optimization techniques, REPL debugging, firmware updates, Python vs. MicroPython differences

**Prerequisites:** Phase 0, Phase 1, Phase 13

**Depth:** Deep understanding (primary development language for capstone)

**Projects:** MicroPython sensor nodes, custom hardware drivers

---

### Phase 15: MQTT Messaging Protocol for IoT
**File:** `Phase_15_MQTT.md`

MQTT as a lightweight messaging protocol for IoT systems. Pub/sub patterns, topics, QoS levels, brokers, and reliability patterns. Understanding how distributed sensor networks communicate efficiently.

**Key Concepts:** MQTT protocol, publish/subscribe patterns, topics and wildcards, QoS levels, brokers, retained messages, last will and testament, security

**Prerequisites:** Phase 0, Phase 1, Phase 2, Phase 13

**Depth:** Working knowledge with deep understanding of reliability patterns

**Projects:** MQTT sensor network, broker setup, message routing

---

### Phase 16: ESPHome Configuration and Device Automation
**File:** `Phase_16_ESPHome.md`

ESPHome as a YAML-based configuration system for ESP devices. Sensor definitions, automation rules, OTA updates, and integration patterns. Understanding declarative vs. imperative approaches to embedded programming.

**Key Concepts:** ESPHome YAML configuration, sensor definitions, automation rules, OTA updates, custom components, integration with Home Assistant, declarative automation

**Prerequisites:** Phase 0, Phase 1, Phase 13, Phase 15

**Depth:** Working knowledge

**Projects:** Configure ESP32 sensors via ESPHome, create automation rules

---

### Phase 17: Home Assistant Integration and Local-First Automation
**File:** `Phase_17_Home_Assistant.md`

Home Assistant as a local-first home automation platform. Architecture, integrations, automations, state management, and self-hosting patterns. Building reliable automation systems that work offline and prioritize local control.

**Key Concepts:** Home Assistant architecture, entity model, automations and scripts, integrations, state management, local-first principles, self-hosting, backup and recovery

**Prerequisites:** Phase 0, Phase 1, Phase 13, Phase 15, Phase 16

**Depth:** Working knowledge with emphasis on reliability patterns

**Projects:** Home Assistant setup, custom integrations, complex automations

---

### Phase 18: Capstone - Resilient Off-Grid Homestead Automation System
**File:** `Phase_18_Capstone.md`

Integrating all technologies into a production-ready homestead automation system. ESP32 sensor nodes monitoring temperature, humidity, power usage, and environmental conditions across multiple buildings. Local-first architecture with Home Assistant, MQTT communication, SQLite data storage, and graceful degradation patterns.

**Key Concepts:** System architecture, reliability patterns, failure modes, graceful degradation, manual overrides, data persistence, monitoring and alerting, power management, cold weather operation, physical deployment

**Prerequisites:** All previous phases (especially Phase 13, 14, 15, 17)

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
**Integration:** Referenced throughout web development phases (Phase 2, 3, 4)

Web standards, APIs, and best practices documentation. Used as reference material when learning HTTP, Express.js, and web components.

---

### The Linux Documentation Project
**Integration:** Referenced throughout systems phases (Phase 9, 10, 11, 12)

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
