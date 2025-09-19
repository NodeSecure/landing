---
title: Announcing new NodeSecure back-end
description: TBC
author: fraxken
date: 11/09/2021
---

Hello 👋

In the last article of the series I announced the future of NodeSecure. Well, we have just finished rebuilding our back-end 😲 (_or at least a first version of it_).

So what are the particularities of this new back-end? This is what we will discover in this article 👀.

But first let me make an introduction for the newcomers.

## What is NodeSecure ❓
NodeSecure is an open source organization that aims to create free JavaScript security tools. Our biggest area of expertise is in npm package and code analysis.

Our most notable projects are:
- [Nsecure](https://github.com/ES-Community/nsecure)
- [JS-X-Ray](https://github.com/NodeSecure/js-x-ray) - SAST Scanner
- [Report](https://github.com/NodeSecure/report) - HTML & PDF security report

The main project is a CLI that will fetch and deeply analyze the dependency tree of a given npm package (Or a local project with a package.json) and output a .json file that will contain all metadata and flags about each package.

The CLI is able to open the JSON and draw a Network of all dependencies (UI and emojis flags will help you to identify potential issues and security threats).

![image](https://camo.githubusercontent.com/5d7138dab440b50d52f3889605d547b5d655988965b6b442dc28abb8d9c1481c/68747470733a2f2f692e696d6775722e636f6d2f33786e5447426c2e706e67)
    
More information on our [Governance page](https://github.com/NodeSecure/Governance).

## New back-end 🚀

### Moving everything to the NodeSecure github org 🏠
All packages have been moved to the [github organization](https://github.com/NodeSecure). You will notice that we have a nice new logo ✨ (created by Tony).

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dgzcdom6a0irdkg0ekry.png)

This should make it simple to implement a new set of tools and collaborate more effectively. The integration of new maintainers should also be greatly simplified.

### Moving to Node.js 16 and ESM

One of the major choices was to use ESM instead of CJS. Many maintainers like Sindresorhus made the choice to switch to ESM which prevented us from updating some of our packages 😭.

There are still a lot of things that are not stable, but we are convinced that it is the right choice for the future of our tools 💪.

Knowing that we still have time before completely finalizing the version 1 we also made the choice to have a limited support to the next LTS of Node.js.

### New segmentation and packages 📦

We have segmented the back-end into a multitude of packages. That makes them reusable in other tools.

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/766w2om5jg9d8ekxvq4g.png)
 
It will also greatly improve the quality of documentation and testing 💎.

| name | description |
| ---- | - |
| [scanner](https://github.com/NodeSecure/scanner) | ⚡️ A package API to run a static analysis of your module's dependencies. |
| [vuln](https://github.com/NodeSecure/vuln) | NPM Audit, Snyk and Node.js Security WG vulnerability strategies built for NodeSecure. |
| [flags](https://github.com/NodeSecure/flags) | NodeSecure security flags 🚩 (configuration and documentation) |
| [i18n](https://github.com/NodeSecure/i18n) | NodeSecure Internationalization |
| [npm-registry-sdk](https://github.com/NodeSecure/npm-registry-sdk) | Node.js SDK to fetch data from the npm API. |

And there is still a lot more to discover (fs-walk, sec-literal , npm-tarball-license-parser etc).

### Scanner API 🔬
Even though we now have a dedicated package the API has not changed.

```js
import * as scanner from "@nodesecure/scanner";
import fs from "fs/promises";

// CONSTANTS
const kPackagesToAnalyze = ["mocha", "cacache", "is-wsl"];

const payloads = await Promise.all(
  kPackagesToAnalyze.map((name) => scanner.from(name))
);

const promises = [];
for (let i = 0; i < kPackagesToAnalyze.length; i++) {
  const data = JSON.stringify(payloads[i], null, 2);

  promises.push(fs.writeFile(`${kPackagesToAnalyze[i]}.json`, data));
}
await Promise.allSettled(promises);
```

The [PDF & HTML report](https://github.com/NodeSecure/report) project has been updated to use this new back-end.

## Team and contributors 👯

We are integrating [Vincent Dhennin](https://www.linkedin.com/in/vincentdhennin/) as a new maintainer. His help and contributions have been important and I can only thank him for this investment.

We are now three (including [Tony Gorez](https://tonygo.dev/) and me).

I would like to thank the other contributors who participated a lot:
- [Nicolas HALLAERT](https://www.linkedin.com/in/nicolas-hallaert/)
- [Quentin LEPATELEY](https://www.linkedin.com/in/quentin-lepateley/)
- [Oleh SYCH](https://www.linkedin.com/in/oleh-sych-41245116a/)
- [Antoine COULON](https://www.linkedin.com/in/antoine-coulon-b29934153/)
- [Ange TEKEU](https://www.linkedin.com/in/ange-tekeu-a155811b4/)
  
## What's next ?

To be clear, the objective is to prepare a version 0.9.0 of NodeSecure implementing the new back-end ([already in progress](https://github.com/ES-Community/nsecure/tree/v0.9.0)).

This will allow us to continually improve and update the back-end features. It will also now be easier to work on the evolution of the CLI.

> We still don't have a roadmap or vision for the new interface. We will start working on it by October or November I think.

---

🙏 Thanks for reading and see you soon for an article on the next version of the CLI 😍.
