## Section A Phase 3 · Chapter 3.13: Git vs GitHub — Understanding the Platform

Git vs GitHub distinction; what GitHub adds to Git; alternatives; when to use what.

You've learned Git—the distributed version control system. You can create commits, branches, merge, rebase, push, pull, and manage history locally. Now you need to understand where GitHub fits—and where it does not. GitHub is not Git. GitHub runs Git under the hood, but it adds collaboration and hosting features. This chapter clarifies the distinction.

## Learning Objectives

By the end of this chapter, you should be able to:
- Explain the difference between Git (tool) and GitHub (platform).
- Describe what GitHub adds beyond Git.
- Know when Git alone is sufficient.
- Identify alternatives (GitLab, Gitea, self-hosted).
- Make deliberate hosting decisions.

---

## 1) Git — The Tool

Git is a distributed version control system. It is installed locally, fully functional offline, complete without any server, and capable of pushing to any remote URL.

### What Git Is

You've been using Git directly: initialize a repository, stage files, commit changes, create branches, merge branches, rebase branches.

Git works entirely on your machine. You do not need internet, GitHub, or any hosting provider. Every clone is a complete repository with full history.

### Git Is Protocol-Agnostic

Git does not care who hosts your remote. These are all equivalent to Git: GitHub URLs, GitLab URLs, SSH URLs to your own server, or local file paths.

From Git's perspective, they are just URLs.

### Homestead Example: Git Alone

You are developing a solar logger on a Raspberry Pi with no internet. Initialize a repository, stage your files, commit with a message like "Initial solar logger".

You now have version history, branches, full recovery, and local snapshots. Git is complete. No GitHub required.

### Homestead Example: Git on Multiple Machines

You have a laptop and a Raspberry Pi, both on your local network. On the Pi, initialize a repository, stage files, commit with "Initial commit".

Share via local network using Git's built-in daemon to export repositories.

On your laptop, clone from the Pi's IP address using the Git protocol.

Git works over your local network without any external service. No GitHub needed.

---

## 2) GitHub — The Platform

GitHub is a hosted service that stores Git repositories and adds collaboration features. GitHub provides a web interface, Pull Requests (code review workflow), Issues (bug tracking), GitHub Actions (automation/CI/CD), access control (teams, permissions), and social features (forks, stars, discussions).

### What GitHub Adds

GitHub is not required to use Git. It enhances Git by adding web interface (browse repositories, view diffs, read code in a browser), Pull Requests (code review workflow built on Git branches), Issues (bug tracking and project management), Actions (CI/CD automation), access control (user permissions, organizations, teams), and social features (stars, forks, discussions).

### GitHub Is Just a Remote

When you add a remote pointing to a GitHub repository URL, then push to origin main, Git sees a remote URL and a place to send commits. GitHub adds a web UI, collaboration tools, and workflow automation. But Git itself doesn't change.

### Homestead Example: Adding GitHub

You've been developing locally. Viewing your commit history shows commits like "Initial commit" and "Added sensor reading".

Now you create a GitHub repository and push: add a remote called origin pointing to your GitHub repository URL, then push main to origin with the upstream flag.

Nothing about your history changes. GitHub now hosts a copy. You can view it in a browser, share it, collaborate on it.

---

## 3) The Core Distinction

Git is a version control tool that works offline, tracks history, and is installed locally. GitHub is a hosting and collaboration platform that is web-based, adds workflow tools, and is a hosted service.

Think of it like this: Git equals the engine. GitHub equals the garage, office, and meeting room built around the engine. You can run the engine without the garage. The garage is built around the engine.

### The Relationship

Git is foundational infrastructure. GitHub is workflow infrastructure. Git handles time and state tracking (as you learned in Section A Phase 1 Chapter 1.7), snapshot-based history, and distributed version control. GitHub adds collaboration layer, social layer, and automation layer.

### Homestead Example: Understanding the Distinction

**Scenario 1: Solo development, no collaboration**

You're building a personal script to log sensor data. Git alone is sufficient: initialize a repository, stage files, commit with "Sensor logger".

No GitHub needed. Git gives you version control, history, branches—everything you need.

**Scenario 2: Collaboration and backup**

You want to share code with a friend, back up your work, review changes before merging, and track bugs. Now GitHub (or similar) becomes valuable. It adds collaboration features Git doesn't provide.

---

## 4) What GitHub Adds Beyond Git

Git handles snapshots, branching, merging, rebasing, and pushing and pulling. GitHub adds structure around collaboration.

### Pull Requests

Pull Requests are a GitHub feature. Git provides branches and merges. GitHub adds review comments, approval workflows, merge buttons, and status checks. PRs are workflow on top of Git.

**Without GitHub:** You merge branches locally after in-person or email review.

**With GitHub:** You open a Pull Request, reviewers comment on specific lines, approve, then merge with a button click.

### Issues

Git does not track bugs. GitHub Issues provide task tracking, bug reports, feature requests, and linking issues to commits.

**Without GitHub:** You track bugs in a separate system (spreadsheet, notes, etc.).

**With GitHub:** Issues are integrated with your repository. Link issues to commits using "Fixes #42" syntax, and they close automatically when PRs merge.

### Actions (CI/CD)

GitHub Actions automate workflows: run tests on push, deploy on tag, build artifacts, schedule jobs. Git does not provide CI/CD.

**Without GitHub:** You run tests manually or set up your own CI server.

**With GitHub:** Actions run automatically on every push or PR. Tests must pass before merging.

### Homestead Example: What GitHub Adds

**Git alone:**

You develop locally: create and switch to a feature branch like feature/email-alerts, make changes, commit with "Add email alerts", push your feature branch to origin.

Review happens via email or in-person. Merge manually: switch to main, merge your feature branch.

**With GitHub:**

Same Git commands: create and switch to a feature branch, make changes, commit, push your feature branch.

Open Pull Request on GitHub. Reviewers comment on specific lines. GitHub Actions runs tests automatically. Merge with button click when approved.

GitHub adds the workflow layer, but Git commands stay the same.

---

## 5) When Git Alone Is Enough

You do not need GitHub if you're working solo, have no collaboration needs, don't need remote backup, don't need PR workflow, and don't need CI/CD. Git alone is sufficient. Many embedded or homestead projects can run entirely local.

### Homestead Example: Git-Only Project

You're building firmware for an ESP32 device. The project is solo development, no collaboration needed, backed up locally to external drive, no code review needed, and no CI/CD needed.

Git alone is perfect. You have version control, history, branches—everything you need. Adding GitHub would add complexity without benefit.

### When Local Git Is Sufficient

- Personal projects
- Embedded firmware
- Local automation scripts
- Learning and experimentation
- Projects with alternative backup (external drive, local server)

---

## 6) When a Platform Makes Sense

You benefit from GitHub (or similar) when collaborating with others, needing code review, wanting remote backup, publishing open source, running automated tests, managing issues, or controlling access permissions. As complexity increases, platform features become valuable.

### Homestead Example: Evolving Needs

**Phase 1: Solo development**

Git alone is fine. Local version control is sufficient.

**Phase 2: Backup and multi-machine access**

Add a remote (GitHub, GitLab, or self-hosted). Push for backup, pull on other machines.

**Phase 3: Collaboration**

Use GitHub's Pull Requests for code review. Use Issues to track bugs. Use Actions for automated testing.

Your needs evolve. Git stays the same. The platform (GitHub) adds features as you need them.

### Homestead Example: When Platform Features Help

You're collaborating with a friend on your homestead automation system:

**Without GitHub:**

Share code via email or USB drive. No code review process. Track bugs in separate document. Manual testing.

**With GitHub:**

Push to shared repository. Pull Requests for code review. Issues track bugs and features. Actions run tests automatically.

GitHub makes collaboration easier, but Git provides the foundation.

---

## 7) Alternatives to GitHub

GitHub is popular, but not unique. All of these work with Git: GitLab, Gitea, Forgejo, Bitbucket, and self-hosted Git servers. Git commands remain identical. You can switch platforms by changing the remote URL.

### GitLab

GitLab provides similar features to GitHub: web interface, Merge Requests (equivalent to Pull Requests), Issues and project management, CI/CD (GitLab CI), and self-hosted option available.

### Gitea / Forgejo

Lightweight, self-hosted Git hosting: simpler than GitHub/GitLab, can run on your own server, good for private projects, fewer features but more control.

### Self-Hosted

You can host Git repositories yourself: Git daemon for read-only access, SSH for push/pull, web interfaces like Gitea or GitLab self-hosted, full control, no external dependencies.

### Bitbucket

Another hosted option, similar to GitHub/GitLab.

### Homestead Example: Choosing a Platform

**Option 1: GitHub (public, free)**

Good for: Open source, learning, public projects. Your homestead automation could be public on GitHub.

**Option 2: Self-hosted Gitea**

Good for: Private projects, full control, no external dependencies. Run on your own server, accessible only on your network.

**Option 3: GitLab (private repos)**

Good for: Private projects, team collaboration. Similar to GitHub but with different pricing/features.

All work with the same Git commands. The choice is about features, pricing, and control.

### Homestead Example: Platform Independence

You develop locally: initialize a repository, stage files, commit with "Initial commit".

Push to GitHub: add a remote called origin pointing to your GitHub repository URL, then push main to origin.

Later, switch to GitLab: change the remote URL to point to your GitLab repository URL, then push main to origin.

Same Git commands. Different platform. Your repository and history are unchanged.

---

## 8) Common Confusions

### "I need GitHub to use Git."

**False.** Git works completely offline. You can use Git entirely locally without any remote.

### "GitHub is Git."

**False.** GitHub runs Git internally but adds workflow tools. Git is the tool, GitHub is a platform built on it.

### "Git commands change depending on platform."

**False.** Git is platform-independent. Pushing to origin main works the same whether the remote is GitHub, GitLab, or your own server.

### "I can only use GitHub."

**False.** Git works with any Git hosting service. You can switch remotes anytime.

### "GitHub is required for collaboration."

**Partially true.** Git alone doesn't provide Pull Requests, Issues, or web interfaces. But you can collaborate with Git alone using email patches, shared servers, or other methods. GitHub makes collaboration easier.

### Homestead Example: Clearing Up Confusion

**Question:** "Do I need a GitHub account to learn Git?"

**Answer:** No. You can learn Git entirely locally. GitHub is useful for backup, collaboration, and learning industry workflows, but Git itself doesn't require it.

**Question:** "Can I use GitLab instead of GitHub?"

**Answer:** Yes. Git works the same way. Just change the remote URL to point to your GitLab repository.

Same Git commands, different platform.

---

## 9) Platform Independence

If you switch from GitHub to GitLab, change the remote URL to point to your GitLab repository, then push main to origin.

Nothing else changes. Your repository remains identical. Git stays the same.

### The Git Commands Don't Change

Regardless of whether you use GitHub, GitLab, Gitea, or self-hosted, Git commands are identical: clone a repository, stage files, commit with a message, push to origin main, pull from origin main.

The platform (GitHub) adds features around Git, but Git itself doesn't change.

### Homestead Example: Switching Platforms

You start with GitHub: add a remote called origin pointing to your GitHub repository URL, then push main to origin.

Later, you want to switch to self-hosted Gitea: change the remote URL to point to your Gitea server URL, then push main to origin.

Same Git commands. Different platform. Your code and history are unchanged.

---

## 10) The Architectural View

Understanding this distinction matters conceptually. Git is time and state tracking (as you learned in Section A Phase 1 Chapter 1.7), snapshot-based history, and distributed version control. GitHub is collaboration layer, social layer, and automation layer.

### Git: Foundational Infrastructure

Git provides version control (snapshots, history), branching and merging, distributed architecture, and local-first design.

### GitHub: Workflow Infrastructure

GitHub adds collaboration tools (Pull Requests, Issues), automation (Actions, CI/CD), social features (forks, stars), and access control (permissions, teams).

### Homestead Example: Architectural Understanding

Your homestead automation system uses Git for version control:

**Git layer:** Tracks changes, manages history, enables branching.

**GitHub layer (optional):** Adds collaboration, code review, automation.

You can use Git without GitHub. You can't use GitHub without Git (it runs Git under the hood). Git is the foundation. GitHub is built on it.

---

## 11) Summary: Git vs GitHub

Git is a version control tool that works offline, is not required for Git, provides version control/history/branches, can be used alone, and provides basic collaboration (push/pull).

GitHub is a hosting platform that is web-based, is not required for Git, provides web UI/PRs/Issues/Actions, cannot be used alone (requires Git), and provides advanced collaboration (PRs, reviews).

### The Relationship

Git is the foundation. GitHub is built on Git and adds collaboration features. You can use Git without GitHub. You can't use GitHub without Git (it runs Git under the hood).

### Homestead Example: Putting It Together

You've learned Git—the tool. You understand repositories, commits, branches, push, pull, merge, rebase, and how Git works locally and with remotes.

Now you understand GitHub—the platform. It hosts your Git repositories, provides a web interface, adds Pull Requests, Issues, Actions, and makes collaboration easier.

But Git remains the core. Whether you use GitHub, GitLab, or self-hosted, Git commands stay the same.

---

## 12) Bridge to Section A Phase 3 Chapter 3.12 — Git in Your Workflow

In Section A Phase 3 Chapter 3.12 you learned about feature-branch workflows and code review. That chapter mentioned Pull Requests but didn't explain them—because Pull Requests are a GitHub feature, not a Git feature. Now you understand: Git provides branches and merging. GitHub provides Pull Requests as a workflow built on those Git features.

The next chapter will show you how to use GitHub's features—Pull Requests, Issues, Actions—in practice. You'll see how Git's version control combines with GitHub's collaboration platform to create effective workflows.

---

## Summary

- **Git** is the version control tool (command-line, works locally).
- **GitHub** is a hosting platform with collaboration features (web-based, built on Git).
- Git works without GitHub. GitHub requires Git.
- GitHub adds: web interface, Pull Requests, Issues, Actions, social features.
- Alternatives exist: GitLab, Gitea, self-hosted, Bitbucket.
- Git commands are the same regardless of platform.

Git is the foundation. GitHub is built on it. Understanding this distinction helps you choose the right tools for your needs. The next chapter shows how to use GitHub's features in practice.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.14 — GitHub Workflows** (`Chapter_3.14_GitHub_Workflows.md`).

You will learn how to use GitHub's features: creating Pull Requests, managing Issues, using GitHub Actions for CI/CD, and collaborating effectively. You now understand what GitHub adds to Git. Next, you learn how to use those features.
