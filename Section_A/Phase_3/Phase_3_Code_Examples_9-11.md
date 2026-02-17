# Phase 3 Code Examples (Chapters 3.09-3.11)

This file contains visual references for all code examples mentioned in Phase 3 chapters 3.09-3.11. These examples are extracted from the chapters for visual reference when you're not listening.

---

## Chapter 3.09: Ignoring Files and .gitignore

### 1) Basic .gitignore File

**Context:** Creating a .gitignore file at repository root.

```bash
# Create .gitignore file
touch .gitignore

# Or edit existing one
# File contains one pattern per line
# Lines starting with # are comments

# Example .gitignore:
# Secrets
.env
.env.local

# Dependencies
node_modules/

# Logs
*.log

# Homestead example: Basic .gitignore
# Ignore secrets, dependencies, logs
```

---

### 2) Wildcard Patterns

**Context:** Using * to match multiple files.

```bash
# .gitignore content:
# Match all .log files
*.log

# Matches:
# error.log
# server.log
# access.log
# any_file.log

# Homestead example: Ignoring all log files
*.log
# Ignores all files ending in .log
```

---

### 3) Directory Patterns

**Context:** Ignoring entire directories.

```bash
# .gitignore content:
# Directory with trailing slash
build/
dist/
logs/

# Matches directories and everything inside
# build/ ignores build directory and all contents
# Without slash: build would match files named "build" too

# Homestead example: Ignoring build directories
build/
dist/
coverage/
# All build output ignored
```

---

### 4) Double Star (Recursive)

**Context:** Matching directories recursively.

```bash
# .gitignore content:
# Double star matches recursively
**/temp/
**/cache/

# Matches:
# temp/
# src/temp/
# data/archive/temp/
# any/nested/path/temp/

# Homestead example: Ignoring temp directories anywhere
**/temp/
# Matches temp directories at any level
```

---

### 5) Root-Only Patterns

**Context:** Matching only at repository root.

```bash
# .gitignore content:
# Leading slash = root only
/.env

# Matches only:
# /.env (at root)
# Does NOT match:
# config/.env
# src/.env

# Homestead example: Root-only .env
/.env
# Only ignores .env at repository root
```

---

### 6) Negation Patterns

**Context:** Un-ignoring specific files.

```bash
# .gitignore content:
# Ignore all .log files
*.log

# But keep important.log
!important.log

# Ignore all files in data/
data/*

# But keep example and schema
!data/example.json
!data/schema.json

# Homestead example: Ignore logs but keep example
*.log
!logs/README.md
# All .log files ignored except logs/README.md
```

---

### 7) Node.js Project Patterns

**Context:** Common patterns for Node.js projects.

```bash
# .gitignore for Node.js project:
node_modules/
dist/
build/
coverage/
.env
.env.*
*.log

# Homestead example: Node.js API
node_modules/
dist/
build/
coverage/
.env
*.log
# Covers dependencies, build output, secrets, logs
```

---

### 8) Python Project Patterns

**Context:** Common patterns for Python projects.

```bash
# .gitignore for Python project:
__pycache__/
*.pyc
venv/
.env
.mypy_cache/
.pytest_cache/

# Homestead example: Python scripts
__pycache__/
*.pyc
venv/
.env
.mypy_cache/
.pytest_cache/
# Covers bytecode, virtual env, secrets, caches
```

---

### 9) Multi-Language Project

**Context:** Combining patterns for multiple languages.

```bash
# .gitignore for Node.js + Python + ESP32:
# Node.js
node_modules/
dist/
build/
coverage/

# Python
__pycache__/
*.pyc
venv/
.mypy_cache/
.pytest_cache/

# Secrets
.env
.env.local
.env.production
*.key
*.pem

# Logs
logs/
*.log

# Databases
*.db
*.sqlite
*.sqlite3

# OS files
.DS_Store
Thumbs.db
desktop.ini

# IDE
.vscode/
.idea/
*.swp

# But keep examples
!.env.example
!logs/README.md

# Homestead example: Complete multi-language .gitignore
# Covers Node.js API, Python scripts, ESP32 MicroPython
```

---

### 10) Removing Tracked Files

**Context:** Stopping Git from tracking files already committed.

```bash
# File is already tracked
# Adding to .gitignore doesn't remove it

# Remove from tracking (keeps file locally)
git rm --cached .env

# Remove entire directory
git rm -r --cached logs/

# Commit the removal
git commit -m "Remove .env from tracking"

# Add to .gitignore
echo ".env" >> .gitignore

# Now .env is ignored going forward
# File still exists locally, Git no longer tracks it

# Homestead example: Removing tracked secrets
git rm --cached .env
git commit -m "Remove .env from tracking"
# Add .env to .gitignore
# File still exists locally, not tracked by Git
```

---

### 11) Global Ignore File

**Context:** Setting up ignore patterns for all repositories.

```bash
# Configure global ignore file
git config --global core.excludesfile ~/.gitignore_global

# Create the global file
touch ~/.gitignore_global

# Add OS files to global ignore
# ~/.gitignore_global content:
.DS_Store
Thumbs.db
desktop.ini

# Now every repo automatically ignores OS files
# Project .gitignore focuses on project-specific patterns

# Homestead example: Global OS file ignore
git config --global core.excludesfile ~/.gitignore_global
# Add .DS_Store, Thumbs.db to global file
# Don't need to repeat in every project
```

---

### 12) Complete Homestead .gitignore

**Context:** Comprehensive .gitignore for homestead automation system.

```bash
# .gitignore for homestead automation:
# Dependencies
node_modules/
venv/
__pycache__/
*.pyc

# Secrets and config
.env
.env.local
.env.production
*.key
*.pem
config/local.json
secrets/

# Logs
logs/
*.log
*.log.*

# Databases
*.db
*.sqlite
*.sqlite3
data/*.json
!data/example.json

# Build output
dist/
build/
coverage/
*.min.js

# ESP32 / MicroPython
*.mpy
__pycache__/

# OS files
.DS_Store
Thumbs.db
desktop.ini

# IDE
.vscode/
.idea/
*.swp

# But keep examples and docs
!.env.example
!logs/README.md
!data/example.json

# Homestead example: Complete ignore file
# Covers all components: Node.js, Python, ESP32
# Ignores secrets, dependencies, logs, databases
# Keeps examples and documentation
```

---

## Chapter 3.10: Undoing and Recovering

### 1) Soft Reset

**Context:** Moving HEAD but keeping changes staged.

```bash
# Reset last commit, keep changes staged
git reset --soft HEAD~1

# What happens:
# - HEAD moves back one commit
# - Staging area unchanged (changes still staged)
# - Working directory unchanged

# Useful for: fixing commit message, combining commits

# Homestead example: Fix commit message
git reset --soft HEAD~1
# Commit gone, changes still staged
git commit -m "Fix coop door timer DST calculation"
# Better commit message
```

---

### 2) Mixed Reset (Default)

**Context:** Moving HEAD and unstaging changes.

```bash
# Reset last commit, unstage changes
git reset HEAD~1
# Or explicitly:
git reset --mixed HEAD~1

# What happens:
# - HEAD moves back one commit
# - Staging area reset (changes unstaged)
# - Working directory unchanged (files still modified)

# Useful for: restaging files separately

# Homestead example: Separate commits
git reset HEAD~1
# Commit gone, changes unstaged
git add solar_logger.py
git commit -m "Fix solar aggregation bug"
git add config.json
git commit -m "Update solar config for new sensor"
# Two separate commits
```

---

### 3) Hard Reset

**Context:** Moving HEAD and discarding all changes.

```bash
# Reset last commit, discard all changes
git reset --hard HEAD~1

# What happens:
# - HEAD moves back one commit
# - Staging area reset
# - Working directory reset (changes discarded)

# WARNING: Destructive! Use with caution

# Homestead example: Discard experimental changes
# First, backup if unsure:
git stash
# Or create branch:
git switch -c experiment-backup
git switch main
git reset --hard HEAD~1
# Changes discarded
```

---

### 4) Reset to Specific Commit

**Context:** Resetting to a specific commit hash.

```bash
# Reset to specific commit
git reset --hard <commit-hash>

# Example:
git reset --hard a3f5b2c

# Moves branch to that exact commit
# Discards all changes after that commit

# Homestead example: Reset to known good state
git log --oneline
# Find commit hash
git reset --hard abc123d
# Back to that commit
```

---

### 5) Git Revert

**Context:** Safely undoing commits in shared history.

```bash
# Revert a commit (creates new commit)
git revert <commit-hash>

# Example:
git revert a3f5b2c

# Creates new commit that undoes the changes
# History preserved, safe for shared branches

# Homestead example: Revert bad deploy
git revert abc123d
git push origin main
# New commit undoes bad change
# History preserved
```

---

### 6) Reverting Multiple Commits

**Context:** Reverting several commits at once.

```bash
# Revert multiple commits
git revert <commit1> <commit2> <commit3>

# Git creates revert commits for each
# One revert commit per original commit

# Homestead example: Revert multiple bad commits
git revert abc123 def456 ghi789
# Creates three revert commits
# History shows what was done and undone
```

---

### 7) Git Restore (File-Level)

**Context:** Restoring files without moving branch pointer.

```bash
# Restore file from last commit
git restore filename.js

# Restore file from specific commit
git restore --source=HEAD~2 filename.js

# Unstage file (restore from staging)
git restore --staged filename.js

# Homestead example: Restore config file
git restore config.json
# File restored to match last commit
# Other files unchanged
```

---

### 8) Git Reflog

**Context:** Finding "lost" commits.

```bash
# View reflog
git reflog

# Shows:
# abc123 HEAD@{0}: reset: moving to HEAD~1
# def456 HEAD@{1}: commit: Added sensor validation
# ghi789 HEAD@{2}: commit: Initial API setup

# Even after reset, commits still exist
# Can recover from reflog

# Homestead example: Finding lost commits
git reflog
# See where HEAD has been
# Find commit before reset
```

---

### 9) Recovering from Reset

**Context:** Using reflog to restore lost work.

```bash
# Accidentally reset too far
git reset --hard HEAD~5

# Check reflog
git reflog
# Find commit before reset

# Recover by resetting to that commit
git reset --hard <commit-hash-from-reflog>

# Or create branch from that commit
git switch -c recovered-work <commit-hash>

# Homestead example: Recovering lost work
git reflog
# See: abc123 HEAD@{1}: commit: Add pig barn monitoring
git reset --hard abc123
# Or:
git switch -c recovered abc123
# Work restored
```

---

### 10) Reset vs Revert Decision

**Context:** Choosing between reset and revert.

```bash
# Use reset when:
# - Commit is local, not pushed
# - Working alone
# - Cleaning up before push

# Example: Fix local commit message
git reset --soft HEAD~1
git commit -m "Better message"

# Use revert when:
# - Commit is pushed/shared
# - Others may have pulled it
# - Working on shared branches

# Example: Undo pushed bad commit
git revert <bad-commit-hash>
git push origin main

# Homestead example: Local cleanup
git reset --soft HEAD~1
# Safe: not pushed yet

# Homestead example: Shared history
git revert abc123d
git push origin main
# Safe: doesn't rewrite shared history
```

---

### 11) Restoring Staged Changes

**Context:** Unstaging files.

```bash
# Unstage file (restore from staging)
git restore --staged filename.js

# Or older syntax:
git reset HEAD filename.js

# File remains modified in working directory
# Just removed from staging area

# Homestead example: Unstaging file
git restore --staged config.json
# File unstaged, still modified
```

---

### 12) Checking What Will Be Lost

**Context:** Inspecting commits before resetting.

```bash
# See commits that will be lost
git log HEAD~5..HEAD

# Shows last 5 commits
# Understand what you're resetting

# Homestead example: Checking before reset
git log HEAD~3..HEAD
# See what commits will be lost
# Then decide if reset is safe
```

---

## Chapter 3.11: Tags and Releases

### 1) Creating Lightweight Tag

**Context:** Simple tag pointing to current commit.

```bash
# Create lightweight tag
git tag v1.0.0

# Just a name pointing to current commit
# No metadata, no message

# Homestead example: Local experiment tag
git tag experiment-checkpoint
# Simple tag for personal reference
```

---

### 2) Creating Annotated Tag

**Context:** Tag with metadata and message.

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release 1.0.0"

# Includes:
# - Tag name
# - Tagger name and email
# - Date
# - Message

# Homestead example: Production release tag
git tag -a v1.0.0 -m "Initial production release of solar logger API

- RESTful endpoints for sensor data
- Authentication via API keys
- Database schema v1
- Deployed to production server"
```

---

### 3) Tagging Older Commits

**Context:** Tagging commits from the past.

```bash
# Tag specific commit
git tag -a v0.9.0 <commit-hash> -m "Last beta release"

# Example:
git tag -a v0.9.0 a3f92d4 -m "Last beta release"

# Useful for retroactive tagging

# Homestead example: Retroactive tag
git log --oneline --since="2 months ago"
# Find commit hash
git tag -a v1.1.0 abc123d -m "Retroactive tag: Coop door v1.1.0

Tagged after the fact. This was the version deployed on 2024-01-15."
```

---

### 4) Listing Tags

**Context:** Viewing all tags.

```bash
# List all tags
git tag

# Output:
# v0.1.0
# v0.2.0
# v1.0.0
# v1.1.0

# Filter tags
git tag -l "v1.*"

# Shows only v1.x.x tags

# Homestead example: Listing tags
git tag
# See all version tags
git tag -l "v1.*"
# See only version 1 tags
```

---

### 5) Inspecting Tags

**Context:** Viewing tag details.

```bash
# Show tag details
git show v1.0.0

# For annotated tags: shows metadata, message, commit
# For lightweight tags: shows only commit

# Homestead example: Viewing release tag
git show v1.2.0
# See tag metadata and commit details
```

---

### 6) Pushing Single Tag

**Context:** Sharing a tag with remote.

```bash
# Push specific tag
git push origin v1.0.0

# Sends tag to remote
# Others can now see and checkout the tag

# Homestead example: Sharing release tag
git push origin v1.2.0
# Tag now on remote
```

---

### 7) Pushing All Tags

**Context:** Sharing all tags at once.

```bash
# Push all tags
git push origin --tags

# Pushes all local tags to remote
# Useful when syncing tags

# Homestead example: Syncing all tags
git push origin --tags
# All tags pushed at once
```

---

### 8) Checking Out Tags

**Context:** Viewing code at a specific tag.

```bash
# Checkout tag (detached HEAD)
git checkout v1.0.0

# Puts you in detached HEAD state
# Viewing that specific commit
# Can't commit directly

# Create branch from tag if needed
git checkout -b hotfix-from-v1.0.0 v1.0.0

# Homestead example: Checking out release
git checkout v1.2.0
# View exact release state
```

---

### 9) Semantic Versioning

**Context:** Using MAJOR.MINOR.PATCH format.

```bash
# Version progression:
v1.0.0  # First stable release
v1.0.1  # Bug fix (patch)
v1.1.0  # New feature (minor)
v2.0.0  # Breaking change (major)

# Tag examples:
git tag -a v1.0.0 -m "First stable release"
git tag -a v1.0.1 -m "Fix voltage rounding bug"
git tag -a v1.1.0 -m "Add email alerts"
git tag -a v2.0.0 -m "Reworked database schema (breaking)"

# Homestead example: Version progression
# v0.1.0 - First deployable API
# v0.2.0 - Added authentication
# v0.2.1 - Fixed temperature parsing bug
# v1.0.0 - Stable public API
# v2.0.0 - Reworked database schema (breaking)
```

---

### 10) Pre-release Versions

**Context:** Tagging alpha, beta, and release candidates.

```bash
# Pre-release tags:
git tag -a v1.0.0-alpha.1 -m "Early testing"
git tag -a v1.0.0-beta.1 -m "Beta testing"
git tag -a v1.0.0-rc.1 -m "Release candidate"
git tag -a v1.0.0 -m "Final release"

# Homestead example: Release process
git tag -a v1.0.0-alpha.1 -m "Early testing"
git tag -a v1.0.0-beta.1 -m "Beta testing"
git tag -a v1.0.0-rc.1 -m "Release candidate"
git tag -a v1.0.0 -m "Final release"
```

---

### 11) Deleting Tags

**Context:** Removing tags (use with caution).

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0

# WARNING: Only delete tags that haven't been shared
# Or that you're certain no one depends on

# Homestead example: Deleting local tag
git tag -d experiment-checkpoint
# Removes local tag only
```

---

### 12) Listing Tags with Details

**Context:** Viewing tags with commit information.

```bash
# List tags with commit info
git tag -l -n1

# Shows:
# v0.1.0         First deployable API
# v0.2.0         Added authentication
# v1.0.0         Stable public API

# Sort by version
git tag --sort=-version:refname

# Shows tags in version order (newest first)

# Homestead example: Viewing tag details
git tag -l -n1
# See tag names and first line of messages
git tag --sort=-version:refname
# See tags sorted by version
```

---

### 13) Deployment from Tags

**Context:** Using tags for reproducible deployments.

```bash
# Deployment workflow:
# 1. Tag release
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0

# 2. Deploy script checks out tag
# deploy.sh:
# git fetch origin
# git checkout v1.2.0
# npm install
# npm run build
# ./deploy.sh

# Deploy exact version, not latest main

# Homestead example: Deploying tagged version
git tag -a v1.2.0 -m "Coop door automation v1.2.0"
git push origin v1.2.0
# Deploy script checks out v1.2.0
# Production runs exact tagged version
```

---

### 14) Rollback Using Tags

**Context:** Returning to previous tagged version.

```bash
# Find previous tag
git tag --sort=-version:refname | head -2

# Shows two most recent tags
# Example: v1.2.0, v1.1.0

# Checkout previous tag
git checkout v1.1.0

# Deploy that version
# ./deploy.sh

# Homestead example: Rolling back
git tag --sort=-version:refname | head -2
# See: v1.2.0, v1.1.0
git checkout v1.1.0
# Deploy v1.1.0
# Back to known good state
```

---

### 15) Multi-Component Versioning

**Context:** Tagging different components separately.

```bash
# Tag components separately:
git tag -a api-v1.3.0 -m "API v1.3.0 release"
git tag -a frontend-v2.1.0 -m "Frontend v2.1.0 release"
git tag -a firmware-v1.0.0 -m "Firmware v1.0.0 release"

# Or monorepo approach:
git tag -a v1.3.0 -m "Homestead system v1.3.0

- API: Added new endpoints
- Frontend: Updated UI
- Firmware: Bug fixes"

# Homestead example: Component versioning
# Tag each component separately
# Or use single version for entire system
```

---

## Summary

These examples demonstrate:

1. **Chapter 3.09:** Creating .gitignore files, using patterns (wildcards, directories, negation), removing tracked files, and setting up global ignores
2. **Chapter 3.10:** Using git reset (soft, mixed, hard), git revert for safe undo, git restore for files, and git reflog for recovery
3. **Chapter 3.11:** Creating tags (lightweight vs annotated), listing and inspecting tags, pushing tags, semantic versioning, and using tags for deployment

All examples use homestead automation scenarios to make concepts concrete and relatable.
