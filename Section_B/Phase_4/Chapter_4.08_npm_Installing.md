# Section B Phase 4 · Chapter 4.08: npm — Installing and Using Packages

Chapter 4.07 introduced **package.json**, scripts, **npm install**, and the lock file. This chapter focuses on the hands-on workflow: installing specific packages (local and dev), using **require** or **import** in your code, and how Node finds modules in **node_modules**. You will install a real dependency (e.g. a small utility or **express**), use it in a script or server, and understand when to use local vs global installs and **npx**. By the end you can add any package from the npm registry to your project and use it in code.

## Learning Objectives

By the end of this chapter, you should be able to:

- Install a package with **npm install &lt;pkg&gt;** (and **npm install -D &lt;pkg&gt;** for devDependencies) and see it in **node_modules** and **package.json**.
- Use **require("package-name")** (CommonJS) or **import pkg from "package-name"** (ESM) in your code and have Node resolve it from **node_modules**.
- Explain how Node resolves module names: **node_modules** in the current directory, then parent directories; the package’s **main** or **exports** field; and local files with **require("./path")** or **import from "./path"**.
- Prefer **local** installs (project **node_modules**) for app dependencies; use **global** (**npm install -g**) only for CLI tools you want on your PATH; use **npx** to run a package once without installing.
- Wire **scripts** (start, dev, test) to run your app or tests using locally installed packages (e.g. **node index.js** or **npx jest**).

## Key Terms

- **Local install**: **npm install &lt;pkg&gt;** installs into the project’s **node_modules**. Your code **require**s or **import**s from there. Each project has its own versions. Preferred for application dependencies.
- **Global install**: **npm install -g &lt;pkg&gt;** installs into a global directory (e.g. npm’s prefix) so the package’s binaries are on your **PATH**. Used for CLI tools (e.g. **nodemon**, **typescript**) that you run from the shell, not from **require** in a project. Avoid for app libraries.
- **Module resolution**: The process Node uses to find the file for **require("x")** or **import x from "x"**: look in **node_modules/x**, then **node_modules** in parent folders, then the package’s **main** or **exports** entry. For **require("./path")**, Node resolves relative to the current file.

---

## 1) Installing a Package (Local)

From the directory that contains **package.json**, run:

```bash
npm install <package-name>
```

Example:

```bash
npm install express
```

npm downloads **express** (and its dependencies) from the registry, puts them in **node_modules**, and adds **"express": "^4.x.x"** to **dependencies** in **package.json**. It also updates **package-lock.json**. You can now use **require("express")** or **import express from "express"** in any file in that project. The same command works for any package: **npm install lodash**, **npm install chalk**, etc. If the package name is scoped (e.g. **@org/package**), use it as-is: **npm install @org/package**.

### 1.1 Installing a Dev Dependency

Packages that are only needed for development or testing (e.g. a test runner, a linter) can be installed as **devDependencies** so they are not installed in production when someone runs **npm install --omit=dev**:

```bash
npm install -D jest
```

or:

```bash
npm install --save-dev jest
```

This adds **jest** to **devDependencies** in **package.json**. Your **require("jest")** or **import** still works when you run **npm test** or **npm run dev** because by default **npm install** (no flags) installs both **dependencies** and **devDependencies**. The distinction matters for production deploys and for keeping the dependency list clear. Some packages also declare **optionalDependencies** or **peerDependencies**; you will see those in advanced setups. For most projects, **dependencies** and **devDependencies** are enough.

### 1.2 Installing a Specific Version

You can pin a version or install the latest:

- **npm install express@4.18.2** — install exactly 4.18.2.
- **npm install express@latest** — install the latest version (and update **package.json** and the lock file accordingly).

Use **@version** or **@tag** (e.g. **@beta**) when you need a specific release. The lock file will record whatever you installed so **npm install** (no args) reproduces it.

### 1.3 Installing All Dependencies (No Package Name)

When you clone a repo or pull changes, run:

```bash
npm install
```

with no package name. npm reads **package.json** and **package-lock.json** and installs everything. You get the same **node_modules** as everyone else (reproducible). Never commit **node_modules**; do commit **package-lock.json**.

---

## 2) Using an Installed Package in Code

Once a package is in **node_modules**, you load it by **name** (not by path). Node’s module resolution looks for that name in **node_modules**.

### 2.1 CommonJS: require

In a CommonJS file (default in Node unless you set **"type": "module"**):

```javascript
const express = require("express");
const app = express();
// use app...
```

**require("express")** resolves to **node_modules/express**. Node reads **node_modules/express/package.json** and uses the **main** (or **exports**) field to find the entry file. You do not write **require("node_modules/express")**; the name is just **"express"**.

### 2.2 ESM: import

If your project has **"type": "module"** in **package.json** (or you use **.mjs** files), use **import**:

```javascript
import express from "express";
const app = express();
// use app...
```

Same idea: Node resolves **"express"** to **node_modules/express**. Named exports depend on what the package exports: **import { something } from "express"** only works if the package exports **something**. Most packages document their export style (default export vs named exports).

### 2.3 Local Files (Your Own Code)

To load a **file in your project** (not from **node_modules**), use a **relative path**:

```javascript
const myLib = require("./lib/mylib");
// or ESM: import myLib from "./lib/mylib.js";
```

**./** means “relative to the current file.” Node does not look in **node_modules** for **./lib/mylib**; it goes to the file at that path. In ESM, omit the extension only for package names; for local files, include **.js** (or **.mjs**) so Node can resolve them reliably. In ESM, you typically include the extension (e.g. **.js**) for local files. So: **bare specifiers** like **"express"** → resolved from **node_modules**; **relative paths** like **"./lib/mylib"** → resolved relative to the current file.

---

## 3) How Node Resolves Module Names

When you **require("foo")** or **import from "foo"**:

1. Node looks for **node_modules/foo** in the directory of the **current file**, then in **node_modules** in each parent directory, up to the filesystem root. The first **node_modules/foo** found is used. So each project’s **node_modules** at the project root is where your dependencies live.
2. Inside **node_modules/foo**, Node reads **package.json** and uses **main** (or **exports**) to find the entry file. If **main** is **"index.js"**, Node loads **node_modules/foo/index.js**. The **exports** field (Node 12+) can define multiple entry points (e.g. **"exports": { ".": "./index.js", "./utils": "./utils.js" }**); then **require("foo")** gets the main entry and **require("foo/utils")** can get a subpath. Many packages still use only **main**; **exports** is optional but increasingly common.
3. If the name is a path (e.g. **require("./utils")**), Node resolves it relative to the current file and does not look in **node_modules**.

So **node_modules** is the bridge: **npm install** fills it, and **require**/ **import** read from it. Do not edit files inside **node_modules**; upgrade or patch via npm or a different package. Do not commit **node_modules**; it is recreated by **npm install**. Packages can list their own **dependencies**; npm installs those into **node_modules/&lt;pkg&gt;/node_modules** (or flattens when possible). You usually do not need to think about that; just **require** the top-level package name and Node finds the right file. If two packages depend on different versions of the same library, npm may install multiple copies to satisfy both; that is normal and keeps each package working with the version it expects.

---

## 4) Full Example: Install express and Run a Server

From a project that already has **package.json** (e.g. after **npm init -y**):

1. Install express:

   ```bash
   npm install express
   ```

2. Create **index.js**:

   ```javascript
   const express = require("express");
   const app = express();
   const port = process.env.PORT || 3000;

   app.get("/", (req, res) => {
     res.send("Hello from Express");
   });

   app.listen(port, () => {
     console.log(`Server on http://localhost:${port}`);
   });
   ```

3. Add a start script to **package.json** if not present: **"start": "node index.js"**.
4. Run **npm start**. Open **http://localhost:3000** and you should see “Hello from Express.”

This shows the full loop: **npm install** → **node_modules/express** → **require("express")** → run with **npm start**. The same pattern works for any package: install, require or import, use the API the package documents.

---

## 5) Global vs Local Installs

### 5.1 Local (Default): npm install &lt;pkg&gt;

**npm install express** installs **express** into the project’s **node_modules**. Only this project can **require("express")** from that copy. Other projects have their own **node_modules** and their own versions. That is what you want for application code: each project is self-contained and reproducible. Always prefer local installs for libraries your code **require**s or **import**s.

### 5.2 Global: npm install -g &lt;pkg&gt;

**npm install -g nodemon** installs **nodemon** into a global directory so the **nodemon** command is on your **PATH**. You run **nodemon index.js** from the shell; you do not **require("nodemon")** in code. Global installs are for **CLI tools** you use across many projects (e.g. **nodemon**, **typescript**, **eslint**). Downsides: you have one global version, and you may need elevated permissions or a configured npm prefix. Prefer **npx** (see below) for one-off or project-specific tools so you do not pollute the global space.

### 5.3 npx: Run Without Global Install

**npx &lt;pkg&gt;** runs the package’s binary. If the package is in **node_modules**, npx uses it; otherwise npx can download and run it temporarily (and cache it). So you can run **npx create-react-app my-app** without ever doing **npm install -g create-react-app**. For tools you use only in one project, add them as **devDependencies** and run them via **npm run** or **npx** (e.g. **npx jest**, **npx eslint .**). That keeps the project’s tools version-locked and avoids global installs.

---

## 6) Scripts in Practice: start, dev, test

In **package.json** you define scripts that run your app or tools. Use **locally** installed packages inside those scripts so the project stays self-contained.

- **start**: Usually the command to run the app in “production” mode. Example: **"start": "node index.js"**. Run with **npm start**.
- **dev**: Often the same app with auto-reload or extra logging. Example: **"dev": "node --watch index.js"** (Node 18+) or **"dev": "npx nodemon index.js"** if you add **nodemon** as a devDependency. Run with **npm run dev**.
- **test**: Run tests. Example: **"test": "node test.js"** or **"test": "npx jest"**. Run with **npm test**.

By using **node** or **npx** inside scripts, you rely on the project’s **node_modules** (and its **node** from the environment). No need to install **nodemon** or **jest** globally; install them in the project and run via **npm run** or **npx**. When npm runs a script, it adds **node_modules/.bin** to the **PATH** for that script. So if you install **jest**, the script **"test": "jest"** will run **node_modules/.bin/jest** without your having to type the path. That is why **"test": "jest"** works after **npm install -D jest**.

---

## 7) Finding and Choosing Packages

The npm registry has millions of packages. To find one:

- **npm search &lt;term&gt;** (or use the website **npmjs.com**) to search by keyword.
- Check **downloads**, **maintenance**, and **documentation**. Prefer packages that are widely used, recently updated, and have clear docs and a sensible license.
- Read the package’s **package.json** on the registry (or in **node_modules/&lt;pkg&gt;/package.json** after install) to see **main**, **exports**, and dependencies. The README usually explains how to **require** or **import** and what the API is.

When you install, use the **exact package name** (e.g. **express**, not **Express**). Typos can pull in the wrong or malicious package; copy the name from the registry or the docs. **Scoped packages** look like **@org/package-name** (e.g. **@babel/core**). Install them the same way: **npm install @org/package-name**. They go into **node_modules/@org/package-name** and you **require("@org/package-name")** or **import from "@org/package-name"**. Scopes are used by organizations and for namespacing.

To see what is installed in the current project, run **npm ls** (list). It prints the dependency tree. **npm ls &lt;pkg&gt;** shows whether a specific package is installed and which version. **npm outdated** lists packages that have newer versions within the ranges in **package.json**; useful before running **npm update**.

---

## 8) "type": "module" and ESM

If your **package.json** has **"type": "module"**, Node treats **.js** files in that project as ES modules. Then you must use **import**/ **export** (not **require**/ **module.exports**). Installed packages still live in **node_modules**; **import express from "express"** works the same way. Some older packages only ship CommonJS; Node can load them in ESM via **import pkg from "pkg"** (default import). If you mix CommonJS and ESM in the same project, follow Node’s rules: **.mjs** is always ESM, **.cjs** is always CommonJS, and **.js** depends on **"type"**. For new projects, choosing **"type": "module"** or staying with CommonJS and using **require** is a one-time decision; the resolution of **node_modules** is the same.

---

## 9) What Breaks When You Skip the Basics

If you **require("express")** without running **npm install express** first, Node cannot find **express** and throws “Cannot find module 'express'.” Fix: run **npm install express** in the project root. If you run **npm install** in the wrong directory (e.g. one level above **package.json**), **node_modules** may be created in the wrong place and **require("express")** will still fail from your app directory; always run npm from the directory that contains **package.json**. If you use **import** in a file but the project has no **"type": "module"** and the file is **.js**, Node will treat it as CommonJS and **import** will be a syntax error; set **"type": "module"** or rename to **.mjs**. If you install a package globally and then **require** it in code, it usually fails because **require** looks in **node_modules**, not the global install; use local installs for code dependencies. If you delete **node_modules** and do not run **npm install** again, all **require**/ **import** of installed packages will fail; restore with **npm install**. If a package’s **main** or **exports** points to a missing file, you get a runtime error when you **require** it; that is a bug in the package or a broken install—try **npm install** again or a different version.

---

## 10) Homestead Example: API with a Local Dependency

Suppose your homestead API uses **express**. In the project folder:

1. **npm init -y** (if not done).
2. **npm install express**.
3. **"private": true**, **"start": "node index.js"**, **"dev": "node --watch index.js"** in **package.json**.
4. **index.js** (or **server.js**) does **const express = require("express");** and sets up routes.
5. Commit **package.json** and **package-lock.json**; **.gitignore** includes **node_modules/**.

On another machine (or a Pi), **git clone** then **npm install** and **npm start**. The same **express** version (from the lock file) is installed and the app runs. No global install needed. For a small dashboard or sensor API, one or two local dependencies (e.g. **express**, **dotenv**) are enough; keep the list minimal and document why each dependency is there. If you add a new dependency later (e.g. **npm install cors**), run **npm install** once in the project, add **require("cors")** and use it in your app, then commit **package.json** and **package-lock.json** so the next deploy or clone gets the same set of packages.

---

## 11) Uninstalling and Updating

To remove a package:

```bash
npm uninstall <package-name>
```

npm removes it from **node_modules** and from **package.json** (**dependencies** or **devDependencies**). It also updates **package-lock.json**. To update packages within the version ranges in **package.json**, run **npm update**; to upgrade to a specific version (e.g. latest), **npm install &lt;pkg&gt;@latest** (or **@1.2.3**). After any change, **require**/ **import** will use whatever is now in **node_modules**; restart your app if it was running.

---

## 12) Checklist

Before moving on, you should be able to:

1. Run **npm install &lt;pkg&gt;** and **npm install -D &lt;pkg&gt;** and see the package in **node_modules** and **package.json**.
2. In code, **require("pkg")** or **import pkg from "pkg"** and have it resolve from **node_modules** (and know to use **./path** for your own files).
3. Explain in one sentence how Node resolves **"express"**: look in **node_modules/express** (from current file upward), then use the package’s **main** or **exports**.
4. Prefer local installs for app dependencies; use global only for CLI tools; use **npx** to run a package without a global install.
5. Wire **start**, **dev**, and **test** scripts to use **node** or **npx** so the project runs with its local **node_modules**.
6. Run **npm install** (no package name) after cloning to restore **node_modules** and avoid “Cannot find module” errors.
7. Install a specific version with **npm install &lt;pkg&gt;@version** or **@latest**; use **npm ls** and **npm outdated** to inspect and plan updates.

---

## Common Pitfalls

- **Requiring before installing**: **require("express")** fails if you never ran **npm install express**. Install first, then require.
- **Running npm in the wrong directory**: **node_modules** must be next to (or above) the file that **require**s; run **npm install** in the project root.
- **Using global install for app code**: **require** does not look at global installs. Use local **npm install &lt;pkg&gt;** for any package you **require** or **import**.
- **Editing node_modules**: Changes are lost on the next **npm install**. Use a different package or patch via npm scripts/tools if you must.
- **Committing node_modules**: Huge repo and merge issues. Commit **package.json** and **package-lock.json**; ignore **node_modules/**.
- **Wrong module system**: **import** in a **.js** file without **"type": "module"** causes a syntax error. Match **import**/ **export** with **"type": "module"** or **.mjs**.
- **Installing the wrong package**: Similar names exist (e.g. **express** vs something else). Double-check the name on npmjs.com and use the exact string.

---

## Practice: Try These

1. In a project with **package.json**, run **npm install express**. Create **index.js** with **const express = require("express"); const app = express(); app.get("/", (req, res) => res.send("OK")); app.listen(3000);**. Run **node index.js** and open **http://localhost:3000**. Then stop the server and run **npm start** if you added that script.
2. Install a small utility (e.g. **chalk** or **lodash**) with **npm install chalk**. In a script, **require("chalk")** and use one of its functions (e.g. **console.log(chalk.blue("hello"))**). Run the script with **node** and confirm it works.
3. Run **npm install -D nodemon** (or another dev tool). Add **"dev": "npx nodemon index.js"** (or **"dev": "node --watch index.js"**) to **package.json**. Run **npm run dev** and change **index.js**; confirm the server restarts (or that the script reruns). Do not install **nodemon** globally; use the local one via **npx** or **npm run**.
4. In the same project, create **lib/helper.js** that exports a function. In **index.js**, **require("./lib/helper")** and call the function. This reinforces that **./** is for your files and **"express"** (no path) is for **node_modules**.
5. Delete **node_modules** and run **npm install** again. Confirm **require("express")** (and your other deps) work. Then run **npm uninstall express** and confirm **require("express")** fails until you install again.

These exercises lock in install → require/import → run and the difference between local files and **node_modules**. If you get “Cannot find module” for a package you just installed, confirm you are running **node** (or **npm start**) from the directory that contains **node_modules** (usually the project root). If you use **import** and get “SyntaxError: Cannot use import statement,” add **"type": "module"** to **package.json** or rename the file to **.mjs**. If **npm install** fails with permission or network errors, check **npm config get registry** and your network; avoid **sudo npm install** for project dependencies.

---

## Summary

You **install** packages with **npm install &lt;pkg&gt;** (or **-D** for devDependencies). They go into **node_modules** and are listed in **package.json**. You **use** them in code with **require("pkg")** or **import pkg from "pkg"**; Node resolves the name to **node_modules/pkg** and the package’s **main** or **exports**. Use **./path** for your own files. Prefer **local** installs for everything your code depends on; that way each project’s **package-lock.json** pins exact versions and deploys stay reproducible. use **global** only for CLI tools; use **npx** to run a package without installing it globally. Scripts (**start**, **dev**, **test**) should call **node** or **npx** so the project’s **node_modules** is used. When you run **npm run &lt;script&gt;** from the project root, the working directory for that script is the project root, so **node index.js** finds **index.js** there and **require("express")** finds **node_modules/express**. If you run **node** from a subdirectory (e.g. **node src/index.js** from project root), **require("express")** still resolves from the project root’s **node_modules** because Node walks up from the directory of the **current file** (e.g. **src/index.js**) to find **node_modules**. So as long as your entry file is inside the project, resolution works. Do not commit **node_modules**; do commit **package.json** and **package-lock.json**. After cloning, **npm install** plus **npm start** (or **npm run dev**) is the standard way to get the app running; document that in the project README so others (and you later) know the steps. With this workflow you can add any npm package to a project and use it in your Node code. Use **npm ls** to inspect the dependency tree and **npm outdated** to see what can be updated. Scoped packages (**@org/pkg**) install and require the same way with the full name. Next, Chapter 4.09 (JSON) will focus on JSON syntax and structure so you can read and write config and API payloads confidently.

---

## Next

Next: **Chapter 4.09: JSON — Syntax and Structure**. That chapter covers JSON format, rules (keys in quotes, allowed values), and how it relates to JavaScript objects. You will use JSON in **package.json**, config files, and HTTP bodies; the next chapter sets the foundation for parsing and producing JSON in Node (Chapter 4.10).
