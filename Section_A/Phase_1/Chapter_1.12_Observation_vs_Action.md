# Section A Phase 1 · Chapter 1.12: Observation vs Action

Reading state and changing state are fundamentally different operations. Confusing them leads to feedback loops, race conditions, oscillation, and bugs that only appear sometimes. This chapter is about drawing a hard conceptual line between seeing the world and changing the world, and why systems become unstable when that line blurs. Chapter 1.11 showed that abstractions lie when names imply observation but cause action. This chapter makes that distinction explicit and structural.

## Learning Objectives

After this chapter, you will be able to:
- Distinguish observation from action as fundamentally different operations
- Understand why mixing observation and action causes feedback loops and instability
- Recognize when observation lies by causing side effects
- Design systems with clear separation between observation and action
- Understand feedback loops and how to control them
- Recognize accidental feedback loops and timing issues
- Use naming to make observation and action obvious

## Key Terms

- **Observation**: Reading state, inspecting current state, asking questions about the system without changing it
- **Action**: Writing values, updating variables, changing the outside world
- **Feedback Loop**: A cycle where observation leads to action, which changes what is observed, leading to another observation
- **Accidental Feedback Loop**: An unintentional feedback loop caused by mixing observation and action
- **Coordination Function**: A function that calls observers, makes decisions, and triggers actions
- **Self-Interfering**: When observation changes what it observes

## 1) Two Kinds of Operations

At a high level, every meaningful operation a program performs falls into one of two categories: observation and action. Everything else, conditions, loops, functions, exists to coordinate these two.

Homestead example: a battery monitor observes voltage and decides whether to act, start generator, alert, log. The observation and the action are separate steps. Coordination is the logic that connects them: if voltage low and generator off, then start generator.

## 2) Observation Does Not Change State

Observation means reading a value, inspecting current state, asking a question about the system, or measuring something about the world. Examples include reading temperature, checking voltage, inspecting whether a flag is set, or asking is the generator running? The defining rule: observation should not change what it observes. If observing changes state, the system becomes self-interfering.

Homestead example: reading voltage shouldn't change voltage. Checking is the generator running shouldn't start it. If get_voltage turns on a relay to get a reading, the observation changed what it observed. The system is now self-interfering.

## 3) Observation Is About Truth at a Moment

When you observe state, you are asking what is true right now? Observation is always tied to a moment in time, the current state, and the current inputs. It does not predict the future, enforce behavior, or cause change. It only reveals what is.

Homestead example: what is the voltage right now? A snapshot at this moment. Not what will it be after the generator runs or what was it five minutes ago. Observation captures truth at a moment. Prediction and history are different.

## 4) When Observation Lies

Observation becomes dangerous when it pretends to be passive but isn't. Example: a function named get_voltage that reads a sensor, and also turns on a relay, updates a shared variable, or triggers logging with side effects. The caller believes I'm just looking. The system is actually doing. This mismatch creates invisible coupling between parts of the program.

Homestead example: get_voltage that turns on a relay to stabilize the reading. The caller expected observation. They got action. The next caller might be a dashboard that only wants to display voltage. Now the dashboard triggers a relay. The abstraction lied. Chapter 1.11: names are promises.

## 5) Action Changes State

Action means writing a value, updating a variable, flipping a relay, sending a signal, or changing the outside world. After action, state is different, the world has changed, and future observations will reflect that change. Action is irreversible in the short term. You can't un-flip time.

Homestead example: flipping a relay to start the generator. The relay is on. The world has changed. Future observations will see generator running, voltage rising. You can't un-flip without another deliberate action. Action is commitment.

## 6) Action Is Commitment

When a program acts, it commits to a new reality. Examples include starting a generator, opening a valve, writing to disk, or sending a network command. Once action occurs, other parts of the system must adapt, assumptions must be updated, and state must be reconsidered. This is why action must be deliberate.

Homestead example: start_generator commits. The generator is running. Battery voltage will rise. Temperature may change. Any observer that assumed generator off must update. Acting is committing. Don't act until you've observed and decided.

## 7) Feedback Loops: When Observation and Action Collide

A feedback loop occurs when you observe state, you act based on that observation, the action changes what you observe, you observe again, and the cycle repeats. Feedback loops are not bad. They are powerful. They are also dangerous.

Homestead example: voltage low, start generator, voltage rises, stop generator, voltage drops, start again. That's an intentional feedback loop. It works if you wait between cycles and respect timing. It oscillates, start, stop, start, stop, if you don't.

## 8) The Thermostat Example

Consider a thermostat: observe temperature, decide if it's too hot, turn on the fan, fan cools air, temperature changes, observe again. This is a controlled feedback loop. It only works because observation is separate from action, timing is respected, the system waits between cycles, and state changes are expected. Remove any of those, and the system oscillates.

Homestead example: a greenhouse thermostat, observe temperature, decide to open vent, act. Vent opens, temperature drops, observe again. Same pattern. It works because observation is separate from action and timing is respected. Another: a battery monitor observes voltage, decides to start the generator, acts, then waits. If it re-checks voltage in one second, the generator hasn't stabilized. The reading is wrong. The system oscillates, start, stop, start, stop. Wait between observe and re-observe. Chapter 1.7: time matters.

## 9) Accidental Feedback Loops

The worst bugs come from unintentional feedback loops. Examples include observing state that was just modified, acting on partially updated data, re-checking conditions too quickly, or letting observation trigger action implicitly. These systems don't fail consistently. They fail intermittently. That's why they're hard to debug.

Homestead examples: get_voltage that turns on a relay before reading. The observation acts first. The next observation sees a different world than the one that existed before the call. Or observing voltage immediately after start_generator. The reading reflects transitional state, not stable state. Acting on it causes wrong decisions. Or re-checking is voltage low every one hundred milliseconds. Too fast, the system oscillates. The accidental feedback loop hides in timing. Cause and effect blur. The bug appears sometimes.

## 10) Order Matters More Than People Expect

A stable pattern looks like this: observe the world, decide based on rules, act deliberately, wait, repeat. Breaking this order causes trouble. Acting before observing causes stale decisions. Observing mid-action causes half-truths. Acting repeatedly without delay causes oscillation. Order is how you control time.

Homestead examples: acting before observing, you start the generator because last cycle said voltage was low. But voltage recovered. You acted on stale data. Observe first. Decide. Then act. Observing mid-action, you check voltage while the relay is flipping. The reading is transitional, not stable. Half-truth. Acting on it causes wrong decisions. Acting repeatedly without delay, you start the generator, check voltage one second later, stop it, check again, start again. Oscillation. Wait between cycles.

## 11) Observation and Action Should Be Obvious in Names

Because this distinction matters so much, names must carry it clearly. Good examples: get_voltage observes, is_battery_low observes, start_generator acts, stop_generator acts. If a function does both, the name must say so: check_and_start_if_low, observe_and_adjust. Ambiguous names create invisible behavior.

Homestead example: check_battery that starts the generator when low. The name implies observation only. Rename to check_and_start_if_low or split into check_battery and start_generator_if_low. The name must match the behavior.

## 12) Functions Can Observe, Act, or Coordinate

There are three valid roles for a function. Observation functions read state, return information, and cause no side effects. Action functions change state, affect the world, and often return nothing meaningful. Coordination functions call observers, make decisions, and trigger actions. Coordination functions are where policy lives. Observation and action functions should be as simple and honest as possible.

Homestead example: run_battery_logic is a coordinator. It calls get_voltage, decides, then calls start_generator or does nothing. get_voltage observes. start_generator acts. The coordinator owns the when and why.

## 13) Why This Separation Stabilizes Systems

When observation and action are cleanly separated, state is easier to reason about, timing assumptions are clearer, feedback loops are intentional, and debugging becomes straightforward. When they are mixed, cause and effect blur, changes ripple unpredictably, and bugs feel random. This is not a style preference. It's a stability requirement.

Homestead contrast: mixed, get_voltage that starts the generator when low. Cause and effect blur. Why did it start becomes archaeology. Separated, get_voltage only reads. run_battery_logic observes, decides, and calls start_generator. Cause and effect are clear. Debugging is straightforward.

## Common Pitfalls

Mixing observation and action creates feedback loops and unpredictable behavior. Observation should not change state. If observation changes what it observes, the system becomes self-interfering. Keep observation and action separate.

Letting observation lie by causing side effects breaks trust. When observation pretends to be passive but causes action, it creates invisible coupling. Names must make observation and action obvious. Don't let observation act silently.

Ignoring timing in feedback loops causes oscillation. Feedback loops require waiting between cycles. Re-checking conditions too quickly causes oscillation. Order matters. Observe, decide, act, wait, repeat.

Acting before observing causes stale decisions. Observing mid-action causes half-truths. Acting repeatedly without delay causes oscillation. Order is how you control time. Follow the stable pattern.

Confusing coordination with observation or action misses the point. Coordination functions call observers, make decisions, and trigger actions. They own policy. Observation and action functions should be simple and honest. Don't mix roles.

## Summary

Reading state and changing state are fundamentally different operations. Observation reads state without changing it. Action changes state. Mixing them carelessly creates feedback loops and unpredictable behavior. Observation should not change what it observes. If observation changes state, the system becomes self-interfering. Observation is about truth at a moment. Action is commitment. When observation lies by causing side effects, it creates invisible coupling. Feedback loops occur when observation and action collide. They are powerful and dangerous. Accidental feedback loops come from unintentional mixing. Order matters. Observe, decide, act, wait, repeat. Names must make observation and action obvious. Functions can observe, act, or coordinate. Coordination functions own policy. Observation and action functions should be simple and honest. Separation stabilizes systems. Stable systems observe first, decide deliberately, and act explicitly.

## Next

This chapter covered the distinction between observation and action, feedback loops, and why separation stabilizes systems. Next, Chapter 1.13 explores complexity growth, explaining why systems become hard faster than expected and how small additions multiply possible states. Understanding observation versus action helps you design stable systems.
