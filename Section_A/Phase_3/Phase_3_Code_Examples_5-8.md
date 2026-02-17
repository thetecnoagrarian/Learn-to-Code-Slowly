# Phase 3 Code Examples (Chapters 3.05-3.08)

This file contains visual references for all code examples mentioned in Phase 3 chapters 3.05-3.08. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 3.05: Merging and Combining Work

### 1) Basic Merge Workflow

**Context:** Merging a feature branch into main.

```bash
# Finish work on feature branch
git switch feature/coop-door-automation
# Make commits, test, etc.

# Switch to main
git switch main

# Merge the feature branch
git merge feature/coop-door-automation

# If successful, delete the feature branch
git branch -d feature/coop-door-automation

# Homestead example: Merging completed feature
git switch main
git merge feature/coop-door-automation
# Feature is now part of main
```

---

### 2) Fast-Forward Merge

**Context:** When main hasn't changed since the branch was created.

```bash
# Scenario: main at commit C
# Feature branch created from C, has commits D and E
# main still at C (no new commits)

git switch main
git merge feature/solar-email-alerts
# Git fast-forwards: main moves from C to E
# No merge commit created

# Homestead example: Fast-forward merge
# Created feature/solar-email-alerts from main at commit C
# Made commits D and E on feature branch
# main stayed at C
git switch main
git merge feature/solar-email-alerts
# Fast-forward: main now points to E
```

---

### 3) Merge Commit

**Context:** When both branches have new commits.

```bash
# Scenario: main has commits A, B, C, F
# Feature branch has commits D, E branching from C
# Histories have diverged

git switch main
git merge feature/pig-barn-monitoring
# Git creates merge commit M
# M has two parents: F and E
# History shows both lines merged

# Homestead example: Merge commit
# Created feature/pig-barn-monitoring from main at C
# Made commits D and E on feature branch
# Meanwhile, bug fix merged into main creating commit F
git switch main
git merge feature/pig-barn-monitoring
# Creates merge commit M combining F and E
```

---

### 4) Forcing a Merge Commit

**Context:** Creating explicit merge commits even when fast-forward is possible.

```bash
# Force a merge commit instead of fast-forward
git merge --no-ff feature/solar-email-alerts

# Creates merge commit even if fast-forward is possible
# Useful for team workflows where explicit merge points are preferred

# Homestead example: Explicit merge commit
git switch main
git merge --no-ff feature/coop-door-automation
# Always creates merge commit, even if fast-forward possible
```

---

### 5) Resolving Merge Conflicts

**Context:** When both branches modify the same lines.

```bash
# Start merge
git switch main
git merge feature/coop-door-automation

# Git shows conflict
# Conflict markers in file:
<<<<<<< HEAD
# Version from main (current branch)
fixed_times = ["06:00", "18:00"]
=======
# Version from feature branch
auto_mode = true
sunrise_time = "sunrise"
sunset_time = "sunset"
>>>>>>> feature/coop-door-automation

# Resolve by editing file:
# Keep both changes or choose one
auto_mode = true
sunrise_time = "sunrise"
sunset_time = "sunset"
fixed_times = ["06:00", "18:00"]  # Keep as fallback

# Stage resolved file
git add config.json

# Complete the merge
git commit
# Git creates merge commit

# Homestead example: Resolving config conflict
# Main has fixed times, feature has auto mode
# Resolve by combining both
git add config.json
git commit
# Merge complete
```

---

### 6) Conflict Resolution in Code

**Context:** Resolving conflicts in Python code.

```bash
# Conflict in solar_logger.py
<<<<<<< HEAD
# Main version: simple sum
def calculate_total(readings):
    return sum(readings)
=======
# Feature version: filters invalid readings
def calculate_total(readings):
    valid = [r for r in readings if r > 0]
    return sum(valid)
>>>>>>> feature/solar-aggregation

# Resolve: keep feature version (better)
def calculate_total(readings):
    valid = [r for r in readings if r > 0]
    return sum(valid)

# Stage and commit
git add solar_logger.py
git commit

# Homestead example: Code conflict resolution
# Feature branch version filters invalid readings
# Keep that version, remove conflict markers
git add solar_logger.py
git commit
```

---

### 7) Aborting a Merge

**Context:** Canceling a merge if conflicts are overwhelming.

```bash
# Start merge
git merge feature/major-refactor
# Conflicts appear, too many to resolve now

# Abort the merge
git merge --abort

# Returns to state before merge started
# Working directory restored
# No merge commit created

# Homestead example: Aborting merge
git merge feature/esp32-refactor
# Too many conflicts
git merge --abort
# Back to clean state, can try again later
```

---

### 8) Updating Feature Branch from Main

**Context:** Bringing main's changes into your feature branch.

```bash
# You're on feature branch
git switch feature/pig-barn-monitoring

# Main has new commits (bug fixes)
# Update your feature branch
git merge main

# Now feature branch includes main's changes
# When you merge feature into main later, conflicts reduced

# Homestead example: Syncing feature with main
git switch feature/pig-barn-monitoring
git merge main
# Feature branch now includes bug fixes from main
```

---

## Chapter 3.06: Remotes and Collaboration

### 1) Adding a Remote

**Context:** Connecting local repository to a remote.

```bash
# Add remote named origin
git remote add origin https://github.com/yourusername/homestead-automation.git

# View configured remotes
git remote -v
# Shows:
# origin  https://github.com/yourusername/homestead-automation.git (fetch)
# origin  https://github.com/yourusername/homestead-automation.git (push)

# Homestead example: Setting up remote
git remote add origin https://github.com/thetecnoagrarian/homestead-automation.git
# Now can push and pull
```

---

### 2) Pushing to Remote

**Context:** Sending local commits to remote repository.

```bash
# Push main branch to origin
git push origin main

# Push feature branch
git push origin feature/coop-door-automation

# Set upstream on first push
git push -u origin feature/coop-door-automation
# Now can use: git push (without specifying remote/branch)

# Homestead example: Pushing feature branch
git push -u origin feature/coop-door-automation
# Sets upstream tracking
# Future pushes: just git push
```

---

### 3) Pulling from Remote

**Context:** Getting remote changes into local repository.

```bash
# Pull from origin main
git pull origin main

# This is shorthand for:
# git fetch origin main
# git merge origin/main

# With upstream set, just:
git pull

# Homestead example: Pulling updates
git pull origin main
# Fetches and merges remote changes
```

---

### 4) Push Rejection

**Context:** When remote has commits you don't have.

```bash
# Try to push
git push origin main
# Error: "Updates were rejected because the remote contains work you do not have"

# Solution: pull first
git pull origin main
# Git merges remote changes with your local changes
# Resolve conflicts if any

# Then push
git push origin main

# Homestead example: Push rejection
git push origin main
# Rejected: remote has solar logger fix you don't have
git pull origin main
# Merges solar logger fix with your coop feature
git push origin main
# Now both changes on remote
```

---

### 5) Fetch Without Merging

**Context:** Updating remote-tracking branches without merging.

```bash
# Fetch updates remote-tracking branches
git fetch origin

# Updates origin/main, origin/feature-x, etc.
# Does NOT change your local branches
# Does NOT touch working directory

# Inspect what changed
git log origin/main
# See commits on remote but not local

# Then merge explicitly when ready
git merge origin/main

# Homestead example: Fetch before merge
git fetch origin
# See what's new without merging
git log origin/main
# Review commits
git merge origin/main
# Merge when ready
```

---

### 6) Remote-Tracking Branches

**Context:** Understanding origin/main vs main.

```bash
# After fetch
git fetch origin

# Now you have:
# main - your local branch
# origin/main - what remote's main looks like

# Compare them
git log main..origin/main
# Commits on remote but not local

git log origin/main..main
# Commits on local but not remote

# Homestead example: Comparing branches
git fetch origin
git log main..origin/main
# See what's on remote but not local
```

---

### 7) Multiple Remotes

**Context:** Working with multiple remote repositories.

```bash
# Add GitHub remote
git remote add github https://github.com/user/repo.git

# Add Gitea remote
git remote add gitea https://gitea.local/homestead/repo.git

# Push to specific remote
git push github main
git push gitea main

# Homestead example: Multiple remotes
git remote add github https://github.com/user/homestead.git
git remote add gitea https://gitea.local/homestead/repo.git
# Push to both for backup
```

---

### 8) Viewing Upstream Information

**Context:** Checking which remote a branch tracks.

```bash
# View branch with upstream info
git branch -vv

# Shows:
# * main abc123 [origin/main] Latest commit message
#   feature/coop abc456 [origin/feature/coop] Feature commit

# Shows current commit, tracking branch, sync status

# Homestead example: Checking upstream
git branch -vv
# See which branches track which remotes
```

---

### 9) Pulling Specific Branch

**Context:** Getting a branch from remote that doesn't exist locally.

```bash
# Fetch all branches
git fetch origin

# Create local branch tracking remote branch
git switch -c feature/new-feature origin/feature/new-feature

# Or in one step
git switch -c feature/new-feature --track origin/feature/new-feature

# Homestead example: Getting collaborator's branch
git fetch origin
git switch -c feature/solar-alerts origin/feature/solar-alerts
# Now have local branch tracking remote branch
```

---

## Chapter 3.07: Rebasing and History Rewriting

### 1) Basic Rebase

**Context:** Rebasing feature branch onto updated main.

```bash
# You're on feature branch
git switch feature/coop-door-automation

# Main has new commits (bug fixes)
# Rebase feature onto main
git rebase main

# Git replays your commits on top of main
# Creates new commits with new hashes
# History becomes linear

# Homestead example: Rebasing feature
git switch feature/coop-door-automation
git rebase main
# Feature commits replayed on top of latest main
```

---

### 2) Rebase Result

**Context:** Understanding what rebase creates.

```bash
# Before rebase:
# main: A - B - C - F
# feature:        D - E (branched from C)

# After rebase:
# main: A - B - C - F
# feature:            D' - E' (replayed on F)

# D' and E' are new commits (new hashes)
# Same changes, different base

# Homestead example: Commit replay
# Original commits D and E
# After rebase: D' and E' (new hashes, same changes)
```

---

### 3) Interactive Rebase

**Context:** Modifying commits during rebase.

```bash
# Interactive rebase last 3 commits
git rebase -i HEAD~3

# Editor opens showing:
pick abc123 Add sensor API
pick def456 Fix typo
pick ghi789 Fix typo again

# Change to:
pick abc123 Add sensor API
squash def456 Fix typo
squash ghi789 Fix typo again

# Save and close
# Git combines typo commits into one

# Homestead example: Squashing commits
git rebase -i HEAD~3
# Combine "Fix typo" commits into one
```

---

### 4) Interactive Rebase Actions

**Context:** Available operations in interactive rebase.

```bash
# Interactive rebase editor actions:
pick    # Keep commit as-is
squash  # Combine with previous commit
reword  # Edit commit message
edit    # Pause to modify commit
drop    # Remove commit entirely

# Example: Clean up messy commits
pick abc123 Add aggregation function
squash def456 Fix off-by-one
squash ghi789 Actually fix it this time
squash jkl012 Remove debug print
pick mno345 Add logging

# Result: Two clean commits

# Homestead example: Cleaning up history
git rebase -i HEAD~5
# Squash fix commits together
# Keep feature commits separate
```

---

### 5) Rewording Commit Messages

**Context:** Fixing poor commit messages.

```bash
# Interactive rebase
git rebase -i HEAD~3

# Change pick to reword:
reword abc123 fix bug
reword def456 update stuff
reword ghi789 changes

# Git opens editor for each message
# Rewrite:
# "Fix voltage rounding error in solar logger"
# "Update config to use environment variables"
# "Refactor coop door timer for DST handling"

# Homestead example: Improving messages
git rebase -i HEAD~3
# Reword vague messages to be specific
```

---

### 6) Rebase Conflicts

**Context:** Resolving conflicts during rebase.

```bash
# Rebase encounters conflict
git rebase main
# Conflict in sensor.py

# Resolve conflict
# Edit file, remove conflict markers
git add sensor.py

# Continue rebase
git rebase --continue

# Or abort if too difficult
git rebase --abort

# Homestead example: Rebase conflict
git rebase main
# Conflict in coop_door.py
# Resolve, stage, continue
git add coop_door.py
git rebase --continue
```

---

### 7) Recovering from Rebase Mistake

**Context:** Using reflog to undo rebase.

```bash
# You rebased and something went wrong
git rebase main
# Commits don't look right

# Check reflog
git reflog
# Shows:
# abc123 HEAD@{0}: rebase finished
# def456 HEAD@{1}: checkout: moving to feature/coop
# ghi789 HEAD@{2}: commit: Add coop door timer

# Reset to before rebase
git reset --hard def456
# Back to state before rebase

# Homestead example: Recovering from bad rebase
git reflog
# Find commit before rebase
git reset --hard <commit-hash>
# Restored to before rebase
```

---

### 8) Rebase vs Merge

**Context:** Choosing between rebase and merge.

```bash
# Use merge when:
# - Branch is shared/pushed
# - Want to preserve exact history
# - Working in team
git merge feature/coop-automation

# Use rebase when:
# - Branch is local/unpublished
# - Want linear history
# - Cleaning up before sharing
git rebase main

# Homestead example: Choosing merge
# Feature branch pushed and shared
git switch main
git merge feature/major-refactor
# Preserves shared history

# Homestead example: Choosing rebase
# Local feature branch, not pushed
git switch feature/small-fix
git rebase main
# Clean linear history before pushing
```

---

## Chapter 3.08: Stashing and Temporary State

### 1) Basic Stash

**Context:** Temporarily saving uncommitted changes.

```bash
# Save current changes
git stash

# Or with message
git stash push -m "Coop door timer work"

# Working directory now clean
# Can switch branches, pull, etc.

# Homestead example: Stashing work
git stash
# Saves coop_door.py and config.json changes
# Working directory clean
```

---

### 2) Applying Stash

**Context:** Restoring stashed changes.

```bash
# Apply most recent stash (keeps stash)
git stash apply

# Apply specific stash
git stash apply stash@{1}

# Pop most recent stash (removes from list)
git stash pop

# Pop specific stash
git stash pop stash@{1}

# Homestead example: Restoring work
git stash pop
# Restores stashed changes
# Removes stash from list
```

---

### 3) Listing Stashes

**Context:** Viewing all saved stashes.

```bash
# List all stashes
git stash list

# Shows:
# stash@{0}: WIP on feature/coop-automation: abc123 Coop timer work
# stash@{1}: WIP on main: def456 Solar logger refactor
# stash@{2}: WIP on feature/solar: ghi789 Email config

# Each stash has index number
# Can reference by index: stash@{0}, stash@{1}, etc.

# Homestead example: Multiple stashes
git stash list
# See all temporary states
# Apply specific one: git stash apply stash@{1}
```

---

### 4) Stash with Message

**Context:** Labeling stashes for clarity.

```bash
# Stash with descriptive message
git stash push -m "Coop door DST fix - halfway done"

git stash push -m "Solar aggregation refactor - needs testing"

git stash push -m "Config migration - partial"

# List shows messages
git stash list
# stash@{0}: WIP on main: abc123 Config migration - partial
# stash@{1}: WIP on feature/solar: def456 Solar aggregation refactor - needs testing
# stash@{2}: WIP on feature/coop: ghi789 Coop door DST fix - halfway done

# Homestead example: Labeled stashes
git stash push -m "Coop timer work"
git stash list
# Shows helpful descriptions
```

---

### 5) Stash Conflicts

**Context:** Resolving conflicts when applying stash.

```bash
# Pop stash
git stash pop

# Conflict occurs if branch changed
# Conflict markers in file:
<<<<<<< Updated upstream
# Current branch version
def calculate_time():
    return local_time()
=======
# Stashed version
def calculate_time():
    return utc_time()
>>>>>>> Stashed changes

# Resolve conflict
def calculate_time():
    return utc_time()  # Keep stashed version

# Stage resolved file
git add coop_door.py
# Stash removed after pop

# Homestead example: Stash conflict
git stash pop
# Conflict in coop_door.py
# Resolve, stage, continue
git add coop_door.py
```

---

### 6) Creating Branch from Stash

**Context:** Converting stash to proper branch.

```bash
# Create branch from stash
git stash branch feature/coop-timer-fix stash@{0}

# Creates branch, applies stash, drops stash
# Safer than popping onto moving branch

# Homestead example: Branch from stash
git stash branch feature/coop-timer-fix stash@{0}
# Creates branch, applies stash
# Can commit properly
```

---

### 7) Dropping Stashes

**Context:** Removing stashes you don't need.

```bash
# Drop most recent stash
git stash drop

# Drop specific stash
git stash drop stash@{1}

# Clear all stashes
git stash clear

# Homestead example: Cleaning up
git stash list
# See old stashes
git stash drop stash@{2}
# Remove one you don't need
```

---

### 8) Stashing Specific Files

**Context:** Stashing only selected files.

```bash
# Stash only specific files
git stash push config.json

# Other modified files remain in working directory
# Only config.json is stashed

# Homestead example: Selective stashing
# Modified: solar_logger.py, config.json, test_solar.py
git stash push config.json
# Only config.json stashed
# solar_logger.py and test_solar.py remain modified
```

---

### 9) Stashing Untracked Files

**Context:** Including new files in stash.

```bash
# Stash including untracked files
git stash push -u

# Or with message
git stash push -u -m "New sensor file work"

# Includes modified tracked files AND untracked files
# Ignored files still excluded

# Homestead example: Stashing new files
# Created new_sensor.py (untracked)
# Modified sensor.py (tracked)
git stash push -u
# Both stashed
```

---

### 10) Keeping Staged Changes

**Context:** Stashing only unstaged changes.

```bash
# Stash but keep staged changes
git stash push --keep-index

# Only unstaged changes stashed
# Staged changes remain staged

# Homestead example: Testing staged work
# Staged: sensor.py (ready to commit)
# Unstaged: config.json (experiment)
git stash push --keep-index
# Only config.json stashed
# sensor.py remains staged
# Can test staged work on clean tree
```

---

### 11) Emergency Context Switch

**Context:** Using stash for urgent fixes.

```bash
# Working on feature branch
git switch feature/coop-automation
# Modified files, not ready to commit

# Urgent: solar logger broken
git stash push -m "Coop automation - timer logic"
git switch main
# Fix solar logger
git add solar_logger.py
git commit -m "Fix solar logger crash"
git push origin main

# Return to feature work
git switch feature/coop-automation
git stash pop
# Work restored exactly as left

# Homestead example: Emergency fix
git stash
git switch main
# Fix urgent issue
git commit -m "Hotfix: solar logger"
git switch feature/coop-automation
git stash pop
# Continue where you left off
```

---

### 12) Pulling with Local Changes

**Context:** Stashing before pulling updates.

```bash
# Have uncommitted changes
# Need to pull updates

# Stash first
git stash push -m "Local sensor work"

# Pull updates
git pull origin main

# Restore stashed work
git stash pop

# Resolve conflicts if any
# Homestead example: Pulling with changes
git stash
git pull origin main
git stash pop
# Local changes reapplied on top of updates
```

---

## Summary

These examples demonstrate:

1. **Chapter 3.05:** Merging branches, fast-forward vs merge commits, resolving conflicts, and when to merge
2. **Chapter 3.06:** Adding remotes, pushing and pulling, fetching, upstream tracking, and collaboration workflows
3. **Chapter 3.07:** Rebasing branches, interactive rebase, when rebase is safe/dangerous, and recovering from mistakes
4. **Chapter 3.08:** Stashing uncommitted changes, applying/popping stashes, managing multiple stashes, and temporary state management

All examples use homestead automation scenarios to make concepts concrete and relatable.
