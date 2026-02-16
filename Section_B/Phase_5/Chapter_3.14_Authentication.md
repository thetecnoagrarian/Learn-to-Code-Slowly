## Phase 3 · Chapter 3.14: Authentication Basics

This chapter builds on:
	•	Chapter 3.7: Middleware
	•	Chapter 2.20: Cookies and Session State
	•	Chapter 2.21: Trust Boundaries and Security Surfaces

You already understand:
	•	Middleware creates execution boundaries.
	•	Cookies are ambient and untrusted.
	•	All external input must be validated.
	•	HTTP is stateless.

Now we introduce identity.

Authentication answers one question:

Who is making this request?

It does not answer:

What are they allowed to do?

That is authorization (later).

Authentication establishes identity at the boundary.

Chapter 3.13 formalized validation at the boundary. Authentication extends that: you validate identity claims (credentials, tokens, session IDs) instead of plain data. Phase 2.20 introduced cookies and session state; Phase 2.21 covered trust boundaries. This chapter applies those concepts in Express: session-based vs token-based auth, cookie security, and middleware as the auth gate.

## 1) Identity as a Boundary Problem

Every request arrives anonymous.

Express has no idea who the caller is.

Identity must be:
	1.	Claimed
	2.	Verified
	3.	Attached to the request
	4.	Re-verified on every request

Authentication is not a one-time event.

It is a per-request verification step.

## 2) The Core Authentication Pattern

All authentication systems follow this structure:
	1.	Client sends credentials (username/password, token)
	2.	Server verifies credentials
	3.	Server establishes identity proof (session ID or token)
	4.	Client sends identity proof on subsequent requests
	5.	Server verifies proof on every request

Everything revolves around identity proof.

## 3) Sessions vs Tokens

There are two dominant patterns.

Sessions (Stateful)
	•	Server stores session data
	•	Client stores session ID (usually in cookie)
	•	Each request sends session ID
	•	Server looks up session to identify user

Identity proof = session ID

Server stores state.

Tokens (Stateless)
	•	Server creates signed token (e.g., JWT)
	•	Client stores token
	•	Each request sends token (usually in Authorization header)
	•	Server verifies token signature
	•	No session lookup required

Identity proof = signed token

Server stores no session state.

## 4) Session-Based Authentication

Login Route

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({
      error: 'Invalid credentials'
    });
  }

  const sessionId = createSession(user.id);

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    user: { id: user.id, username: user.username }
  });
});

Key points:
	•	Credentials are validated.
	•	A session is created.
	•	The session ID is sent in a cookie.
	•	Cookie is httpOnly and secure.

The cookie becomes the identity proof.

## 5) Session Verification Middleware

Every protected route must verify identity.

const authenticateSession = (req, res, next) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  const session = getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      error: 'Invalid session'
    });
  }

  req.user = { id: session.userId };

  next();
};

Usage:

app.get('/api/profile', authenticateSession, (req, res) => {
  const user = getUser(req.user.id);
  res.json({ user });
});

Same pattern for /api/dashboard, /api/panels, or /api/fence/config — identity is verified before business logic runs.

This is boundary enforcement.

## 6) Token-Based Authentication

Tokens remove server-side session storage.

Login Route (JWT Example)

const jwt = require('jsonwebtoken');

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({
      error: 'Invalid credentials'
    });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(200).json({ token });
});

The token is cryptographically signed.

It proves identity without server lookup.

### 6a) Token Verification Middleware

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token'
      });
    }

    req.user = { id: decoded.userId };
    next();
  });
};

Usage:

app.get('/api/profile', authenticateToken, handler);

Same pattern for protected routes like /api/sensors, /api/coop/readings, or /api/solar/config. Each request verifies the token signature.

No session store required.

## 7) Cookies in Express

Cookies require parsing middleware.

const cookieParser = require('cookie-parser');
app.use(cookieParser());

Now:

req.cookies.sessionId

is available.

Remember:

Cookies are untrusted.

They can be modified, forged, replayed.

You must verify them.

## 8) Cookie Security Options

When setting cookies:

res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 86400000
});

	•	httpOnly → JavaScript cannot read it (XSS mitigation)
	•	secure → Only sent over HTTPS
	•	sameSite → Mitigates CSRF
	•	maxAge → Limits lifetime

These are not optional in production systems.

## 9) Logout

Logout must invalidate identity proof.

Session-based:

app.post('/api/logout', authenticateSession, (req, res) => {
  deleteSession(req.cookies.sessionId);
  res.clearCookie('sessionId');
  res.status(200).json({ message: 'Logged out' });
});

Token-based:
	•	Tokens expire naturally
	•	Or maintain token blacklist (rarely ideal)

Deleting a cookie without invalidating server-side session is incomplete logout.

## 10) Status Codes in Authentication

Use correct codes:
	•	401 Unauthorized → Identity required or invalid (no credentials, bad credentials, expired session or token)
	•	403 Forbidden → Identity valid but access denied (authenticated user lacks permission for this resource)
	•	400 Bad Request → Malformed credentials (e.g., missing username or password in login body)
	•	200 OK → Authenticated successfully

401 = "who are you?" 403 = "I know who you are, but you cannot do this." These are semantic signals. Chapter 3.12 covers status code discipline.

## 11) Authentication as Boundary Layer

Authentication middleware:
	•	Validates identity proof
	•	Attaches identity to request
	•	Blocks unauthorized access

It must run before protected routes.

Order matters:

app.use('/api', authenticateSession);

Apply to all API routes — sensors, panels, fence data, coop readings, solar config — or mount on specific subpaths. Authentication is a boundary guard.

Without it, routes are exposed.

## 12) Statelessness and Identity

HTTP is stateless.

Authentication does not change that.

Even sessions are just:
	•	Session ID in cookie
	•	Server lookup on each request

Identity must be verified on every request.

Never rely on server memory like:

let currentUser = null; // Wrong

That breaks stateless design.

## 13) Common Mistakes

Trusting cookies without verifying server-side session: A cookie can be forged or stolen. The session ID must be looked up; if the session is missing or invalid, return 401.

Not validating login input: Username and password come from req.body — validate presence, type, and format before calling authenticateUser. Chapter 3.13: validate at the boundary.

Storing sensitive data in tokens: JWTs are base64-encoded, not encrypted. Anyone can decode the payload. Store only non-sensitive claims (userId, role). Never store passwords or secrets.

Not setting secure cookie flags: Without httpOnly, JavaScript can read the cookie (XSS risk). Without secure, it is sent over HTTP. Without sameSite, CSRF attacks are easier. Set all three in production.

Assuming identity persists without verification: Do not rely on req.user from a previous request. Verify identity on every request. Middleware must run for every protected route.

Skipping authentication middleware on some routes: A single unprotected /api/config or /api/sensors route exposes data. Apply auth consistently — either per-route or via app.use for the entire API prefix.

Returning 403 when you mean 401: If the user sent no credentials or invalid credentials, return 401. Use 403 only when the user is authenticated but not allowed to perform the action.

Authentication failures are usually boundary failures.

## 14) Identity Is Not Authority

Authentication says:

You are user 42.

It does not say:

You can delete sensors.

Authorization will check:
	•	Role
	•	Ownership
	•	Permissions

Never combine identity and authority casually.

## 15) Trust Boundary Reminder

Everything in:
	•	req.body
	•	req.headers
	•	req.cookies

is untrusted.

Authentication is:
	•	Validation of identity claims
	•	On every request
	•	Before business logic

It is a structural layer in the middleware pipeline.

## 16) Mental Model

Request arrives →
Validate input →
Authenticate identity →
Authorize action →
Process →
Respond

Authentication sits between validation and authorization.

It defines who is crossing the boundary.

## 17) Concept Anchor

You now understand:
	•	Sessions vs tokens
	•	Cookies as identity carriers
	•	Middleware as authentication gate
	•	Identity verification per request
	•	Proper HTTP status codes for auth flows

You can protect dashboard, sensor, panel, fence, or coop API routes with session or token authentication.

Chapter 3.15 connects Express to storage layers — sessions and user data often live in a database. The same boundary discipline applies: validate, authenticate, then persist.

### Reflection

Authentication answers "who?" Identity must be claimed, verified, and attached to the request on every request. Sessions store state server-side; tokens are stateless and signed. Login validates credentials, creates session or token, sends identity proof (cookie or Authorization header). Middleware verifies proof before protected routes. 401 = identity required or invalid; 403 = identity valid but access denied. Cookies: httpOnly, secure, sameSite. Logout invalidates session and clears cookie. Auth sits between validation and authorization. Whether your API protects sensors, panels, fence config, or coop readings — verify identity at the boundary, every request.

## What's Next

Next: Chapter 3.15 — State and Persistence

Where you'll learn:
	•	Connecting Express to storage layers
	•	How request handling interacts with databases and durable state