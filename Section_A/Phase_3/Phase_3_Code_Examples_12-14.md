# Phase 3 Code Examples (Chapters 3.12-3.14)

This file contains visual references for all code examples mentioned in Phase 3 chapters 3.12-3.14. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 3.12: Git in Your Workflow

### 1) Complete Feature-Branch Workflow

**Context:** Full workflow from start to finish.

```bash
# 1. Start from main
git switch main
git pull origin main

# 2. Create feature branch
git switch -c feature/email-alerts

# 3. Make changes, commit frequently
git add config.json
git commit -m "Add email configuration to config.json"

git add email_service.js
git commit -m "Implement email sending on low battery"

git add test_email.js
git commit -m "Add tests for email alerts"

# 4. Push branch
git push -u origin feature/email-alerts

# 5. Code review happens (GitHub PR or other method)

# 6. After approval, merge on main
git switch main
git pull origin main
git merge feature/email-alerts
git push origin main

# 7. Clean up
git branch -d feature/email-alerts

# Homestead example: Complete feature workflow
# From start to finish: branch, work, review, merge, cleanup
```

---

### 2) Syncing Feature Branch with Main

**Context:** Keeping feature branch up-to-date with main.

```bash
# While working on feature branch
git switch feature/sensor-calibration

# Main has new commits, sync your branch
git switch main
git pull origin main
git switch feature/sensor-calibration
git merge main

# Resolve any conflicts if needed
# Then push updated feature branch
git push origin feature/sensor-calibration

# Homestead example: Syncing branch
# Merge main into feature branch regularly
# Prevents large conflicts later
```

---

### 3) Daily Git Habits - Start of Day

**Context:** Morning routine for Git workflow.

```bash
# Start of day routine
git switch main
git pull origin main

# Check what you're working on
git branch

# See active branches
# Switch to feature branch or create new one
git switch feature/coop-door-automation

# Homestead example: Morning routine
# Update main, check branches, continue work
```

---

### 4) Daily Git Habits - During Work

**Context:** Committing and pushing during development.

```bash
# During work: commit frequently
git add sunrise_calc.js
git commit -m "Add sunrise/sunset calculation"

git add door_control.js
git commit -m "Add door control logic"

# Push regularly for backup
git push origin feature/coop-door-automation

# Homestead example: Regular commits and pushes
# Small commits, frequent pushes for backup
```

---

### 5) Daily Git Habits - End of Day

**Context:** Wrapping up work for the day.

```bash
# End of day: commit any uncommitted work
git add .
git commit -m "WIP: door automation, need to add tests"

# Push for backup
git push origin feature/coop-door-automation

# Tomorrow, continue where you left off
# Homestead example: End of day checkpoint
# Commit progress, push for backup
```

---

### 6) Hotfix Workflow

**Context:** Emergency fixes to production.

```bash
# Production is broken, need immediate fix
git switch main
git pull origin main

# Create hotfix branch
git switch -c hotfix/critical-bug

# Fix the bug
git add sensor_reader.py
git commit -m "Fix critical bug in sensor reading"

# Merge immediately (skip review for critical)
git switch main
git merge hotfix/critical-bug
git push origin main

# Tag the fix
git tag -a v1.2.1 -m "Hotfix: critical bug"
git push origin v1.2.1

# Deploy
# ./deploy.sh v1.2.1

# Homestead example: Emergency hotfix
# Fast-track fix, merge, tag, deploy
```

---

### 7) Small Feature Pattern

**Context:** Quick feature workflow.

```bash
# Small feature pattern
git switch main
git pull origin main
git switch -c feature/small-change

# Make change
git add config_option.js
git commit -m "Add small feature"

# Push and review
git push -u origin feature/small-change
# Open PR, review, merge

# Homestead example: Small feature
# Quick branch, single commit, fast review
```

---

### 8) Large Feature Pattern

**Context:** Long-running feature development.

```bash
# Large feature pattern
git switch main
git pull origin main
git switch -c feature/large-feature

# Work for days/weeks
# Commit frequently
git commit -m "Step 1: Initial structure"
git commit -m "Step 2: Core logic"
git commit -m "Step 3: Integration"

# Sync with main regularly
git merge main
# Resolve conflicts, continue

# Push regularly
git push origin feature/large-feature

# When complete: review, merge
# Homestead example: Large feature
# Long development, regular syncing, frequent commits
```

---

### 9) Bug Fix Pattern

**Context:** Fixing bugs in separate branch.

```bash
# Bug fix pattern
git switch main
git pull origin main
git switch -c fix/sensor-timeout

# Fix bug
git add sensor_timeout.py
git commit -m "Fix: sensor timeout handling"

# Push and review
git push -u origin fix/sensor-timeout
# Review, merge

# Homestead example: Bug fix
# Isolated fix branch, review, merge
```

---

### 10) Recovering from Direct Commit to Main

**Context:** Fixing mistake of committing directly to main.

```bash
# Mistake: committed directly to main
git log
# See commit on main

# Fix: create branch from current main
git switch -c recovery-branch

# Reset main to match remote
git switch main
git reset --hard origin/main

# Merge recovery branch through proper workflow
git merge recovery-branch
# Now goes through review process

# Homestead example: Recovering from mistake
# Move commit to branch, reset main, merge properly
```

---

### 11) Deployment from Main

**Context:** Simple deployment workflow.

```bash
# On deployment server
git clone <repo-url>
cd <repo>
git switch main
git pull origin main

# Run deployment script
./deploy.sh

# Homestead example: Deploy from main
# Simple: always deploy latest main
# Requires main to always be stable
```

---

### 12) Deployment from Tags

**Context:** Reproducible deployment workflow.

```bash
# On deployment server
git clone <repo-url>
cd <repo>
git fetch origin
git checkout v1.2.0

# Run deployment script
./deploy.sh

# Deploy specific version, not latest main
# Homestead example: Deploy from tag
# Reproducible: deploy exact tagged version
```

---

## Chapter 3.13: Git vs GitHub

### 1) Git Works Offline

**Context:** Git doesn't require internet or GitHub.

```bash
# Git works completely offline
git init
git add .
git commit -m "Initial solar logger"

# Full version control, no internet needed
# No GitHub account required

# Homestead example: Offline development
# Git works in shed with no internet
# Full history, branches, commits - all local
```

---

### 2) Git on Local Network

**Context:** Sharing Git repositories without external services.

```bash
# On Raspberry Pi (server)
git init
git add .
git commit -m "Initial commit"

# Share via Git daemon
git daemon --export-all --base-path=/home/user/repos

# On laptop (client)
git clone git://pi-ip/repo.git

# Works over local network
# No GitHub, GitLab, or external service needed

# Homestead example: Local network sharing
# Git works between machines on local network
```

---

### 3) Adding GitHub as Remote

**Context:** Connecting local Git to GitHub.

```bash
# You've been developing locally
git log --oneline
# Shows: abc123 Initial commit
#        def456 Added sensor reading

# Create GitHub repository, then add as remote
git remote add origin https://github.com/yourusername/homestead-automation.git

# Push to GitHub
git push -u origin main

# Nothing about history changes
# GitHub now hosts a copy
# Can view in browser, share, collaborate

# Homestead example: Adding GitHub
# Local Git repo, add GitHub as remote
# History unchanged, now accessible online
```

---

### 4) Git Commands Don't Change

**Context:** Same Git commands work with any remote.

```bash
# These commands work the same regardless of remote:

# GitHub
git push origin main

# GitLab
git push origin main

# Gitea
git push origin main

# Self-hosted
git push origin main

# Git commands are identical
# Only the remote URL differs

# Homestead example: Platform independence
# Same Git commands, different remotes
```

---

### 5) Switching Remotes

**Context:** Changing which platform hosts your repository.

```bash
# Start with GitHub
git remote add origin https://github.com/user/repo.git
git push origin main

# Later switch to GitLab
git remote set-url origin https://gitlab.com/user/repo.git
git push origin main

# Same Git commands
# Different platform
# Repository and history unchanged

# Homestead example: Switching platforms
# Change remote URL, push to new platform
# Git commands stay the same
```

---

### 6) Multiple Remotes

**Context:** Using multiple hosting services.

```bash
# Add multiple remotes
git remote add github https://github.com/user/repo.git
git remote add gitea https://gitea.local/homestead/repo.git

# Push to specific remote
git push github main
git push gitea main

# Useful for backup or different purposes
# Homestead example: Multiple remotes
# Push to GitHub and Gitea for redundancy
```

---

### 7) Git Without GitHub Workflow

**Context:** Collaboration without GitHub features.

```bash
# Git alone workflow:
# 1. Create branch
git switch -c feature/email-alerts

# 2. Make changes, commit
git commit -m "Add email alerts"

# 3. Push to shared server
git push origin feature/email-alerts

# 4. Review happens via email or in-person
# Reviewer uses: git log, git show, git diff

# 5. Merge manually
git switch main
git merge feature/email-alerts

# No Pull Requests, Issues, or Actions
# But Git still enables collaboration

# Homestead example: Git-only collaboration
# Push to shared server, review manually, merge
```

---

### 8) Git with GitHub Workflow

**Context:** Same Git commands, GitHub adds workflow.

```bash
# Same Git commands:
git switch -c feature/email-alerts
git commit -m "Add email alerts"
git push origin feature/email-alerts

# GitHub adds:
# - Pull Request interface
# - Review comments on specific lines
# - Automated tests via Actions
# - Merge button

# Git commands unchanged
# GitHub adds workflow layer

# Homestead example: Git + GitHub
# Same Git commands, GitHub adds PR workflow
```

---

## Chapter 3.14: GitHub Workflows

### 1) Creating Pull Request (Git Commands)

**Context:** Git commands before opening PR.

```bash
# Create branch and push
git switch -c feature/low-battery-alert
git add battery_alert.js
git commit -m "Add low battery alert threshold"
git push -u origin feature/low-battery-alert

# Now on GitHub:
# - Navigate to repository
# - Click "Compare & pull request"
# - Fill in PR title and description
# - Click "Create pull request"

# Homestead example: PR creation
# Git commands create branch, GitHub adds PR interface
```

---

### 2) PR Workflow - Complete Cycle

**Context:** Full PR workflow from branch to merge.

```bash
# 1. Start from main
git switch main
git pull origin main

# 2. Create feature branch
git switch -c feature/email-alerts

# 3. Make changes, commit frequently
git add config.json
git commit -m "Add email configuration to config.json"

git add email_service.js
git commit -m "Implement email sending on low battery"

git add test_email.js
git commit -m "Add tests for email alerts"

# 4. Push branch
git push -u origin feature/email-alerts

# 5. Open PR on GitHub (web interface)
# Title: "Add email alerts for low battery"
# Description: "Adds SMTP email alerts when battery voltage drops below threshold. Closes #25."

# 6. Review happens (on GitHub)
# Reviewer comments: "Consider adding retry logic"

# 7. Address feedback
git add retry_logic.js
git commit -m "Add retry logic for email sending"
git push origin feature/email-alerts

# 8. Reviewer approves (on GitHub)

# 9. Merge on GitHub (click "Merge pull request")

# 10. Clean up locally
git switch main
git pull origin main
git branch -d feature/email-alerts

# Homestead example: Complete PR cycle
# Git commands + GitHub PR workflow
```

---

### 3) Linking Issues in PR Description

**Context:** Connecting PRs to Issues.

```bash
# PR description with issue links:
# "Adds solar panel efficiency calculation based on voltage and current readings.
#
# Implements #15"

# Or multiple issues:
# "Fixes multiple sensor reading issues.
#
# - Fixes #42 (timeout handling)
# - Fixes #43 (malformed JSON parsing)
# - Closes #44 (error logging)
#
# All related to sensor reading reliability."

# When PR merges, linked issues auto-close
# Homestead example: Linking issues
# PR description links to issues using "Fixes #42" syntax
```

---

### 4) Fork Workflow

**Context:** Contributing to repositories you don't own.

```bash
# Fork workflow:
# 1. Fork repository on GitHub (web interface)

# 2. Clone your fork
git clone https://github.com/yourusername/homestead-automation.git

# 3. Create branch
git switch -c feature/my-improvement

# 4. Make changes, commit
git add improvement.js
git commit -m "Add improvement"
git push origin feature/my-improvement

# 5. Open PR from your fork to upstream (web interface)

# 6. Upstream owner reviews and merges

# Homestead example: Fork workflow
# Fork, clone, branch, push, PR from fork
```

---

### 5) Feature Branch Workflow

**Context:** Working in same repository with push access.

```bash
# Feature branch workflow:
# 1. Create branch
git switch -c feature/new-sensor

# 2. Work, commit, push
git add sensor.js
git commit -m "Add new sensor"
git push -u origin feature/new-sensor

# 3. Open PR (web interface)
# 4. Review (web interface)
# 5. Merge (web interface)

# Homestead example: Feature branch workflow
# Same repo, push access, PR workflow
```

---

### 6) Updating PR After Feedback

**Context:** Making changes based on review comments.

```bash
# Reviewer comments on PR
# "Consider adding error handling"

# Make changes locally
git switch feature/email-alerts
git add error_handling.js
git commit -m "Add error handling for email sending"
git push origin feature/email-alerts

# PR automatically updates
# Reviewer sees new commits
# Can re-review

# Homestead example: Updating PR
# Make changes, commit, push
# PR updates automatically
```

---

### 7) Syncing PR Branch with Main

**Context:** Updating PR branch when main changes.

```bash
# Main has new commits while PR is open
# Update your PR branch:

git switch feature/email-alerts
git switch main
git pull origin main
git switch feature/email-alerts
git merge main

# Resolve conflicts if any
git push origin feature/email-alerts

# PR updates, shows merge commit
# Or rebase instead of merge (if team prefers)

# Homestead example: Syncing PR branch
# Merge main into PR branch to keep it current
```

---

### 8) Good PR Description Format

**Context:** Writing effective PR descriptions.

```bash
# Good PR description structure:
# Title: "Add low battery alert threshold"
#
# Description:
# "Adds configurable low battery alert threshold to solar logger.
#
# **Changes:**
# - Add `low_battery_threshold` to config.json
# - Send alert when voltage drops below threshold
# - Log alert events
#
# **Testing:**
# - Tested with voltage 11.0V (below threshold)
# - Alert sent correctly
# - Log entry created
#
# Fixes #42"

# Homestead example: Good PR description
# Clear title, explains what/why, includes testing, links issue
```

---

### 9) Bad PR Description

**Context:** What not to do.

```bash
# Bad PR description:
# Title: "Updates"
# Description: "Made some changes"

# Tells reviewer nothing
# Forces them to reverse-engineer intent
# Makes review harder

# Homestead example: Bad PR
# Vague, unhelpful, wastes reviewer time
```

---

### 10) Creating Issue

**Context:** Bug report structure (conceptual, no code).

```bash
# Issue creation (GitHub web interface):
# Title: "ESP32 sensor reading timeout"
#
# Description:
# **Describe the bug**
# Sensor readings timeout after 30 seconds, causing data gaps.
#
# **To reproduce**
# 1. Start sensor logger
# 2. Wait 30 seconds
# 3. Check logs - timeout error
#
# **Expected behavior**
# Sensor should retry and log data continuously.
#
# **Environment**
# - ESP32 firmware v1.2.0
# - Python 3.9
# - Raspberry Pi 4

# Homestead example: Bug report issue
# Clear structure: description, reproduction, expected, environment
```

---

### 11) Feature Request Issue

**Context:** Feature request structure (conceptual).

```bash
# Feature request issue (GitHub web interface):
# Title: "Add email alerts for low battery"
#
# Description:
# **Feature description**
# Send email alerts when battery voltage drops below threshold.
#
# **Use case**
# Monitor battery health remotely when away from homestead.
#
# **Proposed solution**
# Add email configuration to config.json, send alert via SMTP when threshold reached.
#
# **Acceptance criteria**
# - [ ] Email config added to config.json
# - [ ] Email sent when voltage < threshold
# - [ ] Tests added
# - [ ] Documentation updated

# Homestead example: Feature request
# Clear problem, use case, solution, acceptance criteria
```

---

### 12) GitHub Actions Workflow (Conceptual)

**Context:** Understanding Actions triggers (no actual YAML shown).

```bash
# GitHub Actions workflow concepts:
# - Workflow file in .github/workflows/
# - Triggers: push, pull_request, tag creation, schedule
# - Jobs: run tests, lint, build, deploy
# - Runs automatically on events

# Example workflow (conceptual):
# On push to main or PR:
# - Checkout code
# - Setup Python 3.9
# - Install dependencies
# - Run tests
# - Check code style

# If tests pass, PR can merge
# If tests fail, PR blocked

# Homestead example: Actions workflow
# Automated testing on every push/PR
# Prevents merging broken code
```

---

### 13) Branch Protection Setup

**Context:** Configuring branch protection (GitHub web interface, conceptual).

```bash
# Branch protection setup (GitHub web interface):
# Settings → Branches → Add rule for main
#
# Enable:
# - Require a pull request before merging
# - Require approvals (1)
# - Require status checks to pass
# - Require branches to be up to date
#
# Now:
# - No direct pushes to main
# - PRs require approval
# - Tests must pass
# - Main stays stable

# Homestead example: Protecting main
# GitHub settings enforce workflow rules
```

---

### 14) Deployment Workflow with Tags

**Context:** CI/CD deployment triggered by tags.

```bash
# Deployment workflow (conceptual):
# 1. Merge feature to main
git switch main
git merge feature/email-alerts
git push origin main

# 2. Run tests (automated via Actions)

# 3. Tag release
git tag -a v1.3.0 -m "Release v1.3.0"
git push origin v1.3.0

# 4. Actions detects tag, triggers deployment
# - Checks out tagged commit
# - Runs deployment script
# - Deploys to production

# Homestead example: Tag-based deployment
# Tag triggers automated deployment
# Ensures exact version deployed
```

---

### 15) PR Best Practices

**Context:** Good PR habits.

```bash
# PR best practices:
# - Keep PRs small and single-purpose
# - One feature or one bug fix per PR
# - Write descriptions explaining "why"
# - Include "how to verify"
# - Respond to feedback explicitly

# Example: Small focused PR
git switch -c feature/add-sensor-type
git add sensor_type_a.js
git commit -m "Add sensor type A"
git push -u origin feature/add-sensor-type
# PR: Single purpose, easy to review

# Homestead example: Focused PRs
# Small PRs reviewed faster, bugs caught earlier
```

---

### 16) Splitting Large PR

**Context:** Breaking up mega PRs.

```bash
# Mistake: One PR with 500+ lines, three features
# Fix: Split into separate PRs

# Close original PR
# Create three branches:

git switch -c feature/sensor-type-a
# Add sensor type A only
git push -u origin feature/sensor-type-a
# PR 1

git switch -c feature/sensor-type-b
# Add sensor type B only
git push -u origin feature/sensor-type-b
# PR 2

git switch -c feature/sensor-type-c
# Add sensor type C only
git push -u origin feature/sensor-type-c
# PR 3

# Each PR focused, easier to review

# Homestead example: Splitting mega PR
# Three focused PRs instead of one huge one
```

---

## Summary

These examples demonstrate:

1. **Chapter 3.12:** Feature-branch workflows, daily Git habits, hotfix workflows, deployment patterns, and common workflow patterns
2. **Chapter 3.13:** Git working offline, local network sharing, adding GitHub as remote, platform independence, and switching remotes
3. **Chapter 3.14:** Pull Request workflows, linking Issues, fork workflow, updating PRs, good PR practices, and GitHub Actions concepts

All examples use homestead automation scenarios to make concepts concrete and relatable. Note that chapters 3.13 and 3.14 are more conceptual (GitHub web interface), but the Git commands that enable those workflows are shown here.
