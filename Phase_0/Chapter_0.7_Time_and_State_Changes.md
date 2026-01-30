# Phase 0 · Chapter 0.7: Time and Programs Over Change

Programs are not static objects.

They live:
- Over time
- While state changes
- While inputs arrive
- While outputs are produced

Even the shortest program has a timeline.

---

## Time Is Implicit

Most programs do not say "time" explicitly.

But time is always present:
- Instructions happen in order
- State changes between steps
- Inputs arrive later
- Conditions evaluate at different moments

Ignoring time is how subtle bugs appear.

---

## Timing Is Everything in Real Systems

Timing matters most when:
- Reading sensors
- Talking to networks
- Handling user input
- Running embedded systems

Two correct instructions in the wrong order can be a broken system.

---

## Reflection

Think about:
- Monitoring battery voltage
- Waiting for a response
- Polling a sensor

That's time-aware programming.

---

## Understanding Check

You should be able to say:

"Programs operate over time, and state changes between steps matter."

If that feels solid, you're ready for the final consolidation chapter.
