# Phase 2.7 · Chapter 2.7.8: npm — Installing and Using Packages

npm install <pkg>; require('package'); node_modules; global vs local; scripts (start, test, dev).

---

## Learning Objectives

- Install a package with npm install <pkg> and require or import it in code.
- Understand that node_modules holds dependencies; don’t edit or commit it.
- Prefer local installs (project node_modules) over global for app dependencies.
- Use npm run to execute scripts; npm start and npm test are shorthand.

---

## 1) Installing Packages

- [Expand: npm install express—saves to dependencies; npm install -D jest—saves to devDependencies.]
- [Expand: npm install from package.json (no name) installs all listed dependencies.]
- [Expand: node_modules is created/updated; each package can have its own node_modules (nested).]

---

## 2) require('package')

- [Expand: require("express") or import express from "express"; Node resolves from node_modules.]
- [Expand: resolution: current dir node_modules, then parent, then global; package main or exports field.]
- [Expand: local package: require("./lib/mylib") for files in your project.]

---

## 3) global vs local

- [Expand: npm install -g <pkg> puts CLI in global bin; usually for tools (nodemon, typescript).]
- [Expand: app code should use local install so each project has its own versions.]
- [Expand: npx <pkg> runs package without global install (e.g. npx create-react-app).]

---

## 4) scripts in Practice

- [Expand: "start": "node index.js" for production run; "dev": "node --watch index.js" or "nodemon index.js".]
- [Expand: "test": "node test.js" or "jest"; run with npm test.]
- [Expand: homestead: npm run dev for local server with reload.]

---

## Summary

- npm install adds packages to node_modules; require/import to use; don’t commit node_modules.
- Prefer local installs; use scripts for start, test, dev; use npx for one-off tools.

---

## Bridge / Next

Next: **Chapter 2.7.9 — JSON: Syntax and Structure**.

---

*Expansion note for ChatGPT: One install and require example. Target ~150 lines.*
