# Phase 0 · Chapter 0.12: Observation vs Action

Reading state and changing state are fundamentally different operations.

Confusing them leads to:
	•	Feedback loops
	•	Race conditions
	•	Oscillation
	•	Bugs that only appear "sometimes"

This chapter is about drawing a hard conceptual line between seeing the world and changing the world—and why systems become unstable when that line blurs. Chapter 0.11 showed that abstractions lie when names imply observation but cause action; this chapter makes that distinction explicit and structural.

## 1) Two Kinds of Operations

At a high level, every meaningful operation a program performs falls into one of two categories:
	•	Observation
	•	Action

Everything else—conditions, loops, functions—exists to coordinate these two.

Homestead example: a battery monitor observes voltage and decides whether to act—start generator, alert, log. The observation and the action are separate steps. Coordination is the logic that connects them: "if voltage low and generator off, then start generator."

## 2) Observation Does Not Change State

Observation means:
	•	Reading a value
	•	Inspecting current state
	•	Asking a question about the system
	•	Measuring something about the world

Examples:
	•	Reading temperature
	•	Checking voltage
	•	Inspecting whether a flag is set
	•	Asking "is the generator running?"

The defining rule:

Observation should not change what it observes.

If observing changes state, the system becomes self-interfering.

Homestead example: reading voltage shouldn't change voltage. Checking "is the generator running?" shouldn't start it. If get_voltage() turns on a relay to "get a reading," the observation changed what it observed—the system is now self-interfering.

## 3) Observation Is About Truth at a Moment

When you observe state, you are asking:

"What is true right now?"

Observation is always tied to:
	•	A moment in time
	•	The current state
	•	The current inputs

It does not:
	•	Predict the future
	•	Enforce behavior
	•	Cause change

It only reveals what is.

Homestead example: "What is the voltage right now?"—a snapshot at this moment. Not "what will it be after the generator runs" or "what was it five minutes ago." Observation captures truth at a moment. Prediction and history are different.

## 4) When Observation Lies

Observation becomes dangerous when it pretends to be passive but isn't.

Example: a function named get_voltage() that reads a sensor—and also turns on a relay, updates a shared variable, or triggers logging with side effects.

The caller believes:

"I'm just looking."

The system is actually doing.

This mismatch creates invisible coupling between parts of the program.

Homestead example: get_voltage() that turns on a relay "to stabilize the reading"—the caller expected observation. They got action. The next caller might be a dashboard that only wants to display voltage; now the dashboard triggers a relay. The abstraction lied. Chapter 0.11: names are promises.

## 5) Action Changes State

Action means:
	•	Writing a value
	•	Updating a variable
	•	Flipping a relay
	•	Sending a signal
	•	Changing the outside world

After action:
	•	State is different
	•	The world has changed
	•	Future observations will reflect that change

Action is irreversible in the short term.

You can't "un-flip" time.

Homestead example: flipping a relay to start the generator—the relay is on. The world has changed. Future observations will see generator running, voltage rising. You can't un-flip without another deliberate action. Action is commitment.

## 6) Action Is Commitment

When a program acts, it commits to a new reality.

Examples:
	•	Starting a generator
	•	Opening a valve
	•	Writing to disk
	•	Sending a network command

Once action occurs:
	•	Other parts of the system must adapt
	•	Assumptions must be updated
	•	State must be reconsidered

This is why action must be deliberate.

Homestead example: start_generator() commits. The generator is running. Battery voltage will rise. Temperature may change. Any observer that assumed "generator off" must update. Acting is committing—don't act until you've observed and decided.

## 7) Feedback Loops: When Observation and Action Collide

A feedback loop occurs when:
	1.	You observe state
	2.	You act based on that observation
	3.	The action changes what you observe
	4.	You observe again
	5.	The cycle repeats

Feedback loops are not bad.
They are powerful.

They are also dangerous.

Homestead example: voltage low → start generator → voltage rises → stop generator → voltage drops → start again. That's an intentional feedback loop. It works if you wait between cycles and respect timing. It oscillates—start, stop, start, stop—if you don't.

## 8) The Thermostat Example (Revisited Properly)

Consider a thermostat:
	•	Observe temperature
	•	Decide if it's too hot
	•	Turn on the fan
	•	Fan cools air
	•	Temperature changes
	•	Observe again

This is a controlled feedback loop.

It only works because:
	•	Observation is separate from action
	•	Timing is respected
	•	The system waits between cycles
	•	State changes are expected

Remove any of those, and the system oscillates.

Homestead example: a greenhouse thermostat—observe temperature, decide to open vent, act. Vent opens, temperature drops, observe again. Same pattern. It works because observation is separate from action and timing is respected.

Another: a battery monitor observes voltage, decides to start the generator, acts—then waits. If it re-checks voltage in one second, the generator hasn't stabilized; the reading is wrong. The system oscillates—start, stop, start, stop. Wait between observe and re-observe. Chapter 0.7: time matters.

## 9) Accidental Feedback Loops

The worst bugs come from unintentional feedback loops.

Examples:
	•	Observing state that was just modified
	•	Acting on partially updated data
	•	Re-checking conditions too quickly
	•	Letting observation trigger action implicitly

These systems don't fail consistently.
They fail intermittently.

That's why they're hard to debug.

Homestead examples: get_voltage() that turns on a relay before reading—the observation acts first; the next "observation" sees a different world than the one that existed before the call. Or observing voltage immediately after start_generator()—the reading reflects transitional state, not stable state; acting on it causes wrong decisions. Or re-checking "is voltage low?" every 100 ms—too fast, the system oscillates. The accidental feedback loop hides in timing. Cause and effect blur. The bug appears "sometimes."

## 10) Order Matters More Than People Expect

A stable pattern looks like this:
	1.	Observe the world
	2.	Decide based on rules
	3.	Act deliberately
	4.	Wait
	5.	Repeat

Breaking this order causes trouble.
	•	Acting before observing → stale decisions
	•	Observing mid-action → half-truths
	•	Acting repeatedly without delay → oscillation

Order is how you control time.

Homestead examples: acting before observing—you start the generator because last cycle said voltage was low. But voltage recovered. You acted on stale data. Observe first. Decide. Then act. Observing mid-action—you check voltage while the relay is flipping. The reading is transitional, not stable. Half-truth. Acting on it causes wrong decisions. Acting repeatedly without delay—you start the generator, check voltage one second later, stop it, check again, start again. Oscillation. Wait between cycles.

## 11) Observation and Action Should Be Obvious in Names

Because this distinction matters so much, names must carry it clearly.

Good examples:
	•	get_voltage() → observe
	•	is_battery_low() → observe
	•	start_generator() → act
	•	stop_generator() → act

If a function does both, the name must say so:
	•	check_and_start_if_low()
	•	observe_and_adjust()

Ambiguous names create invisible behavior.

Homestead example: check_battery() that starts the generator when low—the name implies observation only. Rename to check_and_start_if_low() or split into check_battery() and start_generator_if_low(). The name must match the behavior.

## 12) Functions Can Observe, Act, or Coordinate

There are three valid roles for a function:

1.	Observation functions
	•	Read state
	•	Return information
	•	Cause no side effects

2.	Action functions
	•	Change state
	•	Affect the world
	•	Often return nothing meaningful

3.	Coordination functions
	•	Call observers
	•	Make decisions
	•	Trigger actions

Coordination functions are where policy lives.
Observation and action functions should be as simple and honest as possible.

Homestead example: run_battery_logic() is a coordinator—it calls get_voltage(), decides, then calls start_generator() or does nothing. get_voltage() observes. start_generator() acts. The coordinator owns the "when" and "why."

## 13) Why This Separation Stabilizes Systems

When observation and action are cleanly separated:
	•	State is easier to reason about
	•	Timing assumptions are clearer
	•	Feedback loops are intentional
	•	Debugging becomes straightforward

When they are mixed:
	•	Cause and effect blur
	•	Changes ripple unpredictably
	•	Bugs feel "random"

This is not a style preference.
It's a stability requirement.

Homestead contrast: mixed—get_voltage() that starts the generator when low. Cause and effect blur. "Why did it start?" becomes archaeology. Separated—get_voltage() only reads; run_battery_logic() observes, decides, and calls start_generator(). Cause and effect are clear. Debugging is straightforward.

## Reflection

Think about a system you know—or if you haven't yet, imagine one: a battery monitor, a thermostat, a door lock. Trace one cycle. Where do you observe? Where do you act? Is there a clear boundary between them? Ask:
	•	Where do we observe state?
	•	Where do we act?
	•	Are those clearly separated?
	•	Where do they accidentally overlap?

If observation triggers action silently, that's a warning sign.

## Core Understanding

"Observation reads state; action changes it. Mixing them carelessly creates feedback loops and unpredictable behavior. Stable systems observe first, decide deliberately, and act explicitly."

If that feels calm and obvious, you're ready. Chapter 0.13: Complexity Grows Sideways explains why systems become hard faster than expected—and how small additions multiply possible states.
