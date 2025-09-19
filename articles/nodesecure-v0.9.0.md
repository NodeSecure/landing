---
title: NodeSecure v0.9.0
description: TBC
author: fraxken
date: 07/12/2021
---

Hello 👋,

After more than ten long months of work we are finally there 😵! [Version 0.9.0](https://github.com/ES-Community/nsecure/releases/tag/v0.9.0) has been released on npm 🚀.

This is a version that required a lot of effort. Thank you to everyone who contributed and made this possible 🙏.

So what are the features of this new release v0.9.0? This is what we will discover in this article 👀.

> For newcomers you can learn more about NodeSecure [here](https://github.com/NodeSecure/.github/blob/master/profile/README.md) or by reading the series.

## V0.9.0 💪
This new version uses the new back-end and especially [version 3 of the scanner](https://github.com/NodeSecure/scanner/releases/tag/v3.0.0).

### ESM instead of CJS
This is a choice we explained in [a previous article](https://dev.to/fraxken/announcing-new-node-secure-back-end-1dp9). This version has been completely rewritten in ESM.

We also made the choice to abandon Jest which causes too many problems 😟. We now use [tape](https://github.com/substack/tape).

### Better CLI
All commands are now separated by file and the `bin/index.js` file has been cleaned of all unnecessary code.

![CLI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rpbgg7n9vtzy6ix7hqri.png)
 
We are also working on adding UT for each command (which should avoid regressions and allow better contributions).

### New front-end network management
This release heavily improves the front-end code with the addition of a package dedicated to vis-network management.

{% github NodeSecure/vis-network %}

This should also allow us to migrate more easily to D3.js in 2022 🚀.

### Better resolver support
The new version of the scanner has support for `github:` and `git:` spec.

The scanner is now able to analyze the following dependencies:
```json
"dependencies": {
  "zen-observable": "^0.8.15",
  "nanoid": "github:ai/nanoid",
  "js-x-ray": "git://github.com/NodeSecure/js-x-ray.git",
  "nanodelay": "git+ssh://git@github.com:ai/nanodelay.git",
  "nanoevents": "git+https://github.com/ai/nanoevents.git"
}
```

### Better payload structure

The structure of JSON has been improved to be more consistent (especially on the management of versions by dependency).

The latest version of the scanner also corrects many inconsistencies in the management of authors and maintainers.

```json
"author": {
  "name": "GENTILHOMME Thomas",
  "email": "gentilhomme.thomas@gmail.com"
},
"publishers": [
  {
    "name": "fraxken",
    "email": "gentilhomme.thomas@gmail.com",
    "version": "2.2.0",
    "at": "2021-11-11T18:18:06.891Z"
  }
],
"maintainers": [
  {
    "name": "kawacrepe",
    "email": "vincent.dhennin@viacesi.fr"
  },
  {
    "name": "fraxken",
    "email": "gentilhomme.thomas@gmail.com"
  },
  {
    "name": "tonygo",
    "email": "gorez.tony@gmail.com"
  }
]
```

### Brand new vulnerabilities management

We have already presented it, but now we use our own package that allows to recover vulnerabilities using several strategies (Security WG, NPM Audit etc..).

{% github NodeSecure/vuln %}

This is just the beginning and I think it will soon be a fully featured project. Among the new features there is a new standard format dedicated for NodeSecure:

```ts
export interface StandardVulnerability {
    id?: string;
    origin: Origin;
    package: string;
    title: string;
    description?: string;
    url?: string;
    severity?: Severity;
    cves: string[];
    cvssVector?: string;
    cvssScore?: number;
    vulnerableRanges: string[];
    vulnerableVersions: string[];
    patchedVersions?: string;
    patches?: Patch[];
}
```

### Trojan source detection with JS-X-Ray 4.2.0

The new backend implements the version 4 of JS-X-Ray. In this latest release we added a warning for [Trojan source](https://www.trojansource.codes/).

### Documentation and tests
A lot of effort has been put into adding documentation and unit testing to all of the projects.

There is still a long way to go to make this even more accessible and you are welcome to help us.

## What's next ?

We are now working as a group on different topics. We have many ongoing projects/subjects:

- [Specification of a configuration](https://github.com/NodeSecure/rc/issues/1) file for our projects.
- Better analysis and identification of authors and maintainers. See [NodeSecure/authors](https://github.com/NodeSecure/authors).
- Creating new tools to be executed in CI.
- Working on the next Web UI (TypeScript + [Catalyst](https://github.github.io/catalyst/)).

## Conclusion 🙏

We should be able to produce more frequent releases until the new UI comes.

Thanks again to the core contributors of the project without whom we would not have arrived here today! 

See you soon for the release v0.10.0 💃.
