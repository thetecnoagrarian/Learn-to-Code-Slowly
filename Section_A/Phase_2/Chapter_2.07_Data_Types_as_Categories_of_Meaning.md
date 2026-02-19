# Section A Phase 2 · Chapter 2.07: Data Types as Categories of Meaning

Chapter 1.5 showed that programs operate on data, Chapter 2.02: variables store data. This chapter adds a critical refinement: not all data is the same kind of thing. Python calls these kinds types. Types are not technical trivia. They are categories of meaning. Understanding types is how you stop accidentally treating one kind of reality as another. Types enforce boundaries between categories, preventing category errors that lead to bugs. Chapter 2.02 showed how Python names store state. Chapter 2.03 showed how Python uses state in conditions. Chapter 2.04 showed how Python repeats with loops. Chapter 2.05 showed how Python names behavior. Chapter 2.06 showed how Python controls name visibility. This chapter shows how Python categorizes the values those names refer to, how types enforce meaning and prevent category errors.

## Learning Objectives

After this chapter, you will be able to:
- Understand types as categories of meaning, not decorations
- Recognize category errors as the root of many bugs
- Distinguish int from float and when to use each
- Understand bool as truth values, not measurements
- Use str for text and labels
- Understand None as absence, not zero
- Recognize how types enforce meaning through rules
- Distinguish type errors from value errors
- Choose types that match reality

## Key Terms

- **Type**: A category of meaning that describes what kind of thing a value is
- **Category Error**: Treating one kind of thing as if it were another
- **int**: Whole numbers used for counts and discrete quantities
- **float**: Decimal numbers used for measurements and continuous quantities
- **bool**: Truth values representing yes or no decisions
- **str**: Text representing labels, messages, and symbols
- **None**: Absence of value, not zero or false

## 1) Types Are Categories, Not Decorations

A type, Chapter 2.02: values exist independently of names, answers one question: what kind of thing is this value? Not what is its name, voltage, coop_temp, fence_voltage, names don't determine type, where did it come from, sensor, calculation, user input, source doesn't determine type, or what do I intend to do with it, intention doesn't determine type. But what category of data does this value belong to? int, float, bool, str, None. Python uses types to decide what operations are allowed, int plus int works, int plus str doesn't, what comparisons make sense, voltage less than twelve point one works if numeric, fails if None, and what behavior is legal, Chapter 2.03: conditions depend on types.

Homestead example: voltage equals twelve point one is float. coop_temp equals seventy-five is int, wrong, should be float. fence_voltage equals four point two is float. The type is inherent to the value, not the name.

## 2) Category Errors Are the Root of Many Bugs

A category error is treating one kind of thing as if it were another. Examples in human terms include treating temperature like a count, treating absence like zero, treating text like a number, and treating unknown like false. Computers are merciless about this. They will not infer your intent. They will enforce the category rules.

Category errors are the root of many bugs.

## 3) Python's Core Built-In Types

At this stage, we focus on these core types: int, whole numbers, float, decimal numbers, bool, truth values, str, text, and None, absence of value. Later we will add collections. For now, these are the atoms.

These core types form the foundation.

## 4) int: Whole, Discrete Quantities

An int represents whole numbers, Chapter 2.02: values exist independently, the number ten is int, regardless of name. Zero, one, negative five, three hundred. Integers are exact, ten is exactly ten, not ten point zero zero zero zero zero zero one, discrete, whole steps, no fractions, and countable, you can count them: one, two, three, four. They are used for counts, chicken_count equals twenty-five, reading_count equals ten, indexes, position in sequence, durations in whole units, cooldown_seconds equals three hundred, and loop counters, Chapter 2.04: for i in range ten colon.

Homestead example: chicken_count equals twenty-five is int. retry_attempts equals three is int. fan_cycles equals one hundred fifty is int. These are discrete quantities, whole numbers, countable.

## 5) What int Is Good At

Integers excel at things that come in steps. Homestead examples include number of readings taken, cooldown seconds, retry attempts, loop iterations, number of chickens in coop, ESP32 connection retries, and fan cycles completed. reading_count equals ten. cooldown_seconds equals three hundred. retry_attempts equals three. chicken_count equals twenty-five. esp32_retries equals three. fan_cycles equals one hundred fifty. These are counts, not measurements. Discrete quantities, whole numbers.

int is good at counts.

## 6) What int Is Bad At

Integers are bad at representing measurements, representing fractions, and representing continuous change. Voltage is not an integer. Twelve point one volts, not twelve. Temperature is not an integer. Seventy-five point three degrees Fahrenheit, not seventy-five. Battery charge is not an integer. Eighty-five point seven percent, not eighty-five. Coop temp is not an integer. Seventy-two point eight degrees Fahrenheit, not seventy-two. Fence voltage is not an integer. Four point two kilovolts, not four. Solar production is not an integer. One point two kilowatts, not one. Humidity is not an integer. Zero point six five, not zero or one. Trying to force these into int is lying to the model. Measurements are continuous, not discrete.

int is bad at measurements.

## 7) float: Measured, Continuous Quantities

A float represents decimal numbers, Chapter 2.02: values exist independently, twelve point one is float, regardless of name. Twelve point one, zero point five, negative three point one four. Floats are approximate, stored in binary, some decimals can't be exact, continuous, can be any value in a range, not just whole steps, and measured, come from sensors, calculations, real-world measurements. They represent values taken from the world. Sensors measure continuous quantities, voltage, temperature, humidity, pressure. These are not countable, they are measurable.

Homestead example: voltage equals twelve point one is float. coop_temp equals seventy-two point five is float. fence_voltage equals four point two is float. These are continuous measurements from sensors, not discrete counts.

## 8) Floats Are Approximations

This matters, Chapter 2.03: conditions depend on values, if comparisons are approximate, conditions can misfire. A float is not exact. It is a mathematical approximation stored in binary, computers use binary, humans use decimal, some decimals can't be represented exactly in binary. This means some decimals cannot be represented exactly, zero point one plus zero point two might not equal zero point three exactly, comparisons must be done carefully, voltage double equals twelve point one might fail due to approximation, and small errors accumulate, repeated calculations can drift. For now, remember this: floats model reality. Reality is messy. Sensors have noise. Measurements have error. Floats approximate that messiness.

Homestead failure mode: if voltage double equals twelve point one colon might fail even when voltage is twelve point one, due to floating-point approximation. Use if abs voltage minus twelve point one less than zero point zero one colon or if voltage less than twelve point one colon instead.

## 9) What float Is Good At

Homestead examples include voltage, battery, fence, temperature, coop, pig barn, cow barn, humidity, coop, pig barn, cow barn, pressure, atmospheric, solar production, watts, kilowatts, and current, amperes. voltage equals twelve point one. coop_temp equals seventy-two point five. fence_voltage equals four point two. solar_watts equals twelve hundred point five. humidity equals zero point six five. pig_barn_temp equals sixty-eight point three. These values come from sensors, DHT22, voltage sensors, ESP32 nodes. They are measured, not counted. Continuous quantities from the real world.

float is good at measurements.

## 10) Never Treat Floats Like Booleans

A very common beginner error: if voltage colon start_generator. Or: if coop_temp colon start_fan. Or: if fence_voltage colon alert. This is not a voltage, or temp, or fence, check. This is a truthiness check, Chapter 2.08: Python treats non-zero floats as True. We will cover this in Chapter 2.08. For now: floats are numbers, not truth values. Use comparisons: voltage less than twelve point one, coop_temp greater than eighty-five, fence_voltage less than two point zero.

Never treat floats like booleans.

## 11) bool: Truth, Not Meaning

A bool represents exactly two values, Chapter 2.03: conditions evaluate to True or False: True and False. Nothing else. No maybe, no unknown, no partially true. Just True or False. Booleans represent decisions, should start fan? should alert? conditions, Chapter 2.03: if statements use booleans, and yes or no questions, is it running? is it on? is it energized? They do not represent magnitude, fan_on equals True doesn't tell you fan speed, state history, generator_running equals True doesn't tell you how long it's been running, or measurement, is_energized equals True doesn't tell you fence voltage.

Homestead example: fan_on equals True answers is fan on? but doesn't tell you temperature, speed, or duration. is_energized equals True answers is fence energized? but doesn't tell you voltage level. Booleans are binary decisions, not measurements.

## 12) Booleans Are Results of Logic

Booleans usually come from comparisons, Chapter 2.03: conditions. is_low equals voltage less than twelve point one. generator_running equals True. fan_on equals False. is_energized equals fence_voltage greater than two point zero. temp_high equals coop_temp greater than eighty-five. solar_producing equals solar_watts greater than one hundred. These are decisions, not data from the world. Booleans represent yes or no questions, not measurements.

Booleans are results of logic.

## 13) Booleans Are Not Labels

Do not use booleans where meaning matters. Bad: generator_state equals True. coop_state equals False. fence_state equals True. Good: generator_running equals True. fan_on equals False. is_energized equals True. solar_producing equals True. The boolean answers a question, is it running? is it on? is it energized? The name supplies the meaning, what question is being answered.

Booleans are not labels.

## 14) str: Text and Symbols

A str represents text. running, stopped, Voltage low. Strings are human-readable, symbolic, and immutable. Strings are not numbers. Strings are not logic.

str represents text and symbols.

## 15) What Strings Are Good At

Strings represent labels, messages, categories, and identifiers. Homestead examples: generator_state equals running. coop_state equals fan_on. fence_state equals energized. alert_message equals Voltage below threshold. coop_alert equals Temperature high in coop. fence_alert equals Fence voltage low. sensor_name equals battery_voltage. esp32_id equals coop_sensor_01. pig_barn_sensor equals dht22_pig_barn. Strings model language, not math. Text labels, messages, categories, identifiers, human-readable symbols.

## 16) Strings Are Immutable

You cannot change a string in place. state equals run. state equals state plus ning. This creates a new string. The old one still exists until discarded. This immutability is intentional. It makes strings safe to share.

Strings are immutable.

## 17) None: Absence Is Not Zero

None represents no value, Chapter 2.02: variables can refer to None, meaning absence. This is one of the most important types in Python. None means no reading, sensor didn't respond, timeout, not available, ESP32 disconnected, network down, failed to compute, calculation error, invalid input, and not yet set, variable created but not assigned. It does not mean zero, zero is a real number, None is absence, False, False is a boolean decision, None is absence, empty, empty string is text, None is absence, or default, default value is a value, None is absence.

Homestead example: voltage equals None means we don't know the voltage, sensor failed. voltage equals zero means voltage is zero volts, real measurement. These are different. Confusing them causes bugs, if voltage less than twelve point one colon fails if voltage is None, succeeds if voltage is zero.

## 18) Why None Exists

Reality is incomplete. Sensors fail. Files are missing. Networks drop. Data arrives late. None allows you to represent that honestly.

None exists because reality is incomplete.

## 19) Homestead Example

voltage equals read_sensor. If the sensor times out: voltage equals None. This does not mean zero volts. It means we don't know. Confusing these two leads to catastrophic logic.

None means we don't know.

## 20) None Forces Explicit Thinking

You cannot accidentally use None like a number. None plus one, TypeError. This is a feature. Python forces you to handle absence explicitly. That's defensive programming.

None forces explicit thinking.

## 21) Types Enforce Meaning Through Rules

Each type has, Chapter 2.01: programs follow rules exactly, allowed operations, int plus int makes sense, adding counts, forbidden operations, float plus str doesn't make sense, can't add measurement to text, and defined behavior, each operation has specific meaning. Examples: int plus int arrow allowed, ten plus five equals fifteen, adding counts, float plus float arrow allowed, twelve point one plus zero point five equals twelve point six, adding measurements, float plus str arrow forbidden, TypeError: can't add measurement to text, None less than five arrow forbidden, TypeError: can't compare absence to number. These rules are not arbitrary. They enforce meaning. Types prevent category errors before they become bugs.

Homestead examples: voltage plus zero point five works, float plus float, adding measurements, voltage plus V fails, float plus str, mixing measurement with text, coop_temp less than eighty-five works, float less than int, comparing measurement to threshold, None less than eighty-five fails, NoneType less than int, comparing absence to number, Python catches this.

## 22) The type() Function

type value tells you the category. type twelve point one, float. type True, bool. type running, str. type None, NoneType. This is primarily a debugging tool. Not something you should rely on for logic. We'll learn better patterns later.

The type function tells you the category.

## 23) Type Errors vs Value Errors

These are different failures, Chapter 2.01: programs can have errors, understanding error types helps debugging. Type Error: wrong category. You tried to use a value as the wrong type. Twelve point one plus V. voltage plus V. coop_temp plus degrees Fahrenheit. You tried to mix numeric and textual meaning. Python catches this immediately, TypeError. Value Error: right category, wrong content. The type is correct, but the value is invalid. int abc. float not a number. int twelve point five, can't convert twelve point five to int, has decimal. Text can represent numbers, but this text does not. The conversion fails, ValueError. Understanding the difference speeds debugging. TypeError means wrong type. ValueError means wrong value for that type.

Homestead examples: TypeError: voltage plus V, trying to add float to str, ValueError: int twelve point five, trying to convert twelve point five to int, has decimal, TypeError: None less than twelve point one, trying to compare None to float, ValueError: float sensor_error, trying to convert error message to float.

## 24) Types Shape Control Flow

Conditions behave differently depending on type. if voltage less than twelve point one colon. This only works if voltage is numeric. If voltage is None, the program fails fast. That's good. Silent failure is worse.

Types shape control flow.

## 25) Modeling Reality Correctly

Good programs choose types that match reality. Measurements arrow float, counts arrow int, decisions arrow bool, labels arrow str, and absence arrow None. When types match reality, code reads cleanly, logic is simpler, and bugs surface earlier. When types lie, conditions misfire, errors appear late, and systems behave weirdly.

Modeling reality correctly prevents bugs.

## 26) Types Are Design Decisions

Choosing a type is a design act. When you choose generator_state equals running. coop_state equals fan_on. fence_state equals energized. You are saying there may be more than two states, running stopped starting error, the state is categorical, not numeric, not boolean, and future expansion is expected, can add maintenance offline, etc. When you choose generator_running equals True. fan_on equals False. is_energized equals True. You are saying this is a yes or no question, is it running? is it on? is it energized? and only two states matter, True or False, on or off. Neither is universally correct. The choice depends on reality. If you need more than two states, use str. If only two states matter, use bool.

Types are design decisions.

## 27) Types and Invariants

Types help enforce invariants. If voltage, or coop_temp fence_voltage solar_watts, is always a float or None, then you can check for absence, if voltage is None colon handle_error, you can compare safely, if voltage less than twelve point one colon alert, only works if numeric, and you can reason about logic, voltage is either a measurement or unknown, never zero by accident. Type discipline is the first line of defense. Types enforce invariants, voltage is always float or None, never int, never bool, never str. This prevents category errors before they become bugs.

Types and invariants go together.

## Common Pitfalls

Using int for measurements loses precision. Measurements are continuous, not discrete. Use float for measurements. Don't use int for measurements.

Confusing None with zero causes bugs. None means absence. Zero means zero. These are different. Don't confuse them.

Treating floats like booleans causes bugs. Floats are numbers, not truth values. Use comparisons, not truthiness. Don't treat floats like booleans.

Using bool where you need str limits states. If you need more than two states, use str. Don't use bool where you need multiple states.

Not handling None causes crashes. None forces explicit handling. Check for None before using values. Don't ignore None.

Mixing types in operations causes type errors. Types enforce meaning. Don't mix types accidentally.

## Summary

Types are categories of meaning. int counts. float measures. bool decides. str labels. None represents absence. Types prevent category errors and force explicit handling of reality. Types are not decorations. They are categories of meaning. Category errors are the root of many bugs. int represents whole numbers. int is good at counts. int is bad at measurements. float represents decimal numbers. Floats are approximations. float is good at measurements. Never treat floats like booleans. bool represents truth values. Booleans are results of logic. Booleans are not labels. str represents text. Strings are immutable. str is good at labels and messages. None represents absence. None is not zero. None forces explicit thinking. Types enforce meaning through rules. Type errors mean wrong category. Value errors mean wrong value for that type. Types shape control flow. Modeling reality correctly prevents bugs. Types are design decisions. Types help enforce invariants.

## Next

This chapter showed how Python categorizes values into types. Types are categories of meaning. They enforce boundaries and prevent category errors. Next, Chapter 2.08 explores truthiness and explicit checks, where we talk about how Python pretends some values are true or false, and why professionals avoid relying on that illusion. Understanding types makes truthiness feel obvious rather than mysterious.
