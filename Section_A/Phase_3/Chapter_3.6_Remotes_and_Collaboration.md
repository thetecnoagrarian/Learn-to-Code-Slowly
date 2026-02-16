## Section A Phase 3 · Chapter 3.6: Remotes and Collaboration

origin; push and pull; fetch; upstream tracking; collaboration without overwriting.

## Learning Objectives

By the end of this chapter, you should be able to:
- Add and inspect a remote repository (e.g., origin).
- Push local commits to a remote repository.
- Pull remote commits into your local branch.
- Use `git fetch` to update remote-tracking references without merging.
- Understand upstream tracking and how it simplifies push/pull.
- Collaborate safely without overwriting other people's work.

---

## 1) What a Remote Is

You've been working locally so far. Git is distributed. That means every repository is complete, every clone has full history, and there is no required central server. But collaboration requires shared references. That's what a remote is.

### Definition

A remote is a named reference to another copy of the repository, usually identified by a URL. Common hosting locations include GitHub, GitLab, Gitea, a self-hosted server, or another machine on your network.

### origin Is Just a Name

By convention, the primary remote is named `origin`. But it's not special—it's just a default name. You could call it `server`, `upstream`, or `homestead`.

When you clone a repository:

```bash
git clone https://example.com/project.git
```

Git automatically creates `origin` pointing to that URL.

### Inspecting Remotes

See configured remotes:

```bash
git remote -v
```

Example output:

```
origin  https://github.com/user/project.git (fetch)
origin  https://github.com/user/project.git (push)
```

This tells you where fetch pulls from and where push sends to.

### Adding a Remote Manually

If you started a repo locally with `git init`, then later created a remote on GitHub, add it:

```bash
git remote add origin https://github.com/user/project.git
```

Now your local repo knows about the remote.

### Homestead Example: Setting Up a Remote

You've been developing your homestead automation system locally. You want to back it up and share it with your other machines. Create a repository on GitHub (or your own Gitea server) and add it as a remote:

```bash
git remote add origin https://github.com/yourusername/homestead-automation.git
```

Now you can push your local commits to the remote for backup and access from other machines.

### Multiple Remotes

You can have multiple remotes. For example:

```bash
git remote add github https://github.com/user/repo.git
git remote add gitea https://gitea.example.com/user/repo.git
```

You can push to different remotes:

```bash
git push github main
git push gitea main
```

Useful for backing up to multiple locations or working with different hosting services.

---

## 2) Push and Pull

Now we connect histories.

### `git push` — Send Commits Upstream

```bash
git push origin main
```

Meaning: "Send my local `main` branch to the remote named `origin`."

If successful:
- Remote now contains your commits.
- Other collaborators can fetch them.

Push updates the remote's branch pointer.

### `git pull` — Bring Remote Changes Down

```bash
git pull origin main
```

This means:
1. Fetch commits from `origin`.
2. Merge `origin/main` into your current branch.

So `git pull` is shorthand for `git fetch` + `git merge`, assuming upstream is set.

### Why Push Can Be Rejected

If someone else pushed first, remote history may look like:

```
A — B — C — D   (origin/main)
```

Your local history:

```
A — B — C — E   (main)
```

When you try `git push origin main`, Git rejects it: "Remote contains work you do not have." This prevents overwriting someone else's work.

Correct flow:

```bash
git pull
# resolve conflicts if needed
git push
```

Always integrate remote changes before pushing.

### Homestead Example: Push Rejection

You've been working on the coop door automation feature on your laptop. Meanwhile, you fixed a bug in the solar logger on your homestead server and pushed it. Now when you try to push your coop feature:

```bash
git push origin main
```

Git rejects it because the remote has commits you don't have. You need to pull first:

```bash
git pull origin main
# Git merges the solar logger fix with your coop feature
git push origin main
```

Now both changes are on the remote.

### Homestead Example: Pulling Updates

You're working on your laptop, but you know the homestead server has received updates (maybe you pushed from there, or a collaborator pushed). Update your local repo:

```bash
git pull origin main
```

Git fetches the new commits and merges them into your local `main`. Now your laptop has the latest code.

---

## 3) Fetch — Update Without Merging

`git fetch` is more controlled than `git pull`.

### What `git fetch` Does

```bash
git fetch origin
```

This:
- Downloads commits from the remote.
- Updates remote-tracking references.
- Does NOT change your current branch.
- Does NOT touch your working tree.

It updates `origin/main`, `origin/feature-x`—these are remote-tracking branches.

### Remote-Tracking Branches

Example after fetch:

- `main` = your local branch
- `origin/main` = what the remote looks like

They may differ. You can inspect differences:

```bash
git log main..origin/main
```

Or merge explicitly:

```bash
git merge origin/main
```

Fetch gives you control. Pull combines fetch + merge automatically.

### Why Use Fetch?

Use fetch when:
- You want to inspect changes first.
- You want to rebase instead of merge.
- You want explicit control.

In structured workflows, fetch + explicit integration is often preferred.

### Homestead Example: Inspecting Before Merging

You want to see what changed on the remote before merging it into your work:

```bash
git fetch origin
git log main..origin/main
```

This shows you the commits that are on the remote but not in your local `main`. You can review them, then decide whether to merge or rebase.

### Homestead Example: Fetch Before Pull

You're in the middle of a refactor and don't want to merge remote changes yet. Fetch to see what's new:

```bash
git fetch origin
```

Your working directory is unchanged, but you can see what's on the remote. When you're ready, merge or rebase explicitly.

---

## 4) Upstream Tracking

Typing full commands every time is repetitive. Upstream tracking simplifies collaboration.

### Setting Upstream

First push:

```bash
git push -u origin main
```

The `-u` sets:
- `branch.main.remote = origin`
- `branch.main.merge = refs/heads/main`

After that:

```bash
git push
git pull
```

Work automatically. Git knows which remote to use and which branch to match.

### Viewing Upstream Info

```bash
git branch -vv
```

Example:

```
* main  abc1234 [origin/main] Add sensor validation
```

This shows current commit, tracking branch, and sync status.

### Homestead Example: Setting Upstream

You create a new feature branch:

```bash
git switch -c feature/coop-automation
# work and commit
git push -u origin feature/coop-automation
```

The `-u` flag sets upstream tracking. Now you can just use `git push` and `git pull` without specifying the remote and branch names.

---

## 5) Collaboration Without Overwriting

Distributed systems require discipline.

### Rules

1. Always pull (or fetch + integrate) before pushing.
2. Never force-push shared branches unless explicitly agreed.
3. Keep feature branches small and short-lived.
4. Merge frequently to reduce conflicts.

Git protects shared history by default. It rejects non-fast-forward pushes unless you override. This is intentional safety.

### Typical Collaboration Flow

Two collaborators: Alice and Bob.

1. Both clone the repo.
2. Alice creates feature branch.
3. Alice pushes feature branch: `git push -u origin feature-x`
4. Bob fetches: `git fetch origin`
5. Bob sees `origin/feature-x`.
6. Bob reviews or merges.
7. Feature merged into `main`.
8. Everyone pulls latest `main`.

No one overwrites history. Everyone integrates intentionally.

### Homestead Example: Multi-Machine Workflow

You have your homestead automation repo on:
- Your laptop (development)
- Your homestead server (deployment)
- A backup server (backup)

Workflow:
1. Develop on laptop, commit changes.
2. Push to remote: `git push origin main`
3. On homestead server: `git pull origin main` then restart services
4. Backup server periodically: `git pull origin main` for backup

All three machines stay in sync through the remote. If one machine fails, you can recover from another.

### Homestead Example: Collaborating with Yourself

Even if you're the only developer, remotes are useful. You might work on:
- Your laptop during the day
- Your desktop in the evening
- Your homestead server for testing

Each machine has a clone. You push from one, pull on another. The remote (GitHub, Gitea, etc.) is the meeting point. This is collaboration with yourself across machines.

### Homestead Example: Offline Development

You're working in a shed with no internet. You commit locally as you work. When you get back to the house with internet:

```bash
git push origin main
```

All your commits from the shed are now on the remote. The remote doesn't need to be available while you work—that's the power of distributed version control.

---

## 6) Understanding Remote-Tracking Branches

When you fetch, Git creates remote-tracking branches like `origin/main`. These are local references to what the remote looks like. They're read-only pointers—you don't commit directly to them.

### How Remote-Tracking Branches Work

After `git fetch origin`:
- `origin/main` points to the commit that the remote's `main` branch points to
- Your local `main` may point to a different commit
- You can compare them: `git log main..origin/main`

When you merge `origin/main` into `main`, you're bringing remote changes into your local branch.

### Homestead Example: Remote-Tracking Branches

You fetch from the remote:

```bash
git fetch origin
```

Now you have:
- `main` (your local branch, at commit E)
- `origin/main` (remote's main branch, at commit F)

You can see what's different:

```bash
git log main..origin/main  # commits on remote but not local
git log origin/main..main  # commits on local but not remote
```

Then decide whether to merge, rebase, or leave them separate.

---

## 7) Common Mistakes and How to Avoid Them

### Mistake: Pushing Without Pulling First

**Symptom:** You try to push and Git rejects it because the remote has commits you don't have.

**Fix:** Pull first, resolve any conflicts, then push.

**Prevention:** Make `git pull` (or `git fetch` + review) a habit before pushing.

### Mistake: Force-Pushing Shared Branches

**Symptom:** You force-push to `main` and overwrite someone else's work.

**Fix:** If you haven't pushed the force yet, abort. If you have, communicate with collaborators immediately.

**Prevention:** Never force-push to shared branches. Use force-push only on your own feature branches that haven't been shared.

### Mistake: Not Setting Upstream

**Symptom:** You have to type `git push origin main` every time instead of just `git push`.

**Fix:** Set upstream on first push: `git push -u origin main`

**Prevention:** Always use `-u` on the first push of a branch.

### Mistake: Confusing Fetch and Pull

**Symptom:** You run `git pull` when you only wanted to see what changed, and it merges changes you weren't ready for.

**Fix:** Use `git fetch` to update remote-tracking branches without merging. Then merge explicitly when ready.

**Prevention:** Use `git fetch` when you want to inspect first, `git pull` when you're ready to merge immediately.

---

## 8) Homestead Project Examples

### Example: Backup Workflow

You develop locally on your laptop. Every evening, push to GitHub for backup:

```bash
git push origin main
```

If your laptop fails, you can clone from GitHub on a new machine and continue working. The remote is your backup.

### Example: Deployment Workflow

You have a deployment script on your homestead server:

```bash
#!/bin/bash
cd /opt/homestead-automation
git pull origin main
pm2 restart homestead-api
```

When you push updates to the remote, you can run this script on the server to deploy. The server pulls the latest code and restarts the service. Version-controlled deployment.

### Example: Multi-Branch Collaboration

You're working on `feature/coop-automation` while a collaborator works on `feature/solar-alerts`. Both push their branches:

```bash
git push -u origin feature/coop-automation
```

The collaborator pushes:

```bash
git push -u origin feature/solar-alerts
```

Both branches exist on the remote. You can fetch and review each other's work:

```bash
git fetch origin
git log origin/feature/solar-alerts
```

Then merge independently when ready.

### Example: Pulling Specific Branches

You want to pull a specific branch from the remote:

```bash
git fetch origin feature/solar-alerts
git switch feature/solar-alerts
```

Or create a local branch tracking the remote branch:

```bash
git switch -c feature/solar-alerts origin/feature/solar-alerts
```

This creates a local branch that tracks the remote branch, so `git push` and `git pull` work automatically.

---

## 9) Review: Remotes and Collaboration in One Page

Before moving on, you should be able to state in your own words:

1. **What is a remote?** A named reference to another repository, usually by URL. `origin` is the conventional name.

2. **What does push do?** Sends your local commits to the remote repository.

3. **What does pull do?** Fetches commits from remote and merges them into your current branch.

4. **What does fetch do?** Downloads commits from remote and updates remote-tracking branches, but doesn't merge.

5. **What is upstream tracking?** A connection between your local branch and a remote branch, allowing `git push` and `git pull` without specifying remote/branch names.

6. **How do you collaborate safely?** Always pull/fetch before pushing. Never force-push shared branches.

If any of these is fuzzy, revisit that section. The next chapter assumes you understand how remotes work and how to push and pull safely.

---

## 10) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time. With remotes, you extend that timeline across machines. Each machine has its own copy of the timeline (the repository). Remotes are the meeting points where timelines synchronize.

When you push, you're sharing your timeline with others. When you pull, you're incorporating their timeline into yours. The remote is the shared reference point that keeps everyone's timelines aligned. This is distributed time and state: multiple complete copies, synchronized through explicit push and pull operations.

---

## Summary

- A remote is a named URL pointing to another repository.
- `origin` is conventional, not special.
- `git push` sends commits to the remote.
- `git pull` fetches and merges.
- `git fetch` updates remote-tracking refs without merging.
- Upstream tracking simplifies push and pull.
- Always integrate remote changes before pushing.

You now understand distributed collaboration. The next chapter shows how to reshape history locally with rebase.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.7 — Rebasing and History Rewriting** (`Chapter_3.7_Rebasing.md`).

You will learn what `git rebase` does, how it differs from merge, when rewriting history is safe, and when it is dangerous. You now understand safe integration through merging. Next, you learn controlled history reshaping through rebasing.
