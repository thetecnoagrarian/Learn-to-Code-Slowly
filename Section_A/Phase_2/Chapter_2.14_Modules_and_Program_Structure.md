# Section A Phase 2 · Chapter 2.14: Modules and Program Structure

Chapter 1.11 introduced abstraction at the level of names. So far in Phase 2 you have expressed abstraction with variables, functions, and data structures. This chapter introduces abstraction at the file and system level. It is one of the most important steps from "writing scripts" to "building systems": once you split a program into modules, you are making permanent decisions about boundaries, contracts, and responsibility. Chapter 2.13 gave you persistence (config and state files); those files become the domain of dedicated modules. Chapters 2.11 and 2.12 gave you boundaries and exceptions; modules enforce boundaries at the file level. A battery monitor, coop controller, or solar logger grows from one script into multiple files—sensors, config, storage—each with one job. A module is not just a file; it is a boundary, a contract, and a unit of responsibility. Getting structure right here makes the next chapter—assembling a living system—possible; getting it wrong creates tangles that get worse as the system grows.

## Learning Objectives

After this chapter, you will be able to:
- Understand a module as a Python file that defines names, executes once when imported, and exposes behavior intentionally
- Treat modules as boundaries: what is inside is hidden; what is exposed is the interface
- Use import module for qualified access (e.g. sensors.read_voltage) to keep boundaries visible in systems
- Avoid name collisions and confusion from "from module import item" when many modules define similar names
- Avoid circular imports by centralizing coordination in a main module and passing data or callbacks
- Use the "if name equals main" pattern so a file can be run directly or imported without running the whole program
- Organize by responsibility (sensors, storage, control) not by syntax (functions, utils)

## Key Terms

- **Module**: A Python file that defines names and can be imported; it executes once per process and exposes an interface
- **Import**: Loading a module; Python runs the file and stores the resulting module object for reuse
- **Circular import**: When module A imports B and B imports A, leading to partially initialized modules and confusing errors
- **if __name__ == "__main__"**: Pattern that runs a block only when the file is executed directly, not when imported; keeps entry-point code from running on import so modules stay reusable and testable

## 1) Programs Grow Sideways

Early programs fit in one file. As systems grow—battery monitor, coop controller, poultry net, solar logger—logic multiplies, state spreads, and responsibilities diverge: sensor reads, generator control, persistence, config, logging, cooldowns, thresholds. In a single file, the code that reads the DHT22 sits next to the code that writes the state file and the code that decides when to start the generator. Changing one concern risks breaking another; testing "just the sensor part" is hard because everything is wired together. At some point, one file stops being clarity and starts being noise. Modules are how programs grow without collapsing. Splitting by responsibility keeps each file focused: this file reads sensors and returns data; that file saves and loads state; the other coordinates. You can replace the sensor implementation without touching storage, and change persistence without touching the control loop. That is the payoff of structure.

## 2) What a Module Really Is

A module is a Python file that defines names (functions, constants, sometimes classes), can be imported by other files, executes once when first imported, and exposes behavior intentionally. Not every name in the file has to be visible outside; by convention, names starting with an underscore are "internal" to the module, though Python does not enforce that. The important idea is edges: what is inside the file is the implementation; what callers use is the interface. Modules give programs shape. Without them, everything can touch everything and dependencies sprawl—change one function and you risk breaking code you did not know was using it. With modules, responsibilities are grouped, interfaces become visible (sensors dot read_voltage is the boundary), and structure emerges. You can reason about "what does the sensors module do?" without reading every line of the rest of the program.

## 3) A Module Is a Boundary

Everything inside a module can see other names in the same module and shares internal assumptions. Everything outside the module can only see what the module exposes and must respect its interface. This is boundary thinking (Chapter 1.8, 2.11) applied to files. The module name becomes part of the contract: sensors dot read_voltage tells you which module owns the function and what boundary you are crossing. Modules create shape and contain complexity.

## 4) Modules Create Shape

Without modules, everything can touch everything, dependencies sprawl, and bugs leak everywhere. With modules, responsibilities are grouped, interfaces become visible, and structure emerges. Modules give programs shape. You can point to a file and say: this one reads sensors; this one saves state; this one coordinates. That clarity pays off when debugging, testing, or adding features.

## 5) Importing Is Execution

When you import a module, Python executes the file. Not metaphorically—literally. Top-level code runs, variables are created, functions are defined, and any side effects occur. That happens once per process the first time the module is imported. So if the first line of your sensors file opens a serial port or loads a calibration table, that runs the moment anyone does "import sensors." Homestead example: importing a sensors module might run GPIO setup or load calibration the first time anything imports it. Subsequent imports reuse the already-loaded module; the file is not run again. This matters for state and for avoiding duplicate setup. It also means import order matters: if A imports B and B does something at import time that depends on A, you can get subtle bugs. Keep top-level code minimal: define functions and constants; avoid side effects at import time unless intentional and documented.

## 6) Import Happens Once Per Process

The first time a module is imported, Python executes the file and stores the resulting module object. Subsequent imports reuse that same module and do not re-execute the file. So module-level variables persist for the life of the program. That is why modules can hold state: variables at the top level of the file live as long as the process runs. Use that power carefully.

## 7) Modules Can Hold State

Because modules execute once, variables at the module level persist across function calls and are shared by everyone who imports the module. Modules can act like singletons. That is powerful—and dangerous. Hidden state hides bugs: if several parts of the program update "last_voltage" in a module, who owns it? When is it stale? Prefer passing state explicitly and returning values. Use module-level state only when it clearly belongs to that module: a config module holding DEFAULT_THRESHOLD is fine; a cache managed only through the module's functions can be acceptable. A sensors module holding a mutable "last_voltage" updated from elsewhere is riskier—pass the reading explicitly from main so the flow is obvious. When you do keep module state, document it and keep the surface small.

## 8) Use Module State Carefully

Module-level state is global within the module, persists across function calls, and is shared across all code that imports the module. Prefer passing state explicitly, returning values, and using module state only for configuration or constants. Hidden state hides bugs. When you do use module state, document it and keep the surface small so that the contract of the module stays clear.

## 9) Import Module and Qualified Access

One form of import brings in the whole module and binds its name. You then access contents with the module name: for example, sensors dot read_voltage. That is explicit: it shows where the name comes from. Qualified access tells you which module owns the function, where to look for its definition, and what boundary you are crossing. For systems, this is often the best import style. Clarity beats brevity.

## 10) from Module import Item

Another form imports a specific name and binds it directly in the current namespace, so you call read_voltage without a prefix. That is convenient but easier to misuse. If two modules define a function with the same name—for example read_voltage in both a sensors module and a generator module—and you import both names, the second import overwrites the first. No warning, no error, just silent replacement. Homestead failure mode: one read_voltage returns battery voltage, the other returns generator output. If you import both with "from ... import read_voltage," the second overwrites the first and you get wrong behavior with no error. Name collisions are real. Prefer "import module" and qualified access in systems so boundaries stay visible.

## 11) Name Collisions Are Real

If you import the same name from two different modules, the second import overwrites the first. No warning, no error—just silent replacement. That is how confusion enters systems. For small scripts, "from module import item" is fine. For systems, prefer "import module" and qualified access so that every call site shows which module is used. Make boundaries visible.

## 12) Prefer Explicitness in Systems

For systems, prefer importing the module and using qualified access. Make boundaries visible. Clarity beats brevity. When someone reads "sensors dot read_voltage" they know where to look and what boundary they are crossing. When they read "read_voltage" alone, they have to search to find which module it came from—and if two modules both export read_voltage, the wrong one might have been imported last. In multi-file systems, explicitness reduces bugs and speeds up debugging. Qualified names are longer, but the trade-off is worth it: you avoid name collisions and make boundaries obvious. In small scripts, "from module import item" is acceptable; in anything that will grow or be maintained by others, lean toward "import module" and qualified access.

## 13) The Standard Library Is Just Modules

Everything in the standard library is a module, imported like your own code, and obeys the same rules. There is no special category. You import json, time, os, sys, or pathlib the same way you import your own modules. Common standard modules: time for waiting (e.g. sleep) and timestamps (Chapters 2.04, 2.13); json for persistence (config and state files—Chapter 2.13); os for filesystem and environment; sys for interpreter interaction; pathlib for paths as objects. They are tools, not magic. Use them the same way you use your own modules: import, then call or access what they expose. Your storage module might import json and use it to serialize state; your main might import time to sleep between loop iterations. The boundary between "your code" and "the library" is just another import—same rules, same execution-once behavior. Rely on the standard library; keep your own modules focused on your system's logic.

## 14) Import Order and Circular Imports

Python executes imports top to bottom. When main imports sensors, Python runs the sensors file. If sensors then imports storage, and storage imports sensors, sensors is not finished initializing yet. You get errors like "cannot import name X" or "partially initialized module." Circular imports create partially initialized modules and confusing errors. Avoid them by design: have one place—main—that imports everyone and passes data so that sensors and storage never import each other.

## 15) Avoiding Circular Imports by Design

Strategies: centralize coordination in a main module that imports others but is not imported by them; move shared logic (e.g. shared types or constants) into a third module that both can import; invert dependencies so that the lower-level module does not import the higher-level one; or pass functions or data instead of importing the module that needs you. Homestead example: main imports sensors, storage, and generator. The sensors module does not import storage—it returns data (e.g. a dict or a reading object), and main passes that data to storage dot save. The storage module does not import sensors; it just receives data and writes it. That breaks the cycle. Good structure prevents circularity. Design the dependency flow so that it goes one way: main orchestrates, modules provide behavior and do not import each other in a loop. If you want "sensors to call storage when a reading is bad," resist: have sensors return the reading or an error, and let main decide to call storage or log. Keeping the flow in main makes dependencies acyclic.

## 16) __name__ and Execution Context

Every module has a special variable __name__. When the file is run directly (e.g. you run it from the command line), __name__ is the string "main". When the file is imported, __name__ is the module name (the file name without the extension). That allows dual use: the same file can be a script you run or a module you import. Without this, you would need two separate files—one that defines functions for import and one that runs them—or every import would run the whole program. The __name__ check is the standard Python way to say "this block is the entry point; run it only when I am the script, not when I am a library."

## 17) The if __name__ == "__main__" Pattern

A common pattern is to guard the "run the program" code with a check: if __name__ equals "main", then call main or run the top-level logic. When the file is executed directly, that block runs. When the file is imported, that block does not run. So importing the module does not trigger the whole program—only the definitions run. This is foundational. It allows reusable modules (other code can import your functions without running the loop), testable code (tests can import the module and call functions without the main loop starting), clean imports (no surprise execution), and clear entry points (you know which file to run). Without it, importing would trigger execution and side effects would leak everywhere—imagine importing a module and having it start the generator. Use this pattern in the file that is meant to be the entry point so that other modules can import from it without starting the program. Put the main loop inside that block; leave definitions outside so they are available to importers.

## 18) One Entry Point

Well-structured systems have one main entry point and many supporting modules. Usually a main module coordinates: it imports sensors, storage, config, and control; it runs the loop; it passes data between modules. In the loop, main might call sensors dot read_voltage, then pass the result to storage dot save and to a control function that decides whether to start the generator. Other modules provide behavior: read sensors, save state, load config. They do not call each other; main does the wiring. This mirrors system design. One place decides when to read, when to save, when to act; the rest are tools that main uses. That single entry point is also where you handle top-level exceptions, load config at startup, and restore state. One entry point gives the system a backbone.

## 19) Separation of Concerns Is the Goal

Each module should have one primary responsibility, a clear purpose, and a readable interface. If a module does "a bit of everything," split it. Signs that a file should be split: it is very long and you scroll to find things; it mixes unrelated concerns (sensor reads and file writing and generator logic); or you cannot test one part without running another. Organize by responsibility, not by syntax. Bad structure: a file of functions, a file of classes, a file of utils—those names describe form, not purpose. Good structure: sensors (read and validate DHT22, voltage, fence, solar); generator (generator control, cooldowns); storage (config, state, logs—Chapter 2.13); control or main (coordination, thresholds). Organize by what the system does. The file name becomes a contract: sensors dot py should read sensors, validate readings, and expose sensor-related behavior. It should not start generators, write logs, or own the main loop. Names are promises. When someone opens a file, the name should tell them what they will find.

## 20) Modules Are Contracts

A module name promises meaning. A sensors module should read sensors (DHT22, voltage, fence, solar), validate readings, and expose sensor-related behavior. It should not start generators, write logs, or control timing. A storage module should load and save config and state; it should not decide when to read sensors. Callers should not care how sensors are read, which library is used, or what hardware exists—they care what comes out and what failures mean. Modules hide detail without hiding truth (Chapter 1.11: abstraction must not lie). If the module name says "sensors," its interface should be about sensors, not about persistence or control.

## 21) Modules Hide Detail—Intentionally

Callers should not care how sensors are read, which library is used, or what hardware exists. They care what comes out and what failures mean. Modules hide detail intentionally. The implementation can change—you swap the DHT22 for a different temperature sensor, or you switch from serial to I2C—as long as the interface (function names, return shapes, errors) stays honest. Main still calls sensors dot read_temp and gets a number or None; it does not need to change when the wiring inside sensors changes. That is abstraction at the file level (Chapter 1.11: abstraction must not lie). Hide detail without hiding truth: the interface should not promise "always returns a float" if sometimes the sensor fails and you return None; it should document the real contract so callers can handle both cases.

## 22) Modules and Testing

Modules enable testing because functions can be imported, behavior can be isolated, and dependencies can be mocked. For example, you can import the sensors module and call read_voltage in a test without running the generator module or touching hardware: you mock the GPIO or the sensor layer (or pass a fake reading), call the function, and assert on the return value. You do not need to start the main loop or have a real config file. Testability emerges from structure. The module boundary is also a natural place to mock: use a fake that returns a fixed value. Without modules, testing "just the sensor logic" means running the whole program; with modules, you import and test the unit that owns that logic.

## 23) Modules Are Systems in Miniature

Inside a module you will still find state, functions, conditions, loops, errors, and boundaries. Modules do not remove complexity; they contain it. Each file is a smaller system with its own invariants and interface. The same mental model—boundaries, validation, failure, state—applies inside the module. Modules are the unit at which you apply that model so the whole system stays manageable.

## 24) Modules Prepare You for Packages

Multiple modules together can form a package: a directory with a special file that marks it as a package, and multiple modules inside. You might have a package "monitor" with modules "sensors," "storage," "config," and "main" inside it. That is where Python scales to larger systems—dozens of modules, grouped into packages by domain. For Phase 2, a flat set of modules in one directory—main, sensors, storage, config—is enough. The step to packages is the same idea at a larger scale: more boundaries, more structure, same principles. The rules do not change: avoid circular imports, prefer qualified access, one clear entry point. Packages just add another level of grouping when a single directory gets too crowded.

## 25) Homestead Example Structure

A small system—battery monitor, coop controller, poultry net, solar logger, barn sensors—might have: main—coordination and entry point; sensors—sensor reading (DHT22, voltage, fence monitor, solar inverter); generator or control—generator control, cooldowns; storage—persistence (config, state, logs—Chapter 2.13); config—configuration loading and defaults. Each file has one job. Data flow is explicit: main calls sensors dot read_voltage and gets a value (or None); main passes that value to storage dot save if it should be persisted, and to a control function that decides whether to start the generator. Sensors never calls storage; storage never calls sensors. Main owns the flow. No circular imports; clear dependency direction. That structure scales: you can add a new module for a new responsibility (e.g. alerts or logging) without turning one giant file into a mess. You can also test sensors in isolation by mocking what it reads from, and test storage by passing it known data without touching hardware. The same pattern works for a coop controller or a solar logger: sensors, storage, main loop.

## 26) This Is Systems Thinking

At this point you are no longer just writing scripts or memorizing syntax. You are designing boundaries, managing responsibility, and containing complexity. Modules are how you do that in Python. One entry point, many modules with clear names and clear interfaces, and persistence and boundaries (Chapters 2.11–2.13) wired through the main loop. This is real programming: structure that supports change and debugging over time. The next chapter takes this structure and runs it: one loop in main, calling into sensors, storage, and control, with state that survives restarts and failure that is handled. Modules are the skeleton; the next chapter puts the loop and the failure handling and the time awareness onto that skeleton so you get a living system. Getting modules right here makes that assembly straightforward; skipping structure would make the next step a tangle. Invest in boundaries and names now; the payoff is a system you can maintain and extend.

## Common Pitfalls

Using "from module import item" for many modules that have similar names (e.g. read_voltage in both sensors and generator). The last import wins; name collisions cause silent bugs. Prefer "import module" and qualified access. Worse is "from module import *": it pulls in every public name and makes it impossible to see where names come from. Avoid star imports in systems.

Creating circular imports (A imports B, B imports A). Design so that a single main or coordinator imports the rest and passes data or callbacks; avoid modules importing each other in a loop. When you get a "partially initialized module" or "cannot import name X" error, look for a cycle in your imports first.

Putting all logic in main. No separation of concerns—hard to test and hard to change. Split by responsibility: sensors, storage, config, control. Main should be mostly "import, load config, run loop, pass data"; the real logic lives in the modules it calls.

Importing a module and not realizing it runs top-level code. Side effects (GPIO setup, file reads) happen at import time. Keep top-level code minimal or guard it with the __name__ pattern so that importing does not run the whole program. If a module must do setup when imported, document it clearly.

Forgetting the "if __name__ == main" pattern in the entry-point file. Then importing that file runs the program. Guard the main loop or main call so it runs only when the file is executed directly.

Mutating module-level state from many places. If several modules or functions update the same global or module-level variable, ownership is unclear and bugs (races, stale values) appear. Prefer passing state in and out of functions and letting main hold the authoritative copy when possible.

## Summary

A module is a Python file that defines names and can be imported; it executes once per process and is a boundary and a unit of responsibility. Importing runs the file—literally—so keep top-level side effects minimal; subsequent imports reuse the same module. Use "import module" and qualified access (e.g. sensors dot read_voltage) in systems so boundaries stay visible and name collisions are avoided; avoid "from module import *" and use "from module import item" sparingly when many modules might share the same name. Avoid circular imports by centralizing coordination in main and passing data between modules; main imports everyone, modules do not import each other. Use the "if __name__ equals main" pattern so the entry-point file can be run directly or imported without running the program, enabling tests and reuse. Organize by responsibility (sensors, storage, control) not by syntax (functions, utils). Modules are contracts: the file name promises what the module does; hide implementation detail but not truth. They enable testing (import one module, mock its dependencies, test in isolation) and clear structure. Chapter 2.13 (persistence) gives you storage modules; 2.11 and 2.12 (boundaries, exceptions) apply at the module boundary too. Structure contains complexity and lets programs grow without collapsing. This chapter is the bridge from syntax to systems; the next assembles these pieces into a living, running whole.

## Next

Chapter 2.15 (Assembling a Living Python System) is where everything you have learned becomes one running system: one loop, many modules, state that survives, failure that is handled. Boundaries, exceptions, persistence, and modules come together in a battery monitor, coop controller, or solar logger that runs continuously, observes the world, maintains state, makes decisions, takes action, and survives failure. This chapter gave you the file-level structure; the next shows how to wire it into a living system.
