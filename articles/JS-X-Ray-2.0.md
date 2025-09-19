---
title: NodeSecure v0.7.0 and v0.8.0@next
description: TBC
author: fraxken
date: 19/08/2020
---

Hello,

It's been a few weeks now that I've been working on a new major release for JS-X-Ray. This new version brings a lot of important changes including:

- New warnings names (I've taken the time to think of consistent names).
- New features to detect an obfuscated code (Still experimental though).
- New format for the SourceLocation (an array instead of the ESTree SourceLocation Object).
- Complete documentation for warnings (With explanations on technical implementation when necessary).
- Improvement of the code as a whole (it is much more maintainable).
- Improvement of unit tests.

The project is completely open-source and accessible on github: https://github.com/fraxken/js-x-ray (Remember to star 💖).

# What is JS-X-Ray?

I'll make a summary for the latecomers. (Also feel free to read the other articles in the series to better understand.)

JS-X-Ray is a free and open-source JavaScript/Node.js SAST scanner. It was mainly built to meet the needs of the [Node-secure](https://github.com/ES-Community/nsecure) project but gradually became independent.

The project as a whole analyzes JavaScript SourceCode on format AST (Abstract Syntax Tree) and provides a set of information on it including "security" warnings.

The goal is to quickly identify dangerous patterns (in the given code) for Developers and Security researchers. 

# For who ?

As previously mentioned, the project is currently being used as a dependency of other security projects  (Like Node-secure).

This tool is not magic and still requires basic security knowledge to tell the difference between a real problem and a false positive..

The target of the project is mainly security researchers as well as developers interested in the development of security tools.

# An example?

Let's take a look at one of the previous incidents in the ecosystem (npm). For example the event-stream incident where malicious codes are still accessible [here on badjs](https://badjs.org/posts/event-stream/).

We're going to run an analysis on the [Payload C](https://badjs.org/posts/event-stream/#heading-payload-c).

```js
const { runASTAnalysis } = require("js-x-ray");
const { readFileSync } = require("fs");
const { inspect } = require("util");

const log = (str) => console.log(inspect(str, { compact: false, colors: true }));
const code = readFileSync("./event-stream-payloadc.js", "utf-8");
log(runASTAnalysis(code));
```

```js
{
  dependencies: ASTDeps {
    dependencies: [Object: null prototype] {
      http: [Object],
      crypto: [Object],
      'bitcore-wallet-client/lib/credentials.js': [Object]
    }
  },
  warnings: [
    {
      kind: 'encoded-literal',
      value: '636f7061796170692e686f7374',
      location: [Array]
    },
    {
      kind: 'encoded-literal',
      value: '3131312e39302e3135312e313334',
      location: [Array]
    },
    {
      kind: 'short-identifiers',
      location: [Array],
      value: 1
    }
  ],
  idsLengthAvg: 1,
  stringScore: 0,
  isOneLineRequire: false
}
```

That's what JS-X-Ray return. We find the dependencies that were required within the script and some warnings:

- Two encoded literals.
- A warning telling us that identifiers in the code are too short (below an average of 1.5).

What might give us a clue here is the nature of the warnings and the used dependencies...Of course tools such as Node-secure will give you a much better view when the need is to analyse a complete project.

![](https://media.discordapp.net/attachments/605589188309680141/715966402393014313/unknown.png)

# Warnings

All warnings are explained on the README of the github. Advanced documentation on how they work and how they are implemented can be found [here](https://github.com/fraxken/js-x-ray/blob/master/WARNINGS.md).

| name | description |
| --- | --- |
| parsing-error | An error occured when parsing the JavaScript code with meriyah. It mean that the conversion from string to AST as failed. If you encounter such an error, **please open an issue**. |
| unsafe-import | Unable to follow an import (require, require.resolve) statement/expr. |
| unsafe-regex | A RegEx as been detected as unsafe and may be used for a ReDoS Attack. Under the hood we use the package **safe-regex**. |
| unsafe-stmt | Usage of dangerous statement like `eval()` or `Function("")`. |
| unsafe-assign | Assignment of a protected global like `process` or `require`. |
| encoded-literal | An encoded literal has been detected (it can be an hexa value, unicode sequence, base64 string etc) |
| short-identifiers | This mean that all identifiers has an average length below 1.5. Only possible if the file contains more than 5 identifiers. |
| suspicious-literal | This mean that the sum of suspicious score of all Literals is bigger than 3. |
| obfuscated-code (**experimental**) | There's a very high probability that the code is obfuscated... |

## unsafe-import

What do we mean when it is impossible to follow an expression or statement? Let's take the following example:

```js
function boo() {
  // something is going on here!
}

require(boo());
```

Here the analysis is not able to follow because it would be too painful and time consuming to know what the function really returns.

## unsafe-assign

A fairly common pattern among hackers is to assign global variables to new variables to hide the use of a require or eval. JS-X-Ray is able to trace the use of these variables and will consider this pattern as dangerous.

Example:

```js
const g = global.process;
const r = g.mainModule;
const c = r.require;
c("http");
r.require("fs");
```

## obfuscated-code
He's the new kid. However the results are not yet perfect and a lot of work will be necessary in the coming months to allow the detection of more obfuscated codes.

- [One of my recent tweet on this feature](https://twitter.com/fraxken/status/1290850085442670593/photo/1). 
- [The Google Drive document on JavaScript obfuscated patterns](https://docs.google.com/document/d/11ZrfW0bDQ-kd7Gr_Ixqyk8p3TGvxckmhFH3Z8dFoPhY/edit?usp=sharing).

# On the future
I wish I could iterate over the entire npm registry. I think that this project could provide us valuable insight on packages and maybe even prevent a lot of malicious code to reach npm users.

This is already what I do personally with Node-secure which allows me to secure and improve the [SlimIO](https://github.com/SlimIO) solution.

Beyond the security aspect, this project allows to detect and understand the use of a set of bad patterns/practices. We could also eventually guide and prevent these practices to improve the ecosystem as a whole.

At the moment I'm investing my free time to work on this project... But I would obviously like to invest myself professionally in it!

# Conclusion

There's still a lot of work to be done. One of the blocking points I'm encountering at the moment is the analysis of common patterns in identifiers (which can be diverse and varied depending on the generation method).

The current version is not yet implemented on Node-secure and it might take a few weeks (I'm a bit too busy at the moment).

Hope you enjoy this article to keep you up to date with the developments and progress I have made!

Thank you for reading this series and see you soon for an article on Node-secure :)

Best Regards,
Thomas
