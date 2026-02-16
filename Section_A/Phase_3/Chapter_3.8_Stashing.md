## Section A Phase 3 · Chapter 3.8: Stashing and Temporary State

`git stash`; when to stash; applying and popping; managing work-in-progress.

## Learning Objectives

By the end of this chapter, you should be able to:
- Use `git stash` to temporarily save uncommitted changes.
- Apply or pop a stash to restore work.
- Decide when stashing is appropriate and when a branch is better.
- Manage multiple stashes safely.
- Understand how stash fits into the three-area mental model.

---

## 1) What `git stash` Does

Sometimes you are in the middle of work: files modified, maybe some staged, not ready to commit, but you need to switch tasks immediately. Git normally prevents you from switching branches if your changes would conflict. `git stash` solves this.

### Conceptually

A stash is a temporary snapshot of your working directory and staging area. When you run `git stash`, Git:
1. Saves your current working directory changes.
2. Saves your staged changes.
3. Restores your working directory to match the last commit.
4. Leaves you with a clean working tree.

It is like saying: "Put this aside for now. I'll come back to it."

### Important Properties

- Stashes are local only.
- They are not pushed to remotes.
- They are not part of normal commit history.
- They live inside your repository's metadata.

They are temporary state, not project history.

### Basic Commands

Save changes:

```bash
git stash
# or
git stash push
```

View saved stashes:

```bash
git stash list
```

You'll see something like:

```
stash@{0}: WIP on feature-branch: abc123 Add validation
stash@{1}: WIP on main: def456 Update config
```

Each stash has an index number.

### Homestead Example: Quick Context Switch

You're working on the coop door automation feature, editing `coop_door.py` and `config.json`. You're halfway through a refactor when you get an urgent message: the solar logger is crashing on the production server. You need to switch to `main` and fix it immediately.

Stash your work:

```bash
git stash
```

Your working directory is now clean. Switch to `main`, fix the solar logger, commit, then return to your feature:

```bash
git switch main
# fix the bug, commit
git switch feature/coop-automation
git stash pop
```

Your coop door work is exactly as you left it.

---

## 2) Applying and Popping

Once your urgent task is complete, you want your work back. There are two primary ways.

### `git stash pop`

```bash
git stash pop
```

This:
1. Applies the most recent stash.
2. Removes it from the stash list.

Think: "Restore and discard." If it applies cleanly, your working directory returns to the previous state.

### `git stash apply`

```bash
git stash apply
```

This applies the stash but keeps it in the stash list. Useful when you want to try applying it, you may need to reapply, or you are uncertain about conflicts.

You can also apply a specific stash:

```bash
git stash apply stash@{1}
```

### Conflicts Can Happen

If the branch changed while your stash was saved, you may get merge conflicts. Resolve them just like merge conflicts:
- Edit file.
- Remove conflict markers.
- `git add`
- Continue working.

Stash is not magic—it replays changes onto your current state.

### Homestead Example: Stash Conflicts

You stashed work on `feature/coop-automation`. While you were fixing the solar logger bug, someone (or you on another machine) merged changes into `feature/coop-automation` that modified the same files. When you pop the stash:

```bash
git stash pop
```

Git shows conflicts in `coop_door.py`. You resolve them:

```
<<<<<<< Updated upstream
def open_door():
    # New implementation
=======
def open_door():
    # Your stashed changes
>>>>>>> Stashed changes
```

You combine both changes, stage the file, and continue. The stash is removed after popping.

---

## 3) When to Stash

Stash is for short-term context switching. Not for long-term storage.

### Scenario 1 — Switching Branches

You are on `feature-sensor-api`. You've modified several files. Suddenly: "We need a hotfix on main." You cannot switch because changes would be overwritten.

Solution:

```bash
git stash
git checkout main
```

Do the hotfix. Commit it. Then:

```bash
git checkout feature-sensor-api
git stash pop
```

Your work returns.

### Scenario 2 — Pulling Remote Changes

You have local edits. You try `git pull`. Git refuses due to conflicts.

Solution:

```bash
git stash
git pull
git stash pop
```

Now you integrate your changes on top of updated code.

### Scenario 3 — Quick Fix on main

You're mid-feature. Someone asks: "Can you quickly update the config file?" Stash. Switch. Fix. Commit. Return. Pop. Context preserved.

### Homestead Example: Pulling Updates

You're working on `feature/pig-barn-monitoring` with uncommitted changes. You need to pull the latest from `main`:

```bash
git stash
git pull origin main
git stash pop
```

Your uncommitted changes are reapplied on top of the updated code. If there are conflicts, resolve them as you would for a merge.

### Homestead Example: Emergency Fix

You're in the middle of refactoring the solar logger. Suddenly the fence monitor stops working. Stash your refactor work:

```bash
git stash -m "Solar logger refactor in progress"
git switch main
# fix fence monitor, commit
git switch feature/solar-refactor
git stash pop
```

Your refactor work is restored exactly as you left it.

### When Not to Stash

Do not use stash when:
- Work will last days.
- You want versioned history.
- You need collaboration.
- The state is complex and fragile.

Instead: Create a branch and commit normally. Stash is for temporary parking. Branches are for real work.

### Homestead Example: When to Use a Branch Instead

You're working on a major refactor of the ESP32 controller that will take several days. Don't stash it—create a branch:

```bash
git switch -c feature/esp32-refactor
# work and commit as you go
```

Stash is for "I'll be back in 10 minutes." Branches are for "This is real work that deserves commits."

---

## 4) Managing Stashes

You can have multiple stashes.

### List Stashes

```bash
git stash list
```

Each entry has an index (`stash@{n}`), a branch reference, and a commit message snapshot.

### Drop a Stash

Remove one:

```bash
git stash drop stash@{1}
```

Remove most recent:

```bash
git stash drop
```

### Clear All Stashes

```bash
git stash clear
```

Be careful—this removes all temporary states.

### Stash With a Message

You can label stashes:

```bash
git stash push -m "half-finished sensor validation"
```

Now `git stash list` shows helpful descriptions. This is useful when juggling multiple temporary states.

### Create a Branch from a Stash

Very useful command:

```bash
git stash branch feature-recovered-work
```

This:
1. Creates a new branch.
2. Applies the stash.
3. Drops the stash.

Use this when you realize the stash is real work, it deserves its own branch, and you want to commit it properly. This is often safer than popping onto a moving branch.

### Homestead Example: Multiple Stashes

You're juggling several tasks:

```bash
git stash list
```

Shows:

```
stash@{0}: WIP on feature/coop-automation: abc123 Add timer
stash@{1}: WIP on feature/solar-alerts: def456 Add email config
stash@{2}: WIP on main: ghi789 Debug logging
```

You can apply a specific stash:

```bash
git stash apply stash@{1}
```

Or create a branch from one:

```bash
git stash branch feature/solar-alerts-continued stash@{1}
```

This creates a branch, applies that stash, and removes it from the list.

### Homestead Example: Stash Messages

You're working on multiple things. Use messages to remember what each stash contains:

```bash
git stash push -m "Coop door DST fix - halfway done"
git stash push -m "Solar aggregation refactor - needs testing"
git stash push -m "Config migration - partial"
```

Now `git stash list` shows:

```
stash@{0}: On feature/config: Config migration - partial
stash@{1}: On feature/solar: Solar aggregation refactor - needs testing
stash@{2}: On feature/coop: Coop door DST fix - halfway done
```

You can see what each stash contains without applying it.

---

## 5) How Stash Fits the Three-Area Model

Recall the three areas:
- Working Directory
- Staging Area
- Repository

Stash temporarily stores working directory changes and staged changes. It does not create a normal commit. It creates a hidden commit-like object internally. Working tree becomes clean. Repository history remains unchanged.

Think of stash as a side shelf next to your workbench—not part of the project archive.

### What Gets Stashed

When you run `git stash`, Git saves:
- Modified tracked files (working directory changes)
- Staged changes (index changes)
- Optionally: untracked files (with `-u` flag)

It does NOT stash:
- Untracked files (by default)
- Ignored files (files in `.gitignore`)

### Homestead Example: Stashing Staged and Unstaged

You have:
- `sensor.py` modified and staged
- `config.json` modified but not staged
- `new_file.py` untracked

When you run `git stash`:
- `sensor.py` changes are stashed (from staging area)
- `config.json` changes are stashed (from working directory)
- `new_file.py` remains (untracked files not stashed by default)

To stash untracked files too:

```bash
git stash -u
# or
git stash --include-untracked
```

---

## 6) Advanced Stash Operations

### Stashing Specific Files

You can stash only specific files:

```bash
git stash push sensor.py config.json
```

Only those files are stashed. Other modified files remain in your working directory.

### Stashing While Keeping Changes

Sometimes you want to stash but keep the changes in your working directory:

```bash
git stash push --keep-index
```

This stashes only unstaged changes. Staged changes remain staged. Useful when you want to test something but keep your staged work.

### Homestead Example: Selective Stashing

You've modified several files:
- `solar_logger.py` (important work, keep it)
- `config.json` (temporary experiment, stash it)
- `test_solar.py` (important work, keep it)

Stash only the config file:

```bash
git stash push config.json
```

Now `solar_logger.py` and `test_solar.py` remain modified, but `config.json` is clean. You can switch branches or pull without affecting your important work.

---

## 7) Common Mistakes and How to Avoid Them

### Mistake: Stashing Instead of Committing

**Symptom:** You stash work that should be committed, then forget about it or lose it.

**Fix:** If work is substantial or will take time, commit it to a branch instead of stashing.

**Prevention:** Use stash for temporary parking (minutes to hours). Use branches and commits for real work (hours to days).

### Mistake: Forgetting About Stashes

**Symptom:** You have old stashes you forgot about, cluttering your stash list.

**Fix:** Review stashes regularly: `git stash list`. Drop or branch from old ones.

**Prevention:** Use stash messages to remember what each stash contains. Clean up stashes when you're done with them.

### Mistake: Popping Onto Wrong Branch

**Symptom:** You pop a stash onto a different branch than where you created it, causing conflicts.

**Fix:** Check which branch you're on before popping. If conflicts occur, resolve them or use `git stash branch` instead.

**Prevention:** Be aware of which branch you stashed from. Consider using `git stash branch` to create a branch from the stash, which is safer.

### Mistake: Stashing Shared Work

**Symptom:** You stash work that others need, but stashes don't push to remotes.

**Fix:** If work needs to be shared, commit it to a branch and push instead of stashing.

**Prevention:** Remember that stashes are local only. If collaboration is needed, use branches.

---

## 8) Homestead Project Examples

### Example: Emergency Hotfix While Mid-Feature

You're working on `feature/coop-automation`. You've made several changes but haven't committed yet. Urgent: the solar logger is down. Stash your work:

```bash
git stash -m "Coop automation - timer logic"
git switch main
# fix solar logger, commit
git switch feature/coop-automation
git stash pop
```

Your coop work is restored. Continue where you left off.

### Example: Pulling Updates with Local Changes

You have uncommitted changes in `sensor_validator.py`. You need to pull updates from `main`:

```bash
git stash
git pull origin main
git stash pop
```

If there are conflicts, resolve them. Your local changes are reapplied on top of the updated code.

### Example: Testing on Clean Working Tree

You want to test your code on a clean working tree, but you have experimental changes you don't want to lose:

```bash
git stash
# run tests
git stash pop
```

Your experimental changes are restored after testing.

### Example: Switching Between Multiple Tasks

You're working on three features simultaneously. Use stashes to switch between them:

```bash
# On feature/coop-automation
git stash push -m "Coop timer work"
git switch feature/solar-alerts
# work on solar alerts
git stash push -m "Solar email config"
git switch feature/pig-barn
# work on pig barn
git stash push -m "Pig barn sensor setup"
```

Switch back to any feature and pop its stash to continue. This lets you context-switch without committing incomplete work.

---

## 9) Review: Stashing in One Page

Before moving on, you should be able to state in your own words:

1. **What does stash do?** Temporarily saves uncommitted changes (working directory and staging area) and restores a clean working tree.

2. **What's the difference between pop and apply?** `pop` applies and removes the stash; `apply` applies but keeps it in the list.

3. **When should you stash?** For short-term context switching (minutes to hours). Not for long-term work (days) or work that needs to be shared.

4. **How does stash fit the three-area model?** Stash saves working directory and staging area changes, but doesn't create a commit. It's temporary storage outside the normal commit history.

5. **How do you manage multiple stashes?** Use `git stash list` to see them, messages to label them, `drop` to remove them, and `branch` to convert them to real branches.

If any of these is fuzzy, revisit that section. The next chapter assumes you understand how to temporarily set aside work with stash.

---

## 10) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time, and that we can observe and name those transitions. Stash is temporary state that hasn't been named yet—it's work in progress that you're not ready to commit.

Stash lets you pause your current state, switch contexts, and return to exactly where you were. It's like bookmarking your place in a book: you're not changing the book (the repository), you're just marking where you are so you can come back. This is state management for work-in-progress—temporary, local, and recoverable.

---

## Summary

- `git stash` saves uncommitted changes and restores a clean working tree.
- `git stash pop` restores and removes; `git stash apply` restores but keeps.
- Use stash for short-term context switches (minutes to hours).
- Use branches for real WIP (hours to days).
- Manage stashes with `list`, `drop`, `clear`, and message labeling.
- Stash is local and temporary—not part of shared history.

You now understand temporary state management in Git. The next chapter shows how to intentionally exclude files from version control.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.9 — Ignoring Files and .gitignore** (`Chapter_3.9_Gitignore.md`).

You will learn how to prevent files from being tracked, how `.gitignore` works, and how to handle logs, environment files, and build artifacts safely. You now understand temporary state (stash). Next, you learn intentional exclusion (`.gitignore`).
