"use strict";
/**
 * Code examples for Section B Phase 3, Chapters 3.13–3.16.
 * Run in Node: node Chapter_3.13_to_3.16_Code_Examples.mjs
 * (ESM: .mjs or "type": "module" in package.json)
 *
 * Ch 3.13: Event loop, callbacks, Promises — .then, .catch, .finally, Promise.all, Promise.race.
 * Ch 3.14: async/await, try/catch around await, sequential vs parallel (Promise.all).
 * Ch 3.15: ES modules — import named/default from Ch3.15_example_module.mjs.
 * Ch 3.16: JSON.stringify, JSON.parse, replacer, reviver, try/catch for parse.
 */

// ---------- Ch 3.15: Modules (ESM) — import from example module ----------
import getConfig, { API_BASE, DEFAULT_TIMEOUT, formatReading } from "./Ch3.15_example_module.mjs";
console.log("Ch 3.15 — imports:", API_BASE, DEFAULT_TIMEOUT);
console.log("  formatReading:", formatReading(12.3));
console.log("  default getConfig:", getConfig());

// ---------- Ch 3.13: Promises — create, then/catch/finally, Promise.all, Promise.race ----------
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), ms)
  );
}

// Wrap callback-based setTimeout in a Promise; .catch so rejections are handled
await delay(10)
  .then(() => "first")
  .then((x) => {
    console.log("Ch 3.13 — .then chain:", x);
    return "second";
  })
  .then((x) => console.log("  ", x))
  .catch((e) => console.error(e))
  .finally(() => console.log("  finally ran"));

// Promise.all: wait for all
const [a, b, c] = await Promise.all([
  delay(5).then(() => 1),
  delay(5).then(() => 2),
  delay(5).then(() => 3),
]);
console.log("Ch 3.13 — Promise.all result:", a, b, c);

// Promise.race: first to settle (e.g. timeout pattern)
const fast = delay(20).then(() => "done");
const slow = delay(100).then(() => "slow");
const winner = await Promise.race([fast, slow]);
console.log("Ch 3.13 — Promise.race winner:", winner);

// ---------- Ch 3.14: async/await — sequential vs parallel, try/catch ----------
async function fetchMock(id) {
  await delay(5);
  return { id, value: 12.1 + Math.random() };
}

async function loadSequential() {
  const r1 = await fetchMock("s1");
  const r2 = await fetchMock("s2");
  return [r1, r2];
}

async function loadParallel() {
  return await Promise.all([
    fetchMock("s1"),
    fetchMock("s2"),
    fetchMock("s3"),
  ]);
}

const seq = await loadSequential();
console.log("Ch 3.14 — sequential (2 calls):", seq.length);

const par = await loadParallel();
console.log("Ch 3.14 — parallel (3 calls):", par.length);

// try/catch around await
async function safeParseUrl(url) {
  try {
    await delay(5);
    if (!url) throw new Error("URL required");
    return { ok: true, url };
  } catch (e) {
    console.log("Ch 3.14 — catch:", e.message);
    return { ok: false, error: e.message };
  } finally {
    console.log("  (finally: cleanup)");
  }
}
await safeParseUrl("");
await safeParseUrl("https://example.com");

// ---------- Ch 3.16: JSON — stringify, parse, replacer, reviver ----------
const config = {
  sensorIds: ["s1", "s2"],
  threshold: 12,
  unit: "V",
  updatedAt: new Date("2025-02-24T12:00:00Z"),
};

// JSON.stringify: Date becomes ISO string; optional space for readability
const jsonStr = JSON.stringify(config, null, 2);
console.log("Ch 3.16 — stringify (excerpt):", jsonStr.slice(0, 80) + "...");

// Replacer: only include certain keys
const replacer = ["sensorIds", "threshold"];
console.log("Ch 3.16 — replacer keys:", JSON.stringify(config, replacer));

// JSON.parse with try/catch (untrusted input)
function parseJSONSafe(str, reviver) {
  try {
    return JSON.parse(str, reviver);
  } catch (e) {
    console.log("Ch 3.16 — parse error:", e.message);
    return null;
  }
}

const parsed = parseJSONSafe('{"a":1,"b":2}');
console.log("Ch 3.16 — parse safe:", parsed);

// Reviver: turn date strings back into Date objects
const withDateStr = '{"updatedAt":"2025-02-24T12:00:00.000Z"}';
const reviver = (key, value) => {
  if (key === "updatedAt" && typeof value === "string") {
    return new Date(value);
  }
  return value;
};
const withDate = parseJSONSafe(withDateStr, reviver);
console.log("Ch 3.16 — reviver Date:", withDate?.updatedAt instanceof Date);

// Invalid JSON
parseJSONSafe("not json");

// localStorage-style: stringify before save, parse on load with fallback
const prefs = { theme: "dark", sensors: ["s1"] };
const saved = JSON.stringify(prefs);
const loaded = JSON.parse(saved || "{}");
console.log("Ch 3.16 — round-trip prefs:", loaded.theme);

console.log("\nDone.");
