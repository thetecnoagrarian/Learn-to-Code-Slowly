# Phase 2 · Chapter 2.4: HTTP as Text

HTTP is not abstract.

It is not magical.
It is not hidden.
It is not “what the browser does.”

HTTP is text sent over a connection.

If you understand the text format, everything else becomes mechanical:
	•	Requests stop feeling mysterious
	•	Responses stop feeling opaque
	•	Headers stop feeling like incantations
	•	Debugging becomes inspection, not guessing

This chapter strips HTTP down to its rawest form: lines of text crossing a boundary. Chapter 2.3 defined what HTTP is; this chapter shows the exact format. Whether you're debugging a Pi sensor API or a homestead dashboard—the wire is the same.

## 1) HTTP Is Line-Oriented Text

HTTP messages are composed of lines.

Each line:
	•	Is a sequence of characters
	•	Ends with a line terminator
	•	Has semantic meaning based on position

HTTP is not a blob.
It is not free-form text.
It is structured, line-based text.

That structure is what allows:
	•	Parsers to work
	•	Humans to read
	•	Tools to interoperate

## 2) Line Endings: CRLF, Not Just Newline

HTTP lines end with:

\r\n

This is:
	•	Carriage Return (\r)
	•	Line Feed (\n)

Together: CRLF

This matters because:
	•	It is part of the protocol definition
	•	It defines where a line ends
	•	It defines where headers end
	•	It defines where metadata stops and content begins

Many systems tolerate just \n.
But HTTP itself is defined in terms of CRLF.

## 3) Why CRLF Exists at All

CRLF is historical.

It comes from:
	•	Early network protocols
	•	Cross-platform compatibility
	•	Systems where carriage return and line feed were distinct actions

HTTP inherited this convention.
It kept it for consistency and backward compatibility.

You don’t need to like it.
You just need to recognize it.

## 4) HTTP Messages Are Text Blocks with Structure

Every HTTP message is a block of text with four conceptual parts:
	1.	A start line
	2.	Zero or more header lines
	3.	A blank line
	4.	An optional body

That’s it.

No hidden sections.
No invisible metadata.
No implicit boundaries.

Everything is visible if you look at the raw text.

## 5) The Blank Line Is Not Optional

The blank line is the most important boundary in HTTP.

It is:
	•	Exactly one empty line
	•	Represented by \r\n\r\n
	•	The delimiter between metadata and content

Before the blank line:
	•	Control information
	•	Instructions
	•	Metadata

After the blank line:
	•	Raw content
	•	Payload
	•	The thing being transferred

Confusing this boundary breaks everything.

## 6) Request Messages: The General Shape

A request message looks like this:

```
METHOD path HTTP/version
Header-Name: value
Another-Header: value

[optional body]
```

Concrete example—your dashboard asking the Pi for voltage:

```
GET /api/voltage HTTP/1.1
Host: pi.local
Accept: application/json

```

Visually simple.
Structurally rigid.

Every part has a role.
Every line has meaning.

## 7) The Request Line Comes First

The first line of a request is special.

It is called the request line.

It always contains three parts, separated by spaces:

METHOD path HTTP/version

This line tells the server:
	•	What you want to do
	•	To what resource
	•	Using which version of HTTP

Nothing else in the request makes sense without this line.

## 8) Headers Follow the Request Line

After the request line come headers.

Headers:
	•	Are one per line
	•	Are key–value pairs
	•	Use a colon as a separator

Example:

Host: pi.local
User-Agent: HomesteadDashboard/1.0
Accept: application/json

Headers provide context.
They modify meaning.
They supply metadata.

They do not carry the primary intent—that’s the request line’s job.

## 9) Headers Are Case-Insensitive

Header names are case-insensitive.

These are equivalent:

Content-Type
content-type
CONTENT-TYPE

This matters because:
	•	Different systems format differently
	•	Parsers normalize internally
	•	You should not rely on casing

The protocol defines meaning, not typography.

## 10) Headers Are Not Ordered (Semantically)

Headers appear in an order, but that order does not usually matter.

Meaning is derived from:
	•	Header name
	•	Header value

Not position.

(Some rare exceptions exist, but they are advanced and rare.)

## 11) The End of Headers Is Explicit

Headers end when the server encounters:

\r\n\r\n

That double CRLF means:
	•	One CRLF to end the last header line
	•	One CRLF to represent a blank line

From that point on:
	•	Everything is body
	•	Until the message ends

This explicit boundary is what allows streaming and parsing.

## 12) The Request Body Is Optional

Not all requests have bodies.

Common examples:
	•	GET requests usually do not
	•	POST, PUT, PATCH often do

If a body exists:
	•	It starts immediately after the blank line
	•	It may contain arbitrary bytes
	•	HTTP itself does not interpret it

HTTP only cares that a body exists, not what it means.

## 13) Responses Have the Same Overall Shape

Responses mirror requests structurally.

A response looks like:

```
HTTP/version status_code reason_phrase
Header-Name: value
Another-Header: value

[optional body]
```

Concrete example—the Pi replying with voltage:

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 24

{"voltage": 12.4}
```

Same components.
Same blank line.
Same separation of metadata and content.

The difference is in the start line.

## 14) The Status Line Comes First in Responses

The first line of a response is the status line.

It contains:

HTTP/version status_code reason_phrase

This line tells the client:
	•	Which HTTP version responded
	•	Whether the request succeeded
	•	How to interpret the response

The status line is the server’s primary signal.

## 15) The Reason Phrase Is Informational

The reason phrase (e.g., “OK”, “Not Found”) is:
	•	Human-readable
	•	Optional in meaning
	•	Not machine-critical

Clients rely on:
	•	The numeric status code
	•	Not the text phrase

The phrase exists for readability, not logic.

## 16) Response Headers Follow the Status Line

After the status line come headers.

These headers:
	•	Describe the body
	•	Control caching
	•	Set cookies
	•	Signal content type
	•	Modify client behavior

Just like request headers, they are:
	•	One per line
	•	Key–value pairs
	•	Case-insensitive

## 17) The Response Body Is Optional

Not all responses have bodies.

Examples:
	•	204 No Content has no body
	•	304 Not Modified has no body
	•	Some error responses include bodies, some don’t

The presence of a body is defined by:
	•	Status code
	•	Headers
	•	Context

Again: HTTP defines structure, not meaning.

## 18) HTTP Does Not Care What the Body Contains

This is crucial.

HTTP does not understand:
	•	HTML
	•	JSON
	•	Images
	•	Binary data

HTTP only:
	•	Transfers bytes
	•	Labels them via headers
	•	Delivers them intact

Meaning lives above HTTP.

This separation is intentional.

## 19) Content Is Interpreted by the Client

The client decides:
	•	How to parse the body
	•	How to render it
	•	How to decode it

Based on headers like:
	•	Content-Type
	•	Content-Encoding

HTTP itself remains neutral.

## 20) Seeing HTTP as a Boundary

Reconnect to Phase 0.8.

HTTP messages are boundary crossings.
	•	Request: client → server
	•	Response: server → client

The text format is:
	•	The contract
	•	The validation surface
	•	The explicit interface

Nothing crosses implicitly.
Everything is written down.

## 21) Why This Mental Model Matters

If you understand HTTP as text:
	•	You stop blaming “the network” blindly
	•	You can read raw logs
	•	You can debug with curl
	•	You can reason about failures
	•	You can build servers from scratch if needed

Abstractions become optional, not required.

## 22) What Libraries Hide (And Why You Still Need This)

Libraries:
	•	Assemble request lines for you
	•	Add headers automatically
	•	Parse responses into objects

That’s useful.

But when something goes wrong:
	•	You debug the raw text
	•	You inspect the wire format
	•	You reason about boundaries

Understanding the text keeps you grounded.

## 23) Mental Checklist for Any HTTP Message

When you see raw HTTP, ask:
	1.	What is the start line?
	2.	Where do headers end?
	3.	Is there a body?
	4.	What headers describe that body?
	5.	What crossed the boundary?

This checklist works for:
	•	Requests
	•	Responses
	•	Logs
	•	Proxies
	•	Debug traces

## Reflection

Think about a real exchange—your dashboard fetching from the Pi, or curl hitting an API.
	•	Can you identify the CRLFs?
	•	Can you find the blank line?
	•	Can you separate headers from body?
	•	Can you explain each line’s role?

Consider failure modes:
	•	The response body is HTML but Content-Type says application/json. The structure is valid HTTP—the semantics are wrong. Parse with care.
	•	A header is malformed (missing colon). The parser breaks at the blank line. Knowing the format helps you pinpoint where.

If yes, HTTP will never feel opaque again.

## Core Understanding

HTTP is:
	•	Plain text
	•	Line-based
	•	Explicitly structured
	•	Separated by CRLF
	•	Divided into start line, headers, blank line, and body

Everything else builds on this.

This chapter builds on Chapter 2.3 (what HTTP is). Next: Chapter 2.5 — Statelessness and Connection Lifecycle, where we add the time dimension: how requests relate over time, what a connection means, and why statelessness changes everything.