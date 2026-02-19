# Section A Phase 2 · Chapter 2.01: What a Python Program Is

Chapter 1.1 showed that programs are execution systems, instructions that run in order, operating on data, producing outputs. This chapter is Chapter 1.1 expressed in Python syntax. Python is an interpreter, not a compiler. This distinction matters: Python reads your code and executes it immediately, line by line, in a runtime world where state exists and changes. This chapter is about understanding what a Python program actually is while it is running, what exists, what changes, and what disappears when execution ends.

## Learning Objectives

After this chapter, you will be able to:
- Understand Python as an interpreter that executes code immediately
- Recognize the difference between code files and running programs
- Understand execution order and why it matters
- Distinguish static code from dynamic execution
- Understand scripts versus systems
- Recognize the runtime world and how state lives in memory
- Understand definition time versus execution time
- Use the `if __name__ == "__main__":` pattern

## Key Terms

- **Interpreter**: A program that reads code and executes it immediately, line by line
- **Runtime World**: The world that exists while Python is executing, containing variables, functions, and state
- **Definition Time**: When Python encounters and processes definitions (functions, classes, variables)
- **Execution Time**: When Python actually runs the code inside functions or executes statements
- **Script**: A program that runs once, performs a task, and exits
- **System**: A program that runs continuously, reacts to inputs, maintains state, and adapts over time

## 1) Python as an Interpreter

Python is an interpreter. That single fact explains almost everything about how Python behaves. An interpreter reads instructions and executes them immediately. There is no separate compilation phase where the program is transformed into something else first. You write Python code, and Python executes that code directly. The code is the program.

This means several important things: Python reads your code at runtime, Python executes instructions as it encounters them, errors appear when Python tries to execute something invalid, the program exists only while Python is running, and state lives in memory, not in the file itself. When Python stops running, the program stops existing. There is no lingering program sitting on disk. There is only text.

Homestead examples: a Python program that monitors battery voltage runs continuously. So does one that checks electric poultry net voltage every minute, or reads coop temperature from an ESP32. Python reads the code, executes it, maintains state in memory. When Python stops, the program stops, unless state is persisted to files. The dot py file is static text. The program is alive execution.

## 2) Interpreter vs Compiler

In compiled languages, code is translated into another form before execution. That creates a separation between source code, compiled output, and runtime behavior. Python removes that separation. When you run a Python file, Python reads the text, Python executes the text, Python maintains state while executing, and Python forgets everything when execution ends. This tight loop between code and execution is why Python is such a good learning language. What you write is what runs. There is no hidden transformation step.

Homestead example: think of Python like a person following written instructions in real time, check the poultry net, then the coop temp, then the solar production. The instruction sheet exists on paper. The work exists only while the person is following the instructions. If the person stops, the work stops. The paper does not contain the work. It only describes it.

## 3) Execution Order Is Law

Python executes code from top to bottom. Line one executes first. Then line two. Then line three. This is not a preference. It is not configurable. It is how Python works. Execution order is absolute. If you reference a variable before it exists, Python fails. If you call a function before it is defined, Python fails. If you depend on state that hasn't been created yet, Python fails. Python does not look ahead. Python does not figure it out. Python does not guess intent. It executes instructions in the order you give them. This is Chapter 1.1's instructions run in sequence expressed concretely.

Homestead examples: you must measure battery voltage before comparing it to a threshold. You must read coop temperature before deciding to turn on the fan. You must check poultry net voltage before alerting that the fence is down. You must define start_generator before calling it, or check_fence before using it. Order is not negotiable in real systems. Python reflects that reality.

## 4) Why Order Matters More Than Beginners Expect

Many people coming from spreadsheets, visual tools, or declarative systems expect Python to understand relationships rather than order. Python does not. Python does exactly what you tell it, in the order you tell it, with the state that exists at that moment. That's not a limitation. That's clarity.

Homestead examples: a spreadsheet might let you define voltage_low equals voltage less than twelve point one or coop_hot equals coop_temp greater than eighty-five and expect it to update when values change. Python does not. Python executes each assignment once, at that moment, with whatever value exists then. Order, not relationships. Chapter 1.1: instructions run in sequence.

## 5) Code That Runs vs Code That Exists

This distinction matters early. A Python file is a text file. A Python program is execution. The file exists whether or not Python is running. The program exists only while Python is executing the file. This leads to a critical mental model: the file is static. The program is alive. The file does not change by itself. The program constantly changes while it runs.

Homestead examples: battery_monitor dot py is a file, static text. So is coop_controller dot py or poultry_net_monitor dot py. When Python runs it, that's the program, alive execution. The file exists on disk. The program exists in memory. When Python stops, the program disappears. The file remains.

## 6) Static vs Dynamic

Static includes the text in your dot py file, the order of instructions, and the names you define. Dynamic includes variable values, state transitions, timing, and input from the outside world. Beginners often confuse these. Professionals do not.

Homestead examples: the file contains voltage equals read_sensor or coop_temp equals read_dht22, static text. When Python runs it, voltage might be twelve point one, then twelve point zero, then eleven point nine. coop_temp might be seventy-five, then seventy-eight, then seventy-two. The code is static. The execution is dynamic.

## 7) Scripts vs Systems

A script runs once, performs a task, and exits. A system runs continuously, reacts to inputs, maintains state, and adapts over time. Python supports both equally well. Most tutorials focus on scripts because they're easier to demonstrate. Most real programs are systems. Phase 2 focuses on systems.

Homestead examples: a script that converts CSV to JSON runs once and exits. A battery monitor that reads voltage every five seconds and decides whether to start the generator, that's a system. So is a coop controller that checks temperature every minute and runs the fan when hot. An ESP32 in the pig barn that reads humidity and publishes to MQTT, that's a system too. Scripts are the exception. Systems are the norm.

## 8) Why This Distinction Matters Early

Systems introduce long-lived state, timing, repetition, failure handling, and recovery. If you only think in scripts, systems will feel confusing later. If you understand systems now, nothing later will feel magical.

Homestead examples: a script processes one file and exits. A system monitors continuously, whether it's battery voltage, poultry net status, or solar production. A system handles sensor timeouts, ESP32 loses Wi‑Fi, recovers from network failures, coop controller reconnects to MQTT, and adapts to changing conditions, pig barn fan runs when humidity rises. Systems require different thinking, state management, timing, error handling. Chapter 1.7: time matters. Chapter 1.10: failure is normal.

## 9) The Runtime World

When Python executes your program, it creates a runtime world. This world contains variables and their current values, defined functions, imported modules, control flow position, and temporary execution contexts. This runtime world exists only while the program runs. When execution stops, the world disappears. Understanding this runtime world is understanding Python.

Homestead examples: when Python runs your battery monitor, it creates a runtime world with voltage equals twelve point one, generator_state equals off, functions like read_voltage and start_generator. When it runs your coop controller, that world has coop_temp equals seventy-five, fan_on equals False, read_temp and start_fan. An ESP32 running MicroPython has its own runtime world, fence_voltage equals four point two, is_energized equals True. Each world exists only while Python or MicroPython runs. When it stops, the world disappears, unless you've saved state to files.

## 10) State Lives in Memory

When you assign a variable, Python stores a value in memory and associates it with a name. That association exists only in the runtime world. When Python exits, memory is cleared, names disappear, and state is gone. Unless you explicitly write state to disk.

Homestead examples: voltage equals twelve point one or coop_temp equals seventy-five or fence_voltage equals four point two creates an association in memory. When Python stops, that association is gone. If you want voltage, temperature, or fence status to survive restarts, so your Home Assistant dashboard doesn't go blank on reboot, you must write it to a file or database. Memory is temporary. Files are permanent. Chapter 1.13: persistence makes state survive restarts.

## 11) Time Passes in the Runtime World

Python does not execute instantaneously. Time passes between instructions, input may arrive later, sensors may change, and external systems may change. Your program exists in time, not outside it. This matters for systems.

Homestead examples: voltage reading arrives, stored in a variable. Five seconds pass. New reading arrives, variable value changes. Or: coop temp reading arrives. One minute passes. New reading arrives. Or: ESP32 reads poultry net voltage, publishes to MQTT, waits sixty seconds, reads again. The program reacts to the changing world by updating state. Time passes. State changes. The program adapts. Chapter 1.7: time is always present.

## 12) Python Files and Execution

A Python file is a container for instructions. It does not execute itself. To create a program, you tell Python to execute the file. Python reads the file, parses the instructions, and executes them in order. The file itself does nothing. The dot py extension tells Python this is Python code. The name of the file is for humans. battery_monitor dot py, coop_controller dot py, poultry_net_monitor dot py, all meaningful because you know what they represent. Python does not care.

Homestead examples: battery_monitor dot py or coop_controller dot py sits on disk, static text. You run python battery_monitor dot py and Python reads it, parses it, executes it. On an ESP32, you run MicroPython and it reads main dot py from the device. The file is the recipe. Python or MicroPython is the chef. The program is the meal being prepared, alive only while it's running.

## 13) Definition Time vs Execution Time

This is one of the most important concepts in Python. When Python encounters a function definition, a class definition, or a variable assignment, it executes that instruction immediately. But some instructions define behavior rather than perform behavior. Defining a function does not run it. It stores instructions for later.

Homestead examples: def read_voltage colon return twelve point one or def read_coop_temp colon return seventy-five or def check_fence colon return four point two defines a function. Python creates the function object and associates it with the name. Nothing else happens. Only when you call it does the function body execute. Definition is separate from execution. What happens if you call read_voltage or check_fence before defining it? Python fails, the function doesn't exist yet. Order matters. Define first, call later. Chapter 1.1: instructions run in sequence.

## 14) The `if __name__ == "__main__":` Pattern

This pattern exists because files can be used in two ways: executed directly and imported by other files. When a file is executed directly, Python sets a special variable called __name__ to __main__. When a file is imported, __name__ is set to the module's name instead. This allows you to write code that runs only when executed directly and does not run when imported. Without this pattern, importing a file would trigger execution, side effects would happen unexpectedly, and large programs would become chaotic. This pattern creates a clean boundary.

Homestead examples: if __name__ equals equals __main__ colon main runs main only when the file is executed directly. Your battery monitor, coop controller, or poultry net script, each can have a main that runs only when that file is the entry point. When imported by another module, for example, a test file, main doesn't run. Think of __main__ as start the system here. Everything else defines tools and behavior.

## 15) Interactive Mode vs Files

Python can run interactively. You type a line. Python executes it immediately. You see the result. This is useful for experimentation, quick checks, and learning syntax. But interactive mode is not how systems are built. Files are programs. Interactive mode is a scratchpad. Professionals use both intentionally.

Homestead examples: interactive mode lets you test read_voltage or read_coop_temp quickly. You can poke at an ESP32 over serial and run snippets. But your battery monitor, coop controller, or poultry net monitor lives in a file. Interactive mode is for exploration. Files are for systems.

## 16) Errors Happen at Execution Time

Because Python is interpreted, errors appear when Python reaches invalid instructions. There are two broad categories: syntax errors, Python cannot understand the instruction, and runtime errors, Python understood the instruction, but execution failed. This distinction becomes critical later. Python errors are not punishment. They are Python reporting facts about reality: this instruction doesn't exist, this state is invalid, and this assumption failed. Errors are part of execution, not exceptions to it.

Homestead examples: voltage equals read_sensor might raise a runtime error if the sensor times out. coop_temp equals read_dht22 fails if the DHT22 is disconnected. An ESP32 calling wifi dot connect fails if the router is down. Python understood the instruction, but execution failed. That's a runtime error. A syntax error, a typo like voltatge instead of voltage, happens before execution even starts: Python can't parse the file. A runtime error, sensor timeout, Wi‑Fi down, happens during execution. Different errors, different moments. Chapter 1.12: errors and exceptions show how to handle these gracefully.

## 17) Programs as Living Systems

At this point, you should start thinking of Python programs as living systems. They start, initialize state, react to inputs, change state, produce outputs, repeat, and eventually stop. This is not metaphorical. This is literal. Every automation system, monitoring tool, and embedded controller follows this pattern. Loops keep systems alive. A program that runs forever is simply a program with a loop that does not exit. A program that waits is a program that loops while checking conditions. A program that reacts is a program that loops and branches. Nothing mystical is happening.

Homestead examples: a battery monitor starts, initializes state, voltage equals None, generator_state equals off, enters a loop, reads voltage, compares to threshold, starts generator if needed, waits five seconds, repeats. A coop controller starts, initializes, coop_temp equals None, fan_on equals False, enters a loop, reads temp from an ESP32 or local DHT22, turns fan on if hot, waits one minute, repeats. An ESP32 in the chicken run starts, connects to Wi‑Fi, enters a loop, reads poultry net voltage, publishes to MQTT, waits sixty seconds, repeats. A solar logger on the barn roof reads production, writes to a file, waits five minutes, repeats. A cow barn controller reads humidity and temp from an ESP32, decides whether to run the ventilation fan. Each is a living system. Chapter 1.15: assembling a living Python system shows how all concepts combine. Contrast: a script that converts CSV to JSON starts, reads the file, writes output, exits, dead. A battery monitor, coop controller, or poultry net monitor starts, loops, reacts to inputs, adapts, alive until you stop it. Scripts are one-shot. Systems are continuous.

## Common Pitfalls

Confusing files with programs misses the point. A Python file is static text. A Python program is alive execution. The file exists on disk. The program exists in memory. Don't confuse the static file with the dynamic program.

Ignoring execution order causes errors. Python executes from top to bottom. If you reference a variable before it exists, Python fails. If you call a function before it's defined, Python fails. Order matters. Don't ignore execution order.

Confusing static code with dynamic execution causes confusion. The code in your file is static. The execution is dynamic. Variable values change. State changes. Don't confuse static code with dynamic execution.

Thinking only in scripts misses systems. Most real programs are systems that run continuously, react to inputs, and maintain state. Scripts are the exception. Systems are the norm. Don't think only in scripts.

Forgetting that state lives in memory causes data loss. When Python stops, memory is cleared. State is gone. Unless you write state to files. Don't forget that state is temporary.

Not understanding definition time versus execution time causes confusion. Defining a function does not run it. It stores instructions for later. Only calling it runs it. Don't confuse definition with execution.

## Summary

Python is an interpreter that executes instructions line by line in a runtime world. Programs are not files, they are execution systems that exist only while Python is running. Execution order matters. State lives in memory. Systems run continuously, react to inputs, and change over time. Python reads code and executes it immediately. There is no separate compilation phase. The code is the program. Python executes from top to bottom. Order is absolute. A Python file is static text. A Python program is alive execution. The file exists on disk. The program exists in memory. Scripts run once and exit. Systems run continuously and adapt. The runtime world contains variables, functions, and state. It exists only while Python runs. State lives in memory. When Python stops, state is gone. Time passes in the runtime world. Programs exist in time. Definition time is when Python processes definitions. Execution time is when Python runs code. The if __name__ equals equals __main__ pattern creates boundaries. Errors happen at execution time. Programs are living systems that start, initialize, react, change state, produce outputs, and repeat.

## Next

This chapter showed what a Python program is while it's running. Python is an interpreter that executes code immediately. Programs are execution systems, not static files. Next, Chapter 2.02 shows how Python names and stores state, and how those names shape everything that follows. Understanding what a Python program is makes learning Python syntax feel like translation, not learning.
