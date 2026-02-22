# Section A Phase 2 · Chapter 2.13: Persistence and Remembering State

Chapter 1.7 introduced that programs operate over time. This chapter adds: programs stop. Chapter 2.11 showed file I/O and boundaries; Chapter 2.12 showed exceptions when things fail. This chapter combines them—state that survives restarts, crashes, and power loss. Dictionaries (Chapter 2.10) become the structure you save and load. Every running program eventually ends: power loss (off-grid brownout, solar dip), restart, crash, update, or intentional shutdown. When that happens, memory disappears. If state matters across time, it must leave memory. That is persistence.

## Learning Objectives

After this chapter, you will be able to:
- Understand memory as temporary and persistence as external memory (files)
- Distinguish state that should persist (config, last known readings, system mode) from ephemeral state (loop counters, temporaries)
- Treat persistence as a boundary: validate on read, preserve invariants on write
- Use a structured format (e.g. JSON) for saving and loading state with validation
- Design startup strategy: what to do when the file is missing, invalid, or has missing keys
- Distinguish state (current truth, overwritten) from history (logs, append-only)
- Choose snapshot persistence for clarity and recoverability in early systems

## Key Terms

- **Persistence**: Writing state outside the running program so it can be read back later and continuity restored across restarts
- **Snapshot**: Saving full state at once (e.g. one JSON file overwritten each time); simple and easy to restore
- **State file**: A file that holds current truth (e.g. last voltage, coop temp, generator running); read on startup, written when state changes; often overwritten each save

## 1) Memory Is Temporary by Design

Variables live in memory. Memory exists only while the program runs. When the process ends—crash, restart, power loss—variables vanish, state is erased, and in-memory history is gone. This is not a flaw; it is how computers work. If you need state to outlive the process, you must write it somewhere that survives: a file, a database, or another durable store. Persistence is the name for that.

## 2) Persistence Is External Memory

Persistence means writing state outside the running program, reading it back later, and restoring continuity. Files are external memory. They outlive execution. You write the current voltage, the last coop temp, the generator state, or the config to a file; when the program starts again, it reads that file and restores state so it can continue instead of starting from zero. Without persistence, every start is a cold start. With persistence, the system has memory across runs.

## 3) Persistence Turns Programs into Systems

A program without persistence starts fresh every time, has no memory of the past, and can repeat the same mistakes or lose context. A program with persistence remembers: last readings, cooldown timers, mode, config. It continues across restarts. Persistence creates identity over time. A battery monitor that restores last voltage and cooldown state after a brownout is a system; one that forgets everything is just a script that runs again from scratch.

## 4) Not All State Should Persist

Some state is temporary, ephemeral, relevant only "now"—loop counters, temporary calculations, intermediate variables. Other state is long-lived, foundational, part of system identity—configuration, last known readings, system mode, timestamps. Persist only what matters. Persisting everything would be noisy, slow, and risky; persisting nothing would make restarts forget what the system needs to resume safely. The design choice is: what must survive a restart, and what can reset?

## 5) Examples of Persistent vs Ephemeral State

Ephemeral: loop counters, temporary calculations, intermediate variables. Persistent: configuration (thresholds, cooldowns, enabled flags), calibration values, last known readings (voltage, coop temp, fence status), timestamps, system mode (generator running, fan on), and for history you might have log files (voltage log, coop events, fence alerts). Persistence is a design decision. List what your system must remember across restarts and what it can afford to lose; then persist the former and keep the latter in memory only.

## 6) Persistence Is a Boundary

Files are outside the program (Chapter 2.11: boundaries, validation). Reading from files brings data into the system and requires validation—file might be missing or corrupt, structure might have changed. Writing to files pushes data out and must preserve invariants—what you write is what will be read next time. Persistence lives at a boundary. Treat it like one: validate on read, write in a known format, and handle missing or invalid files explicitly. Do not assume the file exists or is correct.

## 7) JSON Is a Practical Persistence Format

JSON is text-based, structured, human-readable, machine-readable, stable, and widely supported. It maps cleanly to Python types: dict, list, str, int, float, bool, None. That makes it ideal for saving and loading state: you build a dictionary (or list of dicts), write it to a file as JSON, and later read the file and parse it back into a dict. You use the standard library to dump and load; you open the file with with so it is always closed. The result is a simple, debuggable format for config and state files. Homestead example: coop state as a dict with voltage, temp, timestamp; write to coop_state.json on update, read on startup. You can inspect the file with a text editor or script; you do not need special tools. That simplicity pays off when debugging "why did it start with that value?"

## 8) JSON Is Not Magic

JSON is just text. It does not enforce meaning, validate correctness, or guarantee completeness. You must do that. After loading, the result is a dict; if a key is missing, accessing it raises KeyError. Validate required keys on load. Check types and ranges if they matter. Persistence stores state; design defines truth. Failure mode: loading succeeds but a required key is missing—always validate structure and required keys after load, and fall back to defaults or fail clearly when the file is invalid.

## 9) Saving State Is a Snapshot of Reality

When you save state, you are saying: this is what matters right now. That snapshot becomes the starting point next time. If it is wrong—stale, corrupted, or from an old version—the system resumes wrong. Homestead: coop_state.json has a stale temp; fan logic uses the wrong value until the next sensor read. So save at the right times (after meaningful updates), and keep the format and keys stable so that what you write is what you expect to read. Snapshot persistence usually means overwriting the file each time with the full current state.

## 10) Loading State Is Trust with Verification

When you load state, you are trusting that the file exists, the data is valid, and the structure matches expectations. That trust must be verified. Never blindly trust persisted state. The file might be missing (first run, or deleted). The file might be corrupted (power loss during write, SD card failure). The format might have changed (old version, missing keys). Use try/except around open and parse: catch FileNotFoundError and JSON decode errors, and fall back to defaults or a known-good state. Validate required keys and types after load. If validation fails, reject or rebuild state and log the problem.

## 11) Persistence Can Fail

Files can be missing (config deleted, state file never created), corrupted (power loss during write, SD card failure), partially written, or outdated (old format, missing keys). Persistence failure is normal. Design for it. Decide what to do when the file is missing: use defaults and optionally create the file. Decide what to do when the file is invalid: log, use defaults or last-known-good, and do not pretend the corrupted data is valid. Do not silently overwrite or "fix" corrupted state in a way that hides the failure.

## 12) Startup Is a Critical Moment

Startup is when memory is empty, files are read, and state is reconstructed. Most subtle bugs live here: assuming the file exists, assuming the format is current, or assuming all keys are present. Design startup explicitly. Read the state file (or config), handle missing and invalid files, validate structure, and only then run the rest of the program. If you cannot restore valid state, use defaults or exit with a clear message. Do not start the main loop with invalid or half-restored state.

## 13) Startup Strategy Must Be Explicit

Decide: what happens if the file is missing? What if it is invalid? What if fields are missing? What if the format version differs? There is no single "default correct" answer; there is only intentional design. Example: config missing → load defaults and optionally create the file. State file corrupted → log the error, use last-known-good or defaults, and continue so the system can recover. Required key missing after a format change → validate on load and either raise or supply a default. Document the strategy so that the next person (or you in six months) knows how startup behaves.

## 14) Defaults Are a Design Choice

Defaults represent safe assumptions, a known-good baseline, and initial conditions. They are not hacks; they are first-class design artifacts. When the file is missing or invalid, defaults let the system start in a safe state—e.g. voltage None, fan off, cooldown zero—so that the first sensor read or first user action can update state. Choose defaults that match "system just booted" or "we know nothing yet" rather than arbitrary values that look like real data.

## 15) Persistence and Invariants

When state is restored (Chapter 1.9: invariants are rules that must hold), invariants must still hold. If they do not, the state is invalid. Example: if generator_running is True, voltage must exist. Restored state has generator_running True but voltage None → that is invalid. Do not "fix" corrupted state silently. Reject it, rebuild it from defaults, or log and recover. Enforce invariants after load; if the persisted state violates them, do not use it as-is. Validation at load time is part of the boundary.

## 16) Persistence Makes Time Visible

Without persistence, time resets on every restart. With persistence, time continues: last update timestamp, cooldown remaining, history of events. History exists across runs; trends and past behavior can be inferred from logs or saved state. Persistence gives programs memory of time. That is why a coop controller can "remember" that the fan was on and for how long, or a battery monitor can resume with the last voltage and the correct cooldown state.

## 17) Logs Are Append-Only Memory

Logs are persistence too (voltage log, coop events, fence alerts). Unlike state files, they are not overwritten; they accumulate and preserve history. Logs answer: what happened? State answers: what is true now? State is typically a single file or a small structure that you overwrite with the current snapshot. Logs are append-only: each event or reading is written as a new line or entry. Do not confuse them. Use state for "current truth" and logs for "what happened over time."

## 18) State vs History

State is current truth: small, overwritten each time you save. History is past events: it grows over time and is append-only. State might be "voltage twelve point one, generator off, last update at ten o'clock." History might be "at ten o'clock voltage was twelve point one, at ten oh one it was twelve point zero." Use state for resuming; use history for debugging, auditing, or analysis. Mixing them—e.g. treating a log file as the source of current state without a clear "latest" rule—creates confusion. Keep state and history separate in design.

## 19) Snapshot Persistence

Snapshot persistence means saving full state at once. It is simple and easy to restore: one file, one read, one validation. The downside is larger writes and potentially redundant data. It is good for small systems, early stages, and simplicity. Homestead: coop_state.json, config.json—save the full dict, overwrite each time. When the program starts, read the file once and you have the whole state. No replay, no merging; just load and validate.

## 20) Incremental Persistence

Incremental persistence means saving changes as they happen—append-only or update-in-place. It can be more efficient for high-frequency data or large histories but is more complex: recovery may require replay or merging, and you need a clear story for "what is current state." Good for advanced or high-throughput systems. For Phase 2 and early systems, snapshot persistence is preferred: clarity and recoverability first, optimization later.

## 21) Persistence Is About Continuity, Not Optimization

Early systems should prioritize clarity, safety, and recoverability over performance. You can optimize later—smaller writes, incremental updates, compression. You cannot recover lost history or corrupted state if you did not design for it. Get the format right, validate on load, handle missing and invalid files, and document what persists and what the startup strategy is. Then run it; optimize only when you have a real need.

## 22) Persistence Is Part of the Mental Model

Persistence is not "extra"; it is how time crosses restarts. Your execution model now includes runtime memory (variables, in-memory state), external memory (files), and restoration logic (read on startup, validate, default or fail). That is a major step. When you think about a battery monitor or coop controller, you think: what state must survive a restart? Where is it stored? What happens when the file is missing or corrupt? Persistence is part of the system design, not an afterthought.

## 23) Homestead Example: Battery Monitor and Beyond

Battery monitor, coop controller, poultry net, solar logger, barn sensors, ESP32: without persistence, a restart forgets last voltage, coop temp, fence status; cooldown timers reset (generator, fan); and logic that depends on "last state" breaks. With persistence (config file, state file, optional logs), last voltage is restored, cooldowns can be preserved or reset by design, and the system resumes safely. Persistence protects behavior across power loss and restarts. Design which state to save (e.g. last readings, mode, cooldown), where to save it (state file path), and how to load and validate on startup. Keep the format stable so that a file written by one run is readable by the next; avoid changing keys or structure without a migration or compatibility strategy.

## 24) Persistence and Failure Interlock

Failure will happen. Restarts will happen. Crashes will happen. Persistence is how systems survive them: they read saved state (or defaults), validate it, and continue. Combine persistence with the ideas from Chapter 2.11 (file I/O, with, boundaries) and 2.12 (exceptions when load fails): use with for files, catch FileNotFoundError and decode errors on load, validate structure, and have a clear startup strategy. Then the system can recover from power loss, crash, or restart instead of starting blind every time. Document what you persist, where, and how startup behaves so that the design is visible to anyone who maintains the system.

## Common Pitfalls

Assuming the state file exists. On first run or after a reset it may not. Always handle missing file: use defaults and optionally create the file.

Trusting loaded state without validation. The file may be corrupted or from an old version. Validate required keys and types after load; reject or default when invalid.

Saving state in the middle of an inconsistent update. If you write after updating only part of state, a crash can leave half-old, half-new data. Prefer writing a full snapshot when state is consistent.

Using the same file for "current state" and "history" without a clear rule. State is overwritten; history is appended. Mixing them makes recovery and reasoning harder.

Ignoring persistence failures. If write fails (disk full, permission denied), log it and decide whether to retry or continue without persisting. Do not assume every write succeeded.

## Summary

Memory is temporary; when the process ends, variables vanish. Persistence is writing state outside the program (e.g. to files) so it can be read back later and continuity restored. Not all state should persist—only what must survive restarts (config, last readings, mode). Persistence is a boundary: validate on read, preserve invariants on write, handle missing and invalid files. Use a structured format like JSON for state and config; validate after load and use defaults when the file is missing or corrupt. Startup strategy must be explicit: what to do when the file is missing, invalid, or has missing keys. State is current truth (overwritten); history is logs (append-only). Snapshot persistence (save full state at once) favors clarity and recoverability for early systems. Persistence turns programs into systems that remember across restarts, crashes, and power loss. Chapter 2.11 (file I/O, with) and 2.12 (exceptions) support this: read with with, catch load failures, validate, and continue. Persistence is how programs become systems that survive restarts and failures. Design it in from the start, not as an afterthought.

## Next

Chapter 2.14 (Modules and Program Structure) is where persistence and boundaries meet file organization. Config and state files are read and written by code that lives in files too—modules. A battery monitor or coop controller grows from one script into multiple modules: one for config, one for storage, one for sensors. Each module is a boundary and a unit of responsibility. This chapter gave you persistence; the next gives you a way to organize the code that does the persisting, and the rest of the system, so that structure stays clear as the system grows.
