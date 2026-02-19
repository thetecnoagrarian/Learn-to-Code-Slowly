# Section A Phase 2 · Chapter 2.02: State and Variables

Chapter 1.5 established that data lives in variables and represents state, what exists, what changes, what influences behavior. This chapter expresses that same idea in Python's execution model and syntax. Nothing conceptually new is introduced here. What changes is precision. Python forces you to be precise about how names, values, and state interact. If you misunderstand this chapter, later bugs will feel mysterious. If you understand it deeply, most bugs become traceable. Chapter 2.01 showed that programs are execution systems. This chapter shows how Python names and stores the state those systems evolve.

## Learning Objectives

After this chapter, you will be able to:
- Understand variables as names that refer to values, not boxes that contain data
- Recognize that values exist independently of names
- Understand how assignment changes references, not values
- Recognize state as names over time
- Understand how programs remember by reassigning names
- Use naming to preserve meaning
- Distinguish variable creation from update
- Understand that variables are temporary by default

## Key Terms

- **Variable**: A name that refers to a value, not a container that holds data
- **Assignment**: Making a name refer to a value
- **Reference**: The relationship between a name and a value
- **State**: The collection of name-value relationships at a specific moment in execution
- **Meaning Drift**: When a name stops referring to what you thought it did

## 1) Variables Are Names, Not Boxes

This idea is simple. It is also one of the most commonly misunderstood concepts in programming. In Python, a variable is not a container that holds data. A variable is a name that refers to a value. When you write voltage equals twelve point one, you are not putting twelve point one into a box called voltage. You are saying the name voltage now refers to the value twelve point one. That distinction matters because names can change what they refer to, and values exist independently of names.

Homestead example: voltage, coop_temp, fence_voltage, each is a name. The value twelve point one exists in memory whether you call it voltage or last_reading. The name is your label, not a box.

## 2) Values Exist Independently of Names

Think of values as objects that exist in memory. Names are labels attached to those objects. You can attach multiple names to the same value, change which value a name refers to, and remove a name without destroying the value if something else still refers to it. This is why Python's model scales so well, and why confusion happens when people imagine boxes instead of references.

Homestead example: voltage equals twelve point one, last_reading equals voltage. Two names, one value. If a function returns twelve point one and you assign it to both current_voltage and display_value, same value, two names. The value exists once. Names point at it.

## 3) Assignment Changes References, Not Values

Assignment in Python means make this name refer to this value. It does not mean modify the value itself, copy the value into a box, or merge two variables. Example: voltage equals twelve point one, last_reading equals voltage. At this moment, voltage refers to twelve point one, last_reading also refers to twelve point one. There is one value, two names. Now: voltage equals twelve point zero. What changed? voltage now refers to twelve point zero, last_reading still refers to twelve point one. Nothing was copied. Nothing was mutated. A name was simply reattached.

Same idea: coop_temp equals seventy-five, last_temp equals coop_temp, then coop_temp equals seventy-eight. last_temp still refers to seventy-five. Or fence_voltage equals four point two, old_fence equals fence_voltage, then fence_voltage equals zero point zero, fence down. old_fence still refers to four point two. One value, two names. Reassignment reattaches a name, it does not mutate the value. This explains a huge number of bugs later, especially with collections and functions, where did I mutate or reassign becomes critical.

## 4) State Is Names Over Time

State is not a special thing. State is simply which names exist, what values they refer to, and at a specific moment in execution. When you say the state changed, what actually happened is one or more names were reassigned. Example: generator_state equals off. Later: generator_state equals running. The program did not flip a state flag. It reassigned a name.

Homestead examples: fan_on equals False then fan_on equals True. fence_energized equals True then fence_energized equals False. solar_producing equals True then solar_producing equals False when the sun sets. Each is a name reassigned over time. The timeline is what creates meaning.

## 5) Programs Remember by Reassigning Names

This is worth stating explicitly: programs remember the past by reassigning names. There is no memory slot that says earlier. There is only what the name refers to now, compared to what it referred to before. If you want to remember the last coop temp, you must have a name for it: last_coop_temp equals coop_temp. When coop_temp changes, last_coop_temp still holds the old value, until you explicitly reassign it. Programs remember only what names refer to. Execution order matters because reassignment happens in order.

Programs remember by reassigning names. There is no magic memory. There are only names and values.

## 6) Variable Creation vs Update Is the Same Operation

Python does not distinguish between creating a variable and updating a variable. This: voltage equals twelve point one means create the name if it doesn't exist, otherwise, update what it refers to. Same for coop_temp equals seventy-five or solar_watts equals twelve hundred or fence_voltage equals four point two. Create or update. This simplicity is powerful, but it means you must track meaning yourself.

If you accidentally reuse a name for a different purpose, Python will not stop you. voltage equals twelve point one, then later voltage equals seventy-eight, you meant coop_temp. The old voltage is gone. Failure mode: sloppy reuse. Python allows it. You must not.

## 7) Naming Is How You Preserve Meaning

Python does not know what voltage means. Or coop_temp. Or fence_voltage. You do. The name is your only chance to encode intent. Compare v equals twelve point one versus last_voltage_reading equals twelve point one. Both are valid Python. Both behave identically. Only one communicates meaning. Same idea: t equals seventy-five versus last_coop_temp equals seventy-five, or x equals four point two versus fence_voltage_kv equals four point two. Python does not enforce good names. Poor naming does not cause syntax errors. It causes reasoning errors, which are worse.

Naming preserves meaning. Bad naming hides bugs.

## 8) Names Should Reflect Role, Not Type

A common beginner mistake is to encode type into names: voltage_float equals twelve point one, string_status equals off, coop_temp_int equals seventy-five. This is fragile. Types can change. Roles should not. Better: voltage equals twelve point one, generator_status equals off, coop_temp equals seventy-five, fence_energized equals True. The role of the variable stays consistent even if the representation changes later.

Roles should not change. Types can change. Names should reflect roles.

## 9) Variables Are Temporary by Default

Variables live in memory. When the program ends, variables disappear and state is lost. This is not a flaw. It's a design decision. Persistence requires explicit action: writing to files, writing to databases, or sending over a network.

Homestead examples: your battery monitor stops. voltage, generator_state, gone. Your ESP32 reboots. fence_voltage, is_energized, gone. Your coop controller exits. coop_temp, fan_on, gone. Unless you wrote that state somewhere, it's lost. Runtime state lives in memory. Persistent state lives on disk or over the network. Chapter 1.13: persistence.

## 10) Memory Is Not the Problem, Meaning Is

Most beginner confusion around memory is actually confusion about meaning drift. The bug is usually not Python lost my data. It's this name stopped referring to what I thought it did. Homestead example: you reuse voltage for solar production watts. Later code assumes voltage is battery voltage. Meaning drift. Or you name a variable temp when it holds humidity. The bug is not memory, it's that the name lied about meaning. If you track names and assignments carefully, memory becomes boring again, and boring is good.

Memory is not the problem. Meaning is.

## 11) Variables Enable Controlled Change

Variables are not just storage. They are control points. Every reassignment is a decision: what changes, when it changes, and what future logic will see. Homestead example: fan_on equals True. That reassignment is a decision. Future logic that checks fan_on will see True and act accordingly. fence_energized equals False, future logic sees False and maybe alerts. generator_state equals running, the next iteration of the loop sees that state and decides. Programs don't do things. They evolve state. Variables are how that evolution is expressed.

Variables enable controlled change. Every reassignment is a decision.

## Common Pitfalls

Thinking of variables as boxes causes confusion. Variables are names that refer to values. Names can change what they refer to. Values exist independently. Don't think of variables as boxes.

Confusing assignment with mutation causes bugs. Assignment changes what a name refers to. It does not mutate the value. Reassignment reattaches a name. Don't confuse assignment with mutation.

Reusing names for different purposes causes meaning drift. Python allows it. You must not. Track meaning yourself. Don't reuse names sloppily.

Encoding type into names is fragile. Types can change. Roles should not. Names should reflect roles, not types. Don't encode type into names.

Forgetting that variables are temporary causes data loss. Variables live in memory. When the program ends, state is lost. Write to files for persistence. Don't forget variables are temporary.

Poor naming causes reasoning errors. Python does not enforce good names. Poor naming does not cause syntax errors. It causes reasoning errors. Use good names.

## Summary

Variables in Python are names that refer to values. Assignment changes what a name points to. State is the collection of these name-value relationships over time. Good names preserve meaning. Bad names hide bugs. Variables are not boxes that contain data. They are names that refer to values. Values exist independently of names. Assignment changes references, not values. State is names over time. Programs remember by reassigning names. Variable creation and update are the same operation. Naming preserves meaning. Names should reflect roles, not types. Variables are temporary by default. Memory is not the problem. Meaning is. Variables enable controlled change. Every reassignment is a decision.

## Next

This chapter showed how Python names and stores state. Variables are names that refer to values. Assignment changes references. State is names over time. Next, Chapter 2.03 explores conditions and branching, where Python starts choosing paths based on the state you now know how to name and track. Understanding variables makes conditions feel obvious rather than mysterious.
