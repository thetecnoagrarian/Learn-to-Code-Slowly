## Phase 3 · Chapter 3.11: Templating and Server-Side Rendering

This chapter builds on:
	•	Chapter 3.10: Static Files

You now understand how to serve HTML files from disk.

Express supports multiple view engines (EJS, Pug, Handlebars, and others). This chapter uses EJS as the example — its syntax is minimal and easy to read. See Using template engines in resources for the full list and how to register custom engines.

Now we change the model.

Instead of serving fixed HTML,
you generate HTML dynamically on the server.

This is server-side rendering (SSR).

The server:
	1.	Fetches data
	2.	Inserts data into an HTML template
	3.	Sends fully-formed HTML to the client

The browser receives complete HTML and renders it immediately.

No client-side JavaScript required to build the page.

This chapter builds SSR from first principles:
	•	What templating engines are
	•	How Express integrates with them
	•	How rendering works
	•	Data flow into templates
	•	Safety concerns
	•	Tradeoffs vs client-side rendering

## 1) Static vs Server-Side Rendering

Static HTML:
	•	Same file for every request
	•	No server logic
	•	No per-request data
	•	Served directly from disk

Server-side rendering:
	•	HTML generated per request
	•	Data injected dynamically
	•	May depend on user, time, database, sensors, panels, fence voltage, ESP32 readings
	•	Built at request time

Static:

Disk → Network

SSR:

Request → Route Handler → Template → HTML → Network

The difference is where HTML is assembled.

## 2) What a Templating Engine Is

A templating engine:
	•	Reads an HTML file
	•	Finds placeholders (special tags that mark where data goes)
	•	Replaces placeholders with values
	•	Executes simple logic (loops, conditionals)
	•	Produces final HTML

Placeholders are instructions embedded in HTML — for example `<%= sensor.name %>` means "output the value of sensor.name here, escaped for HTML." The engine runs on the server, so the client never sees the placeholder syntax. Only the resulting HTML is sent.

A template is not raw JavaScript.
It is HTML with embedded instructions.

This keeps:
	•	HTML structure separate from application logic
	•	Presentation separate from data fetching
	•	Reusability intact

Escaping matters. When you output a value with `<%= %>`, the engine converts characters like `<`, `>`, and `"` into safe HTML entities. That prevents user-supplied content from being interpreted as HTML or JavaScript. Without escaping, an attacker could inject a script tag and run code in your users' browsers.

Templating is controlled string generation.

Nothing more.

## 3) Configuring a View Engine in Express

Express must know:
	•	Which templating engine to use
	•	Where templates are stored

Example using EJS:

app.set('view engine', 'ejs');
app.set('views', './views');

This tells Express:
	•	Use .ejs files
	•	Look inside the views/ directory
	•	Render with EJS engine

Express does not render HTML by itself.
The engine does.

Express coordinates.

## 4) Rendering a Template

Basic route:

app.get('/dashboard', (req, res) => {
  const sensors = getAllSensors();
  res.render('dashboard', { sensors });
});

Same pattern for a coop temperature page, panel status page, fence voltage summary, or ESP32 readings overview — fetch data, pass to template, render.

What happens internally:
	1.	Express finds views/dashboard.ejs
	2.	Passes { sensors } to the template
	3.	Template engine generates HTML
	4.	Express sends generated HTML as response
	5.	Status defaults to 200
	6.	Content-Type: text/html

res.render() replaces res.send().

But it still produces a normal HTTP response.

## 5) The Template File

Example views/dashboard.ejs:

<!DOCTYPE html>
<html>
<head>
  <title>Sensor Dashboard</title>
</head>
<body>
  <h1>Sensors</h1>
  <ul>
    <% sensors.forEach(sensor => { %>
      <li>
        <%= sensor.name %>: <%= sensor.value %>
      </li>
    <% }) %>
  </ul>
</body>
</html>

Important syntax:
	•	<% %> → execute JavaScript
	•	<%= %> → output escaped value
	•	<%- %> → output raw (unescaped) value

Escaped output prevents injection attacks.

Always prefer <%= %> unless you intentionally want raw HTML.

## 6) Data Flow Into Templates

When you call:

res.render('dashboard', { sensors, title: 'Home' });

The template receives:
	•	sensors
	•	title

These become variables inside the template.

Templates do not fetch data.
They render what they are given.

Keep templates presentation-focused.
Do not move business logic into them.

## 7) Loops in Templates

Example:

<ul>
  <% sensors.forEach(sensor => { %>
    <li><%= sensor.name %></li>
  <% }) %>
</ul>

This generates:

<ul>
  <li>Sensor A</li>
  <li>Sensor B</li>
</ul>

The loop executes on the server.

The client never sees the loop.
Only the final HTML.

## 8) Conditionals in Templates

Example:

<% if (sensor.online) { %>
  <span class="online">Online</span>
<% } else { %>
  <span class="offline">Offline</span>
<% } %>

Same idea for energizer status (fence armed or not), panel producing or shaded, or coop door open vs closed. HTML output depends on data.

This is simple conditional branching.

Avoid complex logic here.
Keep it shallow.

## 9) Partials (Reusable Layout Pieces)

Common layout pieces:
	•	Header
	•	Footer
	•	Navigation (links to coop, barn, solar, fence)
	•	Sidebar

Instead of repeating them:

<%- include('header') %>
<main>
  Content here
</main>
<%- include('footer') %>

Partials:
	•	Reduce duplication
	•	Improve maintainability
	•	Encourage clean structure

This mimics component reuse.

## 10) Layout Templates

Many engines support layout systems.

Pattern:
	•	Base layout defines structure
	•	Views inject content into it

Example conceptually:

layout.ejs
  ├─ header
  ├─ content slot
  └─ footer

View:

dashboard.ejs
  injects into layout

This separates structure from content.

Professional systems use this heavily.

## 11) How Rendering Maps to HTTP

res.render() produces:

HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: ...

<body>...generated HTML...</body>

There is no new protocol.

Rendering is just string generation before sending.

Everything remains HTTP.

## 12) Server-Side Rendering vs Client-Side Rendering

SSR:
	•	Server sends complete HTML
	•	Browser renders immediately
	•	Minimal JavaScript required
	•	SEO-friendly
	•	Faster first paint

Client-side rendering (CSR):
	•	Server sends JSON
	•	JavaScript builds DOM
	•	Requires JS runtime
	•	More interactive
	•	Slower initial load

SSR is ideal for:
	•	Status dashboards
	•	Admin panels
	•	Simple content sites
	•	Sensor, panel, or fence monitoring pages

CSR is ideal for:
	•	Complex interactions
	•	Real-time UI
	•	Rich applications

Choose intentionally.

## 13) Performance Considerations

SSR does work per request:
	•	Data fetching
	•	Template rendering
	•	HTML generation

Static files do none of this.

Heavy SSR under high load requires optimization:
	•	Caching rendered HTML
	•	Minimizing DB calls
	•	Reducing template complexity

For homestead-scale applications — a few users checking coop temps, solar production, or fence status — SSR is usually sufficient.

## 14) Security Considerations

Never trust user data passed into templates.

Always:
	•	Escape output
	•	Avoid raw HTML insertion
	•	Validate input before rendering

Example vulnerability:

<%- userInput %>

If userInput contains:

<script>alert("hacked")</script>

That script runs in browser.

Always use <%= %> for escaping.

## 15) Keeping Logic Out of Templates

Bad pattern:

<% if (calculateComplexLogic(sensor)) { %>

Better pattern:

const sensors = getSensors().map(formatSensor);
res.render('dashboard', { sensors });

Templates:
	•	Present data
	•	Do simple branching
	•	Avoid computation

Keep business logic in routes/services.

## 16) Combining SSR with Static Assets

Typical SSR setup:

app.use(express.static('public'));
app.set('view engine', 'ejs');

Page loads:
	•	/dashboard → rendered HTML (coop temps, solar, fence voltage)
	•	/styles.css → static file
	•	/app.js → static file

SSR builds structure.
Static files provide styling and behavior.

They work together. Chapter 3.10 covers static serving in detail.

## 17) Observing SSR in DevTools

Open browser → Network tab.

Request /dashboard:

Response type:

text/html

View response body:
You will see fully-formed HTML.

No template markers remain.
No EJS syntax remains.

Templates execute on the server.
Never on the client.

## 18) Express Rendering Lifecycle

Full flow:
	1.	Client requests /dashboard
	2.	Route handler executes
	3.	Data retrieved
	4.	res.render() called
	5.	Template engine processes file
	6.	HTML generated
	7.	Express sends HTTP response

Same request-response model.

Just dynamic content generation in the middle.

## 19) When Not to Use SSR

Avoid SSR if:
	•	Page content is mostly static
	•	Frontend requires heavy interactivity
	•	Real-time updates dominate
	•	You are building a SPA

SSR is not mandatory.
It is one tool.

Use it where appropriate.

## 20) Common Failure Modes

Wrong or missing view engine: If you call res.render() without app.set('view engine'), or without installing the engine (e.g., npm install ejs), Express cannot render. You get an error. Install the engine and configure it before using res.render().

Missing template file: If views/dashboard.ejs does not exist when you call res.render('dashboard', data), the engine throws. The view name maps to a file path — dashboard becomes views/dashboard.ejs. Check that the file exists and the views directory path is correct.

Template syntax errors: A typo in EJS (e.g., unclosed `<%`) causes a parse error at render time. The error points to the template file and line. Fix the syntax and rerun.

Using raw output with user data: `<%- userInput %>` inserts user data unescaped. If userInput contains `<script>...`, it runs in the browser. This is cross-site scripting (XSS). Always use `<%= %>` for any value that might come from users — form input, query params, database fields, URL params.

Passing undefined into templates: If you pass { sensor } and sensor is undefined, the template may throw when it accesses sensor.name. Guard in the route: check for missing data, return 404, or pass a default before rendering.

Wrong views path: app.set('views', './views') uses a path relative to the process working directory. If you start the server from a different folder, Express looks in the wrong place. Use an absolute path (e.g., path.join(__dirname, 'views')) when the working directory might vary.

Business logic in templates: Putting function calls or complex conditionals inside templates makes them hard to test and debug. Move data preparation to the route handler. Templates should receive ready-to-display data.

## 21) Concept Anchor

Server-side rendering is:
	•	Dynamic HTML generation
	•	Driven by route handlers
	•	Structured through templates
	•	Executed before sending response
	•	Delivered as standard HTTP

Nothing changes about HTTP.

Only where HTML is built changes.

You now understand:
	•	Static file serving
	•	Dynamic API responses (JSON)
	•	Server-rendered HTML
	•	Middleware pipelines
	•	Error handling

You can build:
	•	A sensor, panel, or fence API
	•	A rendered dashboard for coop temps, solar production, or fence voltage
	•	Static assets
	•	Proper HTTP responses

SSR pages can be styled with CSS (Phase 4) and enhanced with components (Phase 5). When your app exposes both HTML views and JSON APIs, Chapter 3.12 helps you structure RESTful routes for the API side.

### Reflection

Templating is controlled string generation. A view engine reads HTML with placeholders, replaces them with data, runs simple loops and conditionals, and outputs final HTML. Express coordinates: you set view engine and views path, then res.render() finds the template and passes data. Always escape with <%= %> — never <%- %> for user data, or you enable XSS. Keep logic in routes; templates present. SSR sends complete HTML per request; static files add CSS and JS. Same HTTP. Your coop dashboard, panel status page, or fence voltage summary can all be server-rendered. Choose SSR when the page is mostly data-driven; choose CSR when interactivity dominates.

## What's Next

Next: Chapter 3.12 — RESTful API Design in Express

Where you'll learn:
	•	Applying Phase 2 REST principles to route structure
	•	Status codes and resource modeling in Express

You now know static files, templating, and server-side rendering. Next, you will apply REST principles to structure your API routes — whether for sensors, panels, fence data, or other homestead resources.