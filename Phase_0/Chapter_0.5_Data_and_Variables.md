# Phase 0 · Chapter 0.5: Data and Variables

Programs do not work with ideas.
They do not work with meaning.
They do not understand intent.

They work with data.

Everything a program sees, stores, checks, compares, or changes is data.
If something is not represented as data, the program does not know it exists.

This chapter is about understanding what data really is and how programs remember it over time.

## 1) What Data Is (Stripped of Metaphor)

Data is information expressed in a form the computer can manipulate.

That’s it.

Examples:
	•	A number representing temperature
	•	A word representing a name or label
	•	A true or false value
	•	A list of readings
	•	A structured collection of related values

Data is not meaning.
Data is representation.

The meaning lives in your head.

## 2) Programs Only See Representations

When you think:
	•	“The battery is low”

The program sees:
	•	A number
	•	Compared against a threshold
	•	Producing a true or false result

When you think:
	•	“The generator should start”

The program sees:
	•	A condition
	•	A variable
	•	A state change

Nothing more.

This is not a limitation—it’s a contract.
You must make reality explicit in data.

## 3) Variables Are Memory With Names

A variable is a name that points to a piece of data.

That’s all it is.

Not a box.
Not a container.
Not a slot.

A name → a value.

Variables exist so a program can:
	•	Remember something
	•	Refer to it later
	•	Change it over time

Without variables, a program would have no memory.
With variables, it has state.

## 4) State Is Just Data Over Time

When we say “state,” we’re not introducing a new concept.

State is simply:
	•	The current values of variables
	•	At a specific moment in time

Change the variables, and you change the state.

This is why programs feel alive:
	•	Variables update
	•	Conditions change
	•	Loops behave differently
	•	Outputs shift

All of that is just data changing.

## 5) Variables Do Not Hold Meaning

This is a subtle but critical point.

The variable name carries meaning for humans.
The value carries meaning for logic.

The computer does not care that:
	•	battery_voltage is a voltage
	•	temperature is measured in degrees
	•	door_open refers to a physical door

It only cares that:
	•	A number is a number
	•	A true/false value is true or false
	•	A collection is a collection

If the data is wrong or misinterpreted, the program will behave “correctly” and still do the wrong thing.

## 6) Data Has Shape, Not Just Value

This is where many people get into trouble.

Data is not just what the value is.
It is how it is structured.

Examples:
	•	A single temperature value
	•	A list of temperature values
	•	A table of timestamps and temperatures
	•	A record with temperature, humidity, and voltage

All of these might involve “temperature,” but they are not interchangeable.

The value might be correct.
The shape might be wrong.

Most real bugs come from assuming the wrong shape.

## 7) Shape Determines How Data Can Be Used

You cannot:
	•	Loop over a single number
	•	Compare a list as if it were one value
	•	Treat structured data like a simple value

If you misunderstand shape:
	•	Conditions misfire
	•	Loops break
	•	Functions behave unpredictably

Programs are extremely strict about shape, even if they appear flexible.

## 8) Temporary vs Persistent Data

Not all data lives equally long.

Some data:
	•	Exists only briefly
	•	Is used once
	•	Is immediately discarded

Other data:
	•	Persists across loops
	•	Carries history
	•	Influences future behavior

Knowing which is which matters.

If you treat temporary data as persistent:
	•	You accumulate garbage
	•	State drifts
	•	Bugs compound over time

If you treat persistent data as temporary:
	•	The system forgets
	•	Behavior resets unexpectedly
	•	Decisions lose context

This distinction becomes crucial in long-running systems.

## 9) Variables Are Where Bugs Hide

When people say:
	•	“This program behaves unpredictably”
	•	“It worked earlier”
	•	“I don’t know what changed”

What usually happened is:
	•	A variable changed unexpectedly
	•	Or didn’t change when it should have
	•	Or was reused incorrectly

Debugging is often just:
	•	Tracing variables
	•	Watching how data changes
	•	Confirming assumptions about state

That’s not glamorous—but it’s effective.

## 10) Naming Variables Is About Preserving Meaning

Just like functions, variables exist mostly for humans.

Good variable names:
	•	Describe what the data represents
	•	Reflect real-world concepts
	•	Reduce the need to inspect usage

Bad variable names:
	•	Hide intent
	•	Encourage misuse
	•	Make reasoning harder

A variable name is a promise to the reader:

“This data represents this thing.”

Breaking that promise causes confusion long after the code “works.”

## 11) Data Is the Interface Between Reality and Logic

Every real system you care about:
	•	Sensors
	•	Devices
	•	Users
	•	Networks
	•	Physical processes

Must be translated into data.

That translation is where design happens.

If you choose the wrong data:
	•	Logic becomes fragile
	•	Edge cases multiply
	•	Behavior becomes hard to explain

Good data design makes logic simple.
Bad data design makes logic defensive and messy.

## Reflection

While driving or working, think about one of your systems and ask:
	•	What data exists right now?
	•	What data changes over time?
	•	What data represents the past?
	•	What data represents the present?
	•	What data do I wish I had but don’t?

If you can answer those questions, you can design the program.

## Core Understanding

“Programs operate on data stored in variables, and program behavior is the result of how that data changes over time.”

If that feels solid—not just understandable, but obvious—you’re ready for the next chapter. Chapter 0.6: Errors and Failure covers what happens when data, assumptions, or reality don’t line up—and why that’s not exceptional at all.