# Section A Phase 2 · Chapter 2.11: Input, Output, and Program Boundaries

Chapter 1.8 established that programs do not live in isolation: they touch the outside world at boundaries, and validation belongs at those boundaries. This chapter expresses that idea in Python—print, input, file I/O, and type conversion. Chapter 2.10 gave you dictionaries for config and state; this chapter shows where that config and state come from and go. Chapter 2.07 gave you types (int, float, str, bool); this chapter shows how external data arrives as strings and must be converted and validated. Chapter 1.8 and 2.08 showed explicit checks for None and truthiness; those checks belong at boundaries, where data enters. Input and output are not features; they are edges—the places where reality enters and leaves your program. Most serious bugs are boundary bugs.

## Learning Objectives

After this chapter, you will be able to:
- Identify boundaries: where data enters and leaves the program
- Use print for observation only, not for logic or state
- Treat all input (input(), files, network) as untrusted until validated
- Use the with statement for file I/O to avoid leaks and ensure closure
- Convert and validate external data at the boundary (type conversion, range checks)
- Distinguish observation (read, print) from action (write, persist)
- Apply boundary thinking to sensors, config files, logs, and state persistence

## Key Terms

- **Boundary**: Any place where data enters or leaves the program (input, output, files, network)
- **Observation**: Reading or displaying state without changing it (e.g. print, read file)
- **Action**: Changing state or the outside world (e.g. write file, send output)
- **with statement**: Python construct that opens a resource, runs a block, and guarantees the resource is closed even if an error occurs; use it for all file I/O to prevent leaks

## 1) Programs Live Inside, Reality Lives Outside

Inside your program, variables are well-typed, assumptions mostly hold, and logic is predictable. Outside your program, data is missing (sensor timeout, ESP32 offline), formats change (DHT22 returns different structure, config file format drifts), timing is unreliable (network latency, user pauses), humans make mistakes (typos in config, wrong units), files are corrupted (log truncated, config overwritten), sensors can lie (DHT22 returns minus forty when faulty, voltage sensor reads zero when disconnected), and networks fail (Wi‑Fi drops, MQTT broker unreachable). Input and output are how those two worlds meet. Every time data crosses in or out, you are at a boundary.

## 2) Boundaries Are Where Programs Are Honest

A boundary is any place where data enters the program or leaves the program. Examples: user input (console, config prompts), sensor readings (DHT22 temp and humidity, voltage sensor, fence monitor, solar inverter), files (config, log files, state persistence), network responses (ESP32 over Wi‑Fi, MQTT messages, API calls), logs (writing to file or console), and console output (print for debugging or status). Inside the boundary you can assume things; at the boundary you must not. Validation and conversion happen at the boundary so the rest of the program can assume the data is valid. Every read from a sensor, file, or network is a boundary; every write to a file or log is a boundary. List them for your system and defend each one.

## 3) print() Is Output, Not Logic

print sends text to standard output. It does not change variables, affect control flow, or modify state. It reveals state. That makes it observation, not action. Use print to observe current state, confirm assumptions, explain decisions, debug behavior, or log events. Do not use print to drive logic, replace return values, hide missing data, or encode state changes. If removing print changes program behavior, something is wrong—print should only expose state, not control it.

## 4) print() and Observation vs Action

Chapter 1.12: observation vs action. print is pure observation. It does not act on the world except to display. Programs should not depend on humans reading output correctly. That is why print is never a substitute for return values or state updates. Return data from functions; write to files when persistence is required. Print is for humans and debugging, not for the program’s logic.

## 5) Console Output Is for Humans

Console output exists for you, for operators, for debugging, and for learning. It is not a reliable channel for the program to communicate with itself. Do not use the content of what you printed to drive later logic. Use variables and return values for that. Keep output for humans and logic in code.

## 6) input() Is an Input Boundary

input reads text from the user. It pauses execution, waits for human input, and returns a string. Always a string; never anything else until you convert it. That is critical. Chapter 2.07: strings are a type. Everything from input is string until you validate and convert. Do not assume the user typed a number, a valid choice, or anything sensible. Validate and convert at the boundary. In automated or headless systems you may rarely use input() directly, but the same rule applies to any text source: config prompts, one-off scripts, or tools that read from stdin. String in, validated and converted before use.

## 7) input() Introduces Uncertainty

When you call input, you do not control what the user types, how they format it, timing, or correctness. The user might type "twelve" instead of 12, leave it empty, or paste garbage. This is raw, untrusted data. Treat it that way from the moment it enters.

## 8) Treat All Input as Untrusted

Even your own input; especially your own input. Never assume it is numeric, present, valid, or meaningful. Validation starts immediately. Failure mode: assuming a config value from input or from a file is a number without converting and catching errors—crash or wrong logic when the user types a word or the file contains a typo. Convert with care, catch conversion errors, and reject or default at the boundary.

## 9) Input Is Not Data Yet

Until validated and converted, input is text, ambiguous, and unsafe. Only after validation does it become data your program can rely on. This distinction prevents entire classes of bugs. Do not use unvalidated input in conditions, calculations, or persistence. Validate first, then use.

## 10) File I/O Is a Boundary Too

Files are external state (Chapter 2.10: dictionaries often hold config and state that live in files). They exist outside memory, outside execution, and across program runs. Reading from a file is input. Writing to a file is output. Both are boundary crossings. The same rules apply: validate what you read, decide what you write, and handle missing files, permission errors, and malformed content at the boundary.

## 11) Reading Files: Data Crossing In

When you read a file—config, voltage log, coop state—you might assume it exists, that permissions allow access, that contents are correct, and that the format has not changed. All of these assumptions can fail. The file might be missing, moved, or renamed. It might be empty or corrupted. The format might have changed. Validate at read time: check that the file exists if that is required, parse and validate structure, and handle errors before passing data into the rest of the program. Homestead example: config file missing on first run, or state file from an older version of the program with different keys. Design for those cases at the boundary—default config, migrate state, or fail clearly—so the core never sees invalid structure.

## 12) Writing Files: Data Crossing Out

When you write a file, you change the outside world and create persistent effects. You also introduce failure modes: disk full, permission denied, path missing. Log files, config, and state files have the same failure modes. Writing is action. It has consequences. Design for write failures: handle errors, avoid partial or corrupted writes when possible, and know what state the system is in if a write fails.

## 13) Always Use with for Files

The with statement opens the file, runs a block of code, and guarantees the file is closed when the block ends, even if an error occurs or the block exits early. That prevents resource leaks. Failure mode: opening a file without with, then hitting an exception—the file handle may never be closed. On a Raspberry Pi or ESP32 you can exhaust file descriptors if you leak enough. Using with is not style; it is correctness. Always use it for file I/O. The pattern is: open the file in a with block, read or write inside the block, and let Python close it when the block exits. No explicit close call required, and no leak on error.

## 14) Files Persist, Variables Do Not

Variables exist only in memory and disappear when the program ends; they are temporary. Files persist across runs—voltage history, coop state, fence logs—outlive crashes, and accumulate history. That makes files powerful and dangerous. What you write stays. Stale or wrong data in a file will be read on the next run. Decide explicitly what must persist, what must not, what can be reconstructed, and what must survive failure. File I/O encodes those decisions.

## 15) Persistence Is a Design Choice

Decide what must persist (e.g. coop state, last fence voltage, solar totals), what must not, what can be reconstructed from other sources, and what must survive failure. Do not persist by accident (e.g. logging something and later assuming it was saved in a structured way). Persist intentionally: write to a known path, in a known format, and validate on read. That way restart and recovery behave predictably.

## 16) Type Conversion Is Boundary Work

External data arrives as strings: from input(), from files (config, logs), from networks (ESP32 JSON, MQTT payloads), from sensors (serial output, API responses—often string before parsing). Your program needs ints, floats, bools, and structured data. Conversion happens at the boundary. Do not pass raw strings deep into logic; convert and validate as soon as data enters, then pass typed values. That way the rest of the program can use numeric comparison, type-based logic, and clear contracts. One conversion point at the edge is easier to test and maintain than scattered conversions and checks everywhere.

## 17) Conversion Is Not Guaranteed

Converting data can fail. Converting a non-numeric string to int or float raises an error. Converting an empty string to float fails. A string like "12.3 volts" is not a pure number and may fail or give wrong results. The string "False" is truthy in a boolean context because it is non-empty—so converting or using it as a boolean can surprise you. Chapter 1.10: failure is normal. Conversion failure is expected, not exceptional. Homestead example: voltage sensor returns "ERR" when disconnected; config file has a threshold as the string "high" instead of a number. Validate before converting; catch conversion errors at the boundary and reject or default.

## 18) Conversion Failures Are Boundary Failures

A conversion error means the input was malformed, your assumption was wrong, or validation was missing or incomplete. That is where error handling belongs—at the boundary. Do not let conversion errors propagate into core logic. Catch them, log or report, and either reject the input or use a safe default. Then the rest of the program sees only valid, converted data.

## 19) Validate Early, Validate Once

Validate data as soon as it enters. Reject or normalize it immediately. Do not re-validate deep inside logic. That keeps core logic clean: it receives data that has already been validated and converted. Validation at the boundary is the single place where you enforce shape, range, and presence; the core then assumes the contract holds.

## 20) Boundaries Defend the Core

Your program has a core—logic, functions, conditions, loops (Chapter 2.05: functions encapsulate behavior)—and edges: I/O. I/O belongs at the edges, not buried in core logic. Boundaries protect the core from bad data. When boundaries are weak, core logic becomes defensive, complexity explodes, and bugs hide everywhere. When boundaries are strong, the core can assume valid input and focus on behavior. A good design has a thin, strict boundary layer and a core that does not check "did we get a number?" everywhere; the boundary already guaranteed that.

## 21) Formatted Output Is Readable Output

Formatted output should be readable, consistent, and explicit. Python’s formatted strings let you embed values in a clear way—for example, "Battery: 12.1 V" instead of separate pieces that might be hard to read. They make output honest and clear. Use them for logs and status so that when you or an operator reads the output, the meaning is obvious. Consistency in format also makes log parsing and debugging easier later.

## 22) Output Is Not Storage

Printing is not persistence. Logging to the console is not storage. Seeing output is not saving state. If data must survive a restart or be read by another process, write it explicitly to a file (or other persistent store), store it intentionally in a known format, and validate on read. Do not assume that because you printed something, it is saved.

## 23) Input, Output, and Observation vs Action

Reading observes the outside world: you get data without changing it (or without intending to change it). Writing acts on the outside world: you change files, send data, persist state. Confusing the two creates feedback loops, partial updates, and inconsistent state. Keep them separate. Read and validate at the boundary; then act (or not) based on what you read. Do not mix "read a value" and "write a value" in a way that assumes one always follows the other without explicit logic.

## 24) Boundary Thinking in Homestead Systems

In your systems—battery monitor, coop controller, poultry net, solar logger, barn sensors, ESP32—sensors are input boundaries: DHT22 temp and humidity, voltage sensor, fence monitor, solar production, soil moisture. Validate on read: type, range, presence. Logs are output boundaries: voltage log, coop events, fence alerts. Config files are input boundaries: config file, thresholds file; validate on load and use .get() with defaults for optional keys. State files are both: read persisted state on startup, write on update; validate structure on read and design for missing or old-version files. ESP32 or MQTT messages are input boundaries: coop sensor packets, fence status; validate format and range before using. Every boundary deserves validation. Identify where data enters and leaves, then add validation and conversion there.

## 25) Boundary Bugs Are the Worst Bugs

Boundary bugs appear intermittently (sensor dropout, Wi‑Fi blip), depend on timing, depend on environment (SD card missing, config moved), and are hard to reproduce. That is why professionals focus on boundaries. Strong validation at the edge, explicit conversion, and clear handling of missing or malformed data reduce the number of bugs that only show up "sometimes" or "in production." Document what each boundary expects (required keys, types, ranges) and what it does when data is missing or invalid. That documentation is part of the contract.

## Common Pitfalls

Assuming input is valid or numeric without converting and catching errors. Always validate and convert at the boundary; handle conversion failures.

Using print to drive logic or as a substitute for return values or state updates. Print is observation; use return values and variables for logic and persistence.

Opening files without the with statement. Use with so files are always closed and you do not leak file descriptors.

Treating "I printed it" as "I saved it." Output is not storage; write to a file (or other store) when data must persist.

Validating too late—deep in logic instead of at the boundary. Validate as soon as data enters; keep the core free of defensive checks against bad input.

Mixing observation and action at the boundary without clear structure. Read and validate first; then decide what to write or do. Keep the flow clear.

Forgetting that file paths are environment-dependent. A path that works on your machine may not exist on a Pi or in a different working directory. Validate that the file exists (or that the directory exists for writes) when that is required, and handle missing paths at the boundary.

## Summary

Programs touch reality at boundaries: input and output. External data is untrusted until validated. It arrives as strings; conversion and validation happen at the boundary. print is observation—it reveals state but does not change logic or persist data. input and file reads are input boundaries; file writes and other output are output boundaries. Use the with statement for file I/O so resources are always closed. Validate early, validate once; let the core assume valid data. Observation reveals state; action changes the world. Strong boundaries keep the core simple and correct. Chapter 1.8 (boundaries), 2.08 (explicit checks), and 2.10 (dictionaries for config and state) all come together here: data enters and leaves at edges, and that is where you enforce the contract. Most serious bugs are boundary bugs; defending the edges pays off in fewer intermittent failures and clearer errors.

## Next

Chapter 2.12 (Errors, Exceptions, and Reality Failing) is where validation fails in Python. When conversion raises an error, when a key is missing, or when an assumption breaks, Python reports it with exceptions—try/except, raise, tracebacks, and exception types. This chapter showed where boundaries live and why validation belongs there; the next shows how Python reports when validation fails or when reality disagrees with your assumptions, and how to handle those reports in code so that boundary failures become explicit, logged, or recovered instead of crashes.
