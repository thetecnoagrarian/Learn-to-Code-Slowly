# Section B Phase 4 · Chapter 4.10: JSON — Parsing and Serialization

Chapter 4.09 covered JSON **syntax**: what is valid text and what is not. This chapter covers the **code** that turns that text into JavaScript values and back: **JSON.parse** (parse a string → object, array, etc.) and **JSON.stringify** (object, array, etc. → string). You will handle parse errors, use the optional **reviver** and **replacer** arguments, and apply parse/stringify when reading config files and building API responses in Node. These two functions are the bridge between “JSON on the wire or in a file” and “data in your program.”

## Learning Objectives

By the end of this chapter, you should be able to:

- **Parse** JSON text with **JSON.parse(string)** and handle invalid input with **try/catch**.
- Use the **reviver** function (second argument to **JSON.parse**) to transform values during parse (e.g. turn date strings into **Date** objects).
- **Serialize** JavaScript values with **JSON.stringify(value, replacer?, space?)** and know what is omitted (**undefined**, functions, symbols).
- Use **replacer** (array of keys or function) to filter or transform what gets stringified; use **space** for pretty-printing.
- Apply **JSON.parse** when reading config files (fs + parse) and when reading HTTP request bodies; apply **JSON.stringify** when writing API responses and config. Handle circular references (stringify throws; avoid or use a custom replacer).

## Key Terms

- **JSON.parse(string, reviver?)**: Built-in function that takes a JSON **string** and returns a JavaScript value (object, array, string, number, boolean, null). Throws if the string is invalid JSON. Optional **reviver(key, value)** is called for each key-value pair during parse; you can return a transformed value (e.g. turn a string into a **Date**).
- **JSON.stringify(value, replacer?, space?)**: Built-in function that takes a JavaScript **value** and returns a JSON **string**. **undefined**, functions, and symbols are omitted (or cause the key to be omitted). Optional **replacer** (array or function) filters or transforms; optional **space** adds indentation for readability. Throws if the value contains an uncountable circular reference.
- **Reviver**: A function passed to **JSON.parse** that runs for each key and value as the object is built; used to “revive” special values (e.g. date strings → **Date**).
- **Replacer**: A function or array passed to **JSON.stringify** that controls which properties are included or how they are serialized; used to filter keys or handle special types.

---

## 1) JSON.parse — From String to Value

**JSON.parse** takes a **string** (the raw JSON text) and returns the corresponding JavaScript value. It is the inverse of **JSON.stringify**: you use it when you have JSON as text (from a file, an HTTP body, or a variable) and need to work with it as an object or array in code.

### 1.1 Basic Usage

```javascript
const text = '{"name": "Alice", "age": 30}';
const obj = JSON.parse(text);
console.log(obj.name);  // "Alice"
console.log(obj.age);   // 30
```

The string must be **valid JSON** (Chapter 4.09). If it is not—trailing comma, single quotes, etc.—**JSON.parse** throws a **SyntaxError**. You do not get a partial result; the entire parse fails. So any time the string comes from an untrusted or external source (file, network, user input), wrap the call in **try/catch** and handle the error (e.g. log it, return a default, or respond with 400 Bad Request in an API).

### 1.2 Handling Parse Errors

```javascript
let config;
try {
  const text = await fs.readFile("config.json", "utf8");
  config = JSON.parse(text);
} catch (err) {
  if (err instanceof SyntaxError) {
    console.error("Invalid JSON in config.json:", err.message);
    process.exit(1);
  }
  throw err;  // rethrow non-parse errors (e.g. file not found)
}
```

Checking **err instanceof SyntaxError** lets you distinguish “invalid JSON” from other errors (e.g. **ENOENT**). The error message usually includes the position where the parse failed, which can help you fix the source file or body. For config files, failing fast with a clear message is better than continuing with undefined or wrong data. For API request bodies, catch the error and send **400 Bad Request** with a short message so the client knows the body was malformed.

### 1.3 Reviver Function

The optional second argument to **JSON.parse** is a **reviver** function: **JSON.parse(text, reviver)**. It is called for **every** key-value pair (including nested ones) as the parsed object is built. The function receives **key** and **value**; you return the value you want for that key (or the original **value** to leave it unchanged). A common use is turning date strings into **Date** objects:

```javascript
const text = '{"created": "2025-02-24T12:00:00.000Z", "name": "test"}';
const obj = JSON.parse(text, (key, value) => {
  if (key === "created" && typeof value === "string") {
    return new Date(value);
  }
  return value;
});
console.log(obj.created instanceof Date);  // true
```

You can use the reviver to reject invalid values, coerce types, or revive other custom representations (e.g. a string that stands for a special object). If you return **undefined** from the reviver for a property, that property is omitted from the result (useful for filtering during parse). The reviver is called with the **key** and the **value**; for the top-level value the key is **""**. The reviver runs in a bottom-up order (innermost properties first), so when you receive a value, its children have already been processed (and possibly transformed). That order matters when you want to rebuild a nested structure (e.g. an object with a **type** field that tells you how to revive the rest).

---

## 2) JSON.stringify — From Value to String

**JSON.stringify** takes a JavaScript value and returns a JSON **string**. You use it when you need to send data over the wire (e.g. **res.end(JSON.stringify(data))**), write it to a file, or log it in a structured way.

### 2.1 Basic Usage

```javascript
const obj = { name: "Alice", age: 30 };
const text = JSON.stringify(obj);
console.log(text);  // '{"name":"Alice","age":30}'
```

The output has no extra whitespace (compact form). Numbers, strings, booleans, null, plain objects, and arrays are serialized. **undefined**, **functions**, and **Symbol** values are **omitted** from objects (the key is dropped); in arrays they become **null**. **NaN**, **Infinity**, and **-Infinity** become **null** in the JSON output. **Date** objects are serialized as ISO strings (because JSON has no date type). So the round-trip **JSON.parse(JSON.stringify(obj))** does not preserve **undefined**, functions, or **Date** (you get a string back unless you use a reviver).

### 2.2 Replacer — Filter or Transform Keys

The second argument can be an **array of keys** (only those keys are included) or a **function(key, value)** that returns the value to serialize (or **undefined** to omit the key).

**Array replacer** — include only listed keys:

```javascript
const obj = { a: 1, b: 2, c: 3 };
JSON.stringify(obj, ["a", "c"]);  // '{"a":1,"c":3}'
```

**Function replacer** — e.g. omit keys that start with "_":

```javascript
const obj = { name: "Alice", _internal: 42 };
JSON.stringify(obj, (key, value) => {
  if (typeof key === "string" && key.startsWith("_")) return undefined;
  return value;
});
// '{"name":"Alice"}'
```

The replacer is called recursively for every key and value; you can transform values (e.g. turn **Date** into an ISO string explicitly if you want a custom format) or filter them out.

### 2.3 space — Pretty-Print

The third argument is **space**: a number (number of spaces to indent) or a string (e.g. **"\t"**). It adds newlines and indentation so the output is human-readable. Useful for config files or debug logs.

```javascript
const obj = { name: "Alice", age: 30 };
JSON.stringify(obj, null, 2);
// '{\n  "name": "Alice",\n  "age": 30\n}'
```

Use **null** (or omit) as the second argument when you only want pretty-printing and no replacer. **space** does not change the meaning of the JSON; it only affects formatting.

### 2.4 What Gets Omitted or Changed

- **undefined**: Omitted from objects; becomes **null** in arrays.
- **Functions**: Omitted (key dropped in objects).
- **Symbols**: Omitted.
- **NaN, Infinity, -Infinity**: Serialized as **null**.
- **Date**: Serialized as its **toJSON()** result (ISO string).
- **Circular reference**: **JSON.stringify** throws when it hits a circular reference (e.g. **obj.self = obj**). You must remove the circular reference, use a replacer that skips it, or use a custom serializer if you need to support cycles.

### 2.5 toJSON and Custom Serialization

If an object has a **toJSON** method, **JSON.stringify** will call it and use the return value instead of the object itself. **Date** has **toJSON** (returns an ISO string); you can add **toJSON** to your own types to control how they are serialized. For example, if you have a **User** object and want to serialize only **id** and **name**, you can define **user.toJSON = function() { return { id: this.id, name: this.name }; }**. Then **JSON.stringify(user)** will use that result. The replacer still runs on the value returned by **toJSON**, so you can combine **toJSON** with a replacer for fine-grained control.

### 2.6 Arrays and undefined

In an **array**, **undefined** and functions are serialized as **null** (they are not omitted as in objects). So **JSON.stringify([1, undefined, 3])** produces **"[1,null,3]"**. If you need to represent “missing” in an array, **null** is the standard choice in JSON.

---

## 3) Error Handling in Practice

### 3.1 Parse Errors

Always wrap **JSON.parse** when the input is from a file, network, or user. Log the error (and optionally the offending substring) so you can fix the source. Do not assume the file or body is valid JSON. In a server, respond with **400** and a short message for invalid request body; do not leak internal details.

### 3.2 Stringify Errors — Circular References

If your object has a circular reference (e.g. **a.circular = a**), **JSON.stringify(a)** throws. Options: (1) Build your data so it does not contain cycles (e.g. send a snapshot of the data you need). (2) Use a replacer that tracks seen objects and returns **undefined** (or a placeholder) when it hits a repeated reference. (3) Use a library that supports circular references if you really need to serialize them. For config and most API responses, acyclic data is the norm; if you build the payload from request handlers and database results, avoid attaching the same object reference to itself.

### 3.3 Validation After Parse

**JSON.parse** only checks **syntax**. It does not check that the data has the shape your code expects (e.g. that **config.port** is a number). After parsing, validate required fields and types (e.g. **if (typeof config.port !== "number") throw new Error("config.port must be a number")**). That way you fail fast with a clear message instead of failing later with "undefined is not a function" or wrong behavior. Never pass parsed JSON (or any user/network input) to **eval** or **new Function**; **JSON.parse** is safe for parsing data, but executing parsed content as code is a security risk. Stick to treating the result as data: read properties, validate, and use in your logic.

---

## 4) Use in Node: Config Files

Reading a config file is a standard pattern: read the file as UTF-8, then parse.

```javascript
const fs = require("fs").promises;
const path = require("path");

async function loadConfig() {
  const configPath = path.join(__dirname, "config.json");
  const text = await fs.readFile(configPath, "utf8");
  try {
    return JSON.parse(text);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`Invalid JSON in config: ${err.message}`);
    }
    throw err;
  }
}
```

Use **fs.promises** (or callbacks) so the read is non-blocking (Chapter 4.03, 4.06). If the config is required for startup, call **loadConfig()** at the top of your main flow and **process.exit(1)** (or throw) on failure so the process does not start with bad or missing config. You can then validate **config.port**, **config.apiKey**, etc., and use the values in your server or script. To **write** config back (e.g. after the user updates settings), use **fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8")** so the file is valid JSON and readable. Always use try/catch around **JSON.parse** when reading and validate the structure after parse; use **JSON.stringify** when writing so you never write invalid JSON by hand.

---

## 5) Use in Node: API Request and Response Bodies

### 5.1 Parsing Request Body

When the client sends **Content-Type: application/json**, the body is typically a JSON string. You collect the body chunks (Chapter 4.04), concatenate, and parse:

```javascript
const chunks = [];
req.on("data", (chunk) => chunks.push(chunk));
req.on("end", () => {
  const bodyText = Buffer.concat(chunks).toString("utf8");
  let body;
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
  } catch (e) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid JSON body" }));
    return;
  }
  // use body...
});
```

Empty body is often treated as **{}**; otherwise invalid JSON should result in a 400 response. For non-empty body, invalid JSON gets a **400** response and a short error so the client can fix the request.

### 5.2 Sending JSON Response

Set **Content-Type: application/json** and send the stringified data:

```javascript
res.statusCode = 200;
res.setHeader("Content-Type", "application/json");
res.end(JSON.stringify({ message: "OK", data: someObject }));
```

Do not send an object directly (e.g. **res.end(someObject)**); **res.end** expects a string or Buffer. **JSON.stringify** ensures the payload is valid JSON text. If **someObject** contains **undefined** or functions, those are omitted by **JSON.stringify**; if it has circular references, stringify throws and you must fix the data or handle the error. Setting **Content-Type: application/json** (and optionally **charset=utf-8**) tells the client to interpret the body as JSON; most HTTP clients will then parse it automatically. If you omit the header, some clients may not treat the body as JSON.

### 5.3 Parsing JSON Lines (JSONL)

If you have a file or stream with one JSON value per line (JSONL), you cannot parse the whole thing with a single **JSON.parse** (that would fail on the first newline inside a string or on multiple values). Instead, split the text by newlines and parse each line: **const lines = text.split("\n").filter(Boolean); const data = lines.map(line => JSON.parse(line));**. Wrap each **JSON.parse(line)** in try/catch so a bad line does not crash the script; you can log and skip invalid lines or fail the whole load depending on your requirements.

---

## 6) Round-Trip and Limits

**JSON.parse(JSON.stringify(obj))** gives you a **deep copy** of plain data (objects, arrays, primitives) but with caveats: **Date** becomes a string (parse returns string, not Date); **undefined** and functions disappear; **NaN** and **Infinity** become **null**. So “round-trip” is lossy for those types. For strict round-trip of dates, use a reviver on parse that turns date strings back into **Date** objects (or store dates in a format you can recognize and revive). For deep cloning of plain data without functions or dates, **JSON.parse(JSON.stringify(obj))** is a simple approach; for complex objects, consider a dedicated clone or serialization strategy.

---

## 7) What Breaks When You Skip Parse/Stringify Conventions

If you do not wrap **JSON.parse** in try/catch for file or network input, invalid JSON will throw and can crash your process or leave the request hanging. If you assume the parsed object has certain keys or types without validating, you could get **undefined** or wrong types and then runtime errors. If you **res.end(obj)** instead of **res.end(JSON.stringify(obj))**, the response may be **"[object Object]"** or cause an error; always stringify for JSON responses. If your object has circular references and you stringify it, you will get an exception; remove cycles or use a replacer. If you store **undefined** or functions in an object and expect them in the JSON output, they will be omitted; use **null** or a string representation if you need to persist them. If you parse user-controlled JSON and use the result without validation, you can have security or correctness issues; validate shape and types after parse.

---

## 8) Homestead Example: Config and API

A small Node API might load config at startup with **fs.readFile** and **JSON.parse**, then validate **config.port** and **config.sensors**. For each request to **GET /api/readings**, it might read sensor data from memory or a file (also stored as JSON), then **res.setHeader("Content-Type", "application/json")** and **res.end(JSON.stringify(readings))**. For **POST /api/config**, it might parse the body with **JSON.parse**, validate the new config, then write it back to **config.json** with **fs.writeFile(path, JSON.stringify(config, null, 2))** so the file is pretty-printed. In every case, parse for input and stringify for output; handle parse errors and validate after parse so the app stays predictable. When logging objects for debugging, **console.log(obj)** often prints a truncated or unclear representation; **console.log(JSON.stringify(obj, null, 2))** gives you full, readable JSON in the log. Be careful not to log huge objects or objects that contain secrets; filter with a replacer or log only the fields you need.

---

## 9) Checklist

Before moving on, you should be able to:

1. Call **JSON.parse(string)** and handle **SyntaxError** with try/catch when the string is from a file or network.
2. Use a **reviver** function to transform values during parse (e.g. date strings → **Date**).
3. Call **JSON.stringify(value, replacer?, space?)** and know that **undefined**, functions, and symbols are omitted; **Date** becomes an ISO string; circular refs throw.
4. Use **replacer** (array or function) to filter or transform what is stringified, and **space** for pretty-printing.
5. Read a config file with fs, parse with **JSON.parse** in try/catch, and validate required fields after parse.
6. Send a JSON response with **Content-Type: application/json** and **res.end(JSON.stringify(data))**; parse request body with **JSON.parse** and respond with 400 on parse error.
7. Avoid sending objects with circular references to **JSON.stringify** without handling them (replacer or different structure).
8. Use **toJSON** when you need an object to serialize to a specific shape (e.g. only certain fields); use **space** (e.g. **2**) when writing config or logs for humans.

---

## Common Pitfalls

- **Not catching JSON.parse errors**: Invalid input throws; always use try/catch for external input.
- **Assuming parsed data shape**: Validate keys and types after parse; do not assume **config.port** exists or is a number.
- **Forgetting to stringify for res.end**: **res.end** needs a string; use **JSON.stringify** for JSON bodies.
- **Circular references**: **JSON.stringify** throws; remove cycles or use a replacer that skips already-seen objects.
- **Expecting undefined or functions in output**: They are omitted; use **null** or a string if you need something in the JSON.
- **Using sync fs with parse in a request handler**: Prefer async **fs.promises.readFile** and **await** so you do not block the event loop (Chapter 4.06).
- **Logging or sending huge objects**: **JSON.stringify** on a very large object can be slow or use a lot of memory; for logs, use a replacer to include only the fields you need. For API responses, avoid sending more data than the client needs.

---

## Practice: Try These

1. Write a script that reads **config.json** with **fs.promises.readFile**, parses with **JSON.parse** in try/catch, and logs the config or exits with a clear error on parse failure. Add a reviver that converts any string value that looks like an ISO date (e.g. **/^\d{4}-\d{2}-\d{2}T/) into a **Date** and log one such value.
2. Build an object with a **Date** and an **undefined** property. **JSON.stringify** it and log the result; then **JSON.parse** the result and confirm the date is a string and the undefined key is gone. Add a reviver that turns ISO date strings back into **Date** and confirm.
3. Use **JSON.stringify(obj, null, 2)** and write the result to **output.json** with **fs.writeFile**. Open the file and confirm it is pretty-printed. Then read it back, parse, and compare with the original object (remember dates become strings without a reviver).
4. In a small HTTP server, parse the request body (collect chunks, **Buffer.concat**, **toString**, **JSON.parse**) in try/catch and respond with **400** and **{"error": "Invalid JSON"}** on failure. On success, respond with **200** and **JSON.stringify({ received: body })**. Test with **curl** with valid and invalid JSON body.
5. Create an object with a circular reference (**a.self = a**). Call **JSON.stringify(a)** and confirm it throws. Use a replacer that keeps a **Set** of seen objects and returns **undefined** (or **"[Circular]"**) when it sees the same object again; stringify with that replacer and confirm you get a string without throwing.

These exercises lock in parse, stringify, error handling, and the config/API pattern before moving on to environment and configuration (Chapter 4.11). If **JSON.parse** throws “Unexpected token” or “Unexpected end of JSON input,” the string is truncated or has a syntax error; check the source (file or body) and fix the JSON. If **JSON.stringify** throws “Converting circular structure to JSON,” find the circular reference (e.g. **obj.ref = obj**) and remove it or use a replacer that returns a placeholder for already-seen objects.

---

## Summary

**JSON.parse(string, reviver?)** turns a JSON string into a JavaScript value. The reviver runs bottom-up for each key-value pair and can transform or filter values (e.g. date strings → **Date**). It throws on invalid JSON; wrap it in try/catch for file or network input and handle **SyntaxError** explicitly. Use the **reviver** to transform values (e.g. date strings → **Date**). **JSON.stringify(value, replacer?, space?)** turns a value into a JSON string. **undefined**, functions, and symbols are omitted; **Date** becomes an ISO string (via **toJSON**); circular references cause a throw. Objects can define **toJSON** to control how they are serialized. Use **replacer** to filter or transform, and **space** to pretty-print. In Node, read config with fs then parse; send API responses with **Content-Type: application/json** and **res.end(JSON.stringify(data))**; parse request bodies and respond with 400 on parse error. For JSONL (one value per line), split on newlines and parse each line in a loop with try/catch so one bad line does not break the whole load. Validate parsed data (required keys, types) after parse so your app fails fast with clear errors. Use **toJSON** on objects when you need custom serialization, and remember that in arrays **undefined** becomes **null** in the output. Next, Chapter 4.11 covers environment variables and configuration patterns so you can combine **process.env**, config files, and validation in one place.

---

## Next

Next: **Chapter 4.11: Environment and Configuration in Node**. That chapter ties together **process.env**, config files (including JSON), and patterns for loading and validating configuration so your Node apps and servers get their settings from the environment and optional config files in a consistent way. You will use **JSON.parse** and **JSON.stringify** there when loading and validating JSON config alongside environment variables.
