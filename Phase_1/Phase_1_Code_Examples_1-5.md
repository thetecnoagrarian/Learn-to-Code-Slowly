# Phase 1 Code Examples (Chapters 1-5)

This file contains visual references for all code examples mentioned in Phase 1 chapters 1-5. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 1.01: What a Python Program Is

### 1) Python as an Interpreter (Line ~10)

**Context:** Python reads and executes code immediately, line by line; no separate compilation phase.

```python
# Python reads your code at runtime
# Python executes instructions as it encounters them
# Errors appear when Python tries to execute something invalid
# The program exists only while Python is running
# State lives in memory, not in the file itself

# When Python stops running, the program stops existing
# There is no lingering "program" sitting on disk
# There is only text

# Homestead: battery monitor runs continuously
while True:
    voltage = read_sensor()
    if voltage < 12.1:
        start_generator()
    sleep(5)
# Python reads code, executes it, maintains state in memory
# When Python stops, program stops - unless state persisted to files
# .py file is static text, program is alive execution
```

---

### 2) Interpreter vs Compiler (Why This Matters) (Line ~33)

**Context:** Python removes separation between source code and execution; what you write is what runs.

```python
# When you run a Python file:
# Python reads the text
# Python executes the text
# Python maintains state while executing
# Python forgets everything when execution ends

# Tight loop between code and execution
# What you write is what runs
# No hidden transformation step

# Homestead: Python like person following written instructions in real time
# "check poultry net, then coop temp, then solar production"
# Instruction sheet exists on paper (file)
# Work exists only while person is following instructions (execution)
# If person stops, work stops
# Paper does not "contain" the work - it only describes it
```

---

### 3) Execution Order Is Law (Line ~54)

**Context:** Python executes from top to bottom; order is absolute, not configurable.

```python
# Python executes code from top to bottom
# Line one executes first, then line two, then line three

# Execution order is absolute
voltage = read_sensor()      # Line 1: executes first
if voltage < 12.1:           # Line 2: executes second
    start_generator()         # Line 3: executes third

# If you reference variable before it exists, Python fails
if voltage < 12.1:  # Error: voltage doesn't exist yet
    start_generator()
voltage = read_sensor()  # Too late

# If you call function before it's defined, Python fails
start_generator()  # Error: function doesn't exist yet
def start_generator():
    set_relay(ON)

# Python does not look ahead, figure it out, or guess intent
# It executes instructions in order you give them

# Homestead: must measure voltage before comparing
# Must read coop temp before deciding to turn on fan
# Must check fence voltage before alerting
# Must define start_generator() before calling it
# Order is not negotiable
```

---

### 4) Why Order Matters More Than Beginners Expect (Line ~80)

**Context:** Python executes each assignment once, at that moment, with whatever value exists then.

```python
# Spreadsheet might let you define relationships:
# voltage_low = voltage < 12.1  (updates when voltage changes)

# Python does not:
voltage = read_sensor()  # Executes once, at this moment
voltage_low = voltage < 12.1  # Executes once, with value that exists then
# voltage_low does not update automatically when voltage changes

# Python executes each assignment once, at that moment
# Order, not relationships

# Homestead: spreadsheet expects "coop_hot = coop_temp > 85" to update
# Python executes once: coop_temp = 75, coop_hot = False
# Later: coop_temp = 90, but coop_hot is still False (not updated)
# Must reassign: coop_hot = coop_temp > 85
```

---

### 5) Code That Runs vs Code That Exists (Line ~92)

**Context:** File is static text; program is alive execution that exists only while Python runs.

```python
# Python file is a text file
# Python program is execution

# File exists whether or not Python is running
# battery_monitor.py exists on disk (static text)

# Program exists only while Python is executing the file
# When Python runs battery_monitor.py, that's the program (alive execution)

# File is static, program is alive
# File does not change by itself
# Program constantly changes while it runs

# Homestead: battery_monitor.py is a file - static text
# When Python runs it, that's the program - alive execution
# File exists on disk, program exists in memory
# When Python stops, program disappears, file remains
```

---

### 6) Static vs Dynamic (Line ~112)

**Context:** Static is the text/order/names in file; dynamic is variable values/state/timing/inputs.

```python
# Static: text in .py file, order of instructions, names you define
voltage = read_sensor()  # Static: text in file
coop_temp = read_dht22()  # Static: text in file

# Dynamic: variable values, state transitions, timing, input from outside world
# When Python runs it:
voltage = 12.1  # Dynamic: value at moment 1
voltage = 12.0  # Dynamic: value at moment 2
voltage = 11.9  # Dynamic: value at moment 3

coop_temp = 75  # Dynamic: value at moment 1
coop_temp = 78  # Dynamic: value at moment 2
coop_temp = 72  # Dynamic: value at moment 3

# Code is static, execution is dynamic
```

---

### 7) Scripts vs Systems (Line ~129)

**Context:** Scripts run once and exit; systems run continuously, react to inputs, maintain state.

```python
# Script: runs once, performs task, exits
def convert_csv_to_json():
    data = read_csv("data.csv")
    json_data = convert_to_json(data)
    write_json("data.json", json_data)
# Runs once, exits

# System: runs continuously, reacts to inputs, maintains state, adapts over time
def battery_monitor():
    while True:  # Runs continuously
        voltage = read_sensor()  # Reacts to inputs
        if voltage < 12.1:       # Maintains state
            start_generator()    # Adapts over time
        sleep(5)

def coop_controller():
    while True:  # System
        temp = read_coop_temp()
        if temp > 85:
            start_fan()
        sleep(60)

# Scripts are exception, systems are norm
```

---

### 8) Why This Distinction Matters Early (Line ~150)

**Context:** Systems introduce long-lived state, timing, repetition, failure handling, recovery.

```python
# Script: processes one file and exits
def process_file():
    data = read_file("data.csv")
    process(data)
    write_output("output.json")
# Exits

# System: monitors continuously
def battery_monitor():
    voltage = None  # Long-lived state
    while True:
        voltage = read_sensor()  # Timing matters
        if voltage is None:      # Failure handling
            use_last_known()     # Recovery
            alert("Sensor offline")
        if voltage < 12.1:
            start_generator()
        sleep(5)  # Repetition

# Systems require different thinking:
# State management, timing, error handling
# Chapter 0.7: time matters
# Chapter 0.10: failure is normal
```

---

### 9) The Runtime World (Line ~165)

**Context:** Python creates a runtime world with variables, functions, modules, control flow; exists only while program runs.

```python
# When Python executes your program, it creates a runtime world

# Runtime world contains:
voltage = 12.1              # Variables and their current values
generator_state = 'off'     # Variables

def read_voltage():         # Defined functions
    return read_sensor()

def start_generator():       # Defined functions
    set_relay(ON)

import time                 # Imported modules
import json

# Control flow position (where Python is executing)
# Temporary execution contexts

# Runtime world exists only while program runs
# When execution stops, world disappears

# Homestead: battery monitor runtime world has:
# voltage = 12.1, generator_state = 'off'
# Functions: read_voltage(), start_generator()
# When Python stops, world disappears - unless state saved to files
```

---

### 10) State Lives in Memory (Line ~184)

**Context:** Variables stored in memory; when Python exits, memory cleared unless explicitly written to disk.

```python
# When you assign a variable, Python stores value in memory
voltage = 12.1  # Stored in memory, associated with name "voltage"

# Association exists only in runtime world
# When Python exits:
# - Memory is cleared
# - Names disappear
# - State is gone

# Unless you explicitly write state to disk
voltage = 12.1
write_to_file("voltage.txt", voltage)  # Explicitly write to disk

# Homestead: voltage = 12.1 creates association in memory
# When Python stops, association is gone
# If you want voltage to survive restarts, write to file or database
# Memory is temporary, files are permanent
```

---

### 11) Time Passes in the Runtime World (Line ~199)

**Context:** Python does not execute instantaneously; time passes, inputs arrive later, sensors change.

```python
# Python does not execute instantaneously
# Time passes between instructions

voltage = read_sensor()  # Moment 1: reading arrives
sleep(5)                 # Time passes
voltage = read_sensor()  # Moment 2: new reading arrives, value changes

# Input may arrive later
voltage = read_sensor()  # May arrive at unpredictable moment

# Sensors may change
coop_temp = read_dht22()  # 75°F
sleep(60)                 # One minute passes
coop_temp = read_dht22()  # 78°F (changed)

# External systems may change
# Program reacts to changing world by updating state
# Time passes, state changes, program adapts
```

---

### 12) Python Files and Execution (Line ~213)

**Context:** Python file is container for instructions; Python reads, parses, executes them in order.

```python
# Python file is a container for instructions
# battery_monitor.py contains instructions

# File does not execute itself
# To create program, tell Python to execute the file

# Python:
# 1. Reads the file
# 2. Parses the instructions
# 3. Executes them in order

# File itself does nothing
# .py extension tells Python "this is Python code"
# File name is for humans: battery_monitor.py, coop_controller.py

# Homestead: battery_monitor.py sits on disk - static text
# Run: python battery_monitor.py
# Python reads it, parses it, executes it
# File is recipe, Python is chef, program is meal being prepared
```

---

### 13) Definition Time vs Execution Time (Line ~232)

**Context:** Defining a function stores instructions for later; calling it executes the body.

```python
# When Python encounters function definition, it executes that instruction immediately
def read_voltage():  # Definition time: Python creates function object
    return 12.1      # Body not executed yet

def check_fence():   # Definition time: Python creates function object
    return 4.2       # Body not executed yet

# Defining function does not run it
# It stores instructions for later

# Only when you call it does function body execute
voltage = read_voltage()  # Execution time: function body runs
fence_voltage = check_fence()  # Execution time: function body runs

# Definition is separate from execution

# If you call before defining, Python fails
read_voltage()  # Error: function doesn't exist yet
def read_voltage():
    return 12.1

# Order matters: define first, call later
```

---

### 14) The `if __name__ == "__main__":` Pattern (Line ~253)

**Context:** Allows code to run only when executed directly, not when imported.

```python
# File can be used in two ways:
# - Executed directly: python battery_monitor.py
# - Imported by other files: import battery_monitor

# When executed directly, Python sets __name__ to "__main__"
# When imported, __name__ is set to module's name

# Pattern allows code that:
# - Runs only when executed directly
# - Does not run when imported

def read_voltage():
    return read_sensor()

def start_generator():
    set_relay(ON)

if __name__ == "__main__":  # Only runs when executed directly
    main()  # Does not run when imported

# Without this pattern, importing file would trigger execution
# Side effects would happen unexpectedly

# Homestead: battery_monitor.py can have main() that runs only when
# file is entry point
# When imported by test file, main() doesn't run
# __main__ means "start the system here"
```

---

### 15) Interactive Mode vs Files (Line ~273)

**Context:** Interactive mode is for experimentation; files are for systems.

```python
# Interactive mode: type line, Python executes immediately, see result
# Useful for: experimentation, quick checks, learning syntax

# Interactive mode is not how systems are built
# Files are programs
# Interactive mode is scratchpad

# Professionals use both intentionally

# Homestead: interactive mode lets you test read_voltage() quickly
# Can poke at ESP32 over serial and run snippets
# But battery monitor, coop controller live in files
# Interactive mode is for exploration, files are for systems
```

---

### 16) Errors Happen at Execution Time (Line ~295)

**Context:** Two categories: syntax errors (can't understand instruction) and runtime errors (execution failed).

```python
# Two broad categories:

# Syntax errors: Python cannot understand the instruction
volatge = read_sensor()  # Syntax error: typo
# Python can't parse the file

# Runtime errors: Python understood instruction, but execution failed
voltage = read_sensor()  # Runtime error: sensor times out
# Python understood instruction, but execution failed

# Python errors report facts about reality:
# "This instruction doesn't exist" (syntax error)
# "This state is invalid" (runtime error)
# "This assumption failed" (runtime error)

# Errors are part of execution, not exceptions to it

# Homestead: voltage = read_sensor() might raise runtime error if sensor times out
# coop_temp = read_dht22() fails if DHT22 disconnected
# ESP32 calling wifi.connect() fails if router down
# Python understood instruction, but execution failed - runtime error
```

---

### 17) Programs as Living Systems (Line ~316)

**Context:** Programs start, initialize state, react to inputs, change state, produce outputs, repeat, eventually stop.

```python
# Programs as living systems:
# - Start
# - Initialize state
# - React to inputs
# - Change state
# - Produce outputs
# - Repeat
# - Eventually stop

def battery_monitor():
    # Start
    voltage = None           # Initialize state
    generator_state = 'off'  # Initialize state
    
    while True:  # Repeat
        voltage = read_sensor()  # React to inputs
        if voltage < 12.1:      # Change state
            start_generator()    # Produce outputs
            generator_state = 'on'
        sleep(5)  # Repeat

# Loops keep systems alive
# Program that runs "forever" is loop that does not exit
# Program that "waits" is loop while checking conditions
# Program that "reacts" is loop and branches

# Homestead: battery monitor starts, initializes state, enters loop,
# reads voltage, compares to threshold, starts generator if needed,
# waits 5 seconds, repeats
# Alive until you stop it

# Contrast: script that converts CSV to JSON starts, reads file,
# writes output, exits - dead
# Battery monitor starts, loops, reacts, adapts - alive until stopped
```

---

### Reflection: Program Design Questions (Line ~342)

**Context:** Framework for thinking about program design.

```python
# Think about Python program you might write:

# Does it run once or continuously?
# Script: runs once
def convert_csv():
    # Runs once, exits
    pass

# System: runs continuously
def battery_monitor():
    while True:  # Continuously
        pass

# What state exists while it runs?
voltage = None
generator_state = 'off'
last_start_time = None

# What changes that state?
voltage = read_sensor()  # Changes voltage
start_generator()        # Changes generator_state

# What inputs influence behavior?
voltage = read_sensor()      # Input: sensor reading
network_status = check_wifi()  # Input: network status

# What happens when execution stops?
# State in memory is lost
# Unless explicitly written to files
write_to_file("state.json", {"voltage": voltage})

# Answering those questions is program design
```

---

## Chapter 1.02: State and Variables

### 1) Variables Are Names, Not Boxes (Line ~12)

**Context:** Variable is a name that refers to a value, not a container that holds data.

```python
# Variable is not a container that holds data
# Variable is a name that refers to a value

voltage = 12.1
# Not "putting 12.1 into a box called voltage"
# Saying: "The name voltage now refers to the value 12.1"

# Names can change what they refer to
voltage = 12.1  # Name refers to 12.1
voltage = 12.0  # Name now refers to 12.0

# Values exist independently of names
# Value 12.1 exists in memory whether you call it voltage or last_reading
# Name is your label, not a box

# Homestead: voltage, coop_temp, fence_voltage - each is a name
# Value 12.1 exists whether you call it voltage or last_reading
```

---

### 2) Values Exist Independently of Names (Line ~33)

**Context:** Values are objects in memory; names are labels attached to those objects.

```python
# Values exist independently of names
# Names are labels attached to values

# Attach multiple names to same value
voltage = 12.1
last_reading = voltage  # Two names, one value
# voltage refers to 12.1
# last_reading also refers to 12.1

# Change which value a name refers to
voltage = 12.0  # voltage now refers to 12.0
# last_reading still refers to 12.1

# Remove name without destroying value (if something else still refers to it)
del voltage  # Remove name "voltage"
# Value 12.1 still exists if last_reading refers to it

# Homestead: voltage = 12.1, last_reading = voltage
# Two names, one value
# If function returns 12.1 and you assign to both current_voltage and display_value
# Same value, two names - value exists once, names point at it
```

---

### 3) Assignment Changes References, Not Values (Line ~47)

**Context:** Assignment means "make this name refer to this value"; it does not modify or copy the value.

```python
# Assignment: "Make this name refer to this value"
voltage = 12.1
last_reading = voltage

# At this moment:
# voltage refers to 12.1
# last_reading also refers to 12.1
# One value, two names

# Now:
voltage = 12.0

# What changed?
# voltage now refers to 12.0
# last_reading still refers to 12.1
# Nothing was copied, nothing was mutated
# Name was simply reattached

# Homestead: coop_temp = 75, last_temp = coop_temp
coop_temp = 75
last_temp = coop_temp  # Both refer to 75
coop_temp = 78         # coop_temp now refers to 78
# last_temp still refers to 75

# Homestead: fence_voltage = 4.2, old_fence = fence_voltage
fence_voltage = 4.2
old_fence = fence_voltage  # Both refer to 4.2
fence_voltage = 0.0        # fence_voltage now refers to 0.0 (fence down)
# old_fence still refers to 4.2

# One value, two names; reassignment reattaches name, does not mutate value
```

---

### 4) State Is Names Over Time (Line ~84)

**Context:** State is which names exist and what values they refer to at a specific moment.

```python
# State is not a special thing
# State is: which names exist, what values they refer to, at specific moment

# Moment 1:
generator_state = "off"  # Name refers to "off"

# Moment 2:
generator_state = "running"  # Name now refers to "running"

# Program did not "flip a state flag"
# It reassigned a name

# Homestead: fan_on = False then fan_on = True
fan_on = False  # Moment 1
fan_on = True   # Moment 2 - name reassigned

# Homestead: fence_energized = True then fence_energized = False
fence_energized = True   # Moment 1
fence_energized = False  # Moment 2 - name reassigned

# Homestead: solar_producing = True then solar_producing = False when sun sets
solar_producing = True   # Moment 1
solar_producing = False  # Moment 2 - name reassigned

# Each is name reassigned over time
# Timeline creates meaning
```

---

### 5) Programs Remember by Reassigning Names (Line ~108)

**Context:** Programs remember the past by reassigning names; no memory slot for "earlier."

```python
# Programs remember the past by reassigning names
# No memory slot that says "earlier"
# Only: what name refers to now vs what it referred to before

# To remember last coop temp, must have name for it
coop_temp = 75
last_coop_temp = coop_temp  # Remember by assigning name

coop_temp = 78  # coop_temp changes
# last_coop_temp still holds old value (75) - until you explicitly reassign

# Programs remember only what names refer to
# Execution order matters because reassignment happens in order

coop_temp = 75
last_coop_temp = coop_temp  # Remember before it changes
coop_temp = 78             # Now coop_temp is 78, last_coop_temp is 75

# If you want to update memory:
coop_temp = 78
last_coop_temp = coop_temp  # Reassign to remember new value
```

---

### 6) Variable Creation vs Update Is the Same Operation (Line ~122)

**Context:** Python doesn't distinguish between creating and updating a variable; same operation.

```python
# Python does not distinguish between creating and updating

voltage = 12.1
# Means: create name if it doesn't exist, otherwise update what it refers to

# Same operation for:
coop_temp = 75        # Create or update
solar_watts = 1200    # Create or update
fence_voltage = 4.2   # Create or update

# Simplicity is powerful, but must track meaning yourself

# If you accidentally reuse name for different purpose, Python won't stop you
voltage = 12.1        # voltage refers to battery voltage
# ... later ...
voltage = 78          # You meant coop_temp = 78
# Old voltage is gone - failure mode: sloppy reuse
# Python allows it, you must not
```

---

### 7) Naming Is How You Preserve Meaning (Line ~141)

**Context:** Python doesn't know what names mean; you do. Names encode intent.

```python
# Python does not know what voltage means
# You do
# Name is your only chance to encode intent

# Compare:
v = 12.1
# vs
last_voltage_reading = 12.1

# Both valid Python, both behave identically
# Only one communicates meaning

# Same idea:
t = 75
# vs
last_coop_temp = 75

x = 4.2
# vs
fence_voltage_kv = 4.2

# Python does not enforce good names
# Poor naming does not cause syntax errors
# It causes reasoning errors, which are worse
```

---

### 8) Names Should Reflect Role, Not Type (Line ~163)

**Context:** Encode role in names, not type; types can change, roles should not.

```python
# Common beginner mistake: encode type into names
voltage_float = 12.1      # Fragile - type can change
string_status = "off"     # Fragile - type can change
coop_temp_int = 75        # Fragile - type can change

# Types can change, roles should not
# Better: encode role, not type
voltage = 12.1            # Role: voltage reading
generator_status = "off"  # Role: generator status
coop_temp = 75            # Role: coop temperature
fence_energized = True    # Role: fence energized state

# Role stays consistent even if representation changes later
# If voltage becomes int instead of float, name still makes sense
# If generator_status becomes enum instead of string, name still makes sense
```

---

### 9) Variables Are Temporary by Default (Line ~186)

**Context:** Variables live in memory; when program ends, they disappear unless explicitly persisted.

```python
# Variables live in memory
voltage = 12.1
generator_state = "off"

# When program ends:
# Variables disappear
# State is lost

# This is design decision, not flaw
# Persistence requires explicit action:

# Writing to files
voltage = 12.1
write_to_file("voltage.txt", voltage)

# Writing to databases
save_to_database("voltage", voltage)

# Sending over network
send_to_mqtt("voltage", voltage)

# Homestead: battery monitor stops
# voltage, generator_state - gone

# ESP32 reboots
# fence_voltage, is_energized - gone

# Coop controller exits
# coop_temp, fan_on - gone

# Unless you wrote state somewhere, it's lost
# Runtime state lives in memory
# Persistent state lives on disk or over network
```

---

### 10) Memory Is Not the Problem—Meaning Is (Line ~204)

**Context:** Most confusion about "memory" is actually confusion about meaning drift.

```python
# Bug is usually not "Python lost my data"
# It's "This name stopped referring to what I thought it did"

# Meaning drift:
voltage = 12.1        # voltage refers to battery voltage
# ... later ...
voltage = 1200        # You meant solar_watts = 1200
# Later code assumes voltage is battery voltage - bug!

# Or:
temp = 75             # You think temp is temperature
# Actually temp holds humidity - meaning drift

# Bug is not memory - it's that name lied about meaning
# Track names and assignments carefully
# Memory becomes boring - and boring is good
```

---

### 11) Variables Enable Controlled Change (Line ~217)

**Context:** Variables are control points; every reassignment is a decision about what changes and when.

```python
# Variables are not just storage
# They are control points

# Every reassignment is a decision:
# - What changes
# - When it changes
# - What future logic will see

fan_on = True  # Reassignment is decision
# Future logic that checks fan_on will see True and act accordingly

fence_energized = False  # Reassignment is decision
# Future logic sees False and maybe alerts

generator_state = "running"  # Reassignment is decision
# Next iteration of loop sees that state and decides

# Programs don't "do things"
# They evolve state
# Variables are how that evolution is expressed

# Homestead: fan_on = True
# That reassignment is decision
# Future logic checks fan_on, sees True, acts accordingly
```

---

### Reflection: Variable Design Questions (Line ~233)

**Context:** Framework for thinking about variable design in a system.

```python
# Think about real system - battery monitor, coop controller, etc.

# What names would I give important pieces of state?
voltage = None
generator_state = "off"
last_start_time = None
coop_temp = None
fan_on = False

# Which values change over time?
voltage = 12.1        # Changes: 12.1 → 12.0 → 11.9
generator_state = "off"  # Changes: "off" → "running" → "off"
coop_temp = 75        # Changes: 75 → 78 → 72

# Which values should never change?
LOW_VOLTAGE_THRESHOLD = 12.1  # Should not change
MAX_TEMP = 85                 # Should not change

# Where could meaning drift if names were sloppy?
voltage = 12.1        # Good name
v = 12.1              # Sloppy - could drift

temp = 75             # Sloppy - is it temperature or temporary?
coop_temp = 75        # Clear - no drift

# What would break if I reused name for something different?
voltage = 12.1        # Battery voltage
# ... later ...
voltage = 1200        # You meant solar_watts
# Later code assumes voltage is battery voltage - breaks!

# If you can answer those, you're thinking at right level
```

---

## Chapter 1.03: Conditions and Branching

### 1) What a Condition Really Is (Again, Slower) (Line ~19)

**Context:** A condition is an expression that evaluates to a boolean—True or False only.

```python
# Condition is expression that evaluates to boolean value
# Boolean: True or False - no in-between

voltage < 12.1        # → True or False
coop_temp > 85        # → True or False
fence_voltage < 2.0   # → True or False

# No "maybe," no "probably," no "close enough"
# Every condition collapses reality into one of two values
```

---

### 2) Conditions Are Evaluated At a Moment in Time (Line ~39)

**Context:** Condition is evaluated at a specific line using current state; if state changes, result can change.

```python
# Condition is not timeless
# Evaluated at specific line, using current state, current variable values

voltage = 12.2
if voltage < 12.1:  # False at this moment
    start_generator()  # Skipped

# Five seconds later - state changed
voltage = 12.0
if voltage < 12.1:  # True at this moment
    start_generator()  # Executed

# Same code, different state, different result
# Homestead: battery monitor checks voltage < 12.1 every 5 seconds
# First check: voltage = 12.2, condition False, generator stays off
# Five seconds later: voltage = 12.0, condition True, generator starts
```

---

### 3) The if Statement Is a Fork (Line ~57)

**Context:** Python evaluates condition step by step: look up name, get value, compare, produce True/False, execute or skip block.

```python
# if creates fork in execution
if voltage < 12.1:
    start_generator()

# Or:
if coop_temp > 85:
    start_fan()

if fence_voltage < 2.0:
    alert_fence_down()

# Python does:
# 1. Look up name (voltage, coop_temp, fence_voltage)
# 2. Retrieve value
# 3. Compare to threshold (12.1, 85, 2.0)
# 4. Produce True or False
# 5. If True, execute indented block
# 6. If False, skip it
```

---

### 4) Two Paths Always Exist (Line ~84)

**Context:** Every if has True path and False path; "nothing happens" is still a path—bugs often live there.

```python
# Every if has two paths: True path and False path
if voltage < 12.1:
    start_generator()  # True path
# False path: voltage >= 12.1 → nothing happens (path still exists)

if coop_temp > 85:
    start_fan()  # True path
# False path: coop_temp <= 85 → nothing happens

# Many bugs live in False path
# Generator doesn't start when it should? Check False path
# Fan doesn't run? Check False path
```

---

### 5) Skipped Code Is Still Executed Logic (Line ~96)

**Context:** When Python skips a block, it chooses not to execute it; reason about skipped paths as carefully as executed ones.

```python
# When Python skips block, it intentionally chooses not to execute it
# Not "ignoring" - choosing not to execute because condition was False

if voltage < 12.1:
    start_generator()  # Skipped when voltage >= 12.1
# Python chose not to execute because voltage >= 12.1

if coop_temp > 85:
    start_fan()  # Skipped when coop_temp <= 85

# Must reason about skipped paths:
# What happens when generator doesn't start?
# What happens when fan doesn't run?
# Those are skipped paths - they matter
```

---

### 6) Conditions Depend Entirely on State (Line ~107)

**Context:** Condition means nothing without state; ask when/where value came from, could it be None or stale.

```python
# This condition means nothing without state
if voltage < 12.1:
    start_generator()

# Questions to ask automatically:
# When was voltage last updated?
# Where did it come from? (sensor, ESP32, MQTT?)
# Is it guaranteed to be a number?
# Could it be missing? (sensor offline?)
# Could it be stale? (last reading 5 minutes ago?)

# Python will evaluate voltage < 12.1 even if:
# voltage is None (error)
# voltage is from yesterday (stale)
# sensor is offline (missing)
# Python assumes you already validated - Chapter 1.2: state lives in names
```

---

### 7) Comparison Operators Are Mechanical (Line ~126)

**Context:** Comparison operators take two values and produce True or False—mechanical, no interpretation.

```python
# Comparison operators: == != < > <= >=
# Take two values, produce True or False

voltage < 12.1        # Compares voltage to 12.1 → True or False
coop_temp > 85        # Compares coop_temp to 85 → True or False
fence_voltage == 4.2   # Compares fence_voltage to 4.2 → True or False

# Mechanical, no interpretation
# Not flexible, not forgiving
```

---

### 8) Equality Is Exact (This Matters) (Line ~148)

**Context:** == means exact equality; for sensor data, use ranges instead.

```python
# voltage == 12.1 means exact equality
# Not "close enough," not "about," not "within tolerance"
# Exact

# For sensor data, often wrong check
# DHT22: 75.0 vs 75.1 - equal? Probably not
# Voltage: 12.1 vs 12.09 - equal? Probably not

# Use ranges instead
if voltage < 12.1:
    start_generator()
if coop_temp > 85:
    start_fan()
if fence_voltage < 2.0:
    alert_fence_down()
```

---

### 9) Logical Operators Combine Booleans (Line ~166)

**Context:** and (all True), or (at least one True), not (invert); work on booleans only.

```python
# and → all must be True
# or → at least one must be True
# not → invert the boolean

if voltage < 12.1 and generator_state == "off":
    start_generator()
# voltage < 12.1 → True or False
# generator_state == "off" → True or False
# True and True → True
# If either False, whole expression False

if coop_temp > 85 and fan_on == False:
    start_fan()

if fence_voltage < 2.0 or is_energized == False:
    alert()
```

---

### 10) Short-Circuiting Is Still Order (Line ~191)

**Context:** Python evaluates left to right; and stops at first False, or stops at first True.

```python
# Python evaluates logical expressions left to right
# and: stop at first False
# or: stop at first True

# Safe order: check connection first
if esp32_connected and coop_temp > 85:
    start_fan()
# If esp32_connected is False, Python never checks coop_temp
# Safe - no error if ESP32 offline, coop_temp might be None

# Dangerous order: check value first
if coop_temp > 85 and esp32_connected:
    start_fan()
# If esp32_connected False and coop_temp is None - might error
# Order protects you or hides bugs - choose deliberately
```

---

### 11) Order Can Change Meaning (Line ~203)

**Context:** Condition order changes which expressions run; can be intentional or hide bugs.

```python
# These are not the same:
if sensor_online and voltage < 12.1:
    start_generator()
# If sensor_online False, Python never evaluates voltage < 12.1

if voltage < 12.1 and sensor_online:
    start_generator()
# If sensor_online False, still evaluates voltage < 12.1 first

# Same idea:
if esp32_connected and coop_temp > 85:  # Safe: check connection first
if coop_temp > 85 and esp32_connected:  # Might error if coop_temp is None

# Order matters - choose deliberately
```

---

### 12) else Makes the Second Path Visible (Line ~218)

**Context:** else forces you to think about both paths; explicit structure reduces cognitive load.

```python
# else makes False path visible
if voltage < 12.1:
    start_generator()
else:
    log_normal()

if coop_temp > 85:
    start_fan()
else:
    log_normal_temp()

if fence_voltage < 2.0:
    alert_fence_down()
else:
    log_fence_ok()

# Forces you to answer: what when voltage >= 12.1? coop_temp <= 85?
# Without else, False path is "do nothing" - but is that what you want?
# With else, you must decide
```

---

### 13) elif Creates One Decision Tree (Line ~234)

**Context:** elif means "only check this if everything above failed"; exactly one branch executes.

```python
# elif: only check this if everything above failed
if voltage < 12.1:
    start_generator()
elif voltage > 15.0:
    alert_high_voltage()
else:
    log_normal()

# Exactly one branch executes
# Voltage can't be both < 12.1 and > 15.0
# One decision tree

if coop_temp > 85:
    start_fan()
elif coop_temp < 32:
    alert_freezing()
else:
    log_normal_temp()

if fence_voltage < 2.0:
    alert_fence_down()
elif fence_voltage > 5.0:
    alert_overvoltage()
else:
    log_fence_ok()
```

---

### 14) elif Is Not Nesting (Line ~254)

**Context:** if/elif is single decision tree; if/else with nested if is two separate decisions.

```python
# Single decision tree (one condition, three paths)
if voltage < 12.1:
    start_generator()
elif voltage > 15.0:
    alert_high_voltage()
else:
    log_normal()
# One condition: voltage. Three paths: low, high, normal

# Nested branching (two separate decisions)
if voltage < 12.1:
    start_generator()
else:
    if voltage > 15.0:  # Second decision inside else
        alert_high_voltage()
    else:
        log_normal()
# First condition: voltage. If False, then check voltage again
# They behave differently under complexity - nested multiplies paths faster
```

---

### 15) When to Use elif (Line ~272)

**Context:** Use elif when conditions are mutually exclusive; only one path should run.

```python
# Use elif when conditions are mutually exclusive
# Voltage states: Low, Normal, High - only one true at a time
if voltage < 12.1:
    handle_low()
elif voltage > 15.0:
    handle_high()
else:
    handle_normal()

# Same: coop temp (too hot, normal, freezing)
# Fence voltage (low, normal, overvoltage)
# Solar production (none, low, high)
```

---

### 16) When to Use Nested if (Line ~284)

**Context:** Use nested if when conditions are independent; multiple actions may be required.

```python
# Use nested if when conditions are independent
# Multiple conditions can be true simultaneously

# Voltage low AND generator off AND cooldown complete
if voltage < 12.1:
    if generator_state == "off":
        if cooldown_complete:
            start_generator()

# Coop temp high AND fan off AND power available
if coop_temp > 85:
    if fan_on == False:
        if power_available:
            start_fan()

# Fence voltage low AND energizer on AND no fault
if fence_voltage < 2.0:
    if is_energized:
        if not fault_detected:
            alert_fence_down()
```

---

### 17) Branches Multiply Paths (Line ~298)

**Context:** One condition → two paths; two → four; three → eight; short code, large behavior space.

```python
# One condition → two paths
# Two conditions → four paths
# Three conditions → eight paths

# One line of code:
if voltage < 12.1 and generator_state == "off" and cooldown_complete:
    start_generator()

# Behavior space: voltage (low/normal), generator_state (on/off), cooldown (yes/no)
# = 2 × 2 × 2 = 8 combinations
# Short code, large behavior space
```

---

### 18) Most Bugs Live in Rare Paths (Line ~308)

**Context:** Common paths get tested; rare paths rot—name them or test them.

```python
# Rare paths: sensor offline, first startup, boundary values, timing overlaps
# Conditions create these paths - easy to forget

# Name them:
if should_start_generator():  # Path is explicit
    start_generator()

# Or test them:
# What happens when ESP32 offline?
# What happens when voltage exactly 12.1?
# What happens when coop_temp exactly 85?

# Test rare paths or they'll surprise you
```

---

### 19) Conditions Should Observe, Not Act (Line ~322)

**Context:** Evaluate condition should not change state; observe, decide, act—always in that order.

```python
# Bad: condition changes state
if get_voltage_and_start_generator() < 12.1:  # Don't mix observe and act
    pass

# Good: observe, decide, act
voltage = get_voltage()  # Observe
if voltage < 12.1:       # Decide
    start_generator()    # Act

# Same pattern:
coop_temp = read_coop_temp()  # Observe
if coop_temp > 85:            # Decide
    start_fan()                # Act

fence_voltage = check_fence()  # Observe
if fence_voltage < 2.0:        # Decide
    alert_fence_down()          # Act

# Always: observe, decide, act
```

---

### 20) Naming Conditions Preserves Meaning (Line ~340)

**Context:** Name carries intent; function contains details, condition name abstracts complexity.

```python
# Works but doesn't read:
if voltage < 12.1 and generator_state == "off" and cooldown_complete:
    start_generator()

# Reads:
if should_start_generator():
    start_generator()

# Name carries intent
# Logic lives in function: voltage < 12.1 and generator_state == "off" and cooldown_complete
# Condition name abstracts that complexity

if should_start_fan():
    start_fan()

if should_alert_fence():
    alert_fence_down()
```

---

### 21) Conditions Are Contracts (Line ~358)

**Context:** Condition is a promise; if it lies, path misfires.

```python
# Condition is promise: "If this is True, program may take this path"
# If condition lies, path misfires

# should_start_generator() returns True but voltage is 12.5 - condition lied
# should_start_fan() returns True but fan already on - condition lied

# Truthfulness matters
# If True, path is valid
# If False, path is invalid
# If they lie, bugs happen
```

---

### 23) Debugging Conditions Is Tracing State (Line ~378)

**Context:** When condition behaves unexpectedly, print values, inspect state, verify assumptions.

```python
# When condition behaves unexpectedly:
# 1. Print the values
print(f"voltage={voltage}, coop_temp={coop_temp}")  # What are they actually?

# 2. Inspect the state
# When was voltage last updated? Where did it come from?

# 3. Verify assumptions
# Is voltage guaranteed to be a number? Could coop_temp be None?

# Bug is almost never in if
# if voltage < 12.1: is correct
# Bug is in what feeds it:
# voltage is None (missing)
# voltage is stale (from yesterday)
# voltage is wrong (wrong sensor)

# Debug conditions by debugging state
```

---

### Reflection: Condition Analysis (Line ~394)

**Context:** Framework for analyzing conditions in a system.

```python
# What conditions exist?
# voltage < 12.1, coop_temp > 85, fence_voltage < 2.0

# What are the rare paths?
# ESP32 offline, sensor timeout, boundary values (voltage exactly 12.1), first startup

# Which have I never tested?
# What happens when voltage exactly 12.1? coop_temp exactly 85?

# Which depend on timing?
# Solar production changes, coop temp rises slowly, fence voltage drops gradually

# Which conditions observe vs act?
# Are any conditions changing state? (They shouldn't.)

voltage = get_voltage()  # Observe
if voltage < 12.1:       # Decide (observe only)
    start_generator()    # Act
```

---

## Chapter 1.04: Loops and Repetition

### 1) Why Loops Exist at All (Line ~19)

**Context:** Loops let you describe when to keep going and when to stop instead of writing the same instructions repeatedly.

```python
# Don't: predict how many times, write same instructions over and over
# Do: describe when to keep going, when to stop, what changes each time

# Homestead: don't write "check voltage 1000 times"
# Write: repeat until voltage rises
while voltage < 12.1:
    check_voltage()
    voltage = read_voltage()  # state change
    time.sleep(5)

# Same: repeat until temp drops
while coop_temp > 85:
    check_temp()
    coop_temp = read_coop_temp()
    time.sleep(60)
```

---

### 2) The Three Required Parts of Every Loop (Line ~39)

**Context:** Every loop needs a starting state, a repetition rule, and a state change that eventually ends repetition.

```python
# 1. Starting state
voltage = 12.0

# 2. Repetition rule (condition)
# 3. State change that ends repetition
while voltage < 12.1:
    voltage = read_sensor()  # state change
    time.sleep(1)

# Missing state change → loop never ends (structural failure)
# while voltage < 12.1:
#     check_voltage()  # voltage never updated - infinite loop
```

---

### 3) The while Loop (Line ~59)

**Context:** while repeats as long as the condition is True; Python evaluates condition, runs block, then re-evaluates.

```python
while voltage < 12.1:
    check_voltage()

# Python: 1) Evaluate voltage < 12.1
#         2) If True, execute block
#         3) Return to step 1
#         4) Stop when condition becomes False

while coop_temp > 85:
    check_temp()

while fence_voltage < 2.0:
    check_fence()
```

---

### 4) while Is About State, Not Counting (Line ~79)

**Context:** while cares about current state and condition, not iteration count; ideal for monitoring and waiting for change.

```python
# You don't know how many times it will run
# Voltage might rise in 5 minutes or 5 hours
while voltage < 12.1:
    check_voltage()
    voltage = read_voltage()
    time.sleep(5)

# Loop waits until state changes
# Ideal: monitoring, waiting for change, reacting to environment
```

---

### 5) Infinite Loops Are Not a Bug (By Default) (Line ~95)

**Context:** while True: never stops on its own; most real systems (thermostats, battery monitors, coop controllers) are intended to run forever.

```python
while True:
    # ... main loop body

# Not a mistake - design choice
# Thermostats, battery monitors, coop controllers,
# poultry net monitors, solar loggers, ESP32 nodes,
# network listeners, embedded controllers
# The loop is the system
```

---

### 6) while True: Is the Heartbeat of Living Programs (Line ~119)

**Context:** Continuous system pattern: read_inputs, decide, act, wait.

```python
while True:
    read_inputs()
    decide()
    act()
    wait()

# Homestead:
while True:
    voltage = read_voltage()
    if voltage < 12.1:
        start_generator()
    time.sleep(5)

# Or coop controller:
while True:
    coop_temp = read_coop_temp()
    if coop_temp > 85:
        start_fan()
    time.sleep(60)
```

---

### 7) Without Waiting, Loops Become Dangerous (Line ~137)

**Context:** A loop without sleep runs as fast as the CPU—high CPU, power draw, flooded logs, overloaded sensors.

```python
# BAD: no sleep
while True:
    voltage = read_voltage()
    handle_voltage(voltage)
# Runs thousands of times per second
# Floods logs, drains battery, overheats ESP32
# DHT22 needs time between reads
```

---

### 8) time.sleep() Is How Python Waits (Line ~155)

**Context:** time.sleep(5) pauses execution for 5 seconds; waiting is synchronization with reality.

```python
import time

time.sleep(5)  # Pause 5 seconds, then continue

# Sensors update every few seconds
# Physical systems respond over minutes
# time.sleep() matches Python's speed to reality's speed
```

---

### 9) Sleeping Is Part of Correctness (Line ~169)

**Context:** In real systems, a loop that never sleeps is usually wrong; sleep prevents tight loops and stabilizes behavior.

```python
# Correct: sleep in loop
while True:
    voltage = read_voltage()
    handle_voltage(voltage)
    time.sleep(5)  # Part of correctness

# Prevents tight loops, reduces noise, stabilizes behavior
```

---

### 10) The Classic Monitoring Loop (Line ~183)

**Context:** Read, decide, act, wait—that’s a living system.

```python
while True:
    voltage = read_voltage()   # Read
    handle_voltage(voltage)   # Decide (inside handle_voltage) + Act
    time.sleep(5)             # Wait

# Read. Decide. Act. Wait.
```

---

### 11) The for Loop: Repeat Over a Sequence (Line ~199)

**Context:** for repeats once per item in a sequence; sequence defines termination, no manual counter.

```python
for reading in readings:
    process(reading)

# Python: take first item, assign to reading, execute block,
#         move to next, stop when sequence ends

for reading in voltage_readings:
    process(reading)

for temp in coop_temp_history:
    analyze(temp)

# No condition required; no risk of infinite loop (sequence is finite)
```

---

### 12) for Loops Are About Structure, Not Time (Line ~219)

**Context:** Use for when you have a collection and want to process each item once; order matters.

```python
# Log entries, sensor history, files, lines, MQTT messages
for reading in voltage_readings:
    process(reading)

for temp in coop_temp_history:
    analyze(temp)

for line in open("solar_log.txt"):
    parse_line(line)
```

---

### 13) for Loops Terminate Automatically (Line ~233)

**Context:** for always terminates when the sequence ends; if it runs forever, the sequence is infinite by design.

```python
# for always terminates when sequence ends
for reading in readings:  # readings is finite
    process(reading)
# Loop ends when last item processed

# Safer by default than while for collections
```

---

### 14) Choosing Between while and for (Line ~241)

**Context:** Use while for state-dependent repetition and continuous systems; use for for collections and fixed iterations.

```python
# while: repetition depends on state, unknown iterations, continuous
while voltage < 12.1:
    voltage = read_voltage()
    time.sleep(5)

# for: have collection, process each item, iterations defined by data
for reading in voltage_readings:
    process(reading)

# Most programs use both
```

---

### 15) Loops and State Evolution (Line ~255)

**Context:** The loop condition is evaluated using current state; state must change inside the loop or it never ends or never runs again.

```python
# Condition uses current state, not initial state
voltage = 12.0
while voltage < 12.1:
    voltage = read_sensor()  # state must change here
    time.sleep(1)
# voltage evolves each iteration
```

---

### 16) A Correct while Loop Always Changes State (Line ~271)

**Context:** Starting state, repetition rule, and state change that ends repetition—all three present.

```python
voltage = 12.0  # Starting state

while voltage < 12.1:           # Repetition rule
    voltage = read_sensor()     # State change
    time.sleep(1)

# voltage goes 12.0 → 12.1 (or higher); condition becomes False; loop ends

coop_temp = 84
while coop_temp > 85:
    coop_temp = read_coop_temp()
    time.sleep(60)
```

---

### 17) A Broken while Loop Does Not (Line ~287)

**Context:** If state never changes inside the loop, the condition never changes and the loop never ends—structural error.

```python
# BROKEN: state never changes
while voltage < 12.1:
    log_voltage(voltage)  # voltage never updated

# voltage stays 12.0, condition stays True, loop never ends
# Structural error: missing state change
```

---

### 18) break: Exiting a Loop Early (Line ~303)

**Context:** break exits the loop immediately; use when a termination condition appears mid-loop (e.g. overvoltage, freezing).

```python
while True:
    voltage = read_voltage()
    if voltage > 15.0:   # Emergency: overvoltage
        break
    handle_voltage(voltage)
    time.sleep(5)

while True:
    coop_temp = read_coop_temp()
    if coop_temp < 32:  # Freezing
        break
    handle_temp(coop_temp)
    time.sleep(60)
```

---

### 19) continue: Skipping an Iteration (Line ~321)

**Context:** continue skips the rest of the current iteration and moves to the next; useful for ignoring invalid data.

```python
for reading in readings:
    if reading is None:
        continue
    process(reading)

for reading in voltage_readings:
    if reading is None:
        continue
    process(reading)

for temp in coop_temps:
    if temp < 0 or temp > 150:
        continue
    handle_temp(temp)
```

---

### 20) break and continue Are Control Tools (Line ~337)

**Context:** Use break and continue deliberately; overuse makes loops hard to reason about—prefer clear conditions and structure.

```python
# Use deliberately; prefer clear loop conditions and explicit structure
while True:
    voltage = read_voltage()
    if voltage > 15.0:
        break
    if voltage < 11.0:
        continue  # skip handling, retry next iteration
    handle_voltage(voltage)
    time.sleep(5)
```

---

### 21) Loops Create Temporal Behavior (Line ~347)

**Context:** Loops let programs observe repeatedly, react continuously, and adapt over time; without loops, run once then stop.

```python
# Without loop: runs once, stops
voltage = read_voltage()
if voltage < 12.1:
    start_generator()
# No monitoring, no adaptation

# With loop: runs continuously
while True:
    voltage = read_voltage()
    if voltage < 12.1:
        start_generator()
    time.sleep(5)
# Monitors continuously, adapts continuously
```

---

### 22) Nested Loops Multiply Complexity (Line ~361)

**Context:** A loop inside a loop creates more paths and state combinations; use carefully, extract inner loop to a function if it helps.

```python
# Valid but cognitively expensive
while True:
    for reading in recent_readings:
        process(reading)
    time.sleep(60)

# Outer × inner = many combinations
# Prefer clear structure; extract inner loop to function if it helps
```

---

### 23) Loops Do Not Replace Conditions (Line ~377)

**Context:** Loops repeat; conditions choose; together they create living systems.

```python
while True:
    if voltage < 12.1:
        start_generator()
    time.sleep(5)

# Loops provide time. Conditions provide choice.
# Repeat + branch = living system
```

---

### 24) Observation Should Not Act Inside Loops (Line ~393)

**Context:** Observe, decide, act, wait—same pattern; don’t mix observation and action in the condition.

```python
# Bad: condition does I/O and acts
while True:
    if get_voltage() < 12.1:
        start_generator()

# Better:
while True:
    voltage = get_voltage()   # Observe
    if voltage < 12.1:       # Decide
        start_generator()    # Act
    time.sleep(5)            # Wait
```

---

### 25) Loops Are Where Bugs Accumulate (Line ~415)

**Context:** Subtle bugs often appear after many iterations or under rare conditions; state accumulates, timing drifts.

```python
# Bugs appear: after many iterations, only after time, under rare conditions
# State accumulates; timing drifts; edge cases appear
# Loops amplify mistakes
```

---

### 26) Debugging Loops Means Watching State Over Time (Line ~427)

**Context:** Log state each iteration, print values, observe transitions; think temporally, not just single-step.

```python
# Log state each iteration
while True:
    voltage = read_voltage()
    print(f"voltage={voltage}")  # See what it actually is
    if voltage < 12.1:
        start_generator()
    time.sleep(5)

# Observe transitions: voltage 12.0 → 12.1
# "What happens once?" doesn't answer "What happens over time?"
```

---

### Reflection: Loop Analysis (Line ~443)

**Context:** Questions for any system: what loops exist, which run forever, what changes each iteration, what ends the loop.

```python
# What loops exist? Monitoring loops, processing loops
# Which run forever? while True: monitor voltage, coop, fence
# Which terminate? for reading in log_file: process(reading)
# How often? time.sleep(5), time.sleep(60)
# What changes each iteration? voltage, coop_temp, fence_voltage
# What state change ends the loop? voltage rises, temp drops
# What if state never changes? Infinite loop - structural failure
```

---

## Chapter 1.05: Functions as Named Behavior

### 1) Functions Do Not Change What Python Can Do (Line ~10)

**Context:** Functions organize existing capabilities into named units; they don’t add new capabilities.

```python
# Python can: execute instructions, change state, branch, repeat
# Functions organize existing capabilities - they don't add new ones

def read_voltage():
    return 12.1  # names "read sensor and return value"

def read_coop_temp():
    return 75    # names "read DHT22 and return temp"

def check_fence():
    return 4.2   # names "read fence sensor and return voltage"
```

---

### 2) Why Humans Need Functions (Line ~28)

**Context:** Without functions, code is repetitive and unclear; functions make intent readable and reusable.

```python
# Without functions: dht22.read_temp(), fan_relay.on(), dht22.read_temp(), fan_relay.on() repeatedly
# With functions: names that carry meaning, reusable, changeable in one place

def read_coop_temp():
    return dht22.read_temp()

def start_fan():
    fan_relay.on()

# read_coop_temp() represents "get coop temperature"
# start_fan() represents "start the fan"
```

---

### 3) Defining a Function with def (Line ~50)

**Context:** def tells Python: “here is a block of instructions, and its name is X”; it does not execute the block.

```python
def read_voltage():
    return 12.1

# def does not: read voltage, execute code, return a value
# def does: tell Python "here is a block named read_voltage"
```

---

### 4) Definition Is Not Execution (Line ~68)

**Context:** At def, Python stores the function and associates the name; nothing inside runs until the function is called.

```python
def read_voltage():
    return 12.1
# Nothing inside runs yet - Python stores function, moves on

# Must call it: voltage = read_voltage()
voltage = read_voltage()  # NOW it executes
```

---

### 5) Calling a Function Executes Its Behavior (Line ~84)

**Context:** Calling is an instruction like any other; Python looks up the function, runs it, and uses the return value.

```python
voltage = read_voltage()
# Python: 1) look up read_voltage, 2) execute body, 3) hit return, 4) assign value to voltage

coop_temp = read_coop_temp()
fence_voltage = check_fence()

# Order matters: read first, then check, then act
voltage = read_voltage()
if voltage < 12.1:
    start_generator()
```

---

### 6) Define Once, Call Many Times (Line ~104)

**Context:** Define a function once; call it in loops, conditions, multiple places, or modules.

```python
def read_voltage():
    return 12.1

# Call in loop:
while True:
    voltage = read_voltage()
    time.sleep(5)

# Call in condition:
if read_coop_temp() > 85:
    start_fan()

# Name stays stable; implementation can change (different sensor, different ESP32)
```

---

### 7) Functions Accept Input Through Parameters (Line ~126)

**Context:** Parameters are local names that exist only while the function runs; they receive values when the function is called.

```python
def check_threshold(voltage, threshold):
    return voltage < threshold

def is_temp_high(coop_temp, max_temp):
    return coop_temp > max_temp

def is_fence_low(fence_voltage, min_voltage):
    return fence_voltage < min_voltage

# check_threshold(12.0, 12.1) → voltage receives 12.0, threshold receives 12.1
# is_temp_high(86, 85) → coop_temp receives 86, max_temp receives 85
```

---

### 8) Arguments Are Passed at Call Time (Line ~146)

**Context:** At call time, parameters refer to the arguments; when the function ends, those names disappear.

```python
is_low = check_threshold(12.0, 12.1)
# Inside: voltage refers to 12.0, threshold refers to 12.1
# When function finishes: voltage, threshold gone; return value (True/False) survives

is_hot = is_temp_high(86, 85)
is_down = is_fence_low(1.9, 2.0)
```

---

### 9) Parameters Are Temporary State (Line ~166)

**Context:** Parameters exist only during execution; they can’t leak or collide with outside names.

```python
def check_threshold(voltage, threshold):
    return voltage < threshold
# voltage, threshold exist only while function runs
# Can't accidentally change outside state

# read_voltage() can't accidentally change coop_temp
# read_coop_temp() can't accidentally change fence_voltage
```

---

### 10) Functions Return Values with return (Line ~180)

**Context:** return ends execution and produces a value; the caller receives that value.

```python
def read_voltage():
    return 12.1

def read_coop_temp():
    return 75

def check_fence():
    return 4.2

# voltage = read_voltage() → read_voltage executes, hits return 12.1, voltage receives 12.1
```

---

### 11) A Function Without return Returns None (Line ~198)

**Context:** Functions without return produce None; that’s intentional, not an error.

```python
def log_voltage(voltage):
    print(voltage)

voltage = log_voltage(12.1)  # voltage is None, not 12.1
# Prints something, returns nothing - produces None
```

---

### 12) return vs print (This Is Non-Negotiable) (Line ~214)

**Context:** return produces data for logic; print displays for humans; confusing them breaks reuse and tests.

```python
# return: produces data, feeds logic, enables decisions
# print: displays information, observational, does not affect logic

# Bad: function prints instead of returns
def log_voltage(v):
    print(v)  # Can't do: if log_voltage(12.1) < 12.1  →  None < 12.1 error

# Good:
def read_voltage():
    return sensor.read()
```

---

### 13) Functions Should Usually Return Data (Line ~232)

**Context:** Unless the purpose is output (logging, UI), a function should return data for logic.

```python
# Observation produces data - return it
def read_voltage():
    return sensor.read()

def read_coop_temp():
    return dht22.read_temp()

# Action changes state - side effects, not return value
def start_generator():
    relay.on()  # returns None, changes relay state

def start_fan():
    fan_relay.on()
```

---

### 14) Default Parameters Add Flexibility (Line ~242)

**Context:** Default values allow simple calls and optional overrides for special cases.

```python
def check_threshold(voltage, threshold=12.1):
    return voltage < threshold

def is_temp_high(coop_temp, max_temp=85):
    return coop_temp > max_temp

def is_fence_low(fence_voltage, min_voltage=2.0):
    return fence_voltage < min_voltage

check_threshold(12.0)         # uses default 12.1
check_threshold(12.0, 12.5)   # overrides with 12.5

is_temp_high(86)    # uses 85
is_temp_high(86, 90)  # uses 90
```

---

### 15) Defaults Are Part of the Contract (Line ~262)

**Context:** Defaults encode expected behavior; changing them later is a breaking change.

```python
def check_threshold(voltage, threshold=12.1):
    return voltage < threshold
# threshold=12.1 means "12.1 is typical threshold"
# Changing to 12.0 breaks all code that relied on 12.1

# Defaults are promises - treat with care
```

---

### 16) Functions Create Isolation (Line ~274)

**Context:** Variables defined inside a function are local; they don’t affect or leak to outside names.

```python
def read_voltage():
    voltage = 12.1
    return voltage
# voltage inside does not affect voltage outside
# No leak, no accidental collision

def read_coop_temp():
    coop_temp = 75
    return coop_temp
```

---

### 17) Isolation Is How Systems Scale (Line ~288)

**Context:** Most code can’t see most state; behavior is contained; functions are the first boundary.

```python
# read_voltage() isolated from read_coop_temp()
# Each has its own scope

def read_voltage():
    return sensor.read()

def read_coop_temp():
    return dht22.read_temp()

# Functions → modules → processes - each level adds isolation
```

---

### 18) Functions Are Contracts (Line ~298)

**Context:** A function’s name is a promise; breaking that promise breaks trust.

```python
# Name tells reader what it does, sets expectations, defines responsibility
# read_voltage() promises to read voltage - not start generator
# Breaking that promise destroys trust
```

---

### 19) Names Must Match Behavior (Line ~308)

**Context:** If the name suggests observation (read, check) but the function acts (start, alert), it lies.

```python
# BAD: name promises observation, behavior performs action
def read_voltage():
    start_generator()  # lies - name says read, does start
    return 12.1

def read_coop_temp():
    start_fan()  # lies
    return 75

# Calling read_voltage() starts generator unexpectedly - unpredictable
```

---

### 20) Separate Observation from Action (Line ~322)

**Context:** Use separate functions: observe (read/return) vs act; then combine at a higher level.

```python
def read_voltage():
    return sensor.read()

def start_generator():
    relay.on()

def read_coop_temp():
    return dht22.read_temp()

def start_fan():
    fan_relay.on()

# Combine at higher level:
voltage = read_voltage()   # Observe
if voltage < 12.1:         # Decide
    start_generator()      # Act

coop_temp = read_coop_temp()
if coop_temp > 85:
    start_fan()
```

---

### 21) Functions Can Do One Thing or Orchestrate Many (Line ~350)

**Context:** Both one-operation and coordination functions are fine; the name must match the role.

```python
# One operation:
def read_voltage():
    return sensor.read()

# Orchestrate many:
def monitor_battery():
    while True:
        voltage = read_voltage()
        if voltage < 12.1:
            start_generator()
        time.sleep(5)

# read_voltage promises one operation; monitor_battery promises coordination
```

---

### 22) Docstrings Describe the Contract (Line ~362)

**Context:** Docstrings explain what the function does, what it returns, what inputs mean; they describe intent, not implementation.

```python
def read_voltage():
    """Read the battery voltage.

    Returns a float voltage, or None if the sensor is unavailable.
    """
    return sensor.read()

def read_coop_temp():
    """Read the coop temperature from DHT22 sensor.

    Returns a float temperature in Fahrenheit, or None if sensor is offline.
    """
    return dht22.read_temp()

def check_fence():
    """Check the electric poultry net voltage.

    Returns a float voltage in kilovolts, or None if ESP32 is disconnected.
    """
    return fence_sensor.read()
```

---

### 23) Docstrings Should Explain What, Not How (Line ~406)

**Context:** Docstrings describe contract and behavior; the code describes how; changing implementation without changing the contract shouldn’t break callers.

```python
def read_voltage():
    """Read the battery voltage.

    Returns a float voltage, or None if the sensor is unavailable.
    """
    # "How" is code - sensor.read(), error handling
    # "What" is docstring - read voltage, return float or None
    return sensor.read()
```

---

### 24) Functions Make Testing Possible (Line ~412)

**Context:** Functions accept input, return output, and isolate behavior, so they can be tested without a full system.

```python
# Without functions: everything entangled, need real sensor, relay, ESP32 to test
# With functions: can test read_voltage() independently

def read_voltage():
    return sensor.read()

def check_threshold(voltage, threshold=12.1):
    return voltage < threshold

# Can test check_threshold(12.0, 12.1) → True without any hardware
```

---

### 25) Functions Control Complexity Growth (Line ~430)

**Context:** Functions name paths, contain branches, and limit mental load; they make complexity navigable.

```python
# Complexity grows sideways - Phase 0.13
# Functions: name paths, contain branches, limit mental load

def should_start_generator():
    return voltage < 12.1 and generator_state == "off" and cooldown_complete

# Instead of inlining that condition everywhere, name it
# Don't remove complexity - make it navigable
```

---

### Reflection: Function Architecture (Line ~444)

**Context:** Questions for any system: what behaviors group together, what names are trustworthy, which functions observe vs act vs coordinate.

```python
# What behaviors naturally group? read voltage, check threshold, start generator
# What names would you trust? read_coop_temp, check_fence, start_fan
# Which observe only? read_voltage, read_coop_temp, check_fence
# Which act? start_generator, start_fan, alert_fence_down
# Which coordinate? monitor_battery, control_coop, manage_fence

def read_voltage():
    return sensor.read()

def start_generator():
    relay.on()

def monitor_battery():
    while True:
        voltage = read_voltage()
        if voltage < 12.1:
            start_generator()
        time.sleep(5)
```
