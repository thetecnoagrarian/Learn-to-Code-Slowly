"use strict";
/**
 * Code examples for Section B Phase 3, Chapters 3.01–3.04.
 * Run in Node: node Chapter_3.01_to_3.04_Code_Examples.js
 * Or load in browser as a script. Same language in both environments.
 *
 * Ch 3.01: JavaScript runs top-to-bottom; this file is a script (or module).
 * Ch 3.02: let, const, block scope, reassignment vs mutation, no var.
 * Ch 3.03: Primitives, typeof, strict equality, NaN, falsy, explicit conversion.
 * Ch 3.04: Arithmetic, comparison (===), logical (&&, ||, !), ?., ??.
 */

// ---------- Ch 3.02: Variables (let, const, block scope) ----------

const API_BASE = "https://api.example.com";        // const: binding never reassigned
let batteryVoltage = 12.4;                          // let: value may change (e.g. after fetch)

{
  const threshold = 11.8;                           // block scope: threshold only exists here
  let reading = 12.1;
  // reading = 11.5;                                // reassignment allowed for let
  if (reading < threshold) {
    const alertMsg = "Low voltage";                 // block inside block: own scope
    console.log(alertMsg);
  }
}
// console.log(threshold);                          // ReferenceError: threshold not in scope

const config = { min: 10, max: 15 };               // const: binding fixed, object is mutable
config.max = 20;                                   // mutation allowed
// config = {};                                     // reassignment not allowed for const

// ---------- Ch 3.03: Types and values ----------

const n = 42;
const s = "homestead";
const b = true;
const u = undefined;
const nil = null;

console.log(typeof n);                             // "number"
console.log(typeof s);                             // "string"
console.log(typeof b);                             // "boolean"
console.log(typeof u);                             // "undefined"
console.log(typeof nil);                           // "object" (historic quirk; use === null to detect)

const notANumber = 0 / 0;                          // NaN
console.log(Number.isNaN(notANumber));             // true; NaN !== NaN, so use Number.isNaN(x)

// Strict equality: no coercion
console.log(5 === "5");                            // false
console.log(5 === 5);                              // true
console.log(null === undefined);                   // false

// Explicit conversion at boundaries
const fromString = Number("12.5");                 // 12.5
const fromInvalid = Number("abc");                  // NaN
const toStr = String(12.4);                        // "12.4"

// Falsy: false, 0, "", null, undefined, NaN (and 0n). All else truthy.
// So 0 and "" are falsy; use explicit checks when they are valid values.

// ---------- Ch 3.04: Operators ----------

// Arithmetic (ensure numbers to avoid string concatenation with +)
const sum = 10 + 2;                                // 12
const concat = 10 + "2";                           // "102" (string!)
const safeSum = Number(10) + Number("2");          // 12

const remainder = 7 % 3;                           // 1
const power = 2 ** 10;                             // 1024

// Comparison: prefer === and !==
const reading = 12.1;
const threshold = 11.8;
console.log(reading < threshold);                  // false
console.log(reading === 12.1);                     // true

// Logical: short-circuit
const name = "" || "Anonymous";                    // "Anonymous" ("" is falsy)
const count = 0 ?? 10;                             // 0 (nullish coalescing: only null/undefined)
const countMissing = null ?? 10;                   // 10

// Optional chaining: safe access when value might be null/undefined
const response = { data: { sensors: { battery: 12.4 } } };
const voltage = response?.data?.sensors?.battery;  // 12.4
const missing = response?.data?.missing?.x;        // undefined (no throw)

// Guard with &&: only access if previous is truthy
const user = { name: "Alice" };
const userName = user && user.name;               // "Alice"
const noUser = null && null.name;                  // null (short-circuit, no .name access)

// Ternary (expression)
const isOpen = true;
const statusLabel = isOpen ? "Open" : "Closed";   // "Open"

// Homestead-style: threshold check with explicit types and ??
const config2 = { threshold: 11.8 };
const thresh = config2?.threshold ?? 12.0;         // 11.8; if config2 or threshold missing → 12.0
const reading2 = 12.4;
if (typeof reading2 === "number" && !Number.isNaN(reading2) && reading2 < thresh) {
  console.log("Alert: low voltage");
}
