"use strict";
/**
 * Code examples for Section B Phase 3, Chapters 3.23–3.25.
 * Run in Node: node Chapter_3.23_to_3.25_Code_Examples.js
 *
 * Ch 3.23: One script — entry point, boundaries, helpers, main flow.
 * Ch 3.24: Application pattern — state, single render, event-style entry points.
 * Ch 3.25: Phase 3 recap — same language and habits in one place.
 */

// ---------- Structure: constants and config (Ch 3.23) ----------
const DEFAULT_REFRESH_MS = 5000;

// ---------- Boundary: validate at the edge (Ch 3.20, 3.19) ----------
function validateConfig(config) {
  if (config == null || typeof config !== "object") {
    throw new Error("config must be an object");
  }
  if (!Array.isArray(config.sensorIds) || config.sensorIds.length === 0) {
    throw new Error("config.sensorIds must be a non-empty array");
  }
}

// ---------- Helpers: one job each (Ch 3.23) ----------
function formatReading(reading) {
  if (reading == null || reading.value == null) return "—";
  return `${reading.id}: ${Number(reading.value).toFixed(1)}`;
}

function parseReadings(raw) {
  if (!Array.isArray(raw)) {
    throw new Error("API response must be an array of readings");
  }
  return raw.map((r) => {
    if (r == null || typeof r.id !== "string" || typeof r.value !== "number") {
      throw new Error(`Invalid reading shape: ${JSON.stringify(r)}`);
    }
    return { id: r.id, value: r.value };
  });
}

// ---------- State and single render (Ch 3.24) ----------
const state = {
  readings: [],
  loading: false,
  error: null,
};

function render(appState) {
  if (appState.loading) {
    console.log("[Render] Loading...");
    return;
  }
  if (appState.error) {
    console.log("[Render] Error:", appState.error);
    return;
  }
  if (appState.readings.length === 0) {
    console.log("[Render] No readings");
    return;
  }
  console.log("[Render] Readings:", appState.readings.map(formatReading).join(", "));
}

// ---------- Simulated boundary: "fetch" (Ch 3.13, 3.14) ----------
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchReadings(sensorIds) {
  return delay(10).then(() =>
    sensorIds.map((id, i) => ({ id, value: 12 + i * 0.5 }))
  );
}

// ---------- Main flow: load dashboard (Ch 3.23, 3.24) ----------
async function loadDashboard(config) {
  state.loading = true;
  state.error = null;
  render(state);

  try {
    validateConfig(config);
    const raw = await fetchReadings(config.sensorIds);
    state.readings = parseReadings(raw);
    state.loading = false;
    render(state);
  } catch (e) {
    state.loading = false;
    state.error = e.message;
    render(state);
  }
}

// ---------- Entry point (Ch 3.23) ----------
async function main() {
  console.log("Ch 3.23 — Entry point: main()");
  const config = { sensorIds: ["s1", "s2", "s3"] };
  await loadDashboard(config);

  console.log("\nCh 3.24 — Simulated 'refresh': call loadDashboard again");
  await loadDashboard(config);

  console.log("\nCh 3.24 — Invalid config (boundary validation):");
  await loadDashboard({ sensorIds: [] });
  // state.error is set and render() shows it; no unhandled throw

  console.log("\nCh 3.25 — Recap: same script uses variables, types, conditions,");
  console.log("  functions, objects, arrays, async/await, try/catch, validation,");
  console.log("  state, and single render. Ready for Phase 4 (Node) or Phase 8 (DOM).");
  console.log("\nDone.");
}

main().catch((e) => {
  console.error("Unhandled:", e.message);
  process.exitCode = 1;
});
