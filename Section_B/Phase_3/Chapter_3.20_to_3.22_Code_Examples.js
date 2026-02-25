"use strict";
/**
 * Code examples for Section B Phase 3, Chapters 3.20–3.22.
 * Run in Node: node Chapter_3.20_to_3.22_Code_Examples.js
 *
 * Ch 3.20: Strict mode, const/let, validation at boundaries, fail fast.
 * Ch 3.21: console.log/error/warn, console.table, console.time/timeEnd.
 * Ch 3.22: Expressions vs statements, where each is allowed, flow, side effects.
 */

// ---------- Ch 3.20: Strict mode and robust code ----------
// This file starts with "use strict" so undeclared variables throw, duplicate
// params are errors, etc. ES modules and class bodies are strict by default.

// Prefer const; use let only when reassigning
const API_BASE = "https://api.example.com";
let requestCount = 0;

// Declare in smallest scope
function processReadings(readings) {
  if (!Array.isArray(readings)) {
    throw new TypeError("readings must be an array");
  }
  const valid = readings.filter((r) => r != null && typeof r.value === "number");
  let sum = 0;
  for (const r of valid) {
    sum += r.value;
  }
  return sum / (valid.length || 1);
}

// Validate at boundary and throw with clear message
function loadConfig(config) {
  if (config == null || typeof config !== "object") {
    throw new Error("config must be an object");
  }
  if (!config.sensorIds || !Array.isArray(config.sensorIds)) {
    throw new Error("config.sensorIds must be a non-empty array");
  }
  return config;
}

const config = { sensorIds: ["s1", "s2"] };
loadConfig(config);
console.log("Ch 3.20 — validation passed");

// ---------- Ch 3.21: Console methods ----------

console.log("Ch 3.21 — log:", "message", { id: "s1", value: 12 });
console.error("Ch 3.21 — error (stderr):", "simulated error");
console.warn("Ch 3.21 — warn:", "optional config missing, using default");

// console.table: array of objects as table
const sensors = [
  { id: "s1", value: 12.1, unit: "V" },
  { id: "s2", value: 11.5, unit: "V" },
];
console.log("Ch 3.21 — table (array of objects):");
console.table(sensors);

// console.time / timeEnd
console.time("Ch 3.21 — timer");
for (let i = 0; i < 100; i++) {
  processReadings([{ value: 12 }]);
}
console.timeEnd("Ch 3.21 — timer");

// In real debugging: set breakpoints in DevTools Sources, or use debugger;
// run Node with node --inspect to attach Chrome DevTools.

// ---------- Ch 3.22: Expressions vs statements ----------

// Expression: produces a value. Used where a value is expected.
const two = 1 + 1;                           // 1 + 1 is expression
const label = `Sensor: ${two}`;              // ${} must be expression
const status = two > 1 ? "OK" : "Low";       // ternary is expression

// Statement: performs an action. if/for/return/const are statements.
if (two > 1) {
  console.log("Ch 3.22 — if body is statements");
}

// Cannot put statement where expression is required:
// const x = if (a) 1; else 2;   // syntax error
const x = two > 1 ? 1 : 2;      // use ternary when you need a value

// Arrow: concise body = single expression (no return needed)
const double = (n) => n * 2;
// Block body = statements; need return to produce value
const doubleBlock = (n) => {
  const result = n * 2;
  return result;
};
console.log("Ch 3.22 — expression in arrow:", double(3), doubleBlock(3));

// Template literal: only expression inside ${}
const value = 12.3;
const msg = `Reading: ${value >= 12 ? "OK" : "Low"}`;
console.log("Ch 3.22 — ternary in template:", msg);

// Side effects at boundaries: pure logic vs I/O
function parseReading(data) {
  if (data == null || typeof data.value !== "number") {
    throw new Error("Invalid reading shape");
  }
  return { id: data.id, value: data.value };
}
const parsed = parseReading({ id: "s1", value: 12.1 });
console.log("Ch 3.22 — pure parse result:", parsed);

// Flow: top-to-bottom; function call pushes frame, return pops
function a() {
  return 1;
}
function b() {
  const n = a();
  return n + 1;
}
console.log("Ch 3.22 — flow b() -> a():", b());

console.log("\nDone.");
