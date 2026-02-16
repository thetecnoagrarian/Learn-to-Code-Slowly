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

You already know `git merge feature-branch` combines histories and may create a merge commit. Rebase is different.

### What Rebase Does

```bash
git rebase main
```

When run from a feature branch, this means: "Take my commits and replay them on top of main."

Instead of combining two histories with a merge commit, Git:
1. Temporarily removes your feature commits.
2. Moves your branch pointer to the tip of main.
3. Re-applies your commits one by one.

### Visual Comparison

**Before rebase:**

```
A — B — C (main)
         \
          D — E (feature)
```

**After:**

```bash
git checkout feature
git rebase main
```

You get:

```
A — B — C — D' — E'
```

Note:
- D' and E' are new commits.
- They have new hashes.
- History is linear.

### Why Linear History Matters

Linear history is easier to read, avoids merge commits, makes `git log` cleaner, and keeps feature branches appearing as if they were built on the latest main. This can be desirable for clean commit history, small feature branches, and personal workflows.

### Typical Workflow

```bash
git checkout feature
git rebase main
git checkout main
git merge feature
```

If feature is now directly ahead of main, the merge becomes a fast-forward. No merge commit. Clean line.

### Homestead Example: Rebasing a Feature Branch

You've been working on `feature/coop-door-automation` for a week. Meanwhile, `main` has received bug fixes. Before merging your feature, rebase it onto `main`:

```bash
git switch feature/coop-door-automation
git rebase main
```

Now your feature commits are replayed on top of the latest `main`. The history is linear, and when you merge, it will be a fast-forward. The feature appears as if it was built on the latest code from the start.

---

## 2) Understanding "Replaying Commits"

When Git rebases, it doesn't move commits. It creates new commits with the same changes but different hashes. This is why rebase rewrites history.

### What "Replay" Means

Git takes each commit from your feature branch and:
1. Extracts the changes (the diff)
2. Applies those changes on top of the new base (main)
3. Creates a new commit with a new hash

The content is the same, but the commit is new. That's why hashes change.

### Homestead Example: Commit Replay

Your feature branch has:
- Commit D: "Add coop door timer"
- Commit E: "Add sunrise/sunset calculation"

When you rebase onto main, Git:
1. Takes the changes from D and applies them on top of main → creates D'
2. Takes the changes from E and applies them on top of D' → creates E'

D' and E' have the same changes as D and E, but they're new commits with new hashes. D and E still exist in Git's object database until garbage collected, but your branch now points to D' and E'.

---

## 3) Interactive Rebase

Rebase can also modify commits. This is called interactive rebase.

### Basic Command

```bash
git rebase -i HEAD~3
```

Meaning: "Interactively rebase the last 3 commits."

Git opens an editor showing something like:

```
pick abc123 Add validation
pick def456 Fix typo
pick ghi789 Adjust config
```

You can change:
- `pick` → keep as-is
- `squash` → combine with previous commit
- `reword` → edit commit message
- `edit` → pause and modify commit
- `drop` → remove commit entirely

### Squashing Example

Suppose your history looks like:

```
Add sensor API
Fix typo
Fix typo again
```

You want one clean commit. Run:

```bash
git rebase -i HEAD~3
```

Change to:

```
pick abc123 Add sensor API
squash def456 Fix typo
squash ghi789 Fix typo again
```

Git combines them into one commit. Now history reads:

```
Add sensor API
```

Clean. Intentional. Documented.

### Why Use Interactive Rebase?

Common use cases:
- Clean up messy WIP commits.
- Combine small incremental commits.
- Reword unclear commit messages.
- Reorder commits for clarity.
- Remove accidental commits.

Think of it as editing history before publishing it.

### Homestead Example: Cleaning Up Messy Commits

You've been working on `feature/solar-aggregation` and made several commits while experimenting:

```
Add aggregation function
Fix off-by-one
Actually fix it this time
Add logging
Remove debug print
Clean up
```

Before pushing, clean this up:

```bash
git rebase -i main
```

Squash the fix commits and the cleanup commits:

```
pick abc123 Add aggregation function
squash def456 Fix off-by-one
squash ghi789 Actually fix it this time
pick jkl012 Add logging
squash mno345 Remove debug print
squash pqr678 Clean up
```

Result: two clean commits:
- "Add aggregation function with fixes"
- "Add logging for aggregation"

Much cleaner history.

### Homestead Example: Rewording Commit Messages

You have commits with poor messages:

```
fix bug
update stuff
changes
```

Use interactive rebase to reword them:

```bash
git rebase -i HEAD~3
```

Change `pick` to `reword` for each:

```
reword abc123 fix bug
reword def456 update stuff
reword ghi789 changes
```

Git will open an editor for each commit message. Rewrite them:

```
Fix voltage rounding error in solar logger
Update config to use environment variables
Refactor coop door timer for DST handling
```

Now your history is readable and documented.

---

## 4) When to Rebase (and When Not To)

Rebase rewrites history. That is both powerful and dangerous.

### Safe to Rebase

Safe when:
- You are the only one working on the branch.
- The branch has not been pushed.
- No one else has pulled it.
- It is purely local work.

In other words: If no one else depends on the commits, you can reshape them.

### Dangerous to Rebase

Dangerous when:
- The branch has been pushed.
- Other people have pulled it.
- It is shared history.

Why? Because rebase creates new commits. Old commit hashes disappear. New commit hashes replace them. If someone else has the old commits, Git sees two different histories. They now must reconcile rewritten history. This causes confusion and force-push scenarios.

### The Golden Rule

**Never rebase public/shared history.** If others depend on it, do not rewrite it. Use merge instead.

### Why This Matters

In distributed systems, every clone has full history, history is shared truth, and rewriting shared history breaks synchronization. Merge preserves history. Rebase reshapes it. Choose intentionally.

### Homestead Example: Safe Rebase

You're working on `feature/pig-barn-monitoring` locally. You haven't pushed it yet. You made several messy commits while experimenting. Clean them up with interactive rebase:

```bash
git rebase -i main
```

This is safe because no one else has these commits. After cleaning up, push:

```bash
git push -u origin feature/pig-barn-monitoring
```

The remote sees clean history, not your messy development process.

### Homestead Example: Dangerous Rebase

You pushed `feature/coop-automation` to share it with a collaborator. They pulled it and started reviewing. You decide to rebase it onto main to clean up history:

```bash
git rebase main
git push --force
```

Now your collaborator's local copy has different commit hashes. When they try to pull, Git sees diverged history. They must reset or reconcile manually. This is why rebasing shared branches is dangerous.

---

## 5) Recovering from a Rebase Mistake

You will eventually mess up a rebase. Git is safer than it looks.

### `git reflog`

Reflog shows where HEAD has been:

```bash
git reflog
```

Example:

```
abc123 HEAD@{0}: rebase finished
def456 HEAD@{1}: rebase: pick
ghi789 HEAD@{2}: checkout feature
```

Reflog tracks branch movements, rebase operations, and resets. It is your safety net.

### Resetting Back

If you want to undo a rebase, find the commit before rebase in reflog. Then:

```bash
git reset --hard <commit-hash>
```

You are back where you started. As long as you haven't garbage-collected commits, they are recoverable.

### If You Haven't Pushed

If you rebased locally and haven't pushed, you are safe. Just reset. If you already pushed rewritten history, you must coordinate with collaborators. This is why rebasing shared branches is dangerous.

### Homestead Example: Recovering from a Bad Rebase

You rebased `feature/solar-alerts` and something went wrong. The commits don't look right. Check the reflog:

```bash
git reflog
```

You see:

```
abc123 HEAD@{0}: rebase finished
def456 HEAD@{1}: checkout: moving from main to feature/solar-alerts
```

The commit before the rebase was `def456`. Reset to it:

```bash
git reset --hard def456
```

You're back to before the rebase. Try again, or use merge instead.

---

## 6) Merge vs Rebase — Conceptual Contrast

**Merge:**
- Preserves full branch structure.
- Keeps divergence visible.
- Safe for shared branches.
- May create merge commits.

**Rebase:**
- Rewrites commit history.
- Creates linear timeline.
- Clean but destructive.
- Safe only for unpublished work.

Both are valid. Use appropriately.

### When to Choose Merge

Choose merge when:
- The branch is shared or has been pushed.
- You want to preserve the exact history of how work was done.
- You're working in a team where history transparency matters.
- The branch is long-lived or has many commits.

### When to Choose Rebase

Choose rebase when:
- The branch is local and unpublished.
- You want clean, linear history.
- You're cleaning up commits before sharing.
- The branch is small and the rebase will be simple.

### Homestead Example: Choosing Merge

You've been collaborating on `feature/major-refactor` with a teammate. Both of you have pushed commits. When integrating into `main`, use merge:

```bash
git switch main
git merge feature/major-refactor
```

This preserves the history of how you both worked, including when commits were made and by whom. The merge commit shows when the feature was integrated.

### Homestead Example: Choosing Rebase

You've been working locally on `feature/small-fix`—just a few commits fixing a bug. Before pushing, rebase onto main to ensure it's based on the latest code:

```bash
git rebase main
git push -u origin feature/small-fix
```

The history is linear, and when you merge it into `main`, it will be a clean fast-forward.

---

## 7) Advanced: Interactive Rebase Operations

Interactive rebase offers several operations beyond squashing.

### Reordering Commits

You can change the order of commits:

```
pick abc123 Add logging
pick def456 Fix bug
pick ghi789 Add tests
```

Reorder to:

```
pick def456 Fix bug
pick ghi789 Add tests
pick abc123 Add logging
```

This makes logical sense: fix the bug, add tests, then add logging. The history tells a clearer story.

### Editing Commits

Use `edit` to pause and modify a commit:

```
pick abc123 Add sensor
edit def456 Fix calibration
pick ghi789 Add tests
```

Git will pause at the "Fix calibration" commit. You can:
- Modify files
- Stage changes
- Amend the commit: `git commit --amend`
- Continue: `git rebase --continue`

### Dropping Commits

Use `drop` to remove commits entirely:

```
pick abc123 Add sensor
drop def456 Debug commit
pick ghi789 Add tests
```

The debug commit is removed from history.

### Homestead Example: Reordering for Clarity

Your feature branch has:

```
Add humidity sensor
Fix temperature reading bug
Add tests for humidity
Update config
```

Reorder for logical flow:

```
Fix temperature reading bug
Add tests for humidity
Add humidity sensor
Update config
```

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

**Prevention:** Always ensure your working directory is clean before rebasing. Use `git status` to check.

### Mistake: Losing Track of Original Commits

**Symptom:** After rebasing, you realize you need something from the original commits, but they're gone.

**Fix:** Use `git reflog` to find the original commits. They still exist until garbage collected.

**Prevention:** Understand that rebase creates new commits. The originals still exist in the reflog for a while.

### Mistake: Rebasing Too Many Commits

**Symptom:** You try to rebase a branch with 50 commits, and conflicts pile up.

**Fix:** Rebase in smaller chunks, or use merge instead.

**Prevention:** Keep branches small. Rebase frequently (when safe) rather than letting branches diverge significantly.

---

## 9) Homestead Project Examples

### Example: Cleaning Up Before Push

You've been working on `feature/esp32-config-refactor` locally. You have 15 commits, many of which are "WIP" or "fix typo" commits. Before pushing, clean them up:

```bash
git rebase -i main
```

Squash related commits together:
- All the "fix typo" commits → one "Fix typos" commit
- All the "WIP" commits → integrate into the feature commits
- Keep the logical feature commits separate

Result: 5 clean commits instead of 15 messy ones. Push the clean history.

### Example: Rebasing Feature onto Updated Main

You're working on `feature/coop-automation`. `main` has received important bug fixes. Update your feature:

```bash
git switch feature/coop-automation
git rebase main
```

If there are conflicts, resolve them for each commit as Git replays them. Your feature now includes the bug fixes and appears as if it was built on the latest `main`.

### Example: When Not to Rebase

You pushed `feature/major-refactor` to share with a collaborator. They've pulled it and started reviewing. Don't rebase it—use merge instead:

```bash
git switch main
git merge feature/major-refactor
```

This preserves the shared history and doesn't confuse your collaborator.

---

## 10) Review: Rebasing in One Page

Before moving on, you should be able to state in your own words:

1. **What does rebase do?** Replays commits on a new base, creating linear history. Creates new commits with new hashes.

2. **What's interactive rebase?** Allows you to squash, reorder, reword, edit, or drop commits before replaying them.

3. **When is rebase safe?** Only for local, unpublished work. Never for shared branches.

4. **When is rebase dangerous?** When the branch has been pushed or others have pulled it. Rewriting shared history breaks synchronization.

5. **How do you recover from a bad rebase?** Use `git reflog` to find the original state, then `git reset --hard` to that commit.

6. **When should you use rebase vs merge?** Rebase for local cleanup before sharing. Merge for shared branches and preserving history.

If any of these is fuzzy, revisit that section. The next chapter assumes you understand when rebase is safe and how to use it for local history cleanup.

---

## 11) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

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
