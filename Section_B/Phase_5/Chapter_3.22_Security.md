## Phase 3 · Chapter 3.22: Security Surfaces in Express

This chapter builds on:
	•	Chapter 2.21: Trust Boundaries and Security Surfaces
	•	Chapter 3.13: Validation
	•	Chapter 3.14: Authentication

You already understand:
	•	All input is untrusted.
	•	Validation happens at the boundary.
	•	Authentication establishes identity.

Now you apply that discipline directly to Express. Phase 2.21 formalized trust boundaries and security surfaces. Chapter 3.13 covered validation; Chapter 3.14 covered authentication. This chapter adds header hardening (Helmet), rate limiting, CSRF, XSS mitigation, SQL injection prevention, and safe configuration — whether your API serves sensors, panels, fence voltage, or coop readings.

Express is just an HTTP server.

That means every HTTP attack surface exists:
	•	Headers
	•	Query strings
	•	Route parameters
	•	Bodies
	•	Cookies
	•	Uploaded files
	•	JSON payloads
	•	Form payloads

Security in Express is not magic.
It is systematic boundary enforcement.


## 1) Threat Model for an Express App

Your Express API is exposed to:
	•	Browsers
	•	Scripts
	•	Bots
	•	Automated scanners
	•	Attack tools
	•	Malicious users

You must assume:
	•	Requests are crafted intentionally
	•	Headers may be manipulated
	•	Content-Type may lie
	•	Bodies may contain unexpected types
	•	Tokens may be forged
	•	Cookies may be modified
	•	Query strings may contain injection payloads

Security is not paranoia.

It is disciplined distrust.


## 2) Layered Security Model

Security should be layered:
	1.	Transport layer (HTTPS)
	2.	Reverse proxy protection
	3.	Security headers
	4.	Rate limiting
	5.	Input validation
	6.	Authentication
	7.	Authorization
	8.	Sanitization
	9.	Safe database queries

No single layer is enough.

Defense in depth.


## 3) Helmet — Security Headers

Helmet sets HTTP security headers.

Install:

npm install helmet

Use:

const helmet = require('helmet');
app.use(helmet());

Helmet automatically sets:
	•	X-Content-Type-Options: nosniff
	•	X-Frame-Options: SAMEORIGIN
	•	Strict-Transport-Security
	•	Referrer-Policy
	•	Content-Security-Policy
	•	And more

Why headers matter:

They instruct browsers to behave safely.

Without them:
	•	Clickjacking becomes easier
	•	MIME sniffing may expose vulnerabilities
	•	Mixed content may load
	•	Downgrade attacks become possible

Helmet reduces common browser attack vectors.


## 4) Content Security Policy (CSP)

CSP controls what resources can load.

Example:

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  })
);

CSP prevents:
	•	Injected scripts from executing
	•	External script loading
	•	Inline script abuse

CSP is powerful but strict.

Misconfiguration can break your frontend.

Apply carefully.


## 5) Input Sanitization

Validation checks structure.

Sanitization cleans dangerous characters.

Example using validator:

const validator = require('validator');

app.post('/api/sensors', (req, res) => {
  const name = validator.escape(req.body.name);
  const type = validator.trim(req.body.type);

  createSensor({ name, type });
  res.status(201).json({ created: true });
});

Same pattern for panel, fence, coop, or solar endpoints — escape and trim user input. Sanitization helps prevent:
	•	Stored XSS
	•	Reflected XSS
	•	Injection attempts

Important principle:

Validate first.
Sanitize second.
Never trust raw user input.


## 6) XSS Prevention

Cross-Site Scripting occurs when user input is rendered as executable script.

Example:

Bad:

<%- userInput %>

This renders raw HTML.

Good:

<%= userInput %>

This escapes HTML.

Never render unescaped user data unless absolutely necessary.

If you must render HTML:
	•	Sanitize it with a trusted HTML sanitizer.


## 7) SQL Injection Prevention

Never concatenate SQL strings.

Bad:

db.query(`SELECT * FROM users WHERE name = '${req.body.name}'`);

Good:

db.query(
  'SELECT * FROM users WHERE name = ?',
  [req.body.name]
);

Same for sensor, reading, panel, or fence queries — always parameterize. Parameterized queries:
	•	Treat user input as data
	•	Not executable SQL

This eliminates injection risk.

Always use parameterization.


## 8) CSRF Protection

CSRF = Cross-Site Request Forgery.

Attack scenario:
	1.	User is logged in.
	2.	Malicious website sends POST request.
	3.	Browser includes session cookie.
	4.	Server processes unintended action.

CSRF protection adds a token requirement.

Install:

npm install csurf cookie-parser

Use:

const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app.use(cookieParser());
app.use(csrf({ cookie: true }));

Issue token:

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

Client must include token in POST requests.

If token is invalid → request rejected.

CSRF protection is essential when:
	•	Using cookie-based sessions
	•	Serving browser-based clients

It is less relevant for token-based APIs without cookies.

Context matters.


## 9) Rate Limiting

APIs must defend against abuse.

Install:

npm install express-rate-limit

Use:

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

This limits:
	•	100 requests per 15 minutes per IP

Prevents:
	•	Brute force login attempts
	•	API scraping
	•	Basic DoS attempts

Rate limiting should apply:
	•	Login routes
	•	Sensitive endpoints
	•	Public APIs


## 10) Brute Force Protection

Login routes are high risk.

Add stricter rate limiting:

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

app.use('/api/login', loginLimiter);

Limit failed attempts.

Consider:
	•	Account lockouts
	•	Exponential backoff
	•	Captcha (if appropriate)

Authentication endpoints are attack magnets.


## 11) Cookie Security Flags

When using sessions:

res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 86400000
});

Flags:
	•	httpOnly → JavaScript cannot access cookie
	•	secure → HTTPS only
	•	sameSite → reduces CSRF risk

Never omit these in production.


## 12) File Upload Security

If allowing uploads:

Risks:
	•	Executable uploads
	•	Malware
	•	Oversized payloads
	•	Path traversal

Defenses:
	•	Limit file size
	•	Restrict file types
	•	Store outside public directory
	•	Randomize filenames
	•	Scan files (if high risk environment)

Uploads are high-risk surfaces.

Treat them as hostile.


## 13) Body Size Limits

Prevent memory exhaustion attacks:

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

Large body attacks attempt:
	•	Memory exhaustion
	•	CPU exhaustion

Always limit payload size.


## 14) Avoid Information Leakage

Do not expose:
	•	Stack traces in production
	•	Internal file paths
	•	Database errors
	•	Secret keys

Example error handler:

app.use((err, req, res, next) => {
  const status = err.status || 500;

  if (process.env.NODE_ENV === 'production') {
    return res.status(status).json({ error: 'Internal server error' });
  }

  res.status(status).json({ error: err.message, stack: err.stack });
});

Production hides internal detail.

Development exposes it.


## 15) Disable x-powered-by

Hide Express fingerprint:

app.disable('x-powered-by');

Prevents header:

X-Powered-By: Express

Security through obscurity is not sufficient.
But unnecessary disclosure is careless.


## 16) CORS Configuration

Cross-Origin Resource Sharing controls who can call your API.

Install:

npm install cors

Use safely:

const cors = require('cors');

app.use(cors({
  origin: 'https://yourdomain.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

Do NOT use:

app.use(cors());

without understanding implications.

Open CORS = open API.

Restrict origins intentionally.


## 17) Authentication Surface Awareness

Authentication tokens are untrusted input.

Always:
	•	Verify JWT signature
	•	Check expiration
	•	Validate token format
	•	Avoid decoding without verification

Never:

const decoded = jwt.decode(token);

Decode is not verification.

Always verify.


## 18) Logging and Security

Log:
	•	Failed logins
	•	Rate limit hits
	•	Invalid tokens
	•	Suspicious activity

Do not log:
	•	Passwords
	•	Full tokens
	•	Secrets

Security logging helps detect attacks.

But careless logging leaks secrets.

Balance visibility and confidentiality.


## 19) Dependency Security

Keep dependencies updated.

Use:

npm audit

Vulnerable dependencies are attack surfaces.

Express apps inherit risks from:
	•	body-parser
	•	templating engines
	•	auth libraries
	•	file upload middleware

Monitor vulnerabilities.


## 20) Security Checklist

Before production:
	•	HTTPS enforced
	•	Helmet enabled
	•	x-powered-by disabled
	•	Rate limiting active
	•	Body size limits set
	•	Validation enforced
	•	Parameterized queries used
	•	CSRF protection configured (if sessions)
	•	Secure cookies configured
	•	CORS restricted
	•	Stack traces hidden
	•	Secrets not committed

Security is systematic.

Not optional.


## 21) Security Is Continuous

Security is not a one-time setup.

It requires:
	•	Monitoring
	•	Updating
	•	Reviewing logs
	•	Testing boundaries
	•	Threat modeling

Security discipline is boundary discipline applied consistently.


## 22) Concept Anchor

You now understand:
	•	Express security surfaces
	•	Header hardening
	•	Injection prevention
	•	XSS mitigation
	•	CSRF defense
	•	Rate limiting
	•	Secure cookie configuration
	•	Dependency risk awareness

Express does not secure you.

You secure Express.

You can harden sensor, panel, fence, coop, or solar APIs — Helmet, rate limiting, validation, parameterized queries, secure cookies — so the boundary is enforced systematically.

## 23) Common Failure Modes for Security

Skipping Helmet: Default headers expose MIME sniffing, clickjacking risks. app.use(helmet()) sets safe headers.

Open CORS: app.use(cors()) allows any origin. Restrict to known origins; never use open CORS in production.

No rate limiting: Login and API routes exposed to brute force and scraping. Apply rate limit middleware — stricter on login.

Concatenating SQL: `SELECT * FROM sensors WHERE id = '${req.params.id}'` — injection. Use parameterized queries always.

Rendering unescaped user input: <%- userInput %> — XSS. Use <%= %> for escape; Chapter 3.11 formalizes this.

Logging secrets: Passwords, tokens, API keys in logs. Logs persist; never log secrets.

JWT decode without verify: jwt.decode(token) returns payload without verifying signature. Use jwt.verify().

## 24) Reflection

Security = boundary discipline. All input untrusted. Layer defenses: transport (HTTPS), proxy, headers (Helmet), rate limiting, validation, auth, sanitization, parameterized queries. XSS: escape output; never <%- %> user data. SQL injection: parameterize; never concatenate. CSRF: token for cookie-based sessions. Rate limit: login and API. Secure cookies: httpOnly, secure, sameSite. CORS: restrict origins. Hide stack traces in production. Whether your API serves sensors, panels, fence voltage, or coop readings — Express does not secure you; you secure Express.

## What's Next

Next: Chapter 3.23 — Performance and Scaling Concepts

Where you'll learn:
	•	Node’s event loop
	•	Blocking vs non-blocking operations
	•	Clustering
	•	Horizontal scaling
	•	When and how to scale Express systems

Security makes your system safe.

Performance makes it survive load.

You now know security surfaces — Helmet, rate limiting, validation, parameterized queries, XSS mitigation, CSRF, CORS. Chapter 3.23 adds performance concepts: event loop, blocking vs non-blocking, clustering, scaling.