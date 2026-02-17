## Section A Phase 3 · Chapter 3.7: Rebasing and History Rewriting

Rebase as alternative to merge; interactive rebase; when and when not to rebase; rewriting shared history.

## Learning Objectives

By the end of this chapter, you should be able to:
- Perform a basic rebase (e.g., rebase a feature branch onto main).
- Explain what "replaying commits" means.
- Use interactive rebase to squash, reorder, reword, or edit commits.
- Identify when rebase is safe and when it is dangerous.
- Avoid rewriting shared history.
- Recover from a mistaken rebase using reflog.

---

## 1) Rebase as an Alternative to Merge

You already know git merge combines histories and may create a merge commit. Rebase is different.

### What Rebase Does

Use git rebase followed by a branch name (usually main). When run from a feature branch, this means: "Take my commits and replay them on top of main."

Instead of combining two histories with a merge commit, Git temporarily removes your feature commits, moves your branch pointer to the tip of main, and re-applies your commits one by one.

### Visual Comparison

**Before rebase:** You have commits A, B, C on main, and your feature branch has commits D and E branching from C.

**After rebase:** Switch to your feature branch, then rebase onto main. You get commits A, B, C, D prime, E prime in a linear sequence.

Note: D prime and E prime are new commits. They have new hashes. History is linear.

### Why Linear History Matters

Linear history is easier to read, avoids merge commits, makes git log cleaner, and keeps feature branches appearing as if they were built on the latest main. This can be desirable for clean commit history, small feature branches, and personal workflows.

### Typical Workflow

Switch to your feature branch, rebase onto main, switch back to main, then merge the feature branch.

If feature is now directly ahead of main, the merge becomes a fast-forward. No merge commit. Clean line.

### Homestead Example: Rebasing a Feature Branch

You've been working on feature/coop-door-automation for a week. Meanwhile, main has received bug fixes. Before merging your feature, rebase it onto main: switch to your feature branch, then rebase onto main.

Now your feature commits are replayed on top of the latest main. The history is linear, and when you merge, it will be a fast-forward. The feature appears as if it was built on the latest code from the start.

---

## 2) Understanding "Replaying Commits"

When Git rebases, it doesn't move commits. It creates new commits with the same changes but different hashes. This is why rebase rewrites history.

### What "Replay" Means

Git takes each commit from your feature branch and extracts the changes (the diff), applies those changes on top of the new base (main), and creates a new commit with a new hash.

The content is the same, but the commit is new. That's why hashes change.

### Homestead Example: Commit Replay

Your feature branch has commit D: "Add coop door timer" and commit E: "Add sunrise/sunset calculation."

When you rebase onto main, Git takes the changes from D and applies them on top of main to create D prime. Then it takes the changes from E and applies them on top of D prime to create E prime.

D prime and E prime have the same changes as D and E, but they're new commits with new hashes. D and E still exist in Git's object database until garbage collected, but your branch now points to D prime and E prime.

---

## 3) Interactive Rebase

Rebase can also modify commits. This is called interactive rebase.

### Basic Command

Use git rebase with the interactive flag followed by a commit reference like HEAD~3. Meaning: "Interactively rebase the last 3 commits."

Git opens an editor showing your commits with actions like pick, squash, reword, edit, or drop.

You can change pick to keep as-is, squash to combine with previous commit, reword to edit commit message, edit to pause and modify commit, or drop to remove commit entirely.

### Squashing Example

Suppose your history looks like: "Add sensor API," "Fix typo," "Fix typo again."

You want one clean commit. Run interactive rebase on the last 3 commits. Change the action for the typo commits from pick to squash.

Git combines them into one commit. Now history reads: "Add sensor API." Clean. Intentional. Documented.

### Why Use Interactive Rebase?

Common use cases: clean up messy WIP commits, combine small incremental commits, reword unclear commit messages, reorder commits for clarity, and remove accidental commits.

Think of it as editing history before publishing it.

### Homestead Example: Cleaning Up Messy Commits

You've been working on feature/solar-aggregation and made several commits while experimenting: "Add aggregation function," "Fix off-by-one," "Actually fix it this time," "Add logging," "Remove debug print," "Clean up."

Before pushing, clean this up using interactive rebase onto main. Squash the fix commits together and the cleanup commits together.

Result: two clean commits—"Add aggregation function with fixes" and "Add logging for aggregation." Much cleaner history.

### Homestead Example: Rewording Commit Messages

You have commits with poor messages: "fix bug," "update stuff," "changes."

Use interactive rebase to reword them: run interactive rebase on the last 3 commits, change pick to reword for each commit.

Git will open an editor for each commit message. Rewrite them: "Fix voltage rounding error in solar logger," "Update config to use environment variables," "Refactor coop door timer for DST handling."

Now your history is readable and documented.

---

## 4) When to Rebase (and When Not To)

Rebase rewrites history. That is both powerful and dangerous.

### Safe to Rebase

Safe when you are the only one working on the branch, the branch has not been pushed, no one else has pulled it, and it is purely local work.

In other words: If no one else depends on the commits, you can reshape them.

### Dangerous to Rebase

Dangerous when the branch has been pushed, other people have pulled it, or it is shared history.

Why? Because rebase creates new commits. Old commit hashes disappear. New commit hashes replace them. If someone else has the old commits, Git sees two different histories. They now must reconcile rewritten history. This causes confusion and force-push scenarios.

### The Golden Rule

**Never rebase public/shared history.** If others depend on it, do not rewrite it. Use merge instead.

### Why This Matters

In distributed systems, every clone has full history, history is shared truth, and rewriting shared history breaks synchronization. Merge preserves history. Rebase reshapes it. Choose intentionally.

### Homestead Example: Safe Rebase

You're working on feature/pig-barn-monitoring locally. You haven't pushed it yet. You made several messy commits while experimenting. Clean them up with interactive rebase onto main.

This is safe because no one else has these commits. After cleaning up, push with upstream tracking. The remote sees clean history, not your messy development process.

### Homestead Example: Dangerous Rebase

You pushed feature/coop-automation to share it with a collaborator. They pulled it and started reviewing. You decide to rebase it onto main to clean up history: rebase onto main, then force push.

Now your collaborator's local copy has different commit hashes. When they try to pull, Git sees diverged history. They must reset or reconcile manually. This is why rebasing shared branches is dangerous.

---

## 5) Recovering from a Rebase Mistake

You will eventually mess up a rebase. Git is safer than it looks.

### git reflog

Reflog shows where HEAD has been. Use git reflog to see a history of where HEAD has been, including rebase operations and resets. It is your safety net.

### Resetting Back

If you want to undo a rebase, find the commit before rebase in reflog. Then reset hard to that commit hash.

You are back where you started. As long as you haven't garbage-collected commits, they are recoverable.

### If You Haven't Pushed

If you rebased locally and haven't pushed, you are safe. Just reset. If you already pushed rewritten history, you must coordinate with collaborators. This is why rebasing shared branches is dangerous.

### Homestead Example: Recovering from a Bad Rebase

You rebased feature/solar-alerts and something went wrong. The commits don't look right. Check the reflog using git reflog.

You see entries showing when the rebase finished and when you checked out the feature branch. The commit before the rebase is visible in the reflog. Reset hard to that commit.

You're back to before the rebase. Try again, or use merge instead.

---

## 6) Merge vs Rebase — Conceptual Contrast

**Merge:** Preserves full branch structure, keeps divergence visible, safe for shared branches, may create merge commits.

**Rebase:** Rewrites commit history, creates linear timeline, clean but destructive, safe only for unpublished work.

Both are valid. Use appropriately.

### When to Choose Merge

Choose merge when the branch is shared or has been pushed, you want to preserve the exact history of how work was done, you're working in a team where history transparency matters, or the branch is long-lived or has many commits.

### When to Choose Rebase

Choose rebase when the branch is local and unpublished, you want clean, linear history, you're cleaning up commits before sharing, or the branch is small and the rebase will be simple.

### Homestead Example: Choosing Merge

You've been collaborating on feature/major-refactor with a teammate. Both of you have pushed commits. When integrating into main, use merge: switch to main, then merge the feature branch.

This preserves the history of how you both worked, including when commits were made and by whom. The merge commit shows when the feature was integrated.

### Homestead Example: Choosing Rebase

You've been working locally on feature/small-fix—just a few commits fixing a bug. Before pushing, rebase onto main to ensure it's based on the latest code: rebase onto main, then push with upstream tracking.

The history is linear, and when you merge it into main, it will be a clean fast-forward.

---

## 7) Advanced: Interactive Rebase Operations

Interactive rebase offers several operations beyond squashing.

### Reordering Commits

You can change the order of commits in the interactive rebase editor. For example, you might have commits for adding logging, fixing a bug, and adding tests. Reorder them so the bug fix comes first, then tests, then logging.

This makes logical sense: fix the bug, add tests, then add logging. The history tells a clearer story.

### Editing Commits

Use edit to pause and modify a commit. Git will pause at that commit. You can modify files, stage changes, amend the commit, then continue the rebase.

### Dropping Commits

Use drop to remove commits entirely. The commit is removed from history.

### Homestead Example: Reordering for Clarity

Your feature branch has commits: "Add humidity sensor," "Fix temperature reading bug," "Add tests for humidity," "Update config."

Reorder for logical flow: "Fix temperature reading bug," "Add tests for humidity," "Add humidity sensor," "Update config."

Now the history reads: fix bug, add tests, add feature, update config. That's a clearer narrative.

---

## 8) Common Mistakes and How to Avoid Them

### Mistake: Rebasing Shared Branches

**Symptom:** You rebase a branch that others have pulled, causing confusion and diverged history.

**Fix:** If you haven't force-pushed yet, don't. If you have, communicate immediately and help collaborators reconcile.

**Prevention:** Never rebase branches that have been pushed and pulled by others. Use merge for shared branches.

### Mistake: Rebasing During Active Development

**Symptom:** You rebase while you have uncommitted changes, causing conflicts or lost work.

**Fix:** Commit or stash your changes first, then rebase.

**Prevention:** Always ensure your working directory is clean before rebasing. Use git status to check.

### Mistake: Losing Track of Original Commits

**Symptom:** After rebasing, you realize you need something from the original commits, but they're gone.

**Fix:** Use git reflog to find the original commits. They still exist until garbage collected.

**Prevention:** Understand that rebase creates new commits. The originals still exist in the reflog for a while.

### Mistake: Rebasing Too Many Commits

**Symptom:** You try to rebase a branch with 50 commits, and conflicts pile up.

**Fix:** Rebase in smaller chunks, or use merge instead.

**Prevention:** Keep branches small. Rebase frequently (when safe) rather than letting branches diverge significantly.

---

## 9) Homestead Project Examples

### Example: Cleaning Up Before Push

You've been working on feature/esp32-config-refactor locally. You have 15 commits, many of which are "WIP" or "fix typo" commits. Before pushing, clean them up using interactive rebase onto main.

Squash related commits together: all the "fix typo" commits become one "Fix typos" commit, all the "WIP" commits integrate into the feature commits, and keep the logical feature commits separate.

Result: 5 clean commits instead of 15 messy ones. Push the clean history.

### Example: Rebasing Feature onto Updated Main

You're working on feature/coop-automation. main has received important bug fixes. Update your feature: switch to your feature branch, then rebase onto main.

If there are conflicts, resolve them for each commit as Git replays them. Your feature now includes the bug fixes and appears as if it was built on the latest main.

### Example: When Not to Rebase

You pushed feature/major-refactor to share with a collaborator. They've pulled it and started reviewing. Don't rebase it—use merge instead: switch to main, then merge the feature branch.

This preserves the shared history and doesn't confuse your collaborator.

---

## 10) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time, and that we can observe and name those transitions. With rebase, you're not just observing time—you're reshaping it.

Rebase takes commits (named states) and replays them in a different order or on a different base, creating new named states. The original states still exist until garbage collected, but your branch points to the new ones. This is time made malleable—but only when safe (local, unpublished work).

Merge preserves the true timeline. Rebase creates an alternate timeline. Both are valid, but rebase is powerful and must be used with discipline. Never reshape time that others depend on.

---

## Summary

- Rebase replays commits on a new base, creating linear history.
- Interactive rebase allows squashing, reordering, editing, and dropping commits.
- Rebase is safe only for local, unpublished work.
- Never rebase shared/public history.
- Use reflog to recover from mistakes.
- Choose merge for shared branches, rebase for local cleanup.

You now understand controlled history rewriting. The next chapter shows how to temporarily set aside work without committing.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.8 — Stashing and Temporary State** (`Chapter_3.8_Stashing.md`).

You will learn how to temporarily set aside uncommitted changes, how stash interacts with the three-area model, and how to move between tasks without committing incomplete work. You now understand permanent history (commits) and controlled rewriting (rebase). Next, you learn temporary state management (stash).
