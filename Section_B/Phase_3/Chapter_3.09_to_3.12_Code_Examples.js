"use strict";
/**
 * Code examples for Section B Phase 3, Chapters 3.09–3.12.
 * Run in Node: node Chapter_3.09_to_3.12_Code_Examples.js
 *
 * Ch 3.09: Object literals, properties, methods and this, spread, destructuring.
 * Ch 3.10: Array literals, indexing, push/pop/slice, map/filter/reduce, find.
 * Ch 3.11: String methods (slice, indexOf, trim, split, replace), template literals.
 * Ch 3.12: try/catch/finally, throw new Error(), validation at boundaries.
 */

// ---------- Ch 3.09: Objects ----------

// Literals and property access (dot vs bracket)
const sensor = { id: "sensor1", reading: 12.3, unit: "V" };
console.log(sensor.reading);           // 12.3
console.log(sensor["unit"]);           // "V"
const key = "id";
console.log(sensor[key]);              // "sensor1" — bracket when key is variable

// Add/update/delete
sensor.timestamp = Date.now();
delete sensor.timestamp;

// Method: regular function so this is the object
const zone = {
  name: "north",
  enabled: true,
  start() {
    console.log("Starting zone:", this.name);
  },
};
zone.start();  // "Starting zone: north"

// Spread: shallow copy and merge
const defaults = { threshold: 12, unit: "V" };
const userConfig = { threshold: 11 };
const config = { ...defaults, ...userConfig };
console.log(config);  // { threshold: 11, unit: "V" }

// Immutable update: new object with one property changed
const updatedSensor = { ...sensor, reading: 11.9 };
console.log(updatedSensor.reading, sensor.reading);  // 11.9, 12.3

// Destructuring with defaults and renaming
const { id, reading, unit = "V" } = sensor;
console.log(id, reading, unit);

const { reading: value } = sensor;  // rename to value
console.log(value);

// Destructuring in function parameters (options object)
function formatReadingOpts({ threshold = 11, unit = "V" } = {}) {
  return `threshold=${threshold} unit=${unit}`;
}
console.log(formatReadingOpts());                    // defaults
console.log(formatReadingOpts({ threshold: 10 }));   // override one

// Guard when source might be null/undefined
const maybeSensor = null;
const { id: safeId = "—" } = maybeSensor ?? {};
console.log(safeId);  // "—"

// "key" in obj to test existence
console.log("reading" in sensor);   // true
console.log("missing" in sensor);    // false

// ---------- Ch 3.10: Arrays ----------

const readings = [12.1, 11.9, 12.4, 11.5];
console.log(readings[0], readings.length, readings[readings.length - 1]);

// Mutating: push, pop; non-mutating: slice() copies
const copy = readings.slice();
copy.push(13);
console.log(readings.length, copy.length);  // 4, 5

// slice(0, n) and slice(-n)
console.log(readings.slice(0, 2));   // [12.1, 11.9]
console.log(readings.slice(-2));    // [12.4, 11.5]

// map: transform each element
const statuses = readings.map((r) => (r < 12 ? "Low" : "OK"));
console.log(statuses);

// filter: keep only elements that pass
const lowReadings = readings.filter((r) => r < 12);
console.log(lowReadings);

// reduce: single value (always pass initial value for empty safety)
const sum = readings.reduce((acc, n) => acc + n, 0);
const avg = sum / readings.length;
console.log("avg:", avg);

const max = readings.reduce((a, b) => (b > a ? b : a), -Infinity);
console.log("max:", max);

// Chaining
const lowCount = readings.filter((r) => r < 12).length;
console.log("lowCount:", lowCount);

// find: first match
const firstLow = readings.find((r) => r < 12);
console.log("firstLow:", firstLow);

// Array.isArray before using array methods
const data = [1, 2, 3];
console.log(Array.isArray(data));   // true
console.log(Array.isArray({}));     // false

// sort with compare function for numbers (mutates; copy first to preserve original)
const sorted = [...readings].sort((a, b) => a - b);
console.log(sorted);

// Array of objects: map/filter by property
const sensors = [
  { id: "s1", reading: 12.1 },
  { id: "s2", reading: 11.8 },
  { id: "s3", reading: 12.5 },
];
const ids = sensors.map((s) => s.id);
console.log(ids.join(", "));
const below12 = sensors.filter((s) => s.reading < 12);
console.log(below12.length);

// ---------- Ch 3.11: Strings ----------

const raw = "  12.3 V  ";
const trimmed = raw.trim();
console.log(trimmed);

const csv = "zone1,zone2,zone3";
const zones = csv.split(",");
console.log(zones);
console.log(zones.join(" | "));

const msg = "Sensor s1: Low";
console.log(msg.includes("Low"));       // true
console.log(msg.indexOf("s1"));        // 7
console.log(msg.slice(0, 10));         // "Sensor s1"
console.log(msg.slice(-3));            // "Low"

const lower = "OFF";
console.log(lower.toLowerCase());     // "off"
const replaced = msg.replace("Low", "OK");
console.log(replaced);

// Template literals: interpolation and multiline
const sensorId = "sensor1";
const displayReading = 12.34;
const displayUnit = "V";
const line = `Sensor ${sensorId}: ${displayReading.toFixed(1)} ${displayUnit}`;
console.log(line);

const multiline = `Line 1
Line 2
Value: ${displayReading}`;
console.log(multiline.includes("Value: 12.34"));

// Number formatting for display
console.log((12.345).toFixed(2));   // "12.35"

// ---------- Ch 3.12: Error handling ----------

// try / catch / finally
function parseConfig(jsonStr) {
  if (jsonStr == null || typeof jsonStr !== "string") {
    throw new TypeError("parseConfig expects a string");
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Invalid config JSON: ${e.message}`);
  }
}

try {
  parseConfig("not json");
} catch (e) {
  console.log("Caught:", e.message);
  console.log("Name:", e.name);
}

// finally runs whether or not an error was thrown
let cleaned = false;
try {
  parseConfig("{}");
} catch (e) {
  console.log(e.message);
} finally {
  cleaned = true;
}
console.log("finally ran:", cleaned);

// Validation at boundary: throw with clear message
function getReadingForSensor(sensorId) {
  if (sensorId == null || String(sensorId).trim() === "") {
    throw new Error("Sensor id required");
  }
  return 12.1;  // pretend fetch
}

try {
  getReadingForSensor("");
} catch (e) {
  console.log("Validation error:", e.message);
}

// Rethrow to preserve stack after logging (outer catch so script still exits 0)
try {
  try {
    JSON.parse("invalid");
  } catch (e) {
    console.log("Parse failed:", e.message);
    throw e;  // rethrow same error so caller can handle
  } finally {
    // cleanup only; avoid return/throw in finally
  }
} catch (_) {
  console.log("(Rethrown error caught by outer handler)");
}

console.log("\nDone.");
