# Phase 0 · Chapter 0.1: What Programs Actually Are (Deep Dive)

Forget languages for a minute. Not because they don't matter, but because they are surface area. If you learn the surface first, you can memorize syntax and still not understand what's happening.

Underneath every language, a program is an execution system:
	•	It receives data (explicit input)
	•	It already has some situation it's in (state)
	•	It performs steps (instructions)
	•	It produces effects (outputs)
	•	It ends in a new situation (new state)

That's the whole machine.

A version that's more accurate than "inputs → outputs" is:

A program transforms (inputs + current state) into (outputs + new state) over time.



## 1) Inputs, State, Outputs (But With Real Definitions)

### Input (explicit)

Input is anything that enters the program from outside during execution.

Examples in your world:
	•	A temperature sensor reading arriving over I2C or 1-wire
	•	A file your script reads
	•	A message arriving over Wi-Fi
	•	A button press on a device

### State (implicit)

State is everything the program already has at the moment it makes a decision.

State includes:
	•	Variables in memory (battery_voltage, fan_on, last_seen_time)
	•	Prior readings ("one second ago it was 68°F")
	•	Stored config (thresholds, calibration values)
	•	Whether a device is connected
	•	Persistent data from last run (a JSON file, a database row)

This is the part that causes years of confusion because it's invisible unless you deliberately surface it.

### Output (effects)

Output is anything the program does that changes something outside itself or communicates a result.

Examples:
	•	Printing to the screen
	•	Writing to a file
	•	Sending a network message
	•	Flipping a relay (fan on/off)
	•	Updating a dashboard value in Home Assistant

Sometimes output is obvious ("turned fan on"). Sometimes it's subtle ("updated a log file").

If you can't identify the outputs, you can't verify correctness.

## 2) The Program as a State Machine (Without Fancy Math)

A program is basically a state machine—even if you never draw a diagram. A state machine reads inputs and changes to a different state based on those inputs. A state describes the system at a moment; a transition is the set of actions that run when a condition is met or an event arrives.

At any moment:
	•	The program is in a state
	•	It receives an input (or ticks forward in time)
	•	It transitions to a new state
	•	It optionally emits outputs

### Example: Simple battery monitor

State might include:
	•	battery_voltage
	•	is_generator_running
	•	last_generator_start_time

Input might be:
	•	new voltage reading
	•	time since last check

Rules might be:
	•	if voltage < 12.1 and generator is not running → start generator
	•	if voltage > 12.6 and generator has run at least 20 minutes → stop generator

Outputs:
	•	send "start" signal
	•	write a log entry
	•	update dashboard

This is not "computer science." This is exactly how your homestead systems behave. For a formal definition, see [MDN: State machine](https://developer.mozilla.org/en-US/docs/Glossary/State_machine).

## 3) Determinism (And the Two Places It Breaks)

Deterministic means:

If the program starts with:
	•	the same input stream (same values in the same order)
	•	the same starting state
then it produces:
	•	the same outputs
	•	and the same final state

Bugs are reproducible if you can reproduce inputs and state.

### The two big ways determinism breaks in real systems

Even "simple" automation gets nondeterministic when:
	1.	Time is involved
	•	sensor sampling timing changes
	•	network delays
	•	scheduling differences
	•	loops run faster/slower
	2.	The outside world is involved
	•	sensor noise
	•	flaky Wi-Fi
	•	device disconnects
	•	file content changes
	•	user input varies

This is why strong programs do two things:
	•	They log (so you can reconstruct what happened)
	•	They validate (so bad input doesn't corrupt state)

For you, that's huge because: sensors are noisy, and off-grid systems have weird edges.

## 4) "Rules" Are Instructions, But Also Constraints

A program has:
	•	instructions: the steps it executes
	•	constraints: the conditions that must always be true if the program is healthy

Those constraints are called invariants.

### Example invariants in your world
	•	Low threshold must be < high threshold
	•	Voltage must be within a plausible range (say 0–20V for a 12V system)
	•	Temperature readings outside a plausible range are probably bad sensor data
	•	"Generator running" should not flip on/off rapidly (anti-chatter)

Enforce invariants at the boundary: before a value becomes state, validate it. For example, a function that accepts new thresholds rejects them if low >= high—the bad value never enters state.

If you write code that maintains invariants, the system becomes stable.

If you don't, the system becomes haunted.

This is one of the main differences between "code that runs" and "code you can trust."

## 5) Boundaries: Where Programs Actually Fail

Most failures happen at boundaries:
	•	where strings become numbers
	•	where files become data
	•	where sensor readings become decisions
	•	where decisions become actuator commands

A professional habit is to treat boundaries like airlocks:
	•	sanitize input
	•	validate ranges
	•	handle missing values
	•	fail safe

Fail safe means: when input is bad or ambiguous, default to the safest outcome. Fan off instead of on. Generator off instead of unknown. Alert instead of silent failure. The system degrades visibly rather than corrupting state and failing later.

Because once bad input becomes state, it spreads.

If you only learn one "engineering instinct" from this whole project, let it be:

Guard the boundary. Don't let garbage become state.

## What Instructions Really Mean (Deep Dive)

## 6) An Instruction Is a State Transformation Step

An instruction is not "a line." In some languages one line can contain many instructions. In others one instruction spans many lines.

An instruction is a step that reads some state, possibly changes state, and possibly produces output.

Most instructions do one of these:
	1.	Read (observe state)
	2.	Write (change state)
	3.	Branch (choose the next instruction)
	4.	Repeat (loop back)

Read and Write handle data. Branch and Repeat are control flow—they decide which instructions run next. That's the whole vocabulary.

## 7) Sequence Matters Because State Changes

If state never changed, order wouldn't matter.

But state changes constantly, so sequence is the backbone of behavior.

### Example: same actions, different order

Consider a program that:
	•	reads battery voltage
	•	decides whether to start generator
	•	logs what it did

Three orderings, three meanings:

```
log("voltage unknown")     →  read_voltage()  →  decide()   # Wrong: you logged before you knew
read_voltage()  →  log(voltage)  →  decide()                 # Logs observation
read_voltage()  →  decide()  →  log(action_taken)            # Logs action
```

If you log before reading voltage, your log might say "voltage unknown."
If you log after reading voltage but before decision, you log observation.
If you log after decision, you log action.

Same "pieces," different meaning.

In real monitoring systems, this is the difference between:
	•	a reliable log
	•	and a useless log

## 8) Instructions Don't Know Intent; You Provide the Structure

Computers don't know the big picture.

Your program is only as understandable as its structure.

Structure is how you protect yourself from forgetting what state means. When the log says "voltage unknown," you trace back to the line that wrote it and the state that produced it.

Structure looks like:
	•	good variable names
	•	small functions
	•	clear flow
	•	explicit validation
	•	consistent logging

That's not "style." That's traceability.

And traceability is what makes debugging possible.

## 9) Repetition: Loops Are Just Controlled Re-execution

A loop is not intelligence. It's the same instructions running again with new state.

A loop is a time machine for your logic.

Each loop iteration is a new moment:
	•	state has changed
	•	inputs may differ
	•	outputs may fire

That's why loops create most "real system" bugs:
	•	infinite loops (no state change that ends it)
	•	oscillation (state flips back and forth)
	•	drift (state gradually becomes wrong)
	•	stale data (you forget to refresh inputs)

### Homestead example: relay chatter

If you switch a fan on at 70°F and off at 69.9°F, noisy readings will cause rapid toggling.

That's not a "Python problem." That's a system design problem.

Hysteresis means using different thresholds for turning on vs. off. The solution is a rule like:
	•	turn on above 70
	•	turn off below 68

The gap prevents chatter: the system doesn't flip repeatedly when readings hover near a single threshold. That's an invariant-style design.

## 10) The Practical Goal: Predictability

When people say code is "confusing," it usually means:
	•	the state isn't obvious
	•	the sequence isn't obvious
	•	the boundary handling isn't obvious
	•	the system doesn't explain itself (no logs, no clear outputs)

Your job is to write programs that are:
	•	explainable
	•	inspectable
	•	predictable

Not clever. Predictable.

## Reflection (More Concrete, Your World)

While driving, pick one system and narrate it like a program:

Battery/gen system narration
	•	Inputs: voltage reading, time, maybe load estimate
	•	State: last start time, running flag, thresholds
	•	Rules: start/stop conditions, minimum run time, cooldown time
	•	Outputs: start signal, stop signal, log entry

Then ask:
	•	What boundary could lie? (voltage sensor glitch)
	•	What invariant must hold? (min run time)
	•	What state is sticky? (running flag)
	•	What output would confirm the system is working?

If you can narrate that, you're not "learning to code."
You're learning to build systems.

"A program is an execution process that repeatedly transforms inputs and current state into outputs and new state. Instructions are the atomic steps of that transformation, and order matters because state changes."
