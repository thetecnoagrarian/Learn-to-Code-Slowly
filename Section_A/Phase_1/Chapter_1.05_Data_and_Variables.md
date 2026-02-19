# Section A Phase 1 · Chapter 1.5: Data and Variables

## Learning Objectives

After this chapter, you will be able to:
- Understand data as information expressed in a form the computer can manipulate
- Recognize that programs only see representations, not meaning
- Understand variables as names that point to data
- Distinguish between data value and data shape
- Recognize how data shape determines how data can be used
- Distinguish between temporary and persistent data
- Understand how variable naming preserves meaning for humans
- Recognize data as the interface between reality and logic

## Key Terms

- **Data**: Information expressed in a form the computer can manipulate
- **Variable**: A name that points to a piece of data
- **State**: The current values of variables at a specific moment in time
- **Data Shape**: The structure of data, not just its value
- **Temporary Data**: Data that exists only briefly and is immediately discarded
- **Persistent Data**: Data that persists across loops and carries history
- **Representation**: The form data takes, separate from its meaning

## 1) Programs Work With Data, Not Ideas

Programs do not work with ideas. They do not work with meaning. They do not understand intent. They work with data. Everything a program sees, stores, checks, compares, or changes is data. If something is not represented as data, the program does not know it exists. This chapter is about understanding what data really is and how programs remember it over time.

Data is information expressed in a form the computer can manipulate. That's it. Examples include a number representing temperature, a word representing a name or label, a true or false value, a list of readings, or a structured collection of related values. Data is not meaning. Data is representation. The meaning lives in your head.

## 2) Programs Only See Representations

When you think the battery is low, the program sees a number compared against a threshold producing a true or false result. When you think the generator should start, the program sees a condition, a variable, and a state change. Nothing more. This is not a limitation. It's a contract. You must make reality explicit in data.

When your freezer monitor thinks the temperature is too high, the program sees a number compared against a threshold. When your coop door controller thinks the door should close, the program sees conditions and variables. When your irrigation system thinks soil is dry, the program sees moisture readings compared against thresholds. Programs don't understand concepts. They understand data. You must translate reality into data.

## 3) Variables Are Memory With Names

A variable is a name that points to a piece of data. That's all it is. Not a box. Not a container. Not a slot. A name to a value. Variables exist so a program can remember something, refer to it later, and change it over time. Without variables, a program would have no memory. With variables, it has state.

When your battery monitor stores voltage in a variable named battery_voltage, that name points to the data. When your coop door controller stores door status in a variable named door_open, that name points to the data. When your irrigation system stores moisture readings in a variable named soil_moisture, that name points to the data. Variables give programs memory. The name is for humans. The data is for the program.

## 4) State Is Data Over Time

When we say state, we're not introducing a new concept. State is simply the current values of variables at a specific moment in time. Change the variables, and you change the state. This is why programs feel alive. Variables update, conditions change, loops behave differently, and outputs shift. All of that is just data changing.

When your battery monitor checks voltage, the state includes current voltage, generator running status, and last start time. When voltage changes, state changes. When generator starts, state changes. When your coop door controller checks time and chicken count, the state includes current time, chicken count, and door status. When time passes or chickens move, state changes. State is just data over time.

## 5) Variables Do Not Hold Meaning

This is a subtle but critical point. The variable name carries meaning for humans. The value carries meaning for logic. The computer does not care that battery_voltage is a voltage, temperature is measured in degrees, or door_open refers to a physical door. It only cares that a number is a number, a true or false value is true or false, and a collection is a collection.

If the data is wrong or misinterpreted, the program will behave correctly and still do the wrong thing. When your battery monitor stores voltage as twelve point six, the computer sees a number. It doesn't know that twelve point six volts means fully charged. If you accidentally store temperature in the voltage variable, the program will use it as voltage. The computer doesn't know the difference. You must ensure data represents what you intend.

## 6) Data Has Shape, Not Just Value

This is where many people get into trouble. Data is not just what the value is. It is how it is structured. Examples include a single temperature value, a list of temperature values, a table of timestamps and temperatures, or a record with temperature, humidity, and voltage. All of these might involve temperature, but they are not interchangeable.

The value might be correct. The shape might be wrong. Most real bugs come from assuming the wrong shape. When your battery monitor expects a single voltage value but receives a list of voltages, that's a shape mismatch. When your irrigation system expects a moisture reading but receives a record with multiple fields, that's a shape mismatch. The values might be correct, but the shape is wrong.

## 7) Shape Determines How Data Can Be Used

You cannot loop over a single number, compare a list as if it were one value, or treat structured data like a simple value. If you misunderstand shape, conditions misfire, loops break, and functions behave unpredictably. Programs are extremely strict about shape, even if they appear flexible.

When your battery monitor tries to loop over a single voltage value, that fails. When your coop door controller tries to compare a list of temperatures as if it were one value, that fails. When your irrigation system tries to treat structured sensor data like a simple number, that fails. Shape determines what operations are possible. You must match shape to usage.

## 8) Temporary Versus Persistent Data

Not all data lives equally long. Some data exists only briefly, is used once, and is immediately discarded. Other data persists across loops, carries history, and influences future behavior. Knowing which is which matters. If you treat temporary data as persistent, you accumulate garbage, state drifts, and bugs compound over time. If you treat persistent data as temporary, the system forgets, behavior resets unexpectedly, and decisions lose context. This distinction becomes crucial in long-running systems.

When your battery monitor reads a voltage value, that reading might be temporary, used once for a decision, then discarded. But the running average of voltage readings is persistent, carried across loops, influencing future behavior. When your coop door controller checks chicken count, that count might be temporary, but the door status is persistent, remembered across checks. Understanding which data is temporary and which is persistent is essential for correct behavior.

## 9) Variables Are Where Bugs Hide

When people say this program behaves unpredictably, it worked earlier, or I don't know what changed, what usually happened is a variable changed unexpectedly, or didn't change when it should have, or was reused incorrectly. Debugging is often just tracing variables, watching how data changes, and confirming assumptions about state. That's not glamorous, but it's effective.

When your battery monitor behaves unpredictably, check the variables. Did voltage change unexpectedly? Did generator status not update? Was a variable reused incorrectly? When your irrigation system behaves unpredictably, check the variables. Did moisture readings change unexpectedly? Did zone status not update? Was state corrupted? Variables are where bugs hide because they're where state lives.

## 10) Naming Variables Preserves Meaning

Just like functions, variables exist mostly for humans. Good variable names describe what the data represents, reflect real-world concepts, and reduce the need to inspect usage. Bad variable names hide intent, encourage misuse, and make reasoning harder. A variable name is a promise to the reader: this data represents this thing. Breaking that promise causes confusion long after the code works.

When your battery monitor uses battery_voltage, that name preserves meaning. When it uses temp, that name hides meaning. When your coop door controller uses door_open, that name preserves meaning. When it uses flag, that name hides meaning. Good names make code self-documenting. Bad names require inspection to understand. Variable names are for humans, not computers.

## 11) Data Is the Interface Between Reality and Logic

Every real system you care about, sensors, devices, users, networks, and physical processes, must be translated into data. That translation is where design happens. If you choose the wrong data, logic becomes fragile, edge cases multiply, and behavior becomes hard to explain. Good data design makes logic simple. Bad data design makes logic defensive and messy.

When your battery monitor translates voltage readings into data, that translation determines how logic works. If you store voltage as a string, logic becomes defensive, parsing strings everywhere. If you store voltage as a number, logic becomes simple, comparing numbers directly. When your irrigation system translates soil moisture into data, that translation determines how logic works. Good data design makes everything easier. Bad data design makes everything harder.

## Common Pitfalls

Confusing data value with data shape causes bugs. A temperature value and a list of temperature values are different shapes. You cannot use them interchangeably. Always understand the shape of your data. Most bugs come from assuming the wrong shape.

Treating temporary data as persistent causes state drift. If you accumulate temporary data across loops, state drifts and bugs compound. Always distinguish between temporary and persistent data. Temporary data should be discarded. Persistent data should be maintained.

Not naming variables well makes code unreadable. Bad names like temp or flag hide meaning. Good names like battery_voltage or door_open preserve meaning. Variable names are promises to readers. Keep those promises.

Assuming the computer understands meaning causes problems. The computer doesn't know that battery_voltage represents voltage. It only knows it's a number. If you store the wrong data in a variable, the program will use it incorrectly. Always ensure data represents what you intend.

Not understanding that programs only see representations causes confusion. Programs don't understand concepts. They understand data. You must translate reality into data explicitly. If something isn't represented as data, the program doesn't know it exists.

## Summary

Programs operate on data stored in variables, and program behavior is the result of how that data changes over time. Data is information expressed in a form the computer can manipulate. Programs only see representations, not meaning. Variables are names that point to data, giving programs memory. State is the current values of variables at a specific moment in time. Variables do not hold meaning for the computer, only for humans. Data has shape, not just value, and shape determines how data can be used. Temporary data exists briefly and is discarded. Persistent data persists across loops and carries history. Variables are where bugs hide because they're where state lives. Naming variables well preserves meaning for humans. Data is the interface between reality and logic. Good data design makes logic simple. Bad data design makes logic defensive and messy. Programs operate on data stored in variables, and program behavior is the result of how that data changes over time.

## Next

This chapter covered data and variables, which give programs memory and allow them to track state over time. Next, Chapter 1.6 explores errors and failure, covering what happens when data, assumptions, or reality don't line up, and why that's not exceptional at all. Understanding data is essential for understanding how programs fail and how to handle those failures gracefully.
