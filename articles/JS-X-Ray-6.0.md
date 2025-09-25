---
title: JS-X-Ray 6.0
description: Discover what’s new in JS-X-Ray 6.0! Explore the latest features of this open source JavaScript security analyzer and see how it helps you write safer, cleaner code.
author: fraxken
date: 16/01/2023
---

Hello 👋

It's been a while since the **last article** on JS-X-Ray 😲!

{% link https://dev.to/nodesecure/js-x-ray-3-0-0-3ddn %}

In this article I will present you the latest major version 👀. I didn't do an article on version 4 and 5 because they didn't introduce new features (only breaking changes on the API).

## 📢 What is JS-X-Ray ?

If you are new in town, [JS-X-Ray](https://github.com/NodeSecure/js-x-ray) is an open source JavaScript SAST (Static Application Security Testing). The tool analyzes your JavaScript sources for patterns that may affect the security and quality of your project 😎.

Among the notable features:

- Retrieving dependencies (CJS & ESM support) and detecting suspicious import/require.
- Detecting unsafe RegEx.
- Detecting obfuscated source (and provide hints on the tool used).

As well as a lot of [other detections](https://github.com/NodeSecure/js-x-ray#warnings-legends).

## Major release 4 and 5

These versions introduced changes on warnings (and we improved how we manage them in the codebase). We added new descriptors for each of them:

- i18n (for translation in [CI](https://github.com/NodeSecure/ci) or [CLI](https://github.com/NodeSecure/cli)).
- experimental
- severity (Information, Warning, Critical)

Those information are visible in the [NodeSecure CLI](https://github.com/NodeSecure/cli) interface:

![NodeSecure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0xjxew9sh7xm07wxhkef.png)

## Major release 6

🐬 Ok, let's dive into this major release to discover the surprises 🎉 it has in store for us.

### 🚀 Introducing VariableTracer

Almost a year of work on this [new mechanism / class](https://github.com/NodeSecure/estree-ast-utils/blob/main/src/utils/VariableTracer.js) that brings a whole new dimension to JS-X-Ray.

```js
const tracer = new VariableTracer()
  .enableDefaultTracing()
  .trace("crypto.createHash", {
    followConsecutiveAssignment: true, moduleName: "crypto"
  });

tracer.walk(node);
```

This class is able to follow all declarations, assignments and patterns (and those even through very obscure patterns). 

```js
const aA = Function.prototype.call;
const bB = require;

const crypto = aA.call(bB, bB, "crypto");
const cr = crypto.createHash;
cr("md5"); // weak-crypto warning is throw here
```

This allows us to implement Probes in a much simpler way (which makes maintenance and testing much easier).

Here an example with the `isWeakCrypto` probe:

```js
function validateNode(node, { tracer }) {
  const id = getCallExpressionIdentifier(node);
  if (id === null || !tracer.importedModules.has("crypto")) {
    return [false];
  }

  const data = tracer.getDataFromIdentifier(id);

  return [
    data !== null &&
    data.identifierOrMemberExpr === "crypto.createHash"
  ];
}
```

By default the Tracer follows all ways of `requiring` dependencies with CJS and also usage of `eval` or `Function`.


### 🚧 Removing unsafe-assign warning

This warning was required at the beginning of the project because it was difficult for me to correctly identify some malicious patterns.

![NodeSecure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wscxxpedjz513w9rtxds.png)

However, with the introduction of the new Tracer, which is very complete and precise, this warning no longer makes sense has it only generates unnecessary noise and false positives.

### 📜 Better ESM source parsing

We previously had a lot of `parsing-error` warnings because the NodeSecure scanner failed to detect if the file was using either CJS or ESM. 

That new version will automatically retry with ESM enabled if it fails with CJS.

### 📉 Reducing false positives

To continue the momentum of the previous sections. This version drops a lot of warnings and significantly improves others.

- Reducing false positives for `encoded-literal` warning by introducing new way of detecting safe values.
- Improve `short-identifiers` by also storing ClassDeclaration, MethodDefinition and Function parameters.

We are also introducing a new `suspicious-file` warning when a file contain more than 10 encoded-literal warnings to avoid having file with hundreds or thousands of warnings.

Of the **500** most popular NPM packages, we previously had **24k** warnings with version 5. The latest version brings that number down to approximatively **5k** warnings.

### 🔬 Improving coverage

A lot of work has been done to add unit tests on all the probes of the project. We are near 100% of coverage 💪.

![NodeSecure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/07uejv3fgthptaymwj5j.png)

Thanks to the amazing work of our contributors:

- [Vincent DHENNIN](https://github.com/Kawacrepe) - @kawacrepe
- [Pierre DEMAILLY](https://github.com/PierreDemailly)
- [Mathieu KA](https://www.linkedin.com/in/mathieu-kahlaoui-0887a1158/)
- [M4gie](https://github.com/M4gie)

## 👀 What's next ?

Here what I'm working for the next major release:

- Adding support of TypeScript sources (probably by allowing a customization of the parser).
- A new API that allows to dynamically extend the SAST with new custom probes (and custom warnings).
- Introducing new built-in detections and warnings (unsafe URL etc).

I will continue to work to reduce the number of false positives and keep improving obfuscated codes detection.

---

Please think to drop a star on [github](https://github.com/NodeSecure/js-x-ray) ❤️!

That's it for today! Thanks for reading me 😉
