---
title: NodeSecure - The future
description: TBC
author: fraxken
date: 04/01/2021
---

Hello 👋

Today I'm writing to tell you about **the future of [NodeSecure](https://github.com/ES-Community/nsecure)** 👀.

I have not been very active in the last few months because of my job which has taken up a lot of my time. But I'm back 😊.

Moving forward and updating the project has become much more complicated 😵. **So it was time to announce and make major changes**.

## What is node-secure (or nsecure) ?
Node-secure is a CLI that will fetch and deeply analyze the dependency tree of a given npm package (Or a local project with a package.json) and output a .json file that will contains all metadata and flags about each packages.

The CLI is able to open the JSON and draw a Network of all dependencies (UI and emojis flags will help you to identify potential issues and security threats).

## 🏫 Creating an organization

NodeSecure is not only one tool anymore. The project is now a set of tools and packages that need to be maintained and extended. The project has also gained contributors on its way and many developers pushed me to go even further 🚀.

That's why I decided to **gather** these different projects in the **same github organization** (and same for **npm** with `@nodesecure`). It will also be easier to integrate new collaborators into the project.

The URL to our new home: https://github.com/NodeSecure

## 📋 Roadmap

Well, that's all very nice, but what is the objective in concrete terms? The goal is to release a version 1.0 with the following roadmap:

### Move all the packages in the org

- js-x-ray
- sec-literal
- size-satisfies
- npm-tarball-license-parser
- Migrating SlimIO/Security into the org and rename it **@nodesecure/report**.
- Rewriting [SlimIO/npm-registry](https://github.com/SlimIO/Npm-registry) from zero in the org (with [undici](https://github.com/nodejs/undici) as http client).

We will update these packages and they will use ESM by default.

### Split Nsecure into three parts

We will rewrite the Nsecure back-end logic into an independent package named **scanner**. The CLI and the UI will also be separated in two distinct packages.

We will focus our efforts initially **on the scanner**. The objective is above all to simplify maintenance by separating the project into minimal parts that can be more easily documented, evolved and tested.

This should also reduce the number of dependencies for tools that only want to use the scanner without the CLI and UI.

> ⚠️ We will update the current [nsecure](https://github.com/ES-Community/nsecure) package with the new components until the new version arrives.

### New UI

The NodeSecure web interface will be rewritten from scratch. This new project will use **[D3.js](https://d3js.org/)** to generate the network graph.

It will also be a good opportunity to discuss what we will use for the new interface.

## 👥 The team

I am pleased to announce that I am launching this initiative with [Tony Gorez](https://www.linkedin.com/in/tonygorez/) who, as you know, has contributed a lot to the project in recent months.

Several developers have indicated their intention to actively participate... so the team will grow very quickly.

This is just the beginning and you are welcome to join us if you want to contribute.

> 💬 We use Discord to communicate. My Discord tag fraxken#8064.

## Thanks ❤️

And that's it! A lot of work ahead for us. The new interface will certainly take a few months to be created so don't expect V1 anytime soon.

However those changes should allow us to release a 0.9 and 0.10 version very quickly in the coming weeks.

Best Regards,
Thomas
