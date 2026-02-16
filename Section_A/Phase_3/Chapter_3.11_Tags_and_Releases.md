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

Without tags, you would refer to releases by commit hash. That is not human-friendly. Instead of `a3f92d4`, you say `v1.2.3`. Tags give meaning to history.

### Tags vs Branches: The Key Difference

Branches are moving pointers. When you commit, the branch moves forward. Tags are fixed pointers. Once created, they point to the same commit unless you explicitly change them.

**Visual example:**

```
A -- B -- C -- D  (main branch)
              ↑
            v1.0.0 (tag)
```

After you commit E:

```
A -- B -- C -- D -- E  (main branch)
              ↑
            v1.0.0 (tag - still points to D)
```

The branch moved, the tag stayed. This is why tags are perfect for marking releases—they freeze a moment in time.

---

## 2) Lightweight vs Annotated Tags

Git supports two kinds of tags: lightweight and annotated. They look similar, but they are not the same.

### Lightweight Tag

A lightweight tag is just a name pointing to a commit. No metadata. No message. No tagger info.

Create one: `git tag v1.0.0`. That's it. It simply attaches a label to the current commit. You can think of it as a branch that never moves.

Lightweight tags are fine for local markers, temporary labels, and personal reference points. But not ideal for releases.

### Annotated Tag

Annotated tags are objects. They include tag name, tagger name, tagger email, date, and message.

Create one: `git tag -a v1.0.0 -m "Release 1.0.0"`. This creates a tag object that points to the commit.

Annotated tags are recommended for releases, deployment points, and anything shared with others. They contain context. That context matters months later.

### Inspecting the Difference

Show a tag: `git show v1.0.0`. For annotated tags, you will see tag metadata, message, then the commit details. For lightweight tags, you only see the commit. Annotated tags are richer.

For releases, always use annotated tags.

### Homestead Example: Lightweight vs Annotated

**Lightweight tag (local experiment):**

You're experimenting with a new sensor configuration and want to mark a checkpoint:

```bash
git tag experiment-checkpoint
```

This is fine for personal use. No one else needs to know about it.

**Annotated tag (production release):**

You're releasing your solar logger API to production:

```bash
git tag -a v1.0.0 -m "Initial production release of solar logger API

- RESTful endpoints for sensor data
- Authentication via API keys
- Database schema v1
- Deployed to production server"
```

Months later, `git show v1.0.0` tells you exactly what was released, when, and by whom. This context is invaluable.

---

## 3) Creating and Listing Tags

Tags are easy to create and manage.

### Tagging the Current Commit

**Annotated:**

```bash
git tag -a v1.0.0 -m "Release 1.0.0"
```

**Lightweight:**

```bash
git tag v1.0.0
```

By default, Git tags the current HEAD.

### Tagging an Older Commit

You can tag any commit by hash:

```bash
git tag -a v0.9.0 a3f92d4 -m "Last beta release"
```

This is useful when you forgot to tag a release or want to retroactively mark a milestone.

### Listing Tags

List tags:

```bash
git tag
```

Filter:

```bash
git tag -l "v1.*"
```

Inspect a tag:

```bash
git show v1.0.0
```

Tags live in your repository like branches do.

### Homestead Example: Tagging a Release

You've finished testing your coop door automation system and want to tag the release:

```bash
# Make sure you're on the commit you want to tag
git log --oneline -5

# Tag it
git tag -a v1.2.0 -m "Coop door automation v1.2.0

- Added DST handling for sunrise/sunset times
- Fixed motor timeout bug
- Improved error logging
- Tested on production hardware"
```

Now you can always reference this exact version:

```bash
git show v1.2.0
```

### Homestead Example: Retroactive Tagging

You realize you forgot to tag v1.1.0 last month. Find the commit:

```bash
git log --oneline --since="2 months ago"
```

Find the commit hash, then tag it:

```bash
git tag -a v1.1.0 abc123d -m "Retroactive tag: Coop door v1.1.0

Tagged after the fact. This was the version deployed on 2024-01-15."
```

---

## 4) Semantic Versioning (Optional but Recommended)

Semantic versioning uses MAJOR.MINOR.PATCH. Example: `1.2.3`. Often prefixed with `v`: `v1.2.3`.

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

- `v1.0.0` — First stable release
- `v1.0.1` — Bug fix
- `v1.1.0` — Added new endpoint
- `v2.0.0` — Breaking API change

### Why Versioning Matters

Version numbers communicate expectations, signal stability, provide clarity for deployment, and help debugging ("Which version is production running?"). Without versioning, you rely on commit hashes. That is fragile and unclear.

### Homestead Example: Versioning Your API

Imagine your homestead sensor API:

- `v0.1.0` — First deployable API
- `v0.2.0` — Added authentication
- `v0.2.1` — Fixed temperature parsing bug
- `v1.0.0` — Stable public API
- `v2.0.0` — Reworked database schema (breaking change)

Tags provide clarity. Months later, you know exactly what changed.

### Homestead Example: Versioning ESP32 Firmware

Your ESP32 devices run MicroPython firmware. Versioning helps track what's deployed:

- `v0.5.0` — Initial WiFi connection
- `v0.6.0` — Added MQTT support
- `v0.6.1` — Fixed WiFi reconnection bug
- `v1.0.0` — Stable production firmware
- `v1.1.0` — Added OTA update capability
- `v2.0.0` — Changed config file format (breaking)

When a device reports an error, you know exactly which firmware version it's running.

### Pre-release Versions

You can also use pre-release identifiers:

- `v1.0.0-alpha.1` — Early testing
- `v1.0.0-beta.1` — Beta testing
- `v1.0.0-rc.1` — Release candidate
- `v1.0.0` — Final release

This helps track the release process.

---

## 5) Pushing Tags

Tags do not automatically push. Branches push automatically with `git push`. Tags do not.

### Push a Single Tag

```bash
git push origin v1.0.0
```

This sends that specific tag to the remote.

### Push All Tags

```bash
git push origin --tags
```

This pushes all local tags.

### Cloning and Tags

When someone clones, they receive tags. They can checkout a tag:

```bash
git checkout v1.0.0
```

This puts you in a "detached HEAD" state. You are viewing a specific historical commit.

### Homestead Example: Sharing Release Tags

You've tagged your release and want to share it:

```bash
# Push the specific tag
git push origin v1.2.0
```

Now others can:

```bash
# Clone and checkout the exact release
git clone <repo-url>
git checkout v1.2.0
```

They're now viewing exactly what was released, not the latest code.

### Homestead Example: Pushing All Tags

You've been tagging locally and want to push everything:

```bash
git push origin --tags
```

This pushes all tags at once. Useful when setting up a new remote or syncing tags.

---

## 6) Tags and Deployment

Tags are powerful in deployment workflows. Instead of deploying whatever is on main, you deploy exactly tag `v1.2.3`. That makes builds reproducible.

### CI/CD and Tags

Continuous Integration systems can trigger on tag creation, build from that tag, and deploy that tag.

**Example flow:**
1. Merge feature branch into main
2. Run tests
3. Create annotated tag `v1.3.0`
4. Push tag
5. CI detects tag
6. Deploy exact tagged commit

This ensures no accidental untested commits go live and production matches a known snapshot.

### Reproducibility

If production runs `v1.2.3`, you can `git checkout v1.2.3` and reproduce exactly what is deployed. No guessing. No ambiguity. Tags anchor deployment to history.

### Homestead Example: Deployment Workflow

Your deployment script checks out a specific tag:

```bash
#!/bin/bash
VERSION=$1

# Checkout the tagged version
git checkout $VERSION

# Build and deploy
npm install
npm run build
./deploy.sh
```

Deploy with:

```bash
./deploy.sh v1.2.0
```

Production always runs exactly what you tagged, not whatever happens to be on main.

### Homestead Example: Rollback to Previous Tag

Production is broken. Rollback to the previous version:

```bash
# Find the previous tag
git tag --sort=-version:refname | head -2

# Checkout and deploy
git checkout v1.1.0
./deploy.sh
```

You're back to a known good state.

---

## 7) Do Not Move or Delete Release Tags

Tags represent history. If others rely on a tag, do not use `git tag -f v1.0.0` or delete and recreate. That breaks trust. Treat release tags like shared history. Immutable.

### Why Tags Should Be Immutable

Once a tag is pushed and others have cloned it, changing it causes confusion. They might have checked out that tag, built from it, or deployed it. Changing the tag breaks their expectations.

### What to Do Instead

If you made a mistake tagging, create a new tag:

```bash
# Wrong: git tag -f v1.0.0
# Right:
git tag -a v1.0.1 -m "Corrected release"
```

If you need to mark a different commit as v1.0.0, use a different version number or create a new tag like `v1.0.0-corrected`.

### Homestead Example: Tagging Mistake

You accidentally tagged the wrong commit as v1.0.0 and already pushed it:

```bash
# Don't do this:
# git tag -f v1.0.0
# git push --force origin v1.0.0

# Do this instead:
git tag -a v1.0.1 -m "Corrected release - actual v1.0.0 content"
git push origin v1.0.1
```

The original v1.0.0 tag stays in history, documenting what happened. The new tag corrects the mistake.

---

## 8) Tags vs Branches

Quick comparison:

| Branch | Tag |
|--------|-----|
| Moves forward | Fixed |
| Used for development | Used for marking points |
| Often long-lived | Snapshot markers |
| Represents active work | Represents a historical moment |

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

You're working on a new feature:

```bash
# Create a branch for the feature
git switch -c feature/solar-alerts
# ... work on feature ...
git commit -m "Add solar panel alert system"
```

When the feature is complete and tested:

```bash
# Merge to main
git switch main
git merge feature/solar-alerts

# Tag the release
git tag -a v1.3.0 -m "Added solar panel alert system"
git push origin v1.3.0
```

The branch was for development. The tag marks the release.

---

## 9) Advanced: Working with Tags

### Checking Out a Tag

When you checkout a tag, you enter "detached HEAD" state:

```bash
git checkout v1.0.0
```

You're viewing that commit, but not on any branch. To make changes, create a branch:

```bash
git checkout -b hotfix-from-v1.0.0
```

### Deleting Tags

Delete a local tag:

```bash
git tag -d v1.0.0
```

Delete a remote tag:

```bash
git push origin --delete v1.0.0
```

**Warning:** Only delete tags that haven't been shared or that you're certain no one depends on.

### Listing Tags with Details

See tags with commit info:

```bash
git tag -l -n1
```

See tags sorted by version:

```bash
git tag --sort=-version:refname
```

### Homestead Example: Finding Tags

List all tags for your project:

```bash
git tag
```

Output:
```
v0.1.0
v0.2.0
v0.2.1
v1.0.0
v1.1.0
v2.0.0
```

See details:

```bash
git tag -l -n1
```

Output:
```
v0.1.0         First deployable API
v0.2.0         Added authentication
v0.2.1         Fixed temperature parsing bug
v1.0.0         Stable public API
v1.1.0         Added new endpoints
v2.0.0         Reworked database schema
```

---

## 10) Common Mistakes and How to Avoid Them

### Mistake: Using Lightweight Tags for Releases

**Symptom:** You tag releases with lightweight tags, losing metadata that would be useful later.

**Fix:** Always use annotated tags for releases: `git tag -a v1.0.0 -m "Release message"`.

**Prevention:** Make annotated tags your default for any tag you might share.

### Mistake: Forgetting to Push Tags

**Symptom:** You tag locally but forget to push, so others can't see the tags.

**Fix:** Push tags explicitly: `git push origin v1.0.0` or `git push origin --tags`.

**Prevention:** Make pushing tags part of your release workflow. Consider aliasing a command that tags and pushes together.

### Mistake: Moving or Deleting Shared Tags

**Symptom:** You force-update or delete a tag that others have cloned, causing confusion.

**Fix:** Don't. Create a new tag instead. If you must, communicate clearly with your team first.

**Prevention:** Treat pushed tags as immutable. Never use `git tag -f` on shared tags.

### Mistake: Inconsistent Versioning

**Symptom:** Your tags don't follow semantic versioning, making it unclear what changed between versions.

**Fix:** Adopt semantic versioning and stick to it. Document your versioning policy.

**Prevention:** Use a consistent format (e.g., `vMAJOR.MINOR.PATCH`) and increment appropriately.

---

## 11) Homestead Project Examples

### Example: Tagging a Production Release

Your solar logger API is ready for production:

```bash
# Ensure tests pass
npm test

# Tag the release
git tag -a v1.0.0 -m "Solar logger API v1.0.0

Production release:
- RESTful API endpoints
- Authentication via API keys
- PostgreSQL database
- Deployed to production server
- All tests passing"

# Push tag
git push origin v1.0.0
```

### Example: Versioning ESP32 Firmware

Tag firmware releases for your ESP32 devices:

```bash
git tag -a v1.2.0 -m "ESP32 firmware v1.2.0

- Fixed WiFi reconnection bug
- Added deep sleep mode
- Improved sensor reading accuracy
- Tested on 5 devices"

git push origin v1.2.0
```

Devices can report their firmware version, and you know exactly what code they're running.

### Example: Multi-Component System Versioning

Your homestead system has multiple components. Tag them separately:

```bash
# API release
git tag -a api-v1.3.0 -m "API v1.3.0 release"

# Frontend release
git tag -a frontend-v2.1.0 -m "Frontend v2.1.0 release"

# Firmware release
git tag -a firmware-v1.0.0 -m "Firmware v1.0.0 release"
```

Or use a monorepo approach with a single version:

```bash
git tag -a v1.3.0 -m "Homestead system v1.3.0

- API: Added new endpoints
- Frontend: Updated UI
- Firmware: Bug fixes"
```

Choose the approach that fits your project structure.

---

## 12) Review: Tags and Releases in One Page

Before moving on, you should be able to state in your own words:

1. **What is a tag?** A fixed pointer to a specific commit, unlike a branch which moves.

2. **What's the difference between lightweight and annotated tags?** Lightweight tags are simple pointers. Annotated tags include metadata (author, date, message) and are recommended for releases.

3. **How do you create an annotated tag?** `git tag -a v1.0.0 -m "Message"`

4. **How do you push tags?** `git push origin v1.0.0` for a single tag, `git push origin --tags` for all tags.

5. **What is semantic versioning?** MAJOR.MINOR.PATCH format where MAJOR = breaking changes, MINOR = new features, PATCH = bug fixes.

6. **Why are tags important for deployment?** They make deployments reproducible—you deploy exactly what you tagged, not whatever happens to be on a branch.

7. **Can you move or delete shared tags?** Technically yes, but you shouldn't. Treat shared tags as immutable.

If any of these is fuzzy, revisit that section. The next chapter assumes you understand how to mark important points in history.

---

## 13) Bridge to Section A Phase 3 Chapter 3.10 — Undoing and Recovering

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
