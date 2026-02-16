# Phase 1 Code Examples (Chapters 6-10)

This file contains visual references for all code examples mentioned in Phase 1 chapters 6-10. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 1.06: Scope and Isolation

### 1) Scope Is a Visibility Rule, Not a Storage Rule (Line ~21)

**Context:** Scope controls where a name can be used, not where values are stored; the value may exist, but the name may not be visible everywhere.

```python
# Value 12.1 exists in memory
# Name voltage might be visible in read_voltage() but not in read_coop_temp()

def read_voltage():
    voltage = 12.1  # name visible here
    return voltage

def read_coop_temp():
    # voltage not visible here - different scope
    coop_temp = 75
    return coop_temp

# Scope controls the name, not the value
```

---

### 2) Why Scope Exists at All (Line ~36)

**Context:** Scope limits visibility, prevents accidental interference, and enables reasoning about one function at a time.

```python
# Without scope: every name visible everywhere, any function overwrites any variable
# With scope: read_voltage() can't see read_coop_temp()'s variables
#             read_voltage() can't accidentally change coop_temp
#             Can reason about read_voltage() without thinking about read_coop_temp()

def read_voltage():
    voltage = 12.1
    return voltage

def read_coop_temp():
    coop_temp = 75
    return coop_temp
# Each function isolated - scope is defensive structure
```

---

### 3) The Two Primary Scopes in Python (Line ~51)

**Context:** Global scope (top level of file) and local scope (inside functions) form the foundation.

```python
# 1. Global scope - top level of file
# 2. Local scope - inside functions

voltage = 12.1  # global

def read_voltage():
    voltage = 12.0  # local
    return voltage
```

---

### 4) Global Scope (Line ~59)

**Context:** Names defined outside functions live in global scope; visible everywhere, lifetime of the program.

```python
voltage = 12.1
generator_state = "off"

coop_temp = 75
fan_on = False

fence_voltage = 4.2
is_energized = True

solar_watts = 1200
producing = True

# These names: exist for program lifetime, visible everywhere in file, shared state
# Wide scope - any function can read them
# Dangerous if abused - any function could accidentally modify
```

---

### 5) Global Scope Is Shared State (Line ~78)

**Context:** Global variables are shared by default; any function can read them, but no function should casually modify them.

```python
voltage = 12.1  # shared

def read():
    return voltage  # can read

# No function should casually modify voltage
# Shared state increases coupling, complexity grows sideways
```

---

### 6) Local Scope (Line ~92)

**Context:** Names inside a function exist only during execution, are invisible outside, and do not conflict with other functions.

```python
def read_voltage():
    voltage = 12.0
    return voltage
# voltage: exists only during execution, invisible outside, can't conflict with read_coop_temp()

def read_coop_temp():
    coop_temp = 75
    return coop_temp

def check_fence():
    fence_voltage = 4.2
    return fence_voltage

# Each function has its own voltage, coop_temp, fence_voltage - even same names
# Narrow scope is safe - read_voltage() can't accidentally change coop_temp
```

---

### 7) Local Scope Is Temporary State (Line ~112)

**Context:** Local variables are created on call and destroyed on return; each call gets a fresh scope, no memory between calls.

```python
def read_coop_temp():
    coop_temp = 75
    return coop_temp
# Call once: fresh scope, returns 75, scope destroyed
# Call again: fresh scope, returns 78, scope destroyed
# No memory between calls - each call independent
```

---

### 8) Functions Are Scope Boundaries (Line ~126)

**Context:** Each function call creates a new local scope; Python creates scope, assigns parameters, executes, then destroys scope.

```python
def read_voltage():
    voltage = 12.0
    return voltage

# Every call: 1) create local scope, 2) assign params, 3) execute, 4) destroy scope
# read_voltage() gets own scope, read_coop_temp() gets own - no interference
```

---

### 9) Same Name, Different Scope, No Conflict (Line ~144)

**Context:** Global and parameter can share the same name; they are different scopes and do not interfere.

```python
voltage = 12.1  # global

def check_voltage(voltage):  # parameter - same name, different scope
    return voltage < 12.1

# Global voltage exists, parameter voltage exists - no conflict
# Same name, different scope, different meaning
# Scope protects from name collisions
```

---

### 10) Parameters Are Local Variables (Line ~168)

**Context:** Parameters are local; they shadow any global with the same name and disappear when the function ends.

```python
voltage = 12.1  # global

def log_voltage(voltage):  # parameter - local
    print(voltage)  # voltage refers to parameter, not global

log_voltage(11.8)  # inside: voltage is 11.8, global stays 12.1
# Parameter shadows global safely - global unchanged
```

---

### 11) Shadowing Is Not Overwriting (Line ~188)

**Context:** Assigning to a name inside a function creates a local; it shadows the global, does not overwrite it.

```python
voltage = 12.1

def update():
    voltage = 12.0  # creates LOCAL voltage, doesn't touch global

update()
# Global voltage still 12.1
# Local voltage was temporary - no global state changed
```

---

### 12) Reading Globals vs Writing Globals (Line ~210)

**Context:** You can read globals freely; assignment creates a local by default and protects the global.

```python
voltage = 12.1

def read():
    return voltage  # works - Python looks up voltage in global scope

def update():
    voltage = 12.0  # creates LOCAL voltage, NOT global update
# Global voltage stays 12.1
# Assignment creates local by default - safety by default
```

---

### 13) The global Keyword Breaks the Barrier (Line ~238)

**Context:** `global` tells Python the name refers to the global variable; use sparingly—prefer return values.

```python
voltage = 12.1

def update():
    global voltage
    voltage = 12.0  # now modifies GLOBAL

update()  # global voltage is now 12.0

# Explicit - must write global to modify globals
# Dangerous - increases coupling, hides data flow
# Rarely needed - prefer return values
```

---

### 14) Why global Is Usually a Smell (Line ~258)

**Context:** global increases coupling, hides dependencies, makes reasoning harder; prefer parameters and return values.

```python
# global: increases coupling, hides dependencies, invisible data flow
# Instead of: global voltage; voltage = read_sensor()
# Prefer: def read_voltage(): return read_sensor(); voltage = read_voltage()
# Data flow visible, dependency clear, function reusable
```

---

### 15) Better Than global: Return Values (Line ~274)

**Context:** Return values make data flow visible and dependencies clear; prefer over mutating globals.

```python
# Instead of:
def update_voltage():
    global voltage
    voltage = read_sensor()

# Prefer:
def read_voltage():
    return read_sensor()

voltage = read_voltage()

# Data flow visible, state change explicit, function reusable, dependency clear
```

---

### 16) Scope Is How Abstraction Stays Honest (Line ~302)

**Context:** Scope keeps names from leaking, colliding, or accidentally referring to the wrong scope.

```python
def read_voltage():
    voltage = sensor.read()  # local voltage
    return voltage
# Local names stay local, don't escape
# Same name in different scopes doesn't conflict
# Without scope: names leak everywhere, abstraction collapses
```

---

### 17) Scope Enables Independent Reasoning (Line ~317)

**Context:** Because of scope, you can reason about one function at a time; bugs stay localized.

```python
def read_voltage():
    voltage = sensor.read()
    return voltage

def read_coop_temp():
    coop_temp = dht22.read_temp()
    return coop_temp

# Can reason about read_voltage() without tracking read_coop_temp()'s variables
# Bugs in read_voltage() stay in read_voltage()
```

---

### 18) Variable Lifetime Depends on Scope (Line ~328)

**Context:** Local variables exist only during execution; globals exist for the entire program.

```python
def read_voltage():
    voltage = 12.0  # created when function called, destroyed when returns
    return voltage

voltage = 12.1  # exists for entire program runtime

# Scope controls visibility; lifetime controls existence
```

---

### 19) Temporary vs Persistent State (Line ~340)

**Context:** Local = temporary (computation, discarded safely); global = persistent (influences future, requires discipline).

```python
# Temporary: single reading inside read_voltage(), calculation result, loop iteration
def read_voltage():
    voltage = sensor.read()  # temporary - discarded when function returns
    return voltage

# Persistent: global voltage that tracks current battery voltage
voltage = 12.1  # affects future decisions

# Confusing them: global for single reading (leaks), local for battery voltage (loses)
```

---

### 20) Nested Scope (Preview Only) (Line ~358)

**Context:** Python allows functions inside functions (closures); for Phase 1, keep functions top-level.

```python
# Inner functions can read outer variables - closure
# Modifying requires nonlocal
# For Phase 1: keep functions top-level, keep scope simple
```

---

### 21) Scope and Debugging (Line ~378)

**Context:** When debugging, ask: which scope is this variable in, local or global, did I shadow something, did I expect a global change?

```python
voltage = 12.1

def check():
    voltage = 12.0  # local - shadows global
    return voltage < 12.1

# Many "mysterious" bugs are scope misunderstandings
# Which scope? Local or global? Shadowed? Expected global change?
```

---

### 22) Scope Is a Guardrail, Not a Restriction (Line ~388)

**Context:** Scope protects you, makes refactoring safer, enables confident changes.

```python
# Scope: protects you from yourself, makes refactoring safer
# Programs without strong scope discipline rot quickly
```

---

### 23) Homestead System Framing (Line ~398)

**Context:** Global = battery voltage, coop temp, fence voltage, config; local = single reading, calculation result, loop iteration decision.

```python
# Global: battery voltage, generator status, coop temp, fan status, fence voltage,
#         energizer status, solar production, config

# Local: single sensor reading, calculation result (threshold check),
#        decision within one loop iteration (should start fan?)

# Mixing casually causes systems to drift
# Scope enforces the boundary
```

---

### Reflection: Scope and Architecture (Line ~416)

**Context:** Questions: which data persists vs temporary, which names visible everywhere vs hidden, what happens if you mix them.

```python
# Which data persists? voltage, coop_temp, fence_voltage, generator_state, fan_on
# Which temporary? single sensor reading, calculation result, loop iteration state
# Which visible everywhere? shared state - global scope
# Which hidden? function internals, local calculations - local scope

# Failure: temporary leaks to global? state accumulates incorrectly
# Failure: persistent is local? state lost
# Failure: every function modifies globals? coupling, reasoning impossible
```

---

## Chapter 1.07: Data Types as Categories of Meaning

### 1) Types Are Categories, Not Decorations (Line ~17)

**Context:** A type answers “what kind of thing is this value?”; Python uses types to decide allowed operations, comparisons, and behavior.

```python
# Type is inherent to value, not name or source
voltage = 12.1        # float - the value 12.1 is float
coop_temp = 75        # int (wrong for temp - should be float)
fence_voltage = 4.2   # float

# Python uses types: int + int works, int + str doesn't
# voltage < 12.1 works if numeric, fails if None
```

---

### 2) Category Errors Are the Root of Many Bugs (Line ~38)

**Context:** Category error = treating one kind of thing as another; computers enforce category rules, they won't infer intent.

```python
# Examples: treating temp like count, absence like zero, text like number
# Python won't infer - will enforce rules
```

---

### 3) Python's Core Built-In Types (Line ~51)

**Context:** Core types: int, float, bool, str, None.

```python
# int - whole numbers
# float - decimal numbers
# bool - truth values
# str - text
# None - absence of value
```

---

### 4) int: Whole, Discrete Quantities (Line ~65)

**Context:** int = whole numbers; exact, discrete, countable; used for counts, indexes, durations in whole units.

```python
0
1
-5
300

chicken_count = 25
retry_attempts = 3
fan_cycles = 150
reading_count = 10
cooldown_seconds = 300
```

---

### 5) What int Is Good At (Line ~87)

**Context:** Integers excel at counts and discrete quantities, not measurements.

```python
reading_count = 10
cooldown_seconds = 300
retry_attempts = 3
chicken_count = 25
esp32_retries = 3
fan_cycles = 150

# Counts: number of readings, chickens, retries, cycles
# Not measurements - discrete, whole numbers
```

---

### 6) What int Is Bad At (Line ~111)

**Context:** int is bad at measurements, fractions, continuous change; voltage, temp, humidity are float.

```python
# voltage = 12.1 (float, not int)
# coop_temp = 72.8 (float, not 72)
# fence_voltage = 4.2 (float, not 4)
# solar_watts = 1.2 (float, not 1)
# humidity = 0.65 (float, not 0 or 1)

# Measurements are continuous - use float
```

---

### 7) float: Measured, Continuous Quantities (Line ~126)

**Context:** float = decimal numbers; approximate, continuous, measured; sensors produce floats.

```python
12.1
0.5
-3.14

voltage = 12.1
coop_temp = 72.5
fence_voltage = 4.2

# Continuous measurements from sensors, not discrete counts
```

---

### 8) Floats Are Approximations (Line ~146)

**Context:** Floats are stored in binary; some decimals can't be exact; use ranges, not == for comparisons.

```python
# 0.1 + 0.2 might not equal 0.3 exactly
# voltage == 12.1 might fail due to approximation

# Instead of: if voltage == 12.1:
# Use: if abs(voltage - 12.1) < 0.01: or if voltage < 12.1:
```

---

### 9) What float Is Good At (Line ~162)

**Context:** Floats model voltage, temperature, humidity, solar production—measured quantities from sensors.

```python
voltage = 12.1
coop_temp = 72.5
fence_voltage = 4.2
solar_watts = 1200.5
humidity = 0.65
pig_barn_temp = 68.3

# From DHT22, voltage sensors, ESP32 - measured, not counted
```

---

### 10) Never Treat Floats Like Booleans (Line ~180)

**Context:** if voltage: is truthiness, not a voltage check; use explicit comparisons.

```python
# BAD:
if voltage:
    start_generator()

# GOOD:
if voltage < 12.1:
    start_generator()
if coop_temp > 85:
    start_fan()
if fence_voltage < 2.0:
    alert()
```

---

### 11) bool: Truth, Not Meaning (Line ~198)

**Context:** bool = True or False only; represents decisions, conditions, yes/no questions; not magnitude or history.

```python
True
False

fan_on = True      # answers "is fan on?"
is_energized = True  # answers "is fence energized?"
# Doesn't tell you temp, speed, voltage level - binary only
```

---

### 12) Booleans Are Results of Logic (Line ~220)

**Context:** Booleans usually come from comparisons; they represent decisions, not raw data.

```python
is_low = voltage < 12.1
generator_running = True
fan_on = False
is_energized = fence_voltage > 2.0
temp_high = coop_temp > 85
solar_producing = solar_watts > 100

# Decisions, yes/no - not measurements
```

---

### 13) Booleans Are Not Labels (Line ~234)

**Context:** Boolean answers a question; the name supplies meaning—use descriptive names.

```python
# BAD: meaning unclear
generator_state = True
coop_state = False

# GOOD: name supplies the question
generator_running = True
fan_on = False
is_energized = True
solar_producing = True
```

---

### 14) str: Text and Symbols (Line ~253)

**Context:** str = text; human-readable, symbolic, immutable; not numbers or logic.

```python
"running"
"stopped"
"Voltage low"

# Strings are text - not numbers, not logic
```

---

### 15) What Strings Are Good At (Line ~268)

**Context:** Strings model labels, messages, categories, identifiers—human-readable symbols.

```python
generator_state = "running"
coop_state = "fan_on"
fence_state = "energized"
alert_message = "Voltage below threshold"
coop_alert = "Temperature high in coop"
sensor_name = "battery_voltage"
esp32_id = "coop_sensor_01"

# Labels, messages, categories - language, not math
```

---

### 16) Strings Are Immutable (Line ~288)

**Context:** You cannot change a string in place; concatenation creates a new string.

```python
state = "run"
state = state + "ning"  # creates NEW string
# Old "run" still exists until discarded
```

---

### 17) None: Absence Is Not Zero (Line ~302)

**Context:** None = no value; not zero, not False, not empty string; sensor timeout, ESP32 disconnected.

```python
# voltage = None means "we don't know"
# voltage = 0 means "voltage is zero volts" - different

# if voltage < 12.1: fails if voltage is None
# Confusing None with 0 causes bugs
```

---

### 18) Why None Exists (Line ~322)

**Context:** Reality is incomplete; sensors fail, files missing, networks drop; None represents that honestly.

```python
voltage = read_sensor()
# If sensor times out:
voltage = None  # "we don't know", not 0 volts
```

---

### 19) Homestead Example (Line ~334)

**Context:** voltage = None means unknown; voltage = 0 means zero volts; confusing them leads to bad logic.

```python
voltage = read_sensor()
# Timeout → voltage = None (unknown)
# Success → voltage = 12.1 (measured)

# None ≠ 0
```

---

### 20) None Forces Explicit Thinking (Line ~348)

**Context:** Python prevents accidental use of None as a number; TypeError is a feature.

```python
None + 1   # TypeError
# Python forces you to handle absence explicitly
```

---

### 21) Types Enforce Meaning Through Rules (Line ~358)

**Context:** Each type has allowed/forbidden operations; types prevent category errors.

```python
# Allowed: int + int, float + float, float < int
10 + 5          # 15
12.1 + 0.5      # 12.6
coop_temp < 85  # works

# Forbidden: float + str, None < 5
voltage + "V"   # TypeError
None < 85       # TypeError
```

---

### 22) The type() Function (Line ~378)

**Context:** type(value) returns the category; useful for debugging, not for logic.

```python
type(12.1)        # float
type(True)        # bool
type("running")   # str
type(None)        # NoneType
```

---

### 23) Type Errors vs Value Errors (Line ~391)

**Context:** TypeError = wrong category; ValueError = right category, wrong content.

```python
# TypeError: wrong category
12.1 + "V"           # mixing float and str
voltage + "V"
None < 12.1

# ValueError: right type, wrong content
int("abc")
float("not a number")
int("12.5")          # has decimal
float("sensor_error")
```

---

### 24) Types Shape Control Flow (Line ~418)

**Context:** if voltage < 12.1 only works if voltage is numeric; if None, Python fails fast—which is good.

```python
if voltage < 12.1:
    start_generator()

# If voltage is None: fails fast (good)
# Silent failure would be worse
```

---

### 25) Modeling Reality Correctly (Line ~432)

**Context:** Choose types that match reality: measurements→float, counts→int, decisions→bool, labels→str, absence→None.

```python
voltage = 12.1           # measurement → float
chicken_count = 25       # count → int
fan_on = True            # decision → bool
generator_state = "running"  # label → str
voltage = None           # absence → None
```

---

### 26) Types Are Design Decisions (Line ~448)

**Context:** str for many states ("running","stopped","error"); bool for yes/no only.

```python
# str: many states, categorical
generator_state = "running"
coop_state = "fan_on"

# bool: yes/no only
generator_running = True
fan_on = False
is_energized = True

# Choice depends on reality
```

---

### 27) Types and Invariants (Line ~470)

**Context:** If voltage is always float or None, you can check absence and compare safely.

```python
# voltage always float or None
if voltage is None:
    handle_error()
elif voltage < 12.1:
    alert()

# Type discipline prevents category errors
```

---

### Reflection: Type Analysis (Line ~436)

**Context:** Ask: what kind of thing, measured or counted, can absence happen, bool or category.

```python
# What kind? voltage float, coop_temp float, fan_on bool
# Measured or counted? voltage measured, chicken_count counted
# Can be None? Sensors fail - yes
# Bool or category? fan_on bool, generator_state might be str

# Failure: int for measurements? Loses precision
# Failure: None vs 0? Wrong logic
# Failure: bool where need str? Can't represent "error"
```

---

## Chapter 1.08: Truthiness and Explicit Checks

### 1) Truthiness Is Not the Same as Boolean Logic (Line ~15)

**Context:** Python has bool (True/False); truthiness = treating non-boolean values as true/false in conditions.

```python
# bool: True, False
# Truthiness: "If I force this value into yes/no, which way does it go?"
# Different from: "Is this value actually True or False?"
```

---

### 2) Why Truthiness Exists (Line ~34)

**Context:** Truthiness allows compact code; convenient for scripts, dangerous for long-running systems.

```python
# Compact:
if readings:
    process(readings)

# Instead of:
if readings is not None and len(readings) > 0:
    process(readings)

# Convenient for scripts; dangerous for battery monitors, coop controllers
```

---

### 3) Truthiness Is a Shortcut, Not a Model (Line ~55)

**Context:** Truthiness collapses multiple meanings into one yes/no; sometimes fine, often not.

```python
# When you rely on truthiness: "I'm okay collapsing multiple meanings into one yes/no"
# Sometimes fine; often not
```

---

### 4) What Python Considers Falsy (Line ~69)

**Context:** Falsy: False, None, 0, 0.0, "", [], {}, set(); everything else truthy.

```python
# Falsy: False, None, 0, 0.0, "", [], {}, set()
# Truthy: everything else
# Memorize not to rely on it—but to recognize when it betrays you
```

---

### 5) Falsy Does Not Mean "Bad" or "Wrong" (Line ~85)

**Context:** Falsy values can be valid: 0.0 volts is real, [] can mean "no readings yet", False can mean "fan off".

```python
# voltage == 0.0 valid reading
# readings == [] valid empty state
# None means absence—different from both

# fence_voltage = 0.0 means fence off (valid)
# fence_voltage = None means we don't know (sensor failed)
# Both falsy, different meanings
```

---

### 6) The Voltage Example (Again) (Line ~100)

**Context:** if voltage: means "if truthy", not "if low" or "if exists"; 0.0 volts is falsy—bug when zero is valid.

```python
# BAD:
if voltage:
    start_generator()

# Does NOT mean: if voltage is low, exists, or unsafe
# Means: if voltage is truthy
# voltage == 0.0 → False (falsy) — never runs when 0.0 volts
# 0.0 volts might be exactly when you need the generator
# Truthiness collapses "zero" and "missing" into same False branch
```

---

### 7) None Is Absence, Not False (Line ~126)

**Context:** None = no value, unknown, missing; not False, zero, empty, or off.

```python
# None: sensor didn't respond, reading timed out, ESP32 disconnected
# None ≠ False (boolean decision)
# None ≠ 0.0 (real measurement)
# None ≠ [] or "" (empty values)
# None ≠ off (state)

# Confusing them causes bugs
```

---

### 8) Absence Is a First-Class State (Line ~144)

**Context:** Sensors fail, files missing, networks drop—absence is reality; design for it, represent None explicitly.

```python
# voltage = None when sensor fails
# coop_temp = None when DHT22 times out
# fence_voltage = None when ESP32 offline

# Represent absence explicitly; handle it explicitly
```

---

### 9) Why None Is Dangerous in Conditions (Line ~158)

**Context:** if voltage: collapses 0.0, None, False into one False branch—different states, different handling.

```python
# if voltage: collapses into one False branch:
# - voltage is 0.0 (real measurement)
# - voltage is None (sensor failed)
# - voltage is False (unlikely)

# 0.0 volts means something; None means "we don't know"
# If logic treats them same, you've lost information
```

---

### 10) Explicit None Checks Preserve Meaning (Line ~176)

**Context:** To check for absence, use if voltage is None: or if voltage is not None:—clarity, not pedantry.

```python
if voltage is None:
    handle_missing()

if voltage is not None:
    process(voltage)
```

---

### 11) Why is and Not == (Line ~192)

**Context:** Use is for None; is checks identity, None is a singleton; == None works sometimes but wrong concept.

```python
# Correct:
if voltage is None:

# Wrong concept:
if voltage == None:
```

---

### 12) Explicit Checks Make Boundaries Visible (Line ~208)

**Context:** Boundary: validate first, then proceed; truthiness skips the boundary.

```python
# Boundary:
if voltage is None:
    log_error("No voltage reading")
    return
# "I expect voltage to exist; if not, stop here"

# if voltage: assumes voltage exists—doesn't handle None
# Explicit checks enforce the boundary
```

---

### 13) Zero Is a Value (Line ~222)

**Context:** Zero is a real number, not absence or False; if zero is meaningful, handle it explicitly.

```python
# 0.0 volts (battery depleted), 0.0 solar (night),
# 0.0 fence voltage (energizer off), 0.0°F (extreme cold)
# All valid measurements; all falsy
# Truthiness collapses them with None—wrong
```

---

### 14) The "or Default" Trap (Line ~234)

**Context:** voltage = reading or 12.0 replaces 0.0 with 12.0—zero volts becomes default, catastrophic bug.

```python
# BAD:
voltage = reading or 12.0
# "Use reading if truthy, otherwise 12.0"
# NOT "Use reading if it exists, otherwise 12.0"

# reading == 0.0 → replaced with 12.0
# Sensor reads 0.0 (battery depleted), code replaces with 12.0
# System thinks battery fine, generator never starts—catastrophic
```

---

### 15) The Correct Pattern for Defaults (Line ~248)

**Context:** When absence is the concern: reading if reading is not None else default; zero stays zero.

```python
voltage = reading if reading is not None else 12.0
coop_temp = reading if reading is not None else 75.0
fence_voltage = reading if reading is not None else 4.0

# Zero stays zero; absence triggers default; meaning preserved
```

---

### 16) Truthiness vs Intent (Line ~262)

**Context:** Ask: "Am I checking truthiness—or meaning?" If meaning, use explicit checks.

```python
# Truthiness: "is it truthy?"
# Meaning: "is it None?", "is it zero?", "is it in range?"
# If meaning, truthiness is usually wrong tool
```

---

### 17) Collections and Truthiness (Line ~270)

**Context:** Empty collections are falsy; if readings: can hide cases—is empty valid, error, temporary, or missing?

```python
if readings:
    process(readings)
# Empty list falsy—but is [] valid state, error, temporary, or missing?
# Truthiness doesn't tell you which
```

---

### 18) Distinguishing Empty vs Missing (Line ~286)

**Context:** [] = "empty list"; None = "no data"; truthiness treats both False—handle them differently.

```python
readings = []   # "we have a list, it has no elements"
readings = None # "we don't have data"

# Truthiness: if readings: fails for both
# Explicit:
if readings is None:
    handle_missing_data()
elif len(readings) == 0:
    handle_empty_data()
else:
    process(readings)
```

---

### 19) Truthiness and Control Flow Bugs (Line ~312)

**Context:** if value: do_thing() silently changes meaning when value gains new states, edge values, failure modes.

```python
if value:
    do_thing()
# When system evolves and value gains new states, edge values, failure modes
# Condition silently changes meaning
# Explicit conditions don't rot this way
```

---

### 20) Truthiness Is Context-Dependent (Line ~326)

**Context:** Appropriate when you don't care why false; dangerous when value represents reality, absence matters, zero is meaningful.

```python
# Appropriate: internal/temporary logic, truly don't care why false
# Dangerous: real-world data, absence matters, zero meaningful, continuous systems
```

---

### 21) Professional Rule of Thumb (Line ~338)

**Context:** Truthiness for internal/temporary; explicit checks at boundaries and for real-world data; treat None as first-class.

```python
# Truthiness: internal, temporary logic
# Explicit: system boundaries, real-world data
# None: first-class state
```

---

### 22) Homestead System Framing (Line ~348)

**Context:** Sensor reading can be zero, missing, stale, or invalid—truthiness collapses them; explicit checks separate them.

```python
# voltage can be: 0.0, None, stale, invalid
# if voltage: treats all same
# Explicit: if voltage is None: handle_missing(); elif voltage == 0.0: handle_zero(); else: process(voltage)
# Separation is stability
```

---

### Reflection: Truthiness Analysis (Line ~364)

**Context:** Where could truthiness hide absence, where is zero meaningful, where are you collapsing states?

```python
# Where could truthiness hide absence? if voltage: hides None
# Where could zero be meaningful? 0.0 volts, solar, fence, temp
# Where collapsing states? voltage or 12.0 collapses 0.0 and None

# Failure: 0.0 becomes valid later? if voltage: silently breaks
# Failure: sensor returns None? voltage or 12.0 hides failure
# Failure: need empty vs missing? truthiness can't
```

---

## Chapter 1.09: Collections and Grouped State

### 1) Why Collections Exist at All (Line ~16)

**Context:** Without collections, every value needs its own variable; collections let you say "these values belong together."

```python
# Without collections:
reading_1 = 12.1
reading_2 = 12.0
reading_3 = 11.9
# Doesn't scale, generalize, or survive change

# With collections:
readings = [12.1, 12.0, 11.9]
coop_temps = [75, 76, 74]
fence_voltages = [4.2, 4.1, 4.0]
```

---

### 2) Collections Are Grouped State (Line ~41)

**Context:** A collection is one variable representing multiple related values; changes how logic and loops work.

```python
readings = [12.1, 12.0, 11.9]
# One variable, many values—instead of reading_1, reading_2, reading_3

# State tracked per variable; conditions branch; loops operate over
```

---

### 3) Python's Core Collection Types (Line ~51)

**Context:** Phase 1 focus: list (ordered, mutable), tuple (ordered, immutable), set (unordered, unique).

```python
# List — ordered, mutable
# Tuple — ordered, immutable
# Set — unordered, unique
```

---

### 4) Lists: Ordered, Mutable Sequences (Line ~62)

**Context:** List = ordered collection of values; preserves order, can grow/shrink, can be modified in place.

```python
readings = [12.1, 12.0, 11.9]
coop_temps = [75, 76, 74, 73]
fence_voltages = [4.2, 4.1, 4.0]
solar_readings = [1200, 1150, 1100, 1050]

# Preserve order, grow/shrink, modify in place
```

---

### 5) Lists Model History and Accumulation (Line ~79)

**Context:** Lists for sensor readings over time, event logs, queues; order is meaning—[-1] is latest.

```python
readings = [12.1, 12.0, 11.9, 11.8]
# Voltage readings over time—oldest first, newest last

latest_voltage = readings[-1]
latest_coop_temp = coop_temps[-1]
latest_fence = fence_voltages[-1]
# [-1] = most recent reading by design
```

---

### 6) Lists Are Mutable (Line ~94)

**Context:** Mutability: state changes in place, references see same list, side effects possible—power and risk.

```python
readings.append(11.8)
readings[0] = 12.2

# Same object modified; all references see change
# append() in one place affects everywhere that references readings
# Immutable tuples avoid this
```

---

### 7) List Indexing: Access by Position (Line ~108)

**Context:** Indexing starts at 0; negative indexes count from end; [-1] = last (most recent).

```python
readings[0]    # first item
readings[1]    # second item
readings[-1]   # last item (most recent)
readings[-2]   # second to last

latest_voltage = readings[-1]
latest_coop_temp = coop_temps[-1]
```

---

### 8) Indexing Is Positional Meaning (Line ~126)

**Context:** When you index, you assert meaning: "last element is most recent"; order = time.

```python
latest = readings[-1]
# "Last element is most recent"; "order matters"; "list represents time"
```

---

### 9) List Slicing: Extracting Ranges (Line ~136)

**Context:** Slicing creates new list; preserves order, doesn't modify original; safer than mutation.

```python
recent = readings[-5:]
recent_temps = coop_temps[-10:]
recent_fence = fence_voltages[-5:]

# Last 5 voltage readings, last 10 coop temps
# Produces new collection, original unchanged
```

---

### 10) Slicing Is a Boundary (Line ~152)

**Context:** Slice narrows scope, limits what logic sees, reduces cognitive load; reason about a window.

```python
recent = readings[-5:]
# Instead of reasoning about all readings, reason about this window
# Boundaries matter
```

---

### 11) Common List Methods (Line ~164)

**Context:** append(), pop(), remove(), len(), in—tools for grouped state.

```python
readings.append(11.8)
readings.pop()
readings.remove(12.0)
len(readings)
12.1 in readings
```

---

### 12) List Length Is State (Line ~176)

**Context:** Length is system state; enforce invariants, limit memory, rolling window.

```python
if len(readings) > 100:
    readings.pop(0)

# Keep rolling window of last 100 readings
# Enforces invariant, limits memory, controls complexity
```

---

### 13) Tuples: Fixed, Immutable Sequences (Line ~188)

**Context:** Tuple = ordered, cannot change; preserves order, safe to share; immutability is protection.

```python
coordinates = (12.1, 72.5)
reading = (voltage, timestamp)
coop_reading = (coop_temp, humidity)
fence_reading = (fence_voltage, timestamp)

# Values belong together; structure fixed; accidental mutation = bug
```

---

### 14) Tuples Represent "This Goes Together" (Line ~204)

**Context:** Tuples for values that belong together: (voltage, timestamp), (coop_temp, humidity).

```python
# (voltage, timestamp) — battery reading with time
# (coop_temp, humidity) — DHT22 reading
# (fence_voltage, timestamp) — poultry net reading
# (solar_watts, timestamp) — solar production reading
# (x, y) coordinates
```

---

### 15) Tuples Are Often Used for Returns (Line ~220)

**Context:** Functions return multiple values as one tuple; caller can unpack safely.

```python
def read_voltage():
    return voltage, timestamp

voltage, ts = read_voltage()

# One return value: structured, ordered, immutable
```

---

### 16) Why Immutability Matters (Line ~234)

**Context:** Immutability prevents accidental changes, eases reasoning, reduces side effects.

```python
# When data should not change, make it impossible
reading = (12.1, 1699000000)
# reading[0] = 12.2  # TypeError
```

---

### 17) Sets: Unordered, Unique Collections (Line ~246)

**Context:** Set = unique values, no order; no duplicates, optimized for membership tests.

```python
states = {"off", "starting", "running"}
# No duplicates, no order, optimized for "is x in set?"
```

---

### 18) Sets Model Categories and Membership (Line ~258)

**Context:** Sets for allowed states, feature flags, capabilities, deduplication; membership is meaning.

```python
valid_generator_states = {"off", "starting", "running", "error"}
valid_coop_states = {"normal", "fan_on", "alert"}
known_sensor_ids = {"coop_01", "pig_barn_01", "cow_barn_01"}
active_alerts = {"voltage_low", "temp_high", "fence_down"}

# "Is this state valid?" "Is this sensor known?" "Is this alert active?"
```

---

### 19) Sets Are Not Sequences (Line ~272)

**Context:** Cannot index or slice a set; if order matters, set is wrong type.

```python
states = {"off", "starting", "running"}
# states[0]   # TypeError
# states[-1]  # TypeError
# If order matters, use list or tuple
```

---

### 20) Mutability Comparison (Line ~284)

**Context:** List: ordered, mutable, duplicates; Tuple: ordered, immutable, duplicates; Set: unordered, mutable, no duplicates.

```python
# List:   ordered, mutable, duplicates
# Tuple:  ordered, immutable, duplicates
# Set:    unordered, mutable, no duplicates
```

---

### 21) Collections and Loops Are Linked (Line ~294)

**Context:** Collections + loops = grouped state becomes behavior; without either, the other sits idle.

```python
for reading in readings:
    process(reading)

for temp in coop_temps:
    process_temp(temp)

for v in fence_voltages:
    process_fence(v)

# Without loops, collections sit; without collections, loops have nothing
```

---

### 22) Iteration Preserves or Ignores Order (Line ~306)

**Context:** List/tuple: iteration preserves order; set: iteration order undefined; choose by what matters.

```python
# List, tuple: iteration preserves order (time)
# Set: iteration order undefined (categories)
# Order matters for time; not for categories
```

---

### 23) Collections Multiply Paths (Line ~316)

**Context:** Single value → two paths; collection → many paths; each element can trigger conditions, change state, cause errors.

```python
# any reading < 12.1, any coop_temp > 85
# each append changes list
# IndexError, empty list edge cases

# List of 100 readings → 100 potential paths
# Design invariants to contain complexity
```

---

### 24) Collections Also Contain Complexity (Line ~330)

**Context:** Instead of many variables, use one structure; any(), for—one loop, clear intent.

```python
# Instead of:
# if r1 < 12.1 or r2 < 12.1 or r3 < 12.1:

if any(r < 12.1 for r in readings):
    alert_low()

if any(t > 85 for t in coop_temps):
    alert_high()

if any(v < 2.0 for v in fence_voltages):
    alert_fence_down()

# One structure, one loop, clear intent
# Collections organize complexity
```

---

### 25) Collections Need Invariants (Line ~346)

**Context:** Examples: readings never exceeds 100, states set only valid states; without invariants, collections rot.

```python
# "Readings list never exceeds 100 items"
if len(readings) > 100:
    readings.pop(0)

# "States set contains only valid states"
VALID_STATES = {"off", "starting", "running"}
if state not in VALID_STATES:
    handle_invalid()

# Without invariants, collections rot silently
```

---

### 26) Collections and Time (Line ~358)

**Context:** Collections grow over time; design limits early—rolling window, max length.

```python
# Each minute: readings.append(new_reading)
# Without limit: week = 10,080 items, month = 43,200
# Design: keep last 100, or last 24 hours

if len(readings) > 100:
    readings.pop(0)
readings.append(read_sensor())
```

---

### 27) Homestead System Framing (Line ~368)

**Context:** Voltage readings over time → list; sensor (voltage, timestamp) → tuple; allowed states, sensor IDs → set.

```python
# Time series: list (order matters)
voltage_readings = [12.1, 12.0, 11.9]
coop_temps = [75, 76, 74]

# Fixed structure: tuple
reading = (voltage, timestamp)
coop_reading = (coop_temp, humidity)

# Membership: set (order doesn't)
valid_states = {"off", "running", "error"}
known_sensors = {"coop_01", "pig_barn_01"}
```

---

### Reflection: Collection Choice (Line ~376)

**Context:** One or many? Order matters? Should it change? Duplicates make sense?

```python
# One or many? voltage over time → many, list
# Order matters? voltage history → yes; valid states → no, set
# Should it change? readings → yes, mutable; metadata → no, tuple
# Duplicates? readings → yes; valid states → no, set

# Failure: list grows unbounded? Design invariant, rolling window
# Failure: share without mutation? Use tuple
# Failure: order doesn't matter but using list? Consider set
```

---

## Chapter 1.10: Dictionaries and Named Systems

### 1) Why Dictionaries Exist at All (Line ~13)

**Context:** Lists: "what is the nth item?" Dictionaries: "what value is associated with this name?"

```python
# List: readings[0] — voltage or timestamp? You have to remember
readings = [12.1, "2025-01-30"]

# Dict: meaning explicit
sensor_data = {"voltage": 12.1, "timestamp": "2025-01-30"}
sensor_data["voltage"]
sensor_data["timestamp"]

# coop_sensor["temp"], fence_packet["voltage"] — named access documents meaning
```

---

### 2) Dictionaries Are Named State (Line ~25)

**Context:** Dict = key → value mappings; one variable holding named state.

```python
sensor_data = {
    "voltage": 12.1,
    "timestamp": "2025-01-30"
}

coop_sensor = {"temp": 75.3, "humidity": 0.65, "timestamp": "2025-01-30"}
fence_packet = {"voltage": 4.2, "energized": True}
solar_packet = {"watts": 1200, "producing": True}

# Keys = names; values = data; dict = state container
```

---

### 3) Keys Are Meaning, Not Position (Line ~45)

**Context:** In a list you remember; in a dict the meaning is explicit.

```python
# List: what is readings[0]? readings[1]? Code doesn't tell you
readings = [12.1, "2025-01-30"]

# Dict: meaning explicit
sensor_data["voltage"]
sensor_data["timestamp"]
```

---

### 4) Dictionaries Compress Reality Without Lying (Line ~62)

**Context:** Dict compresses multiple variables into one named structure; each key documents what the value represents.

```python
# Instead of: voltage = 12.1; timestamp = "2025-01-30"
sensor_data = {"voltage": 12.1, "timestamp": "2025-01-30"}
# One structure, no lost meaning
```

---

### 5) Dictionary Keys Must Be Unique (Line ~78)

**Context:** Each key appears at most once; second value overwrites first.

```python
{"voltage": 12.1, "voltage": 12.0}
# Second overwrites first — key = one value per concept
```

---

### 6) Dictionary Values Can Be Anything (Line ~88)

**Context:** Values: numbers, strings, booleans, None, lists, other dicts; good for modeling real systems.

```python
sensor_data = {
    "voltage": 12.1,
    "timestamp": "2025-01-30",
    "readings": [12.1, 12.0, 11.9]
}
```

---

### 7) Accessing Values With [] (Line ~98)

**Context:** sensor_data["voltage"] means "I expect this key to exist"; missing key → KeyError.

```python
voltage = sensor_data["voltage"]

# Key missing → KeyError (explicit failure)
# ESP32 sends {"temp": 75} without "voltage" → KeyError
# Key documents contract; missing key = contract violated
```

---

### 8) KeyError Is a Boundary Violation (Line ~116)

**Context:** KeyError: assumed data existed, reality disagreed; boundary wrong or missing.

```python
# KeyError tells you: you assumed data existed, reality disagreed
# Sometimes you want this failure
```

---

### 9) When [] Is the Right Choice (Line ~128)

**Context:** Use [] when key must exist, absence indicates programmer error, system can't proceed.

```python
# Required config, internal invariants, critical system state
voltage = sensor_data["voltage"]  # must exist
# Fail fast, fail loud
```

---

### 10) The .get() Method: Designing for Absence (Line ~142)

**Context:** .get() accesses key safely; missing → None; encodes "absence is allowed."

```python
voltage = sensor_data.get("voltage")
coop_temp = coop_sensor.get("temp")
fence_v = fence_packet.get("voltage")

# Key missing → no error, returns None
# "Absence is allowed" — design choice
```

---

### 11) .get() With Defaults (Line ~162)

**Context:** Supply default: config.get("threshold", 12.1); use configured if present, else fallback.

```python
threshold = config.get("threshold", 12.1)
temp_threshold = coop_config.get("temp_threshold", 85)
fence_threshold = fence_config.get("low_voltage_threshold", 2.0)

# Use configured if present; otherwise fall back
# Defaults should be intentional
```

---

### 12) .get() vs [] Is a Design Decision (Line ~176)

**Context:** [] → "this must exist"; .get() → "this might not exist"; semantic choice, not syntax.

```python
# [] → "This must exist."
voltage = sensor_data["voltage"]

# .get() → "This might not exist."
voltage = sensor_data.get("voltage")
voltage = sensor_data.get("voltage", 12.0)

# Mixing carelessly creates bugs
```

---

### 13) Dictionaries Make Failure Explicit (Line ~188)

**Context:** Missing key = information; you decide: crash, default, skip, log, degrade.

```python
# Missing key: you decide
# Crash: sensor_data["voltage"]
# Default: sensor_data.get("voltage", 12.0)
# Skip: if "voltage" in sensor_data: ...
# Log: log_error("voltage missing")
# Degrade: use fallback sensor

# Choice belongs in code, not assumptions
```

---

### 14) Iterating Over Dictionaries (Line ~204)

**Context:** for key in sensor_data iterates keys; .keys(), .values(), .items() for explicit intent.

```python
for key in sensor_data:
    pass

for key in sensor_data.keys():
    pass

for value in sensor_data.values():
    pass

for key, value in sensor_data.items():
    log(key, value)

# Each form communicates intent
```

---

### 15) .items() Is the Most Honest Form (Line ~222)

**Context:** When you care about both name and value: for key, value in sensor_data.items()

```python
for key, value in sensor_data.items():
    log(key, value)

# Keeps meaning attached to data
```

---

### 16) Nested Dictionaries: Hierarchical Systems (Line ~232)

**Context:** Dicts can contain dicts; models hierarchy naturally.

```python
system = {
    "battery": {"voltage": 12.1},
    "generator": {"state": "running"}
}

system = {
    "coop": {"temp": 75, "fan_on": True},
    "fence": {"voltage": 4.2, "energized": True}
}
```

---

### 17) Nested Dictionaries Mirror Real Systems (Line ~246)

**Context:** Real systems: system → subsystem → component; nested dicts reflect structure.

```python
system["generator"]["state"]
# Reads like the system
```

---

### 18) Nested Access Requires Careful Boundaries (Line ~256)

**Context:** Each level might be missing; .get("generator", {}).get("state") is defensive; [] assumes invariants.

```python
# Defensive: assumes failure is normal
system.get("generator", {}).get("state")

# Assumes invariants hold
system["generator"]["state"]

# Choose deliberately
```

---

### 19) Dictionaries as Configuration Models (Line ~270)

**Context:** Config is named data; dicts fit well; keys document intent, values carry meaning.

```python
config = {
    "threshold": 12.1,
    "cooldown": 300,
    "enabled": True
}

coop_config = {"temp_threshold": 85, "fan_cooldown": 60}
fence_config = {"low_voltage_threshold": 2.0, "alert_enabled": True}
```

---

### 20) Configuration Should Be Read-Mostly (Line ~286)

**Context:** Config usually loaded once, rarely modified; treat as immutable by convention.

```python
# Config: load once, rarely modify, treat as immutable by convention
# Changing config at runtime: powerful and dangerous
```

---

### 21) Dictionaries vs Lists Revisited (Line ~294)

**Context:** List when order matters; dict when meaning matters and you look up by name.

```python
# List: order matters, iterate sequentially, process history
# Dict: meaning matters, look up by name, order irrelevant
```

---

### 22) Dictionaries as State Containers (Line ~306)

**Context:** Group state instead of loose globals; pass, log, snapshot, test more easily.

```python
# Instead of: voltage = 12.1; generator_running = True; last_update = "2025-01-30"

state = {
    "voltage": 12.1,
    "generator_running": True,
    "last_update": "2025-01-30"
}

coop_state = {"temp": 75, "fan_on": False, "last_update": "2025-01-30"}
fence_state = {"voltage": 4.2, "energized": True}

# State explicit, portable
```

---

### 23) Grouped State Improves Reasoning (Line ~322)

**Context:** When state lives together: pass, log, snapshot, test—easier than loose globals.

```python
# Passing state easier, logging easier, snapshotting easier, testing easier
# State containers scale better than loose globals
```

---

### 24) Dictionaries and Mutability (Line ~334)

**Context:** Dicts are mutable; shared references see changes; side effects possible; discipline required.

```python
state["voltage"] = 12.0
coop_state["temp"] = 76
fence_state["voltage"] = 4.1

# Updates in place; shared references see changes
```

---

### 25) Dictionaries Need Invariants Too (Line ~346)

**Context:** Dicts don't enforce invariants; you must: required keys, types, combinations.

```python
# Required keys must exist
# Values must be types (voltage float, fan_on bool)
# Combinations must be valid (if generator_running, voltage must exist)

# Document required keys, validate on load
# .get() with intentional defaults for optional keys
```

---

### 26) Homestead System Framing (Line ~358)

**Context:** Sensor packets, config, system state, metadata → dict; each key is a contract.

```python
# Sensor packets: {"voltage": 12.1, "timestamp": "2025-01-30"}
# Configuration: {"threshold": 12.1, "cooldown": 300}
# System state: {"voltage": 12.1, "generator_running": True}
# Metadata: {"sensor_id": "coop_01", "source": "esp32"}

# Each key = contract; each missing key = question
```

---

### Reflection: Dict vs List Choice (Line ~374)

**Context:** Which data is positional vs named? Where can data be missing? Crash vs degrade?

```python
# Positional? voltage history → list
# Named? voltage, temp, humidity, timestamp → dict

# Where can data be missing? ESP32 might omit "voltage"
# Where crash? Required config → []
# Where degrade? Optional "alert_enabled" → .get("alert_enabled", False)

# Failure: key assumed exists? KeyError or wrong default
# Failure: [] when should .get()? Crashes on optional data
# Failure: .get() when key must exist? Hides bugs, returns None
```
