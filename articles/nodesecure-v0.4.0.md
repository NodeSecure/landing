---
title: NodeSecure release v0.4.0
description: TBC
author: fraxken
date: 11/01/2020
---

Hey !

Writing my first article on the platform to introduce a new release of a tool. I'm working on for few months with some members of the French JavaScript community.

https://github.com/ES-Community/nsecure

# First, What is node-secure (or nsecure) ?

Node-secure is a CLI that will fetch and deeply analyze the dependency tree of a given npm package (Or a local project with a package.json) and output a .json file that will contains all metadata and flags about each packages.

The CLI is able to open the JSON and draw a Network of all dependencies (UI and emojis flags will help you to identify potential issues and security threats).

The package is usable as an API too if you want to achieve a security analysis on multiple non-related packages or projects (As we do in my team: https://github.com/SlimIO/Security).

# Release v0.4.0

So what's new in this release ? This is what we will see below:

## Enhanced license analysis with conformance

Thanks to [Tierney Cyren](https://twitter.com/bitandbang) for developing the [conformance](https://github.com/cutenode/conformance#readme) package which is allowing the tool to retrieve all spdx informations in the generated .json file.

```json
{
    "uniqueLicenseIds": [
        "MIT"
    ],
    "hasMultipleLicenses": false,
    "licenses": [
        {
            "uniqueLicenseIds": [
                "MIT"
            ],
            "spdxLicenseLinks": [
                "https://spdx.org/licenses/MIT.html#licenseText"
            ],
            "spdx": {
                "osi": true,
                "fsf": true,
                "fsfAndOsi": true,
                "includesDeprecated": false
            },
            "from": "package.json"
        }
    ]
}
```

All informations are not in the UI yet... But these are going to be useful for advanced conformance tests on a whole enterprise package/project stack.

## New flags documentation and UI legends
While this is certainly not perfect yet, we have worked on improving the documentation and legends UI to allow developers to better understand the implication of all flags (and by the same way some road for resolving some of them).

![](https://i.imgur.com/dTCVT9J.png)

And emoji in the left "info" menu now show a little description on hover:

![](https://i.imgur.com/ruZDoOM.png)

> Help is welcome to improve these descriptions!

## New global stats
This release includes three new global stats:

- Extensions types count
- Licenses count
- Maintainers (with Avatar and link when available).

The maintainers stat is not finished yet. (and this doesn't include git contributors and npm package publishers.). Right now this is more about packages owners rather than maintainers.

![](https://i.imgur.com/U9BQwRI.png)

## New flag

### 📚 hasMultipleLicenses

This flag has been created in case we detect different licenses in different files. For example:

- package.json: MIT detected
- LICENSE: ISC detected

So in this given case the package will be flagged has been having multiple licenses.

### 👀 hasMissingOrUnusedDependency

The package has a missing dependency (in the package.json) or a dependency installed but not required in the code itself.

![](https://i.imgur.com/eD4E7nF.png)

However don't jump to conclusion to soon! Some packages use for good reason dev dependencies like `@types/node` or even use a package installed by a sub dependency (not a cool practice but it happens...).

## New CLI commands
This version brings a new **auto** command to the CLI that allow to chain a **cwd** or **from** command with the command to open the json with an http server.

Before with v0.3.0:

```bash
$ nsecure from express
$ nsecure http
# still possible, but http has been replaced with the `open` command
```

After with v0.4.0:
```bash
$ nsecure auto express
```

## Everything else

- More tests (65% to 75%+ coverage).
- new AST features (require.resolve, process.mainModule ...).
- Enhance and cleanup vulnerabilities detection code (and execute hydrate-db automatically).

# Installation ?

```bash
$ npm install nsecure -g
```

Node.js v12.10.0 or higher is required to run the tool. Check the project page for all informations and usage example: https://github.com/ES-Community/nsecure

# What's next ?

Still a lot of work around making the current implemented features dry (still a lot of edge cases where flags are not getting the situation).

- Advanced search bar: https://github.com/ES-Community/nsecure/issues/20
- Show-more btn for list items: https://github.com/ES-Community/nsecure/issues/19
- A new flag 💀 for packages with no publication since one year or more.
- Enhance AST analysis to detect and verify unsafe regex and secrets !
- A new command to run a complete and detailled AST analysis on a given package (will return location, count of each dependency etc..).
- Etc...

Thanks for reading me ! 

Best Regards,
Thomas
