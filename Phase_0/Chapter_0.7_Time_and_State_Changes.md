# Phase 0 · Chapter 0.7: Time and Programs Over Change

Programs are not static objects.

They do not exist all at once.
They do not evaluate everything simultaneously.
They do not see the world as a snapshot.

Programs live over time.

They execute instructions in sequence.
They observe state at specific moments.
They react to inputs that arrive later.
They produce outputs that affect the future.

Even the smallest program has a timeline.

Understanding that timeline is the difference between systems that feel solid and systems that feel haunted. Chapter 0.6 showed that time is often the hidden variable when assumptions fail—this chapter makes that explicit.

## 1) Time Is Always Present (Even When You Don’t Mention It)

Most programs never use the word time.

There’s no clock variable.
No explicit timestamp.
No countdown.

And yet time is everywhere.

Time exists whenever:
	•	One instruction runs after another
	•	State changes between steps
	•	Inputs arrive asynchronously—at unpredictable moments, not necessarily when the program asks for them
	•	Conditions are evaluated repeatedly
	•	Loops re-run with new data

Time is implicit in order.

If two instructions swap places, the timeline changes—and the program changes.

## 2) Sequence Is Time Made Visible

When you write instructions in order, you are defining a timeline.

This happens first.
Then this happens.
Then this happens.

That is time.

A program that behaves “incorrectly” often does so because:
	•	Something happened earlier than expected
	•	Something happened later than expected
	•	Something was checked before state updated
	•	Something was acted on after it was already stale

Nothing mystical occurred.
The timeline was wrong.

## 3) State Always Belongs to a Moment

This is subtle but essential.

State does not exist in the abstract.
State exists at a moment in time.

Examples:
	•	Battery voltage right now
	•	Temperature five seconds ago
	•	Door status before the loop ran
	•	Network connection at last check

When a program checks a condition, it is asking:

“Is this true at this moment?”

If the moment changes, the answer may change—even if nothing else did.


## 4) Timing Is Where “It Worked Earlier” Comes From

When people say:
	•	“It worked a minute ago”
	•	“It fails sometimes”
	•	“I didn’t change anything”

What usually changed was time.

Examples:
	•	A sensor hadn’t stabilized yet
	•	A network response hadn’t arrived
	•	A value was checked before it updated
	•	A loop ran faster than reality could respond

The logic was correct.
The assumptions about when things happen were not.

## 5) Real Systems Are Slower Than Code

This mismatch causes endless bugs.

Computers operate in microseconds.
The world operates in seconds, minutes, and hours.

Examples:
	•	Voltage doesn’t drop instantly
	•	Temperature doesn’t stabilize immediately
	•	Motors take time to spin up
	•	Networks introduce delay
	•	Humans hesitate

If your program assumes:
	•	Immediate response
	•	Instant correctness
	•	Perfect synchronization

Reality will break it. Homestead example: a generator start sequence—flip switch, wait for choke, listen for RPM, then apply load. Each step has its own timing. If you check voltage before the engine spins up, you get a false reading. The logic is correct; the timing was wrong.

## 6) Waiting Is Just Repeated Checking

Programs don’t actually “wait” in a human sense.

They either:
	•	Loop and recheck
	•	Pause briefly and recheck
	•	Yield control and recheck later

When you say:

“Wait for the battery to recover”

The program hears:

“Check battery voltage again later and see if the condition changed.”

Waiting is time-aware looping. This is the same idea as loops—Chapter 0.3—applied to waiting.

Poorly designed waiting:
	•	Burns resources
	•	Drains batteries
	•	Creates jitter

Well-designed waiting:
	•	Respects the pace of reality
	•	Balances responsiveness with stability

## 7) Fresh vs Stale State

Not all data ages the same way.

Some state:
	•	Becomes invalid quickly
	•	Must be refreshed often
	•	Loses meaning if delayed

Other state:
	•	Changes slowly
	•	Remains valid for long periods
	•	Provides context over time

If you treat stale data as fresh:
	•	Decisions are wrong
	•	Automation misfires
	•	Systems feel erratic

Example: battery voltage from 5 minutes ago says 12.2 V. The battery has since dropped to 11.8 V. Acting on the stale reading, you start the generator too late. The inverter already cut out.

If you refresh too aggressively:
	•	You waste resources
	•	You introduce noise
	•	You amplify instability

Time-aware programming is about balance.

## 8) Order Matters More Than Speed

Two correct instructions, run in the wrong order, can break a system.

Examples in plain language:
	•	Acting before checking
	•	Checking before updating
	•	Logging before validating
	•	Triggering output before state is ready

Example: a thermostat turns on the fan before reading temperature—it acts on last loop’s stale reading. The room was 68°F; it’s now 72°F. The fan runs needlessly. Order matters.

This is why “just make it faster” is rarely the fix.

Correct order beats fast execution every time.

## 9) Loops Are Programs’ Relationship With Time

Loops are how programs stay alive.

Every loop implies:
	•	A cadence
	•	A rhythm
	•	A sampling rate

Too fast:
	•	Noise dominates
	•	Resources are wasted

Too slow:
	•	State lags
	•	Responsiveness suffers

Example: polling a temperature sensor 100 times per second catches electrical noise and heats the circuit. Every 30 seconds might miss a freezer thaw. Homestead systems need a cadence that matches reality—often every few seconds to a few minutes.

Choosing how often something runs is a design decision, not an implementation detail.

## 10) Time Is the Hidden Input

You’ve already learned about:
	•	Inputs
	•	State
	•	Conditions
	•	Loops
	•	Errors

Time sits underneath all of them.

Time determines:
	•	When inputs arrive
	•	How state evolves
	•	When conditions change
	•	How long loops persist
	•	When errors surface

Ignoring time is how systems become fragile.

## Reflection

While driving or working, think about a system you interact with. If you haven't yet, imagine one: a thermostat, a battery monitor, a drip irrigation timer.

Ask:
	•	How often does it check its state?
	•	What happens if it checks too soon?
	•	What happens if it checks too late?
	•	Which information is fresh?
	•	Which information is already old?

If you can answer those questions, you understand time in programs.

## Core Understanding

“Programs operate over time, and correct behavior depends not just on logic, but on when state is read, changed, and acted upon.”

If that feels steady and obvious, you’re ready for the final chapter. Chapter 0.8: Consolidation ties inputs, state, conditions, loops, functions, data, errors, and time into one mental model you can carry forward into Phase 1.

