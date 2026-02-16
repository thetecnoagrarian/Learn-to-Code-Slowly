## Section A Phase 3 · Chapter 3.14: GitHub Workflows — Pull Requests, Issues, and Collaboration

Pull Requests; Issues; GitHub Actions basics; collaboration workflows; best practices.

You already know Git can track time and state without any platform. GitHub is what happens when you put a shared remote behind a web UI and then build human workflows around it: review, discussion, task tracking, automation, permissions, and "social proof." This chapter is not about learning new Git commands. It's about learning how teams behave around Git when the collaboration surface is GitHub.

## Learning Objectives

By the end of this chapter, you should be able to:
- Explain what a Pull Request is as a workflow layer on top of Git branches.
- Use Issues as a structured "work ledger" for bugs, tasks, and features.
- Connect commits ⇄ PRs ⇄ Issues so history tells a coherent story.
- Describe what GitHub Actions does, when it helps, and how it can fail.
- Apply collaboration best practices that keep main stable and work reviewable.

---

## 1) Pull Requests: Code Review Workflow

Pull Requests (PRs) are GitHub's code review feature. They're built on Git branches but add discussion, review, and approval workflows.

### What a Pull Request Is

A Pull Request (PR) is a proposal:
- "Here is a set of commits on a branch."
- "I want to merge them into another branch (usually main)."
- "Before that happens, humans (and automation) should look at it."

Git can merge branches without GitHub. GitHub adds a structured place to review and discuss the merge before it happens.

### What a PR Contains

A PR is basically:
- A base branch (where you want to land), usually `main`
- A compare branch (your feature/fix branch)
- A diff (what changed)
- A discussion timeline (why, tradeoffs, questions, decisions)
- Review state (approve / request changes)
- Status checks (tests, lint, build, security scans)
- Merge controls (merge / squash / rebase options)

### The Core PR Mental Model

A PR is a boundary:
- On one side: work-in-progress on a feature branch
- On the other side: the stable line (`main`)
- The PR is the gate where you decide what crosses that boundary

If you treat `main` as "deployable," then a PR is how you protect it.

### Homestead Example: Creating a Pull Request

You're adding a new feature to your solar logger:

```bash
# Create branch
git switch -c feature/low-battery-alert

# Make changes
# ... edit code ...
git add .
git commit -m "Add low battery alert threshold"

# Push branch
git push origin feature/low-battery-alert
```

On GitHub:
1. Navigate to your repository
2. GitHub shows "feature/low-battery-alert had recent pushes"
3. Click "Compare & pull request"
4. Title: "Add low battery alert threshold"
5. Description: "Adds alert when battery voltage drops below 11.5V. Closes #42."
6. Click "Create pull request"

Now others can review your changes before they merge into `main`.

---

## 2) The Standard Feature-Branch → PR Workflow

This is the "default shape" used almost everywhere:

1. Start from main (clean, up to date)
2. Create a branch for one purpose
3. Commit in small meaningful pieces
4. Push the branch
5. Open a PR
6. Review, adjust, iterate
7. Merge
8. Delete the branch

### Practical Discipline That Makes This Work

**One branch = one intent:**
- "Add low battery alert"
- "Fix timeout retry logic"
- Not: "misc changes"

**Small PRs are cheaper:**
- Smaller diffs get reviewed faster
- Bugs get caught earlier
- Merges conflict less often

**Your PR description should answer:**
- What changed?
- Why did it change?
- How do I verify it works?

If your PR doesn't explain "why," the commit history loses meaning.

### Homestead Example: Complete PR Workflow

You're adding email alerts to your solar logger:

```bash
# 1. Start from main
git switch main
git pull origin main

# 2. Create feature branch
git switch -c feature/email-alerts

# 3. Make changes, commit frequently
git add .
git commit -m "Add email configuration to config.json"

git add .
git commit -m "Implement email sending on low battery"

git add .
git commit -m "Add tests for email alerts"

# 4. Push branch
git push origin feature/email-alerts

# 5. Open PR on GitHub
# Title: "Add email alerts for low battery"
# Description:
#   Adds SMTP email alerts when battery voltage drops below threshold.
#   
#   Changes:
#   - Add email config to config.json
#   - Implement email sending function
#   - Add tests
#   
#   Closes #25
#   
#   How to verify:
#   1. Set battery threshold to current voltage + 1V
#   2. Wait for reading
#   3. Check email inbox

# 6. Review happens
# Reviewer comments: "Consider adding retry logic"
# You add retry logic, push update
# Reviewer approves

# 7. Merge on GitHub
# Click "Merge pull request"

# 8. Clean up locally
git switch main
git pull origin main
git branch -d feature/email-alerts
```

---

## 3) Reviewing Pull Requests

A PR review is not "judging." It's threat-modeling and maintainability work.

### What to Check in a Review

A solid review pass checks:
- **Correctness:** Does it do what it claims?
- **Boundaries:** Are inputs validated? Are assumptions explicit?
- **Failure modes:** What happens when dependencies fail?
- **Clarity:** Can future-you understand it in six months?
- **Scope creep:** Is this PR trying to do too many things?
- **Security:** Does it introduce secrets, unsafe parsing, or risky changes?
- **Testability:** Is there a way to verify behavior?

### Types of Feedback That Are Actually Useful

- "This function mixes parsing + business logic—can we split it?"
- "What happens if the sensor returns malformed JSON?"
- "Can we rename this to match the rest of the codebase vocabulary?"
- "This adds a new config option—where is it documented?"

### What "Approval" Really Means

Approval is not "perfect code." It's "safe enough to merge into the stable line" with known tradeoffs.

### Homestead Example: Reviewing a Pull Request

Someone opens a PR adding a new sensor type. You review it:

1. **Read the description:** Understand what the PR does
2. **Review the diff:** Check the code changes
3. **Add comments:**
   - "Consider adding error handling here"
   - "This function is too long—can we split it?"
   - "Missing docstring"
4. **Request changes:** Ask for improvements
5. **Re-review:** After changes, approve
6. **Merge:** Merge when approved

The PR ensures code quality before it reaches `main`.

---

## 4) Issues: Your Work Ledger

Issues are not "bugs only." Issues are "tracked intent." If commits are a history of what changed, Issues are a history of what we decided to work on.

### What Issues Are Good For

- Bugs with reproduction steps and evidence
- Feature requests with a clear user story
- Tasks (documentation, refactors, cleanup)
- Questions that need a recorded answer
- Planning work in a way that doesn't live only in your head

### Good Issue Structure

A good Issue includes:
- A title that can survive being read alone
- Clear description
- For bugs:
  - Reproduction steps
  - Expected vs actual behavior
  - Environment details (versions, device, OS)
- For features:
  - The problem it solves
  - Constraints
  - Acceptance criteria ("done means…")

Issues are "future-proof memory." If it's not written down, it's not real.

### Homestead Example: Creating Issues

**Bug report:**

Title: "ESP32 sensor reading timeout"
Description:
```
**Describe the bug**
Sensor readings timeout after 30 seconds, causing data gaps.

**To reproduce**
1. Start sensor logger
2. Wait 30 seconds
3. Check logs - timeout error

**Expected behavior**
Sensor should retry and log data continuously.

**Environment**
- ESP32 firmware v1.2.0
- Python 3.9
- Raspberry Pi 4
```

**Feature request:**

Title: "Add email alerts for low battery"
Description:
```
**Feature description**
Send email alerts when battery voltage drops below threshold.

**Use case**
Monitor battery health remotely when away from homestead.

**Proposed solution**
Add email configuration to config.json, send alert via SMTP when threshold reached.

**Acceptance criteria**
- [ ] Email config added to config.json
- [ ] Email sent when voltage < threshold
- [ ] Tests added
- [ ] Documentation updated
```

---

## 5) Linking Issues and Pull Requests

This is where GitHub becomes a coherence machine. The relationship map:
- Issue: "We should do X."
- Branch: "I'm doing X in isolation."
- Commits: "Here are the steps I took to do X."
- PR: "Please review and merge X."
- Merge: "X is now part of main."
- Closed Issue: "The intent is satisfied."

### Auto-Closing Issues

GitHub can close an Issue when a PR merges if your PR description includes a closing keyword like:
- `Fixes #15`
- `Closes #15`
- `Resolves #15`

That turns "work" into a traced thread: problem → solution → merge → closure. Use that. It's free clarity.

### Homestead Example: Linking Work

You create an Issue:

**Issue #15:** "Add solar panel efficiency calculation"

Later, you create a PR that implements it:

**PR description:**
```
Adds solar panel efficiency calculation based on voltage and current readings.

Implements #15
```

When the PR merges, Issue #15 automatically closes. The connection is clear: the PR solved the issue.

### Homestead Example: Multiple Issues in One PR

Sometimes one PR addresses multiple issues:

**PR description:**
```
Fixes multiple sensor reading issues.

- Fixes #42 (timeout handling)
- Fixes #43 (malformed JSON parsing)
- Closes #44 (error logging)

All related to sensor reading reliability.
```

When merged, all three issues close automatically.

---

## 6) GitHub Actions: Automation as a Gatekeeper

Actions are event-driven workflows attached to the repo. Think of Actions as "robots that run when Git events happen."

### Common Triggers

- Push to a branch
- PR opened / updated
- Tag created (release)
- On a schedule (nightly checks)

### What Actions Typically Do

- Run tests
- Run linters / formatters
- Build artifacts
- Scan dependencies
- Deploy (when you're ready for that)

### The Key Mental Model

Actions are part of your boundary discipline:
- A PR is a human gate
- Actions are an automated gate
- Branch protection can require both

### Homestead Example: GitHub Actions for Testing

Your solar logger has tests. Add a workflow:

**.github/workflows/test.yml:**

```yaml
name: Test Solar Logger

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest
      - name: Check code style
        run: flake8 .
```

Now every PR shows test results. You can't merge if tests fail (if you configure branch protection).

### Skeptical Note

Automation can lie if:
- Tests are weak
- "Green build" doesn't cover real behavior
- Secrets are misconfigured
- The workflow is skipped or not required

So: Actions help, but they don't replace thinking.

### Homestead Example: Actions That Can Fail

**Weak test:**

```python
def test_sensor_reading():
    assert True  # Always passes
```

Actions will pass, but the code might be broken. Actions help, but good tests matter more.

---

## 7) Branch Protection: Keeping Main Stable

Branch protection rules turn your intent ("main stays stable") into enforcement.

### Common Guardrails

- Require PR before merge (no direct pushes)
- Require at least 1 approval
- Require status checks to pass
- Prevent force-push
- Prevent branch deletion

This is how you make it harder to do the wrong thing than the right thing.

### Homestead Example: Protecting Main

You protect `main` branch:

1. Go to repository Settings → Branches
2. Add rule for `main`
3. Enable:
   - "Require a pull request before merging"
   - "Require approvals" (1)
   - "Require status checks to pass"
   - "Require branches to be up to date"

Now:
- No direct pushes to `main`
- PRs require approval
- Tests must pass
- `main` stays stable

---

## 8) Collaboration Patterns

### Pattern A: Feature Branch Workflow (Most Common)

Use when you're working inside the same repo with push access.

**Workflow:**
- Branch → commits → PR → review → merge

**Example:**

```bash
git switch -c feature/new-sensor
# ... work ...
git push origin feature/new-sensor
# Open PR, review, merge
```

### Pattern B: Fork Workflow (Common in Open Source)

Use when contributors don't have push access to the main repo.

**Workflow:**
- Fork → branch in fork → PR back to upstream

**Example:**

1. Fork the repository on GitHub
2. Clone your fork
3. Create branch, make changes
4. Push to your fork
5. Open PR from your fork to upstream

Both patterns are just different ways of controlling who can push where.

### Homestead Example: Feature Branch Workflow

You're adding a new feature:

```bash
# Create branch
git switch -c feature/coop-door-automation

# Work, commit, push
git push origin feature/coop-door-automation

# Open PR
# Review happens
# Merge
```

Simple and effective for teams with repository access.

### Homestead Example: Fork Workflow

You want to contribute to someone else's homestead automation project:

1. Fork their repository on GitHub
2. Clone your fork: `git clone https://github.com/yourusername/homestead-automation.git`
3. Create branch: `git switch -c feature/my-improvement`
4. Make changes, commit, push to your fork
5. Open PR from your fork to their repository
6. They review and merge

You don't need push access to their repository.

---

## 9) Best Practices That Keep You Fast

### Pull Request Best Practices

- Keep PRs small and single-purpose
- Don't mix refactors with feature changes unless necessary
- Write descriptions that explain "why"
- Include "how to verify"
- Respond to feedback explicitly (either implement or explain)

### Issue Best Practices

- Don't open Issues that contain multiple unrelated tasks
- If the Issue gets bigger than expected, split it
- Keep acceptance criteria simple and testable
- Close Issues when the work is done (don't let a graveyard form)

### Repo Hygiene Best Practices

- Delete merged branches (keeps the repo readable)
- Use consistent naming (e.g., `feature/...`, `fix/...`, `chore/...`)
- Keep `main` deployable, or admit you don't—and adjust rules accordingly

### Homestead Example: Good vs Bad PR

**Bad PR:**

Title: "Updates"
Description: "Made some changes"

**Good PR:**

Title: "Add low battery alert threshold"
Description:
```
Adds configurable low battery alert threshold to solar logger.

**Changes:**
- Add `low_battery_threshold` to config.json
- Send alert when voltage drops below threshold
- Log alert events

**Testing:**
- Tested with voltage 11.0V (below threshold)
- Alert sent correctly
- Log entry created

Fixes #42
```

The good PR is clear, testable, and links to the issue.

---

## 10) Common Mistakes and How to Avoid Them

### Mistake: "Mega PR" (Too Big to Review)

**Symptom:** Review stalls, bugs slip through, everyone avoids it.

**Fix:** Split into smaller PRs by intent.

**Prevention:** Keep PRs focused. One feature or one bug fix per PR.

### Mistake: PR Description Says Nothing

**Symptom:** The reviewer has to reverse-engineer your intent.

**Fix:** Add purpose + scope + verification steps.

**Prevention:** Write PR descriptions that explain what, why, and how to verify.

### Mistake: Opening PRs Against Stale Main

**Symptom:** Conflicts explode at merge time.

**Fix:** Periodically integrate `main` into your branch (merge or rebase depending on your rules).

**Prevention:** Sync with `main` regularly. Don't let your branch diverge too far.

### Mistake: Treating Issues as Optional

**Symptom:** Work happens, but nobody can explain why later.

**Fix:** If it matters, track it.

**Prevention:** Create Issues for bugs, features, and significant tasks. Link PRs to Issues.

### Homestead Example: Learning from Mistakes

**Mistake:** You opened a PR with 500+ lines of changes mixing three features.

**Fix:** Close that PR, split into three separate PRs:
- PR 1: Add sensor type A
- PR 2: Add sensor type B
- PR 3: Add sensor type C

Each PR is focused and easier to review.

---

## 11) Advanced: GitHub Actions Examples

### Deploy on Tag

Deploy when you create a release tag:

```yaml
name: Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        run: |
          echo "Deploying ${{ github.ref_name }}"
          # Your deployment script
```

### Run Tests on Multiple Python Versions

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.8', '3.9', '3.10', '3.11']
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python ${{ matrix.python-version }}
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      - name: Install and test
        run: |
          pip install -r requirements.txt
          pytest
```

### Homestead Example: Deploy on Tag

When you tag a release, automatically deploy:

**.github/workflows/deploy.yml:**

```yaml
name: Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Raspberry Pi
        run: |
          echo "Deploying ${{ github.ref_name }} to production"
          # SSH to Pi and deploy
          # Or use your deployment script
```

Tag a release:

```bash
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

GitHub Actions automatically runs and deploys.

---

## 12) Review: GitHub Workflows in One Page

Before moving on, you should be able to state in your own words:

1. **What is a Pull Request?** A proposal to merge changes, with review and discussion.

2. **How do you create a PR?** Create branch, make changes, push, open PR on GitHub.

3. **What are Issues?** Bug tracking and project management on GitHub.

4. **How do you link Issues and PRs?** Use "Fixes #42" in PR description or commit message.

5. **What are GitHub Actions?** Automated workflows that run on Git events (push, PR, tag).

6. **What is branch protection?** Rules that enforce quality (require reviews, require tests).

7. **What's a good PR?** Small, focused, clear description, linked to issues.

If any of these is fuzzy, revisit that section. You now have the tools to collaborate effectively on GitHub.

---

## 13) Bridge to Section A Phase 3 Chapter 3.13 — Git vs GitHub

In Section A Phase 3 Chapter 3.13 you learned the distinction between Git (the tool) and GitHub (the platform). This chapter showed you how to use GitHub's features—Pull Requests, Issues, Actions—in practice. These features build on Git's version control to enable collaboration, code review, and automation.

Git provides the foundation: branches, commits, history. GitHub adds the workflow: Pull Requests for review, Issues for tracking, Actions for automation. Together, they create a powerful collaboration platform.

---

## Summary

- **Pull Requests** enable code review before merging.
- **Issues** track bugs, features, and tasks.
- **GitHub Actions** automate workflows (tests, deployment).
- **Branch protection** enforces quality standards.
- **Good PRs** are small, focused, and well-described.
- **Link Issues and PRs** to track work (`Fixes #42`).

GitHub's features transform Git from version control into a collaboration platform. The next phase builds on this foundation as you develop web applications that live in version-controlled repositories.

---

## Bridge / Next

Section A Phase 3 complete. Next: **Section B Phase 1 — HTTP Protocol Fundamentals** (`Section_B/Phase_1/Chapter_1.1_Client_Server_and_Request_Response.md`).

You now understand Git (the tool) and GitHub (the platform). You can version control your code, collaborate through Pull Requests, track work with Issues, and automate with Actions. This foundation supports everything that follows: web applications, APIs, databases, and deployment all rely on version control. Next, you learn how the web works at the protocol level.
