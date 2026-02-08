# Phase 1 · Chapter 1.10: Dictionaries and Named Systems

Phase 0.10 established a critical rule: failure is normal. Missing data is not exceptional. Phase 0.8 established that boundaries validate data. Dictionaries are Python's primary tool for working honestly with that reality.

Chapter 1.9 showed how lists, tuples, and sets group values—by position (list, tuple) or by uniqueness (set). This chapter introduces dictionaries, which group values by name. Where lists answer "what is the nth item?," dictionaries answer "what value is associated with this name?" That difference changes how systems are designed, reasoned about, and debugged.

This chapter is about:
	•	What dictionaries really are
	•	Why named access matters
	•	How missing keys represent real failure modes
	•	How dictionaries become system boundaries, configuration, and state

## 1) Why Dictionaries Exist at All

Lists answer the question:

“What is the nth item?”

Dictionaries answer a different question:

“What value is associated with this name?”

As soon as meaning matters more than order, lists stop being enough. Homestead example: readings[0] might be voltage or timestamp—you have to remember. sensor_data["voltage"] is explicit. coop_sensor["temp"] is explicit. Named access documents meaning.

## 2) Dictionaries Are Named State

A dictionary is a collection of key → value mappings (Chapter 1.2: state is tracked in variables—a dict is one variable holding named state).

sensor_data = {
    "voltage": 12.1,
    "timestamp": "2025-01-30"
}

Or: coop_sensor = {"temp": 75.3, "humidity": 0.65, "timestamp": "2025-01-30"}. Or: fence_packet = {"voltage": 4.2, "energized": True}. Or: solar_packet = {"watts": 1200, "producing": True}.

Here:
	•	Keys are names
	•	Values are data
	•	The dictionary is a state container

This is not cosmetic.
This is structure.

## 3) Keys Are Meaning, Not Position

In a list:

readings = [12.1, "2025-01-30"]

What is readings[0]?
What is readings[1]?

You have to remember.
The code does not tell you.

In a dictionary:

sensor_data["voltage"]
sensor_data["timestamp"]

The meaning is explicit.

## 4) Dictionaries Compress Reality Without Lying

Recall Phase 0.11: abstraction must not lie.

A dictionary compresses:
	•	Multiple variables
	•	Into one named structure
	•	Without losing meaning

Each key documents what the value represents.

This is abstraction done correctly.

## 5) Dictionary Keys Must Be Unique

Each key appears at most once.

{"voltage": 12.1, "voltage": 12.0}

The second value overwrites the first.

This is intentional.
A key represents the value for that concept.

## 6) Dictionary Values Can Be Anything

Values can be:
	•	Numbers
	•	Strings
	•	Booleans
	•	None
	•	Lists
	•	Other dictionaries

This makes dictionaries ideal for modeling real systems.

## 7) Accessing Values With []

The simplest access form:

voltage = sensor_data["voltage"]

This means:

“I expect this key to exist.”

If the key is missing, Python raises a KeyError (Chapter 1.1: programs can have errors—KeyError is explicit failure).

This is not a bug.
This is enforcement. Failure mode: sensor_data["voltage"] when ESP32 sends {"temp": 75, "humidity": 0.65} without "voltage"—KeyError. The key documents the contract. Missing key = contract violated.

## 8) KeyError Is a Boundary Violation

A KeyError tells you:
	•	You assumed data existed
	•	Reality disagreed
	•	Your boundary was wrong or missing

This is Phase 0.8 and 0.10 in action.

Sometimes you want this failure.

## 9) When [] Is the Right Choice

Use [] when:
	•	The key must exist
	•	Absence indicates a programmer error
	•	The system cannot proceed safely without it

Examples:
	•	Required configuration
	•	Internal invariants
	•	Critical system state

Fail fast.
Fail loud.

## 10) The .get() Method: Designing for Absence

.get() accesses a key safely.

voltage = sensor_data.get("voltage")

Or: coop_temp = coop_sensor.get("temp"). Or: fence_v = fence_packet.get("voltage"). Or: solar_w = solar_packet.get("watts").

If the key is missing:
	•	No error
	•	None is returned (Chapter 1.7: None represents absence)

This encodes:

“Absence is allowed.”

That is a design choice.

## 11) .get() With Defaults

You can supply a default:

threshold = config.get("threshold", 12.1)

Or: temp_threshold = coop_config.get("temp_threshold", 85). Or: fence_threshold = fence_config.get("low_voltage_threshold", 2.0).

This means:
	•	Use the configured value if present
	•	Otherwise, fall back to a default

Defaults should be intentional, not accidental.

## 12) .get() vs [] Is a Design Decision

This is not a syntax choice.
It’s a semantic choice.
	•	[] → “This must exist.”
	•	.get() → “This might not exist.”

Mixing them carelessly creates bugs.

## 13) Dictionaries Make Failure Explicit

A missing key is not:
	•	A crash
	•	A surprise
	•	A weakness

It is information.

Dictionaries allow you to decide:
	•	Crash
	•	Default
	•	Skip
	•	Log
	•	Degrade

That choice belongs in code, not assumptions.

## 14) Iterating Over Dictionaries

Dictionaries support iteration (Chapter 1.4: for loops iterate over sequences—dicts are iterable):

for key in sensor_data:
    ...

This iterates over keys by default.

You can also be explicit:

for key in sensor_data.keys():
    ...
for value in sensor_data.values():
    ...
for key, value in sensor_data.items():
    ...

Each form communicates intent.

## 15) .items() Is the Most Honest Form

When you care about both name and value:

for key, value in sensor_data.items():
    log(key, value)

This keeps meaning attached to data.

## 16) Nested Dictionaries: Hierarchical Systems

Dictionaries can contain dictionaries.

system = {
    "battery": {"voltage": 12.1},
    "generator": {"state": "running"}
}

Or: system = {"coop": {"temp": 75, "fan_on": True}, "fence": {"voltage": 4.2, "energized": True}}. Or: system = {"solar": {"watts": 1200}, "battery": {"voltage": 12.1}}.

This models hierarchy naturally.

## 17) Nested Dictionaries Mirror Real Systems

Real systems are nested:
	•	System → subsystem → component → value

Nested dictionaries reflect this structure without forcing artificial order.

system["generator"]["state"]

This reads like the system.

## 18) Nested Access Requires Careful Boundaries

Each level might be missing.

system.get("generator", {}).get("state")

This is defensive.
It assumes failure is normal.

Alternatively:

system["generator"]["state"]

This assumes invariants hold.

Choose deliberately.

## 19) Dictionaries as Configuration Models

Configuration is named data.

That makes dictionaries perfect.

config = {
    "threshold": 12.1,
    "cooldown": 300,
    "enabled": True
}

Or: coop_config = {"temp_threshold": 85, "fan_cooldown": 60}. Or: fence_config = {"low_voltage_threshold": 2.0, "alert_enabled": True}. Or: solar_config = {"log_interval": 300}.

Keys document intent.
Values carry meaning.

## 20) Configuration Should Be Read-Mostly

Config dictionaries:
	•	Are usually loaded once
	•	Are rarely modified
	•	Should be treated as immutable by convention

Changing config at runtime is powerful—and dangerous.

## 21) Dictionaries vs Lists Revisited

Use a list when:
	•	Order matters
	•	You iterate sequentially
	•	You process history

Use a dictionary when:
	•	Meaning matters
	•	You look up by name
	•	Order is irrelevant or secondary

This distinction is foundational.

## 22) Dictionaries as State Containers

Instead of:

voltage = 12.1
generator_running = True
last_update = "2025-01-30"

You can group state:

state = {
    "voltage": 12.1,
    "generator_running": True,
    "last_update": "2025-01-30"
}

Or: coop_state = {"temp": 75, "fan_on": False, "last_update": "2025-01-30"}. Or: fence_state = {"voltage": 4.2, "energized": True}. Or: solar_state = {"watts": 1200, "producing": True}.

This makes state explicit and portable.

## 23) Grouped State Improves Reasoning

When state lives together:
	•	Passing state is easier
	•	Logging is easier
	•	Snapshotting is easier
	•	Testing is easier

State containers scale better than loose globals.

## 24) Dictionaries and Mutability

Dictionaries are mutable (Chapter 1.9: like lists, dicts can change in place).

state["voltage"] = 12.0

Or: coop_state["temp"] = 76. Or: fence_state["voltage"] = 4.1. This updates state in place.

Mutability means:
	•	Shared references see changes
	•	Side effects are possible
	•	Discipline is required

## 25) Dictionaries Need Invariants Too

Examples:
	•	Required keys must exist ("voltage" in sensor_data, "temp" in coop_sensor)
	•	Certain values must be types (voltage is float, fan_on is bool)
	•	Certain combinations must be valid (if generator_running, voltage must exist)

Dictionaries do not enforce invariants.
You must. Failure mode: assuming config["threshold"] exists when it might not—KeyError or logic error. Design: document required keys, validate on load, use .get() with intentional defaults for optional keys.

## 26) Homestead System Framing

In your systems—battery monitor, coop controller, poultry net, solar logger, pig barn, cow barn, ESP32:
	•	Sensor packets → dictionary (voltage, coop temp/humidity, fence voltage, solar watts—each with timestamp)
	•	Configuration → dictionary (thresholds, cooldowns, enabled flags per subsystem)
	•	System state → dictionary (voltage, generator_running; coop temp, fan_on; fence voltage, energized)
	•	Metadata → dictionary (sensor_id, timestamp, source)

Each key is a contract.
Each missing key is a question.

## Reflection

Think about a real system—battery monitor, coop controller, poultry net, solar logger, pig barn, cow barn, ESP32. While driving or working, ask:
	•	Which data is positional? (voltage history over time → list. sensor packet with named fields → dict.)
	•	Which data is named? (voltage, temp, humidity, timestamp → dict. Keys document meaning.)
	•	Where can data be missing? (ESP32 might omit "voltage" if sensor failed. Coop sensor might omit "humidity" if DHT22 partial read.)
	•	Where should absence crash the system? (Required config key missing → use [], fail fast.)
	•	Where should it degrade gracefully? (Optional "alert_enabled" missing → use .get("alert_enabled", False).)

Consider failure modes:
	•	What if a key you assume exists is missing? (KeyError or wrong default.)
	•	What if you use [] when you should use .get()? (Crashes on optional data.)
	•	What if you use .get() when the key must exist? (Hides bugs, returns None.)

Those answers determine whether to use lists or dictionaries—and how.

## Core Understanding

Say this until it feels obvious:

Dictionaries map names to values (key → value).
Keys represent meaning (voltage, temp, timestamp—not position).
Values carry data.
Use [] when keys must exist (fail fast on KeyError).
Use .get() when keys may be missing (return None or default).
Missing keys are a design case, not an error (Phase 0.10: failure is normal).
Dictionaries model structured data, configuration, and system state.

If this feels like Phase 0.10 fully grounded in Python mechanics, you’re exactly where you should be.

This chapter builds on Chapter 1.9 (collections—dicts are another collection type, keyed by name not position). Next up: Chapter 1.11 — Input, Output, and Program Boundaries, where we finally cross the line between your program and the outside world—and talk about why boundaries matter more than logic.