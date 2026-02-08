# Phase 1 · Chapter 1.9: Collections and Grouped State

Phase 0.13 showed that complexity grows sideways. Every new condition multiplies paths. Every new state multiplies possibilities. Collections are Python's answer to this problem—they organize complexity instead of reducing it.

Chapter 1.2 showed how Python names store state. Chapter 1.4 showed how Python repeats with loops. Chapter 1.7 showed how Python categorizes values. This chapter shows how Python groups related values into collections—lists, tuples, sets—and how that changes how logic is written, how loops operate, and how systems behave over time.

They don't reduce complexity—but they organize it.

This chapter is about:
	•	Why collections exist
	•	What kinds of collections Python provides
	•	How collections interact with state, loops, and time
	•	And how grouping data changes how systems behave

## 1) Why Collections Exist at All

Without collections, every value would need its own variable.

reading_1 = 12.1
reading_2 = 12.0
reading_3 = 11.9

Or: coop_temp_1 = 75, coop_temp_2 = 76, coop_temp_3 = 74. Or: fence_1 = 4.2, fence_2 = 4.1, fence_3 = 4.0. Or: solar_1 = 1200, solar_2 = 1150, solar_3 = 1100.

This does not scale.
It does not generalize.
It does not survive change.

Collections let you say:

“These values belong together.”

That grouping is not cosmetic.
It’s structural.

## 2) Collections Are Grouped State

A collection is a single variable that represents multiple related values (Chapter 1.2: variables store state).

That matters because:
	•	State is tracked per variable
	•	Conditions branch on variables (Chapter 1.3)
	•	Loops operate over variables (Chapter 1.4)

When you group values, you change how logic is written. readings = [12.1, 12.0, 11.9] is one variable holding many values—instead of reading_1, reading_2, reading_3.

Python’s Core Collection Types (For Now)

In Phase 1, we focus on three:
	•	List — ordered, mutable
	•	Tuple — ordered, immutable
	•	Set — unordered, unique

Later we’ll add dictionaries.
For now, these establish the mental model.

## 4) Lists: Ordered, Mutable Sequences

A list is an ordered collection of values.

readings = [12.1, 12.0, 11.9]

Or: coop_temps = [75, 76, 74, 73]. Or: fence_voltages = [4.2, 4.1, 4.0]. Or: solar_readings = [1200, 1150, 1100, 1050].

Lists:
	•	Preserve order
	•	Can grow and shrink
	•	Can be modified in place

They are Python’s workhorse collection.

## 5) Lists Model History and Accumulation

Lists are ideal for:
	•	Sensor readings over time
	•	Event logs
	•	Queues
	•	Accumulated results

Homestead framing:
	•	Voltage readings over time (battery), coop temps over time, fence voltages over time, solar production over time
	•	Oldest reading first
	•	Newest reading last
	•	History matters (order is meaning)

Order is meaning. readings[-1] is the latest voltage. coop_temps[-1] is the latest coop temp. fence_voltages[-1] is the latest fence reading.

## 6) Lists Are Mutable (This Is Powerful and Dangerous)

You can change a list after creation:

readings.append(11.8)
readings[0] = 12.2

This mutability means:
	•	State changes in place (no new list, same object modified)
	•	References see the same list (Chapter 1.6: scope—if you pass readings to a function, it sees the same list)
	•	Side effects are possible (append() in one place affects everywhere that references the list)

Mutability is power. It requires discipline. Failure mode: readings.append(11.8) mutates the list. If another part of the code expects readings to be unchanged, it gets a surprise. Immutable tuples avoid this (Section 13).

## 7) List Indexing: Access by Position

Lists are indexed starting at zero.

readings[0]    # first item
readings[1]    # second item

Negative indexing counts from the end:

readings[-1]   # last item (most recent reading)
readings[-2]   # second to last

This is extremely useful for time-ordered data. latest_voltage = readings[-1]. latest_coop_temp = coop_temps[-1]. latest_fence = fence_voltages[-1]. The last element is the most recent—by design.

## 8) Indexing Is Positional Meaning

When you index a list, you are asserting meaning:

latest = readings[-1]

You are saying:
	•	“The last element is the most recent”
	•	“Order matters”
	•	“This list represents time”

That’s a design decision.

## 9) List Slicing: Extracting Ranges

Slicing creates a new list from part of an existing list.

recent = readings[-5:]

Or: recent_temps = coop_temps[-10:], recent_fence = fence_voltages[-5:]. Last 5 voltage readings, last 10 coop temps, last 5 fence readings.

Slicing:
	•	Preserves order
	•	Does not modify the original
	•	Produces a new collection

This is safer than mutation.

## 10) Slicing Is a Boundary

A slice:
	•	Narrows scope
	•	Limits what logic sees
	•	Reduces cognitive load

Instead of reasoning about all readings, you reason about this window.

Boundaries matter.

## 11) Common List Methods

Lists provide tools for common operations:
	•	append() — add to end
	•	pop() — remove and return item
	•	remove() — remove first matching value
	•	len() — number of items
	•	in — membership test

These operations change or query grouped state.

## 12) List Length Is State

The length of a list is part of system state.

if len(readings) > 100:
    readings.pop(0)

Or: if len(coop_temps) > 1000: coop_temps.pop(0). Or: if len(fence_voltages) > 500: fence_voltages.pop(0). Keep a rolling window of the last N readings.

This logic:
	•	Enforces an invariant
	•	Limits memory growth
	•	Controls complexity over time

Collections need invariants too.

## 13) Tuples: Fixed, Immutable Sequences

A tuple is an ordered collection that cannot change.

coordinates = (12.1, 72.5)

Tuples:
	•	Preserve order
	•	Cannot be modified
	•	Are safe to share

Immutability is protection.

Tuples Represent “This Goes Together”

Tuples are ideal when:
	•	Values belong together
	•	Structure is fixed
	•	Accidental mutation would be a bug

Homestead example:
	•	(voltage, timestamp) — battery reading with time
	•	(coop_temp, humidity) — DHT22 reading
	•	(fence_voltage, timestamp) — poultry net reading
	•	(solar_watts, timestamp) — solar production reading
	•	(x, y) coordinates

These are atomic units. Values that belong together, fixed structure.

## 15) Tuples Are Often Used for Returns

Functions often return tuples:

return voltage, timestamp

Or: return coop_temp, humidity. Or: return fence_voltage, timestamp. Or: return solar_watts, timestamp. Functions (Chapter 1.5) return multiple values as a single tuple.

This is one return value:
	•	Structured
	•	Ordered
	•	Immutable

The caller can unpack it safely.

## 16) Why Immutability Matters

Immutability:
	•	Prevents accidental state changes
	•	Makes reasoning easier
	•	Reduces side effects

When data should not change, make it impossible to change.

## 17) Sets: Unordered, Unique Collections

A set is a collection of unique values, with no order.

states = {"off", "starting", "running"}

Sets:
	•	Do not allow duplicates
	•	Do not preserve order
	•	Are optimized for membership tests

## 18) Sets Model Categories and Membership

Sets are ideal for:
	•	Allowed states
	•	Feature flags
	•	Capabilities
	•	Deduplication

Homestead example:
	•	Valid generator states: {"off", "starting", "running", "error"}
	•	Valid coop states: {"normal", "fan_on", "alert"}
	•	Known sensor IDs: {"coop_01", "pig_barn_01", "cow_barn_01"}
	•	Active alerts: {"voltage_low", "temp_high", "fence_down"}

Membership is the meaning. "Is this state valid?" "Is this sensor known?" "Is this alert active?"

## 19) Sets Are Not Sequences

You cannot:
	•	Index a set
	•	Rely on order
	•	Slice a set

This forces you to treat the data correctly.

If order matters, a set is the wrong type.

## 20) Mutability Comparison

Type	Ordered	Mutable	Allows Duplicates
List	Yes	Yes	Yes
Tuple	Yes	No	Yes
Set	No	Yes	No

Choosing the right type is a design decision.

## 21) Collections and Loops Are Linked

Collections are almost always paired with loops.

for reading in readings:
    process(reading)

Or: for temp in coop_temps:, for v in fence_voltages:, for w in solar_readings:.

This is how grouped state becomes behavior (Chapter 1.4: loops iterate over sequences).

Without loops, collections just sit there.
Without collections, loops have nothing to iterate.

## 22) Iteration Preserves or Ignores Order
	•	Lists: iteration preserves order
	•	Tuples: iteration preserves order
	•	Sets: iteration order is undefined

Order matters when modeling time.
It does not matter when modeling categories.

Choose accordingly.

## 23) Collections Multiply Paths

A single value creates two paths (Chapter 1.3: conditions). A collection creates many paths.

Each element can:
	•	Trigger conditions (any reading < 12.1, any coop_temp > 85)
	•	Change state (each append changes the list)
	•	Cause errors (IndexError if index out of range, empty list edge cases)

This is sideways complexity in action (Phase 0.13). A list of 100 readings creates 100 potential paths. Design invariants to contain that complexity.

## 24) Collections Also Contain Complexity

Instead of this:

if r1 < 12.1 or r2 < 12.1 or r3 < 12.1:

You write:

if any(r < 12.1 for r in readings):

Or: if any(t > 85 for t in coop_temps):, if any(v < 2.0 for v in fence_voltages):.

One structure.
One loop.
Clear intent.

Collections don’t remove complexity.
They organize it.

## 25) Collections Need Invariants

Examples:
	•	“Readings list never exceeds 100 items”
	•	“States set contains only valid states”
	•	“Tuples always have exactly two values”

Without invariants, collections rot silently. Failure mode: readings grows unbounded, memory fills, system crashes. Design limits early—invariants are boundaries (Phase 0.8).

## 26) Collections and Time

Collections often grow over time (Chapter 1.4: loops append to lists each iteration).

Without constraints:
	•	Memory grows (readings.append() every loop, never pop—list grows forever)
	•	Logic slows (len(readings) in millions, iteration takes seconds)
	•	Bugs emerge (stale data mixed with fresh, no clear boundary)

Design limits early. Homestead example: voltage_readings list in a monitoring loop. Each minute: append new reading. Without limit: after a week, 10,080 items. After a month, 43,200. Design: keep last 100, or last 24 hours. Enforce the invariant.

## 27) Homestead System Framing

Think about your systems:
	•	Voltage readings, coop temps, fence voltages, solar readings over time → list (order matters)
	•	Sensor metadata (voltage, timestamp), (coop_temp, humidity), (fence_voltage, timestamp) → tuple (fixed structure)
	•	Allowed states, known sensor IDs, active alerts → set (membership matters, order doesn't)

Each choice communicates intent.
Each choice shapes logic.

## Reflection

Think about a real system—battery monitor, coop controller, poultry net, solar logger, pig barn, cow barn, ESP32. While driving or working, ask:
	•	Should this be one value—or many? (voltage readings over time → many, list. Single current temp → one value.)
	•	Does order matter? (voltage history → yes, list. valid states → no, use set.)
	•	Should this ever change? (readings list → yes, mutable. sensor metadata (temp, humidity) → no, tuple.)
	•	Do duplicates make sense? (readings → yes, same voltage twice is valid. valid states → no, use set.)

Consider failure modes:
	•	What if the list grows unbounded? (Design an invariant: max length, rolling window.)
	•	What if you need to share data without mutation? (Use tuple instead of list.)
	•	What if order doesn't matter but you're using a list? (Consider set—membership, not position.)

Those answers determine the right collection.

## Core Understanding

Say this until it feels obvious:

Collections group related state (readings = [12.1, 12.0, 11.9] instead of reading_1, reading_2, reading_3).
Lists are ordered and mutable (voltage history, coop temps over time—order matters, can append/pop).
Tuples are ordered and immutable ((voltage, timestamp), (coop_temp, humidity)—fixed structure, safe to share).
Sets are unordered and unique (valid states, sensor IDs, active alerts—membership matters, no duplicates).
Collections multiply complexity—but organize it (Phase 0.13: one loop over readings instead of N variables).
Iteration turns grouped state into behavior (Chapter 1.4: for reading in readings: process(reading)).

If this feels like Phase 0.13 expressed in Python mechanics, you’re right on track.

This chapter builds on Chapter 1.2 (state), Chapter 1.4 (loops—iterating over collections), and Chapter 1.7 (types—list, tuple, set are types). Next up: Chapter 1.10 — Dictionaries and Named Systems, where we stop grouping by position and start grouping by meaning, which is where real systems begin to take shape.