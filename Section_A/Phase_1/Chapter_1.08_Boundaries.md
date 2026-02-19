# Section A Phase 1 · Chapter 1.8: Boundaries

Programs do not exist in isolation. They touch the outside world—sensors, networks, files, users—and that boundary is where assumptions meet reality. This chapter is about why validation lives at the edges, and what breaks when you ignore it.

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

Knowing where data enters and leaves is the first step to defending those points.

## 2) The Boundary Is Where Assumptions Break

The outside world does not follow your assumptions. A sensor might return null instead of a number. A network request might never arrive. A file might be empty, corrupted, or missing. A user might type anything. If you trust data the moment it crosses the boundary, you assume the world behaved. When it did not, the bug is already inside.

Validation at the boundary catches bad input before it becomes state.

## 3) Validation Lives at the Edges

Validate as data crosses the boundary. Check shape: is it the right type and structure? Check range: is the value plausible and within expected bounds? Check presence: is it missing when it should not be? Check consistency: does it conflict with other state? If any check fails, handle it. Do not pass bad data into the rest of the program.

A voltage reading arrives over Wi‑Fi. Validate before using: is it a number? Is it between zero and twenty volts? Is it not null? If any check fails, handle it—do not pass bad data into the rest of the program.

## 4) Fail at the Boundary, Not in the Middle

A program that rejects bad input at the edge is easier to debug than one that corrupts state and fails later. When you see a crash deep in your logic, ask what crossed the boundary earlier that should not have. Fail at the boundary, not in the middle. That way the failure points to the real cause: bad input, not a bug in core logic.

## 5) Boundaries Are Contracts

A boundary is a contract: if you give me data in this form, I will behave in this way. The contract is not enforced by the computer. You enforce it by validating at the boundary.

## Common Pitfalls

Trusting data as soon as it crosses the boundary causes bugs. Always validate. Assume the world can send null, wrong types, empty files, and missing packets.

Validating too late allows bad data to become state. Once bad data is in variables, it spreads. Validate at the edge so bad data never enters.

Skipping range checks causes plausible-but-wrong behavior. A voltage of 999 might pass a "is it a number?" check but be impossible. Check shape and range.

Not handling missing or late data causes intermittent failures. Networks drop packets. Files are sometimes missing. Design for absence, not only for presence.

## Summary

Programs touch the outside world at boundaries. Validation at those boundaries—checking shape, range, presence, and consistency—prevents bad data from corrupting state and causing mysterious failures later. Fail at the edge, not in the middle. Boundaries are contracts you enforce. One anchor for the whole phase: a program is a sequence of instructions that transforms data and state over time using conditions, loops, and functions. Whether the program runs on a microcontroller or a server, that holds.

## Next

This chapter closed Section A Phase 1 by making boundaries explicit. Conditions, loops, functions, data, errors, time, and boundaries form one mental model for how programs behave in the real world.
