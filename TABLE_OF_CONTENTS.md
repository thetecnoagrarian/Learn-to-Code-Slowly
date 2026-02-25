# Learning Plan: Programming & Systems Curriculum

Concept-first curriculum for resilient off-grid homestead automation. Phases build on previous chapters.

## Recommended Sequence

- **Section A:** Phase 1 Conceptual Foundations → Phase 2 Python → Phase 3 Git
- **Section B:** Phase 1 HTTP → Phase 2 HTML → Phase 3 JavaScript → Phase 4 Node/npm/JSON → Phase 5 Express → Phase 6 Testing → Phase 7 CSS → Phase 8 DOM → Phase 9 Shoelace → Phase 10 TypeScript
- **Section C:** Phase 1 SQL → Phase 2 SQLite → Phase 3 MySQL → Phase 4 better-sqlite3
- **Section D:** Phase 1 Linux → Phase 2 Docker → Phase 3 Docker Advanced → Phase 4 Linode
- **Section E:** Phase 1 ESP32 → Phase 2 MicroPython → Phase 3 MQTT → Phase 4 ESPHome → Phase 5 Home Assistant → Phase 6 Capstone

Phases build in order; sections can be explored in parallel after Section A.

## Section A: Foundations

### Phase 1: Conceptual Foundations — `Section_A/Phase_1/`
- **Ch 01.01:** What Programs Are (`Chapter_1.01_What_Programs_Are.md`)
- **Ch 01.02:** Conditions and Branching (`Chapter_1.02_Conditions_and_Branching.md`)
- **Ch 01.03:** Loops and Repetition (`Chapter_1.03_Loops_and_Repetition.md`)
- **Ch 01.04:** Functions and Behavior (`Chapter_1.04_Functions_and_Behavior.md`)
- **Ch 01.05:** Data and Variables (`Chapter_1.05_Data_and_Variables.md`)
- **Ch 01.06:** Errors and Failure (`Chapter_1.06_Errors_and_Failure.md`)
- **Ch 01.07:** Time and State Changes (`Chapter_1.07_Time_and_State_Changes.md`)
- **Ch 01.08:** Boundaries (`Chapter_1.08_Boundaries.md`)
- **Ch 01.09:** Invariants (`Chapter_1.09_Invariants.md`)
- **Ch 01.10:** Failure Is Normal (`Chapter_1.10_Failure_Is_Normal.md`)
- **Ch 01.11:** Abstraction and Naming (`Chapter_1.11_Abstraction_and_Naming.md`)
- **Ch 01.12:** Observation vs Action (`Chapter_1.12_Observation_vs_Action.md`)
- **Ch 01.13:** Complexity Grows Sideways (`Chapter_1.13_Complexity_Grows_Sideways.md`)
- **Ch 01.14:** Putting the System Together (`Chapter_1.14_Putting_the_System_Together.md`)
- **Ch 01.15:** Consolidation (`Chapter_1.15_Consolidation.md`)

### Phase 2: Python Fundamentals — `Section_A/Phase_2/` *(In Progress)*
- **Ch 02.01:** What a Python Program Is (`Chapter_2.1_What_a_Python_Program_Is.md`)
- **Ch 02.02:** State and Variables (`Chapter_2.2_State_and_Variables.md`)
- **Ch 02.03:** Conditions and Branching (`Chapter_2.3_Conditions_and_Branching.md`)
- **Ch 02.04:** Loops and Repetition (`Chapter_2.4_Loops_and_Repetition.md`)
- **Ch 02.05:** Functions as Named Behavior (`Chapter_2.5_Functions_as_Named_Behavior.md`)
- **Ch 02.06:** Scope and Isolation (`Chapter_2.6_Scope_and_Isolation.md`)
- **Ch 02.07:** Data Types (`Chapter_2.7_Data_Types_as_Categories_of_Meaning.md`)
- **Ch 02.08:** Truthiness and Explicit Checks (`Chapter_2.8_Truthiness_and_Explicit_Checks.md`)
- **Ch 02.09:** Collections and Grouped State (`Chapter_2.9_Collections_and_Grouped_State.md`)
- **Ch 02.10:** Dictionaries and Named Systems (`Chapter_2.10_Dictionaries_and_Named_Systems.md`)
- **Ch 02.11:** Input, Output, and Boundaries (`Chapter_2.11_Input_Output_and_Boundaries.md`)
- **Ch 02.12:** Errors and Exceptions (`Chapter_2.12_Errors_and_Exceptions.md`)
- **Ch 02.13:** Persistence and State (`Chapter_2.13_Persistence_and_State.md`)
- **Ch 02.14:** Modules and Program Structure (`Chapter_2.14_Modules_and_Program_Structure.md`)
- **Ch 02.15:** Assembling a Living System (`Chapter_2.15_Assembling_a_Living_System.md`)

### Phase 3: Git and Version Control — `Section_A/Phase_3/`
- **Ch 03.01:** What Version Control Is (`Chapter_3.1_What_Version_Control_Is.md`)
- **Ch 03.02:** Repositories and Working Tree (`Chapter_3.2_Repositories_and_Working_Tree.md`)
- **Ch 03.03:** Commits as Snapshots (`Chapter_3.3_Commits_as_Snapshots.md`)
- **Ch 03.04:** Branches (`Chapter_3.4_Branches.md`)
- **Ch 03.05:** Merging (`Chapter_3.5_Merging.md`)
- **Ch 03.06:** Remotes and Collaboration (`Chapter_3.6_Remotes_and_Collaboration.md`)
- **Ch 03.07:** Rebasing (`Chapter_3.7_Rebasing.md`)
- **Ch 03.08:** Stashing (`Chapter_3.8_Stashing.md`)
- **Ch 03.09:** .gitignore (`Chapter_3.9_Gitignore.md`)
- **Ch 03.10:** Undoing and Recovering (`Chapter_3.10_Undoing_and_Recovering.md`)
- **Ch 03.11:** Tags and Releases (`Chapter_3.11_Tags_and_Releases.md`)
- **Ch 03.12:** Git in Workflow (`Chapter_3.12_Git_in_Workflow.md`)
- **Ch 03.13:** Git vs GitHub (`Chapter_3.13_Git_vs_GitHub.md`)
- **Ch 03.14:** GitHub Workflows (`Chapter_3.14_GitHub_Workflows.md`)

## Section B: Web Development & Networking

### Phase 1: HTTP Protocol — `Section_B/Phase_1/`
- **Ch 01.01:** Client-Server and Request-Response (`Chapter_1.01_Client_Server_and_Request_Response.md`)
- **Ch 01.02:** Where HTTP Lives (`Chapter_1.02_Where_HTTP_Lives.md`)
- **Ch 01.03:** What HTTP Is (`Chapter_1.03_What_HTTP_Is.md`)
- **Ch 01.04:** HTTP as Text (`Chapter_1.04_HTTP_as_Text.md`)
- **Ch 01.05:** Statelessness and Connection Lifecycle (`Chapter_1.05_Statelessness_and_Connection_Lifecycle.md`)
- **Ch 01.06:** Request Structure (`Chapter_1.06_Request_Structure.md`)
- **Ch 01.07:** The Request Line (`Chapter_1.07_The_Request_Line.md`)
- **Ch 01.08:** Response Structure (`Chapter_1.08_Response_Structure.md`)
- **Ch 01.09:** Status Codes Overview (`Chapter_1.09_Status_Codes_Overview.md`)
- **Ch 01.10:** Status Codes: Success and Redirects (`Chapter_1.10_Status_Codes_Success_and_Redirects.md`)
- **Ch 01.11:** Status Codes: Client and Server Errors (`Chapter_1.11_Status_Codes_Client_and_Server_Errors.md`)
- **Ch 01.12:** Errors vs Failures (`Chapter_1.12_Errors_vs_Failures.md`)
- **Ch 01.13:** HTTP Methods (`Chapter_1.13_HTTP_Methods.md`)
- **Ch 01.14:** Safety and Idempotency (`Chapter_1.14_Safety_and_Idempotency.md`)
- **Ch 01.15:** Headers Overview (`Chapter_1.15_Headers_Overview.md`)
- **Ch 01.16:** Headers: Content and Type (`Chapter_1.16_Headers_Content_and_Type.md`)
- **Ch 01.17:** Headers: Caching and Control (`Chapter_1.17_Headers_Caching_and_Control.md`)
- **Ch 01.18:** URLs, Paths, Query Strings (`Chapter_1.18_URLs_Paths_and_Query_Strings.md`)
- **Ch 01.19:** Request Bodies and Content Types (`Chapter_1.19_Request_Bodies_and_Content_Types.md`)
- **Ch 01.20:** Cookies and Session State (`Chapter_1.20_Cookies_and_Session_State.md`)
- **Ch 01.21:** Trust Boundaries and Security (`Chapter_1.21_Trust_Boundaries_and_Security_Surfaces.md`)
- **Ch 01.22:** Redirects and Location (`Chapter_1.22_Redirects_and_Location.md`)
- **Ch 01.23:** REST Principles (`Chapter_1.23_REST_Principles.md`)
- **Ch 01.24:** Seeing HTTP in the Wild (`Chapter_1.24_Seeing_HTTP_in_the_Wild.md`)

### Phase 2: HTML Fundamentals — `Section_B/Phase_2/`
- **Ch 02.01:** What HTML Is (`Chapter_2.01_What_HTML_Is.md`)
- **Ch 02.02:** Document Structure and DOCTYPE (`Chapter_2.02_Document_Structure.md`)
- **Ch 02.03:** The Head — Meta, Title, Linked Resources (`Chapter_2.03_The_Head_Meta_Title_and_Linked_Resources.md`)
- **Ch 02.04:** Text and Headings (`Chapter_2.04_Text_and_Headings.md`)
- **Ch 02.05:** Paragraphs and Inline Text (`Chapter_2.05_Paragraphs_and_Inline_Text.md`)
- **Ch 02.06:** Links and Anchors (`Chapter_2.06_Links_and_Anchors.md`)
- **Ch 02.07:** Lists (`Chapter_2.07_Lists.md`)
- **Ch 02.08:** Images and Media (`Chapter_2.08_Images_and_Media.md`)
- **Ch 02.09:** Audio, Video, Embedded Content (`Chapter_2.09_Audio_Video_and_Embedded_Content.md`)
- **Ch 02.10:** Tables (`Chapter_2.10_Tables.md`)
- **Ch 02.11:** Forms — Structure and Input Types (`Chapter_2.11_Forms_Structure.md`)
- **Ch 02.12:** Forms — Select, Textarea, Buttons (`Chapter_2.12_Forms_Select_Textarea_Buttons.md`)
- **Ch 02.13:** Forms — Validation and Submission (`Chapter_2.13_Forms_Validation_and_Submission.md`)
- **Ch 02.14:** Semantic HTML and Landmarks (`Chapter_2.14_Semantic_HTML.md`)
- **Ch 02.15:** Sections, Articles, Document Outline (`Chapter_2.15_Sections_Articles_and_the_Document_Outline.md`)
- **Ch 02.16:** Div and Span (`Chapter_2.16_Div_and_Span.md`)
- **Ch 02.17:** Attributes — class, id, data-* (`Chapter_2.17_Attributes.md`)
- **Ch 02.18:** ARIA and Accessibility (`Chapter_2.18_ARIA_and_Accessibility_Attributes.md`)
- **Ch 02.19:** Character Entities and Encoding (`Chapter_2.19_Character_Entities.md`)
- **Ch 02.20:** Block and Inline (`Chapter_2.20_Block_and_Inline.md`)
- **Ch 02.21:** Script, Style, Iframe (`Chapter_2.21_Script_Style_and_Iframe.md`)
- **Ch 02.22:** HTML and HTTP (`Chapter_2.22_HTML_and_HTTP.md`)
- **Ch 02.23:** Validation and Best Practices (`Chapter_2.23_Validation_and_Best_Practices.md`)
- **Ch 02.24:** HTML in Practice (`Chapter_2.24_HTML_in_Practice.md`)

### Phase 3: JavaScript — `Section_B/Phase_3/`
- **Ch 03.01:** What JavaScript Is (`Chapter_3.1_What_JavaScript_Is.md`)
- **Ch 03.02:** Variables and Declarations (`Chapter_3.2_Variables.md`)
- **Ch 03.03:** Types and Values (`Chapter_3.3_Types_and_Values.md`)
- **Ch 03.04:** Operators and Expressions (`Chapter_3.4_Operators.md`)
- **Ch 03.05:** Conditions and Branching (`Chapter_3.5_Conditions.md`)
- **Ch 03.06:** Loops and Iteration (`Chapter_3.6_Loops.md`)
- **Ch 03.07:** Functions (`Chapter_3.7_Functions.md`)
- **Ch 03.08:** Scope and Closures (`Chapter_3.8_Scope_and_Closures.md`)
- **Ch 03.09:** Objects (`Chapter_3.9_Objects.md`)
- **Ch 03.10:** Arrays (`Chapter_3.10_Arrays.md`)
- **Ch 03.11:** Strings and Template Literals (`Chapter_3.11_Strings.md`)
- **Ch 03.12:** Error Handling (`Chapter_3.12_Error_Handling.md`)
- **Ch 03.13:** Async — Callbacks and Promises (`Chapter_3.13_Async_Callbacks_Promises.md`)
- **Ch 03.14:** Async — async/await (`Chapter_3.14_Async_Await.md`)
- **Ch 03.15:** Modules (`Chapter_3.15_Modules.md`)
- **Ch 03.16:** JSON in JavaScript (`Chapter_3.16_JSON_in_JavaScript.md`)
- **Ch 03.17:** Array Methods and Iteration (`Chapter_3.17_Array_Methods_and_Iteration.md`)
- **Ch 03.18:** Template Literals and Interpolation (`Chapter_3.18_Template_Literals.md`)
- **Ch 03.19:** Throwing and Custom Errors (`Chapter_3.19_Throwing_and_Custom_Errors.md`)
- **Ch 03.20:** Strict Mode and Robust Code (`Chapter_3.20_Strict_Mode_and_Robust_Code.md`)
- **Ch 03.21:** Debugging and the Console (`Chapter_3.21_Debugging_and_Console.md`)
- **Ch 03.22:** Expressions, Statements, and Program Flow (`Chapter_3.22_Expressions_Statements_and_Program_Flow.md`)
- **Ch 03.23:** JavaScript in Practice (`Chapter_3.23_JavaScript_in_Practice.md`)
- **Ch 03.24:** From Script to Application (`Chapter_3.24_From_Script_to_Application.md`)
- **Ch 03.25:** Phase 3 Recap (`Chapter_3.25_Phase_3_Recap.md`)

### Phase 4: Node.js, npm, JSON — `Section_B/Phase_4/`
- **Ch 04.01:** What Node.js Is (`Chapter_4.1_What_Node_Is.md`)
- **Ch 04.02:** Running Node and REPL (`Chapter_4.2_Running_Node.md`)
- **Ch 04.03:** path and fs (`Chapter_4.3_Path_and_Fs.md`)
- **Ch 04.04:** http and Streams (`Chapter_4.4_Http_and_Streams.md`)
- **Ch 04.05:** process and Buffer (`Chapter_4.5_Process_and_Buffer.md`)
- **Ch 04.06:** Event Loop (`Chapter_4.6_Event_Loop.md`)
- **Ch 04.07:** npm — Package Management (`Chapter_4.7_npm.md`)
- **Ch 04.08:** npm — Installing Packages (`Chapter_4.8_npm_Installing.md`)
- **Ch 04.09:** JSON Syntax (`Chapter_4.9_JSON_Syntax.md`)
- **Ch 04.10:** JSON Parse/Stringify (`Chapter_4.10_JSON_Parse_Stringify.md`)
- **Ch 04.11:** Environment and Config (`Chapter_4.11_Environment_Config.md`)
- **Ch 04.12:** Node and HTTP (`Chapter_4.12_Node_Raw_HTTP.md`)

### Phase 5: Express.js — `Section_B/Phase_5/`
- **Ch 03.01:** What Express Is (`Chapter_3.1_What_Express_Is.md`)
- **Ch 03.02:** Minimal Server (`Chapter_3.2_Minimal_Server.md`)
- **Ch 03.03:** Request and Response Objects (`Chapter_3.3_Request_and_Response_Objects.md`)
- **Ch 03.04:** Routing Fundamentals (`Chapter_3.4_Routing_Fundamentals.md`)
- **Ch 03.05:** Params and Query (`Chapter_3.5_Params_and_Query.md`)
- **Ch 03.06:** Sending Responses (`Chapter_3.6_Sending_Responses.md`)
- **Ch 03.07:** Middleware (`Chapter_3.7_Middleware.md`)
- **Ch 03.08:** Body Parsing (`Chapter_3.8_Body_Parsing.md`)
- **Ch 03.09:** Error Handling (`Chapter_3.9_Error_Handling.md`)
- **Ch 03.10:** Static Files (`Chapter_3.10_Static_Files.md`)
- **Ch 03.11:** Templating and SSR (`Chapter_3.11_Templating.md`)
- **Ch 03.11a:** EJS Deep Dive (`Chapter_3.11a_EJS_Deep_Dive.md`)
- **Ch 03.11b:** Handlebars Deep Dive (`Chapter_3.11b_Handlebars_Deep_Dive.md`)
- **Ch 03.12:** RESTful API Design (`Chapter_3.12_REST_APIs.md`)
- **Ch 03.13:** Validation at Boundary (`Chapter_3.13_Validation.md`)
- **Ch 03.14:** Authentication Basics (`Chapter_3.14_Authentication.md`)
- **Ch 03.15:** State and Persistence (`Chapter_3.15_Persistence.md`)
- **Ch 03.16:** Environment and Configuration (`Chapter_3.16_Configuration.md`)
- **Ch 03.17:** Async in Express (`Chapter_3.17_Async_and_Await.md`)
- **Ch 03.18:** Modularizing Express (`Chapter_3.18_Modularization.md`)
- **Ch 03.19:** Logging (`Chapter_3.19_Logging.md`)
- **Ch 03.20:** Building a Complete API (`Chapter_3.20_Complete_API.md`)
- **Ch 03.21:** Deployment (`Chapter_3.21_Deployment.md`)
- **Ch 03.22:** Security Surfaces (`Chapter_3.22_Security.md`)
- **Ch 03.23:** Performance and Scaling (`Chapter_3.23_Performance.md`)
- **Ch 03.24:** Living Express System (`Chapter_3.24_Living_System.md`)

### Phase 6: Testing — `Section_B/Phase_6/`
- **Ch 06.01:** Why We Test (`Chapter_6.1_Why_We_Test.md`)
- **Ch 06.02:** Unit vs Integration vs E2E (`Chapter_6.2_Unit_Integration_E2E.md`)
- **Ch 06.03:** Test Runners (`Chapter_6.3_Test_Runners.md`)
- **Ch 06.04:** Assertions (`Chapter_6.4_Assertions.md`)
- **Ch 06.05:** Mocking and Stubs (`Chapter_6.5_Mocking.md`)
- **Ch 06.06:** Testing Express Routes (`Chapter_6.6_Testing_Express_Routes.md`)
- **Ch 06.07:** Testing Async and Errors (`Chapter_6.7_Testing_Async_Errors.md`)
- **Ch 06.08:** Test Data and Fixtures (`Chapter_6.8_Test_Data_Fixtures.md`)
- **Ch 06.09:** Coverage (`Chapter_6.9_Coverage.md`)
- **Ch 06.10:** Testing in Workflow (`Chapter_6.10_Testing_in_Workflow.md`)

### Phase 7: CSS — `Section_B/Phase_7/`
- **Ch 04.01:** What CSS Is (`Chapter_4.1_What_CSS_Is.md`)
- **Ch 04.02:** Selectors (`Chapter_4.2_Selectors.md`)
- **Ch 04.03:** Specificity and Cascade (`Chapter_4.3_Specificity_and_Cascade.md`)
- **Ch 04.04:** Box Model (`Chapter_4.4_Box_Model.md`)
- **Ch 04.05:** Display and Layout (`Chapter_4.5_Display_and_Layout.md`)
- **Ch 04.06:** Flexbox (`Chapter_4.6_Flexbox.md`)
- **Ch 04.07:** CSS Grid (`Chapter_4.7_Grid.md`)
- **Ch 04.08:** Units and Sizing (`Chapter_4.8_Units_and_Sizing.md`)
- **Ch 04.09:** Typography (`Chapter_4.9_Typography.md`)
- **Ch 04.10:** Color (`Chapter_4.10_Color.md`)
- **Ch 04.11:** Spacing and Layout (`Chapter_4.11_Spacing_and_Layout.md`)
- **Ch 04.12:** Responsive Design (`Chapter_4.12_Responsive_Design.md`)
- **Ch 04.13:** Pseudo-classes and Pseudo-elements (`Chapter_4.13_Pseudo_Classes_and_Elements.md`)
- **Ch 04.14:** Transitions and Animation (`Chapter_4.14_Transitions_and_Animation.md`)
- **Ch 04.15:** Custom Properties (`Chapter_4.15_Custom_Properties.md`)
- **Ch 04.16:** Inheritance (`Chapter_4.16_Inheritance.md`)
- **Ch 04.17:** Debugging CSS (`Chapter_4.17_Debugging_CSS.md`)
- **Ch 04.18:** CSS and Accessibility (`Chapter_4.18_CSS_and_Accessibility.md`)
- **Ch 04.19:** Dashboard Layout (`Chapter_4.19_Dashboard_Layout.md`)

### Phase 8: DOM and Browser JavaScript — `Section_B/Phase_8/`
- **Ch 08.01:** What the DOM Is (`Chapter_8.1_What_the_DOM_Is.md`)
- **Ch 08.02:** Selecting Elements (`Chapter_8.2_Selecting_Elements.md`)
- **Ch 08.03:** Traversing and Modifying (`Chapter_8.3_Traversing_and_Modifying.md`)
- **Ch 08.04:** Attributes and Properties (`Chapter_8.4_Attributes_and_Properties.md`)
- **Ch 08.05:** Events — Listening (`Chapter_8.5_Events_Listening.md`)
- **Ch 08.06:** Events — Bubbling and Delegation (`Chapter_8.6_Events_Bubbling_Delegation.md`)
- **Ch 08.07:** Fetch (`Chapter_8.7_Fetch.md`)
- **Ch 08.08:** Script Loading (`Chapter_8.8_Script_Loading.md`)
- **Ch 08.09:** Forms and DOM (`Chapter_8.9_Forms_and_DOM.md`)
- **Ch 08.10:** DOM and CSS (`Chapter_8.10_DOM_and_CSS.md`)
- **Ch 08.11:** Debugging the DOM (`Chapter_8.11_Debugging_DOM.md`)
- **Ch 08.12:** DOM in Workflow (`Chapter_8.12_DOM_in_Workflow.md`)

### Phase 9: Web Components (Shoelace) — `Section_B/Phase_9/`
- Phase file: `Phase_9_Shoelace.md`

### Phase 10: TypeScript — `Section_B/Phase_10/`
- **Ch 10.01:** What TypeScript Is (`Chapter_10.1_What_TypeScript_Is.md`)
- **Ch 10.02:** Basic Types (`Chapter_10.2_Basic_Types.md`)
- **Ch 10.03:** Interfaces and Type Aliases (`Chapter_10.3_Interfaces_and_Types.md`)
- **Ch 10.04:** Functions and Signatures (`Chapter_10.4_Functions.md`)
- **Ch 10.05:** Generics Basics (`Chapter_10.5_Generics_Basics.md`)
- **Ch 10.06:** Union and Literal Types (`Chapter_10.6_Unions_and_Literals.md`)
- **Ch 10.07:** Classes and Types (`Chapter_10.7_Classes.md`)
- **Ch 10.08:** Strictness and Config (`Chapter_10.8_Strictness_Config.md`)
- **Ch 10.09:** TypeScript with Node and Express (`Chapter_10.9_TS_with_Node_Express.md`)
- **Ch 10.10:** Typing JSON and APIs (`Chapter_10.10_Typing_JSON_APIs.md`)
- **Ch 10.11:** TypeScript Frontend (Optional) (`Chapter_10.11_TS_Frontend.md`)
- **Ch 10.12:** TypeScript in Workflow (`Chapter_10.12_TS_in_Workflow.md`)

## Section C: Databases & Data Storage

- **Phase 1:** SQL Foundations — `Section_C/Phase_1/Phase_1_SQL_Foundations.md`
- **Phase 2:** SQLite — `Section_C/Phase_2/Phase_2_SQLite.md`
- **Phase 3:** MySQL — `Section_C/Phase_3/Phase_3_MySQL.md`
- **Phase 4:** better-sqlite3 & Node — `Section_C/Phase_4/Phase_4_better_sqlite3.md`

## Section D: Systems & Infrastructure

- **Phase 1:** Linux Kernel — `Section_D/Phase_1/Phase_1_Linux_Kernel.md`
- **Phase 2:** Docker — `Section_D/Phase_2/Phase_2_Docker.md`
- **Phase 3:** Docker Advanced — `Section_D/Phase_3/Phase_3_Docker_Advanced.md`
- **Phase 4:** Linode — `Section_D/Phase_4/Phase_4_Linode.md`

## Section E: IoT & Embedded

- **Phase 1:** ESP32 — `Section_E/Phase_1/Phase_1_ESP32.md`
- **Phase 2:** MicroPython — `Section_E/Phase_2/Phase_2_MicroPython.md`
- **Phase 3:** MQTT — `Section_E/Phase_3/Phase_3_MQTT.md`
- **Phase 4:** ESPHome — `Section_E/Phase_4/Phase_4_ESPHome.md`
- **Phase 5:** Home Assistant — `Section_E/Phase_5/Phase_5_Home_Assistant.md`
- **Phase 6:** Capstone — `Section_E/Phase_6/Phase_6_Capstone.md`

## Reference

- **MDN:** Section B (HTTP, HTML, JS, CSS, DOM). **Linux Doc Project:** Section D.

## Notes

Concept-first, depth-over-speed. Phases reference related concepts; homestead examples throughout. Living document.
