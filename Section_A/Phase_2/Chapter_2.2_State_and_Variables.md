# Phase 1 · Chapter 1.2: State and Variables

Phase 0.5 established that data lives in variables and represents state—what exists, what changes, what influences behavior.
This chapter expresses that same idea in Python’s execution model and syntax.

Nothing conceptually new is introduced here.
What changes is precision.

Python forces you to be precise about how names, values, and state interact. If you misunderstand this chapter, later bugs will feel mysterious. If you understand it deeply, most bugs become traceable. Chapter 1.1 showed that programs are execution systems; this chapter shows how Python names and stores the state those systems evolve.


## 1) Variables Are Names, Not Boxes

This idea is simple. It is also one of the most commonly misunderstood concepts in programming.

In Python, a variable is not a container that holds data.

A variable is a name that refers to a value.

When you write:

voltage = 12.1

You are not “putting 12.1 into a box called voltage.”

You are saying:

“The name voltage now refers to the value 12.1.”

That distinction matters because names can change what they refer to, and values exist independently of names. Homestead example: voltage, coop_temp, fence_voltage—each is a name. The value 12.1 exists in memory whether you call it voltage or last_reading. The name is your label, not a box.


## 2) Values Exist Independently of Names

Think of values as objects that exist in memory.

Names are labels attached to those objects.

You can:
	•	Attach multiple names to the same value
	•	Change which value a name refers to
	•	Remove a name without destroying the value (if something else still refers to it)

This is why Python’s model scales so well—and why confusion happens when people imagine boxes instead of references. Homestead example: voltage = 12.1, last_reading = voltage. Two names, one value. If a function returns 12.1 and you assign it to both current_voltage and display_value, same value, two names. The value exists once; names point at it.


## 3) Assignment Changes References, Not Values

Assignment in Python means:

“Make this name refer to this value.”

It does not mean:
	•	Modify the value itself
	•	Copy the value into a box
	•	Merge two variables

Example:

voltage = 12.1
last_reading = voltage

At this moment:
	•	voltage refers to 12.1
	•	last_reading also refers to 12.1

There is one value, two names.

Now:

voltage = 12.0

What changed?
	•	voltage now refers to 12.0
	•	last_reading still refers to 12.1

Nothing was copied. Nothing was mutated. A name was simply reattached.

Same idea: coop_temp = 75, last_temp = coop_temp, then coop_temp = 78. last_temp still refers to 75. Or fence_voltage = 4.2, old_fence = fence_voltage, then fence_voltage = 0.0 (fence down). old_fence still refers to 4.2. One value, two names; reassignment reattaches a name, it does not mutate the value.

This explains a huge number of bugs later—especially with collections and functions, where "did I mutate or reassign?" becomes critical.


## 4) State Is Names Over Time

State is not a special thing.

State is simply:
	•	Which names exist
	•	What values they refer to
	•	At a specific moment in execution

When you say “the state changed,” what actually happened is:
	•	One or more names were reassigned

Example:

generator_state = "off"

Later:

generator_state = "running"

The program did not “flip a state flag.”
It reassigned a name. Homestead examples: fan_on = False then fan_on = True. fence_energized = True then fence_energized = False. solar_producing = True then solar_producing = False when the sun sets. Each is a name reassigned over time. The timeline is what creates meaning.


## 5) Programs Remember by Reassigning Names

This is worth stating explicitly:

Programs remember the past by reassigning names.

There is no memory slot that says "earlier."
There is only:
	•	What the name refers to now
	•	Compared to what it referred to before

If you want to "remember" the last coop temp, you must have a name for it: last_coop_temp = coop_temp. When coop_temp changes, last_coop_temp still holds the old value—until you explicitly reassign it. Programs remember only what names refer to. Execution order matters because reassignment happens in order.


## 6) Variable Creation vs Update Is the Same Operation

Python does not distinguish between:
	•	Creating a variable
	•	Updating a variable

This:

voltage = 12.1

Means:
	•	Create the name if it doesn't exist
	•	Otherwise, update what it refers to

Same for coop_temp = 75 or solar_watts = 1200 or fence_voltage = 4.2. Create or update. This simplicity is powerful—but it means you must track meaning yourself.

If you accidentally reuse a name for a different purpose, Python will not stop you. voltage = 12.1, then later voltage = 78 (you meant coop_temp). The old voltage is gone. Failure mode: sloppy reuse. Python allows it. You must not.


## 7) Naming Is How You Preserve Meaning

Python does not know what voltage means. Or coop_temp. Or fence_voltage.

You do.

The name is your only chance to encode intent.

Compare:

v = 12.1

vs

last_voltage_reading = 12.1

Both are valid Python. Both behave identically. Only one communicates meaning. Same idea: t = 75 vs last_coop_temp = 75, or x = 4.2 vs fence_voltage_kv = 4.2. Python does not enforce good names.

Poor naming does not cause syntax errors.
It causes reasoning errors, which are worse.


## 8) Names Should Reflect Role, Not Type

A common beginner mistake is to encode type into names:

voltage_float = 12.1
string_status = "off"
coop_temp_int = 75

This is fragile.

Types can change.
Roles should not.

Better:

voltage = 12.1
generator_status = "off"
coop_temp = 75
fence_energized = True

The role of the variable stays consistent even if the representation changes later.


## 9) Variables Are Temporary by Default

Variables live in memory.

When the program ends:
	•	Variables disappear
	•	State is lost

This is not a flaw. It's a design decision.

Persistence requires explicit action:
	•	Writing to files
	•	Writing to databases
	•	Sending over a network

Homestead examples: your battery monitor stops. voltage, generator_state—gone. Your ESP32 reboots. fence_voltage, is_energized—gone. Your coop controller exits. coop_temp, fan_on—gone. Unless you wrote that state somewhere, it's lost. Runtime state lives in memory. Persistent state lives on disk or over the network. Chapter 1.13: persistence.


## 10) Memory Is Not the Problem—Meaning Is

Most beginner confusion around "memory" is actually confusion about meaning drift.

The bug is usually not:
	•	"Python lost my data"

It's:
	•	"This name stopped referring to what I thought it did"

Homestead example: you reuse voltage for solar production watts. Later code assumes voltage is battery voltage. Meaning drift. Or you name a variable temp when it holds humidity. The bug is not memory—it's that the name lied about meaning. If you track names and assignments carefully, memory becomes boring again—and boring is good.


## 11) Variables Enable Controlled Change

Variables are not just storage.

They are control points.

Every reassignment is a decision:
	•	What changes
	•	When it changes
	•	What future logic will see

Homestead example: fan_on = True. That reassignment is a decision. Future logic that checks fan_on will see True and act accordingly. fence_energized = False—future logic sees False and maybe alerts. generator_state = "running"—the next iteration of the loop sees that state and decides. Programs don't "do things." They evolve state. Variables are how that evolution is expressed.


## Reflection

Think about a real system you know—battery monitor, coop controller, poultry net, solar logger, ESP32 in the pig barn—or imagine one. Ask:
	•	What names would I give the important pieces of state?
	•	Which values change over time?
	•	Which values should never change?
	•	Where could meaning drift if names were sloppy?
	•	What would break if I reused a name for something different?

If you can answer those, you are thinking at the right level.


## Core Understanding

Say this until it feels obvious:

Variables in Python are names that refer to values.
Assignment changes what a name points to.
State is the collection of these name–value relationships over time.
Good names preserve meaning; bad names hide bugs.

If that feels like Phase 0.5 expressed in Python—good.
That’s exactly what this chapter is.

Next is Chapter 1.3: Conditions and Branching, where Python starts choosing paths based on the state you now know how to name and track.