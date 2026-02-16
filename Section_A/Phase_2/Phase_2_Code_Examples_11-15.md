# Phase 1 Code Examples (Chapters 11-15)

This file contains visual references for all code examples mentioned in Phase 1 chapters 11-15. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 1.11: Input, Output, and Boundaries

### 1) Programs Live Inside, Reality Lives Outside (Line ~16)

**Context:** Inside: well-typed, predictable. Outside: missing data, changed formats, timing issues, human mistakes, corrupted files, lying sensors, failed networks.

```python
# Inside: variables well-typed, assumptions hold, logic predictable
# Outside: sensor timeout, ESP32 offline, DHT22 weird format, network latency,
#          typos in config, log file truncated, sensors lie, WiFi drops

# I/O = where those two worlds meet
```

---

### 2) Boundaries Are Where Programs Are Honest (Line ~34)

**Context:** Boundary = where data enters or leaves; inside you can assume; at boundary you must not.

```python
# Boundaries: user input, sensor readings, files, network responses, logs, console
# Inside the boundary: can assume
# At the boundary: must not assume
```

---

### 3) print() Is Output, Not Logic (Line ~51)

**Context:** print() sends text to stdout; doesn't change variables, control flow, or state; reveals state = observation.

```python
voltage = 12.1
print(f"Voltage: {voltage}")  # reveals state, doesn't change it

# print() is observation, not action
```

---

### 4) print() as a Boundary Tool (Line ~64)

**Context:** Use print() to observe, confirm, explain, debug, log; not to drive logic, replace returns, hide missing data.

```python
# Good uses:
print(f"voltage={voltage}")  # observe state
print(f"Starting generator")  # log event
print(f"Threshold check: {voltage < 12.1}")  # debug

# Bad uses: drive logic, replace return, hide missing data
```

---

### 5) print() and Phase 0.12 (Line ~79)

**Context:** print() is pure observation; removing it should not change program behavior.

```python
# If removing print() changes behavior, something is wrong
voltage = read_sensor()
print(f"voltage={voltage}")  # observation only
if voltage < 12.1:
    start_generator()
```

---

### 6) Console Output Is for Humans (Line ~87)

**Context:** Console for you, operators, debugging; programs shouldn't depend on humans reading output.

```python
# Console output for: you, operators, debugging, learning
# Programs should not depend on humans reading correctly
# print() never substitutes return values or state updates
```

---

### 7) input() Is an Input Boundary (Line ~99)

**Context:** input() reads text from user; pauses, waits, returns a string—always a string.

```python
user_input = input("Enter threshold: ")
# Always returns a string, never int, float, or anything else
# user_input is str, even if user types "12.1"
```

---

### 8) input() Introduces Uncertainty (Line ~113)

**Context:** User controls nothing: content, format, timing, correctness; raw, untrusted data.

```python
user_input = input("Enter voltage: ")
# You don't control: what user types, formatting, timing, correctness
# Raw, untrusted data
```

---

### 9) Treat All Input as Untrusted (Line ~123)

**Context:** Even your own input; never assume numeric, present, valid, or meaningful; validation starts immediately.

```python
# Never assume input is: numeric, present, valid, meaningful
# Validation starts immediately
user_input = input("Enter threshold: ")
# Could be: "12.1", "twelve", "", "12.1 volts", "error"
```

---

### 10) Input Is Not Data Yet (Line ~136)

**Context:** Until validated and converted, input is text, ambiguous, unsafe; only after validation = data.

```python
user_input = input("Enter threshold: ")  # text, ambiguous, unsafe
# Not data yet—just text

# After validation and conversion:
threshold = float(user_input)  # now it's data (if conversion succeeds)
```

---

### 11) File I/O Is a Boundary Too (Line ~147)

**Context:** Files are external state; exist outside memory, outside execution, across runs; read = input, write = output.

```python
# Files: outside memory, outside execution, across runs
# Reading from file = input (boundary crossing)
# Writing to file = output (boundary crossing)
```

---

### 12) Reading Files: Data Crossing In (Line ~161)

**Context:** Assume file exists, permissions OK, contents correct, format unchanged—all can fail.

```python
# When reading config.json, voltage_log.txt, coop_state.json:
# Assume: exists, permissions, correct contents, format unchanged
# All assumptions can fail

with open("config.json") as f:
    contents = f.read()
# What if missing? Permission denied? Corrupted? Wrong format?
```

---

### 13) Writing Files: Data Crossing Out (Line ~171)

**Context:** Writing = change outside world, persistent effects, failure modes; disk full, permission denied, path missing.

```python
# Writing changes outside world; persistent effects; failure modes
# Disk full, permission denied, path missing

with open("voltage_log.txt", "a") as f:
    f.write(f"{voltage},{timestamp}\n")
# What if disk full? Permission denied? Path missing?
```

---

### 14) Always Use with for Files (Line ~185)

**Context:** with opens file, guarantees closure, prevents leaks, handles early exits; correctness, not style.

```python
with open("config.json") as f:
    contents = f.read()
# File closed even if error occurs

# Without with: exception → file handle leaks
# On Pi or ESP32: exhaust file descriptors
```

---

### 15) Files Persist, Variables Do Not (Line ~203)

**Context:** Variables = memory, temporary; files = persist across runs, outlive crashes, accumulate history.

```python
# Variables: exist only in memory, disappear when program ends
voltage = 12.1  # gone when program stops

# Files: persist across runs, outlive crashes, accumulate history
with open("voltage_log.txt", "a") as f:
    f.write(f"{voltage}\n")  # survives restart
```

---

### 16) Persistence Is a Design Choice (Line ~217)

**Context:** Decide explicitly: what persists (coop state, fence voltage), what doesn't, what can be reconstructed.

```python
# Decide explicitly:
# Must persist: coop state, last fence voltage, solar totals
# Must not: temporary calculations
# Can reconstruct: derived values from raw data
# Must survive failure: critical state
```

---

### 17) Type Conversion Is Boundary Work (Line ~227)

**Context:** External data arrives as strings; program needs int, float, bool; conversion happens at boundary.

```python
# From input(), files, networks, sensors: all strings
user_input = input("Threshold: ")  # str
file_line = f.readline()           # str
mqtt_payload = message.payload     # str

# Program needs: int, float, bool, structured data
threshold = float(user_input)  # conversion at boundary
```

---

### 18) Conversion Is Not Guaranteed (Line ~243)

**Context:** Conversion can fail; int("abc"), float(""), float("12.3 volts"), bool("False")—ValueError or wrong result.

```python
int("abc")          # ValueError
float("")           # ValueError
float("12.3 volts") # ValueError—not a pure number
bool("False")       # True! Non-empty string is truthy

# Homestead: sensor returns "ERR", config has "threshold": "high"
# Validate before converting
```

---

### 19) Conversion Failures Are Boundary Failures (Line ~254)

**Context:** Conversion error = input malformed, assumption wrong, validation missing.

```python
# Conversion error means:
# - Input malformed
# - Assumption wrong
# - Validation missing or incomplete
# This is where error handling belongs
```

---

### 20) Validate Early, Validate Once (Line ~263)

**Context:** Validate as soon as data enters; reject or normalize immediately; don't re-validate deep inside.

```python
# Validate at boundary, not deep inside logic
def read_threshold():
    user_input = input("Threshold: ")
    # Validate immediately
    try:
        threshold = float(user_input)
    except ValueError:
        return None  # or default
    return threshold

# Core logic receives clean, validated data
```

---

### 21) Boundaries Defend the Core (Line ~272)

**Context:** Core = logic; edges = I/O; I/O at edges, not buried; boundaries protect core from bad data.

```python
# Core: logic (functions, decisions)
# Edges: I/O (input, files, sensors)

# I/O at edges, not buried in core
# Boundaries protect core from bad data

# Weak boundaries → defensive core → complexity explodes → bugs hide
```

---

### 22) String Formatting Is Output Hygiene (Line ~287)

**Context:** Readable, consistent, explicit; f-strings make output honest and clear.

```python
voltage = 12.1
print(f"Battery: {voltage}V")   # clear, explicit
print("Battery:", voltage, "V")  # works but less explicit
```

---

### 23) Output Is Not Storage (Line ~302)

**Context:** Printing ≠ persistence; logging ≠ storage; seeing ≠ saving; write explicitly if data must survive.

```python
# Printing is not persistence
print(f"voltage={voltage}")  # not saved

# If data must survive:
with open("voltage_log.txt", "a") as f:
    f.write(f"{voltage}\n")  # explicitly stored
```

---

### 24) Input, Output, and Observation vs Action (Line ~313)

**Context:** Reading = observes outside world; writing = acts on outside world; keep them separate.

```python
# Reading: observes outside world
voltage = read_sensor()

# Writing: acts on outside world
with open("log.txt", "a") as f:
    f.write(f"{voltage}\n")

# Confusing them: feedback loops, partial updates, inconsistent state
```

---

### 25) Boundary Thinking in Homestead Systems (Line ~328)

**Context:** Sensors = input boundary (validate on read); logs = output; config = input (validate on load); state files = both; ESP32/MQTT = input.

```python
# Sensors: input boundaries (validate on read)
temp = read_dht22()
if temp is None or temp < -40 or temp > 150:
    handle_invalid()

# Logs: output boundaries
with open("voltage_log.txt", "a") as f:
    f.write(f"{voltage},{timestamp}\n")

# Config: input boundary (validate on load)
# State files: both (read on startup, write on update)
# ESP32/MQTT: input boundary (validate format and range)
```

---

### 26) Boundary Bugs Are the Worst Bugs (Line ~339)

**Context:** Intermittent, timing-dependent, environment-dependent, hard to reproduce; professionals obsess over boundaries.

```python
# Boundary bugs: appear intermittently, depend on timing, depend on environment
# sensor dropout, WiFi blip, SD card missing, config moved
# Hard to reproduce → professionals obsess over boundaries
```

---

### Reflection: Boundary Analysis (Line ~349)

**Context:** Where does data enter/leave? What assumptions? What when assumptions break? Where should validation live?

```python
# Where does data enter? sensors, config, user input, MQTT
# Where does it leave? logs, state files, alerts
# What assumptions? file exists, sensor returns number, format unchanged
# What when assumptions break? crash, wrong logic, silent failure

# Failure modes:
# Sensor returns "ERR" or -40? Validate range
# config.json missing or malformed? Check file, parse, validate
# print() but never persist? Print is observation; write for persistence
# int("abc")? Catch at boundary; reject or default
```

---

## Chapter 1.12: Errors, Exceptions, and Reality Failing

### 1) Errors Are Not Rare Events (Line ~18)

**Context:** In real systems, failure is the default; files missing, sensors timeout, data malformed, networks disappear.

```python
# Real systems: files missing, sensors timeout, data malformed, networks drop
# config.json moved, voltage_log.txt deleted
# DHT22 no response, voltage sensor offline
# ESP32 sends "ERR", config has typo
# WiFi drops, MQTT broker unreachable

# Failure is the default background condition
# Job: respond to failure correctly, not avoid it
```

---

### 2) What an Exception Is (Line ~35)

**Context:** Exception = signal raised when something goes wrong; assumption violated, operation failed; not punishment—information.

```python
# Exception: assumption violated, operation failed, reality ≠ expectation
# Not punishment—information
```

---

### 3) Exceptions Stop Execution by Default (Line ~48)

**Context:** Unhandled exception: execution stops, traceback printed, program exits; stopping is correct when "I don't know how to continue safely."

```python
# Unhandled exception: stops, traceback, exit
# "I do not know how to continue safely"
# Stopping is correct behavior
```

---

### 4) Silence Is More Dangerous Than Crashing (Line ~62)

**Context:** Crashing is loud; silently wrong is lethal; exceptions = Python refusing to lie.

```python
# Crashing program: loud
# Silently wrong program: lethal
# Exceptions: Python refusing to lie
```

---

### 5) Exceptions Are Structured Signals (Line ~69)

**Context:** Exception has type, message, location, call path; structure allows precise handling.

```python
# Exception has: type, message, location, call path
# ValueError: could not convert string to float: 'ERR'
# at coop_monitor.py, line 12
# call path: main() → process_packet() → float()
```

---

### 6) Common Exception Types (Line ~80)

**Context:** ValueError (wrong value), TypeError (wrong type), KeyError (missing key), IndexError, FileNotFoundError, ZeroDivisionError, AttributeError.

```python
# ValueError — value wrong or malformed (float("ERR"))
# TypeError — wrong type used
# KeyError — missing dictionary key (config["threshold"])
# IndexError — index out of bounds
# FileNotFoundError — file missing (config.json)
# ZeroDivisionError — invalid math
# AttributeError — object lacks expected behavior
```

---

### 7) Read Exception Names Literally (Line ~96)

**Context:** ValueError = "this value doesn't make sense here"; KeyError = "key should exist, doesn't"; name is diagnosis.

```python
# ValueError: "This value does not make sense here."
# KeyError: "This key should exist. It does not."
# Name = diagnosis
```

---

### 8) Tracebacks Are Maps, Not Noise (Line ~108)

**Context:** Traceback = map showing where and how failure occurred; don't panic.

```python
# Traceback = map, not noise
# Don't panic—read it
```

---

### 9) How to Read a Traceback (Line ~117)

**Context:** Read bottom up: exception type, exact line, call chain upward.

```python
# Read from bottom up:
# 1. Identify exception type
# 2. Identify exact line that failed
# 3. Follow call chain upward

# Traceback (most recent call last):
#   File "coop_monitor.py", line 12, in main
#     temp = float(packet["temp"])
# ValueError: could not convert string to float: 'ERR'

# Bottom line = failure; lines above = how you got there
```

---

### 10) Tracebacks Reveal Assumptions (Line ~135)

**Context:** Traceback answers: what did you assume, where did it break, who relied on it.

```python
# Every traceback answers:
# What did you assume? packet["temp"] is convertible to float
# Where did it break? line 12, float() call
# Who relied on it? main() called this code
```

---

### 11) try/except Is Conditional Execution for Failure (Line ~144)

**Context:** try/except doesn't fix errors; says "if this fails, do this instead"; conditional on failure, not success.

```python
try:
    voltage = float(reading)
except ValueError:
    voltage = None  # if conversion fails, do this instead

# Conditional logic based on failure, not success
```

---

### 12) try Is a Claim (Line ~156)

**Context:** try = "I believe this should succeed"; except = contingency plan.

```python
try:
    voltage = float(reading)  # "I believe this should succeed"
except ValueError:
    voltage = None            # contingency plan
```

---

### 13) except Is Not a Catch-All Net (Line ~169)

**Context:** Catching everything is almost always wrong; except Exception: pass hides bugs forever.

```python
# BAD: ignore all failures
try:
    voltage = float(reading)
except Exception:
    pass  # voltage stays at last value, sensor death hidden

# Sensor returns "ERR", you pass—stale data, never know sensor died
```

---

### 14) Catch Only What You Expect (Line ~184)

**Context:** Good handling is specific: know what might fail, how it fails, what recovery looks like; else crash.

```python
# Know: what might fail, how it fails, what recovery looks like
# Anything else should crash

try:
    voltage = float(reading)
except ValueError:
    voltage = None  # specific: catch ValueError at boundary
```

---

### 15) Example: Boundary Conversion Failure (Line ~202)

**Context:** At boundary, data untrusted, conversion may fail; set to None, log failure, continue safely.

```python
# Voltage sensor returns "12.3" or "ERR"
try:
    voltage = float(reading)
except ValueError:
    voltage = None
    log("Invalid voltage reading:", reading)

# If fails: set None, log, continue safely
# That's engineering
```

---

### 16) else Separates Success from Failure (Line ~224)

**Context:** else runs only if no exception; keeps success-path logic clean.

```python
try:
    voltage = float(reading)
except ValueError:
    log_error("Bad reading")
    voltage = None
else:
    update_display(voltage)  # runs only when conversion succeeded

# Failure handling doesn't pollute success logic
```

---

### 17) finally Is About Cleanup, Not Recovery (Line ~242)

**Context:** finally always runs; for closing files, releasing resources, restoring invariants.

```python
f = open("voltage_log.txt")
try:
    process(f.read())
finally:
    f.close()  # runs even if process() raises

# Better: use with (Chapter 1.11)
```

---

### 18) Cleanup Is Not Optional (Line ~261)

**Context:** Resources finite: file handles, sockets, locks, hardware access; failing to clean up = invisible failure later.

```python
# Resources finite: file handles, network sockets, locks, serial/I2C
# Fail to clean up → Pi or ESP32 exhausts descriptors later
# finally makes cleanup non-negotiable
```

---

### 19) Raising Exceptions Is Not Aggressive (Line ~273)

**Context:** raise = "this state is invalid, I refuse to continue"; honest, not dramatic.

```python
# raise: "This state is invalid. I refuse to continue."
# That is honest, not dramatic
```

---

### 20) Use raise to Enforce Invariants (Line ~282)

**Context:** If invariant breaks: don't limp, don't guess, don't patch—raise; let caller decide.

```python
if threshold <= 0:
    raise ValueError("threshold must be positive")

# Don't limp forward, don't guess, don't patch silently
# Let the caller decide what to do
```

---

### 21) Exceptions Create Explicit Failure Paths (Line ~296)

**Context:** Without exceptions: error codes, tangled logic, easy to ignore. With: clean normal flow, explicit failures.

```python
# Without exceptions: every function returns error codes, logic tangles
# With exceptions: normal flow clean, failure paths explicit

# Assumptions enforced
```

---

### 22) Exceptions Are Not Control Flow (Line ~308)

**Context:** Don't use exceptions to replace conditionals or expected branches; exceptions for unexpected/invalid states.

```python
# Don't use exceptions for: conditionals, expected branches, avoiding thought
# Exceptions for: unexpected or invalid states
```

---

### 23) Failure Is Information (Line ~317)

**Context:** Failed sensor read, missing file, malformed value—each tells you something; exceptions carry info upward.

```python
# Failed sensor read: DHT22 timeout, voltage "ERR" — tells you something
# Missing file: config.json absent — fresh install or bad path
# Malformed value: coop packet missing "temp" — tells you something

# Exceptions carry that information upward
```

---

### 24) Designing for Failure Means Designing Responses (Line ~325)

**Context:** Ask: what happens when fails, can system continue, stop, fall back, alert? Exceptions make decisions explicit.

```python
# Ask: What happens when this fails?
# Can system continue? Should it stop? Fall back? Alert?

try:
    voltage = float(reading)
except ValueError:
    voltage = None   # continue with None
    send_alert()     # alert operator
```

---

### 25) Homestead Systems Fail Constantly (Line ~336)

**Context:** Sensors return garbage/nothing/stale; networks drop/stall/partial; power brownouts/resets/noise.

```python
# Sensors: return garbage (voltage "ERR", DHT22 -40), nothing, stale
# Networks: drop, stall, partial data (truncated JSON)
# Power: brownouts, resets, noise

# System that crashes on first failure is unusable
```

---

### 26) Robust Systems Expect Failure (Line ~355)

**Context:** Catch expected failures, log, continue safely, preserve invariants; crash only when continuing is unsafe.

```python
# Robust: catch expected, log, continue safely, preserve invariants
# Crash only when continuing is unsafe

try:
    voltage = float(reading)
except ValueError:
    log("Bad reading")
    voltage = None  # preserve invariant: voltage is float or None
```

---

### 27) Crashing Is Sometimes the Correct Response (Line ~365)

**Context:** If state corrupted, invariants broken, recovery unsafe: crash; clean stop beats silent damage.

```python
# If state corrupted, invariants broken, recovery unsafe: crash
# Clean stop beats silent damage

if state_is_corrupt:
    raise SystemExit("State corrupted; refusing to continue")
```

---

### 28) Exceptions Are Part of the Execution Model (Line ~376)

**Context:** Exceptions not "extra"; every try/except is a branch, every raise is a signal; include in mental model.

```python
# Exceptions are part of normal execution
# Every try/except is a branch
# Every raise is a signal
# They belong in your mental model
```

---

### Reflection: Exception Analysis (Line ~386)

**Context:** What assumptions can break? How would I know? What should happen next?

```python
# What assumptions? file exists, sensor returns number, key present
# Which can break? all of them
# How would I know? exception raised (ValueError, FileNotFoundError, KeyError)
# What should happen? catch at boundary, log, continue or crash

# Failure modes:
# float(reading) raises ValueError? Catch, set None, log, continue
# config.json missing? FileNotFoundError—use default or fail fast
# KeyError means required data absent? Validate on load; raise if invariant broken
# except: pass hides bug? Catch specific types; let rest crash
```

---

## Chapter 1.13: Persistence and Remembering State

### 1) Memory Is Temporary by Design (Line ~26)

**Context:** Variables live in memory; when process ends, variables vanish, state erased, history gone; not a flaw—how computers work.

```python
voltage = 12.1  # lives in memory
# When program ends: voltage vanishes, state erased, history gone
# Not a flaw—how computers work
```

---

### 2) Persistence Is External Memory (Line ~39)

**Context:** Persistence = writing state outside program, reading it back, restoring continuity; files outlive execution.

```python
# Persistence: write state outside program, read back later, restore continuity
# Files are external memory—they outlive execution
```

---

### 3) Persistence Turns Programs into Systems (Line ~50)

**Context:** Without persistence: starts fresh, no memory, repeats mistakes. With: remembers, learns, continues.

```python
# Without: starts fresh, no memory, repeats mistakes
# With: remembers, learns, continues
# Persistence creates identity over time
```

---

### 4) Not All State Should Persist (Line ~64)

**Context:** Some state is temporary/ephemeral; other is long-lived/foundational; persist only what matters.

```python
# Temporary: loop counters, intermediate calculations
# Long-lived: config, calibration, last readings, system mode, history

# Persist only what matters
```

---

### 5) Examples of Persistent vs Ephemeral State (Line ~80)

**Context:** Ephemeral: loop counters, temp calculations. Persistent: config, calibration, last readings, timestamps, system mode, history logs.

```python
# Ephemeral:
i = 0                  # loop counter
temp_sum = 0           # intermediate calculation

# Persistent:
# config.json: thresholds, cooldowns, enabled flags
# coop_state.json: last temp, fan_on status, timestamp
# voltage_log.txt: history of readings
# generator_running, last_voltage, last_update
```

---

### 6) Persistence Is a Boundary (Line ~97)

**Context:** Files are outside program; reading requires validation; writing must preserve invariants.

```python
# Files are outside the program (boundary)
# Reading: brings data in, requires validation
# Writing: pushes data out, must preserve invariants
# Treat persistence like a boundary
```

---

### 7) JSON Is a Practical Persistence Format (Line ~112)

**Context:** JSON: text, structured, human-readable, machine-readable; maps to dict, list, str, int, float, bool, None.

```python
import json

state = {"voltage": 12.1, "timestamp": "2025-01-30"}

# Save
with open("coop_state.json", "w") as f:
    json.dump(state, f, indent=2)

# Load
with open("coop_state.json") as f:
    loaded = json.load(f)  # returns dict
```

---

### 8) JSON Is Not Magic (Line ~141)

**Context:** JSON is just text; doesn't enforce meaning, validate correctness, or guarantee completeness—you must.

```python
# JSON doesn't: enforce meaning, validate correctness, guarantee completeness
# You must validate

loaded = json.load(f)
# loaded["voltage"] → KeyError if key missing
# Validate required keys on load
```

---

### 9) Saving State Is a Snapshot of Reality (Line ~155)

**Context:** Save = "this is what matters right now"; snapshot becomes starting point; if wrong, system resumes wrong.

```python
# Save = snapshot: "This is what matters right now"
# That snapshot becomes starting point next time
# If it's wrong, system resumes wrong

state = {"voltage": 12.1, "generator_running": True, "timestamp": "2025-01-30"}
with open("state.json", "w") as f:
    json.dump(state, f)
```

---

### 10) Loading State Is Trust with Verification (Line ~165)

**Context:** Load = trusting file exists, data valid, structure matches; trust must be verified; never blindly trust.

```python
# Trust: file exists, data valid, structure matches
# Verify that trust

try:
    with open("coop_state.json") as f:
        state = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    state = {"voltage": None, "temp": None}  # defaults

# Never blindly trust persisted state
```

---

### 11) Persistence Can Fail (Line ~184)

**Context:** Files can be missing, corrupted, partially written, outdated; persistence failure is normal—design for it.

```python
# Files can be: missing, corrupted, partially written, outdated
# Persistence failure is normal—design for it
```

---

### 12) Startup Is a Critical Moment (Line ~195)

**Context:** Startup: memory empty, files read, state reconstructed; most subtle bugs live here.

```python
# Startup: memory empty, files read, state reconstructed
# Most subtle bugs live here
```

---

### 13) Startup Strategy Must Be Explicit (Line ~204)

**Context:** Decide: what if file missing, invalid, fields missing, versions differ; intentional design, no default correct.

```python
# Decide explicitly:
# File missing? Load defaults, create file
# File invalid? Log, use defaults or last-known-good
# Fields missing? Validate, raise or use default
# Versions differ? Migrate or reject

# Example:
try:
    with open("config.json") as f:
        config = json.load(f)
except FileNotFoundError:
    config = {"threshold": 12.1, "cooldown": 300}  # defaults
    with open("config.json", "w") as f:
        json.dump(config, f)
```

---

### 14) Defaults Are a Design Choice (Line ~217)

**Context:** Defaults = safe assumptions, known-good baseline, initial conditions; not hacks—first-class design.

```python
# Defaults: safe assumptions, known-good baseline, initial conditions
DEFAULTS = {
    "threshold": 12.1,
    "cooldown": 300,
    "enabled": True
}
# Not hacks—first-class design artifacts
```

---

### 15) Persistence and Invariants (Line ~227)

**Context:** Restored state must satisfy invariants; if not, reject, rebuild, log; don't "fix" corrupted state silently.

```python
# Restored state must satisfy invariants
# If generator_running=True, voltage must exist

state = json.load(f)
if state.get("generator_running") and state.get("voltage") is None:
    # Invariant broken: generator running but no voltage
    raise ValueError("Invalid state: generator_running without voltage")

# Don't fix silently—reject, rebuild, log
```

---

### 16) Persistence Makes Time Visible (Line ~241)

**Context:** Without persistence: time resets on restart. With: time continues, history exists, trends emerge.

```python
# Without: time resets on restart
# With: time continues, history exists, trends emerge
# Persistence gives programs memory of time
```

---

### 17) Logs Are Append-Only Memory (Line ~253)

**Context:** Logs accumulate, preserve history, are not overwritten; logs = "what happened", state = "what is true now".

```python
# Logs: append-only, accumulate, preserve history
with open("voltage_log.txt", "a") as f:
    f.write(f"{voltage},{timestamp}\n")

# Logs answer: "What happened?"
# State answers: "What is true now?"
```

---

### 18) State vs History (Line ~270)

**Context:** State: current truth, small, overwritten. History: past events, grows, append-only. Don't confuse them.

```python
# State: current truth, small, overwritten
state = {"voltage": 12.1}

# History: past events, grows, append-only
# voltage_log.txt accumulates over time

# Don't confuse them
```

---

### 19) Snapshot Persistence (Line ~284)

**Context:** Snapshots: save full state at once, simple, easy to restore; good for small systems, early stages.

```python
# Snapshot: save full state at once
state = {"voltage": 12.1, "temp": 75, "timestamp": "2025-01-30"}
with open("coop_state.json", "w") as f:
    json.dump(state, f)

# Simple, easy to restore
# Good for small systems, early stages
```

---

### 20) Incremental Persistence (Line ~302)

**Context:** Incremental: save changes as they happen; more efficient, more complex; good for high-frequency data. Phase 1 favors snapshots.

```python
# Incremental: save changes as they happen
with open("voltage_log.txt", "a") as f:
    f.write(f"{voltage},{timestamp}\n")

# More efficient, more complex
# Harder recovery, requires replay logic
# Phase 1 favors snapshots
```

---

### 21) Persistence Is About Continuity, Not Optimization (Line ~320)

**Context:** Early systems: prioritize clarity, safety, recoverability; optimize later; can't recover lost history.

```python
# Early systems: clarity, safety, recoverability
# Not performance
# Can optimize later; can't recover lost history
```

---

### 22) Persistence Is Part of the Mental Model (Line ~332)

**Context:** Persistence not "extra"; execution model now includes runtime memory, external memory, restoration logic.

```python
# Execution model now includes:
# - Runtime memory (variables)
# - External memory (files)
# - Restoration logic (load on startup)

# This is a major step
```

---

### 23) Homestead Example: Battery Monitor and Beyond (Line ~344)

**Context:** Without persistence: restart forgets voltage, timers reset. With: last voltage restored, cooldowns preserved, system resumes.

```python
# Without persistence:
# Restart forgets last voltage, coop temp, fence status
# Cooldown timers reset (generator, fan)
# Generator logic breaks

# With persistence (config.json, coop_state.json, voltage_log.txt):
# Last voltage restored
# Cooldowns preserved
# System resumes safely

# Load on startup:
try:
    with open("coop_state.json") as f:
        state = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    state = {"voltage": None, "temp": None, "last_update": None}
```

---

### 24) Persistence and Failure Interlock (Line ~360)

**Context:** Failure, restarts, crashes will happen; persistence is how systems survive them.

```python
# Failure will happen. Restarts will happen. Crashes will happen.
# Persistence is how systems survive them.
```

---

### Reflection: Persistence Analysis (Line ~368)

**Context:** What state defines system? What survives restarts? What can reset? What if saved state wrong?

```python
# What state defines system? voltage, temp, fan_on, generator_running, thresholds
# What must survive restarts? config, last readings, system mode
# What can safely reset? loop counters, temporary calculations
# What if saved state wrong? validate on load, reject or use defaults

# Failure modes:
# coop_state.json missing on first boot? Create with defaults
# JSON malformed after power loss? try/except json.JSONDecodeError; fall back
# Required key missing after format change? Validate on load; raise or default
```

---

## Chapter 1.14: Modules and Program Structure

### 1) Programs Grow Sideways (Line ~16)

**Context:** Early programs fit in one file; as systems grow, one file becomes noise; modules let programs grow without collapsing.

```python
# Early: one file
# As systems grow: logic multiplies, state spreads, responsibilities diverge
# At some point: one file = noise, not clarity

# Modules: how programs grow without collapsing
```

---

### 2) What a Module Really Is (Line ~29)

**Context:** Module = Python file that defines names, can be imported, executes once, exposes behavior intentionally.

```python
# Module: a Python file
# - Defines names
# - Can be imported
# - Executes once
# - Exposes behavior intentionally

# sensors.py, config.py, storage.py—each is a module
```

---

### 3) A Module Is a Boundary (Line ~40)

**Context:** Inside module: can see internal names, shares assumptions. Outside: can only see what module exposes, must respect interface.

```python
# Inside sensors.py: _internal_calibration visible, shared assumptions
# Outside: only read_voltage(), read_coop_temp() visible
# Boundary thinking applied to files
```

---

### 4) Modules Create Shape (Line ~52)

**Context:** Without modules: everything touches everything, dependencies sprawl. With: responsibilities grouped, interfaces visible.

```python
# Without modules: everything touches everything, bugs leak everywhere
# With modules: responsibilities grouped, interfaces visible, structure emerges
```

---

### 5) Importing Is Execution (Line ~66)

**Context:** When you import, Python executes the file: top-level code runs, variables created, functions defined, side effects occur.

```python
# import sensors
# Python executes sensors.py: top-level code runs, variables created

# Homestead: importing sensors.py might run GPIO setup or load calibration
# That happens the first time anything imports it
```

---

### 6) Import Happens Once Per Process (Line ~81)

**Context:** First import: execute file, store module object. Subsequent imports: reuse same module, no re-execution.

```python
import sensors  # First: executes sensors.py
import sensors  # Second: reuses module, no re-execution

# This matters for state in modules
```

---

### 7) Modules Can Hold State (Line ~93)

**Context:** Variables at module level persist; modules can act like singletons; powerful and dangerous.

```python
# In sensors.py:
_calibration = load_calibration()  # persists across function calls

# Modules can act like singletons
# Powerful and dangerous
```

---

### 8) Use Module State Carefully (Line ~103)

**Context:** Module state: global within module, persists, shared across imports. Prefer passing state explicitly, returning values.

```python
# In config.py:
DEFAULT_THRESHOLD = 12.0  # fine—constant

# In sensors.py:
last_voltage = None  # riskier—hidden mutation

# Prefer: pass state explicitly, return values
# Hidden state hides bugs
```

---

### 9) import module_name (Line ~119)

**Context:** import module binds the module name; requires qualification; explicit about where names come from.

```python
import sensors

voltage = sensors.read_voltage()

# Explicit: shows where names come from
```

---

### 10) Qualified Access Is Clarity (Line ~134)

**Context:** sensors.read_voltage() tells you which module owns the function, where to look, which boundary you cross.

```python
import sensors
import generator

voltage = sensors.read_voltage()     # from sensors module
gen_output = generator.read_output()  # from generator module

# Clear which module owns each function
```

---

### 11) from module import item (Line ~143)

**Context:** from sensors import read_voltage binds name directly; convenient but easier to misuse.

```python
from sensors import read_voltage

voltage = read_voltage()

# Convenient—no module prefix
# Easier to misuse
```

---

### 12) Name Collisions Are Real (Line ~158)

**Context:** Two imports with same name: second overwrites first, no warning, no error, silent replacement.

```python
from sensors import read_voltage
from generator import read_voltage  # overwrites first!

# No warning, no error, silent replacement
# Wrong behavior—sensors.read_voltage() lost
```

---

### 13) Prefer Explicitness in Systems (Line ~175)

**Context:** For systems: prefer import module and qualified access; make boundaries visible; clarity beats brevity.

```python
# For systems:
import sensors
import generator

voltage = sensors.read_voltage()
gen_output = generator.read_voltage()

# Boundaries visible; clarity beats brevity
```

---

### 14) The Standard Library Is Just Modules (Line ~186)

**Context:** Standard library modules are imported like your code; same rules apply; no special category.

```python
import json
import time

data = json.load(open("config.json"))
time.sleep(5)

# Same import rules as your own modules
```

---

### 15) Common Standard Modules (Line ~195)

**Context:** time (waiting, timestamps), json (persistence), os (filesystem), sys (interpreter), pathlib (paths).

```python
import json
import time
import os
import sys
from pathlib import Path

# time.sleep(5), json.load(f), os.path.exists("config.json")
# These are tools, not magic
```

---

### 16) Import Order Matters (Line ~210)

**Context:** Python executes imports top to bottom; if A imports B and B imports A, you have circular dependency.

```python
# Python executes imports top to bottom
# If A imports B and B imports A: circular dependency
```

---

### 17) Circular Imports Break Systems (Line ~220)

**Context:** Circular imports: partially initialized modules, confusing errors, hard to debug; design smell.

```python
# Circular imports: partially initialized modules, confusing errors
# They are a design smell
```

---

### 18) Avoid Circular Imports by Design (Line ~229)

**Context:** Centralize coordination in main.py; move shared logic to third module; pass functions instead of importing.

```python
# Strategies:
# - Centralize in main.py
# - Move shared logic to third module
# - Pass functions instead of importing

# main.py imports sensors, storage, generator
# sensors.py does not import storage—returns data
# main passes data to storage.save()
# That breaks the cycle
```

---

### 19) __name__ and Execution Context (Line ~241)

**Context:** __name__ == "__main__" when run directly; __name__ == "module_name" when imported.

```python
# When run directly: __name__ == "__main__"
# When imported: __name__ == "sensors" (module name)
```

---

### 20) The if __name__ == "__main__" Pattern (Line ~249)

**Context:** Run main() only when executed directly; do nothing when imported; foundational pattern.

```python
def main():
    # Entry point logic
    pass

if __name__ == "__main__":
    main()  # Runs only when executed directly

# When imported: nothing runs
```

---

### 21) Why This Pattern Matters (Line ~262)

**Context:** Allows reusable modules, testable code, clean imports, clear entry points; without it, importing triggers execution.

```python
# Allows: reusable modules, testable code, clean imports, clear entry points
# Without it: importing triggers execution, side effects leak everywhere
```

---

### 22) One Entry Point (Line ~274)

**Context:** Well-structured systems: one main entry point (main.py), many supporting modules.

```python
# main.py — coordinates, entry point
# sensors.py — provides sensor reading
# generator.py — provides generator control
# storage.py — provides persistence

# main.py is the one entry point
```

---

### 23) Separation of Concerns Is the Goal (Line ~286)

**Context:** Each module: one primary responsibility, clear purpose, readable interface; if "a bit of everything," split it.

```python
# Each module: one responsibility, clear purpose
# sensors.py: read sensors, validate readings
# storage.py: config, state, logs
# If a module does "a bit of everything," split it
```

---

### 24) Organize by Responsibility, Not Syntax (Line ~295)

**Context:** Bad: functions.py, utils.py. Good: sensors.py, generator.py, storage.py, config.py.

```python
# Bad: functions.py, classes.py, utils.py
# Good:
# - sensors.py (DHT22, voltage, fence, solar)
# - generator.py (control, cooldowns)
# - storage.py (config, state, logs)
# - config.py (loading, defaults)

# Organize by what the system does
```

---

### 25) Modules Are Contracts (Line ~310)

**Context:** Module name promises meaning; sensors.py should read/validate sensors, not start generators or write logs.

```python
# sensors.py should:
# - Read sensors (DHT22, voltage, fence, solar)
# - Validate readings
# - Expose sensor-related behavior

# Should NOT: start generators, write logs, control timing
# Names are promises
```

---

### 26) Modules Hide Detail — Intentionally (Line ~326)

**Context:** Callers don't care how sensors are read; they care what comes out and what failures mean.

```python
# Callers don't care: how sensors are read, which library, what hardware
# They care: what comes out, what failures mean

# Modules hide detail without hiding truth
```

---

### 27) Modules and Testing (Line ~339)

**Context:** Modules enable testing: functions importable, behavior isolated, dependencies mockable.

```python
from sensors import read_voltage

# Can test read_voltage() without running generator.py
# Mock GPIO; assert on return value
# Testability emerges from structure
```

---

### 28) Modules Are Systems in Miniature (Line ~350)

**Context:** Inside a module: state, functions, conditions, loops, errors, boundaries; modules don't remove complexity—they contain it.

```python
# Inside a module: state, functions, conditions, loops, errors, boundaries
# Modules don't remove complexity—they contain it
```

---

### 29) Modules Prepare You for Packages (Line ~363)

**Context:** Multiple modules → package (directory with __init__.py); this is where Python scales.

```python
# Multiple modules together form a package
# A directory with __init__.py
# This is where Python scales
```

---

### 30) Homestead Example Structure (Line ~372)

**Context:** main.py (entry), sensors.py (reading), generator.py (control), storage.py (persistence), config.py (configuration).

```python
# main.py — coordination, entry point
# sensors.py — sensor reading (DHT22, voltage, fence, solar)
# generator.py — generator control, cooldowns
# storage.py — persistence (config.json, coop_state.json)
# config.py — configuration loading and defaults

# Each file has one job
```

---

### 31) This Is Systems Thinking (Line ~383)

**Context:** No longer writing scripts or memorizing syntax; now designing boundaries, managing responsibility, containing complexity.

```python
# You are no longer: writing scripts, memorizing syntax
# You are: designing boundaries, managing responsibility, containing complexity
# This is real programming
```

---

### Reflection: Module Analysis (Line ~396)

**Context:** What responsibility does this file have? What should it not know? What does it expose/hide? What breaks if it lies?

```python
# What responsibility? sensors.py reads sensors
# What should it not know? generator state, storage paths
# What does it expose? read_voltage(), read_coop_temp()
# What does it hide? GPIO setup, calibration details
# What breaks if it lies? everything that trusts its readings

# Failure modes:
# sensors.py imports storage, storage imports sensors? Circular—move shared, pass callbacks
# main.py does everything? No separation—split by responsibility
# from X import * hides where names come from? Use import module for clarity
```

---

## Chapter 1.15: Assembling a Living Python System

### 1) What "Living" Means in Software (Line ~24)

**Context:** Living system: doesn't assume perfection, doesn't terminate after one task, doesn't panic; expects missing data, delays, restart, recovery.

```python
# Living system:
# - Does not assume perfection
# - Does not terminate after one task
# - Does not reset every cycle
# - Does not panic when reality misbehaves

# Expects: missing data, delays, partial truth, restart, recovery
# Living systems are calm
```

---

### 2) The Heartbeat: The Main Loop (Line ~42)

**Context:** while True: is the heartbeat; how time enters the system.

```python
import time
import sensors
import generator
import storage

while True:
    try:
        voltage = sensors.read_voltage()
        state = update_state(voltage)
        if state["voltage_low"] and not state["generator_running"]:
            generator.start()
        storage.save(state)
    except ValueError:
        pass  # bad reading, use last state
    time.sleep(60)

# This is how time enters the system
```

---

### 3) The Loop Is Not the System (Line ~63)

**Context:** Loop is the container; what matters is what happens inside each cycle; each iteration is one moment in time.

```python
# The loop is the container
# What matters: what happens inside each cycle
# Each iteration: one moment in time
```

---

### 4) One Cycle of Life (Line ~71)

**Context:** Observe → validate → update state → decide → act → persist → wait → repeat.

```python
# One cycle:
# 1. Observe inputs: voltage = sensors.read_voltage()
# 2. Validate boundaries: if voltage is None: handle_missing()
# 3. Update state: state["voltage"] = voltage
# 4. Decide: if voltage < 12.1 and not generator_running: ...
# 5. Take action: generator.start()
# 6. Persist: storage.save(state)
# 7. Wait: time.sleep(60)

# Then repeat. Calmly.
```

---

### 5) Data Flows Through the System (Line ~87)

**Context:** Input → Validate → Process → Output; living systems are pipelines.

```python
# Data enters → transforms → exits
# Input → Validate → Process → Output
# Everything else is detail
```

---

### 6) Input Is Where Reality Touches Code (Line ~101)

**Context:** Inputs: sensors, files, network, timers; inputs are untrusted, always.

```python
# Inputs: sensors (DHT22, voltage), files (config.json), network (ESP32, MQTT)
# Inputs are untrusted. Always.

voltage = sensors.read_voltage()  # untrusted
config = storage.load_config()     # untrusted
```

---

### 7) Validation Happens at the Edge (Line ~114)

**Context:** Check presence, type, range, freshness before data becomes state; don't delay validation.

```python
# Before data becomes state: check presence, type, range, freshness
reading = sensors.read_voltage()
try:
    voltage = float(reading)
except ValueError:
    voltage = None  # "ERR" from sensor

if voltage is not None and (voltage < 0 or voltage > 20):
    voltage = None  # out of range

# Bad data contaminates everything downstream
```

---

### 8) State Is the System's Memory (Line ~129)

**Context:** Validated data becomes state; state lives in variables, dicts, collections; what the system believes right now.

```python
# State: what the system believes right now
state = {
    "voltage": 12.1,
    "generator_running": False,
    "last_update": "2025-01-30T12:00:00"
}

# Lives in variables, dicts, collections, memory
```

---

### 9) State Changes Over Time (Line ~141)

**Context:** Each loop: read old state, incorporate new input, produce new state; same code, different state, different behavior.

```python
# Each iteration:
# - Read old state
# - Incorporate new input
# - Produce new state

state["voltage"] = new_voltage
state["last_update"] = timestamp

# Same code behaves differently because state is different
# This is time
```

---

### 10) Decisions Are Made From State (Line ~155)

**Context:** Conditions act on state, not reality directly; if state is wrong, decisions are wrong.

```python
# Conditions act on state, not reality directly
if state["voltage"] < 12.1:
    # decision from state
    pass

# If state is wrong, decisions are wrong—even if code is correct
```

---

### 11) Conditions Choose Paths, Not Outcomes (Line ~165)

**Context:** Conditions answer questions: is voltage low? generator running? enough time passed? They don't do—they choose.

```python
# Conditions answer questions:
is_voltage_low = state["voltage"] < 12.1
is_generator_running = state["generator_running"]
has_cooldown_passed = time.time() - state["last_start"] > 300

# They don't do anything—they only choose paths
```

---

### 12) Actions Change the World (Line ~177)

**Context:** Actions: flip relays, write files, send messages; irreversible—treat carefully.

```python
# Actions change the world:
generator.start()                    # flip relay
storage.save(state)                  # write file
mqtt.publish("alerts/voltage_low")   # send message

# Actions are irreversible—treat carefully
```

---

### 13) Observation and Action Must Stay Separate (Line ~190)

**Context:** Observation: reads, returns, changes nothing. Action: writes, triggers, alters. When mixed, systems oscillate or lie.

```python
# Observation: reads, returns, changes nothing
voltage = sensors.read_voltage()

# Action: writes, triggers, alters
generator.start()

# Don't have read_voltage() start the generator
# When these mix, systems oscillate, race, or lie
```

---

### 14) Naming Makes Intent Visible (Line ~208)

**Context:** Names tell you: what is observed, what is decided, what is acted upon; if you must inspect code, abstraction failed.

```python
voltage = sensors.read_voltage()      # observing
should_start = voltage < 12.1         # deciding
generator.start()                     # acting

# Names make intent visible
# If you must inspect code to understand, abstraction failed
```

---

### 15) Errors Are Not Exceptional (Line ~219)

**Context:** Errors expected: sensors timeout, files missing, data malformed, networks down; living system assumes failure is normal.

```python
# Errors expected:
# - Sensors timeout (DHT22, ESP32 offline)
# - Files missing (config.json)
# - Data malformed (voltage "ERR")
# - Networks unavailable (WiFi drop)

# Living system assumes failure is normal
```

---

### 16) Exceptions Are Signals (Line ~231)

**Context:** Exceptions say: assumption failed, boundary crossed incorrectly, input unusable; information, not emergencies.

```python
# Exceptions say:
# - "This assumption failed"
# - "This boundary was crossed incorrectly"
# - "This input was unusable"

# Information, not emergencies
```

---

### 17) Handle Errors Where They Occur (Line ~241)

**Context:** Catch at boundaries, near source, where recovery possible; don't catch everything, don't ignore.

```python
# Catch at boundaries, near source
try:
    voltage = float(reading)
except ValueError:
    voltage = None  # recovery: use None

try:
    config = storage.load_config()
except FileNotFoundError:
    config = DEFAULT_CONFIG  # recovery: use defaults

# Let the rest propagate
```

---

### 18) Failure Has Modes (Line ~255)

**Context:** Design modes: skip cycle, use last value, degrade, alert, stop safely; don't improvise.

```python
# Design these modes:
# - Skip this cycle: sensor timeout—no update
# - Use last known value: voltage "ERR"—use previous
# - Degrade functionality: fan offline—skip fan, keep logging
# - Alert and continue: MQTT alert, keep running
# - Stop safely: config corrupted—exit, don't guess

# Don't improvise—design failure modes
```

---

### 19) Persistence Gives Memory Beyond Runtime (Line ~267)

**Context:** Memory dies when programs stop; files don't; persistence allows continuity, recovery, history, calm restarts.

```python
# Memory dies when program stops
# Files don't

# Persistence allows: continuity, recovery, history, calm restarts
storage.save(state)

# Without persistence, systems forget
```

---

### 20) State That Matters Must Be Saved (Line ~281)

**Context:** Save: last known values, timestamps, counters, flags that affect decisions; don't persist noise.

```python
# Save:
state = {
    "voltage": 12.1,          # last known
    "last_update": timestamp,  # when
    "generator_running": True, # affects decisions
    "start_count": 5           # counter
}
storage.save(state)

# Don't persist noise
```

---

### 21) Restore State on Startup (Line ~293)

**Context:** Startup loads state, rehydrates memory, continues; restart is just another moment in time.

```python
# Startup:
state = storage.load() or get_defaults()

# If file missing or corrupt, use defaults
# Then run the loop

# Restart is just another moment in time
```

---

### 22) Modules Contain Complexity (Line ~306)

**Context:** No living system in one file; modules group responsibility, create boundaries, enable reasoning.

```python
# Modules: group responsibility, create boundaries
# sensors.py, generator.py, storage.py, main.py

# Each module is a subsystem
```

---

### 23) One Module, One Job (Line ~318)

**Context:** sensors.py reads sensors, generator.py controls generator, storage.py manages persistence, main.py coordinates.

```python
# Good modules:
# sensors.py — read sensors, validate
# generator.py — control actuators
# storage.py — manage persistence
# main.py — coordinate logic

# Bad modules: do "a bit of everything"
# Clarity scales; chaos compounds
```

---

### 24) The Main Module Coordinates (Line ~331)

**Context:** One module owns the loop; calls observation, passes state, makes decisions, triggers actions.

```python
# main.py owns the loop
def main():
    state = storage.load() or get_defaults()
    while True:
        voltage = sensors.read_voltage()
        state["voltage"] = voltage
        if should_start_generator(state):
            generator.start()
            state["generator_running"] = True
        storage.save(state)
        time.sleep(60)

# Everything else supports main
```

---

### 25) The Full Model, In Code (Line ~343)

**Context:** Variables, types, collections, dicts, conditions, loops, functions, exceptions, persistence, modules—nothing extra, nothing missing.

```python
# Your system now includes:
# - Variables representing state
# - Types matching reality
# - Collections organizing complexity
# - Dictionaries structuring systems
# - Conditions choosing paths
# - Loops expressing time
# - Functions naming behavior
# - Exceptions signaling failure
# - Persistence preserving memory
# - Modules containing responsibility

# Nothing extra. Nothing missing.
```

---

### 26) Scale Does Not Change the Model (Line ~360)

**Context:** One sensor or distributed system: same model, only wiring changes.

```python
# Whether you run:
# - One sensor
# - Ten nodes
# - Distributed system

# The model is identical
# Only the wiring changes
```

---

### 27) You Are No Longer Learning Python (Line ~371)

**Context:** Using Python to express time, change, state, boundaries, failure, recovery; language is incidental.

```python
# You are using Python to express:
# - Time
# - Change
# - State
# - Boundaries
# - Failure
# - Recovery

# The language is incidental
```

---

### Reflection: Living System Analysis (Line ~383)

**Context:** Trace one loop: where input enters, validated, state lives, decisions made, actions taken, failure handled, what survives restart.

```python
# Trace one loop iteration:
# 1. Voltage read: voltage = sensors.read_voltage()
# 2. Validated: if voltage is None: use last
# 3. State updated: state["voltage"] = voltage
# 4. Decision: voltage low? generator off?
# 5. Action: generator.start()
# 6. Persist: storage.save(state)
# 7. Wait: time.sleep(60)

# If any step fails, where? What does system do?
# If you can answer calmly, you understand the system

# One cycle: observe → validate → update → decide → act → persist → wait
# Loop is heartbeat. Failure is normal. Time never stops.
```
