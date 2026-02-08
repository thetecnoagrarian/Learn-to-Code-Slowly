
# Phase 1 · Chapter 1.3: Conditions and Branching

Phase 0.2 introduced a critical truth: programs do not decide—they branch. This chapter expresses that truth in Python syntax.

Chapter 1.2 showed how Python names and stores state. This chapter shows how Python uses that state to choose paths. Conditions evaluate state and produce True or False. Python follows one path or another based on those booleans.

Nothing mystical is happening here.
Nothing intelligent is happening here.

Python evaluates conditions.
Those conditions produce True or False.
Python follows one path or another.

That’s the entire mechanism.

## 1) What a Condition Really Is (Again, Slower)

A condition is an expression that evaluates to a boolean value.

A boolean value is either:
	•	True
	•	False

No in-between.
No “kind of.”
No intuition.

Every condition collapses reality into one of those two values. voltage < 12.1 → True or False. coop_temp > 85 → True or False. fence_voltage < 2.0 → True or False. No "maybe," no "probably," no "close enough."

This collapse is not philosophy.
It is mechanics.


## 2) Conditions Are Evaluated At a Moment in Time

A condition is not timeless.

It is evaluated:
	•	At a specific line of code
	•	Using the current state
	•	Using the current values of variables

If state changes later, the condition may evaluate differently later. voltage was 12.2, now it's 12.0—same condition, different result. coop_temp was 84, now it's 86—same condition, different result.

Same code.
Different moment.
Different result.

Homestead example: your battery monitor checks voltage < 12.1 every 5 seconds. First check: voltage = 12.2, condition False, generator stays off. Five seconds later: voltage = 12.0, condition True, generator starts. Same code, different state, different path. This is where time quietly enters the system. Chapter 0.7: time matters.


## 3) The if Statement Is a Fork

An if statement creates a fork in execution.

if voltage < 12.1:
    start_generator()

Or: if coop_temp > 85: start_fan(). Or: if fence_voltage < 2.0: alert_fence_down().

Python does the following, step by step:
	1.	Look up the name (voltage, coop_temp, fence_voltage)
	2.	Retrieve the value it refers to
	3.	Compare that value to the threshold (12.1, 85, 2.0)
	4.	Produce True or False
	5.	If True, execute the indented block
	6.	If False, skip it

Nothing more.

No intent.
No memory of the future.
No understanding of consequences.


## 4) Two Paths Always Exist

Every if has two paths:
	•	The True path
	•	The False path

Even if you don’t write code for the False path, it still exists.

“Nothing happens” is still a path. if voltage < 12.1: start_generator()—what if voltage >= 12.1? Nothing happens. That's a path. if coop_temp > 85: start_fan()—what if coop_temp <= 85? Nothing happens. That's a path.

Many bugs live there. Generator doesn't start when it should? Check the False path. Fan doesn't run? Check the False path. The path exists even if you didn't write it.


## 5) Skipped Code Is Still Executed Logic

When Python skips a block:
	•	It does not “ignore” it
	•	It intentionally chooses not to execute it

This distinction matters. When Python skips if voltage < 12.1: start_generator(), it's not ignoring the code—it's choosing not to execute it because voltage >= 12.1. When it skips if coop_temp > 85: start_fan(), it's choosing not to execute because coop_temp <= 85.

You must reason about skipped paths just as carefully as executed ones. What happens when the generator doesn't start? What happens when the fan doesn't run? Those are skipped paths. They matter.


## 6) Conditions Depend Entirely on State

This condition:

if voltage < 12.1:

Or: if coop_temp > 85:, if fence_voltage < 2.0:, if solar_watts > 5000:.

Means nothing without state.

Questions you should automatically ask:
	•	When was voltage (or coop_temp, fence_voltage, solar_watts) last updated?
	•	Where did it come from? (sensor, ESP32, MQTT?)
	•	Is it guaranteed to be a number?
	•	Could it be missing? (sensor offline, ESP32 disconnected?)
	•	Could it be stale? (last reading was 5 minutes ago?)

Python will not ask these questions for you. It will evaluate voltage < 12.1 even if voltage is None (error), or if voltage is from yesterday (stale), or if the sensor is offline (missing). Python assumes you already did. Chapter 1.2: state lives in names. This chapter: conditions depend on that state being valid.


## 7) Comparison Operators Are Mechanical

Python provides comparison operators.

They are not flexible.
They are not forgiving.

They do exactly one thing.
	•	== equal
	•	!= not equal
	•	< less than
	•	> greater than
	•	<= less than or equal
	•	>= greater than or equal

Each comparison:
	•	Takes two values
	•	Produces True or False

Nothing else. voltage < 12.1 compares voltage to 12.1, produces True or False. coop_temp > 85 compares coop_temp to 85, produces True or False. fence_voltage == 4.2 compares fence_voltage to 4.2, produces True or False. Mechanical. No interpretation.


## 8) Equality Is Exact (This Matters)

voltage == 12.1

This means exact equality.

Not “close enough.”
Not “about.”
Not “within tolerance.”

Exact.

For sensor data, this is often the wrong check. A DHT22 reading 75.0 vs 75.1—are they equal? A voltage sensor reading 12.1 vs 12.09—equal? Probably not. Use ranges: voltage < 12.1, coop_temp > 85, fence_voltage < 2.0.

Understanding this early prevents subtle failures later.


## 9) Logical Operators Combine Booleans

Logical operators work on booleans.

Not meanings.
Not intentions.
Booleans.
	•	and → all must be True
	•	or → at least one must be True
	•	not → invert the boolean

Homestead example: voltage < 12.1 produces True. generator_state == "off" produces True. True and True → True. If either is False, the whole expression is False. Same idea: coop_temp > 85 and fan_on == False—both must be True. fence_voltage < 2.0 or is_energized == False—at least one must be True.

Example:

if voltage < 12.1 and generator_state == "off":

Or: if coop_temp > 85 and fan_on == False:, if fence_voltage < 2.0 and is_energized == True:.

Python evaluates this as:
	1.	Evaluate voltage < 12.1 (or coop_temp > 85, fence_voltage < 2.0)
	2.	Evaluate generator_state == "off" (or fan_on == False, is_energized == True)
	3.	Combine the two booleans using and
	4.	Branch on the result


## 10) Short-Circuiting Is Still Order

Python evaluates logical expressions left to right.

With and:
	•	Stop at the first False

With or:
	•	Stop at the first True

This is called short-circuiting.

It is an optimization.
It is also a rule.

Order matters. Homestead example: if esp32_connected and coop_temp > 85:—if esp32_connected is False, Python never checks coop_temp. That's safe—no error if ESP32 is offline. But if coop_temp > 85 and esp32_connected:—Python checks coop_temp first, might error if ESP32 is offline and coop_temp is None. Order protects you—or hides bugs. Choose deliberately.


## 11) Order Can Change Meaning

if sensor_online and voltage < 12.1:

Is not the same as:

if voltage < 12.1 and sensor_online:

If sensor_online is False, Python never evaluates voltage < 12.1. Same idea: if esp32_connected and coop_temp > 85: vs if coop_temp > 85 and esp32_connected:. If esp32_connected is False, Python never checks coop_temp. Order matters.

That may be intentional.
Or it may hide a bug.

You must choose deliberately.


## 12) else Makes the Second Path Visible

if voltage < 12.1:
    start_generator()
else:
    log_normal()

Or: if coop_temp > 85: start_fan() else: log_normal_temp(). Or: if fence_voltage < 2.0: alert_fence_down() else: log_fence_ok().

This forces you to think about both paths. What happens when voltage >= 12.1? What happens when coop_temp <= 85? What happens when fence_voltage >= 2.0? The else makes you answer.

This is almost always healthier than leaving the False path implicit. Without else, the False path is "do nothing"—but is that what you want? With else, you must decide.

Explicit structure reduces cognitive load. You don't have to remember "what happens if the condition is False?"—it's written down.


## 13) elif Creates One Decision Tree

elif means:
	•	“Only check this if everything above failed”

if voltage < 12.1:
    start_generator()
elif voltage > 15.0:
    alert_high_voltage()
else:
    log_normal()

Or: if coop_temp > 85: start_fan() elif coop_temp < 32: alert_freezing() else: log_normal_temp(). Or: if fence_voltage < 2.0: alert_fence_down() elif fence_voltage > 5.0: alert_overvoltage() else: log_fence_ok().

Exactly one branch executes. Voltage can't be both < 12.1 and > 15.0. Coop temp can't be both > 85 and < 32. Fence voltage can't be both < 2.0 and > 5.0. Mutually exclusive conditions mean exactly one path runs.

This is one decision. One condition evaluated, one path chosen. Not multiple independent checks—one decision tree.


## 14) elif Is Not Nesting

This:

if voltage < 12.1:
    ...
elif voltage > 15.0:
    ...

Is not the same as:

if voltage < 12.1:
    ...
else:
    if voltage > 15.0:
        ...

The first is a single decision tree. One condition: voltage. Three paths: low, high, normal.

The second is nested branching. First condition: voltage. If False, then check voltage again. Two separate decisions.

Homestead example: if coop_temp > 85: start_fan() elif coop_temp < 32: alert_freezing() else: log_normal()—one decision. vs if coop_temp > 85: start_fan() else: if coop_temp < 32: alert_freezing() else: log_normal()—nested. They behave differently under complexity. Chapter 0.13: complexity grows sideways. Nested branching multiplies paths faster.


## 15) When to Use elif

Use elif when:
	•	Conditions are mutually exclusive
	•	Only one path should run

Voltage states are a classic example:
	•	Low
	•	Normal
	•	High

Same idea: coop temperature (too hot, normal, freezing), fence voltage (low, normal, overvoltage), solar production (none, low, high). Only one can be true at a time.


## 16) When to Use Nested if

Use nested if when:
	•	Conditions are independent
	•	Multiple actions may be required

Example:
	•	Voltage low
	•	Generator off
	•	Cooldown complete

Or: coop temp high AND fan off AND power available. Or: fence voltage low AND energizer on AND no fault detected. These are separate facts. Multiple conditions can be true simultaneously.


## 17) Branches Multiply Paths

One condition → two paths
Two conditions → four paths
Three conditions → eight paths

This is Phase 0.13 in action. Complexity grows sideways—not deeper code, but more paths.

Your code may be short. if voltage < 12.1 and generator_state == "off" and cooldown_complete: start_generator()—one line.

Your behavior space may be large. Two conditions → four paths. Three conditions → eight paths. voltage (low/normal), generator_state (on/off), cooldown_complete (yes/no) → eight combinations. Same idea: coop_temp (hot/normal/cold), fan_on (on/off), power_available (yes/no) → many paths. Short code, large behavior space.


## 18) Most Bugs Live in Rare Paths

Common paths get tested.
Rare paths rot.

Examples:
	•	Sensor offline (ESP32 loses Wi‑Fi, DHT22 disconnected)
	•	First startup after reboot (no state file, defaults apply)
	•	Boundary values (voltage exactly 12.1, coop_temp exactly 85, fence_voltage exactly 2.0)
	•	Timing overlaps (solar production drops while battery charging)

Conditions create these paths. Every if, elif, else creates paths. Every and, or multiplies paths. Rare paths are easy to forget.

You must name them or test them. Name them: if should_start_generator(): makes the path explicit. Or test them: what happens when ESP32 is offline? What happens when voltage is exactly 12.1? What happens when coop_temp is exactly 85? Test the rare paths, or they'll surprise you.


## 19) Conditions Should Observe, Not Act

Evaluating a condition should not change state. A condition observes state, it doesn't modify it.

This is Phase 0.12 made concrete. Observation vs action. Conditions observe. Actions act. Never mix them.

Bad:

if get_voltage_and_start_generator() < 12.1:

Or: if read_coop_temp_and_start_fan() > 85:, if check_fence_and_alert() < 2.0:.

Good:

voltage = get_voltage()
if voltage < 12.1:
    start_generator()

Or: coop_temp = read_coop_temp(); if coop_temp > 85: start_fan(). Or: fence_voltage = check_fence(); if fence_voltage < 2.0: alert_fence_down().

Observe.
Decide.
Act.

Always in that order.


## 20) Naming Conditions Preserves Meaning

This:

if voltage < 12.1 and generator_state == "off" and cooldown_complete:

Or: if coop_temp > 85 and fan_on == False and power_available:, if fence_voltage < 2.0 and is_energized == True and no_fault:.

Works.

But this:

if should_start_generator():

Or: if should_start_fan():, if should_alert_fence():.

Reads.

The name carries intent. should_start_generator() says what you're checking. should_start_fan() says what you're checking. should_alert_fence() says what you're checking.

The logic lives elsewhere. The function contains the details: voltage < 12.1 and generator_state == "off" and cooldown_complete. The condition name abstracts that complexity.

This is abstraction done honestly. Chapter 0.11: abstraction preserves meaning. Naming conditions preserves meaning and hides complexity.


## 21) Conditions Are Contracts

A condition is a promise:

“If this expression is True, the program may take this path.”

If the condition lies, the path misfires. should_start_generator() returns True, but voltage is 12.5—the condition lied. should_start_fan() returns True, but fan is already on—the condition lied.

Truthfulness matters. Conditions are contracts. If they're True, the path is valid. If they're False, the path is invalid. If they lie, bugs happen.


## 22) Python Does Not Protect You Here

Python will:
	•	Evaluate the condition
	•	Follow the path

It will not:
	•	Warn you about missing cases
	•	Ensure coverage
	•	Validate intent

That responsibility is yours.


## 23) Debugging Conditions Is Tracing State

When a condition behaves unexpectedly:
	•	Print the values (voltage, coop_temp, fence_voltage—what are they actually?)
	•	Inspect the state (when was it last updated? where did it come from?)
	•	Verify assumptions (is voltage guaranteed to be a number? could coop_temp be None?)

The bug is almost never in if. if voltage < 12.1: is correct. The bug is in what feeds it. voltage is None (missing), voltage is stale (from yesterday), voltage is wrong (wrong sensor). Chapter 1.2: state lives in names. This chapter: conditions depend on that state. Debug conditions by debugging state.


## Reflection

Think about a real system you know—battery monitor, coop controller, poultry net monitor, solar logger, ESP32 in the pig barn, cow barn humidity controller—or imagine one. Ask:
	•	What conditions exist in this system? (voltage thresholds, temp thresholds, fence voltage, solar production)
	•	What are the rare paths? (ESP32 offline, sensor timeout, boundary values, first startup)
	•	Which ones have I never tested? (what happens when voltage is exactly 12.1? when coop_temp is exactly 85?)
	•	Which ones depend on timing? (solar production changes, coop temp rises slowly, fence voltage drops gradually)
	•	Which conditions observe vs act? (are any conditions changing state?)

Those questions make you dangerous in a good way. Understanding conditions means understanding paths. Understanding paths means understanding behavior.


## Core Understanding

Say this until it feels obvious:

Python branches using if, elif, and else.
Conditions evaluate to True or False based on current state.
Every condition creates paths.
Paths multiply with complexity.
Order matters.
Observation should not cause action.
Naming conditions preserves meaning and controls complexity.

If this feels like Phase 0.2 expressed mechanically in Python, good. Programs branch. Conditions evaluate state. Paths multiply. That's the mechanism.

You are exactly where you should be. Chapter 1.2 showed how Python names and stores state. This chapter showed how Python uses that state to choose paths. Next comes Chapter 1.4: Loops and Repetition, where these branches start repeating over time and state truly begins to evolve.