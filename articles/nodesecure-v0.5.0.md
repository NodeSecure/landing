---
title: NodeSecure release v0.5.0
description: TBC
author: fraxken
date: 02/03/2020
---

Hello ! 

The "new" release v0.5.0 of [node-secure](https://github.com/ES-Community/nsecure) has been published few hours ago. This release includes new features and a lot of UI improvement.

Do not hesitate to check the article on the [v0.4.0](https://dev.to/fraxken/node-secure-release-v0-4-0-2oih) (which include a presentation of the project too).

I have made a little video to show the new UI and some of the new features (click on the image).
<a href="https://www.youtube.com/watch?v=yPUG9nndg8E&feature=youtu.be">
  <img src="https://i.imgur.com/3xnTGBl.png">
</a>

# Release v0.5.0

## 💀 isDead flag

This is a new activity flag. This means that the dependency (the package) has not received any updates from at least one year and has at least one dependency that need to be updated.

> The condition and the period of one year is still experimental.

In the payload the real name of the flag is **hasOutdatedDependency**. isDead is the composition of hasOutdatedDependency and the new metadata **hasReceivedUpdateInOneYear**.

## New metadata in the payload

The payload has brand-new metadata that has been useful to create the new 💀 flag.

- dependencyCount (Number of dependencies of the package)
- hasReceivedUpdateInOneYear

## 🎭 Emoji on the network graph

This emoji is not a real flag and is only added in the UI to indicate that the package is already somewhere else in the dependency tree (with different versions).

![](https://i.imgur.com/70ynftT.png)

## New searchbar

The new search bar is still a prototype (the goal is to build a search bar with real query API like Discord or Github.). The complete search bar will land in v0.6.0 ! 

![](https://i.imgur.com/823qvpQ.png)

And it is even possible to filter:

![](https://i.imgur.com/0Tv4lLk.png)

Available filters are:
- package (default)
- version
- license
- ext
- builtin (allow to search for usage of a given Node.js core dependency)
- author
- flag (the complete flag name)

## Clickable list items

Some of the list items in the left menu are now clickable (showed in the presentation video). Depending on the kind of items, the action will be different:

- Node.js dependencies (Open the Node.js documentation)
- Third-party dependencies (Open and move to the dependency in the network graph)
- Required Files (Open the file on github.. when possible).

## Show more / Show less for list items

Only the first 5 rows are now displayed by default. Before this feature this was a nightmare to navigate when a given package had a LOT of dependencies and required files.

![](https://i.imgur.com/H6Xr7tI.png)

## License popup

This version allows to click on the License field in the left menu.

![](https://i.imgur.com/hrYODeC.png)

This will open a popup with a table of all licenses used in the project with their conformance information.

![](https://i.imgur.com/UdM8C1z.png)

## New warnings

Warnings emoji has been refactored and has a new meaning. Now the payload can contain a list of warnings. These warnings are:

- unsafe-import (the AST analysis has failed to retrieve the required/imported package/file name).
- unsafe-regex (a vulnerable regex can lead to a [ReDos attack](https://medium.com/@liran.tal/node-js-pitfalls-how-a-regex-can-bring-your-system-down-cbf1dc6c4e02)).
- ast-error (when an error occur in the AST analysis of the package).

Unsafe-import and unsafe-regex are related to a file with the exact position of the problem. Like licenses these warnings are available in a popup:

![](https://i.imgur.com/mLkZf7k.png)

In the JSON it will produce an object like the following one

```json
"warnings": [{
    "kind": "unsafe-regex",
    "start": {
        "line": 81,
        "column": 20
    },
    "end": {
        "line": 81,
        "column": 76
    },
    "file": "old.js"
}]
```

## Improved flags: 👀 and 🔬

The AST analysis has been updated to support new patterns:

- exclude dependency required in a try statement
- exclude the package itself from the dependency list (case detected on ajv).
- exclude one line CJS require from being detected as "minified" file.

Example

```js
modules.exports = require("./src/file.js");
```

## Better CLI

The CLI will now give you a clear state of what is going on under the hood with some new lazy spinners!

![](https://i.imgur.com/Zsxv92Z.gif)

## --keep for nsecure auto command

By default the .json file will be removed when the CLI is closed with the auto command. This can be disabled with the --keep (-k) flag.

This makes the default behavior of auto more consistent.

```bash
nsecure auto express --keep
```

## A lot more...

A lot of refactoring has been done and new tests has been added to the project!

# What's next ?

The next release will "surely" include:

- The final search-bar prototype with a complete query API.
- A new CLI command to run an AST analysis on a given npm package.
- New warnings ? (I want to implement a secrets detection.. not sure "how" yet).
- More tests, more stability etc.

One of the next major features to implement is the support of **package-lock.json** (the current analysis may not match the current locked project dependency tree).

And surely more with the feedbacks of those who use the tool.

# Bonus

With my team we are working on a customizable open-source Security report that use node-secure under the hood to analyze a given list of packages and git repositories. I will write a complete article when the project will be done (soon).

The project on github: https://github.com/SlimIO/Security

Preview of the design report (white theme available too).

![](https://i.imgur.com/1Rwhe5a.png)
![](https://i.imgur.com/GlIwTGT.png)

---

Thanks for reading me and see you for the next release :)
