# Phase 1 · Chapter 1.11: Input, Output, and Program Boundaries

Phase 0.8 established a foundational rule:

Programs do not live in isolation.
They touch the outside world at boundaries.
Validation belongs at those boundaries.

This chapter expresses that idea in Python syntax—print, input, file I/O, and type conversion. Chapter 1.10 gave you dictionaries for config and state; this chapter shows where that config and state come from and go. Chapter 1.7 gave you types (int, float, str, bool); this chapter shows how external data arrives as strings and must be converted and validated. Chapter 1.8 showed explicit checks for None and truthiness; those checks belong at boundaries, where data enters.

Input and output are not “features.”
They are edges—the places where reality enters and leaves your program.

Most serious bugs are boundary bugs.

## 1) Programs Live Inside, Reality Lives Outside

Inside your program:
	•	Variables are well-typed
	•	Assumptions mostly hold
	•	Logic is predictable

Outside your program:
	•	Data is missing (sensor timeout, ESP32 offline)
	•	Formats change (DHT22 returns different structure, config file format drifts)
	•	Timing is unreliable (network latency, user pauses)
	•	Humans make mistakes (typos in config, wrong units)
	•	Files are corrupted (log file truncated, config overwritten)
	•	Sensors lie (DHT22 returns -40, voltage sensor reads 0 when disconnected)
	•	Networks fail (WiFi drops, MQTT broker unreachable)

Input/output is how those two worlds meet.

## 2) Boundaries Are Where Programs Are Honest

A boundary is any place where:
	•	Data enters the program
	•	Data leaves the program

Examples:
	•	User input (console, config prompts)
	•	Sensor readings (DHT22 temp/humidity, voltage sensor, fence monitor, solar inverter)
	•	Files (config, log files, state persistence)
	•	Network responses (ESP32 over WiFi, MQTT messages, API calls)
	•	Logs (writing to file or console)
	•	Console output (print for debugging, status)

Inside the boundary, you can assume things.
At the boundary, you must not.

## 3) print() Is Output, Not Logic

print() sends text to standard output.

It does not:
	•	Change variables
	•	Affect control flow
	•	Modify state

It reveals state.

That makes it observation, not action.

## 4) print() as a Boundary Tool

Use print() to:
	•	Observe current state
	•	Confirm assumptions
	•	Explain decisions
	•	Debug behavior
	•	Log events

Do not use print() to:
	•	Drive logic
	•	Replace return values
	•	Hide missing data
	•	Encode state changes

## 5) print() and Phase 0.12

Recall Phase 0.12: observation vs action.

print() is pure observation.

If removing print() changes program behavior, something is wrong.

## 6) Console Output Is for Humans

Console output exists for:
	•	You
	•	Operators
	•	Debugging
	•	Learning

Programs should not depend on humans reading output correctly.

That’s why print() is never a substitute for return values or state updates.

## 7) input() Is an Input Boundary

input() reads text from the user (returns a string; Chapter 1.7: strings are a type—everything from input is str until you convert).

It:
	•	Pauses execution
	•	Waits for human input
	•	Returns a string

Always a string.
Never anything else.

This is critical.

## 8) input() Introduces Uncertainty

When you call input():
	•	You don’t control what the user types
	•	You don’t control formatting
	•	You don’t control timing
	•	You don’t control correctness

This is raw, untrusted data.

## 9) Treat All Input as Untrusted

Even your own input.
Especially your own input.

Never assume:
	•	It’s numeric
	•	It’s present
	•	It’s valid
	•	It’s meaningful

Validation starts immediately. Failure mode: assuming a config value from input() or a file is a number without converting and catching errors—crash or wrong logic when the user types "twelve" or the file contains a typo.

## 10) Input Is Not Data Yet

Until validated and converted, input is:
	•	Text
	•	Ambiguous
	•	Unsafe

Only after validation does it become data your program can rely on.

This distinction prevents entire classes of bugs.

## 11) File I/O Is a Boundary Too

Files are external state (Chapter 1.10: dictionaries often hold config and state—those often live in files).

They exist:
	•	Outside memory
	•	Outside execution
	•	Across program runs

Reading from a file is input.
Writing to a file is output.

Both are boundary crossings.

## 12) Reading Files: Data Crossing In

When you read a file (config.json, voltage_log.txt, coop_state.json):
	•	You assume it exists
	•	You assume permissions allow access
	•	You assume contents are correct
	•	You assume format hasn’t changed

All of these assumptions can fail.

## 13) Writing Files: Data Crossing Out

When you write a file:
	•	You change the outside world
	•	You create persistent effects
	•	You introduce failure modes

Disk full.
Permission denied.
Path missing.
(Log file, config, or state file—same failure modes.)

Writing is action.

## 14) Always Use with for Files

The with statement:
	•	Opens the file
	•	Guarantees closure
	•	Prevents resource leaks
	•	Handles early exits safely

Example:

    with open("config.json") as f:
        contents = f.read()

File is closed even if an error occurs before the block ends. Failure mode: opening without with, then hitting an exception—file handle leaks, and on a Pi or ESP32 you can exhaust file descriptors.

This is not style.
This is correctness.

## 15) Files Persist, Variables Do Not

Variables:
	•	Exist only in memory
	•	Disappear when the program ends
	•	Are temporary

Files:
	•	Persist across runs (voltage history, coop state, fence logs)
	•	Outlive crashes
	•	Accumulate history

This makes files powerful — and dangerous.

## 16) Persistence Is a Design Choice

Decide explicitly:
	•	What must persist? (coop state, last fence voltage, solar totals)
	•	What must not?
	•	What can be reconstructed?
	•	What must survive failure?

File I/O encodes these decisions.

## 17) Type Conversion Is Boundary Work

External data arrives as strings:
	•	From input()
	•	From files (config, logs)
	•	From networks (ESP32 JSON, MQTT payloads)
	•	From sensors (serial output, API responses—often string before parsing)

Your program needs:
	•	ints
	•	floats
	•	bools
	•	structured data

Conversion happens at the boundary.

## 18) Conversion Is Not Guaranteed

Converting data can fail.

    int("abc")   # ValueError
    float("")    # ValueError
    float("12.3 volts")  # ValueError—not a pure number
    bool("False")       # True! Non-empty string is truthy

Phase 0.10: failure is normal. This is not exceptional; it is expected. Homestead: voltage sensor returns "ERR" when disconnected. Config file has "threshold": "high" instead of a number. Validate before converting.

## 19) Conversion Failures Are Boundary Failures

A conversion error means:
	•	The input was malformed
	•	The assumption was wrong
	•	Validation was missing or incomplete

This is where error handling belongs.

## 20) Validate Early, Validate Once

Best practice:
	•	Validate data as soon as it enters
	•	Reject or normalize it immediately
	•	Do not re-validate deep inside logic

This keeps core logic clean.

## 21) Boundaries Defend the Core

Your program has:
	•	A core (logic—Chapter 1.5: functions encapsulate behavior)
	•	Edges (I/O)

I/O belongs at the edges, not buried in core logic.

Boundaries protect the core from bad data.

When boundaries are weak:
	•	Core logic becomes defensive
	•	Complexity explodes
	•	Bugs hide everywhere

## 22) String Formatting Is Output Hygiene

Formatted output should:
	•	Be readable
	•	Be consistent
	•	Be explicit

Python f-strings do this well:

    voltage = 12.1
    print(f"Battery: {voltage}V")   # clear
    print("Battery:", voltage, "V")  # works but less explicit

They make output honest and clear.

## 23) Output Is Not Storage

Printing is not persistence.
Logging is not storage.
Seeing output is not saving state.

If data must survive:
	•	Write it explicitly
	•	Store it intentionally
	•	Validate on read

## 24) Input, Output, and Observation vs Action

Reading:
	•	Observes the outside world

Writing:
	•	Acts on the outside world

Confusing the two creates:
	•	Feedback loops
	•	Partial updates
	•	Inconsistent state

Keep them separate.

## 25) Boundary Thinking in Homestead Systems

In your world—battery monitor, coop controller, poultry net, solar logger, pig barn, cow barn, ESP32:
	•	Sensors are input boundaries (DHT22 temp/humidity, voltage sensor, fence monitor, solar production—validate on read)
	•	Logs are output boundaries (voltage_log.txt, coop_events.log, fence_alerts.log)
	•	Config files are input boundaries (config.json, thresholds.yaml—validate on load)
	•	State files are both (read persisted state on startup, write on update)
	•	ESP32/MQTT messages are input boundaries (coop sensor packets, fence status—validate format and range)

Every boundary deserves validation.

## 26) Boundary Bugs Are the Worst Bugs

They:
	•	Appear intermittently (sensor dropout, WiFi blip)
	•	Depend on timing
	•	Depend on environment (SD card missing, config moved)
	•	Are hard to reproduce

That’s why professionals obsess over boundaries.

## Reflection

Think about a real system—battery monitor, coop controller, poultry net, solar logger, pig barn, cow barn, ESP32. While driving or working, ask:
	•	Where does data enter this system?
	•	Where does it leave?
	•	What assumptions am I making?
	•	What happens when those assumptions break?
	•	Where should validation live?

Consider failure modes:
	•	What if a sensor returns "ERR" or -40? (Validate range before use.)
	•	What if config.json is missing or malformed? (Check file exists, parse and validate.)
	•	What if you print a value but never persist it? (Print is observation; write to file for persistence.)
	•	What if conversion fails (int("abc"))? (Catch at boundary; reject or default.)

If you can answer those questions, you’re thinking like a systems programmer.

## Core Understanding

Say this until it feels obvious:

Programs touch reality at boundaries.
Input and output are those boundaries.
External data is untrusted until validated.
Conversion happens at the edge.
Observation reveals state.
Action changes the world.
Strong boundaries keep the core simple and correct.

If this feels like Phase 0.8 fully embodied in Python mechanics, you’re exactly where you should be.

This chapter builds on Chapter 1.10 (config and state come from I/O), Chapter 1.7 (types—external data arrives as strings), and Chapter 1.8 (explicit checks at boundaries). Next: Chapter 1.12 — Errors, Exceptions, and Reality Failing, where we stop pretending failure is rare and learn how Python reports it — precisely, mechanically, and without emotion.