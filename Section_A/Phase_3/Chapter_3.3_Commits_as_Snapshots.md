## Section A Phase 3 · Chapter 3.3: Commits as Snapshots

`git add`, `git commit`; commit messages as documentation; hashes and immutability; viewing history.

## Learning Objectives

By the end of this chapter, you should be able to:
- Use `git add` and `git commit` to create snapshots.
- Explain exactly what gets included in a commit.
- Write commit messages that function as documentation.
- Explain what a commit hash is and why commits are immutable.
- View and navigate history using `git log` and `git show`.

---

## 1) Creating a Commit — add and commit

A commit is a snapshot of the staging area at a point in time. Not the working directory. Not the entire project folder. Only what is staged.

### The Basic Workflow

The core workflow looks like this:

```bash
# 1. Edit files
# (make changes in your editor)

# 2. Stage changes
git add file.js

# 3. Commit snapshot
git commit -m "Describe what changed and why"
```

Three phases:
1. Edit (working directory)
2. Stage (index)
3. Commit (repository)

### What Actually Gets Included?

Only staged changes. Example: you modify two files—`sensor.js` and `logger.js`. You run:

```bash
git add sensor.js
git commit -m "Fix voltage rounding bug"
```

The commit includes `sensor.js`. It does NOT include `logger.js` (still modified, but unstaged). After commit: `sensor.js` is recorded in history; `logger.js` is still modified in the working directory. This separation is intentional.

### First-Time Setup: Identity

Git records author name, author email, and timestamp. Before committing for the first time, configure identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

These values become part of every commit. They are embedded in history. Commits are not anonymous.

### Homestead Example: Coop Monitor Fix

You fix a bug in the coop door timer where it was opening an hour early during daylight saving time transitions. You also add logging to track door open events. These are two separate changes. Stage and commit separately:

```bash
git add coop_door.py
git commit -m "Fix coop door timer DST offset calculation"

git add door_logger.py
git commit -m "Add logging for coop door open events"
```

Each commit is a snapshot of only the staged files. The first commit includes only the bug fix; the second includes only the logging addition. Later, if you need to revert the logging, you can do so without affecting the bug fix.

### Homestead Example: ESP32 Controller Update

You're updating the ESP32 controller for the electric fence. You modify the MicroPython code to change the pulse duration, and you also update the ESPHome YAML config. These are related but separate changes. Commit them separately:

```bash
git add fence_controller.py
git commit -m "Increase fence pulse duration to 0.5s for better energization"

git add fence_controller.yaml
git commit -m "Update ESPHome config for new pulse duration"
```

If the pulse duration change causes issues, you can revert just the Python code commit without affecting the config. That granularity is why staging exists.

### Homestead Example: Solar Logger and Config

You update the solar logger to use a new aggregation method, and you also update the config file to add a new sensor ID. Stage them separately:

```bash
git add solar_aggregator.py
git commit -m "Refactor solar logger to use time-window aggregation"

git add config.json
git commit -m "Add new solar panel sensor ID to config"
```

The commit includes only what you staged. If you had run `git add .` and committed everything together, both changes would be in one commit, making it harder to revert just the config change later.

---

## 2) What a Commit Actually Is

A commit contains:
- A pointer to a tree (snapshot of files)
- Metadata (author, date)
- A commit message
- A pointer to a parent commit
- A unique hash

It is a node in a chain of history. Each commit references its parent. History is a linked structure.

### The Commit Structure

When you run `git commit`, Git:
1. Takes everything in the staging area
2. Creates a tree object representing the directory structure and file contents
3. Creates a commit object with metadata, message, parent pointer, and tree pointer
4. Generates a hash from all of this content
5. Updates the current branch pointer to point at the new commit

The commit is immutable: once created, its hash never changes. If you want to change something, you create a new commit.

### Homestead Analogy: Wiring Diagram Snapshots

Think of each commit as a snapshot of your wiring diagram. The diagram shows all connections at that moment. When you change the wiring, you don't erase the old diagram; you take a new snapshot. Each snapshot is labeled with a date, your name, and a note about what changed. You can look back at any snapshot to see exactly how things were wired then. That is what a commit is: a labeled snapshot of your project at a moment in time.

### What Gets Snapshot

When you commit, Git takes a snapshot of:
- All files that were staged (their complete contents at that moment)
- The directory structure (which files exist, where they are)
- File permissions (on systems that track them)

It does NOT snapshot:
- Unstaged changes (they stay in your working directory)
- Untracked files (they remain invisible to Git)
- Files listed in `.gitignore` (they're never included)

So the snapshot is exactly what you staged—nothing more, nothing less. That precision is intentional and valuable.

---

## 3) Commit Messages as Documentation

A commit message is not decoration. It is documentation embedded in history. The code shows what changed. The message explains why.

### Why Messages Matter

Months later, you will ask: Why did I change this logic? Why did I rename this variable? Why did I disable this feature? The commit message is the answer.

Without it, you have a diff, no context, and no reasoning. History becomes archaeology instead of narrative.

### Good Commit Message Structure

Common convention:

**Short summary in imperative mood (50 characters or less)**

Optional body explaining:
- Why this change was necessary
- What problem it solves
- Side effects or constraints

### Imperative Mood

Use commands:
- "Fix voltage rounding bug"
- "Add request duration logging"
- "Remove deprecated endpoint"

Not:
- "Fixed bug"
- "Added feature"
- "Changes"

Think of it as: "If applied, this commit will..."

### Weak vs Strong Messages

**Weak:**
- Update stuff
- Fix
- Changes
- WIP
- More work

These are useless.

**Strong:**

```
Fix sensor voltage rounding error

Voltage values were being truncated instead of rounded,
causing inaccurate readings in the dashboard.
```

### Homestead Examples: Weak vs Strong

**Weak:**
```
Update config
```

**Strong:**
```
Adjust irrigation threshold to prevent overwatering

Lowered soil moisture trigger from 45% to 38%
based on field test results from north orchard.
```

The second message explains reasoning, documents experiment results, and provides future traceability.

**Weak:**
```
Fix coop
```

**Strong:**
```
Fix coop door opening at wrong time during DST transitions

The timer was using local time without accounting for
daylight saving time changes. Updated to use UTC internally
and convert to local time only for display.
```

**Weak:**
```
Add sensor
```

**Strong:**
```
Add humidity sensor to pig barn monitor

New DHT22 sensor installed in pig barn; readings logged
alongside temperature. Config updated with sensor ID and
calibration values from manufacturer spec sheet.
```

Each strong message tells you what changed and why, making history readable and useful.

### Commit Messages as System Memory

Your repository becomes a technical diary, an audit trail, and a reasoning record. When scaling projects or collaborating, this becomes essential. Good messages turn history into documentation you can search and understand.

### Homestead Example: The Value of Good Messages

Six months after installing a new solar panel, you notice the production totals are wrong. You run `git log` and see:

```
a3f5b2c Fix solar aggregation
9d1e4c2 Update solar config
7b2c1f0 Add solar panel
```

These messages tell you nothing. You have to open each commit and read the diff to understand what changed.

With good messages:

```
a3f5b2c Fix solar daily total calculation

The aggregation was summing hourly values incorrectly during
DST transitions. Fixed to use consistent time windows.

9d1e4c2 Add second solar panel to monitoring

New 300W panel installed on south roof; added sensor ID
and calibration values to config.

7b2c1f0 Initial solar monitoring setup

Basic logger for single panel with hourly readings.
```

Now you can scan the log and immediately see when the aggregation was fixed, when the second panel was added, and when solar monitoring started. The messages are documentation.

### When to Write Longer Messages

Sometimes a one-line summary isn't enough. Use a longer message when:
- The change is complex or non-obvious
- The reasoning is important for future understanding
- There are side effects or constraints
- You're documenting an experiment or trial

Example:

```
Adjust irrigation threshold based on soil type analysis

Lowered soil moisture trigger from 45% to 38% for north
orchard after field tests showed overwatering. The north
orchard has clay-heavy soil that retains moisture longer
than the south orchard's sandy soil. This change prevents
root rot while maintaining adequate hydration.

Tested for two weeks; no negative effects observed.
```

This message documents not just what changed, but why, what was tested, and what the results were. Future you (or a teammate) will understand the reasoning without having to dig through notes or memory.

---

## 4) Hashes and Immutability

Every commit has a unique identifier: a hash. Example: `a3f5b2c9e8d1f6...`. This is typically a SHA-1 hash (or SHA-256 in newer Git modes).

### What the Hash Represents

The hash is derived from:
- File contents
- Tree structure
- Parent commit
- Author
- Timestamp
- Commit message

Change any of these, and the hash changes. The commit ID is content-addressed. It is not random. It is deterministic.

### Why Content-Addressed?

Because the hash is derived from content, you can verify integrity. If someone changes a file in an old commit, the hash changes, and Git detects the mismatch. This is how Git ensures history hasn't been tampered with. The hash is a fingerprint of the entire commit.

### Immutability

Commits are immutable. You do not change a commit. You create a new one. If you edit a file, stage it, and commit again, you create a new snapshot with a new hash. The old commit still exists. History is append-only by default.

### Why Immutability Matters

Immutability provides safety, auditability, integrity, and trust. You can refer to a specific commit by hash, know it will never silently change, and reconstruct the exact state of the project at that time. This is foundational for collaboration, deployment, and reproducibility.

### Homestead Example: Immutability in Practice

You commit a fix to the fence monitor: `a3f5b2c Fix fence voltage threshold`. Later you realize the fix was wrong. You don't edit that commit. You create a new commit: `9d1e4c2 Revert fence voltage threshold change`. Both commits exist in history. You can see what you tried, when, and why you reverted it. The history is honest and complete.

### Why You Can't Change a Commit

If commits were mutable, you could change history silently. Someone could refer to commit `a3f5b2c` today, and tomorrow that same hash could point to different content. That would break trust and make collaboration impossible. Immutability ensures that when you refer to a commit by hash, you always get the same content. That guarantee is foundational to Git's design.

### Rewriting History (Preview)

Technically, history can be rewritten. But that creates new commits, new hashes, and a different timeline. The original commits remain in history until garbage collected. We will examine rewriting later. For now: commits are treated as permanent snapshots.

---

## 5) Viewing History

To inspect history: `git log`. This shows commit hash, author, date, and message. Newest commits appear first.

### Compact View

Use `git log --oneline`. Example output:

```
a3f5b2c Fix voltage rounding bug
9d1e4c2 Add request duration logging
7b2c1f0 Initial commit
```

This is useful for quick history scanning and identifying commit IDs.

### Limiting Results

`git log -n 5` shows the last 5 commits. Useful when you have a long history and only need recent commits.

### Viewing a Specific Commit

`git show <commit-hash>`. Example: `git show a3f5b2c`. Shows commit metadata, the diff (what changed), and insertions and deletions. `git show` lets you inspect what exactly changed, line-by-line differences.

### Understanding Project Evolution

Using `git log` and `git show`, you can trace when a bug was introduced, see when a file was added, understand how a feature evolved, and identify performance regressions. You are no longer guessing. You are navigating time.

### Homestead Example: Finding When a Bug Was Introduced

The coop door has been opening at the wrong time for a week. You know it worked last month. Use `git log` to find commits that touched the door logic:

```bash
git log --oneline --grep="door" --grep="coop" --all
```

You see:

```
d4e5f6a Fix coop door DST calculation
c3b2a19 Add coop door timer
```

Open the DST commit: `git show d4e5f6a`. You see the change that broke it. You can revert that commit or fix forward. Without version control, you would be guessing what changed and when.

### Homestead Example: Tracing a Feature

You want to know when solar monitoring was added and how it evolved. Use `git log`:

```bash
git log --oneline --all -- solar_logger.py
```

You see:

```
f7e8d9c Add daily aggregation to solar logger
e6d5c4b Add email alerts for low production
d5c4b3a Initial solar logger implementation
```

Each commit shows a step in the feature's evolution. You can see when aggregation was added, when alerts were added, and when the feature started. That timeline is documentation.

### Viewing Changes Between Commits

You can compare any two commits to see what changed:

```bash
git diff d5c4b3a f7e8d9c
```

This shows all changes between the initial implementation and when aggregation was added. Useful for understanding how a feature grew over time.

### Homestead Example: Comparing Config States

You want to see what changed in the config between last month and now:

```bash
git diff HEAD~30 config.json
```

This shows all changes to `config.json` in the last 30 commits. Useful for seeing how configuration evolved, what sensors were added, what thresholds changed, etc.

---

## 6) Conceptual Shift: From Files to States

Git does not track changes over time in isolation. It tracks complete project states at each commit. Each commit is a named state, a frozen moment, a checkpoint. The repository is a chain of states, connected by parent references. Time becomes explicit.

### The Mental Model

When you think in terms of commits, you're not thinking "I changed this file." You're thinking "at this commit, the project looked like this." Each commit is a complete snapshot. You can check out any commit and see the entire project as it was then.

### Homestead Analogy: Project Snapshots

Imagine taking a photo of your entire homestead setup—all wiring, all sensors, all config files—at the end of each day. Each photo is labeled with the date and what changed that day. That is what Git does: each commit is a photo of your entire project. You can look at any photo to see exactly how things were configured then. You can compare photos to see what changed between days. That is the snapshot model.

### Why This Matters

Because commits are snapshots, you can:
- Check out any commit and have a complete, working project
- Compare any two commits to see what changed
- Create branches from any point in history
- Revert to any previous state

If Git tracked only changes (diffs), these operations would be harder. With snapshots, they're straightforward.

---

## 7) Common Mistakes and How to Avoid Them

### Mistake: Vague Commit Messages

**Symptom:** Your log is full of "fix," "update," "changes" messages that tell you nothing.

**Fix:** Write messages that explain what and why. Use imperative mood. Include context.

**Prevention:** Before committing, ask: "Will I understand this message in six months?" If not, rewrite it.

### Mistake: Committing Everything Together

**Symptom:** One commit includes a bug fix, a new feature, and documentation updates.

**Fix:** Stage and commit logical units separately. Use `git add` selectively.

**Prevention:** Review what's staged (`git diff --staged`) before committing. If it includes multiple unrelated changes, unstage some and commit separately.

### Mistake: Forgetting to Stage

**Symptom:** You edit files and commit, but your changes aren't in the commit.

**Fix:** Run `git add` before `git commit`. Check `git status` to see what's staged.

**Prevention:** Make `git status` a habit. Run it before committing.

### Mistake: Not Understanding Immutability

**Symptom:** You try to "edit" an old commit and get confused when it doesn't work.

**Fix:** Understand that commits are immutable. To change something, create a new commit.

**Prevention:** Think of commits as snapshots, not editable documents. History is append-only.

---

## 8) Advanced: What's Inside a Commit

A commit object contains:
- **Tree pointer:** Points to a tree object representing the directory structure
- **Parent pointer(s):** Points to the previous commit(s)
- **Author:** Name and email
- **Committer:** Name and email (may differ from author in some workflows)
- **Timestamp:** When the commit was created
- **Message:** Your commit message
- **Hash:** SHA-1 or SHA-256 hash of all the above

The tree object points to blob objects (file contents) and other tree objects (subdirectories). This structure lets Git store the entire project state efficiently while deduplicating unchanged files.

### Why This Structure?

Because Git stores snapshots, not diffs, it needs to store complete file contents. But it's smart: if a file doesn't change between commits, both commits point to the same blob object. So storage stays efficient even though conceptually each commit is a full snapshot.

---

## 9) Review: Commits in One Page

Before moving on, you should be able to state in your own words:

1. **What is a commit?** A snapshot of the staging area at a moment in time, with metadata (author, date, message) and a unique hash.

2. **What gets included?** Only what you staged with `git add`. Unstaged changes stay in your working directory.

3. **Why are commits immutable?** To ensure integrity and trust. Once created, a commit's hash never changes. To change something, create a new commit.

4. **What makes a good commit message?** Imperative mood, explains what and why, provides context. Think: "If applied, this commit will..."

5. **How do you view history?** `git log` shows the commit history; `git show <hash>` shows a specific commit's details and changes.

If any of these is fuzzy, revisit that section. The next chapter assumes you understand what a commit is and how to create one.

---

## 10) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time, and that we can observe and name those transitions. Commits are exactly that: named transitions between states.

Each commit is a moment in time when you chose to record the project's state. The commit message explains why you made that transition. The hash ensures the state is immutable and verifiable. The parent pointer connects states into a timeline.

This is Section A Phase 1 (Time and State Changes) made concrete: instead of state drifting invisibly, you formalize each transition with a commit. Time becomes explicit and navigable.

### The Mental Model Applied

When you think in terms of commits, you're thinking about states, not just file changes. Each commit is "the project looked like this at this moment." You can navigate between states, compare states, and create new states from old ones. That is the power of the snapshot model: time becomes a dimension you can move through, not just a one-way flow.

---

## Summary

- `git add` stages changes; `git commit` records a snapshot of staged changes.
- Each commit has a unique hash derived from its content.
- Commits are immutable—you create new ones instead of modifying old ones.
- Commit messages serve as documentation of intent—explain what and why.
- Use `git log` and `git show` to navigate and inspect history.
- Commits are snapshots of complete project states, not just changes to files.

You are no longer editing files. You are creating states in time. Each commit is a named checkpoint you can return to, compare, or branch from.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.4 — Branches and Parallel Lines of Work** (`Chapter_3.4_Branches.md`).

You will learn what a branch actually is, how Git represents branches internally, how multiple timelines coexist, and how to move between states safely. You now understand snapshots. Next, you learn how to create alternate timelines.
