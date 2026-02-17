## Section A Phase 3 · Chapter 3.6: Remotes and Collaboration

origin; push and pull; fetch; upstream tracking; collaboration without overwriting.

## Learning Objectives

By the end of this chapter, you should be able to:
- Add and inspect a remote repository (e.g., origin).
- Push local commits to a remote repository.
- Pull remote commits into your local branch.
- Use git fetch to update remote-tracking references without merging.
- Understand upstream tracking and how it simplifies push/pull.
- Collaborate safely without overwriting other people's work.

---

## 1) What a Remote Is

You've been working locally so far. Git is distributed. That means every repository is complete, every clone has full history, and there is no required central server. But collaboration requires shared references. That's what a remote is.

### Definition

A remote is a named reference to another copy of the repository, usually identified by a URL. Common hosting locations include GitHub, GitLab, Gitea, a self-hosted server, or another machine on your network.

### origin Is Just a Name

By convention, the primary remote is named origin. But it's not special—it's just a default name. You could call it server, upstream, or homestead.

When you clone a repository, Git automatically creates origin pointing to that URL.

### Inspecting Remotes

See configured remotes using git remote with the verbose flag. This shows you where fetch pulls from and where push sends to.

### Adding a Remote Manually

If you started a repo locally, then later created a remote on GitHub, add it using git remote add followed by a name and the URL. Now your local repo knows about the remote.

### Homestead Example: Setting Up a Remote

You've been developing your homestead automation system locally. You want to back it up and share it with your other machines. Create a repository on GitHub (or your own Gitea server) and add it as a remote using git remote add origin followed by the repository URL.

Now you can push your local commits to the remote for backup and access from other machines.

### Multiple Remotes

You can have multiple remotes. For example, add one remote named github pointing to GitHub, and another named gitea pointing to your Gitea server.

You can push to different remotes by specifying the remote name. Useful for backing up to multiple locations or working with different hosting services.

---

## 2) Push and Pull

Now we connect histories.

### git push — Send Commits Upstream

Use git push followed by the remote name and branch name. Meaning: "Send my local main branch to the remote named origin."

If successful: the remote now contains your commits, and other collaborators can fetch them. Push updates the remote's branch pointer.

### git pull — Bring Remote Changes Down

Use git pull followed by the remote name and branch name. This means: fetch commits from origin, then merge origin/main into your current branch.

So git pull is shorthand for git fetch plus git merge, assuming upstream is set.

### Why Push Can Be Rejected

If someone else pushed first, remote history may have commits A, B, C, D. Your local history has A, B, C, E. When you try to push, Git rejects it: "Remote contains work you do not have." This prevents overwriting someone else's work.

Correct flow: pull first, resolve conflicts if needed, then push. Always integrate remote changes before pushing.

### Homestead Example: Push Rejection

You've been working on the coop door automation feature on your laptop. Meanwhile, you fixed a bug in the solar logger on your homestead server and pushed it. Now when you try to push your coop feature, Git rejects it because the remote has commits you don't have. You need to pull first: pull from origin main, Git merges the solar logger fix with your coop feature, then push to origin main.

Now both changes are on the remote.

### Homestead Example: Pulling Updates

You're working on your laptop, but you know the homestead server has received updates (maybe you pushed from there, or a collaborator pushed). Update your local repo by pulling from origin main.

Git fetches the new commits and merges them into your local main. Now your laptop has the latest code.

---

## 3) Fetch — Update Without Merging

git fetch is more controlled than git pull.

### What git fetch Does

Use git fetch followed by the remote name. This downloads commits from the remote, updates remote-tracking references, does NOT change your current branch, and does NOT touch your working tree.

It updates origin/main, origin/feature-x—these are remote-tracking branches.

### Remote-Tracking Branches

Example after fetch: main equals your local branch, and origin/main equals what the remote looks like.

They may differ. You can inspect differences using git log to compare your local branch with the remote-tracking branch. Or merge explicitly using git merge with the remote-tracking branch name.

Fetch gives you control. Pull combines fetch plus merge automatically.

### Why Use Fetch?

Use fetch when you want to inspect changes first, you want to rebase instead of merge, or you want explicit control.

In structured workflows, fetch plus explicit integration is often preferred.

### Homestead Example: Inspecting Before Merging

You want to see what changed on the remote before merging it into your work: fetch from origin, then use git log to see the commits that are on the remote but not in your local main. You can review them, then decide whether to merge or rebase.

### Homestead Example: Fetch Before Pull

You're in the middle of a refactor and don't want to merge remote changes yet. Fetch to see what's new: fetch from origin.

Your working directory is unchanged, but you can see what's on the remote. When you're ready, merge or rebase explicitly.

---

## 4) Upstream Tracking

Typing full commands every time is repetitive. Upstream tracking simplifies collaboration.

### Setting Upstream

On first push, use git push with the upstream flag followed by the remote name and branch name. The upstream flag sets the remote and merge configuration for that branch.

After that, you can use git push and git pull without specifying remote and branch names. They work automatically. Git knows which remote to use and which branch to match.

### Viewing Upstream Info

Use git branch with the verbose flags to see upstream information. This shows current commit, tracking branch, and sync status.

### Homestead Example: Setting Upstream

You create a new feature branch, work and commit on it, then push with the upstream flag. The upstream flag sets upstream tracking. Now you can just use git push and git pull without specifying the remote and branch names.

---

## 5) Collaboration Without Overwriting

Distributed systems require discipline.

### Rules

Always pull (or fetch plus integrate) before pushing. Never force-push shared branches unless explicitly agreed. Keep feature branches small and short-lived. Merge frequently to reduce conflicts.

Git protects shared history by default. It rejects non-fast-forward pushes unless you override. This is intentional safety.

### Typical Collaboration Flow

Two collaborators: Alice and Bob. Both clone the repo. Alice creates a feature branch. Alice pushes the feature branch with upstream tracking. Bob fetches from origin. Bob sees origin/feature-x. Bob reviews or merges. Feature merged into main. Everyone pulls latest main.

No one overwrites history. Everyone integrates intentionally.

### Homestead Example: Multi-Machine Workflow

You have your homestead automation repo on your laptop (development), your homestead server (deployment), and a backup server (backup).

Workflow: Develop on laptop, commit changes. Push to remote. On homestead server, pull from origin main then restart services. Backup server periodically pulls from origin main for backup.

All three machines stay in sync through the remote. If one machine fails, you can recover from another.

### Homestead Example: Collaborating with Yourself

Even if you're the only developer, remotes are useful. You might work on your laptop during the day, your desktop in the evening, and your homestead server for testing.

Each machine has a clone. You push from one, pull on another. The remote (GitHub, Gitea, etc.) is the meeting point. This is collaboration with yourself across machines.

### Homestead Example: Offline Development

You're working in a shed with no internet. You commit locally as you work. When you get back to the house with internet, push to origin main.

All your commits from the shed are now on the remote. The remote doesn't need to be available while you work—that's the power of distributed version control.

---

## 6) Understanding Remote-Tracking Branches

When you fetch, Git creates remote-tracking branches like origin/main. These are local references to what the remote looks like. They're read-only pointers—you don't commit directly to them.

### How Remote-Tracking Branches Work

After fetching from origin: origin/main points to the commit that the remote's main branch points to, your local main may point to a different commit, and you can compare them using git log.

When you merge origin/main into main, you're bringing remote changes into your local branch.

### Homestead Example: Remote-Tracking Branches

You fetch from the remote. Now you have main (your local branch, at commit E) and origin/main (remote's main branch, at commit F).

You can see what's different: use git log to see commits on remote but not local, or commits on local but not remote.

Then decide whether to merge, rebase, or leave them separate.

---

## 7) Common Mistakes and How to Avoid Them

### Mistake: Pushing Without Pulling First

**Symptom:** You try to push and Git rejects it because the remote has commits you don't have.

**Fix:** Pull first, resolve any conflicts, then push.

**Prevention:** Make git pull (or git fetch plus review) a habit before pushing.

### Mistake: Force-Pushing Shared Branches

**Symptom:** You force-push to main and overwrite someone else's work.

**Fix:** If you haven't pushed the force yet, abort. If you have, communicate with collaborators immediately.

**Prevention:** Never force-push to shared branches. Use force-push only on your own feature branches that haven't been shared.

### Mistake: Not Setting Upstream

**Symptom:** You have to type the full push command every time instead of just git push.

**Fix:** Set upstream on first push using the upstream flag.

**Prevention:** Always use the upstream flag on the first push of a branch.

### Mistake: Confusing Fetch and Pull

**Symptom:** You run git pull when you only wanted to see what changed, and it merges changes you weren't ready for.

**Fix:** Use git fetch to update remote-tracking branches without merging. Then merge explicitly when ready.

**Prevention:** Use git fetch when you want to inspect first, git pull when you're ready to merge immediately.

---

## 8) Homestead Project Examples

### Example: Backup Workflow

You develop locally on your laptop. Every evening, push to GitHub for backup. If your laptop fails, you can clone from GitHub on a new machine and continue working. The remote is your backup.

### Example: Deployment Workflow

You have a deployment script on your homestead server. The script changes to the project directory, pulls from origin main, then restarts the service.

When you push updates to the remote, you can run this script on the server to deploy. The server pulls the latest code and restarts the service. Version-controlled deployment.

### Example: Multi-Branch Collaboration

You're working on feature/coop-automation while a collaborator works on feature/solar-alerts. Both push their branches with upstream tracking.

Both branches exist on the remote. You can fetch and review each other's work: fetch from origin, then use git log to see commits on the collaborator's branch.

Then merge independently when ready.

### Example: Pulling Specific Branches

You want to pull a specific branch from the remote: fetch that specific branch from origin, then switch to that branch.

Or create a local branch tracking the remote branch: switch with the create flag and specify the remote branch as the source.

This creates a local branch that tracks the remote branch, so git push and git pull work automatically.

---

## 9) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time. With remotes, you extend that timeline across machines. Each machine has its own copy of the timeline (the repository). Remotes are the meeting points where timelines synchronize.

When you push, you're sharing your timeline with others. When you pull, you're incorporating their timeline into yours. The remote is the shared reference point that keeps everyone's timelines aligned. This is distributed time and state: multiple complete copies, synchronized through explicit push and pull operations.

---

## Summary

- A remote is a named URL pointing to another repository.
- origin is conventional, not special.
- git push sends commits to the remote.
- git pull fetches and merges.
- git fetch updates remote-tracking refs without merging.
- Upstream tracking simplifies push and pull.
- Always integrate remote changes before pushing.

You now understand distributed collaboration. The next chapter shows how to reshape history locally with rebase.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.7 — Rebasing and History Rewriting** (`Chapter_3.7_Rebasing.md`).

You will learn what git rebase does, how it differs from merge, when rewriting history is safe, and when it is dangerous. You now understand safe integration through merging. Next, you learn controlled history reshaping through rebasing.
