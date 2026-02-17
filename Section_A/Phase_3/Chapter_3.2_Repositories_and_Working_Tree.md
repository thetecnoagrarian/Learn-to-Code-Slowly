## Section A Phase 3 · Chapter 3.2: Repositories and the Working Tree

Repository as history store; working directory; .git; staged vs unstaged; mental model of three areas.

## Learning Objectives

By the end of this chapter, you should be able to:
- Describe what a repository is and where it lives (.git).
- Explain what the working directory (working tree) is.
- Explain the staging area (index) and how it sits between working directory and repository.
- Use the three-area mental model to reason about git add and git commit.
- Predict where a file's state lives after each Git command.

---

## 1) The Repository — Where History Lives

A repository is a structured database of project history. It contains all commits, all branches, all tags, all objects (snapshots of files), and all references (pointers to commits). It is not just "the folder with your code." It is specifically the hidden `.git` directory.

### The .git Directory

When you run git init, Git creates a hidden folder: `.git/`. This folder contains objects (where snapshots live), refs (pointers to branches and tags), HEAD (pointer to current branch), configuration files, and internal metadata.

The `.git` directory is the repository, the history store, the time machine. Everything else is just your working files.

### What Lives in the Repository

Inside `.git`, Git stores commits (snapshots), trees (directory structures), blobs (file contents), and branch pointers. Each commit is immutable, addressed by a hash, and connected to parent commits. The repository is a graph of states over time.

You do not edit `.git` directly. You interact with it through Git commands. Git is the only interface to the repository.

### Conceptual Separation

Think of it this way: the working directory is what you edit; the repository (`.git`) is what Git remembers. The repository does not change when you edit files. It only changes when you commit.

### Why This Matters

Understanding that the repository is separate from your working files is crucial. You can edit files all day, delete them, rename them—none of that touches the repository until you commit. That separation is what makes Git safe: your history is protected from accidental edits. It also means you can have uncommitted changes in your working directory while the repository stays clean and stable.

---

## 2) The Working Directory (Working Tree)

The working directory is the visible project folder—minus `.git`. It contains source code, markdown files, scripts, config files, and assets. It is where you edit, create, delete, and rename files. The working directory is your active workspace.

### Tracked vs Untracked Files

Git distinguishes between tracked files (files Git already knows about, included in previous commits, changes show up in git status) and untracked files (files Git has never seen, not included in commits, show up as "untracked" in git status).

When you run git status, it might show modified files and untracked files. Tracked files participate in version control. Untracked files are invisible to history until you add and commit them.

### Important Principle

Changes in the working directory are not yet in history, not yet in the repository, and can still be discarded. Until committed, changes are local and temporary. This is both a feature and a responsibility: you can experiment freely, but you must commit to preserve your work.

### Homestead Analogy: Wiring Bench vs Documentation

Think of the working directory as your current wiring layout on the bench—components connected, sensors wired, but nothing documented yet. The repository is your documented wiring diagrams in a binder—formal, permanent, recoverable. Until you commit, you've only rearranged parts; nothing is formally recorded. Commit equals updating the diagram.

The same applies to code: you might refactor the coop monitor script, add a new sensor handler, or fix a bug in the solar logger. Those changes exist only in your working directory until you commit. The repository still has the old version. That separation lets you work freely and commit when you have a logical unit of change.

### Homestead Analogy: Config Files and Scripts

When you edit ESPHome YAML for a new sensor, or update the Python script for the fence monitor, those changes start in the working directory. The repository still has the previous version. You can test your changes, see if they work, and only commit when you're satisfied. If something breaks, you can discard the working directory changes and return to the last committed state. That safety net is why the working directory exists as a separate area.

---

## 3) The Staging Area (Index)

Between the working directory and the repository sits the staging area (also called the index). The staging area represents what will go into the next commit. It is a buffer and a selection mechanism.

### Why Does It Exist?

Why not just commit everything? Because you rarely want to. Example: you fix a bug in one file, add logging in another file, and update documentation in a third file. These are three logical changes. Without staging, committing would bundle them together. With staging, you can stage the first file and commit it with a message about the bug fix. Then stage the second file and commit it with a message about logging. Then stage the third file and commit it with a message about documentation.

You craft commits intentionally. Each commit represents one logical change, making history readable and recovery precise.

### What git add Actually Does

git add does not save to the repository or create history. It moves changes from the working directory to the staging area. It says: "Include this in the next snapshot." After git add, the change is staged but not yet committed. The repository is still unchanged.

### Staging Is a Snapshot in Progress

The staging area is a preview of the next commit, a partial snapshot, a curated set of changes. You can stage entire files, specific files, or even individual lines (with advanced usage). Staging lets you construct logical commits.

### Homestead Example: Multiple Changes, Separate Commits

You're working on the coop monitor. You fix a bug where the door timer was off by an hour during DST. You also add a new sensor reading for humidity. And you update the README to document the new sensor. These are three separate ideas. With staging you can stage the door fix file and commit it with a message about fixing the DST offset. Then stage the humidity sensor file and commit it with a message about adding the sensor. Then stage the README and commit it with a message about documenting the sensor.

Each commit is focused and clear. Later, if the DST fix causes issues, you can revert just that commit without touching the sensor addition. That precision is why staging exists.

### Homestead Example: Solar Logger Refactor

You refactor the solar logger to use a new aggregation method. While doing that, you also fix a typo in a comment. These are two separate changes. Stage and commit them separately: first stage the refactor and commit it with a message about the aggregation change. Then stage the typo fix and commit it with a message about fixing the typo.

Or, if the typo is trivial, you might include it in the refactor commit. The staging area gives you the choice. Without it, every commit would include everything you've changed since the last commit, making history messy and recovery imprecise.

---

## 4) The Three-Area Mental Model

Git has three core areas:
1. Working Directory
2. Staging Area (Index)
3. Repository

The flow is: Working Directory, then git add moves changes to Staging Area, then git commit moves changes to Repository.

### Why Two Steps?

Because commits should represent one idea, one logical change, one atomic step. The staging area gives you control. Without it, you would accidentally mix unrelated changes, create messy history, and lose clarity. Clean commits require selection. Selection requires staging.

### Table Summary

Working Directory is where you edit files. Use git add to move forward. Staging Area is where you prepare the next commit. Use git commit to move forward. Repository is permanent history. There is no command to move forward from here—it's the destination.

### Key Insight

The repository never sees unstaged changes. The staging area is the only gateway to history. This separation enforces discipline. You cannot accidentally commit something you didn't stage. You cannot skip staging and go straight from working directory to repository. That two-step process is intentional and valuable.

### Visualizing the Three Areas

Imagine three boxes. The working directory box contains your current files—some modified, some new, some unchanged. The staging area box is empty until you run git add; then it contains copies of the changes you staged. The repository box contains all your commits—immutable snapshots. When you run git commit, the contents of the staging area become a new commit in the repository, and the staging area is cleared (ready for the next set of changes). The working directory still has your files, but now they match what's in the repository (for the files you committed).

---

## 5) Basic Commands That Move Between Areas

### git status

Shows modified files (working directory), staged files (ready to commit), and untracked files. It is your visibility tool. Run it often. It tells you exactly where your changes are: in the working directory (modified but not staged), in the staging area (staged but not committed), or untracked (not yet part of version control).

### git add

Moves changes into staging. You can stage one file, stage changes in the current directory, or stage all changes. After git add, changes are staged but not committed. The repository is still unchanged.

### git commit

Takes the staged snapshot and writes it to the repository. git commit with a message creates a new commit, generates a hash, updates the branch pointer, and records author and timestamp. Now the repository contains the new state.

### Predicting State

After editing a file: working directory is modified, staging is unchanged, repository is unchanged.

After git add: working directory may still be modified (or clean if you staged all changes), staging is updated, repository is unchanged.

After git commit: working directory is clean (matches repository), staging is clean, repository has a new commit added.

You should be able to reason about these transitions. This mental model will help you understand what Git commands do and why.

### Common Confusions

"Why didn't my commit include my changes?" Because you didn't stage them. Git only commits what is in the staging area. If you edit a file and run git commit without git add, nothing happens (or Git tells you there's nothing to commit).

"Why does Git have this extra step?" Because commit quality matters. The staging area enforces thought. It forces intentional grouping, logical boundaries, and clean history. Without it, every commit would be "everything I changed since last time," which makes history hard to read and recovery imprecise.

"Can I skip staging?" No. Git requires staging before committing. That is by design. Some commands stage and commit in one step, but they still use the staging area internally. The two-step process is fundamental to Git's design.

---

## 6) Practical Workflow: From Edit to Commit

A typical workflow looks like this:

1. Edit files in your working directory (using your editor).
2. Check status with git status to see what changed.
3. Stage changes with git add (selecting which changes to include).
4. Review what's staged (optional: use git diff to see staged changes).
5. Commit with git commit and a message to write to repository.
6. Repeat as you continue working.

Between steps 3 and 5, you can still edit files, stage more changes, or unstage things. The staging area is flexible until you commit.

### Homestead Example: Adding a New Sensor

You add a new temperature sensor to the pig barn. The workflow: Edit the pig barn sensor file to add the new sensor reading. Edit the config file to add the sensor ID. Run git status to see both files modified. Stage the sensor code file and commit it with a message about adding the temperature sensor. Then stage the config file and commit it with a message about adding the sensor ID to config.

Two logical commits: the code change and the config change. If you need to revert the sensor code later, you can do so without touching the config. That precision comes from staging.

### Homestead Example: Fixing a Bug and Adding a Feature

You fix a bug in the solar logger (wrong calculation for daily total) and also add a new feature (email alerts when production drops). These are two separate ideas. Stage and commit separately: first stage the bug fix file and commit it with a message about fixing the daily total calculation. Then stage the alert system files and commit them with a message about adding email alerts for low production.

Each commit is focused. If the email feature has issues, you can revert just that commit. The bug fix stays. That is the value of staging: you control what goes into each commit.

### Homestead Example: ESPHome Config and Python Script

You're updating the ESP32 controller for the electric fence. You modify the ESPHome YAML config to change the pulse duration, and you also update the Python script that monitors fence voltage. These are related but separate changes. Stage them separately: first stage the YAML config and commit it with a message about increasing the pulse duration. Then stage the Python script and commit it with a message about updating the voltage threshold.

Later, if the pulse duration change causes issues, you can revert just the YAML commit without affecting the Python script. That granularity is why staging exists.

### Homestead Example: Documentation and Code Together

You refactor the coop door logic and also update the README to document the new behavior. You could commit them together (since the docs explain the code change), or separately (code first, then docs). Staging gives you the choice: stage both files together and commit with a combined message, or stage the code file first and commit it, then stage the README and commit it separately.

Both are valid. The staging area lets you decide based on your project's needs and your commit message style.

---

## 7) What Happens When You Don't Stage

If you edit files and run git commit without staging, Git will tell you there's nothing to commit. The changes are still in your working directory, but they're not staged, so they can't be committed. This is Git protecting you from accidentally committing things you didn't intend to include.

You can also have a mix: some files staged, some files modified but not staged. git status will show both. Only the staged files will be included in the next commit. The unstaged changes remain in your working directory, ready to be staged later (or discarded).

### The Safety Net

The staging area is also a safety net. If you stage something by mistake, you can unstage it before committing. Once you commit, the change is in the repository and harder to undo (though still possible with care). So staging gives you a chance to review and adjust before making history permanent.

### Mixed States: Staged and Unstaged Changes

It's common to have some files staged and others modified but not staged. For example, you might stage a bug fix but leave a new feature unstaged because it's not ready. git status will show staged files under "Changes to be committed" and unstaged files under "Changes not staged for commit."

Only the staged files will be included in the next commit. The unstaged files stay in your working directory. You can commit the staged changes, then continue working on the unstaged files and stage them later. This flexibility is why the staging area exists: you can prepare commits incrementally.

### Homestead Example: Partial Staging

You're working on the solar dashboard. You fix a bug in the aggregation code and also start adding a new chart feature. The bug fix is ready; the chart is half-done. Stage only the bug fix file and commit it with a message about fixing the off-by-one error. Continue working on the chart feature.

The chart changes stay in your working directory. When the chart is complete, you stage and commit it separately. This keeps your history clean: each commit is complete and logical.

---

## 8) Advanced Staging Scenarios

### Staging Parts of a File

You can stage individual lines or hunks within a file (using patch mode). This lets you commit part of a file's changes while leaving other changes unstaged. For example, you might fix two bugs in the same file but want to commit them separately: use patch mode to stage the first bug fix and commit it, then later use patch mode again to stage the second bug fix and commit it separately.

This advanced usage is powerful but not required for daily work. Most of the time, staging entire files is sufficient.

### Unstaging Changes

If you stage something by mistake, you can unstage it. This moves the changes back to the working directory (unstaged but still modified). The file is unchanged; only the staging status changes.

### Clearing the Staging Area

If you want to unstage everything (but keep your working directory changes), you can clear the staging area. This clears the staging area but leaves your working directory files as they were. Useful if you staged things and then realized you want to reorganize your commits differently.

---

## 9) Understanding git status Output

git status is your window into the three areas. Understanding its output is crucial.

### Clean Working Directory

When git status shows "nothing to commit, working tree clean," this means: working directory matches the repository. No changes anywhere.

### Modified Files (Unstaged)

When git status shows "Changes not staged for commit" followed by a modified file, this means: the file is modified in the working directory but not staged. The repository still has the old version.

### Staged Files

When git status shows "Changes to be committed" followed by a file, this means: the file is staged and will be included in the next commit. The repository will be updated when you commit.

### Mixed State

When git status shows both "Changes to be committed" and "Changes not staged for commit," this means: some files are staged, others are modified but not staged. Only the staged files will be in the next commit.

### Untracked Files

When git status shows "Untracked files" followed by a file, this means: the file exists in the working directory but Git has never seen it. It's not in any commit. You must add it to start tracking it.

---

## 10) Common Mistakes and How to Avoid Them

### Mistake: Forgetting to Stage

**Symptom:** You edit a file, run git commit, and Git says "nothing to commit" or your changes aren't in the commit.

**Cause:** You didn't run git add before git commit.

**Fix:** Run git add to stage your changes, then commit.

**Prevention:** Make git status a habit. Run it before committing to see what's staged and what's not.

### Mistake: Staging Everything Unintentionally

**Symptom:** You run git add and accidentally stage files you didn't mean to include (like temporary files or debug code).

**Fix:** Unstage the unwanted files, then commit only what you intended.

**Prevention:** Use `.gitignore` to exclude temporary files (covered in a later chapter). Be selective with git add—stage specific files rather than everything.

### Mistake: Committing Too Much at Once

**Symptom:** One commit includes a bug fix, a new feature, and documentation updates—making it hard to revert or understand later.

**Fix:** Too late for this commit, but going forward: stage and commit logical units separately.

**Prevention:** Review what's staged before committing. If it includes multiple unrelated changes, unstage some and commit separately.

### Mistake: Confusing Working Directory and Repository

**Symptom:** You think your changes are "saved" because you edited files, but they're not in the repository yet.

**Cause:** Confusing the working directory (where you edit) with the repository (where history lives).

**Fix:** Remember: editing files only changes the working directory. You must git add and git commit to put changes in the repository.

**Prevention:** Think of the three areas: working directory (editing), staging (preparing), repository (permanent). Changes only become permanent when committed.

---

## 11) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time, and that we can observe and name those transitions. The three-area model is that idea applied to Git:

- **Working directory** = current state (what you're editing now)
- **Staging area** = proposed next state (what you want to record)
- **Repository** = recorded states over time (the history)

Each commit is a named transition from one state to another. The staging area lets you choose exactly what that transition includes. Without staging, transitions would be "everything changed," which is less useful than "this specific logical change."

The repository is state evolving through time, with each commit being a named snapshot. The working directory is where you prepare the next snapshot. The staging area is where you curate what goes into it. This is Section A Phase 1 (Time and State Changes) made concrete in Git's architecture.

### The Mental Model in Practice

When you edit a file, you're changing the working directory state. When you git add, you're copying that change into the staging area (proposed next state). When you git commit, you're making the staging area the new repository state and clearing the staging area. The working directory now matches the repository (for committed files). That cycle repeats: edit → stage → commit → repeat. Each commit is a named point in time you can return to.

---

## Summary

- The repository (`.git`) holds all history—commits, branches, tags, objects. It only changes when you commit.
- The working directory is where you edit files—your active workspace. Changes here are not yet in history.
- The staging area (index) is what will become the next commit—a buffer and selection mechanism. You control what goes in.
- git add moves changes from working directory to staging.
- git commit writes the staged snapshot into the repository.
- The three-area model explains Git's design and behavior.

If you understand these three areas, you understand Git's core architecture. Everything else builds on this foundation. The next chapter examines what a commit actually is—the snapshot itself—now that you know where it lives and how it gets there.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.3 — Commits as Snapshots** (`Chapter_3.3_Commits_as_Snapshots.md`).

You will examine what a commit actually is, how hashes identify states, why commits are immutable, and how to view history. Now that you understand where history lives (the repository) and how changes move from working directory through staging to the repository, you are ready to examine what a commit actually is—the snapshot itself.
