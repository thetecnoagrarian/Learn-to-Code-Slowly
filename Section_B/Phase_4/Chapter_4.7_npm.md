# Phase 2.7 · Chapter 2.7.7: npm — Package Management

npm init; package.json (name, version, scripts, dependencies); npm install and package-lock.json; semantic versioning.

---

## Learning Objectives

- Run npm init to create package.json; understand name, version, and main.
- Add scripts (start, test, dev) and run them with npm run <script>.
- Install dependencies and record them in dependencies; understand package-lock.json.
- Use semantic versioning (major.minor.patch) for version numbers.

---

## 1) npm init and package.json

- [Expand: npm init or npm init -y; creates package.json with name, version, description, main, scripts.]
- [Expand: name and version are required for publishing; main is entry point.]
- [Expand: "private": true to avoid accidental publish.]

---

## 2) scripts

- [Expand: "scripts": { "start": "node index.js", "test": "node test.js", "dev": "node --watch index.js" }.]
- [Expand: npm run start or npm start (start and test are special); npm run dev.]
- [Expand: use for running app, tests, and dev tooling.]

---

## 3) dependencies and npm install

- [Expand: npm install <pkg> adds to dependencies and creates/updates node_modules and package-lock.json.]
- [Expand: package-lock.json locks exact versions for reproducible installs; commit it.]
- [Expand: npm install (no package) installs from package.json and lock file.]

---

## 4) Semantic Versioning

- [Expand: major.minor.patch; breaking = major; new feature = minor; bugfix = patch.]
- [Expand: In dependencies: ^1.2.3 (allow minor/patch), ~1.2.3 (patch only), or exact 1.2.3.]
- [Expand: lock file pins exact versions; npm update to refresh within range.]

---

## Summary

- package.json: name, version, scripts, dependencies; npm init to create; npm install to add deps.
- package-lock.json for reproducible installs; use semver and scripts for run/test/dev.

---

## Bridge / Next

Next: **Chapter 2.7.8 — npm: Installing and Using Packages**.

---

*Expansion note for ChatGPT: One package.json example with scripts. Target ~150 lines.*
