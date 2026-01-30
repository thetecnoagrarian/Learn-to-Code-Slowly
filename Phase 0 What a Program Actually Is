
Phase 0

What a Program Actually Is

I want you to forget programming languages for a moment. Forget Python, JavaScript, C, HTML, all of it. Those are just dialects. We’re going underneath them.

A program, at its core, is a written set of instructions that transforms inputs into outputs.

That’s it. Everything else is decoration.

Let me say that again, slightly differently, because repetition matters:

A program is a machine-readable recipe that takes something in, applies rules, and produces something out.

If there is no input, the program is still operating on state.
If there is no visible output, the program is still producing a result somewhere.

Nothing escapes this.

⸻

Inputs, Rules, Outputs

Think of it as a box.
	•	Input: data coming in
	•	Rules: the logic you define
	•	Output: data coming out

The box does not care why you wrote the program.
It does not care about intent.
It only executes the rules, in order, exactly.

A calculator.
A thermostat.
An ESP32 reading a sensor.
A web server handling a request.
A script renaming files.

Same box. Different costumes.

⸻

Determinism (Important Word)

Most programs are deterministic.

That means:

Given the same inputs and the same starting state, the program will always produce the same outputs.

This is why bugs are possible.
And also why debugging is possible.

When something goes wrong, it’s not “random.”
It’s unaccounted-for state or unexpected input.

Hold onto that phrase. We’ll reuse it a lot.

⸻

State: The Invisible Input

Here’s the part people skip, and it causes years of confusion.

A program is never just reacting to inputs.

It is also reacting to state.

State is:
	•	What the program remembers
	•	What variables currently hold
	•	What the world looks like at that moment

Examples:
	•	A counter starting at zero
	•	A temperature from one second ago
	•	Whether a door was already open
	•	Whether Wi-Fi is connected

So a better definition is this:

A program transforms inputs + current state into outputs + new state.

Say it again mentally. Slowly.

Inputs.
State.
Rules.
Outputs.
New state.

That loop never stops while the program is running.

⸻

Why This Matters for Employment

Employers don’t actually care if you “know a language.”

They care if you can:
	•	Reason about inputs
	•	Track state changes
	•	Predict outputs
	•	Explain why something behaves the way it does

Frameworks change.
Languages rise and fall.
This mental model does not.

If you understand this, everything else becomes translation.

⸻

Driving Reflection 

While you’re driving, ask yourself:
	•	What are the inputs in my solar system?
	•	What is the state of my battery bank right now?
	•	What rules decide when something turns on or off?
	•	What outputs happen because of that?

You are already thinking like a programmer.
You just haven’t been calling it that.

⸻

Lock-In Check (don’t answer me yet)

Before we move on later, you should be able to say, out loud if needed:

“A program takes inputs and state, applies rules, and produces outputs and new state.”

If that sentence feels solid, we’re ready for Lesson 0.2.

⸻

Phase 0 · Lesson 0.2

What “Instructions” Really Mean

Last time, we said:

A program takes inputs and state, applies rules, and produces outputs and new state.

Today we’re zooming in on the word rules — because in programming, rules are called instructions, and they behave in very specific ways.

⸻

What an Instruction Is

An instruction is a single, unambiguous command the computer can follow.

Not a suggestion.
Not a goal.
Not a description.

A command.

Think of it like telling someone:
	•	“Add these two numbers.”
	•	“Store this value.”
	•	“Check if this is true.”
	•	“Repeat this step.”

Each instruction does one small thing.

Computers are extremely literal. They do not infer meaning. They do not fill gaps. They execute instructions exactly as written, in order.

⸻

Sequence Matters (More Than You Think)

Instructions are executed sequentially.

That means:
	•	First instruction runs
	•	Then the second
	•	Then the third
	•	And so on

Even when programs appear to do many things at once, under the hood there is always a defined order.

If you change the order, you change the program.

This is not a subtle point.
This is one of the most common sources of bugs.

⸻

Instructions Don’t “Know” the Big Picture

Each instruction:
	•	Has no memory of the future
	•	Knows nothing about your intent
	•	Only sees current state and input

You, the programmer, are responsible for:
	•	Choosing the right instructions
	•	Putting them in the right order
	•	Making sure state ends up where you expect

This is why programming feels powerful and fragile.

⸻

Instructions Change State

Most instructions do one of three things:
	1.	Read state
	2.	Modify state
	3.	Produce output

Often they do more than one.

Example in plain language:
	•	“Read the current temperature”
	•	“Compare it to the target”
	•	“Turn the fan on if needed”
	•	“Remember that the fan is now on”

Nothing magical happened.
Just state being transformed step by step.

⸻

Repetition Is Not Intelligence

Here’s an important correction to a common myth:

Computers are not smart because they repeat things.

They are useful because they repeat things perfectly.

A loop is not clever.
It’s just an instruction that says:

“Do these same steps again until a condition changes.”

This is boring — and that’s the point.

⸻

Why This Matters Later

When people say:
	•	“This code is confusing”
	•	“This program is unpredictable”
	•	“I don’t know why this broke”

What they usually mean is:

“I lost track of the instructions and how they changed state.”

Your job is not to write clever code.
Your job is to write traceable instructions.

That skill transfers everywhere:
	•	Web
	•	Embedded
	•	Automation
	•	Data
	•	Systems work

⸻

Driving Reflection

While driving, think through something simple you do every day — very literally:

Making coffee.
Starting your generator.
Locking up at night.

Ask yourself:
	•	What are the instructions?
	•	What order do they run in?
	•	What state changes after each step?

If you can narrate it cleanly, you’re thinking like a programmer.

⸻

Lock-In Check (again, don’t answer me yet)

You should be able to say:

“A program is a sequence of instructions that read and change state in a defined order.”

If that feels solid, we’re ready for Phase 0.3.

⸻

Phase 0 · Lesson 0.3

Conditions: How Programs Make Decisions (Without Thinking)

Programs don’t decide in the human sense.
They branch.

That distinction matters more than it sounds.

⸻

What a Condition Is

A condition is a yes-or-no question about current state or input.

That’s it.

Not a plan.
Not a preference.
Not intelligence.

Just a question with exactly two possible outcomes:
	•	True
	•	False

Examples in plain language:
	•	Is the temperature above 72?
	•	Is the battery voltage below the cutoff?
	•	Did the user press the button?
	•	Is this value equal to zero?

The program does not wonder.
It checks.

⸻

Branching, Not Choosing

When a condition is evaluated, the program follows one path or another.

Think of a railroad switch:
	•	Track A if the condition is true
	•	Track B if the condition is false

Both tracks already exist.
The program doesn’t invent a new one.

This is why we call it control flow.

⸻

Conditions Depend on State

Conditions don’t float in isolation.

They always depend on:
	•	Current state
	•	Current input
	•	Or both

Change the state, and the same condition may evaluate differently.

This is why timing matters.
This is why order matters.
This is why bugs appear “sometimes.”

Nothing is random.
The state was different.

⸻

Nesting: Where Complexity Creeps In

One condition inside another is called nesting.

Example in English:
	•	If the battery is low:
	•	If the generator is off:
	•	Start the generator

Each condition narrows the path.

This works — but too much nesting makes code hard to reason about.

A good programmer tries to:
	•	Keep conditions simple
	•	Make branches obvious
	•	Reduce mental load when reading

Employers care about this more than clever tricks.

⸻

Conditions Are Not Logic (Yet)

Important clarification:

A single condition is not “logic” in the philosophical sense.

It’s just a comparison.

Logic emerges when you:
	•	Combine conditions
	•	Chain them
	•	Use them to control state changes

We’ll get there later. Not yet.

⸻

Common Beginner Trap

People often think:

“The program should know what I mean.”

It doesn’t.

If you didn’t explicitly write the condition:
	•	It won’t be checked
	•	It won’t be handled
	•	It will fail silently or catastrophically

This is not cruelty.
It’s consistency.

⸻

Driving Reflection

While driving, think about this:

Your thermostat does not “want” comfort.
It checks a condition.

Your truck’s warning light does not “decide” to turn on.
It evaluates a condition.

Every automated system you interact with is a forest of conditions and branches.

You already live inside this model.

⸻

Lock-In Check

You should be able to say, cleanly:

“A condition is a true/false check that determines which path of instructions runs.”

If that sentence feels stable, we’re ready to talk about loops — controlled repetition.

⸻

Phase 0 · Lesson 0.4

Loops: Controlled Repetition

A loop is an instruction that says:

“Repeat these steps until something changes.”

That’s all it is.

No magic.
No intelligence.
Just repetition with a stopping condition.

⸻

Why Loops Exist

Computers are fast, but they are dumb.

Loops exist so you don’t have to:
	•	Rewrite the same instruction 1,000 times
	•	Predict how many times something needs to happen
	•	Manually track progress

Instead, you say:
	•	“Keep going while this is true”
	•	Or “repeat this for each item”
	•	Or “stop when this condition is met”

⸻

Every Loop Has Three Parts

This is critical. Burn it in.

Every loop contains:
	1.	A starting state
	2.	A condition to keep going
	3.	A change to state that eventually ends the loop

If any one of these is missing, you get:
	•	An infinite loop
	•	A loop that never runs
	•	A loop that stops too early

Loops don’t fail randomly.
They fail structurally.

⸻

Loops Are Conditions Over Time

A loop is not a new idea.

It’s just:
	•	A condition
	•	Checked repeatedly
	•	While state changes

That’s it.

Same condition.
Different moment in time.

⸻

Where Loops Are Used

Everywhere:
	•	Reading sensor data repeatedly
	•	Waiting for a button press
	•	Iterating over files
	•	Polling a network
	•	Running a game loop
	•	Keeping a server alive

If something feels “alive,” it’s almost always a loop.

⸻

Driving Reflection

Think about:
	•	Checking your mirrors while driving
	•	Monitoring battery voltage
	•	Waiting for water to boil

You’re looping mentally.

Humans do this naturally.
Computers must be told explicitly.

⸻

Phase 0 Consolidation

Lessons 0.1 – 0.4, Repeated Cleanly

This is the core mental model. Nothing here is optional.

⸻

The Whole System (One Pass)

A program:
	•	Takes inputs and current state
	•	Executes a sequence of instructions
	•	Evaluates conditions to choose paths
	•	Uses loops to repeat work
	•	Produces outputs and new state

Then the cycle continues.

⸻

Reduced Further (Even Cleaner)

Say this slowly:

Inputs and state go in.
Instructions run in order.
Conditions choose paths.
Loops repeat steps.
State changes.
Outputs appear.

That is programming.

⸻

What You’re Actually Learning

You are not learning:
	•	Python
	•	JavaScript
	•	C
	•	Frameworks

You are learning how machines process change over time.

Languages only give you syntax to express this.

⸻

Why This Transfers to Jobs

A junior dev who understands this:
	•	Can debug
	•	Can reason about systems
	•	Can explain failures
	•	Can learn new stacks fast

A junior dev who skips this:
	•	Memorizes patterns
	•	Breaks things mysteriously
	•	Struggles outside tutorials

Employers can tell the difference.

⸻

Lock-In Self Test (For Notes)

You should be able to explain, without hesitation:
	1.	What a program is
	2.	What state means
	3.	Why instruction order matters
	4.	What a condition does
	5.	Why loops must change state

If any of those feel fuzzy, re-listen. That’s not failure — that’s reinforcement.


Phase 0.5–0.8
Phase 0 · Lesson 0.5

Functions: Naming Behavior So Humans Can Think

Up until now, everything we’ve talked about has been about what the computer does.

Functions are the first concept that exists mostly for humans.

A function is a named group of instructions.

That’s the whole idea.

Not a new capability.
Not a new kind of logic.
Just a name wrapped around behavior.

⸻

Why Functions Exist at All

Computers do not need functions.

They are perfectly happy executing one long list of instructions from top to bottom.

Humans are not.

Without functions:
	•	Programs become unreadable
	•	Intent disappears
	•	Small mistakes hide inside large blobs of logic

Functions exist to let you say:

“This set of instructions represents one idea.”

⸻

What a Function Really Does

A function:
	•	Has a name
	•	Contains instructions
	•	May accept inputs
	•	May return outputs
	•	Always runs in sequence, just like any other instructions

Nothing inside a function breaks the rules you already learned.

Inside a function:
	•	State is read
	•	State is changed
	•	Conditions branch
	•	Loops repeat

A function is not a shortcut around thinking.
It is a label on thinking you already did.

⸻

Naming Is the Real Skill

The hardest part of functions is not writing them.

It’s naming them.

A good function name:
	•	Describes what happens, not how
	•	Matches how a human would explain the behavior
	•	Makes the code readable without comments

Employers look at function names before logic.

Bad names signal confusion.
Clear names signal understanding.

⸻

Driving Reflection

While driving, think about this:

If you had to explain your generator startup process to someone else:
	•	Where would you group steps?
	•	What would you name each group?

Those groupings are functions.
You already do this mentally.

⸻

Lock-In Thought

You should be able to say:

“A function is a named group of instructions that helps humans understand behavior.”

If that sentence feels stable, move on.

⸻

Phase 0 · Lesson 0.6

Data and Variables: What Programs Actually Touch

Programs do not work with ideas.
They do not work with meaning.

They work with data.

Everything a program sees, stores, checks, or changes is data.

⸻

What Data Is

Data is information in a form the computer can handle.

Examples:
	•	A number representing temperature
	•	A word or message
	•	A true or false value
	•	A list of readings
	•	A structured record of values

No matter how complex a system feels, it is always built from simple data pieces.

⸻

Variables Are Memory With Names

A variable is a name that points to a piece of data.

That’s all it is.

It lets the program:
	•	Remember something
	•	Refer to it later
	•	Change it over time

Variables are state.

When people say:

“I lost track of what’s happening”

What they usually lost track of is variables.

⸻

Data Has Shape, Not Just Value

This part is critical and often skipped.

Data is not just “a thing.”
It has shape.

Examples:
	•	One temperature value
	•	A list of temperatures
	•	A table of timestamps and values
	•	A message with multiple fields

Most bugs come from assuming the wrong shape.

The value might be correct.
The structure might not be.

⸻

Driving Reflection

While driving, think about your systems:
	•	What data exists?
	•	What data changes?
	•	What data is remembered?
	•	What data is temporary?

If you can name the data, you can program the system.

⸻

Lock-In Thought

You should be able to say:

“Programs operate on data stored in variables that represent state.”

⸻

Phase 0 · Lesson 0.7

Errors: What Failure Actually Means

Errors feel emotional to humans.

To computers, they are mechanical.

An error is not:
	•	A mistake
	•	A bad program
	•	A failure of intelligence

An error is:
	•	An assumption that did not hold
	•	An input that was not handled
	•	A state you did not expect

⸻

Computers Never Get Confused

This is important.

If something breaks:
	•	The computer did exactly what it was told
	•	The instructions were incomplete
	•	The logic did not cover a case

The computer is never “wrong.”

The model in the human’s head was wrong.

⸻

Good Programs Assume Things Will Go Wrong

Strong programs:
	•	Check inputs
	•	Guard against missing data
	•	Handle bad timing
	•	Fail loudly when assumptions break

Weak programs assume:
	•	Everything will be perfect
	•	Inputs will behave
	•	State will always be correct

That assumption always fails eventually.

⸻

Errors Are Information

Errors tell you:
	•	Where your model was incomplete
	•	What you forgot to consider
	•	How reality differs from expectation

Learning to read errors calmly is a professional skill.

⸻

Driving Reflection

Think about any system you’ve debugged in real life.

The failure was rarely random.
It was something you didn’t account for.

Programming failures are the same.

⸻

Lock-In Thought

You should be able to say:

“Errors happen when reality violates an assumption in the program.”

⸻

Phase 0 · Lesson 0.8

Time: Programs Exist Over Change

Programs are not static objects.

They live:
	•	Over time
	•	While state changes
	•	While inputs arrive
	•	While outputs are produced

Even the shortest program has a timeline.

⸻

Time Is Implicit

Most programs do not say “time” explicitly.

But time is always present:
	•	Instructions happen in order
	•	State changes between steps
	•	Inputs arrive later
	•	Conditions evaluate at different moments

Ignoring time is how subtle bugs appear.

⸻

Timing Is Everything in Real Systems

Timing matters most when:
	•	Reading sensors
	•	Talking to networks
	•	Handling user input
	•	Running embedded systems

Two correct instructions in the wrong order
can be a broken system.

⸻

Driving Reflection

Think about:
	•	Monitoring battery voltage
	•	Waiting for a response
	•	Polling a sensor

That’s time-aware programming.

⸻

Lock-In Thought

You should be able to say:

“Programs operate over time, and state changes between steps matter.”

⸻

Phase 0 · Consolidation (Lessons 0.1–0.8, Expanded)

Here is the full mental model, stated cleanly.

A program:
	•	Operates on data
	•	Stored in variables
	•	Representing state

It:
	•	Executes instructions in sequence
	•	Uses conditions to choose paths
	•	Uses loops to repeat work
	•	Groups behavior into functions

Over time:
	•	Inputs arrive
	•	State changes
	•	Outputs are produced
	•	Errors occur when assumptions break

Languages do not change this.
Frameworks do not replace this.
This is programming.

⸻

Final One-Sentence Anchor

Say this until it feels boring:

A program is a sequence of instructions that transforms data and state over time using conditions, loops, and functions.

If that sentence feels obvious, Phase 0 worked.

