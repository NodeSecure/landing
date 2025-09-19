---
title: NodeSecure v0.8.0
description: TBC
author: fraxken
date: 21/02/2021
---

Hello,

It's been a while since I've had the opportunity to write an article here (Slightly less free time for open-source at the moment).

Today I released the version 0.8.0 of Node-secure (not a pre-release this time).

Let's dive directly into what's new since the last article;

# JS-X-Ray 2.3.0

A lot of improvement has been made on the static analysis. The number of "encoded-literals" warnings has been reduced by **50%**!

The analysis is also capable to detect [Morse code](https://www.bleepingcomputer.com/news/security/new-phishing-attack-uses-morse-code-to-hide-malicious-urls/) 😆 (not a joke).
![](https://cdn.discordapp.com/attachments/605589188309680141/812779263496290314/unknown.png)

# Verify command on a local project

It is now possible to run the verify command on a local project. You just have to omit the package name (as for the auto command).

```bash
$ nsecure verify
```

# Search packages by size

The search bar now allows you to filter packages by their size. Example with express:

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wfqsdyx5187zb4dtcwhz.png)

Under the hood it use a package i created: [size-satisfies](https://github.com/fraxken/size-satisfies)

# Inspect and show warning code

This new version add an "inspect" column to the warnings popup. If you make a click it will load and display the code in a little block.

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ntxxzz8d2xcws9a64ccp.png)

> Thanks to tony for his work on the feature. It took us several weeks to get a result we were happy with.

# Replacing webpack with esbuild

The UI build with esbuild instead of webpack. Now the build is done in about 200ms and we have removed all dependencies related to webpack.

# New flag for native addons 🐲

We added the flag hasNativeCode 🐲 if the package contains anything related to a native addon:

- .c, .cpp, .gyp file extensions
- a dependency known to be useful for native addon (node-gyp, node-addon-api, prebuildify... things like this).
- "gypfile" property is true in the package.json

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lqdw5au64s6oiowg96z5.png)

# Summary command

A new "beta" command we added to show a summary for a given Nsecure JSON payload (as we do in the interface).

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mvqch6bvsuw5pu4r6vap.png)

> Thanks again to tony who worked on the feature. ⚠️ There are still missing elements that will certainly be added in the next version.

The github issue is available [here](https://github.com/ES-Community/nsecure/issues/60).

# Other contributions

- Global warnings are now also displayed at CLI runtime so that they don't go unnoticed.
- Global warnings are also part of the i18n.
- Use Github actions instead of Travis.
- Add the version of Node-secure in the JSON payload.
- Enhance flags description (HTML).

Thanks to [Tony](https://github.com/tony-go), [Targos](https://github.com/targos), [Mickeal](https://github.com/CroquetMickael) and [kecsou](https://github.com/kecsou) for all the contributions.

Release available [here](https://github.com/ES-Community/nsecure/releases).

# What's next ?

- Adding support for Snyk and Npm audit to detect and fetch CVE.
- Taking into account the compatibility of the version when loading the json - [PR open by Tony](https://github.com/ES-Community/nsecure/pull/71).
- Rework part of the UI with web component (i'm already working on a POC).
- Use D3.js instead of Vis.js (no POC on how we will do this yet).
- Working a lot to enhance JS-X-Ray and the static analysis.

If you think you have ideas don't hesitate to come talk and contribute.

# Conclusion

A version that took a long time to be published but in the end I am still satisfied with the progress made. 

Thanks for reading!

Best Regards,
Thomas
