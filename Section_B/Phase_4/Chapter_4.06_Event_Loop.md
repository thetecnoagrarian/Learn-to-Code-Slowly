# Section B Phase 4 · Chapter 4.06: Event Loop and Non-Blocking I/O

Chapters 4.01 and 4.04 described Node as single-threaded and non-blocking: one thread runs your JavaScript, and I/O (files, network) is handed off to the system so the thread is free to run other code while waiting. This chapter makes that model explicit. You will see how the **event loop** schedules work: timers, I/O callbacks, and the order in which your async code runs. You will understand why **blocking** the main thread (long synchronous work or sync I/O in a server) is harmful and how to keep handlers fast. The goal is not to memorize every phase but to form a mental model: “I/O and timers run when the loop gets to them; if I block, nothing else runs until I finish.”

## Learning Objectives

By the end of this chapter, you should be able to:

- Explain that Node runs JavaScript on a **single thread** and that I/O (fs, http, etc.) is **non-blocking**: the thread is not stuck waiting; callbacks run when I/O completes.
- Describe the **event loop** at a high level: timers (setTimeout, setInterval), I/O callbacks (e.g. fs, http), **setImmediate**, and close callbacks; and that **process.nextTick** runs between phases (microtask queue).
- Use **setImmediate(callback)** and **process.nextTick(callback)** when you need to defer work to the next turn of the loop (and know to use them sparingly; prefer normal async/await for I/O).
- Explain why **blocking** the main thread (long loops, sync fs in a request handler) is fatal for a server: no other requests are handled until the block finishes.
- Design request handlers and scripts so that I/O is async and CPU work is short or offloaded (e.g. worker threads) so the event loop stays responsive.

## Key Terms

- **Event loop**: The mechanism that runs the Node process. It repeatedly checks for timers, I/O completion, and other events, and runs the associated JavaScript callbacks (or promise reactions) on the single main thread. When there is nothing left to do, the process can exit.
- **Non-blocking I/O**: File and network operations are started and then control returns to JavaScript; when the operation completes, a callback (or promise) is run. The main thread is not “waiting” during the wait, so it can handle other work.
- **Blocking**: Doing synchronous work that keeps the main thread busy (e.g. a long loop, or **fs.readFileSync**) so that no other callbacks or requests can run until it finishes. In a server, blocking makes the server unresponsive.
- **setImmediate(callback)**: Schedules the callback to run after I/O callbacks in the current loop iteration. Used when you want “run this after the current batch of I/O” without a timer.
- **process.nextTick(callback)**: Schedules the callback to run **before** the next event loop phase—as soon as the current JavaScript finishes. Can delay I/O if overused; use sparingly.

---

## 1) Single Thread and Non-Blocking I/O

Node runs your JavaScript on **one thread**. That thread executes your code, runs timers, and runs the callbacks for completed I/O. There is no second thread running your application code in parallel. So when your HTTP server receives a request, the handler runs on that same thread; when a **setTimeout** fires, its callback runs on that thread; when an **fs.readFile** completes, its callback runs on that thread. Only one of those runs at a time.

I/O (reading a file, waiting for a network response, waiting for a timer) does **not** block that thread. When you call **fs.readFile(path, (err, data) => { ... })**, Node starts the read and returns immediately. The actual read is done by the operating system and libuv. When the read finishes, libuv places a “pending I/O callback” in the queue, and the event loop runs your callback when it reaches the I/O phase. So **while the file is being read**, the thread is free: it can run another request handler, run a timer callback, or do anything else. That is **non-blocking I/O**. The same applies to **http** (incoming requests, outgoing responses), **dns**, and other async APIs. If you use the callback or Promise form (e.g. **fs.promises.readFile**), you are using non-blocking I/O. If you use **fs.readFileSync**, the thread **blocks** until the file is read—no other JavaScript runs during that time. In a server, that means one slow or synchronous read can stall every other request. So: one thread, non-blocking I/O by default when you use the async APIs; blocking only when you use sync APIs or long synchronous computation.

---

## 2) How the Event Loop Schedules Work

The event loop is a loop that repeatedly runs “phases.” In each iteration it might run:

1. **Timers**: Callbacks for **setTimeout** and **setInterval** whose delay has elapsed.
2. **Pending I/O callbacks**: Callbacks for completed I/O (e.g. a completed **fs.readFile**, or an HTTP response that just arrived). This is where most of your async Node callbacks run.
3. **Idle / prepare**: Internal use.
4. **Poll**: Retrieve new I/O events; wait if nothing is ready (so the process can block here waiting for I/O, but that is “waiting for the OS,” not running your JS).
5. **Check (setImmediate)**: Run **setImmediate** callbacks.
6. **Close**: Run callbacks for closed handles (e.g. **socket.on("close")**).

After the close callbacks, the loop checks if there is anything left (timers, pending I/O, etc.); if not, it may exit. So when you run **node script.js** and the script does not start a server or set a timer, the script runs to completion, the loop finds no pending work, and the process exits. When you start **server.listen(3000)**, the server’s listen socket keeps the process alive (there is pending I/O—waiting for connections), so the process does not exit until you close the server or press Ctrl+C. You do not need to memorize every phase. The mental model: **timers and I/O callbacks run in a predictable order each time around the loop; your async code runs when its I/O completes or when its timer fires.** In one sentence per phase: **timers** run delayed setTimeout/setInterval callbacks; **pending I/O** runs callbacks for completed fs, http, and other I/O; **poll** waits for new I/O if nothing is ready; **check** runs setImmediate callbacks; **close** runs callbacks for closed connections. Most of your server code runs in the I/O and check phases when you use async APIs and setImmediate. So when you **fs.readFile** and the file is ready, your callback is run in a future loop iteration in the I/O phase (or the next phase that runs those callbacks, depending on Node’s internals). When you **setTimeout(fn, 0)**, **fn** runs in a future timers phase, not immediately.

**process.nextTick** is different: it is not a phase of the event loop. **nextTick** callbacks are run **after** the current JavaScript execution completes and **before** the next phase. So they run “as soon as possible” but still on the same thread. If you queue many **nextTick** callbacks, they all run before the next I/O or timer; that can delay I/O and “starve” the loop. Use **nextTick** only when you need to defer something to “right after this function returns” (e.g. to allow a listener to be attached before an event fires). For “run after current I/O callbacks,” **setImmediate** is usually the right choice and is less likely to starve I/O.

### 2.1 Promises and the Microtask Queue

Besides the event loop phases, Node (and JavaScript in general) has a **microtask** queue. When a Promise resolves or rejects, its **then/catch/finally** callbacks (and **async/await** continuations) are scheduled as microtasks. Microtasks run **after** the current JavaScript runs to completion and **before** the next event loop phase—similar in timing to **process.nextTick**, and in practice **nextTick** runs before Promises. So when you **await fs.promises.readFile()**, the file read is started, your function pauses, and the event loop can run other code; when the read completes, your async function resumes (as a microtask). That is why **async/await** is still non-blocking: the “wait” is implemented by pausing your function and letting the loop run, not by spinning the CPU. So the mental model extends to Promises: I/O completes → callback or promise reaction is queued → event loop (or microtask run) runs it when it gets a turn.

### 2.2 Why the Order Matters

Because there is only one thread, the **order** in which you schedule work affects responsiveness. If you do a lot of synchronous work (or queue many nextTick callbacks), everything scheduled for “later” (I/O callbacks, timers) is delayed. So “keep synchronous work short” and “prefer setImmediate over nextTick when you just need to defer” are practical rules. In a server, the most important rule is: **never block in a request handler**. The event loop can only run one callback at a time; if that callback never returns, the loop never gets to the next request.

---

## 3) setImmediate vs setTimeout(fn, 0) vs process.nextTick

- **setImmediate(callback)**: Run **callback** after the current I/O callbacks in this loop iteration. Good for “after this batch of I/O” without a timer. In the browser there is no **setImmediate**; Node added it for this purpose.
- **setTimeout(callback, 0)**: Run **callback** in a **future** timers phase. The minimum delay is often clamped (e.g. 1–4 ms), so it runs “soon” but not necessarily in the very next iteration. Use it when you want a short delay or when you are porting browser code that uses **setTimeout(0)**.
- **process.nextTick(callback)**: Run **callback** before the next event loop phase—as soon as the current stack unwinds. Highest priority for “defer to next tick.” Overuse can delay I/O; use for small, quick deferrals (e.g. ensuring a callback runs after the current synchronous code).

In practice, most application code does **not** need **setImmediate** or **nextTick**. You use **async/await** and Promises for I/O; the event loop runs your promise reactions and I/O callbacks in the right order. Reserve **setImmediate** and **nextTick** for edge cases: breaking up a long synchronous run, or ensuring ordering with existing callback-based APIs. When in doubt, prefer **setImmediate** over **nextTick** so you do not starve the event loop. One valid use of **setImmediate** is when you want to “yield” to the event loop inside a synchronous function: call **setImmediate(callback)** and do the rest of the work in **callback**, so other pending I/O or timers can run first. That is rare in typical request handlers; usually you just use async/await and avoid long sync sections altogether.

---

## 4) Why Blocking the Main Thread Is Fatal

If you run code that does not return to the event loop for a long time, **nothing else** can run: no other request handlers, no timer callbacks, no I/O callbacks. The server or script is effectively frozen until that code finishes.

**Example: synchronous file read in a request handler.**

```javascript
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const data = fs.readFileSync("/some/large/file"); // BAD: blocks
  res.end(data);
});
server.listen(3000);
```

While **readFileSync** is running, the thread is blocked. Any other request that arrives during that time must wait. If the file is large or the disk is slow, every client sees high latency or timeouts. The fix is to use the async API and respond inside the callback (or async/await):

```javascript
const server = http.createServer((req, res) => {
  fs.readFile("/some/large/file", (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end("Error");
      return;
    }
    res.end(data);
  });
});
```

Now the handler returns immediately after starting the read; the event loop can handle other requests. When the read completes, the callback runs and the response is sent. So: **never use sync fs (or other sync I/O) in a request handler or in any path that must stay responsive.** The same applies to any API that has a “Sync” variant: **readFileSync**, **writeFileSync**, **execSync**, etc. In a long-running process that serves multiple clients or events, use only the async versions so the event loop can interleave work.

**Example: CPU-heavy work.**

```javascript
const server = http.createServer((req, res) => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i; // BAD: blocks for seconds
  res.end(String(sum));
});
```

The loop runs for a long time and blocks the thread. No other requests are handled. For CPU-bound work you have two options: (1) keep it very short (e.g. small calculations), or (2) offload to a **worker thread** or another process so the main thread only schedules the work and receives the result. Node’s **worker_threads** module (and in the future, other patterns) allows running JavaScript in another thread; the main thread stays free. For most servers and scripts, the rule is: **I/O must be async; CPU work must be short or offloaded.**

---

## 5) What to Do Instead: Async I/O and Short Handlers

- **Use async APIs for all I/O**: **fs.promises**, **fs.readFile** (callback), **http** request/response handling (streams and callbacks). Never **readFileSync** or **writeFileSync** in a server request path.
- **Keep request handlers short**: Start I/O (or delegate to a worker), then return. When the I/O completes (or the worker finishes), send the response. Do not do long computation in the handler.
- **Use async/await**: It keeps code linear and still non-blocking. **await fs.promises.readFile(path)** does **not** block the thread; it suspends that function and lets the event loop run other code until the promise resolves.
- **Offload CPU-heavy work**: If you must do heavy computation (image processing, large parsing), use **worker_threads** or a child process so the main thread only coordinates. The curriculum may cover workers in a later chapter; the important point now is “don’t block the main thread with long CPU work.”

**Worker threads** (the **worker_threads** module) let you run JavaScript in a separate thread. You pass data to the worker (e.g. a buffer or a serializable object), the worker runs your function, and it posts the result back. The main thread receives the result in a callback or Promise and can send the HTTP response. So the main thread stays free to accept more requests while the worker computes. For I/O-bound work (file, network), async APIs are enough; for CPU-bound work, workers are the right tool. You do not need to implement workers in this chapter; just know they exist and that “long CPU work” should not run on the main thread of a server.

### 5.1 Patterns That Stay Non-Blocking

- **Async/await with fs.promises or http**: **const data = await fs.promises.readFile(path);** — the function pauses until the read completes, but the thread is free; other code runs. When the read finishes, your function resumes.
- **Callback-based fs or http**: **fs.readFile(path, (err, data) => { ... });** — the call returns immediately; the callback runs in a later loop iteration when the I/O completes.
- **Streams**: **readable.pipe(writable)** or **readable.on("data", ...)** — data is processed in chunks as it arrives; you never hold the entire payload in memory or block for the whole read.
- **Timers**: **setTimeout** and **setInterval** schedule callbacks for later; they do not block. So “wait 5 seconds then respond” is done with **setTimeout** or a Promise that resolves after a delay, not with a busy loop.

All of these follow the same rule: start the work, return (or suspend with await), and let the event loop run your completion code when the work is done. That is what “non-blocking” means in practice.

---

## 6) What Breaks When You Ignore the Event Loop

If you use **readFileSync** or **writeFileSync** in an HTTP handler, one slow disk or one large file can block the server for seconds; all other requests wait. If you run a long **for** or **while** loop with no **await** or I/O, the same thing happens: the loop runs to completion and nothing else does. If you queue huge numbers of **process.nextTick** callbacks, you can delay I/O and timers and make the server feel stuck. If you assume **setTimeout(fn, 0)** runs **fn** “immediately,” you may get subtle ordering bugs because it runs in a **future** timers phase, not before the next I/O. If you mix blocking and non-blocking code (e.g. sync read in one path, async in another), the blocking path will still stall the process. Design so that **all** request-handling and server paths are non-blocking and keep CPU work short or offloaded.

---

## 7) Homestead and Server Implications

On a homestead or small server, your Node process might run an HTTP API that reads sensor data from a file or database. If one request does a sync read or a heavy computation, every other client (e.g. the dashboard, another script) is delayed. So from day one, use **fs.promises.readFile** (or callback **readFile**) and **async/await** in handlers. When you add more features (e.g. image resizing, report generation), keep the rule: start the work asynchronously or in a worker, respond when it is done, and never block the main thread. The same applies to CLI scripts that serve no other users: blocking only affects that script, but if you later turn that script into a server or run it in a pipeline, blocking can cause timeouts or backpressure. Getting into the habit of “async I/O, short handlers” in Phase 4 pays off when you build larger apps or use frameworks like Express (which run your handlers on the same single thread). Phase 3 (JavaScript) introduced async/await and Promises; Phase 4 (Node) gives you the environment where that model is essential. In the browser, blocking the main thread makes the page freeze; in Node, blocking the main thread makes the server freeze. The same “keep the main thread free” idea applies in both environments.

---

## 8) Ordering Example: setImmediate vs nextTick

A quick example to reinforce the order:

```javascript
console.log("1");

setTimeout(() => console.log("2 - timeout"), 0);
setImmediate(() => console.log("3 - setImmediate"));
process.nextTick(() => console.log("4 - nextTick"));

console.log("5");
```

Typical output: **1**, **5**, **4 - nextTick**, then either **2 - timeout** or **3 - setImmediate** (order between them can vary), then the other. So: synchronous code first (1, 5), then **nextTick** (4), then the next loop phase (2 or 3). This shows that **nextTick** runs before the next timers or setImmediate phase. You do not need to rely on this in application code often; the point is that “next tick” is earlier than “next phase.”

---

## 9) Checklist

Before moving on, you should be able to:

1. Explain that Node runs JS on one thread and that I/O is non-blocking (callbacks run when I/O completes).
2. Describe the event loop in one sentence: timers and I/O callbacks (and setImmediate, close) run in phases; your async code runs when its I/O or timer is ready.
3. Say what **process.nextTick** does (run before next phase) and why to use it sparingly (can starve I/O).
4. Say what **setImmediate** does (run after current I/O callbacks in this iteration) and when you might use it (defer to next turn without a timer).
5. Explain why blocking (sync fs or long CPU) in a server is bad: no other requests run until the block finishes.
6. Write request handlers that use async I/O (e.g. **fs.promises.readFile**, callbacks) and avoid **readFileSync** and long loops in the request path.
7. Know that the process exits when the event loop has no more work (no open handles, no pending timers); a listening server keeps the process alive until the server is closed.

---

## Common Pitfalls

- **Using sync fs in a server**: **readFileSync**, **writeFileSync**, etc., block the thread. Use **fs.promises** or callback **fs** in any code that must stay responsive.
- **Long synchronous loops**: A **for** or **while** that runs for seconds with no **await** or I/O blocks everything. Offload to a worker or break up the work.
- **Overusing process.nextTick**: Queuing many **nextTick** callbacks delays I/O and timers. Prefer **setImmediate** or normal async flow.
- **Assuming setTimeout(fn, 0) is “immediate”**: It runs in a future timers phase, not before the next I/O. Use **setImmediate** if you want “after current I/O.”
- **Mixing blocking and non-blocking in the same app**: One blocking path can still stall the whole process. Make all server paths non-blocking.
- **Forgetting that “async” means “scheduled,” not “in parallel”**: Your async code still runs on the single thread; it just runs later when I/O or a timer completes. Concurrency is interleaved, not parallel; that is why one blocking callback blocks everything.

---

## Practice: Try These

1. Run the ordering example (setTimeout(0), setImmediate, nextTick, console.log) a few times and note the output. Change the order of the three calls and see how **nextTick** always runs before the timer and setImmediate.
2. Write a tiny HTTP server that uses **fs.readFileSync** in the handler to read a file and send it. Start the server, make one request that takes a few seconds (e.g. read a large file or add a **setTimeout** in the handler to simulate slow work), and in another terminal or browser make a second request. Observe that the second request waits for the first to finish. Then switch to **fs.promises.readFile** and see that the second request can be handled while the first is still waiting on I/O.
3. In a script, run a tight loop that runs for 2–3 seconds (e.g. **let x = 0; for (let i = 0; i < 1e9; i++) x += i; console.log(x)**). While it runs, notice that the process is “busy” (e.g. no other code runs). That is the cost of blocking.
4. Read the Node.js docs “The Node.js Event Loop” (or a summary) once to see the full phase list. You do not need to memorize it; the goal is to know that there is a defined order and that I/O and timers are handled in phases.

These exercises lock in the single-thread, non-blocking model and the cost of blocking. If you are unsure whether a function is blocking, check the name: **readFileSync**, **execSync**, and similar “Sync” APIs block. If there is a callback or a Promise, it is almost certainly non-blocking (the call returns quickly; the callback or promise runs when the work is done). When debugging “my server is slow or not responding,” look for sync I/O or long loops in the request path first.

---

## Summary

Node runs your JavaScript on a **single thread**. I/O (fs, http, timers) is **non-blocking**: you start an operation and register a callback (or use a Promise); when the operation completes, the **event loop** runs your callback in the right phase (timers, I/O callbacks, setImmediate, close). Promise reactions (then/catch, async/await continuations) run as microtasks between phases. So the thread is not stuck waiting; it can run other code until your I/O or timer is ready. **process.nextTick** runs callbacks before the next phase (use sparingly); **setImmediate** runs after the current I/O callbacks in this iteration. **Blocking** the thread—with **readFileSync**, **writeFileSync**, or long CPU work—stops the event loop: no other requests or callbacks run until the block finishes. In a server that is fatal. So: use async I/O everywhere in request handlers, keep handlers short, and offload heavy CPU work to workers or other processes. With this model in mind, you can write responsive Node servers and understand why “don’t block” matters. Next, Chapter 4.07 (npm) will introduce package management so you can add libraries and tools to your Node projects.

---

## Next

Next: **Chapter 4.07: npm — Package Management**. That chapter introduces npm: the package manager that ships with Node. You will create a **package.json**, install dependencies, and use **require** or **import** to use installed packages. npm is the foundation for adding frameworks, utilities, and tools to your Node projects.
