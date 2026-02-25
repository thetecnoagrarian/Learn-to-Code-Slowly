"use strict";
/**
 * Code examples for Section B Phase 3, Chapters 3.05–3.08.
 * Run in Node: node Chapter_3.05_to_3.08_Code_Examples.js
 *
 * Ch 3.05: if/else if/else, switch (with break), ternary, explicit checks, early returns.
 * Ch 3.06: for, while, do-while, for...of, for...in, break, continue.
 * Ch 3.07: Declarations vs expressions, parameters/return, arrow functions, callbacks.
 * Ch 3.08: Lexical/block scope, closures, factory functions, IIFE/block for one-off scope.
 */

// ---------- Ch 3.05: Conditions ----------

// if, else if, else — always use blocks
function showReadingStatus(reading, threshold) {
  if (reading !== undefined && reading !== null && !Number.isNaN(reading) && reading < threshold) {
    return "Low";
  }
  if (reading === undefined || reading === null) {
    return "—";
  }
  return "OK";
}
console.log(showReadingStatus(12.1, 11.5));  // "OK"
console.log(showReadingStatus(11.0, 11.5));  // "Low"
console.log(showReadingStatus(null, 11.5));  // "—"

// switch with break; intentional fall-through for "opening" / "closing"
function doorLabel(state) {
  switch (state) {
    case "open":
      return "Open";
    case "closed":
      return "Closed";
    case "opening":
    case "closing":
      return "...";
    default:
      return "?";
  }
}
console.log(doorLabel("open"));     // "Open"
console.log(doorLabel("closing")); // "..."

// Ternary for simple conditional value
const isOpen = true;
const label = isOpen ? "Open" : "Closed";
console.log(label);  // "Open"

// Early returns (guard clauses) instead of deep nesting
function formatReading(reading) {
  if (reading == null) return "—";
  if (Number.isNaN(reading)) return "—";
  return String(reading);
}
console.log(formatReading(12.3));   // "12.3"
console.log(formatReading(null));   // "—"

// ---------- Ch 3.06: Loops ----------

// for: known count
const zones = ["north", "south", "east"];
for (let i = 0; i < zones.length; i++) {
  // i is block-scoped; use zones[i]
}
console.log("for: 0..length-1");

// while: condition-only
let attempts = 0;
const maxAttempts = 3;
while (attempts < maxAttempts) {
  attempts++;
}
console.log("while attempts:", attempts);

// do-while: body runs at least once
let n = 0;
do {
  n++;
} while (n < 1);
console.log("do-while n:", n);

// for...of: values of iterable (array, string)
const readings = [12.1, 11.9, 12.4];
let sum = 0;
for (const r of readings) {
  sum += r;
}
console.log("for...of sum:", sum);

// for...in: keys of object (use for objects, not arrays)
const config = { threshold: 12, unit: "V" };
const keys = [];
for (const key in config) {
  if (Object.hasOwn(config, key)) {
    keys.push(key);
  }
}
console.log("for...in keys:", keys.join(", "));

// break and continue
let firstBelow = null;
for (const r of readings) {
  if (r == null || Number.isNaN(r)) continue;
  if (r < 12) {
    firstBelow = r;
    break;
  }
}
console.log("firstBelow 12:", firstBelow);

// ---------- Ch 3.07: Functions ----------

// Declaration: hoisted; can be called before the line it appears
function getBatteryReading(sensorId) {
  if (sensorId == null) return null;
  return 12.1;  // pretend fetch
}
console.log(getBatteryReading("s1"));  // 12.1

// Expression: not hoisted; assign or pass
const formatReadingWithUnit = function (value, unit) {
  if (value == null) return "—";
  return `${value} ${unit ?? "V"}`;
};
console.log(formatReadingWithUnit(12.3, "V"));  // "12.3 V"

// Default and rest parameters
function firstBelowThreshold(threshold, ...sensorIds) {
  for (const id of sensorIds) {
    const r = getBatteryReading(id);
    if (r != null && r < threshold) return id;
  }
  return null;
}
console.log(firstBelowThreshold(11, "s1", "s2"));  // null (12.1 >= 11)

// Arrow: short callback, no own this
const statuses = readings.map((r) => (r != null && r < 12 ? "Low" : "OK"));
console.log(statuses);

// Functions as values: callback
function forEachZone(zones, callback) {
  for (const zone of zones) {
    callback(zone);
  }
}
let count = 0;
forEachZone(zones, (z) => { count++; });
console.log("zones count:", count);

// Function that returns a function (leads into Ch 3.08 closures)
function createZoneHandler(zoneId) {
  return function () {
    console.log("Zone clicked:", zoneId);
  };
}
const handleNorth = createZoneHandler("north");
handleNorth();  // "Zone clicked: north"

// ---------- Ch 3.08: Scope and Closures ----------

// Lexical scope: inner sees outer; outer cannot see inner
function outer() {
  const outerVar = 1;
  function inner() {
    const innerVar = 2;
    return outerVar + innerVar;  // inner can read outerVar
  }
  return inner();
  // return innerVar;  // ReferenceError: innerVar not in scope
}
console.log("outer()+inner():", outer());

// Block scope: variable only inside block
{
  const temp = 42;
  console.log("block temp:", temp);
}
// console.log(temp);  // ReferenceError

// Closure: returned function remembers outer scope
function makeThresholdChecker(threshold) {
  return function (reading) {
    return reading != null && !Number.isNaN(reading) && reading < threshold;
  };
}
const isLowBattery = makeThresholdChecker(12);
console.log(isLowBattery(11.5));  // true
console.log(isLowBattery(12.5));  // false

// Loop + closure: use let (or for...of const) so each handler gets its own id
const handlers = [];
for (const id of ["a", "b", "c"]) {
  handlers.push(function () {
    return id;  // each closure captures that iteration's id
  });
}
console.log(handlers[0](), handlers[1](), handlers[2]());  // "a" "b" "c"

// One-off scope with a block (no IIFE needed when using let/const)
function example() {
  const shared = "result";
  {
    const temp = 100;
    console.log("one-off block temp:", temp);
  }
  return shared;
}
console.log(example());

// IIFE: one-off function scope (e.g. when modules not available)
const publicApi = (function () {
  const privateCount = 0;
  return {
    getCount() {
      return privateCount;
    },
  };
})();
console.log("IIFE getCount:", publicApi.getCount());

console.log("\nDone.");
