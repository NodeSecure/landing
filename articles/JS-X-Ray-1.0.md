---
title: JS-X-Ray 1.0
description: TBC
author: fraxken
date: 30/03/2020
---

Hi,

While I was working on the next release (0.6.0) of [Node-Secure](https://github.com/ES-Community/nsecure) I thought that the AST analysis was getting bigger and bigger (and much more complicated too).

That's why I decided to separate all the analysis from the Node-secure project to allow easier maintenance and future enhancement. This also allows other projects to use my package if they need to!

https://github.com/fraxken/js-x-ray

This is how **JS-X-RAY** was born. I have chosen the word x-ray because in games this is often a feature that allow to see through the walls, I like to imagine my analysis as being able to see through the most common techniques (obfuscation, etc.).

# The goal

One of the primary goals of this package is to be able to find any required Node.js dependencies in a given code. If the analysis is not able to follow a require statement then an **unsafe-import** warning will be throw.

The more time goes and the more I think to make my code generic to also detect patterns specific to the front.

So I think the code will evolve in this direction :) 

# Example
---

**Purescript**
---

Take the [purescript-installer incident](https://badjs.org/posts/purescript-installer/) and specially the corrupted [rate-map code](https://badjs.org/posts/purescript-installer/#heading-compromised-version-of-rate-map).

> One of the objectives of node-secure is to be able to quickly identify code with warnings and give a bunch of very useful informations to the developer.

In this case node-secure was able to detect the following dependencies:
`append-type`, `fs`, `dl-tar`.

```js
const px = require.resolve(
Buffer.from([100, 108, 45, 116, 97, 114]).toString()
);
```

My AST analysis has detected a Buffer.from and as converted the value to `dl-tar` itself. In this case an **unsafe-import** will be throw with the file name and the Source Location.

---
**Event-stream**
---

Take the [Payload A](https://badjs.org/posts/event-stream/) in the event-stream incident.

So what's going on here?
- 1) assign of process and require into new variables.
- 2) hexa value.
- 3) code obfuscated (all identifiers have a length of 1).

I'm working on a bench of experimental analysis and warnings to be able to detect similar cases to event-stream incident.

```json
[
  {
    "kind": "unsafe-assign",
    "start": { "line": 3, "column": 12 },
    "end": { "line": 3, "column": 23 },
    "value": "require"      
  },
  {
    "kind": "unsafe-assign",
    "start": { "line": 4, "column": 12 },
    "end": { "line": 4, "column": 23 },
    "value": "process"
  },
  {
    "kind": "hexa-value",
    "start": { "line": 9, "column": 20 },
    "end": { "line": 9, "column": 44 },
    "value": "./test/data"
  },
  {
    "kind": "short-ids",
    "start": { "line": 0, "column": 0 },
    "end": { "line": 0,"column": 0 },
    "value": 1
  }
]
```

However, A lot of packages may be detected as false positives (even if it's always better than nothing 😅). It will surely take time to discover and improve these parameters.

# Conclusion

Still a LOT of work has to be done to be able to achieve an accurate analysis. Right now the analysis is capable of gathering a whole of very useful information (unsafe-regex, unused and missing dependencies etc.).

I am always very excited to experience new warnings because they can detect patterns and errors that are often (un)common. Step by step they also lead me to a better understanding of the most dangerous patterns of the ecosystem.

> For example **90%+ of the false positive** are always generated because of files that was not mean to be published on the npm registry (tests, coverage files, etc.).

Thanks for reading!

Best Regards,
Thomas
