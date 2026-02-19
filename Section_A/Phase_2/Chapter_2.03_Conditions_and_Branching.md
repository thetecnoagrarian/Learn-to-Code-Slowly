# Section A Phase 2 · Chapter 2.03: Conditions and Branching

Chapter 1.2 introduced a critical truth: programs do not decide, they branch. This chapter expresses that truth in Python syntax. Chapter 2.02 showed how Python names and stores state. This chapter shows how Python uses that state to choose paths. Conditions evaluate state and produce True or False. Python follows one path or another based on those booleans. Nothing mystical is happening here. Nothing intelligent is happening here. Python evaluates conditions. Those conditions produce True or False. Python follows one path or another. That's the entire mechanism.

## Learning Objectives

After this chapter, you will be able to:
- Understand conditions as expressions that evaluate to True or False
- Recognize that conditions are evaluated at a specific moment in time
- Use if, elif, and else statements to create branches
- Understand how logical operators combine booleans
- Recognize that every condition creates paths
- Understand how paths multiply with complexity
- Use naming to preserve meaning and control complexity
- Keep conditions as observation, not action

## Key Terms

- **Condition**: An expression that evaluates to a boolean value (True or False)
- **Boolean**: A value that is either True or False
- **Branch**: A path of execution chosen based on a condition
- **Short-Circuiting**: When Python stops evaluating a logical expression early
- **elif**: A condition checked only if previous conditions failed
- **Decision Tree**: A structure where exactly one path executes based on mutually exclusive conditions

## 1) What a Condition Really Is

A condition is an expression that evaluates to a boolean value. A boolean value is either True or False. No in-between. No kind of. No intuition. Every condition collapses reality into one of those two values. voltage less than twelve point one produces True or False. coop_temp greater than eighty-five produces True or False. fence_voltage less than two point zero produces True or False. No maybe, no probably, no close enough. This collapse is not philosophy. It is mechanics.

Every condition collapses reality into True or False.

## 2) Conditions Are Evaluated At a Moment in Time

A condition is not timeless. It is evaluated at a specific line of code, using the current state, and using the current values of variables. If state changes later, the condition may evaluate differently later. voltage was twelve point two, now it's twelve point zero, same condition, different result. coop_temp was eighty-four, now it's eighty-six, same condition, different result. Same code. Different moment. Different result.

Homestead example: your battery monitor checks voltage less than twelve point one every five seconds. First check: voltage equals twelve point two, condition False, generator stays off. Five seconds later: voltage equals twelve point zero, condition True, generator starts. Same code, different state, different path. This is where time quietly enters the system. Chapter 1.7: time matters. Conditions are evaluated at a moment in time.

## 3) The if Statement Is a Fork

An if statement creates a fork in execution. if voltage less than twelve point one colon start_generator. Or: if coop_temp greater than eighty-five colon start_fan. Or: if fence_voltage less than two point zero colon alert_fence_down. Python does the following, step by step: look up the name, voltage, coop_temp, fence_voltage, retrieve the value it refers to, compare that value to the threshold, twelve point one, eighty-five, two point zero, produce True or False, if True, execute the indented block, if False, skip it. Nothing more. No intent. No memory of the future. No understanding of consequences.

The if statement is a fork.

## 4) Two Paths Always Exist

Every if has two paths: the True path and the False path. Even if you don't write code for the False path, it still exists. Nothing happens is still a path. if voltage less than twelve point one colon start_generator, what if voltage greater than or equal to twelve point one? Nothing happens. That's a path. if coop_temp greater than eighty-five colon start_fan, what if coop_temp less than or equal to eighty-five? Nothing happens. That's a path. Many bugs live there. Generator doesn't start when it should? Check the False path. Fan doesn't run? Check the False path. The path exists even if you didn't write it.

Two paths always exist.

## 5) Skipped Code Is Still Executed Logic

When Python skips a block, it does not ignore it, it intentionally chooses not to execute it. This distinction matters. When Python skips if voltage less than twelve point one colon start_generator, it's not ignoring the code, it's choosing not to execute it because voltage is greater than or equal to twelve point one. When it skips if coop_temp greater than eighty-five colon start_fan, it's choosing not to execute because coop_temp is less than or equal to eighty-five. You must reason about skipped paths just as carefully as executed ones. What happens when the generator doesn't start? What happens when the fan doesn't run? Those are skipped paths. They matter.

Skipped code is still executed logic.

## 6) Conditions Depend Entirely on State

This condition: if voltage less than twelve point one. Or: if coop_temp greater than eighty-five, if fence_voltage less than two point zero, if solar_watts greater than five thousand. Means nothing without state. Questions you should automatically ask: when was voltage, or coop_temp, fence_voltage, solar_watts, last updated? Where did it come from? sensor, ESP32, MQTT? Is it guaranteed to be a number? Could it be missing? sensor offline, ESP32 disconnected? Could it be stale? last reading was five minutes ago? Python will not ask these questions for you. It will evaluate voltage less than twelve point one even if voltage is None, error, or if voltage is from yesterday, stale, or if the sensor is offline, missing. Python assumes you already did. Chapter 2.02: state lives in names. This chapter: conditions depend on that state being valid.

Conditions depend entirely on state.

## 7) Comparison Operators Are Mechanical

Python provides comparison operators. They are not flexible. They are not forgiving. They do exactly one thing. Double equals equal, exclamation equals not equal, less than, greater than, less than or equal, greater than or equal. Each comparison takes two values and produces True or False. Nothing else. voltage less than twelve point one compares voltage to twelve point one, produces True or False. coop_temp greater than eighty-five compares coop_temp to eighty-five, produces True or False. fence_voltage double equals four point two compares fence_voltage to four point two, produces True or False. Mechanical. No interpretation.

Comparison operators are mechanical.

## 8) Equality Is Exact

voltage double equals twelve point one. This means exact equality. Not close enough. Not about. Not within tolerance. Exact. For sensor data, this is often the wrong check. A DHT22 reading seventy-five point zero versus seventy-five point one, are they equal? A voltage sensor reading twelve point one versus twelve point zero nine, equal? Probably not. Use ranges: voltage less than twelve point one, coop_temp greater than eighty-five, fence_voltage less than two point zero. Understanding this early prevents subtle failures later.

Equality is exact.

## 9) Logical Operators Combine Booleans

Logical operators work on booleans. Not meanings. Not intentions. Booleans. and means all must be True. or means at least one must be True. not means invert the boolean. Homestead example: voltage less than twelve point one produces True. generator_state double equals off produces True. True and True produces True. If either is False, the whole expression is False. Same idea: coop_temp greater than eighty-five and fan_on double equals False, both must be True. fence_voltage less than two point zero or is_energized double equals False, at least one must be True.

Example: if voltage less than twelve point one and generator_state double equals off. Or: if coop_temp greater than eighty-five and fan_on double equals False, if fence_voltage less than two point zero and is_energized double equals True. Python evaluates this as: evaluate voltage less than twelve point one, or coop_temp greater than eighty-five, fence_voltage less than two point zero, evaluate generator_state double equals off, or fan_on double equals False, is_energized double equals True, combine the two booleans using and, branch on the result.

## 10) Short-Circuiting Is Still Order

Python evaluates logical expressions left to right. With and, stop at the first False. With or, stop at the first True. This is called short-circuiting. It is an optimization. It is also a rule. Order matters.

Homestead example: if esp32_connected and coop_temp greater than eighty-five, if esp32_connected is False, Python never checks coop_temp. That's safe, no error if ESP32 is offline. But if coop_temp greater than eighty-five and esp32_connected, Python checks coop_temp first, might error if ESP32 is offline and coop_temp is None. Order protects you, or hides bugs. Choose deliberately. Short-circuiting is still order.

## 11) Order Can Change Meaning

if sensor_online and voltage less than twelve point one. Is not the same as: if voltage less than twelve point one and sensor_online. If sensor_online is False, Python never evaluates voltage less than twelve point one. Same idea: if esp32_connected and coop_temp greater than eighty-five versus if coop_temp greater than eighty-five and esp32_connected. If esp32_connected is False, Python never checks coop_temp. Order matters. That may be intentional. Or it may hide a bug. You must choose deliberately.

Order can change meaning.

## 12) else Makes the Second Path Visible

if voltage less than twelve point one colon start_generator else colon log_normal. Or: if coop_temp greater than eighty-five colon start_fan else colon log_normal_temp. Or: if fence_voltage less than two point zero colon alert_fence_down else colon log_fence_ok. This forces you to think about both paths. What happens when voltage is greater than or equal to twelve point one? What happens when coop_temp is less than or equal to eighty-five? What happens when fence_voltage is greater than or equal to two point zero? The else makes you answer. This is almost always healthier than leaving the False path implicit. Without else, the False path is do nothing, but is that what you want? With else, you must decide. Explicit structure reduces cognitive load. You don't have to remember what happens if the condition is False, it's written down.

else makes the second path visible.

## 13) elif Creates One Decision Tree

elif means only check this if everything above failed. if voltage less than twelve point one colon start_generator elif voltage greater than fifteen point zero colon alert_high_voltage else colon log_normal. Or: if coop_temp greater than eighty-five colon start_fan elif coop_temp less than thirty-two colon alert_freezing else colon log_normal_temp. Or: if fence_voltage less than two point zero colon alert_fence_down elif fence_voltage greater than five point zero colon alert_overvoltage else colon log_fence_ok. Exactly one branch executes. Voltage can't be both less than twelve point one and greater than fifteen point zero. Coop temp can't be both greater than eighty-five and less than thirty-two. Fence voltage can't be both less than two point zero and greater than five point zero. Mutually exclusive conditions mean exactly one path runs. This is one decision. One condition evaluated, one path chosen. Not multiple independent checks, one decision tree.

elif creates one decision tree.

## 14) elif Is Not Nesting

This: if voltage less than twelve point one colon dot dot dot elif voltage greater than fifteen point zero colon dot dot dot. Is not the same as: if voltage less than twelve point one colon dot dot dot else colon if voltage greater than fifteen point zero colon dot dot dot. The first is a single decision tree. One condition: voltage. Three paths: low, high, normal. The second is nested branching. First condition: voltage. If False, then check voltage again. Two separate decisions.

Homestead example: if coop_temp greater than eighty-five colon start_fan elif coop_temp less than thirty-two colon alert_freezing else colon log_normal, one decision. Versus if coop_temp greater than eighty-five colon start_fan else colon if coop_temp less than thirty-two colon alert_freezing else colon log_normal, nested. They behave differently under complexity. Chapter 1.13: complexity grows sideways. Nested branching multiplies paths faster.

## 15) When to Use elif

Use elif when conditions are mutually exclusive and only one path should run. Voltage states are a classic example: low, normal, high. Same idea: coop temperature, too hot, normal, freezing, fence voltage, low, normal, overvoltage, solar production, none, low, high. Only one can be true at a time.

Use elif when conditions are mutually exclusive.

## 16) When to Use Nested if

Use nested if when conditions are independent and multiple actions may be required. Example: voltage low, generator off, cooldown complete. Or: coop temp high AND fan off AND power available. Or: fence voltage low AND energizer on AND no fault detected. These are separate facts. Multiple conditions can be true simultaneously.

Use nested if when conditions are independent.

## 17) Branches Multiply Paths

One condition produces two paths. Two conditions produce four paths. Three conditions produce eight paths. This is Chapter 1.13 in action. Complexity grows sideways, not deeper code, but more paths. Your code may be short. if voltage less than twelve point one and generator_state double equals off and cooldown_complete colon start_generator, one line. Your behavior space may be large. Two conditions produce four paths. Three conditions produce eight paths. voltage, low or normal, generator_state, on or off, cooldown_complete, yes or no, produces eight combinations. Same idea: coop_temp, hot or normal or cold, fan_on, on or off, power_available, yes or no, produces many paths. Short code, large behavior space.

Branches multiply paths.

## 18) Most Bugs Live in Rare Paths

Common paths get tested. Rare paths rot. Examples: sensor offline, ESP32 loses Wi‑Fi, DHT22 disconnected, first startup after reboot, no state file, defaults apply, boundary values, voltage exactly twelve point one, coop_temp exactly eighty-five, fence_voltage exactly two point zero, timing overlaps, solar production drops while battery charging. Conditions create these paths. Every if, elif, else creates paths. Every and, or multiplies paths. Rare paths are easy to forget.

You must name them or test them. Name them: if should_start_generator colon makes the path explicit. Or test them: what happens when ESP32 is offline? What happens when voltage is exactly twelve point one? What happens when coop_temp is exactly eighty-five? Test the rare paths, or they'll surprise you.

Most bugs live in rare paths.

## 19) Conditions Should Observe, Not Act

Evaluating a condition should not change state. A condition observes state, it doesn't modify it. This is Chapter 1.12 made concrete. Observation versus action. Conditions observe. Actions act. Never mix them.

Bad: if get_voltage_and_start_generator less than twelve point one colon. Or: if read_coop_temp_and_start_fan greater than eighty-five colon, if check_fence_and_alert less than two point zero colon. Good: voltage equals get_voltage if voltage less than twelve point one colon start_generator. Or: coop_temp equals read_coop_temp if coop_temp greater than eighty-five colon start_fan. Or: fence_voltage equals check_fence if fence_voltage less than two point zero colon alert_fence_down. Observe. Decide. Act. Always in that order.

Conditions should observe, not act.

## 20) Naming Conditions Preserves Meaning

This: if voltage less than twelve point one and generator_state double equals off and cooldown_complete colon. Or: if coop_temp greater than eighty-five and fan_on double equals False and power_available colon, if fence_voltage less than two point zero and is_energized double equals True and no_fault colon. Works. But this: if should_start_generator colon. Or: if should_start_fan colon, if should_alert_fence colon. Reads. The name carries intent. should_start_generator says what you're checking. should_start_fan says what you're checking. should_alert_fence says what you're checking. The logic lives elsewhere. The function contains the details: voltage less than twelve point one and generator_state double equals off and cooldown_complete. The condition name abstracts that complexity. This is abstraction done honestly. Chapter 1.11: abstraction preserves meaning. Naming conditions preserves meaning and hides complexity.

Naming conditions preserves meaning.

## 21) Conditions Are Contracts

A condition is a promise: if this expression is True, the program may take this path. If the condition lies, the path misfires. should_start_generator returns True, but voltage is twelve point five, the condition lied. should_start_fan returns True, but fan is already on, the condition lied. Truthfulness matters. Conditions are contracts. If they're True, the path is valid. If they're False, the path is invalid. If they lie, bugs happen.

Conditions are contracts.

## 22) Python Does Not Protect You Here

Python will evaluate the condition and follow the path. It will not warn you about missing cases, ensure coverage, or validate intent. That responsibility is yours.

Python does not protect you here.

## 23) Debugging Conditions Is Tracing State

When a condition behaves unexpectedly, print the values, voltage, coop_temp, fence_voltage, what are they actually? Inspect the state, when was it last updated? where did it come from? Verify assumptions, is voltage guaranteed to be a number? could coop_temp be None? The bug is almost never in if. if voltage less than twelve point one colon is correct. The bug is in what feeds it. voltage is None, missing, voltage is stale, from yesterday, voltage is wrong, wrong sensor. Chapter 2.02: state lives in names. This chapter: conditions depend on that state. Debug conditions by debugging state.

Debugging conditions is tracing state.

## Common Pitfalls

Forgetting that conditions are evaluated at a moment in time causes timing bugs. State changes over time. Conditions evaluate at specific moments. Don't forget timing.

Ignoring the False path causes bugs. Every if has two paths. The False path exists even if you don't write it. Don't ignore the False path.

Using exact equality for sensor data causes subtle failures. Sensor readings are rarely exact. Use ranges instead. Don't use exact equality for sensor data.

Mixing observation and action in conditions causes bugs. Conditions should observe, not act. Observe, decide, act. Always in that order. Don't mix observation and action.

Not understanding short-circuiting causes order bugs. Python evaluates left to right. Order matters. Don't ignore order.

Forgetting that branches multiply paths causes complexity bugs. One condition produces two paths. Two conditions produce four paths. Paths multiply. Don't forget complexity.

Not testing rare paths causes bugs. Common paths get tested. Rare paths rot. Test the rare paths. Don't forget rare paths.

## Summary

Python branches using if, elif, and else. Conditions evaluate to True or False based on current state. Every condition creates paths. Paths multiply with complexity. Order matters. Observation should not cause action. Naming conditions preserves meaning and controls complexity. A condition is an expression that evaluates to a boolean value. Conditions are evaluated at a moment in time. The if statement creates a fork. Two paths always exist. Skipped code is still executed logic. Conditions depend entirely on state. Comparison operators are mechanical. Equality is exact. Logical operators combine booleans. Short-circuiting is still order. Order can change meaning. else makes the second path visible. elif creates one decision tree. elif is not nesting. Use elif when conditions are mutually exclusive. Use nested if when conditions are independent. Branches multiply paths. Most bugs live in rare paths. Conditions should observe, not act. Naming conditions preserves meaning. Conditions are contracts. Python does not protect you here. Debugging conditions is tracing state.

## Next

This chapter showed how Python uses state to choose paths. Conditions evaluate to True or False. Python branches based on those booleans. Next, Chapter 2.04 explores loops and repetition, where these branches start repeating over time and state truly begins to evolve. Understanding conditions makes loops feel obvious rather than mysterious.
