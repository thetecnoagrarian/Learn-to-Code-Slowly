"use strict";
/**
 * Code examples for Section B Phase 3, Chapters 3.17–3.19.
 * Run in Node: node Chapter_3.17_to_3.19_Code_Examples.js
 *
 * Ch 3.17: map, filter, reduce, forEach, find, findIndex, some, every, flatMap, sort.
 * Ch 3.18: Template literals, interpolation, multiline, escaping, tagged template.
 * Ch 3.19: throw new Error(), custom error classes, cause, rethrow.
 */

// ---------- Ch 3.17: Array methods and iteration ----------

const readings = [
  { id: "s1", value: 12.1, enabled: true },
  { id: "s2", value: 11.5, enabled: true },
  { id: "s3", value: 12.8, enabled: false },
];

// map: transform each element
const labels = readings.map((r) => `${r.id}: ${r.value}`);
console.log("Ch 3.17 — map:", labels);

// filter: keep only elements that pass
const enabled = readings.filter((r) => r.enabled);
console.log("Ch 3.17 — filter enabled:", enabled.length);

// reduce: single value (always pass initial value for empty safety)
const sum = readings.reduce((acc, r) => acc + r.value, 0);
const avg = sum / readings.length;
console.log("Ch 3.17 — reduce sum/avg:", avg.toFixed(2));

// reduce to lookup by id
const byId = readings.reduce((acc, r) => ({ ...acc, [r.id]: r }), {});
console.log("Ch 3.17 — reduce lookup:", Object.keys(byId).join(", "));

// forEach: side effects only (no return value, cannot break)
readings.forEach((r) => {
  if (r.enabled) console.log("  forEach:", r.id);
});

// find / findIndex: first match
const firstLow = readings.find((r) => r.value < 12);
console.log("Ch 3.17 — find first < 12:", firstLow?.id);

const idx = readings.findIndex((r) => r.id === "s2");
console.log("Ch 3.17 — findIndex s2:", idx);

// some / every
const anyLow = readings.some((r) => r.value < 12);
const allEnabled = readings.every((r) => r.enabled);
console.log("Ch 3.17 — some < 12:", anyLow, "every enabled:", allEnabled);

// flatMap: map then flatten one level
const zones = [
  { name: "north", sensorIds: ["a", "b"] },
  { name: "south", sensorIds: ["c"] },
];
const allIds = zones.flatMap((z) => z.sensorIds);
console.log("Ch 3.17 — flatMap ids:", allIds.join(", "));

// sort: copy first to avoid mutating; use compare for numbers/objects
const values = [10, 2, 1];
const sorted = [...values].sort((a, b) => a - b);
console.log("Ch 3.17 — sort numbers:", sorted);

const byValue = [...readings].sort((a, b) => a.value - b.value);
console.log("Ch 3.17 — sort by value:", byValue.map((r) => r.id).join(", "));

// Chain: filter then map
const lowLabels = readings.filter((r) => r.value < 12).map((r) => r.id);
console.log("Ch 3.17 — chain filter+map:", lowLabels);

// ---------- Ch 3.18: Template literals ----------

const sensorId = "freezer";
const reading = 12.34;
const unit = "V";
const threshold = 12;

// Interpolation
const line = `Sensor ${sensorId}: ${reading.toFixed(1)} ${unit}`;
console.log("Ch 3.18 — interpolation:", line);

// Ternary and nullish coalescing in template
const status = `Status: ${reading >= threshold ? "OK" : "Low"}`;
const safe = `Reading: ${reading ?? "—"}`;
console.log("Ch 3.18 — ternary:", status, "nullish:", safe);

// Multiline (newlines and indentation are part of the string)
const multiline = `Line 1
  Line 2
Value: ${reading}`;
console.log("Ch 3.18 — multiline:", multiline.includes("Line 1"));

// Escape literal backtick and ${
const escaped = `Literal backtick: \`, literal \${ not interpolated`;
console.log("Ch 3.18 — escaped:", escaped.includes("${"));

// Map to strings then join (common pattern)
const report = readings.map((r) => `  ${r.id}: ${r.value}`).join("\n");
console.log("Ch 3.18 — map+join:\n" + report);

// Tagged template: tag function receives (strings, ...values)
function tag(strings, ...values) {
  return strings.reduce((acc, s, i) => acc + s + (values[i] ?? ""), "");
}
const tagged = tag`Hello, ${sensorId}!`;
console.log("Ch 3.18 — tagged:", tagged);

// ---------- Ch 3.19: Throwing and custom errors ----------

// throw with template literal for context
function getSensor(id) {
  if (id == null || String(id).trim() === "") {
    throw new Error("Sensor id required");
  }
  const s = readings.find((r) => r.id === id);
  if (!s) throw new Error(`Sensor not found: ${id}`);
  return s;
}

try {
  getSensor("");
} catch (e) {
  console.log("Ch 3.19 — throw message:", e.message);
}

try {
  getSensor("missing");
} catch (e) {
  console.log("Ch 3.19 — throw with context:", e.message);
}

// Custom error class (set name so instanceof and e.name work)
class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConfigError";
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

try {
  throw new ConfigError("config.sensorIds must be an array");
} catch (e) {
  if (e instanceof ConfigError) {
    console.log("Ch 3.19 — ConfigError caught:", e.name, e.message);
  }
}

try {
  throw new ValidationError("Zone name cannot be empty", "zoneName");
} catch (e) {
  if (e.name === "ValidationError") {
    console.log("Ch 3.19 — ValidationError:", e.field, e.message);
  }
}

// Wrapping with cause
try {
  try {
    JSON.parse("invalid");
  } catch (inner) {
    throw new Error("Invalid config file", { cause: inner });
  }
} catch (e) {
  console.log("Ch 3.19 — wrapped message:", e.message);
  console.log("  cause:", e.cause?.message);
}

// Rethrow after log (same error propagates)
try {
  try {
    throw new Error("Original");
  } catch (e) {
    console.log("Ch 3.19 — log then rethrow:", e.message);
    throw e;
  }
} catch (e) {
  console.log("  rethrown caught:", e.message);
}

console.log("\nDone.");
