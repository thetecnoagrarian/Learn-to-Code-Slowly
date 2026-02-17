## Section A Phase 3 · Chapter 3.8: Stashing and Temporary State

git stash; when to stash; applying and popping; managing work-in-progress.

## Learning Objectives

By the end of this chapter, you should be able to:
- Use git stash to temporarily save uncommitted changes.
- Apply or pop a stash to restore work.
- Decide when stashing is appropriate and when a branch is better.
- Manage multiple stashes safely.
- Understand how stash fits into the three-area mental model.

---

## 1) What git stash Does

Sometimes you are in the middle of work: files modified, maybe some staged, not ready to commit, but you need to switch tasks immediately. Git normally prevents you from switching branches if your changes would conflict. git stash solves this.

### Conceptually

A stash is a temporary snapshot of your working directory and staging area. When you run git stash, Git saves your current working directory changes, saves your staged changes, restores your working directory to match the last commit, and leaves you with a clean working tree.

It is like saying: "Put this aside for now. I'll come back to it."

### Important Properties

Stashes are local only. They are not pushed to remotes. They are not part of normal commit history. They live inside your repository's metadata.

They are temporary state, not project history.

### Basic Commands

Save changes using git stash or git stash push.

View saved stashes using git stash list. You'll see entries like "WIP on feature-branch" with a commit reference. Each stash has an index number.

### Homestead Example: Quick Context Switch

You're working on the coop door automation feature, editing coop_door.py and config.json. You're halfway through a refactor when you get an urgent message: the solar logger is crashing on the production server. You need to switch to main and fix it immediately.

Stash your work using git stash. Your working directory is now clean. Switch to main, fix the solar logger, commit, then return to your feature branch and pop the stash.

Your coop door work is exactly as you left it.

---

## 2) Applying and Popping

Once your urgent task is complete, you want your work back. There are two primary ways.

### git stash pop

Use git stash pop. This applies the most recent stash and removes it from the stash list.

Think: "Restore and discard." If it applies cleanly, your working directory returns to the previous state.

### git stash apply

Use git stash apply. This applies the stash but keeps it in the stash list. Useful when you want to try applying it, you may need to reapply, or you are uncertain about conflicts.

You can also apply a specific stash by specifying the stash index.

### Conflicts Can Happen

If the branch changed while your stash was saved, you may get merge conflicts. Resolve them just like merge conflicts: edit the file, remove conflict markers, stage the file, then continue working.

Stash is not magic—it replays changes onto your current state.

### Homestead Example: Stash Conflicts

You stashed work on feature/coop-automation. While you were fixing the solar logger bug, someone (or you on another machine) merged changes into feature/coop-automation that modified the same files. When you pop the stash, Git shows conflicts in coop_door.py.

The conflict shows the updated upstream version and your stashed changes. You combine both changes, stage the file, and continue. The stash is removed after popping.

---

## 3) When to Stash

Stash is for short-term context switching. Not for long-term storage.

### Scenario 1 — Switching Branches

You are on feature-sensor-api. You've modified several files. Suddenly: "We need a hotfix on main." You cannot switch because changes would be overwritten.

Solution: stash your changes, switch to main, do the hotfix and commit it, then switch back to your feature branch and pop the stash.

Your work returns.

### Scenario 2 — Pulling Remote Changes

You have local edits. You try to pull. Git refuses due to conflicts.

Solution: stash your changes, pull from remote, then pop the stash.

Now you integrate your changes on top of updated code.

### Scenario 3 — Quick Fix on main

You're mid-feature. Someone asks: "Can you quickly update the config file?" Stash. Switch. Fix. Commit. Return. Pop. Context preserved.

### Homestead Example: Pulling Updates

You're working on feature/pig-barn-monitoring with uncommitted changes. You need to pull the latest from main: stash your changes, pull from origin main, then pop the stash.

Your uncommitted changes are reapplied on top of the updated code. If there are conflicts, resolve them as you would for a merge.

### Homestead Example: Emergency Fix

You're in the middle of refactoring the solar logger. Suddenly the fence monitor stops working. Stash your refactor work with a message like "Solar logger refactor in progress," switch to main, fix the fence monitor and commit, then switch back to your feature branch and pop the stash.

Your refactor work is restored exactly as you left it.

### When Not to Stash

Do not use stash when work will last days, you want versioned history, you need collaboration, or the state is complex and fragile.

Instead: Create a branch and commit normally. Stash is for temporary parking. Branches are for real work.

### Homestead Example: When to Use a Branch Instead

You're working on a major refactor of the ESP32 controller that will take several days. Don't stash it—create a branch and work and commit as you go.

Stash is for "I'll be back in 10 minutes." Branches are for "This is real work that deserves commits."

---

## 4) Managing Stashes

You can have multiple stashes.

### List Stashes

Use git stash list to see all stashes. Each entry has an index, a branch reference, and a commit message snapshot.

### Drop a Stash

Remove a specific stash using git stash drop followed by the stash index. Remove the most recent stash using git stash drop without specifying an index.

### Clear All Stashes

Use git stash clear to remove all stashes. Be careful—this removes all temporary states.

### Stash With a Message

You can label stashes using git stash push with a message flag followed by a description. Now git stash list shows helpful descriptions. This is useful when juggling multiple temporary states.

### Create a Branch from a Stash

Very useful command: use git stash branch followed by a branch name. This creates a new branch, applies the stash, and drops the stash.

Use this when you realize the stash is real work, it deserves its own branch, and you want to commit it properly. This is often safer than popping onto a moving branch.

### Homestead Example: Multiple Stashes

You're juggling several tasks. Use git stash list to see all your stashes. You might see stashes for work on feature/coop-automation, feature/solar-alerts, and main.

You can apply a specific stash by specifying its index. Or create a branch from one using git stash branch followed by a branch name and the stash index.

This creates a branch, applies that stash, and removes it from the list.

### Homestead Example: Stash Messages

You're working on multiple things. Use messages to remember what each stash contains: stash with a message like "Coop door DST fix - halfway done," "Solar aggregation refactor - needs testing," or "Config migration - partial."

Now git stash list shows helpful descriptions. You can see what each stash contains without applying it.

---

## 5) How Stash Fits the Three-Area Model

Recall the three areas: Working Directory, Staging Area, and Repository.

Stash temporarily stores working directory changes and staged changes. It does not create a normal commit. It creates a hidden commit-like object internally. Working tree becomes clean. Repository history remains unchanged.

Think of stash as a side shelf next to your workbench—not part of the project archive.

### What Gets Stashed

When you run git stash, Git saves modified tracked files (working directory changes), staged changes (index changes), and optionally untracked files (with the include-untracked flag).

It does NOT stash untracked files (by default) or ignored files (files in .gitignore).

### Homestead Example: Stashing Staged and Unstaged

You have sensor.py modified and staged, config.json modified but not staged, and new_file.py untracked.

When you run git stash: sensor.py changes are stashed (from staging area), config.json changes are stashed (from working directory), and new_file.py remains (untracked files not stashed by default).

To stash untracked files too, use git stash with the include-untracked flag.

---

## 6) Advanced Stash Operations

### Stashing Specific Files

You can stash only specific files by using git stash push followed by the file names. Only those files are stashed. Other modified files remain in your working directory.

### Stashing While Keeping Changes

Sometimes you want to stash but keep the changes in your working directory. Use git stash push with the keep-index flag.

This stashes only unstaged changes. Staged changes remain staged. Useful when you want to test something but keep your staged work.

### Homestead Example: Selective Stashing

You've modified several files: solar_logger.py (important work, keep it), config.json (temporary experiment, stash it), and test_solar.py (important work, keep it).

Stash only the config file using git stash push followed by the config file name.

Now solar_logger.py and test_solar.py remain modified, but config.json is clean. You can switch branches or pull without affecting your important work.

---

## 7) Common Mistakes and How to Avoid Them

### Mistake: Stashing Instead of Committing

**Symptom:** You stash work that should be committed, then forget about it or lose it.

**Fix:** If work is substantial or will take time, commit it to a branch instead of stashing.

**Prevention:** Use stash for temporary parking (minutes to hours). Use branches and commits for real work (hours to days).

### Mistake: Forgetting About Stashes

**Symptom:** You have old stashes you forgot about, cluttering your stash list.

**Fix:** Review stashes regularly using git stash list. Drop or branch from old ones.

**Prevention:** Use stash messages to remember what each stash contains. Clean up stashes when you're done with them.

### Mistake: Popping Onto Wrong Branch

**Symptom:** You pop a stash onto a different branch than where you created it, causing conflicts.

**Fix:** Check which branch you're on before popping. If conflicts occur, resolve them or use git stash branch instead.

**Prevention:** Be aware of which branch you stashed from. Consider using git stash branch to create a branch from the stash, which is safer.

### Mistake: Stashing Shared Work

**Symptom:** You stash work that others need, but stashes don't push to remotes.

**Fix:** If work needs to be shared, commit it to a branch and push instead of stashing.

**Prevention:** Remember that stashes are local only. If collaboration is needed, use branches.

---

## 8) Homestead Project Examples

### Example: Emergency Hotfix While Mid-Feature

You're working on feature/coop-automation. You've made several changes but haven't committed yet. Urgent: the solar logger is down. Stash your work with a message like "Coop automation - timer logic," switch to main, fix the solar logger and commit, then switch back to your feature branch and pop the stash.

Your coop work is restored. Continue where you left off.

### Example: Pulling Updates with Local Changes

You have uncommitted changes in sensor_validator.py. You need to pull updates from main: stash your changes, pull from origin main, then pop the stash.

If there are conflicts, resolve them. Your local changes are reapplied on top of the updated code.

### Example: Testing on Clean Working Tree

You want to test your code on a clean working tree, but you have experimental changes you don't want to lose: stash your changes, run tests, then pop the stash.

Your experimental changes are restored after testing.

### Example: Switching Between Multiple Tasks

You're working on three features simultaneously. Use stashes to switch between them: on feature/coop-automation, stash with a message like "Coop timer work," switch to feature/solar-alerts, work on solar alerts, stash with a message like "Solar email config," switch to feature/pig-barn, work on pig barn, stash with a message like "Pig barn sensor setup."

Switch back to any feature and pop its stash to continue. This lets you context-switch without committing incomplete work.

---

## 9) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time, and that we can observe and name those transitions. Stash is temporary state that hasn't been named yet—it's work in progress that you're not ready to commit.

Stash lets you pause your current state, switch contexts, and return to exactly where you were. It's like bookmarking your place in a book: you're not changing the book (the repository), you're just marking where you are so you can come back. This is state management for work-in-progress—temporary, local, and recoverable.

---

## Summary

- git stash saves uncommitted changes and restores a clean working tree.
- git stash pop restores and removes; git stash apply restores but keeps.
- Use stash for short-term context switches (minutes to hours).
- Use branches for real WIP (hours to days).
- Manage stashes with list, drop, clear, and message labeling.
- Stash is local and temporary—not part of shared history.

You now understand temporary state management in Git. The next chapter shows how to intentionally exclude files from version control.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.9 — Ignoring Files and .gitignore** (`Chapter_3.9_Gitignore.md`).

You will learn how to prevent files from being tracked, how .gitignore works, and how to handle logs, environment files, and build artifacts safely. You now understand temporary state (stash). Next, you learn intentional exclusion (.gitignore).
