---
title: A technical tale of NodeSecure - Chapter 2
description: TBC
author: fraxken
date: 06/06/2022
---

Hello 👋,

I'm back at writing for a new technical article on [NodeSecure](https://github.com/NodeSecure). This time I want to focus on the SAST [JS-X-Ray](https://github.com/NodeSecure/js-x-ray) 🔬.

I realized very recently that the project on Github was already more than two years old. It's amazing how time flies 😵.

It's been a long time since I wanted to share my experience and feelings about AST analysis. So let's jump in 😉

## 💃 How it started

When I started the NodeSecure project I had almost no experience 🐤 with AST (Abstract Syntax Tree). My first time was on the [SlimIO](https://github.com/SlimIO) project to generate codes dynamically with the [astring](https://www.npmjs.com/package/astring) package (and I had also looked at the [ESTree](https://github.com/estree/estree) specification).

One of my first goals for my tool was to be able to retrieve the dependencies in each JavaScript file contained within an NPM tarball (By this I mean able to retrieve any dependencies imported in CJS or ESM). 

I started the subject a bit naively 😏 and very quickly I set myself a challenge to achieve with my AST analyser:

```js
function unhex(r) {
   return Buffer.from(r, "hex").toString();
}

const g = Function("return this")();
const p = g["pro" + "cess"];

const evil = p["mainMod" + "ule"][unhex("72657175697265")];
evil(unhex("68747470")).request
```

The goal is to be able to output accurate information for the above code. At the time I didn't really know what I was getting into 😂 (But I was passionate about it and I remain excited about it today).

> I thank [Targos](https://twitter.com/targos89) who at the time submitted a lot of code and ideas.

To date the SAST is able to follow this kind of code without any difficulties 😎... But it wasn't always that simple.

## 🐤 Baby steps

One of the first things I learned was to browse the tree. Even for me today this seems rather obvious, but it wasn't necessarily so at the time 😅.

I discovered the package [estree-walker](https://github.com/Rich-Harris/estree-walker#readme) from Rich Harris which was compatible with the [EStree](https://github.com/estree/estree) spec. Combined with the [meriyah](https://github.com/meriyah/meriyah) package this allows me to convert a JavaScript source into an ESTree compliant AST.

```ts
import { readFile } from "node:fs/promises";

import { walk } from "estree-walker";
import * as meriyah from "meriyah";

export async function scanFile(location: string) {
  const strToAnalyze = await readFile(location, "utf-8");

  const { body } = meriyah.parseScript(strToAnalyze, {
    next: true, loc: true, raw: true, module: true
  });

  walk(body, {
    enter(node) {
      // Skip the root of the AST.
      if (Array.isArray(node)) {
        return;
      }

      // DO THE WORK HERE
    }
  });
}
```

I also quickly became familiar with the tool [ASTExplorer](https://astexplorer.net/) which allows you to analyze the tree and properties for a specific code.

![nodesecure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jl41utklnepxf154tvlp.png)

As a beginner, you can be quickly scared by the size and complexity of an AST. This tool is super important to better cut out and focus on what is important.

> I also had fun [re-implementing](https://github.com/fraxken/Node-Estree) the ESTree Specification in TypeScript. It helped me a lot to be more confident and comfortable with different concepts that were unknown to me until then.

At the beginning of 2021 I also had the opportunity to do a talk for the French JS community (it's one more opportunity to study).

{% youtube zSYrEbggqWA %}

## 😫 MemberExpression

JavaScript member expression can be quite complicated to deal with at first. You must be comfortable with recursion and be ready to face a lot of possibilities.

Here is an example of possible code:
```js
const myVar = "test";
foo.bar["hel" + "lo"].test[myVar]();
```

![nodesecure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vp3f2ls3eshnlml3xdv0.png)
 
Computed property, Binary expression, Call expression etc. The order in which the tree is built seemed unintuitive to me at first (and I had a hard time figuring out how to use the `object` and `property` properties).

Since i created my own set of AST utilities including [getMemberExpressionIdentifier](https://github.com/NodeSecure/estree-ast-utils/blob/main/src/getMemberExpressionIdentifier.js).

## 🚀 A new package (with its own API)

When NodeSecure was a single project the AST analysis was at most a [few hundred lines in two or three JavaScript files](https://github.com/NodeSecure/cli/blob/60b52b1a60f9ac2ddc85f3cbad009adad590e56a/src/ast/index.js). All the logic was coded with if and else conditions directly in the walker 🙈.

![nodesecure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rn9hoqpzqvzjgzwe4m91.png)
 
To evolve and maintain the project, it became necessary to separate the code and make it a standalone package with its own API 👀.

I wrote an article at the time that **I invite you to read**. It contains some nice little explanations:
{% link https://dev.to/fraxken/node-secure-js-x-ray-4jk0 %}

The thing to remember here is that you probably shouldn't be afraid to start small and grow into something bigger later. Stay pragmatic.

## Easy to write, hard to scale 😭

It's easy to write a little prototype, but it's really hard to make it scale when you have to handle dozens or hundreds of possibilities. It requires a mastery and understanding of the language that is just crazy 😵. This is really what makes creating a SAST a complicated task.

For example, do you know how many possibilities there are to require on Node.js? In CJS alone:
- require
- process.mainModule.require
- require.main.require

> I probably forget some 😈 (as a precaution I also trace methods like require.resolve).

But as far as I'm concerned, it's really what I find exciting 😍. I've learned so much in three years. All this also allowed me to approach the language from an angle that I had never experienced or seen 👀.

### Probes

On JS-X-Ray I brought the notion of "probe" into the code which will collect information on one or more specific node. The goal is to separate the AST analysis into lots of smaller pieces that are easier to understand, document and test.

> Very far from perfection 😞. However, it is much better than before and the team is now helping me to improve all this (by adding documentation and tests).

It was for JS-X-Ray 3.0.0 and at the time i have written the following article (which includes many more details if you are interested).
{% link https://dev.to/fraxken/js-x-ray-3-0-0-3ddn %}

### VariableTracer
This is one of the [new killer feature](https://github.com/NodeSecure/estree-ast-utils/blob/main/src/utils/VariableTracer.js) coming to JS-X-Ray soon. A code able to follow the declarations, assignment, destructuration, importating of any identifiers or member expression.

In my experience being able to keep track of assignments has been one of the most complex tasks (and I've struggled with it).

This new implementation/API will offer a new spectrum of tools to develop really cool new features.

```js
const tracer = new VariableTracer().trace("crypto.createHash", {
  followConsecutiveAssignment: true
});

// Use this in the tree walker
tracer.walk(node);
```

This simple code will allow us, for example, to know each time the method createHash is used. We can use this for information purposes, for example to warn on the usage of a deprecated hash algorithm like md5.

Here an example:
```js
const myModule = require("crypto");

const myMethodName = "createHash";
const callMe = myModule[myMethodName];
callMe("md5");
```

> The goal is not necessarily to track or read malicious code. The idea is to handle enough cases because developers use JavaScript in many ways.

We can imagine and implement a lot of new scenarios without worries 😍.

By default we are tracing:
- eval and Function
- require, require.resolve, require.main, require.mainModule.require
- Global variables (global, globalThis, root, GLOBAL, window).

## ✨ Conclusion

Unfortunately, I could not cover everything as the subject is so vast. One piece of advice I would give to anyone starting out on a similar topic would be to be much more rigorous about documentation and testing. It can be very easy to get lost and not know why we made a choice X or Y.

Thanks for reading this new technical article. See you soon for a new article (something tells me that it will arrive soon 😏).

