# Phase 3 Code Examples (Chapters 3.01-3.04)

This file contains visual references for all code examples mentioned in Phase 3 chapters 3.01-3.04. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 3.01: What Version Control Is

### 1) Initializing a Repository

**Context:** Creating a new Git repository to start tracking history.

```bash
# Initialize a new Git repository
git init

# This creates a hidden .git directory
# The .git directory contains all history, branches, and metadata
# Your working files remain unchanged

# Homestead example: Starting version control for solar logger
cd ~/homestead/solar-logger
git init
# Now Git is tracking this directory
```

---

### 2) Checking Repository Status

**Context:** Understanding what Git knows about your files.

```bash
# Check the status of your repository
git status

# Shows:
# - Modified files (files you've changed)
# - Staged files (files ready to commit)
# - Untracked files (files Git doesn't know about)

# Homestead example: Checking solar logger status
cd ~/homestead/solar-logger
git status
# Shows which files are modified, which are new, which are ready to commit
```

---

### 3) Viewing History

**Context:** Seeing what has changed over time.

```bash
# View commit history
git log

# Shows:
# - Commit hash (unique identifier)
# - Author name and email
# - Date and time
# - Commit message

# Compact one-line view
git log --oneline

# View last N commits
git log -5

# Homestead example: Seeing when solar logger changes were made
git log --oneline
# Shows timeline of changes: "Add daily aggregation", "Fix DST bug", etc.
```

---

## Chapter 3.02: Repositories and the Working Tree

### 1) The Three-Area Model

**Context:** Understanding where changes live: working directory, staging area, repository.

```bash
# Working Directory: Where you edit files
# Edit a file in your editor
# File is now modified in working directory

# Staging Area: Where you prepare commits
git add filename.js
# Changes moved from working directory to staging area

# Repository: Where history lives
git commit -m "Fix voltage rounding bug"
# Staged changes moved from staging area to repository

# Homestead example: Fixing coop door timer
# 1. Edit coop_door.py (working directory)
# 2. git add coop_door.py (staging area)
# 3. git commit -m "Fix DST offset calculation" (repository)
```

---

### 2) Checking Status at Each Stage

**Context:** Using git status to see where changes are.

```bash
# After editing files
git status
# Shows: "Changes not staged for commit"
#        modified: sensor.js

# After staging
git add sensor.js
git status
# Shows: "Changes to be committed"
#        modified: sensor.js

# After committing
git commit -m "Fix sensor reading"
git status
# Shows: "nothing to commit, working tree clean"

# Homestead example: Tracking solar logger changes
git status
# Before staging: shows modified files in working directory
# After git add: shows files ready to commit
# After git commit: shows clean working tree
```

---

### 3) Staging Multiple Files Separately

**Context:** Creating focused commits by staging related changes together.

```bash
# Edit multiple files
# sensor.js - bug fix
# logger.js - new feature
# config.json - config update

# Stage only the bug fix
git add sensor.js
git commit -m "Fix voltage rounding bug"

# Stage the new feature
git add logger.js
git commit -m "Add logging for sensor readings"

# Stage the config
git add config.json
git commit -m "Update sensor configuration"

# Homestead example: Separate commits for related changes
# Fix coop door bug
git add coop_door.py
git commit -m "Fix coop door DST calculation"

# Add logging separately
git add door_logger.py
git commit -m "Add logging for door open events"
```

---

### 4) Understanding Tracked vs Untracked Files

**Context:** Git distinguishes between files it knows about and files it doesn't.

```bash
# Tracked file: Git has seen this file before
# Modified tracked file shows as "modified"

# Untracked file: Git has never seen this file
git status
# Shows: "Untracked files"
#        new_sensor.py

# To start tracking a file
git add new_sensor.py
git commit -m "Add new sensor reading"

# Homestead example: Adding a new sensor file
# Create new file: pig_barn_sensor.py
git status
# Shows: "Untracked files: pig_barn_sensor.py"
git add pig_barn_sensor.py
git commit -m "Add pig barn temperature sensor"
# Now Git tracks this file
```

---

## Chapter 3.03: Commits as Snapshots

### 1) Creating a Commit

**Context:** The basic workflow: edit, stage, commit.

```bash
# Step 1: Edit files in working directory
# Edit sensor.js in your editor

# Step 2: Stage changes
git add sensor.js

# Step 3: Commit with message
git commit -m "Fix voltage rounding bug"

# The commit includes:
# - Complete snapshot of sensor.js at this moment
# - Author name and email
# - Timestamp
# - Commit message
# - Unique hash

# Homestead example: Committing a coop door fix
git add coop_door.py
git commit -m "Fix coop door opening at wrong time during DST transitions"
```

---

### 2) Commit Messages: Good vs Bad

**Context:** Commit messages document why changes were made.

```bash
# Bad commit message
git commit -m "fix"
git commit -m "update"
git commit -m "changes"

# Good commit message
git commit -m "Fix sensor voltage rounding error. Voltage values were being truncated instead of rounded, causing inaccurate readings in the dashboard."

# Homestead example: Good commit message
git commit -m "Fix coop door opening at wrong time during DST transitions. The timer was using local time without accounting for daylight saving time changes. Updated to use UTC internally and convert to local time only for display."

# Another good example
git commit -m "Add humidity sensor to pig barn monitor. New DHT22 sensor installed in pig barn; readings logged alongside temperature. Config updated with sensor ID and calibration values from manufacturer spec sheet."
```

---

### 3) Viewing Commit History

**Context:** Inspecting what changed and when.

```bash
# View full commit history
git log

# Compact one-line view
git log --oneline

# View last 5 commits
git log -5

# View specific commit details
git show <commit-hash>

# Shows:
# - Commit metadata (author, date, message)
# - What files changed
# - Line-by-line differences

# Homestead example: Finding when a bug was introduced
git log --oneline
# Shows commits: "Fix coop door DST calculation", "Add coop door timer"
git show <hash-of-dst-commit>
# Shows exactly what changed in that commit
```

---

### 4) Understanding Commit Hashes

**Context:** Every commit has a unique identifier derived from its content.

```bash
# View commit hash
git log --oneline
# Output: a3f5b2c Fix voltage rounding bug
#         def456a Add sensor logging
#         ghi789b Initial commit

# The hash is unique to that commit
# It's derived from:
# - File contents
# - Directory structure
# - Parent commit
# - Author info
# - Timestamp
# - Commit message

# Change any of these, hash changes
# This ensures commits are immutable

# Homestead example: Commit hash identifies exact state
git log --oneline
# a3f5b2c Fix coop door DST calculation
# This hash always points to this exact commit
# Even if you make new commits, this hash never changes
```

---

### 5) What Gets Included in a Commit

**Context:** Only staged changes become part of a commit.

```bash
# Edit two files
# sensor.js - fix bug
# logger.js - add feature

# Stage only sensor.js
git add sensor.js
git commit -m "Fix voltage rounding bug"
# Commit includes ONLY sensor.js
# logger.js remains modified but unstaged

# Stage logger.js separately
git add logger.js
git commit -m "Add logging for sensor readings"
# Now logger.js is in a separate commit

# Homestead example: Separate commits for related changes
# Fix coop door bug
git add coop_door.py
git commit -m "Fix coop door DST offset calculation"
# Only coop_door.py is committed

# Add logging separately
git add door_logger.py
git commit -m "Add logging for door open events"
# Only door_logger.py is committed
```

---

### 6) Viewing Changes Between Commits

**Context:** Comparing different states of the project.

```bash
# Compare current state to previous commit
git diff HEAD~1

# Compare two specific commits
git diff <commit-hash-1> <commit-hash-2>

# Compare last 30 commits for a file
git diff HEAD~30 config.json

# Shows line-by-line differences
# + lines added
# - lines removed
# Context lines unchanged

# Homestead example: Seeing config changes over time
git diff HEAD~30 config.json
# Shows what changed in config over last 30 commits
# Useful for seeing how sensors were added, thresholds changed, etc.
```

---

## Chapter 3.04: Branches and Parallel Lines of Work

### 1) Creating a Branch

**Context:** Branches are pointers to commits, not copies of files.

```bash
# Create a new branch (doesn't switch to it)
git branch feature/solar-email-alerts

# Create and switch in one step (modern Git)
git switch -c feature/solar-email-alerts

# Older Git syntax
git checkout -b feature/solar-email-alerts

# List all branches
git branch
# Shows all branches, * marks current branch

# Homestead example: Creating a feature branch
git switch -c feature/coop-door-automation
# Creates branch and switches to it
# Now you're working on this branch
```

---

### 2) Switching Between Branches

**Context:** Moving between different lines of work.

```bash
# Switch to a branch
git switch feature/solar-email-alerts

# Older syntax
git checkout feature/solar-email-alerts

# Switch back to main
git switch main

# Git updates your working directory to match that branch's commit
# Files change to reflect the branch's state

# Homestead example: Switching between features
git switch feature/coop-door-automation
# Work on coop door feature
git switch main
# Back on main, working directory matches main's state
git switch feature/solar-email-alerts
# Now working on solar email alerts
```

---

### 3) Understanding HEAD and Branch Pointers

**Context:** HEAD points to your current branch, which points to a commit.

```bash
# When you're on main
git branch
# Output: * main
#         feature/solar-email-alerts
# * indicates HEAD points to main

# When you switch branches
git switch feature/solar-email-alerts
git branch
# Output:   main
#         * feature/solar-email-alerts
# * indicates HEAD now points to feature/solar-email-alerts

# HEAD points to current branch
# Branch points to a commit
# New commits move the branch pointer forward

# Homestead example: HEAD tracks where you are
git switch main
# HEAD -> main -> commit C
git switch -c feature/new-sensor
# HEAD -> feature/new-sensor -> commit C (same commit initially)
git commit -m "Add new sensor"
# HEAD -> feature/new-sensor -> commit D (new commit)
# main still points to commit C
```

---

### 4) Working on Feature Branches

**Context:** Isolating new work from the stable main branch.

```bash
# Start from main
git switch main
git pull origin main

# Create feature branch
git switch -c feature/coop-door-automation

# Make changes, commit
git add coop_door.py
git commit -m "Add sunrise/sunset calculation"

git add door_control.py
git commit -m "Add door control logic"

# Push feature branch
git push origin feature/coop-door-automation

# When feature is complete, merge into main
# (Merging covered in next chapter)

# Homestead example: Developing a feature safely
git switch main
git switch -c feature/pig-barn-monitoring
# Work on pig barn feature
# Make commits
# Test thoroughly
# When ready, merge to main
# main stays stable throughout
```

---

### 5) Listing and Viewing Branches

**Context:** Seeing what branches exist and where they point.

```bash
# List all local branches
git branch

# List all branches (including remote)
git branch -a

# View commits on a specific branch
git log feature/solar-email-alerts

# View branch graph
git log --oneline --graph --all

# Shows how branches diverged and where they might merge

# Homestead example: Managing multiple features
git branch
# Output:
#   fix/solar-bug
#   feature/coop-automation
# * main
#   feature/pig-monitoring
# Shows all branches, * indicates current branch
```

---

### 6) Deleting Branches

**Context:** Cleaning up branches after they're merged.

```bash
# Delete a merged branch
git branch -d feature/solar-email-alerts

# Force delete an unmerged branch (use with caution)
git branch -D experiment/failed-idea

# Delete remote branch
git push origin --delete feature/old-feature

# Homestead example: Cleaning up after merge
git switch main
git merge feature/solar-email-alerts
# Feature merged into main
git branch -d feature/solar-email-alerts
# Delete local branch
# Commits are still in main's history
# Branch pointer is gone
```

---

### 7) Branch Naming Conventions

**Context:** Using consistent names helps organize work.

```bash
# Feature branches
git switch -c feature/sensor-calibration
git switch -c feature/email-alerts

# Bug fix branches
git switch -c fix/voltage-rounding
git switch -c fix/solar-aggregation-dst

# Experiment branches
git switch -c experiment/new-schema
git switch -c experiment/mqtt-publisher

# Config branches
git switch -c config/migration-to-env-vars

# Homestead example: Consistent naming
git switch -c feature/coop-door-automation
git switch -c fix/temperature-validation
git switch -c experiment/sqlite-to-mysql
# Names clearly indicate purpose
```

---

### 8) Common Branch Workflows

**Context:** Typical patterns for using branches.

```bash
# Pattern 1: Feature development
git switch main
git pull origin main
git switch -c feature/new-feature
# Work, commit, push
# When done, merge to main

# Pattern 2: Bug fix
git switch main
git switch -c fix/bug-name
# Fix bug, commit
# Merge to main

# Pattern 3: Experiment
git switch main
git switch -c experiment/new-idea
# Try something
# If it works: merge to main
# If it doesn't: delete branch, main unchanged

# Homestead example: Multiple parallel workflows
git switch -c feature/humidity-sensors
# Work on humidity feature
git switch -c fix/solar-bug
# Fix solar bug
git switch -c experiment/mqtt
# Experiment with MQTT
# Each branch isolates its work
# Switch between them as needed
```

---

## Summary

These examples demonstrate:

1. **Chapter 3.01:** Basic Git setup and viewing history
2. **Chapter 3.02:** The three-area model (working directory, staging, repository) and moving changes between them
3. **Chapter 3.03:** Creating commits, writing good commit messages, viewing history, and understanding commit hashes
4. **Chapter 3.04:** Creating and switching branches, understanding HEAD, and using branches for parallel work

All examples use homestead automation scenarios to make concepts concrete and relatable.
