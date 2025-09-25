---
title: Everything you need to know: package managers
description: Curious about package managers? Explore their essential role in modern software, from Linux to npm, and learn why they’re the backbone of every developer’s workflow!
author: antoine-coulon
date: 18/10/2022
---

Welcome everyone! This article is the first one of the **Everything you need to know**, a Software Engineering series.

In this series, I will try to give you a solid basic understanding about Software Engineering concepts I consider important.

All modern computer systems include tools that automate the process of installing, uninstalling and updating software.

This responsibility is that of a package manager and several can intervene within the same computer system.

### Operating system

The majority of Unix-based operating systems embed a package manager as standard, providing a multitude of different packages very simply.

If you have ever used a Linux distribution such as Ubuntu or Debian, you've probably used a package manager before. If I say `apt-get update` does that ring a bell?

This command tells APT to update all versions of packages installed. [APT (Advanced Packaging Tool)](https://en.wikipedia.org/wiki/APT_(software)) is a package manager embedded very widely as standard on Linux operating systems. To install a package, you can for example enter the command `apt-get install <package>`.

### Programming language

Most programming languages ​​can embed their own with package managers, either natively or provided within their respective ecosystem.

Take for example [npm](https://www.npmjs.com), the default package manager for Node.js. We can also mention [pip](https://pip.pypa.io/en/stable/getting-started/) for Python, [NuGet](https://www.nuget.org/) for C#, [Composer](https://getcomposer.org/) for PHP, etc. Similar to APT, npm makes it easy to install packages using the `npm install <package>` command.

> For this article, I decided to take npm as an example.
> npm is indeed a very good support to highlight the advantages but also the disadvantages that a package manager can have.
> The advantages and disadvantages listed in the following part are valid for all package managers.

> npm is installed alongside Node.js. To reproduce these examples, [you only need to install Node.js here].

In four parts, we will see what are the main reasons for such an expansion of package managers to all layers of a computer system.

**1.  Ease of use and maintenance of packages**

The main interest of a package manager is obviously to simplify the installation of dependencies external to our application. Before the rise of npm in January 2010, the dependencies of a JavaScript application were mostly installed manually. By "manual installation" I mean:
- downloading a zip archive from a remote server
- unzipping the archive in the project
- manual referencing of the installed version, and this with each update of a dependency. 

With a package manager like npm, we therefore benefit from:
- Simplified installation of a package `npm install <package>`
- The simplified update of a package `npm update <package>`
- The simplified removal of a package `npm uninstall <package>`

The packages are installed in a __node_modules__ folder adjacent to the application and which is entirely managed by npm. All packages located in the node_modules folder can be directly imported from the application.

> In general, each programming language natively embeds its own module resolution management mechanism.

**1.1. Install**

In order for a package to be installed, we first need a name which is in most cases used as a unique identifier. Naming conventions can differ from one ecosystem to another.

```bash
$ npm install rxjs 
```

With this command, the package manager will search within the registry for a package that has the name **rxjs**. When the version is not specified, the package manager will usually install the latest available version.

**1.2. Use**

```javascript
// ECMAScript Modules (ESM)
import { of } from "rxjs";
// CommonJS
const { of } = require("rxjs");
```

The module systems integrated into the programming languages ​​make it possible to import a library installed locally and sometimes remotely (like Go or Deno for example). In this case with Node.js, the package must be installed locally in a node_modules folder. With Node.js, [the module resolution algorithm](https://nodejs.org/api/modules.html#all-together) allows the dependency to be in a node_modules folder either adjacent to the source code or in a parent folder (which sometimes leads to an unexpected behavior).

### 2. Managing the consistency of installed packages

Now, let's dive into a little more detail on one very important aspect that a package manager must manage: **state consistency between installed packages**. So far, installing a package looks like a trivial task, which is just to automate downloading a package of a certain version and making it available in a conventional folder that the application has access to.

However this management of consistency between packages turns out to be relatively difficult and the way of modeling the dependency tree varies according to the ecosystems. Most of the time, we talk about a dependency tree, but we can also talk about a dependency graph, in particular a directed graph.

If you are not familiar with the concept of directed graphs, I invite you [to read the series of articles I wrote about it on dev.to with examples in JavaScript](https://dev.to/antoinecoulon/master-directed-graphs-by-example-with-javascript-4oef).

The implementations of these data structures can be drastically different depending on the ecosystem of a package manager, but also between package managers of the same ecosystem (npm, yarn, pnpm for Node.js for example).

> How to ensure that all developers share the same dependencies and therefore the same versions of each underlying library?

Still in the context of npm, let's take for example a very simple list of dependencies, expressed as an object in the _package.json_ file:

**package.json**

```json
{ 
  "dependencies": {
    "myDependencyA": "<0.1.0"
  }
}
```

This object describes a dependency of our project on the _myDependencyA_ library downloadable from the npm registry. [Semantic Versioning](https://semver.org/) here constrains the version of the library to be installed (here lower than 0.1.0). 

> Semantic version management (commonly known as SemVer) is the application of a very precise specification to characterize the version of software. For more information on this subject, I invite you to take a look at the official specification https://semver.org/lang/fr/

In our case, by remaining on the classic `<major>.<minor>.<patch>` scheme, we express the possibility of installing all the versions of _myDependencyA_ from "0.0.1" to "0.0.9". This therefore means that any version of the dependency that respects the range is considered valid. On the other hand, this also means that if a developer A installs the dependency at 2 p.m. and a developer B installs the dependency at 5 p.m., they may both not have the same dependency tree if ever a new version of _myDependencyA_ is released in the meantime.

The npm dependency resolution algorithm will by default favor the installation of the most recent dependency that respects the semantic management described in the _package.json_. By specifying `npm install myDependencyA`, the most recent version of _myDependencyA_ will be installed respecting the constraint "<1.0.0" (version strictly lower than "1.0.0").

The major problem with this approach **is the lack of stability and reproducibility of the dependency tree from one computer to another**, for example between developers or even on the machine used in production. Imagine that version 0.0.9 of _myDependencyA_ has just been released with a bug and your production machine is about to do an `npm install` on Friday at 5:59 PM…

![Production deployment on friday night](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i9f9zvaod4ox4y7eru1k.png)

The very simple example is often referred as `version drift`. This is why a single description file (in this case package.json) **cannot be enough to guarantee an identical and reproducible representation of a dependency tree**.

Other reasons include:

- using a different version of the package manager whose dependency installation algorithm may change.
- publishing a new version of an indirect dependency (the dependencies of the dependencies we list in the package.json here), which would result in the new version therefore being uploaded and updated.
- the use of a different registry which for the same version of a dependency exposes two different libraries at a time T.

**Lockfiles to the rescue**

To ensure the reproducibility of a dependency tree, we therefore need more information that **would ideally describe the current state of our dependency tree**. This is exactly what lockfiles do. These are files created and updated when the dependencies of a project are modified.

A lockfile is generally written in _JSON_ or _YAML_ format to simplify the readability and understanding of the dependency tree by a human. A lockfile makes it possible to describe the dependency tree in a very precise way and **therefore to make it deterministic and reproducible from one environment to another**. So it's important to commit this file to Git and make sure everyone is sharing the same lockfile.

**package-lock.json**

```json
{
  "name": "myProject",
  "version": "1.0.0",
  "dependencies": {
    "myDependencyA": {
      "version": "0.0.5",
      "resolved": "https://registry.npmjs.org/myDependencyA/-/myDependencyA-0.0.5.tgz",
      "integrity": "sha512-DeAdb33F+"
      "dependencies": {
        "B": {
          "version": "0.0.1",
          "resolved": "https://registry.npmjs.org/B/-/B-0.0.1.tgz",
          "integrity": "sha512-DeAdb33F+"
          "dependencies": {
            // dependencies of B
          }
        }
      }
    }
  }
}
```

For npm, the basic lockfile is called _package-lock.json_. In the snippet above, we can precisely see several important information:
- The version of myDependencyA is fixed at "0.0.5" so even if a new version is released, npm will install "0.0.5" no matter what.
- Each indirect dependency describes its set of dependencies with versions that also describe their own versioning constraints.
- In addition to the version, the contents of the dependencies can be checked with the comparison of hashes which can vary according to the registers used.

A lockfile therefore tries to accurately describes the dependency tree, which allows it to remain consistent and reproducible over time at each installation.

⚠️ **But...**

Lockfiles don't solve all inconsistency problems! Package managers implementations of the dependency graph can sometimes lead to inconsistencies. For a long time, npm's implementation introduced [Phantom Dependencies](https://rushjs.io/pages/advanced/phantom_deps/) and also [NPM doppelgangers](https://rushjs.io/pages/advanced/npm_doppelgangers/) which are very well explained on the [Rush.js](https://rushjs.io/) documentation website (advanced topics that are out of the scope of this blog post).

### 3. Provision of distributed and transparent databases via open-source

**Distributed registries**

A package manager is a client that acts as a gateway to a distributed database (often called a registry). This allows in particular to share an infinite number of open-source libraries around the world. It is also possible to define company-wide private registries in a secured network, within which libraries would be accessible. 

> [Verdaccio](https://github.com/verdaccio/verdaccio) allows to setup a private proxy registry for Node.js

The availability of registries has greatly changed the way software is developed by facilitating access to millions of libraries.

**Transparent access to resources**

The other benefit of open-source package managers is that they most often expose platforms or tools that allow browsing through published packages. Accessing source code and documentation has been trivialized and made very transparent. It is therefore possible for each developer to have an overview or even to fully investigate the code base of a published library.

## 4. Security and integrity

Using open-source registries with millions of publicly exposed libraries is pretty convenient, but what about _security_?

It is true that open-source registries represent ideal targets for hackers: [all you have to do is take control of a widely used library (downloaded millions of times a week) and inject malicious code into it, and no one will realize!](https://therecord.media/malware-found-in-npm-package-with-millions-of-weekly-downloads/)

In this part, we will see the solutions implemented by package managers and registries to deal with these attacks and limit the risks.

**Integrity safety for each installed package**

Given that a package can be installed from any registry, it is important to implement verification mechanisms at the level of the content of the downloaded package, to ensure that no malicious code has been injected during the download, regardless of its origin.

For this, integrity metadata is associated with each installed package. For example with npm, an integrity property is associated with each package in the lockfile. This property contains a cryptographic hash which is used to accurately represent the resource the user expects to receive. This allows any program to verify that the content of the resource matches what was downloaded. For example for `@babel/core`, this is how integrity is represented in package-lock.json:

```json
"@babel/core": {
   "version": "7.16.10",
   "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.16.10.tgz",  
   "integrity": "sha512 pbiIdZbCiMx/MM6toR+OfXarYix3uz0oVsnNtfdAGTcCTu3w/JGF8JhirevXLBJUu0WguSZI12qpKnx7EeMyLA=="
}
```

Let's take a closer look at how integrity can drastically reduce the risk of injecting malicious code by hashing source code.

As a reminder:

> We call hash function, a particular function which, from a datum supplied as input, calculates a digital fingerprint used to quickly identify the initial datum, in the same way as a signature to identify a person. [Wikipedia](https://en.wikipedia.org/wiki/Hash_function)

Let's take for example a simple case:

```javascript
// my-library
function someJavaScriptCode() {
  addUser();
}
```

Let's imagine that this JavaScript code represents a resource that a user might want to download. Using the _SHA1_ hash function, we get the hash `7677152af4ef8ca57fcb50bf4f71f42c28c772be`.
If ever malicious code is injected, the library's fingerprint will by definition change because the input (source code here) to the hash function will have changed:

```javascript
// my-library
function someJavaScriptCode() {
  processMaliciousCode(); // this is injected, the user is not  expecting that
  addUser();
}
```

After injecting the malicious code, still using the same _SHA1_ hash function, we obtain `28d32d30caddaaaafbde0debfcd8b3300862cc24` as the digital fingerprint.
So we get as results:
- Original code = `7677152af4ef8ca57fcb50bf4f71f42c28c772be`
- Malicious code = `28d32d30caddaaaafbde0debfcd8b3300862cc24`

All package managers implement strict specifications on this approach to integrity. For example, npm respects the W3C's "Subresource Integrity or SRI" specification, which describes the mechanisms to be implemented to reduce the risk of malicious code injection.
You can jump directly [here](https://w3c.github.io/webappsec-subresource-integrity/) to the specification document if you want to dig deeper.

**Security constraints at the author level**

To strengthen security at the level of open-source packages, more and more constraints are emerging on the side of project authors and maintainers. Recently, GitHub, which owns npm, announced that it is [forcing two-factor authentication (2FA) for contributors to the 100 most popular packages](https://github.blog/2022-02-01-top-100-npm-package-maintainers-require-2fa-additional-security/). The main idea around these actions is to secure resources upstream by limiting write access to open-source packages and identifying people more precisely.

It's important to also mention that there are tools that can be used to perform automatically scans and audits continuously. 

**Built-in tools**

In order to automate the detection of vulnerabilities, many package managers natively integrate tools allowing to scan the installed libraries. Typically, these package managers communicate with databases that list all known and referenced vulnerabilities. For example, [GitHub Advisory Database](https://github.com/advisories) is an open-source database that references thousands of vulnerabilities across multiple ecosystems (Go, Rust, Maven, NuGet, etc) e.g. `npm audit` command uses this database.

**Third-party tools**

[NodeSecure](https://github.com/NodeSecure)

At **NodeSecure** we are building free open source tools to secure the Node.js & JavaScript ecosystem. Our biggest area of expertise is in package and code analysis.

Here are some example of the available tools:

- [@nodesecure/cli](https://github.com/NodeSecure/cli), a CLI that allow you to deeply analyze the dependency tree of a given package or local Node.js project
- [@nodesecure/js-x-ray](https://github.com/NodeSecure/js-x-ray), a SAST scanner (A static analyser for detecting most common malicious patterns)
- [@nodesecure/vulnera](https://github.com/NodeSecure/vulnera), a Software Component Analysis (SCA) tool
- [@nodesecure/ci](https://github.com/NodeSecure/ci), a tool allowing to run SAST, SCA and many more analysis in CI/CDs or in a local environment

[Snyk](https://snyk.io/) 

Snyk is the most popular all-around solution for securing applications or cloud-based infrastructures. Snyk [offers a free-tier](https://snyk.io/plans/) with SAST and SCA analysis.

To ensure continuous detection of vulnerabilities, it is recommended to run scans each time packages are installed/modified.

**Conclusion**

There you go, you now know what issues are addressed and solved by package managers!

Package managers are complex tools that aim to make life easier for us as developers, but can quickly become problematic if misused.

It is therefore important to understand the issues they deal with and the solutions provided in order to be able to put into perspective several package managers of the same ecosystem. In the end, it's a tool like any other and it must mobilize thinking in the same way as when libraries/frameworks/programming languages ​​are used.

Don't also forget to take into account security issues and use automated tools which can drastically reduce the attack surface!
