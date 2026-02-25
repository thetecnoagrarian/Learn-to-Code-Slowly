/**
 * Example module for Ch 3.15: named exports and default export.
 * Import from Chapter_3.13_to_3.16_Code_Examples.mjs
 */

export const API_BASE = "https://api.example.com";
export const DEFAULT_TIMEOUT = 5000;

export function formatReading(value, unit = "V") {
  if (value == null) return "—";
  return `${Number(value).toFixed(1)} ${unit}`;
}

// Default export: one main value
export default function getConfig() {
  return { apiBase: API_BASE, timeout: DEFAULT_TIMEOUT };
}
