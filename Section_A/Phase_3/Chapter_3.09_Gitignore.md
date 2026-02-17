## Section A Phase 3 · Chapter 3.9: Ignoring Files and .gitignore

What not to commit; .gitignore patterns; secrets, build output, environment files; homestead project examples.

## Learning Objectives

By the end of this chapter, you should be able to:
- Decide what should never be committed to a repository.
- Write effective .gitignore patterns using wildcards and directory rules.
- Understand how Git decides what is ignored.
- Use a single project-level .gitignore (and optionally global ignores).
- Apply ignore rules to real-world projects like homestead automation systems.

---

## 1) What Not to Commit

Git tracks files. But not all files belong in history. Some files are sensitive, generated, machine-specific, temporary, huge, or disposable. Those files should not live in your repository.

### Secrets

Never commit secrets. Examples: API keys, database passwords, JWT secrets, Wi-Fi credentials, cloud provider tokens, real production .env files.

If you commit secrets, they are in history forever—even if you delete them later, even if you change the file. Git is immutable history. Once pushed to a remote, secrets may be exposed permanently.

### Homestead Example: Secrets in .env

Suppose your homestead sensor system has a .env file containing database URLs with passwords, JWT secrets, MQTT passwords, Wi-Fi SSID and password, and ESP32 API keys.

This file must never be committed. Instead: ignore .env, commit .env.example with placeholder values (empty fields or example values without real credentials).

### Build Output

Build output is generated from source code. Examples: dist/, build/, coverage/, minified JavaScript files, compiled binaries, transpiled files. Generated files can be recreated, pollute history, change constantly, and are large. Git should track source, not artifacts.

### Dependencies

Example: node_modules/. Node dependencies are large, machine-specific, and installable via package.json. You commit package.json and package-lock.json. You do not commit node_modules/.

### Environment and IDE Files

Local tools create local files. Examples: .vscode/, .idea/, .env.local, .pytest_cache/, .mypy_cache/. These are specific to your machine, often contain personal preferences, and should not clutter project history.

**Exception:** Sometimes you do want to share editor config. Be intentional.

### Operating System Files

OS-level junk files: .DS_Store (macOS), Thumbs.db (Windows), desktop.ini. These appear automatically. They do not belong in version control.

### Homestead Example: What to Ignore

Your homestead automation repo might have .env with real credentials (ignore it), node_modules/ from npm installs (ignore it), __pycache__/ from Python (ignore it), logs/ directory with runtime logs (ignore it), .DS_Store from macOS (ignore it), dist/ or build/ if you compile anything (ignore it), and SQLite database files (ignore them unless they're seed data).

You commit: source code, config templates, dependency manifests like package.json and requirements.txt, documentation.

---

## 2) .gitignore Syntax

.gitignore is a plain text file at the root of your repository. Each line is one rule.

### Basic Structure

The file contains one pattern per line. Lines starting with # are comments. Blank lines are ignored.

### Wildcards

The asterisk matches any characters. Example: *.log matches error.log, server.log, access.log.

### Double Star

Double asterisk matches directories recursively. Example: **/temp/ matches temp/, src/temp/, data/archive/temp/.

### Directory Patterns

Trailing slash means "directory only": build/ ignores the directory and everything inside it. Without slash: build would match files named build too.

### Root-Only Patterns

Leading slash means: only match at repository root. Example: /.env ignores only the .env file at the repository root, not config/.env.

### Negation

You can un-ignore something using an exclamation mark. Example: ignore all .log files with *.log, but keep important.log with !important.log.

Ignore all .log files, except important.log. This is useful for ignoring logs but keeping one example file.

### Homestead Example: Complex Patterns

Your homestead repo might need to ignore secrets like .env, .env.local, .env.production, *.key, *.pem, but keep the example file with !.env.example.

Ignore dependencies like node_modules/, venv/, __pycache__/.

Ignore logs like logs/ and *.log, but keep important logs with !logs/README.md.

Ignore build output like dist/, build/, *.min.js.

Ignore OS files like .DS_Store, Thumbs.db.

This ignores secrets, dependencies, logs, and build output, but keeps example files and documentation.

---

## 3) Common Patterns

Most projects share similar ignore needs.

### Node Projects

Common patterns include: node_modules/ for dependencies, dist/ and build/ for generated output, coverage/ for test coverage output, .env for secrets, and *.log for runtime logs.

### Python Projects

Common patterns include: __pycache__/ and *.pyc for compiled bytecode, venv/ for virtual environment, .env for secrets, and cache directories like .mypy_cache/ and .pytest_cache/ for local tooling.

### Environment Files

Best practice: Ignore real env files (.env, .env.local, .env.production), commit a template (.env.example). The example file contains placeholders without real credentials. This documents configuration without leaking secrets.

### Homestead Example: Multi-Language Project

Your homestead automation might use Node.js for the API, Python for data processing, and have ESP32 MicroPython code.

Include Node.js patterns: node_modules/, dist/, build/, coverage/.

Include Python patterns: __pycache__/, *.pyc, venv/, .mypy_cache/, .pytest_cache/.

Include secrets: .env, .env.local, .env.production, *.key, *.pem.

Include logs: logs/, *.log.

Include databases: *.db, *.sqlite, *.sqlite3.

Include OS files: .DS_Store, Thumbs.db, desktop.ini.

Include IDE files: .vscode/, .idea/, *.swp, *.swo.

But keep examples: !.env.example, !logs/README.md.

This covers all the common patterns for a multi-language homestead project.

---

## 4) Homestead / Project Examples

Let's apply this to your homestead automation stack.

### Sensor API (Node + Express)

Your repo may contain: server.js, routes/, services/, .env, node_modules/, logs/, coverage/.

Your .gitignore should include: node_modules/, .env, logs/, coverage/, *.log.

You commit: source code, config templates, package.json. You ignore: real credentials, logs from production, installed dependencies.

### ESP32 Data Collection Project

Maybe your Python ingestion script stores local data: data/raw-readings.json, data/archive/. If data contains sensitive sensor info, personal logs, or private IP addresses, you may ignore data/*.json but commit data/example.json. Always commit documentation. Never commit private operational data.

### SQLite Database Files

If you use SQLite: database.db. You must decide: Is the database source data? Or is it generated runtime state? For most apps: ignore *.db because production DB should not be committed, and local dev DB is disposable.

### Logs and Runtime Artifacts

If your API logs to logs/server.log, ignore logs/ and *.log. Logs grow indefinitely, pollute diffs, and contain sensitive information.

### Homestead Example: Complete .gitignore

For a homestead automation system with Node.js API, Python scripts, and ESP32 code, include patterns for dependencies (node_modules/, venv/, __pycache__/, *.pyc), secrets and config (.env, .env.local, .env.production, *.key, *.pem, config/local.json, secrets/), logs (logs/, *.log, *.log.*), databases (*.db, *.sqlite, *.sqlite3, data/*.json with !data/example.json), build output (dist/, build/, coverage/, *.min.js), ESP32/MicroPython (*.mpy, __pycache__/), OS files (.DS_Store, Thumbs.db, desktop.ini), IDE files (.vscode/, .idea/, *.swp), but keep examples and docs (!.env.example, !logs/README.md, !data/example.json).

This covers secrets, dependencies, logs, databases, build output, and OS files while keeping example files and documentation.

---

## 5) Global Ignore (Optional)

You can define a global ignore file by configuring Git to use a global excludes file. Put OS junk there like .DS_Store, Thumbs.db, desktop.ini.

Now you don't need to repeat these in every project. Project .gitignore should remain project-specific.

### Homestead Example: Global vs Project

Set up global ignore for OS files by configuring Git to use a global excludes file, then create that file with OS file patterns.

Now every repo automatically ignores OS files. Your project .gitignore focuses on project-specific patterns: dependencies, secrets, logs, build output.

---

## 6) Important: Ignoring Only Works for Untracked Files

If a file is already tracked, adding it to .gitignore does not remove it. You must use git rm with the cached flag followed by the file name, then commit. After that, .gitignore prevents re-tracking. This is a common mistake.

### Homestead Example: Removing Tracked Secrets

You accidentally committed .env with real credentials. Remove it from tracking using git rm with the cached flag followed by .env, then commit with a message about removing .env from tracking.

Add .env to .gitignore.

Now .env is ignored. The file still exists locally (so your app works), but Git no longer tracks it. The commit history still contains the old .env with secrets—you'll need to rotate those credentials since they were exposed.

### Homestead Example: Removing Tracked Logs

You committed logs/server.log before setting up .gitignore. Remove it using git rm with the cached flag followed by the file path, or remove the entire directory with the recursive flag, then commit with a message about stopping tracking log files.

Add to .gitignore: logs/ and *.log.

Now logs are ignored going forward.

---

## 7) Why This Matters for Scaling

As projects grow: more tools, more generated artifacts, more secrets, more collaborators. Without .gitignore, history becomes noisy, secrets leak, builds break, and conflicts increase.

Ignoring correctly keeps repositories clean, secure, portable, and professional.

### Homestead Example: Growing Project

When you start, you might have a few Python scripts, one .env file, and no build output.

As the project grows: Node.js API with node_modules/, Python scripts with __pycache__/, build processes creating dist/, multiple .env files (dev, staging, prod), log files accumulating, SQLite databases for testing.

Without .gitignore, every commit would include thousands of dependency files, compiled Python bytecode, build artifacts, log files, and test databases.

The repo becomes huge, history is noisy, and secrets might leak. A good .gitignore keeps the repo focused on source code and configuration templates.

---

## 8) Common Mistakes and How to Avoid Them

### Mistake: Committing Secrets

**Symptom:** You commit .env with real credentials, then realize your mistake.

**Fix:** Remove from tracking using git rm with the cached flag, add to .gitignore, commit. Rotate the exposed credentials immediately.

**Prevention:** Set up .gitignore before your first commit. Commit .env.example as a template. Never commit files with real secrets.

### Mistake: Forgetting to Ignore Build Output

**Symptom:** Your repo includes dist/ or build/ directories, making it huge and causing merge conflicts.

**Fix:** Add build directories to .gitignore, remove from tracking, commit.

**Prevention:** Set up .gitignore early. Include common build output patterns: dist/, build/, coverage/, *.min.js.

### Mistake: Ignoring Everything in a Directory

**Symptom:** You ignore data/ but need to commit data/example.json or data/README.md.

**Fix:** Use negation: ignore data/* then use !data/example.json and !data/README.md to keep those files.

**Prevention:** Think about what you might need to commit. Use negation patterns to keep documentation and examples.

### Mistake: Not Testing .gitignore

**Symptom:** You add patterns to .gitignore but files still show up in git status.

**Fix:** Check if files are already tracked. If so, remove them from tracking first.

**Prevention:** Test your .gitignore patterns. Create test files and verify they're ignored. Check git status to confirm.

---

## 9) Homestead Project Examples

### Example: Node.js API with Python Scripts

Your homestead API uses Node.js, but you have Python scripts for data processing. Include Node.js patterns: node_modules/, dist/, build/, coverage/. Include Python patterns: __pycache__/, *.pyc, venv/, .mypy_cache/. Include secrets: .env, .env.*, *.key. Include logs: logs/, *.log. Include databases: *.db, data/*.json with !data/schema.json. Include OS: .DS_Store.

This covers both Node.js and Python patterns while keeping schema files.

### Example: ESP32 MicroPython Project

Your ESP32 code uses MicroPython. Include MicroPython patterns: __pycache__/, *.mpy, *.pyc. Include secrets: secrets.py, config.local.py. Include logs: *.log. But keep examples: !secrets.example.py, !config.example.py.

MicroPython creates __pycache__/ directories and .mpy compiled files. Ignore those, but keep example config files.

### Example: Multi-Component System

Your homestead has multiple components: Node.js API server, Python data processors, ESP32 MicroPython code, SQLite databases, log files.

A comprehensive .gitignore includes dependencies (node_modules/, venv/, __pycache__/, *.pyc, *.mpy), secrets (.env, .env.*, *.key, *.pem, secrets/, config/local.* with !config/local.example.*), logs (logs/, *.log), databases (*.db, *.sqlite, data/raw/, data/archive/), build (dist/, build/, coverage/), OS (.DS_Store, Thumbs.db), but keep examples and docs (!.env.example, !logs/README.md, !data/schema.json).

This covers all components while preserving documentation and examples.

---

## 10) Bridge to Section A Phase 1 Chapter 1.7 — Time and State Changes

In Section A Phase 1 Chapter 1.7 you learned that state changes over time, and that we can observe and name those transitions. .gitignore is about choosing what state to observe and name.

Not everything that changes deserves to be in version control. Some changes are noise (build output, logs). Some are sensitive (secrets). Some are machine-specific (IDE config, OS files). .gitignore lets you filter what gets committed—what gets named and observed in history.

This is intentional exclusion: you're not tracking everything that changes, only what matters for the project. That discipline keeps repositories clean, secure, and focused.

---

## Summary

- Never commit secrets, generated files, dependencies, logs, or OS junk.
- .gitignore controls what Git refuses to track.
- Use patterns: wildcards, directories, negation.
- Commit templates (.env.example), not real credentials.
- Homestead projects: ignore env files, logs, databases, build output, and dependency folders.
- .gitignore only affects untracked files; use git rm with the cached flag to stop tracking existing files.
- .gitignore is part of project hygiene and security discipline.

You now understand intentional exclusion in Git. The next chapter shows how to undo mistakes in what is tracked.

---

## Bridge / Next

Next: **Section A Phase 3, Chapter 3.10 — Undoing and Recovering** (`Chapter_3.10_Undoing_and_Recovering.md`).

You will learn how to undo mistakes safely, git restore, git reset, recovering deleted commits, and using reflog to navigate history. You've learned how to ignore what shouldn't be tracked. Next, you learn how to fix mistakes in what is tracked.
