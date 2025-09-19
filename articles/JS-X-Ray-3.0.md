---
title: JS-X-Ray 3.0
description: TBC
author: fraxken
date: 28/02/2021
---

Hello!

I have been working every night of the week on a new major version of my open-source JavaScript SAST [JS-X-Ray](https://github.com/fraxken/js-x-ray). I've been looking forward to making significant changes to the code for several months now...

# Why ?

Because I'm still learning every day and the project has grown quite large since 2.0.0. Also when I started the project I lacked a certain rigor in the way I documented the code (and also on some speculations).

It became necessary to make changes in order to continue to evolve the project.

# So what's new ?

## sec-literal

```bash
npm i sec-literal
```

I started to work on a [package](https://github.com/fraxken/sec-literal) to analyze ESTree Literals and JavaScript strings. This is a very important part that could be separated in its own package (which simplifies my documentation and testing).

Some of the features of this package:
- Detect Hexadecimal, Base64 and Unicode sequences.
- Detect patterns (prefix, suffix) on groups of identifiers.
- Detect suspicious string and return advanced metrics on it (with char diversity etc).

It's a start... I plan to extend the features of the package in the coming months (but also to re-invest some time in documentation and testing).

## new project structure

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/266m254j98n81l2tiofa.png)

Still very far from the perfection I imagine but it's a good start. The code had become messy and it was almost impossible to reason properly.

The new version is now much easier to maintain and evolve. I will surely continue to improve it for the next major release.

## More documentation, more tests

I took advantage of the refacto to reinsert a whole set of documentation and unit tests. It also allowed me to fix a number of issues that had not been resolved in version 2.3.

## Obfuscation detection is hard

I knew it! But I swear to you that it is much more complex than anyone can imagine. I had to rewind my steps several times.

But if there were no challenges it wouldn't be fun.

## ESM Import evaluation
Version 3 now throw an unsafe-import for import with javascript code evaluation.

```js
import 'data:text/javascript;base64,Y29uc29sZS5sb2coJ2hlbGxvIHdvcmxkJyk7Cg==';
```

For more info: https://2ality.com/2019/10/eval-via-import.html

# Conclusion

Nothing incredible for this new version. But the project continues to progress step by step and I hope to be able to add a whole bunch of new detections by the end of the year.

Best Regards,
Thomas
 