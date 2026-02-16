# Phase 0 · Chapter 0.9: Invariants

An invariant is something that must always be true for a system to be considered healthy.

Not sometimes.
Not usually.
Not “unless something weird happens.”

Always.

Invariants are not about what the system does.
They are about what the system refuses to violate.

This chapter is about identifying those non-negotiables—and why systems that lack invariants eventually fail in quiet, dangerous ways. Chapter 0.8 showed that validation at boundaries defends the system; invariants are what that validation protects.

## 1) What an Invariant Is

An invariant is a rule that:
	•	Holds across time
	•	Survives loops
	•	Persists through state changes
	•	Defines system safety

Examples in plain language:
	•	Battery voltage must never drop below a minimum
	•	Temperature must never exceed a safe limit
	•	A door must never be open and locked at the same time
	•	A counter must never go backward
	•	A value must never be negative

Homestead example: "Voltage must never exceed 15 V" — if it does, the inverter or battery is at risk. The invariant defines what state is allowed. "Generator and grid are never connected at the same time" — if they are, backfeed can injure someone. The invariant draws a hard line.

If an invariant breaks, the system is no longer valid.

It may still run.
It may still look fine.

But it is already broken.

## 2) Invariants Are Not Conditions

This distinction matters.

A condition is something you check:
	•	“Is the temperature above 80?”
	•	“Is the generator running?”

An invariant is something you guarantee:
	•	“Temperature never exceeds the safe maximum.”
	•	“Generator and grid are never connected at the same time.”

Conditions are questions.
Invariants are promises.

Conditions can be false and the system continues.
Invariants must not be false—ever.

## 3) Invariants Define System Boundaries

Invariants draw hard lines.

They say:
	•	“This state is allowed.”
	•	“This state is impossible.”
	•	“If this happens, something went wrong.”

They define the edges of your system’s reality.

Without invariants:
	•	Any state is technically possible
	•	Bugs hide quietly
	•	Failures surface late

With invariants:
	•	Illegal states are obvious
	•	Errors are caught early
	•	Systems self-police

## 4) Most Bugs Are Invariant Violations

This is one of the most useful reframes in programming.

When something “mysteriously” breaks, ask:
	•	What invariant was violated?
	•	What rule stopped being true?
	•	What state should never exist, but does?

Examples:
	•	A loop that never ends → “This loop must eventually terminate”
	•	A value drifting upward forever → “This value must stay within bounds”
	•	A system toggling rapidly → “State changes must have minimum time between them”

Homestead examples: a generator start loop stuck waiting for RPM—the invariant "this loop must eventually terminate" was violated. A temperature reading climbing forever due to a sensor fault—"this value must stay within bounds" was violated. A relay chattering because there's no minimum on-time—"state changes must have minimum time between them" was violated.

Once you identify the invariant, the bug becomes easier to reason about.

## 5) Invariants Exist Even If You Don’t Name Them

This is dangerous.

Every system already has invariants—whether you acknowledge them or not.

If you don’t define them explicitly:
	•	They exist only in your head
	•	They get violated silently
	•	You only discover them after damage occurs

Example: “The voltage is always a number” was an unstated invariant. The sensor returned “N/A.” The invariant was violated. The program compared “N/A” to 12.1 and made the wrong decision about the generator. Damage occurred. Naming the invariant—and validating at the boundary—would have caught it.

Explicit invariants turn assumptions into design.

## 6) Invariants Are About Stability Over Time

Conditions happen at a moment.
Invariants hold across moments.

That’s the key difference.

An invariant is something you expect to remain true:
	•	Before the loop
	•	During the loop
	•	After the loop
	•	Across inputs
	•	Across failures

They are time-resistant truths.

## 7) Hard vs Soft Invariants

Not all invariants are equal.

Hard invariants:
	•	Must never be violated
	•	Trigger immediate failure if broken
	•	Protect safety or correctness

Examples:
	•	Voltage must never exceed hardware limits
	•	Two mutually exclusive systems must never be active together

Homestead: generator and grid never connected at the same time—hard. Backfeed can injure. Trigger immediate shutdown if violated.

Soft invariants:
	•	Should hold under normal conditions
	•	Can be temporarily violated with recovery
	•	Trigger warnings, not shutdowns

Examples:
	•	Temperature should stay in a comfort range
	•	Network latency should remain under a threshold

Homestead: generator runs at least 20 minutes once started—soft. A fault can interrupt it. Log a warning, don't crash.

Knowing which is which matters.

Treating soft invariants as hard causes fragility.
Treating hard invariants as soft causes damage.

## 8) Invariants Are the Reason Checks Exist

Why do you:
	•	Clamp values?
	•	Validate inputs?
	•	Reject impossible states?
	•	Add guard conditions?

To protect invariants.

Homestead example: clamping voltage to 0–20 before comparing to threshold. Validating sensor reading is a number before using it. Rejecting null at the boundary. Each check protects "voltage is always a valid number in range."

Checks are not paranoia.
They are enforcement.

Every validation step is the system saying:

“I refuse to enter an invalid state.”

## 9) Invariants Simplify Reasoning

Here’s a powerful side effect.

Once an invariant is established, you can:
	•	Stop rechecking it everywhere
	•	Build logic assuming it holds
	•	Reduce mental load dramatically

Homestead example: "Generator is either running or not—never unknown." You don't need to check for "starting" or "unknown" in every branch if you enforce that invariant. The logic simplifies. When the invariant breaks, the error is loud.

Example:
If you know:

“This list is never empty”

Then:
	•	You don’t need to guard every access
	•	Your logic becomes cleaner
	•	Errors become louder when they occur

Good invariants make code simpler, not more complex.

## 10) Invariants vs Flexibility

This often confuses people.

Invariants do not make systems rigid.
They make systems reliable.

You can change:
	•	Algorithms
	•	Timing
	•	Inputs
	•	Behavior

As long as invariants hold, the system remains sane.

Invariants protect the core, not the surface.

## 11) Invariants Are Design Decisions

You don’t “discover” invariants accidentally.

You decide:
	•	What must never happen
	•	What failure looks like
	•	What safety means

These decisions reflect:
	•	Domain knowledge
	•	Risk tolerance
	•	Real-world constraints

That’s why senior engineers talk about invariants more than syntax.

## Reflection

Think about a real system you know well and ask. If you haven't yet, imagine one: a battery monitor, a thermostat, a door lock.

	•	What states must never occur?
	•	What values must always stay within bounds?
	•	What combinations are forbidden?
	•	What would indicate silent failure?

Those answers are your invariants.

If you can name them, you can design the system.

## Core Understanding

“Invariants are rules that must always hold true to keep a system valid and stable over time.”

If that feels obvious, good. Chapter 0.10: Failure Is Normal covers designing systems that expect loss, absence, and partial truth—and stay functional anyway.