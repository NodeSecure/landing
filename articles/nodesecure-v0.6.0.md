---
title: NodeSecure release v0.6.0
description: TBC
author: fraxken
date: 06/04/2020
---

Hello world!

I recently published the release v0.6.0 of [Node-secure](https://github.com/ES-Community/nsecure). If you missed the previous articles:

- [Release v0.5.0](https://dev.to/fraxken/node-secure-release-v0-5-0-16o6)
- [Release v0.4.0](https://dev.to/fraxken/node-secure-release-v0-4-0-2oih) (**include a presentation of the project**).

These past weeks I have worked hard on exporting the AST Analysis in is own npm package **js-x-ray**. I have [written an article on this](https://dev.to/fraxken/node-secure-js-x-ray-4jk0) subject recently if you want to know more.

As usual we will review the new features that version 0.6.0 brings.

# New features
---
## no more AST analysis and more coverage
The AST analysis has been moved to the [js-x-ray](https://github.com/fraxken/js-x-ray) package. This notably allowed to reduce the number of tests to maintain.

Even more tests have been added to enhance the coverage by ten percent (95%).

## webpack
All front-end assets is now bundled with webpack. This slightly improves the maintainability of front assets and codes.

The configuration is surely not perfect, and a lot of space could surely be saved for the package tarball.

## i18n
This version allows for new languages to be added. The current version support both **English** and **French** (which is my native language).

![](https://i.imgur.com/vlI3laN.gif)

The tokens cover all the parts of Node-secure (CLI, API and UI). However, the UI is not entirely finished because a lot of text is added through the JavaScript code (I will work on improving the surface for the next version.).

Feel free to pull-request your own language (or help with existing one). There is a root `i18n` directory on the Github.

The `lang` command has been added to be able to switch between languages.

```bash
$ nsecure lang
```

## used by + npm home page

Move between parent and children easily with the left menu (used by / third-party dependencies).

And a new link to open the npm package page.

![](https://media.discordapp.net/attachments/605589188309680141/696660709399855114/unknown.png)

## multiple filters searchbar

The new searchbar allows to search anything on the tree (graph) by multiple criteria (filters). The current available filters are:

- package (**the default filter if there is none**).
- version (take a semver range as an argument).
- flag (list of available flags in the current payload/tree).
- license (list of available licenses in the current payload/tree).
- author (author name/email/url).
- ext (list of available file extensions in the current payload/tree).
- builtin (available Node.js core module name).

Exemple of query:

```
version: >=1.2 | 2, ext: .js, builtin: fs
```

The searchbar and some of the filters still require a huge amount of work to work properly (example: there is missing flags). So don't worry we will work to improve it for the next version!

![](https://i.imgur.com/qsJRh00.gif)

## new verify command

```bash
$ nsecure verify express
```

This new command has only been fully implemented as API but not yet full featured for the CLI. I created the command to run complete and advanced analysis on a given npm package.

Why ?
- Better precision on the SourceLocation of each required dependency.
- More metadata (which we should normally avoid to not make the json too heavy).

And maybe more in the future. In CLI the command only print the JSON payload to the terminal.

```ts
interface VerifyPayload {
    files: {
        list: string[];
        extensions: string[];
        minified: string[];
    };
    directorySize: number;
    uniqueLicenseIds: string[];
    licenses: License[];
    ast: {
        dependencies: {
            [fileName: string]: Dependencies;
        };
        warnings: Warning[];
    };
}
```

## global warnings

The root of the Node-secure JSON has been completely refactored to allow new metadata to appear in the future.

```json
{
  "id": "7743b4ef",
  "rootDepencyName": "express",
  "warnings": [],
  "dependencies": {}
}
```

And one of the new root metadata is **warnings**. At the moment these are just simple warning messages.

![](https://i.imgur.com/BVsiQdN.jpg)

> Example with @scarf/scarf which is a package that collect data **against your will by default**.

These warnings will obviously evolve over time!

## New warnings

New experimental warnings were added by the js-x-ray AST analysis:

- **unsafe-stmt** (eval or Function("..."))
- **hexa-value** (An hex value has been detected in a Literal)
- **short-ids** (This mean that all identifiers has an average length below 1.5. Only possible if the file contains more than 5 identifiers).
- **suspicious-string**

Hexa-value is not a much relevant as we want yet (we will work to remove 80-90% of false positives).

> Please feel free to feedback on these warnings! Making them as precise as possible is essential to achieve the goal of Node-secure.

## Better AST Analysis

At least 20 to 30 hours of work have been invested on the [js-x-ray](https://github.com/fraxken/js-x-ray) package. The current release detects major security threats in **ALL** Node.js code payload of the precedent attacks and issues (some are hosted on [badjs](https://badjs.org/).).

> If you think you have a code that is not detected then open an issue (We'll make sure to detect it in the future.).

At the beginning of the project we laughed about how cool it would be to be able to detect what's going on in the following code:

```js
function unhex(r) {
    return Buffer.from(r, "hex").toString();
}

const g = eval("this");
const p = g["pro" + "cess"];

const evil = p["mainMod" + "ule"][unhex("72657175697265")];
evil(unhex("68747470")).request
```

But it's no longer a dream...

```
required:
[ 'http' ]

warnings:
[
  'unsafe-stmt -> eval',
  'unsafe-assign -> g.process',
  'unsafe-assign -> p.mainModule.require',
  'hexa-value -> require',
  'unsafe-import -> http'
]
```

_(this is a simple log, there a much more available informations like SourceLocation etc)_

## New flag ⚔️ hasBannedFile
_No more inspiration for emoji 😅_

This new flag uses the API entry of the package [ban-sensitive-files](https://github.com/bahmutov/ban-sensitive-files). This highlight that the project has at least one sensitive file (or a file with sensitive information in it).

File like .pem or .key are considered **sensitive**.

## A lot of fix and improvement

- Fix UI popup overflow-y and add a max-height.
- Fix Node.js fs ENOENT error with the auto-command when the nsecure-result.json file is manually deleted.
- Add child_process to the list of dependencies for 🌍 hasExternalCapacity flag.
- Remove all `@types/` from unused dependencies list.

# What's next ?

The next version will mainly be used to stabilize and complete the functionality of this version.

- Add an history to the searchbar.
- Add a new size filter (ex: `size: >= 32KB`).
- Fix all bugs and add translation tokens (searchbar).
- Add the CLI output for **verify** command.
- Add more i18n tokens for the UI.
- Add the list of "sensitive" files in the JSON (and the left menu in the UI).

One of the next major feature will be to walk the dependency tree by using the package-lock.json (only with the **cwd** command). This feature will bring a lot of new flags to match as possible the usage of [lockfile-lint](https://github.com/lirantal/lockfile-lint).

# How to use it ?

```bash
$ npm i nsecure -g
$ nsecure auto express
```

Please take a look at the complete documentation [here](https://escommunity.dev/nsecure/).

# Conclusion

Thank to all of those who give me valuable feedback. Thank you for taking the time to read my articles too!

https://github.com/ES-Community/nsecure

_Think to put a star on the github!_

Best Regards,
Thomas
