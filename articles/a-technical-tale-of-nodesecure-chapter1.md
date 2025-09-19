---
title: A technical tale of NodeSecure - Chapter 1
description: TBC
author: fraxken
date: 22/11/2021
---

Hello 👋

I have been working on the [NodeSecure](https://github.com/NodeSecure) project for almost three years now 😵. I have personally come a long way... At the beginning I didn't know much about the field in which I started 🐤.

That's why I thought that writing articles about _"some"_ of the technical difficulties and the tools I used could be valuable 🚀.

I will try to make articles that focus on one aspect 🎯. Let's get started 💃.

## 🔍 Fetching the dependency tree

One of the first challenges I had to solve was how to get the dependency tree and all the information attached to the packages.

My first instinct was to work with [the public API of the npm registry](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md).
This sounds like a very good idea, but you will soon run into a set of problems (cache, private registry etc..).

What I wanted to do has already been implemented in the package named [pacote](https://github.com/npm/pacote#readme).

> **Note:** [Arborist](https://github.com/npm/arborist#readme) did not exist yet. I will come back to this in a future article. The first versions of NodeSecure did not support the analysis of a local project anyway.

### Pacote
As its README suggests, Pacote is a library that allows you to retrieve various data for a given package. To be more precise:

- **A package manifest** (_A manifest is similar to a package.json file. However, it has a few pieces of extra metadata, and sometimes lacks metadata that is inessential to package installation._)
- **A packument** (_A packument is the top-level package document that lists the set of manifests for available versions for a package._)
- **A tarball** (_The archive containing the package itself with the published files_)

These terms are really important and are explained in the pacote README.

> **Note:** There is a package with the type definitions [@npm/types](https://github.com/npm/types).

In the [NodeSecure/scanner](https://github.com/NodeSecure/scanner) these methods are used at different stages of the analysis. When we browse the dependency tree for example we use the `manifest()` method with the range version (or **specifier**) of the package.

```js
await pacote.manifest(gitURL ?? packageName, {
  ...NPM_TOKEN,
  registry: getLocalRegistryURL(),
  cache: `${os.homedir()}/.npm`
});
```

The library allows you to manage a whole set of things quite quickly without too much difficulty 💪.

Note that in the above code **there is a notion of Git URL** 👀.

### 🔬 Dependency resolution

You are probably used to see [SemVer](https://semver.org/lang/fr/) versions or ranges within your package.json. Quite similar to this:

```json
"dependencies": {
    "@nodesecure/flags": "^2.2.0",
    "@nodesecure/fs-walk": "^1.0.0",
    "@nodesecure/i18n": "^1.2.0",
    "@nodesecure/js-x-ray": "^4.1.2",
    "@nodesecure/npm-registry-sdk": "^1.3.0"
}
```

But there are many other ways to install/link a dependency within a package.json 😲:

- [URL to a tarball archive](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#urls-as-dependencies)
- [Git URLs](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#git-urls-as-dependencies)
- [GitHub URLs](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#github-urls)
- [Local Paths](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#local-paths)

One of the advantages of pacote is that it handles most of these resolutions for you 😎. I discovered all this while working on the subject (because I had never dealt with those types of resolutions).

If you want to be able to spot them here is a regular expression:
```js
if (/^([a-zA-Z]+:|git\+|\.\\)/.test(version)) {
  // Version with custom resolution
}
```

This also explains why in NodeSecure we have a "[hasCustomResolver](https://github.com/NodeSecure/flags/blob/main/FLAGS.md)" flag allowing quick identification of packages using resolutions to dependencies that diverge from the usual.

Pacote also exposes a `resolve()` method:

```js
import pacote from "pacote";

const tarURL = await pacote.resolve("@slimio/is@^1.0.0");
```

It resolve a specifier like `foo@latest` or `github:user/project` all the way to a tarball url, tarball file, or git repo with commit hash.

### 📦 Download and extract tarball

[One of the steps](https://github.com/NodeSecure/scanner/blob/master/src/tarball.js#L49) is to retrieve the package on the local system to be able to analyze it and retrieve a set of information.

```js
const spec = ref.flags.includes("isGit") ?
  ref.gitUrl : `${name}@${version}`;

await pacote.extract(spec, dest, {
  ...NPM_TOKEN,
  registry: getLocalRegistryURL(),
  cache: `${os.homedir()}/.npm`
});
```

The package will be extracted into a temporary directory generated when the scanner is launched.

> **Note:** see [fs.mkdtemp](https://nodejs.org/api/fs.html#fspromisesmkdtempprefix-options)

Once the extraction is finished, we will retrieve the information we need:

- Files, extensions, size on disk etc..
- Execute [NodeSecure/JS-X-Ray](https://github.com/NodeSecure/js-x-ray) on each JavaScript files.
- Fetch licenses and retrieve their SPDX conformance.

We will dig deeper into the steps of static code analysis in a future article.

### 😈 It can't be that simple

In all this there are things quite complex to manage:

- Same packages but with different "range" of versions 🎭.
- Ensure the integrity of the links (relations) between packages.

---

**The first one** is hard because most of the time we are dealing with SemVer range and not with the EXACT version of the package. There is quite a bit of connection here with how npm handles conflict during installation (also [how npm algorithms pick the right manifest](https://github.com/npm/npm-pick-manifest)).

I think I probably still lack some vision and experience on the subject. The current code is probably quite heavy too.

Today the `cwd` API of the Scanner use Arborist. For the `from` API i would like to avoid having to deal with a packument.

---

For **the second one** it is mainly a problem with the behaviour of the walker that will browse asynchronously the tree. We must therefore avoid that a package already analyzed is taken into account again. The problem with this is that we will be missing relationship links between some packages in the tree.

The current scanner solves the problem by going through all the dependencies one last time to create the missing link.

```js
for (const [packageName, descriptor] of payload.dependencies) {
  for (const verStr of descriptor.versions) {
    const verDescriptor = descriptor[verStr];

    const fullName = `${packageName}@${verStr}`;
    const usedDeps = exclude.get(fullName) ?? new Set();
    if (usedDeps.size === 0) {
      continue;
    }

    const usedBy = Object.create(null);
    const deps = [...usedDeps].map((name) => name.split(" "));
    for (const [name, version] of deps) {
      usedBy[name] = version;
    }
    Object.assign(verDescriptor.usedBy, usedBy);
  }
}
```

## ✨ Conclusion

That's it for this article where we have explored a little bit the difficulties around going through the dependency tree.

If you like the concept don't hesitate to like and share.

🙏 Thanks for reading and see you soon for a new article.

