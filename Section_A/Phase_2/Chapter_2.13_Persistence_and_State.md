# Phase 1 · Chapter 1.13: Persistence and Remembering State

Phase 0.7 introduced a fundamental reality:

Programs operate over time.

This chapter introduces the next:

Programs stop.

Chapter 1.11 showed file I/O and boundaries; 1.12 showed exceptions when things fail. This chapter combines them: state that survives restarts, crashes, and power loss. Dictionaries (1.10) become the structure you save and load.

Every running program eventually ends:
	•	Power loss (off-grid brownout, solar dip)
	•	Restart
	•	Crash
	•	Update
	•	Intentional shutdown

When that happens, memory disappears.

If state matters across time, it must leave memory.

That is persistence.

## 1) Memory Is Temporary by Design

Variables live in memory.
Memory exists only while the program runs.

When the process ends:
	•	Variables vanish
	•	State is erased
	•	History is gone

This is not a flaw.
It is how computers work.

## 2) Persistence Is External Memory

Persistence means:
	•	Writing state outside the running program
	•	Reading it back later
	•	Restoring continuity

Files are external memory.

They outlive execution.

## 3) Persistence Turns Programs into Systems

A program without persistence:
	•	Starts fresh every time
	•	Has no memory of the past
	•	Repeats mistakes

A program with persistence:
	•	Remembers
	•	Learns
	•	Continues

Persistence creates identity over time.

## 4) Not All State Should Persist

Important distinction:

Some state is:
	•	Temporary
	•	Ephemeral
	•	Relevant only “now”

Other state is:
	•	Long-lived
	•	Foundational
	•	Part of system identity

Persist only what matters.

## 5) Examples of Persistent vs Ephemeral State

Ephemeral:
	•	Loop counters
	•	Temporary calculations
	•	Intermediate variables

Persistent:
	•	Configuration (thresholds, cooldowns, enabled flags)
	•	Calibration values
	•	Last known readings (voltage, coop temp, fence status)
	•	Timestamps
	•	System mode (generator_running, fan_on)
	•	History (voltage_log.txt, coop_events.log)

Persistence is a design decision.

## 6) Persistence Is a Boundary

Files are outside the program (Chapter 1.11: boundaries, validation).

Reading from files:
	•	Brings data into the system
	•	Requires validation

Writing to files:
	•	Pushes data out of the system
	•	Must preserve invariants

Persistence lives at a boundary.
Treat it like one.

## 7) JSON Is a Practical Persistence Format

JSON is:
	•	Text-based
	•	Structured
	•	Human-readable
	•	Machine-readable
	•	Stable
	•	Widely supported

It maps cleanly to Python types:
	•	dict
	•	list
	•	str
	•	int
	•	float
	•	bool
	•	None

This makes it ideal for Phase 1 systems.

    import json
    state = {"voltage": 12.1, "timestamp": "2025-01-30"}
    with open("coop_state.json", "w") as f:
        json.dump(state, f, indent=2)

    with open("coop_state.json") as f:
        loaded = json.load(f)  # returns dict

## 8) JSON Is Not Magic

JSON is just text.

It does not:
	•	Enforce meaning
	•	Validate correctness
	•	Guarantee completeness

You must do that. Failure mode: loaded = json.load(f) succeeds, but loaded["voltage"] raises KeyError if the key is missing—validate required keys on load.

Persistence stores state.
Design defines truth.

## 9) Saving State Is a Snapshot of Reality

When you save state, you are saying:

“This is what matters right now.”

That snapshot becomes the starting point next time.

If it is wrong, the system resumes wrong. Homestead: coop_state.json has stale temp → fan logic uses wrong value until next sensor read.

## 10) Loading State Is Trust with Verification

When you load state, you are trusting:
	•	The file exists
	•	The data is valid
	•	The structure matches expectations

This trust must be verified.

Never blindly trust persisted state.

Example: load with fallback for missing or corrupt file:

    try:
        with open("coop_state.json") as f:
            state = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        state = {"voltage": None, "temp": None}  # defaults

## 11) Persistence Can Fail

Files can:
	•	Be missing (config.json deleted, coop_state.json never created)
	•	Be corrupted (power loss during write, SD card failure)
	•	Be partially written
	•	Be outdated (old format, missing keys)

Persistence failure is normal.
Design for it.

## 12) Startup Is a Critical Moment

Startup is when:
	•	Memory is empty
	•	Files are read
	•	State is reconstructed

Most subtle bugs live here.

## 13) Startup Strategy Must Be Explicit

Decide:
	•	What happens if the file is missing?
	•	What happens if it’s invalid?
	•	What happens if fields are missing?
	•	What happens if versions differ?

There is no “default correct” answer.
There is only intentional design.

Example: config.json missing → load defaults, create file. coop_state.json corrupted → log, use last-known-good or defaults.

## 14) Defaults Are a Design Choice

Defaults represent:
	•	Safe assumptions
	•	Known-good baseline
	•	Initial conditions

Defaults are not hacks.
They are first-class design artifacts.

## 15) Persistence and Invariants

When state is restored (Phase 0.9: invariants are rules that must hold):
	•	Invariants must still hold
	•	If they don’t, the state is invalid

Example: if generator_running is True, voltage must exist. Restored state has generator_running=True but voltage=None → reject or rebuild.

Do not “fix” corrupted state silently.

Reject it.
Rebuild it.
Log it.

## 16) Persistence Makes Time Visible

Without persistence:
	•	Time resets on restart

With persistence:
	•	Time continues
	•	History exists
	•	Trends emerge

Persistence gives programs memory of time.

## 17) Logs Are Append-Only Memory

Logs are persistence too (voltage_log.txt, coop_events.log, fence_alerts.log).

Unlike state files:
	•	They are not overwritten
	•	They accumulate
	•	They preserve history

Logs answer:

“What happened?”

State answers:

“What is true now?”

## 18) State vs History

State:
	•	Current truth
	•	Small
	•	Overwritten

History:
	•	Past events
	•	Grows over time
	•	Append-only

Do not confuse them.

## 19) Snapshot Persistence

Snapshots:
	•	Save full state at once
	•	Simple
	•	Easy to restore

Downside:
	•	Larger writes
	•	Potentially redundant

Good for:
	•	Small systems
	•	Early stages
	•	Simplicity

Homestead: coop_state.json, config.json—save full dict, overwrite each time.

## 20) Incremental Persistence

Incremental updates:
	•	Save changes as they happen
	•	More efficient
	•	More complex

Downside:
	•	Harder recovery
	•	Requires replay logic

Good for:
	•	High-frequency data
	•	Large histories
	•	Advanced systems

Phase 1 favors snapshots.

## 21) Persistence Is About Continuity, Not Optimization

Early systems should prioritize:
	•	Clarity
	•	Safety
	•	Recoverability

Not performance.

You can optimize later.
You can’t recover lost history.

## 22) Persistence Is Part of the Mental Model

Persistence is not “extra.”
It is how time crosses restarts.

Your execution model now includes:
	•	Runtime memory
	•	External memory
	•	Restoration logic

This is a major step.

## 23) Homestead Example: Battery Monitor and Beyond

Battery monitor, coop controller, poultry net, solar logger, pig barn, cow barn, ESP32:

Without persistence:
	•	Restart forgets last voltage, coop temp, fence status
	•	Cooldown timers reset (generator, fan)
	•	Generator logic breaks

With persistence (config.json, coop_state.json, voltage_log.txt):
	•	Last voltage restored
	•	Cooldowns preserved
	•	System resumes safely

Persistence protects behavior across power loss.

## 24) Persistence and Failure Interlock

Failure will happen.
Restarts will happen.
Crashes will happen.

Persistence is how systems survive them.

## Reflection

Think about a real system—battery monitor, coop controller, poultry net, solar logger, pig barn, cow barn, ESP32. Ask yourself:
	•	What state defines this system?
	•	What must survive restarts?
	•	What can safely reset?
	•	What happens if saved state is wrong?
	•	How will I know?

Consider failure modes:
	•	What if coop_state.json is missing on first boot? (Create with defaults.)
	•	What if JSON is malformed after power loss mid-write? (Try/except json.JSONDecodeError; fall back to defaults.)
	•	What if a required key is missing after config format change? (Validate on load; raise or use default.)

If you can answer those, you are thinking systemically.

## Core Understanding

Say this slowly:

Memory is temporary.
Files are external memory.
Persistence preserves state across time.
Not all state should persist.
Saved state must be validated (try/except FileNotFoundError, json.JSONDecodeError; validate keys).
Missing files are normal.
Defaults are design decisions.
Logs record history.
State represents “now.”
Persistence turns programs into systems.

If this chapter feels grounding instead of technical, that’s the point.

This chapter builds on Chapter 1.11 (file I/O, with), 1.12 (exceptions when load fails), and 1.10 (dicts for state structure). Next: Chapter 1.14 — Modules and Program Structure, where we stop thinking in single files and start organizing systems intentionally.