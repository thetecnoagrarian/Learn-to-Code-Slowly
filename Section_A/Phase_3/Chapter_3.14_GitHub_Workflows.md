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

A Pull Request (PR) is a proposal: "Here is a set of commits on a branch. I want to merge them into another branch (usually main). Before that happens, humans (and automation) should look at it."

Git can merge branches without GitHub. GitHub adds a structured place to review and discuss the merge before it happens.

### What a PR Contains

A PR is basically: a base branch (where you want to land, usually main), a compare branch (your feature/fix branch), a diff (what changed), a discussion timeline (why, tradeoffs, questions, decisions), review state (approve or request changes), status checks (tests, lint, build, security scans), and merge controls (merge, squash, rebase options).

### The Core PR Mental Model

A PR is a boundary: on one side is work-in-progress on a feature branch, on the other side is the stable line (main). The PR is the gate where you decide what crosses that boundary.

If you treat main as "deployable," then a PR is how you protect it.

### Homestead Example: Creating a Pull Request

You're adding a new feature to your solar logger. Create a branch called feature/low-battery-alert, make changes, stage and commit with "Add low battery alert threshold", then push your branch to origin.

On GitHub: navigate to your repository. GitHub shows that your feature branch had recent pushes. Click "Compare & pull request". Enter a title like "Add low battery alert threshold". Add a description like "Adds alert when battery voltage drops below 11.5V. Closes #42." Click "Create pull request".

Now others can review your changes before they merge into main.

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

**One branch equals one intent:**
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

You're adding email alerts to your solar logger.

Start from main: switch to main and pull the latest changes from origin main.

Create feature branch: create and switch to a branch called feature/email-alerts.

Make changes, commit frequently: stage and commit with "Add email configuration to config.json". Make more changes, stage and commit with "Implement email sending on low battery". Make more changes, stage and commit with "Add tests for email alerts".

Push branch: push your feature branch to origin.

Open PR on GitHub with a title like "Add email alerts for low battery" and a description explaining: adds SMTP email alerts when battery voltage drops below threshold, changes include adding email config to config.json, implementing email sending function, adding tests, closes issue #25, and how to verify by setting battery threshold to current voltage plus one volt, waiting for reading, then checking email inbox.

Review happens: reviewer comments "Consider adding retry logic". You add retry logic and push an update. Reviewer approves.

Merge on GitHub: click "Merge pull request".

Clean up locally: switch to main, pull the latest changes, then delete your feature branch.

---

## 3) Reviewing Pull Requests

A PR review is not "judging." It's threat-modeling and maintainability work.

### What to Check in a Review

A solid review pass checks correctness (does it do what it claims?), boundaries (are inputs validated? are assumptions explicit?), failure modes (what happens when dependencies fail?), clarity (can future-you understand it in six months?), scope creep (is this PR trying to do too many things?), security (does it introduce secrets, unsafe parsing, or risky changes?), and testability (is there a way to verify behavior?).

### Types of Feedback That Are Actually Useful

- "This function mixes parsing and business logic—can we split it?"
- "What happens if the sensor returns malformed JSON?"
- "Can we rename this to match the rest of the codebase vocabulary?"
- "This adds a new config option—where is it documented?"

### What "Approval" Really Means

Approval is not "perfect code." It's "safe enough to merge into the stable line" with known tradeoffs.

### Homestead Example: Reviewing a Pull Request

Someone opens a PR adding a new sensor type. You review it:

Read the description to understand what the PR does. Review the diff to check the code changes. Add comments like "Consider adding error handling here", "This function is too long—can we split it?", "Missing docstring". Request changes and ask for improvements. Re-review after changes and approve. Merge when approved.

The PR ensures code quality before it reaches main.

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

A good Issue includes: a title that can survive being read alone, clear description. For bugs: reproduction steps, expected vs actual behavior, environment details (versions, device, OS). For features: the problem it solves, constraints, acceptance criteria ("done means…").

Issues are "future-proof memory." If it's not written down, it's not real.

### Homestead Example: Creating Issues

**Bug report:**

Title: "ESP32 sensor reading timeout". Description: describe the bug (sensor readings timeout after 30 seconds, causing data gaps), to reproduce (start sensor logger, wait 30 seconds, check logs for timeout error), expected behavior (sensor should retry and log data continuously), environment (ESP32 firmware v1.2.0, Python 3.9, Raspberry Pi 4).

**Feature request:**

Title: "Add email alerts for low battery". Description: feature description (send email alerts when battery voltage drops below threshold), use case (monitor battery health remotely when away from homestead), proposed solution (add email configuration to config.json, send alert via SMTP when threshold reached), acceptance criteria (email config added to config.json, email sent when voltage below threshold, tests added, documentation updated).

---

## 5) Linking Issues and Pull Requests

This is where GitHub becomes a coherence machine. The relationship map: Issue ("We should do X"), Branch ("I'm doing X in isolation"), Commits ("Here are the steps I took to do X"), PR ("Please review and merge X"), Merge ("X is now part of main"), Closed Issue ("The intent is satisfied").

### Auto-Closing Issues

GitHub can close an Issue when a PR merges if your PR description includes a closing keyword like "Fixes #15", "Closes #15", or "Resolves #15".

That turns "work" into a traced thread: problem → solution → merge → closure. Use that. It's free clarity.

### Homestead Example: Linking Work

You create an Issue: Issue #15 "Add solar panel efficiency calculation".

Later, you create a PR that implements it. PR description: adds solar panel efficiency calculation based on voltage and current readings, implements issue #15.

When the PR merges, Issue #15 automatically closes. The connection is clear: the PR solved the issue.

### Homestead Example: Multiple Issues in One PR

Sometimes one PR addresses multiple issues. PR description: fixes multiple sensor reading issues, fixes issue #42 (timeout handling), fixes issue #43 (malformed JSON parsing), closes issue #44 (error logging), all related to sensor reading reliability.

When merged, all three issues close automatically.

---

## 6) GitHub Actions: Automation as a Gatekeeper

Actions are event-driven workflows attached to the repo. Think of Actions as "robots that run when Git events happen."

### Common Triggers

- Push to a branch
- PR opened or updated
- Tag created (release)
- On a schedule (nightly checks)

### What Actions Typically Do

- Run tests
- Run linters and formatters
- Build artifacts
- Scan dependencies
- Deploy (when you're ready for that)

### The Key Mental Model

Actions are part of your boundary discipline: a PR is a human gate, Actions are an automated gate, branch protection can require both.

### Homestead Example: GitHub Actions for Testing

Your solar logger has tests. Add a workflow file in the .github/workflows directory called test.yml that runs on push and pull request events.

The workflow runs on Ubuntu, checks out the code, sets up Python version 3.9, installs dependencies from requirements.txt, runs tests using pytest, and checks code style using flake8.

Now every PR shows test results. You can't merge if tests fail (if you configure branch protection).

### Skeptical Note

Automation can lie if tests are weak, "green build" doesn't cover real behavior, secrets are misconfigured, or the workflow is skipped or not required.

So: Actions help, but they don't replace thinking.

### Homestead Example: Actions That Can Fail

A weak test that always passes will make Actions pass, but the code might be broken. Actions help, but good tests matter more.

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

You protect main branch: go to repository Settings, then Branches, add rule for main, enable "Require a pull request before merging", "Require approvals" (set to 1), "Require status checks to pass", "Require branches to be up to date".

Now: no direct pushes to main, PRs require approval, tests must pass, main stays stable.

---

## 8) Collaboration Patterns

### Pattern A: Feature Branch Workflow (Most Common)

Use when you're working inside the same repo with push access.

**Workflow:**
- Branch → commits → PR → review → merge

**Example:**

Create and switch to a feature branch like feature/new-sensor, work on changes, push your branch to origin, open PR, review, merge.

### Pattern B: Fork Workflow (Common in Open Source)

Use when contributors don't have push access to the main repo.

**Workflow:**
- Fork → branch in fork → PR back to upstream

**Example:**

Fork the repository on GitHub. Clone your fork. Create branch, make changes. Push to your fork. Open PR from your fork to upstream.

Both patterns are just different ways of controlling who can push where.

### Homestead Example: Feature Branch Workflow

You're adding a new feature: create a branch called feature/coop-door-automation, work, commit, push your branch to origin, open PR, review happens, merge.

Simple and effective for teams with repository access.

### Homestead Example: Fork Workflow

You want to contribute to someone else's homestead automation project:

Fork their repository on GitHub. Clone your fork. Create a branch called feature/my-improvement. Make changes, commit, push to your fork. Open PR from your fork to their repository. They review and merge.

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
- Use consistent naming (e.g., feature/..., fix/..., chore/...)
- Keep main deployable, or admit you don't—and adjust rules accordingly

### Homestead Example: Good vs Bad PR

**Bad PR:**

Title: "Updates". Description: "Made some changes".

**Good PR:**

Title: "Add low battery alert threshold". Description: adds configurable low battery alert threshold to solar logger, changes include adding low_battery_threshold to config.json, sending alert when voltage drops below threshold, logging alert events, testing with voltage 11.0V (below threshold), alert sent correctly, log entry created, fixes issue #42.

The good PR is clear, testable, and links to the issue.

---

## 10) Common Mistakes and How to Avoid Them

### Mistake: "Mega PR" (Too Big to Review)

**Symptom:** Review stalls, bugs slip through, everyone avoids it.

**Fix:** Split into smaller PRs by intent.

**Prevention:** Keep PRs focused. One feature or one bug fix per PR.

### Mistake: PR Description Says Nothing

**Symptom:** The reviewer has to reverse-engineer your intent.

**Fix:** Add purpose plus scope plus verification steps.

**Prevention:** Write PR descriptions that explain what, why, and how to verify.

### Mistake: Opening PRs Against Stale Main

**Symptom:** Conflicts explode at merge time.

**Fix:** Periodically integrate main into your branch (merge or rebase depending on your rules).

**Prevention:** Sync with main regularly. Don't let your branch diverge too far.

### Mistake: Treating Issues as Optional

**Symptom:** Work happens, but nobody can explain why later.

**Fix:** If it matters, track it.

**Prevention:** Create Issues for bugs, features, and significant tasks. Link PRs to Issues.

### Homestead Example: Learning from Mistakes

**Mistake:** You opened a PR with 500+ lines of changes mixing three features.

**Fix:** Close that PR, split into three separate PRs: PR 1 for adding sensor type A, PR 2 for adding sensor type B, PR 3 for adding sensor type C.

Each PR is focused and easier to review.

---

## 11) Advanced: GitHub Actions Examples

### Deploy on Tag

Deploy when you create a release tag. Create a workflow file that triggers on tag pushes matching version tags like v*.

The workflow runs on Ubuntu, checks out the code, then runs your deployment script with the tag name.

### Run Tests on Multiple Python Versions

Create a workflow that runs on push and pull request events, uses a matrix strategy to test on multiple Python versions (3.8, 3.9, 3.10, 3.11), sets up each Python version, installs dependencies, and runs tests.

### Homestead Example: Deploy on Tag

When you tag a release, automatically deploy. Create a workflow file in .github/workflows called deploy.yml that triggers on tag pushes matching version tags.

The workflow runs on Ubuntu, checks out the code, then deploys to your Raspberry Pi by SSHing to the Pi and deploying, or using your deployment script.

Tag a release: create an annotated tag v1.2.0 with a release message, then push the tag to origin.

GitHub Actions automatically runs and deploys.

---

## 12) Bridge to Section A Phase 3 Chapter 3.13 — Git vs GitHub

In Section A Phase 3 Chapter 3.13 you learned the distinction between Git (the tool) and GitHub (the platform). This chapter showed you how to use GitHub's features—Pull Requests, Issues, Actions—in practice. These features build on Git's version control to enable collaboration, code review, and automation.

Git provides the foundation: branches, commits, history. GitHub adds the workflow: Pull Requests for review, Issues for tracking, Actions for automation. Together, they create a powerful collaboration platform.

---

## Summary

- **Pull Requests** enable code review before merging.
- **Issues** track bugs, features, and tasks.
- **GitHub Actions** automate workflows (tests, deployment).
- **Branch protection** enforces quality standards.
- **Good PRs** are small, focused, and well-described.
- **Link Issues and PRs** to track work (Fixes #42).

GitHub's features transform Git from version control into a collaboration platform. The next phase builds on this foundation as you develop web applications that live in version-controlled repositories.

---

## Bridge / Next

Section A Phase 3 complete. Next: **Section B Phase 1 — HTTP Protocol Fundamentals** (`Section_B/Phase_1/Chapter_1.1_Client_Server_and_Request_Response.md`).

You now understand Git (the tool) and GitHub (the platform). You can version control your code, collaborate through Pull Requests, track work with Issues, and automate with Actions. This foundation supports everything that follows: web applications, APIs, databases, and deployment all rely on version control. Next, you learn how the web works at the protocol level.
