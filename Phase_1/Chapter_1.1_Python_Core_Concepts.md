# Phase 1 · Chapter 1.1: Python Core Concepts

If Phase 0 was the "physics," Phase 1 is learning the "wiring harness" that expresses that physics.

Python is our anchor language—not because it's trendy, but because it expresses core ideas with very little noise.

---

## What a Python Program Actually Is

A Python program is a text file containing instructions.

When you write Python, you are writing a script: a sequence of instructions that Python reads from top to bottom. Python is the interpreter—the thing that reads your text and carries out those instructions.

Here's the key idea:

**Python executes your file from the first line to the last line, in order.**

Even if your program feels complicated later, Python is always doing that basic thing: moving forward through instructions.

---

## What Counts as a "Program"

A program can be:
- One line: `print("hello")`
- Ten lines: read input, compute something, print output
- Ten thousand lines: full application

Python doesn't care about size. It cares about valid instructions in a valid order.

So if you want the cleanest mental model: **A Python program is a timeline of instructions.**

---

## The Runtime: Where the Program Actually Lives

When you "run" Python, Python creates a running world for your program. That world contains:
- Values (numbers, text, true/false)
- Names (variables)
- State (what those variables currently hold)
- Control flow (where you are in the instruction list)

This world exists only while the program is running.

When the program ends, the world disappears—unless you wrote outputs somewhere permanent (files, a database, a network, etc.).

That's why state matters so much:
- State is what the program knows right now
- And state is constantly changing as instructions execute

---

## "But What About Apps?"

You'll eventually build things that feel like they aren't "top to bottom," like:
- Web servers
- Sensor loops
- GUIs
- Background workers

Those are still top-to-bottom programs.

They just include a loop that keeps them alive, or they register functions to be called later.

Underneath the complexity, Python is still:
- Reading instructions
- Changing state
- Branching on conditions
- Looping

Same Phase 0 model.

---

## What "Running a File" Really Means

When you run a Python file:
1. Python reads the text.
2. Python checks if the text is valid Python (syntax).
3. Python executes it line by line.

If step 2 fails → you get a syntax error.
If step 3 fails → you get a runtime error.

This distinction is huge for debugging later.

- **Syntax error:** Python can't understand your instructions.
- **Runtime error:** Python understood the instructions, but something happened while executing them (bad state, unexpected input, wrong assumption).

---

## Variables: Names That Hold State

In Phase 0 we said: state is what the program remembers.

In Python, state is mainly held in variables.

A variable is a name that points to a value.

That's it.

Not a box, not a magical container—just a name → value association.

---

## Why Variables Exist

Without variables, you can still compute, but you can't remember results.

Variables let you:
- Store intermediate results
- Reuse values later
- Make code readable
- Model the state of a system

When you write Python, a large part of what you're doing is:
- Creating names
- Changing what those names refer to

That is state management.

---

## State Changes Are the Whole Game

Example in plain English:
- `battery_voltage` starts at 12.6
- You read a new value
- `battery_voltage` becomes 12.4
- You check a condition based on that

The program doesn't "know" voltage. It knows the variable you update.

So the program's truth is whatever state currently exists in those names.

---

## Good Variables Communicate Meaning

A variable name is a signal to future-you and to employers.

Good:
- `battery_voltage`
- `target_temp`
- `is_generator_running`

Bad:
- `x`
- `temp2`
- `thing`

Bad names create debugging pain because they hide meaning.

---

## Conditions in Python: Branching With if

A condition is a true/false check that determines which path runs.

Python expresses that using `if`.

The key concept is still the same: **A program does not decide. It branches.**

---

## What if Really Means

When Python reaches an `if`:
1. It evaluates the condition.
2. If true, it executes the indented block.
3. If false, it skips that block (or goes to `else` if present).

This is important: **The code inside an `if` may never run.**

So a huge part of reasoning about programs is asking:
- Under what states will this block run?
- Under what states will it be skipped?

---

## Indentation Is Not Style in Python

In Python, indentation is structure.

Indentation tells Python:
- What belongs inside the `if`
- What belongs outside

This is why Python is such a good anchor language: it forces clear structure.

When the indentation changes, the program changes.

---

## else and elif

`else` is not special logic. It's the other branch.

- If condition is true → do Track A
- Else → do Track B

Both tracks are explicitly written. Python simply chooses which one runs based on state.

`elif` means: check another condition if the previous one was false.

This is useful when you have multiple mutually exclusive cases. But the danger is you can create "spaghetti branching" if you overuse it without clarity.

---

## Loops in Python: Repeating With while and for

Loops are controlled repetition.

In Python you'll mainly see:
- `while` loops
- `for` loops

They are both repetition, but they feel different.

---

## while: Repeat While a Condition Is True

A `while` loop says: Keep doing this while the condition stays true.

It is the purest form of a loop:
- Condition checked
- Block runs
- State changes
- Condition checked again

The same warning from Phase 0 applies:

Every loop must have:
1. Starting state
2. A condition
3. A state change that eventually ends the loop

If you miss the state change, you get an infinite loop.

---

## for: Repeat Over a Collection

A `for` loop says: For each item in this group, do this.

It's extremely common because most real programs deal with lists of things:
- Readings
- Files
- Messages
- Lines of text
- Sensors
- Tasks

A `for` loop is still repetition, but Python handles the "when to stop" part by walking through the collection.

---

## Loops + Conditions = Real Behavior

Most useful programs combine loops and conditions.

Example pattern in English:
- Repeat forever:
  - Read sensor
  - If too hot, turn fan on
  - Else, turn fan off
  - Wait a moment
  - Repeat

That's basically 70% of embedded logic in human terms.

---

## Functions in Python: Turning Behavior Into Something You Can Use

Up to now, everything we've talked about in Python has been raw execution:
- Python reads a line
- Executes it
- Moves to the next line

That works for small scripts. It completely breaks down for real systems.

Functions exist to solve that problem.

---

## What a Function Actually Is

A function is a named sequence of instructions that performs one coherent piece of behavior.

Not multiple ideas. Not a whole system. One job.

This is important enough to repeat differently:

**A function is a contract:**
- Given certain inputs
- Perform a specific behavior
- Optionally produce an output

The computer does not care about this contract. Humans do.

---

## The def Keyword Is a Declaration, Not an Action

This is one of the most important Python ideas to lock in early.

When Python encounters:

```python
def check_voltage(v):
    return v < 12.0
```

Python does not:
- Check voltage
- Compare values
- Return anything

Instead, Python:
- Stores the instructions
- Associates them with the name `check_voltage`
- Moves on

Nothing runs yet.

**Defining a function does not execute it.**

That separation—definition vs execution—is foundational.

---

## Calling a Function Is an Instruction Like Any Other

When Python later sees:

```python
result = check_voltage(11.8)
```

Now the function runs.

At that moment:
- A new temporary execution context is created
- Inputs are assigned to parameter names
- Instructions run top to bottom
- A return value is produced
- Execution returns to the caller

This is just controlled execution, not magic.

---

## Parameters Are Temporary State

Parameters:
- Are variables
- Exist only while the function is running
- Are destroyed when the function finishes

This matters because it prevents accidental state leaks.

Functions are isolation boundaries. That's how large systems stay sane.

---

## Return Values Are Data, Not Actions

When a function returns a value:
- The function ends
- That value becomes data
- You decide what to do with it

The function does not "send" the value anywhere. The caller receives it.

This reinforces Phase 0 thinking: Programs are about data moving through transformations.

---

## Why Employers Care About Functions

When someone reviews your code, they look at:
- Function size
- Function names
- Function responsibility

Good functions signal:
- Clear thinking
- Decomposition skills
- Maintainability

Messy functions signal:
- Confusion
- Overloading ideas
- Future bugs

This is not stylistic. It's structural.

---

## Input and Output: Crossing the Boundary Between Program and World

Everything we've discussed so far lives inside the program.

But programs are only useful if they interact with the outside world.

That interaction happens through input and output, often shortened to I/O.

---

## Output: Revealing State

The simplest form of output in Python is `print`.

`print` does not:
- Change program logic
- Affect conditions
- Modify state by itself

It only reveals information.

This is crucial: **Output is observational, not transformational.**

This is why `print` is so powerful for learning. You can:
- Watch state change
- See execution order
- Confirm assumptions

Professional developers use output constantly while reasoning.

---

## Input: Letting the World Influence State

Input introduces external state.

When Python executes:

```python
user_input = input("Enter value: ")
```

The program:
- Pauses
- Waits
- Resumes with new data

This creates a time boundary.

The program is no longer deterministic unless you control the input.

This is the first moment where:
- The world can surprise your program
- Errors become more likely
- Validation becomes necessary

---

## Input Is Always Untrusted

This is a professional mindset worth adopting immediately.

All input can be:
- Missing
- Malformed
- Unexpected
- Malicious

Even when you are the user.

Programs that assume "good input" eventually break.

---

## Input and Output Are Edges, Not the Core

This is subtle but important:

The core logic of your program should:
- Accept data
- Produce results
- Be testable without real input

I/O should sit at the edges.

This separation is what allows:
- Reuse
- Testing
- Scaling
- Embedded translation later

You're already practicing this with functions.

---

## Errors and Tracebacks: How Python Explains Reality to You

Errors feel personal at first. They are not.

They are Python reporting facts.

---

## What a Traceback Really Is

A traceback is a timeline of execution that shows:
- Where the program was
- What it was doing
- Where it failed

It is Python saying: "Here is the exact path that led to this failure."

This is extremely generous behavior. Many systems fail silently. Python does not.

---

## Syntax Errors vs Runtime Errors

**Syntax Errors:**
- Python cannot parse the code
- The program never starts
- These are structural problems

Examples: Missing colon, incorrect indentation, invalid keyword usage.

These are fixed before thinking about logic.

**Runtime Errors:**
- Python understood the code
- Execution encountered a bad state

Examples: Converting text to a number, accessing missing data, dividing by zero.

These are logic and assumption problems.

---

## Exceptions Are Controlled Failures

When Python raises an exception, it is:
- Stopping execution
- Preserving system integrity
- Giving you diagnostic data

Handling exceptions is acknowledging uncertainty.

It is not defensive programming. It is realistic programming.

---

## Try / Except Is Explicit Uncertainty Handling

Using `try / except` means: "I know this might fail, and I have a plan if it does."

This is a mark of maturity, not weakness.

---

## A Python Program as a Living System

At this point, you no longer have isolated ideas. You have a system.

Let's describe it in motion.

---

## The Full Execution Story

A Python program:
1. Starts at the top
2. Defines functions
3. Sets initial state
4. Enters a control loop
5. Accepts input
6. Evaluates conditions
7. Updates state
8. Produces output
9. Repeats or exits

Nothing here is accidental.

Every real system—embedded, web, automation—follows this pattern.

---

## Loops Keep Systems Alive

Programs that "run forever" are just loops with no exit condition.

Programs that "wait" are loops checking conditions.

Programs that "respond" are loops reacting to input.

Life-like behavior is repetition plus state change.

---

## Why This Transfers to Embedded Systems

ESP32 logic looks different syntactically, but conceptually it is identical:
- Setup phase
- Loop phase
- Read input
- Evaluate conditions
- Act
- Repeat

You are already learning embedded thinking.

---

## Understanding Check

You should be able to say:

"A Python program is a text file of instructions that Python executes top to bottom, changing state as it goes. Variables store state, conditions branch execution, loops repeat work, functions name behavior, and I/O connects the program to the world."

If that sentence feels solid, you're ready for the next chapter on advanced Python patterns.
