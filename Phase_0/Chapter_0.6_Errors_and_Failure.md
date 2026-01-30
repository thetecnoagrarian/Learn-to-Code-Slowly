# Phase 0 · Chapter 0.6: Errors and What Failure Actually Means

Errors feel emotional to humans.

To computers, they are mechanical.

---

## What an Error Is

An error is not:
- A mistake
- A bad program
- A failure of intelligence

An error is:
- An assumption that did not hold
- An input that was not handled
- A state you did not expect

---

## Computers Never Get Confused

This is important.

If something breaks:
- The computer did exactly what it was told
- The instructions were incomplete
- The logic did not cover a case

The computer is never "wrong."

The model in the human's head was wrong.

---

## Good Programs Assume Things Will Go Wrong

Strong programs:
- Check inputs
- Guard against missing data
- Handle bad timing
- Fail loudly when assumptions break

Weak programs assume:
- Everything will be perfect
- Inputs will behave
- State will always be correct

That assumption always fails eventually.

---

## Errors Are Information

Errors tell you:
- Where your model was incomplete
- What you forgot to consider
- How reality differs from expectation

Learning to read errors calmly is a professional skill.

---

## Reflection

Think about any system you've debugged in real life.

The failure was rarely random. It was something you didn't account for.

Programming failures are the same.

---

## Understanding Check

You should be able to say:

"Errors happen when reality violates an assumption in the program."

If that feels solid, you're ready for the next chapter on time and state changes.
