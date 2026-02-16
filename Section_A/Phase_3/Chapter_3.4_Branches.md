## Section A Phase 3 · Chapter 3.4: Branches and Parallel Lines of Work

What a branch is; creating and switching branches; when to branch; main vs feature branches.

## Learning Objectives

By the end of this chapter, you should be able to:
- Explain what a Git branch actually is (a movable pointer to a commit).
- Describe how HEAD relates to branches and commits.
- Create and switch branches using `git branch`, `git switch`, and `git checkout`.
- Decide when to start a new branch (feature, fix, experiment).
- Use main as a stable line and feature branches for parallel work.

---

## 1) What a Branch Is

When most people hear "branch," they imagine a full copy of the project, a separate folder, or a forked codebase. That is not what a Git branch is.

A branch is a movable pointer to a commit. That's it.

### Visual Model

Imagine this commit history:

```
A — B — C
```

If `main` points to C, then:

```
main → C
```

Now you create a new branch:

```bash
git branch feature-x
```

You now have:

```
A — B — C
          ↑
        main
          ↑
     feature-x
```

Both branches point to the same commit. No duplication happened. No files were copied. Just a new pointer was created.

### Branches Move When You Commit

If you switch to `feature-x` and commit:

```
A — B — C — D
          ↑     ↑
        main  feature-x
```

Only `feature-x` moved. `main` still points to C. Branches move forward when you commit on them. They do not move automatically.

### The Default Branch: main (or master)

When you initialize a repository with `git init`, Git creates a default branch—usually `main` (historically `master`). This is not special. It's just a branch name. But by convention, `main` represents the stable line of development, the branch you deploy from, the branch others expect to be safe.

### HEAD — Where You Are

Git has a special pointer: `HEAD`. `HEAD` points to the current branch, which points to a commit. So:

```
HEAD → main → C
```

If you switch branches:

```
HEAD → feature-x → D
```

`HEAD` tells Git: "This is where new commits should go."

### Why This Model Matters

Because branches are just pointers, creating a branch is instant and costs almost nothing. You're not copying files or duplicating history. You're just creating a new name that points at an existing commit. That efficiency is why branching is so common in Git workflows.

---

## 2) Creating and Switching Branches

Now that you understand branches are pointers, the commands become simple.

### Create a Branch

```bash
git branch feature-x
```

This creates a new branch pointer but does not switch you to it. You're still on your current branch.

### Switch to a Branch

Modern Git:

```bash
git switch feature-x
```

Older Git:

```bash
git checkout feature-x
```

Now `HEAD → feature-x`. You are working on that branch.

### Create and Switch in One Step

Modern Git:

```bash
git switch -c feature-x
```

Older Git:

```bash
git checkout -b feature-x
```

This creates the branch and immediately switches to it. This is the most common workflow.

### List Branches

```bash
git branch
```

Example output:

```
* feature-x
  main
```

The `*` indicates the current branch (where HEAD is pointing).

### Switching Back

```bash
git switch main
```

Now HEAD points back to `main`. Your working directory updates to match the snapshot at `main`. Git rewrites your files to match that commit. This is why clean commits matter—Git can safely move between states.

### Homestead Example: Creating a Branch for a New Feature

You want to add email alerts to the solar logger. Instead of working directly on `main`, create a branch:

```bash
git switch -c feature/solar-email-alerts
```

Now you're on the new branch. Make your changes, commit them. If something goes wrong or you change your mind, `main` is untouched. When the feature is complete and tested, you can merge it into `main`.

### What Happens When You Switch Branches

When you run `git switch feature-x`, Git:
1. Updates `HEAD` to point to `feature-x`
2. Updates your working directory to match the commit that `feature-x` points to
3. If you have uncommitted changes, Git may refuse to switch (or stash them, depending on the situation)

This is why clean commits matter: Git can safely move your working directory between different commit states. If you have uncommitted changes that conflict with the target branch, Git will warn you.

---

## 3) When to Branch

Branching is cheap in Git. Creating a branch is nearly instantaneous. You should branch whenever you are doing work that is logically separate, experimenting, fixing a bug, or unsure whether the work will be kept.

### New Feature

Example: You want to add a sensor calibration endpoint. Do not build directly on `main`. Instead:

```bash
git switch -c feature/calibration-endpoint
```

Work there. Commit freely. If it fails or changes direction, `main` is unaffected.

### Bug Fix

Example: You discover a voltage rounding bug. Create:

```bash
git switch -c fix/voltage-rounding
```

Fix it. Commit. Merge later.

### Experiment

Branching is ideal for experiments. Example: You want to test a new storage schema, a new logging structure, or a config refactor. Create:

```bash
git switch -c experiment/new-schema
```

If it works, merge it. If it doesn't:

```bash
git switch main
git branch -D experiment/new-schema
```

It disappears. No damage to `main`.

### Homestead Project Examples

Imagine your homestead automation repo. Possible branches:

- `feature/sensor-api-v2` — New API version for sensor data
- `experiment/sqlite-to-mysql` — Testing database migration
- `fix/temperature-validation` — Fixing temperature reading validation
- `config/migration-to-env-vars` — Moving config to environment variables
- `feature/coop-door-automation` — Adding automated coop door control
- `fix/solar-aggregation-dst` — Fixing solar aggregation during DST transitions
- `experiment/mqtt-publisher` — Testing MQTT integration for sensor data

Each represents a logical line of work and a safe sandbox. Branches let you evolve without destabilizing production logic.

### Homestead Example: Coop Door Feature

You want to add automated door opening/closing based on sunrise/sunset. This is a significant feature that will take several commits. Create a branch:

```bash
git switch -c feature/coop-door-automation
```

Work on the feature, commit as you go. If you realize halfway through that the approach won't work, you can abandon the branch and try a different approach on a new branch. `main` stays stable.

### Homestead Example: ESP32 Config Experiment

You want to try switching from ESPHome YAML config to a Python-based config system. This is experimental. Create a branch:

```bash
git switch -c experiment/python-config
```

Try it out. If it works better, merge it. If not, delete the branch and stick with YAML. `main` never sees the experiment.

### Homestead Example: Bug Fix

The fence monitor is reporting incorrect voltage readings. Create a fix branch:

```bash
git switch -c fix/fence-voltage-reading
```

Fix the bug, test it, commit. When you're confident it works, merge into `main`. If the fix causes issues, you can revert just that branch without affecting other work.

---

## 4) main vs Feature Branches

A common structure: `main` → stable, deployable. Feature branches → in-progress work.

### main = Stable Line

By convention, `main` should build, pass tests, and be deployable. You do not experiment directly on `main`. You protect it.

### Feature Branches = Isolated Work

Feature branches may break, may change direction, may be discarded, or may be merged later. They isolate risk.

### Keeping main Clean

Typical workflow:
1. Start on `main`.
2. Create a feature branch.
3. Work and commit.
4. Merge into `main` when complete.
5. Delete the feature branch.

This keeps history organized, logical units grouped, and `main` stable.

### Why This Matters at Scale

If you work alone, branches protect you from yourself. If you work in a team, branches protect everyone from everyone. Without branching discipline, `main` becomes unstable, history becomes chaotic, and debugging becomes painful. With branches, work is parallel, risk is isolated, and history is structured.

### Homestead Example: Maintaining Stability

Your `main` branch has the working solar logger, coop monitor, and fence controller. You want to add a new feature (pig barn temperature monitoring) but you're not sure about the sensor placement or calibration. Work on a branch:

```bash
git switch -c feature/pig-barn-monitoring
```

Develop and test the feature. When it's working and calibrated, merge it into `main`. Until then, `main` stays stable and deployable. If you need to deploy a fix to the solar logger while working on the pig barn feature, you can do so from `main` without affecting your in-progress work.

---

## 5) Understanding Branch Pointers

When you create a branch, Git stores a pointer in `.git/refs/heads/`. For example, `main` is stored as `.git/refs/heads/main`. This file contains the hash of the commit the branch points to. When you commit on that branch, Git updates the pointer file with the new commit hash.

### How Git Knows Which Branch You're On

Git stores the current branch name in `.git/HEAD`. This file contains something like `ref: refs/heads/main` or `ref: refs/heads/feature-x`. When you switch branches, Git updates `HEAD` to point to the new branch.

### Why Pointers Are Efficient

Because branches are just pointers to commits, and commits reference their parent commits, Git can reconstruct the entire history of a branch by following the chain of commits. It doesn't need to store separate copies of files for each branch. If two branches share commits (like `main` and `feature-x` both pointing at C initially), those commits are stored once and referenced by both branches.

---

## 6) Common Branching Patterns

### Feature Branch Pattern

Create a branch for each feature or significant change:

```bash
git switch -c feature/name-of-feature
# work and commit
# merge when done
```

### Fix Branch Pattern

Create a branch for each bug fix:

```bash
git switch -c fix/description-of-bug
# fix and commit
# merge when done
```

### Experiment Branch Pattern

Create a branch for experiments or trials:

```bash
git switch -c experiment/what-youre-testing
# try things
# merge if successful, delete if not
```

### Homestead Example: Multiple Features in Parallel

You're working on three things:
1. Adding humidity sensors to the coop monitor
2. Fixing a bug in the solar aggregation
3. Experimenting with a new MQTT setup

Create three branches:

```bash
git switch -c feature/coop-humidity-sensors
# work on humidity sensors

git switch main
git switch -c fix/solar-aggregation-bug
# fix the bug

git switch main
git switch -c experiment/mqtt-setup
# experiment with MQTT
```

You can switch between branches as needed. Each line of work is isolated. When the bug fix is ready, merge it into `main`. When the humidity feature is complete, merge it. If the MQTT experiment doesn't work out, delete the branch. All without affecting the other work.

### Homestead Example: Switching Between Work Contexts

You're working on the coop door automation feature, but you get a report that the solar logger is broken. You need to fix it immediately. Switch to `main`, create a fix branch:

```bash
git switch main
git switch -c hotfix/solar-logger-crash
# fix the bug, commit, merge to main
```

Then switch back to your feature work:

```bash
git switch feature/coop-door-automation
# continue where you left off
```

Your feature work is exactly as you left it. The hotfix is isolated and can be merged independently. This is the power of branches: context switching without losing work.

---

## 7) Deleting Branches

When a branch is no longer needed, delete it:

```bash
git branch -d feature-x
```

This deletes the branch pointer. The commits still exist in history (until garbage collected), but the branch name is gone. If the branch hasn't been merged, Git will warn you. Use `-D` to force delete:

```bash
git branch -D experiment-failed
```

### When to Delete

Delete feature branches after merging them into `main`. This keeps your branch list clean. Keep `main` and any long-lived branches (like `develop` if you use that pattern). Delete short-lived feature and fix branches once merged.

### Homestead Example: Cleaning Up

You merged the `feature/solar-email-alerts` branch into `main`. The feature is complete and deployed. Delete the branch:

```bash
git branch -d feature/solar-email-alerts
```

The commits are still in `main`'s history, but the branch pointer is gone. Your branch list is cleaner, and you're not confused by old branch names.

### Viewing Branch History

You can see which commits are on a branch:

```bash
git log main
git log feature-x
git log --oneline --graph --all
```

The last command shows all branches in a graph view, making it easy to see how branches diverged and where they might merge.

---

## 8) Common Mistakes and How to Avoid Them

### Mistake: Working Directly on main

**Symptom:** You make changes directly on `main`, commit them, and then realize you should have used a branch.

**Fix:** Create a branch for new work. Even for small changes, branching keeps history clean.

**Prevention:** Make branching a habit. Before starting any work, ask: "Should this be on a branch?" The answer is usually yes.

### Mistake: Forgetting Which Branch You're On

**Symptom:** You make commits thinking you're on a feature branch, but you're actually on `main`.

**Fix:** Check with `git branch` or `git status`. If you committed to the wrong branch, you can move commits (advanced topic covered later).

**Prevention:** Make `git status` a habit. It shows which branch you're on.

### Mistake: Creating Too Many Branches

**Symptom:** You have dozens of branches, many of which are abandoned or merged.

**Fix:** Delete merged branches regularly. Keep only active branches.

**Prevention:** Delete branches after merging. Use descriptive names so you remember what each branch is for.

### Mistake: Not Understanding That Branches Are Pointers

**Symptom:** You think creating a branch copies files, so you avoid branching to save space.

**Fix:** Understand that branches are just pointers. Creating a branch is instant and costs nothing.

**Prevention:** Remember: branches are pointers, not copies. Branch freely.

---

## 9) Review: Branches in One Page

Before moving on, you should be able to state in your own words:

1. **What is a branch?** A movable pointer to a commit. Not a copy of files, just a name that points at a commit.

2. **What is HEAD?** A pointer to the current branch. It tells Git where new commits should go.

3. **How do you create and switch branches?** `git switch -c name` creates and switches; `git switch name` switches to existing branch.

4. **When should you branch?** For any logically separate work: features, fixes, experiments. Branching is cheap, so branch often.

5. **What's the relationship between main and feature branches?** `main` is stable and deployable; feature branches isolate work until it's ready to merge.

If any of these is fuzzy, revisit that section. The next chapter assumes you understand what branches are and how to create and switch between them.

---

## 10) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

Remember from Section A Phase 1 Chapter 1.7: time and state changes. Branches are parallel timelines of state evolution. Each branch represents a different possible future, a different trajectory of the project. Merging later reconciles timelines.

But at this stage, understand: branches are cheap, branches are pointers, and branches enable parallel development.

### The Mental Model Applied

In Section A Phase 1 Chapter 1.7 you learned that state changes over time. With branches, you can have multiple timelines of state evolution happening in parallel. The `main` branch is one timeline—the stable, production timeline. Feature branches are alternate timelines—experiments, fixes, new features. Each timeline evolves independently until you choose to merge them. That is time and state made explicit and parallel.

### Parallel Timelines in Practice

On your homestead, you might have:
- `main` — the stable, deployed system
- `feature/coop-automation` — a new feature being developed
- `fix/solar-bug` — a bug fix being tested
- `experiment/mqtt` — an experiment that might not work out

Each branch is a different timeline. The `main` timeline stays stable while others evolve. When work is ready, you merge that timeline into `main`. If an experiment fails, you delete that timeline. That is the power of branches: multiple futures, one stable present.

---

## Summary

- A branch is a movable pointer to a commit.
- `HEAD` points to the current branch.
- `git branch` creates a branch.
- `git switch` (or `git checkout`) switches branches.
- Feature branches isolate new work.
- `main` remains stable and deployable.
- Branching allows parallel timelines without copying files.

You now understand snapshots (commits), pointers to snapshots (branches), and movement through time. The next chapter shows how to combine parallel timelines through merging.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.5 — Merging and Combining Work** (`Chapter_3.5_Merging.md`).

You will learn how branches come back together, what a merge commit is, what conflicts are and why they happen, and how Git reconciles parallel timelines. You now have multiple timelines. Next, you learn how to combine them safely.
