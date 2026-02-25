# Section B Phase 4 · Chapter 4.02: Running Node and the REPL

Chapter 4.01 explained what Node.js is: a JavaScript runtime built on V8 and libuv that runs your JavaScript outside the browser. This chapter focuses on how to actually use Node on your machine: how to run a script file, how to use the Node REPL for quick experiments, and how to think about exit codes and environment variables like NODE_ENV. You will go from “Node is installed” to “I can reliably run Node programs, see what they are doing, and read the signals they give back to the shell.”

Later in Phase 4 you will work with Node’s built-in modules (path, fs, http) and npm packages. Those chapters assume you are comfortable starting Node, pointing it at a file, and dropping into the REPL when you want to test or inspect something. This chapter is about those basic but critical habits.

## Learning Objectives

By the end of this chapter, you should be able to:

- Run a JavaScript file with `node` from the terminal, using correct paths relative to the current working directory.
- Use the Node REPL (Read–Eval–Print Loop) for quick experiments and debugging, including exiting cleanly and loading files into the REPL.
- Explain how exit codes work (0 = success, non‑zero = failure), and use `process.exit()` or `process.exitCode` appropriately in CLI scripts.
- Set and read environment variables (especially `NODE_ENV`) when starting Node, and branch behavior in code based on those values.
- Recognize and fix common “Running Node” problems: wrong working directory, wrong Node version, missing files, and OS differences in environment-variable syntax.

## Key Terms

- **REPL**: Read–Eval–Print Loop. An interactive prompt where Node reads what you type, evaluates it as JavaScript, prints the result, and loops.
- **Script file**: A `.js` (or `.mjs`) file that Node runs when you call `node path/to/file.js` from the shell.
- **Exit code**: A small integer that a process returns to the operating system when it finishes. `0` usually means success; non‑zero values mean some kind of failure.
- **Environment variable**: A key–value pair provided by the operating system to a process (for example, `NODE_ENV`, `PATH`, `API_KEY`). In Node you read them via `process.env`.
- **NODE_ENV**: A conventional environment variable that indicates whether your app is running in `"development"`, `"production"`, or another environment string.

---

## 1) Checking That Node Is Installed

Before you can run Node scripts, you need the `node` command to be available in your shell. Open a terminal (macOS: Terminal or iTerm; Linux: your terminal of choice; Windows: PowerShell or Command Prompt) and type:

```bash
node --version
```

If Node is installed and on your `PATH`, you should see something like:

```bash
v22.3.1
```

The exact version number will differ, but the important part is that you see a `v` followed by a version. If you instead see an error like:

```bash
command not found: node
```

or:

```bash
‘node’ is not recognized as an internal or external command
```

then Node is either not installed or not on your `PATH`. Fix that before continuing: install Node from the official installer or via a version manager. The curriculum assumes a reasonably current LTS or later Node version so that ES modules, `async/await`, and `globalThis` work as expected.

Once `node --version` works, you are ready to run scripts.

---

## 2) Running a Script with `node script.js`

The most basic way to use Node is to point it at a file:

```bash
node script.js
```

Node will:

1. Start the Node process.
2. Load and execute `script.js`.
3. Keep running as long as your script keeps work scheduled (e.g. timers, servers, pending I/O).
4. Exit when there is nothing left to do (or when you explicitly call `process.exit()`).

### 2.1 Current Working Directory and Paths

When you run `node script.js`, Node looks for `script.js` in your **current working directory**—the directory you are “in” in the terminal. You can see your current directory with:

```bash
pwd
```

on macOS/Linux, or:

```bash
cd
```

on Windows PowerShell (with no arguments) to print the current directory.

If you are in:

```bash
/Users/air/Documents/Learn to Code
```

and you run:

```bash
node Section_B/Phase_4/examples/hello.js
```

Node will look for the file at:

```bash
/Users/air/Documents/Learn to Code/Section_B/Phase_4/examples/hello.js
```

The path you pass to `node` is always interpreted relative to the current working directory unless you use an absolute path (starting with `/` on macOS/Linux or a drive letter like `C:\` on Windows).

**Common mistake:** Being in the wrong directory. If you see:

```bash
Error: Cannot find module '/path/to/script.js'
```

check both:

- That you typed the path correctly.
- That you are in the directory you think you are (use `pwd` or look at your shell prompt).

You can always change directories with `cd` before running Node.

### 2.2 Creating and Running a Simple Script

Create a file `hello-node.js` in your project with this content:

```javascript
console.log("Hello from Node!");
console.log("Running in", process.cwd());
```

From the directory that contains `hello-node.js`, run:

```bash
node hello-node.js
```

You should see something like:

```text
Hello from Node!
Running in /Users/air/Documents/Learn to Code
```

The first line comes from `console.log`. The second line shows the current working directory that Node sees via `process.cwd()`. This is often how you debug “where am I?” when paths are not doing what you expect.

### 2.3 Using Relative and Absolute Paths

You can pass any file path to `node`:

- `node ./hello-node.js` (explicitly in the current directory).
- `node ../some-other-folder/task.js` (a file in the parent directory).
- `node /absolute/path/to/script.js` (absolute path).

The script itself might also read files from disk. Inside Node you will often build absolute paths using `process.cwd()` and the `path` module (covered in Chapter 4.03). For now, the important idea is: the path you pass to `node` is separate from the directory where Node thinks it is running (`process.cwd()`)—but by default they are the same when you run `node` in the directory that contains your script.

---

## 3) One‑Liners with `node -e`

Sometimes you do not want to create a file; you just want to run a quick expression or a few lines of JavaScript and exit. Node provides the `-e` flag (“evaluate”) for that:

```bash
node -e "console.log(2 + 3)"
```

Node will run the code inside the quotes and exit:

```text
5
```

This is handy for:

- Quick math or string operations.
- Poking at `process.env` or `process.argv`.
- Testing small code fragments before placing them in a file.

You can write multiple statements by separating them with semicolons:

```bash
node -e "console.log('Node version:', process.version); console.log('CWD:', process.cwd())"
```

Be careful with quotes: on most shells, the outer quotes should be single quotes if your JavaScript uses double quotes, or vice versa. On Windows (especially PowerShell), quoting rules differ slightly, so if a command fails to parse, try swapping the quote types:

- macOS/Linux: `node -e "console.log('hi')"`
- Windows PowerShell: `node -e "console.log('hi')"`, but you might occasionally need `'` outside and `"` inside depending on the content.

For longer experiments, the REPL is usually more comfortable than `-e`, because you can make many attempts without retyping the entire command. That is the next topic.

---

## 4) The Node REPL

REPL stands for **Read–Eval–Print Loop**:

1. **Read**: Node reads what you type.
2. **Eval**: Node evaluates it as JavaScript.
3. **Print**: Node prints the result or any errors.
4. **Loop**: Node prompts you again.

You start the REPL by running `node` with **no arguments**:

```bash
node
```

You should see a prompt like:

```text
Welcome to Node.js v22.x.x.
Type ".help" for more information.
>
```

The `>` prompt means Node is ready for input. Type a simple expression:

```text
> 2 + 3
5
>
```

Node reads `2 + 3`, evaluates it, prints `5`, and then shows `>` again.

### 4.1 Using the Last Result (`_`)

The Node REPL stores the result of the last expression in a special variable `_` (underscore):

```text
> 10 * 3
30
> _ + 5
35
```

This is handy when you are exploring: you can perform a calculation and then build on the previous result without storing it in a variable.

### 4.2 Multi‑Line Input

If you start typing something that is not complete (for example, a `function` or an `if` block), the REPL will change the prompt to `...` and wait for more:

```text
> function add(a, b) {
...   return a + b;
... }
undefined
> add(2, 3)
5
```

The `undefined` after the function definition is simply the result of evaluating the statement; the function is now defined and can be called.

If you get stuck in a multi-line block you do not want to finish, press `Ctrl+C` once to cancel the current line. If you press `Ctrl+C` again at a fresh prompt, Node will ask if you want to exit the REPL.

### 4.3 Exiting the REPL

You can exit the REPL in a few ways:

- Type `.exit` and press Enter.
- On macOS/Linux, press `Ctrl+D` on a blank line.
- Press `Ctrl+C` twice from a fresh prompt (Node will confirm).

After exiting, you are back at your normal shell prompt.

### 4.4 REPL Commands (`.help`, `.load`, `.save`)

The Node REPL supports a few special “dot commands”:

- `.help` — lists help for all REPL commands.
- `.exit` — exits the REPL.
- `.load path/to/file.js` — loads a file and executes it in the REPL context.
- `.save path/to/file.js` — saves your current REPL session to a file.

For example, if you want to experiment with a script and then keep tweaking in the REPL:

1. Create `math-tools.js`:

   ```javascript
   function square(n) {
     return n * n;
   }

   function average(a, b) {
     return (a + b) / 2;
   }
   ```

2. Start the REPL:

   ```bash
   node
   ```

3. Load the file:

   ```text
   > .load math-tools.js
   function square(n) {
     return n * n;
   }

   function average(a, b) {
     return (a + b) / 2;
   }
   undefined
   > square(5)
   25
   > average(10, 20)
   15
   ```

Now you can call `square` and `average` interactively. You can also overwrite them or define new helper functions on the fly.

If you use `.save`, Node will write every command you typed (and their results) into a file—useful when you want to keep a record of an exploratory debug session.

---

## 5) Exit Codes and `process.exit`

Every program that runs from the command line finishes with an **exit code**. The exit code is an integer that the operating system (and other programs) can read to decide whether the program succeeded.

The conventions are:

- `0` means success.
- Non‑zero values (1, 2, 3, …) mean failure. Different tools sometimes use different numbers for different kinds of failures, but they all count as “something went wrong.”

### 5.1 Implicit Exit Codes

If your Node script runs to the end without throwing an uncaught exception and without calling `process.exit`, Node exits with code 0 (success).

If your script throws an exception that is not caught, or a promise rejects without a handler, Node will usually exit with a non‑zero code. You can see the exit code by echoing `$?` on macOS/Linux (or `$LASTEXITCODE` on PowerShell) after running a command:

```bash
node hello-node.js
echo $?
```

If everything went well, you should see:

```text
0
```

If there was an uncaught error, you might see:

```text
1
```

### 5.2 Using `process.exit(code)`

You can explicitly control the exit code using `process.exit(code)`:

```javascript
// check-config.js
if (!process.env.API_KEY) {
  console.error("Missing required API_KEY environment variable.");
  process.exit(1); // non-zero: failure
}

console.log("Config looks good.");
process.exit(0); // zero: success
```

If you run:

```bash
node check-config.js
echo $?
```

you will see `1` when `API_KEY` is missing, and `0` when it is set.

This pattern is common for **CLI tools** and **scripts in automation**. Shell scripts, CI pipelines, and process managers rely on exit codes to decide whether to continue, retry, or alert you.

### 5.3 `process.exitCode` vs `process.exit`

Sometimes you want to mark a failure but still let Node finish current work before exiting. In that case, you can set:

```javascript
process.exitCode = 1;
```

and then let your program run to completion. Node will exit with code 1 once there is nothing left on the event loop. This is safer than calling `process.exit(1)` in the middle of work, because `process.exit` terminates immediately—skipping any remaining callbacks or I/O.

As a guideline:

- Use `process.exitCode = 1` in scripts that might still need to finish clean-up work.
- Use `process.exit(0 or 1)` only in small scripts where you are sure there is nothing left to do, or where immediate termination is the goal.

---

## 6) Environment Variables and `NODE_ENV`

An **environment variable** is a key–value pair that your shell passes into a process when it starts. In Node, you read them via `process.env`. They are strings:

```javascript
const mode = process.env.NODE_ENV;
console.log("NODE_ENV is:", mode);
```

### 6.1 Reading Environment Variables

`process.env` behaves like a plain object whose values are always strings (or `undefined` if the key is missing):

```javascript
console.log(process.env.PATH); // big string, usually
console.log(process.env.NODE_ENV); // "development", "production", or undefined
```

When you read an environment variable that might not exist, always handle the missing case:

```javascript
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is required but was not set.");
  process.exit(1);
}
```

This follows the Phase 3 habit of validating at the boundary: you check once, early, and fail fast with a clear message.

### 6.2 Setting Environment Variables When Running Node

You do not set environment variables from inside Node (not for configuration). You set them **before** starting Node, in the shell. The syntax differs slightly by operating system and shell.

On macOS/Linux (bash, zsh):

```bash
export NODE_ENV=production
node app.js
```

Or in a one-liner:

```bash
NODE_ENV=production node app.js
```

On Windows PowerShell:

```powershell
$env:NODE_ENV="production"
node app.js
```

On Windows Command Prompt (cmd.exe):

```cmd
set NODE_ENV=production
node app.js
```

In all cases, once the variable is set in the shell, `process.env.NODE_ENV` will be `"production"` inside `app.js`.

### 6.3 Using `NODE_ENV` in Code

`NODE_ENV` is a convention: many frameworks and libraries read it to switch between development and production behavior. You can also use it yourself:

```javascript
const env = process.env.NODE_ENV || "development";

if (env === "development") {
  console.log("Running in development mode: extra logging is enabled.");
} else if (env === "production") {
  console.log("Running in production mode: logging is minimal.");
} else {
  console.log("Running in environment:", env);
}
```

In this pattern:

- If `NODE_ENV` is missing, you default to `"development"`.
- In `development`, you might log more, use slower but clearer checks, or show detailed error messages.
- In `production`, you keep logs smaller, avoid expensive checks, and hide sensitive error details.

Later, when you use frameworks like Express or build tools, you will see that many of them follow the same pattern: “development vs production” determined by `NODE_ENV`.

### 6.4 Homestead Example: `NODE_ENV` on a Server

Imagine a small Node script that controls whether your homestead alarm system sends **real** alerts or just logs messages for testing:

```javascript
// alarm-runner.js
const env = process.env.NODE_ENV || "development";

function sendAlert(message) {
  if (env === "production") {
    // in production, send a real SMS/email/notification
    console.log("[REAL ALERT]", message);
  } else {
    // in development, just log for testing
    console.log("[TEST ALERT]", message);
  }
}

sendAlert("Coop door failed to close on time.");
```

- On your laptop, you might run:

  ```bash
  NODE_ENV=development node alarm-runner.js
  ```

  to test behavior.

- On the server or Pi, you would set:

  ```bash
  NODE_ENV=production node alarm-runner.js
  ```

Now a single script behaves differently based on where and how it is run, with no code changes—only an environment variable.

---

## 7) Shebangs and Executable Scripts (Unix‑like Systems)

On Unix‑like systems (macOS, Linux), you often want a Node file to behave like a normal command, without typing `node` explicitly. You can do this using a **shebang** line and the file’s executable bit.

Create a file `say-hello` (no `.js` extension required) with:

```javascript
#!/usr/bin/env node

console.log("Hello from a shebang script!");
console.log("Args:", process.argv.slice(2));
```

The first line tells the operating system: “Use whatever `node` you find on the `PATH` to run this file.”

Make the file executable:

```bash
chmod +x say-hello
```

Now you can run it directly:

```bash
./say-hello one two three
```

Node will run the script; inside, `process.argv.slice(2)` will be `["one", "two", "three"]`.

To make this available as a “global” command, you would typically put it into a directory on your `PATH` or install it via npm as a CLI tool. The important concept here is: the shebang plus execute permissions allow you to use Node scripts like regular shell commands.

On Windows, shebang handling works differently; small CLI tools are often run via `node script.js` or installed via npm and executed with `npx` or a generated `.cmd` shim. The underlying Node code is the same.

---

## 8) Common Problems When Running Node

Running Node is simple in principle (`node file.js`), but a few recurring issues can waste time if you do not recognize them.

### 8.1 “Command Not Found” or “Not Recognized”

If you see:

```text
command not found: node
```

or:

```text
‘node’ is not recognized as an internal or external command
```

then:

- Node is not installed, or
- Node is installed but not on your `PATH`.

Check:

- `node --version` (does it work anywhere?).
- If not, reinstall Node or adjust your environment so that the `node` binary is on the `PATH`.

### 8.2 “Cannot Find Module” or Wrong File Path

When running a script:

```bash
node scripts/process-data.js
```

if you see:

```text
Error: Cannot find module '/path/to/scripts/process-data.js'
```

it usually means:

- You mis‑typed the path.
- The file does not exist.
- You are in the wrong directory when running `node`.

Always check:

- `pwd` to confirm where you are.
- `ls scripts` (or directory listing) to ensure the file is there.

### 8.3 OS Differences for Environment Variables

The single most common cross‑platform issue is setting `NODE_ENV`:

- macOS/Linux: `NODE_ENV=production node app.js`
- PowerShell: `$env:NODE_ENV="production"; node app.js`
- cmd.exe: `set NODE_ENV=production` then `node app.js`

If an example from a tutorial does not work on your OS, suspect environment‑variable syntax first.

### 8.4 Node Version Mismatch

If you run:

```bash
node --version
```

and see something very old (for example, `v8.x` or `v10.x`), some modern features will be missing (ES modules, some standard APIs). The curriculum assumes a current LTS or later; upgrade to match.

If you use a version manager (like `nvm`), make sure the right version is active in your shell.

---

## 9) Checklist: Running Node with Confidence

Before you move on, you should be able to say “yes” to each of these statements:

1. **I can confirm Node is installed** by running `node --version` and seeing a version string.
2. **I know how to run a script file** with `node path/to/file.js`, and I understand that the path is resolved relative to my current working directory.
3. **I can use the Node REPL**: start it with `node`, evaluate expressions, use `_` for the last result, and exit cleanly using `.exit` or `Ctrl+D`.
4. **I know about REPL dot commands**: `.help`, `.load`, and `.save`, and I can load a file into the REPL for interactive testing.
5. **I understand exit codes**: Node exits with 0 on success, non‑zero on failure, and I can explicitly use `process.exit()` or `process.exitCode` when writing CLI scripts.
6. **I can read environment variables via `process.env`** and I know they always come in as strings (or `undefined`).
7. **I can set `NODE_ENV` when starting Node** on my operating system, and use its value in code to branch behavior for development vs production.
8. **I recognize common errors when running Node** (command not found, cannot find module, wrong environment‑variable syntax) and I know how to debug them.

If you are not comfortable with one of these items, take a moment in your terminal to practice until it feels routine. These skills are the foundation for the rest of Phase 4.

---

## Common Pitfalls

- **Forgetting the current working directory**: Running `node script.js` from the wrong directory and then wondering why the file cannot be found. Always check `pwd` if a file path seems wrong.
- **Typing `node` in the wrong terminal**: For example, opening a new terminal that does not have Node on the `PATH` and then being confused by “command not found.” Make sure the shell you are using has access to Node.
- **Using browser APIs in Node**: Trying to run code that uses `document`, `window`, or the DOM directly in Node. Node has no DOM; that code belongs to the browser.
- **Assuming `NODE_ENV` is set**: Relying on `process.env.NODE_ENV` without handling the case where it is `undefined`. Always provide a default (`"development"`) or fail fast with a clear error.
- **Calling `process.exit()` prematurely**: Exiting in the middle of a script while asynchronous work is still scheduled. Prefer `process.exitCode` unless you are sure you want immediate termination.
- **Forgetting to quote `node -e` code correctly**: Mixing up single and double quotes so that the shell eats part of your JavaScript. When a `node -e` command fails, simplify and adjust the quoting.

---

## Summary

Node is more than an engine; it is a tool you run from the command line. In this chapter you learned how to confirm that Node is installed, how to run a script file with `node path/to/file.js`, and how Node uses the current working directory when resolving that path. You practiced using the Node REPL to experiment and to load existing files for interactive testing, and you saw how exit codes (0 for success, non‑zero for failure) communicate results back to the shell or to automation.

You also learned how to read environment variables through `process.env`, how to set common variables like `NODE_ENV` on different operating systems, and how to branch behavior in your code based on those values. Finally, you saw how shebang lines and executable bits let Node scripts behave like normal commands on Unix‑like systems, and you walked through the most frequent “running Node” errors and how to debug them. With these skills, you can reliably start and inspect Node programs, which is the foundation for the rest of the Node material in this phase.

---

## Practice: Try These Commands

To lock in this chapter, open a terminal in your project directory and:

1. Run `node --version` and write the version down somewhere in your notes so you can recognize when it changes in the future.
2. Create a small `env-demo.js` that prints `process.cwd()`, `process.argv`, and `process.env.NODE_ENV`, then run it several times with and without `NODE_ENV` set.
3. Start the REPL with `node`, type a few expressions, define a small helper function, and then exit using `.exit` and `Ctrl+D` to feel both exit paths.
4. Intentionally cause an error in a script (for example, `JSON.parse("oops")`), run `node script.js`, and then inspect the exit code in your shell to see that it is non‑zero.
5. (Unix‑like systems) Add a shebang line to a tiny Node script, make it executable with `chmod +x`, and run it directly with `./script-name` so you experience how Node can act like any other command.

Do not rush these; type each command and notice what happens. Repetition at this stage pays off when you later run more complex servers and tools.

---

## Next

Next: **Chapter 4.03: Built‑in Modules: `path` and `fs`**. That chapter introduces Node’s core modules for working with file paths and the file system. You will use them to read and write files, resolve absolute and relative paths safely, and begin building practical homestead scripts that interact with real data on disk.
