## Section A Phase 3 · Chapter 3.11: Tags and Releases

Lightweight vs annotated tags; semantic versioning; marking releases for deployment.

Tags answer a simple question: Which exact commit did we deploy? Branches move. Commits accumulate. Tags stay fixed. A tag is a named pointer to a specific commit—a frozen moment in time.

## Learning Objectives

By the end of this chapter, you should be able to:
- Create lightweight and annotated tags and explain the difference.
- List and inspect tags.
- Push tags to a remote.
- Use tags to mark releases (e.g., v1.0.0).
- Understand semantic versioning (major.minor.patch).
- Connect tags to deployment and reproducibility.

---

## 1) What a Tag Is

A tag is a reference that points to a specific commit. Unlike a branch, a branch moves when you commit, but a tag does not move (unless forcibly changed). If a commit is a snapshot, a tag is a label on that snapshot.

### Why Tags Exist

You use tags to mark releases, mark production deployments, mark milestones, freeze a version for testing, and create stable reference points.

Without tags, you would refer to releases by commit hash. That is not human-friendly. Instead of a commit hash like a3f92d4, you say v1.2.3. Tags give meaning to history.

### Tags vs Branches: The Key Difference

Branches are moving pointers. When you commit, the branch moves forward. Tags are fixed pointers. Once created, they point to the same commit unless you explicitly change them.

If your branch has commits A, B, C, D, and you create a tag v1.0.0 pointing to D, then commit E, the branch moves forward to E but the tag v1.0.0 still points to D.

The branch moved, the tag stayed. This is why tags are perfect for marking releases—they freeze a moment in time.

---

## 2) Lightweight vs Annotated Tags

Git supports two kinds of tags: lightweight and annotated. They look similar, but they are not the same.

### Lightweight Tag

A lightweight tag is just a name pointing to a commit. No metadata. No message. No tagger info.

Create one by using git tag followed by a tag name like v1.0.0. That's it. It simply attaches a label to the current commit. You can think of it as a branch that never moves.

Lightweight tags are fine for local markers, temporary labels, and personal reference points. But not ideal for releases.

### Annotated Tag

Annotated tags are objects. They include tag name, tagger name, tagger email, date, and message.

Create one by using git tag with the annotated flag, followed by the tag name, then the message flag with your release message. This creates a tag object that points to the commit.

Annotated tags are recommended for releases, deployment points, and anything shared with others. They contain context. That context matters months later.

### Inspecting the Difference

Show a tag using git show followed by the tag name. For annotated tags, you will see tag metadata, message, then the commit details. For lightweight tags, you only see the commit. Annotated tags are richer.

For releases, always use annotated tags.

### Homestead Example: Lightweight vs Annotated

**Lightweight tag (local experiment):**

You're experimenting with a new sensor configuration and want to mark a checkpoint. Create a lightweight tag with a name like experiment-checkpoint.

This is fine for personal use. No one else needs to know about it.

**Annotated tag (production release):**

You're releasing your solar logger API to production. Create an annotated tag with the tag name v1.0.0 and a detailed message describing the release: initial production release of solar logger API, RESTful endpoints for sensor data, authentication via API keys, database schema v1, deployed to production server.

Months later, viewing the tag tells you exactly what was released, when, and by whom. This context is invaluable.

---

## 3) Creating and Listing Tags

Tags are easy to create and manage.

### Tagging the Current Commit

**Annotated:**

Use git tag with the annotated flag, followed by the tag name like v1.0.0, then the message flag with your release message.

**Lightweight:**

Use git tag followed by the tag name like v1.0.0.

By default, Git tags the current HEAD.

### Tagging an Older Commit

You can tag any commit by providing the commit hash after the tag name. This is useful when you forgot to tag a release or want to retroactively mark a milestone.

### Listing Tags

List tags using git tag.

Filter tags using git tag with the list flag and a pattern like v1.* to see only version 1 tags.

Inspect a tag using git show followed by the tag name.

Tags live in your repository like branches do.

### Homestead Example: Tagging a Release

You've finished testing your coop door automation system and want to tag the release. First, make sure you're on the commit you want to tag by checking recent commits.

Then tag it using git tag with the annotated flag, the tag name v1.2.0, and a detailed message: Coop door automation v1.2.0, added DST handling for sunrise/sunset times, fixed motor timeout bug, improved error logging, tested on production hardware.

Now you can always reference this exact version by viewing the tag.

### Homestead Example: Retroactive Tagging

You realize you forgot to tag v1.1.0 last month. Find the commit by searching commits from the past two months, find the commit hash, then tag it with an annotated tag and a message noting it was tagged retroactively.

---

## 4) Semantic Versioning (Optional but Recommended)

Semantic versioning uses MAJOR.MINOR.PATCH. Example: 1.2.3. Often prefixed with v: v1.2.3.

### What Each Number Means

**MAJOR version:**
- Breaking changes
- Incompatible API changes
- Significant architecture shifts

**MINOR version:**
- New features
- Backward-compatible additions

**PATCH version:**
- Bug fixes
- Small improvements
- No API changes

**Example progression:**

- v1.0.0 — First stable release
- v1.0.1 — Bug fix
- v1.1.0 — Added new endpoint
- v2.0.0 — Breaking API change

### Why Versioning Matters

Version numbers communicate expectations, signal stability, provide clarity for deployment, and help debugging ("Which version is production running?"). Without versioning, you rely on commit hashes. That is fragile and unclear.

### Homestead Example: Versioning Your API

Imagine your homestead sensor API:

- v0.1.0 — First deployable API
- v0.2.0 — Added authentication
- v0.2.1 — Fixed temperature parsing bug
- v1.0.0 — Stable public API
- v2.0.0 — Reworked database schema (breaking change)

Tags provide clarity. Months later, you know exactly what changed.

### Homestead Example: Versioning ESP32 Firmware

Your ESP32 devices run MicroPython firmware. Versioning helps track what's deployed:

- v0.5.0 — Initial WiFi connection
- v0.6.0 — Added MQTT support
- v0.6.1 — Fixed WiFi reconnection bug
- v1.0.0 — Stable production firmware
- v1.1.0 — Added OTA update capability
- v2.0.0 — Changed config file format (breaking)

When a device reports an error, you know exactly which firmware version it's running.

### Pre-release Versions

You can also use pre-release identifiers:

- v1.0.0-alpha.1 — Early testing
- v1.0.0-beta.1 — Beta testing
- v1.0.0-rc.1 — Release candidate
- v1.0.0 — Final release

This helps track the release process.

---

## 5) Pushing Tags

Tags do not automatically push. Branches push automatically with git push. Tags do not.

### Push a Single Tag

Use git push followed by the remote name like origin, then the tag name like v1.0.0. This sends that specific tag to the remote.

### Push All Tags

Use git push followed by the remote name like origin, then the tags flag. This pushes all local tags.

### Cloning and Tags

When someone clones, they receive tags. They can checkout a tag using git checkout followed by the tag name. This puts you in a "detached HEAD" state. You are viewing a specific historical commit.

### Homestead Example: Sharing Release Tags

You've tagged your release and want to share it. Push the specific tag using git push followed by origin and the tag name like v1.2.0.

Now others can clone the repository and checkout the exact release using git checkout followed by the tag name. They're now viewing exactly what was released, not the latest code.

### Homestead Example: Pushing All Tags

You've been tagging locally and want to push everything. Use git push followed by origin and the tags flag. This pushes all tags at once. Useful when setting up a new remote or syncing tags.

---

## 6) Tags and Deployment

Tags are powerful in deployment workflows. Instead of deploying whatever is on main, you deploy exactly tag v1.2.3. That makes builds reproducible.

### CI/CD and Tags

Continuous Integration systems can trigger on tag creation, build from that tag, and deploy that tag.

**Example flow:**
1. Merge feature branch into main
2. Run tests
3. Create annotated tag v1.3.0
4. Push tag
5. CI detects tag
6. Deploy exact tagged commit

This ensures no accidental untested commits go live and production matches a known snapshot.

### Reproducibility

If production runs v1.2.3, you can checkout that tag and reproduce exactly what is deployed. No guessing. No ambiguity. Tags anchor deployment to history.

### Homestead Example: Deployment Workflow

Your deployment script checks out a specific tag. The script takes a version number as input, checks out that tagged version, runs installation commands, builds the project, then deploys.

Deploy with the version tag as an argument. Production always runs exactly what you tagged, not whatever happens to be on main.

### Homestead Example: Rollback to Previous Tag

Production is broken. Rollback to the previous version. Find the previous tag by listing tags sorted by version, then checkout that tag and deploy.

You're back to a known good state.

---

## 7) Do Not Move or Delete Release Tags

Tags represent history. If others rely on a tag, do not force-update or delete and recreate. That breaks trust. Treat release tags like shared history. Immutable.

### Why Tags Should Be Immutable

Once a tag is pushed and others have cloned it, changing it causes confusion. They might have checked out that tag, built from it, or deployed it. Changing the tag breaks their expectations.

### What to Do Instead

If you made a mistake tagging, create a new tag. If you need to mark a different commit as v1.0.0, use a different version number or create a new tag like v1.0.0-corrected.

### Homestead Example: Tagging Mistake

You accidentally tagged the wrong commit as v1.0.0 and already pushed it. Don't force-update the tag or force-push it. Instead, create a new annotated tag v1.0.1 with a message explaining it's the corrected release with the actual v1.0.0 content, then push the new tag.

The original v1.0.0 tag stays in history, documenting what happened. The new tag corrects the mistake.

---

## 8) Tags vs Branches

Quick comparison:

Branches move forward, are used for development, are often long-lived, and represent active work.

Tags are fixed, are used for marking points, are snapshot markers, and represent a historical moment.

Branches are lines of work. Tags are bookmarks.

### When to Use Each

**Use branches for:**
- Feature development
- Bug fixes
- Experiments
- Ongoing work

**Use tags for:**
- Releases
- Deployments
- Milestones
- Historical snapshots

### Homestead Example: Branch vs Tag

You're working on a new feature. Create a branch for the feature, work on the feature, commit your changes.

When the feature is complete and tested, merge to main, then tag the release with an annotated tag and a descriptive message, then push the tag.

The branch was for development. The tag marks the release.

---

## 9) Advanced: Working with Tags

### Checking Out a Tag

When you checkout a tag, you enter "detached HEAD" state. You're viewing that commit, but not on any branch. To make changes, create a branch from that tag.

### Deleting Tags

Delete a local tag using git tag with the delete flag followed by the tag name.

Delete a remote tag using git push followed by the remote name, the delete flag, and the tag name.

**Warning:** Only delete tags that haven't been shared or that you're certain no one depends on.

### Listing Tags with Details

See tags with commit info using git tag with the list flag and a format option.

See tags sorted by version using git tag with the sort flag set to version in reverse order.

### Homestead Example: Finding Tags

List all tags for your project using git tag. You'll see output like v0.1.0, v0.2.0, v0.2.1, v1.0.0, v1.1.0, v2.0.0.

See details using git tag with the list flag and a format option showing tag names and their first line of messages.

---

## 10) Common Mistakes and How to Avoid Them

### Mistake: Using Lightweight Tags for Releases

**Symptom:** You tag releases with lightweight tags, losing metadata that would be useful later.

**Fix:** Always use annotated tags for releases with git tag using the annotated flag, the tag name, and the message flag with a release message.

**Prevention:** Make annotated tags your default for any tag you might share.

### Mistake: Forgetting to Push Tags

**Symptom:** You tag locally but forget to push, so others can't see the tags.

**Fix:** Push tags explicitly using git push followed by the remote name and tag name, or use git push with the tags flag to push all tags.

**Prevention:** Make pushing tags part of your release workflow. Consider aliasing a command that tags and pushes together.

### Mistake: Moving or Deleting Shared Tags

**Symptom:** You force-update or delete a tag that others have cloned, causing confusion.

**Fix:** Don't. Create a new tag instead. If you must, communicate clearly with your team first.

**Prevention:** Treat pushed tags as immutable. Never force-update shared tags.

### Mistake: Inconsistent Versioning

**Symptom:** Your tags don't follow semantic versioning, making it unclear what changed between versions.

**Fix:** Adopt semantic versioning and stick to it. Document your versioning policy.

**Prevention:** Use a consistent format (e.g., vMAJOR.MINOR.PATCH) and increment appropriately.

---

## 11) Homestead Project Examples

### Example: Tagging a Production Release

Your solar logger API is ready for production. Ensure tests pass, then tag the release with an annotated tag v1.0.0 and a detailed message: Solar logger API v1.0.0, production release, RESTful API endpoints, authentication via API keys, PostgreSQL database, deployed to production server, all tests passing.

Then push the tag.

### Example: Versioning ESP32 Firmware

Tag firmware releases for your ESP32 devices. Create an annotated tag v1.2.0 with a message: ESP32 firmware v1.2.0, fixed WiFi reconnection bug, added deep sleep mode, improved sensor reading accuracy, tested on 5 devices.

Then push the tag.

Devices can report their firmware version, and you know exactly what code they're running.

### Example: Multi-Component System Versioning

Your homestead system has multiple components. Tag them separately: API release with api-v1.3.0, frontend release with frontend-v2.1.0, firmware release with firmware-v1.0.0.

Or use a monorepo approach with a single version: tag v1.3.0 with a message describing all components: Homestead system v1.3.0, API added new endpoints, frontend updated UI, firmware bug fixes.

Choose the approach that fits your project structure.

---

## 12) Bridge to Section A Phase 3 Chapter 3.10 — Undoing and Recovering

In Section A Phase 3 Chapter 3.10 you learned how to undo mistakes and recover lost commits. Tags complement that knowledge by marking points you want to return to. When you tag a release, you're creating a permanent bookmark you can always checkout, even if you later reset or rebase. Tags are your safety net for important moments—they ensure you can always return to a known good state, regardless of what happens to your branches.

The discipline of tagging releases creates a clear history of what was deployed when. Combined with your ability to undo and recover, tags give you confidence to experiment while maintaining stable reference points.

---

## Summary

- A tag is a fixed label pointing to a commit.
- Lightweight tags are simple pointers; annotated tags include metadata and are recommended for releases.
- Use semantic versioning (major.minor.patch) for clarity.
- Push tags explicitly.
- Deploy from tags for reproducibility.
- Treat release tags as immutable history.

Tags mark stability. Branches explore change. The next chapter shows how to integrate all these Git concepts into a practical daily workflow.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.12 — Git in Your Workflow** (`Chapter_3.12_Git_in_Workflow.md`).

Where you assemble everything: branch strategy, commit discipline, merge vs rebase decisions, tagging releases, and practical daily Git habits. You now know how to move through history and mark important moments. Next, you learn how to live inside it.
