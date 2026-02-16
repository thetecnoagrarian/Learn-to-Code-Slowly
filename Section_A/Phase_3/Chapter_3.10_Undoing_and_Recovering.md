## Section A Phase 3 · Chapter 3.10: Undoing and Recovering

reset (soft, mixed, hard); revert; recovering "lost" commits; safety and discipline.

Undoing in Git is powerful. It is also dangerous. This chapter teaches you how to undo correctly—without destroying history, without panicking, and without harming collaborators. Undoing is not about erasing the past. It is about managing state across time.

## Learning Objectives

By the end of this chapter, you should be able to:
- Use `git reset --soft`, `--mixed`, and `--hard` and understand what each changes.
- Use `git revert` to safely undo commits in shared history.
- Recover seemingly lost commits using `git reflog`.
- Choose reset vs revert based on whether history has been shared.
- Act with discipline when rewriting history.

---

## 1) git reset — Three Modes

`git reset` moves the branch pointer (HEAD). It can also change the staging area (index) and the working directory. Understanding reset requires the three-area model: repository (commits), staging area (index), and working directory. Reset affects these areas differently depending on the mode.

### HEAD and What Reset Really Does

HEAD points to the current branch. The branch points to a commit. When you reset, you move the branch pointer and change what commit is considered "current."

**Example:**

```
A -- B -- C -- D  (main)
                 ↑
                HEAD
```

If you run `git reset C`, now:

```
A -- B -- C  (main)
```

Commit D is no longer pointed to. But it is not immediately deleted. It still exists in history (for now).

### `git reset --soft`

Soft reset:
- Moves HEAD
- Leaves staging area unchanged
- Leaves working directory unchanged

Example: `git reset --soft HEAD~1`. This removes the last commit but keeps all changes staged. It is useful when you want to redo a commit message, combine commits, or committed too early. Your changes are still ready to commit.

### `git reset --mixed` (Default)

Mixed reset:
- Moves HEAD
- Resets staging area
- Leaves working directory unchanged

This is the default: `git reset HEAD~1`. What happens: the last commit disappears, changes become unstaged, files remain modified. This is useful when you committed too early or want to adjust what gets staged. It moves changes back to working state.

### `git reset --hard`

Hard reset:
- Moves HEAD
- Resets staging area
- Resets working directory

Everything becomes exactly like the target commit. Example: `git reset --hard HEAD~1`. This deletes the last commit, discards staged changes, and discards working directory changes. This is destructive.

Use it only when you are certain you do not need those changes, you are cleaning local work, or you have a backup (branch or stash).

### `git reset HEAD~1` vs `git reset <hash>`

`HEAD~1` means the parent of the current commit. You can also reset to a specific commit: `git reset --hard 3f2a9b7`. This moves the branch to that exact commit. Be careful: the further back you reset, the more history you rewrite.

### Danger of `--hard`

`--hard` destroys working state. Before using it, ask: Is this pushed? Is this shared? Do I need this work later? If unsure, create a branch or use `git stash`. Safety first.

### Homestead Example: Soft Reset to Fix Commit Message

You committed with a poor message:

```bash
git commit -m "fix"
```

Fix it with soft reset:

```bash
git reset --soft HEAD~1
```

The commit is gone, but your changes are still staged. Commit again with a better message:

```bash
git commit -m "Fix coop door timer DST calculation"
```

### Homestead Example: Mixed Reset to Restage

You committed changes to `solar_logger.py` and `config.json` together, but you realize they should be separate commits:

```bash
git reset HEAD~1
```

The commit is gone, changes are unstaged. Stage and commit separately:

```bash
git add solar_logger.py
git commit -m "Fix solar aggregation bug"

git add config.json
git commit -m "Update solar config for new sensor"
```

### Homestead Example: Hard Reset (Dangerous)

You made experimental changes that broke everything. You want to discard them completely:

```bash
git reset --hard HEAD~1
```

**Warning:** This destroys your changes. Only do this if you're certain you don't need them. Consider stashing or creating a branch first:

```bash
git stash  # or
git switch -c experiment-backup
git switch main
git reset --hard HEAD~1
```

Now you can recover from the stash or branch if needed.

---

## 2) git revert — Safe Undo for Shared History

`git revert` does not rewrite history. It creates a new commit that undoes another commit. This is critical.

### What Revert Does

**Example history:**

```
A -- B -- C -- D  (main)
```

If commit D introduced a bug:

```bash
git revert D
```

Git creates:

```
A -- B -- C -- D -- E  (main)
```

Where E reverses the changes in D. History remains intact. Nothing is removed.

### Why Revert Is Safe

Revert does not change commit hashes, does not rewrite history, and does not force others to reconcile changes. You can push after revert safely. This makes revert ideal for undoing a bad production change, fixing a mistake already pushed, and maintaining stable public history.

### When to Use Revert

Use revert when the commit is already on remote, others may have pulled it, or you are working on shared branches (main). Golden rule: If others might depend on it, revert—do not reset.

### Homestead Example: Reverting a Bad Deploy

You deployed a change to the solar logger that broke production. The commit is already pushed and deployed:

```bash
git revert <bad-commit-hash>
git push
```

This creates a new commit that undoes the bad change. Production is fixed, history is preserved, and anyone who pulled the bad commit can pull the revert commit. No one needs to reset or reconcile.

### Homestead Example: Reverting Multiple Commits

You need to revert several commits:

```bash
git revert <commit1> <commit2> <commit3>
```

Git creates three revert commits, one for each original commit. History shows what was done and what was undone, maintaining a clear audit trail.

---

## 3) Recovering "Lost" Commits

Sometimes you reset too far. Sometimes you rebase incorrectly. Sometimes you panic. Git has a safety net. That safety net is reflog.

### What reflog Is

`git reflog` shows where HEAD has been and where branch tips have been, even after reset or rebase.

**Example:**

```bash
git reflog
```

Output might show:

```
a1b2c3d HEAD@{0}: reset: moving to HEAD~1
d4e5f6g HEAD@{1}: commit: Added sensor validation
h7i8j9k HEAD@{2}: commit: Initial API setup
```

Even if you reset, the commit hash still exists.

### Recovering After Mistaken Reset

If you accidentally ran `git reset --hard HEAD~3`, you can:

```bash
git reflog
```

Find the old commit hash. Then:

```bash
git reset --hard <hash>
```

Or:

```bash
git checkout -b recovery <hash>
```

You are restored.

### Recovering After Bad Rebase

Same principle. Use reflog. Find commit before rebase. Reset back. Reflog entries expire after ~90 days by default. Git keeps history longer than you think.

### Homestead Example: Recovering Lost Work

You accidentally reset your feature branch:

```bash
git reset --hard HEAD~5
```

You realize you lost important commits. Check reflog:

```bash
git reflog
```

You see:

```
abc123 HEAD@{0}: reset: moving to HEAD~5
def456 HEAD@{1}: commit: Add pig barn monitoring
ghi789 HEAD@{2}: commit: Fix solar aggregation
```

Recover by resetting to the commit before the reset:

```bash
git reset --hard def456
```

Or create a branch from that commit to be safe:

```bash
git switch -c recovered-work def456
```

Your work is restored.

---

## 4) Safety and Discipline

Undoing is powerful. Discipline prevents disaster.

### Prefer Revert for Shared History

If commit is on remote, on main, or pulled by teammates, use `git revert`. Never rewrite shared history casually.

### Use Reset for Local Cleanup

Reset is appropriate when working alone, cleaning local commits, fixing staging mistakes, or preparing branch before push. Once pushed, think carefully.

### Avoid `--hard` Unless Certain

Before `--hard`, stash if unsure, branch if unsure, check reflog after if needed. Never use `--hard` casually.

### Communicate When Rewriting

If you must rewrite shared history, notify team, coordinate force pushes, and ensure others know to reset. Better yet: avoid rewriting shared history.

### Homestead Example: Local vs Shared

**Local cleanup (safe to reset):**

You're working on `feature/coop-automation` locally. You haven't pushed yet. You made a messy commit and want to fix it:

```bash
git reset --soft HEAD~1
# fix the commit, recommit
```

This is safe because no one else has these commits.

**Shared history (use revert):**

You pushed a bug fix to `main` and it's deployed. The fix actually broke something. Use revert:

```bash
git revert <bad-commit>
git push
```

This is safe because it doesn't rewrite history that others depend on.

---

## 5) Reset vs Revert — Quick Comparison

| Command | Rewrites History | Safe for Shared Branch | Removes Commit | Creates New Commit |
|---------|------------------|------------------------|----------------|-------------------|
| reset   | Yes              | No                     | Yes            | No                |
| revert  | No               | Yes                    | No             | Yes               |

Remember: Reset = move pointer backward. Revert = add opposite change forward.

### Homestead Example: Choosing Reset vs Revert

**Scenario 1: Local commit, not pushed**

You committed with a typo in the message. Reset to fix it:

```bash
git reset --soft HEAD~1
git commit -m "Fix coop door timer DST calculation"
```

**Scenario 2: Commit already pushed**

You pushed a commit that breaks production. Revert it:

```bash
git revert <bad-commit>
git push
```

The revert commit fixes production without rewriting history.

---

## 6) Advanced: `git restore`

Modern Git (2.23+) provides `git restore` as a safer alternative to some reset operations.

### Restoring Files

Restore a file from the last commit:

```bash
git restore file.js
```

Restore a file from a specific commit:

```bash
git restore --source=HEAD~2 file.js
```

Restore staged changes (unstage):

```bash
git restore --staged file.js
```

### Why Restore Exists

`git restore` is more explicit than `git reset` for file-level operations. It's clearer that you're restoring a file, not moving branch pointers. Use `restore` for files, `reset` for branch pointers.

### Homestead Example: Restoring a File

You accidentally modified `config.json` and want to discard the changes:

```bash
git restore config.json
```

The file is restored to match the last commit. Your other changes remain untouched.

---

## 7) Common Mistakes and How to Avoid Them

### Mistake: Resetting Shared History

**Symptom:** You reset a commit that others have pulled, causing confusion and diverged history.

**Fix:** If you haven't force-pushed yet, don't. Use revert instead. If you already force-pushed, communicate immediately with collaborators.

**Prevention:** Always check if commits are pushed before resetting. Use revert for shared history.

### Mistake: Using `--hard` Without Backup

**Symptom:** You run `git reset --hard` and lose work you needed.

**Fix:** Check reflog to recover the lost commits.

**Prevention:** Before `--hard`, stash or create a branch. Only use `--hard` when absolutely certain.

### Mistake: Confusing Reset and Revert

**Symptom:** You use reset on shared history or revert on local commits unnecessarily.

**Fix:** Understand the difference: reset rewrites history, revert creates new commits.

**Prevention:** Remember: reset for local, revert for shared. When in doubt, use revert—it's always safe.

### Mistake: Not Checking What Will Be Lost

**Symptom:** You reset without checking what commits will be affected.

**Fix:** Use `git log` to see what commits will be lost. Use `git reflog` to recover if needed.

**Prevention:** Always check `git log` before resetting. Understand what commits will be affected.

---

## 8) Homestead Project Examples

### Example: Fixing a Bad Commit Message

You committed with "fix bug" but want a better message:

```bash
git reset --soft HEAD~1
git commit -m "Fix solar aggregation off-by-one error during DST transitions"
```

The commit is rewritten with a better message.

### Example: Undoing a Deployed Bug

You deployed a change that broke the fence monitor. It's already on `main` and deployed:

```bash
git revert <bad-commit-hash>
git push
```

Production is fixed, history shows what happened and when it was reverted.

### Example: Recovering After Accidental Reset

You accidentally reset too far:

```bash
git reset --hard HEAD~5
```

Check reflog:

```bash
git reflog
```

Find the commit before the reset and recover:

```bash
git reset --hard <old-commit-hash>
```

Or create a branch to be safe:

```bash
git switch -c recovered <old-commit-hash>
```

### Example: Discarding Experimental Changes

You tried a refactor that didn't work. Discard it:

```bash
# First, save it just in case
git stash
# or
git switch -c experiment-backup

# Then reset
git reset --hard HEAD~1
```

If you need it later, recover from stash or the backup branch.

---

## 9) Review: Undoing and Recovering in One Page

Before moving on, you should be able to state in your own words:

1. **What does reset do?** Moves the branch pointer (HEAD) and optionally resets staging area and working directory. Three modes: `--soft` (HEAD only), `--mixed` (HEAD + staging), `--hard` (everything).

2. **What does revert do?** Creates a new commit that undoes a previous commit. Doesn't rewrite history—safe for shared branches.

3. **When should you use reset?** For local, unpublished work. Never for shared history.

4. **When should you use revert?** For shared history, commits that are pushed, or when others might depend on the commits.

5. **How do you recover lost commits?** Use `git reflog` to find where HEAD was, then reset or create a branch from that commit.

6. **What's the danger of `--hard`?** It destroys working directory changes. Only use when certain you don't need them.

If any of these is fuzzy, revisit that section. The next chapter assumes you understand how to undo mistakes safely.

---

## 10) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time, and that we can observe and name those transitions. With reset and revert, you're not just observing time—you're navigating it.

Reset moves your pointer backward in time, changing what state you're at. Revert creates a new state that undoes a previous one, preserving the timeline. Reflog shows you where you've been, so you can return to any previous state. This is time navigation: moving between states, undoing transitions, and recovering from mistakes.

The discipline is knowing when it's safe to rewrite time (local, unpublished) and when you must preserve it (shared, published). That understanding prevents disasters and enables confident experimentation.

---

## Summary

- `git reset` moves HEAD and optionally staging/working tree.
- `--soft`: move HEAD only
- `--mixed`: reset staging (default)
- `--hard`: reset everything (destructive)
- `git revert` creates a new commit that undoes a previous one—safe for shared branches.
- `git reflog` lets you recover "lost" commits.
- Prefer revert for shared history.
- Use reset only for local, unpublished cleanup.
- Avoid `--hard` unless absolutely certain.

Undoing is not destruction. It is time navigation. The next chapter shows how to mark important points in time with tags.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.11 — Tags and Releases** (`Chapter_3.11_Tags_and_Releases.md`).

You will learn how to mark important commits, lightweight vs annotated tags, versioning (v1.0.0), and tagging releases for deployment. You now know how to fix the past. Next, you learn how to name important moments in history.
