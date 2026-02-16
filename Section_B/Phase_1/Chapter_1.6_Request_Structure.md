# Phase 2 · Chapter 2.6: Request Structure

Every HTTP request has structure.

Not “conceptual structure.”
Not “framework structure.”
Literal, byte-level structure.

If you strip away browsers, libraries, frameworks, and tooling, what remains is a text message with a precise layout. Servers do not guess. They do not infer intent. They parse text in a fixed order.

This chapter breaks that structure down until nothing is mysterious. Chapter 2.1 established request-response. Chapter 2.2 showed HTTP on TCP. Chapter 2.3 defined what HTTP is. Chapter 2.4 showed the text format. Chapter 2.5 added statelessness and connection lifecycle. This chapter dissects the request structure itself. Whether you're building a Pi sensor API, a coop controller, or a solar logger—the request structure is the same.


## 1) A Request Is a Message, Not an Action

An HTTP request is not an action.
It does not do anything by itself.

It is a message that describes:
	•	What the client wants
	•	Where it wants it
	•	How the server should interpret the message

The server decides what to do with that message.


## 2) The Four Parts of an HTTP Request

Every HTTP request consists of exactly four conceptual parts, always in this order:
	1.	Request line
	2.	Headers
	3.	Blank line
	4.	Optional body

If you understand this order, you can read or construct any HTTP request by hand.


## 3) The Order Is Not Optional

Servers parse requests sequentially.

They expect:
	•	The request line first
	•	Headers next
	•	A blank line
	•	Then the body (if any)

If this order is violated, the request is malformed.

HTTP is forgiving in some places.
It is unforgiving about structure.


## 4) The Request Line Comes First, Always

The very first line of an HTTP request is the request line.

Example:

```
GET /api/temp HTTP/1.1
```

This line:
	•	Must be first
	•	Must be complete
	•	Must end with CRLF (`\r\n`)

The server cannot parse anything else until this line is read. Your dashboard might send `GET /api/voltage HTTP/1.1` to the Pi, or your ESP32 might send `GET /api/fence_status HTTP/1.1` to the coop controller. Same structure.


## 5) What the Request Line Communicates

The request line answers three questions immediately:
	1.	What action is requested? (method)
	2.	What resource is targeted? (path)
	3.	What protocol rules apply? (HTTP version)

Nothing else in the request makes sense without this context.


## 6) Headers Come Second

After the request line come headers.

Headers are metadata.
They describe the request, not the resource.

Headers answer questions like:
	•	Who is making the request? (`User-Agent: HomesteadDashboard/1.0`)
	•	What formats are acceptable? (`Accept: application/json`)
	•	How long is the body? (`Content-Length: 28`)
	•	Is authentication provided? (`Authorization: Bearer token123`)
	•	Should the connection stay open? (`Connection: keep-alive`)


## 7) Headers Are Optional, But Usually Present

Technically, a request can have zero headers.

Practically:
	•	HTTP/1.1 requires at least `Host` (e.g., `Host: pi.local`)
	•	Most real requests include many headers (auth, content-type, user-agent)
	•	Browsers send dozens by default
	•	Your ESP32 sensor might send just `Host` and `Authorization`

Servers must be prepared for:
	•	Missing headers
	•	Extra headers
	•	Unknown headers


## 8) Header Syntax Is Strict

Each header is exactly:

```
Header-Name: value
```

Examples:
```
Host: pi.local
Authorization: Bearer sensor_token_123
Content-Type: application/json
```

Important rules:
	•	One header per line
	•	Colon separates name and value (exactly one space after colon is conventional)
	•	Header names are case-insensitive (`Host` = `host` = `HOST`)
	•	Values may contain spaces
	•	Lines end with CRLF (`\r\n`)

There is no indentation.
There is no hierarchy.
It is flat text.


## 9) Headers Are Not Ordered (Conceptually)

Although headers appear in an order, servers must not rely on header order.

You cannot assume:
	•	`Authorization` comes before `Content-Type`
	•	`Content-Length` comes last
	•	Custom headers (like `X-Device-ID: esp32_coop`) appear anywhere specific

Headers are a set, not a sequence. Your Pi server must find `Authorization` regardless of where it appears—first header, last header, or somewhere in between.


## 10) The Blank Line Is Mandatory

After the last header, there is one blank line.

This blank line is not decoration.
It is a delimiter.

It signals:

“Headers are finished. Body may follow.”

The blank line is exactly:

```
\r\n
```

with no header before it. In raw bytes: `0x0D 0x0A` (carriage return, line feed). This is the boundary between metadata and content.


## 11) Why the Blank Line Exists

HTTP needs a way to distinguish:
	•	Metadata (headers)
	•	Content (body)

The blank line is that boundary.

Without it:
	•	The server cannot know where headers stop
	•	The body cannot be parsed correctly

This is a Phase 0 boundary again.


## 12) The Body Is Optional

Not all requests have a body.

Typical patterns:
	•	GET → no body (e.g., `GET /api/voltage` fetches data)
	•	POST → body (e.g., `POST /api/temp` sends sensor reading)
	•	PUT → body (e.g., `PUT /api/config` updates settings)
	•	PATCH → body (e.g., `PATCH /api/fence` updates fence status)
	•	DELETE → sometimes body, often not

The presence of a body depends on the method and headers. Your dashboard might GET voltage (no body) but POST a temperature reading (with body).


## 13) The Body Is Raw Data

The body is:
	•	Not parsed by HTTP itself
	•	Not structured by the protocol
	•	Just bytes

HTTP only knows:
	•	Whether a body exists
	•	How long it is
	•	How to hand it off

The meaning of the body is determined by headers.


## 14) Content-Length Tells the Server How Much to Read

When a body exists, the server needs to know how many bytes to read.

This is usually done with:

```
Content-Length: 28
```

The server:
	•	Reads exactly 28 bytes
	•	No more
	•	No less

Example: Your ESP32 sends `{"device":"esp32_coop","temp":72.5}` (28 bytes). The server reads exactly 28 bytes, then stops. Reading too much or too little corrupts the next request—if the server reads 30 bytes, it will try to parse 2 bytes of the next request as part of this body.


## 15) Transfer-Encoding Is an Alternative

Sometimes, instead of Content-Length, the request uses:

Transfer-Encoding: chunked

This means:
	•	The body is sent in chunks
	•	Each chunk declares its own size
	•	The end is explicitly marked

This is more complex and comes later.
For now, know it exists.


## 16) A Complete Minimal Request

Here is a complete, minimal HTTP/1.1 request:

GET /api/voltage HTTP/1.1
Host: pi.local

Let’s analyze it:
	•	Request line: present
	•	Header: Host
	•	Blank line: present
	•	Body: none

This is valid.


## 17) A Request With a Body

Now a POST request—your ESP32 sensor reporting temperature:

```
POST /api/temp HTTP/1.1
Host: coop.local
Content-Type: application/json
Content-Length: 28
Authorization: Bearer sensor_token_123

{"device":"esp32_coop","temp":72.5}
```

Structure:
	•	Request line: `POST /api/temp HTTP/1.1` (method POST, path `/api/temp`, version HTTP/1.1)
	•	Headers: `Host`, `Content-Type`, `Content-Length`, `Authorization` (all metadata)
	•	Blank line: `\r\n` (separates headers from body)
	•	Body: `{"device":"esp32_coop","temp":72.5}` (exactly 28 bytes, as declared)

Every part has a job. The server reads the request line, parses headers, finds the blank line, then reads exactly 28 bytes for the body.


## 18) Why Servers Parse in This Order

Servers read requests like this:
	1.	Read until CRLF → request line
	2.	Read header lines until blank line
	3.	Inspect headers
	4.	Decide whether to read a body
	5.	Read exactly what is declared

There is no guessing.
There is no scanning ahead.


## 19) What Happens If the Blank Line Is Missing

If the blank line is missing:
	•	The server keeps reading headers
	•	The body is never recognized
	•	The request hangs or fails

Example: Your ESP32 sends `POST /api/temp HTTP/1.1\r\nHost: coop.local\r\n{"temp":72.5}` (no blank line). The server reads `Host: coop.local` as a header, then sees `{"temp":72.5}` and tries to parse it as another header. It fails—no colon, malformed. This is a classic bug when hand-crafting requests.


## 20) What Happens If Content-Length Is Wrong

If Content-Length is too small:
	•	The body is truncated
	•	Data is lost

Example: Your ESP32 sends `Content-Length: 20` but the body is actually 28 bytes (`{"device":"esp32_coop","temp":72.5}`). The server reads 20 bytes (`{"device":"esp32_coop"`) and stops. The rest (`,"temp":72.5}`) is lost, and the next request starts mid-body.

If Content-Length is too large:
	•	The server waits for bytes that never arrive
	•	The request hangs
	•	The connection may time out

Example: Your ESP32 sends `Content-Length: 50` but the body is only 28 bytes. The server reads 28 bytes, then waits for 22 more that never come. The request hangs until timeout.

Correct boundaries matter.


## 21) The Server Does Not “Know” Your Intent

The server does not know:
	•	That this is "a sensor reading"
	•	That this is "JSON"
	•	That this is "from the coop controller"

It only knows:
	•	Method
	•	Path
	•	Headers
	•	Body bytes

Intent is inferred from structure, not assumed.


## 22) The Path Is Not a File

The request line path:

/api/voltage
/api/temp
/api/fence_status

Is not necessarily:
	•	A file
	•	A directory
	•	A physical location

It is a logical identifier.

What it means is entirely server-defined. Your Pi might map `/api/voltage` to a sensor reading, `/api/temp` to a DHT22, `/api/fence_status` to the poultry net energizer.


## 23) Query Strings Are Part of the Path

This is still the request line:

GET /api/voltage?sensor=1&unit=V HTTP/1.1
GET /api/temp?location=coop HTTP/1.1

Everything after ? is part of the path.
The server parses it separately, but HTTP does not care. Your dashboard might query `/api/voltage?sensor=1` to get battery bank 1, or `/api/temp?location=coop` to get the coop temperature.


## 24) Headers Are the Real Power

Most HTTP behavior lives in headers:
	•	Authentication
	•	Content negotiation
	•	Caching
	•	Compression
	•	Connection control

The request line is short.
Headers carry the nuance.


## 25) Headers Are How Constraints Are Communicated

Headers express constraints like:
	•	"I only accept JSON" (`Accept: application/json`)
	•	"I am authenticated as X" (`Authorization: Bearer token123`)
	•	"Do not cache this" (`Cache-Control: no-cache`)
	•	"Keep the connection open" (`Connection: keep-alive`)

They are rules, not suggestions.


## 26) The Server Is Allowed to Reject Anything

If:
	•	The request line is malformed
	•	Required headers are missing
	•	The body does not match headers

The server can reject the request.

HTTP does not promise forgiveness.


## 27) Request Structure Is a Contract

The request structure is a contract between client and server.

The client promises:
	•	To follow the format
	•	To declare metadata accurately
	•	To respect boundaries

The server promises:
	•	To parse according to the spec
	•	To respond clearly
	•	To close the connection if violated


## 28) Frameworks Hide This—But It Still Exists

Frameworks:
	•	Generate request lines
	•	Add headers automatically
	•	Serialize bodies for you

But they do not change the protocol.

Understanding the structure makes frameworks predictable.


## 29) Debugging Always Comes Back to Structure

When requests fail mysteriously:
	•	Check the request line (method, path, version correct?)
	•	Check headers (required headers present? syntax correct?)
	•	Check Content-Type (matches body format?)
	•	Check Content-Length (matches actual body size?)
	•	Check the blank line (present? correct CRLF?)

Example: Your dashboard gets `400 Bad Request` from the Pi. Check: Is `Host: pi.local` present? Is the blank line there? Is `Content-Length` correct if there's a body? Nine times out of ten, it is structural.


## 30) Mental Model: Envelope and Letter

Think of an HTTP request as:
	•	An envelope (headers)
	•	A letter (body)
	•	A label (request line)

The postal service does not read the letter.
It reads the envelope.

HTTP works the same way.


## Reflection

Think about a real request—your dashboard fetching voltage from the Pi, an ESP32 sensor reporting temperature, a coop controller checking fence status.
	•	What must be on the first line?
	•	Which headers are required?
	•	How does the server know when the request ends?
	•	How does it know whether a body exists?

Consider failure modes:
	•	Your ESP32 sends a POST request. The server returns `400 Bad Request`. What's wrong? Check: Is `Host` present? Is `Content-Length` correct? Is the blank line there? Is the body exactly the declared length?
	•	Your dashboard sends `GET /api/voltage HTTP/1.1` but forgets the blank line. The server hangs. Why? Without the blank line, the server keeps reading, waiting for more headers that never come.
	•	Your coop controller sends a request with `Content-Length: 30` but the body is only 25 bytes. The server waits for 5 more bytes, then times out. The boundary is wrong.

If you removed your HTTP library and had to write a request by hand, could you? If you can answer those questions and debug these failures, the structure is yours.


## Core Understanding

An HTTP request has a fixed structure:
	•	Request line first
	•	Headers next
	•	One blank line
	•	Optional body

The server parses in that order.
Nothing is implied.
Everything is explicit.

This chapter builds on Chapter 2.1 (request-response), 2.2 (HTTP on TCP), 2.3 (what HTTP is), 2.4 (HTTP as text), and 2.5 (statelessness and connection lifecycle). Next: Chapter 2.7 — The Request Line, where we zoom in on the very first line: methods, paths, versions, and why that single line controls everything that follows.