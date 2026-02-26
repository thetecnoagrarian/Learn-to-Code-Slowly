# Section B Phase 4 · Chapter 4.09: JSON — Syntax and Structure

Chapters 4.03 and 4.04 used JSON in config files and HTTP bodies. **package.json** (Chapters 4.07 and 4.08) is JSON. This chapter focuses on **JSON as a format**: what values and structures are valid, what is not allowed, and how to spot and fix common syntax errors. You will write and validate JSON so that **JSON.parse** (Chapter 4.10) and APIs do not fail with parse errors. Understanding JSON syntax is essential for config files, API request and response bodies, and any data you exchange between systems or store as text.

## Learning Objectives

By the end of this chapter, you should be able to:

- Write **valid JSON**: objects **{}**, arrays **[]**, strings (double-quoted only), numbers, **true**/ **false**, **null**.
- State the rules: **keys must be in double quotes**; **strings use double quotes**; no trailing commas; no comments; no **undefined**, **NaN**, or **Infinity**.
- List what JSON does **not** support: functions, **undefined**, comments, trailing commas, single-quoted strings, unquoted keys.
- Validate JSON (syntax) and fix common errors: trailing comma, unquoted key, single quotes, unescaped characters in strings.
- Use JSON confidently for **config files** (e.g. **config.json**) and **API payloads** (Content-Type: application/json) in Node.

## Key Terms

- **JSON**: JavaScript Object Notation. A text format for representing data: objects, arrays, strings, numbers, booleans, and **null**. It is a subset of JavaScript literal syntax but with strict rules (double quotes only, no trailing commas, no comments). Used for config, APIs, and data exchange.
- **Valid JSON**: Text that conforms to the JSON grammar. It can be parsed by **JSON.parse** (and by tools in other languages). Invalid JSON (e.g. trailing comma, single quotes) causes parse errors.
- **JSON value**: The top-level structure can be any single JSON value: an object, an array, a string, a number, a boolean, or **null**. A “JSON file” or “JSON payload” is a single such value (often an object **{}** or array **[]**).

---

## 1) What JSON Is and Why It Matters

JSON is a **text format** for data. It looks like JavaScript objects and arrays, but it has a strict grammar so that any program (Node, Python, a browser, a device) can parse it the same way. You already see it in **package.json**, in API responses (e.g. **{"name": "Alice", "score": 100}**), and in config files. In Node you read JSON from files (**fs.readFile** then **JSON.parse**) or from HTTP bodies (e.g. **req** body as text then **JSON.parse**). If the text is not valid JSON, **JSON.parse** throws. This chapter is about writing and recognizing valid JSON so your parse step succeeds and so you can fix invalid JSON when you see it.

---

## 2) Values and Types

JSON supports exactly six kinds of values. The **top level** of a JSON text must be one of them (usually an object or an array).

### 2.1 Object

An object is **{ }** with zero or more **"key": value** pairs separated by commas. Keys **must** be double-quoted strings. Values can be any JSON value (object, array, string, number, boolean, null).

```json
{}
{"name": "Alice"}
{"name": "Alice", "age": 30, "active": true}
{"nested": {"inner": 1}}
```

No unquoted keys: **{name: "Alice"}** is **invalid** JSON (but valid JavaScript). No trailing comma: **{"a": 1,}** is **invalid** JSON.

### 2.2 Array

An array is ** [ ]** with zero or more values separated by commas. Values can be any JSON type. Again, no trailing comma: ** [1, 2,] ** is invalid.

```json
[]
[1, 2, 3]
["a", "b", "c"]
[true, null, 42, {"x": 1}]
```

### 2.3 String

A string is a sequence of characters enclosed in **double quotes** only. Single quotes are not allowed. Inside the string you can use escape sequences: **\"** (quote), **\\** (backslash), **\n** (newline), **\t** (tab), **\uXXXX** (Unicode code point). Control characters and unescaped backslashes or quotes make the JSON invalid.

```json
"hello"
""
"Say \"Hi\""
"Line one\nLine two"
```

### 2.4 Number

Numbers are written in decimal. No leading zeros (except **0** and **0.5**-style), no **NaN**, no **Infinity**, no **1e2** in the strictest interpretation—though many parsers (including **JSON.parse** in JavaScript) accept **1e2** and **-1.5**. Integers and decimals are valid.

```json
0
42
-3
3.14
0.5
```

JSON does not define a separate integer type; numbers are just numbers. **JSON.parse** in JavaScript returns all numbers as JavaScript numbers (IEEE 754), so very large integers (beyond **Number.MAX_SAFE_INTEGER**) can lose precision. For exact large integers, some APIs use strings (e.g. **"12345678901234567890"**) and parse them in code. For most config and API payloads, normal number ranges are fine.

### 2.5 Boolean

Only **true** and **false** (lowercase). No **True** or **TRUE**.

### 2.6 null

The literal **null** (lowercase). JSON has no **undefined**; use **null** when a value is absent.

---

## 3) What JSON Does Not Allow

The following are **invalid** in JSON even though some are valid in JavaScript:

- **Functions**: No **function () {}** or arrow functions. JSON is data only.
- **undefined**: Not a JSON value. Use **null** or omit the key.
- **NaN, Infinity, -Infinity**: Not valid. Represent with **null** or a string if you need to pass them and parse in code.
- **Comments**: No **//** or **/* */**. Strip comments before parsing or use a different format (e.g. JSONC in editors; not standard JSON).
- **Trailing commas**: **{"a": 1,}** and ** [1, 2,] ** are invalid. Remove the comma before **}** or **]**.
- **Single-quoted strings**: **'hello'** is invalid. Use **"hello"**.
- **Unquoted keys**: **{a: 1}** is invalid. Use **{"a": 1}**.
- **Unescaped control characters** in strings: newline, tab, etc. must be escaped (e.g. **\n**, **\t**) or the string is invalid.

**Dates**: JSON has no date type. Use an ISO 8601 string (e.g. **"2025-02-24T12:00:00.000Z"**) and parse in code with **new Date(str)** or a library. **Custom types**: Represent as an object and use a **type** or **kind** field if needed (e.g. **{"type": "Point", "x": 1, "y": 2}**). **Binary data**: JSON has no binary type. Use Base64-encoded strings (e.g. **"data": "base64encoded..."**) and decode in code if you must embed binary in JSON; often it is better to send binary in a separate body or file. **Schema validation**: Syntax (valid JSON) is only the first step. After parsing, you may want to validate that the data has the right shape (required fields, types). That is done in code (e.g. check **typeof obj.port === "number"**) or with a schema language (e.g. JSON Schema); the curriculum focuses on syntax here and leaves schema validation for later.

---

## 4) Validity and Common Errors

**Valid JSON** means the text can be parsed by **JSON.parse** (or any compliant parser) without error. These mistakes are very common:

### 4.1 Trailing Comma

**Invalid:** **{"name": "Alice",}** or ** [1, 2, 3,] **. The comma after the last value is not allowed. **Fix:** Remove that comma.

### 4.2 Unquoted Keys

**Invalid:** **{name: "Alice"}**. **Fix:** **{"name": "Alice"}**.

### 4.3 Single-Quoted Strings

**Invalid:** **{'key': 'value'}**. **Fix:** **{"key": "value"}**.

### 4.4 Unescaped Characters in Strings

Inside a double-quoted string, **"** and **\** must be escaped as **\"** and **\\**. Literal newlines and other control characters must be escaped (e.g. **\n**). **Invalid:** **"Say "Hi""** (inner quotes break the string). **Fix:** **"Say \"Hi\""**.

### 4.5 Multiple Top-Level Values

A single JSON text is **one** value. **Invalid:** **{} {}** or **1 2**. **Fix:** Wrap in an array **[{}, {}]** or ** [1, 2] ** if you need multiple values, or use one object/array that contains everything. Many config files and API responses are a single object at the top level (e.g. **{"port": 3000, "name": "api"}**); list APIs often return a single array at the top level (e.g. **[{...}, {...}]**). Both are valid; the important rule is “exactly one value” at the root.

### 4.6 Comments

**Invalid:** **{"a": 1 /* comment */}**. **Fix:** Remove the comment. If you need comments (e.g. in config), use a format that supports them (e.g. JSON5) and a parser that accepts it, or keep comments in a separate doc and strip them before **JSON.parse**. Standard **JSON.parse** does not support comments.

---

## 5) Valid vs Invalid Examples

**Valid JSON:**

```json
{
  "name": "homestead-api",
  "version": "1.0.0",
  "port": 3000,
  "features": ["sensors", "alerts"],
  "enabled": true,
  "config": null
}
```

**Invalid (trailing comma):**

```json
{
  "name": "api",
  "port": 3000,
}
```

**Invalid (unquoted key, single quotes):**

```json
{
  name: 'value'
}
```

**Invalid (comment):**

```json
{
  "port": 3000  // default
}
```

**Fix:** Remove the comment or use a separate documentation file; standard JSON has no comment syntax. Running **JSON.parse** on the valid example returns a JavaScript object. Running it on the invalid examples throws. In Node you can wrap **JSON.parse** in try/catch and handle the error (e.g. log the message and the offending text, or return a default config). Chapter 4.10 covers **JSON.parse** and **JSON.stringify** in code.

### 5.1 Quick Reference: Rules in One Place

- **Top level**: Exactly one value (object, array, string, number, boolean, or null).
- **Objects**: **{ }** with **"key": value** pairs; keys must be double-quoted strings; comma between pairs; no trailing comma.
- **Arrays**: ** [ ]** with values; comma between values; no trailing comma.
- **Strings**: Double quotes only; use **\"** **\\** **\n** **\t** **\uXXXX** for special characters.
- **Numbers**: Decimal; no leading zeros (except 0 and 0.x); no NaN/Infinity in strict JSON.
- **Booleans**: **true** or **false** (lowercase).
- **Null**: **null** (lowercase).
- **Not allowed**: Comments, trailing commas, single quotes, unquoted keys, **undefined**, functions.

Use this list when you are unsure whether a snippet is valid JSON. Many editors can format (pretty-print) or validate JSON on save, which helps catch syntax errors before you run your script.

---

## 6) Escaping in Strings

Inside a JSON string (double-quoted), the following escape sequences are defined:

- **\"** — literal double quote.
- **\\** — literal backslash.
- **\/** — literal slash (optional; **/** is allowed unescaped in JSON).
- **\b** — backspace.
- **\f** — form feed.
- **\n** — newline.
- **\r** — carriage return.
- **\t** — tab.
- **\uXXXX** — Unicode code point (four hex digits).

Any other **\** (e.g. **\x**) can make the parser fail or behave in implementation-defined ways. Stick to the standard escapes. To include a backslash in the string, use **\\\\** in the JSON (so the parsed string is one backslash). In JavaScript, **JSON.parse** accepts these escapes and produces the corresponding character in the resulting string. When you **build** JSON by hand (e.g. for a log line), always escape user-supplied content that goes inside a string so that a quote or backslash does not break the structure or introduce injection. Prefer **JSON.stringify** for building JSON so you do not have to escape manually.

---

## 7) Whitespace and Formatting

JSON allows **whitespace** (spaces, newlines, tabs) between tokens. So **{"a":1}** and **{"a": 1}** and a pretty-printed version with newlines and indentation are all valid and parse to the same value. Pretty-printing (indented JSON) is easier to read and diff in version control; minified (no extra spaces) is smaller for network. **JSON.stringify** can take a third argument (a number or string) to insert indentation; Chapter 4.10 covers that. The important point: whitespace does not change the meaning of valid JSON; only the structure and the values matter. Some APIs or tools require one line (no newlines inside strings except as **\n**); that is still valid as long as the grammar is correct.

---

## 8) JSON and JavaScript Objects

JSON is **inspired by** JavaScript literals but is **not** the same. In JavaScript you can write **{a: 1, b: undefined}** and ** [1, 2,] **; in JSON you cannot. When you **JSON.parse** valid JSON, you get a **JavaScript** object or array (or string, number, boolean, null). So after parsing, you use normal JavaScript: **obj.key**, **arr[0]**, etc. The **reverse** (JavaScript → JSON text) is **JSON.stringify** (Chapter 4.10). Not every JavaScript value can be serialized to JSON: functions and **undefined** are omitted or cause issues. So: **JSON text** is a string that follows the JSON grammar; **parsed JSON** is a JavaScript value; **stringify** turns a JavaScript value into JSON text (with limitations). Phase 3 (Chapter 3.16) introduced JSON in JavaScript: **JSON.parse** and **JSON.stringify**, and the idea that JSON is a data interchange format. Here we focus on the **syntax** of the text so that when you write or edit JSON (config files, API payloads), you avoid the mistakes that cause parse errors. The same **JSON.parse** you used in the browser works in Node; the difference is where the string comes from (file, HTTP body, etc.).

---

## 9) Use in Node: Config and APIs

### 9.1 Config Files

Many Node projects use a **config.json** (or **settings.json**) that is read at startup:

```javascript
const fs = require("fs").promises;
const path = require("path");
const configPath = path.join(__dirname, "config.json");
const text = await fs.readFile(configPath, "utf8");
const config = JSON.parse(text);
```

The file must be **valid JSON**. If someone edits it and adds a trailing comma or a comment, **JSON.parse** will throw. Validate config files in tests or with a small script that reads and parses the file; catch parse errors and log a clear message (and the error position if available) so you can fix the file. Many editors and linters validate JSON as you type, which helps when editing **config.json** or **package.json** by hand. **package.json** is JSON too; the same rules apply. Tools that write **package.json** (e.g. **npm init**, **npm install**) produce valid JSON; if you edit by hand, avoid the common mistakes above.

### 9.2 API Request and Response Bodies

HTTP APIs often send and receive JSON. The **Content-Type** is **application/json**. The body is a **string** (in Node you get it from **req** by reading the stream); you then **JSON.parse** that string to get an object or array. If the client sends invalid JSON, **JSON.parse** throws and you should respond with **400 Bad Request** and a clear error (Chapter 4.04). When your server **sends** JSON, you **JSON.stringify** an object and send it with **Content-Type: application/json**. So: on the wire, JSON is always **text**; in your code, after parse, it is a JavaScript value. Ensuring that the text is valid JSON (syntax) is the first step before you validate or use the data (e.g. check required fields, types).

### 9.3 JSON Lines (JSONL) and Other Variants

Some systems use **JSON Lines** (one JSON value per line, each line valid JSON). That is not “one big JSON array”; it is multiple separate JSON values, one per line. To parse it, you split on newlines and **JSON.parse** each line. Standard **JSON.parse** only parses a **single** value, so for JSONL you handle the splitting yourself. Other variants (JSON5, JSONC) add comments or trailing commas; they are not standard JSON and require a different parser. In this curriculum we stick to standard JSON and **JSON.parse**.

### 9.4 Encoding: UTF-8

JSON text is typically exchanged and stored as **UTF-8**. When you read a JSON file in Node with **fs.readFile(path, "utf8")**, you get a string that **JSON.parse** can handle. If the file is in another encoding (e.g. UTF-16), you need to read it with that encoding (or convert) before parsing. For APIs, **Content-Type: application/json** usually implies UTF-8. Specifying **charset=utf-8** in the Content-Type is good practice. In short: use UTF-8 for JSON files and API payloads unless you have a specific reason otherwise.

---

## 10) What Breaks When JSON Is Invalid

If you **JSON.parse** invalid text, it throws. Your script can crash or, in a server, the request fails. Fix the **source** of the JSON: remove trailing commas, quote keys, use double quotes for strings, remove comments. If the JSON comes from a file, open the file and correct the syntax; if it comes from an API client, the client must send valid JSON. If you **generate** JSON by hand (e.g. building a string), prefer **JSON.stringify** so the output is always valid; avoid building JSON with string concatenation, which can produce invalid text (e.g. unescaped quotes). If you allow user input to be embedded in JSON (e.g. a string value), escape it properly or use **JSON.stringify** for the value so that **"** and **\** are escaped. Deeply nested structures (many levels of objects and arrays) are valid JSON but can be hard to edit by hand and can consume more memory when parsed; keep config and API payloads reasonably flat when possible. Very large JSON files (e.g. huge arrays) may cause high memory use when parsed all at once; streaming or line-by-line (JSONL) patterns can help for big data.

---

## 11) Homestead Example: config.json

A small Node service might have **config.json** next to the script:

```json
{
  "port": 3000,
  "sensors": ["coop", "fence", "solar"],
  "alertEmail": null,
  "debug": false
}
```

Valid: double-quoted keys, double-quoted strings, numbers, boolean, **null**, no trailing commas. The script reads it with **fs.readFile** and **JSON.parse** and uses **config.port**, **config.sensors**, etc. If someone edits **config.json** and adds **// comment** or **"port": 3000,** (trailing comma), the next restart will throw. A one-line “validate config” script that does **JSON.parse(await fs.readFile("config.json", "utf8"))** can catch that before deploy, or you handle the error at startup and log “Invalid config.json: …” so the fix is obvious. As you add more config keys (e.g. **sensorIds**, **alertCooldownSeconds**), keep the file valid: double-quoted keys, no trailing commas, and no comments. If you need to document what a key does, keep a separate **README** or **CONFIG.md** or use a **_comment** key (some teams use a reserved key like **"_comment"** with a string value; it is valid JSON and can be ignored by the app).

---

## 12) Checklist

Before moving on, you should be able to:

1. Write a valid JSON object and array with strings, numbers, booleans, and **null**.
2. State that keys and strings use **double quotes** only; no single quotes, no unquoted keys.
3. List at least three things JSON does not allow: trailing commas, comments, **undefined**, functions.
4. Fix invalid JSON that has a trailing comma, unquoted key, or single-quoted string.
5. Use escape sequences **\"** and **\\** (and **\n**, **\t**) correctly inside JSON strings.
6. Explain that JSON is text; **JSON.parse** turns it into a JavaScript value; config files and API bodies are common uses in Node.
7. Know that whitespace between tokens is allowed and that JSON Lines (one value per line) is a variant you parse by splitting and parsing each line.

---

## Common Pitfalls

- **Trailing comma**: Easy to add when editing by hand. Remove the comma before **}** or **]**.
- **Single quotes**: JSON requires double quotes. Replace **'** with **"** for keys and string values.
- **Unquoted keys**: JavaScript allows **{a: 1}**; JSON does not. Use **{"a": 1}**.
- **Comments**: JSON has no comments. Remove **//** and **/* */** or use a non-standard parser.
- **undefined in data**: Omit the key or use **null**. **JSON.stringify** omits **undefined** (Chapter 4.10), but if you build JSON by hand, do not write **undefined**.
- **Assuming JSON is JavaScript**: Valid JS is not always valid JSON. Check the rules when in doubt.
- **Forgetting the top level is one value**: A file with **{} {}** (two objects) is invalid. Use one wrapper object or array, or use JSONL (one value per line) and parse line by line.

---

## Practice: Try These

1. Write a small **config.json** with **port**, **name**, and **enabled** (boolean). Run **node -e "const fs=require('fs'); const j=JSON.parse(fs.readFileSync('config.json','utf8')); console.log(j);"** (or use a short script) and confirm it parses. Then add a trailing comma, run again, and see the parse error. Remove the comma and confirm it works again.
2. Write invalid JSON on purpose: unquoted key, single-quoted string, and a comment. Try **JSON.parse** on each (in Node or the browser console) and note the error messages. Fix each so it becomes valid.
3. Write a JSON string that contains a double quote and a newline (e.g. **"Say \"Hi\"\nNext line"**). Parse it and **console.log** the result to see the escaped form in the text and the actual characters after parse.
4. Look at your project’s **package.json**. Confirm that every key is double-quoted, there are no trailing commas, and there are no comments. That file is a real-world example of valid JSON.
5. In a small script, read **config.json** with **fs.promises.readFile** and **JSON.parse** in a try/catch. If parse fails, log **err.message** and exit with **process.exit(1)**. Use that pattern so invalid config fails fast with a clear error.
6. Write a tiny “JSON validator” script: read a file path from **process.argv[2]**, read the file, call **JSON.parse(text)** in try/catch, and print “Valid” or “Invalid:” plus the error message. Run it on a valid and an invalid JSON file to confirm.

These exercises lock in the syntax rules and the parse-validate workflow before you use **JSON.stringify** and **JSON.parse** in more detail in Chapter 4.10. If **JSON.parse** throws “Unexpected token” or “Unexpected end of JSON input,” look for a trailing comma, a missing quote, or truncated content. “Unexpected token” often points to the character where the parser gave up; check a few characters before that spot for the real mistake (e.g. a missing comma between properties, or an extra comma).

---

## Summary

**JSON** is a strict text format for data: objects **{}**, arrays **[]**, strings (double-quoted only), numbers, **true**/ **false**, and **null**. Keys must be in double quotes; no trailing commas; no comments; no **undefined**, functions, **NaN**, or **Infinity**. The top level must be a single value; whitespace between tokens is allowed. Dates and binary are represented as strings (e.g. ISO date string, Base64); validate structure and types in code after parsing if needed. Common errors are trailing commas, unquoted keys, single-quoted strings, and unescaped **"** or **\** in strings. Valid JSON can be parsed by **JSON.parse** to get a JavaScript value; invalid JSON throws. In Node you use JSON for **config files** (read with fs, then parse) and **API bodies** (parse request body, stringify response). Fix invalid JSON by applying the rules; prefer **JSON.stringify** when generating JSON so output is always valid. Whitespace (spaces, newlines) between tokens is allowed and does not change meaning; pretty-printed JSON is valid. For multiple records per file, JSON Lines (one JSON value per line) is a common pattern; parse by splitting lines and parsing each. Next, Chapter 4.10 covers **JSON.parse** and **JSON.stringify** in code, handling parse errors, and serializing JavaScript values to JSON (including the limits: no functions, **undefined** omitted).

---

## Next

Next: **Chapter 4.10: JSON — Parsing and Serialization**. That chapter covers **JSON.parse** and **JSON.stringify** in Node: parsing JSON text into JavaScript values, handling parse errors, and turning objects and arrays back into JSON text. You will use both for config, API bodies, and logging or storing data. With valid JSON syntax under your belt, you are ready to wire parse and stringify into your Node scripts and servers.
