# Phase 0 Code Examples (Chapters 6-10)

This file contains visual references for all code examples mentioned in Phase 0 chapters 6-10. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 0.06: Errors and What Failure Actually Means

### 1) What an Error Is (Stripped Down) (Line ~20)

**Context:** Errors are assumptions that didn't hold, not moral judgments.

```python
# Error is not: a mistake, bad program, failure of intelligence
# Error is: an assumption that did not hold

# Assumption: voltage will always be a number
voltage = read_sensor()  # Returns None instead
if voltage < 12.1:  # Error: can't compare None to number
    start_generator()

# Assumption: input will always be valid
threshold = user_input()  # User types "abc"
if voltage < threshold:  # Error: can't compare number to string
    start_generator()

# Assumption: state will always exist
if generator_running:  # Error: variable never initialized
    stop_generator()
```

---

### 2) Computers Never Get Confused (Line ~35)

**Context:** Computer did exactly what it was told; the mental model was incomplete.

```python
# Computer follows instructions perfectly
voltage = read_sensor()  # Returns 120.5 (sensor malfunction)
if voltage < 12.1:  # False (120.5 is not < 12.1)
    start_generator()  # Never runs
# Computer did exactly what it was told
# Mental model assumed voltage would be in 0-20V range
# Assumption failed, not computer confusion
```

---

### 3) Errors Come From Gaps, Not Chaos (Line ~55)

**Context:** Errors come from missing conditions, wrong expectations, or unhandled values.

```python
# Missing condition: didn't consider None
voltage = read_sensor()
if voltage < 12.1:  # Error if voltage is None
    start_generator()

# Wrong expectation: assumed positive values only
if voltage < 12.1:  # Error if voltage is -1 (sensor error)
    start_generator()

# Value you assumed would never happen
if voltage < 12.1:  # Assumed 0-20V range
    start_generator()  # Reality: sensor returns 999.9
```

---

### 4) Programs Live at the Boundary Between Rules and Reality (Line ~71)

**Context:** Errors happen where exact rules meet unpredictable reality.

```python
# Inside program: exact rules
voltage = read_sensor()
if voltage < 12.1:
    start_generator()

# Outside program: reality surprises
# Sensor drifts: returns 12.15 instead of 12.1
# Wi-Fi drops: no reading for 30 seconds
# Timing shifts: readings arrive late
# Hardware lies: sensor reports 0V when battery is fine

# Error at boundary: assumption about timing fails
last_reading_time = current_time()
while True:
    voltage = read_sensor()  # Assumes reading every 5 seconds
    # Wi-Fi drops packet, 30 seconds pass
    # Assumption about timing fails
    if voltage < 12.1:
        start_generator()
```

---

### 5) Good Programs Expect Failure (Line ~98)

**Context:** Strong programs assume inputs can be missing, data malformed, state stale.

```python
# Strong program: expects failure
def check_voltage():
    reading = read_sensor()
    if reading is None:  # Input can be missing
        return None
    if not isinstance(reading, (int, float)):  # Data can be malformed
        return None
    if reading < 0 or reading > 20:  # Value can be wrong
        return None
    return reading

# Weak program: assumes everything behaves
def check_voltage():
    reading = read_sensor()  # Assumes always returns number
    return reading  # Assumes always valid
```

---

### 6) Failing Loudly Is a Feature (Line ~119)

**Context:** Programs that stop and report are safer than those that continue with wrong state.

```python
# Good: detects problem, stops, reports
def check_voltage():
    reading = read_sensor()
    if reading is None:
        raise ValueError("Sensor reading is None")  # Fails loudly
    if reading < 0 or reading > 20:
        raise ValueError(f"Invalid voltage reading: {reading}")  # Reports what went wrong
    return reading

# Bad: continues blindly, corrupts state
def check_voltage():
    reading = read_sensor()  # Returns None or invalid value
    return reading or 12.2  # Returns stale/corrupted reading
    # Dashboard shows "12.2 V" but actual voltage is 11.8 V
    # System looks fine but battery suffers
```

---

### 7) Errors Are Information, Not Obstacles (Line ~138)

**Context:** Error messages tell you what happened and what assumption failed.

```python
# Error: "Division by zero at line 42"
# Tells you: where it happened
# Real information: assumption "this value will never be zero" failed

def calculate_average(readings):
    total = sum(readings)
    count = len(readings)
    return total / count  # Error if count is 0
    # Assumption: readings list will never be empty
    # Assumption failed: empty list passed

# Reading error calmly:
# - What was program doing? Calculating average
# - What assumption failed? Readings list would have items
# - Where was model incomplete? Didn't handle empty list case
```

---

### 8) Failure vs Incorrect Behavior (Line ~156)

**Context:** Loud failure is preferable to silent incorrect behavior.

```python
# System that fails obviously
def start_generator():
    voltage = read_sensor()
    if voltage is None:
        raise ValueError("Cannot start generator: no voltage reading")
    if voltage < 12.1:
        # Actually start generator
        set_relay(ON)
    # Stops, signals clearly if assumption fails

# System that keeps running incorrectly
def start_generator():
    voltage = read_sensor() or 12.2  # Defaults to wrong value
    if voltage < 12.1:
        set_relay(ON)
    # Keeps running, produces incorrect results
    # Looks "fine" until damage accumulates

# Defensive design: check assumptions before acting
def start_generator():
    voltage = read_sensor()
    if voltage is None:
        raise ValueError("Missing voltage reading")
    if not (0 <= voltage <= 20):
        raise ValueError(f"Invalid voltage: {voltage}")
    # Validate inputs, verify state, then proceed
    if voltage < 12.1:
        set_relay(ON)
```

---

### 9) Errors Are Part of Normal Execution (Line ~179)

**Context:** Errors represent unhandled cases; mature systems decide how to respond.

```python
# Assumption: voltage is always a number
def check_voltage():
    voltage = read_sensor()  # Returns None or "N/A"
    if voltage < 12.1:  # Error: None or string can't be compared
        start_generator()
    # Case was never handled: sensor returns null or "N/A"

# Mature system: decides how to respond
def check_voltage():
    voltage = read_sensor()
    if voltage is None:
        log_error("Sensor reading is None")
        return None  # Handle the error case
    if isinstance(voltage, str):
        log_error(f"Invalid reading format: {voltage}")
        return None  # Handle the error case
    if voltage < 12.1:
        start_generator()
    return voltage
```

---

### 10) Human Debugging Is Just Error Interpretation (Line ~192)

**Context:** Debugging is reconstructing state, tracing inputs, identifying broken assumptions.

```python
# Practical step: log values at moment of failure
def check_voltage():
    voltage = read_sensor()
    log(f"Voltage reading: {voltage}")  # Log key variables
    log(f"Type: {type(voltage)}")
    log(f"Time: {current_time()}")
    
    if voltage < 12.1:  # Error occurs here
        start_generator()
    # Logs help reconstruct state when assumption breaks

# Step through program to see state
# - What was voltage value? None
# - What was its type? NoneType
# - What assumption broke? "voltage will always be a number"
```

---

### Reflection: Analyzing Real Failures (Line ~211)

**Context:** Framework for understanding what assumption failed in a real system.

```python
# Think about a real system failure:
# Generator wouldn't start

# What assumption turned out to be wrong?
# Assumption: voltage reading would always be valid
voltage = read_sensor()  # Returns None
if voltage < 12.1:  # Assumption failed

# What input did you not expect?
# Expected: number between 0-20
# Got: None or "N/A" or 999.9

# What state existed that you didn't consider?
# State: sensor offline, Wi-Fi disconnected, sensor malfunction
# Program assumed: sensor always online and working
```

---

## Chapter 0.07: Time and Programs Over Change

### 1) Time Is Always Present (Even When You Don't Mention It) (Line ~20)

**Context:** Time exists whenever instructions run in sequence, state changes, or conditions are evaluated repeatedly.

```python
# Time exists whenever:
# One instruction runs after another
voltage = read_sensor()  # First moment
if voltage < 12.1:       # Second moment (state may have changed)
    start_generator()     # Third moment

# State changes between steps
voltage = 12.5
# ... time passes ...
voltage = read_sensor()  # Now 11.8

# Inputs arrive asynchronously
voltage = read_sensor()  # May arrive at unpredictable moments

# Conditions evaluated repeatedly
while voltage < 12.1:  # Checked at each moment
    voltage = read_sensor()  # State changes over time

# Time is implicit in order
# If two instructions swap places, timeline changes
```

---

### 2) Sequence Is Time Made Visible (Line ~41)

**Context:** Instructions in order define a timeline; wrong sequence causes incorrect behavior.

```python
# Correct sequence
voltage = read_sensor()      # First: observe
if voltage < 12.1:           # Second: decide
    start_generator()         # Third: act
    log("Generator started")  # Fourth: record

# Wrong sequence: something happened earlier than expected
log("Generator started")      # Logged before checking
voltage = read_sensor()       # Checked after logging
if voltage < 12.1:
    start_generator()

# Wrong sequence: something checked before state updated
if voltage < 12.1:           # Checked stale value
    start_generator()
voltage = read_sensor()      # Updated after decision

# Wrong sequence: acted on after already stale
voltage = read_sensor()      # Read at moment 1
# ... time passes, voltage changes ...
start_generator()            # Acted on stale reading from moment 1
```

---

### 3) State Always Belongs to a Moment (Line ~60)

**Context:** State exists at a specific moment; checking at different moments may yield different answers.

```python
# State at different moments
voltage_now = read_sensor()           # Battery voltage right now
voltage_five_seconds_ago = history[-1]  # Temperature five seconds ago
door_status_before_loop = door_open   # Door status before loop ran
connection_at_last_check = is_online # Network connection at last check

# When program checks condition, it asks: "Is this true at this moment?"
if voltage < 12.1:  # Checks voltage at this moment
    start_generator()

# If moment changes, answer may change
voltage = 12.5      # Moment 1: False
# ... time passes ...
voltage = 11.8      # Moment 2: True (even if nothing else changed)
```

---

### 4) Timing Is Where "It Worked Earlier" Comes From (Line ~80)

**Context:** Logic is correct, but assumptions about when things happen were wrong.

```python
# "It worked a minute ago" - what changed was time

# Sensor hadn't stabilized yet
voltage = read_sensor()  # First reading: 12.5 (unstable)
# ... wait for stabilization ...
voltage = read_sensor()  # Now: 11.8 (stable)

# Network response hadn't arrived
voltage = read_sensor()  # Returns None (response delayed)
# ... later ...
voltage = read_sensor()  # Returns 12.5 (response arrived)

# Value checked before it updated
if voltage < 12.1:       # Checked old value
    start_generator()
voltage = read_sensor()  # Updated after check

# Loop ran faster than reality could respond
while not button_pressed:
    check_button()  # Checks 1000x per second, button still pressed
    # Logic correct, timing assumption wrong
```

---

### 5) Real Systems Are Slower Than Code (Line ~98)

**Context:** Computers operate in microseconds; the world operates in seconds/minutes.

```python
# Generator start sequence: each step has its own timing
def start_generator():
    flip_switch()           # Instant
    wait_for_choke()        # Takes 2 seconds
    listen_for_rpm()        # Takes 5 seconds
    apply_load()            # Takes 1 second
    
    # If you check voltage before engine spins up:
    voltage = read_sensor()  # False reading (engine not running yet)
    # Logic correct, timing wrong

# Voltage doesn't drop instantly
voltage = 12.5
start_load()  # Heavy load applied
voltage = read_sensor()  # Still 12.5 (hasn't dropped yet)
# ... 30 seconds later ...
voltage = read_sensor()  # Now 11.8 (voltage dropped)

# Temperature doesn't stabilize immediately
temp = read_sensor()  # 70.0 (unstable)
# ... wait ...
temp = read_sensor()  # 72.5 (stable)

# Motors take time to spin up
start_fan()
fan_running = True  # Set immediately
# ... but fan takes 3 seconds to reach full speed ...
```

---

### 6) Waiting Is Just Repeated Checking (Line ~119)

**Context:** Programs don't "wait" - they loop and recheck; waiting is time-aware looping.

```python
# "Wait for battery to recover" = check repeatedly
voltage = read_sensor()
while voltage < 12.1:  # Loop and recheck
    sleep(5)            # Pause briefly
    voltage = read_sensor()  # Recheck

# Poorly designed waiting: burns resources
while voltage < 12.1:
    voltage = read_sensor()  # No sleep = CPU spinning constantly

# Well-designed waiting: respects pace of reality
while voltage < 12.1:
    voltage = read_sensor()
    sleep(5)  # Balance responsiveness with stability
```

---

### 7) Fresh vs Stale State (Line ~147)

**Context:** Some state becomes invalid quickly; other state remains valid longer.

```python
# Stale data treated as fresh: decisions are wrong
voltage_5_minutes_ago = 12.2  # From 5 minutes ago
current_voltage = 11.8        # Actual current voltage
if voltage_5_minutes_ago < 12.1:  # Acting on stale reading
    start_generator()  # Too late - inverter already cut out

# Fresh state: must be refreshed often
voltage = read_sensor()  # Valid for seconds only
if voltage < 12.1:
    start_generator()

# Stale state: remains valid longer
last_generator_start = "2024-01-15T08:00:00"  # Valid for hours
if hours_since(last_generator_start) > 24:
    # Still valid context

# Refresh too aggressively: waste resources, introduce noise
voltage = read_sensor()  # Every millisecond
voltage = read_sensor()  # Too fast = noise dominates
```

---

### 8) Order Matters More Than Speed (Line ~175)

**Context:** Two correct instructions in wrong order can break a system.

```python
# Wrong: acting before checking
start_fan()              # Acted on stale reading
temperature = read_sensor()  # Checked after action

# Wrong: checking before updating
if temperature > 70:      # Checked old value
    start_fan()
temperature = read_sensor()  # Updated after decision

# Wrong: logging before validating
log(f"Temperature: {temperature}")  # Logged invalid value
if temperature < -40 or temperature > 150:
    return None  # Validated after logging

# Wrong: triggering output before state ready
set_relay(ON)            # Triggered before state updated
generator_running = True  # State updated after output

# Correct order
temperature = read_sensor()  # First: observe
if temperature > 70:         # Second: decide
    start_fan()              # Third: act
    log("Fan started")       # Fourth: record
```

---

### 9) Loops Are Programs' Relationship With Time (Line ~191)

**Context:** Every loop implies a cadence; choosing how often to run is a design decision.

```python
# Too fast: noise dominates, resources wasted
while True:
    temp = read_sensor()  # 100 times per second
    # Catches electrical noise, heats circuit

# Too slow: state lags, responsiveness suffers
while True:
    temp = read_sensor()  # Every 30 seconds
    # Might miss freezer thaw

# Right cadence: matches reality
while True:
    temp = read_sensor()  # Every 5 seconds
    # Homestead systems: often every few seconds to few minutes
    check_conditions()
    sleep(5)
```

---

### 10) Time Is the Hidden Input (Line ~212)

**Context:** Time determines when inputs arrive, how state evolves, when conditions change.

```python
# Time determines when inputs arrive
voltage = read_sensor()  # Input arrives at unpredictable moment

# Time determines how state evolves
voltage = 12.5
# ... time passes ...
voltage = 11.8  # State evolved over time

# Time determines when conditions change
if voltage < 12.1:  # Condition changes over time
    start_generator()

# Time determines how long loops persist
while voltage < 12.1:  # Loop persists until condition changes
    voltage = read_sensor()
    sleep(5)

# Time determines when errors surface
voltage = read_sensor()  # Returns None (sensor offline)
# Error surfaces when checked, not when sensor went offline
```

---

### Reflection: Time-Aware System Analysis (Line ~236)

**Context:** Framework for understanding time in real systems.

```python
# How often does it check its state?
while True:
    voltage = read_sensor()  # Every 5 seconds
    check_conditions()
    sleep(5)

# What happens if it checks too soon?
voltage = read_sensor()  # Before sensor stabilized
# Gets noisy/unstable reading

# What happens if it checks too late?
voltage = read_sensor()  # 30 seconds after last check
# Battery already dropped too low

# Which information is fresh?
voltage = read_sensor()  # Fresh: just read
last_check = current_time()  # Fresh: current moment

# Which information is already old?
voltage_5_minutes_ago = history[-1]  # Old: from 5 minutes ago
```

---

## Chapter 0.08: Boundaries

### 1) Where Systems Touch the Outside World (Line ~9)

**Context:** Programs have boundaries where data crosses in and out.

```python
# Inputs cross in
voltage = read_sensor()           # Sensor reading crosses boundary
data = receive_network_packet()   # Network packet crosses boundary
config = read_file("config.json") # File contents cross boundary
user_input = get_keypress()       # User keystroke crosses boundary

# Outputs cross out
set_relay(ON)                      # Relay signal crosses boundary
write_log("Generator started")    # Log write crosses boundary
update_dashboard(voltage)         # Dashboard update crosses boundary
send_error("Sensor offline")      # Error message crosses boundary

# State can be read/written by external systems
voltage = database.read("voltage") # Database read crosses boundary
database.write("status", "running") # Database write crosses boundary
mqtt.publish("sensor/voltage", 12.5) # MQTT publish crosses boundary
```

---

### 2) The Boundary Is Where Assumptions Break (Line ~18)

**Context:** Outside world doesn't follow assumptions; bad data enters if not validated.

```python
# Assumption: sensor returns a number
voltage = read_sensor()  # Returns None instead
if voltage < 12.1:  # Error: can't compare None to number
    start_generator()

# Assumption: network request always arrives
data = receive_network_packet()  # Never arrives, blocks forever
process(data)  # Never reached

# Assumption: file exists and has content
config = read_file("config.json")  # File missing or empty
threshold = config["low_voltage"]  # Error: can't access key

# Assumption: user types valid input
threshold = input("Enter threshold: ")  # User types "abc"
if voltage < threshold:  # Error: can't compare number to string
    start_generator()

# If you trust data the moment it crosses boundary:
voltage = read_sensor()  # Returns None
# Bug is already inside - bad data propagates
```

---

### 3) Validation Lives at the Edges (Line ~28)

**Context:** Validate as data crosses the boundary - check shape, range, presence, consistency.

```python
# Validate voltage reading at boundary
def read_voltage():
    raw = read_sensor()  # Data crosses boundary
    
    # Check shape: is it the right type?
    if not isinstance(raw, (int, float)):
        return None
    
    # Check range: is value plausible?
    if not (0 <= raw <= 20):
        return None
    
    # Check presence: is it missing?
    if raw is None:
        return None
    
    # Check consistency: does it conflict with other state?
    if raw == 0 and battery_connected:
        return None  # Inconsistent: battery connected but 0V
    
    return raw  # Validated data enters program

# Validate network packet at boundary
def receive_packet():
    packet = network.receive()
    
    # Check shape: right structure?
    if not isinstance(packet, dict):
        return None
    if "voltage" not in packet:
        return None
    
    # Check range: plausible value?
    voltage = packet["voltage"]
    if not (0 <= voltage <= 20):
        return None
    
    return packet  # Validated packet enters program

# Validate file at boundary
def read_config():
    try:
        data = read_file("config.json")
    except FileNotFoundError:
        return None  # File missing
    
    # Check shape: valid JSON?
    if not isinstance(data, dict):
        return None
    
    # Check presence: required keys?
    if "low_voltage" not in data:
        return None
    
    # Check range: valid threshold?
    threshold = data["low_voltage"]
    if not (0 <= threshold <= 20):
        return None
    
    return data  # Validated config enters program
```

---

### 4) Fail at the Boundary, Not in the Middle (Line ~39)

**Context:** Reject bad input at the edge; easier to debug than corrupted state failing later.

```python
# Good: fails at boundary
def check_voltage():
    voltage = read_sensor()
    if voltage is None:
        raise ValueError("Sensor reading is None")  # Fails here
    if not (0 <= voltage <= 20):
        raise ValueError(f"Invalid voltage: {voltage}")  # Fails here
    return voltage

# Bad: fails in the middle
def check_voltage():
    voltage = read_sensor()  # None or invalid value enters
    # ... 50 lines of code ...
    if voltage < 12.1:  # Crashes here - hard to trace back
        start_generator()

# When you see crash deep in logic, ask:
# What crossed the boundary earlier that shouldn't have?
voltage = read_sensor()  # Returns None
# ... many lines later ...
average = sum(voltages) / len(voltages)  # Crashes here
# But the problem was at the boundary - None entered
```

---

### 5) Boundaries Are Contracts (Line ~45)

**Context:** Boundary is a contract enforced by validation, not by the computer.

```python
# Contract: "If you give me data in this form, I will behave this way"

# Function contract at boundary
def process_voltage(voltage):
    # Contract: voltage must be number between 0-20
    # You enforce it by validating:
    if not isinstance(voltage, (int, float)):
        raise ValueError("Voltage must be a number")
    if not (0 <= voltage <= 20):
        raise ValueError("Voltage must be between 0 and 20")
    
    # Now you can safely use voltage
    if voltage < 12.1:
        start_generator()
    return voltage

# Contract not enforced by computer - you enforce it
voltage = read_sensor()  # Might return anything
process_voltage(voltage)  # Your validation enforces the contract
```

---

### Reflection: Boundary Analysis (Line ~52)

**Context:** Framework for identifying and defending boundaries in a system.

```python
# Where does data enter?
voltage = read_sensor()        # Boundary: sensor input
config = read_file("config.json")  # Boundary: file input
packet = receive_network_packet()  # Boundary: network input

# Where does data leave?
set_relay(ON)                  # Boundary: output to relay
write_log("Started")          # Boundary: output to log
update_dashboard(voltage)     # Boundary: output to dashboard

# What happens if sensor returns null?
voltage = read_sensor()  # Returns None
if voltage is None:      # Boundary defense
    handle_error("Sensor offline")
    return None
# Bad data rejected at boundary

# What happens if file is empty?
config = read_file("config.json")
if not config:  # Boundary defense
    use_default_config()
# Bad data handled at boundary

# What happens if network packet never arrives?
packet = receive_network_packet(timeout=5)
if packet is None:  # Boundary defense
    handle_timeout()
# Missing data handled at boundary
```

---

## Chapter 0.085: Consolidation and the Complete Mental Model

### 1) The Whole System (As One Thing) (Line ~16)

**Context:** Complete mental model: program operates on data in variables, executes instructions, uses conditions/loops/functions, over time.

```python
# Battery monitor example - one system, one model

# Data (voltage reading)
voltage = read_sensor()

# Variables (representing state)
last_reading = None
is_generator_on = False

# Conditions (choose paths)
if voltage < 12.1:
    # Functions (group behavior)
    start_generator()

# Loops (repeat work)
while True:
    voltage = read_sensor()  # Inputs arrive
    last_reading = voltage    # State changes
    
    if voltage < 12.1 and not is_generator_on:
        start_generator()     # Outputs produced
        is_generator_on = True
    
    # Time (staleness matters)
    if last_reading is None:
        handle_error("Sensor offline")  # Errors occur when assumptions break
    
    sleep(5)  # Loop repeats over time
```

---

### 2) Reduced Further (Until It's Uncomfortable) (Line ~44)

**Context:** The entire field stripped to its bones.

```python
# Inputs and state go in
voltage = read_sensor()  # Input
last_voltage = 12.5       # State

# Instructions run in order
voltage = read_sensor()   # First instruction
if voltage < 12.1:        # Second instruction
    start_generator()     # Third instruction

# Conditions choose paths
if voltage < 12.1:        # Condition
    start_generator()     # Path 1
else:
    log("Voltage OK")     # Path 2

# Loops repeat steps
while voltage < 12.1:     # Loop
    check_voltage()       # Repeated step
    sleep(5)

# State changes
voltage = 12.5            # State at moment 1
voltage = 11.8            # State at moment 2 (changed)

# Outputs appear
start_generator()         # Output: relay signal
log("Generator started")  # Output: log entry
```

---

### 3) Why This Model Matters (Line ~63)

**Context:** Model works when things don't behave; gives answers to debugging questions.

```python
# Tutorial assumes voltage sensors return numbers
voltage = read_sensor()  # Tutorial code
if voltage < 12.1:
    start_generator()

# Reality sends null
voltage = read_sensor()  # Returns None
if voltage < 12.1:  # Error - but model still applies

# When something goes wrong, useful questions:
# What was the state?
voltage = None  # State was None

# What changed?
voltage = read_sensor()  # Changed from 12.5 to None

# What instruction ran?
if voltage < 12.1:  # This instruction ran

# What assumption failed?
# Assumption: voltage would always be a number

# When did it happen?
# When sensor went offline (time matters)
```

---

### 4) All Bugs Are Violations of This Model (Line ~87)

**Context:** Every bug reduces to data wrong, state wrong, order wrong, condition missing, loop not terminating, or time invalidating assumption.

```python
# Bug 1: Data was wrong
voltage = read_sensor()  # Returns "N/A" instead of number
if voltage < 12.1:  # Error: can't compare string to number

# Bug 2: State changed unexpectedly
is_generator_on = True
stop_generator()
# Missing: is_generator_on = False
# State wrong: flag stayed true after shutdown

# Bug 3: Instructions ran in wrong order
start_fan()              # Acted before reading
temperature = read_sensor()  # Read after acting
# Order wrong: fan turned on before temperature read

# Bug 4: Condition didn't cover a case
if voltage < 12.1:  # Assumes voltage is always present
    start_generator()
# Missing case: voltage is None

# Bug 5: Loop didn't terminate
while voltage < 12.1:
    check_voltage()
    # Missing: voltage = read_sensor()
    # State never changes, loop never exits

# Bug 6: Time invalidated assumption
voltage = read_sensor()  # 12.2 V at 10:00
# ... 5 minutes pass, battery drops to 11.8 V ...
if voltage < 12.1:  # Still checking stale 12.2 V
    start_generator()  # Too late - assumption about timing failed
```

---

### 6) Why This Transfers to Jobs (Line ~125)

**Context:** Clear explanation signals understanding; example of explaining a failure.

```python
# Example explanation: "The voltage reading was stale when we decided 
# to start the generator. We acted on 12.2 V when the battery was 
# actually 11.8 V. The condition was correct; the timing was wrong."

# Code that demonstrates the explanation:
voltage = read_sensor()  # 12.2 V at 10:00
# ... 5 minutes pass, battery drops to 11.8 V ...
# voltage still holds 12.2 V (stale)

if voltage < 12.1:  # Condition correct: checks if < 12.1
    start_generator()  # But timing wrong: acted on stale data
# Battery was actually 11.8 V, should have started earlier
```

---

### 7) This Model Scales With You (Line ~145)

**Context:** Same model applies to embedded systems, web backends, automation, data pipelines, distributed systems.

```python
# Embedded system - ESP32 sensor node
# Same model: inputs, state, conditions, loops, functions, time
while True:
    voltage = read_sensor()      # Input
    if voltage < 12.1:           # Condition
        start_generator()        # Function
    sleep(5)                     # Loop, time

# Web backend - API serving dashboard data
# Same model: inputs (HTTP request), state (database), conditions, loops, functions
def get_voltage():
    voltage = database.read()    # Input from database
    if voltage is None:          # Condition
        return error()           # Function
    return voltage               # Output

# Automation - Home Assistant rules
# Same model: inputs (sensor), state (entities), conditions, loops (automation triggers)
if voltage < 12.1:              # Condition
    call_service("start_generator")  # Function

# Data pipeline - logs, readings, alerts
# Same model: inputs (logs), state (aggregated data), conditions, loops, functions
for reading in readings:        # Loop
    if reading < 12.1:          # Condition
        send_alert()            # Function

# Distributed system - homestead nodes over MQTT
# Same model: inputs (MQTT messages), state (node state), conditions, loops, functions
def on_message(msg):
    voltage = msg.payload       # Input
    if voltage < 12.1:          # Condition
        start_generator()       # Function
```

---

### 8) Anchor Statement (Non-Negotiable) (Line ~162)

**Context:** Complete definition: program transforms data and state over time using conditions, loops, and functions.

```python
# A program is a sequence of instructions that transforms data and state 
# over time using conditions, loops, and functions.

# Sequence of instructions
voltage = read_sensor()      # Instruction 1
if voltage < 12.1:          # Instruction 2 (condition)
    start_generator()        # Instruction 3

# Transforms data and state
voltage = 12.5              # Data/state before
voltage = read_sensor()      # Transform
voltage = 11.8              # Data/state after

# Over time
while True:                 # Loop (repeats over time)
    voltage = read_sensor()  # State changes over time
    if voltage < 12.1:      # Condition checked over time
        start_generator()   # Function called over time
    sleep(5)                # Time passes

# Whether microcontroller or server, same model
```

---

### 9) Self-Assessment (Honest, Not Performative) (Line ~170)

**Context:** Framework for narrating a real system using only core terms.

```python
# Narrate battery monitor using only core terms:

# 1. What a program is
# Program: sequence of instructions that check battery voltage

# 2. What state means
voltage = 12.5              # Current state: voltage value
is_generator_on = False     # Current state: generator status

# 3. Why instruction order matters
voltage = read_sensor()      # Must read before checking
if voltage < 12.1:          # Order matters: check after reading
    start_generator()

# 4. What a condition does
if voltage < 12.1:          # Condition chooses path
    start_generator()       # Path 1: start generator
else:
    log("OK")               # Path 2: log OK

# 5. Why loops must change state
while voltage < 12.1:       # Loop
    voltage = read_sensor()  # Must change state to exit
    # Without state change, loop never terminates

# 6. Why functions exist
def start_generator():      # Function groups behavior
    set_relay(ON)
    log("Started")
# Name wraps behavior for humans

# 7. How data relates to variables
voltage = read_sensor()     # Data stored in variable
# Variable is name pointing to data

# 8. What errors represent
voltage = read_sensor()     # Returns None
if voltage < 12.1:          # Error: assumption failed
# Error represents broken assumption

# 9. Why timing matters
voltage = read_sensor()     # Read at moment 1
# ... time passes ...
if voltage < 12.1:          # Check at moment 2
# Timing matters: state may have changed
```

---

## Chapter 0.09: Invariants

### 1) What an Invariant Is (Line ~18)

**Context:** Invariant is a rule that holds across time, survives loops, persists through state changes, defines system safety.

```python
# Invariant: Battery voltage must never drop below minimum
MIN_VOLTAGE = 11.0
voltage = read_sensor()
if voltage < MIN_VOLTAGE:
    raise ValueError(f"Invariant violated: voltage {voltage} < {MIN_VOLTAGE}")

# Invariant: Temperature must never exceed safe limit
MAX_TEMPERATURE = 85.0
temperature = read_sensor()
if temperature > MAX_TEMPERATURE:
    raise ValueError(f"Invariant violated: temperature {temperature} > {MAX_TEMPERATURE}")

# Invariant: Door must never be open and locked at the same time
if door_open and door_locked:
    raise ValueError("Invariant violated: door cannot be open and locked")

# Invariant: Counter must never go backward
count = 0
count = count + 1  # OK
count = count - 1  # Violates invariant if count should only increase

# Invariant: Value must never be negative
voltage = read_sensor()
if voltage < 0:
    raise ValueError(f"Invariant violated: voltage {voltage} is negative")

# Homestead: "Voltage must never exceed 15 V"
MAX_SAFE_VOLTAGE = 15.0
if voltage > MAX_SAFE_VOLTAGE:
    raise ValueError("Invariant violated: voltage exceeds safe limit")

# Homestead: "Generator and grid never connected at same time"
if generator_connected and grid_connected:
    raise ValueError("Invariant violated: generator and grid cannot both be connected")
```

---

### 2) Invariants Are Not Conditions (Line ~40)

**Context:** Conditions are questions you check; invariants are promises you guarantee.

```python
# Condition: question you check
if temperature > 80:  # Condition: is temp above 80?
    start_cooling()

if generator_running:  # Condition: is generator running?
    check_status()

# Invariant: promise you guarantee
# "Temperature never exceeds safe maximum"
MAX_TEMP = 85.0
temperature = read_sensor()
if temperature > MAX_TEMP:  # Invariant violation - must never happen
    raise ValueError("Invariant violated: temperature exceeds safe maximum")

# "Generator and grid never connected at same time"
if generator_connected and grid_connected:  # Invariant violation - impossible state
    emergency_shutdown()  # Must never happen

# Conditions can be false and system continues
if temperature > 80:  # False? System continues
    start_cooling()

# Invariants must not be false - ever
if generator_connected and grid_connected:  # False? System is broken
    raise ValueError("System in invalid state")
```

---

### 3) Invariants Define System Boundaries (Line ~58)

**Context:** Invariants draw hard lines between allowed and impossible states.

```python
# Invariant says: "This state is allowed"
voltage = 12.5  # Allowed: within 0-20V range

# Invariant says: "This state is impossible"
voltage = 25.0  # Impossible: exceeds hardware limit
if voltage > 20.0:
    raise ValueError("Impossible state: voltage exceeds hardware limit")

# Invariant says: "If this happens, something went wrong"
if generator_connected and grid_connected:
    raise ValueError("Something went wrong: both systems connected")

# Without invariants: any state technically possible
voltage = -5.0  # No invariant = allowed (but wrong)
voltage = 999.0  # No invariant = allowed (but wrong)

# With invariants: illegal states are obvious
def set_voltage(value):
    if not (0 <= value <= 20):
        raise ValueError(f"Invalid voltage: {value}")  # Illegal state caught
    voltage = value
```

---

### 4) Most Bugs Are Invariant Violations (Line ~79)

**Context:** When something breaks mysteriously, ask what invariant was violated.

```python
# Bug: Loop that never ends
# Invariant violated: "This loop must eventually terminate"
while voltage < 12.1:
    check_voltage()
    # Missing: voltage = read_sensor()
    # State never changes, invariant violated

# Bug: Value drifting upward forever
# Invariant violated: "This value must stay within bounds"
temperature = 70.0
while True:
    temperature = temperature + 0.1  # Sensor fault causes drift
    if temperature > 100.0:  # Invariant violated
        raise ValueError("Temperature out of bounds")

# Bug: System toggling rapidly
# Invariant violated: "State changes must have minimum time between them"
last_change_time = None
MIN_TIME_BETWEEN_CHANGES = 5  # seconds

def toggle_fan():
    now = current_time()
    if last_change_time and (now - last_change_time) < MIN_TIME_BETWEEN_CHANGES:
        raise ValueError("Invariant violated: state change too soon")
    last_change_time = now
    fan_on = not fan_on

# Homestead: Generator start loop stuck waiting for RPM
# Invariant violated: "This loop must eventually terminate"
while not rpm_stable():
    wait_for_rpm()
    # Missing timeout check - loop never terminates

# Homestead: Temperature reading climbing forever
# Invariant violated: "This value must stay within bounds"
temperature = read_sensor()  # Sensor fault returns increasing values
if temperature > MAX_TEMP:  # Invariant violated
    raise ValueError("Temperature out of bounds")

# Homestead: Relay chattering
# Invariant violated: "State changes must have minimum time between them"
if temperature > 70:
    turn_fan_on()
elif temperature < 70:  # No hysteresis
    turn_fan_off()
# Rapid toggling violates minimum time invariant
```

---

### 5) Invariants Exist Even If You Don't Name Them (Line ~97)

**Context:** Unstated invariants get violated silently; explicit invariants turn assumptions into design.

```python
# Unstated invariant: "The voltage is always a number"
voltage = read_sensor()  # Returns "N/A"
if voltage < 12.1:  # Invariant violated silently
    start_generator()  # Wrong decision made

# Explicit invariant: name it, validate it
def read_voltage():
    raw = read_sensor()
    if not isinstance(raw, (int, float)):
        raise ValueError("Invariant violated: voltage must be a number")
    return raw

# Now invariant is enforced
voltage = read_voltage()  # Validates at boundary
if voltage < 12.1:
    start_generator()  # Safe: invariant guaranteed
```

---

### 6) Invariants Are About Stability Over Time (Line ~112)

**Context:** Conditions happen at a moment; invariants hold across moments.

```python
# Condition: happens at a moment
if temperature > 80:  # Checked at this moment
    start_cooling()

# Invariant: holds across moments
# "Temperature never exceeds safe maximum"
MAX_TEMP = 85.0

# Before the loop
temperature = read_sensor()
assert temperature <= MAX_TEMP  # Invariant holds

# During the loop
while True:
    temperature = read_sensor()
    assert temperature <= MAX_TEMP  # Invariant holds
    if temperature > 80:
        start_cooling()
    sleep(5)

# After the loop
assert temperature <= MAX_TEMP  # Invariant holds

# Across inputs
temperature = read_sensor()  # Input 1
assert temperature <= MAX_TEMP
temperature = read_sensor()  # Input 2
assert temperature <= MAX_TEMP

# Across failures
try:
    temperature = read_sensor()
except SensorError:
    temperature = last_known_temp
assert temperature <= MAX_TEMP  # Invariant holds even after failure
```

---

### 7) Hard vs Soft Invariants (Line ~128)

**Context:** Hard invariants must never be violated; soft invariants can be temporarily violated with recovery.

```python
# Hard invariant: must never be violated, triggers immediate failure
MAX_HARDWARE_VOLTAGE = 15.0
voltage = read_sensor()
if voltage > MAX_HARDWARE_VOLTAGE:
    emergency_shutdown()  # Immediate failure - protects safety
    raise ValueError("Hard invariant violated: voltage exceeds hardware limit")

# Hard invariant: two mutually exclusive systems never active together
if generator_connected and grid_connected:
    emergency_shutdown()  # Immediate failure - backfeed can injure
    raise ValueError("Hard invariant violated: generator and grid both connected")

# Soft invariant: should hold under normal conditions, triggers warning
MIN_GENERATOR_RUNTIME = 20  # minutes
if generator_runtime < MIN_GENERATOR_RUNTIME and generator_stopped:
    log_warning("Soft invariant violated: generator ran less than 20 minutes")
    # Don't crash - fault can interrupt it

# Soft invariant: temperature should stay in comfort range
COMFORT_MIN = 68
COMFORT_MAX = 72
temperature = read_sensor()
if not (COMFORT_MIN <= temperature <= COMFORT_MAX):
    log_warning(f"Soft invariant violated: temperature {temperature} outside comfort range")
    # Don't crash - can recover

# Treating soft as hard causes fragility
if generator_runtime < MIN_GENERATOR_RUNTIME:
    raise ValueError("Generator runtime too short")  # Too strict - causes fragility

# Treating hard as soft causes damage
if generator_connected and grid_connected:
    log_warning("Both systems connected")  # Too lenient - can cause damage
```

---

### 8) Invariants Are the Reason Checks Exist (Line ~159)

**Context:** Validation checks protect invariants; checks are enforcement, not paranoia.

```python
# Clamp values to protect invariant
def set_voltage(value):
    clamped = max(0, min(20, value))  # Clamp to 0-20
    # Protects invariant: "voltage is always in valid range"
    voltage = clamped

# Validate inputs to protect invariant
def process_voltage(raw):
    if not isinstance(raw, (int, float)):
        raise ValueError("Voltage must be a number")
    if not (0 <= raw <= 20):
        raise ValueError("Voltage must be in range 0-20")
    # Protects invariant: "voltage is always a valid number in range"
    return raw

# Reject impossible states to protect invariant
def connect_generator():
    if grid_connected:
        raise ValueError("Cannot connect generator: grid is connected")
    # Protects invariant: "generator and grid never connected at same time"
    generator_connected = True

# Add guard conditions to protect invariant
def start_generator():
    if generator_connected and grid_connected:
        emergency_shutdown()  # Guard condition
        raise ValueError("Invariant violation: both systems connected")
    # Protects invariant: "generator and grid never connected at same time"
    start_engine()

# Every check says: "I refuse to enter an invalid state"
```

---

### 9) Invariants Simplify Reasoning (Line ~178)

**Context:** Once invariant is established, you can build logic assuming it holds.

```python
# Invariant: "Generator is either running or not—never unknown"
# Enforce it:
if generator_state not in ["running", "not_running"]:
    raise ValueError("Invalid generator state")

# Now you don't need to check for "starting" or "unknown" everywhere
def check_generator():
    if generator_state == "running":  # No need to check for "unknown"
        check_rpm()
    else:  # Must be "not_running" - invariant guarantees it
        check_voltage()

# Invariant: "This list is never empty"
readings = []
# Enforce invariant:
if not readings:
    readings.append(default_reading)

# Now you don't need to guard every access
average = sum(readings) / len(readings)  # Safe: invariant guarantees non-empty
first = readings[0]  # Safe: invariant guarantees element exists

# Without invariant: need guards everywhere
if readings:
    average = sum(readings) / len(readings)
    first = readings[0]
else:
    handle_empty()  # Extra complexity

# Good invariants make code simpler, not more complex
```

---

### 10) Invariants vs Flexibility (Line ~201)

**Context:** Invariants protect the core, not the surface; you can change algorithms/timing/inputs as long as invariants hold.

```python
# Invariant: "Voltage is always in range 0-20"
# You can change algorithm:
def read_voltage_v1():
    return read_sensor()

def read_voltage_v2():
    raw = read_sensor()
    return filter_noise(raw)  # Different algorithm, same invariant

# You can change timing:
def check_voltage_every_5_seconds():
    while True:
        voltage = read_sensor()
        assert 0 <= voltage <= 20  # Invariant holds
        sleep(5)

def check_voltage_every_10_seconds():
    while True:
        voltage = read_sensor()
        assert 0 <= voltage <= 20  # Invariant holds
        sleep(10)  # Different timing, same invariant

# You can change inputs:
voltage = read_sensor()  # Input 1
assert 0 <= voltage <= 20

voltage = read_database()  # Input 2
assert 0 <= voltage <= 20  # Different input, same invariant

# You can change behavior:
if voltage < 12.1:
    start_generator()  # Behavior 1

if voltage < 12.0:  # Behavior 2: different threshold
    start_generator()
# Invariant still holds: voltage is in range 0-20

# Invariants protect the core, not the surface
```

---

### 11) Invariants Are Design Decisions (Line ~218)

**Context:** You decide what must never happen, what failure looks like, what safety means.

```python
# Design decision: "Voltage must never exceed 15V"
MAX_SAFE_VOLTAGE = 15.0
# Reflects: domain knowledge (inverter limits), risk tolerance (safety critical)

# Design decision: "Generator and grid never connected simultaneously"
if generator_connected and grid_connected:
    emergency_shutdown()
# Reflects: real-world constraint (backfeed danger), risk tolerance (safety critical)

# Design decision: "Temperature readings must be within sensor range"
MIN_TEMP = -40
MAX_TEMP = 85
if not (MIN_TEMP <= temperature <= MAX_TEMP):
    raise ValueError("Temperature out of sensor range")
# Reflects: domain knowledge (sensor specs), risk tolerance (data quality)

# These decisions reflect domain knowledge, risk tolerance, real-world constraints
# That's why senior engineers talk about invariants more than syntax
```

---

### Reflection: Identifying Invariants (Line ~236)

**Context:** Framework for identifying invariants in a real system.

```python
# What states must never occur?
if generator_connected and grid_connected:
    raise ValueError("State must never occur: both systems connected")

# What values must always stay within bounds?
MIN_VOLTAGE = 11.0
MAX_VOLTAGE = 15.0
if not (MIN_VOLTAGE <= voltage <= MAX_VOLTAGE):
    raise ValueError("Value must stay within bounds")

# What combinations are forbidden?
if door_open and door_locked:
    raise ValueError("Forbidden combination: door open and locked")

# What would indicate silent failure?
if voltage == 0 and battery_connected:
    raise ValueError("Silent failure: voltage 0 but battery connected")

# If you can name them, you can design the system
```

---

## Chapter 0.10: Failure Is Normal

### 1) The Happy Path Is the Exception (Line ~14)

**Context:** Real systems face sensors disconnecting, networks dropping, files missing—not just happy paths.

```python
# Happy path (tutorial code)
voltage = read_sensor()  # Assumes reading arrives on time
if voltage < 12.1:
    start_generator()

# Real world: sensors drift or disconnect
voltage = read_sensor()  # Returns None (sensor disconnected)
if voltage < 12.1:  # Error: can't compare None to number

# Real world: networks drop packets
voltage = receive_network_packet()  # Times out, never arrives
if voltage < 12.1:  # Never reached

# Real world: files missing or corrupted
config = read_file("config.json")  # File missing
threshold = config["low_voltage"]  # Error

# Real world: timeouts happen
voltage = read_sensor(timeout=5)  # Times out after 5 seconds
if voltage is None:  # Normal case, not exception

# Homestead: Wi-Fi drops packet, 30 seconds pass with no reading
# Happy path broke - even though logic is correct
```

---

### 2) Failure Is Not a Bug Category (Line ~39)

**Context:** Failure is part of normal execution space; mature systems ask "what will go wrong" not "what if."

```python
# Immature system: "What if something goes wrong?"
try:
    start_generator()
except Exception:
    pass  # Hope it doesn't happen

# Mature system: "What will go wrong, and how do we behave?"
def start_generator():
    if generator_running:
        return  # Already running
    if voltage is None:
        alert("Cannot start: no voltage reading")
        return  # Missing data - valid execution path
    if voltage < 12.1:
        attempt_start()
        if not verify_start():
            retry_start()  # Failure is normal - retry
            if not verify_start():
                alert("Generator failed to start")
                switch_to_manual()  # Degrade gracefully

# "Generator didn't start" is not a bug category - it's a valid execution path
# Design for it: retry, alert, switch to manual
```

---

### 3) Missing Data Is a First-Class Case (Line ~61)

**Context:** Missing data is a valid state, not a crash condition.

```python
# Brittle: crashes when data is missing
voltage = read_sensor()
if voltage < 12.1:  # Crashes if voltage is None
    start_generator()

# Robust: missing data is a first-class case
voltage = read_sensor()
if voltage is None:  # Missing data - valid state
    handle_missing_reading()
    return
if voltage < 12.1:
    start_generator()

# Homestead examples:
# Voltage sensor times out - no reading this cycle (valid state)
voltage = read_sensor(timeout=5)
if voltage is None:
    use_last_known_value()  # Valid state, not crash

# Config file doesn't exist on first boot - no saved preferences yet (valid state)
config = read_file("config.json")
if config is None:
    use_default_config()  # Valid state, not crash

# MQTT broker unreachable - no live sensor data (valid state)
data = receive_mqtt_message(timeout=10)
if data is None:
    use_cached_data()  # Valid state, not crash
```

---

### 4) Absence Is Not Zero, False, or Empty (Line ~84)

**Context:** Missing data means "we do not know" - not zero, false, or empty.

```python
# Wrong: treating missing as zero
voltage = read_sensor() or 0  # Missing becomes 0
if voltage < 12.1:  # Wrong decision: 0 < 12.1 is True
    start_generator()  # Starts generator when voltage unknown

# Wrong: treating missing as false
sensor_online = read_sensor() or False  # Missing becomes False
if not sensor_online:  # Wrong: unknown becomes "offline"
    handle_offline()

# Wrong: treating missing as empty
readings = get_readings() or []  # Missing becomes []
if not readings:  # Wrong: unknown becomes "no readings"
    use_default()

# Correct: missing means "we do not know"
voltage = read_sensor()
if voltage is None:  # Explicitly check for missing
    handle_unknown()  # "We do not know" - make explicit decision
    # Use last known value? Skip this cycle? Log and alert? Switch to manual?
elif voltage < 12.1:
    start_generator()

# Homestead: voltage reading missing
# Does not mean: voltage is zero, battery is dead, everything is fine
# Means: system lacks information
# Design decision: use last known value, skip cycle, log and alert, switch to manual
```

---

### 5) You Must Choose a Failure Strategy (Line ~103)

**Context:** When data is missing, system must choose response strategy; not choosing is choosing chaos.

```python
# Strategy 1: Use last known good value
voltage = read_sensor()
if voltage is None:
    voltage = last_known_voltage  # Use last good value
    flag_as_stale()  # But mark as stale

# Strategy 2: Skip this cycle
voltage = read_sensor()
if voltage is None:
    return  # Skip this cycle, don't make decision

# Strategy 3: Retry after delay
voltage = read_sensor()
if voltage is None:
    sleep(5)
    voltage = read_sensor()  # Retry
    if voltage is None:
        handle_timeout()

# Strategy 4: Log and alert
voltage = read_sensor()
if voltage is None:
    log_error("Voltage sensor timeout")
    send_alert("Sensor offline")
    switch_to_manual_mode()

# Strategy 5: Gracefully degrade
voltage = read_sensor()
if voltage is None:
    disable_automation()  # Stop automation
    enable_manual_control()  # Allow manual control
    display_status("Sensor offline - manual mode")

# Homestead: voltage sensor goes offline
# Decide in advance: use last known value but flag as stale?
# Skip generator logic until sensor returns?
# Alert and switch to manual-only?
# Document the choice, implement it, test it
```

---

### 6) Partial Truth Is Still Truth (Line ~122)

**Context:** Distinguish "I know this" from "I think this" from "I don't know this."

```python
# Robust system: distinguishes confidence levels
voltage = read_sensor()
voltage_age = time_since_last_reading()

if voltage is None:
    confidence = "unknown"  # I don't know this
elif voltage_age > 300:  # 5 minutes old
    confidence = "stale"   # I think this (but it's old)
else:
    confidence = "fresh"   # I know this

# Treating all data as equally reliable causes misfires
if confidence == "fresh" and voltage < 12.1:
    start_generator()  # Act on fresh data
elif confidence == "stale":
    log_warning("Using stale voltage reading")
    # Don't act on stale data
elif confidence == "unknown":
    use_last_known_value()
    flag_as_stale()

# Homestead: battery voltage is 12.2 V - or that reading is 5 minutes old
# Dashboard showing "12.2 V" without staleness misleads
# System distinguishing "I know" from "I think" makes better decisions
```

---

### 7) Confidence Levels Matter (Even If Implicit) (Line ~142)

**Context:** Fresh data more trustworthy than stale; direct measurements more trustworthy than inferred.

```python
# Implicit confidence: encode in design
voltage = read_sensor()
voltage_age = time_since_last_reading()

# Fresh data more trustworthy than stale
if voltage_age < 10:  # 10 seconds ago - high confidence
    if voltage < 12.1:
        start_generator()
elif voltage_age < 300:  # 5 minutes ago - low confidence
    log_warning("Using stale voltage")
    # Don't act on stale data
else:  # Very old - no confidence
    handle_missing()

# Direct measurements more trustworthy than inferred
temperature_direct = read_temperature_sensor()  # Direct - high confidence
temperature_inferred = infer_from_battery_resistance()  # Inferred - low confidence

if temperature_direct is not None:
    use_temperature(temperature_direct)  # Prefer direct
else:
    use_temperature(temperature_inferred, confidence="low")  # Fallback to inferred

# Recent failures reduce confidence
sensor_failures = count_recent_failures()
if sensor_failures > 3:
    confidence = "low"  # Wait for a few good readings before trusting
    require_multiple_good_readings()
```

---

### 8) Degraded Operation Beats No Operation (Line ~154)

**Context:** Systems that continue with reduced capability are more resilient than those that stop entirely.

```python
# Fragile: stops entirely on first failure
voltage = read_sensor()
if voltage is None:
    crash()  # System goes dark

# Resilient: degraded operation
voltage = read_sensor()
if voltage is None:
    display_status("Sensor offline - using cached data")
    voltage = last_known_voltage
    flag_as_stale()
    disable_automation()  # Reduced capability
    enable_manual_control()  # But still functional

# Examples:
# Battery monitor shows "sensor offline" but keeps logging
if voltage is None:
    log("Sensor offline")
    continue_logging()  # Degraded but functional

# Network service caches old data instead of failing
data = fetch_from_network()
if data is None:
    data = get_cached_data()  # Degraded but functional
    flag_as_stale()

# Control system disables automation but allows manual control
if sensor_offline:
    disable_automation()
    enable_manual_control()  # Degraded but functional

# Homestead: Wi-Fi drops
# Fragile: generator controller crashes, shows nothing
# Resilient: displays "offline - manual control only", keeps relay logic working locally
# Degraded beats dead
```

---

### 9) Failure Modes Are Design Decisions (Line ~172)

**Context:** Answer failure questions before failure occurs; these are design decisions, not implementation details.

```python
# Design decision: What happens if sensor fails?
def handle_sensor_failure():
    use_last_known_value()  # Decision: use last known
    flag_as_stale()          # Decision: flag as stale
    send_alert()             # Decision: alert

# Design decision: What happens if value is missing?
def handle_missing_value():
    skip_this_cycle()        # Decision: skip cycle
    # Don't start generator without reading

# Design decision: What happens if timing shifts?
def handle_timing_shift():
    revalidate_staleness()   # Decision: re-validate before acting
    if data_is_stale():
        don't_act()

# Design decision: What happens if connectivity lost?
def handle_connectivity_loss():
    switch_to_manual_only()  # Decision: manual-only mode
    keep_relay_logic_local()  # Decision: keep local control

# Design decision: What happens if state inconsistent?
def handle_inconsistent_state():
    log_error()             # Decision: log
    halt_automation()       # Decision: halt automation
    require_manual_reset()  # Decision: require reset

# Homestead: for each question, decide and document
# Sensor fails → use last known value, flag as stale, alert
# Value missing → skip this cycle, don't start generator
# Timing shifts → re-validate staleness before acting
# Connectivity lost → switch to manual-only, keep relay logic local
# State inconsistent → log, halt automation, require manual reset
# Answers are design; implementation follows
```

---

### 10) Silent Failure Is the Worst Failure (Line ~192)

**Context:** Systems that continue running but are quietly wrong are more dangerous than those that crash loudly.

```python
# Dangerous: silent failure
voltage = read_sensor() or 12.2  # Returns None, defaults to 12.2
display_voltage(voltage)  # Shows "12.2 V"
if voltage < 12.1:  # Never triggers (12.2 > 12.1)
    start_generator()  # Never starts
# Dashboard looks fine, battery suffers, no indication of problem

# Safe: loud failure
voltage = read_sensor()
if voltage is None:
    raise ValueError("Voltage sensor offline")  # Fails loudly
    # Or: display_error("Sensor offline"), send_alert(), switch_to_manual()

# Why logging matters
voltage = read_sensor()
if voltage is None:
    log_error("Voltage sensor timeout at {}".format(current_time()))
    # Noise reveals damage

# Why alerts matter
voltage = read_sensor()
if voltage is None:
    send_alert("Voltage sensor offline - check connection")
    # Noise reveals damage

# Why explicit "unknown" states matter
voltage = read_sensor()
if voltage is None:
    display_voltage("UNKNOWN")  # Explicit unknown state
    # Not silently showing stale value

# Homestead: generator controller displays "12.2 V" from stale reading
# Dashboard looks fine, actual voltage is 11.8 V, battery suffers
# Plausible-but-wrong - worse than visible error
```

---

### 11) Designing for Failure Makes Systems Calmer (Line ~211)

**Context:** Systems that expect failure have clear fallback paths and predictable degradation.

```python
# Anxious system: assumes perfection
voltage = read_sensor()
if voltage is None:
    panic()  # No fallback path
if voltage < 0 or voltage > 20:
    panic()  # Fragile logic
if voltage < 12.1:
    start_generator()
    if not verify_start():
        panic()  # Cascading failures

# Calm system: expects failure
voltage = read_sensor()
if voltage is None:
    voltage = last_known_voltage  # Clear fallback path
    flag_as_stale()
    log_warning("Using stale voltage")
if not (0 <= voltage <= 20):
    log_error("Invalid voltage reading")
    switch_to_manual()
    return
if voltage < 12.1:
    start_generator()
    if not verify_start():
        retry_start()  # Predictable behavior
        if not verify_start():
            alert("Generator failed to start")
            switch_to_manual()  # Controlled degradation

# Anxious: constant checks, fragile logic, cascading failures
# Calm: clear fallback paths, predictable behavior, controlled degradation
# Calmness is designed, not accidental
```

---

### Reflection: Failure Analysis Framework (Line ~232)

**Context:** Framework for analyzing what happens when inputs fail.

```python
# For each input, ask:

# What happens if it's missing?
voltage = read_sensor()
if voltage is None:  # Missing
    use_last_known_value()
    flag_as_stale()

# What happens if it's late?
voltage = read_sensor()
if time_since_last_reading() > 300:  # Late (5 minutes)
    flag_as_stale()
    don't_act_on_stale_data()

# What happens if it's wrong?
voltage = read_sensor()
if not (0 <= voltage <= 20):  # Wrong (out of range)
    log_error("Invalid voltage reading")
    reject_and_alert()

# What happens if it never returns?
voltage = read_sensor(timeout=30)
if voltage is None:  # Never returns
    switch_to_manual_mode()
    send_alert("Sensor offline - manual control only")

# If you can't answer these questions confidently, the system is unfinished
```

