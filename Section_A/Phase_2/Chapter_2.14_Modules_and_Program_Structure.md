# Phase 1 · Chapter 1.14: Modules and Program Structure

Phase 0.11 introduced abstraction at the level of names.
Phase 1 has so far expressed abstraction with:
	•	Variables
	•	Functions
	•	Data structures

This chapter introduces abstraction at the file and system level. Chapter 1.13 gave you persistence (config.json, coop_state.json); those files become the domain of dedicated modules. Chapter 1.11 and 1.12 gave you boundaries and exceptions; modules enforce boundaries at the file level. A battery monitor, coop controller, or solar logger grows from one script into sensors.py, config.py, storage.py—each with one job.

A module is not just a file.
It is a boundary.
It is a contract.
It is a unit of responsibility.

## 1) Programs Grow Sideways

Early programs fit in one file.

As systems grow (battery monitor, coop controller, poultry net, solar logger):
	•	Logic multiplies
	•	State spreads
	•	Responsibilities diverge (sensor reads, generator control, persistence, config)

At some point, one file stops being clarity and starts being noise.

Modules are how programs grow without collapsing.

## 2) What a Module Really Is

A module is:
	•	A Python file
	•	That defines names
	•	That can be imported
	•	That executes once
	•	That exposes behavior intentionally

A module is code with edges.

## 3) A Module Is a Boundary

Everything inside a module:
	•	Can see other names in the module
	•	Shares internal assumptions

Everything outside the module:
	•	Can only see what the module exposes
	•	Must respect its interface

This is boundary thinking applied to files.

## 4) Modules Create Shape

Without modules:
	•	Everything can touch everything
	•	Dependencies sprawl
	•	Bugs leak everywhere

With modules:
	•	Responsibilities are grouped
	•	Interfaces become visible
	•	Structure emerges

Modules give programs shape.

## 5) Importing Is Execution

This is critical:

When you import a module, Python executes the file.

Not metaphorically.
Literally.
	•	Top-level code runs
	•	Variables are created
	•	Functions are defined
	•	Side effects occur

Once. Homestead: importing sensors.py might run GPIO setup or load calibration—that happens the first time anything imports it.

## 6) Import Happens Once Per Process

The first time a module is imported:
	•	Python executes the file
	•	Stores the resulting module object

Subsequent imports:
	•	Reuse the same module
	•	Do not re-execute the file

This matters for state.

## 7) Modules Can Hold State

Because modules execute once:
	•	Variables at the module level persist
	•	State lives as long as the program runs

Modules can act like singletons.

This is powerful — and dangerous.

## 8) Use Module State Carefully

Module-level state:
	•	Is global within the module
	•	Persists across function calls
	•	Is shared across imports

Prefer:
	•	Passing state explicitly
	•	Returning values
	•	Using module state only for configuration or constants

Example: config.py holding DEFAULT_THRESHOLD = 12.0 is fine. sensors.py holding last_voltage that mutates is riskier—pass it explicitly when possible.

Hidden state hides bugs.

## 9) import module_name

This form:
	•	Imports the module
	•	Binds the module name
	•	Requires qualification to access contents

Example:

import sensors
voltage = sensors.read_voltage()

This is explicit.
It shows where names come from.

## 10) Qualified Access Is Clarity

sensors.read_voltage() tells you:
	•	Which module owns the function
	•	Where to look for its definition
	•	What boundary you are crossing

This is often the best import style.

## 11) from module import item

This form:
	•	Imports a specific name
	•	Binds it directly
	•	Removes the module prefix

Example:

from sensors import read_voltage
voltage = read_voltage()

This is convenient.
It is also easier to misuse.

## 12) Name Collisions Are Real

If you write:

from sensors import read_voltage
from generator import read_voltage

The second import overwrites the first.

No warning.
No error.
Just silent replacement.

Homestead failure mode: sensors.read_voltage() returns battery voltage; generator.read_voltage() returns generator output. Both named read_voltage. If you do from sensors import read_voltage and from generator import read_voltage, the second overwrites the first—wrong behavior, no error.

This is how confusion enters systems.

## 13) Prefer Explicitness in Systems

For small scripts, from … import is fine.

For systems:
	•	Prefer import module
	•	Prefer qualified access
	•	Make boundaries visible

Clarity beats brevity.

## 14) The Standard Library Is Just Modules

Everything in the standard library:
	•	Is a module
	•	Imported like your own code
	•	Obeys the same rules

There is no special category.

## 15) Common Standard Modules

Examples:
	•	time — waiting (time.sleep), timestamps (Chapter 1.4, 1.13)
	•	json — persistence (config.json, coop_state.json—Chapter 1.13)
	•	os — filesystem, environment
	•	sys — interpreter interaction
	•	pathlib — paths as objects

    import json
    import time
    data = json.load(open("config.json"))

These are tools, not magic.

## 16) Import Order Matters

Python executes imports top to bottom.

If:
	•	Module A imports module B
	•	Module B imports module A

You have a circular dependency.

## 17) Circular Imports Break Systems

Circular imports:
	•	Create partially initialized modules
	•	Produce confusing errors
	•	Are hard to debug

They are a design smell.

## 18) Avoid Circular Imports by Design

Strategies:
	•	Centralize coordination in main.py
	•	Move shared logic into a third module
	•	Invert dependencies
	•	Pass functions instead of importing them

Homestead: main.py imports sensors, storage, generator. sensors.py does not import storage—it returns data; main passes it to storage.save(). That breaks the cycle.

Good structure prevents circularity.

## 19) __name__ and Execution Context

Every module has a special variable: __name__.
	•	When run directly: __name__ == "__main__"
	•	When imported: __name__ == "module_name"

This allows dual use.

## 20) The if __name__ == "__main__" Pattern

This pattern:

    if __name__ == "__main__":
        main()

Means:
	•	Run main() only when executed directly
	•	Do nothing when imported

This is foundational.

## 21) Why This Pattern Matters

It allows:
	•	Reusable modules
	•	Testable code
	•	Clean imports
	•	Clear entry points

Without it:
	•	Importing triggers execution
	•	Side effects leak everywhere

## 22) One Entry Point

Well-structured systems have:
	•	One main entry point
	•	Many supporting modules

Usually:
	•	main.py coordinates
	•	Other modules provide behavior

This mirrors system design.

## 23) Separation of Concerns Is the Goal

Each module should have:
	•	One primary responsibility
	•	A clear purpose
	•	A readable interface

If a module does “a bit of everything,” split it.

## 24) Organize by Responsibility, Not Syntax

Bad structure:
	•	functions.py
	•	classes.py
	•	utils.py

Good structure:
	•	sensors.py (DHT22, voltage, fence, solar—read and validate)
	•	generator.py (generator control, cooldowns)
	•	storage.py (config, state, logs—Chapter 1.13)
	•	control.py (coordination, thresholds)

Organize by what the system does.

## 25) Modules Are Contracts

A module name promises meaning.

sensors.py should:
	•	Read sensors (DHT22, voltage, fence, solar)
	•	Validate readings
	•	Expose sensor-related behavior

It should not:
	•	Start generators
	•	Write logs
	•	Control timing

Names are promises.

## 26) Modules Hide Detail — Intentionally

Callers should not care:
	•	How sensors are read
	•	Which library is used
	•	What hardware exists

They care:
	•	What comes out
	•	What failures mean

Modules hide detail without hiding truth.

## 27) Modules and Testing

Modules enable testing because:
	•	Functions can be imported
	•	Behavior can be isolated
	•	Dependencies can be mocked

Example: from sensors import read_voltage—you can test it without running generator.py or touching hardware. Mock the GPIO; assert on the return value.

Testability emerges from structure.

## 28) Modules Are Systems in Miniature

Inside a module you will still find:
	•	State
	•	Functions
	•	Conditions
	•	Loops
	•	Errors
	•	Boundaries

Modules don’t remove complexity.
They contain it.

## 29) Modules Prepare You for Packages

Multiple modules together form:
	•	A package
	•	A directory with __init__.py
	•	A larger system

This is where Python scales.

## 30) Homestead Example Structure

A small system—battery monitor, coop controller, poultry net, solar logger, pig barn, cow barn—might look like:
	•	main.py — coordination, entry point
	•	sensors.py — sensor reading (DHT22, voltage, fence monitor, solar inverter)
	•	generator.py — generator control, cooldowns
	•	storage.py — persistence (config.json, coop_state.json, voltage_log.txt)
	•	config.py — configuration loading and defaults

Each file has one job.

## 31) This Is Systems Thinking

At this point, you are no longer:
	•	Writing scripts
	•	Memorizing syntax

You are:
	•	Designing boundaries
	•	Managing responsibility
	•	Containing complexity

This is real programming.

## Reflection

Think about a real system—battery monitor, coop controller, poultry net, solar logger, pig barn, cow barn. Ask yourself:
	•	What responsibility does this file have?
	•	What should it not know?
	•	What does it expose?
	•	What does it hide?
	•	What breaks if this module lies?

Consider failure modes:
	•	What if sensors.py imports storage and storage imports sensors? (Circular import—move shared types or pass callbacks.)
	•	What if main.py does everything? (No separation—split by responsibility.)
	•	What if from X import * hides where names come from? (Use import module for clarity.)

If you can answer those, your structure is sound.

## Core Understanding

Say this slowly:

A module is a boundary.
It groups related behavior.
Importing executes it once.
Explicit imports make boundaries visible.
Modules enable separation of concerns.
Good module names are contracts.
One entry point coordinates the system.
Use if __name__ == "__main__": so importing does not run the program.
Structure contains complexity.

If this chapter feels like architecture instead of syntax, that’s correct.

This chapter builds on Chapter 1.13 (persistence—storage.py), 1.11 (file I/O, boundaries), and 1.12 (exceptions). Next: Chapter 1.15 — Assembling a Living Python System, where everything you’ve learned becomes a working, time-aware, failure-tolerant system.