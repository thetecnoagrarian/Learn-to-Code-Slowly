# Phase 0 · Chapter 0.8: Boundaries

Programs do not exist in isolation. They touch the outside world—sensors, networks, files, users—and that boundary is where assumptions meet reality.

This chapter is about why validation lives at the edges, and what breaks when you ignore it.

## 1) Where Systems Touch the Outside World

Every program has boundaries:

- Inputs cross in—sensor readings, network packets, file contents, user keystrokes
- Outputs cross out—relay signals, log writes, dashboard updates, error messages
- State can be read or written by external systems—databases, config files, MQTT brokers

Inside the boundary: you control the rules. Outside: you do not.

## 2) The Boundary Is Where Assumptions Break

The outside world does not follow your assumptions.

- A sensor might return null instead of a number
- A network request might never arrive
- A file might be empty, corrupted, or missing
- A user might type anything

If you trust data the moment it crosses the boundary, you assume the world behaved. When it didn't, the bug is already inside.

## 3) Validation Lives at the Edges

Validate as data crosses the boundary.

- Check shape: is it the right type? The right structure?
- Check range: is the value plausible? Within expected bounds?
- Check presence: is it missing when it shouldn't be?
- Check consistency: does it conflict with other state?

Homestead example: a voltage reading arrives over Wi‑Fi. Validate before using: is it a number? Is it between 0 and 20? Is it not null? If any check fails, handle it—don't pass bad data into the rest of the program.

## 4) Fail at the Boundary, Not in the Middle

A program that rejects bad input at the edge is easier to debug than one that corrupts state and fails later.

When you see a crash deep in your logic, ask: what crossed the boundary earlier that shouldn't have?

## 5) Boundaries Are Contracts

A boundary is a contract: "If you give me data in this form, I will behave in this way."

The contract is not enforced by the computer. You enforce it—by validating at the boundary.

## Reflection

Think about one of your systems. Where does data enter? Where does it leave? What would happen if a sensor returned null, or a file was empty, or a network packet never arrived? If you can't answer, the boundary is probably not defended.

## Core Understanding

"Programs touch the outside world at boundaries. Validation at those boundaries—checking shape, range, presence, and consistency—prevents bad data from corrupting state and causing mysterious failures later."
