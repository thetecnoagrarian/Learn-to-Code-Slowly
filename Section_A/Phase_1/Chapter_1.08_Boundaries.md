# Section A Phase 1 · Chapter 1.8: Boundaries

Programs do not exist in isolation. They touch the outside world—sensors, networks, files, users—and that boundary is where assumptions meet reality. This chapter is about why validation lives at the edges, what breaks when you ignore it, and how to treat boundaries as contracts you enforce so the rest of your program can reason safely.

## Learning Objectives

After this chapter, you will be able to:
- Identify where your program's boundaries are
- Understand why the boundary is where assumptions break
- Apply validation at the edges: shape, range, presence, consistency
- Recognize boundaries as contracts you enforce
- Prefer failing at the boundary over failing deep in logic

## Key Terms

- **Boundary**: Where data or control crosses between your program and the outside world
- **Validation**: Checking data at the boundary for shape, range, presence, and consistency
- **Contract**: The promise a boundary makes about acceptable inputs and resulting behavior
- **Fail at the edge**: Reject bad input at the boundary instead of letting it corrupt state

## 1) Where Systems Touch the Outside World

Every program has boundaries. Inputs cross in: sensor readings, network packets, file contents, user keystrokes. Outputs cross out: relay signals, log writes, dashboard updates, error messages. State can be read or written by external systems such as databases, config files, or MQTT brokers. Inside the boundary you control the rules. Outside you do not.

A battery monitor reads voltage over Wi‑Fi. The voltage value crosses the boundary when it arrives. Your coop door controller receives a signal from a light sensor. That signal crosses the boundary. Your irrigation system reads soil moisture from an ESP32 in the garden. The moisture value crosses the boundary. Your electric fence monitor gets energizer status from a relay. The status crosses the boundary. In every case, the moment data enters your program, it moves from a world you do not control into a world where you do. Knowing where data enters and leaves is the first step to defending those points.

Outputs cross out in the same way. You send a command to close the coop door. You write a log line to disk. You publish a temperature reading to MQTT. You update a web dashboard. Each of those actions sends data or control across the boundary. The outside world may or may not receive it, may or may not obey it, and may or may not reflect it back correctly later. Boundaries are two-way. You must think about what comes in and what goes out.

## 2) The Boundary Is Where Assumptions Break

The outside world does not follow your assumptions. A sensor might return null instead of a number. A network request might never arrive. A file might be empty, corrupted, or missing. A user might type anything. If you trust data the moment it crosses the boundary, you assume the world behaved. When it did not, the bug is already inside.

Consider a freezer temperature sensor. You assume it will return a number in a reasonable range, say minus twenty to plus twenty Celsius. The sensor might return null because the probe disconnected. It might return a string because the firmware sent "N/A". It might return a number that is plausible but wrong because the sensor drifted. It might return nothing at all because the request timed out. If you trust the value as soon as it crosses the boundary, you pass that value into the rest of your program. A null becomes a variable. A wrong type becomes a comparison. A stale value becomes a decision. The failure shows up later, deep in your logic, and the cause is hard to trace back to the boundary.

Validation at the boundary catches bad input before it becomes state. Once bad data is in variables, it spreads. It gets used in conditions. It gets written to other state. It gets sent to other systems. The further bad data travels from the boundary, the harder it is to find the real cause. The boundary is the only place where you can reliably say: this is where the outside world ends and my rules begin.

## 3) Validation Lives at the Edges

Validate as data crosses the boundary. Check shape: is it the right type and structure? Check range: is the value plausible and within expected bounds? Check presence: is it missing when it should not be? Check consistency: does it conflict with other state? If any check fails, handle it. Do not pass bad data into the rest of the program.

Shape means the kind of thing you received. If you expect a number, is it actually a number? If you expect an object with certain keys, does it have them? A voltage reading that arrives as the string "12.4" is the wrong shape if your logic does arithmetic on it. A moisture reading that arrives as an object with a nested "value" field requires you to extract that value before using it. Shape checks answer: can I use this in the way the rest of my program expects?

Range means the value is plausible. A voltage reading might be a number but set to nine hundred ninety-nine because the sensor malfunctioned. A temperature reading might be minus two hundred Celsius. A humidity reading might be one hundred and fifty percent. Range checks answer: is this value within the physical or logical limits I care about? Homestead example: battery voltage should be between roughly ten and fifteen volts for a twelve-volt system. Anything outside that range is either a bad reading or a different kind of problem. Validate the range at the boundary so the rest of the program never has to wonder.

Presence means the value exists when it should. A sensor might return null. A network call might return no body. A file might be empty. A key might be missing from a configuration object. Presence checks answer: do I have something to work with, or do I need to handle absence? Chapter 1.6 and 1.10 go deeper on failure and missing data. At the boundary, the rule is simple: if the data is missing and your program cannot proceed without it, do not proceed. Handle the absence explicitly. Do not pass null or undefined into the rest of the program and hope nothing uses it.

Consistency means the new data fits with what you already know. If your coop door state says "closed" but the next message says "open" without a "closing" event in between, that might be inconsistent. If two temperature sensors in the same room report values twenty degrees apart, one of them is wrong or the data is stale. Consistency checks often require comparing incoming data to existing state. They answer: does this new information conflict with what I already believe? If it does, you may need to reject it, flag it, or reconcile it before updating state.

A voltage reading arrives over Wi‑Fi. Validate before using: is it a number? Is it between zero and twenty volts? Is it not null? If any check fails, handle it—do not pass bad data into the rest of the program. The same idea applies to soil moisture from the garden, temperature from the freezer, fence voltage from the energizer, and status from the chicken counter. Every input that crosses the boundary gets the same treatment: shape, range, presence, and consistency, as appropriate for that input.

## 4) Fail at the Boundary, Not in the Middle

A program that rejects bad input at the edge is easier to debug than one that corrupts state and fails later. When you see a crash deep in your logic, ask what crossed the boundary earlier that should not have. Fail at the boundary, not in the middle. That way the failure points to the real cause: bad input, not a bug in core logic.

If your irrigation logic assumes moisture is always a number and you pass in null at the boundary, the crash might happen inside a function that computes watering duration. The stack trace points to that function. The real bug is that null was allowed in at the boundary. If you had rejected null at the boundary and logged "moisture reading missing", the failure would point to the right place: the sensor or the network, not your arithmetic. The same applies to a freezer monitor that receives a string instead of a number. If you validate at the boundary and reject or convert the value there, the rest of the program never sees the wrong type. If you let it through, you get a type error or wrong behavior somewhere deep in the code, and debugging becomes a hunt for where the bad data came from.

Failing at the boundary also makes the contract visible. When you reject invalid input and log or return an error, you are stating: this boundary only accepts data that looks like this. Anyone reading the code or the logs sees that the boundary is defended. When you let bad data through and fail later, the contract is unclear and the failure is misleading.

## 5) Boundaries Are Contracts

A boundary is a contract: if you give me data in this form, I will behave in this way. The contract is not enforced by the computer. You enforce it by validating at the boundary. The contract might be: if you give me a number between zero and twenty, I will treat it as voltage and decide whether to start the generator. If you give me anything else, I will not use it; I will log an error or return a failure. The contract might be: if you give me a valid configuration file with these keys, I will load the system. If the file is missing or malformed, I will not start with partial or wrong config.

Contracts help humans and systems. When you document or code a boundary, you are making a promise about what you accept and what you guarantee. That makes it easier for others to integrate with your program and for you to reason about what can and cannot happen inside. It also makes it clear that anything that passes the boundary has been checked. The rest of the program can assume the contract holds. That assumption is only valid if validation at the boundary is strict and consistent.

Homestead example: your MQTT subscriber expects messages with a topic and a payload that parses to a number. The contract is: valid messages look like that. Invalid messages are not passed through. They are logged or discarded at the boundary. Inside the program, every handler can assume it receives a number. The contract is enforced at the edge. Naming helps: a function called "validate_voltage_reading" makes the contract visible. A function that just "processes" data does not. Clear names at boundaries document what the program accepts and what it rejects.

## 6) Multiple Boundaries, Same Rules

Programs often have many boundaries. A single system might read from a battery sensor, a temperature sensor, a config file, and a network API. Each of those is a boundary. The same rules apply to each: identify where data crosses in or out, validate shape and range and presence and consistency as appropriate, and fail at the edge instead of in the middle. Do not assume that because one boundary is well defended, you can skip another. Each source of input can send bad data. Each output can fail or be misinterpreted. Treat every boundary as a place where the outside world can violate your assumptions.

## 7) Output Boundaries Matter Too

So far the focus has been on input: data coming in. Output boundaries matter as well. When you send a command to a relay, write to a file, or publish to MQTT, you are crossing a boundary. The contract on output might be: I will only send values that the receiver accepts. For example, a relay might accept only "on" or "off"; sending an invalid command could leave the system in an undefined state. Validating what you send before you send it is part of defending the output boundary. You might validate before sending: is this command in the allowed set? Is this value in the right format? You might also consider what happens if the output fails. The network might drop the packet. The file system might be full. The broker might be down. Output boundaries can fail too. Designing for that—retries, timeouts, logging—keeps output boundaries from becoming a source of silent failure. Input and output boundaries together define where your program meets the world. Defend both.

## Common Pitfalls

Trusting data as soon as it crosses the boundary causes bugs. Always validate. Assume the world can send null, wrong types, empty files, and missing packets. One unchecked boundary is enough to let bad data in.

Validating too late allows bad data to become state. Once bad data is in variables, it spreads. Validate at the edge so bad data never enters. If you validate only when you use the value, you may have already stored it, passed it to other functions, or used it in conditions. The damage is done.

Skipping range checks causes plausible-but-wrong behavior. A voltage of nine hundred ninety-nine might pass a "is it a number?" check but be impossible. Check shape and range. Shape alone is not enough for physical or logical quantities.

Not handling missing or late data causes intermittent failures. Networks drop packets. Files are sometimes missing. Sensors sometimes time out. Design for absence, not only for presence. If your program cannot work without the value, reject or defer at the boundary and handle the missing case explicitly.

Treating one boundary as safe and others as risky is a mistake. Every input and output is a boundary. Apply the same discipline to config files, network calls, and sensor reads. Consistency at every boundary makes the whole system easier to reason about and debug. A single unvalidated input can undermine an otherwise well-defended program.

## Summary

Programs touch the outside world at boundaries. Inputs and outputs cross those boundaries; inside you control the rules, outside you do not. The boundary is where assumptions break, so validation must live at the edges. Check shape, range, presence, and consistency as data crosses in (and consider the same for data crossing out). Reject bad input at the boundary so it never becomes state and never causes failures deep in your logic. Boundaries are contracts you enforce: if you give me data in this form, I will behave in this way. Fail at the edge, not in the middle. That way failures point to the real cause—bad or missing input—and the rest of your program can assume the contract holds. One anchor for the whole phase: a program is a sequence of instructions that transforms data and state over time using conditions, loops, and functions. Boundaries define where that program meets the world and where you must defend its assumptions.

## Next

Chapter 1.9 (Invariants) builds on boundaries. Validation at the boundary defends the system; invariants are what that validation protects. Invariants are rules that must always hold for the system to be healthy—for example, voltage must never exceed a safe limit, or the coop door must never be open and locked at the same time. Once you know where your boundaries are and what you accept at the edges, the next step is to make explicit what must always be true inside the system, and what your program refuses to violate.
