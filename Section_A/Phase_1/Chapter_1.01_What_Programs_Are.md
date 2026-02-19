# Section A Phase 1 · Chapter 1.1: What Programs Actually Are

## Learning Objectives

After this chapter, you will be able to:
- Understand programs as execution systems that transform inputs and state into outputs and new state
- Distinguish between explicit inputs, implicit state, and outputs
- Recognize programs as state machines without requiring formal mathematics
- Understand how determinism works and where it breaks in real systems
- Identify boundaries where programs typically fail
- Recognize instructions as state transformation steps
- Understand why sequence matters in programs

## Key Terms

- **Input**: Anything that enters the program from outside during execution
- **State**: Everything the program already has at the moment it makes a decision
- **Output**: Anything the program does that changes something outside itself or communicates a result
- **State Machine**: A system that reads inputs and changes to different states based on those inputs
- **Determinism**: Property where same inputs and starting state produce same outputs and final state
- **Invariant**: A condition that must always be true if the program is healthy
- **Boundary**: Where data crosses between different domains, such as strings becoming numbers or sensor readings becoming decisions

## 1) Programs Are Execution Systems

Forget languages for a minute. Not because they don't matter, but because they are surface area. If you learn the surface first, you can memorize syntax and still not understand what's happening. Underneath every language, a program is an execution system. It receives data, explicit input. It already has some situation it's in, state. It performs steps, instructions. It produces effects, outputs. It ends in a new situation, new state. That's the whole machine.

A version that's more accurate than inputs to outputs is: a program transforms inputs plus current state into outputs plus new state over time.

Input is anything that enters the program from outside during execution. Examples include a temperature sensor reading arriving over I2C or one-wire, a file your script reads, a message arriving over Wi-Fi, or a button press on a device. When your ESP32 sensor node reads temperature from a DS18B20 sensor, that reading is input.

State is everything the program already has at the moment it makes a decision. State includes variables in memory like battery_voltage, fan_on, last_seen_time, prior readings, stored config like thresholds and calibration values, whether a device is connected, and persistent data from last run like a JSON file or database row. This is the part that causes years of confusion because it's invisible unless you deliberately surface it. When your battery monitor checks voltage, it already knows the previous voltage reading, the generator running status, and the last generator start time. All of that is state.

Output is anything the program does that changes something outside itself or communicates a result. Examples include printing to the screen, writing to a file, sending a network message, flipping a relay for fan on or off, and updating a dashboard value in Home Assistant. Sometimes output is obvious like turned fan on. Sometimes it's subtle like updated a log file. If you can't identify the outputs, you can't verify correctness.

## 2) Programs Are State Machines

A program is basically a state machine, even if you never draw a diagram. A state machine reads inputs and changes to a different state based on those inputs. A state describes the system at a moment. A transition is the set of actions that run when a condition is met or an event arrives. At any moment, the program is in a state, it receives an input or ticks forward in time, it transitions to a new state, and it optionally emits outputs.

Consider a simple battery monitor. State might include battery_voltage, is_generator_running, and last_generator_start_time. Input might be new voltage reading or time since last check. Rules might be if voltage less than twelve point one volts and generator is not running, then start generator. If voltage greater than twelve point six volts and generator has run at least twenty minutes, then stop generator. Outputs include send start signal, write a log entry, and update dashboard. This is not computer science. This is exactly how your homestead systems behave.

For a formal definition, see the MDN State machine entry in resources.

## 3) Determinism and Where It Breaks

Deterministic means if the program starts with the same input stream, same values in the same order, and the same starting state, then it produces the same outputs and the same final state. Bugs are reproducible if you can reproduce inputs and state. When your battery monitor receives the same voltage reading sequence and starts with the same state, it should produce the same outputs every time.

Even simple automation gets nondeterministic when time is involved. Sensor sampling timing changes, network delays, scheduling differences, and loops run faster or slower. The outside world is involved. Sensor noise, flaky Wi-Fi, device disconnects, file content changes, and user input varies. This is why strong programs do two things. They log, so you can reconstruct what happened. They validate, so bad input doesn't corrupt state. For you, that's huge because sensors are noisy, and off-grid systems have weird edges.

When your soil moisture sensor sends readings, timing varies based on network conditions. These timing variations break determinism. Logging helps you see what actually happened. Validation prevents bad sensor readings from corrupting your system state.

## 4) Instructions and Constraints

A program has instructions, the steps it executes, and constraints, the conditions that must always be true if the program is healthy. Those constraints are called invariants. Example invariants in your world include low threshold must be less than high threshold, voltage must be within a plausible range, say zero to twenty volts for a twelve volt system, temperature readings outside a plausible range are probably bad sensor data, and generator running should not flip on or off rapidly, anti-chatter.

Enforce invariants at the boundary. Before a value becomes state, validate it. For example, a function that accepts new thresholds rejects them if low is greater than or equal to high. The bad value never enters state. If you write code that maintains invariants, the system becomes stable. If you don't, the system becomes haunted. This is one of the main differences between code that runs and code you can trust.

When your solar panel monitor receives voltage readings, it validates they're within zero to twenty volts before storing them. These validations enforce invariants and prevent bad data from corrupting state.

## 5) Boundaries Are Where Programs Fail

Most failures happen at boundaries. Where strings become numbers, where files become data, where sensor readings become decisions, and where decisions become actuator commands. A professional habit is to treat boundaries like airlocks. Sanitize input, validate ranges, handle missing values, and fail safe.

Fail safe means when input is bad or ambiguous, default to the safest outcome. Fan off instead of on. Generator off instead of unknown. Alert instead of silent failure. The system degrades visibly rather than corrupting state and failing later. Because once bad input becomes state, it spreads. If you only learn one engineering instinct from this whole project, let it be: guard the boundary. Don't let garbage become state.

When your battery monitor receives a voltage reading as a string, it must convert it to a number. That conversion is a boundary. If the string is invalid, the conversion fails. Your program must handle that failure safely.

## 6) Instructions Are State Transformation Steps

An instruction is not a line. In some languages one line can contain many instructions. In others one instruction spans many lines. An instruction is a step that reads some state, possibly changes state, and possibly produces output. Most instructions do one of these: read, observe state, write, change state, branch, choose the next instruction, or repeat, loop back. Read and Write handle data. Branch and Repeat are control flow. They decide which instructions run next. That's the whole vocabulary.

When your battery monitor reads voltage, that's a read instruction. When it stores that voltage in a variable, that's a write instruction. When it decides whether to start the generator based on voltage, that's a branch instruction. When it checks voltage every second, that's a repeat instruction. These four types cover everything programs do.

## 7) Sequence Matters Because State Changes

If state never changed, order wouldn't matter. But state changes constantly, so sequence is the backbone of behavior. Consider a program that reads battery voltage, decides whether to start generator, and logs what it did. Three orderings, three meanings. If you log before reading voltage, your log might say voltage unknown. If you log after reading voltage but before decision, you log observation. If you log after decision, you log action. Same pieces, different meaning.

In real monitoring systems, this is the difference between a reliable log and a useless log. The sequence determines what information is captured.

## 8) Structure Provides Traceability

Computers don't know the big picture. Your program is only as understandable as its structure. Structure is how you protect yourself from forgetting what state means. When the log says voltage unknown, you trace back to the line that wrote it and the state that produced it. Structure looks like good variable names, small functions, clear flow, explicit validation, and consistent logging. That's not style. That's traceability. And traceability is what makes debugging possible.

When your freezer monitor has clear variable names like freezer_internal_temp and freezer_external_temp, you can understand what each value means. This structure makes debugging possible.

## 9) Loops Are Controlled Re-execution

A loop is not intelligence. It's the same instructions running again with new state. A loop is a time machine for your logic. Each loop iteration is a new moment. State has changed, inputs may differ, and outputs may fire. That's why loops create most real system bugs. Infinite loops, no state change that ends it, oscillation, state flips back and forth, drift, state gradually becomes wrong, and stale data, you forget to refresh inputs.

Consider relay chatter. If you switch a fan on at seventy degrees Fahrenheit and off at sixty-nine point nine degrees Fahrenheit, noisy readings will cause rapid toggling. That's not a Python problem. That's a system design problem. Hysteresis means using different thresholds for turning on versus off. The solution is a rule like turn on above seventy, turn off below sixty-eight. The gap prevents chatter. The system doesn't flip repeatedly when readings hover near a single threshold. That's an invariant-style design.

When your coop temperature controller checks temperature every minute, that's a loop. Each iteration reads new temperature, checks state, decides whether to turn fan on or off, and logs the action. If thresholds are too close, noisy sensor readings cause rapid toggling.

## 10) The Goal Is Predictability

When people say code is confusing, it usually means the state isn't obvious, the sequence isn't obvious, the boundary handling isn't obvious, and the system doesn't explain itself, no logs, no clear outputs. Your job is to write programs that are explainable, inspectable, and predictable. Not clever. Predictable.

When your battery monitor logs every voltage reading and every decision, you can explain what happened. When validation happens at boundaries and invariants are enforced, the system behaves predictably. This predictability makes systems trustworthy.

## Common Pitfalls

Confusing inputs with state causes problems. Inputs come from outside during execution. State is what the program already knows. If you treat inputs as state without validation, bad data corrupts your system. Always validate inputs at boundaries before they become state.

Ignoring invariants leads to unstable systems. Invariants are conditions that must always be true. If you don't enforce them, state can become invalid. For example, if low threshold can be greater than high threshold, your system will behave unpredictably. Enforce invariants at boundaries.

Not understanding sequence causes bugs. The order of operations matters because state changes. If you log before reading data, your logs will be wrong. If you decide before validating input, your decisions will be based on invalid data. Think carefully about the sequence of operations.

Forgetting that loops create new moments causes stale data problems. Each loop iteration is a new moment with potentially new inputs and changed state. If you don't refresh inputs in each iteration, you're working with stale data. Always read fresh inputs at the start of each loop iteration.

Not guarding boundaries causes failures. Most failures happen where data crosses boundaries. Strings becoming numbers, sensor readings becoming decisions, decisions becoming actuator commands. Always validate and sanitize at boundaries. Fail safe when input is bad or ambiguous.

## Summary

A program is an execution system that transforms inputs plus current state into outputs plus new state over time. Inputs come from outside during execution. State is everything the program already knows. Outputs are effects that change something outside the program. Programs are state machines that transition between states based on inputs. Determinism means same inputs and starting state produce same outputs, but determinism breaks when time or the outside world is involved. Invariants are constraints that must always be true. Boundaries are where data crosses domains and where most failures occur. Instructions are state transformation steps: read, write, branch, or repeat. Sequence matters because state changes. Structure provides traceability. Loops are controlled re-execution with new state each iteration. The goal is predictability through explainable, inspectable code that guards boundaries and enforces invariants. A program is an execution process that repeatedly transforms inputs and current state into outputs and new state. Instructions are the atomic steps of that transformation, and order matters because state changes.

## Next

This chapter introduced the fundamental mental model of programs as execution systems. Next, Chapter 1.2 explores how programs interact with the outside world through boundaries, where inputs become state and state becomes outputs. Understanding boundaries is essential for building reliable systems that handle real-world conditions gracefully.
