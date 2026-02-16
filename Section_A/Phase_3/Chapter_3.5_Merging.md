## Section A Phase 3 · Chapter 3.5: Merging and Combining Work

Merging branches; fast-forward vs merge commits; resolving conflicts; when merge is appropriate.

## Learning Objectives

By the end of this chapter, you should be able to:
- Merge one branch into another using `git merge`.
- Distinguish fast-forward merges from merge commits.
- Resolve merge conflicts safely and correctly.
- Decide when merging is appropriate (vs rebasing, covered next).

---

## 1) Merging Branches

You now understand that a branch is a pointer and that branches let you work in parallel. Eventually, those parallel timelines must come back together. That's what merging does.

### What `git merge` Does

`git merge <branch>` incorporates the commits from another branch into the current branch.

**Important:** You merge into the branch you are currently on. So if you want to merge a feature branch into `main`, the typical flow is:

```bash
git switch main
git merge feature-branch
```

You are telling Git: "Take the work from feature-branch and integrate it into main."

### Typical Merge Workflow

1. Finish work on a feature branch.
2. Switch to `main`: `git switch main`
3. Merge the feature branch: `git merge feature-x`
4. Delete the feature branch (optional but common): `git branch -d feature-x`

After a successful merge:
- The `main` branch pointer moves.
- The feature branch may remain or be deleted.
- The history now includes the feature branch's commits.

### Homestead Example: Merging a Feature

You've been working on a branch `feature/coop-door-automation` that adds automated door opening/closing based on sunrise/sunset. The feature is complete and tested. Now merge it into `main`:

```bash
git switch main
git merge feature/coop-door-automation
```

If there are no conflicts, Git merges the branch. The `main` branch now includes all the commits from the feature branch. You can delete the feature branch:

```bash
git branch -d feature/coop-door-automation
```

The feature is now part of `main`, and the branch pointer is gone (though the commits remain in history).

---

## 2) Fast-Forward vs Merge Commit

Not all merges are the same. Git chooses between fast-forward merge and merge commit. The difference depends on history.

### Fast-Forward Merge

**Scenario:**

```
A — B — C   (main)
          \
           D — E   (feature)
```

If `main` has not changed since the branch was created, merging is simple. When you run:

```bash
git switch main
git merge feature
```

Git can just move `main` forward:

```
A — B — C — D — E
                      ↑
                    main
```

No new commit is created. `main` simply "fast-forwards" to the tip of `feature`. This is a fast-forward merge.

### Merge Commit

Now imagine:

```
A — B — C — F   (main)
          \
           D — E   (feature)
```

Both branches have new commits. Histories have diverged. When you merge:

```bash
git switch main
git merge feature
```

Git cannot just move the pointer. It must create a new commit that combines both lines of history:

```
A — B — C — F — M
          \      /
           D — E
```

M is a merge commit. It has two parents, a combined state, and a record that histories were merged.

### Homestead Example: Fast-Forward Merge

You created `feature/solar-email-alerts` from `main` when `main` was at commit C. You worked on the feature, made commits D and E. Meanwhile, `main` stayed at C (no one else was working on it). When you merge:

```bash
git switch main
git merge feature/solar-email-alerts
```

Git fast-forwards: `main` moves from C to E. No merge commit needed because `main` didn't diverge.

### Homestead Example: Merge Commit

You created `feature/pig-barn-monitoring` from `main` at commit C. You made commits D and E on the feature branch. Meanwhile, someone (or you on another machine) merged a bug fix into `main`, creating commit F. Now when you merge:

```bash
git switch main
git merge feature/pig-barn-monitoring
```

Git creates a merge commit M that combines both lines. The history shows that `main` had commit F, the feature branch had D and E, and they were merged at M.

### Forcing a Merge Commit

Sometimes teams prefer explicit merge commits even if fast-forward is possible. You can force it:

```bash
git merge --no-ff feature
```

This ensures a visible merge point in history and clear grouping of feature work. This is common in structured team workflows.

---

## 3) Resolving Conflicts

Merging is easy—until it isn't. Conflicts happen when both branches modify the same file and the same lines in that file in incompatible ways. Git cannot decide which version is correct, so it stops and asks you.

### What a Conflict Looks Like

Git marks the file like this:

```
<<<<<<< HEAD
console.log("Main branch version");
=======
console.log("Feature branch version");
>>>>>>> feature-x
```

Meaning:
- `HEAD` = current branch (e.g., `main`)
- Below the `=======` = incoming branch

Git is saying: "You decide what the correct version is."

### How to Resolve a Conflict

1. Open the conflicted file.
2. Edit the file manually:
   - Choose one version.
   - Or combine both.
   - Remove conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
3. Save the file.
4. Stage the resolved file: `git add path/to/file`
5. Complete the merge: `git commit`

Git creates the merge commit.

### Homestead Example: Resolving a Conflict

You're merging `feature/coop-door-automation` into `main`. Both branches modified `config.json`:

**On `main`:**
```json
{
  "coop_door": {
    "open_time": "06:00",
    "close_time": "18:00"
  }
}
```

**On `feature/coop-door-automation`:**
```json
{
  "coop_door": {
    "open_time": "sunrise",
    "close_time": "sunset",
    "auto_mode": true
  }
}
```

Git shows a conflict. You resolve it by combining both changes:

```json
{
  "coop_door": {
    "open_time": "sunrise",
    "close_time": "sunset",
    "auto_mode": true
  }
}
```

Stage the file and commit to complete the merge.

### Homestead Example: Conflict in Python Code

Both `main` and `feature/solar-aggregation` modified the same function in `solar_logger.py`. The conflict shows:

```
<<<<<<< HEAD
def calculate_daily_total(readings):
    return sum(r.value for r in readings)
=======
def calculate_daily_total(readings):
    # Filter out invalid readings
    valid = [r for r in readings if r.value > 0]
    return sum(r.value for r in valid)
>>>>>>> feature/solar-aggregation
```

You decide the feature branch's version is better (it filters invalid readings). You keep that version, remove the conflict markers, stage, and commit.

### Avoiding Conflicts

Conflicts are not evil. They are normal. But you can reduce them:
- Merge frequently.
- Keep branches small.
- Avoid long-lived feature branches.
- Avoid editing the same large shared file unnecessarily.
- Establish file ownership in teams.

Small, frequent integration reduces pain.

### Homestead Example: Reducing Conflicts

Instead of working on `feature/major-refactor` for weeks, break it into smaller branches:
- `feature/refactor-solar-logger`
- `feature/refactor-coop-monitor`
- `feature/refactor-fence-controller`

Merge each when complete. Conflicts are smaller and easier to resolve. If one refactor causes issues, you can revert just that part.

---

## 4) When Merge Is Appropriate

Merging is safe, history-preserving, and appropriate for shared branches.

### Good Use Cases for Merge

- Integrating a completed feature branch into `main`.
- Bringing updates from `main` into your feature branch.
- Working in a team where history transparency matters.
- Public/shared branches.

Merge preserves the true timeline, does not rewrite history, and is safe for branches others may have pulled.

### Homestead Example: Merging Feature into Main

You completed `feature/coop-door-automation`. It's tested and ready. Merge it into `main`:

```bash
git switch main
git merge feature/coop-door-automation
```

The history shows when the feature was integrated. If something breaks later, you can see exactly when it was merged and what commits were included.

### Homestead Example: Updating Feature Branch from Main

You're working on `feature/pig-barn-monitoring`, but `main` has received important bug fixes. Update your feature branch:

```bash
git switch feature/pig-barn-monitoring
git merge main
```

Now your feature branch includes the bug fixes. When you merge the feature back into `main`, it will already include those fixes, reducing conflicts.

### Homestead Example: Three-Way Merge Scenario

You have:
- `main` at commit F (includes bug fix)
- `feature/coop-automation` branched from C, now at E
- `feature/solar-alerts` branched from C, now at D

You merge `feature/coop-automation` into `main` first:

```bash
git switch main
git merge feature/coop-automation
```

This creates merge commit M1 combining F and E. Now `main` is at M1. Then merge `feature/solar-alerts`:

```bash
git merge feature/solar-alerts
```

This creates merge commit M2 combining M1 and D. The history shows both features were integrated, and the order is preserved. Each merge is independent and can be tested separately.

### When Not to Merge (Preview of Rebase)

If you are cleaning up local commits, preparing unpublished work, or simplifying your commit history before sharing, you may use `git rebase` (next chapter).

**Important rule:** Never rebase public history that others rely on. Merging is safe for shared history. Rebasing is powerful for local cleanup. You'll learn the difference next.

---

## 5) Understanding Merge Results

After a merge, your working directory reflects the combined state of both branches. All files from both branches are present. If a file existed in only one branch, it's added. If a file was modified in both, Git combines the changes (or shows a conflict if they overlap).

### Homestead Example: Files Added in Feature Branch

Your `feature/coop-door-automation` branch added a new file `coop_scheduler.py` that didn't exist in `main`. After merging, `main` now includes that file. The merge commit includes the new file in its snapshot.

### Homestead Example: Files Modified in Both Branches

Both `main` and `feature/solar-aggregation` modified `solar_logger.py`. Git combines the changes. If they modified different parts of the file, Git includes both changes. If they modified the same lines, Git shows a conflict for you to resolve.

### Understanding Merge Success

After a successful merge (no conflicts), Git automatically creates the merge commit. You don't need to run `git commit` separately—Git does it for you. The merge commit message is auto-generated (you can edit it if needed).

If there are conflicts, Git stops and waits for you to resolve them. You must stage the resolved files and then run `git commit` to complete the merge. Git will not create the merge commit until all conflicts are resolved.

---

## 6) Common Mistakes and How to Avoid Them

### Mistake: Merging into the Wrong Branch

**Symptom:** You merge `main` into your feature branch when you meant to merge the feature into `main`.

**Fix:** Check which branch you're on with `git branch` or `git status`. Merge into the target branch (usually `main`).

**Prevention:** Always switch to the target branch first: `git switch main`, then `git merge feature-x`.

### Mistake: Not Resolving Conflicts Completely

**Symptom:** You edit the conflicted file but forget to stage it, so the merge isn't complete.

**Fix:** After editing, stage the file (`git add`) and commit (`git commit`).

**Prevention:** Git will remind you if the merge isn't complete. Check `git status` to see if there are unresolved conflicts.

### Mistake: Deleting Branch Before Verifying Merge

**Symptom:** You delete the feature branch immediately after merging, then realize the merge had issues.

**Fix:** Test the merge before deleting the branch. If you already deleted it, you can recover it from the reflog (advanced topic).

**Prevention:** Test the merge, verify everything works, then delete the branch.

### Mistake: Merging Too Late

**Symptom:** Your feature branch diverged significantly from `main`, causing many conflicts.

**Fix:** Resolve conflicts carefully, or consider rebasing (next chapter) if the branch hasn't been shared.

**Prevention:** Merge frequently. Update your feature branch from `main` regularly to keep it in sync.

### Mistake: Abandoning a Merge Mid-Resolution

**Symptom:** You start a merge, see conflicts, and get overwhelmed. You close your editor without resolving.

**Fix:** You can abort the merge: `git merge --abort`. This returns you to the state before the merge started.

**Prevention:** If conflicts are overwhelming, abort the merge, break the work into smaller pieces, or update your branch from `main` first to reduce divergence.

---

## 7) Homestead Project Examples

### Example: Merging Multiple Features

You have three feature branches ready to merge:
- `feature/solar-email-alerts`
- `feature/coop-door-automation`
- `fix/fence-voltage-reading`

Merge them one at a time:

```bash
git switch main
git merge feature/solar-email-alerts
# test, verify it works

git merge feature/coop-door-automation
# test, verify it works

git merge fix/fence-voltage-reading
# test, verify it works
```

Each merge is independent. If one causes issues, you can revert just that merge without affecting the others.

### Example: Conflict Resolution

You're merging `feature/pig-barn-monitoring` into `main`. Both modified `config.json`:

**Conflict:**
```
<<<<<<< HEAD
  "sensors": ["coop", "solar", "fence"]
=======
  "sensors": ["coop", "solar", "fence", "pig_barn"]
>>>>>>> feature/pig-barn-monitoring
```

Resolution: Keep the feature branch's version (it adds the new sensor):

```json
  "sensors": ["coop", "solar", "fence", "pig_barn"]
```

Stage and commit to complete the merge.

### Homestead Example: Complex Conflict Resolution

You're merging `feature/esp32-refactor` into `main`. Both branches modified `fence_controller.py`. The conflict shows:

```
<<<<<<< HEAD
def read_voltage():
    # Old implementation
    return adc.read()
=======
def read_voltage():
    # New implementation with calibration
    raw = adc.read()
    calibrated = apply_calibration(raw)
    return calibrated
>>>>>>> feature/esp32-refactor
```

You want the new implementation (it includes calibration), but you also notice the old implementation had a comment about a known issue. You combine both:

```python
def read_voltage():
    # New implementation with calibration
    # Note: old implementation had known issue with uncalibrated readings
    raw = adc.read()
    calibrated = apply_calibration(raw)
    return calibrated
```

This preserves context while keeping the improved code. Stage and commit to complete the merge.

Stage and commit to complete the merge.

---

## 8) Advanced: Understanding Merge Strategies

Git uses different strategies for merging depending on the situation. The default strategy is "recursive" for normal merges. Understanding this helps you predict merge behavior.

### Recursive Merge Strategy

When branches have diverged, Git uses a three-way merge:
- Base: the common ancestor commit
- Ours: the current branch (where you're merging into)
- Theirs: the branch you're merging in

Git compares all three to determine what changed and how to combine them. If changes don't overlap, Git includes both. If they overlap and conflict, Git asks you to resolve.

### Homestead Example: Three-Way Merge

You have:
- Base (C): Original code
- Ours (main at F): Added logging
- Theirs (feature at E): Added error handling

Git sees:
- Main added logging (new code, doesn't conflict)
- Feature added error handling (new code, doesn't conflict)
- Both modified the same function signature (conflict)

Git automatically includes the logging and error handling, but asks you to resolve the function signature conflict.

---

## 9) Review: Merging in One Page

Before moving on, you should be able to state in your own words:

1. **What does merge do?** Combines commits from one branch into another. You merge into the branch you're currently on.

2. **What's a fast-forward merge?** When the target branch hasn't diverged, Git just moves the pointer forward. No merge commit needed.

3. **What's a merge commit?** When branches have diverged, Git creates a new commit with two parents that combines both histories.

4. **What are conflicts?** When both branches modified the same lines differently. You must manually resolve by choosing or combining the changes.

5. **When should you merge?** For integrating completed features, updating feature branches from main, and any shared/public branches.

6. **How do you resolve conflicts?** Edit the conflicted file, remove conflict markers, choose or combine changes, stage the file, and commit.

If any of these is fuzzy, revisit that section. The next chapter assumes you understand how to merge branches and resolve conflicts.

---

## 9) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time, and that we can observe and name those transitions. With branches, you created parallel timelines. With merging, you reconcile those timelines back into one.

A merge commit is a named transition that combines two states into one. It records that two lines of development came together. The history shows not just what changed, but how parallel work was integrated.

This is Section A Phase 1 (Time and State Changes) applied to parallel development: multiple timelines evolving independently, then converging through explicit merge points. Time becomes not just linear, but branching and merging.

---

## Summary

- `git merge` combines histories from one branch into another.
- If no divergence → fast-forward (just move pointer).
- If divergence → merge commit (create new commit with two parents).
- Conflicts occur when the same lines change differently.
- Resolve conflicts by editing, staging, committing.
- Use merge for integrating branches and shared history.
- Merge preserves full history safely.

You now understand parallel timelines (branches) and reconciliation (merge). The next chapter shows how to connect local repositories across machines through remotes.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.6 — Remotes and Collaboration** (`Chapter_3.6_Remotes_and_Collaboration.md`).

You will learn what a remote is, what origin means, `git push` and `git pull`, and how distributed history becomes collaborative history. You now understand local parallel timelines and how to merge them. Next, you connect them across machines.
