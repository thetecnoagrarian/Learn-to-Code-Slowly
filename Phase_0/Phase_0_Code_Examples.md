# Phase 0 Code Examples

This file contains visual references for all code examples mentioned in Phase 0 chapters. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 0.02: Conditions and Branching

### 3) Conditions Depend on State and Input (And Time) (Line ~72)

**Context:** Shows a naive condition vs. a real-world condition that accounts for state and time.

```python
# Naive condition
if voltage < 12.1:
    start_generator()

# Real-world condition with state and time
if voltage < 12.1 and generator_off_for >= 5_minutes and last_start_time < (now - 1_hour):
    start_generator()
```

---

### 4) Comparison vs Policy (Line ~95)

**Context:** Demonstrates the difference between a raw comparison and the policy it represents.

```python
# Comparison (what the computer sees)
voltage < 12.1

# Policy (why that threshold exists)
# - We don't want AGMs to live below 12.1V for long
# - We want reserve for overnight loads
# - We want to avoid excessive generator cycles

# Better: Policy pulled into constants
LOW_VOLTAGE_THRESHOLD = 12.1  # AGM minimum safe voltage
```

---

### 5) Condition Shapes You'll See Constantly (Line ~121)

**Context:** Common condition patterns used in real systems.

```python
# Pattern 1: Threshold
temperature > target
voltage < cutoff
humidity > limit

# Pattern 2: Equality / identity
mode == "winter"
door_state == "open"
sensor_status == "online"

# Pattern 3: Range check
12.0 <= voltage <= 14.8  # plausible range
-40 <= temp_c <= 85      # sensor plausible range

# Pattern 4: Membership
sensor_name in allowed_sensors
alert_type in active_alerts

# Pattern 5: Compound conditions (AND / OR)
# If voltage low AND generator off → start
if voltage < 12.1 and not generator_running:
    start_generator()

# If temp high OR smoke detected → alarm
if temperature > 85 or smoke_detected:
    trigger_alarm()
```

---

### 7) Nesting: Useful, Then Dangerous (Line ~187)

**Context:** Example of readable nested conditions for battery/generator control.

```python
# Readable nesting
if battery_low:
    if generator_off:
        start_generator()

# Later pattern: Early exits / guard clauses (concept introduced here)
# Check disqualifying conditions early, return or continue
# Keep the main path visually clear
```

---

### 8) Conditions Are Not "Logic Yet" (Line ~217)

**Context:** Shows how a condition becomes a rule when combined with state changes.

```python
# A condition is a test
if condition:
    # Logic emerges when you combine predicates into rules
    change_state()  # This creates a rule
```

---

### 10) Real-World Condition Design: Noise, Hysteresis, and Chatter (Line ~262)

**Context:** Demonstrates the sensor noise problem and hysteresis solution.

```python
# Sensor noise problem
# Temperature reads: 69.9, 70.1, 69.8, 70.2

# Bad rule (causes chatter)
if temperature >= 70.0:
    turn_fan_on()
else:
    turn_fan_off()
# Output: on, off, on, off (chatter!)

# Solution: Hysteresis (two thresholds)
if temperature > 70.0:
    turn_fan_on()
elif temperature < 68.0:
    turn_fan_off()
# Small fluctuations don't cause toggling
```

---

### Reflection: Freezer Monitoring (Line ~308)

**Context:** Example conditions for freezer monitoring system.

```python
# Freezer monitoring conditions
if freezer_temp > threshold and duration >= N_minutes:
    alert()

if reading is None:
    mark_sensor_offline()

if sensor_offline_duration > too_long:
    escalate()
```

---

## Chapter 0.03: Loops and Controlled Repetition

### 1) Why Loops Exist (Line ~28)

**Context:** Shows the three types of loop rules that replace manual repetition.

```python
# Instead of rewriting instructions hundreds of times, use loops:

# "Keep doing this while this condition is true"
while condition_is_true:
    do_something()

# "Repeat this until something changes"
while not something_changed:
    do_something()

# "Do this once for each item in a group"
for item in group:
    do_something_with(item)
```

---

### 2) The Three Required Parts of Every Loop (Line ~44)

**Context:** Demonstrates the three required parts: starting state, condition, and state change.

```python
# 1. Starting State
counter = 0  # Initial condition

# 2. Condition (checked repeatedly)
while counter < 10:  # Gatekeeper question
    # 3. State Change (exit mechanism)
    counter = counter + 1  # Must change state to eventually exit
    do_something()

# Missing any part = broken loop
# No starting state = undefined behavior
# No condition = infinite loop
# No state change = infinite loop
```

---

### 2) Starting State Examples (Line ~62)

**Context:** Examples of different starting states that determine loop behavior.

```python
# Counter starting at zero
count = 0
while count < 5:
    process_item()
    count = count + 1

# Flag that begins as false
found = False
while not found:
    search()
    if item_found:
        found = True

# System that starts offline
is_online = False
while not is_online:
    check_connection()
    if connection_established:
        is_online = True
```

---

### 2) Condition Examples (Line ~89)

**Context:** Shows how conditions act as gatekeepers checked repeatedly.

```python
# Is the temperature still too high?
while temperature > threshold:
    run_cooling()
    temperature = read_sensor()

# Is the battery voltage still below threshold?
while voltage < 12.1:
    run_generator()
    voltage = read_voltage()

# Is there another item to process?
while items_remaining:
    process_next_item()
    items_remaining = check_if_more()

# Has the user pressed the button yet?
while not button_pressed:
    check_button()
    wait_briefly()
```

---

### 2) State Change Examples (Line ~111)

**Context:** Demonstrates different types of state changes that enable loop exit.

```python
# Incrementing a counter
count = 0
while count < 10:
    do_work()
    count = count + 1  # State change: counter increases

# Updating a sensor reading
temperature = read_sensor()
while temperature > 70:
    run_fan()
    temperature = read_sensor()  # State change: new reading

# Flipping a flag
done = False
while not done:
    work()
    if work_complete:
        done = True  # State change: flag flips

# Removing an item from a list
items = [1, 2, 3, 4, 5]
while items:
    process(items[0])
    items = items[1:]  # State change: list shrinks
```

---

### 3) Infinite Loops Are Not Accidents (Line ~124)

**Context:** Shows when infinite loops occur and when they're intentional.

```python
# Infinite loop causes:
# 1. Condition never becomes false
while True:  # Always true!
    do_something()  # Never exits

# 2. State change doesn't affect the condition
count = 0
while count < 10:
    do_something()
    # Missing: count = count + 1
    # State never changes, condition never becomes false

# 3. Assumed the world would change on its own
while not button_pressed:
    do_something()
    # Button never checked, state never updated

# Intentional infinite loops (until shutdown)
while True:  # Server loop
    handle_request()
    # Exits only when program terminates

while True:  # Battery monitoring loop
    check_voltage()
    control_generator()
    sleep(5)
    # Runs until shutdown signal
```

---

### 5) Loops and the Illusion of "Waiting" (Line ~161)

**Context:** Shows how "waiting" is actually looping with patience.

```python
# "Wait for temperature to drop" is actually:
temperature = read_sensor()
while temperature > threshold:
    # Check repeatedly until condition met
    temperature = read_sensor()
    sleep(1)  # Polite: yield control, don't burn CPU

# Bad: Tight loop (wastes power, burns CPU)
while temperature > threshold:
    temperature = read_sensor()
    # No sleep = CPU spinning constantly

# Good: Polite loop (yields control)
while temperature > threshold:
    temperature = read_sensor()
    sleep(1)  # Wait before checking again
```

---

### 7) Loops vs Lists (A Preview) (Line ~210)

**Context:** Shows how loops over collections follow the same three-part structure.

```python
# Loops over collections still have three parts:

# Starting point: first item
sensors = [sensor1, sensor2, sensor3]
index = 0  # Starting state

# Condition: are there more items?
while index < len(sensors):  # Condition checked repeatedly
    # Process item
    check_sensor(sensors[index])
    # State change: move to next item
    index = index + 1  # State change

# Same structure, different source of state changes
# Time-based: state changes over time
# Collection-based: state changes by moving through items
```

---

### Reflection: Real-World Loop Analysis (Line ~244)

**Context:** Framework for analyzing any loop in terms of its three required parts.

```python
# Template for analyzing any loop:

# 1. What is the starting state?
starting_state = initial_condition

# 2. What condition are you checking?
while condition_to_check:
    # 3. What changes over time?
    update_state()
# 4. How do you know when to stop?
# (When condition becomes false due to state change)
```

---

## Chapter 0.04: Functions and Naming Behavior

### 3) A Function Is a Boundary (Line ~76)

**Context:** A function wraps instructions; inside and outside have different concerns.

```python
# Outside: you care what it does and what it produces
voltage = check_voltage()  # Caller doesn't need to know how

# Inside: instructions run in order, state is read/updated
def check_voltage():
    reading = read_sensor()      # Steps happen in sequence
    if reading < 0 or reading > 20:
        return None             # Boundary validation
    return reading              # Result returned to caller
```

---

### 4) Functions as Contracts (Line ~104)

**Context:** Good functions match their name; bad ones surprise the caller.

```python
# Good: name matches behavior, predictable, no surprises
def get_voltage():
    return read_sensor()  # Observes only; caller expects a value

# Bad: name lies—caller expects to observe, gets a side effect
def get_voltage():
    turn_on_relay()      # Side effect!
    return read_sensor()  # Caller did not expect relay to flip
```

---

### 5) Inputs and Outputs Are Optional, Behavior Is Not (Line ~128)

**Context:** Functions may take inputs, return outputs, or neither; they must have behavior.

```python
# Returns a value
def check_battery_voltage():
    return read_sensor()

# Changes state only
def start_generator():
    set_relay(ON)
    log("Generator started")

# Observes only (e.g. logs)
def log_current_state():
    print(f"Voltage: {voltage}, Fan: {fan_on}")

# Accepts input, returns value
def validate_threshold(low, high):
    return low < high and 0 <= low <= 20
```

---

### 6) Functions Always Run in Sequence (Line ~157)

**Context:** When A calls B, B runs to completion, then A continues.

```python
def main_loop():
    voltage = check_voltage()   # A calls B; B runs fully
    if voltage < 12.1:         # Then A continues here
        start_generator()
    log_state()

def check_voltage():
    raw = read_sensor()
    return raw if 0 <= raw <= 20 else None
# Control returns to main_loop after check_voltage finishes
```

---

### 7) Naming Is the Real Skill (Line ~182)

**Context:** Good names describe what happens; bad names force the reader to look inside.

```python
# Good: describes what happens, matches how a human would say it
def check_voltage():
    ...
def start_generator():
    ...
def is_temperature_safe():
    ...

# Bad: reader must open the function to understand
def doThing():
    ...
def process():
    ...
def handleStuff():
    ...
```

---

### 8) Functions Compress Complexity (Line ~211)

**Context:** One name can represent many steps; the name must match the behavior.

```python
# "Start the generator" compresses many steps into one idea
def start_generator():
    flip_switch()
    wait(2)
    check_voltage()
    adjust_choke()
    wait_for_rpm_stable()
    # One coherent behavior; name matches

# Lying name: behavior doesn't match
def start_generator():
    start_engine()
    log_entry()           # OK: logging is part of "start"
    check_weather_forecast()  # Name is lying; not part of "start"
```

---

### 9) Functions and Localized Change (Line ~228)

**Context:** Change how it works in one place without changing every call site.

```python
# Behavior in one place: change here only
def check_voltage():
    return read_sensor()  # Later: swap to different sensor
# All callers get the update automatically

# Behavior scattered: must find and fix every occurrence
# voltage = read_sensor()  # occurrence 1
# voltage = read_sensor()  # occurrence 2
# ... miss one and the system is inconsistent
```

---

### 10) Functions Make Bugs Easier to Isolate (Line ~250)

**Context:** A bug in a named function narrows the search; a bug in a long blob does not.

```python
# Bug in a 20-line function named check_voltage: search is narrow
def check_voltage():
    raw = read_sensor()
    if raw is None:
        return None
    return raw * calibration_factor  # Bug here? Look only in this function

# Bug in a 500-line file with no functions: hunt through everything
```

---

### Reflection: Groupings Are Functions (Line ~258)

**Context:** Real-world processes have natural groupings—those are functions.

```python
# "Starting generator" = one named behavior
def start_generator():
    preflight_check()
    engage_starter()
    wait_for_rpm()
    set_to_run_mode()

# "Checking solar" = inputs (irradiance, battery), result (status)
def check_solar_system():
    production = read_inverter()
    battery = read_battery_voltage()
    return "ok" if production > 0 and 11.5 < battery < 14.8 else "alert"
```

