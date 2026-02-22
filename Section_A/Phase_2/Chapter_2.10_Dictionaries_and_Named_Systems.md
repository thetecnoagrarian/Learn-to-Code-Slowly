# Section A Phase 2 · Chapter 2.10: Dictionaries and Named Systems

Chapter 1.10 established that failure is normal and missing data is not exceptional. Chapter 1.8 established that boundaries validate data. Dictionaries are Python's primary tool for working honestly with that reality. Chapter 2.09 showed how lists, tuples, and sets group values—by position or by uniqueness. This chapter introduces dictionaries, which group values by name. Where lists answer "what is the nth item?," dictionaries answer "what value is associated with this name?" That difference changes how systems are designed, reasoned about, and debugged. This chapter covers what dictionaries are, why named access matters, how missing keys represent real failure modes, and how dictionaries become system boundaries, configuration, and state.

## Learning Objectives

After this chapter, you will be able to:
- Understand dictionaries as key-to-value mappings and named state containers
- Distinguish when to use bracket access (key must exist) vs .get() (absence allowed)
- Use .get() with defaults for optional config and graceful degradation
- Interpret KeyError as a boundary violation and design for missing keys
- Iterate over keys, values, or key-value pairs as appropriate
- Model configuration, sensor packets, and system state with dictionaries
- Apply invariants and validation to dictionary structure (required keys, types)

## Key Terms

- **Dictionary**: A collection that maps keys (names) to values; access by key, not position
- **Key**: The name used to look up a value; keys in a dictionary are unique
- **KeyError**: The exception raised when you access a missing key with bracket notation
- **.get()**: Method that returns the value for a key if present, otherwise None or a default you supply

## 1) Why Dictionaries Exist at All

Lists answer: what is the nth item? Dictionaries answer: what value is associated with this name? As soon as meaning matters more than order, lists are not enough. With a list, the element at index zero might be voltage or timestamp—you have to remember. With a dictionary, you use the key: sensor data under the key "voltage" is explicit, coop sensor under "temp" is explicit. Named access documents meaning. Homestead example: a sensor packet might have voltage, timestamp, and source. In a list you would have to remember which index is which. In a dictionary, the keys tell you: voltage, timestamp, source.

## 2) Dictionaries Are Named State

A dictionary is a collection of key-to-value mappings (Chapter 2.02: state is tracked in variables—a dictionary is one variable holding named state). You might have sensor data with keys voltage and timestamp; coop sensor with temp, humidity, and timestamp; fence packet with voltage and energized; or solar packet with watts and producing. Keys are names. Values are data. The dictionary is a state container. That is not cosmetic; it is structure. You can pass one variable—the dictionary—and the recipient knows what each value means by its key.

## 3) Keys Are Meaning, Not Position

In a list, to know what the first or second element is you have to remember or document it. The code does not tell you. In a dictionary, you access by key: sensor data at the key "voltage" and sensor data at the key "timestamp." The meaning is explicit. No one has to remember that index zero is voltage; the key "voltage" says it. That reduces bugs and makes code easier to read and change. When you add a new field, you add a key; you do not shift indices or break callers who assumed a position.

## 4) Dictionaries Compress Reality Without Lying

Chapter 1.11: abstraction must not lie. A dictionary compresses multiple variables into one named structure without losing meaning. Each key documents what the value represents. You are not collapsing "voltage" and "timestamp" into "first" and "second"; you keep the names. That is abstraction done correctly. The structure is honest about what each value is.

## 5) Dictionary Keys Must Be Unique

Each key appears at most once in a dictionary. If you assign the same key twice, the second value overwrites the first. That is intentional. A key represents the single value for that concept at that time. So "voltage" has one value in a sensor packet; "temp" has one value in a coop reading. Uniqueness keeps the contract clear: one name, one value.

## 6) Dictionary Values Can Be Anything

Values in a dictionary can be numbers, strings, booleans, None, lists, or other dictionaries. That makes dictionaries ideal for modeling real systems: a sensor packet might have a float for voltage, a string for timestamp, and a boolean for energized. A config might have thresholds, cooldowns, and enabled flags. Nested dictionaries can represent hierarchy: system to subsystem to component. The key is always a name; the value carries the data, in whatever form it takes.

## 7) Accessing Values With Brackets

The simplest form of access is bracket notation: get the value for a key. That means: I expect this key to exist. If the key is missing, Python raises KeyError (Chapter 2.01: programs can have errors—KeyError is explicit failure). That is not a bug; it is enforcement. Failure mode: you access sensor data for "voltage" when the ESP32 sent a packet with only "temp" and "humidity." KeyError. The key documents the contract; a missing key means the contract was violated. You then fix the sender, the validation at the boundary, or the assumption in the code.

## 8) KeyError Is a Boundary Violation

A KeyError tells you: you assumed the data existed, reality disagreed, and your boundary was wrong or missing. That is Chapter 1.8 and 1.10 in action. Sometimes you want this failure: when the key must exist, failing fast is correct. When the key might be missing, you should not use bracket access; use .get() instead. The choice between bracket access and .get() is a design decision about whether absence is allowed.

## 9) When Bracket Access Is the Right Choice

Use bracket access when the key must exist, when absence indicates a programmer or configuration error, and when the system cannot proceed safely without that value. Examples: required configuration keys, internal invariants, critical system state. Fail fast and fail loud. That way the failure points to the real cause—missing required data—instead of propagating as None or wrong defaults.

## 10) The .get() Method: Designing for Absence

.get() accesses a key safely. You ask for the value for a key; if the key is missing, no error is raised and None is returned (Chapter 2.07: None represents absence). That encodes: absence is allowed. It is a design choice. You use .get() when the key might be missing and you are prepared to handle None—or when you supply a default. Homestead example: coop sensor might have temp and humidity; if humidity is missing because the DHT22 had a partial read, .get("humidity") returns None and you can skip or default instead of crashing.

## 11) .get() With Defaults

You can supply a default value to .get(): if the key is present, you get its value; if the key is missing, you get the default. So config might have a threshold with a default of twelve point one, coop config a temp threshold default of eighty-five, or fence config a low voltage threshold default of two point zero. That means: use the configured value if present, otherwise fall back to the default. Defaults should be intentional, not accidental. Choose defaults that match safe or typical behavior so that missing config does not silently break the system.

## 12) .get() vs Brackets Is a Design Decision

This is not a syntax preference; it is a semantic choice. Brackets mean: this key must exist. .get() means: this key might not exist. Mixing them carelessly creates bugs. Using brackets when the key might be missing causes KeyError in production. Using .get() when the key must exist can hide bugs: you get None or a default and never notice the missing required data. Decide per key: required or optional. Then use brackets for required and .get() (with or without default) for optional.

## 13) Dictionaries Make Failure Explicit

A missing key is not inherently a crash, a surprise, or a weakness—it is information. Dictionaries let you decide how to respond: crash (bracket access), default (.get() with default), skip (check for None after .get()), log (log the missing key and continue or stop), or degrade (use a fallback value or mode). That choice belongs in code, not in assumptions. Design for missing keys at boundaries (Chapter 1.8) and treat failure as normal (Chapter 1.10).

## 14) Iterating Over Dictionaries

Dictionaries support iteration (Chapter 2.04: for loops iterate over sequences—dicts are iterable). By default, iterating over a dictionary yields its keys. You can also iterate explicitly over keys, over values, or over key-value pairs. Each form communicates intent. When you only need keys, iterate over keys. When you only need values, iterate over values. When you need both name and value together, iterate over key-value pairs. Choosing the right form makes the code clearer and avoids unnecessary lookups.

## 15) Key-Value Pairs Keep Meaning Attached

When you care about both the name and the value, iterate over key-value pairs. That way each value is seen together with its key—you do not lose the meaning. Logging, validation, and serialization often need both. Keeping key and value together in the loop keeps meaning attached to data and avoids looking up the value again by key.

## 16) Nested Dictionaries: Hierarchical Systems

Dictionaries can contain other dictionaries. You might have a system dictionary with a "battery" key whose value is another dictionary with "voltage," and a "generator" key whose value has "state." Or coop with temp and fan_on, fence with voltage and energized, solar with watts. That models hierarchy naturally. Real systems are nested: system to subsystem to component to value. Nested dictionaries reflect that structure without forcing an artificial order. Access like "system, then generator, then state" reads like the system itself.

## 17) Nested Dictionaries Mirror Real Systems

Real systems are nested: system, then subsystem, then component, then value. Nested dictionaries mirror this. You might have a top-level key for each subsystem—battery, coop, fence, solar—and each of those is a dictionary of that subsystem's state or config. The code that reads "system, then generator, then state" or "system, then coop, then temp" matches how you think about the system. Structure in code matches structure in the world.

## 18) Nested Access Requires Careful Boundaries

Each level of nesting might be missing. You might have "generator" but not "state," or "coop" but not "temp." Defensive access uses .get() at each level: get the inner dictionary with a default of empty dictionary, then get the value from that. That assumes failure is normal and avoids KeyError when any level is missing. Alternatively, you can use bracket access at each level and assume invariants hold—required keys exist. Choose deliberately. At boundaries where data comes from the outside, defensive access is usually safer; inside your own code where you control the structure, invariants and bracket access can be acceptable.

## 19) Dictionaries as Configuration Models

Configuration is named data: threshold, cooldown, enabled, temp threshold, fan cooldown, low voltage threshold, alert enabled, log interval. That makes dictionaries a natural fit. Keys document intent; values carry meaning. You might have a config dictionary for the battery monitor, coop controller, fence monitor, or solar logger—each with keys that match the concepts in the system. Config loaded from a file or environment can be parsed into a dictionary so the rest of the program accesses settings by name.

## 20) Configuration Should Be Read-Mostly

Config dictionaries are usually loaded once, rarely modified, and should be treated as read-mostly or immutable by convention. Changing config at runtime is powerful—you can adjust thresholds without restarting—but it is also dangerous: it can make behavior hard to reason about and can introduce race conditions. If you do change config at runtime, do it deliberately and document it. Prefer loading config at startup and using it as read-only for the rest of the run.

## 21) Dictionaries vs Lists Revisited

Use a list when order matters, you iterate sequentially, and you process history—readings over time, event logs, queues. Use a dictionary when meaning matters, you look up by name, and order is irrelevant or secondary—sensor packets, configuration, system state. This distinction is foundational. Mixing them wrongly—using a list when you need named fields, or a dictionary when you need ordered history—makes code harder to write and easier to break.

## 22) Dictionaries as State Containers

Instead of many separate variables—voltage, generator running, last update—you can group state in one dictionary: voltage, generator running, last update as keys. Same for coop state (temp, fan on, last update), fence state (voltage, energized), or solar state (watts, producing). That makes state explicit and portable. You can pass the whole state, log it, snapshot it for persistence, or reset it by replacing the dictionary. Grouped state scales better than a pile of loose global variables.

## 23) Grouped State Improves Reasoning

When state lives together in a dictionary, passing state is easier (one argument instead of many), logging is easier (log the dict), snapshotting is easier (copy or serialize the dict), and testing is easier (build a dict with known values). State containers also make invariants easier to state: "this dictionary always has these keys" or "voltage is always a float when present." You reason about one object and its keys instead of many unrelated variables.

## 24) Dictionaries and Mutability

Dictionaries are mutable (Chapter 2.09: like lists, dicts can change in place). You can assign to a key to update a value, or add a new key. All references to that dictionary see the change. Mutability means shared references see changes, side effects are possible, and discipline is required. When you pass a dictionary to a function, that function can modify it. When that is not desired, pass a copy or use a structure that cannot be changed. When you do want shared, updatable state, the dictionary is the right tool.

## 25) Dictionaries Need Invariants Too

Dictionaries do not enforce invariants; you must. Examples: required keys must exist (voltage in sensor data, temp in coop sensor); certain values must be types (voltage is float, fan_on is bool); certain combinations must be valid (if generator running, voltage must exist). Failure mode: assuming a config key exists when it might not—KeyError or wrong logic. Design: document required keys, validate on load or at the boundary, and use .get() with intentional defaults for optional keys. Invariants are boundaries (Chapter 1.8); apply them to dictionary structure as well as to single values.

## 26) Homestead System Framing

In your systems—battery monitor, coop controller, poultry net, solar logger, barn sensors, ESP32 nodes—sensor packets are dictionaries: voltage, timestamp, source; or temp, humidity, timestamp; or fence voltage, energized; or watts, producing. Configuration is a dictionary: thresholds, cooldowns, enabled flags per subsystem. System state is a dictionary: voltage and generator running; coop temp and fan on; fence voltage and energized; solar watts and producing. Metadata—sensor ID, timestamp, source—is a dictionary. Each key is a contract. Each missing key is a question: is it optional? Should we default? Should we fail? Answer that in code with brackets or .get() and defaults.

## Common Pitfalls

Using bracket access when the key might be missing causes KeyError. Use .get() when absence is allowed, and supply a default when a fallback is correct.

Using .get() when the key must exist hides bugs: you get None or a default and never detect missing required data. Use bracket access for required keys so that missing data fails fast.

Assuming a nested key exists. Each level can be missing. Use chained .get() with empty dict default for optional nesting, or validate structure at the boundary.

Treating config as mutable without a plan. Prefer read-mostly; if you change it at runtime, document and control where it happens.

Forgetting that dictionaries are mutable and shared. Passing a dict to a function gives that function the ability to change it. If that is not intended, pass a copy or an immutable view.

## Summary

Dictionaries map names (keys) to values. They are named state: access by meaning, not position. Use bracket access when the key must exist—fail fast on KeyError. Use .get() when the key may be missing—return None or a default. Missing keys are a design case (Chapter 1.10: failure is normal); choose how to handle them at boundaries (Chapter 1.8). Dictionaries model sensor packets, configuration, and system state; they support nesting for hierarchy and are mutable so state can be updated in place. They need invariants (required keys, types) just like other state. Lists are for order and history; dictionaries are for meaning and lookup. Choose the structure that matches the question you are asking. When you need "value for this name," use a dictionary; when you need "the nth item" or "the last N items," use a list.

## Next

Chapter 2.11 (Input, Output, and Program Boundaries) is where config and state meet the outside world. Dictionaries often hold what was read from files, environment, or network, and what will be written back. That chapter covers how data enters and leaves the program in Python—print, input, file I/O, and type conversion—and why validation and explicit checks belong at those boundaries. Dictionaries and boundaries together define how your program talks to the world.
