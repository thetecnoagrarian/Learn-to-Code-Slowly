# Section A Phase 2 · Chapter 2.05: Functions as Named Behavior

Chapter 1.4 introduced an idea that had almost nothing to do with computers and everything to do with humans: functions exist to make behavior understandable. Chapter 1.11 sharpened that idea: abstraction compresses reality into names, and the name must not lie. This chapter expresses both ideas in Python syntax. Chapter 2.02 showed how Python names and stores state. Chapter 2.03 showed how Python uses that state to choose paths. Chapter 2.04 showed how Python repeats those choices over time. This chapter shows how Python names those patterns, how to group behavior into reusable, understandable units. Functions do not give Python new power. They give you power, the power to reason about behavior without holding the entire system in your head at once.

## Learning Objectives

After this chapter, you will be able to:
- Understand that functions do not change what Python can do
- Recognize why humans need functions
- Define functions using def
- Understand the difference between definition and execution
- Call functions to execute their behavior
- Use parameters to pass input to functions
- Use return to produce output from functions
- Understand function isolation and scope
- Recognize functions as contracts
- Separate observation from action in functions

## Key Terms

- **Function**: A name attached to behavior that already exists
- **Definition**: When Python stores a function and associates a name with it
- **Execution**: When Python actually runs the function body
- **Parameter**: A local name that receives input when a function is called
- **Argument**: A value passed to a function at call time
- **return**: A statement that ends function execution and produces a value
- **Isolation**: How functions prevent code from accidentally affecting other parts of the system

## 1) Functions Do Not Change What Python Can Do

This is an important grounding statement. Python can execute instructions, Chapter 2.01, change state, Chapter 2.02, branch on conditions, Chapter 2.03, and repeat with loops, Chapter 2.04. Functions do not add new capabilities. They organize existing capabilities into named units. A function is not a shortcut. A function is not optimization. A function is not intelligence. A function is a name attached to behavior that already exists. read_voltage names read sensor and return value. read_coop_temp names read DHT22 and return temp. check_fence names read fence sensor and return voltage. The behavior exists. The function names it.

Functions do not change what Python can do.

## 2) Why Humans Need Functions

Computers do not care about functions. They are perfectly happy executing one long list of instructions from top to bottom. Humans are not. Without functions, programs become unreadable, voltage equals sensor dot read if voltage less than twelve point one colon relay dot on voltage equals sensor dot read if voltage less than twelve point one colon relay dot on, repetitive, unclear, intent disappears, what does sensor dot read mean? what does relay dot on do? bugs hide in long sequences, typo in one place, bug everywhere, and changes become dangerous, change sensor dot read in one place, breaks everywhere.

Homestead example: without functions, you'd write dht22 dot read_temp fan_relay dot on dht22 dot read_temp fan_relay dot on repeatedly. With functions: read_coop_temp start_fan, names that carry meaning, reusable, changeable in one place. Functions exist so humans can say this group of instructions represents one idea. read_voltage represents get battery voltage. read_coop_temp represents get coop temperature. check_fence represents get fence voltage. That is the entire purpose. Without functions, you'd write sensor dot read dht22 dot read_temp fence_sensor dot read everywhere. With functions, you write read_voltage read_coop_temp check_fence, names that carry meaning.

## 3) Defining a Function with def

In Python, functions are defined using the def keyword. def read_voltage colon return twelve point one. This line does not read voltage, execute code, or return a value. It does exactly one thing: it tells Python here is a block of instructions, and its name is read_voltage.

Defining a function with def stores the behavior and names it.

## 4) Definition Is Not Execution

This distinction is foundational. When Python reads a def statement, it stores the function, it associates the name with the function, and it moves on. Nothing inside the function runs yet. This separation, definition versus execution, is critical. Chapter 2.01: definition time versus execution time. Functions are defined at definition time. They execute at call time.

Many early bugs come from forgetting this. You define read_voltage and expect it to run immediately, it doesn't. You must call it: voltage equals read_voltage. Same for read_coop_temp check_fence, define once, call when needed. Definition is not execution.

## 5) Calling a Function Executes Its Behavior

A function runs only when it is called. voltage equals read_voltage. Or: coop_temp equals read_coop_temp. Or: fence_voltage equals check_fence. Now Python looks up the name, read_voltage read_coop_temp check_fence, finds the function, executes the function body, encounters return, produces a value, and assigns that value to the variable, voltage coop_temp fence_voltage. Calling is an instruction like any other. Chapter 2.01: execution order matters. voltage equals read_voltage executes when Python reaches that line, not before.

It happens in sequence. voltage equals read_voltage if voltage less than twelve point one colon start_generator, read first, then check, then act. Order matters. It happens at a moment in time. Chapter 1.7: time matters. The function executes at that moment, with that state. Five seconds later, calling read_voltage again might return a different value.

## 6) Define Once, Call Many Times

One of the core powers of functions is reuse. def read_voltage colon return twelve point one. Or: def read_coop_temp colon return seventy-five. Or: def check_fence colon return four point two. This definition exists once. You can call it in a loop, while True colon voltage equals read_voltage time dot sleep five, in a condition, if read_coop_temp greater than eighty-five colon start_fan, in multiple places, check_fence called from multiple modules, and across modules, import read_voltage from sensor module. The behavior stays consistent. read_voltage always reads voltage. read_coop_temp always reads coop temp. check_fence always checks fence. The implementation might change, different sensor, different ESP32, but the name stays the same. The name becomes a stable reference. You can call read_voltage in loops, Chapter 2.04, in conditions, Chapter 2.03, anywhere. The name is stable. The behavior is consistent.

## 7) Functions Accept Input Through Parameters

Functions become more useful when they accept input. def check_threshold voltage comma threshold colon return voltage less than threshold. Or: def is_temp_high coop_temp comma max_temp colon return coop_temp greater than max_temp. Or: def is_fence_low fence_voltage comma min_voltage colon return fence_voltage less than min_voltage. Here voltage, or coop_temp fence_voltage, is a parameter, and threshold, or max_temp min_voltage, is a parameter. Parameters are local names that exist only while the function runs. Chapter 2.02: names refer to values. Parameters are names that refer to the arguments passed in. They receive values when the function is called. check_threshold twelve point zero comma twelve point one, voltage receives twelve point zero, threshold receives twelve point one. is_temp_high eighty-six comma eighty-five, coop_temp receives eighty-six, max_temp receives eighty-five. Values flow in through parameters.

## 8) Arguments Are Passed at Call Time

is_low equals check_threshold twelve point zero comma twelve point one. Or: is_hot equals is_temp_high eighty-six comma eighty-five. Or: is_down equals is_fence_low one point nine comma two point zero. At call time, voltage refers to twelve point zero, or coop_temp refers to eighty-six, fence_voltage refers to one point nine, and threshold refers to twelve point one, or max_temp refers to eighty-five, min_voltage refers to two point zero. Inside the function, these are just variables, Chapter 2.02: names refer to values, no different from any other names, voltage threshold coop_temp max_temp, all just names. When the function finishes, the parameters disappear, voltage threshold coop_temp max_temp, gone, and their values are gone unless returned, twelve point zero twelve point one eighty-six eighty-five, gone, unless returned.

Homestead example: def check_threshold voltage comma threshold colon return voltage less than threshold. Inside the function, voltage and threshold are just names. When the function returns, those names disappear. The return value, True or False, survives. Isolation.

## 9) Parameters Are Temporary State

This matters more than it seems. Parameters exist only during function execution, cannot leak accidentally, and protect outside state. This isolation is how functions prevent chaos. read_voltage can't accidentally change coop_temp. read_coop_temp can't accidentally change fence_voltage. Each function sees only its own parameters and local variables. Without it, every piece of code could change everything. One typo: voltage equals twelve point one becomes coop_temp equals twelve point one, breaks everything. With isolation, that typo is contained. Chapter 1.11: abstraction creates boundaries. Functions are those boundaries.

## 10) Functions Return Values with return

The return statement ends function execution and produces a value. def read_voltage colon return twelve point one. Or: def read_coop_temp colon return seventy-five. Or: def check_fence colon return four point two. When Python hits return, the function stops, no more code executes in that function, and the value becomes the result of the call, twelve point one seventy-five four point two.

Homestead example: voltage equals read_voltage, read_voltage executes, hits return twelve point one, stops, voltage receives twelve point one. coop_temp equals read_coop_temp, read_coop_temp executes, hits return seventy-five, stops, coop_temp receives seventy-five. The return value flows out. Chapter 2.02: assignment changes what a name refers to. The return value becomes what voltage, or coop_temp, refers to.

## 11) A Function Without return Returns None

def log_voltage voltage colon print voltage. Or: def log_coop_temp coop_temp colon print coop_temp. Or: def log_fence fence_voltage colon print fence_voltage. This function prints something and returns nothing. Calling it produces None. voltage equals log_voltage twelve point one, voltage is None, not twelve point one. Same for coop_temp equals log_coop_temp seventy-five, fence_voltage equals log_fence four point two. This is not an error. Python doesn't require every function to return a value. Some functions just do things, log display act. It is explicit behavior. If a function has no return, it returns None. voltage equals log_voltage twelve point one, voltage is None. That's intentional. Chapter 1.7: None is a value. Functions without return return None.

## 12) return vs print

return produces data, feeds logic, and enables decisions. print displays information, is observational, and does not affect logic. Confusing these causes brittle programs. A function that prints instead of returning cannot be reused easily, can't chain: if log_voltage twelve point one less than twelve point one colon, error, None less than twelve point one, cannot be tested cleanly, can't check return value, must capture print output, and cannot feed conditions or loops, if log_coop_temp seventy-five greater than eighty-five colon, error, None greater than eighty-five.

return versus print matters.

## 13) Functions Should Usually Return Data

Unless a function's explicit purpose is output, logging display UI, it should return data. Observation produces data. read_voltage returns voltage. read_coop_temp returns temp. check_fence returns voltage. Data flows out through return. Action changes state. start_generator changes generator_state. start_fan changes fan_on. alert_fence_down publishes to MQTT. State changes through side effects, not return values. Printing is neither. print voltage displays information but doesn't produce data or change state. It's for humans, not for logic. Chapter 1.12: observation versus action. Printing is observation for humans, not action for the system.

## 14) Default Parameters Add Flexibility

Python allows default parameter values. def check_threshold voltage comma threshold equals twelve point one colon return voltage less than threshold. Or: def is_temp_high coop_temp comma max_temp equals eighty-five colon return coop_temp greater than max_temp. Or: def is_fence_low fence_voltage comma min_voltage equals two point zero colon return fence_voltage less than min_voltage. If threshold, or max_temp min_voltage, is not provided, Python uses the default, twelve point one eighty-five two point zero. If it is provided, the default is overridden. This allows simple calls, check_threshold twelve point zero uses default twelve point one, is_temp_high eighty-six uses default eighty-five, advanced configuration, check_threshold twelve point zero comma twelve point five overrides default, is_temp_high eighty-six comma ninety overrides default, and clean interfaces, most calls use defaults, special cases override.

Homestead example: def is_temp_high coop_temp comma max_temp equals eighty-five colon return coop_temp greater than max_temp. Most calls: is_temp_high eighty-six, uses eighty-five. Special case: is_temp_high eighty-six comma ninety, uses ninety. Defaults encode typical usage.

## 15) Defaults Are Part of the Contract

A default value is not arbitrary. It encodes expected behavior, threshold equals twelve point one means twelve point one is the typical threshold, typical usage, max_temp equals eighty-five means eighty-five is the typical max temp, and design assumptions, min_voltage equals two point zero means two point zero is the typical min fence voltage. Changing defaults later is a breaking change. If you change threshold equals twelve point one to threshold equals twelve point zero, all code that relied on twelve point one breaks. If you change max_temp equals eighty-five to max_temp equals eighty, all code that relied on eighty-five breaks. Treat them with care. Defaults are part of the contract. Changing them breaks the contract. Chapter 1.11: abstraction must not lie. Defaults are promises.

## 16) Functions Create Isolation

Variables defined inside a function are local. def read_voltage colon voltage equals twelve point one return voltage. Or: def read_coop_temp colon coop_temp equals seventy-five return coop_temp. Or: def check_fence colon fence_voltage equals four point two return fence_voltage. The name voltage, or coop_temp fence_voltage, inside the function does not affect voltage, or coop_temp fence_voltage, outside, does not leak, and cannot collide accidentally. This isolation is not convenience. It is safety. Without isolation, read_voltage could accidentally change coop_temp. With isolation, read_voltage can only change its own voltage variable. Chapter 2.06: scope enforces this isolation. Functions create the first level of scope boundaries.

## 17) Isolation Is How Systems Scale

Large systems work because most code cannot see most state, behavior is contained, and interfaces are narrow. Functions are the first boundary. read_voltage is isolated from read_coop_temp. Each function has its own scope. Chapter 2.06: scope makes this explicit. Later, modules and processes do the same thing. Chapter 1.14: modules create larger boundaries. Functions arrow modules arrow processes. Each level adds isolation. Chapter 1.11: abstraction creates boundaries at every level.

## 18) Functions Are Contracts

A function's name is a promise. When you name a function, you tell the reader what it does, you set expectations, and you define responsibility. Breaking that promise is worse than a bug. A bug is a mistake. Breaking a contract is intentional deception. It destroys trust. If read_voltage starts the generator, you can't trust any function name. If read_coop_temp starts the fan, you can't reason about the system. Chapter 1.11: abstraction must not lie. Function names are promises. Keep them.

## 19) Names Must Match Behavior

def read_voltage colon start_generator return twelve point one. Or: def read_coop_temp colon start_fan return seventy-five. Or: def check_fence colon alert_fence_down return four point two. This function lies. The name promises observation, read check. The behavior performs action, start_generator start_fan alert_fence_down. This violates Chapter 1.11. Chapter 1.12: observation versus action. Names must not lie. And it creates unpredictable systems. Calling read_voltage starts the generator unexpectedly. Calling read_coop_temp starts the fan unexpectedly.

## 20) Separate Observation from Action

Good structure: def read_voltage colon return sensor dot read. def start_generator colon relay dot on. Or: def read_coop_temp colon return dht22 dot read_temp. def start_fan colon fan_relay dot on. Or: def check_fence colon return fence_sensor dot read. def alert_fence_down colon mqtt dot publish fence_down. Then combine at a higher level: voltage equals read_voltage if voltage less than twelve point one colon start_generator. Or: coop_temp equals read_coop_temp if coop_temp greater than eighty-five colon start_fan. Or: fence_voltage equals check_fence if fence_voltage less than two point zero colon alert_fence_down. Observe. voltage equals read_voltage coop_temp equals read_coop_temp fence_voltage equals check_fence. Decide. if voltage less than twelve point one colon if coop_temp greater than eighty-five colon if fence_voltage less than two point zero colon. Act. start_generator start_fan alert_fence_down. Always. Chapter 1.12: observation versus action. Chapter 2.03: conditions observe. Chapter 2.04: loops repeat observe slash decide slash act. This chapter: functions name those patterns. Functions make the pattern explicit and reusable.

## 21) Functions Can Do One Thing or Orchestrate Many

Some functions perform one small operation, read_voltage read_coop_temp check_fence. Others coordinate multiple steps, monitor_battery control_coop manage_fence. Both are valid. read_voltage does one thing. monitor_battery does many things, read check decide act wait. What matters is that the name matches the role. read_voltage promises one operation. monitor_battery promises coordination. The name sets expectations. Chapter 1.11: abstraction must not lie. The name must match the role.

## 22) Docstrings Describe the Contract

A docstring explains what the function does, what it returns, what inputs mean, and what failure looks like. def read_voltage colon triple quote Read the battery voltage. Returns a float voltage, or None if the sensor is unavailable. triple quote. Or: def read_coop_temp colon triple quote Read the coop temperature from DHT22 sensor. Returns a float temperature in Fahrenheit, or None if sensor is offline. triple quote. def check_fence colon triple quote Check the electric poultry net voltage. Returns a float voltage in kilovolts, or None if ESP32 is disconnected. triple quote. Docstrings are not comments. Comments explain how. Docstrings explain what. They are documentation of intent. The docstring says this function reads voltage and returns None if unavailable. The code says how, sensor dot read error handling. The docstring says what, read voltage return float or None. Chapter 1.11: abstraction preserves meaning. Docstrings preserve meaning.

## 23) Docstrings Should Explain What, Not How

How is code. What is contract. If you change the implementation but keep the contract, callers don't break. That is abstraction done correctly.

Docstrings should explain what, not how.

## 24) Functions Make Testing Possible

Because functions accept input, return output, and isolate behavior, they can be tested. Without functions, everything is entangled, voltage reading mixed with generator control, coop temp mixed with fan control, tests require full system setup, need real sensor real relay real ESP32, and bugs hide longer, can't test read_voltage independently, must test entire system. Functions are the unit of reasoning. You can reason about read_voltage without thinking about read_coop_temp. You can test read_voltage without setting up the entire homestead. Functions create boundaries that enable reasoning. Chapter 1.11: abstraction enables reasoning.

## 25) Functions Control Complexity Growth

Recall Chapter 1.13: complexity grows sideways. Functions name paths, contain branches, and limit mental load. They don't remove complexity. They make it navigable.

Functions control complexity growth.

## Common Pitfalls

Confusing definition with execution causes bugs. Functions are defined at definition time. They execute at call time. Don't expect functions to run when defined.

Forgetting to call functions causes nothing to happen. Defining a function doesn't run it. You must call it. Don't forget to call functions.

Confusing return with print causes brittle programs. return produces data. print displays information. Use return for logic. Use print for humans. Don't confuse them.

Mixing observation and action in functions breaks contracts. Function names are promises. If read_voltage starts the generator, the promise is broken. Separate observation from action. Don't mix them.

Not using parameters causes repetitive code. Functions accept input through parameters. Use parameters to make functions reusable. Don't hardcode values.

Forgetting that parameters are temporary causes confusion. Parameters exist only during function execution. They disappear when the function returns. Don't expect parameters to persist.

Not returning values causes None. Functions without return return None. If you need data, use return. Don't forget return.

## Summary

Python uses def to define functions. Functions group behavior into named units. Definition is not execution. Parameters receive input. return produces output. Functions create isolation and boundaries. Function names are contracts. Abstraction must not lie. Functions do not change what Python can do. They organize existing capabilities into named units. Humans need functions because programs become unreadable without them. Functions are defined using def. Definition is not execution. Calling a function executes its behavior. Define once, call many times. Functions accept input through parameters. Arguments are passed at call time. Parameters are temporary state. Functions return values with return. A function without return returns None. return versus print matters. Functions should usually return data. Default parameters add flexibility. Defaults are part of the contract. Functions create isolation. Isolation is how systems scale. Functions are contracts. Names must match behavior. Separate observation from action. Functions can do one thing or orchestrate many. Docstrings describe the contract. Docstrings should explain what, not how. Functions make testing possible. Functions control complexity growth.

## Next

This chapter showed how Python names behavior into reusable units. Functions group behavior into named units. Definition is not execution. Parameters receive input. return produces output. Functions create isolation and boundaries. Next, Chapter 2.06 explores scope and isolation, where we make these boundaries explicit and learn how Python enforces them. Understanding functions makes scope feel obvious rather than mysterious.
