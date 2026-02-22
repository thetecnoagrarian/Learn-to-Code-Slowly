# Phase 2.7 · Chapter 2.7.3: Built-in Modules — path and fs

path.join, path.resolve; fs.readFile, fs.writeFile (sync vs async); fs.promises; file paths and portability.

---

## Learning Objectives

- Use path.join and path.resolve for portable paths; __dirname and path relative to script.
- Read and write files with fs.readFile and fs.writeFile; choose sync vs async (prefer async).
- Use fs.promises for Promise-based API (async/await).
- Avoid hardcoding path separators; use path module for cross-platform paths.

---

## 1) path Module

- [Expand: path.join("dir", "sub", "file.txt")—joins with correct separator; path.resolve("dir", "file")—absolute.]
- [Expand: __dirname (CommonJS) = directory of current module; path.join(__dirname, "data.json").]
- [Expand: path.basename, path.dirname, path.extname for parsing.]

---

## 2) fs — readFile and writeFile

- [Expand: fs.readFile(path, options, callback); fs.writeFile(path, data, options, callback); encoding: "utf8".]
- [Expand: sync versions: fs.readFileSync, fs.writeFileSync—block the event loop; avoid in server code.]
- [Expand: options: { encoding: "utf8" } or "utf8" as second arg.]

---

## 3) fs.promises

- [Expand: const fs = require("fs").promises; or import fs from "fs/promises";]
- [Expand: fs.readFile(path, "utf8") returns Promise; use async/await.]
- [Expand: same operations, Promise-based; prefer over callbacks in new code.]

---

## 4) Portability and Paths

- [Expand: / and \ differ on Windows; path.join and path.resolve abstract that.]
- [Expand: don’t assume cwd; use __dirname or process.cwd() explicitly when needed.]
- [Expand: homestead: config and data files via path.join(__dirname, "..", "config.json").]

---

## Summary

- path.join/resolve for portable paths; fs.readFile/writeFile (async or fs.promises); avoid sync in servers.
- Use path module and __dirname for reliable, cross-platform file paths.

---

## Bridge / Next

Next: **Chapter 2.7.4 — Built-in Modules: http and Streams**.

---

*Expansion note for ChatGPT: One path example and one fs.readFile/writeFile example. Target ~150 lines.*
