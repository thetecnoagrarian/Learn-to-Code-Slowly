## Section A Phase 3 · Chapter 3.1: What Version Control Is

Why track history; snapshots vs diffs; local vs distributed; recoverability and audit trails. Bridge to Section A Phase 1 Chapter 1.7 (Time and State Changes).

## Learning Objectives

By the end of this chapter, you should be able to:
- Explain why version control exists and what problem it solves: safe change over time, with recovery and explanation.
- Distinguish snapshot-based vs diff-based history models and say which Git uses and why it matters.
- Identify where Git fits: snapshot-based, distributed, with full history in every clone.
- Contrast centralized vs distributed version control and explain why distributed supports offline work and resilience.
- Describe how version control enables recoverability (restore, revert, find bugs) and audit trails (who, when, why).
- Connect repositories to Section A Phase 1 Chapter 1.7: time and state changes over the lifetime of a system—commits as named states, branches as alternate timelines.

## Key Terms

- **Repository:** The full history of a project—all commits, all branches. Stored in a hidden `.git` directory.
- **Commit:** A named snapshot of the entire project at one moment. Immutable. Identified by a hash.
- **Branch:** A name that points at a commit. As you make new commits, the branch name moves forward.
- **Working tree:** The files you actually edit—the current snapshot plus any uncommitted changes.
- **Staging area:** A middle layer where you choose which changes to include in the next commit.
- **Remote:** Another repository you push to and pull from. A convention for backup and collaboration.
- **Clone:** A full copy of a repository, including all history.
- **Push / Pull:** Sync operations between two complete repositories.

---

## 1) Why Track History?

Programs change. You fix bugs, rename variables, reorganize files, add features, remove features, refactor. Sometimes you change one file; sometimes you touch a dozen. The system you have today is not the system you had last week, and it will not be the system you have next month.

Without history, change is destructive. You only have the current state. No memory of how you got there. No structured way to go back. No way to compare "before the refactor" to "after" except by memory or hoping you kept a copy.

Version control solves one core problem: how do we safely change systems over time?

This is not just about collaboration. It is about time. Even if you never share code with another person, you are still changing a system over time. You will forget what you did. You will need to undo. You will need to know when something broke.

### What Happens Without It

Without version control, your tools are hope, manual backups, and copying folders like `project_final`, `project_final2`, `project_final2_backup`. You lose track of which copy is which. You merge by hand by opening two folders and guessing. You have no record of why you made a change, only that you did.

Version control formalizes change. It turns history into structure: one project, one timeline, many named points you can return to or branch from.

### Undo Beyond the Editor

Most editors have "undo." But undo only works in the current session, until you close the file. As soon as you save and close, that history is gone. And undo is per file. It does not help when your change spans five files.

Version control operates at the project level. It tracks entire directory trees, multiple files at once, and meaningful points in time that you choose to record. Undo becomes deliberate and durable: restore this file from three days ago; restore this entire project from last week; compare this version to that version; create a new line of work from an old state without touching the current one.

### Homestead Example

You refine a battery monitoring script. Version 1 reads voltage. Version 2 adds temperature. Version 3 changes the logging format. Version 4 refactors everything. Suddenly Version 4 breaks. Without version control you manually try to remember what changed. You guess. You retype. With version control you check the history, compare versions, and revert cleanly to the last known good state.

The same applies to coop door logic, solar production thresholds, or electric fence energizer settings. Any system that evolves benefits from named, recoverable states. Version control gives you a timeline. You can step back to "before the coop change" or "when solar was still correct" and see exactly what the code looked like.

### When One File Becomes Many

A single feature or fix often touches more than one file. You change a function in one place, then update the callers in three other files, then adjust a test file. Without version control you have four files changed. If something is wrong you must remember which four, and in what order, and what they looked like before.

With version control you record all four as one logical change—one commit. "Add temperature to battery monitor" might be one commit that touches `monitor.py`, `config.json`, `test_monitor.py`, and `README.md`. Later you can revert or inspect that entire change as a unit. History is organized by intent, not by file.

### Solo vs Team

Everything applies to a single developer. You still change systems over time; you still forget; you still need to recover and explain. When you add a second person, version control becomes the shared timeline. Everyone works from the same history. Without version control, "sharing" means emailing zip files or copying folders—no single truth, no clear history, no way to merge without hand-editing.

Version control is not "for teams." It is for anyone who changes code over time; teams simply need it even more because the timeline is shared.

### When to Commit

Commit whenever you have a logical unit of work. One fix, one small feature, one refactor that stands on its own. Not "when the whole feature is done" if that takes days. Not every single save. The habit of small, frequent commits with clear messages makes recovery and audit useful.

---

## 2) Snapshots vs Diffs

There are two fundamental ways to represent history. Git uses snapshots. Understanding this makes Git's behavior predictable.

### Diff-Based Systems

Diff-based systems store the changes between versions. They store a sequence of patches: line additions, line deletions, modifications. To get version 10 you start from version 1 and apply patches 2, 3, 4, through 10 in order.

Advantages: storage efficient. You only store what changed.

Disadvantages: harder to reason about. Reconstructing an old state requires replaying all diffs from the baseline. If one patch is corrupt, later states may be unrecoverable. Branching becomes complex because a branch is "a different sequence of patches." In practice, diff-based systems can be slower to query.

### Snapshot-Based Systems

Snapshot-based systems store a complete picture of the project at each commit. Each commit is a full representation of all tracked files and their exact contents at that moment. You do not "replay" anything to get to a commit; you simply have that state.

**Git is snapshot-based.** Every commit is a full snapshot of the entire tree. When you check out a commit, you get that snapshot.

This does not mean Git duplicates every file on disk every time. Internally Git reuses unchanged data. If a file did not change between commit A and commit B, Git stores one copy and points both commits at it. Storage stays efficient. But conceptually, every commit is a full project snapshot.

### Why Git Chose Snapshots

Snapshots make reasoning simple. Each commit is a complete state: self-contained and immutable. You do not replay instructions to rebuild the past; you move your pointer to another snapshot.

This model makes branching trivial. A branch is just a name pointing at a snapshot. You can create a branch from any snapshot. Merging is "combine two snapshots into a new one," not "reconcile two patch sequences."

Operations that are natural with snapshots: show me the project as it was last Tuesday; restore this one file from that commit; what changed between commit A and commit B; create a branch from the commit before the refactor.

### Common Misconception

A common misconception is that Git stores diffs. Git shows you diffs when you ask for them, but under the hood it stores snapshots. The diff is computed when you request it. You get the mental model of snapshots and the convenience of viewing changes as diffs.

If you think Git is diff-based, you might worry that reverting or going back is expensive or dangerous. In fact, going back is just pointing at another snapshot. Nothing is rewritten until you choose to create a new commit.

---

## 3) Local vs Distributed

There are two architectural models of version control. Centralized systems put all history on one server. Distributed systems give every developer a full copy. Git is distributed.

### Centralized Version Control

In centralized systems one central server stores the canonical history. Developers check out a working copy from that server. To save history they commit to the server. The server is the single source of truth.

If the server fails, history may be lost and work may be blocked. If the network is down, you cannot commit. If the server is corrupted, everyone loses. The central server is a single point of failure and a bottleneck.

### Distributed Version Control

In distributed systems every clone contains the entire history. When you clone a repository you get a full copy: every commit, every branch, the complete timeline. There is no required central server. Remotes are just other repositories you have chosen to sync with—often one you call `origin` on GitHub or your own server. They are conventions for collaboration and backup, not requirements for version control to work.

**Git is distributed.** When you clone a repository you get the full history, all branches, all commits. You can commit offline. You can create branches offline. You can explore history, revert, merge—all offline. The remote is just another repository. Pushing and pulling are ways to synchronize two repositories; they are not what makes Git work.

### Why This Matters

Because every clone is complete, you can commit early and often without needing a network. You can make ten small commits on a train or in a shed with no internet, then push once when you are back online. You are not saving up one big commit for when the server is available.

If GitHub disappears, your local clone still contains the full history. If your laptop fails, another clone can restore everything. Distributed version control is structural redundancy. You do not rely on one machine or one service to preserve the project.

### What Push and Pull Really Mean

In daily use you push your commits to a remote and pull others' commits from it. It is easy to think the remote is the "real" place and your machine is a copy. In Git the opposite is true: your clone is a full repository. Push means send my new commits to that other repository so it has them too. Pull means fetch their new commits and merge them into my current branch. You are synchronizing two complete copies, not uploading to save.

---

## 4) Recoverability and Audit Trails

Version control gives two powerful capabilities: recoverability and audit trails. Both depend on history being stored and named.

### Recoverability

Recoverability means you can restore deleted files, undo bad commits, return to previous states, and identify when bugs were introduced. In Git you can restore a single file from a previous commit, reset your branch to an earlier commit, or revert a specific commit by creating a new commit that undoes its changes. Git also supports binary search through history: `git bisect` lets you automate finding the first commit where a bug appeared.

Nothing is truly lost in Git until it is garbage collected and unreachable. So for a while even deleted or reset away history can be recovered. That safety net reduces fear. You can experiment: try a refactor, and if it goes wrong, go back. Try a new feature on a branch; if you don't like it, leave the branch or delete it. The main line stays intact.

### Audit Trails

Every commit records author, timestamp, message, and a snapshot of state. That creates an audit trail. You can answer: who changed this, when, why. The why lives in commit messages. Without commit messages, history becomes opaque. With good commit messages, history becomes documentation.

Good commit messages are short but specific: "Fix coop door opening at wrong time when DST changes" is better than "fix bug." "Add solar production running total to dashboard" is better than "update dashboard." The message needs to capture the intent and context so that someone reading the log later can understand what was done and why.

Without discipline about messages, the audit trail degrades. Commits like "wip," "fix," "updates" make history useless for understanding. Treat the commit message as part of the work: the change and the reason for the change belong together.

### Homestead Relevance

You changed sensor calibration logic for the coop. Two months later readings drift. You need to know when the logic changed and what the previous behavior was. Git lets you inspect that exact change and the reasoning you recorded at the time. The same applies to solar inverter config, fence energizer settings, or any script that affects real systems. When a real-world system misbehaves, "what changed?" and "when?" are the first questions. Version control answers them.

When you have several systems—battery monitor, coop controller, solar logger, fence monitor—consistent use of version control across all of them means the same recoverability and audit trail everywhere. One discipline, applied everywhere, makes the whole homestead's software stack understandable over time.

---

## 5) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time. Time is an implicit input to systems; what was true yesterday may not be true today; systems drift.

A Git repository is that idea made concrete. The repository is state. It changes over time. Each commit is a named state—a point in time you have chosen to record. Branches are alternate timelines: different sequences of states that can later be brought together. Merges are timeline convergence. Reverts are state rollback.

Version control is time made explicit. Instead of state drifting invisibly, you formalize each transition. You give each transition a name, a timestamp, an author, and a message. You move from implicit change to explicit, named transitions between states. That is exactly the Section A Phase 1 mental model: state, time, and observable transitions. Version control applies it to the life of a codebase.

When you learn Git's mechanics in the next chapters—working tree, staging area, commits, branches, remotes—you are learning how to make time and state manageable in software. The repository is your system's timeline. Commits are the points you can return to.

---

## 6) Common Pitfalls and Misconceptions

**"I'll commit when the feature is done."** If the feature takes days or weeks, you have days or weeks of unrecorded change. Commit when you have a logical unit of work.

**"Git is the same as backup."** Backup is a side effect. The main point of Git is structured history: named states, branches, merges, and audit trails.

**"The remote is the real repository."** In Git, every clone is a full repository. The remote is another clone you sync with. Push and pull are sync operations, not save and load.

**"Reverting is dangerous."** Revert is safe and traceable. Reset can discard history and is trickier when others share the branch. For undo, prefer revert unless you understand reset.

**"Branches are for big features only."** Branches are cheap in Git. Use them for any line of work you might want to keep separate.

**"I don't need version control for a one-file script."** You still benefit from history. When the script breaks next month you will want to see what changed.

---

## Why Git Specifically?

This curriculum uses Git because it is the dominant version control system in industry and open source. It is snapshot-based and distributed, so the concepts in this chapter map directly to how Git works. Other systems exist; the ideas apply across tools. If you learn Git you can transfer the concepts to others. Once you are comfortable with Git you will find it everywhere: GitHub, GitLab, deployment pipelines, and most programming workflows assume Git.

---

## Summary

Version control tracks change over time so we can recover, audit, and collaborate. It solves how we safely change systems over time.

Git uses snapshots per commit, not diff-only history. Each commit is a full project state; that makes branching and reverting straightforward.

Git is distributed; every clone has the full history. You can work offline; remotes are for syncing and backup. No single point of failure.

Recoverability reduces fear and enables experimentation. Audit trails turn history into documentation.

A repository is state evolving through time; commits are named states; branches are alternate timelines. Version control is time made explicit.

Without version control, complexity collapses into chaos. With it, change becomes manageable.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.2 — Repositories and the Working Tree** (`Chapter_3.2_Repositories_and_Working_Tree.md`).

You will learn the three core areas of Git: working directory, staging area, and repository, and how changes move between them. Understanding how data flows from your editor into a commit is the foundation for everything else—branching, merging, and syncing with remotes.
