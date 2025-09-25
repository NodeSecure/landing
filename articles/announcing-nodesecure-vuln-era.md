---
title: NodeSecure Vuln-era
description: Dive into the rebranding of Vulnera, NodeSecure’s powerful tool for uncovering Node.js vulnerabilities from multiple sources. Discover its evolution and how it’s shaping the future of open source security!
author: fraxken
date: 21/07/2022
---

Hello 👋,

Back for a little article about the rebranding of one of the NodeSecure tools: [Vulnera](https://github.com/NodeSecure/vuln) (previously *vuln*, the **vuln-era** has begun!).

An opportunity for me to also write about this wonderful project that was born with the redesign of the back-end less than a year ago ⌚. If you don't remember I wrote an article:

{% link https://dev.to/fraxken/announcing-new-node-secure-back-end-1dp9 %}

Don't wait and dive in 🌊 with me to discover this tool 💃.

## What is Vulnera ? 👀

Vulnera is a package that allows you to **programmatically** fetch your Node.js project vulnerabilities from **multiple sources or strategies**:

- NPM Audit ([Github Advisory Database](https://github.com/advisories))
- [Sonatype OSS Index](https://ossindex.sonatype.org/)
- `deprecated` [Node.js Security WG Database](https://github.com/nodejs/security-wg/tree/main/vuln)
- Snyk

> 📢 Feel free to push new sources (we have [a guide](https://github.com/NodeSecure/vuln/blob/main/docs/adding_new_strategy.md) on how to add/contribute one).

The code was originally designed for vulnerability management within the [Scanner](https://github.com/NodeSecure/scanner). Yet, its API is **evolving** with the objective of making it a **full-fledged project**.

```js
import * as vulnera from "@nodesecure/vulnera";

const def = await vulnera.setStrategy(
  vulnera.strategies.NPM_AUDIT
);

const vulnerabilities = await def.getVulnerabilities(process.cwd(), {
  useStandardFormat: true
});
console.log(vulnerabilities);
```

### Standard vulnerability format 👯

We have created a standard format to reconcile the different sources.

```ts
export interface StandardVulnerability {
  /** Unique identifier for the vulnerability **/
  id?: string;
  /** Vulnerability origin, either Snyk, NPM or NodeSWG **/
  origin: Origin;
  /** Package associated with the vulnerability **/
  package: string;
  /** Vulnerability title **/
  title: string;
  /** Vulnerability description **/
  description?: string;
  /** Vulnerability link references on origin's website **/
  url?: string;
  /** Vulnerability severity levels given the strategy **/
  severity?: Severity;
  /** Common Vulnerabilities and Exposures dictionary */
  cves?: string[];
  /** Common Vulnerability Scoring System (CVSS) **/
  cvssVector?: string;
  /** CVSS Score **/
  cvssScore?: number;
  /** The range of vulnerable versions */
  vulnerableRanges: string[];
  /** The set of versions that are vulnerable **/
  vulnerableVersions: string[];
  /** The set of versions that are patched **/
  patchedVersions?: string;
  /** Overview of available patches **/
  patches?: Patch[];
}
```

You can always use the original formats of each source of course 😊. We have implemented and exposed **TypeScript interfaces** for each of them.

![NodeSecure types](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0eqb67gqp772iawr10gp.png)

## Usage in Scanner 🔬

On the scanner we have all the necessary information because we go through the dependency tree 🎄. At [the end of the process](https://github.com/NodeSecure/scanner/blob/master/src/depWalker.js#L297), we recover all vulnerabilities by iterating **spec** by **spec** within the **hydratePayloadDependencies** strategy method.

```js
const {
  hydratePayloadDependencies,
  strategy
} = await vulnera.setStrategy(
  userStrategyName // SNYK for example
);
await hydratePayloadDependencies(dependencies, {
  useStandardFormat: true,
  path: location
});

payload.vulnerabilityStrategy = strategy;
```

The following diagram explains the overall behavior and interactions between the Scanner and Vulnera.
![NodeSecure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6x76ry38w7qcitdulayh.png)

If you want to learn more about the Payload you can check the TypeScript interface [here](https://github.com/NodeSecure/scanner/blob/master/types/scanner.d.ts#L132).
 
## What's next ? 🚀

Some sources are more difficult to exploit than others (for NPM we use [Arborist](https://www.npmjs.com/package/@npmcli/arborist) which simplifies our lives).

```js
const { vulnerabilities } = (await arborist.audit()).toJSON();
```

However, we have to think and create mechanics to exploit sources like Sonatype 😨. This is required for API like `getVulnerabilities()`.

Among the major subjects and **ideas** we are working on:
- Create a **private** database to benchmark the sources between them (see [#29](https://github.com/NodeSecure/vulnera/issues/29)).
- Merging multiple sources in one (see [#25](https://github.com/NodeSecure/vulnera/issues/25)).
- Fetch vulnerabilities of a given remote package (with support for private registry like [verdaccio](https://verdaccio.org/)). At the moment we only support the analysis of a local manifest or a payload of the scanner.

## Credits 🙇

This project owes much to our core collaborator [Antoine COULON](https://www.linkedin.com/in/antoine-coulon-b29934153/) who invested a lot of energy to improve it 💪.

> **Fun fact:** [its first contribution](https://github.com/NodeSecure/cli/commit/236c7333720b14878b5f620f3a814c045a375a45) 🐤 on NodeSecure was also on the old version of the code Scanner that managed vulnerabilities.

But I don't forget individual contributions 👏
- [Mathieu Kahlaoui](https://www.linkedin.com/in/mathieu-kahlaoui-0887a1158/) for adding [the getVulnerabilities() API](https://github.com/NodeSecure/vuln/pull/33)
- [Oleh Sych](https://www.linkedin.com/in/oleh-sych-41245116a/) for adding [Snyk strategy](https://github.com/NodeSecure/vuln/pull/11)
- Medhi for his work on the logo

---

Thanks 🙏 for reading me and see you soon for another article!
