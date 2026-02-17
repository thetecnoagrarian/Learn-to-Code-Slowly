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

The feature-branch workflow is the most common Git workflow. It keeps main stable and deployable while allowing parallel development in branches.

### The Core Principle

**Main is always deployable.** New work happens in branches. Branches are merged into main only after they're complete and tested.

### The Workflow

1. **Start from main:** Switch to main and pull the latest changes from origin main.
2. **Create feature branch:** Create and switch to a new branch like feature/new-thing.
3. **Make changes:** Commit frequently as you work.
4. **Push branch:** Push your feature branch to origin.
5. **Review:** Code review (Pull Request on GitHub, or direct merge).
6. **Merge:** Merge into main when approved.
7. **Clean up:** Delete the branch, pull updated main.

### Why This Works

- **Main stays stable:** Only tested, reviewed code reaches main.
- **Parallel work:** Multiple features can be developed simultaneously.
- **Clear history:** Each feature has its own branch with clear commits.
- **Easy rollback:** If a feature breaks things, you can revert the merge.

### Homestead Example: Adding a New Feature

You want to add email alerts to your solar logger.

Start from main: switch to main and pull the latest changes from origin main.

Create feature branch: create and switch to a branch called feature/email-alerts.

Make changes: edit your code, then stage changes and commit with a message like "Add email configuration". Make more changes, stage and commit with "Implement email sending on low battery".

Push branch: push your feature branch to origin.

Code review happens (see Chapter 3.14 for GitHub PRs).

After approval, merge on main: switch to main, pull the latest changes, merge your feature branch, then push main.

Clean up: delete the feature branch locally.

### Keeping Branches Short-Lived

Keep feature branches short-lived. Sync regularly with main: while working on your feature branch, switch to main, pull the latest changes, then switch back to your feature branch and merge main into it (or rebase your branch onto main).

This prevents branches from diverging too far from main, making merges easier.

### Homestead Example: Syncing with Main

You've been working on feature/sensor-calibration for a few days. Meanwhile, main has new commits. Sync your branch: switch to your feature branch, merge main into it, resolve any conflicts, then push your updated feature branch.

Your branch is now up-to-date with main. The merge is easier because you synced regularly.

---

## 2) Code Review and Collaboration

Git enables code review by providing clear diffs and branch-based workflows. Code review happens before merging branches into main.

### What Code Review Is

Code review is the process of having others examine your changes before they merge. Reviewers check correctness (does the code work?), quality (is it well-written?), style (does it follow project conventions?), and tests (are there tests? do they pass?).

### How Git Enables Review

Git provides clear diffs showing exactly what changed, branch isolation where each feature is isolated in its own branch, history where reviewers can see commit history and messages, and easy iteration where you can make changes, push updates, and review again.

### Review Workflow

1. **Push branch:** Push your feature branch to origin.
2. **Request review:** Ask others to review (GitHub PR, email, in-person).
3. **Reviewers examine:** Look at diff, test changes, comment.
4. **Address feedback:** Make changes, commit, push updates.
5. **Approve:** Reviewers approve when satisfied.
6. **Merge:** Merge into main after approval.

### Homestead Example: Code Review Process

You've implemented a new sensor reading function. Create a branch called feature/temperature-sensor, implement your changes, stage and commit with "Add temperature sensor reading", then push your branch.

Reviewer examines: code (consider adding error handling for sensor timeout), tests (add test for sensor failure case), style (function name should be read_temperature not get_temp).

You address feedback: make changes, stage and commit with "Add error handling and tests", then push your updated branch.

Reviewer approves. You merge: switch to main, merge your feature branch, then push main.

### Review Without GitHub

GitHub Pull Requests are convenient, but Git enables review without them: email patches using git format-patch and git send-email, shared server where you push to a shared repo and review via git log and git show, or in-person where you review together and merge when approved.

The workflow is the same: review before merging.

### Homestead Example: Review on Shared Server

You have a Gitea server on your local network. Add the Gitea server as a remote, then push your feature branch to it.

Reviewer clones or pulls the repository, switches to your feature branch, reviews the code and tests it, then approves via email or in-person.

Merge when approved: switch to main, merge your feature branch, then push main to the Gitea server.

Git provides the version control. The platform (GitHub, Gitea, etc.) adds convenience features.

---

## 3) Deployment from Branches or Tags

Deployment is the process of moving code from your repository to where it runs (server, Raspberry Pi, etc.). Git helps by providing clear deployment targets.

### Deploy from Main

Many teams deploy from main. On the deployment server, clone the repository, switch to main, pull the latest changes from origin main, then run your deployment script.

**Advantage:** Simple. main is always the latest stable code.

**Requirement:** main must always be deployable. No broken code on main.

### Deploy from Tags

Deploy specific versions using tags. On the deployment server, clone the repository, checkout a specific tag like v1.2.0, then run your deployment script.

**Advantage:** Reproducible. You deploy exactly what you tagged, not whatever happens to be on main.

**Use case:** Production deployments, releases, rollbacks.

### Homestead Example: Deploying Solar Logger

**Option 1: Deploy from main**

Your deployment script changes to the deployment directory, pulls the latest changes from origin main, installs dependencies, then restarts the service.

Every time you run this, you get the latest main. Simple, but requires main to always be stable.

**Option 2: Deploy from tag**

Your deployment script takes a version number as input, changes to the deployment directory, fetches from origin, checks out the specified version tag, installs dependencies, then restarts the service.

Deploy with a specific version tag as an argument. You deploy exactly that version, not whatever is on main now.

### CI/CD Integration

Continuous Integration (CI) can automate deployment: push to main, CI runs tests automatically, if tests pass CI deploys automatically, if tests fail deployment stops.

This ensures only tested code deploys.

### Homestead Example: CI/CD Workflow

Your CI script clones the repository, checks out main, runs tests, and if tests pass, runs the deployment script. If tests fail, it stops and doesn't deploy.

Only deploy if tests pass. main stays deployable.

---

## 4) Keeping Main Deployable

The feature-branch workflow only works if main is always deployable. This requires discipline.

### Rules for Main

1. **No direct commits to main:** All changes come through branches.
2. **All changes reviewed:** Merge only after review.
3. **Tests must pass:** Don't merge failing tests.
4. **Main builds:** Code must compile/run.
5. **Tag releases:** Tag stable versions for deployment.

### What "Deployable" Means

"Deployable" means code runs without errors, tests pass, no known critical bugs, configuration is correct, and dependencies are specified.

It doesn't mean "perfect" or "feature-complete." It means "safe to deploy."

### Homestead Example: Maintaining Deployable Main

**Good:** You merge a feature branch after code review, tests pass, no breaking changes, and documentation updated.

**Bad:** You merge a feature branch with failing tests, known bugs, breaking changes to API, or missing dependencies.

The first keeps main deployable. The second breaks it.

### Recovering Broken Main

If main breaks: revert the bad merge using git revert followed by the merge commit hash, or fix immediately by creating a hotfix branch, fixing the issue, then merging it.

Prevent future breaks by adding CI checks and requiring tests.

### Homestead Example: Hotfix Workflow

Production is broken. You need to fix it immediately. Create a hotfix branch from main: switch to main, pull the latest changes, then create and switch to a branch called hotfix/critical-bug.

Fix the bug: make changes, stage and commit with "Fix critical bug in sensor reading".

Merge immediately (skip review for critical fixes, or fast-track review): switch to main, merge your hotfix branch, then push main.

Tag the fix: create an annotated tag v1.2.1 with a message "Hotfix: critical bug", then push the tag.

Deploy using the deployment script with the tag version.

Main is fixed and deployable again.

---

## 5) Daily Git Habits

Effective Git use comes from good daily habits.

### Start of Day

Update main: switch to main and pull the latest changes from origin main.

Check what you're working on: list your branches to see what features you have in progress.

### During Work

Commit frequently: stage your changes and commit with a clear commit message.

Push regularly for backup: push your feature branch to origin.

### End of Day

Commit any uncommitted work: stage and commit with a message like "WIP: progress on feature".

Push for backup: push your feature branch to origin.

### Before Switching Tasks

Commit or stash: stage and commit with a checkpoint message like "Checkpoint: feature X progress", or stash your work.

Then switch to your other task branch.

### Homestead Example: Daily Workflow

**Morning:**

Switch to main, pull the latest changes, then create and switch to a branch called feature/coop-door-automation.

**During work:**

Make changes and test, then stage and commit with "Add sunrise/sunset calculation". Make more changes, stage and commit with "Add door control logic". Push for backup.

**End of day:**

Final commit: stage and commit with "WIP: door automation, need to add tests", then push your branch.

Tomorrow, you continue where you left off.

---

## 6) Integration with Future Phases

Git underpins everything that follows in this curriculum.

### Phase 3: Express Web Applications

Your Express app lives in a Git repository with a .gitignore file (ignore node_modules, .env), package.json, server.js, routes directory, and tests directory.

Config in .gitignore keeps secrets out of Git. Deploy from main or tag for consistent deployments. Feature branches for new endpoints. Code review for API changes before merging.

### Phase 4/5: Frontend (HTML, JavaScript, CSS)

Frontend code in same repo or subdirectory: backend directory for Express API, frontend directory for HTML, JS, CSS, and shared directory for shared code.

Same Git discipline: feature branches for UI changes, review before merging, deploy from main or tags.

### Phase 6: Databases

Database migrations in Git: migrations directory with numbered SQL files like 001_initial_schema.sql and 002_add_sensors_table.sql, and seeds directory.

Migrations versioned to track database changes. Review migrations for schema changes. Deploy with code so migrations run as part of deployment.

### Homestead Example: Full-Stack Repository

Your homestead automation system has a .gitignore file, README.md, backend directory with Express API (server.js, routes, migrations), frontend directory with web dashboard (index.html, app.js, styles.css), firmware directory with ESP32 MicroPython (main.py), scripts directory with deployment scripts (deploy.sh), and docs directory for documentation.

All versioned in Git: feature branches for each component, review before merging, deploy from tags, Git is the boundary for "what's in production."

---

## 7) Common Workflow Patterns

### Pattern 1: Small Feature

Switch to main, pull the latest changes, create and switch to a feature branch like feature/small-change, make your change, stage and commit with "Add small feature", push your branch, then review and merge.

### Pattern 2: Large Feature

Switch to main, pull the latest changes, create and switch to a feature branch like feature/large-feature, work for days or weeks, commit frequently, sync with main regularly by merging main into your branch, push regularly, review when complete, then merge.

### Pattern 3: Bug Fix

Switch to main, pull the latest changes, create and switch to a fix branch like fix/bug-name, fix the bug, stage and commit with "Fix: bug description", push your branch, then review and merge.

### Pattern 4: Hotfix

Switch to main, pull the latest changes, create and switch to a hotfix branch like hotfix/critical, fix immediately, stage and commit with "Hotfix: critical issue", switch to main, merge your hotfix branch, push main, create an annotated tag v1.2.1 with "Hotfix release", push the tag, then deploy.

### Homestead Example: Workflow Patterns

**Small feature:** Add a new config option. Create a feature branch, add the option, commit, push, review, merge.

**Large feature:** Rewrite sensor reading system. Create a feature branch, work for weeks, commit frequently, sync with main regularly. When complete, review, merge.

**Bug fix:** Fix sensor timeout. Create a fix branch, fix the issue, commit, push, review, merge.

**Hotfix:** Critical security issue. Create a hotfix branch, fix immediately, merge, tag, deploy.

---

## 8) Common Mistakes and How to Avoid Them

### Mistake: Committing Directly to Main

**Symptom:** You commit directly to main, breaking the deployable state.

**Fix:** Always work in branches. If you committed to main, create a branch from that commit, reset main to match the remote, then merge the branch through the proper workflow.

**Prevention:** Use branch protection (GitHub) or discipline. Never commit directly to main.

### Mistake: Long-Lived Branches

**Symptom:** Feature branch diverges far from main, making merge difficult.

**Fix:** Merge main into your branch regularly. Or rebase your branch onto main.

**Prevention:** Keep branches short-lived. Sync with main at least daily.

### Mistake: Merging Without Review

**Symptom:** You merge your own PR without review, introducing bugs.

**Fix:** Always get review, even for small changes. Use a second pair of eyes.

**Prevention:** Make review a requirement. Use branch protection to enforce it.

### Mistake: Broken Main

**Symptom:** main has failing tests or broken code.

**Fix:** Revert the bad merge or fix immediately with a hotfix.

**Prevention:** Require tests to pass before merging. Use CI to enforce.

### Homestead Example: Learning from Mistakes

**Mistake:** You committed directly to main and broke production.

**Fix:** Create a branch from current main, switch to main and reset it to match the remote state, switch back to your recovery branch, then merge it into main through the proper workflow.

**Prevention:** Always use branches. Make it a habit.

---

## 9) Bridge to Section A Phase 3 Chapter 3.11 — Tags and Releases

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
