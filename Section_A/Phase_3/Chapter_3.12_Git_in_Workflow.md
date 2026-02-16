## Section A Phase 3 · Chapter 3.12: Git in Your Workflow

Feature-branch workflow; code review; deployment from branches; integration with Phase 3 and beyond.

You've learned Git's core concepts: repositories, commits, branches, merging, remotes, and tags. Now you'll learn how to assemble these into a practical daily workflow. This chapter shows how to use Git effectively in real projects: feature branches, code review workflows, deployment strategies, and how Git fits into the broader development process.

## Learning Objectives

By the end of this chapter, you should be able to:
- Apply a simple feature-branch workflow: main stable, work in branches, merge after review.
- Understand how Git enables code review workflows.
- Deploy from branches or tags and keep main deployable.
- See how Git fits into Express (Phase 3) and later phases (APIs, dashboards).
- Develop practical daily Git habits.

---

## 1) Feature-Branch Workflow

The feature-branch workflow is the most common Git workflow. It keeps `main` stable and deployable while allowing parallel development in branches.

### The Core Principle

**Main is always deployable.** New work happens in branches. Branches are merged into `main` only after they're complete and tested.

### The Workflow

1. **Start from main:** `git switch main` and `git pull origin main`
2. **Create feature branch:** `git switch -c feature/new-thing`
3. **Make changes:** Commit frequently as you work
4. **Push branch:** `git push origin feature/new-thing`
5. **Review:** Code review (Pull Request on GitHub, or direct merge)
6. **Merge:** Merge into `main` when approved
7. **Clean up:** Delete branch, pull updated `main`

### Why This Works

- **Main stays stable:** Only tested, reviewed code reaches `main`
- **Parallel work:** Multiple features can be developed simultaneously
- **Clear history:** Each feature has its own branch with clear commits
- **Easy rollback:** If a feature breaks things, you can revert the merge

### Homestead Example: Adding a New Feature

You want to add email alerts to your solar logger:

```bash
# 1. Start from main
git switch main
git pull origin main

# 2. Create feature branch
git switch -c feature/email-alerts

# 3. Make changes
# ... edit code ...
git add .
git commit -m "Add email configuration"

# ... more changes ...
git add .
git commit -m "Implement email sending on low battery"

# 4. Push branch
git push origin feature/email-alerts

# 5. Code review happens (see Chapter 3.14 for GitHub PRs)

# 6. After approval, merge on main
git switch main
git pull origin main
git merge feature/email-alerts
git push origin main

# 7. Clean up
git branch -d feature/email-alerts
```

### Keeping Branches Short-Lived

Keep feature branches short-lived. Sync regularly with `main`:

```bash
# While working on feature branch
git switch feature/my-feature
git merge main  # or git rebase main
```

This prevents branches from diverging too far from `main`, making merges easier.

### Homestead Example: Syncing with Main

You've been working on `feature/sensor-calibration` for a few days. Meanwhile, `main` has new commits. Sync your branch:

```bash
git switch feature/sensor-calibration
git merge main
# Resolve any conflicts
git push origin feature/sensor-calibration
```

Your branch is now up-to-date with `main`. The merge is easier because you synced regularly.

---

## 2) Code Review and Collaboration

Git enables code review by providing clear diffs and branch-based workflows. Code review happens before merging branches into `main`.

### What Code Review Is

Code review is the process of having others examine your changes before they merge. Reviewers check:
- **Correctness:** Does the code work?
- **Quality:** Is it well-written?
- **Style:** Does it follow project conventions?
- **Tests:** Are there tests? Do they pass?

### How Git Enables Review

Git provides:
- **Clear diffs:** `git diff` shows exactly what changed
- **Branch isolation:** Each feature is isolated in its own branch
- **History:** Reviewers can see commit history and messages
- **Easy iteration:** Make changes, push updates, review again

### Review Workflow

1. **Push branch:** `git push origin feature-branch`
2. **Request review:** Ask others to review (GitHub PR, email, in-person)
3. **Reviewers examine:** Look at diff, test changes, comment
4. **Address feedback:** Make changes, commit, push updates
5. **Approve:** Reviewers approve when satisfied
6. **Merge:** Merge into `main` after approval

### Homestead Example: Code Review Process

You've implemented a new sensor reading function:

```bash
git switch -c feature/temperature-sensor
# ... implement ...
git add .
git commit -m "Add temperature sensor reading"
git push origin feature/temperature-sensor
```

Reviewer examines:
- Code: "Consider adding error handling for sensor timeout"
- Tests: "Add test for sensor failure case"
- Style: "Function name should be `read_temperature()` not `get_temp()`"

You address feedback:

```bash
# Make changes
git add .
git commit -m "Add error handling and tests"
git push origin feature/temperature-sensor
```

Reviewer approves. You merge:

```bash
git switch main
git merge feature/temperature-sensor
git push origin main
```

### Review Without GitHub

GitHub Pull Requests are convenient, but Git enables review without them:

- **Email patches:** `git format-patch` and `git send-email`
- **Shared server:** Push to shared repo, review via `git log` and `git show`
- **In-person:** Review together, merge when approved

The workflow is the same: review before merging.

### Homestead Example: Review on Shared Server

You have a Gitea server on your local network:

```bash
# Push to shared server
git remote add gitea http://gitea.local/homestead/repo.git
git push gitea feature/new-sensor

# Reviewer clones or pulls
git clone http://gitea.local/homestead/repo.git
git switch feature/new-sensor
# Review code, test
# Approve via email or in-person

# Merge when approved
git switch main
git merge feature/new-sensor
git push gitea main
```

Git provides the version control. The platform (GitHub, Gitea, etc.) adds convenience features.

---

## 3) Deployment from Branches or Tags

Deployment is the process of moving code from your repository to where it runs (server, Raspberry Pi, etc.). Git helps by providing clear deployment targets.

### Deploy from Main

Many teams deploy from `main`:

```bash
# On deployment server
git clone <repo-url>
cd <repo>
git switch main
git pull origin main
# Run deployment script
./deploy.sh
```

**Advantage:** Simple. `main` is always the latest stable code.

**Requirement:** `main` must always be deployable. No broken code on `main`.

### Deploy from Tags

Deploy specific versions using tags:

```bash
# On deployment server
git clone <repo-url>
cd <repo>
git checkout v1.2.0
# Run deployment script
./deploy.sh
```

**Advantage:** Reproducible. You deploy exactly what you tagged, not whatever happens to be on `main`.

**Use case:** Production deployments, releases, rollbacks.

### Homestead Example: Deploying Solar Logger

**Option 1: Deploy from main**

Your deployment script:

```bash
#!/bin/bash
# deploy.sh
cd /opt/solar-logger
git pull origin main
pip install -r requirements.txt
systemctl restart solar-logger
```

Every time you run this, you get the latest `main`. Simple, but requires `main` to always be stable.

**Option 2: Deploy from tag**

Your deployment script:

```bash
#!/bin/bash
# deploy.sh
VERSION=$1
cd /opt/solar-logger
git fetch origin
git checkout $VERSION
pip install -r requirements.txt
systemctl restart solar-logger
```

Deploy specific version:

```bash
./deploy.sh v1.2.0
```

You deploy exactly `v1.2.0`, not whatever is on `main` now.

### CI/CD Integration

Continuous Integration (CI) can automate deployment:

1. **Push to main:** `git push origin main`
2. **CI runs:** Tests run automatically
3. **If tests pass:** CI deploys automatically
4. **If tests fail:** Deployment stops

This ensures only tested code deploys.

### Homestead Example: CI/CD Workflow

Your CI script (simplified):

```bash
# On push to main
git clone <repo>
cd <repo>
git checkout main

# Run tests
pytest
if [ $? -ne 0 ]; then
  echo "Tests failed, not deploying"
  exit 1
fi

# Deploy
./deploy.sh
```

Only deploy if tests pass. `main` stays deployable.

---

## 4) Keeping Main Deployable

The feature-branch workflow only works if `main` is always deployable. This requires discipline.

### Rules for Main

1. **No direct commits to main:** All changes come through branches
2. **All changes reviewed:** Merge only after review
3. **Tests must pass:** Don't merge failing tests
4. **Main builds:** Code must compile/run
5. **Tag releases:** Tag stable versions for deployment

### What "Deployable" Means

"Deployable" means:
- Code runs without errors
- Tests pass
- No known critical bugs
- Configuration is correct
- Dependencies are specified

It doesn't mean "perfect" or "feature-complete." It means "safe to deploy."

### Homestead Example: Maintaining Deployable Main

**Good:** You merge a feature branch after:
- Code review
- Tests pass
- No breaking changes
- Documentation updated

**Bad:** You merge a feature branch with:
- Failing tests
- Known bugs
- Breaking changes to API
- Missing dependencies

The first keeps `main` deployable. The second breaks it.

### Recovering Broken Main

If `main` breaks:

1. **Revert the bad merge:** `git revert <merge-commit>`
2. **Or fix immediately:** Create hotfix branch, fix, merge
3. **Prevent future breaks:** Add CI checks, require tests

### Homestead Example: Hotfix Workflow

Production is broken. You need to fix it immediately:

```bash
# Create hotfix branch from main
git switch main
git pull origin main
git switch -c hotfix/critical-bug

# Fix the bug
# ... make changes ...
git add .
git commit -m "Fix critical bug in sensor reading"

# Merge immediately (skip review for critical fixes, or fast-track review)
git switch main
git merge hotfix/critical-bug
git push origin main

# Tag the fix
git tag -a v1.2.1 -m "Hotfix: critical bug"
git push origin v1.2.1

# Deploy
./deploy.sh v1.2.1
```

Main is fixed and deployable again.

---

## 5) Daily Git Habits

Effective Git use comes from good daily habits.

### Start of Day

```bash
# Update main
git switch main
git pull origin main

# Check what you're working on
git branch
```

### During Work

```bash
# Commit frequently
git add .
git commit -m "Clear commit message"

# Push regularly (for backup)
git push origin feature-branch
```

### End of Day

```bash
# Commit any uncommitted work
git add .
git commit -m "WIP: progress on feature"

# Push for backup
git push origin feature-branch
```

### Before Switching Tasks

```bash
# Commit or stash
git add .
git commit -m "Checkpoint: feature X progress"
# or
git stash

# Switch to other task
git switch other-branch
```

### Homestead Example: Daily Workflow

**Morning:**

```bash
git switch main
git pull origin main
git switch -c feature/coop-door-automation
```

**During work:**

```bash
# Make changes, test
git add .
git commit -m "Add sunrise/sunset calculation"

# More changes
git add .
git commit -m "Add door control logic"

# Push for backup
git push origin feature/coop-door-automation
```

**End of day:**

```bash
# Final commit
git add .
git commit -m "WIP: door automation, need to add tests"
git push origin feature/coop-door-automation
```

Tomorrow, you continue where you left off.

---

## 6) Integration with Future Phases

Git underpins everything that follows in this curriculum.

### Phase 3: Express Web Applications

Your Express app lives in a Git repository:

```
homestead-api/
├── .gitignore          # Ignore node_modules, .env
├── package.json
├── server.js
├── routes/
└── tests/
```

- **Config in .gitignore:** Secrets stay out of Git
- **Deploy from main or tag:** Consistent deployments
- **Feature branches:** New endpoints in branches
- **Code review:** Review API changes before merging

### Phase 4/5: Frontend (HTML, JavaScript, CSS)

Frontend code in same repo or subdirectory:

```
homestead-app/
├── backend/           # Express API
├── frontend/          # HTML, JS, CSS
└── shared/            # Shared code
```

Same Git discipline:
- Feature branches for UI changes
- Review before merging
- Deploy from main or tags

### Phase 6: Databases

Database migrations in Git:

```
homestead-api/
├── migrations/
│   ├── 001_initial_schema.sql
│   └── 002_add_sensors_table.sql
└── seeds/
```

- **Migrations versioned:** Track database changes
- **Review migrations:** Review schema changes
- **Deploy with code:** Migrations run as part of deployment

### Homestead Example: Full-Stack Repository

Your homestead automation system:

```
homestead-automation/
├── .gitignore
├── README.md
├── backend/              # Express API
│   ├── server.js
│   ├── routes/
│   └── migrations/
├── frontend/            # Web dashboard
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── firmware/            # ESP32 MicroPython
│   └── main.py
├── scripts/             # Deployment scripts
│   └── deploy.sh
└── docs/                # Documentation
```

All versioned in Git:
- Feature branches for each component
- Review before merging
- Deploy from tags
- Git is the boundary for "what's in production"

---

## 7) Common Workflow Patterns

### Pattern 1: Small Feature

```bash
git switch main
git pull origin main
git switch -c feature/small-change
# Make change
git add .
git commit -m "Add small feature"
git push origin feature/small-change
# Review, merge
```

### Pattern 2: Large Feature

```bash
git switch main
git pull origin main
git switch -c feature/large-feature
# Work for days/weeks
# Commit frequently
# Sync with main regularly: git merge main
# Push regularly
# Review when complete
# Merge
```

### Pattern 3: Bug Fix

```bash
git switch main
git pull origin main
git switch -c fix/bug-name
# Fix bug
git add .
git commit -m "Fix: bug description"
git push origin fix/bug-name
# Review, merge
```

### Pattern 4: Hotfix

```bash
git switch main
git pull origin main
git switch -c hotfix/critical
# Fix immediately
git add .
git commit -m "Hotfix: critical issue"
git switch main
git merge hotfix/critical
git push origin main
git tag -a v1.2.1 -m "Hotfix release"
git push origin v1.2.1
# Deploy
```

### Homestead Example: Workflow Patterns

**Small feature:** Add a new config option

```bash
git switch -c feature/config-option
# Add option, commit, push, review, merge
```

**Large feature:** Rewrite sensor reading system

```bash
git switch -c feature/sensor-rewrite
# Work for weeks, commit frequently, sync with main regularly
# When complete, review, merge
```

**Bug fix:** Fix sensor timeout

```bash
git switch -c fix/sensor-timeout
# Fix, commit, push, review, merge
```

**Hotfix:** Critical security issue

```bash
git switch -c hotfix/security-fix
# Fix immediately, merge, tag, deploy
```

---

## 8) Common Mistakes and How to Avoid Them

### Mistake: Committing Directly to Main

**Symptom:** You commit directly to `main`, breaking the deployable state.

**Fix:** Always work in branches. If you committed to `main`, create a branch from that commit, reset `main`, then merge the branch.

**Prevention:** Use branch protection (GitHub) or discipline. Never commit directly to `main`.

### Mistake: Long-Lived Branches

**Symptom:** Feature branch diverges far from `main`, making merge difficult.

**Fix:** Merge `main` into your branch regularly. Or rebase your branch onto `main`.

**Prevention:** Keep branches short-lived. Sync with `main` at least daily.

### Mistake: Merging Without Review

**Symptom:** You merge your own PR without review, introducing bugs.

**Fix:** Always get review, even for small changes. Use a second pair of eyes.

**Prevention:** Make review a requirement. Use branch protection to enforce it.

### Mistake: Broken Main

**Symptom:** `main` has failing tests or broken code.

**Fix:** Revert the bad merge or fix immediately with a hotfix.

**Prevention:** Require tests to pass before merging. Use CI to enforce.

### Homestead Example: Learning from Mistakes

**Mistake:** You committed directly to `main` and broke production.

**Fix:**

```bash
# Create branch from current main
git switch -c recovery
git switch main
git reset --hard origin/main  # Reset to remote state
git switch recovery
git switch main
git merge recovery  # Merge through proper workflow
```

**Prevention:** Always use branches. Make it a habit.

---

## 9) Review: Git Workflow in One Page

Before moving on, you should be able to state in your own words:

1. **What is the feature-branch workflow?** Main stays stable, work happens in branches, merge after review.

2. **Why keep main deployable?** So you can deploy anytime without breaking production.

3. **How do you deploy?** From `main` (latest) or from tags (specific versions).

4. **What are good daily Git habits?** Start from updated main, commit frequently, push regularly, use branches.

5. **How does Git fit into future phases?** Everything lives in Git: Express apps, frontend, databases, firmware. Git is the boundary for "what's in production."

If any of these is fuzzy, revisit that section. The next chapters assume you understand Git workflows and can use Git effectively in daily development.

---

## 10) Bridge to Section A Phase 3 Chapter 3.11 — Tags and Releases

In Section A Phase 3 Chapter 3.11 you learned about tags and releases. This chapter showed how tags fit into deployment workflows: deploy from tags for reproducibility, tag releases for production. Combined with feature-branch workflows, tags give you control over what gets deployed and when.

The workflow is: develop in branches, review, merge to main, tag releases, deploy from tags. This creates a clear, reproducible deployment process.

---

## Summary

- Use a feature-branch workflow: main stable, work in branches, merge after review.
- Keep main deployable: no broken code, tests pass, reviewed before merging.
- Deploy from main (latest) or tags (specific versions).
- Develop good daily Git habits: start from updated main, commit frequently, push regularly.
- Git underpins everything: Express apps, frontend, databases, firmware all live in Git.
- Version control is the boundary for "what's in production."

Git workflows enable collaboration and deployment. The next chapters show how GitHub adds features (Pull Requests, Issues, Actions) that make these workflows easier.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.13 — Git vs GitHub** (`Chapter_3.13_Git_vs_GitHub.md`).

You've learned Git workflows and how to use Git for collaboration. But what is GitHub? Is it the same as Git? Do you need it? The next chapter clarifies the distinction between Git (the tool) and GitHub (the platform), and explains what GitHub adds beyond Git's core functionality.
