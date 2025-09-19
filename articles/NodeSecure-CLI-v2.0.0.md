---
title: NodeSecure CLI v2.0.0
description: TBC
author: fraxken
date: 29/06/2022
---


Hello 👋,

I am writing this article with excitement and after several months of work. With the [core team](https://github.com/NodeSecure/Governance#team) we are thrilled to announce that we are publishing a **new version** of the UI.🚀.

As you are reading these lines I am probably under the sun ☀️ of Tel Aviv for the [NodeTLV](https://www.nodetlv.com/) conference where I will give a talk about **NodeSecure** and some other tools.

![NodeSecure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3wspz0krx3g44jicz6v6.JPG) 
 
What an incredible journey 😍. Four years ago I was working on my tool alone 😥... But now more than a dozen developers are contributing to the project and I can only thank all of you for your precious support 🙏.

If you are new, then let me introduce you to the project

## 🐤 Getting started with NodeSecure
NodeSecure is an organization gathering a lot of individual projects that will allow you to improve the **security** and **quality** of your projects 💪. With our tools you can **visually** discover the dependencies you use on a daily basis and **learn** more about them 📚.

Our most notable project is:
{% github NodeSecure/cli %}

How can you use it? It's easy, you just have to install globally the CLI with npm:
```bash
$ npm i @nodesecure/cli -g

# Analyze a remote package on the NPM Registry.
# Note: also work with a private registry like gitlab or verdaccio
$ nsecure auto fastify

# Analyze a local manifest (or local project).
# -> omit the package name to run it at the cwd.
$ cd /myproject
$ nsecure auto
```

We have many other projects and [many opportunities](https://github.com/orgs/NodeSecure/projects/2/views/1?filterQuery=label%3A%22good+first+issue%22) for you to contribute. [Feel free to join us on Discord to discuss](https://github.com/NodeSecure/Governance/blob/main/guides/contributor-en.md).

## 👀 What's changed in v2.0.0 ?

A lot to be honest 😆. Our initial idea was simply to improve and complete the interface (We went a bit overboard I guess 😅).

One of the things that became problematic was the lack of space in the interface 😨. So we had to completely redesign the UX. I have to thank [Medhi Bouchard](https://www.linkedin.com/in/mehdi-bouchard/), who spent dozens of hours designing UI on figma (Without him all this would have been much more difficult to achieve 💪).

### Multiple views
This new interface offers several distinct views:
- **Home** (global informations about the project you asked to analyze).
- **Network** (where we are drawing the dependency tree).
- **Settings** (which allows you to customize your experience with the tool)

> **Note**: It is also possible to switch between each view with a keyboard shortcut (which corresponds to the capitalized character).

### Home view

The home view is a replacement for the old `Global stats` button. We have been working to bring more attention to the information.

![NodeSecure UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tk892c9ocf8de9poqduf.PNG)

To summarize the information we find in this view;
- Global stats on the project (direct vs indirect, size, downloads)
- Licenses and Extensions
- Authors
- Global warnings (not visible in the screenshot since there is none).
- Links to Github and NPM.

![NodeSecure UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k5m1fkg4f5zlf2xbgyum.png)
 
We plan to expand this view with even more information and really cool gadgets. We also want to bring more attention and information around the creators and maintainers.

### 🔧 Settings view
This is the new kid in the town. There is not much to customize yet but that will come with time.

![NodeSecure UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tqarzdl92u1p6cf5268z.png)

One of the key ideas of NodeSecure is that each developer and maintainer can customize their experience with the tool.

> Some of our warnings have a lot of false positives that is real, so you will be able to ignore them if you don't find them relevant.

Eventually the options will allow to make more clear-cut decisions like tagging a maintainer's library (which will be useful during incidents like the one with `Faker.js` or `node-ipc`).

### 🌎 Network view

We have slightly improved the network view and updated the colors for something more pleasant.

In version [1.4.0 of our Vis-network](https://github.com/NodeSecure/vis-network/releases/tag/v1.4.0) implementation, we have also implemented different theme for parent and child nodes (What you can see in the screenshot below).

![NodeSecure UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kbgwnevxd152hdz6rg8m.png)

> **Note**: We have not abandoned the "Dark" theme. Eventually it will be possible to switch from a light to a dark theme in the settings.

### 🚀 New left pannel
We wanted to keep the spirit of the old interface where we could retrieve information about a package very quickly. However we want to avoid as much as possible the need to scroll to get the information.

No more popup 💃. All information is now directly accessible in this new panel.

![NodeSecure UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/judw5hs384em1zcws0f5.png)

This new design is divided into the following sub-panels:
- Overview (Package informations, github stats, etc).
- Files and size (with bundlephobia).
- Scripts and Dependencies.
- Threats and issues in JavaScript source.
- Vulnerabilities.
- Licenses conformance (SPDX).
 
There is also much more information than before. For example, I've been wanting to implement vulnerabilities in the interface for two years and it's now done:

![NodeSecure vulnerabilities](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a3t9ucd7s18r24i3vqxm.png)
> **Note**: I remind you that we support multiple strategy for vulnerabilities like [Sonatype](https://www.sonatype.com/?smtNoRedir=1) or [Snyk](https://snyk.io/).

#### Scripts

This new version allows you to consult the scripts of a package. Really cool combined with the 📦 hasScript flag. Most supply chain attack uses a malicious script ... so it became important for us to be able to consult them in the UI.

![NodeSecure scripts](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/goeixyvdq7jym4pbt4sp.png)

#### Threats in source code

This version implements the latest release of JS-X-Ray which includes new features;

- Detecting weak crypto algorithm (md5, sha1 ...).
- Warnings now have a level of severity (like vulnerabilities).

![NodeSecure UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/adl4ge6u60js1nrbkiel.png)
 
There is still a lot of work to be done on the interface, especially to better visualize the faulty code. You will notice that the links to access NPM and Unpkg are now always present in the header.
 
#### Licenses conformance

The information is still the same, but the design is a little more enjoyable. We have also added a small tooltip if you want to know more about SPDX.

![NodeSecure SPDX](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1b3hyjff9ebiwj1uuenq.png)

The title and file name are clickable. The first one will open the license page on the SPDX website and the second one the file itself on unpkg.

#### Others

We have slightly improved the short descriptions of the flags and they are now clickable (this will open the wiki directly to the relevant flag).

![NodeSecure UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ixmeu1439x3od874cl3b.png)

---

Also in the `scripts & dependencies` section you will find a show/hide button on the third-party dependencies.

![NodeSecure UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cje8dlyb26ex0pkpy6ys.png)

Still the same behavior as in the old version, it will hide in the network all the children of the package.

### New documentation/wiki

We have developed a [brand new documentation-ui module](https://github.com/NodeSecure/documentation-ui) that allows us to implement a wiki on any of our projects.

In this new version you can open the wiki by clicking on the button with the book icon on the right side of the screen. We now also have documentation on the warnings of our static analyzer [JS-X-RAY](https://github.com/NodeSecure/js-x-ray) accessible in the `SAST Warnings` pannel of the wiki.

![NodeSecure wiki](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ib5updz7sfmgr64yuen6.png)

## 👯 Credits

All this work is possible thanks to the different contributors and contributions they made those last few months.

- [Tony Gorez](https://twitter.com/tonygo_)
- [Vincent Dhennin](https://www.linkedin.com/in/vincentdhennin/)
- [Antoine Coulon](https://www.linkedin.com/in/vincentdhennin/)
- [Medhi Bouchard](https://github.com/im-codebreaker)
- [Mathieu Kahlaoui](https://www.linkedin.com/in/mathieu-kahlaoui-0887a1158/)
- [Blandine Rondel](https://www.linkedin.com/in/blandine-r-733b34a9/)
- [Pierre demailly](https://www.linkedin.com/in/pierre-demailly/)
- [Nicolas Hallaert](https://www.linkedin.com/in/nicolas-hallaert/)
- [Mikael Wawrziczny](https://www.linkedin.com/in/mikael-w/)
- [Maksim Balabash](https://github.com/mbalabash)

Their simple presence, good mood and spirit were a source of inspiration and motivation for me. Thanks you very much ❤️

## Conclusion

As always we move forward and evolve. We continue to work hard to improve security in the JavaScript ecosystem and we look forward to being joined by other developers with the same commitment.

Thanks for reading me and see you soon for another great story!
